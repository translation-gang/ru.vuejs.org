---
title: Создание пользовательской директивы прокрутки
type: cookbook
order: 7
---

## Простой пример

Часто случается, что нам необходимо добавить какое-нибудь нестандартное поведение, например анимацию, при прокрутке на сайте. Существует много способов, как реализовать подобное, но способ, требующий меньше всего кода и зависимостей, заключается в использовании [пользовательской директивы](https://ru.vuejs.org/v2/guide/custom-directive.html) для создания хука, который срабатывает при определённом событии прокрутки.
```js
Vue.directive('scroll', {
  inserted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
})

// основное приложение
new Vue({
  el: '#app',
  methods: {
    handleScroll: function (evt, el) {
      if (window.scrollY > 50) {
        el.setAttribute(
          'style',
          'opacity: 1; transform: translate3d(0, -10px, 0)'
        )
      }
      return window.scrollY > 100
    }
  }
})
```

```html
<div id="app">
  <h1 class="centered">Прокрути меня</h1>
  <div
    v-scroll="handleScroll"
    class="box"
  >
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A atque amet harum aut ab veritatis earum porro praesentium ut corporis. Quasi provident dolorem officia iure fugiat, eius mollitia sequi quisquam.</p>
  </div>
</div>
```

<p class="tip">Важно! Директива должна быть зарегистрирована до экземпляра Vue.</p>

Также нам понадобится свойство в стилях, которое позволит сделать переход между промежуточными состояниями более плавным:

```css
.box {
  transition: 1.5s all cubic-bezier(0.39, 0.575, 0.565, 1);
}
```

<p data-height="450" data-theme-id="5162" data-slug-hash="983220ed949ac670dff96bdcaf9d3338" data-default-tab="result" data-user="sdras" data-embed-version="2" data-pen-title="Пользовательская директива прокрутки - CSS переходы" class="codepen">Посмотреть пример<a href="https://codepen.io/sdras/pen/983220ed949ac670dff96bdcaf9d3338/">Пользовательская директива прокрутки - CSS переходы</a> от Sarah Drasner (<a href="https://codepen.io/sdras">@sdras</a>) на <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

С помощью GreenSock или любой другой JS-библиотеки для анимаций, можно упростить код:

```js
Vue.directive('scroll', {
  inserted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
})

// основное приложение
new Vue({
  el: '#app',
  methods: {
    handleScroll: function (evt, el) {
      if (window.scrollY > 50) {
        TweenMax.to(el, 1.5, {
          y: -10,
          opacity: 1,
          ease: Sine.easeOut
        })
      }
      return window.scrollY > 100
    }
  }
})
```

Мы удалим предыдущее CSS-свойство transition из этого решения, так как теперь плавность перехода управляется с помощью JavaScript.

## Выгода от использования пользовательской директивы прокрутки

Vue богат различными настройками для директив, многие из которых решают большинство задач, что положительно сказывается на процессе разработки. Но даже если у вас есть частный случай, который не покрывается стандартными средствами фреймворка, он может быть легко решён с помощью создания пользовательской директивы, соответствующей вашим требованиям.

Добавление и удаление обработчиков на события прокрутки элементов — это действительно хорошее использование данной техники, потому, что директивы прокрутки всегда связаны с самим элементом. В противном случае нам пришлось бы искать ссылку на соответствующий элемент в DOM. Данный подход избавляет от необходимости прохода по DOM, и держит логику события связанной с узлом, на который оно ссылается.

## Реальный пример: использование пользовательской директивы прокрутки для каскадных анимаций

В процессе создания связующего сайта вы можете обнаружить, что переиспользуете один и тот же тип анимаций в нескольких областях.
Это кажется простым — создать весьма конкретную пользовательскую директиву, не так ли? Обычно, если вы её переиспользуете, вам понадобится её _просто_ слегка изменить при каждом использовании.

Чтобы оставить наш код лаконичным и понятным, мы бы захотели передать некоторые параметры, такие, как начальная и конечная точки анимации во время прокрутки страницы вниз.

**Этот пример лучше просматривать в [полноэкранной версии](https://s.codepen.io/sdras/debug/078c19f5b3ed7f7d28584da450296cd0).**

<p data-height="500" data-theme-id="5162" data-slug-hash="c8c55e3e0bba997350551dd747119100" data-default-tab="result" data-user="sdras" data-embed-version="2" data-pen-title="Пример с прокруткой - Использование пользовательской директивы во Vue" class="codepen">Посмотреть пример <a href="https://codepen.io/sdras/pen/c8c55e3e0bba997350551dd747119100/">Пример с прокруткой - Использование пользовательской директивы во Vue</a> от Sarah Drasner (<a href="https://codepen.io/sdras">@sdras</a>) на <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

В примере выше каждая секция имеет два типа анимаций, которые срабатывают во время прокрутки: анимация изменения формы и анимация отрисовки, которая анимирует отдельные пути в SVG. Мы переиспользуем обе, так что мы можем написать пользовательские директивы для каждой из них. Аргументы, которые мы передадим внутрь, помогут сохранить простоту и универсальность.

Чтобы показать, как это делается, мы рассмотрим пример с изменением формы, где нам нужно указать значения старта и окончания анимации, а также передать значение пути, в который мы будем трансформировать форму. Эти аргументы определяются как `binding.value.foo`.

```js
Vue.directive('clipscroll', {
  inserted: function (el, binding) {
    let f = function (evt) {
      var hasRun = false
      if (!hasRun && window.scrollY > binding.value.start) {
        hasRun = true
        TweenMax.to(el, 2, {
          morphSVG: binding.value.toPath,
          ease: Sine.easeIn
        })
      }
      if (window.scrollY > binding.value.end) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
})
```

После этого, мы можем использовать эту анимацию в нашем шаблоне. В данном случае мы привязываем директиву к элементу `clipPath` и передаём все наши аргументы внутри объекта в директиву.

```html
<clipPath id="clip-path">
  <path
    v-clipscroll="{ start: '50', end: '100', toPath: 'M0.39 0.34H15.99V22.44H0.39z' }"
    id="poly-shapemorph"
    d="M12.46 20.76L7.34 22.04 3.67 18.25 5.12 13.18 10.24 11.9 13.91 15.69 12.46 20.76z"
  />
</clipPath>
```

## Альтернативные варианты

Пользовательские директивы очень полезны, но у вас может возникнуть ситуация, когда вам понадобится что-то очень специфичное, но уже реализованное в библиотеках для прокрутки страницы, и у вас не будет желания писать это с нуля.

[Scrollmagic](http://scrollmagic.io/) обладает очень богатой экосистемой для работы, так же, как и хорошей документацией с примерами. Он включает в себя, но не ограничивается такими возможностями, как  [параллакс-эффект](http://scrollmagic.io/examples/advanced/parallax_scrolling.html), [каскадное закрепление](http://scrollmagic.io/examples/expert/cascading_pins.html), [вытеснение областей](http://scrollmagic.io/examples/basic/section_wipes_natural.html) и [отзывчивая продолжительность анимации](http://scrollmagic.io/examples/basic/responsive_duration.html).
