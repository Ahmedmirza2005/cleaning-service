# Daris Cleaning — fix pack

## 1. Cookie banner
Paste this into your `<style>` block:

```css
#cookieConsent{
  position:fixed; bottom:0; left:0; right:0; z-index:200;
  background:var(--charcoal); color:#fff;
  padding:16px 24px; display:flex; align-items:center; justify-content:space-between;
  gap:16px; flex-wrap:wrap; font-size:0.9rem;
}
#cookieConsent p{ margin:0; max-width:520px; }
.cookie-actions{ display:flex; gap:10px; }
.cookie-actions button{
  padding:8px 16px; border-radius:999px; border:1px solid rgba(255,255,255,0.3);
  background:transparent; color:#fff; cursor:pointer; font-weight:600;
}
#cookieAccept{ background:var(--cyan); border-color:var(--cyan); }
```

Then add `<script src="/cookie-consent.js"></script>` just before `</body>`.
It shows once, remembers the choice in the browser (localStorage), and won't
show again until the user clears site data.

## 2. Real URLs instead of `#`
Add `<script src="/routing.js"></script>` right before `</body>`, **after**
your existing services/i18n script. It:
- rewrites every `href="#koti"` etc. to `href="/"`, `/miksi`, `/palvelut`, `/yhteystiedot`
- intercepts clicks so the page doesn't reload, but the address bar still shows a real path
- gives every service its own URL, e.g. `/palvelut/kotisiivous`
- makes back/forward buttons work correctly

Inside your existing `openService(id)` function, add one line so the URL
updates when someone clicks a service tab:

```js
function openService(id){
  updateServiceUrl(id);   // <-- add this line
  tabsEl.querySelectorAll('.service-tab')...
  ...
}
```

Drop `vercel.json` in your project root. It tells Vercel:
- serve clean URLs (no `.html`)
- rewrite any unknown path (like `/palvelut/kotisiivous`) back to `index.html`,
  so refreshing a deep link doesn't 404

## 3. Why the site isn't showing up in search
A brand-new site isn't indexed by Google automatically — it has to be
*discovered and crawled* first. Three concrete steps:
1. Put `robots.txt` and `sitemap.xml` (included here) in your project root.
2. Add your domain to **Google Search Console** → Sitemaps → submit
   `https://www.dariscleaning.fi/sitemap.xml`. This is what actually triggers indexing;
   just having the files isn't enough.
3. Because your content is built entirely with JavaScript (the services text
   only appears after the script runs), give Google something to read
   immediately too — your current `<meta name="description">` is good, keep
   it accurate per page/route if you split further.

New sites typically take anywhere from a few days to a few weeks to appear,
even after doing this correctly.

## 4. Why the logo doesn't show
Your logo isn't a linked image file — it's a base64 string pasted directly
into the `<img src="data:image/jpeg;base64,...">` attribute. That works in
principle, but in practice it commonly breaks because:
- it's tens of thousands of characters on a single line, and many code
  editors, Git diff tools, or copy-paste steps silently wrap, trim, or strip
  whitespace from long lines — any single corrupted character breaks the
  entire image
- it roughly doubles your page's HTML weight for no benefit (a real file is
  cached by the browser; a data URI is downloaded fresh every time, on every page)

**Fix:** export the logo as an actual `logo.png` (and a separate `favicon.png`),
put them in your project's `/public` folder, and reference them normally:

```html
<img src="/logo.png" alt="Daris Cleaning logo" style="height:40px;width:auto;border-radius:8px;">
...
<link rel="icon" type="image/png" href="/favicon.png">
```

This is also more reliable on Vercel specifically, since normal image files
get their own CDN caching — a broken inline string does not.
