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
  var MATRIX_GUY = 'https://cdn.prod.website-files.com/6a19b8f4191d4fbca532591e/6a218a72b3fe2da2dabfa4e5_Matrix.png';

  var LANDING_ALIEN_AT = 8000;
  var LANDING_SPEECH_AT = 12000;
  var SPEECH_POST_TYPE_PAUSE = 1000;
  var SPEECH_POST_REVEAL_PAUSE = 4000;
  var SPEECH_BETWEEN_PARTS = 6000;
  var SPEECH_PART2_HOLD = 4000;
  var POST_CLICK_DELAY = 1000;
  var ALIEN_HIDE_AFTER_CLICK = 1500;
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

  (function jjNavDropIn(){
    var SEL = '.nav-logo-link, .nav-logo, .menu-container, .menu-button';
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
  setupCta();

  function startSubtitleGrowth() {
    var subtitle = document.getElementById('jj-subtitle');
    if (!subtitle) { setTimeout(startSubtitleGrowth, 100); return; }
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
    sittingAlien = document.createElement('img');
    sittingAlien.id = 'jj-sitting-alien';
    sittingAlien.src = SITTING_ALIEN_SAD;
    sittingAlien.setAttribute('role', 'button');
    document.body.appendChild(sittingAlien);
    sittingAlien.addEventListener('mouseenter', function () {
      if (!sittingAlien) return;
      sittingAlien.src = (alienBaseExpression === 'sad') ? SITTING_ALIEN_HAPPY : SITTING_ALIEN_SAD;
    });
    sittingAlien.addEventListener('mouseleave', function () {
      if (!sittingAlien) return;
      sittingAlien.src = (alienBaseExpression === 'sad') ? SITTING_ALIEN_SAD : SITTING_ALIEN_HAPPY;
    });
    sittingAlien.addEventListener('click', function () {
      if (!sittingAlien || sittingAlien._sulking) return;
      sittingAlien._sulking = true;
      landingTimers.forEach(clearTimeout); landingTimers = [];
      hideAlienSpeech(); makeAlienSad();
      sittingAlien.style.transition = 'transform 0.5s cubic-bezier(0.5, 0, 0.75, 0)';
      sittingAlien.style.transform = 'translateY(66%) scale(0.8)';
      typewriterChars('Do you mind…', alienFontRevealToCaptions);
      setTimeout(function () {
        if (!sittingAlien) return;
        hideAlienSpeech();
        sittingAlien.style.transition = 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
        sittingAlien.style.transform = 'translateY(15%)';
        sittingAlien._sulking = false;
        // "Do you mind" only paused things — if he never got to the sound-on line, pick the flow back up.
        if (!triggered && !audioLineSaid) {
          var rt = setTimeout(function () {
            if (!triggered && !audioLineSaid && sittingAlien && !sittingAlien._sulking) runLandingSpeechSequence();
          }, 700);
          landingTimers.push(rt);
        }
      }, 5000);
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
    sittingAlien.src = SITTING_ALIEN_HAPPY;
    positionEmoteLines();
    if (sittingAlienLines) sittingAlienLines.classList.add('is-visible');
    setTimeout(function () {
      if (sittingAlienLines) sittingAlienLines.classList.remove('is-visible');
    }, 1800);
  }
  function makeAlienSad() {
    if (!sittingAlien) return;
    alienBaseExpression = 'sad';
    sittingAlien.src = SITTING_ALIEN_SAD;
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
    var props = ['fontFamily','fontWeight','fontSize','letterSpacing','lineHeight','color','textShadow','webkitTextStroke','paintOrder'];
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
      if (triggered || i >= lines.length) return;
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
    sittingAlien.src = SITTING_ALIEN_HAPPY;
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
    sprite.addEventListener('click', function () {
      if (sprite._poked) return;
      sprite._poked = true;
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
      { src: SPRITE_TR, anchor: { top: '0',     right: '90px' }, hiddenT: 'translate(0, -100%)',     peekT: 'translate(0, -22%)',     firstMin: 4000,  firstSpread: 4000 },
      { src: SPRITE_TL, anchor: { top: '80px',  left:  '0' },    hiddenT: 'translate(-100%, -100%)', peekT: 'translate(-22%, -22%)',  firstMin: 6000,  firstSpread: 4000 },
      { src: SPRITE_TM, anchor: { top: '0',     left:  '50%' },  hiddenT: 'translate(-50%, -100%)',  peekT: 'translate(-50%, -32%)',  firstMin: 8000,  firstSpread: 4000 },
      { src: SPRITE_BR, anchor: { bottom: '0',  right: '0' },    hiddenT: 'translate(100%, 100%)',   peekT: 'translate(20%, 20%)',    firstMin: 10000, firstSpread: 4000 },
      { src: SPRITE_BL, anchor: { bottom: '0',  left:  '0' },    hiddenT: 'translate(-100%, 100%)',  peekT: 'translate(-20%, 20%)',   firstMin: 12000, firstSpread: 4000 }
    ];
    spritesConfig.forEach(function (cfg) {
      var sprite = document.createElement('img');
      sprite.src = cfg.src;
      sprite.className = 'jj-intro-deco jj-alien-sprite';
      sprite.style.width = '150px'; sprite.style.height = 'auto';
      Object.keys(cfg.anchor).forEach(function (k) { sprite.style[k] = cfg.anchor[k]; });
      sprite.style.transition = 'opacity 0.6s ease, transform 1.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      sprite.style.willChange = 'transform, opacity';
      sprite.style.transform = cfg.hiddenT; sprite.style.opacity = '0';
      document.body.appendChild(sprite);
      enablePoke(sprite, cfg.hiddenT);
      function peek() {
        if (triggered) return;
        sprite.style.opacity = '1';
        sprite.style.transform = cfg.peekT;
        setTimeout(function () {
          if (triggered) return;
          sprite.style.transform = cfg.hiddenT;
          sprite.style.opacity = '0';
          setTimeout(function () {
            if (triggered) return;
            setTimeout(peek, 15000 + Math.random() * 13000);
          }, 1800);
        }, 2800 + Math.random() * 2500);
      }
      setTimeout(peek, cfg.firstMin + Math.random() * cfg.firstSpread);
    });
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
      c.style.fontFamily = 'var(--jj-alien-font, monospace)';
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
      });
    }, 620);
  }

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

  function scheduleHorizontalSprite() {
    var hsSpritesConfig = [
      { src: SPRITE_TR, anchor: { top: '0',     right: '90px' }, hiddenT: 'translate(0, -100%)',     peekT: 'translate(0, -22%)' },
      { src: SPRITE_TL, anchor: { top: '80px',  left:  '0' },    hiddenT: 'translate(-100%, -100%)', peekT: 'translate(-22%, -22%)' },
      { src: SPRITE_TM, anchor: { top: '0',     left:  '50%' },  hiddenT: 'translate(-50%, -100%)',  peekT: 'translate(-50%, -32%)' },
      { src: SPRITE_BR, anchor: { bottom: '0',  right: '0' },    hiddenT: 'translate(100%, 100%)',   peekT: 'translate(20%, 20%)' },
      { src: SPRITE_BL, anchor: { bottom: '0',  left:  '0' },    hiddenT: 'translate(-100%, 100%)',  peekT: 'translate(-20%, 20%)' },
      { src: SPRITE_BM, anchor: { bottom: '0',  left:  '38%' },  hiddenT: 'translate(-50%, 100%)',   peekT: 'translate(-50%, 22%)' }
    ];
    function next() {
      if (!bgEnabled) { setTimeout(next, 3000); return; }
      var cfg = hsSpritesConfig[Math.floor(Math.random() * hsSpritesConfig.length)];
      var sprite = document.createElement('img');
      sprite.src = cfg.src;
      sprite.style.cssText = 'position: fixed; pointer-events: none; z-index: 4; width: 150px; height: auto; opacity: 0; will-change: transform, opacity; transition: opacity 0.6s ease, transform 1.6s cubic-bezier(0.34, 1.56, 0.64, 1);';
      Object.keys(cfg.anchor).forEach(function (k) { sprite.style[k] = cfg.anchor[k]; });
      sprite.style.transform = cfg.hiddenT;
      document.body.appendChild(sprite);
      enablePoke(sprite, cfg.hiddenT);
      setTimeout(function () {
        sprite.style.opacity = '1';
        sprite.style.transform = cfg.peekT;
        setTimeout(function () {
          sprite.style.transform = cfg.hiddenT;
          sprite.style.opacity = '0';
          setTimeout(function () {
            if (sprite.parentNode) sprite.parentNode.removeChild(sprite);
            setTimeout(next, 18000 + Math.random() * 17000);
          }, 1800);
        }, 3000 + Math.random() * 2000);
      }, 100);
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
    ALIENS_AT:    22900,  // "Poetic, indeed." — the trio peeks in for the comic beat
    ALIENS_HOLD:  2500,
    PHIL_RESOLVE: 27100,  // "what if something beyond them" — dissolves to the shocked face
    EYES_AT:      28100,  // "gazed back upon us?" — two eyes open in the sky and blink
    PHIL_OUT:     30200   // wizard fades out as the scroll unlocks
  };
  var BB_Z = 9990;
  function bbTimer(fn, t) { return setTimeout(fn, t); }

  var bigBangRan = false;
  function runBigBang() {
    if (bigBangRan) return;
    bigBangRan = true;
    var layer = document.createElement('div');
    layer.id = 'jj-bigbang';
    layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:' + BB_Z + ';overflow:hidden;';
    document.body.appendChild(layer);

    if (PHIL_BASE && PHIL_THINKING) {
      // Both sprites share the same left/top anchor so he stays put across the swap.
      var philCSS = 'position:absolute;left:2vw;top:70%;transform:translateY(-50%);height:25vh;width:auto;opacity:0;transition:opacity 0.5s ease;filter:drop-shadow(0 0 26px rgba(150,180,255,0.28));';
      var imgThink = document.createElement('img');   // thinking, bubble up-right
      imgThink.src = PHIL_THINKING;
      imgThink.style.cssText = philCSS;
      var imgBase = document.createElement('img');     // shocked, looking up-right
      imgBase.src = PHIL_BASE;
      imgBase.style.cssText = philCSS;
      layer.appendChild(imgThink); layer.appendChild(imgBase);
      // start already thinking
      bbTimer(function () { imgThink.style.transition = 'opacity 0.8s ease'; imgThink.style.opacity = '1'; }, BB.PHIL_IN);
      // dissolve thinking -> shocked base (no overlap, so the differing sprite sizes never look like a jump)
      bbTimer(function () {
        imgThink.style.transition = 'opacity 0.35s ease'; imgThink.style.opacity = '0';
        bbTimer(function () { imgBase.style.transition = 'opacity 0.35s ease'; imgBase.style.opacity = '1'; }, 260);
      }, BB.PHIL_RESOLVE);
      bbTimer(function () { imgBase.style.transition = 'opacity 0.8s ease'; imgBase.style.opacity = '0'; }, BB.PHIL_OUT);
      bbTimer(function () {
        if (imgThink.parentNode) imgThink.parentNode.removeChild(imgThink);
        if (imgBase.parentNode) imgBase.parentNode.removeChild(imgBase);
      }, BB.PHIL_OUT + 1200);
    }

    withLottie(function () {});   // warm the lottie runtime now so the doorway can't be late
    bbTimer(function () { bigBangFlash(layer); }, BB.FLASH_AT);
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
  var DOORWAY_JSON = 'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/Flow%202%20(2).json';
  var WORLD_GLIMPSES = [
    'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/story-vil-bg.webp',
    'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/story-wood-bg.webp',
    'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/story-cas-bg.webp'
  ];
  function spawnDoorway(layer) {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'position:absolute;left:50%;top:12vh;width:min(34vh,300px);aspect-ratio:656/689;transform:translateX(-50%) scale(0.6);opacity:0;transition:opacity 1s ease,transform 1.2s cubic-bezier(0.34,1.56,0.64,1);';
    layer.appendChild(wrap);
    var anim = null;
    withLottie(function (lottie) {
      if (!wrap.parentNode) return;
      anim = lottie.loadAnimation({ container: wrap, renderer: 'svg', loop: false, autoplay: true, path: DOORWAY_JSON });
    });
    requestAnimationFrame(function () {
      wrap.style.opacity = '1';
      wrap.style.transform = 'translateX(-50%) scale(1)';
    });
    WORLD_GLIMPSES.forEach(function (src, i) {
      setTimeout(function () {
        if (!wrap.parentNode) return;
        var g = document.createElement('img');
        var sz = 62 + i * 8;
        var dx = [-120, 14, 132][i];
        var dy = [-88, -150, -96][i];
        g.src = src;
        g.style.cssText = 'position:absolute;left:50%;top:58%;width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;object-fit:cover;opacity:0;transform:translate(-50%,-50%) scale(0.15);box-shadow:0 0 18px rgba(255,220,140,0.6);transition:transform 2.6s ease,opacity 0.7s ease;';
        wrap.appendChild(g);
        requestAnimationFrame(function () {
          g.style.opacity = '0.95';
          g.style.transform = 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px)) scale(1)';
        });
        setTimeout(function () { g.style.opacity = '0'; }, 2700);
      }, 1500 + i * 600);
    });
    setTimeout(function () { wrap.style.opacity = '0'; }, 4000);
    setTimeout(function () {
      try { if (anim) anim.destroy(); } catch (e) {}
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
    }, 5100);
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
      { src: SPRITE_TL, anchor: { top: '80px', left: '0' },    hiddenT: 'translate(-100%, -100%)', peekT: 'translate(-22%, -22%)' },
      { src: SPRITE_TM, anchor: { top: '0',    left: '50%' },   hiddenT: 'translate(-50%, -100%)',  peekT: 'translate(-50%, -32%)' },
      { src: SPRITE_TR, anchor: { top: '0',    right: '90px' }, hiddenT: 'translate(0, -100%)',     peekT: 'translate(0, -22%)' }
    ];
    trio.forEach(function (cfg) {
      var s = document.createElement('img');
      s.src = cfg.src;
      s.style.cssText = 'position:fixed;width:150px;height:auto;pointer-events:none;z-index:' + BB_Z + ';will-change:transform;transition:transform 0.5s cubic-bezier(0.34,1.5,0.64,1);';
      Object.keys(cfg.anchor).forEach(function (k) { s.style[k] = cfg.anchor[k]; });
      s.style.transform = cfg.hiddenT;
      document.body.appendChild(s);
      requestAnimationFrame(function () { requestAnimationFrame(function () { s.style.transform = cfg.peekT; }); });
      setTimeout(function () { s.style.transition = 'transform 0.4s cubic-bezier(0.5,0,0.75,0)'; s.style.transform = cfg.hiddenT; }, BB.ALIENS_HOLD);
      setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, BB.ALIENS_HOLD + 700);
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
        if (p >= 0.98 && window.jjScore) window.jjScore.award('scroll'); }   // +1 star — made it through the journey
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  document.addEventListener('click', function (e) {
    if (triggered) return;
    var node = e.target;
    while (node && node !== document.body) {
      var text = (node.textContent || '').trim().toLowerCase();
      if (text === 'click to begin') {
        triggered = true;
        lockScroll();
        runBigBang();

        landingTimers.forEach(clearTimeout);
        landingTimers = [];

        if (alienShown) {
          makeAlienHappy();
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

/* ===== Planet Hunter: the "mars" Rive (which holds BOTH planets) rebuilt in code — the user has no Rive access. Traced from the
   .riv: a 10s loop on a 16:9 artboard. Jupiter (11.5% of the width) enters top-right at 0.7s, swoops through the bottom and leaves
   top-left at 8.3s; Mars (6.4%) enters top-right at 3.5s and slides down to leave bottom-left at 8.3s. We hide the Rive canvas, fit a
   16:9 box inside the element exactly like Rive's contain/center, and fly the outline art along the same paths. A click pops the
   FILLED art in (the flight carries on) and ticks Planet Hunter. The element keeps its Webflow box and reveal. ===== */
(function () {
  var PGB = 'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/';
  var ART = { jupiter: { line: PGB + 'score-jupiter-line.webp', fill: PGB + 'score-jupiter.webp', w: 11.5 },
              mars:    { line: PGB + 'score-mars-line.webp',    fill: PGB + 'score-mars.webp',    w: 6.4 } };
  var st = document.createElement('style');
  st.textContent = '.jj-planets>canvas{display:none!important;}.jj-planets{position:relative;}' +
    '.jj-planets .jj-pl-box{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);aspect-ratio:16/9;width:100%;max-height:100%;pointer-events:none;}' +
    '@supports not (aspect-ratio:16/9){.jj-planets .jj-pl-box{height:100%;}}' +
    '.jj-planets .jj-pl{position:absolute;left:0;top:0;translate:-50% -50%;pointer-events:none;animation:10s linear infinite;cursor:pointer;}' +
    '.jj-planets .jj-pl.jupiter{width:11.5%;animation-name:jjPlJupiter;}.jj-planets .jj-pl.mars{width:6.4%;animation-name:jjPlMars;}' +
    '.jj-planets .jj-pl img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;pointer-events:auto;transition:opacity .5s ease,transform .7s cubic-bezier(.34,1.56,.64,1),filter .3s ease;}' +
    '.jj-planets .jj-pl img.spin{animation:jjPlSpin 70s linear infinite;}' +
    '.jj-planets .jj-pl img.fill{opacity:0;transform:scale(.55);pointer-events:none;}.jj-planets .jj-pl.lit img.fill{opacity:1;transform:scale(1);}.jj-planets .jj-pl.lit img.line{opacity:0;pointer-events:none;}' +
    '.jj-planets .jj-pl:not(.lit):hover img.line{filter:drop-shadow(0 0 14px rgba(199,231,255,.95));}' +
    '.jj-planets .jj-pl .box{position:relative;width:100%;aspect-ratio:1;}' +
    '@keyframes jjPlSpin{to{rotate:360deg;}}' +
    /* left/top are % of the 16:9 box, straight from the trace (centre points) */
    '@keyframes jjPlJupiter{0%,6.9%{left:106%;top:19%;opacity:0;}7%{left:103%;top:17%;opacity:1;}20%{left:79.7%;top:32%;}30%{left:68.9%;top:57%;}40%{left:57.7%;top:83%;}47%{left:46%;top:86.6%;}50%{left:38%;top:86.6%;}60%{left:21.4%;top:68%;}70%{left:11.9%;top:41%;}80%{left:3%;top:17.5%;}83%{left:-4%;top:12%;opacity:1;}83.1%,100%{left:-6%;top:10%;opacity:0;}}' +
    '@keyframes jjPlMars{0%,34.9%{left:104%;top:19%;opacity:0;}35%{left:98%;top:19%;opacity:1;}40%{left:88.3%;top:15%;}45%{left:75.3%;top:15%;}50%{left:60.7%;top:23%;}55%{left:49.3%;top:41%;}60%{left:40.7%;top:59%;}65%{left:31.1%;top:71.6%;}70%{left:19.3%;top:79%;}75%{left:8.4%;top:83%;}80%{left:2.4%;top:85%;}83%{left:-4%;top:87%;opacity:1;}83.1%,100%{left:-6%;top:88%;opacity:0;}}';
  document.head.appendChild(st);
  function planet(name) {
    var a = ART[name], el = document.createElement('div'); el.className = 'jj-pl ' + name; el.setAttribute('data-cursor', 'hover');
    el.innerHTML = '<div class="box"><img class="line spin" src="' + a.line + '" alt=""><img class="fill" src="' + a.fill + '" alt=""></div>';
    el.addEventListener('click', function (e) {
      if (el.classList.contains('lit')) return; el.classList.add('lit');
      if (window.jjScore) window.jjScore.award('planets', { part: name, x: e.clientX, y: e.clientY });
    });
    return el;
  }
  function wire(host) {
    if (host._jjPlanets) return; host._jjPlanets = true; host.classList.add('jj-planets');
    var box = document.createElement('div'); box.className = 'jj-pl-box'; box.appendChild(planet('jupiter')); box.appendChild(planet('mars')); host.appendChild(box);
    /* contain/center like Rive: the 16:9 box is as big as the host allows */
    function fit() { var w = host.clientWidth, h = host.clientHeight; if (!w || !h) return; var bw = Math.min(w, h * 16 / 9); box.style.width = bw + 'px'; box.style.height = (bw * 9 / 16) + 'px'; }
    fit(); if (window.ResizeObserver) new ResizeObserver(fit).observe(host); window.addEventListener('resize', fit);
  }
  function scan() { document.querySelectorAll('.mars, [data-jj-planets]').forEach(wire); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan); else scan();
  setTimeout(scan, 3000);
})();
