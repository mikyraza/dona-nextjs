"use client";

import { useState, useEffect } from 'react';
import { getActiveUserSubscription, normalizePlanName } from '@/lib/subscriptionPermissions';

/**
 * Universal React Hook for Subscriber Session & Subscription State
 * Automatically re-renders calling components when:
 * 1. SubscriptionSimulatorBar switches plans ('dona_subscription_changed' event)
 * 2. Checkout or auth updates member storage ('storage' event)
 * 3. Mounts on client to prevent SSR hydration mismatches
 */
export function useUserSubscription() {
  const [sub, setSub] = useState(() => getActiveUserSubscription());

  useEffect(() => {
    // Re-synchronize once mounted in browser
    setSub(getActiveUserSubscription());

    const handleUpdate = (e) => {
      try {
        if (e?.detail?.profile) {
          const p = e.detail.profile;
          setSub({
            plan: normalizePlanName(p.plan || 'Essentiel'),
            status: p.status || 'Active',
            email: p.email || '',
            isGuest: Boolean(p.isGuest),
            name: p.name || 'Membre',
            role: p.role || 'USER',
            isVip: !p.isGuest && (normalizePlanName(p.plan) === 'Premium' || normalizePlanName(p.plan) === 'Élite'),
            isElite: !p.isGuest && normalizePlanName(p.plan) === 'Élite'
          });
          return;
        }
      } catch (err) {
        console.error('Error handling subscription event detail:', err);
      }
      const updated = getActiveUserSubscription();
      const plan = updated.plan || 'Essentiel';
      setSub({
        ...updated,
        isVip: !updated.isGuest && (plan === 'Premium' || plan === 'Élite'),
        isElite: !updated.isGuest && plan === 'Élite'
      });
    };

    window.addEventListener('dona_subscription_changed', handleUpdate);
    document.addEventListener('dona_subscription_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('dona_subscription_changed', handleUpdate);
      document.removeEventListener('dona_subscription_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const plan = sub.plan || 'Essentiel';
  return {
    ...sub,
    isVip: !sub.isGuest && (plan === 'Premium' || plan === 'Élite'),
    isElite: !sub.isGuest && plan === 'Élite'
  };
}

export default useUserSubscription;
