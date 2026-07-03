/* ============================================================================
   Joe's Journey — accurate page loader  (hosted via GitHub + raw.githack.com)

   A REAL progress loader, not a timed spinner. It measures the actual bytes of a
   known set of heavy assets as they download and moves Joe by that true %.
   Two looks (A/B):
     variant:'journey' — whole route on screen, Joe trots past the story landmarks
     variant:'scroll'  — Joe centred, the world slides past him, progress bar below
   Joe is a FEW-FRAME trot cycle (frames:[url,url,...] @ fps). Reveals only when the
   assets are truly ready (+ a small minTime so fast loads still read as a journey).

     JJLoader.start({
       variant:'journey',                       // or 'scroll'
       assets:['https://.../fly-2.riv', ...],   // what to gate on (real bytes)
       frames:['joe-trot-1.png', ... ], fps:8,  // the trot cycle
       minTime:900, maxWait:15000, decode:true,
       onReady:function(){ ...start the intro / fade the page in... }
     });
   No fake trickle: the bar only moves on real bytes; it eases toward the true
   value (never past it). Supply opts.driver(onProgress,onDone) to feed your own
   source (e.g. an AJAX page fetch, or a controlled demo).
   ============================================================================ */
(function () {
  var JJ = (window.JJLoader = window.JJLoader || {});
  JJ.version = 'jjloader-2';

  /* ---------- 1. MEASURE: true byte progress of a known asset set ---------- */
  function measure(urls, onProgress, onReady) {
    urls = (urls || []).filter(Boolean);
    if (!urls.length) { onProgress(1); onReady(); return; }
    var NOMINAL = 400 * 1024, size = {}, got = {}, done = {}, finished = false;
    function total() { var t = 0; urls.forEach(function (u) { t += (size[u] || NOMINAL); }); return t; }
    function loaded() { var l = 0; urls.forEach(function (u) { l += Math.min(got[u] || 0, size[u] || NOMINAL); }); return l; }
    function tick() {
      if (finished) return;
      onProgress(Math.min(0.999, loaded() / total()));
      if (urls.every(function (u) { return done[u]; })) { finished = true; onProgress(1); onReady(); }
    }
    function complete(u) { got[u] = size[u] = (size[u] || got[u] || NOMINAL); done[u] = true; tick(); }
    urls.forEach(function (u) {
      got[u] = 0;
      fetch(u, { cache: 'force-cache', mode: 'cors' }).then(function (res) {
        var len = +res.headers.get('content-length'); if (len > 0) size[u] = len;
        if (!res.body || !res.body.getReader) { res.arrayBuffer().then(function (b) { got[u] = b.byteLength; if (!size[u]) size[u] = b.byteLength; done[u] = true; tick(); }).catch(function () { complete(u); }); return; }
        var reader = res.body.getReader();
        (function pump() { reader.read().then(function (r) { if (r.done) { if (!size[u]) size[u] = got[u]; done[u] = true; tick(); return; } got[u] += r.value.length; tick(); pump(); }).catch(function () { complete(u); }); })();
        tick();
      }).catch(function () { complete(u); });
    });
    tick();
  }
  function decodeImgs(urls, cb) {
    var left = 0, fired = false; function one() { if (--left <= 0 && !fired) { fired = true; cb(); } }
    (urls || []).forEach(function (u) { if (/\.(png|jpe?g|webp|gif|avif|svg)(\?|$)/i.test(u)) { left++; var im = new Image(); im.onload = im.onerror = one; im.src = u; } });
    if (left === 0) cb();
  }

  /* ---------- shape helpers (story landmarks) ---------- */
  function house(c){ return '<polygon points="-18,0 0,-16 18,0" fill="'+c+'"/><rect x="-15" y="0" width="30" height="22" fill="'+c+'"/><rect x="-4" y="8" width="9" height="14" fill="#2a2030"/>'; }
  function mug(c){ return '<rect x="-11" y="-4" width="20" height="26" rx="3" fill="'+c+'"/><rect x="7" y="2" width="9" height="14" rx="4" fill="none" stroke="'+c+'" stroke-width="4"/><ellipse cx="-1" cy="-5" rx="12" ry="5" fill="#fff7e6"/>'; }
  function pine(c){ return '<rect x="-3" y="18" width="6" height="10" fill="#5a4632"/><polygon points="0,-14 -14,6 14,6" fill="'+c+'"/><polygon points="0,-2 -16,20 16,20" fill="'+c+'"/>'; }
  function mtn(c){ return '<polygon points="-22,22 -2,-20 16,22" fill="'+c+'"/><polygon points="-2,-20 -9,-6 5,-6" fill="#e9eef7"/><polygon points="6,22 22,-6 34,22" fill="'+c+'"/>'; }
  function castle(c){ return '<rect x="-26" y="-6" width="52" height="40" fill="'+c+'"/><rect x="-26" y="-16" width="10" height="12" fill="'+c+'"/><rect x="-6" y="-16" width="12" height="12" fill="'+c+'"/><rect x="16" y="-16" width="10" height="12" fill="'+c+'"/><rect x="-4" y="14" width="10" height="20" fill="#2a2030"/><line x1="22" y1="-16" x2="22" y2="-42" stroke="'+c+'" stroke-width="3"/><polygon points="22,-42 44,-36 22,-30" fill="#FF00F5"/>'; }
  var STARS = '<circle cx="120" cy="50" r="2" fill="#fff" opacity=".5"/><circle cx="300" cy="35" r="1.5" fill="#fff" opacity=".4"/><circle cx="560" cy="60" r="2" fill="#fff" opacity=".5"/><circle cx="820" cy="40" r="1.5" fill="#fff" opacity=".4"/><circle cx="700" cy="85" r="1.5" fill="#fff" opacity=".35"/><circle cx="440" cy="80" r="1.3" fill="#fff" opacity=".3"/>';
  var DEFS = '<defs><linearGradient id="jjsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1226"/><stop offset="1" stop-color="#05070d"/></linearGradient></defs>';

  var CSS =
    '#jjld{position:fixed;inset:0;z-index:2147483000;background:#05070d;display:flex;align-items:center;justify-content:center;transition:opacity .6s ease;font-family:"Joes Journey Headline",Georgia,serif;}' +
    '#jjld.hide{opacity:0;pointer-events:none;}' +
    '#jjld svg{width:min(88vw,1000px);height:auto;overflow:visible;}' +
    '#jjld .wp{opacity:.34;transition:opacity .45s ease,filter .45s ease;}' +
    '#jjld .wp.lit{opacity:1;filter:drop-shadow(0 0 7px rgba(255,45,149,.75));}' +
    '#jjld .pct{fill:#f0e4c4;font-size:30px;}#jjld .cap{fill:rgba(240,228,196,.55);font-size:13px;letter-spacing:4px;}' +
    '#jjld .trail{transition:none;}';

  function mount(html) {
    if (!document.getElementById('jjld-style')) { var st = document.createElement('style'); st.id = 'jjld-style'; st.textContent = CSS; document.head.appendChild(st); }
    var el = document.createElement('div'); el.id = 'jjld'; el.innerHTML = html; document.body.appendChild(el); return el;
  }
  function joeSvg(frames) {
    return frames && frames.length ? '<image class="joe" href="' + frames[0] + '" />' : '<circle class="joe" r="10" fill="#FF00F5"/>';
  }

  /* ---------- VARIANT A — the journey (whole route in view) ---------- */
  function Journey(opts, frames) {
    var ROUTE = 'M15,252 C150,252 230,234 360,240 S600,258 745,240 S915,226 985,236';
    var WP = [ {x:120,at:.10,s:house('#3a4256'),lc:'#ff7df4'}, {x:320,at:.30,s:mug('#3a4256'),lc:'#ff7df4'},
      {x:515,at:.52,s:pine('#3a5a48'),lc:'#4fbf87'}, {x:720,at:.74,s:mtn('#3a4256'),lc:'#8a93a8'}, {x:935,at:.97,s:castle('#556'),lc:'#8a93a8'} ];
    var wpHtml = WP.map(function (w, i) { return '<g class="wp" id="jjwp' + i + '" transform="translate(' + w.x + ',150)">' + w.s + '</g>'; }).join('');
    var el = mount(
      '<svg viewBox="0 0 1000 320">' + DEFS +
        '<rect x="-50" y="-50" width="1100" height="420" fill="url(#jjsky)"/>' + STARS +
        '<path d="M-50,250 Q200,215 460,245 T980,235 L980,330 L-50,330 Z" fill="#141b2b"/>' + wpHtml +
        '<path d="' + ROUTE + '" fill="none" stroke="#2c3346" stroke-width="12" stroke-linecap="round"/>' +
        '<path d="' + ROUTE + '" fill="none" stroke="#232a3a" stroke-width="12" stroke-linecap="round" stroke-dasharray="3 18"/>' +
        '<path class="trail" d="' + ROUTE + '" fill="none" stroke="#FF00F5" stroke-width="8" stroke-linecap="round" opacity=".9"/>' +
        joeSvg(frames) +
        '<text class="pct" x="500" y="293" text-anchor="middle">0%</text>' +
        '<text class="cap" x="500" y="314" text-anchor="middle">THE JOURNEY</text>' +
      '</svg>');
    var trail = el.querySelector('.trail'), L = trail.getTotalLength();
    trail.style.strokeDasharray = L; trail.style.strokeDashoffset = L;
    var joe = el.querySelector('.joe'), JH = 66, JW = JH * 200 / 175, FOOT = 150 / 175;
    if (joe.tagName.toLowerCase() === 'image') { joe.setAttribute('width', JW); joe.setAttribute('height', JH); }
    var pct = el.querySelector('.pct');
    return { el: el, joe: joe, render: function (p) {
      var pt = trail.getPointAtLength(Math.max(0.001, Math.min(0.999, p)) * L);
      if (joe.tagName.toLowerCase() === 'image') { joe.setAttribute('x', (pt.x - JW / 2).toFixed(1)); joe.setAttribute('y', (pt.y - JH * FOOT).toFixed(1)); }
      else { joe.setAttribute('cx', pt.x.toFixed(1)); joe.setAttribute('cy', (pt.y - 14).toFixed(1)); }
      trail.style.strokeDashoffset = (L * (1 - p)).toFixed(1);
      WP.forEach(function (w, i) { if (p >= w.at) el.querySelector('#jjwp' + i).classList.add('lit'); });
      pct.textContent = Math.round(p * 100) + '%';
    }};
  }

  /* ---------- VARIANT B — scrolling world (Joe centred) ---------- */
  function Scroll(opts, frames) {
    // landmarks live in a wide world; the group slides so each passes centre by progress
    var world = [ {vx:0,s:house('#4a5468'),k:1.7}, {vx:350,s:mug('#4a5468'),k:1.6},
      {vx:700,s:pine('#3f7a58'),k:1.7}, {vx:1050,s:mtn('#4a5468'),k:1.5}, {vx:1400,s:castle('#8a93a8'),k:1.6} ];
    var worldHtml = world.map(function (w) { return '<g transform="translate(' + w.vx + ',150) scale(' + w.k + ')">' + w.s + '</g>'; }).join('');
    var el = mount(
      '<svg viewBox="0 0 1000 320">' + DEFS +
        '<rect x="-50" y="-50" width="1100" height="420" fill="url(#jjsky)"/>' + STARS +
        '<g id="jjfar"><path d="M-200,258 Q250,225 600,255 T1400,248 L1400,330 L-200,330 Z" fill="#101728"/></g>' +
        '<g id="jjmid">' + worldHtml + '</g>' +
        '<rect x="-50" y="272" width="1120" height="60" fill="#0e1524"/>' +
        '<path d="M-50,272 Q250,262 520,272 T1050,268" fill="none" stroke="#2c3346" stroke-width="4"/>' +
        '<g id="jjstreak"></g>' +
        joeSvg(frames) +
        '<rect x="340" y="300" width="320" height="9" rx="4.5" fill="#2c3346"/>' +
        '<rect class="bar" x="340" y="300" width="0" height="9" rx="4.5" fill="#FF00F5"/>' +
        '<text class="pct" x="500" y="292" text-anchor="middle" style="font-size:22px">0%</text>' +
      '</svg>');
    var mid = el.querySelector('#jjmid'), far = el.querySelector('#jjfar'), bar = el.querySelector('.bar'), pct = el.querySelector('.pct');
    var joe = el.querySelector('.joe'), JH = 128, JW = JH * 200 / 175, FOOT = 150 / 175, CENTER = 505, ROAD = 262;
    if (joe.tagName.toLowerCase() === 'image') { joe.setAttribute('width', JW); joe.setAttribute('height', JH); joe.setAttribute('x', (CENTER - JW / 2).toFixed(1)); joe.setAttribute('y', (ROAD - JH * FOOT).toFixed(1)); }
    else { joe.setAttribute('cx', CENTER); joe.setAttribute('cy', ROAD - 14); }
    return { el: el, joe: joe, render: function (p) {
      mid.setAttribute('transform', 'translate(' + (500 - p * 1400).toFixed(1) + ',0)');
      far.setAttribute('transform', 'translate(' + (-p * 300).toFixed(1) + ',0)');
      bar.setAttribute('width', (320 * p).toFixed(1));
      pct.textContent = Math.round(p * 100) + '%';
    }};
  }

  /* ---------- RUN ---------- */
  JJ.start = function (opts) {
    opts = opts || {};
    if (document.getElementById('jjld')) return;
    var frames = (opts.frames || []).filter(Boolean);
    frames.forEach(function (u) { var im = new Image(); im.src = u; });          // preload trot frames
    var scene = (opts.variant === 'scroll' ? Scroll : Journey)(opts, frames);
    var startT = performance.now(), minTime = opts.minTime != null ? opts.minTime : 900;
    var fps = opts.fps || 8, fi = 0, lastF = 0;
    var target = 0, shown = 0, revealed = false, downloaded = false, decoded = !opts.decode;

    (function loop(now) {
      shown += (target - shown) * 0.12; if (target - shown < 0.001) shown = target;
      scene.render(shown);
      if (frames.length && scene.joe.tagName && scene.joe.tagName.toLowerCase() === 'image' && now - lastF > 1000 / fps) {
        lastF = now; fi = (fi + 1) % frames.length; scene.joe.setAttribute('href', frames[fi]);
      }
      var ready = downloaded && decoded && shown > 0.995 && (now - startT) >= minTime;
      if (ready && !revealed) { revealed = true; finish(); return; }
      requestAnimationFrame(loop);
    })(startT);

    function finish() {
      scene.el.classList.add('hide');
      setTimeout(function () { if (scene.el.parentNode) scene.el.remove(); }, 650);
      if (typeof opts.onReady === 'function') opts.onReady();
    }
    var safety = setTimeout(function () { target = 1; downloaded = true; decoded = true; }, opts.maxWait || 15000);
    function onProgress(p) { target = Math.max(target, p); }
    function onDownloaded() { clearTimeout(safety); downloaded = true; target = 1; if (opts.decode) decodeImgs(opts.assets, function () { decoded = true; }); else decoded = true; }
    if (typeof opts.driver === 'function') opts.driver(onProgress, onDownloaded);
    else measure(opts.assets, onProgress, onDownloaded);
    JJ.setProgress = function (p) { target = Math.max(target, Math.min(1, p)); };
  };
})();
