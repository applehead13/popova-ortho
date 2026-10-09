/* Правки по просьбе владелицы сайта, добавлено при переносе с Тильды. */
(function(){
  'use strict';
  function ready(fn){
    if(document.readyState === 'complete') setTimeout(fn, 300);
    else window.addEventListener('load', function(){ setTimeout(fn, 300); });
  }
  function debounce(fn, ms){ var t; return function(){ clearTimeout(t); t = setTimeout(fn, ms); }; }

  /* «Кто ведёт лечение»: нижняя линия текста справа от цифр (10+ / 5–50+ / 350+)
     совпадает с нижней гранью цифр. Базовые линии измеряются нулевым
     inline-block внутри каждого текста, разница гасится сдвигом translate
     (transform остаётся за анимациями Тильды). */
  var STATS = ['1785934215350000004','1785934268463000008','1785934370367000013'];
  function baseline(atom){
    var p = document.createElement('span');
    p.setAttribute('data-bl', '');
    p.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline;overflow:hidden';
    atom.appendChild(p);
    var y = p.getBoundingClientRect().bottom;
    atom.removeChild(p);
    return y;
  }
  function alignStats(){
    STATS.forEach(function(id){
      var g = document.querySelector('#rec2743211601 .tn-group[data-group-id="' + id + '"]');
      if(!g) return;
      var atoms = g.querySelectorAll('.tn-atom');
      if(atoms.length < 2) return;
      var numEl = atoms[0].closest('.tn-elem'), txtEl = atoms[1].closest('.tn-elem');
      txtEl.style.removeProperty('translate');
      var d = baseline(atoms[1]) - baseline(atoms[0]);
      if(Math.abs(d) < 0.3) return;
      /* коэффициент пересчёта экранных пикселей в единицы макета (zoom) определяем
         пробным сдвигом, а не расчётом: в разных браузерах zoom считается по-разному */
      txtEl.style.setProperty('translate', '0 ' + (-d) + 'px', 'important');
      var d1 = baseline(atoms[1]) - baseline(atoms[0]);
      var k = (d - d1) / d;
      var s = (isFinite(k) && k > 0.05) ? -d / k : 0;
      txtEl.style.removeProperty('translate');
      if(!s || Math.abs(s) > 40) return;
      /* трёхстрочный текст не поднимаем выше верха цифр (иначе наезжает на фото над ним) */
      var up = (numEl.getBoundingClientRect().top - txtEl.getBoundingClientRect().top) / (k > 0 ? k : 1);
      if(s < up) s = Math.min(0, up);
      txtEl.style.setProperty('translate', '0 ' + s + 'px', 'important');
      var d2 = baseline(atoms[1]) - baseline(atoms[0]);
      if(Math.abs(d2) > Math.max(1, Math.abs(d) * 0.5)) txtEl.style.removeProperty('translate');
    });
  }

  /* Блог: видео в раскрывающейся карточке. Кнопка-плей запускает ролик,
     при сворачивании карточки или уходе вкладки видео ставится на паузу. */
  function initVideo(){
    document.querySelectorAll('.care-video-preview').forEach(function(box){
      var v = box.querySelector('video'), btn = box.querySelector('.care-video-play');
      if(!v || !btn || box.dataset.ready) return;
      box.dataset.ready = '1';
      function start(){ v.controls = true; var pr = v.play(); if(pr && pr.catch) pr.catch(function(){}); }
      btn.addEventListener('click', function(e){ e.stopPropagation(); start(); });
      btn.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); start(); } });
      v.addEventListener('play', function(){ box.classList.add('is-playing'); });
      v.addEventListener('pause', function(){ if(!v.seeking && !v.ended){ box.classList.remove('is-playing'); } });
      v.addEventListener('ended', function(){ box.classList.remove('is-playing'); v.controls = false; });
      var item = box.closest('.acc-item');
      if(item && window.MutationObserver) new MutationObserver(function(){ if(!item.classList.contains('is-open') && !v.paused) v.pause(); }).observe(item, {attributes:true, attributeFilter:['class']});
    });
  }
  ready(initVideo);

  /* Подвал: «Все права защищены» и «Разработка сайта» сдвигаются так, чтобы нижняя
     линия последней строки совпала с нижней линией «врач стоматолог — ортодонт» слева. */
  function alignFooter(){
    var rec = document.getElementById('rec2744027601'); if(!rec) return;
    var role = rec.querySelector('[data-elem-id="1785873517191000007"] .tn-atom');
    var rights = rec.querySelector('[data-elem-id="1785873517192000010"]');
    var dev = rec.querySelector('[data-elem-id="1785873517192000011"]');
    if(!role || !rights || !dev) return;
    var devAtom = dev.querySelector('.tn-atom');
    rights.style.removeProperty('translate'); dev.style.removeProperty('translate');
    var d = baseline(devAtom) - baseline(role);
    if(Math.abs(d) < 0.3) return;
    function set(v){ [rights, dev].forEach(function(e){ e.style.setProperty('translate', '0 ' + v + 'px', 'important'); }); }
    set(-d);
    var d1 = baseline(devAtom) - baseline(role);
    var k = (d - d1) / d;
    var sft = (isFinite(k) && k > 0.05) ? -d / k : 0;
    if(!sft || Math.abs(sft) > 150){ rights.style.removeProperty('translate'); dev.style.removeProperty('translate'); return; }
    set(sft);
  }

  /* «Стоимость», телефон и планшет: цены начинаются на одной линии — по левому краю
     самой длинной цены (блоки не двигаются, сдвигаются только короткие цены вправо/влево). */
  var PRICES = ['1785873124651000010','1785873124651000015','1785873124651000020','1785873124651000025','1785873124652000030','1785873124652000035','1785873124652000040'];
  function alignPrices(){
    var els = PRICES.map(function(id){ return document.querySelector('#rec2743909701 .tn-elem[data-elem-id="' + id + '"]'); }).filter(Boolean);
    els.forEach(function(e){ e.style.removeProperty('translate'); });
    if(window.innerWidth >= 1200 || els.length < 2) return;
    /* ширину берём по самому широкому тексту, а не по рамке элемента */
    var lefts = els.map(function(e){ return e.getBoundingClientRect().left; });
    var target = Math.min.apply(null, lefts);
    var probe = els[lefts.indexOf(Math.max.apply(null, lefts))];
    var dx = target - probe.getBoundingClientRect().left;
    if(Math.abs(dx) < 0.3) return;
    probe.style.setProperty('translate', dx + 'px 0', 'important');
    var k = Math.abs(dx) > 0 ? (probe.getBoundingClientRect().left - (target - dx)) / dx : 1;
    probe.style.removeProperty('translate');
    if(!isFinite(k) || k < 0.05) k = 1;
    els.forEach(function(e, i){
      var d = (target - lefts[i]) / k;
      if(Math.abs(d) > 0.3 && Math.abs(d) < 200) e.style.setProperty('translate', d + 'px 0', 'important');
    });
  }

  /* Стеклянные карточки «жалобы»: текст ответа при наведении того же размера, что и
     текст списка в карточке до наведения (с учётом масштаба блока на экране). */
  function alignSegFont(){
    document.querySelectorAll('.segCard').forEach(function(card){
      var grp = card.querySelector('.segText'), p = card.querySelector('.segOverlay p');
      if(!grp || !p) return;
      var item = null;
      grp.querySelectorAll('.tn-atom').forEach(function(a){ if(!item && a.textContent.trim().length > 12 && parseFloat(getComputedStyle(a).fontSize) < 18) item = a; });
      if(!item) return;
      /* сравниваем размеры уже отрисованного текста (в пикселях экрана), поэтому результат
         не зависит от того, как браузер считает масштаб (zoom/автоскейл) */
      function h(el){ var r = document.createRange(); r.selectNodeContents(el); var q = r.getClientRects()[0]; return q ? q.height : 0; }
      var cur = parseFloat(getComputedStyle(p).fontSize) || 14;
      for(var n = 0; n < 3; n++){
        var hi = h(item), hp = h(p);
        if(!hi || !hp || Math.abs(hi - hp) < 0.3) break;
        cur = cur * hi / hp;
        p.style.setProperty('font-size', cur.toFixed(2) + 'px', 'important');
      }
    });
  }

  /* Перезагрузка и «назад»: страница остаётся на том же месте лендинга. */
  (function(){
    var KEY = 'ypScrollY', nav = null, restoring = true;
    try{ if('scrollRestoration' in history) history.scrollRestoration = 'manual'; }catch(e){}
    try{ var e0 = performance.getEntriesByType('navigation')[0]; nav = e0 && e0.type; }catch(e){}
    var saved = 0;
    try{ saved = (nav === 'reload' || nav === 'back_forward') ? parseFloat(sessionStorage.getItem(KEY)) || 0 : 0; }catch(e){}
    function save(){
      if(restoring) return;
      try{ sessionStorage.setItem(KEY, String(Math.round(window.pageYOffset || document.documentElement.scrollTop || 0))); }catch(e){}
    }
    var tk = null;
    window.addEventListener('scroll', function(){ if(tk) return; tk = setTimeout(function(){ tk = null; save(); }, 150); }, {passive:true});
    window.addEventListener('pagehide', save);
    document.addEventListener('visibilitychange', function(){ if(document.visibilityState === 'hidden') save(); });
    function jump(y){
      if(window.ypLenis && window.ypLenis.scrollTo){ try{ window.ypLenis.scrollTo(y, {immediate:true, force:true}); }catch(e){} }
      window.scrollTo(0, y);
    }
    function finish(){ restoring = false; }
    if(!saved){ window.addEventListener('load', function(){ setTimeout(finish, 800); }); return; }
    /* высоту страницы Тильда и наши скрипты досчитывают после загрузки,
       поэтому возвращаемся несколько раз; ручная прокрутка пользователя отменяет возврат */
    var userMoved = false;
    ['wheel','touchstart','keydown','mousedown'].forEach(function(t){ window.addEventListener(t, function(){ userMoved = true; }, {passive:true, once:true}); });
    function go(){ if(!userMoved) jump(saved); }
    window.addEventListener('load', function(){
      go(); setTimeout(go, 500); setTimeout(go, 1200);
      setTimeout(function(){ go(); finish(); }, 2200);
    });
  })();

  /* «Стоимость» и «Контакты»: верх букв маленького зелёного заголовка лежит на верху букв
     большого серого слова. Пустой воздух в контейнерах не учитывается: верх глифов
     считается по метрикам шрифта (canvas), поэтому не зависит от высоты рамки. */
  var INK_PAIRS = [
    ['#rec2743909701', '1785873124650000004', '1785873124652000041'],
    ['#rec2744027601', '1785873517190000001', '1785873517190000002']
  ];
  function inkTop(rec, id){
    var e = document.querySelector(rec + ' .tn-elem[data-elem-id="' + id + '"]'); if(!e) return null;
    var a = e.querySelector('.tn-atom'); if(!a || !e.offsetWidth) return null;
    var cs = getComputedStyle(a), t = a.textContent.trim();
    if(cs.textTransform === 'uppercase') t = t.toUpperCase();
    var cv = document.createElement('canvas').getContext('2d');
    cv.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    var m = cv.measureText(t);
    if(!m.fontBoundingBoxAscent) return null;
    var dv = (m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2 - m.actualBoundingBoxAscent;
    var r = e.getBoundingClientRect(), k = r.width / e.offsetWidth;
    var rot = /matrix\(0, -1/.test(cs.transform);
    return {el: e, k: k, rot: rot, c: rot ? r.left + r.width / 2 + dv * k : r.top + r.height / 2 + dv * k};
  }
  function alignInk(){
    INK_PAIRS.forEach(function(pr){
      var small = document.querySelector(pr[0] + ' .tn-elem[data-elem-id="' + pr[2] + '"]');
      if(small) small.style.removeProperty('translate');
      var b = inkTop(pr[0], pr[1]), sm = inkTop(pr[0], pr[2]);
      if(!b || !sm || !isFinite(b.c) || !isFinite(sm.c) || !sm.k) return;
      /* если верх большого слова обрезан краем блока, ориентируемся на видимый край */
      var ab = document.querySelector(pr[0] + ' .t396__artboard'), target = b.c;
      if(ab){ var ar = ab.getBoundingClientRect(); target = Math.max(b.c, sm.rot ? ar.left : ar.top); }
      var d = (target - sm.c) / sm.k;
      if(Math.abs(d) < 0.2 || Math.abs(d) > 120) return;
      small.style.setProperty('translate', sm.rot ? d + 'px 0' : '0 ' + d + 'px', 'important');
    });
  }

  /* Зазор от последней карточки «Вопрос-ответ» до разделителя «блог» равен зазору
     от разделителя «блог» до блока с карточками блога. */
  function alignBlogGap(){
    var div = document.getElementById('rec3506208701');
    var acc = document.querySelector('.acc-wrapper');
    var items = document.querySelectorAll('.faqItem');
    if(!div || !acc || !items.length || document.querySelector('.faqItem.faqOpen')) return;
    div.style.removeProperty('margin-top');
    var bottom = 0; items.forEach(function(i){ bottom = Math.max(bottom, i.getBoundingClientRect().bottom); });
    var dr = div.getBoundingClientRect(), ar = acc.getBoundingClientRect();
    /* верх и низ самой надписи разделителя */
    var lab = div.querySelector('.tn-elem');
    var lr = lab ? lab.getBoundingClientRect() : dr;
    var above = lr.top - bottom, below = ar.top - lr.bottom;
    var d = above - below;
    if(d > 2 && d < 400) div.style.setProperty('margin-top', (-d) + 'px', 'important');
  }

  function all(){ alignBlogGap(); alignInk(); alignStats(); alignFooter(); alignPrices(); alignSegFont(); setTimeout(alignSegFont, 1500); setTimeout(alignInk, 2500); setTimeout(alignBlogGap, 2500); }
  ready(all);
  window.addEventListener('resize', debounce(all, 300));
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ setTimeout(all, 200); });
})();
