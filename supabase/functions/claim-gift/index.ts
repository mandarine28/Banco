// Offre un pack (droit promotionnel RevenueCat, à vie) au joueur connecté, une seule fois par type de cadeau.
// Secrets requis : REVENUECAT_SECRET_KEY (clé secrète v1). SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont fournis par Supabase.
import { createClient } from 'jsr:@supabase/supabase-js@2';

const GIFT_KINDS = ['welcome', 'share'];

// Packs pouvant être offerts → droit RevenueCat. À garder aligné avec src/config/shop.ts (PACK_THEME_IDS, ENTITLEMENT_IDS).
const GIFTABLE_ENTITLEMENTS: Record<string, string> = {
  packHarryPotter: 'pack_harry_potter',
};

// « À vie » : l'API v1 attend une date de fin ; on la place très loin.
const FOREVER_MS = Date.UTC(2100, 0, 1);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const rcKey = Deno.env.get('REVENUECAT_SECRET_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!rcKey || !supabaseUrl || !serviceKey) {
    console.error('claim-gift: secret manquant');
    return json({ error: 'server_config' }, 500);
  }

  const token = req.headers.get('Authorization')?.replace(/^Bearer /, '');
  if (!token) return json({ error: 'unauthorized' }, 401);

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: userData, error: userError } = await admin.auth.getUser(token);
  const user = userData?.user;
  if (userError || !user) return json({ error: 'unauthorized' }, 401);

  let body: { kind?: unknown; productId?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid_request' }, 400);
  }
  const { kind, productId } = body;
  if (
    typeof kind !== 'string' ||
    !GIFT_KINDS.includes(kind) ||
    typeof productId !== 'string' ||
    !Object.hasOwn(GIFTABLE_ENTITLEMENTS, productId)
  ) {
    return json({ error: 'invalid_request' }, 400);
  }

  // Réserve le cadeau d'abord : la clé primaire (user_id, kind) empêche tout doublon, même en cas de double appel.
  const { error: insertError } = await admin.from('gifts').insert({ user_id: user.id, kind, product_id: productId });
  if (insertError) {
    if (insertError.code === '23505') return json({ error: 'already_claimed' }, 409);
    console.error('claim-gift: insertion impossible', insertError);
    return json({ error: 'server_error' }, 500);
  }

  // L'app identifie le joueur auprès de RevenueCat avec son id Supabase (Purchases.logIn(user.id)).
  const entitlement = GIFTABLE_ENTITLEMENTS[productId];
  const res = await fetch(
    `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(user.id)}/entitlements/${entitlement}/promotional`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${rcKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ end_time_ms: FOREVER_MS }),
    },
  );
  if (!res.ok) {
    // Échec RevenueCat : on libère la réservation pour que le joueur puisse réessayer.
    console.error('claim-gift: RevenueCat', res.status, await res.text());
    await admin.from('gifts').delete().match({ user_id: user.id, kind });
    return json({ error: 'grant_failed' }, 502);
  }

  return json({ ok: true });
});
