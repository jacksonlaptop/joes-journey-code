/* ============================================================================
   Joe's Journey — Storytime page  (hosted via GitHub + raw.githack.com)

   IN WEBFLOW (Storytime page → Page Settings):
     Inside <head>:  <style>.nav-logo-link,.menu-container{opacity:0}</style>
     Before </body>: <script src="https://raw.githack.com/jacksonlaptop/joes-journey-code/main/storytime.js?v=15"></script>

   Every scene is COMPOSED FROM LAYERS in code (not a flat image): the night sky
   backdrop → a transparent scene bg → positioned character layers (some animated)
   → the J-swirl caption banner. Chapters switch on words as the line types.
   Positions live in COMP below as plain CSS strings — easy to nudge.
   ============================================================================ */
(function () {
  window.JJ_STORY_BUILD = 's20 · left-typed captions, grounded villagers, woodland ride-off, snap pose cuts';
  try { console.log('%c[JJ] storytime.js build: ' + window.JJ_STORY_BUILD, 'color:#FF00F5;font-weight:bold'); } catch (e) {}

  var GB = window.JJ_STORY_BASE || 'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/';
  var AV = '?a=6';
  function F(name){ return GB + 'story-' + name + '.webp' + AV; }
  var BANNER = GB + 'story-banner.webp' + AV;             // J-swirl caption frame
  var SKY = GB + 'story-nightsky.svg' + AV;

  /* ---- compositions: each chapter = a transparent bg + character layers (src OR anim).
         `css` is the layer's position/size — tweak freely. Dragons use right/bottom anchoring
         (their image has transparent smoke/fire room at the top-left). ---- */
  var COMP = {
    cavern: { bg:'cav-bg', layers:[
      { anim:['cav-dragon-1','cav-dragon-2','cav-dragon-3'], int:680, css:'right:7%;bottom:8vh;width:min(57vw,1140px)' }
    ]},
    /* tavern per the "3 - Tavern 1" mockup: Joe mid-left on the floor, grandma back-right,
       hooded guy far right, the old man BIG in the foreground (so he's last = on top). */
    tavern: { bg:'tav-bg', layers:[
      { src:'tav-joe', cls:'enter', css:'left:10%;bottom:24vh;width:min(26vw,520px)' },
      { src:'tav-char-3', cls:'scared', css:'right:15%;bottom:50vh;width:min(14vw,280px)' },
      { src:'tav-char-2', cls:'scared', css:'right:3%;bottom:30vh;width:min(16vw,320px)' },
      { src:'tav-char-1', cls:'scared', css:'right:18%;bottom:22vh;width:min(19.5vw,390px)' }
    ]},
    woodland: { bg:'wood-bg', layers:[
      { src:'wood-joe', css:'left:47%;bottom:26vh;width:min(18vw,360px)',            // rides off into the distance
        to:{ css:'left:48.5%;bottom:40vh;width:min(9vw,180px)', delay:1200, dur:6500 } },
      { src:'wood-char-1', cls:'idle', css:'left:29%;bottom:26vh;width:min(12vw,240px)' },
      { src:'wood-char-2', cls:'idle', css:'left:68%;bottom:26vh;width:min(13vw,260px)' }
    ]},
    /* CASTLE = 7-shot sequence traced from the "5 - Castle 1/2/3/4/5/6/13" mockups. Keys persist
       across shots so the engine morphs/crossfades: `joe` = knight arts → designer arts (the
       swap happens while `joecloud` covers him); `dragon` crossfades pose → then SHRINKS via a
       width/position morph in castle6 → gone by castle13 (only the `wisp` remains). Smoke clouds
       are the cas-smoke assets; a --flip:-1 on a cloud mirrors it (the idle keyframe reads it). */
    castle1: { bg:'cas-bg', layers:[          // standoff — sword drawn, dragon huffs
      { key:'joe', src:'cas-joe-2', css:'left:21%;bottom:25vh;width:min(16vw,320px)' },
      { key:'dragon', src:'cas-dragon-2', css:'right:10%;bottom:23vh;width:min(38vw,760px)' }
    ]},
    castle2: { bg:'cas-bg', layers:[          // fire vs shield
      { key:'joe', src:'cas-joe-1', css:'left:18%;bottom:24vh;width:min(17vw,340px)' },
      { key:'dragon', src:'cas-dragon-1', css:'right:9%;bottom:17vh;width:min(65vw,1300px)' }
    ]},
    castle3: { bg:'cas-bg', layers:[          // both suddenly unsure
      { key:'joe', src:'cas-joe-3', css:'left:19%;bottom:25vh;width:min(16vw,320px)' },
      { key:'dragon', src:'cas-dragon-3', css:'right:10%;bottom:24vh;width:min(32vw,640px)' }
    ]},
    castle4: { bg:'cas-bg', layers:[          // Joe POOFS — knight key dropped, cloud takes his spot
      { key:'dragon', src:'cas-dragon-4', css:'right:10%;bottom:24vh;width:min(32vw,640px)' },
      { key:'joecloud', src:'cas-smoke-1', cls:'idle', css:'left:20%;bottom:24vh;width:min(10vw,200px)' }
    ]},
    castle5: { bg:'cas-bg', layers:[          // designer Joe revealed — now the DRAGON poofs
      { key:'joe', src:'cas-designer-1', css:'left:19%;bottom:26vh;width:min(13vw,260px)' },
      { key:'dragon', src:'cas-dragon-4', css:'right:10%;bottom:24vh;width:min(32vw,640px)' },
      { key:'drcloud', src:'cas-smoke-1', cls:'idle', css:'left:63%;bottom:22vh;width:min(14vw,280px)' },
      { key:'drcloud2', src:'cas-smoke-1', cls:'idle', css:'left:72%;bottom:22vh;width:min(13vw,260px);--flip:-1' }
    ]},
    castle6: { bg:'cas-bg', layers:[          // dragon SHRINKS in the dissipating smoke
      { key:'joe', src:'cas-designer-1', css:'left:19%;bottom:26vh;width:min(13vw,260px)' },
      { key:'dragon', src:'cas-dragon-4', css:'right:25%;bottom:27vh;width:min(9vw,180px)' },
      { key:'joecloud', src:'cas-smoke-1', cls:'idle', css:'left:20.5%;bottom:25vh;width:min(8vw,160px)' },
      { key:'drcloud', src:'cas-smoke-1', cls:'idle', css:'left:63.5%;bottom:23vh;width:min(10vw,200px)' }
    ]},
    castle13: { bg:'cas-bg', layers:[         // the Designer, and a wisp where the beast stood
      { key:'joe', src:'cas-designer-2', css:'left:19%;bottom:27vh;width:min(14vw,280px)' },
      { key:'wisp', src:'cas-smoke-2', cls:'idle', css:'left:68%;bottom:27vh;width:min(5.5vw,110px)' }
    ]}
  };

  /* ---- VILLAGE = 4-panel storyboard, sizes + positions traced from the "2 - Village 1..4"
         mockups (grid-measured, canvas padding factored in). Same bg + same characters (matched
         by `key`): the dragon FIRE crossfades in place (body pixel-locked) while villagers MORPH.
         Design choreography: pitchfork trio holds mid-left; the redhead (v3) flees UP the centre
         path shrinking; the old man (v1) watches from the RIGHT house doorway then ducks into the
         window; the bonnet girl (v2) starts by the right house and flees off right in P2; the
         mustache kid (v7) runs in from bottom-centre in P2 and flees left; in P4 only the
         terrified drop-guy + v7 remain. Panels advance on an equal timer (see runVillageSeq). ---- */
  var VIL_DRAGON = 'right:13%;bottom:21vh;width:min(62vw,1240px)';   // Trogdor — body 25vw; nudged 1% left so the tail clears the old man's window
  function vil(dragon, p){
    var L = [ { key:'dragon', src:dragon, css:VIL_DRAGON },
      { key:'pitch', src:'vil-char-4', cls:'idle', css:p.pitch },    // pitchfork guy — mid-left
      { key:'v5', src:'vil-char-5', cls:'idle', css:p.v5 },          // curly — beside him
      { key:'v3', src:'vil-char-3', cls:'idle', css:p.v3 },          // redhead — RUNS up the path, shrinking
      { key:'v1', src:'vil-char-1', cls:'idle', css:p.v1 },          // old man — right house doorway → window
    ];
    if (p.v7) L.push({ key:'v7', src:'vil-char-7', cls:'idle', css:p.v7 });   // mustache kid (enters P2)
    if (p.v2) L.push({ key:'v2', src:'vil-char-2', cls:'idle', css:p.v2 });   // bonnet girl (gone after P2)
    return { bg:'vil-bg', layers:L };
  }
  COMP.village1 = vil('vil-dragon-1', {        // smoke puff — old man at the LIT WINDOW (grounded, not floating on the wall)
    pitch:'left:19%;bottom:31vh;width:min(11vw,220px)', v5:'left:27%;bottom:33vh;width:min(10vw,200px)',
    v3:'left:37%;bottom:37vh;width:min(8vw,160px)',     v1:'left:75%;bottom:49vh;width:min(10vw,200px)',
    v2:'left:85%;bottom:33vh;width:min(16vw,320px)' });
  COMP.village2 = vil('vil-dragon-2', {        // small flame — v7 runs in, bonnet flees off right, old man shrinks back into the window
    pitch:'left:21%;bottom:31vh;width:min(9.5vw,190px)', v5:'left:27%;bottom:33vh;width:min(10vw,200px)',
    v3:'left:43%;bottom:43vh;width:min(6vw,120px)',      v1:'left:76%;bottom:51vh;width:min(8vw,160px)',
    v7:'left:34%;bottom:24vh;width:min(10vw,200px)',     v2:'left:91%;bottom:27vh;width:min(15vw,300px)' });
  COMP.village3 = vil('vil-dragon-3', {        // medium flame — curly bolts far left, redhead tiny up the path
    pitch:'left:20%;bottom:33vh;width:min(10vw,200px)',  v5:'left:8%;bottom:40vh;width:min(10vw,200px)',
    v3:'left:42%;bottom:49vh;width:min(4.4vw,88px)',     v1:'left:76%;bottom:51vh;width:min(8vw,160px)',
    v7:'left:17%;bottom:29vh;width:min(7vw,140px)' });
  COMP.village4 = { bg:'vil-bg', layers:[   // big flame — everyone's fled except the drop-guy + v7
    { key:'dragon', src:'vil-dragon-4', css:VIL_DRAGON },
    { key:'pitchdrop', src:'vil-pitch-drop', cls:'idle', css:'left:12%;bottom:26vh;width:min(13.5vw,270px)' },
    { key:'v7', src:'vil-char-7', cls:'idle', css:'left:1%;bottom:26vh;width:min(10vw,200px)' }
  ]};   // key 'pitch' absent → the charging guy fades out as the terrified drop-guy fades in

  /* ---- captions: each = the line + the chapter it's on + word `triggers` that switch chapter ---- */
  var SCENES = [
    { text:"Many moons ago in a mysterious land there lived a cunning and evil beast who dwelled deep in the darkness....", comp:'cavern' },
    { text:"He had a fascination for gold, jewels, treasures and anything that sparkled...but also something more sinister...the local villagers!",
      comp:'cavern', triggers:[ { at:'more sinister', comp:'village1' } ] },
    { text:"He had many names, Beast, Dragon, Death, but the one that put fear into the hearts of the locals was...Trogdor! Trogdor The Burninator...",
      comp:'village1' },   // village1→2→3→4 now advance on an equal timer (see runVillageSeq), not on these words
    { text:"Luckily one day a brave young man appeared to try and best this beast! His goal? To save the villagers and stop this evil...",
      comp:'village4', triggers:[ { at:'Luckily one day', comp:'tavern' } ] },
    { text:"“Joe the Righteous” they called! He set off a journey to find the beast, searching through forests, rolling hills and treacherous mountains...",
      comp:'tavern', triggers:[ { at:'Joe the Righteous', comp:'woodland' } ] },
    { text:"He went toe to toe with the beast in an epic battle lasting for days, facing fire and all his might and...Wait a minute...I think this is the wrong story...",
      comp:'castle1', triggers:[ { at:'facing fire', comp:'castle2' }, { at:'Wait a minute', comp:'castle3' } ] },
    { text:"Ah yes, sorry. Oops, that's a different Joe. This one is the story of a Designer...yet still an all great and powerful Designer...",
      comp:'castle4', triggers:[ { at:'different Joe', comp:'castle5' }, { at:'story of a Designer', comp:'castle6' } ],
      end:{ delay:1600, run:function(){ setComp('castle13'); setTimeout(fadeToBlack, 3200); } } }
  ];

  /* ---- timings (ms) ---- */
  var T = { revealAt:700, revealDur:2200, boxFadeAt:2700, menuDropAt:3000, firstTypeAt:3500,
    typeSpeed:24, pauseDot:280, pauseEllipsis:620, readPerChar:32, readMin:1700, bgFade:600, endFade:1500,
    villagePanel:3600 };   // each of the 4 village dragon 'shots' holds this long (equal timing, not word-driven)

  /* ---- styles ---- */
  var CSS =
  '#jjst{position:fixed;inset:0;z-index:2000;overflow:hidden;background:#0b1b2e;font-family:\'Joes Journey Headline\',sans-serif;}'+
  '#jjst-bgwrap{position:absolute;inset:0;overflow:hidden;}'+
  '#jjst-sky{position:absolute;top:0;left:0;width:100%;height:auto;display:block;}'+
  '#jjst .jjst-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;will-change:opacity;}'+
  '#jjst-layers{position:absolute;inset:0;z-index:3;pointer-events:none;}'+
  '#jjst-layers .jjst-layer{position:absolute;height:auto;display:block;will-change:transform,opacity;}'+
  '@keyframes jjst-scared{0%,100%{transform:rotate(-2.2deg);}50%{transform:rotate(2.2deg);}}'+   // tremble in place — no lift, feet stay planted
  '.jjst-layer.scared{animation:jjst-scared .5s ease-in-out infinite;transform-origin:center bottom;}'+
  '@keyframes jjst-idle{0%,100%{transform:scaleX(var(--flip,1)) scaleY(1);}50%{transform:scaleX(var(--flip,1)) scaleY(.965);}}'+   // grounded squash bob (origin bottom) — nothing floats
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
  '#jjst-cap{position:absolute;left:50%;bottom:7vh;transform:translateX(-50%);width:min(83vw,1350px);aspect-ratio:1295 / 200;z-index:5;opacity:0;transition:opacity .8s ease;background:url(\''+BANNER+'\') no-repeat center/contain;display:flex;align-items:center;justify-content:center;pointer-events:none;}'+
  '#jjst-cap.on{opacity:1;}'+
  '#jjst-cap-text{width:72%;text-align:left;color:#3a2a12;font-size:clamp(15px,1.6vw,27px);line-height:1.26;white-space:pre-wrap;}';   // left-aligned so typing doesn't re-centre every character

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
  function keyOf(L, idx){ return L.key || (L.anim ? 'anim:' + L.anim[0] : L.src) || ('i' + idx); }
  function buildLayers(layers){
    clearAnims(); layers = layers || [];
    var next = {}; layers.forEach(function (L, idx) { next[keyOf(L, idx)] = true; });
    Object.keys(layerRecs).forEach(function (k) { if (!next[k]) { fadeRemove(layerRecs[k].el); delete layerRecs[k]; } });
    layers.forEach(function (L, idx) {
      var k = keyOf(L, idx), first = F(L.anim ? L.anim[0] : L.src), rec = layerRecs[k], el;
      if (rec && rec.src !== first) {                        // ART CHANGE = a pose cut: ghost of the OLD art at the
        el = rec.el;                                         // OLD position fades out while the NEW art SNAPS into
        var ghost = el.cloneNode(false);                     // place underneath. No position morph — sliding a
        ghost.src = el.currentSrc || el.src;                 // differently-padded canvas around reads as a weird jump.
        ghost.style.cssText = el.style.cssText + ';opacity:1;transition:opacity .55s ease;animation:none;';
        el.className = 'jjst-layer' + (L.cls ? ' ' + L.cls : '');
        el.src = first; el.style.cssText = L.css; rec.src = first;
        el.parentNode.insertBefore(ghost, el.nextSibling);
        requestAnimationFrame(function () { ghost.style.opacity = '0'; });
        setTimeout(function () { if (ghost.parentNode) ghost.remove(); }, 620);
        void el.offsetWidth;
        el.className = 'jjst-layer morph' + (L.cls ? ' ' + L.cls : '');
      } else if (rec) {                                      // same art: smooth position/size morph (walks, the shrink)
        el = rec.el;
        el.className = 'jjst-layer morph' + (L.cls ? ' ' + L.cls : '');
        el.style.cssText = L.css;
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
      if (L.to) { (function (element, t) {                   // slow secondary move within a shot (e.g. Joe rides into the distance)
        animTimers.push(setTimeout(function () {
          var e = t.ease || 'ease-in-out', d = t.dur || 4000;
          element.style.transition = ['left', 'right', 'bottom', 'width'].map(function (p) { return p + ' ' + d + 'ms ' + e; }).join(',');
          t.css.split(';').forEach(function (decl) { var c = decl.indexOf(':'); if (c > 0) element.style.setProperty(decl.slice(0, c).trim(), decl.slice(c + 1).trim()); });
        }, t.delay || 0));
      })(el, L.to); }
    });
  }
  var panelTimers = [];
  function clearPanels(){ panelTimers.forEach(function (t) { clearTimeout(t); }); panelTimers = []; }
  function runVillageSeq(){                          // village1 is up — advance 2→3→4 at equal intervals
    clearPanels();
    ['village2','village3','village4'].forEach(function (name, i) {
      panelTimers.push(setTimeout(function () { setComp(name); }, T.villagePanel * (i + 1)));
    });
  }
  function setComp(name){
    if (name === curComp) return;
    if (name === 'village1' && typeof curComp === 'string' && curComp.indexOf('village') === 0) return; // don't restart the village once it's running (2nd caption keeps comp:'village1')
    curComp = name;
    var c = COMP[name]; if (!c) return;
    showBg(c.bg); buildLayers(c.layers);
    if (name === 'village1') runVillageSeq();        // start the equal-timed dragon-fire sequence
    else if (name.indexOf('village') !== 0) clearPanels();  // left the village → cancel any pending shots
  }

  function revealFromBlack(){ var b = document.getElementById('jjst-black');
    b.style.transition = 'width ' + T.revealDur + 'ms ease, height ' + T.revealDur + 'ms ease';
    b.style.width = '260vmax'; b.style.height = '260vmax';
    setTimeout(function () { b.style.display = 'none'; }, T.revealDur + 120); }
  function fadeToBlack(){ var f = document.getElementById('jjst-fade'); void f.offsetWidth; f.style.opacity = '1';
    setTimeout(function () {
      if (window.jjStory && window.jjStory.unlock) window.jjStory.unlock();
      window.scrollTo(0, 0);
      var w = document.getElementById('jjst');                 // lift the black away → My Story is revealed beneath
      if (w) { w.style.transition = 'opacity 1.4s ease'; w.style.opacity = '0';
        setTimeout(function () { if (w.parentNode) w.remove(); }, 1500); }
    }, T.endFade + 300); }

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
    'vil-char-1','vil-char-2','vil-char-3','vil-char-4','vil-char-5','vil-char-7','vil-pitch-drop','tav-bg','tav-joe','tav-char-1','tav-char-2','tav-char-3',
    'wood-bg','wood-joe','wood-char-1','wood-char-2','cas-bg','cas-joe-1','cas-joe-2','cas-joe-3',
    'cas-dragon-1','cas-dragon-2','cas-dragon-3','cas-dragon-4','cas-designer-1','cas-designer-2','cas-smoke-1','cas-smoke-2'];
  function mount(){
    if (document.getElementById('jjst')) return;
    document.body.appendChild(wrap);
    document.getElementById('jjst-sky').src = SKY;
    var docEl = document.documentElement;
    docEl.style.overflow = 'hidden'; document.body.style.overflow = 'hidden';
    window.jjStory = window.jjStory || {}; window.jjStory.unlock = function () { docEl.style.overflow = ''; document.body.style.overflow = ''; };
    window.jjStory.setComp = setComp;                  // debug hooks — jump straight to a comp (used by the local preview)
    window.jjStory.hold = function (n) { setComp(n); clearPanels(); };   // jump + freeze (no village auto-advance)
    bgWrap = document.getElementById('jjst-bgwrap'); layersWrap = document.getElementById('jjst-layers');
    textEl = document.getElementById('jjst-cap-text'); capEl = document.getElementById('jjst-cap');
    prog = document.getElementById('jjst-progress'); fill = document.getElementById('jjst-progress-fill');

    PRELOAD.forEach(function (n) { var im = new Image(); im.src = F(n); });
    setComp('cavern');                                                           // first chapter up (hidden by the black)

    preloadCritical(function () {
      var ld = document.getElementById('jjst-loader'); if (ld) ld.classList.add('hide');
      if (window.JJ_STORY_HOLD) {                      // preview mode: instant reveal, no typing/choreography
        var blk = document.getElementById('jjst-black'); blk.style.display = 'none';
        capEl.classList.add('on'); prog.classList.add('on');
        textEl.textContent = 'Preview — jjStory.hold(\'tavern\') to jump comps';
        return;
      }
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
