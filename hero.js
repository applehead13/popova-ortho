/* Первый экран в высоту окна. Добавлено при переносе с Тильды.

   ПК и горизонтальный планшет: карточки фото и текста стоят рядом
   и растягиваются ровно на высоту окна; заголовок встаёт посередине
   свободного места, кнопки и всё, что ниже, сдвигаются вместе.

   Телефон и вертикальный планшет: одна карточка в высоту окна,
   сверху фото (имя, город, телефон и меню на нём), снизу серый фон
   с заголовком и кнопками.

   Позиции пишутся отдельным <style> с !important поверх правил
   Zero Block, сами элементы, тексты и картинки не меняются. */
/* Первый экран в высоту окна. Добавлено при переносе с Тильды.

   ПК и горизонтальный планшет: карточки фото и текста стоят рядом
   и растягиваются ровно на высоту окна; заголовок встаёт посередине
   свободного места, всё, что ниже (карточки жалоб), сдвигается вместе.

   Телефон и вертикальный планшет: одна карточка в высоту окна,
   сверху фото (меню и логотип на нём), снизу серый фон с заголовком.
   На телефоне блок «имя / врач / город» стоит у нижнего края фото справа.

   Все размеры считаются в единицах Zero Block (из computed-стилей,
   не из getBoundingClientRect: на нём лежат transform анимации появления).
   Позиции пишутся отдельным <style> с !important поверх правил
   Zero Block, сами элементы, тексты и картинки не меняются. */
(function(){
  var REC = '#rec2720256801';
  var CREAM = '#F1ECDE';

  var SHAPE = '1785832076437000022', PHOTO = '1786520484116';
  var NAME = '1785836064625000001', CITY = '1786280702538000016',
      TITLE = '1785833033370000006', BURGER = '1786384596163';
  var MENU = ['1785832076437000023','1786290076184000001','1785832076437000024',
    '1786280677703000015','1788344216059000007','1785832076438000026',
    '1785832076438000027','1788344145746000004','1785832076438000028'];
  var MENU_STARS = ['1786290112194000001','1785840126454000005','1785923212552000001',
    '1785923225864000003','1788344216059000008','1785923230633000005',
    '1785923234177000007','1788344145746000005','1785923238481000009'];
  var TITLE_SET = [TITLE,'1785832076438000031','1785832076438000033','1785832076438000034'];

  var lastKey = '', ab, rules = {}, sheet;

  function byId(x){ return ab.querySelector('[data-elem-id="'+x+'"],[data-group-id="'+x+'"]'); }
  function kids(){
    return Array.prototype.filter.call(ab.children, function(el){
      return el.classList.contains('t396__elem') || el.classList.contains('tn-group');
    });
  }
  function id(el){ return el.getAttribute('data-elem-id') || el.getAttribute('data-group-id'); }
  function zoom(el){ return parseFloat(el.style.zoom || getComputedStyle(el).zoom) || 1; }
  function num(el, p){ return parseFloat(getComputedStyle(el)[p]) || 0; }
  function T(el){ return num(el, 'top'); }
  function L(el){ return num(el, 'left'); }
  function H(el){ return num(el, 'height'); }
  function W(el){ return num(el, 'width'); }

  function sel(el){
    if(typeof el === 'string') return el;
    if(el.getAttribute('data-elem-id')) return REC + ' .tn-elem[data-elem-id="' + el.getAttribute('data-elem-id') + '"]';
    if(el.getAttribute('data-group-id')) return REC + ' .tn-group[data-group-id="' + el.getAttribute('data-group-id') + '"]';
    if(el.classList.contains('t396__carrier')) return REC + ' .t396__carrier';
    if(el.classList.contains('t396__filter')) return REC + ' .t396__filter';
    return REC + ' .t396__artboard';
  }
  function set(el, prop, val){ var k = sel(el); (rules[k] = rules[k] || {})[prop] = val; }
  function flush(){
    if(!sheet){ sheet = document.createElement('style'); document.head.appendChild(sheet); }
    sheet.textContent = Object.keys(rules).map(function(k){
      return k + '{' + Object.keys(rules[k]).map(function(p){
        return p + ':' + rules[k][p] + ' !important';
      }).join(';') + '}';
    }).join('\n');
  }
  function moveTo(el, u){ set(el, 'top', u + 'px'); }
  function top1(ids){ return ids.map(byId).filter(function(el){ return el && el.parentElement === ab; }); }
  /* поднять набор элементов так, чтобы верх самого верхнего стал targetU */
  function shiftSet(ids, targetU){
    var list = top1(ids), min = Math.min.apply(null, list.map(T));
    list.forEach(function(el){ moveTo(el, T(el) - min + targetU); });
  }
  function shiftX(ids, dxU){
    top1(ids).forEach(function(el){ set(el, 'left', (L(el) + dxU) + 'px'); });
  }
  function onPhoto(ids){
    top1(ids).forEach(function(el){
      set(el, 'z-index', '6');
      set(sel(el) + ' .tn-atom', 'color', CREAM);
    });
  }
  function front(ids){ top1(ids).forEach(function(el){ set(el, 'z-index', '6'); }); }
  /* высота артборда в экранных px: d — прирост в единицах */
  function growArtboard(dU, k){
    var h = ab.getBoundingClientRect().height + dU * k;
    [ab, ab.querySelector('.t396__carrier'), ab.querySelector('.t396__filter')]
      .forEach(function(el){ if(el) set(el, 'height', h + 'px'); });
  }
  /* город встаёт сразу под строку «врач стоматолог — ортодонт» */
  function cityUnderRole(nameTopU){
    var n = byId(NAME), c = byId(CITY);
    moveTo(n, nameTopU);
    moveTo(c, nameTopU + H(n) + 2);
  }

  /* ---------- ПК и горизонтальный планшет: две половины ---------- */
  function split(k){
    var s = byId(SHAPE), p = byId(PHOTO);
    var c0 = T(s), oldH = H(s);
    /* на очень низком окне не сжимаем сильнее, чтобы ничего не наехало */
    var newH = Math.max(window.innerHeight / k - 2 * c0, oldH * 0.8);
    var d = newH - oldH, oldEnd = c0 + oldH;
    kids().forEach(function(el){
      if(el === s || el === p) return;
      if(TITLE_SET.indexOf(id(el)) >= 0) { moveTo(el, T(el) + Math.max(d, 0) / 2 + 44); }  /* +44: место убранной кнопки */
      else if(T(el) >= oldEnd - 2 && T(el) < 3000) moveTo(el, T(el) + d);
    });
    cityUnderRole(T(byId(NAME)));
    set(s, 'height', newH + 'px');
    set(p, 'height', newH + 'px');
    growArtboard(d, k);
  }

  /* ---------- телефон и вертикальный планшет: фото сверху ---------- */
  function stacked(tablet, k){
    var s = byId(SHAPE), p = byId(PHOTO);
    var Vu = window.innerHeight / k;
    var oldEndU = Math.max(T(p) + H(p), T(s) + H(s));
    var below = kids().filter(function(el){ return T(el) >= oldEndU + 2 && T(el) < 3000; });
    var titleH = H(byId(TITLE));
    var gap = tablet ? 26 : 20;
    var textH = gap + titleH + gap;
    var pad = tablet ? 10 : 0;
    var photoH = Math.max(Vu - textH - pad, 260);
    var heroEnd = pad + photoH + textH + pad * 0;
    var n = byId(NAME), c = byId(CITY);

    if(tablet){
      /* фото и серый фон на всю ширину; заголовок — по центру */
      var Wd = W(ab) / k;
      var full = Wd - 2 * pad;
      var dxText = (pad + full / 2) - (L(s) + W(s) / 2);
      var dxS = pad - L(s);
      set(p, 'width', full + 'px');
      set(s, 'width', full + 'px');
      set(s, 'left', pad + 'px');
      shiftX(TITLE_SET, dxText);
      /* меню — на фото слева сверху */
      shiftX(MENU.concat(MENU_STARS), (pad + 20) - L(byId(MENU[0])));
      onPhoto(MENU);
      front(MENU_STARS);
      shiftSet(MENU.concat(MENU_STARS), pad + 14);
      /* имя и город — на фото справа сверху */
      cityUnderRole(pad + 10);
    } else {
      /* телефон: имя, врач и город у нижнего края фото справа */
      var blockH = H(n) + 2 + H(c);
      cityUnderRole(pad + photoH - 14 - blockH);
    }

    moveTo(p, pad); set(p, 'height', photoH + 'px');
    moveTo(s, pad + photoH); set(s, 'height', textH + 'px');
    shiftSet(TITLE_SET, pad + photoH + gap);

    onPhoto([NAME, CITY]);
    front(TITLE_SET.concat([BURGER]));
    set(sel(s) + ' .tn-atom', 'border-radius', '0 0 10px 10px');
    set(sel(p) + ' .tn-atom', 'border-radius', '10px 10px 0 0');
    set(sel(p) + ' .tn-atom__img', 'border-radius', '10px 10px 0 0');
    set(sel(p) + ' .tn-atom__img', 'object-position', '50% 30%');
    if(!tablet){
      /* лёгкое затемнение у нижнего края фото, чтобы светлый текст читался на светлом кресле */
      set(sel(p) + ' .tn-atom::after', 'content', '""');
      set(sel(p) + ' .tn-atom::after', 'position', 'absolute');
      set(sel(p) + ' .tn-atom::after', 'inset', '0');
      set(sel(p) + ' .tn-atom::after', 'pointer-events', 'none');
      set(sel(p) + ' .tn-atom::after', 'border-radius', 'inherit');
      set(sel(p) + ' .tn-atom::after', 'background', 'linear-gradient(to top, rgba(14,30,20,.62) 0, rgba(14,30,20,.32) 90px, rgba(14,30,20,0) 190px)');
    }

    var dU = (pad + photoH + textH) - oldEndU;
    below.forEach(function(el){ moveTo(el, T(el) + dU); });
    growArtboard(dU, k);
  }

  function apply(force){
    ab = document.querySelector(REC + ' .t396__artboard');
    if(!ab) return;
    var w = window.innerWidth, h = window.innerHeight;
    var mode = w < 768 ? 'phone' : (w < 1200 && h > w ? 'tablet' : 'split');
    /* на телефоне высота окна прыгает при прокрутке — пересчитываем
       только при смене ширины или раскладки */
    var key = mode + w;
    if(!force && key === lastKey) return;
    lastKey = key;
    rules = {};
    if(sheet) sheet.textContent = '';
    void ab.offsetHeight;
    var k = zoom(byId(SHAPE));
    if(mode === 'split') split(k); else stacked(mode === 'tablet', k);
    flush();
  }

  var tm;
  window.addEventListener('resize', function(){
    clearTimeout(tm); tm = setTimeout(function(){ apply(false); }, 250);
  });
  function boot(){ setTimeout(function(){ apply(true); }, 400); }
  if(document.readyState === 'complete') boot();
  else window.addEventListener('load', boot);
})();
