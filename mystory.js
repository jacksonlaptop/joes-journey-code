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
  window.JJ_MYSTORY_BUILD = 'M106 - the bang waits for the screen: edge-to-edge always';
  try { console.log('%c[JJ] mystory.js build: ' + window.JJ_MYSTORY_BUILD, 'color:#FF00F5;font-weight:bold'); } catch (e) {}

  var GB = 'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/';
  /* demo pages can point at local copies via window.JJ_SPRITE_BASE */
  var SB = window.JJ_SPRITE_BASE || GB;

  /* ---------------- CONFIG — every word of the story ---------------- */
  /* The full evolution sprite line, extracted from the design frames themselves. */
  var SPRITES = [
    SB + 'story-sprite-01-amoeba.png',
    SB + 'story-sprite-02-fish.png',
    SB + 'story-sprite-03-walker.png',
    SB + 'story-sprite-04-ape.png',
    SB + 'story-sprite-05-caveman.png',
    SB + 'story-sprite-06-greek.png',
    SB + 'story-sprite-07-roman.png',
    SB + 'story-sprite-08-peasant.png',
    SB + 'story-sprite-09-villager.png',
    SB + 'story-sprite-10-knight.png',
    SB + 'story-sprite-11-painter.png',
    SB + 'story-sprite-12-scholar.png',
    SB + 'story-sprite-13-modern.png',
    SB + 'story-sprite-14-scientist.png',
    SB + 'story-sprite-15-astronaut.png'
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
  /* ---- CLUSTERS: a LEAD photo with the rest of its set stacked behind it; click and the whole set fans
     out in a lightbox. Used for the travel screen (step 7, positions from My Storytravel.svg, canvas
     1627×1019) and the football run on the sports screen (step 4). `files` lists the whole set, lead
     first. `cc` (optional) are the countries, shown as individual floating chips beside the photo. ---- */
  var MEXCAP = 'Made it to Mexico for D\u00edas de los Muertos! (maybe slightly influenced by ' +
    'Book of Life and Coco\u2026)';
  var LOGOS = {
    /* the agency slide, laid out to My Story - Agency 1.svg */
    12: [
      { t: 'BBC',          src: 'ag-bbc.png',        x: 41.98, y: 25.0,  w: 16.29, r: 2.11,  fx: 'boom' },
      { t: 'AXA',          src: 'ag-axa.png',        x: 17.45, y: 28.06, w: 8.4,   r: -3.58, fx: 'shield' },
      { t: 'Lab',          src: 'ag-lab.png',        x: 70.88, y: 22.47, w: 6.58,  r: 6.37,  fx: 'wire' },
      { t: 'Carter Jonas', src: 'ag-cj.png',         x: 82.5,  y: 33.5,  w: 10.69, r: 6.27,  fx: 'house' },
      { t: 'Art Basel',    src: 'ag-artbasel.png',   x: 6.73,  y: 50.04, w: 6.08,  r: 6.07,  fx: 'easel' },
      { t: 'Tui',          src: 'ag-tui.png',        x: 80.0,  y: 67.52, w: 9.17,  r: 6.38,  fx: 'travel' },
      { t: 'Mnemoscene',   src: 'ag-mnemoscene.png', x: 33.56, y: 69.60, w: 7.13,  r: 0.25,  fx: 'vr' },
      { t: 'UCL',          src: 'ag-ucl.png',        x: 59.66, y: 75.21, w: 6.82,  r: 4.86,  fx: 'grad' },
      { t: 'Screwfix',     src: 'ag-screwfix.png',   x: 15.30, y: 75.67, w: 7.5,   r: -3.81, fx: 'screw' }
    ],
    /* the awards slide, laid out to My Story - Awards 1.svg. The two agencies draw a little design
       illustration when pressed; the BIMAs are the actual silver awards, so they get the shine on
       hover and the confetti on press. */
    13: [
      { t: 'Foolproof',            src: 'aw-2.png',     x: 13.28, y: 29.90, w: 13.09, r: -3.68, fx: 'cursor2' },
      { t: 'UIC Digital × Fantasy', src: 'aw-3.png', x: 70.62, y: 24.24, w: 17.27, r: 0, fx: 'grid' },
      { t: 'BIMA Awards Winner 2021 — Best Digital Transformation, Silver',
        src: 'aw-bima1.png', x: 16.63, y: 62.90, w: 10.39, r: 4.82,  fx: 'boom', shine: true },
      { t: 'BIMA Awards Winner 2024 — Best Digital Transformation, Silver',
        src: 'aw-bima2.png', x: 73.88, y: 65.29, w: 10.45, r: -3.47, fx: 'boom', shine: true },
      { t: 'Joe',                  src: 'aw-5.png',     x: 45.60, y: 65.55, w: 9.96,  r: 0,     fx: 'boom' }
    ]
  };
  var CLUSTERS = [
    /* Europe sits in the middle of the screen now. Its countries still cluster BESIDE the photo
       (ccSide) rather than under it — the headline is directly below and there's no room. x centres
       the WHOLE group: photo (13) + gap (1.2) + chips (17) = 31.2vw wide, so 50 - 31.2/2 = 34.4. */
    { step: 7, key: 'eu', x: 34.4, y: 17.5, w: 13, rot: -6.62, ar: 0.75, name: 'Europe',
      files: ['trav-eu-1.jpg'],
      cc: [['Belgium', '🇧🇪'], ['Netherlands', '🇳🇱'], ['Germany', '🇩🇪'], ['Poland', '🇵🇱'], ['Czechia', '🇨🇿'], ['Slovenia', '🇸🇮'], ['Croatia', '🇭🇷']],
      ccSide: true, ccw: 17,
      cap: 'Went interrailing with my friends from school, this is the only photo that survived!' },
    /* Peru / Bolivia lives on the Mexico screen now — top left, clear of the philosopher below it
       and of the Mexico set on the right. */
    { step: 8, key: 'pe', x: 8.5, y: 19, w: 15, rot: 3.32, ar: 0.673, name: 'Peru / Bolivia',
      files: ['trav-pe-1.jpg', 'trav-pe-2.jpg', 'trav-pe-3.jpg'],
      cc: [['Peru', '🇵🇪'], ['Bolivia', '🇧🇴']], ccw: 20,
      cap: 'Ended up volunteering in a hostel (briefly), worked with the best crew in Bolivia' },
    { step: 7, key: 'as', x: 75.17, y: 55.64, w: 14.9, rot: 4.1, ar: 1.23, name: 'Asia',
      files: ['trav-as-1.jpg', 'trav-as-2.jpg', 'trav-as-3.jpg', 'trav-as-4.jpg'],
      cc: [['Sri Lanka', '🇱🇰'], ['Nepal', '🇳🇵'], ['Vietnam', '🇻🇳'], ['Laos', '🇱🇦'], ['Thailand', '🇹🇭']], ccw: 22,
      cap: '2 Month travel ended up lasting 8 months including becoming a Western Manager of a hostel in Hanoi?' },
    { step: 7, key: 'au', x: 13.09, y: 58.89, w: 12.3, rot: -8.97, ar: 1.30, name: 'Australia',
      files: ['trav-au-1.jpg', 'trav-au-2.jpg', 'trav-au-3.jpg', 'trav-au-4.jpg'],
      cc: [['Australia', '🇦🇺']], ccw: 12,
      cap: 'Worked at gigs and events in Melbourne and ended with my farm work in Bundaberg (also was injured by a falling sweet potato…)' },
    /* Mexico for Día de los Muertos — same collection treatment as the travel screen: mex-01 leads,
       the other three fan out on click, and the caption only shows in the modal */
    { step: 8, key: 'mx', x: 71.5, y: 6.0, w: 13.5, rot: 8.55, ar: 1.335, name: 'Mexico',
      files: ['mex-01.jpg', 'mex-02.jpg', 'mex-03.jpg', 'mex-04.jpg'],
      cc: [['Mexico', '\ud83c\uddf2\ud83c\uddfd']], ccw: 13.5, ccGap: 0.5,
      cap: MEXCAP },
    /* Brighton — one photo, tagged like the countries */
    { step: 9, key: 'br', x: 45, y: 16.5, w: 9, rot: 4.11, ar: 1.333, name: 'Brighton',
      files: ['brighton-01.jpg'],
      cc: [['Brighton', '\ud83c\uddec\ud83c\udde7']], ccw: 9, ccGap: 0.5,
      cap: 'Me catching the Sun' },
    /* the friends set — one photo leads, the rest fan out */
    { step: 4, key: 'fr', x: 16.41, y: 19.5, w: 17.5, rot: -6.33, ar: 0.665,
      name: 'We re-created the same picture 5 years on and yes, that\u2019s me with our headteacher',
      files: ['friends-1.jpg', 'friends-2.jpg', 'friends-3.jpg', 'friends-4.jpg'] },
    /* the rugby pair */
    { step: 4, key: 'rg', x: 79.6, y: 57, w: 17, rot: 14.15, ar: 1.014,
      name: 'I think I got past one of them...',
      files: ['sport-05.jpg', 'rugby-2.jpg'] },
    /* the football run, clustered like the travel sets */
    { step: 4, key: 'fb', x: 8.48, y: 62.45, w: 22.26, rot: -10.87, ar: 0.42,
      name: 'Yep, thats me scoring a goal 😎, thanks for the photos Karen Brooke!',
      files: ['sport-00.jpg', 'sport-01.jpg', 'sport-02.jpg', 'sport-03.jpg', 'sport-04.jpg'] }
  ];
  /* flip to true to put the job rail back on the ruler (also widens the year spacing to suit) */
  var SHOW_JOBS = false;
  /* the star layers drifting at their own speeds on scroll. Each layer holds dozens of individually
     composited (animated) stars, so translating the parent forces them all to re-composite every
     frame — flip to false to leave the field still and let it scroll with the story. */
  var SKY_PARALLAX = false;
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
    { y: 2018, co: 'Skyrock Projects',      loc: 'Taipei, Taiwan', role: 'Web Dev & Design',   logo: 'job-skyrock.png' },
    { y: 2020, co: 'Mnemoscene (Contract)', loc: 'Brighton, UK',   role: 'UX Research & Design', logo: 'job-mnemoscene.png' },
    { y: 2021, co: 'Foolproof Agency',      loc: 'London, UK',     role: 'Visual Designer',    logo: 'job-foolproof.png' },
    { y: 2022, co: 'Lab Agency (Contract)', loc: 'Remote',         role: 'Senior UI/UX Design', logo: 'job-lab.png' },
    { y: 2023, co: 'UIC Digital (Contract)', loc: 'London, UK',    role: 'Senior UI Design',   logo: 'job-uic.png' },
    { y: 2024, co: 'Super Reel Travel',     loc: 'Remote',         role: 'Head of Design',     logo: 'job-superreel.png' }
  ];
  var STEPS = [
    { era: 0, cap: 'And the lord said “Let there be Joe!”', sub: 'Best experienced with sound on…' },
    { era: 0, cap: 'I started playing games at a very young age', sub: '& I had a huuuuuge PC in my room at 7 so I loved computers' },
    { era: 0, cap: 'Apparently I used to lead raids when I was 7', sub: '& was building guilds at 8…' },
    /* This one plays out over three screens: the room darkens, the film starts as a speck at the
       top and grows until it owns the screen. `tall` gives the step the room to do it in. */
    { era: 0, cap: 'I made my first animation when I was 12', sub: 'If the psych Doctors saw this one at the time…',
      tall: 3, grow: { src: 'vid-flobby.mp4', poster: 'vid-flobby.jpg', cap: 'The Flobby & Bobby Show',
        /* the studios that started it, drifting around the headline. Each falls back to its name in
           a pill until the artwork is dropped in. */
        logos: [
          { t: 'Disney',        src: 'studio-disney.png',     x: 7.5, y: 20, w: 14.5, r: -4 },
          { t: 'Pixar',         src: 'studio-pixar.png',      x: 79,  y: 17, w: 13,   r: 3.5 },
          { t: 'DreamWorks',    src: 'studio-dreamworks.png', x: 5,   y: 56, w: 15,   r: 3 },
          { t: 'Studio Ghibli', src: 'studio-ghibli.png',     x: 80,  y: 58, w: 14.5, r: -3.5 }
        ] } },
    { era: 1, cap: 'I\u2019d had a very stereotypical small town upbringing',
      sub: 'Played sports, games, hung out with my friends, etc...' },
    { era: 1, cap: 'I started to realise that films were my passion', sub: 'I’ve rated over 1700 titles on iMDB, click on the titles to find out more…' },
    { era: 1, cap: 'I even made a few…interesting ones in school…', sub: 'Take your pick' },
    { era: 2, cap: 'I travelled the world & lived/volunteered in a few places along the way' },
    { era: 2, cap: 'On the way I met a few people building websites and travelling and it made me think…' },
    { era: 3, cap: 'So I went off to Brighton to study BSc Digital Media where I learned lots of new skills',
      sub: 'Hint: You can interact with the skills tags\u2026Just sayin\u2019!' },
    { era: 3, cap: 'I was awarded a scholarship to work in Taipei, Taiwan for a year as a Web Developer & Designer for a start-up',
      hot: 'awarded',        /* click the word for a little celebration */
      trophy: { x: 12, y: 24, w: 6.4 } },
    { era: 3, cap: 'Came back to Brighton in COVID',
      sub: '& did my final year project on ‘The Gamification and Future of e-Learning’',
      phone: { src: 'geoquest-demo.mp4', x: 32.5, y: 12, w: 6.5,
               cap: 'Created this demo of the app on Android Studio in XML and Javascript ' +
                    '(wasn\u2019t required but I wanted to try it anyway!)' },
      /* the project name is a funky underlined link — pressing it opens the case-study overview */
      funk: { phrase: 'The Gamification and Future of e-Learning', img: 'geoquest-overview.jpg',
              cap: 'GeoQuest — The Gamification and Future of e-Learning' } },
    { era: 4, cap: 'Then life began...I worked with some big design agencies for some big brands',
      sub: 'This is when I realised how much I love UI, UX, Visual and all type of design' },
    { era: 4, cap: 'Managed to win some awards along the way',
      hot: 'awards',         /* gold in the headline, like the design — and it throws a party */
      sub: 'Silver British Interactive Media Award (BIMA) for Best Digital Transformation of the year…twice' },
    { era: 5, cap: 'I’m now leading the design for Super Reel Travel', sub: 'An AI integrated trip planning app where users search through reels for travel inspiration',
      srp: { x: 81.5, y: 46, w: 10.5 } },          /* a drawn phone running a reels-style feed */
    { era: 5, cap: 'In my spare time I’m creating projects like this, travelling, playing sports, learning about AI, space & history & updating my iMDB', sub: 'I couldn’t decide between history or space theme but I love evolution so lucky you, an excuse for both!' }
  ];
  /* SHOW_JOBS spreads the ruler to the design's density (116px/year) so a whole job card fits between
     one year label and the next; with the rail off it returns to the original compact 60px/year. */
  var PX_PER_YEAR = SHOW_JOBS ? 116 : 60, MARKER_VH = 0.42;
  /* the Big Bang finale — where the story hands over to the rest of the site */
  var FINALE_CAP = 'And with one last bang… a whole new universe to explore';
  var LINKS = [
    { label: 'Work', href: '/case-studies', hue: '#FF00F5' },
    { label: 'Contact', href: '/contact', hue: '#7d5bff' },
    { label: 'Credits', href: '/contact#credits', hue: '#4aa8ff' }   // confirm the credits URL
  ];
  /* Photo collages, keyed by step index. x/y/w are % of the viewport, lifted straight from the
     design frame (1627×1019 canvas); height follows each photo's own aspect ratio. Add a step's
     photos here as they're exported — every step can hold as many as it likes. */
  /* Scattered label chips — the same pill styling as the country tags, but each one placed on its
     own (x/y are % of the step) instead of flowing in a row. Step 9's skills come from the design
     frame; the icons are picked to read at chip size. */
  var TAGS = {
    /* What the project was built with. The design frame keeps the whole left side for George and
       Greybeard and marks out a block on the right for these, so they climb the right-hand edge. */
    11: [
      { t: 'JavaScript', i: '\u26a1', x: 79.0, y: 51.0, r: -2.1, fx: 'type', txt: 'console.log(\u2018\u26a1\u2019)' },
      { t: 'XML', i: '\ud83d\udcc4', x: 82.0, y: 45.5, r: 2.2, fx: 'type', txt: '<LinearLayout/>' },
      { t: 'Android Studio', i: '\ud83e\udd16', x: 79.0, y: 39.5, r: -3.0, fx: 'build' },
      { t: 'After Effects', i: '\u2728', x: 82.0, y: 33.5, r: 2.6, fx: 'bounce' },
      { t: 'Premiere Pro', i: '\ud83c\udfac', x: 79.0, y: 28.0, r: -1.7, fx: 'clip' },
      { t: 'Framer X', i: '\ud83d\udd37', x: 82.5, y: 22.5, r: 3.2, fx: 'spin' },
      { t: 'Figma', i: '\ud83c\udfa8', x: 79.5, y: 17.0, r: 1.9, fx: 'swirl' },
      { t: 'Photoshop', i: '\ud83d\uddbc\ufe0f', x: 82.0, y: 11.5, r: -2.4, fx: 'paint' }
    ],
    /* a country pill in the same style as the travel ones, tucked under the Skyrock logo */
    10: [
      { t: 'Taipei, Taiwan', i: '\ud83c\uddf9\ud83c\uddfc', x: 71.5, y: 81.5, r: 2.2, sm: true }
    ],
    9: [
      { t: 'Backend Development', i: '\u2699\ufe0f', x: 15.0, y: 21.0, r: -2.8, fx: 'binary' },
      { t: 'Human-Computer Interaction', i: '\ud83e\udde0', x: 63.0, y: 15.5, r: 2.1, fx: 'cursor' },
      { t: 'Animation', i: '\ud83c\udf9e\ufe0f', x: 8.0, y: 28.5, r: 3.4, fx: 'bounce' },
      { t: '3D Modelling', i: '\ud83e\uddca', x: 74.5, y: 30.0, r: -3.1, fx: 'spin' },
      { t: 'UI/UX Design', i: '\ud83c\udfa8', x: 8.0, y: 62.0, r: 1.6, fx: 'draw' },
      { t: 'Web Development', i: '\ud83c\udf10', x: 30.0, y: 70.5, r: -1.9, fx: 'type' },
      { t: 'Digital Marketing', i: '\ud83d\udcc8', x: 66.0, y: 66.0, r: 2.7, fx: 'chart' }
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
    /* step 1 — childhood games */
    1: [
      { src: 'game1-00.jpg', x: 2.03, y: 25.95, w: 14.32, rot: -6.02 },
      { src: 'game1-04.jpg', x: 82.42, y: 16.05, w: 11.19, rot: 11.42 },
      { src: 'game1-05.jpg', x: 92.03, y: 58.78, w: 12.29, rot: 10.82 },
      { src: 'game1-06.jpg', x: 5.65, y: 67.52, w: 11.95, rot: -5.62 },
      { src: 'game1-07.jpg', x: 42.84, y: 65.19, w: 10.45, rot: -7.18 }
    ],
    /* step 2 — MMO / guild games (raids, guilds) */
    2: [
      { src: 'game2-03.jpg', x: 5.41, y: 29.55, w: 11.68, rot: -15.61 },
      { src: 'game2-04.jpg', x: 82.41, y: 16.68, w: 17.09, rot: 7.54 },
      { src: 'game2-05.jpg', x: 88.05, y: 59.76, w: 12.57, rot: 15.71 },
      { src: 'game2-06.jpg', x: 3.2, y: 62.48, w: 10.39, rot: -8.05 },
      { src: 'game2-07.jpg', x: 37.0, y: 66.83, w: 9.37, rot: -10.2 }
    ],
    /* step 3 — the first animation. `vid` makes the card a video: poster + play badge, and clicking it
       opens the player lightbox (same chrome as the films). */

    /* step 4 — the football run is a CLUSTER (see CLUSTERS); this is the one drawing that survived */
    /* step 4 — the small-town slide. Placements straight off My Story - Small Town.svg; the two
       game covers behave exactly like the film posters (hover caption, click to blow up). */
    4: [
      { src: 'sport-08.jpg', x: 74.36, y: 16.92, w: 17.62, rot: 5.85, cap: 'The one that stood the test of time', hoverCap: false },
      { src: 'game-fifa10.jpg', x: 48.43, y: 17.61, w: 8.6, rot: 3.92, hoverCap: false,
        cap: 'Spent a lot of time on these games, this was the best (or 12)' },
      { src: 'game-mw2.jpg', x: 47.87, y: 63.77, w: 8.73, rot: -6.43, hoverCap: false,
        cap: 'Spent even longer on this one, an embarrassing amount...' }
    ],
    /* step 5 — favourite films. Captions live in the blown-up card only, never on hover. */
    5: [
      { src: 'film-02.jpg', x: 11.96, y: 48.82, w: 8.28, rot: 5.61, cap: 'Best trilogy', hoverCap: false },
      { src: 'film-03.jpg', x: 81.37, y: 50.84, w: 8.29, rot: 7.99, cap: 'Most magical', hoverCap: false },
      /* the favourite — finding it sets off a Day of the Dead burst + a little marimba flourish */
      { src: 'film-04.jpg', x: 74.19, y: 18, w: 9.22, rot: 8.11, cap: 'Probably my favourite?', hoverCap: false, pin: true,
        note: 'If you haven’t seen it you must watch it, the most beautiful film',
        party: true },
      { src: 'film-05.jpg', x: 23.66, y: 20.53, w: 8.6, rot: -7.4, cap: 'Best Pixar', hoverCap: false },
      { src: 'film-06.jpg', x: 26.12, y: 49.78, w: 9.53, rot: -7.92, cap: 'Best foreign animated', hoverCap: false },
      { src: 'film-07.jpg', x: 61.06, y: 59.95, w: 7.17, rot: 11.12, cap: 'Most underrated', hoverCap: false },
      { src: 'film-08.jpg', x: 49.63, y: 17.74, w: 8.2, rot: 10.53, cap: 'Favourite foreign film', hoverCap: false },
      { src: 'film-09.jpg', x: 89.98, y: 64.1, w: 4.15, rot: -10.82, cap: 'The film that got me into films', hoverCap: false },
      { src: 'film-10.jpg', x: 73.54, y: 68.47, w: 4.02, rot: 8.3, cap: 'Most nostalgic', hoverCap: false },
      { src: 'film-11.jpg', x: 21.82, y: 83.88, w: 4.09, rot: -6.12, cap: 'Coolest film (shoutout Neo)', hoverCap: false },
      { src: 'film-12.jpg', x: 7.28, y: 72.12, w: 4.1, rot: -16.02, cap: 'Best Disney', hoverCap: false },
      { src: 'film-13.jpg', x: 6.8, y: 31.89, w: 4.1, rot: -7.02, cap: 'First Studio Ghibli', hoverCap: false },
      { src: 'film-14.jpg', x: 46.02, y: 56.29, w: 5.16, rot: 6.81, cap: 'Best Sunday film', hoverCap: false },
      { src: 'film-15.jpg', x: 91.92, y: 41.44, w: 4.61, rot: 9.2, cap: 'Best teen film', hoverCap: false },
      { src: 'film-16.jpg', x: 87.67, y: 21.45, w: 4.12, rot: -11.85, cap: 'Most beautiful', hoverCap: false },
      { src: 'film-17.jpg', x: 80.18, y: 8.1, w: 4.18, rot: 12.43, cap: 'Coolest style', hoverCap: false },
      { src: 'film-18.jpg', x: 62.86, y: 11.26, w: 4.61, rot: -10.1, cap: 'Most I’ve cried at the cinema :(', hoverCap: false },
      { src: 'film-19.jpg', x: 37.41, y: 8.53, w: 4.18, rot: -7.7, cap: 'Best true story', hoverCap: false },
      { src: 'film-20.jpg', x: 70.99, y: 50.17, w: 4.12, rot: 0.0, cap: 'Great twist', hoverCap: false },
      { src: 'film-21.jpg', x: 83.07, y: 76.59, w: 4.06, rot: -13.1, cap: 'Shouldn’t be this good', hoverCap: false },
      { src: 'film-22.jpg', x: 38.11, y: 70.78, w: 4.12, rot: 0.0, cap: 'Favourite romance', hoverCap: false },
      { src: 'film-23.jpg', x: 15.62, y: 25.42, w: 4.12, rot: 6.99, cap: 'Best sleepover film', hoverCap: false },
      { src: 'film-24.jpg', x: 72.58, y: 86.15, w: 4.43, rot: -8.69, cap: 'Best sequel', hoverCap: false },
      /* the twist: it's invisible on the page — you only find it by clicking, and then it appears */
      { src: 'film-25.jpg', x: 59.03, y: 89.27, w: 4.12, rot: 10.05, cap: 'Best twist', hoverCap: false, secret: true },
      { src: 'film-26.jpg', x: 13.3, y: 87.6, w: 4.36, rot: 13.31, cap: 'Great true story adventure', hoverCap: false },
      { src: 'film-27.jpg', x: 39.89, y: 90.18, w: 4.18, rot: -5.86, cap: 'Danny McBride is the best', hoverCap: false },
      /* 125px tall at a 900px viewport; 346x520 art, so 5.76vw wide */
      { src: 'film-sevensam.jpg', x: 22.5, y: 61.1, w: 5.76, rot: 4.2,
        cap: 'Watched this very young and it still holds up!', hoverCap: false }
    ],
    /* step 6 — the school films ("take your pick"), placed from My StoryWITH VI.svg */
    6: [
      { src: 'vid-patient12.jpg', x: 68.03, y: 12.5, w: 25.45, rot: 8.35, yt: 'qXvA3WWhkSY', cap: 'Patient 12' },
      { src: 'vid-siblings.jpg', x: 10.57, y: 61.33, w: 25.45, rot: -6.93, yt: 'Sf4OV3aJ4SM', cap: 'Siblings' }
    ],
    /* step 11 — GeoQuest, the final year project. The demo is the real screen recording (344x720,
       already phone-shaped) playing silently in a phone frame; the promo is the YouTube one. */
    11: [
      /* the two vikings from the app, side by side down the left exactly as My Story covid2.svg
         has them. Their labels stay hidden until they're clicked. */
      { src: 'char-greybeard.png', x: 8.63, y: 36.83, w: 9.30, rot: -9.57, deco: true, tap: true,
        cap: 'This is Greybeard the Grey, a name that brings fear into the hearts of the Anglo-Saxons!' },
      { src: 'char-george.png', x: 20.5, y: 24.44, w: 7.23, rot: 4.56, deco: true, tap: true,
        cap: 'Meet George! He guides the user through the app as they go' },
      /* the promo sits bottom-middle under the copy — the design has it 405 wide, taken in a touch */
      { src: 'geoquest-promo.jpg', x: 53.5, y: 61.5, w: 21.5, rot: 2, yt: 'AmPcWjaTHH4', hoverCap: false,
        cap: 'Here\u2019s a promotional video I made for the project, I received 95/100 for the whole ' +
             'Final Year Project which I was pretty happy with!' }
    ],
    /* step 10 — Taiwan. Two photos at their design spots, plus the Skyrock lockup: `deco` keeps it
       out of the hover/blow-up machinery and `logo` gives it its own idle animation. */
    10: [
      { src: 'taiwan-01.jpg', x: 64, y: 11, w: 21, rot: 3.95 },
      { src: 'taiwan-02.jpg', x: 9.8, y: 66.5, w: 23, rot: -5.93 },
      { src: 'skyrock.png', x: 69.8, y: 72.3, w: 12.5, rot: 2.03, deco: true, logo: true }
    ],
    /* step 8 — Mexico for Día de los Muertos. The design frame has one photo top-right (1118.65, 86,
       230×307, 8.55°) and the philosopher bottom-left. The photos are a CLUSTER (see below) so they
       behave exactly like the travel sets; `deco` keeps the philosopher out of the hover/blow-up
       machinery — he just floats, and `alt` gives him a second face to switch to when prodded. */
    8: [
      { src: 'story-philosopher-think.png', alt: 'story-philosopher-happy.png',
        x: 7.62, y: 61.83, w: 14.08, rot: 0, deco: true }
    ]
  };
  /* ------------------------------------------------------------------ */

  var Y0 = Math.floor(ERAS[0].years[0]), Y1 = Math.ceil(ERAS[ERAS.length - 1].years[1]);

  var CSS =
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
  '#jjms-fly{position:fixed;left:0;top:0;width:150px;height:150px;z-index:0;pointer-events:none;opacity:0;' +
    'transition:opacity .6s ease;will-change:transform;animation:jjFly 30s ease-in-out infinite;}' +
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
  '#jjms .gdim{position:absolute;inset:0;z-index:1;pointer-events:none;will-change:opacity;opacity:0;' +
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
  '#jjms .sub{font-size:clamp(24px,2.2vw,32px);opacity:.62;margin:18px 0 0;max-width:820px;line-height:1.45;' +
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
  '#jjms .phw.deco{pointer-events:none;}' +
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
  '#jjms .stag{position:absolute;z-index:2;cursor:pointer;}' +
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
  '#jjms-detail .jjd-found{display:none;margin:0 0 12px;font-size:clamp(13px,1.1vw,17px);font-weight:800;letter-spacing:.14em;' +
    'text-transform:uppercase;color:#FFC33D;text-shadow:0 2px 14px rgba(0,0,0,.85);animation:jjFound .7s cubic-bezier(.22,1,.36,1) both;}' +
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
  '#jjms-player .jjp-title,#jjms-shot .jjp-title{margin:16px 0 0;text-align:center;}' +
  /* the single-image lightbox */
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
  '#jjms .phw.blown{z-index:400;transition:transform .6s cubic-bezier(.2,.8,.25,1);}' +
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
  '#jjms-detail .jjd-star{color:#F5C518;font-size:27px;line-height:1;filter:drop-shadow(0 0 9px rgba(245,197,24,.6));}' +
  '#jjms-detail .jjd-score{color:#fff;font-size:27px;font-weight:800;letter-spacing:.01em;}' +
  '#jjms-detail .jjd-out{color:rgba(255,255,255,.55);font-size:16px;font-weight:600;margin-left:-3px;}' +
  '#jjms-detail .jjd-src{color:#F5C518;font-size:13px;font-weight:800;letter-spacing:.09em;margin-left:5px;}' +
  /* ---- the Super Reel phone: a reels feed drawn entirely in code ---- */
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
    'animation:jjsrFeed 17s cubic-bezier(.7,0,.25,1) infinite;will-change:transform;}' +
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
  '#jjms-tease .tskip{position:absolute;bottom:5vh;left:50%;transform:translateX(-50%);font-size:12.5px;font-weight:600;' +
    'letter-spacing:.14em;text-transform:uppercase;color:rgba(238,242,248,.45);opacity:0;animation:jjmsFc .6s ease 1.6s both;}' +
  /* ---- the History Exam ---- */
  '#jjms .fquiz{margin-top:clamp(20px,3.4vh,34px);padding:12px 22px;border-radius:999px;border:1px solid rgba(255,255,255,.32);' +
    'background:rgba(10,14,26,.62);color:rgba(238,242,248,.88);font:inherit;font-size:clamp(13px,1.05vw,15.5px);font-weight:600;' +
    'cursor:pointer;opacity:0;transform:translateY(14px);transition:background .25s ease,border-color .25s ease,scale .25s ease;}' +
  '#jjms .fquiz strong{color:#FFC93D;font-weight:800;}' +
  '#jjms .finale.go .fquiz{animation:jjmsDp .7s cubic-bezier(.34,1.56,.64,1) 3.35s both;}' +
  '#jjms .fquiz:hover{background:rgba(255,0,245,.22);border-color:rgba(255,0,245,.6);scale:1.05;}' +
  '#jjms-quiz{position:fixed;inset:0;z-index:412;display:flex;align-items:center;justify-content:center;' +
    'background:radial-gradient(ellipse at 50% 46%,rgba(10,10,22,.72) 0%,rgba(4,6,12,.9) 75%);' +
    'opacity:0;pointer-events:none;transition:opacity .35s ease;}' +
  '#jjms-quiz.on{opacity:1;pointer-events:auto;}' +
  /* the card springs in from the right; .out throws it away left before the next one lands */
  '#jjms-quiz .qcard{width:min(92vw,640px);text-align:center;' +
    'animation:jjqIn .5s cubic-bezier(.34,1.56,.64,1) both;}' +
  '#jjms-quiz .qcard.out{animation:jjqOut .24s ease-in both;}' +
  '@keyframes jjqIn{from{opacity:0;transform:translateX(70px) rotate(1.5deg) scale(.94);}' +
    'to{opacity:1;transform:translateX(0) rotate(0) scale(1);}}' +
  '@keyframes jjqOut{from{opacity:1;transform:translateX(0);}to{opacity:0;transform:translateX(-70px) rotate(-1.5deg) scale(.95);}}' +
  /* the inner sheet carries the cursor tilt so it never fights the entrance animation */
  '#jjms-quiz .qtin{will-change:transform;transition:transform .18s ease-out;}' +
  '#jjms-quiz .qkick{margin:0 0 12px;font-size:13px;font-weight:800;letter-spacing:.22em;color:#FFC93D;text-transform:uppercase;}' +
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
  'html.jjms-lb #jj-sound-btn,html.jjms-lb #jj-sound-mist{opacity:0 !important;pointer-events:none !important;' +
    'transition:opacity .35s ease;}' +
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
  'html.jjms-lb #jjms-hd,html.jjms-lb #jjms-next,html.jjms-lb #jjms-nav,html.jjms-lb #jjms-tl{' +
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
  '#jjms-hd .t{font-size:clamp(26px,2.6vw,40px);font-weight:800;margin:0;}' +
  '#jjms-hd .a{font-size:clamp(14px,1.3vw,20px);opacity:.75;margin:2px 0 10px;font-weight:700;}' +
  '#jjms-hd .ic{display:flex;gap:20px;align-items:flex-end;}' +
  '#jjms-hd .ic .pw{display:inline-flex;animation:jjmsPop .5s cubic-bezier(.34,1.56,.64,1) both;}' +
  '@keyframes jjmsPop{from{opacity:0;transform:scale(.5) translateY(8px);}to{opacity:1;transform:scale(1) translateY(0);}}' +
  /* all sprites the SAME height — opacity is the only dimming; the active one is alive */
  '#jjms-hd .ic img{height:58px;width:auto;opacity:.35;transition:opacity .45s ease;' +
    'filter:drop-shadow(0 3px 8px rgba(0,0,0,.5));transform-origin:bottom center;}' +
  '#jjms-hd .ic img.act{opacity:1;animation:jjmsIdle 1.6s ease-in-out infinite;}' +
  '@keyframes jjmsIdle{0%,100%{transform:translateY(0) scaleY(1);}50%{transform:translateY(-4px) scaleY(1.05);}}' +
  /* next button */
  '#jjms-next{position:fixed;left:50%;bottom:64px;transform:translateX(-50%);z-index:940;background:rgba(10,14,26,.78);' +
    'border:1px solid rgba(255,255,255,.16);border-radius:10px;color:#fff;font:inherit;font-size:13px;letter-spacing:.14em;' +
    'padding:12px 20px;cursor:pointer;display:flex;gap:10px;align-items:center;opacity:0;pointer-events:none;transition:opacity .5s ease,border-color .2s;}' +
  '#jjms-next.on{opacity:1;pointer-events:auto;}#jjms-next:hover{border-color:#FF00F5;}' +
  '#jjms-next .ar{display:inline-block;animation:jjmsA 1.6s ease-in-out infinite;}' +
  '@keyframes jjmsA{0%,100%{transform:translateY(-2px);}50%{transform:translateY(3px);}}' +
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
      '55%{translate:0 0;rotate:0deg;}100%{translate:var(--sx,0) var(--sy,0);rotate:var(--sr,0deg);}}';

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
    var words = text.split(' '), total = 0, k = 0, html = '';
    for (var w0 = 0; w0 < words.length; w0++) total += words[w0].length;
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
      if (w > 0) html += ' ';
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

  function init() {
    /* this page always opens on the story's first frame, so don't let the browser restore a
       previous scroll position over the top of the landing */
    try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
    var st = document.createElement('style'); st.id = 'jjms-style'; st.textContent = CSS; document.head.appendChild(st);
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
      var ph = '', pl = PHOTOS[i] || [];
      /* FILMS (step 5): move any poster sitting under the centred caption to the NEAREST free spot that
         clears the text AND doesn't overlap another poster (see layoutFilms). Other steps keep design pos. */
      var adj = (i === 5) ? layoutFilms(pl) : null;
      for (var p0 = 0; p0 < pl.length; p0++) {
        var P = pl[p0];
        var px = adj ? adj[p0].x : P.x, py = adj ? adj[p0].y : P.y;
        ph += '<span class="phw' + (P.deco ? ' deco' : '') + (P.logo ? ' logo' : '') +
          (P.tap ? '" data-tap="1' : '') + (P.vid || P.yt ? ' phvid' : '') + (P.cap ? ' hascap' : '') + (P.secret ? ' secret' : '') + '"' +
          (P.cap ? ' data-cap="' + esc(P.cap) + '"' : '') + (P.rating ? ' data-rating="' + esc(P.rating) + '"' : '') +
          (typeof P.vid === 'string' ? ' data-vid="' + esc(P.vid) + '"' : '') +
          (typeof P.yt === 'string' ? ' data-yt="' + esc(P.yt) + '"' : '') +
          (P.note ? ' data-note="' + esc(P.note) + '"' : '') + (P.party ? ' data-party="1"' : '') +
          (P.alt ? ' data-alt="' + esc(P.alt) + '"' : '') +
          ' style="left:' + px + '%;top:' + py + '%;width:' + P.w + 'vw;--pw:' + P.w + 'vw;' +
          'rotate:' + P.rot + 'deg;--d:' + (P.d || (0.12 + p0 % 4 * 0.07).toFixed(2)) + '">' +
          '<span class="phs"><span class="phd" style="--dx:' + (11 + p0 % 3 * 6) + 'px;--dy:' + (14 + p0 % 4 * 5) + 'px;' +
          '--dr:' + (0.9 + p0 % 3 * 0.45).toFixed(2) + 'deg;' +
          'animation-duration:' + (10.5 + p0 * 1.6).toFixed(1) + 's;animation-delay:-' + (p0 * 2.6).toFixed(1) + 's">' +
          '<img src="' + SB + P.src + '" alt="" decoding="async">' +
          (P.logo ? '<img class="lgtint" src="' + SB + 'skyrock-blue.png" alt="" decoding="async">' : '') +
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
        var SR_ICON = {
          heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.6-9.2-8.6C1 8 2.6 4.6 6 4.6c2.2 0 3.4 1.2 6 3.8 2.6-2.6 3.8-3.8 6-3.8 3.4 0 5 3.4 3.2 6.8C19 15.4 12 20 12 20z"/></svg>',
          chat: '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/></svg>',
          send: '<svg viewBox="0 0 24 24"><path d="M3 11l18-7-7 18-2.5-7.5z"/></svg>',
          search: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>'
        };
        var SR_CARDS = [
          '<span class="srcard" style="background:linear-gradient(168deg,#26d7e8,#1273d8 62%,#0b3f8f)">' +
            '<svg viewBox="0 0 90 160" preserveAspectRatio="none"><circle cx="64" cy="38" r="13" fill="rgba(255,255,255,.85)"/>' +
            '<path d="M0 120c14-7 26-7 42 0s30 7 48 0v40H0z" fill="rgba(255,255,255,.28)"/>' +
            '<path d="M0 132c16-7 30-7 46 0s28 6 44 0v28H0z" fill="rgba(255,255,255,.4)"/></svg></span>',
          '<span class="srcard" style="background:linear-gradient(168deg,#ffb347,#ff5e7d 58%,#8f2d8f)">' +
            '<svg viewBox="0 0 90 160" preserveAspectRatio="none"><circle cx="30" cy="52" r="11" fill="rgba(255,244,214,.9)"/>' +
            '<path d="M0 128 26 84l20 30 14-20 30 34v32H0z" fill="rgba(60,10,60,.55)"/></svg></span>',
          '<span class="srcard" style="background:linear-gradient(168deg,#8ee08b,#1f8f5f 60%,#0c4634)">' +
            '<svg viewBox="0 0 90 160" preserveAspectRatio="none">' +
            '<path d="M18 128 30 84l12 44zM44 132 58 76l14 56z" fill="rgba(8,50,32,.6)"/>' +
            '<path d="M0 138c22-8 46-8 90 0v22H0z" fill="rgba(8,50,32,.45)"/></svg></span>',
          '<span class="srcard" style="background:linear-gradient(168deg,#3b2d7a,#141a4d 60%,#080d26)">' +
            '<svg viewBox="0 0 90 160" preserveAspectRatio="none"><path d="M60 30a17 17 0 1 0 8 30 14 14 0 1 1-8-30z" fill="rgba(255,244,200,.85)"/>' +
            '<circle cx="22" cy="34" r="1.7" fill="#fff"/><circle cx="36" cy="58" r="1.3" fill="#fff"/>' +
            '<circle cx="70" cy="76" r="1.5" fill="#fff"/><circle cx="16" cy="86" r="1.2" fill="#fff"/></svg></span>'
        ];
        ph += '<span class="srphone" style="left:' + s.srp.x + '%;top:' + s.srp.y + '%;width:' + s.srp.w + 'vw">' +
          '<span class="srclip">' +
          '<span class="srtrack">' + SR_CARDS.join('') + SR_CARDS[0] + '</span>' +
          '<span class="srbar"><i></i></span>' +
          '<span class="srrail"><span class="sric">' + SR_ICON.heart + '</span>' +
            '<span class="sric">' + SR_ICON.chat + '</span><span class="sric">' + SR_ICON.send + '</span></span>' +
          '<span class="srsearch">' + SR_ICON.search + '</span>' +
          '<span class="srnotch"></span></span></span>';
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
        ph += '<button type="button" class="aglogo" data-fx="' + esc(G.fx) + '" aria-label="' + esc(G.t) + '"' +
          ' style="left:' + G.x + '%;top:' + G.y + '%;width:' + G.w + 'vw;rotate:' + G.r + 'deg;' +
          '--ld:' + (8 + (lq % 5) * 1.3).toFixed(1) + 's;--ldl:-' + (lq * 1.4).toFixed(1) + 's;' +
          '--lx:' + (7 + (lq % 3) * 4) + 'px;--ly:-' + (11 + (lq % 4) * 4) + 'px">' +
          '<span class="agin"><img src="' + SB + esc(G.src) + '" alt="" decoding="async">' +
          (G.shine ? '<i class="agshine" style="--m:url(' + SB + esc(G.src) + ')"></i>' : '') +
          '</span></button>';
      }
      /* scattered label chips (skills etc.) — one per entry, each drifting on its own timing */
      var tg = TAGS[i] || [];
      for (var tq = 0; tq < tg.length; tq++)
        ph += '<span class="stag' + (tg[tq].sm ? ' sm' : '') + '"' + (tg[tq].fx ? ' data-fx="' + tg[tq].fx + '"' : '') +
          (tg[tq].txt ? ' data-txt="' + esc(tg[tq].txt) + '"' : '') +
          ' style="left:' + tg[tq].x + '%;top:' + tg[tq].y + '%;rotate:' + (tg[tq].r || 0) + 'deg">' +
          '<span class="sin" style="--td:' + (6.2 + (tq % 4) * 1.4).toFixed(1) + 's;--tdl:-' + (tq * 0.9).toFixed(1) +
          's;--tx:' + (3 + (tq % 3) * 2) + 'px;--ty:-' + (5 + (tq % 4) * 2) + 'px">' +
          tg[tq].i + ' ' + esc(tg[tq].t) + '</span></span>';
      /* clusters on this step: a lead photo with the rest of the set stacked behind it (+ countries) */
      for (var tv = 0; tv < CLUSTERS.length; tv++) {
        if (CLUSTERS[tv].step === i) {
          var T = CLUSTERS[tv], nT = T.files.length;
          var peeks = '';
          for (var pk = 0; pk < Math.min(2, nT - 1); pk++)                  /* hint at what's behind */
            peeks += '<span class="tstack" style="transform:rotate(' + (pk ? -4 : 3.5) + 'deg) translate(' +
              (pk ? -7 : 7) + 'px,' + (pk ? -4 : -5) + 'px)"></span>';
          ph += '<span class="trav" data-trav="' + T.key + '" style="left:' + T.x + '%;top:' + T.y + '%;width:' + T.w + 'vw;' +
            'rotate:' + T.rot + 'deg">' + peeks +
            '<img class="tlead" src="' + SB + T.files[0] + '" alt="" decoding="async">' +
            (nT > 1 ? '<span class="tmore">+' + (nT - 1) + ' more</span>' : '') + '</span>';
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
            ph += '<span class="tcc" style="left:calc(' + ccLeft + ');top:calc(' + ccTop +
              ');width:' + T.ccw + 'vw;justify-content:flex-start">' + chips + '</span>';
          }
        }
      }
      /* step 0 keeps its light-strike caption; every other caption disperses letter by letter */
      /* the cinema step reads as one settled line: no per-letter scatter to fight through */
      var cap = i === 0 ? heroCap(s.cap) : (s.tall ? esc(s.cap) : disperseCap(s.cap, s.hot));
      var extra = i === 0 ? '<div class="flare"></div><div class="gring"></div>' : '';
      /* content steps (not the opening flare step) let their collage spill past the step edge, so posters
         near the bottom are never clipped — they carry on into the next section */
      var stepCls = 'step' + (i > 0 && (pl.length || ph) ? ' col' : '');
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
      var grow = s.grow ? '<div class="gdim"></div>' + glogos +
        '<span class="gvid" data-vid="' + esc(s.grow.src) + '" data-cap="' + esc(s.grow.cap || '') + '">' +
        '<i class="gglow"></i>' +
        '<span class="gshell"><video muted loop playsinline preload="metadata" poster="' + SB + esc(s.grow.poster) +
        '" src="' + SB + esc(s.grow.src) + '"></video>' +
        '<span class="ghint"><span class="gs-off">\ud83d\udd07 Sound off</span>' +
        '<span class="gs-on">\ud83d\udd0a Sound on</span></span></span></span>' : '';
      html += '<div class="' + stepCls + (s.tall ? ' tall' : '') + '" id="jjms-step-' + i + '" data-era="' + s.era + '"' +
        (s.tall ? ' style="height:' + (s.tall * 100) + 'vh"' : '') + '>' +
        (s.tall ? '<div class="stage">' : '') + extra + ph + grow +
        '<p class="cap' + (i === 0 ? ' hero' : '') + '">' + cap + '</p>' +
        (s.sub ? '<p class="sub">' + (s.tall ? esc(s.sub) : disperseCap(s.sub, null, s.funk)) + '</p>' : '') +
        (s.tall ? '</div>' : '') + '</div>';   /* sub disperses + floats like the caption */
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
      '<p class="fcap">' + FINALE_CAP + '</p><div class="dests">' + dests + '</div>' +
      '<button type="button" class="fquiz" id="jjms-fquiz">Think you paid attention?&ensp;' +
      '<strong>Take the History Exam</strong></button></div>';
    wrap.innerHTML = html; mount.appendChild(wrap);
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
        window.addEventListener('wheel', stopScroll, { passive: false });
        window.addEventListener('touchmove', stopScroll, { passive: false });
        window.addEventListener('keydown', stopKeys, { passive: false });
        window.addEventListener('scroll', repin, { passive: true });
      } else {
        if (L && L.start) { try { L.start(); } catch (e) {} }
        window.removeEventListener('wheel', stopScroll, { passive: false });
        window.removeEventListener('touchmove', stopScroll, { passive: false });
        window.removeEventListener('keydown', stopKeys, { passive: false });
        window.removeEventListener('scroll', repin);
      }
    }
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
      setTimeout(function () { holdScroll(false); }, 620 + 4200);       /* the sequence runs ~4.2s */
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
    function flyStartWander() {                                  /* (re)start the wander from the beginning */
      fly.style.transition = 'none'; fly.style.transform = ''; fly.style.opacity = '';
      fly.style.animation = 'none'; void fly.offsetWidth; fly.style.animation = '';
      fly.style.transition = 'opacity .6s ease';
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
      if (first) flyEnter(); else flyOff(flyEnter);              /* new era: old flies off, then new flies in */
      fly.classList.add('show');
    }
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
    var nx = document.createElement('button'); nx.id = 'jjms-next'; nx.innerHTML = 'NEXT <span class="ar">↓</span>'; document.body.appendChild(nx);
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
    stepYear[0] = Y0;                                            /* 1995 exactly, at the landing */
    stepYear[STEPS.length - 1] = Y1;                             /* 2026, and it holds there */

    nav.addEventListener('click', function (ev) {
      var a = ev.target.closest('a'); if (!a) return; ev.preventDefault();
      steps[firstStepOfEra[+a.getAttribute('data-era')]].scrollIntoView({ behavior: 'smooth' });
    });
    nx.addEventListener('click', function () {
      var idx = curStep();
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
    document.addEventListener('pointermove', function (e) { pmX = e.clientX; pmY = e.clientY; hitTest(); }, { passive: true });
    document.addEventListener('pointerleave', function () { setHot(null); });
    window.addEventListener('scroll', hitTest, { passive: true }); /* the photo under a still cursor changes as it moves */

    /* ---- click a film → the era sprite zooms off and the poster BLOWS UP (grows to the centre) ---- */
    var blownEl = null;
    /* the lightbox chrome: a dimming scrim, a title+rating panel, and a close button */
    var scrim = document.createElement('div'); scrim.id = 'jjms-scrim'; wrap.appendChild(scrim);
    var detail = document.createElement('div'); detail.id = 'jjms-detail';
    detail.innerHTML = '<p class="jjd-found">★ you found my favourite ★</p><p class="jjd-title"></p><p class="jjd-note"></p><span class="jjd-rate"><span class="jjd-star">★</span>' +
      '<b class="jjd-score"></b><span class="jjd-out">/10</span><span class="jjd-src">IMDb</span></span>';
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
    player.innerHTML = '<video playsinline controls preload="none"></video><div class="jjp-yt"></div><p class="jjp-title"></p>';
    wrap.appendChild(player);
    var vidEl = player.querySelector('video'), ytBox = player.querySelector('.jjp-yt'),
        pTitle = player.querySelector('.jjp-title');
    var playing = false;
    function openVideo(phw) {
      var src = phw.getAttribute('data-vid'), yt = phw.getAttribute('data-yt');
      if (!src && !yt) return;
      player.classList.toggle('yt', !!yt);
      lightboxOpen = true;
      var loop = phw.querySelector('video');                         /* the silent preview stands down */
      if (loop) { try { loop.pause(); } catch (e0) {} }
      if (yt) {                                                      /* the school films live on YouTube — nothing to host */
        ytBox.innerHTML = '<iframe src="https://www.youtube.com/embed/' + encodeURIComponent(yt) +
          '?autoplay=1&rel=0&modestbranding=1&playsinline=1&origin=' + encodeURIComponent(location.origin) +
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
      player.classList.remove('on'); scrim.classList.remove('on'); closeBtn.classList.remove('on'); lightbox(false);
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
      var dy = window.innerHeight * 0.42 - (r.top + r.height / 2);   /* room for the title + rating below */
      var k = Math.min(6, (window.innerHeight * 0.56) / r.height);   /* grow until ~56vh tall */
      phw._rotPrev = phw.style.rotate;                               /* the design tilt, restored on reset */
      phw.style.transformOrigin = 'center center'; phw.style.rotate = '0deg';
      phw.style.setProperty('--blowk', k.toFixed(3));
      phw.style.transform = 'translate(' + dx.toFixed(0) + 'px,' + dy.toFixed(0) + 'px) scale(' + k.toFixed(2) + ')';
      phw.classList.add('blown'); blownEl = phw;
      var ttl = phw.getAttribute('data-cap') || '';                  /* the label becomes the headline */
      dTitle.textContent = ttl; dTitle.style.display = ttl ? '' : 'none';
      /* only the films carry a rating — a game box or a snapshot shouldn't sprout an IMDb score */
      var isFilm = /film-/.test((phw.querySelector('img') || {}).getAttribute ? phw.querySelector('img').getAttribute('src') : '');
      dRate.style.display = isFilm ? '' : 'none';
      dScore.textContent = phw.getAttribute('data-rating') || '8.80';/* PLACEHOLDER rating until the real per-film ones land */
      var note = phw.getAttribute('data-note') || '';                 /* optional line under the title */
      dNote.textContent = note; dNote.style.display = note ? '' : 'none';
      var isParty = phw.getAttribute('data-party');
      detail.classList.toggle('party', !!isParty);
      scrim.classList.add('on'); detail.classList.add('on'); closeBtn.classList.add('on'); lightbox(true);
      if (isParty) party(phw);
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
    function closeAny() { resetBlow(); closeVideo(); closeColl(); closeShot(); closeQuiz(); }
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
    window.addEventListener('resize', aimTrophy);
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
    Array.prototype.forEach.call(wrap.querySelectorAll('.srphone'), function (sp) {
      var clip = sp.querySelector('.srclip');
      sp.addEventListener('click', function (e) {
        e.stopPropagation();
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
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAny(); });
    document.addEventListener('click', function (e) {
      if (e.target.closest('#jjms-nav,#jjms-next,.cap,#jj-sound-btn,#jj-sound-mist')) return;   /* chrome, headline and the sound moon stay out of it */
      var ph = photoUnder(e.clientX, e.clientY);
      var wasBlown = blownEl, wasPlaying = playing, wasColl = collOpen;
      closeAny();                                                    /* any click first puts the current one back */
      if (!ph || ph === wasBlown) return;
      if (ph.getAttribute('data-trav')) {                            /* a travel collection fans out */
        if (!wasColl) openColl(ph);
      } else if (ph.getAttribute('data-vid') || ph.getAttribute('data-yt')) {   /* a video card opens the player */
        if (!wasPlaying) { openVideo(ph); flyOff(flyEnter); }
      } else {                                                       /* every other picture blows up too */
        blowUp(ph);
        flyOff(flyEnter);                                            /* the sprite zooms off, then flies back */
      }
    });

    /* click the opening line and creation happens all over again */
    var litEl = wrap.querySelector('.cap.hero .lit');
    if (litEl) litEl.addEventListener('click', function () {
      steps[0].classList.remove('gen');
      void steps[0].offsetWidth;                                  /* restart the animations */
      genesis();
    });

    function curStep() {
      var mid = window.innerHeight * 0.5;
      for (var i = 0; i < steps.length; i++) { var r = steps[i].getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) return i; }
      return steps[0].getBoundingClientRect().top > mid ? -1 : steps.length - 1;
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
        if (cap && !cap.classList.contains('hero')) floatEl(cap, cen, ramp, dead, t);
        floatEl(steps[i].querySelector('.sub'), cen, ramp, dead, t);   /* subtitle floats + disperses like the caption */
      }
      blobUpdate();                                                 /* fluid pink blob on whichever headline is hovered */
    }
    function startFloat() { if (!floatRaf) { fInStory = true; floatRaf = requestAnimationFrame(floatTick); } }
    function stopFloat() { fInStory = false; }                     /* the loop self-cancels on its next tick */

    /* wire the headline blob: track the cursor, and enter/leave per non-hero caption */
    document.addEventListener('pointermove', function (e) { bmx = e.clientX; bmy = e.clientY; }, { passive: true });
    var blobCaps = wrap.querySelectorAll('.cap:not(.hero)');
    for (var bc = 0; bc < blobCaps.length; bc++) (function (c) {
      c.addEventListener('pointerenter', function () { blobEnter(c); });
      c.addEventListener('pointerleave', function () { blobLeave(c); });
    })(blobCaps[bc]);

    function render() {
      raf = null;
      /* the swirl SVG parallaxes UP at ~0.4× the scroll — so it drifts behind the story at its own,
         slower pace (never locked to the timeline). Soft/blurry, so a per-frame translate can't jitter. */
      bgImg.style.translate = '0 ' + (-window.scrollY * 0.4).toFixed(1) + 'px';
      if (SKY_PARALLAX) {                                        /* each size-binned layer drifts at its own speed (bigger = slower) */
        for (var sl = 0; sl < slayers.length; sl++) {
          var f = +slayers[sl].getAttribute('data-f');
          slayers[sl].style.translate = '0 ' + ((1 - f) * window.scrollY).toFixed(0) + 'px';
        }
      }
      /* the inline player shrinks to a fixed mini bar once its slot scrolls up past the top; the slot's
         own box stays in the flow, so reading its rect can never fight the class we set on it */
      var fr = finale.getBoundingClientRect();                   /* the Big Bang fires as the finale arrives */
      if (!banged && fr.top < window.innerHeight * 0.55) {
        banged = true;
        /* glide to edge-to-edge FIRST — the show only starts once the screen is filled, so the
           bang can never play cut off mid-glide (which is what was happening on the live site) */
        snapToFinale._onPinned = function () {
          finale.classList.add('go');
          if (!teasePlayed) {                        /* first bang only: darkness asks, then the exam */
            teasePlayed = true;
            if (calmQ) setTimeout(function () { openQuiz(); }, 2400);
            else setTimeout(runTease, 2300);
          }
          setTimeout(function () { bg.classList.add('boom'); }, 1000);    /* the sky surges at detonation */
          setTimeout(function () { bg.classList.remove('boom'); }, 2400);
        };
        snapToFinale();                                                  /* fill the screen + hold it there for the show */
      }
      else if (banged && fr.top > window.innerHeight * 1.2) { banged = false; finale.classList.remove('go'); bg.classList.remove('boom'); }   /* re-arm on the way back up */
      var idx = curStep(), inStory = idx >= 0 && steps[0].getBoundingClientRect().top < window.innerHeight * 0.85;
      var last = steps[steps.length - 1].getBoundingClientRect();
      inStory = inStory && last.bottom > window.innerHeight * 0.35;
      tl.classList.toggle('on', inStory); hd.classList.toggle('on', inStory);
      nav.classList.toggle('on', inStory);
      nx.classList.toggle('on', inStory && idx < steps.length - 1);
      if (inStory) document.documentElement.classList.add('jjms-live');   /* the site nav comes back with the story */
      if (inStory && idx >= 0) flyShow(STEPS[idx].era); else fly.classList.remove('show');   /* the era mascot */
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
        var gv = ts.querySelector('.gvid video');
        if (gv) {                                                /* it starts playing once it's big */
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
      /* only the step on screen + its neighbours carry live per-letter animations (see the .near CSS) */
      if (idx !== lastNear) {
        lastNear = idx;
        for (var nr = 0; nr < steps.length; nr++) steps[nr].classList.toggle('near', Math.abs(nr - idx) <= 1);
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
        var op = (1 - fade).toFixed(3), sc = (1 - 0.45 * fade).toFixed(3);
        for (var pj = 0; pj < ph.length; pj++) {
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
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
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
    function genesis() {
      if (steps[0].classList.contains('gen')) return;
      steps[0].classList.add('gen'); steps[0].classList.add('live');
      bg.classList.add('genesis');
      setTimeout(function () { bg.classList.remove('genesis'); }, 2600);
    }
    function land() {
      collapseAbove(); landed = true; jump(0); render();
      if (!document.getElementById('jjst')) { setTimeout(genesis, 420); return; }
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
      window.addEventListener(ev, function onG() {
        window.removeEventListener(ev, onG);
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
    var QUIZ_POOL = [
      { q: 'What did I go to Brighton to study?',
        o: ['BSc Digital Media', 'BSc Computer Science', 'BA Illustration', 'BSc Marine Biology'] },
      { q: 'I was awarded a scholarship to work for a year in…',
        o: ['Taipei, Taiwan', 'Tokyo, Japan', 'Seoul, South Korea', 'Bangkok, Thailand'] },
      { q: 'My final year project was on…',
        o: ['The Gamification and Future of e-Learning', 'The Future of Digital Storytelling',
            'Vikings vs Anglo-Saxons: A History App', 'Colour Theory in Modern Apps'] },
      { q: 'I made it to Mexico for which celebration?',
        o: ['Días de los Muertos', 'Cinco de Mayo', 'La Tomatina', 'Carnaval'] },
      { q: 'Who guides you through the GeoQuest app?',
        o: ['George', 'Greybeard the Grey', 'A wise philosopher', 'A knight called Joe'] },
      { q: 'What did the Final Year Project score?',
        o: ['95/100', '82/100', '70/100', '68/100'] },
      { q: 'How many titles have I rated on iMDB?',
        o: ['Over 1700', 'About 300', 'Around 900', 'Over 5000'] },
      { q: 'My two BIMA silver awards were for…',
        o: ['Best Digital Transformation', 'Best App Design', 'Best Digital Campaign', 'Best New Agency'] },
      { q: 'Apparently, at age 7 I was already…',
        o: ['Leading raids', 'Building websites', 'Making short films', 'Winning awards'] },
      { q: 'Which studio was NOT floating around my first animation?',
        o: ['Aardman', 'Disney', 'Pixar', 'Studio Ghibli'] },
      { q: 'Greybeard the Grey’s name brings fear into the hearts of…',
        o: ['The Anglo-Saxons', 'The Romans', 'The Normans', 'The Danes'] },
      { q: 'Which film did I watch very young that “still holds up”?',
        o: ['Seven Samurai', 'The Prestige', 'Interstellar', 'Spirited Away'] }
    ];
    var QUIZ_N = 6;
    var QUIZ_RANKS = [                                   /* [min score, rank, line] */
      [6, 'Court Historian', 'Flawless. You clearly gazed at every star.'],
      [4, 'Loyal Squire', 'Sharp eyes — just a couple of scrolls short of legend.'],
      [2, 'Time Tourist', 'You caught the highlights… the details, less so.'],
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
        '<p class="qsub">' + QUIZ_N + ' questions, drawn from the whole story — a different paper every sitting.<br>' +
        'Answer well and you evolve. Answer badly and, well…</p>' +
        '<img class="qsprbig" src="' + SPRITES[0] + '" alt="">' +
        '<button type="button" class="qgo">Begin</button>', function () {
        quiz.querySelector('.qgo').addEventListener('click', function (e) { e.stopPropagation(); quizStart(); });
      });
    }
    function quizStart() {
      qSet = shuffled(QUIZ_POOL).slice(0, QUIZ_N); qIdx = 0; qScore = 0; qConfettiDone = false;
      quizQuestion();
    }
    function quizQuestion() {
      var Q = qSet[qIdx];
      /* o[0] is always the truth — shuffle a copy and remember where it landed */
      var opts = shuffled(Q.o);
      quiz.classList.remove('locked');
      qSwap('<p class="qkick">Question ' + (qIdx + 1) + ' of ' + QUIZ_N + '</p>' +
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
        quiz.querySelector('.qagain').addEventListener('click', function (e) {
          e.stopPropagation(); unduckMusic(); quizResults();
        });
      });
    }
    function quizResults() {
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
    }
    quiz.addEventListener('click', function (e) { e.stopPropagation(); });   /* clicks stay in the exam hall */
    var fquiz = document.getElementById('jjms-fquiz');
    if (fquiz) fquiz.addEventListener('click', function (e) { e.stopPropagation(); openQuiz(); });

    /* cursor.js (site-wide) expands its bubble over <a>/<button>/[data-cursor] — most of the
       timeline's clickables are divs, so they each get the attribute */
    Array.prototype.forEach.call(wrap.querySelectorAll(
      '.phw:not(.deco),.trav,.jjphone,.srphone,.phw.deco[data-tap],.phw.deco[data-alt],.sub .funk,.cap .hotword,.jjtrophy'
    ), function (el) { if (!el.hasAttribute('data-cursor')) el.setAttribute('data-cursor', 'hover'); });

    window.jjMyStory = { land: land, genesis: genesis, stepTop: stepTop };

    var intro = document.getElementById('jjst');
    if (intro) {
      /* storytime unlocks the page and starts fading its overlay in the same breath — land while
         that black still covers everything, so the story is already composed when it lifts */
      var watch = setInterval(function () {
        var el = document.getElementById('jjst');
        if (el && parseFloat(getComputedStyle(el).opacity) > 0.99) return;
        clearInterval(watch); land();
      }, 100);
    }
    window.addEventListener('resize', function () {                /* keep the view still if the gap above resizes */
      if (!landed) return;
      var before = lift; collapseAbove();
      if (lift !== before) jump(Math.max(0, window.scrollY - (lift - before)));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
