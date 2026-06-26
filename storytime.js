/* ============================================================================
   Joe's Journey — Storytime page  (hosted via GitHub + raw.githack.com)

   IN WEBFLOW (Storytime page → Page Settings):
     Inside <head>:  <style>.nav-logo-link,.menu-container{opacity:0}</style>   (already added)
     Before </body>: <script src="https://raw.githack.com/jacksonlaptop/joes-journey-code/main/storytime.js"></script>

   A choreographed story scene. Backgrounds are triggered mid-caption by phrases:
     cave → (swipe on "more sinister") village → (zoom a hut on "Luckily one day")
     tavern → (dissolve on "Joe the Righteous") woods → (zoom the castle on "mountains")
     castle → fade to black 1.5s after "magical Designer".
   Opens on black with a medieval torch-light reveal; the nav drops in after 3s.
   ============================================================================ */
(function () {
  window.JJ_STORY_BUILD = 's3 · locals fix';
  try { console.log('%c[JJ] storytime.js build: ' + window.JJ_STORY_BUILD, 'color:#FF00F5;font-weight:bold'); } catch (e) {}

  var GB = 'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/';   // assets uploaded to the repo root

  /* ---- backgrounds (file index → meaning); story uses them out of order ---- */
  var BG = [
    GB + 'story-bg-1-village.svg',
    GB + 'story-bg-2-tavern.svg',
    GB + 'story-bg-3-woods.svg',
    GB + 'story-bg-4-castle.svg',
    GB + 'story-bg-5-cave.svg'
  ];
  var I = { village:0, tavern:1, woods:2, castle:3, cave:4 };   // named indices
  var BOX = GB + 'story-box.svg';

  /* ---- timings (ms) — all adjustable ---- */
  var T = {
    revealAt:    700,    // medieval reveal from black starts
    revealDur:  2200,    // …and how long it takes
    boxFadeAt:  2700,    // caption frame + progress bar fade in (after the reveal)
    menuDropAt: 3000,    // nav drops in + fades
    firstTypeAt:3500,    // first line starts typing
    typeSpeed:    40,    // ms per character
    readPerChar:  46,    // extra read time per character once a line finishes
    readMin:    2600,    // minimum read time between lines
    endFade:    1500     // fade-to-black at the end
  };

  /* ---- focal points for the zoom transitions (percent of the frame) ---- */
  var FOCUS_HUT    = { x:82, y:44 };   // a village hut (scene 4 → tavern)
  var FOCUS_CASTLE = { x:68, y:24 };   // the distant mountain-top castle in the woods scene (scene 5 → castle)

  /* ---- THE STORY ----
     Each scene = the line to type + optional mid-line `triggers` (fire when the
     typewriter reaches `at`) + an optional `end` (fires `delay` ms after the line finishes).
     NOTE: copy is yours verbatim except "He he" → "He had" (clear typo). Other suspected
     typos left as-is and flagged. Scenes 2 & 3 had identical text in your brief, so they're
     one line here (the swipe to the village happens on "more sinister"). */
  var SCENES = [
    { text:"Many moons ago in a mysterious land there lived a cunning and evil beast who dwelled deep in the darkness...." },
    { text:"He had a fascination for gold, jewels, treasures and anything that sparkled...but also something more sinister...the local villagers!",
      triggers:[ { at:"more sinister", run:function(){ transitionBg(I.village, 'swipe'); } } ] },
    { text:"He had many names, Beast, Dragon, Death, but the one that put fear into the hearts of the locals was...Trogdor! Trogdor The Burninator..." },
    { text:"Luckily one day a brave young man appeared to try and best this beast! His goal? To save the villagers and stop this evil...",
      triggers:[ { at:"Luckily one day", run:function(){ transitionBg(I.tavern, 'zoom', FOCUS_HUT); } } ] },
    { text:"“Joe the Righteous” they called! He set off a journey to find the beast, searching through hills and mountains...He went toe to toe with...",
      triggers:[ { at:"Joe the Righteous", run:function(){ transitionBg(I.woods, 'dissolve'); } },
                 { at:"mountains",          run:function(){ transitionBg(I.castle, 'zoom', FOCUS_CASTLE); } } ] },
    { text:"Wait a minute, I think this might be the wrong story...Ah yes, sorry. Different Joe, this one is the story of a Designer...A magical Designer.",
      end:{ delay:T.endFade, run:function(){ fadeToBlack(); } } }
  ];

  /* ---- 1. styles ---- */
  var CSS =
  '#jjst{position:fixed;inset:0;z-index:1;overflow:hidden;background:#0b1b2e;font-family:\'Joes Journey Headline\',sans-serif;}'+
  '#jjst-bgwrap{position:absolute;inset:0;overflow:hidden;}'+
  '#jjst .jjst-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;will-change:transform,opacity;}'+
  '#jjst-black{position:absolute;left:50%;top:55%;width:0;height:0;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 90px 24px rgba(255,176,84,.35) inset,0 0 0 9999px #05080f;z-index:8;pointer-events:none;}'+   // torch-light reveal: a transparent circle that grows, surrounded by black
  '#jjst-fade{position:absolute;inset:0;background:#05080f;opacity:0;z-index:10;pointer-events:none;transition:opacity '+T.endFade+'ms ease;}'+
  '#jjst-progress{position:absolute;left:0;top:0;width:100%;height:5px;background:rgba(255,255,255,.08);z-index:4;opacity:0;transition:opacity .6s ease;}'+
  '#jjst-progress.on{opacity:1;}'+
  '#jjst-progress-fill{height:100%;width:0;background:linear-gradient(90deg,#FF00F5,#ff7df4);box-shadow:0 0 12px rgba(255,0,245,.7);transition:width .6s ease;}'+
  '#jjst-cap{position:absolute;left:50%;bottom:4.5vh;transform:translateX(-50%);width:min(90vw,1297px);aspect-ratio:1297 / 200;z-index:5;opacity:0;transition:opacity .8s ease;background:url(\''+BOX+'\') no-repeat center/contain;display:flex;align-items:center;justify-content:center;pointer-events:none;}'+
  '#jjst-cap.on{opacity:1;}'+
  '#jjst-cap-text{width:74%;text-align:center;color:#3a2a12;font-size:clamp(14px,1.55vw,27px);line-height:1.28;white-space:pre-wrap;}';

  var style = document.createElement('style'); style.id = 'jj-storytime-style'; style.textContent = CSS; document.head.appendChild(style);

  /* ---- 2. markup ---- */
  var wrap = document.createElement('div'); wrap.id = 'jjst';
  wrap.innerHTML =
    '<div id="jjst-bgwrap"></div>'+
    '<div id="jjst-black"></div>'+
    '<div id="jjst-fade"></div>'+
    '<div id="jjst-progress"><div id="jjst-progress-fill"></div></div>'+
    '<div id="jjst-cap"><div id="jjst-cap-text"></div></div>';

  /* ---- 3. background layers + transitions (CSS-driven, no GSAP needed) ---- */
  var bgWrap, curLayer = null;
  function makeLayer(idx){ var im = document.createElement('img'); im.className = 'jjst-bg'; im.src = BG[idx]; bgWrap.appendChild(im); return im; }
  function setFirstBg(idx){ curLayer = makeLayer(idx); }     // shown straight away (under the black)

  // type: 'swipe' (push left), 'zoom' (old scales toward focus + fades, new fades in), 'dissolve' (crossfade)
  function transitionBg(idx, type, focus){
    var incoming = makeLayer(idx), outgoing = curLayer;
    var dur = type === 'zoom' ? 1800 : (type === 'swipe' ? 950 : 1300);
    var ease = 'cubic-bezier(.4,0,.2,1)';
    if (type === 'swipe') { incoming.style.transform = 'translateX(100%)'; }
    else { incoming.style.opacity = '0'; incoming.style.transform = type === 'zoom' ? 'scale(1.06)' : 'none'; }
    void incoming.offsetWidth;                                                   // reflow so the start state takes
    incoming.style.transition = 'transform ' + dur + 'ms ' + ease + ', opacity ' + dur + 'ms ease';
    incoming.style.transform = 'translateX(0) scale(1)'; incoming.style.opacity = '1';
    if (outgoing) {
      outgoing.style.transition = 'transform ' + dur + 'ms ' + ease + ', opacity ' + dur + 'ms ease';
      if (type === 'swipe') { outgoing.style.transform = 'translateX(-100%)'; }
      else if (type === 'zoom') { outgoing.style.transformOrigin = (focus ? focus.x : 50) + '% ' + (focus ? focus.y : 50) + '%'; outgoing.style.transform = 'scale(2.4)'; outgoing.style.opacity = '0'; }
      else { outgoing.style.opacity = '0'; }
      setTimeout(function () { if (outgoing.parentNode) outgoing.remove(); }, dur + 80);
    }
    curLayer = incoming;
  }

  function revealFromBlack(){
    var b = document.getElementById('jjst-black');
    b.style.transition = 'width ' + T.revealDur + 'ms ease, height ' + T.revealDur + 'ms ease';
    b.style.width = '260vmax'; b.style.height = '260vmax';                       // grow the clear circle → reveals the scene
    setTimeout(function () { b.style.display = 'none'; }, T.revealDur + 120);
  }
  function fadeToBlack(){ var f = document.getElementById('jjst-fade'); void f.offsetWidth; f.style.opacity = '1'; }

  /* ---- 4. typing + scene runner ---- */
  var textEl, capEl, prog, fill;
  function setProgress(i){ fill.style.width = Math.min(1, (i + 1) / SCENES.length) * 100 + '%'; }
  function typeText(text, triggers, done){
    var trs = (triggers || []).map(function (tr) { var k = text.indexOf(tr.at); return { idx: k < 0 ? -1 : k + tr.at.length, run: tr.run, fired: false }; });
    textEl.textContent = ''; var i = 0; clearInterval(textEl._tw);
    textEl._tw = setInterval(function () {
      i++; textEl.textContent = text.slice(0, i);
      for (var j = 0; j < trs.length; j++) { if (!trs[j].fired && trs[j].idx >= 0 && i >= trs[j].idx) { trs[j].fired = true; try { trs[j].run(); } catch (e) {} } }
      if (i >= text.length) { clearInterval(textEl._tw); if (done) done(); }
    }, T.typeSpeed);
  }
  function runScene(i){
    if (i >= SCENES.length) return;
    var s = SCENES[i];
    setProgress(i);
    typeText(s.text, s.triggers, function () {
      if (s.end) { setTimeout(function () { s.end.run(); }, s.end.delay); }
      else { setTimeout(function () { runScene(i + 1); }, Math.max(T.readMin, s.text.length * T.readPerChar)); }
    });
  }

  /* ---- 5. mount + choreography ---- */
  function mount(){
    if (document.getElementById('jjst')) return;
    document.body.appendChild(wrap);
    bgWrap = document.getElementById('jjst-bgwrap');
    textEl = document.getElementById('jjst-cap-text'); capEl = document.getElementById('jjst-cap');
    prog = document.getElementById('jjst-progress'); fill = document.getElementById('jjst-progress-fill');

    BG.forEach(function (u) { var im = new Image(); im.src = u; });               // warm the cache so transitions are instant
    setFirstBg(I.cave);                                                           // open in the cave (hidden by the black)

    setTimeout(revealFromBlack, T.revealAt);
    setTimeout(function () { capEl.classList.add('on'); prog.classList.add('on'); }, T.boxFadeAt);
    setTimeout(function () {                                                       // nav drops in from the top + fades (head style starts it hidden)
      var nav = document.querySelectorAll('.nav-logo-link, .menu-container');
      nav.forEach(function (n) { n.style.transition = 'none'; n.style.transform = 'translateY(-42px)'; });
      void document.body.offsetWidth;
      nav.forEach(function (n) { n.style.transition = 'transform .9s cubic-bezier(.22,1,.36,1), opacity .9s ease'; n.style.transform = 'translateY(0)'; n.style.opacity = '1'; });
    }, T.menuDropAt);
    setTimeout(function () { runScene(0); }, T.firstTypeAt);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
