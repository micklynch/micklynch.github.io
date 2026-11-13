// Michael Lynch — site behaviour

(function () {
    'use strict';

    // Footer year
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Email reveal — obfuscated in source so scrapers don't harvest it
    var link = document.getElementById('email-link');
    var text = document.getElementById('email-text');
    if (link && text) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var email = 'michael.lynch' + '@' + 'outlook' + '.' + 'com';
            text.textContent = email;
            link.href = 'mailto:' + email;
        });
    }

    // Scroll reveal
    var items = document.querySelectorAll('.reveal');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !('IntersectionObserver' in window)) {
        items.forEach(function (el) { el.classList.add('in'); });
        return;
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, i) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            // Stagger siblings slightly so cards cascade in.
            setTimeout(function () { el.classList.add('in'); }, i * 60);
            io.unobserve(el);
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

    items.forEach(function (el) { io.observe(el); });
})();