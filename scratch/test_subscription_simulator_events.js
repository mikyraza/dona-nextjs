/**
 * Automated Verification Script for Subscription Simulator Event Architecture
 * Tests:
 * 1. Simulating browser window / document / localStorage environment
 * 2. Subscription permissions evaluator with plans: Essentiel, Premium, Élite
 * 3. Dynamic reaction to 'dona_subscription_changed' event
 * 4. Synthetic StorageEvent reaction
 * 5. Instant VIP gates evaluation without page reload
 */

const assert = require('assert');

// 1. Mock Browser Environment
const store = {};
const windowListeners = {};
const documentListeners = {};

global.window = {
  addEventListener(event, fn) {
    if (!windowListeners[event]) windowListeners[event] = [];
    windowListeners[event].push(fn);
  },
  removeEventListener(event, fn) {
    if (windowListeners[event]) {
      windowListeners[event] = windowListeners[event].filter(f => f !== fn);
    }
  },
  dispatchEvent(event) {
    const handlers = windowListeners[event.type] || [];
    handlers.forEach(h => h(event));
  }
};

global.document = {
  addEventListener(event, fn) {
    if (!documentListeners[event]) documentListeners[event] = [];
    documentListeners[event].push(fn);
  },
  removeEventListener(event, fn) {
    if (documentListeners[event]) {
      documentListeners[event] = documentListeners[event].filter(f => f !== fn);
    }
  },
  dispatchEvent(event) {
    const handlers = documentListeners[event.type] || [];
    handlers.forEach(h => h(event));
  }
};

global.localStorage = {
  getItem(key) { return store[key] || null; },
  setItem(key, val) { store[key] = String(val); },
  removeItem(key) { delete store[key]; },
  clear() { Object.keys(store).forEach(k => delete store[k]); }
};

global.CustomEvent = class CustomEvent {
  constructor(type, options = {}) {
    this.type = type;
    this.detail = options.detail || null;
  }
};

global.StorageEvent = class StorageEvent {
  constructor(type, options = {}) {
    this.type = type;
    this.key = options.key || null;
    this.newValue = options.newValue || null;
  }
};

// 2. Import permissions module
const {
  getActiveUserSubscription,
  canAccessMagazine,
  canAccessContent,
  canAccessAudioAndReplay,
  isServiceAllowedForPlan,
  normalizePlanName
} = require('../lib/subscriptionPermissions');

console.log('─── RUNNING SUBSCRIPTION SIMULATOR REACTIVE EVENT SUITE ───');

let passedTests = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  ✓ ${desc}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

// Test 1: Initial Default State
it('1. Default unauthenticated state returns Essentiel visitor', () => {
  localStorage.clear();
  const sub = getActiveUserSubscription();
  assert.strictEqual(sub.plan, 'Essentiel');
  assert.strictEqual(sub.isGuest, true);
  assert.strictEqual(sub.status, 'Active');
});

// Test 2: Simulating Switch to Premium
it('2. Switching simulator to Premium dispatches event and updates subscription state', () => {
  let windowNotified = 0;
  let documentNotified = 0;
  let receivedPlan = null;

  const windowHandler = (e) => {
    windowNotified++;
    receivedPlan = e?.detail?.plan;
  };
  const docHandler = () => {
    documentNotified++;
  };

  window.addEventListener('dona_subscription_changed', windowHandler);
  document.addEventListener('dona_subscription_changed', docHandler);

  // Simulate SubscriptionSimulatorBar.jsx setPlanMode('Premium')
  const newPlan = 'Premium';
  const profile = {
    plan: newPlan,
    status: 'Active',
    email: 'membre.test@dona-magazine.com',
    name: 'Membre Premium',
    isGuest: false
  };
  localStorage.setItem('dona_member_profile', JSON.stringify(profile));
  localStorage.setItem('dona_user_plan', newPlan);

  const event = new CustomEvent('dona_subscription_changed', { detail: { plan: newPlan, profile } });
  window.dispatchEvent(event);
  document.dispatchEvent(event);

  assert.strictEqual(windowNotified, 1, 'Window listener should receive event');
  assert.strictEqual(documentNotified, 1, 'Document listener should receive event');
  assert.strictEqual(receivedPlan, 'Premium');

  const activeSub = getActiveUserSubscription();
  assert.strictEqual(activeSub.plan, 'Premium');
  assert.strictEqual(activeSub.isGuest, false);

  window.removeEventListener('dona_subscription_changed', windowHandler);
  document.removeEventListener('dona_subscription_changed', docHandler);
});

// Test 3: Premium Access Verification
it('3. Premium plan unlocks Magazine 01, Audio replays, and Workbooks without reload', () => {
  const activeSub = getActiveUserSubscription();
  assert.strictEqual(activeSub.plan, 'Premium');

  // Magazine 1 access check
  const magAccess = canAccessMagazine(1, activeSub.plan, activeSub.status);
  assert.strictEqual(magAccess.allowed, true, 'Premium should access Mag 01');

  // Audio access check
  const audioAccess = canAccessAudioAndReplay(activeSub.plan, activeSub.status);
  assert.strictEqual(audioAccess.allowed, true, 'Premium should access audio replays');

  // Workbooks service check
  const wbAllowed = isServiceAllowedForPlan('workbooks', activeSub.plan);
  assert.strictEqual(wbAllowed, true, 'Premium should access workbooks');

  // High tier (Mag 12) requires Elite
  const mag12Access = canAccessMagazine(12, activeSub.plan, activeSub.status);
  assert.strictEqual(mag12Access.allowed, false, 'Premium should NOT access Mag 12 (requires Elite)');
});

// Test 4: Simulating Switch to Elite
it('4. Switching simulator to Élite unlocks exclusive editions and gala services', () => {
  let eventFired = false;
  const handler = (e) => {
    if (e.detail?.plan === 'Élite') eventFired = true;
  };
  window.addEventListener('dona_subscription_changed', handler);

  const newPlan = 'Élite';
  const profile = {
    plan: newPlan,
    status: 'Active',
    email: 'membre.elite@dona-magazine.com',
    name: 'Membre Élite',
    isGuest: false
  };
  localStorage.setItem('dona_member_profile', JSON.stringify(profile));
  localStorage.setItem('dona_user_plan', newPlan);

  const event = new CustomEvent('dona_subscription_changed', { detail: { plan: newPlan, profile } });
  window.dispatchEvent(event);
  document.dispatchEvent(event);

  assert.strictEqual(eventFired, true);

  const activeSub = getActiveUserSubscription();
  assert.strictEqual(activeSub.plan, 'Élite');

  // Mag 12 & 16 access
  const mag12Access = canAccessMagazine(12, activeSub.plan, activeSub.status);
  assert.strictEqual(mag12Access.allowed, true, 'Élite should access Mag 12');

  const mag16Access = canAccessMagazine(16, activeSub.plan, activeSub.status);
  assert.strictEqual(mag16Access.allowed, true, 'Élite should access Mag 16');

  // Concierge service
  const conciergeAllowed = isServiceAllowedForPlan('concierge', activeSub.plan);
  assert.strictEqual(conciergeAllowed, true, 'Élite should access concierge');

  window.removeEventListener('dona_subscription_changed', handler);
});

// Test 5: Simulating Switch back to Essentiel (Visitor Mode)
it('5. Switching simulator back to Essentiel locks VIP gates immediately', () => {
  let backToVisitor = false;
  const handler = (e) => {
    if (e.detail?.plan === 'Essentiel') backToVisitor = true;
  };
  window.addEventListener('dona_subscription_changed', handler);

  const newPlan = 'Essentiel';
  const profile = {
    plan: newPlan,
    status: 'Active',
    email: '',
    name: 'Visiteur',
    isGuest: true
  };
  localStorage.setItem('dona_member_profile', JSON.stringify(profile));
  localStorage.setItem('dona_user_plan', newPlan);

  const event = new CustomEvent('dona_subscription_changed', { detail: { plan: newPlan, profile } });
  window.dispatchEvent(event);
  document.dispatchEvent(event);

  assert.strictEqual(backToVisitor, true);

  const activeSub = getActiveUserSubscription();
  assert.strictEqual(activeSub.plan, 'Essentiel');
  assert.strictEqual(activeSub.isGuest, true);

  // VIP Magazine access locked
  const magAccess = canAccessMagazine(1, activeSub.plan, activeSub.status);
  assert.strictEqual(magAccess.allowed, false, 'Essentiel visitor should be locked from Mag 01 VIP');

  // Audio replays locked
  const audioAccess = canAccessAudioAndReplay(activeSub.plan, activeSub.status);
  assert.strictEqual(audioAccess.allowed, false, 'Essentiel visitor should be locked from Audio Replays');

  window.removeEventListener('dona_subscription_changed', handler);
});

// Test 6: StorageEvent Synthetic Dispatch
it('6. Synthetic StorageEvent notifies storage listeners', () => {
  let storageNotified = false;
  const storageHandler = (e) => {
    if (e.key === 'dona_member_profile') storageNotified = true;
  };
  window.addEventListener('storage', storageHandler);

  const storageEvt = new StorageEvent('storage', {
    key: 'dona_member_profile',
    newValue: JSON.stringify({ plan: 'Premium', isGuest: false })
  });
  window.dispatchEvent(storageEvt);

  assert.strictEqual(storageNotified, true);
  window.removeEventListener('storage', storageHandler);
});

console.log(`\n==============================================`);
console.log(`🎉 ALL ${passedTests}/${passedTests} SUBSCRIPTION EVENT TESTS PASSED!`);
console.log(`==============================================\n`);
