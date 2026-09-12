document.addEventListener("DOMContentLoaded", function () {
  if (typeof THREE !== "undefined") {
    let scene, camera, renderer, shapes = [], svgPositionX = 0, clock, bgW = 0, bgH = 0;
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
      bgW = width; bgH = height;
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
      // Cached size — reading getBoundingClientRect here forced a layout every frame.
      const width = bgW, height = bgH;
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
      bgW = width; bgH = height;
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
  ambient._src = 'https://cdn.prod.website-files.com/6a19b8f4191d4fbca532591e/6a19b8f4191d4fbca53259a5_Lotro-ambient.mp3';
  /* music themes (jj-score's store): swap the ambient track in place — the new one picks up wherever the old one was in its fade */
  window.jjAudio.swapAmbient = function (src) {
    if (!src || ambient._src === src) return;
    var old = ambient, wasOn = false, vol = 0; try { wasOn = old.playing(); vol = old.volume(); } catch (e) {}
    var n = new Howl({ src: [src], loop: true, volume: 0, html5: false }); n._src = src;
    ambient = n; window.jjAudio.ambient = n; window.jjAudio.sounds.push(n);
    if (wasOn) { n.play(); n.fade(0, window.jjAudio.muted ? 0 : TARGET_VOLUME, 1500); faded = true; }
    try { old.fade(vol, 0, 900); setTimeout(function () { try { old.stop(); old.unload(); } catch (e) {} }, 1000); } catch (e) {}
  };

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

  function begin(delayMs) {
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
    }, delayMs);
  }

  function scheduleBegin() {
    // Homepage with the loader: hold the ambient until the loader reveals, so the
    // sound button shown OVER the loader lets visitors mute before any audio starts.
    var onHome = window.location.pathname.replace(/\/$/, '') === '';
    if (onHome && window.JJLoader && !window.__jjEntranceDone) {
      document.addEventListener('jj:entrance', function () { begin(800); }, { once: true });
    } else {
      begin(AUTO_START_DELAY);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleBegin);
  else scheduleBegin();
})();

/* ===== Menu information rail + hard background interaction lock ===== */
(function () {
  function ready() {
    var wrap = document.querySelector('.menu-wrap');
    var btn = document.querySelector('.menu-container');
    var list = document.querySelector('.menu-wrap .flex-down.left') || document.querySelector('.menu-wrap .flex-down');
    if (!wrap || !btn || !list || document.getElementById('jj-menu-meta')) return;

    var st = document.createElement('style'); st.id = 'jj-menu-polish'; st.textContent =
      'body.jj-menu-open *{pointer-events:none!important}body.jj-menu-open .menu-wrap,body.jj-menu-open .menu-wrap *,body.jj-menu-open .menu-container,body.jj-menu-open .menu-container *,body.jj-menu-open .nav-logo-link,body.jj-menu-open .nav-logo-link *,body.jj-menu-open #jj-sound-btn,body.jj-menu-open #jj-sound-btn *,body.jj-menu-open .audio-container-controller,body.jj-menu-open .audio-container-controller *,body.jj-menu-open #jj-sc-hud,body.jj-menu-open #jj-sc-hud *,body.jj-menu-open #jj-co-nav,body.jj-menu-open #jj-co-nav *{pointer-events:auto!important}' +
      'body.jj-menu-open{overflow:hidden!important}body.jj-menu-open .menu-wrap{isolation:isolate;cursor:default}' +
      '.menu-wrap::before{content:"";position:fixed;inset:0;z-index:-3;background:rgba(4,7,16,.92);-webkit-backdrop-filter:blur(22px);backdrop-filter:blur(22px);pointer-events:none;opacity:0;transition:opacity .9s ease}' +   // the dim + blur eases in behind the wipe, never snaps
      'body.jj-menu-open .menu-wrap::before{opacity:1}' +
      /* Close pressed: everything the menu put on screen — the art, the links, the rail, the moon, the companion card — is gone
         before the circle wipe starts, so the wipe closes over an empty dark room */
      'body.jj-menu-closing .menu-wrap::before{opacity:0!important;transition:opacity .45s ease!important}' +
      'body.jj-menu-closing .menu-wrap .images-row,body.jj-menu-closing .menu-wrap .flex-down,body.jj-menu-closing #jj-menu-meta,body.jj-menu-closing .jjmm-moon,body.jj-menu-closing #jj-co-nav{opacity:0!important;transition:opacity .16s ease!important;pointer-events:none!important}' +
      '.menu-wrap .jjmm-moon{position:fixed;left:25vw;top:-7vh;width:20vw;height:auto;z-index:1;pointer-events:none;opacity:0;transform:scale(.5);transform-origin:50% 55%;filter:drop-shadow(0 0 40px rgba(198,220,255,.45)) drop-shadow(0 0 120px rgba(140,175,255,.28));transition:opacity .12s ease}' +
      '.menu-wrap .jjmm-moon.out{opacity:0!important;animation:none!important;transform:scale(1)!important;transition:opacity .34s ease!important}' +
      'body.jj-menu-open .menu-wrap .jjmm-moon{opacity:1;animation:jjmmMoonIn 2.6s cubic-bezier(.16,1,.3,1) 1.4s both,jjmmMoonGlow 7.5s ease-in-out 4s infinite;transition:opacity 1.1s ease 1.4s}' +
      '@keyframes jjmmMoonIn{from{transform:scale(.5);filter:drop-shadow(0 0 40px rgba(198,220,255,.45)) drop-shadow(0 0 120px rgba(140,175,255,.28));}to{transform:scale(1);filter:drop-shadow(0 0 40px rgba(198,220,255,.45)) drop-shadow(0 0 120px rgba(140,175,255,.28));}}' +
      '@keyframes jjmmMoonGlow{0%,100%{transform:scale(1);filter:drop-shadow(0 0 40px rgba(198,220,255,.45)) drop-shadow(0 0 120px rgba(140,175,255,.28))}50%{transform:scale(1.06);filter:drop-shadow(0 0 95px rgba(220,236,255,.95)) drop-shadow(0 0 230px rgba(150,185,255,.62))}}' +
      '.menu-wrap .flex-down.left,.menu-wrap .flex-down{position:relative;z-index:3}' +   // the menu dims and blurs the page behind it; the preview art (z-index -1) still reads over the top
      '.menu-wrap .menu-hover-image{filter:saturate(1.02)}' +
      '.menu-wrap .images-row{pointer-events:none!important;position:fixed!important;inset:6vh -18vw 5vh 2vw!important;width:auto!important;height:auto!important;display:flex!important;align-items:center!important;gap:1.2vw!important;z-index:-1!important;transform:translateX(0);opacity:.9}' +
      '.menu-wrap .menu-hover-image{pointer-events:none!important;position:relative!important;inset:auto!important;width:36vw!important;height:72vh!important;min-width:36vw!important;object-fit:cover!important;border:1px solid rgba(255,255,255,.28)!important;border-radius:20px!important;clip-path:polygon(10% 0,100% 0,90% 100%,0 100%);transform:rotate(-3deg);box-shadow:0 30px 90px rgba(0,0,0,.55)!important}' +
      '.menu-wrap .menu-hover-image:nth-child(even){transform:rotate(3deg) translateY(4vh)}' +
      '.menu-wrap .flex-down.left,.menu-wrap .flex-down{position:relative;z-index:3}' +
      '.menu-wrap .menu-open-link{position:relative;transition:color .25s ease,text-shadow .25s ease!important}' +
      '.menu-wrap .menu-open-link:hover{color:#fff!important;text-shadow:0 0 28px rgba(255,0,245,.55)}' +
      '.menu-wrap .menu-open-link[aria-current="page"]{color:#fff!important}' +
      '.menu-wrap .menu-open-link[aria-current="page"]>div{position:relative;display:inline-block;padding-left:16px}' +
      '.menu-wrap .menu-open-link[aria-current="page"]>div::before{content:"";position:absolute;left:-8px;top:50%;width:10px;height:10px;border-radius:50%;background:#FF00F5;box-shadow:0 0 16px #FF00F5;transform:translateY(-50%);animation:jjMenuDot 1.6s ease-in-out infinite}@keyframes jjMenuDot{0%,100%{transform:translateY(-50%) scale(1);box-shadow:0 0 10px #FF00F5}50%{transform:translateY(-50%) scale(1.35);box-shadow:0 0 22px #FF00F5,0 0 0 6px rgba(255,0,245,.18)}}' +
      '#jj-menu-meta{position:fixed;left:5vw;right:5vw;top:120px;bottom:4vh;z-index:6;display:block;color:#fff;font-family:"Joes Journey Headline",sans-serif;pointer-events:none!important;opacity:0;transform:translateY(14px);transition:opacity .6s ease,transform .7s cubic-bezier(.22,1,.36,1)}#jj-menu-meta.in{opacity:1;transform:none}' +
      '#jj-menu-meta .jjmm-left{position:absolute;left:50%;bottom:0;transform:translateX(-50%);text-align:center;pointer-events:none!important}' +
      '#jj-menu-meta .jjmm-pct{display:flex;gap:18px;justify-content:center;flex-wrap:wrap;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-top:9px}#jj-menu-meta .jjmm-pct b{color:#fff;font-weight:700}' +
      '#jj-menu-meta .jjmm-theme{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.62);margin-bottom:10px}#jj-menu-meta .jjmm-theme b{color:#fff}' +
      '#jj-menu-meta .jjmm-actions{position:fixed;left:32px;right:auto;bottom:32px;pointer-events:auto!important;display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:flex-start}' +
      '#jj-menu-meta button,#jj-menu-meta a{position:relative;width:52px;height:52px;border-radius:50%;border:1px solid rgba(255,255,255,.65);background:rgba(4,7,14,.62);color:#fff;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;font:700 18px/1 "Joes Journey Headline",sans-serif;cursor:pointer;transition:transform .25s ease,background .25s ease,box-shadow .25s ease}' +
      '#jj-menu-meta a img{width:32px;height:32px;object-fit:contain;transition:opacity .2s ease}#jj-menu-meta a img.f{position:absolute;left:50%;top:50%;translate:-50% -50%;opacity:0}#jj-menu-meta a:hover img.f{opacity:1}#jj-menu-meta a:hover img:not(.f){opacity:0}' +
      '#jj-menu-meta button.wide{width:auto;border-radius:26px;padding:0 18px;gap:9px;font-size:13px;text-transform:uppercase;letter-spacing:.06em}' +
      '#jj-menu-meta button:hover,#jj-menu-meta a:hover{transform:translateY(-4px);background:rgba(255,0,245,.25);box-shadow:0 10px 28px rgba(255,0,245,.28)}' +
      '#jj-menu-meta .jjmm-score{display:flex;gap:8px;align-items:center;justify-content:center;font-size:14px}#jj-menu-meta .jjmm-score img{width:22px;height:22px;object-fit:contain}' +
      'html[data-jj-theme="medieval"] #jj-menu-meta{--jj-accent:#FFC531}html[data-jj-theme="retro"] #jj-menu-meta{--jj-accent:#FFD400}html[data-jj-theme="alien"] #jj-menu-meta{--jj-accent:#4FE3FF}' +
      '#jj-menu-meta .jjmm-left::after{content:"";display:block;margin:12px auto 0;width:110px;height:2px;background:var(--jj-accent,#FF00F5);box-shadow:0 0 12px var(--jj-accent,#FF00F5)}' +
      '@media(max-width:760px){.menu-wrap .images-row{opacity:.36!important}.menu-wrap .menu-hover-image{width:78vw!important;min-width:78vw!important}#jj-menu-meta{left:24px;right:24px;top:100px;bottom:22px}#jj-menu-meta .jjmm-actions{left:0;right:auto;justify-content:flex-start}#jj-menu-meta button.wide{height:46px}}';
    document.head.appendChild(st);

    var moon = document.createElement('img'); moon.className = 'jjmm-moon'; moon.alt = '';
    moon.src = 'data:image/svg+xml;utf8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 200 200%27%3E%3Cdefs%3E%3CradialGradient id=%27o%27%3E%3Cstop offset=%27.52%27 stop-color=%27%23c8d8ff%27 stop-opacity=%27.22%27/%3E%3Cstop offset=%27.78%27 stop-color=%27%23a8c0ff%27 stop-opacity=%27.09%27/%3E%3Cstop offset=%271%27 stop-color=%27%2393aaff%27 stop-opacity=%270%27/%3E%3C/radialGradient%3E%3CradialGradient id=%27i%27%3E%3Cstop offset=%27.42%27 stop-color=%27%23ffffff%27 stop-opacity=%27.5%27/%3E%3Cstop offset=%27.74%27 stop-color=%27%23dbe7ff%27 stop-opacity=%27.3%27/%3E%3Cstop offset=%271%27 stop-color=%27%23c3d4ff%27 stop-opacity=%270%27/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx=%27100%27 cy=%27100%27 r=%27100%27 fill=%27url(%23o)%27/%3E%3Ccircle cx=%27100%27 cy=%27100%27 r=%2772%27 fill=%27url(%23i)%27/%3E%3Ccircle cx=%27100%27 cy=%27100%27 r=%2746%27 fill=%27%23ffffff%27/%3E%3Cellipse cx=%2785%27 cy=%2782%27 rx=%278%27 ry=%277%27 fill=%27%23e6e6ee%27/%3E%3Cellipse cx=%27114%27 cy=%2796%27 rx=%276%27 ry=%275.5%27 fill=%27%23e6e6ee%27/%3E%3Cellipse cx=%2796%27 cy=%27118%27 rx=%279%27 ry=%277.5%27 fill=%27%23e6e6ee%27/%3E%3Cellipse cx=%2776%27 cy=%27107%27 rx=%274.5%27 ry=%274%27 fill=%27%23e6e6ee%27/%3E%3C/svg%3E';
    wrap.appendChild(moon);                                        // the moon itself, over the art and under the links
    var meta = document.createElement('div'); meta.id = 'jj-menu-meta';
    meta.innerHTML = '<div class="jjmm-left"><div class="jjmm-theme">Current theme · <b>Classic</b></div><div class="jjmm-pct"><span class="pa">Achievements <b>0/0</b> · 0%</span><span class="ps">Store <b>0/0</b> · 0%</span></div></div><div class="jjmm-actions"><a href="mailto:jackson.laptop95@gmail.com" aria-label="Email Joe" data-cursor="external"><img src="https://cdn.jsdelivr.net/gh/jacksonlaptop/joes-journey-code@main/icon-mail.webp" alt=""><img class="f" src="https://cdn.jsdelivr.net/gh/jacksonlaptop/joes-journey-code@main/icon-mail-fill.webp" alt=""></a><a href="https://www.linkedin.com/in/joseph-jackson-ui/" target="_blank" rel="noopener" aria-label="Joe on LinkedIn" data-cursor="external"><img src="https://cdn.jsdelivr.net/gh/jacksonlaptop/joes-journey-code@main/icon-linkedin.webp" alt=""><img class="f" src="https://cdn.jsdelivr.net/gh/jacksonlaptop/joes-journey-code@main/icon-linkedin-fill.webp" alt=""></a><a href="/contact" aria-label="Joe on WhatsApp" data-cursor="external"><img src="https://cdn.jsdelivr.net/gh/jacksonlaptop/joes-journey-code@main/icon-phone.webp" alt=""><img class="f" src="https://cdn.jsdelivr.net/gh/jacksonlaptop/joes-journey-code@main/icon-phone-fill.webp" alt=""></a></div>';
    wrap.appendChild(meta);

    function update() {
      var score = window.jjScore, key = score ? score.theme() : (document.documentElement.getAttribute('data-jj-theme') || 'classic');
      var names = { classic:'Classic', medieval:'Medieval', retro:'Retro', alien:'Space', mixed:'Special' };
      meta.querySelector('.jjmm-theme b').textContent = names[key] || 'Classic';
      var pct = function (n, t) { return t ? Math.round(n / t * 100) : 0; };
      try { var A = score && score.ACH ? score.ACH : [], ad = A.filter(function (a) { return score.has(a.id); }).length;
        meta.querySelector('.pa').innerHTML = 'Achievements <b>' + ad + '/' + A.length + '</b> · ' + pct(ad, A.length) + '%'; } catch (e) {}
      try { var c = window.jjCompanion && window.jjCompanion.count ? window.jjCompanion.count() : null;
        if (c) meta.querySelector('.ps').innerHTML = 'Store <b>' + c.own + '/' + c.total + '</b> · ' + pct(c.own, c.total) + '%'; } catch (e) {}

      Array.prototype.forEach.call(list.querySelectorAll('a[href]'), function (a) {
        var p; try { p = new URL(a.href, location.href).pathname.replace(/\/$/,'') || '/'; } catch(e) { return; }
        var here = location.pathname.replace(/\/$/,'') || '/'; if (p === here && !/credits=1/.test(a.href)) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
      });
    }
    function closeThen(fn) { if (document.body.classList.contains('jj-menu-open')) btn.click(); setTimeout(fn, 180); }

    function visible() { var c = getComputedStyle(wrap), r = wrap.getBoundingClientRect(); return r.width > 2 && r.height > 2 && c.display !== 'none' && c.visibility !== 'hidden' && parseFloat(c.opacity || 1) > .02; }
    var inT = null;
    /* The moon leaves by fading, never by shrinking: pin its current size inline before the
       body.jj-menu-open rule (and with it the grow animation) is taken away. */
    var moonClosing = false;                                       // Close has been pressed: the menu is still fading out, so don't let sync() bring the moon back
    function moonOut() { moonClosing = true; if (moon.classList.contains('out')) return; moon.style.transform = 'scale(1)'; moon.classList.add('out'); }
    function moonIn() { moon.classList.remove('out'); moon.style.transform = ''; }
    function sync() { var on = visible(); if (!on) { moonOut(); moonClosing = false; document.body.classList.remove('jj-menu-closing'); } document.body.classList.toggle('jj-menu-open', on); meta.style.display = on ? 'flex' : 'none'; if (on) update();
      if (on && !moonClosing) moonIn();
      if (on) { if (!meta.classList.contains('in') && !inT) inT = setTimeout(function () { inT = null; meta.classList.add('in'); }, 1150); } else { clearTimeout(inT); inT = null; meta.classList.remove('in'); }
      if (on !== sync._was) { sync._was = on; try { window.dispatchEvent(new Event(on ? 'jj:menu:open' : 'jj:menu:close')); } catch (e) {} } }   // NOT jj:score:pause — that pauses the global GSAP timeline, which is what animates this menu   // the rail is the LAST thing to arrive: after the links have staggered in
    meta.style.display = 'none'; btn.addEventListener('click', function () {
      if (document.body.classList.contains('jj-menu-open')) { moonOut(); document.body.classList.add('jj-menu-closing'); }   // Close: the room empties first, then the wipe
      else document.body.classList.remove('jj-menu-closing');
      setTimeout(sync, 80); setTimeout(sync, 700); setTimeout(sync, 1400); });
    document.addEventListener('keydown', function (e) {           // Esc opens and closes the menu anywhere on the site (unless a modal has the keyboard)
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || '')) return;
      if (document.body.classList.contains('jj-modal-open') && !document.body.classList.contains('jj-menu-open')) return;
      e.preventDefault(); btn.click(); });
    document.addEventListener('wheel', function (e) { if (document.body.classList.contains('jj-menu-open') && !(e.target.closest && e.target.closest('.menu-wrap'))) e.preventDefault(); }, { passive:false, capture:true });
    document.addEventListener('touchmove', function (e) { if (document.body.classList.contains('jj-menu-open') && !(e.target.closest && e.target.closest('.menu-wrap'))) e.preventDefault(); }, { passive:false, capture:true });
    new MutationObserver(sync).observe(wrap, { attributes:true, attributeFilter:['class','style'] });
    window.addEventListener('jj:score', update); setInterval(function () { if (document.body.classList.contains('jj-menu-open')) { sync(); update(); } }, 500);   // re-check visibility too: a Themes/Store click closes the menu without a class change we can see
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
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
    { time: 0,     text: 'Long, long ago, in a land far away…' },
    { time: 5950,  text: 'all things were born in a single flash of light,' },
    { time: 9950,  text: 'and from it, a wizard came to be.' },
    { time: 14900, text: 'Often he would turn his gaze to the stars,' },
    { time: 18550, text: 'wondering if they were doorways into another world.' },
    { time: 22950, text: 'Poetic, indeed.' },
    { time: 25000, text: 'But what if something beyond them gazed back upon us?' },
    { time: 29900, text: null }

  ];


  if (audioTrigger) {
    audioTrigger.addEventListener('click', function playAudio() {
      // Cross the seek under a fade so there's no audible jump: fade the current loop out over 5s, then
      // (silently) seek to 0:37.1 and fade back in over 24.9s — the track reaches 1:02 at full volume
      // exactly when the scroll unlocks (~29.9s after click, end of the wizard speech).
      // 37.1 + 24.9 = 62s;  5 + 24.9 = 29.9s.
      var amb = window.jjAudio.ambient;
      var ambBack = window.jjAudio.ambientTarget || 0.6;
      window.jjAudio.takeover = true; // we drive the ambient from here — stop the autoplay-fallback touching it
      if (amb) {
        if (!amb.playing()) amb.play();
        amb.fade(amb.volume(), 0, 5000);
        setTimeout(function () {
          amb.volume(0);             // force silence FIRST so the seek (and any seek-pop) is inaudible
          try { amb.seek(37.1); } catch (e) {}
          amb.fade(0, ambBack, 24900);
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
        // Hosted as a Webflow asset — raw.githack refuses to serve mp3s (403).
        src: ['https://cdn.prod.website-files.com/6a19b8f4191d4fbca532591e/6a7ce4c53f264355f46a1d4e_wizard-speech.mp3'],
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
      // Short fade — this take starts speaking immediately, so a 3s ramp would swallow "Long, long ago".
      const speechId = speech.play();
      speech.fade(0, 0.8, 1200, speechId);

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

  /* The Joe's Journey title is a Rive with a Webflow interaction on it, so it autoplays and
     fades itself in the moment the page loads — under the loader, finished before anyone sees it.
     Hold it at frame one with a class Webflow can't override, and stop the state machine as soon
     as the instance exists; jjStartIntroRive below is what actually lets it play. */
  (function holdIntroRive() {
    var st = document.createElement('style');
    st.textContent = 'html:not(.jj-rive-go) .rive{opacity:0!important}';
    (document.head || document.documentElement).appendChild(st);
    var n = 0;
    (function grab() {
      var pl = window.Webflow && Webflow.require && Webflow.require('rive');
      var el = document.querySelector('.rive');
      var inst = pl && el && pl.getInstance(el);
      if (inst && inst.rive) { try { inst.rive.stop(); } catch (e) {} return; }
      if (++n < 60) setTimeout(grab, 200);
    })();
  })();

  function jjStartIntroRive() {
    document.documentElement.classList.add('jj-rive-go');
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

    if (!window.jjFlyerIn) jjStartFlyRive();   // the local flyer (homepage-footer.js) replaces the Rive blob
    var overlay   = document.querySelector('.joes-journey-overlay');
    var introSec  = document.querySelector('.intro-section');
    var introWrap = document.querySelector('.intro-reveal_wrapper');
    var sticky    = document.querySelector('.sticky-scroll-wrapper');
    var nextBtn   = document.querySelector('.next-section-button');
    if (introWrap) introWrap.style.display = 'none';
    // setTimeout instead of gsap `delay`: gsap's delayed tweens ride the rAF ticker,
    // which stalls when the tab is unfocused — the speech choreography (setTimeout-
    // based) then runs while these fades never fire, leaving the JoesJourney overlay
    // stuck over the revealed page. Wall-clock timers keep both on the same clock.
    setTimeout(function () {
      if (overlay)  gsap.to(overlay,  { opacity: 0, duration: 1.0, onComplete: function () { overlay.style.pointerEvents = 'none'; } });
      if (introSec) gsap.to(introSec, { opacity: 0, duration: 1.0, onComplete: function () { introSec.style.pointerEvents = 'none'; } });
      if (sticky)   gsap.to(sticky,   { opacity: 1, duration: 3.5 });
    }, 13000);
    setTimeout(function () {
      if (nextBtn) gsap.to(nextBtn, { opacity: 1, duration: 0.5 });
    }, 16500);

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

    if (btn) {
      btn.addEventListener('click', function (e) { e.preventDefault(); revealPage(); });
    }

    function runEntrance() {
      // Everything gated on jj:entrance (intro.js timelines, the landing alien in
      // homepage-footer.js) starts counting from here instead of page load.
      window.__jjEntranceDone = true;
      document.dispatchEvent(new CustomEvent('jj:entrance'));
      if (topPanel && botPanel && typeof gsap !== 'undefined') {
        gsap.to(topPanel, { y: -5000, duration: 1.4, ease: 'power2.inOut', delay: 0.2 });
        gsap.to(botPanel, { y:  5000, duration: 1.4, ease: 'power2.inOut', delay: 0.2 });
        if (introWrapper) {
          gsap.to(introWrapper, { opacity: 0, duration: 0.3, delay: 1.3, onComplete: function () { introWrapper.style.display = 'none'; } });
        }
      }
      setTimeout(jjStartIntroRive, 6000);
    }

    // First-entrance loader (jj-loader.js, 'scroll' variant — galloping knight-Joe).
    // Measures the real bytes of everything that makes the intro stutter — the Rive
    // files, the Big Bang cast (philosopher/wizard + alien sprites), the wizard
    // speech — and reveals only when downloaded + decoded. No loader script = no gate.
    var WF1 = 'https://cdn.prod.website-files.com/6a19b8f4191d4fbca532591e/';
    var WF2 = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/';
    var GH  = 'https://cdn.jsdelivr.net/gh/jacksonlaptop/joes-journey-code@main/';
    /* HEAVY = only what the LANDING itself needs, so the loader is short. Everything the
       Big Bang and the scenes after "Click to begin" need is in LATER, fetched quietly
       from the moment the landing appears — the visitor is reading the title and waiting
       on the CTA for ~7s, which is more than enough time. */
    var HEAVY = [
      WF1 + '6a19b8f4191d4fbca532592c_rive-animation.riv',      // the Joe's Journey title
      WF1 + '6a19b8f4191d4fbca532593b_Waves.riv',               // landing backdrop
      WF1 + '6a19b8f4191d4fbca5325935_Bigbang.riv'              // tiny, and it fires the instant the CTA is clicked
    ];
    var LATER = [
      WF1 + '6a19b8f4191d4fbca5325984_code-loop.riv',
      WF1 + '6a19b8f4191d4fbca5325938_rocket-2.riv',
      WF1 + '6a19b8f4191d4fbca5325956_Roads-new.riv',
      WF1 + '6a19b8f4191d4fbca532595e_mars-2.riv',
      WF1 + '6a7ce4c53f264355f46a1d4e_wizard-speech.mp3',
      GH + 'bb-wizard.webm',                                   // the Big Bang wizard (was the two philosopher SVGs)
      WF2 + '6a0d815469fc93c75834b57d_Spright%20top%20right.svg',
      WF2 + '6a0d8154cab30401d9e344dd_Sprite%20top%20left.svg',
      WF2 + '6a0d8154e295fd12e49f8f0e_Sprite%20top%20middle.svg',
      WF2 + '6a1020606c5b65a83f63a171_sassy%20boy%201.svg',
      WF2 + '6a102060d6130fe4145e128e_happy%20boy.svg',
      'https://cdn.prod.website-files.com/615edb5c549d52cd108ed268/6718f10874b12a196e30db11_Starry%20Board.svg',
      // doorway beat (homepage-footer.js spawnDoorway) — lottie json + world glimpses
      GH + 'arch-still.webp', GH + 'arch-hole.png', GH + 'world-tavern.webp', GH + 'world-village.webp', GH + 'world-woods.webp', GH + 'world-cave.webp',
      GH + 'story-vil-bg.webp',
      GH + 'story-wood-bg.webp',
      GH + 'story-cas-bg.webp'
    ];
    document.addEventListener('jj:entrance', function () {
      LATER.forEach(function (u, i) { setTimeout(function () { fetch(u, { mode: 'no-cors', cache: 'force-cache' }).catch(function () {}); }, i * 120); });
    }, { once: true });
    if (window.JJLoader) {
      JJLoader.start({
        variant: 'precam',    // dark moon-window scene, rolling jelly precam guy (see page-loader README)
        assets: HEAVY,
        body:  GH + 'blob-body.webp',
        eye:   GH + 'blob-eye.webp',
        grass: GH + 'loader-grass.webp',
        minTime: 2800,   // the show always plays at least this long (anti-snap); the reveal now costs ~.76s of its own, so this came down to keep the total the same
        maxWait: 20000,  // hard safety — never traps the visitor
        decode: true,
        onReady: runEntrance
      });
    } else {
      runEntrance();
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
  if (window.__jjCursor) el.style.display = 'none';   // cursor.js (the stardust one) owns the pointer
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
    if (t.closest('a, button, [role="button"], [data-cursor], [data-jj="cta"], [data-jj="btn"], .enter-link_wrapper, .jj-poke-sprite, #jj-sitting-alien, label, input, select, textarea')) { setState('hover'); return; }
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

/* Site-wide: make the footer + menu "Contact" and "Credits" links work on every page.
   Contact  -> /contact
   Credits  -> /contact?credits=1   (the contact page auto-plays the credits sequence on arrival)
   On /contact itself, contact.js does the richer wiring (launch credits in place), so we stay out of its way there. */
(function () {
  function onContactPage() { return /(^|\/)contact\/?$/.test(location.pathname); }
  function labelOf(el) { return (el.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function isCredits(t) { return /\bcredits\b/.test(t); }   // "Credits", "View Credits", etc.

  function wireMenuLinks() {
    if (onContactPage()) return;
    try {
      var links = document.querySelectorAll('a');
      for (var i = 0; i < links.length; i++) {
        var a = links[i];
        if (a._jjMenuWired) continue;
        var t = labelOf(a);
        if (isCredits(t)) {
          a._jjMenuWired = 1;
          a.setAttribute('href', '/contact?credits=1');
        } else if (t === 'contact') {
          var h = a.getAttribute('href');
          if (!h || h === '#' || h === '') { a._jjMenuWired = 1; a.setAttribute('href', '/contact'); }
        }
      }
    } catch (e) {}
  }

  // Bulletproof: whatever the Credits control's tag or href, a plain left-click forces the param through
  // (so the contact page sees ?credits=1 and auto-plays the sequence). Cmd/middle-click still uses the href above.
  document.addEventListener('click', function (e) {
    if (onContactPage()) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var el = e.target && e.target.closest ? e.target.closest('a, button, [role="button"], .w-inline-block, .w-nav-link') : null;
    if (el && el.closest('#jj-ach, #jj-sc-hud, .jj-tmenu, #jj-first, #jj-co')) return;   // the score UI mentions "Credits Complete" — that is not the Credits link
    if (el && isCredits(labelOf(el))) { e.preventDefault(); location.href = '/contact?credits=1'; }
  }, true);

  function run() { wireMenuLinks(); setTimeout(wireMenuLinks, 1200); setTimeout(wireMenuLinks, 3000); setTimeout(wireMenuLinks, 6000); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();


/* ===== Back: the project picker and every case study get a way back (picker → home, case study → picker).
   The classic glass pill — 50% white border, black .4 + blur, wipe hover, pink press — under the logo. ===== */
(function () {
  var path = location.pathname.replace(/\/+$/, '');
  if (!/^\/case-studies(\/|$)/.test(path)) return;
  var toPicker = path !== '/case-studies';
  var st = document.createElement('style');
  st.textContent = '#jj-back{position:fixed;left:32px;top:112px;z-index:9000;display:inline-flex;align-items:center;gap:8px;padding:11px 18px 11px 14px;border-radius:999px;' +
      'border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.4);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:#fff;text-decoration:none;' +
      'font-size:11px;letter-spacing:.14em;text-transform:uppercase;overflow:hidden;isolation:isolate;opacity:0;transform:translateY(-6px);transition:opacity .6s ease .9s,transform .6s ease .9s;}' +
    '#jj-back.in{opacity:1;transform:none;}' +
    '#jj-back::before{content:"";position:absolute;inset:0;background:rgba(255,255,255,.5);transform:translateX(-101%);transition:transform .35s cubic-bezier(.2,.7,.3,1);z-index:-1;}' +
    '#jj-back:hover::before{transform:none;}#jj-back:active{background:#FF00F5;border-color:#FF00F5;}' +
    '#jj-back svg{width:14px;height:14px;display:block;}' +
    'body.jj-modal-open #jj-back,body.jj-menu-open #jj-back{opacity:0;pointer-events:none;transition:opacity .2s ease;}';
  document.head.appendChild(st);
  var a = document.createElement('a'); a.id = 'jj-back'; a.href = toPicker ? '/case-studies' : '/'; a.setAttribute('data-cursor', 'hover'); a.setAttribute('data-jj', 'btn');
  a.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3 5 8l5 5"/></svg><span>' + (toPicker ? 'All projects' : 'Back') + '</span>';
  function mount() { if (document.body) { document.body.appendChild(a); setTimeout(function () { a.classList.add('in'); }, 400); } else setTimeout(mount, 50); }
  mount();
})();

/* ===== Super menu: Storytime link + interactive overhaul =====
   Site-wide. Takes over the open-menu behavior injected by the Webflow embed:
   the original links are clone-replaced (strips the embed's listeners), a
   Storytime link is added, each link gets its own preview image (repo art via
   raw.githack), and the package gains: hieroglyph scramble on hover, magnetic
   pull, staggered entrance + scramble sweep when the menu opens, and a peeking
   alien. The Menu/Close button hover embed is left untouched. */
(function () {
  var GH = window.JJ_SCORE_BASE || 'https://cdn.jsdelivr.net/gh/jacksonlaptop/joes-journey-code@main/';   // JJ_SCORE_BASE: the local preview serves the staged art
  var IMGS = {                                     // the user's menu art (jj-menu-*.png, keyed to menu-*.webp)
    'home': GH + 'menu-home.webp',
    'work': GH + 'menu-work.webp',
    'storytime': GH + 'menu-story.webp',
    'part two': GH + 'menu-part2.webp',
    'contact': GH + 'menu-contact.webp',
    'credits': GH + 'menu-credits.webp'
  };
  var GLYPHS = 'abcdefghijklmnopqrstuvwxyz<>-_\\/[]{}=+*^?#'.split('');

  function init() {
    var wrap = document.querySelector('.menu-wrap');
    var list = document.querySelector('.flex-down.left') || document.querySelector('.flex-down');
    if (!wrap || !list || typeof gsap === 'undefined') return;
    if (list._jjSuper) return;
    list._jjSuper = true;

    // Storytime link (after Work) + real hrefs on the dead ones
    var orig = Array.prototype.slice.call(list.querySelectorAll('.menu-open-link'));
    if (!orig.some(function (a) { return /storytime/i.test(a.textContent); })) {
      var work = null;
      orig.forEach(function (a) { if (/work/i.test(a.textContent)) work = a; });
      var st = document.createElement('a');
      st.href = '/storytime';
      st.className = 'menu-open-link w-inline-block';
      st.innerHTML = '<div>Storytime</div>';
      if (work && work.nextSibling) list.insertBefore(st, work.nextSibling);
      else list.appendChild(st);
    }
    /* Part Two of the tale: always listed, disabled with a lock until the 'tale2' achievement (the tale, then the quiz); a locked click opens that achievement.
       The super menu below clones every link, so nothing here holds a reference — the lock is re-found by class and the click is delegated. */
    if (!list.querySelector('.jj-tale2')) {
      var p2 = document.createElement('a'); p2.href = '/storytime?part=2'; p2.className = 'menu-open-link w-inline-block jj-tale2 locked'; p2.innerHTML = '<div><span class="jjmm-new">New!</span>Part Two</div>';
      var stl = Array.prototype.slice.call(list.querySelectorAll('.menu-open-link')).filter(function (a) { return /storytime/i.test(a.textContent); })[0];
      if (stl && stl.nextSibling) list.insertBefore(p2, stl.nextSibling); else list.appendChild(p2);
      var lockSt = document.createElement('style'); lockSt.textContent = '.menu-wrap .jj-tale2{position:relative;}.menu-wrap .jj-tale2.locked{opacity:.45;cursor:not-allowed;}.menu-wrap .jj-tale2.locked *{cursor:not-allowed;}.menu-wrap .jj-tale2 .jjmm-new{display:none;font-family:inherit;font-size:14px;line-height:1;font-weight:700;letter-spacing:.12em;text-transform:uppercase;vertical-align:middle;margin-right:14px;padding:7px 12px 6px;border-radius:999px;background:var(--jj-pill,#FF00F5);border:0;color:var(--jj-pill-ink,#fff);box-shadow:0 0 18px var(--jj-pill-glow,rgba(255,0,245,.45));}html[data-jj-theme="medieval"] .menu-wrap,html[data-jj-theme="mixed"] .menu-wrap{--jj-pill:#FFC531;--jj-pill-ink:#3a2a12;--jj-pill-glow:rgba(255,197,49,.45);}html[data-jj-theme="retro"] .menu-wrap{--jj-pill:#FFD400;--jj-pill-ink:#0b1e5a;--jj-pill-glow:rgba(255,212,0,.45);}html[data-jj-theme="alien"] .menu-wrap{--jj-pill:#4FE3FF;--jj-pill-ink:#08111f;--jj-pill-glow:rgba(79,227,255,.45);}.menu-wrap .jj-tale2.fresh .jjmm-new{display:inline-block;}.menu-wrap .jj-tale2.locked:hover{color:inherit!important;text-shadow:none!important;}' +
        '.menu-wrap .jj-tale2.locked>div{position:relative;display:inline-block!important;}.menu-wrap .jj-tale2.locked>div::after{content:"";position:absolute;left:100%;top:50%;transform:translateY(-50%);margin-left:.4em;width:.55em;height:.55em;background:url("data:image/svg+xml;utf8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%272.4%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Crect x=%274%27 y=%2710.5%27 width=%2716%27 height=%2711%27 rx=%272.5%27/%3E%3Cpath d=%27M7.5 10.5V7.5a4.5 4.5 0 0 1 9 0v3%27/%3E%3C/svg%3E") center/contain no-repeat;}';
      document.head.appendChild(lockSt);
    }
    window.jjSyncTale2 = function () { var ok = !!(window.jjScore && window.jjScore.has && window.jjScore.has('tale2'));
      var seen = false; try { seen = localStorage.getItem('jjTale2Seen') === '1'; } catch (e) {}
      document.querySelectorAll('.jj-tale2').forEach(function (a) { a.classList.toggle('fresh', ok && !seen); a.classList.toggle('locked', !ok); a.setAttribute('aria-disabled', ok ? 'false' : 'true'); if (ok) a.removeAttribute('data-cursor'); else a.setAttribute('data-cursor', 'none'); }); };
    window.jjSyncTale2(); window.addEventListener('jj:score', window.jjSyncTale2); setTimeout(window.jjSyncTale2, 1500); setTimeout(window.jjSyncTale2, 4000);
    document.addEventListener('click', function (e) { var a = e.target && e.target.closest && e.target.closest('.jj-tale2'); if (!a) return; window.jjSyncTale2();
      if (!a.classList.contains('locked')) { try { localStorage.setItem('jjTale2Seen', '1'); } catch (x) {} window.jjSyncTale2(); return; }
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); var b = document.querySelector('.menu-container'); if (b && document.body.classList.contains('jj-menu-open')) b.click(); setTimeout(function () { if (window.jjScore) window.jjScore.goto('tale2'); }, 260); }, true);
    Array.prototype.forEach.call(list.querySelectorAll('.menu-open-link'), function (a) {
      var t = (a.textContent || '').trim().toLowerCase();
      if (t === 'contact') a.setAttribute('href', '/contact');
      if (t === 'credits') a.setAttribute('href', '/contact?credits=1');
    });

    // Clone-replace links: strips the Webflow embed's hover listeners so we own the show
    var links = [];
    Array.prototype.slice.call(list.querySelectorAll('.menu-open-link')).forEach(function (a) {
      var c = a.cloneNode(true);
      a.parentNode.replaceChild(c, a);
      links.push(c);
    });

    // One preview image per link (the embed's old nodes are discarded with the row content)
    var row = document.querySelector('.images-row');
    var imgs = [];
    if (row) {
      var proto = row.querySelector('.menu-hover-image');
      var defaultSrc = proto ? proto.getAttribute('src') : '';
      row.innerHTML = '';
      links.forEach(function (a) {
        var im = document.createElement('img');
        im.className = 'menu-hover-image';
        im.alt = '';
        var key = (a.querySelector('.jjmm-new') ? a.textContent.replace(a.querySelector('.jjmm-new').textContent, '') : a.textContent || '').trim().toLowerCase();
        im.src = IMGS[key] || defaultSrc;
        row.appendChild(im);
        imgs.push(im);
      });
    }

    // The luxury cascade, rebuilt for N links
    function setActive(activeIdx) {
      imgs.forEach(function (img, idx) {
        var dist = Math.abs(idx - activeIdx);
        var dir = idx < activeIdx ? -1 : 1;
        gsap.to(img, {
          opacity: idx === activeIdx ? 1 : 0.17,
          y: idx === activeIdx ? 0 : dist * 140,
          rotateZ: idx === activeIdx ? 0 : dist * 3 * dir,
          scale: idx === activeIdx ? 1.08 : 0.94,
          duration: 0.8, delay: dist * 0.03, ease: 'power3.inOut', overwrite: 'auto'
        });
      });
    }

    // Hieroglyph scramble: letters flicker through alien glyphs, settle left to right
    function prepChars(a) {
      var d = a.querySelector('div');
      if (!d) return null;
      if (d._jjChars) return d._jjChars;
      var pill = d.querySelector('.jjmm-new');                     // the Part Two pill is a real node, not letters — keep it out of the scramble
      var text = (pill ? d.textContent.replace(pill.textContent, '') : d.textContent).trim();
      d.textContent = '';
      if (pill) d.appendChild(pill);
      d._jjChars = text.split('').map(function (ch) {
        var s = document.createElement('span');
        s.textContent = ch;
        s._orig = ch;
        s.style.display = 'inline-block';
        s.style.whiteSpace = 'pre';
        d.appendChild(s);
        return s;
      });
      return d._jjChars;
    }
    function scramble(a) {
      var chars = prepChars(a);
      if (!chars) return;
      chars.forEach(function (s, idx) {
        var flicks = 0, max = 2 + Math.round(Math.random() * 3);
        clearInterval(s._t);
        s._t = setInterval(function () {
          if (flicks++ >= max) {
            s.textContent = s._orig;
            s.style.fontFamily = '';
            clearInterval(s._t);
            return;
          }
          s.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
          s.style.fontFamily = 'var(--jj-alien-font, monospace)';
        }, 45 + idx * 9);
      });
    }

    /* Resting state: with the pointer off the links the whole strip drops away and the
       last-hovered scene takes a 20% black wash, so it reads as "nothing selected" but still shows where you were. */
    var curIdx = 0, idleOn = false, idleT = null;
    function setIdle(on) {
      if (on === idleOn) return;
      idleOn = on;
      if (row) gsap.to(row, { yPercent: on ? 15 : 0, duration: 0.85, ease: 'power3.inOut' });
      imgs.forEach(function (img, idx) {
        gsap.to(img, { filter: 'saturate(1.02) brightness(' + (on && idx === curIdx ? 0.8 : 1) + ')', duration: 0.5, ease: 'power2.out' });
      });
    }
    // The menu always opens in the resting state (art low, last-hovered scene dimmed) until the pointer finds a link
    window.addEventListener('jj:menu:open', function () { idleOn = false; if (row) gsap.set(row, { yPercent: 0 }); setTimeout(function () { setIdle(true); }, 1200); });
    var mwrap = document.querySelector('.menu-wrap');
    if (mwrap) mwrap.addEventListener('mousemove', function (e) {
      var over = e.target && e.target.closest && e.target.closest('.menu-open-link');
      if (over) { clearTimeout(idleT); idleT = null; setIdle(false); }
      else if (!idleT) idleT = setTimeout(function () { idleT = null; setIdle(true); }, 140);
    });

    links.forEach(function (a, i) {
      a.style.willChange = 'transform';
      a.addEventListener('mouseenter', function () {
        if (a.classList.contains('locked')) return;
        clearTimeout(idleT); idleT = null;
        curIdx = i; setIdle(false);
        if (row) gsap.to(row, { x: (-i * 42) + 'vw', duration: 1.0, ease: 'power3.inOut' });
        setActive(i);
        scramble(a);
      });
      // Magnetic pull toward the cursor; elastic snap home on leave
      a.addEventListener('mousemove', function (e) {
        if (a.classList.contains('locked')) return;
        var r = a.getBoundingClientRect();
        gsap.to(a, {
          x: (e.clientX - (r.left + r.width / 2)) * 0.18,
          y: (e.clientY - (r.top + r.height / 2)) * 0.3,
          duration: 0.4, ease: 'power2.out'
        });
      });
      a.addEventListener('mouseleave', function () {
        gsap.to(a, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.45)' });
      });
    });
    setActive(0);

    // Peeking alien: pops up from the bottom edge a beat after the menu opens
    var SPRITE = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a0d8154f8c9d157143146cf_Sprite%20bottom%20middle.svg';
    var peeker = null;
    function peek() {
      if (peeker) return;
      peeker = document.createElement('img');
      peeker.src = SPRITE;
      peeker.style.cssText = 'position:fixed;bottom:0;left:8vw;width:130px;height:auto;z-index:10000;pointer-events:auto;transform:translateY(100%);transition:transform 0.9s cubic-bezier(0.34,1.56,0.64,1);';
      peeker.addEventListener('click', function () { hidePeek(); });
      document.body.appendChild(peeker);
      requestAnimationFrame(function () { peeker.style.transform = 'translateY(24%)'; });
    }
    function hidePeek() {
      if (!peeker) return;
      var p = peeker;
      peeker = null;
      p.style.transition = 'transform 0.45s cubic-bezier(0.5,0,0.75,0)';
      p.style.transform = 'translateY(100%)';
      setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 500);
    }

    // Menu-open detection: entrance stagger + scramble sweep + alien
    var menuBtn = document.querySelector('.menu-container');
    var isOpen = false;
    function menuVisible() {
      return wrap.offsetParent !== null && getComputedStyle(wrap).display !== 'none' && getComputedStyle(wrap).opacity !== '0';
    }
    if (menuBtn) {
      menuBtn.addEventListener('click', function () {
        setTimeout(function () {
          var vis = menuVisible();
          if (vis && !isOpen) {
            isOpen = true;
            gsap.fromTo(links,
              { y: 46, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: 'power3.out', clearProps: 'opacity' });
            links.forEach(function (a, i) { setTimeout(function () { scramble(a); }, 120 + i * 90); });
            if (row && row.parentNode) {
              gsap.fromTo(row.parentNode, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' });
            }
            idleOn = false; if (row) gsap.set(row, { yPercent: 0 }); setTimeout(function () { setIdle(true); }, 1100);
            setTimeout(function () { if (isOpen) peek(); }, 900);
          } else if (!vis) {
            isOpen = false;
            hidePeek();
          }
        }, 120);
      });
    }
    // Safety: if the menu is closed by any other path, retire the alien and reset
    setInterval(function () {
      if (isOpen && !menuVisible()) { isOpen = false; hidePeek(); }
    }, 700);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* Speech subtitles sit in the middle of the screen (where the "Hey I'm Joe" headline lives), not at the foot. */
(function () { var st = document.createElement('style'); st.id = 'jj-sub-centre';
  st.textContent = '#jj-subtitle{top:50%!important;bottom:auto!important;transform:translate(-50%,-50%)!important;width:86%!important;max-width:980px!important;font-size:clamp(26px,3.6vw,58px)!important;line-height:1.15!important;font-weight:700;}';
  (document.head || document.documentElement).appendChild(st); })();
