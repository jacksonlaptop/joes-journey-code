(function () {
  var ASSET_STAR   = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a0d67bb5517ed8efe956552_Star%2016.svg';
  var ASSET_MOON   = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a0d67bbb86603f359ae1311_289a8c92ed8a9b7dd3efdae788f3d0ae_Moon.svg';
  var ASSET_GALAXY = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a0d67bbf7e371947907a091_Galaxy%2010.svg';

  var SPRITE_TR = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a0d815469fc93c75834b57d_Spright%20top%20right.svg';
  var SPRITE_TL = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a0d8154cab30401d9e344dd_Sprite%20top%20left.svg';
  var SPRITE_TM = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a0d8154e295fd12e49f8f0e_Sprite%20top%20middle.svg';
  var SPRITE_BR = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a0d81545b3a4debe2e04d43_Sprite%20bottom%20right.svg';
  var SPRITE_BL = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a0d815428068a6a58035973_Sprite%20bottom%20left.svg';
  var SPRITE_BM = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a0d8154f8c9d157143146cf_Sprite%20bottom%20middle.svg';

  var SITTING_ALIEN_SAD   = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a1020606c5b65a83f63a171_sassy%20boy%201.svg';
  var SITTING_ALIEN_HAPPY = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a102060d6130fe4145e128e_happy%20boy.svg';
  /* the Seedance alien clips (keyed, repo root): the five peeking aliens play their full clip once when they peer in; the sitting alien has four states */
  var ABASE = window.JJ_SCORE_BASE || 'https://cdn.jsdelivr.net/gh/jacksonlaptop/joes-journey-code@main/';
  var PEEK = { TL: 'alien-peek-tl', TM: 'alien-peek-tm', BR: 'alien-peek-br', BL: 'alien-peek-bl', BM: 'alien-peek-bm' };   // TR has no clip yet — it keeps the SVG
  function clipVideo(name, loop) {
    var v = document.createElement('video'); v.muted = true; v.loop = !!loop; v.playsInline = true; v.preload = 'auto'; v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
    v.poster = ABASE + name + '-poster.webp';
    v.innerHTML = '<source src="' + ABASE + name + '.mov" type=\'video/mp4; codecs="hvc1"\'><source src="' + ABASE + name + '.webm" type="video/webm">';
    v.addEventListener('playing', function () { v.removeAttribute('poster'); }, { once: true });   // no poster flash when a loop wraps
    return v;
  }
  function mkPeek(cfg, loop) { if (!cfg.clip) { var im = document.createElement('img'); im.src = cfg.src; return im; } return clipVideo(cfg.clip, loop); }
  function playFrom0(v) { if (v.tagName !== 'VIDEO') return; try { v.currentTime = 0; } catch (e) {} var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  /* One gate for every peeking alien on the page (landing, the horizontal-scroll one, the Big Bang pair):
     only ONE out at a time now (Joe, 11 Sep: the companions and flying Joe fill the screen enough) — the Big Bang's
     "gazed back upon us?" trio is the one allowed exception. Never two arriving, or two leaving, at the same moment.
     `out` counts an alien from the moment it starts in until it has fully slid away. */
  var PK = { out: 0, lastIn: -1e9, lastOut: -1e9, MAX: 1, GAP: 1100 };
  function pkCanEnter() { return PK.out < PK.MAX && performance.now() - PK.lastIn >= PK.GAP; }
  function pkEnter() { PK.out++; PK.lastIn = performance.now(); }
  function pkExitWait() { return Math.max(0, PK.GAP - (performance.now() - PK.lastOut)); }   // hold a leaver until the last exit is a beat behind it
  function pkLeft() { PK.lastOut = performance.now(); }
  function pkGone() { PK.out = Math.max(0, PK.out - 1); }
  function peekHold(el, fallbackMs, cb) {                       // a clip peeks for as long as it plays; an image for the given time
    var done = false, fin = function () { if (done) return; done = true; cb(); };
    if (el.tagName === 'VIDEO') { el.addEventListener('ended', fin, { once: true }); setTimeout(fin, 6500); } else setTimeout(fin, fallbackMs);
  }
  var MATRIX_GUY = 'https://cdn.prod.website-files.com/6a19b8f4191d4fbca532591e/6a218a72b3fe2da2dabfa4e5_Matrix.png';

  var LANDING_ALIEN_AT = 3000;
  var LANDING_SPEECH_AT = 6500;
  var SPEECH_POST_TYPE_PAUSE = 1000;
  var SPEECH_POST_REVEAL_PAUSE = 4000;
  var SPEECH_BETWEEN_PARTS = 6000;
  var SPEECH_PART2_HOLD = 4000;
  var POST_CLICK_DELAY = 1000;
  var ALIEN_HIDE_AFTER_CLICK = 4300;   // the send-off clip runs 4.1s and ends on an empty frame
  var STICKY_REVEAL_AT = 25400;
  var NEXT_SCENE_AT = 28400;
  var TYPEWRITER_AT = 28900;
  var UNLOCK_SCROLL_AT = 28900;
  var SPEECH_PART_1 = "It’d be great if you kept the sound on…";
  var SPEECH_PART_2 = "We spent a lot of time on that";
  var SPEECH_PART_3 = "Whenever you’re ready";
  var SPEECH_PART_4 = "Any day now";

  var backWrap  = document.getElementById('jj-bg-back-wrap');
  var frontWrap = document.getElementById('jj-bg-front-wrap');
  var back      = document.getElementById('jj-bg-back');
  var front     = document.getElementById('jj-bg-front');
  if (!backWrap || !frontWrap || !back || !front) return;
  document.body.appendChild(backWrap);

  var BACK_SPEED  = 0.3;
  var FRONT_SPEED = 0.6;
  var ANIM_STARS_SPEED = 0.45;
  var bgEnabled = false;
  var triggered = false;
  var alienShown = false;
  var audioLineSaid = false;   // true once he's delivered the sound-on line (PART_1)
  var alienBaseExpression = 'sad';
  var speechLockedWidth = null;
  var landingTimers = [];
  var speechTypeTimers = [];
  var update = function () {};
  var animStarsWrap = null;
  var animStarsInner = null;

  var jjUserMuted = false;
  function getOfficialUserVolume() {
    return (window.jjAudio && window.jjAudio.volume != null) ? window.jjAudio.volume : 1.0;
  }
  function applyMasterMute() {
    if (typeof window.Howler === 'undefined') return;
    try {
      Howler.volume(jjUserMuted ? 0 : getOfficialUserVolume());
    } catch (e) {}
  }

  // Back/forward navigation is handled in intro.js (it has the Lenis instance to snap to the top
  // first, so the reload window shows the blue first panel instead of the black end-of-scroll).
  try { history.scrollRestoration = 'manual'; } catch (e) {}

  // Homepage nav + logo: not shown on first load, then fade + drop in after 3s (matches the contact page)
  // Entrance gate: when jj-loader.js is running (see site-footer.js), load-timed
  // sequences wait for its jj:entrance event instead of counting from page load.
  // Decision is deferred to DOMContentLoaded so script order can't race the check.
  function jjWhenEntrance(fn) {
    function decide() {
      if (!window.JJLoader || window.__jjEntranceDone) { fn(); return; }
      document.addEventListener('jj:entrance', function () { fn(); }, { once: true });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', decide);
    else decide();
  }

  /* The "Next scene" button sits invisible (Webflow's opacity 0) over the bottom-right of the landing long
     before it is needed — still hit-testable, so the cursor lit up over empty space above the sound button
     and a click there would jump a scene. It is dead until the journey actually reveals it. */
  (function () { var st = document.createElement('style');
    st.textContent = '.next-section-button:not(.jj-next-scene-revealing),.next-section-button:not(.jj-next-scene-revealing) *{pointer-events:none!important}';
    (document.head || document.documentElement).appendChild(st); })();

  /* The flyer, built locally (was the Webflow Rive blob, fly-2.riv): Joe's flying head (joe-fly-loop, keyed, loops).
     - horizontal scroll: he sits INSIDE .fly-rive, so every existing show/hide/fade of that element still applies;
       the Rive canvas is hidden and its instance released
     - landing flyover: he takes the SVG's place on #character-path before intro.js starts its motionPath tween */
  /* "Click to begin" fades the landing to black FIRST; only then do the speech, the Big Bang and everything else
     start (the real click is re-dispatched once it is black). The landing's leftovers — the red alien, the peekers,
     the landing flyover — are cleared under the black, and the black lifts as the story begins. The audio context
     is resumed inside the real click so the speech is still allowed to play after the fade. */
  (function jjBeginGate() {
    var passing = false, done = false;
    window.addEventListener('click', function (e) {
      if (passing || done) return;
      var cta = e.target && e.target.closest ? e.target.closest('.enter-link_wrapper') : null;
      if (!cta || (cta.textContent || '').trim().toLowerCase() !== 'click to begin') return;
      done = true; e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      try { if (window.Howler && Howler.ctx && Howler.ctx.state !== 'running') Howler.ctx.resume(); } catch (x) {}
      /* the pink press first — you see the button fill before anything else happens */
      cta._jjPink = true;
      if (getComputedStyle(cta).position === 'static') cta.style.setProperty('position', 'relative', 'important');
      cta.style.setProperty('overflow', 'hidden', 'important');
      var pink = document.createElement('div');
      pink.style.cssText = 'position:absolute;left:50%;top:50%;width:300%;height:300%;border-radius:50%;background:#FF00F5;z-index:1;pointer-events:none;transform:translate(-50%,-50%) scale(0);transition:transform .45s cubic-bezier(0.2,0.7,0.3,1);';
      cta.appendChild(pink);
      void pink.offsetWidth; pink.style.transform = 'translate(-50%,-50%) scale(1)';
      var black = document.createElement('div'); black.id = 'jj-begin-black';
      black.style.cssText = 'position:fixed;inset:0;background:#000;opacity:0;z-index:9989;pointer-events:none;transition:opacity .9s ease;';
      document.body.appendChild(black);
      setTimeout(function () { void black.offsetWidth; black.style.opacity = '1'; }, 380);   // the pink lands, then the world goes dark (no rAF — it can stall in a background tab)
      setTimeout(function () {
        passing = true; cta.click(); passing = false;                  // now it all begins, on black
        ['#jj-sitting-alien', '#jj-sitting-alien-lines', '#jj-sitting-alien-speech'].forEach(function (sel) { var el = document.querySelector(sel); if (el) el.style.visibility = 'hidden'; });
        document.querySelectorAll('.jj-alien-sprite, .jj-flyover, .rive').forEach(function (el) { el.style.visibility = 'hidden'; });   // the CTA and the title are gone before the black lifts
        document.querySelectorAll('.enter-link_wrapper').forEach(function (el) { el.style.setProperty('display', 'none', 'important'); });   // no pink pressed state, no fade — just gone
        /* hold the black until the landing has finished clearing itself (its fade-outs run ~1.7s), so nothing of it shows through */
        setTimeout(function () { black.style.transition = 'opacity 1.4s ease'; black.style.opacity = '0'; setTimeout(function () { if (black.parentNode) black.parentNode.removeChild(black); }, 1500); }, 2000);
      }, 1400);
    }, true);
  })();

  (function jjFlyer() {
    /* Joe's flying head replaces the Webflow Rive blob. He is his own element now (not inside .fly-rive), so he is
       NOT shown when "Click to begin" is pressed: he flies in from the left when "Hey, I'm Joe" types in and settles
       just left of that text, in front of it. Click him and he dives down, shrinks and is gone — then comes back in
       from the left like the first time. The landing flyover (the SVG on #character-path) is Joe too. Half size. */
    var st = document.createElement('style');
    st.textContent = '.fly-rive canvas{display:none!important;}' +
      '#jj-flyer{position:fixed;left:0;top:0;z-index:1000;width:clamp(45px,6.25vw,105px);opacity:0;pointer-events:none;cursor:pointer;' +
        'transition:transform 1.2s cubic-bezier(.22,1,.36,1),opacity .6s ease;}' +
      '#jj-flyer.on{opacity:1;pointer-events:auto;}' +
      '#jj-flyer.dive{pointer-events:none;}' +
      '#jj-flyer video{display:block;width:100%;height:auto;filter:drop-shadow(0 6px 12px rgba(0,0,0,.35));animation:jjFlyBob 2.4s ease-in-out infinite;}' +
      '@keyframes jjFlyBob{0%,100%{translate:0 0;rotate:-2deg}50%{translate:0 -6px;rotate:2deg}}' +
      '.jj-flyover{display:block;width:75px;height:auto;filter:drop-shadow(0 6px 12px rgba(0,0,0,.35));}';
    (document.head || document.documentElement).appendChild(st);
    function flyVid(cls) {
      var v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.preload = 'auto';
      v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); if (cls) v.className = cls; v.poster = ABASE + 'joe-fly-loop-poster.webp';
      v.innerHTML = '<source src="' + ABASE + 'joe-fly-loop.mov" type=\'video/mp4; codecs="hvc1"\'><source src="' + ABASE + 'joe-fly-loop.webm" type="video/webm">';
      var p = v.play(); if (p && p.catch) p.catch(function () {});
      return v;
    }
    var fly = null, home = null;
    function place(x, y, animate) { fly.style.transition = animate ? '' : 'none'; fly.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)'; if (!animate) void fly.offsetWidth; }
    function target(texts) {                                          // well left of the text, level with its TOP line ("Hey, I'm Joe")
      var L = 1e9, first = null;
      (texts || []).forEach(function (el) {
        var r = el.getBoundingClientRect(); if (!r.width) return;
        L = Math.min(L, r.left);
        var rg = document.createRange(); rg.selectNodeContents(el);
        var lines = Array.prototype.filter.call(rg.getClientRects(), function (q) { return q.width > 2 && q.height > 2; });
        var ln = lines.length ? lines[0] : r;                        // the first line box of this block
        if (!first || ln.top < first.top) first = { top: ln.top, bottom: lines.length ? ln.bottom : ln.top + (parseFloat(getComputedStyle(el).lineHeight) || 40) };
      });
      var w = fly.offsetWidth || 90, h = fly.offsetHeight || w;
      if (L === 1e9) return { x: innerWidth * .1, y: innerHeight * .4 - h / 2 };
      return { x: Math.max(12, Math.min(L - w - 40, innerWidth * .08)), y: (first.top + first.bottom) / 2 - h / 2 };   // 8% in, never over a panel's text
    }
    function flyIn() {
      if (!fly || !home) return;
      fly.classList.remove('dive');
      place(-(fly.offsetWidth || 90) - 40, home.y, false);             // start just off the left edge
      requestAnimationFrame(function () { fly.classList.add('on'); place(home.x, home.y, true); });
    }
    window.jjFlyerIn = function (texts) {
      if (!fly) {
        fly = document.createElement('div'); fly.id = 'jj-flyer'; fly.setAttribute('data-cursor', 'hover'); fly.appendChild(flyVid());
        document.body.appendChild(fly);
        fly.addEventListener('click', function () {                     // a wind-up, a loop over the top, then away off the right — then back in from the left
          if (fly.classList.contains('dive')) return;
          fly.classList.add('dive');
          var x = Math.round(home.x), y = Math.round(home.y), off = innerWidth + 80 - x;
          var T = function (dx, dy, sc, rot) { return 'translate(' + (x + dx) + 'px,' + (y + dy) + 'px) scale(' + sc + ') rotate(' + rot + 'deg)'; };
          fly.style.transition = 'transform .22s ease-out';                 // wind-up: leans back and dips
          fly.style.transform = T(-28, 16, 1.08, -14);
          setTimeout(function () {                                          // up and over the top
            fly.style.transition = 'transform .45s cubic-bezier(.3,0,.35,1)';
            fly.style.transform = T(90, -84, 1, 16);
          }, 230);
          setTimeout(function () {                                          // and away off the right, shrinking into the distance
            fly.style.transition = 'transform .95s cubic-bezier(.45,0,.85,.4), opacity .7s ease .3s';
            fly.style.transform = T(off, -innerHeight * .16, .28, 28);
            fly.style.opacity = '0';
          }, 690);
          setTimeout(function () {
            fly.style.transition = 'none'; fly.classList.remove('on'); fly.style.removeProperty('opacity');
            place(-(fly.offsetWidth || 90) - 40, y, false);
            setTimeout(flyIn, 700);
          }, 1700);
        });
      }
      setTimeout(function () { home = target(texts); flyIn(); }, 60);   // measure once the text has its layout
    };
    function setup() {
      var fr = document.querySelector('.fly-rive'); if (fr && !fr._jjFly) { fr._jjFly = true; releaseRive(fr, 0); }
      var fc = document.querySelector('img.flying-character');
      if (fc && !fc._jjFly) {                                      // same class, same path: intro.js now flies Joe
        fc._jjFly = true; var v = flyVid('flying-character jj-flyover');
        fc.parentNode.insertBefore(v, fc); fc.classList.remove('flying-character'); fc.style.display = 'none';
      }
    }
    function releaseRive(fr, n) {                                    // free the hidden Rive's canvas/WebGL once Webflow has built it
      var pl = window.Webflow && Webflow.require && Webflow.require('rive'), inst = pl && pl.getInstance(fr);
      if (inst && inst.rive) { try { inst.rive.stop(); inst.rive.cleanup(); } catch (e) {} return; }
      if (n < 40) setTimeout(function () { releaseRive(fr, n + 1); }, 250);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup); else setup();
  })();

  (function jjNavDropIn(){
    var SEL = '.nav-logo-link, .nav-logo, .menu-container, .menu-button, #jj-sc-hud';
    /* hard hide until the drop-in (beats Webflow's nav styles; the page head carries the same rule for the pre-script moment) */
    (function () { var st = document.createElement('style'); st.textContent = 'html:not(.jj-nav-in) .nav-logo-link,html:not(.jj-nav-in) .menu-container{opacity:0!important}'; (document.head || document.documentElement).appendChild(st); })();
    function run(){
      var els = document.querySelectorAll(SEL);
      if (!els.length) { setTimeout(run, 150); return; }
      Array.prototype.forEach.call(els, function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-20px)';
        el.style.willChange = 'opacity, transform';
      });
      jjWhenEntrance(function () {
      setTimeout(function () {
        document.documentElement.classList.add('jj-nav-in');
        Array.prototype.forEach.call(els, function (el) {
          el.style.transition = 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.34, 1.4, 0.64, 1)';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
        setTimeout(function () {                       // hand control back to Webflow once it has settled
          Array.prototype.forEach.call(els, function (el) {
            el.style.transition = ''; el.style.transform = ''; el.style.willChange = '';
          });
        }, 1100);
      }, 3000);
      });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  })();

  // Main-menu links: Contact → /contact, Credits → /contact?credits=1 (auto-plays the credits there)
  (function jjMenuLinks(){
    function run(){
      try {
        var links = document.querySelectorAll('a');
        for (var i = 0; i < links.length; i++) {
          var a = links[i]; if (a._jjMenuWired) continue;
          var t = (a.textContent || '').trim().toLowerCase();
          if (t === 'credits') { a._jjMenuWired = 1; a.setAttribute('href', '/contact?credits=1'); }
          else if (t === 'contact' && !a.getAttribute('href')) { a._jjMenuWired = 1; a.setAttribute('href', '/contact'); }
        }
      } catch (e) {}
    }
    run(); setTimeout(run, 1500); setTimeout(run, 3500);
  })();

  try {
    if (sessionStorage.getItem('jjUserMuted') === '1') jjUserMuted = true;
  } catch (e) {}

  function saveAudioState() {
    try {
      if (!window.jjAudio || !window.jjAudio.sounds) return;
      var states = [];
      window.jjAudio.sounds.forEach(function (s) {
        try {
          if (typeof s.playing === 'function' && s.playing()) {
            states.push({
              src:  s._src && s._src[0],
              seek: (typeof s.seek === 'function') ? s.seek() : 0,
              loop: !!s._loop
            });
          }
        } catch (e) {}
      });
      sessionStorage.setItem('jjAudioStates', JSON.stringify(states));
      sessionStorage.setItem('jjIntroPlayed', '1');
      sessionStorage.setItem('jjUserMuted', jjUserMuted ? '1' : '0');
    } catch (e) {}
  }
  window.addEventListener('beforeunload', saveAudioState);
  window.addEventListener('pagehide',     saveAudioState);

  function resumeAudioFromPreviousPage() {
    if (typeof window.Howl === 'undefined') { setTimeout(resumeAudioFromPreviousPage, 200); return; }
    var raw;
    try { raw = sessionStorage.getItem('jjAudioStates'); } catch (e) { return; }
    if (!raw) return;
    var states;
    try { states = JSON.parse(raw); } catch (e) { return; }
    if (!Array.isArray(states) || !states.length) return;

    window.jjAudio = window.jjAudio || { sounds: [], muted: jjUserMuted, volume: 1.0 };

    states.forEach(function (s) {
      try {
        var howl = new Howl({ src: [s.src], loop: !!s.loop, volume: 1.0 });
        howl.once('load', function () {
          try { howl.seek(s.seek || 0); } catch (e) {}
          howl.play();
        });
        window.jjAudio.sounds.push(howl);
      } catch (e) {}
    });
    applyMasterMute();
  }
  if (document.readyState === 'complete') resumeAudioFromPreviousPage();
  else window.addEventListener('load', resumeAudioFromPreviousPage);

  var isLocked = false;
  var lockedScrollY = 0;
  function preventScrollEvent(e) { e.preventDefault(); e.stopPropagation(); return false; }
  function preventScrollKey(e) {
    var blocked = ['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '];
    if (blocked.indexOf(e.key) !== -1) { e.preventDefault(); e.stopPropagation(); return false; }
  }
  function onLockedScroll() { if (isLocked) window.scrollTo(0, lockedScrollY); }
  function lockScroll() {
    if (isLocked) return;
    isLocked = true;
    lockedScrollY = window.scrollY || window.pageYOffset || 0;
    try {
      if (window.lenis) {
        if (typeof window.lenis.stop === 'function') window.lenis.stop();
        if (typeof window.lenis.destroy === 'function') window.lenis.destroy();
        window.lenis = null;
      }
    } catch (e) {}
    document.documentElement.classList.add('jj-scroll-locked');
    window.scrollTo(0, lockedScrollY);
    window.addEventListener('scroll',    onLockedScroll,     { passive: true  });
    window.addEventListener('wheel',     preventScrollEvent, { passive: false });
    window.addEventListener('touchmove', preventScrollEvent, { passive: false });
    window.addEventListener('keydown',   preventScrollKey,   { passive: false });
  }
  function unlockScroll() {
    if (!isLocked) return;
    isLocked = false;
    document.documentElement.classList.remove('jj-scroll-locked');
    window.removeEventListener('scroll',    onLockedScroll);
    window.removeEventListener('wheel',     preventScrollEvent, { passive: false });
    window.removeEventListener('touchmove', preventScrollEvent, { passive: false });
    window.removeEventListener('keydown',   preventScrollKey,   { passive: false });
    if (typeof ScrollTrigger !== 'undefined') {
      try { ScrollTrigger.refresh(); } catch (e) {}
    }
  }

  function setupSoundButton() {
    if (document.getElementById('jj-sound-btn')) return;

    var btn = document.createElement('button');
    btn.id = 'jj-sound-btn';
    btn.setAttribute('aria-label', 'Toggle sound');

    var fill = document.createElement('div');
    fill.className = 'jj-sound-fill';
    btn.appendChild(fill);

    var craters = [
      { w: 11, h: 11, l: 13, t: 15, o: 0.20 },
      { w: 7,  h: 7,  l: 41, t: 32, o: 0.14 },
      { w: 8,  h: 8,  l: 24, t: 43, o: 0.12 }
    ];
    craters.forEach(function (cr) {
      var d = document.createElement('div');
      d.className = 'jj-crater';
      d.style.cssText = 'width:' + cr.w + 'px;height:' + cr.h + 'px;left:' + cr.l + 'px;top:' + cr.t + 'px;opacity:' + cr.o + ';';
      btn.appendChild(d);
    });

    for (var i = 0; i < 5; i++) {
      var bar = document.createElement('div');
      bar.className = 'jj-bar';
      btn.appendChild(bar);
    }

    var mist = document.createElement('div');
    mist.id = 'jj-sound-mist';
    for (var k = 0; k < 5; k++) {
      var mb = document.createElement('div');
      mb.className = 'jj-mist-bar';
      mist.appendChild(mb);
    }
    document.body.appendChild(mist);
    document.body.appendChild(btn);

    btn.style.opacity = '0';
    mist.style.opacity = '0';
    setTimeout(function () {
      btn.style.transition = 'opacity 2.5s ease, background 0.25s ease';
      mist.style.transition = 'opacity 2.5s ease';
      btn.style.opacity = '1';
      mist.style.opacity = '0.55';
    }, 2000);

    if (jjUserMuted) btn.classList.add('is-muted');

    btn.addEventListener('mouseenter', function (e) {
      var rect = btn.getBoundingClientRect();
      var x = (e.clientX - rect.left), y = (e.clientY - rect.top);
      var maxDist = Math.max(
        Math.hypot(x, y),
        Math.hypot(rect.width - x, y),
        Math.hypot(x, rect.height - y),
        Math.hypot(rect.width - x, rect.height - y)
      );
      var size = maxDist * 2.4;
      fill.style.width  = size + 'px';
      fill.style.height = size + 'px';
      fill.style.left   = (x - size / 2) + 'px';
      fill.style.top    = (y - size / 2) + 'px';
      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(fill);
        gsap.fromTo(fill,
          { scale: 0, opacity: 0.9 },
          { scale: 1, opacity: 1, duration: 0.42, ease: 'power2.out' }
        );
      } else {
        fill.style.transform = 'scale(1)';
        fill.style.opacity   = '1';
        fill.style.transition = 'transform 0.42s ease, opacity 0.3s ease';
      }
    });
    btn.addEventListener('mouseleave', function () {
      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(fill);
        gsap.to(fill, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
      } else {
        fill.style.transform = 'scale(0)';
        fill.style.opacity   = '0';
      }
    });

    btn.addEventListener('click', function () {
      jjUserMuted = !jjUserMuted;
      if (window.jjAudio) window.jjAudio.muted = jjUserMuted;
      try { sessionStorage.setItem('jjUserMuted', jjUserMuted ? '1' : '0'); } catch (e) {}
      btn.classList.toggle('is-muted', jjUserMuted);
      applyMasterMute();
    });

    startAudioBarsAnimation(btn);
  }

  function startAudioBarsAnimation(btn) {
    var bars     = btn.querySelectorAll('.jj-bar');
    var mistBars = document.querySelectorAll('#jj-sound-mist .jj-mist-bar');
    var minH = 5,  maxH = 34;
    var mistMin = 10, mistMax = 70;
    var barGain = [0.45, 0.75, 1.0, 0.75, 0.45];
    var barCurrent = [0, 0, 0, 0, 0];
    var EASE = 0.28;

    function paint(driver, nowS) {
      for (var i = 0; i < bars.length; i++) {
        var target = driver * barGain[i] + 0.08 * Math.sin(nowS * 3.4 + i * 0.55);
        if (target < 0) target = 0; else if (target > 1) target = 1;
        if (jjUserMuted) target = 0;
        barCurrent[i] += (target - barCurrent[i]) * EASE;
        var v = barCurrent[i];
        bars[i].style.height = (minH + v * (maxH - minH)).toFixed(1) + 'px';
        if (mistBars[i]) mistBars[i].style.height = (mistMin + v * (mistMax - mistMin)).toFixed(1) + 'px';
      }
      var l = driver < 0 ? 0 : (driver > 1 ? 1 : driver);
      var gb = 12 + l * 44, ga = 0.32 + l * 0.5;
      btn.style.boxShadow = '0 0 ' + gb.toFixed(1) + 'px rgba(199,231,255,' + ga.toFixed(2) + '), 0 0 ' + (gb * 2).toFixed(1) + 'px rgba(160,190,255,' + (ga * 0.55).toFixed(2) + ')';
      btn.style.transform = 'scale(' + (1 + l * 0.07).toFixed(3) + ')';
    }

    function tryStart() {
      if (typeof window.Howler === 'undefined' || !Howler.ctx) {
        setTimeout(tryStart, 200);
        return;
      }
      try {
        var ctx = Howler.ctx;
        var src = Howler.masterGain;
        if (!src) { setTimeout(tryStart, 200); return; }
        var analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.65;
        src.connect(analyser);
        var data = new Uint8Array(analyser.frequencyBinCount);
        var t0 = performance.now();

        function tick() {
          analyser.getByteFrequencyData(data);
          var nowS = (performance.now() - t0) / 1000;
          var sum = 0, count = 0;
          for (var bi = 4; bi < 64; bi++) { sum += data[bi]; count++; }
          var avg = Math.min(1, (count ? (sum / count) / 255 : 0) * 2.6);
          var driver = Math.max(0.22 + 0.14 * Math.sin(nowS * 2.0), avg);
          if (jjUserMuted) driver = 0;
          paint(driver, nowS);
          requestAnimationFrame(tick);
        }
        tick();
      } catch (e) {
        var t0 = performance.now();
        function fallbackTick() {
          var nowS = (performance.now() - t0) / 1000;
          var driver = jjUserMuted ? 0 : (0.42 + 0.34 * Math.sin(nowS * 2.0));
          paint(driver, nowS);
          requestAnimationFrame(fallbackTick);
        }
        fallbackTick();
      }
    }
    tryStart();
  }

  if (document.readyState === 'complete') setupSoundButton();
  else window.addEventListener('load', setupSoundButton);

  var allPanelChars = [];
  var floatLoopStarted = false;
  function startFloatLoop() {
    if (floatLoopStarted) return;
    floatLoopStarted = true;
    function loop() {
      if (!bgEnabled) { requestAnimationFrame(loop); return; }
      var t = performance.now() / 1000;
      var vw = window.innerWidth;
      var parentAmps = new Map();
      for (var i = 0; i < allPanelChars.length; i++) {
        var c = allPanelChars[i];
        if (c._disintegrating) continue;
        var parent = c._textParent;
        if (!parent) continue;
        var amp;
        if (parentAmps.has(parent)) {
          amp = parentAmps.get(parent);
        } else {
          var rect = parent.getBoundingClientRect();
          var center = (rect.left + rect.right) / 2;
          var normPos = center / vw;
          if (normPos >= 0.5)      amp = 0.08;
          else if (normPos <= 0)   amp = 1.6;
          else                     amp = 0.08 + ((0.5 - normPos) / 0.5) * 1.52;
          parentAmps.set(parent, amp);
        }
        var seed = c._floatSeed;
        var y = (Math.sin(t * 0.7 + seed * 1.3) * 0.65 + Math.sin(t * 1.3 + seed * 2.5) * 0.35) * 24 * amp;
        var x = (Math.sin(t * 0.9 + seed * 2.1) * 0.65 + Math.sin(t * 1.5 + seed * 0.9) * 0.35) * 12 * amp;
        var r = Math.sin(t * 0.5 + seed * 0.7) * 8 * amp;
        c.style.transform = 'translate(' + x.toFixed(2) + 'px, ' + y.toFixed(2) + 'px) rotate(' + r.toFixed(2) + 'deg)';
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  function findCtaButton() {
    var els = document.querySelectorAll('a, button, [role="button"]');
    for (var i = 0; i < els.length; i++) {
      var text = (els[i].textContent || '').trim().toLowerCase();
      if (text === 'click to begin') return els[i];
    }
    return null;
  }
  function setupCta() {
    var cta = findCtaButton();
    if (!cta) { setTimeout(setupCta, 100); return; }
    cta.classList.add('jj-cta-hidden');
    var enforce = setInterval(function () {
      if (!cta.classList.contains('jj-cta-revealing')) cta.classList.add('jj-cta-hidden');
    }, 100);
    setTimeout(function () {
      clearInterval(enforce);
      cta.classList.remove('jj-cta-hidden');
      cta.classList.add('jj-cta-revealing');
    }, 7000);
  }
  jjWhenEntrance(setupCta);      // the CTA counts its 7s from the loader lifting, not from page load — otherwise it is already sitting there when the curtain opens

  function startSubtitleGrowth() {
    var subtitle = document.getElementById('jj-subtitle');
    if (!subtitle) { setTimeout(startSubtitleGrowth, 100); return; }
    if (document.getElementById('jj-sub-centre')) return;   // site-footer pins the subtitle to the centre at one size — no stepped growth, so it never shifts
    var targetPx       = Math.min(Math.max(50, window.innerWidth * 0.06), 100);
    var targetBottomPx = window.innerHeight * 0.45;
    try {
      var firstPanel = document.querySelector('.horizontal-scroll-content_wrapper');
      if (firstPanel) {
        var heading = firstPanel.querySelector('h1, h2, h3, h4, h5, h6, p, [class*="heading"]');
        if (heading) {
          var cs = getComputedStyle(heading);
          if (cs.fontSize) targetPx = parseFloat(cs.fontSize) || targetPx;
          var rect = heading.getBoundingClientRect();
          if (rect.height > 0) targetBottomPx = window.innerHeight - rect.bottom;
        }
      }
    } catch (e) {}
    // Grow in one step per subtitle line instead of a single 29s font-size transition —
    // continuously animating font-size relayouts the stroked text every frame for the
    // whole speech, which janks weaker machines.
    var startPx       = parseFloat(getComputedStyle(subtitle).fontSize) || 24;
    var startBottomPx = parseFloat(getComputedStyle(subtitle).bottom) || 110;
    var steps = [4950, 8950, 13900, 17550, 21950, 24000, 26500]; // subCues times minus POST_CLICK_DELAY
    subtitle.style.setProperty('transition', 'opacity 0.3s ease, font-size 0.8s ease, bottom 0.8s ease', 'important');
    steps.forEach(function (t, i) {
      setTimeout(function () {
        var p = (i + 1) / steps.length;
        subtitle.style.setProperty('font-size', (startPx + (targetPx - startPx) * p) + 'px', 'important');
        subtitle.style.setProperty('bottom', (startBottomPx + (targetBottomPx - startBottomPx) * p) + 'px', 'important');
      }, t);
    });
  }
  function fadeOutSubtitle() {
    var subtitle = document.getElementById('jj-subtitle');
    if (!subtitle) return;
    subtitle.style.setProperty('transition', 'opacity 0.4s ease', 'important');
    subtitle.style.setProperty('opacity', '0', 'important');
  }

  function pickStarPosition() {
    var attempts = 0;
    var leftPct, topPct;
    do {
      leftPct = 5 + Math.random() * 85;
      topPct  = 5 + Math.random() * 80;
      attempts++;
    } while (attempts < 40 && (
      (leftPct > 30 && leftPct < 70 && topPct > 35 && topPct < 60) ||
      (leftPct > 80 && topPct > 70)
    ));
    return { left: leftPct, top: topPct };
  }

  var sittingAlien = null;
  var sittingAlienLines = null;
  function setupSittingAlien() {
    if (document.getElementById('jj-sitting-alien')) return;
    sittingAlien = document.createElement('div');                 // two stacked clips: the next state fades in over the current one, so he never blinks
    sittingAlien.id = 'jj-sitting-alien';
    sittingAlien.setAttribute('role', 'button');
    sittingAlien.style.width = '216px'; sittingAlien.style.height = '233px'; sittingAlien.style.left = 'calc(12vw - 34px)';   // all four clips share one frame (ground line + left edge), so states never shift
    sittingAlien.setAttribute('data-cursor', 'hover');
    if (!document.getElementById('jj-sit-style')) { var ss = document.createElement('style'); ss.id = 'jj-sit-style';
      ss.textContent = '#jj-sitting-alien video{position:absolute;left:0;bottom:0;height:100%;width:auto;max-width:none;opacity:0;transition:opacity .2s ease,scale .3s ease;transform-origin:32% 100%;pointer-events:none;display:block;}#jj-sitting-alien video.on{opacity:1;}#jj-sitting-alien:hover video.on{scale:1.06;}' +
        /* he never cuts between clips: he shrinks, fades and drops out of frame, changes costume off-stage, then grows back */
        '#jj-sitting-alien{transform-origin:32% 100%;}' +
        '#jj-sitting-alien.jj-away{opacity:0!important;transform:translateY(56px) scale(.62)!important;transition:opacity .3s ease,transform .3s cubic-bezier(.4,0,.7,.2)!important;}' +
        '#jj-sitting-alien.jj-nudge{transform:translateY(14px)!important;transition:transform .45s cubic-bezier(.3,0,.4,1)!important;}' +
        '#jj-sitting-alien.jj-nudge2{transform:translateY(36px)!important;transition:transform .5s cubic-bezier(.3,0,.4,1)!important;}' +
        '#jj-sitting-alien.jj-drop{opacity:0!important;transform:translateY(160px) scale(.48)!important;transition:opacity .4s ease,transform .48s cubic-bezier(.5,0,.75,0)!important;}' +
        '#jj-sitting-alien.jj-back{opacity:1!important;transform:none!important;transition:opacity .42s ease,transform .5s cubic-bezier(.22,1.25,.5,1)!important;}'; document.head.appendChild(ss); }
    sittingAlien._v = {}; ['idle', 'poke', 'wait', 'bye'].forEach(function (n) { var v = clipVideo('alien-sit-' + n, n === 'idle'); v._name = n; sittingAlien._v[n] = v; sittingAlien.appendChild(v); });   // all four preloaded, ready the instant they are needed
    document.body.appendChild(sittingAlien);
    mood('idle', true);
    sittingAlien.addEventListener('click', function () {
      if (!sittingAlien || sittingAlien._sulking) return;
      sittingAlien._sulking = true;
      landingTimers.forEach(clearTimeout); landingTimers = [];
      hideAlienSpeech(); alienBaseExpression = 'sad';
      pokeSequence();
      typewriterChars('Do you mind…', alienFontRevealToCaptions);
      setTimeout(function () {
        if (!sittingAlien) return;
        hideAlienSpeech();
        sittingAlien._sulking = false;
        // "Do you mind" only paused things — if he never got to the sound-on line, pick the flow back up.
        if (!triggered && !audioLineSaid) {
          var rt = setTimeout(function () {
            if (!triggered && !audioLineSaid && sittingAlien && !sittingAlien._sulking) runLandingSpeechSequence();
          }, 700);
          landingTimers.push(rt);
        }
      }, 6800);   // the poke sequence now runs ~6.3s (clip + drop + the two-second pause), so the sulk must outlast it
    });

    sittingAlienLines = document.createElement('div');
    sittingAlienLines.id = 'jj-sitting-alien-lines';
    for (var i = 0; i < 3; i++) {
      var l = document.createElement('span');
      l.className = 'jj-emote-line';
      sittingAlienLines.appendChild(l);
    }
    document.body.appendChild(sittingAlienLines);
  }
  /* One of the four Seedance states: idle (loop), poke, wait, bye.

     Every clip is a Seedance render that fades up from a washed-out grade over its first half second
     (measured: the average body colour starts at rgb(232,84,80) and settles by ~0.4s, rgb(203,84,83)).
     So NOTHING ever plays from 0 — every clip starts at CLIP_IN, and the idle loop wraps back to CLIP_IN
     rather than to 0. That also means all four clips share the same first frame at CLIP_IN, which is why
     a swap can be an instant cut with nothing visible.

     Two behaviours:
       1. a one-shot always plays to its natural end — a request arriving mid-clip is QUEUED, never cut in;
       2. a `cut` swap is instant (used when poked: the angry clip just plays); any other change has him
          shrink, fade and drop out of frame, swap off-stage, then grow back to exactly where he was. */
  var CLIP_IN = 0.40, LOOP_HOLD = 2600, POKE_PLAY = 2000;
  var AWAY_OUT = 300, AWAY_HOLD = 420, AWAY_IN = 460;
  function startClip(v, loop) {
    v.loop = false;                                                // never the native loop — that would wrap to 0 and flash the ungraded frames
    v.onended = null;
    try { v.currentTime = CLIP_IN; } catch (e) {}
    if (loop) v.onended = function () {
      if (!sittingAlien || sittingAlien._cur !== v) return;
      try { v.pause(); } catch (e) {}                              // he holds the last pose he lands on...
      landingTimers.push(setTimeout(function () {                  // ...and a few seconds later starts again from the top
        if (!sittingAlien || sittingAlien._cur !== v) return;
        try { v.currentTime = CLIP_IN; } catch (e) {}
        var q = v.play(); if (q && q.catch) q.catch(function () {});
      }, LOOP_HOLD));
    };
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  }
  function mood(name, loop, then, cut) {
    if (!sittingAlien || !sittingAlien._v) return;
    if (!sittingAlien._v[name]) return;
    if (sittingAlien._busy || sittingAlien._moving) { sittingAlien._queue = [name, loop, then, cut]; return; }   // let the clip on screen finish
    play(name, loop, then, cut);
  }
  function watchEnd(nxt, loop, then) {
    sittingAlien._busy = !loop;
    if (loop) return drain();
    var fin = function () {
      if (!sittingAlien || sittingAlien._cur !== nxt) return;
      nxt.onended = null; sittingAlien._busy = false;
      if (then) then();
      drain();
    };
    nxt.onended = fin;
    var dur = (nxt.duration && isFinite(nxt.duration)) ? (nxt.duration - CLIP_IN) * 1000 + 400 : 5200;   // safety only — onended is what normally ends it
    setTimeout(fin, dur);
  }
  function show(nxt, cur) {
    nxt.classList.add('on');
    if (cur && cur !== nxt) { cur.classList.remove('on'); try { cur.pause(); } catch (e) {} }
    sittingAlien._cur = nxt;
  }
  function play(name, loop, then, cut) {
    var cur = sittingAlien._cur, nxt = sittingAlien._v[name];
    if (nxt === cur && loop) { drain(); return; }
    if (!cur || cut) {                                             // same first frame in every clip, so this is invisible
      show(nxt, cur); startClip(nxt, loop);
      sittingAlien._moving = false;
      watchEnd(nxt, loop, then);
      return;
    }
    sittingAlien._moving = true;
    sittingAlien.classList.remove('jj-back');
    sittingAlien.classList.add('jj-away');                        // shrink + fade + drop away
    setTimeout(function () {
      if (!sittingAlien) return;
      nxt.onended = null;
      try { nxt.currentTime = CLIP_IN; } catch (e) {}
      show(nxt, cur);
      setTimeout(function () {                                     // held off-stage, then he grows back in
        if (!sittingAlien) return;
        sittingAlien.classList.add('jj-back');
        sittingAlien.classList.remove('jj-away');
        startClip(nxt, loop);                                      // the clip starts as he reappears, so none of it is spent off-stage
        setTimeout(function () {
          if (!sittingAlien) return;
          sittingAlien._moving = false;
          watchEnd(nxt, loop, then);
        }, AWAY_IN);
      }, AWAY_HOLD);
    }, AWAY_OUT);
  }
  /* Poked. He flinches down, gets angrier and drops further a beat later, plays the clip right
     through, then shrinks away out of the bottom of the screen — and reappears two seconds later
     as if nothing had happened. */
  function pokeSequence() {
    var a = sittingAlien; if (!a || !a._v.poke) return;
    a._queue = null; a._moving = false; a._busy = true;
    a.classList.remove('jj-away', 'jj-back', 'jj-drop', 'jj-nudge2');
    a.classList.add('jj-nudge');
    landingTimers.push(setTimeout(function () { if (sittingAlien) sittingAlien.classList.add('jj-nudge2'); }, 1000));   // the really angry beat
    var nxt = a._v.poke;
    show(nxt, a._cur);
    startClip(nxt, false);
    var done = false;
    var end = function () {
      if (done || !sittingAlien || sittingAlien._cur !== nxt) return;
      done = true; nxt.onended = null;
      sittingAlien.classList.remove('jj-nudge', 'jj-nudge2');
      sittingAlien.classList.add('jj-drop');                       // shrink and go, out of the bottom
      landingTimers.push(setTimeout(function () {
        if (!sittingAlien) return;
        var v = sittingAlien._v.idle;
        show(v, sittingAlien._cur); startClip(v, true);
        sittingAlien.classList.add('jj-back');                     // grows back up from where he left
        sittingAlien.classList.remove('jj-drop');
        sittingAlien._busy = false; drain();
      }, 2000));
    };
    nxt.onended = end;
    landingTimers.push(setTimeout(end, POKE_PLAY));                // cut short on purpose — long enough to read as furious, short enough not to outstay it
  }
  function drain() {
    if (!sittingAlien) return;
    var q = sittingAlien._queue; if (!q) return;
    sittingAlien._queue = null;
    play(q[0], q[1], q[2], q[3]);
  }
  var waitTimer = null;
  function startAlienWaiting() {
    /* He used to break into the 'wait' clip — the impatient one where he kicks a leg out — every 14s.
       That one is off the rotation: the idle loop plays throughout, holding its last pose between rounds. */
    clearInterval(waitTimer); waitTimer = null;
  }
  function positionEmoteLines() {
    if (!sittingAlien || !sittingAlienLines) return;
    var rect = sittingAlien.getBoundingClientRect();
    var top  = rect.top - 18;
    var midX = rect.left + rect.width / 2;
    sittingAlienLines.style.left = (midX - 30) + 'px';
    sittingAlienLines.style.top  = top + 'px';
    var lines = sittingAlienLines.querySelectorAll('.jj-emote-line');
    [-18, 0, 18].forEach(function (dx, idx) {
      if (lines[idx]) {
        lines[idx].style.left = (30 + dx) + 'px';
        lines[idx].style.top  = '0';
        lines[idx].style.transform = 'rotate(' + (idx === 0 ? -18 : idx === 2 ? 18 : 0) + 'deg)';
      }
    });
  }
  function revealSittingAlien() {
    if (!sittingAlien) setupSittingAlien();
    var rect = prepareAlienSpeech(SPEECH_PART_1);
    if (rect && rect.width > 0) {
      var alienW = sittingAlien.offsetWidth || 140;
      sittingAlien.style.left = Math.round(rect.left - alienW - 24) + 'px';
    }
    requestAnimationFrame(function () {
      sittingAlien.classList.add('is-visible');
    });
  }
  function makeAlienHappy() {
    if (!sittingAlien) return;
    alienBaseExpression = 'happy';
    positionEmoteLines();
    if (sittingAlienLines) sittingAlienLines.classList.add('is-visible');
    setTimeout(function () {
      if (sittingAlienLines) sittingAlienLines.classList.remove('is-visible');
    }, 1800);
  }
  function makeAlienSad() {
    if (!sittingAlien) return;
    alienBaseExpression = 'sad';
    if (sittingAlienLines) sittingAlienLines.classList.remove('is-visible');
  }

  function setupAlienSpeechBubble() {
    var existing = document.getElementById('jj-sitting-alien-speech');
    if (existing) return existing;
    var b = document.createElement('div');
    b.id = 'jj-sitting-alien-speech';
    document.body.appendChild(b);
    return b;
  }
  function applyCaptionsFontTo(el) {
    var subtitle = document.getElementById('jj-subtitle');
    if (!subtitle) return;
    var cs = getComputedStyle(subtitle);
    var props = ['fontFamily','fontWeight','letterSpacing','color','textShadow','webkitTextStroke','paintOrder'];   // NOT fontSize/lineHeight — the narration caption is big and centred now; the alien keeps his own bubble size
    props.forEach(function (p) { if (cs[p]) el.style[p] = cs[p]; });
  }
  function prepareAlienSpeech(text) {
    var b = setupAlienSpeechBubble();
    b.innerHTML = '';
    for (var i = 0; i < text.length; i++) {
      var span = document.createElement('span');
      span.className = 'jj-speech-char';
      span.textContent = text.charAt(i);
      b.appendChild(span);
    }
    applyCaptionsFontTo(b);
    b.style.left   = '50%';
    b.style.bottom = '110px';
    b.style.top    = 'auto';
    b.style.width  = 'auto';
    var chars = b.querySelectorAll('.jj-speech-char');
    for (var j = 0; j < chars.length; j++) {
      chars[j].style.fontFamily = 'var(--jj-alien-font, monospace)';
    }
    if (speechLockedWidth === null) {
      speechLockedWidth = b.getBoundingClientRect().width;
    }
    b.style.width = speechLockedWidth + 'px';
    for (var k = 0; k < chars.length; k++) {
      chars[k].style.opacity = '0';
    }
    return b.getBoundingClientRect();
  }

  function typewriterChars(text, onComplete) {
    if (triggered) return;
    prepareAlienSpeech(text);
    var b = document.getElementById('jj-sitting-alien-speech');
    if (!b) return;
    b.classList.add('is-visible');
    var chars = b.querySelectorAll('.jj-speech-char');
    var n = chars.length;
    for (var i = 0; i < n; i++) {
      (function (ch, idx) {
        var t = setTimeout(function () {
          if (triggered) return;
          ch.style.opacity = '1';
        }, 50 + idx * 55);
        speechTypeTimers.push(t);
        landingTimers.push(t);
      })(chars[i], i);
    }
    var totalTypeMs = 50 + (n - 1) * 55;
    var doneT = setTimeout(function () {
      if (triggered) return;
      if (onComplete) onComplete();
    }, totalTypeMs + 80);
    speechTypeTimers.push(doneT);
    landingTimers.push(doneT);
  }

  function alienFontRevealToCaptions() {
    var b = document.getElementById('jj-sitting-alien-speech');
    if (!b) return;
    var subtitle = document.getElementById('jj-subtitle');
    var captionFont = subtitle ? getComputedStyle(subtitle).fontFamily : '';
    var chars = b.querySelectorAll('.jj-speech-char');
    var arr = Array.prototype.slice.call(chars);
    arr.forEach(function (c) {
      c.style.transition = 'color 0.18s ease';
      c.style.color = '#FF00F5';
    });
    var t1 = setTimeout(function () {
      arr.forEach(function (c) {
        c.style.transition = 'color 0.22s ease';
        if (captionFont) c.style.fontFamily = captionFont;
        else c.style.removeProperty('font-family');
        c.style.color = '#ffffff';
      });
    }, 220);
    var t2 = setTimeout(function () {
      arr.forEach(function (c) {
        c.style.color = '';
        c.style.transition = '';
      });
    }, 560);
    landingTimers.push(t1, t2);
  }

  function disintegrateSpeechChars() {
    var b = document.getElementById('jj-sitting-alien-speech');
    if (!b || typeof gsap === 'undefined') return;
    var chars = b.querySelectorAll('.jj-speech-char');
    if (!chars.length) return;
    var arr = Array.prototype.slice.call(chars);
    arr.forEach(function (c) { gsap.killTweensOf(c); });
    gsap.to(arr, {
      color: '#FF00F5',
      y: function () { return gsap.utils.random(60, 180); },
      x: function () { return gsap.utils.random(-25, 25); },
      rotation: function () { return gsap.utils.random(-60, 60); },
      opacity: 0,
      duration: function () { return gsap.utils.random(0.9, 1.4); },
      ease: 'power2.in',
      stagger: { each: 0.04, from: 'random' }
    });
  }

  function speakLine(text, mood, onDone, isAudio) {
    if (triggered) return;
    if (mood === 'happy') makeAlienHappy(); else makeAlienSad();
    typewriterChars(text, function () {
      if (isAudio) audioLineSaid = true;   // sound-on line is now on screen
      var a = setTimeout(function () {
        if (triggered) return;
        alienFontRevealToCaptions();
        var b = setTimeout(function () {
          if (triggered) return;
          disintegrateSpeechChars();
          if (onDone) {
            var c = setTimeout(function () { if (!triggered) onDone(); }, SPEECH_BETWEEN_PARTS);
            landingTimers.push(c);
          }
        }, SPEECH_POST_REVEAL_PAUSE);
        landingTimers.push(b);
      }, SPEECH_POST_TYPE_PAUSE);
      landingTimers.push(a);
    });
  }

  function runLandingSpeechSequence() {
    if (triggered) return;
    var lines = [
      { t: SPEECH_PART_1, m: 'happy', audio: true },   // the sound request (new expression)
      { t: SPEECH_PART_2, m: 'happy' },
      { t: SPEECH_PART_3, m: 'sad' },     // ...then the original nudges, a bit later
      { t: SPEECH_PART_4, m: 'sad' }
    ];
    (function next(i) {
      if (triggered) return;
      if (i >= lines.length) { startAlienWaiting(); return; }
      speakLine(lines[i].t, lines[i].m, function () { next(i + 1); }, lines[i].audio);
    })(0);
  }

  function hideAlienSpeech() {
    speechTypeTimers.forEach(clearTimeout);
    speechTypeTimers = [];
    var b = document.getElementById('jj-sitting-alien-speech');
    if (b) b.classList.remove('is-visible');
  }

  function popUpAlienSmileFallback() {
    if (!sittingAlien) setupSittingAlien();
    mood('bye', false, null, true);
    requestAnimationFrame(function () {
      sittingAlien.classList.add('is-visible');
    });
    positionEmoteLines();
    if (sittingAlienLines) sittingAlienLines.classList.add('is-visible');
    setTimeout(function () {
      if (sittingAlienLines) sittingAlienLines.classList.remove('is-visible');
    }, 1600);
  }

  function hideSittingAlienForever() {
    hideAlienSpeech();
    var alienRef = sittingAlien;
    var linesRef = sittingAlienLines;
    var bubbleRef = document.getElementById('jj-sitting-alien-speech');
    if (alienRef) alienRef.classList.add('is-flying-out');
    if (linesRef) linesRef.classList.remove('is-visible');
    sittingAlien = null;
    sittingAlienLines = null;
    setTimeout(function () {
      if (alienRef  && alienRef.parentNode)  alienRef.parentNode.removeChild(alienRef);
      if (linesRef  && linesRef.parentNode)  linesRef.parentNode.removeChild(linesRef);
      if (bubbleRef && bubbleRef.parentNode) bubbleRef.parentNode.removeChild(bubbleRef);
    }, 1400);
  }

  function initLandingAlien() {
    var t1 = setTimeout(function () {
      if (triggered) return;
      alienShown = true;
      revealSittingAlien();
    }, LANDING_ALIEN_AT);
    landingTimers.push(t1);
    var t2 = setTimeout(function () {
      if (triggered) return;
      runLandingSpeechSequence();
    }, LANDING_SPEECH_AT);
    landingTimers.push(t2);
  }

  function initSittingAlienFlow() {
    setupSittingAlien();
    initLandingAlien();
  }
  function startAlienFlowGated() { jjWhenEntrance(initSittingAlienFlow); }
  if (document.readyState === 'complete') startAlienFlowGated();
  else window.addEventListener('load', startAlienFlowGated);

  function enablePoke(sprite, hiddenT) {
    sprite.classList.add('jj-poke-sprite');
    sprite.addEventListener('click', function (e) {
      if (sprite._poked) return;
      sprite._poked = true;
      if (window.jjScore) window.jjScore.award('alien-catch', { x: e.clientX, y: e.clientY });   // Close Encounter
      var prev = sprite.style.transition;
      sprite.style.transition = 'opacity 0.25s ease, transform 0.45s cubic-bezier(0.5, 0, 0.75, 0)';
      sprite.style.transform = hiddenT;
      sprite.style.opacity = '0';
      setTimeout(function () { sprite.style.transition = prev; sprite._poked = false; }, 500);
    });
  }

  function setupIntroDecorations() {
    for (var i = 0; i < 8; i++) {
      var star = document.createElement('img');
      star.src = ASSET_STAR; star.className = 'jj-intro-deco';
      var size = 14 + Math.random() * 22;
      star.style.width = size + 'px'; star.style.height = 'auto';
      var pos = pickStarPosition();
      star.style.left = pos.left + 'vw';
      star.style.top  = pos.top  + 'vh';
      star.style.opacity = '0';
      star.style.transformOrigin = 'center center';
      star.style.animation = 'jj-flash ' + (1.8 + Math.random() * 2.5) + 's ease-in-out ' + (Math.random() * 2.5) + 's infinite';
      document.body.appendChild(star);
      (function (s) { setTimeout(function () { s.style.transition = 'opacity 2s ease'; s.style.opacity = '1'; }, 500 + Math.random() * 2000); })(star);
    }
    var moonsConfig = [
      { right: '8vw',  top: '12vh',                  size: '95px' },
      { left:  '20vw', top: '14vh',                  size: '70px' },
      { left:  '38vw', bottom: '15vh',               size: '80px' }
    ];
    moonsConfig.forEach(function (cfg, idx) {
      var moon = document.createElement('img');
      moon.src = ASSET_MOON; moon.className = 'jj-intro-deco';
      moon.style.width = cfg.size; moon.style.height = 'auto';
      ['left','right','top','bottom'].forEach(function(k){ if(cfg[k]!==undefined) moon.style[k]=cfg[k]; });
      moon.style.opacity = '0';
      moon.style.animation = 'jj-glow ' + (3.5 + Math.random() * 1.5) + 's ease-in-out ' + (idx * 0.6) + 's infinite';
      document.body.appendChild(moon);
      (function (m) { setTimeout(function () { m.style.transition = 'opacity 2s ease'; m.style.opacity = '1'; }, 1500 + Math.random() * 1500); })(moon);
    });
    var galaxyConfig = [
      { left: '8vw',  bottom: '12vh', size: '55px' },
      { left: '46vw', top: '8vh',     size: '48px' }
    ];
    galaxyConfig.forEach(function (cfg, idx) {
      var g = document.createElement('img');
      g.src = ASSET_GALAXY; g.className = 'jj-intro-deco';
      g.style.width = cfg.size; g.style.height = 'auto';
      ['left','right','top','bottom'].forEach(function(k){ if(cfg[k]!==undefined) g.style[k]=cfg[k]; });
      g.style.opacity = '0';
      g.style.transformOrigin = 'center center';
      g.style.animation = (idx % 2 ? 'jj-spin-reverse ' : 'jj-spin ') + (50 + Math.random() * 20) + 's linear infinite';
      document.body.appendChild(g);
      (function (gx) { setTimeout(function () { gx.style.transition = 'opacity 3s ease'; gx.style.opacity = '0.85'; }, 2200 + Math.random() * 1500); })(g);
    });
    var spritesConfig = [
      { src: SPRITE_TR, anchor: { top: '124px', right: '90px' }, hiddenT: 'translate(0, -160%)',    peekT: 'translate(0, -22%)',     firstMin: 1500,  firstSpread: 2500 },   // clear of the nav, so he can be clicked
      { src: SPRITE_TL, clip: PEEK.TL, anchor: { top: '80px',  left:  '0' },    hiddenT: 'translate(-100%, -100%)', peekT: 'translate(-22%, -22%)',  firstMin: 2600,  firstSpread: 2500 },
      { src: SPRITE_TM, clip: PEEK.TM, anchor: { top: '0',     left:  '30%' },  hiddenT: 'translate(-50%, -100%)',  peekT: 'translate(-50%, -32%)',  firstMin: 3700,  firstSpread: 2500 },
      { src: SPRITE_BR, clip: PEEK.BR, anchor: { bottom: '15vh', right: '0' },  hiddenT: 'translate(100%, 100%)',   peekT: 'translate(20%, 20%)',    firstMin: 4800, firstSpread: 2500 },   // lifted 15% so he never sits on the sound button
      { src: SPRITE_BL, clip: PEEK.BL, anchor: { bottom: '0',  left:  '0' },    hiddenT: 'translate(-100%, 100%)',  peekT: 'translate(-20%, 20%)',   firstMin: 5900, firstSpread: 2500 }
    ];
    var pool = [];
    spritesConfig.forEach(function (cfg) {
      var sprite = mkPeek(cfg);
      sprite.className = 'jj-intro-deco jj-alien-sprite';
      sprite.style.width = '150px'; sprite.style.height = 'auto';
      Object.keys(cfg.anchor).forEach(function (k) { sprite.style[k] = cfg.anchor[k]; });
      sprite.style.transition = 'opacity 0.6s ease, transform 1.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      sprite.style.willChange = 'transform, opacity';
      sprite.style.transform = cfg.hiddenT; sprite.style.opacity = '0';
      document.body.appendChild(sprite);
      enablePoke(sprite, cfg.hiddenT);
      pool.push({ sprite: sprite, cfg: cfg, busy: false, readyAt: 0 });
    });
    function launch(p) {
      p.busy = true; pkEnter();
      p.sprite.style.opacity = '1';
      p.sprite.style.transform = p.cfg.peekT; playFrom0(p.sprite);
      peekHold(p.sprite, 2800 + Math.random() * 2500, function () {
        setTimeout(function () {                                   // never leave in step with another alien
          pkLeft();
          p.sprite.style.transform = p.cfg.hiddenT;
          p.sprite.style.opacity = '0';
          setTimeout(function () { pkGone(); p.busy = false; p.readyAt = performance.now() + 9000 + Math.random() * 9000; }, 1800);
        }, pkExitWait());
      });
    }
    function tick() {
      if (triggered) return;
      if (pkCanEnter()) {
        var now = performance.now(), free = pool.filter(function (p) { return !p.busy && now >= p.readyAt; });
        if (free.length) launch(free[(Math.random() * free.length) | 0]);
      }
      setTimeout(tick, 500 + Math.random() * 1400);
    }
    setTimeout(tick, 1500);
  }
  // Decorations wait for the loader's reveal — otherwise their fade-ins run behind the
  // curtain and the stars are already lit when it lifts.
  function startDecorationsGated() { jjWhenEntrance(setupIntroDecorations); }
  if (document.readyState === 'complete') startDecorationsGated();
  else window.addEventListener('load', startDecorationsGated);

  function alienReveal(chars) {
    if (!chars || !chars.length) return;
    var arr = Array.prototype.slice.call(chars);
    arr.forEach(function (c) {
      c.style.fontFamily = 'var(--jj-alien-font, monospace)'; c._jjAlienAt = Date.now();
      c.style.transition = 'color 0.15s ease';
      c.style.color = '#ffffff';
    });
    setTimeout(function () { arr.forEach(function (c) { c.style.color = '#FF00F5'; }); }, 180);
    setTimeout(function () {
      arr.forEach(function (c) {
        c.style.transition = 'color 0.2s ease';
        c.style.color = '#ffffff';
        c.style.fontFamily = '';
      });
    }, 340);
    setTimeout(function () {
      arr.forEach(function (c) {
        c.style.color = '';
        c.style.transition = '';
        c.style.removeProperty('font-family');                   // belt and braces: never leave a letter in the alien font
      });
    }, 620);
  }

  /* Safety net: any panel character still wearing the alien font a second later is put back. One stranded letter in
     the middle of a sentence (the "=" in "I did it my way!") is the tell that a tween was killed mid-reveal. */
  setInterval(function () {
    try {
      document.querySelectorAll('.jj-panel-char').forEach(function (c) {
        if (c.style.fontFamily && c.style.fontFamily.indexOf('jj-alien-font') !== -1 && !c._jjAlienAt) c.style.removeProperty('font-family');
        if (c._jjAlienAt && Date.now() - c._jjAlienAt > 1000) { c.style.removeProperty('font-family'); c._jjAlienAt = 0; }
      });
    } catch (e) {}
  }, 1500);

  function customDisintegrate(chars) {
    if (!chars || !chars.length || typeof gsap === 'undefined') return;
    var arr = Array.prototype.slice.call(chars);
    arr.forEach(function (c) {
      c._disintegrating = true;
      gsap.killTweensOf(c);
      c.style.removeProperty('font-family');
      c.style.removeProperty('letter-spacing');
    });
    gsap.to(arr, {
      color: '#FF00F5',
      y: function () { return gsap.utils.random(180, 380); },
      x: function () { return gsap.utils.random(-40, 40); },
      rotation: function () { return gsap.utils.random(-90, 90); },
      opacity: 0,
      duration: function () { return gsap.utils.random(1.0, 1.8); },
      ease: 'power2.in',
      stagger: { each: 0.025, from: 'random' }
    });
  }

  function reintegrate(chars, el) {
    if (!chars || !chars.length || typeof gsap === 'undefined') return;
    var arr = Array.prototype.slice.call(chars);
    arr.forEach(function (c) {
      c._disintegrating = true;
      gsap.killTweensOf(c);
      c.style.removeProperty('visibility');
    });
    if (el) el._jjDisintegrated = false;
    gsap.to(arr, {
      x: 0, y: 0, rotation: 0, opacity: 1, color: '#ffffff',
      duration: function () { return gsap.utils.random(0.5, 1.0); },
      ease: 'power2.out',
      stagger: { each: 0.02, from: 'random' },
      onComplete: function () {
        arr.forEach(function (c) {
          c.style.color = '';
          c._disintegrating = false;
        });
      }
    });
  }

  function splitPanelText(el, hideChars) {
    if (el._jjSplit) return el._jjChars;
    if (typeof SplitType === 'undefined') return [];
    el._jjSplit = true;
    el._dusted = true;
    var split = new SplitType(el, { types: 'words, chars' });
    var chars = split.chars;
    chars.forEach(function (c) {
      c.classList.add('jj-panel-char');
      if (hideChars) c.style.opacity = '0';
      c._floatSeed = Math.random() * 1000;
      c._textParent = el;
      allPanelChars.push(c);
    });
    el._jjChars = chars;
    return chars;
  }

  // ===== Matrix scene for the "pixels and code" panel =====
  function setupMatrixScene(horizTween) {
    if (typeof ScrollTrigger === 'undefined') return;
    var panels = document.querySelectorAll('.horizontal-scroll-content_wrapper');
    var panel = null;
    for (var i = 0; i < panels.length; i++) {
      if ((panels[i].textContent || '').toLowerCase().indexOf('pixels and code') !== -1) { panel = panels[i]; break; }
    }
    if (!panel || panel._jjMatrix) return;
    panel._jjMatrix = true;

    if (!document.getElementById('jj-matrix-style')) {
      var st = document.createElement('style');
      st.id = 'jj-matrix-style';
      st.textContent =
        '.jj-matrix-on .horizontal-content_wrapper, .jj-matrix-on .horizontal-content_wrapper * {' +
        ' color:#00ff41 !important; text-shadow:0 0 8px rgba(0,255,70,0.6), 0 0 20px rgba(0,255,70,0.3); }' +
        'body.jj-matrix-mode .fly-rive, body.jj-matrix-mode .jj-poke-sprite, body.jj-matrix-mode .jj-alien-sprite { z-index:6 !important; }' +
        '@keyframes jj-matrix-glitch { 0%,100%{transform:translate(0,0) skewX(0);filter:none;} 10%{transform:translate(-12px,0) skewX(-9deg);filter:hue-rotate(45deg) contrast(1.5);} 26%{transform:translate(11px,0) skewX(6deg);filter:none;} 42%{transform:translate(-7px,0) skewX(-3deg);filter:hue-rotate(-30deg);} 60%{transform:translate(8px,0);filter:contrast(1.3);} 78%{transform:translate(-4px,0);filter:none;} }';
      document.head.appendChild(st);
    }

    // Full-viewport layer sitting JUST above the blue bg but below the stars / code / sprites / text,
    // so all of those read on top of the green. Inserted before the star field to stay under it.
    var layer = document.createElement('div');
    layer.style.cssText = 'position:fixed;inset:0;z-index:2;pointer-events:none;opacity:0;transition:opacity 0.35s ease;will-change:opacity,transform;';
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:absolute;inset:0;background:radial-gradient(ellipse at center, rgba(0,45,10,0.24) 0%, rgba(0,16,4,0.52) 100%);';
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    layer.appendChild(overlay); layer.appendChild(canvas);
    if (animStarsWrap && animStarsWrap.parentNode) animStarsWrap.parentNode.insertBefore(layer, animStarsWrap);
    else document.body.appendChild(layer);

    var guy = document.createElement('img');
    guy.src = MATRIX_GUY;
    guy.style.cssText = 'position:fixed;left:50%;bottom:0;width:150px;height:auto;z-index:9990;pointer-events:none;opacity:0;transform:translate(-50%,115%);transition:transform 0.6s cubic-bezier(0.34,1.5,0.64,1), opacity 0.5s ease;';
    document.body.appendChild(guy);

    var ctx = canvas.getContext('2d');
    var GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789'.split('');
    var fontSize = 16, cols = 0, drops = [], W = 0, H = 0, running = false, rafId = null, frame = 0;
    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
      cols = Math.ceil(W / fontSize);
      drops = [];
      for (var c = 0; c < cols; c++) drops[c] = Math.random() * (H / fontSize);
    }
    resize();
    window.addEventListener('resize', resize);
    function loop() {
      if (!running) return;
      rafId = requestAnimationFrame(loop);
      frame++;
      if (frame % 2) return; // ~30fps is plenty for rain
      ctx.clearRect(0, 0, W, H);
      ctx.font = 'bold ' + fontSize + 'px monospace';
      for (var c = 0; c < cols; c++) {
        var x = c * fontSize, head = drops[c];
        for (var t = 0; t < 12; t++) {
          var row = head - t;
          if (row < 0) break;
          var y = row * fontSize;
          if (y > H + fontSize) continue;
          ctx.fillStyle = (t === 0) ? 'rgba(215,255,215,0.95)' : 'rgba(0,255,70,' + Math.max(0, 0.85 - t * 0.09) + ')';
          ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], x, y);
        }
        drops[c] += 0.5 + Math.random() * 0.5;
        if (head * fontSize > H && Math.random() > 0.97) drops[c] = 0;
      }
    }
    function glitch() {
      layer.style.animation = 'none';
      void layer.offsetWidth;
      layer.style.animation = 'jj-matrix-glitch 0.5s steps(3) 1';
    }
    function show() {
      if (running) return; running = true;
      layer.style.opacity = '1';
      panel.classList.add('jj-matrix-on');
      document.body.classList.add('jj-matrix-mode'); // lifts flying sprite + aliens above the green
      glitch();
      loop();
      clearTimeout(guy._t);
      guy.style.opacity = '1';
      guy.style.transform = 'translate(-50%, 0%)';
      guy._t = setTimeout(function () { guy.style.opacity = '0'; guy.style.transform = 'translate(-50%, 115%)'; }, 4000);
    }
    function hide() {
      if (!running) return; running = false;
      glitch();
      layer.style.opacity = '0';
      panel.classList.remove('jj-matrix-on');
      document.body.classList.remove('jj-matrix-mode');
      clearTimeout(guy._t);
      guy.style.opacity = '0';
      guy.style.transform = 'translate(-50%, 115%)';
      setTimeout(function () { if (!running && rafId) { cancelAnimationFrame(rafId); rafId = null; } }, 450);
    }
    // Full-viewport while you're on the panel; glitches IN as it takes over (~25%) and glitches
    // OUT only near the next panel (~75%) — no hard vertical cut. Scrolling back re-arms it.
    ScrollTrigger.create({
      trigger: panel,
      containerAnimation: horizTween,
      start: 'left right',
      end: 'right left',
      onUpdate: function (self) {
        var p = self.progress;
        if (!running && p >= 0.25 && p <= 0.58) show();
        else if (running && (p < 0.22 || p > 0.60)) hide();
      }
    });
  }

  function setupAllTextEffects(firstTexts) {
    function tryRun() {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof SplitType === 'undefined') return setTimeout(tryRun, 200);
      var stickyEl = document.querySelector('.sticky-scroll-wrapper');
      var horizWrap = document.querySelector('.horizontal-scroll-wrapper');
      if (!stickyEl || !horizWrap) return setTimeout(tryRun, 200);
      var horizTrigger = ScrollTrigger.getById('jj-horiz');
      if (!horizTrigger) {
        ScrollTrigger.getAll().forEach(function (t) {
          if (horizTrigger) return;
          if (t.trigger === stickyEl && t.animation && t.animation.targets && t.animation.targets().indexOf(horizWrap) !== -1) {
            horizTrigger = t;
          }
        });
      }
      if (!horizTrigger) return setTimeout(tryRun, 200);
      var horizTween = horizTrigger.animation;
      ScrollTrigger.getAll().forEach(function (t) {
        if (t === horizTrigger) return;
        try {
          if (t.vars && t.vars.containerAnimation === horizTween && t.vars.trigger !== stickyEl) {
            t.kill(true);
          }
        } catch (e) {}
      });

      var dustEls = horizWrap.querySelectorAll('h1, h2, h3, h4, h5, h6, p, [class*="heading"], [class*="text-"]');
      var firstSet = (firstTexts || []).reduce(function (s, el) { s.add(el); return s; }, new Set());
      startFloatLoop();
      var managed = [];
      Array.prototype.forEach.call(dustEls, function (el) {
        var isFirst = firstSet.has(el);
        splitPanelText(el, isFirst);
        var chars = el._jjChars;
        if (!chars || !chars.length) return;
        managed.push(el);
        if (!isFirst) {
          ScrollTrigger.create({
            trigger: el,
            containerAnimation: horizTween,
            start: 'left right',
            onEnter: function () {
              if (el._jjAlienRevealed) return;
              el._jjAlienRevealed = true;
              alienReveal(chars);
            }
          });
        }
      });
      // Reversible hide/show driven by actual on-screen position, with a
      // dead-zone (70px out -> hide, 170px in -> show) so it can't re-trigger
      // while the text is on screen being read.
      function syncTexts() {
        if (bgEnabled) {
          var vw = window.innerWidth;
          for (var i = 0; i < managed.length; i++) {
            var mel = managed[i];
            var r = mel.getBoundingClientRect();
            if (r.right < 70) {
              if (!mel._jjDisintegrated) { mel._jjDisintegrated = true; customDisintegrate(mel._jjChars); }
            } else if (r.right > 170 && r.left < vw) {
              if (mel._jjDisintegrated) { mel._jjDisintegrated = false; reintegrate(mel._jjChars, mel); }
            }
          }
        }
        requestAnimationFrame(syncTexts);
      }
      requestAnimationFrame(syncTexts);
      try { setupMatrixScene(horizTween); } catch (e) {}
    }
    tryRun();
  }

  function findFirstPanelTexts() {
    var panels = document.querySelectorAll('.horizontal-scroll-content_wrapper');
    if (!panels.length) return [];
    return Array.prototype.slice.call(panels[0].querySelectorAll('h1, h2, h3, h4, h5, h6, p, [class*="heading"]'));
  }
  function findAllNextScenes() {
    var byClass = document.querySelectorAll('.next-section-button');
    var out = Array.prototype.slice.call(byClass);
    var btns = document.querySelectorAll('a, button, [role="button"]');
    for (var i = 0; i < btns.length; i++) {
      var t = (btns[i].textContent || '').trim().toLowerCase();
      if (t.indexOf('next scene') !== -1 && out.indexOf(btns[i]) === -1) out.push(btns[i]);
    }
    return out;
  }

  var hsGone = false;                                          // once the visitor catches him, that is that until a reload
  function scheduleHorizontalSprite() {
    /* One alien on the horizontal scroll, and he always arrives from the RIGHT facing into the page. He bobs just
       enough to feel alive — never so much that he is hard to click. Catch him once and he does not come back. */
    if (!document.getElementById('jj-hs-bob-style')) {
      var hbs = document.createElement('style'); hbs.id = 'jj-hs-bob-style';
      hbs.textContent = '@keyframes jjHsBob{0%,100%{translate:0 0;}50%{translate:0 -6px;}}.jj-hs-sprite{animation:jjHsBob 2.8s ease-in-out infinite;}.jj-hs-sprite.flip{scale:-1 1;}';   // flipped only where the art looks right natively
      (document.head || document.documentElement).appendChild(hbs);
    }
    var hsSpritesConfig = [
      { src: SPRITE_TR, anchor: { top: '124px',  right: '90px' }, hiddenT: 'translate(140%, -30%)',  peekT: 'translate(0, -22%)' },                  // in from the right, below the nav; the red one already looks left
      { src: SPRITE_BR, clip: PEEK.BR, anchor: { bottom: '15vh', right: '0' },  hiddenT: 'translate(140%, 20%)',   peekT: 'translate(20%, 20%)', flip: true }   // clear of the sound button; his eyes look right, so he is flipped
    ];
    function next() {
      if (hsGone) return;
      if (!bgEnabled || !bbOver) { setTimeout(next, 3000); return; }   // no stray alien during the Big Bang — only its trio
      var cfg = hsSpritesConfig[Math.floor(Math.random() * hsSpritesConfig.length)];
      var sprite = mkPeek(cfg);
      sprite.className = 'jj-hs-sprite' + (cfg.flip ? ' flip' : '');
      sprite.setAttribute('data-cursor', 'hover');
      sprite.style.cssText = 'position: fixed; pointer-events: auto; cursor: pointer; z-index: 4; width: 150px; height: auto; opacity: 0; will-change: transform, opacity; transition: opacity 0.6s ease, transform 1.6s cubic-bezier(0.34, 1.56, 0.64, 1);';
      Object.keys(cfg.anchor).forEach(function (k) { sprite.style[k] = cfg.anchor[k]; });
      sprite.style.transform = cfg.hiddenT;
      document.body.appendChild(sprite);
      enablePoke(sprite, cfg.hiddenT);
      sprite.addEventListener('click', function () {                // caught: he leaves and stays gone for this visit
        if (hsGone) return; hsGone = true;
        setTimeout(function () { pkLeft(); pkGone(); if (sprite.parentNode) sprite.parentNode.removeChild(sprite); }, 600);
      });
      (function go() {
        if (!pkCanEnter()) { setTimeout(go, 400); return; }        // waits its turn — never a third alien, never in step with another
        pkEnter();
        sprite.style.opacity = '1';
        sprite.style.transform = cfg.peekT; playFrom0(sprite);
        peekHold(sprite, 3000 + Math.random() * 2000, function () {
          if (hsGone) return;                                      // already caught — his exit is handled by the click
          setTimeout(function () {
            if (hsGone) return;
            pkLeft();
            sprite.style.transform = cfg.hiddenT;
            sprite.style.opacity = '0';
            setTimeout(function () {
              pkGone();
              if (sprite.parentNode) sprite.parentNode.removeChild(sprite);
              setTimeout(next, 18000 + Math.random() * 17000);
            }, 1800);
          }, pkExitWait());
        });
      })();
    }
    setTimeout(next, 10000 + Math.random() * 10000);
  }

  // ===== Big Bang sequence (after Click to Begin) =====
  // Philosopher sprites are 700KB+ each so they can't be inlined — upload the two SVGs to
  // Webflow Assets and paste the URLs below. Until then the philosopher is skipped and the
  // rest of the sequence (blink stars, aliens, star field) still runs.
  var PHIL_BASE     = 'https://cdn.prod.website-files.com/6a19b8f4191d4fbca532591e/6a200195245a88910104f066_Sprite%20philios.svg';                    // shocked face, no bubble
  var PHIL_THINKING = 'https://cdn.prod.website-files.com/6a19b8f4191d4fbca532591e/6a2001955bebd2a24a80cc47_sprite%20philosopher%20-%20thinking.svg'; // thinking, bubble up-right
  // Timed to the wizard speech (see experiments/speech-swap/README.md).
  // The voice starts right at the click; each beat lands on its line:
  var BB = {
    FLASH_AT:     6500,   // "all things were born in a single flash of light" — a point of
                          // light appears, swells, and bursts on the word "flash" (~8.8s)
    STARS_AT:     9300,   // blink stars are born out of the flash...
    STARS_HOLD:   6000,   // ...and linger into the gaze-at-the-stars line
    PHIL_IN:      10600,  // "and from it, a wizard came to be" — wizard fades in, thinking
    HSTARS_AT:    16300,  // "turn his gaze to the stars" — persistent star field appears
    DOOR_AT:      18800,  // "doorways into another world" — a doorway opens in the sky and
                          // glimpses of the site's worlds drift out of it
    GALAXIES_AT:  19000,  // galaxies drift in around the doorway, then out
    ALIENS_AT:    27200,  // "what if something beyond them gazed back" — all three peek over the top; that is what scares the wizard
    ALIENS_HOLD:  2600,
    PHIL_RESOLVE: 27100,  // "what if something beyond them" — dissolves to the shocked face
    EYES_AT:      28100,  // "gazed back upon us?" — two eyes open in the sky and blink
    PHIL_OUT:     30200   // wizard fades out as the scroll unlocks
  };
  var BB_Z = 9990;
  /* big-bang timers are pausable (achievements open mid-bang): each remembers what is left to run */
  var bbPending = [], bbPaused = false;
  function bbTimer(fn, t) {
    var rec = { fn: fn, rem: t, due: Date.now() + t, id: null };
    function arm() { rec.due = Date.now() + rec.rem; rec.id = setTimeout(function () { bbPending = bbPending.filter(function (r) { return r !== rec; }); rec.fn(); }, rec.rem); }
    bbPending.push(rec); if (!bbPaused) arm(); rec.arm = arm; return rec;
  }
  window.jjBB = {
    pause: function () { if (bbPaused) return; bbPaused = true; bbPending.forEach(function (r) { clearTimeout(r.id); r.rem = Math.max(0, r.due - Date.now()); }); },
    resume: function () { if (!bbPaused) return; bbPaused = false; bbPending.forEach(function (r) { r.arm(); }); }
  };

  var bigBangRan = false, bbOver = false;
  function runBigBang() {
    if (bigBangRan) return;
    bigBangRan = true;
    var layer = document.createElement('div');
    layer.id = 'jj-bigbang';
    layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:' + BB_Z + ';overflow:hidden;';
    document.body.appendChild(layer);
    /* the companion sits the whole Big Bang out (hidden from the click until the wizard has gone) */
    var coSt = document.createElement('style'); coSt.id = 'jj-bb-co';
    coSt.textContent = 'html.jj-bb-on #jj-co{opacity:0!important;visibility:hidden!important;transition:none!important;}';
    document.head.appendChild(coSt);
    document.documentElement.classList.add('jj-bb-on');
    bbTimer(function () { bbOver = true; document.documentElement.classList.remove('jj-bb-on'); }, BB.PHIL_OUT + 1200);

    /* The wizard: Joe's Seedance take of him (bb-wizard), one clip timed to the speech — stardust arrival on "a wizard
       came to be", the gaze, the staff raised at the doorway, the smug "Poetic, indeed", unease, then the shock on
       "gazed back upon us?". 15.1s of clip across his 19.6s on screen (PHIL_IN → PHIL_OUT), so it plays at 0.77x.
       Sized and placed so his BODY sits where the old sprite stood (lower-left, ~26vh tall): in the clip's frame his
       body spans 21-59% across and 31-87% down, so the 4:3 box is 46.4vh tall and pushed left/up to match. */
    var wiz = document.createElement('video');
    wiz.muted = true; wiz.playsInline = true; wiz.preload = 'auto'; wiz.setAttribute('muted', ''); wiz.setAttribute('playsinline', '');
    wiz.poster = ABASE + 'bb-wizard-poster.webp';
    wiz.innerHTML = '<source src="' + ABASE + 'bb-wizard.mov" type=\'video/mp4; codecs="hvc1"\'><source src="' + ABASE + 'bb-wizard.webm" type="video/webm">';
    /* 40vh box (was 46.4) — a touch smaller, feet kept on the same line (body bottom = 87% of the box) */
    wiz.style.cssText = 'position:absolute;left:calc(2vw - 11.2vh);top:48.2vh;height:40vh;width:auto;aspect-ratio:4/3;opacity:0;transition:opacity .35s ease;transform-origin:40% 87%;filter:drop-shadow(0 0 26px rgba(150,180,255,0.28));pointer-events:none;';
    layer.appendChild(wiz);
    bbTimer(function () {
      try { wiz.currentTime = 0.75; } catch (e) {}                 // skip the opening stardust swirl: its keyed edge reads as a black line on the flash's white
      wiz.playbackRate = 0.73; var pw = wiz.play(); if (pw && pw.catch) pw.catch(function () {});   // 14.35s of clip across the same 19.6s on screen
      wiz.style.transition = 'opacity .6s ease'; wiz.style.opacity = '1';
    }, BB.PHIL_IN);
    bbTimer(function () {                                        // out: shrinks away and drifts left as he fades
      wiz.style.transition = 'opacity 0.9s ease, transform 1s cubic-bezier(.5,0,.75,.4)';
      wiz.style.opacity = '0'; wiz.style.transform = 'translateX(-7vw) scale(.55)';
    }, BB.PHIL_OUT);
    bbTimer(function () { if (wiz.parentNode) wiz.parentNode.removeChild(wiz); }, BB.PHIL_OUT + 1200);

    bbTimer(function () { bigBangFlash(layer); }, BB.FLASH_AT);
    /* the flash goes fully white from "light" until the Rive's white circle closes (~9.0s → ~13.6s after the click): the
       white logo and Menu invert for that stretch so they never vanish into it */
    if (!document.getElementById('jj-bb-white-style')) { var ws = document.createElement('style'); ws.id = 'jj-bb-white-style';
      ws.textContent = '.nav-logo,.menu-container{transition:filter .5s ease!important;}html.jj-bb-white .nav-logo,html.jj-bb-white .menu-container{filter:invert(1);}';
      document.head.appendChild(ws); }
    bbTimer(function () { document.documentElement.classList.add('jj-bb-white'); }, BB.FLASH_AT + 2400);
    bbTimer(function () { document.documentElement.classList.remove('jj-bb-white'); }, 13600);
    bbTimer(function () { spawnBlinkStars(layer); }, BB.STARS_AT);
    bbTimer(function () { spawnDoorway(layer); }, BB.DOOR_AT);
    bbTimer(function () { spawnGalaxies(layer); }, BB.GALAXIES_AT);
    bbTimer(function () { bigBangAliens(); }, BB.ALIENS_AT);
    bbTimer(function () { spawnGazingEyes(layer); }, BB.EYES_AT);
    bbTimer(function () {
      if (animStarsWrap) {
        animStarsWrap._jjForceVisible = true;
        animStarsWrap.style.transition = 'opacity 1.5s ease';
        animStarsWrap.style.opacity = '1';
      }
    }, BB.HSTARS_AT);
    bbTimer(function () { if (window.jjScore) window.jjScore.award('big-bangs', { part: 'home' }); }, BB.PHIL_OUT + 200);
  }

  // "…a single flash of light": a point of light fades in, swells for ~2s, then bursts —
  // a white wash peaks on the word "light" and washes out as the blink stars are born.
  function bigBangFlash(layer) {
    // No filter on the core: a drop-shadow re-rasterizes the layer at every scale step of the
    // burst, which janks weaker GPUs. The radial gradient provides its own glow.
    var core = document.createElement('div');
    core.style.cssText = 'position:absolute;left:50%;top:45%;width:14px;height:14px;border-radius:50%;transform:translate(-50%,-50%) scale(0.2);opacity:0;background:radial-gradient(circle,#fff 0%,rgba(255,255,255,0.85) 30%,rgba(190,215,255,0.35) 60%,rgba(190,215,255,0) 75%);will-change:transform,opacity;transition:opacity 0.6s ease,transform 2.2s cubic-bezier(0.4,0,0.7,0.4);';
    var wash = document.createElement('div');
    wash.style.cssText = 'position:absolute;inset:0;background:#fff;opacity:0;transition:opacity 0.25s ease;';
    layer.appendChild(core); layer.appendChild(wash);
    requestAnimationFrame(function () {
      core.style.opacity = '1';
      core.style.transform = 'translate(-50%,-50%) scale(3)';   // slow swell over the line
    });
    setTimeout(function () {                                     // burst on "flash"
      core.style.transition = 'transform 0.6s cubic-bezier(0.6,0,0.9,0.5),opacity 0.9s ease';
      core.style.transform = 'translate(-50%,-50%) scale(70)';
    }, 2200);
    setTimeout(function () { wash.style.opacity = '0.85'; }, 2550);  // peaks on "light"
    setTimeout(function () {
      wash.style.transition = 'opacity 1.3s ease';
      wash.style.opacity = '0';
      core.style.opacity = '0';
    }, 2850);
    setTimeout(function () {
      if (core.parentNode) core.parentNode.removeChild(core);
      if (wash.parentNode) wash.parentNode.removeChild(wash);
    }, 4600);
  }

  // Lottie runtime, loaded on demand (svg-only "light" build). Nothing else on the
  // site uses lottie, so it's injected here rather than in the Footer Code box.
  var lottieCbs = [], lottieLoading = false;
  function withLottie(cb) {
    if (window.lottie) { cb(window.lottie); return; }
    lottieCbs.push(cb);
    if (lottieLoading) return;
    lottieLoading = true;
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie_light.min.js';
    s.onload = function () { lottieCbs.forEach(function (f) { f(window.lottie); }); lottieCbs = []; };
    document.head.appendChild(s);
  }

  // "…doorways into another world": a doorway opens in the sky (LottieFiles door,
  // self-contained json in the GitHub repo) and three round glimpses of the site's
  // own worlds — village, woods, castle — drift out of it, then everything slips
  // away as "Poetic, indeed." lands. Degrades to nothing if lottie failed to load.
  var DOORWAY_JSON = 'https://cdn.jsdelivr.net/gh/jacksonlaptop/joes-journey-code@main/Flow%202%20(2).json';
  var WORLD_GLIMPSES = [
    'https://cdn.jsdelivr.net/gh/jacksonlaptop/joes-journey-code@main/story-vil-bg.webp',
    'https://cdn.jsdelivr.net/gh/jacksonlaptop/joes-journey-code@main/story-wood-bg.webp',
    'https://cdn.jsdelivr.net/gh/jacksonlaptop/joes-journey-code@main/story-cas-bg.webp'
  ];
  /* The doorway beat ("…wondering if they were doorways into another world"). Joe's stone arch — a still for now,
     his Seedance "turning on" clip once it lands — with the tale's village masked into the opening, and his four
     world bubbles popping out of it one after another. Everything the arch doesn't draw is ours, so it stays crisp,
     keys cleanly, and lands on the narration. Timeline from DOOR_AT: in 0-1s, lights up at 1s, bubbles 1.6-2.7s,
     fades out at 4.2s for "Poetic, indeed." */
  var DOOR_WORLDS = [                                                   // [image, where it settles: left %, top % of the arch box]
    ['world-tavern',  -6, 24], ['world-village', 106, 22],
    ['world-woods',  -10, 76], ['world-cave',    110, 74]
  ];
  function spawnDoorway(layer) {
    if (!document.getElementById('jj-door-style')) {
      var st = document.createElement('style'); st.id = 'jj-door-style';
      st.textContent =
        '#jj-door{position:absolute;left:50%;top:9vh;height:min(calc(41vh - 110px),330px);width:auto;aspect-ratio:720/617;transform:translateX(-50%) scale(.6);opacity:0;transition:opacity 1s ease,transform 1.2s cubic-bezier(.34,1.56,.64,1);}' +
        '#jj-door.in{opacity:1;transform:translateX(-50%) scale(1);}#jj-door.out{opacity:0;transition:opacity .9s ease;}' +
        '#jj-door .world{position:absolute;inset:0;background-size:cover;background-position:50% 60%;-webkit-mask:url(' + ABASE + 'arch-hole.png) center/100% 100% no-repeat;mask:url(' + ABASE + 'arch-hole.png) center/100% 100% no-repeat;opacity:0;filter:brightness(2.2) saturate(.4);transition:opacity .7s ease,filter 1.4s ease;}' +
        '#jj-door.on .world{opacity:1;filter:brightness(1) saturate(1);}' +
        '#jj-door .arch{position:absolute;inset:0;width:100%;height:100%;filter:drop-shadow(0 0 0 rgba(255,210,120,0));transition:filter 1.2s ease;}' +
        '#jj-door.on .arch{filter:drop-shadow(0 0 16px rgba(255,205,110,.75)) drop-shadow(0 0 34px rgba(170,90,255,.45)) brightness(1.08);}' +
        '#jj-door .bub{position:absolute;left:50%;top:52%;width:26%;aspect-ratio:1;border-radius:50%;opacity:0;transform:translate(-50%,-50%) scale(.1);' +
          'box-shadow:0 0 0 3px #FFC93D,0 0 0 6px #8B5CF6,0 0 22px rgba(255,200,90,.7),0 0 40px rgba(139,92,246,.5);transition:left 1s cubic-bezier(.34,1.3,.64,1),top 1s cubic-bezier(.34,1.3,.64,1),transform 1s cubic-bezier(.34,1.45,.64,1),opacity .4s ease;}' +
        '#jj-door .bub img{display:block;width:100%;height:100%;border-radius:50%;}' +
        '#jj-door .bub.float{animation:jjDoorBob 3.2s ease-in-out infinite;}' +
        '@keyframes jjDoorBob{0%,100%{translate:0 0}50%{translate:0 -7px}}' +
        '#jj-door .tw{position:absolute;width:9px;height:9px;opacity:0;background:#fff4c8;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);filter:drop-shadow(0 0 4px #FFD76A);}' +
        '#jj-door.on .tw{animation:jjDoorTw 1.9s ease-in-out infinite;}' +
        '@keyframes jjDoorTw{0%,100%{opacity:0;scale:.4}50%{opacity:1;scale:1}}';
      document.head.appendChild(st);
    }
    var wrap = document.createElement('div'); wrap.id = 'jj-door';
    var world = document.createElement('div'); world.className = 'world'; world.style.backgroundImage = 'url(' + ABASE + 'story-vil-bg.webp)';
    var arch = document.createElement('img'); arch.className = 'arch'; arch.alt = ''; arch.src = ABASE + 'arch-still.webp';
    wrap.appendChild(world); wrap.appendChild(arch);
    for (var t = 0; t < 10; t++) {                                     // the arch's sparkle: twinkles scattered round the stones
      var tw = document.createElement('i'); tw.className = 'tw';
      var ang = (t / 10) * Math.PI * 2, rx = 44 + Math.random() * 10, ry = 40 + Math.random() * 10;
      tw.style.left = (50 + Math.cos(ang) * rx) + '%'; tw.style.top = (50 + Math.sin(ang) * ry) + '%'; tw.style.animationDelay = (Math.random() * 1.9) + 's';
      wrap.appendChild(tw);
    }
    layer.appendChild(wrap);
    requestAnimationFrame(function () { requestAnimationFrame(function () { wrap.classList.add('in'); }); });
    setTimeout(function () { if (wrap.parentNode) wrap.classList.add('on'); }, 1000);          // it switches on: the runes glow, the world appears
    DOOR_WORLDS.forEach(function (w, i) {
      setTimeout(function () {
        if (!wrap.parentNode) return;
        var bub = document.createElement('div'); bub.className = 'bub';
        var img = document.createElement('img'); img.alt = ''; img.src = ABASE + w[0] + '.webp'; bub.appendChild(img);
        wrap.appendChild(bub);
        requestAnimationFrame(function () { requestAnimationFrame(function () {
          bub.style.opacity = '1'; bub.style.left = w[1] + '%'; bub.style.top = w[2] + '%';      // out of the opening to its spot round the arch
          bub.style.transform = 'translate(-50%,-50%) scale(1)';
          setTimeout(function () { bub.classList.add('float'); bub.style.animationDelay = (-Math.random() * 3.2) + 's'; }, 1000);
        }); });
      }, 1600 + i * 360);
    });
    setTimeout(function () { wrap.classList.add('out'); }, 4200);
    setTimeout(function () { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 5300);
  }

  // Galaxies drift in around the doorway while the wizard wonders,
  // then slip away during "Poetic, indeed."
  function spawnGalaxies(layer) {
    var cfgs = [
      { left: 14, top: 18, size: 95 },
      { left: 72, top: 12, size: 130 },
      { left: 60, top: 60, size: 85 }
    ];
    cfgs.forEach(function (cfg, i) {
      var g = document.createElement('img');
      g.src = ASSET_GALAXY;
      g.style.cssText = 'position:absolute;left:' + cfg.left + 'vw;top:' + cfg.top + 'vh;width:' + cfg.size + 'px;height:auto;opacity:0;transform:scale(0.4) rotate(-25deg);transition:opacity 2s ease,transform 6s ease;filter:drop-shadow(0 0 14px rgba(170,140,255,0.5));';
      layer.appendChild(g);
      setTimeout(function () { g.style.opacity = '0.9'; g.style.transform = 'scale(1) rotate(8deg)'; }, i * 500);
      setTimeout(function () {
        g.style.transition = 'opacity 1.6s ease,transform 2.2s ease';
        g.style.opacity = '0';
        g.style.transform = 'scale(0.7) rotate(25deg)';
      }, 5200 + i * 400);
      setTimeout(function () { if (g.parentNode) g.parentNode.removeChild(g); }, 7400 + i * 400);
    });
  }

  // "…gazed back upon us?": two eyes open in the sky where the wizard is looking,
  // pupils down toward him, blink twice, linger just past the unlock, then slip away.
  function spawnGazingEyes(layer) {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'position:absolute;left:70vw;top:16vh;display:flex;gap:26px;opacity:0;transition:opacity 0.8s ease;filter:drop-shadow(0 0 12px rgba(200,225,255,0.9));';
    var eyes = [];
    for (var i = 0; i < 2; i++) {
      var e = document.createElement('div');
      e.style.cssText = 'width:20px;height:30px;border-radius:50%;background:radial-gradient(circle at 50% 60%, #0a1024 0 26%, rgba(255,255,255,0.98) 34%, rgba(255,255,255,0.7) 70%, rgba(255,255,255,0) 100%);transform:scaleY(0);transition:transform 0.45s cubic-bezier(0.34,1.56,0.64,1);';
      wrap.appendChild(e); eyes.push(e);
    }
    layer.appendChild(wrap);
    function setEyes(sy) { eyes.forEach(function (e) { e.style.transform = 'scaleY(' + sy + ')'; }); }
    requestAnimationFrame(function () {
      wrap.style.opacity = '1';
      setTimeout(function () { setEyes(1); }, 60);
    });
    setTimeout(function () { setEyes(0.08); }, 1500);
    setTimeout(function () { setEyes(1); }, 1700);
    setTimeout(function () { setEyes(0.08); }, 2100);
    setTimeout(function () { setEyes(1); }, 2300);
    setTimeout(function () { wrap.style.opacity = '0'; }, 4200);
    setTimeout(function () { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 5200);
  }

  function spawnBlinkStars(layer) {
    var i;
    for (i = 0; i < 10; i++) {
      (function () {
        var pos = pickStarPosition();
        var size = 6 + Math.random() * 10;
        var d = document.createElement('div');
        d.style.cssText = 'position:absolute;left:' + pos.left + 'vw;top:' + pos.top + 'vh;width:' + size + 'px;height:' + size + 'px;border-radius:50%;opacity:0;transform:scale(0.3);transition:opacity 0.6s ease,transform 0.6s cubic-bezier(0.34,1.56,0.64,1);background:radial-gradient(circle,rgba(255,255,255,0.95) 0%,rgba(255,255,255,0.55) 38%,rgba(255,255,255,0) 72%);filter:drop-shadow(0 0 6px rgba(200,225,255,0.9));';
        layer.appendChild(d);
        var delay = Math.random() * 900;
        setTimeout(function () { d.style.opacity = '1'; d.style.transform = 'scale(1)'; }, delay);
        setTimeout(function () { d.style.animation = 'jj-glow-subtle ' + (1.4 + Math.random()) + 's ease-in-out infinite'; }, delay + 600);
        setTimeout(function () { d.style.animation = ''; d.style.transition = 'opacity 0.9s ease,transform 0.9s ease'; d.style.opacity = '0'; d.style.transform = 'scale(0.5)'; }, BB.STARS_HOLD + delay);
        setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, BB.STARS_HOLD + delay + 1100);
      })();
    }
    for (i = 0; i < 6; i++) {
      (function () {
        var pos = pickStarPosition();
        var size = 26 + Math.random() * 26;
        var rot = Math.floor(Math.random() * 360);
        var img = document.createElement('img');
        img.src = ASSET_STAR;
        img.style.cssText = 'position:absolute;left:' + pos.left + 'vw;top:' + pos.top + 'vh;width:' + size + 'px;height:auto;opacity:0;transform-origin:center center;transform:rotate(' + rot + 'deg) scale(0.2);transition:opacity 0.7s ease,transform 0.7s cubic-bezier(0.34,1.56,0.64,1);filter:drop-shadow(0 0 8px rgba(200,225,255,0.85));';
        layer.appendChild(img);
        var delay = Math.random() * 1000;
        setTimeout(function () { img.style.opacity = '1'; img.style.transform = 'rotate(' + rot + 'deg) scale(1)'; }, delay);
        setTimeout(function () { img.style.transition = 'opacity 1s ease,transform 1s ease'; img.style.opacity = '0'; img.style.transform = 'rotate(' + (rot + 25) + 'deg) scale(0.6)'; }, BB.STARS_HOLD + delay);
        setTimeout(function () { if (img.parentNode) img.parentNode.removeChild(img); }, BB.STARS_HOLD + delay + 1200);
      })();
    }
  }

  function bigBangAliens() {
    var trio = [
      { src: SPRITE_TL, clip: PEEK.TL, anchor: { top: '80px', left: '0' },    hiddenT: 'translate(-100%, -100%)', peekT: 'translate(-22%, -22%)' },
      { src: SPRITE_TM, clip: PEEK.TM, anchor: { top: '0',    left: '30%' },   hiddenT: 'translate(-50%, -100%)',  peekT: 'translate(-50%, -32%)' },
      { src: SPRITE_TR, anchor: { top: '0',    right: '90px' }, hiddenT: 'translate(0, -100%)',     peekT: 'translate(0, -22%)' }
    ];
    /* Joe's one exception to "never more than two aliens": all three peek over the top on "gazed back upon us?".
       They hold every peek slot so no other alien can come in while they are out. */
    PK.out += trio.length; PK.lastIn = performance.now();
    setTimeout(function () { PK.out = Math.max(0, PK.out - trio.length); PK.lastOut = performance.now(); }, (trio.length - 1) * 300 + BB.ALIENS_HOLD + 700);
    trio.forEach(function (cfg, n) {
      var lag = [0, 300, 600][n];                                  // left, middle, right — a beat apart, in and out
      setTimeout(function () {
      var s = mkPeek(cfg, true); playFrom0(s);
      s.style.cssText = 'position:fixed;width:150px;height:auto;pointer-events:none;z-index:' + BB_Z + ';will-change:transform;transition:transform 0.5s cubic-bezier(0.34,1.5,0.64,1);';
      Object.keys(cfg.anchor).forEach(function (k) { s.style[k] = cfg.anchor[k]; });
      s.style.transform = cfg.hiddenT;
      document.body.appendChild(s);
      requestAnimationFrame(function () { requestAnimationFrame(function () { s.style.transform = cfg.peekT; }); });
      setTimeout(function () { s.style.transition = 'transform 0.4s cubic-bezier(0.5,0,0.75,0)'; s.style.transform = cfg.hiddenT; }, BB.ALIENS_HOLD);
      setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, BB.ALIENS_HOLD + 700);
      }, lag);
    });
  }

  // ===== Progress bar: fills during the speech, then tracks horizontal-scroll progress to the end =====
  function jjScrollProgress() {
    var hsw = document.querySelector('.horizontal-scroll-wrapper');
    if (!hsw) return 0;
    var max = Math.max(1, hsw.scrollWidth - window.innerWidth);
    return Math.min(1, Math.abs(getTranslateX(hsw)) / max);
  }

  function setupProgressBar() {
    if (!document.getElementById('jj-hud-style')) {
      var st = document.createElement('style');
      st.id = 'jj-hud-style';
      st.textContent =
        '#jj-progress{position:fixed;bottom:0;left:0;height:4px;width:0;z-index:9996;background:linear-gradient(90deg,#FF00F5,#ff7df4);box-shadow:0 0 12px rgba(255,0,245,0.7);opacity:0;transition:opacity 0.5s ease;pointer-events:none;}';
      document.head.appendChild(st);
    }

    var bar = document.createElement('div'); bar.id = 'jj-progress';
    document.body.appendChild(bar);
    requestAnimationFrame(function () { bar.style.opacity = '1'; });

    var start = Date.now();
    var FILL_UNTIL = UNLOCK_SCROLL_AT;  // fill over the speech; once scroll unlocks, track scroll to the end
    function tick() {
      var e = Date.now() - start;
      if (e < FILL_UNTIL) bar.style.width = Math.min(100, (e / FILL_UNTIL) * 100) + '%';
      else { var p = jjScrollProgress(); bar.style.width = (p * 100) + '%';
        if (p >= 0.98 && window.jjScore) { window.jjScore.award('scroll'); window.jjScore.award('scroll-star'); } } // Space theme + journey star
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  document.addEventListener('click', function (e) {
    if (triggered) return;
    // A landing container can also have only "Click to Begin" as its text.
    // Match the actual CTA, never a background ancestor with matching text.
    var node = e.target && e.target.closest ? e.target.closest('.enter-link_wrapper') : null;
    if (!node) return;
    while (node && node !== document.body) {
      var text = (node.textContent || '').trim().toLowerCase();
      if (text === 'click to begin') {
        triggered = true;
        if (window.jjScore && !(window.jjAudio && window.jjAudio.muted)) window.jjScore.award('sound-on', { x: e.clientX, y: e.clientY });
        lockScroll();
        runBigBang();

        landingTimers.forEach(clearTimeout);
        landingTimers = [];

        if (alienShown) {
          makeAlienHappy(); mood('bye', false, null, true);        // delighted, a wave, and off he shoots — cut straight to it, he must not duck out and back first
          hideAlienSpeech();
        } else {
          popUpAlienSmileFallback();
        }
        setTimeout(hideSittingAlienForever, ALIEN_HIDE_AFTER_CLICK);

        var sticky      = document.querySelector('.sticky-scroll-wrapper');
        var firstTexts  = findFirstPanelTexts();
        var nextScenes  = findAllNextScenes();
        var enterLinks  = document.querySelectorAll('.enter-link_wrapper');

        bgEnabled = false; update();
        if (sticky) sticky.classList.add('jj-wait-hidden');
        firstTexts.forEach(function (t) { t.classList.add('jj-first-text-hidden'); });
        nextScenes.forEach(function (b) { b.classList.add('jj-next-scene-hidden'); });
        enterLinks.forEach(function (el) {
          el.style.setProperty('pointer-events', 'none', 'important');
          if (el._jjPink) return;                                    // the begin gate already pressed this one pink
          // Cancel any Webflow/CSS reveal animation still controlling this button,
          // otherwise it overrides our opacity and the button never fades.
          if (el.getAnimations) el.getAnimations().forEach(function (a) { try { a.cancel(); } catch (e) {} });
          if (getComputedStyle(el).position === 'static') el.style.setProperty('position', 'relative', 'important');
          el.style.setProperty('overflow', 'hidden', 'important');
          // Pressed-state pink: pure CSS so it never depends on GSAP/rAF timing.
          var pink = document.createElement('div');
          pink.style.cssText = 'position:absolute;left:50%;top:50%;width:300%;height:300%;border-radius:50%;background:#FF00F5;z-index:1;pointer-events:none;transform:translate(-50%,-50%) scale(0);transition:transform 0.45s cubic-bezier(0.2,0.7,0.3,1);';
          el.appendChild(pink);
          setTimeout(function () { pink.style.transform = 'translate(-50%,-50%) scale(1)'; }, 30);
          // Hold the pink ~1s, then fade the whole button out.
          el.style.setProperty('transition', 'opacity 0.6s ease', 'important');
          setTimeout(function () { el.style.setProperty('opacity', '0', 'important'); }, 1000);
          setTimeout(function () { el.style.setProperty('display', 'none', 'important'); }, 1650);
        });
        document.querySelectorAll('.jj-intro-deco').forEach(function (el) {
          el.style.transition = 'opacity 1.2s ease';
          el.style.opacity = '0';
          setTimeout(function () { el.style.display = 'none'; }, 1300);
        });

        setTimeout(function () {
          setupAllTextEffects(firstTexts);
          scheduleHorizontalSprite();
          startSubtitleGrowth();

          function revealSticky() {
            if (sticky) { sticky.classList.remove('jj-wait-hidden'); sticky.classList.add('jj-wait-revealing'); }
            bgEnabled = true; update();
          }
          function revealNextScenes() {
            nextScenes.forEach(function (b) {
              b.classList.remove('jj-next-scene-hidden');
              b.classList.add('jj-next-scene-revealing');
            });
          }
          var typedFirst = false;
          function revealTypewriter() {
            if (typedFirst) return; typedFirst = true;
            fadeOutSubtitle();
            if (window.jjFlyerIn) window.jjFlyerIn(firstTexts);            // Joe flies in from the left as "Hey, I'm Joe" types
            firstTexts.forEach(function (el) {
              el.classList.remove('jj-first-text-hidden');
              el.style.opacity = '1';
              var chars = el._jjChars || splitPanelText(el, true);
              var i = 0;
              (function step() {
                if (i < chars.length) { chars[i].style.opacity = '1'; i++; setTimeout(step, 20); }
                else startFloatLoop();
              })();
            });
          }

          setTimeout(revealSticky, STICKY_REVEAL_AT);
          setTimeout(revealNextScenes, NEXT_SCENE_AT);
          setTimeout(revealTypewriter, TYPEWRITER_AT);
          setTimeout(unlockScroll, UNLOCK_SCROLL_AT);
          setupProgressBar();
        }, POST_CLICK_DELAY);

        return;
      }
      node = node.parentElement;
    }
  }, true);

  function getTranslateX(el) {
    var t = (el && el.style && el.style.transform) || '';
    var m = t.match(/translate(?:3d|X)?\(\s*(-?[\d.]+)/);
    if (m) return parseFloat(m[1]);
    m = t.match(/matrix(?:3d)?\(([^)]+)\)/);
    if (m) { var nums = m[1].split(',').map(function (s) { return parseFloat(s); }); return nums.length === 16 ? nums[12] : nums[4]; }
    return 0;
  }
  function imgRenderedWidth(img, viewH) {
    return (img.naturalWidth && img.naturalHeight) ? img.naturalWidth * (viewH / img.naturalHeight) : img.offsetWidth;
  }

  function buildAnimStarsInner(wrap) {
    var inner = document.createElement('div');
    inner.id = 'jj-anim-stars-inner';
    inner.style.cssText = 'position: absolute; top: 0; left: 0; width: 300vw; height: 100vh; will-change: transform;';
    wrap.appendChild(inner);
    for (var i = 0; i < 40; i++) {
      var star = document.createElement('img');
      star.src = ASSET_STAR;
      var size = 8 + Math.random() * 22;
      star.style.cssText = 'position: absolute; pointer-events: none; width: ' + size + 'px; height: auto;';
      star.style.left = (Math.random() * 98) + '%';
      star.style.top  = (Math.random() * 92) + '%';
      star.style.transformOrigin = 'center center';
      star.style.animation = 'jj-twinkle ' + (1.5 + Math.random() * 2.5) + 's ease-in-out ' + (Math.random() * 3) + 's infinite';
      inner.appendChild(star);
    }
    for (var i = 0; i < 5; i++) {
      var moon = document.createElement('img');
      moon.src = ASSET_MOON;
      var size = 50 + Math.random() * 70;
      moon.style.cssText = 'position: absolute; pointer-events: none; width: ' + size + 'px; height: auto;';
      moon.style.left = (8 + i * 18 + Math.random() * 6) + '%';
      moon.style.top  = (Math.random() < 0.5 ? Math.random() * 14 : 84 + Math.random() * 10) + '%';
      moon.style.animation = 'jj-glow-subtle ' + (3.5 + Math.random() * 2) + 's ease-in-out ' + (Math.random() * 2) + 's infinite';
      inner.appendChild(moon);
    }
    for (var i = 0; i < 5; i++) {
      var g = document.createElement('img');
      g.src = ASSET_GALAXY;
      var size = 33 + Math.random() * 27;
      g.style.cssText = 'position: absolute; pointer-events: none; width: ' + size + 'px; height: auto;';
      g.style.left = (4 + i * 18 + Math.random() * 6) + '%';
      g.style.top  = (10 + Math.random() * 65) + '%';
      g.style.transformOrigin = 'center center';
      g.style.animation = (i % 2 ? 'jj-spin-reverse ' : 'jj-spin ') + (40 + Math.random() * 30) + 's linear infinite';
      inner.appendChild(g);
    }
    return inner;
  }

  function initParallax() {
    var allContainer = document.querySelector('.all_container_wrapper');
    var hsw          = document.querySelector('.horizontal-scroll-wrapper');
    var pinnedEl     = document.querySelector('.sticky-scroll-flex-container');
    var moonBg       = document.querySelector('.moon-background');
    if (!allContainer || !hsw || !pinnedEl || !moonBg) { setTimeout(initParallax, 200); return; }
    allContainer.appendChild(frontWrap);
    moonBg.style.setProperty('z-index', '-2', 'important');

    animStarsWrap = document.createElement('div');
    animStarsWrap.id = 'jj-anim-stars-wrap';
    if (allContainer.nextSibling) allContainer.parentNode.insertBefore(animStarsWrap, allContainer.nextSibling);
    else allContainer.parentNode.appendChild(animStarsWrap);
    animStarsInner = buildAnimStarsInner(animStarsWrap);

    update = function () {
      var op = bgEnabled ? '1' : '0';
      backWrap.style.opacity  = op;
      frontWrap.style.opacity = op;
      if (!bgEnabled) {
        if (animStarsWrap) animStarsWrap.style.opacity = animStarsWrap._jjForceVisible ? '1' : '0';
        return;
      }
      var x     = getTranslateX(hsw);
      var viewH = window.innerHeight;
      var viewW = window.innerWidth;
      var maxTranslate = Math.max(1, hsw.scrollWidth - viewW);
      var progress     = Math.min(1, Math.abs(x) / maxTranslate);
      // Fade the star field out over the last stretch so the scroll doesn't end on stars-on-black.
      var endFade = progress > 0.78 ? Math.max(0, (0.93 - progress) / 0.15) : 1;
      if (animStarsWrap) animStarsWrap.style.opacity = String(endFade);
      var backTravel  = Math.max(0, imgRenderedWidth(back,  viewH) - viewW);
      var frontTravel = Math.max(0, imgRenderedWidth(front, viewH) - viewW);
      back.style.transform  = 'translateX(' + (-progress * backTravel  * BACK_SPEED) + 'px)';
      front.style.transform = 'translateX(' + (-progress * frontTravel * FRONT_SPEED) + 'px)';
      if (animStarsInner) {
        var animTravel = Math.max(0, animStarsInner.offsetWidth - viewW);
        animStarsInner.style.transform = 'translateX(' + (-progress * animTravel * ANIM_STARS_SPEED) + 'px)';
      }
    };

    new MutationObserver(update).observe(hsw, { attributes: true, attributeFilter: ['style'] });
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    back.addEventListener('load',  update);
    front.addEventListener('load', update);
    update();
  }

  if (document.readyState === 'complete') initParallax();
  else window.addEventListener('load', initParallax);
})();

/* ===== Planet Hunter: Jupiter + Mars, driven by the horizontal SCROLL (not the clock). Paths traced from the original "mars" Rive
   (which held both planets): Jupiter enters top-right, swoops through the bottom and leaves top-left; Mars enters top-right later and
   slides down to leave bottom-left. Progress = how far the host element has travelled across the viewport, eased each frame so the
   motion stays one fluid movement. The Rive canvas is hidden; the outline art flies; a click pops the FILLED art in (the flight
   carries on) and ticks Planet Hunter (2 parts). ===== */
(function () {
  var PGB = window.JJ_SCORE_BASE || 'https://cdn.jsdelivr.net/gh/jacksonlaptop/joes-journey-code@main/';   // JJ_SCORE_BASE: local preview override
  var ART = { jupiter: { line: PGB + 'score-jupiter-line.webp', fill: PGB + 'score-jupiter.webp', w: 11.5, from: 0.0,  to: 0.98 },
              mars:    { line: PGB + 'score-mars-line.webp',    fill: PGB + 'score-mars.webp',    w: 6.4,  from: 0.03, to: 0.98 } };   // both in from the first scroll, together, for the "Jupiter and Mars" line
  /* [u, left%, top%] along each planet's own path (u 0→1), % of the 16:9 box */
  var PATH = { jupiter: [[0,103,17],[.15,79.7,32],[.27,68.9,57],[.4,57.7,83],[.5,46,86.6],[.54,38,86.6],[.66,21.4,68],[.78,11.9,41],[.9,3,17.5],[1,-4,12]],
               mars:    [[0,98,19],[.12,88.3,15],[.24,75.3,15],[.36,60.7,23],[.48,49.3,41],[.6,40.7,59],[.72,31.1,71.6],[.84,19.3,79],[.94,8.4,83],[1,-4,87]] };
  function at(path, u) {                                  // Catmull-Rom through the traced points → no kinks
    u = Math.max(0, Math.min(1, u)); var i = 0; while (i < path.length - 2 && path[i + 1][0] < u) i++;
    var p0 = path[Math.max(0, i - 1)], p1 = path[i], p2 = path[i + 1], p3 = path[Math.min(path.length - 1, i + 2)];
    var t = (u - p1[0]) / Math.max(1e-6, p2[0] - p1[0]), t2 = t * t, t3 = t2 * t;
    function cr(a, b, c, d) { return 0.5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3); }
    return [cr(p0[1], p1[1], p2[1], p3[1]), cr(p0[2], p1[2], p2[2], p3[2])];
  }
  var st = document.createElement('style');
  st.textContent = '.jj-planets>canvas{display:none!important;}.jj-planets{position:relative;}' +
    '.jj-planets .jj-pl-box{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);pointer-events:none;}' +
    '.jj-planets .jj-pl{position:absolute;left:0;top:0;translate:-50% -50%;pointer-events:none;cursor:pointer;will-change:left,top;}' +
    '.jj-planets .jj-pl.jupiter{width:11.5%;}.jj-planets .jj-pl.mars{width:6.4%;}' +
    '.jj-planets .jj-pl .box{position:relative;width:100%;aspect-ratio:1;}' +
    '.jj-planets .jj-pl img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;pointer-events:auto;transition:opacity .5s ease,transform .7s cubic-bezier(.34,1.56,.64,1),filter .3s ease;}' +
    '.jj-planets .jj-pl img.fill{opacity:0;transform:scale(.55);pointer-events:none;}.jj-planets .jj-pl.lit img.fill{opacity:1;transform:scale(1.2);}.jj-planets .jj-pl.lit img.line{opacity:0;pointer-events:none;}' +
    '.jj-planets .jj-pl:not(.lit):hover img.line{filter:drop-shadow(0 0 14px rgba(199,231,255,.95));}';
  document.head.appendChild(st);
  function planet(name) {
    var a = ART[name], el = document.createElement('div'); el.className = 'jj-pl ' + name; el.setAttribute('data-cursor', 'hover');
    el.innerHTML = '<div class="box"><img class="line" src="' + a.line + '" alt=""><img class="fill" src="' + a.fill + '" alt=""></div>';
    el.addEventListener('click', function (e) {
      if (el.classList.contains('lit')) return; el.classList.add('lit');
      if (window.jjScore) window.jjScore.award('planets', { part: name, x: e.clientX, y: e.clientY });
    });
    return el;
  }
  function wire(host) {
    if (host._jjPlanets || host.classList.contains('jj-pl') || host.closest('.jj-planets')) return;   // our own Mars carries class "mars" — never wire it as a host
    host._jjPlanets = true; host.classList.add('jj-planets');
    var box = document.createElement('div'); box.className = 'jj-pl-box';
    var els = { jupiter: planet('jupiter'), mars: planet('mars') }; box.appendChild(els.jupiter); box.appendChild(els.mars); host.appendChild(box);
    function fit() { var w = host.clientWidth, h = host.clientHeight; if (!w || !h) return; var bw = Math.min(w, h * 16 / 9); box.style.width = bw + 'px'; box.style.height = (bw * 9 / 16) + 'px'; }
    fit(); if (window.ResizeObserver) new ResizeObserver(fit).observe(host); window.addEventListener('resize', fit);
    /* progress comes from the HORIZONTAL SCROLL itself (the host is a fixed layer that never moves): the moment Webflow reveals
       the host (opacity > 0) marks P0; the planets then cross the sky over the next ~1.1 screens of scroll — forwards and back. */
    var hsw = document.querySelector('.horizontal-scroll-wrapper');
    function tx(el) { var t = (el && el.style && el.style.transform) || '', m = t.match(/translate(?:3d|X)?\(\s*(-?[\d.]+)/); if (m) return parseFloat(m[1]);
      m = t.match(/matrix(?:3d)?\(([^)]+)\)/); if (m) { var n = m[1].split(',').map(parseFloat); return n.length === 16 ? n[12] : n[4]; } return 0; }
    var P0 = null, shown = -1, last = null, t0 = performance.now();
    function update(now) {
      var target;
      if (hsw) {
        var P = Math.abs(tx(hsw)), vis = parseFloat(getComputedStyle(host).opacity) > 0.05;
        if (P0 == null) { if (vis) P0 = P; }
        target = P0 == null ? 0 : (P - P0) / (Math.max(320, window.innerWidth) * 2.1);   // ~two screens of scroll to cross the sky: they linger, they don't dash
      } else { var r = host.getBoundingClientRect(), vw = Math.max(320, window.innerWidth); target = r.width ? (vw - r.left) / (vw + r.width) : 0; }
      if (!(target === target)) target = 0;                                            // never let a NaN in
      target = Math.max(0, Math.min(1, target));
      if (shown < 0) shown = target; else shown += (target - shown) * 0.12;            // eased → one fluid movement
      var bob = Math.sin((now - t0) / 1400) * 1.6;                                      // and a slow drift up and down while they hang there
      if (last === null || Math.abs(target - shown) > 0.0005 || now - last > 40) {
        last = now;
        for (var k in els) { var a = ART[k], u = (shown - a.from) / (a.to - a.from), pos = at(PATH[k], u), el = els[k];
          el.style.left = pos[0] + '%'; el.style.top = (pos[1] + bob * (k === 'mars' ? -1 : 1)) + '%'; el.style.opacity = (u <= 0 || u >= 1) ? '0' : '1';
          el.querySelector('.box').style.rotate = (u * 140) + 'deg'; }
      }
    }
    host._jjPlanets = { update: update, state: function () { return { P0: P0, shown: shown, P: hsw ? Math.abs(tx(hsw)) : null, vis: parseFloat(getComputedStyle(host).opacity) }; } };   // debug hook
    (function frame(now) { update(now); requestAnimationFrame(frame); })(performance.now());
    if (hsw) new MutationObserver(function () { update(performance.now()); }).observe(hsw, { attributes: true, attributeFilter: ['style'] });   // the scroll moves hsw's transform → update at once
  }
  function scan() { document.querySelectorAll('.mars, [data-jj-planets]').forEach(wire); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan); else scan();
  setTimeout(scan, 3000);
})();

/* ===== The grumpy alien of the horizontal scroll (Close Encounter). A keyed Seedance loop (hs-alien.*) drifts in from the edge at three
   points of the journey, hovers, and drifts away again if ignored. A click flies him off for good and ticks Close Encounter.
   VISITS: [progress window, side, bottom]. LOOP_END / FLYOFF: when the two-part clip lands (hover loop first, then angrier + exit),
   set LOOP_END to where the loop should wrap and FLYOFF to where the exit starts; the click then plays that instead of the CSS fly-off. ===== */
(function () {
  var PGB = window.JJ_SCORE_BASE || 'https://cdn.jsdelivr.net/gh/jacksonlaptop/joes-journey-code@main/';   // JJ_SCORE_BASE: local preview override
  var VISITS = [ [0.18, 0.30, 'right', '18vh'], [0.48, 0.60, 'left', '42vh'], [0.78, 0.90, 'right', '28vh'] ];
  var LOOP_END = 6.0, FLYOFF = 6.1, LOOP_RATE = 0.55;   // the shifty loop runs at just over half speed so he lingers; the exit plays at full speed   // hs-alien = shiftygrumpy alien.mp4 re-cut: 0–3s shifty hover, 3–6s the same played backwards (no jump at the wrap), 6.1s → angrier, shoots off up-right, gone by 9.6s
  var st = document.createElement('style');
  st.textContent = '#jj-hs-alien{position:fixed;z-index:60;width:clamp(120px,12vw,200px);height:auto;pointer-events:auto;cursor:pointer;opacity:0;transition:transform 1.1s cubic-bezier(.22,1,.36,1),opacity .6s ease;}' +
    '#jj-hs-alien.right{right:0;transform:translateX(110%);}#jj-hs-alien.left{left:0;transform:translateX(-110%) scaleX(-1);}' +
    '#jj-hs-alien.in{opacity:1;}#jj-hs-alien.right.in{transform:translateX(12%);}#jj-hs-alien.left.in{transform:translateX(-12%) scaleX(-1);}' +
    '#jj-hs-alien.off{transition:transform 1.1s cubic-bezier(.5,0,.8,1),opacity .8s ease .3s;opacity:0;}#jj-hs-alien.right.off{transform:translate(60vw,-70vh) scale(.5) rotate(20deg);}#jj-hs-alien.left.off{transform:translate(-60vw,-70vh) scale(.5) scaleX(-1) rotate(-20deg);}' +
    'body.jj-modal-open #jj-hs-alien{pointer-events:none!important;}';
  document.head.appendChild(st);
  var v = document.createElement('video'); v.id = 'jj-hs-alien'; v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.preload = 'auto'; v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
  v.poster = PGB + 'hs-alien-poster.webp'; v.setAttribute('data-cursor', 'hover');
  v.innerHTML = '<source src="' + PGB + 'hs-alien.mov" type=\'video/mp4; codecs="hvc1"\'><source src="' + PGB + 'hs-alien.webm" type="video/webm">';
  document.body.appendChild(v);
  var cur = -1;
  if (LOOP_END) v.addEventListener('timeupdate', function () { if (!v._flying && v.currentTime >= LOOP_END) v.currentTime = 0; });   // the clip itself is forward + reverse, so the wrap is invisible
  function show(k) { var vis = VISITS[k]; v.className = vis[2] + ' in'; v.style.bottom = vis[3]; v.style.top = 'auto'; v.playbackRate = LOOP_RATE; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  function hide() { v.classList.remove('in'); }
  function tick() {
    if (v._flying) return;
    var hsw = document.querySelector('.horizontal-scroll-wrapper'); if (!hsw) return;
    var t = (hsw.style && hsw.style.transform) || '', m = t.match(/translate(?:3d|X)?\(\s*(-?[\d.]+)/), x = m ? Math.abs(parseFloat(m[1])) : 0;
    var max = Math.max(1, hsw.scrollWidth - window.innerWidth), P = Math.min(1, x / max), k = -1;
    for (var i = 0; i < VISITS.length; i++) if (P >= VISITS[i][0] && P <= VISITS[i][1]) k = i;
    if (k !== cur) { cur = k; if (k < 0) hide(); else show(k); }
  }
  v.addEventListener('click', function (e) {
    if (v._flying) return; v._flying = true;
    if (window.jjScore) window.jjScore.award('alien-catch', { x: e.clientX, y: e.clientY });   // pays once; later pokes are just for fun
    if (FLYOFF != null) { v.loop = false; v.playbackRate = 1; try { v.currentTime = FLYOFF; } catch (x) {} var p = v.play(); if (p && p.catch) p.catch(function () {}); v.style.transition = 'opacity .4s ease';
      var gone = function () { if (!v._flying) return; v.style.opacity = '0';   // he gets angrier and shoots off in the clip; then, out of sight, he calms down and drifts back in from the start of his loop
        setTimeout(function () { v.pause(); try { v.currentTime = 0; } catch (x) {} v.loop = true; v._flying = false; if (cur >= 0) { v.style.opacity = ''; show(cur); } }, 1800); };
      v.addEventListener('ended', gone, { once: true }); setTimeout(gone, 5000); }
    else { v.classList.add('off'); setTimeout(function () { v.classList.remove('off'); v._flying = false; }, 2600); }
  });
  function arm() { var hsw = document.querySelector('.horizontal-scroll-wrapper'); if (!hsw) return setTimeout(arm, 1500);
    new MutationObserver(tick).observe(hsw, { attributes: true, attributeFilter: ['style'] }); window.addEventListener('resize', tick); tick(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arm); else arm();
})();

/* ===== Achievements open = the world holds its breath. GSAP, every CSS/Web animation outside the modal, videos, running sounds
   and the big-bang timers pause on jj:score:pause and pick up exactly where they were on jj:score:resume. Plain setTimeout flows
   elsewhere (the alien's speech) are left alone on purpose — they were not built to be paused. ===== */
(function () {
  var paused = false, anims = [], vids = [], howls = [];
  function inModal(n) { return n && n.closest && n.closest('#jj-ach, #jj-first, #jj-sc-hud'); }
  window.addEventListener('jj:score:pause', function () {
    if (paused) return; paused = true;
    try { if (window.gsap) gsap.globalTimeline.pause(); } catch (e) {}
    try { anims = document.getAnimations().filter(function (a) { var t = a.effect && a.effect.target; return a.playState === 'running' && !inModal(t); }); anims.forEach(function (a) { a.pause(); }); } catch (e) { anims = []; }
    vids = []; document.querySelectorAll('video').forEach(function (v) { if (!v.paused && !v.ended) { vids.push(v); v.pause(); } });
    howls = []; try { (window.Howler ? Howler._howls : []).forEach(function (h) { if (h.playing()) { howls.push(h); h.pause(); } }); } catch (e) {}
    try { if (window.lenis && window.lenis.stop) window.lenis.stop(); } catch (e) {}
    if (window.jjBB && window.jjBB.pause) window.jjBB.pause();
  });
  window.addEventListener('jj:score:resume', function () {
    if (!paused) return; paused = false;
    try { if (window.gsap) gsap.globalTimeline.resume(); } catch (e) {}
    anims.forEach(function (a) { try { if (a.playState === 'paused') a.play(); } catch (e) {} }); anims = [];
    vids.forEach(function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }); vids = [];
    howls.forEach(function (h) { try { h.play(); } catch (e) {} }); howls = [];
    try { if (window.lenis && window.lenis.start) window.lenis.start(); } catch (e) {}
    if (window.jjBB && window.jjBB.resume) window.jjBB.resume();
  });
})();
