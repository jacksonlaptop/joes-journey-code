/* ============================================================================
   Joe's Journey — Storytime page  (hosted via GitHub + raw.githack.com)

   IN WEBFLOW (Storytime page → Page Settings):
     Inside <head>:  <style>.nav-logo-link,.menu-container{opacity:0}</style>
     Before </body>: <script src="https://raw.githack.com/jacksonlaptop/joes-journey-code/main/storytime.js?v=15"></script>

   Every scene is COMPOSED FROM LAYERS in code (not a flat image): the night sky
   backdrop → a transparent scene bg → positioned character layers (some animated)
   → the J-swirl caption banner. Chapters switch on words as the line types.
   Positions live in COMP below as plain CSS strings — easy to nudge.
   ============================================================================ */
(function () {
  window.JJ_STORY_BUILD = 's35 · night sky dressing behind the scenery; loader warms its figures first; Previous / Next Scene; rolling progress; flame in front; ta-da once per loop';
  try { console.log('%c[JJ] storytime.js build: ' + window.JJ_STORY_BUILD, 'color:#FF00F5;font-weight:bold'); } catch (e) {}

  var GB = window.JJ_STORY_BASE || 'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/';
  var AV = '?a=6';
  function F(name){ return GB + 'story-' + name + '.webp' + AV; }
  var BANNER = GB + 'story-banner.webp' + AV;             // J-swirl caption frame
  var SKY = GB + 'story-nightsky.svg' + AV;
  /* the loader's night dressing, reused behind the transparent scene boards (moon + whirls + dot stars).
     Coordinates live in a 1000x560 sky (slice-fitted), chosen per board to sit in clear sky. */
  var NSC = 'https://cdn.prod.website-files.com/615edb5c549d52cd108ed268/';
  var N_XSTAR = NSC + '67212bf05ed02917043863f9_x-star.svg', N_WHIRL = NSC + '67212bf05ed02917043863f5_whirl-star.svg';
  var N_MOON = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a0d67bbb86603f359ae1311_289a8c92ed8a9b7dd3efdae788f3d0ae_Moon.svg';
  var NIGHT = {
    'cav-bg':  { moon:[300,150,50], whirls:[[120,105,20],[720,70,17]], xs:[[560,120,12],[840,150,10]], stars:[[80,60],[180,190],[420,60],[640,40],[900,60],[470,230],[240,40],[760,240],[990,200],[360,120]] },
    'vil-bg':  { moon:[430,100,48], whirls:[[150,80,18],[830,60,20]], xs:[[300,40,12],[700,160,10]], stars:[[60,50],[230,150],[400,190],[620,70],[900,110],[960,40],[280,220],[580,220],[760,40],[120,220]] },
    'wood-bg': { moon:[400,80,44], whirls:[[250,150,16],[600,40,18]], xs:[[300,120,11],[520,40,10]], stars:[[230,50],[360,190],[480,160],[640,110],[700,180],[170,230],[560,200],[330,20]] },
    'cas-bg':  { moon:[220,110,52], whirls:[[90,50,18],[440,60,20]], xs:[[330,40,12],[520,120,10]], stars:[[40,150],[130,200],[400,170],[600,40],[720,90],[300,240],[480,220],[560,20]] }
  };
  function nightSvg(c){
    var m = c.moon, r = m[2], h = '';
    (c.stars || []).forEach(function (st, i) { h += '<circle class="jjst-tw" style="--d:' + (2.6 + (i % 4) * .7).toFixed(1) + 's;--o:-' + (i * .53 % 3).toFixed(2) + 's" cx="' + st[0] + '" cy="' + st[1] + '" r="' + (2.2 + (i % 3) * .5) + '" fill="#eaf5ff"/>'; });
    (c.xs || []).forEach(function (x, i) { h += '<image class="jjst-tw" style="--d:' + (3.4 + i) + 's;--o:-' + i + 's" href="' + N_XSTAR + '" x="' + (x[0] - x[2] / 2) + '" y="' + (x[1] - x[2] / 2) + '" width="' + x[2] + '" height="' + x[2] + '"/>'; });
    (c.whirls || []).forEach(function (w) { h += '<image href="' + N_WHIRL + '" x="' + (w[0] - w[2] / 2) + '" y="' + (w[1] - w[2] / 2) + '" width="' + w[2] + '" height="' + w[2] + '" opacity=".85"/>'; });
    h += '<g class="jjst-moonw"><g class="jjst-mpulse"><circle cx="' + m[0] + '" cy="' + m[1] + '" r="' + (r * 1.75) + '" fill="url(#jjstml)"/></g>' +
         '<image href="' + N_MOON + '" x="' + (m[0] - r) + '" y="' + (m[1] - r) + '" width="' + (r * 2) + '" height="' + (r * 2) + '"/></g>';
    return '<svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="jjstml" gradientUnits="userSpaceOnUse" cx="' + m[0] + '" cy="' + m[1] + '" r="' + (r * 1.75) + '">' +
           '<stop offset="0" stop-color="#C5E7FF" stop-opacity=".22"/><stop offset=".55" stop-color="#C5E7FF" stop-opacity=".08"/><stop offset="1" stop-color="#C5E7FF" stop-opacity="0"/></radialGradient></defs>' + h + '</svg>';
  }
  var nightEl = null, nightCur = null;
  function setNight(bg){
    if (!nightEl || bg === nightCur) return; var had = !!nightCur; nightCur = bg;
    nightEl.classList.remove('on');
    setTimeout(function () { if (nightCur !== bg) return; var c = NIGHT[bg];
      nightEl.innerHTML = c ? nightSvg(c) : '';
      if (c) setTimeout(function () { nightEl.classList.add('on'); }, 30);     // timeout, not rAF: rAF pauses in a hidden tab
    }, had ? 500 : 0);
  }

  /* ---- compositions: each chapter = a transparent bg + character layers (src OR anim).
         `css` is the layer's position/size — tweak freely. Dragons use right/bottom anchoring
         (their image has transparent smoke/fire room at the top-left). ---- */
  var COMP = {
    cavern: { bg:'cav-bg', layers:[
      /* the AI-made loop (breathing, eye opens halfway) — transparent video over the static cave.
         The smoke, the coin glints and the hover glow/label are all drawn in code on an 'aura'
         box that sits exactly over the video. */
      /* the treasure chest: closed still, swaps to the open art on the word "jewels" with a gold
         bloom + sparkle burst, then shuts again (see runFx). Faces right, per the mockup. */
      { key:'chest', src:'cav-chest-closed', css:'left:16.3%;bottom:28.9vh;width:min(20.6vw,420px)',
        aura:{ glow:'rgba(255,214,120,.65)' }, tap:'chest' },
      { key:'dragonloop', vid:'cav-dragon-loop', ar:1400/1276, css:'right:7%;bottom:8vh;width:min(57vw,1140px)',
        hero:{ label:'Trogdor the Burninator', glow:'rgba(255,96,120,.55)', lt:25, hit:[.27,.31,.84,.8] },
        /* snd: the Seedance breathing had a music pad under it — a proper snore is coming from the user */
        fx:[ { type:'smoke', at:[28, 46] }, { type:'glint', at:[[46,70],[58,74],[66,66],[52,78]] } ] }
    ]},
    /* tavern per the "3 - Tavern 1" mockup: Joe mid-left on the floor, grandma back-right,
       hooded guy far right, the old man BIG in the foreground (so he's last = on top). */
    tavern: { bg:'tav-bg', snd:{ src:'tav-fire', vol:.3 }, layers:[       // fireplace crackle bed for the whole shot
      { key:'joe', vid:'tav-joe-loop', ar:1, css:'left:10%;bottom:24vh;width:min(26vw,520px)',
        hero:{ label:'Joe the Righteous', glow:'rgba(255,214,120,.6)', seekTo:3.0, lt:4, hit:[.22,.14,.72,.82] },
        snd:{ src:'tav-joe-loop-8s', vol:.15 } },
      { src:'tav-char-3', cls:'scared', css:'right:15%;bottom:50vh;width:min(14vw,280px)' },
      { src:'tav-char-2', cls:'scared', css:'right:3%;bottom:30vh;width:min(16vw,320px)' },
      { src:'tav-char-1', cls:'scared', css:'right:18%;bottom:22vh;width:min(19.5vw,390px)' }
    ]},
    woodland: { bg:'wood-bg', layers:[
      { key:'joe', vid:'wood-joe-loop', ar:1400/1520, cls:'gallop', css:'left:47%;bottom:26vh;width:min(18vw,360px)',   // gallop loop; rides off into the distance, weaving
        to:{ css:'left:48.5%;bottom:40vh;width:min(9vw,180px)', delay:1200, dur:6500 } },
      { src:'wood-char-1', cls:'idle', css:'left:29%;bottom:26vh;width:min(12vw,240px)' },
      { src:'wood-char-2', cls:'idle', css:'left:68%;bottom:26vh;width:min(13vw,260px)' }
    ]},
    /* CASTLE = 7-shot sequence traced from the "5 - Castle 1/2/3/4/5/6/13" mockups. Keys persist
       across shots so the engine morphs/crossfades: `joe` = knight arts → designer arts (the
       swap happens while `joecloud` covers him); `dragon` crossfades pose → then SHRINKS via a
       width/position morph in castle6 → gone by castle13 (only the `wisp` remains). Smoke clouds
       are the cas-smoke assets; a --flip:-1 on a cloud mirrors it (the idle keyframe reads it). */
    castle1: { bg:'cas-bg', layers:[          // standoff — sword drawn, dragon huffs
      { key:'joe', src:'cas-joe-2', css:'left:21%;bottom:25vh;width:min(16vw,320px)' },
      { key:'dragon', src:'cas-dragon-2', css:'right:10%;bottom:23vh;width:min(38vw,760px)' }
    ]},
    castle2: { bg:'cas-bg', layers:[          // fire vs shield
      { key:'joe', src:'cas-joe-1', css:'left:18%;bottom:24vh;width:min(17vw,340px)' },
      { key:'dragon', src:'cas-dragon-1', css:'right:9%;bottom:17vh;width:min(65vw,1300px)' }
    ]},
    castle3: { bg:'cas-bg', layers:[          // both suddenly unsure
      { key:'joe', src:'cas-joe-3', css:'left:19%;bottom:25vh;width:min(16vw,320px)' },
      { key:'dragon', src:'cas-dragon-3', css:'right:10%;bottom:24vh;width:min(32vw,640px)' }
    ]},
    castle4: { bg:'cas-bg', layers:[          // Joe POOFS — knight key dropped, cloud takes his spot
      { key:'dragon', src:'cas-dragon-4', css:'right:10%;bottom:24vh;width:min(32vw,640px)' },
      { key:'joecloud', src:'cas-smoke-1', cls:'idle', css:'left:20%;bottom:24vh;width:min(10vw,200px)' }
    ]},
    castle5: { bg:'cas-bg', layers:[          // designer Joe revealed — now the DRAGON poofs
      { key:'joe', src:'cas-designer-1', css:'left:19%;bottom:26vh;width:min(13vw,260px)' },
      { key:'dragon', src:'cas-dragon-4', css:'right:10%;bottom:24vh;width:min(32vw,640px)' },
      { key:'drcloud', src:'cas-smoke-1', cls:'idle', css:'left:63%;bottom:22vh;width:min(14vw,280px)' },
      { key:'drcloud2', src:'cas-smoke-1', cls:'idle', css:'left:72%;bottom:22vh;width:min(13vw,260px);--flip:-1' }
    ]},
    castle6: { bg:'cas-bg', layers:[          // dragon SHRINKS in the dissipating smoke
      { key:'joe', src:'cas-designer-1', css:'left:19%;bottom:26vh;width:min(13vw,260px)' },
      { key:'dragon', src:'cas-dragon-4', css:'right:25%;bottom:27vh;width:min(9vw,180px)' },
      { key:'joecloud', src:'cas-smoke-1', cls:'idle', css:'left:20.5%;bottom:25vh;width:min(8vw,160px)' },
      { key:'drcloud', src:'cas-smoke-1', cls:'idle', css:'left:63.5%;bottom:23vh;width:min(10vw,200px)' }
    ]},
    castle13: { bg:'cas-bg', layers:[         // the Designer, and a wisp where the beast stood
      { key:'joe', src:'cas-designer-2', css:'left:19%;bottom:27vh;width:min(14vw,280px)' },
      { key:'wisp', src:'cas-smoke-2', cls:'idle', css:'left:68%;bottom:27vh;width:min(5.5vw,110px)' }
    ]}
  };

  /* ---- VILLAGE = 4-panel storyboard, sizes + positions traced from the "2 - Village 1..4"
         mockups (grid-measured, canvas padding factored in). Same bg + same characters (matched
         by `key`): the dragon FIRE crossfades in place (body pixel-locked) while villagers MORPH.
         Design choreography: pitchfork trio holds mid-left; the redhead (v3) flees UP the centre
         path shrinking; the old man (v1) watches from the RIGHT house doorway then ducks into the
         window; the bonnet girl (v2) starts by the right house and flees off right in P2; the
         mustache kid (v7) runs in from bottom-centre in P2 and flees left; in P4 only the
         terrified drop-guy + v7 remain. Panels advance on an equal timer (see runVillageSeq). ---- */
  var VIL_DRAGON = 'right:13%;bottom:21vh;width:min(62vw,1240px)';   // Trogdor — body 25vw; nudged 1% left so the tail clears the old man's window
  function vil(dragon, p){
    /* kept simple on purpose: just the pitchfork guy and the scared curly kid.
       The dragon is the AI huff-and-puff loop (mouth opens ~2.8s in, then stays angry); the flame is
       its own layer on the SAME canvas geometry, scaled from the mouth — 0 in shot 1, growing to
       full in shot 2. Both use VIL_DRAGON. The flicker clip is registered so its thin neck sits in the mouth
       wedge and its pointed base hides inside the head; the origin (58.4% 46%) is the mouth interior. */
    var L = [
      { key:'vildragon', vid:'vil-dragon-loop', ar:1400/900, css:VIL_DRAGON,
        snd:{ src:'vil-dragon-loop', vol:.55 },                           // the clip's own growl, rebuilt along the 22s picture sequence
        fx:[ { type:'smoke', at:[55, 36] } ] },
      { key:'flame', vid:'vil-flame-loop', ar:1400/900, css:VIL_DRAGON, sc:(p.flame == null ? 0 : p.flame), so:'58.4% 46%', scDur:3000 },   // listed AFTER the dragon → paints in front of him
      { key:'pitch', src:'vil-char-4', cls:'idle', css:p.pitch },    // pitchfork guy — mid-left
      { key:'v5', src:'vil-char-5', cls:'idle', css:p.v5 }           // curly — beside him
    ];
    return { bg:'vil-bg', layers:L };
  }
  COMP.village1 = vil('vil-dragon-1', {        // smoke puff — old man at the LIT WINDOW (grounded, not floating on the wall)
    pitch:'left:19%;bottom:31vh;width:min(11vw,220px)', v5:'left:27%;bottom:33vh;width:min(10vw,200px)',
    v3:'left:37%;bottom:37vh;width:min(8vw,160px)',     v1:'left:75%;bottom:49vh;width:min(10vw,200px)',
    v2:'left:85%;bottom:33vh;width:min(16vw,320px)' });
  COMP.village2 = vil('vil-dragon-2', {        // the fire comes: flame grows from the mouth to full over ~4.5s
    flame:1,
    pitch:'left:21%;bottom:31vh;width:min(9.5vw,190px)', v5:'left:27%;bottom:33vh;width:min(10vw,200px)',
    v3:'left:43%;bottom:43vh;width:min(6vw,120px)',      v1:'left:76%;bottom:51vh;width:min(8vw,160px)',
    v7:'left:34%;bottom:24vh;width:min(10vw,200px)',     v2:'left:91%;bottom:27vh;width:min(15vw,300px)' });
  /* village3/4 = the same shot held: caption 4 still says comp:'village4', and it must NOT swap the video
     dragon for the static frame-4 art (that was the 'jumps up at the end' bug) — same keys, same art, flame stays full. */
  COMP.village3 = vil('vil-dragon-3', { flame:1,
    pitch:'left:21%;bottom:31vh;width:min(9.5vw,190px)', v5:'left:27%;bottom:33vh;width:min(10vw,200px)' });
  COMP.village4 = vil('vil-dragon-4', { flame:1,
    pitch:'left:21%;bottom:31vh;width:min(9.5vw,190px)', v5:'left:27%;bottom:33vh;width:min(10vw,200px)' });
  COMP._village4_old = { bg:'vil-bg', layers:[   // (unused) the traced frame-4 design, kept for reference
    { key:'dragon', src:'vil-dragon-4', css:VIL_DRAGON },
    { key:'pitchdrop', src:'vil-pitch-drop', cls:'idle', css:'left:12%;bottom:26vh;width:min(13.5vw,270px)' },
    { key:'v7', src:'vil-char-7', cls:'idle', css:'left:1%;bottom:26vh;width:min(10vw,200px)' }
  ]};   // key 'pitch' absent → the charging guy fades out as the terrified drop-guy fades in

  /* ---- captions: each = the line + the chapter it's on + word `triggers` that switch chapter ---- */
  var SCENES = [
    { text:"Many moons ago in a mysterious land there lived a cunning and evil beast who dwelled deep in the darkness....", comp:'cavern' },
    { text:"He had a fascination for gold, jewels, treasures and anything that sparkled...but also something more sinister...the local villagers!",
      comp:'cavern', triggers:[ { at:'jewels', fx:'chest' }, { at:'more sinister', comp:'village1' } ] },
    { text:"He had many names, Beast, Dragon, Death, but the one that put fear into the hearts of the locals was...Trogdor! Trogdor The Burninator...",
      comp:'village1' },   // village1→2→3→4 now advance on an equal timer (see runVillageSeq), not on these words
    { text:"Luckily one day a brave young man appeared to try and best this beast! His goal? To save the villagers and stop this evil...",
      comp:'village4', triggers:[ { at:'Luckily one day', comp:'tavern' } ] },
    { text:"“Joe the Righteous” they called! He set off a journey to find the beast, searching through forests, rolling hills and treacherous mountains...",
      comp:'tavern', triggers:[ { at:'Joe the Righteous', comp:'woodland' } ] },
    { text:"He went toe to toe with the beast in an epic battle lasting for days, facing fire and all his might and...Wait a minute...I think this is the wrong story...",
      comp:'castle1', triggers:[ { at:'facing fire', comp:'castle2' }, { at:'Wait a minute', comp:'castle3' } ] },
    { text:"Ah yes, sorry. Oops, that's a different Joe. This one is the story of a Designer...yet still an all great and powerful Designer...",
      comp:'castle4', triggers:[ { at:'different Joe', comp:'castle5' }, { at:'story of a Designer', comp:'castle6' } ],
      end:{ delay:1600, run:function(){ setComp('castle13'); setTimeout(fadeToBlack, 3200); } } }
  ];

  /* ---- timings (ms) ---- */
  var T = { revealAt:700, revealDur:2200, boxFadeAt:2700, menuDropAt:3000, firstTypeAt:3500,
    typeSpeed:30, pauseDot:200, pauseEllipsis:400, readPerChar:10, readMin:1200, bgFade:600, endFade:1500,
    villagePanel:2200 };   // the village's 2nd shot lands this long after the 1st (equal timing, not word-driven)

  /* ---- styles ---- */
  function gallopFrames(){                                   // 12 stops: a slow S-weave (x, tilt); the stride bob lives in the clip
    var k = '@keyframes jjst-gallop{';
    for (var i = 0; i <= 12; i++) { var a = Math.sin(Math.PI * 2 * i / 12);
      k += (i / 12 * 100).toFixed(2) + '%{transform:translate(' + (a * 7).toFixed(2) + '%,0) rotate(' + (a * 2.4).toFixed(2) + 'deg);}'; }
    return k + '}';
  }
  var CSS =
  '#jjst{position:fixed;inset:0;z-index:2000;overflow:hidden;background:#0b1b2e;font-family:\'Joes Journey Headline\',sans-serif;}'+
  '#jjst-bgwrap{position:absolute;inset:0;overflow:hidden;}'+
  '#jjst-sky{position:absolute;top:0;left:0;width:100%;height:auto;display:block;}'+
  '#jjst-night{position:absolute;inset:0;opacity:0;transition:opacity .9s ease;pointer-events:none;}'+   // sits between the sky and the boards (DOM order)
  '#jjst-night.on{opacity:1;}#jjst-night svg{width:100%;height:100%;display:block;}'+
  '#jjst-night .jjst-moonw{transform-box:fill-box;transform-origin:50% 50%;animation:jjstMoonW 7s ease-in-out infinite;}'+
  '#jjst-night .jjst-mpulse{animation:jjstMPulse 7s ease-in-out infinite;}'+
  '#jjst-night .jjst-tw{animation:jjstTw var(--d,3s) ease-in-out var(--o,0s) infinite;}'+
  '@keyframes jjstMoonW{0%,100%{transform:scale(.94);}50%{transform:scale(1.1);}}'+
  '@keyframes jjstMPulse{0%,100%{opacity:.3;}50%{opacity:1;}}'+
  '@keyframes jjstTw{0%,100%{opacity:.35;}50%{opacity:1;}}'+
  '#jjst .jjst-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;will-change:opacity;}'+
  '#jjst-layers{position:absolute;inset:0;z-index:3;pointer-events:none;}'+
  '#jjst-layers .jjst-layer{position:absolute;height:auto;display:block;will-change:transform,opacity;}'+
  /* ---- video layers + their aura ---- */
  '#jjst-layers video.jjst-layer{object-fit:contain;background:transparent;pointer-events:none;}'+
  '#jjst-layers video.jjst-layer.hero{pointer-events:auto;cursor:pointer;transform-origin:50% 100%;transition:scale .4s cubic-bezier(.34,1.56,.64,1);}'+
  '#jjst-layers video.jjst-layer.hero.hov{scale:1.1;}'+
  '#jjst-layers .jjst-aura{position:absolute;pointer-events:none;z-index:2;}'+
  '#jjst-layers .jjst-aura .aglow{position:absolute;left:-12%;top:-8%;width:124%;height:116%;border-radius:50%;'+
    'background:radial-gradient(ellipse at 50% 58%,var(--gc,rgba(255,255,255,.4)) 0%,transparent 62%);filter:blur(18px);'+
    'opacity:0;transform:scale(.92);transition:opacity .45s ease,transform .45s ease;}'+
  '#jjst-layers .jjst-aura.hov .aglow{opacity:1;transform:scale(1);}'+
  '#jjst-layers .jjst-aura .alabel{position:absolute;left:50%;top:-4%;transform:translate(-50%,8px);padding:6px 16px;border-radius:999px;'+
    'background:rgba(10,14,26,.72);border:1px solid rgba(255,255,255,.28);color:#fff;font-size:clamp(12px,1.05vw,17px);font-weight:700;letter-spacing:.04em;white-space:nowrap;'+
    'opacity:0;transition:opacity .35s ease,transform .35s cubic-bezier(.34,1.56,.64,1);}'+
  '#jjst-layers .jjst-aura.hov .alabel{opacity:1;transform:translate(-50%,0);}'+
  '#jjst-layers .jjst-aura.lit .aglow{opacity:1;transform:scale(1);}'+
  '#jjst-layers .jjst-layer.pop{animation:jjstPop .55s cubic-bezier(.34,1.56,.64,1);transform-origin:50% 100%;}'+
  '@keyframes jjstPop{0%{scale:1;}40%{scale:1.07 .95;}70%{scale:.98 1.03;}100%{scale:1;}}'+
  /* nostril smoke: a soft puff that drifts up-left, grows and thins */
  '#jjst-layers .jjst-aura .puff{position:absolute;width:5.5%;aspect-ratio:1;border-radius:50%;margin:-2.75% 0 0 -2.75%;'+
    'background:radial-gradient(circle,rgba(226,232,240,.85) 0%,rgba(200,208,220,.55) 45%,rgba(200,208,220,0) 70%);'+
    'animation:jjstPuff 2.6s ease-out forwards;}'+
  '@keyframes jjstPuff{0%{opacity:0;transform:translate(0,0) scale(.4);}18%{opacity:.9;}100%{opacity:0;transform:translate(-14%,-140%) scale(1.9);}}'+
  /* coin glints: a four-point sparkle that blinks in and out */
  '#jjst-layers .jjst-aura .glint{position:absolute;width:3.2%;aspect-ratio:1;margin:-1.6% 0 0 -1.6%;'+
    'background:radial-gradient(circle,#fff 0%,rgba(255,255,255,.9) 18%,rgba(255,255,255,0) 22%),'+
    'linear-gradient(#fff,#fff) center/100% 12% no-repeat,linear-gradient(#fff,#fff) center/12% 100% no-repeat;'+
    'animation:jjstGlint .9s ease-in-out forwards;filter:drop-shadow(0 0 6px rgba(255,255,255,.9));}'+
  '@keyframes jjstGlint{0%{opacity:0;transform:scale(.2) rotate(0deg);}50%{opacity:1;transform:scale(1) rotate(45deg);}100%{opacity:0;transform:scale(.2) rotate(90deg);}}'+
  '@keyframes jjst-scared{0%,100%{transform:rotate(-2.2deg);}50%{transform:rotate(2.2deg);}}'+   // tremble in place — no lift, feet stay planted
  '.jjst-layer.scared{animation:jjst-scared .5s ease-in-out infinite;transform-origin:center bottom;}'+
  '@keyframes jjst-idle{0%,100%{transform:scaleX(var(--flip,1)) scaleY(1);}50%{transform:scaleX(var(--flip,1)) scaleY(.965);}}'+   // grounded squash bob (origin bottom) — nothing floats
  '.jjst-layer.idle{animation:jjst-idle 2.5s ease-in-out infinite;transform-origin:center bottom;}'+
  '.jjst-layer.gallop{animation:jjst-gallop 2.8s ease-in-out infinite;transform-origin:center bottom;}'+
  gallopFrames()+
  '.jjst-layer.morph{transition:left .8s cubic-bezier(.4,0,.2,1),right .8s cubic-bezier(.4,0,.2,1),bottom .8s cubic-bezier(.4,0,.2,1),width .8s cubic-bezier(.4,0,.2,1),opacity .55s ease;}'+
  '.jjst-layer.enter{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s cubic-bezier(.22,1,.36,1);}'+
  '.jjst-layer.enter.in{opacity:1;transform:translateY(0);}'+
  '#jjst-black{position:absolute;left:50%;top:55%;width:0;height:0;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 90px 24px rgba(255,176,84,.35) inset,0 0 0 9999px #05080f;z-index:8;pointer-events:none;}'+
  '#jjst-fade{position:absolute;inset:0;background:#05080f;opacity:0;z-index:10;pointer-events:none;transition:opacity '+T.endFade+'ms ease;}'+
  '#jjst-loader{position:absolute;inset:0;z-index:20;background:#05080f;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;transition:opacity .6s ease;}'+
  '#jjst-loader.hide{opacity:0;pointer-events:none;}'+
  '#jjst-loader .ring{width:46px;height:46px;border-radius:50%;border:4px solid rgba(244,197,96,.22);border-top-color:#f4c560;animation:jjst-spin .9s linear infinite;}'+
  '#jjst-loader .txt{font-family:\'Joes Journey Headline\',sans-serif;color:#e8d9b5;font-size:15px;letter-spacing:1px;}'+
  '@keyframes jjst-spin{to{transform:rotate(360deg);}}'+
  '#jjst-progress{position:absolute;left:0;top:0;width:100%;height:5px;background:rgba(255,255,255,.08);z-index:6;opacity:0;transition:opacity .6s ease;}'+
  '#jjst-progress.on{opacity:1;}'+
  '#jjst-progress-fill{height:100%;width:0;background:linear-gradient(90deg,#FF00F5,#ff7df4);box-shadow:0 0 12px rgba(255,0,245,.7);transition:width .6s ease;}'+
  '#jjst-cap{position:absolute;left:50%;bottom:7vh;transform:translateX(-50%);width:min(83vw,1350px);aspect-ratio:1295 / 200;z-index:5;opacity:0;transition:opacity .8s ease;background:url(\''+BANNER+'\') no-repeat center/contain;display:flex;align-items:center;justify-content:center;pointer-events:auto;cursor:pointer;}'+
  '#jjst-cap.on{opacity:1;}'+
  '#jjst-cap-text{width:72%;overflow:visible;text-align:left;color:#3a2a12;font-size:clamp(15px,1.6vw,27px);line-height:1.26;white-space:pre-wrap;}'+   // height is set per line to its FINISHED size (see typeText) — centred in the box, line 1 never moves
  /* the reader's own pace: a Next chip appears once the line has finished typing */
  /* Previous / Next scene — always there under the banner (per the Figma frame) */
  '#jjst-nav{position:absolute;left:50%;transform:translateX(-50%);width:min(83vw,1350px);bottom:max(8px,calc(7vh - 46px));display:flex;justify-content:space-between;padding:0 8%;box-sizing:border-box;z-index:6;opacity:0;pointer-events:none;transition:opacity .6s ease;}'+
  '#jjst-nav.on{opacity:1;pointer-events:auto;}'+
  '#jjst-nav button{display:flex;align-items:center;gap:10px;padding:0 16px;height:36px;border-radius:6px;border:1px solid rgba(255,255,255,.4);background:rgba(6,10,18,.55);color:#fff;font-family:inherit;font-size:12px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;cursor:pointer;transition:background .2s ease,opacity .3s ease;}'+
  '#jjst-nav button:hover{background:rgba(255,0,245,.28);}'+
  '#jjst-nav button .arr{font-size:15px;line-height:1;}'+
  '#jjst-nav button[disabled]{opacity:.35;pointer-events:none;}'+
  /* tavern Joe is a character you can prod: grows on hover, a warm glow blooms behind on press */
  '.jjst-layer.joehero{pointer-events:auto;cursor:pointer;transform-origin:50% 100%;transition:scale .35s cubic-bezier(.34,1.56,.64,1),filter .45s ease;}'+
  '.jjst-layer.joehero:hover{scale:1.07;}'+
  '.jjst-layer.joehero.lit{filter:drop-shadow(0 0 26px rgba(255,214,120,.95)) drop-shadow(0 0 80px rgba(255,180,60,.55));}'+
  '@keyframes jjstNextNudge{0%,100%{translate:0 0;}50%{translate:4px 0;}}'+
  '';

  var style = document.createElement('style'); style.id = 'jj-storytime-style'; style.textContent = CSS; document.head.appendChild(style);

  /* ---- markup ---- */
  var wrap = document.createElement('div'); wrap.id = 'jjst';
  wrap.innerHTML =
    '<div id="jjst-bgwrap"><img id="jjst-sky" alt=""><div id="jjst-night"></div></div>'+
    '<div id="jjst-layers"></div>'+
    '<div id="jjst-black"></div>'+
    '<div id="jjst-fade"></div>'+
    '<div id="jjst-progress"><div id="jjst-progress-fill"></div></div>'+
    '<div id="jjst-cap"><div id="jjst-cap-text"></div></div>'+
    '<div id="jjst-nav"><button id="jjst-prev" type="button" data-cursor="hover"><span class="arr">\u2190</span>Previous</button>'+
    '<button id="jjst-nextsc" type="button" data-cursor="hover">Next scene<span class="arr">\u2192</span></button></div>'+
    '<div id="jjst-loader"><div class="ring"></div><div class="txt">Loading the tale…</div></div>';

  /* ---- composition: bg crossfade + character layers ---- */
  var bgWrap, layersWrap, curComp = null, curBg = null, curBgLayer = null, animTimers = [], layerRecs = {};
  function showBg(name){
    if (name === curBg) return; curBg = name;
    var incoming = document.createElement('img'); incoming.className = 'jjst-bg'; incoming.src = F(name);
    incoming.style.opacity = '0'; bgWrap.appendChild(incoming);
    var outgoing = curBgLayer; void incoming.offsetWidth;
    incoming.style.transition = 'opacity ' + T.bgFade + 'ms ease'; incoming.style.opacity = '1';
    if (outgoing) { outgoing.style.transition = 'opacity ' + T.bgFade + 'ms ease'; outgoing.style.opacity = '0';
      setTimeout(function () { if (outgoing.parentNode) outgoing.remove(); }, T.bgFade + 80); }
    curBgLayer = incoming;
  }
  function clearAnims(){ animTimers.forEach(function (t) { clearInterval(t); }); animTimers = []; }
  /* ---- a video layer's soundtrack: the clip's own audio, extracted to mp3 and played through Howler
     (the site's mute button rules it), kept in step with the muted <video>'s clock ---- */
  function attachSound(video, snd){
    if (!window.Howl) return;
    var h = new Howl({ src: [GB + 'story-' + snd.src + '.mp3' + AV], volume: snd.vol == null ? .5 : snd.vol, preload: true });
    window.jjAudio = window.jjAudio || { sounds: [], muted: false, volume: 1.0 };
    window.jjAudio.sounds.push(h);
    var id = null, lastT = 0;
    var started = false;
    function sync(){
      if (video.paused || !video.isConnected) return;
      try {
        if (id == null || !h.playing(id)) {
          id = h.play();
          if (!started) { started = true; h.volume(0, id); h.fade(0, snd.vol == null ? .5 : snd.vol, 2500, id); }   // ease in
        }
        var d = h.duration() || 0;
        if (d) h.seek(video.currentTime % d, id);
      } catch (e) {}
    }
    video.addEventListener('playing', function () { if (!started) sync(); });
    video.addEventListener('seeked', sync);
    video.addEventListener('pause', function () { try { if (id != null) h.pause(id); } catch (e) {} });
    video.addEventListener('timeupdate', function () { var t = video.currentTime; if (t < lastT - 0.8) sync(); lastT = t; });   // the loop wrapped
    h.once('load', sync);
    h.once('unlock', sync);                               // first gesture: fall into step with the picture
    video._howl = h;
  }
  /* ---- the aura: a box exactly over a layer that carries its glow, label and code effects ---- */
  function makeAura(L, el){
    var aura = document.createElement('div'); aura.className = 'jjst-aura';
    aura.style.cssText = L.css + ';aspect-ratio:' + (L.ar || 1) + ';';
    var h = L.hero || L.aura || {};
    aura.style.setProperty('--gc', h.glow || 'rgba(255,255,255,.4)');
    aura.innerHTML = '<div class="aglow"></div>' + (h.label ? '<div class="alabel" style="top:' + (h.lt == null ? -4 : h.lt) + '%">' + h.label + '</div>' : '');
    if (L.hero) {
      var hit = null;                                       // poster alpha map: hover/click only over the character, not the empty canvas
      if (el.tagName === 'VIDEO') { var pim = new Image(); pim.crossOrigin = 'anonymous';
        pim.onload = function () { try { var c = document.createElement('canvas'), cx = c.getContext('2d'); c.width = 160; c.height = Math.max(1, Math.round(160 / (L.ar || 1)));
          cx.drawImage(pim, 0, 0, c.width, c.height); hit = { w: c.width, h: c.height, d: cx.getImageData(0, 0, c.width, c.height).data }; } catch (e) {} };
        pim.src = el.poster; }
      function over(e){
        var r = el.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
        if (hit) { var x = Math.floor(fx * hit.w), y = Math.floor(fy * hit.h); return x >= 0 && y >= 0 && x < hit.w && y < hit.h && hit.d[(y * hit.w + x) * 4 + 3] > 40; }
        var b = h.hit; return !b || (fx >= b[0] && fy >= b[1] && fx <= b[2] && fy <= b[3]);   // fallback: a box round the character
      }
      var isHov = false;
      function setHov(on){ if (on === isHov) return; isHov = on;
        el.classList.toggle('hov', on); aura.classList.toggle('hov', on);
        if (on) el.setAttribute('data-cursor', 'hover'); else el.removeAttribute('data-cursor');
        try { el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })); } catch (e) {}   // the site cursor re-reads data-cursor on mouseover
      }
      el.addEventListener('pointermove', function (e) { setHov(over(e)); });
      el.addEventListener('pointerleave', function () { setHov(false); });
      if (L.hero.seekTo != null && el.tagName === 'VIDEO') el.addEventListener('click', function (e) {
        if (!over(e)) return;
        e.stopPropagation();
        try { el.currentTime = L.hero.seekTo; var p = el.play(); if (p && p.catch) p.catch(function () {}); } catch (err) {}
        aura.classList.add('lit'); clearTimeout(aura._litT);
        aura._litT = setTimeout(function () { aura.classList.remove('lit'); }, 1800);
      });
    }
    layersWrap.insertBefore(aura, el);                    // glow sits BEHIND the art
    (L.fx || []).forEach(function (fx) { startFx(aura, fx); });
    return aura;
  }
  function sparkleBurst(aura, n){
    for (var i = 0; i < n; i++) (function (i) { setTimeout(function () {
      if (!aura.isConnected) return;
      var g = document.createElement('i'); g.className = 'glint';
      g.style.left = (28 + Math.random() * 46) + '%'; g.style.top = (14 + Math.random() * 40) + '%';
      aura.appendChild(g); setTimeout(function () { g.remove(); }, 1000);
    }, i * 110); })(i);
  }
  /* named one-shot effects fired from caption words (triggers: { at:'jewels', fx:'chest' }) */
  function runFx(name){
    if (name === 'chest') {
      var rec = layerRecs['chest']; if (!rec) return;
      var el = rec.el, aura = rec.aura;
      el.src = F('cav-chest-open'); el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
      if (aura) { aura.classList.add('lit'); sparkleBurst(aura, 10); }
      clearTimeout(rec.fxT);
      rec.fxT = setTimeout(function () {
        el.src = F('cav-chest-closed'); el.classList.remove('pop');
        if (aura) aura.classList.remove('lit');
      }, 3200);
    }
  }
  /* ---- code-drawn effects on an aura box: nostril smoke, coin glints ---- */
  function startFx(aura, fx){
    var t;
    if (fx.type === 'smoke') {
      t = setInterval(function () {
        if (!aura.isConnected) { clearInterval(t); return; }
        for (var i = 0; i < 3; i++) (function (i) { setTimeout(function () {
          var p = document.createElement('i'); p.className = 'puff';
          p.style.left = (fx.at[0] + (Math.random() - .5) * 2) + '%'; p.style.top = fx.at[1] + '%';
          p.style.animationDuration = (2.3 + Math.random() * .8) + 's';
          aura.appendChild(p); setTimeout(function () { p.remove(); }, 3400);
        }, i * 260); })(i);
      }, 3600);
    } else if (fx.type === 'glint') {
      t = setInterval(function () {
        if (!aura.isConnected) { clearInterval(t); return; }
        var at = fx.at[Math.floor(Math.random() * fx.at.length)];
        var g = document.createElement('i'); g.className = 'glint';
        g.style.left = at[0] + '%'; g.style.top = at[1] + '%';
        aura.appendChild(g); setTimeout(function () { g.remove(); }, 1000);
      }, 1700 + Math.random() * 600);
    }
    animTimers.push(t);
  }
  function fadeRemove(el){ if (el.tagName === 'VIDEO') { try { el.pause(); } catch (e) {} if (el._howl) { var hw = el._howl; setTimeout(function () { try { hw.unload(); } catch (e2) {} }, 700); } }
    el.style.transition = 'opacity .5s ease'; el.style.opacity = '0';
    setTimeout(function () { if (el.parentNode) el.remove(); }, 560); }
  function keyOf(L, idx){ return L.key || (L.anim ? 'anim:' + L.anim[0] : L.src) || ('i' + idx); }
  function applyScale(el, L, prevSc){                        // a layer that scales between shots (the flame)
    if (L.sc == null) return;
    el.style.transformOrigin = L.so || '50% 50%';
    el.style.scale = prevSc === '' ? String(L.sc) : prevSc;      // start from where it was (cssText just wiped it)
    void el.offsetWidth;
    el.style.transition = 'opacity .55s ease, scale ' + (L.scDur || 4500) + 'ms ease-in-out';
    el.style.scale = String(L.sc);
  }
  function applyMove(el, L){                                 // slow secondary move within a shot (e.g. Joe rides into the distance)
    if (!L.to) return; var t = L.to;
    animTimers.push(setTimeout(function () {
      var e = t.ease || 'ease-in-out', d = t.dur || 4000;
      el.style.transition = ['left', 'right', 'bottom', 'width'].map(function (p) { return p + ' ' + d + 'ms ' + e; }).join(',');
      t.css.split(';').forEach(function (decl) { var c = decl.indexOf(':'); if (c > 0) el.style.setProperty(decl.slice(0, c).trim(), decl.slice(c + 1).trim()); });
    }, t.delay || 0));
  }
  function buildLayers(layers){
    clearAnims(); layers = layers || [];
    var next = {}; layers.forEach(function (L, idx) { next[keyOf(L, idx)] = true; });
    Object.keys(layerRecs).forEach(function (k) { if (!next[k]) { fadeRemove(layerRecs[k].el); if (layerRecs[k].aura) fadeRemove(layerRecs[k].aura); delete layerRecs[k]; } });
    layers.forEach(function (L, idx) {
      var k = keyOf(L, idx), first = F(L.anim ? L.anim[0] : L.src), rec = layerRecs[k], el;
      var prevSc = (rec && rec.el && rec.el.style) ? rec.el.style.scale : '';
      if (rec && ((rec.el.tagName === 'VIDEO') !== !!L.vid)) {   // kind changed under the same key: start fresh
        fadeRemove(rec.el); if (rec.aura) fadeRemove(rec.aura); delete layerRecs[k]; rec = null;
      }
      if (L.vid) {                                           // ---- a transparent looping video layer ----
        first = L.vid;
        if (rec && rec.src === first) { el = rec.el; el.style.cssText = L.css; }
        else {
          if (rec) { fadeRemove(rec.el); if (rec.aura) fadeRemove(rec.aura); }
          el = document.createElement('video');
          el.className = 'jjst-layer' + (L.cls ? ' ' + L.cls : '') + (L.hero ? ' hero' : '');
          el.muted = true; el.loop = true; el.playsInline = true; el.autoplay = true; el.preload = 'auto';
          el.setAttribute('muted', ''); el.setAttribute('playsinline', '');
          el.poster = GB + 'story-' + L.vid + '-poster.webp' + AV;
          el.innerHTML = '<source src="' + GB + 'story-' + L.vid + '.mov' + AV + '" type=\'video/mp4; codecs="hvc1"\'>' +
                         '<source src="' + GB + 'story-' + L.vid + '.webm' + AV + '" type="video/webm">';
          el.style.cssText = L.css + ';opacity:0'; layersWrap.appendChild(el);
          requestAnimationFrame(function () { el.style.opacity = '1'; });
          var pr = el.play(); if (pr && pr.catch) pr.catch(function () {});   // blocked → the poster stands in
          rec = layerRecs[k] = { el: el, src: first };
          rec.aura = makeAura(L, el);
          if (L.snd) attachSound(el, L.snd);
        }
        applyScale(el, L, prevSc); applyMove(el, L);
        return;                                                // the img branches below don't apply
      }
      if (rec && rec.src !== first) {                        // ART CHANGE = a pose cut: ghost of the OLD art at the
        el = rec.el;                                         // OLD position fades out while the NEW art SNAPS into
        var ghost = el.cloneNode(false);                     // place underneath. No position morph — sliding a
        ghost.src = el.currentSrc || el.src;                 // differently-padded canvas around reads as a weird jump.
        ghost.style.cssText = el.style.cssText + ';opacity:1;transition:opacity .55s ease;animation:none;';
        el.className = 'jjst-layer' + (L.cls ? ' ' + L.cls : '');
        el.src = first; el.style.cssText = L.css; rec.src = first;
        el.parentNode.insertBefore(ghost, el.nextSibling);
        requestAnimationFrame(function () { ghost.style.opacity = '0'; });
        setTimeout(function () { if (ghost.parentNode) ghost.remove(); }, 620);
        void el.offsetWidth;
        el.className = 'jjst-layer morph' + (L.cls ? ' ' + L.cls : '');
      } else if (rec) {                                      // same art: smooth position/size morph (walks, the shrink)
        el = rec.el;
        el.className = 'jjst-layer morph' + (L.cls ? ' ' + L.cls : '');
        el.style.cssText = L.css;
      } else if (L.cls && L.cls.indexOf('enter') >= 0) {     // fresh, slide-in
        el = document.createElement('img'); el.alt = ''; el.className = 'jjst-layer ' + L.cls;
        el.style.cssText = L.css; el.src = first; layersWrap.appendChild(el);
        requestAnimationFrame(function () { el.classList.add('in'); });
        rec = layerRecs[k] = { el: el, src: first };
      } else {                                               // fresh, fade-in
        el = document.createElement('img'); el.alt = '';
        el.className = 'jjst-layer morph' + (L.cls ? ' ' + L.cls : '');
        el.style.cssText = L.css + ';opacity:0'; el.src = first; layersWrap.appendChild(el);
        requestAnimationFrame(function () { el.style.opacity = '1'; });
        rec = layerRecs[k] = { el: el, src: first };
        if (L.aura || L.hero) rec.aura = makeAura(L, el);
      }
      applyScale(el, L, prevSc);
      if (L.cls && /\b(idle|scared)\b/.test(L.cls)) {        // each character on its own beat + tempo
        var trem = /\bscared\b/.test(L.cls);
        el.style.animationDelay = '-' + ((idx * 0.83) % 2.5).toFixed(2) + 's';
        el.style.animationDuration = trem ? (0.42 + (idx % 3) * 0.09).toFixed(2) + 's' : (2.2 + (idx % 3) * 0.4).toFixed(1) + 's';
      }
      if (L.tap && !el._tapWired) {                              // a pressable prop (e.g. the chest)
        el._tapWired = true;
        el.style.pointerEvents = 'auto'; el.style.cursor = 'pointer'; el.setAttribute('data-cursor', 'hover');
        el.addEventListener('click', function (e) { e.stopPropagation(); runFx(L.tap); });
      }
      if (L.cls && L.cls.indexOf('joehero') >= 0 && !el._heroWired) {
        el._heroWired = true;
        el.setAttribute('data-cursor', 'hover');
        el.addEventListener('click', function (e) {
          e.stopPropagation();
          el.classList.add('lit');
          clearTimeout(el._litT);
          el._litT = setTimeout(function () { el.classList.remove('lit'); }, 2600);
          /* when the alternate-expression art lands (e.g. tav-joe-2), swap el.src here for the beat */
        });
      }
      if (L.anim) { var i = 0; (function (r, arr, intv) {
        animTimers.push(setInterval(function () { i = (i + 1) % arr.length; r.el.src = F(arr[i]); r.src = F(arr[i]); }, intv || 400));
      })(rec, L.anim, L.int); }
      applyMove(el, L);
    });
  }
  var panelTimers = [];
  function clearPanels(){ panelTimers.forEach(function (t) { clearTimeout(t); }); panelTimers = []; }
  function runVillageSeq(){                          // village1 is up — advance 2→3→4 at equal intervals
    clearPanels();
    ['village2'].forEach(function (name, i) {                 // shots 3 + 4 retired — two is plenty
      panelTimers.push(setTimeout(function () { setComp(name); }, T.villagePanel * (i + 1)));
    });
  }
  /* a looping bed tied to a shot (the tavern fireplace): fades in on mount, out when the shot changes */
  var compHowl = null, compSrc = null;
  function setCompSound(snd){
    var src = snd ? snd.src : null; if (src === compSrc) return; compSrc = src;
    if (compHowl) { (function (old) { try { old.fade(old.volume(), 0, 800); } catch (e) {} setTimeout(function () { try { old.unload(); } catch (e2) {} }, 900); })(compHowl); compHowl = null; }
    if (!snd || !window.Howl) return;
    var v = snd.vol == null ? .4 : snd.vol;
    var h = compHowl = new Howl({ src: [GB + 'story-' + snd.src + '.mp3' + AV], loop: true, volume: 0, preload: true });
    window.jjAudio = window.jjAudio || { sounds: [], muted: false, volume: 1.0 }; window.jjAudio.sounds.push(h);
    function go(){ if (compHowl !== h) return; try { if (!h.playing()) { h.play(); h.fade(0, v, 1500); } } catch (e) {} }
    h.once('load', go); h.once('unlock', go);
  }
  function setComp(name){
    if (name === curComp) return;
    if (name === 'village1' && typeof curComp === 'string' && curComp.indexOf('village') === 0) return; // don't restart the village once it's running (2nd caption keeps comp:'village1')
    curComp = name;
    var c = COMP[name]; if (!c) return;
    showBg(c.bg); setNight(c.bg); buildLayers(c.layers); setCompSound(c.snd);
    if (name === 'village1') runVillageSeq();        // start the equal-timed dragon-fire sequence
    else if (name.indexOf('village') !== 0) clearPanels();  // left the village → cancel any pending shots
  }

  function revealFromBlack(){ var b = document.getElementById('jjst-black');
    b.style.transition = 'width ' + T.revealDur + 'ms ease, height ' + T.revealDur + 'ms ease';
    b.style.width = '260vmax'; b.style.height = '260vmax';
    setTimeout(function () { b.style.display = 'none'; }, T.revealDur + 120); }
  function fadeToBlack(){ var f = document.getElementById('jjst-fade'); void f.offsetWidth; f.style.opacity = '1';
    setTimeout(function () {
      if (window.jjStory && window.jjStory.unlock) window.jjStory.unlock();
      setCompSound(null); releaseAmbient();
      window.scrollTo(0, 0);
      var w = document.getElementById('jjst');                 // lift the black away → My Story is revealed beneath
      if (w) { w.style.transition = 'opacity 1.4s ease'; w.style.opacity = '0';
        setTimeout(function () { if (w.parentNode) w.remove(); }, 1500); }
    }, T.endFade + 300); }

  /* ---- typing + scene runner ---- */
  var textEl, capEl, prog, fill;
  /* the bar rolls continuously: it eases to the scene's start, then runs linearly to its end over the
     scene's expected length (typing + reading), like a video's playhead — no jumps between captions */
  function typeDuration(text){ var d = 0;
    for (var i = 1; i <= text.length; i++) { var ch = text.charAt(i - 1), t = T.typeSpeed;
      if (ch === '…') t = T.pauseEllipsis;
      else if (ch === '.') { if (text.charAt(i) === '.') t = T.typeSpeed; else if (text.charAt(i - 2) === '.') t = T.pauseEllipsis; else t = T.pauseDot; }
      else if (ch === '!' || ch === '?') t = T.pauseDot;
      d += t; } return d; }
  var progT = null;
  function rollProgress(i, ms){ var N = SCENES.length; clearTimeout(progT);
    fill.style.transition = 'width .35s ease'; fill.style.width = (i / N * 100) + '%';           // ease to the scene's start (matters on Previous)
    progT = setTimeout(function () { fill.style.transition = 'width ' + ms + 'ms linear'; fill.style.width = ((i + 1) / N * 100) + '%'; }, 380); }
  var typeFF = null;                                       // while a line is typing: call to land it instantly
  function typeText(text, triggers, done){
    var trs = (triggers || []).map(function (tr) { var k = text.indexOf(tr.at); return { idx: k < 0 ? -1 : k + tr.at.length, comp: tr.comp, fx: tr.fx, fired: false }; });
    /* measure the finished line first, then lock the block to that height: the banner centres a
       block of the final size, so the text ends up in the middle and nothing shifts while typing */
    textEl.style.height = 'auto'; textEl.style.visibility = 'hidden'; textEl.textContent = text;
    textEl.style.height = textEl.offsetHeight + 'px'; textEl.style.visibility = '';
    textEl.textContent = ''; var i = 0; clearTimeout(textEl._tw);
    var finished = false;
    function fireTo(n){ for (var j = 0; j < trs.length; j++) { if (!trs[j].fired && trs[j].idx >= 0 && n >= trs[j].idx) { trs[j].fired = true; if (trs[j].comp) setComp(trs[j].comp); if (trs[j].fx) runFx(trs[j].fx); } } }
    function finish(){ if (finished) return; finished = true; clearTimeout(textEl._tw); typeFF = null;
      textEl.textContent = text; fireTo(text.length); if (done) done(); }
    typeFF = finish;
    function step(){
      i++; textEl.textContent = text.slice(0, i);
      fireTo(i);
      if (i >= text.length) { finish(); return; }
      var ch = text.charAt(i - 1), delay = T.typeSpeed;
      if (ch === '…') delay = T.pauseEllipsis;
      else if (ch === '.') { if (text.charAt(i) === '.') delay = T.typeSpeed; else if (text.charAt(i - 2) === '.') delay = T.pauseEllipsis; else delay = T.pauseDot; }
      else if (ch === '!' || ch === '?') delay = T.pauseDot;
      textEl._tw = setTimeout(step, delay);
    }
    textEl._tw = setTimeout(step, T.typeSpeed);
  }
  var advTimer = null, curAdvance = null, curScene = 0;    // the pending auto-advance + its manual twin
  function navState(){ var pv = document.getElementById('jjst-prev'); if (pv) pv.disabled = curScene <= 0; }
  function runScene(i){
    if (i >= SCENES.length) return;
    var s = SCENES[i]; curScene = i; navState();
    var readMs = s.end ? s.end.delay : Math.max(T.readMin, s.text.length * T.readPerChar);
    rollProgress(i, typeDuration(s.text) + readMs);
    if (s.comp) setComp(s.comp);
    curAdvance = null;
    typeText(s.text, s.triggers, function () {
      var go = function () { advTimer = null; curAdvance = null;
        if (s.end) s.end.run(); else runScene(i + 1); };
      curAdvance = go;
      advTimer = setTimeout(go, readMs);
    });
  }
  /* Previous / Next scene: drop whatever is pending (typing, auto-advance, village timer) and run caption i */
  function jumpScene(i){
    if (i < 0) return;
    clearTimeout(advTimer); advTimer = null; curAdvance = null; typeFF = null;
    if (textEl) clearTimeout(textEl._tw); clearPanels();
    if (i >= SCENES.length) { var last = SCENES[SCENES.length - 1]; if (last.end) last.end.run(); return; }
    runScene(i);
  }
  /* the ambient music returns (My Story is about to appear) */
  function releaseAmbient(){
    try {
      var A = window.jjAudio; if (!A) return;
      A.takeover = false;
      var amb = A.ambient; if (!amb) return;
      if (!amb.playing()) amb.play();
      amb.volume(0); amb.fade(0, A.ambientTarget || 0.6, 4000);
    } catch (e) {}
  }
  /* jump past the whole tale, straight to My Story waiting underneath */
  function skipStory(){ setCompSound(null);
    releaseAmbient();
    clearTimeout(advTimer); advTimer = null; curAdvance = null;
    if (textEl) clearTimeout(textEl._tw);
    if (window.jjStory && window.jjStory.unlock) window.jjStory.unlock();
    window.scrollTo(0, 0);
    var w = document.getElementById('jjst');
    if (w) { w.style.transition = 'opacity .9s ease'; w.style.opacity = '0'; w.style.pointerEvents = 'none';
      setTimeout(function () { if (w.parentNode) w.remove(); }, 1000); }
  }

  /* ---- mount + choreography ---- */
  var PRELOAD = ['cav-bg','cav-dragon-loop-poster','cav-chest-closed','cav-chest-open','tav-joe-loop-poster','vil-dragon-loop-poster','vil-flame-loop-poster','cav-dragon-1','vil-bg','vil-dragon-1','vil-dragon-2','vil-dragon-3','vil-dragon-4',
    'vil-char-1','vil-char-2','vil-char-3','vil-char-4','vil-char-5','vil-char-7','vil-pitch-drop','tav-bg','tav-joe','tav-char-1','tav-char-2','tav-char-3',
    'wood-bg','wood-joe-loop-poster','wood-char-1','wood-char-2','cas-bg','cas-joe-1','cas-joe-2','cas-joe-3',
    'cas-dragon-1','cas-dragon-2','cas-dragon-3','cas-dragon-4','cas-designer-1','cas-designer-2','cas-smoke-1','cas-smoke-2'];
  function mount(){
    if (document.getElementById('jjst')) return;
    document.body.appendChild(wrap);
    document.getElementById('jjst-sky').src = SKY;
    var docEl = document.documentElement;
    docEl.style.overflow = 'hidden'; document.body.style.overflow = 'hidden';
    window.jjStory = window.jjStory || {}; window.jjStory.unlock = function () { docEl.style.overflow = ''; document.body.style.overflow = ''; };
    /* the tale has its own sound (and a narration to come): the site's ambient track waits until the
       story hands over to My Story (or is skipped). site-footer.js honours jjAudio.takeover. */
    window.jjAudio = window.jjAudio || { sounds: [], muted: false, volume: 1.0 };
    window.jjAudio.takeover = true;
    try { var amb0 = window.jjAudio.ambient; if (amb0 && amb0.playing()) { amb0.fade(amb0.volume(), 0, 600); setTimeout(function () { try { amb0.pause(); } catch (e) {} }, 650); } } catch (e) {}
    window.jjStory.setComp = setComp;                  // debug hooks — jump straight to a comp (used by the local preview)
    window.jjStory.hold = function (n) { setComp(n); clearPanels(); };   // jump + freeze (no village auto-advance)
    bgWrap = document.getElementById('jjst-bgwrap'); layersWrap = document.getElementById('jjst-layers'); nightEl = document.getElementById('jjst-night');
    textEl = document.getElementById('jjst-cap-text'); capEl = document.getElementById('jjst-cap');
    /* press the box: first press lands the typing line instantly, next press moves the story on */
    capEl.addEventListener('click', function (e) {
      e.stopPropagation();
      if (typeFF) { typeFF(); return; }
      if (advTimer !== null) { clearTimeout(advTimer); advTimer = null;
        if (curAdvance) { var go = curAdvance; curAdvance = null; go(); } }
    });
    document.getElementById('jjst-prev').addEventListener('click', function (e) { e.stopPropagation(); jumpScene(curScene - 1); });
    document.getElementById('jjst-nextsc').addEventListener('click', function (e) { e.stopPropagation(); jumpScene(curScene + 1); });
    prog = document.getElementById('jjst-progress'); fill = document.getElementById('jjst-progress-fill');


    /* ---- the gate: the evolution loader (jj-loader.js, variant C) fronts the whole page when
       it's available — real byte progress over the story's heaviest boards while the seven stages
       of Joe paint themselves in. Falls back to the little built-in loader if jj-loader is absent. */
    function beginStory() {
      var ld = document.getElementById('jjst-loader'); if (ld) ld.classList.add('hide');
      PRELOAD.forEach(function (n) { var im = new Image(); im.src = F(n); });   // the rest of the boards — AFTER the loader, so they never race it
      if (window.JJ_STORY_HOLD) {                      // preview mode: instant reveal, no typing/choreography
        var blk = document.getElementById('jjst-black'); blk.style.display = 'none';
        capEl.classList.add('on'); prog.classList.add('on');
        textEl.textContent = 'Preview — jjStory.hold(\'tavern\') to jump comps';
        return;
      }
      setTimeout(revealFromBlack, T.revealAt);
      setTimeout(function () { capEl.classList.add('on'); prog.classList.add('on');
        document.getElementById('jjst-nav').classList.add('on'); navState(); }, T.boxFadeAt);
      setTimeout(function () {
        var nav = document.querySelectorAll('.nav-logo-link, .menu-container');
        nav.forEach(function (n) { n.style.transition = 'none'; n.style.transform = 'translateY(-42px)'; });
        void document.body.offsetWidth;
        nav.forEach(function (n) { n.style.transition = 'transform .9s cubic-bezier(.22,1,.36,1), opacity .9s ease'; n.style.transform = 'translateY(0)'; n.style.opacity = '1'; });
      }, T.menuDropAt);
      setTimeout(function () { runScene(0); }, T.firstTypeAt);
    }
    if (window.JJLoader && window.JJLoader.start) {
      var EVO = [], EVOG = [], EVOB = [];
      for (var ev = 1; ev <= 7; ev++) {
        EVO.push(GB + 'joe-evo-' + ev + '.webp');
        EVOG.push(GB + 'joe-evo-grey-' + ev + '.webp');
        EVOB.push(GB + 'joe-evo-' + ev + 'b.webp');
      }
      document.getElementById('jjst-loader').classList.add('hide');            // plain dark page while the figures warm
      /* the seven figures used to lose the download race against ~40 scene fetches and turn up at 50%+.
         Warm their grey+colour art first (14 small files, dark page, ≤3s), THEN raise the loader and
         start the cavern — the loader's own list hits cache for them, so the row is there from frame one. */
      warmImages(EVO.concat(EVOG), 3000, function () {
      setComp('cavern');                                                     // first chapter up (hidden by the black)
      JJLoader.start({
        variant: 'evolution',
        assets: [F('cav-bg'), F('cav-dragon-1'), F('vil-bg'), F('tav-bg'), F('wood-bg'), F('cas-bg'), BANNER].concat(EVO, EVOG, EVOB),
        stages: EVO, stagesGrey: EVOG, stagesB: EVOB,
        /* measured content boxes per stage (from the loader A/B page) — seats + fill spans */
        stageBounds: [[0.390,0.590],[0.292,0.655],[0.278,0.740],[0.165,0.780],[0.163,0.805],[0.090,0.880],[0.115,0.838]],
        stageBoundsX: [[0.393,0.632],[0.268,0.733],[0.350,0.685],[0.237,0.750],[0.360,0.757],[0.212,0.757],[0.372,0.728]],
        minTime: 4500, maxWait: 18000, decode: true,
        onReady: beginStory
      });
      });
    } else {
      setComp('cavern');
      preloadCritical(beginStory);
    }
  }
  function warmImages(urls, ms, done){
    var left = urls.length, fired = false; function fin(){ if (!fired) { fired = true; done(); } }
    if (!left) return fin();
    urls.forEach(function (u) { var im = new Image(); im.onload = im.onerror = function () { if (--left <= 0) fin(); }; im.src = u; });
    setTimeout(fin, ms);
  }
  function preloadCritical(done){
    var urls = [F('cav-bg'), F('cav-dragon-1'), BANNER], left = urls.length, fired = false;
    function finish(){ if (!fired) { fired = true; done(); } }
    urls.forEach(function (u) { var im = new Image(); im.onload = im.onerror = function () { if (--left <= 0) finish(); }; im.src = u; });
    setTimeout(finish, 9000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
