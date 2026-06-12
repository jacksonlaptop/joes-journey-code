/* ============================================================================
   Joe's Journey — Contact page intro  (hosted via GitHub + jsDelivr)

   IN WEBFLOW (Contact page → Page Settings → Before </body> tag) add ONLY:
     <script src="https://cdn.jsdelivr.net/gh/jacksonlaptop/joes-journey-code@main/contact.js"></script>

   TO UPDATE: edit this file → re-upload contact.js to the repo → purge jsDelivr:
     https://purge.jsdelivr.net/gh/jacksonlaptop/joes-journey-code@main/contact.js

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
#jj-stage{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;}
.jj-copy{display:inline-grid;white-space:nowrap;text-align:center;}
.jj-alien,.jj-head{grid-area:1/1;margin:0;font-size:clamp(20px,4vw,54px);line-height:1.2;letter-spacing:.01em;}
.jj-alien{font-family:'Joes Journey Hieroglyphics',monospace;color:#22384b;}
.jj-head{position:relative;--r:100%;font-family:'Joes Journey Headline',sans-serif;color:#fff;-webkit-text-stroke:1px rgba(0,0,0,.35);paint-order:stroke fill;text-shadow:0 2px 10px rgba(0,0,0,.5);clip-path:inset(0 var(--r) 0 0);}
.jj-head .jj-char{display:inline-block;will-change:transform,opacity;}
#jj-dragon{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:150px;pointer-events:none;}
#jj-dragon svg{display:block;width:100%;height:auto;}`;

  var style = document.createElement('style');
  style.id = 'jj-contact-style';
  style.textContent = CSS;
  document.head.appendChild(style);

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
  <div id="jj-stage"><div class="jj-copy">
    <p class="jj-alien">How would you like to get in touch</p>
    <p class="jj-head"><span class="jj-inner">How would you like to get in touch</span></p>
  </div></div>
  <div id="jj-dragon"><svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 86 C2 96 6 70 28 70 C70 70 92 58 120 60 C150 62 168 60 180 66 C168 78 150 74 122 76 C96 78 70 96 40 92 C28 90 22 80 14 86Z" fill="#F2867F"/>
    <path d="M120 60 C120 44 132 30 150 30 C172 30 186 44 186 64 C186 80 172 90 152 88 C150 70 138 62 120 60Z" fill="#F2867F"/>
    <path d="M120 60 C108 40 112 24 124 16 C120 38 138 46 150 48 C140 56 130 60 120 60Z" fill="#F7B6B1"/>
    <circle cx="160" cy="56" r="7" fill="#fff"/><circle cx="161" cy="56" r="4" fill="#1a0a2a"/>
    <path d="M170 64 q6 5 12 1" stroke="#1a0a2a" stroke-width="2" fill="none" stroke-linecap="round"/>
  </svg></div>
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
    (headEl._jjBobs || []).forEach(function (b) { b.kill(); });   // stop the continuous float
    if (!chars.length) { gsap.to('.jj-copy', { opacity:0, duration:1.8, ease:'power1.out' }); return; }
    headEl.style.clipPath = 'none';
    chars.forEach(function (c) { gsap.set(c, { y:0 }); });        // clear bob residual before measuring
    var hostRect = headEl.getBoundingClientRect();
    var rects = chars.map(function (c) { return c.getBoundingClientRect(); });
    var leftEdge = hostRect.left, width = hostRect.width || 1;
    chars.forEach(function (c, i) {
      var r = rects[i];
      c.style.position = 'absolute';                 // freeze so the alien-font swap can't reflow the line
      c.style.left = (r.left - hostRect.left) + 'px';
      c.style.top  = (r.top  - hostRect.top)  + 'px';
      c.style.margin = '0';
      var rel = ((r.left + r.width / 2) - leftEdge) / width;   // 0 = far left, 1 = far right
      var dx, dy;
      if (rel < 0.34)       { dx = -(700 + Math.random() * 700); dy = (Math.random() - 0.5) * 140; }  // LEFT
      else if (rel > 0.66)  { dx =  (700 + Math.random() * 700); dy = (Math.random() - 0.5) * 140; }  // RIGHT
      else                  { dx = (Math.random() - 0.5) * 140; dy = (Math.random() < 0.5 ? -1 : 1) * (520 + Math.random() * 640); } // MIDDLE up/down
      if (Math.random() < 0.2) c.style.fontFamily = "'Joes Journey Hieroglyphics', monospace"; // ~20% alien
      if (Math.random() < 0.2) c.style.color = '#FF00F5';                                       // ~20% hot pink
      var grow = Math.random() < 0.5;
      var dur = 3.6 + Math.random() * 2.4;           // SLOW (3.6–6.0s)
      var del = rel * 1.5 + Math.random() * 0.15;    // LEFT → RIGHT, not all at once
      gsap.to(c, {
        x: dx, y: dy, rotation: gsap.utils.random(-110, 110),
        scale: grow ? gsap.utils.random(1.6, 2.8) : gsap.utils.random(0.15, 0.5),
        duration: dur, ease: 'power1.out', delay: del
      });
      gsap.to(c, { opacity: 0, duration: dur * 0.6, delay: del + dur * 0.4, ease: 'sine.in' });
    });
  }

  function init(){
    lockScroll();
    var W = window.innerWidth;
    var T = { bgIn:0.7, flyAt:0.2, fly:2.8, holdReveal:0.6 };
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
      c.style.color = 'rgba(255,255,255,0.32)';
      gsap.set(c, { opacity:0, y:0 });
      bobs.push(gsap.to(c, { y:'-=10', duration:1.2 + Math.random() * 0.9, repeat:-1, yoyo:true, ease:'sine.inOut', delay:Math.random() * 0.8 }));
    });
    headEl._jjChars = chars;
    headEl._jjBobs = bobs;

    gsap.set('#jj-intro-bg', { opacity:0, scale:1.04 });
    gsap.set('#jj-dragon', { opacity:0, x:-vw(.72), y:0, rotation:4 });

    var tl = gsap.timeline({ defaults:{ ease:'power2.out' } });
    tl.to('#jj-intro-bg', { opacity:1, scale:1, duration:T.bgIn, ease:'power1.out' }, 0);

    // dragon flight — linear so the reveal can track its x
    tl.set('#jj-dragon', { opacity:1 }, T.flyAt)
      .to('#jj-dragon', { x:vw(.55), duration:T.fly, ease:'none' }, T.flyAt)
      .to('#jj-dragon', { keyframes:{ y:[0,-26,14,-18,0] }, duration:T.fly, ease:'sine.inOut' }, T.flyAt)
      .to('#jj-dragon', { x:vw(.8), opacity:0, duration:0.7, ease:'power1.in' }, T.flyAt + T.fly);

    // dragon-synced reveal: as the dragon's x reaches each letter, convert it alien → Joe's Journey
    var startX = -vw(.72), endX = vw(.55), span = (endX - startX) || 1;
    var lastT = T.flyAt;
    chars.forEach(function (c) {
      var frac = Math.max(0, Math.min(1, (c._jjCx - W / 2 - startX) / span));
      var revT = T.flyAt + frac * T.fly;
      if (revT > lastT) lastT = revT;
      tl.to(c, { opacity:1, duration:0.35, ease:'power1.out' }, Math.max(0, revT - 0.3));                     // comes in (alien, dim)
      tl.call(function () { c.style.fontFamily = "'Joes Journey Headline', sans-serif"; c.style.color = '#fff'; }, null, revT); // → Joe's Journey
      tl.fromTo(c, { scale:1 }, { scale:1.16, duration:0.13, yoyo:true, repeat:1, ease:'power2.out' }, revT);  // little pop
    });

    // after the last letter is converted, disperse left → right
    tl.call(function () { floatOut(headEl); }, null, lastT + T.holdReveal);
  }

  /* ---- mount ---- */
  function mount(){
    if (document.getElementById('jj-intro')) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = HTML;
    document.body.appendChild(wrap.firstChild);
    whenReady(function () { fontsReady.then(init); });   // wait for libs AND fonts before revealing text
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
