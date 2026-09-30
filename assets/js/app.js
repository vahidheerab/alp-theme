(function () {
  'use strict';

  var fa = function (n) { return Number(n).toLocaleString('fa-IR'); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- toast ---------- */
  var toastWrap = $('#toastWrap');
  function toast(msg) {
    if (!toastWrap || !msg) return;
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7"/></svg><span></span>';
    el.lastChild.textContent = msg;
    toastWrap.appendChild(el);
    setTimeout(function () {
      el.style.transition = 'opacity .3s';
      el.style.opacity = '0';
      setTimeout(function () { el.remove(); }, 320);
    }, 4200);
  }

  /* ---------- sticky header ---------- */
  var header = $('#siteHeader');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-stuck', window.scrollY > 12); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- mega menu ---------- */
  var megaBtn = $('#megaColorBtn');
  var mega = $('#megaColor');
  if (megaBtn && mega) {
    var closeT;
    function megaOpen(state) {
      clearTimeout(closeT);
      mega.classList.toggle('is-open', state);
      megaBtn.setAttribute('aria-expanded', String(state));
    }
    var li = megaBtn.closest('nav');
    megaBtn.addEventListener('click', function () {
      megaOpen(!mega.classList.contains('is-open'));
    });
    if (window.matchMedia('(hover:hover)').matches) {
      var zone = [megaBtn, mega];
      zone.forEach(function (el) {
        el.addEventListener('mouseenter', function () { megaOpen(true); });
        el.addEventListener('mouseleave', function () { closeT = setTimeout(function () { megaOpen(false); }, 160); });
      });
      if (li) li.addEventListener('mouseleave', function () { closeT = setTimeout(function () { megaOpen(false); }, 160); });
      if (li) li.addEventListener('mouseenter', function () { clearTimeout(closeT); });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mega.classList.contains('is-open')) { megaOpen(false); megaBtn.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (mega.classList.contains('is-open') && !mega.contains(e.target) && e.target !== megaBtn && !megaBtn.contains(e.target)) megaOpen(false);
    });
  }

  /* ---------- drawer / search / backdrop ---------- */
  var backdrop = $('#backdrop');
  var drawer = $('#mobileDrawer');
  var menuBtn = $('#menuBtn');
  var searchOverlay = $('#searchOverlay');
  var lastFocus = null;

  function showBackdrop(on) {
    if (!backdrop) return;
    backdrop.hidden = false;
    requestAnimationFrame(function () { backdrop.classList.toggle('is-open', on); });
    document.body.style.overflow = on ? 'hidden' : '';
    if (!on) setTimeout(function () { backdrop.hidden = true; }, 260);
  }
  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    showBackdrop(true);
    var f = drawer.querySelector('button, a, input');
    if (f) f.focus();
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    showBackdrop(false);
    if (lastFocus) lastFocus.focus();
  }
  function openSearch() {
    if (!searchOverlay) return;
    lastFocus = document.activeElement;
    searchOverlay.classList.add('is-open');
    searchOverlay.setAttribute('aria-hidden', 'false');
    showBackdrop(true);
    var i = $('#overlaySearch');
    if (i) setTimeout(function () { i.focus(); }, 120);
  }
  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('is-open');
    searchOverlay.setAttribute('aria-hidden', 'true');
    showBackdrop(false);
    if (lastFocus) lastFocus.focus();
  }
  if (menuBtn) menuBtn.addEventListener('click', openDrawer);
  $$('[data-close-drawer]').forEach(function (b) { b.addEventListener('click', closeDrawer); });
  if (backdrop) backdrop.addEventListener('click', function () { closeDrawer(); closeSearch(); });
  ['#searchOpenBtn', '#searchNavBtn', '#searchNavBtn2'].forEach(function (s) {
    var b = $(s); if (b) b.addEventListener('click', openSearch);
  });
  $$('[data-close-search]').forEach(function (b) { b.addEventListener('click', closeSearch); });
  var drawerNavBtn = $('#drawerNavBtn');
  if (drawerNavBtn) drawerNavBtn.addEventListener('click', openDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (drawer && drawer.classList.contains('is-open')) closeDrawer();
    if (searchOverlay && searchOverlay.classList.contains('is-open')) closeSearch();
  });
  // rudimentary focus containment for the drawer
  if (drawer) {
    drawer.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = $$('a[href], button, input', drawer).filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------- nav active state ---------- */
  var page = document.body.getAttribute('data-page');
  $$('[data-nav="' + page + '"]').forEach(function (el) { el.setAttribute('aria-current', 'page'); });

  /* ---------- counters ---------- */
  function setCount(sel, n) {
    $$(sel).forEach(function (el) { el.textContent = fa(n); });
  }
  var cartCount = 2, wishCount = 3;

  /* ---------- wishlist / quick add / demo forms ---------- */
  document.addEventListener('click', function (e) {
    var wish = e.target.closest('.wish-btn, [data-wish]');
    if (wish) {
      e.preventDefault();
      var on = wish.getAttribute('aria-pressed') === 'true';
      wish.setAttribute('aria-pressed', String(!on));
      wishCount += on ? -1 : 1;
      setCount('[data-wishlist-count]', Math.max(wishCount, 0));
      toast(on ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد');
      return;
    }
    var add = e.target.closest('.quick-add, [data-add-cart]');
    if (add) {
      e.preventDefault();
      cartCount += 1;
      setCount('[data-cart-count]', cartCount);
      var name = add.getAttribute('data-product');
      toast(name ? name + ' به سبد خرید اضافه شد' : 'به سبد خرید اضافه شد');
      return;
    }
    var form = e.target.closest('[data-demo-form]');
    if (form && e.target.closest('[type="submit"]')) {
      /* handled on submit */
    }
    var tb = e.target.closest('[data-toast-btn]');
    if (tb) {
      e.preventDefault();
      toast(tb.getAttribute('data-toast-btn'));
    }
  });

  $$('[data-demo-form]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      toast(f.getAttribute('data-toast') || 'ثبت شد');
      f.reset();
    });
  });

  /* ---------- segmented buttons & base cards ---------- */
  $$('.seg').forEach(function (seg) {
    seg.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      $$('button', seg).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    });
  });
  $$('.base-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var group = card.parentElement;
      $$('.base-card', group).forEach(function (x) { x.setAttribute('aria-pressed', String(x === card)); });
      var note = $('#baseNote');
      if (note) {
        var label = card.getAttribute('data-label');
        note.textContent = label ? 'نتیجه تقریبی رنگ روی ' + label + ' نمایش داده می‌شود.' : '';
      }
    });
  });

  /* ---------- quantity stepper ---------- */
  $$('[data-qty]').forEach(function (q) {
    var out = $('output', q);
    q.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var v = parseInt(out.textContent.replace(/[^\d]/g, ''), 10) || 1;
      v = b.dataset.step === '+' ? v + 1 : Math.max(1, v - 1);
      out.textContent = fa(v);
    });
  });

  /* ---------- product gallery ---------- */
  var main = $('.gallery-main');
  if (main) {
    var mainImg = $('img', main);
    $$('[data-thumb]').forEach(function (t) {
      t.addEventListener('click', function () {
        var src = t.getAttribute('data-thumb');
        var alt = t.getAttribute('data-alt') || '';
        if (mainImg && src) { mainImg.src = src; mainImg.alt = alt; }
        $$('[data-thumb]').forEach(function (x) {
          x.setAttribute('aria-current', String(x === t));
          x.classList.toggle('ring-2', x === t);
          x.classList.toggle('ring-ink', x === t);
        });
      });
    });
    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      main.addEventListener('mousemove', function (e) {
        var r = main.getBoundingClientRect();
        main.style.setProperty('--zx', ((e.clientX - r.left) / r.width) * 100 + '%');
        main.style.setProperty('--zy', ((e.clientY - r.top) / r.height) * 100 + '%');
        main.classList.add('is-zoom');
      });
      main.addEventListener('mouseleave', function () { main.classList.remove('is-zoom'); });
    }
  }

  /* ---------- rails ---------- */
  $$('[data-rail-prev], [data-rail-next]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-rail-prev') || btn.getAttribute('data-rail-next');
      var rail = document.getElementById(id);
      if (!rail) return;
      var rtl = getComputedStyle(rail).direction === 'rtl';
      var dir = btn.hasAttribute('data-rail-next') ? -1 : 1;
      if (rtl) dir *= -1;
      rail.scrollBy({ left: dir * (rail.clientWidth * 0.8), behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  /* ---------- generic chip filters (home: colour finder) ---------- */
  var finder = $('#finder');
  if (finder) {
    var chips = $$('[data-fkey]', finder);
    var items = $$('[data-fitem]', finder);
    var countEl = $('#finderCount');
    var emptyEl = $('#finderEmpty');
    var clearBtn = $('#finderClear');

    function applyFinder() {
      var active = {};
      chips.forEach(function (c) {
        if (c.getAttribute('aria-pressed') === 'true') {
          var k = c.getAttribute('data-fkey');
          (active[k] = active[k] || []).push(c.getAttribute('data-fval'));
        }
      });
      var shown = 0;
      items.forEach(function (it) {
        var ok = Object.keys(active).every(function (k) {
          var vals = (it.getAttribute('data-' + k) || '').split(/\s+/);
          return active[k].some(function (v) { return vals.indexOf(v) > -1; });
        });
        it.hidden = !ok;
        if (ok) shown++;
      });
      if (countEl) {
        countEl.textContent = shown ? 'نمایش ' + fa(shown) + ' رنگ از ' + fa(items.length) + ' رنگ پیشنهادی' : 'نتیجه‌ای با این ترکیب پیدا نشد';
      }
      if (emptyEl) emptyEl.hidden = shown > 0;
      var n = Object.keys(active).length;
      if (clearBtn) clearBtn.hidden = n === 0;
    }
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true'));
        applyFinder();
      });
    });
    if (clearBtn) clearBtn.addEventListener('click', function () {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      applyFinder();
    });
    applyFinder();
  }

  /* ---------- PLP filtering / sorting ---------- */
  var plp = $('#plp');
  if (plp) {
    var checks = $$('input[data-fkey]', plp);
    var cards = $$('[data-plp]', plp);
    var activeWrap = $('#activeFilters');
    var resultCount = $('#resultCount');
    var plpEmpty = $('#plpEmpty');
    var sortSel = $('#sortSelect');

    function activeMap() {
      var m = {};
      checks.forEach(function (c) {
        if (c.checked) (m[c.getAttribute('data-fkey')] = m[c.getAttribute('data-fkey')] || []).push(c.getAttribute('data-fval'));
      });
      return m;
    }
    function renderChips() {
      if (!activeWrap) return;
      activeWrap.innerHTML = '';
      var m = activeMap();
      Object.keys(m).forEach(function (k) {
        m[k].forEach(function (v) {
          var lab = (checks.filter(function (c) { return c.getAttribute('data-fkey') === k && c.getAttribute('data-fval') === v; })[0] || {}).dataset.label || v;
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'filter-remove';
          b.innerHTML = '<span></span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
          b.firstChild.textContent = lab;
          b.setAttribute('aria-label', 'حذف فیلتر ' + lab);
          b.addEventListener('click', function () {
            var target = checks.filter(function (c) { return c.getAttribute('data-fkey') === k && c.getAttribute('data-fval') === v; })[0];
            if (target) target.checked = false;
            applyPLP();
          });
          activeWrap.appendChild(b);
        });
      });
      var n = activeWrap.children.length;
      var clr = $('#clearFilters');
      if (clr) clr.hidden = n === 0;
      activeWrap.hidden = n === 0;
    }
    function applyPLP(silent) {
      var m = activeMap();
      var shown = 0;
      cards.forEach(function (card) {
        var ok = Object.keys(m).every(function (k) {
          var vals = (card.getAttribute('data-' + k) || '').split(/\s+/);
          return m[k].some(function (v) { return vals.indexOf(v) > -1; });
        });
        card.hidden = !ok;
        if (ok) shown++;
      });
      if (resultCount) resultCount.textContent = fa(shown) + ' محصول';
      if (plpEmpty) plpEmpty.hidden = shown > 0;
      renderChips();
      syncCountBadges();
    }
    function syncCountBadges() {
      $$('.filter-count').forEach(function (el) {
        var key = el.getAttribute('data-for');
        var n = checks.filter(function (c) { return c.getAttribute('data-fkey') === key && c.checked; }).length;
        el.textContent = n ? '(' + fa(n) + ')' : '';
      });
    }
    checks.forEach(function (c) { c.addEventListener('change', function () { applyPLP(); }); });
    var clr = $('#clearFilters');
    if (clr) clr.addEventListener('click', function () {
      checks.forEach(function (c) { c.checked = false; });
      applyPLP();
    });
    if (sortSel) sortSel.addEventListener('change', function () {
      var mode = sortSel.value;
      var grid = cards[0] && cards[0].parentElement;
      if (!grid) return;
      var sorted = cards.slice().sort(function (a, b) {
        var pa = +a.getAttribute('data-price') || 0, pb = +b.getAttribute('data-price') || 0;
        var da = +a.getAttribute('data-date') || 0, db = +b.getAttribute('data-date') || 0;
        if (mode === 'cheap') return pa - pb;
        if (mode === 'expensive') return pb - pa;
        if (mode === 'new') return db - da;
        return (+b.getAttribute('data-rate') || 0) - (+a.getAttribute('data-rate') || 0);
      });
      sorted.forEach(function (c) { grid.appendChild(c); });
      toast('مرتب‌سازی اعمال شد');
    });
    applyPLP(true);
  }

  /* ---------- mobile filter sheet: move the single filter form in/out ---------- */
  var fSheet = $('#filterSheet');
  if (fSheet) {
    var fSlot = $('#filterSheetSlot');
    var fHome = $('#filtersHome');
    var fForm = $('#filters');
    var fBtn = $('#filterOpenBtn');
    if (fBtn && fSlot && fHome && fForm) {
      fBtn.addEventListener('click', function () {
        if (!fSlot.contains(fForm)) fSlot.appendChild(fForm);
        if (typeof fSheet.showModal === 'function') fSheet.showModal();
      });
      fSheet.addEventListener('close', function () {
        if (!fHome.contains(fForm)) fHome.appendChild(fForm);
      });
    }
  }

  /* ---------- mobile sheets (dialogs) ---------- */
  $$('[data-dialog-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var d = document.getElementById(btn.getAttribute('data-dialog-open'));
      if (d && typeof d.showModal === 'function') d.showModal();
    });
  });
  $$('[data-dialog-close]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var d = btn.closest('dialog');
      if (d) d.close();
    });
  });

  /* ---------- wishlist counter init ---------- */
  setCount('[data-wishlist-count]', wishCount);
  setCount('[data-cart-count]', cartCount);
})();
