// Cookie-free visit and event counting for harpragames.com (Umami Cloud,
// owner's account on harpragames@gmail.com, chosen 2026-10-26 over Google
// Analytics: no cookies means no consent banner, so every arrival on the
// instant-redirect page is counted, and the "no cookies" promise holds).
//
// No script is loaded from Umami: this file talks to Umami's collection
// endpoint itself, so the site still loads nothing from other sites. Counts
// are sent only from harpragames.com itself (never from a local preview).
// The privacy policy's "This website" section describes exactly this -- change
// both together (site/README.md).
//
// What it counts, and nothing else:
//   page views     path and query (our own tags only: ?src=, &look=, &p=),
//                  page title, referring site, screen size, browser language;
//                  Umami derives country and device from the request and
//                  stores no IP address and sets no cookie
//   events         arrive: <source>     how a visitor reached Get Knighted!
//                  redirect: <store>    sent on to Google Play / the App Store
//                  view: <name>         something shown (iphone-soon)
//                  tap: <name>          a tap on a link marked data-count="<name>"
//                  open: <question>     a Help question opened
// window.hgCount(name, data) returns a promise that settles when the count is
// sent (or after a short wait), so a page can count just before it navigates.
(function () {
    var WEBSITE_ID = 'e80c721c-479c-4ebc-9af0-3729eff6a429';
    var ENDPOINT = 'https://cloud.umami.is/api/send';
    var LIVE = location.hostname === 'harpragames.com';

    function send(extra) {
        if (!LIVE) return Promise.resolve();
        var payload = {
            website: WEBSITE_ID,
            hostname: location.hostname,
            url: location.pathname + location.search,
            title: document.title,
            referrer: document.referrer || '',
            screen: screen.width + 'x' + screen.height,
            language: navigator.language || ''
        };
        for (var k in extra) payload[k] = extra[k];
        try {
            var sent = fetch(ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'event', payload: payload }),
                keepalive: true,
                credentials: 'omit'
            }).catch(function () {});
            // Never hold a visitor up for more than a moment.
            return Promise.race([sent, new Promise(function (r) { setTimeout(r, 600); })]);
        } catch (e) { return Promise.resolve(); }   // counting must never break the page
    }

    window.hgCount = function (name, data) {
        return send(data ? { name: name, data: data } : { name: name });
    };

    send({});   // the page view

    document.addEventListener('click', function (e) {
        var el = e.target.closest && e.target.closest('[data-count]');
        if (el) window.hgCount('tap: ' + el.getAttribute('data-count'));
    });
    // Which Help questions people open (support page <details>).
    document.addEventListener('toggle', function (e) {
        var d = e.target;
        if (d.tagName === 'DETAILS' && d.open) {
            var s = d.querySelector('summary');
            if (s) window.hgCount('open: ' + s.textContent.trim().slice(0, 42));
        }
    }, true);
})();
