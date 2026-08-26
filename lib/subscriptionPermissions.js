/**
 * DONA Subscription Permissions & Services Matrix Engine
 * Dynamically governs subscriber access rules based on Admin configuration.
 * Magazines split in 4 blocks of 4 magazines (1-4, 5-8, 9-12, 13-16).
 */

export const ALL_SUBSCRIBER_SERVICES = [
  {
    id: 'publicExcerpts',
    name: 'Extraits, Aperçus & Magazines publics',
    category: 'Presse & Éditorial',
    icon: 'menu_book',
    defaultPlans: ['Essentiel', 'Premium', 'Élite']
  },
  {
    id: 'liveTV',
    name: 'Télé en Direct (Live TV)',
    category: 'Médias & Streaming',
    icon: 'live_tv',
    defaultPlans: ['Essentiel', 'Premium', 'Élite']
  },
  {
    id: 'liveRadio',
    name: 'Radio en Streaming (Live Radio)',
    category: 'Médias & Streaming',
    icon: 'radio',
    defaultPlans: ['Essentiel', 'Premium', 'Élite']
  },
  {
    id: 'magazines1to4',
    name: 'Magazines numériques (N°01 à N°04)',
    category: 'Presse & Éditorial',
    icon: 'auto_stories',
    defaultPlans: ['Premium', 'Élite']
  },
  {
    id: 'magazines5to8',
    name: 'Magazines numériques (N°05 à N°08)',
    category: 'Presse & Éditorial',
    icon: 'auto_stories',
    defaultPlans: ['Premium', 'Élite']
  },
  {
    id: 'magazines9to12',
    name: 'Magazines numériques (N°09 à N°12)',
    category: 'Presse & Éditorial',
    icon: 'collections_bookmark',
    defaultPlans: ['Élite']
  },
  {
    id: 'magazines13to16',
    name: 'Magazines numériques (N°13 à N°16)',
    category: 'Presse & Éditorial',
    icon: 'collections_bookmark',
    defaultPlans: ['Élite']
  },
  {
    id: 'audioReplays',
    name: 'Contenus Audio & Replays Vidéo',
    category: 'Médias & Streaming',
    icon: 'graphic_eq',
    defaultPlans: ['Premium', 'Élite']
  },
  {
    id: 'workbooks',
    name: 'Workbooks & Fichiers PDF Téléchargeables',
    category: 'Outils Stratégiques',
    icon: 'download',
    defaultPlans: ['Premium', 'Élite']
  },
  {
    id: 'archives',
    name: 'Archives du Cercle DONA',
    category: 'Privilèges Membres',
    icon: 'inventory_2',
    defaultPlans: ['Premium', 'Élite']
  },
  {
    id: 'privateEvents',
    name: 'Invitations Événements & Galas Privés',
    category: 'Privilèges Membres',
    icon: 'event_seat',
    defaultPlans: ['Élite']
  },
  {
    id: 'concierge',
    name: 'Conciergerie Éditoriale & Accès Anticipé',
    category: 'Privilèges Membres',
    icon: 'verified',
    defaultPlans: ['Élite']
  }
];

export function getServicesMatrixConfig() {
  if (typeof window === 'undefined') {
    return getDefaultMatrix();
  }
  try {
    const stored = localStorage.getItem('dona_services_matrix_config');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (e) {
    console.error('Error reading services matrix from localStorage:', e);
  }
  return getDefaultMatrix();
}

export function saveServicesMatrixConfig(matrix) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('dona_services_matrix_config', JSON.stringify(matrix));
  } catch (e) {
    console.error('Error saving services matrix to localStorage:', e);
  }
}

function getDefaultMatrix() {
  const matrix = {};
  ALL_SUBSCRIBER_SERVICES.forEach(svc => {
    matrix[svc.id] = {
      Essentiel: svc.defaultPlans.includes('Essentiel'),
      Premium: svc.defaultPlans.includes('Premium'),
      Élite: svc.defaultPlans.includes('Élite')
    };
  });
  return matrix;
}

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
    console.error('Error reading subscription profile:', e);
  }
  return { plan: 'Essentiel', status: 'Active', isGuest: true };
}

export function isServiceAllowedForPlan(serviceId, plan = 'Essentiel') {
  const matrix = getServicesMatrixConfig();
  const normalizedPlan = (plan || 'Essentiel').trim();
  const planKey = normalizedPlan.toLowerCase().includes('élite') || normalizedPlan.toLowerCase().includes('elite')
    ? 'Élite'
    : normalizedPlan.toLowerCase().includes('premium')
    ? 'Premium'
    : 'Essentiel';

  if (matrix[serviceId] && matrix[serviceId][planKey] !== undefined) {
    return matrix[serviceId][planKey];
  }
  
  // Fallback to defaults
  const svc = ALL_SUBSCRIBER_SERVICES.find(s => s.id === serviceId);
  return svc ? svc.defaultPlans.includes(planKey) : false;
}

export function canAccessMagazine(magazineId, userPlan = 'Essentiel', userStatus = 'Active') {
  if (userStatus === 'Inactive') return { allowed: false, reason: 'inactive' };

  const idNum = typeof magazineId === 'number' ? magazineId : parseInt(String(magazineId).replace(/\D/g, ''), 10) || 1;

  if (idNum <= 4) {
    if (isServiceAllowedForPlan('magazines1to4', userPlan)) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'requires_premium',
      message: 'L\'accès aux magazines N°01 à N°04 est réservé aux abonnés autorisés.'
    };
  } else if (idNum <= 8) {
    if (isServiceAllowedForPlan('magazines5to8', userPlan)) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'requires_premium',
      message: 'L\'accès aux magazines N°05 à N°08 est réservé aux abonnés autorisés.'
    };
  } else if (idNum <= 12) {
    if (isServiceAllowedForPlan('magazines9to12', userPlan)) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'requires_elite',
      message: 'L\'accès aux magazines N°09 à N°12 est réservé aux abonnés autorisés.'
    };
  } else {
    if (isServiceAllowedForPlan('magazines13to16', userPlan)) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'requires_elite',
      message: 'L\'accès aux magazines N°13 à N°16 est réservé exclusivement aux membres de la formule Élite.'
    };
  }
}

export function canAccessAudioAndReplay(userPlan = 'Essentiel', userStatus = 'Active') {
  if (userStatus === 'Inactive') return { allowed: false, reason: 'inactive' };

  if (isServiceAllowedForPlan('audioReplays', userPlan)) {
    return { allowed: true };
  }
  return {
    allowed: false,
    reason: 'requires_premium',
    message: 'L\'accès aux contenus audios et replays est réservé aux abonnés Premium et Élite.'
  };
}

export function canAccessTVRadio(userPlan = 'Essentiel', userStatus = 'Active') {
  if (userStatus === 'Inactive') return { allowed: false, reason: 'inactive' };

  if (isServiceAllowedForPlan('liveTV', userPlan) || isServiceAllowedForPlan('liveRadio', userPlan)) {
    return { allowed: true };
  }
  return { allowed: false, reason: 'restricted' };
}
