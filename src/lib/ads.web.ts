// Version web : le SDK AdMob est natif uniquement (Metro refuse de l'embarquer pour le web), donc aucune pub.
export type RewardedResult = 'rewarded' | 'dismissed' | 'unavailable';

export const isRewardGranted = (result: RewardedResult) => result !== 'dismissed';

export const initAds = async (): Promise<boolean> => false;
export const afterAdsConsent = async (): Promise<void> => {};
export const showRewardedAd = async (): Promise<RewardedResult> => 'unavailable';
export const preloadInterstitial = async (): Promise<void> => {};
export const showInterstitial = async (): Promise<void> => {};
export const canEditAdChoices = async (): Promise<boolean> => false;
export const editAdChoices = async (): Promise<void> => {};
