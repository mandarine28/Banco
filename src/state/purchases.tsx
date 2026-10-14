import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import {
  ENTITLEMENT_IDS,
  getRevenueCat,
  hasEntitlement,
  initRevenueCat,
  type CustomerInfo,
} from '@/lib/revenuecat';
import { PRODUCT_IDS, type ProductId } from '@/config/shop';
import { useAuth } from './auth';

type PurchasesContextValue = {
  customerInfo: CustomerInfo | null;
  isLoading: boolean;
  error: string | null;
  hasPurchased: (productId: ProductId) => boolean;
  purchase: (productId: ProductId) => Promise<void>;
  restorePurchases: () => Promise<void>;
};

const PurchasesContext = createContext<PurchasesContextValue | null>(null);

export function PurchasesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initRevenueCat(user?.id);
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
        if (user?.id) {
          await rc.logIn(user.id);
        }
        const info = await rc.getCustomerInfo();
        if (!cancelled) setCustomerInfo(info);
      } catch {
        if (!cancelled) setError('Impossible de charger vos achats.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadInfo();

    const listener = (info: CustomerInfo) => setCustomerInfo(info);
    rc.addCustomerInfoUpdateListener(listener);

    return () => {
      cancelled = true;
      rc.removeCustomerInfoUpdateListener(listener);
    };
  }, [user?.id]);

  const hasPurchased = useCallback(
    (productId: ProductId): boolean => {
      if (!customerInfo) return false;
      return hasEntitlement(customerInfo, ENTITLEMENT_IDS[productId]);
    },
    [customerInfo],
  );

  const purchase = useCallback(async (productId: ProductId): Promise<void> => {
    const rc = getRevenueCat();
    if (!rc) return;
    setError(null);
    try {
      const offerings = await rc.getOfferings();
      const pkg = offerings.current?.availablePackages.find(
        (p) => p.product.identifier === PRODUCT_IDS[productId],
      );
      if (!pkg) throw new Error('Produit non disponible');
      const { customerInfo: updated } = await rc.purchasePackage(pkg);
      setCustomerInfo(updated);
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'userCancelled' in e) return;
      setError("L'achat a échoué. Veuillez réessayer.");
      throw e;
    }
  }, []);

  const restorePurchases = useCallback(async (): Promise<void> => {
    const rc = getRevenueCat();
    if (!rc) return;
    setError(null);
    try {
      const info = await rc.restorePurchases();
      setCustomerInfo(info);
    } catch {
      setError('La restauration a échoué. Vérifiez votre connexion.');
    }
  }, []);

  const value = useMemo<PurchasesContextValue>(
    () => ({ customerInfo, isLoading, error, hasPurchased, purchase, restorePurchases }),
    [customerInfo, isLoading, error, hasPurchased, purchase, restorePurchases],
  );

  return <PurchasesContext.Provider value={value}>{children}</PurchasesContext.Provider>;
}

export function usePurchases() {
  const context = useContext(PurchasesContext);
  if (!context) throw new Error('usePurchases doit être utilisé dans PurchasesProvider');
  return context;
}
