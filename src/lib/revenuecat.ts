import { NativeModules, Platform } from 'react-native';
import type { CustomerInfo } from 'react-native-purchases';

import type { ProductId } from '@/config/shop';

// RevenueCat requires a native dev-client build — absent in Expo Go
export const isRevenueCatAvailable = !!NativeModules.RNPurchases;

export const ENTITLEMENT_IDS: Record<ProductId, string> = {
  streak: 'mode_streak',
  jokers: 'jokers',
  packFootball: 'pack_football',
  packJeuxVideo: 'pack_jeux_video',
  laTotale: 'la_totale',
  packHarryPotter: 'pack_harry_potter',
  packRap: 'pack_rap',
  packDresseur: 'pack_dresseur',
  packArt: 'pack_art',
};

// Lazy accessor — never crashes in Expo Go where the native module is absent
export function getRevenueCat(): typeof import('react-native-purchases').default | null {
  if (!isRevenueCatAvailable) return null;
  try {
    return (require('react-native-purchases') as typeof import('react-native-purchases')).default;
  } catch {
    return null;
  }
}

export function initRevenueCat(userId?: string): void {
  const Purchases = getRevenueCat();
  if (!Purchases) return;

  const apiKey =
    Platform.OS === 'ios'
      ? (process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '')
      : (process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '');

  if (!apiKey) return;

  if (__DEV__) {
    const { LOG_LEVEL } = require('react-native-purchases') as typeof import('react-native-purchases');
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  Purchases.configure({ apiKey, appUserID: userId ?? null });
}

export function hasEntitlement(customerInfo: CustomerInfo, entitlementId: string): boolean {
  return entitlementId in customerInfo.entitlements.active;
}

export type { CustomerInfo };
