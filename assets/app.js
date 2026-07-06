/* Multi-Outlet Case Study — interactions & charts */
(function () {
  'use strict';

  var INK = '#1A1815', ACCENT = '#D4562A', ACCENT2 = '#2E5E4E',
      GOLD = '#B8862F', GRAY = '#8B8680', LINE = '#E4DFD5', CREAM = '#FBF9F5';

  /* ---------- reading progress bar ---------- */
  var progress = document.getElementById('progress');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop || document.body.scrollTop) / max * 100 : 0;
    progress.style.width = pct + '%';
    var nav = document.getElementById('nav');
    if ((h.scrollTop || document.body.scrollTop) > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav toggle ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function () { links.classList.toggle('open'); });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') links.classList.remove('open');
  });

  /* ---------- scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- charts ---------- */
  if (typeof Chart === 'undefined') return;

  Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
  Chart.defaults.color = INK;
  Chart.defaults.font.size = 12;

  function draw() {
    /* --- 1. Break-even waterfall --- */
    var wf = document.getElementById('waterfallChart');
    if (wf) {
      // floating bars: [start, end]
      new Chart(wf, {
        type: 'bar',
        data: {
          labels: ['Incremental\nrevenue', 'Rider\nwait', 'Extra\npackaging', 'Refund\nrisk', 'Tech &\nops', 'Net\nmargin'],
          datasets: [{
            data: [[0, 57], [57, 39.5], [39.5, 21], [21, 14], [14, 10], [0, 10]],
            backgroundColor: [ACCENT2, ACCENT, ACCENT, ACCENT, ACCENT, INK],
            borderRadius: 4,
            barPercentage: 0.66
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: INK, padding: 10, cornerRadius: 6,
              callbacks: {
                label: function (c) {
                  var v = c.raw, delta = Math.abs(v[1] - v[0]);
                  var idx = c.dataIndex;
                  if (idx === 0) return 'Incremental revenue: +₹57';
                  if (idx === 5) return 'Net incremental margin: ~₹10';
                  return 'Cost: −₹' + delta.toFixed(1);
                }
              }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 0, autoSkip: false, callback: function(v){ return this.getLabelForValue(v).split('\n'); } } },
            y: { grid: { color: LINE }, ticks: { callback: function (v) { return '₹' + v; } }, title: { display: true, text: '₹ per bundled order' } }
          }
        }
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', draw);
  else draw();
})();
