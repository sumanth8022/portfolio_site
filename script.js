(function () {
  'use strict';
  var EMAIL = 'gollasumanth9@gmail.com';
  // FormSubmit forwards every submission to this address (see setup note in README)
  var ENDPOINT = 'https://formsubmit.co/ajax/' + EMAIL;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  /* Theme toggle */
  var root = document.documentElement, themeBtn = $('#themeBtn');
  function paintTheme() {
    var dark = root.getAttribute('data-theme') === 'dark';
    themeBtn.textContent = dark ? '☀️' : '🌙';
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', dark ? '#0b1020' : '#f7f9fc');
  }
  paintTheme();
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    paintTheme();
  });

  /* Mobile menu */
  var nav = $('#nav'), menuBtn = $('#menuBtn');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.textContent = open ? '✕' : '☰';
  });
  $$('#nav a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('open'); menuBtn.textContent = '☰'; menuBtn.setAttribute('aria-expanded', 'false'); });
  });

  /* Scroll progress, back-to-top, active link */
  var progress = $('#progress'), toTop = $('#toTop');
  var sections = $$('main section[id]');
  var links = $$('#nav a.link');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    toTop.classList.toggle('show', h.scrollTop > 600);
    var cur = '';
    sections.forEach(function (s) { if (s.getBoundingClientRect().top <= 120) cur = s.id; });
    links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + cur); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* Reveal on scroll */
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  } else { $$('.reveal').forEach(function (el) { el.classList.add('in'); }); }

  /* Count-up stats */
  function countUp(el) {
    var to = parseFloat(el.dataset.to), dec = parseInt(el.dataset.dec || '0', 10), plain = el.dataset.plain;
    if (reduce) { el.textContent = to.toFixed(dec); return; }
    var start = null, dur = 1300;
    var from = plain ? to - 40 : 0;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      var val = from + (to - from) * eased;
      el.textContent = plain ? Math.round(val) : val.toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    $$('.count-up').forEach(function (el) { co.observe(el); });
  }

  /* Typing headline */
  var phrases = ['Java Developer', 'Backend Developer', 'Software Engineer', 'Software Developer', 'Associate Developer'];
  var typed = $('#typed'), pi = 0, ci = 0, del = false;
  function tick() {
    var word = phrases[pi];
    if (!del) { ci++; typed.textContent = '> ' + word.slice(0, ci); if (ci === word.length) { del = true; return setTimeout(tick, 1500); } }
    else { ci--; typed.textContent = '> ' + word.slice(0, ci); if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; } }
    setTimeout(tick, del ? 45 : 85);
  }
  if (reduce) { typed.textContent = '> ' + phrases[0]; } else { tick(); }

  /* Code card: types out the Developer class, then "runs" it */
  var codeEl = $('#code'), status = $('#runStatus');
  var lines = [
    ['01', '<span class="k">public class</span> <span class="t">Developer</span> {'],
    ['02', '  <span class="t">String</span> name = <span class="s">"Sumanth"</span>;'],
    ['03', '  <span class="t">String</span> focus = <span class="s">"Backend"</span>;'],
    ['04', '  <span class="t">String</span>[] stack = {'],
    ['05', '    <span class="s">"Java"</span>, <span class="s">"Spring Boot"</span>,'],
    ['06', '    <span class="s">"MySQL"</span>, <span class="s">"AI"</span>'],
    ['07', '  };'],
    ['08', '}']
  ];
  function renderCode(n) {
    codeEl.innerHTML = lines.slice(0, n).map(function (l) { return '<span class="n">' + l[0] + '</span>' + l[1]; }).join('\n');
  }
  if (reduce) { renderCode(lines.length); }
  else {
    var li = 0;
    (function addLine() {
      renderCode(++li);
      if (li < lines.length) setTimeout(addLine, 380);
      else {
        status.textContent = '● Compiling...';
        setTimeout(function () { status.textContent = '✓ Ready to build'; }, 1100);
      }
    })();
  }
  $('.code-card').addEventListener('click', function () { renderCode(0); status.textContent = '● Compiling...'; var j = 0;
    (function again() { renderCode(++j); if (j < lines.length) setTimeout(again, 220); else setTimeout(function () { status.textContent = '✓ Ready to build'; }, 600); })(); });

  /* Project filter + details toggle */
  $$('.filter').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.filter').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      var f = b.dataset.f;
      $$('.proj').forEach(function (p) {
        var show = f === 'all' || p.dataset.cat.split(' ').indexOf(f) > -1;
        p.classList.toggle('hide', !show);
      });
    });
  });
  $$('.proj .toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      var card = b.closest('.proj'), open = card.classList.toggle('open');
      b.textContent = open ? 'Details ▴' : 'Details ▾';
    });
  });

  /* Copy email */
  $('#copyEmail').addEventListener('click', function () {
    function ok() { toast('Email copied ✓'); }
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(EMAIL).then(ok, function () { toast(EMAIL); }); }
    else { toast(EMAIL); }
  });

  /* Contact form */
  var form = $('#contactForm'), sendBtn = $('#sendBtn'), sendLabel = $('#sendLabel'), box = $('#formStatus');
  var msg = $('#message'), chars = $('#chars');
  msg.addEventListener('input', function () { chars.textContent = msg.value.length; });

  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
  function mark(input, bad) { input.closest('.field').classList.toggle('err', bad); return !bad; }

  function showStatus(kind, html) { box.className = 'status-box ' + kind; box.innerHTML = html; }

  function mailtoLink(d) {
    var body = 'Name: ' + d.name + '\nEmail: ' + d.email + '\n\n' + d.message;
    return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('[Portfolio] ' + d.topic + ' - ' + d.name) + '&body=' + encodeURIComponent(body);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    box.className = 'status-box';
    var f = form.elements;
    var d = { name: f.name.value.trim(), email: f.email.value.trim(), topic: f.topic.value, message: f.message.value.trim() };
    var ok = true;
    ok = mark(f.name, d.name.length < 2) && ok;
    ok = mark(f.email, !validEmail(d.email)) && ok;
    ok = mark(f.message, d.message.length < 10) && ok;
    if (!ok) { var first = $('.field.err input, .field.err textarea', form); if (first) first.focus(); return; }

    // Honeypot: silently pretend success for bots
    if (f._honey.value) { showStatus('ok', 'Thanks! Your message was sent.'); form.reset(); return; }

    sendBtn.disabled = true; sendLabel.textContent = 'Sending...';

    var payload = {
      name: d.name,
      email: d.email,
      topic: d.topic,
      message: d.message,
      _subject: '[Portfolio] ' + d.topic + ' from ' + d.name,
      _replyto: d.email,
      _template: 'table',
      _captcha: 'false'
    };

    var controller = ('AbortController' in window) ? new AbortController() : null;
    var timer = setTimeout(function () { if (controller) controller.abort(); }, 15000);

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    })
    .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
    .then(function (res) {
      clearTimeout(timer);
      var success = res.ok && (res.j.success === true || res.j.success === 'true');
      if (success) {
        showStatus('ok', '✓ Thanks, ' + d.name.split(' ')[0] + '! Your message was sent. I\'ll reply to ' + d.email + ' soon.');
        form.reset(); chars.textContent = '0';
      } else {
        throw new Error(res.j.message || 'send failed');
      }
    })
    .catch(function () {
      clearTimeout(timer);
      showStatus('bad', 'Sorry, that didn\'t go through. <a href="' + mailtoLink(d) + '">Click here to email me directly</a> with your message pre-filled.');
    })
    .then(function () { sendBtn.disabled = false; sendLabel.textContent = 'Send message ✉'; });
  });

  ['name', 'email', 'message'].forEach(function (id) {
    $('#' + id).addEventListener('input', function () { this.closest('.field').classList.remove('err'); });
  });
})();
