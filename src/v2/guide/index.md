---
title: Введение
type: guide
order: 2
---

## Что такое Vue.js?

Vue (произносится /vjuː/, примерно как **view**) — это **прогрессивный фреймворк** для создания пользовательских интерфейсов. В отличие от фреймворков-монолитов, Vue создан пригодным для постепенного внедрения. Его ядро в первую очередь решает задачи уровня представления (view), что упрощает интеграцию с другими библиотеками и существующими проектами. С другой стороны, Vue полностью подходит и для создания сложных одностраничных приложений (SPA, Single-Page Applications), если использовать его совместно с [современными инструментами](single-file-components.html) и [дополнительными библиотеками](https://github.com/vuejs/awesome-vue#components--libraries).

Если вы хотите узнать больше о Vue перед тем как начать, мы <a id="modal-player" href="#">создали видео</a> с рассказом об основных принципах работы на примере проекта.

Если вы — опытный фронтенд-разработчик, и хотите узнать, чем Vue отличается от остальных библиотек или фреймворков, обратите внимание на [сравнение с другими фреймворками](comparison.html).

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/" target="_blank" rel="noopener" title="Бесплатный курс по Vue.js (на англ.)">Посмотрите бесплатный видео-курс на Vue Mastery</a></div>

## Начало работы

<p class="tip">В этом руководстве мы предполагаем, что вы уже знакомы с HTML, CSS и JavaScript на базовом уровне. Если же вы во фронтенд-разработке совсем новичок, начинать сразу с изучения фреймворка может быть не лучшей идеей — возвращайтесь, разобравшись с основами! Наличие опыта работы с другими фреймворками может помочь, но не является обязательным.</p>

Проще всего попробовать Vue.js, начав с [примера Hello World на JSFiddle](https://jsfiddle.net/chrisvfritz/50wL7mdz/). Откройте его в другой вкладке, и изменяйте по ходу чтения руководства. Можно и просто <a href="https://gist.githubusercontent.com/chrisvfritz/7f8d7d63000b48493c336e48b3db3e52/raw/ed60c4e5d5c6fec48b0921edaed0cb60be30e87c/index.html" target="_blank" rel="noopener noreferrer" download="index.html">создать <code>index.html</code> файл</a> на диске и подключить Vue:

```html
<!-- версия для разработки, отображает полезные предупреждения в консоли -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

или:

```html
<!-- production-версия, оптимизированная для размера и скорости-->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

В разделе по [установке](installation.html) описаны и другие варианты установки Vue. Обратите внимание, мы **не рекомендуем** новичкам начинать с `vue-cli`, особенно если нет опыта работы с инструментами сборки Node.js.

Если предпочитаете что-то более интерактивное, можете пройти [эту серию уроков на Scrimba](https://scrimba.com/playlist/pXKqta), которая представляет собой сочетание скринкастов и песочницы для проверки примеров кода, где вы можете остановиться и продолжить изучение в любое время.

## Декларативная отрисовка

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cQ3QVcr" target="_blank" rel="noopener noreferrer">Пройдите этот урок на Scrimba</a></div>

В ядре Vue.js находится система, которая позволяет декларативно отображать данные в DOM с помощью простых шаблонов:

```html
<div id="app">
  {{ message }}
</div>
```
```js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Привет, Vue!'
  }
})
```
{% raw %}
<div id="app" class="demo">
  {{ message }}
</div>
<script>
var app = new Vue({
  el: '#app',
  data: {
    message: 'Привет, Vue!'
  }
})
</script>
{% endraw %}

Вот мы и создали наше первое Vue-приложение! Выглядит как простая отрисовка шаблона, но «под капотом» Vue выполнил немало работы. Данные и DOM теперь **реактивно** связаны. Как это проверить? Просто откройте консоль JavaScript в браузере (прямо здесь, на этой странице) и задайте свойству `app.message` новое значение. Вы тут же увидите соответствующее изменение в браузере.

Кроме интерполяции текста, можно также связывать атрибуты элементов:

```html
<div id="app-2">
  <span v-bind:title="message">
    Наведи на меня курсор на пару секунд,
    чтобы увидеть динамически связанное значение title!
  </span>
</div>
```
```js
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'Вы загрузили эту страницу: ' + new Date().toLocaleString()
  }
})
```
{% raw %}
<div id="app-2" class="demo">
  <span v-bind:title="message">
    Наведи на меня курсор на пару секунд, чтобы увидеть динамически связанное значение title!
  </span>
</div>
<script>
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'Вы загрузили эту страницу: ' + new Date().toLocaleString()
  }
})
</script>
{% endraw %}

Здесь мы встречаемся с чем-то новым. Атрибут `v-bind`, называется **директивой**. Директивы имеют префикс `v-`, указывающий на их особую природу. Как вы уже могли догадаться, они добавляют к отображаемому DOM особое реактивное поведение, управляемое Vue. В данном примере директива говорит «сохраняй значение `title` этого элемента актуальным при изменении свойства `message` в экземпляре Vue».

Откройте консоль JavaScript и введите `app2.message = 'новое сообщение'`, вы увидите как связанный код HTML — в нашем случае, атрибут `title` — обновился.

## Условия и циклы

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cEQe4SJ" target="_blank" rel="noopener noreferrer">Пройдите этот урок на Scrimba</a></div>

Управлять присутствием элемента в DOM тоже довольно просто:

```html
<div id="app-3">
  <span v-if="seen">Сейчас меня видно</span>
</div>
```

```js
var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})
```

{% raw %}
<div id="app-3" class="demo">
  <span v-if="seen">Сейчас меня видно</span>
</div>
<script>
var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})
</script>
{% endraw %}

Попробуйте ввести в консоли `app3.seen = false`. Сообщение пропадёт.

Этот пример демонстрирует возможность связывать данные не только с текстом и атрибутами, но и со **структурой** DOM. Более того, Vue также имеет мощную систему анимации, которая автоматически применяет [эффекты переходов](transitions.html), когда элементы добавляются/обновляются/удаляются.

Есть и другие директивы, каждая из которых имеет своё предназначение. Например, директива `v-for` для отображения списков, используя данные из массива:

```html
<div id="app-4">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
```
```js
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Изучить JavaScript' },
      { text: 'Изучить Vue' },
      { text: 'Создать что-нибудь классное' }
    ]
  }
})
```
{% raw %}
<div id="app-4" class="demo">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
<script>
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Изучить JavaScript' },
      { text: 'Изучить Vue' },
      { text: 'Создать что-нибудь классное' }
    ]
  }
})
</script>
{% endraw %}

Введите в консоли `app4.todos.push({ text: 'Profit' })`. Вы увидите, что к списку добавится новый элемент.

## Работа с пользовательским вводом

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/czPNaUr" target="_blank" rel="noopener noreferrer">Пройдите этот урок на Scrimba</a></div>

Чтобы пользователи могли взаимодействовать с вашим приложением, используйте директиву `v-on` для отслеживания событий, указав метод-обработчик:

```html
<div id="app-5">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Перевернуть сообщение</button>
</div>
```
```js
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Привет, Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
```
{% raw %}
<div id="app-5" class="demo">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Перевернуть сообщение</button>
</div>
<script>
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Привет, Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

Обратите внимание, в методе мы просто обновляем состояние приложения, не затрагивая DOM — всю работу с DOM выполняет Vue, а вы пишете код, который занимается только логикой приложения.

Vue также предоставляет директиву `v-model`, позволяющую легко связывать элементы форм и состояние приложения:

```html
<div id="app-6">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
```
```js
var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Привет, Vue!'
  }
})
```
{% raw %}
<div id="app-6" class="demo">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
<script>
var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Привет, Vue!'
  }
})
</script>
{% endraw %}

## Разбиение приложения на компоненты

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cEQVkA3" target="_blank" rel="noopener noreferrer">Пройдите этот урок на Scrimba</a></div>

Важной концепцией Vue являются компоненты. Эта абстракция позволяет собирать большие приложения из маленьких «кусочков». Они представляют собой пригодные к повторному использованию объекты. Если подумать, почти любой интерфейс можно представить как дерево компонентов:

![Дерево Компонентов](/images/components.png)

Во Vue компонент — это, по сути, экземпляр Vue с предустановленными опциями. Создать новый компонент во Vue просто:

```js
// Определяем новый компонент под именем todo-item
Vue.component('todo-item', {
  template: '<li>Это одна задача в списке</li>'
})
```

Теперь его можно использовать в шаблоне другого компонента:

```html
<ol>
  <!-- Создаём экземпляр компонента todo-item -->
  <todo-item></todo-item>
</ol>
```

Пока что у нас получилось так, что во всех элементах списка будет один и тот же текст — это не очень-то интересно. Хотелось бы иметь возможность передавать данные от родительского в дочерние компоненты. Давайте изменим определение компонента, чтобы он мог принимать [входной параметр](components.html#Передача-данных-в-дочерние-компоненты-через-входные-параметры):

```js
Vue.component('todo-item', {
  // Компонент todo-item теперь принимает
  // "prop", то есть входной параметр.
  // Имя входного параметра todo.
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
```

Теперь можно передать текст задачи в каждый компонент с помощью `v-bind`:

```html
<div id="app-7">
  <ol>
    <!--
      Теперь мы можем передать каждому компоненту todo-item объект
      с информацией о задаче, который будет динамически меняться.
      Мы также определяем для каждого компонента "key",
      значение которого мы разберём далее в руководстве.
    -->
    <todo-item
      v-for="item in groceryList"
      v-bind:todo="item"
      v-bind:key="item.id"
    ></todo-item>
  </ol>
</div>
```
```js
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})

var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { id: 0, text: 'Овощи' },
      { id: 1, text: 'Сыр' },
      { id: 2, text: 'Что там ещё люди едят?' }
    ]
  }
})
```
{% raw %}
<div id="app-7" class="demo">
  <ol>
    <todo-item v-for="item in groceryList" v-bind:todo="item" :key="item.id"></todo-item>
  </ol>
</div>
<script>
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { id: 0, text: 'Овощи' },
      { id: 1, text: 'Сыр' },
      { id: 2, text: 'Что там ещё люди едят?' }
    ]
  }
})
</script>
{% endraw %}

Конечно, этот пример слегка надуман, но посмотрите сами — мы разделили наше приложение на два меньших объекта, и дочерний, в разумной мере, отделён от родительского с помощью интерфейса входных параметров. Теперь можно улучшать компонент `<todo-item>`, усложнять его шаблон и логику, но не влиять на родительское приложение.

В крупных приложениях разделение на компоненты становится обязательным условием для сохранения управляемости процесса разработки. Разговор о компонентах ещё далеко не окончен и мы вернёмся к ним [позднее в этом руководстве](components.html), но уже сейчас можно взглянуть на (вымышленный) пример того, как может выглядеть шаблон приложения, использующего компоненты:

```html
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

### Отношение к пользовательским элементам Web Components

Вы могли заметить, что компоненты Vue довольно похожи на **пользовательские элементы**, являющиеся частью [спецификации W3C Web Components](https://www.w3.org/wiki/WebComponents/). Дело в том, что синтаксис компонентов Vue и правда намеренно следует этой спецификации. В частности, компоненты Vue реализуют [API слотов](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) и специальный атрибут `is`. Но есть и несколько ключевых различий:

1. Спецификация Web Components была завершена, но она реализована ещё не во всех браузерах. Safari 10.1+, Chrome 54+ и Firefox 63+ уже поддерживают веб-компоненты. Компоненты Vue, напротив, не требуют никаких полифилов и работают во всех поддерживаемых браузерах (IE9 и выше). При необходимости компоненты Vue могут быть «обёрнуты» в нативные пользовательские элементы.

2. Компоненты Vue предоставляют возможности, недоступные в простых пользовательских элементах. Самые значимые из них: кросс-компонентная передача данных, коммуникация с использованием пользовательских событий и интеграция с инструментами сборок.

## Готовы к большему?

Пока мы лишь кратко представили самые основные возможности ядра Vue.js — остаток этого руководства посвящён более детальному рассмотрению этих и других возможностей, поэтому советуем прочитать его целиком!

<div id="video-modal" class="modal"><div class="video-space" style="padding: 56.25% 0 0 0; position: relative;"><iframe src="https://player.vimeo.com/video/247494684" style="height: 100%; left: 0; position: absolute; top: 0; width: 100%; margin: 0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script><p class="modal-text">Видео <a href="https://www.vuemastery.com" target="_blank" rel="noopener" title="Vue.js курсы на Vue Mastery">Vue Mastery</a>. Посмотрите бесплатный курс Vue Mastery <a href="https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/" target="_blank" rel="noopener" title="Vue.js курсы на Vue Mastery">Введение в курс Vue</a>.</div>
