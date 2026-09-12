/* Monk x Nippon Paint - business case model + DSO trajectory chart
   Mirrors the Proof of Value workbook: every figure derives from the six inputs. */

(function () {
  'use strict';

  var ANNUAL_FEE = 84000;   // Full package; Core is 60000
  var HORIZON    = 3;       // years modelled

  /* brand tokens, resolved for SVG presentation attributes */
  var C = {
    primary:   '#E97221',
    highlight: '#FEEFB1',
    onDark:    '#FCFAF7',
    faint:     'rgba(252,250,247,.42)',
    grid:      'rgba(252,250,247,.10)',
    axis:      'rgba(252,250,247,.45)'
  };

  var $ = function (id) { return document.getElementById(id); };

  /* ---------- formatting ---------- */
  function usd(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

  function compact(n) {
    var abs = Math.abs(n);
    if (abs >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
    if (abs >= 1e3) return '$' + Math.round(n / 1e3) + 'K';
    return usd(n);
  }

  /* ---------- model ---------- */
  function model() {
    var rev    = +$('rev').value     || 0;
    var dso    = +$('dso').value     || 0;
    var days   = +$('days').value    || 0;
    var coc    = (+$('coc').value    || 0) / 100;
    var hire   = +$('hire').value    || 0;
    var growth = (+$('growth').value || 0) / 100;

    if (days > dso) { days = dso; }

    var years = [];
    for (var y = 0; y < HORIZON; y++) {
      var revY    = rev * Math.pow(1 + growth, y);
      var release = revY / 365 * days;   // working capital released that year
      var carry   = release * coc;       // what the released cash is worth annually
      years.push({ release: release, carry: carry, hire: hire, recurring: carry + hire });
    }

    var recurringTotal = years.reduce(function (s, y) { return s + y.recurring; }, 0);
    var y1 = years[0];

    return {
      dso:     dso,
      newDso:  dso - days,
      days:    days,
      perDay:  rev / 365,
      arNow:   rev / 365 * dso,
      arMonk:  rev / 365 * (dso - days),
      y1:      y1,
      // the release comes out once and stays out, so the three-year view takes the
      // final year's release rather than summing all three
      threeYear: recurringTotal + years[HORIZON - 1].release,
      roi:       ANNUAL_FEE > 0 ? y1.recurring / ANNUAL_FEE : 0,
      payback:   y1.recurring > 0 ? ANNUAL_FEE / (y1.recurring / 12) : 0
    };
  }

  /* ---------- render ---------- */
  function render() {
    var m = model();
    var round1 = function (v) { return Math.round(v * 10) / 10; };

    $('o-release').textContent   = compact(m.y1.release);
    $('o-recurring').textContent = compact(m.y1.recurring);
    $('o-threeyear').textContent = compact(m.threeYear);
    $('o-roi').textContent       = m.roi.toFixed(1) + '×';
    $('o-payback').textContent   = m.payback > 0 ? Math.max(1, Math.round(m.payback)) + ' mo' : '—';
    $('o-newdso').textContent    = round1(m.newDso);
    $('o-olddso').textContent    = round1(m.dso);
    $('o-perday').textContent    = usd(m.perDay);

    $('b-ar-now').textContent    = compact(m.arNow);
    $('b-ar-monk').textContent   = compact(m.arMonk);
    $('b-release').textContent   = compact(m.y1.release);
    $('b-carry').textContent     = compact(m.y1.carry);
    $('b-hire').textContent      = compact(m.y1.hire);
    $('b-total').textContent     = compact(m.y1.recurring);

    $('h-release').textContent   = compact(m.y1.release);
    $('h-days').textContent      = round1(m.days);

    drawChart(m.dso, m.newDso);
  }

  /* ---------- DSO trajectory ---------- */
  function drawChart(dsoNow, dsoTarget) {
    var host = $('chart');
    if (!host) { return; }

    var W = 940, H = 280, padL = 46, padR = 20, padT = 22, padB = 36;
    var months  = ['M1','M2','M3','M4','M5','M6','M7','M8','M9'];
    var GO_LIVE = 1;   // Monk goes live after the four-week implementation

    var monk = months.map(function (_, i) {
      if (i <= GO_LIVE) { return dsoNow; }
      var t = (i - GO_LIVE) / (months.length - 1 - GO_LIVE);
      return dsoNow - (dsoNow - dsoTarget) * (1 - Math.pow(1 - t, 2));
    });

    var lo = Math.min(dsoTarget, dsoNow) - 3;
    var hi = Math.max(dsoTarget, dsoNow) + 3;

    var x = function (i) { return padL + (W - padL - padR) * (i / (months.length - 1)); };
    var y = function (v) { return padT + (H - padT - padB) * (1 - (v - lo) / (hi - lo || 1)); };

    var path = function (vals) {
      return vals.map(function (v, i) {
        return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1);
      }).join(' ');
    };

    var grid = '', ticks = 4;
    for (var g = 0; g <= ticks; g++) {
      var val = lo + (hi - lo) * g / ticks;
      var gy  = y(val).toFixed(1);
      grid += '<line x1="' + padL + '" y1="' + gy + '" x2="' + (W - padR) + '" y2="' + gy + '" stroke="' + C.grid + '"/>' +
              '<text x="' + (padL - 10) + '" y="' + (+gy + 4) + '" text-anchor="end" fill="' + C.axis +
              '" font-size="11" font-family="Inter,sans-serif">' + Math.round(val) + '</text>';
    }

    var labels = months.map(function (mo, i) {
      return '<text x="' + x(i).toFixed(1) + '" y="' + (H - 12) + '" text-anchor="middle" fill="' + C.axis +
             '" font-size="11" font-family="Inter,sans-serif">' + mo + '</text>';
    }).join('');

    var band = '<rect x="' + x(GO_LIVE).toFixed(1) + '" y="' + padT + '" width="' + (W - padR - x(GO_LIVE)).toFixed(1) +
               '" height="' + (H - padT - padB) + '" fill="rgba(233,114,33,.06)"/>';

    var goLive = '<line x1="' + x(GO_LIVE).toFixed(1) + '" y1="' + padT + '" x2="' + x(GO_LIVE).toFixed(1) +
                 '" y2="' + (H - padB) + '" stroke="' + C.highlight + '" stroke-width="1" stroke-dasharray="4 4"/>' +
                 '<text x="' + (x(GO_LIVE) + 9).toFixed(1) + '" y="' + (padT + 14) + '" fill="' + C.highlight +
                 '" font-size="11" font-family="Inter,sans-serif">Monk goes live</text>';

    var endDot = '<circle cx="' + x(months.length - 1).toFixed(1) + '" cy="' + y(dsoTarget).toFixed(1) +
                 '" r="4.5" fill="' + C.primary + '"/>' +
                 '<text x="' + (x(months.length - 1) - 10).toFixed(1) + '" y="' + (y(dsoTarget) + 22).toFixed(1) +
                 '" text-anchor="end" fill="' + C.primary + '" font-size="15" font-family="\'Instrument Serif\',Georgia,serif">' +
                 (Math.round(dsoTarget * 10) / 10) + ' days</text>';

    var startDot = '<text x="' + (padL + 6) + '" y="' + (y(dsoNow) - 12).toFixed(1) + '" fill="' + C.faint +
                   '" font-size="15" font-family="\'Instrument Serif\',Georgia,serif">' +
                   (Math.round(dsoNow * 10) / 10) + ' days, do nothing</text>';

    host.innerHTML =
      '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="DSO holds at ' +
      Math.round(dsoNow) + ' days without change and falls to ' + (Math.round(dsoTarget * 10) / 10) +
      ' days with Monk">' +
      band + grid + labels + goLive + startDot +
      '<path d="' + path(months.map(function () { return dsoNow; })) + '" fill="none" stroke="' + C.faint +
      '" stroke-width="2" stroke-dasharray="5 5"/>' +
      '<path d="' + path(monk) + '" fill="none" stroke="' + C.primary +
      '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      endDot + '</svg>';
  }

  /* ---------- wiring ---------- */
  ['rev', 'dso', 'days', 'coc', 'hire', 'growth'].forEach(function (id) {
    var el = $(id);
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
      // "Monk average" is a 20% reduction against whatever DSO is in the model
      $('days').value = c.dataset.days === '11'
        ? Math.round(+$('dso').value * 0.2)
        : +c.dataset.days;
      syncChips();
      render();
    });
  });

  window.addEventListener('resize', render);
  render();
})();
