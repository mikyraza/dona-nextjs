/**
 * DONA Subscription Permissions Helper
 * Defines access rules for Essentiel, Premium, and Élite tiers.
 */

export function getActiveUserSubscription() {
  if (typeof window === 'undefined') return { plan: 'Essentiel', status: 'Active', isGuest: true };
  try {
    const stored = localStorage.getItem('dona_member_profile');
    if (stored) {
      const profile = JSON.parse(stored);
      return {
        plan: profile.plan || 'Essentiel',
        status: profile.status || 'Active',
        email: profile.email,
        isGuest: false
      };
    }
  } catch (e) {
    console.error('Error reading subscription from localStorage:', e);
  }
  return { plan: 'Essentiel', status: 'Active', isGuest: true };
}

export function canAccessMagazine(magazineId, userPlan = 'Essentiel', userStatus = 'Active') {
  if (userStatus === 'Inactive') return { allowed: false, reason: 'inactive' };

  const idNum = typeof magazineId === 'number' ? magazineId : parseInt(String(magazineId).replace(/\D/g, ''), 10) || 1;
  const normalizedPlan = (userPlan || '').toLowerCase();

  // Élite: Access to ALL contents (Magazines 1-16, Audio, Replays, Events)
  if (normalizedPlan === 'élite' || normalizedPlan === 'elite') {
    return { allowed: true };
  }

  // Premium: Unlimited access to the FIRST 10 Magazines (N°01 to N°10)
  if (normalizedPlan === 'premium') {
    if (idNum <= 10) {
      return { allowed: true };
    }
    return { 
      allowed: false, 
      reason: 'requires_elite',
      message: 'L\'accès aux magazines N°11 à N°16 est réservé exclusivement aux membres de la formule Élite.'
    };
  }

  // Essentiel / Gratuit: Public excerpts & previews only
  return { 
    allowed: false, 
    reason: 'requires_premium',
    message: 'L\'accès aux magazines numériques complets est réservé aux membres Premium et Élite.'
  };
}

export function canAccessAudioAndReplay(userPlan = 'Essentiel', userStatus = 'Active') {
  if (userStatus === 'Inactive') return { allowed: false, reason: 'inactive' };

  const normalizedPlan = (userPlan || '').toLowerCase();
  if (normalizedPlan === 'premium' || normalizedPlan === 'élite' || normalizedPlan === 'elite') {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: 'requires_premium',
    message: 'L\'accès aux contenus audios et replays est réservé aux membres Premium et Élite.'
  };
}

export function canAccessTVRadio(userPlan = 'Essentiel', userStatus = 'Active') {
  if (userStatus === 'Inactive') return { allowed: false, reason: 'inactive' };
  // Accessible to all active members including Essentiel!
  return { allowed: true };
}
