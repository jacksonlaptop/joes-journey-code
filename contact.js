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
.jj-contact{position:absolute;width:min(16.5vw,225px);text-decoration:none;color:#fff;pointer-events:none;}
#jj-contacts.on .jj-contact{pointer-events:auto;cursor:pointer;}
.jj-c-icon{position:relative;width:100%;height:min(16.5vw,225px);display:flex;align-items:center;justify-content:center;transition:transform .3s ease;will-change:transform;}
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
.jj-contact:hover .jj-c-label{transform:translateX(-50%) translateY(-22px);}                         /* clear the grown icon */
.jj-contact:hover .jj-c-detail{transform:translateX(-50%) translateY(22px);}
.jj-contact[data-key="credits"]:hover .jj-c-label{transform:translateX(-50%) translateY(-40px);}     /* credits grows more (1.42) */
.jj-contact[data-key="credits"]:hover .jj-c-detail{transform:translateX(-50%) translateY(40px);}
#jj-caption{position:absolute;left:16vw;top:78vh;width:min(56vw,820px);text-align:left;white-space:pre-line;font-family:'Joes Journey Headline',sans-serif;font-size:clamp(16px,1.85vw,28px);line-height:1.32;color:#fff;opacity:0;z-index:8;pointer-events:none;}
#jj-toast{position:absolute;left:48%;top:43%;transform:translate(-50%,-50%) scale(0.92);display:flex;align-items:center;gap:26px;opacity:0;pointer-events:none;z-index:40;transition:opacity .22s ease,transform .22s ease;}
#jj-toast.show{opacity:1;transform:translate(-50%,-50%) scale(1);}
.jj-toast-head,.jj-toast-box{height:clamp(48px,4.2vw,66px);box-sizing:border-box;background:#e0e0de;border:3px solid #616068;border-radius:8px;box-shadow:0 0 0 5px #fbdd65,0 0 0 9px #2e2f31,0 0 30px rgba(251,221,101,.35);}
.jj-toast-head{flex:none;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;padding:6px;}
.jj-toast-head img{max-width:100%;max-height:100%;object-fit:contain;display:block;}
.jj-toast-box{display:flex;align-items:center;padding:0 26px;font-family:'Joes Journey Headline',sans-serif;font-size:clamp(15px,1.5vw,23px);color:#2e2f31;white-space:nowrap;}
#jj-spacebar{position:absolute;left:50%;bottom:2.5vh;width:min(8vw,120px);margin-left:calc(min(8vw,120px) * -0.5);height:auto;opacity:0;z-index:8;pointer-events:auto;will-change:transform;}
#jj-wipe{position:absolute;inset:0;background:#04060d;clip-path:inset(0 0 0 var(--wp,0%));z-index:60;pointer-events:none;}
#jj-wipe-line{position:absolute;top:0;bottom:0;left:var(--wp,0%);width:2px;margin-left:-1px;background:linear-gradient(to bottom,transparent,rgba(205,228,255,.95) 50%,transparent);box-shadow:0 0 34px 9px rgba(150,190,255,.5);opacity:0;z-index:61;pointer-events:none;}
#jj-stage{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;}
.jj-copy{display:inline-grid;white-space:nowrap;text-align:center;}
.jj-alien,.jj-head{grid-area:1/1;margin:0;font-size:clamp(20px,4vw,54px);line-height:1.2;letter-spacing:.01em;}
.jj-alien{font-family:'Joes Journey Hieroglyphics',monospace;color:#22384b;}
.jj-head{position:relative;--r:100%;font-family:'Joes Journey Headline',sans-serif;color:#fff;-webkit-text-stroke:1px rgba(0,0,0,.35);paint-order:stroke fill;text-shadow:0 2px 10px rgba(0,0,0,.5);clip-path:inset(0 var(--r) 0 0);}
.jj-head .jj-char{display:inline-block;will-change:transform,opacity;}
#jj-dragon{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:300px;height:155px;pointer-events:none;}
#jj-dragon .jj-dragon-sprite{width:100%;height:100%;background-image:url('https://raw.githack.com/jacksonlaptop/joes-journey-code/main/dragon-sprite.png');background-repeat:no-repeat;background-size:900% 800%;}`;

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
  <div id="jj-wipe"></div><div id="jj-wipe-line"></div>
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
    { key:'phone',    label:'Phone',    dgap:17,  def:ICN+'icon-phone.png',    fill:ICN+'icon-phone-fill.png',    detail:'+44 7565 040886',                       act:'copy', copy:'+447565040886' },
    { key:'linkedin', label:'LinkedIn', dgap:25,  def:ICN+'icon-linkedin.png', fill:ICN+'icon-linkedin-fill.png', detail:'www.linkedin.com/in/joseph-jackson-ui/', act:'copy', copy:'https://www.linkedin.com/in/joseph-jackson-ui/' },
    { key:'credits',  label:'Credits',  dgap:10,  def:ICN+'icon-credits.png',  fill:ICN+'icon-credits-fill.png',  detail:'VIEW',                                  act:'view',     href:'#credits' },
    { key:'mail',     label:'Mail',     dgap:-8,  def:ICN+'icon-mail.png',     fill:ICN+'icon-mail-fill.png',     detail:'jackson.laptop95@gmail.com',            act:'copy', copy:'jackson.laptop95@gmail.com' },
    { key:'cv',       label:'CV',       dgap:0,   def:ICN+'icon-cv.png',       fill:ICN+'icon-cv-fill.png',       detail:'DOWNLOAD',                              act:'download', href:'#cv' }
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
  function buildContacts(){
    var wrap = document.getElementById('jj-contacts'); if (!wrap || wrap.children.length) return;
    CONTACTS.forEach(function (c) {
      var a = document.createElement('a');
      a.className = 'jj-contact'; a.href = c.href || '#'; a.setAttribute('data-key', c.key);
      var p = ellipsePos(ANG[c.key]); a.style.left = p.x + '%'; a.style.top = p.y + '%';
      var labelIco = c.act === 'copy' ? ICO.copy : '';
      var detailIco = c.act === 'download' ? ICO.download : (c.act === 'view' ? ICO.arrow : '');
      a.innerHTML =
        '<span class="jj-c-label">' + c.label + labelIco + '</span>' +
        '<span class="jj-c-icon"><span class="jj-c-glow"></span>' +
          '<img class="jj-c-def"  src="' + c.def  + '" alt="' + c.label + '">' +
          '<img class="jj-c-fill" src="' + c.fill + '" alt="" aria-hidden="true">' +
        '</span>' +
        '<span class="jj-c-detail">' + c.detail + detailIco + '</span>';
      var g2 = c.dgap || 0;                                                              // pull title + value close to the visible art (CV is the baseline)
      a.querySelector('.jj-c-detail').style.top = 'calc(100% + ' + (2 + g2) + 'px)';
      a.querySelector('.jj-c-label').style.bottom = 'calc(100% + ' + (4 + g2) + 'px)';
      a.addEventListener('click', function (e) {
        e.preventDefault();
        if (c.act === 'copy') {
          copyToClipboard(c.copy).then(function () {
            showToast(c.key === 'linkedin' ? 'Copied to clipboard!' : c.copy + '  copied to clipboard!');   // phone/mail show the value, linkedin doesn't
          });
        }
        else if (c.act === 'view') { launchCredits(); }       // Credits = same as pressing Space
        /* else c.act === 'download' (CV): parked until the file URL is ready */
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
    happy:  IC + '6a326b682510ef80bdc333ec_Wizard%20-%20very%20happy.svg'
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
    w.addEventListener('mouseenter', function () { hovering = true; if (!busy) applyWizard('happy'); });
    w.addEventListener('mouseleave', function () { hovering = false; if (!busy) applyWizard(wizState); });
    w.addEventListener('click', function () {
      if (busy) return; busy = true;
      applyWizard('sad'); gsap.killTweensOf(w);
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

  /* Credits "VIEW" and the Spacebar both launch the credits experience. */
  var creditsArmed = false;
  function launchCredits(){
    if (window.jjIntro && window.jjIntro.unlock) window.jjIntro.unlock();
    /* TODO: hook the real credits / horizontal mini-game here */
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
    d.addEventListener('mouseenter', function () { hovering = true; if (!busy) face('happy'); });
    d.addEventListener('mouseleave', function () { hovering = false; if (!busy) face('normal'); });
    d.addEventListener('click', function () {
      if (busy) return; busy = true;
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
        if (!busy && !hovering) { face('happy'); setTimeout(function () { if (!busy && !hovering) face('normal'); }, 1700); }
        idle();
      }, 5000 + Math.random() * 5000);
    })();
  }

  function init(){
    lockScroll();
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
    tl.call(function () { alienizeContact(headEl); }, null, lastT + 7.4);   // alien + pink + ramping float, all as it fades out

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
    tl.call(function () { buildContacts(); }, null, lastT + 7.2);
    tl.to('#jj-contacts', { opacity:1, duration:1.4, ease:'power1.out',
      onComplete:function () { var el = document.getElementById('jj-contacts'); if (el) el.classList.add('on'); startContactOrbit(); creditsArmed = true; } }, lastT + 8.2);

    // ---- wizard captions: start 2s after the contacts have entered ----
    tl.call(function () { runCaptions(); }, null, lastT + 11.6);
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
