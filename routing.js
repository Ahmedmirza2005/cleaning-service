/* ---------- REAL-PATH ROUTER (replaces # anchors) ---------- */
/* Add this AFTER your existing services/i18n script, right before </body>. */

const routes = {
  "/": "koti",
  "/miksi": "miksi",
  "/palvelut": "palvelut",
  "/yhteystiedot": "yhteystiedot"
};

// 1. Fix every nav link and CTA to use real paths instead of #id
document.querySelectorAll('a[href^="#"]').forEach(a => {
  const id = a.getAttribute('href').slice(1);
  const path = Object.keys(routes).find(p => routes[p] === id) || "/";
  a.setAttribute('href', path);
});

// 2. Intercept clicks on internal links so the page doesn't hard-reload
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
  if (href.startsWith('/')) {
    e.preventDefault();
    navigateTo(href);
  }
});

function navigateTo(path, push = true) {
  const sectionId = routes[path] || routes[Object.keys(routes).find(p =>
    path.startsWith('/palvelut/') ? p === '/palvelut' : p === path
  )] || 'koti';

  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });

  // If it's a service deep-link like /palvelut/kotisiivous, open that service tab
  if (path.startsWith('/palvelut/')) {
    const slug = path.split('/')[2];
    if (typeof openService === 'function') openService(slugToServiceId(slug));
  }

  if (push) history.pushState({}, '', path);
}

// 3. Map pretty slugs <-> your internal service ids
const slugMap = {
  kotisiivous: 'home',
  myymalasiivous: 'shop',
  rappusiivous: 'stairs',
  ikkunoidenpesu: 'windows',
  toimistosiivous: 'office',
  ravintolat: 'restaurant',
  koulut: 'schools',
  paivakotisiivous: 'daycare',
  kauppatyo: 'kauppatyo'
};
function slugToServiceId(slug) { return slugMap[slug] || 'home'; }

// 4. When a user clicks a service tab, push a real URL for it too
//    (call this inside your existing openService(id) function)
function updateServiceUrl(serviceId) {
  const slug = Object.keys(slugMap).find(k => slugMap[k] === serviceId);
  if (slug) history.pushState({}, '', '/palvelut/' + slug);
}

// 5. Handle browser back/forward buttons
window.addEventListener('popstate', () => navigateTo(location.pathname, false));

// 6. On first load, jump straight to whatever path was requested
navigateTo(location.pathname, false);
