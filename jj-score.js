/* jj-score.js — site-wide stars + coins (build k6).
   window.jjScore.award(id, {part, x, y})  →  ticks an achievement; pays out ONCE when it reaches its target (a star, or coins).
   State persists in localStorage ('jjScore'). HUD pill sits left of the Menu (right-anchored, so it grows leftwards).
   Anything in Webflow can award by attribute: <div data-jj-score="alien"> (+ optional data-jj-part="a").
   LinkedIn / mailto / tel / credits links and the sitting alien are picked up by delegation.
   Pages that can freeze (the story) listen for 'jj:score:pause' / 'jj:score:resume' on window. */
(function () {
  if (window.jjScore) return;
  var GB = window.JJ_SCORE_BASE || 'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/';   // JJ_SCORE_BASE: local preview override
  var IMG = { star: GB + 'score-star.webp', coin: GB + 'score-coin.webp', frame: GB + 'score-frame.webp', block: GB + 'score-block.webp', blockBlue: GB + 'score-block-blue.webp', bannerL: GB + 'score-banner-l.webp', bannerR: GB + 'score-banner-r.webp' };
  var TABICON = { general: 'general', storytime: 'story', contact: 'contact', credits: 'card' };   // score-tab-<name>-off/on.webp
  var SND = { open: GB + 'jj-menu-open.mp3', close: GB + 'jj-menu-close.mp3' };                  // menu scroll sounds (files pending — silent until they exist)
  function sfx(k) { try { if (!window.Howl) return; var h = new Howl({ src: [SND[k]], volume: .4, onload: function () { h.play(); } }); } catch (e) {} }
  var COIN = 10, KEY = 'jjScore', FONT = "'Joes Journey Headline',sans-serif";

  /* ---- the achievements (names + copy are placeholders until the proper list lands) ---- */
  var ACH = [
    { id: 'scroll',        tab: 'general',   kind: 'star', name: 'Journeyman',       desc: 'Made it to the end of the journey' },
    { id: 'planets',       tab: 'general',   kind: 'coin', name: 'Planet Hunter',    desc: 'Collect both Jupiter and Mars', target: 2 },
    { id: 'alien',         tab: 'general',   kind: 'coin', name: 'Do You Mind?',     desc: 'Poked the grumpy alien' },
    { id: 'quiz',          tab: 'general',   kind: 'star', name: 'Quiz Taker',       desc: 'Completed the quiz' },
    { id: 'quizFull',      tab: 'general',   kind: 'star', name: 'Quiz Master',      desc: 'Achieved full marks on the quiz' },
    { id: 'storytime',     tab: 'storytime', kind: 'star', name: 'Storyteller',      desc: 'Watched the whole tale of Trogdor' },
    { id: 'bones',         tab: 'storytime', kind: 'coin', name: 'Bone Collector',   desc: 'Pick up all the bones in Storytime', target: 2 },
    { id: 'trogdor',       tab: 'storytime', kind: 'coin', name: 'Catch Trogdor!',   desc: 'You stopped Trogdor burning down the tavern!' },
    { id: 'linkedin',      tab: 'contact',   kind: 'star', name: 'Connected',        desc: 'Added me on LinkedIn' },
    { id: 'contact',       tab: 'contact',   kind: 'coin', name: 'Say Hello',        desc: 'Copied my email or phone number' },
    { id: 'cv',            tab: 'contact',   kind: 'coin', name: 'Paper Trail',      desc: 'Downloaded my CV' },
    { id: 'credits-click', tab: 'credits',   kind: 'coin', name: 'Roll Credits',     desc: 'Opened the credits' },
    { id: 'credits',       tab: 'credits',   kind: 'star', name: 'Credits Complete', desc: 'Played the credits to the end' },
    { id: 'credits10',     tab: 'credits',   kind: 'star', name: 'Maxed Out',        desc: 'Reached the top level in the credits game' }
  ];
  var TABS = [['general', 'General'], ['storytime', 'Storytime'], ['contact', 'Contact'], ['credits', 'Credits']];
  var BY = {}; ACH.forEach(function (a) { a.target = a.target || 1; BY[a.id] = a; });
  var STAR_MAX = ACH.filter(function (a) { return a.kind === 'star'; }).length;
  /* first-time explainer copy (placeholder) */
  var FIRST = {
    coin: { title: 'You found coins!', body: 'Hidden around the site are little things to poke, pick up and discover. Each one earns coins. See what you have found and what is still out there in Achievements.' },
    star: { title: 'You earned a star!', body: 'Stars are the big ones: finishing a chapter, mastering the quiz, reaching the top. There are ' + STAR_MAX + ' to collect. Track them all in Achievements.' }
  };

  /* ---- state ---- */
  var S; try { S = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { S = {}; }
  S.p = S.p || {}; S.parts = S.parts || {}; S.done = S.done || {}; S.seen = S.seen || {};
  if (S.got) { Object.keys(S.got).forEach(function (id) { if (BY[id] && !S.done[id]) { S.done[id] = S.got[id]; S.p[id] = BY[id].target; } }); delete S.got; }   // k1 → k2
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function progress(id) { return Math.min(S.p[id] || 0, BY[id] ? BY[id].target : 0); }
  function has(id) { return !!S.done[id]; }
  function stars() { return ACH.filter(function (a) { return a.kind === 'star' && S.done[a.id]; }).length; }
  function coins() { return ACH.filter(function (a) { return a.kind === 'coin' && S.done[a.id]; }).length * COIN; }

  /* ---- styles ---- */
  var css = document.createElement('style'); css.textContent =
    /* HUD pill — the Score design: 49px tall, black 50% + blur, 1px white 80% */
    '#jj-sc-hud{position:fixed;top:32px;right:180px;transform:translateY(-50%);height:49px;padding:0 22px 0 17px;border-radius:24.5px;background:rgba(0,0,0,.5);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.8);color:#fff;font-family:' + FONT + ';font-size:17px;line-height:1;display:flex;align-items:center;cursor:pointer;z-index:9999;opacity:0;pointer-events:none;transition:opacity .8s ease,background .25s ease;box-sizing:border-box;margin:0;outline:none;-webkit-appearance:none;}' +
    '#jj-sc-hud.on{opacity:1;pointer-events:auto;}#jj-sc-hud:hover{background:rgba(0,0,0,.72);}' +
    '#jj-sc-hud.innav{position:relative;top:auto;right:auto;transform:none;margin:0 24px 0 0;align-self:center;flex:0 0 auto;}' +
    '#jj-sc-hud .n{min-width:1ch;text-align:right;display:inline-block;transition:transform .2s ease;}#jj-sc-hud .n.up{transform:scale(1.35);}' +
    '#jj-sc-hud .ic{width:24px;height:22px;object-fit:contain;display:block;margin:0 13px 0 6px;transform-origin:50% 50%;}#jj-sc-hud .ic.coin{width:23px;}' +
    '#jj-sc-hud .chev{width:12px;height:6px;display:block;margin-left:1px;transition:transform .3s ease;}#jj-sc-hud.open .chev{transform:rotate(180deg);}' +
    '#jj-sc-hud .ic.jiggle{animation:jjScJiggle .7s ease;}@keyframes jjScJiggle{0%{transform:rotate(0) scale(1);}20%{transform:rotate(-18deg) scale(1.3);}40%{transform:rotate(16deg) scale(1.3);}60%{transform:rotate(-10deg) scale(1.2);}80%{transform:rotate(6deg) scale(1.1);}100%{transform:rotate(0) scale(1);}}' +
    '#jj-sc-hud .ic.shine{animation:jjScShine 1s ease;}@keyframes jjScShine{0%{transform:scale(1);filter:none;}30%{transform:scale(1.45) rotate(15deg);filter:brightness(1.6) drop-shadow(0 0 10px #fff);}60%{transform:scale(1.2) rotate(-8deg);filter:brightness(1.3) drop-shadow(0 0 14px #ffe36b);}100%{transform:scale(1);filter:none;}}' +
    /* floating "+10" at the click point, and the flying icon */
    '.jj-sc-float{position:fixed;z-index:10001;pointer-events:none;display:flex;align-items:center;gap:6px;font-family:' + FONT + ';font-weight:700;color:#fff;font-size:22px;text-shadow:0 2px 6px rgba(0,0,0,.6);transform:translate(-50%,-50%);animation:jjScFloat 1.3s ease-out forwards;white-space:nowrap;}' +
    '.jj-sc-float img{width:26px;height:26px;object-fit:contain;}.jj-sc-float.part{font-size:16px;opacity:.95;}.jj-sc-float.part img{width:20px;height:20px;filter:grayscale(.3);}' +
    '@keyframes jjScFloat{0%{opacity:0;translate:0 10px;scale:.7;}15%{opacity:1;translate:0 0;scale:1.1;}30%{scale:1;}100%{opacity:0;translate:0 -70px;}}' +
    '.jj-sc-fly{position:fixed;z-index:10002;pointer-events:none;width:34px;height:34px;object-fit:contain;transform:translate(-50%,-50%);filter:drop-shadow(0 4px 10px rgba(0,0,0,.35));}' +
    /* stone frame (nine-slice from the banner art) */
    '.jj-stone{border:var(--sw,34px) solid transparent;border-image:url(' + IMG.frame + ') 96 fill / var(--sw,34px) / 0 round;box-sizing:border-box;color:#3a2a12;font-family:' + FONT + ';}' +
    '.jj-block{border:var(--bw,12px) solid transparent;border-image:url(' + IMG.block + ') 70 fill / var(--bw,12px) / 0 round;box-sizing:border-box;}' +
    /* achievements panel — the user's "Achievements UI" frame: stone all round, big banners outside left/right, score pill + close in the header,
       icon tabs (grey block → blue block cross-fade), and a Back to Exploring glass button under the frame */
    '#jj-ach{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.62);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;opacity:0;pointer-events:none;transition:opacity .3s ease;}' +
    '#jj-ach.on{opacity:1;pointer-events:auto;}' +
    '#jj-ach .card{position:relative;width:min(820px,52vw);min-width:min(92vw,560px);height:min(800px,78vh);--sw:36px;display:flex;flex-direction:column;transform:translateY(16px) scale(.98);transition:transform .45s cubic-bezier(.22,1,.36,1);}' +
    '#jj-ach.on .card{transform:none;}' +
    '#jj-ach .banner{position:absolute;top:calc(-1 * var(--sw) + 4px);width:clamp(110px,21%,190px);height:auto;pointer-events:none;z-index:2;filter:drop-shadow(0 10px 16px rgba(0,0,0,.35));}#jj-ach .banner.l{right:calc(100% - 7px);}#jj-ach .banner.r{left:calc(100% - 7px);}' +
    '#jj-ach .head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:6px 10px 0 14px;flex:0 0 auto;}' +
    '#jj-ach h2{margin:0;font-size:clamp(24px,2.6vw,34px);font-weight:700;letter-spacing:.02em;}' +
    '#jj-ach .hr{display:flex;align-items:center;gap:7px;}' +
    '#jj-ach .pill{height:48px;padding:0 20px 0 16px;border-radius:24px;background:rgba(0,0,0,.82);border:1px solid rgba(255,255,255,.8);color:#fff;font-size:17px;display:flex;align-items:center;line-height:1;}' +
    '#jj-ach .pill .n{min-width:1ch;text-align:right;}#jj-ach .pill img{width:25px;height:23px;object-fit:contain;margin:0 13px 0 6px;}#jj-ach .pill img:last-child{margin-right:0;}' +
    '#jj-ach .x{width:48px;height:48px;border-radius:50%;border:1px solid rgba(255,255,255,.8);background:rgba(0,0,0,.82);cursor:pointer;color:#fff;padding:0;display:flex;align-items:center;justify-content:center;transition:transform .25s ease,background .2s ease;}#jj-ach .x svg{width:16px;height:16px;display:block;}#jj-ach .x:hover{transform:rotate(90deg);background:#000;}' +
    '#jj-ach .tabs{display:flex;gap:6px;padding:14px 14px 0;flex:0 0 auto;flex-wrap:wrap;}' +
    '#jj-ach .tab{--bw:12px;position:relative;height:48px;padding:0 16px;display:flex;align-items:center;gap:8px;cursor:pointer;user-select:none;outline:none;color:rgba(255,255,255,.88);text-shadow:0 1px 2px rgba(0,0,0,.45);font-family:' + FONT + ';font-weight:700;font-size:15px;letter-spacing:.03em;transition:color .3s ease,transform .2s ease;}' +
    '#jj-ach .tab .bb{position:absolute;inset:0;border:14px solid transparent;border-image:url(' + IMG.blockBlue + ') 100 fill / 14px / 0 round;opacity:0;transition:opacity .3s ease;pointer-events:none;}' +
    '#jj-ach .tab .ic{position:relative;width:24px;height:24px;flex:0 0 auto;}#jj-ach .tab .ic img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;transition:opacity .3s ease;}#jj-ach .tab .ic .on{opacity:0;}' +
    '#jj-ach .tab span{position:relative;}' +
    '#jj-ach .tab:hover{transform:translateY(-1px);color:#fff;}#jj-ach .tab:hover .bb{opacity:.35;}' +
    '#jj-ach .tab.on{color:#fff;}#jj-ach .tab.on .bb{opacity:1;}#jj-ach .tab.on .ic .on{opacity:1;}#jj-ach .tab.on .ic .off{opacity:0;}' +
    '#jj-ach .list{flex:1 1 auto;overflow:auto;overscroll-behavior:contain;padding:14px 8px 8px 14px;margin:0 4px 0 0;display:flex;flex-direction:column;gap:12px;scrollbar-width:thin;scrollbar-color:#8a8a8a transparent;}' +
    '#jj-ach .row{--sw:22px;display:grid;grid-template-columns:1fr auto;gap:0 18px;align-items:center;padding:2px 6px 4px 8px;min-height:74px;flex:0 0 auto;}' +
    '#jj-ach .row .nm{font-size:18px;font-weight:700;line-height:1.15;}#jj-ach .row .ds{font-size:14px;line-height:1.3;margin-top:2px;color:#6b5535;}' +
    '#jj-ach .row .bar{--bw:6px;height:20px;margin-top:10px;position:relative;width:100%;}' +
    '#jj-ach .row .bar i{position:absolute;inset:0;background:linear-gradient(90deg,#FF00F5,#ff7df4);border-radius:3px;transform-origin:left center;transform:scaleX(var(--p,0));transition:transform .6s cubic-bezier(.22,1,.36,1);box-shadow:0 0 10px rgba(255,0,245,.45);}' +
    '#jj-ach .row .bar b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,.7);letter-spacing:.06em;}' +
    '#jj-ach .row .rw{display:flex;align-items:center;gap:8px;font-size:22px;font-weight:700;padding-right:6px;}#jj-ach .row .rw img{width:38px;height:36px;object-fit:contain;transition:filter .4s ease,opacity .4s ease;}' +
    '#jj-ach .row.lock .nm,#jj-ach .row.lock .rw{color:#8a8072;}#jj-ach .row.lock .ds{color:#9c927f;}#jj-ach .row.lock .rw img{filter:grayscale(1) brightness(1.05);opacity:.55;}' +
    '#jj-ach .row.done .rw img{filter:drop-shadow(0 0 8px rgba(255,214,90,.9));}' +
    '#jj-ach .empty{text-align:center;padding:30px 0;color:#6b5535;font-size:16px;}' +
    /* Back to Exploring — the homepage glass button with the fill-up hover + pink press */
    '.jj-sc-glass{position:relative;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:12px;padding:1.2rem 2.4rem;border-radius:8px;border:2px solid rgba(255,255,255,.11);background:rgba(0,0,0,.4);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);color:#fff;font-family:' + FONT + ';font-size:1.05rem;font-weight:400;line-height:1;text-transform:uppercase;letter-spacing:.02em;cursor:pointer;margin:0;-webkit-appearance:none;transition:box-shadow .2s ease,transform .45s cubic-bezier(.22,1,.36,1),opacity .3s ease;transform:translateY(16px);opacity:0;}' +
    '#jj-ach.on .jj-sc-glass{transform:none;opacity:1;}.jj-sc-glass:hover{box-shadow:0 12px 20px -14px rgba(255,255,255,.68);}' +
    '.jj-sc-glass>*{position:relative;z-index:2;}.jj-sc-glass svg{width:18px;height:18px;display:block;}' +
    '.jj-sc-glass .fill{position:absolute;inset:0;background:rgba(0,0,0,.92);transform:scaleY(0);transform-origin:bottom center;transition:transform .4s cubic-bezier(.4,0,.2,1);pointer-events:none;z-index:0!important;border-radius:inherit;}.jj-sc-glass:hover .fill{transform:scaleY(1);}' +
    '.jj-sc-glass .pink{position:absolute;border-radius:50%;background:#FF00F5;opacity:.9;pointer-events:none;z-index:1!important;transform:scale(0);transition:transform .4s ease-out,opacity .4s ease;}' +
    /* first-time explainer */
    '#jj-first{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.6);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .35s ease;}' +
    '#jj-first.on{opacity:1;pointer-events:auto;}' +
    '#jj-first .card{position:relative;width:min(560px,90vw);--sw:32px;padding:10px 26px 22px 30px;text-align:center;transform:translateY(16px) scale(.96);transition:transform .5s cubic-bezier(.22,1,.36,1);}' +
    '#jj-first.on .card{transform:none;}' +
    '#jj-first .big{width:96px;height:96px;object-fit:contain;margin:-70px auto 4px;display:block;filter:drop-shadow(0 8px 16px rgba(0,0,0,.35));animation:jjScBob 2.4s ease-in-out infinite;}@keyframes jjScBob{0%,100%{translate:0 0;}50%{translate:0 -6px;}}' +
    '#jj-first h3{margin:0 0 8px;font-size:clamp(22px,2.4vw,30px);}#jj-first p{margin:0 0 20px;font-size:15px;line-height:1.4;color:#5a4526;}' +
    '#jj-first .btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}' +
    '.jj-sc-btn{--bw:12px;background:none;cursor:pointer;color:#fff;font-family:' + FONT + ';font-weight:700;font-size:14px;letter-spacing:.05em;padding:4px 16px;min-height:44px;text-shadow:0 1px 2px rgba(0,0,0,.6);transition:transform .2s ease,color .2s ease;}' +
    '.jj-sc-btn:hover{transform:translateY(-2px);color:#FF00F5;}';
  document.head.appendChild(css);

  /* ---- HUD ---- */
  var hud, nStar, nCoin, icStar, icCoin, mounted = false;
  function mount() {
    if (mounted || !document.body) return; mounted = true;
    hud = document.createElement('button'); hud.id = 'jj-sc-hud'; hud.type = 'button'; hud.setAttribute('aria-label', 'Score and achievements'); hud.setAttribute('data-cursor', 'hover');
    hud.innerHTML = '<span class="n" id="jj-sc-stars">0</span><img class="ic star" src="' + IMG.star + '" alt=""><span class="n" id="jj-sc-coins">0</span><img class="ic coin" src="' + IMG.coin + '" alt="">' +
      '<svg class="chev" viewBox="0 0 12 6" fill="none"><path d="M1 1l5 4 5-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var ml = document.querySelector('.menu-links'), mc = ml && ml.querySelector('.menu-container');
    if (ml && mc) { hud.classList.add('innav'); if (getComputedStyle(ml).display.indexOf('flex') < 0) { ml.style.display = 'flex'; ml.style.alignItems = 'center'; } ml.insertBefore(hud, mc); }
    else document.body.appendChild(hud);
    nStar = hud.querySelector('#jj-sc-stars'); nCoin = hud.querySelector('#jj-sc-coins'); icStar = hud.querySelector('.ic.star'); icCoin = hud.querySelector('.ic.coin');
    nStar.textContent = stars(); nCoin.textContent = coins();
    hud.addEventListener('click', function (e) { e.stopPropagation(); if (panelOpen) closePanel(); else openPanel(); });
    place();
    /* show with the nav on pages that hold it back (jj-nav-in gate), otherwise after a beat */
    var shown = false; function show() { if (shown) return; shown = true; place(); hud.classList.add('on'); setTimeout(place, 1200); }
    if (document.documentElement.classList.contains('jj-nav-in')) show();
    new MutationObserver(function () { if (document.documentElement.classList.contains('jj-nav-in')) show(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setTimeout(show, 6000);
    window.addEventListener('resize', place);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (panelOpen) closePanel(); if (firstOpen) closeFirst(false); } });
  }
  /* left of the Menu, centred on it — layout position (transforms ignored, so the nav's drop-in doesn't skew it) */
  function place() {
    if (!hud || hud.classList.contains('innav')) return;
    var m = document.querySelector('.menu-container') || document.querySelector('.w-nav-button') || document.querySelector('.menu');
    if (!m) { hud.style.top = '56px'; hud.style.right = '32px'; return; }
    var x = 0, y = 0, n = m; while (n) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    hud.style.right = (window.innerWidth - x + 24) + 'px';
    hud.style.top = (y + m.offsetHeight / 2) + 'px';
  }
  function iconAt(kind) { var ic = kind === 'star' ? icStar : icCoin; if (!ic) return { x: window.innerWidth - 120, y: 56 }; var r = ic.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }

  /* ---- feedback: float, fly, land, count ---- */
  function floatAt(x, y, html, cls) {
    var f = document.createElement('div'); f.className = 'jj-sc-float' + (cls ? ' ' + cls : ''); f.innerHTML = html;
    f.style.left = x + 'px'; f.style.top = y + 'px'; document.body.appendChild(f); setTimeout(function () { f.remove(); }, 1400);
  }
  function fly(kind, x, y, done) {
    var im = document.createElement('img'); im.className = 'jj-sc-fly'; im.src = IMG[kind]; im.alt = '';
    im.style.left = x + 'px'; im.style.top = y + 'px'; document.body.appendChild(im);
    var to = iconAt(kind), dx = to.x - x, dy = to.y - y, mx = dx * .45, my = dy * .45 - 90;
    var frames = kind === 'star'
      ? [ { transform: 'translate(-50%,-50%) translate(0,0) rotate(0deg) scale(.7)', offset: 0 },      // Mario 64: up, a spin, a hold in the air, then off it goes
          { transform: 'translate(-50%,-50%) translate(0,-90px) rotate(360deg) scale(1.9)', offset: .35 },
          { transform: 'translate(-50%,-50%) translate(0,-96px) rotate(720deg) scale(1.9)', offset: .6 },
          { transform: 'translate(-50%,-50%) translate(' + mx + 'px,' + my + 'px) rotate(900deg) scale(1.2)', offset: .82 },
          { transform: 'translate(-50%,-50%) translate(' + dx + 'px,' + dy + 'px) rotate(1080deg) scale(.5)', offset: 1 } ]
      : [ { transform: 'translate(-50%,-50%) translate(0,0) scale(.6)', offset: 0 },                     // coin: a little pop up, then an arc to the counter
          { transform: 'translate(-50%,-50%) translate(0,-34px) scale(1.25)', offset: .28 },
          { transform: 'translate(-50%,-50%) translate(' + mx + 'px,' + my + 'px) scale(1.1) rotate(180deg)', offset: .62 },
          { transform: 'translate(-50%,-50%) translate(' + dx + 'px,' + dy + 'px) scale(.45) rotate(540deg)', offset: 1 } ];
    var a = im.animate(frames, { duration: kind === 'star' ? 2100 : 1050, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' });
    var fin = function () { im.remove(); done(); }; a.onfinish = fin; setTimeout(function () { if (im.parentNode) fin(); }, (kind === 'star' ? 2100 : 1050) + 300);
  }
  function countTo(el, from, to, ms) {                     // 1, 2, 3 … really quickly
    var steps = Math.max(1, to - from), i = 0, t = Math.max(18, Math.min(60, ms / steps));
    el.classList.add('up');
    (function tick() { i++; el.textContent = Math.min(to, from + i); if (from + i < to) setTimeout(tick, t); else setTimeout(function () { el.classList.remove('up'); }, 220); })();
  }
  function land(kind) {
    if (!hud) return;
    hud.classList.add('on');
    var ic = kind === 'star' ? icStar : icCoin, n = kind === 'star' ? nStar : nCoin;
    ic.classList.remove('jiggle', 'shine'); void ic.offsetWidth; ic.classList.add(kind === 'star' ? 'shine' : 'jiggle');
    var cur = parseInt(n.textContent, 10) || 0, target = kind === 'star' ? stars() : coins();
    if (target > cur) countTo(n, cur, target, kind === 'star' ? 200 : 420);
    if (panelOpen) renderRows();
  }
  function payout(a, o) {
    var kind = a.kind, x = (o && o.x != null) ? o.x : window.innerWidth / 2, y = (o && o.y != null) ? o.y : window.innerHeight / 2;
    floatAt(x, y - 18, (kind === 'star' ? '+1' : '+' + COIN) + ' <img src="' + IMG[kind] + '" alt="">');
    fly(kind, x, y, function () {
      land(kind);
      try { window.dispatchEvent(new CustomEvent('jj:score', { detail: { id: a.id, kind: kind, stars: stars(), coins: coins() } })); } catch (e) {}
      if (!S.seen[kind]) { S.seen[kind] = Date.now(); save(); setTimeout(function () { openFirst(kind); }, 350); }
    });
  }
  function award(id, o) {
    var a = BY[id]; if (!a || S.done[id]) return false;
    if (typeof o === 'number') o = { n: o }; o = o || {};
    if (o.part) { var pk = id + ':' + o.part; if (S.parts[pk]) return false; S.parts[pk] = Date.now(); S.p[id] = (S.p[id] || 0) + 1; }
    else S.p[id] = (S.p[id] || 0) + (o.n || 1);
    S.p[id] = Math.min(S.p[id], a.target);
    if (S.p[id] >= a.target) { S.done[id] = Date.now(); save(); payout(a, o); }
    else { save(); if (o.x != null) floatAt(o.x, o.y - 18, '<img src="' + IMG[a.kind] + '" alt=""> ' + S.p[id] + '/' + a.target, 'part'); if (panelOpen) renderRows(); }
    return true;
  }
  function reset() { S = { p: {}, parts: {}, done: {}, seen: {} }; save(); if (nStar) { nStar.textContent = '0'; nCoin.textContent = '0'; } if (panelOpen) renderRows(); }

  /* ---- achievements panel ---- */
  var panel, listEl, totEl, panelOpen = false, curTab = 'general', paused = false;
  function pause() { if (paused) return; paused = true; try { window.dispatchEvent(new Event('jj:score:pause')); } catch (e) {} }
  function resume() { if (!paused) return; paused = false; try { window.dispatchEvent(new Event('jj:score:resume')); } catch (e) {} }
  function buildPanel() {
    if (panel) return;
    panel = document.createElement('div'); panel.id = 'jj-ach'; panel.setAttribute('data-lenis-prevent', '');
    panel.innerHTML = '<div class="card jj-stone"><img class="banner l" src="' + IMG.bannerL + '" alt=""><img class="banner r" src="' + IMG.bannerR + '" alt="">' +
      '<div class="head"><h2>Achievements</h2><div class="hr"><div class="tot pill"><span class="n ts"></span><img src="' + IMG.star + '" alt=""><span class="n tc"></span><img src="' + IMG.coin + '" alt=""></div>' +
      '<button class="x" type="button" aria-label="Close" data-cursor="hover"><svg viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg></button></div></div>' +
      '<div class="tabs">' + TABS.map(function (t) { var ic = GB + 'score-tab-' + TABICON[t[0]]; return '<div class="tab jj-block" role="tab" tabindex="0" data-tab="' + t[0] + '" data-cursor="hover"><i class="bb"></i><i class="ic"><img class="off" src="' + ic + '-off.webp" alt=""><img class="on" src="' + ic + '-on.webp" alt=""></i><span>' + t[1] + '</span></div>'; }).join('') + '</div>' +
      '<div class="list" data-lenis-prevent></div></div>' +
      '<button type="button" class="jj-sc-glass" id="jj-ach-back" data-cursor="hover"><i class="fill"></i><svg viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Back to Exploring</span></button>';
    document.body.appendChild(panel);
    listEl = panel.querySelector('.list'); totEl = panel.querySelector('.tot');
    panel.querySelector('.x').addEventListener('click', closePanel);
    var back = panel.querySelector('#jj-ach-back'); back.addEventListener('click', closePanel);
    back.addEventListener('pointerdown', function (e) { var r = back.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;   // the pink press, as on click to begin
      var d = Math.max(Math.hypot(x, y), Math.hypot(r.width - x, y), Math.hypot(x, r.height - y), Math.hypot(r.width - x, r.height - y)) * 2.4;
      var c = document.createElement('i'); c.className = 'pink'; c.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (x - d / 2) + 'px;top:' + (y - d / 2) + 'px;'; back.appendChild(c);
      void c.offsetWidth; c.style.transform = 'scale(1)'; setTimeout(function () { c.style.opacity = '0'; }, 600); setTimeout(function () { c.remove(); }, 1000); });
    panel.addEventListener('click', function (e) { if (e.target === panel) closePanel(); });
    panel.querySelectorAll('.tab').forEach(function (b) { var go = function (e) { e.preventDefault(); e.stopPropagation(); curTab = b.getAttribute('data-tab'); renderRows(); };
      b.addEventListener('click', go); b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') go(e); }); });
    panel.addEventListener('wheel', function (e) { e.stopPropagation(); }, { passive: true });   // the list scrolls, not the page behind (Lenis / the horizontal scroll)
  }
  function renderRows() {
    if (!panel) return;
    panel.querySelectorAll('.tab').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-tab') === curTab); });
    totEl.querySelector('.ts').textContent = stars(); totEl.querySelector('.tc').textContent = coins();
    var rows = ACH.filter(function (a) { return a.tab === curTab; });
    listEl.innerHTML = rows.length ? rows.map(function (a) {
      var p = progress(a.id), d = !!S.done[a.id];
      return '<div class="row jj-stone ' + (d ? 'done' : 'lock') + '"><div><div class="nm">' + a.name + '</div><div class="ds">' + a.desc + '</div>' +
        '<div class="bar jj-block" style="--p:' + (p / a.target) + '"><i></i><b>' + p + '/' + a.target + '</b></div></div>' +
        '<div class="rw"><img src="' + IMG[a.kind] + '" alt=""><span>' + (a.kind === 'star' ? 1 : COIN) + '</span></div></div>';
    }).join('') : '<div class="empty">Nothing here yet.</div>';
  }
  function modal() { document.body.classList.toggle('jj-modal-open', panelOpen || firstOpen); }   // pages hide their hover/click targets behind an open modal
  function openPanel() { buildPanel(); renderRows(); panelOpen = true; panel.classList.add('on'); if (hud) hud.classList.add('open'); modal(); pause(); sfx('open'); }
  function closePanel() { if (!panel || !panelOpen) return; panelOpen = false; panel.classList.remove('on'); if (hud) hud.classList.remove('open'); modal(); if (!firstOpen) resume(); sfx('close'); }

  /* ---- first coin / first star: a short pause and a word about what just happened ---- */
  var first, firstOpen = false;
  function openFirst(kind) {
    if (!first) {
      first = document.createElement('div'); first.id = 'jj-first';
      first.innerHTML = '<div class="card jj-stone"><img class="big" alt=""><h3></h3><p></p><div class="btns"><button type="button" class="jj-sc-btn jj-block go" data-cursor="hover">VIEW ACHIEVEMENTS</button><button type="button" class="jj-sc-btn jj-block on" data-cursor="hover">KEEP GOING</button></div></div>';
      document.body.appendChild(first);
      first.querySelector('.go').addEventListener('click', function () { closeFirst(true); openPanel(); });
      first.querySelector('.on').addEventListener('click', function () { closeFirst(false); });
    }
    first.querySelector('.big').src = IMG[kind]; first.querySelector('h3').textContent = FIRST[kind].title; first.querySelector('p').textContent = FIRST[kind].body;
    firstOpen = true; modal(); pause(); first.classList.add('on');
  }
  function closeFirst(keepPaused) { if (!first) return; firstOpen = false; first.classList.remove('on'); modal(); if (!keepPaused && !panelOpen) resume(); }

  /* ---- delegated hooks ---- */
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return;
    var el = t.closest('[data-jj-score]'); if (el) award(el.getAttribute('data-jj-score'), { part: el.getAttribute('data-jj-part') || undefined, x: e.clientX, y: e.clientY });
    var a = t.closest('a[href]'); if (a) { var h = a.getAttribute('href') || '';
      if (/linkedin\.com/i.test(h)) award('linkedin', { x: e.clientX, y: e.clientY });
      if (/^(mailto|tel):/i.test(h)) award('contact', { x: e.clientX, y: e.clientY });
      if (/credits=1|#credits$/i.test(h)) award('credits-click', { x: e.clientX, y: e.clientY }); }
    if (t.closest('#jj-sitting-alien')) award('alien', { x: e.clientX, y: e.clientY });
  }, true);

  window.jjScore = { award: award, has: has, progress: progress, stars: stars, coins: coins, open: openPanel, close: closePanel, reset: reset, ACH: ACH,
    state: function () { return JSON.parse(JSON.stringify(S)); } };
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
