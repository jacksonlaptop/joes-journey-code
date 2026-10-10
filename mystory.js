/* jjClipSrc(base[, query]): ONE <source> per clip, the format this browser should use (Safari: the HEVC-alpha .mov; everyone else: the VP9-alpha .webm), so nothing downloads or probes the other */
if (!window.jjClipSrc) window.jjClipSrc = (function () { var hevc = null; return function (b, q) { if (hevc === null) { try { hevc = !window.chrome && !!document.createElement('video').canPlayType('video/mp4; codecs="hvc1"'); } catch (e) { hevc = false; } } q = q || ''; return hevc ? '<source src="' + b + '.mov' + q + '" type=\'video/mp4; codecs="hvc1"\'>' : '<source src="' + b + '.webm' + q + '" type="video/webm">'; }; })();
/* ============================================================================
   Joe's Journey — "My Story" scrollable timeline  (hosted via GitHub + raw.githack)

   The section AFTER the storytime intro: 16 steps × 100vh, six eras.
   Builds everything itself: the 16 sections, the LEFT year-ruler (slides out,
   tracks scroll, year lights up), the era header (top-left, evolution icons),
   the NEXT ↓ button, and the bottom era anchor nav (click = scroll to era).

   WEBFLOW: load before </body> on the Storytime page (after storytime.js):
     <script src="https://cdn.jsdelivr.net/gh/jacksonlaptop/joes-journey-code@main/mystory.js?v=1"></script>
   It appends itself to <body> (or to #jj-mystory-mount if that div exists).
   All copy/eras/years live in the CONFIG below.
   ============================================================================ */
(function () {
  window.JJ_MYSTORY_BUILD = 'm-1008b "Let there be Joe" is spoken as the light lands, after the tale\'s last line · m-1008a the sleep rule finished: steps and the finale animate only on screen, eras only while showing, clips play only on screen and loops far away give their decoder back, the map canvas is drawn on approach; a score card or panel no longer re-styles the story; BEHIND A SWITCH, off by default (?skipfar=1, or =steps / =sky for one half): steps and eras more than a screen away are not rendered, and the sky hides what is far; m-1007a dormant until the hand-over: nothing is built under the tale (jjTale / jj:mystory-prefetch, -wake, -ready, -lift, -sleep), sleepable after a replay, the opacity polls are gone; m-1002a the sound moon: quiet (sound on, nothing playing) keeps the light moon with resting bars, only muted goes dark; m-1001b the octopus is a story layer in front of the photos and comes back after his ink jet; the J rocket rises at under half speed; the homepage Jupiter + Mars in the Information Age sky · m-1001 the modern map is drawn in code (dot-matrix world, pins from real lat/long, trails, scanlines); old-map projection config ready · m-0930d the coral octopus is the Precambrian award (no flip; the purple one retired), Joe\u2019s rocket flies with flames, the UFO hovers on thrusters · m-0930c Joe\u2019s octopus swims the Precambrian sea (ms-octopus-swim), no easel, Mars + Jupiter for the ringed planet, a narrower Figma middle pane · m-0930b volcano eruption (click, Blender one-shot + code fallback, Prehistoric achievement), creatures back to their stepped frames, themed film skip buttons, Figma page list back (one column, Wanda first, prompts), exam CTA as the Replay Storytime banner, finale settles on a return · m-0930 Blender volcano + campfire, crossfaded creature frames, J banner cloth, cinema hover in the dark + themed X, no Canada on map one, Super Reel flatter window + bigger phones, scroll fades, captions · m-0928 drag hint (fire + post-it), fire drag no longer freezes the cursor, slower shadows, Taiwan pill between slides, dream room never upscales Joe, BIMA statues, Super Reel even spacing + phones fade · m-0917 perf governor + block captions + one games slide + header on the nav line · M111 - Big Bang and quiz achievements wired';
  try { console.log('%c[JJ] mystory.js build: ' + window.JJ_MYSTORY_BUILD, 'color:#FF00F5;font-weight:bold'); } catch (e) {}

  var GB = 'https://cdn.jsdelivr.net/gh/jacksonlaptop/joes-journey-code@main/';
  /* demo pages can point at local copies via window.JJ_SPRITE_BASE */
  var SB = window.JJ_SPRITE_BASE || GB;

  /* ---------------- CONFIG — every word of the story ---------------- */
  /* The full evolution sprite line, extracted from the design frames themselves. */
  var SPRITES = [
    SB + 'story-sprite-01-amoeba.webp',
    SB + 'story-sprite-02-fish.webp',
    SB + 'story-sprite-03-walker.webp',
    SB + 'story-sprite-04-ape.webp',
    SB + 'story-sprite-05-caveman.webp',
    SB + 'story-sprite-06-greek.webp',
    SB + 'story-sprite-07-roman.webp',
    SB + 'story-sprite-08-peasant.webp',
    SB + 'story-sprite-09-villager.webp',
    SB + 'story-sprite-10-knight.webp',
    SB + 'story-sprite-11-painter.webp',
    SB + 'story-sprite-12-scholar.webp',
    SB + 'story-sprite-13-modern.webp',
    SB + 'story-sprite-14-scientist.webp',
    SB + 'story-sprite-15-astronaut.webp'
  ];
  /* icons per era, EXACTLY as the design frames: first = active (big + 100%), rest = the
     upcoming evolution, ghosted with size/opacity falloff */
  var ERAS = [
    { nav: 'Precambrian', title: 'Precambrian Era', ages: 'Ages 1 – 12', years: [1995.87, 2008], icons: [1, 3] },   /* 2 slides (hero, games) = 2 sprites: amoeba, walker (the fish went with the raids slide) */
    { nav: 'Prehistoric', title: 'Prehistoric Age', ages: 'Ages 13 – 18', years: [2009, 2014], icons: [4, 5] },
    { nav: 'Ancient', title: 'Ancient Era', ages: 'Ages 19 – 20', years: [2015, 2016], icons: [6, 7] },
    { nav: 'Medieval', title: 'Medieval Era', ages: 'Ages 21 – 24', years: [2017, 2020], icons: [8, 10] },   /* 2 slides (Brighton, Taipei) = peasant, knight */
    { nav: 'Renaissance', title: 'Renaissance Period', ages: 'Ages 25 – 29', years: [2021, 2025], icons: [11, 12] },
    { nav: 'Information', title: 'Information Age', ages: 'Age 30+', years: [2026, 2026], icons: [13, 14, 15] }   /* 3 slides (Super Reel, spare time, grandad) = modern, scientist, astronaut */
  ];
  /* special moments pinned on the ruler */
  var EVENTS = [
    { y: 1995 + 318 / 365, label: 'November 14th' }          // born 14 Nov 1995
  ];
  /* ---- CLUSTERS: a LEAD photo with the rest of its set stacked behind it; click and the whole set fans
     out in a lightbox. Used for the travel screen (step 7, positions from My Storytravel.svg, canvas
     1627×1019) and the football run on the sports screen (step 4). `files` lists the whole set, lead
     first. `cc` (optional) are the countries, shown as individual floating chips beside the photo. ---- */
  var MEXCAP = 'Made it to Mexico for D\u00edas de los Muertos! (maybe slightly influenced by ' +
    'Book of Life and Coco\u2026)';
  var FG_NAMES = ['Max', 'Alix', 'James', 'George', 'Mike', 'Matt', 'Dan', 'Gabe', 'Ross', 'Shaun'];   /* Joe's design colleagues, as Figma cursors */
  var FG_COL = ['#FF7262', '#A259FF', '#1ABCFE', '#0ACF83', '#F24E1E', '#FFC700', '#FF00F5', '#18A0FB', '#7B61FF', '#14AE5C'];
  /* who worked on what (the logos' aria-labels): they hang round their own project and click about on it. The bosses (boss:true)
     go between every project, their own first. Anyone not listed wanders the canvas. (Joe, 2026-09-24) */
  var FG_TEAM = { Shaun: ['BBC'], Mike: ['BBC'], Gabe: ['BBC'], Dan: ['Lab'], Alix: ['UCL'], Ross: ['AXA'], James: ['Art Basel'], George: [] };
  var FG_BOSS = { James: true, George: true };
  var LOGOS = {
    /* the agency slide, laid out to My Story - Agency 1.svg */
    8: [
      { t: 'BBC',          src: 'ag-bbc.webp',        x: 41.98, y: 25.0,  w: 16.29, r: 2.11,  fx: 'boom' },
      { t: 'AXA',          src: 'ag-axa.webp',        x: 17.45, y: 28.06, w: 8.4,   r: -3.58, fx: 'shield' },
      { t: 'Lab',          src: 'ag-lab.webp',        x: 70.88, y: 22.47, w: 6.58,  r: 6.37,  fx: 'wire' },
      { t: 'Carter Jonas', src: 'ag-cj.webp',         x: 82.5,  y: 33.5,  w: 10.69, r: 6.27,  fx: 'house' },
      { t: 'Art Basel',    src: 'ag-artbasel.webp',   x: 6.73,  y: 50.04, w: 6.08,  r: 6.07,  fx: 'easel' },
      { t: 'Tui',          src: 'ag-tui.webp',        x: 79.0,  y: 56.5, w: 9.17,  r: 6.38,  fx: 'travel' },
      { t: 'Mnemoscene',   src: 'ag-mnemoscene.webp', x: 33.56, y: 69.60, w: 7.13,  r: 0.25,  fx: 'vr' },
      { t: 'UCL',          src: 'ag-ucl.webp',        x: 59.66, y: 75.21, w: 6.82,  r: 4.86,  fx: 'grad' },
      { t: 'Screwfix',     src: 'ag-screwfix.webp',   x: 15.30, y: 75.67, w: 7.5,   r: -3.81, fx: 'screw' }
    ],
    /* the awards slide, laid out to My Story - Awards 1.svg. The two agencies draw a little design
       illustration when pressed; the BIMAs are the actual silver awards, so they get the shine on
       hover and the confetti on press. */
    9: [
      { t: 'Foolproof',            src: 'aw-2.webp',     x: 13.28, y: 29.90, w: 13.09, r: -3.68, fx: 'cursor2' },
      { t: 'UIC Digital × Fantasy', src: 'aw-3.webp', x: 75.5, y: 24.24, w: 17.27, r: 0, fx: 'grid' },
      { t: 'BIMA Awards 2021 \u00b7 Best Digital Transformation, Silver',
        src: 'aw-bima1.webp', x: 39.6, y: 62.0, w: 9.6, r: 0,  fx: 'boom', shine: true, cab: [8.4, 1.3, 8.4] },   /* on the cabinet's shelf: cab = [left, top, width] in cabinet units from its top-left */
      { t: 'BIMA Awards 2024 \u00b7 Best Digital Transformation, Silver',
        src: 'aw-bima2.webp', x: 50.6, y: 62.3, w: 9.6, r: 0, fx: 'boom', shine: true, cab: [23.2, 1.3, 8.4] },
      { t: 'Joe',                  src: 'story-cas-hurrah2-poster.webp', vid: 'story-cas-hurrah2', x: 20, y: 60, w: 9.2,  r: 0,     fx: 'boom' }   /* designer Joe's quick cheer (the storytime clip), in place of the crowned still (Joe, 2026-09-21) */
    ]
  };
  var CLUSTERS = [
    /* Europe sits in the middle of the screen now. Its countries still cluster BESIDE the photo
       (ccSide) rather than under it — the headline is directly below and there's no room. x centres
       the WHOLE group: photo (13) + gap (1.2) + chips (17) = 31.2vw wide, so 50 - 31.2/2 = 34.4. */
    { step: 'atlas', key: 'eu', x: 34.4, y: 17.5, w: 13, rot: -6.62, ar: 0.75, name: 'Europe',
      files: ['trav-eu-1.jpg'],
      cc: [['Belgium', '🇧🇪'], ['Netherlands', '🇳🇱'], ['Germany', '🇩🇪'], ['Poland', '🇵🇱'], ['Czechia', '🇨🇿'], ['Slovenia', '🇸🇮'], ['Croatia', '🇭🇷']],
      ccSide: true, ccw: 17,
      cap: 'Went interrailing with my friends from school, this is the only photo that survived!' },
    /* Peru / Bolivia lives on the Mexico screen now — top left, clear of the philosopher below it
       and of the Mexico set on the right. */
    { step: 'atlas', key: 'pe', x: 8.5, y: 19, w: 15, rot: 3.32, ar: 0.673, name: 'Peru / Bolivia',
      files: ['trav-pe-1.jpg', 'trav-pe-2.jpg', 'trav-pe-3.jpg'],
      cc: [['Peru', '🇵🇪'], ['Bolivia', '🇧🇴']], ccw: 20,
      cap: 'Ended up volunteering in a hostel (briefly), worked with the best crew in Bolivia' },
    { step: 'atlas', key: 'as', x: 75.17, y: 55.64, w: 14.9, rot: 4.1, ar: 1.23, name: 'Asia',
      files: ['trav-as-1.jpg', 'trav-as-2.jpg', 'trav-as-3.jpg', 'trav-as-4.jpg'],
      cc: [['Sri Lanka', '🇱🇰'], ['Nepal', '🇳🇵'], ['Vietnam', '🇻🇳'], ['Laos', '🇱🇦'], ['Thailand', '🇹🇭']], ccw: 22,
      cap: '2 Month travel ended up lasting 8 months including becoming a Western Manager of a hostel in Hanoi?' },
    { step: 'atlas', key: 'au', x: 13.09, y: 58.89, w: 12.3, rot: -8.97, ar: 1.30, name: 'Australia',
      files: ['trav-au-1.jpg', 'trav-au-2.jpg', 'trav-au-3.jpg', 'trav-au-4.jpg'],
      cc: [['Australia', '🇦🇺']], ccw: 12,
      cap: 'Worked at gigs and events in Melbourne and ended with my farm work in Bundaberg (also was injured by a falling sweet potato…)' },
    /* Mexico for Día de los Muertos — same collection treatment as the travel screen: mex-01 leads,
       the other three fan out on click, and the caption only shows in the modal */
    { step: 'atlas', key: 'mx', x: 71.5, y: 6.0, w: 13.5, rot: 8.55, ar: 1.335, name: 'Mexico',
      files: ['mex-01.jpg', 'mex-02.jpg', 'mex-03.jpg', 'mex-04.jpg'],
      cc: [['Mexico', '\ud83c\uddf2\ud83c\uddfd']], ccw: 13.5, ccGap: 0.5,
      cap: MEXCAP },
    /* Canada: a passport spread + a Vancouver pin on the atlas only (after Mexico in the trip). trav-ca-1.jpg is a PLACEHOLDER until Joe's photo lands */
    { step: 'atlas', key: 'ca', x: 0, y: 0, w: 10, rot: 0, ar: 0.75, name: 'Canada',
      files: ['trav-ca-1.jpg'], cc: [['Canada', '\ud83c\udde8\ud83c\udde6']],
      cap: 'Only picture I have left is of watching the Canucks in Vancouver, one for the bucket list!' },
    /* Brighton — one photo, tagged like the countries */
    { step: 6, key: 'br', x: 45, y: 16.5, w: 9, rot: 4.11, ar: 1.333, name: 'Brighton',
      files: ['brighton-01.jpg'],
      cc: [['Brighton', '\ud83c\uddec\ud83c\udde7']], ccw: 9, ccGap: 0.5,
      cap: 'Me catching the Sun' },
    /* the friends set — one photo leads, the rest fan out */
    { step: 2, key: 'fr', x: 16.41, y: 19.5, w: 17.5, rot: -6.33, ar: 0.665,
      name: 'We re-created the same picture 5 years on and yes, that\u2019s me with our headteacher',
      files: ['friends-1.jpg', 'friends-2.jpg', 'friends-3.jpg', 'friends-4.jpg'] },
    /* the rugby pair */
    { step: 2, key: 'rg', x: 79.6, y: 57, w: 17, rot: 14.15, ar: 1.014,
      name: 'I think I got past one of them...',
      files: ['sport-05.jpg', 'rugby-2.jpg'] },
    /* the football run, clustered like the travel sets */
    { step: 2, key: 'fb', x: 8.48, y: 62.45, w: 22.26, rot: -10.87, ar: 0.42,
      name: 'Yep, thats me scoring a goal 😎, thanks for the photos Karen Brooke!',
      files: ['sport-00.jpg', 'sport-01.jpg', 'sport-02.jpg', 'sport-03.jpg', 'sport-04.jpg'] },
    /* the two REAL newspaper clippings (cut out of Joe's photos): shown small with a glow on the lines about Joe; pressed, they open
       large with the marker highlights and the zoomed strips (CLIPS, clipHTML). Next to the football run, clear of the MW2 cover. */
    { step: 2, key: 'np', clip: true, x: 44.2, y: 64, w: 9.6, rot: 3.5, ar: 1.026,   /* centre bottom (Joe, 2026-09-24) */
      name: '(yeah they\u2019re real newspaper clippings my dad luckily saved...)', cap: '',
      files: ['clip-vipers.webp', 'clip-chronicle.webp'] }
    ,
    /* ---- the spare-time slide (step 12): recent trips, GROUPED BY YEAR so they fit. A group shows its front set with the
       others tucked behind it under a year badge; hovering the group fans them out side by side, and each one opens its own
       modal like any travel set. `grp` = the year, `tuck` = how far (vw, vh) a back set hides toward the front one.
       trav-dog-*, trav-es-*, trav-bk-* and trav-id-3/4 are PLACEHOLDER photos. */
    { step: 'none', key: 'es', grp: '2026', tuck: [-13.5, 1.5], x: 23.5, y: 17, w: 12.5, rot: 5.2, ar: 0.75, name: 'Spain / Portugal',
      files: ['trav-es-1.jpg', 'trav-es-2.jpg', 'trav-es-3.jpg', 'trav-es-4.jpg'], cc: [['Spain', '\ud83c\uddea\ud83c\uddf8'], ['Portugal', '\ud83c\uddf5\ud83c\uddf9']], ccw: 14, cap: 'PLACEHOLDER caption' },
    { step: 'atlas2', key: 'dog', place: 'Scotland', grp: '2026', yr: true, x: 8.5, y: 19, w: 13, rot: -4.6, ar: 0.75, name: 'Dogsitting',
      files: ['trav-dog-1.jpg', 'trav-dog-2.jpg', 'trav-dog-3.jpg', 'trav-dog-4.jpg', 'trav-dog-5.jpg'], cc: [['Scotland', '\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f']], ccw: 14, cap: 'PLACEHOLDER caption' },   /* Scotland only: no England stamp on this page (Joe, 2026-09-25) */
    { step: 'atlas2', key: 'id', grp: '2025', tuck: [14, 1.5], x: 63.5, y: 18.5, w: 11, rot: -5.4, ar: 1.143, name: 'Indonesia',
      files: ['trav-id-1.jpg', 'trav-id-2.jpg', 'trav-id-3.jpg', 'trav-id-4.jpg'], cc: [['Indonesia', '\ud83c\uddee\ud83c\udde9']], ccw: 12, cap: 'PLACEHOLDER caption' },
    { step: 'atlas2', key: 'nz', grp: '2025', yr: true, x: 77.5, y: 18, w: 13.5, rot: 4.8, ar: 0.75, name: 'New Zealand',
      files: ['trav-nz-1.jpg', 'trav-nz-2.jpg', 'trav-nz-3.jpg', 'trav-nz-4.jpg', 'trav-nz-5.jpg'], cc: [['New Zealand', '\ud83c\uddf3\ud83c\uddff']], ccw: 14, cap: 'PLACEHOLDER caption' },
    { step: 'atlas2', key: 'bk', grp: '2024', yr: true, x: 8.5, y: 64, w: 13.5, rot: -5.8, ar: 0.75, name: 'The Balkans',
      files: ['trav-bk-1.jpg', 'trav-bk-2.jpg', 'trav-bk-3.jpg', 'trav-bk-4.jpg', 'trav-bk-5.jpg'],
      cc: [['Serbia', '\ud83c\uddf7\ud83c\uddf8'], ['Croatia', '\ud83c\udded\ud83c\uddf7'], ['Bosnia', '\ud83c\udde7\ud83c\udde6'], ['Montenegro', '\ud83c\uddf2\ud83c\uddea'], ['Albania', '\ud83c\udde6\ud83c\uddf1']], ccw: 20, cap: 'Serbia, Croatia, Bosnia & Herzegovina, Montenegro and Albania. PLACEHOLDER caption' },
    { step: 'atlas2', key: 'ch', x: 0, y: 0, w: 10, rot: 0, ar: 0.75, name: 'Switzerland', files: ['trav-ch-1.jpg', 'trav-ch-2.jpg', 'trav-ch-3.jpg'], cc: [['Switzerland', '\ud83c\udde8\ud83c\udded']], cap: 'PLACEHOLDER note' },   /* PLACEHOLDER photos */
    { step: 'atlas2', key: 'dk', x: 0, y: 0, w: 10, rot: 0, ar: 0.75, name: 'Denmark', files: ['trav-dk-1.jpg', 'trav-dk-2.jpg', 'trav-dk-3.jpg'], cc: [['Denmark', '\ud83c\udde9\ud83c\uddf0']], cap: 'Went on a tattoo adventure with my Dad and Brother\u2026 let\u2019s just say my family are\u2026 unique' },   /* PLACEHOLDER photos */
  ];
  /* ---- the two real newspaper clippings (v2): every rect is in pixels of the cut-out image. `hl` = the marker strokes over the lines
     about Joe, `z` = the strip that gets enlarged (crop) and where it sits in the empty corner of the L (at = x, y, width) ---- */
  var CLIPS = {
    'clip-vipers.webp': { w: 731, h: 750,
      z: [ { crop: [6, 435, 258, 52], at: [300, 318, 420], hl: [[12, 437, 246, 16], [12, 453, 246, 15], [12, 468, 42, 16]] },
           { crop: [6, 662, 258, 54], at: [300, 560, 420], hl: [[34, 664, 224, 16], [12, 680, 246, 16], [12, 696, 182, 16]] } ] },
    'clip-chronicle.webp': { w: 910, h: 690,
      z: [ { crop: [12, 389, 304, 42], at: [360, 372, 500], hl: [[18, 391, 289, 16], [18, 408, 43, 16]] },
           { crop: [12, 621, 306, 42], at: [360, 540, 500], hl: [[155, 625, 154, 16], [18, 642, 293, 16]] } ] }
  };
  function clipHTML(file) {   /* the clipping + its highlighter strokes + the torn zoom strips and their leader lines ('play' animates them in) */
    var C = CLIPS[file], src = SB + file, pc = function (v, of) { return (v / of * 100).toFixed(3) + '%'; }, h = '<img src="' + src + '" alt="Newspaper clipping">', lines = '', i = 0;
    C.z.forEach(function (Z, j) {
      var cx = Z.crop[0], cy = Z.crop[1], cw = Z.crop[2], ch = Z.crop[3], sx = Z.at[0], sy = Z.at[1], sw = Z.at[2], sh = sw * ch / cw;
      var inner = '<img src="' + src + '" alt="" style="width:' + pc(C.w, cw) + ';left:' + pc(-cx, cw) + ';top:' + pc(-cy, ch) + '">';
      Z.hl.forEach(function (r) {
        h += '<span class="hl" style="--i:' + (i++) + ';left:' + pc(r[0], C.w) + ';top:' + pc(r[1], C.h) + ';width:' + pc(r[2], C.w) + ';height:' + pc(r[3], C.h) + ';rotate:' + ((i % 3) - 1) * .4 + 'deg"></span>';
        inner += '<span class="hl" style="--i:0;left:' + pc(r[0] - cx, cw) + ';top:' + pc(r[1] - cy, ch) + ';width:' + pc(r[2], cw) + ';height:' + pc(r[3], ch) + '"></span>';
      });
      var fl = Z.hl[0], ox = fl[0] + fl[2] / 2, oy = fl[1] + fl[3] / 2, ex = fl[0] + fl[2];   /* the strip grows out of its first highlighted line */
      h += '<div class="zs" style="--j:' + j + ';left:' + pc(sx, C.w) + ';top:' + pc(sy, C.h) + ';width:' + pc(sw, C.w) + ';height:' + pc(sh, C.h) + ';transform-origin:' + pc(ox - sx, sw) + ' ' + pc(oy - sy, sh) + ';rotate:' + (j ? 1.5 : -1.5) + 'deg"><div class="zi">' + inner + '</div></div>';
      lines += '<path style="--j:' + j + '" d="M' + (ex / C.w * 100).toFixed(2) + ',' + (oy / C.h * 100).toFixed(2) + ' Q' + ((ex + sx) / 2 / C.w * 100).toFixed(2) + ',' + ((oy + sy + sh / 2) / 2 / C.h * 100 - 3).toFixed(2) + ' ' + (sx / C.w * 100).toFixed(2) + ',' + ((sy + sh / 2) / C.h * 100).toFixed(2) + '"/>';
    });
    return '<div class="clipw">' + h + '<svg class="lead-ln" viewBox="0 0 100 100" preserveAspectRatio="none">' + lines + '</svg></div>';
  }
  /* the atlas's rough continents (lon, lat): hand-traced and smoothed when drawn, deliberately approximate */
  var ATLAS_LAND = [
      [[-168,66],[-156,71],[-140,70],[-128,70],[-115,68],[-95,72],[-80,73],[-65,62],[-60,55],[-56,52],[-66,45],[-70,42],[-76,38],[-76,35],[-81,31],[-80,26],[-82,28],[-84,30],[-90,30],[-97,28],[-97,22],[-92,19],[-87,21],[-88,16],[-84,11],[-80,8],[-78,8],[-80,7],[-85,10],[-92,14],[-100,17],[-106,23],[-110,24],[-112,29],[-115,31],[-117,33],[-121,35],[-124,40],[-124,46],[-123,49],[-130,55],[-138,59],[-146,61],[-152,59],[-158,57],[-164,55],[-162,59],[-166,62],[-165,65]],
      [[-55,60],[-44,60],[-40,65],[-22,70],[-20,77],[-18,81],[-35,83],[-60,82],[-70,78],[-58,75],[-52,68]],
      [[-80,9],[-75,11],[-72,12],[-62,11],[-52,5],[-50,0],[-45,-2],[-35,-6],[-35,-9],[-39,-15],[-40,-22],[-48,-26],[-53,-33],[-58,-38],[-62,-40],[-65,-45],[-68,-50],[-69,-54],[-74,-52],[-74,-45],[-73,-37],[-71,-30],[-70,-18],[-76,-14],[-81,-6],[-80,-2],[-78,2],[-77,7]],
      [[-10,36],[-9,43],[-2,43.5],[-4,48],[2,51],[5,53],[8,54],[10,57],[12,55],[18,55],[21,57],[24,60],[22,65],[18,63],[15,68],[20,70],[28,71],[40,68],[44,66],[60,69],[70,73],[80,73],[100,77],[112,74],[130,71],[142,72],[160,70],[180,69],[180,65],[172,64],[160,60],[163,56],[156,51],[150,59],[142,59],[138,54],[140,48],[135,43],[130,42],[127,38],[126,35],[121,31],[122,25],[117,23],[110,21],[108,17],[109,12],[105,9],[103,10],[100,13],[101,7],[103,2],[100,4],[98,9],[98,16],[94,17],[92,22],[88,22],[80,15],[78,8],[73,17],[72,21],[67,24],[62,25],[57,26],[56,24],[59,22],[52,17],[44,12],[43,15],[39,21],[35,28],[34,31],[36,36],[30,36],[27,37],[26,40],[23,40],[23,37],[20,40],[19,42],[14,45],[12,44],[16,41],[16,38],[12,38],[13,41],[10,44],[7,43.5],[3,43],[0,39],[-2,37],[-6,36]],
      [[-17,15],[-17,21],[-13,27],[-10,30],[-6,36],[0,35.5],[10,37],[11,33],[20,31],[25,32],[32,31],[34,28],[39,21],[43,12],[51,12],[51,10],[47,4],[40,-3],[39,-8],[41,-15],[35,-24],[33,-26],[28,-33],[20,-35],[18,-32],[14,-23],[12,-17],[13,-9],[9,-1],[9,4],[5,6],[-5,5],[-8,4],[-13,8],[-15,11]],
      [[-5,50],[1,51],[2,52.8],[0,54],[-2,56],[-2,58],[-5,58.6],[-6,56],[-5,55],[-3,54],[-4,53],[-5,52],[-4,51.5],[-6,50]],
      [[-10,51.6],[-6,52],[-6,54],[-8,55.3],[-10,54]],
      [[-24,65],[-18,66.5],[-13,65],[-18,63.5]],
      [[44,-25],[47,-25],[50,-15],[49,-12],[44,-17]],
      [[114,-22],[114,-26],[115,-34],[118,-35],[124,-34],[130,-32],[135,-35],[138,-35],[140,-38],[146,-39],[150,-37],[153,-32],[153,-25],[146,-19],[145,-15],[142,-11],[141,-17],[136,-12],[132,-11],[129,-15],[125,-14],[122,-18]],
      [[130,31],[132,34],[135,34],[140,36],[141,41],[140,38],[136,36],[132,35]],
      [[95,5],[98,4],[104,-2],[106,-6],[102,-4]], [[109,1],[111,-3],[116,-4],[119,1],[117,7],[113,3]], [[105,-6],[114,-8],[106,-7]],
      [[80,6],[82,7.5],[80,9.8]],
      [[172,-34.5],[178,-38],[175,-41],[172,-41],[167,-46],[169,-46.5],[174,-41]]
    ];
  /* the atlas surface (v2): '' = the drawn continents; set a file in github-upload (e.g. 'atlas-map.webp', the painted old map) and it becomes
     the map instead, at its own shape. ATLAS_PINS are each stop's spot on that surface in % (x across, y down): re-place them to suit the painting. */
  var ATLAS_IMG = 'atlas-map.webp';   /* Joe's painted old map (1630x902, torn parchment on transparent) */
  var ATLAS_PINS = ATLAS_IMG ?
    { home: [50.4, 27.6], eu: [56.5, 31.5], pe: [27, 63], as: [78, 48], au: [91.5, 75], mx: [18, 46.5], ca: [10.5, 28.5] } :   /* placed by eye on the painting (Maidenhead, central Europe, Peru/Bolivia, Indochina, east Australia, Mexico, Vancouver) */
    { home: [44.25, 15.67], eu: [48.33, 16.67], pe: [25, 60], as: [73.83, 36], au: [84.72, 75.2], mx: [16.92, 37.07], ca: [10.28, 17.33] };   /* the drawn continents */
  /* travel, part two (v2): the modern map (2400x1303, torn parchment on transparent, a framed Europe inset lower-left). Everything in % of it.
     PINS = the stops with a passport page; DOTS = every other country Joe has been to (glowing, unlabelled, not clickable); VIA = the
     main-map twin of a point that sits in the Europe inset, used when the route leaves or joins the inset. */
  var ATLAS2_IMG = 'atlas-map-modern.webp';
  var ATLAS2_PINS = { 'dog': [7.8, 63.4], 'bk': [18.0, 80.2], 'ch': [12.9, 75.8], 'dk': [14.4, 65.2], 'id': [81.0, 50.5], 'nz': [91.8, 72.5] };
  var ATLAS2_DOTS = { 'England': [9.3, 69.8], 'Wales': [7.4, 69.3], 'Northern Ireland': [6.1, 65.6], 'Ireland': [5.2, 67.6], 'France': [9.9, 75.6], 'Belgium': [11.3, 71.1], 'Netherlands': [11.9, 69.2], 'Germany': [13.9, 71.5], 'Austria': [15.8, 75.4], 'Italy': [15.0, 80.8], 'Spain': [7.1, 83.3], 'Portugal': [4.7, 83.5], 'Sweden': [16.6, 59.7], 'Poland': [17.8, 70.6], 'Czechia': [16.1, 73.2], 'Slovakia': [18.3, 74.5], 'Hungary': [18.3, 76.3], 'Slovenia': [16.1, 77.3], 'Bulgaria': [20.8, 80.4], 'Greece': [19.9, 85.0], 'Turkey': [24.5, 83.3], 'Morocco': [5.6, 92.4], 'Tunisia': [12.9, 91.0], 'Sri Lanka': [72.0, 40.8], 'Nepal': [73.6, 30.0], 'Vietnam': [78.9, 36.6], 'Laos': [78.0, 35.3], 'Thailand': [77.3, 37.8], 'Taiwan': [81.4, 31.5], 'Japan': [83.4, 25.8], 'Australia': [88.4, 64.0], 'Canada': [24.4, 16.8], 'Mexico': [27.3, 35.3], 'Peru': [32.6, 51.0], 'Bolivia': [35.4, 55.5] };
  /* the same countries again on the MAIN map (its Europe and North Africa were empty): small, unlabelled, not clickable. % of the map, placed by eye */
  var ATLAS2_DOTS_MAIN = { 'England': [51.7, 16.6], 'Wales': [51.0, 16.7], 'Northern Ireland': [50.1, 15.0], 'Ireland': [49.8, 15.9], 'France': [51.6, 19.6], 'Belgium': [52.3, 17.6], 'Netherlands': [52.6, 16.8], 'Germany': [53.9, 17.9], 'Austria': [55.2, 19.8], 'Italy': [54.5, 21.7], 'Spain': [50.1, 23.0], 'Portugal': [49.2, 22.9], 'Sweden': [55.1, 12.7], 'Poland': [56.2, 17.7], 'Czechia': [55.3, 18.8], 'Slovakia': [56.7, 19.5], 'Hungary': [56.7, 20.3], 'Slovenia': [55.4, 20.6], 'Bulgaria': [58.4, 22.2], 'Greece': [57.7, 23.3], 'Turkey': [60.8, 23.7], 'Morocco': [50.1, 27.5], 'Tunisia': [53.9, 26.7] };
  var ATLAS2_VIA = { England: [50.6, 16.4], Czechia: [55.1, 18.6], dog: [50.3, 14.4], bk: [57.0, 22.2], ch: [53.3, 20.0], dk: [53.8, 15.0] };
  /* THE MODERN MAP, DRAWN IN CODE (Joe, 2026-10-01: "on brand", a futuristic Information Age map in place of the painted atlas-map-modern.webp).
     A dot-matrix world on dark navy: each land cell of a Miller-projection grid is a glowing dot (NEO_MAP.main: 225 x 122 bits, base64; the
     land itself was rasterised once from simplified world outlines, see scratchpad neomap/geo.py), a faint graticule and a few orbit arcs,
     a slow scanline shimmer, and a framed Europe close-up lower left (NEO_MAP.inset, 104 x 98). Pins and dots are placed from real
     longitude / latitude (GEO below) through the same projection, so they always sit on their countries. ATLAS2_NEO = false brings the
     painted map (and the old hand-placed percentages above) back. */
  var ATLAS2_NEO = true;
  var NEO_MAP = { ar: 2400 / 1303, top: 84.0, cols: 225, rows: 122, main: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH8A///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/9////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/+////+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA///////4AAAwAAAAAAAfAAAAAAAAAAAAAAAAAH/3/////AAB/4AAAAAAH8AAAAAAAAAAAAAAAGAf9/////4AAP+AAAAAAAfgAAAAAAAAAAAAAAP4D+f////+AAA/gAAAAAAD8AAAAAAAAAAAAAAD/gPh/////wAAD4AAAAAAAAwAAAAAAAAAAAAAAf8A4D////+AAAIAAAAEAAAfgAAAAAAAAAAAAAD8D+AD////gAAAAAAAHgAAP/AABgAAAAAAAAAAAAfwAD///8AAAAAAAD4AAH/4AAfgAAAAAAAAAAAAAAAP///gAAAAAAA8AAH//AAH4AAAAAAAAA8AAH4AB///4AAAAAAAPAAH//4AAAAAAAAAAAAP+AA/wAP///AAAAAAABwH/////4AAAAAAAAAAD/+AH/gA///4AAAAAAAeB//////h/AAAAABgAAB/4A//AH///AAAAAgABwP////////gAAAB/4AAP/gB/8Af//wAAAB/AAAD/////////wAAA////+/4AY/wD//8AAAA/+AAP///////////+gH/////4B/x/Af/4AAAAP/+B//////////////Af///////8H8D/8AAAAD//7//////////////+H////////h/wf/AAAAA/////////////////95////////4P8B/gD+AAH5////////////////DA///////8AfAH4APgAB+f///////////////wAf//////+AB4A/AAAAAfn///////////////8AH///////gAQADwAAAAP8////////////////AA///////4AfAAeAAAAB/H/////////////8/wAD/j/////AD/AAgAAAAP83/////////////P4AAP4B////4Af4AAAAAABvj////////////xDgAAAMAD////AD/gAAAAAYA4f///////////4A+AAADAAH///8Af+AAAAADAXH///////////+AHgAAAgAA////8D/4AAAAAYCw////////////gA8AAAAAAD////8//gAAAANgQf///////////8AHAAAAAAAP////n/+AAAADmH/////////////0A4AAAAAAB////8//wAAAAd7//////////////gEAAAAAAAH//////8AAAAAO//////////////0AgAAAAAAAv/////wIAAAAAP/////////////+gAAAAAAAAD/////4DgAAAAD//////////////0AAAAAAAAAP//+P/4GAAAAA//////////////+gAAAAAAAAB//////4AAAAAD///9+f////////kAAAAAAAAAP///p/8AAAAAAf5/wfj////////4gAAAAAAAAB///9v4AAAAAAD5v8B8f///////+GAAAAAAAAAP////+AAAAAAP4GfgHj///////+BgAAAAAAAAB/////gAAAAAB+AZ//+P///////gIAAAAAAAAAP////4AAAAAAPgRk//x///////cBAAAAAAAAAA////+AAAAAAB8AIn/+P//////BgIAAAAAAAAAH////wAAAAAAPBwEf/////////MHAAAAAAAAAAf///+AAAAAAAT+AQH////////gjwAAAAAAAAAB////gAAAAAAH/wAA////////8B4AAAAAAAAAAH///4AAAAAAB//ggP////////wIAAAAAAAAAAAf//+AAAAAAAf//P9/////////AAAAAAAAAAAAD//4wAAAAAAD/////+///////4AAAAAAAAAAAAL/gCAAAAAAA////9/z//////+AAAAAAAAAAAAAv8AQAAAAAAP////3/D//////wAAAAAAAAAAAAE/gAAAAAAAB////+f8nf////8AAAAAAAAAAAAAT4AAAAAAAAf////5/+B/////IAAAAAAAAAAAAAPADgAAAAAH/////P/4H/9//AAAAAAAAAAAAAAB8MDAAAAAA/////9/+AP+H+AAAAAAAAAAAAAAAPjgHAAAAAH/////n/wB/gf2AAAAAAAAAAAAAAAf8AAAAAAA/////+f4AP4D+AIAAAAAAAAAAAAAAfAAAAAAAH/////z+AB8AH4BAAAAAAAAAAAAAAAfAAAAAAA//////fAAHgA/gIAAAAAAAAAAAAAAAYAAAAAAH/////9AAA8AF8AgAAAAAAAAAAAAAABAwAAAAAf/////xAADAAnAGAAAAAAAAAAAAAAAMP+AAAAB//////4AAYAEQAgAAAAAAAAAAAAAAAf/4AAAAH//////AAAgAgADAAAAAAAAAAAAAAAAf/gAAAAf/////wAAAACAIQAAAAAAAAAAAAAAAD//wAAABwP///+AAAADYDgAAAAAAAAAAAAAAAAf/+AAAAAAf///gAAAANA4AAAAAAAAAAAAAAAAH//4AAAAAD///4AAAAAwfgAAAAAAAAAAAAAAAB///AAAAAAf//+AAAAADD7AAAAAAAAAAAAAAAAP//+AAAAAD///gAAAAAceQMAAAAAAAAAAAAAAB////AAAAAP//4AAAAABxyA/AAAAAAAAAAAAAAP///+AAAAA//+AAAAAAGAQB+AAAAAAAAAAAAAB////8AAAAH//wAAAAAAMAAD8AAAAAAAAAAAAAH////gAAAA//+AAAAAAA8AAfgAAAAAAAAAAAAA////4AAAAD//wAAAAAAAAQAGAAAAAAAAAAAAAD///+AAAAAf//AAAAAAAAAAAAAAAAAAAAAAAAAf///wAAAAD//4AAAAAAAAB4gAAAAAAAAAAAAAB///8AAAAA///DAAAAAAAAOEAAAAAAAAAAAAAAH///gAAAAH//4YAAAAAAAf8wAAAAAAAAAAAAAAP//8AAAAA//8OAAAAAAAH/3AAAAAAAAAAAAAAA///gAAAAH//BwAAAAAAA//4AAAAAAAAAAAAAAH//8AAAAAf/4OAAAAAAAf//gAAAAAAAAAAAAAB///AAAAAD//BwAAAAAAf//+AAAAAAAAAAAAAAP//AAAAAAP/4MAAAAAAD///4AAAAAAAAAAAAAB//wAAAAAB/+BgAAAAAAf///gAAAAAAAAAAAAAP/8AAAAAAP/gAAAAAAAD///8AAAAAAAAAAAAAB//gAAAAAB/8AAAAAAAAf///gAAAAAAAAAAAAAP/8AAAAAAH/AAAAAAAAD///8AAAAAAAAAAAAAB//AAAAAAAfwAAAAAAAAf///gAAAAAAAAAAAAAP/wAAAAAAD8AAAAAAAAB+D/8AAAAAAAAAAAAAB/8AAAAAAAfAAAAAAAAAPAP/AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAAAAAAAf4AAAAAAAAAAAAAD/wAAAAAAAAAAAAAAAAAAAB+AAIAAAAAAAAAAAf+AAAAAAAAAAAAAAAAAAAAHgAAwAAAAAAAAAAD+AAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAfgAAAAAAAAAAAAAAAAAAAAAAACgAAAAAAAAAAH4AAAAAAAAAAAAAAAAAAAAAMAAQAAAAAAAAAAA/AAAAAAAAAAAAAAAAAAAAAAgAEAAAAAAAAAAAH4AAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAA+AAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    inset: { lon: [-11.0, 32.0], lat: [34.5, 61.5], cols: 104, rows: 98, ar: 1.0657, box: [2.6, 52.5, 24], mask: 'AAAAAAH////wA////wAAAAAB////8AP///8AAAAAAf////AB////AAAAAAH////4Af///wAAAAAB/////AD+B/8AAAAAAf////4AAAAfAAAAAAH/9///AAAA/wAAAAAB/8f//gAAP/8AAAAAAP+H//wAH///AAAAAAD/A//8AA///wAAAAAA/gP/+AAP//8AA/AAABwB//AAD///AAP4AAAAAf/gAAf//wAH/AAAAAD/wAAH//8AB/wAAAAw/8AAB///AA/8AAAAcP/AAAf//wAP/AAAAfD/wAP///8AD/gAAAPwf8AD////AA/4AAAB8H+AA////wAP/AAAAfB/gAP///8AB/wAAAHz/gAD////AAf+AAAB/7wAB////wAD/gAAAf+AAAf///8D4/8AAAHwAAA/////B/H/AAAB8AAB/////w/4P4AAAfAAH/////8f+D/AAAH8Af//////P/AfwAAD/////////z/wH+AAD/////////8/8D/gAf//////////P/D/+AP//////////x/w//wD//////////8f8P/+A///////////D/D//gf//////////x/B//wP//////////8PAf/8H///////////AAAf/D///////////wAA//x///////////8AAf/z////////////AAPwA////////////wAHAAf///////////8AAAAP////////////AAAAH////////////wAAAD////////////8AAAB/////////////AAAA/////////////wAAAf////////////8AAP//////////////AAB//////////////wAAP/////////////8AAB//////////////AAAH/////////////wAAB/////////////8AAAP/////////////AAAB/////////////wAAAf////////////EAAAD////////////wAAAA/////+//////4AAAAP////+H/////8AAAAH/////g//////AAAAB/////wH/////gAAAAf////8B/////4AAAAH///5/gP////8AAAAB///8H8D/////AAAAAf//+A/gf////gAAAAH///AP8D////4AAAf//+BgD/Af///8AAf////AAAf4B////AAH////wACH+AP///wAB////8ABg/4A///8AAf////AAYH/AH//+AAP////wAGA/8A///wAD////wABAH/AP//+AA////4AAAA/4D///4MP///4AAOAD/A/////D///8AABwAf4P/A//w////AAAcAD/D/AH/8P///gAAHAAP4fwB//D///4AABwAB8D+A//w///8AAAcAAeAfgP/8P///AAAHAAHAD4D//D///4AABAABgA/A//w///+AAAAAAYAPwP/8P///AAAAAAEAD8B//D///gAAAAABAA/gf/w///4AAAAA/AAHgH/8H//8AAAAAfwABwA//B//+AAAAAB8AAcAP/wf//gAAAHAOAADAB/8B//wAAD/4AgAAQAP/AD4AA///+AAAAAAAfwAMAA////AAAAAAAAcAAAAf///wAAAAAAAAAAgAf///+AAAAAAAAAAPgP////gAAAAOAAAAD/v////4AAAAB4AAAB//////+AAAAAAAAAAf//////AAAAAAAAA=' } };
  /* every stop and every visited country, as [longitude, latitude] (the pins: dog Scotland, bk the Balkans, ch Switzerland, dk Denmark, id Bali, nz New Zealand) */
  var GEO = { 'England': [-1.5, 52.6], 'Wales': [-3.7, 52.3], 'Northern Ireland': [-6.7, 54.6], 'Ireland': [-8.0, 53.2], 'France': [2.4, 46.6], 'Belgium': [4.6, 50.6], 'Netherlands': [5.5, 52.2], 'Germany': [10.4, 51.1], 'Austria': [14.5, 47.6], 'Italy': [12.5, 42.8], 'Spain': [-3.7, 40.3], 'Portugal': [-8.2, 39.6], 'Sweden': [16.5, 61.5], 'Poland': [19.4, 52.1], 'Czechia': [15.5, 49.8], 'Slovakia': [19.5, 48.7], 'Hungary': [19.4, 47.2], 'Slovenia': [14.8, 46.1], 'Bulgaria': [25.3, 42.7], 'Greece': [22.3, 39.4], 'Turkey': [33.5, 39.0], 'Morocco': [-6.5, 32.0], 'Tunisia': [9.5, 34.0], 'Sri Lanka': [80.7, 7.8], 'Nepal': [84.0, 28.3], 'Vietnam': [106.3, 16.0], 'Laos': [102.5, 19.5], 'Thailand': [101.0, 15.0], 'Taiwan': [121.0, 23.7], 'Japan': [138.5, 36.5], 'Australia': [145.0, -27.0], 'Canada': [-123.1, 49.3], 'Mexico': [-102.0, 23.5], 'Peru': [-75.0, -9.5], 'Bolivia': [-64.5, -16.5], 'dog': [-4.2, 57.0], 'bk': [19.5, 43.5], 'ch': [8.2, 46.8], 'dk': [9.5, 56.0], 'id': [115.2, -8.4], 'nz': [172.5, -41.5] };
  function neoMain(lon, lat) { var my = function (a) { return 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * a * Math.PI / 180)); }, yt = my(NEO_MAP.top), h = 2 * Math.PI / NEO_MAP.ar;
    return [+((lon + 180) / 360 * 100).toFixed(2), +((yt - my(lat)) / h * 100).toFixed(2)]; }
  function neoInset(lon, lat) { var I = NEO_MAP.inset, b = I.box, ih = b[2] * NEO_MAP.ar / I.ar;   /* the close-up's box in % of the map: left, top, width (its height follows its shape) */
    return [+(b[0] + (lon - I.lon[0]) / (I.lon[1] - I.lon[0]) * b[2]).toFixed(2), +(b[1] + (I.lat[1] - lat) / (I.lat[1] - I.lat[0]) * ih).toFixed(2)]; }
  if (ATLAS2_NEO) (function () { var inEU = function (k) { return ATLAS2_DOTS_MAIN.hasOwnProperty(k) || /^(dog|bk|ch|dk)$/.test(k); }, g = function (k) { return GEO[k]; };
    Object.keys(ATLAS2_PINS).forEach(function (k) { if (GEO[k]) ATLAS2_PINS[k] = inEU(k) ? neoInset.apply(null, g(k)) : neoMain.apply(null, g(k)); });
    Object.keys(ATLAS2_DOTS).forEach(function (k) { if (GEO[k]) ATLAS2_DOTS[k] = inEU(k) ? neoInset.apply(null, g(k)) : neoMain.apply(null, g(k)); });
    Object.keys(ATLAS2_DOTS_MAIN).forEach(function (k) { if (GEO[k]) ATLAS2_DOTS_MAIN[k] = neoMain.apply(null, g(k)); });
    Object.keys(ATLAS2_VIA).forEach(function (k) { if (GEO[k]) ATLAS2_VIA[k] = neoMain.apply(null, g(k)); }); })();
  /* THE OLD MAP, READY FOR JOE'S NEW BLAEU-STYLE ART: when it lands (a Mercator-style rectangle at 1630 x 902), set ATLAS_PROJ.on = true and
     retune lat0 / lat1 (and lon0 / lon1) until the pins sit on their places; each stop is placed from its real longitude / latitude. Off,
     the painted map keeps its hand-placed percentages (ATLAS_PINS above). */
  var ATLAS_PROJ = { on: false, kind: 'mercator', lon0: -180, lon1: 180, lat0: 82, lat1: -58,
    geo: { home: [-0.72, 51.52], eu: [15.5, 49.8], pe: [-68.1, -16.5], as: [105.8, 21.0], au: [151.2, -33.9], mx: [-99.1, 19.4], ca: [-123.1, 49.3] } };
  if (ATLAS_PROJ.on) (function () { var P = ATLAS_PROJ, merc = function (a) { return Math.log(Math.tan(Math.PI / 4 + a * Math.PI / 360)); }, y0 = merc(P.lat0), y1 = merc(P.lat1);
    Object.keys(P.geo).forEach(function (k) { var q = P.geo[k]; ATLAS_PINS[k] = [+((q[0] - P.lon0) / (P.lon1 - P.lon0) * 100).toFixed(2), +((P.kind === 'mercator' ? (y0 - merc(q[1])) / (y0 - y1) : (P.lat0 - q[1]) / (P.lat0 - P.lat1)) * 100).toFixed(2)]; }); })();
  /* the learning slide (v2): the sports still swaps on a press; set a clip base name (keyed webm/mov, jjClipSrc) and it loops instead */
  var SPORT_CLIPS = { tennis: '', badminton: '' };
  var INTERESTS = [['int-space.webp', 'Space'], ['int-history.webp', 'History'], ['int-geography.webp', 'Geography'], ['int-technology.webp', 'Technology'], ['int-anthropology.webp', 'Anthropology']];
  /* flip to true to put the job rail back on the ruler (also widens the year spacing to suit) */
  var SHOW_JOBS = false;
  /* the star layers drifting at their own speeds on scroll. Each layer holds dozens of individually
     composited (animated) stars, so translating the parent forces them all to re-composite every
     frame — flip to false to leave the field still and let it scroll with the story. */
  var SKY_PARALLAX = true;   /* the stars drift at their own speed behind the words (Joe, 2026-09-18) */
  /* ---- every job, pinned to the ruler: the year label sits directly ABOVE its job ----
     `logo` is a filename in the sprite folder (drop the real logos in and they appear); until then
     each one falls back to a monogram tile built from the company's initials. */
  var JOBS = [
    { y: 2008, co: 'Maidenhead Advertiser', loc: 'Maidenhead, UK', role: 'Paper boy',          logo: 'job-advertiser.png' },
    { y: 2009, co: 'Cliveden House',        loc: 'Taplow, UK',     role: 'KP',                 logo: 'job-cliveden.png' },
    { y: 2010, co: 'Jenners Cafe',          loc: 'Maidenhead, UK', role: 'Cook/Mini-golf God', logo: 'job-jenners.png' },
    { y: 2014, co: 'Lidl',                  loc: 'Maidenhead, UK', role: 'Bakery boy',         logo: 'job-lidl.png' },
    { y: 2015, co: 'Hanoi Rocks Hostel',    loc: 'Hanoi, Vietnam', role: 'Western Manager',    logo: 'job-hanoi.png' },
    { y: 2016, co: 'GigPower',              loc: 'Melbourne, Aus', role: 'Sound & Stage Crew', logo: 'job-gigpower.png' },
    { y: 2017, co: 'DingoBlue',             loc: 'Bundaberg, Aus', role: 'Tomato Picker',      logo: 'job-dingoblue.png' },
    { y: 2018, co: 'Skyrock Projects',      loc: 'Taipei, Taiwan', role: 'Web Dev & Design',   logo: 'job-skyrock.webp' },
    { y: 2020, co: 'Mnemoscene (Contract)', loc: 'Brighton, UK',   role: 'UX Research & Design', logo: 'job-mnemoscene.png' },
    { y: 2021, co: 'Foolproof Agency',      loc: 'London, UK',     role: 'Visual Designer',    logo: 'job-foolproof.png' },
    { y: 2022, co: 'Lab Agency (Contract)', loc: 'Remote',         role: 'Senior UI/UX Design', logo: 'job-lab.png' },
    { y: 2023, co: 'UIC Digital (Contract)', loc: 'London, UK',    role: 'Senior UI Design',   logo: 'job-uic.png' },
    { y: 2024, co: 'Super Reel Travel',     loc: 'Remote',         role: 'Head of Design',     logo: 'job-superreel.png' }
  ];
  var STEPS = [
    { era: 0, cap: 'And the lord said “Let there be Joe!”', sub: 'Best experienced with sound on…' },
    { era: 0, cap: 'I started playing games at a very young age', sub: 'Here are the ones that hit me in the nostalgia!', games: true },   /* games: PRESS START, the covers deal in and float, a CRT carries the IGN card (v2) */   /* one games slide now (the raids / guilds slide is folded in), laid out round the text like the films */
    /* (2026-09-17) the first-animation slide and the school-films slide are retired: the four videos move to their own
       Videos tab so they cost My Story nothing and never break the flow. Their machinery (tall / grow / duo) stays in the code, unused. */
    { era: 1, cap: 'I\u2019d had a very stereotypical small town upbringing',
      sub: 'Played sports, games, hung out with my friends, etc...',
      tall: 1.7, feat: true },   /* feat: a gentler cousin of the old two-video slide — past ~1/4 of its scroll the three photo sets ride down with you, grow and loosely line up (enticing a click) over a soft dim, while the game covers and the drawing slip up and away; all gone before the films */
    { era: 1, cap: 'I started to realise that films were my passion', sub: 'I’ve rated over 1700 titles on iMDB, click on the titles to find out more…', cinema: true },   /* cinema: the lit poster wall + marquee board + curtains (v2) */
    { era: 2, cap: 'I travelled the world & lived/volunteered in a few places along the way', atlas: true },   /* atlas: the parchment map + docked passport (v2; was a tall 'row' ride of the travel sets) */   /* the photo sets ride down and loosely line up, gentler than the small-town slide */
    { era: 2, cap: 'On the way I met people building websites and travelling.\nMuch like Plato in his cave, it made me think\u2026', sub: 'I wonder if I could do that\u2026', tall: 1.6, feat: 'think', cave: true },   /* PLATO'S CAVE (Joe, 2026-09-25): shadow puppets on the wall, the cursor is the campfire (see CAVE); then the thinker grows into the middle */   /* STAND-IN: the wizard grows into the middle, thinking, and goes before the next slide — until Joe's art of him watching someone build a website arrives (that will grow to full width here) */
    { era: 3, cap: 'So I went off to Brighton to study BSc Digital Media where I learned lots of new skills',
      sub: 'Hint: You can interact with the skills tags\u2026Just sayin\u2019!', tall: 1.35, feat: 'tabs', rewatch: true },   /* tabs: the two stone tablets ride to the middle and grow; the room stays dark until both are broken */
    { era: 3, cap: 'I spent a year in Taipei working as a Web Developer/Designer for a start-up',   /* Joe's words and capitals (2026-09-30); was 'A year at Skyrock in Taipei as a Web Developer & Designer, then remote through my final year of uni' */
      sub: 'My boss used to describe me as the \u2018Digital Swiss Army Knife\u2019 which I always thought was cool\u2026', cut: 'taiwan',   /* cut: the letterbox cut-scene plays the first time this slide arrives */
      /* (no ride any more: the awards two slides on are the grow-and-confetti moment, and this slide already has the Taiwan film. Joe, 2026-09-24) */   /* was: everything else slips up and away; the sealed letter (where the trophy used to be) stays, comes to the middle, grows, opens itself if nobody has, and closes again as it shrinks */
      scroll: { x: 22, y: 27, w: 11, text: 'Dear Mr Jackson,<br>We\u2019re very happy to let you know you have received our one yearly scholarship for the InternChina - Generation UK programme! Time to pack your bags and brush up on your Mandarin!<br><b>Sincerely, Pagoda Projects</b>', logo: 'pagoda-logo.webp' } },
    { era: 4, cap: 'Then my real design life began...', figma: true,   /* the slide is a Figma canvas: the caption types as a text layer, frames draw in, colleagues' cursors roam (Joe, 2026-09-24) */
      sub: 'I worked with some big design agencies for some big brands and realised how much I love all types of design' },
    { era: 4, cabinet: { cx: 50, y: 47, w: 40, h: 24 }, dream: true, cap: 'Managed to win some awards along the way',   /* no ride: a glass trophy cabinet that opens with a press (Joe, 2026-09-24) */
      hot: 'awards',         /* gold in the headline, like the design — and it throws a party */
      sub: 'The 2021 award I wasn\u2019t that heavily involved as I came late to the project in but I lead a lot of the UI for the 2024 award!' },
    { era: 5, cap: 'I’m now leading the design for Super Reel Travel', sub: 'A video & AI travel app but the story of how that happened is a whole tale in itself! But that\u2019s a secret for now!', mystery: true,   /* mystery: once it has been read the line scrambles into alien glyphs, drifts up and is gone — then a startled alien pops up where it was */
      srp: { x: 81.5, y: 53, w: 10.5 } },          /* a drawn phone running a reels-style feed */
    { era: 5, cap: 'In my spare time I\u2019m still travelling when I can\u2026', atlas: 2 },   /* no sub: the passport's 'Visas continued' page shows the count (Joe, 2026-09-25) */   /* split so it clears the map's torn top edge */   /* travel part two (v2): the modern map + the same passport, flicked on to 'Visas continued' */
    { era: 5, cap: 'I\u2019m also still learning (clearly!) by creating projects like this, keeping active and obviously updating my iMDb\u2026',
      sub: 'I couldn\u2019t decide between a history or space theme\u2026but luckily for you anthropology is also a big passion!', learning: true },   /* learning (v2): skills, Sunday Vibes, sports, interests, one per corner */   /* the flying guy now lives only in his green-screen card below (Joe: the keyed one cluttered the slide) */
    /* the voice behind Storytime: a blurred card you press to reveal him (the clip plays, the 'vid-grandad' achievement lands and the clip
       joins Store > Videos for later). A normal-width slide now, so its caption lines up with the others (Joe, 2026-09-18). The wizard
       from the Big Bang loops bottom-left: his character, keeping the old man company. */
    { era: 5, cap: 'I\u2019m sure you want to put a face to the name - let\u2019s see if you can recognise this crazy old man\u2019s voice....', sub: 'Press it for sound',
      reveal: { src: 'vid-grandad.mp4', poster: 'vid-grandad.jpg', cap: 'The voice of Storytime' }, wiz: true }
  ];
  /* SHOW_JOBS spreads the ruler to the design's density (116px/year) so a whole job card fits between
     one year label and the next; with the rail off it returns to the original compact 60px/year. */
  var PX_PER_YEAR = SHOW_JOBS ? 116 : 60, MARKER_VH = 0.42;
  /* the Big Bang finale — where the story hands over to the rest of the site */
  /* the awards dream, part two: Joe's real room. Positions are % of the room art (dr-room.webp).
     bed: where Joe sleeps (sleep/wake are the clip base names once the art lands; empty = placeholder Zzz + shake).
     hots: the real things in the room — tag on hover, a reaction on press. Dave lives in the Villa poster (Joe, 2026-09-24). */
  var DREAM_ROOM = {
    bed: { x: 37, y: 34, w: 22, sleep: 'dr-joe-snore', wake: 'dr-joe-wake' },   /* the Seedance clips (keyed, cropped to the bed; placed by .dsleep/.dwakev below) */   /* the press area over Joe's head; the art itself is full-scene layers (dr-joe-asleep / dr-joe-awake) */
    hots: [
      { key: 'dave', tag: 'Dave', ask: 'Poke Dave?', x: 9.01, y: 46.39, w: 11.04, h: 37.59, img: 'dr-dave.webp', clip: 'dr-dave-stamp', fx: 'angry', say: ['Oi!', 'Do you mind?!', 'I\u2019m watching the match!'] }   /* Dave, in his Villa kit with the skull staff */
    ]
  };
  /* THE TROPHY CABINET (awards slide): three real shelves. Top = the two BIMAs (LOGOS[9] entries with cab: [left, top, width] in
     cabinet units). Middle and bottom are here: t = the hover label (sentence case), x = the award's centre in % of the cabinet width.
     boots: one golden boot per season on the bottom shelf (hover label: boot + ' ' + season). Five boot images (aw-boot-1..5.webp) cycle; a
     sixth and on reuse them mirrored. bima: the top shelf's statue art (used once the file exists; until then the BIMA logo art stays). */
  var CABINET = {
    mid: [
      { src: 'aw-scholarship.webp', t: 'Generation UK scholarship, Taiwan', x: 16 },
      { src: 'aw-pots-1.webp', t: 'Players\u2019 Player 07/08', x: 38.5 },   /* the award's own title, so its capitals stay */
      { src: 'aw-pots-2.webp', t: 'Players\u2019 Player 11/12', x: 60 },
      { src: 'aw-bestson.webp', t: 'Best son (voted by my mum)', x: 83 }
    ],
    boots: ['05/06', '07/08', '09/10', '10/11', '11/12', '12/13'], boot: 'Golden boot', bootArt: 5,
    bima: { 'aw-bima1.webp': 'aw-bima-statue-2021.webp', 'aw-bima2.webp': 'aw-bima-statue-2024.webp' }
  };
  /* PLATO'S CAVE (the slide with cave: true). The puppets are black silhouettes on transparent (github-upload/cave-puppet-N.webp), cast on the
     cave wall by a campfire the visitor carries as their cursor. x / y: the puppet's feet, in % of the wall; h: its height in % of the wall.
     think: Joe's own art of Plato thinking (a still). It takes the wizard's place (and his grow) as soon as the file exists; until then the wizard stays.
     clip: his looping keyed clip (clip + .webm / .mov, poster clip + '-poster.webp'), played muted over the still while the slide is near. */
  /* CAVE_CLIP: base name (jjClipSrc: + .webm / .mov) of a looping black-alpha shadow clip. Set it and the clip plays (muted, looped) as the
     shadow layer, still leaning / growing / softening with the fire, in place of the puppets below. Empty = the puppets. */
  var CAVE_CLIP = '';
  /* CAVE_ART: Joe's shadow row (one wide, soft, black-on-transparent layer: two dancers, the laptop, a plane, a surfer, a hiker). It is cast as ONE
     layer on the wall; the clip above, when set, takes its place with the same framing. ar = width / height; pts = each figure's middle in
     fractions of the art (the fire's faint rays end there); home = where the fire sits along the row (the gap between the laptop and the surfer).
     If the art fails to load, the drawn puppets below stand in. */
  var CAVE_ART = { src: 'cave-shadows.webp', ar: 1600 / 675, pts: [[.11, .6], [.24, .6], [.42, .65], [.545, .12], [.67, .6], [.9, .6]], home: .555 };
  var CAVE = {
    think: 'plato-think.webp', clip: 'plato-think',
    puppets: [
      { src: 'cave-puppet-1.webp', x: 8, y: 97, h: 64 },     /* the backpacker */
      { src: 'cave-puppet-2.webp', x: 20, y: 97, h: 44 },    /* on the laptop */
      { src: 'cave-puppet-3.webp', x: 32.5, y: 96, h: 60 },  /* reading a map */
      { src: 'cave-puppet-4.webp', x: 43, y: 97, h: 64 },    /* the photographer */
      { src: 'cave-puppet-6.webp', x: 56, y: 42, h: 26 },    /* a plane overhead */
      { src: 'cave-puppet-5.webp', x: 67, y: 97, h: 50 },    /* round the hostel table */
      { src: 'cave-puppet-7.webp', x: 80, y: 96, h: 60 },    /* the surfer */
      { src: 'cave-puppet-8.webp', x: 92, y: 97, h: 70 }     /* Plato, pointing up */
    ]
  };
  /* THE DRAG HINT (Joe, 2026-09-28): one gentle demo for anything you can pick up and move (the cave's fire, the Figma post-it).
     The label shows first; then a hand comes in, presses on the thing, carries a soft ghost of it along a dotted path, lets go and
     fades, and does it again every few seconds. The thing itself never moves. The caller places the returned element at the grab
     point (it is 0 x 0) and adds / removes .on; while .on is off it fades out (instantly if the caller adds .now, e.g. on press).
     o: dx / dy (px, where the hand carries it), gw / gh / gx / gy (the ghost's size and its offset from the grab point, px),
     ghost (its CSS background), delay (s, before the first run), dur (s, one run including the rest). */
  function jjDragHint(o) {
    if (!document.getElementById('jjms-dh-css')) { var cs = document.createElement('style'); cs.id = 'jjms-dh-css';
      cs.textContent = '.jjdh{position:absolute;left:0;top:0;width:0;height:0;z-index:9;pointer-events:none;opacity:0;transition:opacity .45s ease;}.jjdh.on{opacity:1;}.jjdh.now{transition:none;opacity:0;}' +
        '.jjdh > i{position:absolute;left:0;top:0;display:block;pointer-events:none;opacity:0;}' +
        '.jjdh .dhg{width:var(--gw);height:var(--gh);margin:var(--gy) 0 0 var(--gx);border-radius:28%;background:var(--gbg);filter:blur(var(--gb,5px));}' +
        '.jjdh .dht{width:var(--tl);height:6px;margin-top:-3px;transform-origin:0 50%;rotate:var(--ta);background:radial-gradient(circle,rgba(255,255,255,.85) 0 1.3px,transparent 1.9px) 0 50%/9px 6px repeat-x;-webkit-mask:linear-gradient(90deg,transparent,#000 14%,#000 80%,transparent);mask:linear-gradient(90deg,transparent,#000 14%,#000 80%,transparent);scale:0 1;}' +
        '.jjdh .dhr{width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,0) 50%,rgba(255,255,255,.7) 72%,rgba(255,255,255,0));}' +
        '.jjdh .dhh{width:30px;height:30px;margin:-2px 0 0 -13.6px;transform-origin:13.6px 2px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.55));}.jjdh .dhh svg{display:block;width:100%;height:100%;overflow:visible;}' +
        '.jjdh.on .dhh{animation:jjDhH var(--dur) var(--dd) infinite;}.jjdh.on .dhg{animation:jjDhG var(--dur) var(--dd) infinite;}.jjdh.on .dht{animation:jjDhT var(--dur) var(--dd) infinite;}.jjdh.on .dhr{animation:jjDhR var(--dur) var(--dd) infinite;}' +
        '@keyframes jjDhH{0%{opacity:0;translate:26px 30px;scale:1;animation-timing-function:cubic-bezier(.3,.6,.35,1);}9%{opacity:1;}20%{translate:0 0;scale:1;}25%{translate:0 0;scale:.84;animation-timing-function:cubic-bezier(.55,0,.35,1);}58%{translate:var(--dx) var(--dy);scale:.84;}64%{translate:var(--dx) var(--dy);scale:1;}76%{opacity:1;}88%,100%{opacity:0;translate:var(--dx) var(--dy);scale:1;}}' +
        '@keyframes jjDhG{0%,23%{opacity:0;translate:0 0;scale:.9;}28%{opacity:var(--go,.6);scale:1;animation-timing-function:cubic-bezier(.55,0,.35,1);}58%{opacity:var(--go,.6);translate:var(--dx) var(--dy);scale:1;}70%,100%{opacity:0;translate:var(--dx) var(--dy);scale:.96;}}' +
        '@keyframes jjDhT{0%,25%{opacity:0;scale:0 1;}30%{opacity:.75;animation-timing-function:cubic-bezier(.55,0,.35,1);}58%{opacity:.75;scale:1 1;}78%,100%{opacity:0;scale:1 1;}}' +
        '@keyframes jjDhR{0%,23%{opacity:0;scale:.4;}26%{opacity:.9;scale:.7;}40%,100%{opacity:0;scale:1.5;}}' +
        '@media (prefers-reduced-motion:reduce){.jjdh.on > i{animation:none!important;}.jjdh.on .dhh{opacity:1;}}';
      document.head.appendChild(cs); }
    var el = document.createElement('i'); el.className = 'jjdh'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<i class="dhg"></i><i class="dht"></i><i class="dhr"></i><i class="dhh"><svg viewBox="0 0 24 24"><path fill="#fff" stroke="rgba(0,0,0,.55)" stroke-width="1.1" stroke-linejoin="round" d="M9.2 14.5V3.4a1.7 1.7 0 0 1 3.4 0v6.8a1.6 1.6 0 0 1 3.2 0V11a1.6 1.6 0 0 1 3.2 0v5.5c0 3.4-2.5 6-5.8 6H12c-1.8 0-3.2-.8-4.2-2.2l-3.5-4.9a1.55 1.55 0 0 1 2.4-1.9L9.2 16z"/><path fill="none" stroke="rgba(0,0,0,.45)" stroke-width=".9" stroke-linecap="round" d="M12.6 10.2v3.4M15.8 11v3"/></svg></i>';
    el.set = function (q) { for (var k in q) o[k] = q[k]; var dx = o.dx || 0, dy = o.dy || 0, s = el.style;
      s.setProperty('--dx', dx.toFixed(1) + 'px'); s.setProperty('--dy', dy.toFixed(1) + 'px'); s.setProperty('--tl', Math.hypot(dx, dy).toFixed(1) + 'px'); s.setProperty('--ta', (Math.atan2(dy, dx) * 180 / Math.PI).toFixed(1) + 'deg');
      s.setProperty('--gw', (o.gw || 40) + 'px'); s.setProperty('--gh', (o.gh || 40) + 'px'); s.setProperty('--gx', (o.gx == null ? -(o.gw || 40) / 2 : o.gx) + 'px'); s.setProperty('--gy', (o.gy == null ? -(o.gh || 40) / 2 : o.gy) + 'px');
      s.setProperty('--gbg', o.ghost || 'radial-gradient(closest-side,rgba(255,255,255,.5),rgba(255,255,255,0))'); if (o.blur != null) s.setProperty('--gb', o.blur + 'px'); if (o.go != null) s.setProperty('--go', o.go);
      s.setProperty('--dur', (o.dur || 4.6) + 's'); s.setProperty('--dd', (o.delay || 0) + 's'); return el; };
    return el.set({});
  }
  /* the audience, drawn: backs of heads (a few hair styles) that bob, throw their arms up when the crowd cheers, behind a row of seat backs */
  function dreamCrowd() { var W = 1058, H = 100, g = '', r0 = 7;
    function rnd() { r0 = (r0 * 9301 + 49297) % 233280; return r0 / 233280; }
    for (var i = 0; i < 19; i++) { var cx = 24 + i * 56 + (rnd() - .5) * 18, r = 13 + rnd() * 5, cy = 50 + rnd() * 10, sw = r * 2.5, v = i % 4, hair = '';
      if (v === 0) for (var q = 0; q < 6; q++) { var a = Math.PI * (1.05 + q * .18); hair += '<circle cx="' + (cx + Math.cos(a) * r * .9).toFixed(1) + '" cy="' + (cy + Math.sin(a) * r * .9).toFixed(1) + '" r="' + (r * .42).toFixed(1) + '"/>'; }   /* curly */
      else if (v === 1) hair = '<circle cx="' + cx.toFixed(1) + '" cy="' + (cy - r * 1.05).toFixed(1) + '" r="' + (r * .45).toFixed(1) + '"/>';   /* bun */
      else if (v === 2) hair = '<rect x="' + (cx - r * 1.05).toFixed(1) + '" y="' + cy.toFixed(1) + '" width="' + (r * 2.1).toFixed(1) + '" height="' + (r * 1.5).toFixed(1) + '" rx="' + (r * .6).toFixed(1) + '"/>';   /* long hair */
      var armL = i % 3 === 0, armR = i % 3 === 1, arm = '';
      if (armL || armR) { var sx = cx + (armL ? -sw * .38 : sw * .38), hx = sx + (armL ? -r * .6 : r * .6); arm = '<path class="arm" d="M' + sx.toFixed(1) + ' ' + (cy + r * 1.6).toFixed(1) + ' Q' + (sx + (armL ? -2 : 2)).toFixed(1) + ' ' + (cy - r * .5).toFixed(1) + ' ' + hx.toFixed(1) + ' ' + (cy - r * 1.9).toFixed(1) + '" stroke="#070b18" stroke-width="' + (r * .55).toFixed(1) + '" stroke-linecap="round" fill="none"/><circle class="arm" cx="' + hx.toFixed(1) + '" cy="' + (cy - r * 2.05).toFixed(1) + '" r="' + (r * .42).toFixed(1) + '"/>'; }
      g += '<g class="hd" style="--d:' + (1.5 + rnd() * 1.2).toFixed(2) + 's;--cd:' + (.28 + rnd() * .16).toFixed(2) + 's;--dl:-' + (rnd() * 2).toFixed(2) + 's">' + arm + hair + '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + r.toFixed(1) + '"/><path d="M' + (cx - sw / 2).toFixed(1) + ' ' + (H + 6) + ' Q' + (cx - sw / 2).toFixed(1) + ' ' + (cy + r * 1.1).toFixed(1) + ' ' + cx.toFixed(1) + ' ' + (cy + r * 1.05).toFixed(1) + ' Q' + (cx + sw / 2).toFixed(1) + ' ' + (cy + r * 1.1).toFixed(1) + ' ' + (cx + sw / 2).toFixed(1) + ' ' + (H + 6) + 'Z"/></g>'; }
    var ch = ''; for (var c = 0; c < 10; c++) ch += '<rect x="' + (c * 108 - 16) + '" y="80" width="98" height="30" rx="11" fill="#12142e" stroke="#5b3f9a" stroke-width="2.5"/>';
    return '<svg class="dcrowd" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><g fill="#070b18" style="filter:drop-shadow(0 -1.5px 0 rgba(150,130,255,.45))">' + g + '</g>' + ch + '</svg>'; }
  /* the cabinet's top: its design spot, but never so low that its base runs under the NEXT pill on a short screen */
  function cabTop(c) { return 'min(' + c.y + '%, calc(100% - ' + c.h + ' * var(--cu) - 180px))'; }
  /* one award on a cabinet shelf: centred at x% of the cabinet, standing on a shelf (bottom = % from the cabinet's foot), h = % of its height */
  function cabAw(src, t, x, bottom, h, rot, flip) { var fl = flip ? ' style="transform:scaleX(-1)"' : ''; return '<button type="button" class="cabaw" data-cursor="hover" aria-label="' + esc(t) + '" style="left:' + x.toFixed(2) + '%;bottom:' + bottom + '%;height:' + h + '%' + (rot ? ';rotate:' + rot + 'deg' : '') + '">' +
    '<img src="' + SB + src + '" alt="" decoding="async"' + fl + '><i class="agshine" style="--m:url(' + SB + src + ')' + (flip ? ';transform:scaleX(-1)' : '') + '"></i><span class="cabl">' + esc(t) + '</span></button>'; }
  var FINALE_CAP = 'What\u2019s next in the adventure\u2026 you decide';
  /* The universe to explore: five doors in the menu's own art, cut on the same diagonal, all touching (Joe, 2026-09-18). Each carries a
     line and a call to action on hover; Part Two stays locked (and says why) until the History Exam has been passed. */
  var LINKS = [
    { key: 'work', label: 'Work', href: '/?choose=work', hue: '#FF00F5', img: 'menu-work.webp', sub: 'The projects, start to finish', cta: 'Explore the work' },
    { key: 'contact', label: 'Contact', href: '/contact', hue: '#7d5bff', img: 'menu-contact.webp', sub: 'Say hello, I don’t bite', cta: 'Get in touch' },
    { key: 'credits', label: 'Credits', href: '/contact?credits=1', hue: '#4aa8ff', img: 'menu-credits.webp', sub: 'Everyone and everything that helped', cta: 'Roll the credits' },
    { key: 'storytime', label: 'Storytime', href: '/storytime', hue: '#ffb347', img: 'menu-story.webp', sub: 'Missed something in Storytime? Or maybe you just loved it so much you want to see it again', cta: 'Reload the Adventure!' },
    { key: 'part2', label: 'Part Two', href: '/storytime?part=2', hue: '#c04dff', img: 'menu-part2.webp', sub: 'The tale continues through the portal', cta: 'Enter Part Two', lockSub: 'Locked. You need to take the History Exam first', lockCta: 'Take the History Exam' }
  ];
  /* Photo collages, keyed by step index. x/y/w are % of the viewport, lifted straight from the
     design frame (1627×1019 canvas); height follows each photo's own aspect ratio. Add a step's
     photos here as they're exported — every step can hold as many as it likes. */
  /* Scattered label chips — the same pill styling as the country tags, but each one placed on its
     own (x/y are % of the step) instead of flowing in a row. Step 9's skills come from the design
     frame; the icons are picked to read at chip size. */
  var TAGS = {
    /* the spare-time slide: what I am learning now, floating round the New skills cards like the skills on the Brighton slide */
    12: [
      { t: 'Learning new skills', i: '\ud83e\udde0', x: 61.5, y: 66.0, r: -1.6, skl: 'head' },
      { t: 'Procreate', i: '\u270f\ufe0f', x: 72.0, y: 67.0, r: -3.2, skl: 1 },
      { t: 'Character design', i: '\ud83d\udc7e', x: 64.0, y: 91.0, r: 2.4, skl: 1 },
      { t: 'VR', i: '\ud83e\udd7d', x: 90.5, y: 67.0, r: 3.1, skl: 1 },
      { t: 'Animation through AI', i: '\u2728', x: 79.0, y: 91.0, r: -2.2, skl: 1 }
    ],
    /* What the project was built with. The design frame keeps the whole left side for George and
       Greybeard and marks out a block on the right for these, so they climb the right-hand edge. */
    /* a country pill in the same style as the travel ones, tucked under the Skyrock logo */
    7: [
      { t: 'Taipei, Taiwan', i: '\ud83c\uddf9\ud83c\uddfc', x: 71.5, y: 81.5, r: 2.2, sm: true }
    ],
    /* Brighton: TWO tablets. Subjects on the left, Software on the right. Each tablet cracks on the first press and bursts on the
       second, throwing its pills out to these positions (see the tablet code in mount). `grp` puts a pill on a tablet. */
    6: [
      { t: 'Subjects', i: '\ud83d\udcda', x: 8.0, y: 12.0, r: -2.2, grp: 'subj', head: true },
      { t: 'Backend Development', i: '\u2699\ufe0f', x: 6.0, y: 22.0, r: -2.8, fx: 'binary', grp: 'subj' },
      { t: 'Human-Computer Interaction', i: '\ud83e\udde0', x: 4.0, y: 31.0, r: 2.1, fx: 'cursor', grp: 'subj' },
      { t: 'Animation', i: '\ud83c\udf9e\ufe0f', x: 9.0, y: 40.0, r: 3.4, fx: 'bounce', grp: 'subj' },
      { t: '3D Modelling', i: '\ud83e\uddca', x: 5.0, y: 62.0, r: -3.1, fx: 'spin', grp: 'subj' },
      { t: 'UI/UX Design', i: '\ud83c\udfa8', x: 9.0, y: 71.0, r: 1.6, fx: 'draw', grp: 'subj' },
      { t: 'Web Development', i: '\ud83c\udf10', x: 4.0, y: 80.0, r: -1.9, fx: 'type', grp: 'subj' },
      { t: 'Digital Marketing', i: '\ud83d\udcc8', x: 12.0, y: 89.0, r: 2.7, fx: 'chart', grp: 'subj' },
      { t: 'Software', i: '\ud83d\udcbb', x: 82.0, y: 12.0, r: 2.2, grp: 'soft', head: true },
      { t: 'Photoshop', i: '\ud83d\uddbc\ufe0f', x: 84.0, y: 22.0, r: -2.4, fx: 'paint', grp: 'soft' },
      { t: 'Figma', i: '\ud83c\udfa8', x: 88.0, y: 31.0, r: 1.9, fx: 'swirl', grp: 'soft' },
      { t: 'Framer X', i: '\ud83d\udd37', x: 83.0, y: 40.0, r: 3.2, fx: 'spin', grp: 'soft' },
      { t: 'Premiere Pro', i: '\ud83c\udfac', x: 86.0, y: 62.0, r: -1.7, fx: 'clip', grp: 'soft' },
      { t: 'After Effects', i: '\u2728', x: 82.0, y: 71.0, r: 2.6, fx: 'bounce', grp: 'soft' },
      { t: 'Android Studio', i: '\ud83e\udd16', x: 87.0, y: 80.0, r: -3.0, fx: 'build', grp: 'soft' },
      { t: 'JavaScript', i: '\u26a1', x: 83.0, y: 89.0, r: -2.1, fx: 'type', txt: 'console.log(\u2018\u26a1\u2019)', grp: 'soft' },
      { t: 'XML', i: '\ud83d\udcc4', x: 91.0, y: 89.0, r: 2.2, fx: 'type', txt: '<LinearLayout/>', grp: 'soft' }
    ]
  };
  var PHOTOS = {
    0: [
      { src: 'story-photo-01-cap.jpg', x: 9.6, y: 26.5, w: 24.0, rot: -6.5 },
      { src: 'story-photo-02-tiger.jpg', x: 33.5, y: 64.5, w: 24.0, rot: -4.8 },
      { src: 'story-photo-03-bench.jpg', x: 39.2, y: 18.0, w: 24.0, rot: 4.7 },
      { src: 'story-photo-04-archery.jpg', x: 70.5, y: 39, w: 19.5, rot: -6.9 },
      { src: 'story-photo-05.jpg', x: 16.25, y: 58.9, w: 13.02, rot: 6.44 },
      { src: 'story-photo-06.jpg', x: 67.4, y: 15, w: 23.05, rot: -3.62 }
    ],
    /* content collages pulled from the design frames (My Story-1/2/3/4.svg), placed at their
       design coordinates (% of each frame). Same .phw machinery = float + 50%→100% opacity + grow on
       hover. Films (step 5) additionally carry a small caption. */
    /* step 1 — the games, all on one slide, ringed round the caption like the film posters. Every one blows up like a film:
       `cap` is the headline, `stars` my IGN-style score out of 5 (PLACEHOLDER scores + captions until Joe sets them),
       `note` a line under it, `extra` more covers shown in the card (Fable I-III), `party` the confetti find.
       game-ph-*.jpg are PLACEHOLDER covers (Quake II, PES 5, Virtua Tennis, Mario Party 8, Fable II + III). */
    1: [
      { src: 'game1-00.jpg', x: 3.0,  y: 27.0, w: 10.0, rot: -6.0, game: 1, stars: 4.5, hoverCap: false, cap: 'Pokémon Red', note: 'Where the obsession started' },
      { src: 'game1-04.jpg', x: 17.0, y: 13.0, w: 8.0,  rot: 5.0,  game: 1, stars: 4,   hoverCap: false, cap: 'SimCity 2000', note: 'My first taste of designing systems (and deleting them with a tornado)' },
      { src: 'game1-05.jpg', x: 27.6, y: 11.5, w: 7.4,  rot: -4.0, game: 1, stars: 5,   hoverCap: false, cap: 'Super Mario 64', note: 'Still the best feeling jump in games' },
      { src: 'game-fifa10.jpg', x: 38.2, y: 12.0, w: 7.2, rot: -3.0, game: 1, stars: 4.5, hoverCap: false, cap: 'FIFA 10', note: 'Spent a lot of time on these games, this was the best (or 12)' },   /* moved from the small-town slide (Joe, 2026-09-24); PLACEHOLDER stars */
      { src: 'game-ph-quake2.jpg', x: 48.6, y: 13.0, w: 7.4, rot: 4.0, game: 1, stars: 4, hoverCap: false, cap: 'Quake II', note: 'Far too young for this one' },
      { src: 'game2-04.jpg', x: 59.2, y: 11.0, w: 8.4,  rot: 6.0,  game: 1, stars: 5,   hoverCap: false, cap: 'World of Warcraft', party: true, found: '★ You found my most played game ★', award: 'mostplayed', jig: 1,
        note: 'I spent many a year playing this with my Dad and Brother...not time wasted in my eyes! (kinda)' },
      { src: 'game2-03.jpg', x: 71.0, y: 13.5, w: 7.6,  rot: -7.0, game: 1, stars: 4.5, hoverCap: false, cap: 'Dark Age of Camelot', note: 'Leading raids at 7, building guilds at 8', jig: 1 },
      { src: 'game-ph-pes5.jpg', x: 82.2, y: 12.0, w: 7.6, rot: 6.0, game: 1, stars: 4.5, hoverCap: false, cap: 'Pro Evolution Soccer 5', note: 'Master League, every summer' },
      { src: 'game2-05.jpg', x: 88.8, y: 49.5, w: 8.0,  rot: 8.0,  game: 1, stars: 4.5, hoverCap: false, cap: 'The Sims 2', note: 'Mostly built houses. Rarely played the people', jig: 1 },
      { src: 'game-ph-virtuatennis.jpg', x: 4.0, y: 52.0, w: 8.0, rot: -5.0, game: 1, stars: 4, hoverCap: false, cap: 'Virtua Tennis', note: 'The arcade one. Unbeatable with a mate' },
      { src: 'game1-06.jpg', x: 13.6, y: 70.0, w: 7.4,  rot: -6.0, game: 1, stars: 4.5, hoverCap: false, cap: 'RollerCoaster Tycoon', note: 'UX lesson one: people will queue for anything if the path is clear' },
      { src: 'game2-06.jpg', x: 24.9, y: 71.0, w: 7.4,  rot: 5.0,  game: 1, stars: 4,   hoverCap: false, cap: 'Counter-Strike', note: 'LAN cafes and dust2' },
      { src: 'game-mw2.jpg', x: 36.2, y: 70.5, w: 7.4, rot: -4.0, game: 1, stars: 4.5, hoverCap: false, cap: 'Call of Duty: Modern Warfare 2', note: 'Spent even longer on this one, an embarrassing amount...' },   /* moved from the small-town slide (Joe, 2026-09-24); PLACEHOLDER stars */
      { src: 'game1-07.jpg', x: 47.8, y: 66.5, w: 7.4,  rot: -7.0, game: 1, stars: 4.5, hoverCap: false, cap: 'Mario Kart: Super Circuit', note: 'Blue shells taught me about fairness in design', jig: 1 },
      { src: 'game2-07.jpg', x: 59.0, y: 70.0, w: 7.4,  rot: 8.0,  game: 1, stars: 5,   hoverCap: false, cap: 'Fable, Fable II & Fable III', jig: 1,
        extra: 'game-ph-fable2.jpg|Fable II|game-ph-fable3.jpg|Fable III',
        note: 'The storybook worlds, the humour, the choices…these shaped how I design. And if the Storytime voiceover felt familiar, this is what I was going for…' },
      { src: 'game-ph-marioparty8.jpg', x: 70.2, y: 71.0, w: 7.4, rot: -5.0, game: 1, stars: 4, hoverCap: false, cap: 'Mario Party 8', note: 'This still holds up very well' },
      { src: 'game-ph-swg.jpg', x: 79.6, y: 71.0, w: 7.4, rot: 6.0, game: 1, stars: 4.5, hoverCap: false, cap: 'Star Wars Galaxies', note: 'PLACEHOLDER note' },
      { src: 'game-ph-lbp.jpg', x: 91.4, y: 31.0, w: 5.8, rot: -4.0, game: 1, stars: 4.5, hoverCap: false, cap: 'LittleBigPlanet', note: 'PLACEHOLDER note' }   /* PLACEHOLDER cover, score + note (Joe, 2026-09-24): right column, between PES and The Sims */   /* PLACEHOLDER cover (Joe, 2026-09-24) */
    ],
    /* step 3 — the first animation. `vid` makes the card a video: poster + play badge, and clicking it
       opens the player lightbox (same chrome as the films). */

    /* step 4 — the football run is a CLUSTER (see CLUSTERS); this is the one drawing that survived */
    /* step 4 — the small-town slide. Placements straight off My Story - Small Town.svg; the two
       game covers behave exactly like the film posters (hover caption, click to blow up). */
    2: [
      { src: 'sport-08.jpg', x: 74.36, y: 16.92, w: 17.62, rot: 5.85, cap: 'The one that stood the test of time', hoverCap: false }
      /* FIFA 10 + MW2 moved to the games slide (PHOTOS[1], Joe 2026-09-24) */
    ],
    /* step 5 — favourite films. Captions live in the blown-up card only, never on hover. */
    3: [
      { jig: 1, src: 'film-02.jpg', title: 'The Lord of the Rings', x: 11.96, y: 48.82, w: 8.28, rot: 5.61, cap: 'Best trilogy', hoverCap: false },
      { jig: 1, src: 'film-03.jpg', title: 'Stardust', x: 81.37, y: 50.84, w: 8.29, rot: 7.99, cap: 'Most magical', hoverCap: false },
      /* the favourite — finding it sets off a Day of the Dead burst + a little marimba flourish */
      { jig: 1, src: 'film-04.jpg', title: 'The Book of Life', x: 74.19, y: 18, w: 9.22, rot: 8.11, cap: 'Probably my favourite?', hoverCap: false, pin: true,
        note: 'If you haven’t seen it you must watch it, the most beautiful film',
        party: true },
      { jig: 1, src: 'film-05.jpg', title: 'Coco', x: 23.66, y: 20.53, w: 8.6, rot: -7.4, cap: 'Best Pixar', hoverCap: false },
      { jig: 1, src: 'film-06.jpg', title: 'Howl\u2019s Moving Castle', x: 26.12, y: 49.78, w: 9.53, rot: -7.92, cap: 'Best foreign animated', hoverCap: false },
      { src: 'film-07.jpg', title: 'Cloud Atlas', x: 61.06, y: 59.95, w: 7.17, rot: 11.12, cap: 'Most underrated', hoverCap: false },
      { jig: 1, src: 'film-08.jpg', title: 'Oldboy', x: 49.63, y: 17.74, w: 8.2, rot: 10.53, cap: 'Favourite foreign film', hoverCap: false },
      { src: 'film-09.jpg', title: 'Shutter Island', x: 89.98, y: 64.1, w: 4.15, rot: -10.82, cap: 'The film that got me into films', hoverCap: false },
      { src: 'film-10.jpg', title: 'Star Wars: A New Hope', x: 73.54, y: 68.47, w: 4.02, rot: 8.3, cap: 'Most nostalgic', hoverCap: false },
      { src: 'film-11.jpg', title: 'The Matrix', x: 21.82, y: 83.88, w: 4.09, rot: -6.12, cap: 'Coolest film (shoutout Neo)', hoverCap: false },
      { src: 'film-12.jpg', title: 'The Lion King', x: 7.28, y: 72.12, w: 4.1, rot: -16.02, cap: 'Best Disney', hoverCap: false },
      { src: 'film-13.jpg', title: 'Princess Mononoke', x: 6.8, y: 31.89, w: 4.1, rot: -7.02, cap: 'First Studio Ghibli', hoverCap: false },
      { jig: 1, src: 'film-14.jpg', title: 'Paddington', x: 46.02, y: 56.29, w: 6.4, rot: 6.81, cap: 'Best Sunday film', hoverCap: false },
      { src: 'film-15.jpg', title: '10 Things I Hate About You', x: 91.92, y: 41.44, w: 4.61, rot: 9.2, cap: 'Best teen film', hoverCap: false },
      { src: 'film-16.jpg', title: 'About Time', x: 87.67, y: 21.45, w: 4.12, rot: -11.85, cap: 'Most beautiful', hoverCap: false },
      { src: 'film-17.jpg', title: '300', x: 80.18, y: 8.1, w: 4.18, rot: 12.43, cap: 'Coolest style', hoverCap: false },
      { src: 'film-18.jpg', title: 'How to Train Your Dragon 2', x: 62.86, y: 11.26, w: 4.61, rot: -10.1, cap: 'Most I’ve cried at the cinema :(', hoverCap: false },
      { src: 'film-19.jpg', title: 'Lion', x: 37.41, y: 8.53, w: 4.18, rot: -7.7, cap: 'Best true story', hoverCap: false },
      { src: 'film-20.jpg', title: 'Parasite', x: 70.99, y: 50.17, w: 4.12, rot: 0.0, cap: 'Great twist', hoverCap: false },
      { src: 'film-21.jpg', title: 'Puss in Boots: The Last Wish', x: 83.07, y: 76.59, w: 4.06, rot: -13.1, cap: 'Shouldn’t be this good', hoverCap: false },
      { src: 'film-22.jpg', title: 'The Notebook', x: 38.11, y: 70.78, w: 4.12, rot: 0.0, cap: 'Favourite romance', hoverCap: false },
      { src: 'film-23.jpg', title: 'Superbad', x: 15.62, y: 25.42, w: 4.12, rot: 6.99, cap: 'Best sleepover film', hoverCap: false },
      { src: 'film-24.jpg', title: 'Toy Story 3', x: 72.58, y: 86.15, w: 4.43, rot: -8.69, cap: 'Best sequel', hoverCap: false },
      /* the twist: it's invisible on the page — you only find it by clicking, and then it appears */
      { src: 'film-25.jpg', title: 'The Prestige', x: 59.03, y: 89.27, w: 4.12, rot: 10.05, cap: 'Best twist', hoverCap: false, secret: true },
      { src: 'film-26.jpg', title: 'Into the Wild', x: 13.3, y: 87.6, w: 4.36, rot: 13.31, cap: 'Great true story adventure', hoverCap: false },
      { src: 'film-27.jpg', title: 'Your Highness', x: 39.89, y: 90.18, w: 4.18, rot: -5.86, cap: 'Danny McBride is the best', hoverCap: false },
      /* 125px tall at a 900px viewport; 346x520 art, so 5.76vw wide */
      { src: 'film-sevensam.jpg', title: 'Seven Samurai', x: 22.5, y: 61.1, w: 5.76, rot: 4.2,
        cap: 'Watched this very young and it still holds up!', hoverCap: false }
    ],
    /* step 11 — GeoQuest, the final year project. The demo is the real screen recording (344x720,
       already phone-shaped) playing silently in a phone frame; the promo is the YouTube one. */
    7: [
      { src: 'taiwan-01.jpg', x: 64, y: 11, w: 21, rot: 3.95 },
      { src: 'taiwan-02.jpg', x: 9.8, y: 66.5, w: 23, rot: -5.93 },
      { src: 'skyrock-linkedin.jpg', x: 60, y: 58, w: 14, rot: -3.4, like: true, cap: 'Spending Thanksgiving in Taiwan' },   /* tucked BEHIND the Skyrock logo, to its left: the logo covers about 30% of it (listed first, so it sits underneath); a press gives it a heart */
      { src: 'skyrock.webp', x: 69.8, y: 72.3, w: 12.5, rot: 2.03, deco: true, logo: true }
    ],
    /* step 8 — Mexico for Día de los Muertos. The design frame has one photo top-right (1118.65, 86,
       230×307, 8.55°) and the philosopher bottom-left. The photos are a CLUSTER (see below) so they
       behave exactly like the travel sets; `deco` keeps the philosopher out of the hover/blow-up
       machinery — he just floats, and `alt` gives him a second face to switch to when prodded. */
    /* step 12 — New Technologies (VR for now; the looping "flying guy" clip joins these when its file lands) */
    /* step 12 — LEARNING NEW SKILLS: Joe's own Procreate characters, the VR work and (floating over them) the flying alien he
       animated through AI. Their tags live in TAGS[12], like the skills on the Brighton slide. Captions are PLACEHOLDERS. */
    12: [   /* the learning slide (was step 11 before travel part two went in): the skills block, bottom-right */
      { src: 'skill-draw-1.jpg?v=3', x: 62.5, y: 72.0, w: 8.6, rot: -6.4, skl: 'lead', cap: 'Learning new skills', hoverCap: false, note: 'Character design in Procreate, layers and all. PLACEHOLDER caption' },
      { src: 'skill-draw-2.jpg?v=3', x: 71.0, y: 73.5, w: 8.6, rot: 5.2, skl: 1, cap: 'Learning new skills', hoverCap: false, note: 'Character design in Procreate. PLACEHOLDER caption' },
      { src: 'tech-flyer-green.jpg', vid: 'tech-flyer-green.mp4', loop: true, x: 79.0, y: 72.5, skl: 1, w: 10.5, rot: -4.6, cap: 'Animation through AI: the raw green-screen clip' },   /* the PROCESS: the clip as it came, on its green screen, looping quietly in the card (loop: plays muted while on screen; a press still opens it big) */
      { src: 'tech-vr-2.jpg', x: 89.0, y: 73.0, skl: 1, w: 8.6, rot: 6.1, cap: 'Learning new skills', hoverCap: false, note: 'Building in VR. PLACEHOLDER caption' }
    ],
    5: [
      { src: 'wiz-wand-poster.webp', once: 'wiz-wand',   /* the Big Bang's own wizard: his wand-raising moment (bb-wizard 5s to 8.8s) plays once as he grows, holds on the last frame; a prod replays it */
        x: 7.62, y: 61.83, w: 14.08, rot: 0, deco: true }
    ]
  };
  /* ------------------------------------------------------------------ */

  var Y0 = Math.floor(ERAS[0].years[0]), Y1 = Math.ceil(ERAS[ERAS.length - 1].years[1]);

  var CSS =
  'html.jjms-asleep #jjms,html.jjms-asleep [id^="jjms-"]:not(style),html.jjms-asleep .jjms-eraghost{display:none !important;}' +   /* asleep under a replayed tale: out of the render tree (see SLEEPABLE in init) */
  /* ---- the space backdrop: the swirl SVG, fixed to the viewport but PARALLAXED (moves slower than
     the story) so it drifts behind everything at its own pace ---- */
  '#jjms-bg{position:fixed;inset:0;z-index:0;overflow:hidden;background:#091725;pointer-events:none;}' +
  '#jjms-bg .bgimg{position:absolute;top:0;left:0;width:100%;height:auto;will-change:transform;}' +
  '#jjms-bg .bwash{position:absolute;inset:0;background:radial-gradient(ellipse 80% 50% at 80% 3%,rgba(120,92,180,.20),transparent 58%);}' +
  /* ---- the animated sky: stars glow + grow, moons glow, spirals spin, pink/blue nebulas drift —
     distributed down the WHOLE scroll (it lives inside #jjms so it travels with the story) ---- */
  '#jjms-sky{position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none;}' +
  '#jjms-sky img{position:absolute;display:block;height:auto;will-change:transform,opacity,filter;}' +
  /* parallax layers — each drifts at its own speed (set in render) so the stars never move as one slab */
  '#jjms-sky .slayer{position:absolute;inset:0;will-change:transform;}' +
  /* the design\'s own assets — all GLOW. Dots randomise size / peak glow (--pk) / grow (--sc) / rate (--d) */
  /* PERF: the field stays as dense as ever, but only the ones tagged .tw actually animate. Measured on
     the film screen: 278 continuously-animating dots = 25ms/frame (40fps); the same 278 with a third
     twinkling = 16.8ms (60fps). The still ones keep a fixed glow, so the sky reads identically. */
  '#jjms-sky .gdot{opacity:calc(var(--pk,1) * .78);}' +
  '#jjms-sky .gdot.tw{animation:jjDot var(--d,4s) ease-in-out var(--dl,0s) infinite;}' +
  '@keyframes jjDot{0%,100%{opacity:calc(var(--pk,1) * .3);transform:scale(.5);}50%{opacity:var(--pk,1);transform:scale(var(--sc,1.15));}}' +
  /* static glow (per-star --g), pulsed by the opacity twinkle — cheaper than animating the filter */
  '#jjms-sky .gstar{filter:drop-shadow(0 0 var(--g,9px) rgba(190,215,255,.85));opacity:calc(var(--pk,1) * .82);}' +
  '#jjms-sky .gstar.tw{animation:jjStar var(--d,5s) ease-in-out var(--dl,0s) infinite;}' +
  '@keyframes jjStar{0%,100%{opacity:.4;transform:scale(.55) rotate(0deg);}50%{opacity:var(--pk,1);transform:scale(1.05) rotate(18deg);}}' +
  /* PERF: animating `filter` re-rasterises the moon + its 42px glow every frame (13 of them, and the
     cost scales with pixel count — far worse on Retina). The glow is now STATIC and the pulse rides
     opacity on a sibling halo, so the breathing is pure compositing. */
  '#jjms-sky .gmoon{filter:drop-shadow(0 0 22px rgba(199,231,255,.62)) drop-shadow(0 0 8px rgba(255,255,255,.5));' +
    'animation:jjMoon var(--d,7s) ease-in-out var(--dl,0s) infinite;}' +
  '@keyframes jjMoon{0%,100%{opacity:.72;}50%{opacity:1;}}' +
  /* galaxies: WRAPPER glows + takes the occasional JS fast-spin (rotate + transition); the INNER img
     turns slowly forever (transform) — the two rotations compound */
  '#jjms-sky .gspiral{position:absolute;rotate:0deg;transition:rotate 1.5s cubic-bezier(.5,0,.25,1);' +
    'filter:drop-shadow(0 0 10px rgba(195,215,255,.45));}' +
  '#jjms-sky .gspiral img{position:static;width:100%;height:auto;opacity:.85;transform-origin:50% 50%;animation:jjSpin var(--d,80s) linear infinite;}' +
  '@keyframes jjSpin{to{transform:rotate(360deg);}}' +
  /* PERF: the fill is already a soft radial gradient, so the old blur(54px) was mostly redundant — and
     because these also animated `scale`, that huge blurred surface was RE-RASTERISED every frame (a cost
     that scales with pixel count, so ~4x worse on a Retina screen than it measures at 1x). Now a light
     blur that just smooths the gradient, and the breathe is opacity-only = pure compositor work. */
  '#jjms-sky .gneb{position:absolute;border-radius:50%;filter:blur(16px);animation:jjNeb var(--d,17s) ease-in-out var(--dl,0s) infinite;will-change:opacity;}' +
  '@keyframes jjNeb{0%,100%{opacity:.24;}50%{opacity:.62;}}' +
  /* ---- the era mascot: flies around the screen while you\'re in its era; click it and it flies off
     then restarts. Container wanders (jjFly), the sprite inside bobs + tilts (jjFlap = looks like flight) ---- */
  /* z-index 0 + parented inside #jjms → it floats above the sky but BEHIND the photos (z1) and captions (z2) */
  '#jjms-fly{position:fixed;left:0;top:0;width:44px;height:44px;z-index:941;pointer-events:none;opacity:0;' +
    'transition:opacity .6s ease,transform .55s cubic-bezier(.22,1,.36,1);will-change:transform;}#jjms-fly.swap img{scale:0;}#jjms-fly img{transition:scale .22s ease;}' +   /* on the era bar now (Joe): it crosses its word with the era and hops the dash */
  '#jjms-fly.show{opacity:1;}' +
  '#jjms-fly img{width:100%;height:100%;object-fit:contain;pointer-events:auto;cursor:pointer;' +
    'animation:jjFlap 1.3s ease-in-out infinite;filter:drop-shadow(0 8px 16px rgba(0,0,0,.35));}' +
  '@keyframes jjFly{0%{transform:translate(6vw,22vh);}18%{transform:translate(66vw,10vh);}36%{transform:translate(78vw,54vh);}' +
    '54%{transform:translate(38vw,70vh);}72%{transform:translate(10vw,56vh);}88%{transform:translate(24vw,30vh);}100%{transform:translate(6vw,22vh);}}' +
  '@keyframes jjFlap{0%,100%{transform:translateY(2px) rotate(-5deg);}50%{transform:translateY(-10px) rotate(5deg);}}' +
  /* ---- the Big Bang finale — full cinematic sequence ----
     T+0.0  the void: world fades to black, a singularity forms and pulses
     T+1.05 DETONATION: core blows, double flash, screen shake, 5 shockwaves, 90 particles, bg surge
     T+2.3  the void lifts; T+2.5 caption; T+2.75 the three planets are born  */
  '#jjms .finale{min-height:100vh;padding:12vh 0 10vh;box-sizing:border-box;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:clip;}' +   /* clip, not hidden: a focus or scrollIntoView on a door could scroll the hidden box sideways and shove the whole finale left */
  '#jjms .finale.go .bang{animation:jjmsShake .8s linear 1s both;}' +   /* the shake rides on the bang layer itself: a transform on the finale would turn its fixed, full-screen bang back into a clipped box */
  '@keyframes jjmsShake{0%,100%{transform:translate(0,0);}10%{transform:translate(-9px,6px);}20%{transform:translate(11px,-4px);}' +
    '30%{transform:translate(-12px,-7px);}40%{transform:translate(8px,9px);}50%{transform:translate(-6px,4px);}' +
    '60%{transform:translate(10px,-8px);}70%{transform:translate(-8px,-3px);}80%{transform:translate(5px,6px);}90%{transform:translate(-3px,2px);}}' +
  '#jjms .bang{position:absolute;inset:0;pointer-events:none;}#jjms .finale.go .bang{position:fixed;z-index:950;}' +
  /* the seed: everything there is, floating in the dark, waiting for a press */
  '#jjms .finale .seed{position:absolute;left:50%;top:46%;translate:-50% -50%;z-index:4;background:none;border:0;padding:20px;cursor:pointer;color:#fff;font:inherit;opacity:0;pointer-events:none;transition:opacity .9s ease;animation:jjmsSeedFloat 5s ease-in-out infinite;}' +
  '#jjms .finale.armed:not(.go) .seed{opacity:1;pointer-events:auto;}#jjms .finale.go .seed{transition:opacity .25s ease;}' +
  '#jjms .finale .seed .dust{display:block;position:relative;width:min(36vmin,320px);height:min(28vmin,250px);margin:0 auto;}#jjms .finale .seed .dust b{position:absolute;width:var(--s);height:var(--s);border-radius:50%;background:#fff;opacity:var(--o);box-shadow:0 0 6px rgba(255,255,255,.5);animation:jjmsMote var(--d) ease-in-out var(--dl) infinite alternate;}' +
  '@keyframes jjmsMote{from{transform:translate(0,0);}to{transform:translate(1.4vmin,-1.8vmin);}}#jjms .finale .seed:hover .dust b{animation-duration:1.2s;background:#fff;}' +
  /* the finale's wizard: comes down from his spot under grandad's video, lives bottom-left, drifts a little with the cursor, and casts on the press */
  'html.jjms-fin #jjms .jjms-wizwrap{opacity:0!important;transition:opacity .6s ease;}#jjms .finale .fwiz{position:absolute;left:2vw;bottom:6vh;width:min(19vw,32vh);z-index:5;pointer-events:none;opacity:0;transform:translate(6vw,-70vh) rotate(-8deg);transition:opacity .7s ease,transform 1.8s cubic-bezier(.3,.7,.3,1);}' +
  '#jjms .finale.armed .fwiz{opacity:1;transform:translate(var(--wx,0px),var(--wy,0px)) rotate(0deg);}#jjms .finale.armed .fwiz.here{transition:opacity .7s ease,transform .6s ease-out;}' +
  '#jjms .finale .fwiz{aspect-ratio:4/3;background:url(' + SB + 'fwiz-poster.webp) center/contain no-repeat;}#jjms .finale .fwiz.live{background:none;}#jjms .finale .fwiz video{display:block;width:100%;height:auto;filter:drop-shadow(0 10px 24px rgba(0,0,0,.5));}#jjms .finale .fwiz .fwwand{position:absolute;left:0;top:0;opacity:0;}#jjms .finale .fwiz .fwwand.on{opacity:1;}#jjms .finale .fwiz:has(.fwwand.on) .fwidle{opacity:0;}' +
  '@media (max-width:900px){#jjms .finale .fwiz{width:min(34vw,26vh);left:1vw;bottom:3vh;}}' +
  /* the press pulls the interface in too: everything on screen falls into the seed before it goes (set per element in JS) */
  'html.jjms-suck #jjms-hd,html.jjms-suck #jjms-tl,html.jjms-suck #jjms-nav,html.jjms-suck #jjms-next,html.jjms-suck .nav-container,html.jjms-suck #jj-sound-btn{transition:transform .85s cubic-bezier(.55,0,1,.45),opacity .85s ease !important;opacity:0 !important;pointer-events:none !important;}' +
  'html.jjms-unsuck #jjms-hd,html.jjms-unsuck #jjms-tl,html.jjms-unsuck #jjms-nav,html.jjms-unsuck #jjms-next,html.jjms-unsuck .nav-container,html.jjms-unsuck #jj-sound-btn{transition:transform .9s cubic-bezier(.2,.8,.3,1),opacity .6s ease !important;}' +
  /* the dust field: every speck the universe has, scattered over the finale; the cursor pulls them in and the seed keeps what reaches it */
  '#jjms .finale .dfield{position:absolute;inset:0;z-index:3;pointer-events:none;opacity:0;transition:opacity 1.2s ease;}#jjms .finale.armed:not(.go) .dfield{opacity:1;}#jjms .finale.go .dfield{transition:opacity .35s ease .45s;}' +
  '#jjms .finale .dfield b{position:absolute;left:0;top:0;width:var(--s);height:var(--s);margin:calc(var(--s) * -.5) 0 0 calc(var(--s) * -.5);border-radius:50%;background:#fff;opacity:var(--o);will-change:transform;box-shadow:0 0 6px rgba(255,255,255,.55);}#jjms .finale .dfield b.held{background:#fff;}' +
  '#jjms .finale .seed .dcount{display:block;margin-top:10px;font-size:11px;font-style:normal;font-weight:700;letter-spacing:.03em;text-transform:none;opacity:0;transition:opacity .4s ease;}#jjms .finale .seed.gath .dcount{opacity:.65;}' +
  '#jjms .finale .seed span{display:block;margin-top:34px;font-size:clamp(12px,1vw,16px);font-weight:800;letter-spacing:.03em;text-transform:none;opacity:.85;text-shadow:0 2px 12px rgba(0,0,0,.8);}' +
  '#jjms .finale .seed:hover span{opacity:1;}' +
  '@keyframes jjmsSeed{0%,100%{scale:1;filter:brightness(1);}50%{scale:1.6;filter:brightness(1.5);}}@keyframes jjmsSeedFloat{0%,100%{margin-top:0;}50%{margin-top:-16px;}}' +
  '#jjms .void{position:absolute;inset:0;background:#000;opacity:0;}' +
  '#jjms .finale.pre::after{content:"";position:fixed;inset:0;background:#000;z-index:955;pointer-events:none;animation:jjmsPreBlack .45s ease both;}@keyframes jjmsPreBlack{from{opacity:0;}to{opacity:.94;}}' +
  '#jjms .finale.pre .dfield{z-index:960;opacity:1 !important;}#jjms .finale.pre .seed{opacity:0 !important;transition:opacity .3s ease;}' +   /* the press: the screen goes black, every white speck rushes into the middle over it, then the bang */
  '#jjms .finale.go .void{animation:jjmsVoidIn .55s ease both,jjmsVoidOut .9s ease 2.3s both;}' +
  '@keyframes jjmsVoidIn{from{opacity:0;}to{opacity:.92;}}' +
  '@keyframes jjmsVoidOut{from{opacity:.92;}to{opacity:0;}}' +
  '#jjms .core{position:absolute;left:50%;top:46%;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;opacity:0;' +
    'background:#fff;}' +   /* flat: a paper disc, no glow (Joe); white now, like the specks it is made of */
  '#jjms .finale.go .core{animation:jjmsCore 1s ease-in .12s both,jjmsCoreBlow .6s cubic-bezier(.2,.7,.3,1) 1.05s both;}' +
  '@keyframes jjmsCore{0%{opacity:0;transform:scale(.2);}35%{opacity:1;transform:scale(1.25);}55%{transform:scale(.9);}' +
    '75%{transform:scale(1.35);}92%{transform:scale(.8);}100%{opacity:1;transform:scale(1.5);}}' +
  '@keyframes jjmsCoreBlow{0%{opacity:1;transform:scale(1.5);}100%{opacity:0;transform:scale(46);}}' +
  '#jjms .flash{position:absolute;inset:0;opacity:0;background:radial-gradient(circle at 50% 46%,#fff 0%,#fff 12%,rgba(255,255,255,.75) 12.5%,rgba(255,255,255,.75) 24%,rgba(255,255,255,.4) 24.5%,rgba(255,255,255,.4) 36%,rgba(220,228,255,.18) 36.5%,rgba(220,228,255,.18) 46%,transparent 46.5%);}' +   /* flat concentric paper discs, light to lilac, not a bloom */
  '#jjms .finale.go .flash{animation:jjmsFl 1.1s ease-out 1.05s both;}' +
  '@keyframes jjmsFl{0%{opacity:0;}8%{opacity:1;}30%{opacity:.25;}45%{opacity:.95;}100%{opacity:0;}}' +
  '#jjms .ring{position:absolute;left:50%;top:46%;width:60px;height:60px;margin:-30px 0 0 -30px;border-radius:50%;opacity:0;transform:scale(0);}' +
  '#jjms .ring.c1{border:4px solid rgba(255,255,255,.9);}#jjms .ring.c2{border:3px solid rgba(255,255,255,.6);}#jjms .ring.c3{border:2px solid rgba(220,230,255,.45);}' +
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
    'background:radial-gradient(ellipse,rgba(255,0,245,.14) 0%,rgba(125,91,255,.08) 45%,transparent 72%);}' +
  '#jjms .finale.go .glowb{animation:jjmsGb 1.6s ease 2.4s both;}' +
  '@keyframes jjmsGb{from{opacity:0;transform:translate(-50%,-50%) scale(.6);}to{opacity:1;transform:translate(-50%,-50%) scale(1);}}' +
  '#jjms .fcap{font-size:clamp(18px,2vw,30px);font-weight:700;margin:0 0 46px;opacity:0;text-align:center;padding:0 10vw;position:relative;}' +
  '#jjms .finale.go .fcap{animation:jjmsFc .8s ease 2.5s both;}' +
  '@keyframes jjmsFc{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}' +
  /* the doors: --th is one tile's height; 1100x1375 art, clipped on the menu's diagonal, each tucked under the last so the slants touch */
  '#jjms .dests{--th:min(44vh,23vw,440px);--tw:calc(var(--th) * .8);display:flex;position:relative;padding:0 calc(var(--tw) * .05);}' +
  '#jjms .dests a{position:relative;display:block;width:var(--tw);height:var(--th);flex:0 0 auto;margin-left:calc(var(--tw) * -.088);color:#fff;text-decoration:none;' +
    'clip-path:polygon(10% 0,100% 0,90% 100%,0 100%);opacity:0;transform:scale(0);transition:transform .35s cubic-bezier(.22,1,.36,1),opacity .3s ease,filter .3s ease;will-change:transform;}' +
  '#jjms .dests a:first-child{margin-left:0;}#jjms .dests a img{display:block;width:100%;height:100%;object-fit:cover;}' +
  '#jjms .dests a::before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,10,22,.86) 0%,rgba(6,10,22,.55) 36%,rgba(6,10,22,0) 62%);opacity:0;transition:opacity .3s ease;}' +
  '#jjms .dests .dsub,#jjms .dests .dcta{position:absolute;left:14%;right:12%;text-align:center;opacity:0;transform:translateY(-8px);transition:opacity .3s ease,transform .35s ease;}' +
  '#jjms .dests .dsub{top:9%;font-size:clamp(11px,.95vw,15px);line-height:1.3;font-weight:700;text-shadow:0 2px 8px rgba(0,0,0,.8);}' +
  '#jjms .dests .dcta{top:calc(9% + 4.6em);left:50%;right:auto;transform:translate(-50%,-8px);white-space:nowrap;padding:.55em 1.1em;border-radius:999px;font-size:clamp(11px,.9vw,14px);font-weight:800;background:#FF00F5;color:#fff;box-shadow:0 6px 18px rgba(0,0,0,.4);transition-delay:.05s;}' +
  '#jjms .dests a.long .dcta{top:calc(9% + 7.2em);}' +
  '#jjms .finale.go .dests a{opacity:.72;transform:scale(1);animation:jjmsDoor .7s cubic-bezier(.34,1.56,.64,1) both;}' +
  '#jjms .finale.go .dests a:nth-child(1){animation-delay:2.75s;}#jjms .finale.go .dests a:nth-child(2){animation-delay:2.87s;}#jjms .finale.go .dests a:nth-child(3){animation-delay:2.99s;}' +
  '#jjms .finale.go .dests a:nth-child(4){animation-delay:3.11s;}#jjms .finale.go .dests a:nth-child(5){animation-delay:3.23s;}' +
  '#jjms .finale.go .dests a.in{animation:none;}@keyframes jjmsDoor{from{opacity:0;transform:scale(0);}to{opacity:.72;transform:scale(1);}}@keyframes jjmsDp{from{opacity:0;transform:scale(0);}to{opacity:1;transform:scale(1);}}' +
  '#jjms .finale.go .dests a:hover,#jjms .finale.go .dests a:focus-visible{opacity:1;transform:translateY(-6%) scale(1.1);z-index:3;filter:drop-shadow(0 0 26px color-mix(in srgb,var(--hue) 65%,transparent));}' +
  '#jjms .finale.go .dests:hover a:not(:hover){transform:translateY(10%) scale(.97);opacity:.5;filter:grayscale(.45) brightness(.8);}' +
  /* the call to action follows the site theme; a locked Part Two wears the disabled grey whatever the theme */
  'html[data-jj-theme=medieval] #jjms .dests .dcta{background:#FFC531;color:#1a1200;}html[data-jj-theme=retro] #jjms .dests .dcta{background:#FFE600;color:#101010;border-radius:0;}html[data-jj-theme=alien] #jjms .dests .dcta{background:#35d6ff;color:#061a26;}html[data-jj-theme=mixed] #jjms .dests .dcta{background:#d9c9a3;color:#2a1c08;}' +
  '#jjms .dests .dcta.dstar{top:calc(9% + 7.3em);padding:.3em .9em;font-size:clamp(11px,.85vw,13px);}#jjms .dests a.needtale .dcta.dstar{display:none;}html[data-jj-theme] #jjms .dests a.locked .dcta.lk.dstar,#jjms .dests a.locked .dcta.lk.dstar{background:#000;color:#fff;border:1.5px solid rgba(255,255,255,.85);}#jjms .dests a.locked .dcta.lk.dstar:hover{background:#1a1a1a;}' +
  '#jjms .dests a.locked .dcta.lk,html[data-jj-theme] #jjms .dests a.locked .dcta.lk{background:rgba(120,128,140,.85);color:#e8ecf2;}' +
  '#jjms .dests a:hover::before,#jjms .dests a:focus-visible::before{opacity:1;}#jjms .dests a:hover .dsub,#jjms .dests a:hover .dcta,#jjms .dests a:focus-visible .dsub,#jjms .dests a:focus-visible .dcta{opacity:1;transform:translateY(0);}' +
  '#jjms .dests a:hover .dcta,#jjms .dests a:focus-visible .dcta{transform:translate(-50%,0);}' +
  /* Part Two: grey and quiet until the exam is passed; the lock copy swaps in for the door's own */
  '#jjms .dests .lk,#jjms .dests .dlock{display:none;}#jjms .dests a.locked img{filter:grayscale(.85) brightness(.55);}#jjms .dests a.locked .dsub:not(.lk),#jjms .dests a.locked .dcta:not(.lk){display:none;}' +
  '#jjms .dests a.locked .lk{display:block;}#jjms .dests a.locked .dcta.lk{background:#FFC93D;color:#1a1200;opacity:1;transform:translate(-50%,0);animation:jjmsPrompt 1.6s ease-in-out infinite;}#jjms .dests a.locked .dsub.lk{opacity:1;transform:none;}#jjms .dests a.locked::before{opacity:1;}' +
  /* the exam passed: Part Two takes the stage, the other four wait beneath it, the exam can be retaken under that */
  '#jjms .dests.t2{flex-wrap:wrap;justify-content:center;row-gap:14px;}#jjms .dests.t2 a[data-key=part2]{order:-1;width:calc(var(--tw) * 1.3);height:calc(var(--th) * 1.3);margin:0!important;}#jjms .dests.t2::before{content:"";order:0;flex-basis:100%;height:0;}#jjms .dests.t2 a:not([data-key=part2]){order:1;}' +
  '#jjms .dests.t2 a[data-key=part2] .dnew{display:block;}#jjms .dests .dnew{display:none;position:absolute;top:7%;right:13%;padding:.3em .7em;border-radius:999px;background:#FF00F5;color:#fff;font-size:clamp(10px,.8vw,13px);font-weight:900;letter-spacing:.03em;box-shadow:0 4px 14px rgba(0,0,0,.4);}' +
  '#jjms .ffly{display:none;margin:14px auto 0;padding:.7em 1.5em;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.4);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#fff;font:inherit;font-size:clamp(13px,1vw,16px);font-weight:700;cursor:pointer;position:relative;z-index:5;}' +
  '#jjms .ffly small{display:block;font-weight:400;font-size:.75em;opacity:.75;letter-spacing:.04em;margin-top:2px;}#jjms .ffly:hover{background:rgba(255,255,255,.14);}#jjms .ffly:active{border-color:#ff5fc8;box-shadow:0 0 0 3px rgba(255,95,200,.35);}' +
  '#jjms-step-7 .phw.deco.logo{z-index:6 !important;}#jjms-step-7 .phw.like{z-index:2 !important;}' +   /* Skyrock: the logo sits over the LinkedIn post */
  /* ---- the trophy cabinet (awards) ---- */
  '#jjms .jjcab-back{position:absolute;z-index:3;border-radius:18px 18px 10px 10px;background:linear-gradient(180deg,#2b2140,#150f24);border:2px solid rgba(255,255,255,.28);box-shadow:inset 0 0 40px rgba(0,0,0,.55),0 22px 50px rgba(0,0,0,.45);overflow:hidden;}' +
  '#jjms .jjcab-back .cab-shelf{position:absolute;left:3%;right:3%;height:max(6px,calc(var(--cu) * .5));border-radius:4px;background:linear-gradient(#caa45a,#8a6a2a);box-shadow:0 6px 14px rgba(0,0,0,.5);}' +
  '#jjms .step.v2cab{--cu:min(1.25vw,2vh,calc((53vh - 180px) / 24));justify-content:flex-start;padding-top:max(14vh,100px);}' +
  '#jjms .step.v2cab > .cap,#jjms .step.v2cab > .sub{max-width:min(40vw,760px);margin-left:auto;margin-right:auto;}' +
  '@media (max-width:767px){#jjms .step.v2cab{--cu:min(2.3vw,calc((53vh - 180px) / 24));}#jjms .step.v2cab > .cap,#jjms .step.v2cab > .sub{max-width:none;}}' +
  '#jjms .jjcab-items{position:absolute;z-index:5;pointer-events:none;}' +
  '@media (max-width:1023px){#jjms .step.v2cab .jjdream-again{left:50%!important;top:calc(min(47%, 100% - 24 * var(--cu) - 180px) - 10px)!important;translate:-50% -100%!important;}#jjms .step.v2cab .jjdream-again .rwpk,#jjms .step.v2cab .jjdream-again .rwz{display:none;}' +
    '#jjms .step.v2cab .aglogo[aria-label="Joe"]{left:3%!important;top:calc(min(47%, 100% - 24 * var(--cu) - 180px) - 17vw)!important;width:13vw!important;}}' +
  '@media (max-width:767px){#jjms .step.v2cab .jjdream-again{left:calc(50% + 6.25em + 10px)!important;top:calc(min(47%, 100% - 24 * var(--cu) - 180px) + 24 * var(--cu) + 14px)!important;translate:0 0!important;padding:4px!important;font-size:11px;}#jjms .step.v2cab .jjdream-again .rwtext{display:none;}#jjms .step.v2cab .jjdream-again .rwthumb{width:58px;}' +
    '#jjms .step.v2cab .aglogo[aria-label="Foolproof"]{left:5%!important;top:calc(min(47%, 100% - 24 * var(--cu) - 180px) - 11vw)!important;}#jjms .step.v2cab .aglogo[aria-label^="UIC"]{left:60%!important;top:calc(min(47%, 100% - 24 * var(--cu) - 180px) - 10.5vw)!important;}#jjms .step.v2cab .aglogo[aria-label="Joe"]{left:40%!important;top:calc(min(47%, 100% - 24 * var(--cu) - 180px) - 19vw)!important;width:12vw!important;}}' +   /* phones: the brands sit in the row above the cabinet, clear of the words; the dream pill shrinks to its thumbnail beside Open */   /* phones and tablets: the dream pill sits between the words and the cabinet, designer Joe beside it */
  '#jjms .cabaw{position:absolute;translate:-50% 0;padding:0;margin:0;border:0;background:none;cursor:pointer;line-height:0;pointer-events:none;transform-origin:50% 100%;transition:scale .3s cubic-bezier(.3,1.5,.5,1),filter 1s ease;}' +
  '#jjms .step.cab-open .cabaw{pointer-events:auto;}#jjms .step:not(.cab-open) .cabaw{filter:brightness(.7) saturate(.8);}' +
  '#jjms .cabaw img{display:block;height:100%;width:auto;max-width:none;filter:drop-shadow(0 4px 8px rgba(0,0,0,.55));}' +
  '#jjms .cabaw .agshine{inset:0;}#jjms .cabaw:hover,#jjms .cabaw:focus-visible{scale:1.08;}#jjms .cabaw:hover .agshine,#jjms .cabaw:focus-visible .agshine{opacity:1;animation:jjShine 1.05s cubic-bezier(.4,0,.25,1);}' +
  '#jjms .aglogo.bima .cabl,#jjms .cabaw .cabl{position:absolute;left:50%;bottom:calc(100% + 8px);translate:-50% 4px;padding:5px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.55);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#fff;font-size:clamp(11px,.8vw,14px);font-weight:700;line-height:1.2;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .2s ease,translate .2s ease;z-index:3;}' +
  '#jjms .cabaw:hover .cabl,#jjms .cabaw:focus-visible .cabl,#jjms .step.cab-open .aglogo.bima:hover .cabl,#jjms .step.cab-open .aglogo.bima:focus-visible .cabl{opacity:1;translate:-50% 0;}#jjms .cabaw.pop{animation:jjCabPop .5s cubic-bezier(.3,1.6,.5,1);}@keyframes jjCabPop{40%{scale:1.2;}}' +
  '#jjms .step.v2cab .aglogo.bima{animation:none;}' +   /* on the shelf now: no floating (Joe, 2026-09-25) */
  '#jjms .jjcab-back .cab-light{position:absolute;inset:0;background:radial-gradient(ellipse 60% 70% at 50% 0%,rgba(255,214,140,.55),transparent 70%);opacity:0;transition:opacity 1.2s ease .3s;}#jjms .step.cab-open .jjcab-back .cab-light{opacity:1;}' +
  '#jjms .jjcab-doors{position:absolute;z-index:6;perspective:1200px;cursor:pointer;}#jjms .jjcab-doors i{position:absolute;top:0;bottom:0;width:50%;box-sizing:border-box;border:2px solid rgba(255,255,255,.5);background:linear-gradient(115deg,rgba(255,255,255,.2),rgba(255,255,255,.04) 38%,rgba(255,255,255,.14) 55%,rgba(255,255,255,.03) 72%);-webkit-backdrop-filter:blur(3px) saturate(.8);backdrop-filter:blur(3px) saturate(.8);transition:transform 1.1s cubic-bezier(.3,1.2,.4,1),opacity 1.1s ease;}' +
  '#jjms .jjcab-doors .l{left:0;border-radius:18px 0 0 10px;transform-origin:0 50%;}#jjms .jjcab-doors .r{right:0;border-radius:0 18px 10px 0;transform-origin:100% 50%;}' +
  '#jjms .jjcab-doors i b{position:absolute;top:48%;width:6px;height:22px;border-radius:3px;background:linear-gradient(#ffe39a,#b88a2e);}#jjms .jjcab-doors .l b{right:8px;}#jjms .jjcab-doors .r b{left:8px;}' +
  '#jjms .jjcab-doors:hover i{background-color:rgba(255,255,255,.05);}#jjms .jjcab-doors:hover .l{transform:rotateY(-8deg);}#jjms .jjcab-doors:hover .r{transform:rotateY(8deg);}' +
  '#jjms .step.cab-open .jjcab-doors{pointer-events:none;}#jjms .step.cab-open .jjcab-doors .l{transform:rotateY(-104deg);opacity:.55;}#jjms .step.cab-open .jjcab-doors .r{transform:rotateY(104deg);opacity:.55;}' +
  '#jjms .jjcab-doors .cab-hint{position:absolute;left:50%;top:calc(100% + 14px);translate:-50% 0;min-width:12.5em;box-sizing:border-box;text-align:center;color:#fff;box-shadow:0 0 18px rgba(255,201,61,.4);border-color:rgba(255,224,150,.85)!important;padding:8px 18px;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.4);font-size:clamp(11px,.85vw,14px);font-weight:700;letter-spacing:.06em;white-space:nowrap;transition:opacity .4s ease;animation:jjmsCabHint 2.2s ease-in-out infinite;}@keyframes jjmsCabHint{50%{box-shadow:0 0 28px rgba(255,201,61,.7);}}#jjms .step.cab-open .cab-hint{opacity:0;}' +
  '#jjms .jjcab-close{position:absolute;z-index:7;translate:-50% 0;min-width:12.5em;box-sizing:border-box;text-align:center;padding:8px 18px;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.4);color:#fff;font:inherit;font-size:clamp(11px,.85vw,14px);font-weight:700;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .4s ease .8s;}#jjms .step.cab-open .jjcab-close{opacity:1;pointer-events:auto;}#jjms .jjcab-close:hover{background:rgba(255,255,255,.14);}' +
  '#jjms .step:not(.cab-open) .aglogo.bima{filter:brightness(.7) saturate(.8);transition:filter 1s ease;}#jjms .step.cab-open .aglogo.bima{filter:none;}' +
  /* ---- the Figma canvas (design life) ---- */
  '#jjms .fgm{--acc:#FF00F5;position:absolute;inset:0;z-index:5;pointer-events:none;}html[data-jj-theme="medieval"] #jjms .fgm{--acc:#c9a85c;}html[data-jj-theme="retro"] #jjms .fgm{--acc:#FFD400;}html[data-jj-theme="alien"] #jjms .fgm{--acc:#4fe3ff;}html[data-jj-theme="mixed"] #jjms .fgm{--acc:#b8b8b8;}' +
  '#jjms .fgm > *{pointer-events:auto;}#jjms .fgm .fgm-grid,#jjms .fgm .fgm-curs,#jjms .fgm .fgm-follow{pointer-events:none;}' +
  '#jjms .fgm-grid{position:absolute;inset:0;z-index:-1;background-image:radial-gradient(rgba(255,255,255,.22) 1px,transparent 1.4px);background-size:22px 22px;opacity:0;transition:opacity 1.2s ease;-webkit-mask-image:radial-gradient(ellipse 70% 62% at 50% 50%,#000 40%,transparent 100%);mask-image:radial-gradient(ellipse 70% 62% at 50% 50%,#000 40%,transparent 100%);}' +
  '#jjms .step.fg-on .fgm-grid{opacity:1;}' +
  '#jjms .fgm-draw{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none !important;}#jjms .fgm.drawing .fgm-draw{pointer-events:auto !important;cursor:crosshair;}#jjms .fgm.texting .fgm-draw{pointer-events:auto !important;cursor:text;}' +
  '#jjms .fgm-draw .fr-l{font:500 11px Inter,system-ui,sans-serif;fill:rgba(255,255,255,.75);}#jjms .fgm-texts{position:absolute;inset:0;pointer-events:none;}#jjms .fgm-texts .ftx{position:absolute;pointer-events:auto;min-width:40px;padding:2px 4px;font:600 clamp(14px,1.2vw,20px) Inter,system-ui,sans-serif;color:#fff;outline:1.5px solid #0C8CE9;outline-offset:2px;white-space:nowrap;}#jjms .fgm-texts .ftx:not(:focus){outline-color:transparent;}' +
  '#jjms .fgm-bar{position:absolute;left:50%;top:12.5%;translate:-50% 0;display:flex;align-items:center;gap:6px;padding:6px 10px;border-radius:12px;background:rgba(30,30,30,.86);border:1px solid rgba(255,255,255,.14);box-shadow:0 10px 30px rgba(0,0,0,.35);font:600 12px/1 Inter,system-ui,sans-serif;color:#fff;white-space:nowrap;opacity:0;transform:translateY(-10px);transition:opacity .6s ease .2s,transform .6s cubic-bezier(.3,1.4,.5,1) .2s;}' +
  '#jjms .step.fg-on .fgm-bar{opacity:1;transform:none;}#jjms .fgm-bar .fb-file{padding:4px 6px;border-radius:6px;cursor:text;}#jjms .fgm-bar .fb-file:hover{background:rgba(255,255,255,.08);}#jjms .fgm-bar .fb-name{outline:none;}#jjms .fgm-bar .fb-name[contenteditable="true"]{box-shadow:0 0 0 1.5px #0C8CE9;border-radius:3px;padding:0 2px;}#jjms .fgm-bar .fb-file b{font-weight:400;opacity:.6;}#jjms .fgm-bar .fb-sep{width:1px;height:18px;background:rgba(255,255,255,.18);}' +
  '#jjms .fgm-bar button{font:inherit;color:inherit;border:0;background:none;cursor:pointer;}#jjms .fgm-bar .fb-t{width:28px;height:28px;padding:5px;border-radius:7px;display:flex;align-items:center;justify-content:center;opacity:.85;transition:background .15s ease,scale .15s ease,box-shadow .15s ease;}#jjms .fgm-bar .fb-t svg{width:18px;height:18px;}' +
  '#jjms .fgm-bar .fb-t:hover{background:rgba(255,255,255,.12);scale:1.12;box-shadow:0 0 0 1.5px var(--acc);opacity:1;}#jjms .fgm-bar .fb-t.on{background:#0C8CE9;opacity:1;}#jjms .fgm-bar .fb-undo,#jjms .fgm-bar .fb-clear{display:none;}#jjms .fgm.has-art .fgm-bar .fb-undo{display:flex;}#jjms .fgm.has-art .fgm-bar .fb-clear{display:block;}' +
  '#jjms .fgm-bar .fb-clear{padding:6px 9px;border-radius:6px;background:rgba(255,255,255,.1);}#jjms .fgm-bar .fb-clear:hover{background:rgba(255,255,255,.18);box-shadow:0 0 0 1.5px var(--acc);}' +
  '#jjms .fgm-bar .fb-avs{display:flex;padding-left:5px;}#jjms .fgm-bar .fb-av{width:24px;height:24px;margin-left:-5px;padding:0;border-radius:50%;background:var(--c);border:2px solid #2c2c2c;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;transition:scale .15s ease,box-shadow .15s ease,margin .3s ease;}#jjms .fgm-bar .fb-av:hover{scale:1.2;z-index:2;box-shadow:0 0 0 2px var(--acc);}' +
  '#jjms .fgm-bar .fb-av.xtra{display:none;}#jjms .fgm-bar .fb-avs.all .fb-av.xtra{display:flex;}#jjms .fgm-bar .fb-avs.all .more{display:none;}#jjms .fgm-bar .fb-av.more{background:#555;}' +
  '#jjms .fgm-bar .fb-share{padding:7px 12px;border-radius:6px;background:#0C8CE9;transition:scale .15s ease,box-shadow .15s ease;}#jjms .fgm-bar .fb-share:hover{scale:1.05;box-shadow:0 0 0 2px var(--acc);}' +
  '#jjms .fgm-follow{position:absolute;left:50%;top:calc(12.5% + 52px);translate:-50% 0;padding:5px 12px;border-radius:6px;background:var(--fc,#0C8CE9);color:#fff;font:600 12px Inter,system-ui,sans-serif;opacity:0;transition:opacity .3s ease;}#jjms .fgm.following .fgm-follow{opacity:1;}#jjms .fgm.following{box-shadow:inset 0 0 0 3px var(--fc,#0C8CE9);}' +
  /* the post-it: a to-do list you can drag and edit */
  '#jjms .fgm-sticky{position:absolute;left:4.5%;top:29%;width:clamp(170px,13vw,230px);padding:10px 14px 14px;box-sizing:border-box;background:#FFE17A;color:#2a2200;border-radius:3px;box-shadow:0 12px 26px rgba(0,0,0,.35);font:500 clamp(12px,.9vw,15px)/1.3 Inter,system-ui,sans-serif;rotate:-2deg;opacity:0;scale:.8;transition:opacity .5s ease .5s,scale .5s cubic-bezier(.3,1.5,.5,1) .5s;touch-action:none;}' +
  '#jjms .step.fg-on .fgm-sticky{opacity:1;scale:1;}#jjms .fgm-sticky .sk-grip{height:12px;margin:-4px -8px 6px;border-radius:3px;cursor:grab;background:repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 2px,transparent 2px 5px) center/40px 4px no-repeat;}#jjms .fgm-sticky.drag{box-shadow:0 20px 40px rgba(0,0,0,.45);transition:none;-webkit-user-select:none;user-select:none;}#jjms .fgm-sticky .sk-grip{-webkit-user-select:none;user-select:none;touch-action:none;}#jjms .fgm-sticky.drag .sk-grip{cursor:grabbing;}' +
  '#jjms .fgm-sticky .sk-h{display:block;margin-bottom:6px;font-weight:800;}#jjms .fgm-sticky .sk-row{display:flex;align-items:flex-start;gap:7px;margin:5px 0;}#jjms .fgm-sticky .sk-t{flex:1;outline:none;border-radius:2px;cursor:text;}#jjms .fgm-sticky .sk-t:focus{box-shadow:0 0 0 1.5px rgba(0,0,0,.35);}' +
  '#jjms .fgm-sticky .sk-box{flex:none;width:15px;height:15px;margin-top:1px;padding:0;border-radius:3px;border:1.5px solid #6b5a10;background:rgba(255,255,255,.4);cursor:pointer;position:relative;transition:scale .15s ease;}#jjms .fgm-sticky .sk-box:hover{scale:1.2;box-shadow:0 0 0 2px var(--acc);}' +
  '#jjms .fgm-sticky .sk-row.done .sk-box{background:#1BC47D;border-color:#0f8a55;}#jjms .fgm-sticky .sk-row.done .sk-box::after{content:"";position:absolute;left:3.5px;top:0;width:4px;height:8px;border:solid #fff;border-width:0 2px 2px 0;rotate:45deg;}#jjms .fgm-sticky .sk-row.done .sk-t{text-decoration:line-through;opacity:.65;}' +
  '#jjms .fgm-sticky .sk-no{font-weight:800;color:#b3261e;min-height:0;}#jjms .fgm-sticky.locked .sk-grip{cursor:not-allowed;}#jjms .fgm-sticky.locked .sk-t{cursor:default;}' +
  /* the button to recolour: bottom right, out of the way of the toolbar */
  '#jjms .fgm-btn{position:absolute;right:3.5%;bottom:15%;display:flex;flex-direction:column;align-items:flex-start;gap:7px;opacity:0;transition:opacity .6s ease .7s;}#jjms .step.fg-on .fgm-btn{opacity:1;}' +
  '#jjms .fgm-lab{font:500 11px Inter,system-ui,sans-serif;color:#9747FF;}' +
  '#jjms .fgm-cta{--bc:#FF00F5;padding:.75em 1.6em;border-radius:10px;border:0;background:var(--bc);color:#fff;font:700 clamp(13px,1vw,16px) Inter,system-ui,sans-serif;outline:1.5px dashed #9747FF;outline-offset:5px;cursor:pointer;transition:background .35s ease,scale .2s ease;}#jjms .fgm-cta:hover{scale:1.04;}' +
  '#jjms .fgm-sw{display:flex;gap:8px;}#jjms .fgm-sw i{width:20px;height:20px;border-radius:50%;background:var(--c);border:2px solid rgba(255,255,255,.7);cursor:pointer;transition:scale .15s ease,box-shadow .15s ease;}#jjms .fgm-sw i:hover{scale:1.3;box-shadow:0 0 0 2px var(--acc);}#jjms .fgm-sw i.on{box-shadow:0 0 0 2px #fff,0 0 0 4px var(--c);}' +
  '#jjms .fgm-curs{position:absolute;inset:0;overflow:hidden;}' +
  /* layered round the words: the grid, drawings, typed layers and the to-do post-it sit UNDER the caption and subheading; the toolbar, CTA and cursors stay on top (Joe, 2026-09-24) */
  '#jjms .fgm{z-index:auto;}#jjms .fgm-grid{z-index:1;}#jjms .fgm-draw,#jjms .fgm-texts,#jjms .fgm-sticky{z-index:3;}#jjms-step-8 .cap,#jjms-step-8 .sub{z-index:4;}#jjms .fgm-bar,#jjms .fgm-follow,#jjms .fgm-btn{z-index:6;}#jjms .fgm-curs{z-index:8;}#jjms .fgm-sticky{transition:opacity .5s ease .5s,scale .5s cubic-bezier(.3,1.5,.5,1) .5s,translate .22s ease,rotate .22s ease,box-shadow .22s ease;}#jjms .step.fg-on .fgm-sticky:hover{translate:0 -4px;rotate:-.6deg;box-shadow:0 20px 38px rgba(0,0,0,.45),0 0 0 2px var(--acc);cursor:grab;}#jjms .step.fg-on .fgm-sticky:hover .sk-grip{background-color:rgba(0,0,0,.06);}#jjms .fgm-lab{margin-bottom:6px;}#jjms .fgm-sw{margin-top:14px;}#jjms .fgc{position:absolute;left:0;top:0;opacity:0;transition:opacity .6s ease,scale .3s ease;will-change:transform;}#jjms .step.fg-on .fgc{opacity:1;}' +
  '#jjms .fgc svg{width:16px;height:18px;display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35));}#jjms .fgc b{position:absolute;left:12px;top:14px;padding:3px 7px;border-radius:4px 10px 10px 10px;background:var(--c);color:#fff;font:600 11px/1.1 Inter,system-ui,sans-serif;white-space:nowrap;}' +
  '#jjms .fgc.hi{animation:jjfgJig 1s ease both;z-index:3;}#jjms .fgc.clk svg{scale:.78;transition:scale .12s ease;}#jjms .fgc svg{transition:scale .2s ease;}@keyframes jjfgJig{0%{scale:1;}20%{scale:1.8;rotate:-8deg;}40%{scale:1.8;rotate:8deg;}60%{scale:1.8;rotate:-6deg;}80%{scale:1.6;rotate:4deg;}100%{scale:1.4;rotate:0;}}' +
  '#jjms .fgc.me{opacity:0 !important;transition:opacity .2s ease;}#jjms .fgc.me.on{opacity:1 !important;}#jjms .fgc.me b{left:18px;top:20px;padding:5px 10px;font-size:13px;background:var(--acc);color:#111;border-radius:5px 12px 12px 12px;box-shadow:0 4px 12px rgba(0,0,0,.35);}' +
  /* the share card */
  '#jj-fgshare{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;background:rgba(2,4,12,.6);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:0;transition:opacity .3s ease;font-family:Inter,system-ui,sans-serif;color:#fff;}#jj-fgshare.on{opacity:1;}' +
  '#jj-fgshare .c{width:min(92vw,440px);padding:22px;border-radius:14px;background:#2c2c2c;border:1px solid rgba(255,255,255,.14);box-shadow:0 24px 60px rgba(0,0,0,.5);}#jj-fgshare h4{margin:0 0 4px;font-size:16px;}#jj-fgshare p{margin:0 0 14px;font-size:13px;opacity:.7;}' +
  '#jj-fgshare .ln{display:flex;gap:8px;}#jj-fgshare input{flex:1;min-width:0;padding:9px 10px;border-radius:7px;border:1px solid rgba(255,255,255,.2);background:#1e1e1e;color:#fff;font:13px Inter,system-ui,sans-serif;}#jj-fgshare button,#jj-fgshare a{font:600 13px Inter,system-ui,sans-serif;border-radius:7px;border:0;cursor:pointer;text-decoration:none;}' +
  '#jj-fgshare .so.two{grid-template-columns:1fr 1fr;}#jj-fgshare .so a.cp{background:#0C8CE9;}#jj-fgshare .cp{padding:9px 14px;background:#0C8CE9;color:#fff;}#jj-fgshare .so{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px;}#jj-fgshare .so a,#jj-fgshare .so button{padding:9px 8px;text-align:center;background:rgba(255,255,255,.08);color:#fff;}#jj-fgshare .so a:hover,#jj-fgshare .so button:hover,#jj-fgshare .cp:hover{box-shadow:0 0 0 2px #FF00F5;}#jj-fgshare .x{float:right;width:28px;height:28px;background:rgba(255,255,255,.08);color:#fff;}' +
  '#jjms-step-8 .aglogo::before{content:"";position:absolute;inset:-6px;border:1.5px solid var(--sc,#0C8CE9);border-radius:2px;opacity:0;transition:opacity .25s ease;pointer-events:none;}#jjms-step-8 .aglogo::after{content:attr(aria-label);position:absolute;left:-6px;bottom:calc(100% + 8px);font:600 11px Inter,system-ui,sans-serif;color:var(--sc,#0C8CE9);white-space:nowrap;opacity:0;transition:opacity .25s ease;pointer-events:none;}' +
  '#jjms-step-8 .aglogo.fsel::before,#jjms-step-8 .aglogo.fsel::after{opacity:1;}#jjms-step-8 .aglogo.fdraw::before{opacity:1;animation:jjfgDraw .9s ease both;}@keyframes jjfgDraw{0%{clip-path:inset(0 100% 100% 0);}50%{clip-path:inset(0 0 100% 0);}100%{clip-path:inset(0 0 0 0);opacity:0;}}' +
  /* the caption as a text layer being typed */
  '#jjms .cap.fgtext{outline:1.5px solid #0C8CE9;outline-offset:8px;position:relative;}#jjms .cap.fgtext::before{content:"T  Text";position:absolute;left:-8px;top:-34px;font:600 11px Inter,system-ui,sans-serif;color:#0C8CE9;letter-spacing:0;}' +
  '#jjms .cap .fch{opacity:0;}#jjms .cap .fch.v{opacity:1;}#jjms .cap .fcaret{display:inline-block;width:2px;height:1em;margin:0 1px;background:#0C8CE9;vertical-align:-.1em;animation:jjfgBlink .9s steps(1) infinite;}@keyframes jjfgBlink{50%{opacity:0;}}' +
  '#jjms .ffly2{position:absolute;left:50%;top:76%;translate:-50% 0;margin:0;text-align:center;}html.jjms-cutseen #jjms .ffly2{display:block;animation:jjmsFflyIn .9s cubic-bezier(.3,1.4,.5,1) .4s both;}' +   /* on Skyrock, once the Taiwan film has played: he flies home from here */
  '#jjms .finale.go .ffly{display:block;animation:jjmsFflyIn .9s cubic-bezier(.3,1.4,.5,1) 3.6s both;}@keyframes jjmsFflyIn{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:none;}}' +
  '#jjms .fexam{display:none;margin:22px auto 0;padding:.6em 1.3em;border-radius:999px;border:1px solid rgba(255,255,255,.35);background:rgba(0,0,0,.4);color:#fff;font:inherit;font-size:clamp(12px,.95vw,15px);font-weight:700;cursor:pointer;opacity:0;}#jjms .fexam:hover{background:rgba(255,0,245,.35);}' +
  '#jjms .dests a.locked .dlock{display:block;position:absolute;left:50%;top:50%;width:2.2vw;height:2.2vw;min-width:22px;min-height:22px;translate:-50% -50%;background:url("data:image/svg+xml;utf8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Crect x=%274%27 y=%2711%27 width=%2716%27 height=%2710%27 rx=%272%27/%3E%3Cpath d=%27M8 11V7a4 4 0 0 1 8 0v4%27/%3E%3C/svg%3E") center/contain no-repeat;filter:drop-shadow(0 2px 6px rgba(0,0,0,.8));transition:opacity .3s ease;}' +
  '#jjms .dests a.locked:hover .dlock{opacity:0;}' +
  '@media(max-width:760px){#jjms .dests{--th:min(30vh,34vw);flex-wrap:wrap;justify-content:center;row-gap:8px;}#jjms .dests a{margin-left:calc(var(--tw) * -.06);}}' +
  /* the site footer, lifted from the case studies, closes the page */
  '#jjms-footer{position:relative;z-index:2;}#jjms-footer .footer-link-social .hover-button{transition:transform .3s ease;}#jjms-footer .footer-link-social:hover .hover-button{transform:translate(0,0);}' +
  '#jjms-footer .footer-link{cursor:pointer;}' +
  '#jjms-bg.boom{animation:jjmsBgBoom 1.2s ease-out both;}' +
  '@keyframes jjmsBgBoom{0%{filter:brightness(1);}12%{filter:brightness(2.1);}40%{filter:brightness(1.25);}100%{filter:brightness(1);}}' +
  /* clip horizontal spill (posters near the edges + the overflow:visible content steps would otherwise
     let the page scroll ~100px sideways) — overflow-x:clip leaves the vertical flow + spill untouched */
  '#jjms{position:relative;z-index:1;overflow-x:clip;font-family:"Joes Journey Headline",Georgia,serif;color:#eef2f8;}' +
  /* ---- the growing-film step ----
     A tall step with one sticky stage. `--gp` runs 0 -> 1 across its scroll (set in render) and
     every part of the sequence reads off it: the room darkens, letterbox bars close in, and the
     film climbs from a speck at the top to owning the screen. */
  '#jjms .step.tall{display:block;padding:0;overflow:visible;}' +
  '#jjms .step.tall .stage{position:sticky;top:0;height:100vh;display:flex;flex-direction:column;' +
    'align-items:center;justify-content:center;text-align:center;padding:0 13vw;box-sizing:border-box;' +
    'overflow:hidden;contain:paint;}' +
  /* the room going dark — plus a vignette that closes in as it grows */
  '#jjms .gdim{position:absolute;inset:0;z-index:1;pointer-events:none;will-change:opacity;opacity:0;-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 22%,#000 78%,transparent 100%);mask-image:linear-gradient(to bottom,transparent 0,#000 22%,#000 78%,transparent 100%);' +
    'background:radial-gradient(ellipse 78% 70% at 50% 50%,rgba(0,0,0,.35),rgba(0,0,0,.93) 78%),#000;}' +
  /* cinema bars sliding in from the top and bottom */

  /* the film itself: a speck near the top that grows into the room */
  /* `--gg` is the GROWTH progress (0 -> 1 over the first 75% of the step); after that the film
     just holds at full size and the sticky stage carries it out of view on its own. */
  /* The centring lives on the individual `translate` property and never changes; the growth is
     written to `transform` as translate3d + scale3d, exactly the shape the compositor wants. */
  '#jjms .gvid{position:absolute;left:50%;top:50%;z-index:3;width:54vw;max-width:1000px;aspect-ratio:4/3;' +
    'cursor:pointer;translate:-50% -50%;transform-origin:50% 50%;transform-style:preserve-3d;' +
    'will-change:transform;backface-visibility:hidden;}' +
  '#jjms .gvid .gshell{display:block;position:relative;width:100%;height:100%;border-radius:14px;' +
    'overflow:hidden;background:#000;border:2px solid rgba(255,255,255,.5);' +
    'box-shadow:0 0 70px rgba(255,0,245,.4),0 30px 90px rgba(0,0,0,.8);}' +
  /* the glow swells by FADING a fixed shadow in, never by animating its blur radius */
  '#jjms .gglow{position:absolute;inset:-2%;border-radius:18px;pointer-events:none;opacity:0;' +
    'box-shadow:0 0 90px 14px rgba(255,0,245,.5);will-change:opacity;}' +
  '#jjms .gvid video{display:block;width:100%;height:100%;object-fit:cover;}' +
  '#jjms .gvid video{display:block;width:100%;height:100%;object-fit:cover;}' +
  /* it plays silently and the whole film is the switch — this only says which way it's set */
  '#jjms .ghint{position:absolute;right:14px;bottom:14px;z-index:2;display:inline-flex;align-items:center;' +
    'gap:6px;padding:7px 13px;border-radius:999px;border:1px solid rgba(255,255,255,.28);' +
    'background:rgba(9,14,26,.72);color:#eef2f8;font-size:clamp(11px,.85vw,14px);font-weight:700;' +
    'pointer-events:none;opacity:0;transition:opacity .3s ease,background .2s ease;}' +
  '#jjms .gvid:hover .ghint{background:rgba(255,0,245,.8);border-color:rgba(255,255,255,.6);}' +
  '#jjms .ghint .gs-on{display:none;}' +
  '#jjms .gvid.loud .ghint .gs-on{display:inline;}' +
  '#jjms .gvid.loud .ghint .gs-off{display:none;}' +
  /* the studio marks belong to the headline, so the whole set fades out together as the film grows */
  '#jjms .glogos{position:absolute;inset:0;z-index:5;opacity:.92;will-change:opacity;pointer-events:none;}' +
  '#jjms .glogo{pointer-events:auto;}' +
  /* a wider drift with a slow rock either side of upright, each on its own timing */
  '#jjms .glogo{position:absolute;line-height:0;cursor:pointer;' +
    'animation:jjLogoDrift var(--ld,8s) ease-in-out var(--ldl,0s) infinite;}' +
  '@keyframes jjLogoDrift{0%,100%{transform:translate(0,0) rotate(-3.5deg);}' +
    '25%{transform:translate(var(--lx,10px),var(--ly,-16px)) rotate(2.5deg);}' +
    '50%{transform:translate(calc(var(--lx,10px) * -.7),calc(var(--ly,-16px) * -.9)) rotate(3.5deg);}' +
    '75%{transform:translate(calc(var(--lx,10px) * .4),var(--ly,-16px)) rotate(-2deg);}}' +
  /* The prod runs on an INNER element so the drift is never interrupted — replacing the drift
     animation meant it restarted from frame zero afterwards, which read as a jump. */
  '#jjms .glogo .lgin{display:block;}' +
  '#jjms .glogo .lgin.pop{animation:jjLogoPop .85s cubic-bezier(.34,1.56,.64,1);}' +
  '@keyframes jjLogoPop{0%{transform:scale(1) rotate(0deg);}' +
    '22%{transform:scale(1.28) rotate(-9deg);}' +
    '48%{transform:scale(.9) rotate(8deg);}' +
    '72%{transform:scale(1.12) rotate(-4deg);}' +
    '100%{transform:scale(1) rotate(0deg);}}' +
  '#jjms .glogo:hover img{filter:drop-shadow(0 4px 14px rgba(0,0,0,.75)) ' +
    'drop-shadow(0 0 26px rgba(255,255,255,.55));}' +
  '#jjms .glogo img{display:block;width:100%;height:auto;opacity:.5;' +
    'filter:drop-shadow(0 4px 14px rgba(0,0,0,.75));' +
    'transition:opacity .28s ease,scale .34s cubic-bezier(.22,1,.36,1),filter .28s ease;}' +
  /* they arrive one after another, the same way the collage photos do */
  '#jjms .glogo img{animation:jjmsPhIn .8s cubic-bezier(.34,1.56,.64,1) backwards;}' +
  '#jjms .glogo:nth-of-type(2) img{animation-delay:.1s;}' +
  '#jjms .glogo:nth-of-type(3) img{animation-delay:.2s;}' +
  '#jjms .glogo:nth-of-type(4) img{animation-delay:.3s;}' +
  '#jjms .glogo:hover img{opacity:1;scale:1.14;' +
    'filter:drop-shadow(0 6px 18px rgba(0,0,0,.8)) drop-shadow(0 0 26px rgba(255,255,255,.7));}' +
  '#jjms .glogo .lfall{display:none;}' +
  /* if the artwork ever 404s, the name stands in rather than a broken image */
  '#jjms .glogo.nofile img{display:none;}' +
  '#jjms .glogo.nofile .lfall{display:inline-flex;align-items:center;font-style:normal;line-height:1.2;' +
    'padding:5px 13px;border-radius:999px;background:rgba(9,14,26,.6);border:1px solid rgba(255,255,255,.22);' +
    'color:#eef2f8;font-size:clamp(11px,.85vw,15px);font-weight:700;white-space:nowrap;' +
    'text-shadow:0 1px 6px rgba(0,0,0,.8);}' +
  '#jjms .step{height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 13vw;box-sizing:border-box;' +
    'position:relative;overflow:hidden;}' +
  '#jjms .cap{font-size:clamp(22px,3.1vw,44px);font-weight:700;line-height:1.25;max-width:1060px;margin:0;text-shadow:0 2px 18px rgba(0,0,0,.45);' +
    'position:relative;z-index:2;translate:0 0;transition:translate .32s cubic-bezier(.22,1,.36,1);}' +
  '#jjms .sub{font-size:clamp(16px,2vw,30px);opacity:.62;margin:18px 0 0;max-width:820px;line-height:1.45;' +
    'position:relative;z-index:2;translate:0 0;transition:translate .32s cubic-bezier(.22,1,.36,1);}' +
  /* photo collage — four layers, one transform each so they can never fight:
     .phw = design tilt + scroll parallax (--py), .phd = endless zero-g drift,
     .phs = scroll-driven shrink/fade, img = grow-in + hover */
  /* parallax rides the `translate`/`scale` properties (never `transform`, which the tilt and the
     drift already own) and is TRANSITIONED, so the compositor eases each new target instead of
     the main thread snapping to it a frame late — that late snap is what vibrates on scroll */
  '#jjms .phw{position:absolute;z-index:1;transform-origin:top left;translate:0 0;' +
    'transition:translate .5s cubic-bezier(.22,1,.36,1);}' +
  '#jjms .phw:hover,#jjms .phw.hot{z-index:100;}' +
  '#jjms .phs{display:block;transform-origin:center;will-change:scale,opacity;' +
    'transition:scale .5s cubic-bezier(.22,1,.36,1),opacity .45s ease;}' +
  /* PERF: every photo on every step used to drift, parallax and fade at once — ~157 live
     animations, most of them nowhere near the viewport. They're PAUSED off-screen rather than
     removed: swapping animation-name on `.near` measured WORSE (creating and destroying ~150
     animations on each step change costs more than leaving them be), whereas a paused animation
     stops ticking without any churn. `.near` is the current step +/-1, set in render. */
  '#jjms .phd{display:block;animation:jjmsDrift 15s ease-in-out infinite;will-change:transform;}' +
  '#jjms .phd,#jjms .phw,#jjms .phs{animation-play-state:paused;}' +
  '#jjms .step.near .phd,#jjms .step.near .phw,#jjms .step.near .phs{animation-play-state:running;}' +
  '@keyframes jjmsDrift{' +
    '0%{transform:translate(0,0) rotate(0deg);}' +
    '25%{transform:translate(var(--dx),calc(var(--dy) * -1)) rotate(var(--dr));}' +
    '50%{transform:translate(calc(var(--dx) * -.6),calc(var(--dy) * -1.7)) rotate(calc(var(--dr) * -1));}' +
    '75%{transform:translate(calc(var(--dx) * -1),calc(var(--dy) * -.6)) rotate(calc(var(--dr) * .5));}' +
    '100%{transform:translate(0,0) rotate(0deg);}}' +
  /* the img transition is for HOVER ONLY (fast, no delay). The staggered entry is a separate
     ANIMATION — so the entry delay can never leak onto the hover, which is what made the grow lag. */
  /* every picture on the page wears the same frame: 2px white border + soft rounding + a static shadow.
     PERF: box-shadow is NOT transitioned — repainting a big blurred shadow on every hover frame is what
     made the collages feel sticky (it never shows up at 1x, only on a Retina screen). */
  '#jjms .phw.like .hcur{position:absolute;left:0;top:0;width:34px;height:34px;translate:-50% -50%;pointer-events:none;opacity:0;z-index:9;transition:opacity .2s ease,scale .2s ease;color:#FF00F5;filter:drop-shadow(0 2px 6px rgba(0,0,0,.5));}#jjms .phw.like:hover .hcur{opacity:1;}#jjms .phw.like:active .hcur{scale:.8;}#jjms .phw.like .hcur svg{width:100%;height:100%;fill:currentColor;}' +
  '#jjms .phw .phonce{object-fit:contain!important;}#jjms .phw:has(.phonce.on) .phs img{opacity:0!important;}' +
  /* the skills stack */
  '#jjms .step:not(.skl-open) .phw.skl:not(.skl-lead) .phd{translate:var(--sx,0) var(--sy,0);rotate:var(--sr,0deg);scale:.92;}#jjms .phw.skl .phd{transition:translate .7s cubic-bezier(.22,1,.36,1),rotate .7s ease,scale .7s ease;}#jjms .phw.skl-lead{z-index:3;}' +
  '#jjms .step:not(.skl-open) .stag.skl:not(.skl-head){opacity:0!important;pointer-events:none;}#jjms .stag.skl{transition:opacity .4s ease;}' +
  '#jjms .phw .sklmore{position:absolute;right:-8%;bottom:-6%;padding:5px 11px;border-radius:999px;background:rgba(9,14,26,.85);border:1px solid rgba(255,255,255,.3);color:#eef2f8;font-style:normal;font-size:clamp(10px,.8vw,13px);font-weight:700;white-space:nowrap;z-index:4;transition:opacity .3s ease;}#jjms .step.skl-open .phw .sklmore{opacity:0;}#jjms .phw.like .phd{position:relative;}html.jjms-v2 #jjms .step.live .phw.like:hover img{scale:1.18;opacity:1;}' +
  '#jjms .phw .phloop{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:calc(var(--pw,10vw) * 0.045);pointer-events:none;opacity:0;transition:opacity .6s ease;}#jjms .step.live .phw .phloop{opacity:1;transition:opacity .6s ease .5s,scale .4s ease;}#jjms .step.live .phw:hover .phloop,#jjms .step.live .phw.hot .phloop{scale:1.2;}' +
  '#jjms .phw img{display:block;width:100%;height:auto;border-radius:calc(var(--pw,10vw) * 0.045);opacity:0;scale:.68;cursor:pointer;' +
    'border:2px solid rgba(255,255,255,.55);box-sizing:border-box;' +
    'box-shadow:0 14px 34px rgba(0,0,0,.55);transition:opacity .28s ease,scale .34s cubic-bezier(.22,1,.36,1);}' +
  /* longhand, NOT the `animation` shorthand — the shorthand would reset animation-delay to 0 and
     outrank the per-photo stagger rules below, collapsing the one-by-one entry */
  '#jjms .step.live .phw img{opacity:.5;scale:1;animation-name:jjmsPhIn;animation-duration:.8s;' +
    'animation-timing-function:cubic-bezier(.34,1.56,.64,1);animation-fill-mode:backwards;}' +
  '@keyframes jjmsPhIn{from{opacity:0;scale:.68;}to{opacity:.5;scale:1;}}' +
  /* `.deco` — scenery like the philosopher: it drifts with everything else but sits at full opacity,
     wears no photo frame and ignores the pointer entirely (no grow, no caption, no blow-up) */
  '#jjms .phw.deco{pointer-events:none;}#jjms .phw.deco[data-cursor]{pointer-events:auto;cursor:pointer;}' +
  /* a caption that STAYS under a scenery sprite (the app characters) rather than waiting for a hover */
  '#jjms .phw.deco .dcap{position:absolute;left:50%;top:calc(100% + 10px);transform:translateX(-50%) translateY(8px);' +
    'width:max(17vw,240px);text-align:center;font-size:clamp(11px,.92vw,15px);font-weight:700;' +
    'line-height:1.35;color:#eef2f8;text-shadow:0 2px 10px rgba(0,0,0,.9),0 0 3px rgba(0,0,0,.8);' +
    'pointer-events:none;opacity:0;transition:opacity .3s ease,transform .3s cubic-bezier(.22,1,.36,1);}' +
  '#jjms .phw.deco.said .dcap{opacity:1;transform:translateX(-50%) translateY(0);}' +
  /* a sprite you can prod is worth pointing out */
  '#jjms .phw.deco[data-tap],#jjms .phw.deco[data-alt]{pointer-events:auto;cursor:pointer;}' +
  '#jjms .phw.deco[data-tap] img,#jjms .phw.deco[data-alt] img{' +
    'transition:scale .3s cubic-bezier(.22,1,.36,1),filter .3s ease;}' +
  '#jjms .phw.deco[data-tap]:hover img,#jjms .phw.deco[data-tap].hot img,' +
    '#jjms .phw.deco[data-alt]:hover img,#jjms .phw.deco[data-alt].hot img{scale:1.12 !important;' +
    'filter:drop-shadow(0 18px 30px rgba(0,0,0,.6)) drop-shadow(0 0 24px rgba(255,0,245,.55));}' +
  '#jjms .phw.deco[data-tap]:active img,#jjms .phw.deco[data-alt]:active img{scale:1.04 !important;}' +
  /* The Skyrock lockup never stops moving — a slow tilt-and-breathe with the glow riding along.
     It has to name BOTH animations: the shared `.step.live .phw img` rule sets animation-name to the
     entry pop, and it outranks anything less specific — so the idle is chained after it here. */
  '#jjms .phw.logo{pointer-events:auto;}' +
  '#jjms .phw.logo img{border:0;border-radius:0;box-shadow:none;transform-origin:20% 60%;}' +
  /* A CSS mask can quietly not apply (cross-origin, older Safari, an overlay eating the hover), so
     the blue state is a genuinely blue copy of the lockup stacked on top and faded in. Nothing to
     support, nothing to fail. */
  '#jjms .phw.logo .lgtint{position:absolute;left:0;top:0;width:100%;height:auto;border:0;' +
    'pointer-events:none;opacity:0;transition:opacity .3s ease;box-shadow:none;' +
    'filter:drop-shadow(0 0 20px rgba(59,156,250,.75));}' +
  '#jjms .phw.logo:hover .lgtint,#jjms .phw.logo.lit .lgtint{opacity:1;}' +
  '#jjms .step.live .phw.logo img{animation-name:jjmsPhIn,jjLogo;animation-duration:.8s,6.5s;' +
    'animation-delay:.2s,1s;animation-iteration-count:1,infinite;animation-fill-mode:backwards,none;' +
    'animation-timing-function:cubic-bezier(.34,1.56,.64,1),ease-in-out;}' +
  '@keyframes jjLogo{0%,100%{transform:rotate(-1.6deg) scale(.985);' +
      'filter:drop-shadow(0 0 10px rgba(150,205,255,.35));}' +
    '35%{transform:rotate(1.4deg) scale(1.02);' +
      'filter:drop-shadow(0 0 22px rgba(150,205,255,.7)) drop-shadow(0 0 44px rgba(120,90,255,.35));}' +
    '68%{transform:rotate(-.6deg) scale(1.005);' +
      'filter:drop-shadow(0 0 14px rgba(150,205,255,.45));}}' +
  '#jjms .phw.deco[data-alt]{pointer-events:auto;cursor:pointer;}' +
  /* the face swap is a cross-fade, so it reads as a change of expression rather than a cut */
  '#jjms .step.live .phw.deco img{transition:opacity .24s ease;}' +
  '#jjms .step.live .phw.deco.swap img{opacity:0;}' +
  '#jjms .phw.deco img{border:0;border-radius:0;box-shadow:none;cursor:default;' +
    'filter:drop-shadow(0 14px 26px rgba(0,0,0,.5));}' +
  '#jjms .step.live .phw.deco img{opacity:1;}' +
  '#jjms .phw.deco:hover img{opacity:1 !important;scale:1 !important;}' +
  /* hover: 20% bigger, full brightness, over everything — instant, because the transition owns no delay */
  '#jjms .step.live .phw:hover img,#jjms .step.live .phw.hot img{opacity:1;scale:1.2;}' +
  /* the twist: this one never shows on the page — not even on hover — but it is still there to be
     clicked, and the .blown rule below forces it visible once it opens */
  '#jjms .phw.secret img{opacity:0 !important;}' +
  '#jjms .phw.secret:hover img,#jjms .phw.secret.hot img{opacity:0 !important;scale:1 !important;}' +
  '#jjms .phw.secret .phcap{opacity:0 !important;}' +          /* its label would give the hiding place away */
  '#jjms .phw.secret.blown img{opacity:1 !important;scale:1 !important;}' +
  /* the scroll fade lives on the parent and would multiply the hover back down; !important is the
     only thing that outranks a running animation, so a hovered photo really does reach full */
  '#jjms .phw:hover .phs,#jjms .phw.hot .phs{opacity:1 !important;transition:opacity .25s ease;}' +
  /* the small film-poster caption — HIDDEN until hover, then WHITE with a black outline, clear BELOW the
     poster (margin scales with the poster so the hover-grow never covers it), max 2 lines. */
  /* film posters scale from their BOTTOM edge — BOTH the hover grow (img) AND the scroll shrink (.phs) —
     so the poster bottom never moves down regardless of hover or scroll position; the caption below then
     sits a tight, uniform ~10px under it whatever the poster size / scroll offset */
  '#jjms .hascap img,#jjms .hascap .phs{transform-origin:center bottom;}' +
  '#jjms .phcap{position:absolute;left:50%;top:100%;transform:translateX(-50%);margin-top:10px;width:max-content;max-width:190px;text-align:center;' +
    'font-size:clamp(13px,1vw,17px);font-weight:700;line-height:1.2;color:#fff;opacity:0;' +
    'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;' +
    '-webkit-text-stroke:0.7px #000;paint-order:stroke fill;text-shadow:0 2px 5px rgba(0,0,0,.9);' +
    'pointer-events:none;transition:opacity .28s ease;letter-spacing:.01em;}' +
  '#jjms .phw:hover .phcap,#jjms .phw.hot .phcap{opacity:1;}' +
  /* content collages spill past the step edge so nothing is clipped at the bottom (step 0 stays clipped for its flare) */
  '#jjms .step.col{overflow:visible;}' +
  /* a VIDEO card: the poster in a frame with a play badge over it; clicking opens the player */
  '#jjms .phvid img{border:2px solid rgba(255,255,255,.3);background:#000;}' +
  '#jjms .phvid .phd::before{content:"";position:absolute;left:50%;top:50%;width:58px;height:58px;margin:-29px 0 0 -29px;border-radius:50%;' +
    'background:rgba(10,14,26,.6);border:2px solid rgba(255,255,255,.85);pointer-events:none;transition:background .25s ease,transform .25s ease;}' +
  '#jjms .phvid .phd::after{content:"";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);pointer-events:none;margin-left:3px;' +
    'border-style:solid;border-width:11px 0 11px 19px;border-color:transparent transparent transparent #fff;transition:transform .25s ease;}' +
  '#jjms .phvid:hover .phd::before,#jjms .phvid.hot .phd::before{background:rgba(255,0,245,.75);transform:scale(1.12);}' +
  /* ---- TRAVEL: a lead photo with the rest of its set peeking out behind it ---- */
  /* same rule as the rest of the collages: sits at 50%, grows to full on hover, opens on click. The
     opacity lives on the whole card so the lead, its peek cards and the badge all lift together. */
  '#jjms .trav{position:absolute;z-index:1;cursor:pointer;opacity:0;transition:opacity .4s ease;}' +
  '#jjms .step.live .trav{opacity:.5;}' +
  '#jjms .step.live .trav:hover,#jjms .step.live .trav.hot{opacity:1;z-index:100;}' +
  '#jjms .trav .tstack{position:absolute;inset:0;border-radius:8px;background:#22304a;box-shadow:0 10px 26px rgba(0,0,0,.45);' +
    'border:2px solid rgba(255,255,255,.55);transition:transform .45s cubic-bezier(.22,1,.36,1);}' +
  '#jjms .trav .tlead{position:relative;display:block;width:100%;height:auto;border-radius:8px;border:2px solid rgba(255,255,255,.55);' +
    'box-shadow:0 14px 34px rgba(0,0,0,.55);scale:.7;transition:scale .35s cubic-bezier(.22,1,.36,1);}' +
  '#jjms .step.live .trav .tlead{scale:1;}' +
  /* the peek cards fan a little further out on hover, so it reads as "there are more in here" */
  '#jjms .trav:hover .tstack:nth-of-type(1),#jjms .trav.hot .tstack:nth-of-type(1){transform:rotate(5deg) translate(11px,-9px);}' +
  '#jjms .trav:hover .tstack:nth-of-type(2),#jjms .trav.hot .tstack:nth-of-type(2){transform:rotate(-6deg) translate(-12px,-6px);}' +
  '#jjms .step.live .trav:hover .tlead,#jjms .step.live .trav.hot .tlead{scale:1.15;}' +
  '#jjms .trav .tmore{position:absolute;right:-9px;bottom:-11px;z-index:3;background:rgba(10,14,26,.86);border:1px solid rgba(255,255,255,.32);' +
    'color:#fff;font-size:12px;font-weight:800;border-radius:999px;padding:4px 10px;white-space:nowrap;pointer-events:none;' +
    'box-shadow:0 4px 14px rgba(0,0,0,.5);transition:background .25s ease,border-color .25s ease;}' +
  '#jjms .trav:hover .tmore,#jjms .trav.hot .tmore{background:rgba(255,0,245,.75);border-color:rgba(255,255,255,.6);}' +
  /* the countries: each its own little floating chip with a flag, never one long string */
  '#jjms .tcc{position:absolute;z-index:2;display:flex;flex-wrap:wrap;gap:5px 6px;width:15vw;pointer-events:none;}' +
  '#jjms .tcc span{display:inline-flex;align-items:center;gap:5px;background:rgba(9,14,26,.55);border:1px solid rgba(255,255,255,.18);' +
    'border-radius:999px;padding:3px 9px;font-size:clamp(10px,.78vw,13px);font-weight:700;color:#eef2f8;white-space:nowrap;' +
    'text-shadow:0 1px 6px rgba(0,0,0,.7);animation:jjTcc var(--td,7s) ease-in-out var(--tdl,0s) infinite;}' +
  '@keyframes jjTcc{0%,100%{transform:translate(0,0);}50%{transform:translate(var(--tx,4px),var(--ty,-7px));}}' +
  /* ---- a phone mock playing the app demo on its screen ---- */
  /* No frame of our own — the recording already has a phone in it. The outer span drifts (same
     zero-g motion as the collage photos), the inner one clips the recording's white corners away
     and handles the hover. Two elements so the drift and the hover never fight over `transform`. */
  '#jjms .jjphone{position:absolute;z-index:3;line-height:0;cursor:pointer;' +
    'animation:jjPhoneDrift var(--pd,12.5s) ease-in-out infinite;}' +
  '#jjms .jjphone .pclip{display:block;position:relative;overflow:hidden;border-radius:13%/6.2%;' +
    'filter:drop-shadow(0 18px 40px rgba(0,0,0,.7));' +
    'transition:transform .35s cubic-bezier(.2,.8,.25,1),filter .35s ease;}' +
  '#jjms .jjphone:hover .pclip{transform:translateY(-8px) scale(1.05);' +
    'filter:drop-shadow(0 24px 52px rgba(0,0,0,.75)) drop-shadow(0 0 50px rgba(255,0,245,.42));}' +
  /* nudged out a touch so the white slivers down the sides are cropped too */
  '#jjms .jjphone video{display:block;width:102.5%;height:auto;margin:0 0 0 -1.25%;}' +
  '@keyframes jjPhoneDrift{0%,100%{transform:translate(0,0) rotate(0deg);}' +
    '33%{transform:translate(7px,-11px) rotate(1.1deg);}' +
    '66%{transform:translate(-5px,8px) rotate(-.9deg);}}' +
  /* the play badge only shows up on hover — the looping screen already reads as video */
  '#jjms .jjphone .pplay{position:absolute;left:50%;top:50%;width:22%;aspect-ratio:1;margin:-11% 0 0 -11%;' +
    'border-radius:50%;background:rgba(255,0,245,.82);opacity:0;transition:opacity .25s ease,transform .25s ease;' +
    'transform:scale(.8);box-shadow:0 6px 20px rgba(0,0,0,.5);}' +
  '#jjms .jjphone .pplay::after{content:"";position:absolute;left:50%;top:50%;transform:translate(-46%,-50%);' +
    'border-style:solid;border-width:.62em 0 .62em 1.04em;border-color:transparent transparent transparent #fff;' +
    'font-size:min(2.4vw,26px);}' +
  '#jjms .jjphone:hover .pplay{opacity:1;transform:scale(1);}' +
  /* ---- a caption phrase you can press ----
     No underline. The temptation is a periodic GLINT: every few seconds the whole phrase flashes
     bright white with a glow bloom and takes a small breath, then settles back to pink. Driven by
     `color` + text-shadow + scale — all of which survive the nested word/char spans (a clip-text
     shine did not: background-clip:text cannot reach glyphs inside inline-block children). */
  '#jjms .sub .funk{position:relative;display:inline-block;cursor:pointer;pointer-events:auto;color:#FF6FE8;' +
    'text-shadow:0 0 18px rgba(255,0,245,.35),0 2px 12px rgba(0,0,0,.7);' +
    'animation:jjFunkGlint 3.6s ease-in-out 1.2s infinite,jjFunkBreathe 3.6s ease-in-out 1.2s infinite;' +
    'transition:color .25s ease,scale .25s cubic-bezier(.34,1.56,.64,1);}' +
  '@keyframes jjFunkGlint{0%,26%,100%{color:#FF6FE8;text-shadow:0 0 18px rgba(255,0,245,.35),0 2px 12px rgba(0,0,0,.7);}' +
    '11%{color:#fff;text-shadow:0 0 24px rgba(255,255,255,.85),0 0 52px rgba(255,0,245,.8),0 2px 12px rgba(0,0,0,.7);}}' +
  '@keyframes jjFunkBreathe{0%,30%,100%{scale:1;}11%{scale:1.04;}}' +
  '#jjms .sub .funk .ch{color:inherit;}' +
  '#jjms .sub .funk:hover{color:#fff;animation-play-state:paused,paused;scale:1.05;}' +
  /* ---- the client logos ---- */
  '#jjms .aglogo{position:absolute;z-index:4;padding:0;border:0;background:none;cursor:pointer;' +
    'line-height:0;animation:jjLogoDrift var(--ld,9s) ease-in-out var(--ldl,0s) infinite;}' +
  /* the brands arrive one after another from all sides (the agencies slide only) */
  '#jjms-step-8 .aglogo{opacity:0;translate:var(--fx,0) var(--fy,0);scale:.4;transition:opacity .6s ease var(--ad,0s),translate .9s cubic-bezier(.22,1,.36,1) var(--ad,0s),scale .9s cubic-bezier(.22,1,.36,1) var(--ad,0s);}#jjms-step-8.seen .aglogo{opacity:1;translate:0 0;scale:1;}' +
  '#jjms .aglogo .agin{display:block;position:relative;' +
    'transition:transform .3s cubic-bezier(.22,1,.36,1),filter .3s ease;}' +
  /* a soft white glow sits behind every one by default */
  '#jjms .aglogo img{display:block;width:100%;height:auto;' +
    'filter:drop-shadow(0 0 16px rgba(255,255,255,.4)) drop-shadow(0 4px 12px rgba(0,0,0,.6));}' +
  /* the pink hue behind, brought up on hover */
  '#jjms .aglogo .agin::before{content:"";position:absolute;left:-14%;top:-30%;right:-14%;bottom:-30%;' +
    'border-radius:50%;background:radial-gradient(ellipse at 50% 50%,rgba(255,0,245,.16),transparent 68%);' +
    'opacity:0;transition:opacity .3s ease;pointer-events:none;}' +
  /* awards only: a silver highlight sweeps across the metal when you hover */
  '#jjms .agshine{position:absolute;inset:0;pointer-events:none;opacity:0;' +
    '-webkit-mask-image:var(--m);mask-image:var(--m);-webkit-mask-size:100% 100%;mask-size:100% 100%;' +
    '-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;' +
    'background:linear-gradient(108deg,transparent 38%,rgba(255,255,255,.35) 46%,' +
      'rgba(255,255,255,.95) 50%,rgba(226,232,240,.55) 55%,transparent 63%);' +
    'background-size:260% 100%;background-position:120% 0;}' +
  '#jjms .aglogo:hover .agshine{opacity:1;animation:jjShine 1.05s cubic-bezier(.4,0,.25,1);}' +
  '@keyframes jjShine{from{background-position:120% 0;}to{background-position:-90% 0;}}' +
  '#jjms .aglogo:hover .agin{transform:scale(1.09);}' +
  '#jjms .aglogo:hover .agin::before{opacity:1;}' +
  '#jjms .aglogo:hover img{filter:drop-shadow(0 0 26px rgba(255,255,255,.75)) drop-shadow(0 4px 12px rgba(0,0,0,.6));}' +
  /* the BBC juggles its middle B: up, round, and back into the gap */
  '#jjms .aglogo.bbc{overflow:visible;}' +
  '#jjms .aglogo .bmask{position:absolute;left:33.4%;top:0;width:33.2%;height:100%;overflow:hidden;' +
    'pointer-events:none;}' +
  '#jjms .aglogo .bmask img{position:absolute;left:-100.6%;top:0;width:303%;}' +
  '#jjms .aglogo.bbc.go .bmask{animation:jjJuggle 1.5s cubic-bezier(.33,0,.25,1) both;}' +
  '@keyframes jjJuggle{0%{transform:translate(0,0) rotate(0deg);}' +
    '18%{transform:translate(-4%,-58%) rotate(-90deg);}' +
    '36%{transform:translate(0,-86%) rotate(-180deg);}' +
    '54%{transform:translate(4%,-58%) rotate(-270deg);}' +
    '72%{transform:translate(2%,-8%) rotate(-352deg);}' +
    '86%{transform:translate(0,4%) rotate(-360deg);}' +
    '100%{transform:translate(0,0) rotate(-360deg);}}' +
  /* the logo effect burst, positioned above whichever logo was pressed */
  '#jjms .aglogo .agfx{position:absolute;left:50%;bottom:calc(100% + 10px);translate:-50% 0;' +
    'pointer-events:none;opacity:1;transition:opacity .4s ease,translate .4s ease;}' +
  '#jjms .aglogo .agfx.out{opacity:0;translate:-50% -12px;}' +
  '#jjms .aglogo .agfx svg{display:block;width:88px;height:60px;overflow:visible;}' +
  '#jjms .aglogo .agfx svg *{fill:none;stroke:#FF6FE8;stroke-width:2.4;stroke-linecap:round;' +
    'stroke-linejoin:round;filter:drop-shadow(0 0 8px rgba(255,111,232,.7));' +
    'stroke-dasharray:280;stroke-dashoffset:280;animation:jjFxDraw .8s ease forwards;}' +
  '#jjms .aglogo .agfx svg *:nth-child(2){animation-delay:.14s;}' +
  '#jjms .aglogo .agfx svg *:nth-child(3){animation-delay:.28s;}' +
  '#jjms .aglogo .agfx svg *:nth-child(4){animation-delay:.4s;}' +
  '#jjms .aglogo .agfx svg *:nth-child(5){animation-delay:.5s;}' +
  /* ---- the award trophy: gold, breathing, and it invites a press. Drawn rather than exported —
     the design frame for this screen has no trophy asset. ---- */
  '#jjms .jjtrophy{position:absolute;z-index:3;padding:0;border:0;background:none;cursor:pointer;' +
    'line-height:0;transform-origin:50% 85%;animation:jjTroph 4.2s ease-in-out infinite;}' +
  '#jjms .jjtrophy svg{display:block;width:100%;height:auto;overflow:visible;' +
    'filter:drop-shadow(0 0 12px rgba(255,201,61,.5)) drop-shadow(0 8px 18px rgba(0,0,0,.6));' +
    'transition:filter .25s ease,transform .18s ease;}' +
  '#jjms .jjtrophy .tcup,#jjms .jjtrophy .tbase{fill:#FFC93D;stroke:#7A4E06;stroke-width:2.4;stroke-linejoin:round;}' +
  '#jjms .jjtrophy .thandle,#jjms .jjtrophy .tstem{fill:none;stroke:#FFC93D;stroke-width:5;stroke-linecap:round;}' +
  '#jjms .jjtrophy .tshine{fill:none;stroke:rgba(255,255,255,.75);stroke-width:3;stroke-linecap:round;}' +
  '@keyframes jjTroph{0%,100%{transform:translateY(0) rotate(-2.5deg) scale(1);}' +
    '50%{transform:translateY(-9px) rotate(2.5deg) scale(1.04);}}' +
  '#jjms .jjtrophy:hover{animation-play-state:paused;}' +
  '#jjms .jjtrophy:hover svg{filter:drop-shadow(0 0 26px rgba(255,201,61,.95)) drop-shadow(0 8px 18px rgba(0,0,0,.6));}' +
  '#jjms .jjtrophy:active svg{transform:scale(.94);}' +
  /* a light sweeping across it every few seconds */
  '#jjms .jjtrophy .tglint{position:absolute;left:14%;top:2%;width:16%;height:62%;pointer-events:none;' +
    'background:linear-gradient(105deg,transparent,rgba(255,255,255,.85),transparent);' +
    'filter:blur(2px);opacity:0;animation:jjTglint 4.2s ease-in-out infinite;}' +
  '@keyframes jjTglint{0%,55%{opacity:0;transform:translateX(0);}62%{opacity:.9;}' +
    '78%,100%{opacity:0;transform:translateX(320%);}}' +
  /* a standalone pill at the country size rather than the skills size */
  '#jjms .stag.sm{cursor:default;}' +
  '#jjms .stag.sm .sin{font-size:clamp(10px,.78vw,13px);padding:3px 9px;gap:5px;}' +
  /* The same pill, placed on its own rather than flowing in a row. Two elements on purpose: .stag
     owns the position + the static tilt (on `rotate`, which composes), .sin is the pill itself and
     owns `transform` — so the drift and the click effects can take it over without fighting. */
  '#jjms .stag{position:absolute;z-index:2;cursor:pointer;}#jjms .step:not(.cur) .stag{opacity:0!important;pointer-events:none;transition:opacity .35s ease;}' +   /* tags ride with their pictures, and .col steps do not clip, so a leaving slide's tags were drifting into the next one */
  '#jjms .stag .sin{display:inline-flex;align-items:center;gap:6px;' +
    'background:rgba(9,14,26,.55);border:1px solid rgba(255,255,255,.18);border-radius:999px;' +
    'padding:4px 11px;font-size:clamp(11px,.86vw,15px);font-weight:700;color:#eef2f8;white-space:nowrap;' +
    'text-shadow:0 1px 6px rgba(0,0,0,.7);transition:border-color .2s,background .2s;' +
    'animation:jjTcc var(--td,7s) ease-in-out var(--tdl,0s) infinite;}' +
  '#jjms .stag:hover .sin{background:rgba(16,24,44,.8);border-color:rgba(255,255,255,.42);}' +
  /* --- the click effects. Each replaces the drift for its duration (both drive `transform`, and
     the last animation in the list wins), then hands it straight back. --- */
  '#jjms .stag .sin.fx-bounce{animation:jjFxBounce .9s cubic-bezier(.34,1.56,.64,1);}' +
  '@keyframes jjFxBounce{0%{transform:scale(1,1);}18%{transform:scale(1.18,.8) translateY(3px);}' +
    '40%{transform:scale(.92,1.16) translateY(-11px);}62%{transform:scale(1.08,.94) translateY(2px);}' +
    '82%{transform:scale(.98,1.03) translateY(-3px);}100%{transform:scale(1,1);}}' +
  '#jjms .stag .sin.fx-spin{animation:jjFxSpin 1s cubic-bezier(.4,0,.2,1);}' +
  '@keyframes jjFxSpin{0%{transform:perspective(620px) rotateY(0) rotateX(0);}' +
    '50%{transform:perspective(620px) rotateY(180deg) rotateX(12deg);}' +
    '100%{transform:perspective(620px) rotateY(360deg) rotateX(0);}}' +
  /* the little burst that pops out above a pill */
  '#jjms .stag .fxpop{position:absolute;left:50%;bottom:calc(100% + 9px);translate:-50% 0;' +
    'white-space:nowrap;pointer-events:none;opacity:1;transition:opacity .4s ease,translate .4s ease;}' +
  '#jjms .stag .fxpop.out{opacity:0;translate:-50% -10px;}' +
  '#jjms .stag .fxpop.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;' +
    'font-size:13px;font-weight:600;letter-spacing:.04em;color:#7CFFB2;' +
    'text-shadow:0 0 12px rgba(124,255,178,.6),0 1px 4px rgba(0,0,0,.8);}' +
  '#jjms .stag .fxpop.mono::after{content:"";display:inline-block;width:7px;height:14px;margin-left:2px;' +
    'vertical-align:-2px;background:#7CFFB2;animation:jjFxCaret .7s steps(1) infinite;}' +
  '@keyframes jjFxCaret{0%,49%{opacity:1;}50%,100%{opacity:0;}}' +
  /* the drawn ones: every stroke reveals itself, staggered */
  '#jjms .fxsvg{display:block;width:82px;height:48px;overflow:visible;}' +
  '#jjms .fxsvg *{fill:none;stroke:#9ED7FF;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;' +
    'filter:drop-shadow(0 0 6px rgba(158,215,255,.55));' +
    'stroke-dasharray:240;stroke-dashoffset:240;animation:jjFxDraw .85s ease forwards;}' +
  '#jjms .fxsvg *:nth-child(2){animation-delay:.16s;}#jjms .fxsvg *:nth-child(3){animation-delay:.32s;}' +
  '#jjms .fxsvg *:nth-child(4){animation-delay:.46s;}#jjms .fxsvg *:nth-child(5){animation-delay:.58s;}' +
  '@keyframes jjFxDraw{to{stroke-dashoffset:0;}}' +
  /* Figma: the J swirl draws itself, then settles */
  '#jjms .fxsvg.swirlfx *{stroke:#FF6FE8;stroke-width:5;stroke-dasharray:260;stroke-dashoffset:260;' +
    'animation:jjFxDraw 1.05s cubic-bezier(.4,0,.2,1) forwards;' +
    'filter:drop-shadow(0 0 9px rgba(255,111,232,.75));}' +
  '#jjms .fxsvg.swirlfx *:nth-child(2){animation-delay:.62s;animation-duration:.32s;}' +
  /* Photoshop: three dabs land in sequence */
  '#jjms .fxsvg.paint .dab{stroke:none;stroke-dasharray:none;stroke-dashoffset:0;' +
    'animation:jjFxDab .5s cubic-bezier(.34,1.56,.64,1) both;transform-origin:center;}' +
  '#jjms .fxsvg.paint .d1{fill:#FF2E88;}#jjms .fxsvg.paint .d2{fill:#FFC93D;animation-delay:.13s;}' +
  '#jjms .fxsvg.paint .d3{fill:#3B9CFA;animation-delay:.26s;}' +
  '@keyframes jjFxDab{0%{opacity:0;transform:scale(.2);}70%{opacity:.95;transform:scale(1.12);}' +
    '100%{opacity:.92;transform:scale(1);}}' +
  /* Premiere: the playhead scrubs along the strip */
  '#jjms .fxsvg.clipfx .strip,#jjms .fxsvg.clipfx .perf{stroke:#9ED7FF;stroke-dasharray:300;' +
    'stroke-dashoffset:300;animation:jjFxDraw .5s ease forwards;}' +
  '#jjms .fxsvg.clipfx .perf{animation-delay:.12s;}' +
  '#jjms .fxsvg.clipfx .head{fill:#FF2E88;stroke:none;stroke-dasharray:none;stroke-dashoffset:0;' +
    'animation:jjFxScrub 1.1s cubic-bezier(.4,0,.2,1) .35s both;}' +
  '@keyframes jjFxScrub{0%{transform:translateX(0);}100%{transform:translateX(62px);}}' +
  /* Android Studio: the build bar fills, then the tick */
  '#jjms .fxsvg.buildfx .bar{fill:rgba(255,255,255,.16);stroke:none;stroke-dasharray:none;stroke-dashoffset:0;}' +
  '#jjms .fxsvg.buildfx .fill{fill:#3DDC84;stroke:none;stroke-dasharray:none;stroke-dashoffset:0;' +
    'transform-origin:6px 0;animation:jjFxFill 1s cubic-bezier(.4,0,.2,1) both;}' +
  '@keyframes jjFxFill{0%{transform:scaleX(0);}100%{transform:scaleX(1);}}' +
  '#jjms .fxsvg.buildfx .tick{fill:none;stroke:#3DDC84;stroke-width:4;stroke-linecap:round;' +
    'stroke-linejoin:round;stroke-dasharray:40;stroke-dashoffset:40;' +
    'animation:jjFxDraw .4s ease 1s forwards;}' +
  /* the pointer slides in and clicks, the ring rides out from under it */
  '#jjms .fxsvg.cursor .ptr{fill:#fff;stroke:#0b1120;stroke-width:1.5;stroke-dasharray:none;stroke-dashoffset:0;' +
    'animation:jjFxPtr 1.15s cubic-bezier(.3,1,.4,1) forwards;}' +
  '@keyframes jjFxPtr{0%{transform:translate(-16px,-12px);opacity:0;}30%{transform:translate(0,0);opacity:1;}' +
    '52%{transform:translate(2px,3px) scale(.88);}66%{transform:translate(0,0) scale(1);}100%{transform:translate(0,0);opacity:1;}}' +
  '#jjms .fxsvg.cursor .rip{stroke:#FF6FE8;stroke-dasharray:none;stroke-dashoffset:0;transform-origin:46px 22px;' +
    'animation:jjFxRip .8s ease-out .5s forwards;}' +
  '@keyframes jjFxRip{0%{transform:scale(.2);opacity:0;}25%{opacity:.95;}100%{transform:scale(2.3);opacity:0;}}' +
  /* ---- the collection lightbox: every shot of one trip, fanned out and drifting ---- */
  '#jjms-coll{position:fixed;inset:0;z-index:410;opacity:0;pointer-events:none;transition:opacity .45s ease;}' +
  '#jjms-coll.on{opacity:1;pointer-events:auto;}' +
  '#jjms-coll .cshots{position:absolute;inset:0;}' +
  '#jjms-coll .cshots img{box-shadow:0 0 60px rgba(255,0,245,.35),0 26px 70px rgba(0,0,0,.65);}' +
  /* The card owns its placement on the INDIVIDUAL transform properties (translate/scale/rotate) and
     leaves `transform` free for the drift animation — they compose. Driving the drift from the inner
     <img> instead (as this first did) slides the photo around INSIDE its frame, which is what made
     them jump and left a ragged edge where the picture parted from its border. */
  '#jjms-coll .cshot{position:absolute;border-radius:10px;border:3px solid rgba(255,255,255,.75);background:#101a2c;' +
    'overflow:hidden;line-height:0;box-shadow:0 18px 50px rgba(0,0,0,.6);opacity:0;translate:-50% -50%;scale:.25;rotate:0deg;' +
    'transition:opacity .5s ease,left .75s cubic-bezier(.2,.9,.25,1),top .75s cubic-bezier(.2,.9,.25,1),' +
    'scale .75s cubic-bezier(.2,.9,.25,1),rotate .75s cubic-bezier(.2,.9,.25,1);will-change:transform;}' +
  '#jjms-coll.on .cshot{opacity:1;}' +
  '#jjms-coll .cshot img{display:block;width:auto;height:auto;max-width:var(--cw,340px);max-height:var(--ch,320px);}' +
  '#jjms-coll .cinfo{position:absolute;left:50%;bottom:5vh;transform:translateX(-50%);width:min(90vw,760px);text-align:center;pointer-events:none;}' +
  '#jjms-coll .cname{margin:0 0 8px;font-size:clamp(24px,3vw,42px);font-weight:800;color:#fff;text-shadow:0 2px 18px rgba(0,0,0,.8);}' +
  /* One caption style across every lightbox — the collection, the blown-up film and the single
     image are all the same weight and size now; they used to differ inside the same section. */
  '#jjms-coll .ccap,#jjms-shot .jjp-title,#jjms-player .jjp-title{margin:0 0 12px;' +
    'font-size:clamp(17px,1.7vw,25px);font-weight:700;line-height:1.4;color:#fff;' +
    'text-shadow:0 2px 14px rgba(0,0,0,.9);}' +
  '#jjms-coll .cflags{display:flex;flex-wrap:wrap;gap:6px 8px;justify-content:center;}' +
  '#jjms-coll .cflags span{display:inline-flex;align-items:center;gap:6px;background:rgba(9,14,26,.6);border:1px solid rgba(255,255,255,.22);' +
    'border-radius:999px;padding:5px 12px;font-size:13px;font-weight:700;color:#fff;}' +
  /* ---- "you found my favourite": a Día de Muertos burst of papel picado + marigolds ---- */
  '#jjms-party{position:fixed;inset:0;z-index:430;pointer-events:none;overflow:hidden;}' +
  '#jjms-party i{position:absolute;display:block;font-style:normal;line-height:1;opacity:0;' +
    'animation:jjParty var(--pd,2.6s) cubic-bezier(.16,.7,.36,1) var(--pdl,0s) both;will-change:transform,opacity;}' +
  /* up and out first, then it tumbles back down past the bottom — one keyframe, gravity implied */
  '@keyframes jjParty{0%{opacity:0;transform:translate(0,0) rotate(0deg) scale(.4);}' +
    '9%{opacity:1;}' +
    '38%{transform:translate(calc(var(--px,0px) * .55),var(--pk,-160px)) rotate(calc(var(--pr,360deg) * .35)) scale(1);}' +
    '85%{opacity:1;}' +
    '100%{opacity:0;transform:translate(var(--px,0px),var(--py,420px)) rotate(var(--pr,360deg)) scale(.92);}}' +
  /* the little "found it!" ribbon that rides in under the poster */
  '#jjms-detail .jjd-found{display:none;margin:0 0 12px;font-size:clamp(13px,1.1vw,17px);font-weight:800;letter-spacing:.03em;' +
    'text-transform:none;color:#FFC33D;text-shadow:0 2px 14px rgba(0,0,0,.85);animation:jjFound .7s cubic-bezier(.22,1,.36,1) both;}' +
  '#jjms-detail.party .jjd-found{display:block;}' +
  '@keyframes jjFound{0%{opacity:0;transform:translateY(10px) scale(.9);}100%{opacity:1;transform:none;}}' +
  /* ---- the video player lightbox (shares the scrim + close button with the film one) ---- */
  '#jjms-player{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%) scale(.94);z-index:410;width:min(92vw,1100px);' +
    'opacity:0;pointer-events:none;transition:opacity .4s ease,transform .45s cubic-bezier(.2,.8,.25,1);}' +
  '#jjms-player.on{opacity:1;pointer-events:auto;transform:translate(-50%,-50%) scale(1);}' +
  '#jjms-player video,#jjms-player .jjp-yt{display:block;width:100%;max-height:76vh;border-radius:12px;background:#000;' +
    'box-shadow:0 0 70px rgba(255,0,245,.35),0 30px 90px rgba(0,0,0,.7);}' +
  '#jjms-player .jjp-yt{display:none;aspect-ratio:16/9;height:min(76vh,calc(min(92vw,1100px) * .5625));overflow:hidden;}' +
  '#jjms-player .jjp-yt iframe{display:block;width:100%;height:100%;border:0;}' +
  '#jjms-player.yt video{display:none;}' +
  '#jjms-player.yt .jjp-yt{display:block;}' +
  /* the phone-shaped cut: the walkthrough keeps its handset frame in the lightbox */
  '#jjms-player.phone{width:auto;}' +
  '#jjms-player.phone video{width:min(40vh,80vw);max-height:none;aspect-ratio:344/720;object-fit:cover;' +
    'border-radius:28px;border:6px solid #0b0f18;margin:0 auto;' +
    'box-shadow:0 26px 90px rgba(0,0,0,.75),0 0 46px rgba(255,0,245,.2);}' +
  '#jjms-player .jjp-title,#jjms-shot .jjp-title{margin:16px 0 0;text-align:center;}' +
  '#jjms-player .jjp-later{display:none;margin:14px auto 0;padding:10px 22px;border-radius:999px;border:1px solid rgba(255,255,255,.4);background:rgba(10,14,26,.7);color:#eef2f8;font:inherit;font-weight:700;font-size:14px;cursor:pointer;transition:background .25s ease,border-color .25s ease;}#jjms-player.rv .jjp-later{display:block;}#jjms-player .jjp-later:hover{background:rgba(255,0,245,.22);border-color:rgba(255,0,245,.6);}' +
  /* the single-image lightbox */
  '#jjms-skills{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%) scale(.94);z-index:410;width:min(94vw,1180px);max-height:88vh;overflow:auto;opacity:0;pointer-events:none;transition:opacity .35s ease,transform .45s cubic-bezier(.22,1,.36,1);text-align:center;color:#fff;font-family:"Joes Journey Headline",Georgia,serif;}#jjms-skills.on{opacity:1;pointer-events:auto;transform:translate(-50%,-50%) scale(1);}' +
  '#jjms-skills h3{margin:0 0 18px;font-size:clamp(20px,2.4vw,34px);font-weight:800;}#jjms-skills .skg{display:grid;grid-template-columns:repeat(5,1fr);gap:16px;align-items:end;}@media (max-width:900px){#jjms-skills .skg{grid-template-columns:repeat(2,1fr);}}' +
  '#jjms-skills figure{margin:0;position:relative;}#jjms-skills figure img,#jjms-skills figure video,#jjms-skills figure i{display:block;width:100%;aspect-ratio:9/10;object-fit:cover;border-radius:14px;background:#0b1220;box-shadow:0 20px 50px rgba(0,0,0,.6);}#jjms-skills figure.ph i{border:2px dashed rgba(255,255,255,.35);background:rgba(255,255,255,.06);}' +
  '#jjms-skills figcaption{position:absolute;left:50%;bottom:-14px;translate:-50% 0;white-space:nowrap;padding:.45em 1em;border-radius:999px;background:rgba(9,14,26,.9);border:1px solid rgba(255,255,255,.3);font-size:clamp(11px,.95vw,15px);font-weight:800;letter-spacing:.04em;}' +
  '#jjms-shot{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%) scale(.94);z-index:410;' +
    'width:min(92vw,1180px);opacity:0;pointer-events:none;' +
    'transition:opacity .4s ease,transform .45s cubic-bezier(.2,.8,.25,1);}' +
  '#jjms-shot.on{opacity:1;pointer-events:auto;transform:translate(-50%,-50%) scale(1);}' +
  '#jjms-shot img{display:block;width:100%;max-height:78vh;object-fit:contain;border-radius:12px;' +
    'background:#fff;box-shadow:0 0 70px rgba(255,0,245,.3),0 30px 90px rgba(0,0,0,.7);}' +
  /* a cut-out character: no card behind it, just the sprite and its line */
  '#jjms-shot.plain{width:min(88vw,620px);}' +
  '#jjms-shot.plain img{background:none;border-radius:0;max-height:56vh;width:auto;margin:0 auto;' +
    'box-shadow:none;filter:drop-shadow(0 22px 50px rgba(0,0,0,.7));}' +


  /* clicked film "blows up": scaled + centred by JS, lifted above everything with a pink glow. The
     title + rating are shown in the fixed #jjms-detail panel below it, so the tiny in-poster caption hides. */
  '#jjms .phw.blown .sklmore,#jjms .phw.blown .tmore{display:none!important;}#jjms .phw.blown{z-index:400;transition:transform .6s cubic-bezier(.2,.8,.25,1);}' +
  '#jjms .phw.blown img{opacity:1 !important;scale:1 !important;box-shadow:0 0 70px rgba(255,0,245,.55),0 30px 90px rgba(0,0,0,.7);}' +
  '#jjms .phw.blown .phcap{opacity:0 !important;}' +
  /* ---- the blown-film lightbox: a dimming scrim, a headline title + IMDb-homage rating, a close X ---- */
  /* PERF: this used to carry backdrop-filter:blur(3px), which re-blurs the ENTIRE viewport every frame
     while the lightbox animates in — the cost scales with pixel count, so it is brutal on a Retina
     screen and invisible at 1x. A slightly darker flat scrim reads the same and costs nothing. */
  /* The blown-up film got its pink hue from its own box-shadow, so the collection and video
     lightboxes looked flat next to it. The hue lives on the scrim now, so EVERY lightbox matches. */
  '#jjms-scrim{position:fixed;inset:0;z-index:350;opacity:0;pointer-events:none;transition:opacity .5s ease;' +
    'background:radial-gradient(ellipse 62% 58% at 50% 48%,rgba(255,0,245,.30),rgba(120,60,200,.16) 45%,' +
    'transparent 72%),rgba(6,10,20,.82);}' +
  '#jjms-scrim.on{opacity:1;pointer-events:auto;cursor:pointer;}' +
  /* anchored to the BOTTOM so it grows upward — with a soundtrack player in it the panel is much taller,
     and a top-anchored panel simply ran off the bottom of the screen */
  '#jjms-detail{position:fixed;left:50%;bottom:4vh;transform:translateX(-50%);z-index:410;width:min(90vw,760px);text-align:center;pointer-events:none;opacity:0;transition:opacity .45s ease .12s;}' +
  '#jjms-detail.on{opacity:1;}' +
  '#jjms-detail .jjd-title{font-weight:800;color:#fff;font-size:clamp(24px,3.2vw,44px);line-height:1.08;text-shadow:0 2px 16px rgba(0,0,0,.65);margin:0 0 14px;}' +
  /* IMDb easter egg: the gold star + score/10 in their yellow (#F5C518) — an homage, not the logo */
  '#jjms-detail .jjd-note{margin:-6px 0 14px;font-size:clamp(14px,1.25vw,19px);font-weight:600;line-height:1.45;' +
    'color:rgba(238,242,248,.92);text-shadow:0 2px 12px rgba(0,0,0,.9);max-width:640px;margin-left:auto;margin-right:auto;}' +
  '#jjms-detail .jjd-rate{display:inline-flex;align-items:center;gap:9px;background:rgba(0,0,0,.55);border:1px solid rgba(245,197,24,.55);padding:9px 18px;border-radius:999px;box-shadow:0 6px 22px rgba(0,0,0,.4);}' +
  /* IGN homage for the games: their red, a five-star bar filled to my score — not the logo */
  '#jjms-detail .jjd-ign{display:inline-flex;align-items:center;gap:10px;background:rgba(0,0,0,.6);border:1px solid rgba(225,30,38,.7);padding:8px 18px 8px 8px;border-radius:10px;box-shadow:0 6px 22px rgba(0,0,0,.4);}' +
  '#jjms-detail .jjd-ignb{background:#E11E26;color:#fff;font-weight:900;font-size:15px;letter-spacing:.06em;padding:6px 9px;border-radius:6px;}' +
  '#jjms-detail .jjd-igns{position:relative;display:inline-block;font-size:24px;line-height:1;letter-spacing:3px;color:rgba(255,255,255,.22);}#jjms-detail .jjd-igns::before{content:"\u2605\u2605\u2605\u2605\u2605";}' +
  '#jjms-detail .jjd-igns i{position:absolute;left:0;top:0;height:100%;overflow:hidden;white-space:nowrap;color:#E11E26;font-style:normal;filter:drop-shadow(0 0 8px rgba(225,30,38,.6));}#jjms-detail .jjd-igns i::before{content:"\u2605\u2605\u2605\u2605\u2605";}' +
  '#jjms-detail .jjd-ignn{color:#fff;font-size:24px;font-weight:800;}' +
  '#jjms-detail .jjd-extra{display:flex;justify-content:center;gap:18px;margin:0 0 14px;}#jjms-detail .jjd-extra span{display:flex;flex-direction:column;align-items:center;gap:6px;}' +
  '#jjms-detail .jjd-extra img{height:clamp(70px,11vh,120px);width:auto;border-radius:6px;box-shadow:0 8px 22px rgba(0,0,0,.55);}#jjms-detail .jjd-extra em{font-style:normal;font-size:13px;font-weight:700;opacity:.85;}' +
  '#jjms-detail .jjd-star{color:#F5C518;font-size:27px;line-height:1;filter:drop-shadow(0 0 9px rgba(245,197,24,.6));}' +
  '#jjms-detail .jjd-score{color:#fff;font-size:27px;font-weight:800;letter-spacing:.01em;}' +
  '#jjms-detail .jjd-out{color:rgba(255,255,255,.55);font-size:16px;font-weight:600;margin-left:-3px;}' +
  '#jjms-detail .jjd-src{color:#F5C518;font-size:13px;font-weight:800;letter-spacing:.09em;margin-left:5px;}' +
  /* ---- the Super Reel phone: a reels feed drawn entirely in code ---- */
  '#jjms .srwanda{position:absolute;z-index:3;pointer-events:none;height:auto;}#jjms .srwanda.cast{animation:none;transition:transform 1.1s cubic-bezier(.22,1,.36,1);z-index:7;}@keyframes jjmsWanda{0%,100%{transform:translateY(0) rotate(-3deg);}50%{transform:translateY(-1.6vh) rotate(3deg);}}' +
  /* THE MONITOR (Super Reel): a drawn Figma window. Three pages carry a pulsing arrow; pick one and the canvas shows that
     page's board while the phone shows that feature's screen with one piece missing. Drag the piece across and the
     screen comes alive. Placeholder boards, stills and components until Joe's exports land (2026-09-22). */
  '#jjms .srmon{position:absolute;left:4%;top:61%;width:33vw;z-index:3;font-family:Inter,"Helvetica Neue",Arial,sans-serif;line-height:1.2;color:#ddd;font-size:clamp(7px,.62vw,11px);}' +
  '#jjms .srmon .mscreen{position:relative;aspect-ratio:16/10;border-radius:1.1vw;background:#1e1e1e;border:.45vw solid #2b2f3a;box-shadow:0 30px 60px rgba(0,0,0,.6),inset 0 0 0 1px rgba(255,255,255,.06);overflow:hidden;display:grid;grid-template-columns:24% 1fr 20%;}' +
  '#jjms .srmon .mstand{width:22%;height:1.6vw;margin:0 auto;background:linear-gradient(#2b2f3a,#151821);clip-path:polygon(18% 0,82% 0,100% 100%,0 100%);}#jjms .srmon .mbase{width:40%;height:.5vw;margin:0 auto;border-radius:999px;background:#2b2f3a;}' +
  '#jjms .srmon .mtop{position:absolute;left:0;right:0;top:0;height:9%;background:#2c2c2c;border-bottom:1px solid #3a3a3a;display:flex;align-items:center;gap:.5em;padding:0 .9em;font-weight:600;color:#eee;z-index:2;}#jjms .srmon .mtop i{width:.9em;height:.9em;border-radius:50%;background:#ff5f57;}#jjms .srmon .mtop i+i{background:#febc2e;}#jjms .srmon .mtop i+i+i{background:#28c840;margin-right:.6em;}' +
  '#jjms .srmon .mpages{padding:11% .6em 0;background:#2c2c2c;border-right:1px solid #3a3a3a;overflow:hidden;}#jjms .srmon .mpages h6{margin:.9em 0 .3em;font-size:.85em;color:#8a8a8a;font-weight:500;letter-spacing:.04em;}' +
  '#jjms .srmon .pg{position:relative;display:block;padding:.28em .5em .28em 1.2em;border-radius:.4em;color:#cfcfcf;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}#jjms .srmon .pg::before{content:"";position:absolute;left:.35em;top:50%;width:.35em;height:.35em;translate:0 -50%;border-radius:1px;background:#6b6b6b;}' +
  '#jjms .srmon .pg.xen{color:#8f8f8f;letter-spacing:.06em;font-size:.95em;}#jjms .srmon .pg.hot{cursor:pointer;color:#fff;font-weight:600;}#jjms .srmon .pg.hot:hover,#jjms .srmon .pg.on{background:rgba(255,0,245,.22);}#jjms .srmon .pg.done::after{content:"\2713";position:absolute;right:.5em;color:#39e28a;font-weight:800;}' +
  '#jjms .srmon .pg .parr{position:absolute;right:.4em;top:50%;translate:0 -50%;width:1.6em;height:1.6em;border-radius:50%;background:#FF00F5;color:#fff;font-size:1em;line-height:1.6em;text-align:center;font-weight:900;animation:jjmsParr 1.1s ease-in-out infinite;}#jjms .srmon .pg.done .parr{display:none;}@keyframes jjmsParr{0%,100%{translate:0 -50%;}50%{translate:-.5em -50%;}}' +
  '#jjms .srmon .mcanvas{position:relative;padding-top:9%;background:#1e1e1e;overflow:hidden;}#jjms .srmon .mcanvas::before{content:"";position:absolute;inset:9% 0 0;background-image:radial-gradient(rgba(255,255,255,.07) 1px,transparent 1px);background-size:1.2vw 1.2vw;}' +
  '#jjms .srmon .mboard{position:absolute;inset:24% 8% 8%;border-radius:.6em;background:#0f0f10;border:1px solid #333;padding:1.1em 1.2em;opacity:0;transition:opacity .45s ease,transform .5s cubic-bezier(.22,1,.36,1);transform:translateY(6px) scale(.97);}#jjms .srmon .mboard.on{opacity:1;transform:none;}' +
  '#jjms .srmon .mboard small{display:block;font-size:.8em;letter-spacing:.14em;color:#aaa;font-weight:700;}#jjms .srmon .mboard b{display:block;font-size:1.7em;color:#fff;font-weight:800;margin:.15em 0 .1em;}#jjms .srmon .mboard em{display:block;font-style:normal;color:#9a9a9a;font-size:.9em;}#jjms .srmon .mboard .mrule{height:1px;background:#333;margin:1em 0;}' +
  '#jjms .srmon .mboard .mph{position:absolute;right:1.2em;top:1.1em;width:22%;aspect-ratio:1.3;border:2px solid #fff;border-radius:.2em;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1.6em;color:#fff;}' +
  '#jjms .srmon .mprops{padding:11% .7em 0;background:#2c2c2c;border-left:1px solid #3a3a3a;color:#bbb;}#jjms .srmon .mprops p{margin:.5em 0;height:.55em;border-radius:2px;background:#3d3d3d;}#jjms .srmon .mprops p.w{width:55%;}#jjms .srmon .mprops h6{margin:.6em 0 .3em;font-size:.85em;color:#eee;font-weight:600;}' +
  '#jjms .srmon .mhint{position:absolute;left:24%;right:20%;top:9%;padding:.5em .8em;text-align:center;font-family:"Joes Journey Headline",Georgia,serif;font-size:clamp(9px,.8vw,13px);font-weight:700;color:#fff;background:rgba(255,0,245,.18);border-bottom:1px solid rgba(255,0,245,.35);z-index:2;}#jjms .srmon .mhint b{color:#ff8df9;}' +
  /* the piece to carry: dashed halo, a "Drag me" tab, the drag cursor */
  '#jjms .comp{position:absolute;left:1.2em;bottom:1.2em;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;z-index:3;}#jjms .comp::before{content:"";position:absolute;inset:-.55em;border:2px dashed #FF00F5;border-radius:.6em;animation:jjmsCompHalo 1.4s ease-in-out infinite;}@keyframes jjmsCompHalo{0%,100%{opacity:.55;inset:-.55em;}50%{opacity:1;inset:-.8em;}}' +
  '#jjms .comp .ctab{position:absolute;left:50%;bottom:calc(100% + .9em);translate:-50% 0;white-space:nowrap;padding:.3em .8em;border-radius:999px;background:#FF00F5;color:#fff;font-weight:800;font-size:.95em;animation:jjmsCtab 1.2s ease-in-out infinite;}#jjms .comp .ctab::after{content:"";position:absolute;left:50%;top:100%;translate:-50% 0;border:.4em solid transparent;border-top-color:#FF00F5;}@keyframes jjmsCtab{0%,100%{translate:-50% 0;}50%{translate:-50% -.35em;}}' +
  '#jjms .comp.taken{opacity:.25;pointer-events:none;}#jjms .comp.taken::before,#jjms .comp.taken .ctab{display:none;}' +
  /* the three component drawings (shared by the canvas, the drag ghost and the phone) */
  '#jjms .cstack{display:flex;flex-direction:column;gap:.55em;align-items:center;color:#fff;font-size:.8em;text-align:center;}#jjms .cstack i{display:block;width:2.2em;height:2.2em;border-radius:50%;background:#fff;color:#111;font-style:normal;font-weight:900;line-height:2.2em;font-size:1em;}#jjms .cstack span{display:block;line-height:1.05;}' +
  '#jjms .ctile{width:9em;border-radius:.7em;overflow:hidden;background:#181820;border:1px solid #333;}#jjms .ctile i{display:block;height:4.6em;background:linear-gradient(160deg,#26d7e8,#1273d8 60%,#0b3f8f);}#jjms .ctile b{display:inline-block;margin:.5em .6em .1em;padding:.15em .55em;border-radius:.3em;background:#ffd1e8;color:#3a0b2a;font-size:.8em;font-weight:800;}#jjms .ctile span{display:block;margin:0 .6em .6em;color:#ddd;font-size:.8em;}' +
  '#jjms .csearch{display:flex;align-items:center;gap:.5em;width:12em;padding:.55em .8em;border-radius:999px;background:#fff;color:#444;font-size:.9em;box-shadow:0 4px 14px rgba(0,0,0,.35);}#jjms .csearch i{width:.9em;height:.9em;border:2px solid #FF00F5;border-radius:50%;flex:0 0 auto;}' +
  '#jjms-sdim{position:fixed;inset:-10%;z-index:950;pointer-events:none;opacity:0;transition:opacity .35s ease;background:radial-gradient(ellipse 75% 75% at 50% 50%,rgba(3,5,12,.6),rgba(3,5,12,.84));}html.jjms-sdrag #jjms-sdim{opacity:1;}html.jjms-sdrag #jjms .srmon,html.jjms-sdrag #jjms .srphone{z-index:955;}html.jjms-sdrag #jjms .srscr.on .slot{outline:2px solid #FF00F5;outline-offset:3px;background-color:rgba(255,0,245,.2);box-shadow:0 0 22px 6px rgba(255,0,245,.75);animation:jjSlotGlow 1s ease-in-out infinite alternate;}@keyframes jjSlotGlow{to{box-shadow:0 0 34px 12px rgba(255,0,245,.95);}}html.jjms-sdrag #jjms .srphone{filter:drop-shadow(0 0 26px rgba(255,0,245,.45));}#jjms .sdrag{position:fixed;left:0;top:0;z-index:960;pointer-events:none;font-size:clamp(7px,.62vw,11px);filter:drop-shadow(0 12px 24px rgba(0,0,0,.5));transition:transform .5s cubic-bezier(.22,1,.36,1);}#jjms .sdrag.fly{transition:transform .6s cubic-bezier(.3,.7,.3,1),opacity .2s ease .5s;}' +
  /* the phone: a still per page with one dotted slot; done, the feed comes alive */
  '#jjms .srscr{position:absolute;inset:0;z-index:4;opacity:0;pointer-events:none;transition:opacity .4s ease;font-size:clamp(6px,.55vw,10px);color:#fff;background:#0d1020;}#jjms .srphone.pg .srscr.on{opacity:1;pointer-events:auto;}#jjms .srphone.pg .srrail,#jjms .srphone.pg .srsearch{opacity:0;}' +
  '#jjms .srscr .sbar{position:absolute;left:8%;right:8%;top:6%;height:2.2%;border-radius:999px;background:rgba(255,255,255,.2);}#jjms .srscr .sbar::after{content:"";position:absolute;left:0;top:0;bottom:0;width:40%;border-radius:999px;background:#fff;}' +
  '#jjms .srscr .sbg{position:absolute;inset:0;background:linear-gradient(168deg,#26d7e8,#1273d8 62%,#0b3f8f);}#jjms .srscr[data-pg="trip"] .sbg{background:linear-gradient(180deg,#16192b,#0d1020);}#jjms .srscr[data-pg="wanda"] .sbg{background:linear-gradient(180deg,#2a0f3d,#0d1020 70%);}' +
  '#jjms .srscr .stxt{position:absolute;left:6%;right:30%;bottom:16%;}#jjms .srscr .stxt b{display:inline-block;padding:.15em .55em;border-radius:.3em;background:#ffd1e8;color:#3a0b2a;font-size:1em;font-weight:800;}#jjms .srscr .stxt span{display:block;margin-top:.5em;font-size:.95em;line-height:1.25;}#jjms .srscr .srow{position:absolute;left:6%;right:6%;height:14%;border-radius:.8em;background:rgba(255,255,255,.08);}#jjms .srscr .srow em{position:absolute;left:1em;top:.7em;font-style:normal;font-size:.9em;color:#bbb;}' +
  '#jjms .srscr .sw{position:absolute;left:10%;right:10%;top:14%;text-align:center;font-weight:800;font-size:1.3em;}#jjms .srscr .sw span{display:block;margin-top:.6em;font-weight:500;font-size:.72em;color:#d8c8ff;line-height:1.3;}' +
  '#jjms .srscr .slot{position:absolute;border:2px dashed rgba(255,255,255,.85);border-radius:.8em;background:rgba(255,0,245,.14);display:flex;align-items:center;justify-content:center;text-align:center;font-weight:800;font-size:.9em;line-height:1.1;animation:jjmsSlot 1.3s ease-in-out infinite;}@keyframes jjmsSlot{0%,100%{background:rgba(255,0,245,.12);box-shadow:0 0 0 0 rgba(255,0,245,.0);}50%{background:rgba(255,0,245,.3);box-shadow:0 0 0 .5em rgba(255,0,245,.18);}}' +
  '#jjms .srscr .slot.over{background:rgba(57,226,138,.3);border-color:#39e28a;animation:none;}#jjms .srscr.done .slot{border-color:transparent;background:none;animation:none;box-shadow:none;}#jjms .srscr.done .slot .drop{display:none;}' +
  '#jjms .srscr .slot > .cstack,#jjms .srscr .slot > .ctile,#jjms .srscr .slot > .csearch{animation:jjmsLand .5s cubic-bezier(.34,1.56,.64,1) both;}@keyframes jjmsLand{from{transform:scale(1.3);}to{transform:scale(1);}}' +
  '#jjms .srscr .live{position:absolute;left:8%;top:9%;padding:.2em .6em;border-radius:.3em;background:#ff2d55;color:#fff;font-size:.8em;font-weight:900;letter-spacing:.1em;opacity:0;}#jjms .srscr.done .live{opacity:1;animation:jjmsLive 1s ease-in-out infinite alternate;}@keyframes jjmsLive{to{opacity:.55;}}' +
  '#jjms .srscr.done .sbg{animation:jjmsScrPlay 6s linear infinite;}@keyframes jjmsScrPlay{0%{filter:hue-rotate(0deg) brightness(1);}50%{filter:hue-rotate(40deg) brightness(1.08);}100%{filter:hue-rotate(0deg) brightness(1);}}' +
  '#jjms .step.srp{--figw:min(64vw,82vh);--figh:calc(var(--figw) / 3.65);--figt:max(116px,11.5vh);--sph:clamp(150px,min(25.5vh,calc(100vh - 600px)),275px);justify-content:flex-start;}#jjms .step.srp > .cap{margin-top:calc(var(--figt) + var(--figh) + var(--srgap,2.8vh));}#jjms .step.srp > .sub{margin-top:.3em;font-size:clamp(15px,min(1.55vw,2.4vh),26px);}#jjms .step.srp > .myhint{margin-top:8px;}#jjms .step.srp .srmon{left:50%;top:var(--figt);width:var(--figw);margin-left:calc(var(--figw) / -2);rotate:-.7deg;container-type:inline-size;font-size:inherit;}#jjms .step.srp .srmon .mscreen{aspect-ratio:auto;height:var(--figh);font-size:1.06cqw;border-radius:1.1em;border-width:max(3px,.4em);box-sizing:border-box;grid-template-columns:29% 1fr 16.5%;grid-template-rows:100%;}#jjms .step.srp .srmon .mtop{height:2.3em;}#jjms .step.srp .srmon .mpages{padding:2.8em .6em .4em;}#jjms .step.srp .srmon .mcols{columns:1;}#jjms .step.srp .srmon .mpages{text-align:left;}#jjms .step.srp .srmon .mpages h6{margin:.15em 0 .25em;white-space:nowrap;break-after:avoid;}#jjms .step.srp .srmon .pg{padding:.2em .5em .2em 1.2em;break-inside:avoid;overflow:visible;text-overflow:clip;}#jjms .step.srp .srmon .pg.hot{padding-right:2.3em;}#jjms .step.srp .srmon .pg.hot{font-size:1.28em;font-weight:700;color:#fff;margin:.18em 0;}#jjms .step.srp .srmon .pg.hot.seen:not(.on){color:#d9d9d9;}#jjms .step.srp .srmon .pg.hot.seen .parr,#jjms .step.srp .srmon .pg.hot.on .parr{display:none;}#jjms .step.srp .srmon .pg.hot.on{background:rgba(255,0,245,.3);box-shadow:inset .22em 0 0 #FF00F5;}#jjms .step.srp .srmon .pg.hot .parr{font-size:.8em;}#jjms .step.srp .srmon .mboard:not(.on){display:none;}#jjms .step.srp .srmon .mboard.on{animation:jjSrPg .4s cubic-bezier(.22,1,.36,1);}@keyframes jjSrPg{from{opacity:0;translate:0 6px;}to{opacity:1;translate:0 0;}}#jjms .step.srp .srmon .mcanvas{padding-top:0;}#jjms .step.srp .srmon .mcanvas::before{inset:2.3em 0 0;}#jjms .step.srp .srmon .mhint{left:0;right:0;top:2.3em;font-size:1.2em;padding:.35em .8em;}#jjms .step.srp .srmon .mboards{position:absolute;left:1.3em;right:1.3em;top:5.3em;bottom:1.1em;display:flex;gap:1.2em;}#jjms .step.srp .srmon .mboard{position:relative;inset:auto;flex:1 1 0;min-width:0;display:flex;flex-direction:column;box-sizing:border-box;padding:.8em 1em .9em;opacity:1;transform:none;transition:border-color .3s ease,box-shadow .3s ease;}#jjms .step.srp .srmon .mboard.on{border-color:rgba(255,0,245,.7);box-shadow:0 0 0 1px rgba(255,0,245,.35),0 0 1.4em rgba(255,0,245,.25);}#jjms .step.srp .srmon .mboard b{font-size:1.45em;padding-right:5em;}#jjms .step.srp .srmon .mboard em{padding-right:5.5em;}#jjms .step.srp .srmon .mboard .mph{right:1em;top:.9em;width:auto;height:2.6em;aspect-ratio:1.3;font-size:1.2em;}#jjms .step.srp .srmon .mboard .mrule{margin:.7em 0 .8em;}#jjms .step.srp .srmon .comp{position:relative;left:auto;bottom:auto;align-self:flex-start;margin:auto 0 .2em .5em;}#jjms .step.srp .srmon .comp .ctab{left:-.4em;bottom:calc(100% + .8em);translate:0 0;animation:jjSrTab 1.2s ease-in-out infinite;opacity:0;transition:opacity .25s ease;}#jjms .step.srp .srmon .mboard:hover .ctab,#jjms .step.srp .srmon .mboard.on .ctab{opacity:1;}#jjms .step.srp .srmon .comp .ctab::after{left:1.4em;translate:0 0;}@keyframes jjSrTab{0%,100%{translate:0 0;}50%{translate:0 -.3em;}}#jjms .step.srp .mboard .cstack{flex-direction:row;align-items:flex-start;gap:.9em;}#jjms .step.srp .srmon .mprops{padding:2.8em .7em 0;}#jjms .step.srp .srphones{position:absolute;left:50%;bottom:max(136px,15vh);translate:-50% 0;display:flex;align-items:flex-end;gap:clamp(22px,3.4vw,64px);z-index:3;}#jjms .step.srp .srphones .srphone{position:relative;left:auto;top:auto;height:var(--sph);width:calc(var(--sph) * 9 / 19);rotate:var(--r);cursor:default;animation:jjSrFloat 5.6s ease-in-out var(--fd) infinite;transition:filter .3s ease;}@keyframes jjSrFloat{0%,100%{translate:0 0;}50%{translate:0 -1.1vh;}}#jjms .step.srp .srphones .srscr{opacity:1;pointer-events:auto;font-size:calc(var(--sph) / 26);}#jjms .step.srp .srphones .srscr .drop{font-size:1.05em;}#jjms .step.srp .srphones .srwanda{right:calc(100% + 1.2vw);left:auto;top:auto;bottom:6%;width:calc(var(--sph) * .6);}#jjms .step.srp .srphone.hint .srclip{filter:drop-shadow(0 18px 40px rgba(0,0,0,.7)) drop-shadow(0 0 26px rgba(255,0,245,.5));}html.jjms-sdrag #jjms .step.srp .srphones{z-index:955;}html.jjms-sdrag #jjms .step.srp .srphone{filter:none;}html.jjms-sdrag #jjms .step.srp .srwanda{filter:brightness(.35) saturate(.5);}html.jjms-sdrag #jjms .step.srp .srphone.nope{filter:brightness(.4) saturate(.45);}html.jjms-sdrag #jjms .step.srp .srphone.want{z-index:2;}html.jjms-sdrag #jjms .step.srp .srphone.want .srclip{transform:translateY(-14px) scale(1.1);filter:drop-shadow(0 24px 52px rgba(0,0,0,.75)) drop-shadow(0 0 42px rgba(255,0,245,.75));}html.jjms-sdrag #jjms .step.srp .srphone.want .slot{outline:2px solid #FF00F5;outline-offset:3px;background-color:rgba(255,0,245,.24);box-shadow:0 0 22px 6px rgba(255,0,245,.75);animation:jjSlotGlow .8s ease-in-out infinite alternate;}#jjms .step.srp .srphone.want .slot.over{background:rgba(57,226,138,.32);border-color:#39e28a;outline-color:#39e28a;box-shadow:0 0 26px 8px rgba(57,226,138,.6);}#jjms .sdrag.shake > *{animation:jjSdShake .42s ease both;}#jjms .step.srp .srphone.bump .srclip{animation:jjSdShake .42s ease both;}@keyframes jjSdShake{20%{translate:-8px 0;}40%{translate:7px 0;}60%{translate:-5px 0;}80%{translate:2px 0;}}@media (max-aspect-ratio:1/1){#jjms .step.srp{--figw:84vw;--figh:calc(var(--figw) / 2.05);--sph:clamp(150px,22vh,250px);}#jjms .step.srp .srmon .mscreen{font-size:1.3cqw;grid-template-columns:34% 1fr;}#jjms .step.srp .srmon .mprops{display:none;}#jjms .step.srp .srmon .mboards{top:6.4em;}#jjms .step.srp .srmon .mboard b,#jjms .step.srp .srmon .mboard em{padding-right:0;}#jjms .step.srp .srmon .mboard .mph{display:none;}#jjms .step.srp .mboard .cstack{flex-direction:column;align-items:center;gap:.5em;}#jjms .step.srp .srmon .comp .ctab{display:none;}}@media (max-width:767px){#jjms .step.srp{--figw:94vw;--figh:calc(var(--figw) / 1.8);--figt:max(84px,11vh);--sph:clamp(112px,min(20vh,calc(100vh - 610px)),180px);}#jjms .step.srp .srmon .mscreen{font-size:2.25cqw;grid-template-columns:1fr;}#jjms .step.srp .srmon .mpages{display:none;}#jjms .step.srp .srmon .mhint{font-size:1.05em;}#jjms .step.srp .srmon .mboards{left:.7em;right:.7em;top:5.4em;gap:.6em;}#jjms .step.srp .srmon .mboard{padding:.6em .6em .7em;}#jjms .step.srp .srmon .mboard em{display:none;}#jjms .step.srp .srmon .mboard b{font-size:1.2em;}#jjms .step.srp .mboard .cstack{flex-direction:row;align-items:flex-start;gap:.5em;}#jjms .step.srp .mboard .cstack span{display:none;}#jjms .step.srp .srphones{gap:5vw;}#jjms .step.srp .srphones .srwanda{display:none;}#jjms .step.srp > .cap{margin-top:calc(var(--figt) + var(--figh) + var(--srgap,2.4vh));}#jjms .step.srp > .sub{font-size:clamp(13px,3.8vw,16px);}}' +
  '#jjms .srphone{position:absolute;z-index:3;cursor:pointer;line-height:0;' +
    'animation:jjPhoneDrift 13.5s ease-in-out infinite;}' +
  '#jjms .srclip{display:block;position:relative;overflow:hidden;aspect-ratio:9/19;border-radius:14%/6.6%;' +
    'border:3px solid #10141f;background:#10141f;box-sizing:border-box;' +
    'filter:drop-shadow(0 18px 40px rgba(0,0,0,.7));transition:transform .35s cubic-bezier(.2,.8,.25,1),filter .35s ease;}' +
  '#jjms .srphone:hover .srclip{transform:translateY(-8px) scale(1.05);' +
    'filter:drop-shadow(0 24px 52px rgba(0,0,0,.75)) drop-shadow(0 0 50px rgba(255,0,245,.42));}' +
  '#jjms .srphone:active .srclip{transform:translateY(-4px) scale(.99);}' +
  /* 5 cards (the 5th repeats the 1st) slide up one screen at a time; holds between slides */
  '#jjms .srtrack{position:absolute;inset:0;height:500%;display:flex;flex-direction:column;' +
    'animation:jjsrFeed 17s cubic-bezier(.7,0,.25,1) infinite;will-change:transform;}#jjms .srtrack.js{animation:none;transition:transform .55s cubic-bezier(.7,0,.25,1);}' +
  '#jjms .srphone{touch-action:none;}#jjms .srclip{z-index:3;}' +
  '#jjms .srpeek{position:absolute;z-index:2;width:44%;top:50%;opacity:0;pointer-events:none;transition:translate .5s cubic-bezier(.34,1.56,.64,1),opacity .25s ease;}#jjms .srpeek img{display:block;width:100%;height:auto;filter:drop-shadow(0 6px 12px rgba(0,0,0,.6));}' +
  '#jjms .srpeek.l{left:0;translate:10% 0;rotate:-12deg;}#jjms .srpeek.r{right:0;top:28%;translate:-10% 0;rotate:12deg;scale:-1 1;}#jjms .srpeek.l.on{opacity:1;translate:-62% 0;}#jjms .srpeek.r.on{opacity:1;translate:62% 0;}' +
  '#jjms .srpeek.duck{transition:translate .18s ease-in,opacity .15s ease;}' +
  '#jjms .srq{font-style:normal;font-size:clamp(9px,.8vw,13px);margin-left:5%;white-space:nowrap;overflow:hidden;color:#fff;}#jjms .srq.no{color:#FF8FA3;}' +
  '@keyframes jjsrFeed{0%,21%{transform:translateY(0);}25%,46%{transform:translateY(-20%);}' +
    '50%,71%{transform:translateY(-40%);}75%,96%{transform:translateY(-60%);}100%{transform:translateY(-80%);}}' +
  '#jjms .srcard{position:relative;display:block;width:100%;height:20%;}' +
  '#jjms .srcard svg{position:absolute;inset:0;width:100%;height:100%;}' +
  /* the pink progress line, refilling once per reel */
  '#jjms .srbar{position:absolute;left:6%;right:6%;top:4.2%;height:3px;border-radius:2px;' +
    'background:rgba(255,255,255,.28);overflow:hidden;}' +
  '#jjms .srbar i{position:absolute;inset:0;transform-origin:left center;background:#FF00F5;' +
    'animation:jjsrBar 4.25s linear infinite;}' +
  '@keyframes jjsrBar{from{transform:scaleX(0);}to{transform:scaleX(1);}}' +
  '#jjms .srrail{position:absolute;right:5%;bottom:14%;display:flex;flex-direction:column;gap:14%;}' +
  '#jjms .sric{display:block;width:1.55vw;min-width:16px;aspect-ratio:1;color:rgba(255,255,255,.9);}' +
  '#jjms .sric svg{width:100%;height:100%;fill:currentColor;filter:drop-shadow(0 2px 6px rgba(0,0,0,.5));}' +
  '#jjms .srsearch{position:absolute;left:6%;bottom:3.4%;width:56%;height:6.4%;border-radius:999px;' +
    'background:rgba(10,14,26,.62);border:1px solid rgba(255,255,255,.35);display:flex;align-items:center;' +
    'padding-left:8%;box-sizing:border-box;color:rgba(255,255,255,.85);}' +
  '#jjms .srsearch svg{width:38%;height:52%;}' +
  '#jjms .srnotch{position:absolute;left:50%;top:1.6%;width:34%;height:2.6%;transform:translateX(-50%);' +
    'border-radius:999px;background:#10141f;}' +
  /* the double-tap heart, reel-style */
  '#jjms .srheart{position:absolute;width:34%;aspect-ratio:1;transform:translate(-50%,-50%) scale(.3);' +
    'pointer-events:none;color:#FF00F5;opacity:0;animation:jjsrHeart .9s cubic-bezier(.2,.8,.3,1) forwards;}' +
  '#jjms .srheart svg{width:100%;height:100%;fill:currentColor;filter:drop-shadow(0 0 18px rgba(255,0,245,.8));}' +
  '@keyframes jjsrHeart{12%{opacity:1;transform:translate(-50%,-50%) scale(1.15);}' +
    '30%{transform:translate(-50%,-50%) scale(.95);}55%{opacity:1;}' +
    '100%{opacity:0;transform:translate(-50%,-62%) scale(1.05);}}' +
  /* ---- the tease: the bang dies, the darkness asks a question ---- */
  '#jjms-tease{position:fixed;inset:0;z-index:411;display:flex;align-items:center;justify-content:center;' +
    'background:radial-gradient(ellipse at 50% 46%,rgba(12,8,20,.88) 0%,rgba(4,6,12,.97) 70%);' +
    'opacity:0;pointer-events:none;transition:opacity .5s ease;cursor:pointer;}' +
  '#jjms-tease.on{opacity:1;pointer-events:auto;}' +
  '#jjms-tease .tline{position:relative;max-width:92vw;text-align:center;font-weight:800;' +
    'font-size:clamp(26px,3.6vw,54px);color:#fff;line-height:1.25;}' +
  '#jjms-tease .tw{display:inline-block;white-space:nowrap;margin:0 .14em;}' +
  '#jjms-tease .tch{display:inline-block;opacity:0;will-change:transform,opacity,filter;' +
    'text-shadow:0 0 18px rgba(255,0,245,.55),0 2px 18px rgba(0,0,0,.8);' +
    'animation:jjtFly .8s cubic-bezier(.22,1.4,.36,1) var(--d,0s) both;}' +
  '@keyframes jjtFly{0%{opacity:0;transform:translate3d(var(--fx),var(--fy),0) rotate(var(--fr)) scale(var(--fs));filter:blur(12px);}' +
    '55%{opacity:1;filter:blur(0);}78%{transform:translate3d(0,0,0) rotate(0deg) scale(1.14);}' +
    '100%{opacity:1;transform:none;filter:none;}}' +
  /* the name arrives from orbit, huge, and slams */
  '#jjms-tease .tch.tj{color:#FFC93D;text-shadow:0 0 26px rgba(255,201,61,.8),0 0 60px rgba(255,176,31,.4),0 2px 18px rgba(0,0,0,.8);' +
    'animation-name:jjtSlam;animation-duration:.6s;animation-timing-function:cubic-bezier(.3,0,.3,1.4);}' +
  '@keyframes jjtSlam{0%{opacity:0;transform:translate3d(0,-120vh,0) scale(6) rotate(22deg);filter:blur(10px);}' +
    '62%{opacity:1;transform:translate3d(0,0,0) scale(.9) rotate(-3deg);filter:none;}' +
    '82%{transform:scale(1.16) rotate(1deg);}100%{opacity:1;transform:scale(1) rotate(0deg);}}' +
  '#jjms-tease .tch.td{animation-name:jjtDot;animation-duration:.34s;}' +
  '@keyframes jjtDot{0%{opacity:0;transform:scale(3.4);}55%{opacity:1;transform:scale(.75);}100%{opacity:1;transform:scale(1);}}' +
  '#jjms-tease .tline.pulse{animation:jjtPulse .55s ease;}' +
  '@keyframes jjtPulse{35%{scale:1.07;}70%{scale:.99;}100%{scale:1;}}' +
  '#jjms-tease .tline.suck{animation:jjtSuck .42s cubic-bezier(.5,0,.9,.4) both;}' +
  '@keyframes jjtSuck{to{opacity:0;scale:2.3;filter:blur(18px);}}' +
  '#jjms-tease.shake .tline{animation:jjtQuake .45s ease;}' +
  '@keyframes jjtQuake{20%{translate:-9px 3px;}45%{translate:8px -3px;}65%{translate:-5px 2px;}85%{translate:2px -1px;}100%{translate:0 0;}}' +
  '#jjms-tease .tshock{position:absolute;left:50%;top:50%;width:46vmax;height:46vmax;margin:-23vmax 0 0 -23vmax;' +
    'border-radius:50%;border:3px solid rgba(255,201,61,.75);box-shadow:0 0 60px rgba(255,0,245,.4),inset 0 0 60px rgba(255,201,61,.3);' +
    'opacity:0;scale:.08;pointer-events:none;}' +
  '#jjms-tease .tshock.go{animation:jjtShock .8s cubic-bezier(.2,.6,.35,1) both;}' +
  '@keyframes jjtShock{0%{opacity:.95;scale:.08;}100%{opacity:0;scale:1;}}' +
  '#jjms-tease .tskip{position:absolute;bottom:5vh;left:0;right:0;text-align:center;white-space:nowrap;font-size:12.5px;font-weight:600;' +
    'letter-spacing:.03em;text-transform:none;color:rgba(238,242,248,.45);opacity:0;animation:jjmsFc .6s ease 1.6s both;}' +
  /* ---- the History Exam ---- */
  /* THE EXAM CTA IS THE REPLAY STORYTIME BANNER (Joe, 2026-09-30: "do the history exam CTA like the replay storytime one"): Storytime's own
     stone-framed parchment (story-banner.webp, the same file and query, so it is already cached) with its blue J ribbons, a purple/gold glow
     and rim behind it, runes inscribed either side, the words written in letter by letter with a spark of light and then a slow shine,
     runes and sparks orbiting it (the far half passes behind the scroll), faster on hover; it grows from its centre on hover and bursts
     when pressed. Reduced motion: the words simply fade up. Only transform / opacity animate; every glow is a radial gradient. */
  '#jjms .fexw{display:flex;flex-direction:column;align-items:center;margin-top:clamp(18px,3vh,32px);}' +
  '#jjms .fexw .fqk{margin:0 0 .5em;font-size:clamp(13px,1vw,16px);font-weight:600;color:rgba(238,242,248,.72);opacity:0;}' +
  '#jjms .finale.go .fexw .fqk{animation:jjmsFc .8s ease 3.3s both;}' +
  '#jjms .fquiz{position:relative;display:block;width:min(88vw,620px);aspect-ratio:1295 / 200;padding:0;margin:0;border:0;background:none;color:#3a0f63;font:inherit;cursor:pointer;isolation:isolate;opacity:0;outline:none;transition:scale .4s cubic-bezier(.22,1,.36,1);}' +
  '#jjms .finale.go .fquiz{animation:jjmsDp .8s cubic-bezier(.34,1.56,.64,1) 3.35s both;}#jjms .fquiz.hot{scale:1.04;}#jjms .fquiz.down{scale:.98;transition-duration:.12s;}' +
  '#jjms .fquiz > i,#jjms .fquiz > span{position:absolute;pointer-events:none;}' +
  '#jjms .fquiz .xban{inset:0;z-index:1;background:url(' + SB + 'story-banner.webp?a=6) no-repeat center/contain;}' +
  '#jjms .fquiz .xglow{inset:-110% -10%;z-index:-1;background:radial-gradient(closest-side,rgba(165,80,255,.7),rgba(130,55,230,.4) 34%,rgba(255,180,70,.15) 64%,rgba(255,180,70,0) 100%);opacity:0;transition:opacity 1.4s ease;}' +
  '#jjms .fquiz .xrim{inset:0;z-index:0;filter:blur(clamp(5px,.8vw,12px));scale:1.035 1.14;opacity:0;transition:opacity 1.6s ease .2s;}#jjms .fquiz .xrim i{position:absolute;inset:0;background:linear-gradient(90deg,#b46bff,#ffd36b 28%,#ff8af0 50%,#ffd36b 72%,#b46bff);-webkit-mask:url(' + SB + 'story-banner.webp?a=6) no-repeat center/contain;mask:url(' + SB + 'story-banner.webp?a=6) no-repeat center/contain;}' +
  '#jjms .fquiz.lit .xglow{opacity:.8;animation:jjXGlow 3.4s ease-in-out infinite;}#jjms .fquiz.lit .xrim{opacity:.95;animation:jjXRim 2.6s ease-in-out infinite;}#jjms .fquiz.hot .xglow{opacity:1;animation-duration:1.6s;}#jjms .fquiz.hot .xrim{animation-duration:1.1s;}' +
  '@keyframes jjXGlow{0%,100%{scale:1;}50%{scale:1.07 1.16;}}@keyframes jjXRim{0%,100%{opacity:.7;}50%{opacity:1;}}' +
  '#jjms .fquiz .xsheen{inset:14% 11%;z-index:2;-webkit-mask:linear-gradient(90deg,transparent,#000 18%,#000 82%,transparent);mask:linear-gradient(90deg,transparent,#000 18%,#000 82%,transparent);background:radial-gradient(closest-side,rgba(255,236,170,.8),rgba(255,214,140,.45) 40%,rgba(214,150,255,.3) 70%,rgba(214,150,255,0) 100%);mix-blend-mode:screen;opacity:0;transition:opacity 1.4s ease .25s;}' +
  '#jjms .fquiz.lit .xsheen{opacity:.8;animation:jjXSheen 3.4s ease-in-out infinite;}#jjms .fquiz.hot .xsheen{animation-duration:1.6s;}@keyframes jjXSheen{0%,100%{opacity:.62;scale:1;}50%{opacity:.95;scale:1.05 1.12;}}' +
  '#jjms .fquiz .xtint{inset:6% 12% 12%;z-index:2;-webkit-mask:linear-gradient(90deg,transparent,#000 22%,#000 78%,transparent);mask:linear-gradient(90deg,transparent,#000 22%,#000 78%,transparent);background:radial-gradient(closest-side,rgba(150,80,230,0) 30%,rgba(150,80,230,.22) 60%,rgba(125,55,215,.34) 80%,rgba(125,55,215,0) 100%);mix-blend-mode:multiply;opacity:0;transition:opacity 1.6s ease .1s;}#jjms .fquiz.lit .xtint{opacity:1;}' +
  '#jjms .fquiz .xins{top:50%;z-index:3;translate:0 -50%;font-size:clamp(9px,.9vw,15px);letter-spacing:.45em;white-space:nowrap;color:#a0661d;}#jjms .fquiz .xins.l{left:18%;}#jjms .fquiz .xins.r{right:17.5%;}#jjms .fquiz .xins i{font-style:normal;display:inline-block;opacity:0;}' +
  '#jjms .fquiz.in .xins i{animation:jjXIns .9s ease-out calc(400ms + var(--i) * 240ms) forwards,jjXFlick 2.8s ease-in-out calc(1400ms + var(--i) * 370ms) infinite;}#jjms .fquiz.hot.in .xins i{animation-duration:.9s,1s;}' +
  '@keyframes jjXIns{0%{opacity:0;color:#fff4c8;text-shadow:0 0 .8em #ffd36b,0 0 1.6em rgba(190,110,255,.95);}100%{opacity:.85;color:#a0661d;text-shadow:0 0 .35em rgba(255,200,90,.9),0 0 .8em rgba(190,110,255,.5);}}@keyframes jjXFlick{0%,100%{opacity:.85;}50%{opacity:1;color:#c27f22;}}' +
  '#jjms .fquiz .xt{left:0;right:0;top:50%;z-index:3;translate:0 -52%;text-align:center;white-space:nowrap;font-size:clamp(13px,1.6vw,25px);line-height:1.1;letter-spacing:.02em;font-kerning:none;color:#3a0f63;}' +
  '#jjms .fquiz .xt .wr i{display:inline-block;font-style:normal;opacity:0;text-shadow:0 0 .2em rgba(255,228,150,.95),0 0 .55em rgba(255,196,90,.6),0 0 1.1em rgba(170,90,255,.55);}' +
  '#jjms .fquiz.in .xt .wr i{animation:jjXLetter 1s cubic-bezier(.2,.7,.25,1) calc(var(--i) * 62ms) both;}#jjms .fquiz.wave .xt .wr i{opacity:1;animation:jjXWave 2.8s ease-in-out calc(var(--i) * 85ms) infinite;}#jjms .fquiz.hot.wave .xt .wr i{animation-duration:1.2s;}' +
  '@keyframes jjXLetter{0%{opacity:0;transform:translateY(.4em) scale(1.45);filter:blur(9px);color:#ffe7a0;}55%{opacity:1;filter:blur(0);color:#fff1c4;}100%{opacity:1;transform:none;filter:blur(0);}}@keyframes jjXWave{0%,100%{transform:translateY(0);}50%{transform:translateY(-.07em);}}' +
  '#jjms .fquiz .xt .sh{position:absolute;inset:0;color:transparent;background:linear-gradient(100deg,rgba(255,240,190,0) 38%,rgba(255,246,214,.95) 48%,rgba(255,205,110,.9) 52%,rgba(255,240,190,0) 62%) no-repeat;background-size:260% 100%;background-position:130% 0;-webkit-background-clip:text;background-clip:text;opacity:0;}' +
  '#jjms .fquiz.wave .xt .sh{opacity:1;animation:jjXShine 3.6s ease-in-out infinite;}#jjms .fquiz.hot.wave .xt .sh{animation-duration:1.5s;}@keyframes jjXShine{0%{background-position:130% 0;}55%,100%{background-position:-30% 0;}}' +
  '#jjms .fquiz .xt .qp{position:absolute;top:50%;left:var(--q0);width:2.2em;height:2.2em;margin:-1.1em 0 0 -1.1em;background:radial-gradient(closest-side,#fff,rgba(255,215,120,.8) 30%,rgba(190,110,255,.3) 62%,rgba(190,110,255,0));opacity:0;}#jjms .fquiz.in .xt .qp{animation:jjXQuill var(--qd,2s) linear forwards;}@keyframes jjXQuill{0%{left:var(--q0);opacity:0;}8%{opacity:1;}88%{opacity:1;}100%{left:var(--q1);opacity:0;}}' +
  '#jjms .fquiz.hot .xt{color:#4b137e;}#jjms .fquiz:focus-visible .xt .wr i{text-shadow:0 0 .35em rgba(255,226,140,1),0 0 .9em rgba(200,120,255,.95);}' +
  '#jjms .fquiz .xorb{inset:0;z-index:0;}#jjms .fquiz .xorb > *{position:absolute;left:0;top:0;will-change:transform,opacity;opacity:0;}#jjms .fquiz .xorb > .f{z-index:4;}' +
  '#jjms .fquiz .xorb b{font-size:clamp(11px,1.3vw,22px);line-height:1;color:#ffe08a;font-weight:400;text-shadow:0 0 .3em rgba(255,210,100,1),0 0 .8em rgba(255,170,60,.7),0 0 1.4em rgba(190,110,255,.9);}' +
  '#jjms .fquiz .xorb i{width:clamp(10px,1.1vw,20px);height:clamp(10px,1.1vw,20px);background:radial-gradient(closest-side,#fff,rgba(255,226,150,.85) 28%,rgba(200,130,255,.35) 60%,rgba(200,130,255,0));}' +
  '#jjms .fquiz .xburst{left:var(--x);top:var(--y);width:0;height:0;z-index:5;}#jjms .fquiz .xburst .fl{position:absolute;left:0;top:0;width:40vmin;height:40vmin;margin:-20vmin 0 0 -20vmin;background:radial-gradient(closest-side,rgba(255,255,255,.95),rgba(255,214,130,.6) 24%,rgba(170,90,255,.35) 55%,rgba(170,90,255,0));scale:.1;opacity:1;transition:scale .8s cubic-bezier(.15,.7,.25,1),opacity .8s ease .15s;}#jjms .fquiz .xburst.go .fl{scale:1.5;opacity:0;}' +
  '#jjms .fquiz .xburst .sp{position:absolute;left:0;top:0;width:var(--s);height:var(--s);margin:calc(var(--s) / -2) 0 0 calc(var(--s) / -2);background:radial-gradient(closest-side,#fff,var(--c) 45%,rgba(0,0,0,0));transition:transform var(--d) cubic-bezier(.1,.75,.25,1),opacity var(--d) ease-in;}#jjms .fquiz .xburst.go .sp{transform:translate(var(--dx),var(--dy)) scale(.35);opacity:0;}' +
  '@media (max-width:700px){#jjms .fquiz .xins{display:none;}}' +
  '#jjms .fquiz.rm .xt .wr i{animation:none!important;opacity:1;}#jjms .fquiz.rm .xt{opacity:0;transition:opacity 1.2s ease .4s;}#jjms .fquiz.rm.in .xt{opacity:1;}#jjms .fquiz.rm .xglow,#jjms .fquiz.rm .xrim,#jjms .fquiz.rm .xsheen{animation:none!important;}#jjms .fquiz.rm .xins i{animation:none!important;opacity:.85;}' +
  /* the finale seen before in this visit: straight to the settled doors, no second universe (Joe, 2026-09-30) */
  '#jjms .finale.go.settled .bang{display:none;}#jjms .finale.go.settled .seed{opacity:0;pointer-events:none;}#jjms .finale.go.settled .fcap{animation:jjmsSettle1 .8s ease both;}#jjms .finale.go.settled .dests a{animation:jjmsSettle .8s ease both!important;animation-delay:.1s!important;}' +
  '#jjms .finale.go.settled .fexw .fqk{animation:jjmsSettle1 .8s ease .25s both;}#jjms .finale.go.settled .fquiz{animation:jjmsSettle1 .8s ease .3s both;}#jjms .finale.go.settled .ffly{animation:jjmsSettle1 .8s ease .4s both;}' +
  '@keyframes jjmsSettle{from{opacity:0;}}@keyframes jjmsSettle1{from{opacity:0;}to{opacity:1;}}' +
  '#jjms-quiz{position:fixed;inset:0;z-index:412;display:flex;align-items:center;justify-content:center;' +
    'background:radial-gradient(ellipse at 50% 46%,rgba(10,10,22,.72) 0%,rgba(4,6,12,.9) 75%);' +
    'opacity:0;pointer-events:none;transition:opacity .35s ease;}' +
  '#jjms-quiz.on{opacity:1;pointer-events:auto;}' +
  '#jjms-quiz .qrow{margin-top:24px;display:flex;gap:14px;justify-content:center;align-items:center;flex-wrap:wrap;}#jjms-quiz .qrow .qgo{margin:0;}' +
  '#jjms-quiz .qlater{padding:.85em 1.9em;border-radius:999px;border:1.5px solid rgba(255,255,255,.85);background:#000;color:#fff;font:inherit;font-weight:700;font-size:clamp(14px,1.1vw,18px);cursor:pointer;transition:scale .2s ease,background .2s ease;}#jjms-quiz .qlater:hover{background:#141414;scale:1.04;}#jjms-quiz .qlater:active{border-color:#ff5fc8;box-shadow:0 0 0 3px rgba(255,95,200,.35);}' +
  /* the card springs in from the right; .out throws it away left before the next one lands */
  '#jjms-quiz .qcard{width:min(92vw,640px);text-align:center;' +
    'animation:jjqIn .5s cubic-bezier(.34,1.56,.64,1) both;}' +
  '#jjms-quiz .qcard.out{animation:jjqOut .24s ease-in both;}' +
  '@keyframes jjqIn{from{opacity:0;transform:translateX(70px) rotate(1.5deg) scale(.94);}' +
    'to{opacity:1;transform:translateX(0) rotate(0) scale(1);}}' +
  '@keyframes jjqOut{from{opacity:1;transform:translateX(0);}to{opacity:0;transform:translateX(-70px) rotate(-1.5deg) scale(.95);}}' +
  /* the inner sheet carries the cursor tilt so it never fights the entrance animation */
  '#jjms-quiz .qtin{will-change:transform;transition:transform .18s ease-out;}' +
  '#jjms-quiz .qkick{margin:0 0 12px;font-size:13px;font-weight:800;letter-spacing:.03em;color:#FFC93D;text-transform:none;}' +
  '#jjms-quiz h3{margin:0 0 28px;font-size:clamp(22px,2.6vw,36px);font-weight:800;color:#fff;text-shadow:0 2px 16px rgba(0,0,0,.7);' +
    'animation:jjqPop .55s cubic-bezier(.34,1.56,.64,1) .08s both;}' +
  '@keyframes jjqPop{from{opacity:0;transform:scale(.8) translateY(10px);}to{opacity:1;transform:scale(1) translateY(0);}}' +
  '#jjms-quiz .qsub{margin:0 0 30px;font-size:clamp(13.5px,1.15vw,16.5px);font-weight:600;color:rgba(238,242,248,.75);line-height:1.5;}' +
  '#jjms-quiz .qopts{display:flex;flex-direction:column;gap:15px;max-width:520px;margin:0 auto;}' +
  '#jjms-quiz .qo{padding:16px 26px;border-radius:14px;border:1px solid rgba(255,255,255,.28);background:rgba(10,14,26,.66);' +
    'color:#eef2f8;font:inherit;font-size:clamp(14px,1.15vw,17px);font-weight:600;cursor:pointer;' +
    'animation:jjqOpt .45s cubic-bezier(.34,1.56,.64,1) var(--qd,0s) both;' +
    'transition:background .2s ease,border-color .2s ease,transform .2s ease;}' +
  '@keyframes jjqOpt{from{opacity:0;transform:translateY(16px) scale(.96);}to{opacity:1;transform:translateY(0) scale(1);}}' +
  '#jjms-quiz .qo:hover{background:rgba(255,0,245,.2);border-color:rgba(255,0,245,.55);transform:scale(1.03) translateX(3px);}' +
  '#jjms-quiz.locked .qo{pointer-events:none;}' +
  '#jjms-quiz .qo.right{background:rgba(38,178,102,.32);border-color:#3ddc84;color:#fff;' +
    'animation:jjqYes .5s cubic-bezier(.34,1.56,.64,1);}' +
  '@keyframes jjqYes{35%{transform:scale(1.07);}70%{transform:scale(.98);}100%{transform:scale(1);}}' +
  '#jjms-quiz .qo.wrong{background:rgba(220,50,70,.3);border-color:#ff5d73;animation:jjqShake .45s ease;}' +
  '@keyframes jjqShake{20%{transform:translateX(-8px);}45%{transform:translateX(7px);}70%{transform:translateX(-4px);}90%{transform:translateX(2px);}}' +
  '#jjms-quiz .qcard.jolt{animation:jjqJolt .4s ease;}' +
  '@keyframes jjqJolt{25%{transform:translate(-6px,2px) rotate(-.5deg);}55%{transform:translate(5px,-2px) rotate(.4deg);}80%{transform:translate(-2px,1px);}}' +
  /* the red wince when an answer misses */
  '#jjms-quiz .qflash{position:absolute;inset:0;pointer-events:none;' +
    'background:radial-gradient(ellipse at 50% 50%,transparent 42%,rgba(255,50,75,.34) 100%);' +
    'animation:jjqFlash .55s ease both;}' +
  '@keyframes jjqFlash{0%{opacity:0;}25%{opacity:1;}100%{opacity:0;}}' +
  /* ---- the evolution track: answer well and you evolve ---- */
  '#jjms-quiz .qtrack{position:relative;height:70px;max-width:470px;margin:52px auto 0;}' +
  '#jjms-quiz .qtrack::before{content:"";position:absolute;left:2%;right:2%;bottom:13px;height:2px;border-radius:2px;' +
    'background:linear-gradient(90deg,rgba(255,255,255,.28),rgba(255,0,245,.4));}' +
  '#jjms-quiz .qtick{position:absolute;bottom:9px;width:2px;height:10px;background:rgba(255,255,255,.3);transform:translateX(-50%);}' +
  '#jjms-quiz .qspr{position:absolute;bottom:17px;height:48px;transform:translateX(-50%);' +
    'transition:left .6s cubic-bezier(.34,1.56,.64,1);filter:drop-shadow(0 6px 14px rgba(0,0,0,.6));' +
    'animation:jjqBob 3.2s ease-in-out infinite;}' +
  '@keyframes jjqBob{0%,100%{translate:0 0;}50%{translate:0 -4px;}}' +
  '#jjms-quiz .qspr.hop{animation:jjqHop .6s cubic-bezier(.3,0,.3,1);}' +
  '@keyframes jjqHop{0%{translate:0 0;}45%{translate:0 -30px;}70%{translate:0 2px;}100%{translate:0 0;}}' +
  '#jjms-quiz .qspr.sad{animation:jjqSad .6s ease;}' +
  '@keyframes jjqSad{20%{rotate:-9deg;}45%{rotate:8deg;}70%{rotate:-4deg;}100%{rotate:0deg;}}' +
  /* sparkles + the floating +1 */
  '#jjms-quiz .qspark{position:fixed;width:7px;height:7px;border-radius:50%;pointer-events:none;' +
    'animation:jjqSpark .7s cubic-bezier(.2,.7,.4,1) both;}' +
  '@keyframes jjqSpark{from{opacity:1;transform:translate(0,0) scale(1);}' +
    'to{opacity:0;transform:translate(var(--sx),var(--sy)) scale(.2);}}' +
  '#jjms-quiz .qplus{position:fixed;pointer-events:none;color:#FFC93D;font-weight:800;font-size:20px;' +
    'text-shadow:0 0 14px rgba(255,201,61,.8),0 2px 8px rgba(0,0,0,.7);animation:jjqPlus .85s ease-out both;}' +
  '@keyframes jjqPlus{from{opacity:0;transform:translateY(6px) scale(.7);}25%{opacity:1;transform:translateY(-8px) scale(1.15);}' +
    'to{opacity:0;transform:translateY(-44px) scale(1);}}' +
  /* results: the rank stamps down, the score ticks up, your final form takes a bow */
  '#jjms-quiz .qrank{margin:0 0 10px;font-size:clamp(26px,3vw,42px);font-weight:800;color:#FFC93D;' +
    'text-shadow:0 0 26px rgba(255,201,61,.55),0 2px 14px rgba(0,0,0,.6);' +
    'animation:jjqStamp .5s cubic-bezier(.25,.9,.3,1.35) .35s both;}' +
  '@keyframes jjqStamp{from{opacity:0;transform:scale(2.6) rotate(-9deg);}to{opacity:1;transform:scale(1) rotate(-2deg);}}' +
  '#jjms-quiz .qsprbig{display:block;height:clamp(72px,9vw,104px);margin:0 auto 14px;' +
    'filter:drop-shadow(0 10px 26px rgba(0,0,0,.65));animation:jjmsDp .65s cubic-bezier(.34,1.56,.64,1) .12s both,' +
    'jjqBob 3.2s ease-in-out .8s infinite;}' +
  '#jjms-quiz .qscore{margin:0 0 20px;font-size:clamp(15px,1.3vw,19px);font-weight:700;color:#fff;}' +
  '#jjms-quiz .qgo,#jjms-quiz .qagain,#jjms-quiz .qtop{margin-top:26px;padding:13px 34px;border-radius:999px;border:0;' +
    'background:linear-gradient(100deg,#FF00F5,#8a2be2);color:#fff;font:inherit;font-size:16px;font-weight:800;cursor:pointer;' +
    'box-shadow:0 8px 30px rgba(255,0,245,.4);transition:scale .2s ease,box-shadow .2s ease;' +
    'animation:jjqOpt .5s cubic-bezier(.34,1.56,.64,1) var(--qd,.5s) both;}' +
  '#jjms-quiz .qgo{animation-name:jjqOpt,jjqPulse;animation-duration:.5s,2.2s;animation-delay:var(--qd,.5s),1.2s;' +
    'animation-iteration-count:1,infinite;animation-fill-mode:both,none;}' +
  '@keyframes jjqPulse{0%,100%{box-shadow:0 8px 30px rgba(255,0,245,.4);}50%{box-shadow:0 8px 44px rgba(255,0,245,.75);}}' +
  '#jjms-quiz .qgo:hover,#jjms-quiz .qagain:hover,#jjms-quiz .qtop:hover{scale:1.06;box-shadow:0 10px 38px rgba(255,0,245,.6);}' +
  '#jjms-quiz .qtop{background:rgba(10,14,26,.72);border:1px solid rgba(255,255,255,.35);box-shadow:none;margin-left:12px;}' +
  '#jjms-quiz .qsecret{margin-top:26px;margin-left:12px;padding:13px 34px;border-radius:999px;border:0;' +
    'background:linear-gradient(100deg,#FFC93D,#FF9E1B);color:#231a05;font:inherit;font-size:16px;font-weight:800;cursor:pointer;' +
    'box-shadow:0 8px 30px rgba(255,201,61,.5);transition:scale .2s ease,box-shadow .2s ease;' +
    'animation:jjqOpt .5s cubic-bezier(.34,1.56,.64,1) 1.15s both,jjqGold 2.2s ease-in-out 1.8s infinite;}' +
  '@keyframes jjqGold{0%,100%{box-shadow:0 8px 30px rgba(255,201,61,.5);}50%{box-shadow:0 8px 48px rgba(255,201,61,.9);}}' +
  '#jjms-quiz .qsecret:hover{scale:1.06;}' +
  '#jjms-quiz .qvid{position:relative;width:min(86vw,720px);aspect-ratio:16/9;margin:0 auto;border-radius:14px;overflow:hidden;' +
    'box-shadow:0 18px 60px rgba(0,0,0,.7),0 0 40px rgba(255,201,61,.25);background:#000;}' +
  '#jjms-quiz .qvid iframe{position:absolute;inset:0;width:100%;height:100%;border:0;}' +
  /* ---- the moon sound button, same as the homepage's ---- */
  '#jj-sound-btn.jjms-made{position:fixed;bottom:32px;right:32px;width:64px;height:64px;border-radius:50%;' +
    'background:radial-gradient(circle at 34% 30%,#ffffff 0%,#e7f1fb 55%,#cfe0f2 100%);border:none;cursor:pointer;' +
    'display:flex;align-items:center;justify-content:center;gap:3px;z-index:9999;overflow:hidden;' +
    'box-shadow:0 0 18px rgba(199,231,255,.5),0 0 40px rgba(160,190,255,.28);' +
    'opacity:0;pointer-events:none;transition:opacity 2.5s ease,background .25s ease;}' +
  '#jj-sound-btn.jjms-made.on{opacity:1;pointer-events:auto;}' +
  '#jj-sound-btn.jjms-made .jj-crater{position:absolute;border-radius:50%;background:#93a9c6;pointer-events:none;z-index:0;}' +
  '#jj-sound-btn.jjms-made .jj-bar{width:3px;background:#111;border-radius:2px;height:6px;position:relative;z-index:2;' +
    'transition:height 60ms linear,background .2s ease;will-change:height;}' +
  '#jj-sound-btn.jjms-made.is-muted{background:#111;}' +
  '#jj-sound-btn.jjms-made.is-muted .jj-bar{background:#fff;height:3px !important;}' +
  '#jj-sound-btn.jjms-made.is-muted .jj-crater{background:rgba(255,255,255,.16);}' +
  /* quiet (sound on, nothing playing) is not muted: the light moon stays, its bars rest as short still bars (matches site-footer.js) */
  '#jj-sound-btn.jjms-made.is-quiet:not(.is-muted) .jj-bar{transition:height .35s ease;}' +
  '#jj-sound-btn.jjms-made.is-quiet:not(.is-muted) .jj-crater + .jj-bar{height:6px !important;}#jj-sound-btn.jjms-made.is-quiet:not(.is-muted) .jj-bar + .jj-bar{height:9px !important;}#jj-sound-btn.jjms-made.is-quiet:not(.is-muted) .jj-bar + .jj-bar + .jj-bar{height:12px !important;}#jj-sound-btn.jjms-made.is-quiet:not(.is-muted) .jj-bar + .jj-bar + .jj-bar + .jj-bar{height:8px !important;}#jj-sound-btn.jjms-made.is-quiet:not(.is-muted) .jj-bar + .jj-bar + .jj-bar + .jj-bar + .jj-bar{height:5px !important;}' +
  '#jj-sound-btn.jjms-made .jj-sound-fill{position:absolute;border-radius:50%;background:#FF00F5;pointer-events:none;' +
    'transform:scale(0);opacity:0;z-index:1;transition:transform .42s ease,opacity .3s ease;}' +
  '#jj-sound-mist.jjms-made{position:fixed;bottom:-38px;right:-38px;width:200px;height:200px;pointer-events:none;z-index:9998;' +
    'display:flex;align-items:center;justify-content:center;gap:9px;filter:blur(24px);opacity:0;border-radius:50%;' +
    'transition:opacity 2.5s ease;}' +
  '#jj-sound-mist.jjms-made.on{opacity:.55;}' +
  '#jj-sound-mist.jjms-made .jj-mist-bar{width:10px;background:#ffffff;border-radius:6px;height:18px;will-change:height;}' +
  /* the SITE's own menu sits exactly where the modal close lives — it steps aside while any
     lightbox is open, so the X is always reachable */
  'html.jjms-lb .nav-container{opacity:0 !important;pointer-events:none !important;transition:opacity .35s ease;}' +
  /* the chrome fade while a lightbox is open takes the sound button with it */
  'html.jjms-cut #jj-sound-btn{z-index:10002 !important;}html.jjms-cut #jj-mixer{z-index:10001;}html.jjms-cut .jj-mx-bub{z-index:10003;}' +   /* the sound settings stay on during the cut-scene, over its bars */
  'html.jjms-lb:not(.jjms-cut) #jj-mixer,html.jjms-lb:not(.jjms-cut) .jj-mx-bub,html.jjms-lb:not(.jjms-cut) #jj-sound-btn,html.jjms-lb #jj-sound-mist{opacity:0 !important;pointer-events:none !important;' +
    'transition:opacity .35s ease;}' +
  /* JS-driven photos: the scroll-driven shrink stands down (animations beat declarations, so these
     must kill the animation AND come after the SDA block) */
  '#jjms .step.duo .phw .phs,#jjms .phw.vik-ride .phs{animation:none !important;opacity:1 !important;scale:1 !important;}' +
  '#jjms .phw.vik-ride{z-index:200;animation:none !important;}' +
  '#jjms .step.duo .gdim{z-index:2;}' +
  '#jjms .step.duo .phw{z-index:4;}' +
  /* the exam is long — the sound stays controllable inside it */
  'html.jjms-lb.jjms-quiz #jj-sound-btn{opacity:1 !important;pointer-events:auto !important;}' +
  'html.jjms-lb.jjms-quiz #jj-sound-mist{opacity:.55 !important;}' +
  /* the ✕ is an SVG, not a text glyph — a character carries its own side bearings and never sits dead
     centre in the circle however you align it; a stroked path is exactly centred by the viewBox */
  '#jjms-close{position:fixed;top:26px;right:30px;z-index:420;width:46px;height:46px;padding:0;border-radius:50%;' +
    'border:1px solid rgba(255,255,255,.32);background:rgba(0,0,0,.45);color:#fff;cursor:pointer;line-height:0;' +
    'opacity:0;pointer-events:none;transition:opacity .4s ease,transform .25s ease,background .2s ease;display:flex;align-items:center;justify-content:center;}' +
  '#jjms-close svg{display:block;width:20px;height:20px;}' +
  '#jjms-close.on{opacity:1;pointer-events:auto;}' +
  '#jjms-close:hover{background:rgba(255,0,245,.4);transform:scale(1.09);}' +
  /* while a lightbox is open the page chrome fades away — it lives ABOVE the scrim (z-940 vs z-350),
     so without this the era header/sprites, NEXT, nav and ruler all punch through the dimmed backdrop */
  'html.jjms-lb #jjms-hd,html.jjms-lb #jjms-next,html.jjms-lb #jjms-nav,html.jjms-lb #jjms-tl,html.jjms-lb #jjms-fly,html.jjms-lb .jjms-eraghost{' +
    'opacity:0 !important;pointer-events:none !important;transition:opacity .35s ease;}' +
  /* the site nav belongs to the story once it starts (the intro hides it page-wide) */
  'html.jjms-live .nav-logo-link,html.jjms-live .menu-container{opacity:1 !important;transition:opacity .8s ease;}' +
  /* ---- the very first line: let there be light ----
     T+0 light floods out of nothing, T+0.06 a shockwave, T+0.15 "And the lord said" rises,
     T+0.5 "Let there be Joe!" SLAMS in white-hot, then settles into a slow glow */
  '#jjms .flare{position:absolute;left:50%;top:50%;width:120vmax;height:120vmax;z-index:1;pointer-events:none;opacity:0;' +
    'transform:translate(-50%,-50%) scale(.05);background:radial-gradient(circle,rgba(255,255,255,.95) 0%,' +
    'rgba(255,214,250,.5) 11%,rgba(255,0,245,.16) 25%,rgba(125,140,255,.08) 40%,transparent 58%);}' +
  '#jjms .step.gen .flare{animation:jjmsGen 2s cubic-bezier(.16,.8,.3,1) both;}' +
  '@keyframes jjmsGen{0%{opacity:0;transform:translate(-50%,-50%) scale(.04);}' +
    '14%{opacity:1;transform:translate(-50%,-50%) scale(.32);}100%{opacity:0;transform:translate(-50%,-50%) scale(1.5);}}' +
  '#jjms .gring{position:absolute;left:50%;top:50%;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;' +
    'border:2px solid rgba(255,255,255,.9);opacity:0;transform:scale(0);z-index:1;pointer-events:none;}' +
  '#jjms .step.gen .gring{animation:jjmsGrg 1.7s cubic-bezier(.17,.67,.35,1) .06s both;}' +
  '@keyframes jjmsGrg{0%{opacity:.9;transform:scale(0);}100%{opacity:0;transform:scale(26);}}' +
  '#jjms .cap .pre,#jjms .cap .lit{display:inline-block;}' +
  '#jjms .cap .pre{margin-right:.26em;}' +
  /* the per-letter spans (disperse effect) must be inline-block so each can translate/rotate */
  '#jjms .cap .ch,#jjms .sub .ch{display:inline-block;}' +
  /* a caption word you can actually press: gold, gently breathing, and it says so on hover */
  '#jjms .cap .hotword{cursor:pointer;pointer-events:auto;color:#FFC93D;' +
    'animation:jjHotWord 2.6s ease-in-out infinite;}' +
  '#jjms .cap .hotword .ch{color:inherit;}' +
  '@keyframes jjHotWord{0%,100%{text-shadow:0 0 12px rgba(255,201,61,.5),0 2px 14px rgba(0,0,0,.6);}' +
    '50%{text-shadow:0 0 26px rgba(255,201,61,.95),0 0 52px rgba(255,176,31,.55),0 2px 14px rgba(0,0,0,.6);}}' +
  '#jjms .cap .hotword:hover{color:#FFE28A;}' +
  '#jjms .cap .hotword.popped{color:#FFF3C4;}' +
  /* a word is one unbreakable unit — the line can only wrap at the spaces between words */
  '#jjms .cap .word,#jjms .sub .word{display:inline-block;white-space:nowrap;}' +
  /* HEADLINE HOVER: a pink blob fills the letters and follows the mouse. Each letter paints a pink
     radial (positioned by its own --mx/--my, set per-frame in a local coord space so the blob is
     CONTINUOUS across letters) over a base fill of the normal text colour, both clipped to the glyphs.
     JS lerps the pointer toward the cursor for the fluid follow. Only active while .blob is on. */
  '#jjms .cap:not(.hero).blob .ch{' +
    'background-image:radial-gradient(circle 125px at var(--mx,-999px) var(--my,-999px),#ff6cf7 0%,#FF00F5 34%,rgba(255,0,245,0) 70%),linear-gradient(#eef2f8,#eef2f8);' +
    'background-repeat:no-repeat;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}' +
  /* the line stays alive: hover ripples the letters, a click re-fires creation */
  '#jjms .cap .lit{cursor:pointer;}' +
  '#jjms .cap .lit .ch{display:inline-block;transition:transform .42s cubic-bezier(.34,1.56,.64,1),text-shadow .3s ease;' +
    'transition-delay:calc(var(--i,0) * 26ms);}' +
  '#jjms .cap .lit:hover .ch{transform:translateY(-13px) scale(1.09) rotate(-3deg);' +
    'text-shadow:0 0 24px #fff,0 0 56px rgba(255,0,245,.95),0 0 110px rgba(125,140,255,.75);}' +
  '#jjms .cap .lit:hover .ch:nth-child(even){transform:translateY(-13px) scale(1.09) rotate(3deg);}' +
  '#jjms .cap .lit:active .ch{transform:translateY(-4px) scale(.97);transition-delay:0s;}' +
  '#jjms .cap.hero .pre,#jjms .cap.hero .lit{opacity:0;}' +
  '@keyframes jjmsHeroSub{from{opacity:0;transform:translateY(14px);}to{opacity:.62;transform:none;}}' +
  '#jjms .step.gen .cap.hero .pre{animation:jjmsPre .9s cubic-bezier(.22,1,.36,1) .15s both;}' +
  '@keyframes jjmsPre{from{opacity:0;transform:translateY(12px);}to{opacity:.82;transform:translateY(0);}}' +
  '#jjms .step.gen .cap.hero .lit{animation:jjmsSlam .9s cubic-bezier(.2,1.4,.4,1) .5s both,' +
    'jjmsLit 2.6s ease-out .5s both,jjmsLitP 5s ease-in-out 3.2s infinite;}' +
  /* every keyframe carries opacity — a property missing from 100% is interpolated back to the
     element's base value (0 here), which would fade the line straight back out */
  '@keyframes jjmsSlam{0%{opacity:0;transform:scale(1.55);filter:blur(12px);}' +
    '55%{opacity:1;transform:scale(.97);filter:blur(0);}78%{opacity:1;transform:scale(1.02);filter:blur(0);}' +
    '100%{opacity:1;transform:scale(1);filter:blur(0);}}' +
  '@keyframes jjmsLit{0%{color:#fff;text-shadow:0 0 0 rgba(255,255,255,0);}' +
    '20%{color:#fff;text-shadow:0 0 30px #fff,0 0 70px rgba(255,0,245,.9),0 0 130px rgba(125,140,255,.7);}' +
    '100%{color:#fff;text-shadow:0 0 18px rgba(255,255,255,.5),0 0 44px rgba(255,0,245,.38),0 0 90px rgba(125,140,255,.28);}}' +
  '@keyframes jjmsLitP{0%,100%{text-shadow:0 0 18px rgba(255,255,255,.5),0 0 44px rgba(255,0,245,.38),0 0 90px rgba(125,140,255,.28);}' +
    '50%{text-shadow:0 0 26px rgba(255,255,255,.75),0 0 60px rgba(255,0,245,.55),0 0 110px rgba(125,140,255,.4);}}' +
  '#jjms-bg.genesis{animation:jjmsGenBg 1.8s ease-out both;}' +
  '@keyframes jjmsGenBg{0%{filter:brightness(1);}10%{filter:brightness(1.55);}45%{filter:brightness(1.15);}100%{filter:brightness(1);}}' +
  /* left ruler */
  '#jjms-tl,#jjms-hd,#jjms-next,#jjms-nav{font-family:"Joes Journey Headline",Georgia,serif;color:#eef2f8;}' +
  '#jjms-tl{position:fixed;left:0;top:0;bottom:0;width:' + (SHOW_JOBS ? 250 : 96) + 'px;z-index:940;pointer-events:none;transform:translateX(-100%);transition:transform .7s cubic-bezier(.22,1,.36,1);}' +
  '#jjms-tl.on{transform:translateX(0);}' +
  '#jjms-tl .ruler{position:absolute;left:0;top:0;width:100%;will-change:transform;}' +
  '#jjms-tl .tk{position:absolute;left:0;width:10px;height:1px;background:rgba(255,255,255,.22);}' +
  '#jjms-tl .tk.maj{width:16px;background:rgba(255,255,255,.4);}' +
  '#jjms-tl .yl{position:absolute;left:24px;transform:translateY(-50%);font-size:' + (SHOW_JOBS ? 15 : 13) + 'px;letter-spacing:.03em;color:rgba(236,242,250,.45);transition:color .25s,text-shadow .25s;}' +
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
  '#jjms-hd .t{font-size:clamp(20px,1.9vw,30px);font-weight:800;margin:0;line-height:1.1;}' +
  '#jjms-hd .a{font-size:clamp(12px,1vw,15px);opacity:.75;margin:3px 0 12px;font-weight:700;line-height:1.1;}' +
  '#jjms-hd .ic{display:flex;gap:12px;align-items:flex-end;}' +
  '#jjms-hd .ic .pw{display:inline-flex;animation:jjmsPop .5s cubic-bezier(.34,1.56,.64,1) both;}' +
  '@keyframes jjmsPop{from{opacity:0;transform:scale(.5) translateY(8px);}to{opacity:1;transform:scale(1) translateY(0);}}' +
  /* all sprites the SAME height — opacity is the only dimming; the active one is alive */
  '#jjms-hd .ic img{height:36px;width:auto;opacity:.35;transition:opacity .45s ease;' +
    'filter:drop-shadow(0 3px 8px rgba(0,0,0,.5));transform-origin:bottom center;}' +
  '#jjms-hd .ic img.act{opacity:1;animation:jjmsIdle 1.6s ease-in-out infinite;}' +
  '@keyframes jjmsIdle{0%,100%{transform:translateY(0) scaleY(1);}50%{transform:translateY(-4px) scaleY(1.05);}}' +
  /* next button */
  /* NEXT is a pill in the site's button language: jj-score paints its ::before exactly like the HUD pills (glass on Classic,
     the blue panel on Space, the stone block on Medieval/Special, the pixel pill on Retro) — nothing is styled twice here */
  '#jjms-next{position:fixed;left:50%;bottom:64px;transform:translateX(-50%);z-index:940;background:none;border:0;isolation:isolate;' +
    'border-radius:24.5px;color:#fff;font:inherit;font-size:13px;font-weight:700;letter-spacing:.14em;' +
    'padding:14px 22px;cursor:pointer;display:flex;gap:10px;align-items:center;opacity:0;pointer-events:none;transition:opacity .5s ease;}' +
  '#jjms-next>*{position:relative;z-index:1;}' +
  '.jjms-eraghost{display:none !important;}' +   /* just the NEXT button now: no previous/next era pills beside it (Joe, 2026-09-25) */
  '#jjms-next.on{opacity:1;pointer-events:auto;}#jjms-next:hover::before{filter:brightness(1.25);}' +
  '#jjms-next .ar{display:inline-block;animation:jjmsA 1.6s ease-in-out infinite;}' +
  '@keyframes jjmsA{0%,100%{transform:translateY(-2px);}50%{transform:translateY(3px);}}' +
  /* the Taiwan cut-scene */
  'html.jjms-lb.jjms-cut .nav-container{opacity:1 !important;pointer-events:auto !important;}html.jjms-lb.jjms-cut #jj-sc-hud{opacity:1 !important;pointer-events:auto !important;z-index:10006 !important;}html.jjms-cut .nav{z-index:10006 !important;}html.jjms-lb.jjms-cut #jj-sound-btn{opacity:1 !important;pointer-events:auto !important;}' +
  '#jjms-cut{position:fixed;inset:0;z-index:10000;display:none;pointer-events:none;opacity:0;transition:opacity 1.2s ease;font-family:"Joes Journey Headline",Georgia,serif;color:#eef2f8;}#jjms-cut.on{display:block;pointer-events:auto;}#jjms-cut.go{opacity:1;}#jjms-cut.out{opacity:0;transition:opacity 1.4s ease;}' +
  '#jjms-cut .cbar{position:absolute;left:0;right:0;z-index:20;height:calc(11vh + 16px);background:#000;transition:transform 1.1s cubic-bezier(.22,1,.36,1);}#jjms-cut .cbar.t{top:0;transform:translateY(-101%);}#jjms-cut .cbar.d{bottom:0;transform:translateY(101%);}#jjms-cut.go .cbar{transform:none;}#jjms-cut.out .cbar.t{transform:translateY(-101%);}#jjms-cut.out .cbar.d{transform:translateY(101%);}' +
  '#jjms-cut .cutstage{position:absolute;inset:0;background:rgba(4,8,18,0);transition:background .9s ease;overflow:hidden;}#jjms-cut.go .cutstage{background:rgba(4,8,18,.78);}#jjms-cut.out .cutstage{background:rgba(4,8,18,0);}' +
  '#jjms-cut .cline{position:absolute;z-index:6;left:10vw;right:10vw;top:50%;translate:0 -50%;text-align:center;font-size:clamp(22px,3.2vw,46px);font-weight:700;line-height:1.2;opacity:0;transition:opacity .9s ease,translate .9s ease;text-shadow:0 2px 18px rgba(0,0,0,.6);}#jjms-cut.p1 .l1,#jjms-cut.p2 .l2{opacity:1;translate:0 calc(-50% - 6px);}' +
  '#jjms-cut .cflock i{position:absolute;left:var(--x);top:var(--y);width:calc(4.2vw * var(--s));aspect-ratio:1.5;background:linear-gradient(180deg,#f6efe0,#d9ccb4);border:1px solid #b9a98c;border-radius:3px;box-shadow:0 4px 10px rgba(0,0,0,.4);opacity:0;transform:translate(-120vw,10vh) rotate(var(--r)) scale(var(--s));}#jjms-cut .cflock i::before{content:"";position:absolute;left:0;right:0;top:0;height:55%;background:linear-gradient(180deg,#ece2cc,#d3c6ac);clip-path:polygon(0 0,100% 0,50% 100%);}' +
  '#jjms-cut.p3 .cflock i{animation:jjmsCutFly 2.6s cubic-bezier(.3,.7,.3,1) var(--d) both;}@keyframes jjmsCutFly{0%{opacity:0;transform:translate(-120vw,14vh) rotate(var(--r)) scale(calc(var(--s) * .6));}12%{opacity:1;}100%{opacity:1;transform:translate(0,0) rotate(calc(var(--r) * -1)) scale(var(--s));}}#jjms-cut.p4 .cflock i{transition:opacity .8s ease,transform 1s ease-in;opacity:0;transform:translate(0,40vh) rotate(var(--r)) scale(var(--s));}' +
  '#jjms-cut .cdesk{position:absolute;left:50%;bottom:calc(11vh + 16px);width:min(56vw,700px);height:6vh;translate:-50% 0;border-radius:8px 8px 0 0;background:linear-gradient(180deg,#5a3a20,#3a2412);box-shadow:0 -6px 24px rgba(0,0,0,.5);opacity:0;transition:opacity .8s ease;}#jjms-cut.p3 .cdesk,#jjms-cut.p4 .cdesk,#jjms-cut.p5 .cdesk{opacity:1;}' +
  '#jjms-cut .cenv{position:absolute;left:50%;bottom:calc(11vh + 16px + 5vh);width:min(24vw,300px);aspect-ratio:1.5;translate:-50% 0;background:linear-gradient(180deg,#f6efe0,#d9ccb4);border:1.5px solid #b9a98c;border-radius:5px;box-shadow:0 12px 30px rgba(0,0,0,.55);opacity:0;transform:translate(-40vw,-50vh) rotate(-25deg) scale(.4);transition:opacity .4s ease,transform 1.3s cubic-bezier(.3,.7,.3,1);}#jjms-cut.p4 .cenv{opacity:1;transform:none;}' +
  '#jjms-cut .cenv .flap{position:absolute;left:0;right:0;top:0;height:55%;background:linear-gradient(180deg,#ece2cc,#d3c6ac);clip-path:polygon(0 0,100% 0,50% 100%);transform-origin:50% 0;transition:transform .8s ease 1.1s;z-index:2;}#jjms-cut.p4 .cenv .flap{transform:rotateX(180deg);}' +
  '#jjms-cut .cenv .seal{position:absolute;left:50%;top:48%;width:14%;aspect-ratio:1;translate:-50% -50%;border-radius:50%;background:radial-gradient(circle at 40% 35%,#e2564a,#8d1f18 70%);color:rgba(255,220,200,.9);font-style:normal;font-weight:900;font-size:clamp(12px,1.3vw,20px);display:flex;align-items:center;justify-content:center;z-index:3;transition:opacity .3s ease 1s;}#jjms-cut.p4 .cenv .seal{opacity:0;}' +
  '#jjms-cut .ccard{position:absolute;left:6%;right:6%;top:18%;padding:5% 6%;background:#fffaf0;color:#3a2a06;border-radius:4px;font-size:clamp(11px,1.1vw,16px);line-height:1.35;text-align:center;transform:translateY(40%);opacity:0;transition:transform 1s cubic-bezier(.22,1,.36,1) 1.6s,opacity .5s ease 1.6s;z-index:1;}#jjms-cut .ccard b{display:block;font-size:1.25em;color:#8a2a1c;margin-top:.2em;}#jjms-cut.p4 .ccard{transform:translateY(-38%);opacity:1;}' +
  '#jjms-cut .cjoe{position:absolute;left:calc(50% + min(14vw,180px));bottom:calc(11vh + 16px + 5vh);width:min(11vw,150px);height:auto;opacity:0;transform-origin:50% 100%;transition:opacity .5s ease;}#jjms-cut.p4 .cjoe{opacity:1;}#jjms-cut.p5 .cjoe{animation:jjmsCutJoy .7s cubic-bezier(.34,1.56,.64,1) infinite alternate;}@keyframes jjmsCutJoy{from{transform:translateY(0) rotate(-4deg);}to{transform:translateY(-6vh) rotate(4deg);}}' +
  '#jjms-cut .ctw{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;scale:.62;transform-origin:50% 33%;-webkit-mask-image:radial-gradient(ellipse 58% 60% at 50% 52%,#000 72%,transparent 100%);mask-image:radial-gradient(ellipse 58% 60% at 50% 52%,#000 72%,transparent 100%);opacity:0;transition:opacity .5s ease;z-index:3;pointer-events:none;}#jjms-cut .ctw.on{opacity:1;}' +
  /* both Joes at .62, framed between the bars: the letters fall out from behind the top bar (no top feather), sides and floor feathered */
  '#jjms-cut .ctw.lt{-webkit-mask-image:linear-gradient(to right,transparent 0,#000 10%,#000 90%,transparent 100%),linear-gradient(to bottom,#000 84%,transparent 100%);-webkit-mask-composite:source-in;mask-image:linear-gradient(to right,transparent 0,#000 10%,#000 90%,transparent 100%),linear-gradient(to bottom,#000 84%,transparent 100%);mask-composite:intersect;}#jjms-cut .ctw.lt.gone{opacity:0;transition:opacity .25s ease;}' +
  '#jjms-cut .ctw.br{scale:.32;transform-origin:50% 46.5%;transition:opacity .5s ease,transform 1.8s cubic-bezier(.3,.7,.3,1);}#jjms-cut .ctw.br.land{transform:translateY(46.3vh) scale(.92);}' +
  '#jjms-cut .ccard2{position:absolute;left:50%;top:18vh;translate:-50% 0;z-index:4;padding:1.1em 1.6em;border-radius:6px;background:#fffaf0;color:#3a2a06;font-size:clamp(13px,1.3vw,19px);line-height:1.35;text-align:center;box-shadow:0 18px 40px rgba(0,0,0,.45);opacity:0;transform:translateY(20px) scale(.9) rotate(-2deg);transition:opacity .45s ease,transform .6s cubic-bezier(.34,1.56,.64,1);}#jjms-cut .ccard2 b{display:block;font-size:1.3em;color:#8a2a1c;margin-top:.2em;}#jjms-cut .ccard2.on{opacity:1;transform:none;}' +
  /* the letters house (Joe's cut-away cottage): it fills the band between the bars (the art is 1914x822), Joe stands on its floor and the letters pour in
     through the straight cut under its roof (the letters clip's top edge IS that line); the postal owl flies in to the window sill */
  '#jjms-cut .chouse{position:absolute;left:50%;top:50%;translate:-50% -50%;width:max(100vw,calc((78vh - 32px) * 2.3285));aspect-ratio:1914/822;z-index:1;opacity:0;transition:opacity .8s ease;pointer-events:none;}' +
  '#jjms-cut.p3 .chouse{opacity:1;}#jjms-cut.p5 .chouse,#jjms-cut.p6 .chouse{opacity:0;transition:opacity .9s ease;}' +
  '#jjms-cut .chouse .chbg{position:absolute;inset:0;width:100%;height:100%;max-width:none;}' +
  '#jjms-cut .chouse .ctw.lt{inset:auto;left:27.4%;top:28.3%;width:39.2%;height:auto;aspect-ratio:16/9;object-fit:contain;scale:1;-webkit-mask-image:linear-gradient(to right,transparent 0,#000 12%,#000 88%,transparent 100%),linear-gradient(to bottom,#000 88%,transparent 100%);mask-image:linear-gradient(to right,transparent 0,#000 12%,#000 88%,transparent 100%),linear-gradient(to bottom,#000 88%,transparent 100%);}' +
  '#jjms-cut .chouse .cowl{position:absolute;left:49.8%;top:38.8%;width:7%;height:auto;max-width:none;z-index:4;opacity:0;transform:translate(40vw,-38vh) rotate(-12deg) scale(.8);transition:transform 1.4s cubic-bezier(.3,.8,.3,1),opacity .3s ease;}' +
  '#jjms-cut .chouse .cowl.in{opacity:1;transform:none;}#jjms-cut .chouse .cowl.sat{animation:jjmsOwlBob 2.6s ease-in-out infinite;}@keyframes jjmsOwlBob{0%,100%{translate:0 0;}50%{translate:0 -3px;}}' +
  /* the flight game: steer Joe up and down, catch five skills from the Brighton tablets (2 coins each, the first time) */
  '#jjms-cut .cgame{position:absolute;left:0;right:0;top:calc(11vh + 16px);bottom:calc(11vh + 16px);z-index:6;pointer-events:none;overflow:hidden;}' +
  '#jjms-cut .chint,#jjms-cut .ccount{position:absolute;left:50%;translate:-50% 0;top:16px;padding:9px 18px;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.4);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);font-size:clamp(13px,1.05vw,16px);letter-spacing:.02em;white-space:nowrap;opacity:0;transform:translateY(-8px);transition:opacity .5s ease,transform .5s cubic-bezier(.3,1.4,.5,1);}' +
  '#jjms-cut .chint.on,#jjms-cut .ccount.on{opacity:1;transform:none;}#jjms-cut .ccount{top:auto;bottom:16px;}' +
  '#jjms-cut .chint kbd{display:inline-block;min-width:1.5em;padding:1px 6px;margin:0 2px;border-radius:6px;border:1px solid rgba(255,255,255,.6);background:rgba(255,255,255,.12);font:inherit;text-align:center;}' +
  '#jjms-cut .citem{position:absolute;left:0;top:0;display:flex;align-items:center;gap:7px;padding:7px 14px 7px 8px;border-radius:999px;background:rgba(10,14,30,.55);border:1.5px solid #ffc531;box-shadow:0 0 16px rgba(255,197,49,.55),inset 0 0 10px rgba(255,197,49,.25);font-size:clamp(12px,.95vw,15px);white-space:nowrap;will-change:transform;}' +
  '#jjms-cut .citem i{font-style:normal;display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffe9a0,#ffc531 60%,#d18a00);box-shadow:0 0 8px rgba(255,197,49,.8);font-size:14px;}' +
  '#jjms-cut .citem.got{transition:transform .45s cubic-bezier(.3,1.6,.5,1),opacity .45s ease !important;opacity:0;}' +
  '#jjms-cut .cpop{position:absolute;font-weight:700;font-size:clamp(14px,1.2vw,18px);color:#ffe27a;text-shadow:0 2px 10px rgba(0,0,0,.7);white-space:nowrap;animation:jjmsPop 1.1s ease-out forwards;}@keyframes jjmsPop{from{transform:translate(-50%,0);opacity:1;}to{transform:translate(-50%,-46px);opacity:0;}}' +
  '#jjms-cut.home .cpan{animation-direction:reverse !important;}#jjms-cut.home .ctw.br{scale:-.32 .32;}' +   /* home: the pan runs back west and Joe faces the way he flies */
  '#jjms-cut .ctw.br.away{transition:transform 1.6s cubic-bezier(.5,0,.8,.4),opacity .5s ease 1.2s !important;transform:translateX(190vw);}' +
  '#jjms-cut .ccount.big{bottom:50%;translate:-50% 50%;font-size:clamp(16px,1.6vw,24px);padding:14px 28px;}' +
  '#jjms-cut .ctw.br.on{animation:jjmsBrIn 1.5s cubic-bezier(.2,.8,.3,1) backwards;}@keyframes jjmsBrIn{from{transform:translateX(-190vw);}to{transform:translateX(0);}}' +   /* (inside his .32 scale: about 60vw on screen; 'backwards' so it never holds a transform over the landing) */   /* he flies INTO the shot from the left, already on the broom */
  /* ---- the awards dream (stills from the ChatGPT pack for now; the Dreamina clips drop in later) ---- */
  '#jjms-cut .cdream{display:none;position:absolute;inset:0;z-index:7;}#jjms-cut.dream .cdream{display:block;}#jjms-cut.dream .cutstage > :not(.cdream){display:none !important;}#jjms-cut.dream .cutstage{background:#000 !important;}' +
  '#jjms-cut .dstage{position:absolute;left:50%;top:50%;translate:-50% -50%;width:max(100vw,calc((78vh - 32px) * 2.327));aspect-ratio:2560/1100;opacity:0;transition:opacity .9s ease;}#jjms-cut .cdream.d-on .dstage{opacity:1;}#jjms-cut .cdream.d-bed .dstage{opacity:0;transition:opacity .5s ease;}' +
  '#jjms-cut .dstage > img{position:absolute;max-width:none;}#jjms-cut .dbg{inset:0;width:100%;height:100%;}' +
  '#jjms-cut .djoe{width:55%;top:15.1%;left:-60%;transition:left 2.4s cubic-bezier(.3,.6,.35,1),rotate .5s ease,translate .5s ease;transform-origin:50% 81%;}#jjms-cut .djoe.walk{left:9.1%;animation:drBob .38s ease-in-out infinite alternate;}#jjms-cut .djoe.mid{left:2.5%;transition:none;animation:none;}' +
  '@keyframes drBob{from{translate:0 0;}to{translate:0 -1.2%;}}#jjms-cut .djoe.pop{animation:drPop .35s cubic-bezier(.3,1.6,.5,1);}@keyframes drPop{from{scale:.94;}to{scale:1;}}' +
  '#jjms-cut .djoe.wobble{animation:drWob .32s ease-in-out infinite alternate;}@keyframes drWob{from{rotate:-4deg;}to{rotate:5deg;}}#jjms-cut .djoe.topple{animation:none;rotate:28deg;translate:8% 4%;transition:rotate .9s cubic-bezier(.5,0,.8,.4),translate .9s cubic-bezier(.5,0,.8,.4);}' +
  '#jjms-cut .dowl{width:9%;left:104%;top:10%;transition:left 1.4s cubic-bezier(.3,.6,.35,1),top 1.4s cubic-bezier(.3,.6,.35,1),opacity .4s ease;}#jjms-cut .dowl.in{left:50%;top:22%;}#jjms-cut .dowl.out{left:112%;top:-20%;transition-duration:1.2s;}' +
  '#jjms-cut .denv{position:absolute;left:54%;top:31%;width:2.6%;aspect-ratio:1.45;border-radius:2px;background:#fff6e2;box-shadow:0 2px 6px rgba(0,0,0,.4);opacity:0;}#jjms-cut .denv::after{content:"";position:absolute;left:50%;top:50%;width:32%;aspect-ratio:1;translate:-50% -50%;border-radius:50%;background:#c42a24;}' +
  '#jjms-cut .denv.drop{opacity:1;animation:drEnv .9s cubic-bezier(.5,0,.8,.5) forwards;}@keyframes drEnv{from{top:31%;rotate:-10deg;}to{top:52%;rotate:14deg;}}' +
  '#jjms-cut .dtro{width:4.2%;left:22%;top:-12%;opacity:0;}#jjms-cut .dtro.fall{opacity:1;animation:drFall .55s cubic-bezier(.5,0,.9,.5) forwards;}@keyframes drFall{to{top:36%;rotate:18deg;}}' +
  '#jjms-cut .dbed{position:absolute;left:50%;top:50%;translate:-50% -50%;width:max(100vw,calc((78vh - 32px) * 1.778));aspect-ratio:16/9;max-width:none;opacity:0;scale:1.08;transition:opacity .6s ease,scale 4s ease-out;}#jjms-cut .cdream.d-bed .dbed{opacity:1;scale:1;}' +
  '#jjms-cut .dcap{position:absolute;left:8vw;right:8vw;top:calc(11vh + 16px + 3.2vh);z-index:3;text-align:center;font-size:clamp(20px,2.6vw,40px);font-weight:700;line-height:1.2;text-shadow:0 2px 16px rgba(0,0,0,.8);opacity:0;transition:opacity .5s ease;}#jjms-cut .dcap.on{opacity:1;}' +
  '#jjms-cut .drip{position:absolute;inset:0;z-index:4;pointer-events:none;opacity:0;background:radial-gradient(circle,rgba(255,255,255,.0) 20%,rgba(200,210,255,.35) 60%,rgba(255,255,255,.9) 100%);}#jjms-cut .drip.go{animation:drRip 1.1s ease-in-out both;}@keyframes drRip{0%{opacity:0;backdrop-filter:blur(0);}50%{opacity:1;backdrop-filter:blur(14px);}100%{opacity:0;backdrop-filter:blur(0);}}' +
  '#jjms-cut .cdream.rippling .dstage{animation:drWave 1s ease-in-out;}@keyframes drWave{0%,100%{filter:none;}50%{filter:blur(6px) hue-rotate(40deg) saturate(1.6);scale:1.04;}}' +
  /* dream v2: the spotlight is code (it follows Joe), the crowd and chairs are drawn so every head can bob and cheer */
  '#jjms-cut .dspot{position:absolute;left:var(--spx,50%);top:-6%;width:30%;height:86%;translate:-50% 0;pointer-events:none;opacity:0;transition:opacity .5s ease,left 2.4s cubic-bezier(.3,.6,.35,1);mix-blend-mode:screen;}#jjms-cut .dspot.on{opacity:1;animation:drFlick .5s steps(3) 1;}' +
  '#jjms-cut .dspot::before{content:"";position:absolute;inset:0 0 8% 0;clip-path:polygon(43% 0,57% 0,96% 100%,4% 100%);background:linear-gradient(180deg,rgba(255,214,120,.55),rgba(255,190,80,.28) 60%,rgba(255,180,70,.12));filter:blur(14px);}' +
  '#jjms-cut .dspot::after{content:"";position:absolute;left:-6%;right:-6%;bottom:0;height:17%;border-radius:50%;background:radial-gradient(ellipse at 50% 50%,rgba(255,226,140,.95) 0%,rgba(255,196,90,.62) 38%,rgba(255,170,60,.18) 62%,transparent 74%);filter:blur(4px);}' +
  '@keyframes drFlick{0%{opacity:.2;}40%{opacity:1;}60%{opacity:.45;}100%{opacity:1;}}' +
  '#jjms-cut .dcrowd{position:absolute;left:0;bottom:0;width:100%;height:24%;z-index:2;pointer-events:none;overflow:visible;}#jjms-cut .dcrowd g.hd{transform-box:fill-box;transform-origin:50% 100%;animation:drHead var(--d) ease-in-out var(--dl) infinite alternate;}' +
  '@keyframes drHead{from{transform:translateY(0);}to{transform:translateY(3%);}}#jjms-cut .dcrowd .arm{opacity:0;transition:opacity .2s ease;}' +
  '#jjms-cut .cdream.cheer .dcrowd g.hd{animation:drCheer var(--cd) cubic-bezier(.3,0,.5,1) var(--dl) infinite alternate;}#jjms-cut .cdream.cheer .dcrowd .arm{opacity:1;}@keyframes drCheer{from{transform:translateY(4%);}to{transform:translateY(-16%);}}' +
  '#jjms-cut .dmist{position:absolute;inset:-10%;z-index:5;pointer-events:none;opacity:0;transition:opacity 1.1s ease;}#jjms-cut .dmist i{position:absolute;width:var(--w);aspect-ratio:1.7;left:var(--x);top:var(--y);border-radius:50%;background:radial-gradient(ellipse,rgba(236,240,255,.95) 0%,rgba(214,222,250,.7) 40%,rgba(200,210,245,0) 70%);filter:blur(10px);translate:var(--fx) 0;transition:translate 2.6s cubic-bezier(.3,.6,.35,1);}' +
  '#jjms-cut .cdream.d-mist .dmist{opacity:1;}#jjms-cut .cdream.d-mist .dmist i{translate:0 0;}#jjms-cut .cdream.d-clear .dmist{opacity:0;transition-duration:1.6s;}#jjms-cut .cdream.d-clear .dmist i{translate:calc(var(--fx) * -1) 0;}' +
  '#jjms-cut .droomw{position:absolute;left:50%;top:50%;translate:-50% -50%;width:min(100vw,calc((78vh - 32px) * 1.777),1305px);aspect-ratio:16/9;-webkit-mask:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent),linear-gradient(transparent,#000 5%,#000 95%,transparent);-webkit-mask-composite:source-in;mask:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent),linear-gradient(transparent,#000 5%,#000 95%,transparent);mask-composite:intersect;opacity:0;pointer-events:none;transition:opacity .8s ease;}#jjms-cut .cdream.d-room .droomw{opacity:1;pointer-events:auto;}#jjms-cut .cdream.d-room .dstage{opacity:0;transition:opacity .6s ease;}' +
  /* THE ROOM'S SIZE (Joe, 2026-09-28: Joe looked too big and pixelated): the whole 16:9 room now fits inside the letterbox (it used to fill the width
     and crop top and bottom), and it never grows past 1305px wide: Joe's snore / wake clips are 1028px and cover 78.76% of the room, so that is
     the width where they are shown 1:1. Feathered on all four sides into the black. Portrait screens keep the room full height, sides cropped. */
  '@media (max-aspect-ratio:1/1){#jjms-cut .droomw{width:min(1305px,calc((78vh - 32px) * 1.777));-webkit-mask:linear-gradient(transparent,#000 5%,#000 95%,transparent);mask:linear-gradient(transparent,#000 5%,#000 95%,transparent);}}' +
  '#jjms-cut .droomw > img.droom{position:absolute;inset:0;width:100%;height:100%;max-width:none;}#jjms-cut .droomw.shake{animation:drShake .5s ease;}@keyframes drShake{0%,100%{translate:-50% -50%;}20%{translate:calc(-50% - 8px) calc(-50% + 3px);}40%{translate:calc(-50% + 7px) calc(-50% - 4px);}60%{translate:calc(-50% - 5px) -50%;}80%{translate:calc(-50% + 3px) calc(-50% + 2px);}}' +
  '#jjms-cut .dbedw{position:absolute;z-index:4;}#jjms-cut .droomw .dlay{position:absolute;inset:0;width:100%;height:100%;max-width:none;pointer-events:none;}#jjms-cut .droomw .dfg{z-index:3;}#jjms-cut .dawake{opacity:0;}#jjms-cut .cdream.d-woke .dasleep{opacity:0;}#jjms-cut .cdream.d-woke .dawake{opacity:1;}#jjms-cut .dhot{z-index:2;}#jjms-cut .djoe{display:none !important;}#jjms-cut .djoev{position:absolute;left:6.35%;top:20.5%;width:45.4%;height:auto;aspect-ratio:16/9;max-width:none;z-index:1;opacity:0;transition:opacity .25s ease;-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 9%,#000 92%,transparent 100%),linear-gradient(180deg,transparent 0,#000 16%);-webkit-mask-composite:source-in;mask-image:linear-gradient(90deg,transparent 0,#000 9%,#000 92%,transparent 100%),linear-gradient(180deg,transparent 0,#000 16%);mask-composite:intersect;}#jjms-cut .djoev.on{opacity:1;}#jjms-cut .dowl.in2{left:45%;top:22%;transition:left 1.3s cubic-bezier(.3,.6,.35,1),top 1.3s cubic-bezier(.3,.6,.35,1),opacity .4s ease;}#jjms-cut .droomw .dlay.dsleep,#jjms-cut .droomw .dlay.dwakev{inset:auto;left:18.69%;top:16.98%;width:78.76%;height:81.73%;object-fit:fill;opacity:0;}#jjms-cut .droomw.vplay .dlay.dsleep{opacity:1;}#jjms-cut .droomw.vplay .dasleep{opacity:0;}#jjms-cut .droomw.wplay .dlay.dsleep{opacity:0;}#jjms-cut .droomw.wplay .dlay.dwakev{opacity:1;}#jjms-cut .droomw.wplay .dasleep{opacity:0;}#jjms-cut .dhot .dhvid{position:absolute;left:-36.76%;top:-12.9%;width:162.4%;height:119.6%;max-width:none;opacity:0;pointer-events:none;}#jjms-cut .dhot.stamp .dhvid{opacity:1;}#jjms-cut .dhot.stamp .dhimg{opacity:0;}#jjms-cut .dhot.hasclip.angry{animation:none;}#jjms-cut .dshock{display:none !important;}#jjms-cut .droomw.jolt .dawake{animation:drJolt .55s cubic-bezier(.3,1.6,.5,1);}@keyframes drJolt{0%{translate:0 0;}35%{translate:0 -1.6%;}100%{translate:0 0;}}#jjms-cut .dawake,#jjms-cut .dasleep{transition:opacity .25s ease;}#jjms-cut .dhot.hasimg{transform-origin:50% 100%;}#jjms-cut .dhot .dhimg{display:block;width:100%;height:100%;max-width:none;transition:filter .25s ease;}#jjms-cut .dhot.hasimg:hover,#jjms-cut .dhot.hasimg.angry{box-shadow:none;}#jjms-cut .dhot.hasimg:hover .dhimg{filter:drop-shadow(0 0 10px rgba(255,226,150,.75));}#jjms-cut .dhot.hasimg.angry .dhimg{filter:drop-shadow(0 0 14px rgba(255,70,50,.85)) saturate(1.3);}#jjms-cut .dhot.hasimg .tg{top:auto;bottom:100%;translate:-50% -8px;}' +
  '#jjms-cut .dzzz{position:absolute;left:50%;top:10%;width:30%;height:60%;pointer-events:none;}#jjms-cut .dzzz b{position:absolute;left:30%;bottom:0;font-weight:800;font-size:clamp(18px,2vw,34px);line-height:1;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.6);opacity:0;animation:drZ 3s ease-in infinite;}#jjms-cut .dzzz b:nth-child(2){animation-delay:1s;font-size:clamp(22px,2.6vw,44px);}#jjms-cut .dzzz b:nth-child(3){animation-delay:2s;font-size:clamp(26px,3.2vw,54px);}' +
  '@keyframes drZ{0%{opacity:0;translate:0 0;rotate:-8deg;}15%{opacity:1;}100%{opacity:0;translate:120% -260%;rotate:14deg;}}#jjms-cut .woke .dzzz{display:none;}' +
  '#jjms-cut .dshock{position:absolute;left:62%;top:-4%;font-weight:900;font-size:clamp(28px,3.6vw,60px);line-height:1;color:#FFC93D;text-shadow:0 3px 12px rgba(0,0,0,.6);opacity:0;scale:.3;pointer-events:none;}#jjms-cut .woke .dshock{animation:drShock 1.6s cubic-bezier(.3,1.6,.5,1) forwards;}@keyframes drShock{0%{opacity:0;scale:.3;}20%{opacity:1;scale:1.15;}35%{scale:1;}80%{opacity:1;}100%{opacity:0;}}' +
  '#jjms-cut .dwake{position:absolute;left:50%;bottom:100%;translate:-50% -10px;padding:.6em 1.3em;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.45);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#fff;font-weight:700;font-size:clamp(12px,1vw,16px);white-space:nowrap;cursor:pointer;opacity:0;transition:opacity .5s ease,background .25s ease;}#jjms-cut .dwake::after{display:none !important;content:"";position:absolute;inset:-6px;border-radius:999px;border:2px solid rgba(255,201,61,.8);animation:jjmsTapRing 1.8s ease-out infinite;pointer-events:none;}' +
  '#jjms-cut .dpoke{position:absolute;left:50%;bottom:100%;translate:-50% -8px;padding:.5em 1.1em;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.45);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#fff;font-weight:700;font-size:clamp(12px,.95vw,15px);white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .5s ease;animation:jjmsPrompt 1.6s ease-in-out infinite;}#jjms-cut .cdream.d-ask .dpoke,#jjms-cut .cdream.d-clear .dpoke{opacity:1;}#jjms-cut .dhot.poked .dpoke{opacity:0!important;}' +
  '#jjms-cut .cdream.d-ask .dwake{opacity:1;}#jjms-cut .dwake:hover{background:rgba(255,255,255,.18);}#jjms-cut .woke .dwake{opacity:0;pointer-events:none;}#jjms-cut .dbedw{cursor:pointer;}#jjms-cut .woke .dbedw{cursor:default;}' +
  '#jjms-cut .dhot{position:absolute;cursor:pointer;border-radius:10px;}#jjms-cut .dhot .tg{position:absolute;left:50%;top:100%;translate:-50% 8px;padding:5px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.55);color:#fff;font-weight:700;font-size:clamp(11px,.9vw,15px);white-space:nowrap;opacity:0;scale:.8;transition:opacity .2s ease,scale .25s cubic-bezier(.3,1.6,.5,1);pointer-events:none;}' +
  '#jjms-cut .dhot:hover .tg,#jjms-cut .dhot:focus-visible .tg{opacity:1;scale:1;}#jjms-cut .dhot:hover{box-shadow:0 0 0 2px rgba(255,255,255,.35),0 0 30px rgba(255,220,140,.35);}#jjms-cut .dhot.angry{animation:drAngry .6s ease;box-shadow:0 0 0 2px rgba(255,80,60,.7),0 0 40px rgba(255,60,40,.55);}@keyframes drAngry{0%,100%{rotate:0deg;}20%{rotate:-2.5deg;}40%{rotate:2.5deg;}60%{rotate:-1.5deg;}80%{rotate:1deg;}}' +
  '#jjms-cut .dhot .sb{position:absolute;left:100%;top:12%;translate:6px 0;padding:6px 12px;border-radius:14px 14px 14px 4px;background:#fff;color:#1a1020;font-weight:800;font-size:clamp(12px,1vw,17px);white-space:nowrap;opacity:0;scale:.5;transform-origin:0 100%;transition:opacity .2s ease,scale .3s cubic-bezier(.3,1.6,.5,1);pointer-events:none;}#jjms-cut .dhot.angry .sb{opacity:1;scale:1;}' +
  '#jjms-cut .dnote{position:absolute;left:0;right:0;bottom:calc(11vh + 22px);z-index:6;text-align:center;font-weight:600;font-size:clamp(12px,1vw,16px);color:rgba(255,255,255,.85);text-shadow:0 2px 10px rgba(0,0,0,.8);opacity:0;transition:opacity .8s ease .4s;pointer-events:none;}#jjms-cut .cdream.d-room .dnote{opacity:1;}#jjms-cut .cdream.d-room .dcap{top:auto;bottom:calc(11vh + 16px + 7vh);}' +
  '#jjms-cut .dback{position:absolute;right:4vw;bottom:calc(11vh + 16px);z-index:7;padding:.7em 1.4em;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.45);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#fff;font-weight:700;font-size:clamp(12px,1vw,16px);cursor:pointer;opacity:0;pointer-events:none;transition:opacity .5s ease,background .25s ease;}#jjms-cut .cdream.d-done .dback{opacity:1;pointer-events:auto;}#jjms-cut:has(.cdream.d-done) .cskip{opacity:0;pointer-events:none;}#jjms-cut .dback:hover{background:rgba(255,255,255,.18);}' +
  '#jjms .step{--cu:min(1vw,1.6vh,calc((39vh - 120px) / 16.8));}#jjms .jjdream-again{position:absolute;z-index:7;translate:0 0;padding:6px 14px;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.4);color:#fff;font:inherit;font-size:clamp(11px,.85vw,14px);font-weight:700;white-space:nowrap;cursor:pointer;display:none;}html.jjms-dreamseen #jjms .jjdream-again{display:block;}#jjms .jjdream-again:hover{background:rgba(255,255,255,.14);}' +
  '#jjms-cut .csmoke{position:absolute;left:47%;top:52%;width:min(36vh,42vw);translate:-50% -50%;z-index:5;opacity:0;pointer-events:none;}#jjms-cut .csmoke.on{opacity:1;}' +
  '#jjms-cut .cskip{position:absolute;right:28px;bottom:calc(11vh + 30px);z-index:21;padding:10px 18px;border-radius:999px;border:1px solid rgba(255,255,255,.4);background:rgba(10,14,26,.6);color:#eef2f8;font:inherit;font-size:13px;letter-spacing:.08em;cursor:pointer;opacity:0;transition:opacity .5s ease .8s;}#jjms-cut.go .cskip{opacity:.85;}#jjms-cut .cskip:hover{background:rgba(255,0,245,.25);border-color:rgba(255,0,245,.6);}' +
  /* THE FILMS' SKIP / BACK BUTTONS FOLLOW THE THEME (Joe, 2026-09-30: "make these skip buttons match the theme"): the frame lives on a ::before
     layer (like the cinema's close and the NEXT pill), so the label never moves. Classic = the click-to-begin glass (black .4 + blur, 50%
     white border, a wipe on hover, pink when pressed); medieval = the stone block; alien = navy with the cyan rim; retro = the pixel pill;
     special = the dashed stone ring with the gold glow on hover. */
  '#jjms-cut .cskip,#jjms-cut .dback{isolation:isolate;overflow:visible;border:0!important;background:none!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;color:#fff;font-family:"Joes Journey Headline",Georgia,serif;font-weight:700;font-size:clamp(13px,1vw,16px);letter-spacing:.02em;padding:.75em 1.5em;}' +
  '#jjms-cut .cskip::before,#jjms-cut .dback::before{content:"";position:absolute;inset:0;z-index:-1;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.4);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);transition:background .25s ease,box-shadow .25s ease,filter .25s ease;}' +
  '#jjms-cut .cskip::after,#jjms-cut .dback::after{content:"";position:absolute;inset:1px;z-index:-1;border-radius:999px;background:rgba(255,255,255,.14);transform:scaleX(0);transform-origin:0 50%;transition:transform .35s cubic-bezier(.4,0,.2,1);}' +
  '#jjms-cut .cskip:hover::after,#jjms-cut .dback:hover::after{transform:scaleX(1);}#jjms-cut .cskip:active::before,#jjms-cut .dback:active::before{border-color:#ff5fc8;box-shadow:0 0 0 3px rgba(255,95,200,.35);}#jjms-cut .cskip:hover{background:none!important;}' +
  'html[data-jj-theme="medieval"] #jjms-cut .cskip::before,html[data-jj-theme="medieval"] #jjms-cut .dback::before{border-radius:0;border:12px solid transparent;border-image:url(' + SB + 'score-block.webp) 70 fill / 12px / 0 round;background:none;-webkit-backdrop-filter:none;backdrop-filter:none;}html[data-jj-theme="medieval"] #jjms-cut .cskip,html[data-jj-theme="medieval"] #jjms-cut .dback{text-shadow:0 1px 2px rgba(0,0,0,.6);}html[data-jj-theme="medieval"] #jjms-cut .cskip::after,html[data-jj-theme="medieval"] #jjms-cut .dback::after{display:none;}html[data-jj-theme="medieval"] #jjms-cut .cskip:hover::before,html[data-jj-theme="medieval"] #jjms-cut .dback:hover::before{filter:brightness(1.15) drop-shadow(0 0 8px rgba(255,210,120,.6));}' +
  'html[data-jj-theme="alien"] #jjms-cut .cskip::before,html[data-jj-theme="alien"] #jjms-cut .dback::before{background:rgba(16,22,80,.85);border:1.5px solid rgba(120,220,255,.85);box-shadow:0 0 12px rgba(79,227,255,.25);}html[data-jj-theme="alien"] #jjms-cut .cskip:hover::before,html[data-jj-theme="alien"] #jjms-cut .dback:hover::before{background:rgba(24,32,110,.95);}' +
  'html[data-jj-theme="retro"] #jjms-cut .cskip::before,html[data-jj-theme="retro"] #jjms-cut .dback::before{border-radius:0;border:12px solid transparent;border-image:url(' + SB + 'retro-pill.webp) 16 fill / 12px / 0 round;image-rendering:pixelated;background:none;-webkit-backdrop-filter:none;backdrop-filter:none;}html[data-jj-theme="retro"] #jjms-cut .cskip::after,html[data-jj-theme="retro"] #jjms-cut .dback::after{display:none;}html[data-jj-theme="retro"] #jjms-cut .cskip:hover::before,html[data-jj-theme="retro"] #jjms-cut .dback:hover::before{filter:brightness(1.18) drop-shadow(3px 3px 0 rgba(255,0,245,.8));}' +
  'html[data-jj-theme="mixed"] #jjms-cut .cskip::before,html[data-jj-theme="mixed"] #jjms-cut .dback::before{border:4px dashed #a8a8a8;background:linear-gradient(160deg,#0e1a33,#070f1d);box-shadow:inset 0 0 0 2px #6d6d6d,0 0 0 2px #6d6d6d,0 0 16px rgba(255,197,49,.14);-webkit-backdrop-filter:none;backdrop-filter:none;}html[data-jj-theme="mixed"] #jjms-cut .cskip::after,html[data-jj-theme="mixed"] #jjms-cut .dback::after{display:none;}html[data-jj-theme="mixed"] #jjms-cut .cskip:hover::before,html[data-jj-theme="mixed"] #jjms-cut .dback:hover::before{background:linear-gradient(160deg,#16264a,#0a1428);box-shadow:inset 0 0 0 2px #ffc531,0 0 0 2px #ffc531,0 0 24px rgba(255,197,49,.3);}' +
  /* the flight: three panorama layers (7200x1200 masters, London at the left end, Taipei at the right) sized to different widths so they start left-aligned and end right-aligned; the speed difference between them is the parallax; each rides one keyframe with its own --pw */
  '#jjms-cut .cfly{position:absolute;left:0;right:0;top:calc(11vh + 16px);bottom:calc(11vh + 16px);--bh:calc(78vh - 32px);opacity:0;transition:opacity 1.1s ease;background:linear-gradient(180deg,#050e1c 0%,#0a1c30 55%,#0f2740 100%);overflow:hidden;}#jjms-cut.p6 .cfly,#jjms-cut.p7 .cfly{opacity:1;}' +
  '#jjms-cut .cpan{position:absolute;left:0;top:0;height:var(--ph);width:var(--pw);will-change:transform;}#jjms-cut .cpan img{display:block;width:100%;height:100%;}' +
  '#jjms-cut .cpan.far{--pw:calc(var(--bh) * 4.8);--ph:calc(var(--bh) * .8);top:calc(var(--bh) * .134);}#jjms-cut .cpan.mid{--pw:calc(var(--bh) * 6);--ph:var(--bh);}#jjms-cut .cpan.cl{--pw:calc(var(--bh) * 6.8);--ph:var(--bh);}#jjms-cut .cpan.near{--pw:calc(var(--bh) * 7.5);--ph:calc(var(--bh) * 1.25);top:calc(var(--bh) * -.167);}' +
  '#jjms-cut .cpan.cl img{position:absolute;left:var(--x);top:var(--y);width:calc(var(--bh) * var(--w) / 100);will-change:translate;height:auto;opacity:.92;}' +
  '#jjms-cut.p6 .cpan,#jjms-cut.p7 .cpan{animation:jjmsCutPan 7.2s cubic-bezier(.5,.02,.32,1) 1.1s both;}#jjms-cut.p6 .cpan.cl img{animation:jjmsCloud 11s linear .5s both;}@keyframes jjmsCloud{from{translate:0 0;}to{translate:calc(var(--bh) * var(--cx)) 0;}}' +   /* each cloud drifts its own way on top of the pan: some race ahead, some hang back */
  '@keyframes jjmsCutPan{from{transform:translateX(0);}to{transform:translateX(calc(100vw - var(--pw)));}}' +
  '#jjms-cut.out .cpan{transform:translateX(calc(100vw - var(--pw)));}#jjms-cut.out .cbroom{opacity:0;transform:translate(40vw,34vh) scale(.72) rotate(8deg);}#jjms-cut.p3 .cutstage,#jjms-cut.p5 .cutstage,#jjms-cut.p6 .cutstage{background:rgba(4,8,18,1);transition:background .6s ease;}' +
  '#jjms-cut.p6 .cdesk,#jjms-cut.p6 .cenv,#jjms-cut.p6 .cflock,#jjms-cut.p6 .cjoe{opacity:0 !important;transition:opacity .6s ease;}#jjms-cut.p6 .cjoe{animation:none;}' +
  /* Joe on the broom: stand-in until the Dreamina clip lands (swap the img for the keyed video, same box) */
  '#jjms-cut .cbroom{position:absolute;left:24vw;top:38vh;width:min(6.5vw,84px);aspect-ratio:1/1.9;opacity:0;transform:translate(-40vw,42vh) rotate(-14deg);transition:opacity .6s ease,transform 1.5s cubic-bezier(.3,.7,.3,1);z-index:4;}#jjms-cut.p6 .cbroom{opacity:1;transform:none;}#jjms-cut.p7 .cbroom{transform:translate(40vw,34vh) scale(.72) rotate(8deg);transition:transform 1.7s cubic-bezier(.45,.02,.35,1);}' +
  '#jjms-cut .cbroom .bob{position:absolute;inset:0;}#jjms-cut.p6 .cbroom .bob{animation:jjmsCutBob 1.5s ease-in-out infinite alternate;}@keyframes jjmsCutBob{from{transform:translateY(-1.4vh) rotate(-2deg);}to{transform:translateY(1.4vh) rotate(2deg);}}' +
  '#jjms-cut .cbroom .stick{position:absolute;left:-34%;right:-52%;bottom:9%;height:6%;border-radius:999px;background:linear-gradient(180deg,#a86f3d,#5d3a1d);transform:rotate(-5deg);z-index:0;}#jjms-cut .cbroom .brush{position:absolute;left:-66%;bottom:-8%;width:38%;height:38%;background:linear-gradient(90deg,#8a6a28,#d5ad52);clip-path:polygon(100% 32%,100% 66%,0 100%,6% 50%,0 0);z-index:0;}#jjms-cut .cbroom img{position:relative;z-index:1;display:block;width:100%;height:auto;transform:rotate(10deg);}' +
  /* NEXT wears the era it is in (Joe, 2026-09-19); the eras either side peek out behind it at half strength and jump there when pressed */
  '#jjms-next[data-era]::before,#jjms-next[data-era]::after{content:none!important;display:none!important;}#jjms-next[data-era]{background-clip:padding-box;}#jjms-next[data-era],.jjms-eraghost{transition:opacity .5s ease,background .6s ease,border-color .6s ease,color .6s ease,box-shadow .6s ease,transform .5s cubic-bezier(.22,1,.36,1);}' +
  '.jjms-eraghost{position:fixed;bottom:64px;left:50%;z-index:939;border:0;font-family:"Joes Journey Headline",Georgia,serif;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:12px 18px;border-radius:24.5px;cursor:pointer;opacity:0;pointer-events:none;white-space:nowrap;}' +
  '.jjms-eraghost.on{opacity:.5;pointer-events:auto;}.jjms-eraghost.on:hover{opacity:.9;}.jjms-eraghost.pv{transform:translateX(calc(-50% - 84px)) scale(.8);}.jjms-eraghost.nx{transform:translateX(calc(-50% + 84px)) scale(.8);}.jjms-eraghost.on:hover{transform:translateX(calc(-50% - 104px)) scale(.86);}.jjms-eraghost.nx.on:hover{transform:translateX(calc(-50% + 104px)) scale(.86);}' +
  '#jjms-next[data-era="0"],.jjms-eraghost[data-era="0"]{background:linear-gradient(160deg,rgba(90,205,235,.6),rgba(18,90,140,.7));border:1.5px solid rgba(180,240,255,.75);color:#e9fcff;box-shadow:inset 0 6px 14px rgba(255,255,255,.18),0 8px 22px rgba(0,40,70,.45);}' +
  '#jjms-next[data-era="1"],.jjms-eraghost[data-era="1"]{background:linear-gradient(170deg,#7a6852,#3f3229);border:2px solid #b89a78;color:#f4e6cc;border-radius:12px;box-shadow:inset 0 2px 0 rgba(255,255,255,.15),0 8px 18px rgba(0,0,0,.5);}' +
  '#jjms-next[data-era="2"],.jjms-eraghost[data-era="2"]{background:linear-gradient(170deg,#f4efe6,#cfc4b3);border:2px solid #b9a98b;color:#3a2e1d;letter-spacing:.2em;box-shadow:inset 0 -3px 0 rgba(120,100,70,.35),0 8px 18px rgba(0,0,0,.45);}' +
  '#jjms-next[data-era="3"],.jjms-eraghost[data-era="3"]{background:linear-gradient(170deg,#845128,#4f2e14);border:2px solid #d0a15e;color:#ffe6b0;border-radius:7px;box-shadow:inset 0 0 0 2px rgba(0,0,0,.25),0 8px 18px rgba(0,0,0,.5);}' +
  '#jjms-next[data-era="4"],.jjms-eraghost[data-era="4"]{background:linear-gradient(170deg,#f8e6a6,#c8952c);border:2px solid #7c5b12;color:#3b2a06;box-shadow:inset 0 2px 0 rgba(255,255,255,.5),0 0 18px rgba(255,214,120,.45);}' +
  '#jjms-next[data-era="5"],.jjms-eraghost[data-era="5"]{background:rgba(8,18,38,.78);border:1.5px solid #35d6ff;color:#dffaff;box-shadow:0 0 14px rgba(53,214,255,.65),inset 0 0 12px rgba(53,214,255,.25);}' +
  /* era nav */
  '#jjms-nav{position:fixed;left:0;right:0;bottom:0;z-index:940;display:flex;justify-content:center;gap:6px;align-items:baseline;' +
    'padding:16px 10px 18px;opacity:0;pointer-events:none;transition:opacity .5s ease;' +
    'background:linear-gradient(180deg,transparent,rgba(5,8,15,.72) 55%);}' +
  '#jjms-nav.on{opacity:1;pointer-events:auto;}' +
  /* isolate so the current item can hold its glow BEHIND the text without sinking under the nav bg */
  '#jjms-nav a{position:relative;isolation:isolate;color:rgba(238,242,248,.72);text-decoration:none;font-size:19px;font-weight:700;' +
    'letter-spacing:.02em;padding:6px 14px;border-radius:8px;transition:color .25s,font-size .25s,text-shadow .25s;white-space:nowrap;}' +
  '#jjms-nav a:hover{color:#fff;}' +
  '#jjms-nav a.cur{color:#fff;font-size:23px;text-shadow:0 0 14px rgba(255,255,255,.5),0 0 30px rgba(255,0,245,.6);}' +
  /* every era carries a soft white halo behind it (like the design); the current one glows magenta */
  '#jjms-nav a::before{content:"";position:absolute;left:50%;top:54%;transform:translate(-50%,-50%);z-index:-1;pointer-events:none;' +
    'width:150%;height:290%;border-radius:50%;filter:blur(7px);opacity:.5;transition:opacity .3s ease;' +
    'background:radial-gradient(ellipse at center,rgba(255,255,255,.26) 0%,rgba(255,255,255,.10) 42%,transparent 70%);}' +
  '#jjms-nav a:hover::before{opacity:.85;}' +
  /* the distinct radial glow behind the current era — and it breathes */
  '#jjms-nav a.cur::before{width:172%;height:360%;opacity:1;' +
    'background:radial-gradient(ellipse at center,rgba(255,0,245,.55) 0%,rgba(150,70,255,.36) 34%,rgba(90,90,255,.15) 56%,transparent 74%);' +
    'animation:jjmsNavGlow 2.6s ease-in-out infinite;}' +
  '@keyframes jjmsNavGlow{0%,100%{opacity:.7;transform:translate(-50%,-50%) scale(.9);}50%{opacity:1;transform:translate(-50%,-50%) scale(1.1);}}' +
  '#jjms-nav .dash{color:rgba(238,242,248,.3);font-size:16px;}';
  /* ---- scroll-driven parallax, run by the compositor ----
     Where the browser supports scroll timelines, the photos and words are animated against their
     step's own view progress instead of being positioned by JS each frame. Nothing can lag the
     scroll, because nothing is being computed on the main thread. Gated on support: without a
     timeline these keyframes would collapse to a 0s animation and stick on their end frame. */
  /* window.CSS, not CSS — the stylesheet string above shadows the global inside this closure */
  var SDA = !!(window.CSS && window.CSS.supports && window.CSS.supports('animation-timeline: view()'));
  window.JJ_MYSTORY_SDA = SDA;                                   /* scroll timelines? (else the JS fallback drives it) */
  if (SDA) CSS +=
    '#jjms .step{view-timeline-name:--jjstep;view-timeline-axis:block;}' +
    '#jjms .phw,#jjms .phs,#jjms .step .cap,#jjms .step .sub{animation-timing-function:linear;' +
      'animation-fill-mode:both;animation-timeline:--jjstep;animation-range:cover 0% cover 100%;}' +
    '#jjms .phw{animation-name:jjmsPx;transition:none;}' +
    '@keyframes jjmsPx{from{translate:0 calc(-100vh * var(--d,.2));}to{translate:0 calc(100vh * var(--d,.2));}}' +
    '#jjms .phs{animation-name:jjmsAway;transition:none;}' +
    '@keyframes jjmsAway{0%{opacity:0;scale:.55;}11%{opacity:0;scale:.55;}30%{opacity:.62;scale:.86;}' +
      '50%{opacity:1;scale:1;}70%{opacity:.62;scale:.86;}89%{opacity:0;scale:.55;}100%{opacity:0;scale:.55;}}' +
    /* ONE animation per caption — scale + opacity + drift move TOGETHER on ONE range, so nothing
       gets stuck to the side (that mismatch was the lag). The whole life plays over the VISIBLE
       band (cover 20→80%): it drifts in from the lower-left small + invisible, grows + centres +
       brightens through the middle, then drifts out to the upper-right, shrinking to nothing — so
       it clearly FLOATS OUT and DISAPPEARS at the top, like the horizontal-scroll panels. */
    '#jjms .step .cap{animation-name:jjmsCap;transition:none;}' +
    '#jjms .step .sub{animation-name:jjmsSub;transition:none;}' +
    '#jjms .step .cap,#jjms .step .sub{animation-range:cover 0% cover 100%;}' +
    /* readable + full in the middle ~20% of the screen (cover 45–55%); fades + shrinks to 0 as it
       moves away, gone by the screen edges. Same shape for cap + sub — nothing floats here. */
    '@keyframes jjmsCap{0%{opacity:0;scale:.6;}22%{opacity:0;scale:.72;}45%{opacity:1;scale:1;}55%{opacity:1;scale:1;}78%{opacity:0;scale:.72;}100%{opacity:0;scale:.6;}}' +
    '@keyframes jjmsSub{0%{opacity:0;scale:.6;}22%{opacity:0;scale:.72;}45%{opacity:.62;scale:1;}55%{opacity:.62;scale:1;}78%{opacity:0;scale:.72;}100%{opacity:0;scale:.6;}}' +
    /* Per-letter SCATTER only (scroll-driven): letters gather into the word in the readable middle
       (cover 45–55%) and spread out to --sx/--sy at both ends. The continuous per-letter FLOAT is
       driven from JS (floatTick) so its amplitude can scale with the caption's LIVE distance from the
       screen centre — a CSS @property animated by one animation can't be read live in another's calc.
       jjmsChar sets translate/rotate (scatter); floatTick sets transform (float); they compose. */
    /* PERF: scoped to `.near` (the step on screen and its two neighbours). Every letter carries its own
       scroll-driven animation, so applying this to ALL steps meant ~1,390 live animations that the
       browser re-evaluated on every scroll frame — the single biggest cost on the page. Off-screen
       letters simply rest at their gathered base position, so nothing looks different. */
    '#jjms .step.near .cap:not(.hero) .ch,#jjms .step.near .sub .ch{animation-name:jjmsChar;animation-timeline:--jjstep;' +
      'animation-range:cover 0% cover 100%;animation-timing-function:linear;animation-fill-mode:both;will-change:transform;}' +
    '@keyframes jjmsChar{0%{translate:var(--sx,0) var(--sy,0);rotate:var(--sr,0deg);}45%{translate:0 0;rotate:0deg;}' +
      '55%{translate:0 0;rotate:0deg;}100%{translate:var(--sx,0) var(--sy,0);rotate:var(--sr,0deg);}}' +
    /* THE BIG PIECES FADE WITH THE SCROLL TOO (Joe, 2026-09-30: "UI to fade out like the text does... the images and the big map"): the maps,
       the games wall, the cinema, the Super Reel window, the trophy cabinet and the learning cards come up as their slide arrives and go as it
       leaves, on the slide's own scroll timeline (opacity only, on the compositor). A touch gentler than the words: full from 40% of the way in
       to 40% of the way out. Only pieces that already carry their own z-index (so nothing re-stacks) and no opacity state of their own;
       the feature slides (tall, pinned) keep their own choreography, and a piece being dragged is never faded (the Super Reel window). */
    '#jjms .step:not(.feat) :is(.jjg,.jjc-marq,.jjc-strip,.jjc-wallw,.jja,.jja-rib,.srmon,.jjcab-back,.jjcab-items,.jjcab-doors,.jjl-card,.jjms-tv){animation:jjmsUi linear both;animation-timeline:--jjstep;animation-range:cover 0% cover 100%;}' +
    '@keyframes jjmsUi{0%,18%{opacity:0;}40%,60%{opacity:1;}82%,100%{opacity:0;}}html.jjms-sdrag #jjms .step.srp .srmon{animation:none;}';

  /* the photos of a step arrive one by one — this is the ENTRANCE animation's delay, not the
     transition's, so hovering a photo never has to wait it out. On the opening frame they hold
     back longer, until the light has struck. */
  /* the job rail is optional — everything it needs is behind SHOW_JOBS */
  /* The opening subtitle waits for the title. This has to come AFTER the scroll-driven block: that
     block gives every .sub a view-timeline animation, and an animation outranks a plain declaration,
     so an earlier rule just loses. The hero line lands at 1.4s (.5s delay + .9s slam) — hence 1.5s. */
  /* The headline hands over to the subtitle, which then stays with you for the whole sequence.
     Both need `animation-name:none` and both have to come AFTER the scroll-driven block — an
     animation outranks a plain declaration however specific the selector. */
  CSS +=
    '#jjms .step.tall .cap{position:absolute;left:0;right:0;top:38%;z-index:5;' +
      'margin:0 auto;max-width:none;width:100%;text-align:center;' +
      'animation-name:none;transform:none;scale:1;' +
      'opacity:1;}' +
    '#jjms .step.tall .sub{position:absolute;left:0;right:0;top:auto;bottom:9vh;z-index:5;' +
      'margin:0 auto;max-width:none;width:100%;text-align:center;' +
      'animation-name:none;transform:none;scale:1;translate:0 0;' +
      'opacity:.55;' +
      'text-shadow:0 2px 18px rgba(0,0,0,.95),0 0 40px rgba(0,0,0,.8);}' +
    '#jjms .step.tall .sub .ch,#jjms .step.tall .cap .ch{animation-name:none;transform:none !important;opacity:1 !important;}' +
    '#jjms-step-0.step .sub{opacity:0;animation-name:none;}' +
    '#jjms-step-0.step.gen .sub{animation:jjmsHeroSub .9s cubic-bezier(.22,1,.36,1) 1.5s both;}';
  if (SHOW_JOBS) CSS +=
  /* ---- the job pinned under each year: logo tile + company / location / role.
     Dim by default; when its year is the live one it brightens and glows (.cur). ---- */
  '#jjms-tl .job{position:absolute;left:24px;right:8px;display:flex;align-items:center;gap:10px;' +
    'opacity:.42;filter:saturate(.25);transition:opacity .45s ease,filter .45s ease,transform .45s cubic-bezier(.22,1,.36,1);}' +
  '#jjms-tl .job.cur{opacity:1;filter:saturate(1);transform:translateX(4px);}' +
  '#jjms-tl .jlogo{position:relative;flex:0 0 auto;width:52px;height:52px;border-radius:10px;overflow:hidden;background:#fff;' +
    'display:flex;align-items:center;justify-content:center;transition:box-shadow .45s ease;}' +
  '#jjms-tl .job.cur .jlogo{box-shadow:0 0 0 1px rgba(255,255,255,.25),0 0 18px rgba(255,0,245,.55),0 0 38px rgba(125,140,255,.35);}' +
  '#jjms-tl .jlogo i{font-style:normal;font-weight:800;font-size:17px;letter-spacing:.02em;color:#12203a;}' +
  '#jjms-tl .jlogo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}' +
  '#jjms-tl .jtx{min-width:0;display:flex;flex-direction:column;}' +
  '#jjms-tl .jco{font-size:14px;font-weight:800;line-height:1.15;color:#fff;}' +
  '#jjms-tl .jloc{display:flex;align-items:center;gap:4px;font-size:11.5px;font-weight:700;line-height:1.25;color:rgba(236,242,250,.55);margin-top:1px;}' +
  '#jjms-tl .jloc svg{flex:0 0 auto;width:11px;height:11px;opacity:.8;}' +
  '#jjms-tl .jrole{font-size:12.5px;font-weight:800;line-height:1.2;color:#fff;margin-top:2px;}' +
  '#jjms-tl .job.cur .jco,#jjms-tl .job.cur .jrole{text-shadow:0 0 12px rgba(255,0,245,.45);}' +
  /* narrower screens can\'t fit a full card beside the centred story text, so the details collapse:
     only the LIVE year shows company/location/role — the rest stay as logo tiles */
  '@media (max-width:1400px){#jjms-tl{width:150px;}' +
    '#jjms-tl .job .jtx{opacity:0;transform:translateX(-6px);transition:opacity .35s ease,transform .35s ease;}' +
    '#jjms-tl .job.cur .jtx{opacity:1;transform:none;}}' +
  '@media (max-width:1000px){#jjms-tl{width:96px;}#jjms-tl .job .jtx{display:none;}' +
    '#jjms-tl .jlogo{width:38px;height:38px;border-radius:8px;}#jjms-tl .jlogo i{font-size:13px;}}';

  for (var pz = 1; pz <= 28; pz++) {                              /* up to 28 — the films collage carries 26 */
    /* nth-of-type, not nth-child — the opening frame also holds a .flare and a .gring */
    CSS += '#jjms .phw:nth-of-type(' + pz + ') img{animation-delay:' + ((pz - 1) * 0.07).toFixed(2) + 's;}';
    CSS += '#jjms .step.gen .phw:nth-of-type(' + pz + ') img{animation-delay:' + (1.15 + (pz - 1) * 0.22).toFixed(2) + 's;}';
  }

  /* The opening line, split for the creation treatment: everything before the quote rises quietly,
     the quoted half strikes — and each of its letters is its own span so the phrase can ripple
     under the cursor. (A trailing space is trimmed at an inline-block edge; .pre carries a margin.) */
  function heroCap(text) {
    var m = text.match(/^(.*?)\s*(“.*”)$/);
    if (!m) return text;
    var chars = '', k = 0;
    for (var c = 0; c < m[2].length; c++) {
      var ch = m[2].charAt(c);
      chars += ch === ' ' ? ' ' : '<span class="ch" style="--i:' + (k++) + '">' + ch + '</span>';
    }
    return '<span class="pre">' + m[1] + '</span><span class="lit">' + chars + '</span>';
  }

  /* Split a caption into per-letter spans that DISPERSE — like the horizontal-scroll text. Each
     letter carries a scatter vector: outward from the word's centre (so it explodes wide), plus a
     deterministic vertical + rotation jitter. The letters gather into the word at the middle of the
     step and scatter apart again at both ends (see @keyframes jjmsChar). */
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  /* a well-mixed 0..1 hash — consecutive inputs give uncorrelated outputs (no visible period) */
  function jhash(n) { n = (n ^ 61) ^ (n >>> 16); n = (n + (n << 3)) | 0; n ^= n >>> 4; n = (n * 668265261) | 0; n ^= n >>> 15; return ((n >>> 0) % 100000) / 100000; }
  function disperseCap(text, hot, funk) {
    /* Each letter is its own span (so it can scatter), but letters are grouped into `.word` spans
       that never break — so a word can only wrap at the spaces BETWEEN words, never mid-word. */
    var words = text.replace(/[ \t]*\n[ \t]*/g, ' \n').split(' '), total = 0, k = 0, html = '';   /* 'travelling.\nMuch': the '\n' becomes its own word start, so it still breaks */
    for (var w0 = 0; w0 < words.length; w0++) total += words[w0].replace('\n', '').length;
    /* `funk` underlines a whole PHRASE, which spans several word spans — find where it starts and
       ends so the wrapper can open before one word and close after another */
    var fk0 = -1, fk1 = -1;
    if (funk && funk.phrase) {
      var bare = function (t) { return t.replace(/[^0-9a-z]/gi, '').toLowerCase(); };
      var want = bare(funk.phrase);
      for (var a = 0; a < words.length && fk0 < 0; a++) {
        var acc = '';
        for (var b = a; b < words.length; b++) {
          acc += bare(words[b]);
          if (acc === want) { fk0 = a; fk1 = b; break; }
          if (acc.length >= want.length) break;
        }
      }
    }
    for (var w = 0; w < words.length; w++) {
      var nl = words[w].charAt(0) === '\n'; if (nl) words[w] = words[w].slice(1);   /* a '\n' before a word forces a new line there */
      if (w > 0) html += nl ? '<br>' : ' ';
      if (w === fk0) html += '<span class="funk"' + (funk.img ? ' data-img="' + esc(funk.img) + '"' : '') +
        (funk.cap ? ' data-cap="' + esc(funk.cap) + '"' : '') + '>';
      /* `hot` marks ONE word as interactive — it keeps its per-letter scatter, the wrapper just
         carries the shimmer and the click target */
      var isHot = hot && words[w].replace(/[^A-Za-z]/g, '').toLowerCase() === hot.toLowerCase();
      html += '<span class="word' + (isHot ? ' hotword' : '') + '"' + (isHot ? ' data-party="1"' : '') + '>';
      for (var c = 0; c < words[w].length; c++) {
        var rel = total > 1 ? (k / (total - 1) - 0.5) : 0;       /* −.5 (left) … +.5 (right) of the whole line */
        var sx = Math.round(rel * Math.max(90, total * 8));      /* spread outward, wider for longer lines */
        var sy = Math.round((((k * 1103515245 + 12345) % 1000) / 1000 - 0.5) * 90);
        var sr = Math.round((((k * 71) % 100) / 100 - 0.5) * 46);
        /* per-letter float — VARIED so they never move in unison: own amplitude, tilt, speed + a
           jittered delay (a loose stagger, not a rigid wave). Different speeds drift them out of sync. */
        var h1 = jhash(k * 3 + 1), h2 = jhash(k * 3 + 2), h3 = jhash(k * 3 + 3);
        var fy = -(4 + Math.round(h1 * 10)), fr = (2 + Math.round(h2 * 6)) * (h3 < 0.5 ? 1 : -1);
        var fd = (2.2 + h3 * 3).toFixed(1), fdl = (k * 0.06 + h2 * 1.3).toFixed(2);
        html += '<span class="ch" style="--sx:' + sx + 'px;--sy:' + sy + 'px;--sr:' + sr + 'deg;' +
          '--fy:' + fy + 'px;--fr:' + fr + 'deg;--fd:' + fd + 's;--fdl:-' + fdl + 's">' +
          esc(words[w].charAt(c)) + '</span>';
        k++;
      }
      html += '</span>';
      if (w === fk1) html += '</span>';
    }
    return html;
  }

  /* Films collage layout: keep the design positions, but any poster that sits under the centred caption
     (the text keep-out rect) is relocated to the NEAREST grid spot that is (a) clear of the text and
     (b) not overlapping another poster. Non-central posters are placed first so the moved ones dodge
     them. Heights are estimated as width×2.4 (vw→vh, portrait). Returns [{x,y},…] per poster. */
  function layoutFilms(pl) {
    var TB = { x0: 18, x1: 82, y0: 39, y1: 65 };                  /* the caption/sub keep-out (step %) */
    var TOPB = { x0: 28, x1: 72, y0: -6, y1: 14 };                /* and the pinned player's strip at the top */
    function ovl(ax, aw, bx0, bx1) { return Math.min(ax + aw, bx1) - Math.max(ax, bx0); }
    var B = pl.map(function (P) { return { w: P.w, h: P.w * 2.4, x: P.x, y: P.y, pin: !!P.pin }; });
    var placed = [], move = [];
    B.forEach(function (b) {
      var central = !b.pin && ((ovl(b.x, b.w, TB.x0, TB.x1) > 3 && ovl(b.y, b.h, TB.y0, TB.y1) > 0) ||
        (ovl(b.x, b.w, TOPB.x0, TOPB.x1) > 3 && ovl(b.y, b.h, TOPB.y0, TOPB.y1) > 0));
      (central ? move : placed).push(b);
    });
    function free(x, y, w, h) {
      if (x < 0 || x + w > 100 || y < -h * 0.25 || y + h > 102) return false;
      if (ovl(x, w, TB.x0, TB.x1) > 0 && ovl(y, h, TB.y0, TB.y1) > 0) return false;   /* off the text */
      if (ovl(x, w, TOPB.x0, TOPB.x1) > 0 && ovl(y, h, TOPB.y0, TOPB.y1) > 0) return false;  /* and out from under the player */
      for (var i = 0; i < placed.length; i++) {
        var p = placed[i];
        if (x < p.x + p.w + 1.5 && x + w > p.x - 1.5 && y < p.y + p.h + 1.5 && y + h > p.y - 1.5) return false;
      }
      return true;
    }
    move.forEach(function (b) {                                   /* nearest free grid cell to the design spot */
      var best = null, bd = 1e9;
      for (var y = -b.h * 0.2; y <= 100 - b.h; y += 2) {
        for (var x = 0; x <= 100 - b.w; x += 2) {
          if (!free(x, y, b.w, b.h)) continue;
          var d = (x - b.x) * (x - b.x) + (y - b.y) * (y - b.y);
          if (d < bd) { bd = d; best = { x: x, y: y }; }
        }
      }
      if (best) { b.x = best.x; b.y = best.y; }
      placed.push(b);
    });
    return B.map(function (b) { return { x: b.x, y: b.y }; });
  }

  /* m-1008a: this was `body.jj-modal-open #jjms *{pointer-events:none}`, which re-styled all 5,158 of the story's nodes every time a score card
     or a panel opened or closed (the 40 / 210 / 400 ms hitch). Marking only #jjms is no cheaper: pointer-events is INHERITED, so the browser
     still walks every descendant. The rule is gone for the story itself: #jjms is its own stacking context at z-index 1, and every overlay
     that sets body.jj-modal-open is a full-screen layer at z 10000 that takes the pointer, so nothing in the story can be reached while one
     is up (checked: with a card and with the panel open, a 12 x 8 grid of points across the screen never lands inside #jjms).
     RULE for this class: nothing under body.jj-modal-open may end in a bare "*", and it may not switch an inherited property on a big subtree. */
  CSS += 'body.jj-modal-open #jj-sound-btn,body.jj-modal-open #jj-sound-mist{pointer-events:none!important;}';

  function init() {
    /* this page always opens on the story's first frame, so don't let the browser restore a
       previous scroll position over the top of the landing */
    try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
    /* ---- SLEEPABLE (m-1007a, the hand-over contract with storytime.js: see the end of this file) ----
       Everything below can be put to sleep (Replay Storytime) and woken again without being rebuilt. While `asleep`:
       - every requestAnimationFrame asked for in here is PARKED, not scheduled (so each loop simply stops), and re-asked on waking;
       - every setInterval, every window / document listener and every Mutation / Resize observer callback in here returns at once;
       - the story's nodes are out of the render tree (html.jjms-asleep, in the CSS) and its clips are paused.
       These four names shadow the globals for the whole of init(); jjOn / jjOff stand in for window / document .addEventListener. */
    var asleep = false, parkedRaf = [], onMap = [], nearNow = null, skyCull = null;
    var requestAnimationFrame = function (f) { if (asleep) { parkedRaf.push(f); return 0; } return window.requestAnimationFrame(f); };
    var setInterval = function (f, ms) { return window.setInterval(function () { if (!asleep) f(); }, ms); };
    var MutationObserver = function (cb) { return new window.MutationObserver(function (a, b) { if (!asleep) cb(a, b); }); };
    var ResizeObserver = function (cb) { return new window.ResizeObserver(function (a, b) { if (!asleep) cb(a, b); }); };
    function jjOn(t, type, fn, opt) { var w = function (e) { if (!asleep) return fn.call(this, e); }; onMap.push([t, type, fn, w]); t.addEventListener(type, w, opt); }
    function jjOff(t, type, fn, opt) { for (var i = onMap.length - 1; i >= 0; i--) { var m = onMap[i]; if (m[0] === t && m[1] === type && m[2] === fn) { t.removeEventListener(type, m[3], opt); onMap.splice(i, 1); return; } } t.removeEventListener(type, fn, opt); }
    var WOKEN = !!MSD.woken;                                     /* built under the tale's cover, at jj:mystory-wake: only what the first screen needs starts now, the rest after the lift */
    function afterFirst(fn) { if (!WOKEN || MSD.lifted) { fn(); return; } MSD.later.push(fn); }
    function firstHold(p) { if (MSD.hold) MSD.hold.push(p); }      /* a promise the 'ready' answer waits for (first-screen art), capped in wake() */
    var clipVis = null, clipFar = null;
    function governClip(v) {                                     /* see THE SLEEP RULE, FINISHED near the end of init */
      if (!v || v._jjGov || !('IntersectionObserver' in window)) return; v._jjGov = true;
      var want = !!v.getAttribute('data-auto'), vis = false, out = false, play0 = v.play, pause0 = v.pause, saved = null;
      v.play = function () { want = true; if (vis && !out) return play0.call(v); return Promise.resolve(); };
      v.pause = function () { want = false; return pause0.call(v); };
      v._jjVis = function (on) { vis = on; if (on && want && !out) { var p = play0.call(v); if (p && p.catch) p.catch(function () {}); } else if (!on && !v.paused) pause0.call(v); };
      v._jjFar = function (far) {
        if (far && !out && v.loop && (v.currentSrc || v.querySelector('source') || v.getAttribute('src'))) { out = true; if (!v.paused) pause0.call(v); saved = [v.innerHTML, v.getAttribute('src')]; v.innerHTML = ''; v.removeAttribute('src'); try { v.load(); } catch (e) {} }
        else if (!far && out) { out = false; if (saved) { if (saved[0]) v.innerHTML = saved[0]; if (saved[1]) v.setAttribute('src', saved[1]); saved = null; try { v.load(); } catch (e) {} } if (vis && want) { var p = play0.call(v); if (p && p.catch) p.catch(function () {}); } } };
      if (!clipVis) { clipVis = new IntersectionObserver(function (es) { for (var i = 0; i < es.length; i++) if (es[i].target._jjVis) es[i].target._jjVis(es[i].isIntersecting); }, { rootMargin: '15% 0px 15% 0px' });
        clipFar = new IntersectionObserver(function (es) { for (var i = 0; i < es.length; i++) if (es[i].target._jjFar) es[i].target._jjFar(!es[i].isIntersecting); }, { rootMargin: '200% 0px 200% 0px' }); }
      clipVis.observe(v); clipFar.observe(v);
    }
    var st = document.createElement('style'); st.id = 'jjms-style'; st.textContent = CSS; document.head.appendChild(st);
    /* ---- PERF + calmer type (2026-09-17). Measured: ~375 animations running, ~180 of them nowhere near the screen, and a
       per-letter float that read a layout box and wrote a transform for EVERY letter on EVERY frame. Three blunt rules:
       1. anything in a step that is not the current one (or its neighbours) is paused — whatever it is, now or in future;
       2. the sky's stars / moons / nebulae only tick while they are on screen (IntersectionObserver, see governSky);
       3. captions move as ONE block (JJ_MS_TEXT picks the style) — no per-letter scatter, no per-letter float.
       will-change is dropped everywhere except the current step: hundreds of promoted layers were costing more than they saved. */
    var TXT = window.JJ_MS_TEXT || 'wordsfocus';   /* Joe's pick (2026-09-17): word by word IN, focus pull OUT. 'rise' | 'drift' | 'zoom' | 'fade' are the scroll-scrubbed block styles */
    var K = { rise: ['translate:0 46px', 'translate:0 -46px'], drift: ['translate:-60px 0', 'translate:60px 0'], zoom: ['scale:.9', 'scale:1.08'], fade: ['', ''] }[TXT] || ['translate:0 46px', 'translate:0 -46px'];
    var st2 = document.createElement('style'); st2.id = 'jjms-perf'; st2.textContent =
      '#jjms .step:not(.near) *,#jjms .step:not(.near) *::before,#jjms .step:not(.near) *::after{animation-play-state:paused!important;will-change:auto!important;}' +
      '#jjms-sky .jj-off,#jjms-sky .jj-off *{animation-play-state:paused!important;}' +
      /* THE SLEEP RULE, FINISHED (m-1008a; the audit found 81 to 206 animations running on things nobody could see, on every slide):
         - a step, and the finale (which the rule above never covered: 48 infinite animations from the moment the page built), animates
           only while it is on screen or within a quarter of a screen of it (.jj-on, one IntersectionObserver: see sleepRule());
         - an era's scenery animates, and keeps its promoted layers, only while that era is actually showing (.shown, set in the world's
           tick: it has begun to rise and has not fully sunk), not for the whole screen either side that .on covers. */
      '#jjms .step:not(.jj-on) *,#jjms .step:not(.jj-on) *::before,#jjms .step:not(.jj-on) *::after,#jjms .finale:not(.jj-on) *,#jjms .finale:not(.jj-on) *::before,#jjms .finale:not(.jj-on) *::after{animation-play-state:paused!important;}' +
      '#jjms .finale:not(.jj-on) *,#jjms .finale:not(.jj-on) *::before,#jjms .finale:not(.jj-on) *::after{will-change:auto!important;}' +
      '#jjms-world .wera:not(.shown) *,#jjms-world .wera:not(.shown) *::before,#jjms-world .wera:not(.shown) *::after{animation-play-state:paused!important;will-change:auto!important;}' +
      /* BEHIND THE SWITCH (/storytime?skipfar=1#my-story, or window.JJ_MS_SKIPFAR = true; OFF by default until Joe has scrolled it both
         ways): see skipFar() near the end of init. `?skipfar=steps` and `?skipfar=sky` turn on one half only (html.jjms-skipfar = the
         steps and eras, html.jjms-skyfar = the sky), for telling the two apart.
         - a step (or the finale) more than a screen from the viewport is not rendered at all (content-visibility:hidden; a step's height is
           fixed in vh by the CSS, so its box and the page's length do not change; the finale's is pinned in px while it is skipped);
         - an era that is not within a screen of its slides is not rendered either;
         - THE SKY: every star, moon, nebula and galaxy more than 40% of a screen (+60 px) away is hidden and gives up its own layer (each
           used to keep one for the whole 15,000 px: ~300 layers), and the dots and sparkles that do not twinkle stop being promoted at
           all. Which ones are near is worked out in render() from numbers it already has (each item's place in its layer, the layer's
           drift): no observer, no reads of the items. Same sky: the same 314 things in the same places, drifting at the same speeds. */
      'html.jjms-skipfar #jjms .step.jj-far,html.jjms-skipfar #jjms .finale.jj-far{content-visibility:hidden;}' +
      'html.jjms-skipfar #jjms-world .wera:not(.on){content-visibility:hidden;}' +
      'html.jjms-skyfar #jjms-sky .jj-off,html.jjms-skyfar #jjms-sky .jj-off img{visibility:hidden!important;will-change:auto!important;}' +
      'html.jjms-skyfar #jjms-sky img.gdot:not(.tw),html.jjms-skyfar #jjms-sky img.gstar:not(.tw){will-change:auto;}' +
      '#jjms-sky .jj-dodge{opacity:0!important;transition:opacity .35s ease!important;}#jjms .step .jj-dodge{opacity:.16!important;filter:blur(1.5px)!important;transition:opacity .4s ease,filter .4s ease!important;pointer-events:none!important;}' +
      '#jjms .step .ch:not(.mch){animation:none!important;translate:none!important;rotate:none!important;transform:none!important;will-change:auto!important;}' +
      '#jjms .step .ch.mch{display:inline-block;animation:none!important;transition:transform 3.4s cubic-bezier(.3,0,.6,1),opacity 3s ease .3s,color .3s ease,text-shadow .3s ease;color:#7CF9C4;text-shadow:0 0 12px rgba(124,249,196,.9);}' +
      '#jjms .step .ch.mch.go{opacity:0!important;}' +
      '#jjms .jjms-shock{position:absolute;left:50%;top:58%;width:min(15vw,24vh);translate:-50% 40%;scale:.2;opacity:0;z-index:6;pointer-events:none;transition:translate .45s cubic-bezier(.34,1.7,.5,1),scale .45s cubic-bezier(.34,1.7,.5,1),opacity .25s ease;}#jjms .jjms-shock.on{translate:-50% 0;scale:1;opacity:1;animation:jjmsShock .14s linear 5 .45s;}#jjms .jjms-shock img{display:block;width:100%;height:auto;filter:drop-shadow(0 12px 22px rgba(0,0,0,.55));}' +
      '#jjms .jjms-shock b{position:absolute;left:78%;top:-18%;font-size:clamp(28px,3.4vw,56px);font-weight:900;color:#FFC531;text-shadow:0 3px 0 rgba(0,0,0,.5),0 0 18px rgba(255,197,49,.8);rotate:12deg;}@keyframes jjmsShock{0%,100%{transform:translateX(0);}25%{transform:translateX(-5px);}75%{transform:translateX(5px);}}' +
      '@keyframes jjmsCap{0%,30%{opacity:0;' + K[0] + ';}46%,54%{opacity:1;translate:0 0;scale:1;}70%,100%{opacity:0;' + K[1] + ';}}' +
      '@keyframes jjmsSub{0%,33%{opacity:0;' + K[0] + ';}48%,54%{opacity:.7;translate:0 0;scale:1;}68%,100%{opacity:0;' + K[1] + ';}}';
    if (TXT === 'wordsfocus') st2.textContent +=
      /* IN plays once as the caption reaches the middle (.cur, set in render): the words step up in turn. OUT (.leaving): the
         whole block pulls out of focus — softens, shrinks a touch, fades. One blur on one block for .6s is the only filter here. */
      '#jjms .step:is(:not(.tall),.feat) .cap:not(.hero),#jjms .step:is(:not(.tall),.feat) .sub{animation:none!important;opacity:0!important;scale:1!important;translate:0 0!important;filter:none;transition:opacity .5s ease,scale .7s cubic-bezier(.22,1,.36,1),filter .6s ease;}' +
      '#jjms .step:is(:not(.tall),.feat).cur .cap:not(.hero){opacity:1!important;}#jjms .step:is(:not(.tall),.feat).cur .sub{opacity:.7!important;}' +
      '#jjms .step:is(:not(.tall),.feat).leaving .cap:not(.hero),#jjms .step:is(:not(.tall),.feat).leaving .sub{opacity:0!important;scale:.93!important;filter:blur(7px);}' +
      '#jjms .step:is(:not(.tall),.feat) .cap:not(.hero) .word,#jjms .step .sub .word{opacity:0;translate:0 .55em;transition:opacity .45s ease,translate .5s cubic-bezier(.22,1,.36,1);transition-delay:calc(var(--wi,0) * 55ms);}' +
      '#jjms .step.cur .word{opacity:1!important;translate:0 0!important;}' +
      '#jjms .step.leaving .word{opacity:1!important;translate:0 0!important;transition:none!important;}';
    st2.textContent += '@keyframes jjmsJig{0%,100%{rotate:0deg;scale:1;}15%{rotate:-5deg;scale:1.06;}30%{rotate:4deg;scale:1.08;}45%{rotate:-3deg;scale:1.06;}60%{rotate:2deg;scale:1.04;}80%{rotate:-1deg;}}' +
      '#jjms .phw.jig img{animation:jjmsJig .9s ease-in-out 1!important;animation-play-state:running!important;}#jjms .phw.jig{z-index:50;}';
    st2.textContent += '#jjms .phw .phd{position:relative;}#jjms .phw .fxc{position:absolute;inset:0;z-index:-1;background:center/cover no-repeat;border-radius:calc(var(--pw,10vw) * 0.045);border:2px solid rgba(255,255,255,.45);box-sizing:border-box;box-shadow:0 10px 24px rgba(0,0,0,.5);opacity:0;transition:transform .55s cubic-bezier(.22,1,.36,1),opacity .4s ease;}' +
      '#jjms .step.live .phw .fxc{opacity:.5;}#jjms .phw:hover .fxc,#jjms .phw.hot .fxc,#jjms .phw.blown .fxc{opacity:1;}' +
      '#jjms .phw .fxc.fxl{transform:translate(-26%,3%) rotate(-9deg) scale(.94);}#jjms .phw .fxc.fxr{transform:translate(26%,3%) rotate(9deg) scale(.94);}' +
      '#jjms .phw:hover .fxc.fxl,#jjms .phw.hot .fxc.fxl{transform:translate(-40%,2%) rotate(-11deg) scale(.95);}#jjms .phw:hover .fxc.fxr,#jjms .phw.hot .fxc.fxr{transform:translate(40%,2%) rotate(11deg) scale(.95);}' +
      '#jjms .phw.blown .fxc.fxl{transform:translate(-58%,3%) rotate(-4deg) scale(.92);}#jjms .phw.blown .fxc.fxr{transform:translate(58%,3%) rotate(4deg) scale(.92);}';
    /* King Joe's "wink": he wears shades, so it is a head-tilt with a glint off the lens every few seconds (a true eyelid wink needs a second drawing) */
    st2.textContent += '#jjms .aglogo .agvid{display:block;width:100%;height:auto;aspect-ratio:700/900;object-fit:contain;}#jjms .aglogo:has(.agvid) .agin::after{display:none;}' +
      '#jjms .aglogo[aria-label="Joe"]:not(:has(.agvid)) .agin{animation:jjmsWinkTilt 5.2s ease-in-out infinite;}@keyframes jjmsWinkTilt{0%,82%,100%{rotate:0deg;}87%{rotate:-8deg;}93%{rotate:-8deg;}}' +
      '#jjms .aglogo[aria-label="Joe"] .agin::after{content:"\\2726";position:absolute;left:61%;top:33%;font-size:calc(var(--gw,10vw) * .22);line-height:1;color:#fff;text-shadow:0 0 .6vw #fff,0 0 1.4vw rgba(255,255,255,.8);opacity:0;pointer-events:none;animation:jjmsWinkGlint 5.2s ease-in-out infinite;}' +
      '@keyframes jjmsWinkGlint{0%,84%,100%{opacity:0;scale:.2;rotate:0deg;}89%{opacity:1;scale:1.25;rotate:45deg;}95%{opacity:0;scale:.6;rotate:90deg;}}';
    if (SDA) st2.textContent += '#jjms .stag{animation:jjmsPx linear both;animation-timeline:--jjstep;animation-range:cover 0% cover 100%;}' +
      '#jjms .stag:nth-of-type(3n){--d:.4;}#jjms .stag:nth-of-type(3n+1){--d:.14;}#jjms .stag:nth-of-type(3n+2){--d:.27;}';   /* place tags used to parallax on their own and drifted off their pictures (Joe): they sit with their set now */
    st2.textContent += '#jjms .gvid.port{width:calc(78vh * 9 / 16);max-width:none;aspect-ratio:9/16;}' +
      /* year groups: a back set hides toward the front one until the group is hovered (:has reads the geometry-driven .hot as well as :hover) */
      '#jjms .trav[data-grp]{transition:opacity .4s ease,translate .5s cubic-bezier(.22,1,.36,1),scale .5s cubic-bezier(.22,1,.36,1);}#jjms .trav.tuck{translate:var(--tkx,0) var(--tky,0);scale:.9;z-index:0;}' +
      '#jjms .tcc.tuck{opacity:0;transition:opacity .35s ease;}' +
      ['2024', '2025', '2026'].map(function (y) { var g = '[data-grp="' + y + '"]'; return '#jjms .step:has(.trav' + g + ':hover) .trav.tuck' + g + ',#jjms .step:has(.trav' + g + '.hot) .trav.tuck' + g + '{translate:0 0;scale:1;z-index:1;}#jjms .step:has(.trav' + g + ':hover) .tcc.tuck' + g + ',#jjms .step:has(.trav' + g + '.hot) .tcc.tuck' + g + '{opacity:1;}'; }).join('') +
      '#jjms .tcc.tyr span{font-weight:800;}' +
      '#jjms .jjms-flyer{position:absolute;z-index:3;pointer-events:none;height:auto;animation:jjmsFlyer 7s ease-in-out infinite;}@keyframes jjmsFlyer{0%,100%{translate:0 0;rotate:-2deg;}50%{translate:1.2vw -2.2vh;rotate:2deg;}}' +
      /* the sealed letter: two rolls and a wax seal; press it and the seal splits, the parchment unrolls and the words come up */
      '#jjms .jjscroll{position:absolute;z-index:3;min-width:150px;translate:-50% calc(-50% + var(--ride,0px));padding:0;border:0;background:none;cursor:pointer;color:#4a2f10;font:inherit;text-align:left;animation:jjmsTabBob 5s ease-in-out infinite;}' +
      '#jjms .jjscroll .sroll{display:block;height:1.2vw;border-radius:.6vw;background:linear-gradient(180deg,#c9a76a 0%,#f1dfb5 40%,#b8925a 100%);box-shadow:0 4px 12px rgba(0,0,0,.45);position:relative;z-index:2;}' +
      '#jjms .jjscroll .sbody{display:block;margin:0 .7vw;max-height:0;overflow:hidden;background:linear-gradient(180deg,#f3e4bd,#e6cf9b);box-shadow:inset 0 0 22px rgba(120,80,20,.25);transition:max-height .9s cubic-bezier(.22,1,.36,1);}' +
      '#jjms .jjscroll .slogo{display:block;width:58%;margin:.9vw auto 0;}#jjms .jjscroll.open .sbody{max-height:24vh;}#jjms .jjscroll .sbody{overflow:hidden;}#jjms .jjscroll .stext{font-size:clamp(8px,.62vw,11px);line-height:1.35;}#jjms .jjscroll .stext{display:block;padding:.8vw .9vw 1vw;font-style:italic;opacity:0;transition:opacity .6s ease .5s;}#jjms .jjscroll.open .stext{opacity:1;}#jjms .jjscroll .stext b{font-style:normal;color:#8a2a1c;}' +
      '#jjms .jjscroll .seal{position:absolute;left:50%;top:50%;width:2.6vw;height:2.6vw;min-width:26px;min-height:26px;translate:-50% -50%;z-index:4;transition:opacity .2s ease .5s;}' +
      '#jjms .jjscroll .seal i{position:absolute;top:0;bottom:0;width:50%;background:radial-gradient(circle at 40% 35%,#e2564a,#8d1f18 70%);box-shadow:0 3px 10px rgba(0,0,0,.5);transition:transform .7s cubic-bezier(.3,.6,.4,1),opacity .7s ease;}' +
      '#jjms .jjscroll .seal .sl{left:0;border-radius:100% 0 0 100%/50% 0 0 50%;}#jjms .jjscroll .seal .sr{right:0;border-radius:0 100% 100% 0/0 50% 50% 0;}' +
      '#jjms .jjscroll .seal .sj{position:absolute;inset:0;width:auto;background:none;box-shadow:none;display:flex;align-items:center;justify-content:center;color:rgba(255,220,200,.85);font-weight:900;font-style:normal;font-size:1.3vw;transition:opacity .2s ease;}' +
      '#jjms .jjscroll.open .seal .sl{transform:translate(-2.4vw,3vw) rotate(-70deg);opacity:0;}#jjms .jjscroll.open .seal .sr{transform:translate(2.4vw,3.2vw) rotate(64deg);opacity:0;}#jjms .jjscroll.open .seal .sj{opacity:0;}#jjms .jjscroll.open .seal{pointer-events:none;}' +
      '#jjms .jjscroll .shint{position:absolute;left:50%;top:100%;translate:-50% 8px;font-size:11px;letter-spacing:.03em;text-transform:none;white-space:nowrap;color:#eef2f8;opacity:.75;font-style:normal;}#jjms .jjscroll.open .shint{opacity:0!important;animation:none!important;transition:opacity .3s ease;}#jjms .jjscroll.open::after{display:none;}' +
      /* 'Watch again': a small film card for the Taiwan flight. Classic glass (50% white rim, black .4 + blur), the light wipes across on hover, pink on press; the thumbnail edge is feathered */
      '#jjms .jjrewatch{position:absolute;left:50%;top:75%;translate:-50% 0;z-index:7;display:none;opacity:0;pointer-events:none;align-items:center;gap:14px;padding:10px 20px 10px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.4);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#eef2f8;font:inherit;text-align:left;cursor:pointer;isolation:isolate;transition:border-color .3s ease,scale .3s ease;}' +
      '#jjms .jjrewatch .rwclip{position:absolute;inset:0;border-radius:inherit;overflow:hidden;z-index:-1;pointer-events:none;}#jjms .jjrewatch .rwclip i{position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,.18) 50%,transparent 70%);transform:translateX(-110%);transition:transform .6s ease;}' +
      /* designer Joe peeks over the pill's top edge (the part of him "behind" it is clipped away): he pops up once the pill is fully in, bobs, and rises a little more on hover */
      '#jjms .jjrewatch .rwpk{position:absolute;right:24px;bottom:100%;width:72px;height:96px;overflow:hidden;pointer-events:none;}' +   /* the window he peeks through: its bottom is the pill's top edge */
      '#jjms .jjrewatch .rwpeek{position:absolute;left:4px;bottom:-20px;width:64px;height:auto;max-width:none;transform-origin:50% 100%;transform:translateY(80px);transition:transform .45s cubic-bezier(.3,1.5,.5,1);}' +
      '#jjms .jjrewatch.lit .rwpeek{animation:jjRwPeek 1s cubic-bezier(.3,1.5,.5,1) .25s both,jjRwBob 3.2s ease-in-out 1.3s infinite;}#jjms .jjrewatch .rwpi{position:absolute;inset:0;transform-origin:50% 100%;transition:transform .45s cubic-bezier(.3,1.5,.5,1);}#jjms .jjrewatch.lit:hover .rwpi{transform:translateY(-8px) rotate(-4deg);}' +
      '@keyframes jjRwPeek{from{transform:translateY(80px);}to{transform:translateY(0);}}@keyframes jjRwBob{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(3px) rotate(1.5deg);}}' +
      '#jjms .jjrewatch:hover .rwclip i{transform:translateX(110%);}#jjms .jjrewatch:hover{background:rgba(0,0,0,.5);scale:1.04;}#jjms .jjrewatch:active{border-color:#ff5fc8;scale:.97;box-shadow:0 0 0 3px rgba(255,95,200,.35);}' +
      '#jjms .jjrewatch .rwthumb{position:relative;width:clamp(72px,6.4vw,120px);aspect-ratio:16/10;border-radius:40%/48%;overflow:hidden;flex:none;-webkit-mask:radial-gradient(closest-side,#000 72%,transparent);mask:radial-gradient(closest-side,#000 72%,transparent);background:radial-gradient(circle at 50% 40%,#3b5a8f,#16213b);}' +
      '#jjms .jjrewatch .rwthumb img{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;object-position:50% 40%;}' +
      '#jjms .jjrewatch .rwplay{position:absolute;left:50%;top:50%;width:26px;height:26px;translate:-50% -50%;border-radius:50%;background:rgba(0,0,0,.45);box-shadow:0 0 12px rgba(0,0,0,.5);animation:jjRwPulse 2.2s ease-in-out infinite;}' +
      '#jjms .jjrewatch .rwplay::after{content:"";position:absolute;left:10px;top:7px;border-left:10px solid #fff;border-top:6px solid transparent;border-bottom:6px solid transparent;}' +
      '@keyframes jjRwPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,.35);}50%{box-shadow:0 0 0 8px rgba(255,255,255,0);}}' +
      '#jjms .jjrewatch .rwtext{display:flex;flex-direction:column;gap:2px;line-height:1.1;}#jjms .jjrewatch small{font-size:11px;letter-spacing:.03em;text-transform:none;opacity:.75;}#jjms .jjrewatch b{font-size:clamp(14px,1.1vw,19px);font-weight:700;}' +
      'html.jjms-cutseen #jjms .jjrewatch{display:flex;}' +
      '#jjms .jjrewatch.jjdream-again{translate:0 0;opacity:1;pointer-events:auto;padding:8px 18px 8px 8px;gap:12px;font-size:inherit;}html:not(.jjms-dreamseen) #jjms .jjrewatch.jjdream-again{display:none !important;}html.jjms-dreamseen #jjms .jjrewatch.jjdream-again{display:flex !important;}' +
      '#jjms .jjrewatch .rwsleep{right:14px;width:118px;height:62px;}#jjms .jjrewatch .rwsleep .rwpeek{left:0;bottom:-12px;width:118px;}' +
      '#jjms .jjrewatch .rwz{position:absolute;right:6px;bottom:calc(100% + 26px);width:40px;height:50px;pointer-events:none;}#jjms .jjrewatch .rwz b{position:absolute;left:0;bottom:0;font-size:15px;font-weight:800;line-height:1;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.6);opacity:0;animation:drZ 3s ease-in infinite;}#jjms .jjrewatch .rwz b:nth-child(2){animation-delay:1s;font-size:18px;}#jjms .jjrewatch .rwz b:nth-child(3){animation-delay:2s;font-size:22px;}' +   /* it appears once the film has played (scrolling back up from Skyrock) */
      '@media (max-width:767px){#jjms .jjrewatch{top:76%;padding:8px 14px 8px 8px;gap:10px;}}' +
      '#jjms .step[data-feat="tabs"] .jjrewatch:not(.jjdream-again){top:calc(50% + 13.5vh + max(84px, 11vh));}' +   /* in the gap under the tablets / their skill stacks and above the Skyrock slide (Joe, 2026-09-28; it used to tuck in right under the tablets) */
      '#jjms .jjscroll:not(.open):hover .seal{scale:1.1;}#jjms .jjscroll:not(.open):hover .sroll{filter:brightness(1.08);}' +
      /* BREAK ITEMS (tablets, the sealed letter, the reveal card): until pressed they wear their hint, a pulsing tap ring, and as their
         slide leaves they ride down with the scroll (--ride, set in render) so they stay in view a moment longer (Joe, 2026-09-18) */
      '#jjms .jjms-tab:not(.touched) .thint,#jjms .jjscroll:not(.touched) .shint{opacity:1;animation:jjmsPrompt 1.6s ease-in-out infinite;}#jjms .jjms-reveal:not(.touched) .rvbtn{animation:jjmsPrompt 1.6s ease-in-out infinite;}' +
      '@keyframes jjmsPrompt{0%,100%{scale:1;filter:brightness(1);}50%{scale:1.08;filter:brightness(1.25);}}' +
      '#jjms .jjms-tab:not(.touched)::after,#jjms .jjscroll:not(.touched)::after,#jjms .jjms-reveal:not(.touched)::after{display:none !important;content:"";position:absolute;left:50%;top:50%;width:70%;aspect-ratio:1;translate:-50% -50%;border-radius:50%;border:2px solid rgba(255,201,61,.85);pointer-events:none;animation:jjmsTapRing 1.8s ease-out infinite;}' +
      '#jjms .jjms-reveal:not(.touched)::after{width:100%;}@keyframes jjmsTapRing{0%{scale:.5;opacity:.9;}100%{scale:1.7;opacity:0;}}' +
      '@media (max-width:900px){#jjms .jjms-tv{width:min(62vw,40vh)!important;}}#jjms .jjms-tv{container-type:inline-size;position:absolute;left:50%;top:3%;translate:-50% 0;z-index:4;width:min(27vw,34vh,430px);aspect-ratio:16/11;pointer-events:none;filter:drop-shadow(0 22px 40px rgba(0,0,0,.5));}#jjms .jjms-tv .tvframe{position:absolute;inset:0 0 9% 0;border-radius:14px;border:3px solid rgba(255,255,255,.92);background:#07090f;box-sizing:border-box;}#jjms .jjms-tv .tvstand{position:absolute;left:50%;bottom:0;width:26%;height:9%;translate:-50% 0;background:linear-gradient(#fff,#d9dde6);clip-path:polygon(38% 0,62% 0,62% 55%,100% 55%,100% 100%,0 100%,0 55%,38% 55%);}#jjms .jjms-tv .tvimg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;}' +
      '#jjms .jjms-imdb{position:absolute;left:3.5%;top:5%;width:93%;height:78%;z-index:1;display:flex;flex-direction:column;border-radius:10px;background:#0b1220;text-align:left;pointer-events:auto;opacity:.95;font-size:clamp(13px,5.4cqw,22px);transition:opacity .3s ease,height .5s cubic-bezier(.22,1,.36,1);overflow:visible;}#jjms .jjms-tv.open .jjms-imdb{height:auto;min-height:32%;z-index:5;box-shadow:0 20px 50px rgba(0,0,0,.6);}' +
      '#jjms .jjms-imdb:hover{opacity:1;}#jjms .jjms-imdb .imstand{display:none;}' +
      '#jjms .jjms-imdb .imh{position:relative;padding:.5em .9em .4em;border-bottom:1px solid rgba(255,255,255,.12);background:linear-gradient(90deg,rgba(245,197,24,.16),transparent 70%);}' +
      '#jjms .jjms-imdb .imk{display:inline-block;font-size:.72em;letter-spacing:.02em;background:#f5c518;color:#111;padding:.15em .6em;border-radius:4px;font-weight:800;}#jjms .jjms-imdb h4{margin:.2em 0 0;font-size:1.2em;font-weight:800;}#jjms .jjms-imdb .imh small{display:block;font-size:.72em;opacity:.55;letter-spacing:.04em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}#jjms .jjms-imdb .imh small .leg{display:none;}#jjms .jjms-imdb.open .imh small .leg{display:inline;}#jjms .jjms-imdb.open .imh small{padding-right:7.5em;}' +
      '#jjms .jjms-imdb .impick{display:none;position:absolute;right:.8em;bottom:.5em;padding:.3em .8em;border-radius:999px;border:1px solid rgba(245,197,24,.6);background:rgba(245,197,24,.12);color:#f5c518;font:inherit;font-size:.75em;font-weight:800;letter-spacing:.06em;cursor:pointer;transition:background .2s ease;}#jjms .jjms-imdb .impick:hover{background:#f5c518;color:#111;}#jjms .jjms-imdb.open .impick{display:block;}' +
      '#jjms .jjms-imdb ol{margin:0;padding:.1em 0 0;list-style:none;overflow:hidden;max-height:3.4em;transition:max-height .5s cubic-bezier(.22,1,.36,1);-webkit-mask:linear-gradient(180deg,#000 55%,transparent 100%);mask:linear-gradient(180deg,#000 55%,transparent 100%);scrollbar-width:thin;scrollbar-color:rgba(245,197,24,.7) rgba(255,255,255,.08);}' +
      '#jjms .jjms-imdb.open ol{max-height:32vh;overflow-y:auto;padding-bottom:26px;-webkit-mask:linear-gradient(180deg,#000 84%,transparent 100%);mask:linear-gradient(180deg,#000 84%,transparent 100%);}#jjms .jjms-imdb ol::-webkit-scrollbar{width:6px;}#jjms .jjms-imdb ol::-webkit-scrollbar-thumb{background:rgba(245,197,24,.7);border-radius:3px;}' +
      '#jjms .jjms-imdb li{position:relative;display:flex;align-items:center;gap:.7em;padding:.4em 1em;font-size:1em;cursor:pointer;transition:background .2s ease,opacity .3s ease;}#jjms .jjms-imdb li:hover{background:rgba(245,197,24,.12);}#jjms .jjms-imdb li b{width:1.6em;opacity:.55;font-size:.85em;}' +
      '#jjms .jjms-imdb li.added{background:rgba(0,0,0,.45);opacity:.62;}#jjms .jjms-imdb li .imw{display:none;position:absolute;right:14px;top:50%;width:16px;height:16px;translate:0 -50%;color:transparent;font-size:0;}#jjms .jjms-imdb li .imw::before{content:"";position:absolute;left:1px;top:2px;width:5px;height:9px;border-right:2.5px solid #f5c518;border-bottom:2.5px solid #f5c518;border-radius:0 0 2px 0;rotate:45deg;}#jjms .jjms-imdb li.added .imw{display:block;}#jjms .jjms-imdb li.added .imr{opacity:0;}' +
      '#jjms .imscrim{position:fixed;inset:0;z-index:3;background:rgba(3,6,14,.2);opacity:0;pointer-events:none;transition:opacity .4s ease;}#jjms .imscrim.on{opacity:1;pointer-events:auto;}' +
      '#jjms .jjms-imdb .imclose{display:none;position:absolute;right:-14px;top:-14px;width:30px;height:30px;border-radius:50%;border:2px solid #243149;background:#0b1220;color:#eef2f8;font:inherit;font-size:18px;line-height:26px;text-align:center;padding:0;cursor:pointer;}#jjms .jjms-imdb.open .imclose{display:block;}' +
      '#jjms .jjms-imdb li.pick{background:rgba(245,197,24,.22);box-shadow:inset 3px 0 0 #f5c518;}' +
      '#jjms .jjms-imdb .imt{flex:1;min-width:0;display:flex;flex-direction:column;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}#jjms .jjms-imdb .imt small{font-weight:600;opacity:.55;font-size:.8em;}#jjms .jjms-imdb .imt em{font-style:italic;opacity:.9;}' +
      '#jjms .jjms-imdb .imr{display:inline-flex;align-items:center;gap:3px;font-weight:800;font-size:.85em;min-width:3em;justify-content:flex-end;transition:opacity .2s ease;}#jjms .jjms-imdb .imr .y{color:#f5c518;font-style:normal;}#jjms .jjms-imdb .imr .b{color:#5799ef;font-style:normal;}#jjms .jjms-imdb .imr.me{min-width:2.4em;}' +
      '#jjms .jjms-imdb .imchev{position:absolute;left:50%;bottom:-14px;translate:-50% 0;width:32px;height:32px;border-radius:50%;border:2px solid #243149;background:#f5c518;cursor:pointer;padding:0;box-shadow:0 6px 16px rgba(0,0,0,.5);transition:transform .4s ease;animation:jjmsChev 1.6s ease-in-out infinite;}#jjms .jjms-imdb .imchev i{position:absolute;left:50%;top:44%;width:9px;height:9px;border-right:2.5px solid #111;border-bottom:2.5px solid #111;translate:-50% -50%;rotate:45deg;}' +
      '#jjms .jjms-imdb.open .imchev{transform:rotate(180deg);animation:none;}@keyframes jjmsChev{0%,100%{translate:-50% 0;}50%{translate:-50% 4px;}}' +
      '#jjms .jjms-imdb .imtoast{position:absolute;left:50%;top:100%;translate:-50% 22px;padding:6px 14px;border-radius:999px;background:#f5c518;color:#111;font-size:11px;font-weight:800;white-space:nowrap;opacity:0;transition:opacity .3s ease,translate .3s ease;pointer-events:none;}#jjms .jjms-imdb .imtoast.on{opacity:1;translate:-50% 28px;}' +
      /* the wizard: bottom-left of the grandad slide, on his loop, no float */
      '#jjms .jjms-wizwrap{position:absolute;left:calc(50% - min(12vw,17vh) / 2 - min(13vw,22vh) - 1vw);bottom:15vh;width:min(13vw,22vh);z-index:3;text-align:center;opacity:0;transition:opacity .6s ease;}#jjms .step.live .jjms-wizwrap{opacity:1;}#jjms .jjms-wizwrap .jjms-wiz{position:static;display:block;width:100%;animation:none;filter:drop-shadow(0 10px 24px rgba(0,0,0,.5));}' +
      '#jjms .jjms-wizwrap .wizcap{display:inline-block;margin-bottom:-1.2vh;padding:.4em 1em;border-radius:999px;background:rgba(10,14,26,.72);border:1px solid rgba(255,255,255,.3);font-size:clamp(11px,.9vw,14px);font-weight:700;letter-spacing:.04em;transition:background .4s ease;}#jjms .jjms-wizwrap .wizcap.named{background:rgba(255,0,245,.28);border-color:rgba(255,0,245,.6);}' +
      /* the reveal card: a blurred portrait with a question mark until it is pressed */
      '#jjms .jjms-reveal{position:relative;z-index:3;display:block;margin:3.5vh 0 0;translate:0 var(--ride,0px);padding:0;border:0;background:none;cursor:pointer;width:min(12vw,17vh);aspect-ratio:9/16;animation:jjmsRvFloat 4.5s ease-in-out infinite;transition:scale .35s cubic-bezier(.22,1,.36,1);}' +
      '#jjms .jjms-reveal:hover{scale:1.05;}@keyframes jjmsRvFloat{0%,100%{translate:0 0;rotate:-1.5deg;}50%{translate:0 -1.4vh;rotate:1.5deg;}}' +
      '#jjms .jjms-reveal .rvshell{position:absolute;inset:0;display:block;border-radius:14px;overflow:hidden;border:2px solid rgba(255,255,255,.45);box-shadow:0 0 44px rgba(255,0,245,.4),0 20px 50px rgba(0,0,0,.6);background:#0b1220;}' +
      '#jjms .jjms-reveal .rvshell img{display:block;width:100%;height:100%;object-fit:cover;filter:blur(14px) brightness(.55);scale:1.18;transition:filter .9s ease,scale .9s ease;}' +
      '#jjms .jjms-reveal .rvq{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:clamp(44px,6vw,96px);font-weight:900;color:#fff;text-shadow:0 0 30px rgba(255,0,245,.95),0 4px 12px rgba(0,0,0,.6);transition:opacity .5s ease,scale .5s ease;}' +
      '#jjms .jjms-reveal .rvbtn{position:absolute;left:50%;bottom:-2.6em;translate:-50% 0;white-space:nowrap;padding:.6em 1.25em;border-radius:999px;background:#FF00F5;color:#fff;font-weight:800;font-size:clamp(12px,1vw,16px);box-shadow:0 8px 22px rgba(0,0,0,.45);}' +
      '#jjms .jjms-reveal.done .rvshell img{filter:none;scale:1;}#jjms .jjms-reveal.done .rvq{opacity:0;scale:1.6;}#jjms .jjms-reveal.done .rvbtn{background:rgba(10,14,26,.7);border:1px solid rgba(255,255,255,.35);}' +
      '#jjms-toast{position:fixed;left:50%;bottom:max(20px,6vh);z-index:940;translate:-50% 20px;padding:12px 20px;border-radius:999px;background:rgba(10,14,26,.86);border:1px solid rgba(255,255,255,.3);color:#eef2f8;font-family:"Joes Journey Headline",Georgia,serif;font-size:clamp(13px,1vw,16px);font-weight:700;opacity:0;pointer-events:none;transition:opacity .4s ease,translate .4s ease;backdrop-filter:blur(8px);}#jjms-toast.on{opacity:1;translate:-50% 0;}#jjms-toast b{color:#FFC93D;}';
    st2.textContent += '#jjms .jjms-tab{position:absolute;z-index:6;width:clamp(96px,9vw,150px);translate:-50% calc(-50% + var(--ride,0px));background:none;border:0;padding:0;cursor:pointer;transition:opacity .5s ease,scale .5s ease;animation:jjmsTabBob 4.5s ease-in-out infinite;}' +
      '#jjms .jjms-tab svg{display:block;width:100%;height:auto;overflow:visible;filter:drop-shadow(0 12px 22px rgba(0,0,0,.55));}#jjms .jjms-tab .fig{display:none;filter:drop-shadow(0 0 6px rgba(255,197,49,.8));}#jjms .jjms-tab.figma .fig{display:block;}#jjms .jjms-tab.figma .spiral{display:none;}#jjms .jjms-tab .stone{fill:#2b3a55;stroke:#8fa6cc;stroke-width:2.5;}#jjms .jjms-tab .spiral{stroke:#FFC531;stroke-width:4;stroke-linecap:round;filter:drop-shadow(0 0 6px rgba(255,197,49,.8));}' +
      '#jjms .jjms-tab .crk{fill:none;stroke:#0b1220;stroke-width:3;stroke-linejoin:round;stroke-dasharray:400;stroke-dashoffset:400;transition:stroke-dashoffset .45s ease-out;}#jjms .jjms-tab.crack .c1,#jjms .jjms-tab.crack .c2{stroke-dashoffset:0;}#jjms .jjms-tab.crack{animation:jjmsTabShake .5s ease-in-out 1;}' +
      '#jjms .jjms-tab .tlbl{position:absolute;left:50%;top:50%;translate:-50% -50%;margin-top:34%;font-size:clamp(11px,1vw,15px);font-weight:800;letter-spacing:.06em;color:#eef2f8;text-shadow:0 2px 6px rgba(0,0,0,.8);pointer-events:none;}#jjms .jjms-tab .thint{position:absolute;left:50%;top:100%;translate:-50% 8px;font-size:11px;letter-spacing:.03em;text-transform:none;white-space:nowrap;color:rgba(238,242,248,.7);opacity:0;transition:opacity .3s ease;pointer-events:none;}#jjms .jjms-tab:hover .thint,#jjms .jjms-tab.crack .thint{opacity:1;}' +
      '#jjms .jjms-tab.burst{opacity:0;scale:1.5;pointer-events:none;animation:none;}' +
      '@keyframes jjmsTabBob{0%,100%{transform:rotate(-2deg) translateY(0);}50%{transform:rotate(2deg) translateY(-8px);}}@keyframes jjmsTabShake{0%,100%{transform:translate(0,0) rotate(-2deg);}20%{transform:translate(-5px,2px) rotate(-4deg);}40%{transform:translate(5px,-2px) rotate(1deg);}60%{transform:translate(-4px,1px) rotate(-3deg);}80%{transform:translate(4px,0) rotate(0deg);}}' +
      '#jjms .stag.held{opacity:0!important;pointer-events:none;transition:transform .8s cubic-bezier(.2,.8,.2,1),opacity .5s ease;}#jjms .step.feat .stag.freed{animation:none;translate:0 0;}#jjms .step.feat .stag.freed.set{transition:opacity .4s ease;}#jjms .stag.freed{transition:transform .85s cubic-bezier(.2,.8,.2,1),opacity .4s ease;transition-delay:var(--fd,0s);}' +
      '#jjms .jjms-shard{position:absolute;width:14px;height:18px;background:#2b3a55;border:1.5px solid #8fa6cc;border-radius:2px;pointer-events:none;animation:jjmsShard .9s ease-out forwards;}@keyframes jjmsShard{to{transform:translate(var(--sx),var(--sy)) rotate(var(--sr));opacity:0;}}';
    /* the tablets: gather their pills at mount, crack on the first press, burst on the second */
    setTimeout(function () { Array.prototype.forEach.call(document.querySelectorAll('#jjms .jjms-tab'), function (tab) { var st = tab.closest('.step'), g = tab.getAttribute('data-grp'); if (!st) return;
      var pills = Array.prototype.slice.call(st.querySelectorAll('.stag[data-grp="' + g + '"]')), tr = tab.getBoundingClientRect(), tcx = tr.left + tr.width / 2, tcy = tr.top + tr.height / 2;
      var sg0 = (st.querySelector('.stage') || st).getBoundingClientRect();
      pills.forEach(function (pl) { var r = pl.getBoundingClientRect(); pl._bx = pl.offsetLeft; pl._by = pl.offsetTop; pl.style.transform = 'translate(' + (tcx - r.left - r.width / 2).toFixed(0) + 'px,' + (tcy - r.top - r.height / 2).toFixed(0) + 'px) scale(.15)'; });
      var stage = 0; tab.addEventListener('click', function (e) { e.stopPropagation(); stage++;
        if (stage === 1) { tab.classList.add('crack'); return; }
        tab.classList.add('burst'); window.jjSay && window.jjSay('tada'); tab.style.opacity = ''; tab.style.scale = ''; tab.style.zIndex = '';   /* the stage's inline values would hold the broken stone on screen until the next scroll */
        for (var k = 0; k < 10; k++) { var sh = document.createElement('i'); sh.className = 'jjms-shard'; var ang = k / 10 * Math.PI * 2; sh.style.cssText = 'left:' + tab.style.left + ';top:' + tab.style.top + ';--sx:' + (Math.cos(ang) * (90 + k * 9)).toFixed(0) + 'px;--sy:' + (Math.sin(ang) * (70 + k * 7) + 40).toFixed(0) + 'px;--sr:' + (k * 70) + 'deg'; st.appendChild(sh); setTimeout(function (x) { return function () { x.remove(); }; }(sh), 1000); }
        var trB = tab.getBoundingClientRect(), sgB = (st.querySelector('.stage') || st).getBoundingClientRect(), cols = 2, maxW = pills.reduce(function (m, q) { return Math.max(m, q.offsetWidth); }, 80), cw = maxW + 12, ch = pills.reduce(function (m, q) { return Math.max(m, q.offsetHeight); }, 26) + 8, cxB = Math.max(cw + maxW / 2 + 12, Math.min(sgB.width - cw - maxW / 2 - 12, trB.left + trB.width / 2 - sgB.left)), cyB = trB.top + trB.height / 2 - sgB.top;
        tab._stack = []; var tcx0 = trB.left + trB.width / 2 - sgB.left, tcy0 = trB.top + trB.height / 2 - sgB.top;
        pills.forEach(function (pl, i) { pl.classList.remove('held'); pl.classList.add('freed'); pl.style.setProperty('--fd', (i * 45) + 'ms');
          var col = i % cols, row = Math.floor(i / cols), rowsN = Math.ceil(pills.length / cols), tx = cxB + (col - (cols - 1) / 2) * cw, ty = cyB + (row - (rowsN - 1) / 2) * ch;   /* a tidy stack where the stone stood */
          tab._stack.push({ pl: pl, dx: tx - tcx0, dy: ty - tcy0 });
          pl.style.transform = 'translate(' + (tx - pl.offsetLeft - pl.offsetWidth / 2).toFixed(0) + 'px,' + (ty - pl.offsetTop - pl.offsetHeight / 2).toFixed(0) + 'px)'; });
        setTimeout(function () { pills.forEach(function (pl) { pl.classList.add('set'); }); }, 1200);   /* after the burst the stack rides with the stone's spot (no more transitions) */   /* live layout boxes: a cached one went stale the moment the window changed size */
        if (window.jjScore) window.jjScore.award('skills-burst'); }); }); }, 1500);
    st2.textContent += '#jjms .jjms-carry{position:fixed;left:0;top:0;z-index:6;opacity:0;pointer-events:none;transition:opacity .25s ease;}#jjms .jjms-carry img{display:block;width:100%;height:auto;filter:drop-shadow(0 10px 22px rgba(0,0,0,.55));}#jjms .jjms-carry.land img{animation:jjmsCarryBob 2.6s ease-in-out infinite;}@keyframes jjmsCarryBob{0%,100%{translate:0 0;}50%{translate:0 -10px;}}';
    st2.textContent += '#jjms .jjms-think{position:absolute;left:50%;top:62%;width:min(30vw,46vh);margin-left:calc(min(30vw,46vh) / -2);z-index:4;opacity:0;pointer-events:none;transform-origin:50% 60%;}#jjms .jjms-think img{display:block;width:100%;height:auto;filter:drop-shadow(0 18px 30px rgba(0,0,0,.55));}' +
      '#jjms .jjms-think .tb{position:absolute;left:66%;top:-6%;display:flex;gap:.5vw;padding:.9vw 1.2vw;border-radius:2vw;background:#fff;box-shadow:0 8px 22px rgba(0,0,0,.4);}#jjms .jjms-think .tb::after{content:"";position:absolute;left:12%;bottom:-.7vw;width:1.2vw;height:1.2vw;border-radius:50%;background:#fff;}' +
      '#jjms .jjms-think .tb b{width:.8vw;height:.8vw;border-radius:50%;background:#1b2440;animation:jjmsThink 1.2s ease-in-out infinite;}#jjms .jjms-think .tb b:nth-child(2){animation-delay:.2s;}#jjms .jjms-think .tb b:nth-child(3){animation-delay:.4s;}@keyframes jjmsThink{0%,100%{opacity:.25;translate:0 0;}40%{opacity:1;translate:0 -.35vw;}}' +
      '#jjms .step.feat .jjtrophy{z-index:5;}';
    st2.textContent += '#jjms .step.tall.feat .cap,#jjms .step.tall.feat .sub{position:relative;top:auto;bottom:auto;left:auto;right:auto;width:auto;max-width:min(1100px,74vw);text-shadow:none;}' +
      '#jjms .step.feat .phw .phs{animation:none!important;opacity:1!important;scale:1!important;}#jjms .step.feat .gdim{z-index:2;background:radial-gradient(ellipse 80% 72% at 50% 50%,rgba(0,0,0,.25),rgba(0,0,0,.8) 80%),#000;}#jjms .step.feat .phw{z-index:3;}#jjms .step.feat .trav{z-index:4;}' +
      '#jjms .step.tall.feat .cap,#jjms .step.tall.feat .sub{transform:none;}';
    document.head.appendChild(st2);
    var stV2 = document.createElement('style'); stV2.id = 'jjms-v2'; stV2.textContent = "#jjms .step.v2{overflow:visible;} #jjms .jjg{position:absolute;inset:0;z-index:3;pointer-events:none;} #jjms .jjg-card{position:absolute;display:block;padding:0;margin:0;border:0;background:none;cursor:pointer;pointer-events:auto;perspective:900px;opacity:0;transition:opacity .35s ease;} #jjms .jjg.go .jjg-card{opacity:1;} #jjms .jjg-card .in{position:relative;display:block;transform-style:preserve-3d;transition:transform .9s cubic-bezier(.25,1.1,.4,1);} #jjms .jjg-card .f,#jjms .jjg-card .b{display:block;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:7px;} #jjms .jjg-card .f{position:relative;transition:transform .25s cubic-bezier(.3,1.5,.5,1);} #jjms .jjg-card img{display:block;width:100%;height:auto;min-height:4vw;border-radius:7px;border:2px solid rgba(255,255,255,.45);box-sizing:border-box;box-shadow:0 10px 24px rgba(0,0,0,.5);background:#0b1220;} #jjms .jjg-card .b{position:absolute;inset:0;transform:rotateY(180deg);background:#1b2a6b repeating-conic-gradient(#24388a 0 25%,#1b2a6b 0 50%) 0 0/12px 12px;border:3px solid #eef2f8;box-sizing:border-box;box-shadow:0 10px 24px rgba(0,0,0,.5);} #jjms .jjg-card .b::after{content:\"JJ\";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:clamp(9px,1.2vw,20px) \"Press Start 2P\",monospace;color:#FFC93D;text-shadow:3px 3px 0 #000;} #jjms .jjg-card:hover .f,#jjms .jjg-card:focus-visible .f{transform:translateY(-.8vh) scale(1.07);} #jjms .jjg-card:hover img,#jjms .jjg-card:focus-visible img{box-shadow:0 0 0 3px #FFC93D,0 16px 30px rgba(0,0,0,.6);} #jjms .jjg.dealt .jjg-card{animation:jjgBob var(--bd,12s) ease-in-out 0s infinite;} @keyframes jjgBob{0%,100%{translate:0 0;rotate:0deg;}25%{translate:var(--dx) calc(var(--dy) * -1);rotate:var(--dr);}50%{translate:calc(var(--dx) * -.6) calc(var(--dy) * -1.7);rotate:calc(var(--dr) * -1);}75%{translate:calc(var(--dx) * -1) calc(var(--dy) * -.6);rotate:calc(var(--dr) * .5);}} #jjms .jjg-start{position:absolute;inset:0;z-index:6;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3.6vh;padding:0;border:0;margin:0;cursor:pointer;pointer-events:auto;color:#fff8e6;font:inherit;text-align:center;background:radial-gradient(closest-side,rgba(5,9,24,.9) 22%,rgba(5,9,24,.66) 58%,rgba(5,9,24,0) 100%);transition:opacity .7s steps(7),visibility 0s linear .7s;} #jjms .jjg-start::before{content:\"\";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(180deg,rgba(255,255,255,.04) 0 2px,transparent 2px 4px);-webkit-mask:radial-gradient(closest-side,#000 30%,transparent 85%);mask:radial-gradient(closest-side,#000 30%,transparent 85%);} #jjms .jjg-start .p1{font:clamp(9px,.85vw,14px) \"Press Start 2P\",monospace;letter-spacing:.1em;opacity:.78;} #jjms .jjg-start .t{margin:0;font:clamp(22px,3.4vw,58px)/1.3 \"Press Start 2P\",monospace;color:#FFC93D;text-shadow:.12em .12em 0 #b3261e,.24em .24em 0 #000;} #jjms .jjg-start .ps{font:clamp(12px,1.3vw,22px) \"Press Start 2P\",monospace;text-shadow:3px 3px 0 #000;animation:jjgBlink 1.1s steps(1) infinite;} #jjms .jjg-start .cr{font:clamp(8px,.62vw,11px) \"Press Start 2P\",monospace;opacity:.55;} #jjms .jjg-start:hover .ps{color:#FFC93D;} #jjms .jjg-start.out{opacity:0;visibility:hidden;pointer-events:none;} #jjms .jjg-start.out .ps{animation-duration:.14s;} @keyframes jjgBlink{55%{opacity:0;}} #jjms .step.jjg-wait > .cap,#jjms .step.jjg-wait > .sub{visibility:hidden;} #jjms-crt{position:fixed;inset:0;z-index:420;display:flex;align-items:center;justify-content:center;pointer-events:none;font-family:\"Joes Journey Headline\",Georgia,serif;} #jjms-crt::before{content:\"\";position:absolute;inset:-20%;background:radial-gradient(closest-side,rgba(2,4,12,.55),rgba(2,4,12,.88));opacity:0;transition:opacity .3s ease;} #jjms-crt.on{pointer-events:auto;}#jjms-crt.on::before{opacity:1;} #jjms-crt .tvset{position:relative;width:min(56vw,88vh,980px);transform:scale(.6) translateY(8vh);opacity:0;transition:transform .45s cubic-bezier(.3,1.4,.5,1),opacity .25s ease;} #jjms-crt.on .tvset{transform:none;opacity:1;} #jjms-crt .ant{position:absolute;left:50%;top:-9%;width:34%;height:12%;translate:-50% 0;} #jjms-crt .ant::before,#jjms-crt .ant::after{content:\"\";position:absolute;bottom:0;left:50%;width:3px;height:100%;background:#9aa1ad;transform-origin:50% 100%;} #jjms-crt .ant::before{rotate:-32deg;}#jjms-crt .ant::after{rotate:30deg;} #jjms-crt .tvbody{position:relative;padding:4.5% 20% 4.5% 4.5%;border-radius:clamp(14px,2.2vw,34px);box-shadow:0 3vh 6vh rgba(0,0,0,.6),inset 0 2px 0 rgba(255,255,255,.2),inset 0 -4px 0 rgba(0,0,0,.3); background:repeating-linear-gradient(94deg,rgba(0,0,0,.08) 0 3px,transparent 3px 11px),linear-gradient(180deg,#7a5a3c,#5d412a);} #jjms-crt .panel{position:absolute;right:4%;top:12%;bottom:12%;width:12%;border-radius:clamp(8px,.8vw,14px);background:#2b2f38;display:flex;flex-direction:column;align-items:center;gap:12%;padding-top:18%;box-sizing:border-box;} #jjms-crt .panel i{width:60%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 30%,#c9ccd4,#5c6068);box-shadow:0 2px 4px rgba(0,0,0,.5);} #jjms-crt .panel b{width:70%;height:3px;background:#111;box-shadow:0 6px 0 #111,0 12px 0 #111,0 18px 0 #111;margin-top:20%;} #jjms-crt .scr{position:relative;aspect-ratio:4/3;border-radius:12%/14%;overflow:hidden;background:#0a1020;box-shadow:inset 0 0 3vw rgba(0,0,0,.9),0 0 0 .6vw #1a1a1a;} #jjms-crt .glow{position:absolute;inset:0;display:flex;align-items:center;gap:5%;padding:12% 7% 13%;box-sizing:border-box;color:#eef2f8;background:radial-gradient(circle at 14% 22%,rgba(255,255,255,.75) 0 1px,transparent 1.5px),radial-gradient(circle at 81% 16%,rgba(255,255,255,.6) 0 1px,transparent 1.5px),radial-gradient(circle at 66% 82%,rgba(255,255,255,.55) 0 1px,transparent 1.5px),radial-gradient(circle at 38% 12%,rgba(255,255,255,.5) 0 .8px,transparent 1.3px),radial-gradient(circle at 92% 58%,rgba(255,255,255,.5) 0 .8px,transparent 1.3px),radial-gradient(60% 55% at 28% 48%,rgba(26,166,183,.34),transparent 70%),radial-gradient(55% 50% at 80% 30%,rgba(255,0,245,.12),transparent 70%),radial-gradient(90% 90% at 50% 45%,#12284a,#070f20);}#jjms-crt .bug{position:absolute;left:5%;top:6.5%;display:flex;align-items:center;gap:.45em;padding:.28em .85em .28em .3em;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.4);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);font-size:clamp(11px,.9vw,15px);letter-spacing:.08em;z-index:2;}#jjms-crt .bug .jm{display:flex;width:1.9em;height:1.9em;align-items:center;justify-content:center;}#jjms-crt .bug .jm img{width:100%;height:100%;object-fit:contain;}#jjms-crt .bug .jm em{font-style:normal;font-weight:800;font-size:1.3em;color:#fff;}#jjms-crt .bug b{font-weight:800;}#jjms-crt .bug i{font-style:normal;font-size:.72em;font-weight:800;letter-spacing:.14em;color:#ff6b7a;display:flex;align-items:center;gap:.35em;}#jjms-crt .bug i::before{content:\"\";width:.55em;height:.55em;border-radius:50%;background:#ff4458;box-shadow:0 0 8px #ff4458;animation:jjgRec 1.4s ease-in-out infinite;}@keyframes jjgRec{50%{opacity:.25;}}#jjms-crt .hud{position:absolute;right:5%;top:6.5%;display:flex;align-items:center;gap:.4em;padding:.3em .8em;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.4);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);font-size:clamp(11px,.9vw,15px);font-weight:800;z-index:2;}#jjms-crt .hud img{width:1.35em;height:1.35em;object-fit:contain;}#jjms-crt .hud b{margin-right:.35em;}#jjms-crt .lower{position:absolute;left:0;right:0;bottom:6%;padding:.5em 8%;font-size:clamp(10px,.78vw,13px);font-weight:700;letter-spacing:.16em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:rgba(238,242,248,.85);background:linear-gradient(90deg,transparent,rgba(0,0,0,.42) 18%,rgba(0,0,0,.42) 82%,transparent);}#jjms-crt .kick{display:inline-block;margin:0 0 .55em;padding:.25em .85em;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.4);font-size:clamp(9px,.72vw,12px);font-weight:800;letter-spacing:.03em;text-transform:none;color:#FFC93D;} #jjms-crt .scr::after{content:\"\";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(180deg,rgba(0,0,0,.12) 0 1px,transparent 1px 4px),radial-gradient(90% 90% at 50% 50%,transparent 58%,rgba(0,0,0,.5));} #jjms-crt.on .glow{animation:jjgCrtOn .55s ease-out .15s both;} @keyframes jjgCrtOn{0%,45%{transform:scale(1,.004);filter:brightness(4);}70%{transform:scale(1,1);filter:brightness(2);}100%{filter:brightness(1);}} #jjms-crt .cv{position:relative;flex:none;width:32%;}#jjms-crt .cv::before{content:\"\";position:absolute;inset:-22%;z-index:-1;background:radial-gradient(closest-side,rgba(255,201,61,.42),rgba(26,166,183,.22) 55%,transparent 100%);filter:blur(6px);animation:jjgHalo 3.2s ease-in-out infinite;}@keyframes jjgHalo{50%{opacity:.6;scale:1.06;}} #jjms-crt .cv img{display:block;width:100%;border-radius:8px;border:2px solid rgba(255,255,255,.75);box-shadow:0 10px 26px rgba(0,0,0,.55),0 0 26px rgba(255,201,61,.25);} #jjms-crt .txt{flex:1;min-width:0;text-align:left;} #jjms-crt .jjd-found{display:none;width:max-content;max-width:100%;margin:0 0 .7em;padding:.3em .9em;border-radius:999px;border:1px solid rgba(255,201,61,.7);background:rgba(255,201,61,.14);font-size:clamp(9px,.74vw,13px);font-weight:800;letter-spacing:.03em;white-space:nowrap;text-transform:none;color:#FFC93D;box-shadow:0 0 18px rgba(255,201,61,.3);} #jjms-crt .jjd-found.on{display:block;animation:jjgFound .7s cubic-bezier(.22,1,.36,1) .5s both;} @keyframes jjgFound{0%{opacity:0;transform:translateY(10px) scale(.9);}100%{opacity:1;transform:none;}} #jjms-crt .jjd-title{margin:0 0 .4em;font-weight:800;color:#fff;font-size:clamp(20px,2.1vw,38px);line-height:1.08;text-shadow:0 2px 16px rgba(0,0,0,.65),0 0 24px rgba(26,166,183,.35);} #jjms-crt .jjd-note{margin:0 0 1em;font-size:clamp(12px,1vw,17px);font-weight:600;line-height:1.4;color:rgba(238,242,248,.92);text-shadow:0 2px 12px rgba(0,0,0,.9);} #jjms-crt .jjd-extra{display:flex;gap:12px;margin:0 0 1em;}#jjms-crt .jjd-extra:empty{display:none;} #jjms-crt .jjd-extra span{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:11px;font-weight:700;opacity:.85;} #jjms-crt .jjd-extra img{height:clamp(40px,5.5vh,80px);width:auto;border-radius:4px;box-shadow:0 6px 16px rgba(0,0,0,.5);} #jjms-crt .jjd-ign{display:inline-flex;align-items:center;gap:7px;background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.5);padding:4px 12px 4px 4px;border-radius:999px;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);font-size:.85em;} #jjms-crt .jjd-ignb{background:#E11E26;color:#fff;font-weight:900;font-size:clamp(10px,.78vw,13px);letter-spacing:.06em;padding:4px 9px;border-radius:999px;} #jjms-crt .jjd-igns{position:relative;display:inline-block;font-size:clamp(13px,1.15vw,19px);line-height:1;letter-spacing:2px;color:rgba(255,255,255,.22);} #jjms-crt .jjd-igns::before,#jjms-crt .jjd-igns i::before{content:\"\\2605\\2605\\2605\\2605\\2605\";} #jjms-crt .jjd-igns i{position:absolute;left:0;top:0;height:100%;overflow:hidden;white-space:nowrap;color:#E11E26;font-style:normal;filter:drop-shadow(0 0 8px rgba(225,30,38,.6));} #jjms-crt .jjd-ignn{color:#fff;font-size:clamp(13px,1.15vw,19px);font-weight:800;} #jjms-crt .jjd-out{color:rgba(255,255,255,.55);font-size:clamp(11px,.95vw,16px);font-weight:600;margin-left:-3px;} #jjms-crt .x,#jjms-cine .x{position:absolute;z-index:8;width:52px;height:52px;border-radius:50%;border:0;background:none;color:#fff;cursor:pointer;display:grid;place-items:center;padding:0;isolation:isolate;transition:scale .25s cubic-bezier(.3,1.5,.5,1);}#jjms-cine .x::before{content:\"\";position:absolute;inset:0;z-index:-1;border-radius:50%;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.4);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);transition:background .2s ease,box-shadow .2s ease;}#jjms-cine .x svg{display:block;width:18px;height:18px;}#jjms-cine .x:hover{scale:1.06;}#jjms-cine .x:hover::before{background:rgba(0,0,0,.7);}#jjms-cine .x:active::before{border-color:#ff5fc8;box-shadow:0 0 0 3px rgba(255,95,200,.35);}html[data-jj-theme=\"medieval\"] #jjms-cine .x{color:#3a2a12;}html[data-jj-theme=\"medieval\"] #jjms-cine .x::before{background:rgba(255,248,230,.82);border:2px solid #3a2a12;}html[data-jj-theme=\"medieval\"] #jjms-cine .x:hover::before{background:rgba(255,248,230,.95);}html[data-jj-theme=\"alien\"] #jjms-cine .x{color:#bff4ff;}html[data-jj-theme=\"alien\"] #jjms-cine .x::before{background:rgba(16,22,80,.92);border:1.5px solid rgba(120,220,255,.85);box-shadow:0 0 12px rgba(79,227,255,.25);}html[data-jj-theme=\"alien\"] #jjms-cine .x:hover::before{background:rgba(24,32,110,.95);}html[data-jj-theme=\"retro\"] #jjms-cine .x::before{border-radius:0;border:12px solid transparent;border-image:url(" + SB + "retro-pill.webp) 16 fill / 12px / 0 round;image-rendering:pixelated;background:none;-webkit-backdrop-filter:none;backdrop-filter:none;}html[data-jj-theme=\"retro\"] #jjms-cine .x:hover::before{filter:brightness(1.18) drop-shadow(3px 3px 0 rgba(255,0,245,.8));}html[data-jj-theme=\"mixed\"] #jjms-cine .x::before{border:4px dashed #a8a8a8;background:linear-gradient(160deg,#0e1a33,#070f1d);box-shadow:inset 0 0 0 2px #6d6d6d,0 0 0 2px #6d6d6d,0 0 16px rgba(255,197,49,.14);-webkit-backdrop-filter:none;backdrop-filter:none;}html[data-jj-theme=\"mixed\"] #jjms-cine .x:hover::before{background:linear-gradient(160deg,#16264a,#0a1428);box-shadow:inset 0 0 0 2px #ffc531,0 0 0 2px #ffc531,0 0 24px rgba(255,197,49,.3);} #jjms-crt .x{right:-1.4vw;top:-2.4vw;} @media (max-width:767px),(max-aspect-ratio:1/1){ #jjms-crt .tvset{width:94vw;} #jjms-crt .tvbody{padding:5% 5% 16% 5%;} #jjms-crt .panel{left:12%;right:12%;top:auto;bottom:3%;width:auto;height:9%;flex-direction:row;justify-content:center;padding:0;gap:8%;} #jjms-crt .panel i{height:70%;width:auto;}#jjms-crt .panel b{display:none;} #jjms-crt .scr{aspect-ratio:auto;min-height:62vh;border-radius:8%/6%;} #jjms-crt .glow{position:relative;flex-direction:column;justify-content:center;gap:2.4vh;padding:18% 8% 16%;min-height:62vh;}#jjms-crt .lower{font-size:10px;letter-spacing:.1em;} #jjms-crt .cv{width:36%;}#jjms-crt .txt{text-align:center;}#jjms-crt .jjd-extra{justify-content:center;} #jjms-crt .jjd-found{white-space:normal;}#jjms-crt .x{right:0;top:-54px;} } #jjms .step.v2cine{justify-content:safe center;gap:1.4vh;padding:10vh 4vw 12vh;} #jjms .step.v2cine::before{content:\"\";position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(40% 28% at 50% 24%,rgba(255,170,80,.12),transparent 80%),radial-gradient(55% 30% at 50% 64%,rgba(120,20,40,.18),transparent 80%);} #jjms .jjc-marq{position:relative;z-index:3;flex:none;padding:1.5vh 1.8vw;border-radius:clamp(10px,1vw,18px);background:linear-gradient(180deg,#2b1a10,#1a0f09);box-shadow:0 2vh 5vh rgba(0,0,0,.6),inset 0 0 0 2px rgba(255,200,120,.25);} #jjms .jjc-marq::before{content:\"\";position:absolute;inset:1.1vh 1.2vw;border-radius:clamp(5px,.5vw,9px);background:#111 repeating-linear-gradient(180deg,#171717 0 .55vh,#0b0b0b .55vh calc(.55vh + 1px));box-shadow:inset 0 0 2vw rgba(0,0,0,.9);} #jjms .jjc-marq::after{content:\"\";position:absolute;inset:1.1vh 1.2vw;border-radius:inherit;pointer-events:none;background:radial-gradient(80% 90% at 50% 0%,rgba(255,240,210,.12),transparent 70%);} #jjms .jjc-marq .cap{position:relative;z-index:1;display:block;box-sizing:border-box;width:min(58vw,96vh);min-height:2.6em;padding:.45em .9em;margin:0;max-width:none;text-align:center; font:500 min(2.7vw,4.7vh)/1.2 Oswald,\"Joes Journey Headline\",sans-serif;text-transform:uppercase;letter-spacing:.12em;color:#f4f1ea;text-shadow:0 1px 0 rgba(0,0,0,.6);} #jjms .jjc-marq .cap .word{margin:0 .08em;}#jjms .step.v2cine .jjc-marq .cap.cap:not(.hero){opacity:1!important;scale:1!important;filter:none!important;}#jjms .step.v2cine .jjc-marq .cap .word{opacity:1!important;translate:0 0!important;} #jjms .jjc-mt{position:absolute;inset:1.1vh 1.2vw;z-index:2;display:flex;flex-wrap:wrap;align-content:center;justify-content:center;gap:0 .5em;padding:0 .8em;font:500 min(2.7vw,4.7vh)/1.2 Oswald,sans-serif;text-transform:uppercase;letter-spacing:.12em;color:#f4f1ea;opacity:0;pointer-events:none;} #jjms .jjc-mt b{display:inline-flex;font-weight:500;white-space:nowrap;} #jjms .jjc-mt i{display:inline-block;font-style:normal;animation:jjcSlot .35s cubic-bezier(.3,1.5,.5,1) both;animation-delay:var(--d);rotate:var(--r);} @keyframes jjcSlot{from{opacity:0;transform:translateY(-.5em) rotateX(80deg);}to{opacity:1;transform:none;}} #jjms .jjc-marq.swap .cap{visibility:hidden;}#jjms .jjc-marq.swap .jjc-mt{opacity:1;} #jjms .jjc-bulbs{position:absolute;inset:.5vh .4vw;pointer-events:none;z-index:1;} #jjms .jjc-bulbs i{position:absolute;width:clamp(4px,.55vw,10px);height:clamp(4px,.55vw,10px);translate:-50% -50%;border-radius:50%;background:#ffe7a8;box-shadow:0 0 .5vw #ffc93d,0 0 1.1vw rgba(255,180,60,.6);animation:jjcChase 1.2s steps(1) infinite;} @keyframes jjcChase{50%{opacity:.35;box-shadow:none;}} #jjms .jjc-strip{position:relative;z-index:3;flex:none;display:flex;align-items:baseline;justify-content:center;flex-wrap:wrap;gap:.2em .8em;max-width:min(92vw,1100px);} #jjms .jjc-marq .jjc-ns{position:relative;z-index:1;display:block;padding-top:.7em;margin-bottom:-.35em;text-align:center;font:400 clamp(11px,.92vw,17px)/1 \"Joes Journey Headline\",sans-serif;letter-spacing:.06em;color:rgba(255,226,170,.82);text-shadow:0 0 8px rgba(255,190,90,.35);pointer-events:none;} #jjms .jjc-marq .jjc-mt{top:calc(1.1vh + clamp(16px,1.5vw,26px));} #jjms .jjc-strip .sub{margin:0;max-width:none;} #jjms .jjc-wall{position:relative;z-index:3;flex:none;display:grid;grid-template-columns:repeat(9,var(--pw));gap:2.2vh 1.1vw;--pw:min(6.2vw,8.8vh);margin-top:1vh;} #jjms .jjc-post{position:relative;width:var(--pw);aspect-ratio:2/3;padding:0;border:0;background:none;cursor:pointer;transition:transform .3s cubic-bezier(.3,1.5,.5,1);} #jjms .jjc-post::before{content:\"\";position:absolute;left:-40%;right:-40%;top:-45%;height:90%;pointer-events:none;background:radial-gradient(50% 50% at 50% 30%,rgba(255,220,150,.22),transparent 70%);opacity:.55;transition:opacity .3s;} #jjms .jjc-post .fr{position:absolute;inset:0;border-radius:3px;padding:4%;box-sizing:border-box;background:linear-gradient(145deg,#e6c16a,#8a6420 45%,#d8b458 80%,#7a5518);box-shadow:0 1vh 2vh rgba(0,0,0,.55);} #jjms .jjc-post img{display:block;width:100%;height:100%;object-fit:cover;border-radius:1px;background:#140c08;} #jjms .jjc-wallw{position:relative;z-index:3;flex:none;}#jjms .jjc-wall .jjc-post{transition:transform .3s cubic-bezier(.3,1.5,.5,1),opacity .6s ease var(--d,0s),filter .9s ease var(--d,0s),translate .8s cubic-bezier(.3,1.4,.5,1) var(--d,0s),scale .8s cubic-bezier(.3,1.4,.5,1) var(--d,0s);}#jjms .jjc-wall.dark .jjc-post{opacity:.1;filter:brightness(.15) blur(1px);translate:0 14px;scale:.94;}#jjms .jjc-wall.dark .jjc-post:hover,#jjms .jjc-wall.dark .jjc-post:focus-visible{opacity:.5;filter:brightness(.7);translate:0 6px;scale:.98;transition-duration:.3s;transition-delay:0s;}#jjms .jjc-wall.dark .jjc-post::before{opacity:0;}#jjms .jjc-lights{position:absolute;left:50%;top:50%;z-index:5;translate:-50% -50%;display:flex;align-items:center;gap:.6em;padding:.85em 1.8em;white-space:nowrap;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.45);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#fff;font:700 clamp(19px,1.6vw,28px)/1 \"Joes Journey Headline\",Georgia,serif;cursor:pointer;box-shadow:0 0 30px rgba(255,201,61,.25);transition:opacity .5s ease .4s,scale .3s ease,background .2s ease;animation:jjmsPrompt 1.8s ease-in-out infinite;}#jjms .jjc-lights:hover{background:rgba(255,255,255,.14);}#jjms .jjc-lights:active{border-color:#ff5fc8;box-shadow:0 0 0 3px rgba(255,95,200,.35);}#jjms .jjc-lights .bulb{width:1.05em;height:1.05em;border-radius:50%;background:radial-gradient(circle at 40% 35%,#fff,#ffe39a 40%,#b98a2e);box-shadow:0 0 10px rgba(255,201,61,.6);}#jjms .jjc-lights.on{opacity:0;pointer-events:none;animation:none;}#jjms .jjc-lights.on .bulb{box-shadow:0 0 22px 6px rgba(255,220,120,.95);}#jjms .jjc-post:hover,#jjms .jjc-post:focus-visible{transform:translateY(-.8vh) scale(1.06);z-index:4;} #jjms .jjc-post:hover::before{opacity:1;} #jjms .jjc-post.secret:not(.found) img{opacity:0;} #jjms .jjc-post.secret:not(.found) .fr::after{content:\"?\";position:absolute;inset:4%;display:flex;align-items:center;justify-content:center;background:#140c08;color:rgba(255,220,150,.55);font:700 calc(var(--pw) * .45)/1 \"Joes Journey Headline\",Georgia,serif;} @media (max-width:767px),(max-aspect-ratio:1/1){ #jjms .step.v2cine{padding:12vh 3vw 13vh;justify-content:flex-start;} #jjms .jjc-wall{grid-template-columns:repeat(7,var(--pw));--pw:min(11.6vw,7.6vh);gap:1.4vh 1.8vw;} #jjms .jjc-marq .cap,#jjms .jjc-mt{font-size:min(4.6vw,3.4vh);} #jjms .jjc-marq .cap{width:86vw;} } #jjms-cine{position:fixed;inset:0;z-index:420;pointer-events:none;font-family:\"Joes Journey Headline\",Georgia,serif;color:#eef2f8;} #jjms-cine .house{position:absolute;inset:-20%;opacity:0;transition:opacity .8s ease;background:radial-gradient(40% 45% at 50% 48%,rgba(0,0,0,.72),rgba(0,0,0,.97) 100%);} #jjms-cine.on{pointer-events:auto;}#jjms-cine.on .house{opacity:1;} #jjms-cine .theatre{position:absolute;left:50%;top:50%;width:min(74vw,128vh);height:min(66vh,41vw);transform:translate(-50%,-50%) scale(.96);opacity:0;transition:opacity .6s ease,transform .8s ease;} #jjms-cine.on .theatre{opacity:1;transform:translate(-50%,-50%);} #jjms-cine .screen{position:absolute;inset:8% 4% 4%;border-radius:1.2vw/2vw;overflow:hidden;display:flex;align-items:center;justify-content:center;gap:4vw;padding:3vh 4vw;box-sizing:border-box; background:radial-gradient(90% 90% at 50% 50%,#26303f,#0d121b);box-shadow:0 0 8vh rgba(160,190,255,.18);-webkit-mask:linear-gradient(180deg,#000 88%,transparent);mask:linear-gradient(180deg,#000 88%,transparent);} #jjms-cine .screen img{height:44vh;max-height:90%;aspect-ratio:2/3;object-fit:cover;border-radius:4px;box-shadow:0 2vh 5vh rgba(0,0,0,.6);} #jjms-cine .info{max-width:26vw;text-align:left;} #jjms-cine .k{font-size:clamp(10px,.75vw,13px);font-weight:700;letter-spacing:.03em;text-transform:none;opacity:.6;} #jjms-cine .jjd-found{display:none;margin:0 0 .6em;font-size:clamp(11px,.95vw,15px);font-weight:800;letter-spacing:.03em;text-transform:none;color:#FFC33D;text-shadow:0 2px 14px rgba(0,0,0,.85);} #jjms-cine .jjd-found.on{display:block;animation:jjgFound .7s cubic-bezier(.22,1,.36,1) 1.3s both;} #jjms-cine h2{margin:.3em 0 .4em;font-size:clamp(24px,2.5vw,44px);font-weight:800;line-height:1.1;} #jjms-cine .cq{margin:0 0 .6em;font-size:clamp(15px,1.35vw,23px);font-weight:700;line-height:1.3;color:#FFC93D;} #jjms-cine .note{margin:0 0 1.1em;font-size:clamp(13px,1.05vw,18px);font-weight:600;line-height:1.45;opacity:.85;} #jjms-cine .note:empty{display:none;} #jjms-cine .score{display:flex;align-items:baseline;gap:.6em;margin-bottom:1.2em;} #jjms-cine .score b{font-size:clamp(26px,2.5vw,42px);font-weight:800;color:#F5C518;}#jjms-cine .score span{opacity:.6;} #jjms-cine .rate{display:flex;gap:.3em;} #jjms-cine .rate button{background:none;border:0;padding:0;cursor:pointer;width:clamp(26px,2.1vw,38px);height:clamp(26px,2.1vw,38px);} #jjms-cine .rate svg{width:100%;height:100%;fill:rgba(255,255,255,.12);stroke:rgba(255,255,255,.6);stroke-width:1.2;transition:fill .15s,transform .2s;} #jjms-cine .rate button.on svg{fill:#FFC93D;stroke:#FFC93D;}#jjms-cine .rate button:hover svg{transform:scale(1.15);} #jjms-cine .rated{min-height:1.4em;margin-top:.6em;font-size:clamp(12px,.9vw,15px);opacity:.75;} #jjms-cine .curtain{position:absolute;top:3%;bottom:-2%;width:54%;z-index:3;transition:transform 1.4s cubic-bezier(.65,0,.25,1); background:repeating-linear-gradient(90deg,#5e0b16 0 1.2vw,#a3172a 2.4vw,#6d0d1a 3.6vw),#7a1020;box-shadow:inset 0 -6vh 6vh rgba(0,0,0,.5),0 0 4vh rgba(0,0,0,.7); -webkit-mask:linear-gradient(180deg,#000 82%,transparent);mask:linear-gradient(180deg,#000 82%,transparent);} #jjms-cine .curtain.l{left:-2%;border-radius:0 0 30% 0/0 0 8% 0;transform-origin:0 0;} #jjms-cine .curtain.r{right:-2%;border-radius:0 0 0 30%/0 0 0 8%;transform-origin:100% 0;} #jjms-cine.open .curtain{transform:scaleX(.12);} #jjms-cine .pelmet{position:absolute;left:-3%;right:-3%;top:-2%;height:12%;z-index:4;border-radius:1vw 1vw 50% 50%/1vw 1vw 30% 30%;background:repeating-linear-gradient(90deg,#6d0d1a 0 1vw,#9b1628 2vw,#6d0d1a 3vw);box-shadow:0 1.5vh 3vh rgba(0,0,0,.6);} #jjms-cine .pelmet::after{content:\"\";position:absolute;left:2%;right:2%;bottom:-1.2vh;height:1.6vh;background:repeating-linear-gradient(90deg,#e7b94c 0 3px,transparent 3px 7px);-webkit-mask:linear-gradient(180deg,#000 40%,transparent);mask:linear-gradient(180deg,#000 40%,transparent);} #jjms-cine .x{right:-1.5vw;top:-4vh;} @media (max-width:767px),(max-aspect-ratio:1/1){ #jjms-cine .theatre{width:94vw;height:78vh;} #jjms-cine .screen{flex-direction:column;gap:2vh;padding:9vh 6vw 4vh;} #jjms-cine .screen img{height:30vh;} #jjms-cine .info{max-width:none;width:100%;text-align:center;}#jjms-cine .score,#jjms-cine .rate{justify-content:center;} #jjms-cine .x{right:2vw;top:-6vh;} } #jjms .step.v2atlas{padding:0;justify-content:flex-start;--mtop:15vh;--ph:min(50vh,36vw);--pw:calc(var(--ph) * .7);--dock:50%;--btop:calc(84% - var(--ph) / 2);} @media (max-aspect-ratio:1/1){#jjms .step.v2atlas{--ph:min(40vh,66vw);--dock:50%;--mtop:max(16vh,calc(47.5vh - var(--ph) / 2 - 20.83vw));--btop:calc(79% - var(--ph) / 2);}}@media (max-width:767px){#jjms .jja .jja-book .pg{padding:.9em 1em 1.8em;}#jjms .jja .jja-book .data{padding:.8em .9em 1.7em;gap:.3em;}#jjms .jja .jja-book .data .dh b{font-size:13px;}#jjms .jja .jja-book .data .dh span,#jjms .jja .jja-book .data dt,#jjms .jja .jja-book .data .dsig i{font-size:9px;}#jjms .jja .jja-book .data dd{font-size:11px;margin-bottom:.25em;}#jjms .jja .jja-book .data .dsig span{font-size:16px;}#jjms .jja .jja-book .data .mrz{font-size:8px;}#jjms .jja .jja-book .inside p{font-size:10.5px;}#jjms .jja .jja-book .inside p.sign{font-size:9px;}#jjms .jja .jja-book .inside{gap:.6em;padding:1em;}#jjms .jja .jja-book .reg h3{font-size:20px;}#jjms .jja .jja-book .reg .note{font-size:13px;}#jjms .jja .jja-book .kicker{font-size:10px;}#jjms .jja .jja-book .pno{font-size:10px;}}@media (max-aspect-ratio:1/1){#jjms .trav.tclipset{width:22vw!important;left:calc(50% - 11vw)!important;}} #jjms .jja{position:absolute;inset:0;z-index:1;} #jjms .jja-parch{position:absolute;left:1%;right:1%;top:calc(var(--mtop) - 7vh);height:calc(41.67vw + 13vh);pointer-events:none;background-color:#e4cf9f;background-image:radial-gradient(38% 28% at 22% 34%,rgba(150,95,40,.16),transparent 70%),radial-gradient(30% 24% at 80% 64%,rgba(140,85,35,.15),transparent 70%),radial-gradient(16% 12% at 62% 28%,rgba(120,70,30,.12),transparent 70%),radial-gradient(10% 8% at 36% 72%,rgba(120,70,30,.12),transparent 70%),url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='4' seed='9'/%3E%3CfeColorMatrix values='0 0 0 0 .42  0 0 0 0 .28  0 0 0 0 .12  0 0 0 .55 -.18'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E\");-webkit-mask:radial-gradient(closest-side,#000 64%,transparent 100%);mask:radial-gradient(closest-side,#000 64%,transparent 100%);} #jjms .jja-rib{position:absolute;left:50%;top:max(9vh,64px);z-index:6;transform:translateX(-50%);width:min(1240px,80vw);text-align:center;pointer-events:none;} #jjms .jja-rib .cap{margin:0 auto;max-width:none;}#jjms .jja-rib .jja-sub{margin:.3em auto 0;max-width:none;font-size:clamp(14px,1.3vw,21px);line-height:1.25;opacity:.92;}@media (max-aspect-ratio:1/1){#jjms .jja-rib{top:10.5vh;width:92vw;}#jjms .jja-rib .cap{font-size:clamp(17px,4.4vw,26px);}} #jjms .jja-map{position:absolute;left:0;top:var(--mtop);width:100%;aspect-ratio:360/150;z-index:2;pointer-events:none;} #jjms .bmp .jja-map .grid,#jjms .bmp .jja-map .shade,#jjms .bmp .jja-map .land,#jjms .bmp .jja-map .sea,#jjms .bmp .jja-map .lanes,#jjms .bmp .jja-map .deco{display:none;}#jjms .jja-img{position:absolute;inset:0;width:100%;height:100%;object-fit:fill;filter:drop-shadow(0 1.6vh 2.6vh rgba(0,0,0,.45));}#jjms .jja-map svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;-webkit-mask:radial-gradient(closest-side,#000 74%,transparent 100%);mask:radial-gradient(closest-side,#000 74%,transparent 100%);} #jjms .jja-map .grid{fill:none;stroke:rgba(90,58,25,.2);stroke-width:.14;stroke-dasharray:.8 1.2;} #jjms .jja-map .shade path{fill:none;stroke:rgba(110,70,30,.25);stroke-width:2.4;filter:url(#jjaSoft);} #jjms .jja-map .land path{fill:rgba(160,112,58,.17);stroke:#5b3d1f;stroke-width:.34;stroke-linejoin:round;filter:url(#jjaRough);} #jjms .jja-map .sea{fill:none;stroke:rgba(80,52,24,.38);stroke-width:.24;stroke-linecap:round;} #jjms .jja-map .lanes{fill:none;stroke:rgba(80,52,24,.38);stroke-width:.3;stroke-dasharray:.05 1.3;stroke-linecap:round;} #jjms .jja-map .deco text{font-family:Caveat,cursive;font-weight:700;fill:rgba(70,44,18,.5);} #jjms .jja-map .rt{fill:none;stroke:#9c2a1c;stroke-width:.55;stroke-linecap:round;stroke-dasharray:1.6 1.1;transition:opacity .5s;} #jjms .jja-map .rv{fill:none;stroke:#fff;stroke-width:3;} #jjms .jja-map .plane{fill:#3b2a17;opacity:0;transition:opacity .3s;} #jjms .jja-mk{position:absolute;width:0;height:0;z-index:3;pointer-events:auto;--s:clamp(20px,1.7vw,32px);} #jjms .jja-mk.show{z-index:8;} #jjms .jja-mk .seal{position:absolute;left:calc(var(--s) * -.8);top:calc(var(--s) * -.8);width:calc(var(--s) * 1.6);height:calc(var(--s) * 1.6);box-sizing:border-box;border:calc(var(--s) * .3) solid transparent;background-clip:padding-box;padding:0;border-radius:50%;cursor:pointer;background-color:transparent;background-image:radial-gradient(circle at 38% 32%,#ffb8fb,#ff00f5 48%,#a1009a);box-shadow:inset 0 0 0 calc(var(--s) * .13) #fff;filter:drop-shadow(0 0 6px rgba(255,0,245,.95)) drop-shadow(0 2px 3px rgba(40,0,40,.5));transition:transform .25s cubic-bezier(.3,1.6,.5,1);} #jjms .jja-mk .seal::after{content:\"\";position:absolute;inset:32%;border-radius:50%;background:rgba(255,255,255,.9);} #jjms .jja-mk .seal:hover{transform:scale(1.18);} #jjms .jja-mk.on .seal{background-image:radial-gradient(circle at 38% 32%,#ff7fd0,#c4007c 55%,#6d0046);filter:drop-shadow(0 0 7px rgba(255,0,200,.95)) drop-shadow(0 2px 3px rgba(40,0,30,.55));animation:jjaSeal .55s cubic-bezier(.3,1.6,.5,1);} #jjms .jja-mk.on .seal::after{display:none;} #jjms .jja-mk.on .seal::before{content:\"J\";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:700 calc(var(--s) * .62)/1 \"Joes Journey Headline\",Georgia,serif;color:#fff;} @keyframes jjaSeal{0%{transform:scale(2) rotate(-25deg);opacity:.2;}60%{transform:scale(.88);opacity:1;}100%{transform:none;}} #jjms .jja-mk .jring{position:absolute;left:calc(var(--s) / -2);top:calc(var(--s) / -2);width:var(--s);height:var(--s);border-radius:50%;border:2px solid rgba(255,120,250,.95);box-sizing:border-box;opacity:0;pointer-events:none;animation:jjaRing 2.4s ease-out infinite;} #jjms .jja-mk.act .jring{animation-duration:1.3s;border-color:#fff;} @keyframes jjaRing{from{scale:1;opacity:.9;}to{scale:2.6;opacity:0;}} #jjms .jja-mk .lbl{position:absolute;left:calc(var(--s) * .75);top:calc(var(--s) * -1.05);white-space:nowrap;pointer-events:none;font:700 clamp(14px,1.35vw,24px) Caveat,cursive;color:rgba(70,60,50,.62);transition:color .3s;text-shadow:0 0 3px #e8d6aa,0 0 3px #e8d6aa,0 0 6px #e8d6aa;} #jjms .jja-mk.on .lbl{color:#3b2a17;} #jjms .jja-mk.lleft .lbl{left:auto;right:calc(var(--s) * .75);}#jjms .jja-mk.lbelow .lbl{top:calc(var(--s) * .3);}#jjms .jja-mk.labove .lbl{top:calc(var(--s) * -2.1);} #jjms .jja-pv{position:absolute;left:0;top:0;width:0;height:0;--cw:clamp(44px,5.2vw,100px);} #jjms .jja-pc{position:absolute;left:0;top:0;width:var(--cw);padding:4px 4px 12px;box-sizing:content-box;background:#fbf8f1;border:0;cursor:zoom-in;box-shadow:0 6px 14px rgba(60,35,10,.4);opacity:0;pointer-events:none; transform:translate(-50%,-50%) scale(.15);transition:transform .45s cubic-bezier(.3,1.4,.5,1),opacity .25s ease;transition-delay:calc(var(--k) * 45ms);} #jjms .jja-pc img{display:block;width:100%;aspect-ratio:1;object-fit:cover;background:#d9c9a0;} #jjms .jja-mk.show .jja-pc{opacity:1;pointer-events:auto;transform:translate(calc(var(--cw) * var(--fx)),calc(var(--cw) * var(--fy))) rotate(var(--r));} #jjms .jja-mk.show .jja-pc:hover{z-index:5;transform:translate(calc(var(--cw) * var(--fx)),calc(var(--cw) * var(--fy))) rotate(0deg) scale(1.12);} #jjms .jja-book{position:absolute;left:var(--dock);top:var(--btop);width:calc(var(--pw) * 2);height:var(--ph);z-index:5;font-size:calc(var(--ph) / 40);perspective:2600px;transform:translate(-50%,-50%);transition:transform .9s cubic-bezier(.45,0,.2,1);color:#2a2a35;text-align:left;font-family:\"Joes Journey Headline\",Georgia,serif;} #jjms .jja-book.closed{transform:translate(calc(-50% - var(--pw) / 2),-50%);} #jjms .jja-book .leather{background-color:#5a1426;background-image:radial-gradient(120% 90% at 30% 20%,rgba(255,255,255,.07),transparent 60%),url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' seed='7'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .6 -.2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\");} #jjms .jja-book .board{position:absolute;left:50%;top:0;width:var(--pw);height:100%;border-radius:0 1.1em 1.1em 0;box-shadow:0 3vh 6vh rgba(40,20,5,.5),inset 0 0 1.5em rgba(0,0,0,.5);} #jjms .jja-book .leaf{position:absolute;left:50%;top:.7em;width:calc(var(--pw) - .7em);height:calc(100% - 1.4em);transform-origin:0 50%;transform-style:preserve-3d;transition:transform .95s cubic-bezier(.45,.05,.25,1);} #jjms .jja-book .leaf.cover{top:0;width:var(--pw);height:100%;cursor:pointer;} #jjms .jja-book .leaf.flipped{transform:rotateY(-180deg);} #jjms .jja-book .face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden;} #jjms .jja-book .face.back{transform:rotateY(180deg);} #jjms .jja-book .paper{border-radius:0 .5em .5em 0;background-color:#f4efe3;background-image:repeating-radial-gradient(circle at 120% 50%,transparent 0 .9em,rgba(90,140,160,.07) .9em 1em),repeating-radial-gradient(circle at -20% 50%,transparent 0 1.3em,rgba(200,110,130,.06) 1.3em 1.4em),linear-gradient(90deg,rgba(0,0,0,.16),transparent 12%);} #jjms .jja-book .face.back.paper{border-radius:.5em 0 0 .5em;background-image:repeating-radial-gradient(circle at 120% 50%,transparent 0 .9em,rgba(90,140,160,.07) .9em 1em),repeating-radial-gradient(circle at -20% 50%,transparent 0 1.3em,rgba(200,110,130,.06) 1.3em 1.4em),linear-gradient(270deg,rgba(0,0,0,.16),transparent 12%);} #jjms .jja-book .face.lilac{background-color:#f5ecf5;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='22'%3E%3Cpath d='M0 11 Q15 0 30 11 T60 11 T90 11 T120 11' fill='none' stroke='rgba(140,100,170,.2)' stroke-width='1'/%3E%3Cpath d='M0 5 Q15 16 30 5 T60 5 T90 5 T120 5' fill='none' stroke='rgba(205,110,150,.14)' stroke-width='1'/%3E%3C/svg%3E\"),repeating-radial-gradient(circle at 28% 44%,transparent 0 7px,rgba(150,110,175,.08) 7px 8px),radial-gradient(70% 60% at 70% 30%,rgba(215,170,215,.35),transparent 70%),linear-gradient(90deg,rgba(0,0,0,.14),transparent 12%);} #jjms .jja-book .cover .front{border-radius:0 1.1em 1.1em 0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:11% 8% 9%;box-sizing:border-box;box-shadow:inset .5em 0 1em rgba(0,0,0,.45);} #jjms .jja-book .foil{background:linear-gradient(160deg,#fff1b8,#e0b64a 35%,#a7781d 60%,#f4d57a 85%);-webkit-background-clip:text;background-clip:text;color:transparent;font-family:\"Joes Journey Headline\",Georgia,serif;font-weight:700;text-align:center;filter:drop-shadow(0 1px 0 rgba(0,0,0,.5));} #jjms .jja-book .cvtop{font-size:max(15px,calc(var(--ph) * .058));letter-spacing:.12em;line-height:1.2;} #jjms .jja-book .cvpp{font-size:max(14px,calc(var(--ph) * .05));letter-spacing:.42em;margin-right:-.42em;} #jjms .jja-book .cover svg.crest{width:50%;height:auto;filter:drop-shadow(0 1px 0 rgba(0,0,0,.5));} #jjms .jja-book .chipsym{width:16%;height:auto;opacity:.9;} #jjms .jja-book .cover .back{border-radius:1.1em 0 0 1.1em;} #jjms .jja-book .cover .back .paper{position:absolute;inset:.7em 0 .7em .7em;border-radius:.5em 0 0 .5em;} #jjms .jja-book .pg{position:absolute;inset:0;padding:1.3em 1.5em 2.4em;box-sizing:border-box;} #jjms .jja-book .pno{position:absolute;bottom:.7em;font:400 13px/1 \"Joes Journey Headline\",Georgia,serif;opacity:.5;} #jjms .jja-book .front .pno{right:1.3em;}#jjms .jja-book .back .pno{left:1.3em;} #jjms .jja-book .kicker{font:800 max(13px,calc(var(--ph) * .034))/1.2 \"Joes Journey Headline\",Arial,sans-serif;letter-spacing:.16em;color:#5b1622;opacity:.75;text-transform:uppercase;} #jjms .jja-book .inside{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.1em;text-align:center;padding:1.6em 1.6em 2.6em;} #jjms .jja-book .inside svg.crest{width:30%;height:auto;} #jjms .jja-book .inside p{margin:0;font:400 max(14px,calc(var(--ph) * .042))/1.4 \"Joes Journey Headline\",Georgia,serif;color:#4a1320;} #jjms .jja-book .inside p.sign{font:400 13px/1.3 \"Joes Journey Headline\",Georgia,serif;letter-spacing:.1em;text-transform:uppercase;opacity:.7;} #jjms .jja-book .data{display:flex;flex-direction:column;gap:.45em;padding:1em 1.1em 2.1em;font-family:Arial,\"Helvetica Neue\",sans-serif;} #jjms .jja-book .data .dh{display:flex;flex-direction:column;gap:.1em;border-bottom:1px solid rgba(91,22,38,.25);padding-bottom:.4em;} #jjms .jja-book .data .dh b{font:700 max(16px,calc(var(--ph) * .05))/1.1 \"Joes Journey Headline\",Georgia,serif;letter-spacing:.06em;color:#5b1622;} #jjms .jja-book .data .dh span{font-size:13px;font-weight:700;letter-spacing:.1em;color:#6b4a78;} #jjms .jja-book .data .drow{display:flex;gap:.9em;align-items:flex-start;} #jjms .jja-book .data .dph{flex:none;width:31%;aspect-ratio:3/4;border-radius:.3em;overflow:hidden;background:linear-gradient(180deg,#e9e1ef,#d9cfe4);box-shadow:inset 0 0 0 1px rgba(107,74,120,.25);} #jjms .jja-book .data .dph img{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 18%;filter:saturate(.75) contrast(1.05);} #jjms .jja-book .data dl{margin:0;min-width:0;} #jjms .jja-book .data dt{font-size:13px;line-height:1.1;color:#6b4a78;letter-spacing:-.01em;}#jjms .jja-book .data .dgrid{display:grid;grid-template-columns:1fr 1fr;gap:0 .8em;} #jjms .jja-book .data dd{margin:.05em 0 .35em;font-size:max(14px,calc(var(--ph) * .037));font-weight:700;font-family:\"Joes Journey Headline\",Georgia,serif;line-height:1.15;color:#1d1d26;letter-spacing:.02em;} #jjms .jja-book .data .dsig{display:flex;flex-direction:column;}#jjms .jja-book .data .dsig i{font-style:normal;font-size:13px;color:#6b4a78;} #jjms .jja-book .data .dsig span{font:700 max(18px,calc(var(--ph) * .052))/1.1 \"Joes Journey Headline\",Georgia,serif;color:#1f3a8a;rotate:-3deg;} #jjms .jja-book .data .mrz{margin-top:auto;display:flex;flex-direction:column;font:400 calc((var(--pw) - 4.1em) / 18.2)/1.3 \"Courier New\",monospace;letter-spacing:0;color:#222;white-space:nowrap;overflow:hidden;} #jjms .jja-book .reg{display:flex;flex-direction:column;padding:1em 1.3em 2.3em;} #jjms .jja-book .reg h3{margin:0;font:700 max(24px,calc(var(--ph) * .075))/1 \"Joes Journey Headline\",Georgia,serif;color:#1f3a8a;rotate:-1deg;} #jjms .jja-book .snaps{position:relative;flex:1;min-height:0;margin:.4em 0 .6em;} #jjms .jja-book .snap{position:absolute;box-sizing:border-box;background:#fff;padding:3% 3% 9%;border:0;box-shadow:0 .4em 1em rgba(0,0,0,.28);cursor:zoom-in;transition:scale .25s ease;} #jjms .jja-book .snap:hover{scale:1.04;z-index:3;} #jjms .jja-book .snap img{display:block;width:100%;height:100%;object-fit:cover;background:#ddd;} #jjms .jja-book .snap::before{content:\"\";position:absolute;left:50%;top:-6px;width:40%;height:14px;margin-left:-20%;rotate:-4deg;background:rgba(240,225,170,.75);box-shadow:0 1px 2px rgba(0,0,0,.12);clip-path:polygon(0 10%,5% 0,10% 12%,15% 0,20% 10%,80% 0,85% 12%,90% 0,95% 10%,100% 0,100% 90%,95% 100%,90% 88%,85% 100%,80% 90%,20% 100%,15% 88%,10% 100%,5% 90%,0 100%);} #jjms .jja-book .snaps.r{position:absolute;left:1.3em;right:1.3em;top:46%;bottom:2.4em;margin:0;}#jjms .jja-book .reg .note{margin:0;font:400 max(16px,calc(var(--ph) * .047))/1.3 \"Joes Journey Headline\",Georgia,serif;color:#1f3a8a;} #jjms .jja-book .stamp{position:absolute;width:calc(var(--ph) * .3);transform:translate(-50%,-50%) rotate(var(--r));opacity:0;mix-blend-mode:multiply;} #jjms .jja-book .stamp svg{width:100%;height:auto;display:block;overflow:visible;} #jjms .jja-book .stamp.rect{width:calc(var(--ph) * .34);}#jjms .jja-book .stamp.oval{width:calc(var(--ph) * .36);} #jjms .jja-book .stamped .stamp{animation:jjaThump .5s cubic-bezier(.3,1.4,.5,1) both;animation-delay:calc(.55s + var(--i) * .32s);} #jjms .jja-book .stamped.done .stamp{animation:none;opacity:.88;} @keyframes jjaThump{0%{opacity:0;transform:translate(-50%,-50%) rotate(calc(var(--r) + 16deg)) scale(2.3);filter:blur(3px);}55%{opacity:1;transform:translate(-50%,-50%) rotate(var(--r)) scale(.93);filter:blur(0);}75%{transform:translate(-50%,-50%) rotate(var(--r)) scale(1.02);}100%{opacity:.88;transform:translate(-50%,-50%) rotate(var(--r)) scale(1);}} #jjms .jja-book .corner{position:absolute;bottom:0;width:7em;height:7em;z-index:60;cursor:pointer;} #jjms .jja-book .corner.next{right:0;}#jjms .jja-book .corner.prev{left:0;} #jjms .jja-book .corner::after{content:\"\";position:absolute;bottom:.7em;width:2.6em;height:2.6em;box-shadow:-3px -3px 8px rgba(0,0,0,.25);transition:transform .3s cubic-bezier(.3,1.6,.5,1);animation:jjaCurl 3.6s ease-in-out infinite;}@keyframes jjaCurl{0%,72%,100%{transform:scale(1);}82%{transform:scale(1.35);}90%{transform:scale(1.1);}} #jjms .jja-book .corner.next::after{right:.7em;transform-origin:100% 100%;background:linear-gradient(315deg,transparent 48%,#fffdf6 50%,#ece5d2 64%,#d4cab0);border-top-left-radius:.6em;} #jjms .jja-book .corner.prev::after{left:.7em;transform-origin:0 100%;background:linear-gradient(45deg,transparent 48%,#fffdf6 50%,#ece5d2 64%,#d4cab0);border-top-right-radius:.6em;} #jjms .jja-book .corner:hover::after{animation:none;transform:scale(1.7);} #jjms .jja-book.closed .corner,#jjms .jja-book .corner.off{display:none;} #jjms .jja-count{position:absolute;left:var(--dock);top:calc(var(--btop) - var(--ph) / 2);z-index:6;transform:translate(-50%,calc(-100% - 8px));padding:.5em 1.1em;border-radius:999px;background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.5);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#fff;font:400 clamp(14px,1.1vw,18px)/1.1 \"Joes Journey Headline\",Georgia,serif;white-space:nowrap;pointer-events:none;} #jjms .jja-arr{position:absolute;top:calc(var(--btop) - var(--ph) / 2);z-index:7;min-width:7.6em;padding:.62em 1.25em;box-sizing:border-box;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.45);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#fff;font:700 clamp(15px,1.25vw,21px)/1 \"Joes Journey Headline\",Georgia,serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.45em;}#jjms .jja-arr .ai{font-size:1.45em;line-height:.7;margin-top:-.08em;} #jjms .jja-arr:hover{background:rgba(255,255,255,.16);}#jjms .jja-arr:active{border-color:#ff5fc8;box-shadow:0 0 0 3px rgba(255,95,200,.35);} #jjms .jja-arr.prev{left:calc(var(--dock) - var(--pw));transform:translateY(calc(-100% - 8px));opacity:.82;}#jjms .jja-arr.prev:hover{opacity:1;}#jjms .jja-arr.next{left:calc(var(--dock) + var(--pw));transform:translate(-100%,calc(-100% - 8px));border-color:rgba(255,224,150,.85);box-shadow:0 0 18px rgba(255,201,61,.45);} #jjms .jja-arr[disabled]{opacity:.3;cursor:default;box-shadow:none;} #jjms .jja.bmp .jja-parch{display:none;}#jjms .jja-dot{position:absolute;width:clamp(6px,.46vw,9px);height:clamp(6px,.46vw,9px);margin:calc(clamp(6px,.46vw,9px) / -2) 0 0 calc(clamp(6px,.46vw,9px) / -2);box-sizing:border-box;border-radius:50%;pointer-events:none;z-index:2;background:radial-gradient(circle at 38% 34%,#d9774a,#9c3318 55%,#6e1f0e 100%);border:0;box-shadow:0 0 0 1.5px rgba(255,244,214,.85),0 0 6px 2px rgba(255,236,190,.55);animation:jjaDot 3.4s ease-in-out infinite;} #jjms .jja-dot.sm{width:clamp(5px,.36vw,7px);height:clamp(5px,.36vw,7px);margin:calc(clamp(5px,.36vw,7px) / -2) 0 0 calc(clamp(5px,.36vw,7px) / -2);}#jjms .jja-dot:nth-child(3n){animation-delay:-.9s;}#jjms .jja-dot:nth-child(3n+1){animation-delay:-1.8s;} @keyframes jjaDot{50%{transform:scale(1.2);opacity:.8;}} #jjms .jja-book .cont .leg{display:flex;flex-wrap:wrap;align-items:center;gap:.35em .9em;margin-top:1.1em;font-size:max(12px,calc(var(--ph) * .04));color:#3a2a2a;} #jjms .jja-book .cont .leg span{display:inline-flex;align-items:center;gap:.4em;white-space:nowrap;} #jjms .jja-book .cont .leg .lp{width:.95em;height:.95em;box-sizing:border-box;border-radius:50%;border:.2em solid #fff;background:radial-gradient(circle at 38% 32%,#ff7fd0,#ff00f5 60%,#a1009a);box-shadow:0 0 0 1px rgba(160,0,150,.4),0 0 .45em rgba(255,0,245,.7);} #jjms .jja-book .cont .leg .ld{width:.55em;height:.55em;border-radius:50%;background:radial-gradient(circle at 38% 34%,#d9774a,#9c3318 55%,#6e1f0e);box-shadow:0 0 0 1.5px rgba(255,244,214,.9),0 0 .4em rgba(200,140,60,.6);} #jjms .jja-map .rt.ink2{stroke:#c2187a;} #jjms .jja-book.flick .leaf{transition-duration:.5s;} #jjms .jja-book .cont .note{position:static;margin:.8em 0 0;} #jjms .jja-book .cont .note.big{font-size:max(16px,calc(var(--ph) * .062));line-height:1.22;} #jjms .jja-book .cont .note{font-size:max(13px,calc(var(--ph) * .047));} #jjms .jja-book .cont .tally{display:flex;flex-direction:column;align-items:center;justify-content:center;height:80%;text-align:center;color:#5b1622;font-family:\"Joes Journey Headline\",Georgia,serif;} #jjms .jja-book .cont .tally b{font-size:calc(var(--ph) * .28);line-height:1;font-weight:700;opacity:.85;} #jjms .jja-book .cont .tally span{font-size:max(15px,calc(var(--ph) * .045));letter-spacing:.12em;text-transform:uppercase;opacity:.7;} #jjms .jja-book .cont .tally em{margin-top:1.2em;font-style:normal;font-size:max(15px,calc(var(--ph) * .045));color:#1f3a8a;}  #jjms .v2learn .jjms-tv{left:19%;top:8%;translate:0 0;width:min(36vw,44vh,580px);aspect-ratio:16/9.5;rotate:-2deg;}#jjms .sub .ch.gl{color:#7CF9C4;text-shadow:0 0 10px rgba(124,249,196,.8);}#jjms .myhint{position:relative;z-index:3;display:inline-flex;margin-top:14px;padding:.45em 1.1em;border-radius:999px;border:1px solid rgba(124,249,196,.6);background:rgba(0,0,0,.4);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#c8ffe9;font-size:clamp(12px,.95vw,15px);font-weight:700;animation:jjmsPrompt 1.8s ease-in-out infinite;transition:opacity .5s ease;}#jjms .step.myst-tried .myhint{opacity:0;pointer-events:none;}#jjms .step.atlas2{margin-top:9vh;} #jjms .jjl-card{position:absolute;z-index:4;display:block;padding:0;margin:0;border:0;background:none;cursor:pointer;color:#fff;font:inherit;text-align:center;} #jjms .jjl-stage{position:relative;display:block;width:100%;} #jjms .jjl-f{position:absolute;inset:0;opacity:0;transition:opacity .35s ease;pointer-events:none;} #jjms .jjl-f.on{opacity:1;} #jjms .jjl-f.pop{animation:jjlPop .55s cubic-bezier(.3,1.6,.5,1);} @keyframes jjlPop{0%{transform:scale(.72) rotate(-4deg);}60%{transform:scale(1.07) rotate(1deg);}100%{transform:none;}} #jjms .jjl-f img,#jjms .jjl-f video{display:block;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 12px 18px rgba(0,0,0,.45));} #jjms .jjl-sport{left:3.5%;top:64%;width:min(22vw,36vh);} #jjms .jjl-sport .jjl-stage{aspect-ratio:16/9;} #jjms .jjl-int{right:4%;top:7.5%;width:min(14vw,22vh);} #jjms .jjl-int .jjl-stage{aspect-ratio:1;} #jjms .jjl-int .jjl-stage::before,#jjms .jjl-sport .jjl-stage::before{content:\"\";position:absolute;inset:6% 8%;border-radius:50%;background:radial-gradient(closest-side,rgba(255,201,61,.28),rgba(26,166,183,.12) 60%,transparent 100%);filter:blur(8px);} #jjms .jjl-pill{display:inline-flex;align-items:center;gap:.35em;margin:.5em 0 0;padding:.45em 1em;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.4);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);font-size:clamp(12px,.9vw,15px);font-weight:400;white-space:nowrap;} #jjms .jjl-pill b{color:#FFC93D;font-weight:700;} #jjms .jjl-sport .jjl-pill{margin:0 0 .4em;} #jjms .jjl-hint{display:block;margin-top:.3em;font-size:12px;letter-spacing:.03em;text-transform:none;opacity:.6;} #jjms .jjl-card:hover .jjl-stage{scale:1.04;}#jjms .jjl-stage{transition:scale .3s cubic-bezier(.3,1.5,.5,1);} @media (max-aspect-ratio:1/1){#jjms .v2learn .jjms-tv{left:3%;top:12%;width:46vw!important;}#jjms .jjl-int{right:3%;top:11%;width:34vw;}#jjms .jjl-sport{left:3%;top:64%;width:46vw;}#jjms .jjl-pill{font-size:11px;}}#jjms .jja.bmp .jja-mk .lbl{color:rgba(255,246,222,.82);text-shadow:0 1px 2px rgba(15,25,45,.95),0 0 7px rgba(15,25,45,.8);}#jjms .jja.bmp .jja-mk.on .lbl{color:#fff;}#jjms .jja.bmp{--pw:calc(var(--ph) * .7);}#jjms .jja.bmp .jja-map{aspect-ratio:var(--mar,1.807);transition:left .8s cubic-bezier(.45,0,.2,1),top .8s cubic-bezier(.45,0,.2,1),width .8s cubic-bezier(.45,0,.2,1);}#jjms .jja.bmp .jja-book{transform-origin:75% 100%;transition:transform .9s cubic-bezier(.45,0,.2,1),left .8s cubic-bezier(.45,0,.2,1),top .8s cubic-bezier(.45,0,.2,1),opacity .6s ease,translate .9s cubic-bezier(.4,0,.2,1),scale .9s cubic-bezier(.4,0,.2,1),filter .6s ease;}#jjms .jja.away .jja-book{opacity:0;translate:0 -6vh;scale:.86;filter:blur(3px);pointer-events:none;}#jjms .jja.away .jja-count,#jjms .jja.away .jja-arr{opacity:0;pointer-events:none;transition:opacity .4s ease;}#jjms .jja.bmp .jja-book.closed{transform:translate(calc(-50% - var(--pw) / 2),-50%) scale(.8);}#jjms .jja.bmp .jja-count,#jjms .jja.bmp .jja-arr{transition:left .8s cubic-bezier(.45,0,.2,1),top .8s cubic-bezier(.45,0,.2,1),opacity .3s ease;}#jjms .jja.bmp .jja-book.closed ~ .jja-count{top:calc(var(--btop) - var(--ph) * .3);}#jjms .jja-book.closed ~ .jja-arr{opacity:0;pointer-events:none;}@media (min-aspect-ratio:1/1){#jjms .jja.bmp{--T:calc(max(9vh,64px) + 2.5 * clamp(22px,3.1vw,44px) + 12px);--mw:min(92vw,calc((100vh - 104px - var(--T)) / .664));--ph:calc(var(--mw) * .36);--dock:calc(50% + var(--mw) * .062);--btop:calc(var(--T) + var(--mw) * .484);}#jjms .jja.bmp .jja-map{left:calc(50% - var(--mw) / 2);top:var(--T);width:var(--mw);}#jjms .jja.bmp.two{--mw:min(92vw,calc((100vh - 104px - var(--T)) / .521));--ph:calc(var(--mw) * .271);--dock:calc(50% + var(--mw) * .07);--btop:calc(var(--T) + var(--mw) * .3855);}#jjms .jja.bmp .jja-arr{top:calc(var(--btop) + var(--ph) * .5 - 26px);}#jjms .jja.bmp .jja-arr.prev{left:calc(var(--dock) - var(--pw) - 12px);transform:translate(-100%,-50%);}#jjms .jja.bmp .jja-arr.next{left:calc(var(--dock) + var(--pw) + 12px);transform:translate(0,-50%);}}@media (max-aspect-ratio:1/1){#jjms .jja.bmp{--mw:min(94vw,46vh);--ph:min(40vh,66vw,calc(57vh - var(--mw) / var(--mar,1.807)));--dock:50%;--btop:calc(86% - var(--ph) / 2);}#jjms .jja.bmp .jja-map{left:calc(50% - var(--mw) / 2);top:24%;width:var(--mw);}} #jjms .trav.tclipset .tlw{position:relative;display:block;scale:.7;transition:scale .35s cubic-bezier(.22,1,.36,1);} #jjms .step.live .trav.tclipset .tlw{scale:1;} #jjms .step.live .trav.tclipset:hover .tlw,#jjms .step.live .trav.tclipset.hot .tlw{scale:1.12;} #jjms .trav.tclipset .tlead{border:0;border-radius:0;box-shadow:none;scale:1!important;filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));} #jjms .trav.tclipset .tpeek{position:absolute;left:30%;top:18%;width:112%;height:auto;rotate:7deg;filter:drop-shadow(0 10px 16px rgba(0,0,0,.5));transition:translate .45s cubic-bezier(.22,1,.36,1),rotate .45s ease;} #jjms .trav.tclipset:hover .tpeek,#jjms .trav.tclipset.hot .tpeek{translate:12% 4%;rotate:10deg;} #jjms .trav.tclipset .tglow{position:absolute;border-radius:3px;background:rgba(255,226,0,.26);mix-blend-mode:multiply;box-shadow:0 0 5px 1px rgba(255,214,0,.28);animation:jjnpGlow 3.2s ease-in-out infinite;} @keyframes jjnpGlow{50%{box-shadow:0 0 9px 2px rgba(255,214,0,.45);}} #jjms .clipw{position:relative;filter:drop-shadow(0 3vh 5vh rgba(0,0,0,.55));} #jjms .clipw > img{display:block;width:100%;height:auto;} #jjms .clipw .hl{position:absolute;mix-blend-mode:multiply;border-radius:3px 7px 4px 6px;transform-origin:0 50%;background:linear-gradient(90deg,rgba(255,228,0,.55),rgba(255,216,0,.7) 30%,rgba(255,230,10,.5) 65%,rgba(255,220,0,.66));box-shadow:0 0 0 .5px rgba(255,220,0,.25);} #jjms .clipw .hl::after{content:\"\";position:absolute;inset:18% -1% 10% 1%;border-radius:4px;background:rgba(255,224,0,.22);} #jjms .clipw .zs{position:absolute;filter:drop-shadow(0 .5vh .8vh rgba(30,12,0,.45));} #jjms .clipw .zi{position:absolute;inset:0;overflow:hidden;background:#e7d6ae;clip-path:polygon(0 6%,4% 0,9% 5%,15% 1%,22% 4%,30% 0,38% 5%,47% 1%,55% 4%,63% 0,71% 5%,79% 1%,87% 4%,94% 0,100% 5%,99% 50%,100% 94%,95% 100%,88% 96%,80% 100%,72% 95%,63% 100%,55% 96%,46% 100%,38% 95%,29% 100%,21% 96%,13% 100%,6% 95%,0 100%,1% 50%);} #jjms .clipw .zi img{position:absolute;max-width:none;max-height:none;box-shadow:none;} #jjms .clipw .lead-ln{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;} #jjms .clipw .lead-ln path{fill:none;stroke:rgba(255,236,200,.8);stroke-width:1.4;stroke-dasharray:3 3;vector-effect:non-scaling-stroke;} #jjms .clipw.play .hl{animation:jjnpSwipe .45s cubic-bezier(.4,0,.2,1) both;animation-delay:calc(.2s + var(--i) * .16s);} @keyframes jjnpSwipe{from{transform:scaleX(0);}to{transform:none;}} #jjms .clipw.play .zs{animation:jjnpGrow .7s cubic-bezier(.3,1.3,.5,1) both;animation-delay:calc(1.1s + var(--j) * .35s);} @keyframes jjnpGrow{from{transform:scale(.08);opacity:0;}30%{opacity:1;}to{transform:none;opacity:1;}} #jjms .clipw.play .lead-ln path{stroke-dasharray:400;stroke-dashoffset:400;animation:jjnpDraw .6s ease-out both;animation-delay:calc(1.1s + var(--j) * .35s);} @keyframes jjnpDraw{to{stroke-dashoffset:0;stroke-dasharray:3 3;}} #jjms-coll.clipset .cname{font-size:clamp(18px,2vw,32px);line-height:1.25;}#jjms-coll.clipset::before{content:\"\";position:absolute;inset:0;background:radial-gradient(ellipse 75% 70% at 50% 45%,rgba(5,7,18,.8),rgba(5,7,18,.93));pointer-events:none;} #jjms-coll .cshot.cclip{border:0;border-radius:0;background:none;overflow:visible;line-height:normal;box-shadow:none;width:var(--cw);} #jjms-coll .cshot.cclip img{max-width:none;max-height:none;box-shadow:none;} #jjms-coll .cshot.cclip .clipw > img{width:100%;height:auto;}"; document.head.appendChild(stV2);   /* the v2 slides (see v2() below) */
    /* now and then one of the favourites gives a little jiggle — only on the slide that is on screen */
    setInterval(function () { if (document.hidden || document.body.classList.contains('jj-modal-open')) return;
      var c = document.querySelectorAll('#jjms .step.cur .phw[data-jig],#jjms .step.cur .jjg.dealt .jjg-card[data-jig]'); if (!c.length) return;
      var el = c[Math.floor(Math.random() * c.length)]; if (el.classList.contains('blown')) return;
      var im = el.querySelector('img'); if (!im || !im.animate) return; el.style.zIndex = '50';   /* WAAPI on rotate / scale / opacity: rides on top of the CSS animations already on the card without restarting any of them */
      var an = im.animate([{ offset: .15, rotate: '-6deg', scale: '1.08', opacity: 1 }, { offset: .32, rotate: '5deg', scale: '1.1', opacity: 1 }, { offset: .5, rotate: '-4deg', scale: '1.08', opacity: 1 }, { offset: .68, rotate: '2.5deg', scale: '1.05', opacity: 1 }, { offset: .85, rotate: '-1deg', scale: '1.02' }], { duration: 1000, easing: 'ease-in-out' });
      an.onfinish = function () { el.style.zIndex = ''; }; }, 2200);
    if (TXT === 'wordsfocus') setTimeout(function () { var ss = document.querySelectorAll('#jjms .step'); for (var a = 0; a < ss.length; a++) { var ws = ss[a].querySelectorAll('.cap .word'), wb = ss[a].querySelectorAll('.sub .word'), b;
      for (b = 0; b < ws.length; b++) ws[b].style.setProperty('--wi', b); for (b = 0; b < wb.length; b++) wb[b].style.setProperty('--wi', ws.length + 2 + b); } }, 1200);
    setTimeout(function () { if (!window.IntersectionObserver) return; var fio = new IntersectionObserver(function (es) { es.forEach(function (e) { var v = e.target;   /* the flyer loads only when its slide nears, and plays only while it is on screen */
      if (e.isIntersecting) { if (!v._src) { v._src = 1; var b = SB + v.getAttribute('data-base'); v.innerHTML = '' + jjClipSrc(b) + ''; v.load(); } var pp = v.play(); if (pp && pp.catch) pp.catch(function () {}); } else { try { v.pause(); } catch (x) {} } }); }, { rootMargin: '60% 0px 60% 0px' });
      Array.prototype.forEach.call(document.querySelectorAll('#jjms .jjms-flyer'), function (v) { fio.observe(v); });
      var lio = new IntersectionObserver(function (es) { es.forEach(function (e) { var v = e.target;   /* looping cards: the same deal, one mp4 */
        if (e.isIntersecting) { if (!v._src) { v._src = 1; v.src = v.getAttribute('data-src'); v.load(); } var pp = v.play(); if (pp && pp.catch) pp.catch(function () {}); } else { try { v.pause(); } catch (x) {} } }); }, { rootMargin: '40% 0px 40% 0px' });
      Array.prototype.forEach.call(document.querySelectorAll('#jjms .phw .phloop:not(.phonce)'), function (v) { lio.observe(v); }); }, 1800);
    setTimeout(function governSky(){ var sky = document.getElementById('jjms-sky'); if (!sky || !window.IntersectionObserver) return;
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('jj-off', !e.isIntersecting); }); }, { rootMargin: '40% 0px 40% 0px' });
      var allSky = document.documentElement.classList.contains('jjms-skyfar');   /* the switch: everything in the six parallax layers is culled by skyCull() in render(), with no observer at all */
      sky.querySelectorAll('img,.gneb,.gspiral,i,span').forEach(function (n) { if (allSky && n.closest('.slayer')) return; if (getComputedStyle(n).animationName !== 'none') io.observe(n); }); }, 2500);
    var mount = document.getElementById('jj-mystory-mount') || document.body;

    /* the fixed swirl backdrop (parallaxed in render) */
    var bg = document.createElement('div'); bg.id = 'jjms-bg';
    bg.innerHTML = '<img class="bgimg" src="' + SB + 'storytime-bg.svg' + '" alt=""><div class="bwash"></div>';
    document.body.appendChild(bg);
    var bgImg = bg.querySelector('.bgimg');

    /* the animated sky — a deterministic field spread down the WHOLE scroll (rnd() keeps it stable
       between visits). Stars glow + grow, moons glow, spirals spin, pink/blue nebulas drift. */
    var seed = 0; function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    var sky = '';
    /* keep stars off the text. MOST are packed into the vertical GAPS between screens (near the step
       boundaries — half a screen from any caption, so above/below the text as you scroll); the rest
       sit out in the left / right thirds. A caption centre is (k+0.5)/16; a boundary k/16 is the gap. */
    var NSTEPS = STEPS.length, NSECT = NSTEPS + 1;               /* +1 = the finale section */
    /* a decoration position that stays OFF the text (left/right, or a gap between steps) AND out of
       the finale zone (top < 90%, so nothing clutters the Big Bang). Used by stars, moons, spirals. */
    function starXY() {
      var x, y;
      if (rnd() < 0.35) { x = rnd() < 0.5 ? rnd() * 26 : 74 + rnd() * 26; y = rnd() * 90; }   /* left / right */
      else { x = rnd() * 100; y = (Math.floor(rnd() * (NSTEPS - 1)) + 1) / NSECT * 100 + (rnd() - 0.5) * 3.5; }   /* in a gap */
      return x.toFixed(2) + '%;top:' + Math.max(-6, Math.min(90, y)).toFixed(2) + '%';
    }
    /* SUPER-PARALLAX: every sky element is binned by SIZE into one of 6 layers, each drifting at its
       own speed — the BIGGER (further away) it is the SLOWER it moves, the smaller/nearer the FASTER.
       render() translates each .slayer by (1-f)*scrollY, so a small f = big lag = deep background. */
    var binF = [0.30, 0.42, 0.55, 0.68, 0.82, 0.95];             /* bin 0 = biggest / slowest … 5 = smallest / fastest */
    function binFor(px) { return px >= 200 ? 0 : px >= 120 ? 1 : px >= 70 ? 2 : px >= 40 ? 3 : px >= 20 ? 4 : 5; }
    var lay = ['', '', '', '', '', ''];
    for (var sd = 0; sd < 240; sd++) {                            /* LOADS of glowing dots — bigger + all different */
      var dw = 5 + rnd() * 20;
      lay[binFor(dw)] += '<img class="gdot' + (rnd() < 0.34 ? ' tw' : '') + '" src="' + SB + 'sky-dot.svg" alt="" style="left:' + starXY() +
        ';width:' + dw.toFixed(0) + 'px;--d:' + (1.8 + rnd() * 7).toFixed(1) + 's;--dl:-' + (rnd() * 8).toFixed(1) +
        's;--pk:' + (0.5 + rnd() * 0.5).toFixed(2) + ';--sc:' + (1.1 + rnd() * 0.7).toFixed(2) + '">';
    }
    for (var sk = 0; sk < 38; sk++) {                             /* 4-point sparkle stars — bigger */
      var kw = 18 + rnd() * 30;
      lay[binFor(kw)] += '<img class="gstar' + (rnd() < 0.34 ? ' tw' : '') + '" src="' + SB + 'sky-star.svg" alt="" style="left:' + starXY() +
        ';width:' + kw.toFixed(0) + 'px;--d:' + (3 + rnd() * 5).toFixed(1) + 's;--dl:-' + (rnd() * 6).toFixed(1) +
        's;--pk:' + (0.7 + rnd() * 0.3).toFixed(2) + ';--g:' + (7 + rnd() * 13).toFixed(0) + 'px">';
    }
    for (var nb = 0; nb < 12; nb++) {                             /* soft glowing pink / blue nebulas — biggest, so the slowest bin */
      var pink = rnd() < 0.5, ns = 260 + rnd() * 380;
      var col = pink ? 'radial-gradient(circle,rgba(255,80,250,.62),rgba(200,40,220,.22) 45%,transparent 72%)'
                     : 'radial-gradient(circle,rgba(90,160,255,.6),rgba(60,110,220,.22) 45%,transparent 72%)';
      lay[binFor(ns)] += '<div class="gneb" style="left:' + starXY() +
        ';width:' + ns.toFixed(0) + 'px;height:' + (ns * (0.6 + rnd() * 0.5)).toFixed(0) + 'px;background:' + col +
        ';--d:' + (12 + rnd() * 10).toFixed(0) + 's;--dl:-' + (rnd() * 10).toFixed(0) + 's"></div>';
    }
    for (var sp = 0; sp < 11; sp++) {                             /* spinning galaxies — SMALLER, all different, OFF the text */
      var ss = 45 + rnd() * 70;
      lay[binFor(ss)] += '<div class="gspiral" style="left:' + starXY() +
        ';width:' + ss.toFixed(0) + 'px;--g:' + (7 + rnd() * 5).toFixed(1) + 's">' +
        '<img src="' + SB + 'sky-galaxy.svg" alt="" style="--d:' + (50 + rnd() * 45).toFixed(0) + 's"></div>';
    }
    for (var mn = 0; mn < 13; mn++) {                             /* glowing moons — BIGGER, all different, kept OFF the text */
      var mw = 40 + rnd() * 130;
      lay[binFor(mw)] += '<img class="gmoon" src="' + SB + 'sky-moon.svg" alt="" style="left:' + starXY() +
        ';width:' + mw.toFixed(0) + 'px;--d:' + (4.5 + rnd() * 5).toFixed(1) + 's;--dl:-' + (rnd() * 4).toFixed(1) + 's">';
    }
    for (var L = 0; L < binF.length; L++) sky += '<div class="slayer" data-f="' + binF[L] + '">' + lay[L] + '</div>';

    var wrap = document.createElement('div'); wrap.id = 'jjms';
    /* the sky sits behind the steps, spanning the whole story; the era mascot flies over it */
    var skyHtml = '<div id="jjms-sky">' + sky + '</div>';
    var html = skyHtml;
    for (var i = 0; i < STEPS.length; i++) {
      var s = STEPS[i];
      var ph = '', pl = (s.games || s.cinema) ? [] : (PHOTOS[i] || []);   /* the games + cinema build their own pieces from PHOTOS (v2) */
      /* FILMS (step 5): move any poster sitting under the centred caption to the NEAREST free spot that
         clears the text AND doesn't overlap another poster (see layoutFilms). Other steps keep design pos. */
      var adj = (i === 3 && pl.length) ? layoutFilms(pl) : null;
      for (var p0 = 0; p0 < pl.length; p0++) {
        var P = pl[p0];
        var px = adj ? adj[p0].x : P.x, py = adj ? adj[p0].y : P.y;
        ph += '<span class="phw' + (P.deco ? ' deco' : '') + (P.logo ? ' logo' : '') +
          (P.tap ? '" data-tap="1' : '') + (P.vid || P.yt ? ' phvid' : '') + (P.cap ? ' hascap' : '') + (P.secret ? ' secret' : '') + (P.like ? ' like' : '') + (P.skl ? ' skl' + (P.skl === 'lead' ? ' skl-lead' : '') : '') + '"' + (P.like ? ' data-cursor="none"' : '') +
          (P.cap ? ' data-cap="' + esc(P.cap) + '"' : '') + (P.rating ? ' data-rating="' + esc(P.rating) + '"' : '') +
          (typeof P.vid === 'string' ? ' data-vid="' + esc(P.vid) + '"' : '') +
          (typeof P.yt === 'string' ? ' data-yt="' + esc(P.yt) + '"' : '') +
          (P.note ? ' data-note="' + esc(P.note) + '"' : '') + (P.party ? ' data-party="1"' : '') +
          (P.game ? ' data-game="1" data-stars="' + (P.stars || 4) + '"' : '') + (P.extra ? ' data-extra="' + esc(P.extra) + '"' : '') + (P.found ? ' data-found="' + esc(P.found) + '"' : '') + (P.award ? ' data-award="' + esc(P.award) + '"' : '') + (P.jig ? ' data-jig="1"' : '') +
          (P.alt ? ' data-alt="' + esc(P.alt) + '"' : '') + (P.once ? ' data-cursor="hover"' : '') +
          ' style="left:' + px + '%;top:' + py + '%;width:' + P.w + 'vw;--pw:' + P.w + 'vw;' +
          'rotate:' + P.rot + 'deg;--d:' + (P.d || (0.12 + p0 % 4 * 0.07).toFixed(2)) + '">' +
          '<span class="phs"><span class="phd" style="--dx:' + (11 + p0 % 3 * 6) + 'px;--dy:' + (14 + p0 % 4 * 5) + 'px;' +
          '--dr:' + (0.9 + p0 % 3 * 0.45).toFixed(2) + 'deg;' +
          'animation-duration:' + (10.5 + p0 * 1.6).toFixed(1) + 's;animation-delay:-' + (p0 * 2.6).toFixed(1) + 's">' +
          (P.extra ? (function () { var ex = P.extra.split('|'), o = ''; for (var q = 0; q + 1 < ex.length && q < 4; q += 2) o += '<i class="fxc ' + (q ? 'fxr' : 'fxl') + '" style="background-image:url(' + SB + ex[q] + ')"></i>'; return o; })() : '') +   /* the rest of the set tucked BEHIND the lead cover: one peeking out each side, fanning into a row when the card is blown up */
          '<img src="' + SB + P.src + '" alt="" decoding="async">' +
          (P.loop ? '<video class="phloop" muted loop playsinline preload="none" poster="' + SB + P.src + '" data-src="' + SB + P.vid + '"></video>' : '') +
          (P.once ? '<video class="phloop phonce" muted playsinline preload="none" poster="' + SB + P.src + '" data-base="' + esc(P.once) + '"></video>' : '') +
          (P.logo ? '<img class="lgtint" src="' + SB + 'skyrock-blue.webp" alt="" decoding="async">' : '') +
          (P.deco ? (P.cap && !P.tap ? '<span class="dcap">' + esc(P.cap) + '</span>' : '') :
            (P.cap && P.hoverCap !== false ? '<span class="phcap">' + esc(P.cap) + '</span>' : '')) +
          '</span></span></span>';
      }
      /* a phone playing the real screen recording on its screen — muted and looping so it's alive
         without demanding anything; clicking opens it big with sound and controls */
      if (s.phone)
        ph += '<span class="jjphone" data-vid="' + esc(s.phone.src) + '"' +
          (s.phone.cap ? ' data-cap="' + esc(s.phone.cap) + '"' : '') +
          ' style="left:' + s.phone.x + '%;top:' + s.phone.y + '%;width:' + s.phone.w + 'vw">' +
          '<span class="pclip" style="--pd:' + (12.5).toFixed(1) + 's">' +
          '<video muted loop playsinline preload="metadata" src="' + SB + esc(s.phone.src) + '"></video>' +
          '<span class="pplay"></span></span></span>';
      /* the Super Reel phone — a TEMPLATE, drawn in code: gradient travel reels sliding past on a
         loop, with the app's search-first idea sketched as icons only (no fake copy). Product shots
         can replace the cards later. Clicking pops a heart, reel-style. */
      if (s.srp) {
        var SR_PAGES = [['Typography'], ['Wanda v2', 'wanda'], ['Iconography'], ['Video Reel content', 'reel'], ['Logo'], ['Trip Planning', 'trip'], ['Colour'], null, ['Design System Atoms'], ['Global Components'], ['Navigation'], ['CTA'], ['Onboarding'], ['Collaboration'], ['Details Page'], ['My Trip'], ['Trip Reel'], ['Account'], ['Collections'], ['Login'], ['Bookings']];   /* one column now (Joe, 2026-09-30), so the three real pages sit among the first rows */
        var SR_COMP = { reel: '<span class="cstack"><i>+</i><span>Add to<br>Trip</span><i>\u2726</i><span>Ask<br>Wanda</span><i>\u279C</i><span>Share</span></span>', trip: '<span class="ctile"><i></i><b>\u00a312 per ticket</b><span>The Etihad, Manchester</span></span>', wanda: '<span class="csearch"><i></i>Ask Wanda anything\u2026</span>' };
        var SR_BOARD = { reel: ['DISCOVERY FEED', 'Video Reel Content', 'Components needed for the video reel content', 'VRC'], trip: ['PLANNER', 'Trip Planning', 'Days, tiles and the drag that fills them', 'TP'], wanda: ['ASSISTANT', 'Wanda v2', 'The ask box, replies and suggestions', 'W2'] };
        /* SUPER REEL (Joe, 2026-09-26): the design system on top (a wide Figma window, tilted a touch left, nothing cut off) and the three
           phones in a row along the bottom, one per page with an arrow. Drag a piece from a board and its own phone lights up. */
        var SR_ORDER = ['reel', 'trip', 'wanda'], SR_PH = [['wanda', -4, 0], ['reel', 1, -2.1], ['trip', 5, -4.3]];   /* boards in the canvas; phones left to right: [page, tilt, float delay] */
        var SR_SCR = {
          reel: '<span class="srscr" data-pg="reel"><span class="sbg"></span><span class="sbar"></span><span class="live">LIVE</span><span class="stxt"><b>£12 per ticket</b><span>Enjoy The Etihad football ground and a night in the city</span></span><span class="slot" style="right:4%;bottom:14%;width:28%;height:36%"><span class="drop">Drop here</span></span></span>',
          trip: '<span class="srscr" data-pg="trip"><span class="sbg"></span><span class="sbar"></span><span class="live">LIVE</span><span class="sw" style="top:14%">My Trip<span>Manchester, 3 days</span></span><span class="srow" style="top:29%"><em>Day 1</em></span><span class="slot" style="left:6%;right:6%;top:46%;height:15%"><span class="drop">Drop here</span></span><span class="srow" style="top:64%"><em>Day 3</em></span></span>',
          wanda: '<span class="srscr" data-pg="wanda"><span class="sbg"></span><span class="sbar"></span><span class="live">LIVE</span><span class="sw">Hi, I’m Wanda<span>Tell me where you’re going and I’ll plan the rest</span></span><span class="slot" style="left:6%;right:6%;bottom:6%;height:10%"><span class="drop">Drop here</span></span></span>' };
        var GLP = 'ᚠᚢᚦᚨᚱᚷᚹᛁᛇᛉᛏᛒᛖᛗᛚᛞᛟ⟁⌖⍜⎔☌⟟';
        ph += '<div class="srmon" data-cursor="none"><div class="mscreen"><div class="mtop"><i></i><i></i><i></i>Super Reel Travel Design System</div>' +
          '<div class="mpages"><div class="mcols"><h6>---- ᚢᚷᛁᛖᛟ ----</h6>' + SR_PAGES.map(function (P, i) { if (!P) return '<h6>---- ᚠᚹᛇᛏᛒ ᚨᚱᛚᛞ ----</h6>'; var nm = P[1] ? P[0] : P[0].replace(/[A-Za-z]/g, function (c, i) { return GLP.charAt((c.charCodeAt(0) * 7 + i * 3) % GLP.length); });   /* the other pages read as alien script: the less they see the better (Joe) */
          return '<span class="pg' + (P[1] ? ' hot' : ' xen') + '"' + (P[1] ? ' data-pg="' + P[1] + '" data-cursor="hover"' : '') + '>' + nm + (P[1] ? '<i class="parr">←</i>' : '') + '</span>'; }).join('') + '</div></div>' +
          '<div class="mcanvas"><div class="mhint">Drag each <b>missing piece</b> onto its phone</div><div class="mboards">' + SR_ORDER.map(function (k) { var B = SR_BOARD[k]; return '<div class="mboard" data-pg="' + k + '"><small>' + B[0] + '</small><b>' + B[1] + '</b><em>' + B[2] + '</em><span class="mph">' + B[3] + '</span><span class="mrule"></span><span class="comp" data-pg="' + k + '" data-cursor="drag"><span class="ctab">Drag me to its phone</span>' + SR_COMP[k] + '</span></div>'; }).join('') + '</div></div>' +
          '<div class="mprops"><h6>Design</h6><p></p><p class="w"></p><p></p><h6>Text styles</h6><p class="w"></p><p></p><p class="w"></p><p></p></div></div></div>';
        ph += '<div class="srphones"><video class="srwanda" muted loop playsinline preload="none" data-auto="1" poster="' + SB + 'wanda-wand-poster.webp">' + jjClipSrc(SB + 'wanda-wand') + '</video>' + SR_PH.map(function (q, n) {
          return '<span class="srphone" data-pg="' + q[0] + '" style="--r:' + q[1] + 'deg;--fd:' + q[2] + 's"><span class="srclip">' + SR_SCR[q[0]] + '<span class="srnotch"></span></span>' +
            (n === 0 ? '<span class="srpeek l"><img src="' + (window.JJ_SCORE_BASE || SB) + 'co-alien-plain.webp" alt=""></span>' : n === 2 ? '<span class="srpeek r"><img src="' + (window.JJ_SCORE_BASE || SB) + 'logo-alien.webp" alt=""></span>' : '') + '</span>'; }).join('') + '</div>';   // Wanda waves her wand beside the Super Reel phone
      }
      /* the award itself — drawn, since the design frame has no trophy asset. Same celebration as
         the marked word, so either one sets it off. */
      if (s.trophy)
        ph += '<button type="button" class="jjtrophy" aria-label="Celebrate the award"' +
          ' style="left:' + s.trophy.x + '%;top:' + s.trophy.y + '%;width:' + s.trophy.w + 'vw">' +
          '<svg viewBox="0 0 64 76" aria-hidden="true">' +
            '<path class="tcup" d="M16 6h32v22a16 16 0 0 1-32 0z"/>' +
            '<path class="thandle" d="M16 12H8a8 8 0 0 0 8 12"/>' +
            '<path class="thandle" d="M48 12h8a8 8 0 0 1-8 12"/>' +
            '<path class="tstem" d="M32 44v10"/>' +
            '<path class="tbase" d="M20 66h24l-3-8H23z"/>' +
            '<path class="tbase" d="M16 66h32v5H16z"/>' +
            '<path class="tshine" d="M23 12v14a9 9 0 0 0 5 8"/>' +
          '</svg><i class="tglint"></i></button>';
      /* the client logos — they float, glow, and each does its own thing when pressed */
      var lgs = LOGOS[i] || [];
      for (var lq = 0; lq < lgs.length; lq++) {
        var G = lgs[lq];
        ph += '<button type="button" class="aglogo' + (/bima/.test(G.src) ? ' bima' : '') + '" data-fx="' + esc(G.fx) + '" aria-label="' + esc(G.t) + '"' +
          ' style="' + (G.cab && s.cabinet ? 'left:calc(' + s.cabinet.cx + '% + ' + (G.cab[0] - s.cabinet.w / 2).toFixed(2) + ' * var(--cu));top:calc(' + cabTop(s.cabinet) + ' + ' + G.cab[1] + ' * var(--cu));width:calc(' + G.cab[2] + ' * var(--cu))' : 'left:' + G.x + '%;top:' + G.y + '%;width:' + G.w + 'vw') + ';rotate:' + G.r + 'deg;--ad:' + (0.15 + lq * 0.19).toFixed(2) + 's;--fx:' + (((lq * 7) % 5 - 2) * 14) + 'vw;--fy:' + (((lq * 3) % 4 - 1.5) * 18) + 'vh;' +
          '--ld:' + (8 + (lq % 5) * 1.3).toFixed(1) + 's;--ldl:-' + (lq * 1.4).toFixed(1) + 's;' +
          '--lx:' + (7 + (lq % 3) * 4) + 'px;--ly:-' + (11 + (lq % 4) * 4) + 'px">' +
          '<span class="agin">' + (G.vid ? '<video class="agvid" muted playsinline preload="none" poster="' + SB + esc(G.src) + '" data-base="' + esc(G.vid) + '"></video>' : '<img src="' + SB + esc(G.src) + '" alt="" decoding="async">') +
          (G.shine ? '<i class="agshine" style="--m:url(' + SB + esc(G.src) + ')"></i>' : '') +
          '</span>' + (G.cab && s.cabinet ? '<span class="cabl">' + esc(G.t) + '</span>' : '') + '</button>';
      }
      /* scattered label chips (skills etc.) — one per entry, each drifting on its own timing */
      var tg = TAGS[i] || [];
      for (var tq = 0; tq < tg.length; tq++)
        ph += '<span class="stag' + (tg[tq].sm ? ' sm' : '') + (tg[tq].head ? ' shead' : '') + (tg[tq].grp ? ' held' : '') + (tg[tq].skl ? ' skl' + (tg[tq].skl === 'head' ? ' skl-head' : '') : '') + '"' + (tg[tq].grp ? ' data-grp="' + tg[tq].grp + '"' : '') + (tg[tq].fx ? ' data-fx="' + tg[tq].fx + '"' : '') +
          (tg[tq].txt ? ' data-txt="' + esc(tg[tq].txt) + '"' : '') +
          ' style="left:' + tg[tq].x + '%;top:' + tg[tq].y + '%;rotate:' + (tg[tq].r || 0) + 'deg">' +
          '<span class="sin" style="--td:' + (6.2 + (tq % 4) * 1.4).toFixed(1) + 's;--tdl:-' + (tq * 0.9).toFixed(1) +
          's;--tx:' + (3 + (tq % 3) * 2) + 'px;--ty:-' + (5 + (tq % 4) * 2) + 'px">' +
          tg[tq].i + ' ' + esc(tg[tq].t) + '</span></span>';
      /* the tablets that hold grouped pills (see TAGS[6]): one press cracks, the second bursts them out to their places */
      var grpsSeen = {}; for (var tg2 = 0; tg2 < tg.length; tg2++) if (tg[tg2].grp && !grpsSeen[tg[tg2].grp]) { grpsSeen[tg[tg2].grp] = 1; var hd = tg.filter(function (t) { return t.grp === tg[tg2].grp && t.head; })[0];
        ph += '<button type="button" class="jjms-tab' + (tg[tg2].grp === 'soft' ? ' figma' : '') + '" data-grp="' + tg[tg2].grp + '" data-cursor="hover" aria-label="Break the ' + esc(hd ? hd.t : tg[tg2].grp) + ' tablet" style="left:' + (tg[tg2].grp === 'subj' ? 13 : 87) + '%;top:68%">' +
          '<svg viewBox="0 0 120 150"><path class="stone" d="M14 8 h92 q8 0 8 8 v126 q0 8 -8 8 h-92 q-8 0 -8 -8 v-126 q0 -8 8 -8z"/><path class="spiral" d="M60 72 m0 -22 a22 22 0 1 1 -22 22 a16 16 0 1 0 16 -16 a10 10 0 1 1 -10 10 a5 5 0 1 0 5 -5" fill="none"/><g class="fig" transform="translate(47 49) scale(1.55)" fill="none" stroke="#FFC531" stroke-width="2.4" stroke-linejoin="round"><path d="M0 0h10a5 5 0 0 1 0 10H0z"/><path d="M10 0h5a5 5 0 0 1 0 10h-5z"/><path d="M0 10h10a5 5 0 0 1 0 10H0z"/><path d="M0 20h10a5 5 0 0 1-5 10H5a5 5 0 0 1-5-5z"/><circle cx="15" cy="15" r="5"/></g><path class="crk c1" d="M30 10 L44 40 L36 62 L52 96 L44 142"/><path class="crk c2" d="M92 6 L78 34 L86 58 L70 84 L80 118 L66 146"/><path class="crk c3" d="M8 70 L40 78 L62 70 L96 82 L112 74"/></svg>' +
          '<span class="tlbl">' + esc(hd ? hd.t : '') + '</span><span class="thint">Press to break</span></button>'; }
      /* clusters on this step: a lead photo with the rest of the set stacked behind it (+ countries) */
      for (var tv = 0; tv < CLUSTERS.length; tv++) {
        if (CLUSTERS[tv].step === i) {
          var T = CLUSTERS[tv], nT = T.files.length;
          if (T.clip) {   /* the clippings: the cut-outs themselves (no card), the second peeking behind, a glow on the lines about Joe */
            var C0 = CLIPS[T.files[0]], glw = '';
            C0.z.forEach(function (Z) { Z.hl.forEach(function (r) { glw += '<i class="tglow" style="left:' + (r[0] / C0.w * 100).toFixed(2) + '%;top:' + (r[1] / C0.h * 100).toFixed(2) + '%;width:' + (r[2] / C0.w * 100).toFixed(2) + '%;height:' + (r[3] / C0.h * 100).toFixed(2) + '%"></i>'; }); });
            ph += '<span class="trav tclipset" data-trav="' + T.key + '" style="left:' + T.x + '%;top:' + T.y + '%;width:' + T.w + 'vw;rotate:' + T.rot + 'deg">' +
              '<img class="tpeek" src="' + SB + T.files[1] + '" alt="" decoding="async"><span class="tlw"><img class="tlead" src="' + SB + T.files[0] + '" alt="Newspaper clipping" decoding="async">' + glw + '</span>' +
              '<span class="tmore">+' + (nT - 1) + ' more</span></span>';
            continue;
          }
          var peeks = '';
          for (var pk = 0; pk < Math.min(2, nT - 1); pk++)                  /* hint at what's behind */
            peeks += '<span class="tstack" style="transform:rotate(' + (pk ? -4 : 3.5) + 'deg) translate(' +
              (pk ? -7 : 7) + 'px,' + (pk ? -4 : -5) + 'px)"></span>';
          ph += '<span class="trav' + (T.tuck ? ' tuck' : '') + '" data-trav="' + T.key + '"' + (T.grp ? ' data-grp="' + T.grp + '"' : '') + ' style="left:' + T.x + '%;top:' + T.y + '%;width:' + T.w + 'vw;' + (T.tuck ? '--tkx:' + T.tuck[0] + 'vw;--tky:' + T.tuck[1] + 'vh;' : '') +
            'rotate:' + T.rot + 'deg">' + peeks +
            '<img class="tlead" src="' + SB + T.files[0] + '" alt="" decoding="async">' +
            (nT > 1 ? '<span class="tmore">+' + (nT - 1) + ' more</span>' : '') + '</span>';
          if (T.yr) ph += '<span class="tcc tyr" style="left:calc(' + T.x + '% - .4vw);top:calc(' + T.y + '% - 3.1vw);width:9vw;justify-content:flex-start"><span style="rotate:-2.6deg;--td:6.1s;--tdl:-1.3s;--tx:4px;--ty:-6px">\ud83d\udcc5 ' + esc(T.grp) + '</span></span>';   /* the year is one of the same floaty pills as the places */
          if (T.cc) {
            var chips = '';
            for (var cq = 0; cq < T.cc.length; cq++)
              chips += '<span style="rotate:' + [-2.6, 1.8, -1.2, 3.1, -3.4, 2.2, -1.9][cq % 7] + 'deg;' +
                '--td:' + (5.5 + (cq % 4) * 1.3).toFixed(1) + 's;--tdl:-' + (cq * 0.7).toFixed(1) +
                's;--tx:' + (3 + (cq % 3) * 2) + 'px;--ty:-' + (5 + (cq % 4) * 2) + 'px">' +
                T.cc[cq][1] + ' ' + esc(T.cc[cq][0]) + '</span>';
            /* a tilted card's BOX is taller than the photo itself (w·|sin| + h·|cos|) — clear that, or the
               chips end up sitting on top of their own picture */
            var tRad = Math.abs(T.rot) * Math.PI / 180;
            var boxH = T.w * Math.sin(tRad) + (T.w * T.ar) * Math.cos(tRad);
            /* ccSide clusters them BESIDE the photo (multi-line), otherwise they sit under it */
            var ccLeft = T.ccSide ? (T.x + '% + ' + (T.w + 1.2).toFixed(1) + 'vw') : (T.x + '%');
            var ccGap = (T.ccGap == null) ? 1.6 : T.ccGap;
            var ccTop = T.ccSide ? (T.y + '% + ' + (boxH * 0.22).toFixed(1) + 'vw') : (T.y + '% + ' + (boxH + ccGap).toFixed(1) + 'vw');
            ph += '<span class="tcc' + (T.tuck ? ' tuck' : '') + '" data-for="' + T.key + '"' + (T.grp ? ' data-grp="' + T.grp + '"' : '') + ' style="left:calc(' + ccLeft + ');top:calc(' + ccTop +
              ');width:' + T.ccw + 'vw;justify-content:flex-start">' + chips + '</span>';
          }
        }
      }
      /* step 0 keeps its light-strike caption; every other caption disperses letter by letter */
      /* the cinema step reads as one settled line: no per-letter scatter to fight through */
      var cap = i === 0 ? heroCap(s.cap) : (s.tall && !s.feat ? esc(s.cap) : disperseCap(s.cap, s.hot));
      var extra = i === 0 ? '<div class="flare"></div><div class="gring"></div>' : '';
      /* content steps (not the opening flare step) let their collage spill past the step edge, so posters
         near the bottom are never clipped — they carry on into the next section */
      var stepCls = 'step' + (i > 0 && (pl.length || ph) ? ' col' : '') + (s.srp ? ' srp' : '');
      var glogos = '';
      if (s.grow && s.grow.logos) glogos += '<div class="glogos">';
      if (s.grow && s.grow.logos)
        for (var lg2 = 0; lg2 < s.grow.logos.length; lg2++) {
          var L = s.grow.logos[lg2];
          glogos += '<span class="glogo" style="left:' + L.x + '%;top:' + L.y + '%;width:' + L.w + 'vw;' +
            'rotate:' + (L.r || 0) + 'deg;--ld:' + (7.5 + lg2 * 1.6).toFixed(1) + 's;--ldl:-' + (lg2 * 1.9).toFixed(1) + 's;' +
            '--lx:' + (9 + lg2 * 4) + 'px;--ly:-' + (14 + lg2 * 5) + 'px">' +
            '<span class="lgin"><img src="' + SB + esc(L.src) + '" alt="' + esc(L.t) + '" decoding="async">' +
            '<i class="lfall">' + esc(L.t) + '</i></span></span>';
        }
      if (s.grow && s.grow.logos) glogos += '</div>';
      if (s.duo || s.feat) glogos = '<div class="gdim"></div>';         /* the duo / feat steps borrow the cinema darkness */
      var grow = s.grow ? '<div class="gdim"></div>' + glogos +
        '<span class="gvid' + (s.grow.portrait ? ' port' : '') + '" data-vid="' + esc(s.grow.src) + '" data-cap="' + esc(s.grow.cap || '') + '">' +
        '<i class="gglow"></i>' +
        '<span class="gshell"><video muted loop playsinline preload="none" poster="' + SB + esc(s.grow.poster) +
        '" data-src="' + SB + esc(s.grow.src) + '"></video>' +   /* truly lazy: no src until its slide is a screen and a half away (preload=metadata still pulled ~1MB at page load) */
        '<span class="ghint"><span class="gs-off">\ud83d\udd07 Sound off</span>' +
        '<span class="gs-on">\ud83d\udd0a Sound on</span></span></span></span>' : '';
      html += '<div class="' + stepCls + (s.tall ? ' tall' : '') + (s.mystery ? ' myst' : '') + (s.duo ? ' duo' : '') + (s.feat ? ' feat" data-feat="' + (s.feat === true ? 'row' : s.feat) + (s.soft ? '" data-soft="1' : '') : '') + '" id="jjms-step-' + i + '" data-era="' + s.era + '"' +
        (s.tall ? ' style="height:' + (s.tall * 100) + 'vh"' : '') + '>' +
        (s.tall ? '<div class="stage">' : '') + extra + (s.duo || s.feat ? glogos : '') + ph + grow +
        (s.flyer ? '<video class="jjms-flyer" muted loop playsinline preload="none" data-base="' + esc(s.flyer.base) + '" style="left:' + s.flyer.x + '%;top:' + s.flyer.y + '%;width:' + s.flyer.w + 'vw"></video>' : '') +
        (s.scroll ? '<button type="button" class="jjscroll" data-cursor="hover" aria-label="Break the seal on the letter" style="left:' + s.scroll.x + '%;top:' + s.scroll.y + '%;width:' + s.scroll.w + 'vw">' +
          '<span class="sroll"></span><span class="sbody">' + (s.scroll.logo ? '<img class="slogo" src="' + SB + esc(s.scroll.logo) + '" alt="Pagoda Projects">' : '') + '<span class="stext">' + s.scroll.text + '</span></span><span class="sroll"></span>' +
          '<span class="seal"><i class="sl"></i><i class="sr"></i><i class="sj">J</i></span><span class="shint">Break the seal</span></button>' : '') +
        (s.cabinet ? (function (c) { var cy = cabTop(c), box = 'left:calc(' + c.cx + '% - ' + (c.w / 2) + ' * var(--cu));top:' + cy + ';width:calc(' + c.w + ' * var(--cu));height:calc(' + c.h + ' * var(--cu))';   /* --cu = min(1vw,1.6vh): grows with the screen but never into the NEXT pill on a short one */
          return '<div class="jjcab-back" style="' + box + '"><i class="cab-shelf" style="top:44%"></i><i class="cab-shelf" style="top:72%"></i><i class="cab-shelf" style="top:94%"></i><i class="cab-light"></i></div>' +
          '<div class="jjcab-items" style="' + box + '">' + CABINET.mid.map(function (a) { return cabAw(a.src, a.t, a.x, 28, 23); }).join('') +
            (function () { var o = '', B = CABINET.boots, n = B.length, A = CABINET.bootArt || n; B.forEach(function (season, b) { o += cabAw('aw-boot-' + (b % A + 1) + '.webp', CABINET.boot + ' ' + season, n > 1 ? 9 + 82 * b / (n - 1) : 50, 6, n > 5 ? 15.5 : 17.5, (b % 2 ? 1 : -1) * 4, b >= A); }); return o; })() + '</div>' +   /* one per season, evenly along the shelf, inside its ends */
          '<div class="jjcab-doors" role="button" tabindex="0" aria-label="Open the trophy cabinet" data-cursor="hover" style="' + box + '"><i class="l"><b></b></i><i class="r"><b></b></i><span class="cab-hint">Open the cabinet</span></div>' +
          '<button type="button" class="jjdream-again jjrewatch lit" data-cursor="hover" aria-label="Watch the awards dream again" style="left:calc(' + c.cx + '% + ' + (c.w / 2) + ' * var(--cu) + 16px);top:calc(' + cy + ' + ' + (c.h * 0.56).toFixed(2) + ' * var(--cu))">' +   /* the same pill as the Taiwan one, with Joe asleep on top of it (Joe, 2026-09-24) */
          '<span class="rwpk rwsleep"><span class="rwpi"><img class="rwpeek" alt="" src="' + SB + 'ms-peek-sleep.webp"></span></span><span class="rwz"><b>z</b><b>z</b><b>Z</b></span><span class="rwclip"><i></i></span><span class="rwthumb"><img alt="" loading="lazy" src="' + SB + 'dr-stage.webp"><i class="rwplay"></i></span><span class="rwtext"><small>Watch again</small><b>The awards dream</b></span></button>' +   /* right of the cabinet, under the hint, clear of designer Joe */
          '<button type="button" class="jjcab-close" data-cursor="hover" style="left:' + c.cx + '%;top:calc(' + cy + ' + ' + c.h + ' * var(--cu) + 14px)">Close the cabinet</button>'; })(s.cabinet) : '') +
        (s.figma ? '<div class="fgm"><i class="fgm-grid"></i><svg class="fgm-draw" aria-hidden="true"></svg><div class="fgm-texts"></div>' +
          '<div class="fgm-bar"><span class="fb-file" title="Rename"><span class="fb-name" spellcheck="false">Joe’s Journey</span> <b>/ Design life</b></span><i class="fb-sep"></i>' +
            [['move', 'Move', '<path d="M5 3l12 7-5 1.5L9.5 17z"/>'], ['frame', 'Frame', '<path d="M7 3v14M13 3v14M3 7h14M3 13h14" fill="none" stroke-width="1.6"/>'], ['rect', 'Rectangle', '<rect x="4" y="4" width="12" height="12" rx="1.5" fill="none" stroke-width="1.6"/>'], ['pen', 'Pen', '<path d="M4 16l3-1 8-8-2-2-8 8z" fill="none" stroke-width="1.6"/>'], ['text', 'Text', '<path d="M5 5h10M10 5v11" fill="none" stroke-width="1.8"/>']].map(function (t, k) { return '<button type="button" class="fb-t' + (k === 0 ? ' on' : '') + '" data-tool="' + t[0] + '" aria-label="' + t[1] + '" title="' + t[1] + '" data-cursor="hover"><svg viewBox="0 0 20 20" stroke="currentColor" fill="currentColor">' + t[2] + '</svg></button>'; }).join('') +
            '<button type="button" class="fb-t fb-undo" aria-label="Undo" title="Undo" data-cursor="hover"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 5L3.5 8.5 7 12"/><path d="M4 8.5h7.5a4.5 4.5 0 010 9H9"/></svg></button><button type="button" class="fb-clear" data-cursor="hover">Clear canvas</button>' +
            '<i class="fb-sep"></i><span class="fb-avs">' + FG_NAMES.map(function (n, k) { return '<button type="button" class="fb-av' + (k > 4 ? ' xtra' : '') + '" data-k="' + k + '" style="--c:' + FG_COL[k] + '" title="' + n + '" aria-label="Follow ' + n + '" data-cursor="hover">' + n.charAt(0) + '</button>'; }).join('') + '<button type="button" class="fb-av more" aria-label="Show everyone" data-cursor="hover">+' + (FG_NAMES.length - 5) + '</button></span><button type="button" class="fb-share" data-cursor="hover">Share</button></div>' +
          '<div class="fgm-follow"></div>' +
          '<div class="fgm-sticky" data-cursor="drag"><div class="sk-grip" title="Drag me"></div><b class="sk-h">To-do:</b>' +
            '<div class="sk-row done" data-i="0"><button type="button" class="sk-box" aria-label="Tick" data-cursor="hover"></button><span class="sk-t" contenteditable="true" spellcheck="false">Make awesome website</span></div>' +
            '<div class="sk-row" data-i="1"><button type="button" class="sk-box" aria-label="Tick" data-cursor="hover"></button><span class="sk-t" contenteditable="true" spellcheck="false">Drag this post-it</span></div>' +
            '<div class="sk-row" data-i="2"><button type="button" class="sk-box" aria-label="Tick" data-cursor="hover"></button><span class="sk-t" contenteditable="true" spellcheck="false">Edit this text</span></div>' +
            '<div class="sk-row" data-i="3"><button type="button" class="sk-box" aria-label="Tick" data-cursor="hover"></button><span class="sk-t" contenteditable="true" spellcheck="false">Build something on the canvas</span></div>' +
            '<div class="sk-no"></div></div>' +
          '<div class="fgm-btn"><span class="fgm-lab">Button / Primary</span><button type="button" class="fgm-cta" data-cursor="hover">Hire Joe</button><span class="fgm-sw">' + ['#FF00F5', '#6C5CFF', '#18A0FB', '#1BC47D', '#FFC531', '#FF7262'].map(function (c) { return '<i data-c="' + c + '" style="--c:' + c + '" data-cursor="hover" role="button" aria-label="Colour ' + c + '"></i>'; }).join('') + '</span></div>' +
          '<div class="fgm-curs">' + FG_NAMES.map(function (n, k) { return '<span class="fgc" style="--c:' + FG_COL[k] + '"><svg viewBox="0 0 16 18"><path d="M1 1l13 7.5-6 1.2-3.2 5.8z" fill="var(--c)" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/></svg><b>' + n + '</b></span>'; }).join('') + '<span class="fgc me"><b>Joe</b></span></div></div>' : '') +
        (s.flyhome ? '<button type="button" class="ffly ffly2" data-cursor="hover">\ud83e\uddf9 Fly home<small>Catch something from every era</small></button>' : '') +
        (s.rewatch ? '<button type="button" class="jjrewatch" data-cursor="hover" aria-label="Watch the flight to Taiwan again"><span class="rwpk"><span class="rwpi"><img class="rwpeek" alt="" src="' + SB + 'ms-peek-joe.webp"></span></span><span class="rwclip"><i></i></span><span class="rwthumb"><img alt="" loading="lazy" src="' + SB + 'tw-broom-poster.webp"><i class="rwplay"></i></span><span class="rwtext"><small>Watch again</small><b>The flight to Taiwan</b></span></button>' : '') +
        (s.wiz ? '<div class="jjms-wizwrap"><span class="wizcap">Voiced by\u2026</span><video class="jjms-flyer jjms-wiz" muted loop playsinline preload="none" data-base="bb-wizard" poster="' + SB + 'bb-wizard-poster.webp"></video></div>' : '') +
        (s.cinema ? '<div class="jjc-marq"><i class="jjc-bulbs"></i><span class="jjc-ns">Now showing</span><p class="cap">' + cap + '</p><div class="jjc-mt" aria-hidden="true"></div></div>' +   /* the caption IS the letter board's text */
            (s.sub ? '<div class="jjc-strip"><p class="sub">' + disperseCap(s.sub, null, s.funk) + '</p></div>' : '') + '<div class="jjc-wall"></div>' :
          s.atlas ? '<div class="jja-rib"><p class="cap">' + cap + '</p>' + (s.sub ? '<p class="sub jja-sub">' + esc(s.sub) + '</p>' : '') + '</div>' :   /* the map's title, on a parchment ribbon */
        '<p class="cap' + (i === 0 ? ' hero' : '') + '">' + cap + '</p>' +
        (s.sub ? '<p class="sub">' + (s.tall && !s.feat ? esc(s.sub) : disperseCap(s.sub, null, s.funk)) + '</p>' : '')) +
        (s.reveal ? '<button type="button" class="jjms-reveal" data-vid="' + esc(s.reveal.src) + '" data-cap="' + esc(s.reveal.cap) + '" data-cursor="hover" aria-label="Reveal the voice of Storytime">' +
          '<span class="rvshell"><img src="' + SB + esc(s.reveal.poster) + '" alt="" decoding="async"><span class="rvq">?</span></span><span class="rvbtn">Press to reveal</span></button>' : '') +
        (s.tall ? '</div>' : '') + '</div>';   /* sub disperses + floats like the caption */
    }
    /* the Big Bang finale: void + singularity, detonation (flash/shake/shockwaves/90 particles),
       nebula bloom, then the three destination planets are born */
    var parts = '';
    for (var p = 0; p < 90; p++) {
      var ang = p * 137.5 * Math.PI / 180;                      /* golden-angle spread — even but organic */
      var streak = p % 3 === 0;                                 /* every third particle is a debris streak */
      var dist = (streak ? 300 : 190) + (p * 53 % (streak ? 420 : 300));
      var col = p % 3 === 0 ? '#ffffff' : (p % 3 === 1 ? 'rgba(255,255,255,.8)' : 'rgba(225,232,255,.7)');   /* all white now (Joe, 2026-09-24) */
      var w = streak ? 3 : 3 + p * 7 % 6, h = streak ? 16 + p * 11 % 18 : w;
      var rot = streak ? (ang * 180 / Math.PI + 90).toFixed(0) : 0;
      parts += '<span class="' + (streak ? 'streak' : '') + '" style="--tx:' + (Math.cos(ang) * dist).toFixed(0) + 'px;--ty:' + (Math.sin(ang) * dist * 0.7).toFixed(0) +
        'px;--rot:' + (streak ? rot : 0) + 'deg;--dur:' + (streak ? 1.15 + p % 5 * 0.12 : 1.35 + p % 4 * 0.11).toFixed(2) + 's;--del:' + (1.06 + p % 9 * 0.025).toFixed(3) + 's;' +
        'width:' + w + 'px;height:' + h + 'px;background:' + col + '"></span>';
    }
    var dests = '';
    var MB = window.JJ_SCORE_BASE || 'https://cdn.jsdelivr.net/gh/jacksonlaptop/joes-journey-code@main/';   /* the menu's art lives with the score files */
    for (var l = 0; l < LINKS.length; l++)
      dests += '<a href="' + LINKS[l].href + '" class="door" data-key="' + LINKS[l].key + '" data-cursor="hover" style="--hue:' + LINKS[l].hue + '" aria-label="' + LINKS[l].label + '">' +
        '<img alt="" loading="lazy" src="' + MB + LINKS[l].img + '"><span class="dsub">' + LINKS[l].sub + '</span><span class="dcta">' + LINKS[l].cta + '</span>' +
        (LINKS[l].lockSub ? '<span class="dsub lk">' + LINKS[l].lockSub + '</span><span class="dcta lk">' + LINKS[l].lockCta + '</span><span class="dcta lk dstar" role="button">Or 1 \u2b50</span><i class="dlock"></i><span class="dnew">New</span>' : '') + '</a>';
    html += '<div class="finale" id="jjms-finale"><div class="dfield"></div><div class="fwiz"><video class="fwidle" muted loop playsinline preload="none" data-base="bb-wizard" poster="' + SB + 'fwiz-poster.webp"></video><video class="fwwand" muted playsinline preload="none" data-base="wiz-wand"></video></div>' +
      '<button type="button" class="seed" data-cursor="hover" aria-label="Start the universe"><i class="dust">' + (function () { var d = ''; for (var m = 0; m < 46; m++) { var ang = Math.random() * Math.PI * 2, rad = Math.pow(Math.random(), 1.8) * 46; d += '<b style="left:' + (50 + Math.cos(ang) * rad).toFixed(1) + '%;top:' + (50 + Math.sin(ang) * rad * 0.8).toFixed(1) + '%;--s:' + (2 + Math.random() * 5).toFixed(1) + 'px;--d:' + (5 + Math.random() * 7).toFixed(1) + 's;--dl:-' + (Math.random() * 9).toFixed(1) + 's;--o:' + (0.35 + Math.random() * 0.6).toFixed(2) + '"></b>'; } return d; })() + '</i><span>Press to start the universe</span><em class="dcount"></em></button>' +
      '<div class="bang"><div class="void"></div><div class="glowb"></div><div class="flash"></div><div class="core"></div>' +
      '<div class="ring r1 c1"></div><div class="ring r2 c2"></div><div class="ring r3 c3"></div><div class="ring r4 c1"></div><div class="ring r5 c2"></div>' +
      '<div class="parts">' + parts + '</div></div>' +
      '<p class="fcap">' + FINALE_CAP + '</p><div class="dests">' + dests + '</div><button type="button" class="fexam" data-cursor="hover">Take the History Exam again</button><button type="button" class="ffly" data-cursor="hover">\ud83e\uddf9 Fly home<small>Catch something from every era</small></button>' +
      '<div class="fexw"><p class="fqk">Think you paid attention?</p><button type="button" class="fquiz" id="jjms-fquiz" data-cursor="hover" aria-label="Take the History Exam">' +
        '<i class="xglow"></i><i class="xrim"><i></i></i><span class="xorb"></span><i class="xban"></i><i class="xsheen"></i><i class="xtint"></i>' +
        '<span class="xins l" aria-hidden="true"><i style="--i:2">\u16df</i><i style="--i:1">\u16b1</i><i style="--i:0">\u16d7</i></span><span class="xins r" aria-hidden="true"><i style="--i:0">\u16d7</i><i style="--i:1">\u16b1</i><i style="--i:2">\u16df</i></span>' +
        '<span class="xt" aria-hidden="true"><span class="wr">' + 'Take the History Exam'.split('').map(function (ch, i) { return '<i style="--i:' + i + '">' + (ch === ' ' ? '&nbsp;' : ch) + '</i>'; }).join('') + '</span><span class="sh">Take the History Exam</span><b class="qp"></b></span></button></div></div>';
    wrap.innerHTML = html; mount.appendChild(wrap);
    /* If the Webflow page carries the site footer, it sits ABOVE our wrap in the DOM and would be
       buried under the backdrop. Move it below the story so it flows in after the Big Bang links. */
    var wfFooter = document.querySelector('footer, .footer, .footer-wrapper, .footer_component');
    if (wfFooter && !wrap.contains(wfFooter)) {
      wfFooter.style.position = 'relative'; wfFooter.style.zIndex = '2';
      wrap.parentNode.appendChild(wfFooter);
    }
    var finale = document.getElementById('jjms-finale'), banged = false;

    /* ---- the Big Bang plays FULL SCREEN ----
       It used to fire while the finale was only half in view. Now the moment it triggers we glide the
       finale to fill the viewport exactly and hold the scroll there for the length of the sequence, so
       the whole thing is always watched edge to edge. Scroll is released the moment it finishes. */
    var scrollHeld = false, pinY = 0;
    function stopScroll(e) { e.preventDefault(); }
    /* momentum from the glide (and any stray programmatic scroll) would drift it off the exact top, so
       while it's held we snap straight back to the pinned position */
    function repin() { if (scrollHeld && Math.abs(window.scrollY - pinY) > 1) window.scrollTo(0, pinY); }
    var HELD_KEYS = { ArrowUp: 1, ArrowDown: 1, PageUp: 1, PageDown: 1, Home: 1, End: 1, ' ': 1 };
    function stopKeys(e) { if (HELD_KEYS[e.key]) e.preventDefault(); }
    function holdScroll(on) {
      if (on === scrollHeld) return;
      scrollHeld = on;
      var L = window.lenis || window.__lenis;
      if (on) {
        if (L && L.stop) { try { L.stop(); } catch (e) {} }
        jjOn(window, 'wheel', stopScroll, { passive: false });
        jjOn(window, 'touchmove', stopScroll, { passive: false });
        jjOn(window, 'keydown', stopKeys, { passive: false });
        jjOn(window, 'scroll', repin, { passive: true });
      } else {
        if (L && L.start) { try { L.start(); } catch (e) {} }
        jjOff(window, 'wheel', stopScroll, { passive: false });
        jjOff(window, 'touchmove', stopScroll, { passive: false });
        jjOff(window, 'keydown', stopKeys, { passive: false });
        jjOff(window, 'scroll', repin);
      }
    }
    /* the press: the universe starts, the doors arrive, and (first time) the darkness asks its question, then the exam */
    function bangNow() {
      if (finale.classList.contains('go') || finale._collapsing) return;
      finale._collapsing = true; finale.classList.add('pre'); setTimeout(function () { finale.classList.remove('pre'); }, 2600); wizCast(); suckUI(true);
      if (dustCollapse) dustCollapse();
      setTimeout(function () { finale._collapsing = false; bangGo(); }, 900);     /* the wizard raises the wand, the dust and the interface fall in, then it goes */
      setTimeout(function () { suckUI(false); }, 3500); }                          /* the void lifts at T+2.3 of the bang: the interface comes back with the universe */
    /* everything on screen falls into the seed: each piece gets its own vector to the centre */
    var SUCK = '#jjms-hd,#jjms-tl,#jjms-nav,#jjms-next,.nav-container,#jj-sound-btn';
    function suckUI(on) {
      var els = document.querySelectorAll(SUCK), dr = finale.querySelector('.dust').getBoundingClientRect(), cx = dr.left + dr.width / 2, cy = dr.top + dr.height / 2;
      if (on) { document.documentElement.classList.remove('jjms-unsuck'); document.documentElement.classList.add('jjms-suck');
        Array.prototype.forEach.call(els, function (el, i) { var r = el.getBoundingClientRect(); if (!r.width) return; var base = getComputedStyle(el).transform; el._sk = el.style.transform;
          el.style.transform = 'translate(' + (cx - (r.left + r.width / 2)).toFixed(0) + 'px,' + (cy - (r.top + r.height / 2)).toFixed(0) + 'px) rotate(' + (i % 2 ? 24 : -18) + 'deg) scale(.08)' + (base && base !== 'none' ? ' ' + base : ''); }); }
      else { document.documentElement.classList.remove('jjms-suck'); document.documentElement.classList.add('jjms-unsuck');
        Array.prototype.forEach.call(els, function (el) { el.style.transform = el._sk || ''; }); setTimeout(function () { document.documentElement.classList.remove('jjms-unsuck'); }, 1000); } }
    /* the finale's wizard: idle loop once armed, the wand clip on the press */
    var fwiz = finale.querySelector('.fwiz');
    function vidSrc(v) { if (v._src) return; v._src = 1; var b = SB + v.getAttribute('data-base'); v.innerHTML = '' + jjClipSrc(b) + ''; v.load(); }
    function wizArm() { if (!fwiz) return; var idle = fwiz.querySelector('.fwidle'); vidSrc(idle); idle.addEventListener('playing', function () { fwiz.classList.add('live'); }, { once: true }); idle.addEventListener('timeupdate', function () { if (idle.currentTime > 8.4 || idle.currentTime < 0.9) { try { idle.currentTime = 1.0; } catch (x) {} } });   /* the clip's opening swirl and its fly-off are skipped: he is on screen the whole loop */ var pp = idle.play(); if (pp && pp.catch) pp.catch(function () {}); vidSrc(fwiz.querySelector('.fwwand')); setTimeout(function () { fwiz.classList.add('here'); }, 1900); }
    jjOn(document, 'visibilitychange', function () { if (!document.hidden && fwiz && finale.classList.contains('armed')) { var idle = fwiz.querySelector('.fwidle'); if (idle._src && idle.paused) { var pp = idle.play(); if (pp && pp.catch) pp.catch(function () {}); } } });   /* armed while the tab was hidden: the loop starts when it shows */
    function wizCast() { if (!fwiz) return; var w = fwiz.querySelector('.fwwand'); vidSrc(w); w.currentTime = 0; var went = function () { if (w.currentTime > 0.04) w.classList.add('on'); }; w.addEventListener('timeupdate', went); w.onended = function () { w.classList.remove('on'); w.removeEventListener('timeupdate', went); }; var pp = w.play(); if (pp && pp.catch) pp.catch(function () {}); }
    function bangGo() {
      if (finale.classList.contains('go')) return;
      finale.classList.add('go'); try { sessionStorage.setItem('jjmsBanged', '1'); } catch (x) {} pinY = window.scrollY; holdScroll(true); setTimeout(function () { holdScroll(false); }, 4200);
      setTimeout(function () { pinY = finale.getBoundingClientRect().top + window.scrollY; window.scrollTo(0, pinY); }, 1500);   /* under the black of the void the page lines up on the finale, so the doors arrive in view */
      setTimeout(function () { if (window.jjScore) { window.jjScore.award('big-bangs', { part: 'story' }); window.jjScore.award('stardust', { part: 'story' }); } }, 3300);
      if (teasePlayed) setTimeout(function () { window.jjSay && window.jjSay('where-to-next', { wait: true }); }, 3200);   /* later bangs: the doors are up */
      if (!teasePlayed) { teasePlayed = true; if (calmQ) setTimeout(function () { openQuiz(); }, 2400); else setTimeout(runTease, 2300); }
      setTimeout(function () { bg.classList.add('boom'); }, 1000);    /* the sky surges at detonation */
      setTimeout(function () { bg.classList.remove('boom'); }, 2400);
    }
    var seedBtn = finale.querySelector('.seed'); if (seedBtn) seedBtn.addEventListener('click', function (e) { e.stopPropagation(); bangNow(); });
    /* ---- dust gathering: the finale is strewn with specks; the cursor is gravity. Pull them in, carry them to the seed and it keeps them
       (they settle into orbit); press and everything left rushes in before the bang. All of them = the Stardust achievement. */
    var dustCollapse = null;
    (function () {
      var field = finale.querySelector('.dfield'), dustEl = finale.querySelector('.dust'), countEl = finale.querySelector('.dcount'); if (!field || !dustEl) return;
      var N = 110, M = [], W = 0, H = 0, cx = 0, cy = 0, cur = { x: -1e5, y: -1e5 }, held = 0, raf = 0, on = false, mode = 0, tick = 0, full = false;
      var html = ''; for (var i = 0; i < N; i++) html += '<b style="--s:' + (2 + Math.random() * 3.5).toFixed(1) + 'px;--o:' + (0.35 + Math.random() * 0.55).toFixed(2) + '"></b>'; field.innerHTML = html;
      var els = field.children; for (var j = 0; j < N; j++) M.push({ el: els[j], x: 0, y: 0, hx: 0, hy: 0, vx: 0, vy: 0, st: 0, a: 0, r: 0, w: 0, ph: Math.random() * 6.28 });
      function measure() { var fr = finale.getBoundingClientRect(), dr = dustEl.getBoundingClientRect(); W = fr.width; H = fr.height; cx = dr.left - fr.left + dr.width / 2; cy = dr.top - fr.top + dr.height / 2; }
      function seedAll() { measure(); M.forEach(function (m) { var ok = false, x, y; while (!ok) { x = Math.random() * W; y = Math.random() * H * 0.9; ok = Math.hypot(x - cx, y - cy) > Math.max(230, Math.min(W, H) * 0.24); }   /* nothing starts inside the seed's own pull: the count begins at zero */ m.hx = m.x = x; m.hy = m.y = y; m.vx = m.vy = 0; m.st = 0; m.el.className = ''; }); held = 0; full = false; countEl.textContent = ''; seedBtn.classList.remove('gath'); }
      function place(m) { m.el.style.transform = 'translate(' + m.x.toFixed(1) + 'px,' + m.y.toFixed(1) + 'px)'; }
      function capture(m) { m.st = 1; m.a = Math.atan2(m.y - cy, m.x - cx); m.r = 6 + Math.pow(Math.random(), 0.7) * 44; m.w = (0.004 + Math.random() * 0.007) * (Math.random() < 0.5 ? -1 : 1); m.el.className = 'held'; held++;
        seedBtn.classList.add('gath'); countEl.textContent = held + ' / ' + N + ' specks gathered';
        if (held >= N && !full) { full = true; countEl.textContent = 'Every speck. Press to start the universe'; if (window.jjScore) window.jjScore.award('stardust', { part: 'story' }); } }
      var R = 340;
      var lastT = 0;
      function frame(now) { raf = 0; if (!on) return; if (now - lastT < 14) { raf = requestAnimationFrame(frame); return; } lastT = now; tick++;   /* one physics step per ~60Hz frame, whatever the display refresh */
        if (tick % 20 === 0) measure();
        var R2 = R * R;
        for (var i = 0; i < N; i++) { var m = M[i];
          if (mode === 2) { m.x += (cx - m.x) * 0.22; m.y += (cy - m.y) * 0.22; place(m); continue; }   /* the collapse */
          if (m.st === 1) { m.a += m.w; var rr = m.r * (1 + Math.sin(tick * 0.03 + m.ph) * 0.08); m.x = cx + Math.cos(m.a) * rr; m.y = cy + Math.sin(m.a) * rr * 0.8; place(m); continue; }
          var dx = cur.x - m.x, dy = cur.y - m.y, d2 = dx * dx + dy * dy, ax = (m.hx - m.x) * 0.0012 + Math.sin(tick * 0.02 + m.ph) * 0.012, ay = (m.hy - m.y) * 0.0012 + Math.cos(tick * 0.017 + m.ph) * 0.012;
          if (d2 < R2) { var dd = Math.sqrt(d2) || 1, gf = (1 - dd / R) * 1.5; ax += dx / dd * gf; ay += dy / dd * gf; }   /* the cursor is gravity: specks drift after it */
          m.vx = (m.vx + ax) * 0.86; m.vy = (m.vy + ay) * 0.86; m.x += m.vx; m.y += m.vy;
          if ((m.x - cx) * (m.x - cx) + (m.y - cy) * (m.y - cy) < 6400) capture(m);   /* carried to the seed, it keeps them (catching is back, Joe 2026-09-24; the press still pulls whatever is left in on the black screen) */
          place(m); }
        if (fwiz && tick % 30 === 0) { var iv = fwiz.querySelector('.fwidle'); if (iv && iv._src && iv.paused && !fwiz.querySelector('.fwwand.on')) { var ip = iv.play(); if (ip && ip.catch) ip.catch(function () {}); } }
        if (fwiz && tick % 3 === 0) { var far = cur.x < -1e4, wx = far ? 0 : (cur.x / W - 0.5) * W * 0.06, wy = far ? 0 : (cur.y / H - 0.5) * H * 0.05; fwiz.style.setProperty('--wx', wx.toFixed(0) + 'px'); fwiz.style.setProperty('--wy', wy.toFixed(0) + 'px'); }   /* he leans with the cursor, anchored bottom-left */
        raf = requestAnimationFrame(frame); }
      function start() { if (on) return; on = true; seedAll(); if (!raf) raf = requestAnimationFrame(frame); }
      function stop() { on = false; }
      finale.addEventListener('pointermove', function (e) { var fr = finale.getBoundingClientRect(); cur.x = e.clientX - fr.left; cur.y = e.clientY - fr.top; });
      finale.addEventListener('pointerleave', function () { cur.x = -1e5; cur.y = -1e5; });
      jjOn(window, 'resize', function () { if (on) seedAll(); });
      new MutationObserver(function () { var armed = finale.classList.contains('armed'), go = finale.classList.contains('go'); document.documentElement.classList.toggle('jjms-fin', armed); if (armed && !go) { if (mode === 2) return; start(); } else if (!armed) { stop(); mode = 0; } }).observe(finale, { attributes: true, attributeFilter: ['class'] });
      jjOn(document, 'visibilitychange', function () { if (document.hidden) { on = false; } else if (finale.classList.contains('armed') && !finale.classList.contains('go')) { on = true; if (!raf) raf = requestAnimationFrame(frame); } });
      dustCollapse = function () { mode = 2; setTimeout(function () { stop(); mode = 0; }, 900); };
    })();
    function snapToFinale() {
      var top = finale.getBoundingClientRect().top + window.scrollY;    /* finale is exactly 100vh */
      var L = window.lenis || window.__lenis;
      if (L && typeof L.scrollTo === 'function') { try { L.scrollTo(top, { duration: 0.6 }); } catch (e) {} }
      else window.scrollTo({ top: top, behavior: 'smooth' });
      setTimeout(function () {                                          /* let the glide land, then pin it */
        pinY = finale.getBoundingClientRect().top + window.scrollY;     /* the exact edge-to-edge position */
        holdScroll(true);
        window.scrollTo(0, pinY);
        if (snapToFinale._onPinned) { snapToFinale._onPinned(); snapToFinale._onPinned = null; }
      }, 620);
      setTimeout(function () { holdScroll(false); }, 620 + 900);        /* a moment pinned, then the visitor is free again: the show waits for the seed */
    }

    /* galaxies turn slowly forever (CSS on the inner img); on top of that each one, on its own random
       schedule, snaps into a quick 2–3 rotation burst (the wrapper's `rotate`, eased by a transition) */
    Array.prototype.forEach.call(wrap.querySelectorAll('.gspiral'), function (sp) {
      var rot = 0;
      function burst() {
        if (!sp.isConnected) return;
        rot += 360 * (2 + Math.floor(Math.random() * 2));       /* 2–3 quick spins */
        sp.style.rotate = rot + 'deg';
        setTimeout(burst, 3000 + Math.random() * 10000);        /* ~2× more often: random 3–13s */
      }
      setTimeout(burst, 2000 + Math.random() * 7000);           /* random first burst */
    });

    /* the parallax star layers, translated in render() at their own speeds */
    var slayers = Array.prototype.slice.call(wrap.querySelectorAll('.slayer'));

    /* ---- the era mascot: one per era, flies around BEHIND the story; a NEW era flies the old one
       off then flies the new one in; click it and it also flies off + restarts ---- */
    var fly = document.createElement('div'); fly.id = 'jjms-fly';
    fly.innerHTML = '<img alt="">'; wrap.appendChild(fly);        /* inside #jjms so it sits behind the text/photos */
    var flyImg = fly.querySelector('img'), flyEra = -1, flyResetT = null;
    function flyStartWander() {                                  /* (re)enter: a quick pop back onto the bar */
      fly.style.opacity = ''; fly.style.transition = ''; fly.classList.add('swap'); setTimeout(function () { fly.classList.remove('swap'); }, 60);
    }
    function flyEnter() {                                        /* swap to the current era\'s sprite + fly in */
      flyImg.src = SB + 'era-fly-' + flyEra + '.png'; flyStartWander(); fly.classList.add('show');
    }
    function flyOff(cb) {                                        /* pin where it is, fling it off-screen, then cb */
      var cur = getComputedStyle(fly).transform;
      fly.style.animation = 'none'; fly.style.transform = cur; void fly.offsetWidth;
      fly.style.transition = 'transform .85s cubic-bezier(.5,0,.75,0),opacity .85s ease';
      fly.style.transform = 'translate(118vw,-45vh) rotate(50deg) scale(.6)'; fly.style.opacity = '0';
      clearTimeout(flyResetT); flyResetT = setTimeout(cb, 900);
    }
    function flyShow(era) {
      if (era === flyEra) { fly.classList.add('show'); return; }
      var first = flyEra < 0; flyEra = era;
      if (first) flyEnter(); else { fly.classList.add('swap'); setTimeout(function () { flyImg.src = SB + 'era-fly-' + flyEra + '.png'; fly.classList.remove('swap'); }, 230); }   /* new era: shrink, swap on the dash, pop back */
      fly.classList.add('show');
    }
    /* where he stands: on the nav bar, across the current era's word in step with the era's own scroll */
    function flyPlace(era, idx) { var navEl = document.querySelector('#jjms-nav a[data-era="' + era + '"]'); if (!navEl) return;
      var a0 = firstStepOfEra[era], z0 = a0; while (z0 + 1 < STEPS.length && STEPS[z0 + 1].era === era) z0++;
      var top0 = steps[a0].getBoundingClientRect().top, bot0 = steps[z0].getBoundingClientRect().bottom, pe = Math.max(0, Math.min(1, (window.innerHeight / 2 - top0) / Math.max(1, bot0 - top0)));
      var r = navEl.getBoundingClientRect(), fw = fly.offsetWidth || 44, x = r.left + 10 + (r.width - 20 - fw) * pe, y = r.top - fw + 10;
      fly.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)'; }
    flyImg.addEventListener('click', function () { flyOff(flyEnter); });   /* fly off, then the same era flies back */

    /* left ruler: fine ticks (4/year) + year labels. The ticks run PAST both ends (blank, unlabelled)
       so the ruler is always full screen — the years only ever read 1995 … 2026. */
    var tl = document.createElement('div'); tl.id = 'jjms-tl';
    var rl = '';
    var PAD_Y = 18;                                              /* enough blank years to cover any viewport */
    var evTops = EVENTS.map(function (E) { return (E.y - Y0) * PX_PER_YEAR; });
    for (var y = Y0 - PAD_Y; y <= Y1 + PAD_Y; y++) {
      var top = (y - Y0) * PX_PER_YEAR;
      rl += '<div class="tk maj" style="top:' + top + 'px"></div>';
      for (var q = 1; q < 4; q++) rl += '<div class="tk" style="top:' + (top + q * PX_PER_YEAR / 4) + 'px"></div>';
      if (y < Y0 || y > Y1) continue;                            /* past the ends: ticks only, no number */
      var lt = top;                                              /* dodge event labels so they never overlap */
      for (var e2 = 0; e2 < evTops.length; e2++) if (Math.abs(lt - evTops[e2]) < 20) lt = evTops[e2] + 22;
      rl += '<div class="yl" data-y="' + y + '" style="top:' + lt + 'px">' + y + '</div>';
    }
    for (var ev = 0; ev < EVENTS.length; ev++)
      rl += '<div class="ev" style="top:' + ((EVENTS[ev].y - Y0) * PX_PER_YEAR).toFixed(1) + 'px">' + EVENTS[ev].label + '</div>';
    /* the jobs, each pinned just BELOW its own year label so the year above reads as its start date */
    var PIN = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" stroke="currentColor" stroke-width="2"/>' +
      '<circle cx="12" cy="10" r="2.6" stroke="currentColor" stroke-width="2"/></svg>';
    for (var jb = 0; SHOW_JOBS && jb < JOBS.length; jb++) {
      var J = JOBS[jb];
      var ini = J.co.replace(/\(.*?\)/g, '').trim().split(/\s+/).slice(0, 2)
        .map(function (w) { return w.charAt(0); }).join('').toUpperCase();   /* monogram until the logo lands */
      rl += '<div class="job" data-y="' + J.y + '" style="top:' + ((J.y - Y0) * PX_PER_YEAR + 16).toFixed(1) + 'px">' +
        '<span class="jlogo"><i>' + esc(ini) + '</i>' + (J.logo ? '<img src="' + SB + J.logo + '" alt="">' : '') + '</span>' +
        '<span class="jtx"><span class="jco">' + esc(J.co) + '</span>' +
        '<span class="jloc">' + PIN + esc(J.loc) + '</span>' +
        '<span class="jrole">' + esc(J.role) + '</span></span></div>';
    }
    tl.innerHTML = '<div class="ruler">' + rl + '</div>';
    /* a logo that isn't uploaded yet simply falls away, leaving the monogram tile */
    Array.prototype.forEach.call(tl.querySelectorAll('.jlogo img'), function (im) {
      im.addEventListener('error', function () { im.remove(); });
    });
    document.body.appendChild(tl);

    /* era header / next / nav */
    var hd = document.createElement('div'); hd.id = 'jjms-hd'; document.body.appendChild(hd);
    function placeHd(){                                          /* the era title sits ON the nav's line: just right of the J badge (whatever its theme's size), its two lines centred on the Menu's centre */
      var lg = document.querySelector('.nav-logo-link'), mc = document.querySelector('.menu-container'); if (!lg) return;
      var lr = lg.getBoundingClientRect(), mr = (mc || lg).getBoundingClientRect(); if (!lr.width) return;
      var t = hd.querySelector('.hin .t'), a = hd.querySelector('.hin .a'), th = (t ? t.offsetHeight : 28) + (a ? a.offsetHeight + 3 : 18);
      var hp = document.getElementById('jj-sc-hud'), hpr = hp && hp.getBoundingClientRect(); if (hpr && hpr.width) { var mw = Math.max(120, Math.round(hpr.left - lr.right - 30)); hd.style.minWidth = '0'; if (t) { t.style.maxWidth = mw + 'px'; t.style.whiteSpace = 'nowrap'; t.style.overflow = 'hidden'; t.style.textOverflow = 'ellipsis'; } }   /* never runs under the pills */
      hd.style.left = Math.round(lr.right + 16) + 'px'; hd.style.top = Math.round(mr.top + mr.height / 2 - th / 2) + 'px'; }
    placeHd(); setInterval(placeHd, 900); jjOn(window, 'resize', placeHd);
    (function regFollow(){ if (window.jjCompanion && window.jjCompanion.follow) window.jjCompanion.follow('mystory', function () { if (document.getElementById('jjst')) return null; return hd.querySelector('.hin .ic img.act'); }); else setTimeout(regFollow, 600); })();   // the companion keeps to the era's active sprite
    var nx = document.createElement('button'); nx.id = 'jjms-next'; nx.innerHTML = '<span>NEXT</span><span class="ar">↓</span>'; nx.setAttribute('data-jj', 'btn'); nx.setAttribute('data-cursor', 'hover'); document.body.appendChild(nx);
    var ghostPv = document.createElement('button'), ghostNx = document.createElement('button'); ghostPv.className = 'jjms-eraghost pv'; ghostNx.className = 'jjms-eraghost nx';
    [ghostPv, ghostNx].forEach(function (g) { g.type = 'button'; g.setAttribute('data-cursor', 'hover'); document.body.appendChild(g); g.addEventListener('click', function (e) { e.stopPropagation(); var e2 = +g.getAttribute('data-era'); if (isNaN(e2)) return; steps[firstStepOfEra[e2]].scrollIntoView({ behavior: 'smooth' }); }); });
    function dressNext(era, on) { nx.setAttribute('data-era', era); nx.removeAttribute('data-jj');   /* the button wears its era; the neighbours peek out behind */
      [[ghostPv, era - 1], [ghostNx, era + 1]].forEach(function (pair) { var g = pair[0], e2 = pair[1], ok = on && e2 >= 0 && e2 < ERAS.length; g.classList.toggle('on', ok); if (ok) { g.setAttribute('data-era', e2); g.textContent = ERAS[e2].nav; } }); }
    var nav = document.createElement('div'); nav.id = 'jjms-nav';
    var nh = '';
    for (var e = 0; e < ERAS.length; e++) {
      if (e) nh += '<span class="dash">–</span>';
      nh += '<a href="#" data-era="' + e + '">' + ERAS[e].nav + '</a>';
    }
    nav.innerHTML = nh; document.body.appendChild(nav);

    var ruler = tl.querySelector('.ruler');
    var ylEls = Array.prototype.slice.call(tl.querySelectorAll('.yl'));
    var jobEls = Array.prototype.slice.call(tl.querySelectorAll('.job'));
    var navEls = Array.prototype.slice.call(nav.querySelectorAll('a'));
    var steps = Array.prototype.slice.call(wrap.querySelectorAll('.step'));
    /* PHOTOS LOAD BY ERA: everything past the first era waits (src parked in data-lsrc) until the visitor comes within two screens of
       that era; then the whole era, and the next one, load together, so nothing pops in mid-slide and nobody downloads the future up front. */
    (function () {
      var parked = {}, started = {};
      steps.forEach(function (st) { var era = +st.getAttribute('data-era') || 0; if (era === 0) return;
        [].slice.call(st.querySelectorAll('img[src]')).forEach(function (im) { if (im.closest('.jjrewatch')) return; (parked[era] = parked[era] || []).push(im); im.setAttribute('data-lsrc', im.getAttribute('src')); im.removeAttribute('src'); }); });
      function loadEra(e) { if (started[e]) return; started[e] = 1; (parked[e] || []).forEach(function (im) { var u = im.getAttribute('data-lsrc'); if (u) { im.setAttribute('src', u); im.removeAttribute('data-lsrc'); } }); }
      if (!('IntersectionObserver' in window)) { Object.keys(parked).forEach(function (e) { loadEra(+e); }); return; }
      var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (!en.isIntersecting) return; var e = +en.target.getAttribute('data-era') || 0; loadEra(e); loadEra(e + 1); }); }, { rootMargin: '200% 0px 200% 0px' });
      steps.forEach(function (st) { io.observe(st); });
      jjOn(window, 'jjms:jump', function (ev) { var e = ev && ev.detail && ev.detail.era; if (e != null) { loadEra(e); loadEra(e + 1); } });
    })();

    /* =====================================================================================================
       MY STORY V2 — ERA WORLDS (2026-09-17). The default since 2026-09-22; `/storytime?ms=1#my-story` opens the old one.
       Same slides, same data: only the WORLD behind them changes. Each era is its own place — sea, savannah, a
       Mediterranean road, the Storytime village, a studio — and space is kept for the Information Age, so the Big Bang is
       a payoff. The star field / nebulae / swirl are hidden until then (also the biggest perf saving on the page).
       Every world is three layers on the era's scroll: .wsky (a tall gradient that travels), .wfar, .wnear (silhouettes).
       Until Joe's painted plates exist the layers are drawn in CSS / inline SVG; drop `era-<n>-far.webp`, `-mid.webp`,
       `-near.webp` (n = 0..4) in the repo and they replace the placeholders on their own (tried once, ignored if missing).
       The era's sprite WALKS the bottom edge, and only while the page is moving (rule 30); the floating mascot is retired
       here (the visitor's own companion already floats). Era changes are a rising wipe, never a gate. ===================== */
    var V2 = !/[?&]ms=1\b/.test(location.search) && window.JJ_MS_V2 !== false;   /* V2 is the My Story now (Joe, 2026-09-22); `?ms=1` still opens the old one, archived at archive/mystory-v1-default-2026-09-22.js */
    if (V2) (function () {
      document.documentElement.classList.add('jjms-v2');
      var W = [   /* [sky gradient (deep → light, bottom → top of the era's journey), far colour, near colour, far path, near path]  paths live in a 1000x300 box, filled to the bottom */
        ['linear-gradient(0deg,#021018 0%,#04283a 35%,#0b4f6b 70%,#2f8fa8 100%)', '#06324a', '#031c2b', 'M0 210 Q120 150 250 200 T500 190 T760 205 T1000 180 V300 H0Z', 'M0 250 Q90 215 200 245 T420 240 T700 255 T1000 235 V300 H0Z'],
        ['linear-gradient(0deg,#1a0f0a 0%,#3b2116 40%,#8a4a22 78%,#d9904a 100%)', '#4a2a18', '#21120b', 'M0 200 L90 150 L210 150 L260 195 L420 195 L470 130 L640 130 L700 200 L1000 190 V300 H0Z', 'M0 255 Q60 225 120 250 Q180 215 260 250 Q340 225 430 252 Q540 222 650 250 Q760 228 870 252 Q940 236 1000 248 V300 H0Z'],
        ['linear-gradient(0deg,#0b2236 0%,#123a5c 45%,#3f6f95 75%,#e0a36a 100%)', '#1d4a66', '#0c2438', 'M0 215 Q200 170 380 205 T760 190 T1000 205 V300 H0Z', 'M40 300 V170 H70 V300 Z M110 300 V150 H140 V300 Z M180 300 V170 H210 V300 Z M30 170 H220 V155 H30 Z M760 300 V185 H788 V300 Z M830 300 V165 H858 V300 Z M900 300 V185 H928 V300 Z M750 185 H940 V172 H750 Z M0 270 H1000 V300 H0 Z'],
        ['linear-gradient(0deg,#0a1a18 0%,#10233a 40%,#1f4a3a 78%,#5d8a5a 100%)', '#17382e', '#0a1c18', 'M0 220 Q160 160 330 210 T680 195 T1000 215 V300 H0Z M700 215 V150 H712 V138 H724 V150 H736 V138 H748 V150 H760 V138 H772 V150 H784 V215 Z M728 150 V100 L740 84 L752 100 V150 Z', 'M0 262 Q130 232 270 258 T560 250 T820 262 T1000 246 V300 H0Z'],
        ['linear-gradient(0deg,#160d08 0%,#2a1a12 40%,#6b3f22 80%,#c99a5b 100%)', '#3a2214', '#1a0f09', 'M0 300 V120 Q125 20 250 120 V300 Z M375 300 V120 Q500 20 625 120 V300 Z M750 300 V120 Q875 20 1000 120 V300 Z', 'M0 268 H1000 V300 H0 Z M120 268 V205 H150 V268 Z M100 205 H170 V196 H100 Z M820 268 V190 H850 V268 Z M800 190 H870 V181 H800 Z'],
        ['none', 'none', 'none', '', '']
      ];
      /* NIGHT (Joe, 2026-09-17): one dark-blue sky all the way down — the site's own swirl and stars — so the page matches the rest of
         the site. Only the sea keeps its own water. From the shore on, each era is a moonlit strip of land along the bottom (the
         '-n' files are the same paintings graded to night, lit windows and fires left warm) with a faint horizon glow in the era's
         own colour. Eras no longer wipe: the old land sinks away and the new land rises, each layer at its own speed. */
      var GLOW = [null, 'rgba(214,120,50,.34)', 'rgba(226,150,110,.30)', 'rgba(90,170,120,.26)', 'rgba(214,170,90,.30)', 'rgba(80,160,220,.22)'], DOWN = { 4: -5 };   /* DOWN: vw to sink (or, negative, lift) an era's strip. The Renaissance city was too low to read */
      var world = document.createElement('div'); world.id = 'jjms-world';
      var svgBg = function (d, fill) { return 'url("data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1000 300\' preserveAspectRatio=\'none\'><path d=\'' + d + '\' fill=\'' + fill + '\'/></svg>') + '")'; };
      for (var w = 0; w < W.length; w++) world.innerHTML += '<div class="wera" data-era="' + w + '"><div class="wsky' + (w ? ' glow' : '') + '" style="background:' + (w ? 'linear-gradient(0deg,' + GLOW[w] + ' 0%,rgba(0,0,0,0) 100%)' : W[w][0]) + '"></div><div class="wlay wfar" style="background-image:' + svgBg(W[w][3], W[w][1]) + '"></div><div class="wlay wmid"></div><div class="wlay wnear" style="background-image:' + svgBg(W[w][4], W[w][2]) + '"></div>' + (w === 0 ? '<div class="wbub"></div>' : '') + '<div class="wshade"></div></div>';
      /* loose props per era: [file, class, left, top|bottom, width, extra style].  edge: the handover art. */
      var PROPS = { 0: [   /* no jellyfish (Joe, 2026-09-30); the octopus clip is coming */ ['era-0-fish-strip', 'swim', 'left:0;top:19%', '6.5vw', '--pd:44s;--ar:1.73;--sd:.55s'], ['era-0-fish-strip', 'swim', 'left:0;top:36%', '4vw', '--pd:61s;--ar:1.73;--sd:.6s;animation-delay:-30s;filter:brightness(.8)']],
                    5: [['era-5-prop-1', 'bob', 'left:12%;top:22%', '7vw', '--pd:11s'], ['score-jupiter', 'bob pj', 'left:85.5%;top:9%', '6.8vw', '--pd:15s'], ['score-mars', 'bob pm', 'left:91%;top:37%', '3vw', '--pd:11s;animation-delay:-4s'], ['era-5-prop-3', 'bob', 'left:70%;top:62%', '4vw', '--pd:8s'],
                        ['era-5-car-1-strip', 'swim', 'left:0;top:44%', '6vw', '--pd:26s;--ar:3.29;--sd:.5s'], ['era-5-car-2-strip', 'swim', 'left:0;top:39%', '5vw', '--pd:34s;--ar:5.792;--sd:.6s;animation-delay:-14s'], ['era-5-car-3-strip', 'swim', 'left:0;top:52%', '4.5vw', '--pd:41s;--ar:3.025;--sd:.55s;animation-delay:-27s'],
                        ['era-5-plane-1-strip', 'swim', 'left:0;top:14%', '8vw', '--pd:48s;--ar:3.085;--sd:.7s;animation-delay:-9s'], ['era-5-plane-2-strip', 'swim', 'left:0;top:24%', '6vw', '--pd:60s;--ar:6.14;--sd:.8s;animation-delay:-38s']],
                    2: [['era-2-prop-1', 'sail', 'left:0;bottom:12.6vw', '3.2vw', '--pd:64s'], ['era-2-prop-1', 'sail', 'left:0;bottom:13.4vw', '2.2vw', '--pd:88s;animation-delay:-60s;filter:brightness(.85)'], ['era-2-prop-1', 'sail', 'left:0;bottom:12.2vw', '2.8vw', '--pd:72s;animation-delay:-24s'], ['era-2-prop-1', 'sail', 'left:0;bottom:13.9vw', '1.8vw', '--pd:100s;animation-delay:-80s;filter:brightness(.8)'], ['era-2-prop-1', 'sail', 'left:0;bottom:12.9vw', '3vw', '--pd:58s;animation-delay:-40s'], ['era-2-prop-1', 'sail', 'left:0;bottom:13.6vw', '2.4vw', '--pd:80s;animation-delay:-12s;filter:brightness(.9)'], ['era-2-prop-1', 'sail', 'left:0;bottom:12.4vw', '3.4vw', '--pd:70s;animation-delay:-52s'], ['era-2-prop-1', 'sail', 'left:0;bottom:12.1vw', '3.8vw', '--pd:135s;animation-delay:-105s'], ['era-2-birds-strip', 'swim', 'left:0;top:14%', '6.5vw', '--pd:48s;--ar:1.121;--sd:.5s'], ['era-2-prop-3', '', 'left:63%;bottom:10vh', '3.6vw', '']],
                    3: [['era-3-banner-strip', 'banner', 'left:5.5%;top:13%', '4.8vw', '--ar:.83'], ['era-3a-birds-strip', 'swim sa', 'left:0;top:20%', '6.5vw', '--pd:60s;--ar:1.093;--sd:.5s'], ['era-3a-signpost', 'sa', 'left:3%;bottom:8.5vw', '4vw', ''], ['era-3b-signpost', 'sb', 'left:3%;bottom:8.5vw', '4vw', '']],
                    4: [['era-4-fountain-strip', '', 'left:47.6%;bottom:6.6vw', '4.8vw', '--ar:.889;--sd:.7s'], ['era-4-birds-strip', 'swim', 'left:0;top:26%', '5.5vw', '--pd:38s;--ar:1.299;--sd:.45s'], ['era-4-frame-n', 'sway', 'left:92.5%;bottom:12.5vw', '3.2vw', '--pd:7s']],
                    1: [['era-1-birds-strip', 'swim', 'left:0;top:14%', '8vw', '--pd:52s;--ar:1.193;--sd:.6s'], ['era-1-prop-3', 'cavepaint', 'left:74%;top:17%', '13vw', 'opacity:0;transition:opacity .8s ease']] };
      Object.keys(PROPS).forEach(function (n) { var E = world.querySelector('.wera[data-era="' + n + '"]'), sh = E.querySelector('.wshade');
        PROPS[n].forEach(function (P) { var d = document.createElement('div'); d.className = 'wprop ' + P[1]; d.style.cssText = P[2] + ';width:' + P[3] + ';' + P[4]; var isStrip = /-strip$/.test(P[0]), nm = P[0] + (!isStrip && !/-n$/.test(P[0]) && !/^era-3[ab]-/.test(P[0]) && +n >= 1 && +n <= 4 ? '-n' : '');   /* the round-3 files are night already */
          d.innerHTML = /banner/.test(P[1]) ? '<i class="bnr"><i class="rod" style="background-image:url(' + SB + nm + '.webp)"></i><i class="cloth"><i class="clr" style="background-image:url(' + SB + nm + '.webp)"></i></i></i>' :   /* the J banner: its rod stays put and the cloth hangs from it (see .wprop.banner) */
            isStrip ? '<i class="strip" style="background-image:url(' + SB + nm + '.webp)"></i>' : '<img alt="" src="' + SB + nm + '.webp">'; E.insertBefore(d, P[1] === 'sail' ? E.querySelector('.wmid') : sh); }); });   /* -strip: three frames side by side, stepped */   /* the galley sits BEHIND the land, on the sea */
      /* the rocket: parked on the pad, it lifts off as the Information Age scrolls by. Rule 30: the flame is its legs, so it burns only while it climbs. */
      var rk = document.createElement('div'); rk.className = 'wrocket'; rk.innerHTML = '<img alt="" src="' + SB + 'era-5-rocket.webp"><i class="flame" style="background-image:url(' + SB + 'era-5-flame-strip.webp)"></i>';
      world.querySelector('.wera[data-era="5"] .wmid').appendChild(rk);
      /* JOE'S ROCKET AND THE UFO (Joe, 2026-09-30: "rocket flies with flames", "spaceship ufo floats, maybe with small flames"). Both are his
         cut-outs (era-5-rocket-joe, era-5-ufo-alien) in the Information Age sky, in front of the far city and behind the near one.
         THE ROCKET waits out of sight, then every so often rises up the left of the sky on a gentle S-curve (clear of the Figma window, the
         words and the phones, and well away from the painted white rocket on its pad on the right), leaning along its path, a flickering toon
         flame under it (three feathered teardrops, gold / orange / pink, stretching with speed) and puffs left behind. Press it and it boosts.
         THE UFO hovers and drifts slowly in the space on the right below Mars, bobbing and rocking, three little thruster flames under its
         legs. Press it and it wobbles and chirps (the orb shimmer). Transforms / opacity only; the loop runs only while the era is on screen;
         phones and reduced motion get both parked, with a gentle CSS bob. Upright screens: the words fill the sky, so the UFO stays away. */
      var sky5 = null;
      (function () { var E5 = world.querySelector('.wera[data-era="5"]'), near = E5.querySelector('.wnear'), STILL = !!(window.matchMedia && (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(hover: none) and (pointer: coarse)').matches));
        var FL = '<i class="fla"><i class="f1"></i><i class="f2"></i><i class="f3"></i></i>';
        var rj = document.createElement('div'); rj.className = 'wrj' + (STILL ? ' still' : ''); rj.innerHTML = '<i class="rjfl">' + FL + '</i><img alt="" src="' + SB + 'era-5-rocket-joe.webp">';
        var uf = document.createElement('div'); uf.className = 'wufo' + (STILL ? ' still' : ''); uf.innerHTML = '<i class="ufin"><i class="uth" style="left:22%;top:83%"></i><i class="uth" style="left:48%;top:95%"></i><i class="uth" style="left:76%;top:97%"></i><img alt="" src="' + SB + 'era-5-ufo-alien.webp"></i>';
        E5.insertBefore(rj, near); E5.insertBefore(uf, near);
        var puffs = []; if (!STILL) for (var q = 0; q < 10; q++) { var pf = document.createElement('i'); pf.className = 'rjpuff'; E5.insertBefore(pf, near); puffs.push(pf); }
        sky5 = { rocket: rj, ufo: uf, flying: function () { return rj._fly > 0; } };
        var W = 1, H = 1, RW = 60, RH = 80, UW = 80, raf = 0, on = false, last = 0, t0 = performance.now(), portrait = false;
        function size() { W = window.innerWidth; H = window.innerHeight; portrait = H > W; RW = Math.max(44, W * 0.042); RH = RW * 695 / 520; UW = Math.max(56, W * 0.056);
          rj.style.width = RW.toFixed(0) + 'px'; uf.style.width = UW.toFixed(0) + 'px'; uf.classList.toggle('away', portrait); }
        size(); jjOn(window, 'resize', size);
        /* the rocket: a cubic Bezier from below the city to above the top, up the left */
        var R = { P: null, t: 0, dur: 18, wait: 4 + Math.random() * 5, boost: 1 };
        function newPath() { var x0 = W < 700 ? W * (0.84 + Math.random() * 0.04) : 140 + RW * 0.5 + W * 0.006 + Math.random() * W * 0.01, s = Math.random() < .5 ? 1 : -1;   /* in the strip between the year ruler (its left edge never nearer than 140px) and the start of the words; on a narrow screen it keeps to the right edge */
          R.P = [[x0, H * 1.12], [x0 + s * W * 0.006, H * 0.62], [x0 - s * W * 0.006, H * 0.22], [x0 + s * W * 0.004, -H * 0.3]]; R.t = 0; R.dur = 17 + Math.random() * 5; R.boost = 1; }   /* (Joe, 2026-10-01: "should go slower") a leisurely rise, well under half the old speed */
        function bez(P, t) { var u = 1 - t; return [u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0], u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1]]; }
        var pk = 0, lastPuff = 0;
        /* the UFO: a slow wander in its patch of sky (right of the words, below Mars) */
        var U = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, rest: 0 };
        function upick() { U.tx = (0.86 + Math.random() * 0.08) * W; U.ty = (0.47 + Math.random() * 0.13) * H; }
        upick(); U.x = U.tx; U.y = U.ty; upick();
        function step(now) { raf = 0; if (!on) return; var dt = Math.min(0.05, (now - (last || now)) / 1000); last = now; var tt = (now - t0) / 1000;
          if (!R.P) { R.wait -= dt; if (R.wait <= 0) { newPath(); rj._fly = 1; rj.classList.add('go'); } }
          else { R.t += dt / R.dur * R.boost; if (R.t >= 1) { R.P = null; rj._fly = 0; rj.classList.remove('go', 'boost'); R.wait = 9 + Math.random() * 10; }
            else { var p = bez(R.P, R.t), p2 = bez(R.P, Math.min(1, R.t + 0.01)), dx = p2[0] - p[0], dy = p2[1] - p[1], ang = Math.atan2(dx, -dy) * 180 / Math.PI, spd = Math.hypot(dx, dy) / (R.dur / R.boost * 0.01) / H;
              rj.style.transform = 'translate3d(' + (p[0] - RW / 2).toFixed(1) + 'px,' + (p[1] - RH / 2).toFixed(1) + 'px,0) rotate(' + ang.toFixed(2) + 'deg)';
              rj.style.setProperty('--fs', Math.min(2.2, 0.85 + spd * 3.2).toFixed(2));
              if (now - lastPuff > (R.boost > 1 ? 80 : 260) && puffs.length) { lastPuff = now; var a = ang * Math.PI / 180, nx = p[0] - Math.sin(a) * RH * 0.5, ny = p[1] + Math.cos(a) * RH * 0.5, pf = puffs[pk++ % puffs.length], sz = RW * (0.35 + Math.random() * 0.25);
                pf.style.width = pf.style.height = sz.toFixed(0) + 'px';
                if (pf.animate) pf.animate([{ transform: 'translate3d(' + (nx - sz / 2).toFixed(1) + 'px,' + (ny - sz / 2).toFixed(1) + 'px,0) scale(.4)', opacity: .75 }, { transform: 'translate3d(' + (nx - sz / 2 + (Math.random() - .5) * RW).toFixed(1) + 'px,' + (ny - sz / 2 + RW * 0.8).toFixed(1) + 'px,0) scale(1.7)', opacity: 0 }], { duration: 1100, easing: 'cubic-bezier(.2,.6,.3,1)' }); } } }
          if (!portrait) { var dx2 = U.tx - U.x, dy2 = U.ty - U.y, d = Math.hypot(dx2, dy2);
            if (d < 6) { if (!U.rest) U.rest = now + 2500 + Math.random() * 4000; if (now > U.rest) { U.rest = 0; upick(); } }
            var sp = Math.min(W * 0.01, 10 + d * 0.3), ax = d > 1 ? dx2 / d * sp : 0, ay = d > 1 ? dy2 / d * sp : 0;
            U.vx += (ax - U.vx) * Math.min(1, dt * 0.8); U.vy += (ay - U.vy) * Math.min(1, dt * 0.8); U.x += U.vx * dt; U.y += U.vy * dt;
            var bob = Math.sin(tt * 1.3) * H * 0.008, rock = Math.sin(tt * 0.9 + 1) * 3 + Math.max(-6, Math.min(6, U.vx * 0.25));
            uf.style.transform = 'translate3d(' + (U.x - UW / 2).toFixed(1) + 'px,' + (U.y - UW * 0.39 + bob).toFixed(1) + 'px,0) rotate(' + rock.toFixed(2) + 'deg)'; }
          raf = requestAnimationFrame(step); }
        function set(o) { if (o === on) return; on = o; if (o) { last = 0; if (!raf) raf = requestAnimationFrame(step); } else { cancelAnimationFrame(raf); raf = 0; } }
        if (!STILL) { new MutationObserver(function () { set(E5.classList.contains('on') && !document.hidden); }).observe(E5, { attributes: true, attributeFilter: ['class'] });
          jjOn(document, 'visibilitychange', function () { set(E5.classList.contains('on') && !document.hidden); }); }
        var chirp = null;
        sky5.boost = function () { if (!R.P) return; R.boost = 4.5; rj.classList.add('boost'); };
        sky5.wobble = function () { var inn = uf.querySelector('.ufin'); uf.classList.remove('wob'); void inn.offsetWidth; uf.classList.add('wob'); setTimeout(function () { uf.classList.remove('wob'); }, 1000);
          try { if (!chirp) { chirp = new Audio(SB + 'story-sfx-orb-shimmer.mp3'); chirp.preload = 'auto'; } chirp.currentTime = 0; chirp.volume = 0.5; var pp = chirp.play(); if (pp && pp.catch) pp.catch(function () {}); } catch (x) {} };   /* the site's mixer and mute apply (it is an sfx) */
      })();
      /* the campfire lives IN the mid layer now, small and far (Joe: it floated and flickered too fast); the volcano in the far layer breathes smoke */
      (function () { var E1 = world.querySelector('.wera[data-era="1"]'), fm = E1.querySelector('.wmid'), ff = E1.querySelector('.wfar');
        /* THE VOLCANO AND THE CAMPFIRE, rendered in Blender (Joe, 2026-09-30: "make this locally with blender... embers... bigger smoke, not just
           flashing"; see experiments/blender-fx/mystory-prehistoric). Each is a loop in its layer's own box (% of the 2400x900 art): the
           volcano's smoke (alpha) with its glow + embers over it, the campfire (alpha) over its ground glow. The glows are the
           renders' light-on-black frames turned into alpha (-a files: alpha = the brightest channel): screen blending can't reach the sky
           behind the art (each layer is its own isolated group, so the black showed as a box over the sky). They load the first time the
           Prehistoric land is on screen and only play while it is; phones and reduced motion get the posters. */
        var FXL = [[ff, 'wfx vfx', 'left:56.667%;top:-13.333%;width:17.5%;aspect-ratio:420/460', [['ms-fx-volcano-smoke', 'sm'], ['ms-fx-volcano-glow-a', 'gl']]],
          [fm, 'wfx ffx', 'left:49.208%;top:46.778%;width:6.25%;aspect-ratio:150/200', [['ms-fx-campfire-glow-a', 'gl'], ['ms-fx-campfire', 'sm']]]], FXV = [],
          FXS = !!(window.matchMedia && (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(hover: none) and (pointer: coarse)').matches));
        FXL.forEach(function (L) { var box = document.createElement('div'); box.className = L[1]; box.style.cssText = L[2];
          L[3].forEach(function (c) { var el; if (FXS) { el = document.createElement('img'); el.alt = ''; el.setAttribute('data-psrc', SB + c[0] + '-poster.webp'); }
            else { el = document.createElement('video'); el.muted = true; el.loop = true; el.playsInline = true; el.setAttribute('muted', ''); el.setAttribute('playsinline', ''); el.preload = 'none'; el.poster = SB + c[0] + '-poster.webp'; el._base = SB + c[0]; FXV.push(el); }
            el.className = 'fxl ' + c[1]; el.setAttribute('aria-hidden', 'true'); box.appendChild(el); }); L[0].appendChild(box); });
        var fxOn = false; function fxSet(o) { if (o === fxOn) return; fxOn = o;
          if (FXS) { if (o) [].forEach.call(E1.querySelectorAll('img[data-psrc]'), function (im) { im.src = im.getAttribute('data-psrc'); im.removeAttribute('data-psrc'); }); return; }
          clearTimeout(fxSet._rel);
          FXV.forEach(function (v) { if (o) { if (!v._src) { v._src = 1; v.innerHTML = jjClipSrc(v._base); v.load(); } var pp = v.play(); if (pp && pp.catch) pp.catch(function () {}); } else { try { v.pause(); } catch (x) {} } });
          if (!o) fxSet._rel = setTimeout(function () { if (fxOn) return; FXV.forEach(function (v) { if (v._src) { v._src = 0; v.innerHTML = ''; v.removeAttribute('src'); try { v.load(); } catch (x) {} } }); }, 4000); }   /* m-1008a: four decoders handed back once the era has been gone 4 s (the posters stand in; the clips come back from cache) */
        new MutationObserver(function () { fxSet(E1.classList.contains('shown') && !document.hidden); }).observe(E1, { attributes: true, attributeFilter: ['class'] });   /* .shown, not .on: they were decoding a whole step after the era had sunk away */
        jjOn(document, 'visibilitychange', function () { fxSet(E1.classList.contains('shown') && !document.hidden); });
        /* THE VOLCANO ERUPTS (Joe, 2026-09-30: "have the volcano clickable and have it erupt throwing embers and lava that disappears in the air
           when clicked and do that as the achievement"). An invisible box over the cone takes the hover (a warm glow comes up in the crater) and
           the press (matched by geometry in the world click handler, like the cat). The eruption: a flash in the crater, the smoke loop surges
           (plays faster for a moment), lava blobs thrown up on arcs that cool, shrink and vanish in the air, a spray of embers higher still, and
           a puff of dark smoke. All CSS transforms / opacity, built per press and removed after. ERUPT_CLIP: the Blender one-shot, when it lands. */
        var vHit = document.createElement('i'); vHit.className = 'wvhit'; ff.appendChild(vHit);
        var vGlow = document.createElement('i'); vGlow.className = 'wvglow'; ff.appendChild(vGlow);
        var vEr = document.createElement('div'); vEr.className = 'werupt'; ff.appendChild(vEr);
        /* the Blender one-shot (2.5s, alpha, frames 1 and 60 empty) over the looping smoke; preloaded paused while the land is near. Reduced
           motion gets a brief flash of its poster and the crater glow; phones (no clips) and a clip that hasn't loaded get the code eruption. */
        var RMv = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches), vClip = null, vPost = null;
        if (RMv) { vPost = document.createElement('img'); vPost.className = 'werclip'; vPost.alt = ''; vPost.setAttribute('aria-hidden', 'true'); vPost.setAttribute('data-psrc', SB + 'ms-fx-volcano-erupt-poster.webp'); ff.appendChild(vPost); }
        else if (!FXS && !/[?&]erupt=code\b/.test(location.search)) { vClip = document.createElement('video'); vClip.className = 'werclip'; vClip.muted = true; vClip.playsInline = true; vClip.setAttribute('muted', ''); vClip.setAttribute('playsinline', ''); vClip.preload = 'auto'; vClip.setAttribute('aria-hidden', 'true'); ff.appendChild(vClip);
          vClip.addEventListener('ended', function () { vClip.classList.remove('on'); }); }
        new MutationObserver(function () { if (!E1.classList.contains('on')) return; if (vClip && !vClip._src) { vClip._src = 1; vClip.innerHTML = jjClipSrc(SB + 'ms-fx-volcano-erupt'); vClip.load(); }
          if (vPost && vPost.getAttribute('data-psrc')) { vPost.src = vPost.getAttribute('data-psrc'); vPost.removeAttribute('data-psrc'); } }).observe(E1, { attributes: true, attributeFilter: ['class'] });
        function erupt() { if (vEr._busy) return false; vEr._busy = true; var u = ff.offsetWidth / 100, h = '', R = Math.random, k;   /* u: 1% of the land's width, read once per press */
          vEr.style.setProperty('--u', u.toFixed(2) + 'px'); vGlow.classList.add('boom');
          if (vPost) { vPost.classList.remove('on'); void vPost.offsetWidth; vPost.classList.add('on', 'flash'); setTimeout(function () { vPost.classList.remove('on', 'flash'); vEr._busy = false; vGlow.classList.remove('boom'); }, 1400); return true; }
          if (vClip && vClip.readyState >= 2) { try { vClip.currentTime = 0; } catch (x) {} vClip.classList.add('on'); var pp = vClip.play(); if (pp && pp.catch) pp.catch(function () {});
            FXV.forEach(function (v) { if (/volcano/.test(v._base)) { try { v.playbackRate = 1.8; } catch (x) {} } });
            setTimeout(function () { FXV.forEach(function (v) { try { v.playbackRate = 1; } catch (x) {} }); vGlow.classList.remove('boom'); vEr._busy = false; }, 2600); return true; }
          for (k = 0; k < 16; k++) { var a = (R() - 0.5) * 2.1, sp = 6 + R() * 8; h += '<i class="lv" style="--x:' + (Math.sin(a) * sp * 1.5).toFixed(2) + ';--y:' + (-(Math.cos(a) * sp * 1.15 + 3)).toFixed(2) + ';--s:' + (0.55 + R() * 0.9).toFixed(2) + ';--d:' + (1.4 + R() * 0.9).toFixed(2) + 's;--dl:' + (R() * 0.5).toFixed(2) + 's"><b></b></i>'; }
          for (k = 0; k < 34; k++) { var a2 = (R() - 0.5) * 1.9, sp2 = 10 + R() * 16; h += '<i class="em" style="--x:' + (Math.sin(a2) * sp2).toFixed(2) + ';--y:' + (-(Math.cos(a2) * sp2 * 1.3 + 4)).toFixed(2) + ';--s:' + (0.18 + R() * 0.3).toFixed(2) + ';--d:' + (1.8 + R() * 1.6).toFixed(2) + 's;--dl:' + (R() * 0.9).toFixed(2) + 's"><b></b></i>'; }
          for (k = 0; k < 6; k++) h += '<i class="sm" style="--x:' + ((R() - 0.5) * 6).toFixed(2) + ';--y:' + (-(9 + R() * 9)).toFixed(2) + ';--s:' + (3 + R() * 3).toFixed(2) + ';--d:' + (3.2 + R() * 1.6).toFixed(2) + 's;--dl:' + (0.1 + R() * 0.6).toFixed(2) + 's"></i>';
          vEr.innerHTML = h; vEr.classList.remove('go'); void vEr.offsetWidth; vEr.classList.add('go');
          FXV.forEach(function (v) { if (/volcano/.test(v._base)) { try { v.playbackRate = 2.2; } catch (x) {} } });
          setTimeout(function () { FXV.forEach(function (v) { try { v.playbackRate = 1; } catch (x) {} }); vGlow.classList.remove('boom'); }, 2600);
          setTimeout(function () { vEr.classList.remove('go'); vEr.innerHTML = ''; vEr._busy = false; }, 5200); return true; }
        world._volc = { hit: vHit, glow: vGlow, erupt: erupt, busy: function () { return !!vEr._busy; } };
        [['era-1-mammoth-1', '29%', '54.5%', '4.6%'], ['era-1-mammoth-2', '34.2%', '58.6%', '3%'], ['era-1-mammoth-3', '38%', '54.6%', '4.6%']].forEach(function (M) { var d = document.createElement('div'); d.className = 'wmammoth'; d.style.cssText = 'left:' + M[1] + ';top:' + M[2] + ';width:' + M[3]; d.innerHTML = '<img alt="" src="' + SB + M[0] + '.webp">'; fm.appendChild(d); });
        var cat = document.createElement('div'); cat.className = 'wcat'; cat.innerHTML = '<i class="strip" style="background-image:url(' + SB + 'era-1-cat-strip.webp)"></i><img class="awake" alt="" src="' + SB + 'era-1-cat-awake.webp">'; fm.appendChild(cat); world._cat = cat;
        /* (the easel is gone from the Renaissance: Joe, 2026-09-30) */ })();
      var surf = document.createElement('img'); surf.className = 'wedge surf'; surf.alt = ''; surf.src = SB + 'era-0-edge.webp'; world.appendChild(surf);          /* the water surface rides the line where the sea gives way to the air */
      var EDGE = {}; [].forEach(function (n) { var g = document.createElement('img'); g.className = 'wedge rise'; g.alt = ''; g.src = SB + 'era-' + n + '-edge.webp'; g.style.top = '0'; g.style.opacity = '0'; world.appendChild(g); EDGE[n] = g; });   /* each later world rises in under its own door-frame: the lintel, the portcullis, the curtain */
      var lip = document.createElement('img'); lip.className = 'wedge lip'; lip.alt = ''; lip.src = SB + 'era-1-edge.webp'; world.querySelector('.wera[data-era="1"]').insertBefore(lip, world.querySelector('.wera[data-era="1"] .wshade'));   /* the cave's upper lip comes down for the films slide */
      /* EASTER EGG: Joe's favourite animal hides in the sea. Painted (era-0-octopus-strip, three frames of arms waving). The world sits
         under the page, so it cannot take a click itself: a press is matched to his box by geometry, like the photos. */
      /* (Joe, 2026-09-30) the purple painted one is retired: the easter egg (the 'octopus' award, the ink and the jet away) is Joe's coral
         octopus below, so there is only one octopus in the sea. */
      var octo = null;
      /* JOE'S OCTOPUS: his Dreamina clip, keyed (the screen's green projected out of every pixel, edge colours taken from the octopus
         itself), cropped to one box and cut to a seamless 7.2s loop (ms-octopus-swim). The clip only bobs and ripples in place; code floats
         him slowly round the upper and middle sea: a wandering path through a ring of places round the middle of the screen (never through
         the middle, where the words and the games' title sit). He never flips or squashes: he faces us and drifts.
         (Joe, 2026-10-01: "octopus is missing from top sections") He is no longer in the world layer under the page (the first slide's
         photos covered him): he is a fixed layer of the story itself, in front of the photos, there for as long as the sea
         is. He is the Precambrian easter egg ('octopus'): hover glows, a press puffs ink and he jets away, and a few seconds later he drifts
         back in and carries on, pressable again (the award itself only pays once). Transforms only, sizes cached per resize, no layout reads
         per frame; phones and reduced motion get the still with a gentle bob. */
      (function () { var E0 = world.querySelector('.wera[data-era="0"]'), E1o = world.querySelector('.wera[data-era="1"]'), RM = !!(window.matchMedia && (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(hover: none) and (pointer: coarse)').matches));
        var ow = document.createElement('div'); ow.className = 'woswim' + (RM ? ' still' : ''); ow.setAttribute('role', 'button'); ow.setAttribute('aria-label', 'An octopus'); ow.setAttribute('data-cursor', 'hover'); octo = ow;
        var vid = null; if (RM) ow.innerHTML = '<img alt="" src="' + SB + 'ms-octopus-swim-poster.webp">';
        else { vid = document.createElement('video'); vid.muted = true; vid.loop = true; vid.playsInline = true; vid.setAttribute('muted', ''); vid.setAttribute('playsinline', ''); vid.preload = 'none'; vid.poster = SB + 'ms-octopus-swim-poster.webp'; ow.appendChild(vid); }
        var ink = document.createElement('i'); ink.className = 'ink'; ow.appendChild(ink);
        wrap.appendChild(ow);   /* a layer above the photos even when one is hovered (a hovered photo lifts itself to 100); his path keeps him off the words */
        function seaOn() { return E0.classList.contains('on') && !E1o.classList.contains('arrived') && !document.hidden; }
        ow.addEventListener('mouseenter', function () { if (!ow._gone) ow.classList.add('hov'); }); ow.addEventListener('mouseleave', function () { ow.classList.remove('hov'); });
        ow.addEventListener('click', function (e) { e.stopPropagation(); if (ow._gone) return; ow._gone = true; ow.classList.remove('hov'); ow.classList.add('ink');   /* a puff of ink, then he jets away */
          if (window.jjScore) window.jjScore.award('octopus', { x: e.clientX, y: e.clientY });
          setTimeout(function () { ow.classList.add('jet'); }, 450);
          setTimeout(function () { ow.classList.remove('ink', 'jet'); ow._gone = false; ow._back = true; if (ow._home) ow._home(); }, 4600); });   /* ...and a few seconds on he drifts back in */
        if (RM) { new MutationObserver(function () { ow.classList.toggle('live', seaOn()); }).observe(E0, { attributes: true, attributeFilter: ['class'] }); new MutationObserver(function () { ow.classList.toggle('live', seaOn()); }).observe(E1o, { attributes: true, attributeFilter: ['class'] }); return; }
        /* the ring of places (in viewport %, x / y of his middle), upper and middle sea: left, top-left, top, top-right, right, mid-right, mid-left */
        var RING = [[[5, 14], [34, 56]], [[7, 22], [14, 22]], [[34, 64], [11, 15]], [[76, 90], [14, 24]], [[86, 93], [32, 56]], [[72, 84], [58, 64]], [[14, 28], [58, 64]]];
        var RING_N = [[[14, 40], [15, 24]], [[60, 86], [15, 24]], [[70, 88], [50, 58]], [[12, 30], [50, 58]]];   /* narrow screens: the words run edge to edge, so he keeps above and below them */
        var W = 1, H = 1, OW = 1, x = 0, y = 0, vx = 0, vy = 0, tx = 0, ty = 0, sec = 0, raf = 0, on = false, t0 = 0, last = 0, rest = 0;
        function pick(s) { var RR = W < 768 ? RING_N : RING, R = RR[s % RR.length]; tx = (R[0][0] + Math.random() * (R[0][1] - R[0][0])) / 100 * W; ty = (R[1][0] + Math.random() * (R[1][1] - R[1][0])) / 100 * H; tx = Math.max(OW * 0.55, Math.min(W - OW * 0.55, tx)); }
        function size() { W = window.innerWidth; H = window.innerHeight; OW = Math.min(130, Math.max(70, W * 0.06)); ow.style.width = OW.toFixed(0) + 'px'; }
        size(); jjOn(window, 'resize', size);
        sec = Math.random() < .5 ? 1 : 3; pick(sec); x = tx; y = ty; pick(sec);
        ow._home = function () { x = Math.random() < .5 ? -OW * 1.5 : W + OW * 1.5; y = H * (0.15 + Math.random() * 0.3); vx = vy = 0; rest = 0; pick(sec); };   /* back in from the nearer side */
        function step(now) { raf = 0; if (!on) return; var dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
          var dx = tx - x, dy = ty - y, d = Math.hypot(dx, dy);
          if (ow._gone && ow.classList.contains('jet')) { tx = -OW * 3; ty = -OW * 3; }
          else if (d < 12) { ow._back = false; if (!rest) rest = now + 1500 + Math.random() * 3500;   /* he hangs about a moment, then moves on (usually to a neighbouring place, sometimes back) */
            if (now > rest) { rest = 0; sec = sec + (Math.random() < .72 ? 1 : 6); pick(sec); } }
          var jet = ow._gone && ow.classList.contains('jet'), sp = jet ? W * 0.35 : ow._back ? Math.min(W * 0.07, 30 + d * 0.5) : Math.min(W * 0.016, 20 + d * 0.25), ax = d > 1 ? dx / d * sp : 0, ay = d > 1 ? dy / d * sp : 0, kk = jet ? 3 : ow._back ? 1.6 : 0.9;   /* ~1.6vw a second at most: slow (quicker on his way back in) */
          vx += (ax - vx) * Math.min(1, dt * kk); vy += (ay - vy) * Math.min(1, dt * kk); x += vx * dt; y += vy * dt;
          var t = (now - t0) / 1000, bob = Math.sin(t * 0.9) * H * 0.006 + Math.sin(t * 0.37 + 1) * H * 0.004, tilt = Math.max(-4, Math.min(4, vx * 0.06));   /* no flip, no squash (Joe): he just floats, facing us, leaning a touch into his drift */
          ow.style.transform = 'translate3d(' + (x - OW / 2).toFixed(1) + 'px,' + (y - OW * 0.41 + bob).toFixed(1) + 'px,0) rotate(' + tilt.toFixed(2) + 'deg)';
          raf = requestAnimationFrame(step); }
        function set(o) { if (o === on) return; on = o; ow.classList.toggle('live', o);
          if (o) { if (!vid._src) { vid._src = 1; vid.innerHTML = jjClipSrc(SB + 'ms-octopus-swim'); vid.load(); } var pp = vid.play(); if (pp && pp.catch) pp.catch(function () {}); t0 = t0 || performance.now(); last = 0; if (!raf) raf = requestAnimationFrame(step); }
          else { try { vid.pause(); } catch (e) {} cancelAnimationFrame(raf); raf = 0; } }
        var sync = function () { set(seaOn()); };
        new MutationObserver(sync).observe(E0, { attributes: true, attributeFilter: ['class'] }); new MutationObserver(sync).observe(E1o, { attributes: true, attributeFilter: ['class'] });
        jjOn(document, 'visibilitychange', sync);
      })();
      /* two more ways to earn an era: hit a galley three times and it goes down; press the rocket on its pad and it goes up */
      jjOn(document, 'click', function (e) { if (document.body.classList.contains('jj-modal-open') || document.documentElement.classList.contains('jjms-lb')) return;
        var E2 = world.querySelector('.wera[data-era="2"]'); if (E2.classList.contains('on')) { var sails = E2.querySelectorAll('.wprop.sail.in:not(.sunk)'); for (var q = 0; q < sails.length; q++) { var sr = sails[q].querySelector('img').getBoundingClientRect(); if (e.clientX < sr.left - 6 || e.clientX > sr.right + 6 || e.clientY < sr.top - 6 || e.clientY > sr.bottom + 6) continue;
          (function (sp) { var im = sp.querySelector('img'); if (!sp.querySelector('.half')) { ['l', 'r'].forEach(function (k) { var hf = document.createElement('i'); hf.className = 'half ' + k; hf.style.backgroundImage = 'url(' + im.getAttribute('src') + ')'; sp.appendChild(hf); }); }
            sp.style.animationPlayState = 'paused'; sp.classList.add('sunk', 'split'); sp.classList.remove('glow');   /* one press: it breaks in two and both halves go down where it was */
            if (window.jjScore) window.jjScore.award('ship', { x: e.clientX, y: e.clientY });
            var sunkN = (parseInt(localStorage.getItem('jjms-ships') || '0', 10) || 0) + 1; try { localStorage.setItem('jjms-ships', String(sunkN)); } catch (x) {}   /* the challenge: five ships down */
            if (sunkN < 5) toast('Ship ' + sunkN + ' of 5 down'); else if (sunkN === 5) { window.jjSay && window.jjSay('jolly-good'); if (window.jjScore) window.jjScore.award('fleet', { x: e.clientX, y: e.clientY }); }
            setTimeout(function () { sp.classList.remove('sunk', 'split'); sp.style.animationPlayState = ''; sp.style.animation = 'none'; void sp.offsetWidth; sp.style.animation = ''; }, 4000); })(sails[q]); return; } }
        var hitIn = function (el, pad) { var r = el.getBoundingClientRect(); return e.clientX >= r.left - pad && e.clientX <= r.right + pad && e.clientY >= r.top - pad && e.clientY <= r.bottom + pad; };
        var E1c = world.querySelector('.wera[data-era="1"]'); if (E1c.classList.contains('on') && world._cat && !world._cat.classList.contains('up') && hitIn(world._cat, 6)) { world._cat.classList.add('up'); return; }   /* the cat still wakes, just for fun: the Prehistoric achievement is the volcano now (Joe, 2026-09-30) */
        if (E1c.classList.contains('on') && world._volc && !world._volc.busy() && hitIn(world._volc.hit, 4) && !(e.target.closest && e.target.closest('#jjms .step a,#jjms .step button,#jjms .phw,#jjms .trav,#jjms .tcc'))) {   /* a photo or button over the cone (tablets) keeps its own press */ if (world._volc.erupt() && window.jjScore) window.jjScore.award('cat', { x: e.clientX, y: e.clientY }); return; }   /* the id stays 'cat' so anyone who already holds the Prehistoric unlock keeps it (jj-score k76 renames it Volcanic eruption) */
        var E3c = eras[3]; if (E3c.classList.contains('on') && E3c.classList.contains('taipei') && E3c._tower && !E3c.querySelector('.wmid.b').classList.contains('lit') && hitIn(E3c._tower, 4)) { E3c.querySelector('.wmid.b').classList.add('lit'); if (window.jjScore) window.jjScore.award('tower', { x: e.clientX, y: e.clientY }); return; }
        /* (the easel is scenery now: the Renaissance unlock moved to drawing on the Figma canvas, Joe 2026-09-24) */
        if (sky5 && world.querySelector('.wera[data-era="5"]').classList.contains('on')) { if (sky5.flying() && hitIn(sky5.rocket, 6)) { sky5.boost(); return; } if (!sky5.ufo.classList.contains('away') && hitIn(sky5.ufo.querySelector('img'), 10)) { sky5.wobble(); return; } }   /* Joe's rocket boosts, the UFO wobbles and chirps (no award) */
        if (rk && !rk._blast && world.querySelector('.wera[data-era="5"]').classList.contains('on')) { var rr = rk.getBoundingClientRect(); if (e.clientX >= rr.left - 8 && e.clientX <= rr.right + 8 && e.clientY >= rr.top - 8 && e.clientY <= rr.bottom + 8) { rk._blast = true; rk.classList.add('go', 'blast'); if (window.jjScore) window.jjScore.award('rocket', { x: e.clientX, y: e.clientY }); } } }, true);
      /* bubbles off the first line: a burst at creation, a few more whenever it is hovered */
      function bubblesFrom(el, n) { var st0 = el.closest('.step'); if (!st0) return; var r = el.getBoundingClientRect(), sr = st0.getBoundingClientRect();
        for (var b = 0; b < n; b++) { var i = document.createElement('i'); i.className = 'hbub'; var sz = 6 + Math.random() * 14;
          i.style.cssText = 'left:' + (r.left - sr.left + Math.random() * r.width).toFixed(0) + 'px;top:' + (r.top - sr.top + Math.random() * r.height * 0.6).toFixed(0) + 'px;--s:' + sz.toFixed(0) + 'px;--d:' + (2.6 + Math.random() * 2.4).toFixed(1) + 's;--dx:' + ((Math.random() - .5) * 8).toFixed(1) + 'vw;animation-delay:' + (Math.random() * 0.8).toFixed(2) + 's';
          st0.appendChild(i); (function (el2) { setTimeout(function () { el2.remove(); }, 6000); })(i); } }
      var litW = document.querySelector('#jjms .cap.hero .lit'); if (litW) { litW.addEventListener('mouseenter', function () { bubblesFrom(litW, 7); });
        new MutationObserver(function () { if (steps[0].classList.contains('gen') && !litW._bb) { litW._bb = 1; setTimeout(function () { bubblesFrom(litW, 16); }, 700); } }).observe(steps[0], { attributes: true, attributeFilter: ['class'] }); }
      /* the world is behind the page and takes no pointer, so its pressables get a hit box in front (data-cursor makes the bubble grow) */
      var HITS = [];
      function syncHits() { var want = [];
        var E2h = world.querySelector('.wera[data-era="2"]'); if (E2h.classList.contains('on')) Array.prototype.forEach.call(E2h.querySelectorAll('.wprop.sail.in:not(.sunk) img'), function (im) { want.push(im); });
        if (rk && !rk._blast && world.querySelector('.wera[data-era="5"]').classList.contains('on')) want.push(rk);
        if (sky5 && world.querySelector('.wera[data-era="5"]').classList.contains('on')) { if (sky5.flying()) want.push(sky5.rocket); if (!sky5.ufo.classList.contains('away')) want.push(sky5.ufo.querySelector('img')); }
        if (world._cat && !world._cat.classList.contains('up') && world.querySelector('.wera[data-era="1"]').classList.contains('on')) want.push(world._cat);
        if (world._volc && !world._volc.busy() && world.querySelector('.wera[data-era="1"]').classList.contains('on')) want.push(world._volc.hit);
        if (eras[3]._tower && eras[3].classList.contains('on') && eras[3].classList.contains('taipei') && !eras[3].querySelector('.wmid.b').classList.contains('lit')) want.push(eras[3]._tower);
        while (HITS.length < want.length) { var h = document.createElement('i'); h.className = 'jjms-hit'; h.setAttribute('data-cursor', 'hover'); h.addEventListener('mouseenter', function () { if (this._for) { this._for._seen = true; this.classList.remove('pr'); } var sp = this._for && this._for.closest('.wprop.sail'); if (sp) sp.classList.add('glow'); if (this._for && this._for.classList) this._for.classList.add('hov'); }); h.addEventListener('mouseleave', function () { var sp = this._for && this._for.closest('.wprop.sail'); if (sp) sp.classList.remove('glow'); if (this._for && this._for.classList) this._for.classList.remove('hov'); }); document.getElementById('jjms').appendChild(h); HITS.push(h); }
        for (var hi = 0; hi < HITS.length; hi++) { var tgt = want[hi]; if (HITS[hi]._for && HITS[hi]._for !== tgt) { var osp = HITS[hi]._for.closest && HITS[hi]._for.closest('.wprop.sail'); if (osp) osp.classList.remove('glow'); if (HITS[hi]._for.classList) HITS[hi]._for.classList.remove('hov'); } HITS[hi]._for = tgt; if (!tgt) { HITS[hi].style.display = 'none'; continue; } HITS[hi].classList.toggle('pr', !tgt._seen); HITS[hi].style.display = 'block'; } posHits(); }
      /* the boxes (and their prompt rings) follow their targets EVERY frame — at the old 250ms step the ring on a sailing ship jumped (Joe, 2026-09-24).
         Placed by transform, not left/top, so a moving ring never triggers layout. */
      function posHits() { var rs = [], hi;   /* all the reads, then all the writes */
        for (hi = 0; hi < HITS.length; hi++) { var tgt = HITS[hi]._for; rs[hi] = tgt && HITS[hi].style.display !== 'none' ? tgt.getBoundingClientRect() : null; }
        for (hi = 0; hi < HITS.length; hi++) { var h = HITS[hi], hr = rs[hi]; if (!hr) continue; var hw = hr.width.toFixed(0), hh = hr.height.toFixed(0), hx = hr.left.toFixed(1), hy = hr.top.toFixed(1);
          if (!h._pl) { h._pl = 1; h.style.left = '0'; h.style.top = '0'; }
          if (h._w !== hw || h._h !== hh) { h._w = hw; h._h = hh; h.style.width = hw + 'px'; h.style.height = hh + 'px'; }   /* size only when it changes: rewriting it every frame dirtied layout (and re-ran hover hit-testing) every frame (2026-09-28 profile) */
          if (h._x !== hx || h._y !== hy) { h._x = hx; h._y = hy; h.style.transform = 'translate3d(' + hx + 'px,' + hy + 'px,0)'; } } }
      /* (2026-09-30 profile: this was still the biggest per-frame cost of mine while scrolling: a layout read per box every frame.) The boxes
         are invisible, so they only need to be exact where the pointer is: every frame while the pointer is moving or the page is scrolling,
         otherwise a few times a second (a ship still sails under a resting pointer). */
      var hitK = 0, hitHot = 0; jjOn(window, 'pointermove', function () { hitHot = 12; }, { passive: true }); jjOn(window, 'scroll', function () { hitHot = 12; }, { passive: true });
      (function hitLoop() { if (HITS.length && (hitHot > 0 || ++hitK % 8 === 0)) posHits(); if (hitHot > 0) hitHot--; requestAnimationFrame(hitLoop); })();
      setInterval(syncHits, 250);
      /* the award board's cheer clip: loads and plays once each time its slide comes in, holds its last frame, resets when it leaves */
      (function () { var vids = document.querySelectorAll('#jjms .aglogo .agvid'); if (!vids.length || !('IntersectionObserver' in window)) return;
        var io = new IntersectionObserver(function (es) { es.forEach(function (en) { var v = en.target; if (en.isIntersecting) { v.addEventListener('loadedmetadata', function () { try { if (v.currentTime < 2.2) v.currentTime = 2.3; } catch (x) {} }, { once: true }); if (!v._src) { v._src = 1; var b = SB + v.getAttribute('data-base'); v.innerHTML = '' + jjClipSrc(b) + ''; v.load(); } try { v.currentTime = 2.3; } catch (x) {} var pp = v.play(); if (pp && pp.catch) pp.catch(function () {}); } else { v.pause(); } }); }, { threshold: 0.3 });
        Array.prototype.forEach.call(vids, function (v) { io.observe(v); }); })();
      var skyEl0 = document.getElementById('jjms-sky'); if (skyEl0 && skyEl0.parentNode) skyEl0.parentNode.insertBefore(world, skyEl0.nextSibling); else bg.appendChild(world);   /* right after the starfield in the page: stars BEHIND the scenery, slides in front of both */
      var eras = Array.prototype.slice.call(world.querySelectorAll('.wera'));
      eras.forEach(function (E, n) { ['far', 'mid', 'near'].forEach(function (k) { var im = new Image(), done = null; if (n === 0) firstHold(new Promise(function (r) { done = r; })); im.onerror = function () { if (done) done(); }; im.onload = function () { var put = function () { var L = E.querySelector('.w' + k + ':not(.b)'); L.style.backgroundImage = 'url(' + im.src + ')'; L.classList.add('art'); if (done) done(); }; if (im.decode) im.decode().then(put, put); else put(); };   /* decoded off the main thread before it is used, so the first pass into an era doesn't stall on it */ var go = function () { im.src = SB + (n === 3 ? 'era-3a-' + k : 'era-' + n + '-' + k + (n >= 1 && n <= 4 ? '-n' : '')) + '.webp'; }; if (n >= 2) afterFirst(go); else go(); }); });
      /* Medieval, scene b (Taipei): a second far/mid/near behind the same sky, faded in as the Taipei slide takes over from Brighton */
      (function () { var E3 = eras[3]; ['far', 'mid', 'near'].forEach(function (k) { var L = document.createElement('div'); L.className = 'wlay w' + k + ' b'; L.style.opacity = '0'; E3.insertBefore(L, E3.querySelector('.w' + k).nextSibling);
          var im = new Image(); im.onload = function () { L.style.backgroundImage = 'url(' + im.src + ')'; L.classList.add('art'); }; afterFirst(function () { im.src = SB + 'era-3b-' + k + '.webp'; }); });
        var lit = new Image(); afterFirst(function () { lit.src = SB + 'era-3b-mid-lit.webp'; });   /* warmed up for the switch */
        var tw = document.createElement('i'); tw.className = 'wtower'; E3.querySelector('.wmid.b').appendChild(tw); E3._tower = tw; })();
      var bub = world.querySelector('.wbub'); if (bub) { var bh = ''; for (var b = 0; b < 16; b++) bh += '<i style="left:' + (4 + b * 6.1 + (b % 3) * 1.4).toFixed(1) + '%;--s:' + (5 + (b * 7) % 11) + 'px;--d:' + (7 + (b * 3) % 8) + 's;--dl:-' + ((b * 1.7) % 9).toFixed(1) + 's"></i>'; bub.innerHTML = bh; }
      /* the walker */
      var walker = document.createElement('div'); walker.id = 'jjms-walker'; walker.innerHTML = '<img alt="">'; document.body.appendChild(walker);
      var wImg = walker.querySelector('img'), flat = []; ERAS.forEach(function (E) { E.icons.forEach(function (k) { flat.push(k); }); });
      var lastY = window.scrollY || 0, walkT = 0, lastSpr = -1;
      var vst = document.createElement('style'); vst.id = 'jjms-v2-style'; vst.textContent =
        'html.jjms-v2 #jjms .flare{background:radial-gradient(circle,rgba(255,255,255,.9) 0%,rgba(170,240,255,.5) 11%,rgba(40,180,230,.18) 25%,rgba(20,90,170,.08) 40%,transparent 58%);}html.jjms-v2 #jjms .gring{border-color:rgba(170,240,255,.9);}' +
        'html.jjms-v2 #jjms .step.gen .cap.hero .lit{animation-name:jjmsSlam,jjmsLitW,jjmsLitPW;}@keyframes jjmsLitW{0%{color:#fff;text-shadow:0 0 0 rgba(255,255,255,0);}20%{color:#fff;text-shadow:0 0 30px #fff,0 0 70px rgba(80,220,255,.95),0 0 130px rgba(40,140,255,.7);}100%{color:#fff;text-shadow:0 0 18px rgba(255,255,255,.5),0 0 44px rgba(80,220,255,.4),0 0 90px rgba(40,140,255,.28);}}' +
        '@keyframes jjmsLitPW{0%,100%{text-shadow:0 0 18px rgba(255,255,255,.5),0 0 44px rgba(80,220,255,.4),0 0 90px rgba(40,140,255,.28);}50%{text-shadow:0 0 26px rgba(255,255,255,.75),0 0 60px rgba(80,220,255,.6),0 0 110px rgba(40,140,255,.4);}}' +
        'html.jjms-v2 #jjms .cap .lit:hover .ch{text-shadow:0 0 24px #fff,0 0 56px rgba(80,220,255,.95),0 0 110px rgba(40,140,255,.75);}#jjms .cap.hero,#jjms .cap.hero .lit{pointer-events:auto;}' +
        '#jjms .hbub{position:absolute;width:var(--s);height:var(--s);border-radius:50%;border:1.5px solid rgba(200,240,255,.75);background:radial-gradient(circle at 35% 35%,rgba(255,255,255,.55),rgba(200,240,255,.06) 70%);pointer-events:none;z-index:3;opacity:0;animation:jjmsHb var(--d) ease-out forwards;}@keyframes jjmsHb{0%{transform:translate(0,0);opacity:0;}12%{opacity:.9;}100%{transform:translate(var(--dx),-46vh);opacity:0;}}' +
        'html.jjms-v2 #jjms-sky{clip-path:inset(var(--skytop,0px) 0 0 0);}html.jjms-v2 #jjms-bg .bgimg,html.jjms-v2 #jjms-bg .bwash{opacity:var(--space,0);transition:opacity .6s ease;}' +
        /* the swirl picture parallaxes up and its bottom edge used to cut a straight line across the middle eras: its foot now dissolves over the last quarter (rule 33: no straight edges) */
        'html.jjms-v2 #jjms-bg .bgimg{-webkit-mask-image:linear-gradient(to bottom,#000 62%,rgba(0,0,0,.6) 78%,transparent 100%);mask-image:linear-gradient(to bottom,#000 62%,rgba(0,0,0,.6) 78%,transparent 100%);}' +
        /* V2: pictures rest at 85% (they were 50%, which turned to mud over painted worlds); hover still lifts them to full, bigger and in front */
        'html.jjms-v2 #jjms .step.live .phw img{opacity:.8;}html.jjms-v2 #jjms .step.live .phw:hover img,html.jjms-v2 #jjms .step.live .phw.hot img,html.jjms-v2 #jjms .phw.blown img{opacity:1;}@keyframes jjmsPhIn{from{opacity:0;scale:.68;}to{opacity:.8;scale:1;}}' +
        'html.jjms-v2 #jjms .step.live .trav{opacity:.8;}html.jjms-v2 #jjms .step.live .trav:hover,html.jjms-v2 #jjms .step.live .trav.hot{opacity:1;}html.jjms-v2 #jjms .step.live .phw .fxc{opacity:.8;}html.jjms-v2 #jjms .glogo img{opacity:.8;}' +
        '#jjms-world{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none;}#jjms-world .wera{position:absolute;inset:0;overflow:hidden;visibility:hidden;}#jjms-world .wera.on{visibility:visible;}' +
        '#jjms-world .wsky{position:absolute;left:0;right:0;bottom:0;height:300vh;will-change:transform;}#jjms-world .wsky.glow{height:62vh;transform:none!important;}' +
        '#jjms-world .wlay{position:absolute;left:-2%;width:104%;bottom:0;background:center bottom/100% 100% no-repeat;will-change:transform;}#jjms-world .wfar{height:62vh;opacity:.9;}#jjms-world .wmid{height:70vh;}#jjms-world .wnear{height:46vh;bottom:-10vh;}' +
        '#jjms-world .wlay.art{left:50%;translate:-50% 0;width:max(100%,150vh);height:auto;aspect-ratio:2400/900;bottom:0;background-size:100% 100%;opacity:1;}' +
        '#jjms-world .wedge{position:absolute;left:50%;translate:-50% 0;width:max(104%,150vh);height:auto;pointer-events:none;will-change:transform;}#jjms-world .wedge.lip{top:0;}' +
        '#jjms-world .wprop{position:absolute;height:auto;pointer-events:none;will-change:transform;}#jjms-world .wprop img{display:block;width:100%;height:auto;}' +
        '#jjms-world .wprop .strip{display:block;width:100%;aspect-ratio:var(--ar,1);background-repeat:no-repeat;background-size:300% 100%;background-position:0 0;animation:jjmsStripPP calc(var(--sd,.8s) * 1.15) step-end infinite;}@keyframes jjmsStrip{to{background-position:100% 0;}}@keyframes jjmsStripPP{0%{background-position:0 0;}25%{background-position:50% 0;}50%{background-position:100% 0;}75%{background-position:50% 0;}100%{background-position:0 0;}}' +
        '#jjms-world .wrocket{position:absolute;left:77.4%;bottom:27.5%;width:3.4%;will-change:transform;transform-origin:50% 100%;}#jjms-world .wrocket img{display:block;width:100%;height:auto;}' +
        '#jjms-world .wrocket .flame{position:absolute;left:29%;top:98%;width:42%;aspect-ratio:.406;background:url() 0 0/300% 100% no-repeat;opacity:0;transform-origin:50% 0;animation:jjmsStrip .14s steps(3,jump-none) infinite;transition:opacity .25s ease;filter:drop-shadow(0 0 1vw rgba(120,200,255,.7));}#jjms-world .wrocket.go .flame{opacity:1;}' +
        '#jjms-world .wfire{position:absolute;left:51.6%;top:59.2%;width:1.5%;}#jjms-world .wfire .strip{display:block;width:100%;aspect-ratio:.607;background:url() 0 0/300% 100% no-repeat;animation:jjmsStripPP .7s step-end infinite;filter:drop-shadow(0 0 .6vw rgba(255,170,70,.75));}' +
        '#jjms-world .wsmoke2{position:absolute;left:61.8%;bottom:66.5%;width:3.2%;opacity:.8;}#jjms-world .wsmoke2 .strip{display:block;width:100%;aspect-ratio:.536;background:url() 0 0/300% 100% no-repeat;animation:jjmsStripPP 1.6s step-end infinite;}' +
        '#jjms-world .wmammoth{position:absolute;}#jjms-world .wmammoth img{display:block;width:100%;height:auto;}' +
        '#jjms-world .wcat{position:absolute;left:73.5%;top:56%;width:5.2%;}#jjms-world .wcat .strip{display:block;width:100%;aspect-ratio:1.351;background:url() 0 0/300% 100% no-repeat;animation:jjmsStripPP 2.4s step-end infinite;}#jjms-world .wcat .awake{display:none;width:100%;height:auto;}#jjms-world .wcat.up .strip{display:none;}#jjms-world .wcat.up .awake{display:block;}' +
        '#jjms-world .weasel{position:absolute;left:19%;top:49%;width:2.6%;}#jjms-world .weasel img{display:block;width:100%;height:auto;}#jjms-world .weasel .e1{display:none;}#jjms-world .weasel.done .e0{display:none;}#jjms-world .weasel.done .e1{display:block;}' +
        '#jjms-world .wsmoke{position:absolute;left:63.3%;top:33%;width:2.4%;aspect-ratio:1;}#jjms-world .wsmoke i{position:absolute;left:50%;bottom:0;width:100%;aspect-ratio:1;border-radius:50%;translate:-50% 0;background:radial-gradient(circle,rgba(175,195,220,.55) 0%,rgba(175,195,220,0) 70%);animation:jjmsSmoke 7s linear infinite;opacity:0;}' +
        '#jjms-world .wsmoke i:nth-child(2){animation-delay:-1.75s;}#jjms-world .wsmoke i:nth-child(3){animation-delay:-3.5s;}#jjms-world .wsmoke i:nth-child(4){animation-delay:-5.25s;}' +
        '@keyframes jjmsSmoke{0%{transform:translate(0,0) scale(.4);opacity:0;}12%{opacity:.75;}100%{transform:translate(-1.4vw,-14vh) scale(2.8);opacity:0;}}' +
        '#jjms-world .wera:not([data-era="0"]) .wprop{opacity:0;transition:opacity 1s ease;}#jjms-world .wera.arrived .wprop:not(.sail){opacity:1;}#jjms-world .wera.arrived .wprop.sail.in{opacity:1;}' +
        '#jjms-world .wprop.sail img{transition:filter .25s ease;}#jjms-world .wprop.sail.glow img{filter:brightness(1.35) drop-shadow(0 0 5px rgba(255,226,160,.85));}' +
        '#jjms-world .wprop.sail.sunk img{animation:none;transition:transform 2.6s ease-in,opacity 2.4s ease .4s;transform:rotate(28deg) translateY(2.4vw);opacity:0;}' +
        '#jjms-world .wprop.sail.sunk.split img{opacity:0;transition:none;}#jjms-world .wprop.sail .half{position:absolute;left:0;top:0;width:100%;height:100%;background:center/contain no-repeat;opacity:0;pointer-events:none;}' +
        '#jjms-world .wprop.sail.split .half{opacity:1;transition:transform 2.4s cubic-bezier(.4,0,.8,.6),opacity 1.6s ease 1.1s;}#jjms-world .wprop.sail.split .half.l{clip-path:inset(0 52% 0 0);transform:rotate(-34deg) translate(-.6vw,2.6vw);opacity:0;}#jjms-world .wprop.sail.split .half.r{clip-path:inset(0 0 0 48%);transform:rotate(38deg) translate(.6vw,2.6vw);opacity:0;}' +
        '#jjms-world .wrocket.blast{animation:jjmsBlast 3.6s cubic-bezier(.6,0,.8,.4) forwards;}@keyframes jjmsBlast{to{transform:translate3d(6vw,-160vh,0) rotate(8deg);}}' +
        '#jjms .jjms-hit{position:fixed;z-index:5;pointer-events:auto;cursor:pointer;background:transparent;}#jjms .jjms-hit.pr::after{display:none !important;content:"";position:absolute;left:50%;top:50%;width:min(100%,64px);aspect-ratio:1;translate:-50% -50%;border-radius:50%;border:2px solid rgba(255,201,61,.85);pointer-events:none;animation:jjmsTapRing 1.8s ease-out infinite;}' +
        '#jjms-world .wbanner .pole{display:block;height:.35vw;background:linear-gradient(180deg,#9fb3d6,#5a6f95);border-radius:.2vw;}#jjms-world .wbanner .flag{display:block;margin:0 .35vw;aspect-ratio:.62;background:linear-gradient(180deg,#3b63b8,#233f86);clip-path:polygon(0 0,100% 0,100% 78%,50% 100%,0 78%);transform-origin:50% 0;animation:jjmsSway 5s ease-in-out infinite;display:flex;align-items:flex-start;justify-content:center;padding-top:22%;box-sizing:border-box;box-shadow:inset 0 -1vw 2vw rgba(0,0,0,.25);}' +
        '#jjms-world .wbanner .flag img{width:56%;height:auto;filter:brightness(0) invert(1) drop-shadow(0 0 .3vw rgba(255,255,255,.5));}' +
        '#jjms-world .wera[data-era="3"] .wprop.sa,#jjms-world .wera[data-era="3"] .wprop.sb{transition:opacity .9s ease;}#jjms-world .wera[data-era="3"].arrived .wprop.sb,#jjms-world .wera[data-era="3"].arrived.taipei .wprop.sa{opacity:0!important;}#jjms-world .wera[data-era="3"].arrived.taipei .wprop.sb{opacity:1!important;}' +
        /* THE J BANNER (Joe, 2026-09-30: it didn't float nicely): no more stepping through its three painted frames (the J jumped between them).
           One frame, split with feathered masks: the rod stays still and the cloth hangs from it, swinging like a slow pendulum about the rod
           with a softer ripple of its own on top (two nested transforms, compositor only). */
        '#jjms-world .wprop.banner .bnr{display:block;position:relative;width:100%;aspect-ratio:.83;}#jjms-world .wprop.banner .rod,#jjms-world .wprop.banner .cloth,#jjms-world .wprop.banner .clr{position:absolute;inset:0;display:block;}' +
        '#jjms-world .wprop.banner .rod,#jjms-world .wprop.banner .clr{background-repeat:no-repeat;background-size:300% 100%;background-position:50% 0;}' +
        '#jjms-world .wprop.banner .rod{-webkit-mask:linear-gradient(#000 0,#000 8.5%,transparent 12%);mask:linear-gradient(#000 0,#000 8.5%,transparent 12%);z-index:1;}' +
        '#jjms-world .wprop.banner .cloth{transform-origin:50% 7.5%;-webkit-mask:linear-gradient(transparent 0,transparent 6%,#000 9.5%);mask:linear-gradient(transparent 0,transparent 6%,#000 9.5%);animation:jjBnrSwing 6.4s ease-in-out infinite;will-change:transform;}' +
        '#jjms-world .wprop.banner .clr{transform-origin:50% 7.5%;animation:jjBnrRipple 3.7s ease-in-out -1.1s infinite;will-change:transform;}' +
        '@keyframes jjBnrSwing{0%,100%{transform:rotate(-2.4deg);}50%{transform:rotate(2.4deg);}}@keyframes jjBnrRipple{0%,100%{transform:perspective(40em) rotateY(-10deg) skewX(1.8deg);}50%{transform:perspective(40em) rotateY(9deg) skewX(-1.8deg);}}' +
        '@media (prefers-reduced-motion:reduce){#jjms-world .wprop.banner .cloth,#jjms-world .wprop.banner .clr{animation:none;}}' +
        '#jjms-world .wfx{position:absolute;pointer-events:none;}#jjms-world .wfx .fxl{position:absolute;inset:0;display:block;width:100%;height:100%;max-width:none;object-fit:fill;}' +
        '#jjms-world .wvhit{position:absolute;left:59.2%;top:33.3%;width:10.4%;height:15.6%;border-radius:50% 50% 12% 12%;pointer-events:none;}' +
        '#jjms-world .wvglow{position:absolute;left:63.75%;top:34.7%;width:9%;aspect-ratio:1.6;translate:-50% -55%;border-radius:50%;background:radial-gradient(closest-side,rgba(255,196,110,.75),rgba(255,120,40,.35) 45%,rgba(255,90,30,0));opacity:0;transition:opacity .35s ease,scale .35s ease;pointer-events:none;mix-blend-mode:normal;}' +
        '#jjms-world .wvhit.hov + .wvglow{opacity:.85;scale:1.1;}#jjms-world .wvglow.boom{opacity:1;scale:1.6;transition:opacity .12s ease,scale .25s ease;animation:jjVBoom 2.6s ease-out forwards;}@keyframes jjVBoom{0%{opacity:1;scale:1.9;}30%{opacity:.9;scale:1.5;}100%{opacity:0;scale:1.1;}}' +
        '#jjms-world .werupt{position:absolute;left:63.75%;top:34.9%;width:0;height:0;pointer-events:none;}#jjms-world .werupt > i{position:absolute;left:0;top:0;width:0;height:0;opacity:0;}' +
        '#jjms-world .werupt > i > b{position:absolute;display:block;border-radius:50%;}' +
        '#jjms-world .werupt.go > i{animation:jjErX var(--d) linear var(--dl) forwards;}#jjms-world .werupt.go > i > b{animation:jjErY var(--d) var(--dl) forwards;}' +
        '#jjms-world .werupt .lv > b{left:calc(var(--u) * var(--s) * -.5);top:calc(var(--u) * var(--s) * -.5);width:calc(var(--u) * var(--s));height:calc(var(--u) * var(--s));background:radial-gradient(circle at 40% 35%,#fff3b0,#ffb13d 35%,#ff5a1a 65%,rgba(200,40,10,0) 100%);box-shadow:0 0 calc(var(--u) * .9) rgba(255,120,40,.8);}' +
        '#jjms-world .werupt .em > b{left:calc(var(--u) * var(--s) * -.5);top:calc(var(--u) * var(--s) * -.5);width:calc(var(--u) * var(--s));height:calc(var(--u) * var(--s));background:radial-gradient(circle,#fffbe0,#ffc66b 45%,rgba(255,140,50,0) 100%);box-shadow:0 0 calc(var(--u) * .5) rgba(255,170,70,.9);}' +
        '#jjms-world .werupt.go .em > b{animation-name:jjErYe;}' +
        '#jjms-world .werupt .sm{left:calc(var(--u) * var(--s) * -.5);top:calc(var(--u) * var(--s) * -.5);width:calc(var(--u) * var(--s));height:calc(var(--u) * var(--s));border-radius:50%;background:radial-gradient(closest-side,rgba(70,66,80,.7),rgba(70,66,80,.3) 55%,rgba(70,66,80,0));}#jjms-world .werupt.go .sm{animation:jjErSm var(--d) cubic-bezier(.2,.6,.3,1) var(--dl) forwards;}' +
        '@keyframes jjErX{0%{opacity:1;transform:translateX(0);}100%{opacity:1;transform:translateX(calc(var(--u) * var(--x)));}}' +
        '@keyframes jjErY{0%{transform:translateY(0) scale(1);opacity:1;animation-timing-function:cubic-bezier(.2,.7,.4,1);}45%{transform:translateY(calc(var(--u) * var(--y))) scale(.9);opacity:1;animation-timing-function:cubic-bezier(.5,0,.8,.5);}75%{opacity:.55;}100%{transform:translateY(calc(var(--u) * var(--y) * .55)) scale(.2);opacity:0;}}' +
        '@keyframes jjErYe{0%{transform:translateY(0) scale(1);opacity:0;animation-timing-function:cubic-bezier(.15,.7,.35,1);}8%{opacity:1;}55%{transform:translateY(calc(var(--u) * var(--y))) scale(.8);opacity:.9;animation-timing-function:ease-in;}100%{transform:translateY(calc(var(--u) * var(--y) * .8)) scale(.1);opacity:0;}}' +
        '@keyframes jjErSm{0%{opacity:0;transform:translate(0,0) scale(.3);}15%{opacity:.9;}100%{opacity:0;transform:translate(calc(var(--u) * var(--x)),calc(var(--u) * var(--y))) scale(1.6);}}' +
        '@media (prefers-reduced-motion:reduce){#jjms-world .werupt.go > i,#jjms-world .werupt.go > i > b{animation-duration:.01s;}}' +
        '#jjms-world .werclip{position:absolute;left:49.1667%;top:-24.4444%;width:29.1667%;height:auto;aspect-ratio:700/600;max-width:none;object-fit:fill;pointer-events:none;opacity:0;}#jjms-world .werclip.on{opacity:1;}#jjms-world img.werclip.flash{animation:jjErFlash 1.4s ease-out forwards;}@keyframes jjErFlash{0%{opacity:0;}15%{opacity:1;}100%{opacity:0;}}' +
        '#jjms .woswim{position:fixed;left:0;top:0;z-index:150;width:90px;will-change:transform;pointer-events:none;cursor:pointer;opacity:0;transition:filter .25s ease,opacity .8s ease;}#jjms .woswim.live{opacity:1;pointer-events:auto;}#jjms .woswim video,#jjms .woswim img{display:block;width:100%;height:auto;aspect-ratio:240/196;pointer-events:none;}' +
        '#jjms .woswim.hov{filter:drop-shadow(0 0 10px rgba(255,200,170,.75)) brightness(1.08);}#jjms .woswim .ink{position:absolute;left:50%;top:45%;width:12%;height:12%;border-radius:50%;background:radial-gradient(circle,#140a24 0%,rgba(20,10,36,.85) 45%,transparent 72%);translate:-50% -50%;opacity:0;pointer-events:none;}#jjms .woswim.ink .ink{animation:jjmsInk 1.6s ease-out forwards;}' +
        '#jjms .woswim.jet{opacity:0;pointer-events:none;transition:filter .25s ease,opacity 1.1s ease .5s;}html.jjms-lb #jjms .woswim,html.jjms-fin #jjms .woswim{opacity:0!important;pointer-events:none!important;}' +
        '#jjms .woswim.still{left:5vw;top:30vh;width:clamp(70px,6vw,130px);animation:jjOswBob 6s ease-in-out infinite;}#jjms .woswim.still.jet{transform:translate(-40vw,-50vh) scale(.6);transition:transform 1.5s cubic-bezier(.5,0,.8,.6),opacity 1.1s ease .4s;}@keyframes jjOswBob{0%,100%{translate:0 0;}50%{translate:0 -1.2vh;}}@media (prefers-reduced-motion:reduce){#jjms .woswim.still{animation:none;}}' +
        '@media (max-aspect-ratio:1/1){#jjms-world .wprop.pj{left:78%!important;top:52%!important;width:9vw!important;}#jjms-world .wprop.pm{left:6%!important;top:57%!important;width:4.5vw!important;}}' +   /* upright screens: the Figma window fills the sky, so the planets sit between the words and the phones */
        '#jjms-world .wrj,#jjms-world .wufo{position:absolute;left:0;top:0;will-change:transform;pointer-events:none;}#jjms-world .wrj img,#jjms-world .wufo img{position:relative;display:block;width:100%;height:auto;}' +
        '#jjms-world .wrj{opacity:0;transition:opacity .6s ease;}#jjms-world .wrj.go{opacity:1;}#jjms-world .wrj.hov img,#jjms-world .wufo img.hov{filter:drop-shadow(0 0 10px rgba(255,230,160,.8)) brightness(1.08);}' +
        /* the flame: three feathered teardrops pointing down from the nozzle, flickering; --fs stretches it with speed */
        '#jjms-world .wrj .rjfl{position:absolute;left:50%;top:91%;width:34%;height:0;translate:-50% 0;z-index:0;transform-origin:50% 0;transform:scaleY(var(--fs,1));transition:transform .25s ease;}#jjms-world .wrj.boost .rjfl{transform:scaleY(calc(var(--fs,1) * 1.6)) scaleX(1.2);}' +
        '#jjms-world .fla{position:absolute;left:0;top:0;width:100%;}#jjms-world .fla i{position:absolute;left:50%;top:0;border-radius:50% 50% 50% 50% / 38% 38% 62% 62%;transform-origin:50% 0;translate:-50% 0;filter:blur(1.2px);}' +
        '#jjms-world .fla .f1{width:100%;aspect-ratio:.42;background:radial-gradient(ellipse 50% 60% at 50% 30%,rgba(255,120,200,.9),rgba(255,80,170,.55) 55%,rgba(255,60,160,0) 100%);animation:jjFl1 .16s ease-in-out infinite alternate;}' +
        '#jjms-world .fla .f2{width:70%;aspect-ratio:.45;background:radial-gradient(ellipse 50% 60% at 50% 30%,rgba(255,170,70,1),rgba(255,120,40,.7) 60%,rgba(255,100,30,0) 100%);animation:jjFl2 .12s ease-in-out infinite alternate;}' +
        '#jjms-world .fla .f3{width:42%;aspect-ratio:.5;background:radial-gradient(ellipse 50% 60% at 50% 30%,#fffbe0,rgba(255,220,120,.9) 55%,rgba(255,200,90,0) 100%);animation:jjFl1 .09s ease-in-out infinite alternate;}' +
        '@keyframes jjFl1{from{scale:1 .86;}to{scale:.92 1.12;}}@keyframes jjFl2{from{scale:.94 1.1;}to{scale:1.04 .88;}}' +
        '#jjms-world .rjpuff{position:absolute;left:0;top:0;width:20px;height:20px;border-radius:50%;opacity:0;pointer-events:none;background:radial-gradient(closest-side,rgba(235,230,255,.7),rgba(200,190,240,.3) 55%,rgba(200,190,240,0));will-change:transform,opacity;}' +
        /* the UFO's little thrusters, one under each leg */
        '#jjms-world .wufo .ufin{position:relative;display:block;}#jjms-world .wufo .uth{position:absolute;width:13%;height:0;translate:-50% 0;z-index:0;}#jjms-world .wufo .uth::before{content:"";position:absolute;left:0;top:-2px;width:100%;aspect-ratio:.55;border-radius:50% 50% 50% 50% / 38% 38% 62% 62%;background:radial-gradient(ellipse 50% 60% at 50% 30%,#fff6d8,rgba(255,190,90,.9) 40%,rgba(255,110,200,.45) 72%,rgba(255,110,200,0));filter:blur(1px);transform-origin:50% 0;animation:jjUth .14s ease-in-out infinite alternate;}' +
        '#jjms-world .wufo .uth:nth-child(2)::before{animation-duration:.11s;}#jjms-world .wufo .uth:nth-child(3)::before{animation-duration:.17s;}@keyframes jjUth{from{scale:.9 .8;opacity:.8;}to{scale:1.05 1.15;opacity:1;}}' +
        '#jjms-world .wufo.away{display:none;}#jjms-world .wufo.wob .ufin{animation:jjUwob .9s cubic-bezier(.3,1.5,.5,1);}@keyframes jjUwob{0%{rotate:0deg;scale:1;}15%{rotate:-14deg;scale:1.08;}35%{rotate:11deg;}55%{rotate:-7deg;}75%{rotate:4deg;}100%{rotate:0deg;scale:1;}}' +
        /* parked (phones, reduced motion): the rocket on the left, the UFO on the right, both bobbing gently */
        '#jjms-world .wrj.still{opacity:1;left:5vw;top:40vh;width:clamp(44px,4.2vw,90px);animation:jjmsPropBob 7s ease-in-out infinite;}#jjms-world .wrj.still .rjfl{opacity:.8;}#jjms-world .wufo.still{left:86vw;top:50vh;width:clamp(56px,5.6vw,110px);animation:jjmsPropBob 9s ease-in-out infinite;}' +
        '@media (prefers-reduced-motion:reduce){#jjms-world .wrj.still,#jjms-world .wufo.still,#jjms-world .fla i,#jjms-world .wufo .uth::before{animation:none;}}@media (max-aspect-ratio:1/1){#jjms-world .wufo.still{display:none;}}' +
        '#jjms-world .wtower{position:absolute;left:87.5%;top:42%;width:6%;height:48%;pointer-events:none;}#jjms-world .wmid.b.lit{background-image:url(' + SB + 'era-3b-mid-lit.webp)!important;}' +
        '#jjms-world .wprop.bob img{animation:jjmsPropBob var(--pd,6s) ease-in-out infinite;}@keyframes jjmsPropBob{0%,100%{translate:0 0;rotate:-2deg;}50%{translate:.6vw -1.6vh;rotate:2deg;}}' +
        '#jjms-world .wprop.swim{animation:jjmsSwim var(--pd,38s) linear infinite;}@keyframes jjmsSwim{from{transform:translateX(-30vw);}to{transform:translateX(130vw);}}' +
        '#jjms-world .wprop.glide{animation:jjmsGlide var(--pd,46s) linear infinite;}@keyframes jjmsGlide{0%{transform:translate(120vw,0) scaleX(1);}100%{transform:translate(-40vw,-8vh) scaleX(1);}}' +
        '#jjms-world .wprop.sail{animation:jjmsSailL var(--pd,80s) linear infinite;}@keyframes jjmsSailL{from{transform:translateX(112vw);}to{transform:translateX(-20vw);}}#jjms-world .wprop.sail img{animation:jjmsPropBob 5s ease-in-out infinite;}' +
        '#jjms-world .wprop.sway img{transform-origin:50% 0;animation:jjmsSway var(--pd,6s) ease-in-out infinite;}@keyframes jjmsSway{0%,100%{rotate:-3deg;}50%{rotate:3deg;}}' +
        '#jjms-world .wprop.lamp img{animation:jjmsLamp 2.6s ease-in-out infinite;}@keyframes jjmsLamp{0%,100%{filter:drop-shadow(0 0 .6vw rgba(255,200,90,.5));}50%{filter:drop-shadow(0 0 1.6vw rgba(255,210,110,.95));}}' +
        '#jjms-world .wocto .strip{display:block;width:100%;aspect-ratio:1.525;background:url() 0 0/300% 100% no-repeat;animation:jjmsStripPP 1.3s step-end infinite;filter:drop-shadow(0 6px 10px rgba(0,0,0,.4));}' +
        '#jjms-world .wocto{position:absolute;right:9%;bottom:6vh;width:clamp(84px,8.4vw,150px);transform-origin:50% 100%;animation:jjmsOctoPeek 9s ease-in-out infinite;transition:transform 1.4s cubic-bezier(.5,0,.2,1),opacity 1.2s ease .3s;}@keyframes jjmsOctoPeek{0%,62%,100%{translate:0 34%;}70%,92%{translate:0 0;}}#jjms-world .wprop.firepos .strip{filter:drop-shadow(0 0 1.2vw rgba(255,170,70,.65));}' +
        '#jjms-world .wocto .ink{position:absolute;left:50%;top:50%;width:10%;height:10%;border-radius:50%;background:radial-gradient(circle,#140a24 0%,rgba(20,10,36,.85) 45%,transparent 72%);translate:-50% -50%;opacity:0;pointer-events:none;}#jjms-world .wocto.ink{animation:none;translate:0 0;}#jjms-world .wocto.ink .ink{animation:jjmsInk 1.6s ease-out forwards;}@keyframes jjmsInk{0%{opacity:0;scale:1;}20%{opacity:1;}100%{opacity:0;scale:34;}}' +
        '#jjms-world .wocto.jet{transform:translate(-46vw,-64vh) rotate(-38deg) scale(.5);opacity:0;}' +
        '#jjms-world .wprop.fire img{animation:jjmsFire .5s ease-in-out infinite alternate;transform-origin:50% 100%;}@keyframes jjmsFire{from{scale:1 1;filter:brightness(1);}to{scale:1.03 1.06;filter:brightness(1.15);}}' +
        '#jjms-world .wshade{display:none;}' +   /* a calm, darker pool behind the words, whatever the world is doing */
        '#jjms-world .wbub i{position:absolute;bottom:-4vh;width:var(--s);height:var(--s);border-radius:50%;border:1.5px solid rgba(200,240,255,.55);background:rgba(200,240,255,.12);animation:jjmsBub var(--d) linear var(--dl) infinite;}@keyframes jjmsBub{0%{transform:translate(0,0);opacity:0;}10%{opacity:.9;}50%{transform:translate(1.2vw,-55vh);}100%{transform:translate(-.8vw,-112vh);opacity:0;}}' +
        '#jjms-walker{position:fixed;left:0;bottom:58px;z-index:930;width:64px;pointer-events:none;opacity:0;transition:opacity .4s ease;will-change:transform;}#jjms-walker.on{opacity:1;}#jjms-walker img{display:block;width:100%;height:auto;filter:drop-shadow(0 6px 8px rgba(0,0,0,.5));transform-origin:50% 100%;}' +
        '#jjms-walker.walk img{animation:jjmsWaddle .42s ease-in-out infinite;}#jjms-walker.back img{scale:-1 1;}@keyframes jjmsWaddle{0%,100%{transform:rotate(-7deg) translateY(0);}50%{transform:rotate(7deg) translateY(-5px);}}';
      document.head.appendChild(vst);
      function eraSpan(n) { var a = -1, z = -1; for (var i = 0; i < STEPS.length; i++) if (STEPS[i].era === n) { if (a < 0) a = i; z = i; } return [a, z]; }
      function tick() { if (asleep) return;   /* a timer that lands while the story is out of the render tree must not measure it (every box reads 0) */
        var vh = window.innerHeight, sy = window.scrollY || 0, idx = curStep(), inStory = idx >= 0;
        var top0 = steps[0].getBoundingClientRect().top + sy, last = steps[steps.length - 1], bot = last.getBoundingClientRect().bottom + sy, total = Math.max(1, bot - top0 - vh);
        var shore = steps[eraSpan(1)[0]], skyT = Math.max(0, shore.offsetTop - vh * 0.2) + 'px'; if (tick._skyT !== skyT) { tick._skyT = skyT; var skyE = document.getElementById('jjms-sky'); if (skyE) skyE.style.setProperty('--skytop', skyT); }   /* on the sky itself and only when it changes: a root variable written every frame restyled the whole page (the water jank, 2026-09-24) */   /* no stars under water */
        var mid = sy + vh / 2, A = [], Z = [], T = [];
        for (var n = 0; n < eras.length; n++) { var sp = eraSpan(n); A[n] = steps[sp[0]].getBoundingClientRect().top + sy; Z[n] = steps[sp[1]].getBoundingClientRect().bottom + sy; T[n] = Math.max(0, Math.min(1, (sy + vh - A[n]) / vh)); }   /* T: how far era n has arrived */
        for (n = 0; n < eras.length; n++) { var E = eras[n], p = Math.max(0, Math.min(1, (mid - A[n]) / Math.max(1, Z[n] - A[n]))), t = T[n], u = n + 1 < eras.length ? T[n + 1] : 0;   /* u: how far the NEXT era has arrived = how far this one has left */
          var on = mid > A[n] - vh && mid < Z[n] + vh; E.classList.toggle('on', on);
          var shown = on && (n === 0 ? T[1] < 1 : (t > 0 && u < 1)); if (E._shown !== shown) { E._shown = shown; E.classList.toggle('shown', shown); }   /* really on screen: it has begun to arrive and has not fully sunk (.on is a whole screen wider either side) */
          if (!on) continue; E.style.zIndex = n;
          if (!tick._sW || tick._sVw !== window.innerWidth) { tick._sVw = window.innerWidth; tick._sW = surf.offsetWidth; tick._sH = surf.offsetHeight; } var sW = tick._sW || window.innerWidth, sH = tick._sH || 1,   /* measured once per width, not mid-frame after the writes */ sT = T[1] * vh - sH * 0.35, sL = (window.innerWidth - sW) / 2;   /* where the wave art sits this frame */
          var seaMask = 'url(' + SB + 'era-0-mask.webp) ' + sL.toFixed(1) + 'px ' + sT.toFixed(1) + 'px / ' + sW + 'px ' + sH + 'px no-repeat, linear-gradient(#000,#000) 0 ' + (sT + sH).toFixed(1) + 'px / 100% ' + Math.max(0, vh - sT - sH + 2).toFixed(1) + 'px no-repeat';
          var landMask = 'url(' + SB + 'era-1-mask.webp) ' + sL.toFixed(1) + 'px ' + sT.toFixed(1) + 'px / ' + sW + 'px ' + sH + 'px no-repeat, linear-gradient(#000,#000) 0 0 / 100% ' + Math.max(0, sT + 1).toFixed(1) + 'px no-repeat';
          if (n === 0) { E.style.clipPath = ''; var sm = T[1] > -0.35 && T[1] < 1 ? seaMask : '';   /* from above the top edge, so the surface line is already there when it enters (the flash Joe saw) */ E.style.setProperty('mask', sm); E.style.setProperty('-webkit-mask', sm); if (T[1] >= 1) { E.classList.remove('on'); continue; } E.querySelector('.wsky').style.transform = 'translate3d(0,' + (p * 200).toFixed(2) + 'vh,0)'; }
          if (n === 1) { E.style.clipPath = ''; var lm = t < 1 ? landMask : ''; E.style.setProperty('mask', lm); E.style.setProperty('-webkit-mask', lm);   /* we break the SURFACE: the night comes down from the top, the water drops away below it */
            surf.style.opacity = t > 0 && t < 1 ? Math.min(1, t / 0.07, (1 - t) / 0.07).toFixed(3) : '0';   /* the wave art eases in and out instead of popping on at the top (the jump Joe saw) */ surf.style.zIndex = 9; surf.style.top = '0'; surf.style.transform = 'translate3d(0,calc(' + (t * 100).toFixed(2) + 'vh - 35%),0)';
            var cv = Math.max(0, Math.min(1, (p - 0.5) / 0.2)) * (1 - Math.min(1, u * 2.5)); lip.style.transform = 'translate3d(0,' + ((cv - 1) * 100).toFixed(1) + '%,0)'; var cpn = E.querySelector('.wprop.cavepaint'); if (cpn) cpn.style.opacity = (cv * 0.85).toFixed(2); }
          var rise = n >= 2 ? (1 - t) : 0, sink = n >= 1 ? u : 0, es = function (k) { return (rise * k + sink * k * 0.9); }, dn = (DOWN[n] || 0);   /* land rises in from below and sinks away the same way, far layers least */
          if (n >= 1) { E.style.opacity = (1 - Math.max(0, (sink - 0.55) / 0.45)).toFixed(3); var arr = t > 0.6 && sink < 0.6; if (E._arr !== arr) { E._arr = arr; E.classList.toggle('arrived', arr); } }
          var lf = E.querySelector('.wfar:not(.b)'), lm = E.querySelector('.wmid:not(.b)'), ln = E.querySelector('.wnear:not(.b)');
          lf.style.transform = 'translate3d(0,calc(' + ((1 - p) * 4 + es(34)).toFixed(2) + 'vh + ' + dn + 'vw),0)';
          lm.style.transform = 'translate3d(0,calc(' + ((1 - p) * 9 + es(52)).toFixed(2) + 'vh + ' + dn + 'vw),0)';
          ln.style.transform = 'translate3d(' + ((0.5 - p) * 3).toFixed(2) + 'vw,calc(' + ((1 - p) * 15 + es(78)).toFixed(2) + 'vh + ' + dn + 'vw),0)';
          if (n === 3) { var pb = Math.max(0, Math.min(1, (p - 0.42) / 0.16)), bl = E.querySelectorAll('.wlay.b');   /* Brighton gives way to Taipei between the two slides */
            for (var bq = 0; bq < bl.length; bq++) { var src = E.querySelector('.w' + (bl[bq].classList.contains('wfar') ? 'far' : bl[bq].classList.contains('wmid') ? 'mid' : 'near') + ':not(.b)'); bl[bq].style.transform = src.style.transform; bl[bq].style.opacity = pb.toFixed(3); }
            lf.style.opacity = (0.9 * (1 - pb)).toFixed(3); lm.style.opacity = (1 - pb).toFixed(3); ln.style.opacity = (1 - pb).toFixed(3);
            if (E._pb !== (pb > 0.5)) { E._pb = pb > 0.5; E.classList.toggle('taipei', pb > 0.5); } }
          var gl = E.querySelector('.wsky.glow'); if (gl) gl.style.opacity = Math.max(0, Math.min(1, t * 1.4) * (1 - sink)).toFixed(3);
          if (n === 2) { var shipsIn = t >= 0.6 && sink < 0.6; if (E._ships !== shipsIn) { E._ships = shipsIn; Array.prototype.forEach.call(E.querySelectorAll('.wprop.sail'), function (sp) { sp.classList.toggle('in', shipsIn); }); } }
          if (n === 5) { var lift = Math.max(0, Math.min(1, (p - 0.3) / 0.55)), l2 = lift * lift;   /* ignition a third of the way in, out of the top before the last slide */
            if (!rk._blast) { rk.style.transform = 'translate3d(' + (l2 * 4).toFixed(2) + 'vw,' + (-l2 * 140).toFixed(2) + 'vh,0) rotate(' + (lift * 7).toFixed(1) + 'deg)'; rk.classList.toggle('go', lift > 0 && lift < 1); } } }
        surf.style.opacity = T[1] > 0 && T[1] < 1 ? '1' : '0';                                        /* always settled here: era 1's own branch is skipped once it is off screen, which left the water line hanging over later eras */
        var spc = T[1].toFixed(3); if (tick._spc !== spc) { tick._spc = spc; var bgE = document.getElementById('jjms-bg'); (bgE || document.documentElement).style.setProperty('--space', spc); }   /* the site's own sky arrives as we surface (scoped to the backdrop, and only on change) */
        /* (the walker is retired — the era blob mascot follows the visitor instead — so its per-frame nav measuring is gone too: it forced a full restyle every frame) */
        walker.classList.remove('on');
        var spr = flat[Math.max(0, Math.min(flat.length - 1, idx))]; if (spr !== lastSpr && spr) { lastSpr = spr; wImg.src = SPRITES[spr - 1]; }
        lastY = sy; }
      jjOn(window, 'scroll', function () { if (tick._q) return; tick._q = 1; requestAnimationFrame(function () { tick._q = 0; tick(); }); }, { passive: true });   /* at most one world tick per frame */ jjOn(window, 'resize', tick); setTimeout(tick, 60); setInterval(tick, 1200);
    })();
    var firstStepOfEra = [];
    for (e = 0; e < ERAS.length; e++) for (i = 0; i < STEPS.length; i++) if (STEPS[i].era === e) { firstStepOfEra[e] = i; break; }

    /* the year sitting at each step's centre — each era's span spread across its own steps, then
       pinned so the very first step reads 1995 (birth) and the last reads 2026 */
    var stepYear = [];
    for (e = 0; e < ERAS.length; e++) {
      var idxs = [];
      for (i = 0; i < STEPS.length; i++) if (STEPS[i].era === e) idxs.push(i);
      for (var j = 0; j < idxs.length; j++)
        stepYear[idxs[j]] = idxs.length > 1 ? ERAS[e].years[0] + (ERAS[e].years[1] - ERAS[e].years[0]) * j / (idxs.length - 1) : ERAS[e].years[0];
    }
    var STEP_YEARS = [1995, 2003, 2009, 2012, 2015, 2016, 2017, 2019, 2020, 2023, 2025, 2026, 2026, 2026];   /* + travel part two (2026-09-25) */   /* Joe's own years per slide (2026-09-18): the even spread ran ahead of the story */
    for (i = 0; i < STEP_YEARS.length && i < stepYear.length; i++) stepYear[i] = STEP_YEARS[i];
    stepYear[0] = Y0;                                            /* 1995 exactly, at the landing */
    stepYear[STEPS.length - 1] = Y1;                             /* 2026, and it holds there */

    nav.addEventListener('click', function (ev) {
      var a = ev.target.closest('a'); if (!a) return; ev.preventDefault();
      steps[firstStepOfEra[+a.getAttribute('data-era')]].scrollIntoView({ behavior: 'smooth' });
    });
    nx.addEventListener('click', function () {
      var idx = curStep();
      if (idx >= 0 && STEPS[idx].feat === 'think') { var r5 = steps[idx].getBoundingClientRect(), sp5 = r5.height - window.innerHeight, g5 = sp5 > 0 ? -r5.top / sp5 : 1;   /* the thinker's slide: NEXT first plays his grow (the pin), then moves on */
        if (g5 < 0.7) { var y5 = window.scrollY + r5.top + sp5 * 0.8, L5 = window.lenis || window.__lenis; if (L5 && L5.scrollTo) L5.scrollTo(y5, { duration: 1.4 }); else window.scrollTo({ top: y5, behavior: 'smooth' }); return; } }
      if (idx < steps.length - 1) steps[idx + 1].scrollIntoView({ behavior: 'smooth' });
    });
    /* ---- hover, driven by pointer geometry rather than CSS :hover ----
       Anything painted over a photo — the caption's own (invisible) box, the site's custom cursor,
       any Webflow overlay — swallows :hover without a trace. Coordinates can't be intercepted, so
       the photo under the pointer is found by measuring, with a few px of grace around the edge. */
    var hotEl = null, pmT = 0, pmX = -1, pmY = -1, PAD = 6;
    function photoUnder(x, y) {
      var i0 = curStep();
      if (i0 < 0) return null;
      for (var i = Math.min(steps.length - 1, i0 + 1); i >= Math.max(0, i0 - 1); i--) {
        var sEl = steps[i];
        if (!sEl.classList.contains('live')) continue;
        var sr = sEl.getBoundingClientRect();
        if (Math.abs(sr.top + sr.height / 2 - window.innerHeight / 2) > window.innerHeight * 0.7) continue;
        var ph = sEl.querySelectorAll('.phw:not(.deco),.trav');   /* travel cards hover the same way; scenery is skipped */
        for (var p = ph.length - 1; p >= 0; p--) {                /* last painted wins, as z-order would */
          var r = ph[p].getBoundingClientRect();
          if (x >= r.left - PAD && x <= r.right + PAD && y >= r.top - PAD && y <= r.bottom + PAD) return ph[p];
        }
      }
      return null;
    }
    function setHot(el) {
      if (el === hotEl) return;
      if (hotEl) hotEl.classList.remove('hot');
      hotEl = el;
      if (hotEl) hotEl.classList.add('hot');
    }
    var pmTimer = null;
    function hitTest() {                                          /* throttled, but never deferred to a
                                                                     frame — rAF can be starved */
      if (pmX < 0) return;
      var now = (window.performance && performance.now) ? performance.now() : +new Date();
      if (now - pmT < 24) {                                       /* and never drop the last move */
        if (!pmTimer) pmTimer = setTimeout(function () { pmTimer = null; hitTest(); }, 28);
        return;
      }
      pmT = now; setHot(photoUnder(pmX, pmY));
    }
    jjOn(document, 'pointermove', function (e) { if (document.body.classList.contains('jj-modal-open')) { setHot(null); return; } pmX = e.clientX; pmY = e.clientY; hitTest(); }, { passive: true });   // achievements open → nothing behind lights up
    jjOn(window, 'jj:score:pause', function () { setHot(null); });
    jjOn(document, 'pointerleave', function () { setHot(null); });
    jjOn(window, 'scroll', hitTest, { passive: true }); /* the photo under a still cursor changes as it moves */

    /* ---- click a film → the era sprite zooms off and the poster BLOWS UP (grows to the centre) ---- */
    var blownEl = null;
    /* the lightbox chrome: a dimming scrim, a title+rating panel, and a close button */
    var scrim = document.createElement('div'); scrim.id = 'jjms-scrim'; wrap.appendChild(scrim);
    var detail = document.createElement('div'); detail.id = 'jjms-detail';
    detail.innerHTML = '<p class="jjd-found">★ You found my favourite ★</p><p class="jjd-title"></p><p class="jjd-note"></p><div class="jjd-extra"></div><span class="jjd-rate"><span class="jjd-star">★</span>' +
      '<b class="jjd-score"></b><span class="jjd-out">/10</span><span class="jjd-src">IMDb</span></span>' +
      '<span class="jjd-ign"><span class="jjd-ignb">IGN</span><span class="jjd-igns"><i></i></span><b class="jjd-ignn"></b><span class="jjd-out">/5</span></span>';
    wrap.appendChild(detail);
    var dTitle = detail.querySelector('.jjd-title'), dScore = detail.querySelector('.jjd-score'),
        dNote = detail.querySelector('.jjd-note'), dRate = detail.querySelector('.jjd-rate');
    var closeBtn = document.createElement('button'); closeBtn.id = 'jjms-close';
    closeBtn.type = 'button'; closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
    wrap.appendChild(closeBtn);
    /* fade the page chrome (era header + sprites, NEXT, nav, ruler) out while a lightbox is open —
       it all sits above the scrim, so otherwise it shows through and collides with the video */
    function lightbox(on) { document.documentElement.classList.toggle('jjms-lb', !!on); }
    /* ---- the travel collection lightbox: every shot of one trip flies out from behind its lead ---- */
    var coll = document.createElement('div'); coll.id = 'jjms-coll';
    coll.innerHTML = '<div class="cshots"></div><div class="cinfo"><h3 class="cname"></h3>' +
      '<p class="ccap"></p><div class="cflags"></div></div>';
    wrap.appendChild(coll);
    var cShots = coll.querySelector('.cshots'), cName = coll.querySelector('.cname'),
        cCap = coll.querySelector('.ccap'), cFlags = coll.querySelector('.cflags');
    var collOpen = false;
    function openColl(travEl) {
      var key = travEl.getAttribute('data-trav');
      var T = null;
      for (var i = 0; i < CLUSTERS.length; i++) if (CLUSTERS[i].key === key) T = CLUSTERS[i];
      if (!T) return;
      var from = travEl.getBoundingClientRect();                     /* they grow OUT of the lead photo */
      var fx = from.left + from.width / 2, fy = from.top + from.height / 2;
      cName.textContent = T.name || '';                              /* the football set carries no heading */
      cName.style.display = T.name ? '' : 'none';
      cCap.textContent = T.cap;
      cFlags.innerHTML = (T.cc || []).map(function (c) { return '<span>' + c[1] + ' ' + esc(c[0]) + '</span>'; }).join('');
      /* lay the set out on an arc across the upper two thirds, so the caption below stays clear */
      cShots.innerHTML = '';
      coll.classList.toggle('clipset', !!T.clip);
      if (T.clip) {   /* the clippings: each one large (side by side, stacked on a tall screen); the highlights swipe and the strips grow once they land */
        var Wc = window.innerWidth, Hc = window.innerHeight, tallC = Hc > Wc, nC = T.files.length;
        T.files.forEach(function (f, k) { var C = CLIPS[f]; if (!C) return; var arC = C.h / C.w, bw = tallC ? Wc * 0.9 : Wc * 0.9 / nC - 24, bh = tallC ? Hc * 0.66 / nC - 18 : Hc * 0.64, wC = Math.min(bw, bh / arC);
          var cxC = tallC ? Wc / 2 : Wc / 2 + (k - (nC - 1) / 2) * (Wc * 0.9 / nC), cyC = tallC ? Hc * 0.06 + (Hc * 0.66 / nC) * (k + 0.5) : Hc * 0.42;
          var elC = document.createElement('div'); elC.className = 'cshot cclip'; elC.style.left = fx + 'px'; elC.style.top = fy + 'px'; elC.style.setProperty('--cw', Math.round(wC) + 'px');
          elC.innerHTML = clipHTML(f); elC.setAttribute('data-to', cxC.toFixed(0) + ',' + cyC.toFixed(0) + ',' + (k ? 2.5 : -2)); cShots.appendChild(elC); });
        setTimeout(function () { Array.prototype.forEach.call(cShots.querySelectorAll('.clipw'), function (c) { c.classList.add('play'); }); }, 650);
      } else {
      var n = T.files.length, W = window.innerWidth, H = window.innerHeight;
      /* Fill the space properly: try 1 or 2 rows and keep whichever makes the pictures BIGGEST while
         still fitting the width AND the height above the caption. Reading order stays left→right,
         top→bottom, so a sequence (the goal!) still reads as a sequence — nothing hides behind anything. */
      /* the row gap has to swallow what the tilt and the drift add to a card's box, or diagonal
         neighbours clip each other's corners */
      var gap = 18, vgap = 58, availW = W * 0.94, availH = H * 0.66, NOM = 0.72;   /* NOM ≈ typical height/width */
      var best = null;
      for (var rws = 1; rws <= (n > 3 ? 2 : 1); rws++) {
        var per = Math.ceil(n / rws);
        var byW = (availW - (per - 1) * gap) / per;
        var byH = ((availH - (rws - 1) * vgap) / rws) / NOM;
        var wv = Math.min(byW, byH);
        if (!best || wv > best.w) best = { w: wv, rows: rws, per: per };
      }
      var shotW = Math.max(150, best.w), rowH = shotW * NOM;
      var totalH = best.rows * rowH + (best.rows - 1) * vgap;
      var y0 = H * 0.44 - totalH / 2 + rowH / 2;                        /* the block sits above the caption */
      for (var k = 0; k < n; k++) {
        var row = Math.floor(k / best.per), col = k % best.per;
        var inRow = Math.min(best.per, n - row * best.per);             /* last row may be shorter — centre it */
        var span = inRow * shotW + (inRow - 1) * gap;
        var cx = (W - span) / 2 + shotW / 2 + col * (shotW + gap);
        var cy = y0 + row * (rowH + vgap);
        var t = inRow === 1 ? 0.5 : col / (inRow - 1);
        var rot = (t - 0.5) * 7 + (k % 2 ? 1.4 : -1.4);                 /* a light tilt, not enough to overlap */
        var el = document.createElement('div'); el.className = 'cshot';
        el.style.left = fx + 'px'; el.style.top = fy + 'px';            /* start ON the lead… */
        el.style.setProperty('--cw', Math.round(shotW) + 'px');
        el.style.setProperty('--ch', Math.round(rowH) + 'px');
        el.innerHTML = '<img src="' + SB + T.files[k] + '" alt="" decoding="async">';
        el.setAttribute('data-to', cx + ',' + cy + ',' + rot.toFixed(1));
        cShots.appendChild(el);
      }
      }
      coll.classList.add('on'); scrim.classList.add('on'); closeBtn.classList.add('on'); lightbox(true);
      collOpen = true;
      requestAnimationFrame(function () {                             /* …then fly out to their places */
        Array.prototype.forEach.call(cShots.children, function (el, k) {
          var to = el.getAttribute('data-to').split(',');
          el.style.transitionDelay = (k * 0.07).toFixed(2) + 's';
          el.style.left = to[0] + 'px'; el.style.top = to[1] + 'px';
          el.style.scale = '1'; el.style.rotate = to[2] + 'deg';
          /* the drift goes on the CARD's `transform` (translate/scale/rotate above carry the placement),
             so the photo and its frame always move as one piece */
          el.style.setProperty('--dx', (9 + k % 3 * 5) + 'px'); el.style.setProperty('--dy', (11 + k % 4 * 4) + 'px');
          el.style.setProperty('--dr', (0.8 + k % 3 * 0.4).toFixed(2) + 'deg');
          el.style.animation = 'jjmsDrift ' + (11 + k * 1.7).toFixed(1) + 's ease-in-out ' + (-k * 2.3).toFixed(1) + 's infinite';
        });
      });
    }
    function closeColl() {
      if (!collOpen) return;
      collOpen = false;
      coll.classList.remove('on'); scrim.classList.remove('on'); closeBtn.classList.remove('on'); lightbox(false);
      setTimeout(function () { if (!collOpen) cShots.innerHTML = ''; }, 500);
    }
    /* a single image, blown up in the same lightbox furniture as the video player */
    var shot = document.createElement('div'); shot.id = 'jjms-shot';
    shot.innerHTML = '<img alt=""><p class="jjp-title"></p>';
    wrap.appendChild(shot);
    var shotOpen = false;
    function openShot(src, cap, plain) {
      shot.classList.toggle('plain', !!plain);            /* a cut-out sprite wants no white card */
      shot.querySelector('img').src = src;
      shot.querySelector('.jjp-title').textContent = cap || '';
      shot.classList.add('on'); scrim.classList.add('on'); closeBtn.classList.add('on'); lightbox(true);
      shotOpen = true;
    }
    function closeShot() {
      if (!shotOpen) return;
      shotOpen = false;
      shot.classList.remove('on'); scrim.classList.remove('on'); closeBtn.classList.remove('on'); lightbox(false);
    }
    shot.addEventListener('click', function (e) { e.stopPropagation(); closeShot(); });
    /* the video player — same scrim + close button as the film lightbox */
    var player = document.createElement('div'); player.id = 'jjms-player';
    player.innerHTML = '<video playsinline controls preload="none"></video><div class="jjp-yt"></div><p class="jjp-title"></p><button type="button" class="jjp-later" data-cursor="hover">Watch later</button>';
    player.querySelector('.jjp-later').addEventListener('click', function (e) { e.stopPropagation(); closeVideo(); });
    wrap.appendChild(player);
    player.querySelector('video').addEventListener('ended', function () { if (player.classList.contains('rv')) window.jjSay && window.jjSay('thats-me', { delay: 400 }); });   /* grandad's whistle ends: 'Hey, that's me' */
    var vidEl = player.querySelector('video'), ytBox = player.querySelector('.jjp-yt'),
        pTitle = player.querySelector('.jjp-title');
    var playing = false;
    function openVideo(phw) {
      var src = phw.getAttribute('data-vid'), yt = phw.getAttribute('data-yt');
      if (!src && !yt) return;
      player.classList.toggle('yt', !!yt);
      player.classList.toggle('phone', phw.classList.contains('jjphone') || phw.classList.contains('jjms-reveal'));   /* the app demo and grandad's clip stay upright */
      player.classList.toggle('rv', phw.classList.contains('jjms-reveal'));   /* grandad's clip offers Watch later (it lives in the Store) */
      lightboxOpen = true;
      var loop = phw.querySelector('video');                         /* the silent preview stands down */
      if (loop) { try { loop.pause(); } catch (e0) {} }
      if (yt) {                                                      /* the school films live on YouTube — nothing to host */
        ytBox.innerHTML = '<iframe src="https://www.youtube.com/embed/' + encodeURIComponent(yt) +
          '?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=' + encodeURIComponent(location.origin) +
          '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" ' +
          'allowfullscreen title="' + esc(phw.getAttribute('data-cap') || 'Video') + '"></iframe>';
      } else {
        var pImg = phw.querySelector('img'), pVid = phw.querySelector('video');
        var poster = pImg ? pImg.getAttribute('src') : (pVid ? pVid.getAttribute('poster') : '');
        vidEl.src = SB + src; vidEl.poster = poster ? SB + poster.split('/').pop() : '';
      }
      pTitle.textContent = phw.getAttribute('data-cap') || '';
      duckMusic();                                                   /* a video would talk over the music */
      player.classList.add('on'); scrim.classList.add('on'); closeBtn.classList.add('on'); lightbox(true);
      playing = true;
      if (!yt) { var p = vidEl.play(); if (p && p.catch) p.catch(function () {}); }  /* autoplay may be blocked — controls are there */
    }
    function closeVideo() {
      if (!playing) return;
      playing = false;
      try { vidEl.pause(); } catch (e) {}
      vidEl.removeAttribute('src'); vidEl.load();                        /* stop buffering once it's shut */
      lightboxOpen = false;
      ytBox.innerHTML = '';                                             /* pulling the iframe stops YouTube dead */
      Array.prototype.forEach.call(wrap.querySelectorAll('.jjphone video'), function (v) {
        var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});   /* the phone gets going again */
      });
      player.classList.remove('on'); player.classList.remove('phone');
      scrim.classList.remove('on'); closeBtn.classList.remove('on'); lightbox(false);
      if (closeVideo.after) { var af = closeVideo.after; closeVideo.after = null; setTimeout(af, 300); }
      unduckMusic();
    }

    /* ---- "you found my favourite film" ----
       A Día de Muertos burst: papel-picado squares, marigold petals and a few skulls/flowers thrown up
       out of the poster, plus a short marimba flourish. The sound is SYNTHESISED with WebAudio, so
       there's no audio file to host — and a click is a user gesture, which is exactly what the browser
       needs before it will let anything make noise. */
    var PARTY_COLS = ['#FF9E1B', '#FF6A00', '#FF2E88', '#C548FF', '#00D6C4', '#FFD028', '#FF4D6D'];
    var partyTimer = null, sfx = null, sfxFade = null;
    var SFX_PEAK = 0.62, SFX_IN = 500, SFX_OUT = 800;                /* ms of fade either end */
    function sfxEl() {                                                /* built lazily — nobody downloads it unless they find it */
      if (!sfx) {
        sfx = new Audio(SB + 'sfx-bookoflife.mp3');
        sfx.preload = 'none'; sfx.volume = 0;
        sfx.id = 'jjms-sfx'; sfx.style.display = 'none';
        wrap.appendChild(sfx);                                        /* in the DOM: some browsers are happier */
      }
      return sfx;
    }
    function fadeTo(target, ms, done) {                               /* linear volume ramp on a timer */
      clearInterval(sfxFade);
      var a = sfxEl(), from = a.volume, t0 = Date.now();
      sfxFade = setInterval(function () {
        var k = Math.min(1, (Date.now() - t0) / ms);
        try { a.volume = Math.max(0, Math.min(1, from + (target - from) * k)); } catch (e) {}
        if (k >= 1) { clearInterval(sfxFade); if (done) done(); }
      }, 30);
    }
    function partySound() {
      if (userMuted) return;                                          /* the moon button rules all sound */
      try {
        var a = sfxEl();
        clearInterval(sfxFade);
        a.currentTime = 0; a.volume = 0;
        var p = a.play(); if (p && p.catch) p.catch(function () {});   /* a click is a user gesture, so this is allowed */
        fadeTo(SFX_PEAK, SFX_IN);                                      /* ease it in rather than smacking them with it */
        /* and ease it out over the tail so it never just stops dead */
        a.onloadedmetadata = a.ontimeupdate = function () {
          var left = (a.duration || 0) - a.currentTime;
          if (left > 0 && left * 1000 <= SFX_OUT && a.volume > 0.02) fadeTo(0, left * 1000);
        };
      } catch (e) {}
    }
    function stopSound() {                                            /* closing the lightbox fades it away */
      if (!sfx || sfx.paused) return;
      fadeTo(0, 260, function () { try { sfx.pause(); sfx.currentTime = 0; } catch (e) {} });
    }
    /* warm the clip up on hover — 228KB, so it is only fetched once someone is actually near it */
    Array.prototype.forEach.call(wrap.querySelectorAll('.phw[data-party]'), function (el) {
      el.addEventListener('pointerenter', function () { try { sfxEl().load(); } catch (e) {} }, { once: true });
    });
    function party(originEl, opts) {
      opts = opts || {};
      var glyphs = opts.glyphs || ['\ud83d\udc80', '\ud83c\udf3c', '\ud83c\udf38', '\u2728'];
      var cols = opts.cols || PARTY_COLS;
      /* respect a reduced-motion preference — the sound and the ribbon still land */
      var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (opts.sound !== false) {
        duckMusic();                                                 /* the soundtrack steps aside */
        partySound();
      }
      if (calm) return;
      var old = document.getElementById('jjms-party'); if (old) old.remove();
      clearTimeout(partyTimer);
      var box = document.createElement('div'); box.id = 'jjms-party';
      var r = originEl.getBoundingClientRect();
      var ox = r.left + r.width / 2, oy = r.top + r.height / 2, H = window.innerHeight;
      var html = '';
      for (var i = 0; i < 78; i++) {
        var ang = (Math.PI * 2 * i) / 78 + Math.random() * 0.4;
        var spread = 180 + Math.random() * 520;
        var px = Math.cos(ang) * spread;
        var pk = -(140 + Math.random() * 320);                       /* how high it flies first */
        var py = H * 0.62 + Math.random() * H * 0.4;                 /* then falls past the bottom */
        var isGlyph = i % 5 === 0;
        var sz = isGlyph ? (14 + Math.random() * 16) : (7 + Math.random() * 11);
        var st = 'left:' + ox.toFixed(0) + 'px;top:' + oy.toFixed(0) + 'px;' +
          '--px:' + px.toFixed(0) + 'px;--pk:' + pk.toFixed(0) + 'px;--py:' + py.toFixed(0) + 'px;' +
          '--pr:' + (Math.random() * 1080 - 540).toFixed(0) + 'deg;' +
          '--pd:' + (2.1 + Math.random() * 1.6).toFixed(2) + 's;--pdl:' + (Math.random() * 0.22).toFixed(2) + 's;';
        if (isGlyph) {
          html += '<i style="' + st + 'font-size:' + sz.toFixed(0) + 'px">' + glyphs[i % glyphs.length] + '</i>';
        } else {
          var c = cols[i % cols.length];
          /* half papel-picado squares, half marigold petals */
          var petal = i % 2 === 0;
          html += '<i style="' + st + 'width:' + sz.toFixed(0) + 'px;height:' + (sz * (petal ? 1.5 : 1.15)).toFixed(0) +
            'px;background:' + c + ';border-radius:' + (petal ? '50% 50% 45% 45%' : '2px') +
            ';box-shadow:0 0 10px ' + c + '66"></i>';
        }
      }
      box.innerHTML = html; wrap.appendChild(box);
      partyTimer = setTimeout(function () { if (box.parentNode) box.remove(); }, 4200);
    }


    function blowUp(phw) {
      var r = phw.getBoundingClientRect();
      var dx = window.innerWidth / 2 - (r.left + r.width / 2);
      var hasEx = false;                 /* a card with extra covers (Fable I-III) needs more room below, so the poster sits higher and smaller */
      var dy = window.innerHeight * (hasEx ? 0.27 : 0.42) - (r.top + r.height / 2);   /* room for the title + rating below */
      var k = Math.min(6, (window.innerHeight * (hasEx ? 0.36 : 0.56)) / r.height);   /* grow until ~56vh tall */
      phw._rotPrev = phw.style.rotate;                               /* the design tilt, restored on reset */
      phw.style.transformOrigin = 'center center'; phw.style.rotate = '0deg';
      phw.style.setProperty('--blowk', k.toFixed(3));
      phw.style.transform = 'translate(' + dx.toFixed(0) + 'px,' + dy.toFixed(0) + 'px) scale(' + k.toFixed(2) + ')';
      phw.classList.add('blown'); blownEl = phw;
      var ttl = phw.getAttribute('data-cap') || '';                  /* the label becomes the headline */
      dTitle.textContent = ttl; dTitle.style.display = ttl ? '' : 'none';
      /* only the films carry a rating — a game box or a snapshot shouldn't sprout an IMDb score */
      var isGame = !!phw.getAttribute('data-game'), dIgn = detail.querySelector('.jjd-ign'), dExtra = detail.querySelector('.jjd-extra'), dFound = detail.querySelector('.jjd-found');
      dIgn.style.display = isGame ? '' : 'none';
      if (isGame) { var stv = parseFloat(phw.getAttribute('data-stars')) || 4; dIgn.querySelector('.jjd-igns i').style.width = (stv / 5 * 100) + '%'; dIgn.querySelector('.jjd-ignn').textContent = stv.toFixed(1); }
      var ex = (phw.getAttribute('data-extra') || '').split('|'), exh = ''; for (var ei = 0; ei + 1 < ex.length; ei += 2) exh += '<span><img src="' + SB + ex[ei] + '" alt=""><em>' + esc(ex[ei + 1]) + '</em></span>';
      dExtra.innerHTML = ''; dExtra.style.display = 'none';   /* the extra covers now fan out from behind the blown cover itself (.fxc) */
      dFound.textContent = phw.getAttribute('data-found') || '\u2605 you found my favourite \u2605';
      if (phw.getAttribute('data-award') && window.jjScore) window.jjScore.award(phw.getAttribute('data-award'));
      var isFilm = /film-/.test((phw.querySelector('img') || {}).getAttribute ? phw.querySelector('img').getAttribute('src') : '');
      dRate.style.display = isFilm ? '' : 'none';
      dScore.textContent = phw.getAttribute('data-rating') || '8.80';/* PLACEHOLDER rating until the real per-film ones land */
      var note = phw.getAttribute('data-note') || '';                 /* optional line under the title */
      dNote.textContent = note; dNote.style.display = note ? '' : 'none';
      var isParty = phw.getAttribute('data-party');
      detail.classList.toggle('party', !!isParty);
      scrim.classList.add('on'); detail.classList.add('on'); closeBtn.classList.add('on'); lightbox(true);
      if (isParty) party(phw, isGame ? { sound: false, glyphs: ['\u2694\ufe0f', '\ud83d\udee1\ufe0f', '\u2728', '\ud83d\udc09'] } : undefined);   /* the WoW find: confetti now, Joe's soundbite later */
    }
    function resetBlow() {
      if (!blownEl) return;
      blownEl.style.transform = ''; blownEl.style.rotate = blownEl._rotPrev || '';
      blownEl.style.removeProperty('--blowk');
      blownEl.classList.remove('blown'); blownEl = null;
      scrim.classList.remove('on'); detail.classList.remove('on'); detail.classList.remove('party');
      closeBtn.classList.remove('on'); lightbox(false);
      var pb = document.getElementById('jjms-party'); if (pb) pb.remove();
      stopSound(); unduckMusic();
    }
    function closeAny() { resetBlow(); closeVideo(); closeColl(); closeShot(); closeQuiz(); closeSkills(); if (typeof v2Close === 'function') v2Close(); }
    /* LEARNING NEW SKILLS board: every card of the set at once, each under its own tag; the AI clip plays as it opens */
    var SKILLS = [['skill-draw-1.jpg', 'Procreate'], ['skill-draw-2.jpg', 'Procreate'], ['tech-vr-2.jpg', 'VR'], [null, 'Coming soon'], ['tech-flyer-green.mp4', 'Animation through AI']];
    var skb = null, skOpen = false;
    function openSkills() { if (!skb) { skb = document.createElement('div'); skb.id = 'jjms-skills'; skb.setAttribute('data-lenis-prevent', '');
        skb.innerHTML = '<h3>Learning new skills</h3><div class="skg">' + SKILLS.map(function (k) { var f = k[0]; return '<figure' + (f ? '' : ' class="ph"') + '>' + (f ? (/\.mp4$/.test(f) ? '<video muted loop playsinline preload="none" data-src="' + SB + f + '"></video>' : '<img alt="" loading="lazy" src="' + SB + f + '">') : '<i></i>') + '<figcaption>' + k[1] + '</figcaption></figure>'; }).join('') + '</div>';
        document.body.appendChild(skb); }
      skb.classList.add('on'); scrim.classList.add('on'); closeBtn.classList.add('on'); lightbox(true); skOpen = true;
      Array.prototype.forEach.call(skb.querySelectorAll('video'), function (v) { if (!v.src) v.src = v.getAttribute('data-src'); v.currentTime = 0; var pp = v.play(); if (pp && pp.catch) pp.catch(function () {}); }); }
    function closeSkills() { if (!skOpen) return; skOpen = false; skb.classList.remove('on'); Array.prototype.forEach.call(skb.querySelectorAll('video'), function (v) { v.pause(); }); if (!shotOpen && !blownEl && !playing && !collOpen) { scrim.classList.remove('on'); closeBtn.classList.remove('on'); lightbox(false); } }
    /* One word per caption can be marked `hot` (see STEPS) — it shimmers gold to invite the click
       and throws the same confetti the Book of Life easter egg uses, minus the sound. */
    /* The tint was riding on `:hover`, which has to survive `.deco{pointer-events:none}`, the
       nested transformed spans and (on the live site) the custom cursor overlay. Driving it from
       pointer events on the element itself is one less thing that can quietly not apply. */
    Array.prototype.forEach.call(wrap.querySelectorAll('.phw.logo'), function (lg) {
      var on = function () { lg.classList.add('lit'); };
      var off = function () { lg.classList.remove('lit'); };
      lg.addEventListener('mouseenter', on);
      lg.addEventListener('mouseleave', off);
      lg.addEventListener('mousemove', on);                        /* belt and braces */
      lg.addEventListener('touchstart', function () { on(); setTimeout(off, 1400); }, { passive: true });
    });
    /* the app characters open as a modal, like everything else you can press */
    Array.prototype.forEach.call(wrap.querySelectorAll('.phw.deco[data-tap]'), function (ch) {
      ch.addEventListener('click', function (e) {
        e.stopPropagation();
        closeAny();
        openShot(ch.querySelector('img').getAttribute('src'), ch.getAttribute('data-cap') || '', true);
      });
    });
    /* the trophy sits over the word it belongs to — measured, because where that word lands depends
       on how the caption wraps at this width */
    function aimTrophy() {
      Array.prototype.forEach.call(wrap.querySelectorAll('.step'), function (st) {
        var tr = st.querySelector('.jjtrophy'), word = st.querySelector('.cap .hotword');
        if (!tr || !word) return;
        if (!word.offsetWidth || !tr.offsetWidth || !st.offsetWidth) return;
        var wx = 0, n = word;
        while (n && n !== st) { wx += n.offsetLeft; n = n.offsetParent; }
        tr.style.left = ((wx + word.offsetWidth / 2 - tr.offsetWidth / 2) / st.offsetWidth * 100).toFixed(2) + '%';
      });
    }
    aimTrophy();
    requestAnimationFrame(aimTrophy);
    setTimeout(aimTrophy, 400);
    jjOn(window, 'resize', aimTrophy);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(aimTrophy);
    var tallSteps = wrap.querySelectorAll('.step.tall');
    var lightboxOpen = false;
    Array.prototype.forEach.call(wrap.querySelectorAll('.glogo img'), function (im) {
      im.addEventListener('error', function () { im.parentNode.classList.add('nofile'); });
      if (im.complete && !im.naturalWidth) im.parentNode.classList.add('nofile');
    });
    /* Each client logo does something of its own when pressed. Drawn rather than exported so
       nothing extra has to be hosted. */
    var AG_FX = {
      /* UX/UI shops: a wireframe, a grid, a cursor */
      wire: '<svg viewBox="0 0 88 60"><rect x="3" y="4" width="82" height="52" rx="6"/><path d="M3 18H85"/>' +
        '<rect x="10" y="26" width="30" height="22" rx="3"/><path d="M48 32H78"/><path d="M48 42H68"/></svg>',
      grid: '<svg viewBox="0 0 88 60"><rect x="4" y="4" width="36" height="24" rx="4"/>' +
        '<rect x="48" y="4" width="36" height="24" rx="4"/><rect x="4" y="34" width="36" height="22" rx="4"/>' +
        '<rect x="48" y="34" width="36" height="22" rx="4"/></svg>',
      cursor2: '<svg viewBox="0 0 88 60"><path d="M30 8 L30 44 L40 34 L47 50 L54 47 L47 32 L60 30 Z"/>' +
        '<path d="M12 14a20 20 0 0 1 20-8"/></svg>',
      flask: '<svg viewBox="0 0 88 60"><path d="M36 6v18L20 50a5 5 0 0 0 4 8h40a5 5 0 0 0 4-8L52 24V6"/>' +
        '<path d="M32 6h24"/><path d="M28 40h32"/></svg>',
      /* education */
      grad: '<svg viewBox="0 0 88 60"><path d="M44 10 L80 24 L44 38 L8 24 Z"/><path d="M20 30v14c0 6 11 10 24 10s24-4 24-10V30"/>' +
        '<path d="M80 24v16"/></svg>',
      /* a screw going in */
      screw: '<svg viewBox="0 0 88 60"><path d="M44 6v14"/><path d="M30 20h28l-4 10H34z"/>' +
        '<path d="M36 32h16l-2 8H38z"/><path d="M40 42h8l-4 12z"/></svg>',
      /* a house for the estate agents */
      house: '<svg viewBox="0 0 88 60"><path d="M12 28 L44 6 L76 28"/><path d="M20 26v28h48V26"/>' +
        '<rect x="38" y="38" width="14" height="16" rx="2"/><path d="M62 12h8v8"/></svg>',
      /* a gallery wall */
      gallery: '<svg viewBox="0 0 88 60"><rect x="6" y="8" width="26" height="34" rx="2"/>' +
        '<rect x="38" y="14" width="20" height="22" rx="2"/><rect x="64" y="8" width="18" height="30" rx="2"/>' +
        '<path d="M6 52h76"/></svg>',
      /* a headset + the world it opens onto */
      vr: '<svg viewBox="0 0 88 60"><rect x="10" y="18" width="68" height="28" rx="10"/>' +
        '<path d="M38 46c3 6 9 6 12 0"/><path d="M10 26H2"/><path d="M78 26h8"/>' +
        '<circle cx="44" cy="10" r="7"/></svg>',
      /* an easel for the art fair */
      easel: '<svg viewBox="0 0 88 60"><rect x="20" y="4" width="48" height="34" rx="2"/>' +
        '<path d="M26 32l10-12 7 8 5-5 14 9"/><path d="M44 38v18"/><path d="M30 58l14-20 14 20"/></svg>',
      /* a broadcast screen for the digital shop */
      tv: '<svg viewBox="0 0 88 60"><rect x="8" y="12" width="72" height="40" rx="5"/>' +
        '<path d="M30 12 L44 2 L58 12"/><path d="M22 56h44"/><path d="M20 24h20"/><path d="M20 34h12"/></svg>',
      /* Tui fly people places */
      travel: '<svg viewBox="0 0 88 60"><circle cx="30" cy="36" r="18"/><path d="M12 36h36"/>' +
        '<path d="M30 18c8 6 8 30 0 36"/><path d="M52 8 L82 22 L64 26 L58 36 L54 24 L44 20 Z"/></svg>',
      /* AXA insure things — a shield, drawn and then ticked */
      shield: '<svg viewBox="0 0 88 60"><path d="M44 4 L72 14v16c0 14-12 24-28 30-16-6-28-16-28-30V14Z"/>' +
        '<path d="M33 30l8 9 15-16"/></svg>'
    };
    Array.prototype.forEach.call(wrap.querySelectorAll('.aglogo'), function (lg) {
      var fx = lg.getAttribute('data-fx'), busy = false;
      lg.addEventListener('click', function (e) {
        e.stopPropagation();
        if (busy) return;
        busy = true;
        if (fx === 'boom') {                                       /* the BBC just goes off */
          celebrate(lg);
          setTimeout(function () { busy = false; }, 1600);
          return;
        }
        var pop = document.createElement('span');
        pop.className = 'agfx';
        pop.innerHTML = AG_FX[fx] || AG_FX.wire;
        lg.appendChild(pop);
        setTimeout(function () {
          pop.classList.add('out');
          setTimeout(function () { pop.remove(); busy = false; }, 440);
        }, 1500);
      });
    });
    /* a tap anywhere on the Super Reel screen pops a heart where you tapped */
    /* THE DESIGN SYSTEM + THREE PHONES (Joe, 2026-09-26): every page with an arrow has its board on the canvas and its own phone below. Pick a
       piece up and the room goes dark but for the piece, the Figma window and the phones; its own phone lifts and its slot pulses, the others
       dim. Drop it there and the screen comes alive; drop it on the wrong phone and it shakes and springs back. */
    (function () { var mon = wrap.querySelector('.srmon'), row = wrap.querySelector('.srphones'); if (!mon || !row) return;
      /* EVEN SPACING (Joe, 2026-09-28): the Figma window, the words and the phones share the height between the header and the NEXT pill with
         the SAME gap above and below the words (it used to be ~7px under the window and ~50px over the phones). Measured on load / resize /
         fonts only (never per frame) and applied as --srgap, the space under the window. The phones' place in the slide is cached for the fade. */
      var srSt = row.closest('.step');
      function srBalance(again) { if (!srSt) return; srSt.style.setProperty('--srgap', '0px'); if (!again) srSt.style.removeProperty('--figw');
        var cap = srSt.querySelector(':scope > .cap'), txt = [].slice.call(srSt.querySelectorAll(':scope > .cap, :scope > .sub, :scope > .myhint')); if (!cap) return;
        var S0 = srSt.getBoundingClientRect(), M = mon.getBoundingClientRect(), C = cap.getBoundingClientRect(), Rw = row.getBoundingClientRect(), lastB = C.bottom;
        txt.forEach(function (e) { var r = e.getBoundingClientRect(); if (r.height) lastB = Math.max(lastB, r.bottom); });
        var textH = lastB - C.top, gap = (Rw.top - 10 - M.bottom - textH) / 2;   /* -10: the phones' float and tilt reach a little above the row */
        if (gap < 20 && !again && mon.offsetWidth > 320) {   /* short screens (1366 x 768): the window gives up the height the gaps need (its height is ~.25 of its width, tilt included) */
          srSt.style.setProperty('--figw', Math.max(320, Math.round(mon.offsetWidth - (20 - gap) * 2 / 0.285)) + 'px'); return srBalance(true); }
        gap = Math.max(10, gap);
        srSt.style.setProperty('--srgap', Math.round(M.bottom + gap - C.top) + 'px'); srSt._srRow = row; srSt._srRowY = Rw.top - S0.top; srSt._srA = null; }
      var srGo = function () { srBalance(false); }; srGo(); jjOn(window, 'resize', srGo); jjOn(window, 'load', srGo); if (document.fonts && document.fonts.ready) document.fonts.ready.then(srGo);
      var done = {}, pgs = Array.prototype.slice.call(mon.querySelectorAll('.pg.hot')), phones = Array.prototype.slice.call(row.querySelectorAll('.srphone'));
      function phoneOf(k) { return row.querySelector('.srphone[data-pg="' + k + '"]'); }
      function pick(k) { pgs.forEach(function (g) { var me = g.getAttribute('data-pg') === k; g.classList.toggle('on', me); if (me) g.classList.add('seen'); }); Array.prototype.forEach.call(mon.querySelectorAll('.mboard'), function (b) { b.classList.toggle('on', b.getAttribute('data-pg') === k); });
        phones.forEach(function (p) { p.classList.toggle('hint', !!k && p.getAttribute('data-pg') === k && !done[k]); }); }
      /* ONE PAGE AT A TIME (Joe, 2026-09-30): the canvas shows the page picked in the list; it opens on Wanda v2, and the other two real pages
         keep their pink prompt arrow (white, larger text) until they have been opened */
      pgs.forEach(function (g) { g.addEventListener('click', function (e) { e.stopPropagation(); pick(g.getAttribute('data-pg')); }); });
      pick('wanda'); phones.forEach(function (p) { p.classList.remove('hint'); });
      function land(k, comp) { window.jjSay && window.jjSay('aha-nice'); var sp = phoneOf(k), sc = sp.querySelector('.srscr'), slot = sc.querySelector('.slot'); done[k] = true; comp.classList.add('taken');
        var drawn = comp.querySelector('.cstack,.ctile,.csearch').cloneNode(true); slot.appendChild(drawn); sc.classList.add('done'); slot.classList.remove('over'); sp.classList.remove('hint');
        mon.querySelector('.pg[data-pg="' + k + '"]').classList.add('done');
        try { party(slot, { sound: false, glyphs: ['✨', '⭐'] }); } catch (e) {}
        var wnd = wrap.querySelector('.srwanda'); if (wnd && wnd.play) { try { wnd.currentTime = 0; wnd.play(); } catch (e) {} }
        if (done.reel && done.trip && done.wanda && window.jjScore) window.jjScore.award('handoff'); }
      var sdim = document.createElement('i'); sdim.id = 'jjms-sdim'; document.getElementById('jjms').appendChild(sdim);
      function dimOn(o, k) { document.documentElement.classList.toggle('jjms-sdrag', o); phones.forEach(function (p) { var mine = p.getAttribute('data-pg') === k; p.classList.toggle('want', o && mine); p.classList.toggle('nope', o && !mine); }); }
      Array.prototype.forEach.call(mon.querySelectorAll('.comp'), function (comp) { var k = comp.getAttribute('data-pg'), ghost = null, sx = 0, sy = 0, moved = false;
        var gw = 0, gh = 0, PR = [], SR = null, over = null;   /* the ghost's size and every phone's box are read once per drag, never between writes */
        function ghostAt(x, y) { ghost.style.transform = 'translate(' + (x - gw / 2) + 'px,' + (y - gh / 2) + 'px)'; }
        function hitAt(x, y) { for (var q = 0; q < PR.length; q++) { var r = PR[q].r; if (x >= r.left - 18 && x <= r.right + 18 && y >= r.top - 18 && y <= r.bottom + 18) return PR[q].k; } return null; }
        function mk() { killGhosts(); ghost = document.createElement('span'); ghost.className = 'sdrag'; ghost.innerHTML = comp.querySelector('.cstack,.ctile,.csearch').outerHTML; document.getElementById('jjms').appendChild(ghost);
          PR = phones.map(function (p) { return { k: p.getAttribute('data-pg'), r: p.querySelector('.srclip').getBoundingClientRect() }; }); SR = phoneOf(k).querySelector('.slot').getBoundingClientRect();
          gw = ghost.offsetWidth; gh = ghost.offsetHeight; dimOn(true, k); }
        function home(shake) { var g = ghost; ghost = null; if (!g) return; var cr = comp.getBoundingClientRect();
          if (shake) { g.classList.add('shake'); setTimeout(function () { g.style.transition = 'transform .45s cubic-bezier(.34,1.3,.64,1)'; g.style.transform = 'translate(' + (cr.left + cr.width / 2 - gw / 2) + 'px,' + (cr.top + cr.height / 2 - gh / 2) + 'px)'; }, 380); setTimeout(function () { g.remove(); }, 900); }
          else { g.style.transition = 'transform .45s ease'; g.style.transform = 'translate(' + (cr.left + cr.width / 2 - gw / 2) + 'px,' + (cr.top + cr.height / 2 - gh / 2) + 'px)'; setTimeout(function () { g.remove(); }, 460); } }
        function finish(x, y) { var hit = hitAt(x, y), slot = phoneOf(k).querySelector('.slot'); slot.classList.remove('over');
          if (hit === k) { land(k, comp); if (ghost) ghost.remove(); ghost = null; }
          else if (hit) { var bad = phoneOf(hit); bad.classList.remove('bump'); void bad.offsetWidth; bad.classList.add('bump'); setTimeout(function () { bad.classList.remove('bump'); }, 450); home(true); }
          else home(false);
          dimOn(false); }
        comp.addEventListener('pointerdown', function (e) { if (comp.classList.contains('taken')) return; e.preventDefault(); e.stopPropagation(); pick(k); sx = e.clientX; sy = e.clientY; moved = false; over = null; mk(); ghost.style.transition = 'none'; ghostAt(e.clientX, e.clientY); comp.setPointerCapture(e.pointerId); });
        comp.addEventListener('pointermove', function (e) { if (!ghost) return; if (Math.hypot(e.clientX - sx, e.clientY - sy) > 6) moved = true; ghostAt(e.clientX, e.clientY); var h = hitAt(e.clientX, e.clientY) === k; if (h !== over) { over = h; phoneOf(k).querySelector('.slot').classList.toggle('over', h); } });
        comp.addEventListener('pointerup', function (e) { if (!ghost) return; e.stopPropagation();
          if (!moved && SR) { var g = ghost; g.classList.add('fly'); g.style.transition = ''; ghostAt(SR.left + SR.width / 2, SR.top + SR.height / 2); setTimeout(function () { ghost = g; finish(SR.left + SR.width / 2, SR.top + SR.height / 2); }, 620); ghost = g; return; }   /* a tap sends it across on its own (touch) */
          finish(e.clientX, e.clientY); });
        comp.addEventListener('pointercancel', function () { if (ghost) ghost.remove(); ghost = null; dimOn(false); });
        comp.addEventListener('lostpointercapture', function () { if (ghost && !ghost.classList.contains('fly')) { home(false); dimOn(false); } }); });
      /* a stray drag copy must never outlive its drag (Joe saw the Etihad ticket stuck over the awards slide): clear every one on a new
         drag, and whenever the page scrolls away from this slide */
      function killGhosts() { Array.prototype.forEach.call(document.querySelectorAll('#jjms .sdrag'), function (g) { g.remove(); }); }
      var srStep = mon.closest('.step');
      jjOn(window, 'scroll', function () { if (!document.querySelector('#jjms .sdrag')) return; var r = srStep.getBoundingClientRect(); if (r.bottom < innerHeight * 0.35 || r.top > innerHeight * 0.65) { killGhosts(); dimOn(false); } }, { passive: true });
      })();
    Array.prototype.forEach.call(wrap.querySelectorAll('.srphone'), function (sp) {
      var clip = sp.querySelector('.srclip');
      /* THE FEED IS YOURS (Joe, 2026-09-18: the Super Reel slide was too empty). The reel is driven by code now: it advances on its own
         every 4.25s, but a wheel or a drag on the handset flicks it up or down, and it waits six seconds after you touch it. */
      var track = sp.querySelector('.srtrack'), bar = sp.querySelector('.srbar i'), idx = 0, held = 0, N = 4; if (track) { track.classList.add('js');   /* (the three design-system phones have no feed: only the peeks and the hearts below) */
      function show(i) { idx = (i + N) % N; track.style.transform = 'translateY(' + (-idx * 20) + '%)'; if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; } }
      setInterval(function () { var st = sp.closest('.step'); if (!st || !st.classList.contains('live') || Date.now() - held < 6000) return; show(idx + 1); }, 4250);
      sp.addEventListener('wheel', function (e) { e.preventDefault(); e.stopPropagation(); if (Date.now() - (sp._wl || 0) < 450) return; sp._wl = Date.now(); held = Date.now(); show(idx + (e.deltaY > 0 ? 1 : -1)); }, { passive: false });
      var py = null; sp.addEventListener('pointerdown', function (e) { py = e.clientY; }); sp.addEventListener('pointerup', function (e) { if (py == null) return; var dy = e.clientY - py; py = null; if (Math.abs(dy) > 28) { held = Date.now(); sp._swiped = 1; show(idx + (dy < 0 ? 1 : -1)); } }); }
      /* the search box: ask it for the secret and it says no */
      var srch = sp.querySelector('.srsearch'), srq = sp.querySelector('.srq');
      if (srch) srch.addEventListener('click', function (e) { e.stopPropagation(); if (srch._busy) return; srch._busy = 1; held = Date.now(); var q = 'the secret', i = 0; srq.textContent = '';
        var iv = setInterval(function () { srq.textContent = q.slice(0, ++i); if (i >= q.length) { clearInterval(iv); setTimeout(function () { srq.textContent = '0 results. Nice try.'; srq.classList.add('no'); }, 500); setTimeout(function () { srq.textContent = ''; srq.classList.remove('no'); srch._busy = 0; }, 3200); } }, 90); });
      /* two aliens live behind the handset. Now and then one peeks out; bring the cursor near and it ducks */
      var peeks = Array.prototype.slice.call(sp.querySelectorAll('.srpeek')), pk = 0;
      if (peeks.length) (function peek() { var st = sp.closest('.step'); var wait = 4000 + Math.random() * 5000;
        if (st && st.classList.contains('live')) { var a = peeks[pk++ % peeks.length]; a.classList.add('on'); setTimeout(function () { a.classList.remove('on'); }, 2600); }
        setTimeout(peek, wait); })();
      jjOn(document, 'mousemove', function (e) { for (var i = 0; i < peeks.length; i++) { var a = peeks[i]; if (!a.classList.contains('on')) continue; var r = a.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        if (Math.hypot(e.clientX - cx, e.clientY - cy) < Math.max(70, r.width)) { a.classList.remove('on'); a.classList.add('duck'); setTimeout(function () { a.classList.remove('duck'); }, 600); } } }, { passive: true });
      sp.addEventListener('click', function (e) {
        e.stopPropagation(); if (sp._swiped) { sp._swiped = 0; return; }
        var r = clip.getBoundingClientRect();
        var h = document.createElement('span');
        h.className = 'srheart';
        h.style.left = ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%';
        h.style.top = ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%';
        h.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.6-9.2-8.6C1 8 2.6 4.6 6 4.6c2.2 0 3.4 1.2 6 3.8 2.6-2.6 3.8-3.8 6-3.8 3.4 0 5 3.4 3.2 6.8C19 15.4 12 20 12 20z"/></svg>';
        clip.appendChild(h);
        setTimeout(function () { h.remove(); }, 950);
      });
    });
    /* a prod makes a studio mark jump — the class comes straight back off so the drift resumes */
    Array.prototype.forEach.call(wrap.querySelectorAll('.glogo'), function (lg) {
      var inner = lg.querySelector('.lgin');
      lg.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!inner || inner.classList.contains('pop')) return;
        inner.classList.add('pop');
        setTimeout(function () { inner.classList.remove('pop'); }, 870);
      });
    });
    /* The film already plays right here at full size, so pressing it opens nothing — it just lets
       it speak. No button either: the whole thing is the switch. */
    Array.prototype.forEach.call(wrap.querySelectorAll('.gvid'), function (gv) {
      var v = gv.querySelector('video');
      gv.addEventListener('click', function (e) {
        e.stopPropagation();
        v.muted = !v.muted;
        gv.classList.toggle('loud', !v.muted);
        if (v.muted) unduckMusic(); else duckMusic();                /* the soundtrack yields to the film */
        var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
      });
    });
    /* the looping preview only runs while its screen is actually in view */
    Array.prototype.forEach.call(wrap.querySelectorAll('.jjphone video'), function (v) {
      if (!window.IntersectionObserver) { v.play && v.play().catch(function () {}); return; }
      var want = false;
      function tryPlay() {
        if (!want) return;
        var pr = v.play();
        if (pr && pr.catch) pr.catch(function () { v.addEventListener('canplay', tryPlay, { once: true }); });
      }
      new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          want = en.isIntersecting;
          if (want) tryPlay(); else { try { v.pause(); } catch (e1) {} }
        });
      }, { threshold: 0.25 }).observe(v);
    });
    /* the phone opens the demo big (with sound + controls); the underlined project name opens the
       case-study overview. Both stopPropagation so the document handler doesn't treat it as a close. */
    Array.prototype.forEach.call(wrap.querySelectorAll('.jjphone'), function (ph2) {
      ph2.addEventListener('click', function (e) {
        e.stopPropagation();
        closeAny();
        openVideo(ph2);
      });
    });
    Array.prototype.forEach.call(wrap.querySelectorAll('.sub .funk[data-img]'), function (fk) {
      fk.addEventListener('click', function (e) {
        e.stopPropagation();
        closeAny();
        openShot(SB + fk.getAttribute('data-img'), fk.getAttribute('data-cap') || '');
      });
    });
    function celebrate(el) {
      if (el.classList.contains('popped')) return;
      el.classList.add('popped');
      party(el, { sound: false, glyphs: ['\ud83c\udf89', '\ud83c\udf93', '\u2728', '\ud83c\udfc6'],
        cols: ['#FFD028', '#FFB01F', '#FF9E1B', '#FFE785', '#8FD3FF', '#FF6FE8', '#FFFFFF'] });
      setTimeout(function () { el.classList.remove('popped'); }, 1600);
    }
    Array.prototype.forEach.call(wrap.querySelectorAll('.cap .hotword,.jjtrophy'), function (el) {
      el.addEventListener('click', function (e) { e.stopPropagation(); celebrate(el); });
    });
    /* Each skill does something small and relevant when you prod it. Everything is torn down after
       it plays, so nothing accumulates however many times they're clicked. */
    var FX_TYPED = {
      binary: '10011011',
      type: '<title>Joe’s Journey</title>'
    };
    var FX_SVG = {
      /* the J swirl from the logo, drawing itself */
      swirl: '<svg class="fxsvg swirlfx" viewBox="0 0 82 64" aria-hidden="true">' +
        '<path d="M55 8 L55 40 a13 13 0 0 1-26 0 a13 13 0 0 1 20-10 a22 22 0 0 0-32 6"/>' +
        '<path d="M46 8 H64"/></svg>',
      /* three colour dabs landing, Photoshop-style */
      paint: '<svg class="fxsvg paint" viewBox="0 0 82 48" aria-hidden="true">' +
        '<circle class="dab d1" cx="22" cy="26" r="11"/><circle class="dab d2" cx="41" cy="19" r="11"/>' +
        '<circle class="dab d3" cx="59" cy="28" r="11"/></svg>',
      /* a clip being scrubbed along a timeline */
      clip: '<svg class="fxsvg clipfx" viewBox="0 0 82 48" aria-hidden="true">' +
        '<rect class="strip" x="4" y="12" width="74" height="24" rx="3"/>' +
        '<path class="perf" d="M4 18h74M4 30h74"/>' +
        '<rect class="head" x="8" y="6" width="3" height="36" rx="1.5"/></svg>',
      /* a build running, then a tick */
      build: '<svg class="fxsvg buildfx" viewBox="0 0 82 48" aria-hidden="true">' +
        '<rect class="bar" x="6" y="20" width="70" height="9" rx="4.5"/>' +
        '<rect class="fill" x="6" y="20" width="70" height="9" rx="4.5"/>' +
        '<path class="tick" d="M32 12l6 7 12-13"/></svg>',
      /* a wireframe sketching itself */
      draw: '<svg class="fxsvg draw" viewBox="0 0 82 48" aria-hidden="true">' +
        '<rect x="3" y="3" width="76" height="42" rx="7"/><path d="M3 16 H79"/>' +
        '<rect x="10" y="24" width="28" height="14" rx="4"/>' +
        '<path d="M46 27 H72"/><path d="M46 35 H64"/></svg>',
      /* a trend line climbing, then its arrow head */
      chart: '<svg class="fxsvg chart" viewBox="0 0 82 48" aria-hidden="true">' +
        '<path d="M5 42 L23 33 L38 36 L54 20 L75 7"/><path d="M62 7 H75 V20"/>' +
        '<path d="M5 46 H77"/></svg>',
      /* a pointer arriving and clicking */
      cursor: '<svg class="fxsvg cursor" viewBox="0 0 82 48" aria-hidden="true">' +
        '<circle class="rip" cx="46" cy="22" r="7"/>' +
        '<path class="ptr" d="M33 8 L33 31 L39 25 L43 34 L47 32 L43 24 L51 23 Z"/></svg>'
    };
    Array.prototype.forEach.call(wrap.querySelectorAll('.stag[data-fx]'), function (tag) {
      var fx = tag.getAttribute('data-fx'), pill = tag.querySelector('.sin'), busy = false;
      tag.addEventListener('click', function (e) {
        e.stopPropagation();                                       /* not a "click anywhere to close" */
        if (busy) return;
        busy = true;
        if (fx === 'bounce' || fx === 'spin') {                    /* the pill itself performs */
          var cls = fx === 'bounce' ? 'fx-bounce' : 'fx-spin', ms = fx === 'bounce' ? 900 : 1000;
          pill.classList.add(cls);
          setTimeout(function () { pill.classList.remove(cls); busy = false; }, ms);
          return;
        }
        var typed = tag.getAttribute('data-txt') || FX_TYPED[fx];
        var pop = document.createElement('span');
        pop.className = 'fxpop' + (typed ? ' mono' : '');
        tag.appendChild(pop);
        function kill() {
          pop.classList.add('out');
          setTimeout(function () { pop.remove(); busy = false; }, 440);
        }
        if (typed) {                                               /* typed a character at a time */
          var txt = typed, n = 0;
          var iv = setInterval(function () {
            pop.textContent = txt.slice(0, ++n);
            if (n >= txt.length) { clearInterval(iv); setTimeout(kill, 950); }
          }, 55);
        } else {
          pop.innerHTML = FX_SVG[fx];
          setTimeout(kill, 1500);
        }
      });
    });
    /* the philosopher is thinking until you prod him, then he's happy for 4 seconds and goes back to
       it. He owns his own click (photoUnder skips `.deco`, and stopPropagation keeps the document
       handler from treating the prod as a "click anywhere to close"). */
    Array.prototype.forEach.call(wrap.querySelectorAll('.phw.deco[data-alt]'), function (el) {
      var im = el.querySelector('img'), think = im.getAttribute('src'),
          happy = SB + el.getAttribute('data-alt'), back = null, fade = null;
      var pre = new Image(); pre.src = happy;                      /* cached, so the swap can't flash */
      function show(src) {
        if (im.getAttribute('src') === src) return;
        clearTimeout(fade);
        el.classList.add('swap');                                  /* fade out, change face, fade in */
        fade = setTimeout(function () { im.setAttribute('src', src); el.classList.remove('swap'); }, 240);
      }
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        show(happy);
        clearTimeout(back); back = setTimeout(function () { show(think); }, 4000);
      });
    });
    /* travel cards get their own click (they aren't `.phw`, so photoUnder never sees them) */
    Array.prototype.forEach.call(wrap.querySelectorAll('.trav'), function (t) {
      t.addEventListener('click', function (e) {
        e.stopPropagation();                                          /* don't let the document handler close it again */
        if (collOpen) { closeColl(); return; }
        closeAny(); openColl(t);
      });
    });
    closeBtn.addEventListener('click', function (e) { e.stopPropagation(); closeAny(); });
    scrim.addEventListener('click', function (e) { e.stopPropagation(); closeAny(); });   /* click the dimmed backdrop = close */
    player.addEventListener('click', function (e) { e.stopPropagation(); });              /* clicks on the player itself stay put */
    jjOn(document, 'keydown', function (e) { if (e.key === 'Escape') closeAny(); });
    jjOn(document, 'click', function (e) {
      if (document.body.classList.contains('jj-modal-open')) return;
      if (quizOpen || !wrap.contains(e.target)) return;   /* the score's own cards live outside the story: their Continue used to bubble here and shut the exam (Joe, 2026-09-18) */
      if (e.target.closest('#jjms-nav,#jjms-next,.cap,#jj-sound-btn,#jj-sound-mist')) return;   /* chrome, headline and the sound moon stay out of it */
      var ph = photoUnder(e.clientX, e.clientY);
      if (ph && ph.classList.contains('like')) { var lk = ph.querySelector('.phd'), lr = lk.getBoundingClientRect(), hh = document.createElement('span'); hh.className = 'srheart'; hh.style.left = ((e.clientX - lr.left) / lr.width * 100).toFixed(1) + '%'; hh.style.top = ((e.clientY - lr.top) / lr.height * 100).toFixed(1) + '%';
        hh.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.6-9.2-8.6C1 8 2.6 4.6 6 4.6c2.2 0 3.4 1.2 6 3.8 2.6-2.6 3.8-3.8 6-3.8 3.4 0 5 3.4 3.2 6.8C19 15.4 12 20 12 20z"/></svg>'; lk.appendChild(hh); setTimeout(function () { hh.remove(); }, 950); return; }   /* the LinkedIn post: a press is a like */
      var onceEl = wrap.querySelector('.step.live .phw .phonce'); if (onceEl) { var orr = onceEl.getBoundingClientRect(); if (e.clientX >= orr.left && e.clientX <= orr.right && e.clientY >= orr.top && e.clientY <= orr.bottom) { if (onceEl._src) { try { onceEl.currentTime = 0; var rp = onceEl.play(); if (rp && rp.catch) rp.catch(function () {}); } catch (x) {} } return; } }   /* prod the wizard: he does it again */
      var wasBlown = blownEl, wasPlaying = playing, wasColl = collOpen;
      closeAny();                                                    /* any click first puts the current one back */
      if (!ph || ph === wasBlown) return;
      if (ph.getAttribute('data-trav')) {                            /* a travel collection fans out */
        if (!wasColl) openColl(ph);
      } else if (ph.getAttribute('data-vid') || ph.getAttribute('data-yt')) {   /* a video card opens the player */
        if (!wasPlaying) { openVideo(ph); flyOff(flyEnter); }
      } else if (ph.classList.contains('skl')) {                     /* the skills set opens as one board */
        openSkills();
      } else {                                                       /* every other picture blows up too */
        blowUp(ph);
        flyOff(flyEnter);                                            /* the sprite zooms off, then flies back */
      }
    });

    /* ================= v2 SLIDES (Joe, 2026-09-24) — built from the slide-protos prototypes =================
       GAMES (step flagged `games`): a PRESS START screen, then the covers deal in face down, flip to their PHOTOS[1] spots and keep
       floating; a cover opens a CRT telly carrying the live IGN card. CINEMA (`cinema`): the posters of PHOTOS[3] on a lit wall under
       a marquee letter board (the real .cap is the board's text); a poster dims the house lights and parts the curtains.
       ATLAS (`atlas`): a parchment map with every stop pinned as an unstamped seal and a docked passport, kept in sync; the region
       photos open in the travel set modal (openColl). The clippings set ('np', CLUSTERS) opens in the same modal with its
       highlights + zoom strips (see openColl). Every piece lazy-loads its images when its slide is within a screen and a half. */
    var v2Close = null;
    function jjmsStepOf(flag) { for (var i = 0; i < STEPS.length; i++) if (STEPS[i][flag]) return steps[i]; return null; }   /* a slide by its flag, never by its number */
    (function v2() {
      if (!document.getElementById('jjms-v2fonts')) { var fl = document.createElement('link'); fl.id = 'jjms-v2fonts'; fl.rel = 'stylesheet';
        fl.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Oswald:wght@500&family=Press+Start+2P&family=Special+Elite&display=swap'; document.head.appendChild(fl); }
      var hydrateIO = window.IntersectionObserver ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; hydrateIO.unobserve(e.target);
        Array.prototype.forEach.call(e.target.querySelectorAll('img[data-src]'), function (im) { im.src = im.getAttribute('data-src'); im.removeAttribute('data-src'); }); }); }, { rootMargin: '150% 0px 150% 0px' }) : null;
      function lazy(stepEl) { if (hydrateIO) hydrateIO.observe(stepEl); else Array.prototype.forEach.call(stepEl.querySelectorAll('img[data-src]'), function (im) { im.src = im.getAttribute('data-src'); }); }
      var closers = [];
      v2Close = function () { closers.forEach(function (f) { f(); }); };
      function stepOf(flag) { for (var i = 0; i < STEPS.length; i++) if (STEPS[i][flag]) return steps[i]; return null; }
      function isCur(el) { return el && el.classList.contains('cur'); }
      function modalBusy() { return document.body.classList.contains('jj-modal-open') || collOpen || document.documentElement.classList.contains('jjms-lb'); }

      /* ---------------- GAMES ---------------- */
      (function () {
        var st = stepOf('games'); if (!st) return; var idx = steps.indexOf(st), G = PHOTOS[idx] || [];
        var box = document.createElement('div'); box.className = 'jjg';
        G.forEach(function (g, i) {
          var c = document.createElement('button'); c.type = 'button'; c.className = 'jjg-card'; c.setAttribute('data-cursor', 'hover'); c.setAttribute('aria-label', g.cap || 'Game');
          if (g.jig) c.setAttribute('data-jig', '1');
          c.style.cssText = 'left:' + g.x + '%;top:' + g.y + '%;width:' + g.w + 'vw;--dx:' + (.25 + (i * 37 % 10) / 25).toFixed(2) + 'vw;--dy:' + (.5 + (i * 53 % 10) / 20).toFixed(2) + 'vh;--dr:' + ((i % 2 ? 1 : -1) * (1 + (i * 29 % 10) / 10)).toFixed(1) + 'deg;--bd:' + (10 + (i * 71 % 7)) + 's;--bdl:-' + ((i * 2.3) % 9).toFixed(1) + 's';
          c.innerHTML = '<span class="in"><span class="f"><img data-src="' + SB + g.src + '" alt="" decoding="async"></span><span class="b"></span></span>';
          c.addEventListener('click', function (e) { e.stopPropagation(); if (!started) { start(); return; } openTV(i, c); });
          box.appendChild(c);
        });
        var sb = document.createElement('button'); sb.type = 'button'; sb.className = 'jjg-start'; sb.setAttribute('data-cursor', 'hover'); sb.setAttribute('aria-label', 'Press start to deal the games');
        sb.innerHTML = '<span class="p1">JOE’S JOURNEY · LEVEL 1</span><span class="t">THE GAMES</span><span class="ps">PRESS START</span><span class="cr">© 1995 JOE   CLICK, TAP OR PRESS ENTER</span>';
        box.appendChild(sb); st.appendChild(box); st.classList.add('v2', 'v2games', 'jjg-wait'); lazy(st);
        var cards = [].slice.call(box.querySelectorAll('.jjg-card')), started = false, armT = null;
        function stack() {   /* every card waits face down in a deck at the bottom centre of the slide */
          var sr = st.getBoundingClientRect();
          cards.forEach(function (c, i) { var dx = sr.width / 2 - (c.offsetLeft + c.offsetWidth / 2), dy = sr.height * 1.02 - (c.offsetTop + c.offsetHeight / 2);
            c.firstChild.style.transition = 'none'; c.firstChild.style.transform = 'translate(' + dx.toFixed(0) + 'px,' + (dy - i * 2).toFixed(0) + 'px) rotate(' + ((i % 3 - 1) * 3) + 'deg) rotateY(180deg) scale(.7)'; });
        }
        function start() {
          if (started) return; started = true; clearTimeout(armT);
          sb.classList.add('out'); st.classList.remove('jjg-wait'); stack(); void box.offsetWidth; box.classList.add('go');
          setTimeout(function () { cards.forEach(function (c, i) { var g = G[i], inn = c.firstChild; inn.style.transition = ''; inn.style.transitionDelay = (i * 85) + 'ms'; inn.style.transform = 'rotate(' + g.rot + 'deg)'; });
            setTimeout(function () { box.classList.add('dealt'); cards.forEach(function (c) { c.firstChild.style.transitionDelay = ''; }); }, cards.length * 85 + 1000); }, 380);
        }
        sb.addEventListener('click', function (e) { e.stopPropagation(); start(); });
        /* it waits for the visitor: a click / tap anywhere on the screen, or Enter / Space while the slide is the current one. It never starts by
           itself and stays put if you scroll away and back (Joe, 2026-09-24); scrolling past it is never blocked (it's just a button in the slide). */
        jjOn(document, 'keydown', function (e) { if (started || !isCur(st) || modalBusy() || e.metaKey || e.ctrlKey || e.altKey) return;
          if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') { e.preventDefault(); start(); } });
        /* the telly */
        var tv = document.createElement('div'); tv.id = 'jjms-crt';
        /* JJ TV: the game on Joe's own channel — the J bug, the HUD star + coin, the cover glowing, the headline font, the IGN score as a small badge */
        var ERA = ERAS[STEPS[idx].era] || {}, SCB = window.JJ_SCORE_BASE || SB;
        tv.innerHTML = '<div class="tvset"><span class="ant"></span><div class="tvbody"><div class="scr"><div class="glow">' +
          '<span class="bug"><span class="jm"></span><b>JJ TV</b><i>LIVE</i></span>' +
          '<span class="hud"><img alt="" src="' + SCB + 'score-star.webp"><b class="hst"></b><img alt="" src="' + SCB + 'score-coin.webp"><b>LV 1</b></span>' +
          '<div class="cv"><img alt=""></div><div class="txt">' +
          '<p class="jjd-found"></p><p class="kick">Now playing</p><p class="jjd-title"></p><p class="jjd-note"></p><div class="jjd-extra"></div>' +
          '<span class="jjd-ign"><span class="jjd-ignb">IGN</span><span class="jjd-igns"><i></i></span><b class="jjd-ignn"></b><span class="jjd-out">/5</span></span></div>' +
          '<span class="lower">Joe\u2019s Journey \u00b7 ' + esc(ERA.title || '') + ' \u00b7 ' + esc(ERA.ages || '') + '</span></div></div>' +
          '<div class="panel"><i></i><i></i><b></b></div></div><button type="button" class="x" aria-label="Close">×</button></div>';
        wrap.appendChild(tv);
        var tvOpen = false;
        function openTV(i, c) {
          var g = G[i]; closeAny();
          tv.querySelector('.cv img').src = SB + g.src;
          tv.querySelector('.jjd-title').textContent = g.cap || '';
          tv.querySelector('.jjd-note').textContent = g.note || '';
          var fd = tv.querySelector('.jjd-found'); fd.textContent = g.found || ''; fd.classList.toggle('on', !!g.found);
          var ex = (g.extra || '').split('|'), exh = ''; for (var q = 0; q + 1 < ex.length; q += 2) exh += '<span><img src="' + SB + ex[q] + '" alt=""><em>' + esc(ex[q + 1]) + '</em></span>';
          tv.querySelector('.jjd-extra').innerHTML = exh;
          var stv = g.stars || 4; tv.querySelector('.jjd-igns i').style.width = (stv / 5 * 100) + '%'; tv.querySelector('.jjd-ignn').textContent = stv.toFixed(1); tv.querySelector('.hst').textContent = stv.toFixed(1);
          var jm = tv.querySelector('.jm'); if (!jm.firstChild) { var lg = document.querySelector('.nav-logo'); jm.innerHTML = lg && (lg.currentSrc || lg.src) ? '<img alt="" src="' + (lg.currentSrc || lg.src) + '">' : '<em>J</em>'; }   /* the site's own J mark */
          tv.classList.remove('on'); void tv.offsetWidth; tv.classList.add('on'); tvOpen = true; lightbox(true);
          if (g.award && window.jjScore) window.jjScore.award(g.award);
          if (g.party) setTimeout(function () { try { party(tv.querySelector('.cv'), { sound: false, glyphs: ['⚔️', '🛡️', '✨', '🐉'] }); } catch (eP) {} }, 450);   /* the WoW find: confetti, no sound */
        }
        function closeTV() { if (!tvOpen) return; tvOpen = false; tv.classList.remove('on'); lightbox(false); var pb = document.getElementById('jjms-party'); if (pb) pb.remove(); }
        closers.push(closeTV);
        tv.addEventListener('click', function (e) { e.stopPropagation(); if (!e.target.closest('.tvbody') || e.target.closest('.x')) closeTV(); });
      })();

      /* ---------------- CINEMA ---------------- */
      (function () {
        var st = stepOf('cinema'); if (!st) return; var idx = steps.indexOf(st), F = PHOTOS[idx] || [];
        st.classList.add('v2', 'v2cine'); lazy(st);
        var marq = st.querySelector('.jjc-marq'), mt = st.querySelector('.jjc-mt'), bl = st.querySelector('.jjc-bulbs'), wall = st.querySelector('.jjc-wall');
        if (bl) { var h = '', nb = 44; for (var i = 0; i < nb; i++) { var p = i / nb * 152, x, y; if (p < 60) { x = p / 60 * 100; y = 0; } else if (p < 76) { x = 100; y = (p - 60) / 16 * 100; } else if (p < 136) { x = 100 - (p - 76) / 60 * 100; y = 100; } else { x = 0; y = 100 - (p - 136) / 16 * 100; }
          h += '<i style="left:' + x.toFixed(1) + '%;top:' + y.toFixed(1) + '%;animation-delay:' + (i % 2 ? -.6 : 0) + 's"></i>'; } bl.innerHTML = h; }
        /* the favourite is a surprise: nothing on the wall (no badge, no tooltip, no board text) gives it away — only its title shows on hover */
        wall.innerHTML = F.map(function (f, i) { return '<button type="button" class="jjc-post' + (f.secret ? ' secret' : '') + '" data-i="' + i + '" data-cursor="hover" aria-label="' + (f.secret ? 'A hidden film' : esc(f.title || f.cap || 'Film')) + '"><span class="fr"><img data-src="' + SB + f.src + '" alt="" decoding="async"></span></button>'; }).join('');
        /* the wall waits in the dark until the lights go on (like the games' PRESS START); then the posters come up row by row (Joe, 2026-09-25) */
        var wallw = document.createElement('div'); wallw.className = 'jjc-wallw'; wall.parentNode.insertBefore(wallw, wall); wallw.appendChild(wall); wall.classList.add('dark');
        var lb = document.createElement('button'); lb.type = 'button'; lb.className = 'jjc-lights'; lb.setAttribute('data-cursor', 'hover'); lb.innerHTML = '<span class="bulb"></span>Lights on'; wallw.appendChild(lb);
        function lightsOn(e) { if (e) e.stopPropagation(); if (!wall.classList.contains('dark')) return; lb.classList.add('on');
          var posts = [].slice.call(wall.children), t0 = posts.length ? posts[0].offsetTop : 0, rows = [], row = -1, last = null;
          posts.forEach(function (p) { if (p.offsetTop !== last) { last = p.offsetTop; row++; } rows.push(row); });
          posts.forEach(function (p, i) { p.style.setProperty('--d', (0.35 + rows[i] * 0.28 + (i % 9) * 0.035).toFixed(3) + 's'); });
          setTimeout(function () { wall.classList.remove('dark'); wall.classList.add('lit'); }, 60);
          setTimeout(function () { posts.forEach(function (p) { p.style.removeProperty('--d'); }); wall.classList.remove('lit'); }, 2600); }
        lb.addEventListener('click', lightsOn); wallw.addEventListener('click', function (e) { if (wall.classList.contains('dark')) lightsOn(e); });
        var bT = null, onPost = null;
        function spell(t) { var n = 0; mt.innerHTML = t.toUpperCase().replace(/[‘’]/g, "'").split(' ').map(function (w) { return '<b>' + w.split('').map(function (ch) { var k = n++; return '<i style="--d:' + (k * 22) + 'ms;--r:' + (((k * 7919) % 5 - 2) * .6).toFixed(1) + 'deg">' + esc(ch) + '</i>'; }).join('') + '</b>'; }).join(' '); }
        wall.addEventListener('mouseover', function (e) { var p = e.target.closest('.jjc-post'); if (!p || p === onPost) return; onPost = p; var f = F[+p.getAttribute('data-i')];
          clearTimeout(bT); bT = setTimeout(function () { if (f.secret && !p.classList.contains('found')) { spell('?'); } else spell(f.title || ''); marq.classList.add('swap'); }, 140); });
        wall.addEventListener('mouseleave', function () { onPost = null; clearTimeout(bT); bT = setTimeout(function () { marq.classList.remove('swap'); }, 300); });
        var cine = document.createElement('div'); cine.id = 'jjms-cine';
        cine.innerHTML = '<div class="house"></div><div class="theatre"><div class="screen"><img alt=""><div class="info"><p class="jjd-found">★ You found my favourite ★</p><div class="k">Now showing</div><h2></h2><p class="cq"></p><p class="note"></p>' +
          '<div class="score"><b></b><span>Joe’s score / 10</span></div><div class="k" style="margin-bottom:.5em">Rate it yourself</div><div class="rate"></div><div class="rated"></div></div></div>' +
          '<div class="curtain l"></div><div class="curtain r"></div><div class="pelmet"></div><button type="button" class="x" aria-label="Close" data-cursor="hover"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div>';
        wrap.appendChild(cine);
        var rate = cine.querySelector('.rate'), rated = cine.querySelector('.rated'), mine = 0, cOpen = false, openT = null, STAR = '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"/></svg>';
        for (var s5 = 1; s5 <= 5; s5++) rate.innerHTML += '<button type="button" data-v="' + s5 + '" aria-label="' + s5 + ' stars">' + STAR + '</button>';
        function paint(v) { Array.prototype.forEach.call(rate.children, function (b) { b.classList.toggle('on', +b.getAttribute('data-v') <= v); }); }
        rate.addEventListener('mouseover', function (e) { var b = e.target.closest('button'); if (b) paint(+b.getAttribute('data-v')); });
        rate.addEventListener('mouseleave', function () { paint(mine); });
        rate.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; mine = +b.getAttribute('data-v'); paint(mine); rated.textContent = 'You gave it ' + mine + ' / 5. Noted!'; });
        function openFilm(p) {
          var f = F[+p.getAttribute('data-i')]; closeAny(); marq.classList.remove('swap');
          if (f.secret) p.classList.add('found');
          mine = 0; paint(0); rated.textContent = '';
          cine.querySelector('.screen img').src = SB + f.src;
          cine.querySelector('h2').textContent = f.title || f.cap || '';
          cine.querySelector('.cq').textContent = f.title && f.cap ? '“' + f.cap + '”' : '';
          cine.querySelector('.note').textContent = f.note || '';
          cine.querySelector('.score b').textContent = (parseFloat(f.rating || '8.8')).toFixed(1);
          cine.querySelector('.jjd-found').classList.toggle('on', !!f.party);
          cine.classList.remove('open'); cine.classList.add('on'); cOpen = true; lightbox(true);
          clearTimeout(openT); openT = setTimeout(function () { cine.classList.add('open'); if (f.party) { try { party(cine.querySelector('.screen img')); } catch (eP) {} } }, 650);   /* the favourite's Día de Muertos burst (and its marimba, from this click) as the curtains part */
        }
        function closeFilm() { if (!cOpen) return; cOpen = false; clearTimeout(openT); cine.classList.remove('open'); setTimeout(function () { if (!cOpen) cine.classList.remove('on'); }, 600); lightbox(false);
          var pb = document.getElementById('jjms-party'); if (pb) pb.remove(); stopSound(); unduckMusic(); }
        closers.push(closeFilm);
        Array.prototype.forEach.call(wall.querySelectorAll('.jjc-post'), function (p) { p.addEventListener('click', function (e) { e.stopPropagation(); openFilm(p); }); });
        Array.prototype.forEach.call(wall.querySelectorAll('.jjc-post'), function (p) { if (F[+p.getAttribute('data-i')].party) p.addEventListener('pointerenter', function () { try { sfxEl().load(); } catch (x) {} }, { once: true }); });
        cine.addEventListener('click', function (e) { e.stopPropagation(); if (e.target.closest('.x') || !e.target.closest('.theatre')) closeFilm(); });
      })();

      /* ---------------- ATLAS (both travel slides) ----------------
         atlasOn(step, A) builds a map + docked passport on a slide. Part one (flag atlas: true): the painted old map, every stop a glowing
         pin, the passport opens at Maidenhead and stamps its way round. Part two (flag atlas: 2): the modern map with its Europe inset; the
         same passport, already stamped with part one, flicks through on arrival to 'Visas continued'; the new trips are pins, every other
         country Joe has been to is a small glowing dot, and the route carries on from Vancouver in a second ink. */
      var atlasN = 0;
      function atlasOn(st, A) {
        if (!st) return;
        var PFX = 'jja' + (atlasN++) + '-';
        st.classList.add('v2', 'v2atlas'); if (A.part === 2) st.classList.add('atlas2');   /* a real breath between Super Reel and travel part two (the rule was never applied before) */
        var byKey = function (k) { for (var i = 0; i < CLUSTERS.length; i++) if (CLUSTERS[i].key === k) return CLUSTERS[i]; };
        var REG = A.keys.map(byKey).filter(Boolean), PRE = (A.pre || []).map(byKey).filter(Boolean);
        var place = function (R) { return R.place || R.name; };
        var NS = 'http://www.w3.org/2000/svg', BMP = !!A.img || !!A.neo;
        var box = document.createElement('div'); box.className = 'jja' + (BMP ? ' bmp' : '') + (A.part === 2 ? ' two' : '') + (A.neo ? ' neo' : '');
        if (A.ar) box.style.setProperty('--mar', A.ar);
        box.innerHTML = '<div class="jja-parch"></div><div class="jja-map">' + (A.neo ? '<div class="jja-neo" aria-hidden="true"><canvas class="nmc"></canvas><i class="nscan"></i></div>' : BMP ? '<img class="jja-img" alt="" src="' + SB + A.img + '">' : '') +
          '<svg viewBox="0 0 360 150" preserveAspectRatio="none" aria-hidden="true"><defs>' +
          '<filter id="jjaRough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".35" numOctaves="2" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale=".45"/></filter>' +
          '<filter id="jjaSoft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".7"/></filter>' +
          '<filter id="jjaInk" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" result="d"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 2.05" result="holes"/><feComposite in="d" in2="holes" operator="in"/></filter></defs>' +
          '<g class="grid"></g><g class="shade"></g><g class="land"></g><g class="sea"></g><g class="lanes"></g><g class="deco"></g><g class="route"></g>' +
          '<path class="plane" d="M2.4 0 L-1.2 -.6 L-2.4 -2.1 L-3 -2.1 L-2.1 -.45 L-3.6 -.3 L-4.2 -1.2 L-4.65 -1.2 L-4.2 0 L-4.65 1.2 L-4.2 1.2 L-3.6 .3 L-2.1 .45 L-3 2.1 L-2.4 2.1 L-1.2 .6 Z"/></svg><div class="jja-marks"></div></div>' +
          '<div class="jja-book closed"><div class="board leather"></div></div><div class="jja-count"></div>' +
          '<button type="button" class="jja-arr prev" aria-label="Previous page" data-cursor="hover"><span class="ai">\u2039</span> Back</button><button type="button" class="jja-arr next" aria-label="Next page" data-cursor="hover">Next <span class="ai">\u203a</span></button>';
        st.insertBefore(box, st.firstChild);
        if (BMP && !A.neo) { var bim = box.querySelector('.jja-img'); bim.addEventListener('load', function () { if (bim.naturalWidth) { box.style.setProperty('--mar', (bim.naturalWidth / bim.naturalHeight).toFixed(4)); box.querySelector('.jja-map').style.aspectRatio = bim.naturalWidth + ' / ' + bim.naturalHeight; } }); }   /* the painting sets the map's shape; the pins are in % of it */
        var svg = box.querySelector('svg'), G = function (c) { return svg.querySelector('.' + c); };
        /* the drawn modern map (A.neo, see NEO_MAP): one canvas, painted at the device's own pixel density whenever the map's box settles at a
           new size (never per frame); the scanlines and their slow sweep are a CSS layer over it (transform only) */
        if (A.neo) (function () { var host = box.querySelector('.jja-neo'), cv = host.querySelector('canvas'), mp = box.querySelector('.jja-map'), lw = 0, lh = 0, ldpr = 0, T = 0;
          if (!document.getElementById('jjms-neo-css')) { var cs = document.createElement('style'); cs.id = 'jjms-neo-css';
            cs.textContent = '#jjms .jja.neo .jja-neo{position:absolute;inset:-2%;overflow:hidden;border-radius:2.5% / 4.6%;background:radial-gradient(ellipse 70% 75% at 50% 46%,rgba(18,32,82,.92),rgba(9,16,46,.94) 62%,rgba(6,10,32,.9) 100%);-webkit-mask:linear-gradient(90deg,transparent,#000 3.5%,#000 96.5%,transparent),linear-gradient(transparent,#000 5%,#000 95%,transparent);-webkit-mask-composite:source-in;mask:linear-gradient(90deg,transparent,#000 3.5%,#000 96.5%,transparent),linear-gradient(transparent,#000 5%,#000 95%,transparent);mask-composite:intersect;filter:drop-shadow(0 1.6vh 3vh rgba(0,0,0,.4));}' +
              '#jjms .jja.neo .jja-neo canvas{position:absolute;left:1.923%;top:1.923%;width:96.154%;height:96.154%;display:block;}' +
              '#jjms .jja.neo .nscan{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(180deg,rgba(140,220,255,.045) 0 1px,transparent 1px 3px);}#jjms .jja.neo .nscan::after{content:"";position:absolute;left:0;right:0;top:0;height:34%;background:linear-gradient(180deg,rgba(120,220,255,0),rgba(120,220,255,.09) 50%,rgba(120,220,255,0));transform:translateY(-110%);animation:jjNeoSweep 9s linear infinite;will-change:transform;}' +
              '@keyframes jjNeoSweep{to{transform:translateY(330%);}}@media (prefers-reduced-motion:reduce){#jjms .jja.neo .nscan::after{animation:none;opacity:0;}}' +
              '#jjms .jja.neo .jja-mk .lbl{font:700 clamp(12px,1vw,17px)/1.1 "Joes Journey Headline",Georgia,serif;color:rgba(235,240,255,.9);text-shadow:0 0 6px rgba(255,0,245,.55),0 1px 2px rgba(5,8,25,.95);}#jjms .jja.neo .jja-mk.on .lbl{color:#fff;}' +
              '#jjms .jja.neo .jja-dot{background:radial-gradient(circle,#fff 0,#bdf3ff 35%,#4fd3ff 70%);box-shadow:0 0 6px 2px rgba(79,211,255,.55);}' +
              '#jjms .jja.neo .jja-map .rt{stroke:#7ff3ff;stroke-width:.42;stroke-dasharray:3 2.2;filter:drop-shadow(0 0 .7px rgba(127,243,255,.9));animation:jjNeoFlow 2.6s linear infinite;}#jjms .jja.neo .jja-map .rt.ink2{stroke:#ff4dfa;filter:drop-shadow(0 0 .7px rgba(255,0,245,.9));}' +
              '#jjms .jja.neo .jja-book .cont .leg .ld{background:radial-gradient(circle,#fff 0,#bdf3ff 35%,#2fb8f0 75%);box-shadow:0 0 .4em rgba(79,211,255,.8);}@keyframes jjNeoFlow{to{stroke-dashoffset:-10.4;}}#jjms .jja.neo .jja-map .plane{fill:#bff6ff;filter:drop-shadow(0 0 1px rgba(127,243,255,.9));}@media (prefers-reduced-motion:reduce){#jjms .jja.neo .jja-map .rt{animation:none;}}';
            document.head.appendChild(cs); }
          function bits(b64) { var s = atob(b64), a = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return function (i) { return (a[i >> 3] >> (7 - (i & 7))) & 1; }; }
          var LM = bits(NEO_MAP.main), LI = bits(NEO_MAP.inset.mask), I = NEO_MAP.inset;
          function hs(i) { var x = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return x - Math.floor(x); }
          function dots(c, x0, y0, w, h, cols, rows, land, seaA) { var pw = w / cols, ph = h / rows, r = Math.min(pw, ph) * 0.3, i, row, col;
            c.fillStyle = 'rgba(120,190,255,' + seaA + ')';   /* the sea: a faint matrix of its own */
            for (row = 0; row < rows; row++) for (col = 0; col < cols; col++) if (!land(row * cols + col)) c.fillRect(x0 + (col + .5) * pw - r * .35, y0 + (row + .5) * ph - r * .35, r * .7, r * .7);
            for (i = 0; i < 4; i++) { c.beginPath(); c.fillStyle = ['rgba(90,170,255,.55)', 'rgba(110,205,255,.72)', 'rgba(150,225,255,.88)', 'rgba(220,250,255,.98)'][i];   /* the land in four brightnesses, scattered */
              for (row = 0; row < rows; row++) for (col = 0; col < cols; col++) { var k = row * cols + col; if (!land(k)) continue; var v = hs(k), b = v < .45 ? 0 : v < .8 ? 1 : v < .96 ? 2 : 3; if (b !== i) continue;
                var x = x0 + (col + .5) * pw, y = y0 + (row + .5) * ph; c.moveTo(x + r, y); c.arc(x, y, r * (b === 3 ? 1.15 : 1), 0, 6.2832); }
              c.fill(); } }
          function draw() { var w = cv.clientWidth, h = cv.clientHeight, dpr = Math.min(2.5, window.devicePixelRatio || 1); if (!w || !h || (w === lw && h === lh && dpr === ldpr)) return; lw = w; lh = h; ldpr = dpr;
            cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); var c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h);
            c.lineWidth = 1; c.strokeStyle = 'rgba(120,200,255,.08)'; c.beginPath();   /* the graticule: every 30 degrees */
            for (var lo = -150; lo <= 150; lo += 30) { var gx = (lo + 180) / 360 * w; c.moveTo(gx, 0); c.lineTo(gx, h); }
            [-60, -30, 30, 60].forEach(function (la) { var gy = neoMain(0, la)[1] / 100 * h; c.moveTo(0, gy); c.lineTo(w, gy); }); c.stroke();
            c.strokeStyle = 'rgba(255,0,245,.12)'; c.beginPath(); var eq = neoMain(0, 0)[1] / 100 * h; c.moveTo(0, eq); c.lineTo(w, eq); c.stroke();   /* the equator in the brand pink */
            c.strokeStyle = 'rgba(120,220,255,.07)'; c.lineWidth = 1.2; [[.62, .44, .52, .3, -.25], [.4, .58, .62, .26, .18], [.8, .3, .3, .2, .5]].forEach(function (o) { c.beginPath(); c.ellipse(o[0] * w, o[1] * h, o[2] * w, o[3] * h, o[4], .3, 2.6); c.stroke(); });   /* a few orbit arcs */
            dots(c, 0, 0, w, h, NEO_MAP.cols, NEO_MAP.rows, LM, .07);
            var b = I.box, ix = b[0] / 100 * w, iy = b[1] / 100 * h, iw = b[2] / 100 * w, ih = iw / I.ar, rad = Math.min(14, iw * .05);   /* the Europe close-up */
            c.save(); c.shadowColor = 'rgba(80,200,255,.35)'; c.shadowBlur = 18; c.fillStyle = 'rgba(6,12,34,.94)'; c.beginPath(); if (c.roundRect) c.roundRect(ix, iy, iw, ih, rad); else c.rect(ix, iy, iw, ih); c.fill(); c.restore();
            c.save(); c.beginPath(); if (c.roundRect) c.roundRect(ix, iy, iw, ih, rad); else c.rect(ix, iy, iw, ih); c.clip(); dots(c, ix, iy, iw, ih, I.cols, I.rows, LI, .06); c.restore();
            c.lineWidth = 1; c.strokeStyle = 'rgba(127,220,255,.4)'; c.beginPath(); if (c.roundRect) c.roundRect(ix + .5, iy + .5, iw - 1, ih - 1, rad); else c.rect(ix + .5, iy + .5, iw - 1, ih - 1); c.stroke();
            c.fillStyle = 'rgba(200,240,255,.75)'; c.font = '700 ' + Math.max(10, Math.round(iw * .055)) + 'px "Joes Journey Headline",Georgia,serif'; c.fillText('Europe', ix + iw * .05, iy + ih - iw * .045); }
          function soon() { clearTimeout(T); T = setTimeout(draw, 160); }   /* the map's box glides when the passport opens: paint once it settles */
          /* m-1008a: drawn when its slide comes within a screen and a half, not at build (it was a 1138x618 x DPR canvas alive from the first frame of the page) */
          var near0 = !('IntersectionObserver' in window), draw0 = draw; draw = function () { if (near0) draw0(); };
          if (!near0) { var nio = new IntersectionObserver(function (es) { if (es[es.length - 1].isIntersecting) { near0 = true; nio.disconnect(); lw = 0; draw0(); } }, { rootMargin: '150% 0px 150% 0px' }); nio.observe(box.closest('.step') || cv); }
          draw(); if (window.ResizeObserver) new ResizeObserver(soon).observe(cv); else jjOn(window, 'resize', soon);
          if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { lw = 0; draw(); });
        })();
        function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
        function X(lon) { var x = lon + 160; if (x < -20) x += 360; return x; } function Y(lat) { return 75 - lat; }
        if (!BMP) {   /* the drawn map: rough continents smoothed through their midpoints, a graticule, waves, sea lanes and a compass rose */
          ATLAS_LAND.forEach(function (poly) {
            var P = poly.map(function (q) { return [X(q[0]), Y(q[1])]; }), n = P.length, M = function (a, b) { return ((a[0] + b[0]) / 2).toFixed(2) + ',' + ((a[1] + b[1]) / 2).toFixed(2); };
            var d = 'M' + M(P[n - 1], P[0]); for (var k = 0; k < n; k++) d += ' Q' + P[k][0].toFixed(2) + ',' + P[k][1].toFixed(2) + ' ' + M(P[k], P[(k + 1) % n]); d += 'Z';
            el('path', { d: d }, G('shade')); el('path', { d: d }, G('land')); });
          for (var gx = 10; gx < 360; gx += 30) el('path', { d: 'M' + gx + ',0V150' }, G('grid'));
          for (var gy = 0; gy <= 150; gy += 15) el('path', { d: 'M0,' + gy + 'H360' }, G('grid'));
          [[28, 36], [96, 92], [150, 38], [330, 58], [18, 96], [206, 20], [120, 70], [345, 110], [58, 120]].forEach(function (p) { el('path', { d: 'M' + p[0] + ',' + p[1] + ' q1,-1 2,0 t2,0 t2,0 M' + (p[0] + 1.5) + ',' + (p[1] + 1.6) + ' q1,-1 2,0 t2,0' }, G('sea')); });
          ['M110,52 Q128,30 152,30', 'M60,64 Q30,80 8,72', 'M250,60 Q300,48 352,64', 'M200,40 Q180,58 140,62'].forEach(function (d) { el('path', { d: d }, G('lanes')); });
          el('text', { x: 14, y: 52, 'font-size': 4.2 }, G('deco')).textContent = 'Here be adventures';
          el('text', { x: 118, y: 44, 'font-size': 3.6 }, G('deco')).textContent = 'Atlantic';
          el('text', { x: 318, y: 84, 'font-size': 3.6 }, G('deco')).textContent = 'Pacific';
          var rose = el('g', { transform: 'translate(22,122)' }, G('deco'));
          el('circle', { r: 9, fill: 'none', stroke: 'rgba(80,52,24,.55)', 'stroke-width': .5 }, rose);
          el('circle', { r: 7.4, fill: 'none', stroke: 'rgba(80,52,24,.45)', 'stroke-width': .4, 'stroke-dasharray': '1 1' }, rose);
          for (var ri = 0; ri < 8; ri++) { var a = ri * Math.PI / 4, Lr = ri % 2 ? 5.5 : 9.5, wr = ri % 2 ? 1 : 1.6, ca = Math.cos(a), sa = Math.sin(a);
            el('path', { d: 'M0,0 L' + (-sa * wr) + ',' + (ca * wr) + ' L' + (ca * Lr) + ',' + (sa * Lr) + ' Z', fill: 'rgba(90,56,24,.75)' }, rose);
            el('path', { d: 'M0,0 L' + (sa * wr) + ',' + (-ca * wr) + ' L' + (ca * Lr) + ',' + (sa * Lr) + ' Z', fill: 'rgba(230,210,165,.9)', stroke: 'rgba(90,56,24,.6)', 'stroke-width': .25 }, rose); }
          el('text', { x: -1.5, y: -10.5, 'font-size': 4, fill: 'rgba(70,44,18,.75)' }, rose).textContent = 'N';
        }

        /* the pins (clickable, glowing) and, on part two, the dots (every other country, glowing, unlabelled, not clickable) */
        var PINS = A.pins, STOPS = (A.home ? [{ key: 'home', name: 'Maidenhead' }] : []).concat(REG), LBL = A.lbl || {}, PVD = A.pvd || {};
        function at(key) { var p = PINS[key] || (A.dots && A.dots[key]) || [50, 50]; return p; }
        var marks = box.querySelector('.jja-marks');
        if (A.dots) Object.keys(A.dots).forEach(function (k) { if (A.nodot && A.nodot.indexOf(k) >= 0) return; var d = document.createElement('i'); d.className = 'jja-dot'; d.title = k; d.style.left = A.dots[k][0] + '%'; d.style.top = A.dots[k][1] + '%'; marks.appendChild(d); });
        if (A.dots2) Object.keys(A.dots2).forEach(function (k) { var d = document.createElement('i'); d.className = 'jja-dot sm'; d.style.left = A.dots2[k][0] + '%'; d.style.top = A.dots2[k][1] + '%'; marks.appendChild(d); });   /* the main map's Europe / North Africa twins */
        STOPS.forEach(function (S, i) {
          var m = document.createElement('div'); m.className = 'jja-mk ' + (LBL[S.key] || ''); var pp = at(S.key);
          m.style.left = pp[0] + '%'; m.style.top = pp[1] + '%';
          var pv = '';
          if (S.files) { var n = S.files.length, o = PVD[S.key] || [0, -1.7];
            S.files.forEach(function (f, k) { var fx = o[0] + (k - (n - 1) / 2) * .62 - .5, fy = o[1] + (k % 2) * .08, r = (k - (n - 1) / 2) * 7;
              pv += '<button type="button" class="jja-pc" data-trav="' + S.key + '" data-cursor="hover" style="--k:' + k + ';--fx:' + fx.toFixed(2) + ';--fy:' + fy.toFixed(2) + ';--r:' + r + 'deg" aria-label="' + esc(place(S)) + ' photos"><img data-src="' + SB + f + '" alt="" decoding="async"></button>'; }); }
          m.innerHTML = '<div class="jja-pv">' + pv + '</div><span class="jring"></span><button type="button" class="seal" data-cursor="hover" aria-label="' + esc(place(S)) + '"></button><span class="lbl">' + esc(place(S)) + '</span>';
          marks.appendChild(m); S.el = m;
          var ht;
          m.addEventListener('mouseenter', function () { clearTimeout(ht); m.classList.add('hov'); showSync(); });
          m.addEventListener('mouseleave', function () { ht = setTimeout(function () { m.classList.remove('hov'); showSync(); }, 260); });
          m.querySelector('.seal').addEventListener('click', function (e) { e.stopPropagation(); go(S.key === 'home' ? 1 : spreadOf(S.key)); });
          Array.prototype.forEach.call(m.querySelectorAll('.jja-pc'), function (pc) { pc.addEventListener('click', function (e) { e.stopPropagation(); closeAny(); openColl(pc); }); });
        });
        function showSync() {   /* a pin's photos pop out on hover, and for the open spread's stop unless the open passport is lying over that pin (its photos are on the page anyway) */
          var bk = box.querySelector('.jja-book'), mp = box.querySelector('.jja-map'), open = bk && !bk.classList.contains('closed'), bx = open ? bk.offsetLeft - bk.offsetWidth / 2 : 0, by = open ? bk.offsetTop - bk.offsetHeight / 2 : 0;
          STOPS.forEach(function (S) { var hov = S.el.classList.contains('hov'), on = !!S.files && (hov || S.el.classList.contains('act'));
            if (on && open && !hov) { var px = mp.offsetLeft + S.el.offsetLeft, py = mp.offsetTop + S.el.offsetTop; if (px > bx && px < bx + bk.offsetWidth && py > by && py < by + bk.offsetHeight) on = false; }
            S.el.classList.toggle('show', on); }); }

        /* the route between visited stops, in the order of the trip. Points inside the Europe inset hop to their main-map twin (A.via) for
           any leg that leaves the inset; on the drawn map the long hops wrap round the Pacific */
        var route = G('route'), plane = G('plane'), visited = {}, pairs = {}, queue = [], flying = false, done = false, mid = 0;
        var ANCH = A.anchor || {}, VIA = A.via || {};
        function pt(key) { var p = ANCH[key] ? A.dots[ANCH[key]] : at(key); return [p[0] * 3.6, p[1] * 1.5]; }
        function via(key) { var n = ANCH[key] || key, v = VIA[n]; return v ? [v[0] * 3.6, v[1] * 1.5] : null; }
        function makeSeg(A1, B1, ink) {
          var va = via(A1.key), vb = via(B1.key), a = pt(A1.key), b = pt(B1.key);
          if (va && !vb) a = va; else if (vb && !va) b = vb;   /* in and out of Europe on the main map */
          var parts;
          if (!BMP && Math.abs(b[0] - a[0]) > 180) { var sh = b[0] < a[0] ? 360 : -360; parts = [[a, [b[0] + sh, b[1]]], [[a[0] - sh, a[1]], b]]; } else parts = [[a, b]];
          return parts.map(function (q) { var P0 = q[0], P1 = q[1], len = Math.hypot(P1[0] - P0[0], P1[1] - P0[1]);
            var d = 'M' + P0 + ' Q' + (P0[0] + P1[0]) / 2 + ',' + ((P0[1] + P1[1]) / 2 - len * .2) + ' ' + P1, id = PFX + 'M' + (mid++);
            var mk = el('mask', { id: id, maskUnits: 'userSpaceOnUse', x: -400, y: -200, width: 1200, height: 600 }, route);
            var rv = el('path', { d: d, class: 'rv' }, mk), vis = el('path', { d: d, class: 'rt' + (ink ? ' ' + ink : ''), mask: 'url(#' + id + ')' }, route);
            var Lp = rv.getTotalLength(); rv.style.strokeDasharray = Lp; rv.style.strokeDashoffset = Lp; return { rv: rv, vis: vis, mk: mk, L: Lp }; });
        }
        if (PRE.length) {   /* part one's trip, already travelled: drawn at once in the first ink */
          var chain0 = [{ key: 'home' }].concat(PRE);
          for (var c0 = 1; c0 < chain0.length; c0++) makeSeg(chain0[c0 - 1], chain0[c0]).forEach(function (q) { q.rv.style.strokeDashoffset = 0; });
        }
        var START = PRE.length ? [PRE[PRE.length - 1]] : [];
        function syncRoute() {
          var chain = START.concat(STOPS.filter(function (S) { return visited[S.key]; })), want = {};
          for (var i = 1; i < chain.length; i++) want[chain[i - 1].key + '>' + chain[i].key] = [chain[i - 1], chain[i]];
          Object.keys(pairs).forEach(function (k) { if (want[k]) return; pairs[k].forEach(function (q) { q.vis.style.opacity = 0; setTimeout(function () { q.vis.remove(); q.mk.remove(); }, 600); }); delete pairs[k]; });
          Object.keys(want).forEach(function (k) { if (pairs[k]) return; queue.push(pairs[k] = makeSeg(want[k][0], want[k][1], PRE.length ? 'ink2' : '')); });
          fly();
        }
        function fly() {   /* a short timed flight per hop (runs only after a visit, never on scroll) */
          if (flying || !queue.length) return; flying = true;
          var parts = queue.shift(), k = 0; plane.style.opacity = 1;
          (function part() { var q = parts[k], t0 = performance.now(), dur = 500 + q.L * 7;
            (function step(now) { var t = Math.min(1, (now - t0) / dur), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, l = q.L * e;
              q.rv.style.strokeDashoffset = q.L - l;
              var p = q.rv.getPointAtLength(l), p2 = q.rv.getPointAtLength(Math.min(q.L, l + .5));
              plane.setAttribute('transform', 'translate(' + p.x.toFixed(2) + ',' + p.y.toFixed(2) + ') rotate(' + (Math.atan2(p2.y - p.y, p2.x - p.x) * 180 / Math.PI).toFixed(1) + ')');
              if (t < 1) return requestAnimationFrame(step);
              if (++k < parts.length) return part();
              flying = false; if (!queue.length) plane.style.opacity = 0; fly(); })(t0); })();
        }
        function visit(key) {
          if (A.home && !visited.home && key !== 'home') visit('home');   /* every trip starts from home */
          if (visited[key]) return; var S = STOPS.filter(function (q) { return q.key === key; })[0]; if (!S) return;
          visited[key] = 1; S.el.classList.add('on'); syncRoute();
          if (!done && REG.every(function (R) { return visited[R.key]; })) { done = true; setTimeout(function () { try { toast(A.toast); } catch (x) {} }, 2400); }
        }
        function setActive(key) { STOPS.forEach(function (S) { S.el.classList.toggle('act', S.key === key); }); showSync(); }

        /* ---- the passport: a UK-style book that says Joe's Journey ---- */
        var INKS = ['#b3261e', '#1f4fa8', '#6b2fa0', '#1d7a4c', '#9a4a12'], WORDS = ['ENTRY', 'ADMITTED', 'ARRIVED', 'IMMIGRATION', 'VISA'];
        var SLOTS = { 1: [[50, 46]], 2: [[34, 34], [64, 66]], 3: [[30, 28], [70, 44], [38, 72]], 4: [[30, 27], [70, 31], [32, 66], [70, 71]], 5: [[29, 25], [71, 27], [50, 50], [29, 76], [71, 76]], 7: [[28, 21], [72, 19], [48, 41], [26, 60], [72, 58], [36, 83], [72, 85]] };
        function stamp(c, i, n, up) {
          var sl = up ? ({ 1: [[50, 25]], 2: [[30, 21], [70, 27]] }[n] || SLOTS[n])[i] : (SLOTS[n] || SLOTS[7])[i], ink = INKS[(i * 2 + n) % INKS.length], type = ['circ', 'rect', 'oval'][(i + n) % 3], r = ((i * 37 + n * 11) % 24) - 12, nm = esc(c[0].toUpperCase()), w = WORDS[(i + n) % WORDS.length], id = PFX + 'A' + nm.replace(/\W/g, '') + i, svgS;
          var T = function (x, y, fs, ls, txt) { return '<text x="' + x + '" y="' + y + '" fill="' + ink + '" stroke="none" font-family="Special Elite,Courier New,monospace" font-size="' + fs + '" letter-spacing="' + ls + '" text-anchor="middle">' + txt + '</text>'; };
          if (type === 'circ') svgS = '<svg viewBox="0 0 120 120"><g filter="url(#jjaInk)" fill="none" stroke="' + ink + '"><circle cx="60" cy="60" r="56" stroke-width="3.5"/><circle cx="60" cy="60" r="47" stroke-width="1.5"/><path id="' + id + '" d="M22,60 a38,38 0 1 1 76,0" stroke="none"/>' +
            '<text fill="' + ink + '" stroke="none" font-family="Special Elite,Courier New,monospace" font-size="' + Math.min(16, 160 / nm.length) + '" letter-spacing="1.5" text-anchor="middle"><textPath href="#' + id + '" startOffset="50%">' + nm + '</textPath></text>' + T(60, 98, 12, 1.5, w) + '</g><text x="60" y="73" font-size="30" text-anchor="middle">' + c[1] + '</text></svg>';
          else if (type === 'rect') svgS = '<svg viewBox="0 0 160 96"><g filter="url(#jjaInk)" fill="none" stroke="' + ink + '"><rect x="3" y="3" width="154" height="90" rx="10" stroke-width="3.5"/><rect x="10" y="10" width="140" height="76" rx="6" stroke-width="1.2"/>' + T(80, 30, 13, 2, w) + T(80, 78, Math.min(22, 250 / nm.length), 1, nm) + '</g><text x="80" y="57" font-size="20" text-anchor="middle">' + c[1] + '</text></svg>';
          else svgS = '<svg viewBox="0 0 170 100"><g filter="url(#jjaInk)" fill="none" stroke="' + ink + '"><ellipse cx="85" cy="50" rx="81" ry="46" stroke-width="3.5"/><ellipse cx="85" cy="50" rx="70" ry="36" stroke-width="1.2" stroke-dasharray="3 3"/>' + T(85, 40, Math.min(19, 230 / nm.length), 1, nm) + T(85, 80, 12, 2, w) + '</g><text x="85" y="63" font-size="17" text-anchor="middle">' + c[1] + '</text></svg>';
          return '<div class="stamp ' + type + '" style="left:' + sl[0] + '%;top:' + sl[1] + '%;--r:' + r + 'deg;--i:' + i + '">' + svgS + '</div>';
        }
        var LAYOUT = { 1: [[8, 2, 84, 94, -3]], 2: [[4, 2, 58, 58, -4], [40, 40, 56, 58, 4]], 3: [[3, 1, 56, 52, -4], [47, 9, 50, 50, 5], [14, 50, 48, 48, -2]], 4: [[3, 0, 47, 49, -4], [50, 3, 46, 48, 5], [6, 51, 45, 48, 3], [50, 52, 46, 47, -4]] };   /* [left, top, width, height, tilt] in % of the photo area */
        /* a page with one or two stamps has room: the set's photos spread over both pages (Joe, 2026-09-25) */
        function split(R) { return R.cc.length <= 2 && R.files.length >= 3 ? Math.ceil(R.files.length / 2) : R.files.length; }
        function snapsOf(R, files) { var lay = LAYOUT[files.length] || LAYOUT[4], sn = '';
          files.forEach(function (f, i) { var q = lay[i] || lay[lay.length - 1]; sn += '<button type="button" class="snap" data-trav="' + R.key + '" data-cursor="hover" style="left:' + q[0] + '%;top:' + q[1] + '%;width:' + q[2] + '%;height:' + q[3] + '%;rotate:' + q[4] + 'deg" aria-label="' + esc(place(R)) + ' photos"><img data-src="' + SB + f + '" alt="" decoding="async"></button>'; }); return sn; }
        function left(R) { var lay = LAYOUT[split(R)] || LAYOUT[4], sn = '';
          R.files.slice(0, split(R)).forEach(function (f, i) { var q = lay[i] || lay[lay.length - 1]; sn += '<button type="button" class="snap" data-trav="' + R.key + '" data-cursor="hover" style="left:' + q[0] + '%;top:' + q[1] + '%;width:' + q[2] + '%;height:' + q[3] + '%;rotate:' + q[4] + 'deg" aria-label="' + esc(place(R)) + ' photos"><img data-src="' + SB + f + '" alt="" decoding="async"></button>'; });
          return '<div class="pg reg"><h3>' + esc(place(R)) + '</h3><div class="snaps">' + sn + '</div><p class="note">' + esc(R.cap) + '</p></div>'; }
        function right(R) { var k = split(R), more = R.files.slice(k);
          return '<div class="pg visas' + (more.length ? ' top' : '') + '"><div class="kicker">Visas · ' + esc(place(R)) + '</div>' + R.cc.map(function (c, i) { return stamp(c, i, R.cc.length, more.length > 0); }).join('') + (more.length ? '<div class="snaps r">' + snapsOf(R, more) + '</div>' : '') + '</div>'; }
        /* a JJ crest (not the royal arms): a shield with the J, a star above, laurels either side */
        var crest = '<svg class="crest" viewBox="0 0 120 124" aria-hidden="true"><defs><linearGradient id="jjaGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1b8"/><stop offset=".4" stop-color="#e0b64a"/><stop offset=".7" stop-color="#a7781d"/><stop offset="1" stop-color="#f4d57a"/></linearGradient></defs>' +
          '<g fill="none" stroke="url(#jjaGold)" stroke-width="2.6" stroke-linejoin="round"><path d="M34 26 H86 V62 C86 86 60 102 60 102 C60 102 34 86 34 62 Z"/><path d="M39 31 H81 V61 C81 81 60 95 60 95 C60 95 39 81 39 61 Z" stroke-width="1.1"/></g>' +
          '<text x="60" y="80" text-anchor="middle" font-family="Joes Journey Headline,Georgia,serif" font-weight="700" font-size="50" fill="url(#jjaGold)">J</text>' +
          '<path d="M60 3 l3.6 7.6 8.3 1 -6.1 5.7 1.6 8.2 -7.4-4.1 -7.4 4.1 1.6-8.2 -6.1-5.7 8.3-1z" fill="url(#jjaGold)"/>' +
          '<g fill="url(#jjaGold)">' + (function () { var o = ''; for (var sd = -1; sd <= 1; sd += 2) for (var i = 0; i < 7; i++) { var t = i / 6, cx = 60 + sd * (33 + 9 * Math.sin(t * Math.PI)), cy = 30 + t * 74;
              o += '<ellipse cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" rx="3" ry="7" transform="rotate(' + (sd * (15 + t * 45)).toFixed(1) + ' ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')"/>'; } return o; })() + '</g>' +
          '<path d="M44 112 Q60 120 76 112" fill="none" stroke="url(#jjaGold)" stroke-width="2.2" stroke-linecap="round"/></svg>';
        var chip = '<svg class="chipsym" viewBox="0 0 60 40" aria-hidden="true"><g fill="none" stroke="#d8ae4a" stroke-width="2.4"><rect x="2" y="2" width="56" height="36" rx="5"/><circle cx="30" cy="20" r="8"/><path d="M2 12 H22 M38 12 H58 M2 28 H22 M38 28 H58"/></g></svg>';
        var MRZ = ['P<JJJJACKSON<<JOE<<<<<<<<<<<<', '1995111<4JJJ9511147M2612315<<'];
        var DATA = '<div class="pg data"><div class="dh"><b>JOE\u2019S JOURNEY</b><span>PASSPORT / PASSEPORT \u00b7 P \u00b7 JJJ \u00b7 No. 1995 1114</span></div>' +
          '<div class="drow"><div class="dph"><img data-src="' + SB + 'ms-peek-joe.webp" alt=""></div><dl>' +
            '<dt>Surname/Nom (1)</dt><dd>JACKSON</dd><dt>Given names/Pr\u00e9noms (2)</dt><dd>JOE</dd><dt>Nationality (3)</dt><dd>BRITISH</dd></dl></div>' +
          '<dl class="dgrid"><div><dt>Birth/Naissance (4)</dt><dd>14 NOV 1995</dd></div><div><dt>Place/Lieu (5)</dt><dd>MAIDENHEAD</dd></div></dl>' +
          '<div class="dsig"><i>Holder\u2019s signature/Signature (6)</i><span>Joe Jackson</span></div>' +
          '<div class="mrz">' + MRZ.map(function (l) { return '<span>' + esc(l) + '</span>'; }).join('') + '</div></div>';
        var INSIDE = '<div class="pg inside">' + crest + '<p>Joe’s Journey requests and requires in the name of Joe all those whom it may concern to allow the bearer to pass freely without let or hindrance, and to afford the bearer such assistance and protection as may be necessary.</p><p class="sign">Keep this passport safe. It will get stamped.</p></div>';
        /* the spreads: 1 = the data page, then (part two) part one's spreads already stamped + 'Visas continued', then this slide's trips */
        var SP = [null, { key: 'home' }].concat(PRE.map(function (R) { return { R: R, pre: true }; }));
        if (A.cont) SP.push({ cont: true });
        REG.forEach(function (R) { SP.push({ R: R }); });
        function spreadOf(key) { for (var i = 2; i < SP.length; i++) if (SP[i].R && SP[i].R.key === key && !SP[i].pre) return i; return 1; }
        var CONT_L = '<div class="pg reg cont"><h3>Visas continued…</h3><p class="note big">The trips since: fewer months away, more places ticked off.</p><p class="note">Press a pin on the map, or turn the page.</p><p class="leg"><span><i class="lp"></i>Pins: open a page</span><span><i class="ld"></i>Dots: been there</span></p></div>';
        var CONT_R = '<div class="pg visas cont"><div class="kicker">Visas · continued</div><div class="tally"><b>45</b><span>countries so far</span><em>I’d like to see them all one day…</em></div></div>';
        function leftOf(i) { var P = SP[i]; if (!P) return '<div class="pg reg"><h3>Where next…?</h3><div class="snaps"></div></div>'; return P.cont ? CONT_L : left(P.R); }
        function rightOf(i) { var P = SP[i]; return i === 1 ? DATA : P.cont ? CONT_R : right(P.R); }
        var FACES = [['<div class="face front leather"><div class="cvtop foil">JOE’S JOURNEY</div>' + crest + '<div class="cvpp foil">PASSPORT</div>' + chip + '</div>', '<div class="face back leather"><div class="paper">' + INSIDE + '<span class="pno">1</span></div></div>']];
        for (var fi = 1; fi < SP.length; fi++) FACES.push([rightOf(fi), leftOf(fi + 1)]);
        var book = box.querySelector('.jja-book'), N = FACES.length, leaves = [];
        FACES.forEach(function (f, i) { var l = document.createElement('div'); l.className = 'leaf' + (i ? '' : ' cover');
          l.innerHTML = i ? '<div class="face front paper' + (i === 1 ? ' lilac' : '') + (SP[i] && SP[i].pre ? ' stamped done' : '') + '">' + f[0] + '<span class="pno">' + (i * 2) + '</span></div><div class="face back paper">' + f[1] + '<span class="pno">' + (i * 2 + 1) + '</span></div>' : f[0] + f[1];
          l.style.zIndex = N - i; book.appendChild(l); leaves.push(l); });
        var cn = document.createElement('div'); cn.className = 'corner next'; cn.setAttribute('data-cursor', 'hover'); cn.title = 'Turn the page'; book.appendChild(cn);
        var cp = document.createElement('div'); cp.className = 'corner prev'; cp.setAttribute('data-cursor', 'hover'); cp.title = 'Back a page'; book.appendChild(cp);
        var cnt = box.querySelector('.jja-count'), aP = box.querySelector('.jja-arr.prev'), aN = box.querySelector('.jja-arr.next');
        var MAX = N - 1, s = 0, zT = null, CONT = A.cont ? SP.length - REG.length - 1 : 0;
        function go(ns, quick) {
          ns = Math.max(0, Math.min(MAX, ns)); if (ns === s) return;
          var dir = ns > s ? 1 : -1, list = [], i, gap = quick ? 55 : 140;
          if (dir > 0) for (i = s; i < ns; i++) list.push(i); else for (i = s - 1; i >= ns; i--) list.push(i);
          book.classList.toggle('flick', !!quick);
          list.forEach(function (i, k) { var l = leaves[i]; setTimeout(function () { l.style.zIndex = 100 + k; l.classList.toggle('flipped', dir > 0); }, k * gap); });
          clearTimeout(zT); zT = setTimeout(function () { book.classList.remove('flick'); leaves.forEach(function (l, i) { l.style.zIndex = l.classList.contains('flipped') ? i + 1 : N * 2 - i; }); }, 1000 + list.length * gap);
          s = ns; book.classList.toggle('closed', s === 0); box.classList.toggle('open', s > 0); ui();
          var P = SP[s];
          if (s >= 1 && A.home) visit('home');
          setActive(s === 1 ? 'home' : P && P.R ? P.R.key : null);
          if (P && P.R && !P.pre) { var page = leaves[s].querySelector('.front'), R = P.R;
            setTimeout(function () { if (page.classList.contains('stamped')) return; page.classList.add('stamped'); setTimeout(function () { page.classList.add('done'); }, 1400 + R.cc.length * 320); }, quick ? 150 : 500);
            setTimeout(function () { visit(R.key); }, list.length * gap + 300); }
        }
        function ui() { cn.classList.toggle('off', s >= MAX); cp.classList.toggle('off', s <= 0);
          var P = SP[s], nr = REG.indexOf(P && P.R);
          cnt.textContent = s === 0 ? 'Open me, or pick a place on the map' : s === 1 ? 'Home: Maidenhead' : P.cont ? 'Visas continued' : P.pre ? 'Earlier: ' + place(P.R) : (nr + 1) + ' / ' + REG.length + '  ' + place(P.R);
          aP.disabled = s <= 0; aN.disabled = s >= MAX; }
        leaves[0].addEventListener('click', function (e) { if (s === 0) { e.stopPropagation(); go(A.cont ? CONT : 1, !!A.cont); } });
        cn.addEventListener('click', function (e) { e.stopPropagation(); go(s + 1); }); cp.addEventListener('click', function (e) { e.stopPropagation(); go(s - 1); });
        aN.addEventListener('click', function (e) { e.stopPropagation(); go(s + 1); }); aP.addEventListener('click', function (e) { e.stopPropagation(); go(s - 1); });
        book.addEventListener('click', function (e) { var sn = e.target.closest('.snap'); if (!sn) return; e.stopPropagation(); closeAny(); openColl(sn); });
        jjOn(document, 'keydown', function (e) { if (!isCur(st) || modalBusy() || e.metaKey || e.ctrlKey || e.altKey) return; if (e.key === 'ArrowRight') go(s + 1); else if (e.key === 'ArrowLeft') go(s - 1); });
        /* it shuts itself as the slide leaves the middle (the stamps and the route stay); part two flicks open to 'Visas continued' as it arrives */
        var flT = null;
        /* once the slide has gone on up (the next one holds the middle) the shut passport slips away too, so it never peeks into the next scene (Joe, 2026-09-26) */
        function away(o) { box.classList.toggle('away', o); }
        new MutationObserver(function () {
          if (!isCur(st)) { clearTimeout(flT); if (s > 0 && !collOpen) go(0, true); away(st.getBoundingClientRect().top < 0); return; }
          away(false);
          if (A.cont && s === 0) { clearTimeout(flT); flT = setTimeout(function () { if (isCur(st) && s === 0 && !modalBusy()) go(CONT, true); }, 700); }
        }).observe(st, { attributes: true, attributeFilter: ['class'] });
        ui(); lazy(st);
      }
      atlasOn(stepOf('atlas'), { part: 1, img: ATLAS_IMG, pins: ATLAS_PINS, home: true, keys: ['eu', 'pe', 'as', 'au', 'mx'],   /* no Canada on the first map (Joe, 2026-09-30); it stays on the modern one (a dot + its passport page) */
        lbl: { home: 'lleft', pe: 'lleft' }, pvd: { eu: [0.9, -0.55], pe: [-1.35, 0.6], as: [0, -1.7], au: [-0.3, -1.7], mx: [0.3, -1.7], ca: [0.45, 0.7] },
        toast: '✈️ <b>Frequent Flyer</b> · every stop stamped' });
      (function () { for (var i = 0; i < STEPS.length; i++) if (STEPS[i].atlas === 2) return atlasOn(steps[i], { part: 2, img: ATLAS2_NEO ? '' : ATLAS2_IMG, neo: ATLAS2_NEO, ar: 2400 / 1303, pins: ATLAS2_PINS, dots: ATLAS2_DOTS, dots2: ATLAS2_DOTS_MAIN, via: ATLAS2_VIA,
        keys: ['bk', 'ch', 'dk', 'id', 'nz', 'dog'], pre: ['eu', 'pe', 'as', 'au', 'mx', 'ca'], cont: true,
        anchor: { home: 'England', eu: 'Czechia', pe: 'Peru', as: 'Vietnam', au: 'Australia', mx: 'Mexico', ca: 'Canada' },
        lbl: { dog: 'lleft', ch: 'lleft', bk: 'lbelow', nz: 'lleft labove' }, pvd: { dog: [0.9, -1.2], bk: [0.9, -1.7], ch: [0.6, -1.7], dk: [0.9, -1.7], id: [-0.4, -1.7], nz: [-1.2, -1.7] },
        toast: '🛂 <b>Passport Full</b> · every new stamp in' }); })();

      /* ---------------- LEARNING (flag `learning`): four compact blocks round the words ----------------
         top-left the Sunday Vibes telly (built below, moved here by CSS), bottom-right the Learning new skills cards + tags (PHOTOS/TAGS),
         bottom-left Sports (a still; press to swap tennis <-> badminton; SPORT_CLIPS play instead when set), top-right Interests (Joe with a
         prop, cycling with a pop; hover pauses, press = next) */
      (function () {
        var st = stepOf('learning'); if (!st) return;
        st.classList.add('v2learn');
        var SPORTS = [['tennis', 'sp-tennis.webp', 'Tennis'], ['badminton', 'sp-badminton.webp', 'Badminton']];
        var sp = document.createElement('button'); sp.type = 'button'; sp.className = 'jjl-card jjl-sport'; sp.setAttribute('data-cursor', 'hover'); sp.setAttribute('aria-label', 'Keeping active: press to swap sport');
        sp.innerHTML = '<span class="jjl-pill">Keeping active · <b>Tennis</b></span><span class="jjl-stage">' + SPORTS.map(function (q, k) {
            var clip = (SPORT_CLIPS || {})[q[0]];
            return '<span class="jjl-f' + (k ? '' : ' on') + '" data-k="' + k + '">' + (clip ? '<video muted loop playsinline preload="none" data-base="' + esc(clip) + '" poster="' + SB + q[1] + '"></video>' : '<img data-src="' + SB + q[1] + '" alt="">') + '</span>'; }).join('') +
          '</span><span class="jjl-hint">Press to swap</span>';
        var it = document.createElement('button'); it.type = 'button'; it.className = 'jjl-card jjl-int'; it.setAttribute('data-cursor', 'hover'); it.setAttribute('aria-label', 'Interests: press for the next one');
        it.innerHTML = '<span class="jjl-stage">' + INTERESTS.map(function (q, k) { return '<span class="jjl-f' + (k ? '' : ' on') + '" data-k="' + k + '"><img data-src="' + SB + q[0] + '" alt=""></span>'; }).join('') +
          '</span><span class="jjl-pill">Interests · <b>' + esc(INTERESTS[0][1]) + '</b></span>';
        st.appendChild(sp); st.appendChild(it); lazy(st);
        function show(card, k, label) { Array.prototype.forEach.call(card.querySelectorAll('.jjl-f'), function (f) { var on = +f.getAttribute('data-k') === k; f.classList.toggle('on', on); if (on) { f.classList.remove('pop'); void f.offsetWidth; f.classList.add('pop'); } });
          card.querySelector('.jjl-pill b').textContent = label; syncVid(); }
        var si = 0, ii = 0, hov = false, tick = null;
        function live() { return st.classList.contains('cur') && !document.hidden; }
        function syncVid() { Array.prototype.forEach.call(sp.querySelectorAll('video'), function (v) { var on = live() && v.parentNode.classList.contains('on');
          if (on) { if (!v._src) { v._src = 1; v.innerHTML = jjClipSrc(SB + v.getAttribute('data-base')); v.load(); } var p = v.play(); if (p && p.catch) p.catch(function () {}); } else { try { v.pause(); } catch (x) {} } }); }
        sp.addEventListener('click', function (e) { e.stopPropagation(); si = (si + 1) % SPORTS.length; show(sp, si, SPORTS[si][2]); });
        it.addEventListener('click', function (e) { e.stopPropagation(); ii = (ii + 1) % INTERESTS.length; show(it, ii, INTERESTS[ii][1]); });
        it.addEventListener('mouseenter', function () { hov = true; }); it.addEventListener('mouseleave', function () { hov = false; });
        function run() { clearInterval(tick); tick = null; if (!live()) return; tick = setInterval(function () { if (!live()) { clearInterval(tick); tick = null; return; } if (hov || modalBusy()) return; ii = (ii + 1) % INTERESTS.length; show(it, ii, INTERESTS[ii][1]); }, 2800); }
        new MutationObserver(function () { run(); syncVid(); }).observe(st, { attributes: true, attributeFilter: ['class'] });
      })();

      /* ---------------- PLATO'S CAVE (flag cave) ----------------
         The top half of the slide is the cave wall: the puppets (CAVE.puppets) are its shadows, cast by a campfire. Over the wall the cursor IS the
         fire (the site cursor hides); each shadow is pushed away from it, leans away, and grows bigger and softer the further it is from the flame,
         with the flame's flicker. Away from the wall (and on touch) the fire sits bottom-centre and breathes, so the shadows drift; a tap moves it.
         The cave itself (the Prehistoric ceiling coming down along the top, the scenery darkened by a feathered vignette) is one fixed layer under
         the slides, on while the slide holds the middle of the screen (render() calls st._cave with the rect it already has). */
      (function () {
        var st = stepOf('cave'); if (!st) return; var stg = st.querySelector('.stage') || st, touch = !!(window.matchMedia && window.matchMedia('(hover: none)').matches);
        st.classList.add('cave');
        var css = document.createElement('style'); css.id = 'jjms-cave-css'; css.textContent = '#jjms-cave{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0;}#jjms-cave .cvvig{position:absolute;inset:-12%;background:radial-gradient(ellipse 62% 58% at 50% 52%,rgba(14,8,4,.28),rgba(8,5,3,.62) 55%,rgba(4,2,1,.9) 100%);}#jjms-cave .cvlip{position:absolute;left:50%;top:0;width:max(104%,150vh);height:auto;max-width:none;translate:-50% 0;transform:translateY(-102%);filter:brightness(.72) saturate(.9);will-change:transform;}#jjms .jjcave-wall .cvin{position:absolute;inset:0;opacity:0;}#jjms .step.cave .stage{-webkit-mask:linear-gradient(180deg,transparent 0,rgba(0,0,0,.35) 5vh,#000 16vh);mask:linear-gradient(180deg,transparent 0,rgba(0,0,0,.35) 5vh,#000 16vh);}#jjms .step.cave .stage{padding-left:max(16px,4vw);padding-right:max(16px,4vw);}#jjms .step.cave .stage > .cap{max-width:min(92vw,1290px);}#jjms .jjcave-wall{position:absolute;left:5%;right:5%;top:15%;height:30%;z-index:2;pointer-events:none;--fw:clamp(34px,3.4vw,62px);}#jjms .jjcave-wall .cvrock{position:absolute;inset:-26% -3% -14%;border-radius:50%;will-change:opacity;background:radial-gradient(ellipse 50% 50% at 50% 55%,rgba(196,108,52,.5),rgba(150,76,36,.36) 58%,rgba(96,46,20,0) 100%),url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'220\' height=\'220\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'3\' seed=\'11\'/%3E%3CfeColorMatrix values=\'0 0 0 0 .2  0 0 0 0 .12  0 0 0 0 .06  0 0 0 .55 -.1\'/%3E%3C/filter%3E%3Crect width=\'220\' height=\'220\' filter=\'url(%23n)\'/%3E%3C/svg%3E");-webkit-mask:radial-gradient(ellipse 50% 50% at 50% 50%,#000 45%,transparent 100%);mask:radial-gradient(ellipse 50% 50% at 50% 50%,#000 45%,transparent 100%);}#jjms .jjcave-wall .cvlight{position:absolute;left:0;top:0;width:88vmin;height:88vmin;margin:-44vmin 0 0 -44vmin;border-radius:50%;background:radial-gradient(closest-side,rgba(255,176,86,.42),rgba(255,128,46,.17) 52%,rgba(255,110,40,0) 100%);will-change:transform;}#jjms .jjcave-wall .cvkey{position:absolute;left:3%;right:3%;height:clamp(9px,.8vw,14px);background:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'16\' viewBox=\'0 0 24 16\'%3E%3Cg fill=\'none\' stroke=\'%23e8a468\' stroke-width=\'1.4\'%3E%3Cpath d=\'M0 1h24M0 15h24M0 12.5h24M20 12.5V3.5H4v6.5h11V6H9\'/%3E%3C/g%3E%3C/svg%3E") repeat-x 0 0/auto 100%;opacity:.34;-webkit-mask:linear-gradient(90deg,transparent,#000 22%,#000 78%,transparent);mask:linear-gradient(90deg,transparent,#000 22%,#000 78%,transparent);}#jjms .jjcave-wall .cvkey.t{top:-9%;}#jjms .jjcave-wall .cvkey.b{bottom:-8%;}#jjms .jjcave-wall .cvrays{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;opacity:0;transition:opacity .5s ease;pointer-events:none;filter:blur(.4px);}#jjms .jjcave-wall.drag .cvrays{opacity:1;transition-duration:.25s;}#jjms .jjcave-wall .cvrays line{stroke:rgba(255,224,168,.34);stroke-width:1.3;stroke-dasharray:3 8;stroke-linecap:round;}#jjms .jjcave-wall .cvp{position:absolute;display:block;translate:-50% -100%;transform-origin:50% 100%;opacity:.8;will-change:transform;}#jjms .jjcave-wall .cvp img{display:block;height:100%;width:auto;max-width:none;}#jjms .jjcave-wall .cvp .cvpen{position:absolute;left:0;top:0;opacity:.42;transform:scale(1.07,1.04);transform-origin:50% 100%;filter:blur(clamp(6px,.62vw,11px));}#jjms .jjcave-wall .cvsw{position:absolute;inset:0;}#jjms .jjcave-wall .cvart{position:absolute;display:block;transform-origin:50% 100%;will-change:transform;}#jjms .jjcave-wall .cvart > img,#jjms .jjcave-wall .cvart > video{display:block;width:100%;height:100%;max-width:none;object-fit:contain;object-position:50% 100%;}#jjms .jjcave-wall .cvart > img{position:absolute;inset:0;filter:blur(.6px);will-change:opacity;}#jjms .jjcave-wall .cvart > img.cvsoft{filter:blur(clamp(3px,.26vw,5px));}#jjms .jjcave-wall .cvfire{position:absolute;left:0;top:0;width:var(--fw);height:calc(var(--fw) * 1.35);margin:calc(var(--fw) * -1.12) 0 0 calc(var(--fw) / -2);will-change:transform;pointer-events:auto;cursor:grab;touch-action:none;-webkit-user-select:none;user-select:none;}#jjms .jjcave-wall .cvfire::after{content:"";position:absolute;inset:-45% -70% -25%;border-radius:50%;}#jjms .jjcave-wall.drag .cvfire{cursor:none;}#jjms .jjcave-wall:not(.run) .cvfire{pointer-events:none;}#jjms .jjcave-wall .cvfire::before{content:"";position:absolute;left:-60%;right:-60%;bottom:-18%;height:60%;border-radius:50%;background:radial-gradient(closest-side,rgba(255,150,60,.55),rgba(255,120,40,0));}#jjms .jjcave-wall .lg{position:absolute;left:50%;bottom:6%;width:84%;height:13%;margin-left:-42%;border-radius:999px;background:linear-gradient(#7a4724,#3b1f0d);box-shadow:0 1px 3px rgba(0,0,0,.6);}#jjms .jjcave-wall .lg.a{rotate:13deg;}#jjms .jjcave-wall .lg.b{rotate:-13deg;}#jjms .jjcave-wall .fl{position:absolute;left:50%;bottom:15%;border-radius:50% 50% 50% 50%/64% 64% 36% 36%;transform-origin:50% 100%;animation:cvFl .8s ease-in-out infinite alternate;}#jjms .jjcave-wall .f1{width:74%;height:84%;margin-left:-37%;background:radial-gradient(ellipse 60% 70% at 50% 72%,#ffe7a0,#ffab45 40%,#ff5a1f 74%,rgba(255,60,20,0) 100%);filter:blur(1px);}#jjms .jjcave-wall .f2{width:46%;height:62%;margin-left:-8%;background:radial-gradient(ellipse 60% 70% at 50% 72%,#fff0b8,#ffb347 50%,rgba(255,90,30,0) 100%);animation-duration:.62s;animation-delay:-.3s;filter:blur(.6px);}#jjms .jjcave-wall .f3{width:34%;height:44%;margin-left:-20%;background:radial-gradient(ellipse 60% 70% at 50% 75%,#fffbe6,#ffe08a 55%,rgba(255,200,90,0) 100%);animation-duration:.5s;animation-delay:-.1s;}@keyframes cvFl{0%{transform:scale(1,1) rotate(-3deg);}50%{transform:scale(.9,1.1) rotate(2deg);}100%{transform:scale(1.05,.93) rotate(-1deg);}}#jjms .jjcave-wall .em{position:absolute;left:50%;bottom:50%;width:3px;height:3px;border-radius:50%;background:#ffd27a;box-shadow:0 0 6px 2px rgba(255,150,50,.85);opacity:0;animation:cvEm 1.9s linear infinite;}@keyframes cvEm{0%{opacity:0;transform:translate(0,0);}12%{opacity:1;}100%{opacity:0;transform:translate(var(--x),calc(var(--fw) * -1.9));}}#jjms .jjcave-wall:not(.run) .fl,#jjms .jjcave-wall:not(.run) .em{animation-play-state:paused;}#jjms .jjcave-wall .cvbody{position:absolute;inset:0;display:block;transform-origin:50% 100%;transition:scale .35s cubic-bezier(.34,1.56,.64,1),filter .35s ease;}#jjms .jjcave-wall.run .cvfire:hover .cvbody,#jjms .jjcave-wall.run .cvfire:focus-visible .cvbody{scale:1.1;filter:brightness(1.22);}#jjms .jjcave-wall .cvfire:hover .em,#jjms .jjcave-wall .cvfire:focus-visible .em,#jjms .jjcave-wall.drag .em{animation-duration:.8s;}#jjms .jjcave-wall .cvfire:focus-visible{outline:none;}#jjms .jjcave-wall .cvhint{position:absolute;left:calc(100% + 1em);top:58%;translate:0 -50%;display:flex;align-items:center;padding:.5em 1.1em;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.4);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:0 0 1.8em rgba(255,150,60,.2);color:#fff;font:700 clamp(13px,1vw,18px)/1.2 "Joes Journey Headline",Georgia,serif;white-space:nowrap;pointer-events:none;opacity:0;scale:.9;transform-origin:0 50%;transition:opacity .6s ease,scale .7s cubic-bezier(.34,1.56,.64,1);}#jjms .jjcave-wall.run:not(.used) .cvhint{opacity:1;scale:1;transition-delay:.9s;}#jjms .jjcave-wall.drag .cvhint,#jjms .jjcave-wall.used .cvhint{opacity:0!important;scale:.9;transition-delay:0s;}#jjms .jjcave-wall .cvfire .jjdh{left:50%;top:48%;}#jjms .jjcave-wall .cvfire .jjdh.on{transition-delay:.2s;}#jjms .step.cave .stage{padding-top:20vh;}#jjms .phw .platov{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;pointer-events:none;opacity:0;transition:opacity .5s ease;}#jjms .phw .platov.on{opacity:1;}#jjms .phw:has(.platov.on) .phs img{opacity:0!important;}#jjms .phw.plato .phd{--dx:3px!important;--dy:4px!important;--dr:.3deg!important;}html.jjms-fire .custom-cursor,html.jjms-fire .cursor-trail{opacity:0!important;}html.jjms-fire,html.jjms-fire body{cursor:none;}@media (max-width:767px){#jjms .jjcave-wall{left:2%;right:2%;top:14%;height:22%;--fw:30px;}#jjms .jjcave-wall .cvhint{left:50%;top:calc(100% + .9em);translate:-50% 0;transform-origin:50% 0;font-size:13px;}#jjms .step.cave .stage{padding-top:16vh;}}'; document.head.appendChild(css);
        var wall = document.createElement('div'); wall.className = 'jjcave-wall'; wall.setAttribute('role', 'img'); wall.setAttribute('aria-label', 'Plato\u2019s cave: shadow puppets cast by a campfire');
        /* the shadows: Joe's art as one layer (or his clip in its place), else the drawn puppets, each cast twice (a soft penumbra under the core) */
        var MODE = CAVE_CLIP ? 'clip' : CAVE_ART && CAVE_ART.src ? 'art' : 'pup';
        function pupHTML() { return CAVE.puppets.map(function (q) { return '<i class="cvp" style="left:' + q.x + '%;top:' + q.y + '%;height:' + q.h + '%"><img class="cvpen" data-src="' + SB + q.src + '" alt="" decoding="async"><img class="cvcore" data-src="' + SB + q.src + '" alt="" decoding="async"></i>'; }).join(''); }
        wall.innerHTML = '<div class="cvin"><i class="cvrock"></i><i class="cvkey t"></i><i class="cvkey b"></i><i class="cvlight"></i><svg class="cvrays" aria-hidden="true"></svg><div class="cvsw">' +
          (MODE === 'clip' ? '<i class="cvart"><video class="cvclip" muted loop playsinline preload="none" aria-hidden="true"></video></i>' : MODE === 'art' ? '<i class="cvart"><img class="cvsh cvsoft" data-src="' + SB + CAVE_ART.src + '" alt="" decoding="async"><img class="cvsh" data-src="' + SB + CAVE_ART.src + '" alt="" decoding="async"></i>' : pupHTML()) + '</div>' +
          '<span class="cvfire" role="button" tabindex="0" aria-label="The campfire: pick it up and move it to cast the shadows" data-cursor="drag">' +
          '<i class="cvbody"><i class="lg a"></i><i class="lg b"></i><i class="fl f1"></i><i class="fl f2"></i><i class="fl f3"></i>' + [0, 1, 2, 3, 4, 5].map(function (k) { return '<b class="em" style="--x:' + ((k % 2 ? 1 : -1) * (5 + k * 3)) + 'px;animation-delay:-' + (k * .33).toFixed(2) + 's"></b>'; }).join('') + '</i>' +
          '<span class="cvhint">Pick up the fire</span></span></div>';
        stg.insertBefore(wall, stg.firstChild); lazy(st);
        var cov = document.createElement('div'); cov.id = 'jjms-cave'; cov.innerHTML = '<i class="cvvig"></i><img class="cvlip" alt="" data-src="' + SB + 'era-1-edge.webp">';
        steps[0].parentNode.insertBefore(cov, steps[0]);   /* before the slides: z-index 0 in #jjms paints it over the world and under every slide */
        /* Plato, thinking: Joe's art replaces the wizard (and his wand clip) the moment it loads; render() re-measures the grow for its new shape */
        var wz = stg.querySelector('.phw.deco');
        if (wz && CAVE.think) { var pim = new Image(); pim.onload = function () { var im = wz.querySelector('.phs img'), v = wz.querySelector('.phonce'); if (!im) return; im.src = pim.src; if (v) v.remove(); wz.classList.add('plato'); wz.removeAttribute('data-cursor'); st.__f = null; if (window.jjmsRender) window.jjmsRender();
            if (!CAVE.clip) return; var pv = document.createElement('video'); pv.className = 'platov'; pv.muted = true; pv.loop = true; pv.playsInline = true; pv.setAttribute('muted', ''); pv.setAttribute('playsinline', ''); pv.preload = 'none'; pv.poster = SB + CAVE.clip + '-poster.webp'; im.parentNode.appendChild(pv); governClip(pv);
            var went = function () { if (pv.currentTime > 0.04) pv.classList.add('on'); }; pv.addEventListener('playing', went); pv.addEventListener('timeupdate', went);   /* the still steps aside only once the clip is really moving */
            if (window.IntersectionObserver) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { if (!pv._src) { pv._src = 1; pv.innerHTML = jjClipSrc(SB + CAVE.clip); pv.load(); } var pp = pv.play(); if (pp && pp.catch) pp.catch(function () {}); } else { try { pv.pause(); } catch (x) {} } }); }, { rootMargin: '30% 0px 30% 0px' }).observe(st); };   /* loads as the slide nears, plays only while it is on screen */
          pim.src = SB + CAVE.think; }
        /* THE FIRE (Joe, 2026-09-26): it no longer follows the mouse. It sits on the cave floor in the gap under the shadows; press it to pick it
           up (mouse or touch), carry it and the shadows answer; let go and it settles back onto the floor where it was dropped. The site cursor
           only hides while the fire is in your hand. */
        var SOFT = null, SHARP = null, GX = 0, GY = 0, raySvg = wall.querySelector('.cvrays'), RAYS = [], rock = wall.querySelector('.cvrock'), SW = wall.querySelector('.cvsw'), FW = 40, P = [], CORE = [], LAY = null, LB = { l: 0, t: 0, w: 1, h: 1 }, fire = wall.querySelector('.cvfire'), light = wall.querySelector('.cvlight'), hint = wall.querySelector('.cvhint'), cin = wall.querySelector('.cvin'), clip = wall.querySelector('.cvclip'), lipEl = cov.querySelector('.cvlip');
        var HOME_X = .535, HOME_Y = 1.02, FLOOR = [.97, 1.1], moved = false;   /* home: on the floor line, in the gap under the shadows (re-measured against the art in size()) */
        var W0 = 1, H0 = 1, R = null, fx = HOME_X, fy = HOME_Y, tx = HOME_X, ty = HOME_Y, drag = false, raf = 0, on = false, run = false, t0 = performance.now(), blurs = [], amt = -1;
        /* MAKING IT OBVIOUS (Joe, 2026-09-28: the bouncing was too much): the fire just sits there with its label ("Pick up the fire");
           a beat later the drag hint (jjDragHint: a hand presses on the flame and carries a soft glow of it along a dotted path, then lets
           go) plays every few seconds. The fire never moves on its own. It stops while the pointer is on the fire, vanishes the instant
           the fire is pressed, and once the fire has been picked up the label and the hint are gone for good (sessionStorage). */
        var used = false, hov = false;
        try { used = sessionStorage.getItem('jjmsFireUsed') === '1'; } catch (x) {}
        if (used) wall.classList.add('used');
        var dh = jjDragHint({ gw: 70, gh: 70, ghost: 'radial-gradient(closest-side,rgba(255,214,140,.95),rgba(255,150,60,.55) 45%,rgba(255,120,40,0))', blur: 3, go: .75, delay: 2.1, dur: 4.6 });
        fire.appendChild(dh);
        function hintSync() { dh.classList.toggle('on', run && !used && !drag && !hov); }
        function markUsed() { if (used) return; used = true; wall.classList.add('used'); hintSync(); try { sessionStorage.setItem('jjmsFireUsed', '1'); } catch (x) {} }
        function bind() { P = [].slice.call(SW.querySelectorAll('.cvp')); CORE = P.map(function (p) { return p.querySelector('.cvcore'); }); LAY = SW.querySelector('.cvart'); SOFT = LAY && LAY.querySelector('.cvsoft'); SHARP = LAY && LAY.querySelector('.cvsh:not(.cvsoft)'); blurs = [];
          var n = LAY ? CAVE_ART.pts.length : P.length, h = ''; for (var i = 0; i < n; i++) h += '<line/>'; raySvg.innerHTML = h; RAYS = [].slice.call(raySvg.querySelectorAll('line')); }
        bind();
        var art = SW.querySelector('.cvsh');
        if (art) art.addEventListener('error', function () { if (MODE !== 'art') return; MODE = 'pup'; SW.innerHTML = pupHTML(); Array.prototype.forEach.call(SW.querySelectorAll('img[data-src]'), function (im) { im.src = im.getAttribute('data-src'); im.removeAttribute('data-src'); }); bind(); size(); paint(performance.now()); });   /* the drawn puppets stand in */
        function size() { W0 = wall.offsetWidth || 1; H0 = wall.offsetHeight || 1; FW = fire.offsetWidth || 40; raySvg.setAttribute('viewBox', '0 0 ' + W0 + ' ' + H0);
          if (LAY) { var lh = Math.min(H0 * 1.12, W0 / CAVE_ART.ar), lw = lh * CAVE_ART.ar; LB = { l: (W0 - lw) / 2, t: H0 - lh, w: lw, h: lh };   /* the row as wide as the wall allows, feet on the floor line */
            LAY.style.left = LB.l.toFixed(1) + 'px'; LAY.style.top = LB.t.toFixed(1) + 'px'; LAY.style.width = lw.toFixed(1) + 'px'; LAY.style.height = lh.toFixed(1) + 'px';
            HOME_X = (LB.l + CAVE_ART.home * lw) / W0; } else HOME_X = .535;
          if (!moved) { fx = tx = HOME_X; }
          if (dh) dh.set({ dx: -Math.min(W0 * .2, FW * 3.6), dy: -FW * .7, gw: FW * 1.7, gh: FW * 1.7 }); }
        function rect() { if (!R) R = wall.getBoundingClientRect(); return R; }   /* read only in input handlers, and only once per scroll */
        jjOn(window, 'scroll', function () { R = null; }, { passive: true }); jjOn(window, 'resize', function () { R = null; size(); if (!on) paint(performance.now()); });
        function setOver(o) { document.documentElement.classList.toggle('jjms-fire', o); }
        function local(e) { var r = rect(); return r.width ? { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height } : null; }
        function carry(e) { var q = local(e); if (!q) return; moved = true; tx = Math.min(.98, Math.max(.02, q.x - GX)); ty = Math.min(1.16, Math.max(.2, q.y - GY)); }
        /* the press (Joe, 2026-09-28: the drag icon went back to where the drag started, then jumped): a mouse press is NOT preventDefault-ed any
           more, since that swallowed the mousemoves the site cursor follows, so it froze at the start point (hidden) and reappeared there on
           release. Now it keeps tracking under the carried fire and is simply where the pointer is when it comes back. The fire keeps the
           offset it was grabbed at, so it never snaps its base under the pointer, and the hint is gone the instant it is pressed. */
        fire.addEventListener('pointerdown', function (e) { if (!run || modalBusy() || parseFloat(wall.style.opacity || 1) < .5) return; if (e.pointerType !== 'mouse') e.preventDefault(); e.stopPropagation();
          drag = true; R = null; var q = local(e); GX = q ? q.x - fx : 0; GY = q ? q.y - fy : 0; try { fire.setPointerCapture(e.pointerId); } catch (x) {} wall.classList.add('drag'); dh.classList.add('now'); hintSync(); setOver(true); markUsed(); carry(e); if (!raf) raf = requestAnimationFrame(frame); });
        fire.addEventListener('pointermove', function (e) { if (drag) carry(e); });
        fire.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') { hov = true; hintSync(); } }); fire.addEventListener('pointerleave', function () { hov = false; hintSync(); });
        fire.addEventListener('dragstart', function (e) { e.preventDefault(); });
        function drop() { if (!drag) return; drag = false; wall.classList.remove('drag'); setOver(false); hintSync(); ty = Math.min(FLOOR[1], Math.max(FLOOR[0], ty)); }   /* it settles onto the floor band where it was let go */
        fire.addEventListener('pointerup', drop); fire.addEventListener('pointercancel', drop); fire.addEventListener('lostpointercapture', drop);
        fire.addEventListener('click', function (e) { e.stopPropagation(); });
        fire.addEventListener('keydown', function (e) { var d = e.key === 'ArrowLeft' ? -.06 : e.key === 'ArrowRight' ? .06 : 0; if (!d) return; e.preventDefault(); moved = true; tx = Math.min(.98, Math.max(.02, tx + d)); markUsed(); if (on && !raf) raf = requestAnimationFrame(frame); });
        function ray(i, px, py, x, y) { var L = RAYS[i]; if (!L) return; L.setAttribute('x1', px.toFixed(1)); L.setAttribute('y1', (py - FW * .6).toFixed(1)); L.setAttribute('x2', x.toFixed(1)); L.setAttribute('y2', y.toFixed(1)); }
        function paint(now) { var t = (now - t0) / 1000, k0 = drag ? .42 : .16;
          fx += (tx - fx) * k0; fy += (ty - fy) * k0;
          var px = fx * W0, py = fy * H0, fl = 1 + Math.sin(t * 6.1) * .012 + Math.sin(t * 11.3 + 1.1) * .006 + Math.sin(t * 2.3) * .008;   /* the light's flicker: a few sines, never the same twice */
          var fs = 1 + Math.sin(t * .83) * .006 + Math.sin(t * 1.57 + 1.9) * .004;   /* the SHADOWS only breathe (Joe, 2026-09-28: they pulsated too much): ~4-8s swells of under 1% */
          fire.style.transform = 'translate(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px)' + (drag ? ' scale(1.08)' : '');
          light.style.transform = 'translate(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px) scale(' + (fl * 1.02).toFixed(3) + ')';
          rock.style.opacity = (.9 + (fs - 1) * 3).toFixed(3);   /* the rock breathes with the flame, slowly */
          if (LAY) {   /* ONE layer (the art or the clip): it slides away from the flame, leans away, grows a touch and softens with distance, and flickers */
            var ox = LB.l + LB.w / 2, oy = LB.t + LB.h, cx = ox, cy = LB.t + LB.h * .55, cdx = cx - px, cdy = cy - py, cd = Math.hypot(cdx, cdy) || 1, ck = Math.min(1.1, cd / (W0 * .6)), cnx = cdx / cd,
              cpush = 4 + cd * .025, csc = (.95 + ck * .12) * fs, csk = Math.max(-10, Math.min(10, -cnx * 12 * Math.min(1, Math.abs(cdx) / (W0 * .35)))), cbl = Math.round((.6 + ck * 2.6) * 2) / 2, ctx = cnx * cpush, tk = Math.tan(csk * Math.PI / 180);
            LAY.style.transform = 'translate(' + ctx.toFixed(1) + 'px,0) skewX(' + csk.toFixed(1) + 'deg) scale(' + csc.toFixed(3) + ')';
            LAY.style.opacity = (.94 - ck * .22 + (fs - 1) * 2).toFixed(3);
            if (SOFT && SHARP) { var sa = Math.round(Math.min(1, ck / 1.1) * 40) / 40; if (blurs[0] !== sa) { blurs[0] = sa; SHARP.style.opacity = (1 - sa * .85).toFixed(3); SOFT.style.opacity = (.35 + sa * .65).toFixed(3); } }   /* softer with distance by crossfading a sharp and a soft copy (opacity only: no blur re-raster per step) */
            else if (blurs[0] !== cbl) { blurs[0] = cbl; LAY.style.filter = 'blur(' + cbl + 'px)'; }
            if (drag) CAVE_ART.pts.forEach(function (q, i) { var ax = ox + (LB.l + q[0] * LB.w - ox) * csc, ay = oy + (LB.t + q[1] * LB.h - oy) * csc; ray(i, px, py, ax + tk * (ay - oy) + ctx, ay); }); }   /* faint rays from the flame to each figure, only while it is carried */
          for (var i = 0; i < P.length; i++) { var C = CAVE.puppets[i], bx = C.x / 100 * W0, by = (C.y - C.h / 2) / 100 * H0,
              dx = bx - px, dy = by - py, d = Math.hypot(dx, dy) || 1, k = Math.min(1.1, d / (W0 * .6)), nx = dx / d, ny = dy / d,
              push = 6 + d * .05, sc = (.84 + k * .36) * fs, sk = Math.max(-16, Math.min(16, -nx * 18 * Math.min(1, Math.abs(dx) / (W0 * .35)))),
              bl = Math.round((1 + k * 3.2) * 2) / 2, bob = Math.sin(t * .7 + i * 1.7) * 1.4;   /* further from the flame: bigger, softer, fainter (never a hard edge) */
            P[i].style.transform = 'translate(' + (nx * push).toFixed(1) + 'px,' + (Math.min(0, ny * push * .3) + bob).toFixed(1) + 'px) skewX(' + sk.toFixed(1) + 'deg) scale(' + sc.toFixed(3) + ')';
            P[i].style.opacity = (.9 - k * .32 + (fs - 1) * 2).toFixed(3);
            if (drag) ray(i, px, py, bx + nx * push, by);
            if (blurs[i] !== bl) { blurs[i] = bl; CORE[i].style.filter = 'blur(' + bl + 'px)'; } } }
        function frame(now) { raf = 0; if (!on) return; paint(now); raf = requestAnimationFrame(frame); }
        function playClip(o) { if (!clip) return; if (o) { if (!clip._src) { clip._src = 1; clip.innerHTML = jjClipSrc(SB + CAVE_CLIP); clip.load(); } var pp = clip.play(); if (pp && pp.catch) pp.catch(function () {}); } else { try { clip.pause(); } catch (x) {} } }
        function set(o) { if (o === on) return; on = o;
          if (o) { var lp = cov.querySelector('.cvlip[data-src]'); if (lp) { lp.src = lp.getAttribute('data-src'); lp.removeAttribute('data-src'); } size(); R = null; if (!raf) raf = requestAnimationFrame(frame); }
          else { drop(); cancelAnimationFrame(raf); raf = 0; } playClip(o); }
        size(); paint(t0);   /* placed on the floor before it is ever seen, so nothing starts in a corner */
        /* ARRIVAL (Joe: no disconnect with travel part one): the cave comes in with the scroll, not on a switch. The vignette, the ceiling and the
           wall (fire, light, shadows) all follow one eased amount: nothing until the slide's top is low on the screen, all of it by the time it
           holds the middle, and back out the same way as it leaves. The stage's top edge is feathered, so nothing on it ever shows a straight line. */
        st._cave = function (tr) { var vh = window.innerHeight, aIn = (vh * .92 - tr.top) / (vh * .62), aOut = (tr.bottom - vh * .1) / (vh * .55),
            a = document.hidden ? 0 : Math.max(0, Math.min(1, aIn, aOut)); a = a * a * (3 - 2 * a); a = Math.round(a * 200) / 200;
          if (a !== amt) { amt = a; cov.style.opacity = a; if (lipEl) lipEl.style.transform = 'translateY(' + (-(1 - a) * 102).toFixed(1) + '%)'; cin.style.opacity = a; }
          set(a > 0); var r2 = a > .7; if (r2 !== run) { run = r2; wall.classList.toggle('run', r2); if (r2) dh.classList.remove('now'); hintSync(); } };
        jjOn(document, 'visibilitychange', function () { if (document.hidden) set(false); else if (window.jjmsRender) window.jjmsRender(); });
        closers.push(function () { drop(); });
      })();

      /* the jiggle picks the dealt covers too */
      window.__jjv2 = 1;
    })();

    /* click the opening line and creation happens all over again */
    var litEl = wrap.querySelector('.cap.hero .lit');
    if (litEl) litEl.addEventListener('click', function () {
      steps[0].classList.remove('gen');
      void steps[0].offsetWidth;                                  /* restart the animations */
      genesis();
    });

    function curStep() {
      var mid = window.innerHeight * 0.5;
      var above = -1;
      for (var i = 0; i < steps.length; i++) { var r = steps[i].getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) return i; if (r.top <= mid) above = i; }
      return above;   /* in a gap between two slides (the breath before travel part two) it is still the slide above, not the last one */
    }
    function curYear(idx) {
      if (idx < 0) return Y0;
      var r = steps[idx].getBoundingClientRect();
      var within = Math.max(0, Math.min(1, (window.innerHeight * 0.5 - r.top) / Math.max(1, r.height)));
      var p = idx + within, last = STEPS.length - 1;             /* continuous, 0.5 at the landing */
      if (p <= 0.5) return stepYear[0];                          /* anchors sit at each step's centre (p = i + 0.5) */
      if (p >= last + 0.5) return stepYear[last];
      var i2 = Math.floor(p - 0.5), f = (p - 0.5) - i2;
      return stepYear[i2] + (stepYear[i2 + 1] - stepYear[i2]) * f;
    }

    var lastEra = -1, lastAct = -1, lastBig = null, lastNear = -99, raf = null, genQueued = false;

    /* ---- per-letter FLOAT (continuous, time-driven; amplitude ∝ distance from the screen centre) ----
       The words are dead-still while readable in the middle ~20% of the screen, then float more the
       further they drift away — random per letter (own amplitude/tilt/speed/phase). Runs its own rAF so
       it keeps breathing when the scroll is still; sets `transform` only (scatter uses translate/rotate,
       so the two compose). Amplitude is gated by the caption's LIVE on-screen position every frame. */
    var floatRaf = null, fInStory = false, fIdx = -1;
    /* the pink mouse-follow blob on a hovered headline (see the .blob CSS) */
    var blobCap = null, bmx = 0, bmy = 0, bsx = 0, bsy = 0;
    function blobEnter(cap) {
      blobCap = cap; cap.classList.add('blob'); bsx = bmx; bsy = bmy;   /* snap the smoothed point so it doesn't sweep in from 0,0 */
      var cr = cap.getBoundingClientRect(), sp = cap.querySelectorAll('.ch');
      for (var i = 0; i < sp.length; i++) { var r = sp[i].getBoundingClientRect(); sp[i]._ox = r.left - cr.left; sp[i]._oy = r.top - cr.top; }
      cap._bspans = sp;
    }
    function blobLeave(cap) {
      cap.classList.remove('blob'); if (blobCap === cap) blobCap = null;
      var sp = cap._bspans; if (sp) for (var i = 0; i < sp.length; i++) { sp[i].style.removeProperty('--mx'); sp[i].style.removeProperty('--my'); }
    }
    function blobUpdate() {
      if (!blobCap) return;
      bsx += (bmx - bsx) * 0.2; bsy += (bmy - bsy) * 0.2;          /* lerp toward the cursor = fluid follow */
      var cr = blobCap.getBoundingClientRect(), sp = blobCap._bspans;
      if (sp) for (var b = 0; b < sp.length; b++) {                /* each letter gets the mouse in ITS local space → one continuous blob */
        sp[b].style.setProperty('--mx', (bsx - cr.left - sp[b]._ox).toFixed(1) + 'px');
        sp[b].style.setProperty('--my', (bsy - cr.top - sp[b]._oy).toFixed(1) + 'px');
      }
    }
    function chFloat(el) {                                          /* cache the per-letter float params once */
      var p = el._jjf;
      if (!p) {
        var s = el.style;
        var pd = parseFloat(s.getPropertyValue('--fd')) || 3.4;     /* period (s) */
        var w = 6.2831853 / Math.max(0.6, pd);                      /* angular speed */
        p = el._jjf = {
          ay: (parseFloat(s.getPropertyValue('--fy')) || -9) * 0.8, /* y amplitude (px) */
          ar: (parseFloat(s.getPropertyValue('--fr')) || 4) * 0.8,  /* rotation amplitude (deg) */
          w: w, ph: (Math.abs(parseFloat(s.getPropertyValue('--fdl'))) || 0) * w /* per-letter phase */
        };
      }
      return p;
    }
    function floatEl(el, cen, ramp, dead, t) {                     /* float one text block by its LIVE distance from centre */
      if (!el) return;
      var r = el.getBoundingClientRect();
      var dy = (r.top + r.height / 2) - cen, ad = dy < 0 ? -dy : dy;
      var g = (ad - dead) / ramp; g = g < 0 ? 0 : g > 1 ? 1 : g;   /* 0 in the readable band → 1 far away */
      var chs = el._chs || (el._chs = el.querySelectorAll('.ch'));
      for (var j = 0; j < chs.length; j++) {
        var c = chs[j];
        if (g === 0) { if (c._fon) { c.style.transform = ''; c._fon = false; } continue; }
        var p = chFloat(c);
        var ty = p.ay * g * Math.sin(t * p.w + p.ph);
        var rr = p.ar * g * Math.sin(t * p.w + p.ph + 1.3);
        c.style.transform = 'translateY(' + ty.toFixed(2) + 'px) rotate(' + rr.toFixed(2) + 'deg)';
        c._fon = true;
      }
    }
    function floatTick(now) {
      floatRaf = fInStory ? requestAnimationFrame(floatTick) : null;
      if (!fInStory) return;
      var vh = window.innerHeight, cen = vh * 0.5, t = now / 1000;
      var dead = vh * 0.10, ramp = vh * 0.25;                       /* still in the middle 20%; full float by ~60% out */
      for (var i = Math.max(0, fIdx - 1); i <= Math.min(steps.length - 1, fIdx + 1); i++) {
        if (steps[i].classList.contains('tall')) continue;          /* the cinema step keeps its line still */
        var cap = steps[i].querySelector('.cap');
        if (window.JJ_MS_LETTERS) { if (cap && !cap.classList.contains('hero')) floatEl(cap, cen, ramp, dead, t);
        floatEl(steps[i].querySelector('.sub'), cen, ramp, dead, t); }   /* the per-letter float is retired (perf + Joe's call); JJ_MS_LETTERS brings it back */
      }
      blobUpdate();                                                 /* fluid pink blob on whichever headline is hovered */
    }
    function startFloat() { if (!floatRaf) { fInStory = true; floatRaf = requestAnimationFrame(floatTick); } }
    function stopFloat() { fInStory = false; }                     /* the loop self-cancels on its next tick */

    /* wire the headline blob: track the cursor, and enter/leave per non-hero caption */
    jjOn(document, 'pointermove', function (e) { bmx = e.clientX; bmy = e.clientY; }, { passive: true });
    var blobCaps = wrap.querySelectorAll('.cap:not(.hero)');
    for (var bc = 0; bc < blobCaps.length; bc++) (function (c) {
      c.addEventListener('pointerenter', function () { blobEnter(c); });
      c.addEventListener('pointerleave', function () { blobLeave(c); });
    })(blobCaps[bc]);

    /* the Super Reel secret: read it, then it turns to alien script, lifts off and is gone; a startled alien appears */
    var MYST_GLYPHS = '\u16a0\u16a2\u16a6\u16a8\u16b1\u16b7\u16b9\u16c1\u16c7\u16c9\u16cf\u16d2\u16d6\u16d7\u16da\u16de\u16df\u27c1\u2316\u235c\u2394\u260c\u27df'.split('');
    Array.prototype.forEach.call(document.querySelectorAll('#jjms .step.myst'), function (st) { setTimeout(function () { mystArm(st); }, 0); });   /* bound from the start, not only once the slide is current */
    function mystArm(st) {   /* the secret stays readable (Joe, 2026-09-19); hover it and Wanda flies over and turns it to alien script, leave and it comes back */
      var sub = st.querySelector('.sub'); if (!sub || sub._mystBound) return; sub._mystBound = true; sub.setAttribute('data-cursor', 'hover');
      var unglitch = function () { Array.prototype.forEach.call(sub.querySelectorAll('.ch.gl'), function (c) { c.textContent = c._g; c.classList.remove('gl'); c.style.display = ''; c.style.width = ''; c.style.textAlign = ''; }); };
      sub.addEventListener('mouseenter', function () { unglitch(); st.classList.add('myst-tried'); mystCast(st); }); sub.addEventListener('mouseleave', function () { mystReset(st); });
      var hint = document.createElement('span'); hint.className = 'myhint'; hint.textContent = window.matchMedia && matchMedia('(hover:none)').matches ? 'Tap the secret to decode it' : 'Psst\u2026 hover over the secret'; sub.parentNode.insertBefore(hint, sub.nextSibling);
      setInterval(function () { if (!st.classList.contains('cur') || (st._mt && st._mt.length) || document.hidden) return;   /* now and then a few letters flicker into alien script: a hint something's in there (Joe, 2026-09-25) */
        var chs = Array.prototype.filter.call(sub.querySelectorAll('.ch'), function (c) { return /\S/.test(c.textContent) && !c.classList.contains('mch') && !c.classList.contains('gl'); });
        var pick = [], ws = []; for (var k = 0; k < 3 && chs.length; k++) pick.push(chs[(Math.random() * chs.length) | 0]); pick.forEach(function (c) { ws.push(c.getBoundingClientRect().width); });   /* every read, then every write */
        pick.forEach(function (c, k) { var w = ws[k]; if (c.classList.contains('gl')) return; c._g = c.textContent; c.style.display = 'inline-block'; c.style.width = w.toFixed(2) + 'px'; c.style.textAlign = 'center'; c.textContent = MYST_GLYPHS[(Math.random() * MYST_GLYPHS.length) | 0]; c.classList.add('gl');
          (function (c) { setTimeout(function () { if (c.classList.contains('gl')) { c.textContent = c._g; c.classList.remove('gl'); c.style.display = ''; c.style.width = ''; c.style.textAlign = ''; } }, 160 + Math.random() * 120); })(c); }); }, 2400); }
    function mystCast(st) { var sub = st.querySelector('.sub'); (st._mt || []).forEach(function (t) { clearTimeout(t); clearInterval(t); }); var T = st._mt = [];
      var chs = Array.prototype.slice.call(sub.querySelectorAll('.ch')); var keepAt = chs.map(function (c) { return c.textContent; }).join('').indexOf('But that'); if (keepAt > 0) chs = chs.slice(0, keepAt);   /* 'But that's a secret for now!' stays readable (Joe) */ chs.forEach(function (c) { if (c._orig == null) { c._orig = c.textContent; c._w = c.getBoundingClientRect().width; } }); chs.forEach(function (c) { if (/\S/.test(c._orig)) { c.style.display = 'inline-block'; c.style.width = c._w.toFixed(2) + 'px'; c.style.textAlign = 'center'; } });   /* every letter keeps its box: the line never reflows as it turns */
      chs.forEach(function (c, i) { T.push(setTimeout(function () { if (!/\S/.test(c._orig)) return; c.classList.add('mch'); var n = 0, iv = setInterval(function () { c.textContent = MYST_GLYPHS[(Math.random() * MYST_GLYPHS.length) | 0]; if (++n > 4) clearInterval(iv); }, 80); T.push(iv); }, 350 + i * 12)); }); }
    function mystReset(st) { (st._mt || []).forEach(function (t) { clearTimeout(t); clearInterval(t); }); st._mt = [];
      Array.prototype.forEach.call(st.querySelectorAll('.sub .ch'), function (c) { if (c._orig != null) c.textContent = c._orig; c.classList.remove('mch', 'go'); c.style.transform = ''; c.style.display = ''; c.style.width = ''; c.style.textAlign = ''; });
      var wnd0 = st.querySelector('.srwanda'); if (wnd0 && wnd0.classList.contains('cast')) { wnd0.style.transform = ''; clearTimeout(wnd0._back); wnd0._back = setTimeout(function () { wnd0.classList.remove('cast'); }, 1150); } }   /* she glides back first, then her float resumes from rest: no jump */
    /* ACCESSIBILITY: nothing in the sky may sit behind words. The sky parallaxes, so it cannot be solved at build time: a few
       times a second, anything in the sky whose box touches a caption on screen is faded out, and faded back once clear.
       All the reads happen first, then the writes, so it never forces a second layout. */
    var skyItems = null, dodgeT = 0;
    function dodgeStars() { var now = performance.now(); if (now - dodgeT < 140) return; dodgeT = now;
      if (!skyItems) { var sk = document.getElementById('jjms-sky'); if (!sk) return; skyItems = Array.prototype.slice.call(sk.querySelectorAll('img,.gneb,.gspiral,i,span')).filter(function (n) { return !n.querySelector('img,i,span'); }); }
      var vh = window.innerHeight, boxes = [];
      Array.prototype.forEach.call(document.querySelectorAll('#jjms .step.near .cap,#jjms .step.near .sub,#jjms-hd .hin'), function (t) { var r = t.getBoundingClientRect(); if (r.bottom > 0 && r.top < vh && r.width) boxes.push([r.left - 16, r.top - 10, r.right + 16, r.bottom + 10]); });
      /* (the media dodge that faded photos touching the words is gone: it hid LOTR, Stardust, the archer and the post. Joe, 2026-09-22) */
      var skf = dodgeStars._sf == null ? (dodgeStars._sf = document.documentElement.classList.contains('jjms-skyfar')) : dodgeStars._sf;
      var hits = skyItems.map(function (n) { if (skf && (n.classList.contains('jj-off') || n.parentNode.classList.contains('jj-off'))) return false; var r = n.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh || !r.width) return false;
        for (var b = 0; b < boxes.length; b++) if (r.right > boxes[b][0] && r.left < boxes[b][2] && r.bottom > boxes[b][1] && r.top < boxes[b][3]) return true; return false; });
      for (var q = 0; q < skyItems.length; q++) if (hits[q] !== !!skyItems[q]._dg) { skyItems[q]._dg = hits[q]; skyItems[q].classList.toggle('jj-dodge', hits[q]); } }
    setInterval(dodgeStars, 700);                                /* the sky drifts on its own too */
    jjOn(window, 'resize', function () { for (var rs = 0; rs < steps.length; rs++) steps[rs].__f = null; });   /* the feat stages cache their geometry; a new width means new geometry */
    function render() {
      raf = null; if (asleep) return; dodgeStars(); var _sy = window.scrollY || 0; if (Math.abs(_sy - (render._py == null ? _sy : render._py)) > 2) { render._ly = render._py; } render._py = _sy;   /* _ly = where we were: gives the scroll direction */
      /* the swirl SVG parallaxes UP at ~0.4× the scroll — so it drifts behind the story at its own,
         slower pace (never locked to the timeline). Soft/blurry, so a per-frame translate can't jitter. */
      bgImg.style.translate = '0 ' + (-window.scrollY * 0.4).toFixed(1) + 'px';
      if (SKY_PARALLAX) {                                        /* each size-binned layer drifts at its own speed (bigger = slower) */
        for (var sl = 0; sl < slayers.length; sl++) {
          var f = +slayers[sl].getAttribute('data-f');
          slayers[sl].style.translate = '0 ' + ((1 - f) * window.scrollY).toFixed(0) + 'px';
        }
      }
      if (skyCull) skyCull(window.scrollY || 0);                  /* behind the switch: the sky's far items are hidden (see skyFar) */
      /* the inline player shrinks to a fixed mini bar once its slot scrolls up past the top; the slot's
         own box stays in the flow, so reading its rect can never fight the class we set on it */
      var brk = render._brk || (render._brk = Array.prototype.slice.call(wrap.querySelectorAll('.jjms-tab,.jjscroll,.jjms-reveal')));
      for (var bk = 0; bk < brk.length; bk++) { var bi = brk[bk], bst = bi.closest('.step'); if (!bst) continue; var br = bst.getBoundingClientRect(), ride = 0;
        if (!bi.classList.contains('touched') && !bst.classList.contains('feat') && br.top < 0 && br.bottom > 0) { var mid = bi.classList.contains('jjms-reveal') ? bi.offsetTop + bi.offsetHeight : bi.offsetTop + bi.offsetHeight / 2;
          ride = Math.min(-br.top * 0.9, Math.max(0, bst.offsetHeight - mid - 28)); }
        if (bi._ride !== ride) { bi._ride = ride; bi.style.setProperty('--ride', ride.toFixed(0) + 'px'); } }
      var fr = finale.getBoundingClientRect();                   /* the Big Bang fires as the finale arrives */
      if (!banged && fr.top < window.innerHeight * 0.55) {
        banged = true;
        var bangSeen = false; try { bangSeen = sessionStorage.getItem('jjmsBanged') === '1'; } catch (x) {}
        if (bangSeen) { finale.classList.add('armed', 'go', 'settled'); }   /* seen once this visit: the doors and the exam simply fade in (Joe, 2026-09-30) */ else {
        /* glide to edge-to-edge FIRST — the show only starts once the screen is filled, so the
           bang can never play cut off mid-glide (which is what was happening on the live site) */
        finale.classList.add('armed'); wizArm(); }                       /* the seed appears where the visitor is: no glide, no pin (Joe: no scroll-jack) */
      }
      else if (banged && fr.top > window.innerHeight * 0.88) { banged = false; finale.classList.remove('go', 'settled'); finale.classList.remove('armed'); bg.classList.remove('boom'); }   /* re-arm on the way back up */
      var idx = curStep(), inStory = idx >= 0 && steps[0].getBoundingClientRect().top < window.innerHeight * 0.85;
      if (nearNow) nearNow(idx < 0 ? 0 : idx);   /* behind the switch (skipFar): the slide on screen and its neighbours are drawn in this same frame */
      var last = steps[steps.length - 1].getBoundingClientRect();
      inStory = inStory && last.bottom > window.innerHeight * 0.35;
      tl.classList.toggle('on', inStory); hd.classList.toggle('on', inStory);
      nav.classList.toggle('on', inStory);
      var nxOn = inStory && idx < steps.length - 1 && (!steps[idx].classList.contains('tall') || steps[idx].classList.contains('feat')); nx.classList.toggle('on', nxOn); if (idx >= 0) dressNext(STEPS[idx].era, nxOn);
      if (inStory && !cutSeen && !cutOn) { for (var ci = 0; ci < STEPS.length; ci++) { if (!STEPS[ci].cut) continue; var ctop = steps[ci].getBoundingClientRect().top; if (ctop < window.innerHeight * 0.95 && ctop > -window.innerHeight) { cutPlay(); break; } } }   /* the Taiwan cut-scene, once, as its slide comes into view (before its words can be read) */
      if (inStory) document.documentElement.classList.add('jjms-live');   /* the site nav comes back with the story */
      if (inStory && idx >= 0) { flyShow(STEPS[idx].era); flyPlace(STEPS[idx].era, idx); } else fly.classList.remove('show');   /* the era mascot, on the bar */
      if (inStory && idx >= 0 && window.jjScore && !document.getElementById('jjst')) { var eraNow = STEPS[idx].era;   /* the Videos unlock along the way: past the Precambrian = the first animation; past university = the school films */
        if (eraNow >= 1 && !render._va) { render._va = 1; window.jjScore.award('vid-anim'); } if (eraNow >= 4 && !render._vs) { render._vs = 1; window.jjScore.award('vid-school'); } }
      fIdx = idx; if (inStory) startFloat(); else stopFloat();      /* keep the letter-float running while the story is live */
      /* the growing-film step: --gp runs 0 -> 1 across its scroll. EVERY frame, not just on a step
         change — that's what the whole sequence is driven from. */
      for (var gi = 0; gi < tallSteps.length; gi++) {
        var ts = tallSteps[gi], tr = ts.getBoundingClientRect();
        var gspan = tr.height - window.innerHeight;
        var gp = gspan > 0 ? Math.max(0, Math.min(1, -tr.top / gspan)) : 0;
        var gg = Math.min(1, gp / 0.75);                        /* growth finishes at 75%, then holds */
        /* the last stretch stands the DARKNESS back down — the film itself stays put and the sticky
           stage carries it out of view, which is what makes the handover feel natural */
        var ge = Math.max(0, Math.min(1, (gp - 0.8) / 0.2));
        var gc = ts.__g || (ts.__g = {
          vid: ts.querySelector('.gvid'), dim: ts.querySelector('.gdim'),
          glow: ts.querySelector('.gglow'), logos: ts.querySelector('.glogos'),
          cap: ts.querySelector('.cap'), sub: ts.querySelector('.sub'), hint: ts.querySelector('.ghint')
        });
        /* translate3d + scale3d in ONE `transform` string is the shape the compositor wants — the
           same thing the BBC case-study page does. Writing it straight to the element also beats
           cascading a custom property from the step, which invalidated every descendant's styles
           once per frame; that recalc was the lag. */
        var sc = 0.2 + gg * 0.8, ty = (1 - gg) * -27;
        if (gc.vid) gc.vid.style.transform =
          'translate3d(0,' + ty.toFixed(3) + 'vh,0) scale3d(' + sc.toFixed(4) + ',' + sc.toFixed(4) + ',1)';
        if (gc.dim) gc.dim.style.opacity = Math.min(1, gp * 1.5 * (1 - ge)).toFixed(3);
        if (gc.glow) gc.glow.style.opacity = (gg * 0.9).toFixed(3);
        if (gc.logos) gc.logos.style.opacity = Math.max(0, (1 - gg * 2.4) * 0.92).toFixed(3);
        if (gc.cap) gc.cap.style.opacity = Math.max(0, 1 - gg * 2.6).toFixed(3);
        if (gc.sub) gc.sub.style.opacity = ((0.55 + gg * 0.45) * (1 - ge)).toFixed(3);
        if (gc.hint) gc.hint.style.opacity = Math.max(0, Math.min(1, (gg - 0.4) * 3)).toFixed(3);
        /* the duo step (school films): both cards grow from their design spots into a side-by-side
           feature as the darkness comes up — no autoplay, the play button is the invitation */
        if (!gc.duo && ts.classList.contains('duo')) {
          var dph = ts.querySelectorAll('.phw');
          gc.duo = [
            { el: dph[0], dx: -52.7, dy: 26, sc: 1.5 },
            { el: dph[1], dx: 48.7, dy: -23, sc: 1.5 }
          ];
        }
        if (gc.duo) for (var dq = 0; dq < gc.duo.length; dq++) {
          var D = gc.duo[dq]; if (!D.el) continue;
          var dsc = 1 + (D.sc - 1) * gg;
          D.el.style.transform = 'translate3d(' + (D.dx * gg).toFixed(2) + 'vw,' + (D.dy * gg).toFixed(2) +
            'vh,0) scale3d(' + dsc.toFixed(4) + ',' + dsc.toFixed(4) + ',1)';
        }
        if (ts.classList.contains('feat')) {                     /* FEATURE steps (see STEPS.feat): a sticky stage where, past ~1/4 of the scroll, the text pulls focus and
                                                                     'row'  = the photo sets ride down, grow and loosely line up while everything else slips up and away
                                                                     'hero' = one thing (the trophy) stays, comes to the middle, grows, throws confetti, then goes
                                                                     'think'= the wizard grows into the middle, thinking, then goes — a stand-in for Joe's own art */
          var stg = ts.querySelector('.stage'), F = ts.__f, fm = ts.getAttribute('data-feat') || 'row'; if (ts._cave) ts._cave(tr);   /* Plato's cave: on while the slide holds the middle */
          if (!F && stg) { var sR = stg.getBoundingClientRect(); F = ts.__f = { tr: [], out: [], hero: null };
            var rideSel = fm === 'row' ? '.trav' : fm === 'hero' ? '.jjtrophy,.jjscroll' : fm === 'tabs' ? '.jjms-tab' : fm === 'pair' ? '.aglogo.bima,.aglogo[aria-label="Joe"]' : '.phw.deco';   /* designer Joe's cheer rides with the two BIMA awards and leaves with them */   /* think: the thinking sprite that already stands on the slide takes centre stage; tabs: both tablets */
            Array.prototype.forEach.call(stg.children, function (el) { if (/(^| )(cap|sub|gdim)( |$)/.test(el.className)) return; if (el.classList.contains('jjrewatch')) { F.rw = el; return; }   /* the Taiwan replay waits under the grown tablets */
              if (el.matches(rideSel)) F.tr.push({ el: el, bw: el.offsetWidth, bh: el.offsetHeight, bx: el.offsetLeft + (el.classList.contains('jjms-tab') || el.classList.contains('jjscroll') ? 0 : el.offsetWidth / 2), by: el.offsetTop + (el.classList.contains('jjms-tab') || el.classList.contains('jjscroll') ? 0 : el.offsetHeight / 2),   /* the tablets and the letter are centred by their own translate */ rot: parseFloat(el.style.rotate) || 0, chips: Array.prototype.slice.call(stg.querySelectorAll('.tcc[data-for="' + el.getAttribute('data-trav') + '"]')) }); else if (fm === 'tabs' && el.classList.contains('stag')) return; else if (!(fm === 'row' && el.classList.contains('tcc') && el.getAttribute('data-for') && stg.querySelector('.trav[data-trav="' + el.getAttribute('data-for') + '"]'))) F.out.push(el); });   /* only the row keeps a set's pills riding with it; elsewhere pills leave with their pictures. The tablets' skills stay on stage so they can burst out here */   /* a set's place pills travel WITH it (they read as one thing) */   /* LAYOUT boxes, not painted ones: entrance scales / parallax were skewing the measure (the giant thinker) */
            F.tr.sort(function (a, b) { return a.bx - b.bx; }); }
          if (F) { var fw = window.innerWidth, fh = window.innerHeight, e0 = Math.max(0, Math.min(1, (gp - 0.22) / 0.5)), e = e0 * e0 * (3 - 2 * e0), fo = 0;   /* no fade at the end of the pin: the stage simply scrolls away carrying its content, so there is never a blank screen between it and the next slide (the fade was the Medieval and Ancient gaps) */   /* holds to the very end: the stage then scrolls away carrying its pictures, so the next slide is never met by a blank screen (Joe: the Ancient gap) */
            var soft = ts.getAttribute('data-soft') === '1';
            var capF = gc.cap, subF = gc.sub, upF = (-gp * (tr.height - fh)).toFixed(1); if (capF) capF.style.transform = 'translate3d(0,' + upF + 'px,0)'; if (subF) subF.style.transform = 'translate3d(0,' + upF + 'px,0)';   /* the stage is pinned, so the caption is moved by exactly what has been scrolled: it rides up and off like any other caption (and pulls focus as it leaves the band), while the pictures move at their own rate */
            if (fm === 'row') {
              var SCF = soft ? 1.12 : 1.24, mv = soft ? 0.7 : 1, kN = F.tr.length, slotW = fw * 0.9 / Math.max(1, kN);   /* even slots across the middle 90%: the row fills the screen and reads as one line */
              for (var fq = 0; fq < kN; fq++) { var Tq = F.tr[fq], scF = Math.min(SCF, slotW * 0.86 / Tq.bw), tx = fw * 0.05 + slotW * (fq + 0.5), ty = fh * (fq % 2 ? 0.46 : 0.52);
                var chps = Tq.chips || [];
                if (e <= 0) { Tq.el.style.transform = ''; Tq.el.style.opacity = ''; Tq.el.style.rotate = Tq.rot + 'deg'; chps.forEach(function (c) { c.style.transform = ''; c.style.opacity = ''; }); continue; }
                var dxq = ((tx - Tq.bx) * mv * e), dyq = ((ty - Tq.by) * 0.85 * mv * e);
                Tq.el.style.transform = 'translate3d(' + dxq.toFixed(1) + 'px,' + dyq.toFixed(1) + 'px,0) scale(' + (1 + (scF - 1) * e).toFixed(3) + ')';
                Tq.el.style.rotate = (Tq.rot * (1 - 0.6 * e)).toFixed(2) + 'deg';
                var rb = V2 ? 0.8 : 0.5, opq = ((rb + (1 - rb) * e) * (1 - fo)).toFixed(3); Tq.el.style.opacity = opq;
                chps.forEach(function (c) { c.style.transform = 'translate3d(' + dxq.toFixed(1) + 'px,' + (dyq + Tq.bh * (scF - 1) * 0.5 * e).toFixed(1) + 'px,0)'; c.style.opacity = (1 - fo).toFixed(3); }); }
            } else if (fm === 'pair') {                          /* the two BIMAs: forward and central, a touch bigger, then on */
              for (var pk = 0; pk < F.tr.length; pk++) { var Pk = F.tr[pk], bigP = Math.min(1.35, fw * 0.2 / Pk.bw), txP = fw * (F.tr.length > 1 ? 0.38 + 0.24 * pk / (F.tr.length - 1) : 0.5);
                if (e <= 0) { Pk.el.style.translate = ''; Pk.el.style.scale = ''; Pk.el.style.zIndex = ''; Pk.el.style.opacity = ''; continue; }
                Pk.el.style.translate = ((txP - Pk.bx) * e).toFixed(1) + 'px ' + ((fh * 0.52 - Pk.by) * e).toFixed(1) + 'px'; Pk.el.style.scale = (1 + (bigP - 1) * e).toFixed(3); Pk.el.style.zIndex = '6'; Pk.el.style.opacity = (1 - fo).toFixed(3); }
              F.dimK = 0.4;
            } else if (fm === 'tabs') {                          /* the two tablets: side by side in the middle, growing; the room stays dark until both are broken */
              var nT = F.tr.length, allT = F.tr.every(function (q) { return q.el.classList.contains('touched'); });
              for (var tk = 0; tk < nT; tk++) { var Tk = F.tr[tk], bigT = Math.min(fh * 0.27 / Tk.bh, 2.6), txT = fw * (nT > 1 ? 0.3 + 0.4 * tk / (nT - 1) : 0.5);
                if (Tk.el._stack) { var scx = Tk.bx + (txT - Tk.bx) * Math.max(0, e), scy = Tk.by + (fh * 0.5 - Tk.by) * Math.max(0, e);   /* where the stone is (or would be): the stack follows it */
                  Tk.el._stack.forEach(function (q) { q.pl.style.transform = 'translate(' + (scx + q.dx - q.pl.offsetLeft - q.pl.offsetWidth / 2).toFixed(0) + 'px,' + (scy + q.dy - q.pl.offsetTop - q.pl.offsetHeight / 2).toFixed(0) + 'px)'; }); }
                if (e <= 0 || Tk.el.classList.contains('burst')) { Tk.el.style.translate = e <= 0 ? '' : Tk.el.style.translate; Tk.el.style.scale = ''; Tk.el.style.zIndex = ''; Tk.el.style.opacity = ''; continue; }   /* a burst stone keeps its place but the CSS (opacity 0) must win */
                Tk.el.style.translate = 'calc(-50% + ' + ((txT - Tk.bx) * e).toFixed(1) + 'px) calc(-50% + ' + ((fh * 0.5 - Tk.by) * e).toFixed(1) + 'px + var(--ride,0px))'; Tk.el.style.scale = (1 + (bigT - 1) * e).toFixed(3);
                Tk.el.style.zIndex = '6'; Tk.el.style.opacity = (1 - fo).toFixed(3); }
              F.dimK = allT ? 0.22 : 0.62;
            } else {                                             /* hero / think: one element to the middle, growing */
              for (var fh2 = 0; fh2 < F.tr.length; fh2++) { var Hq = F.tr[fh2], useTf = Hq.el.classList.contains('phw'), isSc = Hq.el.classList.contains('jjscroll'), big = isSc ? Math.min(2.1, fw * 0.3 / Hq.bw) : Math.min(fh * (fm === 'think' ? 0.4 : 0.42) / Hq.bh, fw * 0.34 / Hq.bw, fm === 'think' ? 1.7 : 5);   /* the letter is measured shut, so it takes a modest scale and unrolls inside it */
                if (isSc) { if (e > 0.97 && fo === 0 && !Hq.el.classList.contains('open')) { Hq.el.classList.add('open', 'auto'); } else if (e < 0.5 && Hq.el.classList.contains('auto')) Hq.el.classList.remove('open', 'auto'); }   /* the letter opens at its biggest if nobody has broken the seal, and closes again on the way back */
                var onceV = Hq.el.querySelector('.phonce'); if (onceV && e > 0.25) { if (!onceV._src) { onceV._src = 1; var ob = SB + onceV.getAttribute('data-base'); onceV.innerHTML = '' + jjClipSrc(ob) + ''; onceV.load(); (function (v) { var went = function () { if (v.currentTime > 0.04) { v.classList.add('on'); v._went = true; } }; v.addEventListener('playing', went); v.addEventListener('timeupdate', went); })(onceV); }   /* its own binding: `onceV` is reused by the next stage in the same frame */
                  if (onceV.currentTime > 0.04) { onceV.classList.add('on'); onceV._went = true; }   /* the poster steps aside once the clip has actually moved */
                  if (!onceV._went && onceV.paused) { var op = onceV.play(); if (op && op.catch) op.catch(function () {}); } }   /* keeps asking until it has actually run once */   /* the wizard's wand moment plays once as he grows and holds its last frame */   /* .phw keeps `translate` for its parallax, so it is moved with `transform`; the trophy's own animation owns `transform`, so it is moved with `translate` / `scale` */
                if (e <= 0) { if (useTf) Hq.el.style.transform = ''; else { Hq.el.style.translate = ''; Hq.el.style.scale = ''; } Hq.el.style.opacity = ''; Hq.el.style.zIndex = ''; Hq.el._pt = false; continue; }
                var hx = ((fw / 2 - Hq.bx) * e).toFixed(1), hy = ((fh * 0.5 - Hq.by) * e).toFixed(1), hs = (1 + (big - 1) * e).toFixed(3);
                if (useTf) Hq.el.style.transform = 'translate3d(' + hx + 'px,' + hy + 'px,0) scale(' + hs + ')'; else if (isSc) { Hq.el.style.translate = 'calc(-50% + ' + hx + 'px) calc(-50% + ' + hy + 'px + var(--ride,0px))'; Hq.el.style.scale = hs; } else { Hq.el.style.translate = hx + 'px ' + hy + 'px'; Hq.el.style.scale = hs; }
                Hq.el.style.zIndex = '6'; Hq.el.style.opacity = (1 - fo).toFixed(3);
                if (fm === 'hero' && e > 0.97 && !Hq.el._pt && fo === 0) { Hq.el._pt = true; try { party(Hq.el, { sound: false, glyphs: ['\ud83c\udfc6', '\u2728', '\ud83c\udf89', '\u2b50'] }); } catch (eP) {} }   /* confetti at its biggest (the "woo" comes later) */
                if (e < 0.5) Hq.el._pt = false; }
            }
            for (var fz = 0; fz < F.out.length; fz++) { var Oz = F.out[fz];
              Oz.style.transform = e > 0 ? 'translate3d(0,' + (-e * (soft ? 40 : 62)).toFixed(2) + 'vh,0)' : ''; Oz.style.opacity = e > 0 ? Math.max(0, 1 - e * 1.5).toFixed(3) : ''; }
            var exF = gspan > 0 ? Math.max(0, Math.min(1, (-tr.top - gspan) / window.innerHeight)) : 0;   /* how far past the pin the stage has scrolled: the dark lifts with it, no edge */
            if (F.rw) {   /* THE TAIWAN REPLAY (Joe, 2026-09-28: it sat over the Subjects / Software stacks): it waits in the gap BELOW them, above the Skyrock
                             slide (CSS top), and only comes in once the stage has scrolled on far enough that the stacks are nearly off the top, which is
                             about when the Taipei photos arrive. It rides with the visitor for a short way, then scrolls on and fades before the header pills.
                             Its screen position is worked out from the pin (stage top = -exF * vh) and its cached layout top: no layout read per frame. */
              if (!F.rwY && F.rw.offsetParent) F.rwY = F.rw.offsetTop;
              var rwa = Math.max(0, Math.min(1, (exF - 0.36) / 0.12)), rwo2 = rwa * rwa * (3 - 2 * rwa), rwRide = Math.min(60, Math.max(0, (exF - 0.44) * fh)), rwTy = (1 - rwo2) * 18 + rwRide,
                rwTop = -exF * fh + (F.rwY || 0) + rwTy, rwOp = rwo2 * Math.max(0, Math.min(1, (rwTop - 84) / 90));
              F.rw._rwo = rwo2; F.rw.style.transform = 'translateY(' + rwTy.toFixed(1) + 'px)'; F.rw.style.opacity = rwOp.toFixed(3); F.rw.style.pointerEvents = rwOp > 0.6 ? 'auto' : 'none'; F.rw.classList.toggle('lit', rwo2 > 0.85); }
            var capsF = ts.__caps || (ts.__caps = stg.querySelectorAll(':scope > .cap, :scope > .sub')); for (var cq = 0; cq < capsF.length; cq++) capsF[cq].style.opacity = e > 0.02 ? Math.max(0, 1 - e * 3.2).toFixed(3) : '';   /* gone a third of the way in. the words step back while a feature holds the middle, so nothing ever sits on top of them */
            if (gc.dim) gc.dim.style.opacity = (e * (F.dimK || (soft ? 0.36 : 0.55)) * (1 - fo) * (1 - exF)).toFixed(3); }
        }
        var gv = ts.querySelector('.gvid video');
        if (gv && !gv.getAttribute('src') && tr.top < window.innerHeight * 2.5) gv.setAttribute('src', gv.getAttribute('data-src'));
        if (gv && gv.getAttribute('src')) {                                                /* it starts playing once it's big */
          /* scale is .2 + gg*.8, so half size is gg .375 — it's away the moment it hits that.
             The source is lazy, so the first play() can reject before any data has arrived; retry
             once the browser says it can play rather than hammering it every frame. */
          if (gg >= 0.375 && gv.paused && !lightboxOpen) {
            var gpr = gv.play();
            if (gpr && gpr.catch) gpr.catch(function () {
              if (!gv.__retry) { gv.__retry = 1; gv.addEventListener('canplay', function () {
                var p2 = gv.play(); if (p2 && p2.catch) p2.catch(function () {});
              }, { once: true }); }
            });
          } else if (gg < 0.3 && !gv.paused) { try { gv.pause(); } catch (eG) {} }
        }
      }
      /* George + Greybeard go sticky on the covid screen: once the reader scrolls past halfway they
         ride along, growing, then dissolve just before the next scene arrives */
      var vikStep = null;
      if (vikStep && Math.abs(8 - idx) <= 1) {
        var vk = vikStep.__vik || (vikStep.__vik = Array.prototype.slice.call(
          vikStep.querySelectorAll('.phw.deco[data-tap]')));
        var vrR = vikStep.getBoundingClientRect();
        var riding = vrR.top < 0 && vrR.bottom > -window.innerHeight * 0.2;
        for (var vq = 0; vq < vk.length; vq++) {
          var VE = vk[vq];
          if (riding) {
            var leave = Math.min(1, -vrR.top / (vrR.height * 0.92));
            var vsc = 1 + leave * 0.65;
            var vop = leave < 0.72 ? 1 : Math.max(0, 1 - (leave - 0.72) / 0.22);
            VE.classList.add('vik-ride');
            VE.style.transform = 'translate3d(0,' + (-vrR.top).toFixed(1) + 'px,0) scale3d(' +
              vsc.toFixed(3) + ',' + vsc.toFixed(3) + ',1)';
            VE.style.opacity = vop.toFixed(3);
          } else if (VE.classList.contains('vik-ride')) {
            VE.classList.remove('vik-ride');
            VE.style.transform = ''; VE.style.opacity = '';
          }
        }
      }
      /* ---- the brands follow you into the awards (steps 9 -> 10): BBC + Art Basel travel down and hover over UIC x Fantasy,
         then UCL over Foolproof, each landing with confetti. The steps clip their own children, so the travellers are
         position:fixed CARRIERS interpolated between the real logo's live box and a spot above its target; the real logo
         hides while its carrier is out. Rect reads happen only while one of the two slides is on screen. */
      if (idx === 8 || idx === 9) { var CR = render._cr;
        if (!CR) { CR = render._cr = []; [['UCL', 'Foolproof', 0, 1], ['BBC', 'UIC Digital \u00d7 Fantasy', -0.30, 1.7], ['Art Basel', 'UIC Digital \u00d7 Fantasy', 0.34, 1.7]].forEach(function (c) {
            var src = steps[8].querySelector('.aglogo[aria-label="' + c[0] + '"]'), tgt = steps[9].querySelector('.aglogo[aria-label="' + c[1] + '"]'); if (!src || !tgt) return;
            var el = document.createElement('div'); el.className = 'jjms-carry'; el.innerHTML = '<img src="' + src.querySelector('img').getAttribute('src') + '" alt="">'; wrap.appendChild(el);
            CR.push({ src: src, tgt: tgt, el: el, ox: c[2], late: c[3], done: false }); }); }
        var vhC = window.innerHeight, tC = Math.max(0, Math.min(1, 1 - steps[9].getBoundingClientRect().top / vhC));
        for (var cq2 = 0; cq2 < CR.length; cq2++) { var Cq = CR[cq2], p0 = Math.pow(Math.max(0, Math.min(1, (tC - 0.05) / 0.78)), Cq.late), pC = p0 * p0 * (3 - 2 * p0);   /* late is now an exponent: BBC and Art Basel start with UCL but arrive after it */
          if (tC <= 0.02) { Cq.el.style.opacity = '0'; Cq.src.style.opacity = ''; Cq.done = false; continue; }
          Cq.src.style.opacity = '0';
          var a = Cq.src.getBoundingClientRect(), b = Cq.tgt.getBoundingClientRect(), wC = a.width * (1 - 0.12 * pC), hC = wC * (a.height / a.width);
          var ax = a.left + a.width / 2, ay = Math.max(a.top + a.height / 2, hC / 2 + 28), bx = b.left + b.width / 2 + Cq.ox * b.width, by = b.top - hC * 0.55;   /* a brand whose home has already scrolled off the top starts from just inside the screen, not from above it */
          Cq.el.style.width = wC.toFixed(1) + 'px'; Cq.el.style.opacity = '1';
          Cq.el.style.transform = 'translate3d(' + (ax + (bx - ax) * pC - wC / 2).toFixed(1) + 'px,' + (ay + (by - ay) * pC - hC / 2).toFixed(1) + 'px,0)';
          Cq.el.classList.toggle('land', pC >= 1);
          if (pC >= 1 && !Cq.done) { Cq.done = true; try { party(Cq.el, { sound: false, glyphs: ['\ud83c\udfc6', '\u2728', '\ud83c\udf89', '\u2b50'] }); } catch (eC) {} } else if (pC < 0.6) Cq.done = false; }
      } else if (render._cr) { for (var cz = 0; cz < render._cr.length; cz++) { render._cr[cz].el.style.opacity = '0'; render._cr[cz].src.style.opacity = ''; } }
      /* only the step on screen + its neighbours carry live per-letter animations (see the .near CSS) */
      if (idx !== lastNear) {
        lastNear = idx;
        for (var nr = 0; nr < steps.length; nr++) { steps[nr].classList.toggle('near', Math.abs(nr - idx) <= 1); if (Math.abs(nr - idx) > 1) steps[nr].classList.remove('cur', 'leaving'); }
      }
      if (idx < 0) return;
      /* Photos ride the scroll: they lag behind the text (parallax), and shrink away to nothing as
         their step leaves the middle of the screen — then come back the same way on the way up. */
      for (var pi = Math.max(0, idx - 1); pi <= Math.min(steps.length - 1, idx + 1); pi++) {
        var sEl = steps[pi], ph = sEl.querySelectorAll('.phw');
        var sr = sEl.getBoundingClientRect(), vh = window.innerHeight;
        var off = sr.top + sr.height / 2 - vh / 2;                 /* + when the step sits below centre */
        if (!sEl.classList.contains('live') && Math.abs(off) < vh * 0.9) {
          if (pi === 0 && !sEl.classList.contains('gen')) {         /* the opening frame waits for the light */
            if (!genQueued && !document.getElementById('jjst')) { genQueued = true; setTimeout(genesis, 700); }
          } else sEl.classList.add('live');
        }
        if ((window.JJ_MS_TEXT || 'wordsfocus') === 'wordsfocus') (function (el) {   /* the caption's own place decides: in the middle band = .cur (words step in), out of it = .leaving (focus pull) */
          var cpe = el._cap || (el._cap = el.querySelector('.cap')); if (!cpe) return;
          var cr = (el.classList.contains('v2') || el.classList.contains('v2cab') ? el : cpe).getBoundingClientRect(), d = (cr.top + cr.height / 2 - vh / 2) / vh, isCur = el.classList.contains('cur');   /* d: + below centre, in screens */
          var down = (window.scrollY || 0) >= (render._ly || 0), lead = down ? d : -d;                          /* lead: + = still on its way in, - = on its way out */
          var inBand = lead < 0.40 && lead > -0.31;                 /* IN sooner (40% out from centre), OUT ~5% earlier than before (31%) */
          if (!isCur && inBand) { clearTimeout(el._lt); el.classList.remove('leaving'); el.classList.add('cur', 'seen'); keepTextClear(el); if (window.jjmsDream && STEPS[steps.indexOf(el)] && STEPS[steps.indexOf(el)].dream) window.jjmsDream();   /* the awards dream, first arrival */ if (el.id === 'jjms-step-0' && (!WOKEN || MSD.lifted)) window.jjSay && window.jjSay('let-there-be-joe', { wait: true });   /* m-1008b: under the tale's cover (woken, not lifted yet) the line waits for the light (genesis): it was spoken the moment the slide was built, before the tale's own 'that was really something' */ if (el.classList.contains('myst')) mystArm(el); }
          else if (isCur && !inBand) { el.classList.remove('cur'); el.classList.add('leaving'); clearTimeout(el._lt); el._lt = setTimeout(function () { el.classList.remove('leaving'); }, 750); }
        })(sEl);
        if (sEl._srRow) { var sra = Math.max(0, Math.min(1, (sr.top + sEl._srRowY - vh * 0.03) / (vh * 0.32))); sra = Math.round(sra * sra * (3 - 2 * sra) * 100) / 100;   /* Super Reel: the phones fade out as they float up off the screen (Joe, 2026-09-28) */
          if (sEl._srA !== sra) { sEl._srA = sra; sEl._srRow.style.opacity = sra; } }
        if (SDA) continue;                                         /* the compositor drives everything below */
        /* ---- fallback for browsers without CSS scroll timelines (e.g. Firefox default, old Safari) ----
           Runs for EVERY step, so the words shrink + float even on steps that carry no photos. */
        /* one concentrated ramp (matches the single CSS animation): everything moves together */
        var m = Math.max(-1, Math.min(1, off / (vh * 0.6))), am = Math.abs(m);
        var cp = sEl.querySelector('.cap'), sb = sEl.querySelector('.sub');
        var wTr = (-m * 0.11 * window.innerWidth).toFixed(1) + 'px ' + (m * 0.06 * vh).toFixed(1) + 'px', wSc = (1 - 0.5 * am).toFixed(3);
        if (cp) { cp.style.translate = wTr; cp.style.opacity = (1 - am).toFixed(3); cp.style.scale = wSc; }
        if (sb) { sb.style.opacity = (0.62 * (1 - am)).toFixed(3); sb.style.scale = wSc; }   /* sub grows/shrinks + fades */
        var away = Math.min(1, Math.abs(off) / (vh * 0.78)), fade = away * away;
        if (!ph.length) continue;                                  /* the rest is just the photos */
        if (sEl.classList.contains('duo')) continue;               /* the duo step drives its own cards */
        var op = (1 - fade).toFixed(3), sc = (1 - 0.45 * fade).toFixed(3);
        for (var pj = 0; pj < ph.length; pj++) {
          if (ph[pj].classList.contains('vik-ride')) continue;     /* riding with the reader */
          var conf = (PHOTOS[pi] || [])[pj] || {};
          ph[pj].style.translate = '0 ' + (-off * (conf.d || 0.12 + pj % 4 * 0.07)).toFixed(1) + 'px';
          var sh = ph[pj].firstChild;                              /* .phs — the shrink/fade layer */
          sh.style.opacity = op; sh.style.scale = sc;
        }
      }

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
      var markerY = window.innerHeight * MARKER_VH;
      var yy = Math.max(Y0, Math.min(Y1, curYear(idx)));         /* the number never runs past 1995…2026 */
      ruler.style.transform = 'translateY(' + (markerY - (yy - Y0) * PX_PER_YEAR).toFixed(1) + 'px)';
      var big = Math.round(yy);
      if (big !== lastBig) {
        lastBig = big;
        for (var m = 0; m < ylEls.length; m++) ylEls[m].classList.toggle('big', +ylEls[m].getAttribute('data-y') === big);
        /* the job belonging to the live year lights up with it */
        for (var jm = 0; jm < jobEls.length; jm++) jobEls[jm].classList.toggle('cur', +jobEls[jm].getAttribute('data-y') === big);
      }
    }
    function onScroll() { if (!raf) raf = requestAnimationFrame(render); }
    window.jjmsRender = onScroll;
    jjOn(window, 'scroll', onScroll, { passive: true });
    jjOn(window, 'resize', onScroll);
    render();

    /* ---- the landing: the story opens ON its first frame, fully composed ----
       Whatever sits above the story (Webflow page furniture, the intro's own spacer) would
       otherwise leave the reader on an empty sky, so we put them on step 1 instead. */
    function stepTop(i) { return steps[i].getBoundingClientRect().top + window.scrollY; }
    function jump(y) {
      var L = window.lenis || window.__lenis;                    /* the site scrolls with Lenis */
      if (L && typeof L.scrollTo === 'function') { try { L.scrollTo(y, { immediate: true }); return; } catch (e) {} }
      window.scrollTo(0, y);
    }
    /* Pull the story up over whatever sits above it so its first frame IS the top of the document.
       (Clamping the scroll instead makes the page shudder — it fights the scroller's momentum.)
       The page above stays put, hidden behind the fixed starry backdrop. */
    var lift = 0, landed = false;
    function collapseAbove() {
      wrap.style.marginTop = '0px';
      var natural = wrap.getBoundingClientRect().top + window.scrollY;
      lift = natural;
      wrap.style.marginTop = (-natural) + 'px';
      return natural;
    }
    /* "Let there be Joe!" — light floods the void. It has to land in the clear, so if the intro's
       black is still lifting we wait for it to go before striking. */
    /* KEEP THE WORDS CLEAR (Joe, 2026-09-24: 'images overlapping or behind text'): when a slide settles, any picture sitting on the
       caption or its sub-line drifts aside, up or down, whichever is the shorter move that keeps it on the stage. Once per slide per size. */
    function keepTextClear(stepEl) {
      var stg = stepEl.querySelector('.stage') || stepEl, key = window.innerWidth + 'x' + window.innerHeight; if (stepEl._ktc === key) return; stepEl._ktc = key;
      var zones = []; stg.querySelectorAll(':scope > .cap, :scope > .sub').forEach(function (t) { var rg = document.createRange(); rg.selectNodeContents(t);
        [].slice.call(rg.getClientRects()).forEach(function (q) { if (q.width > 4) zones.push({ l: q.left - 14, r: q.right + 14, t: q.top - 12, b: q.bottom + 12 }); }); });
      if (!zones.length) return;
      var sr = stg.getBoundingClientRect();
      [].slice.call(stg.children).forEach(function (el) { if (/(^| )(cap|sub|gdim|flare|gring|stag|jjrewatch|ffly|dfield|dust|seed|jjcab-back|jjcab-doors|bima|fgm|jjg|jja|jjc-marq|jjc-strip|jjc-wall|jjc-wallw|jja-rib|jjl-card|myhint|jjcave-wall|srmon|srphones)( |$)/.test(el.className) || el.tagName === 'SCRIPT') return;
        var r = el.getBoundingClientRect(); if (r.width < 20 || r.height < 20 || r.width > sr.width * .8) return;
        var hz = zones.filter(function (q) { return r.right > q.l && r.left < q.r && r.bottom > q.t && r.top < q.b; }); if (!hz.length) return;
        var Z = hz.reduce(function (a, q) { return { l: Math.min(a.l, q.l), r: Math.max(a.r, q.r), t: Math.min(a.t, q.t), b: Math.max(a.b, q.b) }; });   /* only the lines it actually covers */
        var slackW = r.width * .15, slackH = r.height * .15, opts = [];                             /* up, down, left or right: the shortest move that stays (mostly) on the stage */
        [[0, Z.t - r.bottom], [0, Z.b - r.top], [Z.l - r.right, 0], [Z.r - r.left, 0]].forEach(function (m) {
          var nl = r.left + m[0], nt = r.top + m[1];
          if (nl >= sr.left - slackW && nl + r.width <= sr.right + slackW && nt >= sr.top - slackH && nt + r.height <= sr.bottom + slackH) opts.push(m); });
        if (!opts.length) return; opts.sort(function (a, b) { return Math.abs(a[0]) + Math.abs(a[1]) - Math.abs(b[0]) - Math.abs(b[1]); });
        var mv = opts[0], mt = parseFloat(el.style.marginTop) || 0, ml = parseFloat(el.style.marginLeft) || 0;
        el.style.transition = (el.style.transition ? el.style.transition + ',' : '') + 'margin .7s cubic-bezier(.3,.7,.3,1)';
        if (mv[1]) el.style.marginTop = (mt + mv[1]).toFixed(0) + 'px'; if (mv[0]) el.style.marginLeft = (ml + mv[0]).toFixed(0) + 'px'; });
    }
    jjOn(window, 'resize', function () { steps.forEach(function (s0) { if (s0._ktc) { s0._ktc = null; [].slice.call((s0.querySelector('.stage') || s0).children).forEach(function (c) { c.style.marginTop = ''; c.style.marginLeft = ''; }); } }); });
    /* ---- the trophy cabinet: a press swings the glass doors open, the light comes on, the silvers shine and Joe cheers ---- */
    steps.forEach(function (st) { var dr = st.querySelector('.jjcab-doors'); if (!dr) return; st.classList.add('v2cab');
      /* the BIMA statues: once Joe's art exists it takes the logo's place on the top shelf, stood on the shelf, at most 9.2 cabinet units tall */
      Object.keys(CABINET.bima || {}).forEach(function (from) { var im = st.querySelector('.aglogo.bima img[src$="' + from + '"], .aglogo.bima img[data-lsrc$="' + from + '"]'); if (!im) return; var pre = new Image();   /* the era's images may be parked (src moved to data-lsrc until the era is near), so match either */
        pre.onload = function () { var ar = pre.naturalWidth / pre.naturalHeight || 1, h = Math.min(9.2, 8.4 / ar), agin = im.parentNode, sh = agin.querySelector('.agshine');
          if (im.hasAttribute('data-lsrc')) im.setAttribute('data-lsrc', pre.src); else im.src = pre.src; agin.style.width = 'calc(' + (h * ar).toFixed(2) + ' * var(--cu))'; agin.style.margin = 'calc(' + (9.2 - h).toFixed(2) + ' * var(--cu)) auto 0'; if (sh) sh.style.setProperty('--m', 'url(' + pre.src + ')'); agin.parentNode.classList.add('statue'); };
        pre.src = SB + CABINET.bima[from]; });
      st.querySelectorAll('.cabaw').forEach(function (a) { a.addEventListener('click', function (e) { e.stopPropagation(); a.classList.remove('pop'); void a.offsetWidth; a.classList.add('pop'); var sh = a.querySelector('.agshine'); sh.style.animation = 'none'; void sh.offsetWidth; sh.style.animation = 'jjShine 1.05s cubic-bezier(.4,0,.25,1)'; sh.style.opacity = '1'; setTimeout(function () { sh.style.animation = ''; sh.style.opacity = ''; }, 1100); }); });
      function openCab(e) { if (e) { e.preventDefault(); e.stopPropagation(); } if (st.classList.contains('cab-open')) return; st.classList.add('cab-open');
        st.querySelectorAll('.aglogo.bima .agshine').forEach(function (sh, i) { setTimeout(function () { sh.style.animation = 'none'; void sh.offsetWidth; sh.style.animation = ''; }, 700 + i * 250); });
        var joe = st.querySelector('.aglogo[aria-label="Joe"]'); if (joe) setTimeout(function () { joe.click(); }, 900);   /* he cheers as the doors swing */
        if (window.jjSay) window.jjSay('tada', { delay: 500 }); }
      dr.addEventListener('click', openCab);
      var cc = st.querySelector('.jjcab-close'); if (cc) cc.addEventListener('click', function (e) { e.stopPropagation(); st.classList.remove('cab-open'); });   /* the doors swing shut again */ dr.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') openCab(e); }); });
    /* ---- the Figma canvas: runs while the design-life slide is on screen ---- */
    (function () {
      var st = steps.filter(function (x) { return x.querySelector('.fgm'); })[0]; if (!st) return;
      var fgm = st.querySelector('.fgm'), curs = [].slice.call(st.querySelectorAll('.fgc:not(.me)')), me = st.querySelector('.fgc.me'), logos = [].slice.call(st.querySelectorAll('.aglogo')), typed = false, run = false, raf = 0;
      var NS = 'http://www.w3.org/2000/svg', svg = st.querySelector('.fgm-draw'), texts = st.querySelector('.fgm-texts'), art = [], tool = 'move', frames = 0;
      function typeCap() { if (typed) return; typed = true; var cap = st.querySelector('.cap'); if (!cap) return;
        var walker = document.createTreeWalker(cap, NodeFilter.SHOW_TEXT), nodes = [], n; while ((n = walker.nextNode())) nodes.push(n);
        var chars = []; nodes.forEach(function (tn) { var f = document.createDocumentFragment(); tn.nodeValue.split('').forEach(function (ch) { var sp = document.createElement('span'); sp.className = 'fch'; sp.textContent = ch; f.appendChild(sp); chars.push(sp); }); tn.parentNode.replaceChild(f, tn); });
        var caret = document.createElement('i'); caret.className = 'fcaret'; cap.classList.add('fgtext'); if (chars[0]) chars[0].parentNode.insertBefore(caret, chars[0]);
        var k = 0; (function step() { if (k >= chars.length) { setTimeout(function () { caret.remove(); cap.classList.remove('fgtext'); }, 1400); return; } chars[k].classList.add('v'); chars[k].after(caret); k++; setTimeout(step, 38 + (chars[k - 1].textContent === ' ' ? 30 : 0)); })(); }
      function drawFrames() { logos.forEach(function (l, i) { setTimeout(function () { l.classList.add('fdraw'); setTimeout(function () { l.classList.remove('fdraw'); }, 950); }, 300 + i * 140); }); }
      /* colleagues' cursors: unhurried, they linger (Joe: slower, less often) */
      var S = curs.map(function (c, i) { return { el: c, x: .1 + Math.random() * .8, y: .2 + Math.random() * .6, tx: .5, ty: .5, wait: 800 + i * 900, sel: null, col: getComputedStyle(c).getPropertyValue('--c').trim(), name: c.querySelector('b').textContent }; });
      function zones() { var fr2 = fgm.getBoundingClientRect(); return [].slice.call(st.querySelectorAll('.cap, .sub, .fgm-bar, .fgm-sticky, .fgm-btn')).map(function (t) { var q = t.getBoundingClientRect(); return { l: (q.left - fr2.left - 40) / fr2.width, r: (q.right - fr2.left + 40) / fr2.width, t: (q.top - fr2.top - 30) / fr2.height, b: (q.bottom - fr2.top + 30) / fr2.height }; }); }
      function logoOf(t) { for (var q = 0; q < logos.length; q++) if (logos[q].getAttribute('aria-label') === t) return logos[q]; return null; }
      /* anchored to the logo ARTWORK (not the button box), as fractions of it + a few px: the target is re-read from the logo every
         frame, so a cursor stays on its project while the logos fly in and bob (they were placed mid-flight before — Joe: 'not aligned') */
      function near(c, l, onIt) { var fx, fy, ox = 0, oy = 0, sd = Math.floor(Math.random() * 4), al = .15 + Math.random() * .7;
        if (onIt) { fx = .25 + Math.random() * .5; fy = .3 + Math.random() * .45; }
        else if (sd === 0) { fx = al; fy = 0; oy = -12; } else if (sd === 1) { fx = al; fy = 1; oy = 4; } else if (sd === 2) { fx = 0; fy = al; ox = -14; } else { fx = 1; fy = al; ox = 4; }   /* just off one edge of their project */
        c.anc = { el: l.querySelector('.agin img, .agin video') || l, fx: fx, fy: fy, ox: ox, oy: oy }; c.target = onIt ? l : null; }
      function ancT(c, fr) { var r = c._ar; if (!r || !r.width) return; c.tx = Math.max(.02, Math.min(.96, (r.left + r.width * c.anc.fx + c.anc.ox - fr.left) / fr.width)); c.ty = Math.max(.1, Math.min(.92, (r.top + r.height * c.anc.fy + c.anc.oy - fr.top) / fr.height)); }
      function pick(c) { if (c.sel) { c.sel.classList.remove('fsel'); c.sel.style.removeProperty('--sc'); c.sel = null; }
        var free = logos.filter(function (l) { return !l.classList.contains('fsel'); });
        var home = (FG_TEAM[c.name] || []).map(logoOf).filter(Boolean);
        if (FG_BOSS[c.name] && logos.length) { var bl = home.length && Math.random() < .35 ? home[0] : logos[Math.floor(Math.random() * logos.length)]; near(c, bl, Math.random() < .6); c.wait = 2400 + Math.random() * 2600; return; }   /* the bosses do the rounds */
        if (home.length) { near(c, home[Math.floor(Math.random() * home.length)], Math.random() < .45); c.wait = 2200 + Math.random() * 3800; return; }   /* the team sticks to its own project */
        c.anc = null;
        if (Math.random() < 0.55 && free.length) { near(c, free[Math.floor(Math.random() * free.length)], true); }
        else { var zs = zones(); for (var tries = 0; tries < 14; tries++) { c.tx = .08 + Math.random() * .84; c.ty = .16 + Math.random() * .7; if (!zs.some(function (z) { return c.tx > z.l && c.tx < z.r && c.ty > z.t && c.ty < z.b; })) break; } c.target = null; }
        c.wait = 2800 + Math.random() * 4200; }
      var last = 0;
      function tick(t) { raf = 0; if (!run) return; var dt = last ? Math.min(50, t - last) : 16; last = t; var fr = fgm.getBoundingClientRect(), nowT = performance.now();
        S.forEach(function (c) { c._ar = c.anc ? c.anc.el.getBoundingClientRect() : null; });   /* every read first, then the writes */
        S.forEach(function (c) { if (c.anc) { ancT(c, fr); if (nowT < (c._snap || 0)) { c.x = c.tx; c.y = c.ty; } }   /* riding in with its logo */
          var dx = c.tx - c.x, dy = c.ty - c.y, d = Math.hypot(dx, dy);
          if (d > 0.004) { var sp = Math.min(1, dt / 16 * 0.016); c.x += dx * sp; c.y += dy * sp; }
          else { if (c.target && !c.sel) { c.sel = c.target; c.sel.style.setProperty('--sc', c.col); c.sel.classList.add('fsel'); c.el.classList.add('clk'); (function (el) { setTimeout(function () { el.classList.remove('clk'); }, 260); })(c.el); } c.wait -= dt; if (c.wait <= 0) pick(c); }
          c.el.style.transform = 'translate(' + (c.x * fr.width).toFixed(1) + 'px,' + (c.y * fr.height).toFixed(1) + 'px)'; });
        raf = requestAnimationFrame(tick); }
      function start() { if (run) return; run = true; st.classList.add('fg-on'); if (st._skSync) st._skSync(); typeCap(); drawFrames(); S.forEach(function (c) { var h = (FG_TEAM[c.name] || []).map(logoOf).filter(Boolean)[0]; if (h && !c._placed) { c._placed = 1; near(c, h, false); c._snap = performance.now() + 1500; } c.tx = c.x; c.ty = c.y; }); if (!raf) raf = requestAnimationFrame(tick); }
      function stop() { run = false; st.classList.remove('fg-on'); if (st._skSync) st._skSync(); me.classList.remove('on'); S.forEach(function (c) { if (c.sel) { c.sel.classList.remove('fsel'); c.sel = null; } }); }
      new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && e.intersectionRatio > .45) start(); else if (!e.isIntersecting || e.intersectionRatio < .2) stop(); }); }, { threshold: [0, .2, .45, .7] }).observe(st);
      /* your own cursor gets a Joe tag, in the colour of the current theme */
      st.addEventListener('pointermove', function (e) { if (!run || e.pointerType === 'touch') return; var fr = fgm.getBoundingClientRect(); me.style.transform = 'translate(' + (e.clientX - fr.left) + 'px,' + (e.clientY - fr.top) + 'px)'; me.classList.add('on'); });
      st.addEventListener('pointerleave', function () { me.classList.remove('on'); });
      /* ---- the tools: frame, rectangle, pen, text; undo and clear ---- */
      function setTool(t) { tool = t; st.querySelectorAll('.fb-t[data-tool]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-tool') === t); }); fgm.classList.toggle('drawing', t === 'frame' || t === 'rect' || t === 'pen'); fgm.classList.toggle('texting', t === 'text'); }
      function sync() { fgm.classList.toggle('has-art', art.length > 0);
        if (art.length && window.jjScore) { var lastA = art[art.length - 1], rq = lastA.getBoundingClientRect(); window.jjScore.award('easel', { x: rq.left + rq.width / 2, y: rq.top }); } }   /* the Renaissance unlock: your first mark on the canvas (a frame, a shape, text or a line) */
      st.querySelectorAll('.fb-t[data-tool]').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); setTool(b.getAttribute('data-tool')); }); });
      jjOn(window, 'keydown', function (e) { if (e.key === 'Escape' && tool !== 'move') { e.preventDefault(); e.stopImmediatePropagation(); setTool('move'); } }, true);   /* Esc drops the tool, and only that (it would otherwise open the site menu) */
      function pt(e) { var r = svg.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
      var drag = null;
      svg.addEventListener('pointerdown', function (e) { if (tool === 'move') return; e.preventDefault(); e.stopPropagation(); var p0 = pt(e);
        if (tool === 'text') { var tx = document.createElement('div'); tx.className = 'ftx'; tx.contentEditable = 'true'; tx.spellcheck = false; tx.textContent = 'Type something'; tx.style.left = p0.x + 'px'; tx.style.top = (p0.y - 12) + 'px'; texts.appendChild(tx); art.push(tx); sync(); tickDone(3);
          setTimeout(function () { tx.focus(); var rg = document.createRange(); rg.selectNodeContents(tx); var sl = getSelection(); sl.removeAllRanges(); sl.addRange(rg); }, 20); return; }
        svg.setPointerCapture(e.pointerId); var g;
        if (tool === 'pen') { g = document.createElementNS(NS, 'path'); g.setAttribute('d', 'M' + p0.x + ' ' + p0.y); g.setAttribute('fill', 'none'); g.setAttribute('stroke', getComputedStyle(fgm).getPropertyValue('--acc').trim() || '#FF00F5'); g.setAttribute('stroke-width', '3'); g.setAttribute('stroke-linecap', 'round'); g.setAttribute('stroke-linejoin', 'round'); svg.appendChild(g); }
        else { g = document.createElementNS(NS, 'g'); var rc = document.createElementNS(NS, 'rect'); rc.setAttribute('x', p0.x); rc.setAttribute('y', p0.y); rc.setAttribute('width', 0); rc.setAttribute('height', 0);
          if (tool === 'frame') { rc.setAttribute('fill', 'rgba(255,255,255,.08)'); rc.setAttribute('stroke', 'rgba(255,255,255,.55)'); var lb = document.createElementNS(NS, 'text'); lb.setAttribute('class', 'fr-l'); lb.setAttribute('x', p0.x); lb.setAttribute('y', p0.y - 6); lb.textContent = 'Frame ' + (++frames); g.appendChild(lb); }
          else { rc.setAttribute('fill', 'rgba(12,140,233,.16)'); rc.setAttribute('stroke', '#0C8CE9'); rc.setAttribute('rx', 4); }
          rc.setAttribute('stroke-width', '1.5'); g.insertBefore(rc, g.firstChild); svg.appendChild(g); g._rc = rc; }
        drag = { g: g, x0: p0.x, y0: p0.y, pen: tool === 'pen', d: 'M' + p0.x + ' ' + p0.y }; });
      svg.addEventListener('pointermove', function (e) { if (!drag) return; var p = pt(e);
        if (drag.pen) { drag.d += ' L' + p.x.toFixed(1) + ' ' + p.y.toFixed(1); drag.g.setAttribute('d', drag.d); return; }
        var x = Math.min(p.x, drag.x0), y = Math.min(p.y, drag.y0), w = Math.abs(p.x - drag.x0), h = Math.abs(p.y - drag.y0); var rc = drag.g._rc; rc.setAttribute('x', x); rc.setAttribute('y', y); rc.setAttribute('width', w); rc.setAttribute('height', h);
        var lb = drag.g.querySelector('text'); if (lb) { lb.setAttribute('x', x); lb.setAttribute('y', y - 6); } });
      svg.addEventListener('pointerup', function () { if (!drag) return; var g = drag.g, small = !drag.pen && +g._rc.getAttribute('width') < 6 && +g._rc.getAttribute('height') < 6; drag = null;
        if (small) { g.remove(); return; } art.push(g); sync(); tickDone(3); });   /* the tool stays in your hand until you pick another (Joe, 2026-09-25) */
      st.querySelector('.fb-undo').addEventListener('click', function (e) { e.stopPropagation(); var last = art.pop(); if (last) last.remove(); sync(); });
      st.querySelector('.fb-clear').addEventListener('click', function (e) { e.stopPropagation(); art.forEach(function (x) { x.remove(); }); art = []; frames = 0; sync(); setTool('move'); });
      /* ---- rename the file ---- */
      var fname = st.querySelector('.fb-name'); try { var sv = localStorage.getItem('jjFigName'); if (sv) fname.textContent = sv; } catch (x) {}
      st.querySelector('.fb-file').addEventListener('click', function (e) { e.stopPropagation(); if (fname.isContentEditable) return; fname.contentEditable = 'true'; fname.focus(); var rg = document.createRange(); rg.selectNodeContents(fname); var sl = getSelection(); sl.removeAllRanges(); sl.addRange(rg); });
      function commitName() { fname.contentEditable = 'false'; var v = fname.textContent.trim().slice(0, 40) || 'Joe’s Journey'; fname.textContent = v; try { localStorage.setItem('jjFigName', v); } catch (x) {} }
      fname.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); fname.blur(); } e.stopPropagation(); });
      fname.addEventListener('blur', commitName);
      /* ---- follow a colleague: their cursor grows and jiggles, the canvas wears their colour ---- */
      var followT = 0;
      st.querySelectorAll('.fb-av[data-k]').forEach(function (av) { av.addEventListener('click', function (e) { e.stopPropagation(); var c = S[+av.getAttribute('data-k')]; if (!c) return;
        c.el.classList.remove('hi'); void c.el.offsetWidth; c.el.classList.add('hi'); setTimeout(function () { c.el.classList.remove('hi'); }, 1100);
        var fl = st.querySelector('.fgm-follow'); fl.textContent = 'Following ' + c.name; fgm.style.setProperty('--fc', c.col); fgm.classList.add('following'); clearTimeout(followT); followT = setTimeout(function () { fgm.classList.remove('following'); }, 3200); }); });
      /* press a project: the people who worked on it jiggle, and the pill names them */
      logos.forEach(function (l) { l.addEventListener('click', function () { var t = l.getAttribute('aria-label'), team = S.filter(function (c) { return (FG_TEAM[c.name] || []).indexOf(t) >= 0; }); if (!team.length) return;
        team.forEach(function (c) { c.el.classList.remove('hi'); void c.el.offsetWidth; c.el.classList.add('hi'); near(c, l, false); c.wait = 3000; (function (el) { setTimeout(function () { el.classList.remove('hi'); }, 1100); })(c.el); });
        var fl = st.querySelector('.fgm-follow'); fl.textContent = t + ': ' + team.map(function (c) { return c.name; }).join(', ').replace(/, ([^,]*)$/, ' & $1'); fgm.style.setProperty('--fc', team[0].col); fgm.classList.add('following'); clearTimeout(followT); followT = setTimeout(function () { fgm.classList.remove('following'); }, 3200); }); });
      st.querySelector('.fb-av.more').addEventListener('click', function (e) { e.stopPropagation(); st.querySelector('.fb-avs').classList.add('all'); });
      /* ---- share: a real share card for the portfolio ---- */
      st.querySelector('.fb-share').addEventListener('click', function (e) { e.stopPropagation(); var old = document.getElementById('jj-fgshare'); if (old) old.remove();
        var url = location.origin + '/', t = 'Joe’s Journey — the portfolio of Joe Jackson, designer', eu = encodeURIComponent(url), et = encodeURIComponent(t);
        var o = document.createElement('div'); o.id = 'jj-fgshare'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', 'Share');
        o.innerHTML = '<div class="c"><button type="button" class="x" aria-label="Close">×</button><h4>Share Joe’s Journey</h4><p>Anyone with the link can explore the whole adventure.</p><div class="ln"><input readonly value="' + url + '"><button type="button" class="cp">Copy link</button></div>' +
          '<div class="so"><a target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=' + eu + '">LinkedIn</a><a target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?url=' + eu + '&text=' + et + '">X</a><a target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=' + eu + '">Facebook</a><a target="_blank" rel="noopener" href="https://wa.me/?text=' + et + '%20' + eu + '">WhatsApp</a><a href="mailto:?subject=' + et + '&body=' + eu + '">Email</a>' + (navigator.share ? '<button type="button" class="nat">More…</button>' : '<span></span>') + '</div></div>';
        document.body.appendChild(o); requestAnimationFrame(function () { o.classList.add('on'); });
        function close() { o.classList.remove('on'); setTimeout(function () { o.remove(); }, 320); }
        o.addEventListener('click', function (ev) { var b = ev.target.closest('button'); if (ev.target === o || (b && b.classList.contains('x'))) close();
          else if (b && b.classList.contains('cp')) { var inp = o.querySelector('input'); (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).catch(function () { inp.select(); document.execCommand('copy'); }); b.textContent = 'Copied!'; setTimeout(function () { b.textContent = 'Copy link'; }, 1600); }
          else if (b && b.classList.contains('nat')) { navigator.share({ title: 'Joe’s Journey', text: t, url: url }).catch(function () {}); } }); });
      /* ---- the post-it: a to-do list (drag it, edit it, both = an achievement; untick the website and you're locked out) ---- */
      var sk = st.querySelector('.fgm-sticky'), dragOff = null, moved = 0, locked = false;
      function row(i) { return sk.querySelector('.sk-row[data-i="' + i + '"]'); }
      function tickDone(i) { if (locked) return; var r = row(i); if (r.classList.contains('done')) return; r.classList.add('done'); checkBoth(); }
      function checkBoth() { if (row(1).classList.contains('done') && row(2).classList.contains('done') && window.jjScore) { var r = sk.getBoundingClientRect(); window.jjScore.award('todo', { x: r.left + r.width / 2, y: r.top }); } }
      /* the drag hint (Joe, 2026-09-28: the same one as the cave's fire): a hand grabs the grip and carries a soft ghost of the note to the
         right, every few seconds, until the note has been dragged once (or while the pointer is on it) */
      var skDh = jjDragHint({ ghost: 'linear-gradient(#FFE17A,#FFE17A)', blur: 7, go: .34, delay: 1.8, dur: 4.8 }), skHov = false, skDragged = false, skSized = 0;
      skDh.style.left = '50%'; skDh.style.top = '2px'; sk.appendChild(skDh);
      function skSync() { var on = st.classList.contains('fg-on') && !skDragged && !skHov && !locked && !dragOff;
        if (on && !skSized) { skSized = 1; var w = sk.offsetWidth, h = sk.offsetHeight; skDh.set({ dx: Math.round(w * .62), dy: Math.round(h * .22), gw: w, gh: h, gx: -w / 2, gy: -8 }); }
        skDh.classList.toggle('on', on); }
      st._skSync = skSync; jjOn(window, 'resize', function () { skSized = 0; });
      sk.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') { skHov = true; skSync(); } }); sk.addEventListener('pointerleave', function () { skHov = false; skSync(); });
      /* a mouse press is not preventDefault-ed (that swallowed the mousemoves the site cursor follows: it froze where the drag started and
         jumped on release); the canvas box is measured once per press, not on every move */
      var skFr = null;
      sk.querySelector('.sk-grip').addEventListener('pointerdown', function (e) { if (locked) return; if (e.pointerType !== 'mouse') e.preventDefault(); e.stopPropagation(); var r = sk.getBoundingClientRect(); skFr = fgm.getBoundingClientRect(); dragOff = { x: e.clientX - r.left, y: e.clientY - r.top, sx: e.clientX, sy: e.clientY }; moved = 0; sk.classList.add('drag'); skDh.classList.add('now'); skSync(); try { e.target.setPointerCapture(e.pointerId); } catch (x) {} });
      sk.querySelector('.sk-grip').addEventListener('pointermove', function (e) { if (!dragOff) return; var fr = skFr; sk.style.left = ((e.clientX - dragOff.x - fr.left) / fr.width * 100).toFixed(2) + '%'; sk.style.top = ((e.clientY - dragOff.y - fr.top) / fr.height * 100).toFixed(2) + '%'; moved = Math.hypot(e.clientX - dragOff.sx, e.clientY - dragOff.sy); });
      function skUp() { if (!dragOff) return; dragOff = null; sk.classList.remove('drag'); if (moved > 24) { skDragged = true; tickDone(1); } skSync(); }
      sk.querySelector('.sk-grip').addEventListener('pointerup', skUp); sk.querySelector('.sk-grip').addEventListener('pointercancel', skUp); sk.querySelector('.sk-grip').addEventListener('lostpointercapture', skUp);
      sk.querySelectorAll('.sk-t').forEach(function (t) { t.addEventListener('input', function () { tickDone(2); }); t.addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); t.blur(); } }); });
      sk.querySelectorAll('.sk-box').forEach(function (bx) { bx.addEventListener('click', function (e) { e.stopPropagation(); if (locked) return; var r = bx.parentNode, i = +r.getAttribute('data-i');
        if (i === 0 && r.classList.contains('done')) {             /* you untick "Make awesome website"? Right. */
          r.classList.remove('done'); locked = true; sk.classList.add('locked'); sk.removeAttribute('data-cursor'); skSync(); sk.querySelectorAll('.sk-t').forEach(function (t) { t.contentEditable = 'false'; });
          var no = sk.querySelector('.sk-no'), msg = 'No more edit access for you!', k = 0; (function ty() { if (k > msg.length) return; no.textContent = msg.slice(0, k++); setTimeout(ty, 45); })(); return; }
        r.classList.toggle('done'); if (r.classList.contains('done')) checkBoth(); }); });
      /* ---- recolour the button (and it really does hire Joe) ---- */
      var cta = st.querySelector('.fgm-cta'); st.querySelectorAll('.fgm-sw i').forEach(function (sw) { sw.addEventListener('click', function (e) { e.stopPropagation(); st.querySelectorAll('.fgm-sw i').forEach(function (o) { o.classList.remove('on'); }); sw.classList.add('on'); cta.style.setProperty('--bc', sw.getAttribute('data-c')); }); });
      /* Hire Joe asks first: leave for Contact, or stay on the canvas (Joe, 2026-09-24). Same Figma-dialog look as Share. */
      cta.addEventListener('click', function (e) { e.stopPropagation(); var old = document.getElementById('jj-fgshare'); if (old) old.remove();
        var o = document.createElement('div'); o.id = 'jj-fgshare'; o.className = 'ask'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', 'Hire Joe');
        o.innerHTML = '<div class="c"><button type="button" class="x" aria-label="Close">×</button><h4>Hire Joe?</h4><p>Do you want to leave to go to Contact, or stay here and keep playing?</p><div class="so two"><button type="button" class="stay">Stay here</button><a class="cp go" href="/contact">Go to Contact</a></div></div>';
        document.body.appendChild(o); requestAnimationFrame(function () { o.classList.add('on'); }); var gb = o.querySelector('.go'); if (gb) gb.focus();
        function close() { o.classList.remove('on'); setTimeout(function () { o.remove(); }, 320); }
        o.addEventListener('click', function (ev) { var b = ev.target.closest('button'); if (ev.target === o || (b && (b.classList.contains('x') || b.classList.contains('stay')))) close(); });
        o.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') { ev.stopPropagation(); close(); } }); });
    })();
    function genesis() {
      if (steps[0].classList.contains('gen')) return;
      steps[0].classList.add('gen'); steps[0].classList.add('live');
      if (window.jjSay) window.jjSay('let-there-be-joe', { wait: true });   /* m-1008b: spoken as the light lands (it queues behind the tale's last line if that is still being said; said once) */
      setTimeout(function () { steps[0]._ktc = null; keepTextClear(steps[0]); }, 2800);   /* once the photos have landed from the flash, nudge any that sit on the words */
      bg.classList.add('genesis');
      setTimeout(function () { bg.classList.remove('genesis'); }, 2600);
    }
    /* press the line and Jim says it again; pressing while he is still talking does nothing, so he always gets to finish */
    (function () { var c0 = steps[0] && steps[0].querySelector('.cap'); if (!c0) return; c0.setAttribute('data-cursor', 'hover'); c0.style.cursor = 'pointer'; c0.style.pointerEvents = 'auto';
      c0.addEventListener('click', function () { if (window.jjSay) window.jjSay('let-there-be-joe', { again: true });
        var fl = steps[0].querySelector('.flare'); if (fl && !c0._fl) { c0._fl = 1; steps[0].classList.remove('gen'); void fl.offsetWidth; steps[0].classList.add('gen'); setTimeout(function () { c0._fl = 0; }, 1800); } }); })();   /* the light flares again with it */
    function land() {
      collapseAbove(); landed = true; jump(0); render();
      if (!document.getElementById('jjst')) { setTimeout(genesis, 420); return; }
      if (MSD.contract) return;                                    /* jj:mystory-lift is the cue (see lifted()); below: an older storytime.js that sends nothing */
      var t0 = Date.now();
      var gw = setInterval(function () {
        var el = document.getElementById('jjst');
        if (el && parseFloat(getComputedStyle(el).opacity) > 0.02 && Date.now() - t0 < 5000) return;
        clearInterval(gw); setTimeout(genesis, 220);
      }, 100);
    }
    /* ---- the soundtrack: the same ambient the homepage plays ----
       One looping file, no third parties, and the same moon sound button in the same corner — so the
       site sounds and controls like one place. Mute is shared with the rest of the site through the
       sessionStorage key the homepage already reads/writes (jjUserMuted). */
    var AMB_SRC = 'https://cdn.prod.website-files.com/6a19b8f4191d4fbca532591e/6a19b8f4191d4fbca53259a5_Lotro-ambient.mp3';
    var AMB_TARGET = 0.6, AMB_DUCK = 0.14, amb = null, ambFade = null;
    var ambStarted = false, ambDucked = false, userMuted = false;
    /* On the live storytime page site-footer.js has ALREADY started this exact track through Howler
       and built the moon button — playing our own copy on top doubles the music. If the site's
       ambient exists we drive THEIRS (duck/unduck via the Howl) and start nothing ourselves. */
    var EXTA = (window.jjAudio && window.jjAudio.ambient) ? window.jjAudio : null;
    try { userMuted = sessionStorage.getItem('jjUserMuted') === '1'; } catch (e) {}
    function ambEl() {
      if (!amb) {
        amb = new Audio(AMB_SRC);
        amb.loop = true; amb.preload = 'auto'; amb.volume = 0;
        window.jjMsAmbient = amb;                 /* a handle for the console + future site glue */
      }
      return amb;
    }
    function ambFadeTo(target, ms) {
      clearInterval(ambFade);
      var a = ambEl(), from = a.volume, t0 = Date.now();
      ambFade = setInterval(function () {
        var k = Math.min(1, (Date.now() - t0) / ms);
        try { a.volume = Math.max(0, Math.min(1, from + (target - from) * k)); } catch (e) {}
        if (k >= 1) clearInterval(ambFade);
      }, 40);
    }
    function ambLevel() { return ambDucked ? AMB_DUCK : AMB_TARGET; }
    function startAmbient() {
      if (EXTA || ambStarted || userMuted) return;
      var a = ambEl(), pr = a.play();
      if (pr && pr.then) {
        pr.then(function () { ambStarted = true; ambFadeTo(ambLevel(), 5000); },
                function () {});                      /* blocked — a later gesture will get it */
      } else { ambStarted = true; ambFadeTo(ambLevel(), 5000); }
    }
    setTimeout(startAmbient, 3000);                   /* begin a few seconds in, like home */
    ['click', 'scroll', 'touchstart', 'keydown'].forEach(function (ev) {
      jjOn(window, ev, function onG() {
        jjOff(window, ev, onG);
        startAmbient();
      }, { passive: true });
    });
    /* videos and the celebration sfx would talk over it, so it steps aside and back */
    function duckMusic(hard) {                          /* hard=true silences it completely */
      if (ambDucked) return;
      ambDucked = true;
      var lvl = hard ? 0 : AMB_DUCK;
      if (EXTA) { try { if (!EXTA.muted) EXTA.ambient.fade(EXTA.ambient.volume(), lvl, 600); } catch (e) {} return; }
      if (ambStarted && !userMuted) ambFadeTo(lvl, 600);
    }
    function unduckMusic() {
      if (!ambDucked) return;
      ambDucked = false;
      if (EXTA) {
        try { if (!EXTA.muted) EXTA.ambient.fade(EXTA.ambient.volume(), EXTA.ambientTarget || AMB_TARGET, 1400); } catch (e) {}
        return;
      }
      if (ambStarted && !userMuted) setTimeout(function () { ambFadeTo(AMB_TARGET, 1400); }, 260);
    }
    function setMuted(m) {
      userMuted = m;
      try { sessionStorage.setItem('jjUserMuted', m ? '1' : '0'); } catch (e) {}
      if (EXTA) { if (m) stopSound(); return; }       /* the site's own button/mute handles the music */
      if (m) { ambFadeTo(0, 250); stopSound(); }
      else if (!ambStarted) startAmbient();           /* the unmute click is itself the gesture */
      else ambFadeTo(ambLevel(), 900);
    }
    /* ---- the moon sound button, ported from the homepage ---- */
    var sndBtn = document.getElementById('jj-sound-btn');
    if (sndBtn) {
      /* the site's script owns the button and writes jjUserMuted first (it attached first) — we
         just resync our flag from storage so the sfx/celebrations respect the choice */
      sndBtn.addEventListener('click', function () {
        var m = false;
        try { m = sessionStorage.getItem('jjUserMuted') === '1'; } catch (e) {}
        setMuted(m);
      });
    } else {
      sndBtn = document.createElement('button');
      sndBtn.id = 'jj-sound-btn';
      sndBtn.className = 'jjms-made';
      sndBtn.setAttribute('aria-label', 'Toggle sound');
      var sfill = document.createElement('div'); sfill.className = 'jj-sound-fill'; sndBtn.appendChild(sfill);
      [{ w: 11, h: 11, l: 13, t: 15, o: 0.20 }, { w: 7, h: 7, l: 41, t: 32, o: 0.14 },
       { w: 8, h: 8, l: 24, t: 43, o: 0.12 }].forEach(function (cr) {
        var d = document.createElement('div');
        d.className = 'jj-crater';
        d.style.cssText = 'width:' + cr.w + 'px;height:' + cr.h + 'px;left:' + cr.l + 'px;top:' + cr.t + 'px;opacity:' + cr.o + ';';
        sndBtn.appendChild(d);
      });
      var sndBars = [];
      for (var sbi = 0; sbi < 5; sbi++) {
        var sb2 = document.createElement('div'); sb2.className = 'jj-bar';
        sndBtn.appendChild(sb2); sndBars.push(sb2);
      }
      var mist = document.createElement('div'); mist.id = 'jj-sound-mist'; mist.className = 'jjms-made';
      var mistBars = [];
      for (var mbi = 0; mbi < 5; mbi++) {
        var mb = document.createElement('div'); mb.className = 'jj-mist-bar';
        mist.appendChild(mb); mistBars.push(mb);
      }
      document.body.appendChild(mist); document.body.appendChild(sndBtn);
      if (userMuted) sndBtn.classList.add('is-muted');
      /* it only fades in once the story has actually landed (the intro overlay owns the screen first) */
      var sndShow = setInterval(function () {
        if (!landed) return;
        clearInterval(sndShow);
        setTimeout(function () { sndBtn.classList.add('on'); mist.classList.add('on'); }, 2000);
      }, 200);
      /* the pink fill grows out of wherever the cursor entered */
      sndBtn.addEventListener('mouseenter', function (e) {
        var r = sndBtn.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        var size = Math.max(Math.hypot(x, y), Math.hypot(r.width - x, y),
                            Math.hypot(x, r.height - y), Math.hypot(r.width - x, r.height - y)) * 2.4;
        sfill.style.width = size + 'px'; sfill.style.height = size + 'px';
        sfill.style.left = (x - size / 2) + 'px'; sfill.style.top = (y - size / 2) + 'px';
        sfill.style.transform = 'scale(1)'; sfill.style.opacity = '1';
      });
      sndBtn.addEventListener('mouseleave', function () {
        sfill.style.transform = 'scale(0)'; sfill.style.opacity = '0';
      });
      sndBtn.addEventListener('click', function () {
        setMuted(!userMuted);
        sndBtn.classList.toggle('is-muted', userMuted);
      });
      /* the bars sway to a slow breath — no analyser (the CDN file is cross-origin), and throttled to
         ~30fps with the mist at half that, so the whole thing costs next to nothing */
      var sndFrame = 0, sndCur = [0, 0, 0, 0, 0], SND_GAIN = [0.45, 0.75, 1, 0.75, 0.45];
      (function sndTick() {
        requestAnimationFrame(sndTick);
        if (++sndFrame % 2) return;
        var t = performance.now() / 1000;
        var driver = (userMuted || !ambStarted) ? 0 : (0.42 + 0.34 * Math.sin(t * 2)) * (ambDucked ? 0.4 : 1);
        for (var bi = 0; bi < 5; bi++) {
          var tg = Math.max(0, Math.min(1, driver * SND_GAIN[bi] + 0.08 * Math.sin(t * 3.4 + bi * 0.55)));
          if (userMuted) tg = 0;
          sndCur[bi] += (tg - sndCur[bi]) * 0.28;
          sndBars[bi].style.height = (5 + sndCur[bi] * 29).toFixed(1) + 'px';
          if (!(sndFrame % 4)) mistBars[bi].style.height = (10 + sndCur[bi] * 60).toFixed(1) + 'px';
        }
      })();
    }

    /* ---- the History Exam ----
       Six questions drawn from a bigger pool, every sitting different, options shuffled. Everything
       asked is on this page. The gimmick: an evolution track — every right answer HOPS you along the
       page's own sprite line, and your final form takes the bow on the results card. The user plans
       extra questions about site-wide easter eggs (Matrix nods on home, the binary in the horizontal
       scroll, their top film) — those need their answers before they can go in. */
    /* (2026-09-17) FOUR SECTIONS, five questions each, asked in this order: Home, Credits, Storytime, My Story. Each section
       draws its five from its own pool (shuffled), so a sitting still differs. o[0] is always the truth.
       `check:true` = written from what I know of the site but NOT confirmed by Joe — confirm or replace before launch. */
    var QUIZ_SECTIONS = [
      { name: 'Home', pool: [
        { q: 'What does the wizard say once he has finished explaining the choice?', o: ['Take your pick!', 'Choose wisely!', 'Off you go!', 'Good luck, traveller!'] },
        { q: 'At the end of the homepage you choose between…', o: ['Story Time and Work', 'Games and Films', 'Past and Future', 'Light and Dark'] },
        { q: 'The grumpy red alien always peeks in from the…', o: ['Right', 'Left', 'Top', 'Bottom'] },
        { q: 'What does the homepage loader ask you to do?', o: ['Keep the sound on', 'Rotate your phone', 'Accept cookies', 'Scroll faster'] },
        { q: 'How many site themes can be unlocked?', o: ['Five', 'Three', 'Four', 'Seven'], check: true },
        { q: 'Which film gets a nod in the “pixels and code” scene?', o: ['The Matrix', 'Tron', 'Blade Runner', 'WarGames'], check: true }
      ] },
      { name: 'Credits', pool: [
        { q: 'Who stars in the game at the end of the credits?', o: ['Trogdor', 'Greybeard the Grey', 'The wizard', 'George'] },
        { q: 'How do you steer him?', o: ['Up and down', 'Left and right', 'With the mouse wheel', 'You can’t, he flies himself'] },
        { q: 'What is the highest level in the credits game?', o: ['9', '5', '10', '99'] },
        { q: 'In the credits game you should…', o: ['Catch the good items and dodge the hazards', 'Burn every cottage', 'Collect only coins', 'Avoid everything'] },
        { q: 'Where do you find the credits?', o: ['From the menu, on the Contact page', 'Hidden in the footer', 'Only after the quiz', 'On the 404 page'], check: true }
      ] },
      { name: 'Storytime', pool: [
        { q: 'What is the dragon’s full title?', o: ['Trogdor The Burninator', 'Trogdor The Terrible', 'Smaug The Golden', 'Greybeard the Grey'] },
        { q: 'What did the villagers call our hero?', o: ['Joe the Righteous', 'Joe the Brave', 'Sir Joe of Brighton', 'Joe the Designer'] },
        { q: 'Trogdor had a fascination for gold, jewels, treasures and…', o: ['The local villagers', 'Sheep', 'Wizards', 'Castles'] },
        { q: 'What appeared in the stone arch?', o: ['A glowing purple swirl', 'A golden door', 'A sleeping dragon', 'A mirror'] },
        { q: 'Who were quietly watching Joe in the forest?', o: ['Little forest spirits', 'Wolves', 'The villagers', 'Trogdor'] },
        { q: 'Who are you left with at the end of Part One?', o: ['Designer Joe', 'Trogdor', 'The wizard', 'Nobody'] }
      ] },
      { name: 'My Story', pool: [
        { q: 'What did I go to Brighton to study?', o: ['BSc Digital Media', 'BSc Computer Science', 'BA Illustration', 'BSc Marine Biology'] },
        { q: 'I was awarded a scholarship to work for a year in…', o: ['Taipei, Taiwan', 'Tokyo, Japan', 'Seoul, South Korea', 'Bangkok, Thailand'] },
        { q: 'I made it to Mexico for which celebration?', o: ['Días de los Muertos', 'Cinco de Mayo', 'La Tomatina', 'Carnaval'] },
        { q: 'How many titles have I rated on iMDB?', o: ['Over 1700', 'About 300', 'Around 900', 'Over 5000'] },
        { q: 'My two BIMA silver awards were for…', o: ['Best Digital Transformation', 'Best App Design', 'Best Digital Campaign', 'Best New Agency'] },
        { q: 'Which film did I watch very young that “still holds up”?', o: ['Seven Samurai', 'The Prestige', 'Interstellar', 'Spirited Away'] },
        { q: 'Which game did I play the most?', o: ['World of Warcraft', 'The Sims 2', 'Mario Kart', 'FIFA 10'] }
      ] }
    ];
    var QUIZ_PER = 5;
    var QUIZ_N = QUIZ_SECTIONS.length * QUIZ_PER;
    var QUIZ_RANKS = [                                   /* [min score, rank, line] */
      [20, 'Court Historian', 'Flawless. You clearly gazed at every star.'],
      [14, 'Loyal Squire', 'Sharp eyes — just a couple of scrolls short of legend.'],
      [8, 'Time Tourist', 'You caught the highlights… the details, less so.'],
      [0, 'Were you even scrolling?', 'The history books are right there. Fancy another run?']
    ];
    var quiz = document.createElement('div'); quiz.id = 'jjms-quiz';
    wrap.appendChild(quiz);
    var quizOpen = false, qSet = [], qIdx = 0, qScore = 0;
    var calmQ = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function qSprite(score) {                            /* score 0..N mapped across the whole line */
      var i = Math.round(score / QUIZ_N * (SPRITES.length - 1));
      return SPRITES[Math.max(0, Math.min(SPRITES.length - 1, i))];
    }
    function shuffled(arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    }
    /* every screen swap: the old card is thrown left, the new one springs in from the right */
    function qSwap(html, after) {
      var old = quiz.querySelector('.qcard');
      function put() {
        quiz.innerHTML = '<div class="qcard"><div class="qtin">' + html + '</div></div>';
        if (after) after();
      }
      if (old && !calmQ) { old.classList.add('out'); setTimeout(put, 230); } else put();
    }
    /* the cursor tilts the sheet, gently */
    var qMx = 0, qMy = 0, qTiltQueued = false;
    quiz.addEventListener('mousemove', function (e) {
      if (!quizOpen || calmQ) return;
      qMx = e.clientX; qMy = e.clientY;
      if (qTiltQueued) return;
      qTiltQueued = true;
      requestAnimationFrame(function () {
        qTiltQueued = false;
        var c = quiz.querySelector('.qtin'); if (!c) return;
        var r = c.getBoundingClientRect();
        var dx = (qMx - r.left) / r.width - 0.5, dy = (qMy - r.top) / r.height - 0.5;
        c.style.transform = 'perspective(950px) rotateX(' + (-dy * 5).toFixed(2) + 'deg) rotateY(' + (dx * 6).toFixed(2) + 'deg)';
      });
    });
    quiz.addEventListener('mouseleave', function () {
      var c = quiz.querySelector('.qtin'); if (c) c.style.transform = '';
    });
    /* a little gold burst wherever an answer lands well */
    function qSparkle(el) {
      if (calmQ) return;
      var r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var COLS = ['#FFD028', '#FFE785', '#FFB01F', '#FFFFFF', '#FF6FE8'];
      for (var i = 0; i < 12; i++) {
        var sp = document.createElement('span');
        sp.className = 'qspark';
        var ang = Math.PI * 2 * i / 12 + Math.random() * 0.5, d = 34 + Math.random() * 46;
        sp.style.cssText = 'left:' + cx + 'px;top:' + cy + 'px;background:' + COLS[i % COLS.length] +
          ';--sx:' + (Math.cos(ang) * d).toFixed(0) + 'px;--sy:' + (Math.sin(ang) * d).toFixed(0) + 'px;';
        quiz.appendChild(sp);
        (function (n) { setTimeout(function () { n.remove(); }, 750); })(sp);
      }
    }
    function qPlusOne(el) {
      if (calmQ) return;
      var r = el.getBoundingClientRect();
      var pl = document.createElement('span');
      pl.className = 'qplus'; pl.textContent = '+1';
      pl.style.left = (r.right - 26) + 'px'; pl.style.top = (r.top - 6) + 'px';
      quiz.appendChild(pl);
      setTimeout(function () { pl.remove(); }, 900);
    }
    function qTrackHtml() {
      var t = '';
      for (var i = 0; i <= QUIZ_N; i++)
        t += '<i class="qtick" style="left:' + (2 + i * 96 / QUIZ_N).toFixed(2) + '%"></i>';
      return '<div class="qtrack">' + t +
        '<img class="qspr" src="' + qSprite(qScore) + '" alt="" ' +
        'style="left:' + (2 + qScore * 96 / QUIZ_N).toFixed(2) + '%"></div>';
    }
    /* a right answer hops you a notch along the line — and mid-hop, you evolve */
    function qAdvanceSprite() {
      var img = quiz.querySelector('.qspr'); if (!img) return;
      img.style.left = (2 + qScore * 96 / QUIZ_N).toFixed(2) + '%';
      img.classList.add('hop');
      setTimeout(function () { img.src = qSprite(qScore); }, 270);
      setTimeout(function () { img.classList.remove('hop'); }, 620);
    }
    function quizIntro() {
      qSwap('<p class="qkick">The History Exam</p>' +
        '<h3>How closely were you paying attention?</h3>' +
        '<p class="qsub">Four rounds of five: Home, Credits, Storytime and My Story — a different paper every sitting.<br>' +
        'Answer well and you evolve. Answer badly and, well…</p>' +
        '<img class="qsprbig" src="' + SPRITES[0] + '" alt="">' +
        '<div class="qrow"><button type="button" class="qgo">Begin</button><button type="button" class="qlater" data-cursor="hover">Maybe later</button></div>', function () {
        quiz.querySelector('.qgo').addEventListener('click', function (e) { e.stopPropagation(); quizStart(); });
        quiz.querySelector('.qlater').addEventListener('click', function (e) { e.stopPropagation(); closeQuiz(); });
      });
    }
    function quizStart() {
      qSet = []; QUIZ_SECTIONS.forEach(function (S) { shuffled(S.pool).slice(0, QUIZ_PER).forEach(function (Q) { qSet.push({ q: Q.q, o: Q.o, sec: S.name }); }); });
      qIdx = 0; qScore = 0; qConfettiDone = false;
      quizQuestion();
    }
    function quizQuestion() {
      var Q = qSet[qIdx];
      /* o[0] is always the truth — shuffle a copy and remember where it landed */
      var opts = shuffled(Q.o);
      quiz.classList.remove('locked');
      qSwap('<p class="qkick">' + esc(Q.sec) + ' \u00b7 ' + (qIdx % QUIZ_PER + 1) + ' of ' + QUIZ_PER + ' <span style="opacity:.55">(' + (qIdx + 1) + '/' + QUIZ_N + ')</span></p>' +
        '<h3>' + esc(Q.q) + '</h3><div class="qopts">' +
        opts.map(function (o, oi) {
          return '<button type="button" class="qo" style="--qd:' + (0.12 + oi * 0.07).toFixed(2) + 's">' + esc(o) + '</button>';
        }).join('') +
        '</div>' + qTrackHtml(), function () {
        var done = false;                                     /* .locked stops pointers; this stops everything */
        Array.prototype.forEach.call(quiz.querySelectorAll('.qo'), function (btn, bi) {
          btn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (done) return;
            done = true;
            quiz.classList.add('locked');                       /* one answer per question */
            var right = opts[bi] === Q.o[0];
            if (right) {
              qScore++;
              btn.classList.add('right');
              qSparkle(btn); qPlusOne(btn);
              qAdvanceSprite();
            } else {
              btn.classList.add('wrong');
              Array.prototype.forEach.call(quiz.querySelectorAll('.qo'), function (b2, b2i) {
                if (opts[b2i] === Q.o[0]) b2.classList.add('right');
              });
              var card = quiz.querySelector('.qcard');
              if (card && !calmQ) card.classList.add('jolt');
              var fl = document.createElement('span'); fl.className = 'qflash';
              quiz.appendChild(fl); setTimeout(function () { fl.remove(); }, 600);
              var spr = quiz.querySelector('.qspr');
              if (spr) { spr.classList.add('sad'); setTimeout(function () { spr.classList.remove('sad'); }, 650); }
            }
            setTimeout(function () {
              qIdx++;
              if (qIdx < QUIZ_N) quizQuestion(); else quizResults();
            }, right ? 950 : 1600);
          });
        });
      });
    }
    var QUIZ_SECRET = '3KxokmSclbE';                     /* full marks unlocks this */
    var qConfettiDone = false;
    function quizSecret(earned) {
      duckMusic(true);                                   /* the video gets total silence */
      qSwap('<p class="qkick">' + (earned ? 'Unlocked' : 'Fine, you can see it anyway') + '</p>' +
        '<h3>' + (earned ? 'For true historians only' : 'Everyone deserves a little history') + '</h3>' +
        '<div class="qvid"><iframe src="https://www.youtube.com/embed/' + QUIZ_SECRET +
        '?autoplay=1&rel=0&modestbranding=1&playsinline=1&origin=' + encodeURIComponent(location.origin) +
        '" allow="autoplay; encrypted-media; fullscreen" allowfullscreen title="Secret video"></iframe></div>' +
        '<button type="button" class="qagain" style="--qd:.4s">Back</button>', function () {
        watchSecretPlay(quiz.querySelector('.qvid iframe'));
        quiz.querySelector('.qagain').addEventListener('click', function (e) {
          e.stopPropagation(); unduckMusic(); quizResults();
        });
      });
    }
    /* The secret video is the Babadook one: pressing play on it earns 'babadook', which hands over the
       Babadook alien. YouTube only reports its state once the page says it is listening (enablejsapi=1 +
       a 'listening' handshake); state 1 is playing. Checked by origin, and only awarded once. */
    var secretListen = false;
    function watchSecretPlay(frame) {
      if (!frame) return;
      var hello = function () { try { frame.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 'jjsecret', channel: 'widget' }), '*'); } catch (e) {} };
      frame.addEventListener('load', hello); setTimeout(hello, 800); setTimeout(hello, 2500);
      if (secretListen) return; secretListen = true;
      jjOn(window, 'message', function (e) {
        if (!/(^|\.)youtube(-nocookie)?\.com$/.test((function () { try { return new URL(e.origin).hostname; } catch (x) { return ''; } })())) return;
        var d; try { d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch (x) { return; }
        if (!d) return;
        var playing = (d.event === 'onStateChange' && d.info === 1) || (d.event === 'infoDelivery' && d.info && d.info.playerState === 1);
        if (playing && window.jjScore) window.jjScore.award('babadook');
      });
    }
    function quizResults() {
      if (window.jjScore) {
        window.jjScore.award('quiz'); window.jjScore.award('vid-babadook');
        if (qScore / QUIZ_N >= .8) window.jjScore.award('quiz80');
        if (qScore === QUIZ_N) window.jjScore.award('quizFull');
      }
      var rank;
      for (var r = 0; r < QUIZ_RANKS.length; r++) if (qScore >= QUIZ_RANKS[r][0]) { rank = QUIZ_RANKS[r]; break; }
      qSwap('<p class="qkick">The verdict</p>' +
        '<img class="qsprbig" src="' + qSprite(qScore) + '" alt="">' +
        '<p class="qrank">' + esc(rank[1]) + '</p>' +
        '<p class="qscore"><span class="qn">0</span> / ' + QUIZ_N + '</p>' +
        '<p class="qsub">' + esc(rank[2]) + '</p>' +
        '<button type="button" class="qagain" style="--qd:.85s">Sit it again</button>' +
        (qScore === QUIZ_N ? '<button type="button" class="qsecret">Unlock the secret video</button>'
                           : '<button type="button" class="qtop qsee" style="--qd:.95s">Watch the video anyway</button>') +
        (qScore <= 1 ? '<button type="button" class="qtop" style="--qd:1.1s">Back to the beginning</button>' : ''),
        function () {
        /* the score ticks up while the rank stamps down */
        var qn = quiz.querySelector('.qn'), shown = 0;
        var tick = setInterval(function () {
          if (shown >= qScore) { clearInterval(tick); return; }
          shown++; qn.textContent = shown;
        }, 140);
        quiz.querySelector('.qagain').addEventListener('click', function (e) { e.stopPropagation(); quizStart(); });
        var top = quiz.querySelector('.qtop:not(.qsee)');
        if (top) top.addEventListener('click', function (e) {
          e.stopPropagation(); closeQuiz();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        var sec = quiz.querySelector('.qsecret');
        if (sec) sec.addEventListener('click', function (e) { e.stopPropagation(); quizSecret(true); });
        var see = quiz.querySelector('.qsee');
        if (see) see.addEventListener('click', function (e) { e.stopPropagation(); quizSecret(false); });
        if (qScore === QUIZ_N && !qConfettiDone) setTimeout(function () {
          qConfettiDone = true;
          party(quiz.querySelector('.qrank'), { sound: false,
            glyphs: ['🎉', '🏆', '✨', '📜'],
            cols: ['#FFD028', '#FFB01F', '#FF9E1B', '#FFE785', '#8FD3FF', '#FF6FE8', '#FFFFFF'] });
        }, 900);                                          /* let the stamp land first */
      });
    }
    /* ---- 'Oh so you think you know Joe...' ----
       Runs once, straight out of the bang: the sky is already black, so the darkness itself asks.
       Every letter is flung in from a random point offscreen and springs into place; the name drops
       from orbit and SLAMS (shockwave + screen quake + gold burst); the dots land one, by, one;
       the whole line takes a breath and is sucked into the exam. A click skips straight there. */
    var teasePlayed = false, teaseTimers = [], teaseEl = null;
    function tSchedule(fn, ms) { teaseTimers.push(setTimeout(fn, ms)); }
    function teaseBurst(x, y) {
      var COLS = ['#FFD028', '#FFE785', '#FFB01F', '#FFFFFF', '#FF6FE8'];
      for (var i = 0; i < 16; i++) {
        var sp = document.createElement('span');
        var ang = Math.PI * 2 * i / 16 + Math.random() * 0.4, d = 60 + Math.random() * 90;
        sp.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;width:8px;height:8px;border-radius:50%;' +
          'pointer-events:none;background:' + COLS[i % COLS.length] +
          ';--sx:' + (Math.cos(ang) * d).toFixed(0) + 'px;--sy:' + (Math.sin(ang) * d).toFixed(0) +
          'px;animation:jjqSpark .8s cubic-bezier(.2,.7,.4,1) both;';
        teaseEl.appendChild(sp);
        (function (n) { setTimeout(function () { n.remove(); }, 850); })(sp);
      }
    }
    function endTease(fast) {
      teaseTimers.forEach(clearTimeout); teaseTimers = [];
      if (!teaseEl) return;
      var el = teaseEl; teaseEl = null;
      openQuiz();
      if (fast) { el.remove(); return; }
      el.classList.remove('on');                       /* fade under the arriving exam */
      setTimeout(function () { el.remove(); }, 600);
    }
    function runTease() {
      if (teaseEl) return;
      var TXT = 'Oh so you think you know Joe...';
      teaseEl = document.createElement('div'); teaseEl.id = 'jjms-tease';
      var line = '<div class="tline"><span class="tshock"></span>';
      var words = TXT.split(' ');
      var nI = 0, jI = 0, dI = 0;
      /* normals spring in on a 42ms stagger; the name and the dots wait their turn */
      var nEnd = 0.25 + 19 * 0.042 + 0.55;             /* when the last ordinary letter has settled */
      var joeAt = [nEnd, nEnd + 0.2, nEnd + 0.4];
      var joeDone = joeAt[2] + 0.6;
      var dotAt = [joeDone + 0.3, joeDone + 0.68, joeDone + 1.06];
      for (var w = 0; w < words.length; w++) {
        line += '<span class="tw">';
        for (var c = 0; c < words[w].length; c++) {
          var ch = words[w][c], cls = 'tch', d;
          if (ch === '.') { cls += ' td'; d = dotAt[dI++]; }
          else if (w === words.length - 1) { cls += ' tj'; d = joeAt[jI++]; }   /* Joe... minus the dots */
          else { d = 0.25 + (nI++) * 0.042; }
          var fx = ((Math.random() * 2 - 1) * 70).toFixed(0) + 'vw';
          var fy = ((Math.random() * 2 - 1) * 70).toFixed(0) + 'vh';
          var fr = ((Math.random() * 2 - 1) * 540).toFixed(0) + 'deg';
          var fs = (2.5 + Math.random() * 2.5).toFixed(2);
          line += '<span class="' + cls + '" style="--d:' + d.toFixed(2) + 's;--fx:' + fx +
            ';--fy:' + fy + ';--fr:' + fr + ';--fs:' + fs + '">' + esc(ch) + '</span>';
        }
        line += '</span>';
      }
      line += '</div><span class="tskip">Click to skip</span>';
      teaseEl.innerHTML = line;
      teaseEl.addEventListener('click', function (e) { e.stopPropagation(); endTease(true); });
      wrap.appendChild(teaseEl);
      requestAnimationFrame(function () { teaseEl && teaseEl.classList.add('on'); });
      /* the name lands: ring out, ground shakes, gold everywhere */
      tSchedule(function () {
        if (!teaseEl) return;
        var shock = teaseEl.querySelector('.tshock'); if (shock) shock.classList.add('go');
        teaseEl.classList.add('shake');
        var lastJ = teaseEl.querySelectorAll('.tj');
        if (lastJ.length) {
          var r = lastJ[Math.floor(lastJ.length / 2)].getBoundingClientRect();
          teaseBurst(r.left + r.width / 2, r.top + r.height / 2);
        }
      }, (joeAt[2] + 0.38) * 1000);
      /* breathe, then get pulled into the exam hall */
      var pulseAt = dotAt[2] + 0.55, suckAt = pulseAt + 0.6;
      tSchedule(function () { var l = teaseEl && teaseEl.querySelector('.tline'); if (l) l.classList.add('pulse'); }, pulseAt * 1000);
      tSchedule(function () {
        var l = teaseEl && teaseEl.querySelector('.tline'); if (l) l.classList.add('suck');
        tSchedule(function () { endTease(false); }, 300);
      }, suckAt * 1000);
    }
    function openQuiz() {
      quizOpen = true;
      document.documentElement.classList.add('jjms-quiz');
      /* warm the whole evolution line so mid-hop swaps never pop in blank */
      for (var pi = 0; pi < SPRITES.length; pi++) { var im = new Image(); im.src = SPRITES[pi]; }
      quizIntro();
      quiz.classList.add('on'); scrim.classList.add('on'); closeBtn.classList.add('on'); lightbox(true);
    }
    function closeQuiz() {
      if (!quizOpen) return;
      quizOpen = false;
      document.documentElement.classList.remove('jjms-quiz');
      if (quiz.querySelector('.qvid')) { quiz.innerHTML = ''; unduckMusic(); }   /* kills the iframe */
      quiz.classList.remove('on'); scrim.classList.remove('on'); closeBtn.classList.remove('on'); lightbox(false);
      if (finale && finale.classList.contains('go')) window.jjSay && window.jjSay('where-to-next', { delay: 700, wait: true });   /* first bang: the doors are waiting behind the quiz */
    }
    quiz.addEventListener('click', function (e) { e.stopPropagation(); });   /* clicks stay in the exam hall */
    var fquiz = document.getElementById('jjms-fquiz');
    if (fquiz) (function () {   /* the banner CTA (see .fquiz): its life follows the finale's */
      var RMq = calmQ, orb = null, T = [], busy = false, xorb = fquiz.querySelector('.xorb'), xt = fquiz.querySelector('.xt');
      if (RMq) fquiz.classList.add('rm');
      function clear() { T.forEach(clearTimeout); T = []; orb = null; xorb.innerHTML = ''; fquiz.classList.remove('lit', 'in', 'wave', 'hot'); }
      function start(settled) { clear(); var d0 = settled ? 350 : 3500, W = 'Take the History Exam', qd = W.length * 62 + 700;
        T.push(setTimeout(function () { fquiz.classList.add('lit'); }, d0 - 200));
        T.push(setTimeout(function () { var wr = xt.querySelector('.wr'); xt.style.setProperty('--q0', wr.offsetLeft + 'px'); xt.style.setProperty('--q1', (wr.offsetLeft + wr.offsetWidth) + 'px'); xt.style.setProperty('--qd', qd + 'ms'); fquiz.classList.add('in'); if (!RMq) orbit(); }, d0));
        if (!RMq) T.push(setTimeout(function () { fquiz.classList.add('wave'); }, d0 + qd + 300)); }
      function orbit() { var RUN = ['\u16c3', '\u16c9', '\u16ca', '\u16df', '\u16b1', '\u16d7', '\u16a8', '\u16de'], items = [], i;
        for (i = 0; i < 8; i++) items.push({ rn: RUN[i], off: i / 8 * Math.PI * 2, r: 1, k: 1, o: 1 });
        for (i = 0; i < 12; i++) items.push({ off: Math.random() * Math.PI * 2, r: .84 + Math.random() * .32, k: .7 + Math.random() * .7, o: .55 + Math.random() * .45 });
        items.forEach(function (it) { var e = document.createElement(it.rn ? 'b' : 'i'); if (it.rn) e.textContent = it.rn; it.el = e; xorb.appendChild(e); });
        var o = orb = { a: 0, sp: 1, rk: 1, fade: 0, t: performance.now(), burst: false, W: fquiz.offsetWidth, H: fquiz.offsetHeight, vis: true };   /* the box is read once (and on resize), never per frame */
        (function loop(now) { if (orb !== o) return; var dt = Math.min(64, now - o.t); o.t = now;
          if (o.vis) { var tgt = o.burst ? 9 : fquiz.classList.contains('hot') ? 3.4 : 1; o.sp += (tgt - o.sp) * Math.min(1, dt / (o.burst ? 120 : 320)); o.a += dt * .00038 * o.sp;
            if (o.burst) { o.rk += dt * .0012; o.fade = Math.max(0, o.fade - dt / 600); } else o.fade = Math.min(1, o.fade + dt / 1400);
            items.forEach(function (it) { var a = o.a * it.k + it.off, c = Math.cos(a), sn = Math.sin(a), dd = (sn + 1) / 2, front = sn > 0;
              var x = o.W / 2 + c * o.W * .53 * it.r * o.rk, y = o.H / 2 + sn * o.H * .75 * it.r * o.rk - c * o.H * .16;
              if (front !== it.front) { it.front = front; it.el.classList.toggle('f', front); }
              it.el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) translate(-50%,-50%) scale(' + (.62 + .55 * dd).toFixed(3) + ')' + (it.rn ? ' rotate(' + (a * 14).toFixed(1) + 'deg)' : '');
              it.el.style.opacity = (it.o * o.fade * (.3 + .7 * dd)).toFixed(3); }); }
          requestAnimationFrame(loop); })(performance.now());
        if (window.IntersectionObserver && !fquiz._io) { fquiz._io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (orb) orb.vis = en.isIntersecting; }); }); fquiz._io.observe(fquiz); } }
      jjOn(window, 'resize', function () { if (orb) { orb.W = fquiz.offsetWidth; orb.H = fquiz.offsetHeight; } });
      function burst(e) { var r = fquiz.getBoundingClientRect(), x = r.width / 2, y = r.height / 2; if (e && e.clientX) { x = e.clientX - r.left; y = e.clientY - r.top; }
        var cols = ['rgba(255,214,120,.95)', 'rgba(200,140,255,.95)', 'rgba(255,255,255,.95)', 'rgba(150,215,255,.9)'], h = '<i class="fl"></i>', reach = Math.max(r.width * .45, 200);
        for (var i = 0; i < 44; i++) { var a = Math.random() * Math.PI * 2, d = (.25 + Math.random() * .75) * reach; h += '<i class="sp" style="--s:' + (5 + Math.random() * 9).toFixed(1) + 'px;--c:' + cols[i % 4] + ';--dx:' + (Math.cos(a) * d).toFixed(0) + 'px;--dy:' + (Math.sin(a) * d * .55).toFixed(0) + 'px;--d:' + (.7 + Math.random() * .6).toFixed(2) + 's"></i>'; }
        var b = document.createElement('span'); b.className = 'xburst'; b.style.setProperty('--x', x.toFixed(0) + 'px'); b.style.setProperty('--y', y.toFixed(0) + 'px'); b.innerHTML = h; fquiz.appendChild(b);
        void b.offsetWidth; requestAnimationFrame(function () { b.classList.add('go'); }); setTimeout(function () { b.remove(); }, 1500); if (orb) orb.burst = true; }
      fquiz.addEventListener('pointerenter', function () { fquiz.classList.add('hot'); }); fquiz.addEventListener('pointerleave', function () { fquiz.classList.remove('hot', 'down'); });
      fquiz.addEventListener('focus', function () { fquiz.classList.add('hot'); }); fquiz.addEventListener('blur', function () { fquiz.classList.remove('hot'); });
      fquiz.addEventListener('pointerdown', function () { fquiz.classList.add('down'); }); fquiz.addEventListener('pointerup', function () { fquiz.classList.remove('down'); });
      fquiz.addEventListener('click', function (e) { e.stopPropagation(); if (busy) return; busy = true; if (!RMq) burst(e);
        setTimeout(function () { busy = false; openQuiz(); if (orb) { orb.burst = false; orb.rk = 1; } }, RMq ? 0 : 420); });
      new MutationObserver(function () { var go = finale.classList.contains('go'); if (go && !fquiz._on) { fquiz._on = true; start(finale.classList.contains('settled')); } else if (!go && fquiz._on) { fquiz._on = false; clear(); } }).observe(finale, { attributes: true, attributeFilter: ['class'] });
    })();
    Array.prototype.forEach.call(wrap.querySelectorAll('.jjscroll'), function (sc) { sc.addEventListener('click', function (e) { e.stopPropagation(); if (sc.classList.contains('open')) return; sc.classList.add('open'); if (window.jjScore) window.jjScore.award('seal', { x: e.clientX, y: e.clientY }); }); });
    wrap.addEventListener('click', function (e) { var b = e.target && e.target.closest && e.target.closest('.jjms-tab,.jjscroll,.jjms-reveal'); if (b) b.classList.add('touched'); }, true);
    /* LEARNING NEW SKILLS: the four cards sit stacked behind the lead like a travel set; hover the stack or its pill and they fan out to their places, pills included */
    (function () { var st11 = jjmsStepOf('learning'); if (!st11) return; var lead = st11.querySelector('.phw.skl-lead'), rest = Array.prototype.slice.call(st11.querySelectorAll('.phw.skl:not(.skl-lead)')), head = st11.querySelector('.stag.skl-head'); if (!lead) return;
      var more = document.createElement('i'); more.className = 'sklmore'; more.textContent = '+' + rest.length + ' more'; lead.appendChild(more);
      function stack() { var lx = lead.offsetLeft + lead.offsetWidth / 2, ly = lead.offsetTop + lead.offsetHeight / 2; rest.forEach(function (c, i) { c.style.setProperty('--sx', (lx - c.offsetLeft - c.offsetWidth / 2).toFixed(0) + 'px'); c.style.setProperty('--sy', (ly - c.offsetTop - c.offsetHeight / 2).toFixed(0) + 'px'); c.style.setProperty('--sr', ((i - 1) * 4) + 'deg'); }); }   /* layout boxes: the drift and entrance transforms never skew the measure */
      setTimeout(stack, 900); jjOn(window, 'resize', function () { setTimeout(stack, 300); });
      var t0; function open(o) { clearTimeout(t0); if (o) st11.classList.add('skl-open'); else t0 = setTimeout(function () { st11.classList.remove('skl-open'); }, 900); }
      [lead, head].concat(rest).forEach(function (el) { if (!el) return; el.addEventListener('mouseenter', function () { open(true); }); el.addEventListener('mouseleave', function () { open(false); }); });
      st11.querySelectorAll('.stag.skl:not(.skl-head)').forEach(function (p) { p.addEventListener('mouseenter', function () { open(true); }); p.addEventListener('mouseleave', function () { open(false); }); }); })();
    Array.prototype.forEach.call(wrap.querySelectorAll('.phw.like'), function (lk) { var hc = document.createElement('i'); hc.className = 'hcur'; hc.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.6-9.2-8.6C1 8 2.6 4.6 6 4.6c2.2 0 3.4 1.2 6 3.8 2.6-2.6 3.8-3.8 6-3.8 3.4 0 5 3.4 3.2 6.8C19 15.4 12 20 12 20z"/></svg>'; lk.appendChild(hc);
      lk.addEventListener('mousemove', function (e) { var r = lk.getBoundingClientRect(); hc.style.left = (e.clientX - r.left) + 'px'; hc.style.top = (e.clientY - r.top) + 'px'; }); });   /* the like card's cursor is a heart, whatever the theme */   /* pressed once: the prompt and the ride stand down */
    /* SUNDAY VIBES: Joe's own IMDb list on a little telly in the space city. Closed, it shows the header and the first film peeking out;
       the chevron opens the whole list. Press a film: "Added to watchlist" and the row darkens. "Tonight's pick" draws one at random.
       Each entry has room for Joe's one-line "why it is here" (shown on hover once he writes them). */
    var SUNDAY = [['Stardust',2007,'2h 7m',7.6,10],['Enchanted',2007,'1h 47m',7.1,8],['Coco',2017,'1h 45m',8.4,10],['The Book of Life',2014,'1h 35m',7.2,10],['Encanto',2021,'1h 42m',7.2,10],['Monsters, Inc.',2001,'1h 32m',8.1,8],['Monsters University',2013,'1h 44m',7.2,8],['Almost Famous',2000,'2h 2m',7.9,9],['The Lion King',1994,'1h 28m',8.5,9],['Aladdin',1992,'1h 30m',8.0,8],['Mulan',1998,'1h 27m',7.7,9],['Paddington',2014,'1h 35m',7.3,10],['Paddington 2',2017,'1h 43m',7.8,9],['Beauty and the Beast',2017,'2h 9m',7.1,9],['The Princess Bride',1987,'1h 38m',8.0,8],['10 Things I Hate About You',1999,'1h 37m',7.4,8],['John Tucker Must Die',2006,'1h 29m',5.8,9],['Mean Girls',2004,'1h 37m',7.1,7],['A Cinderella Story',2004,'1h 35m',6.0,9],['Inside Out 2',2024,'1h 36m',7.5,9],['About Time',2013,'2h 3m',7.8,9],['How to Train Your Dragon',2010,'1h 38m',8.1,10],['How to Train Your Dragon 2',2014,'1h 42m',7.8,10],['Frozen',2013,'1h 42m',7.4,8],['Superbad',2007,'1h 53m',7.6,10],['21 Jump Street',2012,'1h 49m',7.2,7],['22 Jump Street',2014,'1h 52m',7.0,8],['The Secret Life of Walter Mitty',2013,'1h 54m',7.3,9],['Night at the Museum',2006,'1h 48m',6.5,7],['Puss in Boots: The Last Wish',2022,'1h 42m',7.9,10],['Puss in Boots',2011,'1h 30m',6.6,9],['Angus, Thongs and Perfect Snogging',2008,'1h 40m',6.3,7],['17 Again',2009,'1h 42m',6.4,8]];
    (function () { var st11 = jjmsStepOf('learning'); if (!st11) return; var rows = '';
      SUNDAY.forEach(function (f, i) { rows += '<li data-i="' + i + '" data-cursor="hover"><b>' + (i + 1) + '</b><span class="imt">' + esc(f[0]) + '<small>' + f[1] + ' · ' + f[2] + (f[5] ? ' · <em>' + esc(f[5]) + '</em>' : '') + '</small></span><span class="imr"><i class="y">★</i>' + f[3].toFixed(1) + '</span><span class="imr me"><i class="b">★</i>' + f[4] + '</span><span class="imw">✓</span></li>'; });
      var box = document.createElement('div'); box.className = 'jjms-imdb'; var scrim = document.createElement('i'); scrim.className = 'imscrim'; st11.appendChild(scrim);
      box.innerHTML = '<div class="imh"><span class="imk">My IMDb list</span><h4>Sunday Vibes</h4><small>' + SUNDAY.length + ' films</small></div>' +
        '<ol>' + rows + '</ol><button type="button" class="imchev" data-cursor="hover" aria-label="Open the list"><i></i></button><button type="button" class="imclose" data-cursor="hover" aria-label="Close the list">\u00d7</button><span class="imtoast"></span><i class="imstand"></i>';
      var tv = document.createElement('div'); tv.className = 'jjms-tv'; tv.innerHTML = '<i class="tvframe"></i><i class="tvstand"></i>'; tv.appendChild(box); st11.appendChild(tv); var ol = box.querySelector('ol'), toastEl = box.querySelector('.imtoast');
      function say(t) { toastEl.textContent = t; toastEl.classList.add('on'); clearTimeout(say._t); say._t = setTimeout(function () { toastEl.classList.remove('on'); }, 2200); }
      box.addEventListener('click', function (e) { e.stopPropagation(); var li = e.target.closest('li'); if (li) { if (!li.classList.contains('added')) { li.classList.add('added'); say('✓ Added to watchlist'); if (window.jjScore) window.jjScore.award('watchlist', { x: e.clientX, y: e.clientY }); } else { li.classList.remove('added'); say('Removed from watchlist'); } return; }
        if (e.target.closest('.imchev') || e.target.closest('.imclose')) { setOpen(!box.classList.contains('open') && !e.target.closest('.imclose')); return; }
        if (e.target.closest('.impick')) { var pick = SUNDAY[Math.floor(Math.random() * SUNDAY.length)], li2 = ol.querySelector('li[data-i="' + SUNDAY.indexOf(pick) + '"]'); setOpen(true); Array.prototype.forEach.call(ol.querySelectorAll('li.pick'), function (x) { x.classList.remove('pick'); }); li2.classList.add('pick'); ol.scrollTo({ top: li2.offsetTop - 40, behavior: 'smooth' }); say('Tonight: ' + pick[0]); } });
      function setOpen(o) { box.classList.toggle('open', o); tv.classList.toggle('open', o); scrim.classList.toggle('on', o); if (o) { box.setAttribute('data-lenis-prevent', ''); ol.setAttribute('data-lenis-prevent', ''); } else { box.removeAttribute('data-lenis-prevent'); ol.removeAttribute('data-lenis-prevent'); ol.scrollTop = 0; } }   /* closed, the page scrolls straight through it */
      scrim.addEventListener('click', function (e) { e.stopPropagation(); setOpen(false); });
      box.addEventListener('wheel', function (e) { if (box.classList.contains('open')) e.stopPropagation(); }, { passive: true }); })();
    /* CUT-SCENE (Joe, 2026-09-19): the first time the Taipei slide arrives, black bars close in like Storytime's, the page is held, and a
       short film plays: 'and the bit that probably kick started it all...' / '...moving to Taiwan', then the letters pour in Harry Potter
       style, one lands and opens (Generation UK Scholarship), Joe jumps for joy, the bars lift and the visitor is on the slide they were
       heading for. Skip lands the same place. Stand-in art for now: drawn envelopes and the Storytime Joe poses; Dreamina/ChatGPT
       clips slot into .cutstage when they land. */
    var cut = document.createElement('div'); cut.id = 'jjms-cut'; cut.innerHTML = '<div class="cbar t"></div><div class="cbar d"></div><div class="cutstage"><div class="cline l1">and the bit that probably kick started it all\u2026</div><div class="cline l2">\u2026moving to Taiwan</div>' +
      '<div class="chouse"><img class="chbg" alt="" data-src="tw-house.webp"><video class="ctw lt" muted playsinline preload="none" data-base="tw-letters"></video><img class="cowl" alt="" data-src="tw-owl-arriving.webp"></div><div class="ccard2">You have been chosen for the<b>Generation UK Scholarship</b></div>' +
      '<div class="cfly"><div class="cpan far"><img alt="" data-src="fly-far.webp"></div><div class="cpan mid"><img alt="" data-src="fly-mid.webp"></div><div class="cpan cl">' +
      [[1,6,10,22,-1.3],[2,22,6,26,.7],[3,37,14,30,-.5],[4,52,8,20,1.1],[5,66,16,24,-.9],[6,82,7,26,.4]].map(function (c) { return '<img alt="" data-src="fly-cloud-' + c[0] + '.webp" style="--x:' + c[1] + '%;--y:' + c[2] + '%;--w:' + c[3] + ';--cx:' + c[4] + '">'; }).join('') +
      '</div><div class="cpan near"><img alt="" data-src="fly-near.webp"></div></div><video class="ctw br" muted playsinline preload="none" data-base="tw-broom"></video><video class="csmoke" muted playsinline preload="none" data-src="story-cas-smoke"></video><div class="cgame"><div class="chint"></div><div class="ccount"></div></div>' +
      '<div class="cdream"><div class="dstage"><img class="dbg" alt="" data-src="dr-stage.webp"><img class="dowl" alt="" data-src="dr-owl.webp"><i class="denv"></i><img class="djoe" alt="" data-src="dr-joe-walk.webp"><video class="djoev" muted playsinline preload="none" data-base="dr-joe-walkout"></video>' +
        '<img class="dtro t1" alt="" data-src="aw-bima1.webp"><img class="dtro t2" alt="" data-src="aw-bima2.webp"><img class="dtro t3" alt="" data-src="aw-bima1.webp"><i class="dspot"></i>' + dreamCrowd() + '</div>' +
        '<div class="droomw' + (DREAM_ROOM.bed.sleep ? ' vid' : '') + '"><img class="droom" alt="" data-src="dr-room.webp"><img class="dlay dasleep" alt="" data-src="dr-joe-asleep.webp"><img class="dlay dawake" alt="" data-src="dr-joe-awake.webp">' +   /* the room in layers: empty room, Joe's bed (asleep / awake), Dave, then the foreground table on top */
        (DREAM_ROOM.bed.sleep ? '<video class="dlay dsleep" muted loop playsinline preload="none" data-base="' + DREAM_ROOM.bed.sleep + '"></video>' : '') +
        (DREAM_ROOM.bed.wake ? '<video class="dlay dwakev" muted playsinline preload="none" data-base="' + DREAM_ROOM.bed.wake + '"></video>' : '') +
        DREAM_ROOM.hots.map(function (h) { return '<div class="dhot' + (h.img ? ' hasimg' : '') + (h.clip ? ' hasclip' : '') + '" data-k="' + h.key + '" tabindex="0" role="button" aria-label="' + h.tag + '" data-cursor="hover" style="left:' + h.x + '%;top:' + h.y + '%;width:' + h.w + '%;height:' + h.h + '%">' + (h.img ? '<img class="dhimg" alt="" data-src="' + h.img + '">' : '') + (h.clip ? '<video class="dhvid" muted playsinline preload="none" data-base="' + h.clip + '"></video>' : '') + '<span class="tg">' + h.tag + '</span><span class="sb"></span>' + (h.ask ? '<span class="dpoke">' + h.ask + '</span>' : '') + '</div>'; }).join('') +
        '<img class="dlay dfg" alt="" data-src="dr-room-fg.webp">' +
        '<div class="dbedw" role="button" tabindex="0" aria-label="Wake Joe up" data-cursor="hover" style="left:' + DREAM_ROOM.bed.x + '%;top:' + DREAM_ROOM.bed.y + '%;width:' + DREAM_ROOM.bed.w + '%;min-height:28%">' +
          '<span class="dzzz"><b>z</b><b>z</b><b>Z</b></span><span class="dshock">!?</span><button type="button" class="dwake">Wake Joe up</button></div>' +
        '</div><div class="dmist">' + [[-8, 10, 44, -40], [22, -6, 50, 40], [52, 18, 46, -36], [-4, 52, 52, 44], [36, 48, 58, -44], [68, 58, 44, 40], [10, 80, 50, -38], [58, 84, 48, 36]].map(function (m) { return '<i style="--x:' + m[0] + '%;--y:' + m[1] + '%;--w:' + m[2] + '%;--fx:' + m[3] + 'vw"></i>'; }).join('') + '</div>' +
        '<div class="dcap"></div><p class="dnote">(this is my real room!)</p><button type="button" class="dback" data-cursor="hover">Back to my story \u2192</button><i class="drip"></i></div></div><button type="button" class="cskip" data-cursor="hover">Skip \u2192</button>';
    document.body.appendChild(cut);
    var cutT = [], cutOn = false, cutSeen = /[?&]cut=0\b/.test(location.search); if (cutSeen) document.documentElement.classList.add('jjms-cutseen');   /* once per page load (a session flag made it vanish for anyone reviewing in the same tab); ?cut=0 skips it */
    function cutLater(fn, ms) { cutT.push(setTimeout(fn, ms)); }
    /* the film's own music: tw-music.mp3 (silent until the file is at the repo root). The site ambient steps aside while it plays; the mixer's Music slider governs it */
    var cutMus = null, cutAmbWas = null;
    function cutMusic(on) {
      var A = window.jjAudio, amb = A && A.ambient;
      if (on) { if (!window.Howl || (A && A.muted)) return;
        try { if (amb && amb.playing()) { cutAmbWas = amb.volume(); amb.fade(cutAmbWas, 0, 900); } } catch (e) {}
        try { cutMus = new Howl({ src: [(window.JJ_STORY_BASE || SB) + 'tw-music.mp3'], volume: 0, loop: false, onloaderror: function () { cutMus = null; } }); cutMus._jjCat = 'music'; cutMus.play(); cutMus.fade(0, .22, 3500);   /* low and slow under the letters */ if (A && A.sounds) A.sounds.push(cutMus); } catch (e) { cutMus = null; } }
      else { var m = cutMus; cutMus = null; if (m) { try { m.fade(m.volume(), 0, 1200); setTimeout(function () { try { m.stop(); m.unload(); } catch (e) {} }, 1300); } catch (e) {} }
        try { if (amb && cutAmbWas != null && !(A && A.muted)) amb.fade(amb.volume(), cutAmbWas, 1500); } catch (e) {} cutAmbWas = null; }
    }
    var FG = { on: false, raf: 0, y: 0, v: 0, up: false, dn: false, ptr: null, items: [], got: 0, br: null };
    function fgKey(e) { if (!cutOn) return; var k = e.key, d = e.type === 'keydown';
      if (k === 'ArrowUp' || k === 'w' || k === 'W') { FG.up = d; e.preventDefault(); e.stopImmediatePropagation(); fgHint(false); }
      else if (k === 'ArrowDown' || k === 's' || k === 'S') { FG.dn = d; e.preventDefault(); e.stopImmediatePropagation(); fgHint(false); } }
    jjOn(window, 'keydown', fgKey, true); jjOn(window, 'keyup', fgKey, true);   /* window + capture: first in line, so no slider, scroller or other page key handler can eat the arrows */
    jjOn(window, 'blur', function () { FG.up = FG.dn = false; });
    cut.addEventListener('pointerdown', function (e) { if (!FG.on || e.target.closest('.cskip')) return; FG.ptr = e.clientY; fgHint(false); });
    cut.addEventListener('pointermove', function (e) { if (FG.on && (FG.ptr != null || e.pointerType === 'touch')) FG.ptr = e.clientY; });
    jjOn(window, 'pointerup', function () { FG.ptr = null; });
    function fgHint(on) { var h = cut.querySelector('.chint'); if (!on) { h.classList.remove('on'); return; }
      h.innerHTML = (matchMedia('(hover:none)').matches ? 'Drag up and down to fly' : '<kbd>\u2191</kbd><kbd>\u2193</kbd> to fly') + (FG.home ? ' \u00b7 Catch something from every era' : ' \u00b7 Catch the skills'); h.classList.add('on');
      cutLater(function () { h.classList.remove('on'); }, 4200); }
    function fgCount() { var c = cut.querySelector('.ccount'); c.textContent = (FG.home ? 'Eras caught ' : 'Skills caught ') + FG.got + ' / ' + (FG.total || 5); c.classList.add('on'); }
    function fgBody() {                                     /* Joe's body on screen: the broom clip is a cover-fit 16:9 frame, he flies at x .40-.68, y .26-.74 of it */
      var r = FG.br.getBoundingClientRect(), dw = Math.max(r.width, r.height * 16 / 9), dh = Math.max(r.height, r.width * 9 / 16), ox = r.left + (r.width - dw) / 2, oy = r.top + (r.height - dh) / 2;
      return FG.home ? { l: ox + .32 * dw, r: ox + .60 * dw, t: oy + .26 * dh, b: oy + .74 * dh } : { l: ox + .40 * dw, r: ox + .68 * dw, t: oy + .26 * dh, b: oy + .74 * dh }; }   /* home: he's mirrored, flying west */
    function flyGame(on, J) {
      FG.br = cut.querySelector('.ctw.br');
      if (!on) { FG.on = false; FG.up = FG.dn = false; FG.ptr = null; return; }   /* the loop keeps running to ease him home */
      FG.on = true; FG.y = 0; FG.v = 0; FG.got = 0; cutLater(function () { fgHint(true); }, 700); cutLater(fgCount, 1300);
      var pool = FG.pool || [].concat(TAGS[6] || []).filter(function (t) { return !t.head; }).sort(function () { return Math.random() - .5; }).slice(0, 5);
      FG.total = pool.length;
      var now = performance.now() / 1000, t0 = 1.6, t1 = Math.max(t0 + 4, (J - now) - 3.2), lanes = [.72, .18, .5, .12, .66, .3].slice(0, pool.length).sort(function () { return Math.random() - .5; });
      pool.forEach(function (t, i) { cutLater(function () { fgSpawn(t, lanes[i]); }, (t0 + (t1 - t0) * i / Math.max(1, pool.length - 1)) * 1000); });
      cancelAnimationFrame(FG.raf); var last = performance.now();
      (function tick(ts) { var dt = Math.min(48, ts - last) / 1000; last = ts; if (!cutOn) { FG.br.style.translate = ''; return; }
        var H = window.innerHeight, lo = -H * .3, hi = H * .12, tgt;   /* more room upward: the top pickups sit well inside his reach */
        if (FG.on && FG.ptr != null) { var b = fgBody(), mid = (b.t + b.b) / 2 - FG.y; tgt = Math.max(lo, Math.min(hi, FG.ptr - mid)); FG.v = (tgt - FG.y) * 6; }
        else if (FG.on) { var acc = (FG.dn ? 1 : 0) - (FG.up ? 1 : 0); FG.v += acc * H * 5.6 * dt; FG.v *= Math.pow(.015, dt); }   /* a little weight: he eases into moves and glides to a stop */
        else FG.v = (0 - FG.y) * 3.2;                        /* controls off: glide back to his line for the landing */
        FG.y = Math.max(lo, Math.min(hi, FG.y + FG.v * dt)); FG.br.style.translate = '0 ' + FG.y.toFixed(1) + 'px';
        fgCatch(); FG.raf = requestAnimationFrame(tick); })(last);
    }
    function fgSpawn(t, lane) {
      var g = cut.querySelector('.cgame'), el = document.createElement('div'); el.className = 'citem'; el.innerHTML = '<i>' + t.i + '</i>' + t.t; g.appendChild(el);
      var gr = g.getBoundingClientRect(), y = gr.height * (.1 + lane * .72), W = window.innerWidth, dur = 3600;
      var xa = FG.home ? -el.offsetWidth - 60 : W + 40, xb = FG.home ? W + 40 : -el.offsetWidth - 60;   /* home: the world streams past the other way */
      el.style.transform = 'translate(' + xa + 'px,' + y + 'px)'; void el.offsetWidth;
      el.style.transition = 'transform ' + dur + 'ms linear'; el.style.transform = 'translate(' + xb + 'px,' + y + 'px)';
      el._t = t; FG.items.push(el); setTimeout(function () { el.remove(); FG.items = FG.items.filter(function (x) { return x !== el; }); }, dur + 200); }
    function fgCatch() { if (!FG.items.length || !FG.br) return; var b = fgBody();
      FG.items.forEach(function (el) { if (el._got) return; var r = el.getBoundingClientRect();
        if (r.right > b.l && r.left < b.r && r.bottom > b.t && r.top < b.b) { el._got = true; FG.got++; fgCount();
          var cx = r.left + r.width / 2, cy = r.top, st = {}, SK = FG.home ? 'jjHomeEras' : 'jjTwSkills'; try { st = JSON.parse(localStorage.getItem(SK) || '{}'); } catch (e) {}
          if (!st[el._t.t] && window.jjScore && window.jjScore.credit) { st[el._t.t] = 1; try { localStorage.setItem(SK, JSON.stringify(st)); } catch (e) {} window.jjScore.credit(2, el._t.t, cx, cy); }   /* 2 coins, once per skill ever: replays can't farm them */
          else { var pp = document.createElement('div'); pp.className = 'cpop'; pp.textContent = '\u2713 ' + el._t.t; var gr = cut.querySelector('.cgame').getBoundingClientRect(); pp.style.left = (cx - gr.left) + 'px'; pp.style.top = (cy - gr.top) + 'px'; cut.querySelector('.cgame').appendChild(pp); setTimeout(function () { pp.remove(); }, 1200); }
          var m = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(getComputedStyle(el).transform === 'none' ? '' : el.style.transform); var cs = getComputedStyle(el).transform;
          el.style.transition = 'none'; el.style.transform = cs; void el.offsetWidth; el.classList.add('got'); el.style.transform = cs + ' scale(1.5)'; } }); }
    function cutGameStop() { FG.on = false; FG.home = false; FG.pool = null; FG.up = FG.dn = false; FG.ptr = null; cancelAnimationFrame(FG.raf); FG.items.forEach(function (el) { el.remove(); }); FG.items = [];
      var br = cut.querySelector('.ctw.br'); if (br) br.style.translate = ''; cut.querySelectorAll('.chint,.ccount').forEach(function (e) { e.classList.remove('on'); }); cut.querySelectorAll('.cpop').forEach(function (e) { e.remove(); }); }
    function cutMusicUp() { if (cutMus) { try { cutMus.fade(cutMus.volume(), .85, 2200); } catch (e) {} } }   /* and up for the flight */
    /* FLY HOME (the finale's 'Fly home' button): the same film machinery, reversed. Taipei back to London, Joe mirrored and flying
       west, one thing to catch from every era (2 coins each, the first time), then he flies off and it's home sweet home. */
    var HOME_ITEMS = [{ t: 'First words', i: '\ud83c\udf7c' }, { t: 'Gaming', i: '\ud83c\udfae' }, { t: 'Travelling', i: '\ud83c\udf0d' }, { t: 'Uni skills', i: '\ud83c\udf93' }, { t: 'BIMA Award', i: '\ud83c\udfc6' }, { t: 'Super Reel', i: '\ud83d\udcf1' }];
    function flyHome() { if (cutOn) return; cutOn = true;
      var br = cut.querySelector('.ctw.br');
      pinY = window.scrollY; holdScroll(true); document.documentElement.classList.add('jjms-lb', 'jjms-cut'); clearTimeout(cutOutT); cut.classList.remove('out'); cut.classList.add('on', 'home'); requestAnimationFrame(function () { cut.classList.add('go'); });
      cut.querySelectorAll('.cfly img[data-src]').forEach(function (im) { im.src = (window.JJ_STORY_BASE || SB) + im.getAttribute('data-src'); im.removeAttribute('data-src'); });
      if (!br._src) { br._src = 1; br.innerHTML = jjClipSrc(SB + br.getAttribute('data-base')); br.load(); }
      cutMusic(true); cutLater(cutMusicUp, 300);
      try { br.pause(); br.currentTime = 3.0; } catch (x) {} br._landAt = Infinity;   /* never jumps off: he just keeps flying */
      if (!br._lh) { br._lh = 1; br.addEventListener('timeupdate', function () { if (br.currentTime >= 7.45 && br.currentTime < 7.9 && performance.now() / 1000 < br._landAt - 0.25) { try { br.currentTime = 3.0; } catch (x) {} } }); }   /* the hover loop (the film registers the same one) */
      var PAN = 13;
      cutLater(function () { cut.classList.add('p6'); cut.querySelectorAll('.cpan').forEach(function (pn) { pn.style.animationDuration = PAN + 's'; pn.style.animationDelay = '.5s'; });
        cutLater(function () { br.classList.add('on'); var bp = br.play(); if (bp && bp.catch) bp.catch(function () {}); FG.home = true; FG.pool = HOME_ITEMS.slice(); flyGame(true, performance.now() / 1000 + PAN - .6); }, 400); }, 700);
      cutLater(function () { flyGame(false); }, 700 + PAN * 1000 - 600);
      cutLater(function () { br.classList.add('away'); }, 700 + PAN * 1000 + 200);                /* off he goes, west, out of the shot */
      cutLater(function () { var c = cut.querySelector('.ccount'); c.textContent = 'Home sweet home \u00b7 ' + FG.got + ' / ' + HOME_ITEMS.length + ' eras caught'; c.classList.add('on', 'big'); }, 700 + PAN * 1000 + 1400);
      cutLater(cutEnd, 700 + PAN * 1000 + 4600);
    }
    /* THE AWARDS DREAM: plays the first time the awards slide arrives (and from 'Watch the dream again') */
    var dreamSeen = /[?&]cut=0\b/.test(location.search); if (dreamSeen) document.documentElement.classList.add('jjms-dreamseen');
    /* the dream waits until the awards slide is (almost) fully in view and its confetti has had a moment (Joe, 2026-09-24) */
    var dreamWait = false;
    window.jjmsDream = function () { if (dreamSeen || dreamWait) return; var di = -1; for (var q = 0; q < STEPS.length; q++) if (STEPS[q].dream) { di = q; break; } if (di < 0) return; var dst = steps[di]; dreamWait = true;
      var t0 = 0; (function chk() { if (dreamSeen || cutOn) { dreamWait = false; return; } if (!dst.classList.contains('cur')) { dreamWait = false; return; }
        var r = dst.getBoundingClientRect(), vh = window.innerHeight, full = r.top < vh * 0.15 && r.top > -vh * 0.25;   /* ~85% in view (Joe, 2026-09-25: start it sooner) */
        if (full) { if (!t0) t0 = performance.now(); if (performance.now() - t0 > 850) { dreamWait = false; dreamPlay(); return; } } else t0 = 0;
        requestAnimationFrame(chk); })(); };
    function dreamPlay() { if (cutOn) return; cutOn = true; dreamSeen = true;
      var cd = cut.querySelector('.cdream'), joe = cd.querySelector('.djoe'), owl = cd.querySelector('.dowl'), env = cd.querySelector('.denv'), cap = cd.querySelector('.dcap'), rip = cd.querySelector('.drip'), tros = cd.querySelectorAll('.dtro');
      cd.querySelectorAll('img[data-src]').forEach(function (im) { im.src = (window.JJ_STORY_BASE || SB) + im.getAttribute('data-src'); im.removeAttribute('data-src'); });
      ['raise', 'hold', 'tower'].forEach(function (k) { var pi = new Image(); pi.src = (window.JJ_STORY_BASE || SB) + 'dr-joe-' + k + '.webp'; });
      var JB = (window.JJ_STORY_BASE || SB) + 'dr-joe-';
      pinY = window.scrollY; holdScroll(true); document.documentElement.classList.add('jjms-lb', 'jjms-cut'); clearTimeout(cutOutT); cut.classList.remove('out'); cut.classList.add('on', 'dream'); requestAnimationFrame(function () { cut.classList.add('go'); });
      function say(t, typed, add) { cap.classList.add('on'); if (!typed) { cap.textContent = t; return; } var pre = add ? cap.textContent : ''; cap.textContent = pre; var k = 0; (function ty() { if (!cutOn || k > t.length) return; cap.textContent = pre + t.slice(0, k++); cutLater(ty, 42); })(); }
      var SBd = window.JJ_STORY_BASE || SB, jv = cd.querySelector('.djoev');
      function clipIn(v) { if (v && !v._src) { v._src = 1; v.preload = 'auto'; v.innerHTML = jjClipSrc(SBd + v.getAttribute('data-base')); v.load(); } return v; }
      clipIn(jv); clipIn(cd.querySelector('.dsleep')); clipIn(cd.querySelector('.dwakev'));   /* the walk-out, snore and wake clips load while the owl does its bit */
      cutLater(function () { cd.classList.add('d-on'); }, 500);
      cutLater(function () { say('And the winner is\u2026'); }, 900);
      cutLater(function () { owl.classList.add('in'); }, 1700);                                         /* the postal owl, envelope and all */
      cutLater(function () { env.classList.add('drop'); }, 3000);
      cutLater(function () { owl.classList.add('out'); }, 3300);
      var spot = cd.querySelector('.dspot'); spot.style.setProperty('--spx', '52%');
      cutLater(function () { say('\u2026Joe Jackson!'); spot.classList.add('on'); cd.classList.add('cheer'); }, 3700);   /* the light snaps on, the crowd goes up */
      /* the walk-out is ONE Seedance shot (Joe, 2026-09-25): he walks out of the wings, the award floats down, he lifts it, bows and starts his speech, and the awards keep coming */
      cutLater(function () { spot.style.setProperty('--spx', '29.5%'); if (jv) { jv.classList.add('on'); try { jv.currentTime = 0; } catch (x) {} var jp = jv.play(); if (jp && jp.catch) jp.catch(function () {}); } }, 4000);
      cutLater(function () { try { party(cd.querySelector('.dstage'), { sound: false, glyphs: ['\u2728', '\ud83c\udf89', '\u2b50'] }); } catch (e) {} cap.classList.remove('on'); }, 6400);   /* he lifts it */
      cutLater(function () { cd.classList.remove('cheer'); say('\u201cI\u2019d like to thank\u2026', true); }, 8000);
      cutLater(function () { cd.classList.add('cheer'); }, 10000);                                       /* the awards start raining in */
      cutLater(function () { owl.classList.remove('in', 'out'); owl.classList.add('in2'); }, 10300);     /* ...and the owl is back, from the right */
      cutLater(function () { cd.classList.remove('cheer'); say(' wait\u2026 why is there an owl?\u201d', true, true); }, 10800);
      cutLater(function () { cd.classList.add('d-mist'); }, 12300);                                     /* dreamy mist rolls in over the stage... */
      cutLater(function () { cap.classList.remove('on'); }, 12900);
      cutLater(function () { cd.classList.add('d-room'); if (jv) jv.pause(); var bv = cd.querySelector('.dsleep'); if (bv) { clipIn(bv); bv.addEventListener('playing', function () { cd.querySelector('.droomw').classList.add('vplay'); }, { once: true }); var bp = bv.play(); if (bp && bp.catch) bp.catch(function () {}); } var dvid = cd.querySelector('.dhvid'); clipIn(dvid); }, 13700);   /* ...and behind it, Joe's real room: he's snoring */
      cutLater(function () { cd.classList.add('d-clear'); }, 14200);
      cutLater(function () { cd.classList.add('d-ask'); say('Joe\u2019s still dreaming\u2026'); }, 15600);   /* over to you: wake him up */
    }
    /* the room: wake Joe (his shocked wake-up), poke the real things in it, then back to the story */
    (function () { var cd = cut.querySelector('.cdream'), bed = cd.querySelector('.dbedw'), room = cd.querySelector('.droomw'), cap = cd.querySelector('.dcap');
      /* Joe's note: not scared or over-animated. A little jump, a happy second, the let-down, a shrug, and back to sleep. */
      function wake() { if (!cutOn || !cd.classList.contains('d-ask') || bed._woke) return; bed._woke = true; bed.classList.add('woke'); cd.classList.remove('d-ask');
        var wvv = cd.querySelector('.dwakev');
        if (wvv) { wvv.addEventListener('playing', function () { room.classList.add('wplay'); }, { once: true }); try { wvv.currentTime = 0; } catch (x) {} var wp = wvv.play(); if (wp && wp.catch) wp.catch(function () {});
          wvv.addEventListener('ended', function () { if (!cutOn) return; cutLater(cutEnd, 1600); }, { once: true }); }   /* the clip ends with him back asleep: the film ends there (Joe, 2026-09-25) */
        else { cd.classList.add('d-woke'); room.classList.remove('jolt'); void room.offsetWidth; room.classList.add('jolt'); cutLater(function () { cd.classList.remove('d-woke'); bed.classList.remove('woke'); }, 1700); cutLater(cutEnd, 4200); }   /* no clip: up for a moment, back to sleep, and out */
        cutLater(function () { cap.classList.add('on'); cap.textContent = '\u2026the awards were real though. Mostly.'; }, 1400); }
      bed.addEventListener('click', function (e) { e.stopPropagation(); wake(); });
      bed.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); wake(); } });
      cd.querySelectorAll('.dhot').forEach(function (h) { var cfg = DREAM_ROOM.hots.filter(function (x) { return x.key === h.getAttribute('data-k'); })[0], n = 0, t = 0;
        function poke(e) { if (e) e.stopPropagation(); h.classList.add('poked'); if (cfg.key === 'dave' && window.jjScore) { var dr0 = h.getBoundingClientRect(); window.jjScore.award('dave', { x: dr0.left + dr0.width / 2, y: dr0.top }); }   /* Oi, Dave! (idempotent) — the Dave companion unlocks from this once his clip lands */
          var hv = h.querySelector('.dhvid'); if (hv) { if (!hv._src) { hv._src = 1; hv.innerHTML = jjClipSrc((window.JJ_STORY_BASE || SB) + hv.getAttribute('data-base')); hv.load(); } try { hv.currentTime = 0; } catch (x) {} hv.onplaying = function () { h.classList.add('stamp'); }; hv.onended = function () { h.classList.remove('stamp'); }; var hp = hv.play(); if (hp && hp.catch) hp.catch(function () {}); }   /* he stamps his staff (Seedance clip) */
          if (cfg.fx === 'angry') { h.querySelector('.sb').textContent = cfg.say[n++ % cfg.say.length]; h.classList.remove('angry'); void h.offsetWidth; h.classList.add('angry'); clearTimeout(t); t = setTimeout(function () { h.classList.remove('angry'); }, 1600); } }
        h.addEventListener('click', poke); h.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); poke(e); } }); });
      cd.querySelector('.dback').addEventListener('click', function (e) { e.stopPropagation(); cutEnd(); }); })();
        function cutEnd() { if (!cutOn) return; cutOn = false; cutMusic(false); cutGameStop(); if (cut.classList.contains('dream')) { document.documentElement.classList.add('jjms-dreamseen'); setTimeout(function () { var jv = document.querySelector('#jjms-step-9 .agvid'); if (jv && jv._src) { try { jv.currentTime = 2.3; } catch (x) {} var jp = jv.play(); if (jp && jp.catch) jp.catch(function () {}); } }, 900);   /* designer Joe's quick jump played behind the dream, so he does it again as the slide comes back (Joe, 2026-09-24) */ setTimeout(function () { cut.classList.remove('dream'); var cd = cut.querySelector('.cdream'); cd.className = 'cdream'; var j = cd.querySelector('.djoe'); j.className = 'djoe'; j.src = (window.JJ_STORY_BASE || SB) + 'dr-joe-walk.webp'; cd.querySelectorAll('.dowl,.denv,.dtro,.drip,.dcap,.dspot,.dbedw,.dhot,.droomw').forEach(function (e) { e.classList.remove('in', 'out', 'drop', 'fall', 'go', 'on', 'woke', 'angry', 'shake', 'jolt'); e.style.opacity = ''; e._woke = false; }); cd.querySelectorAll('.dsleep,.dwakev,.djoev,.dhvid').forEach(function (v) { try { v.pause(); v.currentTime = 0; } catch (x) {} v.classList.remove('on'); }); var rw0 = cd.querySelector('.droomw'); if (rw0) rw0.classList.remove('vplay', 'wplay'); cd.querySelectorAll('.dhot').forEach(function (hh) { hh.classList.remove('stamp'); }); var ow0 = cd.querySelector('.dowl'); if (ow0) ow0.classList.remove('in2'); }, 1600); } cutT.forEach(clearTimeout); cutT = []; cut.classList.remove('go', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'home'); cut.querySelector('.ccount').classList.remove('big'); cut.querySelectorAll('.ctw,.csmoke,.ccard2').forEach(function (e) { e.classList.remove('on', 'gone', 'land', 'away'); if (e.pause) e.pause(); }); cut.classList.add('out'); document.documentElement.classList.add('jjms-cutseen'); holdScroll(false); if (cut._toSlide && !cut.classList.contains('dream')) { cut._toSlide = 0; for (var twi = 0; twi < STEPS.length; twi++) if (STEPS[twi].rewatch) {   /* land on Brighton with its 'Watch again' pill in the middle of the screen, the tablets above it and Skyrock peeking in below (Joe, 2026-09-25) */ var TL = window.lenis || window.__lenis, sT = steps[twi], vh0 = window.innerHeight; var go0 = function (y) { y = Math.max(0, Math.round(y)); pinY = y; if (TL && TL.scrollTo) TL.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y); window.dispatchEvent(new Event('scroll')); }; go0(sT.getBoundingClientRect().top + window.scrollY + Math.max(0, sT.offsetHeight - vh0) + vh0 * 0.25 + 70); (function fix(k) { requestAnimationFrame(function () { requestAnimationFrame(function () { var rw = sT.querySelector('.jjrewatch'); if (!rw) return; var r = rw.getBoundingClientRect(), d = r.top + r.height / 2 - vh0 * 0.33; if (Math.abs(d) > 6 && k < 4) { go0(window.scrollY + d); fix(k + 1); } }); }); })(0); break; } }   /* the film was triggered with the slide only peeking in: land ON it, under the fading film (the empty screen Joe saw) */ document.documentElement.classList.remove('jjms-lb', 'jjms-cut');
      clearTimeout(cutOutT); cutOutT = setTimeout(function () { cut.classList.remove('on', 'out'); }, 1500); }
    function cutPlay() { if (cutOn || cutSeen) return; cutOn = true; cutSeen = true; cutMusic(true); cut._toSlide = !cut._replay;   /* the first play hands back ON the Skyrock slide, not the gap it was triggered from */
      /* (the drawn envelopes are gone: the letters are the Dreamina clip now) */
      pinY = window.scrollY; holdScroll(true); document.documentElement.classList.add('jjms-lb', 'jjms-cut'); cut.classList.add('on');   /* hold HERE: the hold re-pins to pinY, which the finale had left at 0 (the page was snapping to the top) */ requestAnimationFrame(function () { cut.classList.add('go'); });
      cut.querySelectorAll('.cfly img[data-src]').forEach(function (im) { im.src = (window.JJ_STORY_BASE || SB) + im.getAttribute('data-src'); im.removeAttribute('data-src'); });   /* the panorama loads while the lines play */
      cutLater(function () { cut.classList.add('p1'); }, 700);        /* line one */
      cutLater(function () { cut.classList.remove('p1'); }, 3200);
      cutLater(function () { cut.classList.add('p2'); }, 3600);       /* line two */
      var lt = cut.querySelector('.ctw.lt'), br = cut.querySelector('.ctw.br'), sm = cut.querySelector('.csmoke'), card = cut.querySelector('.ccard2');
      [lt, br].forEach(function (v) { if (v._src) return; v._src = 1; var b = SB + v.getAttribute('data-base'); v.innerHTML = '' + jjClipSrc(b) + ''; if (window.chrome) v.insertBefore(v.lastChild, v.firstChild); v.load(); });   /* Chrome takes the VP9 alpha first */
      if (!sm._src) { sm._src = 1; var sb = (window.JJ_STORY_BASE || SB) + sm.getAttribute('data-src'); sm.innerHTML = '' + jjClipSrc(sb) + ''; if (window.chrome) sm.insertBefore(sm.lastChild, sm.firstChild); sm.load(); }
      var vplay = function (v) { try { v.currentTime = 0; } catch (x) {} var pp = v.play(); if (pp && pp.catch) pp.catch(function () {}); };
      var LT = 4400;                                                                                /* the letters start under '...moving to Taiwan': the line sits over him briefly, then fades */
      var owl = cut.querySelector('.cowl'), OWL = (window.JJ_STORY_BASE || SB) + 'tw-owl-';
      cut.querySelectorAll('.chouse img[data-src]').forEach(function (im) { im.src = (window.JJ_STORY_BASE || SB) + im.getAttribute('data-src'); im.removeAttribute('data-src'); });
      ['perched', 'sighing'].forEach(function (k) { var pi = new Image(); pi.src = OWL + k + '.webp'; });
      owl.classList.remove('in', 'sat'); owl.src = OWL + 'arriving.webp';
      cutLater(function () { cut.classList.add('p3'); lt.classList.add('on'); vplay(lt); }, LT);
      cutLater(function () { owl.classList.add('in'); }, LT + 300);                                /* the postal owl swoops in to the sill */
      cutLater(function () { owl.src = OWL + 'perched.webp'; owl.classList.add('sat'); }, LT + 1800);   /* lands, letter in beak, deadpan */
      cutLater(function () { owl.src = OWL + 'sighing.webp'; }, LT + 5300);                       /* and sighs as the scholarship comes up: another one */
      cutLater(function () { cut.classList.remove('p2'); }, 5900);   /* the letters rain in from the top of the page; he catches one and reads it */
      cutLater(function () { card.classList.add('on'); }, LT + 5300);                              /* he holds it up: the scholarship (up early, and it stays through the smoke) */
      cutLater(function () { sm.classList.add('on'); vplay(sm); }, LT + 7600);                      /* a puff of smoke hides the change of pose */
      cutLater(function () { lt.classList.add('gone'); cut.classList.add('p5'); try { br.pause(); br.currentTime = 3.0; } catch (x) {} }, LT + 8000);   /* under it the letters Joe goes and the house fades away; the broom clip waits, cued at 3.0s, so it never shows its first frame */
      cutLater(function () { sm.classList.remove('on'); }, LT + 8900);
      var BR_AT = 400;                                                                              /* the broom Joe only arrives once the panorama is up: already flying (his clip from 3.0s), never out of the house */
      cutLater(function () { card.classList.remove('on'); }, LT + 9400);                           /* off before the flying hint takes its place */
      br._landAt = Infinity;
      if (!br._lh) { br._lh = 1; br.addEventListener('timeupdate', function () { if (br.currentTime >= 7.45 && br.currentTime < 7.9 && performance.now() / 1000 < br._landAt - 0.25) { try { br.currentTime = 3.0; } catch (x) {} } }); }   /* flying in place (3.0-7.45s) until the pan arrives; one listener, so a replay never inherits an old loop */
      cutLater(function () { cut.classList.add('p6'); cutMusicUp();                                /* the panorama fades in and pans London -> Taipei; the music swells */
        cutLater(function () { br.classList.add('on'); var bp = br.play(); if (bp && bp.catch) bp.catch(function () {}); flyGame(true, J); }, BR_AT);
        /* the pan is timed to the clip, not the other way round: he passes 7.45s (the jump-off) every 4.45s of hovering, so the pan
           stretches (6.5s at least, so the journey can be taken in) to end on the pass where he jumps. No dead hovering after it. */
        var now = performance.now() / 1000, s0 = now + 0.5, J = now + BR_AT / 1000 + 4.45;          /* his first jump-off pass: 4.45s after he joins at 3.0s */
        while (J < s0 + 6.5) J += 4.45;                                                             /* the first jump-off pass at least 6.5s in: the pan runs 6.5-11s, never a long idle hover */
        br._landAt = J;
        cut.querySelectorAll('.cpan').forEach(function (pn) { pn.style.animationDuration = (J - s0).toFixed(2) + 's'; pn.style.animationDelay = '.5s'; });
        cutLater(function () { flyGame(false); }, (J - now) * 1000 - 1300);                        /* hands off the controls: he glides back to his line, so he always lands on the ground */
        cutLater(function () { br.classList.add('land'); }, (J - now) * 1000 + 300);                 /* he comes down onto the Taipei ground */
        cutLater(cutEnd, (J - now) * 1000 + 2600); }, LT + 8800); }   /* ends soon after he steps off (Joe: faster) */
    var cutOutT = 0;
    function cutReplay() { if (cutOn) return; clearTimeout(cutOutT); cut.classList.remove('on', 'out', 'go'); cutSeen = false; cut._replay = 1; cutPlay(); cut._replay = 0; }   /* the 'Watch again' card on the Medieval slide: the same film from the top, and it hands back to the same spot */
    wrap.querySelectorAll('.jjrewatch:not(.jjdream-again)').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); cutReplay(); }); });   /* the awards pill shares the style, not the film */
    cut.querySelector('.cskip').addEventListener('click', function (e) { e.stopPropagation(); cutEnd(); });
    jjOn(document, 'keydown', function (e) { if (cutOn && (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); cutEnd(); } }, true);
    var rv = wrap.querySelector('.jjms-reveal');
    if (rv) rv.addEventListener('click', function (e) { e.stopPropagation(); var first = !rv.classList.contains('done'); rv.classList.add('done'); rv.querySelector('.rvbtn').textContent = 'Watch again'; var wc = wrap.querySelector('.wizcap'); if (wc) { wc.textContent = 'Jim Jackson - Wizard & Narrator'; wc.classList.add('named'); }
      openVideo(rv); if (window.jjScore) window.jjScore.award('vid-grandad');
      if (first) closeVideo.after = function () { toast('Want him again? He lives in <b>Store &gt; Videos</b> now'); }; });
    function toast(html) { var t = document.getElementById('jjms-toast'); if (!t) { t = document.createElement('div'); t.id = 'jjms-toast'; document.body.appendChild(t); }
      t.innerHTML = html; clearTimeout(toast._t); requestAnimationFrame(function () { t.classList.add('on'); }); toast._t = setTimeout(function () { t.classList.remove('on'); }, 4200); }
    /* the doors: Part Two follows the same lock as the menu (the 'tale2' achievement); locked, it sends you to the exam instead */
    var p2door = wrap.querySelector('.dests a[data-key="part2"]'), stdoor = wrap.querySelector('.dests a[data-key="storytime"]'); if (stdoor) stdoor.classList.add('long');
    Array.prototype.forEach.call(wrap.querySelectorAll('.dests a'), function (a) { a.addEventListener('animationend', function (e) { if (e.animationName === 'jjmsDoor') a.classList.add('in'); }); });   /* the entrance animation would otherwise pin opacity and scale and beat the hover */
    function syncDoor() { if (!p2door) return; var ok = !!(window.jjScore && window.jjScore.has && window.jjScore.has('tale2')), tale = !!(window.jjScore && window.jjScore.has && window.jjScore.has('storytime'));
      var ls = p2door.querySelector('.dsub.lk'), lc = p2door.querySelector('.dcta.lk:not(.dstar)'); if (ls) ls.textContent = tale ? 'Locked. Take the History Exam, or spend a star' : 'Locked. Watch the first tale in Storytime first'; if (lc) lc.textContent = tale ? 'Take the History Exam' : 'Watch Storytime'; p2door.classList.toggle('needtale', !tale);   /* Part One first, then the exam or a star */ p2door.classList.toggle('locked', !ok); p2door.removeAttribute('aria-disabled'); p2door.closest('.dests').classList.toggle('t2', ok); }
    var fexam = wrap.querySelector('.fexam'); if (fexam) fexam.addEventListener('click', function (e) { e.stopPropagation(); openQuiz(); });
    wrap.querySelectorAll('.jjdream-again').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); dreamPlay(); }); });
    wrap.querySelectorAll('.ffly').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); flyHome(); }); });   /* the finale's and the Skyrock slide's */
    syncDoor(); jjOn(window, 'jj:score', syncDoor); setTimeout(syncDoor, 1500);
    if (p2door) p2door.addEventListener('click', function (e) { syncDoor(); if (!p2door.classList.contains('locked')) return; e.preventDefault(); e.stopPropagation(); var tale = !!(window.jjScore && window.jjScore.has('storytime')); if (!tale) { location.href = '/storytime'; return; } if (e.target.closest('.dstar') && window.jjTale2Offer) { window.jjTale2Offer('star'); return; } openQuiz(); });   /* locked: Storytime first; then the exam, or a star */
    jjOn(window, 'jj:exam', function () { openQuiz(); });                                   /* the offer card's 'Take the History Exam' */
    if (/[?&]exam=1\b/.test(location.search)) setTimeout(function () { openQuiz(); }, 2600);          /* arriving from the menu's offer */

    /* cursor.js (site-wide) expands its bubble over <a>/<button>/[data-cursor] — most of the
       timeline's clickables are divs, so they each get the attribute */
    Array.prototype.forEach.call(wrap.querySelectorAll(
      '.phw:not(.deco),.trav,.jjphone,.srphone,.phw.deco[data-tap],.phw.deco[data-alt],.sub .funk,.cap .hotword,.jjtrophy,' +
      '.stag,.glogo,.phw.logo,.jjms-imdb li,.jjms-imdb button'
    ), function (el) { if (!el.hasAttribute('data-cursor')) el.setAttribute('data-cursor', 'hover'); });
    var flyEl = document.getElementById('jjms-fly');
    if (flyEl) flyEl.setAttribute('data-cursor', 'hover');

    /* ---- THE SLEEP RULE, FINISHED (m-1008a): what is on screen, and the clips ----
       .jj-on on a step / the finale = within a quarter of a screen of the viewport (the CSS above pauses everything inside the others).
       CLIPS in the page's flow (not the world's fixed scenery, the octopus or the cut-scenes, which have their own switches) are GOVERNED:
       whoever owns a clip still calls play() and pause() exactly as before, but it only really plays while it is itself within 15% of the
       screen; a looping clip that is more than two screens away gives its decoder back (sources out, poster in) and gets them back, without
       refetching, when it comes within two screens again. A clip that plays once and holds its last frame is never unloaded. */
    (function sleepRule() {
      var blocks = steps.concat(finale ? [finale] : []);
      if (!('IntersectionObserver' in window)) { blocks.forEach(function (b) { b.classList.add('jj-on'); }); return; }
      var bio = new IntersectionObserver(function (es) { for (var i = 0; i < es.length; i++) es[i].target.classList.toggle('jj-on', es[i].isIntersecting); }, { rootMargin: '25% 0px 25% 0px' });
      blocks.forEach(function (b) { bio.observe(b); });
      [].forEach.call(wrap.querySelectorAll('.step video,.finale video'), governClip);
    })();
    /* ---- FAR-STEP SKIPPING, BEHIND A SWITCH (m-1008a; OFF unless /storytime?skipfar=1#my-story or window.JJ_MS_SKIPFAR = true) ----
       .jj-far on a step / the finale = more than one screen from the viewport: the CSS stops rendering it. It is woken a whole screen
       before it can be seen, by an IntersectionObserver (no layout reads of ours), and render() also wakes the current step and its two
       neighbours in the same frame as the scroll (nearNow), so a JUMP (the era bar, the hand-over's landing, a link) can never show a
       slide that has not been drawn yet: the observer alone reports one frame after the jump.
       A skipped step still answers measurements (the browser lays it out when asked), so nothing in init needed to change. That is tested
       once, with a 7 px probe in the first step that is skipped; only a browser that answers 0 gets the belt and braces: a step that wakes
       for the first time since a RESIZE re-runs init's own resize handlers once (the same re-measure the hand-over's wake does). */
    var SKF = (location.search.match(/[?&]skipfar=(1|steps|sky)\b/) || [])[1] || (window.JJ_MS_SKIPFAR === true ? '1' : (window.JJ_MS_SKIPFAR === 'steps' || window.JJ_MS_SKIPFAR === 'sky') ? window.JJ_MS_SKIPFAR : '');
    if (SKF === '1' || SKF === 'sky') (function skyFar() {   /* THE SKY, same switch (the class is read by governSky() and dodgeStars(), which start later) */
      var skyEl = document.getElementById('jjms-sky'); if (!skyEl || !slayers.length) return; document.documentElement.classList.add('jjms-skyfar');
      var items = []; slayers.forEach(function (sl) { var k = SKY_PARALLAX ? 1 - (+sl.getAttribute('data-f')) : 0;
        [].forEach.call(sl.children, function (n) { var w = parseFloat(n.style.width) || 60; items.push({ n: n, k: k, p: (parseFloat(n.style.top) || 0) / 100, h: (parseFloat(n.style.height) || w) * 1.9 + 40, off: null }); }); });   /* h: its box, its biggest twinkle (x1.8) and its glow */
      skyCull = function (sy) { var r = skyEl.getBoundingClientRect(), vh = window.innerHeight, m = vh * 0.4 + 60; if (!(r.height > 0)) return;
        for (var i = 0; i < items.length; i++) { var it = items[i], y = r.top + it.p * r.height + it.k * sy, off = y + it.h < -m || y - it.h * 0.5 > vh + m;
          if (off !== it.off) { it.off = off; it.n.classList.toggle('jj-off', off); } } };
      skyCull(window.scrollY || 0);
    })();
    var SKIPFAR = (SKF === '1' || SKF === 'steps') && 'IntersectionObserver' in window && !!(window.CSS && window.CSS.supports && window.CSS.supports('content-visibility', 'hidden'));   /* window.CSS: this file has its own string called CSS */
    if (SKIPFAR) (function skipFar() {
      document.documentElement.classList.add('jjms-skipfar');
      var blocks = steps.concat(finale ? [finale] : []), gen = 0, due = 0, answers = null;
      function probe(el) { try { if (!(el.offsetHeight > 0)) return;   /* the story is not laid out at all yet (still behind the loader): ask again at the next skip */
        var pr = document.createElement('i'); pr.style.cssText = 'position:absolute;left:0;top:0;display:block;width:7px;height:7px;pointer-events:none;'; el.appendChild(pr); answers = pr.offsetWidth === 7; el.removeChild(pr); } catch (e) { answers = true; } }
      function remeasure() { due = 0; if (asleep) return; onMap.slice().forEach(function (m) { if (m[0] === window && m[1] === 'resize' && !m[2]._skf) { try { m[2].call(window, new Event('resize')); } catch (e) {} } });
        blocks.forEach(function (b) { if (!b._far) b._gen = gen; }); }
      function setFar(el, far, h) { if (el._far === far) return false; el._far = far;
        if (el === finale) { if (far) { if (h > 0) el.style.height = h.toFixed(1) + 'px'; } else el.style.height = ''; }   /* the finale's height comes from its content (min-height:100vh): pinned while skipped, so the page keeps its length */
        el.classList.toggle('jj-far', far);
        if (far && answers === null && el !== finale) window.requestAnimationFrame(function () { if (answers === null && el._far && !asleep) probe(el); });
        if (!far && answers === false && el._gen !== gen && !due) due = requestAnimationFrame(remeasure); return true; }
      var fio2 = new IntersectionObserver(function (es) { if (asleep) return;
        for (var i = 0; i < es.length; i++) setFar(es[i].target, !es[i].isIntersecting, es[i].boundingClientRect.height); }, { rootMargin: '100% 0px 100% 0px' });
      blocks.forEach(function (b) { b._gen = 0; b._far = false; fio2.observe(b); });
      nearNow = function (idx) { for (var k = idx - 1; k <= idx + 1; k++) { var b = k < 0 ? null : k < steps.length ? steps[k] : k === steps.length ? finale : null; if (b && b._far) setFar(b, false, 0); } };
      var rz = 0, onRz = function () { gen++; clearTimeout(rz); if (finale && finale._far) setFar(finale, false, 0);
        blocks.forEach(function (b) { if (!b._far) b._gen = gen; });   /* the ones on screen are measured by the resize itself */
        rz = setTimeout(function () { blocks.forEach(function (b) { fio2.unobserve(b); fio2.observe(b); }); }, 400); };   /* a fresh report for every block at the new size */
      onRz._skf = true; jjOn(window, 'resize', onRz);
      window.jjMyStory = window.jjMyStory || {}; window.jjMyStory.skipFar = { far: function () { return blocks.filter(function (b) { return b._far; }).map(function (b) { return b.id || 'finale'; }); }, answers: function () { return answers; } };
    })();
    var JM = window.jjMyStory || {}; JM.land = land; JM.genesis = genesis; JM.stepTop = stepTop; window.jjMyStory = JM;
    /* asleep and awake again (jj:mystory-sleep / -wake after a Replay): see SLEEPABLE at the top of init */
    var slept = [];
    function goSleep() { if (asleep) return; asleep = true; var de = document.documentElement; de.classList.add('jjms-asleep'); de.classList.remove('jjms-live');
      slept = []; try { [].forEach.call(document.querySelectorAll('#jjms video,[id^="jjms-"] video'), function (v) { try { if (!v.paused) { slept.push(v); v.pause(); } } catch (e) {} }); } catch (e) {}
      try { stopSound(); } catch (e) {} try { if (amb && !amb.paused) amb.pause(); } catch (e) {} }
    function goResume() { if (!asleep) return; document.documentElement.classList.remove('jjms-asleep'); asleep = false;
      onMap.slice().forEach(function (m) { if (m[0] === window && m[1] === 'resize') { try { m[2].call(window, new Event('resize')); } catch (e) {} } });   /* everything measured at init, measured again (the page was not laid out while asleep) */
      var pk = parkedRaf; parkedRaf = []; pk.forEach(function (f) { window.requestAnimationFrame(f); });
      var vh = window.innerHeight; slept.forEach(function (v) { try { var q = v.getBoundingClientRect(); if (v.autoplay || (q.width > 0 && q.bottom > 0 && q.top < vh)) { var pp = v.play(); if (pp && pp.catch) pp.catch(function () {}); } } catch (e) {} }); slept = []; }   /* the clips that were running: the always-on ones and whatever is on screen now (the rest restart from their own observers) */
    /* the cover is lifting: the genesis flash waits for the black to be all but gone (what the old opacity poll did), read once from the tale's own fade */
    function lifted() { var el = document.getElementById('jjst'), ms = 0; try { if (el) ms = (parseFloat(getComputedStyle(el).transitionDuration) || 0) * 1000; } catch (e) {} setTimeout(genesis, el ? Math.max(200, ms * 0.97) + 220 : 420); }
    /* the first screen's art: what 'ready' waits for, and what a later visit prefetches (kept per screen shape in localStorage) */
    function firstArt(wait) { var vh = window.innerHeight, vw = window.innerWidth, urls = [], ps = [], add = function (u) { if (u && !/^data:/.test(u) && urls.indexOf(u) < 0) urls.push(u); };
      [steps[0], bg, document.getElementById('jjms-sky'), document.getElementById('jjms-world'), hd, tl, document.querySelector('#jjms .woswim')].forEach(function (r) { if (!r) return;
        [].forEach.call(r.querySelectorAll('img,video[poster]'), function (im) { var we = im.closest('.wera'); if (we && we.getAttribute('data-era') !== '0') return;   /* the other eras' scenery shares the screen's box but is not on it */
          var q = im.getBoundingClientRect(); if (!(q.width > 0 && q.bottom > 0 && q.top < vh && q.right > 0 && q.left < vw)) return;
          if (im.tagName === 'VIDEO') { add(im.poster); return; } var u = im.currentSrc || im.src; if (!u) return; add(u);
          if (wait && !(im.complete && im.naturalWidth)) ps.push(new Promise(function (res) { im.addEventListener('load', res, { once: true }); im.addEventListener('error', res, { once: true }); }).then(function () { return im.decode ? im.decode().catch(function () {}) : 0; }));
          else if (wait && im.decode) ps.push(im.decode().catch(function () {})); }); });
      [].forEach.call(document.querySelectorAll('#jjms-world .wera[data-era="0"] .wlay.art'), function (L) { var m = /url\(["']?([^"')]+)/.exec(L.style.backgroundImage || ''); if (m) add(m[1]); });
      return { urls: urls, wait: ps }; }
    MSD.api = { land: land, genesis: genesis, sleep: goSleep, resume: goResume, lifted: lifted, firstArt: firstArt, render: function () { try { render(); } catch (e) {} } };

    var intro = document.getElementById('jjst');
    if (intro && !MSD.contract) {                                  /* an older storytime.js (no window.jjTale): the old watch on its overlay's opacity */
      /* storytime unlocks the page and starts fading its overlay in the same breath — land while
         that black still covers everything, so the story is already composed when it lifts */
      var watch = setInterval(function () {
        var el = document.getElementById('jjst');
        if (el && parseFloat(getComputedStyle(el).opacity) > 0.99) return;
        clearInterval(watch); land();
      }, 100);
    }
    jjOn(window, 'resize', function () {                /* keep the view still if the gap above resizes */
      if (!landed) return;
      var before = lift; collapseAbove();
      if (lift !== before) jump(Math.max(0, window.scrollY - (lift - before)));
    });
  }

  /* ===== DORMANT UNTIL THE HAND-OVER (m-1007a) =====
     My Story used to build itself at DOMContentLoaded and then sit alive under the whole of Storytime: 5,158 nodes, 150+ running
     animations, two clips decoding and 2 ms of every frame of the tale. Now, when the tale is going to play, NOTHING of it exists until
     the tale asks. The contract (storytime.js s130 implements the other half):
       window.jjTale = { active: true }  set by storytime.js as it is evaluated (it is the earlier script) when the tale will play.
                                         Absent (no tale on the page) or active:false (the #my-story address): build at once, as before.
       jj:mystory-prefetch               late in the tale: the first screen's art starts downloading, quietly. Nothing else.
       jj:mystory-wake                   the tale's cover is fully up: build (first time) or resume (after a sleep), land, wait for the
                                         first screen's art (2.5 s at most), then answer:
       jj:mystory-ready                  sent from here, with jjMyStory.dormant = false. The tale holds its cover until this (6 s cap).
       jj:mystory-lift                   the cover is lifting: the genesis cue (this replaces the 100 ms opacity polls).
       jj:mystory-sleep                  Replay Storytime: asleep again (loops parked, clips paused, out of the render tree), kept built.
     window.jjMyStory.dormant is true from script evaluation until the first 'ready', and again between a sleep and the next 'ready'.
     With an older storytime.js (no window.jjTale) everything runs as it always did, polls and all. */
  var MSD = { contract: false, woken: false, built: false, lifted: false, waking: false, tok: 0, later: [], hold: null, api: null, pre: [], t: {} };
  window.jjmsDormancy = MSD;                                     /* for the console and the tests */
  var FIRST_ART = ['era-0-far.webp', 'era-0-mid.webp', 'era-0-near.webp', 'era-0-edge.webp', 'era-0-mask.webp', 'era-0-fish-strip.webp', 'ms-octopus-swim-poster.webp', 'storytime-bg.svg', 'sky-star.svg', 'sky-dot.svg', 'story-sprite-01-amoeba.webp',
    'story-photo-01-cap.jpg', 'story-photo-02-tiger.jpg', 'story-photo-03-bench.jpg', 'story-photo-04-archery.jpg', 'story-photo-05.jpg', 'story-photo-06.jpg'];   /* the first screen's files (relative to the story base): the seed for a first visit's prefetch. A visit that has built My Story once keeps its own measured list (localStorage); jjMyStory.firstArt() prints the current one */
  function msSay(n) { try { window.dispatchEvent(new CustomEvent(n)); } catch (e) {} }
  function artKey() { return 'jjmsFirstArt:' + (window.innerWidth >= window.innerHeight ? 'l' : 'p') + (window.innerWidth < 700 ? 's' : 'w'); }
  function prefetch() { if (MSD.pre.length || MSD.built) return; var list = null;
    try { var j = JSON.parse(localStorage.getItem(artKey()) || 'null'); if (j && j.b === window.JJ_MYSTORY_BUILD.slice(0, 8) && j.u && j.u.length) list = j.u; } catch (e) {}
    if (!list) list = FIRST_ART.map(function (f) { return /^https?:|^\//.test(f) ? f : SB + f; });
    list.forEach(function (u) { try { var im = new Image(); im.decoding = 'async'; try { im.fetchPriority = 'low'; } catch (e) {} im.src = u; MSD.pre.push(im); } catch (e) {} }); }
  function ready() { MSD.waking = false; MSD.t.ready = performance.now(); if (window.jjMyStory) window.jjMyStory.dormant = false; msSay('jj:mystory-ready'); }
  function wake() {
    if (MSD.waking) return; var J = window.jjMyStory;
    if (MSD.built && !(J && J.dormant)) { try { MSD.api.land(); } catch (e) {} msSay('jj:mystory-ready'); return; }   /* nobody was asleep (a second wake, or built at load): land, answer at once */
    MSD.waking = true; MSD.lifted = false; MSD.t = { wake: performance.now() }; var tok = ++MSD.tok;   /* a sleep that arrives while the art is still coming in cancels this answer */
    try {
      if (!MSD.built) { MSD.woken = true; MSD.hold = []; init(); MSD.built = true; MSD.t.built = performance.now(); } else { MSD.hold = []; MSD.api.resume(); MSD.t.built = performance.now(); }
      MSD.api.land(); void document.documentElement.offsetHeight;   /* the one long first layout happens here, under the cover */
      MSD.t.laid = performance.now();
      var fa = MSD.api.firstArt(true), all = (MSD.hold || []).concat(fa.wait); MSD.hold = null;
      try { localStorage.setItem(artKey(), JSON.stringify({ b: window.JJ_MYSTORY_BUILD.slice(0, 8), u: fa.urls })); } catch (e) {}
      var done = false, fin = function () { if (done || tok !== MSD.tok) return; done = true; MSD.t.art = performance.now(); MSD.api.render();
        window.requestAnimationFrame(function () { window.requestAnimationFrame(function () { if (tok === MSD.tok) ready(); }); }); };   /* two frames: it has been styled, laid out and painted once before the cover moves */
      Promise.all(all).then(fin, fin); setTimeout(fin, 2500);
    } catch (e) { try { console.warn('[JJ] mystory: wake failed', e); } catch (x) {} ready(); }
  }
  function lift() { MSD.lifted = true; MSD.pre = []; var q = MSD.later; MSD.later = []; if (MSD.api) MSD.api.lifted();
    setTimeout(function () { q.forEach(function (f) { try { f(); } catch (e) {} }); }, 1800); }   /* what the first screen did not need starts once the lift has played */
  function sleep() { MSD.tok++; MSD.waking = false; MSD.hold = null; if (!MSD.built) { if (window.jjMyStory) window.jjMyStory.dormant = true; return; } MSD.api.sleep(); MSD.lifted = false; window.jjMyStory.dormant = true; }
  function boot() {
    var tale = false; try { MSD.contract = !!window.jjTale; tale = !!(window.jjTale && window.jjTale.active); } catch (e) {}
    if (MSD.contract) { window.addEventListener('jj:mystory-prefetch', prefetch); window.addEventListener('jj:mystory-wake', wake); window.addEventListener('jj:mystory-lift', lift); window.addEventListener('jj:mystory-sleep', sleep); }
    if (!tale) { MSD.lifted = true; init(); MSD.built = true; if (window.jjMyStory) { window.jjMyStory.dormant = false; window.jjMyStory.firstArt = function () { return MSD.api.firstArt(false).urls; }; } return; }
    try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  }
  /* registered as this file is evaluated, so the tale can ask "is anyone asleep?" from its very first frame */
  try { if (window.jjTale && window.jjTale.active) window.jjMyStory = { dormant: true, land: function () {}, genesis: function () {}, stepTop: function () { return 0; }, firstArt: function () { return MSD.api ? MSD.api.firstArt(false).urls : []; } }; } catch (e) {}
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
