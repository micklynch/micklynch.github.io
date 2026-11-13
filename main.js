// Michael Lynch — site behaviour

(function () {
    'use strict';

    var root = document.documentElement;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Footer year
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Email reveal — assembled here so scrapers don't harvest it from the source
    var link = document.getElementById('email-link');
    var text = document.getElementById('email-text');
    if (link && text) {
        link.addEventListener('click', function (e) {
            if (link.dataset.shown) return; // second click follows the mailto
            e.preventDefault();
            var email = 'michael.lynch' + '@' + 'outlook' + '.' + 'com';
            text.textContent = email;
            link.href = 'mailto:' + email;
            link.removeAttribute('aria-label');
            link.dataset.shown = '1';
        });
    }

    // Theme toggle — dark by default, choice remembered per browser
    var toggle = document.getElementById('theme-toggle');
    var themeMeta = document.querySelector('meta[name="theme-color"]');
    function paintTheme() {
        var light = root.dataset.theme === 'light';
        if (toggle) toggle.textContent = light ? 'dark' : 'light';
        if (themeMeta) themeMeta.content = light ? '#f7f6f2' : '#0c0d0f';
    }
    if (toggle) {
        toggle.addEventListener('click', function () {
            var next = root.dataset.theme === 'light' ? 'dark' : 'light';
            if (next === 'light') root.dataset.theme = 'light';
            else delete root.dataset.theme;
            try { localStorage.setItem('theme', next); } catch (e) {}
            paintTheme();
        });
    }
    paintTheme();

    // Status line — Toronto time
    var timeEl = document.getElementById('sl-time');
    if (timeEl) {
        var fmt;
        try {
            fmt = new Intl.DateTimeFormat('en-CA', {
                timeZone: 'America/Toronto', hour: '2-digit', minute: '2-digit', hour12: false
            });
        } catch (e) {}
        if (fmt) {
            var tick = function () { timeEl.textContent = fmt.format(new Date()); };
            tick();
            setInterval(tick, 30000);
        }
    }

    // Status line — current section and scroll position; also marks the active nav link
    var pathEl = document.getElementById('sl-path');
    var pctEl = document.getElementById('sl-pct');
    var sections = Array.prototype.slice.call(document.querySelectorAll('[data-path]'));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('nav.links a[href^="#"]'));
    var queued = false;

    function updateStatus() {
        queued = false;
        var max = root.scrollHeight - window.innerHeight;
        var y = window.scrollY;
        var atEnd = max > 0 && y >= max - 2;

        var current = sections[0];
        var line = window.innerHeight * 0.4;
        sections.forEach(function (s) {
            if (s.getBoundingClientRect().top <= line) current = s;
        });
        if (atEnd) current = sections[sections.length - 1];

        if (current && pathEl) pathEl.textContent = current.dataset.path;
        navLinks.forEach(function (a) {
            a.classList.toggle('on', !!current && a.getAttribute('href') === '#' + current.id);
        });

        if (pctEl) {
            if (max <= 0 || y <= 2) pctEl.textContent = 'top';
            else if (atEnd) pctEl.textContent = 'end';
            else pctEl.textContent = Math.round((y / max) * 100) + '%';
        }
    }
    function queueStatus() {
        if (queued) return;
        queued = true;
        requestAnimationFrame(updateStatus);
    }
    if (sections.length) {
        window.addEventListener('scroll', queueStatus, { passive: true });
        window.addEventListener('resize', queueStatus);
        updateStatus();
    }

    // Scroll reveal — content is only hidden once we know we can show it again
    var items = document.querySelectorAll('.reveal');
    if (reduced || !('IntersectionObserver' in window) || !items.length) return;

    root.classList.add('reveal-on');
    var io = new IntersectionObserver(function (entries) {
        var n = 0;
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            // Items arriving together cascade slightly.
            el.style.setProperty('--d', (n++ * 60) + 'ms');
            el.classList.add('in');
            io.unobserve(el);
            // Drop the stagger delay afterwards so hover transitions stay instant.
            setTimeout(function () { el.style.removeProperty('--d'); }, 1200);
        });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });

    items.forEach(function (el) { io.observe(el); });
})();
