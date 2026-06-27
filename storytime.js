/* ============================================================================
   Joe's Journey — Storytime page  (hosted via GitHub + raw.githack.com)

   IN WEBFLOW (Storytime page → Page Settings):
     Inside <head>:  <style>.nav-logo-link,.menu-container{opacity:0}</style>   (already added)
     Before </body>: <script src="https://raw.githack.com/jacksonlaptop/joes-journey-code/main/storytime.js?v=8"></script>

   The intro is a sequence of full-screen frames (WebP) that SWAP ON WORDS as each
   line types — e.g. cavern-1 → "beast" → cavern-2 → "darkness" → cavern-3. Opens on
   black with a torch-light reveal; nav drops in after 3s; pink progress bar; a
   loading screen holds until the first frame + box are ready; scroll is locked
   until the story ends.
   ============================================================================ */
(function () {
  window.JJ_STORY_BUILD = 's10 · cavern rebuilt as layers (bg + night sky + animated dragon)';
  try { console.log('%c[JJ] storytime.js build: ' + window.JJ_STORY_BUILD, 'color:#FF00F5;font-weight:bold'); } catch (e) {}

  var GB = 'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/';
  var AV = '?a=3';                                            // asset cache-buster — bump when any frame/box is re-uploaded
  function F(name){ return GB + 'story-' + name + '.webp' + AV; }   // frame url helper, e.g. F('cavern-2')
  var BOX = GB + 'story-box.webp' + AV;
  var SKY = GB + 'story-nightsky.svg' + AV;                   // (kept for the later scrollable section; hidden behind the opaque frames here)

  // every frame we have — preloaded so swaps are instant
  var FRAMES = ['cav-bg','cav-dragon-1','cav-dragon-2','cav-dragon-3','village-1','tavern-1','woodland-1','castle-1'];   // cavern is layered now; the rest still flat full-screen frames (rebuilt next)

  /* ---- THE STORY ----
     Each scene = the line to type + the frame it OPENS on + `triggers` that swap the
     frame when the typewriter reaches a word. CONFIRMED: cavern (your example).
     TODO: the within-chapter frames (village-2/3/4, the Trogdor frame, castle-2..6/13)
     need the trigger word for each — they're marked below. */
  var SCENES = [
    // 1 — CAVERN (3 frames) — confirmed from your example
    { text:"Many moons ago in a mysterious land there lived a cunning and evil beast who dwelled deep in the darkness....",
      frame:'cav-bg',
      onEnter:function(){ playDragon(['cav-dragon-1','cav-dragon-2','cav-dragon-3'], 680); } },   // LAYERED: transparent cave over the night sky + the sleeping dragon breathing (smoke loop)

    // 2 — still the cavern; chapter changes to the VILLAGE (flat for now) on "more sinister"
    { text:"He had a fascination for gold, jewels, treasures and anything that sparkled...but also something more sinister...the local villagers!",
      frame:'cav-bg',
      triggers:[ { at:'more sinister', frame:'village-1' } ] },                       /* village/tavern/woodland/castle still flat full-screen frames — rebuilt next */

    // 3 — TROGDOR reveal (still village)
    { text:"He had many names, Beast, Dragon, Death, but the one that put fear into the hearts of the locals was...Trogdor! Trogdor The Burninator...",
      frame:'village-1' },                                                           /* TODO: which village frame(s), e.g. swap to village-? on "Trogdor!" */

    // 4 — to the TAVERN (1 frame) on "Luckily one day"
    { text:"Luckily one day a brave young man appeared to try and best this beast! His goal? To save the villagers and stop this evil...",
      frame:'village-1',
      triggers:[ { at:'Luckily one day', frame:'tavern-1' } ] },

    // 5 — WOODLAND then CASTLE (castle = 7 frames) — chapter changes known; castle-2..6/13 TODO
    { text:"“Joe the Righteous” they called! He set off a journey to find the beast, searching through hills and mountains...He went toe to toe with the beast...",
      frame:'tavern-1',
      triggers:[ { at:'Joe the Righteous', frame:'woodland-1' }, { at:'mountains', frame:'castle-1' } ] },   /* TODO: castle-2..6 on which words? */

    // 6 — CASTLE, fade to black 1.5s after "magical Designer"
    { text:"Wait a minute, I think this might be the wrong story...Ah yes, sorry. Different Joe, this one is the story of a Designer...A magical Designer.",
      frame:'castle-1',                                                              /* TODO: castle frames during this line + the "13" frame */
      end:{ delay:1500, run:function(){ fadeToBlack(); } } }
  ];

  /* ---- timings (ms) ---- */
  var T = {
    revealAt:    700, revealDur: 2200, boxFadeAt: 2700, menuDropAt: 3000, firstTypeAt: 3500,
    typeSpeed:    24, pauseDot: 280, pauseEllipsis: 620,
    readPerChar:  32, readMin: 1700, frameFade: 280, endFade: 1500
  };

  /* ---- styles ---- */
  var CSS =
  '#jjst{position:fixed;inset:0;z-index:1;overflow:hidden;background:#0b1b2e;font-family:\'Joes Journey Headline\',sans-serif;}'+
  '#jjst-bgwrap{position:absolute;inset:0;overflow:hidden;}'+
  '#jjst-sky{position:absolute;top:0;left:0;width:100%;height:auto;display:block;}'+
  '#jjst .jjst-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;will-change:opacity;}'+
  '#jjst-dragon{position:absolute;right:17%;bottom:11vh;width:min(40vw,560px);height:auto;z-index:3;opacity:0;transition:opacity .5s ease;pointer-events:none;}'+   // sleeping dragon over the cavern bg (position est. — refine)
  '#jjst-dragon.on{opacity:1;}'+
  '#jjst-black{position:absolute;left:50%;top:55%;width:0;height:0;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 90px 24px rgba(255,176,84,.35) inset,0 0 0 9999px #05080f;z-index:8;pointer-events:none;}'+
  '#jjst-fade{position:absolute;inset:0;background:#05080f;opacity:0;z-index:10;pointer-events:none;transition:opacity '+T.endFade+'ms ease;}'+
  '#jjst-loader{position:absolute;inset:0;z-index:20;background:#05080f;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;transition:opacity .6s ease;}'+
  '#jjst-loader.hide{opacity:0;pointer-events:none;}'+
  '#jjst-loader .ring{width:46px;height:46px;border-radius:50%;border:4px solid rgba(244,197,96,.22);border-top-color:#f4c560;animation:jjst-spin .9s linear infinite;}'+
  '#jjst-loader .txt{font-family:\'Joes Journey Headline\',sans-serif;color:#e8d9b5;font-size:15px;letter-spacing:1px;}'+
  '@keyframes jjst-spin{to{transform:rotate(360deg);}}'+
  '#jjst-progress{position:absolute;left:0;top:0;width:100%;height:5px;background:rgba(255,255,255,.08);z-index:4;opacity:0;transition:opacity .6s ease;}'+
  '#jjst-progress.on{opacity:1;}'+
  '#jjst-progress-fill{height:100%;width:0;background:linear-gradient(90deg,#FF00F5,#ff7df4);box-shadow:0 0 12px rgba(255,0,245,.7);transition:width .6s ease;}'+
  '#jjst-cap{position:absolute;left:50%;bottom:4.5vh;transform:translateX(-50%);width:min(90vw,1297px);aspect-ratio:1297 / 200;z-index:5;opacity:0;transition:opacity .8s ease;background:url(\''+BOX+'\') no-repeat center/contain;display:flex;align-items:center;justify-content:center;pointer-events:none;}'+
  '#jjst-cap.on{opacity:1;}'+
  '#jjst-cap-text{width:72%;text-align:center;color:#3a2a12;font-size:clamp(16px,1.7vw,29px);line-height:1.26;white-space:pre-wrap;}';

  var style = document.createElement('style'); style.id = 'jj-storytime-style'; style.textContent = CSS; document.head.appendChild(style);

  /* ---- markup ---- */
  var wrap = document.createElement('div'); wrap.id = 'jjst';
  wrap.innerHTML =
    '<div id="jjst-bgwrap"><img id="jjst-sky" alt=""></div>'+
    '<img id="jjst-dragon" alt="">'+
    '<div id="jjst-black"></div>'+
    '<div id="jjst-fade"></div>'+
    '<div id="jjst-progress"><div id="jjst-progress-fill"></div></div>'+
    '<div id="jjst-cap"><div id="jjst-cap-text"></div></div>'+
    '<div id="jjst-loader"><div class="ring"></div><div class="txt">Loading the tale…</div></div>';

  /* ---- frames: a single visible frame that crossfades to the next ---- */
  var bgWrap, curLayer = null, curFrame = null;
  // animated character layer (cycles a set of frames, e.g. the dragon breathing)
  var charTimer = null;
  function playDragon(frames, interval){
    stopDragon(); var el = document.getElementById('jjst-dragon'); if (!el) return;
    var i = 0; el.src = F(frames[0]); el.classList.add('on');
    charTimer = setInterval(function () { i = (i + 1) % frames.length; el.src = F(frames[i]); }, interval);
  }
  function stopDragon(){ if (charTimer) { clearInterval(charTimer); charTimer = null; } var el = document.getElementById('jjst-dragon'); if (el) el.classList.remove('on'); }
  function showFrame(name){
    if (name === curFrame) return; curFrame = name;
    if (name !== 'cav-bg') stopDragon();                                          // leaving the layered cavern → hide the separate dragon (flat frames have it baked in)
    var incoming = document.createElement('img'); incoming.className = 'jjst-bg'; incoming.src = F(name);
    incoming.style.opacity = '0'; bgWrap.appendChild(incoming);
    var outgoing = curLayer;
    void incoming.offsetWidth;
    incoming.style.transition = 'opacity ' + T.frameFade + 'ms ease'; incoming.style.opacity = '1';
    if (outgoing) { outgoing.style.transition = 'opacity ' + T.frameFade + 'ms ease'; outgoing.style.opacity = '0';
      setTimeout(function () { if (outgoing.parentNode) outgoing.remove(); }, T.frameFade + 80); }
    curLayer = incoming;
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
    var trs = (triggers || []).map(function (tr) { var k = text.indexOf(tr.at); return { idx: k < 0 ? -1 : k + tr.at.length, frame: tr.frame, run: tr.run, fired: false }; });
    textEl.textContent = ''; var i = 0; clearTimeout(textEl._tw);
    function step(){
      i++; textEl.textContent = text.slice(0, i);
      for (var j = 0; j < trs.length; j++) { if (!trs[j].fired && trs[j].idx >= 0 && i >= trs[j].idx) { trs[j].fired = true; if (trs[j].frame) showFrame(trs[j].frame); if (trs[j].run) try { trs[j].run(); } catch (e) {} } }
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
    if (s.frame) showFrame(s.frame);
    if (s.onEnter) s.onEnter();
    typeText(s.text, s.triggers, function () {
      if (s.end) { setTimeout(function () { s.end.run(); }, s.end.delay); }
      else { setTimeout(function () { runScene(i + 1); }, Math.max(T.readMin, s.text.length * T.readPerChar)); }
    });
  }

  /* ---- mount + choreography ---- */
  function mount(){
    if (document.getElementById('jjst')) return;
    document.body.appendChild(wrap);
    document.getElementById('jjst-sky').src = SKY;
    var docEl = document.documentElement;                                            // lock scroll until the story ends
    docEl.style.overflow = 'hidden'; document.body.style.overflow = 'hidden';
    window.jjStory = window.jjStory || {};
    window.jjStory.unlock = function () { docEl.style.overflow = ''; document.body.style.overflow = ''; };
    bgWrap = document.getElementById('jjst-bgwrap');
    textEl = document.getElementById('jjst-cap-text'); capEl = document.getElementById('jjst-cap');
    prog = document.getElementById('jjst-progress'); fill = document.getElementById('jjst-progress-fill');

    FRAMES.forEach(function (n) { var im = new Image(); im.src = F(n); });            // warm every frame (they're tiny now)
    showFrame(SCENES[0].frame);                                                       // first frame up (hidden by the black)

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
    var urls = [F('cav-bg'), F('cav-dragon-1'), BOX], left = urls.length, fired = false;
    function finish(){ if (!fired) { fired = true; done(); } }
    urls.forEach(function (u) { var im = new Image(); im.onload = im.onerror = function () { if (--left <= 0) finish(); }; im.src = u; });
    setTimeout(finish, 9000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
