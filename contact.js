/* ============================================================================
   Joe's Journey — Contact page intro  (hosted via GitHub + raw.githack.com,
   same as the site's other scripts — githack refreshes without any purge step)

   IN WEBFLOW (Contact page → Page Settings → Before </body> tag) add ONLY:
     <script src="https://raw.githack.com/jacksonlaptop/joes-journey-code/main/contact.js"></script>

   TO UPDATE: edit this file → re-upload contact.js (+ any changed assets) to the
   repo. githack picks up the new commit within ~minutes — no purge needed.

   FONTS: uses the site's own Webflow brand fonts ('Joes Journey Headline 2'
   and 'Joes Journey Hieroglyphics') — no font files needed in the repo.
   The jj-headline.woff / jj-hieroglyphics.woff uploads are now unused.
   ============================================================================ */
(function () {
  /* Build marker — to confirm the browser is running the latest file, open the console and look for this
     line (or type window.JJ_CONTACT_BUILD). If it's missing/old, you're on a cached copy → bump ?v in Webflow. */
  window.JJ_CONTACT_BUILD = 'r6 · score pill fades with the nav · jjScore hooks · linkedin opens profile · name-svg-icon · duck-ambient · tut-centre+line-behind';
  try { console.log('%c[JJ] contact.js build: ' + window.JJ_CONTACT_BUILD, 'color:#FF00F5;font-weight:bold'); } catch (e) {}
  /* ---- 1. styles: uses the site's OWN Webflow brand fonts (already served) ---- */
  var CSS = `
#jj-intro{position:fixed;inset:0;overflow:hidden;z-index:50;background:#091725;}
#jj-intro-bg{position:absolute;inset:0;}
#jj-intro-bg svg{position:absolute;inset:0;width:100%;height:100%;display:block;}
#jj-stars{position:absolute;inset:0;pointer-events:none;}
.jj-deco{position:absolute;pointer-events:none;height:auto;display:block;}
@keyframes jj-flash{0%,100%{transform:scale(0.66);}50%{transform:scale(1.4);}}
@keyframes jj-glow{0%,100%{filter:drop-shadow(0 0 8px rgba(255,255,255,0.7)) drop-shadow(0 0 24px rgba(255,255,255,0.4));}50%{filter:drop-shadow(0 0 45px rgba(255,255,255,1)) drop-shadow(0 0 90px rgba(255,255,255,0.75)) drop-shadow(0 0 160px rgba(180,200,255,0.5));}}
@keyframes jj-spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
@keyframes jj-spin-reverse{from{transform:rotate(360deg);}to{transform:rotate(0deg);}}
#jj-dark{position:absolute;inset:0;background:#000;opacity:0;pointer-events:none;}
#jj-story{position:absolute;left:0;top:0;margin-left:calc(min(100vw,1600px) * -0.5);margin-top:calc(min(100vw,1600px) * -0.3);width:min(100vw,1600px);aspect-ratio:1/1;opacity:0;pointer-events:none;}
#jj-story svg{display:block;width:100%!important;height:100%!important;}
#jj-philosopher{position:absolute;left:calc(min(20vw,250px) * -0.2);bottom:calc(min(20vw,250px) * -0.1);width:min(20vw,250px);height:calc(min(20vw,250px) * 1.2);object-fit:contain;object-position:center bottom;opacity:0;pointer-events:auto;will-change:transform;}
#jj-rest-dragon{position:absolute;right:calc(min(34vw,554px) * -0.2);bottom:calc(min(34vw,554px) * -0.5);width:min(34vw,554px);opacity:0;pointer-events:auto;will-change:transform;}
/* ---- contact buttons (story scene) ---- */
#jj-contacts{position:absolute;inset:0;opacity:0;z-index:7;pointer-events:none;}
.jj-contact{position:absolute;width:min(11.5vw,158px);text-decoration:none;color:#fff;pointer-events:none;}
#jj-contacts.on .jj-contact{pointer-events:auto;cursor:pointer;}
.jj-c-icon{position:relative;width:100%;height:min(11.5vw,158px);display:flex;align-items:center;justify-content:center;transition:transform .3s ease;will-change:transform;}
.jj-c-icon img{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:contain;transition:opacity .3s ease;}
.jj-c-fill{opacity:0;}
.jj-c-glow{position:absolute;left:50%;top:50%;width:150%;height:150%;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(150,190,255,.32),rgba(150,190,255,0) 66%);opacity:0;transition:opacity .35s ease;pointer-events:none;}
.jj-c-label{position:absolute;left:50%;bottom:calc(100% + 4px);transform:translateX(-50%);white-space:nowrap;display:inline-flex;align-items:center;gap:7px;font-family:'Joes Journey Headline',sans-serif;font-size:clamp(15px,1.55vw,26px);letter-spacing:.4px;transition:transform .25s ease;}
.jj-c-detail{position:absolute;left:50%;top:calc(100% + 2px);transform:translateX(-50%);white-space:nowrap;display:inline-flex;align-items:center;gap:7px;font-family:'Joes Journey Headline',sans-serif;font-size:clamp(12px,1.05vw,18px);opacity:0;transition:opacity .3s ease, transform .25s ease;}
.jj-c-ico{flex:none;width:.92em;height:.92em;display:inline-flex;color:#fff;}
.jj-c-ico svg{width:100%;height:100%;display:block;}
.jj-c-floater{position:absolute;left:50%;top:50%;width:clamp(22px,2.3vw,36px);height:auto;margin-left:-18px;margin-top:-18px;pointer-events:none;}
.jj-contact:hover .jj-c-def{opacity:0;}
.jj-contact:hover .jj-c-fill{opacity:1;}
.jj-contact:hover .jj-c-icon{transform:scale(1.2);}
.jj-contact[data-key="credits"]:hover .jj-c-icon{transform:scale(1.42);}  /* filled credits has a thick border → needs more to read as a grow */
.jj-contact:hover .jj-c-glow{opacity:1;}
.jj-contact:hover .jj-c-detail{opacity:1;}
.jj-contact:hover .jj-c-label{transform:translateX(-50%) translateY(-12px);}                         /* clear the grown icon (box is 158 now → less travel) */
.jj-contact:hover .jj-c-detail{transform:translateX(-50%) translateY(12px);}
.jj-contact[data-key="credits"]:hover .jj-c-label{transform:translateX(-50%) translateY(-28px);}     /* credits grows more (1.42) */
.jj-contact[data-key="credits"]:hover .jj-c-detail{transform:translateX(-50%) translateY(28px);}
#jj-caption{position:absolute;left:16vw;bottom:calc(2.5vh + min(8vw,120px) * 0.77 - 7px);width:min(60vw,940px);min-height:2.7em;text-align:left;white-space:pre-line;font-family:'Joes Journey Headline',sans-serif;font-size:clamp(18px,2vw,30px);line-height:1.32;color:#fff;opacity:0;z-index:8;pointer-events:none;}
#jj-toast{position:absolute;left:48%;top:43%;transform:translate(-50%,-50%) scale(0.92);display:flex;align-items:center;gap:18px;opacity:0;pointer-events:none;z-index:40;transition:opacity .22s ease,transform .22s ease;}
#jj-toast.show{opacity:1;transform:translate(-50%,-50%) scale(1);}
.jj-toast-head,.jj-toast-box{height:clamp(48px,4.2vw,66px);box-sizing:border-box;background:#e0e0de;border:3px solid #616068;border-radius:8px;box-shadow:0 0 0 5px #fbdd65,0 0 0 9px #2e2f31,0 0 30px rgba(251,221,101,.35);}
.jj-toast-head{flex:none;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;padding:6px;}
.jj-toast-head img{max-width:100%;max-height:100%;object-fit:contain;display:block;}
.jj-toast-box{display:flex;align-items:center;padding:0 26px;font-family:'Joes Journey Headline',sans-serif;font-size:clamp(15px,1.5vw,23px);color:#2e2f31;white-space:nowrap;}
#jj-spacebar{position:absolute;left:50%;bottom:2.5vh;width:min(8vw,120px);margin-left:calc(min(8vw,120px) * -0.5);height:auto;opacity:0;z-index:8;pointer-events:auto;will-change:transform;}
#jj-wipe{position:absolute;inset:0;background:#04060d;clip-path:inset(0 0 0 var(--wp,0%));z-index:60;pointer-events:none;}
#jj-wipe-line{position:absolute;top:0;bottom:0;left:var(--wp,0%);width:2px;margin-left:-1px;background:linear-gradient(to bottom,transparent,rgba(205,228,255,.95) 50%,transparent);box-shadow:0 0 34px 9px rgba(150,190,255,.5);opacity:0;z-index:61;pointer-events:none;}
/* downward "Star Wars" wipe for the credits transition — a black panel that slides top→bottom (cover) then off the bottom (reveal), with a bright leading edge */
#jj-wipe-v{position:absolute;inset:0;background:#04060d;transform:translateY(-100%);z-index:55;pointer-events:none;will-change:transform;}
#jj-wipe-v .jj-wv-edge{position:absolute;left:0;right:0;height:3px;background:linear-gradient(to right,transparent,rgba(205,228,255,.95) 50%,transparent);box-shadow:0 0 34px 9px rgba(150,190,255,.5);opacity:0;}
#jj-wipe-v .jj-wv-edge.bottom{bottom:-1px;}
#jj-wipe-v .jj-wv-edge.top{top:-1px;}
/* credits = a wheel-driven horizontal reel revealed by the wipe (placeholder panels for now) */
#jj-credits{position:absolute;inset:0;overflow:hidden;opacity:0;z-index:48;pointer-events:none;}
#jj-credits-track{position:absolute;top:0;left:0;height:100%;display:flex;will-change:transform;}
.jj-cr-panel{width:100vw;height:100%;flex:none;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 8vw;box-sizing:border-box;}
.jj-cr-role{font-family:'Joes Journey Headline',sans-serif;font-size:clamp(13px,1.1vw,18px);letter-spacing:3px;text-transform:uppercase;color:rgba(150,190,255,.85);margin-bottom:14px;}
.jj-cr-name{font-family:'Joes Journey Headline',sans-serif;font-size:clamp(34px,6vw,92px);color:#fff;margin:0;line-height:1.05;}
.jj-cr-sub{font-family:'Joes Journey Headline',sans-serif;font-size:clamp(15px,1.6vw,24px);color:rgba(255,255,255,.55);margin-top:18px;}
#jj-caption.jj-yay{font-size:clamp(28px,3.2vw,48px);}
#jj-stage{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;}
.jj-copy{display:inline-grid;white-space:nowrap;text-align:center;}
.jj-alien,.jj-head{grid-area:1/1;margin:0;font-size:clamp(20px,4vw,54px);line-height:1.2;letter-spacing:.01em;}
.jj-alien{font-family:'Joes Journey Hieroglyphics',monospace;color:#22384b;}
.jj-head{position:relative;--r:100%;font-family:'Joes Journey Headline',sans-serif;color:#fff;-webkit-text-stroke:1px rgba(0,0,0,.35);paint-order:stroke fill;text-shadow:0 2px 10px rgba(0,0,0,.5);clip-path:inset(0 var(--r) 0 0);}
.jj-head .jj-char{display:inline-block;will-change:transform,opacity;}
#jj-dragon{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:300px;height:155px;pointer-events:none;}
#jj-dragon .jj-dragon-sprite{width:100%;height:100%;background-image:url('https://raw.githack.com/jacksonlaptop/joes-journey-code/main/dragon-sprite.png');background-repeat:no-repeat;background-size:900% 800%;}
/* hide the Webflow "Back to Contact" button (.next-section-button.back) everywhere EXCEPT inside the credits game (where setupCredits adds .jj-credits-on to <html>) */
html:not(.jj-credits-on) .next-section-button.back{opacity:0 !important;pointer-events:none !important;}`;

  var style = document.createElement('style');
  style.id = 'jj-contact-style';
  style.textContent = CSS;
  document.head.appendChild(style);

  /* Lottie player for the animated storybook (page-turn). Loaded up front so it's
     ready by the time the story scene fades in (~8s). */
  var BOOK_URL = 'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/book.json?v=3';  // ?v bumps to dodge stale CDN/browser cache when book.json content changes
  if (!window.lottie) {
    var ls = document.createElement('script');
    ls.src = 'https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie.min.js';
    document.head.appendChild(ls);
  }
  function mountBook(){
    var el = document.getElementById('jj-story');
    if (!el || el._jjBook) return;
    if (!window.lottie) { setTimeout(mountBook, 150); return; }   // wait for the player
    el._jjBook = true;
    var anim = window.lottie.loadAnimation({ container:el, renderer:'svg', loop:true, autoplay:true, path:BOOK_URL });
    anim.setSpeed(0.4);  // slow the loop down — full speed is distracting
  }

  /* Contact-page song. Goes through Howler (the site's audio lib) so the existing
     mute button controls it; ducks the site ambient when it starts. Autoplay is
     gated by the browser, so it begins on the visitor's first interaction. */
  var SONG_URL = 'https://cdn.prod.website-files.com/6a19b8f4191d4fbca532591e/6a31b05c96881e6dc6682d34_geoffreyburch-brandon-hill-glbml-109292%20-%20very%20good%20winpipe%20vibes.mp3';
  function startSong(){
    if (window._jjSong) return;
    if (window.Howl) {
      var song = new window.Howl({ src:[SONG_URL], format:['mp3'], loop:true, html5:true, volume:0 });
      window._jjSong = song;
      try { if (window.jjAudio && window.jjAudio.sounds) window.jjAudio.sounds.push(song); } catch (e) {}
      song.once('play', function () {
        try {                                                    // duck the site ambient so they don't clash
          if (window.jjAudio) {
            window.jjAudio.takeover = true;
            var amb = window.jjAudio.ambient;
            if (amb && amb.fade) amb.fade(amb.volume(), 0, 2200);
          }
        } catch (e) {}
        song.fade(0, 0.5, 2500);
      });
      song.play();                                               // Howler resumes the audio context on first gesture
    } else {
      var a = new Audio(SONG_URL); a.loop = true; a.volume = 0.5; window._jjSong = a;
      var tryPlay = function () { a.play().then(off).catch(function () {}); };
      function off(){ ['pointerdown','keydown','wheel','touchstart'].forEach(function (ev) { window.removeEventListener(ev, tryPlay, true); }); }
      tryPlay();
      ['pointerdown','keydown','wheel','touchstart'].forEach(function (ev) { window.addEventListener(ev, tryPlay, true); });
    }
  }

  /* Start loading the brand fonts immediately so the intro can wait for them
     before revealing any text (prevents the fallback-font flash / FOUT). */
  var fontsReady = (document.fonts && document.fonts.load)
    ? Promise.all([
        document.fonts.load("1em 'Joes Journey Headline 2'"),
        document.fonts.load("1em 'Joes Journey Headline'"),
        document.fonts.load("1em 'Joes Journey Hieroglyphics'")
      ]).catch(function () {})
    : Promise.resolve();

  /* ---- 2. markup: swirl bg + copy + placeholder dragon (swap for Rive) ---- */
  var HTML = `<div id="jj-intro" aria-hidden="true">
  <div id="jj-intro-bg"><svg width="1627" height="982" viewBox="0 0 1627 982" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
<g clip-path="url(#clip0_jjswirl)">
<rect width="1627" height="982" fill="#091725"/>
<mask id="mask0_jjswirl" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="1666" height="990">
<path d="M1665.93 0H0V990H1665.93V0Z" fill="white"/>
</mask>
<g mask="url(#mask0_jjswirl)">
<path d="M1665.93 0H0V990H1665.93V0Z" fill="#091725"/>
<path d="M18.5633 606.66C-2.95496 635.09 20.1714 676.648 52.0671 694.176C83.9572 711.705 122.343 715.071 155.876 729.563C197.46 747.532 228.992 781.346 267.782 804.27C324.008 837.501 395.672 846.064 458.798 827.095C489.982 817.723 519.182 802.015 551.431 796.828C607.389 787.819 662.59 811.447 716.235 829.069C801.499 857.081 893.547 870.825 982.466 856.377C1071.39 841.928 1156.84 797.098 1207.16 725.911C1217.21 711.688 1226.93 695.612 1243.55 688.99C1253.9 684.865 1265.53 685.068 1276.52 682.874C1311.47 675.889 1335.82 645.886 1352.48 615.84C1395.21 538.741 1407.87 446.973 1387.48 362.004C1384.49 349.574 1380.82 337.155 1380.48 324.406C1380.1 310.034 1384 295.905 1385.73 281.621C1395.18 203.472 1340.61 132.786 1289.02 71.2956C1252.94 28.291 1213.1 -17.139 1157.3 -31.6755C1134.45 -37.6265 1110.06 -37.9621 1087.96 -46.0965C1059.52 -56.5629 1037.81 -78.8049 1011.35 -93.2259C969.556 -116.007 918.519 -117.86 870.785 -111.7C823.052 -105.546 776.602 -92.0544 728.828 -86.1639C667.75 -78.6289 605.237 -83.6009 544.779 -72.4414C463.362 -57.4154 388.528 -12.244 339.585 51.424C325.234 70.0911 312.589 92.1351 315.348 115.109C318.374 140.332 339.551 162.233 337.804 187.566C336.832 201.657 328.82 214.274 322.122 226.88C291.505 284.492 285.824 353.655 306.66 415.084C327.496 476.519 374.605 529.49 434.85 559.245C479.055 581.074 528.79 590.435 574.985 608.151C621.885 626.136 664.719 652.574 711.162 671.593C764.86 693.582 824.371 705.424 882.187 697.185C940.003 688.946 995.742 658.872 1025.91 611.258C1033.7 598.96 1040.2 585.166 1052.46 576.79C1062.3 570.063 1074.62 567.726 1085.82 563.298C1115.48 551.561 1136.36 525.299 1149.41 497.386C1161.57 471.388 1168.19 442.683 1165.48 414.347C1162.93 387.617 1152.26 362.191 1139.93 338.046C1103.63 266.991 1047.56 200.293 969.463 173.343C891.367 146.398 789.959 172.045 754.945 243.677C743.642 266.804 742.937 299.815 766.364 312.24C773.832 316.2 782.555 317.3 791.035 318.323C818.389 321.628 845.744 324.928 873.099 328.234C881.863 329.29 891.5 330.164 898.829 325.478C907.031 320.231 909.495 309.853 915.939 302.73C931.378 285.664 963.019 294.964 976.156 313.692C1004.2 353.699 969.914 411.68 922.296 427.861C874.678 444.042 822.039 430.979 774.017 415.915C732.762 402.973 686.237 382.689 676.617 342.413C669.826 313.972 684.392 284.613 682.02 255.535C680.73 239.733 674.477 224.597 673.095 208.807C668.27 153.603 723.044 109.697 777.823 90.8261C881.25 55.2026 1001.13 73.5781 1093.6 130.234C1159.06 170.345 1213.05 230.878 1231.86 302.736C1246.61 359.056 1239.28 418.208 1231.86 475.815C1228.16 504.624 1224.21 534.181 1209.81 559.778C1200.28 576.74 1186.55 591.194 1172.57 605.098C1092.67 684.535 989.668 755.369 874.088 753.439C826.765 752.647 780.738 739.601 735.405 726.665C665.69 706.766 595.958 686.861 526.87 665.092C469.898 647.14 412.198 627.313 365.257 591.75C331.684 566.312 304.959 533.802 278.559 501.61C260.297 479.341 241.579 456.208 234.273 428.834C224.711 392.996 236.026 354.909 230.473 318.312C221.113 256.607 165.507 207.283 159.456 145.199C155.945 109.185 169.556 71.3451 156.211 37.476C141.172 -0.688538 96.7062 -20.6755 54.5891 -28.249C30.0108 -32.671 1.61478 -33.188 -16.6411 -16.9245C-28.4357 -6.41955 -33.526 9.03545 -38.1536 23.759C-70.4366 126.516 -102.917 230.108 -113.201 336.918C-123.492 443.728 -110.176 555.29 -55.4955 649.098" fill="#0E1F33"/>
<path d="M-15.6872 487.277C-28.7717 533.142 -7.92439 585.909 33.6834 612.243C70.7448 635.7 119.213 638.335 155.939 662.265C184.931 681.152 204.349 711.941 235.319 727.737C272.172 746.536 316.857 740.25 358.459 744.309C405.539 748.901 450.219 767.227 497.293 771.891C579.519 780.037 663.475 746.08 744.018 763.806C809.377 778.194 864.804 825.346 931.702 830.131C1001.58 835.13 1064.43 793.033 1120.43 752.971C1177.31 712.277 1234.73 671.093 1280.35 619.14C1325.97 567.181 1359.37 502.688 1359.74 435.011C1359.87 411.724 1356.12 388.569 1351.5 365.7C1348.27 349.695 1341.04 330.445 1324.05 328.316C1303.1 346.527 1312.88 378.707 1312.3 405.696C1311.84 426.761 1304 446.968 1296.26 466.707C1259.65 560.048 1215.99 661.297 1123.43 707.976C1095.19 722.215 1063.83 730.421 1036.28 745.832C1018.34 755.87 1002.28 768.828 983.878 778.084C944.647 797.818 896.081 798.929 855.075 782.787C822.722 770.049 795.292 747.515 762.465 735.927C693.04 711.413 613.624 739.892 542.198 721.291C513.918 713.927 488.333 699.511 463.136 685.261C431.992 667.644 400.848 650.028 369.704 632.406C340.065 615.636 310.228 598.74 284.36 577.054C239.779 539.681 208.734 489.334 188.679 436.138C178.498 409.128 169.833 379.543 146.637 361.184C134.189 351.334 118.565 345.674 106.019 335.939C64.6016 303.814 68.4078 238.82 29.2872 204.192C6.10297 183.672 -30.5996 178.37 -59.1459 191.421C-68.2218 195.568 -76.6787 201.618 -81.555 209.995C-86.038 217.695 -87.1602 226.704 -88.2014 235.449L-116.447 472.763C-118.94 493.729 -121.277 515.817 -112.467 535.182" fill="#142846"/>
<path d="M892.812 262.893C892.674 282.429 864.26 293.847 847.022 283.21C829.785 272.578 826.528 247.999 836.495 230.91C846.467 213.827 866.377 203.751 886.519 199.874C957.211 186.261 1023.51 238.335 1064.35 294.864C1093.65 335.427 1116.91 387.028 1098.1 432.87C1082.07 471.92 1040.08 495.411 1015.92 530.473C1006.12 544.691 999.299 560.767 988.066 574C967.988 597.645 936.509 609.294 906.232 619.034C871.965 630.056 833.967 639.846 800.417 626.982C777.123 618.05 759.289 599.245 736.238 589.752C713.204 580.27 687.22 580.919 662.254 578.483C558.25 568.319 460.046 490.345 449.542 391.433C448.593 382.507 448.269 373.305 444.544 365.066C437.551 349.595 420.498 341.042 406.939 330.207C377.843 306.959 363.052 268.574 369.461 232.956C375.604 198.823 398.933 170.091 421.51 142.916C442.421 117.748 463.326 92.5799 484.237 67.4119C509.602 36.8816 536.436 5.23461 573.781 -10.6659C596.057 -20.1534 620.629 -23.3544 644.82 -26.4564C683.697 -31.4449 722.575 -36.4279 761.453 -41.4164C777.065 -43.4184 798.091 -42.1589 801.805 -27.6059C805.42 -13.4269 788.316 -3.1254 774.265 2.7486C736.018 18.7316 699.368 38.1521 664.944 60.6634C631.44 82.5754 597.323 112.358 595.941 151.001C595.05 175.943 608.314 199.489 610.281 224.371C613.179 261.012 591.464 296.503 594.848 333.106C599.446 382.826 647.128 417.404 690.564 445.432C739.107 476.76 793.024 509.48 851.419 504.09C887.664 500.746 920.41 482.931 951.884 465.518C962.14 459.848 972.65 453.963 979.95 445.069C989.807 433.063 992.502 417.261 994.874 402.197C999.183 374.818 1003.39 346.234 994.232 319.961C985.069 293.687 958.056 270.807 929.289 275.092C913.064 277.512 891.551 285.839 883.864 272.039" fill="#142846"/>
<path d="M814.409 993.135C913.573 992.7 1018.95 990.577 1102.01 939.059C1127.45 923.279 1149.93 903.281 1176.44 889.195C1203.91 874.599 1234.72 866.871 1264.16 856.306C1331.7 832.062 1392.97 792.176 1441.18 741.059C1476.3 703.812 1505.43 657.816 1505.84 607.794C1506.26 556.247 1476.22 506.324 1484.26 455.345C1489.75 420.502 1512.27 390.621 1527.85 358.649C1557.26 298.265 1561.18 224.961 1529 165.869C1515.29 140.701 1494.95 116.677 1494.98 88.335C1495.03 40.5014 1551.13 11.7529 1600.39 2.06192C1647.42 -7.18359 1701.83 -7.18909 1737.02 23.8804C1778.16 60.2025 1775.62 121.137 1784.54 173.838C1797.64 251.262 1840.89 320.672 1868.37 394.613C1892.74 460.207 1904.68 529.485 1910.56 598.829C1915.8 660.517 1916.27 723.101 1903.23 783.733C1888.87 850.487 1858.59 913.033 1828.55 974.891C1812.63 1007.67 1796.29 1041.07 1770.32 1067.41C1732.84 1105.43 1679 1124.94 1625.55 1136.48C1512.98 1160.79 1395.61 1155 1281.6 1172.11C1155.31 1191.06 1027.32 1238.03 903.346 1208.31C842.701 1193.77 780.697 1150.41 780.715 1090.95" fill="#142846"/>
<circle cx="233.404" cy="230.724" r="7.8" fill="white" fill-opacity="0.6"/>
<circle cx="150.686" cy="710.874" r="6.65" fill="white" fill-opacity="0.6"/>
<circle cx="801.441" cy="464.473" r="6.65" fill="white" fill-opacity="0.6"/>
<circle cx="616.337" cy="188.375" r="4.34" fill="white" fill-opacity="0.6"/>
<circle cx="494.574" cy="227.149" r="4.05" fill="white" fill-opacity="0.6"/>
<circle cx="925.229" cy="330.824" r="7.23" fill="white" fill-opacity="0.6"/>
<circle cx="646.995" cy="451.825" r="6.65" fill="white" fill-opacity="0.6"/>
<circle cx="137.382" cy="915.473" r="6.65" fill="white" fill-opacity="0.6"/>
<circle cx="184.236" cy="888.523" r="4.34" fill="white" fill-opacity="0.6"/>
<circle cx="134.2" cy="839.849" r="3.47" fill="white" fill-opacity="0.6"/>
<circle cx="562.252" cy="930.599" r="7.52" fill="white" fill-opacity="0.6"/>
<circle cx="1164.42" cy="553.3" r="6.36" fill="white" fill-opacity="0.6"/>
<circle cx="1162.68" cy="290.949" r="4.63" fill="white" fill-opacity="0.6"/>
<circle cx="1401.58" cy="94.5992" r="4.63" fill="white" fill-opacity="0.6"/>
<circle cx="1339.69" cy="753.498" r="6.94" fill="white" fill-opacity="0.6"/>
<circle cx="1388.57" cy="693.824" r="4.34" fill="white" fill-opacity="0.6"/>
<circle cx="1415.75" cy="542.024" r="2.6" fill="white" fill-opacity="0.6"/>
<circle cx="1317.13" cy="403.699" r="4.63" fill="white" fill-opacity="0.6"/>
<circle cx="1336.22" cy="377.3" r="3.47" fill="white" fill-opacity="0.6"/>
<circle cx="1230.65" cy="137.774" r="2.6" fill="white" fill-opacity="0.6"/>
<circle cx="1263.04" cy="103.675" r="4.92" fill="white" fill-opacity="0.6"/>
<circle cx="1077.36" cy="25.0238" r="2.6" fill="white" fill-opacity="0.6"/>
<circle cx="783.22" cy="890.45" r="2.31" fill="white" fill-opacity="0.6"/>
<circle cx="835.28" cy="882.2" r="2.31" fill="white" fill-opacity="0.6"/>
<circle cx="1009.68" cy="683.923" r="6.07" fill="white" fill-opacity="0.6"/>
<circle cx="1043.23" cy="661.373" r="5.49" fill="white" fill-opacity="0.6"/>
<circle cx="204.771" cy="73.1484" r="5.78" fill="white" fill-opacity="0.6"/>
<circle cx="237.164" cy="48.3988" r="4.05" fill="white" fill-opacity="0.6"/>
<circle cx="100.65" cy="152.35" r="2.89" fill="white" fill-opacity="0.6"/>
<circle cx="328.848" cy="915.473" r="6.65" fill="white" fill-opacity="0.6"/>
<circle cx="363.266" cy="875.599" r="4.63" fill="white" fill-opacity="0.6"/>
<circle cx="508.457" cy="630.848" r="9.83" fill="white" fill-opacity="0.6"/>
<circle cx="804.911" cy="610.224" r="3.18" fill="white" fill-opacity="0.6"/>
</g>
<g filter="url(#filter1_jjswirl)">
<ellipse cx="1640.71" cy="59.9826" rx="509.076" ry="324.623" fill="#FF00F5" fill-opacity="0.2"/>
</g>
<g filter="url(#filter2_jjswirl)">
<ellipse cx="360.596" cy="1142.73" rx="509.076" ry="324.623" fill="#3ED1FF" fill-opacity="0.3"/>
</g>
</g>
<defs>
<filter id="filter1_jjswirl" x="631.634" y="-764.641" width="2018.15" height="1649.25" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="250" result="effect1_foregroundBlur"/>
</filter>
<filter id="filter2_jjswirl" x="-648.48" y="318.109" width="2018.15" height="1649.25" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="250" result="effect1_foregroundBlur"/>
</filter>
<clipPath id="clip0_jjswirl">
<rect width="1627" height="982" fill="white"/>
</clipPath>
</defs>
</svg></div>
  <div id="jj-dark"></div>
  <div id="jj-stars"></div>
  <div id="jj-story"></div>
  <img id="jj-philosopher" src="https://raw.githack.com/jacksonlaptop/joes-journey-code/main/philosopher.png" alt="" data-cursor="hover">
  <img id="jj-rest-dragon" src="https://raw.githack.com/jacksonlaptop/joes-journey-code/main/dragon-rest.png" alt="" data-cursor="hover">
  <div id="jj-contacts"></div>
  <div id="jj-caption"></div>
  <img id="jj-spacebar" src="https://cdn.prod.website-files.com/6a19b8f4191d4fbca532591e/6a32c43b02d23ed8f42fb5a6_Space%20bar.svg" alt="Press Space" data-cursor="hover">
  <div id="jj-toast"><span class="jj-toast-head"><img src="https://cdn.prod.website-files.com/6a19b8f4191d4fbca532591e/6a33bebf658e3eb02d1952fa_Dragon%20head%20-%20normal.svg" alt="" aria-hidden="true"></span><span class="jj-toast-box"><span class="jj-toast-text"></span></span></div>
  <div id="jj-stage"><div class="jj-copy">
    <p class="jj-alien">How would you like to get in touch</p>
    <p class="jj-head"><span class="jj-inner">How would you like to get in touch</span></p>
  </div></div>
  <div id="jj-dragon"><div class="jj-dragon-sprite"></div></div>
  <div id="jj-credits"><div id="jj-credits-track"></div></div>
  <div id="jj-wipe"></div><div id="jj-wipe-line"></div>
  <div id="jj-wipe-v"><span class="jj-wv-edge bottom"></span><span class="jj-wv-edge top"></span></div>
</div>`;

  /* ---- 3. choreography ---- */
  function vw(f){ return window.innerWidth * f; }
  function ready(){ return window.gsap && window.SplitType; }
  function whenReady(cb){
    if (ready()) return cb();
    var n = 0, t = setInterval(function () {
      if (ready()) { clearInterval(t); cb(); }
      else if (++n > 15) { clearInterval(t); injectLibs(cb); }
    }, 100);
  }
  function injectLibs(cb){
    var libs = [['gsap','https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js'],
                ['SplitType','https://unpkg.com/split-type']];
    var left = 0;
    libs.forEach(function (p) {
      if (!window[p[0]]) { left++; var s = document.createElement('script'); s.src = p[1];
        s.onload = s.onerror = function () { if (--left <= 0) cb(); }; document.head.appendChild(s); }
    });
    if (!left) cb();
  }
  function lockScroll(){
    var prevent = function (e) { e.preventDefault(); };
    var keys = {32:1,33:1,34:1,35:1,36:1,37:1,38:1,39:1,40:1};
    var onKey = function (e) { if (keys[e.keyCode]) e.preventDefault(); };
    window.addEventListener('wheel', prevent, { passive:false });
    window.addEventListener('touchmove', prevent, { passive:false });
    window.addEventListener('keydown', onKey, false);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    try { if (window.lenis && window.lenis.stop) window.lenis.stop(); } catch (e) {}
    window.jjIntro = window.jjIntro || {};
    window.jjIntro.unlock = function () {
      window.removeEventListener('wheel', prevent, { passive:false });
      window.removeEventListener('touchmove', prevent, { passive:false });
      window.removeEventListener('keydown', onKey, false);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      try { if (window.lenis && window.lenis.start) window.lenis.start(); } catch (e) {}
    };
  }
  // Positional float-out: left letters drift LEFT, middle go UP/DOWN, right drift RIGHT.
  // Left→right stagger, slow drift, some grow/shrink, ~20% alien font, ~20% hot pink.
  function floatOut(headEl){
    var chars = headEl._jjChars || [];
    var bobs = headEl._jjBobs || [];
    if (!chars.length) { bobs.forEach(function (b) { b.kill(); }); gsap.to('.jj-copy', { opacity:0, duration:1.8, ease:'power1.out' }); return; }
    headEl.style.clipPath = 'none';
    // Letters stay in flow (their widths are fixed, so the font swap can't reflow). We just
    // animate each one's transform FROM wherever it's currently floating — no snap/jump.
    var hostRect = headEl.getBoundingClientRect();
    var leftEdge = hostRect.left, width = hostRect.width || 1;
    chars.forEach(function (c) {
      var r = c.getBoundingClientRect();
      var rel = ((r.left + r.width / 2) - leftEdge) / width;   // 0 = far left, 1 = far right
      var dx, dy;
      // primary bias (left→left, right→right, middle→up/down) + a big cross-axis component = diagonal & varied
      if (rel < 0.34)       { dx = -(550 + Math.random() * 850); dy = (Math.random() - 0.5) * 900; }  // LEFT-ish, diagonal
      else if (rel > 0.66)  { dx =  (550 + Math.random() * 850); dy = (Math.random() - 0.5) * 900; }  // RIGHT-ish, diagonal
      else                  { dx = (Math.random() - 0.5) * 650; dy = (Math.random() < 0.5 ? -1 : 1) * (450 + Math.random() * 600); } // MIDDLE, up/down + spread
      var goAlien = Math.random() < 0.5, goPink = Math.random() < 0.2;  // ~50% alien, ~20% hot pink
      var grow = Math.random() < 0.5;
      var dur = 6 + Math.random() * 3;               // SLOW drift (6–9s)
      var del = rel * 1.5 + Math.random() * 0.15;    // LEFT → RIGHT, not all at once
      gsap.to(c, {
        x: dx, y: dy, rotation: gsap.utils.random(-110, 110),
        scale: grow ? gsap.utils.random(1.6, 2.8) : gsap.utils.random(0.15, 0.5),
        duration: dur, ease: 'sine.inOut', delay: del,   // very slow start, gentle throughout — no fast fly-off
        overwrite: 'auto',   // takes over from this letter's float exactly when it starts — keeps bobbing until then
        onStart: function () { if (goAlien) c.style.fontFamily = "'Joes Journey Hieroglyphics', monospace"; if (goPink) c.style.color = '#FF00F5'; }
      });
      gsap.to(c, { opacity: 0, duration: dur * 0.5, delay: del + dur * 0.45, ease: 'power1.in' });  // fade out toward the edge instead of flying off
    });
  }

  // Choose 7 of the headline letters that will later respell "Contact" (they still disperse first).
  function pickContact(headEl){
    var all = (headEl._jjChars || []).filter(function (c) { return (c.textContent || '').trim().length; });
    if (all.length < 7) return null;
    var picks = [];
    for (var i = 0; i < 7; i++) {
      var idx = Math.round(i * (all.length - 1) / 6);
      while (picks.indexOf(all[idx]) !== -1 && idx < all.length - 1) idx++;
      picks.push(all[idx]);
    }
    headEl._jjContact = picks;
    return picks;
  }

  // Reverse-float the 7 picked letters from wherever they've drifted back to centre-screen,
  // respelling "Contact" with NORMAL kerned spacing, then leave them gently bobbing.
  function reformContact(headEl){
    var picks = headEl._jjContact; if (!picks) return;
    var word = 'Contact', W = window.innerWidth, H = window.innerHeight, cy = H / 2;
    // measure the word's real cumulative widths in the headline font → natural letter spacing
    var cs = getComputedStyle(picks[0]);
    var meas = document.createElement('span');
    meas.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;left:-9999px;top:0;letter-spacing:normal;';
    meas.style.fontFamily = "'Joes Journey Headline', sans-serif";
    meas.style.fontSize = cs.fontSize; meas.style.fontWeight = cs.fontWeight;
    document.body.appendChild(meas);
    var prefix = [0];
    for (var k = 1; k <= word.length; k++) { meas.textContent = word.slice(0, k); prefix.push(meas.getBoundingClientRect().width); }
    document.body.removeChild(meas);
    var startX = W / 2 - prefix[word.length] / 2;
    picks.forEach(function (c, i) {
      c.textContent = word[i];
      c.style.fontFamily = "'Joes Journey Headline', sans-serif";
      c.style.color = '#fff';
      var targetCx = startX + (prefix[i] + prefix[i + 1]) / 2;   // each glyph centre at its natural spot
      var r = c.getBoundingClientRect();
      var curX = gsap.getProperty(c, 'x'), curY = gsap.getProperty(c, 'y');
      gsap.to(c, {
        x: curX + (targetCx - (r.left + r.width / 2)),
        y: curY + (cy - (r.top + r.height / 2)),
        scale: 1, rotation: 0, opacity: 1,
        duration: 1.6, ease: 'power3.inOut', overwrite: true,
        onComplete: (function (ch) { return function () {
          gsap.to(ch, { y: '-=9', duration: 1.1 + Math.random() * 0.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });   // keep floating like the original
        }; })(c)
      });
    });
  }

  /* As "Contact" fades out: switch to the alien font (2 letters pink), keep it floating, and
     let the float ramp up (accelerate) just before the letters vanish. */
  function alienizeContact(headEl){
    var picks = headEl._jjContact || []; if (!picks.length) return;
    picks.forEach(function (c, i) {
      c.style.fontFamily = "'Joes Journey Hieroglyphics', monospace";       // alien as it fades
      if (i === 1 || i === 5) c.style.color = '#FF00F5';                     // 2 stay pink
      gsap.to(c, { opacity: 0, duration: 2.0, ease: 'power2.in' });                                          // fade out (the gentle bob keeps going underneath)
      gsap.to(c, { y: '-=' + (52 + Math.random() * 34), rotation: gsap.utils.random(-16, 16),               // float ramps up — accelerates away just before vanishing
        duration: 1.4, delay: 0.6, ease: 'power3.in', overwrite: 'auto' });
    });
  }

  /* ---- contact buttons: 5 space icons, default→filled on hover + glow; click copies / downloads / views ---- */
  var IC = 'https://cdn.prod.website-files.com/6a19b8f4191d4fbca532591e/';
  var ICO = {
    copy:     '<svg class="jj-c-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    download: '<svg class="jj-c-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    arrow:    '<svg class="jj-c-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>'
  };
  // home positions sit on a shared ellipse (even 72° apart) so the slow orbit never overlaps.
  // ORBIT center/radii (percent of viewport) — keep in sync with startContactOrbit.
  var ORB = { cx:48, cy:43, rx:33, ry:26 };
  var ANG = { linkedin:270, credits:342, cv:54, mail:126, phone:198 };   // degrees, evenly spaced
  function ellipsePos(deg){ var r = deg * Math.PI / 180; return { x: ORB.cx + ORB.rx * Math.cos(r), y: ORB.cy + ORB.ry * Math.sin(r) }; }
  var ICN = 'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/';            // cropped contact icons (no padding, art to the edge)
  var CONTACTS = [
    { key:'phone',    label:'Phone',    dgap:0,   def:ICN+'icon-phone.png',    fill:ICN+'icon-phone-fill.png',    detail:'+44 7565 040886',                       act:'copy', copy:'+447565040886' },
    { key:'linkedin', label:'LinkedIn', dgap:0,   def:ICN+'icon-linkedin.png', fill:ICN+'icon-linkedin-fill.png', detail:'www.linkedin.com/in/joseph-jackson-ui/', act:'open', href:'https://www.linkedin.com/in/joseph-jackson-ui/' },
    { key:'credits',  label:'Credits',  dgap:0,   def:ICN+'icon-credits.png',  fill:ICN+'icon-credits-fill.png',  detail:'View',                                  act:'view',     href:'#credits' },
    { key:'mail',     label:'Mail',     dgap:0,   def:ICN+'icon-mail.png',     fill:ICN+'icon-mail-fill.png',     detail:'jackson.laptop95@gmail.com',            act:'copy', copy:'jackson.laptop95@gmail.com' },
    { key:'cv',       label:'CV',       dgap:0,   def:ICN+'icon-cv.png',       fill:ICN+'icon-cv-fill.png',       detail:'Download',                              act:'download', href:'#cv' }
  ];
  var SPACE = [
    IC+'6a32a12291178c585287628f_small%20space%201.svg',
    IC+'6a32a122e443340225816231_spall%20space%203.svg',
    IC+'6a32a12291178c5852876288_small%20space%204.svg',
    IC+'6a32a1229ef4aa4ea90a7922_small%20space%205.svg'
  ];
  function copyToClipboard(text){
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).catch(function(){ legacyCopy(text); });
    legacyCopy(text); return Promise.resolve();
  }
  function legacyCopy(text){
    var ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;left:-9999px;top:0;';
    document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} document.body.removeChild(ta);
  }
  function showToast(text){
    var t = document.getElementById('jj-toast'); if (!t) return;
    t.querySelector('.jj-toast-text').textContent = text;
    t.classList.add('show');
    clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove('show'); }, 2100);
  }
  var LBL_GAP = 18;                                                                      // desired visible gap (px) between the art edge and the title/value
  function placeLabels(a){                                                              // object-fit:contain leaves transparent margin on non-square art — offset the text past it so every orb reads the same
    var icon = a.querySelector('.jj-c-icon'), img = a.querySelector('.jj-c-def');
    var bw = icon.clientWidth, bh = icon.clientHeight, nw = img.naturalWidth, nh = img.naturalHeight;
    if (!nw || !nh || !bw || !bh) return;
    var ws = Math.max(0, (bh - nh * Math.min(bw / nw, bh / nh)) / 2);                    // transparent top/bottom margin of the art inside the box
    var g = LBL_GAP + (+a.getAttribute('data-dgap') || 0);
    a.querySelector('.jj-c-label').style.bottom = 'calc(100% + ' + (g - ws) + 'px)';
    a.querySelector('.jj-c-detail').style.top   = 'calc(100% + ' + (g - 2 - ws) + 'px)';
  }
  window.addEventListener('resize', function () {                                        // box size is vw-based — re-seat the labels when it changes
    document.querySelectorAll('#jj-contacts .jj-contact').forEach(placeLabels);
  });
  function buildContacts(){
    var wrap = document.getElementById('jj-contacts'); if (!wrap || wrap.children.length) return;
    CONTACTS.forEach(function (c) {
      var a = document.createElement('a');
      a.className = 'jj-contact'; a.href = c.href || '#'; a.setAttribute('data-key', c.key);
      var p = ellipsePos(ANG[c.key]); a.style.left = p.x + '%'; a.style.top = p.y + '%';
      var labelIco = c.act === 'copy' ? ICO.copy : '';
      var detailIco = c.act === 'download' ? ICO.download : ((c.act === 'view' || c.act === 'open') ? ICO.arrow : '');
      a.innerHTML =
        '<span class="jj-c-label">' + c.label + labelIco + '</span>' +
        '<span class="jj-c-icon"><span class="jj-c-glow"></span>' +
          '<img class="jj-c-def"  src="' + c.def  + '" alt="' + c.label + '">' +
          '<img class="jj-c-fill" src="' + c.fill + '" alt="" aria-hidden="true">' +
        '</span>' +
        '<span class="jj-c-detail">' + c.detail + detailIco + '</span>';
      a.setAttribute('data-dgap', c.dgap || 0);
      placeLabels(a);                                                                    // sit title/value a fixed gap off the visible art (auto-handles each icon's aspect)
      var di = a.querySelector('.jj-c-def');
      if (!di.complete || !di.naturalWidth) di.addEventListener('load', function () { placeLabels(a); });
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var sc = window.jjScore;
        if (c.act === 'copy') {
          copyToClipboard(c.copy).then(function () { showToast(c.copy + '  copied to clipboard!'); });
          if (sc) sc.award('contact');                                                      // +10 coins — got in touch
        }
        else if (c.act === 'open') { window.open(c.href, '_blank', 'noopener'); if (sc) sc.award('linkedin'); }   // LinkedIn opens the profile: +1 star
        else if (c.act === 'view') { launchCredits(); if (sc) sc.award('credits-click'); }  // Credits = same as pressing Space: +10 coins
        else if (c.act === 'download') { if (sc) sc.award('cv'); }                          // CV: +10 coins (file URL still to come)
      });
      a.addEventListener('mouseenter', function () { pauseContacts(); spawnFloaters(a); });
      a.addEventListener('mouseleave', function () { resumeContacts(); clearFloaters(a); });
      if (window.gsap) gsap.set(a, { xPercent:-50, yPercent:-50 });   // centre on its point (float/orbit add transforms on top)
      wrap.appendChild(a);
    });
  }
  /* small space assets circle the HOVERED button only — appear on hover, fade out on leave */
  function spawnFloaters(btn){
    if (!window.gsap || btn._floaters) return;
    var arr = [], tws = [], n = 6;
    for (var i = 0; i < n; i++) {
      var im = document.createElement('img');
      im.className = 'jj-c-floater'; im.src = SPACE[i % SPACE.length]; im.alt = '';
      btn.appendChild(im);
      var st = { a: (i / n) * Math.PI * 2 }, rad = 96 + (i % 2) * 26, dir = (i % 2) ? 1 : -1;
      gsap.set(im, { opacity: 0, scale: 0.55 + Math.random() * 0.35 });
      gsap.to(im, { opacity: 0.95, duration: 0.4, ease: 'power1.out' });
      tws.push(gsap.to(st, { a: st.a + Math.PI * 2 * dir, duration: 6 + Math.random() * 3, repeat: -1, ease: 'none',
        onUpdate: (function (el, s, r) { return function () { gsap.set(el, { x: Math.cos(s.a) * r, y: Math.sin(s.a) * r }); }; })(im, st, rad) }));
      arr.push(im);
    }
    btn._floaters = arr; btn._floaterTweens = tws;
  }
  function clearFloaters(btn){
    if (!btn._floaters) return;
    (btn._floaterTweens || []).forEach(function (t) { t.kill(); });
    btn._floaters.forEach(function (im) {
      gsap.killTweensOf(im);
      gsap.to(im, { opacity: 0, scale: 0.4, duration: 0.3, ease: 'power1.in', onComplete: function () { if (im.parentNode) im.parentNode.removeChild(im); } });
    });
    btn._floaters = null; btn._floaterTweens = null;
  }
  /* gentle bob + a verrry slow EVEN orbit around a shared ellipse → they never overlap */
  var contactOrbitOn = false, contactMotion = [];
  function startContactOrbit(){
    if (contactOrbitOn || !window.gsap) return;
    var btns = document.querySelectorAll('#jj-contacts .jj-contact'); if (!btns.length) return;
    contactOrbitOn = true;
    var PERIOD = 90;   // seconds for a full lap — very slow
    btns.forEach(function (btn) {
      var a0 = (ANG[btn.getAttribute('data-key')] || 0) * Math.PI / 180;
      var st = { a: a0 };
      contactMotion.push(gsap.to(btn, { y: '-=8', duration: 2.6 + Math.random() * 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: Math.random() * 1.5 }));   // slight float
      contactMotion.push(gsap.to(st, { a: a0 - Math.PI * 2, duration: PERIOD, repeat: -1, ease: 'none',                                                              // ccw: linkedin→left, phone→down...
        onUpdate: function () { btn.style.left = (ORB.cx + ORB.rx * Math.cos(st.a)) + '%'; btn.style.top = (ORB.cy + ORB.ry * Math.sin(st.a)) + '%'; } }));
    });
  }
  /* freeze every button's drift while one is hovered, so the user isn't chasing a moving target */
  function pauseContacts(){ contactMotion.forEach(function (t) { t.pause(); }); }
  function resumeContacts(){ contactMotion.forEach(function (t) { t.resume(); }); }

  /* ---- wizard captions: rapid typed lines bottom-centre; he reacts sad → happy ---- */
  var WIZ = {
    normal: 'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/philosopher.png',
    sad:    IC + '6a326b676232e8946bfa7893_Wizard%20-%20sad.svg',
    happy:  IC + '6a326b682510ef80bdc333ec_Wizard%20-%20very%20happy.svg',
    surprised: IC + '6a200195245a88910104f066_Sprite%20philios.svg'
  };
  var wizState = 'normal';                                                   // the scripted resting expression
  function applyWizard(face){                                               // fade quickly out → swap → fade in, so he never appears to "move"
    var el = document.getElementById('jj-philosopher'); var url = WIZ[face]; if (!el || !url || !window.gsap) return;
    if (el.getAttribute('src') === url) return;
    gsap.to(el, { opacity:0, duration:0.13, ease:'power1.in', onComplete:function () {
      el.src = url; gsap.to(el, { opacity:1, duration:0.18, ease:'power1.out' });
    } });
  }
  function setWizard(face){ wizState = face; applyWizard(face); }            // scripted (captions) — also sets the resting state
  /* wizard is interactive: hover → happy, click → sad + shuffle down-left ~2s then back to resting */
  function setupWizard(){
    var w = document.getElementById('jj-philosopher'); if (!w || !window.gsap || w._wired) return;
    w._wired = true;
    var busy = false, hovering = false;
    w.addEventListener('mouseenter', function () { if (creditsRunning) return; hovering = true; if (!busy) applyWizard('happy'); });
    w.addEventListener('mouseleave', function () { if (creditsRunning) return; hovering = false; if (!busy) applyWizard(wizState); });
    w.addEventListener('click', function () {
      if (creditsRunning || busy) return; busy = true;
      gsap.killTweensOf(w); applyWizard('sad');                                          // kill leftover motion FIRST, then start the sad fade-swap (else killTweensOf cancels it)
      gsap.to(w, { x: -w.offsetWidth * 0.16, y: w.offsetHeight * 0.14, duration: 0.6, ease: 'power2.out', onComplete: function () {   // slightly left + down
        setTimeout(function () {
          gsap.to(w, { x: 0, y: 0, duration: 0.7, ease: 'power2.inOut', onComplete: function () {
            busy = false; applyWizard(hovering ? 'happy' : wizState);
          } });
        }, 2000);   // hold ~2 seconds
      } });
    });
  }
  function typeCaption(el, text, append, done){
    var base = append ? (el._txt || '') : '';
    if (!append) el._txt = '';
    var i = 0;
    clearInterval(el._tw);
    el._tw = setInterval(function () {
      i++; el._txt = base + text.slice(0, i); el.textContent = el._txt;
      if (i >= text.length) { clearInterval(el._tw); if (done) done(); }
    }, 45);   // typing speed (ms per character)
  }
  function runCaptions(){
    var cap = document.getElementById('jj-caption'); if (!cap || !window.gsap) return;
    gsap.to(cap, { opacity: 1, duration: 0.4 });
    typeCaption(cap, 'Want to talk? Have some feedback?', false, function () {
      setTimeout(function () {
        setWizard('sad');
        typeCaption(cap, '\nMaybe you want to send me some hate mail?', true, function () {
          setTimeout(function () {                                     // longer beat so the hate-mail line can be read
            setWizard('happy');
            // scene 3 types in chunks with pauses
            typeCaption(cap, 'Fancy playing a quick game, it’s my favourite?', false, function () {
              setTimeout(function () {
                showSpacebar();
                typeCaption(cap, ' Just press ‘Space’ to begin…', true, function () {
                  setTimeout(function () {
                    typeCaption(cap, ' Oh I see what he’s done there… Space… Ha!', true, function () {});
                  }, 1300);                                            // pause before "Oh I see..."
                });
              }, 1300);                                                // pause after "favourite?"
            });
          }, 4000);
        });
      }, 1400);
    });
  }

  /* Credits "View", the Spacebar key and the spacebar icon all launch the credits experience. */
  var creditsArmed = false, creditsRunning = false, creditsCleanup = null, wfBack = null;
  var wantCredits = /[?&]credits=1\b/.test(location.search) || location.hash === '#credits';   // Credits menu item lands here with ?credits=1 → auto-play
  function onContactPage(){ return /(^|\/)contact\/?$/.test(location.pathname); }
  function wireMenuLinks(){                                                  // make the main-menu items work: Contact → /contact, Credits → the credits sequence
    try {
      var links = document.querySelectorAll('a');
      for (var i = 0; i < links.length; i++) {
        var a = links[i]; if (a._jjMenuWired) continue;
        var t = (a.textContent || '').trim().toLowerCase();
        if (t === 'credits') { a._jjMenuWired = 1; a.setAttribute('href', '/contact?credits=1');
          a.addEventListener('click', function (e) {
            if (onContactPage() && creditsArmed && !creditsRunning) { e.preventDefault(); launchCredits(); }   // already here → start in place
          });
        } else if (t === 'contact' && !a.getAttribute('href')) { a._jjMenuWired = 1; a.setAttribute('href', '/contact'); }
      }
    } catch (e) {}
  }
  function findWfBack(){                                                     // locate your Webflow "Back to Contact" button by its text
    if (wfBack && document.body.contains(wfBack)) return wfBack;
    try {
      var cands = document.querySelectorAll('a, button, .w-button, .w-inline-block, [role="button"], div, span');
      for (var i = 0; i < cands.length; i++) {
        var el = cands[i]; if (el.id === 'jj-back') continue;               // never my own fallback
        var t = (el.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
        if (t.indexOf('back to contact') !== -1 && t.length <= 30) { wfBack = el.closest('a, button, .w-inline-block, [role="button"]') || el; return wfBack; }
      }
    } catch (e) {}
    return null;
  }
  function hideWfBack(){ if (creditsRunning) return;                                            // once credits start, setupCredits owns this button — don't let the load-time retries re-hide it
    var b = findWfBack(); if (b) { b.style.setProperty('opacity', '0', 'important'); b.style.setProperty('pointer-events', 'none', 'important'); b.style.transition = 'opacity .6s ease'; } }
  // ---- music: fade the contact song out over 5s, then roll the two 8-bit tracks ----
  var GM1 = 'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/game-music-1.mp3';   // 8-bit Console From My Childhood
  var GM2 = 'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/game-music-2.mp3';   // The World of 8-bit Games
  function fadeOutSong(ms){
    var s = window._jjSong; if (!s) return;
    if (s.fade && s.volume) { try { s.fade(s.volume(), 0, ms); } catch (e) {} setTimeout(function () { try { s.stop(); } catch (e) {} }, ms + 80); }
    else if (s.volume !== undefined) { var v0 = s.volume, t0 = performance.now(); var iv = setInterval(function () { var p = Math.min(1, (performance.now() - t0) / ms); try { s.volume = v0 * (1 - p); } catch (e) {} if (p >= 1) { clearInterval(iv); try { s.pause(); } catch (e) {} } }, 60); }
  }
  var GAME_VOL = 0.15;                                                                           // game music kept well under the rest of the mix — the 8-bit tracks are loud, so this sits ~30% of the contact song (0.5)
  var gameMusic = null, gameMusicMuted = false, gameMusicIdx = 0;
  function applyGameVol(){ if (!gameMusic) return; var v = gameMusicMuted ? 0 : GAME_VOL;
    try { if (typeof gameMusic.volume === 'function') gameMusic.volume(v); else gameMusic.volume = v; } catch (e) {} }
  function setGameMute(m){ gameMusicMuted = m; applyGameVol(); }                                // Space (pause) also mutes; resume restores
  function playTrack(url, onEnd){
    var v = gameMusicMuted ? 0 : GAME_VOL;
    if (window.Howl) { var h = new window.Howl({ src:[url], format:['mp3'], html5:true, loop:false, volume:v }); try { if (window.jjAudio && window.jjAudio.sounds) window.jjAudio.sounds.push(h); } catch (e) {} if (onEnd) h.once('end', onEnd); h.play(); try { h.volume(v); h.once('play', function(){ try { h.volume(v); } catch(e){} }); } catch (e) {} return h; }   // re-assert volume (html5 Howls sometimes ignore the constructor volume until playing)
    var a = new Audio(url); a.volume = v; if (onEnd) a.addEventListener('ended', onEnd); a.play().catch(function () {}); return a;
  }
  function nextGameTrack(){                                                                      // GM1 → GM2 → GM1 … endless loop of the pair
    if (gameMusic) { try { if (gameMusic.stop) gameMusic.stop(); else if (gameMusic.pause) gameMusic.pause(); } catch (e) {} }
    var tracks = [GM1, GM2], url = tracks[gameMusicIdx % tracks.length]; gameMusicIdx++;
    gameMusic = playTrack(url, nextGameTrack);                                                   // when a track ends, roll into the next
  }
  function startCreditsMusic(immediate){
    try { if (window.jjAudio) { window.jjAudio.takeover = true; var amb = window.jjAudio.ambient;   // DUCK THE SITE AMBIENT (0.6, loops site-wide). On ?credits=1 the contact song never ran to duck it, so it played full-volume — THIS is the "loud music" that ignored GAME_VOL.
      if (amb && typeof amb.fade === 'function') amb.fade(amb.volume(), 0, 1500); } } catch (e) {}
    fadeOutSong(immediate ? 1200 : 5000);                                                        // fade the contact song (no-op if it never started)
    setTimeout(nextGameTrack, immediate ? 700 : 7000);                                           // normal: wait for the 5s fade; direct (?credits=1): start almost right away
  }
  function launchCredits(){
    if (creditsRunning || !window.gsap) return;
    creditsRunning = true; creditsArmed = false;
    startCreditsMusic();
    runCreditsSequence();
  }
  /* Deep-link entry (?credits=1): there's no contact scene to transition out of, so skip the opening
     choreography entirely and drop straight into the credits/game with a quick fade. */
  function runCreditsDirect(){
    if (creditsRunning || !window.gsap) return;
    creditsRunning = true; creditsArmed = false;
    gsap.set('#jj-intro', { '--wp':'100%' });                                  // open the opening Star-Wars wipe panel (else it covers the screen black)
    gsap.set('#jj-intro-bg', { opacity:1, scale:1 });                          // show the space backdrop
    gsap.set(['#jj-stars','#jj-wipe','#jj-wipe-line'], { opacity:0 });
    startCreditsMusic(true);                                                   // game music right away (no contact song to fade out)
    setupCredits();
    gsap.fromTo('#jj-credits', { opacity:0 }, { opacity:1, duration:0.6, ease:'power1.out' });
  }
  function runCreditsSequence(){
    var dragon = document.getElementById('jj-rest-dragon'), wiz = document.getElementById('jj-philosopher');
    var cap = document.getElementById('jj-caption'), sb = document.getElementById('jj-spacebar');
    var H = window.innerHeight;
    // stop everything still moving in the contact scene
    if (cap) clearInterval(cap._tw);
    if (sb) { gsap.killTweensOf(sb); gsap.to(sb, { opacity:0, scale:0.5, duration:0.4, ease:'power2.in' }); }
    contactMotion.forEach(function (t) { t.kill(); });
    var cw = document.getElementById('jj-contacts'); if (cw) cw.classList.remove('on');
    if (dragon) gsap.killTweensOf(dragon);
    if (wiz) gsap.killTweensOf(wiz);
    // reactions: wizard → surprised, dragon → super happy
    applyWizard('surprised');
    if (dragon) dragon.src = DR.happy;
    // orbs spin slowly + shrink + fade out where they are (no jump, no fly-out)
    document.querySelectorAll('#jj-contacts .jj-contact').forEach(function (a, i) {
      var dir = i % 2 ? 1 : -1;
      gsap.killTweensOf(a);
      gsap.to(a, { scale:0, rotation:dir * 150, opacity:0, duration:1.9, ease:'power1.inOut', delay:i * 0.05 });
    });
    var tl = gsap.timeline();
    if (cap) gsap.to(cap, { opacity:0, duration:0.3 });                                  // clear the lingering "press Space" caption
    // dragon + wizard float out the bottom
    tl.to([wiz, dragon], { y:'+=' + (H * 0.7), opacity:0, duration:1.1, ease:'power2.in', stagger:0.1 }, 2.75);
    // downward Star-Wars wipe: cover top→bottom, swap in the credits reel, then reveal it
    // transition: swipe UP to cover → hold black ~1s (swap all UI here) → swipe DOWN to reveal the game.
    // driven by a proxy whose onUpdate writes the transform imperatively, so two phases can't fight over the property (no stuck black).
    var coverAt = 2.95, wv = document.getElementById('jj-wipe-v'), wp = { v:0 };               // v: 0 = below, 1 = covering, 2 = below again
    function applyWipe(){ if (wv) wv.style.transform = 'translateY(' + (wp.v <= 1 ? 100 * (1 - wp.v) : 100 * (wp.v - 1)) + '%)'; }
    gsap.set('#jj-wipe-v', { display:'block' }); applyWipe();                                  // start fully below the viewport
    tl.to('#jj-wipe-v .jj-wv-edge', { opacity:1, duration:0.16, ease:'power1.out' }, coverAt);
    tl.to(wp, { v:1, duration:0.7, ease:'power2.in', onUpdate:applyWipe }, coverAt);           // swipe UP → black covers
    tl.call(function () { setupCredits(); }, null, coverAt + 1.15);                            // hold black ~1s; swap ALL the UI in here
    tl.to(wp, { v:2, duration:0.85, ease:'power2.out', onUpdate:applyWipe }, coverAt + 1.7);   // swipe DOWN → reveal the game
    tl.to('#jj-wipe-v .jj-wv-edge', { opacity:0, duration:0.3 }, coverAt + 2.3);
    tl.set('#jj-wipe-v', { display:'none' }, coverAt + 2.7);                                   // gone for good — no black-out
  }
  /* ===== "Trogdor" — the credits catch-game (revealed by the downward wipe) ===== */
  var GB = 'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/';                 // game assets live at the repo root (uploaded flat, not in a /game/ folder)
  var GSPRITE = 'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/dragon-sprite.png';
  // Homepage "hi I'm Joe" horizontal-scroll background art — reused so the credits scroll matches it.
  var BG_BACK  = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a0c90afafa53a631f4ff3ac_Starry%20Board%20-%20Background.svg';
  var BG_FRONT = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a0c964e79a06e8151f7f16b_Starry%20Board%20-%20Foreground2.svg';
  // Homepage waves + moon — the same assets used by the "hi I'm Joe" horizontal scroll.
  var WAVES_RIV = 'https://cdn.prod.website-files.com/6a19b8f4191d4fbca532591e/6a19b8f4191d4fbca532593b_Waves.riv';   // Rive waves (State Machine 1)
  var RIVE_RUNTIME = 'https://unpkg.com/@rive-app/canvas@2/rive.js';
  var MOON_URL = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a0d67bbb86603f359ae1311_289a8c92ed8a9b7dd3efdae788f3d0ae_Moon.svg';   // homepage Moon
  function mountRiveWaves(canvas){
    if (!canvas || canvas._rive) return; canvas._rive = true;
    function go(){
      if (canvas._riveInst) return;
      if (!window.rive || !window.rive.Rive) { setTimeout(go, 150); return; }                   // wait for the runtime
      try {
        var r = new window.rive.Rive({ src:WAVES_RIV, canvas:canvas, autoplay:true,
          stateMachines:'State Machine 1',
          layout:new window.rive.Layout({ fit:window.rive.Fit.Fill, alignment:window.rive.Alignment.BottomCenter }),   // full-screen canvas + Fill = identical to the homepage waves (no crop, no squish)
          onLoad:function(){ try{ r.resizeDrawingSurfaceToCanvas(); }catch(e){} } });
        canvas._riveInst = r;
        window.addEventListener('resize', function(){ try{ r.resizeDrawingSurfaceToCanvas(); }catch(e){} });
      } catch (e) {}
    }
    if (!window.rive && !document.getElementById('jj-rive-rt')) { var s=document.createElement('script'); s.id='jj-rive-rt'; s.src=RIVE_RUNTIME; document.head.appendChild(s); }
    go();
  }
  function setupCredits(){
    var stage = document.getElementById('jj-credits'); if (!stage || stage._game) return; stage._game = true;
    document.documentElement.classList.add('jj-credits-on');                                       // lets the Webflow "Back to Contact" button show now that we're in the game
    ['jj-contacts','jj-caption','jj-spacebar','jj-dark','jj-story','jj-toast','jj-stage','jj-dragon'].forEach(function(id){ var el = document.getElementById(id); if (el) el.style.display = 'none'; });
    if (!document.getElementById('jj-game-css')) {
      var st = document.createElement('style'); st.id = 'jj-game-css';
      st.textContent =
      '#jj-credits.playing{pointer-events:auto;}'+
      '#jj-cr-roll{position:absolute;left:0;top:0;height:100%;display:flex;align-items:center;will-change:transform;z-index:2;}'+
      '.jj-crd{flex:none;width:100vw;height:100%;display:flex;align-items:center;justify-content:center;padding:0 4vw;position:relative;z-index:2;}'+   // each credit gets its own full-width panel
      '.jj-crd img{width:min(44vw,760px);height:auto;display:block;}'+
      '.jj-crd-text{font-family:\'Joes Journey Headline\',sans-serif;color:#fff;font-size:clamp(30px,3.4vw,56px);line-height:1.12;white-space:nowrap;text-align:center;}'+
      '.jj-crd-text small{display:block;font-size:.6em;color:#cfe0ff;margin-bottom:.18em;}'+
      '#jj-waves{position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none;}'+   // full-screen canvas so the Rive waves (1920×1080 artboard) render at the bottom UNCUT, exactly like the homepage
      '#jj-waves canvas{width:100%!important;height:100%!important;display:block;}'+
      '.jj-moon{position:absolute;top:5vh;width:clamp(46px,5vw,90px);height:auto;z-index:0;pointer-events:none;animation:jj-glow-m 4.6s ease-in-out infinite;}'+   // homepage moon, glowing, ~50% smaller, floats across the top
      '.jj-moon img{width:100%;height:auto;display:block;}'+
      '@keyframes jj-glow-m{0%,100%{filter:drop-shadow(0 0 7px rgba(255,255,255,.6)) drop-shadow(0 0 20px rgba(205,225,255,.35));}50%{filter:drop-shadow(0 0 20px rgba(255,255,255,.92)) drop-shadow(0 0 46px rgba(205,225,255,.55));}}'+
      '#jj-gdragon{position:absolute;left:16%;top:50%;width:var(--gd,122px);height:calc(var(--gd,122px)*.516);transform:translate(-50%,-50%);z-index:6;pointer-events:none;will-change:top,width;transition:width .5s ease;}'+
      '#jj-gdragon .spr{width:100%;height:100%;background:url(\''+GSPRITE+'\') no-repeat;background-size:900% 800%;}'+
      '.jj-item{position:absolute;transform:translate(-50%,-50%);z-index:4;pointer-events:none;will-change:left,top;}'+
      '.jj-item img{width:100%;height:100%;display:block;}'+
      '.jj-item.bad img{filter:drop-shadow(0 0 11px rgba(255,55,55,.75));}'+
      '.jj-item.good img{filter:drop-shadow(0 0 9px rgba(130,175,255,.55));}'+
      '@font-face{font-family:\'Mario\';src:url(\''+GB+'mario.ttf\') format(\'truetype\');font-display:swap;}'+
      '#jj-hud{position:absolute;left:50%;top:3vh;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:24px;z-index:10;opacity:0;}'+   // ~20px gap below the card (its 4px outer ring eats some)
      '#jj-hud-card{position:relative;width:min(23vw,300px);background:#E0E0DE;border:3px solid #9b9b99;border-radius:6px;box-shadow:0 0 0 4px #4B4B4B;padding:8px 11px 9px;display:flex;flex-direction:column;gap:6px;}'+
      '#jj-hud-title{font-family:\'Joes Journey Headline\',sans-serif;color:#4A4A48;font-size:clamp(14px,1.65vw,25px);line-height:1;text-align:center !important;white-space:nowrap !important;display:block !important;}'+   // forced block + centered so nothing can stack the icon above the name
      '#jj-hud-title .mars{display:inline-block !important;vertical-align:middle !important;width:.95em;height:.95em;margin-right:10px;flex:none;}'+   // ♂ icon, inline, 10px left of the name
      '#jj-hud-title .tname{display:inline-block !important;vertical-align:middle !important;}'+
      '#jj-hud-barrow{display:flex;align-items:center;gap:7px;background:#B7B7B7;border-radius:3px;padding:3px 6px;}'+
      '#jj-hud-levlabel{font-family:\'Joes Journey Headline\',sans-serif;color:#FFB21E;font-size:clamp(9px,.98vw,15px);letter-spacing:.4px;white-space:nowrap;text-shadow:-1px -1px 0 rgba(0,0,0,.6),1px -1px 0 rgba(0,0,0,.6),-1px 1px 0 rgba(0,0,0,.6),1px 1px 0 rgba(0,0,0,.6);}'+
      '#jj-hud-groove{position:relative;flex:1;height:clamp(9px,1vw,15px);background:#F5F5F5;border-radius:2px;overflow:hidden;box-shadow:inset 0 1px 2px rgba(0,0,0,.22);}'+
      '#jj-hud-fill{position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(#2bd636,#15c022);border-radius:2px;transition:width .25s ease;}'+
      '#jj-score{font-family:\'Mario\',\'Joes Journey Headline\',sans-serif;color:#fff;font-size:clamp(15px,1.7vw,26px);letter-spacing:1px;-webkit-text-stroke:1.5px #2E2F31;paint-order:stroke fill;text-shadow:0 3px 0 rgba(0,0,0,.5);}'+   // smaller than before
      '#jj-cr-bg{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;}'+   // homepage Starry Board layers, scrolled horizontally (parallax)
      '#jj-cr-back,#jj-cr-front{position:absolute;inset:0;overflow:hidden;will-change:transform;}'+
      '.jj-bg-strip{position:absolute;top:0;bottom:0;left:0;display:flex;align-items:stretch;will-change:transform;}'+
      '.jj-bg-tile{height:100%;width:auto;max-width:none;display:block;flex:none;}'+   // every other tile mirrored in JS (scaleX -1) → seamless edges
      '#jj-cr-progress{position:absolute;left:0;bottom:0;width:100%;height:4px;z-index:14;opacity:0;pointer-events:none;}'+   // pink scroll-progress bar — matches the homepage #jj-progress
      '#jj-cr-progress-fill{height:100%;width:0;background:linear-gradient(90deg,#FF00F5,#ff7df4);box-shadow:0 0 12px rgba(255,0,245,0.7);transition:width .12s linear;}'+
      '#jj-gtitle{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);width:min(82vw,1050px);text-align:center;font-family:\'Joes Journey Headline\',sans-serif;color:#fff;font-size:clamp(30px,4.2vw,66px);line-height:1.1;opacity:0;z-index:13;pointer-events:none;}'+
      '.jj-pop{position:absolute;transform:translate(-50%,-50%);z-index:9;pointer-events:none;}'+
      '.jj-pop img{width:clamp(46px,4vw,70px);display:block;}'+
      '#jj-gcap{position:absolute;left:50%;bottom:7vh;transform:translateX(-50%) scale(.96);min-width:280px;max-width:60vw;background:#E0E0DE;border:6px solid #616068;border-radius:8px;box-shadow:0 0 0 5px #FBDD65,0 0 0 9px #2E2F31;padding:13px 24px;font-family:\'Joes Journey Headline\',sans-serif;font-size:clamp(15px,1.55vw,23px);color:#4A4A48;opacity:0;z-index:13;white-space:pre-line;transition:opacity .22s ease,transform .22s ease;}'+
      '#jj-gcap.show{opacity:1;transform:translateX(-50%) scale(1);}'+
      '.jj-tut-svg{position:absolute;inset:0;width:100%;height:100%;z-index:12;pointer-events:none;overflow:visible;}'+   // connector line — z below the caption (13) so its end hides behind it, above the scene/HUD
      '.jj-tut-box{position:absolute;border:4px dashed #FF00F5;border-radius:8px;z-index:21;pointer-events:none;animation:jj-tut-pulse 1.1s ease-in-out infinite;}'+
      '@keyframes jj-tut-pulse{0%,100%{box-shadow:0 0 14px rgba(255,0,245,.45);}50%{box-shadow:0 0 28px rgba(255,0,245,.8);}}'+
      '#jj-keys{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(7vh + 86px);display:flex;flex-direction:row;gap:clamp(34px,5.5vw,82px);align-items:center;z-index:10;opacity:0;}'+   // sit ~20px above the caption box (caption is bottom:7vh, ~66px tall)
      '#jj-keys img{width:clamp(46px,4.2vw,68px);display:block;cursor:pointer;}'+
      '#jj-back{position:absolute;left:3vw;bottom:3vh;z-index:14;color:#000;cursor:pointer;background:#fff;border:none;border-radius:8px;column-gap:1rem;justify-content:center;align-items:center;padding:1.2vh 1.5vw;font-family:\'Joes Journey Body\',sans-serif;font-size:clamp(13px,1vw,18px);transition:background-color .2s;display:flex;}'+
      '#jj-back:hover{background:#FF00F5;color:#fff;}#jj-back:active{transform:scale(.96);}#jj-back svg{display:block;flex:none;stroke:currentColor;}'+
      '.jj-overlay{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;background:rgba(7,12,22,.55);z-index:30;opacity:0;}'+
      '.jj-menu-title{font-family:\'Mario\',\'Joes Journey Headline\',sans-serif;color:#fff;font-size:clamp(40px,6.5vw,104px);letter-spacing:2px;text-shadow:0 6px 0 rgba(0,0,0,.4);}'+
      '.jj-paused-img{width:clamp(180px,24vw,300px);height:auto;display:block;margin-bottom:6px;filter:drop-shadow(0 0 16px rgba(255,0,245,.4));}'+   // the PAUSED graphic; overlay gap(24)+6 ≈ 30px above the menu box
      '.jj-menu-box{background:#E0E0DE;border:6px solid #616068;border-radius:8px;box-shadow:0 0 0 5px #FBDD65,0 0 0 9px #2E2F31;padding:14px 32px 14px 14px;min-width:300px;}'+
      '.jj-menu-item{font-family:\'Joes Journey Headline\',sans-serif;color:#7a7a78;font-size:clamp(18px,2vw,30px);padding:7px 8px 7px 36px;position:relative;cursor:pointer;line-height:1.15;transition:color .12s ease;}'+
      '.jj-menu-item .tri{position:absolute;left:9px;top:50%;width:0;height:0;border-left:11px solid #FF2A2A;border-top:7px solid transparent;border-bottom:7px solid transparent;transform:translateY(-50%);opacity:0;}'+
      '.jj-menu-item.sel{color:#2E2F31;}.jj-menu-item.sel .tri{opacity:1;}'+
      '#jj-end .jj-e-col{display:flex;flex-direction:column;align-items:center;gap:40px;}'+   // more space between the title block, menu, and level badge
      '#jj-end .jj-e-head{display:flex;flex-direction:column;align-items:center;gap:6px;}'+   // title + subtitle are a tight pair (per design)
      '#jj-end .jj-e-title{font-family:\'Joes Journey Headline\',sans-serif;color:#fff;font-size:clamp(34px,5.5vw,82px);margin:0;text-align:center;line-height:1.05;}'+
      '#jj-end .jj-e-sub{font-family:\'Joes Journey Headline\',sans-serif;color:rgba(255,255,255,.82);font-size:clamp(15px,1.7vw,24px);margin:0;text-align:center;}'+
      '#jj-end .jj-e-lvl{display:flex;flex-direction:column;align-items:center;gap:8px;font-family:\'Mario\',sans-serif;color:#fff;font-size:clamp(15px,1.7vw,24px);letter-spacing:2px;}'+
      '#jj-end .jj-e-num{width:clamp(58px,6.5vw,96px);height:clamp(58px,6.5vw,96px);border-radius:50%;background:radial-gradient(circle,#fff 58%,rgba(197,231,255,.25) 72%);box-shadow:0 0 28px 9px rgba(197,231,255,.4);display:flex;align-items:center;justify-content:center;font-family:\'Mario\',sans-serif;font-size:clamp(28px,3.4vw,50px);-webkit-text-stroke:2px #111;}';
      document.head.appendChild(st);
    }
    stage.innerHTML =
      '<div id="jj-cr-bg"><div id="jj-cr-back"></div><div id="jj-cr-front"></div></div>'+
      '<canvas id="jj-waves"></canvas>'+
      '<div id="jj-cr-roll"></div>'+
      '<div id="jj-gdragon"><div class="spr"></div></div>'+
      '<div id="jj-hud"><div id="jj-hud-card">'+
        '<div id="jj-hud-title"><svg class="mars" viewBox="0 0 24 24" fill="none" stroke="#3aa6ea" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="14" r="6"/><path d="M14.2 9.8 20 4"/><path d="M14.5 4H20v5.5"/></svg><span class="tname">Trogdor</span></div>'+
        '<div id="jj-hud-barrow"><span id="jj-hud-levlabel">LEVEL <span id="jj-hud-levn">1</span></span>'+
          '<div id="jj-hud-groove"><div id="jj-hud-fill"></div></div></div>'+
        '</div><div id="jj-score">SCORE : 0</div></div>'+
      '<div id="jj-keys"><img src="'+GB+'arrow-up.svg" alt="Up"><img src="'+GB+'arrow-down.svg" alt="Down"></div>'+
      '<div id="jj-gtitle"></div>'+
      '<div id="jj-gcap"></div>'+
      '<div id="jj-cr-progress"><div id="jj-cr-progress-fill"></div></div>'+
      '<button id="jj-back" data-cursor="hover"><svg width="34" height="15" viewBox="0 0 34 15" fill="none"><path d="M33 7.5H1M1 7.5L7.5 1M1 7.5L7.5 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>BACK TO CONTACT</button>';
    gsap.set(stage, { opacity:1 });
    // Back-to-Contact: use YOUR Webflow button (keeps its pink hover/fill/press) and drop my fallback. Fade + grow it in with the game.
    var backEl = findWfBack() || document.getElementById('jj-back');
    if (backEl && backEl.id !== 'jj-back') { var jb0 = document.getElementById('jj-back'); if (jb0) jb0.remove(); }   // your button exists → remove mine entirely
    if (backEl) {
      backEl.style.removeProperty('opacity'); backEl.style.removeProperty('pointer-events');                       // undo the load-time hide
      gsap.fromTo(backEl, { opacity:0, scale:0.8 }, { opacity:1, scale:1, duration:0.7, ease:'back.out(1.5)', delay:1.2, transformOrigin:'left bottom' });
      if (!backEl._jjWired) { backEl._jjWired = true; backEl.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); backToContact(); }, true); }   // make it actually return to /contact (reload), not whatever Webflow had it do
    }

    var CREDITS = [
      { text:'<small>Created, Designed &amp; Directed by yours truly&hellip;</small>Joe Jackson' },
      { img:'copy-developed.svg' },{ img:'copy-illustrations.svg' },{ img:'copy-animations.svg' },
      { img:'copy-typography.svg' },{ img:'copy-logo.svg' },{ img:'copy-voice.svg' },{ img:'copy-music.svg' },
      { img:'copy-claude.svg' },{ img:'copy-thanks.svg' },{ img:'copy-everyone.svg' }
    ];
    var roll = document.getElementById('jj-cr-roll');
    roll.innerHTML = CREDITS.map(function(c){ return '<div class="jj-crd">'+(c.img?'<img src="'+GB+c.img+'">':'<div class="jj-crd-text">'+c.text+'</div>')+'</div>'; }).join('');
    // Decorations: the homepage Moon glides across the top every few panels (waves are the fixed Rive scene below).
    var span = CREDITS.length*100, deco='', mi=0;
    for(var mx=185; mx<span; mx+=300){ deco+='<div class="jj-moon" style="left:'+mx+'vw;animation-delay:'+(-mi*1.4)+'s"><img src="'+MOON_URL+'" alt=""></div>'; mi++; }
    roll.insertAdjacentHTML('beforeend', deco);
    mountRiveWaves(document.getElementById('jj-waves'));                                          // homepage Waves.riv, fixed at the bottom

    var dragon = document.getElementById('jj-gdragon'), spr = dragon.querySelector('.spr');
    var fillEl = document.getElementById('jj-hud-fill'), scoreEl = document.getElementById('jj-score'), cap = document.getElementById('jj-gcap');
    var lvNumEl = document.getElementById('jj-hud-lv'), levNumEl = document.getElementById('jj-hud-levn');
    var bgBack = document.getElementById('jj-cr-back'), bgFront = document.getElementById('jj-cr-front'), progFill = document.getElementById('jj-cr-progress-fill');
    var introBg = document.getElementById('jj-intro-bg');                                            // the swirl SVG — scroll it too (parallax)
    if(introBg){ introBg.style.width='330vw'; introBg.style.left='-35vw'; introBg.style.willChange='transform'; }
    function setLevelHUD(){ if(lvNumEl) lvNumEl.textContent = G.level; if(levNumEl) levNumEl.textContent = G.level; }
    var REEL_K=1.38;                                                                                 // credits reel speed (was 1.2; +15%)
    function paintScroll(){ roll.style.transform='translateX('+(G.rollX*REEL_K)+'vw)';
      if(introBg) introBg.style.transform='translateX('+(G.rollX*0.15)+'vw)';                        // swirl drift (deepest layer)
      if(progFill){ var p=(60-G.rollX)/(60+((G.rollW||1)/REEL_K)); progFill.style.width=Math.max(0,Math.min(1,p))*100+'%'; } }
    // Reuse the homepage's "hi I'm Joe" Starry Board layers, parallaxed at the same back/front ratio
    // (0.3 / 0.6) — driven by the credits scroll (G.rollX) + a slow drift so the space keeps moving even
    // before gameplay starts. Each layer is a strip of the SVG with EVERY OTHER COPY MIRRORED (scaleX -1)
    // so adjacent tile edges match; the scroll wraps on a 2-tile period so the loop point is seamless too.
    var BG_BACK_SPEED=0.3, BG_FRONT_SPEED=0.6, bgLast=null, bgElapsed=0;
    function buildMirrorStrip(host, url, speed){
      var strip=document.createElement('div'); strip.className='jj-bg-strip'; host.appendChild(strip);
      var st={strip:strip, tileW:0, speed:speed, phase:0};
      function addTile(){ var i=strip.children.length; var im=document.createElement('img'); im.className='jj-bg-tile'; im.alt=''; if(i%2) im.style.transform='scaleX(-1)'; im.src=url; strip.appendChild(im); }
      function fill(){ var f=strip.querySelector('img'); if(!f) return; var w=f.getBoundingClientRect().width; if(!w) return; st.tileW=w;
        var need=Math.ceil(window.innerWidth/w)+2; while(strip.children.length<need) addTile();        // boards are ~11:1, so a tile is several viewports wide → 3 tiles is plenty
        var period=2*w, pxInit=(60*st.speed)*window.innerWidth/100; st.phase=period/4 - pxInit; }      // start mid-tile so the opening never sits on a mirror seam
      addTile(); addTile();                                                                            // seed a normal + a mirrored copy
      var f=strip.querySelector('img');
      if(f.complete && f.naturalWidth) fill(); else f.addEventListener('load', fill);
      window.addEventListener('resize', fill);
      return st;
    }
    var stripBack = bgBack ? buildMirrorStrip(bgBack, BG_BACK, BG_BACK_SPEED) : null;
    var stripFront = bgFront ? buildMirrorStrip(bgFront, BG_FRONT, BG_FRONT_SPEED) : null;
    function moveStrip(st, vwOffset){ if(!st || !st.tileW) return;                                     // translate within one 2-tile period (mirror parity preserved → seamless wrap)
      var px=vwOffset*window.innerWidth/100 + st.phase, period=2*st.tileW, off=((px%period)+period)%period;
      st.strip.style.transform='translateX('+(off-period)+'px)'; }
    function bgScroll(t){
      if(!stage._game) return;                                                                         // stops when the scene is torn down (page reload)
      if(bgLast==null) bgLast=t; var dt=t-bgLast; bgLast=t;
      if(!G.frozen && !paused) bgElapsed += dt;                                                         // freeze the drift during a tutorial freeze / menu pause
      var e=bgElapsed/1000;
      moveStrip(stripBack,  G.rollX*BG_BACK_SPEED  - e*1.1);                                            // far board — slow parallax
      moveStrip(stripFront, G.rollX*BG_FRONT_SPEED - e*2.2);                                            // near board — faster parallax
      requestAnimationFrame(bgScroll);
    }
    requestAnimationFrame(bgScroll);
    var GOOD = ['good-claude','good-gpt','good-perplexity','good-css','good-js','good-gsap','good-figma','good-miro','good-rive','good-jitter','good-procreate','good-music','good-coding','good-typography','good-voicework','good-webflow','good-logo','good-alien1','good-alien2','good-alien3'];
    var BAD = ['bad-alien1','bad-alien2','bad-spiky','bad-rocks','bad-junk','bad-blackhole'], BADLG = ['bad-alien1-lg','bad-alien2-lg','bad-spiky-lg'];
    var G = { run:false, score:0, level:1, fill:0, dy:50, ty:50, items:[], rollX:60, rollW:0, lastT:0, lastSpawn:0, f:0, fLast:0, said:{}, harder:false, frozen:false };
    setLevelHUD();
    function setDragon(){ dragon.style.setProperty('--gd', (122 + (G.level-1)*7)+'px'); }
    setDragon();
    function frame(t){ if (t-G.fLast>=83){ G.fLast=t; spr.style.backgroundPosition=((G.f%9)/8*100)+'% '+(Math.floor(G.f/9)/7*100)+'%'; G.f=(G.f+1)%72; } }
    function band(){ return 7.5; }

    function up(){ G.ty=Math.max(16,G.ty-8); } function down(){ G.ty=Math.min(80,G.ty+8); }
    var paused=false, viewMode=false, menuOpen=false, menuSel=0, menuItems=null, menuBoxEl=null, pauseFrom='play', ended=false;
    var LVLCOL=['#FF00F5','#EEFF00','#A38CFF','#FF0000','#00FF33','#BF00FF','#FFBB00','#FFDDFE','#FF00F5'];
    function onKey(e){
      if(menuOpen){
        if(e.code==='ArrowUp'){ e.preventDefault(); menuMove(-1); }
        else if(e.code==='ArrowDown'){ e.preventDefault(); menuMove(1); }
        else if(e.code==='Enter'){ e.preventDefault(); menuActivate(menuSel); }
        else if(e.code==='Space'){ e.preventDefault(); menuActivate(0); }     // Space activates the first item (Continue / Restart)
        return;
      }
      if(G.frozen){ e.preventDefault(); return; }                            // input is locked during the 3s tutorial freeze
      if(e.code==='Space'){ e.preventDefault(); if(G.run){ openMenu(viewMode?'view':'play'); } return; }   // Space pauses anytime
      if(!G.run || paused) return;
      if(e.code==='ArrowUp'){ e.preventDefault(); up(); } else if(e.code==='ArrowDown'){ e.preventDefault(); down(); }
    }
    window.addEventListener('keydown', onKey);
    document.getElementById('jj-keys').children[0].addEventListener('click', function(){ if(!paused) up(); });
    document.getElementById('jj-keys').children[1].addEventListener('click', function(){ if(!paused) down(); });

    // ---- pause / View-Scene / end menu ----
    function buildMenuBox(items, sel){
      var box=document.createElement('div'); box.className='jj-menu-box';
      box.innerHTML=items.map(function(it,i){ return '<div class="jj-menu-item'+(i===sel?' sel':'')+'" data-i="'+i+'"><span class="tri"></span>'+it.label+'</div>'; }).join('');
      box.addEventListener('click', function(e){ var el=e.target.closest('.jj-menu-item'); if(el){ menuSel=+el.getAttribute('data-i'); paintMenu(); menuActivate(menuSel); } });
      box.addEventListener('mousemove', function(e){ var el=e.target.closest('.jj-menu-item'); if(el && +el.getAttribute('data-i')!==menuSel){ menuSel=+el.getAttribute('data-i'); paintMenu(); } });
      return box;
    }
    function paintMenu(){ if(!menuBoxEl)return; var its=menuBoxEl.querySelectorAll('.jj-menu-item'); for(var i=0;i<its.length;i++) its[i].classList.toggle('sel',i===menuSel); }
    function menuMove(d){ if(!menuItems)return; menuSel=(menuSel+d+menuItems.length)%menuItems.length; paintMenu(); }
    function menuActivate(i){ if(!menuItems)return; var it=menuItems[Math.min(i,menuItems.length-1)]; if(it) it.fn(); }
    function pauseItems(){ return [ {label:'Continue',fn:resume}, {label:'Restart',fn:restartGame}, {label:'Back to Contact',fn:backToContact}, {label:'View Scene',fn:enterView}, {label:'Main Menu',fn:openMainMenu} ]; }
    function endItems(){ return [ {label:'Restart',fn:restartGame}, {label:'Back to Contact',fn:backToContact}, {label:'View Scene',fn:enterView}, {label:'Main Menu',fn:openMainMenu} ]; }
    function openMenu(from){
      if(menuOpen)return; menuOpen=true; paused=true; pauseFrom=from||'play'; setGameMute(true);   // pausing with Space also mutes the music
      var ov=document.createElement('div'); ov.id='jj-pause'; ov.className='jj-overlay';
      var t=document.createElement('img'); t.className='jj-paused-img'; t.src=GB+'paused.svg'; t.alt='Paused'; ov.appendChild(t);   // the attached PAUSED graphic
      menuItems=pauseItems(); menuSel=0; menuBoxEl=buildMenuBox(menuItems,0); ov.appendChild(menuBoxEl);
      stage.appendChild(ov); gsap.fromTo(ov,{opacity:0},{opacity:1,duration:.22});
    }
    function closeMenu(){ ['jj-pause','jj-end'].forEach(function(id){ var o=document.getElementById(id); if(o)o.remove(); }); menuOpen=false; menuItems=null; menuBoxEl=null; setGameMute(false); }   // un-mute on resume/restart/view
    function resume(){ closeMenu(); if(pauseFrom==='view'){ paused=true; viewMode=true; showCap("Press 'Space' to open the menu…",0); } else { paused=false; viewMode=false; cap.classList.remove('show'); G.lastT=0; } }
    function restartGame(){ closeMenu();
      document.querySelectorAll('#jj-credits .jj-item').forEach(function(el){el.remove();}); G.items=[];
      G.score=0; G.level=1; G.fill=0; G.dy=50; G.ty=50; G.said={}; G.harder=false; G.frozen=false; G.rollX=60; rollDone=false; ended=false;
      ['jj-tut-box','jj-tut-svg'].forEach(function(c){ document.querySelectorAll('.'+c).forEach(function(el){el.remove();}); });   // clear any leftover tutorial highlight
      setLevelHUD(); setDragon(); scoreEl.textContent='SCORE : 0'; fillEl.style.width='0%';
      paintScroll(); cap.classList.remove('show');
      gsap.to(['#jj-hud','#jj-keys','#jj-cr-progress'],{opacity:1,duration:.3}); if(backEl) gsap.to(backEl,{opacity:1,duration:.3});   // restore gameplay UI (may have been hidden by the end screen)
      paused=false; viewMode=false; if(!G.run){ G.run=true; G.lastT=0; G.lastSpawn=0; G.raf=requestAnimationFrame(loop); } else { G.lastT=0; } }
    function backToContact(){ location.href = location.pathname; }   // drop ?credits=1 so Back returns to the normal contact scene (not straight back into the game)
    function openMainMenu(){ var m=document.querySelector('.menu-container, .menu-button, .menu-links-wrap'); closeMenu(); if(m) m.click(); }
    function enterView(){ closeMenu(); paused=true; viewMode=true; pauseFrom='view'; showCap("Press 'Space' to open the menu…",0); if(!G.run){ G.run=true; G.lastT=0; G.raf=requestAnimationFrame(loop); } }

    function showCap(text, ms, done){
      cap.classList.add('show'); clearInterval(cap._tw); clearTimeout(cap._h); var i=0; cap.textContent='';
      cap._tw=setInterval(function(){ i++; cap.textContent=text.slice(0,i); if(i>=text.length){ clearInterval(cap._tw); if(ms===0){ if(done)done(); } else { cap._h=setTimeout(function(){ cap.classList.remove('show'); if(done)done(); }, ms||1500); } } }, 34);
    }
    function flash(text, ms){ showCap(text, ms||1100); }
    function pop(kind){ var p=document.createElement('div'); p.className='jj-pop'; p.innerHTML='<img src="'+GB+(kind>0?'pop-plus.svg':'pop-minus.svg')+'">'; p.style.left='16%'; p.style.top=G.dy+'%'; stage.appendChild(p);
      gsap.fromTo(p,{opacity:0,scale:.7},{opacity:1,scale:1,duration:.18}); gsap.to(p,{top:(G.dy-8)+'%',opacity:0,duration:.9,delay:.2,ease:'power1.out',onComplete:function(){p.remove();}}); }
    function levelUpFx(){ var l=document.createElement('div'); l.className='jj-pop'; l.innerHTML='<img src="'+GB+'levelup-'+Math.min(9,G.level)+'.svg" style="width:clamp(120px,13vw,210px);display:block">'; l.style.left='16%'; l.style.top=(G.dy-16)+'%'; stage.appendChild(l);
      gsap.fromTo(l,{opacity:0,scale:.5},{opacity:1,scale:1,duration:.4,ease:'back.out(2)'}); gsap.to(l,{top:(G.dy-22)+'%',opacity:0,duration:.7,delay:.7,onComplete:function(){l.remove();}}); }

    /* Tutorial freeze: hold the whole scene, ring an item with a dashed box, draw a line to it from the
       caption, show the caption for 3s, then resume. Used for the first good (figma) and first red item. */
    function tutorialHighlight(itemEl, captionText){
      if(G.frozen) return; G.frozen=true;
      var box=document.createElement('div'); box.className='jj-tut-box'; stage.appendChild(box);
      var NS='http://www.w3.org/2000/svg';
      var svg=document.createElementNS(NS,'svg'); svg.setAttribute('class','jj-tut-svg');
      var line=document.createElementNS(NS,'line'); line.setAttribute('stroke','#FF00F5'); line.setAttribute('stroke-width','4'); line.setAttribute('stroke-linecap','round');
      var dot=document.createElementNS(NS,'circle'); dot.setAttribute('r','9'); dot.setAttribute('fill','#FF00F5');
      svg.appendChild(line); svg.appendChild(dot); stage.appendChild(svg);
      showCap(captionText, 0);                                                                       // show + hold the caption
      requestAnimationFrame(function(){                                                              // one frame later the item has settled into its frozen spot → box centres on it
        var sr=stage.getBoundingClientRect(), r=itemEl.getBoundingClientRect();
        var cx=r.left+r.width/2-sr.left, cy=r.top+r.height/2-sr.top, pad=Math.max(16, r.width*0.18);
        box.style.left=(cx-r.width/2-pad)+'px'; box.style.top=(cy-r.height/2-pad)+'px';
        box.style.width=(r.width+pad*2)+'px'; box.style.height=(r.height+pad*2)+'px';
        var capR=document.getElementById('jj-gcap').getBoundingClientRect();
        var sx=capR.left+capR.width/2-sr.left, sy=capR.top+capR.height*0.5-sr.top;                   // start at the caption's middle so the line's end tucks behind it (svg sits below the caption)
        line.setAttribute('x1',sx); line.setAttribute('y1',sy); line.setAttribute('x2',cx); line.setAttribute('y2',cy);
        dot.setAttribute('cx',cx); dot.setAttribute('cy',cy);
      });
      setTimeout(function(){ box.remove(); svg.remove(); document.getElementById('jj-gcap').classList.remove('show'); G.frozen=false; G.lastT=0; G.lastSpawn=0; }, 3000);
    }
    function spawnItem(){
      var bad = Math.random() < Math.min(.5, .2+(G.level-1)*.04);
      if(!G.said.good) bad=false;                                                                   // make sure the very first item is a good one (so the figma tutorial comes first)
      var firstGood = (!bad && !G.said.good), firstBad = (bad && !G.said.warn), tut = firstGood || firstBad;
      var name, cls, big=false;
      if (bad){ var lg=(G.level>=4 && Math.random()<.4); var pool=lg?BADLG:BAD; name=pool[Math.floor(Math.random()*pool.length)]; cls='bad'; big=lg; }
      else { name = firstGood ? 'good-figma' : GOOD[Math.floor(Math.random()*GOOD.length)]; cls='good'; }   // first good = the figma one (it gets highlighted)
      var el=document.createElement('div'); el.className='jj-item '+cls;
      var sz = big ? 'clamp(72px,7vw,118px)' : 'clamp(56px,5.4vw,92px)';
      if(bad && G.harder) sz='calc(('+sz+') * 1.2)';                                              // past halfway, the red (bad) ones grow 20%
      el.style.width=sz; el.style.height=sz; el.innerHTML='<img src="'+GB+name+'.svg">';
      var startX = tut ? 58 : 106;                                                                // tutorial items spawn already on-screen so they can be ringed
      var y = tut ? (34+Math.random()*22) : (18+Math.random()*60); el.style.left=startX+'%'; el.style.top=y+'%'; stage.appendChild(el);
      G.items.push({ el:el, x:startX, y:y, bad:bad, hit:false, band:band()+(big?2:0)+(bad&&G.harder?1.5:0), spd:0.85+Math.random()*0.3, bobA:tut?0:(1.1+Math.random()*1.7), bobP:Math.random()*6.283, bobS:0.0009+Math.random()*0.0009 });   // varied speed + gentle float; tutorial items don't bob (so the ring stays centred)
      if(firstGood){ G.said.good=1; tutorialHighlight(el, "Mmm…Tasty…Trogdor looks like he'd enjoy that.."); }
      else if(firstBad){ G.said.warn=1; tutorialHighlight(el, "Oh, he doesn't like the look of that!"); }
    }
    function hit(it){
      it.hit=true; it.el.remove(); var idx=G.items.indexOf(it); if(idx>=0) G.items.splice(idx,1);
      if(it.bad){ G.score=Math.max(0,G.score-50); pop(-1); G.fill-=.34;
        if(G.fill<0){ if(G.level>1){ G.level--; G.fill+=1; setLevelHUD(); setDragon(); } else G.fill=0; }
        if(Math.random()<0.25) flash('Eugh!',900); gsap.fromTo(dragon,{filter:'brightness(2.1) saturate(.4)'},{filter:'none',duration:.4});   // only react now and then — every time is distracting
      } else { G.score+=50; pop(1); G.fill+=.2;
        if(G.fill>=1){ G.fill-=1; if(G.level<9){ G.level++; setLevelHUD(); setDragon(); levelUpFx(); flash("I'm getting…stronger!",1300); if(G.level>=9 && window.jjScore) window.jjScore.award('credits10'); } else G.fill=1; }   // top level = +1 star
        if(Math.random()<0.22) flash('Yum!',900);   // only now and then
      }
      scoreEl.textContent='SCORE : '+G.score; fillEl.style.width=Math.max(0,Math.min(1,G.fill))*100+'%';
    }
    var rollDone=false;
    function loop(t){
      if(!G.run) return; var dt=Math.min(48,t-(G.lastT||t)); G.lastT=t; var k=dt/16.7;
      if(G.frozen){ G.lastSpawn=t; G.raf=requestAnimationFrame(loop); return; }   // tutorial freeze: hold the dragon, items, scroll & spawns in place
      frame(t);                                                       // dragon keeps flapping even while paused
      if(paused){                                                     // pause menu open, or View-Scene mode
        G.lastSpawn=t;                                                 // keep spawn clock fresh so resume doesn't burst
        if(viewMode){ G.rollX-=0.16*k; paintScroll(); if(-G.rollX*REEL_K>G.rollW){ G.rollX=60; } }
        dragon.style.top=(G.dy+Math.sin(t/520)*1.4)+'%'; G.raf=requestAnimationFrame(loop); return;
      }
      G.dy += (G.ty-G.dy)*Math.min(1,.22*k); dragon.style.top=(G.dy+Math.sin(t/520)*1.4)+'%';
      if(t-G.lastSpawn > Math.max(560,1150-(G.level-1)*85)*1.25){ G.lastSpawn=t; spawnItem(); }     // ~20% fewer items (longer gap between spawns)
      var sp=.30+(G.level-1)*.045;
      for(var i=G.items.length-1;i>=0;i--){ var it=G.items[i]; it.x-=sp*(it.spd||1)*k; it.el.style.left=it.x+'%'; it.el.style.top=(it.y+Math.sin(t*it.bobS+it.bobP)*it.bobA)+'%';
        if(!it.hit && it.x<=18 && it.x>=10 && Math.abs(it.y-G.dy)<it.band){ hit(it); continue; }
        if(it.x<-8){ it.el.remove(); G.items.splice(i,1); } }
      if(!rollDone){ G.rollX-=sp*.31*k; paintScroll();
        if(!G.harder && G.rollW){ var prog=(60-G.rollX)/(60+(G.rollW)/REEL_K); if(prog>=0.5){ G.harder=true; flash("Be careful! It's starting to get a bit harder now!",2400); } }   // halfway → red ones grow + warn
        if(-G.rollX*REEL_K>G.rollW){ rollDone=true; endGame(); } }
      G.raf=requestAnimationFrame(loop);
    }
    function startPlay(){ G.run=true; stage.classList.add('playing'); G.lastT=0; G.lastSpawn=0;
      G.rollW = roll.scrollWidth/window.innerWidth*100 + 50;
      gsap.to('#jj-hud',{opacity:1,duration:.5}); gsap.to('#jj-keys',{opacity:1,duration:.5}); gsap.to('#jj-cr-progress',{opacity:1,duration:.5}); G.raf=requestAnimationFrame(loop); }
    function endGame(){ if(ended)return; ended=true; G.run=false; if(G.raf)cancelAnimationFrame(G.raf); paused=false; viewMode=false;
      if(window.jjScore) window.jjScore.award('credits');                                     // +1 star — finished the credits
      gsap.to(['#jj-hud','#jj-keys','#jj-cr-progress'],{opacity:0,duration:.4}); if(backEl) gsap.to(backEl,{opacity:0,duration:.4});   // clear gameplay UI for the end screen
      var end=document.createElement('div'); end.id='jj-end'; end.className='jj-overlay';
      var col=document.createElement('div'); col.className='jj-e-col';
      col.innerHTML='<div class="jj-e-head"><h2 class="jj-e-title">Thanks for Playing!</h2><div class="jj-e-sub">Final score '+G.score+' &middot; reached Level '+G.level+'</div></div>';
      menuItems=endItems(); menuSel=0; menuBoxEl=buildMenuBox(menuItems,0); col.appendChild(menuBoxEl);
      var lvl=document.createElement('div'); lvl.className='jj-e-lvl'; lvl.innerHTML='LEVEL REACHED<div class="jj-e-num" style="color:'+LVLCOL[Math.min(8,G.level-1)]+';text-shadow:0 0 26px '+LVLCOL[Math.min(8,G.level-1)]+'">'+G.level+'</div>';
      col.appendChild(lvl); end.appendChild(col); stage.appendChild(end);
      menuOpen=true; gsap.fromTo(end,{opacity:0},{opacity:1,duration:.6}); gsap.fromTo(lvl.querySelector('.jj-e-num'),{scale:.4,opacity:0},{scale:1,opacity:1,duration:.6,delay:.3,ease:'back.out(2)'}); }

    paintScroll(); dragon.style.top='50%'; dragon.style.left='-14%';   // Trogdor starts off-screen left
    gsap.set(['#jj-hud','#jj-keys'],{opacity:0});
    var gtitle=document.getElementById('jj-gtitle');
    function showTitle(text, ms, done){ gtitle.textContent=text; gsap.killTweensOf(gtitle); gsap.to(gtitle,{opacity:1,duration:.5}); setTimeout(function(){ gsap.to(gtitle,{opacity:0,duration:.5,onComplete:done}); }, ms); }
    var TUT=[["Press 'Up' and 'Down' to move him…",1500],["Catch anything flying through space to level up…",1700],["But beware of anything that looks dangerous!",1700],["Let's get started! Check out who helped out along the way!",1500]];
    function runTut(i){ if(i>=TUT.length){ startPlay(); return; } if(i===0) gsap.to('#jj-keys',{opacity:1,duration:.5}); showCap(TUT[i][0],TUT[i][1],function(){ runTut(i+1); }); }
    (function preFlap(t){ if(G.run) return; frame(t||0); requestAnimationFrame(preFlap); })(0);   // flap during tutorial
    gsap.to(dragon,{left:'16%',duration:2.4,ease:'power2.out',onComplete:function(){   // float Trogdor into place, then announce + show health, then tutorial
      gsap.to('#jj-hud',{opacity:1,duration:.6});
      showTitle("Meet, Trogdor. He's a hungry boy!",2400,function(){ runTut(0); });
    }});
    creditsCleanup=function(){ G.run=false; if(G.raf)cancelAnimationFrame(G.raf); window.removeEventListener('keydown',onKey); clearInterval(cap._tw); clearTimeout(cap._h); };
  }
  /* the "press Space" key prompt — fades in with the happy caption, clickable too */
  function showSpacebar(){
    var sb = document.getElementById('jj-spacebar'); if (!sb || !window.gsap) return;
    if (!sb._wired) { sb._wired = true; sb.addEventListener('click', function () { launchCredits(); }); }
    gsap.to(sb, { opacity:1, duration:0.5, ease:'power1.out' });
    gsap.to(sb, { scale:1.07, duration:0.95, repeat:-1, yoyo:true, ease:'sine.inOut' });       // gentle "press me" pulse
  }

  /* the bottom-right dragon reacts: hover → happy, click → angry + sink (face only) then back, idle smile every 5–10s */
  var DR = {
    normal: 'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/dragon-rest.png',
    happy:  'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/dragon-happy.png',
    angry:  'https://raw.githack.com/jacksonlaptop/joes-journey-code/main/dragon-angry.png'
  };
  function setupDragon(){
    var d = document.getElementById('jj-rest-dragon'); if (!d || !window.gsap || d._wired) return;
    d._wired = true;
    var busy = false, hovering = false;
    function face(f){ if (d.getAttribute('src') !== DR[f]) d.src = DR[f]; }
    d.addEventListener('mouseenter', function () { if (creditsRunning) return; hovering = true; if (!busy) face('happy'); });
    d.addEventListener('mouseleave', function () { if (creditsRunning) return; hovering = false; if (!busy) face('normal'); });
    d.addEventListener('click', function () {
      if (creditsRunning || busy) return; busy = true;
      face('angry');
      gsap.killTweensOf(d);
      gsap.to(d, { y: d.offsetHeight * 0.24, duration: 0.8, ease: 'power2.in', onComplete: function () {       // sink so only his face peeks over the edge
        setTimeout(function () {
          gsap.to(d, { y: 0, duration: 0.9, ease: 'power2.out', onComplete: function () {
            busy = false; face(hovering ? 'happy' : 'normal');
            gsap.to(d, { y: '-=24', duration: 3.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });                // restore the gentle bob
          } });
        }, 2600);   // hold the sulk a few seconds
      } });
    });
    (function idle(){
      setTimeout(function () {
        if (!busy && !hovering && !creditsRunning) { face('happy'); setTimeout(function () { if (!busy && !hovering && !creditsRunning) face('normal'); }, 1700); }
        idle();
      }, 5000 + Math.random() * 5000);
    })();
  }

  function init(){
    lockScroll();
    // hide the site nav (J logo + Menu) during the opening, fade it in a few seconds later
    try {
      var nav = document.querySelectorAll('.nav-logo-link, .nav-logo, .menu-container, #jj-sc-hud');
      nav.forEach(function (n) { n.style.transition = 'opacity .9s ease'; n.style.opacity = '0'; });
      setTimeout(function () { nav.forEach(function (n) { n.style.opacity = '1'; }); }, 3500);
    } catch (e) {}
    // find your Webflow "Back to Contact" button and keep it hidden until the game (retry: it may render late)
    hideWfBack(); setTimeout(hideWfBack, 800); setTimeout(hideWfBack, 2000);
    wireMenuLinks(); setTimeout(wireMenuLinks, 1200); setTimeout(wireMenuLinks, 3000);   // menu may render lazily; re-wire a couple times
    if (wantCredits) { runCreditsDirect(); return; }                         // arrived via a Credits link (?credits=1) → skip the whole opening, go straight to the credits sequence
    startSong();
    window.addEventListener('keydown', function (e) {                         // Spacebar launches credits (once the scene is up)
      if ((e.code === 'Space' || e.keyCode === 32) && creditsArmed) { e.preventDefault(); launchCredits(); }
    });
    var W = window.innerWidth;
    var T = { wipe:1.3, flyAt:1.8, fly:4.5 };   // wipe = Star Wars reveal time; flyAt = wipe end + 0.5s (dragon enters); fly = crossing time
    var headEl = document.querySelector('.jj-head');
    headEl.style.clipPath = 'none';
    gsap.set('.jj-alien', { opacity:0 });            // headline letters now carry both states

    var chars = [];
    if (typeof SplitType !== 'undefined') {
      var split = new SplitType('.jj-head .jj-inner', { types:'chars' });
      chars = split.chars;
    }

    // Each letter: fix its width (so the alien↔JJ font swap can't reflow the line),
    // start in the ALIEN font dim + hidden, and bob continuously (already floating).
    var bobs = [];
    chars.forEach(function (c) {
      var r = c.getBoundingClientRect();
      c.classList.add('jj-char');
      c.style.display = 'inline-block';
      c.style.width = r.width + 'px';
      c.style.textAlign = 'center';
      c._jjCx = r.left + r.width / 2;                 // letter centre, for dragon-sync
      c.style.fontFamily = "'Joes Journey Hieroglyphics', monospace";
      c.style.color = 'rgba(255,255,255,0.55)';
      gsap.set(c, { opacity:0, y:0 });
      bobs.push(gsap.to(c, { y:'-=10', duration:1.2 + Math.random() * 0.9, repeat:-1, yoyo:true, ease:'sine.inOut', delay:Math.random() * 0.8 }));
    });
    headEl._jjChars = chars;
    headEl._jjBobs = bobs;

    gsap.set('#jj-intro-bg', { opacity:1, scale:1 });           // revealed by the wipe, not a fade
    gsap.set('#jj-dragon', { opacity:0, x:-vw(.72), y:0, rotation:4 });
    gsap.set('#jj-stars', { opacity:0 });                       // fades in after the wipe
    gsap.set('#jj-intro', { '--wp':'0%' });
    gsap.set(['#jj-dark','#jj-story','#jj-philosopher','#jj-rest-dragon'], { opacity:0 });  // story scene, hidden

    var tl = gsap.timeline({ defaults:{ ease:'power2.out' } });
    // Star Wars wipe — black recedes left→right revealing the scene, bright line at the edge
    tl.to('#jj-intro', { '--wp':'100%', duration:T.wipe, ease:'power2.inOut' }, 0)
      .fromTo('#jj-wipe-line', { opacity:0 }, { opacity:1, duration:0.18, ease:'power1.out' }, 0.05)
      .to('#jj-wipe-line', { opacity:0, duration:0.3, ease:'power1.in' }, T.wipe - 0.25);
    // stars fade in just after the wipe — staggered, not all at once
    tl.set('#jj-stars', { opacity:1 }, T.wipe);
    tl.to('#jj-stars .jj-deco', { opacity:1, duration:0.8, ease:'power1.out', stagger:{ each:0.07, from:'random' } }, T.wipe);

    // dragon flight — linear so the reveal can track its x
    tl.set('#jj-dragon', { opacity:1 }, T.flyAt)
      .to('#jj-dragon', { x:vw(.55), duration:T.fly, ease:'none' }, T.flyAt)
      .to('#jj-dragon', { keyframes:{ y:[0,-26,14,-18,0] }, duration:T.fly, ease:'sine.inOut' }, T.flyAt)
      .to('#jj-dragon', { x:vw(.8), opacity:0, duration:0.7, ease:'power1.in' }, T.flyAt + T.fly);

    // dragon-synced reveal: as the dragon's x reaches each letter, convert it alien → Joe's Journey.
    // Each letter fades in (alien) LEAD letters AHEAD of its own conversion, so a run of ~3 grey
    // alien glyphs sits to the right of the white reveal edge — but NOT before the dragon arrives.
    var LEAD = 3;
    var startX = -vw(.72), endX = vw(.55), span = (endX - startX) || 1;
    var seq = chars.map(function (c) {
      var frac = Math.max(0, Math.min(1, (c._jjCx - W / 2 - startX) / span));
      return { c:c, revT: T.flyAt + frac * T.fly };
    });
    seq.sort(function (a, b) { return a.revT - b.revT; });           // left → right
    var lastT = T.flyAt;
    var firstAppear = Math.max(0, seq[0].revT - 0.3);                // first letters surface only as the dragon nears them
    seq.forEach(function (o, i) {
      if (o.revT > lastT) lastT = o.revT;
      var appearT = i >= LEAD ? seq[i - LEAD].revT : firstAppear;   // alien ~3 letters early, never on initial load
      tl.to(o.c, { opacity:1, duration:0.4, ease:'power1.out' }, appearT);                       // comes in (alien)
      tl.call(function () { o.c.style.fontFamily = "'Joes Journey Headline', sans-serif"; o.c.style.color = '#fff'; }, null, o.revT); // → Joe's Journey
      tl.fromTo(o.c, { scale:1 }, { scale:1.16, duration:0.13, yoyo:true, repeat:1, ease:'power2.out' }, o.revT);  // little pop
    });

    // dragon clears the last letter → ALL letters disperse; 7 of them are tagged to return.
    tl.call(function () { pickContact(headEl); floatOut(headEl); }, null, lastT);
    // once they've drifted out a moment, those 7 reverse-float back to centre as "Contact"
    // (normal spacing), keep bobbing, then float-fade out 2.5s after they land.
    tl.call(function () { reformContact(headEl); }, null, lastT + 2.6);
    tl.call(function () { alienizeContact(headEl); }, null, lastT + 6.4);   // alien + pink + ramping float, all as it fades out (1s earlier)

    // ---- story scene: comes in as the letters disperse (darken bg, storybook + characters,
    //      stars wink out). "Contact" stays centred over it and only fades after the dragon lands ----
    var sStart = lastT + 1.2;
    tl.to('#jj-dark', { opacity:0.5, duration:2.6, ease:'power1.inOut' }, sStart);          // 50% black over the swirl
    tl.call(function () { fadeStarsOut(); }, null, sStart);                                  // stars out, staggered
    tl.call(function () { mountBook(); }, null, sStart);                                     // start the page-turn Lottie
    tl.fromTo('#jj-story', { opacity:0, scale:0.94, rotation:-10.6 }, { opacity:0.3, scale:1, rotation:-10.6, duration:2.4, ease:'power2.out' }, sStart + 0.3);  // huge tilted storybook backdrop @30%, centered on the top-left corner (SVG tilt)
    tl.fromTo('#jj-philosopher', { opacity:0, y:46 }, { opacity:1, y:0, duration:1.4, ease:'power2.out', onComplete:setupWizard }, sStart + 0.9);   // bottom-left, peeks up + interactive
    tl.fromTo('#jj-rest-dragon', { opacity:0, y:34, rotation:18 }, { opacity:1, y:0, rotation:18, duration:1.4, ease:'power2.out' }, sStart + 1.2);  // bottom-right, tilted +18deg (head up, looking up)
    tl.call(function () { gsap.to('#jj-rest-dragon', { y:'-=24', duration:3.4, repeat:-1, yoyo:true, ease:'sine.inOut' }); setupDragon(); }, null, sStart + 2.6); // slow float + interactive

    // ---- contact scene: the 5 buttons fade in once "Contact" has gone, then they float
    //      and very slowly orbit a shared ellipse (never overlapping) ----
    tl.call(function () { buildContacts(); }, null, lastT + 6.2);
    tl.to('#jj-contacts', { opacity:1, duration:1.4, ease:'power1.out',
      onComplete:function () { var el = document.getElementById('jj-contacts'); if (el) el.classList.add('on'); startContactOrbit(); creditsArmed = true; } }, lastT + 7.2);
      // (?credits=1 no longer waits for the whole opening — it's handled up front in init() via runCreditsDirect)

    // ---- wizard captions: start 2s after the contacts have entered ----
    tl.call(function () { runCaptions(); }, null, lastT + 10.6);
  }

  /* Wink the stars out one-by-one over a few seconds (not all at once). */
  function fadeStarsOut(){
    var decos = document.querySelectorAll('#jj-stars .jj-deco');
    for (var i = 0; i < decos.length; i++){
      (function (el){
        gsap.to(el, { opacity:0, duration:1.3, delay:Math.random() * 3.2, ease:'power1.in',
          onStart:function(){ el.style.animation = 'none'; } });   // stop its twinkle so the fade reads cleanly
      })(decos[i]);
    }
  }

  /* The real landing-page decorations: Star 16.svg (flash), Moon.svg (glow) and
     Galaxy 10.svg (slow spin) — the exact assets + animations from the homepage. */
  var STAR_SVG   = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a0d67bb5517ed8efe956552_Star%2016.svg';
  var MOON_SVG   = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a0d67bbb86603f359ae1311_289a8c92ed8a9b7dd3efdae788f3d0ae_Moon.svg';
  var GALAXY_SVG = 'https://cdn.prod.website-files.com/69c2e676c74b81c8dcbd3651/6a0d67bbf7e371947907a091_Galaxy%2010.svg';
  function startStars(){
    var wrap = document.getElementById('jj-stars'); if (!wrap) return;
    function rnd(a, b){ return a + Math.random() * (b - a); }
    function place(el, cfg){ ['left','right','top','bottom'].forEach(function(k){ if (cfg[k] !== undefined) el.style[k] = cfg[k]; }); }
    function starPos(){
      var a = 0, l, t;
      do { l = 5 + Math.random() * 85; t = 5 + Math.random() * 80; a++; }
      while (a < 40 && ((l > 30 && l < 70 && t > 35 && t < 60) || (l > 80 && t > 70)));
      return { left: l + '%', top: t + '%' };
    }
    // flashing 4-point stars (matches the landing's 8, scaled up for the full overlay)
    for (var i = 0; i < 14; i++){
      var s = document.createElement('img');
      s.src = STAR_SVG; s.className = 'jj-deco';
      s.style.opacity = '0';                                   // hidden until staggered entrance
      s.style.width = (14 + Math.random() * 22) + 'px';
      s.style.transformOrigin = 'center center';
      place(s, starPos());
      s.style.animation = 'jj-flash ' + (1.8 + Math.random() * 2.5) + 's ease-in-out ' + (Math.random() * 2.5) + 's infinite';
      wrap.appendChild(s);
    }
    // glowing moons
    [ { right:'8%', top:'12%', size:'95px' }, { left:'20%', top:'14%', size:'70px' }, { left:'38%', bottom:'15%', size:'80px' } ]
      .forEach(function (cfg, idx){
        var m = document.createElement('img');
        m.src = MOON_SVG; m.className = 'jj-deco';
        m.style.opacity = '0';                                 // hidden until staggered entrance
        m.style.width = cfg.size; place(m, cfg);
        m.style.animation = 'jj-glow ' + (3.5 + Math.random() * 1.5) + 's ease-in-out ' + (idx * 0.6) + 's infinite';
        wrap.appendChild(m);
      });
    // slow-spinning small galaxies
    [ { left:'8%', bottom:'12%', size:'55px' }, { left:'46%', top:'8%', size:'48px' } ]
      .forEach(function (cfg, idx){
        var g = document.createElement('img');
        g.src = GALAXY_SVG; g.className = 'jj-deco';
        g.style.width = cfg.size; g.style.opacity = '0';       // hidden until staggered entrance
        g.style.transformOrigin = 'center center'; place(g, cfg);
        g.style.animation = (idx % 2 ? 'jj-spin-reverse ' : 'jj-spin ') + (50 + Math.random() * 20) + 's linear infinite';
        wrap.appendChild(g);
      });
  }

  /* Drives the dragon sprite sheet (9x8 grid, 72 frames @ 12fps) via background-position. */
  function playDragon(){
    var sp = document.querySelector('#jj-dragon .jj-dragon-sprite');
    if (!sp) return;
    var FR = 72, COLS = 9, ROWS = 8, FPS = 12, f = 0, last = 0;
    function tick(t){
      if (!last) last = t;
      if (t - last >= 1000 / FPS) {
        last = t;
        sp.style.backgroundPosition = ((f % COLS) / (COLS - 1) * 100) + '% ' + (Math.floor(f / COLS) / (ROWS - 1) * 100) + '%';
        f = (f + 1) % FR;
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---- mount ---- */
  function mount(){
    if (document.getElementById('jj-intro')) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = HTML;
    document.body.appendChild(wrap.firstChild);
    startStars();
    playDragon();
    whenReady(function () { fontsReady.then(init); });   // wait for libs AND fonts before revealing text
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
