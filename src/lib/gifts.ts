import { supabase } from './supabase';

export type GiftKind = 'welcome' | 'share';
export type GiftError = 'already_claimed' | 'failed';

export class GiftClaimError extends Error {
  constructor(readonly reason: GiftError) {
    super(reason);
  }
}

/** Cadeaux déjà récupérés par le compte connecté (lecture protégée par RLS). */
export async function fetchClaimedGifts(): Promise<Set<GiftKind>> {
  const { data, error } = await supabase.from('gifts').select('kind');
  if (error) throw error;
  return new Set((data ?? []).map((row: { kind: GiftKind }) => row.kind));
}

/** Demande au serveur d'offrir le pack (fonction claim-gift, qui détient la clé RevenueCat). */
export async function claimGift(kind: GiftKind, productId: string): Promise<void> {
  const { error } = await supabase.functions.invoke('claim-gift', { body: { kind, productId } });
  if (!error) return;
  const status = (error as { context?: { status?: number } }).context?.status;
  throw new GiftClaimError(status === 409 ? 'already_claimed' : 'failed');
}
