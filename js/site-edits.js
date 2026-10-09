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
      var k = txtEl.offsetHeight ? txtEl.getBoundingClientRect().height / txtEl.offsetHeight : 1;
      if(Math.abs(d) > 0.3 && isFinite(k) && k > 0) txtEl.style.setProperty('translate', '0 ' + (-d / k) + 'px', 'important');
    });
  }

  function all(){ alignStats(); }
  ready(all);
  window.addEventListener('resize', debounce(all, 300));
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ setTimeout(all, 200); });
})();
