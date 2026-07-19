/* ============================================================================
   Joe's Journey — "My Story" scrollable timeline  (hosted via GitHub + raw.githack)

   The section AFTER the storytime intro: 16 steps × 100vh, six eras.
   Builds everything itself: the 16 sections, the LEFT year-ruler (slides out,
   tracks scroll, year lights up), the era header (top-left, evolution icons),
   the NEXT ↓ button, and the bottom era anchor nav (click = scroll to era).

   WEBFLOW: load before </body> on the Storytime page (after storytime.js):
     <script src="https://raw.githack.com/jacksonlaptop/joes-journey-code/main/mystory.js?v=1"></script>
   It appends itself to <body> (or to #jj-mystory-mount if that div exists).
   All copy/eras/years live in the CONFIG below.
   ============================================================================ */
(function () {
  window.JJ_MYSTORY_BUILD = 'M8 · cinematic Big Bang: void → singularity → detonation';
  try { console.log('%c[JJ] mystory.js build: ' + window.JJ_MYSTORY_BUILD, 'color:#FF00F5;font-weight:bold'); } catch (e) {}

  var GB = 'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/';
  function EVO(n) { return GB + 'joe-evo-' + n + '.webp'; }

  /* ---------------- CONFIG — every word of the story ---------------- */
  /* The full evolution sprite line (design order). Slots marked TEMP reuse the nearest
     available creature until the real sprite is exported from Figma — just swap the URL. */
  var SPRITES = [
    EVO(1),          // 1 amoeba
    EVO(2),          // 2 fish
    EVO(3),          // 3 blob-walker
    EVO(4),          // 4 ape
    EVO(5),          // 5 caveman
    EVO(5),          // 6 traveller        TEMP — export from Figma
    EVO(5),          // 7 roman            TEMP — export from Figma
    EVO(5),          // 8 peasant          TEMP — export from Figma
    EVO(5),          // 9 robed scholar    TEMP — export from Figma
    EVO(6),          // 10 knight on horse (using the loader knight)
    EVO(7),          // 11 painter         TEMP — export from Figma
    EVO(7),          // 12 scholar w/paper TEMP — export from Figma
    EVO(7),          // 13 modern Joe
    EVO(7),          // 14 scientist       TEMP — export from Figma
    EVO(7)           // 15 astronaut       TEMP — export from Figma
  ];
  /* icons per era, EXACTLY as the design frames: first = active (big + 100%), rest = the
     upcoming evolution, ghosted with size/opacity falloff */
  var ERAS = [
    { nav: 'Precambrian', title: 'Precambrian Era', ages: 'Ages 1 – 12', years: [1995.87, 2008], icons: [1, 2, 3] },
    { nav: 'Prehistoric', title: 'Prehistoric Age', ages: 'Ages 13 – 18', years: [2009, 2014], icons: [4, 5] },
    { nav: 'Ancient', title: 'Ancient Era', ages: 'Ages 19 – 20', years: [2015, 2016], icons: [6, 7] },
    { nav: 'Medieval', title: 'Medieval Era', ages: 'Ages 21 – 24', years: [2017, 2020], icons: [8, 9, 10] },
    { nav: 'Renaissance', title: 'Renaissance Period', ages: 'Ages 25 – 29', years: [2021, 2025], icons: [11, 12] },
    { nav: 'Information', title: 'Information Age', ages: 'Age 30+', years: [2026, 2026], icons: [13, 14, 15] }
  ];
  /* special moments pinned on the ruler */
  var EVENTS = [
    { y: 1995 + 318 / 365, label: 'November 14th' }          // born 14 Nov 1995
  ];
  var STEPS = [
    { era: 0, cap: 'And the lord said “Let there be Joe!”' },
    { era: 0, cap: 'I started playing games at a very young age', sub: '& I had a huuuuuge PC in my room at 7 so I loved computers' },
    { era: 0, cap: 'Apparently I used to lead raids when I was 7', sub: '& was building guilds at 8…' },
    { era: 0, cap: 'I made my first animation when I was 12', sub: 'If the psych doctors saw this one at the time…' },
    { era: 1, cap: 'I then switched to sports instead of games', sub: 'And did a few drawings but only one stood the test of time…' },
    { era: 1, cap: 'I started to realise that films were my passion', sub: 'I’ve rated over 1700 titles on iMDB, here are my top 10, click your favourite' },
    { era: 1, cap: 'I even made a few…interesting ones in school…', sub: 'Take your pick' },
    { era: 2, cap: 'I travelled the world & lived/volunteered in a few places along the way' },
    { era: 2, cap: 'On the way I met a few people building websites and travelling and it made me think…' },
    { era: 3, cap: 'So I went off to Brighton to study Digital Media where I learned lots of new skills' },
    { era: 3, cap: 'I was awarded a scholarship to work in Taiwan for a year as a Web Developer & Designer for a start-up' },
    { era: 3, cap: 'Came back to Brighton in COVID', sub: '& did my final year project on ‘The Gamification and Future of e-Learning’ and did pretty well…' },
    { era: 4, cap: 'Then life began…I worked in design agencies in London', sub: 'This is when I realised how much I love UI, UX, Visual and all type of design' },
    { era: 4, cap: 'Managed to win some awards along the way', sub: 'Silver British Interactive Media Award (BIMA) for Best Digital Transformation of the year…twice (can’t take too much credit for the first one)' },
    { era: 5, cap: 'I’m now leading the design for Super Reel Travel', sub: 'An AI integrated trip planning app where users search through reels for travel inspiration' },
    { era: 5, cap: 'In my spare time I’m creating projects like this, travelling, playing sports, learning about AI, space & history & updating my iMDB', sub: 'I couldn’t decide between history or space theme but I love evolution so lucky you, an excuse for both!' }
  ];
  var PX_PER_YEAR = 60, MARKER_VH = 0.42;
  /* the Big Bang finale — where the story hands over to the rest of the site */
  var FINALE_CAP = 'And with one last bang… a whole new universe to explore';
  var LINKS = [
    { label: 'Work', href: '/case-studies', hue: '#FF00F5' },
    { label: 'Contact', href: '/contact', hue: '#7d5bff' },
    { label: 'Credits', href: '/contact#credits', hue: '#4aa8ff' }   // confirm the credits URL
  ];
  /* ------------------------------------------------------------------ */

  var Y0 = Math.floor(ERAS[0].years[0]), Y1 = Math.ceil(ERAS[ERAS.length - 1].years[1]);

  var BOARD = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a0c964e79a06e8151f7f16b_Starry%20Board%20-%20Foreground2.svg';

  var CSS =
  /* the landing-page starry world, fixed behind the story, with scroll parallax */
  '#jjms-bg{position:fixed;inset:0;z-index:0;overflow:hidden;background:#0b1424;pointer-events:none;}' +
  '#jjms-bg .bswirl{position:absolute;inset:-28vh 0;background:url(\'' + BOARD + '\') no-repeat 64% 38%/auto 175vh;' +
    'animation:jjmsDx 38s ease-in-out infinite alternate;will-change:transform;}' +
  '#jjms-bg .bwash{position:absolute;inset:0;background:radial-gradient(ellipse 70% 55% at 78% 10%,rgba(107,85,160,.32),rgba(74,58,117,.12) 48%,transparent 72%);}' +
  '#jjms-bg .bstars{position:absolute;inset:-16vh 0;animation:jjmsDs 38s ease-in-out infinite alternate;will-change:transform;}' +
  '#jjms-bg .st{position:absolute;border-radius:50%;background:#e6ecf6;}' +
  '#jjms-bg .st.tw{animation:jjmsTw 3s ease-in-out infinite;}' +
  '#jjms-bg .dust{position:absolute;border-radius:50%;background:rgba(190,200,216,.10);filter:blur(2px);}' +
  '@keyframes jjmsDx{from{margin-left:0;}to{margin-left:-70px;}}' +
  '@keyframes jjmsDs{from{margin-left:0;}to{margin-left:34px;}}' +
  '@keyframes jjmsTw{0%,100%{opacity:.15;}50%{opacity:.8;}}' +
  /* ---- the Big Bang finale — full cinematic sequence ----
     T+0.0  the void: world fades to black, a singularity forms and pulses
     T+1.05 DETONATION: core blows, double flash, screen shake, 5 shockwaves, 90 particles, bg surge
     T+2.3  the void lifts; T+2.5 caption; T+2.75 the three planets are born  */
  '#jjms .finale{height:100vh;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;}' +
  '#jjms .finale.go{animation:jjmsShake .8s linear 1s both;}' +
  '@keyframes jjmsShake{0%,100%{transform:translate(0,0);}10%{transform:translate(-9px,6px);}20%{transform:translate(11px,-4px);}' +
    '30%{transform:translate(-12px,-7px);}40%{transform:translate(8px,9px);}50%{transform:translate(-6px,4px);}' +
    '60%{transform:translate(10px,-8px);}70%{transform:translate(-8px,-3px);}80%{transform:translate(5px,6px);}90%{transform:translate(-3px,2px);}}' +
  '#jjms .bang{position:absolute;inset:0;pointer-events:none;}' +
  '#jjms .void{position:absolute;inset:0;background:#000;opacity:0;}' +
  '#jjms .finale.go .void{animation:jjmsVoidIn .55s ease both,jjmsVoidOut .9s ease 2.3s both;}' +
  '@keyframes jjmsVoidIn{from{opacity:0;}to{opacity:.92;}}' +
  '@keyframes jjmsVoidOut{from{opacity:.92;}to{opacity:0;}}' +
  '#jjms .core{position:absolute;left:50%;top:46%;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;opacity:0;' +
    'background:radial-gradient(circle,#fff 0%,#ffd7fb 45%,#FF00F5 100%);box-shadow:0 0 30px #FF00F5,0 0 70px rgba(255,0,245,.7);}' +
  '#jjms .finale.go .core{animation:jjmsCore 1s ease-in .12s both,jjmsCoreBlow .6s cubic-bezier(.2,.7,.3,1) 1.05s both;}' +
  '@keyframes jjmsCore{0%{opacity:0;transform:scale(.2);}35%{opacity:1;transform:scale(1.25);}55%{transform:scale(.9);}' +
    '75%{transform:scale(1.35);}92%{transform:scale(.8);}100%{opacity:1;transform:scale(1.5);}}' +
  '@keyframes jjmsCoreBlow{0%{opacity:1;transform:scale(1.5);}100%{opacity:0;transform:scale(46);}}' +
  '#jjms .flash{position:absolute;inset:0;opacity:0;background:radial-gradient(circle at 50% 46%,#fff 0%,#ffd7fb 22%,rgba(255,0,245,.5) 45%,transparent 70%);}' +
  '#jjms .finale.go .flash{animation:jjmsFl 1.1s ease-out 1.05s both;}' +
  '@keyframes jjmsFl{0%{opacity:0;}8%{opacity:1;}30%{opacity:.25;}45%{opacity:.95;}100%{opacity:0;}}' +
  '#jjms .ring{position:absolute;left:50%;top:46%;width:60px;height:60px;margin:-30px 0 0 -30px;border-radius:50%;opacity:0;transform:scale(0);}' +
  '#jjms .ring.c1{border:4px solid rgba(255,120,244,.9);}#jjms .ring.c2{border:3px solid rgba(255,255,255,.85);}#jjms .ring.c3{border:3px solid rgba(125,155,255,.85);}' +
  '#jjms .finale.go .ring{animation:jjmsRg 1.7s cubic-bezier(.17,.67,.35,1) both;}' +
  '#jjms .finale.go .ring.r1{animation-delay:1.05s;}#jjms .finale.go .ring.r2{animation-delay:1.14s;}#jjms .finale.go .ring.r3{animation-delay:1.23s;}' +
  '#jjms .finale.go .ring.r4{animation-delay:1.34s;}#jjms .finale.go .ring.r5{animation-delay:1.46s;}' +
  '@keyframes jjmsRg{0%{opacity:.95;transform:scale(0);}100%{opacity:0;transform:scale(30);}}' +
  '#jjms .parts span{position:absolute;left:50%;top:46%;border-radius:50%;opacity:0;transform-origin:center;}' +
  '#jjms .parts span.streak{border-radius:2px;}' +
  '#jjms .finale.go .parts span{animation:jjmsPt var(--dur,1.4s) cubic-bezier(.15,.6,.3,1) var(--del,1.08s) both;}' +
  '@keyframes jjmsPt{0%{opacity:1;transform:translate(0,0) rotate(var(--rot,0deg)) scale(1);}' +
    '100%{opacity:0;transform:translate(var(--tx),var(--ty)) rotate(var(--rot,0deg)) scale(.15);}}' +
  '#jjms .glowb{position:absolute;left:50%;top:52%;width:70vmin;height:44vmin;transform:translate(-50%,-50%);opacity:0;' +
    'background:radial-gradient(ellipse,rgba(255,0,245,.16) 0%,rgba(125,91,255,.10) 45%,transparent 75%);filter:blur(8px);}' +
  '#jjms .finale.go .glowb{animation:jjmsGb 1.6s ease 2.4s both;}' +
  '@keyframes jjmsGb{from{opacity:0;transform:translate(-50%,-50%) scale(.6);}to{opacity:1;transform:translate(-50%,-50%) scale(1);}}' +
  '#jjms .fcap{font-size:clamp(18px,2vw,30px);font-weight:700;margin:0 0 46px;opacity:0;text-align:center;padding:0 10vw;position:relative;}' +
  '#jjms .finale.go .fcap{animation:jjmsFc .8s ease 2.5s both;}' +
  '@keyframes jjmsFc{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}' +
  '#jjms .dests{display:flex;gap:clamp(28px,6vw,90px);position:relative;}' +
  '#jjms .dests a{display:flex;align-items:center;justify-content:center;width:clamp(96px,11vw,140px);height:clamp(96px,11vw,140px);' +
    'border-radius:50%;color:#fff;text-decoration:none;font-weight:800;font-size:clamp(15px,1.4vw,21px);letter-spacing:.04em;' +
    'opacity:0;transform:scale(0);transition:box-shadow .25s ease,filter .25s ease;}' +
  '#jjms .finale.go .dests a{animation:jjmsDp .7s cubic-bezier(.34,1.56,.64,1) both,jjmsFloat 4s ease-in-out infinite alternate;}' +
  '#jjms .finale.go .dests a:nth-child(1){animation-delay:2.75s,3.45s;}' +
  '#jjms .finale.go .dests a:nth-child(2){animation-delay:2.9s,3.85s;}' +
  '#jjms .finale.go .dests a:nth-child(3){animation-delay:3.05s,3.2s;}' +
  '@keyframes jjmsDp{from{opacity:0;transform:scale(0);}to{opacity:1;transform:scale(1);}}' +
  '@keyframes jjmsFloat{from{margin-top:0;}to{margin-top:-14px;}}' +
  '#jjms .dests a:hover{filter:brightness(1.15);}' +
  '#jjms-bg.boom{animation:jjmsBgBoom 1.2s ease-out both;}' +
  '@keyframes jjmsBgBoom{0%{filter:brightness(1);}12%{filter:brightness(2.1);}40%{filter:brightness(1.25);}100%{filter:brightness(1);}}' +
  '#jjms{position:relative;z-index:1;font-family:"Joes Journey Headline",Georgia,serif;color:#eef2f8;}' +
  '#jjms .step{height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 13vw;box-sizing:border-box;}' +
  '#jjms .cap{font-size:clamp(22px,3.1vw,44px);font-weight:700;line-height:1.25;max-width:1060px;margin:0;text-shadow:0 2px 18px rgba(0,0,0,.45);}' +
  '#jjms .sub{font-size:clamp(12px,1.05vw,16px);opacity:.62;margin:18px 0 0;max-width:720px;line-height:1.5;}' +
  /* left ruler */
  '#jjms-tl,#jjms-hd,#jjms-next,#jjms-nav{font-family:"Joes Journey Headline",Georgia,serif;color:#eef2f8;}' +
  '#jjms-tl{position:fixed;left:0;top:0;bottom:0;width:96px;z-index:940;pointer-events:none;transform:translateX(-100%);transition:transform .7s cubic-bezier(.22,1,.36,1);}' +
  '#jjms-tl.on{transform:translateX(0);}' +
  '#jjms-tl .ruler{position:absolute;left:0;top:0;width:100%;will-change:transform;}' +
  '#jjms-tl .tk{position:absolute;left:0;width:10px;height:1px;background:rgba(255,255,255,.22);}' +
  '#jjms-tl .tk.maj{width:16px;background:rgba(255,255,255,.4);}' +
  '#jjms-tl .yl{position:absolute;left:24px;transform:translateY(-50%);font-size:13px;letter-spacing:.03em;color:rgba(236,242,250,.5);transition:color .25s,text-shadow .25s;}' +
  '#jjms-tl .yl.big{color:#fff;text-shadow:0 0 12px rgba(255,0,245,.6);font-weight:700;}' +
  '#jjms-tl .ev{position:absolute;left:24px;transform:translateY(-50%);display:flex;align-items:center;gap:8px;white-space:nowrap;' +
    'font-size:13px;font-weight:700;color:#fff;text-shadow:0 0 10px rgba(255,0,245,.45);}' +
  '#jjms-tl .ev:before{content:"";width:14px;height:6px;border-radius:3px;margin-left:-24px;' +
    'background:linear-gradient(90deg,#FF00F5,#7d9bff);box-shadow:0 0 10px rgba(255,0,245,.8);}' +
  /* era header */
  '#jjms-hd{position:fixed;top:26px;left:110px;z-index:940;pointer-events:none;opacity:0;transform:translateY(-14px);transition:opacity .5s ease,transform .5s ease;min-width:340px;}' +
  '#jjms-hd.on{opacity:1;transform:translateY(0);}' +
  '#jjms-hd .hin{position:relative;animation:jjmsHdIn .6s cubic-bezier(.22,1,.36,1) both;}' +
  '#jjms-hd .hout{position:absolute;left:0;top:0;width:100%;animation:jjmsHdOut .45s ease both;}' +
  '@keyframes jjmsHdIn{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}' +
  '@keyframes jjmsHdOut{to{opacity:0;transform:translateY(-16px);}}' +
  '#jjms-hd .t{font-size:clamp(26px,2.6vw,40px);font-weight:800;margin:0;}' +
  '#jjms-hd .a{font-size:clamp(14px,1.3vw,20px);opacity:.75;margin:2px 0 10px;font-weight:700;}' +
  '#jjms-hd .ic{display:flex;gap:16px;align-items:flex-end;}' +
  '#jjms-hd .ic .pw{display:inline-flex;animation:jjmsPop .5s cubic-bezier(.34,1.56,.64,1) both;}' +
  '@keyframes jjmsPop{from{opacity:0;transform:scale(.5) translateY(8px);}to{opacity:1;transform:scale(1) translateY(0);}}' +
  /* all sprites the SAME height — opacity is the only dimming; the active one is alive */
  '#jjms-hd .ic img{height:40px;width:auto;opacity:.35;transition:opacity .45s ease;' +
    'filter:drop-shadow(0 3px 8px rgba(0,0,0,.5));transform-origin:bottom center;}' +
  '#jjms-hd .ic img.act{opacity:1;animation:jjmsIdle 1.6s ease-in-out infinite;}' +
  '@keyframes jjmsIdle{0%,100%{transform:translateY(0) scaleY(1);}50%{transform:translateY(-4px) scaleY(1.05);}}' +
  /* next button */
  '#jjms-next{position:fixed;left:50%;bottom:86px;transform:translateX(-50%);z-index:940;background:rgba(10,14,26,.78);' +
    'border:1px solid rgba(255,255,255,.16);border-radius:10px;color:#fff;font:inherit;font-size:13px;letter-spacing:.14em;' +
    'padding:12px 20px;cursor:pointer;display:flex;gap:10px;align-items:center;opacity:0;pointer-events:none;transition:opacity .5s ease,border-color .2s;}' +
  '#jjms-next.on{opacity:1;pointer-events:auto;}#jjms-next:hover{border-color:#FF00F5;}' +
  '#jjms-next .ar{display:inline-block;animation:jjmsA 1.6s ease-in-out infinite;}' +
  '#jjms-hint{position:fixed;left:50%;bottom:64px;transform:translateX(-50%);z-index:940;font-size:12px;opacity:0;' +
    'color:rgba(238,242,248,.6);pointer-events:none;transition:opacity .5s ease;font-family:"Joes Journey Headline",Georgia,serif;}' +
  '#jjms-hint.on{opacity:1;}' +
  '@keyframes jjmsA{0%,100%{transform:translateY(-2px);}50%{transform:translateY(3px);}}' +
  /* era nav */
  '#jjms-nav{position:fixed;left:0;right:0;bottom:0;z-index:940;display:flex;justify-content:center;gap:6px;align-items:baseline;' +
    'padding:16px 10px 18px;opacity:0;pointer-events:none;transition:opacity .5s ease;' +
    'background:linear-gradient(180deg,transparent,rgba(5,8,15,.72) 55%);}' +
  '#jjms-nav.on{opacity:1;pointer-events:auto;}' +
  '#jjms-nav a{color:rgba(238,242,248,.72);text-decoration:none;font-size:13px;font-weight:700;letter-spacing:.02em;' +
    'padding:6px 10px;border-radius:8px;transition:color .25s,font-size .25s,text-shadow .25s;white-space:nowrap;}' +
  '#jjms-nav a:hover{color:#fff;}' +
  '#jjms-nav a.cur{color:#fff;font-size:17px;text-shadow:0 0 16px rgba(255,0,245,.85),0 0 34px rgba(120,60,255,.5);}' +
  '#jjms-nav .dash{color:rgba(238,242,248,.3);font-size:12px;}';

  function init() {
    var st = document.createElement('style'); st.id = 'jjms-style'; st.textContent = CSS; document.head.appendChild(st);
    var mount = document.getElementById('jj-mystory-mount') || document.body;

    /* the starry backdrop — deterministic star/dust field so it never shifts between visits */
    var bg = document.createElement('div'); bg.id = 'jjms-bg';
    var sf = '';
    for (var sd = 0; sd < 46; sd++) {
      var sx = (sd * 61 + 13) % 100, sy = (sd * 37 + 7) % 100, sr = 1 + (sd * 29 % 10) / 6, so = 0.25 + (sd * 17 % 10) / 18;
      var tw = sd % 4 === 0;
      sf += '<div class="st' + (tw ? ' tw' : '') + '" style="left:' + sx + '%;top:' + sy + '%;width:' + sr.toFixed(1) + 'px;height:' + sr.toFixed(1) + 'px;opacity:' + so.toFixed(2) +
        (tw ? ';animation-duration:' + (2.4 + sd % 5 * 0.5) + 's;animation-delay:-' + (sd % 7 * 0.4) + 's' : '') + '"></div>';
    }
    for (var dd = 0; dd < 10; dd++) {
      var dx = (dd * 83 + 31) % 100, dy = (dd * 53 + 19) % 100, dr = 10 + (dd * 41 % 22);
      sf += '<div class="dust" style="left:' + dx + '%;top:' + dy + '%;width:' + dr + 'px;height:' + dr + 'px"></div>';
    }
    bg.innerHTML = '<div class="bswirl"></div><div class="bwash"></div><div class="bstars">' + sf + '</div>';
    document.body.appendChild(bg);
    var bSwirl = bg.querySelector('.bswirl'), bStars = bg.querySelector('.bstars');

    var wrap = document.createElement('div'); wrap.id = 'jjms';
    var html = '';
    for (var i = 0; i < STEPS.length; i++) {
      var s = STEPS[i];
      html += '<div class="step" id="jjms-step-' + i + '" data-era="' + s.era + '">' +
        '<p class="cap">' + s.cap + '</p>' + (s.sub ? '<p class="sub">' + s.sub + '</p>' : '') + '</div>';
    }
    /* the Big Bang finale: void + singularity, detonation (flash/shake/shockwaves/90 particles),
       nebula bloom, then the three destination planets are born */
    var parts = '';
    for (var p = 0; p < 90; p++) {
      var ang = p * 137.5 * Math.PI / 180;                      /* golden-angle spread — even but organic */
      var streak = p % 3 === 0;                                 /* every third particle is a debris streak */
      var dist = (streak ? 300 : 190) + (p * 53 % (streak ? 420 : 300));
      var col = p % 4 === 0 ? '#ffffff' : (p % 4 === 1 ? '#FF00F5' : (p % 4 === 2 ? '#ff9df8' : '#7d9bff'));
      var w = streak ? 3 : 3 + p * 7 % 6, h = streak ? 16 + p * 11 % 18 : w;
      var rot = streak ? (ang * 180 / Math.PI + 90).toFixed(0) : 0;
      parts += '<span class="' + (streak ? 'streak' : '') + '" style="--tx:' + (Math.cos(ang) * dist).toFixed(0) + 'px;--ty:' + (Math.sin(ang) * dist * 0.7).toFixed(0) +
        'px;--rot:' + (streak ? rot : 0) + 'deg;--dur:' + (streak ? 1.15 + p % 5 * 0.12 : 1.35 + p % 4 * 0.11).toFixed(2) + 's;--del:' + (1.06 + p % 9 * 0.025).toFixed(3) + 's;' +
        'width:' + w + 'px;height:' + h + 'px;background:' + col + '"></span>';
    }
    var dests = '';
    for (var l = 0; l < LINKS.length; l++)
      dests += '<a href="' + LINKS[l].href + '" style="background:radial-gradient(circle at 34% 30%,#ffffff33,transparent 42%),radial-gradient(circle at 60% 65%,' +
        LINKS[l].hue + ',#0c1226 135%);box-shadow:0 0 34px ' + LINKS[l].hue + '55,inset 0 0 24px ' + LINKS[l].hue + '44">' + LINKS[l].label + '</a>';
    html += '<div class="finale" id="jjms-finale">' +
      '<div class="bang"><div class="void"></div><div class="glowb"></div><div class="flash"></div><div class="core"></div>' +
      '<div class="ring r1 c1"></div><div class="ring r2 c2"></div><div class="ring r3 c3"></div><div class="ring r4 c1"></div><div class="ring r5 c2"></div>' +
      '<div class="parts">' + parts + '</div></div>' +
      '<p class="fcap">' + FINALE_CAP + '</p><div class="dests">' + dests + '</div></div>';
    wrap.innerHTML = html; mount.appendChild(wrap);
    var finale = document.getElementById('jjms-finale'), banged = false;

    /* left ruler: fine ticks (4/year) + year labels */
    var tl = document.createElement('div'); tl.id = 'jjms-tl';
    var rl = '';
    var evTops = EVENTS.map(function (E) { return (E.y - Y0) * PX_PER_YEAR; });
    for (var y = Y0; y <= Y1; y++) {
      var top = (y - Y0) * PX_PER_YEAR;
      rl += '<div class="tk maj" style="top:' + top + 'px"></div>';
      for (var q = 1; q < 4; q++) rl += '<div class="tk" style="top:' + (top + q * PX_PER_YEAR / 4) + 'px"></div>';
      var lt = top;                                              /* dodge event labels so they never overlap */
      for (var e2 = 0; e2 < evTops.length; e2++) if (Math.abs(lt - evTops[e2]) < 20) lt = evTops[e2] + 22;
      rl += '<div class="yl" data-y="' + y + '" style="top:' + lt + 'px">' + y + '</div>';
    }
    for (var ev = 0; ev < EVENTS.length; ev++)
      rl += '<div class="ev" style="top:' + ((EVENTS[ev].y - Y0) * PX_PER_YEAR).toFixed(1) + 'px">' + EVENTS[ev].label + '</div>';
    tl.innerHTML = '<div class="ruler">' + rl + '</div>';
    document.body.appendChild(tl);

    /* era header / next / nav */
    var hd = document.createElement('div'); hd.id = 'jjms-hd'; document.body.appendChild(hd);
    var nx = document.createElement('button'); nx.id = 'jjms-next'; nx.innerHTML = 'NEXT <span class="ar">↓</span>'; document.body.appendChild(nx);
    var hint = document.createElement('div'); hint.id = 'jjms-hint'; hint.textContent = '(or click the date below!)'; document.body.appendChild(hint);
    var nav = document.createElement('div'); nav.id = 'jjms-nav';
    var nh = '';
    for (var e = 0; e < ERAS.length; e++) {
      if (e) nh += '<span class="dash">–</span>';
      nh += '<a href="#" data-era="' + e + '">' + ERAS[e].nav + '</a>';
    }
    nav.innerHTML = nh; document.body.appendChild(nav);

    var ruler = tl.querySelector('.ruler');
    var ylEls = Array.prototype.slice.call(tl.querySelectorAll('.yl'));
    var navEls = Array.prototype.slice.call(nav.querySelectorAll('a'));
    var steps = Array.prototype.slice.call(wrap.querySelectorAll('.step'));
    var firstStepOfEra = [];
    for (e = 0; e < ERAS.length; e++) for (i = 0; i < STEPS.length; i++) if (STEPS[i].era === e) { firstStepOfEra[e] = i; break; }

    nav.addEventListener('click', function (ev) {
      var a = ev.target.closest('a'); if (!a) return; ev.preventDefault();
      steps[firstStepOfEra[+a.getAttribute('data-era')]].scrollIntoView({ behavior: 'smooth' });
    });
    nx.addEventListener('click', function () {
      var idx = curStep();
      if (idx < steps.length - 1) steps[idx + 1].scrollIntoView({ behavior: 'smooth' });
    });

    function curStep() {
      var mid = window.innerHeight * 0.5;
      for (var i = 0; i < steps.length; i++) { var r = steps[i].getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) return i; }
      return steps[0].getBoundingClientRect().top > mid ? -1 : steps.length - 1;
    }
    function curYear(idx) {
      if (idx < 0) return Y0;
      var s = steps[idx], r = s.getBoundingClientRect(), era = ERAS[STEPS[idx].era];
      var stepsInEra = STEPS.filter(function (x) { return x.era === STEPS[idx].era; }).length;
      var stepPos = idx - firstStepOfEra[STEPS[idx].era];
      var within = Math.max(0, Math.min(1, (window.innerHeight * 0.5 - r.top) / Math.max(1, r.height)));
      var t = (stepPos + within) / stepsInEra;
      return era.years[0] + t * (era.years[1] - era.years[0]);
    }

    var lastEra = -1, lastAct = -1, lastBig = null, raf = null;
    function render() {
      raf = null;
      /* scroll parallax on the backdrop — bounded sine drift so the bleed never runs out over 16 screens */
      bSwirl.style.transform = 'translateY(' + (Math.sin(window.scrollY / 2400) * 42).toFixed(1) + 'px)';
      bStars.style.transform = 'translateY(' + (Math.sin(window.scrollY / 1500 + 2.1) * 58).toFixed(1) + 'px)';
      var fr = finale.getBoundingClientRect();                   /* the Big Bang fires as the finale arrives */
      if (!banged && fr.top < window.innerHeight * 0.55) {
        banged = true; finale.classList.add('go');
        setTimeout(function () { bg.classList.add('boom'); }, 1000);      /* the whole sky surges at detonation */
        setTimeout(function () { bg.classList.remove('boom'); }, 2400);
      }
      else if (banged && fr.top > window.innerHeight * 1.2) { banged = false; finale.classList.remove('go'); bg.classList.remove('boom'); }   /* re-arm on the way back up */
      var idx = curStep(), inStory = idx >= 0 && steps[0].getBoundingClientRect().top < window.innerHeight * 0.85;
      var last = steps[steps.length - 1].getBoundingClientRect();
      inStory = inStory && last.bottom > window.innerHeight * 0.35;
      tl.classList.toggle('on', inStory); hd.classList.toggle('on', inStory);
      nav.classList.toggle('on', inStory);
      nx.classList.toggle('on', inStory && idx < steps.length - 1);
      hint.classList.toggle('on', inStory && idx < steps.length - 1);
      if (idx < 0) return;

      var era = STEPS[idx].era;
      /* the active sprite ADVANCES WITHIN the era, step by step (design frames 1 vs 3) */
      var E = ERAS[era];
      var stepsInEra = STEPS.filter(function (x) { return x.era === era; }).length;
      var stepPos = idx - firstStepOfEra[era];
      var actK = Math.min(E.icons.length - 1, Math.floor(stepPos * E.icons.length / stepsInEra));
      if (era !== lastEra) {
        lastEra = era; lastAct = actK;
        var ic = '';
        for (var k = 0; k < E.icons.length; k++)
          ic += '<span class="pw" style="animation-delay:' + (0.14 + k * 0.09).toFixed(2) + 's">' +
            '<img src="' + SPRITES[E.icons[k] - 1] + '" alt=""' + (k === actK ? ' class="act"' : '') + '></span>';
        var old = hd.querySelector('.hin');                      /* era-change transition: old up & out, new in */
        if (old) { old.className = 'hout'; (function (o) { setTimeout(function () { if (o.parentNode) o.remove(); }, 520); })(old); }
        var nu = document.createElement('div'); nu.className = 'hin';
        nu.innerHTML = '<h2 class="t">' + E.title + '</h2><p class="a">' + E.ages + '</p><div class="ic">' + ic + '</div>';
        hd.appendChild(nu);
        for (var n = 0; n < navEls.length; n++) navEls[n].classList.toggle('cur', n === era);
      } else if (actK !== lastAct) {                             /* same era, next step: hand the life to the next sprite */
        lastAct = actK;
        var imgs = hd.querySelectorAll('.hin .ic img');
        for (var m2 = 0; m2 < imgs.length; m2++) imgs[m2].classList.toggle('act', m2 === actK);
      }
      var yy = curYear(idx), markerY = window.innerHeight * MARKER_VH;
      ruler.style.transform = 'translateY(' + (markerY - (yy - Y0) * PX_PER_YEAR).toFixed(1) + 'px)';
      var big = Math.round(yy);
      if (big !== lastBig) { lastBig = big; for (var m = 0; m < ylEls.length; m++) ylEls[m].classList.toggle('big', +ylEls[m].getAttribute('data-y') === big); }
    }
    function onScroll() { if (!raf) raf = requestAnimationFrame(render); }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
