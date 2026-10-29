/** Identifiant App Store de Banco (eas.json → submit.production.ios.ascAppId). */
export const APP_STORE_ID = '6821200817';
export const APP_STORE_URL = `itms-apps://apps.apple.com/app/id${APP_STORE_ID}`;

const LOOKUP_URL = `https://itunes.apple.com/lookup?id=${APP_STORE_ID}`;
const LOOKUP_TIMEOUT_MS = 5000;

/** true si `latest` (ex. « 1.10.0 ») est strictement plus récente que `current` (ex. « 1.9.2 »). */
export function isNewerVersion(latest: string, current: string): boolean {
  const parse = (v: string) => v.trim().split('.').map((n) => Number.parseInt(n, 10) || 0);
  const a = parse(latest);
  const b = parse(current);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0);
    if (diff !== 0) return diff > 0;
  }
  return false;
}

/**
 * Dernière version publiée sur l'App Store, ou null (hors ligne, app absente de la boutique du pays…).
 * Ne lève jamais d'erreur : sans réponse fiable, on ne dérange pas le joueur.
 */
export async function fetchStoreVersion(): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LOOKUP_TIMEOUT_MS);
  try {
    const response = await fetch(LOOKUP_URL, { signal: controller.signal, cache: 'no-store' });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    const version = (data as { results?: { version?: unknown }[] })?.results?.[0]?.version;
    return typeof version === 'string' && /^\d+(\.\d+)*$/.test(version) ? version : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
