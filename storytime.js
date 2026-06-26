/* ============================================================================
   Joe's Journey — Storytime page  (hosted via GitHub + raw.githack.com)

   IN WEBFLOW (Storytime page → Page Settings):
     Inside <head>:  <style>.nav-logo-link,.menu-container{opacity:0}</style>   (already added by you)
     Before </body>: <script src="https://raw.githack.com/jacksonlaptop/joes-journey-code/main/storytime.js"></script>

   Builds a full-screen story scene: the 5 backgrounds cross-fade in order, a
   persistent caption box sits at the bottom, each panel's copy types out, and a
   pink progress bar tracks how far through the story you are. The site nav drops
   in + fades after 3s (the head style hides it until then).
   ============================================================================ */
(function () {
  window.JJ_STORY_BUILD = 's1 · scene-engine';
  try { console.log('%c[JJ] storytime.js build: ' + window.JJ_STORY_BUILD, 'color:#FF00F5;font-weight:bold'); } catch (e) {}

  var GB = 'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/';   // upload the assets to the repo root (lowercase names below)

  /* ---- backgrounds, in story order (numbered as staged) ---- */
  var BG = [
    GB + 'story-bg-1-village.svg',   // 1 — village
    GB + 'story-bg-2-tavern.svg',    // 2 — tavern
    GB + 'story-bg-3-woods.svg',     // 3 — woods
    GB + 'story-bg-4-castle.svg',    // 4 — castle mountain
    GB + 'story-bg-5-cave.svg'       // 5 — cave
  ];
  var BOX = GB + 'story-box.svg';    // the empty caption frame (Text Empty.svg)

  /* ---- the story: one entry per panel = { bg: index into BG, text: line to type } ----
     NOTE: the Text 1–6 SVGs are outlined (text → paths), so the copy can't be auto-read.
     Panels 2/3/4 are transcribed from the screenshots; 1, 5 and 6 are PLACEHOLDERS —
     paste the real copy here and the bg mapping is just the `bg:` numbers below. */
  var STORY = [
    { bg:0, text:"Long ago, in a kingdom far away, there lived a fearsome beast…" },                                                                 /* TODO panel 1 */
    { bg:0, text:"He had a fascination for gold, jewels, treasures and anything that sparkled…but also something more sinister…the local villagers!" },
    { bg:1, text:"Luckily one day a brave young man appeared to try and best this beast! His goal? To save the villagers and stop this evil…" },
    { bg:2, text:"“Joe the Righteous” they called! He set off a journey to find the beast, searching through hills and mountains…He went toe to toe with…" },
    { bg:3, text:"…(panel 5 copy needed)…" },                                                                                                    /* TODO panel 5 */
    { bg:4, text:"…(panel 6 copy needed)…" }                                                                                                     /* TODO panel 6 */
  ];

  /* ---- timings (ms) ---- */
  var T = {
    menuDropAt:    3000,   // nav drops in + fades after 3s
    boxFadeAt:     2000,   // caption box (+ progress bar) fade in after 2s
    firstTypeAfter:3000,   // then 3s later the first panel starts typing
    typeSpeed:       38,   // ms per character
    readPerChar:     46,   // extra reading time per character once a line finishes
    readMin:       2400,   // minimum reading time
    bgFade:        1200    // background cross-fade
  };

  /* ---- 1. styles ---- */
  var CSS =
  '#jjst{position:fixed;inset:0;z-index:1;overflow:hidden;background:#0b1b2e;font-family:\'Joes Journey Headline\',sans-serif;}'+
  '#jjst .jjst-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity '+T.bgFade+'ms ease;will-change:opacity;}'+
  '#jjst .jjst-bg.on{opacity:1;}'+
  '#jjst-progress{position:absolute;left:0;top:0;width:100%;height:5px;background:rgba(255,255,255,.08);z-index:4;opacity:0;transition:opacity .6s ease;}'+
  '#jjst-progress.on{opacity:1;}'+
  '#jjst-progress-fill{height:100%;width:0;background:linear-gradient(90deg,#FF00F5,#ff7df4);box-shadow:0 0 12px rgba(255,0,245,.7);transition:width .5s ease;}'+
  '#jjst-cap{position:absolute;left:50%;bottom:4.5vh;transform:translateX(-50%);width:min(90vw,1297px);aspect-ratio:1297 / 200;z-index:3;opacity:0;transition:opacity .8s ease;background:url(\''+BOX+'\') no-repeat center/contain;display:flex;align-items:center;justify-content:center;pointer-events:none;}'+
  '#jjst-cap.on{opacity:1;}'+
  '#jjst-cap-text{width:74%;text-align:center;color:#3a2a12;font-size:clamp(14px,1.55vw,27px);line-height:1.28;white-space:pre-wrap;}';

  var style = document.createElement('style'); style.id = 'jj-storytime-style'; style.textContent = CSS; document.head.appendChild(style);

  /* ---- 2. markup ---- */
  var wrap = document.createElement('div'); wrap.id = 'jjst';
  wrap.innerHTML =
    '<img class="jjst-bg" id="jjst-bg-a" alt="">'+
    '<img class="jjst-bg" id="jjst-bg-b" alt="">'+
    '<div id="jjst-progress"><div id="jjst-progress-fill"></div></div>'+
    '<div id="jjst-cap"><div id="jjst-cap-text"></div></div>';

  function mount(){
    if (document.getElementById('jjst')) return;
    document.body.appendChild(wrap);
    BG.forEach(function (u) { var im = new Image(); im.src = u; });   // warm the cache so cross-fades are instant

    var bgA = document.getElementById('jjst-bg-a'), bgB = document.getElementById('jjst-bg-b');
    var capEl = document.getElementById('jjst-cap'), textEl = document.getElementById('jjst-cap-text');
    var prog = document.getElementById('jjst-progress'), fill = document.getElementById('jjst-progress-fill');
    var activeBg = null, curBg = -1;

    function showBg(idx){
      if (idx === curBg) return; curBg = idx;
      var show = (activeBg === bgA) ? bgB : bgA, hide = activeBg;
      var reveal = function () { show.classList.add('on'); if (hide) hide.classList.remove('on'); activeBg = show; };
      show.src = BG[idx];
      if (show.complete && show.naturalWidth) reveal(); else show.onload = reveal;
    }
    function setProgress(i){ fill.style.width = Math.min(1, (i + 1) / STORY.length) * 100 + '%'; }

    function typeText(text, done){
      textEl.textContent = ''; var i = 0; clearInterval(textEl._tw);
      textEl._tw = setInterval(function () {
        i++; textEl.textContent = text.slice(0, i);
        if (i >= text.length) { clearInterval(textEl._tw); if (done) done(); }
      }, T.typeSpeed);
    }
    function runPanel(i){
      if (i >= STORY.length) return;                                  // story finished — leave the last caption up
      var p = STORY[i];
      showBg(p.bg);
      setProgress(i);
      typeText(p.text, function () {
        var readMs = Math.max(T.readMin, p.text.length * T.readPerChar);
        setTimeout(function () { runPanel(i + 1); }, readMs);
      });
    }

    // nav drop-in + fade after 3s (head style starts it hidden at opacity:0)
    setTimeout(function () {
      var nav = document.querySelectorAll('.nav-logo-link, .menu-container');
      nav.forEach(function (n) { n.style.transition = 'none'; n.style.transform = 'translateY(-42px)'; });
      void document.body.offsetWidth;                                 // reflow so the start position takes before we animate
      nav.forEach(function (n) { n.style.transition = 'transform .9s cubic-bezier(.22,1,.36,1), opacity .9s ease'; n.style.transform = 'translateY(0)'; n.style.opacity = '1'; });
    }, T.menuDropAt);

    // first background up immediately (behind everything, before the box appears)
    showBg(STORY[0].bg);

    // box + progress fade in, then typing starts
    setTimeout(function () { capEl.classList.add('on'); prog.classList.add('on'); }, T.boxFadeAt);
    setTimeout(function () { runPanel(0); }, T.boxFadeAt + T.firstTypeAfter);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
