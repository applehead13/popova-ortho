/* Натуральное стекло: положение отражения окружения. Добавлено при переносе с Тильды.
   Оформление и пояснения — в css/glass.css. */
(function(){
  'use strict';
  var SEL = '.glass,.eduGlass,.acc-plus,.care-tab,.care-video-play,.ycs-arrows button,.ypGlass,.igNote,' +
            '#ypHead .bar,#ypDrop .pan,.ypmBtn,#ypmDrop .ypmPan,.segOverlay';
  var els = [], seen = new WeakSet(), visible = new Set(), ticking = false;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;


  /* ---------- положение отражения ---------- */
  function place(el){
    var r = el.getBoundingClientRect();
    var vw = window.innerWidth || 1, vh = window.innerHeight || 1;
    var cx = (r.left + r.width / 2) / vw, cy = (r.top + r.height / 2) / vh;
    /* карта шире элемента в 5 раз: сдвигаем окно просмотра по ней */
    el.style.setProperty('--gx', (8 + cx * 84).toFixed(1) + '%');
    el.style.setProperty('--gy', (8 + cy * 70).toFixed(1) + '%');
  }
  function update(){
    ticking = false;
    visible.forEach(place);
  }
  function request(){ if(!ticking){ ticking = true; requestAnimationFrame(update); } }

  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ visible.add(e.target); place(e.target); }
      else visible.delete(e.target);
    });
  }, {rootMargin:'80px'}) : null;

  function scan(){
    document.querySelectorAll(SEL).forEach(function(el){
      if(seen.has(el)) return;
      seen.add(el); els.push(el);
      if(io) io.observe(el); else { visible.add(el); place(el); }
    });
  }

  function start(){
    scan();
    window.addEventListener('scroll', request, {passive:true});
    window.addEventListener('resize', request);
    /* блоки, которые Тильда или скрипты страницы достраивают позже */
    var mo = new MutationObserver(function(){ clearTimeout(start._t); start._t = setTimeout(scan, 200); });
    mo.observe(document.body, {childList:true, subtree:true});
    setInterval(request, 1000);
  }
  if(document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
