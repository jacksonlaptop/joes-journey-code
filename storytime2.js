/* storytime2.js — STORYTIME 2 (the sequel: "The tale continues through the portal"). Build st2-26q (st2-26q: the 'previously' book plays under Part One's book music, and the wasteland track fades in as the book ends; the oasis music is out through the lava fields, comes back with Joe's first step toward Ember, plays on, and is loudest at the mount · st2-26p: performance: the embers, snow, foam, drops, ripples and flecks are drawn on a canvas a layer by the engine (PFX); a flyer that has puffed away is not decoded; the credits tell My Story it may start fetching · st2-25: bugs from the back audit; the book's music; copy and pacing; the oasis music's slow arc; real dragon growl and roar · st2-24: the storybook's tighter working text (a trial) · st2-23: the storybook's painted art; Joe points at the oasis in 2.4 · st2-22: the 'previously' storybook's six lines (behind ?book=1) · st2-21: the 'previously' storybook behind ?book=1; lead prompts 500 ms after the line, quicker narration holds, the black dragon's pass 9.4 s · st2-20: pacing by reading time, a bubble placed once for the settled framing, 3.1 pressable while it pans, the real music in sections; scenes 1 to 3 with their real art: painted lands under code-built skies, the three habitats, the dragons; the rest still placeholder art).
   Loaded only by storytime.js when the page is opened with ?st2=1 — Part One never downloads it. It registers itself with the
   engine (window.jjStory.register) and reuses the engine's banner, layers, transport, pause, Prev / Next, sound and the speech bubble's look.

   WHERE THINGS LIVE
   1. THE SCREENPLAY  — every line of narration / speech, in order (mirrors experiments/storytime-2/script.js). Edit copy here.
                        say(who, text, paren, { auto: true }) = a bubble with no Next that moves on by itself; { split, act } = a two-part
                        bubble with a one-shot clip between its sentences (Clive's sigh). Only a bubble that waits for Next dims the banner.
   2. THE CAST        — who can speak, their display name and the layer key a bubble points at.
   3. THE SHOTS       — one entry per layer per shot. Scenes 1, 2, 3 (and 5B's wasteland) stand on their painted lands under code-built
                        skies: SKIES (gradient, swirls, clouds), SETS (one land per scene + its other art layers), B(...) layers placed on
                        the board, a cam per shot (the framing; seq = a montage of pans), ints (the presses: need = required, the trigger
                        for what comes next), steps (a change of pose part-way through a shot's lines). The rest are still placeholder
                        boxes on the screen: L(...). CLIPS lists the keyed clips that are in; ACTS the one-shots played over them.
                        To swap a placeholder for real art: drop the file(s) in github-upload and set src (a still) or vid (a clip).
   4. THE UI          — the board layout + camera rigs, the skies and the effects that ride the land, the air (ash, embers, pollen),
                        speech bubbles, choice cards, prompt pills, press interactions, cuts, the credits roll (all code).
   experiments/storytime-2/ASSETS.md is generated from (1) and (3) by experiments/storytime-2/make-assets.js. */
(function () {
  'use strict';
  var NAR = 145, BUB = 80;

  /* ====================================================================================================================
     1. THE SCREENPLAY
     ==================================================================================================================== */
  var S = [];
  var scene = function (n, head, notes) { S.push({ t: 'scene', n: n, head: head, notes: notes }); };
  var shot = function (id, frame, desc) { S.push({ t: 'shot', id: id, frame: frame, desc: desc }); };
  var act = function (text, o) { S.push({ t: 'act', text: text, o: o || {} }); };   // o.hold: a beat with no words (ms) · o.comp / o.joe / o.fx as for a line
  var nar = function (text, o) { S.push({ t: 'nar', text: text, o: o || {} }); };
  var say = function (who, text, paren, o) { var it = { t: 'say', who: who, text: text, paren: paren }, k; o = o || {}; for (k in o) it[k] = o[k]; it.o = o; S.push(it); };   // o.auto: the bubble has no Next and moves on by itself after a read · o.split: a two-part bubble (the text from that marker on types later, after o.act) · o.act: a one-shot clip played with the line
  /* st2-14 · a line's STATE (o.st): 1 = talking, timed, moves on by itself · 2 = talking before a change of speaker or shot: its line fills, then the line and Next pulse, and it
     waits for Next · 3 = a thought, timed, moves on by itself · 4 = an important thought (the end of a scene): waits like 2. o.lead: the line before an ACTION (a required
     press): no Next; the prompt comes as it finishes and the bubble stays up while the prompt waits (the press moves the story on). o.small: a small aside (a cough).
     o.joe: Joe's expression from this line on (story2-joe-<o.joe>) · o.comp: the shot's state from this line on · o.wait: ms before the bubble comes · o.min: ms the
     line takes to fill, at least */
  var int = function (text) { S.push({ t: 'int', text: text }); };
  var choice = function (text, options) { S.push({ t: 'choice', text: text, options: options }); };
  var ach = function (text, id, o) { S.push({ t: 'ach', text: text, id: id, o: o || {} }); };          // id = the jj-score achievement
  var prompt = function (text) { S.push({ t: 'prompt', text: text }); };
  var sfx = function (text, play) { S.push({ t: 'sfx', text: text, play: play || [] }); };              // play = stand-in sounds the engine already has
  var music = function (text) { S.push({ t: 'music', text: text }); };
  var cut = function (text) { S.push({ t: 'cut', text: text }); };
  var note = function (text) { S.push({ t: 'note', text: text }); };

  /* ---------------- SCENE 1 ---------------- */
  scene('1', 'EXT. THE PORTAL WASTELAND — DUSK', {
    Backdrop: 'The enchanted forest from Part One, burnt to a wasteland: black stumps, grey ash. The stone arch stands cracked and dark. Behind it, our own animated sky: dusk colours, slow dusty swirls, drifting smoke and embers.',
    Characters: 'Joe, Grik (the flying green alien)',
    Music: 'Joe’s wasteland track (story2-music-wasteland): it starts on its drum hit as the scene opens and carries on, looping, under Scene 2.',
  });
  note('BEFORE THIS SCENE, when the storybook opening plays (a prototype, behind ?book=1): a leather book on a candle-lit table opens and tells a six-line rhyme, one line and one miniature to a page, over three spreads: "Last time, a dragon set the village alight..." / "...so Joe the Righteous rode into the night." / "Through hills and woods, to an arch of stone..." / "...which swallowed him whole, with a flash and a groan." / "It whisked him away, to a land unknown..." / "...and spat him out there, all alone." (the working text, a tighter trial; before it: "Last time, a dragon came and set the village alight..." / "...so Joe the Righteous rode off into the night." / "He rode through hills and forests to find an arch of stone..." / "...which swallowed him whole, with a flash and a groan..." / "It whisked him far away, to a land unknown..." / "...and spat him out in a wasteland, all alone."). The sixth miniature is a painting of shot 1.1’s own first frame: the camera pushes into it until it fills the screen, a warm bloom rises, and under it the real shot takes its place.');
  note('For the record, Part One’s storybook (the same mechanism, in front of the cavern): "Many moons ago, in hills of green..." / "...there stood the proudest village ever seen." / "Its folk had taverns, hens and gold..." / "...and roofs of thatch, a sight to behold." / "But a beast lived in the sky, so it\'s told..." / "...in a lair in the clouds, dark and cold." (the working text, a tighter trial; before it: "Many moons ago, where the hills rolled green and wide..." / "...there sat a little village, full of chickens, and of pride." / "Its people had taverns, and pockets full of gold..." / "...and roofs of finest thatch, a wonder to behold." / "But a beast lived in the sky, or so the tale is told..." / "...in a lair above the clouds, where the nights are cold."). With the book, the cavern’s first line becomes: "High in the mountain, where no villager dared to climb, the evil beast slept, dwelling deep in the darkness..." The village’s name on the book’s map is Thatchwick.');
  shot('1.1', 'WIDE', 'Ash drifts across the dead forest. A crackle of purple light, then the portal coughs Joe out onto the path. He lands flat on his face.');
  sfx('Vortex burst, then a thud and a puff of ash.', ['sfx:flash-big', 'sfx:orb-thud@700']);
  nar('Joe landed with a thud. The enchanted forest was gone...only ash and dust remained, and the portal behind him had gone cold.');
  shot('1.2', 'MEDIUM', 'Joe gets up, dusts himself off and looks around, stunned.');
  say('JOE', 'Hello? What happened to this place?', '', { st: 1, lead: true });
  prompt('Tap the portal');
  int('Required: tap the portal. It sputters, throws one sad spark and dies again. The noise is what brings Grik.');
  shot('1.3', 'MEDIUM TWO-SHOT', 'Grik flies in from the right, buzzing, and stops nose to nose with Joe. Joe stares.');
  say('GRIK', '⟟⏁ ⋏⟒⍜⍀ ⌇⌰⟟⏚?! ⏃⋏⎅ ⍙⊑⍜ ⏃⍀⟒ ⊬⍜⎍?!', 'in alien, very fast', { st: 1, hold: 3500 });   // st2-20 (Joe): auto, his talking clip running, then the confused beat · st2-25 (Joe): it and the clip stay 1.5s longer (2s → 3.5s after typing)
  act('Joe just stares. Grik stops, tilts his head, confused. A beat with no bubble.', { hold: 1200, comp: '1.3a' });
  say('GRIK', 'Ah. You’re not from around here, are you...', '', { st: 1 });
  say('GRIK', 'Did you just come out of that portal? It hasn’t worked in centuries!', '', { st: 1 });   // st2-25 (Joe): auto
  say('JOE', 'What...what happened here? Do you know how to fix this portal?', '', { st: 2, joe: 'concerned-stance' });
  say('GRIK', 'Not gonna introduce yourself first?! Kids these days. I’m Grik.', '', { st: 1, comp: '1.3b' });
  say('GRIK', 'There was a great fire. Rumour has it a monster with wings was the cause...', '', { st: 1, joe: 'concerned-standing' });
  say('GRIK', '...but you shouldn’t believe everything you hear, buddy.', '', { st: 1 });
  say('GRIK', 'The portal...hmm. I’ve heard of a magical wizard who lives to the east...', '', { st: 1, joe: 'happier-standing' });
  say('GRIK', '...but I don’t believe in whispers.', '', { st: 2, joe: 'confused-standing' });
  shot('1.4', 'WIDE', 'Grik says his goodbye, looks round, draws his swords and flies off into the distance without waiting for an answer.');
  say('GRIK', 'Anyway, I’ve got stuff to be getting on with! See you around, buddy!', '', { st: 1 });
  say('JOE', 'Uh...I’m Joe.', '', { st: 1, joe: 'nervous-stance' });
  nar('But Grik was gone before Joe could get the words out.', { joe: 'sad-standing' });
  cut('DUST WIPE TO:');

  /* ---------------- SCENE 2 ---------------- */
  scene('2', 'EXT. THE ASH DESERT — DAY', {
    Backdrop: 'Dunes of grey ash, the charred remains of a village: roof beams, a toppled well, a signpost. Behind them, our own animated sky: hazy orange, slow barren swirls, smoke clouds. One wind blows through the whole scene, left to right: dust in layers, embers streaming, slow eddies of ash, small fires still burning in the ruins with wind-bent smoke. By the signpost and the nest (2.2, 2.3) it is a storm: the sky near-black above deep burnt orange, thick dust, a low vignette.',
    Characters: 'Joe',
    Music: 'The wasteland track carries on from Scene 1. As Joe sights the oasis (2.4) it fades out over about two and a half seconds and the oasis track’s intro comes in under it.',
  });
  shot('2.1', 'WIDE — SLOW PAN', 'Joe walks in from the left, tiny against the ruins, and trudges up to the toppled well.');
  nar('Joe walked for days through a desert of ash. Embers drifted on the wind, and burnt villages poked through the dust...');
  cut('DIP TO BLACK AND BACK (as the forest’s walk-up into the inspect shot):');
  shot('2.2', 'CLOSE', 'Joe stands left of the well, looking up at the burnt signpost to his right. The storm is at its darkest here: a near-black sky, dust blowing through the ruins, small fires still burning.');
  say('JOE', 'Could this really all have been Trogdor?', 'thought bubble', { st: 4 });   // st2-25 (Joe): it waits for Next, unless the signpost is pressed: then the sign gets its read time and the two leave by themselves
  int('Tap the signpost: a tattered old sign swings up large in the top-right gap. It reads "Welcome to ...head. Home of the ..." and the rest is burnt away. The sign stays up while Joe’s thought is up and leaves with it (the thought waits for Next; once the signpost is pressed the sign gets its time to be read, then the thought and the sign leave by themselves).');
  shot('2.3', 'CLOSE', 'Half-buried in the ash, a scorched dragon’s nest (small, not filling the frame). Two egg-shaped hollows sit in it...empty.');
  say('JOE', 'A dragon’s nest...and the eggs are gone.', 'thought bubble', { st: 3 });
  note('This is the first clue to the twist (see Scene 8).');
  shot('2.4', 'WIDE — SLOW PUSH', 'Joe drops to his knees. On the horizon, half out of frame at the right, something shimmers through the heat: a few palm tops, a thread of waterfall, a teal glow, sitting on the dunes. The camera pushes slowly toward it.');
  note('The distant oasis is a tiny, hazy, wobbling version of the real oasis art, so it reads as an oasis without showing what is in it.');
  nar('Just as his legs gave way, Joe saw it...a glowing oasis, shimmering in the distance. Was it real, or was the desert playing tricks?');
  cut('HEAT-SHIMMER DISSOLVE TO:');

  /* ---------------- SCENE 3 ---------------- */
  scene('3', 'EXT. THE DRAGON OASIS — DAY  (the turning point)', {
    Backdrop: 'A lush oasis in three parts: cliffs of ice, waterfalls and pools, and rivers of lava. A sandy ledge in the foreground. Our own sky behind: bright blue, slow magical swirls and soft clouds. Embers rise from the lava, the waterfalls splash, snow falls on the ice.',
    Characters: 'Joe, Cliniverous the Dragon Master ("Clive"), a black dragon, an earth dragon, a red dragon, a frost dragon, an ice dragon, a water dragon, Ember the fire dragon, two eggs',
    Music: 'Joe’s oasis track (story2-music-oasis), one slow arc. Its lift lands on the first frame of the reveal (3.1) at full level and the track simply plays on. As Joe draws his sword it drops to its quietest, with a low dragon growl under it until Clive shouts; one roar from the frost dragon. From there it grows slowly louder through Clive’s arrival, the ice cliffs and the pools; quieter again as we meet Ember; louder with each step Joe takes toward her, and loudest at the touch. A little under full from “Huzzah!” through the egg and the goodbye; the finale’s full entry lands on the lift-off. Nothing ducks it in these shots. Under it, the oasis ambience (birds, water), and each habitat’s own, louder than before: winter wind, a small waterfall, bubbling lava and fire.',
  });
  shot('3.1', 'OPENING — ONE SLOW PAN', 'No characters. Black bars top and bottom for the whole shot. One slow pan (about 16 seconds) across the living oasis (Joe’s animated clip), from the lava fields past the waterfalls and pools to the ice cliffs, then a short hold on the ice side and on to the ledge by itself. Little dragons play in the lava, in the pool and in the snow, and two far-off flocks cross the sky: a fire flock first, then a family of water dragons.');
  nar('It was real! Waterfalls fell between rivers of lava and cliffs of ice...and everywhere Joe looked, there were dragons.');
  prompt('Tap the eggs');
  int('Optional (while it pans): everything in the picture can be pressed as the camera moves. Any egg in the three nests takes three taps: a wobble and a crack, more cracks with light leaking out, then it breaks open in a burst of light, sparkles and a chime. Tapping a dragon in the picture gives a splash, an ember pop or a puff of snow, and floating hearts. A small hint, "Tap the eggs", shows two seconds in. Nothing has to be pressed: the shot moves on by itself. The black dragon drifts past once, about halfway.');
  ach('Nest egg: awarded for the first egg broken in the oasis.', 'st2-nest', { manual: true });
  shot('3.2', 'MEDIUM — THE LEDGE', 'The bars lift. Joe, small at the left of the ledge, panics and draws his sword by himself (no tap needed). On the right, four dragons face him: a big black one at the back, an earth dragon and a red one, and a small frost dragon at the front, who rises into an angry crouch. They tremble, lunge and puff smoke.');
  nar('Frightened, Joe drew his sword...but the dragons only grew angrier.');
  say('CLIVE', 'Put that down! You’re scaring them!', 'off screen', { st: 1, wait: 1300, comp: '3.2b' });
  act('The frost dragon roars once as Clive shouts. Joe sheathes his sword; the dragons settle and sit, calm.');
  shot('3.3', 'MEDIUM TWO-SHOT', 'Clive fades in beside Joe: purple robes, brass goggles, a baby dragon asleep on his shoulder, arms folded. The dragons sit calmly on the right.');
  say('CLIVE', 'I am Cliniverous...the Dragon Master. ...But you can call me Clive.', 'the second sentence types in the same bubble, after his long sigh', { st: 2, split: ' ...But', act: 'sigh' });
  act('Joe stares blankly between the two sentences. After the sigh, Clive goes back to arms folded and annoyed.');
  say('JOE', 'But...dragons are evil. Trogdor burned everything!', '', { st: 2, joe: 'angry-standing' });
  say('CLIVE', 'Evil? Hmph. Come with me, boy.', '', { st: 1, joe: 'confused-standing' });
  say('CLIVE', 'You’ve got some things to learn, let me show you around.', '', { st: 2 });
  shot('3.4', 'THE ICE CLIFFS', 'A new backdrop: blue-white cliffs, snow falling. An ice dragon stands on the ledge. Joe hangs back, hands clasped.');
  nar('First, the ice cliffs. Joe kept his distance...and one hand on his sword.');
  say('CLIVE', 'Ice dragons. Moody, but artists at heart. Go on, say hello.', '', { st: 1, lead: true });
  int('Required: tap the ice dragon (the prompt appears as Clive says "Go on, say hello"). She breathes a stream of frost and carves an ice statue of Joe, as tall as he is, right beside him. Tap again for more: a tiny Grik, a snowflake crown.');
  say('JOE', 'Is that...me? I mean I think I’ve got better hair than that but...', '', { st: 2, joe: 'happier-stance' });
  shot('3.5', 'THE POOLS', 'A new backdrop: waterfalls and turquoise pools, spray in the air. A water dragon surfaces with a splash.');
  say('JOE', 'A water dragon? Water dragons don’t exist!', '', { st: 2 });
  say('CLIVE', 'That’s what they say on TV. Uh...I mean, in the stories.', 'annoyed', { st: 1 });
  say('CLIVE', 'Balderdash, all of it!', '', { st: 1, lead: true });
  int('Required: tap the water dragon (the prompt appears with "Balderdash"). A jet of water arcs from its mouth full into Joe’s face. He splutters...then laughs.');
  nar('Joe wiped his face...and, for the first time in a long while, he laughed.', { joe: 'happier-standing' });
  shot('3.6', 'THE LAVA FIELDS', 'A new backdrop: black rock and glowing lava, embers rising. A fire dragon lies curled up asleep, a wisp of smoke at her nostrils.');
  say('CLIVE', 'This is Ember. Fire dragons can be temperamental...', '', { st: 1 });
  say('CLIVE', '...but get to know them and, dare I say, they’re the kindest of all dragon-folk.', '', { st: 2 });
  act('Clive walks over and gently wakes her. She uncurls: beautiful, like a more graceful Trogdor, with red and gold runes along her neck and wings.');
  shot('3.6b', 'MEDIUM — JOE, CENTRE STAGE', 'Joe stands centre stage. A large dreamlike panel opens above his head, soft at the edges: Trogdor burning the village, from Part One. Joe starts to shake. Clive has stepped round behind Ember and looks across her at Joe.');
  say('CLIVE', 'Calm down. Come and pet her. They can smell it if you’re scared.', '', { st: 1 });
  act('Ember eyes Joe warily and gives a low snarl; smoke curls from her nostrils.');
  int('Required: press and hold to reach out (or tap three times: a step, a step, a touch). Joe edges closer, eyes squeezed shut, and touches her nose. The flashback fades.');
  nar('Joe held his breath and touched her nose. Ember gave a warm little huff...and went back to sleep.');
  shot('3.6d', 'MEDIUM', 'Joe, thrilled with himself, punches the air with his sword: his tavern cheer. Clive clears his throat. Joe tries again, much smaller: hands only.');
  say('JOE', 'Huzzah!', '', { st: 1 });
  say('CLIVE', 'Ahem.', '', { st: 1, small: true });
  act('Joe gives a much smaller huzzah: hands only, no sword.', { hold: 2100, fx: 'smallHuzzah' });
  cut('FADE TO BLACK, THEN UP ON:');
  shot('3.7', 'WIDE — BACK ON THE LEDGE', 'The whole oasis again. Joe is calmer now. A nest with two eggs sits beside Clive: one frosty blue, one fiery red.');
  say('CLIVE', 'I hope you see it now. Dragons are not born evil. They should be respected.', '', { st: 1 });
  say('CLIVE', 'If you really want a bond, you want a dragon from when they’re young...', '', { st: 1 });
  say('CLIVE', 'Lucky for you, I found two eggs alone in the ashes. I suppose you can have one.', '', { st: 1, hold: 500 });   // st2-25 (Joe): it leads into the choice: the cards come up half a second after it has typed
  choice('Pick your egg. The cards open by themselves half a second after Clive’s line has typed, or when the visitor taps either egg.', [
    'Frost: the ice egg (pale blue and white, frosty swirls)',
    'Fire: the fire egg (red and gold, glowing cracks)',
  ]);
  ach('How to train your dragon: awarded on picking an egg.', 'st2-egg');
  act('Clive hands Joe a brown leather backpack and the egg goes inside. From here on Joe wears the backpack, with the shape of an egg bulging in the sack. It looks the same for either egg.', { hold: 2400, joe: 'happier-stance-pack', clive: 'present' });
  shot('3.8', 'CLOSE — JOE AND CLIVE', 'A fade into a close two-shot. Joe thanks Clive and asks about the wizard. Clive gives him a long, funny look. Then he grins.');
  say('JOE', 'Thanks for all your help Cliv...I mean Cliniverous the Dragon Tamer', '', { st: 2, joe: 'happier-stance', clive: 'present' });
  say('CLIVE', '*cough* Master.', '', { st: 1, small: true, clive: 'side' });
  say('JOE', 'I was wondering if you could help with one last thing.', '', { st: 1, joe: 'nervous-stance' });
  say('JOE', 'I’m on a quest to find a wizard to help me get home...', '', { st: 2, joe: 'concerned-standing' });
  say('CLIVE', 'A wizard, aye... There’s a crazy old man who apparently lives up in the sky.', '', { st: 1 });
  say('CLIVE', 'Elnor the Enchanted, they call him. I haven’t heard of him in a while...', '', { st: 1 });
  say('CLIVE', 'You’ll need some wings if you wanna get there. *laughs* I think I know a guy.', '', { st: 2, clive: 'present' });
  act('Joe looks at him blankly. A beat. Clive’s grin drops; he sags.', { hold: 2000, joe: 'confused-standing', clive: 'side', cfx: 'slump' });
  say('CLIVE', 'It’s me. I’m a dragon tamer, remember?', '', { st: 2, clive: 'side', cfx: 'lean', actAfter: 'sigh' });   // st2-25 (Joe): once the line has typed, his long sigh (the clip)
  say('JOE', 'I thought you said Master?', '', { st: 2, joe: 'happier-stance' });
  say('CLIVE', 'Yeah, yeah. Do you want help or not?', '', { st: 2, clive: 'folded' });
  shot('3.9', 'MEDIUM', 'Clive whistles. A big friendly dragon stands ready on the ledge, harnessed. Joe climbs into the saddle, and the pair lift off.');
  nar('And so, with a dragon of his own and an egg tucked safely in his backpack, Joe took to the skies...');
  cut('WHOOSH TO:');

  /* ---------------- SCENE 4 ---------------- */
  scene('4', 'EXT. THE SKY — THE JOURNEY', {
    Backdrop: 'Endless sky in layers: wind streaks, frozen peaks below, snow and cloud banks. It gets colder and higher, then the clouds part.',
    Characters: 'Joe on his dragon (the egg is hidden in his backpack)',
    Music: 'The oasis track’s finale carries the take-off into the flight; when it rings out, its full section loops for the flying shots. (Later: hushing to awe at the reveal.)' });
  shot('4.1', 'TRACKING — SIDE ON', 'Joe and the dragon ride the wind. Snow whips past.');
  nar('They flew through howling wind, over frozen peaks and through snow and cloud, higher than Joe had ever been...');
  int('Optional: the dragon gently follows the pointer up and down. Fly through three glowing wind rings for a little sparkle and a coin each. There is no way to fail.');
  shot('4.2', 'WIDE — REVEAL', 'The clouds part. A castle sits on a floating island, waterfalls pouring off its edges into nothing.');
  nar('...when suddenly the clouds parted, and there it was. A castle floating in the sky.');
  cut('CUT TO:');

  /* ---------------- SCENE 5 ---------------- */
  scene('5', 'EXT. THE FLOATING CASTLE — DAY', {
    Backdrop: 'An overgrown island: broken potion vials in the grass, old staffs stuck in the ground like fence posts, cracked statues, glowing runes. A great wooden door.',
    Characters: 'Joe, his dragon, the egg (hatching), Elnor the Enchanted, Blip (his floating purple alien)',
    Music: 'Mysterious and old, with a music-box feel. It turns warm when Elnor softens.' });
  shot('5.1', 'WIDE', 'The dragon lands. Joe slides off and wanders between the broken vials and staffs towards the door.');
  nar('Joe wandered past broken potion bottles and old staffs stuck in the ground, towards a great wooden door...');
  int('Tap a vial: a puff of coloured smoke. Tap a staff: a fizz of sparks.');
  shot('5.2', 'MEDIUM — THE DOOR', 'Joe reaches for the knocker.');
  say('ELNOR', 'Who goes there?!', 'behind the door');
  say('JOE', 'Are you Elnor the Enchanted?');
  say('ELNOR', 'I haven’t heard that name in a while...yes, it’s all coming back to me.');
  shot('5.3', 'MEDIUM TWO-SHOT', 'The door creaks open. A very frail old wizard leans on his staff, beard to his knees. A little purple alien floats at his shoulder.');
  say('JOE', 'I need the portal back on. Trogdor’s burning my village!');
  say('ELNOR', 'I can help...but magic isn’t free, young man.');
  shot('5.4', 'MEDIUM — THE GARDEN', 'Elnor’s eyes drift past Joe. Joe’s dragon has made himself at home: he is wearing a little wizard hat and chasing butterflies of light round the staffs.');
  say('ELNOR', 'Your dragon seems happy here. Might I...keep him?');
  say('ELNOR', 'Blip’s not the most...talkative of companions.');
  say('BLIP', 'Blip!', 'angrily');
  shot('5.5', 'CLOSE', 'The dragon closes his eyes, smiles, and rests his head in Elnor’s hand.');
  nar('The dragon closed his eyes and rested his head in the old wizard’s hand. He had found his home...and Elnor had his price.');
  say('ELNOR', 'A deal! A new orb, purple this time. And take his harness...trust me.');
  shot('5.6', 'CLOSE', 'A glowing purple orb rests in Joe’s palm.');
  ach('The purple orb cursor unlocks in Achievements, Cursors.', 'st2-orb');
  prompt('Psst...equip the purple orb cursor in your achievements. You’ll want it later.');
  shot('5.7', 'CLOSE — THE BACKPACK', 'The backpack rattles. Joe swings it round and lifts out the egg; a crack zig-zags across it.');
  int('Tap the egg (three taps): crack, crack...POP! The baby dragon hatches (frosty blue or fiery red, from the visitor’s choice), shakes off the shell and wriggles back into the backpack, peeking out.');
  note('RUNES: dragons earn their runes when they are happy. The baby Joe carries gains its first runes here, at the wizard’s castle, and Elnor explains why. (Nothing is said about runes in the oasis: that scene is already long.)');
  sfx('A tiny squeak.', ['one:chicken-squawk']);
  cut('CUT TO:');

  /* ---------------- SCENE 5B ---------------- */
  scene('5B', 'EXT. THE FLOATING CASTLE, THEN THE PORTAL WASTELAND', {
    Backdrop: 'The castle steps, the sky journey in reverse, then Scene 1’s wasteland and the dead portal.',
    Characters: 'Joe, the baby, Grik in his flying saucer',
    Music: 'The forest theme returns, hopeful now, with a cheeky lift when the saucer turns up.' });
  shot('5B.1', 'WIDE', 'A familiar buzz. Grik swoops down in a blue flying saucer and hovers by the steps.');
  say('GRIK', 'Told you I’d be around! Need a lift?');
  shot('5B.2', 'TRACKING', 'Joe and Grik zip through the clouds in the saucer; the baby’s head pokes out of the dome.');
  shot('5B.3', 'WIDE — THE WASTELAND', 'The saucer lands by the dead portal. Joe and Grik climb out and leave the saucer parked in the ash.');
  shot('5B.4', 'CLOSE — THE ARCH', 'Joe holds the purple orb up to the runes.');
  int('Use the orb: tap the portal. The runes flicker, then blaze purple.');
  ach('Secret, the highest: tap the portal with the purple orb cursor equipped. This is the end-game achievement set up in 5.4.', 'st2-portal', { manual: true });
  nar('Joe held the orb up to the arch. The runes flickered, then blazed purple, and the portal roared back to life...');
  shot('5B.5', 'WIDE', 'Joe and Grik leap into the vortex. The saucer stays behind in the ash.');
  cut('VORTEX TO:');

  /* ---------------- SCENE 6/7 ---------------- */
  scene('6/7', 'EXT. THE WOODLAND, THEN THE ROLLING HILLS — NIGHT', {
    Backdrop: 'The Part One woodland send-off board, then the hills, reused.',
    Characters: 'Joe, the baby, Grik',
    Music: 'The Part One ride theme starts...and stops dead for the joke.' });
  shot('6.1', 'WIDE', 'Joe and Grik tumble out of the portal into the Part One woodland. The ride music starts; the hills board slides in.');
  nar('So Joe set off through the rolling hills and treacherous mountains...ha ha, wait. You’ve seen this bit. I won’t make you watch it again.', { triggers: [{ at: 'rolling hills', comp: 's2_6.1b' }] });
  note('The saucer was left by the portal, so the joke is the narrator skipping the ride. The music scratches to a stop and there is a whip pan to the castle.');
  cut('RECORD SCRATCH — WHIP PAN TO:');

  /* ---------------- SCENE 8 ---------------- */
  scene('8', 'EXT. THE CASTLE — NIGHT', {
    Backdrop: 'The Part Two castle, scorched, with smoke rising. Trogdor looms in front of it.',
    Characters: 'Joe, Grik, the baby dragon, Trogdor',
    Music: 'Battle drums build...then drop to silence at the reveal, and swell into a tearful, joyful theme.' });
  shot('8.1', 'WIDE', 'Trogdor paces in front of the castle, furious, flames licking from his jaws. Joe and Grik march up the hill.');
  say('JOE', 'Your reign of terror is over, beast!');
  sfx('Trogdor roars.', ['one:vil-dragon-roar']);
  shot('8.2', 'CLOSE', 'Joe sets his backpack down. The baby dragon climbs out, small and scared.');
  int('Tap the backpack.');
  shot('8.3', 'CLOSE — TROGDOR', 'Trogdor freezes mid-roar. The flame fizzles into a puff of smoke. His eyes go wide.');
  say('JOE', 'Wait!', 'arm out to Grik');
  act('Grik stops his attack mid-swoop.');
  shot('8.4', 'MEDIUM', 'The baby flutters and crawls across the ash to Trogdor. Trogdor lowers his head and sniffs him. His eyes well up.');
  say('TROGDOR', 'He looks just like his mother...', 'thought bubble');
  note('Funnier if they picked Frost: an icy-blue baby who looks nothing like Trogdor. So that’s where the ice comes from.');
  note('RUNES: Trogdor has none until now. As he finds his baby, runes appear on him...and Joe realises that is why he looked different from the dragons of the oasis.');
  nar('The baby dragon fluttered across the ash...and Trogdor’s eyes filled with tears. His little one had come home.');
  shot('8.5', 'WIDE', 'They dance: nose-boops, spins and a playful chase, a nod to How to Train Your Dragon.');
  int('Tap them to add hearts and sparkles to the dance.');
  shot('8.6', 'MEDIUM TWO-SHOT', 'Trogdor turns to Joe, bows low and gives a gentle, respectful snort of smoke.');
  say('TROGDOR', 'I am forever in your debt.', 'deep dragon voice');
  say('JOE', 'I’ve got an idea...', 'holding up the harness');
  cut('CUT TO:');

  /* ---------------- SCENE 9 ---------------- */
  scene('9', 'EXT. THE VILLAGE — DAY', {
    Backdrop: 'The Part One village, half rebuilt: scaffolding, patched roofs.',
    Characters: 'The villagers (the pitchfork guy, the curly kid, the bonnet lady, the old man), Trogdor, Joe, the baby, Grik',
    Music: 'Panic stabs, then a comic stop, then a triumphant march.' });
  shot('9.1', 'WIDE', 'A huge shadow sweeps over the village. The villagers scatter.');
  say('VILLAGER', 'It’s Trogdor! Run!');
  say('CURLY KID', 'Wait...is there something on his back?');
  shot('9.2', 'LOW ANGLE', 'Trogdor lands gently, wearing the harness. Joe sits on his back, with the baby on Trogdor’s head and Grik hovering.');
  note('RUNES: Trogdor lands wearing his new runes.');
  nar('Trogdor had only been searching for his lost eggs. Now, with his little one safe, the burning stopped for good.');
  int('Tap Trogdor: he lights the village lanterns one by one (or toasts marshmallows for the kids).');
  cut('CUT TO:');

  /* ---------------- SCENE 10 ---------------- */
  scene('10', 'EXT. THE VILLAGE SQUARE — SUNSET', {
    Backdrop: 'Bunting, lanterns, confetti, the whole village gathered.',
    Characters: 'Everyone',
    Music: 'The main theme, full and triumphant, then a soft music-box ending.' });
  shot('10.1', 'WIDE', 'Joe is crowned king. Trogdor sits proudly beside him with the baby, and Clive arrives carrying the second egg on a velvet pillow: the baby’s brother. Grik does laps overhead.');
  note('RUNES: in this final scene Trogdor is covered in runes.');
  say('CLIVE', 'Found your other one, big fella. Thought you might want him back.');
  nar('And so Joe was crowned king of the village, with Trogdor and his little one by his side...');
  cut('HARD CUT TO LIVE ACTION:');
  shot('10.2', 'INT. JOE’S REAL ROOM — LIVE ACTION', 'Real-life Joe sits wearing a cardboard crown. Grandad Jim sits in an armchair, reading from a storybook.');
  say('GRANDAD JIM', '...and they all lived happily ever after.', 'spoken, live action');
  say('OFF-CAMERA VOICE', 'What are you two doing?', 'spoken, live action');
  shot('10.3', 'CLOSE TWO-SHOT', 'Joe and Jim look at each other...then slowly at the camera.');
  ach('Happily ever after: awarded for finishing Storytime 2.', 'st2-end');
  ach('Unlock: Blip, Elnor’s floating purple alien, as a companion (his look, in the Store or companion slot), after Storytime 2.', 'st2-blip');
  cut('SMASH CUT TO: END CREDITS');
  act('Written, Directed, Designed, Developed & Animated by Joe Jackson');
  act('Narrated by [female narrator]');
  act('Trogdor voiced by [voice actor]');
  act('Grandad played by Jim Jackson');
  act('Music: [song name] — [artist]');

  /* ====================================================================================================================
     2. THE CAST — the name shown on a bubble, the layer key its tail points at, a colour for its placeholder
     ==================================================================================================================== */
  var CAST = {
    'JOE':              { name: 'Joe',              key: 'joe',      tint: '#e8564f' },
    'GRIK':             { name: 'Grik',             key: 'grik',     tint: '#6fd36b' },
    'CLIVE':            { name: 'Clive',            key: 'clive',    tint: '#c98a3c' },
    'ELNOR':            { name: 'Elnor',            key: 'elnor',    tint: '#9a7be0' },
    'BLIP':             { name: 'Blip',             key: 'blip',     tint: '#b46bff' },
    'TROGDOR':          { name: 'Trogdor',          key: 'trogdor',  tint: '#e06a8a' },
    'VILLAGER':         { name: 'Villager',         key: 'villager', tint: '#b9a26a' },
    'CURLY KID':        { name: 'Curly kid',        key: 'curly',    tint: '#d9a15a' },
    'GRANDAD JIM':      { name: 'Grandad Jim',      key: 'jim',      tint: '#cfc7b8' },
    'OFF-CAMERA VOICE': { name: 'Off-camera voice', key: 'offcam',   tint: '#cfc7b8' }
  };

  /* ====================================================================================================================
     3. THE SHOTS — one entry per layer.
        L(key, label, name, kind, box, opts)   a layer placed on the SCREEN (the scenes still waiting for their boards)
          box  → [left %, bottom vh, width vw, aspect w/h]
        B(key, label, name, kind, pos, opts)   a layer placed on the BOARD (the scenes with real boards: 1, 2, 3, 5B)
          pos  → [centre x, feet y, width, aspect w/h] as fractions of the 1672×941 board (x and width of its width, y of its height)
        name → the expected file: story2-<scene>-<name>  (.webp for a still; .webm + .mov + -poster.webp for a clip)
        kind → 'still' | 'clip' (alpha video) | 'fx' (drawn in code: no file)
        opts → tint, z, pick:true (changes with the egg), tap:true (pressable), hide:true (starts hidden; an interaction shows it),
               real:{…} (a Part One layer, reused as is), art:true (the real file is in under its expected name),
               src:'story2-grik-stand' | 'joe-think' (the art that is in now: a real still, or a Part One pose standing in — no placeholder drawn),
               vid:'story2-clive-idle' (the keyed clip that is in now: .webm + .mov + -poster.webp; its crop is in CLIPS),
               flip:true (faces the other way), cls (idle = the grounded bob, st2hov = a hover), hot:true (an unseen press area over something
               painted into the board), glow:'#colour' (a soft light, drawn in code), k (how far it slides in a pan: 1 = with the board),
               d (its depth for the camera: 1 = with the land, less = further, more = nearer), css (extra CSS: a mask, a filter),
               exit: { cls, at } (a class it takes `at` ms into the shot: Grik zooming off), hold (a clip that plays once and holds),
               todo (art still to come for it)
        Per shot: set (which board set: SETS below) + cam (the camera's framing: see CAM), or for the scenes still on placeholders
        bg (null = a generated mood board; 'name' = a Part One board; file = the expected board file), bgFx (a CSS filter on a reused
        board); ints (in the screenplay's order: which layer each interaction presses), off (which side an off-screen voice comes
        from), hold (ms a shot with no words stays up).

        CAM — { x, y, z, tx, ty, from, ms, wait, move }
          x, y   the point of the board the shot is about (y defaults to the feet line)        z   the zoom (1 = the whole board)
          tx, ty where on the screen that point should sit (default: the middle; ty: where it already is)
          nx     the x a narrow screen looks at instead (it sees about a quarter of the board: the speaker has to be in it)
          from   { x, y, z } a pan: the shot opens there, waits `wait` ms, then travels to x / y / z over `ms`
          move   ms for the move in from the last shot (default 2200)
        On a wide screen the engine's camera rig does all of it (one rig per board, like Part One's CAM_RIGS); on a screen narrower
        than the board (phones, tablets upright) the board also slides so the point is in view (--bp), and the rig adds a little zoom.
     ==================================================================================================================== */
  var MOOD = {            // sky top, sky bottom, ground — the generated boards' gradients
    '1':  ['#241a26', '#5a4038', '#2b2428'], '2':  ['#c9783a', '#e9b06a', '#8a8078'], '3':  ['#3aa6c9', '#9fe0c0', '#3f8a4a'],
    '4':  ['#2d5fa8', '#cfe6ff', '#eaf4ff'], '5':  ['#6a5aa8', '#c9b6e6', '#5d7a4a'], '5B': ['#3a4a7a', '#8a7a9a', '#2b2428'],
    '6/7':['#101a3a', '#27406a', '#1c3a2a'], '8':  ['#1a1024', '#5a2a2a', '#2a2026'], '9':  ['#6aa8d9', '#d9ecf4', '#7a9a5a'],
    '10': ['#e0703a', '#f4c078', '#8a6a4a'] };
  function L(key, label, name, kind, box, o) { o = o || {}; return { key: key, label: label, name: name, kind: kind, box: box, tint: o.tint, z: o.z, art: !!o.art, pick: !!o.pick, tap: !!o.tap, hide: !!o.hide, real: o.real || null, fx: o.fx || null, ar: box[3], src: o.src || null, vid: o.vid || null, flip: !!o.flip, cls: o.cls || '', pickSrc: o.pickSrc || null }; }
  function B(key, label, name, kind, pos, o) { o = o || {}; var l = L(key, label, name, kind, pos, o); l.box = null; l.pos = pos; l.p1 = !!o.p1; l.cls = o.cls || ''; l.css = o.css || ''; l.exit = o.exit || null; l.hold = !!o.hold; l.todo = o.todo || ''; l.hot = !!o.hot; l.glow = o.glow || null; l.k = o.k; l.d = o.d; return l; }
  var GROUND = 6;   // vh added to every screen box's bottom: the path sits above the narration banner
  var C = function (k) { return CAST[k].tint; };

  /* ---- the boards (1672×941) and what stands on them ---- */
  var AR = 1672 / 941, FEET = .70;      // FEET: the line the figures stand on (just above the narration banner)
  var OY = FEET - .008;                 // st2-14: the line they stand on on the oasis ledge (its sand now runs from ~.625 down): clear of the banner on a short 16:9 screen too (1366×768: the banner's top is at .702)
  var JH = .169;                        // Joe's standing height, as a fraction of the board's width
  var POSES = { inspect: [.796, .780], kneel: [.792, .886], think: [.760, .793], idle: [.524, 1], step: [.590, .899], hip: [.532, .976], recoil: [.610, .902], cower: [.824, .798], stepback: [.772, .936], aura: [.608, .982] };   // Part One's knight poses: [aspect w/h, height against the standing pose]
  /* Joe in one of his Part One poses (story-joe-<pose>.webp), standing in until his Storytime 2 clips are drawn */
  function J(pose, cx, o) { o = o || {}; var P = POSES[pose], w = JH * P[1] * P[0] * (o.s || 1);
    return B('joe', o.label || 'Joe', o.name || 'joe', 'clip', [cx, o.by || FEET, w, P[0]], { src: 'joe-' + pose, p1: true, cls: (o.noIdle ? '' : 'idle') + (o.cls ? ' ' + o.cls : ''), tint: C('JOE'), flip: o.flip, tap: o.tap, d: o.d, k: o.k, todo: o.todo }); }
  var EGGSIT = '-webkit-mask-image:linear-gradient(180deg,#000 74%,transparent 97%);mask-image:linear-gradient(180deg,#000 74%,transparent 97%)';   // an egg sitting in the straw: its foot feathers into the nest
  var FLYERS = { fire: ['story2-dragon-fire-fly-1', 'story2-dragon-fire-fly-2', 'story2-dragon-fire-fly-3'], ice: ['story2-dragon-ice-fly-1', 'story2-dragon-ice-fly-2', 'story2-dragon-ice-fly-3'], water: ['story2-dragon-water-fly-1', 'story2-dragon-water-fly-2', 'story2-dragon-water-fly-3'] };   // background dragons crossing the sky (no runes: never the main three)
  var BABY = { frost: 'story2-baby-frost', fire: 'story2-baby-fire' };   // the baby that hatches is the egg that was picked (no recolouring)
  var RING = '-webkit-mask-image:linear-gradient(180deg,#000 79%,transparent 79.5%),radial-gradient(ellipse 50% 12% at 50% 88%,#000 52%,transparent 98%);mask-image:linear-gradient(180deg,#000 79%,transparent 79.5%),radial-gradient(ellipse 50% 12% at 50% 88%,#000 52%,transparent 98%)';   // a water dragon's own ring of water: its outer edge feathers into the pool it sits on
  /* Joe with the backpack (story2-joe-pack), from the egg pick on */
  function JP(cx, o) { o = o || {}; var k = JH * (o.s || 1) / 1127; return B('joe', o.label || 'Joe, with the backpack', o.name || 'joe-pack', 'clip', [cx - (344.5 - 290) * k, o.by || FEET, 580 * k, 580 / 1127], { src: 'story2-joe-pack', cls: 'st2breathe', tint: C('JOE'), flip: o.flip }); }   // (cx = his feet: the pack hangs out behind him)
  /* st2-14 · KNIGHT JOE'S EXPRESSIONS (story2-joe-<face>: angry / concerned / confused / emotional / happier / nervous / sad × -standing (the same body, only the face
     changes) / -stance (a gesture)). All 14 are ONE canvas: 1100×1200, his feet on y = 1180, helmet top to feet = 1127 px. The CANVAS is placed once per shot (cx = his
     feet, measured on the art at x = 564; by = the ground; s = his scale) and only the picture inside it changes, with the swap of rule 8 (the new one fades in on top
     at full strength, then the old one is dropped): so a change of expression can never move or resize him. His clips are placed by the same two measures (helmet
     top to feet, feet centre: JCLIP), so a still and a clip of him are the same size and stand on the same spot.
       S3 = his scale on the oasis ledge (Joe: further left and smaller) · JOE3 = where he stands there */
  var JXW = 1100, JXH = 1200, JXFEET = 1180, JXTALL = 1127, JXFX = 564, S3 = .82, JOE3 = .19;
  /* st2-15 · the same set WITH THE BACKPACK (story2-joe-<face>-pack: the same canvas, so a pack and a no-pack still of one pose overlay exactly; the pack only adds to
     his back): from the egg pick on (a shot marked pack: true takes the -pack picture of whatever face a line asks for).
     THE PEACEKEEPING POSES (story2-joe-cautious-peace / -approaching / -calm-hands-up, and their -pack versions): a wider canvas (1500×1200, base on y = 1180), lunging,
     so they are matched to the standing still by the HELMET, measured on the art (the helmet is 418 px wide in the standing stills, its centre 46 px left of his feet
     centre): s = 418 / the pose's helmet width, fx = the canvas x that stands where his feet centre was (the pose's helmet centre + 46 px), so at a swap his helmet
     keeps its size and its place over the ground, and only drops by the pose's own crouch. JXG: face → [canvas w, h, base y, fx, s]. */
  var JXG = { 'pointing': [1500, 1300, 1280, 600, 1],   /* st2-23 · story2-joe-pointing: Joe pointing up and to the right, hopeful (canvas 1500 x 1300, feet on y 1280, feet centre x 600, the standing set's own scale) */ 'cautious-peace': [1500, 1200, 1180, 818, 1.015], 'approaching': [1500, 1200, 1180, 819, 1.065], 'calm-hands-up': [1500, 1200, 1180, 783, 1.01],
    'cautious-peace-pack': [1500, 1200, 1180, 848, .99], 'approaching-pack': [1500, 1200, 1180, 806, 1.01], 'calm-hands-up-pack': [1500, 1200, 1180, 796, 1.03] }, JXG0 = [JXW, JXH, JXFEET, JXFX, 1];
  /* st2-18 (Joe) · NEVER MIRROR JOE OR CLIVE: their art only works one way round (the J on Joe's shield reads backwards). Joe is drawn facing right, Clive facing
     left: stage every shot so that is the way they need to face. JX and CLIVES ignore a flip. */
  function JX(face, cx, o) { o = o || {}; o.flip = false; var G = JXG[face] || JXG0, k = JH * (o.s || 1) / JXTALL * G[4], f = o.flip ? -1 : 1;
    var l = B('joe', o.label || 'Joe', o.name || 'joe', 'clip', [cx + f * (G[0] / 2 - G[3]) * k, (o.by || FEET) + (G[1] - G[2]) * k * AR, G[0] * k, G[0] / G[1]], { src: 'story2-joe-' + face, cls: (o.still ? 'st2still' : 'st2breathe') + (o.cls ? ' ' + o.cls : ''), tint: C('JOE'), flip: o.flip, tap: o.tap, d: o.d, k: o.k, z: o.z }); l.face = face; l.feet = cx; l.s = o.s || 1; l.gy = o.by || FEET; l.still = !!o.still; return l; }
  /* st2-15 · THE RIDERS (story2-joe-excited / -happy / -focused-rider-pack: 1500×1300, Joe seated with his legs apart for a saddle, facing right; the mount is not drawn).
     He sits on story2-mount (900×830, facing right, its saddle seat at about 495, 462) with his hips (930, 845 of his canvas, just above the gap between his thighs) on
     the seat, drawn at RIDEK (42%) of the mount's own scale, over the dragon's body (his near leg in front of it). mount = the mount layer's pos. */
  var RIDEK = .42, SADDLE = [495, 462], HIPS = [930, 845], RIDEW = 1500, RIDEH = 1300, MOUNTW = 900, MOUNTH = 830;
  function RIDER(mood, mount, o) { o = o || {}; var kM = mount[2] / MOUNTW, k = kM * RIDEK, sx = mount[0] - mount[2] / 2 + SADDLE[0] * kM, sy = mount[1] - (MOUNTH - SADDLE[1]) * kM * AR;
    return B('joe', o.label || 'Joe, in the saddle', o.name || 'joe-ride', 'clip', [sx - HIPS[0] * k + RIDEW * k / 2, sy + (RIDEH - HIPS[1]) * k * AR, RIDEW * k, RIDEW / RIDEH], { src: 'story2-joe-' + mood + '-rider-pack', cls: 'st2still', tint: C('JOE'), z: 4 }); }
  /* Joe on his dragon in a shot that is still on a screen box (Scene 4): the mount with the rider seated on it, one layer */
  function RIDE(label, name, box, mood) { var l = L('ride', label, name, 'clip', box, { tint: '#6aa8d9' }); l.ride = mood; return l; }
  /* st2-15 · art that is staged for a scene that is not built yet (make-assets lists it against its scene) */
  var STAGED = { '10.1': { what: 'Joe on the throne at the crowning (1300×1400, base on y = 1380): joyful or warm, with or without the crown', files: ['story2-joe-throne-joyful-crown', 'story2-joe-throne-joyful-no-crown', 'story2-joe-throne-warm-crown', 'story2-joe-throne-warm-no-crown'] },
    '4.1': { what: 'The focused rider, for the hard flying (same canvas and seat as the other riders)', files: ['story2-joe-focused-rider-pack'] },
    '8.1': { what: 'The peacekeeping poses with the backpack, for the stand-off with Trogdor (same placing as the no-pack ones: JXG)', files: ['story2-joe-cautious-peace-pack', 'story2-joe-approaching-pack', 'story2-joe-calm-hands-up-pack'] } };
  /* a clip of Joe, by his feet: JCLIPS = [frame w, h, helmet top y, feet y, feet centre x] measured on a standing frame of each */
  var JCLIPS = { 'story2-joe-sword-draw': [562, 560, 97, 553, 235], 'tav-joe-huzzah': [906, 1014, 318, 1006, 669.5] };
  /* st2-20 SLOT · 'Joe inspects, then points' (a Dreamina clip, to arrive as story2-joe-inspect-point: .webm + .mov + -poster.webp). When it is in github-upload:
       1. measure it from the art (rule 6: a clip must not change his size or shift him) and add it to CLIPS (its crop box, times) and to JCLIPS just above
          ([frame w, frame h, helmet top y, feet y, body centre x]);
       2. set INSPECT_POINT = true. 2.3 then uses the clip in place of the 'sad-standing' still (he bends to the nest: INSPECT.inspect = the part of the clip to
          play, in seconds) and 2.4 opens on its second part (he points at the horizon: INSPECT.point) before the kneel.
     Until then both shots are exactly as they are (the stills below). */
  var INSPECT_POINT = false, INSPECT = { vid: 'story2-joe-inspect-point', inspect: [0, null], point: [null, null] };
  function JCLIP(vid, cx, o) { o = o || {}; var q = JCLIPS[vid], c = CLIPS[vid], k = JH * (o.s || 1) / (q[3] - q[2]), fw = c.box[2] - c.box[0];
    return B('joe', o.label || 'Joe', o.name || 'joe', 'clip', [cx - (q[4] - (c.box[0] + c.box[2]) / 2) * k, o.by || FEET, fw * k, fw / (c.box[3] - c.box[1])], { vid: vid, hold: true, tint: C('JOE'), p1: o.p1 }); }
  /* Joe reaching out to Ember (story2-joe-reach, at the stills' own pixel scale ×1.05: his helmet measures 5% smaller in it), by his feet (x = 420 of 900) */
  function JREACH(cx, by) { var k = JH / JXTALL * 1.05; return B('joe', 'Joe reaches out, eyes squeezed shut, and touches her nose', 'joe-reach', 'clip', [cx + (450 - 420) * k, by, 900 * k, 900 / 1007], { src: 'story2-joe-reach', cls: 'st2still' }); }
  function DR(key, label, name, src, pos, o) { o = o || {}; return B(key, label, name, 'clip', pos, { src: src, cls: o.cls || 'idle', flip: o.flip, tap: o.tap, z: o.z, css: o.css, hide: o.hide, k: o.k, d: o.d }); }   // a dragon still (gentle bob)
  /* st2-13 · the frost dragon Joe pulls his sword on (3.2 → 3.3b): four cuts of ONE clip sharing one crop box (800×466: they overlay exactly), on the snow at the right
     of the oasis, on the land behind the ledge (he rides the land's plate). The box is sized so the SITTING dragon is the size the still was (FROSTAT: his centre x,
     feet y, width on the board; FROSTFIG: the sitting figure inside the box, from the calm cut's first frame) with his feet on the same snow line.
       3.2  'angry'   the calm cut's first frame for a beat → rise (one-shot) → angry (looping, with a dissolve, while the sword is up)
       3.2b 'settle'  the angry loop is left on a growl frame if one is within ~400ms (else a dissolve) → settle (one-shot) → calm (looping)
       3.3 / 3.3b 'calm'
     The clip's own frost breath was lost to the key: a pale cold puff is drawn at his mouth on the roar frames (FROSTROAR: the angry cut's roar, s; FROSTMOUTH:
     where his mouth is in the box then). Shown at ~340–360 CSS px wide at 1440 (the files are 800 px wide: ~2.3×). */
  /* st2-14 (Joe): he is at the FRONT of the four dragons, the smallest, about Joe's height, on the sand of the ledge (FROSTAT: his centre x, feet y, his SITTING height
     in board widths), and his sequence has no loop: the first frame of the rise (sitting, calm) as the shot opens → Joe pulls his sword → the rise → he HOLDS a growl
     frame of the angry cut (FROSTHOLD s in; a tiny tremble in code) for as long as the sword is up → on the advance into 3.2b the roar plays ONCE and runs straight on
     into the settle (the cuts are consecutive: each starts on the frame the last one ended on, so every change is a cut on a matching frame, never a dissolve) → he
     stays on the settle's last frame, sitting, with a slow breath. */
  var FROSTAT = [.528, OY + .004, .132], FROSTFIG = [255, 77, 590, 444], FROSTW = 800, FROSTH = 466, FROSTROAR = [1.9, 3.6], FROSTMOUTH = [.05, .37], FROSTCUT = 'story2-oasis-dragon-frost-', FROSTHOLD = .8;
  function FROST(mode) { var hF = FROSTAT[2], bw = hF * FROSTW / (FROSTFIG[3] - FROSTFIG[1]), k = bw / FROSTW;   // (his sitting height → the box's width)
    return { key: 'frost', multi: 'frost', kind: 'clip', name: 'oasis-dragon-frost', clips: ['rise', 'angry', 'settle', 'calm'].map(function (n) { return FROSTCUT + n; }), label: mode === 'angry' ? 'The frost dragon: sitting, then up into an angry crouch, growling and roaring' : mode === 'settle' ? 'The frost dragon settles: mouth shut, folds down, sits' : 'The frost dragon, calm again: an onlooker',
      pos: [FROSTAT[0] + (FROSTW / 2 - (FROSTFIG[0] + FROSTFIG[2]) / 2) * k, FROSTAT[1] + (FROSTH - FROSTFIG[3]) * k * AR, bw, FROSTW / FROSTH], z: 5 }; }
  /* st2-14 · the three big dragons of 3.2 → 3.3 (story2-dragon-<name>-angry / -calm, all facing left). Each pair is aligned from the art: k = board widths per pixel of
     the ANGRY still; calm = [px w, px h, its scale against the angry one, how far its left edge sits right of the angry one's (angry px)] so the feet stay on one line
     and the head / body keep one size (earth: the calm file is drawn at half the angry one's resolution: ×2.03, +32 px, by matching the two silhouettes; red: the same
     pose, ×1; black: reared up → sitting, matched on the head and the runes: ×.84, feet centres 248 ↔ 166 px). ax = the angry still's left edge on the board, by = the
     feet line (both stills carry a 6 px margin), tall = its height against Joe's (S3), nose = the nostril in the angry still, smoke = the puff's colour. */
  var DRAG = {
    black: { ax: .652, by: OY - .02, z: 3, tall: 1.75, angry: [564, 709], calm: [535, 745, .84, 109], nose: [.1, .295], smoke: 'dark', label: 'The black dragon, the biggest, at the back' },
    earth: { ax: .566, by: OY - .008, z: 4, tall: 1.25, angry: [1013, 996], calm: [485, 498, 2.03, 32], nose: [.1, .26], smoke: 'dust', label: 'The earth dragon' },
    red:   { ax: .786, by: OY - .006, z: 4, tall: 1.3, angry: [790, 1004], calm: [787, 1002, 1, 0], nose: [.04, .24], smoke: 'warm', label: 'The red dragon' } };
  function drGeo(name, mood) { var D = DRAG[name], k = JH * S3 * D.tall / (D.angry[1] - 12), c = D.calm, q = mood === 'calm' ? { w: c[0] * c[2] * k, x: D.ax + c[3] * k, ar: c[0] / c[1], m: 6 * c[2] * k } : { w: D.angry[0] * k, x: D.ax, ar: D.angry[0] / D.angry[1], m: 6 * k };
    return { src: 'story2-dragon-' + name + '-' + mood, pos: [q.x + q.w / 2, D.by + q.m * AR, q.w, q.ar] }; }
  function DRG(name, mood) { var D = DRAG[name], g = drGeo(name, mood), l = B(name, D.label + (mood === 'calm' ? ', calm again: sitting, a slow breath' : ', angry: a tremble, a small lunge, smoke at the nostrils'), 'dragon-' + name + '-' + mood, 'clip', g.pos, { src: g.src, cls: mood === 'calm' ? 'st2breathe' : 'st2angry', z: D.z, css: 'animation-delay:-' + ({ black: 0, earth: .9, red: 1.7 })[name] + 's' }); l.drag = name; l.mood = mood; return l; }
  /* st2-16 · THE DRAGONS BLINK (code): a lid in the dragon's own body colour closes over each open eye for ~120 ms, every 3–7 s, each dragon on its own clock.
     EYES: still → [lid colour (sampled from the art beside the eye), the still's w / h, the eye boxes [x0, y0, x1, y1] as fractions of the still (measured on the art, with a
     small margin)]. Not listed, so they never blink: Ember asleep and the baby on Clive's shoulder (eyes shut), Ember lying (narrowed to a wary slit), the far eyes
     of the black and earth dragons (slivers), the frost dragon of 3.2 / 3.3 (a clip). */
  var EYES = {
    'story2-dragon-black-angry': ['#2a2729', 0.7955, [[0.2119, 0.1915, 0.2757, 0.2373]]],
    'story2-dragon-black-calm': ['#241d1f', 0.7181, [[0.1335, 0.1931, 0.2029, 0.2351]]],
    'story2-dragon-earth-angry': ['#a7451a', 1.0171, [[0.2347, 0.1669, 0.3092, 0.2648]]],
    'story2-dragon-earth-calm': ['#a5451a', 0.9739, [[0.1781, 0.1406, 0.2858, 0.257]]],
    'story2-dragon-red-angry': ['#e92320', 0.7869, [[0.1911, 0.1654, 0.3203, 0.2509]]],
    'story2-dragon-red-calm': ['#ea221f', 0.7854, [[0.2005, 0.1277, 0.3523, 0.2446]]],
    'story2-dragon-ice-bg': ['#83c6fc', 0.9202, [[0.2384, 0.1302, 0.326, 0.2144]]],
    'story2-dragon-ice-stand': ['#7bc5fb', 0.7018, [[0.2035, 0.1678, 0.3053, 0.2535]]],
    'story2-dragon-ice-sit': ['#79c4fb', 0.7761, [[0.2338, 0.1941, 0.3565, 0.3051]]],
    'story2-dragon-water': ['#0eb9e2', 0.9385, [[0.1194, 0.2247, 0.1928, 0.353], [0.2689, 0.2432, 0.43, 0.4065]]],
    'story2-dragon-water-bg1': ['#01b5d1', 0.8063, [[0.1628, 0.1425, 0.2612, 0.2526], [0.3167, 0.1864, 0.4889, 0.3208]]],
    'story2-dragon-water-bg2': ['#019bd2', 1.0453, [[0.2335, 0.1318, 0.3276, 0.241]]],
    'story2-dragon-shy': ['#f54e49', 0.7299, [[0.5091, 0.1353, 0.6692, 0.2934], [0.7169, 0.1493, 0.8033, 0.2981]]],
    'story2-mount': ['#14acc6', 1.0843, [[0.8633, 0.1487, 0.9123, 0.2465], [0.702, 0.1585, 0.8025, 0.2885]]] };
  /* where smoke comes from: a layer key, the nostril in its art (fractions of its box), the puff's colour, ms between puffs, its size against the layer's width */
  var SMOKE = { black: ['black', DRAG.black.nose, 'dark', [520, 900], .16], earth: ['earth', DRAG.earth.nose, 'dust', [600, 1000], .12], red: ['red', DRAG.red.nose, 'warm', [560, 950], .14],
    emberAsleep: ['ember', [.03, .6], 'warm', [2300, 3200], .07], emberLying: ['ember', [.03, .34], 'warm', [700, 1100], .09],
    blackCalm: ['black', [.035, .21], 'dark', [5000, 8000], .085, 'calm'] };   // st2-16: calm, the black dragon still lets a small lazy puff go every 5–8 s (the nostril in his sitting still)
  /* st2-13 · three far flyers over the oasis in the Joe + Clive shots (story2-flyer-fire / -water / -frost: each flaps on the spot, facing right): one over each habitat,
     small (w = a fraction of the board's width: ~6–7% of the visible width at 1440; the clips are 360 px wide, drawn at ~100–125 CSS px), hazed a touch, each on a
     slow drift of a few % of the width and back (turning to face the way it goes) with its own rise and dip and its own clock. [clip, x, y on the board, w, drift
     (board widths), seconds each way, bob seconds, haze, the clip's w / h] */
  var FLYCLIPS = [['story2-flyer-fire', .17, .16, .06, .035, 23, 5.1, .86, 360 / 302], ['story2-flyer-water', .6, .13, .058, .03, 27, 6.3, .9, 360 / 336], ['story2-flyer-frost', .87, .2, .054, .028, 19, 3.9, .88, 360 / 356]];
  var PACK = 'story2-joe-pack: Joe with the backpack (an egg-shaped bulge; the same for either egg). He wears it from the egg choice on.';   // TODO(art): swap these Joes to it when it lands
  /* the keyed clips that are in (story2-<name>.webm + .mov + -poster.webp). w, h = the clip's frame; box = the figure inside it [x0, y0, x1, y1]
     (a layer's pos is the FIGURE's centre, feet and width, so a still and its clip stand in the same place); at = the crop's corner in the
     1280×720 source (two clips of one figure line up by it) */
  var CLIPS = {
    'story2-clive-idle':    { w: 326, h: 532, box: [15, 15, 313, 527], at: [493, 91], rest: [6000, 9000] },   // arms folded, a calm finger-and-foot tap (st2-4 re-cut: 0.75–3.0s of the source, a ping-pong). rest: he holds its first frame and taps one pass every 6–9s
    'story2-clive-sigh':    { w: 352, h: 544, box: [21, 9, 333, 533], at: [479, 85] },     // the long weary sigh (a one-shot, ~4.8s; he ends slumped)
    'story2-grik-fly-loop': { w: 446, h: 346, box: [11, 14, 437, 333] },                   // flying in place, facing right (a loop): his default when he hovers
    'wood-joe-walkup':      { w: 1280, h: 720, box: [0, 0, 1280, 720], p1: true },
    'story2-joe-sword-draw': { w: 562, h: 560, box: [96, 97, 335, 554], at: [425, 113] },  // Joe goes wide-eyed, draws his sword and holds it out, trembling (a one-shot, 4.7s)
    'story2-joe-sword-hold': { w: 476, h: 444, at: [443, 225] },
    'story2-joe-sword-sheath': { w: 562, h: 560, box: [96, 97, 335, 554], at: [425, 113] },   // he lowers the sword and sheathes it (a one-shot, 32 frames = 1.33s), on the draw clip's own box
    'story2-grik-exit': { w: 1278, h: 720, box: [0, 0, 1278, 720] },                        // Grik looks round, draws his swords and flies off, shrinking (a one-shot, 123 frames = 5.1s; darker outlines than his stills)
    'tav-joe-huzzah': { w: 906, h: 1014, box: [466, 318, 830, 1006], at: [0, 0], p1: true },   // Part One's tavern cheer (story-tav-joe-huzzah): the sword is at the top from ~2.2s
    'story2-joe-huzzah-hands': { w: 906, h: 1014, box: [466, 318, 830, 1006], at: [0, 0] } };   // SLOT (st2-14): the small, hands-only huzzah Joe is making, keyed from the same plate as the tavern cheer: same frame, same box, same scale                          // the trembling hold (a loop), laid over the draw clip's last frame by the two crops' source offsets       // Part One's walk-up (story-wood-joe-walkup): he walks from 30% to 53.5% of its frame in 4s, 35.8% of its height tall, feet 87.3% down, then stands
  /* a one-shot clip played over a figure's default clip, then crossfaded back (say(..., { act: 'sigh' })) */
  var ACTS = { sigh: { key: 'clive', vid: 'story2-clive-sigh', over: 'story2-clive-idle', ms: 4850 },
    swordHold: { key: 'joe', vid: 'story2-joe-sword-hold', over: 'story2-joe-sword-draw', loop: true },
    sheath: { key: 'joe', vid: 'story2-joe-sword-sheath', over: 'story2-joe-sword-draw', stay: true, ms: 1340, from: [-30, 4] },   // stay: it holds its last frame (he stands, sword away) until the shot changes · from: measured on the art, the sheath's first frame has him 30 px right (4 px above) of where the draw / hold leave him, in the same crop box: the clip starts that much to the left and eases home as he sheathes (a real move of ~15 screen px), so there is no jump at either end
    hands: { key: 'joe', vid: 'story2-joe-huzzah-hands', over: 'tav-joe-huzzah', stay: true, ms: 3000 } };
  var HUZZAH_HANDS = false;   // st2-14 SLOT: set true when story2-joe-huzzah-hands (.webm + .mov + -poster.webp) is in github-upload; until then the small huzzah is a stand-in (his happy stance, two small hops)   // loop: it takes over from its base clip and stays (until the shot changes)
  /* st2-5 · sharpness: a keyed clip is small (Clive's are 326 px wide, cut from a 720p source). Rule: if a shot would draw a clip at more than
     UPSCALE x its native pixels (on a 1440-wide screen at 1x), or the shot is a close-up (zoom >= CLOSE_Z: a 2x screen doubles everything),
     the figure's high-res still stands in for that shot, with a very gentle breath instead of the clip's own motion. A shot that needs the
     clip's motion (Clive's sigh) stays at a medium framing. STILLS: clip → its still [file, pixel width] */
  var NOSTILL = typeof location !== 'undefined' && /[?&]st2clips=1\b/.test(location.search);   // (debug: ?st2clips=1 keeps the clips in close shots, to compare)
  var UPSCALE = NOSTILL ? 99 : 1.15, CLOSE_Z = NOSTILL ? 99 : 1.5, STILLS = { 'story2-clive-idle': ['story2-clive', 700] };
  /* st2-6 · POSE SETS: hi-res stills of one figure at one scale and feet line; a figure on a pose set changes pose with a short crossfade at the
     matching line (never mid-sentence). [file, px wide, px tall, the body's centre as a fraction of the width] · scale: board widths per pixel.
     A layer's x is its BODY centre, so a change of pose (an arm out, a hand up) never shifts where he stands. */
  var POSESETS = {
    clive: { scale: .111 / 700, side: ['story2-clive-side', 684, 1200, .469], present: ['story2-clive-present', 928, 1204, .585], think: ['story2-clive-think', 669, 1197, .477], startled: ['story2-clive-startled', 810, 1193, .531], folded: ['story2-clive', 700, 1195, .486] },   // (folded: his arms-folded still, the sternest; its anchor measured like the others: 36 px right of his feet centre)
    ice: { scale: .272 / 585, sit: ['story2-dragon-ice-sit', 454, 585, .554], stand: ['story2-dragon-ice-stand', 513, 731, .577], lie: ['story2-dragon-ice-lie', 527, 481, .533] } };
  function poseBox(set, pose, cx, flip, s) { var P = POSESETS[set], q = P[pose], w = q[1] * P.scale * (s || 1); return { src: q[0], w: w, ar: q[1] / q[2], cx: cx + (flip ? -1 : 1) * (.5 - q[3]) * w }; }
  /* Clive as a still (the rule: a still most of the time, with a slow 1% breath; his idle clip only for his arrival, the sigh clip for the sigh) */
  function CLIVES(cx, o) { o = o || {}; o.flip = false; var g = poseBox('clive', o.pose || 'side', cx, o.flip, o.s), l = B('clive', o.label || 'Clive', o.name || 'clive', 'clip', [g.cx, o.by || FEET, g.w, g.ar], { src: g.src, cls: 'st2breathe', tint: C('CLIVE'), flip: o.flip, z: o.z }); l.poseSet = 'clive'; l.pose = o.pose || 'side'; l.anchor = cx; l.s = o.s || 1; return l; }
  function DRP(key, label, name, set, pose, cx, by, o) { o = o || {}; var g = poseBox(set, pose, cx, o.flip), l = DR(key, label, name, g.src, [g.cx, by, g.w, g.ar], o); l.poseSet = set; l.pose = pose; l.anchor = cx; return l; }
  function CLIVE(cx, o) { o = o || {}; return B('clive', o.label || 'Clive', o.name || 'clive', 'clip', [cx, o.by || FEET, .111 * (o.s || 1), 298 / 512], { vid: 'story2-clive-idle', cls: 'morph', tint: C('CLIVE'), flip: o.flip, hold: true, css: 'transition:none' }); }   // (st2-17: he is simply there, whole, under his puff of smoke: enterGo)
  /* a figure that only moves its mouth while it speaks: the calm still is on screen (with a gentle code bob); its talking clip is laid over it,
     hat on hat and eye on eye, only while one of its bubbles is typing, with a quick crossfade (st2-4, Joe). sc / ox / oy place the clip's frame
     on the still, in the still's own pixels (measured by matching the hat and the eye of the clip's first frame to the still) */
  var TALK = { 'story2-grik-fly': { vid: 'story2-grik-fly-loop', w: 446, h: 346, of: [900, 680], sc: 2.318, ox: -40.6, oy: -27.6 } };
  function GRIK(cx, by, w, o) { o = o || {}; return B('grik', o.label || 'Grik', o.name || 'grik-hover', 'clip', [cx, by, w, 900 / 680], { src: 'story2-grik-fly', cls: 'st2hov' + (o.cls ? ' ' + o.cls : ''), tint: C('GRIK'), flip: o.flip, exit: o.exit }); }
  function HOT(key, label, pos, o) { o = o || {}; return B(key, label, null, 'fx', pos, { hot: true, tap: o.tap, z: o.z != null ? o.z : 2, k: o.k, d: o.d }); }
  function A(key, file, pos, o) { o = o || {}; return { key: key, art: file, pos: [pos[0], pos[1], pos[2], AR], k: o.k, d: o.d, z: o.z, label: o.label || '' }; }   // a full-board art layer (a depth layer of the scene)
  var MOTIFS = {   // the swirl motifs of story-nightsky.svg (its spirals: outer band + inner curl), at half scale; recoloured per sky
    A: { w: 814, h: 1260, p: ['M596 117C620 99 654 118 668 144C683 171 685 202 697 230C712 264 740 290 759 322C786 368 793 427 777 479C770 505 757 529 753 555C745 601 765 647 779 691C802 761 813 837 802 910C790 983 753 1053 694 1095C683 1103 669 1111 664 1125C660 1133 661 1143 659 1152C653 1180 628 1201 604 1214C540 1249 465 1260 395 1243C385 1241 374 1238 364 1237C352 1237 340 1240 329 1242C264 1249 206 1204 156 1162C120 1132 83 1100 71 1054C66 1035 66 1015 59 997C50 973 32 955 20 934C2 899 0 857 5 818C10 779 21 740 26 701C32 651 28 599 37 550C50 483 87 421 139 381C155 369 173 359 192 361C212 363 230 381 251 379C263 379 273 372 284 367C331 341 388 337 439 354C489 371 533 410 557 459C575 496 583 537 597 575C612 613 634 648 650 687C668 731 677 780 671 827C664 875 639 921 600 946C590 952 578 957 572 967C566 976 564 986 560 995C551 1019 529 1036 506 1047C485 1057 461 1063 438 1060C416 1058 395 1050 375 1039C317 1010 262 963 240 899C217 835 239 751 297 723C317 713 344 713 354 732C357 738 358 745 359 752C362 775 364 797 367 820C368 827 369 835 365 841C360 848 352 850 346 855C332 868 340 894 355 905C388 928 436 899 449 860C462 821 452 778 439 738C429 704 412 666 379 658C355 653 331 665 307 663C294 662 282 656 269 655C223 651 187 696 172 741C142 827 158 925 204 1001C237 1055 287 1100 346 1115C392 1127 441 1121 488 1115C512 1112 536 1109 558 1097C572 1089 583 1078 595 1066C660 1000 718 916 717 821C716 782 705 744 695 707C678 649 662 592 644 535C629 488 613 441 584 402C563 374 536 352 510 331C491 316 472 300 450 294C420 286 389 296 359 291C308 283 268 238 216 233C187 230 156 241 128 230C96 218 80 181 74 146C70 126 70 103 83 88C92 78 104 74 117 70C201 44 286 17 374 8C462 0 554 11 631 56', 'M313 836C329 836 339 813 330 798C321 784 301 782 287 790C273 798 265 814 261 831C250 889 293 944 340 977C373 1001 415 1020 453 1005C485 992 505 957 533 937C545 929 558 924 569 914C589 898 598 872 606 847C615 819 623 788 613 760C605 741 590 726 582 707C574 688 575 667 573 646C565 561 500 480 419 471C412 471 404 470 397 467C385 461 378 447 369 436C350 412 318 400 289 405C261 411 237 430 215 448C194 465 173 483 152 500C127 521 101 543 88 574C80 592 78 612 75 632C71 664 67 696 63 728C61 741 62 758 74 761C86 764 94 750 99 739C112 707 128 677 147 649C165 621 189 593 221 592C242 591 261 602 282 604C312 606 341 588 371 591C412 595 440 634 463 670C489 710 516 754 512 802C509 832 494 859 480 885C475 893 470 902 463 908C453 916 440 918 428 920C405 924 382 927 360 919C339 912 320 890 323 866C325 853 332 835 321 829'] },
    C: { w: 1199, h: 924, p: ['M1036 787C1047 815 1022 845 994 854C967 863 937 859 909 865C873 872 843 895 809 907C760 924 704 918 660 890C638 876 618 858 595 847C554 829 507 839 463 844C393 851 320 846 255 817C190 788 133 734 108 665C103 651 99 636 87 627C80 622 71 620 63 616C38 603 25 574 18 545C0 472 7 393 39 325C43 315 49 305 51 294C54 282 54 270 55 257C63 190 117 140 168 98C204 69 243 38 288 36C306 35 325 40 343 37C367 33 388 19 410 11C447 0 486 8 521 22C556 36 589 56 624 70C670 88 718 95 762 116C821 144 870 196 895 259C903 277 908 298 902 317C895 338 875 352 871 374C869 386 873 398 876 410C888 464 880 523 852 571C825 619 779 655 728 669C690 679 650 678 612 684C573 690 535 705 496 712C451 720 404 719 361 702C319 684 282 648 268 602C264 590 262 578 254 568C248 561 239 557 231 551C211 535 200 509 195 483C191 459 191 434 198 410C205 388 218 369 232 351C273 298 328 252 393 244C457 236 530 276 543 343C547 365 542 393 521 399C515 401 508 400 501 399C480 397 459 395 437 392C430 392 423 391 418 385C413 379 413 370 409 363C401 346 375 348 361 361C332 389 348 445 381 467C414 490 457 489 496 485C530 482 569 473 584 441C595 418 589 391 596 367C600 354 608 342 612 329C626 283 592 236 554 210C482 161 387 154 306 184C249 206 196 247 169 304C147 349 141 400 136 450C134 475 131 500 137 525C141 541 149 555 157 570C203 652 268 731 357 750C393 759 431 756 468 754C524 750 581 746 638 741C685 736 732 730 775 709C805 694 831 672 858 650C876 634 894 618 905 596C919 568 917 534 928 504C947 454 999 423 1015 371C1024 342 1021 307 1038 281C1056 252 1094 243 1127 245C1147 246 1169 251 1179 268C1186 279 1187 293 1188 306C1194 399 1199 492 1187 584C1175 676 1144 767 1085 836', 'M439 340C429 353 441 375 457 377C473 379 488 364 490 347C493 330 486 313 476 300C440 255 372 256 318 273C280 285 239 308 227 348C216 383 230 420 226 456C225 471 221 485 221 500C221 526 234 550 247 573C263 598 281 624 308 633C327 639 347 635 366 641C385 646 401 660 417 671C486 718 586 716 643 655C648 649 653 643 660 640C672 633 687 636 701 636C730 635 759 617 774 589C788 563 788 532 788 502C789 474 789 446 789 419C790 385 790 350 775 320C766 302 753 287 740 272C719 249 698 226 676 202C668 193 655 183 645 191C635 198 640 214 646 225C661 256 673 288 683 321C692 353 697 391 678 417C666 435 645 444 631 459C611 483 606 518 585 541C556 572 509 570 468 567C423 563 373 557 340 523C320 502 309 474 299 446C296 436 292 427 292 417C293 404 299 392 305 381C317 360 329 339 348 326C367 313 396 311 411 329C420 339 428 356 440 350'] },
    D: { w: 559, h: 347, p: ['M171 189C167 203 156 214 142 219C134 222 126 222 118 220C103 216 92 201 89 185C86 169 90 152 97 138C107 119 123 103 142 96C177 82 220 102 238 137C255 171 248 217 223 247C198 276 157 289 120 282C83 276 50 251 28 219C19 205 11 190 8 174C0 130 23 86 54 56C90 21 140 0 189 6C238 13 284 50 296 100C303 125 301 152 313 174C323 194 344 207 365 208C392 210 417 194 441 180C465 167 494 157 518 170C544 184 552 218 556 248C558 258 559 267 557 276C555 285 550 294 544 301C515 336 468 347 424 347C392 347 357 341 334 317C310 291 305 252 298 216C293 188 285 160 275 133C267 113 258 93 244 78C222 55 189 46 158 49C121 53 85 75 66 108C48 142 49 188 72 218C95 249 140 260 172 240C184 233 193 223 201 211C208 199 214 186 215 172C215 150 201 128 181 121C161 114 138 122 125 140C118 150 115 164 119 176C124 188 137 196 148 192C163 187 161 170 163 158C170 166 173 178 171 189H171Z'] } };
  /* the code-built skies (Joe: our own animated skies, no painted ones). g = the gradient, top → horizon [stop, colour];
     sw = the swirls [motif, x, y (its centre, on the board), width, seconds per turn, direction, outer colour, inner colour, opacity];
     cl = the cloud bands [y, height, seconds per pass, colour, opacity, how many puffs] */
  var SKIES = {
    dusk: { name: 'smoky dusk', g: [[0, '#584a62'], [.14, '#6a5160'], [.26, '#80514e'], [.36, '#a6583c'], [.46, '#c8683a'], [1, '#c8683a']],
      sw: [['A', .2, .12, .34, 260, 1, '#2c2333', '#f0b79a', .27], ['C', .78, .08, .44, 340, -1, '#2c2333', '#f0b79a', .23], ['D', .5, .2, .22, 200, 1, '#33283a', '#f0b79a', .22]],
      cl: [[.2, .2, 150, '#2f2636', .5, 7], [.3, .16, 105, '#4a3038', .42, 6]] },
    haze: { name: 'hazy orange', g: [[0, '#b2532e'], [.3, '#bf5b2e'], [.5, '#cf672b'], [.6, '#d87330'], [1, '#d87330']],
      sw: [['C', .24, .14, .46, 320, 1, '#8e3d22', '#ffd9a6', .27], ['A', .8, .1, .3, 250, -1, '#8e3d22', '#ffd9a6', .24], ['D', .55, .3, .24, 210, -1, '#96432a', '#ffd9a6', .20]],
      cl: [[.24, .24, 170, '#8a4a36', .46, 7], [.38, .18, 120, '#a35a3a', .4, 6]] },
    ember: { name: 'warm dusk', g: [[0, '#3b2a4e'], [.16, '#5a3050'], [.3, '#8a3d44'], [.42, '#c2573a'], [.52, '#e07b3c'], [1, '#e07b3c']],
      sw: [['A', .22, .08, .3, 270, 1, '#2a1c36', '#ffc59a', .26], ['C', .7, .04, .42, 330, -1, '#2a1c36', '#ffc59a', .22], ['D', .48, .2, .2, 210, 1, '#33203c', '#ffc59a', .2]],
      cl: [[.14, .2, 160, '#2c1f38', .5, 7], [.26, .16, 110, '#5a2f3c', .42, 6]] },
    blue: { name: 'bright blue', g: [[0, '#2b98f2'], [.2, '#3fadfb'], [.42, '#8fd2fc'], [.58, '#c7eaff'], [1, '#c7eaff']],
      sw: [['A', .16, .06, .3, 280, 1, '#ffffff', '#b9f1ff', .27], ['C', .62, .0, .46, 360, -1, '#ffffff', '#b9f1ff', .23], ['D', .9, .16, .2, 220, 1, '#ffffff', '#d6f6ff', .27]],
      cl: [[.12, .2, 190, '#ffffff', .8, 6], [.24, .15, 130, '#f2fbff', .7, 5]], shimmer: true } };
  /* the board sets: one painted land per scene (story2-<name>-land.webp: the board with its sky cut out), shared by its shots, over a code-built sky.
       sky    which sky stands behind it (SKIES): the engine's board is its gradient; its swirls and clouds are two layers further back
       under / over   the art layers behind / in front of the figures (the land is the first of `under`)
       km     how far the ground the figures stand on slides in a narrow screen's pan (1 = with the land; more = parallax against it)
       depth  that ground's depth for the camera (the figures take it) */
  var LIFT = .08;                       // how far the oasis land is lifted (a point of its art sits this much higher on the board): its sky still shows over the peaks
  var SETS = {
    w: { n: '1', name: 'The wasteland', rig: 'st2w', sky: 'dusk', km: 1, depth: 1, atmo: 'ash', over: [],
         under: [ A('landW', 'story2-wasteland-land', [.5, 1, 1], { z: 1, label: 'The burnt forest, the arch and the path' }) ] },
    /* st2-18 (Joe: 'more ambience, dusty, swirly, much more dramatic, darker ... flames'): the desert's weather. On the land's own plate, between the land and the
       figures: small fires still burning in the ruins (a flame, a warm glow, a thin column of smoke leaning with the wind), far dust and the horizon's heat (fxD: every
       desert shot); and for 2.2 / 2.3 a heavy grade (the sky from near-black down through deep burnt orange: gradeD, behind the land; the land darkened toward its
       edges: fxD2) with thick dust blowing through the ruins. In front of everything (screen space: atmo 'storm' / 'wind'): embers streaming on the wind, big near
       wisps low across the ground, slow eddies of ash, a low vignette. One wind, left to right, everywhere. */
    d: { n: '2', name: 'The ash desert', rig: 'st2d', sky: 'haze', km: 1, depth: 1, atmo: 'wind', over: [],
         under: [ { key: 'gradeD', fx: 'gradeD', pos: [.5, 1, 1, AR], z: 0, label: 'The storm’s dark over the sky: near-black above, deep burnt orange toward the horizon (code, behind the land)' },
                  A('landD', 'story2-desert-land', [.5, 1, 1], { z: 1, label: 'The ruins and the dunes' }),
                  { key: 'fxD', fx: 'desert', pos: [.5, 1, 1, AR], z: 1, label: 'Small fires in the ruins with their glow and wind-bent smoke, far dust, heat on the horizon (code, on the land)' },
                  { key: 'fxD2', fx: 'desert2', pos: [.5, 1, 1, AR], z: 1, label: 'The storm on the land: a darker grade and thick dust blowing through the ruins (code, on the land)' } ] },
    o: { n: '3', name: 'The dragon oasis', rig: 'st2o', sky: 'blue', km: 1.12, depth: 1.1, atmo: 'oasis', over: [],
         under: [ A('landO', 'story2-oasis-land', [.5, 1 - LIFT, 1], { k: 1, d: .92, z: 1, label: 'The oasis, lifted a little so its pools clear the ledge' }),
                  { key: 'oasisFx', fx: 'oasis', pos: [.5, 1 - LIFT, 1, AR], k: 1, d: .92, z: 1, label: 'Embers off the lava, foam at the falls, snow on the ice (code, on the land)' },
                  A('ledge', 'story2-oasis-fg', [.5, 1.0, 1.14], { z: 2, label: 'The sandy cliff ledge the figures stand on (st2-14: raised, so there is sand behind and under every foot)' }) ] } };
  /* the three habitats (st2-5): each its own painted land (the sky cut out), scaled a little about its bottom edge so the ledge the figures stand on
     sits on the feet line; the effects ride the land (fxHtml: positions are fractions of the land art) */
  SETS.o.fly = 'clips';   // st2-14: every sky's dragons are the flapping clips (FLYSETS: which of the three fly where); no still dragon flies anywhere
  SETS.hi = { n: '3', fly: 'ice', name: 'The ice cliffs', rig: 'st2hi', sky: 'blue', km: 1, depth: 1, atmo: null, over: [],
    under: [ A('landHI', 'story2-habitat-ice-land', [.5, 1, 1.16], { z: 1, label: 'The ice cliffs, with the snowy ledge' }), { key: 'fxHI', fx: 'snow', pos: [.5, 1, 1.16, AR], z: 1, label: 'Snow falling over the ice, glints on the cliffs (code, on the land)' } ] };
  SETS.hp = { n: '3', fly: 'water', name: 'The pools', rig: 'st2hp', sky: 'blue', km: 1, depth: 1, atmo: 'oasis', over: [],
    under: [ A('landHP', 'story2-habitat-pools-land', [.5, 1, 1.18], { z: 1, label: 'The waterfalls and pools, with the grassy bank' }), { key: 'fxHP', fx: 'pools', pos: [.5, 1, 1.18, AR], z: 1, label: 'Foam and splashes at the waterfall feet, mist over the pools (code, on the land)' } ] };
  SETS.hl = { n: '3', fly: 'fire', name: 'The lava fields', rig: 'st2hl', sky: 'ember', km: 1, depth: 1, atmo: 'embers', over: [],
    under: [ A('landHL', 'story2-habitat-lava-land', [.5, 1, 1.2], { z: 1, label: 'The lava fields, with the dark rock shelf (st2-16: scaled about its bottom edge so the shelf’s top is at ~.60 of the board: Ember’s belly and paws, and every foot, rest on rock)' }), { key: 'fxHL', fx: 'lava', pos: [.5, 1, 1.2, AR], z: 1, label: 'Embers rising and small flames flickering over the lava (code, on the land)' } ] };
  var MOUNT39 = [.5, OY, .27, 900 / 830];   // where the mount stands in 3.9 (its feet on the ledge) · st2-25 · D8 (Joe: Clive must be FACING Joe as he flies off, and Clive is never mirrored): the shot is restaged left to right as Joe, the mount (facing right, as drawn), Clive (facing left, as drawn: toward them). It was Joe, Clive, mount: Clive had his back to the take-off.
  var PORTAL = [.725, .635, .25, .8];   // the arch, as painted on the wasteland land
  var GY = FEET - .002;                 // where the figures stand in the habitats (on the ledge / bank / shelf: each land is scaled so its ground runs well above this line)
  var GYE = GY - .005;                  // st2-17: Ember's ground line in the lava shots, a few px higher: at 1366×768 her belly and the little one's feet touched the banner's top edge
  var CLAVA = [.795, GY - .052];   // st2-18: where Clive stands in the lava shots once he has woken Ember: on the rock behind her (her back hides his legs), as he is drawn: facing left, toward Joe. He is never mirrored.
  var SHYAT = [.845, GY - .005, .1, 819 / 1122];   // st2-16: the shy little red one: nearer the camera (lower on screen, bigger), on the rock, in front of Ember’s near edge
  var SHOTS = {
    /* ---- Scene 1 · the wasteland ---- */
    '1.1': { set: 'w', cam: { x: .62, z: 1 }, file: 'bg-wasteland', puff: 'joe', layers: [
      JX('confused-stance', .56, { label: 'Joe, just landed, dazed (the ash still settling)', name: 'joe-land' }) ] },
    '1.2': { set: 'w', cam: { x: .61, z: 1.32 }, file: 'bg-wasteland', ints: [{ key: 'portal', react: 'nope', need: 1, hint: 'Tap the portal', pill: 'Hmm...it’s out of power.', joe: 'concerned-stance' }], layers: [
      HOT('portal', 'The dead portal (painted into the land): the press area', PORTAL, { tap: true }),
      JX('concerned-standing', .56, { label: 'Joe, looking around', name: 'joe-dust' }) ] },
    /* st2-14 (Joe): Grik flies in and talks alien (his talking clip, for as long as that bubble is up); then CONFUSED with no bubble for a beat, and still confused for
       his next two lines; from 'Not gonna introduce yourself' on he is the calm hovering still until he leaves. The confused still is sized and placed so his hat sits
       where the hovering one's does (measured from the art: the hat brim is 676 px of the 900 px hover still, 733 px of the 805 px confused one). */
    '1.3': { set: 'w', cam: { x: .615, z: 1.36 }, file: 'bg-wasteland', layers: [
      JX('confused-standing', .56, { label: 'Joe, staring', name: 'joe-startled' }),
      GRIK(.68, .535, .078, { label: 'Grik flies in and hovers nose to nose, talking fast', name: 'grik-hover', flip: true, cls: 'st2flyin' }) ] },
    '1.3a': { set: 'w', cam: { x: .615, z: 1.36 }, file: 'bg-wasteland', layers: [
      JX('confused-standing', .56, { label: 'Joe, staring', name: 'joe-startled' }),
      B('grik', 'Grik, confused: he tilts his head', 'grik-confused', 'clip', [.6734, .588, .0644, 805 / 1105], { src: 'story2-grik-confused', cls: 'st2hov', flip: true }) ] },
    '1.3b': { set: 'w', cam: { x: .615, z: 1.36 }, file: 'bg-wasteland', layers: [
      JX('concerned-stance', .56, { label: 'Joe, listening', name: 'joe-listen' }),
      GRIK(.68, .535, .078, { label: 'Grik, hovering nose to nose', name: 'grik-hover', flip: true }) ] },
    /* 1.4: he says his goodbye hovering, then story2-grik-exit plays ONCE over him (he looks round, draws his swords and flies off, shrinking): the clip's frame is laid
       so its first frame's hat sits on the hovering still's hat at the same size (brim 454 px of the 1278 px frame ↔ 676 px of the still), it comes in on top during a
       small hop, and only then is the still dropped. exit.at = ms into the shot. */
    '1.4': { set: 'w', cam: { x: .66, nx: .615, z: 1.2 }, file: 'bg-wasteland', atmo: 'dust', exit: { key: 'grikExit', still: 'grik', at: 2500 }, layers: [
      JX('confused-standing', .56, { label: 'Joe, left standing', name: 'joe-left' }),
      GRIK(.68, .535, .078, { label: 'Grik, hovering (until his exit clip takes over)', name: 'grik-hover', flip: true }),
      B('grikExit', 'Grik looks round, draws his swords and flies off into the distance', 'grik-exit', 'clip', [.6761, .5772, .1649, 1278 / 720], { vid: 'story2-grik-exit', hold: true, flip: true, hide: true, cls: 'st2wait' }) ] },

    /* ---- Scene 2 · the ash desert ---- */
    '2.1': { set: 'd', omit: ['gradeD', 'fxD2'], cam: { x: .56, nx: .62, z: 1.25, from: { x: .3, nx: .3 }, ms: 3700, wait: 150 }, file: 'bg-desert', linger: 2400, rate: { joe: 1.2 }, layers: [   /* st2-20 (Joe: too long before the Trogdor thought): a brisker walk (clip x1.2, carried in over 3.4s, was 4.1), a 3.7s pan (was 4.6) and a 2.4s hold after the line */
      B('joe', 'Joe walks in from the left and trudges up to the well', 'joe-walk-in', 'clip', [.674, .757, .447, 16 / 9], { vid: 'wood-joe-walkup', hold: true, cls: 'st2walk', css: 'filter:brightness(1.06) saturate(.92)', tint: C('JOE'), p1: true }) ] },
    /* st2-18 (Joe: never mirror Joe or Clive: the J on his shield read backwards): Joe stands LEFT of the well, facing right as he is drawn, the signpost to his right;
       the big sign swings up in the top-RIGHT gap (it stays until Next on his thought); his thought sits over him, clear of it */
    '2.2': { set: 'd', atmo: 'storm', pocket: [.33, .4], cam: { x: .52, nx: .47, z: 1.4 }, cut: true, file: 'bg-desert', ints: [{ key: 'sign', react: 'sign', anchor: true }], layers: [
      HOT('sign', 'The burnt signpost (painted into the land): the press area', [.591, .65, .085, .85], { tap: true }),
      JX('concerned-stance', .40, { label: 'Joe by the well, thinking, looking up at the signpost', name: 'joe-well' }) ] },
    '2.3': { set: 'd', atmo: 'storm', pocket: [.66, .42], cam: { x: .8, nx: .8, z: 1.5 }, file: 'bg-desert', layers: [
      B('nest', 'Scorched dragon’s nest, two empty hollows', 'nest-scorched', 'still', [.865, .712, .07, 900 / 791], { src: 'story2-nest-scorched', css: '-webkit-mask-image:linear-gradient(180deg,#000 70%,transparent 99%);mask-image:linear-gradient(180deg,#000 70%,transparent 99%)' }),   // its foot feathers into the ash
      INSPECT_POINT ? JCLIP(INSPECT.vid, .765, { label: 'Joe bends to inspect the nest (story2-joe-inspect-point, first part)', name: 'joe-inspect' }) : JX('sad-standing', .765, { label: 'Joe, looking down at the nest', name: 'joe-nest' }) ] },   // (SLOT: INSPECT_POINT)
    /* 2.4 (st2-14, Joe): the far oasis SITS on the dunes at the horizon, half out of frame at the right: the real oasis art, small and hazy, on the land's own plate
       (same depth and pan as the land: it cannot slide against it) and BEHIND the land, so the dune ridge cuts its foot; its left and top edges feather into the sky.
       The shot opens wide on Joe, then pushes slowly toward it. */
    '2.4': { set: 'd', omit: ['gradeD', 'fxD2'], cam: { x: .8, nx: .86, z: 1.26, keep: .545, from: { x: .72, nx: .64, z: 1.03 }, ms: 7200, wait: 1500 }, file: 'bg-desert', pointAt: [2300, .62], layers: [
      B('glow', 'A teal glow on the horizon', 'oasis-glow', 'fx', [.985, .62, .36, 2.2], { glow: '#5fe0c8', d: 1, k: 1, z: 0 }),
      B('mirage', 'The distant oasis: the real oasis art, small, hazy, wobbling in the heat, sitting behind the dune ridge', 'oasis-far', 'fx', [1.0, .615, .23, AR], { src: 'story2-oasis-land', cls: 'st2mirage', d: 1, k: 1, z: 0,
        css: 'filter:blur(1px) saturate(.72) brightness(1.14) opacity(.66);-webkit-mask-image:linear-gradient(90deg,transparent 3%,#000 30%),linear-gradient(180deg,transparent 2%,#000 26%);-webkit-mask-composite:source-in;mask-image:linear-gradient(90deg,transparent 3%,#000 30%),linear-gradient(180deg,transparent 2%,#000 26%);mask-composite:intersect' }),
      INSPECT_POINT ? JCLIP(INSPECT.vid, .62, { label: 'Joe points at the horizon (story2-joe-inspect-point, second part), then drops to his knees', name: 'joe-point' }) : J('kneel', .62, { s: .93, label: 'Joe on his knees', name: 'joe-kneel' }) ] },   // (SLOT: INSPECT_POINT)   // (Part One's kneel: no kneeling pose in the new set; ×.93 = his head the size it is in the expression stills)

    /* ---- Scene 3 · the dragon oasis (the turning point) ---- */
    /* 3.1 (st2-7): ONE letterboxed pan across Joe's living oasis clip (story2-oasis-live.mp4: opaque, 2560×1440, a true seamless 17.5 s loop, camera locked; lava left,
       falls and pool in the middle, ice right). It plays with the video's own looping (no code cross-fade). The clip is cover-fitted a little large (130vw, or the full
       height on a narrow screen, where the pan then covers more of the picture) and travels once from the lava side to the ice side over the narration, easing in and out. */
    /* st2-10 (Joe: nothing small flies across the screen): two small groups HOVER in the sky of the panned picture, each in one place in the picture, so it is
       the pan that carries them through the view:
         fire  (story2-flyers-fire: three red dragons side by side) high over the volcano, the smaller and farther (~7.5% of the visible width at 1440), hazed
               a touch, with at most a tiny drift;
         play  (story2-flyers-water-play: three bright-blue water dragons in a row, playing; one loops the loop) over the falls, right of the falls,
               so the pan finds them around its midpoint: small (~13% of the visible width at 1440), full colour.
       size = the group's width as a fraction of the picture's · x = where it hovers in the picture · y = how far under the upper bar (fraction of the screen's
       height: measured on the screen, so the groups stay just under the bar however the picture is framed) · bob = [seconds, % of its own height] · k = how
       much of the pan it shares (1 = fixed to the picture) · drift = a fraction of the picture's width over the whole pan · op = its haze.
       black (story2-flyer-black, looped at 87 frames): the one thing that travels. A large black dragon, near the camera, moving VERY slowly left to right
       (ms to cross the visible frame), heavy and unhurried, on a slow rise and dip, entering `at` of the way through the pan, under the hovering groups and
       above the banner. Anchored to the screen, not to the picture. Two thin wisps of smoke trail from his nostrils (nose: where they are in his clip's
       frame; beats: the clip times of his wing downbeats, when a slightly bigger puff comes). The line holds ~14s, so he is well past the middle before it
       moves on. (st2-21: total = his whole pass, edge to edge, in ms: 9.4 s from the pan's midpoint, so he has left before the dip to 3.2.) size = his length as a fraction of the visible width; body = how much of the clip's frame his length takes. */
    '3.1': { live: 'story2-oasis-live', sky: 'blue', bars: true, keep: .8, pan: 16000, panHold: 1500, file: 'oasis-live',   /* st2-20: a 16s pan (was 12), 1.5s held on the ice side, then on to 3.2 by itself: the line's time is the pan's (buildBeats) */
      explore: {   // the things to press while it pans: picture fractions [centre x, centre y, w, h]
        eggs: [[.2655, .500, .036, .082], [.2925, .518, .036, .078], [.5825, .535, .036, .082], [.6125, .550, .036, .064], [.9645, .618, .034, .086], [.9900, .632, .022, .068]],   // lava nest (pink, orange) · pool nest (blue, purple) · ice nest (pale blue, purple at the edge)
        dragons: [[.148, .645, .075, .105, 'lava'], [.555, .69, .11, .13, 'water'], [.70, .715, .12, .13, 'water'], [.857, .588, .058, .105, 'snow']] },   // the red one in the lava · the two in the pool · the white one in the snow
      flocks: [
        { vid: 'story2-flyers-fire', w: 1254, h: 422, size: .058, x: .15, y: .012, drift: .012, bob: [4.3, 20], k: .94, op: .85 },
        { vid: 'story2-flyers-water-play', w: 1224, h: 668, size: .1, x: .76, y: 0, bob: [5.2, 12], k: 1, op: 1 } ],   // (x .76: right of the falls, so the pan finds them around its midpoint and the black dragon's raised wings only reach them after the line has moved on)
      black: { vid: 'story2-flyer-black', w: 1140, h: 1054, loop: 87 / 24, body: .73, size: .215, at: .5, ms: 11000, total: 9400, nose: [.757, .408], beats: [1.2, 3.05] }, layers: [] },
    /* 3.2 → 3.3 (st2-14, Joe's staging): Joe further LEFT and smaller (S3), Clive fades in right of him, centre-left, the same scale; the dragons are bigger than
       them and together on the RIGHT half, all standing on the sand of the ledge: BLACK the biggest, at the back; EARTH and RED in front of him; FROST at the front,
       the smallest, about Joe's height (DRAG / FROSTAT below). While the sword is up they are angry and puffing (a tremble, a small lunge, smoke from the nostrils);
       as Clive shouts they swap to calm (the calm still fades in on top, then the angry one is dropped) and breathe slowly; Joe sheathes (story2-joe-sword-sheath, on
       the draw clip's own box), and in 3.3 he stands (the expression stills, at the clip's own scale and feet). */
    '3.2': { set: 'o', dip: [300, 450], cam: { x: .52, nx: .6, z: 1.03, from: { nx: .22 }, ms: 2600, wait: 1700 }, file: 'bg-oasis', frost: 'angry', smoke: ['black', 'earth', 'red'],   /* (a narrow screen cannot hold Joe and the dragons at once: it opens on Joe, then travels to what his sword points at as it rises; a wide one does not move) */   /* dip: out of the living clip through a short black (the engine's own dip: the shot swaps under it) */ after: { key: 'joe', act: 'swordHold' }, off: { CLIVE: .4 }, layers: [
      DRG('black', 'angry'), DRG('earth', 'angry'), DRG('red', 'angry'), FROST('angry'),
      JCLIP('story2-joe-sword-draw', JOE3, { s: S3, by: OY, label: 'Joe goes wide-eyed and draws his sword, trembling', name: 'joe-sword' }) ] },
    '3.2b': { set: 'o', cam: { x: .52, nx: .62, z: 1.03 }, file: 'bg-oasis', frost: 'settle', smoke: ['black', 'earth', 'red', 'blackCalm'], calmAt: 2700, sheathAt: 2400, handsAt: 4100, keepAct: true, off: { CLIVE: .4 }, layers: [   // 'Put that down!': the frost dragon roars once, Joe sheathes, the dragons settle
      DRG('black', 'angry'), DRG('earth', 'angry'), DRG('red', 'angry'), FROST('settle'),
      JCLIP('story2-joe-sword-draw', JOE3, { s: S3, by: OY, label: 'Joe lowers the sword and sheathes it', name: 'joe-sheath' }) ] },
    '3.3': { narOff: true, set: 'o', cam: { x: .52, nx: .27, z: 1.03 }, file: 'bg-oasis', frost: 'calm', smoke: ['blackCalm'], enter: { key: 'clive' }, layers: [   // (the same framing as 3.2: the camera does not move as Clive arrives)
      DRG('black', 'calm'), DRG('earth', 'calm'), DRG('red', 'calm'), FROST('calm'),
      JX('calm-hands-up', JOE3, { s: S3, by: OY, label: 'Joe, sword away, hands up, apologetic', name: 'joe-blank' }),
      CLIVE(.345, { s: S3, by: OY, label: 'Clive fades in, arms folded (then the long sigh)', name: 'clive-arrive' }) ] },
    /* the three habitats, each on its own land */
    '3.4': { set: 'hi', cam: { x: .5, nx: .66, z: 1.06 }, file: 'bg-habitat-ice', ints: [{ key: 'iceDragon', react: 'statue', need: 1, hint: 'Tap the ice dragon', show: 'statue', grow: true, jet: { kind: 'frost', from: [.05, .27], to: 'statue', at: [.5, .3] }, after: { iceDragon: 'sit' }, more: ['A tiny ice Grik', 'A snowflake crown'] }], layers: [
      DR('iceBg', 'A second ice dragon, watching from the frozen lake', 'dragon-ice-bg', 'story2-dragon-ice-bg', [.6055, .6045, .085, 900 / 978], { z: 2 }),
      DRP('iceDragon', 'The ice dragon: standing as Joe meets her, sitting once she has made the statue', 'dragon-ice', 'ice', 'stand', .78, GY, { tap: true }),
      B('statue', 'The ice statue of Joe she carves: as tall as he is, right beside him', 'ice-statue', 'still', [.305, GY + .004, JH * 568 / 1148, 568 / 1148], { src: 'story2-ice-statue', hide: true }),
      JX('cautious-peace', .17, { by: GY, label: 'Joe hangs back, one hand out', name: 'joe-wary' }),
      CLIVES(.455, { by: GY, label: 'Clive', name: 'clive-ice' }) ] },
    '3.5': { narOff: true, set: 'hp', cam: { x: .5, nx: .5, z: 1.08 }, file: 'bg-habitat-pools', ints: [{ key: 'waterDragon', react: 'squirt', need: 1, hint: 'Tap the water dragon', aim: 'calm-hands-up', jet: { kind: 'water', from: [.06, .37], to: 'joe', at: [.545, .31] } }], layers: [
      DR('waterBg2', 'A water dragon, watching from the pool', 'dragon-water-bg2', 'story2-dragon-water-bg2', [.447, .594, .085, 900 / 861], { z: 2, css: RING }),
      DR('waterBg1', 'Another water dragon, watching', 'dragon-water-bg1', 'story2-dragon-water-bg1', [.852, .6365, .1, 849 / 1053], { z: 2, css: RING }),
      DR('waterDragon', 'The water dragon rises out of his ring of water', 'dragon-water', 'story2-dragon-water', [.669, .668, .24, 900 / 959], { tap: true, z: 2, css: RING, cls: 'st2rise' }),
      JX('confused-stance', .19, { by: GY, label: 'Joe, baffled, then splashed, then laughing', name: 'joe-splashed' }),
      CLIVES(.36, { by: GY, label: 'Clive', name: 'clive-pools' }) ] },
    '3.6': { narOff: true, set: 'hl', cam: { x: .5, nx: .56, z: 1.06 }, file: 'bg-habitat-lava', smoke: ['emberAsleep'], layers: [
      DR('shy', 'A smaller, shy red dragon, watching Joe and Ember', 'dragon-shy', 'story2-dragon-shy', SHYAT, { z: 4, flip: true }),
      DR('ember', 'Ember the fire dragon, curled up asleep', 'ember-asleep', 'story2-ember-asleep', [.705, GYE, .28, 900 / 589]),
      CLIVES(.42, { by: GY, label: 'Clive, by Ember (he wakes her gently)', name: 'clive-lava' }),
      JX('nervous-standing', .2, { by: GY, label: 'Joe keeps well back', name: 'joe-back' }) ] },
    /* 3.6b (st2-14): Joe CENTRE stage, shaking, the flashback large above his head (Part One's village on fire); Clive now behind him (he fades across: no slide);
       Ember lifts her head (lying, awake, wary), snarls (a code tremble) and smokes at the nostrils. Three presses (or a hold) bring Joe to her; at the touch the
       flashback fades and he reaches out (the reach art comes in on top of him, then he is dropped); 3.6t = the touch; then she goes back to sleep (3.6c, on the
       narration's last words) and he stands, hand on heart. */
    '3.6b': { set: 'hl', cam: { x: .5, nx: .45, z: 1.06 }, file: 'bg-habitat-lava', narComp: '3.6t', narTrig: [{ at: 'went back', comp: 's2_3.6c' }], smoke: ['emberLying'], ints: [{ key: 'ember', react: 'pet', need: 3, hold: 1100, hint: 'Press and hold to reach out (or tap three times)', hide: ['flash'], swap: { joe: 'reach' }, huff: 'emberLying', after: { clive: 'startled' }, walk: { key: 'joe', by: .018, face: 'approaching' } }], layers: [
      DR('shy', 'A smaller, shy red dragon, watching Joe and Ember', 'dragon-shy', 'story2-dragon-shy', SHYAT, { z: 4, flip: true }),
      DR('ember', 'Ember, lying awake, wary: a low snarl', 'ember-lying', 'story2-ember-lying', [.705, GYE, .28, 900 / 707], { tap: true, cls: 'st2snarl' }),
      CLIVES(CLAVA[0], { by: CLAVA[1], z: 2, label: 'Clive, round behind Ember now, looking across her at Joe', name: 'clive-lava' }),
      { key: 'flash', fx: 'flash', pos: [.475, .4, .31, 16 / 9], z: 4, label: 'The flashback above Joe’s head, large: Trogdor burning the village (Part One’s village board + his fire clip, soft-edged, wobbling)' },
      JX('nervous-stance', .45, { by: GY, cls: 'st2shake', still: true, label: 'Joe, centre stage, shaking; he edges closer', name: 'joe-shake' }) ] },
    '3.6t': { set: 'hl', cam: { x: .5, nx: .52, z: 1.06 }, file: 'bg-habitat-lava', smoke: ['emberLying'], layers: [   // the touch
      DR('shy', 'A smaller, shy red dragon, watching', 'dragon-shy', 'story2-dragon-shy', SHYAT, { z: 4, flip: true }),
      DR('ember', 'Ember accepts the touch', 'ember-lying', 'story2-ember-lying', [.705, GYE, .28, 900 / 707]),
      CLIVES(CLAVA[0], { by: CLAVA[1], z: 2, label: 'Clive, startled', name: 'clive-lava', pose: 'startled' }),
      JREACH(.5055, GY) ] },
    '3.6c': { set: 'hl', cam: { x: .5, nx: .52, z: 1.06 }, file: 'bg-habitat-lava', smoke: ['emberAsleep'], layers: [   // …and she goes back to sleep
      DR('shy', 'A smaller, shy red dragon, watching', 'dragon-shy', 'story2-dragon-shy', SHYAT, { z: 4, flip: true }),
      DR('ember', 'Ember, asleep again', 'ember-asleep', 'story2-ember-asleep', [.705, GYE, .28, 900 / 589]),
      CLIVES(CLAVA[0], { by: CLAVA[1], z: 2, label: 'Clive, behind Ember', name: 'clive-lava' }),
      JX('emotional-stance', .5055, { by: GY, label: 'Joe, hand on heart', name: 'joe-relief' }) ] },
    /* 3.6d (st2-14, Joe): Joe's tavern cheer with the sword (Part One's story-tav-joe-huzzah, played up to the sword at the top, then frozen: freeze = s into the clip);
       Clive: 'Ahem.'; then a much smaller huzzah, hands only (HUZZAH_HANDS: the clip Joe is making, on the same plate; until it lands, a stand-in in code). */
    '3.6d': { set: 'hl', cam: { x: .5, nx: .5, z: 1.06 }, file: 'bg-habitat-lava', smoke: ['emberAsleep'], freeze: { key: 'joe', at: 2.7 }, layers: [
      DR('shy', 'A smaller, shy red dragon, watching', 'dragon-shy', 'story2-dragon-shy', SHYAT, { z: 4, flip: true }),
      DR('ember', 'Ember, asleep', 'ember-asleep', 'story2-ember-asleep', [.705, GYE, .28, 900 / 589]),
      CLIVES(CLAVA[0], { by: CLAVA[1], z: 2, label: 'Clive, unimpressed, behind Ember', name: 'clive-lava' }),
      JCLIP('tav-joe-huzzah', .5055, { by: GY, p1: true, label: 'Joe’s cheer: the sword goes up (then a much smaller one, hands only)', name: 'joe-huzzah' }) ] },
    '3.7': { narOff: true, set: 'o', cam: { x: .53, nx: .56, z: 1.08 }, file: 'bg-oasis',   /* (after the pick Clive hands him the backpack: his -pack picture comes in over him: the same pose, the same canvas) */ ints: [{ key: 'eggFrost', react: 'choose' }, { key: 'eggFire', react: 'choose' }], layers: [
      B('nest', 'The cosy straw nest beside Clive', 'egg-nest', 'still', [.555, OY + .028, .15, 900 / 455], { src: 'story2-egg-nest' }),
      B('eggFrost', 'The frost egg, in the nest', 'egg-frost', 'clip', [.527, OY - .008, .04, 784 / 1042], { src: 'story2-egg-frost', cls: 'st2egg', tap: true, css: EGGSIT }),
      B('eggFire', 'The fire egg, in the nest', 'egg-fire', 'clip', [.585, OY - .008, .04, 840 / 1086], { src: 'story2-egg-ember', cls: 'st2egg', tap: true, css: EGGSIT }),
      CLIVES(.675, { s: S3, by: OY, label: 'Clive, by the nest (then he hands Joe the backpack)', name: 'clive-eggs' }),
      JX('happier-standing', .41, { s: S3, by: OY, label: 'Joe, calmer now', name: 'joe-calm' }) ] },
    /* 3.8: a close two-shot, reached through a short fade (dip): heads and shoulders, both chins clear of the banner. Joe's expressions change with the lines (the
       backpack is first seen in 3.9, the wide shot: the expression stills have none). */
    '3.8': { set: 'o', pack: true, dip: [380, 480], cut: true, cam: { x: .485, y: .5, z: 1.9, ty: .43 }, file: 'bg-oasis', omit: ['fly_clips'],   /* (a close shot: the far flyers would be drawn large across the faces) */ layers: [
      JX('happier-stance-pack', .415, { s: S3, by: OY, label: 'Joe, close, with the backpack: grateful, then asking, then baffled', name: 'joe-close' }),
      CLIVES(.56, { s: S3, by: OY, pose: 'present', label: 'Clive, close: proud, then put out, then crosser and crosser', name: 'clive-close' }) ] },
    /* 3.9 (st2-15): the mount stands ready, facing right (the way they will go); Joe, with the backpack, beside Clive. As the narration reaches 'of his own' he is in the
       saddle (3.9r: the standing Joe fades out where he stood and the rider fades in on the seat), and after a beat the pair lift off together (takeoffGo). */
    '3.9': { set: 'o', pack: true, dip: [380, 480], cut: true, cam: { x: .5, nx: .4, z: 1.06 }, file: 'bg-oasis', narTrig: [{ at: 'of his own', comp: 's2_3.9r' }], layers: [
      DR('mount', 'Joe’s teal flight dragon, harnessed, ready', 'mount', 'story2-mount', MOUNT39, { cls: 'st2still' }),
      CLIVES(.77, { s: S3, by: OY, label: 'Clive, at the mount’s head, facing Joe', name: 'clive-harness' }),
      JX('happier-standing-pack', .24, { s: S3, by: OY, label: 'Joe, with the backpack, ready to fly', name: 'joe-ready' }) ] },
    '3.9r': { set: 'o', pack: true, cam: { x: .5, nx: .58, z: 1.06 }, file: 'bg-oasis', takeoff: { at: 1500, ms: 2800 }, layers: [
      DR('mount', 'Joe’s teal flight dragon, with Joe in the saddle: they lift off', 'mount', 'story2-mount', MOUNT39, { cls: 'st2still' }),
      CLIVES(.77, { s: S3, by: OY, pose: 'present', label: 'Clive, waving them off (facing them)', name: 'clive-harness' }),
      RIDER('excited', MOUNT39, { label: 'Joe in the saddle, excited (the take-off)', name: 'joe-ride' }) ] },

    '4.1': { bg: null, flyers: 'mix', file: 'bg-sky', ints: [{ key: 'ring1', react: 'sparkle' }], layers: [
      RIDE('Joe on his dragon, happy in flight', 'ride-fly', [30, 34, 30, 900 / 830], 'happy'),
      L('ring1', 'Wind ring 1', 'wind-ring', 'fx', [70, 50, 7, 1], { tint: '#fff2a8', tap: true }),
      L('ring2', 'Wind ring 2', 'wind-ring', 'fx', [80, 34, 7, 1], { tint: '#fff2a8', tap: true }),
      L('ring3', 'Wind ring 3', 'wind-ring', 'fx', [88, 56, 7, 1], { tint: '#fff2a8', tap: true }),
      L('snow', 'Snow + wind streaks', 'snow', 'fx', [0, 30, 100, 3.2], { tint: '#ffffff' }) ] },
    '4.2': { bg: null, flyers: 'mix', file: 'bg-sky-castle', layers: [
      L('island', 'The floating castle, waterfalls off its edges', 'island', 'clip', [50, 30, 36, 1.2], { tint: '#9a8ad0' }),
      RIDE('Joe on his dragon, small', 'ride-small', [16, 44, 12, 900 / 830], 'happy'),
      L('clouds', 'Clouds parting', 'clouds', 'fx', [0, 24, 100, 3.4], { tint: '#ffffff' }) ] },

    '5.1': { bg: null, file: 'bg-island', ints: [{ key: 'vial', react: 'puff' }], layers: [
      L('door', 'The great wooden door', 'door', 'still', [70, 28, 16, .7], { tint: '#6a4a2a' }),
      L('staff', 'Old staffs in the ground', 'staffs', 'still', [44, 26, 12, 1.2], { tint: '#8a7a5a', tap: true }),
      L('vial', 'Broken potion vials', 'vials', 'still', [30, 24, 9, 1.6], { tint: '#7ad0c0', tap: true }),
      L('bigDragon', 'Joe’s dragon, landed', 'ride-rest', 'clip', [2, 25, 24, 900 / 830], { tint: '#6aa8d9', src: 'story2-mount' }),
      L('joe', 'Joe, wandering', 'joe-wander', 'clip', [56, 26, 9, .6], { tint: C('JOE') }) ] },
    '5.2': { bg: null, file: 'bg-island-door', off: { ELNOR: 'right' }, layers: [
      L('door', 'The door + knocker', 'door-close', 'still', [56, 20, 26, .7], { tint: '#6a4a2a' }),
      L('joe', 'Joe, reaching for the knocker', 'joe-knock', 'clip', [30, 22, 14, .6], { tint: C('JOE') }) ] },
    '5.3': { bg: null, file: 'bg-island-door', layers: [
      L('joe', 'Joe', 'joe-plead', 'clip', [24, 22, 13, .6], { tint: C('JOE') }),
      L('elnor', 'Elnor, frail, leaning on his staff', 'elnor-door', 'clip', [56, 22, 13, .55], { tint: C('ELNOR') }),
      L('blip', 'Blip, floating at his shoulder', 'blip-float', 'clip', [71, 48, 6, 1], { tint: C('BLIP') }) ] },
    '5.4': { bg: null, file: 'bg-island-garden', layers: [
      L('bigDragon', 'The dragon in a wizard hat, chasing light butterflies', 'ride-play', 'clip', [8, 25, 26, 900 / 830], { tint: '#6aa8d9', src: 'story2-mount' }),
      L('butterflies', 'Butterflies of light', 'butterflies', 'fx', [10, 46, 24, 2], { tint: '#fff2a8' }),
      L('elnor', 'Elnor, watching', 'elnor-watch', 'clip', [58, 22, 13, .55], { tint: C('ELNOR') }),
      L('blip', 'Blip', 'blip-float', 'clip', [73, 48, 6, 1], { tint: C('BLIP') }) ] },
    '5.5': { bg: null, file: 'bg-island-garden', layers: [
      L('bigDragon', 'The dragon’s head in Elnor’s hand', 'ride-nuzzle', 'clip', [22, 20, 36, 900 / 830], { tint: '#6aa8d9', src: 'story2-mount' }),
      L('elnor', 'Elnor, softened', 'elnor-soft', 'clip', [58, 20, 16, .55], { tint: C('ELNOR') }) ] },
    '5.6': { bg: null, file: 'bg-island-palm', hold: 6000, layers: [
      L('orb', 'The purple orb in Joe’s palm', 'orb-purple', 'clip', [40, 26, 20, 1], { tint: '#b46bff' }) ] },
    '5.7': { bg: null, file: 'bg-island-pack', ints: [{ key: 'egg', react: 'crack', need: 3, show: 'baby', hideSelf: true }], layers: [
      L('pack', 'The backpack, swung round', 'backpack', 'still', [34, 20, 32, 1.1], { tint: '#8a5a3a' }),
      L('egg', 'The egg, rattling (three taps)', 'egg-hatch', 'clip', [43, 40, 14, .78], { tint: '#bfe6ff', pick: true, tap: true }),
      L('baby', 'The baby dragon, hatched', 'baby-hatch', 'clip', [42, 40, 16, 1], { tint: '#bfe6ff', pick: true, hide: true, pickSrc: BABY }) ] },

    '5B.1': { bg: null, file: 'bg-island-steps', mood: '5', layers: [
      L('grik', 'Grik in his blue flying saucer', 'saucer-hover', 'clip', [52, 44, 20, 1.6], { tint: '#4a8ae0' }),
      L('joe', 'Joe on the steps, baby in the backpack', 'joe-steps', 'clip', [26, 24, 11, .6], { tint: C('JOE'), pick: true }) ] },
    '5B.2': { bg: null, file: 'bg-sky', mood: '4', hold: 3500, layers: [
      L('saucer', 'The saucer zipping through the clouds (Joe, Grik, the baby’s head)', 'saucer-fly', 'clip', [34, 40, 30, 1.6], { tint: '#4a8ae0', pick: true }),
      L('clouds', 'Clouds streaking past', 'clouds', 'fx', [0, 24, 100, 3.4], { tint: '#ffffff' }) ] },
    '5B.3': { set: 'w', cam: { x: .6, z: 1 }, file: 'bg-wasteland', hold: 3500, layers: [
      B('saucer', 'The saucer, parked in the ash', 'saucer-parked', 'still', [.40, FEET + .01, .2, 1.6], { tint: '#4a8ae0' }),
      B('joe', 'Joe, climbing out', 'joe-out', 'clip', [.545, FEET, .09, .6], { tint: C('JOE'), pick: true }),
      GRIK(.64, .50, .07, { label: 'Grik', name: 'grik-hover' }) ] },
    '5B.4': { set: 'w', cam: { x: .66, z: 1.3 }, file: 'bg-wasteland', ints: [{ key: 'portal', react: 'light', need: 1, secret: 'st2-portal', pill: 'The runes blaze purple', show: 'blaze' }], layers: [
      B('blaze', 'The arch: runes flicker, then blaze purple', 'portal-relight', 'clip', [.725, .66, .3, .82], { glow: '#b46bff', hide: true, z: 2 }),
      HOT('portal', 'The arch (painted into the board): the press area', PORTAL, { tap: true }),
      B('joe', 'Joe, holding the orb up', 'joe-orb', 'clip', [.56, FEET, .1, .6], { tint: C('JOE') }) ] },
    '5B.5': { set: 'w', cam: { x: .7, z: 1.15 }, file: 'bg-wasteland', hold: 3000, layers: [
      B('blaze', 'The portal, roaring', 'portal-lit', 'clip', [.725, .66, .3, .82], { glow: '#b46bff', z: 2 }),
      B('saucer', 'The saucer, left behind', 'saucer-parked', 'still', [.36, FEET + .01, .2, 1.6], { tint: '#4a8ae0' }),
      B('joe', 'Joe and Grik leaping in', 'leap', 'clip', [.655, .66, .13, 1.2], { tint: C('JOE') }) ] },

    '6.1':  { reuse: 'woodland', file: '(Part One: story-wood-bg + its riders)', layers: [
      L('grik', 'Grik, tumbling out beside Joe', 'grik-tumble', 'clip', [44, 46, 6, 1], { tint: C('GRIK') }) ] },
    '6.1b': { reuse: 'hills', file: '(Part One: story-hills-bg + the ride)', layers: [
      L('grik', 'Grik, keeping up', 'grik-fly', 'clip', [58, 48, 6, 900 / 680], { tint: C('GRIK'), src: 'story2-grik-fly', cls: 'st2hov' }) ] },

    '8.1': { bg: 'cas-bg', bgFx: 'brightness(.8) sepia(.2)', file: '(Part One: story-cas-bg)', layers: [
      L('trogdor', 'Trogdor, pacing, flames licking (Part One’s castle clip)', 'trogdor-pace', 'clip', [0, 0, 0, 1], { real: 'castle1:cdragon' }),
      L('joe', 'Joe marching up, backpack on', 'joe-march', 'clip', [16, 24, 11, .6], { tint: C('JOE'), pick: true }),
      L('grik', 'Grik, sword drawn', 'grik-ready', 'clip', [29, 24, 8, 900 / 811], { tint: C('GRIK'), src: 'story2-grik-stand' }) ] },
    '8.2': { bg: 'cas-bg', bgFx: 'brightness(.8) sepia(.2)', file: '(Part One: story-cas-bg)', ints: [{ key: 'pack', react: 'open', need: 1, show: 'baby' }], layers: [
      L('pack', 'The backpack, set down', 'backpack-down', 'still', [36, 22, 18, 1.1], { tint: '#8a5a3a', tap: true }),
      L('baby', 'The baby dragon climbs out, scared', 'baby-out', 'clip', [50, 24, 12, 1], { tint: '#bfe6ff', pick: true, hide: true, pickSrc: BABY }) ] },
    '8.3': { bg: 'cas-bg', bgFx: 'brightness(.8) sepia(.2)', file: '(Part One: story-cas-bg)', off: { JOE: 'left' }, layers: [
      L('trogdor', 'Trogdor, close: frozen mid-roar, eyes wide', 'trogdor-freeze', 'clip', [40, 16, 46, 1.2], { tint: C('TROGDOR') }),
      L('smoke', 'The flame fizzles to a puff of smoke', 'fizzle', 'fx', [30, 40, 12, 1], { tint: '#b8b0b0' }) ] },
    '8.4': { bg: 'cas-bg', bgFx: 'brightness(.8) sepia(.2)', file: '(Part One: story-cas-bg)', layers: [
      L('trogdor', 'Trogdor lowers his head, eyes welling up', 'trogdor-sniff', 'clip', [50, 20, 38, 1.3], { tint: C('TROGDOR') }),
      L('baby', 'The baby crawls across the ash', 'baby-crawl', 'clip', [34, 22, 11, 1], { tint: '#bfe6ff', pick: true, pickSrc: BABY }) ] },
    '8.5': { bg: 'cas-bg', bgFx: 'brightness(.9) sepia(.1)', file: '(Part One: story-cas-bg)', hold: 5000, ints: [{ key: 'dance', react: 'hearts' }], layers: [
      L('dance', 'Trogdor and the baby dancing', 'dance', 'clip', [30, 20, 44, 1.5], { tint: C('TROGDOR'), pick: true, tap: true }) ] },
    '8.6': { bg: 'cas-bg', bgFx: 'brightness(.9) sepia(.1)', file: '(Part One: story-cas-bg)', layers: [
      L('trogdor', 'Trogdor bows low', 'trogdor-bow', 'clip', [50, 20, 38, 1.3], { tint: C('TROGDOR') }),
      L('joe', 'Joe, holding up the harness', 'joe-harness', 'clip', [22, 24, 12, .6], { tint: C('JOE') }) ] },

    '9.1': { bg: 'vil-bg', bgFx: 'brightness(1.5) saturate(1.1)', file: 'bg-village-rebuilt', layers: [
      L('shadow', 'A huge shadow sweeping over', 'shadow', 'fx', [10, 20, 80, 3.6], { tint: '#101018' }),
      L('villager', 'The pitchfork guy, running', 'villager-run', 'clip', [22, 24, 11, .7], { tint: C('VILLAGER') }),
      L('curly', 'The curly kid, pointing up', 'curly-point', 'clip', [44, 24, 8, .7], { tint: C('CURLY KID') }),
      L('crowd', 'The bonnet lady + the old man, scattering', 'villagers-scatter', 'clip', [62, 24, 18, 1.3], { tint: '#b9a26a' }) ] },
    '9.2': { bg: 'vil-bg', bgFx: 'brightness(1.5) saturate(1.1)', file: 'bg-village-rebuilt', ints: [{ key: 'trogdor', react: 'lanterns' }], layers: [
      L('trogdor', 'Trogdor landing, harnessed: Joe on his back, the baby on his head', 'trogdor-ride', 'clip', [34, 20, 44, 1.3], { tint: C('TROGDOR'), pick: true, tap: true }),
      L('grik', 'Grik, hovering', 'grik-hover', 'clip', [80, 52, 7, 900 / 680], { tint: C('GRIK'), src: 'story2-grik-fly', cls: 'st2hov', flip: true }),
      L('lanterns', 'Village lanterns (lit one by one)', 'lanterns', 'fx', [6, 44, 22, 3], { tint: '#ffd36a' }) ] },

    '10.1': { bg: 'vil-bg', bgFx: 'brightness(1.5) sepia(.35) saturate(1.3)', file: 'bg-village-square', layers: [
      L('bunting', 'Bunting, lanterns, confetti', 'bunting', 'fx', [0, 60, 100, 6], { tint: '#ffd36a' }),
      L('trogdor', 'Trogdor, proud, the baby beside him', 'trogdor-proud', 'clip', [54, 22, 30, 1.3], { tint: C('TROGDOR'), pick: true }),
      L('joe', 'King Joe, crowned', 'joe-king', 'clip', [38, 24, 11, .6], { tint: C('JOE') }),
      L('clive', 'Clive, the second egg on a velvet pillow', 'clive-pillow', 'clip', [14, 24, 12, .62], { tint: C('CLIVE'), pick: true }),
      L('grik', 'Grik, doing laps overhead', 'grik-laps', 'clip', [46, 64, 5, 1], { tint: C('GRIK') }),
      L('crowd', 'The whole village', 'crowd', 'clip', [0, 18, 100, 6], { tint: '#b9a26a', z: 1 }) ] },
    '10.2': { bg: null, file: 'live-room (live action video)', card: 'Live action', mood: 'live', layers: [] },
    '10.3': { bg: null, file: 'live-close (live action video)', card: 'Live action', mood: 'live', hold: 3500, layers: [] }
  };
  var ACH_IDS = { 'st2-nest': 1, 'st2-egg': 1, 'st2-orb': 1, 'st2-portal': 1, 'st2-end': 1, 'st2-blip': 1 };
  var ORB_CURSOR = 'orb';   // TODO(art + jj-companion.js): the purple orb cursor's id once it exists in CURSORS (gate: 'st2-orb'); ?orb=1 stands in for it in the preview

  /* ---- node (make-assets.js) only wants the data ---- */
  if (typeof module !== 'undefined' && module.exports) { module.exports = { LIVE: Object.keys(SHOTS).filter(function (k) { return SHOTS[k].live; }), STILLS: STILLS, UPSCALE: UPSCALE, CLOSE_Z: CLOSE_Z, POSES: POSES, JH: JH, AR: AR, S: S, CAST: CAST, SHOTS: SHOTS, MOOD: MOOD, NAR: NAR, BUB: BUB, SETS: SETS, SKIES: SKIES, FEET: FEET, CLIPS: CLIPS, ACTS: ACTS, TALK: TALK, POSESETS: POSESETS, FLYERS: FLYERS, FLYCLIPS: FLYCLIPS, JCLIPS: JCLIPS, DRAG: DRAG, S3: S3, FROSTAT: FROSTAT, HUZZAH_HANDS: HUZZAH_HANDS, INSPECT_POINT: INSPECT_POINT, STAGED: STAGED, JXG: JXG }; return; }
  if (typeof window === 'undefined' || !window.jjStory || !window.jjStory.register) return;

  /* ====================================================================================================================
     4. THE UI + the beats
     ==================================================================================================================== */
  var api = null, phone = function () { return (window.innerWidth || 1000) < 700; };
  var EGG_KEY = 'jjSt2Egg';
  function pick() { try { var v = localStorage.getItem(EGG_KEY); if (v === 'ember') v = 'fire'; if (v === 'frost' || v === 'fire') return v; } catch (e) {} return pickMem || 'frost'; }   // (st2-3: the fire egg is 'fire' — Ember is the fire dragon's name; an old 'ember' pick reads as fire)
  var pickMem = null;
  function setPick(v) { pickMem = v; try { localStorage.setItem(EGG_KEY, v); } catch (e) {} refreshPick(); }
  var PICK = { frost: { name: 'Frost', sub: 'The ice egg', tint: '#bfe6ff', a: '#eaf7ff', b: '#7ab8e6', art: 'story2-egg-frost' }, fire: { name: 'Fire', sub: 'The fire egg', tint: '#ff6a3a', a: '#ffd36a', b: '#c8281a', art: 'story2-egg-ember' } };

  function sentence(s) { s = String(s || '').toLowerCase(); return s.charAt(0).toUpperCase() + s.slice(1); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function svgUrl(svg) { return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg); }
  function wrap(text, n) { var out = [], line = ''; String(text).split(' ').forEach(function (w) { if ((line + ' ' + w).trim().length > n) { out.push(line.trim()); line = w; } else line += ' ' + w; }); if (line.trim()) out.push(line.trim()); return out; }

  /* a generated board: the scene's mood as a soft gradient, the shot's label and what happens in it */
  function board(sceneN, id, frame, desc, mood, card) {
    var m = mood === 'live' ? ['#20242c', '#3a4252', '#20242c'] : (MOOD[mood] || MOOD[sceneN] || MOOD['1']), lines = wrap(desc, 78);
    var txt = lines.map(function (l, i) { return '<text x="800" y="' + (150 + i * 30) + '" font-size="21" fill="#fff" fill-opacity=".72" text-anchor="middle">' + esc(l) + '</text>'; }).join('');
    return svgUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><defs>' +
      '<linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + m[0] + '"/><stop offset=".62" stop-color="' + m[1] + '"/><stop offset=".7" stop-color="' + m[2] + '"/><stop offset="1" stop-color="' + m[2] + '"/></linearGradient>' +
      '<radialGradient id="v" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient></defs>' +
      '<rect width="1600" height="900" fill="url(#g)"/><rect width="1600" height="900" fill="url(#v)"/>' +
      '<g font-family="Georgia, serif"><text x="800" y="96" font-size="34" fill="#fff" fill-opacity=".9" text-anchor="middle">' + esc((card ? card + ' · ' : '') + 'Scene ' + sceneN + ' · Shot ' + id + ' · ' + sentence(frame)) + '</text>' + txt +
      (card ? '<text x="800" y="470" font-size="96" fill="#fff" fill-opacity=".16" text-anchor="middle">' + esc(card) + '</text>' : '') + '</g></svg>');
  }
  /* a placeholder figure: a soft blob in its colour with its label (no hard edges: the blob is blurred) */
  function figure(label, tint, ar, kind, vw) {                // vw = the box's width on screen: the label is sized to read at ~1vw whatever the box
    var w = 400, h = Math.max(90, Math.round(400 / (ar || 1))), fs = Math.max(5, Math.min(54, Math.round(400 * 1.05 / (vw || 12)))), lines = wrap(label, Math.max(8, Math.floor(360 / (fs * .5))));
    var y0 = h / 2 - (lines.length - 1) * fs * .6;
    return svgUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '"><defs><filter id="b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="' + Math.round(Math.min(w, h) * .05) + '"/></filter></defs>' +
      '<rect x="' + (w * .1) + '" y="' + (h * .1) + '" width="' + (w * .8) + '" height="' + (h * .8) + '" rx="' + Math.min(w, h) * .3 + '" fill="' + (tint || '#888') + '" fill-opacity="' + (kind === 'fx' ? .26 : .74) + '" filter="url(#b)"/>' +
      '<g font-family="Georgia, serif" text-anchor="middle" fill="#fff">' + lines.map(function (l, i) { return '<text x="' + w / 2 + '" y="' + (y0 + i * fs * 1.2) + '" font-size="' + fs + '" stroke="#000" stroke-opacity=".35" stroke-width="3" paint-order="stroke">' + esc(l) + '</text>'; }).join('') +
      '<text x="' + w / 2 + '" y="' + (h - h * .14) + '" font-size="' + Math.round(fs * .62) + '" fill-opacity=".7">' + (kind === 'fx' ? 'code effect' : kind) + '</text></g></svg>');
  }
  function sceneSlug(n) { return String(n).toLowerCase().replace('/7', ''); }
  function fileOf(sceneN, name) { return 'story2-' + sceneSlug(sceneN) + '-' + name; }

  /* ---- the board: where things stand on it, where a narrow screen looks, the camera's framings ---- */
  var DCALC = 'max(100vw, ' + (100 * AR).toFixed(2) + 'vh)', EASE = 'cubic-bezier(.42,0,.36,1)';   // DCALC: the cover-fitted board's width on screen · EASE: the engine's camera ease
  /* a layer on the board: x / width are fractions of the board's width, by (its feet) of the board's height. The translate is the pan:
     --bp (0 = the board's left edge in view … 1 = its right; .5 = centred) slides everything with the board on a screen narrower
     than it; K > 1 slides a nearer layer further (parallax). On a 16:9 or wider screen the term is zero. */
  function onBoard(cx, by, w, K) { return 'left:calc(50% + ' + (cx - .5 - w / 2).toFixed(4) + ' * ' + DCALC + ');bottom:calc(50% - ' + ((by - .5) / AR).toFixed(4) + ' * ' + DCALC + ');width:calc(' + w.toFixed(4) + ' * ' + DCALC + ');max-width:none;translate:calc((.5 - var(--bp, .5)) * (' + DCALC + ' - 100vw) * ' + (K == null ? 1 : K) + ') 0'; }
  function view() { var st = api.stage(), W = (st && st.clientWidth) || window.innerWidth, H = (st && st.clientHeight) || window.innerHeight; return { W: W, H: H, D: Math.max(W, AR * H), k: W < 600 ? .35 : W < 1024 ? .65 : 1 }; }   // k: the engine's camera gives phones / tablets a fraction of the push
  function camAt(c, o, v) { var r = {}, k; for (k in c) r[k] = c[k]; for (k in (o || {})) r[k] = o[k]; delete r.from; if (r.nx != null && v && v.W / v.D < .6) r.x = r.nx;
    if (r.keep != null && v) { var vis = v.W / v.D; if (vis < .6 && vis >= .36) { r.z = Math.min(r.z || 1, 1.03); r.x = Math.min(r.x, r.keep + vis / 2 / (1 + (r.z - 1) * v.k)); } }   /* st2-19 · keep: on a screen that sees about 40% of the board (a tablet upright) the framing stops where this x would leave the view, and does not push in (2.4: Joe was cut by the left edge at the end of the push); a phone, which cannot hold both, still travels to nx */
    return r; }   // nx: the point a narrow screen (which sees about a quarter of the board) looks at instead
  function panOf(c, K, v) { if (v.D - v.W < 2) return .5; var tx = c.tx == null ? .5 : c.tx; return Math.max(0, Math.min(1, .5 + ((c.x - .5) * v.D - (tx - .5) * v.W) / ((v.D - v.W) * K))); }   // the --bp that puts the shot's point at tx
  function shotOf(c, K, v) {                                  // the shot as the engine's rig wants it: a zoom about a point of the screen, and where that point goes
    var P = panOf(c, K, v), fx = .5 * v.W + (c.x - .5) * v.D + (.5 - P) * (v.D - v.W) * K, fy = v.H / 2 + ((c.y == null ? FEET : c.y) - .5) * v.D / AR, sx = fx / v.W, sy = fy / v.H;
    return { z: c.z || 1, sx: sx, sy: sy, ax: ((c.tx == null ? .5 : c.tx) - sx) / v.k, ay: c.ty == null ? 0 : (c.ty - sy) / v.k }; }
  var RIGS = {}, SKY_FAR = { k: .35, d: .45 }, SKY_NEAR = { k: .6, d: .7 };   // the sky's two layers: how far each slides in a pan (k) and its depth for the camera (d)
  function segsOf(c) { return c.seq || null; }
  function buildRigs() { var v = view();                      // one rig per board set; its shots are worked out for this screen (again on a resize)
    Object.keys(SHOTS).forEach(function (id) { var sh = SHOTS[id]; if (!sh.set) return; var set = SETS[sh.set], c = sh.cam || { x: .5, z: 1 };
      var R = RIGS[set.rig] || (RIGS[set.rig] = { comps: [], start: id, starts: {}, depth: {}, shots: {}, beats: {}, pools: [], adopt: true, fadeIn: true, ar: AR });
      if (R.comps.indexOf('s2_' + id) < 0) { R.comps.push('s2_' + id); R.starts['s2_' + id] = c.seq ? id + 's0a' : c.from ? id + 'a' : id;
        R.beats[id] = c.from ? [id, c.ms || 9000, c.wait != null ? c.wait : 1200] : [id, c.move || 2200]; R.beats[id + '!'] = [id, 0]; if (c.from) { R.beats[id + 'a'] = [id + 'a', Math.min(1400, c.wait || 1200)]; R.beats[id + 'a!'] = [id + 'a', 0]; }
        (c.seq || []).forEach(function (g, i) { R.beats[id + 's' + i + 'a'] = [id + 's' + i + 'a', 0]; R.beats[id + 's' + i] = [id + 's' + i, g.ms || 3500]; });   // a montage: each pan cuts to its opening framing, then travels
        R.depth['skyFar_' + set.sky] = SKY_FAR.d; R.depth['skyNear_' + set.sky] = SKY_NEAR.d; R.depth['fly_' + (set.fly || '')] = .8;
        set.under.concat(set.over, sh.layers).forEach(function (l) { R.depth[l.key] = l.d != null ? l.d : set.depth; }); }
      R.shots[id] = shotOf(camAt(c, null, v), set.km, v); if (c.from) R.shots[id + 'a'] = shotOf(camAt(c, c.from, v), set.km, v);
      (c.seq || []).forEach(function (g, i) { R.shots[id + 's' + i] = shotOf(camAt(g, null, v), set.km, v); R.shots[id + 's' + i + 'a'] = shotOf(camAt(g, g.from, v), set.km, v); }); });
  }
  /* --bp is a registered number, so one animation on the stage slides the board and every figure together (a pause holds it: it is
     a WAAPI animation inside #jjst). Where it can't be registered the pan simply lands at once. */
  var BP_OK = false, bpAnim = null, lastSet = null;
  try { if (window.CSS && CSS.registerProperty) { CSS.registerProperty({ name: '--bp', syntax: '<number>', inherits: true, initialValue: '0.5' }); BP_OK = true; } } catch (e) { BP_OK = /already/i.test(String(e && e.message)); }
  function bpNow(jj) { var x = parseFloat(getComputedStyle(jj).getPropertyValue('--bp')); return isNaN(x) ? .5 : x; }
  function bpGo(vals, durs) { var jj = api.stage(); if (!jj) return; var to = vals[vals.length - 1];
    if (bpAnim) { try { bpAnim.cancel(); } catch (e) {} bpAnim = null; }
    jj.style.setProperty('--bp', to.toFixed(4));
    if (vals.length < 2 || !BP_OK || !jj.animate) return; var total = 0, t = 0; durs.forEach(function (d) { total += d; }); if (total < 30) return;
    var kf = vals.map(function (x, i) { var f = { '--bp': x.toFixed(4), offset: Math.min(1, t / total), easing: EASE }; t += durs[i] || 0; return f; });
    try { bpAnim = jj.animate(kf, { duration: total }); } catch (e2) { bpAnim = null; } }
  var barsOn = false, afterCut = false, darkUntil = 0, seqT = [], mont = { ids: [], T: [] }, builtId = null, pendingGo = null;
  function bars(a, on) { if (on === barsOn) return; barsOn = on; a.runFx(on ? 'barsIn' : 'barsOut'); }   // Part One's letterbox
  /* st2-14 · HOW A FIGURE CHANGES (rules 5 and 8, Joe):
       a new picture of the same figure in the same shot (a pose, an expression, a clip for a still…) → the NEW one comes in on top at full strength (a 150ms fade,
         or at once for a clip) while the OLD one stays whole under it, and only then is the old one dropped. Never two half-faded copies (that read as a flash).
       the same picture in a new place → the old one fades out where it was and the new one fades in where it goes (never a slide, never a jump).
       a new set (another land) → the old figures fade out with their board, the new ones fade in with theirs.
     The engine's own way (an old ghost fading over a new picture that snaps in, or a slide) is kept for Prev / Next jumps only. */
  var defCss = {}, swapQ = [], stoodAt = {}, entered = null;
  function standOf(l) { return l && l.pos ? [l.feet != null ? l.feet : l.anchor != null ? l.anchor : l.pos[0], l.gy != null ? l.gy : l.pos[1], !!l.flip] : null; }
  function normCss(c) { return String(c || '').replace(/;?\s*visibility:\s*hidden/g, '').replace(/;?\s*opacity:[^;]*/g, '').replace(/;?\s*transition:[^;]*/g, '').replace(/;+$/, ''); }
  function oldsOf(a, rec, key) { var o = [rec.el]; if (rec.aura) o.push(rec.aura); if (rec.el._talk) o.push(rec.el._talk); if (actNow && actNow.key === key) { o.push(actNow.v); a.unsched(actNow.t); actNow = null; } return o; }
  function dropEls(els) { els.forEach(function (e) { if (e && e.parentNode) { if (e.tagName === 'VIDEO') { try { e.pause(); } catch (x) {} } e.remove(); } }); }
  function handover(a, name, jumping, sameSet, cutNow) { var c = COMPS[name], Ls = a.layers(); if (!c || jumping) return;
    c.layers.forEach(function (d) { var rec = Ls[d.key]; if (!rec || !rec.el || d.html != null || /^(sky|land|ledge)/.test(d.key)) return;
      var want = d.vid || a.F(d.src), act = actNow && actNow.key === d.key ? actNow : null, artNew = rec.src !== want, was = stoodAt[d.key], now = standOf(((SHOTS[String(name).slice(3)] || {}).layers || []).filter(function (l) { return l.key === d.key; })[0]);
      var moved = !!(was && now && (Math.abs(was[0] - now[0]) > .015 || Math.abs(was[1] - now[1]) > .02 || was[2] !== now[2])) && !(!artNew && defCss[d.key] != null && normCss(defCss[d.key]) === normCss(d.css));   // it stands somewhere else (or faces the other way) in the new shot (unless it is already exactly there: a swap inside the last shot took it)
      if (sameSet && !artNew && !moved) { if (act && act.A && (act.A.loop || act.A.stay)) act.carry = true; return; }   // the same figure, the same place: it simply carries on (and so does a looping / held act over it)
      var olds = oldsOf(a, rec, d.key); delete Ls[d.key];
      if (cutNow) swapQ.push({ key: d.key, olds: olds, now: true });                    // under a dip to black: simply replaced
      else if (!sameSet || moved) { var ms = sameSet ? 320 : (a.T.bgFade || 700); olds.forEach(function (e) { e.style.transition = 'opacity ' + ms + 'ms ease'; e.style.opacity = '0'; }); setTimeout(function () { dropEls(olds); }, ms + 60); }
      else swapQ.push({ key: d.key, olds: olds, t0: performance.now() }); }); }
  function handoverDone(a, name) { var c = COMPS[name], Ls = a.layers(); if (c) c.layers.forEach(function (d) { if (d.css != null && d.html == null) defCss[d.key] = d.css; });
    stoodAt = {}; ((SHOTS[String(name).slice(3)] || {}).layers || []).forEach(function (l) { var q = standOf(l); if (q) stoodAt[l.key] = q; });
    var q = swapQ; swapQ = []; q.forEach(function (it) { var rec = Ls[it.key], n = rec && rec.el; if (!n || it.now) { dropEls(it.olds); return; }
      var img = n.tagName === 'IMG'; if (img) n.style.transition = 'opacity .15s linear';
      var wait = function () { var ok = !n.isConnected || performance.now() - it.t0 > 1600 || (img ? n.complete && n.naturalWidth > 0 && parseFloat(getComputedStyle(n).opacity) > .985 : n.readyState >= 2 || (performance.now() - it.t0 > 260 && n.poster));
        if (!ok) { requestAnimationFrame(wait); return; } requestAnimationFrame(function () { dropEls(it.olds); if (img && n.isConnected) setTimeout(function () { n.style.transition = ''; }, 60); }); };
      requestAnimationFrame(wait); }); }
  /* a new picture for a figure inside a shot (a pose, an expression, the dragons calming): rule 8 — a copy with the new picture (and its new box / class, if any) fades
     in on top over `ms`; when it is whole the figure itself takes that picture and box under it, and the copy goes. The picture is decoded before anything shows. */
  /* st2-25 · A4 (the back audit: in 3.8 a bubble sat 40 px to one side or the other from one arrival to the next). A figure changing pose takes its new box only
     when the new picture has decoded and faded in (a variable ~0.2 to 0.6 s), and a bubble that opened in that time was measured on whichever box the figure had at
     that instant. The box a figure is ON ITS WAY TO is now known the moment the change is asked for (an unseen stand-in with the new picture's box: boxProbe), and
     a bubble is always measured on that (anchorOf). */
  function boxProbe(el, css, url) { if (el._probe) { if (el._probe.parentNode) el._probe.remove(); el._probe = null; el._probeSrc = null; clearTimeout(el._probeT); } if (css == null || !el.parentNode) return;
    var pb = el.cloneNode(false); pb.removeAttribute('src'); pb.removeAttribute('id'); pb.style.cssText = css + ';transition:none;visibility:hidden;pointer-events:none;opacity:0'; pb._isProbe = true; el.parentNode.insertBefore(pb, el); el._probe = pb; el._probeSrc = url || '';
    el._probeT = setTimeout(function () { if (el._probe === pb) { if (pb.parentNode) pb.remove(); el._probe = null; el._probeSrc = null; } }, 2500); }
  function layerSwap(a, key, src, css, cls, ms) { var rec = a.layers()[key], el = rec && rec.el; if (!el || !el.isConnected || el.tagName !== 'IMG') return false;
    var url = a.F(src); if (rec.src === url && (css == null || normCss(css) === normCss(defCss[key]))) { el._swap = (el._swap || 0) + 1; return true; }
    var tok = el._swap = (el._swap || 0) + 1, im = new Image(); im.src = url; boxProbe(el, css, url);
    var take = function () { boxProbe(el, null); el.src = url; rec.src = url; if (css != null) { el.style.cssText = css + ';transition:none'; defCss[key] = css; } if (cls) { el.classList.remove(cls[0]); el.classList.add(cls[1]); } };
    if (!(ms > 0)) { take(); return true; }
    var go = function () { if (!el.isConnected || el._swap !== tok) return;
      var top = el.cloneNode(false); top.style.pointerEvents = 'none'; top.src = url; if (css != null) top.style.cssText = css; if (cls) { top.classList.remove(cls[0]); top.classList.add(cls[1]); }
      top.style.transition = 'none'; top.style.opacity = '0'; el.parentNode.insertBefore(top, el.nextSibling); void top.offsetWidth; top.style.transition = 'opacity ' + ms + 'ms linear'; top.style.opacity = '1';
      setTimeout(function () { if (el.isConnected && el._swap === tok) take(); var fin = function () { requestAnimationFrame(function () { requestAnimationFrame(function () { if (top.parentNode) top.remove(); }); }); };
        if (el.decode) el.decode().then(fin, fin); else fin(); }, ms + 34); };
    if (im.decode) im.decode().then(go, go); else { im.onload = go; im.onerror = go; } return true; }
  /* Joe's expression (a still on his canvas): from this line on */
  function joeFace(a, face, jumping, cls) { var id = String(a.comp() || '').slice(3), sh = SHOTS[id] || {}, l = (sh.layers || []).filter(function (x) { return x.key === 'joe' && x.face; })[0]; if (!l || !face) return;
    var rec = a.layers().joe, el = rec && rec.el; if (!el || el.tagName !== 'IMG' || rec.src === a.F('story2-joe-reach')) return;
    if (sh.pack && !/-pack$/.test(face)) face += '-pack';                                    // from the egg pick on he wears the backpack
    var cur = el._face || l.face, css = null; if ((JXG[face] || JXG0) !== (JXG[cur] || JXG0)) { css = layerDef('3', id, JX(face, l.feet, { s: l.s, by: l.gy, flip: l.flip, still: l.still })).css; if (el.style.marginLeft) css += ';margin-left:' + el.style.marginLeft; }   // another canvas (a peacekeeping pose ↔ a standing one): its own box, measured so the helmet keeps its size and place
    el._face = face; layerSwap(a, 'joe', 'story2-joe-' + face, css, cls || null, jumping ? 0 : 140); }
  function onComp(name, jumping) {                            // the engine is about to build this shot: the pan is set first, so its figures are born in place
    var id = String(name).slice(3), sh = SHOTS[id], jj = api.stage(); if (!jj) return; var sameSet = !!(sh && sh.set && lastSet === sh.set), cutNow = !!(sh && (sh.dip || sh.cut)) || afterCut;
    handover(api, name, jumping, sameSet, cutNow); if (actNow && !actNow.carry) actOff(true); if (actNow) actNow.carry = false;
    if (softNeed) { softNeed = null; needOff(true); } exploreOff(); soundComp(id, sh, jumping); leadOff(); seqT.forEach(api.unsched); seqT = []; signOff(); builtId = id; [].forEach.call(jj.querySelectorAll('.st2black,.st2smoke,.st2puffs,.st2jet,.st2lids,.st2entr'), function (o) { o.remove(); });
    setTimeout(function () { handoverDone(api, name); if (api.comp() !== name) return; if (sh && sh.rate) Object.keys(sh.rate).forEach(function (k) { var rr = api.layers()[k]; if (rr && rr.el && 'playbackRate' in rr.el) { try { rr.el.playbackRate = sh.rate[k]; } catch (e) {} } });   /* st2-20: a clip played a touch faster (2.1's walk) */ if (sh && sh.frost) frostGo(api, id, sh.frost, jumping); flyGo(api); if (sh && sh.takeoff) takeoffGo(api, id); blinkGo(api, id); if (sh && sh.set === 'hl') spurtGo(api, id); if (sh && sh.enter && !jumping && entered !== id) { entered = id; enterGo(api, id, sh.enter); } else if (!sh || !sh.enter) entered = null; }, 0);   // (once this shot's layers are in: the hand-overs finish, the frost dragon's cut, the flyers)
    if (pendingGo) { var pg = pendingGo; pendingGo = null; if (pg.id === id) setTimeout(function () { if (api.comp() === 's2_' + id) camGo(api, id, pg.jumping); }, 0); }   // (the shot is being built now, under its dip: its camGo runs as soon as its layers are in)
    if (mont.ids.indexOf(id) < 0) { mont.T.forEach(api.unsched); mont = { ids: [], T: [] }; }   /* left a montage: its remaining shots don't come */ bars(api, !!(sh && sh.bars));
    if (!sh || !sh.set) { lastSet = null; afterCut = false; bpGo([.5]); atmo(null); return; }
    var set = SETS[sh.set], v = view(), c = sh.cam || { x: .5, z: 1 }, P = panOf(camAt(c, null, v), set.km, v), carried = lastSet === sh.set && !jumping && !afterCut && !sh.cut, cur = bpNow(jj);
    if (c.seq) bpGo([panOf(camAt(c.seq[0], c.seq[0].from, v), set.km, v)]);
    else if (c.from) { var Pa = panOf(camAt(c, c.from, v), set.km, v); if (carried && Math.abs(cur - Pa) > .002) bpGo([cur, Pa], [Math.min(1400, c.wait || 1200)]); else bpGo([Pa]); }   // a pan opens on its first framing; it sets off with its beat (camGo), not with the shot's build (the first shot is built under the loader)
    else if (carried && Math.abs(cur - P) > .002) bpGo([cur, P], [c.move || 2200]); else bpGo([P]);
    lastSet = sh.set; atmo(sh.atmo || set.atmo, sh.pocket); }
  /* the living clip: one <video> (muted, looping, inline) fetched a scene ahead and laid over its poster once it has drawn a frame; it lives in #jjst, so a
     pause holds it (and the pan: a WAAPI animation on its layer) and a resume carries both on */
  var liveV = {}, livePan = null;
  function liveVideo(a, name) { var v = liveV[name]; if (v) return v; v = liveV[name] = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.preload = 'auto';
    v.src = a.GB + name + '.mp4' + a.AV; try { v.load(); } catch (e) {} var im = new Image(); im.src = a.GB + name + '-poster.webp' + a.AV; if (im.decode) im.decode().catch(function () {}); v._poster = im; return v; }
  /* st2-9 · the picture's height in the letterbox: framed so the line `keep` of the picture (the pool dragons' water line, the liveliest part of the clip) sits just
     above the narration banner, never lower than centred, and never so high that the picture stops short of the lower bar. The bars hide what overflows. */
  function liveTop(a, sh, w) { var st = a.stage(), H = st.clientHeight, Hw = w.offsetHeight, cap = a.cap(), sr = st.getBoundingClientRect(), cr = cap ? cap.getBoundingClientRect() : null, capTop = cr && cr.height ? cr.top - sr.top : H * .72, bar = H * .09 + 16;
    var top = Math.min((H - Hw) / 2, capTop - 6 - (sh.keep || .8) * Hw); top = Math.max(top, H - bar - Hw); w.style.top = top.toFixed(0) + 'px'; w.style.translate = '0 0'; return top; }
  function liveGo(a, id, sh) { var r = a.layers().live, w = r && r.el; if (!w) return; var v = liveVideo(a, sh.live), top = liveTop(a, sh, w);
    if (v.parentNode !== w) { v.style.opacity = '0'; w.appendChild(v); }
    var shown = function () { if (v.parentNode === w) v.style.opacity = '1'; };
    if (!a.paused()) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
    if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(shown); else if (v.readyState >= 2 && !v.paused) shown(); else v.addEventListener('playing', shown, { once: true });
    exploreOff(); if (livePan) { try { livePan.cancel(); } catch (e) {} livePan = null; }
    var PAN = { duration: sh.pan || 11000, easing: 'cubic-bezier(.45,0,.55,1)', fill: 'forwards' };
    musIntro(id); if (w.animate) livePan = w.animate([{ translate: '0 0' }, { translate: 'calc(100vw - 100%) 0' }], PAN);   // lava side → ice side, once, eased in and out; no zoom change
    else w.style.translate = 'calc(100vw - 100%) 0';
    if (sh.flocks && w.animate) { [].forEach.call(w.querySelectorAll('.fkh'), function (o) { o.remove(); }); sh.flocks.forEach(function (F) { flockGo(a, id, F, w, PAN, top); }); }
    if (sh.black && w.animate) blackGo(a, id, sh, w, PAN);
    if (sh.explore) exploreOn(a, id, sh, w); }   // st2-20: the things to press are there from the first frame, riding the pan
  /* ---- st2-20 · 3.1: PRESS THINGS WHILE IT PANS (Joe: 'Let's not do the mouse pan, but the user can interact whilst panning, slow it down slightly, then go to the
       next scene'). The pointer-driven camera of st2-17 is gone (with its dead zone, its drag, its hints, the bars easing away, the locked Next and the 40 s
       fallback). The shot is one automatic pan (16 s, the same ease), the bars on throughout; when it ends the picture holds 1.5 s on the ice side and the tale goes
       on to 3.2 by itself (the line is timed to the pan; Next / ArrowRight skip ahead at any time).
       · everything pressable is pressable from the first frame and DURING the pan. The press areas are placed in PICTURE coordinates (fractions of the 16:9 picture)
         inside the panning layer, so they ride it: the eggs in the three nests (three presses to break one; the first one broken awards 'Nest egg') and the four
         dragons painted into the clip (a splash ring / an ember pop / a snow puff, and floating hearts). Each has an unseen press area of 44 px at least (52 on a
         touch screen) with the site's hover cursor.
       · a small hint pill, 'Tap the eggs', two seconds in; it goes on the first press, or after 5 s.
       · the black dragon makes his one pass, entering about halfway.
     Nothing answers while the tale is paused (rule 2). Left / Right still mean previous / next. ---- */
  var X = null;
  function exploreOff() { var x = X; X = null; if (!x) return; x.offs.forEach(function (f) { f(); }); if (x.hot && x.hot.parentNode) x.hot.remove(); pillOff(); }
  function exploreLeave(a) { if (!X) return; var x = X; x.left = true; if (x.hot) [].forEach.call(x.hot.children, function (c) { c.style.pointerEvents = 'none'; }); pillOff(); }   // (the shot is leaving: nothing more to press)
  function exploreOn(a, id, sh, w) { exploreOff(); var E = sh.explore, st = a.stage(), coarse = false; try { coarse = window.matchMedia('(pointer: coarse)').matches; } catch (e) {}
    var x = X = { id: id, w: w, offs: [], busy: 0, hot: null, found: false, left: false, pressed: false };
    var first = function () { if (x.pressed) return; x.pressed = true; pillOff(); };
    /* the things to press */
    var hot = x.hot = document.createElement('div'); hot.className = 'st2hot'; w.appendChild(hot);
    var P = function (v) { return (v * 100).toFixed(2) + '%'; }, fx = function (cls, px, py, size, kf, ms, html) { var e = document.createElement('i'); e.className = cls; e.style.cssText = 'left:' + P(px) + ';top:' + P(py) + ';width:' + P(size); if (html) e.innerHTML = html; hot.appendChild(e); var an = e.animate(kf, { duration: ms, easing: 'ease-out', fill: 'forwards' }); a.sched(function () { if (e.parentNode) e.remove(); }, ms + 80); return an; };
    var hearts = function (px, py) { [0, 1, 2].forEach(function (i) { a.sched(function () { if (X !== x) return; var dx = (Math.random() - .5) * 3.2;
        fx('hr', px + (Math.random() - .5) * .03, py, .016 + Math.random() * .006, [{ translate: '-50% -50%', scale: '.3', opacity: 0 }, { translate: 'calc(-50% + ' + (dx * .4).toFixed(1) + 'vw) calc(-50% - 2.4vh)', scale: '1', opacity: 1, offset: .25 }, { translate: 'calc(-50% + ' + dx.toFixed(1) + 'vw) calc(-50% - 9vh)', scale: '1.1', opacity: 0 }], 1350); }, i * 170); }); };
    var HEART = '<svg viewBox="0 0 24 22" xmlns="http://www.w3.org/2000/svg"><path d="M12 21C5 15.4 1 11.6 1 6.9 1 3.6 3.6 1 6.8 1c2 0 3.9 1 5.2 2.7C13.3 2 15.2 1 17.2 1 20.4 1 23 3.6 23 6.9c0 4.7-4 8.5-11 14.1z" fill="#ff5fa8" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    var hrOld = fx; fx = function (cls, px, py, size, kf, ms) { return hrOld(cls, px, py, size, kf, ms, cls === 'hr' ? HEART : ''); };
    var SPARK = [{ translate: '-50% -50%', scale: '.25', opacity: 0, rotate: '0deg' }, { translate: '-50% -50%', scale: '1', opacity: 1, rotate: '40deg', offset: .3 }, { translate: '-50% -50%', scale: '1.35', opacity: 0, rotate: '90deg' }];
    var ok = function (e) { if (e) e.stopPropagation(); return X === x && !x.left && !a.paused(); };   // rule 2: nothing answers while the tale is paused
    var area = function (q, label, fn) { var b = document.createElement('button'); b.type = 'button'; b.className = 'ha'; b.setAttribute('data-cursor', 'hover'); b.setAttribute('aria-label', label); b.style.cssText = 'left:' + P(q[0]) + ';top:' + P(q[1]) + ';width:max(' + P(q[2]) + ',' + (coarse ? 52 : 44) + 'px);height:max(' + P(q[3]) + ',' + (coarse ? 52 : 44) + 'px)';
      b.addEventListener('click', function (e) { if (!ok(e)) return; first(); x.busy = performance.now() + 1500; fn(); }); hot.appendChild(b); };
    /* an egg takes three presses. 1 = a wobble and a first crack; 2 = a bigger wobble, more cracks, light leaking out; 3 = it breaks: the top of the shell comes off
       in three shards that tumble away, warm light and sparkles, the chime, and (the first time) 'Nest egg'. From then on a glow sits where its top was, the lower
       half-shell with its jagged rim in front of it. Nobody has to break one: the shot moves on by itself. */
    var eggs = x.eggs = E.eggs.map(function () { return { n: 0, el: null }; });
    E.eggs.forEach(function (q, i) { area(q, 'A dragon egg', function () { var g = eggs[i]; if (g.busy && performance.now() < g.busy) return; g.busy = performance.now() + (g.n === 2 ? 1000 : 520);
        if (g.n >= 3) { fx('sk', q[0], q[1] - q[3] * .3, q[2] * 2, SPARK, 700); return; }                                                    // already open: a sparkle, for fun
        g.n++; eggCrack(a, x, w, q, g);
        if (g.n < 3) { st2sfx(a, 'puff', .12, true); return; }
        fx('sk', q[0], q[1] - q[3] * .2, q[2] * 3.2, SPARK, 820); fx('ep', q[0], q[1] - q[3] * .15, q[2] * 2.6, [{ translate: '-50% -50%', scale: '.2', opacity: 0 }, { translate: '-50% -50%', scale: '1', opacity: .95, offset: .22 }, { translate: '-50% -62%', scale: '1.5', opacity: 0 }], 900);
        for (var k = 0; k < 12; k++) (function (k) { a.sched(function () { if (X === x) fx('tw', q[0] + (Math.random() - .5) * q[2] * 1.1, q[1] - q[3] * .2, .0045 + Math.random() * .004, [{ translate: '-50% -50%', opacity: 0, scale: '.4' }, { translate: 'calc(-50% + ' + ((Math.random() - .5) * 2).toFixed(1) + 'vw) calc(-50% - ' + (2 + Math.random() * 2).toFixed(1) + 'vh)', opacity: 1, scale: '1', offset: .3 }, { translate: 'calc(-50% + ' + ((Math.random() - .5) * 4).toFixed(1) + 'vw) calc(-50% - ' + (7 + Math.random() * 6).toFixed(1) + 'vh)', opacity: 0, scale: '.6' }], 1100 + Math.random() * 500); }, k * 170); })(k);   // light and sparkles rising for a couple of seconds
        st2sfx(a, 'chime', .3);
        if (!x.found) { x.found = true; var r = hot.getBoundingClientRect(); a.award('st2-nest', { x: r.left + r.width * q[0], y: r.top + r.height * q[1] }); } }); });
    E.dragons.forEach(function (q) { area(q, 'A little dragon', function () { var kind = q[4], cy = q[1] + q[3] * (kind === 'snow' ? .1 : .32);
        if (kind === 'water') { [0, 180].forEach(function (dl) { a.sched(function () { if (X === x) fx('rg', q[0], cy, q[2] * 1.5, [{ translate: '-50% -50%', scale: '.25', opacity: 0 }, { translate: '-50% -50%', scale: '.6', opacity: .95, offset: .22 }, { translate: '-50% -50%', scale: '1.25', opacity: 0 }], 950); }, dl); }); st2sfx(a, 'water', .14); }
        else if (kind === 'lava') { fx('ep', q[0], cy - q[3] * .2, q[2] * 1.2, [{ translate: '-50% -50%', scale: '.2', opacity: 0 }, { translate: '-50% -60%', scale: '1', opacity: 1, offset: .25 }, { translate: '-50% -95%', scale: '1.3', opacity: 0 }], 800);
          for (var i = 0; i < 6; i++) fx('em', q[0] + (Math.random() - .5) * q[2] * .8, cy - q[3] * .1, .004 + Math.random() * .003, [{ translate: '-50% -50%', opacity: 0 }, { translate: 'calc(-50% + ' + ((Math.random() - .5) * 3).toFixed(1) + 'vw) calc(-50% - ' + (3 + Math.random() * 3).toFixed(1) + 'vh)', opacity: 1, offset: .3 }, { translate: 'calc(-50% + ' + ((Math.random() - .5) * 5).toFixed(1) + 'vw) calc(-50% - ' + (8 + Math.random() * 6).toFixed(1) + 'vh)', opacity: 0 }], 900 + Math.random() * 500); st2sfx(a, 'fire-spurt', .14); }
        else { fx('sp', q[0], cy, q[2] * 1.5, [{ translate: '-50% -50%', scale: '.3', opacity: 0 }, { translate: '-50% -58%', scale: '.9', opacity: .95, offset: .25 }, { translate: '-50% -72%', scale: '1.5', opacity: 0 }], 1000); st2sfx(a, 'puff', .16, true); }
        hearts(q[0], q[1] - q[3] * .35); }); });
    seqT.push(a.sched(function () { if (X === x && !x.pressed && !x.left && a.comp() === 's2_' + id) pill('Tap the eggs', 5000); }, 2000)); }
  /* an egg, pressed: it is painted into the clip, so everything is done with soft-edged patches of the picture itself (the clip's current frame, or its poster) laid
     exactly over it, in picture coordinates: the patch rocks about the egg's base while it wobbles (it covers the painted egg, a touch enlarged; its edge feathers
     out); the cracks are drawn on top of it (a dark jagged line with a faint glow; from the second press light shows in them); and when it breaks, three pieces of
     the same patch (the top of the shell, in the egg's own colours) tumble away, a warm light takes the place of the egg's top, and the patch's lower half, cut to
     a jagged rim, stands in front of the light: an open shell, from then on. */
  var CRACKS = [['M50 19L46 29L53 36L47 46'], ['M53 36L62 40L60 50', 'M46 29L37 35L39 45', 'M47 46L52 55L48 63', 'M39 45L33 50']];
  function eggPatch(x, w, q, m) { var v = w.querySelector('video'), src = v && v.readyState >= 2 && v.videoWidth ? v : (liveV[SHOTS[x.id].live] || {})._poster, sw = src && (src.videoWidth || src.naturalWidth), sh2 = src && (src.videoHeight || src.naturalHeight); if (!sw) return null;
    var bw = q[2] * m, bh = q[3] * m, c = document.createElement('canvas'); c.width = Math.max(8, Math.round(bw * sw)); c.height = Math.max(8, Math.round(bh * sh2));
    try { c.getContext('2d').drawImage(src, (q[0] - bw / 2) * sw, (q[1] - bh / 2) * sh2, bw * sw, bh * sh2, 0, 0, c.width, c.height); } catch (e) { return null; } return c; }
  function eggCrack(a, x, w, q, g) { var m = 1.5, bw = q[2] * m, bh = q[3] * m, box = 'left:' + ((q[0] - bw / 2) * 100).toFixed(2) + '%;top:' + ((q[1] - bh / 2) * 100).toFixed(2) + '%;width:' + (bw * 100).toFixed(2) + '%;height:' + (bh * 100).toFixed(2) + '%';
    var e = g.el; if (!e) { e = g.el = document.createElement('div'); e.className = 'egw'; e.style.cssText = box; x.hot.insertBefore(e, x.hot.firstChild); }
    var paths = CRACKS[0].concat(g.n >= 2 ? CRACKS[1] : []), d = paths.join(''), lit = g.n >= 2;
    var svg = '<svg viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><defs><filter id="jjst2ck" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="' + (lit ? 2.2 : 1.3) + '"/></filter></defs>' +
      '<path d="' + d + '" fill="none" stroke="' + (lit ? '#fff3b4' : '#fff1c8') + '" stroke-opacity="' + (lit ? .95 : .5) + '" stroke-width="' + (lit ? 5.5 : 3.4) + '" stroke-linecap="round" stroke-linejoin="round" filter="url(#jjst2ck)"/>' +
      (lit ? '<path d="' + d + '" fill="none" stroke="#fffbe6" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' : '') + '<path d="' + d + '" fill="none" stroke="#2b1a12" stroke-width="' + (lit ? 1.1 : 1.5) + '" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var c = eggPatch(x, w, q, m); e.innerHTML = ''; if (c) { c.className = 'pt'; e.appendChild(c); }
    if (g.n < 3) { e.insertAdjacentHTML('beforeend', svg); var k = g.n === 2 ? 1.5 : 1;                                   // a wobble (bigger the second time); the cracks ride it
      e.animate([{ rotate: '0deg', scale: '1' }, { rotate: (-8 * k) + 'deg', scale: String(1 + .06 * k), offset: .16 }, { rotate: (7 * k) + 'deg', scale: String(1 + .07 * k), offset: .36 }, { rotate: (-5 * k) + 'deg', scale: String(1 + .05 * k), offset: .56 }, { rotate: (3 * k) + 'deg', scale: '1.03', offset: .76 }, { rotate: '0deg', scale: '1' }], { duration: g.n === 2 ? 900 : 760, easing: 'ease-in-out' });
      if (c) { c.animate([{ opacity: 1 }, { opacity: 1, offset: .94 }, { opacity: 0 }], { duration: g.n === 2 ? 900 : 760, fill: 'forwards' }); } return; }
    /* it breaks */
    e.classList.add('open'); var glow = document.createElement('i'); glow.className = 'lt'; e.appendChild(glow);
    glow.animate([{ scale: '.3', opacity: 0 }, { scale: '1.25', opacity: 1, offset: .3 }, { scale: '1', opacity: 1 }], { duration: 520, easing: 'ease-out', fill: 'forwards' });
    if (c) { c.className = 'pt half'; e.appendChild(c);                                                                  // the lower half-shell, in front of the light
      [['polygon(18% 48%,25% 30%,37% 20%,47% 17%,45% 56%,34% 44%,23% 55%)', -3.4, -5, -150], ['polygon(47% 17%,62% 20%,66% 55%,56% 45%,45% 56%)', .4, -7.5, 110], ['polygon(62% 20%,74% 30%,81% 47%,77% 44%,66% 55%)', 3.6, -4.6, 190]].forEach(function (S, i) {
        var p = eggPatch(x, w, q, m); if (!p) return; p.className = 'pt sh'; p.style.clipPath = S[0]; p.style.webkitClipPath = S[0]; e.appendChild(p);
        p.animate([{ translate: '0 0', rotate: '0deg', opacity: 1 }, { translate: (S[1] * .5).toFixed(1) + 'vw ' + S[2] + 'vh', rotate: (S[3] * .45) + 'deg', opacity: 1, offset: .4, easing: 'ease-in' }, { translate: S[1].toFixed(1) + 'vw ' + (4 + i * 1.5) + 'vh', rotate: S[3] + 'deg', opacity: 0 }], { duration: 950 + i * 90, easing: 'ease-out', fill: 'forwards' });
        a.sched(function () { if (p.parentNode) p.remove(); }, 1150 + i * 90); }); } }
  /* a flock: a far-away group loafing in the sky of the panned picture. Two <video>s of the same clip take turns: when one reaches its end it holds its last
     frame while the other starts from the top under a 300ms dissolve (at this size the join does not read), so the group flaps on for as long as the shot is up.
     Everything is in #jjst (WAAPI + CSS animations, videos): a pause holds it. */
  var flockV = {};
  function clipVideo(a, vid) { var v = document.createElement('video'); v.muted = true; v.playsInline = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.preload = 'auto'; v.poster = a.GB + vid + '-poster.webp' + a.AV; v.innerHTML = window.jjClipSrc(a.GB + vid, a.AV); try { v.load(); } catch (e) {} return v; }
  /* st2-14 · rule 8: two copies of one looping clip take turns with a CUT, never a dissolve. When one ends it holds its last frame; the other (waiting on its first
     frame) starts, and the moment it has painted a frame it is shown on top and the first is hidden (the clips are loops: last frame → first frame is the match). */
  function relay(pair, ok) { pair.forEach(function (v, i) { v.style.transition = 'none'; v.style.opacity = i ? '0' : '1';
      v.addEventListener('ended', function () { var o = pair[1 - i]; if (!v.isConnected || !o.isConnected || (ok && !ok(v))) return; try { o.currentTime = 0; } catch (e) {}
        var show = function () { o.style.zIndex = '2'; v.style.zIndex = '1'; o.style.opacity = '1'; requestAnimationFrame(function () { v.style.opacity = '0'; setTimeout(function () { try { v.currentTime = 0; } catch (e) {} }, 300); }); };
        var pr = o.play(); if (pr && pr.catch) pr.catch(function () {}); if (o.requestVideoFrameCallback) o.requestVideoFrameCallback(show); else o.addEventListener('playing', show, { once: true }); }); }); return pair; }
  function flockVideos(a, F) { if (flockV[F.vid]) return flockV[F.vid];
    return flockV[F.vid] = relay([0, 1].map(function () { return clipVideo(a, F.vid); }), function (v) { return !!v._fly; }); }
  function flockBox(F, W, H, Ww) { var fw = Ww * F.size, fh = fw * F.h / F.w, y = H * .09 + 34 + H * (F.y || 0); return { w: fw, h: fh, y: y, bottom: y + fh * (1 + (F.bob ? F.bob[1] : 30) / 100) }; }   // where it flies on the screen (y: from the top of the stage)
  function flockGo(a, id, F, w, PAN, top) { var vs = flockVideos(a, F), st = a.stage();
    var h = document.createElement('div'), f = document.createElement('div'), fi = document.createElement('div'); h.className = 'fkh'; f.className = 'fk'; fi.className = 'fki';
    vs.forEach(function (v, i) { v._fly = true; try { v.pause(); v.currentTime = 0; } catch (e) {} v.style.opacity = i ? '0' : '1'; fi.appendChild(v); }); f.appendChild(fi); h.appendChild(f); w.appendChild(h);
    var W = st.clientWidth, H = st.clientHeight, Ww = w.offsetWidth, T = Math.max(0, Ww - W), bx = flockBox(F, W, H, Ww), k = F.k == null ? 1 : F.k;
    f.style.width = bx.w.toFixed(1) + 'px'; f.style.aspectRatio = F.w + '/' + F.h; f.style.opacity = F.op == null ? 1 : F.op; if (F.flip) f.style.scale = '-1 1'; f.style.top = (bx.y - top).toFixed(0) + 'px';   // in the sky, clear of the upper bar's feathered edge (and of the transport, which sits in the bar)
    fi.style.setProperty('--bd', (F.bob ? F.bob[0] : 5.6) + 's'); fi.style.setProperty('--ba', (F.bob ? F.bob[1] : 30) + '%');
    var L0 = F.x * Ww - bx.w / 2, L1 = L0 - (F.drift || 0) * Ww;   // it hovers at its place in the picture (a tiny drift at most): the pan carries it through the view
    if (k < 1) h.animate([{ translate: '0 0' }, { translate: ((1 - k) * T).toFixed(1) + 'px 0' }], PAN);   // (a far group lags the land a little: the picture travels −T, its sky −k·T)
    f.animate([{ translate: L0.toFixed(1) + 'px 0' }, { translate: L1.toFixed(1) + 'px 0' }], { duration: PAN.duration, easing: 'linear', fill: 'forwards' });
    if (!a.paused()) { var pr = vs[0].play(); if (pr && pr.catch) pr.catch(function () {}); } }
  /* the black dragon: one slow pass, anchored to the screen (he sits beside the panned picture, under the bars), with smoke from his nostrils. Not repeated.
     The smoke: soft round puffs born small at the nostril every ~300ms into a layer that does NOT travel with him, so they trail back and up behind his head as
     he moves on; each grows and fades over ~1.5s (WAAPI in #jjst: a pause holds them; the next puff is a sched timer: it waits too). */
  var blackV = null;
  function blackGo(a, id, sh, w, PAN) { seqT.push(a.sched(function () { blackPass(a, id, sh, w); }, PAN.duration * (sh.black.at || .5))); }
  function blackPass(a, id, sh, w) { var K = sh.black, st = a.stage(), host = w.parentNode;
    (function () { if (a.comp() !== 's2_' + id || !w.isConnected) return; var v = blackV || (blackV = clipVideo(a, K.vid));
      var W = st.clientWidth, H = st.clientHeight, Ww = w.offsetWidth, cap = a.cap(), sr = st.getBoundingClientRect(), cr = cap ? cap.getBoundingClientRect() : null, capTop = cr && cr.height ? cr.top - sr.top : H * .72;
      var under = 0; (sh.flocks || []).forEach(function (F) { under = Math.max(under, flockBox(F, W, H, Ww).bottom); });
      var narrow = W / Ww < .6, bw = Math.min(Math.max(K.size * W, .13 * Ww), .58 * W) / (K.body || 1), bh = bw * K.h / K.w, arc = H * .022, y = narrow ? under + 8 : H * .09 + 16 + 12 + arc * .6, avail = capTop - 30 - y - arc; if (bh > avail) { bw *= avail / bh; bh = avail; }   // st2-12b (Joe: bigger and higher): on a wide screen his frame starts just under the upper bar (wings fully up still clear it and the transport), so his body crosses the upper-middle of the picture; on a narrow one, where the whole sky is a few hundred px wide, he keeps under the hovering groups   // his length ~17% of the view (never smaller than the hovering groups on a narrow screen), fitted between them and the banner
      [].forEach.call(host.querySelectorAll('.st2black,.st2smoke'), function (o) { o.remove(); });
      var e = document.createElement('div'), inner = document.createElement('div'), smoke = document.createElement('div'); e.className = 'st2black'; smoke.className = 'st2smoke';
      e.style.cssText = 'top:' + y.toFixed(0) + 'px;width:' + bw.toFixed(0) + 'px;aspect-ratio:' + K.w + '/' + K.h; inner.appendChild(v); e.appendChild(inner); host.appendChild(e); host.appendChild(smoke);
      v.loop = true; if (K.loop && v.requestVideoFrameCallback && !v._lp) { v._lp = true; var lp = function (now, md) { if (md && md.mediaTime >= K.loop - 1 / 24 - .004) { try { v.currentTime = 0; } catch (x) {} } v.requestVideoFrameCallback(lp); }; v.requestVideoFrameCallback(lp); }   // his loop is 87 frames (the 88th repeats the 1st)
      try { v.currentTime = 0; } catch (x) {} var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
      e.animate([{ translate: (-bw - 10).toFixed(0) + 'px 0' }, { translate: (W + 10).toFixed(0) + 'px 0' }], { duration: K.total || K.ms * (W + bw + 20) / Math.max(W, 2.2 * bw), easing: 'linear', fill: 'forwards' });   // K.ms to cross the visible frame (a little quicker on a narrow screen, where he is as wide as half of it): heavy, unhurried, steady
      inner.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(' + arc.toFixed(0) + 'px)' }, { transform: 'translateY(' + (-arc * .6).toFixed(0) + 'px)' }, { transform: 'translateY(' + (arc * .7).toFixed(0) + 'px)' }, { transform: 'translateY(0)' }], { duration: K.total || K.ms * (W + bw + 20) / Math.max(W, 2.2 * bw), easing: 'ease-in-out', fill: 'forwards' });   // a slow rise and dip
      var gone = false, lastT = 0, puff = function (big, n) { var r = inner.getBoundingClientRect(), hr = host.getBoundingClientRect(), s = bw * (big ? .095 : .065) * (.85 + Math.random() * .3);
        var x = r.left - hr.left + r.width * (K.nose[0] + (n ? .012 : 0)), yy = r.top - hr.top + r.height * (K.nose[1] + (n ? .012 : 0)); if (x < -s || x > W + s) return;
        var q = document.createElement('i'); q.style.cssText = 'left:' + x.toFixed(0) + 'px;top:' + yy.toFixed(0) + 'px;width:' + s.toFixed(1) + 'px;height:' + s.toFixed(1) + 'px'; smoke.appendChild(q);
        var dx = -bw * (.07 + Math.random() * .06), dy = -bw * (.1 + Math.random() * .07), pk = big ? .9 : .78, at = function (f) { return 'calc(-50% + ' + (dx * f).toFixed(0) + 'px) calc(-50% + ' + (dy * f).toFixed(0) + 'px)'; };
        var an = q.animate([{ translate: '-50% -50%', scale: '.5', opacity: 0 }, { translate: at(.14), scale: '1', opacity: pk, offset: .14 }, { translate: at(.55), scale: big ? '2.3' : '1.9', opacity: pk * .55, offset: .55 }, { translate: at(1), scale: big ? '3.4' : '2.7', opacity: 0 }], { duration: 1500, easing: 'ease-out', fill: 'forwards' });
        an.onfinish = function () { q.remove(); }; };
      var tick = function () { if (gone || a.comp() !== 's2_' + id || !e.isConnected) return; var t = v.currentTime, beat = (K.beats || []).some(function (b) { return lastT < b && t >= b; }); lastT = t < lastT ? 0 : t;
        puff(beat, 0); if (beat || Math.random() < .6) puff(false, 1); seqT.push(a.sched(tick, 250 + Math.random() * 100)); };   // a wisp from each nostril; a bigger puff on each wing downbeat
      seqT.push(a.sched(tick, 300));
      seqT.push(a.sched(function () { gone = true; try { v.pause(); } catch (x) {} e.remove(); seqT.push(a.sched(function () { smoke.remove(); }, 1600)); }, (K.total || K.ms * (W + bw + 20) / Math.max(W, 2.2 * bw)) + 200)); })(); }
  function liveFetch(a) { Object.keys(SHOTS).forEach(function (k) { var sh = SHOTS[k]; if (!sh.live) return; liveVideo(a, sh.live); (sh.flocks || []).forEach(function (F) { flockVideos(a, F); }); if (sh.black && !blackV) blackV = clipVideo(a, sh.black.vid); }); }
  /* what a shot (or a later state of it: a line's o.comp) sets going besides its camera: a timed exit clip, a clip that freezes, smoke, the dragons calming, the sheath */
  function shotExtras(a, id, jumping) { var sh = SHOTS[id]; if (!sh) return;
    if (sh.exit) seqT.push(a.sched(function () { exitGo(a, id, sh.exit); }, sh.exit.at || 0));
    if (sh.freeze) freezeGo(a, id, sh.freeze);
    if (sh.smoke) smokeGo(a, id, sh.smoke);
    if (sh.calmAt != null) { if (jumping) calmGo(a, id, true); else seqT.push(a.sched(function () { calmGo(a, id); }, sh.calmAt)); }
    if (sh.sheathAt != null) seqT.push(a.sched(function () { if (a.comp() === 's2_' + id) playAct(a, 'sheath', id); }, jumping ? 60 : sh.sheathAt));
    if (sh.pointAt != null && !INSPECT_POINT) seqT.push(a.sched(function () { if (a.comp() === 's2_' + id) standIn(a, 'joe', JX('pointing', sh.pointAt[1], { still: true }), id); }, jumping ? 400 : sh.pointAt[0]));   // st2-23 · 2.4: he sees the oasis: up off his knees, pointing at it (his new picture comes in over the kneel, then the kneel is dropped: rule 8), until the inspect-and-point clip lands
    if (sh.handsAt != null) seqT.push(a.sched(function () { if (a.comp() === 's2_' + id) standIn(a, 'joe', JX('calm-hands-up', JOE3, { s: S3, by: OY, still: true }), id); }, jumping ? 400 : sh.handsAt)); }   // st2-15: sword away, hands up, apologetic
  /* st2-15 · the take-off (3.9r): Joe is in the saddle; after a beat the pair crouch a little and lift off up and to the right, the way they face, as ONE (the same
     move on the mount and on the rider: a WAAPI translate inside #jjst, so a pause holds it), with a puff of sand where they stood. No turn, no flip. Until Joe's
     mounted take-off clip lands (story2-joe-ride) this is the shot. */
  function takeoffGo(a, id) { var T = SHOTS[id].takeoff; seqT.push(a.sched(function () { if (a.comp() !== 's2_' + id) return; var st = a.stage(), els = ['mount', 'joe'].map(function (k) { var r = a.layers()[k]; return r && r.el; }).filter(Boolean); if (!st || els.length < 2) return;
      var W = st.clientWidth, H = st.clientHeight, m = els[0].getBoundingClientRect(), sr = st.getBoundingClientRect(); burst(m.left + m.width * .45 - sr.left, m.bottom - sr.top, 'ash');
      var kf = [{ translate: '0px 0px' }, { translate: (-W * .008).toFixed(0) + 'px ' + (H * .014).toFixed(0) + 'px', offset: .16, easing: 'cubic-bezier(.5,0,.9,.5)' }, { translate: (W * .035).toFixed(0) + 'px ' + (-H * .2).toFixed(0) + 'px', offset: .55, easing: 'linear' }, { translate: (W * .12).toFixed(0) + 'px ' + (-H * 1.12).toFixed(0) + 'px' }];   /* st2-25 · D8: almost straight up (it climbed away to the right, behind Clive's back): they leave by the top of the frame, in front of him */
      liftSync(a, id); els.forEach(function (e) { e.style.transition = 'none'; if (e.animate) e.animate(kf, { duration: T.ms || 2800, easing: 'ease-in', fill: 'forwards', composite: 'add' }); else e.style.visibility = 'hidden'; }); }, T.at || 1500)); }
  function camGo(a, id, jumping) { soundLive(); var sh = SHOTS[id]; if (sh && sh.dip && builtId !== id) { pendingGo = { id: id, jumping: jumping }; return; }   // a shot that lands under a dip to black: its figures are built at the swap, so its camera, clips and timers start then (onComp)
    if (sh && sh.live) { liveGo(a, id, sh); return; } if (!sh || !sh.set) return;
    if (sh.set === 'd') liveFetch(a);   /* (Scene 2: the oasis clip and its flock are fetched now, so 3.1 opens without a black frame) */
    var c = sh.cam || {}, set = SETS[sh.set], v = view(), jj = a.stage(), now = afterCut || sh.cut ? '!' : ''; afterCut = false;   // after a dip to black the camera is simply there (a cut), no travel
    if (c.seq) {                                              // a montage of slow pans: cut to each one's opening framing, travel, cut to the next
      var t = 0; c.seq.forEach(function (g, i) { var go = function () { if (a.comp() !== 's2_' + id) return; a.runFx('cam:' + id + 's' + i + 'a'); a.runFx('cam:' + id + 's' + i);
          bpGo([panOf(camAt(g, g.from, v), set.km, v), panOf(camAt(g, null, v), set.km, v)], [g.ms || 3500]);
          if (i) { var f = cutEl(a), e = document.createElement('i'); e.className = 'dip'; f.appendChild(e); if (e.animate) e.animate([{ opacity: .85 }, { opacity: 0 }], { duration: 520, easing: 'ease-out', fill: 'forwards' }); setTimeout(function () { if (e.parentNode) e.remove(); }, 700); } };   // (each new pan comes up out of a blink of dark)
        if (t) seqT.push(a.sched(go, t)); else go(); t += (g.ms || 3500) + 60; });
      return; }
    if (sh.then) { mont.T.forEach(a.unsched); mont = { ids: [id].concat(sh.then.map(function (q) { return q[0]; })), T: [] };   // a montage (3.1): this shot hands on to the next ones by itself, each dissolving in on its own land with its own pan
      sh.then.forEach(function (q) { mont.T.push(a.sched(function () { if (mont.ids.indexOf(String(a.comp()).slice(3)) < 0) return; a.setComp('s2_' + q[0]); camGo(a, q[0], false); }, q[1])); }); }
    if (c.from) a.runFx('cam:' + id + 'a' + now); a.runFx('cam:' + id + (c.from ? '' : now));
    if (c.from) bpGo([bpNow(jj), panOf(camAt(c, c.from, v), set.km, v), panOf(camAt(c, null, v), set.km, v)], [c.wait != null ? c.wait : 1200, c.ms || 9000]);
    if (sh.after) { var ar = a.layers()[sh.after.key], av = ar && ar.el; if (av && av.tagName === 'VIDEO') { var hand = function () { if (a.comp() === 's2_' + id && !actNow) playAct(a, sh.after.act, id); };   // (the draw ends: the trembling hold takes over)
        if (av.ended) hand(); else av.addEventListener('ended', hand, { once: true }); } }
    shotExtras(a, id, jumping);
    talkTidy(); sh.layers.forEach(function (l) { if (l.src && TALK[l.src]) talkEl(a, id, l.key); if (l.vid && CLIPS[l.vid] && CLIPS[l.vid].rest) restClip(a, id, l.key, CLIPS[l.vid].rest); });
    sh.layers.forEach(function (l) { if (!l.exit) return; seqT.push(a.sched(function () { var r = a.layers()[l.key]; if (r && r.el && a.comp() === 's2_' + id) r.el.classList.add(l.exit.cls); }, l.exit.at || 0)); });   // (Grik zooming off)
    if (sh.puff && !jumping) a.sched(function () { var r = a.layers()[sh.puff], st = a.stage(); if (!r || !r.el || !st) return; var q = r.el.getBoundingClientRect(), sr = st.getBoundingClientRect(); burst(q.left + q.width / 2 - sr.left, q.bottom - sr.top, 'ash'); }, 250); }
  /* st2-14 · Grik's exit: story2-grik-exit over the hovering still. The clip starts; the moment it has painted a frame it is shown on top, both give a small hop
     (the two are drawn in different hands: the hop covers the change), and only then is the still dropped (rule 8). When it ends he is gone. */
  function exitGo(a, id, X) { if (a.comp() !== 's2_' + id) return; var r = a.layers()[X.key], v = r && r.el, s0 = a.layers()[X.still], st = s0 && s0.el; if (!v || v.tagName !== 'VIDEO' || v._gone) return; v._gone = true;
    try { v.currentTime = 0; } catch (e) {} var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
    var hop = [{ translate: '0 0' }, { translate: '0 -5%', offset: .4 }, { translate: '0 0' }], shown = false, show = function () { if (shown) return; shown = true; v.style.visibility = 'visible'; v.style.opacity = '1';
      setTimeout(function () { if (st && st.isConnected) { st.style.transition = 'none'; st.style.opacity = '0'; st.style.visibility = 'hidden'; if (st._talk) st._talk.style.opacity = '0'; } }, 120); };
    if (st && st.animate) st.animate(hop, { duration: 300, easing: 'ease-out' }); if (v.animate) v.animate(hop, { duration: 300, easing: 'ease-out' });
    if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(show); else v.addEventListener('playing', show, { once: true }); setTimeout(show, 500);
    v.addEventListener('ended', function () { v.style.visibility = 'hidden'; }, { once: true }); }
  /* st2-17 · an entrance in a flash and a puff of smoke (Clive, 3.3): a quick bright flash at his spot, a soft purple-grey burst of smoke that swells and clears over
     ~600 ms, and he is there: whole from the first frame, under the smoke (never a dissolve of the figure). The same family as the flyers' puffs, bigger. All of it
     is WAAPI inside #jjst (a pause holds it); every shape is a radial gradient (no edges). */
  function enterGo(a, id, E) { var r = a.layers()[E.key], el = r && r.el, st = a.stage(); if (!el || !st) return; el.style.transition = 'none'; el.style.visibility = 'hidden';
    requestAnimationFrame(function () { if (a.comp() !== 's2_' + id || !el.isConnected) { el.style.visibility = ''; return; }
      var q = el.getBoundingClientRect(), sr = st.getBoundingClientRect(), cx = q.left + q.width / 2 - sr.left, cy = q.top + q.height * .52 - sr.top, R = q.height, h = document.createElement('div'); h.className = 'st2entr'; st.appendChild(h);
      var fl = document.createElement('i'); fl.className = 'fl'; fl.style.cssText = 'left:' + cx.toFixed(0) + 'px;top:' + cy.toFixed(0) + 'px;width:' + (R * 1.7).toFixed(0) + 'px;height:' + (R * 1.7).toFixed(0) + 'px'; h.appendChild(fl);
      fl.animate([{ scale: '.3', opacity: 0 }, { scale: '.9', opacity: 1, offset: .28 }, { scale: '1.15', opacity: 0 }], { duration: 300, easing: 'ease-out', fill: 'forwards' });
      [[0, -.02, .78], [-.2, .12, .6], [.2, .1, .62], [-.12, -.28, .5], [.14, -.26, .52], [-.22, .34, .5], [.2, .36, .5], [0, .22, .66]].forEach(function (b, i) { var p = document.createElement('i'), s = R * b[2]; p.className = 'sm' + (i % 2 ? ' b' : '');
        p.style.cssText = 'left:' + (cx + b[0] * R).toFixed(0) + 'px;top:' + (cy + b[1] * R).toFixed(0) + 'px;width:' + s.toFixed(0) + 'px;height:' + s.toFixed(0) + 'px'; h.appendChild(p);
        var dx = b[0] * R * 1.5 + (Math.random() - .5) * R * .16, dy = b[1] * R * .9 - R * (.14 + Math.random() * .12), at = function (f) { return 'calc(-50% + ' + (dx * f).toFixed(0) + 'px) calc(-50% + ' + (dy * f).toFixed(0) + 'px)'; };
        p.animate([{ translate: '-50% -50%', scale: '.55', opacity: 0 }, { translate: at(.12), scale: '.95', opacity: .96, offset: .1 }, { translate: at(.5), scale: '1.45', opacity: .72, offset: .46 }, { translate: at(1), scale: '2', opacity: 0 }], { duration: 620 + i * 26, easing: 'ease-out', fill: 'forwards' }); });
      a.sched(function () { el.style.visibility = ''; }, 60); st2sfx(a, 'puff', .3, true);                                              // he is there once the smoke is up (two frames in)
      a.sched(function () { if (h.parentNode) h.remove(); }, 1000); }); }
  /* a clip that plays up to a point and freezes there (Joe's cheer: the sword at the top) */
  function freezeGo(a, id, Z) { var r = a.layers()[Z.key], v = r && r.el; if (!v || v.tagName !== 'VIDEO' || v._frz) return; v._frz = true;
    var chk = function () { if (!v.isConnected || v._thaw) return; if (v.currentTime >= Z.at) { try { v.pause(); } catch (e) {} return; } if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(chk); else setTimeout(chk, 40); }; chk(); }
  /* smoke from a nostril (SMOKE): soft round puffs born small at the nostril, drifting up and away as they grow and fade. The angry dragons puff only while they
     are angry. Everything is a WAAPI animation inside #jjst (a pause holds it); the next puff is a sched timer (it waits too). */
  var SMOKE_C = { dark: ['rgba(58,56,66,.92)', 'rgba(92,90,100,.42)'], warm: ['rgba(255,226,196,.9)', 'rgba(236,160,110,.4)'], dust: ['rgba(214,194,160,.92)', 'rgba(176,152,120,.42)'] };
  /* ---- st2-20 · SOUND. Everything plays inside Howler (so the site's sound button, Mute all, the mixer's sliders and the preview's silence shim all apply) and
     through the engine's pause (it hushes every playing instance and brings exactly those back). Nothing is ever started while the tale is paused: what should be
     playing is a PLAN (which track, which section, which level, which beds), set by the shot (soundComp) and carried out by one 50 ms tick that only runs while the
     tale runs. So a Prev / Next (paused or not) lands with the right section, level and beds for its shot, and there is never a second copy of a track or a bed.
     A file that is not there simply stays silent.
       MUSIC ('music' group), levels matched to Part One's forest music by loudness (story-music-fairies: mean -24.1 dB at .23 = -36.9 dB):
         story2-music-wasteland (mean -18.2 dB) → full .117 · story2-music-oasis (its FULL section: mean -16.2 dB) → full .093; levels as fractions of full (MUS_SHOT, MUS_ARC).
         · wasteland, Scenes 1–2: starts on its drum hit; at 3:54 (its own fade-out begins ~3:56) a new pass starts from 0 on the hit while the tail fades out under
           it over 2.5 s. Out over 2 s as 2.4 hands over to 3.1.
         · oasis, ONE file played in sections (seconds): INTRO 0–25.28 · LIFT 25.28 · GENTLE 46 · FULL 66–123.6 · a hard stop, silence · FINALE 125.91 (full entry
           135.17, rings out from 175.6). A jump is always a new instance fading in over 150–250 ms while the old one fades out (never a click, never two for long).
             (st2-25, Joe: ONE SLOW ARC of level, not a jump; the speed of the music is never changed. The plan before it put the LIFT on the sword draw with a rate nudge.)
             2.4   as the oasis is sighted (2.3 s in) the wasteland track fades out over 2.5 s and the oasis INTRO comes in under it, started D24 before the LIFT.
             3.1   its first frame is the LIFT (25.28) at FULL level (if the intro did not land there by itself: a 200 ms cross-fade jump on that frame).
             3.2   the track plays on; on the sword-draw frame the level eases down to .22 over 1.2 s. Joe's growl loop sits low under it from the dragons' rise.
             3.2b → 3.3  .25 → .30 · 3.4  .32 → .42 · 3.5  .44 → .55 · 3.6  back down to .30 · 3.6b  .36, .45 on the prompt, .65 and .85 on the two steps,
                   1.0 at the touch, held through 'went back to sleep' · 3.6d → 3.8  .8 · 3.9  1.0. Each change eases over ~2.8 s. No ducking from 3.2 to 3.6.
                   At the hard stop (123.6) back to 25.28.
             3.9r  Joe is on the saddle: jump to just before the FINALE's full entry, so 135.17 lands on the lift-off (the spring out of the crouch, LIFT_AT
                   after the take-off starts); into Scene 4; when the FINALE rings out it carries on from FULL (66) and loops FULL for the flight.
       AMBIENCE ('sfx' group: the Sound effects slider; never ducks the music and is never ducked), Joe's recordings baked into seamless loops, each played as a
         looping sprite of its exact length (an mp3's edge padding would tick in a bare loop): story2-amb-oasis from 3.1 to 3.3 and again 3.7 → the take-off;
         -ice in 3.4, -water in 3.5, -lava-bubble + -lava-fire (the fire 7 s into its loop, so the two never line up) in 3.6 → 3.6d. In over 1.2 s (the oasis 1.5),
         each cross-fading into the next. (story2-sfx-lava, the old synthesised bed, stays in the folder, unused.)
       EFFECTS ('sfx' group, stand-ins from experiments/sfx-standins/make_sfx.py): story2-sfx-<name>.mp3, at vol × ST2_GAIN (the engine's story gain × SFX_TRIM).
         They play over the music (which dips to 55% under them) and over the beds. ---- */
  var ST2_GAIN = .5 * .8, sndH = {}, sndDead = {}, puffAt0 = 0, sndIv = 0, sndLast = 0, musDuckV = 1, MLOG = [], sndFades = [], ambTook = null, drawRaf = 0, sndShot = null;
  var MUS_MOUNT = 1.3, MUS_BED = .6, MUS_LOW = .25, OAS = { lift: 25.28, stop: 123.6, full: 66, entry: 135.17, ring: 175.6 }, WASTE_TAIL = 234;
  var DRAW_AT = 1.75;                                          // the sword-draw frame: story2-joe-sword-draw's frame 42 of 24 fps (the blade clear of the scabbard, swinging up)
  var D31 = 19.72;                                             // 3.1's start → that frame, in a run nobody touches (the pan 16 + the hold 1.5, then the dip and the clip: measured)
  var LIFT_AT = 1.04, LIFT_LEAD = 1.5 + LIFT_AT;               // the take-off: 1.5 s after Joe is on the saddle (3.9r's takeoff.at) the pair start to crouch; measured on the mount, the crouch is at its lowest 1.04 s later (the spring: LIFT_AT) and they pass their standing height, rising, at 1.41 s
  var MUSIC = { wasteland: { f: 'music-wasteland', full: .117 }, oasis: { f: 'music-oasis', full: .093 } };
  /* st2-25 · E (Joe): the oasis music is ONE SLOW ARC through Scene 3, not a jump. The intro comes in under the mirage in 2.4; the LIFT (25.28) is on 3.1's first frame at
     full level; from there the track just plays on (its loop region is still 25.28 to 123.6 and back). Its LEVEL is the story: full across the reveal, down to its
     quietest as Joe draws his sword, then 'slowly, slowly louder through each scene, quieter at the beginning of Ember, louder as he goes to pet her, and then it's
     loudest'. MUS_SHOT: shot → [section, the level it opens at (x full), that level's glide in ms]. MUS_ARC: shot → the level at each of its beats in turn (the last one
     holds); the Ember steps and the touch are set by the presses themselves (onFx). Every change eases over ~2.8 s (the draw: 1.2 s). Nothing ducks the music in
     3.2 to 3.6, and its playback rate is NEVER changed (that was the pitch bend on the draw). */
  var MUS_SHOT = { '3.1': ['A', 1, 400], '3.2': ['A', 1, 700], '3.2b': ['A', .25, 2800], '3.3': ['A', .26, 2800], '3.4': ['A', .32, 2800], '3.5': ['A', .44, 2800], '3.6': ['A', 0, 2800],
    '3.6b': ['A', 0, 2800], '3.6t': ['A', .8, 1500], '3.6c': ['A', .8, 1500], '3.6d': ['A', .8, 2800], '3.7': ['A', .8, 2800], '3.8': ['A', .8, 2800], '3.9': ['A', .8, 2500], '3.9r': ['finale', MUS_MOUNT, 400], '4.1': ['F', 1.15, 2800], '4.2': ['F', 1.15, 2800] };
  /* st2-26q (Joe, 8 Oct): 'the music should start again as he steps towards Ember, and then continue to play, just get extra loud when Joe gets on the dragon'. So: it fades
     right out as the lava fields come up (the lava and the fire lead there, and through the flashback); his FIRST step toward her brings it back in from the track's full
     body (a 1.2 s fade in), louder with each step to the touch (EMBER_STEPS); from the touch it simply plays on at that level through the huzzah, the ledge, the two-shot and
     the whistle; and it is loudest of all, above everything before it, as he mounts (MUS_MOUNT). A null in MUS_ARC = that beat leaves the level alone. */
  var MUS_ARC = { '3.1': [1], '3.2': [1, .25], '3.3': [.26, .275, .29, .3], '3.4': [.32, .35, .385, .42], '3.5': [.44, .47, .5, .525, .55], '3.6': [0, 0], '3.6b': [0, 0, null, .8], '3.6d': [.8], '3.7': [.8], '3.8': [.8], '3.9': [.8] };
  var EMBER_STEPS = [.45, .62, .8], DRAW_LOW = .22, D24 = 5.46;   // the Ember presses: a step, a step, the touch · the level with the sword up · 2.4's sighting → 3.1's first frame, hands off (s): the intro is started that long before the lift
  var AMB = { oasis: { f: 'amb-oasis', cyc: 149.7, lvl: .15, in: 1500, out: 1500 }, ice: { f: 'amb-ice', cyc: 13.5, lvl: .32, in: 1200, out: 1200 }, water: { f: 'amb-water', cyc: 45, lvl: .28, in: 1200, out: 1200 },
    lavaB: { f: 'amb-lava-bubble', cyc: 45, lvl: .28, in: 1200, out: 1500 }, lavaF: { f: 'amb-lava-fire', cyc: 45, lvl: .2, in: 1200, out: 1500, at: 7 },   /* st2-25 · E3: the three habitat beds twice as loud (+6 dB) */
    growl: { f: 'sfx-growl', cyc: 4.219, lvl: .11, in: 500, out: 1500 } };   /* st2-25: Joe's dragon growl, a seamless 4.219 s loop: a low bed under 3.2 while the sword is up (about the oasis ambience's own loudness: the file is 3 dB hotter, so .11 against .15). In over 0.5 s as the dragons rise, out over 1.5 s on 'Put that down!' */   // lvl: in the effects' own units (× ST2_GAIN)
  var AMB_SHOT = { '3.1': ['oasis'], '3.2': ['oasis'], '3.2b': ['oasis'], '3.3': ['oasis'], '3.4': ['ice'], '3.5': ['water'], '3.7': ['oasis'], '3.8': ['oasis'], '3.9': ['oasis'], '3.9r': ['oasis'] };   // (the lava pair: every shot on the lava set)
  function mlog(what, o) { o = o || {}; o.what = what; o.at = Math.round(performance.now()); MLOG.push(o); if (MLOG.length > 240) MLOG.shift(); }
  function c01(x) { return Math.max(0, Math.min(1, x)); }
  function sndGet(name, loop, cat, cyc) { if (!window.Howl || sndDead[name] || !api) return null; if (sndH[name]) return sndH[name];
    var o = { src: [api.GB + 'story2-' + name + '.mp3' + api.AV], loop: !!loop, volume: 1, preload: true, onloaderror: function () { sndDead[name] = 1; sndH[name] = null; try { h.unload(); } catch (e) {} } };
    if (cyc) o.sprite = { cyc: [0, Math.round(cyc * 1000), true] };   // a bed: a looping sprite of its exact length
    var h = sndH[name] = new Howl(o); h._jjCat = cat || 'sfx'; if (cyc) h._jjBed = true;
    window.jjAudio = window.jjAudio || { sounds: [], muted: false, volume: 1.0 }; window.jjAudio.sounds.push(h); return h; }
  function st2sfx(a, name, vol, force) { if (!a || a.paused()) return; if (name === 'puff' && !force) { var n = performance.now(); if (n - puffAt0 < 1800) return; puffAt0 = n; }   // (puffs come in flurries: one soft sound at most every 1.8 s)
    var h = sndGet('sfx-' + name); if (!h) return; vol = vol == null ? .3 : vol; if (/^3\.[456]/.test(String(sndShot)) && /^(ice|water|fire-spurt|puff)$/.test(name)) vol *= 1.585;   /* st2-25 · E3: in the three dragon shots the frost stream, the squirt, the fire spurt and the puffs are 4 dB up */
    try { var id = h.play(); h.volume(vol * ST2_GAIN, id); } catch (e) {} }
  function sndOn() { if (!sndIv) { sndLast = 0; sndIv = setInterval(sndTick, 50); } }
  function musPos(M) { var h = sndH[M.f]; if (!h || M.id == null) return null; try { var p = h.seek(M.id); return typeof p === 'number' ? p : null; } catch (e) { return null; } }
  function musDrop(M, ms) { var h = sndH[M.f], id = M.id; M.id = null; M.rate = 1; if (!h || id == null) return;
    if (api && api.paused()) { try { h.stop(id); } catch (e) {} return; }   // (under a pause nothing is heard: it simply goes, and is not brought back by the resume)
    var v = 0; try { v = h.volume(id); h.rate(1, id); } catch (e) {} sndFades.push({ h: h, id: id, v0: v, left: ms, ms: ms }); }
  function musStart(M) { var h = sndGet(M.f, false, 'music'); if (!h || h.state() !== 'loaded' || (api && api.paused())) return false;
    try { var id = h.play(); h.volume(0, id); if (M.startAt > .01) h.seek(M.startAt, id); M.id = id; M.rate = 1; } catch (e) { M.id = null; return false; } M.startAt = null; return true; }
  function musSeek(M, pos, xf, out) { musDrop(M, out || xf || 200); M.startAt = Math.max(0, pos); M.xinMs = xf || 200; M.xin = 0; musStart(M); sndOn(); }   // a jump: the new instance fades in as the old one fades out
  var mirT = null, growlOn = false;
  function musLv(to, ms, what) { var M = MUSIC.oasis, p = musPos(M); if (M.lv == null || (M.id == null && M.startAt == null)) M.lv = to; M.lvT = to; M.lvRate = Math.max(.00002, Math.abs(to - M.lv) / (ms || 2800)); mlog('level', { where: what, to: to, from: +(+M.lv).toFixed(3), seek: p == null ? null : +p.toFixed(2) }); sndOn(); }
  function musArc(shot, k, jumping) { var L = MUS_ARC[shot]; if (!L || !MUSIC.oasis.want || L[Math.min(k, L.length - 1)] == null) return; musLv(L[Math.min(k, L.length - 1)], jumping ? 900 : 2800, shot + ' beat ' + (k + 1)); }
  /* 2.4, as the oasis is sighted: the wasteland track fades away over 2.5 s and the oasis track's intro comes up under it, started so that its LIFT falls on 3.1's
     first frame if nobody touches anything (D24); 3.1's first frame puts the lift there whatever happened (musIntro) */
  function mirage() { mirT = null; if (sndShot !== '2.4') return; var W = MUSIC.wasteland, O = MUSIC.oasis; W.want = false; W.envMs = 2500; O.want = true; O.envMs = 2500; sndGet(O.f, false, 'music');
    if (O.id == null && O.startAt == null) { O.startAt = Math.max(0, OAS.lift - D24); O.xinMs = 300; O.xin = 0; O.env = 0; } O.lv = O.lvT = 1; O.mode = 'intro'; mlog('mirage', { oasisFrom: +(OAS.lift - D24).toFixed(2), wasteland: musPos(W) == null ? null : +musPos(W).toFixed(2) }); sndOn(); }
  function musicPlan(id, jumping) { var scn = SHOT_SCENE[id] || SHOT_SCENE[String(id).replace(/[a-z]+$/, '')], n = scn && scn.n, name = n === '1' || n === '2' ? 'wasteland' : MUS_SHOT[id] ? 'oasis' : null;
    if (mirT != null) { api.unsched(mirT); mirT = null; }
    if (id === '2.4' && MUSIC.oasis.want && MUSIC.oasis.mode === 'intro' && !jumping) name = 'oasis';   // (the cut at the end of 2.4 rebuilds nothing; a later state of the same shot: the mirage has already been sighted)
    Object.keys(MUSIC).forEach(function (k) { var W = MUSIC[k]; W.want = k === name; W.envMs = null; if (!W.want && api && api.paused() && W.id != null) musDrop(W, 0); });
    cancelAnimationFrame(drawRaf); sndOn(); if (n === '2') sndGet(MUSIC.oasis.f, false, 'music');   // (the oasis track is fetched through Scene 2)
    if (id === '2.4' && name === 'wasteland') mirT = api.sched(mirage, 2300);
    if (!name) return;
    var M = MUSIC[name], q = MUS_SHOT[id] || ['loop', 1, 700], live = M.id != null || M.startAt != null; sndGet(M.f, false, 'music');
    if (name === 'oasis' && id === '2.4') return;
    if (!live || M.lv == null) M.lv = q[1]; M.lvT = q[1]; M.lvRate = Math.max(.00002, Math.abs(q[1] - M.lv) / (q[2] || 700));
    if (name === 'wasteland') { if (!live) { M.startAt = 0; M.xinMs = 60; M.xin = 0; if (!(M.env > 0)) M.env = 1; } return; }   // (a cold start: straight in on its drum hit)
    var p = musPos(M), inA = p != null && p >= OAS.lift - .02 && p < OAS.stop, was = M.mode;
    if (q[0] === 'A') { if (!(live && ((was === 'A' && inA) || (was === 'intro' && id === '3.1')))) { musSeek(M, q[1] >= .8 && id !== '3.1' && id !== '3.2' ? OAS.full : OAS.lift, 220); M.mode = 'A'; }
      else if (live && was === 'A' && !(M.lv > .05) && q[1] >= .5 && id !== '3.1' && id !== '3.2') { musSeek(M, OAS.full, 1200); M.mode = 'A'; }   /* st2-26q: coming back from silence (the touch reached by Next, without the steps): in from the full body, as the first step does */   // (landed from outside the section, by Prev / Next: the lift; the FULL body for a loud shot)
      if (id === '3.2') { M.drawn = false; drawWatch(api, id); } }
    else if (q[0] === 'finale') { musSeek(M, OAS.entry - LIFT_LEAD, 200); M.mode = 'finale'; mlog('mount', { to: +(OAS.entry - LIFT_LEAD).toFixed(3) }); }
    else if (q[0] === 'F') { if (!(live && (was === 'finale' || was === 'F'))) { musSeek(M, OAS.full, 220); M.mode = 'F'; } } }
  /* the sword-draw frame of 3.2 (watched on the clip's own clock): the music is eased DOWN to its quietest over 1.2 s. Nothing else: no jump, no change of speed */
  function drawWatch(a, id) { cancelAnimationFrame(drawRaf); var M = MUSIC.oasis, loop = function () { if (a.comp() !== 's2_' + id || M.drawn || !M.want) return; drawRaf = requestAnimationFrame(loop); if (a.paused()) return;
      var r = a.layers().joe, v = r && r.el; if (!v || v.tagName !== 'VIDEO' || !/sword-draw/.test(String(v.currentSrc || v.src || '')) || !(v.currentTime > 0)) return;
      if (v.currentTime >= DRAW_AT) { M.drawn = true; musLv(DRAW_LOW, 1200, 'the draw (clip ' + v.currentTime.toFixed(2) + ' s)'); } };
    drawRaf = requestAnimationFrame(loop); }
  /* the take-off (takeoffGo): the pair crouch now and spring up LIFT_AT later: the FINALE's full entry is put on that spring (if it is more than 40 ms out it is re-seated
     now, a second before, with a short cross-fade; the speed is never touched); the oasis ambience fades out */
  function liftSync(a, id) { var M = MUSIC.oasis; ambTook = id; ambPlan(id); if (!M.want || M.mode !== 'finale') return; var p = musPos(M);
    if (p != null) { var err = p - (OAS.entry - LIFT_AT); mlog('takeoff', { seek: +p.toFixed(3), err: +err.toFixed(3), reseat: Math.abs(err) > .04 }); if (Math.abs(err) > .04) musSeek(M, OAS.entry - LIFT_AT, 150); }
    seqT.push(a.sched(function () { var p2 = musPos(M); mlog('lift', { seek: p2 == null ? null : +p2.toFixed(3) }); }, LIFT_AT * 1000)); }
  function ambPlan(id) { var sh = SHOTS[id] || {}, list = ambTook === id ? [] : (AMB_SHOT[id] || (sh.set === 'hl' ? ['lavaB', 'lavaF'] : [])); if (growlOn && id === '3.2') list = list.concat(['growl']);   /* (the growl: only while the dragons are up and angry) */
    if (id === '3.1' || id === '3.2') { sndGet(AMB.growl.f, false, 'sfx', AMB.growl.cyc); sndGet('sfx-roar'); }
    Object.keys(AMB).forEach(function (k) { var B = AMB[k]; B.want = list.indexOf(k) >= 0; if (B.want) sndGet(B.f, false, 'sfx', B.cyc);
      if (!B.want && B.id != null && api && api.paused()) { try { sndH[B.f].stop(B.id); } catch (e) {} B.id = null; B.env = 0; } }); sndOn(); }   // (under a pause: it simply goes)
  function sndTick() { var now = performance.now(), dt = Math.min(200, now - (sndLast || now)); sndLast = now; if (!api || api.paused()) return; var busy = false, any = false;
    try { (window.Howler ? Howler._howls : []).forEach(function (h) { if (busy || h._jjCat === 'music' || h._jjBed || /sfx-lava/.test(String(h._src))) return; if (h.playing()) busy = true; }); } catch (e) {}   // (the beds never duck the music)
    musDuckV += ((busy && !bookUp && !/^3\.[2-6]/.test(String(sndShot)) ? .55 : 1) - musDuckV) * (1 - Math.exp(-dt / (busy ? 50 : 200)));          // down in ~150 ms, back over ~600 ms
    Object.keys(MUSIC).forEach(function (k) { var M = MUSIC[k], h = sndH[M.f]; if (!h) { if (sndDead[M.f]) { M.id = null; M.startAt = null; } return; }
      M.env = c01((M.env || 0) + (M.want ? 1 : -1) * dt / (M.envMs || 2000));                                  // a 2 s fade either way: the two tracks cross at the hand-over
      if (!M.want && M.env <= 0) { if (M.id != null) { try { h.stop(M.id); } catch (e) {} M.id = null; } M.startAt = null; M.mode = null; M.lv = null; return; }
      if (M.id != null) { var q = h._soundById && h._soundById(M.id); if (!q || q._ended) M.id = null; }
      if (M.id == null) { if (!M.want) return; any = true; if (M.startAt == null) { M.startAt = k === 'wasteland' ? 0 : M.mode === 'F' || M.mode === 'finale' ? OAS.full : OAS.lift; if (M.mode === 'finale') M.mode = 'F'; M.xinMs = 200; M.xin = 0; } if (!musStart(M)) return; }
      any = true; M.xin = Math.min(1, (M.xin == null ? 1 : M.xin) + dt / (M.xinMs || 200));
      if (M.lv !== M.lvT) { var stp = (M.lvRate || .001) * dt; M.lv = M.lv < M.lvT ? Math.min(M.lvT, M.lv + stp) : Math.max(M.lvT, M.lv - stp); }
      var p = musPos(M);
      if (p != null) { if (k === 'wasteland') { if (p >= WASTE_TAIL) { musDrop(M, 2500); M.startAt = 0; M.xinMs = 60; M.xin = 0; musStart(M); mlog('wasteland-loop', { from: +p.toFixed(2) }); } }
        else if (M.mode === 'intro') { if (p >= OAS.lift) M.mode = 'A'; }
        else if (M.mode === 'A') { if (p >= OAS.stop) { mlog('loop-A', { from: +p.toFixed(2) }); musSeek(M, OAS.lift, 200); } }
        else if (M.mode === 'finale') { if (p >= OAS.ring) { mlog('finale-out', { from: +p.toFixed(2) }); musSeek(M, OAS.full, 250, 2600); M.mode = 'F'; } }
        else if (M.mode === 'F') { if (p >= OAS.stop) { mlog('loop-F', { from: +p.toFixed(2) }); musSeek(M, OAS.full, 200); } } }
      if (M.id != null) { try { h.volume(M.full * M.lv * M.env * M.xin * musDuckV, M.id); } catch (e) {} } });
    sndFades = sndFades.filter(function (f) { f.left -= dt; if (f.left <= 0) { try { f.h.stop(f.id); } catch (e) {} return false; } var kf = f.left / f.ms; try { f.h.volume(f.v0 * kf * kf, f.id); } catch (e) {} any = true; return true; });
    Object.keys(AMB).forEach(function (k) { var B = AMB[k]; if (!B.want && B.id == null) return; var h = sndGet(B.f, false, 'sfx', B.cyc); if (!h) { B.id = null; return; }
      if (B.id != null) { var q = h._soundById && h._soundById(B.id); if (!q || q._ended) B.id = null; }
      if (B.id == null) { if (!B.want) return; any = true; if (h.state() !== 'loaded') return; try { B.id = h.play('cyc'); h.volume(0, B.id); if (B.at) h.seek(B.at, B.id); } catch (e) { B.id = null; return; } B.env = 0; }
      B.env = c01((B.env || 0) + (B.want ? dt / B.in : -dt / B.out));
      if (!B.want && B.env <= 0) { try { h.stop(B.id); } catch (e) {} B.id = null; return; }
      any = true; try { h.volume(B.lvl * ST2_GAIN * B.env, B.id); } catch (e) {} });
    if (!any) { clearInterval(sndIv); sndIv = 0; } }
  /* (the first shot is built under the loader, long before its line starts: the plan waits for the tale to be running — soundLive, from the shot's first beat) */
  var sndLive = false, sndPend = null;
  function soundComp(id, sh, jumping) { if (!sndLive) { sndPend = [id, sh, jumping]; return; } sndShot = id; ambTook = null; growlOn = false; musicPlan(id, jumping); ambPlan(id); }
  function soundLive() { if (sndLive) return; sndLive = true; var q = sndPend; sndPend = null; if (q) soundComp(q[0], q[1], q[2]); }
  function musIntro(id) { var M = MUSIC.oasis; if (!M.want || id !== '3.1') return; var p = musPos(M), jump = p == null || Math.abs(p - OAS.lift) > .08;   // 3.1's first frame (its pan sets off): the music is AT THE LIFT, at full level. If the intro did not land there by itself (a Next in 2.4, a jump straight here), it is put there with a 200 ms cross-fade
    if (jump) musSeek(M, OAS.lift, 200); M.mode = 'A'; M.lv = M.lvT = 1; mlog('lift-3.1', { was: p == null ? null : +p.toFixed(3), jumped: jump, level: 1 }); }
  /* st2-25 · B5: the 'previously' storybook plays over the wasteland track: it starts with the book's first frame (a 1.5 s fade in) and simply carries on into
     Scene 1 (musicPlan finds it playing and leaves it be). While the book is up the page sounds do not duck it. */
  var bookUp = false;
  /* st2-26q (Joe, 8 Oct): the book now plays under Part One's book music (the hills: the engine starts and ends it); the wasteland track is only fetched while
     the book is up, and FADES IN (2.6 s) as the book ends, under the hills' fade out. Scene 1 finds it playing and leaves it be, as before. */
  function bookMusic(ph) { var M = MUSIC.wasteland; if (ph === 'start') { bookUp = true; sndGet(M.f, false, 'music'); return; }
    bookUp = false; M.want = true; if (M.id == null && M.startAt == null) { M.startAt = 0; M.xinMs = 2600; M.xin = 0; M.env = 1; M.lv = 1; M.lvT = 1; } sndOn(); }
  function soundOff() { sndLive = false; sndPend = null; cancelAnimationFrame(drawRaf); Object.keys(MUSIC).forEach(function (k) { MUSIC[k].want = false; }); Object.keys(AMB).forEach(function (k) { AMB[k].want = false; }); sndOn(); }
  function sndState() { var o = { shot: sndShot, duck: +musDuckV.toFixed(2), music: {}, beds: {}, fading: sndFades.length, log: MLOG.slice() };
    Object.keys(MUSIC).forEach(function (k) { var M = MUSIC[k], h = sndH[M.f], p = musPos(M), v = null, n = 0; try { if (h && M.id != null) v = h.volume(M.id); n = h ? (h._sounds || []).filter(function (q) { return !q._paused && !q._ended; }).length : 0; } catch (e) {}
      o.music[k] = { want: !!M.want, on: M.id != null, mode: M.mode || null, seek: p == null ? null : +p.toFixed(3), level: M.lv == null ? null : +M.lv.toFixed(3), env: +(M.env || 0).toFixed(2), vol: v == null ? null : +v.toFixed(4), playing: n }; });
    Object.keys(AMB).forEach(function (k) { var B = AMB[k], h = sndH[B.f], v = null, p = null, n = 0; try { if (h && B.id != null) { v = h.volume(B.id); p = h.seek(B.id); } n = h ? (h._sounds || []).filter(function (q) { return !q._paused && !q._ended; }).length : 0; } catch (e) {}
      o.beds[k] = { want: !!B.want, on: B.id != null, env: +(B.env || 0).toFixed(2), vol: v == null ? null : +v.toFixed(4), seek: typeof p === 'number' ? +p.toFixed(2) : null, playing: n }; });
    return o; }
  /* one of the lava's spurts carries the whoosh: the sound is put on that spurt's own CSS clock (its flame stands at ~66% of its cycle) */
  function spurtGo(a, id) { var tick = function () { if (a.comp() !== 's2_' + id) return; var e = document.querySelector('#jjst .st2fx.lava .fs'), an = e && e.getAnimations()[0], tm = an && an.effect && an.effect.getComputedTiming();
      if (!tm || tm.progress == null || !(tm.duration > 0)) { seqT.push(a.sched(tick, 3000)); return; }
      seqT.push(a.sched(function () { if (a.comp() !== 's2_' + id) return; st2sfx(a, 'fire-spurt', .1); seqT.push(a.sched(tick, 400)); }, ((((.66 - tm.progress) % 1) + 1) % 1) * tm.duration)); };
    seqT.push(a.sched(tick, 1200)); }
  function puffAt(a, key, at, kind, size, big, lazy) { var st = a.stage(), r = a.layers()[key], el = r && r.el; if (!st || !el || !el.isConnected) return; var host = st.querySelector('.st2puffs'); if (!host) { host = document.createElement('div'); host.className = 'st2puffs'; st.appendChild(host); }
    var q = el.getBoundingClientRect(), sr = st.getBoundingClientRect(), s = q.width * size * (big ? 1.7 : 1) * (.8 + Math.random() * .4), C = SMOKE_C[kind] || SMOKE_C.warm, p = document.createElement('i');
    p.style.cssText = 'left:' + (q.left + q.width * at[0] - sr.left).toFixed(0) + 'px;top:' + (q.top + q.height * at[1] - sr.top).toFixed(0) + 'px;width:' + s.toFixed(1) + 'px;height:' + s.toFixed(1) + 'px;background:radial-gradient(closest-side,' + C[0] + ',' + C[1] + ' 48%,transparent)'; host.appendChild(p);
    var dx = -s * (lazy ? .5 + Math.random() * .6 : 1.1 + Math.random() * 1.3), dy = -s * (lazy ? 1.4 + Math.random() * .9 : 1.6 + Math.random() * 1.6), pk = big ? .92 : lazy ? .7 : .8, tr = function (f) { return 'calc(-50% + ' + (dx * f).toFixed(0) + 'px) calc(-50% + ' + (dy * f).toFixed(0) + 'px)'; };
    var an = p.animate([{ translate: '-50% -50%', scale: '.4', opacity: 0 }, { translate: tr(.16), scale: '1', opacity: pk, offset: .16 }, { translate: tr(.6), scale: '2', opacity: pk * .5, offset: .6 }, { translate: tr(1), scale: '2.9', opacity: 0 }], { duration: big ? 1900 : lazy ? 2700 : 1500, easing: 'ease-out', fill: 'forwards' }); an.onfinish = function () { p.remove(); };
    if (!lazy || Math.random() < .5) st2sfx(a, 'puff', lazy ? .12 : .1); }
  function smokeGo(a, id, names) { names.forEach(function (n, i) { var K = SMOKE[n]; if (!K) return; var calm = K[5] === 'calm';
      var tick = function () { if (a.comp() !== 's2_' + id) return; var r = a.layers()[K[0]], el = r && r.el;
        if (el && el.isConnected && (!DRAG[K[0]] || (calm ? !el.classList.contains('st2angry') : el.classList.contains('st2angry')))) { puffAt(a, K[0], K[1], K[2], K[4], false, calm); if (Math.random() < .5) puffAt(a, K[0], [K[1][0] + .012, K[1][1] + .01], K[2], K[4] * .8, false, calm); }
        seqT.push(a.sched(tick, K[3][0] + Math.random() * (K[3][1] - K[3][0]))); };
      seqT.push(a.sched(tick, calm ? 2600 + Math.random() * 2500 : 500 + i * 260)); }); }
  /* st2-16 · a blink (see EYES): the lids are a small layer laid exactly over the dragon's still (the same box, the same transform at that instant, so it sits on a
     breathing / trembling / mirrored figure), shown for the blink only. Skipped while the figure is hidden, mid-swap, moving in code, rising out of the water, or in
     the lunge of its angry tremble. Timers are sched (a pause holds them); the lid itself is a WAAPI animation inside #jjst (a pause freezes it mid-blink). */
  function blinkOne(a, key) { var r = a.layers()[key], el = r && r.el; if (!el || !el.isConnected || el.tagName !== 'IMG' || el._lids) return false;
    var name = String(r.src || '').split('/').pop().split('?')[0].replace(/\.webp$/, ''), K = EYES[name]; if (!K) return false;
    var cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity < .95) return false;
    var busy = el.getAnimations().some(function (x) { if (x.playState !== 'running') return false; var nm = x.animationName || ''; if (!nm) return true;   /* a code move (a press wiggle, the take-off) */
      if (nm === 'jjst2Rise') return true; if (nm === 'jjst2Angry') { var pg = x.effect && x.effect.getComputedTiming().progress; return pg > .56 && pg < .84; } return false; });   // (the lunge of the angry tremble)
    if (busy) return false;
    var h = document.createElement('div'); h.className = 'jjst-layer st2ph st2lids'; h.style.cssText = el.style.cssText + ';aspect-ratio:' + K[1] + ';height:auto;pointer-events:none;transition:none;animation:none;opacity:1;transform:' + cs.transform + ';transform-origin:' + cs.transformOrigin;
    h.innerHTML = K[2].map(function (e) { return '<i style="left:' + (e[0] * 100).toFixed(2) + '%;top:' + (e[1] * 100).toFixed(2) + '%;width:' + ((e[2] - e[0]) * 100).toFixed(2) + '%;height:' + ((e[3] - e[1]) * 100).toFixed(2) + '%;--lc:' + K[0] + '"></i>'; }).join('');
    el.parentNode.insertBefore(h, el.nextSibling); el._lids = h; var done = function () { if (h.parentNode) h.remove(); if (el._lids === h) el._lids = null; };
    [].forEach.call(h.children, function (i) { i.animate([{ transform: 'scaleY(.12)', opacity: 0 }, { transform: 'scaleY(1)', opacity: 1, offset: .26 }, { transform: 'scaleY(1)', opacity: 1, offset: .74 }, { transform: 'scaleY(.12)', opacity: 0 }], { duration: 230, easing: 'ease-in-out', fill: 'both' }); });
    a.sched(done, 250); return true; }   // (removed on the story's clock: a pause holds the blink, a resume finishes it)
  function blinkGo(a, id) { var sh = SHOTS[id] || {}; (sh.layers || []).forEach(function (l, i) { if (!l.src || !(EYES[l.src] || l.drag || l.poseSet === 'ice')) return;
      var tick = function () { if (a.comp() !== 's2_' + id) return; var ok = blinkOne(a, l.key); seqT.push(a.sched(tick, ok ? 3000 + Math.random() * 4000 : 700 + Math.random() * 500)); };
      seqT.push(a.sched(tick, 1800 + Math.random() * 3600 + i * 430)); }); }
  /* the big dragons calm down: each angry still's calm one fades in on top (on its own measured box: feet on the same line, head the same size), then the angry one is dropped */
  function calmGo(a, id, now) { var sh = SHOTS[id] || {}; if (a.comp() !== 's2_' + id) return; (sh.layers || []).forEach(function (l) { if (!l.drag) return; var c = {}, k; for (k in l) c[k] = l[k]; var g = drGeo(l.drag, 'calm'); c.pos = g.pos; c.src = g.src;
      layerSwap(a, l.key, g.src, layerDef('3', id, c).css, ['st2angry', 'st2breathe'], now ? 0 : 170); }); }
  /* a jet from a mouth to a target: water (an arc of droplets, a splash where it lands) or frost (a straight, glittering stream). p0 / p1 are stage points. */
  function jet(a, kind, p0, p1, ms) { var st = a.stage(); if (!st) return; var host = document.createElement('div'); host.className = 'st2jet ' + kind; st.appendChild(host);
    var water = kind === 'water', n = water ? 44 : 40, dist = Math.sqrt((p1[0] - p0[0]) * (p1[0] - p0[0]) + (p1[1] - p0[1]) * (p1[1] - p0[1])), lift = water ? dist * .26 : dist * .13, fly = water ? 520 : 460, W = st.clientWidth, H = st.clientHeight;
    /* the stream itself: a soft-edged stroke along the arc, drawn from the mouth to where it lands, held, then its tail runs in after it (the droplets ride on top) */
    var cx = (p0[0] + p1[0]) / 2, cy = (p0[1] + p1[1]) / 2 - lift * 2, d = 'M' + p0[0].toFixed(0) + ' ' + p0[1].toFixed(0) + 'Q' + cx.toFixed(0) + ' ' + cy.toFixed(0) + ' ' + p1[0].toFixed(0) + ' ' + p1[1].toFixed(0);
    host.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '"><defs><filter id="jjst2jb" x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation="' + (water ? 1.6 : 3.2) + '"/></filter></defs><g filter="url(#jjst2jb)" fill="none" stroke-linecap="round">' +
      '<path d="' + d + '" stroke="' + (water ? '#35b6f5' : '#a9d8ff') + '" stroke-opacity="' + (water ? .85 : .55) + '" stroke-width="' + (water ? 17 : 26) + '"/><path d="' + d + '" stroke="' + (water ? '#d8f6ff' : '#ffffff') + '" stroke-opacity=".95" stroke-width="' + (water ? 8 : 11) + '"/></g></svg>';
    [].forEach.call(host.querySelectorAll('path'), function (pt) { var Ln = pt.getTotalLength ? pt.getTotalLength() : dist * 1.2; pt.style.strokeDasharray = Ln + ' ' + Ln; pt.style.strokeDashoffset = Ln;
      if (pt.animate) pt.animate([{ strokeDashoffset: Ln }, { strokeDashoffset: 0, offset: 300 / (ms + 420) }, { strokeDashoffset: 0, offset: ms / (ms + 420) }, { strokeDashoffset: -Ln }], { duration: ms + 420, easing: 'linear', fill: 'both' }); });
    for (var i = 0; i < n; i++) (function (i) { var q0 = document.createElement('i'), sz = (water ? 12 + Math.random() * 12 : 8 + Math.random() * 10), jx = (Math.random() - .5) * dist * .05, jy = (Math.random() - .5) * dist * (water ? .06 : .1), kf = [];
      q0.style.cssText = 'left:' + p0[0].toFixed(0) + 'px;top:' + p0[1].toFixed(0) + 'px;width:' + sz.toFixed(1) + 'px;height:' + sz.toFixed(1) + 'px'; host.appendChild(q0);
      for (var q = 0; q <= 8; q++) { var t = q / 8, x = (p1[0] - p0[0] + jx) * t, y = (p1[1] - p0[1] + jy) * t - lift * 4 * t * (1 - t); kf.push({ translate: 'calc(-50% + ' + x.toFixed(0) + 'px) calc(-50% + ' + y.toFixed(0) + 'px)', opacity: q === 0 ? 0 : q === 8 ? 0 : 1, scale: String(.6 + .7 * t) }); }
      q0.animate(kf, { duration: fly * (.9 + Math.random() * .3), delay: i * (ms / n), easing: 'linear', fill: 'both' }).onfinish = function () { q0.remove(); }; })(i);
    setTimeout(function () { if (host.parentNode) host.remove(); }, ms + fly + 900); }
  /* a figure that is still most of the time: its clip holds its first frame and plays one pass every now and then (Clive's finger-and-foot tap: Joe found the constant loop distracting) */
  function restClip(a, id, key, rest) { var go = function () { var r = a.layers()[key], v = r && r.el; if (!v || v.tagName !== 'VIDEO' || String(a.comp()).indexOf('s2_' + id.replace(/[abct]$/, '')) !== 0) return;
      if (!v._restWired) { v._restWired = true; v.addEventListener('ended', function () { try { v.currentTime = 0; } catch (e) {} }); }
      try { v.currentTime = 0; } catch (e) {} var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); seqT.push(a.sched(go, rest[0] + Math.random() * (rest[1] - rest[0]))); };
    seqT.push(a.sched(go, rest[0] * .5 + Math.random() * (rest[1] - rest[0]))); }
  /* a narrow screen sees about a quarter of the board: it looks at whoever is speaking (and at the thing a prompt asks for), and back at the shot's own framing for narration */
  function panTo(a, shotId, key, ms) { var v = view(); if (v.D - v.W < 2) return; var sh = SHOTS[String(a.comp() || '').slice(3)] || SHOTS[shotId] || {}, l = (sh.layers || []).filter(function (x) { return x.key === key; })[0], jj = a.stage(); if (!sh.set || !l || !l.pos || !jj) return;
    var set = SETS[sh.set], home = camAt(sh.cam || { x: .5 }, null, v).x, vis = v.W / v.D, x = l.feet != null ? l.feet : l.pos[0], fw = l.feet != null ? Math.min(l.pos[2], .1) : l.pos[2], held = vis > .8 && x - fw / 2 > home - vis / 2 + .015 && x + fw / 2 < home + vis / 2 - .015;   /* (st2-15: by where he stands, not by his canvas: the peacekeeping poses sit on a wide one) */   /* st2-14: a wide screen that already holds the speaker keeps the shot's own framing (it used to drift ~100px toward a speaker near the edge) */
    var aim = held || Math.abs(home - x) < vis * .34 ? home : x + Math.max(-vis * .2, Math.min(vis * .2, home - x)), P = panOf({ x: aim }, set.km, v), cur = bpNow(jj);   // the speaker comes into view, leaning towards the shot's own centre (so the one they talk to stays in frame when it can)
    if (Math.abs(cur - P) > .004) bpGo([cur, P], [ms || 650]); }
  function panHome(a, shotId) { var v = view(); if (v.D - v.W < 2) return; var sh = SHOTS[String(a.comp() || '').slice(3)] || SHOTS[shotId] || {}, jj = a.stage(), c = sh.cam || {}; if (!sh.set || !jj || c.from || sh.then) return; var P = panOf(camAt(c.x != null ? c : { x: .5 }, null, v), SETS[sh.set].km, v), cur = bpNow(jj); if (Math.abs(cur - P) > .004) bpGo([cur, P], [650]); }
  /* ---- st2-14 · the frost dragon (see FROST): sit → rise → HOLD a growl frame → (on the advance) roar once → settle → sit. Every change of cut is a hard cut on the
     frame the two cuts share (the next cut is shown on top the moment it has a frame, then the last one is hidden): no dissolves, no loop pairs (rule 8). ---- */
  function frostShow(F, n) { var v = F.v[n]; if (F.cur === n) return; var old = F.cur ? F.v[F.cur] : null; F.cur = n; v.style.zIndex = '2'; v.style.opacity = '1';
    if (old && old !== v) { old.style.zIndex = '1'; var hide = function () { if (F.cur !== n) return; old.style.opacity = '0'; try { old.pause(); } catch (e) {} };
      if (v.readyState >= 2 || !v.requestVideoFrameCallback || v.paused) requestAnimationFrame(function () { requestAnimationFrame(hide); }); else v.requestVideoFrameCallback(hide); } }
  function frostPlay(F, n, from) { var v = F.v[n]; if (from != null) { try { v.currentTime = from; } catch (e) {} } if (!api.paused()) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else F.resume = v; }
  var ROAR_LVL = .3;   // the roar: clearly a roar, about 2 dB under the music at its full level (file mean -21.6 dB at .3 x the effects' gain; the music's full level is -37.6 dBFS mean)
  function frostEl(a) { var r = a.layers().frost, el = r && r.el; if (!el || el.tagName !== 'DIV') return null; if (el._fr) return el._fr;
    var F = el._fr = { el: el, v: {}, state: null, T: [], cur: null, puff: 0, go: false }; el.innerHTML = '';
    ['rise', 'angry', 'settle', 'calm'].forEach(function (n) { var v = clipVideo(a, FROSTCUT + n); v.style.opacity = '0'; v.style.transition = 'none'; el.appendChild(v); F.v[n] = v; });
    F.v.rise.addEventListener('ended', function () { if (F.state !== 'rise') return; F.state = 'growl'; frostShow(F, 'angry'); frostPlay(F, 'angry', 0); });   // up: straight on into the growl
    var holdNow = function (t) { var v = F.v.angry; if (F.state === 'growl' && !F.go && t >= FROSTHOLD) { try { v.pause(); } catch (e) {} F.state = 'hold'; el.classList.add('st2trem'); }
      if (F.state === 'roar' && !F.roared && t >= FROSTROAR[0] - .04 && !a.paused()) { F.roared = true; st2sfx(a, 'roar', ROAR_LVL); mlog('roar', { clip: +t.toFixed(2), level: ROAR_LVL }); } };   /* st2-25: his one roar (Joe's file), on the frame his mouth opens */   // he holds this growl frame while the sword is up
    var holdChk = function (now, md) { holdNow(md ? md.mediaTime : F.v.angry.currentTime); if (el.isConnected) F.v.angry.requestVideoFrameCallback(holdChk); }; if (F.v.angry.requestVideoFrameCallback) F.v.angry.requestVideoFrameCallback(holdChk);
    F.v.angry.addEventListener('timeupdate', function () { var v = F.v.angry, t = v.currentTime; holdNow(t);
      if (F.state === 'growl' && F.go && t >= FROSTHOLD) F.state = 'roar';
      if (F.state === 'roar' && !a.paused() && t >= FROSTROAR[0] && t <= FROSTROAR[1]) { var now = performance.now(); if (now - F.puff > 420) { F.puff = now; var st = a.stage(), q = el.getBoundingClientRect(), sr = st.getBoundingClientRect(); burst(q.left + q.width * FROSTMOUTH[0] - sr.left, q.top + q.height * FROSTMOUTH[1] - sr.top, 'cold'); } } });   // his breath, on the roar frames
    F.v.angry.addEventListener('ended', function () { if (F.state !== 'roar' && F.state !== 'growl') return; F.state = 'settle'; frostShow(F, 'settle'); frostPlay(F, 'settle', 0); });   // the roar is over: he folds down
    F.v.settle.addEventListener('ended', function () { if (F.state === 'settle') { F.state = 'sat'; el.classList.add('st2calm'); } });   // …and stays on the settle's last frame: sitting, happy
    return F; }
  function frostSit(F) { F.T.forEach(api.unsched); F.T = []; ['rise', 'angry', 'settle'].forEach(function (k) { try { F.v[k].pause(); } catch (e) {} }); try { F.v.calm.pause(); F.v.calm.currentTime = 0; } catch (e) {} F.state = 'sat'; F.go = false; F.el.classList.remove('st2trem'); F.el.classList.add('st2calm'); frostShow(F, 'calm'); }
  function frostGo(a, id, mode, jumping) { var F = frostEl(a); if (!F) return; F.T.forEach(a.unsched); F.T = [];
    if (mode === 'angry') { ['angry', 'settle', 'calm'].forEach(function (k) { try { F.v[k].pause(); F.v[k].currentTime = 0; } catch (e) {} }); F.go = false; F.state = 'sit0'; F.el.classList.remove('st2trem', 'st2calm'); try { F.v.rise.pause(); F.v.rise.currentTime = 0; } catch (e) {} frostShow(F, 'rise');
      F.T.push(a.sched(function () { if (!F.el.isConnected || F.state !== 'sit0') return; F.state = 'rise'; frostPlay(F, 'rise'); growlOn = true; ambPlan(id); mlog('growl-on', { level: AMB.growl.lvl }); }, 1500)); F.roared = false;
      }   // (st2-25: the growl is a low bed from his rise until 'Put that down!' (AMB.growl); no growls on a timer any more)   // sitting, calm, as the shot opens; up as Joe pulls his sword
    else if (mode === 'settle') { if (jumping || !F.state || F.state === 'sat') { frostSit(F); return; }
      F.go = true; F.el.classList.remove('st2trem');                                             // the advance: the roar, once, then the settle
      if (F.state === 'hold') { F.state = 'roar'; frostPlay(F, 'angry'); } else if (F.state === 'sit0') { F.state = 'rise'; frostPlay(F, 'rise'); } frostSure(a, F); }
    else if (F.state !== 'sat' && F.state !== 'settle' && F.state !== 'roar') frostSit(F); else if (F.state !== 'sat') frostSure(a, F); else F.el.classList.add('st2calm'); }   /* (st2-25 · A4: sat already: his breathing is put back — a shot's rebuild takes the class off the box) */
  function frostSure(a, F) { F.T.push(a.sched(function () { if (F.el.isConnected && F.state !== 'sat') frostSit(F); }, 6500)); }   /* st2-25 · A4: the roar and the settle are driven by the clips' own events; if one is missed (seen once in the audit's forward walk: he sat, but never took up his breathing) he is sat down by the clock, a moment after they would have finished */
  /* ---- st2-14 · THE FLYERS (rules 3 and 7): only the three flapping clips (story2-flyer-fire / -water / -frost), in every shot that has dragons in its sky. Each one
     appears in a small puff (a fire puff for the red, mist for the water, a frost sparkle for the frost), floats slowly FORWARD (the way it faces) on a gentle rise
     and dip for a while, vanishes in a puff, and after a beat reappears somewhere else, perhaps facing the other way. It never turns on screen (no mirrored flip),
     and it never fades under a bubble: it is placed clear of the bubble, the prompt, the pill, the sign and the transport, and if one of those arrives where it is,
     it puffs away and comes back in a free part of the sky. FLYK: clip, its w / h, its puff · FLYSETS: who flies where · FLYSIZE: width as a fraction of the layer. ---- */
  var FLYK = { fire: ['story2-flyer-fire', 360 / 302, 'fire'], water: ['story2-flyer-water', 360 / 336, 'mist'], frost: ['story2-flyer-frost', 360 / 356, 'frost'] };
  var FLYSETS = { clips: ['fire', 'water', 'frost'], ice: ['frost', 'frost', 'water'], water: ['water', 'water', 'frost'], fire: ['fire', 'fire', 'fire'], mix: ['fire', 'water', 'frost', 'fire'] }, FLYSIZE = .095;
  function flyLayer(a) { var L = a.layers(), k; for (k in L) if (/^fly/.test(k) && L[k].el && L[k].el.classList.contains('st2fly')) return L[k].el; return null; }
  function flyKeep(a) { var out = [].map.call(document.querySelectorAll('.jjst2-bub.on .pn,#jjst2-need.on .pp,#jjst2-pillw.on #jjst-hint,#jjst2-sign,#jjst-ctl,#jjst2-choice.on,#jjst .st2fx.flash'), function (k) { var r = k.getBoundingClientRect(); return [r.left - 22, r.top - 22, r.right + 22, r.bottom + 22]; });
    ((SHOTS[String(a.comp() || '').slice(3)] || {}).layers || []).forEach(function (l) { if (l.hot || l.glow || l.fx) return; var r = a.layers()[l.key], e = r && r.el; if (e && e.isConnected && e.style.visibility !== 'hidden') { var q = e.getBoundingClientRect(); out.push([q.left + q.width * .1, q.top, q.right - q.width * .1, q.bottom]); } });   // (never in front of a figure: they are far off)
    return out; }
  function flyGo(a) { var el = flyLayer(a); if (!el || el._fly) return; el._fly = true; var k0 = el.querySelector('[data-fly]'), kn = k0 ? k0.getAttribute('data-fly') : 'clips'; el.innerHTML = '';
    var kinds = FLYSETS[kn] || FLYSETS.clips, flyers = [], st = a.stage(), SC = function () { return (el.getBoundingClientRect().width / (el.offsetWidth || 1)) || 1; };   // (the layer rides a camera plate: screen px per layer px)
    var hit = function (r, keep) { return keep.some(function (k) { return r[0] < k[2] && r[2] > k[0] && r[1] < k[3] && r[3] > k[1]; }); };
    var spot = function (f) {                                   // a free place in the sky: clear of the bubble / prompt / pill / sign / transport, of the other flyers, and inside the view
      var box = el.getBoundingClientRect(), sr = st.getBoundingClientRect(), keep = flyKeep(a), w = box.width * FLYSIZE * f.sz, h = w / f.K[1], best = null;
      flyers.forEach(function (o) { if (o !== f && o.on) { var r = o.e.getBoundingClientRect(); keep.push([r.left - w * .5, r.top - h * .5, r.right + w * .5, r.bottom + h * .5]); } });
      for (var n = 0; n < 28; n++) { var dir = Math.random() < .5 ? -1 : 1, x = sr.left + sr.width * (.06 + Math.random() * .88) - w / 2, y = Math.max(sr.top + sr.height * .1, box.top) + Math.random() * Math.min(sr.height * .24, box.height * .8), dx = dir * w * (.9 + Math.random() * .9);
        if (x + Math.min(0, dx) < sr.left + 8 || x + w + Math.max(0, dx) > sr.right - 8) continue;
        var r = [Math.min(x, x + dx), y - h * .15, Math.max(x, x + dx) + w, y + h * 1.15]; if (!hit(r, keep)) { var sc = SC(); best = { x: (x - box.left) / sc, y: (y - box.top) / sc, dx: dx / sc, dir: dir }; break; } }
      return best; };
    var puff = function (f) { var r = f.e.getBoundingClientRect(), b = el.getBoundingClientRect(), sc = SC(), u = document.createElement('u'); u.className = 'pf ' + f.K[2]; u.style.cssText = 'left:' + ((r.left + r.width / 2 - b.left) / sc).toFixed(0) + 'px;top:' + ((r.top + r.height / 2 - b.top) / sc).toFixed(0) + 'px;width:' + (r.width * 1.5 / sc).toFixed(0) + 'px'; el.appendChild(u); if (Math.random() < .34) st2sfx(a, 'puff', .07);   /* (far background: one puff in three is heard, quietly) */
      if (u.animate) u.animate([{ scale: '.25', opacity: 0 }, { scale: '.8', opacity: 1, offset: .3 }, { scale: '1.05', opacity: .9, offset: .5 }, { scale: '1.5', opacity: 0 }], { duration: 560, easing: 'ease-out', fill: 'forwards' }); setTimeout(function () { if (u.parentNode) u.remove(); }, 640); };
    var away = function (f, wait) { if (!f.on) return; f.on = false; a.unsched(f.t); puff(f); setTimeout(function () { f.e.style.visibility = 'hidden'; if (f.an) { try { f.an.cancel(); } catch (x) {} f.an = null; } }, 170);   // gone under the thick of the puff
      f.t = a.sched(function () { come(f); }, wait == null ? 900 + Math.random() * 1500 : wait); };
    var come = function (f) { if (!el.isConnected) return; var p = spot(f); if (!p) { f.t = a.sched(function () { come(f); }, 1400); return; }
      var w = (el.offsetWidth || 1) * FLYSIZE * f.sz; f.e.style.cssText = 'left:' + p.x.toFixed(0) + 'px;top:' + p.y.toFixed(0) + 'px;width:' + w.toFixed(0) + 'px;aspect-ratio:' + f.K[1].toFixed(4) + ';--bd:' + f.bd + 's;visibility:hidden';
      f.g.style.transform = p.dir < 0 ? 'scaleX(-1)' : '';   /* (it is not on screen: it comes back already facing the way it will go) */
      f.on = true; puff(f); var life = 9000 + Math.random() * 7000;
      if (!a.paused()) { var vc = f.pair.filter(function (v) { return v.style.opacity === '1'; })[0] || f.pair[0]; if (vc.paused) { if (vc.ended) { try { vc.currentTime = 0; } catch (e) {} } var pc = vc.play(); if (pc && pc.catch) pc.catch(function () {}); } }   /* st2-26p: its clip was resting while it was away (below): it carries on from that frame, 170 ms before it is seen */
      setTimeout(function () { if (!f.on) return; f.e.style.visibility = 'visible'; if (f.e.animate) f.an = f.e.animate([{ translate: '0 0' }, { translate: p.dx.toFixed(0) + 'px 0' }], { duration: life + 400, easing: 'cubic-bezier(.3,0,.7,1)', fill: 'forwards' }); }, 170);
      f.t = a.sched(function () { away(f); }, life); };
    kinds.forEach(function (kind, i) { var K = FLYK[kind], f = { K: K, sz: 1 - (i % 3) * .12, bd: (3.8 + i * 1.1).toFixed(1), on: false, e: document.createElement('i'), g: document.createElement('b'), t: null, an: null };
      f.e.className = 'fc'; f.pair = relay([0, 1].map(function () { return clipVideo(a, K[0]); })); f.pair.forEach(function (v) { f.g.appendChild(v); }); f.e.appendChild(f.g); f.e.style.visibility = 'hidden'; el.appendChild(f.e); flyers.push(f);
      if (!a.paused()) { var pr = f.pair[0].play(); if (pr && pr.catch) pr.catch(function () {}); }
      f.t = a.sched(function () { come(f); }, 300 + i * 1300 + Math.random() * 600); });
    var iv = setInterval(function () { if (!el.isConnected) { clearInterval(iv); flyers.forEach(function (f) { a.unsched(f.t); }); return; } if (a.paused()) return; var keep = flyKeep(a);
      flyers.forEach(function (f) { if (!f.on && f.e.style.visibility === 'hidden') { f.pair.forEach(function (v) { if (!v.paused && v.readyState >= 2) { try { v.pause(); } catch (e) {} } }); return; }   /* st2-26p · puffed away = nothing to draw, so nothing is decoded (it was playing on unseen): the clip rests on its frame until it comes back */
        if (f.on && f.e.style.visibility === 'visible') { var r = f.e.getBoundingClientRect(); if (hit([r.left, r.top, r.right, r.bottom], keep)) away(f, 500 + Math.random() * 600); }   // something arrived where it floats: it puffs away and comes back elsewhere
        if (!f.pair.some(function (v) { return !v.paused; })) { var v0 = f.pair.filter(function (v) { return v.style.opacity === '1'; })[0] || f.pair[0]; if (v0.ended) { try { v0.currentTime = 0; } catch (e) {} } var pr = v0.play(); if (pr && pr.catch) pr.catch(function () {}); } }); }, 260); }
  /* st2-16 · after a resize (Joe: he dragged the pane narrower and back in the Clive shots, and Clive and the frost dragon were gone for good). Not reproduced in the
     lab (headless Chromium and the app's browser pane, single jumps and fast stepped drags: every layer stays in the DOM, opaque, in its state). What the two have in
     common is that they are PAUSED <video>s holding one frame (Clive's resting clip, the frost dragon's held cut); the stills and the playing clips stayed. A browser
     can drop a paused video's frame when its surface is rebuilt and never draw it again, because no new frame is coming. So, once a resize has settled (and when the
     page comes back into view): every paused / ended video that should be showing is made to present its frame again (a seek to where it already is), and every
     figure of the shot is checked — one left transparent with nothing standing in for it is brought back, and the frost dragon's current cut is re-shown. No state
     changes: the same pose, the same cut, the same frame, still paused. */
  function repaint() { var jj = api && api.stage(); if (!jj) return;
    [].forEach.call(jj.querySelectorAll('video'), function (v) { if (!v.isConnected || !v.offsetWidth || v.readyState < 1 || v.seeking) return; var cs = getComputedStyle(v); if (cs.visibility === 'hidden' || +cs.opacity < .05) return;
      try { if (v.ended && v.duration) { v.pause(); v.currentTime = Math.max(0, v.duration - .03); } else if (v.paused) v.currentTime = v.currentTime; } catch (e) {} });   // (an ended clip: just inside its last frame, so no second 'ended')
    var id = String(api.comp() || '').slice(3), sh = SHOTS[id]; if (!sh) return; var L = api.layers();
    (sh.layers || []).forEach(function (l) { var r = L[l.key], e = r && r.el; if (!e || !e.isConnected || l.hide || e._gone || e.style.visibility === 'hidden') return;
      if (l.multi) { var F = e._fr; if (F && F.cur && F.v[F.cur] && +getComputedStyle(F.v[F.cur]).opacity < .5) { Object.keys(F.v).forEach(function (k) { F.v[k].style.opacity = k === F.cur ? '1' : '0'; }); } return; }
      var covered = (actNow && actNow.key === l.key && actNow.v.isConnected) || (e._talk && e._talk._on); if (!covered && +getComputedStyle(e).opacity < .05 && !e._lateHide) { e.style.transition = 'none'; e.style.opacity = '1'; } }); }
  var repaintT = 0; function repaintSoon() { clearTimeout(repaintT); repaintT = setTimeout(repaint, 320); }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) repaintSoon(); });
  function onResize() { repaintSoon(); buildRigs(); var id = String(api.comp() || '').slice(3), sh = SHOTS[id]; if (sh && sh.live) { var lr = api.layers().live; if (lr && lr.el) liveTop(api, sh, lr.el); } if (sh && sh.set && !(sh.cam || {}).seq) { var v = view(); bpGo([panOf(camAt(sh.cam || { x: .5, z: 1 }, null, v), SETS[sh.set].km, v)]); } }   // (the engine re-poses its camera 200ms after a resize: it finds the new shots)

  /* ---- the skies: a gradient (the engine's board) + two code-built layers that ride the camera further back than the land: the far one
     carries the slow swirls (story-nightsky.svg's motifs, recoloured), the nearer one the drifting clouds / smoke. Everything moves by
     transform or opacity only (CSS animations inside #jjst: a pause holds them); every shape is blurred in its SVG: no edges. ---- */
  function skyGrad(sky) { var K = SKIES[sky]; return svgUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">' + K.g.map(function (q) { return '<stop offset="' + q[0] + '" stop-color="' + q[1] + '"/>'; }).join('') + '</linearGradient></defs><rect width="16" height="9" fill="url(#g)"/></svg>'); }
  function swirlSvg(m, c1, c2, op) { var M = MOTIFS[m], pad = 44; return svgUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + [-pad, -pad, M.w + 2 * pad, M.h + 2 * pad].join(' ') + '"><defs><filter id="b" x="-12%" y="-12%" width="124%" height="124%"><feGaussianBlur stdDeviation="8"/></filter></defs><g filter="url(#b)"><path d="' + M.p[0] + '" fill="' + c1 + '" fill-opacity="' + op + '"/>' + (M.p[1] ? '<path d="' + M.p[1] + '" fill="' + c2 + '" fill-opacity="' + (op * .85).toFixed(3) + '"/>' : '') + '</g></svg>'); }
  function lcg(seed) { var x = seed; return function () { x = (x * 9301 + 49297) % 233280; return x / 233280; }; }
  function cloudStrip(col, op, n, hb, seed, smoke) {            // a strip of soft puffs, one sky-box wide; none touches its ends, so two side by side loop without a seam
    var W = 2000, H = Math.round(W * (hb * 941) / (1.3 * 1672)), r = lcg(seed), g = '';
    for (var i = 0; i < n; i++) { var cx = W * (.07 + .86 * (i + .15 + r() * .7) / n), cy = H * (.42 + r() * .3), rx = H * (smoke ? .5 + r() * .5 : .34 + r() * .34), ry = H * (.1 + r() * .07), o = (op * (.7 + r() * .3)).toFixed(2);
      g += '<g fill="' + col + '" fill-opacity="' + o + '"><ellipse cx="' + cx.toFixed(0) + '" cy="' + cy.toFixed(0) + '" rx="' + rx.toFixed(0) + '" ry="' + ry.toFixed(0) + '"/>';
      for (var j = 0, m = 3 + Math.floor(r() * 3); j < m; j++) { var q = H * (.1 + r() * .11) * (smoke ? 1.25 : 1); g += '<circle cx="' + (cx + (r() - .5) * rx * 1.3).toFixed(0) + '" cy="' + (cy - ry * .4 - r() * q * .7).toFixed(0) + '" r="' + q.toFixed(0) + '"/>'; }
      g += '</g>'; }
    return svgUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none"><defs><filter id="b" x="-5%" y="-40%" width="110%" height="180%"><feGaussianBlur stdDeviation="' + (smoke ? 15 : 9) + '"/></filter></defs><g filter="url(#b)">' + g + '</g></svg>'); }
  var SX = function (x) { return ((x + .15) / 1.3 * 100).toFixed(2) + '%'; }, SY = function (y) { return ((y + .3) / 1.3 * 100).toFixed(2) + '%'; };   // a point of the board → the sky box (it overhangs the board: 15% each side, 30% above)
  function skyHtml(sky, near) { var K = SKIES[sky], h = '', r = lcg(near ? 7 : 3);
    if (!near) { K.sw.forEach(function (w, i) { h += '<i class="dr" style="left:' + SX(w[1]) + ';top:' + SY(w[2]) + ';width:' + (w[3] / 1.3 * 100).toFixed(2) + '%;--dd:' + (38 + i * 13) + 's"><img class="sw" alt="" src="' + swirlSvg(w[0], w[6], w[7], w[8]) + '" style="--d:' + w[4] + 's;animation-direction:' + (w[5] < 0 ? 'reverse' : 'normal') + '"></i>'; });
      if (K.shimmer) { h += '<i class="sun" style="left:' + SX(.62) + ';top:' + SY(.06) + '"></i>'; for (var i = 0; i < 14; i++) h += '<i class="tw" style="left:' + SX(r()) + ';top:' + SY(-.05 + r() * .42) + ';--d:' + (2.4 + r() * 3).toFixed(1) + 's;--dl:-' + (r() * 5).toFixed(1) + 's"></i>'; } }
    else K.cl.forEach(function (c, i) { var src = cloudStrip(c[3], c[4], c[5], c[1], 11 + i * 17 + sky.length, !K.shimmer); h += '<div class="cb" style="top:' + SY(c[0] - c[1] / 2) + ';height:' + (c[1] / 1.3 * 100).toFixed(2) + '%;--d:' + c[2] + 's;animation-delay:-' + Math.round(c[2] * (.2 + .45 * i)) + 's"><img alt="" src="' + src + '"><img alt="" src="' + src + '"></div>'; });
    return h; }
  var skyMemo = {};
  function skyLayer(sky, near) { var q = near ? SKY_NEAR : SKY_FAR, mk = sky + (near ? 'n' : 'f'); return skyMemo[mk] || (skyMemo[mk] = { key: (near ? 'skyNear_' : 'skyFar_') + sky, html: skyHtml(sky, near), cls: 'st2ph st2sky', css: onBoard(.5, 1, 1.3, q.k) + ';aspect-ratio:' + AR.toFixed(4) + ';z-index:0' }); }
  /* effects that sit on the land and ride it (a layer of markup placed exactly over the land's box; positions are fractions of the land art) */
  function fxHtml(kind) { var h = '', i, r = lcg(5), ph = phone() ? .6 : 1, P = function (v) { return (v * 100).toFixed(1) + '%'; };
    if (kind === 'oasis') {
      for (i = 0; i < 36 * ph; i++) h += '<i class="em" style="left:' + P(.01 + r() * .29) + ';top:' + P(.42 + r() * .5) + ';--s:' + (2 + r() * 3).toFixed(1) + 'px;--dx:' + (r() * 5 - 1.5).toFixed(1) + 'vw;--dy:-' + (9 + r() * 16).toFixed(1) + 'vh;--d:' + (4 + r() * 5).toFixed(1) + 's;--dl:-' + (r() * 9).toFixed(1) + 's"></i>';   // embers rising off the lava (left)
      [[.497, .388, 1], [.52, .545, 1.5], [.44, .548, 1], [.573, .415, .8], [.619, .527, 1], [.49, .682, 1.1], [.667, .672, 1.2]].forEach(function (f, n) {   // foam at the white feet of the waterfalls (middle)
        for (i = 0; i < 7; i++) h += '<i class="sp" style="left:' + P(f[0] + (r() - .5) * .02 * f[2]) + ';top:' + P(f[1] + (r() - .5) * .008) + ';--s:' + (1.7 * f[2] * (.8 + r() * .6)).toFixed(2) + '%;--d:' + (1.3 + r() * 1.1).toFixed(2) + 's;--dl:-' + (r() * 2.6).toFixed(2) + 's"></i>';
        for (i = 0; i < 2; i++) h += '<i class="dp" style="left:' + P(f[0] + (r() - .5) * .02) + ';top:' + P(f[1] - .004) + ';--dx:' + ((r() - .5) * 1.6).toFixed(1) + 'vw;--d:' + (.9 + r() * .7).toFixed(2) + 's;--dl:-' + (r() * 1.6).toFixed(2) + 's"></i>'; });   // st2-14: more churn and a few flying drops at every waterfall foot
      [[.5, .565, 5], [.47, .695, 6], [.585, .69, 6], [.69, .695, 5], [.54, .625, 4]].forEach(function (f) { for (i = 0; i < 2; i++) h += '<i class="rp" style="left:' + P(f[0] + (r() - .5) * .02) + ';top:' + P(f[1] + (r() - .5) * .006) + ';--s:' + (f[2] * (.8 + r() * .5)).toFixed(1) + '%;--d:' + (3 + r() * 2).toFixed(1) + 's;--dl:-' + (r() * 5).toFixed(1) + 's"></i>'; });   // ripples spreading on the pools
      [[.13, .51, 1.6], [.155, .62, 1.9], [.22, .655, 1.6], [.3, .685, 1.4], [.075, .57, 1.5]].forEach(function (f) { h += '<i class="fs" style="left:' + P(f[0]) + ';top:' + P(f[1]) + ';--s:' + f[2].toFixed(2) + '%;--d:' + (3.2 + r() * 2.6).toFixed(1) + 's;--dl:-' + (r() * 5).toFixed(1) + 's"></i>'; });   // spurts of fire off the lava
      for (i = 0; i < 46 * ph; i++) h += '<i class="sn" style="left:' + P(.62 + r() * .38) + ';top:' + P(-.04 + r() * .5) + ';--s:' + (2 + r() * 4).toFixed(1) + 'px;--dx:' + (r() * 4 - 2.5).toFixed(1) + 'vw;--dy:' + (22 + r() * 24).toFixed(1) + 'vh;--d:' + (6 + r() * 6).toFixed(1) + 's;--dl:-' + (r() * 12).toFixed(1) + 's"></i>'; }   // snow over the ice (right)
    else if (kind === 'gradeD') h = '<b class="gd"></b>';
    else if (kind === 'desert') {                              // fires in the ruins [x, y of the flame's foot, size]: the far house's window and roof, the near house's roof, a beam in the rubble, the well's broken frame, a stump out on the dunes
      [[.152, .557, .9], [.166, .425, 1.1], [.336, .503, 1.25], [.268, .6, .9], [.497, .545, 1.2], [.672, .592, .9]].forEach(function (f, n) {
        h += '<i class="gw" style="left:' + P(f[0]) + ';top:' + P(f[1] - .01) + ';--s:' + (9 * f[2]).toFixed(1) + '%;--d:' + (1.7 + r() * 1.2).toFixed(2) + 's;--dl:-' + (r() * 2).toFixed(2) + 's"></i>';
        for (i = 0; i < 2; i++) h += '<i class="fl" style="left:' + P(f[0] + (i ? .006 : 0) * f[2]) + ';top:' + P(f[1]) + ';--s:' + ((i ? 1.3 : 2.1) * f[2]).toFixed(2) + '%;--d:' + (.42 + r() * .4).toFixed(2) + 's;--dl:-' + (r() * 1).toFixed(2) + 's"></i>';
        for (i = 0; i < 5; i++) h += '<i class="sk" style="left:' + P(f[0]) + ';top:' + P(f[1] - .03 * f[2]) + ';--s:' + (2.2 * f[2]).toFixed(2) + '%;--dx:' + (4.5 + r() * 3).toFixed(1) + 'vw;--dy:-' + (9 + r() * 5).toFixed(1) + 'vh;--d:' + (4.2 + r() * 1.6).toFixed(2) + 's;--dl:-' + (i * 1.05 + r() * .4).toFixed(2) + 's"></i>'; });
      for (i = 0; i < 3; i++) { var bw0 = 70 + r() * 40; h += '<i class="db" style="top:' + P(.47 + i * .045) + ';--w:' + bw0.toFixed(0) + '%;--t:' + (25000 / bw0).toFixed(0) + '%;--hh:' + (9 + r() * 5).toFixed(1) + '%;--c:rgba(196,150,112,' + (.2 + r() * .1).toFixed(2) + ');--d:' + (30 + r() * 16).toFixed(1) + 's;--dl:-' + (r() * 40).toFixed(1) + 's"></i>'; }   // far dust along the horizon
      h += '<i class="hz"></i>'; }
    else if (kind === 'desert2') { h += '<b class="lgr"></b>';   // the land's darker grade, then thick dust in layers through the ruins (behind the figures)
      for (i = 0; i < 7; i++) { var far = i < 3; var bw1 = far ? 90 + r() * 50 : 60 + r() * 50; h += '<i class="db" style="top:' + P(far ? .43 + r() * .1 : .52 + r() * .16) + ';--w:' + bw1.toFixed(0) + '%;--t:' + (25000 / bw1).toFixed(0) + '%;--hh:' + (far ? 13 + r() * 6 : 16 + r() * 9).toFixed(1) + '%;--c:rgba(' + (far ? '150,96,62,' : '120,84,62,') + (far ? .34 + r() * .12 : .4 + r() * .14).toFixed(2) + ');--d:' + (far ? 22 + r() * 10 : 11 + r() * 7).toFixed(1) + 's;--dl:-' + (r() * 30).toFixed(1) + 's"></i>'; } }
    else if (kind === 'snow') {                                // the ice cliffs: snow falling everywhere, a few glints on the ice
      for (i = 0; i < 5; i++) h += '<i class="ms" style="left:' + P(.1 + r() * .8) + ';top:' + P(.6 + r() * .08) + ';--s:' + (12 + r() * 10).toFixed(1) + '%;--d:' + (10 + r() * 7).toFixed(1) + 's;--dl:-' + (r() * 16).toFixed(1) + 's"></i>';   // st2-14: snow blowing low over the lake
      for (i = 0; i < 64 * ph; i++) h += '<i class="sn" style="left:' + P(r()) + ';top:' + P(-.06 + r() * .62) + ';--s:' + (2 + r() * 4.5).toFixed(1) + 'px;--dx:' + (r() * 4 - 2.8).toFixed(1) + 'vw;--dy:' + (22 + r() * 26).toFixed(1) + 'vh;--d:' + (6 + r() * 6).toFixed(1) + 's;--dl:-' + (r() * 12).toFixed(1) + 's"></i>';
      for (i = 0; i < 18 * ph; i++) h += '<i class="gl" style="left:' + P(.05 + r() * .9) + ';top:' + P(.12 + r() * .5) + ';--s:' + (.5 + r() * .5).toFixed(2) + '%;--d:' + (2 + r() * 3).toFixed(1) + 's;--dl:-' + (r() * 5).toFixed(1) + 's"></i>'; }
    else if (kind === 'pools') {                               // the pools: foam and splashes at the white feet of the falls, mist lying over the water
      [[.275, .57, 1.3], [.33, .555, 1.5], [.385, .575, 1.2], [.52, .375, 1.1], [.5, .56, 1], [.545, .565, 1.4], [.76, .635, 1.3], [.8, .62, 1.3], [.715, .645, .8]].forEach(function (f) {
        for (i = 0; i < 7; i++) h += '<i class="sp" style="left:' + P(f[0] + (r() - .5) * .03 * f[2]) + ';top:' + P(f[1] + (r() - .5) * .01) + ';--s:' + (2.1 * f[2] * (.8 + r() * .6)).toFixed(2) + '%;--d:' + (1.5 + r() * 1.1).toFixed(2) + 's;--dl:-' + (r() * 2.6).toFixed(2) + 's"></i>';
        for (i = 0; i < 2; i++) h += '<i class="dp" style="left:' + P(f[0] + (r() - .5) * .03) + ';top:' + P(f[1] - .004) + ';--dx:' + ((r() - .5) * 2.2).toFixed(1) + 'vw;--d:' + (.9 + r() * .7).toFixed(2) + 's;--dl:-' + (r() * 1.6).toFixed(2) + 's"></i>'; });
      [[.411, .643, 7], [.545, .67, 8], [.679, .643, 7], [.5, .696, 9], [.321, .679, 7], [.75, .688, 7], [.6, .7, 6]].forEach(function (f) { for (i = 0; i < 2; i++) h += '<i class="rp" style="left:' + P(f[0] + (r() - .5) * .03) + ';top:' + P(f[1] + (r() - .5) * .008) + ';--s:' + (f[2] * (.8 + r() * .5)).toFixed(1) + '%;--d:' + (3 + r() * 2.2).toFixed(1) + 's;--dl:-' + (r() * 5).toFixed(1) + 's"></i>'; });   // st2-14: ripples spreading on the pool
      for (i = 0; i < 6; i++) h += '<i class="ms" style="left:' + P(.26 + r() * .5) + ';top:' + P(.56 + r() * .09) + ';--s:' + (12 + r() * 10).toFixed(1) + '%;--d:' + (9 + r() * 7).toFixed(1) + 's;--dl:-' + (r() * 16).toFixed(1) + 's"></i>'; }
    else if (kind === 'lava') {                                // the lava fields: embers rising, small flames flickering where the board paints its fires
      [[.304, .559, 2], [.451, .608, 2.3], [.618, .608, 2.2], [.745, .559, 2], [.549, .529, 1.7], [.382, .627, 2.1], [.2, .6, 1.8], [.86, .6, 1.8]].forEach(function (f) { h += '<i class="fs" style="left:' + P(f[0]) + ';top:' + P(f[1]) + ';--s:' + f[2].toFixed(2) + '%;--d:' + (2.8 + r() * 2.8).toFixed(1) + 's;--dl:-' + (r() * 5).toFixed(1) + 's"></i>'; });   // st2-14: spurts of fire off the lava, now and then
      for (i = 0; i < 46 * ph; i++) h += '<i class="em" style="left:' + P(.08 + r() * .86) + ';top:' + P(.42 + r() * .28) + ';--s:' + (2 + r() * 3).toFixed(1) + 'px;--dx:' + (r() * 5 - 2).toFixed(1) + 'vw;--dy:-' + (9 + r() * 18).toFixed(1) + 'vh;--d:' + (4 + r() * 5).toFixed(1) + 's;--dl:-' + (r() * 9).toFixed(1) + 's"></i>';
      [[.03, .17, 1.4], [.115, .445, 1.5], [.09, .63, 1.1], [.3, .545, .7], [.44, .485, .9], [.485, .48, .8], [.53, .505, .9], [.665, .545, 1.2], [.795, .555, 1], [.975, .42, 1.4], [.84, .7, 1.2]].forEach(function (f) {
        h += '<i class="fl" style="left:' + P(f[0]) + ';top:' + P(f[1]) + ';--s:' + (2.6 * f[2]).toFixed(2) + '%;--d:' + (.5 + r() * .5).toFixed(2) + 's;--dl:-' + (r() * 1).toFixed(2) + 's"></i>'; }); }
    else if (/^flyers/.test(kind)) {                            // dragons crossing the sky, far off: small, slow, each on its own path (behind the land's peaks: this layer sits under the land)
      var pick2 = kind.split(':')[1] || 'mix', pool = pick2 === 'mix' ? FLYERS.fire.concat(FLYERS.ice, FLYERS.water) : FLYERS[pick2], nf = pick2 === 'mix' ? 4 : 3;
      for (i = 0; i < nf; i++) { var fsrc = pool[Math.floor(r() * pool.length)], d = 34 + r() * 22, wv = (3.4 + r() * 2.2) * (pick2 === 'mix' && kind.indexOf('sky') < 0 ? 1 : 1);
        h += '<i class="fy" style="top:' + P(.06 + r() * .22) + ';width:' + wv.toFixed(2) + '%;--d:' + d.toFixed(1) + 's;--dl:-' + (r() * d).toFixed(1) + 's"><img alt="" src="' + api.GB + fsrc + '.webp' + api.AV + '" style="--bd:' + (2.2 + r() * 1.4).toFixed(1) + 's"></i>'; } }
    else if (kind === 'flash') {                               // the flashback: Part One's village board + Trogdor's fire clip (the same placing as the village shot), in a soft, wobbling window
      h = '<div class="pn"><img alt="" src="' + api.F('vil-bg') + '"><video muted loop playsinline autoplay preload="auto" poster="' + api.GB + 'story-vil-dragon-fire2-poster.webp' + api.AV + '">' + window.jjClipSrc(api.GB + 'story-vil-dragon-fire2', api.AV) + '</video><b></b></div>'; }
    return h; }

  /* ---- the comps: one per shot, from SHOTS ---- */
  var COMPS = {}, SHOT_SCENE = {}, pickLayers = [];
  function hotSvg(ar) { var h = Math.round(100 / ar); return svgUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 ' + h + '"><rect width="100" height="' + h + '" fill="#fff" fill-opacity="0"/></svg>'); }   // an unseen press area
  function glowSvg(col, ar) { var h = Math.round(200 / ar); return svgUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 ' + h + '"><defs><radialGradient id="g"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".2" stop-color="' + col + '" stop-opacity=".78"/><stop offset=".58" stop-color="' + col + '" stop-opacity=".24"/><stop offset="1" stop-color="' + col + '" stop-opacity="0"/></radialGradient></defs><ellipse cx="100" cy="' + (h / 2) + '" rx="100" ry="' + (h / 2) + '" fill="url(#g)"/></svg>'); }
  function clipGeo(l) { var c = CLIPS[l.vid], k = l.pos[2] / (c.box[2] - c.box[0]); return { k: k, w: c.w * k, cx: l.pos[0] + (l.flip ? -1 : 1) * (c.w / 2 - (c.box[0] + c.box[2]) / 2) * k, by: l.pos[1] + (c.h - c.box[3]) * k * AR }; }   // k: board widths per clip pixel
  /* a one-shot act over a figure's default clip: it is laid over the idle by the two crops' source offsets (so he doesn't shift), plays once, and
     the idle comes back under it as it fades (also if the shot changes or the clip never ends). It lives in #jjst: a pause holds it. */
  var actNow = null;
  function actOff(now) { var x = actNow; if (!x) return; actNow = null; api.unsched(x.t);
    if (!now && x.base && x.base.isConnected && x.base.tagName === 'IMG' && x.v.tagName === 'VIDEO' && x.v.parentNode === x.base.parentNode) { var bs = x.base; bs.style.transition = 'none'; bs.style.opacity = '0'; bs.parentNode.insertBefore(bs, x.v.nextSibling); void bs.offsetWidth; bs.style.transition = 'opacity .15s linear'; bs.style.opacity = '1';   /* (st2-25: a still under a clip: the still comes in on TOP, whole; then the clip goes) */
      setTimeout(function () { try { x.v.pause(); } catch (e) {} if (x.v.parentNode) x.v.remove(); if (bs.isConnected && !actNow) bs.style.transition = ''; }, 200); return; }
    if (x.base && x.base.isConnected) { x.base.style.transition = now ? 'none' : 'opacity .3s ease'; x.base.style.opacity = '1'; }
    if (now) { try { if (x.v.pause) x.v.pause(); } catch (e) {} if (x.v.parentNode) x.v.remove(); return; }
    setTimeout(function () { x.v.style.transition = 'none'; x.v.style.opacity = '0'; if (x.v.parentNode) x.v.remove(); if (x.base && x.base.isConnected && !actNow) x.base.style.transition = ''; }, 340); }   // the idle comes back whole under the act's last frame first, then the act is dropped (rule 8: never two half-faded copies)
  function playAct(a, name, shotId) { var A = ACTS[name], rec = A && a.layers()[A.key], base = rec && rec.el, sh = SHOTS[shotId] || {}, l = (sh.layers || []).filter(function (x) { return A && x.key === A.key; })[0];
    /* st2-25 · D7: an act over a POSE STILL (3.8: Clive is a still there). The still set and the idle clip are one figure at one scale (POSESETS: the 'folded' still IS the
       idle clip's own crop, 700 px across for the clip's 298), so the clip is laid where the idle clip would stand for this figure's feet and body line: same size, same
       feet (rule 6). Any lean or slump on the still eases out first; the clip comes in whole on top, then the still under it is hidden; at its end the still comes back
       in on top, whole, and the clip is dropped (rule 8). */
    var still = !!(base && base.tagName === 'IMG' && l && l.poseSet === 'clive' && A.over === 'story2-clive-idle');
    if (still) { var pb = poseBox('clive', 'folded', l.anchor, l.flip, l.s), lv = {}, kk; for (kk in l) lv[kk] = l[kk]; lv.vid = A.over; lv.pos = [pb.cx, l.pos[1], pb.w, pb.ar]; l = lv;
      if (base._cfx) { base.style.transition = 'rotate .22s ease, scale .22s ease'; base.style.rotate = ''; base.style.scale = ''; base._cfx = null; } }
    if (!base || !base.isConnected || (!still && base.tagName !== 'VIDEO') || !l || !l.pos || l.vid !== A.over) return; actOff(true);
    var I = CLIPS[A.over], X = CLIPS[A.vid], g = clipGeo(l), k = g.k, f = l.flip ? -1 : 1, set = SETS[sh.set] || { km: 1 };
    var v = document.createElement('video'); v.className = 'jjst-layer st2ph st2clip'; v.muted = true; v.loop = !!A.loop; v.playsInline = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.preload = 'auto';
    v.poster = a.GB + A.vid + '-poster.webp' + a.AV; v.innerHTML = window.jjClipSrc(a.GB + A.vid, a.AV);
    v.style.cssText = onBoard(g.cx + f * ((X.at[0] - I.at[0]) + (X.w - I.w) / 2) * k, g.by + ((X.at[1] + X.h) - (I.at[1] + I.h)) * k * AR, X.w * k, l.k != null ? l.k : set.km) + ';z-index:' + (base.style.zIndex || 3) + ';aspect-ratio:' + X.w + '/' + X.h + (l.flip ? ';--flip:-1' : '') + ';opacity:0;transition:opacity .14s linear';
    base.parentNode.insertBefore(v, base.nextSibling);
    if (A.from && v.animate) { var Dp = view().D; v.animate([{ translate: (f * A.from[0] * k * Dp).toFixed(1) + 'px ' + (A.from[1] * k * Dp).toFixed(1) + 'px' }, { translate: '0px 0px' }], { duration: A.ms, easing: 'ease-in-out', composite: 'add', fill: 'both' }); }
    var x = actNow = { v: v, base: base, t: null, key: A.key, A: A }, shown = false;
    v.addEventListener('playing', function () { if (shown || actNow !== x) return; shown = true; v.style.opacity = '1'; setTimeout(function () { if (actNow === x && base.isConnected) { base.style.transition = 'none'; base.style.opacity = '0'; } }, 190); });   // the act comes in on top, whole; only then does the idle under it go (rule 8)
    v.addEventListener('ended', function () { if (actNow === x && !A.stay) actOff(false); });
    if (!A.loop && !A.stay) x.t = a.sched(function () { if (actNow === x) actOff(false); }, A.ms + 1600);   // (a clip that never ended, or never started: the idle carries on)
    var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
  /* a still laid over a figure's clip (rule 8: in on top, then the clip under it is hidden); it leaves with the shot, like an act */
  function standIn(a, key, l, shotId) { var rec = a.layers()[key], base = rec && rec.el; if (!base || !base.isConnected) return null; var prev = actNow && actNow.key === key ? actNow : null; if (prev) a.unsched(prev.t); else actOff(true);
    var im = document.createElement('img'); im.alt = ''; im.className = 'jjst-layer st2ph st2still'; im.style.cssText = layerDef('3', shotId, l).css + ';opacity:0;transition:opacity .15s linear'; im.src = a.F(l.src); var under = prev ? prev.v : base; under.parentNode.insertBefore(im, under.nextSibling);
    var x = actNow = { v: im, base: base, t: null, key: key, A: { stay: true } }, go = function () { if (actNow !== x) { if (im.parentNode) im.remove(); return; } im.style.opacity = '1'; setTimeout(function () { if (prev && prev.v.parentNode) { try { if (prev.v.pause) prev.v.pause(); } catch (e) {} prev.v.remove(); } if (actNow === x && base.isConnected) { base.style.transition = 'none'; base.style.opacity = '0'; } }, 200); };   // (st2-15: it comes in over whatever is up — the sheath's last frame — and only then is that dropped)
    if (im.decode) im.decode().then(go, go); else im.onload = go; return im; }
  function layerDef(sceneN, id, l, parts) {
    if (l.pos) {                                              // on the board (the scenes with real boards)
      var set = SETS[(SHOTS[id] || {}).set] || { km: 1 }, z = l.z != null ? l.z : (l.kind === 'fx' && !l.hot ? 1 : 3);
      if (l.multi) return { key: l.key, html: '<i></i>', cls: 'st2ph st2multi', css: onBoard(l.pos[0], l.pos[1], l.pos[2], l.k != null ? l.k : set.km) + ';aspect-ratio:' + l.pos[3].toFixed(4) + ';z-index:' + z };   // a figure made of several cuts of one clip, stacked in one box (its videos are added when the shot lands: frostGo)
      if (l.fx) return { key: l.key, html: fxHtml(l.fx), cls: 'st2ph st2fx ' + l.fx, css: onBoard(l.pos[0], l.pos[1], l.pos[2], l.k != null ? l.k : set.km) + ';aspect-ratio:' + l.pos[3].toFixed(4) + ';z-index:' + z };   // an effect built of markup, on the board
      var b = { key: l.key, ar: l.pos[3], css: onBoard(l.pos[0], l.pos[1], l.pos[2], l.k != null ? l.k : set.km) + ';z-index:' + z + (l.flip ? ';--flip:-1' : '') + (l.hide ? ';visibility:hidden' : '') + (l.pos[3] > 0 ? ';aspect-ratio:auto ' + (+l.pos[3]).toFixed(4) : ''),   /* st2-25 · A4: a picture has its box before it has loaded (auto: its own shape once it is in). A bubble placed over a speaker whose picture was still on its way was measured against a figure of no height, and sat a head too low (seen after Prev / Next, when the picture is fetched again) */
        cls: 'st2ph' + (l.tap ? ' prop' : '') + (l.cls ? ' ' + l.cls : '') + (l.glow ? ' st2glow' : '') };
      if (typeof l.art === 'string') b.src = l.art;           // a depth layer cut from the board
      else if (l.vid) { var g = clipGeo(l), cs = CLIPS[l.vid];   // a keyed clip: its frame is placed so the figure inside it stands on the layer's pos
        var shz = ((SHOTS[id] || {}).cam || {}).z || 1, up = g.w * 1440 * (1 + (shz - 1) * (l.d != null ? l.d : set.depth || 1)) / cs.w, hi = STILLS[l.vid];
        if (hi && (up > UPSCALE || shz >= CLOSE_Z)) { b.src = hi[0]; b.ar = l.pos[3]; b.cls = 'st2ph st2breathe'; if (l.flip) b.css += ';--flip:-1'; if (l.css) b.css += ';' + l.css; return b; }   // the still, on the figure's own box (the clip's figure sits on the same box: no jump at the shot change)
        b.css = onBoard(g.cx, g.by, g.w, l.k != null ? l.k : set.km) + ';z-index:' + z + ';aspect-ratio:' + cs.w + '/' + cs.h + (l.flip ? ';--flip:-1' : '') + (l.hide ? ';visibility:hidden' : ''); b.vid = l.vid; b.ar = cs.w / cs.h; b.cls += ' st2clip'; if (l.hold) { b.hold = true; b.now = true; } if (cs.rest || /\bst2wait\b/.test(l.cls || '')) b.idle = true; }   // rest: it waits on its first frame; restClip plays it one pass at a time
      else if (l.src) b.src = l.src;                          // real art (or a Part One pose standing in)
      else if (l.hot) b.src = hotSvg(l.pos[3]);
      else if (l.glow) b.src = glowSvg(l.glow, l.pos[3]);
      else { b.src = figure(l.label + (l.pick ? ' (' + PICK[pick()].name + ')' : ''), l.pick ? PICK[pick()].tint : l.tint, l.ar, l.kind, l.pos[2] * 100); if (l.pick) pickLayers.push({ d: b, l: l }); }
      if (l.css) b.css += ';' + l.css;
      if (l.tap) { b.tap = 'x:' + id + ':' + l.key; b.aura = { glow: l.hot ? 'rgba(214,150,255,.5)' : 'rgba(255,214,120,.6)' }; }
      return b; }
    if (l.real) { var rr = l.real.split(':'), src = (api.comps()[rr[0]] || {}).layers || [];   // a Part One layer, as it stands (its own sound / press / label left behind)
      for (var i = 0; i < src.length; i++) if (src[i].key === rr[1]) { var cp = {}; for (var k in src[i]) cp[k] = src[i][k]; cp.key = l.key; delete cp.snd; delete cp.tap; delete cp.hero; delete cp.aura; delete cp.hint;
        if (l.fx) cp.css += ';filter:' + l.fx; if (l.tap) { cp.tap = 'x:' + id + ':' + l.key; cp.cls = (cp.cls ? cp.cls + ' ' : '') + 'prop'; cp.aura = { glow: 'rgba(214,120,255,.55)' }; } return cp; } }
    var css = 'left:' + l.box[0] + '%;bottom:' + (l.box[1] + GROUND) + 'vh;width:' + l.box[2] + 'vw' + (l.z != null ? ';z-index:' + l.z : (l.kind === 'fx' ? ';z-index:1' : ';z-index:3')) + (l.hide ? ';visibility:hidden' : '');
    if (l.ride) return { key: l.key, cls: 'st2ph st2ride', css: css + ';aspect-ratio:' + MOUNTW + '/' + MOUNTH, html: '<b><img alt="" src="' + api.GB + 'story2-mount.webp' + api.AV + '"><img alt="" src="' + api.GB + 'story2-joe-' + l.ride + '-rider-pack.webp' + api.AV + '" style="left:' + ((SADDLE[0] - HIPS[0] * RIDEK) / MOUNTW * 100).toFixed(2) + '%;top:' + ((SADDLE[1] - HIPS[1] * RIDEK) / MOUNTH * 100).toFixed(2) + '%;width:' + (RIDEW * RIDEK / MOUNTW * 100).toFixed(2) + '%"></b>' };   // st2-15: Joe in the saddle, on the mount (one layer: they bob together)
    var d = { key: l.key, css: css, cls: 'st2ph' + (l.tap ? ' prop' : '') };
    if (l.vid) { var cv = CLIPS[l.vid]; d.vid = l.vid; d.ar = cv.w / cv.h; d.css += ';aspect-ratio:' + cv.w + '/' + cv.h + (l.flip ? ';transform:scaleX(-1)' : ''); }   // a keyed clip that is in (the box's width is the clip's)
    else if (l.pickSrc) { var setP = function () { d.src = l.pickSrc[pick()]; }; setP(); d.cls += ' idle'; pickLayers.push({ d: d, l: l, art: setP }); }   // real art that depends on the egg picked (the babies)
    else if (l.src) { d.src = l.src; d.cls += ' ' + (l.cls || 'idle'); if (l.flip) d.css += ';--flip:-1'; }
    else if (l.art) { var f = fileOf(sceneN, l.name), setArt = function () { var fn = f + (l.pick ? '-' + pick() : ''); if (l.kind === 'clip') { d.vid = fn; d.ar = l.ar; } else d.src = fn; }; setArt(); if (l.pick) pickLayers.push({ d: d, l: l, art: setArt }); }   // real art: story2-<scene>-<name>[-frost|-ember]
    else { d.src = figure(l.label + (l.pick ? ' (' + PICK[pick()].name + ')' : ''), l.pick ? PICK[pick()].tint : l.tint, l.ar, l.kind, l.box[2]); if (l.pick) pickLayers.push({ d: d, l: l }); }
    if (l.tap) { d.tap = 'x:' + id + ':' + l.key; d.aura = { glow: 'rgba(255,214,120,.6)' }; }
    return d;
  }
  function refreshPick() { pickLayers.forEach(function (p) { if (p.art) { p.art(); return; } p.d.src = figure(p.l.label + ' (' + PICK[pick()].name + ')', PICK[pick()].tint, p.l.ar, p.l.kind, p.l.box ? p.l.box[2] : p.l.pos[2] * 100); }); }
  function buildComps() {
    var sc = null;
    S.forEach(function (it) { if (it.t === 'scene') sc = it; if (it.t !== 'shot') return; SHOT_SCENE[it.id] = sc; });
    Object.keys(SHOTS).forEach(function (id) { var sh = SHOTS[id], scn = SHOT_SCENE[id] || SHOT_SCENE[id.replace(/[abct]$/, '')], n = scn ? scn.n : '1', item = S.filter(function (x) { return x.t === 'shot' && x.id === id; })[0] || { frame: '', desc: '' };
      var c, parts = null, set = sh.set ? SETS[sh.set] : null;
      if (sh.reuse) { var base = api.comps()[sh.reuse] || {}; c = { bg: base.bg, bgFx: base.bgFx, pan: base.pan, snow: base.snow, layers: (base.layers || []).map(function (bl) { var cp = {}; for (var k in bl) if (k !== 'tap' && k !== 'hero' && k !== 'snd' && k !== 'hint') cp[k] = bl[k]; return cp; }) }; }   // a Part One shot as it stands (no bed, no cue)
      else if (set) { c = { bg: skyGrad(set.sky), layers: [skyLayer(set.sky, false), skyLayer(set.sky, true)] }; if (sh.cut) c.cut = true;   // a real set: the code-built sky, then the painted land and its other art layers under and over the figures
        var FLYL = !set.fly ? null : { key: 'fly_' + set.fly, html: '<i data-fly="' + set.fly + '"></i>', cls: 'st2ph st2fx st2fly', css: onBoard(.5, .5, 1.2, .8) + ';aspect-ratio:' + (AR * 2.4).toFixed(3) + ';z-index:1' };   // (a key per kind: the layer is only carried between shots that share it) st2-14: every set's flyers are the flapping clips (no still dragon flies anywhere)
        set.under.forEach(function (l) { if ((sh.omit || []).indexOf(l.key) < 0) c.layers.push(layerDef(n, id, l, parts)); });
        if (FLYL && (sh.omit || []).indexOf(FLYL.key) < 0) c.layers.push(FLYL); }   // the clip flyers hover over the land (it has almost no open sky), under the figures
      else if (sh.live) c = { bg: skyGrad(sh.sky), layers: [{ key: 'live', cls: 'st2ph st2live',   // a living clip, panned in code: the board under it is the next shot's own sky (so the hand-over is one dissolve), the layer holds the poster until the clip's first frame is drawn
        html: '<img alt="" src="' + api.GB + sh.live + '-poster.webp' + api.AV + '">', css: 'left:0;top:50%;width:max(' + (sh.fit || 130) + 'vw, 177.78vh);max-width:none;aspect-ratio:16/9;translate:0 -50%;z-index:1' }] };
      else { c = { bg: sh.bg || board(n, id, item.frame, item.desc, sh.mood || n, sh.card), layers: [] }; if (sh.bg && sh.bgFx) c.bgFx = sh.bgFx; }
      if (!set && sh.flyers) c.layers.push({ key: 'fly_' + sh.flyers, html: '<i data-fly="' + sh.flyers + '"></i>', cls: 'st2ph st2fx st2fly', css: 'left:0;top:0;width:100%;height:62%;z-index:1' });
      sh.layers.forEach(function (l) { c.layers.push(layerDef(n, id, l, parts)); });
      if (set) set.over.forEach(function (l) { c.layers.push(layerDef(n, id, l, parts)); });
      if (sh.dip) c.dip = sh.dip;
      COMPS['s2_' + id] = c; });
  }

  /* ---- the air: drifting ash and dust, embers and heat, mist and sparkle — drawn in code over the scene (screen space; CSS
     animations inside #jjst, so a pause holds them; none under reduced motion) ---- */
  var atmoEl = null, atmoKind = null;
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function atmoHtml(kind) { var h = '', i, n, ph = phone() ? .6 : 1, dust = kind === 'dust';
    var p = function (cls, v) { var st = ''; for (var k in v) st += '--' + k + ':' + v[k] + ';'; return '<i class="' + cls + '" style="' + st + '"></i>'; };
    if (kind === 'ash' || dust) {
      for (i = 0, n = (dust ? 48 : 30) * ph; i < n; i++) h += p('p', { x: rnd(-12, 96).toFixed(1) + '%', y: rnd(-4, 78).toFixed(1) + '%', s: rnd(2, 7).toFixed(1) + 'px', c: i % 5 ? 'rgba(210,200,194,.95)' : 'rgba(255,168,104,.95)', o: rnd(.25, .7).toFixed(2), dx: rnd(14, 36).toFixed(1) + 'vw', dy: rnd(2, 14).toFixed(1) + 'vh', d: rnd(dust ? 5 : 9, dust ? 10 : 18).toFixed(1) + 's', dl: (-rnd(0, 18)).toFixed(1) + 's' });
      for (i = 0, n = dust ? 7 : 3; i < n; i++) h += p('s', { y: rnd(dust ? 14 : 34, 58).toFixed(1) + '%', w: rnd(70, 110).toFixed(0) + 'vw', h: rnd(20, 36).toFixed(0) + 'vh', c: dust ? 'rgba(172,154,138,.5)' : 'rgba(132,118,126,.3)', d: rnd(dust ? 9 : 26, dust ? 15 : 40).toFixed(1) + 's', dl: (-rnd(0, 40)).toFixed(1) + 's' }); }
    else if (kind === 'storm' || kind === 'wind') { var st = kind === 'storm';   // st2-18 · the desert's wind, in front of everything: one way, left to right
      for (i = 0, n = (st ? 54 : 30) * ph; i < n; i++) h += p('p e', { x: rnd(-30, 96).toFixed(1) + '%', y: rnd(24, 92).toFixed(1) + '%', s: rnd(2, st ? 5.5 : 4.5).toFixed(1) + 'px', c: i % 3 ? 'rgba(255,170,64,1)' : 'rgba(255,226,150,1)', o: rnd(.55, .98).toFixed(2), dx: rnd(st ? 26 : 14, st ? 62 : 34).toFixed(1) + 'vw', dy: (-rnd(3, st ? 20 : 14)).toFixed(1) + 'vh', d: rnd(st ? 3.2 : 6, st ? 7 : 12).toFixed(1) + 's', dl: (-rnd(0, 12)).toFixed(1) + 's' });   // embers streaming on the wind
      for (i = 0, n = st ? 5 : 3; i < n; i++) h += p('s nw', { y: rnd(st ? 58 : 62, 84).toFixed(1) + '%', w: rnd(80, 130).toFixed(0) + 'vw', h: rnd(st ? 22 : 16, st ? 34 : 24).toFixed(0) + 'vh', c: st ? 'rgba(124,86,62,.5)' : 'rgba(170,128,96,.3)', d: rnd(st ? 6.5 : 13, st ? 11 : 20).toFixed(1) + 's', dl: (-rnd(0, 30)).toFixed(1) + 's' });   // big near wisps, low across the ground (under Joe's face and the bubble)
      if (st) for (i = 0; i < 3; i++) h += p('s nw', { y: rnd(40, 54).toFixed(1) + '%', w: rnd(90, 140).toFixed(0) + 'vw', h: rnd(16, 24).toFixed(0) + 'vh', c: 'rgba(150,100,70,.24)', d: rnd(15, 24).toFixed(1) + 's', dl: (-rnd(0, 30)).toFixed(1) + 's' });   // thinner dust higher up, slower
      for (i = 0, n = st ? 3 : 1; i < n; i++) { var ex = [8, 78, 52][i], ey = [62, 66, 80][i], ed = '';   // slow eddies of ash near the ground, away from Joe
        for (var q = 0; q < 8; q++) ed += '<u style="--a:' + Math.round(q * 45 + rnd(-14, 14)) + 'deg;--r:' + rnd(18, 48).toFixed(0) + '%;--z:' + rnd(3, 7).toFixed(1) + 'px;--o:' + rnd(.35, .8).toFixed(2) + '"></u>';
        h += '<i class="ed" style="--x:' + ex + '%;--y:' + ey + '%;--s:' + rnd(15, 22).toFixed(1) + 'vw;--d:' + rnd(11, 17).toFixed(1) + 's;--dd:' + rnd(19, 27).toFixed(1) + 's;--dl:-' + rnd(0, 20).toFixed(1) + 's"><b></b>' + ed + '</i>'; }
      for (i = 0; i < 4; i++) h += p('m w', { x: rnd(4, 84).toFixed(1) + '%', y: rnd(44, 56).toFixed(1) + '%', s: rnd(12, 22).toFixed(1) + 'vw', d: rnd(7, 12).toFixed(1) + 's', dl: (-rnd(0, 12)).toFixed(1) + 's' });   // heat rising off the dunes
      h += '<i class="h"></i><i class="h b"></i>' + (st ? '<i class="vg"></i>' : ''); }
    else if (kind === 'embers') {
      for (i = 0, n = 36 * ph; i < n; i++) h += p('p e', { x: rnd(4, 112).toFixed(1) + '%', y: rnd(22, 92).toFixed(1) + '%', s: rnd(2, 5).toFixed(1) + 'px', c: i % 3 ? 'rgba(255,176,72,1)' : 'rgba(255,224,150,1)', o: rnd(.5, .95).toFixed(2), dx: (-rnd(8, 26)).toFixed(1) + 'vw', dy: (-rnd(8, 32)).toFixed(1) + 'vh', d: rnd(6, 13).toFixed(1) + 's', dl: (-rnd(0, 13)).toFixed(1) + 's' });
      for (i = 0; i < 3; i++) h += p('s', { y: rnd(30, 56).toFixed(1) + '%', w: rnd(70, 100).toFixed(0) + 'vw', h: rnd(18, 30).toFixed(0) + 'vh', c: 'rgba(206,150,104,.24)', d: rnd(30, 46).toFixed(1) + 's', dl: (-rnd(0, 46)).toFixed(1) + 's' });
      for (i = 0; i < 5; i++) h += p('m w', { x: rnd(4, 84).toFixed(1) + '%', y: rnd(44, 56).toFixed(1) + '%', s: rnd(12, 22).toFixed(1) + 'vw', d: rnd(7, 12).toFixed(1) + 's', dl: (-rnd(0, 12)).toFixed(1) + 's' });   // heat rising off the dunes
      h += '<i class="h"></i><i class="h b"></i>'; }
    else if (kind === 'oasis') {                              // (its embers, foam and snow sit on the land itself: fxHtml)
      for (i = 0, n = 16 * ph; i < n; i++) h += p('p', { x: rnd(0, 96).toFixed(1) + '%', y: rnd(20, 80).toFixed(1) + '%', s: rnd(2, 5).toFixed(1) + 'px', c: 'rgba(255,250,214,.95)', o: rnd(.35, .8).toFixed(2), dx: rnd(4, 14).toFixed(1) + 'vw', dy: (-rnd(4, 14)).toFixed(1) + 'vh', d: rnd(10, 18).toFixed(1) + 's', dl: (-rnd(0, 18)).toFixed(1) + 's' }); }
    return h; }
  function atmo(kind, pocket) { var st = api.stage(); if (!st) return; if (pocket && phone()) pocket = [.5, .42];   /* (a phone looks at whoever is thinking: he is in the middle) */ if (atmoEl) { atmoEl.style.setProperty('--px', ((pocket ? pocket[0] : .5) * 100).toFixed(0) + '%'); atmoEl.style.setProperty('--py', ((pocket ? pocket[1] : .4) * 100).toFixed(0) + '%'); atmoEl.classList.toggle('pk', !!pocket); } if (kind === atmoKind) return; atmoKind = kind;
    if (!atmoEl) { atmoEl = document.createElement('div'); atmoEl.id = 'jjst2-atmo'; atmoEl.style.setProperty('--px', ((pocket ? pocket[0] : .5) * 100).toFixed(0) + '%'); atmoEl.style.setProperty('--py', ((pocket ? pocket[1] : .4) * 100).toFixed(0) + '%'); atmoEl.classList.toggle('pk', !!pocket); }
    if (!atmoEl.isConnected) st.appendChild(atmoEl);
    [].forEach.call(atmoEl.children, function (o) { o.classList.remove('on'); setTimeout(function () { if (o.parentNode && !o.classList.contains('on')) o.remove(); }, 1500); });
    if (!kind) return; var s = document.createElement('div'); s.className = 'set'; s.innerHTML = atmoHtml(kind); atmoEl.appendChild(s); if (api.pfx) api.pfx(s);   /* st2-26p: the flecks and wind embers are drawn on one canvas (storytime.js, PFX); the wisps, eddies, heat and haze stay elements */ void s.offsetWidth; s.classList.add('on'); }
  /* a soft burst at a point of the stage: the ash Joe lands in, the spark a press on the dead portal gets */
  function burst(x, y, kind) { var st = api.stage(); if (!st) return; var e = document.createElement('i'); e.className = 'jjst2-burst ' + kind; e.style.left = Math.round(x) + 'px'; e.style.top = Math.round(y) + 'px'; st.appendChild(e);
    if (e.animate) e.animate(kind === 'ash' || kind === 'water' || kind === 'cold' ? [{ scale: '.25', opacity: 0 }, { scale: '.8', opacity: .9, offset: .2 }, { scale: '1.7', opacity: 0 }] : [{ scale: '.2', opacity: 0 }, { scale: '1', opacity: 1, offset: .15 }, { scale: '.6', opacity: .2, offset: .4 }, { scale: '1.15', opacity: .9, offset: .55 }, { scale: '1.4', opacity: 0 }], { duration: kind === 'ash' || kind === 'cold' ? 1600 : kind === 'water' ? 1000 : 900, easing: 'ease-out', fill: 'forwards' });
    setTimeout(function () { if (e.parentNode) e.remove(); }, 2100); }

  /* ---- styles: bubbles, cards, pills, cuts — five themes (html[data-jj-theme]) ---- */
  var FONT = "'Joes Journey Headline','Joes Journey',sans-serif";
  function css() {
    var T = function (t, r) { return r.split(',').map(function (x) { return 'html[data-jj-theme="' + t + '"] ' + x; }).join(','); }, P = '.jjst2-card';
    var CL = function (r) { return r.split(',').map(function (x) { return 'html:not([data-jj-theme]) ' + x + ',html[data-jj-theme="classic"] ' + x; }).join(','); };   // classic only (the other themes keep the site's own themed Next)
    var st = document.createElement('style'); st.id = 'jjst2-css'; st.textContent =
    '#jjst .st2ph{pointer-events:none;}#jjst .st2ph.prop{pointer-events:auto;cursor:pointer;}' +
    '#jjst .jjst-layer.st2clip{transform:scaleX(var(--flip,1));}' +   // a keyed clip: --flip:-1 faces it the other way (its entrances and exits keep the flip)
    '@keyframes jjst2FlyIn{0%{transform:translate(95vw,-16vh) scaleX(var(--flip,1)) rotate(10deg);}72%{transform:translate(-1.6vw,.8vh) scaleX(var(--flip,1)) rotate(-3deg);}100%{transform:translate(0,0) scaleX(var(--flip,1));}}' +   // Grik in from off screen right, to nose-to-nose
    '@keyframes jjst2FlyOut{0%{transform:translate(0,0) scaleX(var(--flip,1));}20%{transform:translate(-2.2vw,1vh) scaleX(var(--flip,1));}100%{transform:translate(115vw,-20vh) scaleX(var(--flip,1));}}' +   // …and off right again, full size
    '#jjst .jjst-layer.st2walk{animation:jjst2WalkIn 3.42s linear both;}@keyframes jjst2WalkIn{from{transform:translateX(-58%);}to{transform:translateX(0);}}' +   // the walk-up clip carried in from the left as it plays (it walks 23% of its own frame by itself)
    '#jjst .jjst-layer.st2mirage{transform-origin:50% 100%;animation:jjst2Mirage 2.6s ease-in-out infinite alternate;}@keyframes jjst2Mirage{0%{transform:scaleY(1) skewX(-2.5deg);}100%{transform:scaleY(1.07) skewX(2.5deg) translateY(-1%);}}' +
    '#jjst .jjst-layer.st2shake{animation:jjst2Shake .17s linear infinite;}@keyframes jjst2Shake{0%,100%{transform:translate(0,0) scaleX(var(--flip,1));}25%{transform:translate(.13vw,-.05vw) scaleX(var(--flip,1));}50%{transform:translate(-.11vw,.06vw) scaleX(var(--flip,1));}75%{transform:translate(.08vw,.07vw) scaleX(var(--flip,1));}}' +
    '#jjst .jjst-layer.st2still{transform:scaleX(var(--flip,1));}' +
    '#jjst .jjst-layer.st2angry{transform-origin:60% 100%;animation:jjst2Angry 2.6s linear infinite;}@keyframes jjst2Angry{0%,100%{transform:translate(0,0);}4%{transform:translate(-.06vw,.03vw);}8%{transform:translate(.05vw,-.02vw);}12%{transform:translate(-.05vw,.02vw);}16%{transform:translate(.04vw,0);}20%{transform:translate(-.04vw,.02vw);}24%{transform:translate(.05vw,-.02vw);}28%{transform:translate(0,0);}60%{transform:translate(0,0);}66%{transform:translate(-.5vw,.22vw) rotate(-4deg);}74%{transform:translate(-.1vw,.04vw) rotate(-1deg);}80%{transform:translate(0,0);}84%{transform:translate(-.05vw,.02vw);}88%{transform:translate(.05vw,-.02vw);}92%{transform:translate(-.04vw,.02vw);}96%{transform:translate(.04vw,0);}}' +   // the frost dragon, angry: a tremble, and now and then a quick head-down lunge of a few pixels
    '.jjst2-burst.cold{width:7vw;height:6vw;margin:-4vw 0 0 -3.5vw;background:radial-gradient(closest-side,rgba(236,248,255,.9),rgba(190,226,255,.45) 55%,transparent);}' +
    '#jjst .jjst-layer.st2snarl{transform-origin:60% 100%;animation:jjst2Snarl .26s linear infinite;}@keyframes jjst2Snarl{0%,100%{transform:scaleX(var(--flip,1)) translate(0,0) rotate(0);}25%{transform:scaleX(var(--flip,1)) translate(-.12vw,.04vw) rotate(-.5deg);}75%{transform:scaleX(var(--flip,1)) translate(.1vw,-.03vw) rotate(.4deg);}}' +   // Ember's low snarl: a wary tremble
    /* the sky: swirls turn and drift, cloud strips pass, the oasis shimmers (transform + opacity only) */
    '#jjst .jjst-layer.st2sky,#jjst .jjst-layer.st2fx{overflow:visible;pointer-events:none;}' +
    '.st2sky .dr{position:absolute;display:block;translate:-50% -50%;animation:jjst2SkyDrift var(--dd,40s) ease-in-out infinite alternate;}@keyframes jjst2SkyDrift{from{transform:translate(-3%,-1.5%);}to{transform:translate(3%,1.5%);}}' +
    '.st2sky .sw{display:block;width:100%;max-width:none;height:auto;animation:jjst2Spin var(--d,240s) linear infinite;}@keyframes jjst2Spin{to{transform:rotate(360deg);}}' +
    '.st2sky .cb{position:absolute;left:0;width:200%;display:flex;animation:jjst2Cloud var(--d,150s) linear infinite;}.st2sky .cb img{display:block;width:50%;max-width:none;height:100%;flex:none;}@keyframes jjst2Cloud{to{transform:translateX(-50%);}}' +
    '.st2sky .sun{position:absolute;display:block;width:46%;aspect-ratio:1;translate:-50% -50%;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.5),rgba(255,255,255,.16) 45%,rgba(255,255,255,0));animation:jjst2Sun 7s ease-in-out infinite alternate;}@keyframes jjst2Sun{from{transform:scale(.92);opacity:.55;}to{transform:scale(1.08);opacity:1;}}' +
    '.st2sky .tw{position:absolute;display:block;width:.55%;aspect-ratio:1;border-radius:50%;background:radial-gradient(closest-side,#fff,rgba(255,255,255,0));opacity:0;animation:jjst2Twk var(--d) ease-in-out var(--dl) infinite;}' +
    /* effects on the land: embers off the lava, foam at the falls, snow on the ice; the flashback window */
    '.st2fx>i{position:absolute;display:block;border-radius:50%;opacity:0;}' +
    '.st2fx .em{width:var(--s);height:var(--s);--o:.95;background:radial-gradient(closest-side,#ffe9a8,#ff9a3a 55%,rgba(255,120,40,0));box-shadow:0 0 6px 1px rgba(255,130,40,.6);animation:jjst2Ember var(--d) linear var(--dl) infinite;}' +
    '.st2fx .sn{width:var(--s);height:var(--s);--o:.9;background:radial-gradient(closest-side,#fff,rgba(255,255,255,0));animation:jjst2Fleck var(--d) linear var(--dl) infinite;}' +
    '.st2fx .sp{width:var(--s);aspect-ratio:1.6;translate:-50% -60%;background:radial-gradient(closest-side,rgba(255,255,255,.95),rgba(255,255,255,.4) 55%,rgba(255,255,255,0));animation:jjst2Foam var(--d) ease-out var(--dl) infinite;}@keyframes jjst2Foam{0%{transform:scale(.35) translateY(20%);opacity:0;}25%{opacity:.9;}100%{transform:scale(1.35) translateY(-35%);opacity:0;}}' +
    '.st2fx .gl{width:var(--s);aspect-ratio:1;translate:-50% -50%;background:radial-gradient(closest-side,#fff,rgba(255,255,255,0));animation:jjst2Twk var(--d) ease-in-out var(--dl) infinite;}' +
    '.st2fx .dp{width:.45%;aspect-ratio:1;background:radial-gradient(closest-side,#fff,rgba(255,255,255,0));animation:jjst2Drop var(--d) ease-out var(--dl) infinite;}@keyframes jjst2Drop{0%{transform:translate(0,0);opacity:0;}15%{opacity:.95;}55%{transform:translate(calc(var(--dx) * .6),-2.6vh);opacity:.9;}100%{transform:translate(var(--dx),.6vh);opacity:0;}}' +
    '.st2fx .ms{width:var(--s);aspect-ratio:2.2;translate:-50% -50%;background:radial-gradient(closest-side,rgba(255,255,255,.34),rgba(255,255,255,0));animation:jjst2Mist var(--d) ease-in-out var(--dl) infinite;}@keyframes jjst2Mist{0%{transform:translate(-1.5vw,1vh);opacity:0;}35%{opacity:1;}100%{transform:translate(2.5vw,-3vh);opacity:0;}}' +
    '.st2fx .fl{width:var(--s);aspect-ratio:.62;translate:-50% -86%;transform-origin:50% 100%;border-radius:50% 50% 46% 46% / 72% 72% 28% 28%;background:radial-gradient(ellipse 60% 70% at 50% 72%,rgba(255,244,190,.95),rgba(255,170,60,.75) 45%,rgba(255,90,30,0) 100%);animation:jjst2Flame var(--d) ease-in-out var(--dl) infinite alternate;}' +
    '@keyframes jjst2Flame{0%{transform:scale(.82,.7) skewX(-5deg);opacity:.5;}55%{transform:scale(1.06,1.12) skewX(4deg);opacity:.9;}100%{transform:scale(.92,.95) skewX(-2deg);opacity:.72;}}' +
    '#jjst .jjst-layer.st2rise{animation:jjst2Rise 1.5s cubic-bezier(.2,.8,.3,1) .5s both,jjst-idle 2.6s ease-in-out 2s infinite;}@keyframes jjst2Rise{0%{transform:translateY(58%);clip-path:inset(0 0 58% 0);}100%{transform:translateY(0);clip-path:inset(0 0 0 0);}}' +   // the water dragon rises out of the pool: the water line holds still as he comes up
    '.jjst2-burst.ice{width:7vw;height:7vw;margin:-3.5vw 0 0 -3.5vw;background:radial-gradient(closest-side,#fff,rgba(190,236,255,.85) 30%,rgba(140,210,255,.3) 60%,transparent);}.jjst2-burst.water{width:10vw;height:6vw;margin:-3vw 0 0 -5vw;background:radial-gradient(closest-side,rgba(255,255,255,.95),rgba(120,220,255,.6) 45%,transparent);}' +
    /* st2-18 · the desert's weather on the land (all gradients: no edges; transform / opacity only) */
    '.st2fx.gradeD .gd{position:absolute;inset:0;display:block;background:linear-gradient(180deg,rgba(10,5,8,.94) 0%,rgba(30,11,10,.86) 16%,rgba(84,28,10,.62) 34%,rgba(150,58,16,.3) 48%,rgba(160,70,24,0) 60%);}' +
    '.st2fx.desert2 .lgr{position:absolute;inset:0;translate:none;width:auto;aspect-ratio:auto;display:block;background:radial-gradient(ellipse 62% 70% at 50% 56%,rgba(20,8,6,0) 30%,rgba(20,8,6,.5) 100%),linear-gradient(180deg,rgba(40,14,8,0) 46%,rgba(40,14,8,.34) 58%,rgba(26,10,8,.22) 78%,rgba(14,6,6,.55) 100%);}' +
    '.st2fx .gw{width:var(--s);aspect-ratio:1.25;translate:-50% -50%;background:radial-gradient(closest-side,rgba(255,196,96,.62),rgba(255,132,40,.3) 46%,rgba(255,110,30,0));animation:jjst2FGlow var(--d) ease-in-out var(--dl) infinite alternate;}@keyframes jjst2FGlow{from{transform:scale(.86);opacity:.62;}to{transform:scale(1.1);opacity:1;}}' +
    '.st2fx .sk{width:var(--s);aspect-ratio:1;translate:-50% -50%;background:radial-gradient(closest-side,rgba(52,40,40,.62),rgba(60,48,46,.3) 55%,rgba(60,48,46,0));animation:jjst2FSmoke var(--d) linear var(--dl) infinite;}@keyframes jjst2FSmoke{0%{transform:translate(0,0) scale(.5);opacity:0;}12%{opacity:.85;}55%{transform:translate(calc(var(--dx) * .38),calc(var(--dy) * .62)) scale(1.5);opacity:.55;}100%{transform:translate(var(--dx),var(--dy)) scale(2.6);opacity:0;}}' +   // a fire's smoke: up, then bent over by the wind
    '.st2fx .db{left:-145%;width:var(--w);height:var(--hh);background:radial-gradient(closest-side,var(--c),transparent);animation:jjst2DBand var(--d) linear var(--dl) infinite;opacity:1;}@keyframes jjst2DBand{from{transform:translateX(0);}to{transform:translateX(var(--t));}}' +   // a band of dust crossing the land
    '.st2fx .hz{left:-6%;width:112%;top:49%;height:11%;border-radius:50%;background:radial-gradient(closest-side,rgba(255,206,150,.26),rgba(255,206,150,.1) 60%,transparent);animation:jjst2Shim 2.6s ease-in-out infinite alternate;}' +
    '#jjst2-atmo .vg{inset:0;background:radial-gradient(ellipse 78% 72% at 50% 44%,rgba(8,3,4,0) 52%,rgba(8,3,4,.5) 100%),linear-gradient(180deg,rgba(8,3,4,.34),rgba(8,3,4,0) 22%,rgba(8,3,4,0) 78%,rgba(8,3,4,.42));}' +   // the storm: a low vignette
    '#jjst2-atmo.pk .set{-webkit-mask-image:radial-gradient(ellipse 15vw 38vh at var(--px) var(--py),rgba(0,0,0,.28) 42%,#000 100%);mask-image:radial-gradient(ellipse 15vw 38vh at var(--px) var(--py),rgba(0,0,0,.28) 42%,#000 100%);}' +   // a clearer pocket round Joe: the dust and embers thin out there
    '#jjst2-atmo .ed{left:var(--x);top:var(--y);width:var(--s);height:calc(var(--s) * .42);translate:-50% -50%;animation:jjst2EdDrift var(--dd) ease-in-out var(--dl) infinite alternate;}@keyframes jjst2EdDrift{from{transform:translateX(-5vw);}to{transform:translateX(7vw);}}' +
    '#jjst2-atmo .ed b{position:absolute;inset:0;display:block;border-radius:50%;background:conic-gradient(from 0deg,rgba(206,186,170,0) 0deg,rgba(206,186,170,0) 150deg,rgba(206,186,170,.22) 300deg,rgba(206,186,170,0) 360deg);-webkit-mask-image:radial-gradient(closest-side,transparent 46%,#000 62%,#000 76%,transparent 96%);mask-image:radial-gradient(closest-side,transparent 46%,#000 62%,#000 76%,transparent 96%);animation:jjst2Spin var(--d) linear infinite;}' +   // an eddy: a soft comet of ash turning on the spot
    '#jjst2-atmo .ed u{position:absolute;left:50%;top:50%;display:block;width:var(--z);height:var(--z);border-radius:50%;opacity:var(--o);background:radial-gradient(closest-side,rgba(226,210,198,.95),transparent);transform-origin:0 0;animation:jjst2EdOrbit var(--d) linear infinite;}@keyframes jjst2EdOrbit{from{transform:rotate(var(--a)) translateX(var(--r)) scaleY(.42);}to{transform:rotate(calc(var(--a) + 360deg)) translateX(var(--r)) scaleY(.42);}}' +
    '.st2fx .fy{position:absolute;left:-8%;display:block;animation:jjst2Fly var(--d) linear var(--dl) infinite;}.st2fx .fy img{display:block;width:100%;height:auto;max-width:none;animation:jjst2Flap var(--bd) ease-in-out infinite alternate;}' +
    '@keyframes jjst2Fly{0%{transform:translate(0,0);opacity:0;}6%{opacity:.92;}50%{transform:translate(58vw,-2.2vh);}94%{opacity:.92;}100%{transform:translate(116vw,1vh);opacity:0;}}@keyframes jjst2Flap{from{transform:translateY(-6%) rotate(-2deg);}to{transform:translateY(6%) rotate(2deg);}}' +
    '.st2fx.flash{transition:opacity .9s ease;}.st2fx.flash .pn{position:absolute;inset:0;overflow:hidden;border-radius:50%;background:radial-gradient(ellipse at 55% 60%,#3a1c2c,#120e22 70%);-webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 64%,transparent 99%);mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 64%,transparent 99%);animation:jjst2Dream 3.6s ease-in-out infinite alternate;}' +
    '.st2fx.flash::before{content:"";position:absolute;inset:-9%;border-radius:50%;background:radial-gradient(closest-side,rgba(236,226,255,0) 62%,rgba(236,226,255,.55) 80%,rgba(236,226,255,0) 100%);animation:jjst2Dream 3.6s ease-in-out infinite alternate;}' +   // st2-14: a pale dreamy rim, so the memory reads as a picture in his head against the lava
    '.st2fx.flash::after{content:"";position:absolute;left:36%;top:98%;width:12%;height:24%;background:radial-gradient(circle at 62% 16%,rgba(240,232,255,.9) 0,rgba(240,232,255,.75) 13%,rgba(240,232,255,0) 20%),radial-gradient(circle at 46% 56%,rgba(240,232,255,.9) 0,rgba(240,232,255,.75) 8.5%,rgba(240,232,255,0) 14%),radial-gradient(circle at 36% 86%,rgba(240,232,255,.9) 0,rgba(240,232,255,.7) 5%,rgba(240,232,255,0) 9.5%);}' +   // …and three soft thought-dots down to his head

    '.st2fx.flash .pn>img{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;filter:saturate(1.05) brightness(.92);}.st2fx.flash video{position:absolute;right:16.3%;bottom:13.5%;width:56.9%;height:auto;}' +
    '.st2fx.flash b{position:absolute;inset:0;background:radial-gradient(ellipse at 60% 60%,rgba(255,120,40,.1),rgba(40,16,80,.24));}@keyframes jjst2Dream{from{transform:rotate(-1.4deg) scale(1);}to{transform:rotate(1.4deg) scale(1.045);}}' +
    /* the sign that swings up when the signpost is pressed (a placeholder board until story2-sign.webp lands) */
    '#jjst2-sign{position:absolute;right:5vw;top:13vh;width:min(31vw,430px);z-index:9;pointer-events:none;transform-origin:50% -18%;animation:jjst2Swing 1.5s cubic-bezier(.3,1.2,.5,1) both;transition:opacity .5s ease;font-family:' + FONT + ';}#jjst2-sign.off{opacity:0;}' +
    '@keyframes jjst2Swing{0%{transform:rotate(-74deg);opacity:0;}16%{opacity:1;}52%{transform:rotate(8deg);}74%{transform:rotate(-4deg);}90%{transform:rotate(1.5deg);}100%{transform:rotate(0);}}' +
    '#jjst2-sign img{display:block;width:100%;height:auto;}#jjst2-sign .bd{position:relative;padding:8% 9% 9%;border-radius:18px;rotate:-2deg;color:#f3dfb4;background:radial-gradient(120% 140% at 30% 20%,#7a5632,#4a3018);box-shadow:0 14px 30px rgba(0,0,0,.5),inset 0 0 26px rgba(20,10,0,.55);}' +
    '#jjst2-sign .bd b{display:block;font-weight:400;font-size:clamp(20px,2.3vw,34px);line-height:1.15;}#jjst2-sign .bd span{display:block;margin-top:.5em;font-size:clamp(15px,1.5vw,22px);opacity:.85;}#jjst2-sign .bd em{display:block;margin-top:.9em;font-style:normal;font-size:11px;opacity:.5;}' +
    '@media (max-width:699px){#jjst2-sign{left:14vw;top:17vh;width:72vw;}}' +
    '#jjst .jjst-layer.st2hov{animation:jjst2Hov 3s ease-in-out infinite;}@keyframes jjst2Hov{0%,100%{transform:translateY(0) scaleX(var(--flip,1)) rotate(-1.5deg);}50%{transform:translateY(-5%) scaleX(var(--flip,1)) rotate(1.5deg);}}' +   // a gentle hover (the calm Grik)
    '#jjst .jjst-layer.st2hov.st2flyin{animation:jjst2FlyIn 1.25s cubic-bezier(.2,.75,.25,1) both,jjst2Hov 3s ease-in-out 1.25s infinite;}#jjst .jjst-layer.st2hov.st2flyout{animation:jjst2FlyOut 1.05s cubic-bezier(.5,0,.8,.4) forwards;}' +   // he flies in, then hovers; flies out
    '#jjst .jjst-layer.st2talk{pointer-events:none;}' +
    '#jjst .jjst-layer.st2ride{overflow:visible;}.st2ride b{position:absolute;inset:0;display:block;animation:jjst2RideBob 3.4s ease-in-out infinite alternate;}.st2ride img{position:absolute;display:block;max-width:none;height:auto;}.st2ride img:first-child{left:0;top:0;width:100%;}@keyframes jjst2RideBob{from{translate:0 -3%;rotate:-1.2deg;}to{translate:0 3%;rotate:1.2deg;}}' +   // Joe on his dragon (Scene 4): the pair bob as one

    '#jjst .jjst-layer.st2multi{pointer-events:none;}.st2multi video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;}' +
    '.st2fly .fc{position:absolute;display:block;opacity:1;border-radius:0;}.st2fly .fc b{position:absolute;inset:0;display:block;animation:jjst2FlyBob var(--bd,4.6s) ease-in-out infinite alternate;}.st2fly .fc video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;}@keyframes jjst2FlyBob{from{translate:0 -9%;}to{translate:0 9%;}}' +   // a flyer: it floats forward on a gentle rise and dip (translate only: it never turns on screen)
    '.st2fly .pf{position:absolute;display:block;aspect-ratio:1;translate:-50% -50%;border-radius:50%;opacity:0;pointer-events:none;}.st2fly .pf.fire{background:radial-gradient(closest-side,#fff3c4,#ffb23a 32%,rgba(255,96,32,.72) 58%,rgba(255,60,20,0));}.st2fly .pf.mist{background:radial-gradient(closest-side,rgba(255,255,255,.96),rgba(190,236,255,.72) 45%,rgba(160,220,255,0));}' +
    '.st2fly .pf.frost{background:radial-gradient(closest-side,#fff,rgba(214,240,255,.88) 30%,rgba(170,214,255,.36) 60%,rgba(170,214,255,0));}.st2fly .pf.frost::before{content:"";position:absolute;inset:8%;background:#fff;-webkit-clip-path:polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%);clip-path:polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%);filter:blur(1.2px);opacity:.9;}' +   // the puff a flyer comes and goes in: fire / mist / a frost sparkle
    '#jjst .jjst-layer.st2lids{overflow:visible;}.st2lids i{position:absolute;display:block;transform-origin:50% 10%;opacity:0;}.st2lids i::before{content:"";position:absolute;inset:-9% -7%;border-radius:50%;background:radial-gradient(closest-side,var(--lc) 76%,transparent 100%);}.st2lids i::after{content:"";position:absolute;left:14%;right:14%;top:54%;height:9%;border-radius:50%;background:rgba(0,0,0,.34);filter:blur(.6px);}' +   // a dragon's lids: its own body colour, soft-edged, with a faint lash line
    '#jjst .st2entr{position:absolute;inset:0;z-index:6;pointer-events:none;overflow:hidden;}.st2entr i{position:absolute;display:block;border-radius:50%;translate:-50% -50%;opacity:0;}.st2entr .fl{background:radial-gradient(closest-side,#fff,rgba(244,232,255,.92) 26%,rgba(206,170,255,.5) 56%,rgba(190,150,255,0));}.st2entr .sm{background:radial-gradient(closest-side,rgba(150,128,176,.98),rgba(126,108,152,.8) 48%,rgba(112,98,138,0));}.st2entr .sm.b{background:radial-gradient(closest-side,rgba(196,180,214,.96),rgba(160,142,184,.74) 46%,rgba(140,124,164,0));}' +   // an entrance: a flash and a burst of purple-grey smoke
    '#jjst .st2puffs{position:absolute;inset:0;z-index:5;pointer-events:none;overflow:hidden;}.st2puffs i{position:absolute;display:block;border-radius:50%;opacity:0;}' +   // smoke from a nostril
    '#jjst .st2jet{position:absolute;inset:0;z-index:6;pointer-events:none;overflow:hidden;}.st2jet svg{position:absolute;left:0;top:0;display:block;}.st2jet i{position:absolute;display:block;border-radius:50%;opacity:0;}.st2jet.water i{background:radial-gradient(closest-side,#fff,#eafaff 34%,rgba(64,180,246,.9) 62%,rgba(40,150,230,0));}.st2jet.frost i{background:radial-gradient(closest-side,#fff,rgba(220,244,255,.9) 35%,rgba(160,210,255,.4) 65%,rgba(160,210,255,0));box-shadow:0 0 9px 3px rgba(214,240,255,.55);}' +
    '#jjst .jjst-layer.st2trem{animation:jjst2Trem .24s linear infinite;}@keyframes jjst2Trem{0%,100%{transform:translate(0,0);}25%{transform:translate(-.05vw,.03vw);}50%{transform:translate(.05vw,-.02vw);}75%{transform:translate(-.03vw,-.03vw);}}#jjst .jjst-layer.st2multi.st2calm{transform-origin:50% 100%;animation:jjst2Breathe 4.6s ease-in-out infinite;}' +   // the frost dragon holding his growl: a tiny tremble; sitting again: a slow breath
    '.st2fx .rp{width:var(--s);aspect-ratio:3.2;translate:-50% -50%;background:radial-gradient(closest-side,rgba(255,255,255,0) 50%,rgba(255,255,255,.62) 70%,rgba(255,255,255,0) 95%);animation:jjst2Ripple var(--d) ease-out var(--dl) infinite;}@keyframes jjst2Ripple{0%{transform:scale(.2);opacity:0;}20%{opacity:.85;}100%{transform:scale(1.15);opacity:0;}}' +   // a ripple spreading on a pool
    '.st2fx .fs{width:var(--s);aspect-ratio:.42;translate:-50% -92%;transform-origin:50% 100%;border-radius:50% 50% 44% 44% / 78% 78% 22% 22%;background:radial-gradient(ellipse 60% 72% at 50% 74%,rgba(255,246,200,.95),rgba(255,176,60,.8) 42%,rgba(255,84,26,0) 100%);animation:jjst2Spurt var(--d) ease-out var(--dl) infinite;}@keyframes jjst2Spurt{0%,62%{transform:scale(.5,0);opacity:0;}70%{transform:scale(.9,1.15) skewX(-4deg);opacity:.95;}82%{transform:scale(1,.8) skewX(5deg);opacity:.85;}100%{transform:scale(.6,0);opacity:0;}}' +   // a spurt of fire off the lava, now and then
    '.st2live .fkh{position:absolute;inset:0;pointer-events:none;}.st2live .fk{position:absolute;left:0;opacity:.9;translate:-200vw 0;}.st2live .fki{position:absolute;inset:0;animation:jjst2FlockBob var(--bd,5.6s) ease-in-out infinite alternate;}@keyframes jjst2FlockBob{from{transform:translateY(calc(-1 * var(--ba,30%)));}to{transform:translateY(var(--ba,30%));}}.st2live .fk video{object-fit:contain;}' +   // the flock: a gentle rise and dip under its crossing, a touch hazed toward the sky
    '#jjst .st2smoke{position:absolute;inset:0;z-index:3;pointer-events:none;overflow:hidden;}.st2smoke i{position:absolute;display:block;border-radius:50%;opacity:0;background:radial-gradient(closest-side,rgba(226,218,212,.95),rgba(190,180,176,.5) 45%,rgba(170,160,158,0));}' +   // his smoke: soft grey puffs with a faint warm tint (all gradient: no edge)
    '#jjst .st2black{position:absolute;left:0;z-index:2;pointer-events:none;translate:-200vw 0;}.st2black>div{position:absolute;inset:0;}.st2black video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;filter:url(#jjst2-degreen);}' +   // the near black dragon (its greens pulled back to grey: one motion-blur frame of the clip carries a green cast)
    '.st2live .st2hot{position:absolute;inset:0;z-index:3;pointer-events:none;}.st2hot .ha{position:absolute;translate:-50% -50%;touch-action:none;margin:0;padding:0;border:0;background:none;-webkit-appearance:none;appearance:none;border-radius:50%;pointer-events:auto;cursor:pointer;outline:none;-webkit-tap-highlight-color:transparent;}.st2hot .ha:focus-visible{box-shadow:0 0 0 2px rgba(255,255,255,.8);}' +
    '.st2hot i{position:absolute;display:block;aspect-ratio:1;pointer-events:none;opacity:0;border-radius:50%;}.st2hot canvas.eg{position:absolute;display:block;pointer-events:none;transform-origin:50% 84%;-webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 58%,transparent 96%);mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 58%,transparent 96%);}' +
    '.st2hot .sk{border-radius:0;background:radial-gradient(closest-side,rgba(255,255,255,.95),rgba(255,236,150,.7) 30%,rgba(255,214,90,0) 70%);-webkit-mask-image:conic-gradient(from 0deg,#000 0 8deg,transparent 22deg 68deg,#000 82deg 98deg,transparent 112deg 158deg,#000 172deg 188deg,transparent 202deg 248deg,#000 262deg 278deg,transparent 292deg 338deg,#000 352deg);mask-image:conic-gradient(from 0deg,#000 0 8deg,transparent 22deg 68deg,#000 82deg 98deg,transparent 112deg 158deg,#000 172deg 188deg,transparent 202deg 248deg,#000 262deg 278deg,transparent 292deg 338deg,#000 352deg);}' +   // a four-point sparkle (soft: a glow cut into rays)
    '.st2hot .rg{aspect-ratio:2.6;background:radial-gradient(closest-side,rgba(255,255,255,0) 52%,rgba(255,255,255,.9) 70%,rgba(190,240,255,.5) 82%,rgba(255,255,255,0) 96%);}.st2hot .ep{background:radial-gradient(closest-side,#fff3c0,#ffb23a 34%,rgba(255,96,32,.7) 60%,rgba(255,60,20,0));}.st2hot .em{background:radial-gradient(closest-side,#ffe9a8,#ff9a3a 55%,rgba(255,120,40,0));}.st2hot .sp{background:radial-gradient(closest-side,rgba(255,255,255,.96),rgba(226,244,255,.75) 46%,rgba(200,230,255,0));}' +
    '.st2hot .egw{position:absolute;display:block;pointer-events:none;transform-origin:50% 84%;}.st2hot .egw svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;}.st2hot .egw .pt{position:absolute;inset:0;width:100%;height:100%;display:block;-webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 58%,transparent 96%);mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 58%,transparent 96%);}' +
    '.st2hot .egw .pt.half{-webkit-mask-image:none;mask-image:none;-webkit-clip-path:polygon(0 100%,0 52%,17% 50%,23% 55%,34% 44%,45% 56%,56% 45%,66% 55%,77% 44%,83% 50%,100% 52%,100% 100%);clip-path:polygon(0 100%,0 52%,17% 50%,23% 55%,34% 44%,45% 56%,56% 45%,66% 55%,77% 44%,83% 50%,100% 52%,100% 100%);}.st2hot .egw .pt.sh{-webkit-mask-image:none;mask-image:none;transform-origin:50% 35%;}' +
    '.st2hot .egw .lt{position:absolute;left:8%;top:0;width:84%;height:74%;aspect-ratio:auto;border-radius:50%;opacity:0;background:radial-gradient(closest-side,#fffdf0 0,#fff6c4 38%,rgba(255,224,130,.92) 58%,rgba(255,196,80,.5) 78%,rgba(255,190,70,0) 100%);}.st2hot .egw.open .lt{animation:jjst2EggLt 2.4s ease-in-out .6s infinite alternate;}@keyframes jjst2EggLt{from{filter:brightness(1);}to{filter:brightness(1.12);}}' +   // the light where the egg's top was
    '.st2hot .tw{background:radial-gradient(closest-side,#fff,rgba(255,236,150,.9) 40%,rgba(255,214,90,0));}' +
    '.st2hot .ar{position:absolute;display:block;width:34px;height:34px;translate:-50% -100%;pointer-events:none;animation:jjst2NeedBob 1s ease-in-out infinite;filter:drop-shadow(0 2px 5px rgba(0,0,0,.55));}.st2hot .ar svg,.st2way svg{display:block;width:100%;height:100%;fill:#FF00F5;stroke:#fff;stroke-width:1.2;}' +
    '#jjst .st2way{position:absolute;right:20px;top:42%;width:40px;height:40px;z-index:11;pointer-events:none;rotate:-90deg;animation:jjst2NeedBob 1s ease-in-out infinite;filter:drop-shadow(0 2px 5px rgba(0,0,0,.55));}#jjst .st2way.l{right:auto;left:20px;rotate:90deg;}' +   // no nest in view: the way to pan
    '.st2hot .hr{border-radius:0;aspect-ratio:24/22;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35));}.st2hot .hr svg{display:block;width:100%;height:100%;}' +
    '#jjst-bars .b{transition-duration:.7s;}' +   // (Storytime 2 only: the letterbox eases away / back in 700 ms)
    '#jjst-cap-text .jjst-nx.st2pulse{animation:jjst2NxPulse 1.3s ease-in-out infinite;}@keyframes jjst2NxPulse{0%,100%{opacity:.75;text-shadow:none;}50%{opacity:1;text-shadow:0 0 10px rgba(255,170,60,.95),0 0 3px rgba(255,255,255,.9);}}' +   // after 12 s on the explore shot: Next asks a little louder
    '#jjst .jjst-layer.st2live{overflow:hidden;background:#0a1a2c;}.st2live img,.st2live video{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;display:block;}.st2live video{transition:opacity .25s linear;}' +
    '#jjst-bars .b::after{content:"";position:absolute;left:0;right:0;height:18px;opacity:0;transition:opacity .6s ease;}#jjst-bars.on .b::after{opacity:1;}#jjst-bars .t::after{top:calc(100% - 1px);background:linear-gradient(180deg,#000,rgba(0,0,0,.55) 35%,rgba(0,0,0,0));}#jjst-bars .d::after{bottom:calc(100% - 1px);background:linear-gradient(0deg,#000,rgba(0,0,0,.55) 35%,rgba(0,0,0,0));}' +   // the letterbox's inner edges, feathered (Storytime 2 only: this sheet is not loaded in Part One)
    '#jjst .jjst-layer.st2breathe{transform-origin:50% 100%;animation:jjst2Breathe 4.2s ease-in-out infinite;}@keyframes jjst2Breathe{0%,100%{transform:scaleX(var(--flip,1)) scale(1);}50%{transform:scaleX(var(--flip,1)) scale(1.01);}}' +   // a still standing in for a clip: a slow 1% breath, no bob
    /* a required press: the thing to press glows and pulses, a large prompt with an arrow sits on it and stays until it is pressed (or the wait runs out) */
    '#jjst2-need{position:absolute;inset:0;z-index:11;pointer-events:none;opacity:0;transition:opacity .35s ease;font-family:' + FONT + ';}#jjst2-need.on{opacity:1;}#jjst2-need>*{position:absolute;display:block;}' +
    '#jjst2-need .gw{border-radius:50%;translate:-50% -50%;background:radial-gradient(closest-side,rgba(255,236,170,.5),rgba(255,214,120,.2) 55%,rgba(255,214,120,0));animation:jjst2NeedGlow 1.5s ease-in-out infinite;}' +
    '#jjst2-need .rg{border-radius:50%;translate:-50% -50%;border:3px solid rgba(255,236,170,.95);box-shadow:0 0 18px rgba(255,214,120,.8),inset 0 0 18px rgba(255,214,120,.5);opacity:0;animation:jjst2NeedRing 1.7s ease-out infinite;}#jjst2-need .rg.b{animation-delay:.85s;}' +
    '@keyframes jjst2NeedRing{0%{transform:scale(.45);opacity:0;}18%{opacity:1;}100%{transform:scale(1.3);opacity:0;}}@keyframes jjst2NeedGlow{0%,100%{transform:scale(.92);opacity:.6;}50%{transform:scale(1.08);opacity:1;}}' +
    '#jjst2-need.portal .gw{background:radial-gradient(closest-side,rgba(226,170,255,.75),rgba(170,90,255,.38) 50%,rgba(150,70,255,0));animation:jjst2NeedFlick 1.9s linear infinite;}#jjst2-need.portal .rg{border-color:rgba(226,180,255,.95);box-shadow:0 0 20px rgba(180,110,255,.9),inset 0 0 20px rgba(180,110,255,.55);}' +
    '@keyframes jjst2NeedFlick{0%{opacity:.35;transform:scale(.94);}9%{opacity:.95;}14%{opacity:.5;}22%{opacity:1;transform:scale(1.06);}31%{opacity:.4;}47%{opacity:.85;}55%{opacity:.3;transform:scale(.97);}70%{opacity:1;transform:scale(1.08);}82%{opacity:.55;}100%{opacity:.35;transform:scale(.94);}}' +
    '#jjst2-need .pp{translate:-50% -50%;width:max-content;max-width:84vw;display:flex;flex-direction:column;align-items:center;gap:6px;animation:jjst2NeedPulse 1.3s ease-in-out infinite;}#jjst2-need .pp.up{flex-direction:column-reverse;}' +
    '#jjst2-need #jjst-hint{position:relative;left:auto;top:auto;transform:none;padding:17px 32px;border-radius:999px;font-size:clamp(19px,1.9vw,28px);letter-spacing:.04em;white-space:nowrap;font-family:' + FONT + ';box-shadow:0 0 0 3px rgba(255,255,255,.55),0 12px 30px rgba(0,0,0,.5),0 0 34px rgba(255,214,120,.55);}' +
    '#jjst2-need.portal #jjst-hint{box-shadow:0 0 0 3px rgba(255,255,255,.55),0 12px 30px rgba(0,0,0,.5),0 0 36px rgba(180,110,255,.8);}' +
    '#jjst2-need .ar{width:38px;height:38px;animation:jjst2NeedBob 1s ease-in-out infinite;filter:drop-shadow(0 2px 5px rgba(0,0,0,.55));}#jjst2-need .ar svg{display:block;width:100%;height:100%;fill:#FF00F5;stroke:#fff;stroke-width:1.2;}#jjst2-need .pp.up .ar{rotate:180deg;}' +
    '@keyframes jjst2NeedPulse{0%,100%{scale:1;}50%{scale:1.07;}}@keyframes jjst2NeedBob{0%,100%{transform:translateY(0);}50%{transform:translateY(8px);}}' +
    '#jjst2-need.hov .pp{animation-duration:.7s;}#jjst2-need.hov .rg{animation-duration:.9s;border-width:5px;}#jjst2-need.hov .gw{filter:brightness(1.35);}' +
    '@media (max-width:699px){#jjst2-need #jjst-hint{font-size:17px;padding:13px 22px;white-space:normal;text-align:center;max-width:78vw;}}' +
    '#jjst .jjst-layer.st2egg{transform-origin:50% 92%;animation:jjst2Rock 3.2s ease-in-out infinite;}@keyframes jjst2Rock{0%,100%{transform:rotate(-2.5deg);}50%{transform:rotate(2.5deg);}}' +
    '#jjst .jjst-layer.st2glow{animation:jjst2Glow 3.4s ease-in-out infinite;}@keyframes jjst2Glow{0%,100%{transform:scale(1);filter:brightness(1);}50%{transform:scale(1.1);filter:brightness(1.25);}}' +
    '#jjst .jjcam-front[data-rig="st2o"] .sh{opacity:.16;}#jjst .jjcam-front[data-rig="st2o"] .vg{opacity:.28;}#jjst .jjcam-front[data-rig="st2d"] .sh{opacity:.4;}#jjst .jjcam-front[data-rig="st2d"] .vg{opacity:.45;}' +   // the rig's night-edge shading, eased off for the daylight boards
    /* the air */
    '#jjst2-atmo{position:absolute;inset:0;z-index:4;pointer-events:none;overflow:hidden;}#jjst2-atmo .set{position:absolute;inset:0;opacity:0;transition:opacity 1.3s ease;}#jjst2-atmo .set.on{opacity:1;}#jjst2-atmo i{position:absolute;display:block;}' +
    '#jjst2-atmo .p{left:var(--x);top:var(--y);width:var(--s);height:var(--s);border-radius:50%;background:radial-gradient(closest-side,var(--c),transparent);opacity:0;animation:jjst2Fleck var(--d) linear var(--dl) infinite;}' +
    '@keyframes jjst2Fleck{0%{translate:0 0;opacity:0;}12%{opacity:var(--o);}85%{opacity:var(--o);}100%{translate:var(--dx) var(--dy);opacity:0;}}' +
    '#jjst2-atmo .e{box-shadow:0 0 6px 1px rgba(255,140,50,.7);animation-name:jjst2Ember;}@keyframes jjst2Ember{0%{translate:0 0;opacity:0;}10%{opacity:var(--o);}45%{opacity:calc(var(--o) * .4);}70%{opacity:var(--o);}100%{translate:var(--dx) var(--dy);opacity:0;}}' +
    '#jjst2-atmo .s{left:-110vw;top:var(--y);width:var(--w);height:var(--h);border-radius:50%;background:radial-gradient(closest-side,var(--c),transparent);animation:jjst2Roll2 var(--d) linear var(--dl) infinite;}@keyframes jjst2Roll2{to{translate:220vw 0;}}' +
    '#jjst2-atmo .h{left:-12%;right:-12%;top:40%;height:26%;border-radius:50%;background:radial-gradient(closest-side,rgba(255,222,172,.2),rgba(255,222,172,.08) 60%,transparent);animation:jjst2Shim 2.6s ease-in-out infinite alternate;}' +   // the heat: a soft haze over the horizon that swells and thins (all gradient: no edge to it)
    '#jjst2-atmo .h.b{top:47%;height:17%;animation-duration:3.7s;animation-direction:alternate-reverse;}@keyframes jjst2Shim{0%{transform:translateY(-5px) scaleY(1);opacity:.45;}100%{transform:translateY(5px) scaleY(1.28);opacity:1;}}' +
    '#jjst2-atmo .m.w{background:radial-gradient(closest-side,rgba(255,216,164,.2),transparent);}' +
    '#jjst2-atmo .m{left:var(--x);top:var(--y);width:var(--s);height:calc(var(--s) * .6);border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.32),transparent);opacity:0;animation:jjst2Mist var(--d) ease-in-out var(--dl) infinite;}@keyframes jjst2Mist{0%{translate:0 2vh;opacity:0;}30%{opacity:1;}100%{translate:3vw -7vh;opacity:0;}}' +
    '#jjst2-atmo .k{left:var(--x);top:var(--y);width:var(--s);height:var(--s);border-radius:50%;background:radial-gradient(closest-side,#fff,rgba(255,255,255,0));opacity:0;animation:jjst2Twk var(--d) ease-in-out var(--dl) infinite;}@keyframes jjst2Twk{0%,100%{scale:.2;opacity:0;}50%{scale:1;opacity:.95;}}' +
    '.jjst2-burst{position:absolute;z-index:4;width:16vw;height:8vw;margin:-5vw 0 0 -8vw;border-radius:50%;pointer-events:none;opacity:0;background:radial-gradient(closest-side,rgba(200,188,180,.88),rgba(150,138,134,.4) 55%,transparent);}' +
    '.jjst2-burst.spark{width:9vw;height:9vw;margin:-4.5vw 0 0 -4.5vw;background:radial-gradient(closest-side,#fff,rgba(190,120,255,.85) 30%,rgba(150,70,255,.3) 60%,transparent);}' +
    /* the bubble: its look (the parchment panel, the tail, the thought dots, the five themes) lives in storytime.js (BUB_CSS: Part One's
       teaching bubbles share it). Here: only what Storytime 2's bubbles add — the Next on its own line, the phone dock, the alien tongue */
    /* st2-12 · Next is a small text link in the panel's bottom-right corner (no box, no ring: like the banner's '– Next' hint), on the last line's own row: the text
       ends in an unseen spacer that keeps that corner free, so a short bubble stays short. Every bubble has it; a timed one fills its underline, faintly, over
       its hold (the fill is a WAAPI animation inside #jjst: a pause holds it). */
    '.jjst2-bub .nsp{display:inline-block;width:4.3em;height:1px;}' +
    '#jjst .jjst2-bub .nxl{position:absolute;right:16px;bottom:13px;margin:0;padding:0;border:0;background:none;-webkit-appearance:none;appearance:none;font:inherit;font-size:clamp(14px,1.12vw,17px);line-height:1.5;letter-spacing:.03em;color:var(--ac);cursor:pointer;display:inline-flex;align-items:center;gap:5px;opacity:0;transition:opacity .25s ease,color .15s ease,filter .15s ease;text-shadow:inherit;}' +
    '#jjst .jjst2-bub .nxl::before{content:"";position:absolute;inset:-14px -12px;}' +   // a generous hit area (44px+ tall)
    '#jjst .jjst2-bub.done .nxl{opacity:.9;}#jjst .jjst2-bub .nxl:hover{opacity:1;filter:brightness(1.2) drop-shadow(0 0 5px var(--ac));}#jjst .jjst2-bub .nxl:active{color:#FF00F5;filter:none;}#jjst .jjst2-bub .nxl:focus-visible{outline:2px solid var(--ac);outline-offset:4px;border-radius:5px;}' +
    '.jjst2-bub .nxl svg{width:6px;height:10px;display:block;}' +
    /* st2-14 · the progress line runs along the bottom inside edge of the bubble, about a third of its width (more of a short bubble), ending under Next, in the theme's
       underline colour (--ul: pink in Classic / Retro / Alien, gold in Medieval, yellow in Special). It fills over the line's read. On a line that waits (state 2 / 4)
       the full line and Next then pulse gently. Hover: the stretch under the word Next thickens and glows (so it reads differently from the progress line). */
    '.jjst2-bub .pgl{position:absolute;right:16px;bottom:8px;width:max(36%,118px);max-width:calc(100% - 32px);height:2px;border-radius:2px;overflow:hidden;pointer-events:none;opacity:.62;-webkit-mask:linear-gradient(90deg,transparent,#000 18%);mask:linear-gradient(90deg,transparent,#000 18%);}.jjst2-bub .pgl b{display:block;height:100%;background:var(--ul);transform-origin:0 50%;transform:scaleX(0);}' +
    '.jjst2-bub.ready .pgl{animation:jjst2Rdy 1.5s ease-in-out infinite;}#jjst .jjst2-bub.ready .nxl{animation:jjst2RdyN 1.5s ease-in-out infinite;}@keyframes jjst2Rdy{0%,100%{opacity:.5;filter:none;}50%{opacity:1;filter:drop-shadow(0 0 4px var(--ul));}}@keyframes jjst2RdyN{0%,100%{opacity:.8;filter:none;}50%{opacity:1;filter:brightness(1.2) drop-shadow(0 0 6px var(--ul));}}' +
    '.jjst2-bub .nxl .ul{position:absolute;left:-3px;right:-3px;bottom:-6px;height:3px;border-radius:3px;background:var(--ul);box-shadow:0 0 7px var(--ul);transform:scaleX(0);transform-origin:100% 50%;transition:transform .22s ease;}.jjst2-bub .nxl:hover .ul{transform:scaleX(1);}' +   // hover: the stretch under Next thickens and glows
    '.jjst2-bub.small{width:max-content;max-width:min(44vw,250px);}.jjst2-bub.small .pn{padding:8px 14px 9px;}.jjst2-bub.small .tx{font-size:clamp(14px,1.08vw,17px);}.jjst2-bub.small .who{font-size:11px;margin-bottom:2px;}' +   // a small aside (a cough)
    '@media (max-height:640px) and (min-width:700px){.jjst2-bub{width:min(30vw,400px);}.jjst2-bub .pn{padding:11px 16px;}.jjst2-bub .tx{font-size:16px;}#jjst .jjst2-bub .nxl{bottom:10px;}.jjst2-bub .pgl{bottom:6px;}}' +   // a short window (a pane): a smaller bubble, so it fits beside its speaker
    '.jjst2-bub.alien .tx{font-family:' + FONT.replace(',sans-serif', '') + ",'Apple Symbols','Segoe UI Symbol','Noto Sans Symbols 2','Noto Sans Symbols',sans-serif;letter-spacing:.14em;color:#8dffb0;font-size:clamp(19px,1.7vw,26px);text-shadow:0 0 10px rgba(80,220,120,.4);}" +   // Grik's own tongue: glyphs, typed very fast
    '.jjst2-bub.sub{width:min(60vw,760px);}.jjst2-bub.sub .tail,.jjst2-bub.dock .tail,.jjst2-bub.notail .tail{display:none;}' +
    '.jjst2-bub.dock{left:4vw!important;right:4vw;top:auto!important;bottom:7vh;width:auto;}' +
    /* the choice */
    '#jjst2-choice{position:absolute;inset:0;z-index:13;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3.2vh;background:radial-gradient(ellipse at 50% 46%,rgba(0,0,0,.38),rgba(0,0,0,.72) 70%);opacity:0;transition:opacity .4s ease;font-family:' + FONT + ';color:#fff;}#jjst2-choice.on{opacity:1;}' +
    '#jjst2-choice h3{margin:0;font:inherit;font-size:clamp(24px,2.6vw,40px);text-shadow:0 2px 14px rgba(0,0,0,.6);}' +
    '#jjst2-choice .cards{display:flex;gap:min(4vw,56px);}' +
    '.jjst2-card{position:relative;width:min(27vw,330px);padding:26px 22px 22px;border-radius:26px;border:2px solid rgba(255,255,255,.5);background:rgba(0,0,0,.42);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);color:#fff;font:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:10px;transition:translate .22s ease,box-shadow .22s ease,opacity .4s ease,scale .4s ease;box-shadow:0 18px 40px -16px rgba(0,0,0,.7);}' +
    '.jjst2-card:hover,.jjst2-card:focus-visible{translate:0 -8px;box-shadow:0 26px 50px -18px rgba(0,0,0,.8),0 0 34px var(--eg);outline:none;}' +
    '.jjst2-card .egg{display:block;width:min(11vw,132px);height:auto;filter:drop-shadow(0 0 18px var(--eg));animation:jjst2Egg 2.6s ease-in-out infinite;}' +
    '.jjst2-card .nm{font-size:clamp(20px,2vw,30px);}.jjst2-card .sb{font-size:15px;opacity:.78;}' +
    '.jjst2-card.pick{scale:1.06;box-shadow:0 0 60px var(--eg);}.jjst2-card.pick .egg{animation:jjst2Wob .5s ease-in-out 3;}.jjst2-card.lose{opacity:.25;scale:.94;}' +
    '@keyframes jjst2Egg{50%{translate:0 -6px;}}@keyframes jjst2Wob{25%{rotate:-9deg;}75%{rotate:9deg;}}' +
    /* the pill (it borrows the transport hint’s themed pill by id) */
    '#jjst2-pillw{position:absolute;inset:0;z-index:11;pointer-events:none;opacity:0;transition:opacity .45s ease;}#jjst2-pillw.on{opacity:1;}#jjst2-pillw #jjst-hint{top:17%;max-width:86vw;white-space:normal;text-align:center;font-family:' + FONT + ';}' +
    /* cuts */
    '#jjst2-cut{position:absolute;inset:0;z-index:10;pointer-events:none;overflow:hidden;}' +
    '#jjst2-cut .dust{position:absolute;top:-10%;bottom:-10%;left:-160%;width:160%;background:linear-gradient(90deg,transparent,rgba(170,150,130,.96) 22%,rgba(150,132,116,1) 50%,rgba(170,150,130,.96) 78%,transparent);filter:blur(18px);}' +
    '#jjst2-cut .heat{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 60%,rgba(255,236,190,.95),rgba(255,214,150,.8) 60%,rgba(255,200,130,.6));opacity:0;}' +
    '#jjst2-cut .whoosh{position:absolute;top:-10%;bottom:-10%;left:-140%;width:140%;background:repeating-linear-gradient(0deg,transparent 0 3.2%,rgba(255,255,255,.9) 3.6% 4.2%,transparent 4.8% 9%),linear-gradient(90deg,transparent,rgba(235,245,255,.96) 30%,rgba(235,245,255,.96) 70%,transparent);filter:blur(6px);}' +
    '#jjst2-cut .dip{position:absolute;inset:0;background:#000;opacity:0;}' +
    '#jjst2-cut .tag{position:absolute;left:50%;top:44%;translate:-50% -50%;font-family:' + FONT + ';font-size:clamp(20px,2.4vw,38px);color:#fff;text-shadow:0 2px 16px rgba(0,0,0,.7);opacity:0;}' +
    '#jjst2-credits{position:absolute;inset:0;z-index:14;background:#000;overflow:hidden;opacity:0;transition:opacity .25s ease;font-family:' + FONT + ';color:#fff;text-align:center;}#jjst2-credits.on{opacity:1;}' +
    '#jjst2-credits .roll{position:absolute;left:8vw;right:8vw;top:100%;animation:jjst2Roll var(--d,14s) linear forwards;}#jjst2-credits .roll h4{margin:0 0 7vh;font:inherit;font-size:clamp(28px,3.4vw,54px);}#jjst2-credits .roll p{margin:0 0 4.5vh;font-size:clamp(17px,1.7vw,26px);opacity:.9;}' +
    '@keyframes jjst2Roll{to{translate:0 calc(-100% - 100vh);}}' +
    '@media (max-width:699px){.jjst2-bub{width:min(88vw,400px);}.jjst2-bub .tx{font-size:16px;}#jjst2-pillw #jjst-hint{top:25%;}#jjst2-choice .cards{flex-direction:column;gap:14px;}.jjst2-card{width:72vw;flex-direction:row;padding:14px 16px;gap:16px;}.jjst2-card .egg{width:64px;}.jjst2-card .tx2{text-align:left;}}' +
    '@media (prefers-reduced-motion:reduce){.jjst2-card .egg,.jjst2-card.pick .egg{animation:none;}#jjst2-need .rg{animation:none;opacity:.9;}#jjst2-atmo{display:none;}.st2sky .dr,.st2sky .sw,.st2sky .cb,.st2sky .sun,.st2fx.flash .pn,#jjst .jjst-layer.st2mirage{animation:none;}.st2sky .tw,.st2fx>i{display:none;}}' +
    /* themes: the cards (the bubble's own themes are in storytime.js). The Next button takes the site's themed glass button (.jjst-ov .jjst-glass) */
    T('medieval', P) + '{background:linear-gradient(180deg,#f6e7c3,#e8d3a2);-webkit-backdrop-filter:none;backdrop-filter:none;border:3px solid #3a2a12;color:#2a1c0a;box-shadow:0 0 0 3px #c9a85c,0 16px 34px -12px rgba(0,0,0,.65);}' +
    T('medieval', '.jjst2-card .nm,.jjst2-card .sb') + '{color:#2a1c0a!important;text-shadow:none!important;}' +
    T('retro', P) + '{background:#fff;-webkit-backdrop-filter:none;backdrop-filter:none;border:4px solid #0b1e5a;border-radius:10px;color:#0b1e5a;box-shadow:6px 6px 0 #FFD400;}' +
    T('alien', P) + '{background:rgba(6,16,34,.72);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);border:2px solid #4fe3ff;color:#fff;box-shadow:0 0 22px rgba(79,227,255,.38),0 16px 34px -14px rgba(0,0,0,.7);}' +
    T('medieval', '.jjst2-bub.alien .tx') + '{color:#2c7a44;text-shadow:none;}' +
    T('mixed', P) + '{background:linear-gradient(160deg,#0e1a33,#070f1d);-webkit-backdrop-filter:none;backdrop-filter:none;border:4px dashed #a8a8a8;box-shadow:inset 0 0 0 2px #6d6d6d,0 0 0 2px #6d6d6d,0 16px 34px -14px rgba(0,0,0,.7);color:#ffe9b0;}' +
    '@media (max-height:430px) and (orientation:landscape){.jjst2-bub{width:min(31vw,262px);}.jjst2-bub .pn{padding:8px 12px 9px;}.jjst2-bub .tx{font-size:13.5px;}#jjst .jjst2-bub .nxl{font-size:12px;right:11px;bottom:7px;}.jjst2-bub .pgl{right:11px;bottom:4px;}.jjst2-bub.alien .tx{font-size:15px;}.jjst2-bub.small .tx{font-size:12.5px;}' +   // st2-19 · a landscape phone: everything a size down
    '#jjst2-need #jjst-hint{font-size:14px;padding:9px 16px;}#jjst2-need .ar{width:24px;height:24px;}#jjst2-need .pp{gap:3px;}#jjst2-pillw #jjst-hint{font-size:13px;padding:8px 14px;top:33%;}#jjst2-sign{top:22vh;width:min(26vw,250px);}.jjst2-card{width:min(24vw,220px);padding:12px 12px 10px;gap:5px;}.jjst2-card .egg{width:min(8vw,64px);}.jjst2-card .nm{font-size:17px;}.jjst2-card .sb{font-size:12px;}#jjst2-choice{gap:2vh;}#jjst2-choice h3{font-size:20px;}}';
    document.head.appendChild(st);
    if (!document.getElementById('jjst2-degreen')) { var fx = document.createElement('div'); fx.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';   // G' = G − .8·(G − (R+B)/2): greens fall back to grey, the orange spots and the greys are untouched
      fx.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><filter id="jjst2-degreen" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  .4 .2 .4 0 0  0 0 1 0 0  0 0 0 1 0"/></filter></svg>'; document.body.appendChild(fx); }
  }

  /* ---- the pill ---- */
  var pillW = null, pillT = null;
  function pill(text, ms) { var st = api.stage(); if (!st) return; if (!pillW) { pillW = document.createElement('div'); pillW.id = 'jjst2-pillw'; pillW.innerHTML = '<div id="jjst-hint"><span></span></div>'; }
    if (!pillW.isConnected) st.appendChild(pillW); pillW.querySelector('span').textContent = text; void pillW.offsetWidth; pillW.classList.add('on');
    api.unsched(pillT); pillT = api.sched(function () { if (pillW) pillW.classList.remove('on'); }, ms || 4200);
    pillDodge(); clearInterval(pillIv); pillIv = setInterval(function () { if (!pillW || !pillW.classList.contains('on')) { clearInterval(pillIv); return; } pillDodge(); }, 220); }
  function pillOff() { api.unsched(pillT); if (pillW) pillW.classList.remove('on'); }
  var pillIv = 0, pillDx = 0;
  function pillDodge() { var h = pillW && pillW.firstChild, b = document.querySelector('.jjst2-bub.on'); if (!h) return;      // a bubble where the pill sits: the pill steps to the side with room
    var pr = h.getBoundingClientRect(), W = window.innerWidth, l = pr.left - pillDx, r = pr.right - pillDx, dx = 0;
    if (b && !b.classList.contains('dock')) { var br = b.getBoundingClientRect();
      if (!(r < br.left - 10 || l > br.right + 10 || pr.bottom < br.top - 10 || pr.top > br.bottom + 10)) { var toR = br.right + 18 - l, toL = br.left - 18 - r, okR = r + toR <= W - 12, okL = l + toL >= 12;
        dx = okR && (!okL || toR <= -toL) ? toR : okL ? toL : 0; } }
    if (dx !== pillDx) { pillDx = dx; pillW.style.translate = Math.round(dx) + 'px 0'; } }

  /* ---- a change of pose (a figure on a POSESETS set): at a line's start (or between its sentences). Rule 8: the new pose is decoded first, fades in on top on its own
     box (a pose's box is placed by the BODY's centre and one scale, so he neither shifts nor changes size), and only then is the old pose dropped. ---- */
  function poseProbe(a, key, pose) { var rec = a.layers()[key], el = rec && rec.el, id = String(a.comp() || '').slice(3), sh = SHOTS[id] || {}, l = (sh.layers || []).filter(function (x) { return x.key === key && x.poseSet; })[0]; if (!el || !el.isConnected || el.tagName !== 'IMG' || !l || !POSESETS[l.poseSet][pose]) return;
    if (el._pose === pose || (!el._pose && l.pose === pose)) return; var g = poseBox(l.poseSet, pose, l.anchor, l.flip, l.s), c = {}, k; for (k in l) c[k] = l[k]; c.pos = [g.cx, l.pos[1], g.w, g.ar]; c.src = g.src; boxProbe(el, layerDef('3', id, c).css, a.F(g.src)); }
  function poseSwap(a, key, pose, ms) { var rec = a.layers()[key], el = rec && rec.el, id = String(a.comp() || '').slice(3), sh = SHOTS[id] || {}, l = (sh.layers || []).filter(function (x) { return x.key === key && x.poseSet; })[0];
    if (!el || !el.isConnected || el.tagName !== 'IMG' || !l || !POSESETS[l.poseSet][pose]) return; var g = poseBox(l.poseSet, pose, l.anchor, l.flip, l.s);
    if (el._pose === pose || (!el._pose && l.pose === pose)) return; el._pose = pose;
    var c = {}, k; for (k in l) c[k] = l[k]; c.pos = [g.cx, l.pos[1], g.w, g.ar]; c.src = g.src; layerSwap(a, key, g.src, layerDef('3', id, c).css, null, ms != null ? ms : 170); }
  /* which pose Clive takes on a line (POSE_LINES: the start of the line → pose; a line not listed: 'present'); Joe's lines and the waits: 'side' */
  /* st2-16 · Clive's temper (3.8): a pose per line (say(..., { clive: pose, cfx })) and, on top of a pose, a small real move of the whole figure about his feet:
     'slump' (he sags a little when the joke falls flat) or 'lean' (he leans in toward Joe). The move eases in after the pose is up and eases out before the next
     pose comes in, so every swap is still pose-on-pose at one size on one spot (rules 6 and 8). */
  var CFX = { slump: ['2deg', '1 .972'], lean: ['-4.5deg', '1 1'] };
  function clivePose(a, pose, fx) { var r = a.layers().clive, el = r && r.el; if (!el || !el.isConnected) return;
    if (actNow && actNow.key === 'clive' && actNow.base === el && actNow.v.tagName === 'VIDEO' && el.tagName === 'IMG') { var cur = el._pose || ''; poseSwap(a, 'clive', pose, 0); if ((el._pose || '') !== cur) actOff(false); else return; }   /* st2-25 · D7: his sigh is still running and the next line asks for another pose: the still takes the new pose unseen (under the clip) and comes in over it; the same pose again: the sigh simply finishes */
    var go = function () { poseSwap(a, 'clive', pose); if (!fx || !CFX[fx]) return; a.sched(function () { var r2 = a.layers().clive, e = r2 && r2.el; if (!e || !e.isConnected) return; e.style.transition = 'rotate .55s ease, scale .55s ease'; e.style.rotate = CFX[fx][0]; e.style.scale = CFX[fx][1]; e._cfx = fx; }, 330); };
    if (el._cfx) { el.style.transition = 'rotate .22s ease, scale .22s ease'; el.style.rotate = ''; el.style.scale = ''; el._cfx = null; poseProbe(a, 'clive', pose); a.sched(go, 240); } else go(); }
  var POSE_LINES = [['That’s what they say on TV', 'think'], ['I hope you see it now', 'think'], ['A wizard, aye', 'think'], ['Elnor the Enchanted, they call him', 'think'], ['You’ll need some wings', 'think', '*laughs*', 'present']];

  /* ---- a figure that talks: its clip over its still, only while its bubble types ---- */
  function talkCss(l, sh) { var K = TALK[l.src], f = l.flip ? -1 : 1, W = K.w * K.sc, H = K.h * K.sc;
    if (l.pos) { var k = l.pos[2] / K.of[0], set = SETS[sh.set] || { km: 1 };
      return onBoard(l.pos[0] + f * ((K.ox + W / 2) - K.of[0] / 2) * k, l.pos[1] + (K.oy + H - K.of[1]) * k * AR, W * k, l.k != null ? l.k : set.km) + ';z-index:' + (l.z != null ? l.z : 3) + ';aspect-ratio:' + K.w + '/' + K.h; }
    var kv = l.box[2] / K.of[0];   // (a layer on a screen box: vw per pixel of the still)
    return 'left:calc(' + l.box[0] + '% + ' + ((f > 0 ? K.ox : K.of[0] - (K.ox + W)) * kv).toFixed(3) + 'vw);bottom:calc(' + (l.box[1] + GROUND) + 'vh - ' + ((K.oy + H - K.of[1]) * kv).toFixed(3) + 'vw);width:' + (W * kv).toFixed(3) + 'vw;z-index:' + (l.z != null ? l.z : 3) + ';aspect-ratio:' + K.w + '/' + K.h; }
  function talkEl(a, shotId, key) { var rec = a.layers()[key], el = rec && rec.el, sh = SHOTS[String(a.comp() || '').slice(3)] || SHOTS[shotId] || {}, l = (sh.layers || []).filter(function (x) { return x.key === key; })[0], K = l && l.src && TALK[l.src];
    if (!el || !el.isConnected || el.tagName !== 'IMG' || !K) return null;
    var v = el._talk, css = talkCss(l, sh);
    if (!v) { v = el._talk = document.createElement('video'); v.className = 'jjst-layer st2ph st2talk'; v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.preload = 'auto'; v.innerHTML = window.jjClipSrc(a.GB + K.vid, a.AV); v._owner = el; }
    if (v._css !== css) { v._css = css; v.style.cssText = css + ';opacity:' + (v._on ? 1 : 0) + ';transition:opacity .15s linear'; }
    if (v.parentNode !== el.parentNode || v.previousSibling !== el) el.parentNode.insertBefore(v, el.nextSibling);   // (the camera may have moved the still onto a plate: the clip goes with it)
    return { el: el, v: v }; }
  function talkOn(a, shotId, key) { var t = talkEl(a, shotId, key); if (!t || t.v._on) return !!t; var el = t.el, v = t.v; v._on = true; clearTimeout(v._offT); clearTimeout(v._hideT);
    try { v.currentTime = 0; } catch (e) {}                    // from its first frame: the one the still was matched to
    var shown = function () { if (!v._on || v._shown) return; v._shown = true; v.style.opacity = '1'; v._hideT = setTimeout(function () { if (v._on && el.isConnected) { el.style.transition = 'opacity .15s linear'; el.style.opacity = '0'; } }, 150); };   // the still only goes once the clip is really painting: he is never missing
    v._shown = false; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
    if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(shown); else v.addEventListener('playing', shown, { once: true });
    var loop = function () { if (!v._on) return; v._raf = requestAnimationFrame(loop); if (el.isConnected) v.style.transform = getComputedStyle(el).transform; };   // it rides the still's own motion (the hover, the fly-in, the exit, the flip)
    loop(); return true; }
  function talkOff(a, key) { var rec = a.layers()[key], el = rec && rec.el, v = el && el._talk; if (!v || !v._on) return; v._on = false; clearTimeout(v._hideT); cancelAnimationFrame(v._raf);
    if (el.isConnected) { el.style.transition = 'opacity .15s linear'; el.style.opacity = '1'; } v.style.opacity = '0'; v._offT = setTimeout(function () { if (!v._on) { try { v.pause(); } catch (e) {} } }, 220); }
  function talkTidy() { [].forEach.call(document.querySelectorAll('#jjst .st2talk'), function (v) { if (!v._owner || !v._owner.isConnected) v.remove(); else if (!v._on && v._owner.style.opacity === '0') v._owner.style.opacity = '1'; }); }   // a talking clip whose figure has left goes too; a figure is never left hidden

  /* ---- a speech bubble ---- */
  /* a figure's box on screen without its own bob: its layout box, through its camera plate's transform, plus its pan (translate).
     The bubble follows this every frame, so it rides the camera's moves but not the idle breathing. */
  function anchorOf(el) { var srcOf = String(el.currentSrc || el.src || ''); if (el._probe && el._probe.isConnected) { srcOf = String(el._probeSrc || srcOf); el = el._probe; }   /* (a figure changing pose: the box it is going to) */ var p = el.offsetParent || el.parentNode, pr = p.getBoundingClientRect(), k = p.offsetWidth ? pr.width / p.offsetWidth : 1, tr = getComputedStyle(el).translate, tx = 0, ty = 0;
    if (tr && tr !== 'none') { var m = tr.split(' '); tx = parseFloat(m[0]) || 0; ty = parseFloat(m[1]) || 0; }
    var h = el.offsetHeight || (el.offsetWidth * ((el.naturalHeight / el.naturalWidth) || 1));
    var o = { left: pr.left + k * (el.offsetLeft + tx), top: pr.top + k * (el.offsetTop + ty), width: k * el.offsetWidth, height: k * h }, sr = srcOf;
    if (/story2-joe-(angry|concerned|confused|emotional|happier|nervous|sad|approaching|calm-hands-up|cautious-peace)/.test(sr)) { var wide = /approaching|calm-hands-up|cautious-peace/.test(sr), a0 = wide ? .3 : .2, a1 = wide ? .33 : .27, fl = /--flip:\s*-1/.test(el.style.cssText); o.left += o.width * (fl ? a1 : a0); o.width *= 1 - a0 - a1; }   // st2-19: Joe's stills sit on a wide canvas: a bubble is placed by the figure himself (it used to treat the empty canvas as him, and on a short screen sat on his face)
    return o; }
  /* ---- st2-22 · THE 'PREVIOUSLY' BOOK (a prototype: it only plays behind ?book=1, in front of shot 1.1; the mechanism is the engine's: storytime.js, bookRun).
     Three spreads, six lines, one line and one miniature on every page (the copy is Joe's, final: edit it here). red: the words set in red. pic: a picture key
     the engine draws as a woodcut stand-in until the painted miniatures land (BOOK_ART in storytime.js). band: the motif of the strip along the page's foot (1 to 5).
     The sixth picture is shot 1.1's own first frame, printed (print): the camera pushes into it until it lies exactly on the real shot, and the tale begins.
     (The village in this book is Part One's village, Thatchwick. It is NOT the village of the burnt 'Welcome to ...head' sign in Scene 2: that one is in the land
     beyond the portal. Nothing here connects them.) ---- */
  var BOOK2 = { pages: [   // box: the painted box behind an initial · div: the flourish under the line · medal: a roundel on the band · corners: painted vine corners beside the miniature
    { text: 'Last time, a dragon set the village alight...', red: ['dragon', 'alight'], pic: 'book-p2-1', band: 3, box: 'gold', div: 'dragon', medal: 'dragon' },   /* st2-24 working text (a trial). Before: 'Last time, a dragon came and set the village alight...', red: ['dragon', 'alight'] */
    { text: '...so Joe the Righteous rode into the night.', red: ['Joe the Righteous', 'night'], pic: 'book-p2-2', band: 3, div: 'acorn', corners: [1, 2] },   /* st2-24 working text (a trial). Before: '...so Joe the Righteous rode off into the night.', red: ['Joe the Righteous', 'night'] */
    { text: 'Through hills and woods, to an arch of stone...', red: ['hills', 'woods', 'arch of stone'], pic: 'book-p2-3', band: 4, box: 'green', div: 'acorn', medal: 'knight' },   /* st2-24 working text (a trial). Before: 'He rode through hills and forests to find an arch of stone...', red: ['hills and forests', 'arch of stone'] */
    { text: '...which swallowed him whole, with a flash and a groan.', red: ['flash', 'groan'], pic: 'book-p2-4', band: 4, div: 'acorn', corners: [3, 4] },   /* st2-24 working text (a trial). Before: '...which swallowed him whole, with a flash and a groan...', red: ['swallowed', 'flash'] */
    { text: 'It whisked him away, to a land unknown...', red: ['land unknown'], pic: 'book-p2-5', band: 5, box: 'blue', div: 'sunmoon', medal: 'arch' },   /* st2-24 working text (a trial). Before: 'It whisked him far away, to a land unknown...', red: ['far away', 'unknown'] */
    { text: '...and spat him out there, all alone.', red: ['all alone'], pic: 'book-p2-6', band: 5, div: 'acorn', print: true, singed: true } ] };   /* st2-24 working text (a trial). Before: '...and spat him out in a wasteland, all alone.', red: ['wasteland', 'alone'] */
  /* ---- st2-20 · pacing by reading time (Joe: 'the Nexts should speed up, especially on shorter messages, in comparison to how long the text is'). ONE rule for every
     bubble: after its last character it holds clamp(600 + 38 x characters, 1300, 3800) ms: a state 1 / 3 line then moves on, a state 2 / 4 line's progress line is full
     and its Next starts to glow, a lead line's prompt appears. Narration: clamp(600 + 28 x characters, 1500, 4200) after typing (st2-21). And no line types
     for longer than 2.5s: a long one types faster (typeK, both the bubbles' typing here and the engine's for narration) ---- */
  var TYPE_MAX = 2500, LEAD_MS = 500;
  function readHold(n) { return Math.max(1300, Math.min(3800, 600 + 38 * n)); }
  function narHold(n) { return Math.max(1500, Math.min(4200, 600 + 28 * n)); }   /* st2-21: quicker (was 800 + 40n, 1800..6000: long lines got no faster) */
  function bubDelay(text, i, alien) { return alien ? 9 : /[.!?…]/.test(text.charAt(i - 1)) ? 160 : 28; }   // the wait after character i
  function bubK(text, alien) { var t = 0; for (var i = 1; i < text.length; i++) t += bubDelay(text, i, alien); return t > TYPE_MAX ? TYPE_MAX / t : 1; }
  function narDur(text) { var T = (api && api.T) || {}, sp = T.typeSpeed || 30, dot = T.pauseDot || 200, el = T.pauseEllipsis || 400, d = 0;   // (the engine's typeDuration, so the pace is known when the beats are built)
    for (var i = 1; i <= text.length; i++) { var ch = text.charAt(i - 1), t = sp; if (ch === '…') t = el; else if (ch === '.') { if (text.charAt(i) === '.') t = sp; else if (text.charAt(i - 2) === '.') t = el; else t = dot; } else if (ch === '!' || ch === '?') t = dot; d += t; }
    return d; }
  function narK(text) { var d = narDur(text); return d > TYPE_MAX ? TYPE_MAX / d : 1; }
  /* st2-20 · A BUBBLE'S PLACE IS DECIDED ONCE (Joe: 2.3's thought started over his head, then jumped to the side). It used to be re-placed on every frame, so it
     opened wherever its speaker was while the camera was still travelling from the last shot, then followed him and changed side when the room over his head ran
     out. Now it is measured ONE time, just before it appears, for the shot's FINAL framing: every camera move in flight (the board's pan and the rig's plates, all
     WAAPI) is run to its end for the measurement and put straight back (nothing is painted in between), with the shot's own layers in and the speaker's picture
     loaded. It never moves while it is up (only a real resize of the window places it again, the same way) ---- */
  function settled(a, fn) { var jj = a.stage(), list = [];
    try { (jj && jj.getAnimations ? jj.getAnimations({ subtree: true }) : []).forEach(function (an) { if ((an === bpAnim || an._jjcam) && an.effect && an.playState !== 'finished' && an.playState !== 'idle') list.push([an, an.currentTime, 1]);
        else if (window.CSSAnimation && an instanceof CSSAnimation && an.effect && an.effect.target && an.effect.target.classList && an.effect.target.classList.contains('jjst-layer') && an.playState === 'running') list.push([an, an.currentTime, 0]); }); } catch (e) { list = []; }   /* st2-25 · A4: a figure's own loop (its hover, its breathing) is put at its rest for the measurement too: the bubble's place no longer depends on where in its bob the speaker happened to be (it differed by a few px from one arrival to the next) */
    list.forEach(function (q) { try { q[0].currentTime = q[2] ? q[0].effect.getComputedTiming().endTime : 0; } catch (e) {} });
    try { return fn(); } finally { list.forEach(function (q) { try { q[0].currentTime = q[1]; } catch (e) {} }); } }
  var sayMore = null;                                          // the bubble on screen can be asked to stay a little longer (the sign swinging up beside Joe's thought)
  function runSay(d, shotId, compName) { return function (a, done) {
    var st = a.stage(), c = CAST[d.who] || { name: sentence(d.who), key: null }, sh = SHOTS[shotId] || {}, p = String(d.paren || ''), auto = !!d.auto, alien = /alien/.test(p), cutAt = d.split ? d.text.indexOf(d.split) : -1;
    if (skipTo === shotId) { done(); return; }                // an egg was pressed: straight on to the choice
    var thought = /thought/.test(p), spoken = /spoken/.test(p), offFix = /off screen|behind the door|calling back/.test(p) || !c.key || (sh.off && sh.off[d.who] != null), offKey = offFix || !(a.layers()[c.key]),   /* st2-25 · A4: offFix: off screen by the script. (offKey also counted a speaker whose shot had not been built yet, and kept the bubble at the side for good) */ lead = !!d.lead, small = !!d.small, waits = !auto && !lead && !small;
    leadOff();
    var b = document.createElement('div'); b.className = 'jjst2-bub' + (thought ? ' thought' : '') + (spoken ? ' sub' : '') + (auto ? ' auto' : '') + (alien ? ' alien' : '') + (small ? ' small' : '') + (lead || small ? ' nonext' : ''); b.setAttribute('role', 'button'); b.setAttribute('tabindex', '0'); b.setAttribute('data-cursor', 'hover');
    var tag = p && p.length <= 22 && !thought && !spoken && !alien && !/off screen|behind the door/.test(p) ? p : '';   // only a short acting note shows as a tag (‘annoyed’, ‘calling back’)
    b.innerHTML = '<div class="pn"><div class="who"><b></b><i></i></div><div class="txw"><span class="tx"></span>' + (lead || small ? '' : '<i class="nsp"></i>') + '</div>' + (lead || small ? '' : '<i class="pgl"><b></b></i><button type="button" class="nxl" data-cursor="hover" aria-label="Next">Next<svg viewBox="0 0 7 12" fill="none" aria-hidden="true"><path d="M1 1l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><i class="ul"></i></button>') + '<i class="tail"></i></div>';
    b.querySelector('.who b').textContent = c.name; b.querySelector('.who i').textContent = tag ? sentence(tag) : (thought ? 'Thinking' : '');
    st.appendChild(b); if (d.text.length > BUB && window.console) console.warn('[st2] bubble over ' + BUB + ' chars:', d.text);
    var tx = b.querySelector('.tx'), i = 0, typing = true, tw = null, autoT = null, docked = false, last = '', MODES = ['dock', 'off-left', 'off-right', 'below', 'notail'];
    /* st2-17 (Joe: a bubble shifted part-way through typing, when its text wrapped onto a second line): the whole line is in the bubble from the first character, the part
       still to come unseen, so the panel has its final size and place and every word is already where it will end up; Next and the progress line hold their space too */
    tx.innerHTML = '<span></span><span style="visibility:hidden" aria-hidden="true"></span>'; var tyEl = tx.firstChild, trEl = tx.lastChild, typed = function (n) { tyEl.textContent = d.text.slice(0, n); trEl.textContent = d.text.slice(n); }; typed(0);
    var txw = b.querySelector('.txw'), size = function () { txw.style.minHeight = ''; txw.style.minHeight = txw.offsetHeight + 'px'; };
    var clamp = function (v, lo, hi) { return Math.max(lo, Math.min(hi, v)); };
    var put = function (mode, x, y, tX, tY) { var key = mode + '|' + Math.round(x) + '|' + Math.round(y) + '|' + Math.round(tX || 0) + '|' + Math.round(tY || 0); if (key === last) return; last = key;
      MODES.forEach(function (m) { b.classList.toggle(m, m === mode); });
      b.style.left = mode === 'dock' ? '' : Math.round(x) + 'px'; b.style.top = mode === 'dock' ? '' : Math.round(y) + 'px';
      if (tX != null) b.style.setProperty('--tx', Math.round(tX) + 'px'); if (tY != null) b.style.setProperty('--ty', Math.round(tY) + 'px'); };
    var place = function () { if (!b.isConnected) return; if (docked) { put('dock', 0, 0); return; }
      var sr = st.getBoundingClientRect(), W = sr.width, H = sr.height, bw = b.offsetWidth, bh = b.offsetHeight, rec = c.key && a.layers()[c.key], side = (sh.off && sh.off[d.who]) || 'right', ph = phone();
      var cap = a.cap(), cr = cap ? cap.getBoundingClientRect() : null, capTop = cr && cr.height ? cr.top - sr.top : H * .72, ctl = ph && document.getElementById('jjst-ctl'), topMin = ctl && ctl.offsetHeight ? ctl.getBoundingClientRect().bottom - sr.top + 10 : H < 430 ? navBottom(sr, H) + 6 : 74, gap = thought ? 52 : 26;   // capTop: the dimmed banner's top — the bubble keeps above it
      var low = function (cx0) { var yb = capTop - bh - 10, bx = (W - bw) / 2; if (yb < H * .54) { docked = true; put('dock', 0, 0); return; }   // a phone: straight above the dimmed banner (both show), its tail up to the speaker; no room for both = the dock, over the banner
        var aim = cx0 != null && cx0 > bx + 26 && cx0 < bx + bw - 26; put(aim ? 'below' : 'notail', bx, yb, aim ? cx0 - bx : null); };
      if (spoken) { if (ph) low(null); else put('', (W - bw) / 2, Math.max(topMin, Math.min(capTop - bh - 14, H * .68 - bh / 2))); return; }
      if (offFix || !rec || !rec.el || !rec.el.isConnected) { if (ph) low(null); else if (typeof side === 'number') put('notail', clamp(W * side - bw / 2, 14, W - bw - 14), Math.max(topMin + 14, Math.min(capTop - bh - 16, H * .22))); else put('off-' + side, side === 'left' ? W * .03 : W * .97 - bw, Math.max(topMin, Math.min(capTop - bh - 16, H * .3))); return; }   // (a number: a voice from off screen, over the place its owner will walk into)
      var r = anchorOf(rec.el), cx = r.left + r.width / 2 - sr.left, top = r.top - sr.top, x = clamp(cx - bw / 2, 14, W - bw - 14), y = top - bh - gap;
      if (y >= topMin) { put('', x, y, clamp(cx - x, 26, bw - 26)); return; }
      if (ph) { low(cx); return; }                              // a phone with no room over the head
      /* no room above (a close shot, or a short window: Joe's pane — the bubble used to drop onto its own speaker and hide him): try beside the
         head on either side and above-clamped, and take the place that covers the speaker and the other figures least */
      var hy = top + r.height * .2, sy = clamp(hy - bh / 2, topMin, Math.max(topMin, capTop - bh - 12)), rl = r.left - sr.left, figs = [[rl, top, rl + r.width, top + r.height, 3]];
      if ((sh.ints || []).some(function (q) { return q.react === 'sign'; })) { var sw = Math.min(W * .31, 430); figs.push([W * .95 - sw - 10, H * .13 - 10, W * .95 + 10, H * .13 + sw * .82, 6]); }   // (st2-14: the place the sign swings up into stays free, so the thought never sits on it)
      for (var ck in CAST) { var ok = CAST[ck].key, orec = ok && ok !== c.key && a.layers()[ok]; if (orec && orec.el && orec.el.isConnected) { var q = anchorOf(orec.el); figs.push([q.left - sr.left, q.top - sr.top, q.left - sr.left + q.width, q.top - sr.top + q.height * .55, 2]); } }
      var cover = function (x0, y0) { var t = 0; figs.forEach(function (f) { t += Math.max(0, Math.min(x0 + bw, f[2]) - Math.max(x0, f[0])) * Math.max(0, Math.min(y0 + bh, f[3]) - Math.max(y0, f[1])) * f[4]; }); return t; };
      var cands = (cx > W / 2 ? [1, 0] : [0, 1]).map(function (lf) { return { m: thought ? 'notail' : lf ? 'off-right' : 'off-left', x: clamp(lf ? rl - bw - 26 : rl + r.width + 26, 14, W - bw - 14), y: sy }; });
      cands.push({ m: '', x: x, y: topMin }); var best = null; cands.forEach(function (o) { o.c = cover(o.x, o.y); if (!best || o.c < best.c - 1) best = o; });
      if (best.m) put(best.m, best.x, best.y, null, clamp(hy - best.y, 26, bh - 26)); else put('', best.x, best.y, clamp(cx - best.x, 26, bw - 26)); };
    size(); place();
    /* st2-14 · once the line is typed: a LEAD line hands on to its prompt at once (the bubble stays up: leadKeep); a small aside holds ~3s; every other line fills its
       progress line over its read (at least 3.5s; d.min: at least that) — then a state 1 / 3 line moves on by itself, and a state 2 / 4 line stays, its line and its
       Next pulsing gently, until Next is pressed */
    var ended = false, armed = false, selfGo = false, arm = function () { if (armed) return; armed = true; if (d.actAfter) playAct(a, d.actAfter, shotId);   /* (st2-25 · D7: a clip that follows the line: Clive's sigh) */
      var hold = Math.max(moreMin, d.hold != null ? d.hold : readHold(d.text.length));   // st2-20: by reading time (d.hold: a line with its own, Grik's alien one)
      if (lead) { autoT = a.sched(function () { ended = true; done(); }, LEAD_MS); return; }   /* st2-21: a line that leads into a required action: its prompt comes 500 ms after the last character (the reading-time hold is only for lines that advance or glow) */
      holdEnd = performance.now() + hold; autoT = a.sched(function () { if (waits && !selfGo) b.classList.add('ready'); else done(); }, hold);
      var pg = b.querySelector('.pgl b'); if (pg && pg.animate) pgA = pg.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: hold, easing: 'linear', fill: 'forwards' }); };
    var moreMin = 0, holdEnd = 0, pgA = null, more = function (ms, go) { if (lead || (waits && !go)) return; var turn = waits && go && !selfGo; if (turn) { selfGo = true; b.classList.remove('ready'); }   /* st2-25 · D3: go = a line that waits for Next is told to move on by itself, ms from now (the signpost pressed under Joe's thought: the sign gets its read time, then both leave) */ if (!armed) { moreMin = Math.max(moreMin, ms); return; }   // (an auto line asked to stay: at least ms from now)
      var left = holdEnd - performance.now(); if ((!turn && left >= ms) || !b.isConnected || !b.classList.contains('on')) return; a.unsched(autoT); holdEnd = performance.now() + ms; autoT = a.sched(function () { done(); }, ms);
      var pg = b.querySelector('.pgl b'); if (pg && pg.animate) { var f = turn ? 0 : pgA && pgA.effect && pgA.effect.getComputedTiming ? (pgA.effect.getComputedTiming().progress || 0) : 0; if (pgA) pgA.cancel(); pgA = pg.animate([{ transform: 'scaleX(' + f + ')' }, { transform: 'scaleX(1)' }], { duration: ms, easing: 'linear', fill: 'forwards' }); } };
    sayMore = more;
    var said = false, talkTill = 0, mouth = function (on) { if (on === said) return; if (on) { if (talkOn(a, shotId, c.key)) { said = true; talkTill = Math.max(talkTill, performance.now() + 700); } } else { said = false; talkOff(a, c.key); } };   // the speaker's mouth moves only while its words are typing
    var part2 = cutAt < 0, midT = null, tk = bubK(d.text, alien);   // st2-20: a long line types faster, so none types for over 2.5s
    var step = function () { if (!b.isConnected) return; i++; typed(i); if (i >= d.text.length) { typing = false; b.classList.add('done'); arm(); return; }
      if (!part2 && i >= cutAt) { part2 = true;               // a two-part bubble: the first sentence is in; a beat of silence (Joe stares), the act plays (Clive's long sigh), then the rest types into the same bubble
        midT = a.sched(function () { if (d.act) playAct(a, d.act, shotId); midT = a.sched(function () { midT = null; step(); }, d.act ? Math.min(3000, (ACTS[d.act] || {}).ms || 3000) : 400); }, 950); return; }
      if (d.poseAt && i === d.text.indexOf(d.poseAt[0]) && c.key) poseSwap(a, c.key, d.poseAt[1]);   // (between his sentences: 'You'll need some wings…' → '*laughs* I think I know a guy')
      tw = a.sched(step, bubDelay(d.text, i, alien) * tk); };
    var fin = function () { a.unsched(tw); a.unsched(midT); midT = null; typing = false; part2 = true; i = d.text.length; typed(i); b.classList.add('done'); arm(); };
    var press = function (e) { if (e) { e.preventDefault(); e.stopPropagation(); } if (a.paused()) return; if (typing) fin(); else if (!lead) done(); };   // (a lead line has no Next: its action moves the story on; the transport still does)
    b.addEventListener('click', press); b.addEventListener('keydown', function (e) { if (e.key === 'Enter') press(e); });
    var rp = function () { docked = false; last = ''; size(); settled(a, place); }; window.addEventListener('resize', rp);
    var raf = 0, follow = function () { raf = requestAnimationFrame(follow); if (a.paused()) { mouth(false); return; }   // (st2-20: it no longer re-places the bubble: see settled)
      if (c.key && alien) mouth(b.classList.contains('on')); };   // (st2-14, Joe: his talking clip for as long as the alien bubble is up; every other line is the calm still)   // (st2-10, Joe: the talking clip only for the alien line; every other line is the calm still, floating)   // the camera moves under it: it stays on its speaker (and under a pause the speaker is the calm still)
    if (c.key && !offKey) panTo(a, shotId, c.key);
    var showT = a.sched(function () { requestAnimationFrame(function () { requestAnimationFrame(function () { var n = 0, show = function () { var rc = c.key && a.layers()[c.key], el = rc && rc.el;
          if ((actsDue || (compName && builtWait(a, compName)) || (el && el.tagName === 'IMG' && !(el.complete && el.naturalWidth))) && ++n < 45) { showT = a.sched(show, 40); return; }   /* (st2-25: up to 1.8 s, was 0.6) */   // (its speaker's picture has not arrived yet: a moment, so it is measured as it will be)
          last = ''; size(); settled(a, place); b.classList.add('on'); tw = a.sched(step, 330); follow(); }; show(); }); }); }, Math.max(0, darkUntil - performance.now()) + (d.wait || 0));   // (after a dip to black: once the picture is back; d.wait: something else happens first)
    var gone = function () { if (sayMore === more) sayMore = null; mouth(false); cancelAnimationFrame(raf); window.removeEventListener('resize', rp); b.classList.remove('on'); setTimeout(function () { if (b.parentNode) b.remove(); }, 300); };
    a.onLeave(function () { a.unsched(showT); a.unsched(tw); a.unsched(midT); a.unsched(autoT); if (lead && ended) { leadKeep = gone; return; } gone(); });   // (a lead line that handed on to its prompt stays up until the prompt is answered: leadOff)
  }; }

  /* ---- a choice: two big cards; the story waits. It opens when its beat comes (after Clive's last line) or at once when an egg in the nest is pressed (skipTo) ---- */
  var skipTo = null, leadKeep = null;
  function leadOff() { var g = leadKeep; leadKeep = null; if (g) g(); }
  function runChoice(d) { return function (a, done) {
    var st = a.stage(), w = document.createElement('div'); w.id = 'jjst2-choice'; skipTo = null;
    w.innerHTML = '<h3>Pick your egg</h3><div class="cards">' + ['frost', 'fire'].map(function (k) { var p = PICK[k];
      return '<button type="button" class="jjst2-card" data-k="' + k + '" data-cursor="hover" style="--ea:' + p.a + ';--eb:' + p.b + ';--eg:' + p.tint + '66"><img class="egg" alt="" src="' + api.GB + p.art + '.webp' + api.AV + '"><span class="tx2"><div class="nm">' + p.name + '</div><div class="sb">' + p.sub + '</div></span></button>'; }).join('') + '</div>';
    st.appendChild(w); requestAnimationFrame(function () { w.classList.add('on'); });
    var picked = false; w.addEventListener('click', function (e) { var c = e.target.closest && e.target.closest('.jjst2-card'); e.stopPropagation(); if (!c || picked || a.paused()) return; picked = true;
      setPick(c.getAttribute('data-k')); c.classList.add('pick'); [].forEach.call(w.querySelectorAll('.jjst2-card'), function (o) { if (o !== c) o.classList.add('lose'); }); a.flash(false);
      a.sched(function () { done(); }, 1500); });
    a.onLeave(function () { w.classList.remove('on'); setTimeout(function () { if (w.parentNode) w.remove(); }, 420); });
  }; }

  /* ---- a required press: unmissable, and it never strands the visitor (st2-4, Joe: 'super, super clear'; the old pill faded after 7s).
     The thing to press glows and pulses (purple and flickering for a portal), a large prompt with an arrow sits on it and stays as long as the
     wait lasts, it answers the pointer (hover), and after NEED_WAIT with no press the story presses it by itself and carries on. ---- */
  var softNeed = null, NEED_WAIT = 8000, needEl = null, needRaf = 0, needTarget = null, needOffs = null;
  /* the bottom of the site's nav (the logo, the pills, Menu), from the stage's top: what a prompt or a bubble keeps under when the transport is not up there */
  function navBottom(sr, H) { var b = 0; [document.getElementById('jj-sc-hud'), document.querySelector('.menu-container'), document.querySelector('.nav-logo-link')].forEach(function (e) { if (!e || !e.offsetWidth) return; var r = e.getBoundingClientRect(); if (r.top < H * .4) b = Math.max(b, r.bottom - sr.top); }); return b || Math.min(90, H * .2); }
  function needOn(a, key, text, kind) { var st = a.stage(), rec = a.layers()[key], el = rec && rec.el; needOff(true); if (!st || !el) { pill(text, 60000); return; }
    var n = needEl = document.createElement('div'); n.id = 'jjst2-need'; n.className = kind || '';
    n.innerHTML = '<i class="gw"></i><i class="rg"></i><i class="rg b"></i><div class="pp"><div id="jjst-hint"><span></span></div><i class="ar"><svg viewBox="0 0 24 24"><path d="M12 22 2.5 9H9V2h6v7h6.5z"/></svg></i></div>';
    n.querySelector('span').textContent = text; st.appendChild(n); needTarget = el;
    var hov = function () { n.classList.add('hov'); }, out = function () { n.classList.remove('hov'); }; el.addEventListener('pointerenter', hov); el.addEventListener('pointerleave', out);
    needOffs = function () { el.removeEventListener('pointerenter', hov); el.removeEventListener('pointerleave', out); };
    var gw = n.querySelector('.gw'), rgs = n.querySelectorAll('.rg'), pp = n.querySelector('.pp'), last = '';
    var lay = function () { if (needEl !== n) return; needRaf = requestAnimationFrame(lay); if (!el.isConnected || a.paused()) return;
      var sr = st.getBoundingClientRect(), r = el.getBoundingClientRect(), W = sr.width, H = sr.height, cx = r.left + r.width / 2 - sr.left, big = r.height > H * .3, cy = r.top - sr.top + r.height * (big ? .6 : .5);
      var cap = a.cap(), cr = cap ? cap.getBoundingClientRect() : null, capTop = cr && cr.height ? cr.top - sr.top : H * .72, ring = Math.max(70, Math.min(260, Math.min(r.width, r.height) * (big ? .62 : .95)));
      var ctl = document.getElementById('jjst-ctl'), pw = pp.offsetWidth, ph = pp.offsetHeight, cq = ctl && ctl.offsetHeight ? ctl.getBoundingClientRect() : null, top = Math.max(cq && cq.top - sr.top < H * .4 ? cq.bottom - sr.top : navBottom(sr, H), H < 430 ? navBottom(sr, H) : 0) + (H < 430 ? 6 : 16), up = false, py;   // (clear of the transport)
      if (big && r.top - sr.top - ph - 14 >= top) big = false;                                  // (st2-14: a big target with room above it, Ember: the prompt goes above her, not over her face)
      if (big) py = Math.max(top + ph / 2, r.top - sr.top + r.height * .24);                    // a big target (the arch): the prompt sits in it, its arrow down to the pulse
      else { py = r.top - sr.top - ph / 2 - 14; if (py - ph / 2 < top) { up = true; py = Math.min(capTop - ph / 2 - 10, r.bottom - sr.top + ph / 2 + 14); } }   // a small one: above it (below, arrow up, when there is no room)
      if (big && py + ph / 2 > cy - 6) cy = Math.min(r.bottom - sr.top - 10, py + ph / 2 + ring * .3);
      cy = Math.min(cy, capTop - 24);
      var pm = pw * .04 + 14, px = Math.max(pw / 2 + pm, Math.min(W - pw / 2 - pm, cx)), key2 = [Math.round(cx), Math.round(cy), Math.round(ring), Math.round(px), Math.round(py), up].join('|'); if (key2 === last) return; last = key2;
      pp.classList.toggle('up', up); pp.style.left = Math.round(px) + 'px'; pp.style.top = Math.round(py) + 'px';
      [gw, rgs[0], rgs[1]].forEach(function (e, i) { var s = i ? ring : ring * 1.5; e.style.left = Math.round(cx) + 'px'; e.style.top = Math.round(cy) + 'px'; e.style.width = e.style.height = Math.round(s) + 'px'; }); };
    lay(); requestAnimationFrame(function () { if (needEl === n) n.classList.add('on'); }); }
  function needText(t) { if (needEl) needEl.querySelector('span').textContent = t; }
  function needOff(now) { var n = needEl; needEl = null; cancelAnimationFrame(needRaf); if (needOffs) { needOffs(); needOffs = null; } needTarget = null; if (!n) return; if (now) { n.remove(); return; } n.classList.remove('on'); setTimeout(function () { if (n.parentNode) n.remove(); }, 380); }

  /* ---- a shot with no words: it holds (or waits for its press). A required press is the trigger for what comes next (the portal brings Grik,
     the ice dragon her statue…); Next still gets past it; a press made early, while the shot's bubble was still up, counts; and if nobody
     presses, it presses itself after NEED_WAIT. ---- */
  var startTok = 0, actsDue = false;   // actsDue: a jumped-to beat's acts are still waiting for its shot to be built (its bubble waits for them)
  function builtWait(a, comp) { var id = String(comp || '').slice(3), sh = SHOTS[id] || SHOTS[id.replace(/[a-z]+$/, '')]; if (a.building) return a.building() === comp;   /* (the engine says which shot is still waiting for its dip's black) */ if (!sh || !sh.dip) return false; if (a.comp() !== comp) return true; var L = a.layers(), k; for (k in L) if (L[k] && L[k].el && L[k].el.isConnected) return false; return true; }   // true while a dip shot asked for by a step has not been built yet (the engine names the shot at once, but its figures only exist from the swap under the black)
  var waiting = null;   // { shot, key, need, n, done, kick }
  /* st2-25 · A4 (the back audit: Prev onto 'Is that...me?' showed no ice statue and the ice dragon standing again). What a required press leaves behind (the statue,
     the dragon sitting, the flashback gone, Joe's face, his steps toward Ember) used to exist only as the press's own animation: a Prev / Next that landed on a LATER
     line of the same shot rebuilt the shot as it opens. Now every beat after a required press puts that press's result in place when it is jumped to (needDone),
     and a jump back ONTO the press itself forgets the earlier presses (so it can be pressed again, and is not skipped). */
  function needDone(a, shotId, cfg) { if (a.comp() !== 's2_' + shotId) return; var id = shotId + ':' + cfg.key; taps[id] = Math.max(taps[id] || 0, cfg.need || 1);
    if (cfg.show) { var sr = a.layers()[cfg.show]; if (sr && sr.el) sr.el.style.visibility = 'visible'; }
    if (cfg.hide) [].concat(cfg.hide).forEach(function (hk) { var hr = a.layers()[hk]; if (hr && hr.el) { hr.el.style.transition = 'none'; hr.el.style.opacity = '0'; var hv = hr.el.querySelector && hr.el.querySelector('video'); if (hv) { try { hv.pause(); } catch (x) {} } } });
    if (cfg.after) Object.keys(cfg.after).forEach(function (ak) { poseSwap(a, ak, cfg.after[ak]); });
    if (cfg.joe) joeFace(a, cfg.joe, true);
    if (cfg.walk) { var wr = a.layers()[cfg.walk.key], we = wr && wr.el; if (we) { we.style.transition = 'none'; we.style.marginLeft = 'calc(' + (((cfg.need || 1) - 1) * cfg.walk.by).toFixed(4) + ' * ' + DCALC + ')'; } } }
  function runHold(shotId, ms, need) { return function (a, done) { var t = null, off = null, autoT = null;
    if (need) { var cfg = need.cfg || {}, had = Math.min(taps[shotId + ':' + need.key] || 0, need.need || 1);
      if (had >= (need.need || 1)) t = a.sched(done, 500);
      else { var self = function () { if (waiting && waiting.shot === shotId) { waiting.n = waiting.need - 1; onFx(shotId + ':' + need.key, need.key, null, a); } };   // nobody pressed: it happens by itself (the portal sputters, Joe reaches out…)
        var kick = function () { a.unsched(autoT); autoT = a.sched(self, cfg.wait || NEED_WAIT); };
        waiting = { shot: shotId, key: need.key, need: need.need || 1, n: had, done: done, kick: kick }; panTo(a, shotId, need.key); needOn(a, need.key, need.hint, /^(nope|light)$/.test(cfg.react || '') ? 'portal' : ''); kick();
        if (cfg.hold) { var rec = a.layers()[need.key], el = rec && rec.el, ht = null;   // press and hold = all the presses at once
          var dn = function () { clearTimeout(ht); ht = setTimeout(function () { if (!a.paused()) self(); }, cfg.hold); }, up = function () { clearTimeout(ht); };
          if (el) { el.addEventListener('pointerdown', dn); el.addEventListener('pointerup', up); el.addEventListener('pointerleave', up); off = function () { clearTimeout(ht); el.removeEventListener('pointerdown', dn); el.removeEventListener('pointerup', up); el.removeEventListener('pointerleave', up); }; } } } }
    else t = a.sched(done, ms || 4000);
    a.onLeave(function () { a.unsched(t); a.unsched(autoT); if (off) off(); if (waiting && waiting.shot === shotId) waiting = null; needOff(); pillOff(); leadOff(); });
  }; }

  /* ---- the sign: pressing the burnt signpost swings a large tattered sign up in the top-left gap ---- */
  var SIGN_ART = true, SIGN_READ = 3400, signEl = null, signT = null;   // story2-sign.webp (st2-5); false = the code-drawn stand-in
  function signOn(a) { var st = a.stage(); if (!st) return; signOff(true);
    signEl = document.createElement('div'); signEl.id = 'jjst2-sign';
    signEl.innerHTML = SIGN_ART ? '<img alt="" src="' + a.GB + 'story2-sign.webp' + a.AV + '">' : '<div class="bd"><b>Welcome to ...head.</b><span>Home of the ...</span><em>Placeholder: story2-sign.webp</em></div>';
    st.appendChild(signEl); }   // st2-20 (Joe): it stays up while his thought is up and leaves with it (the shot's change takes it down: onComp)
  function signOff(now) { if (signT != null && api) api.unsched(signT); signT = null; var e = signEl; signEl = null; if (!e) return; if (now) { e.remove(); return; } e.classList.add('off'); setTimeout(function () { if (e.parentNode) e.remove(); }, 560); }

  /* ---- interactions: a press on a layer (placeholder reactions; the real ones replace react()) ---- */
  var taps = {};
  function onFx(name, key, e, a) { var m = name.split(':'), shotId = m[0], k = m[1], sh = SHOTS[shotId]; if (!sh || (e && a.paused())) return;   // st2-14 · rule 2: nothing answers a press while paused
    var cfg = (sh.ints || []).filter(function (x) { return x.key === k; })[0] || (sh.ints || [])[0] || { react: 'tap' }, rec = a.layers()[k], el = rec && rec.el, id = shotId + ':' + k;
    taps[id] = (taps[id] || 0) + 1;
    var ld = (sh.layers || []).filter(function (x) { return x.key === k; })[0], stg = a.stage(), sr0 = stg ? stg.getBoundingClientRect() : null;
    if (cfg.react === 'choose') { if (a.comp() === 's2_' + shotId && !document.getElementById('jjst2-choice')) { skipTo = shotId; a.next(); } return; }   // an egg in the nest: the choice opens now
    if (ld && ld.hot && sr0 && el) { var hb = el.getBoundingClientRect(); burst((e ? e.clientX : hb.left + hb.width / 2) - sr0.left, (e ? e.clientY : hb.top + hb.height * .6) - sr0.top, 'spark'); }   // nothing of its own to wiggle (it is painted into the land): a spark where it was pressed (or at its heart, when it goes off by itself)
    if (el && el.animate && !(ld && ld.hot)) el.animate([{ scale: '1', rotate: '0deg' }, { scale: '1.12', rotate: '-5deg' }, { scale: '.96', rotate: '4deg' }, { scale: '1', rotate: '0deg' }], { duration: 480, easing: 'ease-out' });   // (scale / rotate only: its translate is the board's pan)
    if (cfg.secret) { var cur = document.documentElement.getAttribute('data-jj-cursor'); if (cur === ORB_CURSOR || /[?&]orb=1\b/.test(location.search)) a.award(cfg.secret, e ? { x: e.clientX, y: e.clientY } : null); }   // the secret: only with the purple orb cursor equipped
    if (cfg.react === 'light' || cfg.react === 'hearts' || cfg.react === 'sparkle' || cfg.react === 'crack') a.flash(false);
    if (cfg.react === 'nope') st2sfx(a, 'portal-sputter', .3);   // the dead portal coughs
    if (cfg.react === 'sign') { if (softNeed) { softNeed = null; needOff(); } if (!signEl) { signOn(a); if (sayMore) sayMore(SIGN_READ, true); } return; }   // st2-20: the thought is timed now, so the sign swinging up keeps it there long enough to read the sign; they leave together
    var jetGo = function () { var J = cfg.jet; if (!J || !sr0 || !el) return 0; var tr = a.layers()[J.to], te = tr && tr.el; if (!te) return 0; var q0 = el.getBoundingClientRect(), q1 = te.getBoundingClientRect(), f = (ld && ld.flip) ? 1 - J.from[0] : J.from[0];
      var p0 = [q0.left + q0.width * f - sr0.left, q0.top + q0.height * J.from[1] - sr0.top], p1 = [q1.left + q1.width * J.at[0] - sr0.left, q1.top + q1.height * J.at[1] - sr0.top], ms = J.kind === 'water' ? 900 : 1200; jet(a, J.kind, p0, p1, ms); st2sfx(a, J.kind === 'water' ? 'water' : 'ice', J.kind === 'water' ? .45 : .3);
      if (J.kind === 'water') { [420, 600, 780, 960, 1150].forEach(function (t, i) { a.sched(function () { burst(p1[0] + (Math.random() - .5) * q1.width * .2, p1[1] + (Math.random() - .5) * q1.height * .08, 'water'); }, t); });   // …full in the face: a splash where it lands, and he splutters
        a.sched(function () { if (te.animate) te.animate([{ translate: '0 0', rotate: '0deg' }, { translate: '-1.2% 0', rotate: '-2.5deg' }, { translate: '.8% 0', rotate: '1.6deg' }, { translate: '-.6% 0', rotate: '-1deg' }, { translate: '0 0', rotate: '0deg' }], { duration: 620, easing: 'ease-out', composite: 'add' }); }, 430); }
      return ms; };
    if (cfg.react === 'wave' && sr0) { for (var q = 0; q < 3; q++) burst(sr0.width * (.12 + Math.random() * .76), sr0.height * (.6 + Math.random() * .1), 'ash'); pill(['A low growl...', 'The growls get louder...', 'Smoke curls up from below...'][Math.min(2, taps[id] - 1)], 2400); return; }   // the dragons answer the sword: growls (sound to come) and smoke rising below
    if (cfg.walk) { var wr = a.layers()[cfg.walk.key], we = wr && wr.el, n = Math.min(taps[id], cfg.need || 1); if (waiting && waiting.shot === shotId && !e) n = cfg.need || 1; if (we && n < (cfg.need || 1)) { var stepGo = function () { var r2 = a.layers()[cfg.walk.key], w2 = r2 && r2.el; if (!w2 || a.comp() !== 's2_' + shotId) return; w2.style.transition = 'margin-left .5s ease'; w2.style.marginLeft = 'calc(' + (n * cfg.walk.by).toFixed(4) + ' * ' + DCALC + ')'; };
        if (cfg.walk.face && (we._face || '') !== cfg.walk.face) { joeFace(a, cfg.walk.face, false, ['st2shake', 'st2still']); setTimeout(stepGo, 230); } else stepGo(); } }   // each press a step closer (a real move; st2-15: on the first one he takes the approaching pose, in place, then steps); the last one is the reach itself (the swap below)
    if (waiting && waiting.shot === shotId && waiting.key === k) { waiting.n++;
      if (shotId === '3.6b' && MUSIC.oasis.want) { var en = Math.min(waiting.n, waiting.need); if (en === 1 && !(MUSIC.oasis.lv > .05)) { try { musSeek(MUSIC.oasis, OAS.full, 1200); MUSIC.oasis.mode = 'A'; } catch (e2) {} }   /* st2-26q: the first step: the music comes back in, from its full body */ musLv(EMBER_STEPS[en - 1], en >= waiting.need ? 1500 : 1200, en >= waiting.need ? 'Ember: the touch' : 'Ember: step ' + en); }   /* st2-25 · E: louder with each step toward her, loudest at the touch */
      if (waiting.n >= waiting.need) { var w = waiting; waiting = null; pillOff(); needOff(); leadOff();
        var jm = jetGo(), showAt = cfg.jet && cfg.jet.kind === 'frost' ? 380 : 0;
        if (cfg.show) a.sched(function () { var sr = a.layers()[cfg.show]; if (sr && sr.el) { sr.el.style.visibility = 'visible';
            if (sr.el.animate) sr.el.animate(cfg.grow ? [{ scale: '.12', opacity: 0, transformOrigin: '50% 100%' }, { scale: '.6', opacity: 1, offset: .35, transformOrigin: '50% 100%' }, { scale: '1.05', opacity: 1, offset: .8, transformOrigin: '50% 100%' }, { scale: '1', opacity: 1, transformOrigin: '50% 100%' }] : [{ opacity: 0 }, { opacity: 1 }], { duration: cfg.grow ? 1250 : 160, easing: 'ease-out' });
            if (cfg.grow && sr0) { var gb = sr.el.getBoundingClientRect(); [0, 200, 400, 600, 800, 1000, 1250].forEach(function (ms) { a.sched(function () { burst(gb.left + gb.width * (.15 + .7 * Math.random()) - sr0.left, gb.top + gb.height * (.1 + .8 * Math.random()) - sr0.top, 'ice'); }, ms); }); } } }, showAt);   // the ice statue grows in under the frost stream, in a scatter of sparkles
        if (cfg.hide) { [].concat(cfg.hide).forEach(function (hk) { var hr = a.layers()[hk]; if (hr && hr.el) { hr.el.style.transition = 'opacity .7s ease'; hr.el.style.opacity = '0'; var hv = hr.el.querySelector('video'); if (hv) setTimeout(function () { try { hv.pause(); } catch (x) {} }, 950); } }); }   // the flashback fades at the touch
        if (cfg.swap) { Object.keys(cfg.swap).forEach(function (sk) { var d2 = cfg.swap[sk] === 'reach' ? SHOTS['3.6t'].layers.filter(function (q) { return q.key === 'joe'; })[0] : null; if (d2) layerSwap(a, sk, d2.src, layerDef('3', shotId, d2).css, ['st2shake', 'st2still'], 160); });   // he reaches out: the reach comes in on top of him, then he is dropped (rule 8)
          [].forEach.call(document.querySelectorAll('#jjst .st2snarl'), function (z) { z.classList.remove('st2snarl'); z.classList.add('st2still'); }); }
        if (cfg.huff && SMOKE[cfg.huff]) { var H = SMOKE[cfg.huff]; [500, 640, 800].forEach(function (t) { a.sched(function () { puffAt(a, H[0], H[1], H[2], H[4], true); }, t); }); a.sched(function () { st2sfx(a, 'fire-spurt', .26); }, 480); }   // her warm little huff
        if (cfg.joe) a.sched(function () { joeFace(a, cfg.joe); }, 500);
        if (cfg.after) Object.keys(cfg.after).forEach(function (ak) { a.sched(function () { poseSwap(a, ak, cfg.after[ak]); }, ak === 'clive' ? 0 : 1500); });   // (the ice dragon sits once the statue is made; Clive startled as Joe reaches for Ember)
        if (cfg.pill) pill(cfg.pill, 2600); a.sched(function () { w.done(); }, cfg.jet ? jm + 1300 : cfg.pill ? 1900 : 1100); }
      else { needText(cfg.need > 1 && cfg.walk ? ['A step closer...keep going', 'Nearly there...once more'][Math.min(1, waiting.n - 1)] : 'Again! ' + w0(waiting)); waiting.kick(); } return; }
    if (cfg.more && taps[id] > (cfg.need || 0)) { pill(cfg.more[(taps[id] - (cfg.need || 0) - 1) % cfg.more.length], 2600); return; }   // pressed again: more of the same joke
    pill(cfg.pill || ('Placeholder: ' + String(cfg.react)), 2600);
  }
  function w0(w) { return (w.need - w.n) + ' more...'; }

  /* ---- cuts ---- */
  function cutEl(a) { var st = a.stage(), c = document.getElementById('jjst2-cut'); if (!c) { c = document.createElement('div'); c.id = 'jjst2-cut'; st.appendChild(c); } return c; }
  function runCut(kind) { return function (a, done) {
    var c = cutEl(a), add = function (cls, html) { var e = document.createElement('i'); e.className = cls; if (html) e.textContent = html; c.appendChild(e); return e; }, mid = 500, total = 1100, e1, e2;
    var kf = function (el, frames, ms, ease) { return el.animate(frames, { duration: ms, easing: ease || 'ease-in-out', fill: 'forwards' }); };
    if (kind === 'dust') { e1 = add('dust'); kf(e1, [{ translate: '0 0' }, { translate: '168% 0' }], 1900, 'cubic-bezier(.4,0,.6,1)'); mid = 800; total = 1950; }
    else if (kind === 'heat') { e1 = add('heat'); kf(e1, [{ opacity: 0 }, { opacity: 1, offset: .45 }, { opacity: 1, offset: .58 }, { opacity: 0 }], 2000); mid = 950; total = 2050; }
    else if (kind === 'whoosh') { e1 = add('whoosh'); kf(e1, [{ translate: '0 0' }, { translate: '172% 0' }], 900, 'cubic-bezier(.5,0,.3,1)'); a.sfx('orb-whoosh', .35); mid = 380; total = 950; }
    else if (kind === 'vortex') { a.flash(true); a.tunnel(true); mid = 1500; total = 1900; a.sched(function () { a.tunnel(false); }, 1850); e1 = add('dip'); kf(e1, [{ opacity: 0 }, { opacity: 0, offset: .7 }, { opacity: 1, offset: .82 }, { opacity: 0 }], 2300); }
    else if (kind === 'scratch') { e2 = add('tag', 'Record scratch'); kf(e2, [{ opacity: 0 }, { opacity: 1, offset: .15 }, { opacity: 1, offset: .8 }, { opacity: 0 }], 900); e1 = add('whoosh'); a.sched(function () { kf(e1, [{ translate: '0 0' }, { translate: '172% 0' }], 520, 'cubic-bezier(.5,0,.3,1)'); }, 700); mid = 950; total = 1350; }
    else if (kind === 'hard' || kind === 'smash') { mid = 40; total = 80; }
    else if (kind === 'dip') { e1 = add('dip'); kf(e1, [{ opacity: 0 }, { opacity: 1, offset: .3 }, { opacity: 1, offset: .62 }, { opacity: 0 }], 1400); mid = 560; total = 1450; }
    else if (kind === 'fade') { e1 = add('dip'); kf(e1, [{ opacity: 0 }, { opacity: 1, offset: .32 }, { opacity: 1, offset: .58 }, { opacity: 0 }], 2500); mid = 1050; total = 2550; }   // a slow fade to black, a beat, and up on the next shot (out of the lava fields, into the egg pick)   // to black and back (the forest's walk-up into its inspect shot)
    else { e1 = add('dip'); kf(e1, [{ opacity: 0 }, { opacity: 1, offset: .42 }, { opacity: 1, offset: .58 }, { opacity: 0 }], 900); mid = 400; total = 950; }
    var t1 = a.sched(function () { if (kind === 'dip' || kind === 'cut' || kind === 'fade') { afterCut = true; darkUntil = performance.now() + (kind === 'fade' ? 1250 : kind === 'dip' ? 620 : 380); } done(); }, mid), t2 = setTimeout(function () { [e1, e2].forEach(function (e) { if (e && e.parentNode) e.remove(); }); }, total + 1400);
    a.onLeave(function () { a.unsched(t1); });   // (the overlay finishes on its own over the next shot)
  }; }
  function cutKind(text) { return /FADE TO BLACK/.test(text) ? 'fade' : /DIP TO BLACK/.test(text) ? 'dip' : /DUST/.test(text) ? 'dust' : /HEAT/.test(text) ? 'heat' : /WHOOSH/.test(text) ? 'whoosh' : /VORTEX/.test(text) ? 'vortex' : /SCRATCH/.test(text) ? 'scratch' : /LIVE ACTION/.test(text) ? 'hard' : /SMASH/.test(text) ? 'smash' : 'cut'; }

  /* ---- the credits roll (placeholder), then on to My Story ---- */
  function runCredits(lines) { return function (a, done) {
    var st = a.stage(), w = document.createElement('div'); w.id = 'jjst2-credits'; var secs = 9 + lines.length * 1.6;
    w.innerHTML = '<div class="roll" style="--d:' + secs + 's"><h4>The Tale of Trogdor &amp; Joe the Righteous</h4>' + lines.map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('') + '<p>The end</p></div>';
    st.appendChild(w); requestAnimationFrame(function () { w.classList.add('on'); });
    if (a.myStoryPrefetch) a.myStoryPrefetch();   /* st2-26p · the hand-over contract (see storytime.js, MS): the credits = the tale's last stretch: My Story may start fetching its first screen */
    var t = a.sched(done, secs * 1000 + 600);
    a.onLeave(function () { a.unsched(t); if (w.parentNode) w.remove(); });
  }; }

  /* ---- the beats: the screenplay, in order, as the engine's scenes ---- */
  function playSfx(a, list) { (list || []).forEach(function (x) { var m = x.split('@'), n = m[0], dl = +m[1] || 0, go = function () { if (n.indexOf('sfx:') === 0) a.sfx(n.slice(4), .35); else a.oneShot(n.slice(4), .3); }; if (dl) a.sched(go, dl); else go(); }); }
  function buildBeats() {
    var beats = [], sc = null, sh = null, comp = null, sceneNar = false, sayN = 0, shotNeeds = [], shotList = [], leadBefore = false, pending = [], shotBeats = 0, intIdx = 0, last = null, credits = null, HINTS = {}, cs = null, ci = 0, joeNow = null;
    var faceOf = function (cid) { var q = ((SHOTS[cid] || {}).layers || []).filter(function (l) { return l.key === 'joe' && l.face; })[0]; return q ? q.face : null; };
    var joeSet = function (it, o) { if (o && o.comp) { comp = 's2_' + o.comp; joeNow = faceOf(o.comp); (function (cid) { pending.push(function (a, jumping) { shotExtras(a, cid, jumping); }); })(o.comp); } if (o && o.joe) joeNow = o.joe; if (joeNow && faceOf(comp.slice(3))) (function (f) { pending.push(function (a, jumping) { joeFace(a, f, jumping); }); })(joeNow); };   // Joe's expression from this beat on (set at every beat, so a Prev / Next lands on the right one)
    var fxRun = { smallHuzzah: function (a, id) { if (HUZZAH_HANDS) { var hr = a.layers().joe; if (hr && hr.el) hr.el._thaw = true; playAct(a, 'hands', id); return; }   /* the hands-only clip, on the cheer's own box */
        var jl = JX('happier-stance', SHOTS[id].layers.filter(function (l) { return l.key === 'joe'; })[0].pos[0] + (JCLIPS['tav-joe-huzzah'][4] - (466 + 830) / 2) * JH / 688, { by: GY }), im = standIn(a, 'joe', jl, id);   /* the stand-in: his happy stance comes in over the frozen cheer (same feet, same size), then two small hops */
        if (im && im.animate) a.sched(function () { im.animate([{ translate: '0 0' }, { translate: '0 -3.5%', offset: .2 }, { translate: '0 0', offset: .42 }, { translate: '0 -2.4%', offset: .62 }, { translate: '0 0', offset: .84 }, { translate: '0 0' }], { duration: 1100, easing: 'ease-out', composite: 'add' }); }, 380); } };
    S.forEach(function (it) { if (it.t === 'shot') { cs = it.id; ci = 0; } else if (it.t === 'int' && cs) { var c0 = ((SHOTS[cs] || {}).ints || [])[ci++]; if (c0 && !c0.need) (HINTS[cs] = HINTS[cs] || []).push(it.text.split(':')[0].replace(/^Optional$/, 'Fly through the wind rings')); } });
    /* st2-25 · A4 (the back audit: Prev into 3.8 left Clive and Joe in the shot's opening poses on every line, and the bubbles off to the right). A shot that lands under
       a dip to black (3.2, 3.8, 3.9) is only BUILT at the swap, ~0.4 s after the step: a beat's own acts (Joe's face, Clive's pose, the press results) ran at the step,
       on figures that were not there yet, and were lost. Reached by Prev / Next, they now wait for the shot to be built (builtWait). */
    var flush = function (b) { var acts = pending; pending = []; b.onStart = function (a, jumping) { soundLive(); var tok = ++startTok, go = function () { actsDue = false; acts.forEach(function (f) { f(a, jumping); }); }; actsDue = false;
        if (jumping && builtWait(a, b.comp)) { actsDue = true; var n = 0, w = function () { if (tok !== startTok) return; if (!builtWait(a, b.comp) || ++n > 50) { a.sched(function () { if (tok === startTok) go(); }, 20); return; } a.sched(w, 40); }; w(); } else go(); }; };   /* (st2-20: every beat: the tale is running, so the sound plan is live — a ?scene= start in the middle of a shot too) */
    var push = function (b) { b.comp = comp; b.st2 = { scene: sc && sc.n, shot: sh && sh.id }; if (b.text == null) b.text = '';
      shotNeeds.forEach(function (q) { pending.unshift(function (a, jumping) { if (jumping) needDone(a, q.id, q.cfg); }); });   /* (first: the beat's own face and poses come after it) */   /* st2-25 · A4: a later line of a shot with a required press, reached by Prev / Next: the press's result is there */
      if (sh && shotBeats > 0 && (SHOTS[sh.id] || {}).exit) (function (X) { pending.push(function (a, jumping) { if (!jumping) return; [X.key, X.still].forEach(function (k) { var r = a.layers()[k]; if (r && r.el) { r.el.style.transition = 'none'; r.el.style.opacity = '0'; r.el.style.visibility = 'hidden'; r.el._gone = true; } }); }); })(SHOTS[sh.id].exit);   // (a Prev / Next into a later line of a shot whose figure has left by then: he is not there)
      if (sh) (function (id, k) { pending.push(function (a, jumping) { musArc(id, k, jumping); }); })(sh.id, shotBeats);   /* st2-25 · E: the music's level at this beat (MUS_ARC) */
      flush(b); beats.push(b); shotList.push(b); shotBeats++; last = b; return b; };
    var dim = function () { return sceneNar ? 'dim' : null; }, keep = function () { return sceneNar ? 'keep' : null; };   // st2-3: only a bubble that waits for Next dims the banner; an auto bubble, a thought, a hold or a cut leaves it as it is   // the banner stays up out of focus under a bubble, on the line the scene's narration got to (a scene that hasn't narrated yet has nothing to keep: it hides, as before)
    var closeShot = function () { if (!sh) return; var cfg = SHOTS[sh.id] || {};
      if (!shotBeats) push({ run: runHold(sh.id, cfg.hold || 4000), banner: keep() });                                  // a shot with no words still gets its moment
      if (pending.length && last) { var acts = pending; pending = []; var prev = last.onEnd; last.onEnd = function (a) { if (prev) prev(a); acts.forEach(function (f) { f(a); }); }; } };
    S.forEach(function (it) {
      if (credits) { if (it.t === 'act') credits.push(it.text); return; }
      if (it.t === 'shot' || it.t === 'nar' || it.t === 'act' || it.t === 'choice' || it.t === 'cut') leadBefore = false;
      if (it.t === 'scene') { closeShot(); sc = it; sh = null; sceneNar = false; }
      else if (it.t === 'shot') { closeShot(); sh = it; comp = 's2_' + it.id; shotBeats = 0; intIdx = 0; sayN = 0; joeNow = faceOf(it.id); shotNeeds = []; shotList = [];
        if ((SHOTS[it.id] || {}).narOff) sceneNar = false;   /* st2-25 · D6 (Joe): a new place or a new moment that the last narration has nothing to do with: the banner goes altogether from this shot's first beat (it is only kept, out of focus, while the same moment carries on). narOff is set on the shot (SHOTS). */
        pending.push(function () { pillOff(); taps = {}; });   // a new shot: the last one's pill goes, its presses are forgotten
        (function (id) { pending.push(function (a, jumping) { camGo(a, id, jumping); }); })(it.id);   // …and the camera goes to its framing
        var hs = HINTS[it.id]; if (hs && hs.length) (function (id, h) { pending.push(function (a, jumping) { a.sched(function () { if (a.comp() !== 's2_' + id || waiting) return; var c0 = ((SHOTS[id] || {}).ints || [])[0];
            if (c0 && c0.anchor && !signEl) { needOn(a, c0.key, h, ''); softNeed = id; a.sched(function () { if (softNeed === id) { softNeed = null; needOff(); } }, 9000); } else pill(h, 3400); }, 1300); }); })(it.id, hs[0]); }   // st2-19: anchor = the prompt sits on the thing itself (a pill over the signpost with its arrow, like the portal's), for 9 s or until it is pressed
      else if (it.t === 'nar') { if (it.text.length > NAR && window.console) console.warn('[st2] narration over ' + NAR + ' chars:', it.text); sceneNar = true; var shn = SHOTS[sh.id] || {}; if (shn.narComp) comp = 's2_' + shn.narComp;   // (a shot whose narration plays over a later state of it: the touch)
        (function (id) { pending.push(function (a) { panHome(a, id); }); })(sh.id);   // (a narrow screen: back to the shot's own framing for the narration)
        joeSet(it, it.o);
        var nb = push({ text: it.text, read: 0, linger: shn.pan ? Math.max(narHold(it.text.length), shn.pan + (shn.panHold || 0) - narDur(it.text) * narK(it.text)) : shn.linger || narHold(it.text.length), typeK: narK(it.text) });   /* st2-20: its hold by reading time, its typing never over 2.5s (a shot that is one pan: the line lasts as long as the pan and its closing hold) */ if (it.o.triggers) nb.triggers = it.o.triggers; else if (shn.narTrig) nb.triggers = shn.narTrig;
        if (shn.explore) nb.onEnd = function (a) { exploreLeave(a); }; }   // (the shot is leaving: its press areas stop answering)
      else if (it.t === 'act' && it.o && it.o.hold) { joeSet(it, it.o);   // st2-14: a beat with no words (Grik's confused pause, Joe's blank look, his small huzzah)
        if (((SHOTS[comp.slice(3)] || {}).layers || []).some(function (l) { return l.key === 'clive' && l.poseSet; })) (function (pz, fx) { pending.push(function (a) { clivePose(a, pz, fx); }); })(it.o.clive || 'side', it.o.cfx);
        if (it.o.fx && fxRun[it.o.fx]) (function (f, id) { pending.push(function (a, jumping) { f(a, id, jumping); }); })(fxRun[it.o.fx], comp.slice(3));
        push({ run: runHold(sh.id, it.o.hold), banner: keep() }); }
      else if (it.t === 'say') { var stp = (SHOTS[sh.id] || {}).steps; if (stp && stp[sayN] != null) comp = 's2_' + stp[sayN]; sayN++;   // (a shot's steps: this line starts with a change of pose)
        joeSet(it, it);
        var thoughtL = /thought/.test(it.paren || ''); it.st = it.st || (thoughtL ? (it.auto ? 3 : 4) : (it.auto ? 1 : 2)); it.auto = (it.st === 1 || it.st === 3) && !it.lead;   // the line's state (see say)
        var shS = SHOTS[comp.slice(3)] || {}, hasCs = (shS.layers || []).some(function (l) { return l.key === 'clive' && l.poseSet; });
        if (hasCs) { var pl = it.who === 'CLIVE' ? (POSE_LINES.filter(function (q) { return it.text.indexOf(q[0]) === 0; })[0] || [0, 'present']) : [0, 'side']; if (it.clive) pl = [0, it.clive]; if (pl[2]) it.poseAt = [pl[2], pl[3]];
          (function (pose, fx) { pending.push(function (a) { clivePose(a, pose, fx); }); })(pl[1], it.cfx); }
        if (it.act && !it.split) (function (act, id) { pending.push(function (a) { playAct(a, act, id); }); })(it.act, sh.id);   // a one-shot clip that goes with the line
        leadBefore = !!it.lead; push({ run: runSay(it, sh.id, comp), banner: (it.auto || it.lead || it.small || thoughtL) ? keep() : dim() }); }   // only a bubble that waits for Next dims the narration banner
      else if (it.t === 'choice') { var cb = push({ run: runChoice(it), block: true }); }
      else if (it.t === 'int') { var cfg = ((SHOTS[sh.id] || {}).ints || [])[intIdx++], hint = it.text.split(':')[0].replace(/^Optional$/, 'Fly through the wind rings').replace(/\.$/, '');
        if (cfg && cfg.need) { joeSet(it, cfg.aim ? { joe: cfg.aim } : null); if (((SHOTS[comp.slice(3)] || {}).layers || []).some(function (l) { return l.key === 'clive' && l.poseSet; })) pending.push(function (a) { poseSwap(a, 'clive', 'side'); });   // (Clive listens while a prompt waits)
          (function (id, key) { pending.push(function (a, jumping) { if (jumping) taps[id + ':' + key] = 0; });   /* st2-25 · A4: jumped back onto the press: it waits again */
            shotList.forEach(function (b0) { var po = b0.onStart; b0.onStart = function (a, jumping) { if (jumping) taps[id + ':' + key] = 0; if (po) po(a, jumping); }; }); })(sh.id, cfg.key);   /* (…or onto any earlier line of its shot: the press is still to come) */
          var nb2 = push({ run: runHold(sh.id, 0, { key: cfg.key, need: cfg.need, hint: cfg.hint || hint, cfg: cfg }), banner: keep() }); if (leadBefore) nb2.backSkip = true;   /* st2-25 · A4: Prev lands on the line that leads into a press, not on the bare press (it used to show the prompt without the line that asks for it) */ shotNeeds.push({ id: sh.id, cfg: cfg }); } }   // (an optional press only gets its hint, at the start of its shot: HINTS)
      else if (it.t === 'ach') { if (!it.o.manual && ACH_IDS[it.id]) pending.push(function (a) { a.award(it.id); }); }
      else if (it.t === 'prompt') { if (!(((SHOTS[sh.id] || {}).ints || []).some(function (c) { return c.need; })) && !(SHOTS[sh.id] || {}).explore) pending.push(function (a) { a.sched(function () { pill(it.text, 6500); }, 500); }); }   // (a shot with a required press shows its prompt on the thing itself, for as long as it waits: needOn)
      else if (it.t === 'sfx') pending.push(function (a, jumping) { playSfx(a, it.play); });
      else if (it.t === 'cut') { closeShot(); var k = cutKind(it.text); if (k === 'smash') { credits = []; push({ run: null, auto: true, credits: true }); } else push({ run: runCut(k), auto: true, banner: (k === 'vortex' || k === 'hard') ? null : keep() }); sh = null; shotBeats = 1; }
    });
    var cb2 = beats[beats.length - 1]; if (cb2 && cb2.credits) { cb2.run = runCredits(credits || []); cb2.auto = false; cb2.end = { delay: 0, run: function () { api.finish(); } }; }   // the roll, then on to My Story (Next skips the roll)
    return beats;
  }
  /* 6.1’s hills board comes in on its own trigger: it needs its comp too */
  SHOTS['6.1b'].layers = SHOTS['6.1b'].layers || [];

  window.jjStory.register(function (engine) {
    api = engine; css(); buildComps(); buildRigs(); window.addEventListener('resize', onResize);
    var beats = buildBeats();
    window.jjStory2 = { build: 'st2-26q', snd: sndState, blink: function (k) { return blinkOne(api, k); }, pick: pick, setPick: setPick, beats: beats, SHOTS: SHOTS, SETS: SETS, RIGS: RIGS, S: S, CAST: CAST };
    return { scenes: beats, comps: COMPS, rigs: RIGS, book: BOOK2, bookMusic: bookMusic, leave: function () { exploreOff(); soundOff(); }, comp: onComp, noblur: function (name) { var sh = SHOTS[String(name).slice(3)] || {}; return !!(sh.live || sh.noblur); }, fx: onFx, title: 'The Tale of Trogdor & Joe the Righteous · Storytime 2', msg1: 'The tale continues through the portal', msg2: 'Hint: the bubbles wait for you. Press Next' };
  });
})();
