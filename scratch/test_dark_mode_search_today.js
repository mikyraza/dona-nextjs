/**
 * Automated Verification Suite for Dark Mode on /search and /today
 */

const fs = require('fs');
const assert = require('assert');
const http = require('http');

console.log('─── RUNNING DARK MODE (/search & /today) VERIFICATION SUITE ───');

let testsPassed = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  ✓ ${desc}`);
    testsPassed++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

// 1. Search Page CSS & Theme Variables
it('1. app/search/page.jsx defines dark theme CSS variables without harsh white cards', () => {
  const content = fs.readFileSync('app/search/page.jsx', 'utf8');

  // Verify dark theme block
  assert(content.includes('[data-theme="dark"]'), 'Must include [data-theme="dark"] selector');
  assert(content.includes('--page-bg: #0A0A0A;'), 'Must set dark page background');
  assert(content.includes('--page-card-bg: #141414;'), 'Must set dark card background instead of white or pitch black');
  assert(content.includes('--page-banner-bg: #161616;'), 'Must set dark banner background instead of #f9f6f3');
  assert(content.includes('--page-border: rgba(255, 255, 255, 0.1);'), 'Must set dark border');

  // Verify no hardcoded light borders in search container
  assert(!content.includes('border: "1px solid #e8e4e4"'), 'Should not have hardcoded #e8e4e4 border');
  assert(!content.includes('border: "1px solid #e0dada"'), 'Should not have hardcoded #e0dada border');
});

// 2. Today Page in globals.css
it('2. styles/globals.css includes [data-theme="dark"] rules for Today page components', () => {
  const css = fs.readFileSync('styles/globals.css', 'utf8');

  assert(css.includes('[data-theme="dark"] .today-hero-title'), 'Must style .today-hero-title in dark mode');
  assert(css.includes('[data-theme="dark"] .today-hero-subtitle'), 'Must style .today-hero-subtitle in dark mode');
  assert(css.includes('[data-theme="dark"] .value-card'), 'Must style .value-card in dark mode');
  assert(css.includes('[data-theme="dark"] .card-solid'), 'Must style .card-solid in dark mode');
  assert(css.includes('[data-theme="dark"] .today-hero-bg::after'), 'Must adjust hero radial gradient in dark mode');
  assert(css.includes('[data-theme="dark"] .today-filters'), 'Must style .today-filters in dark mode');
});

// 3. Today All Articles Page
it('3. app/today/all/page.jsx cards and table use theme CSS variables', () => {
  const content = fs.readFileSync('app/today/all/page.jsx', 'utf8');

  // Verify article card and table backgrounds
  assert(content.includes('background: var(--color-bg-alt);'), 'Article card must use var(--color-bg-alt)');
  assert(content.includes('border: 1px solid var(--color-border);'), 'Article card must use var(--color-border)');
  assert(content.includes('background-color: var(--color-bg);'), 'All-articles-page must use var(--color-bg)');
  assert(content.includes('color: var(--color-text);'), 'Text must use var(--color-text)');
});

// 4. Today Page Filter Pills
it('4. app/today/page.jsx filter pills use theme variables instead of hardcoded white', () => {
  const content = fs.readFileSync('app/today/page.jsx', 'utf8');
  assert(content.includes('var(--color-bg-alt)'), 'Filter pill must use var(--color-bg-alt)');
  assert(content.includes('var(--color-border)'), 'Filter pill must use var(--color-border)');
  assert(!content.includes("var(--color-bg, #FFFFFF)"), 'Should not have hardcoded #FFFFFF fallback on pills');
});

// 5. Live Server Endpoints check
async function checkUrl(path) {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000' + path, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) resolve(data);
        else reject(new Error(`Returned status ${res.statusCode} for ${path}`));
      });
    }).on('error', reject);
  });
}

(async () => {
  try {
    console.log('\n--- Checking Live Server HTTP Status ---');
    await checkUrl('/search');
    console.log('  ✓ GET /search returned 200 OK');
    testsPassed++;

    await checkUrl('/today');
    console.log('  ✓ GET /today returned 200 OK');
    testsPassed++;

    await checkUrl('/today/all');
    console.log('  ✓ GET /today/all returned 200 OK');
    testsPassed++;

    console.log(`\n==============================================`);
    console.log(`🎉 ALL ${testsPassed}/${testsPassed} DARK MODE VERIFICATION TESTS PASSED!`);
    console.log(`==============================================\n`);
    process.exit(0);
  } catch (err) {
    console.error('Live check failed:', err);
    process.exit(1);
  }
})();
