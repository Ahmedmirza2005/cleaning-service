/* ---------- COOKIE CONSENT BANNER ---------- */
/* Add this AFTER your i18n script, right before </body>. Also add the CSS below to your <style>. */

(function () {
  const KEY = "daris_cookie_consent";
  if (localStorage.getItem(KEY)) return; // already answered

  const texts = {
    fi: { msg: "Käytämme evästeitä parantaaksemme sivuston toimintaa.", accept: "Hyväksy", decline: "Hylkää" },
    sv: { msg: "Vi använder cookies för att förbättra webbplatsen.", accept: "Acceptera", decline: "Avvisa" },
    en: { msg: "We use cookies to improve this website.", accept: "Accept", decline: "Decline" }
  };
  const lang = document.documentElement.lang || "fi";
  const t = texts[lang] || texts.fi;

  const bar = document.createElement("div");
  bar.id = "cookieConsent";
  bar.innerHTML = `
    <p>${t.msg}</p>
    <div class="cookie-actions">
      <button id="cookieDecline">${t.decline}</button>
      <button id="cookieAccept">${t.accept}</button>
    </div>`;
  document.body.appendChild(bar);

  document.getElementById("cookieAccept").onclick = () => {
    localStorage.setItem(KEY, "accepted");
    bar.remove();
  };
  document.getElementById("cookieDecline").onclick = () => {
    localStorage.setItem(KEY, "declined");
    bar.remove();
  };
})();
