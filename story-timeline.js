/* ============================================================================
   Joe's Journey — "My Story" left timeline  (hosted via GitHub, like storytime.js)

   A vertical year-ruler fixed to the LEFT edge. It slides out when the story
   sections enter view, the ruler glides as you scroll, a pink fill grows down
   the rail, and the year nearest the marker lights up.

   WEBFLOW SETUP — give each era section two attributes:
     <section data-story-era="Precambrian Era" data-story-years="1996-2008"> … </section>
   Years may be a range ("1996-2008") or one year ("2014"). Sections must be in
   chronological order. Then load this script before </body>:
     <script src="https://raw.githack.com/jacksonlaptop/joes-journey-code/main/story-timeline.js?v=1"></script>

   The rail shows/hides itself automatically: visible only while a
   [data-story-era] section is on screen.
   ============================================================================ */
(function () {
  window.JJ_TIMELINE_BUILD = 'T1 · left year-rail, scroll-driven';
  try { console.log('%c[JJ] story-timeline.js build: ' + window.JJ_TIMELINE_BUILD, 'color:#FF00F5;font-weight:bold'); } catch (e) {}

  var PX_PER_YEAR = 54;            // ruler density — bigger = years further apart
  var MARKER_VH = 0.44;            // the "now" line sits at this fraction of the viewport height

  function parseYears(s) {
    var m = String(s || '').match(/(\d{4})\s*[-–—]?\s*(\d{4})?/);
    if (!m) return null;
    return { a: +m[1], b: +(m[2] || m[1]) };
  }

  function init() {
    var sections = Array.prototype.slice.call(document.querySelectorAll('[data-story-era]'));
    if (!sections.length) return;
    var spans = sections.map(function (s) { return parseYears(s.getAttribute('data-story-years')); });
    var Y0 = Math.min.apply(null, spans.map(function (s) { return s.a; }));
    var Y1 = Math.max.apply(null, spans.map(function (s) { return s.b; }));

    var CSS =
      '#jjtl{position:fixed;left:0;top:0;bottom:0;width:86px;z-index:900;pointer-events:none;' +
        'transform:translateX(-100%);transition:transform .7s cubic-bezier(.22,1,.36,1);font-family:"Joes Journey Headline",Georgia,serif;}' +
      '#jjtl.on{transform:translateX(0);}' +
      '#jjtl .rail{position:absolute;left:56px;top:0;bottom:0;width:2px;background:rgba(255,255,255,.14);}' +
      '#jjtl .fill{position:absolute;left:55px;top:0;width:4px;height:0;border-radius:2px;' +
        'background:linear-gradient(180deg,#FF00F5,#ff7df4);box-shadow:0 0 10px rgba(255,0,245,.6);}' +
      '#jjtl .ruler{position:absolute;left:0;top:0;right:0;will-change:transform;}' +
      '#jjtl .yr{position:absolute;left:0;width:48px;text-align:right;font-size:12px;letter-spacing:.04em;' +
        'color:rgba(232,238,245,.34);transform:translateY(-50%);transition:color .25s ease,font-size .25s ease;}' +
      '#jjtl .yr.big{color:#fff;font-size:15px;text-shadow:0 0 12px rgba(255,0,245,.55);}' +
      '#jjtl .yr:after{content:"";position:absolute;right:-14px;top:50%;width:8px;height:2px;background:rgba(255,255,255,.22);}' +
      '#jjtl .yr.big:after{background:#FF00F5;width:12px;box-shadow:0 0 8px rgba(255,0,245,.7);}' +
      '#jjtl .now{position:absolute;left:47px;width:20px;height:20px;border-radius:50%;transform:translateY(-50%);' +
        'background:radial-gradient(circle at 38% 34%,#ff7df4,#FF00F5);box-shadow:0 0 14px rgba(255,0,245,.8);}';
    var st = document.createElement('style'); st.id = 'jjtl-style'; st.textContent = CSS; document.head.appendChild(st);

    var el = document.createElement('div'); el.id = 'jjtl';
    var yearsHtml = '';
    for (var y = Y0; y <= Y1; y++)
      yearsHtml += '<div class="yr" data-y="' + y + '" style="top:' + ((y - Y0) * PX_PER_YEAR) + 'px">' + y + '</div>';
    el.innerHTML = '<div class="rail"></div><div class="fill"></div><div class="ruler">' + yearsHtml + '</div><div class="now"></div>';
    document.body.appendChild(el);

    var ruler = el.querySelector('.ruler'), fill = el.querySelector('.fill'), now = el.querySelector('.now');
    var yrEls = Array.prototype.slice.call(el.querySelectorAll('.yr'));
    var lastBig = null, raf = null;

    /* current fractional year from scroll: inside section i, interpolate its year span */
    function currentYear() {
      var mid = window.innerHeight * MARKER_VH;
      var first = sections[0].getBoundingClientRect(), last = sections[sections.length - 1].getBoundingClientRect();
      if (first.top > mid) return Y0;
      if (last.bottom < mid) return Y1;
      for (var i = 0; i < sections.length; i++) {
        var r = sections[i].getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) {
          var t = Math.max(0, Math.min(1, (mid - r.top) / Math.max(1, r.height)));
          return spans[i].a + t * (spans[i].b - spans[i].a);
        }
        if (r.top > mid) {  /* between sections: hold at previous span's end */
          return spans[Math.max(0, i - 1)].b;
        }
      }
      return Y1;
    }

    function visible() {
      var mid = window.innerHeight * MARKER_VH;
      var first = sections[0].getBoundingClientRect(), last = sections[sections.length - 1].getBoundingClientRect();
      return first.top < window.innerHeight * 0.85 && last.bottom > mid;   /* slide out a beat before the first era arrives */
    }

    function render() {
      raf = null;
      el.classList.toggle('on', visible());
      var yy = currentYear();
      var markerY = window.innerHeight * MARKER_VH;
      var rulerShift = markerY - (yy - Y0) * PX_PER_YEAR;      /* keep the current year under the marker */
      ruler.style.transform = 'translateY(' + rulerShift.toFixed(1) + 'px)';
      fill.style.height = markerY + 'px';
      now.style.top = markerY + 'px';
      var big = Math.round(yy);
      if (big !== lastBig) {
        lastBig = big;
        for (var i = 0; i < yrEls.length; i++) yrEls[i].classList.toggle('big', +yrEls[i].getAttribute('data-y') === big);
      }
    }
    function onScroll() { if (!raf) raf = requestAnimationFrame(render); }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
