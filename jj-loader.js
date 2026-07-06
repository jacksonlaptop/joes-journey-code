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
  var STARS = '<circle cx="120" cy="50" r="2" fill="#fff" opacity=".5"/><circle cx="300" cy="35" r="1.5" fill="#fff" opacity=".4"/><circle cx="560" cy="60" r="2" fill="#fff" opacity=".5"/><circle cx="820" cy="40" r="1.5" fill="#fff" opacity=".4"/><circle cx="700" cy="85" r="1.5" fill="#fff" opacity=".35"/><circle cx="440" cy="80" r="1.3" fill="#fff" opacity=".3"/><circle cx="220" cy="140" r="1.4" fill="#aeb6c4" opacity=".35"/><circle cx="640" cy="150" r="1.3" fill="#aeb6c4" opacity=".3"/><circle cx="930" cy="120" r="1.5" fill="#aeb6c4" opacity=".35"/>';
  var DEFS = '<defs><linearGradient id="jjsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#101c34"/><stop offset="1" stop-color="#0a1222"/></linearGradient></defs>';
  /* the site's space swirls (darker strokes on the sky, like the homepage/game bg) + its grey moon */
  var SWIRLS = '<g fill="none" stroke="#0a1120" stroke-linecap="round" opacity=".85">' +
      '<path d="M120,140 q150,-100 340,-50 q170,45 260,-35" stroke-width="46"/>' +
      '<path d="M520,210 q180,-60 330,-10" stroke-width="34" opacity=".7"/>' +
      '<path d="M-20,230 q120,-50 260,-14" stroke-width="30" opacity=".6"/></g>';
  var MOON = '<g transform="translate(872,64)"><defs><clipPath id="jjmoonc"><circle r="46"/></clipPath></defs>' +
      '<circle r="46" fill="#49525f"/><g clip-path="url(#jjmoonc)"><circle cx="-15" cy="12" r="46" fill="#333c49"/></g>' +
      '<circle cx="14" cy="-12" r="7" fill="#3c4552"/><circle cx="26" cy="8" r="4.5" fill="#3c4552"/><circle cx="2" cy="-26" r="4" fill="#3c4552"/></g>';
  /* a drifting cartoon wave band in the site's style: navy body + grey foam crests + curl dots.
     `humps` = [[w,h],...] repeated; the pattern period = sum of widths, and the CSS drift distance
     must equal that period so the loop is seamless. Alternating hump sizes keeps it organic. */
  function waveBand(cls, yTop, humps, body, foam, foamOp) {
    var period = 0; humps.forEach(function (hp) { period += hp[0]; });
    var d = 'M' + (-period) + ',' + yTop, foamD = '', curls = '', x = -period;
    while (x < 1000 + period) {
      for (var i = 0; i < humps.length; i++) {
        var w = humps[i][0], h = humps[i][1], x1 = x + w;
        d += ' A' + (w / 2) + ' ' + h + ' 0 0 1 ' + x1 + ',' + yTop;
        foamD += 'M' + x + ',' + yTop + ' A' + (w / 2) + ' ' + h + ' 0 0 1 ' + x1 + ',' + yTop + ' ';
        if (h > 15) curls += '<circle cx="' + (x + w * 0.16) + '" cy="' + (yTop - h * 0.55) + '" r="' + (h * 0.22) + '" fill="' + foam + '" opacity="' + (foamOp || 1) + '"/>';
        x = x1;
      }
    }
    d += ' L' + x + ',340 L' + (-period) + ',340 Z';
    return '<g class="' + cls + '"><path d="' + d + '" fill="' + body + '"/>' +
      '<path d="' + foamD + '" fill="none" stroke="' + foam + '" stroke-width="4.5" stroke-linecap="round" opacity="' + (foamOp || 1) + '"/>' + curls + '</g>';
  }

  var CSS =
    '#jjld{position:fixed;inset:0;z-index:2147483000;background:#05070d;display:flex;align-items:center;justify-content:center;transition:opacity .6s ease;font-family:"Joes Journey Headline",Georgia,serif;}' +
    '#jjld.hide{opacity:0;pointer-events:none;}' +
    '#jjld svg{width:100vw;height:100vh;display:block;overflow:visible;}' +   // full-bleed: scene art extends past the viewBox to cover any screen
    '#jjld::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,transparent 55%,rgba(0,0,0,.42) 100%);}' +
    '#jjld .wp{opacity:.34;transition:opacity .45s ease,filter .45s ease;}' +
    '#jjld .wp.lit{opacity:1;filter:drop-shadow(0 0 7px rgba(255,45,149,.75));}' +
    '#jjld .pct{fill:#f0e4c4;font-size:30px;}#jjld .cap{fill:rgba(240,228,196,.55);font-size:13px;letter-spacing:4px;}' +
    '#jjld .trail{transition:none;}' +
    '@keyframes jjdriftB{to{transform:translateX(-170px);}}' +
    '@keyframes jjdriftF{to{transform:translateX(-220px);}}' +
    '@keyframes jjbob{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}' +
    '#jjld .wback{animation:jjdriftB 11s linear infinite;}' +
    '#jjld .wfront{animation:jjdriftF 6.5s linear infinite;}' +
    '#jjld .joe{animation:jjbob 1.7s ease-in-out infinite;}' +
    '#jjld .jjbobw{animation:jjbob 1.7s ease-in-out infinite;}' +   // ONE bob wrapper in fill mode → layers can't drift
    /* evolution stage life-cycle: frozen grey → shiver while painting → alive once coloured */
    '#jjld .evoStage{transform-box:fill-box;transform-origin:50% 100%;}' +
    '@keyframes jjshiver{0%,100%{transform:translateX(0);}25%{transform:translateX(-1px);}75%{transform:translateX(1px);}}' +
    '@keyframes jjwalk{0%,100%{transform:translateY(0) rotate(0deg);}25%{transform:translateY(-3px) rotate(-1.2deg);}50%{transform:translateY(0) rotate(0deg);}75%{transform:translateY(-3px) rotate(1.2deg);}}' +
    '@keyframes jjswim{0%,100%{transform:translateY(0) rotate(-2deg);}50%{transform:translateY(-4px) rotate(2deg);}}' +
    '@keyframes jjsquish{0%,100%{transform:scale(1,1);}50%{transform:scale(1.07,0.9);}}' +
    '@keyframes jjtwinkle{0%,100%{opacity:.12;}50%{opacity:.75;}}' +
    '#jjld .jjtw{animation:jjtwinkle 3s ease-in-out infinite;}' +
    /* the intro-style parallax: swirl board drifts one way, starfield + decor the other — like the homepage */
    '@keyframes jjparS{from{transform:translateX(0);}to{transform:translateX(-130px);}}' +
    '@keyframes jjparT{from{transform:translateX(0);}to{transform:translateX(44px);}}' +
    '@keyframes jjparD{from{transform:translateX(0);}to{transform:translateX(-56px);}}' +
    '#jjld .jjparSwirl{animation:jjparS 38s ease-in-out infinite alternate;}' +
    '#jjld .jjparStars{animation:jjparT 38s ease-in-out infinite alternate;}' +
    '#jjld .jjparDeco{animation:jjparD 38s ease-in-out infinite alternate;}' +
    '@keyframes jjspin{to{transform:rotate(360deg);}}' +
    '#jjld .jjsp{transform-box:fill-box;transform-origin:50% 50%;}' +
    '#jjld .evoFillin{animation:jjshiver .18s linear infinite;}' +
    '#jjld .evoWalk{animation:jjwalk .9s ease-in-out infinite;}' +
    '#jjld .evoSwim{animation:jjswim 1.4s ease-in-out infinite;}' +
    '#jjld .evoSquish{animation:jjsquish 1.2s ease-in-out infinite;}' +
    /* the one-shot STEP the moment a figure finishes painting (wrapper), idles live on the inner group */
    '#jjld .evoInner{transform-box:fill-box;transform-origin:50% 100%;}' +
    '@keyframes jjstep{0%{transform:translateX(0) translateY(0);}45%{transform:translateX(5px) translateY(-7px);}100%{transform:translateX(9px) translateY(0);}}' +
    '#jjld .evoStepped{animation:jjstep .5s ease-out forwards;}';

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
    var AR = opts.frameAR || (200 / 175), FOOT = opts.footFrac != null ? opts.footFrac : (150 / 175);
    var joe = el.querySelector('.joe'), JH = opts.joeH || 66, JW = JH * AR;
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
    var AR = opts.frameAR || (200 / 175), FOOT = opts.footFrac != null ? opts.footFrac : (150 / 175);
    var JH = opts.joeH || 150, JW = JH * AR, CENTER = 505, ROAD = 258;   // hooves ride the front crests
    var JX = CENTER - JW / 2, JY = ROAD - JH * FOOT;
    var greys = (opts.fillFrames || []).filter(Boolean);

    /* paint-fill mode: grey Joe underneath, colour Joe on top clipped by a rising liquid.
       ALL frames (grey + colour) are mounted ONCE as stacked <image>s and swapped by toggling
       visibility — swapping href on two live images decodes async per layer, so grey and colour
       could show DIFFERENT gallop poses (looked like two horses). A style flip is synchronous:
       both layers always show the same pose. One bob wrapper keeps them phase-locked too. */
    var joeHtml, liq = null;
    if (greys.length && frames.length) {
      var lw = 34, lx0 = JX - 100, surf = 'M' + lx0 + ',0', n = Math.ceil((JW + 240) / lw);
      for (var li = 0; li < n; li++) surf += ' A' + (lw / 2) + ' 5 0 0 1 ' + (lx0 + (li + 1) * lw) + ',0';
      surf += ' L' + (lx0 + n * lw) + ',' + (JH + 80) + ' L' + lx0 + ',' + (JH + 80) + ' Z';
      var stackImgs = function (urls, cls) {
        var s = '';
        for (var si = 0; si < urls.length; si++)
          s += '<image class="' + cls + '" href="' + urls[si] + '" x="' + JX.toFixed(1) + '" y="' + JY.toFixed(1) + '" width="' + JW + '" height="' + JH + '"' + (si ? ' style="display:none"' : '') + '/>';
        return s;
      };
      joeHtml =
        /* NOTE: clipPath children may only be shapes/text/use — a <g> here is ignored and empties the clip */
        '<clipPath id="jjliq" clipPathUnits="userSpaceOnUse"><path class="liqP" transform="translate(0,' + (JY + JH + 10) + ')" d="' + surf + '"/></clipPath>' +
        '<g class="jjbobw"><g>' + stackImgs(greys, 'jfg') + '</g>' +
        '<g clip-path="url(#jjliq)">' + stackImgs(frames, 'jfc') + '</g></g>';
    } else {
      joeHtml = joeSvg(frames);
    }

    var el = mount(
      '<svg viewBox="0 0 1000 320">' + DEFS +
        '<rect x="-50" y="-50" width="1100" height="420" fill="url(#jjsky)"/>' + SWIRLS + STARS + MOON +
        '<g id="jjmid">' + worldHtml + '</g>' +
        /* speed streaks above the water */
        '<g stroke="rgba(255,255,255,.14)" stroke-width="3" stroke-linecap="round">' +
          '<line x1="415" y1="196" x2="378" y2="196"/><line x1="398" y1="212" x2="352" y2="212"/><line x1="420" y1="228" x2="390" y2="228"/></g>' +
        /* the sea: back band (slate, slow) + front band (navy, faster) drifting seamlessly */
        waveBand('wback', 246, [[95, 18], [75, 12]], '#39434f', '#78818c', .9) +
        waveBand('wfront', 266, [[130, 30], [90, 20]], '#142a47', '#c9cfd9', .95) +
        joeHtml +
        '<rect x="340" y="300" width="320" height="9" rx="4.5" fill="rgba(255,255,255,.14)"/>' +
        '<rect class="bar" x="340" y="300" width="0" height="9" rx="4.5" fill="#FF00F5"/>' +
        '<text class="pct" x="500" y="292" text-anchor="middle" style="font-size:22px">0%</text>' +
      '</svg>');
    var mid = el.querySelector('#jjmid'), bar = el.querySelector('.bar'), pct = el.querySelector('.pct');
    var joe = el.querySelector('.joe');
    liq = el.querySelector('.liqP');
    if (joe && joe.tagName.toLowerCase() === 'image') { joe.setAttribute('width', JW); joe.setAttribute('height', JH); joe.setAttribute('x', JX.toFixed(1)); joe.setAttribute('y', JY.toFixed(1)); }
    else if (joe && joe.tagName.toLowerCase() !== 'image') { joe.setAttribute('cx', CENTER); joe.setAttribute('cy', ROAD - 14); }
    var slice = function (sel) { return Array.prototype.slice.call(el.querySelectorAll(sel)); };
    var colImgs = slice('.jfc'), gryImgs = slice('.jfg'), curF = 0;
    var setFrame = colImgs.length ? function (i) {
      if (i === curF) return;
      colImgs[curF].style.display = 'none'; gryImgs[curF].style.display = 'none';
      colImgs[i].style.display = ''; gryImgs[i].style.display = '';
      curF = i;
    } : null;
    return { el: el, joe: joe, setFrame: setFrame, render: function (p) {
      mid.setAttribute('transform', 'translate(' + (500 - p * 1400).toFixed(1) + ',0)');
      if (liq) {   // surface rises with real %; slosh via attribute transform (CSS anims don't reach clip content)
        var sx = -((performance.now() / 23) % 68);
        liq.setAttribute('transform', 'translate(' + sx.toFixed(1) + ',' + (JY - 10 + (JH + 20) * (1 - p)).toFixed(1) + ')');
      }
      bar.setAttribute('width', (320 * p).toFixed(1));
      pct.textContent = Math.round(p * 100) + '%';
    }};
  }

  /* ---------- VARIANT C — evolution row (each stage paint-fills in turn) ---------- */
  function Evolution(opts) {
    var colour = (opts.stages || []).filter(Boolean), grey = (opts.stagesGrey || []).filter(Boolean);
    var colourB = (opts.stagesB || []).filter(Boolean);          // optional 2nd pose per stage → real steps once alive
    var N = colour.length, S = 128, GAP = 8, GROUND = 272, hasB = colourB.length === N;
    var total = N * S + (N - 1) * GAP, X0 = (1000 - total) / 2;
    var bounds = opts.stageBounds || [];    // per-stage [topFrac,botFrac] of the art's content (for seating)
    var boundsX = opts.stageBoundsX || [];  // per-stage [leftFrac,rightFrac] — the fill sweeps this span
    var clips = '', row = '', xs = [];
    /* fill goes LEFT→RIGHT: the clip is a big rect whose RIGHT edge is a vertical wavy line
       (humps bulge toward the unfilled side); it slides across the figure by progress and the
       wave pattern drifts vertically for the slosh. SPAN covers box + drift period. */
    var lw = 26, SPAN = S + 112;
    for (var i = 0; i < N; i++) {
      var bt = bounds[i] || [0, 1], xb = boundsX[i] || [0, 1];
      var bx = X0 + i * (S + GAP), by = GROUND - S * bt[1];   // seat the CONTENT (not the canvas) on the ground
      xs.push([bx + S * xb[0] - 6, bx + S * xb[1] + 6]);       // content left→right edges of the sweep
      var hn = Math.ceil(SPAN / lw), d = 'M0,0';
      for (var h = 0; h < hn; h++) d += ' A4 ' + (lw / 2) + ' 0 0 1 0,' + ((h + 1) * lw);   // vertical chord → rx is the 4px bulge, ry the half-chord
      d += ' L' + (-S - 160) + ',' + (hn * lw) + ' L' + (-S - 160) + ',0 Z';
      clips += '<clipPath id="jjevo' + i + '" clipPathUnits="userSpaceOnUse"><path class="evoclip" transform="translate(' + xs[i][0] + ',' + (GROUND - S - 60) + ')" d="' + d + '"/></clipPath>';
      /* whole stage (grey + clipped colour) in ONE wrapper so any animation moves both layers —
         and the userSpaceOnUse clip rides along with the transforms, so the fill level stays glued
         to the figure while it moves. Wrapper = one-shot step-forward on completion; inner = the
         infinite idle (phase-offset so the line doesn't march in sync). */
      var box = ' x="' + bx + '" y="' + by.toFixed(1) + '" width="' + S + '" height="' + S + '"';
      row +=
        '<g class="evoStage"><g class="evoInner" style="animation-delay:-' + (i * 0.13).toFixed(2) + 's">' +
          '<image class="evoG" href="' + grey[i] + '"' + box + '/>' +
          '<g clip-path="url(#jjevo' + i + ')">' +
            '<image class="evoA" href="' + colour[i] + '"' + box + '/>' +
            (hasB ? '<image class="evoB" style="display:none" href="' + colourB[i] + '"' + box + '/>' : '') +
          '</g>' +
        '</g></g>';
    }
    /* the "journey night" scene — the SITE'S OWN intro parallax boards: the swirl-cloud board
       drifts slowly one way while a starfield drifts the other (like the homepage intro). */
    var BOARD = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a0c964e79a06e8151f7f16b_Starry%20Board%20-%20Foreground2.svg';
    var SCDN = 'https://cdn.prod.website-files.com/615edb5c549d52cd108ed268/';
    var SPRITES = { whirl: SCDN + '67212bf05ed02917043863f5_whirl-star.svg', x: SCDN + '67212bf05ed02917043863f9_x-star.svg',
      target: SCDN + '67212bf072ae1d89db07fec6_target-star.svg', star: SCDN + '67212bf0d1377a501ae28dc4_star-star.svg' };
    [BOARD, SPRITES.whirl, SPRITES.x, SPRITES.target, SPRITES.star].forEach(function (u) { var im = new Image(); im.src = u; });
    var twinkles = '';
    var TW = [[85, 42, 1.6, 2.6], [235, 88, 1.2, 3.4], [388, 30, 1.8, 2.9], [530, 96, 1.1, 3.8], [655, 48, 1.5, 2.4],
      [762, 112, 1.2, 3.1], [905, 34, 1.7, 2.7], [968, 150, 1.1, 3.6], [160, 140, 1.2, 3.2], [468, 165, 1.0, 2.8]];
    for (var t = 0; t < TW.length; t++)
      twinkles += '<circle class="jjtw" cx="' + TW[t][0] + '" cy="' + TW[t][1] + '" r="' + TW[t][2] + '" fill="#dfe6f2" style="animation-duration:' + TW[t][3] + 's;animation-delay:-' + (t * 0.4).toFixed(1) + 's"/>';
    var starfield = '';
    var SF = [[-62, 28, 1.4, .7], [18, 96, 1.0, .5], [64, 190, 1.2, .45], [142, 52, 1.8, .8], [212, 150, 1.0, .5], [286, 22, 1.3, .6],
      [352, 118, 1.6, .75], [420, 208, 1.0, .4], [498, 66, 1.2, .55], [556, 172, 1.9, .8], [640, 34, 1.1, .5], [700, 132, 1.4, .65],
      [788, 84, 1.0, .45], [846, 196, 1.6, .7], [922, 44, 1.2, .55], [1004, 148, 1.8, .8], [1082, 96, 1.1, .5], [1148, 30, 1.4, .6],
      [248, 236, 0.9, .35], [672, 232, 1.0, .4], [960, 226, 1.1, .4], [92, 128, 0.9, .4], [520, 20, 0.9, .45], [1120, 200, 0.9, .35],
      /* extra stars above/beside the viewBox — visible on tall/wide screens in full-bleed */
      [-220, -160, 1.4, .6], [80, -320, 1.2, .5], [340, -110, 1.6, .7], [610, -260, 1.1, .5], [872, -180, 1.4, .6],
      [1140, -300, 1.2, .5], [1290, -80, 1.3, .55], [-280, 140, 1.1, .5], [1260, 190, 1.2, .5], [470, -400, 1.0, .4]];
    for (var s = 0; s < SF.length; s++)
      starfield += '<circle cx="' + SF[s][0] + '" cy="' + SF[s][1] + '" r="' + SF[s][2] + '" fill="#e6ecf6" opacity="' + SF[s][3] + '"/>';
    /* homepage-intro decor: glowing orbs, a big crescent moon, and the site's own star sprites */
    var deco = '<radialGradient id="jjglow"><stop offset="0%" stop-color="#fff" stop-opacity=".5"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></radialGradient>';
    var ORBS = [[390, -150, 5], [790, 30, 6], [170, 20, 4], [1120, -220, 5], [545, 120, 4]];
    for (var o = 0; o < ORBS.length; o++)
      deco += '<circle cx="' + ORBS[o][0] + '" cy="' + ORBS[o][1] + '" r="' + (ORBS[o][2] * 3.2) + '" fill="url(#jjglow)"/>' +
              '<circle cx="' + ORBS[o][0] + '" cy="' + ORBS[o][1] + '" r="' + ORBS[o][2] + '" fill="#f2f5fa" opacity=".95"/>';
    deco += '<mask id="jjcres"><rect x="-70" y="-70" width="140" height="140" fill="#fff"/><circle cx="-20" cy="-10" r="40" fill="#000"/></mask>' +
            '<g transform="translate(742,-64)"><circle r="62" fill="url(#jjglow)" opacity=".8"/>' +
            '<circle r="44" fill="#d6dbe4" opacity=".92" mask="url(#jjcres)"/></g>';
    var WH = [[130, -40, 24, 14], [520, -210, 20, 20], [905, 120, 26, 17], [-140, 80, 18, 22], [1180, -120, 22, 19]];
    for (var w2 = 0; w2 < WH.length; w2++)
      deco += '<image class="jjsp" href="' + SPRITES.whirl + '" x="' + WH[w2][0] + '" y="' + WH[w2][1] + '" width="' + WH[w2][2] + '" height="' + WH[w2][2] + '" style="animation:jjspin ' + WH[w2][3] + 's linear infinite" opacity=".85"/>';
    var XS = [[320, 60, 16, 2.8, 'x'], [705, -80, 14, 3.4, 'x'], [1060, 40, 18, 2.4, 'x'], [60, -250, 14, 3.8, 'x'], [840, -300, 16, 3.0, 'x'],
      [230, -140, 18, 3.2, 'star'], [615, 170, 16, 2.6, 'star'], [985, -200, 14, 3.5, 'star'], [-220, -60, 14, 3.0, 'star'],
      [430, -30, 16, 4.2, 'target'], [80, 180, 14, 5.0, 'target'], [1240, 150, 14, 4.4, 'target']];
    for (var x2 = 0; x2 < XS.length; x2++)
      deco += '<image class="jjsp jjtw" href="' + SPRITES[XS[x2][4]] + '" x="' + XS[x2][0] + '" y="' + XS[x2][1] + '" width="' + XS[x2][2] + '" height="' + XS[x2][2] + '" style="animation-duration:' + XS[x2][3] + 's;animation-delay:-' + (x2 * 0.3).toFixed(1) + 's"/>';
    var el = mount(
      '<svg viewBox="0 0 1000 320">' + DEFS +
        /* full-bleed: everything extends far past the viewBox (symmetric about its centre) */
        '<rect x="-3500" y="-1440" width="8000" height="3200" fill="#0e1f33"/>' +                               // board base colour / deep space
        '<g class="jjparSwirl"><image href="' + BOARD + '" x="-3131" y="-160" width="5672" height="520"/></g>' + // the intro swirl board, big spiral in view
        /* dissolve the board's hard top edge into deep space (tall screens would otherwise see it) */
        '<linearGradient id="jjfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e1f33" stop-opacity="1"/><stop offset="1" stop-color="#0e1f33" stop-opacity="0"/></linearGradient>' +
        '<rect x="-3500" y="-1440" width="8000" height="1300" fill="#0e1f33"/>' +
        '<rect x="-3500" y="-140" width="8000" height="120" fill="url(#jjfade)"/>' +
        /* the intro's purple galaxy wash, upper right */
        '<radialGradient id="jjpur" gradientUnits="userSpaceOnUse" cx="850" cy="-60" r="900"><stop offset="0%" stop-color="#6b55a0" stop-opacity=".36"/><stop offset="55%" stop-color="#4a3a75" stop-opacity=".15"/><stop offset="100%" stop-color="#4a3a75" stop-opacity="0"/></radialGradient>' +
        '<rect x="-3500" y="-1440" width="8000" height="3200" fill="url(#jjpur)"/>' +
        '<g class="jjparStars">' + starfield + twinkles + '</g>' +
        '<g class="jjparDeco">' + deco + '</g>' +
        '<rect x="-3500" y="' + GROUND + '" width="8000" height="1600" fill="#131b2c"/>' +
        '<line x1="-3500" y1="' + GROUND + '" x2="4500" y2="' + GROUND + '" stroke="#232e44" stroke-width="3"/>' +
        /* the road they walk — a soft lighter band with a few pebbles */
        '<rect x="' + (X0 - 34) + '" y="' + (GROUND + 8) + '" width="' + (total + 68) + '" height="12" rx="6" fill="#1a2438" opacity=".85"/>' +
        '<circle cx="' + (X0 + 40) + '" cy="' + (GROUND + 26) + '" r="2" fill="#222e48"/><circle cx="' + (X0 + 205) + '" cy="' + (GROUND + 30) + '" r="1.6" fill="#222e48"/>' +
        '<circle cx="' + (X0 + 420) + '" cy="' + (GROUND + 25) + '" r="2.2" fill="#222e48"/><circle cx="' + (X0 + 610) + '" cy="' + (GROUND + 31) + '" r="1.5" fill="#222e48"/>' +
        '<circle cx="' + (X0 + 812) + '" cy="' + (GROUND + 27) + '" r="2" fill="#222e48"/>' +
        clips + row +
        '<text class="pct" x="500" y="306" text-anchor="middle" style="font-size:22px">0%</text>' +
      '</svg>');
    var pct = el.querySelector('.pct');
    var clipEls = Array.prototype.slice.call(el.querySelectorAll('.evoclip'));
    var stageEls = Array.prototype.slice.call(el.querySelectorAll('.evoStage'));
    var innerEls = Array.prototype.slice.call(el.querySelectorAll('.evoInner'));
    var aEls = Array.prototype.slice.call(el.querySelectorAll('.evoA'));
    var bEls = Array.prototype.slice.call(el.querySelectorAll('.evoB'));
    var gEls = Array.prototype.slice.call(el.querySelectorAll('.evoG'));
    /* per-stage idle animation once alive: amoeba squishes, fish swims, the rest walk (overridable) */
    var anims = opts.stageAnims || [];
    function animClass(i) { var a = anims[i] || (i === 0 ? 'squish' : (i === 1 ? 'swim' : 'walk'));
      return a === 'squish' ? 'evoSquish' : (a === 'swim' ? 'evoSwim' : 'evoWalk'); }
    /* only ONE character is animated at a time — the latest to be painted. Earlier ones settle
       into a still coloured stance (keeping their stepped-forward spot). Modes per stage:
       frozen (grey) · fill (shiver) · walk (step hop + idle + pose A/B cycle) · done (still). */
    var modes = [], poseFr = [];
    return { el: el, joe: null, render: function (p) {
      var now = performance.now();
      var sy = (GROUND - S - 60) - ((now / 26) % 52);            // wave pattern drifts vertically (52 = 2 hump periods)
      var locals = [], aliveIdx = -1;
      for (var i = 0; i < N; i++) {
        locals[i] = Math.max(0, Math.min(1, p * N - i));         // stage i fills during its 1/N slice of the load
        if (locals[i] >= 1) aliveIdx = i;                        // highest completed stage = the one that walks
      }
      for (i = 0; i < clipEls.length; i++) {
        var local = locals[i];
        var x = local >= 1 ? xs[i][1] + 24                       // done → park the edge clear of the step-forward hop
                           : xs[i][0] + local * (xs[i][1] - xs[i][0]);   // else sweep left → right across the figure
        clipEls[i].setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + sy.toFixed(1) + ')');
        var mode = local <= 0 ? 'frozen' : (local < 1 ? 'fill' : (i === aliveIdx ? 'walk' : 'done'));
        if (mode !== modes[i]) {
          modes[i] = mode;
          stageEls[i].setAttribute('class', 'evoStage' + (local >= 1 ? ' evoStepped' : ''));   // hop persists once done (forwards fill)
          innerEls[i].setAttribute('class', 'evoInner' + (mode === 'fill' ? ' evoFillin' : (mode === 'walk' ? ' ' + animClass(i) : '')));
          if (hasB) {
            if (gEls[i]) gEls[i].style.display = local >= 1 ? 'none' : '';
            if (mode !== 'walk') { poseFr[i] = 0; aEls[i].style.display = ''; bEls[i].style.display = 'none'; }   // settled → rest on pose A
          }
        }
        if (hasB && mode === 'walk') {                           // the current one steps: alternate pose A/B
          var fr = Math.floor(now / 320) % 2;
          if (fr !== poseFr[i]) { poseFr[i] = fr; aEls[i].style.display = fr ? 'none' : ''; bEls[i].style.display = fr ? '' : 'none'; }
        }
      }
      pct.textContent = Math.round(p * 100) + '%';
    }};
  }

  /* ---------- RUN ---------- */
  JJ.start = function (opts) {
    opts = opts || {};
    if (document.getElementById('jjld')) return;
    var frames = (opts.frames || []).filter(Boolean);
    frames.concat(opts.fillFrames || [], opts.stages || [], opts.stagesGrey || [], opts.stagesB || []).forEach(function (u) {   // preload + decode all art up front
      var im = new Image(); im.src = u; if (im.decode) im.decode().catch(function () {});
    });
    var scene = (opts.variant === 'evolution' ? Evolution(opts)
      : (opts.variant === 'scroll' ? Scroll : Journey)(opts, frames));
    var startT = performance.now(), minTime = opts.minTime != null ? opts.minTime : 900;
    var fps = opts.fps || 8, fi = 0, lastF = 0;
    var target = 0, shown = 0, revealed = false, downloaded = false, decoded = !opts.decode;

    (function loop(now) {
      shown += (target - shown) * 0.12; if (target - shown < 0.001) shown = target;
      scene.render(shown);
      if (frames.length && now - lastF > 1000 / fps) {
        lastF = now; fi = (fi + 1) % frames.length;
        if (scene.setFrame) scene.setFrame(fi);
        else if (scene.joe && scene.joe.tagName && scene.joe.tagName.toLowerCase() === 'image') scene.joe.setAttribute('href', frames[fi]);
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
