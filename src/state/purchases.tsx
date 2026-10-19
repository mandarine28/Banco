import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import {
  ENTITLEMENT_IDS,
  getRevenueCat,
  hasEntitlement,
  initRevenueCat,
  type CustomerInfo,
} from '@/lib/revenuecat';
import { PRODUCT_IDS, type ProductId } from '@/config/shop';
import { loadGiftedPack, saveGiftedPack } from '@/lib/gifts';

/** Clé traduite par l'écran (t.shop.errors). */
export type PurchaseError = 'load' | 'purchase' | 'restore';

type PurchasesContextValue = {
  customerInfo: CustomerInfo | null;
  /** Prix localisés de l'App Store (ex. « 0,99 € », « $0.99 »), absents tant que non chargés. */
  prices: Partial<Record<ProductId, string>>;
  isLoading: boolean;
  error: PurchaseError | null;
  hasPurchased: (productId: ProductId) => boolean;
  /** true si l'achat a abouti, false si annulé ou indisponible (Expo Go) ; lève une erreur en cas d'échec. */
  purchase: (productId: ProductId) => Promise<boolean>;
  /** Renvoie les infos restaurées, ou null si indisponible / en échec. */
  restorePurchases: () => Promise<CustomerInfo | null>;
  /** Recharge les droits depuis RevenueCat. */
  refresh: () => Promise<void>;
  /** Pack offert contre un partage, sur cet appareil : undefined pendant la lecture, null s'il n'a pas encore été offert. */
  giftedPack: ProductId | null | undefined;
  /** Offre le pack choisi : il compte aussitôt comme acheté. */
  claimGiftedPack: (productId: ProductId) => Promise<void>;
};

const PurchasesContext = createContext<PurchasesContextValue | null>(null);

export function PurchasesProvider({ children }: { children: ReactNode }) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [prices, setPrices] = useState<Partial<Record<ProductId, string>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<PurchaseError | null>(null);

  useEffect(() => {
    initRevenueCat();
    const rc = getRevenueCat();

    if (!rc) {
      // Running in Expo Go — RevenueCat native module unavailable
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const loadInfo = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const info = await rc.getCustomerInfo();
        if (!cancelled) setCustomerInfo(info);
      } catch {
        if (!cancelled) setError('load');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    // Séparé de loadInfo : sans prix, la boutique masque juste le badge (pas d'erreur bloquante)
    const loadPrices = async () => {
      try {
        const offerings = await rc.getOfferings();
        const packages = offerings.current?.availablePackages ?? [];
        const next: Partial<Record<ProductId, string>> = {};
        for (const id of Object.keys(PRODUCT_IDS) as ProductId[]) {
          const pkg = packages.find((p) => p.product.identifier === PRODUCT_IDS[id]);
          if (pkg) next[id] = pkg.product.priceString;
        }
        if (!cancelled) setPrices(next);
      } catch {
        // Offres indisponibles (pas de réseau, produits non configurés) : badge de prix masqué
      }
    };

    loadPrices();

    loadInfo();

    const listener = (info: CustomerInfo) => setCustomerInfo(info);
    rc.addCustomerInfoUpdateListener(listener);

    return () => {
      cancelled = true;
      rc.removeCustomerInfoUpdateListener(listener);
    };
  }, []);

  const [giftedPack, setGiftedPack] = useState<ProductId | null | undefined>(undefined);
  useEffect(() => {
    loadGiftedPack().then(setGiftedPack);
  }, []);

  const claimGiftedPack = useCallback(async (productId: ProductId) => {
    await saveGiftedPack(productId);
    setGiftedPack(productId);
  }, []);

  const hasPurchased = useCallback(
    (productId: ProductId): boolean => {
      if (giftedPack === productId) return true;
      if (!customerInfo) return false;
      return hasEntitlement(customerInfo, ENTITLEMENT_IDS[productId]);
    },
    [customerInfo, giftedPack],
  );

  const purchase = useCallback(async (productId: ProductId): Promise<boolean> => {
    const rc = getRevenueCat();
    if (!rc) return false;
    setError(null);
    try {
      const offerings = await rc.getOfferings();
      const pkg = offerings.current?.availablePackages.find(
        (p) => p.product.identifier === PRODUCT_IDS[productId],
      );
      if (!pkg) throw new Error('Produit non disponible');
      const { customerInfo: updated } = await rc.purchasePackage(pkg);
      setCustomerInfo(updated);
      return true;
    } catch (e: unknown) {
      // Les erreurs RevenueCat portent toujours userCancelled (true/false) : seul true est une annulation
      if (e && typeof e === 'object' && 'userCancelled' in e && e.userCancelled === true) return false;
      setError('purchase');
      throw e;
    }
  }, []);

  const restorePurchases = useCallback(async (): Promise<CustomerInfo | null> => {
    const rc = getRevenueCat();
    if (!rc) return null;
    setError(null);
    try {
      const info = await rc.restorePurchases();
      setCustomerInfo(info);
      return info;
    } catch {
      setError('restore');
      return null;
    }
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    const rc = getRevenueCat();
    if (!rc) return;
    try {
      // Sans invalidation, le SDK renverrait sa copie en cache, sans le droit tout juste accordé
      await rc.invalidateCustomerInfoCache();
      setCustomerInfo(await rc.getCustomerInfo());
    } catch {
      setError('load');
    }
  }, []);

  const value = useMemo<PurchasesContextValue>(
    () => ({ customerInfo, prices, isLoading, error, hasPurchased, purchase, restorePurchases, refresh, giftedPack, claimGiftedPack }),
    [customerInfo, prices, isLoading, error, hasPurchased, purchase, restorePurchases, refresh, giftedPack, claimGiftedPack],
  );

  return <PurchasesContext.Provider value={value}>{children}</PurchasesContext.Provider>;
}

export function usePurchases() {
  const context = useContext(PurchasesContext);
  if (!context) throw new Error('usePurchases doit être utilisé dans PurchasesProvider');
  return context;
}
