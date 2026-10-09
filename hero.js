/* Первый экран в высоту окна. Добавлено при переносе с Тильды.

   ПК и горизонтальный планшет: карточки фото и текста стоят рядом
   и растягиваются ровно на высоту окна; заголовок встаёт посередине
   свободного места, кнопки и всё, что ниже, сдвигаются вместе.

   Телефон и вертикальный планшет: одна карточка в высоту окна,
   сверху фото (имя, город, телефон и меню на нём), снизу серый фон
   с заголовком и кнопками.

   Позиции пишутся отдельным <style> с !important поверх правил
   Zero Block, сами элементы, тексты и картинки не меняются. */
(function(){
  var REC = '#rec2720256801';
  var CREAM = '#F1ECDE';

  var SHAPE = '1785832076437000022', PHOTO = '1786520484116';
  var NAME = ['1785836064625000001'], CITY = ['1786280702538000016'],
      PHONE = ['1785832076438000025'], TITLE = ['1785833033370000006'],
      CHIPS = ['1785922694516'], BURGER = ['1786384596163'];
  var BUTTONS = ['1786280469817','1786280515001000014','1785836091316',
    '1786291015901000001','1786289883883000001','1786290643183000007',
    '1788250479203000005','1788250461150000004','1788250770657000002',
    '1788250799114000003','1786290547672000004','1786290612850000006'];
  var MENU = ['1785832076437000023','1786290076184000001','1785832076437000024',
    '1786280677703000015','1788344216059000007','1785832076438000026',
    '1785832076438000027','1788344145746000004','1785832076438000028'];
  var MENU_STARS = ['1786290112194000001','1785840126454000005','1785923212552000001',
    '1785923225864000003','1788344216059000008','1785923230633000005',
    '1785923234177000007','1788344145746000005','1785923238481000009'];
  var TITLE_SET = TITLE.concat(['1785832076438000031','1785832076438000033','1785832076438000034']);
  var BOTTOM = TITLE_SET.concat(BUTTONS, CHIPS);

  var lastKey = '', ab, rules = {}, sheet;

  function id(el){ return el.getAttribute('data-elem-id') || el.getAttribute('data-group-id'); }
  function byId(x){ return ab.querySelector('[data-elem-id="'+x+'"],[data-group-id="'+x+'"]'); }
  function kids(){
    return Array.prototype.filter.call(ab.children, function(el){
      return el.classList.contains('t396__elem') || el.classList.contains('tn-group');
    });
  }
  function zoom(el){ return parseFloat(el.style.zoom || getComputedStyle(el).zoom) || 1; }
  function top(el){ return el.getBoundingClientRect().top - ab.getBoundingClientRect().top; }
  function left(el){ return el.getBoundingClientRect().left - ab.getBoundingClientRect().left; }
  function topU(el){ return top(el) / zoom(el); }          /* в единицах артборда */
  function hU(el){ return el.getBoundingClientRect().height / zoom(el); }

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
  /* только элементы верхнего уровня: внутри групп Тильда двигает сама */
  function els(ids){ return ids.map(byId).filter(function(el){ return el && el.parentElement === ab; }); }
  function shiftSet(ids, targetU){
    var list = els(ids);
    var min = Math.min.apply(null, list.map(topU));
    list.forEach(function(el){ moveTo(el, topU(el) - min + targetU); });
  }
  /* сдвиг по горизонтали в экранных px — через translate, чтобы не
     трогать transform, которым Тильда анимирует элементы */
  function shiftX(ids, dx){
    els(ids).forEach(function(el){ set(el, 'translate', (dx / zoom(el)) + 'px 0'); });
  }
  function onPhoto(ids){
    els(ids).forEach(function(el){
      set(el, 'z-index', '6');
      set(sel(el) + ' .tn-atom', 'color', CREAM);
    });
  }
  function front(ids){ els(ids).forEach(function(el){ set(el, 'z-index', '6'); }); }
  function growArtboard(d){
    var h = ab.getBoundingClientRect().height + d;
    [ab, ab.querySelector('.t396__carrier'), ab.querySelector('.t396__filter')]
      .forEach(function(el){ if(el) set(el, 'height', h + 'px'); });
  }

  /* ---------- ПК и горизонтальный планшет: две половины ---------- */
  function split(){
    var s = byId(SHAPE), p = byId(PHOTO), k = zoom(s);
    var c0 = top(s), oldH = s.getBoundingClientRect().height;
    /* на очень низком окне не сжимаем сильнее, чтобы ничего не наехало */
    var newH = Math.max(window.innerHeight - 2 * c0, oldH * 0.8);
    var d = newH - oldH, oldEnd = c0 + oldH;
    kids().forEach(function(el){
      var dd = (TITLE_SET.indexOf(id(el)) >= 0 && d > 0) ? d / 2 : d;
      if(BOTTOM.indexOf(id(el)) >= 0 || top(el) >= oldEnd - 2)
        moveTo(el, (top(el) + dd) / zoom(el));
    });
    set(s, 'height', newH / k + 'px');
    set(p, 'height', newH / k + 'px');
    growArtboard(d);
  }

  /* ---------- телефон и вертикальный планшет: фото сверху ---------- */
  function stacked(tablet){
    var s = byId(SHAPE), p = byId(PHOTO), k = zoom(s);
    var Vu = window.innerHeight / k;
    var oldEndU = Math.max(topU(p) + hU(p), topU(s) + hU(s));
    var below = kids().filter(function(el){ return topU(el) >= oldEndU + 2; });
    var titleH = hU(byId(TITLE[0]));
    var gap = tablet ? 20 : 14, btnH = hU(byId(BUTTONS[0])), edge = tablet ? 14 : 10;
    var textH = gap + titleH + gap + btnH + edge;
    var photoH = Math.max(Vu - textH, 260);
    var heroEnd = photoH + textH;
    var pad = tablet ? 10 : 0;

    if(tablet){
      /* фото и серый фон на всю ширину; заголовок и кнопки — по центру */
      var full = ab.getBoundingClientRect().width / k - 2 * pad;
      var dxText = (left(p) + full * k / 2) - (left(s) + s.getBoundingClientRect().width / 2);
      set(p, 'width', full + 'px');
      set(s, 'width', full + 'px');
      shiftX([SHAPE], left(p) - left(s));
      shiftX(TITLE_SET.concat(BUTTONS), dxText);
      /* меню — на фото слева сверху */
      var dxMenu = left(p) + 20 * k - left(byId(MENU[0]));
      shiftX(MENU.concat(MENU_STARS), dxMenu);
      onPhoto(MENU);
      front(MENU_STARS);
    }

    moveTo(p, pad); set(p, 'height', (photoH - pad) + 'px');
    moveTo(s, photoH); set(s, 'height', textH + 'px');
    shiftSet(TITLE_SET, photoH + gap);
    shiftSet(BUTTONS, heroEnd - edge - btnH);
    shiftSet(CHIPS, photoH * 0.52);
    if(tablet) shiftSet(NAME.concat(CITY, PHONE), pad + 10);
    if(tablet) shiftSet(MENU.concat(MENU_STARS), pad + 14);

    onPhoto(NAME.concat(CITY, PHONE));
    front(TITLE_SET.concat(BUTTONS, CHIPS, BURGER));
    set(sel(s) + ' .tn-atom', 'border-radius', '0 0 10px 10px');
    set(sel(p) + ' .tn-atom', 'border-radius', '10px 10px 0 0');
    set(sel(p) + ' .tn-atom__img', 'border-radius', '10px 10px 0 0');
    set(sel(p) + ' .tn-atom__img', 'object-position', '50% 30%');

    var dU = heroEnd - oldEndU;
    below.forEach(function(el){ moveTo(el, topU(el) + dU); });
    growArtboard(dU * k);
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
    if(mode === 'split') split(); else stacked(mode === 'tablet');
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
