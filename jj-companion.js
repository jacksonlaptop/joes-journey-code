/* jj-companion.js — companions + the store (build c14: the Battle Chicken outfit clip is in; the Tree Spirit companion (kodama tilt in code, unlocked by a tap in the enchanted forest); c13: companions float right, out of the way, when they drift over UI; c12: the roaming clips are in — every alien outfit, the Babadook and the three chickens play one Seedance take each: roam at 60%, the expression at full speed, a 6s float on the stillest frame after it, then away into the distance; Babadook gifted by the quiz's secret video; c11: three chickens join the companions; menu decorations sit beside the logo, top left; decorations smaller, feet on the frame top everywhere; decorations = the 15 My Story era sprites, 5 at a time, still on every modal and floating in the menu; dragons grow in, play their clip from the top and shrink away before it ends; cursor-vs-theme question on the first mismatched pick; owned counts for the header).
   Loads after jj-score.js. Registers the Store's tabs (Characters, Outfits, Music, Cursors) with jjScore and renders them into the panel.
   Companions: the alien (wearing one of the outfits from the Outfits tab), two dragons, and the My Story era sprites. The alien and
   the sprites park top-left and bob; dragons patrol the top of the page, fly out when their clip ends and fly back in somewhere else.
   Clicking a companion makes it react. Hidden while the Storytime tale plays (My Story afterwards is fine), under modals, the menu and
   the credits game. State in localStorage 'jjCompanion'; the cursor choice is per session; the wallet lives in jjScore.
   Clips (when they land): co-<id>-idle (loop), co-<id>-poke (on click), co-<id>-bye (sent home); outfits use co-alien-<outfit>-*. */
(function () {
  if (window.jjCompanion) return;
  var GB = window.JJ_SCORE_BASE || 'https://cdn.jsdelivr.net/gh/jacksonlaptop/joes-journey-code@main/';
  var KEY = 'jjCompanion', C; try { C = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { C = {}; }
  C.owned = C.owned || {}; C.comp = C.comp || null; C.outfit = C.outfit || null; C.seen = C.seen || {}; C.deco = C.deco || []; C.keepCur = !!C.keepCur; C.cursor = C.cursor || null;
  var cursor = 'classic';                                      // resolved in applyCursor(): the kept choice, else the pack that matches the theme
  var MAX_DECO = 5;                                           // decorations on display at once
  var PREVIEW_ALL = true;                                     // TESTING: every cursor pack counts as owned. Set false to sell them.
  var CURSORS = [ ['classic', 'Classic cursor', 'The glowing bubble that grows on anything you can press.', 0], ['medieval', 'Medieval cursor', 'A sword that melts into a gold ring, with a sparkle on every press.', 10, 'storytime'], ['retro', 'Retro cursor', 'Pixel arrow, pixel hand, pixel starburst.', 10, 'credits'], ['alien', 'Space cursor', 'A cyan dot with a moon in orbit that rides the ring when you hover.', 10, 'scroll'], ['mixed', 'Special cursor', 'A gold dot in a ring of stone, brackets on press.', 10, 'allrounder'], ['default', 'Default cursor', 'Your own mouse pointer, exactly as your computer draws it.', 0] ];
  var PACK_FOR = { classic: 'classic', medieval: 'medieval', retro: 'retro', alien: 'alien', mixed: 'mixed' };   // theme → its cursor pack
  function save() { try { localStorage.setItem(KEY, JSON.stringify(C)); } catch (e) {} }

  /* ---- the catalogue. price {s:stars} or {c:coins}; gate = achievement id ---- */
  var OUTFITS = [
    { id: 'wizard',   name: 'Wizard',         img: 'co-set-wizard.webp',   price: { c: 20 }, desc: 'Hat, cape, monocle and a staff with a glowing gem.' },
    { id: 'princess', name: 'Princess',       img: 'co-set-princess.webp', price: { c: 20 }, desc: 'Crown, bow, a very pink dress and a star wand.' },
    { id: 'knight',   name: 'Knight',         img: 'co-set-knight.webp',   price: { c: 20 }, gate: 'storytime',   desc: 'Helmet, armour, cape, sword and the J shield.' },
    { id: 'space',    name: 'Space',          img: 'co-set-space.webp',    price: { c: 20 }, gate: 'scroll',      desc: 'Bubble helmet, jetpack, and Jupiter tagging along.' },
    { id: 'designer', name: 'Designer',       img: 'co-set-designer.webp', price: { c: 20 }, gate: 'casestudies', desc: 'Beret, glasses and a loaded paintbrush.' },
    { id: 'chicken',  name: 'Battle Chicken', img: 'co-set-chicken.webp',  price: { c: 20 }, gate: 'alien-catch', desc: 'Ranger hat, harness, two swords and a scar to prove it.' },
    { id: 'retro',    name: 'Retro',          img: 'co-set-retro.webp',    price: { c: 20 }, gate: 'credits',     desc: 'Pixel cap, pixel tache, pixel pets. Straight out of the credits game.' },
    { id: 'baby',     name: 'Baby alien',     img: 'co-set-baby.webp',     price: { c: 10 }, desc: 'Nappy, dummy and a Trogdor plush. Where every alien starts.' },
    { id: 'babadook', name: 'The Babadook',   img: 'co-set-babadook.webp', price: null,      gate: 'babadook',    desc: 'Top hat, tattered cape and far too many teeth. Yours for pressing play after the quiz.' }   // no price: it is a gift, handed over the moment 'babadook' lands (giftOutfits)
  ];
  var ERAS = [['The Blob', 'Precambrian Joe. Mostly goo, one eye, big plans.'], ['The Caveman', 'Prehistoric Joe and his trusty club.'], ['The Roman', 'Ancient Joe, helmet, sword and a frown.'], ['The Knight', 'Medieval Joe with the J shield.'], ['The Painter', 'Renaissance Joe, beret and brush.'], ['The Astronaut', 'Information Age Joe, phone in hand.']];   // era-fly-0..5 from My Story
  var COMPS = [
    { id: 'alien',   group: 'alien',  name: 'Your alien',    img: 'co-alien-plain.webp', price: { s: 1 }, desc: 'A little alien who floats along with you. Dress them in the Outfits tab.' },
    { id: 'trogdor', group: 'dragon', name: 'Trogdor',       video: 'co-trogdor-loop', poster: 'co-trogdor-loop-poster.webp', price: { s: 1 },  faceLeft: true,  rate: .5, desc: 'The Burninator himself, patrolling the top of the page. He can’t be dressed, he’s a dragon.' },
    { id: 'trog8',   group: 'dragon', name: '8-bit Trogdor', video: 'retro-trog-loop',  poster: 'retro-trog-loop-poster.webp',  price: { c: 20 }, gate: 'credits', faceLeft: false, desc: 'The pixel dragon from the credits game, patrolling the top of the page.' },
    { id: 'chick',     group: 'chicken', name: 'Chicken',          img: 'co-chick.webp', loopVid: 'story-vil-chicken', price: { c: 5 }, desc: 'The lone chicken from the village. Struts along beside you, entirely unbothered.' },
    { id: 'chick-arm',  group: 'chicken', name: 'Armoured Chicken', img: 'co-chick-armour.webp', price: { c: 20 }, gate: 'chick-cave', desc: 'A chicken in a tiny helmet and breastplate. Took the tale rather seriously.' },
    { id: 'chick-bat',  group: 'chicken', name: 'Battle Chicken',   img: 'co-chick-battle.webp', price: { c: 20 }, gate: 'chick-village', desc: 'Ranger hat, two swords, one scar. She has seen things.' },
    { id: 'spirit',    group: 'spirit', name: 'Tree Spirit', img: 'co-spirit.webp', price: { c: 10 }, gate: 'spirit', anim: 'kodama', desc: 'A little spirit from the enchanted wood. Tilts its head at you, then rattles. Animated in code — no clip needed.' }
  ].concat(ERAS.map(function (e, i) { return { id: 'era-' + i, group: 'story', name: e[0], img: 'era-fly-' + i + '.png', price: { c: 10 }, big: true, desc: e[1] + ' Floats around the page the way he does in My Story.' }; }));
  var SPRITES = [['01-amoeba', 'The Amoeba'], ['02-fish', 'The Fish'], ['03-walker', 'The Walker'], ['04-ape', 'The Ape'], ['05-caveman', 'The Caveman'], ['06-greek', 'The Greek'], ['07-roman', 'The Roman'], ['08-peasant', 'The Peasant'],
    ['09-villager', 'The Villager'], ['10-knight', 'The Knight'], ['11-painter', 'The Painter'], ['12-scholar', 'The Scholar'], ['13-modern', 'Modern Joe'], ['14-scientist', 'The Scientist'], ['15-astronaut', 'The Astronaut']];
  var ERA_OF = ['Precambrian', 'Precambrian', 'Precambrian', 'Prehistoric', 'Prehistoric', 'Ancient', 'Ancient', 'Medieval', 'Medieval', 'Medieval', 'Renaissance', 'Renaissance', 'Information', 'Information', 'Information'];   // the groups under each era name in My Story
  var SIZE_OF = [.42, .5, .58, .7, .86, .92, .92, .96, .96, 1, .96, .96, 1, 1, 1];   // the evolution sizes: blob and fish tiny, the ape small, the rest life-size
  var DECOS = SPRITES.map(function (sp, i) { return { id: 'sprite-' + sp[0], name: sp[1], era: ERA_OF[i], img: 'story-sprite-' + sp[0] + '.png', price: { c: 10 }, h: SIZE_OF[i], desc: 'From the ' + ERA_OF[i] + ' era in My Story. Sits on top of the big panels and in the menu.' }; });
  var DECOBY = {}; DECOS.forEach(function (d) { DECOBY[d.id] = d; });
  var BYID = {}; COMPS.forEach(function (c) { BYID[c.id] = c; }); var OUT = {}; OUTFITS.forEach(function (o) { OUT[o.id] = o; });
  var GROUPS = [['alien', ''], ['dragon', 'Dragons'], ['chicken', 'Chickens'], ['spirit', 'Forest spirits'], ['story', 'From my story']];
  var TABS = [['chars', 'Companions'], ['deco', 'Decorations'], ['outfits', 'Outfits'], ['music', 'Music'], ['cursor', 'Cursors']];

  /* ---- helpers through jjScore ---- */
  function J() { return window.jjScore; }
  function achName(id) { var a = J() && J().BY && J().BY[id]; return a ? a.name : id; }
  var UNLOCK_ALL = !!window.JJ_LOCAL_PREVIEW;                  // preview only: every companion, outfit, decoration and cursor is yours
  function gateOk(c) { return UNLOCK_ALL || !c.gate || (J() && J().has(c.gate)); }
  function owned(id) { return UNLOCK_ALL || !!C.owned[id]; }
  function priceHtml(p) { var c = J() ? J().ico(p.s ? 'star' : 'coin') : ''; return '<span class="rw"><img src="' + c + '" alt=""><span>' + (p.s || p.c) + '</span></span>'; }
  function alienImg() { var o = C.outfit && owned('outfit:' + C.outfit) && OUT[C.outfit]; return o ? o.img : 'co-alien-plain.webp'; }
  function thumb(c) { return GB + (c.id === 'alien' ? alienImg() : (c.img || c.poster)); }

  /* ---- the companion on the page ---- */
  var co = null, inner = null, cur = null, vid = null, stayT = 0, flying = false;
  var STOPS = [14, 50, 82];                                    // % across the top for the dragons
  var arrived = false;                                        // companions are the last thing to arrive on a page
  function mountCo() {
    if (co) return; co = document.createElement('div'); co.id = 'jj-co'; co.setAttribute('aria-hidden', 'true'); inner = document.createElement('div'); inner.className = 'jjco-bob'; co.appendChild(inner); document.body.appendChild(co);
    inner.addEventListener('click', poke);
    liftUI(); setInterval(liftUI, 2000);                           // pages build lazily; catch new UI as it appears
    inner.style.transition = 'transform 1.6s cubic-bezier(.22,1,.36,1), scale .3s ease'; setInterval(function () { park(); dodge(); }, 450);
    setInterval(function () { if (co) co.classList.toggle('hide', hidden() || !arrived); syncDeco(); menuCard(); }, 300);
    whenLast(function () { arrived = true; if (co) co.classList.toggle('hide', hidden()); });
  }
  /* Companions are a background layer: every piece of UI must paint above them. Anything interactive or
     CTA-like that has no stacking of its own is given one (relative + z-index 5); elements that already set a
     z-index are left alone, so deliberate layering elsewhere is never disturbed. Re-run as pages build lazily. */
  var UI_SEL = 'a, button, [role="button"], input, select, textarea, label, .w-button, .enter-link_wrapper, .next-section-button, [data-jj="cta"], [data-jj="btn"], .jj-contact, #jj-caption, #jj-space-ask, #jj-space-cta, #jj-spacebar, #jj-subtitle, h1, h2, h3';
  /* Some pages lay a tinted full-screen wash over their backdrop (the project picker's .gradient-overlay, z6): a
     companion underneath it goes red. So the companion sits just above the highest such wash, and the UI it lifts
     sits above that again — the order (backdrop → companion → UI) never changes, only the numbers. */
  var WASH_SEL = '.gradient-overlay, .intro-section, #threejs-container';
  var coZ = 2, lifted = [];
  function washZ() {
    var z = 1;
    try { document.querySelectorAll(WASH_SEL).forEach(function (el) { var r = el.getBoundingClientRect(); if (r.width < innerWidth * .8) return;
      var v = parseInt(getComputedStyle(el).zIndex, 10); if (v === v && v < 50) z = Math.max(z, v); }); } catch (e) {}
    return z;
  }
  function liftUI() {
    try {
      var z = washZ() + 1;
      if (z !== coZ) { coZ = z; if (co) co.style.setProperty('z-index', String(coZ), 'important'); lifted.forEach(function (el) { el.style.zIndex = String(coZ + 3); }); }
      document.querySelectorAll(UI_SEL).forEach(function (el) {
        if (el._jjLift || el.closest('#jj-co, #jj-ach, #jj-first')) return; el._jjLift = true;
        var cs = getComputedStyle(el);
        if (cs.zIndex !== 'auto') return;                                   // already layered on purpose
        if (cs.position === 'static') el.style.position = 'relative';
        el.style.zIndex = String(coZ + 3); lifted.push(el);
      });
    } catch (e) {}
  }
  /* Polite companions: if one drifts over a piece of UI (a button, a link, a heading, a caption) it floats off to the
     right until it is clear, and drifts back home once the UI has gone. Only the character's middle counts — the clip
     frames have empty margins. The shift rides on the inner .jjco-bob transform, so every mode's own motion is kept. */
  var dodgeX = 0, dodgeY = 0;
  function dodge() {
    if (!co || !inner || !co.classList.contains('on') || co.classList.contains('hide')) return;
    var r = co.getBoundingClientRect(); if (!r.width) return;      // #jj-co is never dodged itself, so this is the true resting box
    var mx = r.width * .22, my = r.height * .2;
    var base = { l: r.left + mx, r: r.right - mx, t: r.top + my, b: r.bottom - my };
    var W = innerWidth, H = innerHeight, boxes = [];
    try {
      document.querySelectorAll(UI_SEL).forEach(function (el) {
        if (el.closest('#jj-co')) return;
        var q = el.getBoundingClientRect();
        if (q.width < 4 || q.height < 4 || q.right < 0 || q.bottom < 0 || q.left > W || q.top > H) return;
        if (q.width * q.height > W * H * .35) return;                     // a link wrapping a whole section is not "UI in the way"
        if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return;
        boxes.push(q);
      });
    } catch (e) { return; }
    function hits(dx, dy) {
      for (var i = 0; i < boxes.length; i++) { var q = boxes[i];
        if (base.l + dx < q.right + 12 && base.r + dx > q.left - 12 && base.t + dy < q.bottom + 12 && base.b + dy > q.top - 12) return true; }
      return false;
    }
    var tx = 0, ty = 0;
    if (hits(0, 0)) {
      var found = false, maxX = W - base.r - 8;
      for (var dx = 40; dx <= maxX; dx += 40) if (!hits(dx, 0)) { tx = dx; found = true; break; }
      if (!found) for (var dy = 40; dy <= H - base.b - 8; dy += 40) if (!hits(0, dy)) { ty = dy; found = true; break; }   // no room to the right: drop below it
      if (!found) { tx = dodgeX; ty = dodgeY; }
    }
    if (Math.abs(tx - dodgeX) < 24 && Math.abs(ty - dodgeY) < 24) return;
    dodgeX = tx; dodgeY = ty; inner.style.transform = (tx || ty) ? 'translate(' + tx + 'px,' + ty + 'px)' : '';
  }
  /* Companions are the last thing to arrive on a page — but only as late as they have to be. A page with a loader
     waits for its entrance; a page without one (a case study, say) waits a beat and no more. On the homepage the
     companion holds back until the "Joe's Journey" reveal has finished and the CTA is up. */
  /* In the top nav, centred, only while the menu is open (in and out on the moon's timing): who is with you right now —
     a still of the companion, their name and a small CHANGE that opens the store on the companions tab. It lives inside
     .nav, so it drops behind modals with the rest of the nav. */
  function menuName() {
    var c = BYID[C.comp]; if (!c) return 'No companion';
    if (c.id === 'alien' && C.outfit && OUT[C.outfit] && owned('outfit:' + C.outfit)) return 'Alien \u00b7 ' + OUT[C.outfit].name;
    return c.name;
  }
  function menuCard() {
    var nav = document.querySelector('.nav'), card = document.getElementById('jj-co-nav');
    if (!nav) return;
    if (!card) {
      if (!document.getElementById('jj-co-nav-style')) {
        var ms = document.createElement('style'); ms.id = 'jj-co-nav-style';
        ms.textContent = '#jj-co-nav{position:absolute;left:50%;transform:translate(-50%,-50%);display:flex;align-items:center;gap:10px;pointer-events:none;white-space:nowrap;z-index:2;opacity:0;transition:opacity .34s ease;}' +   // arrives and leaves with the menu's moon
          'body.jj-menu-open #jj-co-nav{opacity:1;pointer-events:auto;transition:opacity 1.1s ease 1.4s;}#jj-co-nav.out{opacity:0!important;pointer-events:none!important;transition:opacity .34s ease!important;}' +
          '#jj-co-nav img{width:44px;height:44px;object-fit:contain;display:block;filter:drop-shadow(0 4px 8px rgba(0,0,0,.45));animation:jjcoBob 2.8s ease-in-out infinite;}' +
          '#jj-co-nav .nm{font-size:13px;letter-spacing:.02em;color:#fff;opacity:.92;}' +
          '#jj-co-nav .ch{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#fff;padding:5px 11px;border-radius:999px;cursor:pointer;' +
            'border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.4);backdrop-filter:blur(6px);transition:background .2s ease;}' +
          '#jj-co-nav .ch:hover{background:rgba(255,255,255,.5);}#jj-co-nav .ch:active{background:#FF00F5;border-color:#FF00F5;}' +
          '@media (max-width:900px){#jj-co-nav{display:none;}}';
        document.head.appendChild(ms);
      }
      card = document.createElement('div'); card.id = 'jj-co-nav';
      card.innerHTML = '<img alt=""><div class="nm"></div><div class="ch" data-cursor="hover" data-jj="btn">Change</div>';
      card.querySelector('.ch').addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        if (document.body.classList.contains('jj-menu-open')) { var b = document.querySelector('.menu-container'); if (b) b.click(); }   // close the menu behind the store
        setTimeout(function () { if (window.jjScore && window.jjScore.setStoreTab) window.jjScore.setStoreTab('chars'); }, 220);
      });
      if (getComputedStyle(nav).position === 'static') nav.style.position = 'relative';
      nav.appendChild(card);
    }
    var moon = document.querySelector('.jjmm-moon');             // Close pressed: the moon goes first, the card goes with it (the menu itself fades for a while yet)
    card.classList.toggle('out', !!(moon && moon.classList.contains('out')) || !document.body.classList.contains('jj-menu-open'));
    var pills = nav.querySelector('.menu-links, .nav-container'), pr = pills && pills.getBoundingClientRect(), nr = nav.getBoundingClientRect();
    if (pr && pr.height) card.style.top = Math.round(pr.top + pr.height / 2 - nr.top) + 'px';   // on the pills' centre line
    var c = BYID[C.comp], im = card.querySelector('img'), src = c ? thumb(c) : '';
    if (im.getAttribute('src') !== src) { im.setAttribute('src', src); im.style.display = src ? '' : 'none'; }
    var nm = card.querySelector('.nm'), want = menuName();
    if (nm.textContent !== want) nm.textContent = want;
  }

  function whenLast(fn) {
    var done = false, once = function (wait) { if (done) return; done = true; setTimeout(fn, wait || 700); };
    var home = !!document.querySelector('.enter-link_wrapper');
    function afterEntrance() {
      if (!home) { once(700); return; }
      var t = 0, iv = setInterval(function () {                 // the reveal: the title plays, then the CTA arrives
        if (document.querySelector('.enter-link_wrapper.jj-cta-revealing') || ++t > 60) { clearInterval(iv); once(1200); }
      }, 250);
    }
    var loaded = function () {
      if (window.__jjEntranceDone) { afterEntrance(); return; }
      document.addEventListener('jj:entrance', afterEntrance, { once: true });
      var t0 = Date.now(), iv = setInterval(function () {       // no loader on screen → this page isn't gated on an entrance
        if (done) { clearInterval(iv); return; }
        if (document.getElementById('jjld')) { if (Date.now() - t0 > 20000) { clearInterval(iv); afterEntrance(); } return; }
        if (Date.now() - t0 > 1200) { clearInterval(iv); afterEntrance(); }
      }, 200);
    };
    if (document.readyState === 'complete') setTimeout(loaded, 0); else window.addEventListener('load', loaded, { once: true });
  }
  /* Where the companion should sit on THIS page, before any dodging: floating just behind Joe's flying head while he
     is on screen, and centre-top on My Story (down the left is where its era headings and art live). */
  var parked = false;
  function parkAnchor() {
    var fly = document.getElementById('jj-flyer');
    if (fly && fly.classList.contains('on')) { var r = fly.getBoundingClientRect();
      if (r.width) return { x: r.left - r.width * .9, y: r.bottom - r.height * .1 }; }   // bottom-left of him, out of the text's way
    var cta = document.querySelector('.enter-link_wrapper');
    if (cta && getComputedStyle(cta).display !== 'none') return { x: 128, y: 214 };   // the landing: down and right of the top-left peeking alien
    var ms = document.getElementById('jjms-bg');
    if (ms && ms.getBoundingClientRect().width) return { x: innerWidth / 2, y: 92, centre: true };
    return null;
  }
  function park() {
    if (!co || !inner || !co.classList.contains('on')) return;
    var a = parkAnchor();
    if (!a) { if (parked) { parked = false; co.style.removeProperty('left'); co.style.removeProperty('top'); } return; }
    var w = inner.getBoundingClientRect().width || 80;
    var x = Math.max(8, Math.min(innerWidth - w - 8, a.centre ? a.x - w / 2 : a.x));
    co.style.setProperty('left', Math.round(x) + 'px', 'important');
    co.style.setProperty('top', Math.round(a.y) + 'px', 'important');
    parked = true;
  }
  function hidden() {                                          // modals, the menu, the credits game, and the Storytime tale itself
    return document.body.classList.contains('jj-modal-open') || document.body.classList.contains('jj-menu-open') || !!document.getElementById('jj-hud') || !!document.getElementById('jjst');
  }
  function clip(name, poster, loop, rate) {
    var v = document.createElement('video'); v.muted = true; v.loop = !!loop; v.playsInline = true; v.preload = 'auto'; v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); if (poster) v.poster = GB + poster;
    v.innerHTML = '<source src="' + GB + name + '.mov" type=\'video/mp4; codecs="hvc1"\'><source src="' + GB + name + '.webm" type="video/webm">'; v.className = 'jjco-vid'; if (rate) v.playbackRate = rate;
    v.addEventListener('playing', function () { v.removeAttribute('poster'); if (rate) v.playbackRate = rate; }, { once: true }); return v;
  }
  function play(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  function fillCo() {
    if (!co) return; stopRoam(); var c = BYID[C.comp]; inner.innerHTML = ''; inner.className = 'jjco-bob'; cur = c || null; vid = null; flying = false;
    co.className = c ? 'on ' + (c.group === 'dragon' ? 'dragon' : c.big ? 'wander' : 'spot') : ''; co.style.left = ''; co.style.transition = ''; if (!arrived) co.classList.add('hide');
    if (!c) return;
    if (c.group === 'dragon') { vid = clip(c.video, c.poster, false, c.rate); inner.appendChild(vid); enterDragon(c, STOPS[1 + Math.floor(Math.random() * 2)]); }
    else if (roamFile(c)) { var rf = roamFile(c); co.classList.add('roam'); vid = clip(rf, rf + '-poster.webp', false); inner.appendChild(vid); startRoam(rf); }
    else if (c.clips) { vid = clip('co-' + clipId(c) + '-idle', thumb(c).replace(GB, ''), true); inner.appendChild(vid); play(vid); }
    else if (c.loopVid) { vid = clip(c.loopVid, c.img, true); inner.appendChild(vid); play(vid); }   // a companion that already has a keyed loop of its own
    else { var im = document.createElement('img'); im.className = 'jjco-img' + (c.anim ? ' anim-' + c.anim : ''); im.src = thumb(c); im.alt = ''; inner.appendChild(im); }   // c.anim: a CSS-animated still (the tree spirit)
  }
  function clipId(c) { return c.id === 'alien' ? 'alien-' + (C.outfit && owned('outfit:' + C.outfit) ? C.outfit : 'plain') : c.id; }
  /* ---- the roaming clips: one Seedance take each — roam about, a quick expression, fly away into the distance.
     Per clip: [expr, hold, last] in seconds. The roam before `expr` plays at ROAM_RATE (calmer, less distracting);
     from `expr` it is full speed. At `hold` (the stillest frame just after the expression) it freezes and floats for
     HOLD_MS — the My Story era float — then plays on into the fly-away. At `last` the character has gone: fade, go again.
     Every clip is keyed with a soft frame edge, so anything reaching Dreamina's edge dissolves rather than cuts. ---- */
  var ROAM_RATE = .6, HOLD_MS = 6000;
  var ROAM = {
    'co-alien-plain':    [7.5, 10.375, 14.0],  'co-alien-wizard':   [7.0, 10.292, 13.4],  'co-alien-knight':   [7.5, 10.333, 13.5],
    'co-alien-space':    [7.9, 8.333, 10.6],   'co-alien-designer': [8.0, 12.5, 14.4],    'co-alien-retro':    [8.4, 10.6, 13.2],
    'co-alien-baby':     [8.0, 9.6, 12.3],     'co-alien-babadook': [9.8, 11.0, 13.4],    'co-alien-princess': [9.0, 11.5, 13.4],
    'co-chick':          [8.5, 9.667, 13.4],   'co-chick-armour':   [9.0, 11.292, 13.4],  'co-chick-battle':   [9.6, 11.708, 13.4],
    'co-alien-chicken':  [8.4, 11.6, 13.1]
  };   // the space hold sits on his grin just BEFORE the jetpack lights (8.42s), so the launch plays in full
  function roamFile(c) {
    if (!c) return null;
    if (c.id === 'alien') { var f = 'co-alien-' + (C.outfit && owned('outfit:' + C.outfit) ? C.outfit : 'plain'); return ROAM[f] ? f : null; }   // an outfit without a clip yet keeps its still
    var f2 = { chick: 'co-chick', 'chick-arm': 'co-chick-armour', 'chick-bat': 'co-chick-battle' }[c.id];
    return f2 && ROAM[f2] ? f2 : null;
  }
  var roamIv = null, roamGen = 0;
  function stopRoam() { roamGen++; clearInterval(roamIv); roamIv = null; if (inner) inner.classList.remove('hold'); if (co) co.classList.remove('rfade'); }
  function startRoam(file) {
    stopRoam(); var gen = roamGen, t = ROAM[file], phase = 'roam', until = 0;
    vid.playbackRate = ROAM_RATE; play(vid);
    roamIv = setInterval(function () {                          // a plain timer, not rAF: it keeps its place when the tab is in the background
      if (gen !== roamGen || !vid || !co) { clearInterval(roamIv); return; }
      var now = performance.now();
      if (phase === 'roam') {
        var want = vid.currentTime < t[0] ? ROAM_RATE : 1; if (vid.playbackRate !== want) vid.playbackRate = want;
        if (vid.paused && !vid.ended) play(vid);
        if (vid.currentTime >= t[1]) { phase = 'hold'; until = now + HOLD_MS; vid.pause(); try { vid.currentTime = t[1]; } catch (e) {} inner.classList.add('hold'); }
      } else if (phase === 'hold') {
        if (now >= until) { phase = 'out'; inner.classList.remove('hold'); vid.playbackRate = 1; play(vid); }
      } else if (phase === 'out') {
        if (vid.paused && !vid.ended) play(vid);
        if (vid.currentTime >= t[2] || vid.ended) { phase = 'fade'; until = now + 520; co.classList.add('rfade'); }   // whatever is left (a speck, the designer's arc) fades rather than pops
      } else if (phase === 'fade') {
        if (now >= until) { phase = 'roam'; try { vid.currentTime = 0; } catch (e) {} vid.playbackRate = ROAM_RATE; play(vid); co.classList.remove('rfade'); }
      }
    }, 60);
  }
  var flyT = null;
  /* a dragon's round: grow + fade in at a stop, the clip from its first frame, shrink + fade away just before it ends, a breath, then again somewhere else */
  function enterDragon(c, stop) {
    clearTimeout(flyT); if (!vid) return; flying = false;
    co.style.transition = 'none'; co.classList.add('pre'); co.classList.remove('gone'); co.style.left = stop + '%'; void co.offsetWidth; co.style.transition = '';
    try { vid.currentTime = 0; } catch (e) {} play(vid);
    setTimeout(function () { co.classList.remove('pre'); }, 40);
    var arm = function () { var d = (vid.duration && isFinite(vid.duration) ? vid.duration : 8) / (c.rate || 1); clearTimeout(flyT); flyT = setTimeout(function () { if (cur && cur.id === c.id) leaveDragon(c); }, Math.max(1500, (d - 0.7) * 1000)); };
    if (vid.duration && isFinite(vid.duration)) arm(); else vid.addEventListener('loadedmetadata', arm, { once: true });
  }
  function leaveDragon(c) {
    if (flying) return; flying = true; co.classList.add('gone');   // off into the distance
    setTimeout(function () { try { vid.pause(); } catch (e) {} var now = parseFloat(co.style.left) || 50, pick = STOPS.filter(function (s) { return Math.abs(s - now) > 1; });
      flyT = setTimeout(function () { if (cur && cur.id === c.id) enterDragon(c, pick[Math.floor(Math.random() * pick.length)]); }, 1500 + Math.random() * 1500); }, 900);
  }
  function poke() {
    if (!cur || flying || roamFile(cur)) return;
    if (cur.clips && vid) { var pv = clip('co-' + clipId(cur) + '-poke', null, false); inner.replaceChild(pv, vid); var idle = vid; vid = pv; play(pv); pv.addEventListener('ended', function () { if (vid === pv) { inner.replaceChild(idle, pv); vid = idle; play(idle); } }, { once: true }); return; }
    inner.classList.remove('jump'); void inner.offsetWidth; inner.classList.add('jump');
  }
  function sendHome(then) {                                   // fly out (the bye clip when it exists), then gone
    if (!cur) { if (then) then(); return; }
    if (cur.clips && vid) { var bv = clip('co-' + clipId(cur) + '-bye', null, false); inner.replaceChild(bv, vid); vid = bv; play(bv); bv.addEventListener('ended', function () { co.classList.remove('on'); if (then) then(); }, { once: true }); setTimeout(function () { co.classList.remove('on'); if (then) then(); }, 6000); return; }
    co.classList.add('bye'); setTimeout(function () { co.classList.remove('on', 'bye'); if (then) then(); }, 1000);
  }
  function setComp(id) {
    if (!id) { var was = C.comp; C.comp = null; save(); if (was) sendHome(function () { fillCo(); }); else fillCo(); return; }
    C.comp = id; save(); fillCo();
  }
  function themeNow() { return document.documentElement.getAttribute('data-jj-theme') || 'classic'; }
  function applyCursor() {
    var pack = PACK_FOR[themeNow()] || 'classic';
    cursor = C.keepCur && C.cursor ? C.cursor : (C.cursor && C.cursorTheme === themeNow() ? C.cursor : (cursorOwned(pack) ? pack : 'classic'));   // kept → yours everywhere; else a pick lasts until the theme changes, then the theme's own pack
    document.documentElement.classList.toggle('jj-cursor-default', cursor === 'default'); document.documentElement.setAttribute('data-jj-cursor', cursor === 'default' ? 'classic' : cursor);
  }
  function pickCursor(id) { C.cursor = id; C.cursorTheme = themeNow(); save(); applyCursor(); }
  new MutationObserver(function () { var was = cursor; applyCursor(); if (cursor !== was) rerender(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-jj-theme'] });
  function cursorOwned(id) { return id === 'classic' || id === 'default' || PREVIEW_ALL || owned('cursor:' + id); }

  /* ---- store ---- */
  var curTab = 'chars';
  function rerender() { if (!J() || !document.querySelector('#jj-ach.on.store')) return; var list = document.querySelector('#jj-ach .list'), st = list ? list.scrollTop : 0; J().setStoreTab(curTab || 'chars'); if (list) list.scrollTop = st; }
  function card(o) {
    return '<div class="row shop ' + (o.owned ? 'done' : o.locked ? 'lock' : '') + (o.on ? ' equipped' : '') + '" data-item="' + o.id + '"><i class="rbg"></i>' +
      '<div class="ico"><img src="' + o.thumb + '" alt=""></div><div class="mid"><div class="nm">' + o.name + (o.on ? ' <span class="jjco-tag">' + (o.onLabel || 'With you') + '</span>' : '') + (o.soon ? ' <span class="jjco-tag soon">Being animated</span>' : '') + '</div><div class="ds">' + o.desc + '</div>' +
      '<div class="pr">' + (o.price ? priceHtml(o.price) : '') + (o.locked ? '<span class="jjco-btn lock">Locked</span>' + (o.gate ? ' <button type="button" class="jjco-link" data-goto="' + o.gate + '" data-cursor="hover">see how</button>' : '') :
        o.owned ? '<button type="button" class="jjco-btn own" data-act="' + (o.ownAct || 'take') + '" data-item="' + o.id + '" data-cursor="hover">' + (o.ownLabel || 'Take with you') + '</button>' + (o.extra || '') :
        '<button type="button" class="jjco-btn buy" data-item="' + o.id + '" data-cursor="hover">Buy</button>') + '</div></div>' +
      '<i class="wmw"><img class="wm" src="' + o.thumb + '" alt=""></i></div>';
  }
  function head(t) { return t ? '<div class="jjco-h">' + t + '</div>' : ''; }
  function render(tab, list) {
    curTab = tab; var html = '';
    if (tab === 'chars') {
      GROUPS.forEach(function (g) {
        html += head(g[1]);
        COMPS.filter(function (c) { return c.group === g[0]; }).sort(function (a, b) { return (owned(b.id) ? 1 : 0) - (owned(a.id) ? 1 : 0); }).forEach(function (c) {
          var ok = gateOk(c), on = C.comp === c.id;
          html += card({ id: c.id, name: c.name, desc: ok || owned(c.id) ? c.desc : 'Unlocks with ' + achName(c.gate) + '. ' + c.desc, thumb: thumb(c), price: c.price, owned: owned(c.id), locked: !ok && !owned(c.id), gate: c.gate, on: on, soon: !c.video && !c.clips && !c.loopVid && !roamFile(c), ownLabel: on ? 'Send home' : 'Take with you',
            extra: c.id === 'alien' ? ' <button type="button" class="jjco-btn" data-act="outfits" data-item="alien" data-cursor="hover">Customise →</button>' : '' });
        });
      });
      var st = J() ? J().state() : {}, dn = new Date(), today = dn.getFullYear() + '-' + (dn.getMonth() + 1) + '-' + dn.getDate(), got = st.daily === today;
      html += '<div class="row shop note"><i class="rbg"></i><div class="ico"><img src="' + (J() ? J().ico('coin') : '') + '" alt=""></div><div class="mid"><div class="nm">Daily bonus</div><div class="ds">' + (got ? 'Collected today. Come back tomorrow for another +10 coins.' : 'Come back tomorrow for +10 coins, every day you visit.') + '</div></div></div>';
    }
    else if (tab === 'deco') {
      var nOn = C.deco.length, lastEra = null;
      html += '<div class="row shop note"><i class="rbg"></i><div class="ico"><img src="' + GB + 'story-sprite-10-knight.webp" alt=""></div><div class="mid"><div class="nm">Decorations</div><div class="ds">The little Joes from every era of My Story. They sit along the top of the big panels and in the menu. Collect them all; ' + MAX_DECO + ' can be out at once (' + nOn + ' of ' + MAX_DECO + ' on display).</div></div></div>';
      DECOS.forEach(function (d) {
        if (d.era !== lastEra) { lastEra = d.era; html += head(d.era); }
        var have = owned('deco:' + d.id), on = C.deco.indexOf(d.id) >= 0;
        html += card({ id: 'deco:' + d.id, name: d.name, desc: d.desc, thumb: GB + d.img, price: d.price, owned: have, locked: false, on: on, onLabel: 'On display', ownAct: 'deco', ownLabel: on ? 'Put away' : 'Put on display' });
      });
    }
    else if (tab === 'outfits') {
      if (!owned('alien')) html += '<div class="row shop note"><i class="rbg"></i><div class="ico"><img src="' + GB + 'co-alien-plain.webp" alt=""></div><div class="mid"><div class="nm">Outfits are for your alien</div><div class="ds">Buy the alien in Companions first, then dress them here.</div></div></div>';
      /* Dressing the alien also brings it out as your companion, so the labels say what will happen:
         With you = out and wearing this · Bring alien = it's the alien's outfit, someone else is out · Dress alien / Go plain = put it on */
      var alienOut = C.comp === 'alien', selTag = alienOut ? 'With you' : 'Alien\u2019s outfit';
      if (owned('alien') && !alienOut) html += '<div class="row shop note"><i class="rbg"></i><div class="ico"><img src="' + GB + alienImg() + '" alt=""></div><div class="mid"><div class="nm">Your alien isn\u2019t with you right now</div><div class="ds">Dressing them brings them along as your companion.</div></div></div>';
      var plainOn = !C.outfit || !owned('outfit:' + C.outfit);
      html += card({ id: 'outfit:plain', name: 'Plain', desc: 'No outfit, just the alien.', thumb: GB + 'co-alien-plain.webp', price: null, owned: true, on: plainOn, onLabel: selTag, ownAct: 'wear', ownLabel: plainOn ? (alienOut ? 'With you' : 'Bring alien') : 'Go plain' });
      OUTFITS.slice().sort(function (a, b) { return (owned('outfit:' + b.id) ? 1 : 0) - (owned('outfit:' + a.id) ? 1 : 0); }).forEach(function (o) {
        var ok = gateOk(o), have = owned('outfit:' + o.id), on = have && C.outfit === o.id;
        html += card({ id: 'outfit:' + o.id, name: o.name, desc: ok || have ? o.desc : 'Unlocks with ' + achName(o.gate) + '. ' + o.desc, thumb: GB + o.img, price: o.price, owned: have, locked: !ok && !have, gate: o.gate, on: on, onLabel: selTag, soon: !ROAM['co-alien-' + o.id], ownAct: 'wear', ownLabel: on ? (alienOut ? 'With you' : 'Bring alien') : 'Dress alien' });   // 'Being animated' only while its clip is still to come
      });
    }
    else if (tab === 'music') {
      var curM = J() ? J().music() : 'classic';
      (J() ? J().MUSIC : []).forEach(function (m) { var ok = J().musicOk(m.id), on = curM === m.id;
        html += card({ id: 'music:' + m.id, name: m.name + ' music', desc: ok ? (on ? 'Playing now.' : 'Free. Plays across the whole site.') : 'Unlocks with ' + achName(m.by) + '. Free once you have it.', thumb: GB + 'store-music-' + m.id + '.webp', price: null, owned: ok, locked: !ok, gate: m.by, on: on, onLabel: 'Playing', ownAct: 'music', ownLabel: on ? 'Playing' : 'Play this' }); });
    }
    else if (tab === 'cursor') {
      CURSORS.forEach(function (r) { var id = r[0], have = cursorOwned(id), ok = !r[4] || (J() && J().has(r[4])), on = cursor === id;
        html += card({ id: 'cursor:' + id, name: r[1], desc: have || ok ? r[2] : 'Unlocks with ' + achName(r[4]) + '. ' + r[2], thumb: GB + 'store-cursor-' + id + '.webp', price: r[3] && !have ? { c: r[3] } : null, owned: have, locked: !have && !ok, gate: r[4], on: on, onLabel: 'In use', ownAct: 'cursor', ownLabel: on ? 'In use' : 'Use this' }); });
    }
    list.innerHTML = html; bind(list);
  }
  function bind(list) {
    list.querySelectorAll('.jjco-btn.buy').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); buy(b.getAttribute('data-item')); }); });
    list.querySelectorAll('.jjco-link[data-goto]').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); var g = b.getAttribute('data-goto'); if (g && J()) J().goto(g); }); });
    list.querySelectorAll('[data-act]').forEach(function (b) { b.addEventListener(b.tagName === 'INPUT' ? 'change' : 'click', function (e) { e.stopPropagation(); act(b.getAttribute('data-act'), b.getAttribute('data-item')); }); });
  }
  function wear(id) { C.outfit = id === 'plain' ? null : id; save(); if (owned('alien') && C.comp !== 'alien') setComp('alien'); else if (C.comp === 'alien') fillCo(); }   // dressing the alien brings it out as your companion
  function act(a, id) {
    hideToast();                                             // pressing anything on a card answers the standing question by dismissing it
    if (a === 'take') { if (C.comp === id) setComp(null); else setComp(id); rerender(); return; }
    if (a === 'outfits') { if (J()) J().setStoreTab('outfits'); return; }
    if (a === 'wear') { wear(id.replace('outfit:', '')); rerender(); return; }
    if (a === 'music') { var m = id.replace('music:', ''); if (J() && J().music(m)) rerender(); return; }
    if (a === 'cursor') { var cid = id.replace('cursor:', ''); pickCursor(cid); rerender(); if (cid !== (PACK_FOR[themeNow()] || 'classic') && !C.dontAskCur) askKeep(); return; }
    if (a === 'deco') { var d = id.replace('deco:', ''), k = C.deco.indexOf(d); if (k >= 0) C.deco.splice(k, 1); else { if (C.deco.length >= MAX_DECO) { toast('Only ' + MAX_DECO + ' out at once. Put one away first.'); return; } C.deco.push(d); } save(); syncDeco(true); rerender(); return; }
  }
  function buy(id) {
    if (!J()) return;
    if (id.indexOf('cursor:') === 0) { var r = CURSORS.filter(function (x) { return 'cursor:' + x[0] === id; })[0]; if (!r || cursorOwned(r[0])) return; if (r[4] && !J().has(r[4])) { toast('Unlocks with ' + achName(r[4])); return; }
      if (!J().spend('coin', r[3])) { toast('Not enough coins yet'); return; } C.owned[id] = Date.now(); save(); rerender(); ask(r[1] + ' is yours. Use it now?', 'Use it', function () { act('cursor', id); }); return; }
    if (id.indexOf('deco:') === 0) { var dd = DECOBY[id.replace('deco:', '')]; if (!dd || owned(id)) return; if (!gateOk(dd)) { toast('Unlocks with ' + achName(dd.gate)); return; }
      if (!J().spend('coin', dd.price.c)) { toast('Not enough coins yet'); return; }
      C.owned[id] = Date.now(); save(); rerender(); ask(dd.name + ' is yours. Put them on display?', 'Display', function () { act('deco', id); }); return; }
    if (id.indexOf('outfit:') === 0) { var o = OUT[id.replace('outfit:', '')]; if (!o || owned(id)) return; if (!gateOk(o)) { toast('Unlocks with ' + achName(o.gate)); return; }
      if (o.price && !J().spend('coin', o.price.c)) { toast('Not enough coins yet'); return; }
      C.owned[id] = Date.now(); save(); rerender(); ask(o.name + ' is yours. Dress your alien in it?', 'Dress alien', function () { wear(o.id); rerender(); }); return; }
    var c = BYID[id]; if (!c || owned(id)) return;
    if (!gateOk(c)) { toast('Unlocks with ' + achName(c.gate)); return; }
    if (!J().spend(c.price.s ? 'star' : 'coin', c.price.s || c.price.c)) { toast(c.price.s ? 'You need a star for that' : 'Not enough coins yet'); return; }
    C.owned[id] = Date.now(); save(); rerender();
    ask(c.name + (c.id === 'alien' ? ' is yours. Take them with you now?' : ' is yours. Take them with you now?'), 'Take with you', function () { setComp(id); rerender(); });
  }
  /* ---- decorations: a shelf along the top of the big panel's frame, and one in the menu ---- */
  var decoSig = '';
  function decoHtml() { return C.deco.map(function (id, i) { var d = DECOBY[id]; return d ? '<img src="' + GB + d.img + '" alt="" style="animation-delay:' + (-i * 1.1) + 's;height:' + Math.round(46 * (d.h || 1)) + 'px">' : ''; }).join(''); }
  function count() { var own = 0, total = 0;   // the header's "owned" count
    COMPS.forEach(function (c) { total++; if (owned(c.id)) own++; }); OUTFITS.forEach(function (o) { total++; if (owned('outfit:' + o.id)) own++; }); DECOS.forEach(function (d) { total++; if (owned('deco:' + d.id)) own++; });
    CURSORS.forEach(function (r) { if (r[3]) { total++; if (owned('cursor:' + r[0])) own++; } }); return { own: own, total: total }; }
  function syncDeco(force) {
    var sig = C.deco.join(','), hosts = [];
    document.querySelectorAll('#jj-ach .card, #jj-first .card, .jjst-ov .card, #jj-menu-meta').forEach(function (h) { hosts.push(h); });
    hosts.forEach(function (h) { var el = h.querySelector(':scope > .jjco-deco'); if (!el) { el = document.createElement('div'); el.className = 'jjco-deco'; h.appendChild(el); el._sig = null; } if (el._sig !== sig || force) { el.innerHTML = decoHtml(); el._sig = sig; } });
  }
  /* the one question about cursors, asked the first time a pick doesn't match the theme */
  function askKeep() {
    var m = document.getElementById('jjco-ask'); if (!m) {
      m = document.createElement('div'); m.id = 'jjco-ask';
      m.innerHTML = '<div class="card"><h3>This cursor doesn\u2019t match your theme</h3><p>Next time you change the theme, do you want to keep this custom cursor, or update it when the theme updates?</p>' +
        '<label class="jjco-chk" data-cursor="hover"><input type="checkbox"><i></i><span>Don\u2019t ask me this again</span></label>' +
        '<div class="btns"><button type="button" class="jjco-btn no" data-cursor="hover">No, update with the theme</button><button type="button" class="jjco-btn buy yes" data-cursor="hover">Yes, keep this custom cursor</button></div></div>';
      document.body.appendChild(m);
      var done = function (keep) { C.keepCur = keep; if (keep) C.cursor = cursor; if (m.querySelector('input').checked) C.dontAskCur = true; save(); applyCursor(); m.classList.remove('on'); rerender(); };
      m.querySelector('.no').addEventListener('click', function () { done(false); }); m.querySelector('.yes').addEventListener('click', function () { done(true); });
    }
    m.querySelector('input').checked = false; m.classList.add('on');
  }
  function hideToast() { var p = document.getElementById('jj-ach'); if (!p) return; var t = p.querySelector('.jjco-toast'); if (t) { clearTimeout(t._t); t.classList.remove('on', 'ask'); } }
  function toastEl() { var p = document.getElementById('jj-ach'); if (!p) return null; var t = p.querySelector('.jjco-toast'); if (!t) { t = document.createElement('div'); t.className = 'jjco-toast'; p.querySelector('.card').appendChild(t); } return t; }
  function toast(msg) { var t = toastEl(); if (!t) return; t.classList.remove('ask'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove('on'); }, 1800); }
  function ask(msg, yes, onYes, onNo) {
    var t = toastEl(); if (!t) return; clearTimeout(t._t);
    t.innerHTML = '<span>' + msg + '</span><button type="button" class="jjco-btn buy" data-cursor="hover">' + yes + '</button><button type="button" class="jjco-btn" data-cursor="hover">Not now</button>'; t.classList.add('on', 'ask');
    var done = function (fn) { t.classList.remove('on', 'ask'); if (fn) fn(); };
    t.querySelector('.buy').addEventListener('click', function (e) { e.stopPropagation(); done(onYes); }); t.querySelectorAll('.jjco-btn')[1].addEventListener('click', function (e) { e.stopPropagation(); done(onNo); });
  }

  /* ---- styles ---- */
  var css = document.createElement('style'); css.id = 'jj-co-style';
  css.textContent =
    '#jj-co{position:fixed;z-index:9990;pointer-events:none;opacity:0;transition:opacity .6s ease,left 1.2s cubic-bezier(.22,1,.36,1),transform 1.2s cubic-bezier(.5,0,.8,1);animation:jjcoDrift 14s ease-in-out infinite;}#jj-co.on{opacity:1;}#jj-co.hide{opacity:0!important;pointer-events:none!important;}' +
    '@keyframes jjcoDrift{0%,100%{translate:0 0;}30%{translate:10px -12px;}60%{translate:-6px -6px;}}' +
    '#jj-co.spot{left:28px;top:130px;}#jj-co.dragon{top:96px;left:50%;margin-left:-70px;}' +
    '#jj-co .jjco-bob{pointer-events:auto;cursor:pointer;animation:jjcoBob 2.8s ease-in-out infinite;transition:scale .3s ease;}#jj-co.hide .jjco-bob{pointer-events:none;}#jj-co .jjco-bob:hover{scale:1.06;}@keyframes jjcoBob{0%,100%{translate:0 0;}50%{translate:0 -7px;}}' +
    '#jj-co .jjco-bob.jump{animation:jjcoJump .7s cubic-bezier(.34,1.56,.64,1);}@keyframes jjcoJump{0%{translate:0 0;rotate:0deg;}30%{translate:0 -34px;rotate:-8deg;}60%{translate:0 -10px;rotate:6deg;}100%{translate:0 0;rotate:0deg;}}' +
    '#jj-co .jjco-img,#jj-co .jjco-vid{display:block;width:120px;height:auto;max-width:none;background:transparent!important;filter:drop-shadow(0 6px 10px rgba(0,0,0,.35));}#jj-co.dragon .jjco-vid{width:140px;}' +
    '#jj-co.dragon{transition:opacity .9s ease,transform .9s cubic-bezier(.22,1,.36,1);}#jj-co.dragon.pre{opacity:0;transform:scale(.35);}#jj-co.dragon.gone{opacity:0;transform:scale(.25) translateY(-60px);transition:opacity .85s ease,transform .9s cubic-bezier(.5,0,.8,1);}' +
    '#jj-co.bye{transform:translate(-40vw,-40vh) scale(.3);opacity:0;transition:transform 1s cubic-bezier(.5,0,.8,1),opacity .5s ease .4s;}' +
    '@media (max-width:640px){#jj-co.spot{left:10px;top:100px;scale:.8;}}' +
    /* the six big Joes wander the page as they do in My Story */
    /* the tree spirit, kodama-style: the head tilts on its neck, holds, tilts back, then a quick rattle */
    '@keyframes jjcoKodama{0%,100%{rotate:0deg;}12%{rotate:-14deg;}34%{rotate:-11deg;}46%{rotate:7deg;}60%{rotate:5deg;}63%{rotate:-10deg;}65%{rotate:10deg;}67%{rotate:-8deg;}69%{rotate:7deg;}71%{rotate:-4deg;}74%{rotate:0deg;}}' +
    '#jj-co .jjco-img.anim-kodama{transform-origin:50% 88%;animation:jjcoKodama 7s ease-in-out infinite;}' +
    '#jj-co.wander{left:0;top:0;animation:jjcoWander 30s ease-in-out infinite;}#jj-co.wander .jjco-img{width:150px;animation:jjcoFlap 1.3s ease-in-out infinite;}#jj-co.wander .jjco-bob{animation:none;}' +
    '@keyframes jjcoWander{0%,100%{transform:translate(3vw,17vh);}25%{transform:translate(6vw,14vh);}50%{transform:translate(8vw,18vh);}75%{transform:translate(5vw,21vh);}}@keyframes jjcoFlap{0%,100%{translate:0 0;rotate:-5deg;}50%{translate:0 -10px;rotate:5deg;}}' +
    /* decorations: perched on the top edge of the panel frame, and above the current-theme line in the menu */
    '.jjco-deco{position:absolute;left:0;right:0;display:flex;justify-content:center;align-items:flex-end;gap:22px;pointer-events:none;z-index:3;}#jj-ach .card>.jjco-deco{bottom:calc(100% + var(--sw) - 24px);}#jj-ach.t-classic .card>.jjco-deco,#jj-ach.t-alien .card>.jjco-deco{bottom:calc(100% + 17px);}#jj-ach.t-retro .card>.jjco-deco{bottom:calc(100% + 12px);}#jj-menu-meta>.jjco-deco{position:fixed;left:136px;top:14px;right:auto;bottom:auto;height:80px;width:auto;justify-content:flex-start;align-items:center;gap:18px;}' +
    '.jjco-deco img{width:auto;height:46px;max-width:none;filter:drop-shadow(0 6px 10px rgba(0,0,0,.4));}#jj-menu-meta>.jjco-deco img{animation:jjcoBob 3.2s ease-in-out infinite;animation-delay:0s!important;}#jj-first .card>.jjco-deco{bottom:calc(100% + var(--sw,32px) - 22px);}#jj-first.t-classic .card>.jjco-deco,#jj-first.t-alien .card>.jjco-deco{bottom:calc(100% - 1px);}.jjst-ov .card{position:relative;}.jjst-ov .card>.jjco-deco{bottom:calc(100% - 2px);}' +
    /* the cursor question */
    '#jjco-ask{position:fixed;inset:0;z-index:10001;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);opacity:0;pointer-events:none;transition:opacity .25s ease;font-family:"Joes Journey Headline",sans-serif;}#jjco-ask.on{opacity:1;pointer-events:auto;}' +
    '#jjco-ask .card{width:min(520px,90vw);padding:30px 32px 26px;border-radius:22px;border:1.5px solid rgba(255,255,255,.5);background:rgba(0,0,0,.55);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);color:#fff;text-align:center;}#jjco-ask h3{margin:0 0 10px;font-size:24px;}#jjco-ask p{margin:0 0 18px;font-size:15px;line-height:1.45;color:#d6dbea;}' +
    '#jjco-ask .btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:18px;}' +
    '.jjco-chk{display:inline-flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;padding:6px 12px;border-radius:999px;transition:background .2s ease;}.jjco-chk:hover{background:rgba(255,255,255,.1);}.jjco-chk input{position:absolute;opacity:0;width:0;height:0;}.jjco-chk i{width:20px;height:20px;border-radius:6px;border:2px solid rgba(255,255,255,.6);display:inline-block;position:relative;transition:background .2s ease,border-color .2s ease,transform .15s ease;}.jjco-chk:hover i{border-color:#fff;transform:scale(1.08);}.jjco-chk input:checked+i{background:#FF00F5;border-color:#FF00F5;}.jjco-chk input:checked+i::after{content:"";position:absolute;left:5px;top:1px;width:5px;height:10px;border:solid #fff;border-width:0 2.5px 2.5px 0;transform:rotate(45deg);}' +
    
    'html.jj-cursor-default,html.jj-cursor-default *{cursor:auto!important;}html.jj-cursor-default a,html.jj-cursor-default button,html.jj-cursor-default [role="button"],html.jj-cursor-default [data-cursor]{cursor:pointer!important;}html.jj-cursor-default .custom-cursor,html.jj-cursor-default .cursor-trail{display:none!important;}' +
    /* store rows */
    '#jj-ach .row.shop{grid-template-columns:auto 1fr;height:auto!important;min-height:0!important;}#jj-ach .row.shop .ico img{width:80%;height:80%;object-fit:contain;filter:none!important;opacity:1!important;}#jj-ach .row.shop.lock .ico img{filter:grayscale(1) brightness(1.5)!important;opacity:.55!important;}' +
    '#jj-ach .row.shop .pr{gap:12px;justify-content:flex-start;flex-wrap:wrap;}#jj-ach .row.shop .wm{opacity:.08;}#jj-ach .row.note .pr{display:none;}' +
    '.jjco-h{font-family:"Joes Journey Headline",sans-serif;font-size:17px;font-weight:700;letter-spacing:.02em;margin:8px 4px -4px;}#jj-ach.t-retro .jjco-h,#jj-ach.t-mixed .jjco-h,#jj-ach.t-alien .jjco-h,#jj-ach.t-classic .jjco-h{color:#fff;}#jj-ach.t-retro .jjco-h{text-shadow:2px 2px 0 #000;}' +
    '.jjco-btn{font-family:inherit;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:8px 14px;border-radius:999px;border:1.5px solid currentColor;background:transparent;color:inherit;cursor:pointer;transition:transform .15s ease,background .2s ease;}.jjco-btn:hover{transform:translateY(-1px);background:rgba(127,127,127,.15);}.jjco-btn.lock{opacity:.6;cursor:default;}.jjco-btn.lock:hover{transform:none;background:transparent;}' +
    '.jjco-btn.buy{background:#FF00F5;border-color:#FF00F5;color:#fff;}.jjco-btn.buy:hover{background:#ff3af7;}' +
    '.jjco-tag{display:inline-block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;padding:2px 8px;border-radius:999px;background:#FFC531;color:#3a2a12;vertical-align:middle;margin-left:6px;}.jjco-tag.soon{background:rgba(127,127,127,.25);color:inherit;}' +
    '.jjco-link{font:inherit;font-size:12px;font-weight:700;background:none;border:0;color:#FF00F5;cursor:pointer;padding:0;text-decoration:underline;}' +
    '.jjco-toast{position:absolute;left:50%;bottom:22px;transform:translate(-50%,10px);background:rgba(0,0,0,.88);color:#fff;font-size:13px;font-weight:700;padding:10px 16px;border-radius:999px;opacity:0;pointer-events:none;transition:opacity .25s ease,transform .3s ease;z-index:9;white-space:nowrap;display:flex;align-items:center;gap:10px;}.jjco-toast.on{opacity:1;transform:translate(-50%,0);}.jjco-toast.ask{pointer-events:auto;padding:8px 8px 8px 18px;}.jjco-toast .jjco-btn{color:#fff;}' +
    /* the question toast is a modal in miniature, so it follows the theme like every other surface */
    '#jj-ach.t-classic .jjco-toast{background:rgba(0,0,0,.55);-webkit-backdrop-filter:blur(26px);backdrop-filter:blur(26px);border:1.5px solid rgba(255,255,255,.5);}' +
    '#jj-ach.t-medieval .jjco-toast,#jj-ach.t-mixed .jjco-toast{background:linear-gradient(180deg,#3a2a12,#241806);border:2.5px solid #FFC531;color:#FFE9B0;box-shadow:0 0 22px rgba(255,197,49,.35);}' +
    '#jj-ach.t-medieval .jjco-toast .jjco-btn,#jj-ach.t-mixed .jjco-toast .jjco-btn{color:#FFE9B0;}' +
    '#jj-ach.t-retro .jjco-toast{background:#0b1e5a;border:3px solid #FFD400;border-radius:0;color:#fff;box-shadow:0 0 0 3px #0b1e5a,0 0 22px rgba(255,212,0,.35);}' +
    '#jj-ach.t-retro .jjco-toast .jjco-btn{border-radius:0;}' +
    '#jj-ach.t-alien .jjco-toast{background:linear-gradient(160deg,rgba(10,16,52,.96),rgba(6,10,32,.98));border:2.5px solid rgba(120,220,255,.85);color:#DFF6FF;box-shadow:0 0 26px rgba(79,227,255,.32);}' +
    '#jj-ach.t-alien .jjco-toast .jjco-btn{color:#DFF6FF;}' +
    /* the roaming clips: a transparent 16:9 stage the character flies about in, top-left under the logo.
       The clip carries all the motion, so no page drift and no idle bob; the box never takes a click. */
    '#jj-co.roam{left:6px;top:104px;scale:1;animation:none;transition:opacity .5s ease;}' +
    '#jj-co.roam.rfade{opacity:0!important;}' +
    '#jj-co.roam .jjco-bob{pointer-events:none!important;cursor:default;animation:none;}' +
    '#jj-co.roam .jjco-bob:hover{scale:1;}' +
    '#jj-co.roam .jjco-vid{width:min(360px,34vw);}' +
    /* the hold: the My Story era float — one continuous rise and fall with a slow rock over it, four rises in 6s, rest to rest */
    '#jj-co.roam .jjco-bob.hold .jjco-vid{transform-origin:50% 60%;animation:jjCoBob 1.5s ease-in-out 4,jjCoTilt 6s ease-in-out 1;}' +
    '@keyframes jjCoBob{0%,100%{translate:0 0}50%{translate:0 -12px}}' +
    '@keyframes jjCoTilt{0%{rotate:0deg}12.5%{rotate:5deg}37.5%{rotate:-5deg}62.5%{rotate:5deg}87.5%{rotate:-5deg}100%{rotate:0deg}}' +
    /* companions float over the page but never take a click — whatever is underneath (the CV orb, a link) always wins */
    '#jj-co,#jj-co *{pointer-events:none!important;cursor:inherit!important;}' +
    /* half size, every companion (Joe, 2026-09-10): the alien still, the roaming clips, both Trogdors, the era characters */
    '#jj-co .jjco-img,#jj-co .jjco-vid{width:60px;}' +
    '#jj-co.dragon .jjco-vid{width:90px;}#jj-co.dragon{margin-left:-45px;}' +
    /* companions sit just in front of the page's background and behind every piece of UI: see liftUI() */
    '#jj-co{z-index:2!important;}' +
    '#jj-co.wander .jjco-img{width:75px;}' +
    '#jj-co.roam .jjco-vid{width:min(180px,17vw);}' +
    '@keyframes jjCoBob{0%,100%{translate:0 0}50%{translate:0 -7px}}';   // the hold float scaled down with them
  document.head.appendChild(css);

  /* ---- boot ---- */
  function boot() {
    if (!J()) { setTimeout(boot, 120); return; }
    J().registerStore({ tabs: TABS, render: render, count: count });
    applyCursor(); mountCo(); fillCo();
    /* outfits with no price are gifts: owned the moment their achievement lands */
    function giftOutfits() { if (!J()) return; var got = false; OUTFITS.forEach(function (o) { if (!o.price && o.gate && J().has(o.gate) && !owned('outfit:' + o.id)) { C.owned['outfit:' + o.id] = Date.now(); got = true; } }); if (got) save(); return got; }
    giftOutfits();
    window.addEventListener('jj:score', function () { giftOutfits(); var p = document.getElementById('jj-ach'); if (p && p.classList.contains('store')) rerender(); });
  }
  window.jjCompanion = { comps: COMPS, outfits: OUTFITS, decos: DECOS, count: count, state: function () { return JSON.parse(JSON.stringify(C)); }, take: setComp, wear: wear, poke: poke,
    reset: function () { C = { owned: {}, comp: null, outfit: null, seen: {}, deco: [] }; save(); fillCo(); syncDeco(true); },
    give: function (id) { C.owned[id] = Date.now(); save(); } };
  if (document.body) boot(); else document.addEventListener('DOMContentLoaded', boot);
})();
