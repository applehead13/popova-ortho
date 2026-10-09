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

  function all(){ alignStats(); alignFooter(); }
  ready(all);
  window.addEventListener('resize', debounce(all, 300));
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ setTimeout(all, 200); });
})();
