document.addEventListener("DOMContentLoaded", function () {
  if (typeof THREE !== "undefined") {
    let scene, camera, renderer, shapes = [], svgPositionX = 0, clock;
    const container = document.getElementById("threejs-container");
    if (!container) return;
    container.style.overflow = "hidden";
    const config = {
      minCircleSize: 3, maxCircleSize: 10, circleSizeRandomness: 1,
      circleSpacing: 20, movementDirection: { x: -1, y: 0 }, movementSpeed: 0.4,
      shapeCount: 50, svgMovementSpeed: 0.004, minSvgSize: 20, maxSvgSize: 50,
      svgStarCount: 20, twinkleSpeedRange: { min: 0.2, max: 10 }, twinkleAmplitude: 1
    };
    let svgWrapper1, svgWrapper2;
    addSvgBackgrounds(); init(); animate();
    window.addEventListener("resize", onWindowResize);
    function addSvgBackgrounds() {
      svgWrapper1 = createSvgWrapper(); svgWrapper2 = createSvgWrapper();
      svgWrapper1.style.left = "0%"; svgWrapper2.style.left = "100%";
      container.insertBefore(svgWrapper1, container.firstChild);
      container.insertBefore(svgWrapper2, container.firstChild);
    }
    function createSvgWrapper() {
      const svgWrapper = document.createElement("div");
      svgWrapper.classList.add("svg-wrapper");
      svgWrapper.style.cssText = "z-index:-10;object-fit:cover;background-image:url('https://cdn.prod.website-files.com/615edb5c549d52cd108ed268/6718f10874b12a196e30db11_Starry%20Board.svg');background-size:cover;width:646%;height:100%;position:absolute;top:0;pointer-events:none;";
      return svgWrapper;
    }
    function init() {
      const { width, height } = container.getBoundingClientRect();
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(width/-2, width/2, height/2, height/-2, 1, 1000);
      camera.position.z = 10;
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);
      clock = new THREE.Clock();
      const svgUrls = [
        "https://cdn.prod.website-files.com/615edb5c549d52cd108ed268/67212bf05ed02917043863f9_x-star.svg",
        "https://cdn.prod.website-files.com/615edb5c549d52cd108ed268/67212bf05ed02917043863f5_whirl-star.svg",
        "https://cdn.prod.website-files.com/615edb5c549d52cd108ed268/67212bf0d1377a501ae28dc4_star-star.svg",
        "https://cdn.prod.website-files.com/615edb5c549d52cd108ed268/67212bf072ae1d89db07fec6_target-star.svg"
      ];
      let svgCount = 0, attempts = 0;
      while (shapes.length < config.shapeCount && attempts < 500) {
        const x = Math.random() * width - width / 2;
        const y = Math.random() * height - height / 2;
        const radius = config.minCircleSize + Math.random() * (config.maxCircleSize - config.minCircleSize) * config.circleSizeRandomness;
        if (!isOverlapping(x, y, radius)) {
          const speedFactor = Math.random() * 0.5 + 0.5;
          if (svgCount < config.svgStarCount) {
            createSvgShape(x, y, config.minSvgSize + Math.random() * (config.maxSvgSize - config.minSvgSize), svgUrls[Math.floor(Math.random() * svgUrls.length)], speedFactor);
            svgCount++;
          } else { createCircle(x, y, radius, speedFactor); }
        }
        attempts++;
      }
    }
    function createCircle(x, y, radius, speedFactor) {
      const mesh = new THREE.Mesh(new THREE.CircleGeometry(radius, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 }));
      mesh.position.set(x, y, 0);
      mesh.userData = { speedFactor, isCircle: true, twinkleSpeed: Math.random() * (config.twinkleSpeedRange.max - config.twinkleSpeedRange.min) + config.twinkleSpeedRange.min, twinkleOffset: Math.random() * Math.PI * 2 };
      scene.add(mesh); shapes.push(mesh);
    }
    function createSvgShape(x, y, size, svgUrl, speedFactor) {
      new THREE.TextureLoader().load(svgUrl, (texture) => {
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: texture, transparent: true }));
        mesh.position.set(x, y, 0); mesh.userData.speedFactor = speedFactor;
        scene.add(mesh); shapes.push(mesh);
      });
    }
    function isOverlapping(x, y, radius) {
      return shapes.some(s => Math.sqrt((s.position.x-x)**2 + (s.position.y-y)**2) < radius + config.circleSpacing);
    }
    function animate() {
      requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const { width, height } = container.getBoundingClientRect();
      shapes.forEach(shape => {
        shape.position.x += config.movementDirection.x * config.movementSpeed * shape.userData.speedFactor;
        shape.position.y += config.movementDirection.y * config.movementSpeed * shape.userData.speedFactor;
        if (shape.position.x > width/2) shape.position.x = -width/2;
        if (shape.position.x < -width/2) shape.position.x = width/2;
        if (shape.position.y > height/2) shape.position.y = -height/2;
        if (shape.position.y < -height/2) shape.position.y = height/2;
        if (shape.userData.isCircle) shape.material.opacity = 1 - config.twinkleAmplitude * (0.5 + 0.5 * Math.sin(elapsed * shape.userData.twinkleSpeed + shape.userData.twinkleOffset));
      });
      svgPositionX -= config.svgMovementSpeed;
      svgWrapper1.style.transform = `translateX(${svgPositionX}%)`;
      svgWrapper2.style.transform = `translateX(${svgPositionX + 100}%)`;
      if (Math.abs(svgPositionX) >= 50) svgPositionX = 0;
      renderer.render(scene, camera);
    }
    function onWindowResize() {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.left = -width/2; camera.right = width/2; camera.top = height/2; camera.bottom = -height/2;
      camera.updateProjectionMatrix();
    }
  }
});

(function () {
  var TARGET_VOLUME    = 0.6;
  var AUTO_START_DELAY = 3000;   // begin a few seconds after the visitor enters
  var FADE_MS          = 5000;   // long, slow fade-in

  var ambient = new Howl({
    src: ['https://cdn.prod.website-files.com/6a19b8f4191d4fbca532591e/6a19b8f4191d4fbca53259a5_Lotro-ambient.mp3'],
    loop: true,
    volume: 0
  });

  window.jjAudio = window.jjAudio || { sounds: [], muted: false, volume: 1.0 };
  if (window.jjAudio.sounds.indexOf(ambient) === -1) window.jjAudio.sounds.push(ambient);
  window.jjAudio.ambient = ambient;
  window.jjAudio.ambientTarget = TARGET_VOLUME;

  var faded = false;
  function playWithFade() {
    if (window.jjAudio && window.jjAudio.takeover) return;
    if (!ambient.playing()) ambient.play();
    if (faded) return;
    // If it's already audible (e.g. the load-time fade-in is mid-flight), don't yank it back to 0 —
    // that's what caused the "fade out then back in" on the first click after the ambient had started.
    if (ambient.volume() > 0.01) { faded = true; return; }
    faded = true;
    ambient.volume(0);
    ambient.fade(0, TARGET_VOLUME, FADE_MS);
  }

  function armInteractionFallback() {
    function onInteract() {
      try { if (window.Howler && Howler.ctx && Howler.ctx.state === 'suspended') Howler.ctx.resume(); } catch (e) {}
      playWithFade();
      document.removeEventListener('click', onInteract);
      document.removeEventListener('scroll', onInteract);
      document.removeEventListener('touchstart', onInteract);
      document.removeEventListener('keydown', onInteract);
    }
    document.addEventListener('click', onInteract);
    document.addEventListener('scroll', onInteract);
    document.addEventListener('touchstart', onInteract);
    document.addEventListener('keydown', onInteract);
  }

  function begin() {
    setTimeout(function () {
      var suspended = (window.Howler && Howler.ctx && Howler.ctx.state === 'suspended');
      if (suspended) {
        // Browser is blocking autoplay — wait for the first gesture, then fade in.
        armInteractionFallback();
      } else {
        playWithFade();
        // Safety re-check in case it didn't actually start.
        setTimeout(function () {
          if (!ambient.playing() || (window.Howler && Howler.ctx && Howler.ctx.state === 'suspended')) {
            faded = false;
            armInteractionFallback();
          }
        }, 700);
      }
    }, AUTO_START_DELAY);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', begin);
  else begin();
})();

document.addEventListener("DOMContentLoaded", function () {
  const audioTrigger = document.querySelector('.enter-link_wrapper');
  const audioController = document.querySelector('.audio-container-controller');
  let isMuted = false;
  let currentVolume = 1.0;
  window.jjAudio = window.jjAudio || { sounds: [], muted: false, volume: 1.0 };
  const activeSounds = window.jjAudio.sounds;

  // Subtitle element
  var subEl = document.getElementById('jj-subtitle');
  if (!subEl) {
    subEl = document.createElement('div');
    subEl.id = 'jj-subtitle';
    document.body.appendChild(subEl);
  }
  var subTimers = [];
  function showSub(text) { subEl.textContent = text; subEl.classList.add('is-visible'); }
  function hideSub() { subEl.classList.remove('is-visible'); }
  function clearSubs() { subTimers.forEach(clearTimeout); subTimers = []; }

  var subCues = [
    { time: 0,     text: 'A philosopher once asked…' },
    { time: 5000,  text: '“Are we human because we gaze at the stars,' },
    { time: 8500,  text: 'or do we gaze at them because we are human?”' },
    { time: 12500, text: 'Pointless, really.' },
    { time: 15500, text: 'Do the stars gaze back?' },
    { time: 18500, text: 'Now, that’s a question…' },
    { time: 23500, text: null }

  ];


  if (audioTrigger) {
    audioTrigger.addEventListener('click', function playAudio() {
      // Cross the seek under a fade so there's no audible jump: fade the current loop out over 5s, then
      // (silently) seek to 0:45.5 and fade back in over 16.5s — the track reaches 1:02 at full volume
      // exactly when the scroll unlocks (~21.5s after click).  45.5 + 16.5 = 62s;  5 + 16.5 = 21.5s.
      var amb = window.jjAudio.ambient;
      var ambBack = window.jjAudio.ambientTarget || 0.6;
      window.jjAudio.takeover = true; // we drive the ambient from here — stop the autoplay-fallback touching it
      if (amb) {
        if (!amb.playing()) amb.play();
        amb.fade(amb.volume(), 0, 5000);
        setTimeout(function () {
          amb.volume(0);             // force silence FIRST so the seek (and any seek-pop) is inaudible
          try { amb.seek(45.5); } catch (e) {}
          amb.fade(0, ambBack, 16500);
        }, 5000);
      }
      // Fade out / stop any OTHER active sounds, but leave the ambient running.
      activeSounds.slice().forEach(function (s) {
        if (s === amb) return;
        s.fade(s.volume(), 0, 1500);
        setTimeout(function () { s.stop(); }, 1500);
        var i = activeSounds.indexOf(s); if (i > -1) activeSounds.splice(i, 1);
      });

      const speech = new Howl({
        src: ['https://cdn.prod.website-files.com/671911bb2d628244234f434e/69c2d642cdd2945eb0730842_stardust-speech.mp3'],
        volume: 0,
               onend: function () {
          speech.fade(0.8, 0, 1500);
          setTimeout(function () {
            var idx = activeSounds.indexOf(speech);
            if (idx > -1) activeSounds.splice(idx, 1);
          }, 1500);
          hideSub();
          clearSubs();
        }
      });


      activeSounds.push(speech);
      const speechId = speech.play();
      speech.fade(0, 0.8, 3000, speechId);

      document.dispatchEvent(new CustomEvent('jj:audio:start'));

      subCues.forEach(function (cue) {
        subTimers.push(setTimeout(function () {
          if (cue.text) { showSub(cue.text); } else { hideSub(); }
        }, cue.time));
      });

      audioTrigger.removeEventListener('click', playAudio);

      if (audioController) {
        audioController.addEventListener('click', function () {
          activeSounds.forEach(function (s) {
            if (isMuted) { s.fade(0.0, currentVolume, 500); } else { s.fade(currentVolume, 0.0, 500); }
          });
          isMuted = !isMuted;
        });
      }
    });
  }

  const lastScrollTrigger = document.querySelector('.scroll-trigger.last');
  if (lastScrollTrigger) {
    ScrollTrigger.create({
      trigger: lastScrollTrigger,
      start: "top center",
      onEnter: function () { activeSounds.forEach(function (s) { s.fade(currentVolume, 0.0, 4500); }); }
    });
  }
});

(function () {
  if (window.location.pathname.replace(/\/$/, '') !== '') return;

  function jjStartFlyRive() {
    var attempts = 0;
    function tryTrigger() {
      var rivePlugin = window.Webflow && Webflow.require && Webflow.require('rive');
      if (!rivePlugin) { if (++attempts < 20) setTimeout(tryTrigger, 500); return; }
      var flyEl = document.querySelector('.fly-rive');
      if (!flyEl) return;
      var inst = rivePlugin.getInstance(flyEl);
      if (!inst || !inst.rive) { if (++attempts < 20) setTimeout(tryTrigger, 500); return; }
      var riveObj = inst.rive;
      function trigger() {
        try { riveObj.play('State Machine 1'); } catch (e) {}
        var inputs = riveObj.stateMachineInputs('State Machine 1');
        if (inputs) inputs.forEach(function (i) { if (i.name === 'Fly') i.value = true; });
      }
      if (riveObj.loaded) { trigger(); } else { riveObj.on('load', trigger); }
    }
    tryTrigger();
  }

  function jjStartIntroRive() {
    var attempts = 0;
    function tryTrigger() {
      var rivePlugin = window.Webflow && Webflow.require && Webflow.require('rive');
      if (!rivePlugin) { if (++attempts < 20) setTimeout(tryTrigger, 500); return; }
      var riveEl = document.querySelector('.rive');
      if (!riveEl) return;
      var inst = rivePlugin.getInstance(riveEl);
      if (!inst || !inst.rive) { if (++attempts < 20) setTimeout(tryTrigger, 500); return; }
      var riveObj = inst.rive;
      function trigger() {
        var riveEl2 = document.querySelector('.rive');
        if (riveEl2) gsap.set(riveEl2, { opacity: 1 });
        try { riveObj.play('State Machine 1'); } catch (e) {}
        var inputs = riveObj.stateMachineInputs('State Machine 1');
        if (inputs) inputs.forEach(function (i) { if (i.name === 'Start') i.value = true; });
      }
      if (riveObj.loaded) { trigger(); } else { riveObj.on('load', trigger); }
    }
    tryTrigger();
  }

  function dustExit(el) {
    if (el._dusted) return;
    el._dusted = true;
    if (typeof SplitType === 'undefined') return;
    var split = new SplitType(el, { types: 'chars' });
    split.chars.forEach(function (c) {
      c.style.fontFamily = 'var(--jj-alien-font, monospace)';
      c.style.letterSpacing = '0.15em';
    });
    gsap.to(split.chars, {
      y: function () { return gsap.utils.random(-50, -120); },
      x: function () { return gsap.utils.random(-30, 30); },
      rotation: function () { return gsap.utils.random(-90, 90); },
      scale: function () { return gsap.utils.random(0, 0.6); },
      opacity: 0,
      duration: function () { return gsap.utils.random(0.4, 1.0); },
      ease: 'power2.out',
      stagger: { each: 0.02, from: 'random' }
    });
  }





  function revealPage() {
    var flyRiveEl = document.querySelector('.fly-rive');
if (flyRiveEl) { flyRiveEl.style.display = 'block'; flyRiveEl.style.opacity = '1'; }

    jjStartFlyRive();
    var overlay   = document.querySelector('.joes-journey-overlay');
    var introSec  = document.querySelector('.intro-section');
    var introWrap = document.querySelector('.intro-reveal_wrapper');
    var sticky    = document.querySelector('.sticky-scroll-wrapper');
    var nextBtn   = document.querySelector('.next-section-button');
    if (overlay)   gsap.to(overlay,   { opacity: 0, duration: 1.0, delay: 13.0, onComplete: function () { overlay.style.pointerEvents = 'none'; } });
    if (introSec)  gsap.to(introSec,  { opacity: 0, duration: 1.0, delay: 13.0, onComplete: function () { introSec.style.pointerEvents = 'none'; } });
    if (introWrap) introWrap.style.display = 'none';
    if (sticky)    gsap.to(sticky,    { opacity: 1, duration: 3.5, delay: 13.0 });
    if (nextBtn)   gsap.to(nextBtn,   { opacity: 1, duration: 0.5, delay: 16.5 });

  }

  window.revealPage = revealPage;

  function init() {
    var riveDiv      = document.querySelector('.rive');
    var topPanel     = document.querySelector('.black-reveal_content.top');
    var botPanel     = document.querySelector('.black-reveal_content.bottom');
    var introWrapper = document.querySelector('.intro-reveal_wrapper');
    var btn          = document.querySelector('.enter-link_wrapper');
    if (riveDiv) gsap.set(riveDiv, { opacity: 0 });
    var flyRiveEl = document.querySelector('.fly-rive');
    if (flyRiveEl) flyRiveEl.style.display = 'none';

        var sticky = document.querySelector('.sticky-scroll-wrapper');
    if (sticky) gsap.set(sticky, { opacity: 0 });

    if (topPanel && botPanel && typeof gsap !== 'undefined') {
      gsap.to(topPanel, { y: -5000, duration: 1.4, ease: 'power2.inOut', delay: 0.2 });
      gsap.to(botPanel, { y:  5000, duration: 1.4, ease: 'power2.inOut', delay: 0.2 });
      if (introWrapper) {
        gsap.to(introWrapper, { opacity: 0, duration: 0.3, delay: 1.3, onComplete: function () { introWrapper.style.display = 'none'; } });
      }
    }
    setTimeout(jjStartIntroRive, 6000);
    if (btn) {
      btn.addEventListener('click', function (e) { e.preventDefault(); revealPage(); });
    }
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();

(function () {
  var STATES = {
     def: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="5" fill="white" stroke="#000000" stroke-opacity="0.5" stroke-width="1"/></svg>',
    hover: '<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="51" height="51" rx="25.5" stroke="#4F4F4F"/><circle cx="26" cy="26" r="2" fill="white"/></svg>',
    external: '<svg width="62" height="62" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="61" height="61" rx="30.5" stroke="white" stroke-opacity="0.3"/><path fill-rule="evenodd" clip-rule="evenodd" d="M30.9671 37.4243C31.1233 37.5805 31.3766 37.5805 31.5328 37.4243L37.6742 31.2829C37.8304 31.1267 37.8304 30.8734 37.6742 30.7172L31.5328 24.5758C31.3766 24.4196 31.1233 24.4196 30.9671 24.5758L30.1186 25.4243C29.9623 25.5805 29.9623 25.8338 30.1186 25.99L33.1043 28.9758C33.4823 29.3538 33.2146 30.0001 32.6801 30.0001L24.443 30.0001C24.2221 30.0001 24.043 30.1791 24.043 30.4001V31.6001C24.043 31.821 24.2221 32.0001 24.443 32.0001L32.6801 32.0001C33.2146 32.0001 33.4823 32.6463 33.1044 33.0243L30.1186 36.0101C29.9623 36.1663 29.9623 36.4196 30.1186 36.5758L30.9671 37.4243Z" fill="white"/></svg>',
    caseStudy: '<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="99" height="99" rx="49.5" stroke="white"/><path d="M40.5684 48.11L37.6084 41.5H39.0584L40.6984 45.54C40.7184 45.59 40.7484 45.59 40.7684 45.54L42.2784 41.5H43.6484L40.8884 48.11H40.5684ZM44.3214 48V41.5H45.6214V48H44.3214ZM46.88 48V41.5H51.13V42.74H48.13V43.99H50.88V45.21H48.13V46.78H51.13V48H46.88ZM57.4625 48.11L55.9625 43.4L54.4825 48.11H54.1425L51.6625 41.5H53.1025L54.2825 45.28C54.3025 45.33 54.3325 45.33 54.3525 45.28L55.3325 41.5H56.6625L57.6825 45.28C57.7025 45.33 57.7325 45.33 57.7525 45.28L58.8925 41.5H60.2825L57.8025 48.11H57.4625ZM31.8165 58V51.5H33.9465C35.3665 51.5 36.2165 52.31 36.2165 53.55C36.2165 54.79 35.3665 55.64 33.9465 55.64H33.0965V58H31.8165ZM33.0965 54.47H33.9465C34.5765 54.47 34.9165 54.08 34.9165 53.55C34.5765 53.06 34.5765 52.69 33.9465 52.69H33.0965V54.47ZM36.9142 58V51.5H39.1442C40.5642 51.5 41.4142 52.26 41.4142 53.5C41.4142 54.38 40.9842 55.03 40.2342 55.34L41.7742 58H40.3442L38.9342 55.54H38.1942V58H36.9142ZM38.1942 54.37H39.1442C39.7742 54.37 40.1142 54.03 40.1142 53.5C39.7742 53.01 39.7742 52.69 39.1442 52.69H38.1942V54.37ZM49.7577 58.15C49.2677 58.15 48.7977 57.97 48.5577 57.72L48.9577 56.64C49.1277 56.79 49.3777 56.91 49.6777 56.91C50.1177 56.91 50.4577 56.65 50.4577 56.04V51.5H51.7577V56.02C51.7577 57.49 50.8277 58.15 49.7577 58.15ZM52.9493 58V51.5H57.1993V52.74H54.1993V53.99H56.9493V55.21H54.1993V56.78H57.1993V58H52.9493ZM61.0337 58.1C59.2037 58.1 57.8537 56.64 57.8537 54.75C57.8537 52.81 59.2037 51.4 61.0537 51.4C61.9237 51.4 62.6837 51.71 63.1437 52.15L62.5937 53.24C62.2637 52.96 61.7037 52.72 61.1137 52.72C59.9737 52.72 59.1937 53.59 59.1937 54.75C59.9437 55.87 59.9437 56.8 61.1137 56.8C61.7137 56.8 62.3037 56.55 62.6437 56.2L63.1837 57.3C62.7337 57.76 61.9237 58.1 61.0337 58.1ZM65.425 58V52.66H63.525V51.5H68.625V52.66H66.725V58H65.425Z" fill="white"/><path d="M45.3325 58.1C43.4625 58.1 42.0725 56.64 42.0725 54.75C42.0725 52.81 43.4725 51.4 45.3325 51.4C47.1925 51.4 48.5925 52.81 48.5925 54.75C48.5925 56.64 47.2025 58.1 45.3325 58.1ZM43.3725 54.75C43.3725 55.88 44.1425 56.82 45.3325 56.82C46.5225 56.82 47.2925 55.88 47.2925 54.75C47.2925 53.58 46.4925 52.7 45.3325 52.7C44.1725 52.7 43.3725 53.58 43.3725 54.75Z" fill="#FF00F5"/></svg>'
  };
  var el = document.createElement('div');
  el.id = 'jj-cursor';
  document.body.appendChild(el);
  var current = null;
  var mx = 0, my = 0, cx = 0, cy = 0;
  function setState(s) {
    if (s === current) return;
    current = s;
    el.innerHTML = STATES[s];
    el.classList.remove('is-entering');
    void el.offsetWidth;
    el.classList.add('is-entering');
  }
  setState('def');
  function tick() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    el.style.left = cx + 'px';
    el.style.top  = cy + 'px';
    requestAnimationFrame(tick);
  }
  tick();
  document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; el.style.opacity = '1'; });
  document.addEventListener('mouseleave', function () { el.style.opacity = '0'; });
  document.addEventListener('mouseover', function (e) {
    var t = e.target;
    if (t.closest('a[href*="/case-studies/"]')) { setState('caseStudy'); return; }
    if (t.closest('a[target="_blank"]') || t.closest('a[href^="http"]:not([href*="joes-journey"])')) { setState('external'); return; }
    if (t.closest('a, button, [role="button"], [data-jj="cta"], [data-jj="btn"], .enter-link_wrapper, .jj-poke-sprite, #jj-sitting-alien, label, input, select, textarea')) { setState('hover'); return; }
    setState('def');
  });
  window.jjAudio = window.jjAudio || { sounds: [], muted: false, volume: 1.0 };
  var jjUserMuted = false;
  try { if (sessionStorage.getItem('jjUserMuted') === '1') jjUserMuted = true; } catch (e) {}
  function jjMasterVolume() { return (window.jjAudio && window.jjAudio.volume != null) ? window.jjAudio.volume : 1.0; }
  function jjApplyMute() {
    if (typeof window.Howler === 'undefined') return;
    try { Howler.volume(jjUserMuted ? 0 : jjMasterVolume()); } catch (e) {}
  }
  function jjStartAudioBars(btn) {
    var bars = btn.querySelectorAll('.jj-bar');
    var mistBars = document.querySelectorAll('#jj-sound-mist .jj-mist-bar');
    var minH = 5, maxH = 34, mistMin = 10, mistMax = 70;
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
      if (typeof window.Howler === 'undefined' || !Howler.ctx) { setTimeout(tryStart, 200); return; }
      try {
        var ctx = Howler.ctx, src = Howler.masterGain;
        if (!src) { setTimeout(tryStart, 200); return; }
        var analyser = ctx.createAnalyser();
        analyser.fftSize = 256; analyser.smoothingTimeConstant = 0.65;
        src.connect(analyser);
        var data = new Uint8Array(analyser.frequencyBinCount);
        var t0 = performance.now();
        function loop() {
          analyser.getByteFrequencyData(data);
          var nowS = (performance.now() - t0) / 1000;
          var sum = 0, count = 0;
          for (var bi = 4; bi < 64; bi++) { sum += data[bi]; count++; }
          var avg = Math.min(1, (count ? (sum / count) / 255 : 0) * 2.6);
          var driver = Math.max(0.22 + 0.14 * Math.sin(nowS * 2.0), avg);
          if (jjUserMuted) driver = 0;
          paint(driver, nowS);
          requestAnimationFrame(loop);
        }
        loop();
      } catch (e) {
        var t0 = performance.now();
        function fb() {
          var nowS = (performance.now() - t0) / 1000;
          var driver = jjUserMuted ? 0 : (0.42 + 0.34 * Math.sin(nowS * 2.0));
          paint(driver, nowS);
          requestAnimationFrame(fb);
        }
        fb();
      }
    }
    tryStart();
  }
  function jjSetupSoundButton() {
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
    btn.style.opacity = '0'; mist.style.opacity = '0';
    setTimeout(function () {
      btn.style.transition = 'opacity 2.5s ease, background 0.25s ease';
      mist.style.transition = 'opacity 2.5s ease';
      btn.style.opacity = '1'; mist.style.opacity = '0.55';
    }, 2000);
    if (jjUserMuted) btn.classList.add('is-muted');
    btn.addEventListener('mouseenter', function (e) {
      var rect = btn.getBoundingClientRect();
      var x = (e.clientX - rect.left), y = (e.clientY - rect.top);
      var maxDist = Math.max(Math.hypot(x, y), Math.hypot(rect.width - x, y), Math.hypot(x, rect.height - y), Math.hypot(rect.width - x, rect.height - y));
      var size = maxDist * 2.4;
      fill.style.width = size + 'px'; fill.style.height = size + 'px';
      fill.style.left = (x - size / 2) + 'px'; fill.style.top = (y - size / 2) + 'px';
      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(fill);
        gsap.fromTo(fill, { scale: 0, opacity: 0.9 }, { scale: 1, opacity: 1, duration: 0.42, ease: 'power2.out' });
      } else { fill.style.transform = 'scale(1)'; fill.style.opacity = '1'; fill.style.transition = 'transform 0.42s ease, opacity 0.3s ease'; }
    });
    btn.addEventListener('mouseleave', function () {
      if (typeof gsap !== 'undefined') { gsap.killTweensOf(fill); gsap.to(fill, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' }); }
      else { fill.style.transform = 'scale(0)'; fill.style.opacity = '0'; }
    });
    btn.addEventListener('click', function () {
      jjUserMuted = !jjUserMuted;
      if (window.jjAudio) window.jjAudio.muted = jjUserMuted;
      try { sessionStorage.setItem('jjUserMuted', jjUserMuted ? '1' : '0'); } catch (e) {}
      btn.classList.toggle('is-muted', jjUserMuted);
      jjApplyMute();
    });
    jjStartAudioBars(btn);
  }
  jjSetupSoundButton();
  jjApplyMute();
  function setupCTA(el) {
    if (el.querySelector('.jj-cta-fill')) return;
    var fill = document.createElement('div'); fill.className = 'jj-cta-fill';
    el.insertBefore(fill, el.firstChild);
    var textEl = el.querySelector('span, div, p, a') || el;
    el.addEventListener('click', function (e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left, y = e.clientY - rect.top;
      var maxDist = Math.max(Math.hypot(x, y), Math.hypot(rect.width-x, y), Math.hypot(x, rect.height-y), Math.hypot(rect.width-x, rect.height-y));
      var size = maxDist * 2.4;
      var circle = document.createElement('div'); circle.className = 'jj-cta-pink';
      circle.style.cssText = 'width:'+size+'px;height:'+size+'px;left:'+(x-size/2)+'px;top:'+(y-size/2)+'px;';
      el.appendChild(circle);
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(circle, { scale: 0, opacity: 0.9 }, { scale: 1, opacity: 1, duration: 0.42, ease: 'power2.out',
          onComplete: function () {
            textEl.classList.add('jj-alien-text');
            gsap.to(circle, { scale: 0, opacity: 0, duration: 0.35, delay: 0.55, ease: 'power2.in',
              onComplete: function () { textEl.classList.remove('jj-alien-text'); circle.parentNode && circle.parentNode.removeChild(circle); }
            });
          }
        });
      } else { setTimeout(function () { circle.remove(); }, 700); }
    });
  }
  document.querySelectorAll('[data-jj="cta"]').forEach(setupCTA);
  document.querySelectorAll('.enter-link_wrapper').forEach(function (el) { el.setAttribute('data-jj', 'cta'); setupCTA(el); });

  function setupBtn(el) {
    if (el.querySelector('.jj-btn-fill')) return;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    var f = document.createElement('div'); f.className = 'jj-btn-fill';
    el.insertBefore(f, el.firstChild);
    el.addEventListener('pointerdown', function (e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left, y = e.clientY - rect.top;
      var maxDist = Math.max(Math.hypot(x, y), Math.hypot(rect.width - x, y), Math.hypot(x, rect.height - y), Math.hypot(rect.width - x, rect.height - y));
      var size = maxDist * 2.4;
      var c = document.createElement('div'); c.className = 'jj-btn-pink';
      c.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (x - size / 2) + 'px;top:' + (y - size / 2) + 'px;';
      el.appendChild(c);
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(c, { scale: 0, opacity: 0.95 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out',
          onComplete: function () { gsap.to(c, { opacity: 0, duration: 0.4, delay: 0.2, onComplete: function () { c.parentNode && c.parentNode.removeChild(c); } }); }
        });
      } else { setTimeout(function () { c.parentNode && c.parentNode.removeChild(c); }, 800); }
    });
  }
  document.querySelectorAll('.next-section-button').forEach(function (el) { el.setAttribute('data-jj', 'btn'); });
  document.querySelectorAll('[data-jj="btn"]').forEach(setupBtn);
})();

