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
  window.JJ_STORY_BUILD = 's58 · glass buttons grey-on-hover under the fill; stage-level hit manager (hero boxes block nothing → hearth hover works); overlays have no hit area while hidden + own glass buttons; modal guard; chicken left, bones into the distance, instant chicken hop; lone chicken + bones in the cave, the three back by the village house; bones further back; score pill drops in with the nav; one shivering chicken + its bones by the house (tap: twitch, squawk, hop); bones piles are the rattle clip (hover = rattle, click = collect); pressable pixels from baked masks (Joe/Trogdor/window hole — every browser); hearth swells + crackle +40% on hover; loader copy = interactive journey; sound-off ask before the first line; gentler hero hover grow; window Trogdor catchable through the hole (Catch Trogdor!); cave darkness + moody sky on \'darkness\'; bone rattle hook; chickens by the village house (tap = squawk + hop); bones in the cavern + castle (Bone Collector); score pause hooks; +1 star on finishing (jjScore); Skip CTA bottom-left, 32px like the sound moon; hover fill + pink press on Skip/Back/Skip-this-part; Skip = the exact NEXT SCENE element above the banner; glass confirm buttons; brighter sky dressing + bigger tavern moon; quicker pants→Designer; ta-da once and trimmed; Joe off the fire; smaller window Trogdor; pitchfork man in front;  Skip CTA = the horizontal-scroll Next Scene button with the skip icon; progress bar along the bottom; village flame in front of the fleeing villagers;  tavern crowd = one full-body Seedance clip on the floorboards;  castle Trogdor is ONE clip too (huff → fire on \'facing fire\' → puzzled turn to camera → shrinks in smoke);  village Trogdor is ONE Seedance clip (huff, then fire from 2.2s, held);  CTA = the homepage button; hearth fire on the logs; puzzled Trogdor lands where the fire-breather stood; sword + pitchfork clips uncut; villagers stay on the land; SFX at a quarter; gait-matched gallop seam;  nav held back until its drop-in (jj-nav-in gate);  clips prefetched in scene order while the tale plays;  Skip CTA + pause-everything confirm; seamless gallop;  every sound at half; castle clips silent bar the roar; smaller puzzled Trogdor; flame deeper in the mouth; bigger hearth fire; grounded tavern crowd; villagers run longer; headroom for the jump; quick ending';
  try { console.log('%c[JJ] storytime.js build: ' + window.JJ_STORY_BUILD, 'color:#FF00F5;font-weight:bold'); } catch (e) {}

  var GB = window.JJ_STORY_BASE || 'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/';
  var AV = '?a=6';
  function F(name){ return GB + 'story-' + name + '.webp' + AV; }
  /* pressable-pixel masks, precomputed from the posters / the tavern board (96px wide, 1 bit per pixel) — so hover and click land
     only on the character in EVERY browser, with no canvas read of a cross-origin image (that read silently failed for some visitors → box fallback) */
  var MASK = {
    'cav-dragon-loop': '96,87,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//AAAAAAAAAAAAOD//8AAAAAAAAAAAcB///AAAAAAAAAAA4A//8AAAAAAAAAAH4M//4AAAAAAAAAAf48f/wAAAAAAAAAA//4f/wAAAAAAAAAB//wf/gAAAAAAAAAB//gf4AAAAAAAAAAD//gfxwAAAAAAAAAD//wf/xAAAAAAAAAH//////gAAAAAAAAH//////gAAAAAAAAP//////wAAAAAAAD///////+AAAAAAAH///////+AAAAAAAH///////+AAAAAAAH///////+AAAAAAAH///////+AAAAAAAH////////gAAAAAAB/H//////wAAAAAAAYP//////gAAAAAAAAP//////gAAAAAAAAH//////gAAAAAAAAz//////wAAAAAAAAz//////wAAAAAAAA7////+/wAAAAAAAB8////+/gAAAAAAAB8P//+A/gAAAAAAAB+f///g/gAAAAAAAB8f///w/gAAAAAAAAOD///5/gAAAAAAAAHg///7+AAAAAAAAAD4////+AAAAAAAAAB/B///8AAAAAAAAAA/+f//4AAAAAAAAAAP////wAAAAAAAAAAD////gAAAAAAAAAAA////AAAAAAAAAAAAH//8AAAAAAAAAAAAA//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    'tav-joe-loop': '96,96,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf8AAAAAAAAAAAAAAf/AAAAAAAAAAAAAB//wAAAAAAAAAAAAH//8AAAAAAAAAAAAP//+AAAAAAAAAAAA////AAAAAAAAAAAB////gAAAAAAAAAAD////wAAAAAAAAAAH////wAAAAAAAAAAH////4AAAAAAAAAAP////8AAAAAAAAAAf////8AAAAAAAAAAf////+AAAAAAAAAAf////+AAAAAAAAAA/////+QAAAAAAAAA//////wAAAAAAAAA//////gAAAAAAAAB//////AAAAAAAAAB//////AAAAAAAAAB//////AAAAAAAAAD//////AAAAAAAAAD//////AAAAAAAAAD//////gAAAAAAAAD//////gAAAAAAAAB//////gAAAAAAAAA//////gAAAAAAAAAf/////gAAAAAAAAAf/////AAAAAAAAAAf/////AAAAAAAAAHf/////AAAAAAAAAH/////+AAAAAAAAAH/////+AAAAAAAAADn////8AAAAAAAAAAx////4AAAAAAAAAAwf///wAAAAAAAAAAYH///AAAAAAAAAAAdv//+AAAAAAAAAAAP////AAAAAAAAAAAP////AAAAAAAAAAAf////gAAAAAAAAAAf////gAAAAAAAAAAH////gAAAAAAAAAAP////gAAAAAAAAAAf////wAAAAAAAAAA/////4AAAAAAAAAB/////8AAAAAAAAAB/////8AAAAAAAAAD/////+AAAAAAAAAH/////+AAAAAAAAAH//////AAAAAAAAAP//////AAAAAAAAAf//////gAAAAAAAA///////gAAAAAAAA///////wAAAAAAAB///////wAAAAAAAB///////wAAAAAAAD///////4AAAAAAAD///////4AAAAAAAA///////4AAAAAAAAB/////AAAAAAAAAAAP////AAAAAAAAAAAB/gB/gAAAAAAAAAAB/gB/wAAAAAAAAAAD/AB/wAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    'vil-dragon-loop': '96,62,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAPgAAAAAAAAAAAAAAfgAAAAAAAAAAAAAA/+AAAAAAAAAAAAA5/4AAAAAAAAAAAAA//wAAAAAAAAAAAAA//wAAAAAAAAAAAAA3/wAAAAAAAAAAAAAf/gAAAAAAAAAAAAADfgAAAAAAAAAAAAAAPAEAAAAAAAAAAAAAHAcAAAAAAAAAAAAAHD8AAAAAAAAAAAAAHD8ACAAAAAAAAAAAHjwAHAAAAAAAAAAAHjwAHAAAAAAAAAAAHjkAGAAAAAAAAAAAHkH4CAAAAAAAAAAAP0PwCAAAAAAAAAAAP4/gCAAAAAAAAAAAP5/gCAAAAAAAAAAAP8MACAAAAAAAAAAAP+AACAAAAAAAAAAAP/gAGAAAAAAAAAAAP/8AMAAAAAAAAAAAP/9AcAAAAAAAAAAAP//44AAAAAAAAAAAf///4AAAAAAAAAAAP///wAAAAAAAAAAAD///gAAAAAAAAAAAB///AAAAAAAAAAAAA//+AAAAAAAAAAAAAf/4AAAAAAAAAAAAAH/wAAAAAAAAAAAAAH/AAAAAAAAAAAAAADngAAAAAAAAAAAAADjwAAAAAAAAAAAAABxwAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    'tav-bg-2': '96,72,//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+AA/////////////+AAf////////////+AAf////////////+AAf////////////+AAf////////////+AAf////////////+AAf////////////+AAf////////////+AAf////////////+AAf////////////+AAf////////////+AAf////////////+AAf////////////+AAf////////////+AAf////////////+AAf////////////+AAf/////////////AA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////'
  };
  var maskCache = {};
  function maskHit(name){ if (!MASK[name]) return null; if (maskCache[name]) return maskCache[name];
    var p = MASK[name].split(','), w = +p[0], h = +p[1], bin = atob(p[2]), d = new Uint8Array(w * h * 4);
    for (var i = 0; i < w * h; i++) if (bin.charCodeAt(i >> 3) & (128 >> (i & 7))) d[i * 4 + 3] = 255;
    return (maskCache[name] = { w: w, h: h, ar: w / h, d: d }); }
  var BANNER = GB + 'story-banner.webp' + AV;             // J-swirl caption frame
  var SKY = GB + 'story-nightsky.svg' + AV;
  /* the loader's night dressing, reused behind the transparent scene boards (moon + whirls + dot stars).
     Coordinates live in a 1000x560 sky (slice-fitted), chosen per board to sit in clear sky. */
  var NSC = 'https://cdn.prod.website-files.com/615edb5c549d52cd108ed268/';
  var N_XSTAR = NSC + '67212bf05ed02917043863f9_x-star.svg', N_WHIRL = NSC + '67212bf05ed02917043863f5_whirl-star.svg';
  var N_MOON = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a0d67bbb86603f359ae1311_289a8c92ed8a9b7dd3efdae788f3d0ae_Moon.svg';
  var NIGHT = {
    'cav-bg':  { moon:[300,150,50], whirls:[[120,105,20],[720,70,17],[520,40,14],[880,230,16]], xs:[[560,120,12],[840,150,10],[200,60,9],[430,210,9]], stars:[[80,60],[180,190],[420,60],[640,40],[900,60],[470,230],[240,40],[760,240],[990,200],[360,120],[600,180],[820,90],[140,140],[700,20],[950,140]] },
    'vil-bg':  { moon:[430,100,48], whirls:[[150,80,18],[830,60,20],[560,30,14],[720,230,15]], xs:[[300,40,12],[700,160,10],[180,120,9],[860,190,9]], stars:[[60,50],[230,150],[400,190],[620,70],[900,110],[960,40],[280,220],[580,220],[760,40],[120,220],[340,110],[500,40],[660,200],[930,220],[20,120]] },
    'wood-bg': { moon:[400,80,44], whirls:[[250,150,16],[600,40,18],[440,220,13],[300,240,12]], xs:[[300,120,11],[520,40,10],[420,150,9]], stars:[[230,50],[360,190],[480,160],[640,110],[700,180],[170,230],[560,200],[330,20],[250,100],[600,220],[520,100],[380,240]] },
    'cas-bg':  { moon:[220,110,52], whirls:[[90,50,18],[440,60,20],[600,160,14],[360,230,13]], xs:[[330,40,12],[520,120,10],[160,60,9],[680,40,9]], stars:[[40,150],[130,200],[400,170],[600,40],[720,90],[300,240],[480,220],[560,20],[80,40],[260,60],[440,110],[660,200],[540,180]] },
    'tav-bg-2':{ moon:[530,100,36], whirls:[[458,175,10]], xs:[[470,70,7]], stars:[[452,140],[550,190],[480,200],[560,60],[500,45],[540,150]] }   // all inside the window (x430–570, y60–210); moon 2× with a big glow
  };
  function nightSvg(c){
    var m = c.moon, r = m[2], h = '';
    (c.stars || []).forEach(function (st, i) { h += '<circle class="jjst-tw" style="--d:' + (2.6 + (i % 4) * .7).toFixed(1) + 's;--o:-' + (i * .53 % 3).toFixed(2) + 's" cx="' + st[0] + '" cy="' + st[1] + '" r="' + (2.2 + (i % 3) * .5) + '" fill="#eaf5ff"/>'; });
    (c.xs || []).forEach(function (x, i) { h += '<image class="jjst-tw" style="--d:' + (3.4 + i) + 's;--o:-' + i + 's" href="' + N_XSTAR + '" x="' + (x[0] - x[2] / 2) + '" y="' + (x[1] - x[2] / 2) + '" width="' + x[2] + '" height="' + x[2] + '"/>'; });
    (c.whirls || []).forEach(function (w, i) { h += '<image class="jjst-wh" style="--d:' + (16 + i * 5) + 's" href="' + N_WHIRL + '" x="' + (w[0] - w[2] / 2) + '" y="' + (w[1] - w[2] / 2) + '" width="' + w[2] + '" height="' + w[2] + '" opacity=".9"/>'; });
    h += '<g class="jjst-moonw"><g class="jjst-mpulse"><circle cx="' + m[0] + '" cy="' + m[1] + '" r="' + (r * 2.4) + '" fill="url(#jjstml)"/></g>' +
         '<image href="' + N_MOON + '" x="' + (m[0] - r) + '" y="' + (m[1] - r) + '" width="' + (r * 2) + '" height="' + (r * 2) + '"/></g>';
    return '<svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="jjstml" gradientUnits="userSpaceOnUse" cx="' + m[0] + '" cy="' + m[1] + '" r="' + (r * 2.4) + '">' +
           '<stop offset="0" stop-color="#DDF0FF" stop-opacity=".55"/><stop offset=".45" stop-color="#C5E7FF" stop-opacity=".2"/><stop offset="1" stop-color="#C5E7FF" stop-opacity="0"/></radialGradient></defs>' + h + '</svg>';
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
  var CAS_JOE = 'left:20%;bottom:25vh;width:min(16vw,320px)';
  var CAS_JOE_SW = 'left:calc(20% - 3.43vw);bottom:calc(25vh - 2.29vw);width:min(22.86vw,457px)';   // same knight size on a 1000×900 canvas — the swings never clip            // the knight (700² canvas = cas-joe-1/2 geometry)
  var CAS_JOE2 = 'left:19.2%;bottom:25vh;width:min(17.5vw,350px)';       // pants + designer, sized up to the knight's height and centred on him — feet on the same line
  var CAS_DRAGON = 'right:6vw;bottom:19vh;width:52vw';                   // the village huff-and-puff loop + flame, same canvas geometry as the village
  var CAS_DRAGON_FC = 'right:5.2vw;bottom:calc(19vh - 4.7vw);width:63.9vw';   // the 16:9 fire→confused clip, body matched to the old loop's box (flame tip ~35vw = the shield)       // the puzzled clip (cas-dragon-3 geometry)
  var CAS_POOFJ = 'left:15vw;bottom:24vh;width:26vw';                    // smoke column centred on Joe
  var COMP = {
    cavern: { bg:'cav-bg', snd:{ src:'dragon-snore', vol:.225, pre:.08, fadeIn:3000 }, layers:[   // snore: barely there under the loader, swells when the cave is revealed, fades before the village
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
        fx:[ { type:'smoke', at:[28, 46] }, { type:'glint', at:[[46,70],[58,74],[66,66],[52,78]] } ] },
      { key:'bones1', vid:'bones-rattle', ar:722/424, idle:true, hoverPlay:true, cls:'prop', tap:'bones', hoverSnd:'bone-jiggle', css:'left:44%;bottom:38vh;width:min(5.5vw,110px)' },   // Bone Collector 1/2 — further back on the cave floor; still until hovered, whisks away on click
      { key:'chick', vid:'vil-chicken', ar:548/646, seg:[0.1, 3.5], hop:[3.6, 6.0], tap:'chick', cls:'prop', css:'left:6.5%;bottom:31vh;width:min(8.5vw,170px)' }   // in the gap between the rocks and the chest   // the lone chicken by its friend's bones: shivers on a loop; tap → bones twitch, squawk, hop
    ]},
    /* tavern per the "3 - Tavern 1" mockup: Joe mid-left on the floor, grandma back-right,
       hooded guy far right, the old man BIG in the foreground (so he's last = on top). */
    tavern: { bg:'tav-bg-2', snd:{ src:'tav-fire', vol:.15 }, layers:[     // fireplace crackle bed for the whole shot; the board's window is a real hole onto the sky
      { key:'hearth', vid:'tav-fire-loop', ar:1, cls:'hearthy', hoverBoost:1.4, css:'left:14.2vw;bottom:calc(50vh - .5vw);width:8.4vw' },   // hover: the fire swells and the crackle comes up 40%   // Seedance flame on the logs (listed first → behind Joe)
      { key:'joe', vid:'tav-joe-loop', ar:1, hold:true, css:'left:15%;bottom:24vh;width:min(26vw,520px)',
        hero:{ label:'Joe the Righteous', glow:'rgba(255,214,120,.6)', seekTo:3.0, lt:4, hit:[.22,.14,.72,.82] },
        snd:{ src:'tav-joe-tada', vol:.075, once:true } },
      { key:'crowd', vid:'tav-crowd', ar:16/9, css:'right:-4.6vw;bottom:calc(22vh - 2.2vw);width:44vw' }   // all three villagers, full-body, one clip; feet on the front boards
    ]},
    woodland: { bg:'wood-bg', snd:{ src:'horse-gallop', vol:.2, fadeIn:1500 }, cue:{ src:'villager-cheer', vol:.225 }, layers:[   // hooves under the ride; one cheer centred in whatever time the shot has
      { key:'joe', vid:'wood-joe-loop3', ar:1400/1520, cls:'gallop', css:'left:47%;bottom:26vh;width:min(18vw,360px)',   // gallop loop; rides off into the distance, weaving
        to:{ css:'left:48.5%;bottom:40vh;width:min(9vw,180px)', delay:1200, dur:6500 } },
      { key:'v1', vid:'wood-char-1-loop', ar:1, css:'left:29%;bottom:26vh;width:min(12vw,240px)' },   // one Seedance clip, split down the middle
      { key:'v2', vid:'wood-char-2-loop', ar:1, css:'left:68%;bottom:26vh;width:min(13vw,260px)' }
    ]},
    /* CASTLE = 7-shot sequence traced from the "5 - Castle 1/2/3/4/5/6/13" mockups. Keys persist
       across shots so the engine morphs/crossfades: `joe` = knight arts → designer arts (the
       swap happens while `joecloud` covers him); `dragon` crossfades pose → then SHRINKS via a
       width/position morph in castle6 → gone by castle13 (only the `wisp` remains). Smoke clouds
       are the cas-smoke assets; a --flip:-1 on a cloud mirrors it (the idle keyframe reads it). */
    /* ---- CASTLE on video. One-shot clips hold their last frame (hold:true → no loop). Joe's shield clip
       carries on across castle2→3→4 (same key + src → never restarted): braced for 2s, then straightens and
       looks confused at the camera — landing right on 'Wait a minute'. Costume changes = a smoke clip that
       pops over him (pop:true, now:true) with the comp's swapAt delaying the actual swap under the cloud. ---- */
    castle1: { bg:'cas-bg', layers:[          // standoff — sword swings, Trogdor huffs
      { key:'joe', vid:'cas-joe-sword2', ar:1000/900, hold:true, css:CAS_JOE_SW },
      { key:'cdragon', vid:'cas-dragon-fc', ar:16/9, hold:true, css:CAS_DRAGON_FC, snd:{ src:'vil-dragon-roar', vol:.225, once:true, fadeIn:1200 } }   // one clip across castle1→4: fire at 2.2s, puzzled by ~6s
    ]},
    castle2: { bg:'cas-bg', layers:[          // fire vs shield — the flame reaches the shield in under a second
      { key:'joe', vid:'cas-joe-shield', ar:1, hold:true, css:CAS_JOE },
      { key:'cdragon', vid:'cas-dragon-fc', ar:16/9, hold:true, css:CAS_DRAGON_FC }
    ]},
    castle3: { bg:'cas-bg', layers:[          // both suddenly unsure — flame sucked back in, Trogdor crossfades to the puzzled clip
      { key:'joe', vid:'cas-joe-shield', ar:1, hold:true, css:CAS_JOE },
      { key:'cdragon', vid:'cas-dragon-fc', ar:16/9, hold:true, css:CAS_DRAGON_FC }
    ]},
    castle4: { bg:'cas-bg', layers:[          // 'Ah yes, sorry.' — Trogdor shrinks into a puff and is gone
      { key:'joe', vid:'cas-joe-shield', ar:1, hold:true, css:CAS_JOE },
      { key:'cdragon', vid:'cas-dragon-fc', ar:16/9, hold:true, css:CAS_DRAGON_FC, sc:0, so:'78% 80%', scDur:1100 },   // shrinks to his own feet inside the poof
      { key:'poofD', vid:'cas-smoke', ar:1, hold:true, pop:true, now:true, css:'left:68vw;bottom:calc(19vh + .2vw);width:26vw' }
    ]},
    castle5: { bg:'cas-bg', swapAt:300, layers:[   // 'that's a different Joe' — poof: knight → the man in his pants
      { key:'joe2', vid:'cas-pants2', ar:700/900, hold:true, css:CAS_JOE2 },
      { key:'poofD', vid:'cas-smoke', ar:1, hold:true, css:'left:68vw;bottom:calc(19vh + .2vw);width:26vw' },
      { key:'poofJ1', vid:'cas-smoke', ar:1, hold:true, pop:true, now:true, css:CAS_POOFJ }
    ]},
    castle6: { bg:'cas-bg', swapAt:300, layers:[   // 'yet still…' — poof: pants → the Designer, who cheers with his brush
      { key:'joe3', vid:'cas-hurrah2', ar:700/900, hold:true, css:CAS_JOE2 },
      { key:'poofJ1', vid:'cas-smoke', ar:1, hold:true, css:CAS_POOFJ },
      { key:'poofJ2', vid:'cas-smoke', ar:1, hold:true, pop:true, now:true, css:CAS_POOFJ }
    ]},
    castle13: { bg:'cas-bg', layers:[         // the Designer holds his pose while the tale fades out
      { key:'joe3', vid:'cas-hurrah2', ar:700/900, hold:true, css:CAS_JOE2 }
    ]}
  };
  Object.keys(COMP).forEach(function (n) { if (/^castle/.test(n)) COMP[n].layers.push(   // Bone Collector 2/2 — mid-ground between Joe and Trogdor, every castle shot
    { key:'bones2', vid:'bones-rattle', ar:722/424, idle:true, hoverPlay:true, cls:'prop', tap:'bones', hoverSnd:'bone-jiggle', now:true, css:'left:47%;bottom:36vh;width:min(5vw,100px)' }); });
  var taken = {};                                            // props the reader has picked up — never rebuilt

  /* ---- VILLAGE = 4-panel storyboard, sizes + positions traced from the "2 - Village 1..4"
         mockups (grid-measured, canvas padding factored in). Same bg + same characters (matched
         by `key`): the dragon FIRE crossfades in place (body pixel-locked) while villagers MORPH.
         Design choreography: pitchfork trio holds mid-left; the redhead (v3) flees UP the centre
         path shrinking; the old man (v1) watches from the RIGHT house doorway then ducks into the
         window; the bonnet girl (v2) starts by the right house and flees off right in P2; the
         mustache kid (v7) runs in from bottom-centre in P2 and flees left; in P4 only the
         terrified drop-guy + v7 remain. Panels advance on an equal timer (see runVillageSeq). ---- */
  /* tavern2 = the same room, plus Trogdor BEHIND the board: a 95vw copy of the huff-and-puff loop sits behind the
     wall (behind:true → mounted under the bg, over the sky) and rises so only his head shows in the window. */
  COMP.tavern2 = { bg:'tav-bg-2', snd:COMP.tavern.snd, layers: COMP.tavern.layers.concat([
    { key:'peek', vid:'vil-dragon-loop', ar:1400/900, behind:true, through:{ bg:'tav-bg-2' }, css:'left:17.2vw;top:calc(38vh - 9vw);width:52.5vw',   // through: pressable only on HIS pixels seen THROUGH the window hole → Catch Trogdor!   // 25% smaller; head centred in the window
      to:{ css:'top:calc(22vh - 13vw)', delay:100, dur:1200, ease:'cubic-bezier(.22,1,.36,1)' } } ]) };
  var VIL_DRAGON = 'right:17%;bottom:21vh;width:min(46.5vw,930px)';
  var VIL_DRAGON_FIRE = 'right:16.3vw;bottom:calc(21vh - 4.2vw);width:56.9vw';   // the 16:9 fire clip, body matched to the old loop's box (flame tip lands ~30vw)   // 25% smaller than the traced size (the 1400px loop went soft at full width); right nudged so the mouth stays put   // Trogdor — body 25vw; nudged 1% left so the tail clears the old man's window
  function vil(dragon, p){
    /* kept simple on purpose: just the pitchfork guy and the scared curly kid.
       The dragon is the AI huff-and-puff loop (mouth opens ~2.8s in, then stays angry); the flame is
       its own layer on the SAME canvas geometry, scaled from the mouth — 0 in shot 1, growing to
       full in shot 2. Both use VIL_DRAGON. The flicker clip is registered so its thin neck sits in the mouth
       wedge and its pointed base hides inside the head; the origin (58.4% 46%) is the mouth interior. */
    var L = [
      /* the three chickens by the house: a Seedance one-shot that waits on its first frame — tap → squawk + a little hop, and they stay worried */
      { key:'chicks', vid:'vil-chickens', ar:898/592, hold:true, idle:true, tap:'chicks', cls:'prop', css:'left:4%;bottom:27vh;width:min(21vw,420px)' },   // the three by the house: wait on frame 0; tap → squawk + hop, they stay worried
      /* one Seedance clip does it all now: he huffs (his own smoke puffs), the fire starts at 2.2s — the same beat the
         old two-layer flame used to grow on — and the blaze is held by a swung tail. Body sits where the old loop's did. */
      /* both are Seedance one-shots (turn-back at the very end trimmed, last stride held): the class in `run` lands on
         the first 'playing' event and drives the travel — pitchfork charges 3.1s then turns and flees; curly bolts at 1.45s */
      { key:'v5', vid:'vil-curly-run', ar:1, hold:true, run:'fleeC', snd:{ src:'vil-curly', vol:.1, once:true, fadeIn:300 }, css:p.v5 },   // his own yelp, kept quiet
      { key:'pitch', vid:'vil-pitch-run2', ar:1200/1000, hold:true, run:'chargeP', css:p.pitch },   // foreground → after the kid
      { key:'vildragon', vid:'vil-dragon-fire', ar:16/9, css:VIL_DRAGON_FIRE,                       // listed LAST → he and his flame paint in front of the fleeing villagers
        snd:{ src:'vil-dragon-roar', vol:.275, once:true, fadeIn:1200 } }
    ];
    return { bg:'vil-bg', snd:{ src:'villagers-shouting', vol:.175, loop:false, fadeIn:2000 }, layers:L };   // same bed across the village shots → it carries on
  }
  COMP.village1 = vil('vil-dragon-1', {        // smoke puff — old man at the LIT WINDOW (grounded, not floating on the wall)
    pitch:'left:calc(19% - 3.93vw);bottom:calc(31vh - 3.93vw);width:min(18.86vw,377px)', v5:'left:27%;bottom:33vh;width:min(10vw,200px)',
    v3:'left:37%;bottom:37vh;width:min(8vw,160px)',     v1:'left:75%;bottom:49vh;width:min(10vw,200px)',
    v2:'left:85%;bottom:33vh;width:min(16vw,320px)' });
  COMP.village2 = vil('vil-dragon-2', {        // the fire comes: flame grows from the mouth to full over ~4.5s
    flame:1,
    pitch:'left:calc(19% - 3.93vw);bottom:calc(31vh - 3.93vw);width:min(18.86vw,377px)', v5:'left:27%;bottom:33vh;width:min(10vw,200px)',
    v3:'left:43%;bottom:43vh;width:min(6vw,120px)',      v1:'left:76%;bottom:51vh;width:min(8vw,160px)',
    v7:'left:34%;bottom:24vh;width:min(10vw,200px)',     v2:'left:91%;bottom:27vh;width:min(15vw,300px)' });
  /* village3/4 = the same shot held: caption 4 still says comp:'village4', and it must NOT swap the video
     dragon for the static frame-4 art (that was the 'jumps up at the end' bug) — same keys, same art, flame stays full. */
  COMP.village3 = vil('vil-dragon-3', { flame:1,
    pitch:'left:calc(19% - 3.93vw);bottom:calc(31vh - 3.93vw);width:min(18.86vw,377px)', v5:'left:27%;bottom:33vh;width:min(10vw,200px)' });
  COMP.village4 = vil('vil-dragon-4', { flame:1,
    pitch:'left:calc(19% - 3.93vw);bottom:calc(31vh - 3.93vw);width:min(18.86vw,377px)', v5:'left:27%;bottom:33vh;width:min(10vw,200px)' });
  COMP._village4_old = { bg:'vil-bg', layers:[   // (unused) the traced frame-4 design, kept for reference
    { key:'dragon', src:'vil-dragon-4', css:VIL_DRAGON },
    { key:'pitchdrop', src:'vil-pitch-drop', cls:'idle', css:'left:12%;bottom:26vh;width:min(13.5vw,270px)' },
    { key:'v7', src:'vil-char-7', cls:'idle', css:'left:1%;bottom:26vh;width:min(10vw,200px)' }
  ]};   // key 'pitch' absent → the charging guy fades out as the terrified drop-guy fades in

  /* ---- captions: each = the line + the chapter it's on + word `triggers` that switch chapter ---- */
  var SCENES = [
    { text:"Many moons ago in a mysterious land there lived a cunning and evil beast who dwelled deep in the darkness....", comp:'cavern', triggers:[ { at:'darkness', fx:'dark' } ] },   // the cave dims, the sky broods
    { text:"He had a fascination for gold, jewels, treasures and anything that sparkled...but also something more sinister...the local villagers!",
      comp:'cavern', triggers:[ { at:'jewels', fx:'chest' }, { at:'sparkled', fx:'bedOut' }, { at:'more sinister', comp:'village1' } ] },
    { text:"He had many names, Beast, Dragon, Death, but the one that put fear into the hearts of the locals was...Trogdor! Trogdor The Burninator...",
      comp:'village1', triggers:[ { at:'Trogdor!', fx:'bedOut' } ] },   // shots advance on a timer (runVillageSeq); the shouting fades before the tavern
    { text:"Luckily one day a brave young man appeared to try and best this beast! His goal? To save the villagers and stop this evil...",
      comp:'village4', triggers:[ { at:'Luckily one day', comp:'tavern' }, { at:'stop this evil', comp:'tavern2' } ] },   // Trogdor rises into the window ~2s before the tavern ends
    { text:"“Joe the Righteous” they called! He set off a journey to find the beast, searching through forests, rolling hills and treacherous mountains...",
      comp:'tavern2', triggers:[ { at:'Joe the Righteous', comp:'woodland' } ] },
    { text:"He went toe to toe with the beast in an epic battle lasting for days, facing fire and all his might and...Wait a minute...I think this is the wrong story...",
      comp:'castle1', read:500, triggers:[ { at:'facing fire', comp:'castle2' }, { at:'Wait a minute', comp:'castle3' } ] },   // short read: less time on confused Joe
    { text:"Ah yes, sorry. Oops, that's a different Joe. This one is the story of a Designer...yet still an all great and powerful Designer...",
      comp:'castle4', triggers:[ { at:'sorry.', comp:'castle5' }, { at:'story of a Designer', comp:'castle6' } ],   // pants on 'sorry.', Designer on 'Designer'
      end:{ delay:600, run:function(){ setComp('castle13'); sched(fadeToBlack, 800); } } }   // the cheer has landed by now — straight out
  ];

  /* ---- timings (ms) ---- */
  var T = { revealAt:700, revealDur:2200, boxFadeAt:2700, menuDropAt:3000, firstTypeAt:3500,
    typeSpeed:30, pauseDot:200, pauseEllipsis:400, readPerChar:10, readMin:1200, bgFade:600, endFade:1500,
    villagePanel:2200 };   // the village's 2nd shot lands this long after the 1st (equal timing, not word-driven)

  /* the logo + menu stay hidden (beating Webflow's own nav styles) until the story drops them in */
  (function () { var st = document.createElement('style'); st.textContent = 'html:not(.jj-nav-in) .nav-logo-link,html:not(.jj-nav-in) .menu-container{opacity:0!important}'; (document.head || document.documentElement).appendChild(st); })();
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
  '#jjst-sky{position:absolute;top:0;left:0;width:100%;height:auto;display:block;transition:filter 1.8s ease;}'+
  '#jjst.moody #jjst-sky{filter:brightness(.5) saturate(.65) contrast(1.12);}#jjst.moody #jjst-night{opacity:.5;}'+   // "…deep in the darkness": the sky broods
  '#jjst-dark{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity 1.8s ease;background:radial-gradient(ellipse at 50% 62%,rgba(4,8,22,.18) 0%,rgba(3,6,18,.55) 62%,rgba(2,4,14,.78) 100%);}'+
  '#jjst-dark.on{opacity:1;}'+   // over the cave board, under the chest / bones / Trogdor
  '#jjst-night{position:absolute;inset:0;opacity:0;transition:opacity .9s ease;pointer-events:none;}'+   // sits between the sky and the boards (DOM order)
  '#jjst-night.on{opacity:1;}#jjst-night svg{width:100%;height:100%;display:block;}'+
  '#jjst-night .jjst-moonw{transform-box:fill-box;transform-origin:50% 50%;animation:jjstMoonW 7s ease-in-out infinite;}'+
  '#jjst-night .jjst-mpulse{animation:jjstMPulse 7s ease-in-out infinite;}'+
  '#jjst-night .jjst-tw{animation:jjstTw var(--d,3s) ease-in-out var(--o,0s) infinite;filter:drop-shadow(0 0 4px rgba(255,255,255,.95)) drop-shadow(0 0 10px rgba(199,231,255,.7));}'+
  '#jjst-night .jjst-wh{transform-box:fill-box;transform-origin:50% 50%;animation:jjstWh var(--d,18s) linear infinite;filter:drop-shadow(0 0 5px rgba(255,255,255,.8));}'+
  '#jjst-night .jjst-moonw image{filter:drop-shadow(0 0 14px rgba(255,255,255,.9)) drop-shadow(0 0 40px rgba(199,231,255,.6));}'+
  '@keyframes jjstWh{to{transform:rotate(360deg);}}'+
  '@keyframes jjstMoonW{0%,100%{transform:scale(.92);}50%{transform:scale(1.16);}}'+
  '@keyframes jjstMPulse{0%,100%{opacity:.3;}50%{opacity:1;}}'+
  '@keyframes jjstTw{0%,100%{opacity:.2;transform:scale(.85);}50%{opacity:1;transform:scale(1.25);}}'+
  '#jjst-night circle.jjst-tw,#jjst-night image.jjst-tw{transform-box:fill-box;transform-origin:50% 50%;}'+
  '#jjst .jjst-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;will-change:opacity;}'+
  '#jjst-layers{position:absolute;inset:0;z-index:3;pointer-events:none;}'+
  '#jjst .jjst-layer,#jjst-bgwrap .jjst-layer{position:absolute;height:auto;display:block;will-change:transform,opacity;}'+
  /* ---- video layers + their aura ---- */
  '#jjst video.jjst-layer,#jjst-bgwrap video.jjst-layer{object-fit:contain;background:transparent;pointer-events:none;}'+
  '#jjst video.jjst-layer.hero{pointer-events:auto;cursor:pointer;transform-origin:50% 100%;transition:scale .4s cubic-bezier(.34,1.56,.64,1);}'+
  '#jjst video.jjst-layer.hero.hov{scale:1.04;}'+
  '#jjst .jjst-aura,#jjst-bgwrap .jjst-aura{position:absolute;pointer-events:none;z-index:2;}'+
  '#jjst .jjst-aura .aglow{position:absolute;left:-12%;top:-8%;width:124%;height:116%;border-radius:50%;'+
    'background:radial-gradient(ellipse at 50% 58%,var(--gc,rgba(255,255,255,.4)) 0%,transparent 62%);filter:blur(18px);'+
    'opacity:0;transform:scale(.92);transition:opacity .45s ease,transform .45s ease;}'+
  '#jjst .jjst-aura.hov .aglow{opacity:1;transform:scale(1);}'+
  '#jjst .jjst-aura .alabel{position:absolute;left:50%;top:-4%;transform:translate(-50%,8px);padding:6px 16px;border-radius:999px;'+
    'background:rgba(10,14,26,.72);border:1px solid rgba(255,255,255,.28);color:#fff;font-size:clamp(12px,1.05vw,17px);font-weight:700;letter-spacing:.04em;white-space:nowrap;'+
    'opacity:0;transition:opacity .35s ease,transform .35s cubic-bezier(.34,1.56,.64,1);}'+
  '#jjst .jjst-aura.hov .alabel{opacity:1;transform:translate(-50%,0);}'+
  '#jjst .jjst-aura.lit .aglow{opacity:1;transform:scale(1);}'+
  '#jjst .jjst-layer.pop{animation:jjstPop .55s cubic-bezier(.34,1.56,.64,1);transform-origin:50% 100%;}'+
  '#jjst .jjst-layer.hearthy{transform-origin:50% 100%;transition:transform .35s cubic-bezier(.34,1.56,.64,1);}#jjst .jjst-layer.hearthy.warm{transform:scale(1.14);}'+
  'body.jj-modal-open #jjst *{pointer-events:none!important;}'+   // achievements / explainer open → nothing in the scene hovers or clicks
  '#jjst .jjst-layer.prop{transition:filter .3s ease,opacity .6s ease;}#jjst .jjst-layer.prop:hover{filter:drop-shadow(0 0 10px rgba(255,240,180,.95)) drop-shadow(0 0 28px rgba(255,220,120,.6));}'+
  '#jjst .jjst-layer.taken{animation:jjstTaken .7s cubic-bezier(.4,0,.7,1) forwards!important;pointer-events:none!important;}'+
  '@keyframes jjstTaken{0%{translate:0 0;scale:1;rotate:0deg;opacity:1;}30%{translate:0 -3vh;scale:1.12;rotate:-8deg;opacity:1;}100%{translate:0 -12vh;scale:.25;rotate:30deg;opacity:0;}}'+
  '@keyframes jjstPop{0%{scale:1;}40%{scale:1.07 .95;}70%{scale:.98 1.03;}100%{scale:1;}}'+
  /* nostril smoke: a soft puff that drifts up-left, grows and thins */
  '#jjst .jjst-aura .puff{position:absolute;width:5.5%;aspect-ratio:1;border-radius:50%;margin:-2.75% 0 0 -2.75%;'+
    'background:radial-gradient(circle,rgba(226,232,240,.85) 0%,rgba(200,208,220,.55) 45%,rgba(200,208,220,0) 70%);'+
    'animation:jjstPuff 2.6s ease-out forwards;}'+
  '@keyframes jjstPuff{0%{opacity:0;transform:translate(0,0) scale(.4);}18%{opacity:.9;}100%{opacity:0;transform:translate(-14%,-140%) scale(1.9);}}'+
  /* coin glints: a four-point sparkle that blinks in and out */
  '#jjst .jjst-aura .glint{position:absolute;width:3.2%;aspect-ratio:1;margin:-1.6% 0 0 -1.6%;'+
    'background:radial-gradient(circle,#fff 0%,rgba(255,255,255,.9) 18%,rgba(255,255,255,0) 22%),'+
    'linear-gradient(#fff,#fff) center/100% 12% no-repeat,linear-gradient(#fff,#fff) center/12% 100% no-repeat;'+
    'animation:jjstGlint .9s ease-in-out forwards;filter:drop-shadow(0 0 6px rgba(255,255,255,.9));}'+
  '@keyframes jjstGlint{0%{opacity:0;transform:scale(.2) rotate(0deg);}50%{opacity:1;transform:scale(1) rotate(45deg);}100%{opacity:0;transform:scale(.2) rotate(90deg);}}'+
  '@keyframes jjst-scared{0%,100%{transform:rotate(-2.2deg);}50%{transform:rotate(2.2deg);}}'+   // tremble in place — no lift, feet stay planted
  '.jjst-layer.scared{animation:jjst-scared .5s ease-in-out infinite;transform-origin:center bottom;}'+
  '@keyframes jjst-idle{0%,100%{transform:scaleX(var(--flip,1)) scaleY(1);}50%{transform:scaleX(var(--flip,1)) scaleY(.965);}}'+   // grounded squash bob (origin bottom) — nothing floats
  '.jjst-layer.idle{animation:jjst-idle 2.5s ease-in-out infinite;transform-origin:center bottom;}'+
  '.jjst-layer.gallop{animation:jjst-gallop 2.8s ease-in-out infinite;transform-origin:center bottom;}'+
  '.jjst-layer.chargeP{animation:jjstChargeP 8.5s linear forwards;transform-origin:50% 100%;}'+     // 0–3.1s charge right, then turn + run up the path, tiny and gone by 8.5s
  '@keyframes jjstChargeP{0%{transform:translate(0,0) scale(1);opacity:1;}36%{transform:translate(4vw,0) scale(1);opacity:1;}75%{opacity:1;}100%{transform:translate(17vw,-6vh) scale(.28);opacity:0;}}'+
  '.jjst-layer.fleeC{animation:jjstFleeC 7s linear forwards;transform-origin:50% 100%;}'+           // frozen 1.45s, then bolts first
  '#jjst .jjst-layer.poof{animation:jjstPoof 2s ease-out forwards;transform-origin:50% 100%;}'+   // smoke: bursts up, hangs, drifts off (the chest owns .pop)
  '@keyframes jjstPoof{0%{transform:scale(.15);opacity:0;}14%{transform:scale(1.06);opacity:1;}22%{transform:scale(1);}60%{transform:scale(1) translateY(0);opacity:1;}100%{transform:scale(.7) translateY(-25%);opacity:0;}}'+           // frozen 1.45s, then bolts first
  '@keyframes jjstFleeC{0%,21%{transform:translate(0,0) scale(1);opacity:1;}75%{opacity:1;}100%{transform:translate(13vw,-6vh) scale(.28);opacity:0;}}'+
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
  '#jjst-progress{position:absolute;left:0;bottom:0;width:100%;height:5px;background:rgba(255,255,255,.08);z-index:6;opacity:0;transition:opacity .6s ease;}'+
  '#jjst-progress.on{opacity:1;}'+
  '#jjst-progress-fill{height:100%;width:0;background:linear-gradient(90deg,#FF00F5,#ff7df4);box-shadow:0 0 12px rgba(255,0,245,.7);transition:width .6s ease;}'+
  '#jjst-cap{position:absolute;left:50%;bottom:7vh;transform:translateX(-50%);width:min(83vw,1350px);aspect-ratio:1295 / 200;z-index:5;opacity:0;transition:opacity .8s ease;background:url(\''+BANNER+'\') no-repeat center/contain;display:flex;align-items:center;justify-content:center;pointer-events:auto;cursor:pointer;}'+
  '#jjst-cap.on{opacity:1;}'+
  '#jjst-cap-text{width:72%;overflow:visible;text-align:left;color:#3a2a12;font-size:clamp(15px,1.6vw,27px);line-height:1.26;white-space:pre-wrap;}'+   // height is set per line to its FINISHED size (see typeText) — centred in the box, line 1 never moves
  /* the reader's own pace: a Next chip appears once the line has finished typing */
  /* Previous / Next scene — always there under the banner (per the Figma frame) */
  /* Skip the story — the horizontal scroll's NEXT SCENE element verbatim (div.next-section-button > div.button-text + icon), so the site CSS gives it
     the white card, radius, Joes Journey Headline label and the grey hover. Bottom-left, 32px in — the mirror of the sound moon (bottom:32px;right:32px). */
  '#jjst-skipcta{position:absolute!important;left:32px;right:auto;bottom:32px;z-index:9;opacity:0;pointer-events:none;transform:translateY(14px);transition:opacity .6s ease,transform .6s cubic-bezier(.22,1,.36,1),background-color .2s;}'+
  /* the homepage button behaviour, scoped here: black fills up on hover (text + icon go white), pink circle on press */
  '#jjst [data-jj="btn"],#jjst [data-jj="cta"]{position:relative;overflow:hidden!important;}'+
  '#jjst .jj-btn-fill,#jjst .jj-cta-fill{position:absolute;inset:0;background:#111;transform:scaleY(0);transform-origin:bottom center;transition:transform .4s cubic-bezier(.4,0,.2,1);pointer-events:none;z-index:0;border-radius:inherit;}'+
  '#jjst .jj-cta-fill{background:rgba(0,0,0,.92);}'+
  '#jjst [data-jj="btn"]:hover .jj-btn-fill,#jjst [data-jj="cta"]:hover .jj-cta-fill{transform:scaleY(1);}'+
  '#jjst [data-jj="btn"]>*:not(.jj-btn-fill):not(.jj-btn-pink),#jjst [data-jj="cta"]>*:not(.jj-cta-fill):not(.jj-cta-pink){position:relative;z-index:2;transition:color .3s ease,fill .3s ease;}'+
  '#jjst [data-jj="btn"]:hover,#jjst [data-jj="btn"]:hover *{color:#fff!important;}#jjst [data-jj="btn"]:hover path{fill:#fff!important;}'+
  '#jjst .jj-btn-pink,#jjst .jj-cta-pink{position:absolute;border-radius:50%;background:#FF00F5;opacity:.9;pointer-events:none;z-index:1;transform:scale(0);transition:transform .4s ease-out,opacity .4s ease;}'+
  '#jjst-skipcta.on{opacity:1;pointer-events:auto;transform:none;}'+
  '#jjst-skipcta .button-text{white-space:nowrap;}'+
  '#jjst-skipcta .ico{width:1.6vw;height:1.6vw;min-width:18px;min-height:18px;display:block;}'+
  '.jjst-ov{position:absolute;inset:0;z-index:40;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .3s ease,visibility 0s linear .3s;}'+
  '.jjst-ov.on{opacity:1;visibility:visible;pointer-events:auto;transition:opacity .3s ease,visibility 0s;}'+
  /* the homepage glass button, drawn here (its Webflow class carries hover interactions + the site-wide Credits/Contact link hijack) */
  '.jjst-glass{position:relative;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;padding:1.6rem 3.5rem;border-radius:8px;border:2px solid rgba(255,255,255,.11);background:rgba(0,0,0,.4);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);color:#fff;font-family:\'Joes Journey Headline\',sans-serif;font-size:1.2rem;font-weight:400;line-height:1;text-decoration:none;text-transform:uppercase;cursor:pointer;transition:box-shadow .2s ease;-webkit-appearance:none;margin:0;}'+
  '.jjst-glass:hover{box-shadow:0 12px 20px -14px rgba(255,255,255,.68);background:rgba(160,160,160,.4);}.jjst-glass .button_text{position:relative;z-index:2;}'+   // grey base on hover, so the black fill wipe reads (as on click to begin)
  '.jjst-ov .card{text-align:center;color:#fff;padding:0 24px;max-width:640px;}'+
  '.jjst-ov .q{font-size:clamp(22px,2.6vw,38px);font-weight:700;margin:0 0 12px;}'+
  '.jjst-ov .sub{font-size:clamp(15px,1.3vw,20px);opacity:.9;margin:0 0 28px;}  .jjst-ov .sub b{color:#FF00F5;}'+
  '.jjst-ov .row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}'+
  '.jjst-ov .row{gap:16px;}'+
  '.jjst-ov .q{line-height:1.15;}'+
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
    '<div id="jjst-bgwrap"><img id="jjst-sky" alt=""><div id="jjst-night"></div></div><div id="jjst-dark"></div>'+
    '<div id="jjst-layers"></div>'+
    '<div id="jjst-black"></div>'+
    '<div id="jjst-fade"></div>'+
    '<div id="jjst-progress"><div id="jjst-progress-fill"></div></div>'+
    '<div id="jjst-cap"><div id="jjst-cap-text"></div></div>'+
    '<div id="jjst-skipcta" class="next-section-button" data-cursor="hover"><div class="button-text">SKIP THE STORY</div><svg class=\"ico\" viewBox=\"0 0 29 29\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M15.36 15.2987L7.45868 21.5688C7.27177 21.7172 7.04746 21.7897 6.82544 21.7897C6.52524 21.7897 6.22732 21.6571 6.02567 21.4045C5.67564 20.9639 5.74925 20.3227 6.19106 19.9726L13.0853 14.5013L6.19106 9.02998C5.75041 8.67995 5.67677 8.03876 6.02567 7.5981C6.3757 7.15745 7.01689 7.08267 7.45755 7.43271L15.3588 13.7028C15.6024 13.8965 15.744 14.1899 15.744 14.5014C15.744 14.8129 15.6024 15.1063 15.3588 15.3L15.36 15.2987ZM22.8096 13.7015L14.9083 7.43143C14.4676 7.0814 13.8265 7.15501 13.4764 7.59682C13.1264 8.03748 13.2 8.67867 13.6418 9.0287L20.5361 14.5L13.6418 19.9714C13.2012 20.3214 13.1275 20.9626 13.4764 21.4032C13.6781 21.657 13.9749 21.7884 14.2762 21.7884C14.4982 21.7884 14.7214 21.7159 14.9094 21.5675L22.8107 15.2975C23.0543 15.1038 23.1959 14.8104 23.1959 14.4988C23.1959 14.1873 23.0543 13.8939 22.8107 13.7002L22.8096 13.7015Z\"/></svg></div>'+
    '<div id="jjst-skipov" class="jjst-ov"><div class="card"><p class="q">Are you sure you want to skip the story?</p>'+
    '<p class="sub">There\u2019s only <b id="jjst-left">0</b> seconds left and it\u2019s about to get good!</p>'+
    '<div class="row"><button type="button" id="jjst-back" class="jjst-glass" data-cursor="hover"><div class="button_text">BACK TO STORY</div></button><button type="button" id="jjst-skipgo" class="jjst-glass" data-cursor="hover"><div class="button_text">SKIP THIS PART</div></button></div></div></div>'+
    '<div id="jjst-sndov" class="jjst-ov"><div class="card"><p class="q">I\'ve noticed your sound is off!</p><p class="sub">You\'ll only be experiencing <b>50%</b> of the story if you continue without, no worries if not!</p>'+
    '<div class="row"><button type="button" id="jjst-nosnd" class="jjst-glass" data-cursor="hover"><div class="button_text">CONTINUE WITHOUT SOUND</div></button><button type="button" id="jjst-yessnd" class="jjst-glass" data-cursor="hover"><div class="button_text">TURN ON THE SOUND!</div></button></div></div></div>'+
    '<div id="jjst-loader"><div class="ring"></div><div class="txt">Loading the tale…</div></div>';

  /* ---- composition: bg crossfade + character layers ---- */
  /* every story timer goes through sched() so Skip can freeze the whole tale and resume it exactly where it was */
  var TIMERS = {}, storyPaused = false, pausedVideos = [], pausedHowls = [];
  function sched(fn, ms){ var rec = { fn: fn, due: performance.now() + ms, t: 0 };
    rec.t = setTimeout(function () { delete TIMERS[rec.t]; fn(); }, ms); TIMERS[rec.t] = rec; return rec.t; }
  function unsched(id){ if (id == null) return; clearTimeout(id); var r = TIMERS[id]; if (r) { clearTimeout(r.t); delete TIMERS[id]; } }
  function pauseStory(){ if (storyPaused) return; storyPaused = true; var now = performance.now();
    Object.keys(TIMERS).forEach(function (k) { var r = TIMERS[k]; clearTimeout(r.t); r.rem = Math.max(0, r.due - now); });
    pausedVideos = []; document.querySelectorAll('#jjst video').forEach(function (v) { if (!v.paused && !v.ended) { pausedVideos.push(v); v.pause(); } });
    try { document.getElementById('jjst').getAnimations({ subtree: true }).forEach(function (a) { if (a.playState === 'running') a.pause(); }); } catch (e) {}
    pausedHowls = []; try { (window.Howler ? Howler._howls : []).forEach(function (h) { if (h.playing()) { pausedHowls.push(h); h.pause(); } }); } catch (e) {}
  }
  function resumeStory(){ if (!storyPaused) return; storyPaused = false;
    Object.keys(TIMERS).forEach(function (k) { var r = TIMERS[k]; r.due = performance.now() + r.rem;
      r.t = setTimeout(function () { delete TIMERS[k]; r.fn(); }, r.rem); });
    pausedVideos.forEach(function (v) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }); pausedVideos = [];
    try { document.getElementById('jjst').getAnimations({ subtree: true }).forEach(function (a) { if (a.playState === 'paused') a.play(); }); } catch (e) {}
    pausedHowls.forEach(function (h) { try { h.play(); } catch (e) {} }); pausedHowls = [];
  }
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
  function clearAnims(){ animTimers.forEach(function (t) { clearInterval(t); unsched(t); }); animTimers = []; }
  /* ---- a video layer's soundtrack: the clip's own audio, extracted to mp3 and played through Howler
     (the site's mute button rules it), kept in step with the muted <video>'s clock ---- */
  var SFX = 0.5;                                              // global gain on every story sound (beds, one-shots, cues) — on top of the per-sound vol
  function attachSound(video, snd){
    if (!window.Howl) return;
    var h = new Howl({ src: [GB + 'story-' + snd.src + '.mp3' + AV], volume: snd.vol == null ? .5 : snd.vol, preload: true });
    window.jjAudio = window.jjAudio || { sounds: [], muted: false, volume: 1.0 };
    window.jjAudio.sounds.push(h);
    var id = null, lastT = 0;
    var started = false, vol = (snd.vol == null ? .5 : snd.vol) * SFX, fin = snd.fadeIn == null ? 2500 : snd.fadeIn;
    function sync(){
      if (video.paused || !video.isConnected) return;
      if (snd.once && started) return;                    // a one-shot: plays with the first pass of the picture, then stays quiet
      try {
        if (id == null || !h.playing(id)) {
          id = h.play();
          if (!started) { started = true; h.volume(0, id); h.fade(0, vol, fin, id); }   // ease in
        }
        var d = h.duration() || 0;
        if (d && !snd.once) h.seek(video.currentTime % d, id);
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
  /* ---- one stage-level hit manager for every pixel-tested character (heroes + the window peek) ---- */
  var HITS = [];
  function hitTop(e){
    if (document.body.classList.contains('jj-modal-open')) return null;          // achievements / explainer open → nothing behind reacts
    var t = e.target; if (t && t.closest && t.closest('.prop, #jjst-cap, .jjst-ov, #jjst-skipcta, .hearthy')) return null;
    for (var i = HITS.length - 1; i >= 0; i--) { var h = HITS[i]; if (!h.el.isConnected) { HITS.splice(i, 1); continue; } if (h.over(e)) return h; }
    return null;
  }
  function stageCursor(on){ var b = curBgLayer; if (!b || b._cur === on) return; b._cur = on;
    if (on) b.setAttribute('data-cursor', 'hover'); else b.removeAttribute('data-cursor'); b.style.cursor = on ? 'pointer' : '';
    try { b.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })); } catch (x) {} }   // the site cursor re-reads data-cursor on mouseover
  function clearHits(){ HITS.forEach(function (h) { h.setHov(false); }); stageCursor(false); }
  function wireStageHits(stage){
    stage.addEventListener('pointermove', function (e) { var top = hitTop(e); HITS.forEach(function (h) { h.setHov(h === top); }); stageCursor(!!top); });
    stage.addEventListener('pointerleave', clearHits);
    stage.addEventListener('click', function (e) { var top = hitTop(e); if (!top) return; e.stopPropagation(); top.click(e); }, true);
  }
  function makeAura(L, el){
    var aura = document.createElement('div'); aura.className = 'jjst-aura';
    aura.style.cssText = L.css + ';aspect-ratio:' + (L.ar || 1) + ';';
    var h = L.hero || L.aura || {};
    aura.style.setProperty('--gc', h.glow || 'rgba(255,255,255,.4)');
    aura.innerHTML = '<div class="aglow"></div>' + (h.label ? '<div class="alabel" style="top:' + (h.lt == null ? -4 : h.lt) + '%">' + h.label + '</div>' : '');
    if (L.hero) {
      var hit = maskHit(L.vid);                             // pressable pixels: the precomputed mask, else the poster's alpha
      if (!hit && el.tagName === 'VIDEO') { var pim = new Image(); pim.crossOrigin = 'anonymous';
        pim.onload = function () { try { var c = document.createElement('canvas'), cx = c.getContext('2d'); c.width = 160; c.height = Math.max(1, Math.round(160 / (L.ar || 1)));
          cx.drawImage(pim, 0, 0, c.width, c.height); hit = { w: c.width, h: c.height, d: cx.getImageData(0, 0, c.width, c.height).data }; } catch (e) {} };
        pim.src = el.poster; }
      function over(e){
        var r = el.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
        if (hit) { var x = Math.floor(fx * hit.w), y = Math.floor(fy * hit.h); return x >= 0 && y >= 0 && x < hit.w && y < hit.h && hit.d[(y * hit.w + x) * 4 + 3] > 40; }
        var b = h.hit; return !b || (fx >= b[0] && fy >= b[1] && fx <= b[2] && fy <= b[3]);   // fallback: a box round the character
      }
      var isHov = false;
      function setHov(on){ if (on === isHov) return; isHov = on; el.classList.toggle('hov', on); aura.classList.toggle('hov', on); }
      el.style.pointerEvents = 'none';                      // the stage hit-tests his pixels; the box itself blocks nothing beneath it
      HITS.push({ el: el, over: over, setHov: setHov, click: function () {
        if (L.hero.seekTo == null || el.tagName !== 'VIDEO') return;
        try { el.currentTime = L.hero.seekTo; var p = el.play(); if (p && p.catch) p.catch(function () {}); } catch (err) {}
        aura.classList.add('lit'); clearTimeout(aura._litT);
        aura._litT = setTimeout(function () { aura.classList.remove('lit'); }, 1800);
      } });
    }
    el.parentNode.insertBefore(aura, el);                 // glow sits BEHIND the art (same parent — layers or, for behind:true, the bg wrap)
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
  var boardMaps = {};                                        // alpha maps of the scene boards — for a character that peeks through a hole
  function boardMap(name, cb){ if (boardMaps[name]) return cb(boardMaps[name]); if (maskHit(name)) return cb(boardMaps[name] = maskHit(name));
    var im = new Image(); im.crossOrigin = 'anonymous';
    im.onload = function () { try { var c = document.createElement('canvas'), cx = c.getContext('2d'); c.width = 240; c.height = Math.max(1, Math.round(240 * im.naturalHeight / im.naturalWidth));
      cx.drawImage(im, 0, 0, c.width, c.height); boardMaps[name] = { w: c.width, h: c.height, ar: im.naturalWidth / im.naturalHeight, d: cx.getImageData(0, 0, c.width, c.height).data }; cb(boardMaps[name]); } catch (e) {} };
    im.src = F(name); }
  function inHole(m, e){                                      // is this point on a TRANSPARENT pixel of the cover-fitted board?
    var W = window.innerWidth, H = window.innerHeight, dw, dh; if (W / H > m.ar) { dw = W; dh = W / m.ar; } else { dh = H; dw = H * m.ar; }
    var fx = (e.clientX - (W - dw) / 2) / dw, fy = (e.clientY - (H - dh) / 2) / dh, x = Math.floor(fx * m.w), y = Math.floor(fy * m.h);
    return x >= 0 && y >= 0 && x < m.w && y < m.h && m.d[(y * m.w + x) * 4 + 3] < 30; }
  function wireThrough(el, L){                                // behind:true character, pressable only where he shows through the board
    if (!L.through || el._thruWired) return; el._thruWired = true;
    var hit = maskHit(L.vid), board = null, pim = new Image(); pim.crossOrigin = 'anonymous';
    if (!hit) pim.onload = function () { try { var c = document.createElement('canvas'), cx = c.getContext('2d'); c.width = 160; c.height = Math.max(1, Math.round(160 / (L.ar || 1)));
      cx.drawImage(pim, 0, 0, c.width, c.height); hit = { w: c.width, h: c.height, d: cx.getImageData(0, 0, c.width, c.height).data }; } catch (e) {} };
    if (!hit) pim.src = el.poster; boardMap(L.through.bg, function (m) { board = m; });
    function over(e){ if (!hit || !board || !el.isConnected || el._caught || !inHole(board, e)) return false;
      var r = el.getBoundingClientRect(), x = Math.floor((e.clientX - r.left) / r.width * hit.w), y = Math.floor((e.clientY - r.top) / r.height * hit.h);
      return x >= 0 && y >= 0 && x < hit.w && y < hit.h && hit.d[(y * hit.w + x) * 4 + 3] > 40; }
    HITS.push({ el: el, over: over, setHov: function (on) { el.classList.toggle('hov', on); }, click: function (e) {
      el._caught = true; el.classList.remove('hov');
      el.style.transition = 'top 1.1s cubic-bezier(.5,0,.7,1)'; el.style.top = (L.css.match(/top:([^;]+)/) || [0, ''])[1];   // caught! back down below the sill
      if (window.jjScore) window.jjScore.award('trogdor', { x: e.clientX, y: e.clientY }); } });
  }
  function wireSeg(el, L){                                   // seg:[a,b] = the idle stretch to loop; hop:[a,b] = the one-shot a tap plays before returning to it
    if (!L.seg || el._segWired) return; el._segWired = true; el._segL = L;
    el.addEventListener('timeupdate', function () { if (el._hop) { if (el.currentTime >= L.hop[1]) { el._hop = false; el.currentTime = L.seg[0]; } }
      else if (el.currentTime >= L.seg[1]) el.currentTime = L.seg[0]; });
  }
  function wireWarm(el, L){                                  // a bed-sound prop (the hearth): grows on hover, its bed swells with it
    if (!L.hoverBoost || el._warmWired) return; el._warmWired = true; el.style.pointerEvents = 'auto'; el.setAttribute('data-cursor', 'hover');
    el.addEventListener('pointerenter', function () { el.classList.add('warm'); if (compHowl) try { compHowl.fade(compHowl.volume(), compVol * L.hoverBoost, 400); } catch (e) {} });
    el.addEventListener('pointerleave', function () { el.classList.remove('warm'); if (compHowl) try { compHowl.fade(compHowl.volume(), compVol, 600); } catch (e) {} });
  }
  function wireTap(el, L, k){                                 // a pressable prop (the chest, the bones, the chickens)
    if (!L.tap || el._tapWired) return; el._tapWired = true;
    el.style.pointerEvents = 'auto'; el.style.cursor = 'pointer'; el.setAttribute('data-cursor', 'hover');
    el.addEventListener('click', function (e) { e.stopPropagation(); runFx(L.tap, k, e); });
    if (L.hoverSnd) el.addEventListener('pointerenter', function () { var n = performance.now(); if (n - (el._hs || 0) < 1500) return; el._hs = n; oneShot(L.hoverSnd, .3); });   // the rattle
    if (L.hoverPlay && el.tagName === 'VIDEO') {                // an idle clip that only moves while the pointer is on it
      el.addEventListener('pointerenter', function () { el.loop = true; var p = el.play(); if (p && p.catch) p.catch(function () {}); });
      el.addEventListener('pointerleave', function () { el.pause(); });
    }
  }
  function runFx(name, key, e){
    if (name === 'bedOut') { fadeBed(2500); return; }
    if (name === 'dark' || name === 'darkOff') { var on = name === 'dark'; document.getElementById('jjst-dark').classList.toggle('on', on); document.getElementById('jjst').classList.toggle('moody', on); return; }
    if (name === 'chick') {                                    // the bones twitch, the chicken squawks and hops, then it's back to shivering (wireSeg)
      var cr = layerRecs[key]; if (!cr || cr.el._hop) return; var v = cr.el, hl = v._segL;
      v._hop = true; try { v.currentTime = hl.hop[0]; } catch (x) {}
      var pv = v.play(); if (pv && pv.catch) pv.catch(function () {});
      setTimeout(function () { oneShot('chicken-squawk', .45); }, 350);
      return;
    }
    if (name === 'chicks') {                                   // the village three: squawk + hop, once through; a second prod replays from the calm still
      var gr = layerRecs[key]; if (!gr || gr.el._busy) return; var gv = gr.el; gv._busy = true;
      try { gv.currentTime = 1.7; } catch (x) {}                    // the clip idles for 1.7s before the hop — skip straight to the reaction
      oneShot('chickens-squawk', .45);
      var gp = gv.play(); if (gp && gp.catch) gp.catch(function () {});
      var gfree = function () { gv._busy = false; }; gv.addEventListener('ended', gfree, { once: true }); setTimeout(gfree, 5500);
      return;
    }
    if (name === 'bones') {                                    // whisk the pile away; Bone Collector ticks up (jjScore)
      var br = layerRecs[key]; if (!br || taken[key]) return; taken[key] = true;
      br.el.classList.add('taken'); delete layerRecs[key];
      setTimeout(function () { if (br.el.parentNode) br.el.remove(); }, 800);
      if (window.jjScore) window.jjScore.award('bones', { part: key, x: e ? e.clientX : null, y: e ? e.clientY : null });
      return;
    }
    if (name === 'chest') {
      var rec = layerRecs['chest']; if (!rec) return;
      oneShot('chest-sparkle', .25);                          // the user's sparkle sound — plays if the file exists, silent otherwise
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
  function fadeRemove(el){ if (el.tagName === 'VIDEO') { if (el._howl) { var hw = el._howl; el._howl = null; try { hw.fade(hw.volume(), 0, 450); } catch (e0) {} setTimeout(function () { try { hw.unload(); } catch (e2) {} }, 600); } setTimeout(function () { try { el.pause(); } catch (e) {} }, 620); }   // pause AFTER the fade — the pause handler would cut the howl dead
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
    animTimers.push(sched(function () {
      var e = t.ease || 'ease-in-out', d = t.dur || 4000;
      el.style.transition = ['left', 'right', 'top', 'bottom', 'width'].map(function (p) { return p + ' ' + d + 'ms ' + e; }).join(',');
      t.css.split(';').forEach(function (decl) { var c = decl.indexOf(':'); if (c > 0) el.style.setProperty(decl.slice(0, c).trim(), decl.slice(c + 1).trim()); });
    }, t.delay || 0));
  }
  function mountLayer(el, L){                                // behind:true → under the scene board (over the sky): shows only through holes like the tavern window
    if (L.behind) bgWrap.insertBefore(el, bgWrap.querySelector('.jjst-bg')); else layersWrap.appendChild(el);
  }
  var swapAt = 0;                                            // set per comp: costume changes happen this long after the comp lands (under the poof)
  function reveal(el, L){ setTimeout(function () { el.style.opacity = '1'; }, (swapAt && !L.now) ? swapAt : 16); }
  function buildLayers(layers){
    clearAnims(); layers = (layers || []).filter(function (L) { return !taken[L.key]; });
    var next = {}; layers.forEach(function (L, idx) { next[keyOf(L, idx)] = true; });
    Object.keys(layerRecs).forEach(function (k) { if (!next[k]) { var gone = layerRecs[k]; delete layerRecs[k];
      var drop = function () { fadeRemove(gone.el); if (gone.aura) fadeRemove(gone.aura); };
      if (swapAt) setTimeout(drop, swapAt); else drop(); } });                 // swapAt: the old art stays until the smoke covers it
    layers.forEach(function (L, idx) {
      var k = keyOf(L, idx), first = F(L.anim ? L.anim[0] : L.src), rec = layerRecs[k], el;
      var prevSc = (rec && rec.el && rec.el.style) ? rec.el.style.scale : '';
      var startSc = rec ? (prevSc || '1') : prevSc;            // a layer that was already up but never scaled starts from 1, not from the target
      if (rec && ((rec.el.tagName === 'VIDEO') !== !!L.vid)) {   // kind changed under the same key: start fresh
        fadeRemove(rec.el); if (rec.aura) fadeRemove(rec.aura); delete layerRecs[k]; rec = null;
      }
      if (L.vid) {                                           // ---- a transparent looping video layer ----
        first = L.vid;
        if (rec && rec.src === first) { el = rec.el; el.style.cssText = L.css; }
        else {
          if (rec) { fadeRemove(rec.el); if (rec.aura) fadeRemove(rec.aura); }
          el = document.createElement('video');
          el.className = 'jjst-layer' + (L.cls ? ' ' + L.cls : '') + (L.hero ? ' hero' : '') + (L.pop ? ' poof' : '');
          el.muted = true; el.loop = !L.hold; el.playsInline = true; el.autoplay = !L.idle; el.preload = 'auto';   // hold:true → one-shot, freezes on its last frame; idle:true → waits on its poster until tapped
          el.setAttribute('muted', ''); el.setAttribute('playsinline', '');
          el.poster = GB + 'story-' + L.vid + '-poster.webp' + AV;
          el.innerHTML = '<source src="' + GB + 'story-' + L.vid + '.mov' + AV + '" type=\'video/mp4; codecs="hvc1"\'>' +
                         '<source src="' + GB + 'story-' + L.vid + '.webm' + AV + '" type="video/webm">';
          el.style.cssText = L.css + ';opacity:0'; mountLayer(el, L);
          reveal(el, L);
          if (!L.idle) { var pr = el.play(); if (pr && pr.catch) pr.catch(function () {}); }   // blocked → the poster stands in
          rec = layerRecs[k] = { el: el, src: first };
          rec.aura = makeAura(L, el);
          if (L.snd) attachSound(el, L.snd);
          if (L.run) el.addEventListener('playing', function onPlay(){ el.classList.add(L.run); el.removeEventListener('playing', onPlay); });
        }
        applyScale(el, L, startSc); applyMove(el, L); wireTap(el, L, k); wireThrough(el, L); wireWarm(el, L); wireSeg(el, L);
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
        el.style.cssText = L.css; el.src = first; mountLayer(el, L);
        requestAnimationFrame(function () { el.classList.add('in'); });
        rec = layerRecs[k] = { el: el, src: first };
      } else {                                               // fresh, fade-in
        el = document.createElement('img'); el.alt = '';
        el.className = 'jjst-layer morph' + (L.cls ? ' ' + L.cls : '');
        el.style.cssText = L.css + ';opacity:0'; el.src = first; mountLayer(el, L);
        reveal(el, L);
        rec = layerRecs[k] = { el: el, src: first };
        if (L.aura || L.hero) rec.aura = makeAura(L, el);
      }
      applyScale(el, L, startSc);
      if (L.cls && /\b(idle|scared)\b/.test(L.cls)) {        // each character on its own beat + tempo
        var trem = /\bscared\b/.test(L.cls);
        el.style.animationDelay = '-' + ((idx * 0.83) % 2.5).toFixed(2) + 's';
        el.style.animationDuration = trem ? (0.42 + (idx % 3) * 0.09).toFixed(2) + 's' : (2.2 + (idx % 3) * 0.4).toFixed(1) + 's';
      }
      wireTap(el, L, k);
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
  function clearPanels(){ panelTimers.forEach(function (t) { unsched(t); }); panelTimers = []; }
  function runVillageSeq(){                          // village1 is up — advance 2→3→4 at equal intervals
    clearPanels();
    ['village2'].forEach(function (name, i) {                 // shots 3 + 4 retired — two is plenty
      panelTimers.push(sched(function () { setComp(name); }, T.villagePanel * (i + 1)));
    });
  }
  /* a looping bed tied to a shot (the tavern fireplace): fades in on mount, out when the shot changes */
  var compHowl = null, compSrc = null, compVol = 0, storyLive = false;
  function dropHowl(h, ms){ if (!h) return; try { h.fade(h.volume(), 0, ms); } catch (e) {} setTimeout(function () { try { h.unload(); } catch (e2) {} }, ms + 100); }
  function setCompSound(snd){
    var src = snd ? snd.src : null; if (src === compSrc) return; compSrc = src;
    dropHowl(compHowl, 800); compHowl = null;
    if (!snd || !window.Howl) return;
    compVol = (snd.vol == null ? .4 : snd.vol) * SFX;
    var v0 = (!storyLive && snd.pre != null) ? snd.pre * SFX : compVol;      // `pre` = the level while the loader is still up
    var h = compHowl = new Howl({ src: [GB + 'story-' + snd.src + '.mp3' + AV], loop: snd.loop !== false, volume: 0, preload: true });
    window.jjAudio = window.jjAudio || { sounds: [], muted: false, volume: 1.0 }; window.jjAudio.sounds.push(h);
    function go(){ if (compHowl !== h) return; try { if (!h.playing()) { h.play(); h.fade(0, v0, snd.fadeIn == null ? 1500 : snd.fadeIn); } } catch (e) {} }
    h.once('load', go); h.once('unlock', go);
  }
  function oneShot(name, vol){ if (!window.Howl) return; try { var h = new Howl({ src: [GB + 'story-' + name + '.mp3' + AV], volume: (vol == null ? .3 : vol) * SFX, onload: function () { h.play(); } }); window.jjAudio.sounds.push(h); } catch (e) {} }
  function fadeBed(ms){ if (!compHowl) return; try { compHowl.fade(compHowl.volume(), 0, ms); } catch (e) {} }   // ease the bed out ahead of a shot change
  function bedLive(){ storyLive = true; if (compHowl && compHowl.volume() < compVol) { try { compHowl.fade(compHowl.volume(), compVol, 3000); } catch (e) {} } }
  /* a one-shot centred in whatever time the shot has left (the woodland cheer): if the clip is longer than
     the shot it simply starts now and the shot change fades it; if shorter it waits (R - D) / 2 first */
  var cueHowl = null, cueT = null;
  function playCue(cue){
    unsched(cueT); dropHowl(cueHowl, 800); cueHowl = null;
    if (!cue || !window.Howl) return;
    var v = (cue.vol == null ? .4 : cue.vol) * SFX, t0 = performance.now();
    var h = cueHowl = new Howl({ src: [GB + 'story-' + cue.src + '.mp3' + AV], loop: false, volume: 0, preload: true });
    window.jjAudio.sounds.push(h);
    function arm(){ if (cueHowl !== h) return;
      var R = Math.max(0, boxEnd - performance.now()), D = (h.duration() || 0) * 1000, wait = Math.max(0, (R - D) / 2 - (performance.now() - t0));
      cueT = sched(function () { if (cueHowl !== h) return; try { h.play(); h.fade(0, v, 500); } catch (e) {} }, wait); }
    h.once('load', arm);
  }
  function setComp(name){
    if (name === curComp) return;
    if (name === 'village1' && typeof curComp === 'string' && curComp.indexOf('village') === 0) return; // don't restart the village once it's running (2nd caption keeps comp:'village1')
    curComp = name;
    var c = COMP[name]; if (!c) return;
    swapAt = c.swapAt || 0;
    showBg(c.bg); setNight(c.bg); buildLayers(c.layers); setCompSound(c.snd); playCue(c.cue);
    if (name !== 'cavern') runFx('darkOff');            // the darkness belongs to the cave
    if (name === 'village1') { runVillageSeq();      // start the equal-timed dragon-fire sequence
      panelTimers.push(sched(function () { runFx('chicks', 'chicks'); }, 2500)); }   // the three by the house jump when Trogdor's fire starts (2.2s into his clip)
    else if (name.indexOf('village') !== 0) clearPanels();  // left the village → cancel any pending shots
  }

  function revealFromBlack(){ var b = document.getElementById('jjst-black');
    b.style.transition = 'width ' + T.revealDur + 'ms ease, height ' + T.revealDur + 'ms ease';
    b.style.width = '260vmax'; b.style.height = '260vmax';
    setTimeout(function () { b.style.display = 'none'; }, T.revealDur + 120); }
  function fadeToBlack(){ var f = document.getElementById('jjst-fade'); void f.offsetWidth; f.style.opacity = '1';
    if (window.jjScore) window.jjScore.award('storytime');                       // +1 star — the whole tale, not the skip
    setTimeout(function () {
      if (window.jjStory && window.jjStory.unlock) window.jjStory.unlock();
      setCompSound(null); playCue(null); releaseAmbient();
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
    textEl.textContent = ''; var i = 0; unsched(textEl._tw);
    var finished = false;
    function fireTo(n){ for (var j = 0; j < trs.length; j++) { if (!trs[j].fired && trs[j].idx >= 0 && n >= trs[j].idx) { trs[j].fired = true; if (trs[j].comp) setComp(trs[j].comp); if (trs[j].fx) runFx(trs[j].fx); } } }
    function finish(){ if (finished) return; finished = true; unsched(textEl._tw); typeFF = null;
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
      textEl._tw = sched(step, delay);
    }
    textEl._tw = sched(step, T.typeSpeed);
  }
  var advTimer = null, curAdvance = null, curScene = 0, boxEnd = 0;    // the pending auto-advance + its manual twin; boxEnd = when this caption is due to end
  function runScene(i){
    if (i >= SCENES.length) return;
    var s = SCENES[i]; curScene = i;
    var readMs = s.end ? s.end.delay : (s.read != null ? s.read : Math.max(T.readMin, s.text.length * T.readPerChar));
    boxEnd = performance.now() + typeDuration(s.text) + readMs;
    rollProgress(i, typeDuration(s.text) + readMs);
    if (s.comp) setComp(s.comp);
    curAdvance = null;
    typeText(s.text, s.triggers, function () {
      var go = function () { advTimer = null; curAdvance = null;
        if (s.end) s.end.run(); else runScene(i + 1); };
      curAdvance = go;
      advTimer = sched(go, readMs);
    });
  }
  /* Previous / Next scene: drop whatever is pending (typing, auto-advance, village timer) and run caption i */
  function stopLayerSounds(){ Object.keys(layerRecs).forEach(function (k) { var v = layerRecs[k].el; if (v && v._howl) { var hw = v._howl; v._howl = null; try { hw.fade(hw.volume(), 0, 300); } catch (e) {} setTimeout(function () { try { hw.unload(); } catch (e2) {} }, 400); } }); playCue(null); }
  function jumpScene(i){
    if (i < 0) return; stopLayerSounds();
    unsched(advTimer); advTimer = null; curAdvance = null; typeFF = null;
    if (textEl) unsched(textEl._tw); clearPanels();
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
  function skipStory(){ setCompSound(null); playCue(null);
    releaseAmbient();
    unsched(advTimer); advTimer = null; curAdvance = null;
    if (textEl) unsched(textEl._tw);
    if (window.jjStory && window.jjStory.unlock) window.jjStory.unlock();
    window.scrollTo(0, 0);
    var w = document.getElementById('jjst');
    if (w) { w.style.transition = 'opacity .9s ease'; w.style.opacity = '0'; w.style.pointerEvents = 'none';
      setTimeout(function () { if (w.parentNode) w.remove(); }, 1000); }
  }

  /* ---- mount + choreography ---- */
  var PRELOAD = ['cav-bg','cav-dragon-loop-poster','cav-chest-closed','cav-chest-open','tav-joe-loop-poster','tav-crowd-poster','vil-dragon-loop-poster','vil-dragon-fire-poster','cav-dragon-1','vil-bg','vil-dragon-1','vil-dragon-2','vil-dragon-3','vil-dragon-4',
    'vil-char-1','vil-char-2','vil-char-3','vil-char-4','vil-char-5','vil-char-7','vil-pitch-drop','tav-bg-2','tav-joe','tav-char-1','tav-char-2','tav-char-3',
    'wood-bg','wood-joe-loop3-poster','wood-char-1-loop-poster','wood-char-2-loop-poster','cas-bg','cas-joe-sword2-poster','cas-joe-shield-poster',
    'cas-dragon-fc-poster','cas-pants2-poster','cas-hurrah2-poster','cas-smoke-poster'];
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
      e.stopPropagation(); if (storyPaused) return;
      if (typeFF) { typeFF(); return; }
      if (advTimer !== null) { unsched(advTimer); advTimer = null;
        if (curAdvance) { var go = curAdvance; curAdvance = null; go(); } }
    });
    /* Skip: freeze everything, ask. 'X seconds left' = the rest of this caption + every caption after it. */
    function storyLeft(){ var ms = Math.max(0, boxEnd - performance.now());
      for (var k = curScene + 1; k < SCENES.length; k++) { var sc = SCENES[k]; ms += typeDuration(sc.text) + (sc.end ? sc.end.delay + 800 : Math.max(T.readMin, sc.text.length * T.readPerChar)); }
      return Math.ceil(ms / 1000); }
    /* hover fill + pink press on the three buttons (site-footer wires these on load, before our markup exists) */
    function pressFx(el, kind) { el.setAttribute('data-jj', kind); if (el.querySelector('.jj-' + kind + '-fill')) return;
      var f = document.createElement('div'); f.className = 'jj-' + kind + '-fill'; el.insertBefore(f, el.firstChild);
      el.addEventListener('pointerdown', function (e) { var r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        var d = Math.max(Math.hypot(x, y), Math.hypot(r.width - x, y), Math.hypot(x, r.height - y), Math.hypot(r.width - x, r.height - y)) * 2.4;
        var c = document.createElement('div'); c.className = 'jj-' + kind + '-pink'; c.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (x - d / 2) + 'px;top:' + (y - d / 2) + 'px;'; el.appendChild(c);
        void c.offsetWidth; c.style.transform = 'scale(1)'; setTimeout(function () { c.style.opacity = '0'; }, 600); setTimeout(function () { c.remove(); }, 1000); }); }
    pressFx(document.getElementById('jjst-skipcta'), 'btn'); pressFx(document.getElementById('jjst-back'), 'cta'); pressFx(document.getElementById('jjst-skipgo'), 'cta');
    pressFx(document.getElementById('jjst-nosnd'), 'cta'); pressFx(document.getElementById('jjst-yessnd'), 'cta');
    wireStageHits(document.getElementById('jjst'));
    window.addEventListener('jj:score:pause', function () { pauseStory(); clearHits(); document.querySelectorAll('#jjst .warm').forEach(function (n) { n.classList.remove('warm'); }); });
    window.addEventListener('jj:score:resume', function () { if (!ov.classList.contains('on')) resumeStory(); });
    var ov = document.getElementById('jjst-skipov');
    document.getElementById('jjst-skipcta').addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation();
      document.getElementById('jjst-left').textContent = storyLeft(); pauseStory(); ov.classList.add('on'); });
    document.getElementById('jjst-back').addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); ov.classList.remove('on'); resumeStory(); });
    document.getElementById('jjst-skipgo').addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); ov.classList.remove('on'); storyPaused = false; skipStory(); });
    ov.addEventListener('click', function (e) { e.stopPropagation(); });
    prog = document.getElementById('jjst-progress'); fill = document.getElementById('jjst-progress-fill');


    /* ---- the gate: the evolution loader (jj-loader.js, variant C) fronts the whole page when
       it's available — real byte progress over the story's heaviest boards while the seven stages
       of Joe paint themselves in. Falls back to the little built-in loader if jj-loader is absent. */
    function beginStory() {
      var ld = document.getElementById('jjst-loader'); if (ld) ld.classList.add('hide');
      PRELOAD.forEach(function (n) { var im = new Image(); im.src = F(n); });   // the rest of the boards — AFTER the loader, so they never race it
      warmClips();                                                            // and the video clips, one at a time, in the order the tale needs them
      if (window.JJ_STORY_HOLD) {                      // preview mode: instant reveal, no typing/choreography
        var blk = document.getElementById('jjst-black'); blk.style.display = 'none';
        capEl.classList.add('on'); prog.classList.add('on');
        textEl.textContent = 'Preview — jjStory.hold(\'tavern\') to jump comps';
        return;
      }
      setTimeout(function () { revealFromBlack(); bedLive(); }, T.revealAt);
      setTimeout(function () {
        var go = function () {                                             // the box, the skip CTA, the nav, the first line — same beats as before
          capEl.classList.add('on'); prog.classList.add('on'); document.getElementById('jjst-skipcta').classList.add('on');
          setTimeout(navDrop, T.menuDropAt - T.boxFadeAt);
          setTimeout(function () { runScene(0); }, T.firstTypeAt - T.boxFadeAt);
        };
        if (soundOff()) askSound(go); else go();                          // muted visitors get a word first; nothing is typing yet, so nothing to pause
      }, T.boxFadeAt);
    }
    function navDrop() {
      var nav = document.querySelectorAll('.nav-logo-link, .menu-container, #jj-sc-hud');   // the score pill rides in with the menu
      nav.forEach(function (n) { n.style.transition = 'none'; n.style.transform = 'translateY(-42px)'; n.style.opacity = '0'; });
      void document.body.offsetWidth;
      document.documentElement.classList.add('jj-nav-in');           // lifts the !important hide (page head + the rule injected below)
      nav.forEach(function (n) { n.style.transition = 'transform .9s cubic-bezier(.22,1,.36,1), opacity .9s ease'; n.style.transform = 'translateY(0)'; n.style.opacity = '1'; });
    }
    /* the site's moon button owns mute (session-scoped); we only read it, and press it on the visitor's behalf */
    function soundOff() { try { if (sessionStorage.getItem('jjUserMuted') === '1') return true; } catch (e) {}
      var b = document.getElementById('jj-sound-btn'); return !!(b && b.classList.contains('is-muted')) || !!(window.jjAudio && window.jjAudio.muted); }
    function askSound(go) {
      var so = document.getElementById('jjst-sndov'), done = false;
      function pick(on) { if (done) return; done = true;
        if (on) { var b = document.getElementById('jj-sound-btn'); if (b && b.classList.contains('is-muted')) b.click(); else if (window.jjAudio) window.jjAudio.muted = false;
          try { sessionStorage.setItem('jjUserMuted', '0'); } catch (e) {} }
        so.classList.remove('on'); go(); }
      document.getElementById('jjst-nosnd').addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); pick(false); });
      document.getElementById('jjst-yessnd').addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); pick(true); });
      so.addEventListener('click', function (e) { e.stopPropagation(); });
      so.classList.add('on');
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
        assets: [F('cav-bg'), F('cav-dragon-1'), F('vil-bg'), F('tav-bg-2'), F('wood-bg'), F('cas-bg'), BANNER].concat(EVO, EVOG, EVOB),
        stages: EVO, stagesGrey: EVOG, stagesB: EVOB,
        /* measured content boxes per stage (from the loader A/B page) — seats + fill spans */
        stageBounds: [[0.390,0.590],[0.292,0.655],[0.278,0.740],[0.165,0.780],[0.163,0.805],[0.090,0.880],[0.115,0.838]],
        stageBoundsX: [[0.393,0.632],[0.268,0.733],[0.350,0.685],[0.237,0.750],[0.360,0.757],[0.212,0.757],[0.372,0.728]],
        msg1: 'This is an interactive journey\u2026', msg2: 'If you engage with the characters you might get more out of the experience\u2026',
        minTime: 4500, maxWait: 18000, decode: true,
        onReady: beginStory
      });
      });
    } else {
      setComp('cavern');
      preloadCritical(beginStory);
    }
  }
  /* The clips are the only heavy assets not covered by the loader. Fetch them sequentially in story order
     (one format only — whichever this browser will actually play) so each sits in the HTTP cache before its
     scene mounts; the <video> then loads instantly instead of showing its poster while it buffers. */
  function warmClips(){
    var probe = document.createElement('video'), hevc = !!probe.canPlayType('video/mp4; codecs="hvc1"');
    var seen = {}, order = [];
    ['cavern','village1','village2','tavern','tavern2','woodland','castle1','castle2','castle3','castle4','castle5','castle6'].forEach(function (n) {
      ((COMP[n] || {}).layers || []).forEach(function (L) { if (L.vid && !seen[L.vid]) { seen[L.vid] = true; order.push(L.vid); } }); });
    var i = 0;
    function next(){ if (i >= order.length || !window.fetch) return; var u = GB + 'story-' + order[i++] + (hevc ? '.mov' : '.webm') + AV;
      fetch(u, { priority: 'low' }).then(function (r) { return r.blob(); }).catch(function () {}).then(next); }
    next();
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
