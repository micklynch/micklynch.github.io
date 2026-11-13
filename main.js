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
})();
