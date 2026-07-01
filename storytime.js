/* ============================================================================
   Joe's Journey — Storytime page  (hosted via GitHub + raw.githack.com)

   IN WEBFLOW (Storytime page → Page Settings):
     Inside <head>:  <style>.nav-logo-link,.menu-container{opacity:0}</style>
     Before </body>: <script src="https://raw.githack.com/jacksonlaptop/joes-journey-code/main/storytime.js?v=11"></script>

   Every scene is COMPOSED FROM LAYERS in code (not a flat image): the night sky
   backdrop → a transparent scene bg → positioned character layers (some animated)
   → the J-swirl caption banner. Chapters switch on words as the line types.
   Positions live in COMP below as plain CSS strings — easy to nudge.
   ============================================================================ */
(function () {
  window.JJ_STORY_BUILD = 's12 · village storyboard (4 panels) · fixed dragon + escalating fire · morphing layers';
  try { console.log('%c[JJ] storytime.js build: ' + window.JJ_STORY_BUILD, 'color:#FF00F5;font-weight:bold'); } catch (e) {}

  var GB = 'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/';
  var AV = '?a=5';
  function F(name){ return GB + 'story-' + name + '.webp' + AV; }
  var BANNER = GB + 'story-banner.webp' + AV;             // J-swirl caption frame
  var SKY = GB + 'story-nightsky.svg' + AV;

  /* ---- compositions: each chapter = a transparent bg + character layers (src OR anim).
         `css` is the layer's position/size — tweak freely. Dragons use right/bottom anchoring
         (their image has transparent smoke/fire room at the top-left). ---- */
  var COMP = {
    cavern: { bg:'cav-bg', layers:[
      { anim:['cav-dragon-1','cav-dragon-2','cav-dragon-3'], int:680, css:'right:17%;bottom:12vh;width:min(54vw,740px)' }
    ]},
    tavern: { bg:'tav-bg', layers:[
      { src:'tav-joe', cls:'enter', css:'left:8%;bottom:13vh;width:min(15vw,200px)' },
      { src:'tav-char-1', cls:'scared', css:'right:18%;bottom:33vh;width:min(8vw,104px)' },
      { src:'tav-char-2', cls:'scared', css:'right:9%;bottom:35vh;width:min(8vw,104px)' },
      { src:'tav-char-3', cls:'scared', css:'right:4%;bottom:20vh;width:min(8vw,104px)' }
    ]},
    woodland: { bg:'wood-bg', layers:[
      { src:'wood-joe', css:'left:45%;bottom:14vh;width:min(12vw,160px)' },
      { src:'wood-char-1', css:'left:8%;bottom:18vh;width:min(11vw,150px)' },
      { src:'wood-char-2', css:'left:21%;bottom:16vh;width:min(11vw,150px)' }
    ]},
    castle: { bg:'cas-bg', layers:[
      { src:'cas-joe-1', css:'left:12%;bottom:22vh;width:min(13vw,180px)' },
      { src:'cas-dragon-1', css:'right:30%;bottom:24vh;width:min(24vw,330px)' }
    ]}
  };

  /* ---- VILLAGE = 4-panel storyboard. Same bg + same characters (matched by `key`), so between
         panels the dragon FIRE crossfades in place (body pixel-locked) and the villagers *walk*
         to their new spots (position morphs). Only the fire escalates + people move — no jitter.
         Panel beats (advance on words): 1 smoke → 2 fire → 3 bigger → 4 biggest.
         The pitchfork guy (char-4) charges the beast across 1→3, then turns & flees in 4. ---- */
  var VIL_DRAGON = 'right:-3%;bottom:7vh;width:min(82vw,1200px)';   // fixed for all panels
  function vil(dragon, p){
    return { bg:'vil-bg', layers:[
      { key:'dragon', src:dragon,       css:VIL_DRAGON },
      { key:'v1', src:'vil-char-1', cls:'idle', css:p.v1 },
      { key:'v2', src:'vil-char-2', cls:'idle', css:p.v2 },
      { key:'v3', src:'vil-char-3', cls:'idle', css:p.v3 },
      { key:'v5', src:'vil-char-5', cls:'idle', css:p.v5 },
      { key:'pitch', src:'vil-char-4', cls:'idle', css:p.pitch }
    ]};
  }
  var VW = ';width:min(6.4vw,86px)', VWs = ';width:min(5.6vw,74px)', PW = ';width:min(8vw,108px)';
  COMP.village1 = vil('vil-dragon-1', {        // small smoke — villagers scared, facing every way
    v1:'left:25%;bottom:22vh'+VW, v2:'left:15%;bottom:15vh'+VW, v3:'left:33%;bottom:13vh'+VWs,
    v5:'left:8%;bottom:25vh'+VWs, pitch:'left:41%;bottom:17vh'+PW });
  COMP.village2 = vil('vil-dragon-2', {        // fire — group backs away, pitchfork charges in
    v1:'left:19%;bottom:23vh'+VW, v2:'left:11%;bottom:16vh'+VW, v3:'left:26%;bottom:13vh'+VWs,
    v5:'left:5%;bottom:26vh'+VWs, pitch:'left:51%;bottom:17vh'+PW });
  COMP.village3 = vil('vil-dragon-3', {        // bigger fire — villagers run, pitchfork nearly on him
    v1:'left:14%;bottom:24vh'+VWs, v2:'left:7%;bottom:16vh'+VWs, v3:'left:20%;bottom:12vh'+VWs,
    v5:'left:2%;bottom:27vh'+VWs, pitch:'left:59%;bottom:16vh'+PW });
  COMP.village4 = { bg:'vil-bg', layers:[   // biggest fire — pitchfork guy recoils & DROPS it (char-4 → scared-drop)
    { key:'dragon', src:'vil-dragon-4', css:VIL_DRAGON },
    { key:'v1', src:'vil-char-1', cls:'idle', css:'left:12%;bottom:25vh'+VWs },
    { key:'v2', src:'vil-char-2', cls:'idle', css:'left:5%;bottom:16vh'+VWs },
    { key:'v3', src:'vil-char-3', cls:'idle', css:'left:17%;bottom:12vh'+VWs },
    { key:'v5', src:'vil-char-5', cls:'idle', css:'left:1%;bottom:28vh'+VWs },
    { key:'pitchdrop', src:'vil-pitch-drop', cls:'idle', css:'left:44%;bottom:11vh;width:min(9vw,124px)' }
  ]};   // note: key 'pitch' is absent here so the charging guy fades out as the terrified drop-guy fades in

  /* ---- captions: each = the line + the chapter it's on + word `triggers` that switch chapter ---- */
  var SCENES = [
    { text:"Many moons ago in a mysterious land there lived a cunning and evil beast who dwelled deep in the darkness....", comp:'cavern' },
    { text:"He had a fascination for gold, jewels, treasures and anything that sparkled...but also something more sinister...the local villagers!",
      comp:'cavern', triggers:[ { at:'more sinister', comp:'village1' } ] },
    { text:"He had many names, Beast, Dragon, Death, but the one that put fear into the hearts of the locals was...Trogdor! Trogdor The Burninator...",
      comp:'village1', triggers:[ { at:'Dragon', comp:'village2' }, { at:'fear', comp:'village3' }, { at:'Trogdor', comp:'village4' } ] },
    { text:"Luckily one day a brave young man appeared to try and best this beast! His goal? To save the villagers and stop this evil...",
      comp:'village4', triggers:[ { at:'Luckily one day', comp:'tavern' } ] },
    { text:"“Joe the Righteous” they called! He set off a journey to find the beast, searching through hills and mountains...He went toe to toe with the beast...",
      comp:'tavern', triggers:[ { at:'Joe the Righteous', comp:'woodland' }, { at:'mountains', comp:'castle' } ] },
    { text:"Wait a minute, I think this might be the wrong story...Ah yes, sorry. Different Joe, this one is the story of a Designer...A magical Designer.",
      comp:'castle', end:{ delay:1500, run:function(){ fadeToBlack(); } } }
  ];

  /* ---- timings (ms) ---- */
  var T = { revealAt:700, revealDur:2200, boxFadeAt:2700, menuDropAt:3000, firstTypeAt:3500,
    typeSpeed:24, pauseDot:280, pauseEllipsis:620, readPerChar:32, readMin:1700, bgFade:600, endFade:1500 };

  /* ---- styles ---- */
  var CSS =
  '#jjst{position:fixed;inset:0;z-index:1;overflow:hidden;background:#0b1b2e;font-family:\'Joes Journey Headline\',sans-serif;}'+
  '#jjst-bgwrap{position:absolute;inset:0;overflow:hidden;}'+
  '#jjst-sky{position:absolute;top:0;left:0;width:100%;height:auto;display:block;}'+
  '#jjst .jjst-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;will-change:opacity;}'+
  '#jjst-layers{position:absolute;inset:0;z-index:3;pointer-events:none;}'+
  '#jjst-layers .jjst-layer{position:absolute;height:auto;display:block;will-change:transform,opacity;}'+
  '@keyframes jjst-scared{0%,100%{transform:translateY(0) rotate(-2.5deg);}50%{transform:translateY(-4px) rotate(2.5deg);}}'+
  '.jjst-layer.scared{animation:jjst-scared .5s ease-in-out infinite;transform-origin:center bottom;}'+
  '@keyframes jjst-idle{0%,100%{transform:scaleX(var(--flip,1)) translateY(0);}50%{transform:scaleX(var(--flip,1)) translateY(-3px);}}'+
  '.jjst-layer.idle{animation:jjst-idle 2.5s ease-in-out infinite;transform-origin:center bottom;}'+
  '.jjst-layer.morph{transition:left .8s cubic-bezier(.4,0,.2,1),right .8s cubic-bezier(.4,0,.2,1),bottom .8s cubic-bezier(.4,0,.2,1),width .8s cubic-bezier(.4,0,.2,1),opacity .55s ease;}'+
  '.jjst-layer.enter{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s cubic-bezier(.22,1,.36,1);}'+
  '.jjst-layer.enter.in{opacity:1;transform:translateY(0);}'+
  '#jjst-black{position:absolute;left:50%;top:55%;width:0;height:0;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 90px 24px rgba(255,176,84,.35) inset,0 0 0 9999px #05080f;z-index:8;pointer-events:none;}'+
  '#jjst-fade{position:absolute;inset:0;background:#05080f;opacity:0;z-index:10;pointer-events:none;transition:opacity '+T.endFade+'ms ease;}'+
  '#jjst-loader{position:absolute;inset:0;z-index:20;background:#05080f;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;transition:opacity .6s ease;}'+
  '#jjst-loader.hide{opacity:0;pointer-events:none;}'+
  '#jjst-loader .ring{width:46px;height:46px;border-radius:50%;border:4px solid rgba(244,197,96,.22);border-top-color:#f4c560;animation:jjst-spin .9s linear infinite;}'+
  '#jjst-loader .txt{font-family:\'Joes Journey Headline\',sans-serif;color:#e8d9b5;font-size:15px;letter-spacing:1px;}'+
  '@keyframes jjst-spin{to{transform:rotate(360deg);}}'+
  '#jjst-progress{position:absolute;left:0;top:0;width:100%;height:5px;background:rgba(255,255,255,.08);z-index:6;opacity:0;transition:opacity .6s ease;}'+
  '#jjst-progress.on{opacity:1;}'+
  '#jjst-progress-fill{height:100%;width:0;background:linear-gradient(90deg,#FF00F5,#ff7df4);box-shadow:0 0 12px rgba(255,0,245,.7);transition:width .6s ease;}'+
  '#jjst-cap{position:absolute;left:50%;bottom:4.5vh;transform:translateX(-50%);width:min(90vw,1297px);aspect-ratio:1295 / 200;z-index:5;opacity:0;transition:opacity .8s ease;background:url(\''+BANNER+'\') no-repeat center/contain;display:flex;align-items:center;justify-content:center;pointer-events:none;}'+
  '#jjst-cap.on{opacity:1;}'+
  '#jjst-cap-text{width:72%;text-align:center;color:#3a2a12;font-size:clamp(16px,1.7vw,29px);line-height:1.26;white-space:pre-wrap;}';

  var style = document.createElement('style'); style.id = 'jj-storytime-style'; style.textContent = CSS; document.head.appendChild(style);

  /* ---- markup ---- */
  var wrap = document.createElement('div'); wrap.id = 'jjst';
  wrap.innerHTML =
    '<div id="jjst-bgwrap"><img id="jjst-sky" alt=""></div>'+
    '<div id="jjst-layers"></div>'+
    '<div id="jjst-black"></div>'+
    '<div id="jjst-fade"></div>'+
    '<div id="jjst-progress"><div id="jjst-progress-fill"></div></div>'+
    '<div id="jjst-cap"><div id="jjst-cap-text"></div></div>'+
    '<div id="jjst-loader"><div class="ring"></div><div class="txt">Loading the tale…</div></div>';

  /* ---- composition: bg crossfade + character layers ---- */
  var bgWrap, layersWrap, curComp = null, curBg = null, curBgLayer = null, animTimers = [], layerRecs = {};
  function showBg(name){
    if (name === curBg) return; curBg = name;
    var incoming = document.createElement('img'); incoming.className = 'jjst-bg'; incoming.src = F(name);
    incoming.style.opacity = '0'; bgWrap.appendChild(incoming);
    var outgoing = curBgLayer; void incoming.offsetWidth;
    incoming.style.transition = 'opacity ' + T.bgFade + 'ms ease'; incoming.style.opacity = '1';
    if (outgoing) { outgoing.style.transition = 'opacity ' + T.bgFade + 'ms ease'; outgoing.style.opacity = '0';
      setTimeout(function () { if (outgoing.parentNode) outgoing.remove(); }, T.bgFade + 80); }
    curBgLayer = incoming;
  }
  function clearAnims(){ animTimers.forEach(function (t) { clearInterval(t); }); animTimers = []; }
  function fadeRemove(el){ el.style.transition = 'opacity .5s ease'; el.style.opacity = '0';
    setTimeout(function () { if (el.parentNode) el.remove(); }, 560); }
  function crossfadeSrc(el, src){                            // swap art with a fade (body is pixel-locked, so only the fire visibly changes)
    var ghost = el.cloneNode(false); ghost.src = src; ghost.style.opacity = '0';
    el.parentNode.insertBefore(ghost, el.nextSibling);
    requestAnimationFrame(function () { ghost.style.opacity = '1'; });
    setTimeout(function () { el.src = src; if (ghost.parentNode) ghost.remove(); }, 560);
  }
  function keyOf(L, idx){ return L.key || (L.anim ? 'anim:' + L.anim[0] : L.src) || ('i' + idx); }
  function buildLayers(layers){
    clearAnims(); layers = layers || [];
    var next = {}; layers.forEach(function (L, idx) { next[keyOf(L, idx)] = true; });
    Object.keys(layerRecs).forEach(function (k) { if (!next[k]) { fadeRemove(layerRecs[k].el); delete layerRecs[k]; } });
    layers.forEach(function (L, idx) {
      var k = keyOf(L, idx), first = F(L.anim ? L.anim[0] : L.src), rec = layerRecs[k], el;
      if (rec) {                                             // reuse: morph to new position + crossfade art
        el = rec.el;
        el.className = 'jjst-layer morph' + (L.cls ? ' ' + L.cls : '');
        el.style.cssText = L.css;
        if (rec.src !== first) { crossfadeSrc(el, first); rec.src = first; }
      } else if (L.cls && L.cls.indexOf('enter') >= 0) {     // fresh, slide-in
        el = document.createElement('img'); el.alt = ''; el.className = 'jjst-layer ' + L.cls;
        el.style.cssText = L.css; el.src = first; layersWrap.appendChild(el);
        requestAnimationFrame(function () { el.classList.add('in'); });
        rec = layerRecs[k] = { el: el, src: first };
      } else {                                               // fresh, fade-in
        el = document.createElement('img'); el.alt = '';
        el.className = 'jjst-layer morph' + (L.cls ? ' ' + L.cls : '');
        el.style.cssText = L.css + ';opacity:0'; el.src = first; layersWrap.appendChild(el);
        requestAnimationFrame(function () { el.style.opacity = '1'; });
        rec = layerRecs[k] = { el: el, src: first };
      }
      if (L.anim) { var i = 0; (function (r, arr, intv) {
        animTimers.push(setInterval(function () { i = (i + 1) % arr.length; r.el.src = F(arr[i]); r.src = F(arr[i]); }, intv || 400));
      })(rec, L.anim, L.int); }
    });
  }
  function setComp(name){
    if (name === curComp) return; curComp = name;
    var c = COMP[name]; if (!c) return;
    showBg(c.bg); buildLayers(c.layers);
  }

  function revealFromBlack(){ var b = document.getElementById('jjst-black');
    b.style.transition = 'width ' + T.revealDur + 'ms ease, height ' + T.revealDur + 'ms ease';
    b.style.width = '260vmax'; b.style.height = '260vmax';
    setTimeout(function () { b.style.display = 'none'; }, T.revealDur + 120); }
  function fadeToBlack(){ var f = document.getElementById('jjst-fade'); void f.offsetWidth; f.style.opacity = '1';
    setTimeout(function () { if (window.jjStory && window.jjStory.unlock) window.jjStory.unlock(); }, T.endFade + 200); }

  /* ---- typing + scene runner ---- */
  var textEl, capEl, prog, fill;
  function setProgress(i){ fill.style.width = Math.min(1, (i + 1) / SCENES.length) * 100 + '%'; }
  function typeText(text, triggers, done){
    var trs = (triggers || []).map(function (tr) { var k = text.indexOf(tr.at); return { idx: k < 0 ? -1 : k + tr.at.length, comp: tr.comp, fired: false }; });
    textEl.textContent = ''; var i = 0; clearTimeout(textEl._tw);
    function step(){
      i++; textEl.textContent = text.slice(0, i);
      for (var j = 0; j < trs.length; j++) { if (!trs[j].fired && trs[j].idx >= 0 && i >= trs[j].idx) { trs[j].fired = true; if (trs[j].comp) setComp(trs[j].comp); } }
      if (i >= text.length) { if (done) done(); return; }
      var ch = text.charAt(i - 1), delay = T.typeSpeed;
      if (ch === '…') delay = T.pauseEllipsis;
      else if (ch === '.') { if (text.charAt(i) === '.') delay = T.typeSpeed; else if (text.charAt(i - 2) === '.') delay = T.pauseEllipsis; else delay = T.pauseDot; }
      else if (ch === '!' || ch === '?') delay = T.pauseDot;
      textEl._tw = setTimeout(step, delay);
    }
    textEl._tw = setTimeout(step, T.typeSpeed);
  }
  function runScene(i){
    if (i >= SCENES.length) return;
    var s = SCENES[i];
    setProgress(i);
    if (s.comp) setComp(s.comp);
    typeText(s.text, s.triggers, function () {
      if (s.end) { setTimeout(function () { s.end.run(); }, s.end.delay); }
      else { setTimeout(function () { runScene(i + 1); }, Math.max(T.readMin, s.text.length * T.readPerChar)); }
    });
  }

  /* ---- mount + choreography ---- */
  var PRELOAD = ['cav-bg','cav-dragon-1','cav-dragon-2','cav-dragon-3','vil-bg','vil-dragon-1','vil-dragon-2','vil-dragon-3','vil-dragon-4',
    'vil-char-1','vil-char-2','vil-char-3','vil-char-4','vil-char-5','vil-pitch-drop','tav-bg','tav-joe','tav-char-1','tav-char-2','tav-char-3',
    'wood-bg','wood-joe','wood-char-1','wood-char-2','cas-bg','cas-joe-1','cas-dragon-1'];
  function mount(){
    if (document.getElementById('jjst')) return;
    document.body.appendChild(wrap);
    document.getElementById('jjst-sky').src = SKY;
    var docEl = document.documentElement;
    docEl.style.overflow = 'hidden'; document.body.style.overflow = 'hidden';
    window.jjStory = window.jjStory || {}; window.jjStory.unlock = function () { docEl.style.overflow = ''; document.body.style.overflow = ''; };
    bgWrap = document.getElementById('jjst-bgwrap'); layersWrap = document.getElementById('jjst-layers');
    textEl = document.getElementById('jjst-cap-text'); capEl = document.getElementById('jjst-cap');
    prog = document.getElementById('jjst-progress'); fill = document.getElementById('jjst-progress-fill');

    PRELOAD.forEach(function (n) { var im = new Image(); im.src = F(n); });
    setComp('cavern');                                                           // first chapter up (hidden by the black)

    preloadCritical(function () {
      var ld = document.getElementById('jjst-loader'); if (ld) ld.classList.add('hide');
      setTimeout(revealFromBlack, T.revealAt);
      setTimeout(function () { capEl.classList.add('on'); prog.classList.add('on'); }, T.boxFadeAt);
      setTimeout(function () {
        var nav = document.querySelectorAll('.nav-logo-link, .menu-container');
        nav.forEach(function (n) { n.style.transition = 'none'; n.style.transform = 'translateY(-42px)'; });
        void document.body.offsetWidth;
        nav.forEach(function (n) { n.style.transition = 'transform .9s cubic-bezier(.22,1,.36,1), opacity .9s ease'; n.style.transform = 'translateY(0)'; n.style.opacity = '1'; });
      }, T.menuDropAt);
      setTimeout(function () { runScene(0); }, T.firstTypeAt);
    });
  }
  function preloadCritical(done){
    var urls = [F('cav-bg'), F('cav-dragon-1'), BANNER], left = urls.length, fired = false;
    function finish(){ if (!fired) { fired = true; done(); } }
    urls.forEach(function (u) { var im = new Image(); im.onload = im.onerror = function () { if (--left <= 0) finish(); }; im.src = u; });
    setTimeout(finish, 9000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
