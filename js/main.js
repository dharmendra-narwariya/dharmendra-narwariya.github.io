(function () {
  'use strict';

  var EMAIL = 'dharmendra.narwariya03@gmail.com';
  var root = document.documentElement;

  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* Footer year */
  var yr = $('#year');
  if (yr) { yr.textContent = new Date().getFullYear(); }

  /* Theme toggle */
  var themeBtn = $('#theme-btn');
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) { return t === 'dark'; }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* Mobile menu */
  var menuBtn = $('#menu-btn');
  var nav = $('#nav-links');
  function setMenu(open) {
    if (!menuBtn || !nav) { return; }
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    $all('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); } });
  }

  /* Scroll progress */
  var bar = $('#progress');
  var ticking = false;
  function updateProgress() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
    if (bar) { bar.style.width = (p * 100).toFixed(2) + '%'; }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(updateProgress); }
  }, { passive: true });
  updateProgress();

  /* Scrollspy */
  if ('IntersectionObserver' in window && nav) {
    var links = {};
    $all('a[href^="#"]', nav).forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && links[en.target.id]) {
          Object.keys(links).forEach(function (k) { links[k].removeAttribute('aria-current'); });
          links[en.target.id].setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) { spy.observe(s); }
    });
  }

  /* Filters */
  $all('[data-filter-group]').forEach(function (group) {
    var name = group.getAttribute('data-filter-group');
    var items = $all('[data-filter-item="' + name + '"]');
    var count = $('[data-filter-count="' + name + '"]');
    var buttons = $all('button', group);
    function apply(value) {
      var shown = 0;
      items.forEach(function (it) {
        var tags = (it.getAttribute('data-match') || '').split(/\s+/);
        var ok = value === 'all' || tags.indexOf(value) !== -1;
        it.hidden = !ok;
        if (ok) { shown++; }
      });
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-value') === value ? 'true' : 'false');
      });
      if (count) { count.textContent = 'Showing ' + shown + ' of ' + items.length; }
    }
    buttons.forEach(function (b) {
      b.addEventListener('click', function () { apply(b.getAttribute('data-value')); });
    });
  });

  /* Copy helper with fallback */
  function copyText(text, sourceEl) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      if (ok) { resolve(); return; }
      if (sourceEl && sourceEl.select) { sourceEl.select(); }
      reject(new Error('copy failed'));
    });
  }
  function flash(btn, msg) {
    var old = btn.getAttribute('data-label') || btn.textContent;
    btn.setAttribute('data-label', old);
    btn.textContent = msg;
    window.setTimeout(function () { btn.textContent = old; }, 1600);
  }

  $all('.copy[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      copyText(b.getAttribute('data-copy')).then(
        function () { flash(b, 'Copied'); },
        function () { flash(b, 'Press Ctrl+C'); }
      );
    });
  });

  /* Enquiry composer */
  var form = $('#composer');
  if (form) {
    var fName = $('#f-name'), fService = $('#f-service'), fStack = $('#f-stack'),
        fWhen = $('#f-when'), fOut = $('#f-out'), mail = $('#mail-link'), copyBtn = $('#copy-msg');

    var compose = function (name, service, stack, when) {
      var who = name && name.trim() ? name.trim() : 'a visitor to your portfolio';
      var lines = ['Hello Dharmendra,', ''];
      if (service === 'Not sure yet') {
        lines.push('I am ' + who + '. I am not sure which service fits yet and would like your advice.');
      } else if (service === 'A role with my company') {
        lines.push('I am ' + who + '. I would like to talk about a role with my company.');
      } else {
        lines.push('I am ' + who + '. I would like to talk about: ' + service + '.');
      }
      if (stack && stack.trim()) { lines.push('', 'My stack or goal: ' + stack.trim()); }
      lines.push('', 'Timeline: ' + when + '.', '', 'Could we set up a short call?', '', 'Thank you' + (name && name.trim() ? ',\n' + name.trim() : ''));
      return { subject: 'Enquiry: ' + service, body: lines.join('\n') };
    };

    var refresh = function () {
      var m = compose(fName.value, fService.value, fStack.value, fWhen.value);
      fOut.value = m.body;
      mail.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(m.subject) + '&body=' + encodeURIComponent(m.body);
    };

    [fName, fService, fStack, fWhen].forEach(function (el) {
      el.addEventListener('input', refresh);
      el.addEventListener('change', refresh);
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    copyBtn.addEventListener('click', function () {
      copyText(fOut.value, fOut).then(
        function () { flash(copyBtn, 'Copied'); },
        function () { flash(copyBtn, 'Press Ctrl+C'); }
      );
    });

    /* Links that preselect a service */
    $all('[data-service]').forEach(function (a) {
      a.addEventListener('click', function () {
        var v = a.getAttribute('data-service');
        for (var i = 0; i < fService.options.length; i++) {
          if (fService.options[i].text === v) { fService.selectedIndex = i; break; }
        }
        refresh();
      });
    });
    refresh();
  }
})();
