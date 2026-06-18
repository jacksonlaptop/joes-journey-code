/* ============================================================================
   Joe's Journey — "Bubble (Expand)" custom cursor  (site-wide)

   A glowing dot + comet trail that expands into a bubble with contextual
   states. Self-contained: injects its own CSS + markup, hides the system
   cursor, and reacts to hovered elements via event DELEGATION (so it also
   works on buttons that are added to the page later, e.g. the contact orbs).

   IN WEBFLOW — Project Settings → Custom Code → Footer Code (loads on EVERY
   page), add ONLY:
     <script src="https://raw.githack.com/jacksonlaptop/joes-journey-code/main/cursor.js?v=1"></script>

   STATE TRIGGERS (add the attribute to any element):
     data-cursor="hover"     → plain expanding bubble (also automatic on <a>/<button>)
     data-cursor="external"  → bubble + ↗  (opens something off-site)
     data-cursor="drag"      → bubble + ••• (draggable / playful object)
     data-cursor="project"   → big bubble + "VIEW PROJECT" (case-study cards)
   ============================================================================ */
(function () {
  if (window.__jjCursor) return;                                   // init once
  window.__jjCursor = true;
  // touch / no-hover devices: leave the native cursor alone
  try { if (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches) return; } catch (e) {}

  var CSS = `
  body{cursor:none;}
  a,button,[data-cursor]{cursor:none;}
  input,textarea,select,[contenteditable="true"]{cursor:auto;}
  .custom-cursor{position:fixed;top:0;left:0;width:14px;height:14px;border-radius:999px;pointer-events:none;z-index:999999;transform:translate(-50%,-50%);background:#fff;border:2px solid #080d18;box-shadow:0 0 0 5px rgba(141,125,255,.28),0 0 22px rgba(141,125,255,.65);transition:width .22s ease,height .22s ease,background .22s ease,border .22s ease,box-shadow .22s ease;}
  .cursor-trail{position:fixed;top:0;left:0;width:44px;height:8px;border-radius:999px;pointer-events:none;z-index:999998;transform:translate(-50%,-50%);opacity:0;background:linear-gradient(90deg,rgba(141,125,255,0),rgba(141,125,255,.32),rgba(255,255,255,.5));filter:blur(6px);transition:opacity .18s ease;}
  .cursor-label{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:8px;font-weight:700;line-height:1;text-align:center;text-transform:uppercase;opacity:0;transition:opacity .14s ease;}
  .custom-cursor.is-hovering{width:58px;height:58px;background:rgba(8,13,24,.45);border:1px solid rgba(255,255,255,.9);box-shadow:0 0 0 1px rgba(141,125,255,.25),0 0 28px rgba(141,125,255,.7);}
  .custom-cursor.is-external .cursor-label{opacity:1;font-size:28px;}
  .custom-cursor.is-external .cursor-label::before{content:"\\2197";}
  .custom-cursor.is-drag .cursor-label{opacity:1;font-size:18px;letter-spacing:3px;}
  .custom-cursor.is-drag .cursor-label::before{content:"\\2022\\2022\\2022";}
  .custom-cursor.is-project{width:96px;height:96px;}
  .custom-cursor.is-project .cursor-label{opacity:1;font-size:10px;line-height:1.1;}
  .custom-cursor.is-project .cursor-label::before{content:"VIEW\\A PROJECT";white-space:pre;}
  @media (hover:none) and (pointer:coarse){.custom-cursor,.cursor-trail{display:none;}body,a,button,[data-cursor]{cursor:auto;}}
  `;
  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  var cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.innerHTML = '<div class="cursor-label"></div>';
  var trail = document.createElement('div');
  trail.className = 'cursor-trail';

  function mount(){ document.body.appendChild(trail); document.body.appendChild(cursor); start(); }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  function start(){
    var mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0, trailX = 0, trailY = 0, lastX = 0, lastY = 0, seen = false;

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX; mouseY = e.clientY;
      if (!seen) { seen = true; cursorX = trailX = lastX = mouseX; cursorY = trailY = lastY = mouseY; }   // jump in, don't fly from the corner
    });

    function tick(){
      cursorX += (mouseX - cursorX) * 0.28; cursorY += (mouseY - cursorY) * 0.28;
      trailX  += (mouseX - trailX)  * 0.16; trailY  += (mouseY - trailY)  * 0.16;
      cursor.style.left = cursorX + 'px'; cursor.style.top = cursorY + 'px';
      trail.style.left = trailX + 'px';  trail.style.top  = trailY + 'px';

      var dx = mouseX - lastX, dy = mouseY - lastY;
      trail.style.opacity = Math.sqrt(dx * dx + dy * dy) > 1 ? '0.45' : '0';   // subtle trail, not too noticeable
      var angle = Math.atan2(dy, dx) * 180 / Math.PI;
      trail.style.transform = 'translate(-50%, -50%) rotate(' + (angle + 180) + 'deg)';
      lastX += (mouseX - lastX) * 0.2; lastY += (mouseY - lastY) * 0.2;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // delegated hover detection — works for elements added after load
    function stateFor(t){
      if (!t || !t.closest) return null;
      var d = t.closest('[data-cursor]');
      if (d) return d.getAttribute('data-cursor') || 'hover';
      if (t.closest('a, button')) return 'hover';
      return null;
    }
    function apply(s){
      cursor.classList.toggle('is-hovering', !!s);
      cursor.classList.toggle('is-external', s === 'external');
      cursor.classList.toggle('is-drag', s === 'drag');
      cursor.classList.toggle('is-project', s === 'project');
    }
    document.addEventListener('mouseover', function (e) { apply(stateFor(e.target)); });
    window.addEventListener('blur', function () { apply(null); });
  }
})();
