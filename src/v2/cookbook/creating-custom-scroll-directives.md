---
title: Создание пользовательских директив прокрутки страницы
type: cookbook
order: 7
---

## Базовый пример

Довольно часто мы можем захотеть добавить немного нестандартного поведения при прокрутке страницы на сайте и, особенно, анимаций. Существует много способов реаализовать это, но способ с наименьшим количеством кода и зависимостей заключается в использовании [пользовательской директивы](https://vuejs.org/v2/guide/custom-directive.html) для создания хука, который срабатывает при определённом событии прокрутки.
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
  <div class="box" v-scroll="handleScroll">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A atque amet harum aut ab veritatis earum porro praesentium ut corporis. Quasi provident dolorem officia iure fugiat, eius mollitia sequi quisquam.</p>
  </div>
</div>
```

<p class="tip">Важно! Директива должна быть объявлена до экземпляра Vue.</p>

Также, нам понадобится свойство в стилях, которое сгладит переход между промежуточными состояниями, в данном случае:

```css
.box {
  transition: 1.5s all cubic-bezier(0.39, 0.575, 0.565, 1);
}
```

<p data-height="450" data-theme-id="5162" data-slug-hash="983220ed949ac670dff96bdcaf9d3338" data-default-tab="result" data-user="sdras" data-embed-version="2" data-pen-title="Custom Scroll Directive- CSS Transition" class="codepen">See the Pen <a href="https://codepen.io/sdras/pen/983220ed949ac670dff96bdcaf9d3338/">Custom Scroll Directive- CSS Transition</a> by Sarah Drasner (<a href="https://codepen.io/sdras">@sdras</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Используя GreenSock(GSAP) или любую другую JavaScript библиотеку для анимаций, наш код станет еще проще:

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

Мы удалим предыдущее CSS свойство из этого решения, так как теперь плавность перехода управляется с помощью JavaScript.

## Выгода от использования пользовательских директив прокрутки

Vue богат различными настройками для директив, большинство из которых охватывают распространённые случаи их применения, что продуктивно сказывается на этапы разработки. Но даже если у вас есть частный случай, который не решается средствами фреймворка, он решается этим способом, так как вы можете легко создать пользовательскую директиву, соответствующую вашим требованиям.

Навешивание и удаление событий, возникающих при прокрутке, к элементам -  действительно хорошее использование этой техники, потому что ,так же как и с другими директивами, которые мы используем, они всегда связаны с самим элементом. В противном случае, нам пришлось бы искать ссылку на соответствующий элемент в DOM. Данный подход избавляет от необходимости прохода по DOM, и держит логику события связанной с узлом, на который оно ссылается.

## Реальный пример: Использование пользовательских директив прокрутки для каскадных анимаций

В процессе создания сайта вы можете обнаружить, что переиспользуете один и тот же тип анимациий в нескольких областях.
Выглядит просто, затем мы бы создали конкретную пользовательскую диррективу, не так ли? Обычно, если вы её переиспользуете, вам нужно будет менять её _лишь_ немного для каждого использования.

Чтобы оставить наш код лаконичным и понятным, мы бы захотели передать некоторые предопределенные аргументы, такие как начальная и конечная точки анимации во время прокрутки страницы вниз.


**Этот пример лучше просматривать в [полноэкранной версии](https://s.codepen.io/sdras/debug/078c19f5b3ed7f7d28584da450296cd0).**

<p data-height="500" data-theme-id="5162" data-slug-hash="c8c55e3e0bba997350551dd747119100" data-default-tab="result" data-user="sdras" data-embed-version="2" data-pen-title="Scrolling Example- Using Custom Directives in Vue" class="codepen">See the Pen <a href="https://codepen.io/sdras/pen/c8c55e3e0bba997350551dd747119100/">Scrolling Example- Using Custom Directives in Vue</a> by Sarah Drasner (<a href="https://codepen.io/sdras">@sdras</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>



В примере выше, каждая секция имеет два типа анимации, которые срабатывают во время прокрутки: анимация изменения формы и анимация отрисовки, которая анимирует отдельные пути в SVG. Мы переиспользуем обе анимации, так что мы можем написать пользовательские директивы для каждоый из них. Аргументы, которые мы пробросим внутрь, помогут сохранить простоту и универсальность.

Чтобы показать, как это делается, мы рассмотрим пример с изменением формы, где нам нужно указать начала и конец, а также передать значение пути, в который мы будем трансформировать форму. Эти аргументы определены как `binding.value.foo`

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

После этого, мы можем использовать эту анимацию в нашем шаблоне. В данном случае, мы привязываем директиву к элементу `clipPath`, и передаем все наши аргументы внутри объекта в директиву.

```html
<clipPath id="clip-path">
  <path
    v-clipscroll="{ start: '50', end: '100', toPath: 'M0.39 0.34H15.99V22.44H0.39z' }"
    id="poly-shapemorph"
    d="M12.46 20.76L7.34 22.04 3.67 18.25 5.12 13.18 10.24 11.9 13.91 15.69 12.46 20.76z"
  />
</clipPath>
```

## Альтернативные способы

Пользовательские директивы очень полезны, но у вас может возникнуть ситуация, когда вам понадобится что-то очень специфичное, но уже реализованное в библиотеках для прокрутки страницы, что вы не будете хотеть переписывать с нуля.

[Scrollmagic](http://scrollmagic.io/) обладает очень богатой экосистемой для работы, так же, как и хорошей документацией с примерами. Он включает в себя такие вещи, как  [parallax](http://scrollmagic.io/examples/advanced/parallax_scrolling.html), [cascading pinning](http://scrollmagic.io/examples/expert/cascading_pins.html), [section wipes](http://scrollmagic.io/examples/basic/section_wipes_natural.html), и [responsive duration](http://scrollmagic.io/examples/basic/responsive_duration.html), но не ограничеается на этом.
