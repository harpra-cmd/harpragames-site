// Cookie-free visit and event counting for harpragames.com (GoatCounter).
//
// OFF until GOATCOUNTER below is set to the account's code. While it is empty
// nothing is sent anywhere, which is what the privacy policy says today.
// TURNING IT ON IS ONE CHANGE IN TWO PLACES: set the code here AND replace the
// "This website" section of knighted/privacy.html (and docs/PRIVACY_POLICY.md)
// with the analytics wording in site/README.md -- the policy must never lag.
//
// What it counts, and nothing else: page views (path, no query string, no
// cookies, no personal data), and events --
//   arrive/<source>   how a visitor reached Get Knighted! (qr, share-daily, ...,
//                     direct, site) -- getknighted.html sends it
//   tap/<name>        a tap on a link marked data-count="<name>"
//   view/<name>       something shown, e.g. view/iphone-soon
// Sent with fetch(keepalive), so a count made just before the page sends a
// phone on to its store still arrives. No script is loaded from GoatCounter.
(function () {
    var GOATCOUNTER = '';   // e.g. 'harpragames' for https://harpragames.goatcounter.com

    function count(path, title, isEvent) {
        if (!GOATCOUNTER) return;
        var q = 'p=' + encodeURIComponent(path) +
                '&t=' + encodeURIComponent(title || path) +
                (isEvent ? '&e=true' : '&r=' + encodeURIComponent(document.referrer || '')) +
                '&s=' + encodeURIComponent(screen.width + ',' + screen.height + ',' + (window.devicePixelRatio || 1)) +
                '&rnd=' + Math.random().toString(36).slice(2);
        try {
            fetch('https://' + GOATCOUNTER + '.goatcounter.com/count?' + q,
                  { mode: 'no-cors', keepalive: true, credentials: 'omit' });
        } catch (e) { /* counting must never break the page */ }
    }
    window.hgCount = count;

    count(location.pathname, document.title, false);
    document.addEventListener('click', function (e) {
        var el = e.target.closest && e.target.closest('[data-count]');
        if (el) count('tap/' + el.getAttribute('data-count'), el.textContent.trim(), true);
    });
})();
