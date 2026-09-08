import fs from 'node:fs';
import path from 'node:path';

const out = path.resolve('experiments/companion-alien-assets/svg');
fs.mkdirSync(out, { recursive: true });
for (const file of fs.readdirSync(out)) {
  if (file.endsWith('.svg')) fs.unlinkSync(path.join(out, file));
}
const svg = (s, w=1024, h=1024) => '<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'">'+s+'</svg>';
const save = (n,s,w=1024,h=1024) => fs.writeFileSync(path.join(out,n+'.svg'),svg(s,w,h));

const palettes = {
  blue:{body:'#C4E7F3',rear:'#A8D5E5',line:'#78B5CC'},
  mint:{body:'#B8E9D5',rear:'#9ED8C1',line:'#69B89B'},
  coral:{body:'#FFA093',rear:'#ED897D',line:'#D96961'},
  violet:{body:'#CCB9F5',rear:'#B19CE3',line:'#8F77C9'},
  yellow:{body:'#FFDB7C',rear:'#EDC662',line:'#D7A93B'}
};

function body(p=palettes.blue){
  return '<path d="M352 300L320 245" stroke="'+p.body+'" stroke-width="28" stroke-linecap="round"/>'+
    '<path d="M676 295L706 230" stroke="'+p.body+'" stroke-width="28" stroke-linecap="round"/>'+
    '<ellipse cx="420" cy="858" rx="58" ry="30" fill="'+p.body+'" stroke="'+p.line+'" stroke-width="4"/>'+
    '<ellipse cx="620" cy="858" rx="58" ry="30" fill="'+p.body+'" stroke="'+p.line+'" stroke-width="4"/>'+
    '<ellipse cx="212" cy="682" rx="43" ry="51" fill="'+p.rear+'" stroke="'+p.line+'" stroke-width="4"/>'+
    '<path d="M202 588C202 415 338 290 512 290C681 290 822 412 822 586C822 757 692 860 512 860C333 860 202 757 202 588Z" fill="'+p.body+'"/>'+
    '<ellipse cx="820" cy="680" rx="43" ry="55" fill="'+p.body+'" stroke="'+p.line+'" stroke-width="4"/>'+
    '<circle cx="309" cy="226" r="40" fill="'+p.body+'" stroke="'+p.line+'" stroke-width="4"/>'+
    '<circle cx="724" cy="212" r="40" fill="'+p.body+'" stroke="'+p.line+'" stroke-width="4"/>';
}

const whites='<ellipse cx="590" cy="520" rx="82" ry="87" fill="#fff"/><ellipse cx="718" cy="526" rx="61" ry="76" fill="#fff"/>';
const pupils='<ellipse cx="621" cy="529" rx="38" ry="48" fill="#070B12"/><ellipse cx="741" cy="531" rx="29" ry="40" fill="#070B12"/><ellipse cx="607" cy="508" rx="10" ry="15" fill="#fff"/><ellipse cx="731" cy="514" rx="8" ry="12" fill="#fff"/>';
const lid=(a='M525 525Q590 585 655 525',b='M671 528Q718 570 765 528')=>'<path d="'+a+'" fill="none" stroke="#213748" stroke-width="11" stroke-linecap="round"/><path d="'+b+'" fill="none" stroke="#213748" stroke-width="11" stroke-linecap="round"/>';
const scar='<path d="M532 430L558 469L538 497L565 532L545 568L571 608" fill="none" stroke="#6F93A5" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>';
const eyes={
  'eyes-neutral-open':whites+pupils,
  'eyes-neutral-closed':lid(),
  'eyes-angry-open':whites+pupils+'<path d="M520 456L647 486M672 486L764 456" stroke="#213748" stroke-width="13" stroke-linecap="round"/>',
  'eyes-angry-closed':lid('M525 548Q588 505 650 535','M674 535Q720 505 765 548'),
  'eyes-concerned-open':whites+pupils+'<path d="M524 472Q585 438 643 471M674 472Q719 442 762 470" fill="none" stroke="#557688" stroke-width="11" stroke-linecap="round"/>',
  'eyes-concerned-closed':lid('M526 548Q588 520 650 548','M674 548Q719 522 764 548'),
  'eyes-happy-open':'<path d="M525 535Q590 472 653 535M675 537Q719 488 763 537" fill="none" stroke="#213748" stroke-width="13" stroke-linecap="round"/>',
  'eyes-happy-closed':'<path d="M526 532Q590 490 652 532M676 534Q719 500 762 534" fill="none" stroke="#213748" stroke-width="14" stroke-linecap="round"/>',
  'eyes-surprised-open':'<ellipse cx="590" cy="520" rx="87" ry="94" fill="#fff"/><ellipse cx="718" cy="526" rx="66" ry="84" fill="#fff"/><ellipse cx="623" cy="531" rx="29" ry="37" fill="#070B12"/><ellipse cx="744" cy="534" rx="23" ry="32" fill="#070B12"/><circle cx="614" cy="520" r="8" fill="#fff"/><circle cx="737" cy="523" r="7" fill="#fff"/>',
  'eyes-surprised-closed':lid('M520 530Q590 595 660 530','M668 533Q718 580 768 533'),
  'eyes-scar-open':whites+pupils+scar,
  'eyes-scar-closed':lid()+scar
};

const mouths={
  'mouth-smile':'<path d="M628 650Q666 684 704 649" fill="none" stroke="#101923" stroke-width="10" stroke-linecap="round"/>',
  'mouth-frown':'<path d="M630 680Q666 646 702 681" fill="none" stroke="#101923" stroke-width="10" stroke-linecap="round"/>',
  'mouth-o':'<ellipse cx="668" cy="666" rx="24" ry="32" fill="#15232E"/>',
  'mouth-grin':'<path d="M616 646Q666 706 716 645Q668 730 616 646Z" fill="#15232E"/><path d="M631 660Q666 683 701 659" fill="#fff"/>',
  'mouth-flat':'<path d="M631 667H703" stroke="#101923" stroke-width="10" stroke-linecap="round"/>',
  'mouth-cigar':'<path d="M628 656Q666 681 700 651" fill="none" stroke="#101923" stroke-width="10" stroke-linecap="round"/><g transform="rotate(-9 733 655)"><rect x="685" y="644" width="122" height="25" rx="12" fill="#9D5B32"/><rect x="779" y="644" width="28" height="25" rx="6" fill="#D9A04E"/><path d="M704 644V669" stroke="#6F351F" stroke-width="5"/><ellipse cx="807" cy="656" rx="8" ry="11" fill="#6E7781"/></g>'
};

const eyewear={
  'eyewear-monocle':'<circle cx="718" cy="526" r="72" fill="none" stroke="#D8B34A" stroke-width="12"/><circle cx="718" cy="526" r="59" fill="#DDF7FF" opacity=".18"/><path d="M764 581Q794 635 777 706" fill="none" stroke="#D8B34A" stroke-width="8" stroke-linecap="round"/><circle cx="777" cy="712" r="10" fill="#D8B34A"/>',
  'eyewear-sunglasses':'<path d="M502 488Q590 466 664 494L655 560Q590 591 525 558Z" fill="#121A28"/><path d="M665 495Q720 477 773 500L767 555Q719 579 674 556Z" fill="#121A28"/><path d="M657 513Q665 507 676 514M498 501L474 491" fill="none" stroke="#121A28" stroke-width="15" stroke-linecap="round"/><path d="M531 501L622 485M685 502L746 490" stroke="#6EDFF6" stroke-width="9" stroke-linecap="round" opacity=".8"/>',
  'eyewear-eyepatch':'<path d="M515 463Q589 438 657 485L649 557Q587 591 520 550Z" fill="#1B2431"/><path d="M505 482Q630 417 780 468" fill="none" stroke="#1B2431" stroke-width="15" stroke-linecap="round"/>'
};

const hats={
  'hat-wizard':'<path d="M344 361Q405 208 478 104Q548 138 596 226Q654 307 744 250Q731 327 641 360Z" fill="#102F70"/><path d="M478 104Q565 145 596 226Q654 307 744 250Q720 307 650 329Z" fill="#173D85"/><path d="M316 362Q520 318 736 354Q705 413 350 416Q308 401 316 362Z" fill="#123474"/><path d="M316 378Q518 343 726 369" fill="none" stroke="#F7BE34" stroke-width="16"/><path d="M467 224A34 34 0 1 0 501 180A27 27 0 1 1 467 224Z" fill="#FFC63D"/><path d="M605 282L615 302L638 306L621 322L625 344L605 334L585 344L589 322L572 306L595 302Z" fill="#FFC63D"/>'
};
const hairColours={brown:'#713D25',black:'#202A38',blue:'#1683C7'};
const hair={};
for (const [colourName, colour] of Object.entries(hairColours)) {
  hair['hair-messy-'+colourName]='<path d="M345 378Q356 314 411 324Q434 267 483 309Q511 247 557 310Q590 249 625 314Q680 277 737 343Q704 337 678 370Q622 340 590 382Q535 334 494 379Q424 338 345 378Z" fill="'+colour+'"/><path d="M608 319Q666 295 731 344Q700 372 655 379Z" fill="'+colour+'"/>';
  hair['hair-mohawk-'+colourName]='<path d="M400 347Q420 292 468 305Q480 222 525 284Q552 190 590 280Q634 214 651 307Q702 276 730 342Q649 316 590 348Q502 318 400 347Z" fill="'+colour+'"/><path d="M385 362Q544 325 728 354L706 391Q548 362 400 398Z" fill="'+colour+'" opacity=".88"/>';
  hair['hair-shaved-sides-'+colourName]='<path d="M366 365Q405 276 512 278Q644 268 727 352Q663 326 614 348Q530 308 448 346Q407 331 366 365Z" fill="'+colour+'"/><path d="M360 374Q383 347 419 346L403 414Q370 420 347 400Z" fill="'+colour+'" opacity=".58"/><path d="M690 340Q729 341 749 370L739 418Q710 410 688 390Z" fill="'+colour+'" opacity=".58"/>';
}

const headfull={
  'headfull-knight-helmet':'<path d="M289 584Q257 378 407 278Q568 171 751 310L724 382Q580 284 414 365L363 592Z" fill="#D7DBDE" stroke="#A4AAAE" stroke-width="10"/><path d="M353 380Q534 253 750 327L728 397Q548 329 372 433Z" fill="#BFC5C9" stroke="#999FA4" stroke-width="8"/><path d="M386 347L410 408M458 309L477 379M535 285L547 356M613 283L618 350M687 300L686 369" stroke="#50575C" stroke-width="16" stroke-linecap="round"/><path d="M291 493Q340 446 395 477L403 622Q381 673 340 704Q294 681 274 630Z" fill="#C5CACD" stroke="#999FA4" stroke-width="9"/><path d="M747 337Q791 363 805 408L781 614Q766 655 733 680L715 635L731 406Z" fill="#C5CACD" stroke="#999FA4" stroke-width="9"/><circle cx="310" cy="526" r="47" fill="#BFC5C9" stroke="#91989D" stroke-width="9"/><circle cx="310" cy="526" r="20" fill="#777F84"/><path d="M296 359Q514 190 773 309" fill="none" stroke="#EEF1F3" stroke-width="14" stroke-linecap="round"/>',
  'headfull-space-helmet':'<path d="M303 727Q229 602 263 440Q298 270 478 214Q674 155 820 292Q914 380 900 552Q893 676 792 762Q561 835 303 727Z" fill="#DFF7FC" opacity=".17" stroke="#D8E1E6" stroke-width="18"/><path d="M281 454Q277 313 407 244Q319 332 313 472Z" fill="#F4F6F7" opacity=".78"/><path d="M309 732Q530 806 789 747L760 826Q531 886 326 816Z" fill="#E6E9EB" stroke="#A8B0B5" stroke-width="10"/><path d="M342 786Q535 840 739 788" fill="none" stroke="#8EDFF0" stroke-width="15"/><ellipse cx="288" cy="552" rx="55" ry="73" fill="#D4D9DC" stroke="#9EA6AB" stroke-width="10"/><ellipse cx="288" cy="552" rx="26" ry="38" fill="#7C8993"/><path d="M760 292Q862 375 866 522" fill="none" stroke="#FFFFFF" stroke-width="16" opacity=".82" stroke-linecap="round"/>'
};

const back={
  'back-cape':'<path d="M420 422Q330 393 276 444Q240 519 214 617L160 874Q298 811 466 854Q557 872 641 847Q561 720 575 566Q568 469 498 427Z" fill="#164F9B"/><path d="M414 427Q325 417 287 458Q245 595 189 844" fill="none" stroke="#F1BC32" stroke-width="18"/><path d="M181 855Q318 801 468 843Q550 858 619 838" fill="none" stroke="#F1BC32" stroke-width="17"/>',
  'back-cape-wizard':'<path d="M425 421Q327 393 267 448Q229 543 202 657L154 885Q307 809 467 858Q552 878 629 847Q557 727 573 566Q564 468 497 426Z" fill="#263E78"/><path d="M214 786L228 814L260 819L237 841L242 873L214 858L185 873L191 841L168 819L200 814Z" fill="#FFC63D"/><path d="M335 564A29 29 0 1 0 365 526A23 23 0 1 1 335 564Z" fill="#FFC63D"/><circle cx="447" cy="768" r="14" fill="#FFC63D"/>',
  'back-jetpack':'<path d="M171 505Q195 468 244 474H310V770H230Q178 770 165 724Z" fill="#566A82" stroke="#394B62" stroke-width="10"/><rect x="189" y="528" width="93" height="164" rx="30" fill="#6DD9EE"/><path d="M192 690H282L302 777H172Z" fill="#3F526A"/><path d="M183 766L151 846H230L235 766ZM250 766L241 846H320L302 766Z" fill="#B77A2D" stroke="#8B5C25" stroke-width="8"/><circle cx="236" cy="512" r="21" fill="#FFC83D"/><path d="M278 551H328M278 648H328" stroke="#FFD45D" stroke-width="14" stroke-linecap="round"/>'
};

const hands={
  'hand-sword':'<path d="M820 682L929 526" stroke="#69422B" stroke-width="31" stroke-linecap="round"/><path d="M884 558L940 598" stroke="#E8AF2E" stroke-width="22" stroke-linecap="round"/><path d="M928 542L979 426L982 382L949 414L894 526Z" fill="#E2E6E9" stroke="#AAB0B5" stroke-width="7"/><path d="M949 414L979 426L928 542" fill="#C7CDD1"/>',
  'hand-paintbrush':'<path d="M816 679L936 486" stroke="#9A5D35" stroke-width="24" stroke-linecap="round"/><path d="M916 516Q952 457 981 443Q983 484 951 530Z" fill="#FF4FBF"/><path d="M912 522L948 543" stroke="#C9D3DD" stroke-width="25"/>',
  'hand-staff':'<path d="M820 696L901 382" stroke="#243B72" stroke-width="32" stroke-linecap="round"/><path d="M842 605L875 614M857 546L888 554M874 479L903 486" stroke="#F0B936" stroke-width="13" stroke-linecap="round"/><circle cx="919" cy="296" r="74" fill="#F3C343" stroke="#9B6C20" stroke-width="10"/><path d="M919 192L934 238L966 202L965 252L995 232L979 273L1008 279L982 299L1005 326L975 326L989 374L954 343L947 393L919 350L892 393L882 343L843 374L860 326L811 326L851 299L807 279L854 273L829 232L873 252L872 202L904 238Z" fill="#F8D779" stroke="#9B6C20" stroke-width="7" stroke-linejoin="round"/><circle cx="919" cy="296" r="50" fill="#173E83"/><path d="M919 248L949 274L941 316L919 346L893 315L889 274Z" fill="#72E5F5" stroke="#FFFFFF" stroke-width="8"/><circle cx="905" cy="276" r="10" fill="#FFFFFF" opacity=".75"/>'
};
const offhand={
  'offhand-shield':'<path d="M166 574Q226 532 289 570L307 706Q270 780 220 806Q174 765 151 698Z" fill="#174D88" stroke="#E9B23B" stroke-width="16"/><path d="M217 601H272M261 600V696Q261 742 225 752Q197 757 194 730Q192 706 215 699Q238 693 246 712Q250 728 236 738" fill="none" stroke="#E9B23B" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>'
};
const orbit={
  'orbit-mars':'<circle cx="854" cy="414" r="84" fill="#EE5730"/><path d="M780 394Q838 363 923 388M787 445Q851 414 927 448" fill="none" stroke="#A92F28" stroke-width="25"/><circle cx="891" cy="374" r="22" fill="#A92F28" stroke="#FF7844" stroke-width="9"/>',
  'orbit-jupiter':'<circle cx="854" cy="414" r="88" fill="#F28B43"/><path d="M780 367Q850 392 930 365M770 407Q850 432 938 402M779 451Q850 479 930 446" fill="none" stroke="#FFE0A2" stroke-width="22"/><path d="M832 458Q864 431 895 458Q868 484 832 458Z" fill="#D8532D"/>'
};

const groups=[eyes,mouths,eyewear,hats,hair,headfull,back,hands,offhand,orbit];
Object.entries(palettes).forEach(([n,p])=>save(n==='blue'?'body':'body-'+n,body(p)));
groups.forEach(g=>Object.entries(g).forEach(([n,s])=>save(n,s)));

const knight=back['back-cape']+body()+eyes['eyes-neutral-open']+mouths['mouth-smile']+headfull['headfull-knight-helmet']+hands['hand-sword']+offhand['offhand-shield'];
const space=back['back-jetpack']+body(palettes.mint)+eyes['eyes-surprised-open']+mouths['mouth-smile']+headfull['headfull-space-helmet']+orbit['orbit-jupiter'];
const wizard=back['back-cape-wizard']+body(palettes.violet)+eyes['eyes-happy-open']+mouths['mouth-grin']+eyewear['eyewear-monocle']+hats['hat-wizard']+hands['hand-staff'];
const hairMessy=body()+eyes['eyes-neutral-open']+mouths['mouth-smile']+hair['hair-messy-brown'];
const hairMohawk=body(palettes.mint)+eyes['eyes-neutral-open']+mouths['mouth-smile']+hair['hair-mohawk-blue'];
const hairShaved=body(palettes.coral)+eyes['eyes-neutral-open']+mouths['mouth-smile']+hair['hair-shaved-sides-black'];
save('preview-knight',knight);
save('preview-space',space);
save('preview-wizard',wizard);
save('preview-all-sets','<g transform="translate(0 330) scale(.31)">'+knight+'</g><g transform="translate(350 330) scale(.31)">'+space+'</g><g transform="translate(700 330) scale(.31)">'+wizard+'</g>');
save('preview-hair-styles','<g transform="translate(0 330) scale(.31)">'+hairMessy+'</g><g transform="translate(350 330) scale(.31)">'+hairMohawk+'</g><g transform="translate(700 330) scale(.31)">'+hairShaved+'</g>');
console.log('Generated '+fs.readdirSync(out).filter(f=>f.endsWith('.svg')).length+' SVG masters');
