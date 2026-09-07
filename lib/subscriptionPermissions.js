/**
 * DONA Subscription Permissions & Dynamic Access Matrix Engine
 * Dynamically governs subscriber access rules based on required plans,
 * entity configurations, VIP flags, and customizable Admin service matrices.
 */

export const PLAN_TIERS = {
  Gratuit: 1,
  Essentiel: 1,
  User: 1,
  Standard: 1,
  Premium: 2,
  VIP: 2,
  Élite: 3,
  Elite: 3
};

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

/**
 * Normalizes user and requirement plan names into standard keys ('Essentiel', 'Premium', 'Élite').
 */
export function normalizePlanName(plan) {
  if (!plan || typeof plan !== 'string') return 'Essentiel';
  const clean = plan.trim().toLowerCase();
  if (clean.includes('élite') || clean.includes('elite')) return 'Élite';
  if (clean.includes('premium') || clean.includes('vip')) return 'Premium';
  return 'Essentiel';
}

/**
 * Returns numeric rank for a plan (1: Essentiel, 2: Premium, 3: Élite).
 */
export function getPlanRank(plan) {
  const norm = normalizePlanName(plan);
  return PLAN_TIERS[norm] || 1;
}

/**
 * Checks whether userPlan tier is greater than or equal to requiredPlan tier.
 */
export function hasRequiredPlan(userPlan, requiredPlan) {
  if (!requiredPlan) return true;
  const userRank = getPlanRank(userPlan);
  const reqRank = getPlanRank(requiredPlan);
  return userRank >= reqRank;
}

/**
 * Retrieves dynamic services matrix configuration from browser storage or defaults.
 */
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

/**
 * Saves customized services matrix configuration to storage.
 */
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

/**
 * Returns active feature list for a plan from the matrix.
 */
export function getFeaturesForPlanFromMatrix(planName = 'Essentiel', customMatrix = null) {
  const matrix = customMatrix || getServicesMatrixConfig();
  const planKey = normalizePlanName(planName);

  const activeServices = ALL_SUBSCRIBER_SERVICES.filter(svc => {
    if (matrix[svc.id] && matrix[svc.id][planKey] !== undefined) {
      return !!matrix[svc.id][planKey];
    }
    return svc.defaultPlans.includes(planKey);
  });

  return activeServices.map(svc => svc.name);
}

/**
 * Reads active subscriber session / profile.
 */
export function getActiveUserSubscription() {
  if (typeof window === 'undefined') return { plan: 'Essentiel', status: 'Active', isGuest: true, name: 'Visiteur' };
  try {
    const stored = localStorage.getItem('dona_member_profile');
    if (stored) {
      const profile = JSON.parse(stored);
      const normPlan = normalizePlanName(profile.plan || 'Essentiel');
      const isGuest = profile.isGuest !== undefined 
        ? Boolean(profile.isGuest) 
        : (!profile.email && normPlan === 'Essentiel');
      return {
        plan: normPlan,
        status: profile.status || 'Active',
        email: profile.email || '',
        name: profile.name || (isGuest ? 'Visiteur' : 'Membre'),
        role: profile.role || 'USER',
        isGuest
      };
    }
    const directPlan = localStorage.getItem('dona_user_plan');
    if (directPlan) {
      const normPlan = normalizePlanName(directPlan);
      return {
        plan: normPlan,
        status: 'Active',
        email: '',
        name: normPlan === 'Essentiel' ? 'Visiteur' : 'Membre',
        role: 'USER',
        isGuest: normPlan === 'Essentiel'
      };
    }
  } catch (e) {
    console.error('Error reading subscription profile:', e);
  }
  return { plan: 'Essentiel', status: 'Active', isGuest: true, name: 'Visiteur' };
}

/**
 * Checks if a specific platform service key is authorized for a plan.
 */
export function isServiceAllowedForPlan(serviceId, plan = 'Essentiel') {
  const matrix = getServicesMatrixConfig();
  const planKey = normalizePlanName(plan);

  if (matrix[serviceId] && matrix[serviceId][planKey] !== undefined) {
    return matrix[serviceId][planKey];
  }
  
  const svc = ALL_SUBSCRIBER_SERVICES.find(s => s.id === serviceId);
  return svc ? svc.defaultPlans.includes(planKey) : false;
}

/**
 * Universal Dynamic Content Permission Evaluator.
 * Reads the actual required plan from the resource (magazine, article, video, etc.)
 * rather than relying on hardcoded identifier ranges.
 *
 * @param {Object|string|number} resource - Content entity or identifier
 * @param {string} userPlan - e.g. 'Essentiel', 'Premium', 'Élite'
 * @param {string} userStatus - 'Active', 'Inactive', 'Suspendu'
 * @returns {{ allowed: boolean, requiredPlan: string, reason?: string, message?: string }}
 */
export function canAccessContent(resource, userPlan = 'Essentiel', userStatus = 'Active') {
  if (userStatus === 'Inactive' || userStatus === 'Suspendu') {
    return {
      allowed: false,
      requiredPlan: 'Essentiel',
      reason: 'inactive',
      message: 'Votre compte est inactif ou suspendu. Veuillez vérifier votre abonnement.'
    };
  }

  const normUserPlan = normalizePlanName(userPlan);

  // If no resource object provided, default allowed
  if (!resource) {
    return { allowed: true, requiredPlan: 'Essentiel' };
  }

  // 1. Dynamic Plan Evaluation from Resource Object
  if (typeof resource === 'object' && resource !== null) {
    // A. Explicit required plan field
    const explicitPlan = resource.requiredPlan || resource.minPlan || resource.required_plan || resource.min_plan || resource.planRequired;
    if (explicitPlan) {
      const normRequired = normalizePlanName(explicitPlan);
      const isAllowed = hasRequiredPlan(normUserPlan, normRequired);
      if (!isAllowed) {
        return {
          allowed: false,
          requiredPlan: normRequired,
          reason: normRequired === 'Élite' ? 'requires_elite' : 'requires_premium',
          message: `Ce contenu nécessite un abonnement ${normRequired} ou supérieur.`
        };
      }
      return { allowed: true, requiredPlan: normRequired };
    }

    // B. VIP / Restricted flag
    const isVip = Boolean(resource.isVipOnly || resource.is_vip_only || resource.vipOnly || resource.isVip);
    if (isVip) {
      const metaStr = `${resource.title || ''} ${resource.category || ''} ${resource.badge || ''} ${resource.label || ''}`.toLowerCase();
      const required = (metaStr.includes('élite') || metaStr.includes('elite') || metaStr.includes('gala') || metaStr.includes('concierge'))
        ? 'Élite'
        : 'Premium';

      const isAllowed = hasRequiredPlan(normUserPlan, required);
      if (!isAllowed) {
        return {
          allowed: false,
          requiredPlan: required,
          reason: required === 'Élite' ? 'requires_elite' : 'requires_premium',
          message: `Ce contenu exclusif est réservé aux membres ${required}.`
        };
      }
      return { allowed: true, requiredPlan: required };
    }

    // C. Service ID matching
    if (resource.serviceId && isServiceAllowedForPlan(resource.serviceId, normUserPlan)) {
      return { allowed: true, requiredPlan: normUserPlan };
    }

    return { allowed: true, requiredPlan: 'Essentiel' };
  }

  return { allowed: true, requiredPlan: 'Essentiel' };
}

/**
 * Dynamic Magazine Permission Checker.
 * Accepts either a magazine entity object (dynamically reading requiredPlan/isVipOnly)
 * or a legacy ID with service matrix evaluation.
 */
export function canAccessMagazine(magazineOrId, userPlan = 'Essentiel', userStatus = 'Active') {
  if (userStatus === 'Inactive' || userStatus === 'Suspendu') {
    return { allowed: false, requiredPlan: 'Essentiel', reason: 'inactive', message: 'Compte inactif.' };
  }

  // 1. Dynamic Evaluation if full Magazine object is passed
  if (typeof magazineOrId === 'object' && magazineOrId !== null) {
    return canAccessContent(magazineOrId, userPlan, userStatus);
  }

  // 2. Fallback for primitive IDs: maps dynamically against matrix services and tiers
  const normUserPlan = normalizePlanName(userPlan);
  const idStr = String(magazineOrId || '');
  const idNum = parseInt(idStr.replace(/\D/g, ''), 10) || 1;

  let serviceKey = 'magazines1to4';
  let fallbackReqPlan = 'Premium';

  if (idNum >= 13) {
    serviceKey = 'magazines13to16';
    fallbackReqPlan = 'Élite';
  } else if (idNum >= 9) {
    serviceKey = 'magazines9to12';
    fallbackReqPlan = 'Élite';
  } else if (idNum >= 5) {
    serviceKey = 'magazines5to8';
    fallbackReqPlan = 'Premium';
  }

  const allowed = isServiceAllowedForPlan(serviceKey, normUserPlan) || hasRequiredPlan(normUserPlan, fallbackReqPlan);
  if (allowed) {
    return { allowed: true, requiredPlan: fallbackReqPlan };
  }

  return {
    allowed: false,
    requiredPlan: fallbackReqPlan,
    reason: fallbackReqPlan === 'Élite' ? 'requires_elite' : 'requires_premium',
    message: `L'accès à cette édition est réservé aux abonnés ${fallbackReqPlan}.`
  };
}

/**
 * Dynamic Article Access Checker.
 */
export function canAccessArticle(article, userPlan = 'Essentiel', userStatus = 'Active') {
  return canAccessContent(article, userPlan, userStatus);
}

/**
 * Dynamic Video Access Checker.
 */
export function canAccessVideo(video, userPlan = 'Essentiel', userStatus = 'Active') {
  return canAccessContent(video, userPlan, userStatus);
}

/**
 * Dynamic Audio and Replay Access Checker.
 */
export function canAccessAudioAndReplay(userPlan = 'Essentiel', userStatus = 'Active') {
  if (userStatus === 'Inactive' || userStatus === 'Suspendu') {
    return { allowed: false, requiredPlan: 'Premium', reason: 'inactive' };
  }

  if (isServiceAllowedForPlan('audioReplays', userPlan)) {
    return { allowed: true, requiredPlan: 'Premium' };
  }
  return {
    allowed: false,
    requiredPlan: 'Premium',
    reason: 'requires_premium',
    message: 'L\'accès aux contenus audios et replays est réservé aux abonnés Premium et Élite.'
  };
}

/**
 * Dynamic Live TV / Live Radio Access Checker.
 */
export function canAccessTVRadio(userPlan = 'Essentiel', userStatus = 'Active') {
  if (userStatus === 'Inactive' || userStatus === 'Suspendu') {
    return { allowed: false, requiredPlan: 'Essentiel', reason: 'inactive' };
  }

  if (isServiceAllowedForPlan('liveTV', userPlan) || isServiceAllowedForPlan('liveRadio', userPlan)) {
    return { allowed: true, requiredPlan: 'Essentiel' };
  }
  return { allowed: false, requiredPlan: 'Essentiel', reason: 'restricted' };
}
