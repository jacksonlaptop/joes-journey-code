# Joe's Journey — accurate page loader (`jj-loader.js`)

A **real** progress loader, not a timed spinner. It measures the actual bytes of a chosen set of
heavy assets as they download (reading each file's `Content-Length` and streaming the body), moves a
**trotting Joe** by that true percentage, and reveals the page only when those assets are downloaded
**and** decoded. Zero dependencies. Verified live: real byte progress + reveal-on-ready.

## Two looks (A/B — pick one)
- `variant:'journey'` — the whole route is on screen; Joe trots past the story landmarks
  (village → tavern → woodland → mountains → castle), which light up as he passes; the pink road
  fills behind him. Progress is *spatial* — you see how far.
- `variant:'scroll'` — Joe is centred and larger, trotting in place while the world slides past
  him; a progress bar sits underneath.

Joe is a **few-frame trot cycle** (`frames:[...]` @ `fps`). `joe-trot-1..4.png` are **placeholders** —
swap in your art on the same square-ish canvas with his feet centred at the bottom.

## Why the current one needs replacing
`site-footer.js` reveals the homepage on a hardcoded `delay: 13.0` (line ~356) — Joe flies for 13s and
the page shows whether the assets loaded in 2s or aren't ready at 13s. It's a countdown, not a measure.

## API
```js
JJLoader.start({
  variant: 'journey',                 // or 'scroll'
  assets:  ['https://.../fly-2.riv', 'https://.../hero.mp4', ...],  // what to gate on (measured by bytes)
  frames:  ['https://.../joe-trot-1.png', ...4], fps: 8,            // the trot cycle
  minTime: 900,     // ms — keep the loader up at least this long so fast loads don't snap through
  maxWait: 15000,   // ms — hard safety; never traps the user
  decode:  true,    // also wait until images are decoded/paintable, not just downloaded
  onReady: function(){ ...truly ready -> start the intro / fade the page in... },
  driver:  function(onProgress, onDone){ ... }  // OPTIONAL: feed progress yourself (AJAX transitions)
});
```

## Recipe A — Homepage (replace the 13s reveal)
Gate the reveal on real load instead of the timer; put your existing reveal in `onReady`:
```js
JJLoader.start({
  variant: 'journey',
  assets: [ 'https://.../fly-2.riv', 'https://.../waves.riv', 'https://.../hero-video.mp4' /* + big images */ ],
  frames: ['https://.../joe-trot-1.png','https://.../joe-trot-2.png','https://.../joe-trot-3.png','https://.../joe-trot-4.png'],
  minTime: 1200,
  onReady: revealPage      // your existing reveal — but delete the `delay: 13.0` so it fires now
});
```

## Recipe B — Page transitions (site-wide, full-page navigation)
Put it in the **site-wide Footer** so it runs on every page; each page's loader measures that page's
heavy assets and reveals when ready. Optional polish: fade a black cover in on internal link click
before navigating (kills any white flash) — not required, since the next page's loader covers the screen.

## Recipe C — True cross-page progress (AJAX transitions, most seamless)
With Swup/Barba, pass a `driver` that reports the page fetch's real byte progress so the bar spans the
*whole* transition (see the streaming-fetch snippet pattern in `jj-loader.js`'s `measure`).

## Honest limits
- There is **no browser API** for "the whole next page is X% loaded" — you measure a *known set* of files.
  For this site that set is exactly what matters (Rive, video, big images).
- Byte measuring needs `Content-Length` + CORS. GitHub/jsDelivr/Webflow have both. Any asset that can't be
  fetched (CORS/error) is skipped so it never blocks the reveal.
- "Downloaded" ≠ "painted": `decode:true` adds an image-decode wait so the reveal isn't a beat early.

## Files / upload
- `jj-loader.js` → repo root (same place as `storytime.js`).
- `joe-trot-1..4.png` → repo root (placeholder trot frames; replace with your Joe).
- `ab-test.html` → repo root to try both looks live at
  `https://raw.githack.com/jacksonlaptop/joes-journey-code/main/ab-test.html` (**Run A** / **Run B**,
  plus the "real assets" buttons). It's a test harness — not part of the live site.
