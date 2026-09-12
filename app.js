/* Monk x Nippon Paint - business case model + DSO chart
   Mirrors the Proof of Value workbook: every figure derives from the six inputs. */

(function () {
  'use strict';

  var ANNUAL_FEE = 84000;      // Full package; Core is 60000
  var HORIZON    = 3;          // years modelled

  var $ = function (id) { return document.getElementById(id); };

  var inputs = ['rev', 'dso', 'days', 'coc', 'hire', 'growth'].map($);

  /* ---------- formatting ---------- */
  function usd(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }
  function compact(n) {
    var abs = Math.abs(n);
    if (abs >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
    if (abs >= 1e3) return '$' + Math.round(n / 1e3) + 'K';
    return usd(n);
  }

  /* ---------- model ---------- */
  function model() {
    var rev    = +$('rev').value    || 0;
    var dso    = +$('dso').value    || 0;
    var days   = +$('days').value   || 0;
    var coc    = (+$('coc').value   || 0) / 100;
    var hire   = +$('hire').value   || 0;
    var growth = (+$('growth').value || 0) / 100;

    if (days > dso) { days = dso; }

    var years = [];
    for (var y = 0; y < HORIZON; y++) {
      var revY     = rev * Math.pow(1 + growth, y);
      var release  = revY / 365 * days;          // working capital released that year
      var carry    = release * coc;              // what the released cash earns
      years.push({
        revenue:   revY,
        release:   release,
        carry:     carry,
        hire:      hire,
        recurring: carry + hire
      });
    }

    var recurringTotal = years.reduce(function (s, y) { return s + y.recurring; }, 0);

    return {
      dso:       dso,
      newDso:    dso - days,
      days:      days,
      perDay:    rev / 365,
      arNow:     rev / 365 * dso,
      arMonk:    rev / 365 * (dso - days),
      y1:        years[0],
      // the release comes out once and stays out, so the 3-year view takes the final year,
      // not the sum of all three
      threeYear: recurringTotal + years[HORIZON - 1].release,
      roi:       ANNUAL_FEE > 0 ? years[0].recurring / ANNUAL_FEE : 0
    };
  }

  /* ---------- render ---------- */
  function render() {
    var m = model();

    $('o-release').textContent   = compact(m.y1.release);
    $('o-recurring').textContent = compact(m.y1.recurring);
    $('o-threeyear').textContent = compact(m.threeYear);
    $('o-roi').textContent       = m.roi.toFixed(1) + '×';
    $('o-newdso').textContent    = Math.round(m.newDso * 10) / 10;
    $('o-olddso').textContent    = Math.round(m.dso * 10) / 10;
    $('o-perday').textContent    = usd(m.perDay);

    $('b-ar-now').textContent    = compact(m.arNow);
    $('b-ar-monk').textContent   = compact(m.arMonk);
    $('b-release').textContent   = compact(m.y1.release);
    $('b-carry').textContent     = compact(m.y1.carry);
    $('b-hire').textContent      = compact(m.y1.hire);
    $('b-total').textContent     = compact(m.y1.recurring);

    drawChart(m.dso, m.newDso);
  }

  /* ---------- DSO chart ---------- */
  function drawChart(dsoNow, dsoTarget) {
    var host = $('chart');
    if (!host) { return; }

    var W = 900, H = 260, padL = 44, padR = 18, padT = 18, padB = 34;
    var months = ['M1','M2','M3','M4','M5','M6','M7','M8','M9'];
    var GO_LIVE = 1; // index of the month Monk goes live, after 4 weeks of implementation

    // easing from today's DSO down to the target once Monk is live
    var monk = months.map(function (_, i) {
      if (i <= GO_LIVE) { return dsoNow; }
      var t = (i - GO_LIVE) / (months.length - 1 - GO_LIVE);
      return dsoNow - (dsoNow - dsoTarget) * (1 - Math.pow(1 - t, 2));
    });

    var lo = Math.min(dsoTarget, dsoNow) - 3;
    var hi = Math.max(dsoTarget, dsoNow) + 3;

    var x = function (i) { return padL + (W - padL - padR) * (i / (months.length - 1)); };
    var y = function (v) { return padT + (H - padT - padB) * (1 - (v - lo) / (hi - lo || 1)); };

    var line = function (vals) {
      return vals.map(function (v, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); }).join(' ');
    };

    var grid = '', ticks = 4;
    for (var g = 0; g <= ticks; g++) {
      var val = lo + (hi - lo) * g / ticks;
      var gy  = y(val).toFixed(1);
      grid += '<line x1="' + padL + '" y1="' + gy + '" x2="' + (W - padR) + '" y2="' + gy + '" stroke="rgba(255,255,255,.06)"/>' +
              '<text x="' + (padL - 10) + '" y="' + (+gy + 4) + '" text-anchor="end" fill="#6E7789" font-size="11" font-family="monospace">' +
              Math.round(val) + '</text>';
    }

    var labels = months.map(function (mo, i) {
      return '<text x="' + x(i).toFixed(1) + '" y="' + (H - 10) + '" text-anchor="middle" fill="#6E7789" font-size="11" font-family="monospace">' + mo + '</text>';
    }).join('');

    var band = '<rect x="' + x(GO_LIVE).toFixed(1) + '" y="' + padT + '" width="' + (W - padR - x(GO_LIVE)).toFixed(1) +
               '" height="' + (H - padT - padB) + '" fill="rgba(195,242,74,.035)"/>';

    var goLive = '<line x1="' + x(GO_LIVE).toFixed(1) + '" y1="' + padT + '" x2="' + x(GO_LIVE).toFixed(1) + '" y2="' + (H - padB) +
                 '" stroke="#5EE0C0" stroke-width="1" stroke-dasharray="4 4"/>' +
                 '<text x="' + (x(GO_LIVE) + 8).toFixed(1) + '" y="' + (padT + 14) + '" fill="#5EE0C0" font-size="11" font-family="monospace">Monk goes live</text>';

    var endLabel = '<circle cx="' + x(months.length - 1).toFixed(1) + '" cy="' + y(dsoTarget).toFixed(1) +
                   '" r="4" fill="#C3F24A"/>' +
                   '<text x="' + (x(months.length - 1) - 8).toFixed(1) + '" y="' + (y(dsoTarget) + 20).toFixed(1) +
                   '" text-anchor="end" fill="#C3F24A" font-size="12" font-family="monospace">' +
                   (Math.round(dsoTarget * 10) / 10) + ' days</text>';

    host.innerHTML =
      '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" ' +
      'aria-label="DSO holds at ' + Math.round(dsoNow) + ' days without change and falls to ' + (Math.round(dsoTarget * 10) / 10) + ' days with Monk">' +
      band + grid + labels + goLive +
      '<path d="' + line(months.map(function () { return dsoNow; })) + '" fill="none" stroke="#6E7789" stroke-width="2" stroke-dasharray="5 5"/>' +
      '<path d="' + line(monk) + '" fill="none" stroke="#C3F24A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      endLabel +
      '</svg>';
  }

  /* ---------- wiring ---------- */
  inputs.forEach(function (el) {
    if (el) { el.addEventListener('input', function () { syncChips(); render(); }); }
  });

  var chips = [].slice.call(document.querySelectorAll('[data-scenario]'));

  function syncChips() {
    var days = +$('days').value;
    var pct  = Math.round(+$('dso').value * 0.2);
    chips.forEach(function (c) {
      var target = c.dataset.days === '11' ? pct : +c.dataset.days;
      c.setAttribute('aria-pressed', String(target === days));
    });
  }

  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      // "Monk average" is a 20% reduction on whatever DSO is currently in the model
      var days = c.dataset.days === '11'
        ? Math.round(+$('dso').value * 0.2)
        : +c.dataset.days;
      $('days').value = days;
      syncChips();
      render();
    });
  });

  window.addEventListener('resize', render);
  render();
})();
