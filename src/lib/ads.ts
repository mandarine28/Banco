import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';
import type * as GoogleMobileAds from 'react-native-google-mobile-ads';

import { AD_UNIT_IDS, type AdPlacement } from '@/config/ads';

/** Issue d'une demande de vidéo récompensée. */
export type RewardedResult = 'rewarded' | 'dismissed' | 'unavailable';

/** Règle Banco : pas de pub disponible → on ne frustre pas le joueur, la récompense est offerte. */
export const isRewardGranted = (result: RewardedResult) => result !== 'dismissed';

/** Au-delà, on renonce à la vidéo plutôt que de bloquer le joueur. */
const REWARDED_LOAD_TIMEOUT_MS = 8000;

function warn(message: string, error?: unknown) {
  if (__DEV__) console.warn(`[ads] ${message}`, error ?? '');
}

// Module natif absent dans Expo Go et sur le web : jamais de plantage, simplement pas de pub.
// Dans Expo Go on ne tente même pas le require : son échec s'affichait en erreur à l'écran.
const IS_EXPO_GO = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
let adsModule: typeof GoogleMobileAds | null | undefined;
function getAds(): typeof GoogleMobileAds | null {
  if (adsModule !== undefined) return adsModule;
  if (Platform.OS === 'web' || IS_EXPO_GO) {
    adsModule = null;
    return adsModule;
  }
  try {
    adsModule = require('react-native-google-mobile-ads') as typeof GoogleMobileAds;
  } catch (e) {
    warn('module publicitaire indisponible', e);
    adsModule = null;
  }
  return adsModule;
}

function unitId(ads: typeof GoogleMobileAds, placement: AdPlacement): string | null {
  if (__DEV__) return placement === 'rewardedTrial' ? ads.TestIds.REWARDED : ads.TestIds.INTERSTITIAL;
  const id = Platform.OS === 'ios' ? AD_UNIT_IDS[placement].ios : AD_UNIT_IDS[placement].android;
  return id || null;
}

let started: Promise<boolean> | null = null;

/**
 * Consentement (RGPD, et fenêtre de suivi Apple si configurée dans AdMob) puis démarrage du SDK.
 * Une seule fois par lancement ; renvoie false si aucune pub ne peut être demandée.
 */
export function initAds(): Promise<boolean> {
  started ??= startAds();
  return started;
}

async function startAds(): Promise<boolean> {
  const ads = getAds();
  if (!ads) return false;
  try {
    await ads.AdsConsent.gatherConsent();
  } catch (e) {
    // Recommandation Google : tenter quand même, le consentement d'une session précédente peut suffire
    warn('consentement impossible', e);
  }
  try {
    const { canRequestAds } = await ads.AdsConsent.getConsentInfo();
    if (!canRequestAds) return false;
    await ads.default().initialize();
    return true;
  } catch (e) {
    warn('démarrage impossible', e);
    return false;
  }
}

/** Affiche une vidéo récompensée ; 'unavailable' si aucune pub n'a pu être chargée à temps. */
export async function showRewardedAd(): Promise<RewardedResult> {
  const ads = getAds();
  const id = ads && unitId(ads, 'rewardedTrial');
  if (!ads || !id || !(await initAds())) return 'unavailable';

  return new Promise((resolve) => {
    const ad = ads.RewardedAd.createForAdRequest(id);
    const unsubscribers: (() => void)[] = [];
    let earned = false;
    let settled = false;
    const finish = (result: RewardedResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      resolve(result);
    };
    const timer = setTimeout(() => finish('unavailable'), REWARDED_LOAD_TIMEOUT_MS);

    unsubscribers.push(
      ad.addAdEventListener(ads.RewardedAdEventType.LOADED, () => {
        clearTimeout(timer);
        ad.show().catch(() => finish('unavailable'));
      }),
      ad.addAdEventListener(ads.RewardedAdEventType.EARNED_REWARD, () => {
        earned = true;
      }),
      ad.addAdEventListener(ads.AdEventType.CLOSED, () => finish(earned ? 'rewarded' : 'dismissed')),
      ad.addAdEventListener(ads.AdEventType.ERROR, (error) => {
        warn('vidéo récompensée indisponible', error);
        finish('unavailable');
      }),
    );
    ad.load();
  });
}

type LoadedInterstitial = { show: () => Promise<void> };
let interstitial: LoadedInterstitial | null = null;

/** Charge l'interstitiel de fin de partie à l'avance, pour l'afficher sans attente en quittant l'écran final. */
export async function preloadInterstitial(): Promise<void> {
  const ads = getAds();
  const id = ads && unitId(ads, 'endGameInterstitial');
  if (!ads || !id || interstitial || !(await initAds())) return;

  const ad = ads.InterstitialAd.createForAdRequest(id);
  const offLoaded = ad.addAdEventListener(ads.AdEventType.LOADED, () => {
    offLoaded();
    interstitial = {
      show: () =>
        new Promise<void>((resolve) => {
          const done = () => {
            offClosed();
            offError();
            resolve();
          };
          const offClosed = ad.addAdEventListener(ads.AdEventType.CLOSED, done);
          const offError = ad.addAdEventListener(ads.AdEventType.ERROR, done);
          ad.show().catch(done);
        }),
    };
  });
  ad.load();
}

/** Affiche l'interstitiel s'il est prêt ; se résout à sa fermeture (tout de suite s'il n'y en a pas). */
export async function showInterstitial(): Promise<void> {
  const ready = interstitial;
  interstitial = null;
  if (ready) await ready.show();
}

/** Lien « Choix publicitaires » des Réglages : obligatoire quand le consentement RGPD s'applique. */
export async function canEditAdChoices(): Promise<boolean> {
  const ads = getAds();
  if (!ads || !(await initAds().catch(() => false))) return false;
  try {
    const { privacyOptionsRequirementStatus } = await ads.AdsConsent.getConsentInfo();
    return privacyOptionsRequirementStatus === ads.AdsConsentPrivacyOptionsRequirementStatus.REQUIRED;
  } catch {
    return false;
  }
}

export async function editAdChoices(): Promise<void> {
  try {
    await getAds()?.AdsConsent.showPrivacyOptionsForm();
  } catch (e) {
    warn('fenêtre des choix publicitaires impossible', e);
  }
}
