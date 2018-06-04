---
title: Основы компонентов
type: guide
order: 11
---

## Базовый пример

Вот пример компонента Vue:

``` js
// Определяем новый компонент, названный button-counter
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})
```

Компоненты — это переиспользуемые экземпляры Vue со своим именем: в данном случае, `<button-counter>`. Мы можем использовать этот компонент как пользовательский тег внутри корневого экземпляра Vue, созданного с помощью `new Vue`:

```html
<div id="components-demo">
  <button-counter></button-counter>
</div>
```

```js
new Vue({ el: '#components-demo' })
```

{% raw %}
<div id="components-demo" class="demo">
  <button-counter></button-counter>
</div>
<script>
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count += 1">You clicked me {{ count }} times.</button>'
})
new Vue({ el: '#components-demo' })
</script>
{% endraw %}

Поскольку компоненты это переиспользуемые экземпляры Vue, они принимают те же опции что и `new Vue`, такие как `data`, `computed`, `watch`, `methods`, и хуки жизненного цикла. Единственными исключениями являются несколько специфичных для корневого экземпляра опций, например `el`.

## Переиспользование компонентов

Компоненты можно переиспользовать столько раз, сколько вы захотите:

```html
<div id="components-demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
```

{% raw %}
<div id="components-demo2" class="demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
<script>
new Vue({ el: '#components-demo2' })
</script>
{% endraw %}

Обратите внимание, что при нажатиях на кнопки каждая из них будет изменять свой собственный, отдельный `count`. Это потому, что каждый раз когда вы используете компонент будет создан его новый **экземпляр**.

### Свойство `data` должно быть функцией

Когда мы определяли компонент `<button-counter>` вы могли заметить, что `data` не была представлена в виде объекта, как например здесь:

```js
data: {
  count: 0
}
```

Вместо этого **у компонента свойство `data` должно быть функцией**, чтобы каждый экземпляр компонента мог управлять собственной независимой копией возвращаемого объекта данных:

```js
data: function () {
  return {
    count: 0
  }
}
```

Если бы у Vue не было этого правила, нажатие на одну кнопку повлияло бы на данные _всех других экземпляров_, как например тут:

{% raw %}
<div id="components-demo3" class="demo">
  <button-counter2></button-counter2>
  <button-counter2></button-counter2>
  <button-counter2></button-counter2>
</div>
<script>
var buttonCounter2Data = {
  count: 0
}
Vue.component('button-counter2', {
  data: function () {
    return buttonCounter2Data
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})
new Vue({ el: '#components-demo3' })
</script>
{% endraw %}

## Организация компонентов

Обычно приложение организуется в виде дерева вложенных компонентов:

![Component Tree](/images/components.png)

Например, у вас могут быть компоненты для заголовка, боковой панели, зоны контента, каждый из которых может содержать другие компоненты для навигационных ссылок, постов блога и т.д.

Чтобы использовать эти компоненты в шаблонах, они должны быть зарегистрированы, чтобы Vue узнал о них. Есть два типа регистрации компонентов: **глобальная** и **локальная**. До сих пор мы регистрировали компоненты только глобально, используя `Vue.component`:

```js
Vue.component('my-component-name', {
  // ... опции ...
})
```

Компоненты зарегистрированные глобально могут использоваться в шаблоне любого корневого экземпляра Vue (`new Vue`) созданного впоследствии — и даже внутри всех компонентов, расположенных в дереве компонентов этого экземпляра Vue.

На данный момент это всё, что вам нужно знать о регистрации компонентов. Но когда вы закончите изучение этой страницы и разберётесь со всей информацией представленной здесь — мы рекомендуем вернуться позднее и прочитать полное руководство по [Регистрации компонентов](components-registration.html).

## Передача данных в дочерние компоненты через входные параметры

Ранее мы создавали компонент для записи блога. Проблема в том, что этот компонент бесполезен, если не будет возможности передавать ему данные, такие как заголовок и содержимое записи блога, которую мы хотим показать. Вот для чего нужны входные параметры.

Входные параметры — это пользовательские атрибуты, которые вы можете установить на компоненте. Когда значение передаётся в атрибут входного параметра, оно становится свойством экземпляра компонента. Чтобы передать заголовок в компонент нашей записи блога, мы можем включить его в список входных параметров, которые принимает компонент, с помощью опции `props`:

```js
Vue.component('blog-post', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})
```

Компонент может принимать столько входных параметров, сколько захотите, и по умолчанию любое значение может быть передано в любой входной параметр. В шаблоне выше вы увидите, что мы можем получить доступ к этому значению в экземпляре компонента, как и к любому свойству `data`.

После объявления входного параметра вы можете передавать данные в него через пользовательский атрибут, например:

```html
<blog-post title="My journey with Vue"></blog-post>
<blog-post title="Blogging with Vue"></blog-post>
<blog-post title="Why Vue is so fun"></blog-post>
```

{% raw %}
<div id="blog-post-demo" class="demo">
  <blog-post1 title="My journey with Vue"></blog-post1>
  <blog-post1 title="Blogging with Vue"></blog-post1>
  <blog-post1 title="Why Vue is so fun"></blog-post1>
</div>
<script>
Vue.component('blog-post1', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})
new Vue({ el: '#blog-post-demo' })
</script>
{% endraw %}

Однако, в типичном приложении у вас наверняка будет массив записей в `data`:

```js
new Vue({
  el: '#blog-post-demo',
  data: {
    posts: [
      { id: 1, title: 'My journey with Vue' },
      { id: 2, title: 'Blogging with Vue' },
      { id: 3, title: 'Why Vue is so fun' }
    ]
  }
})
```

Тогда нужно отобразить компонент для каждой записи:

```html
<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:title="post.title"
></blog-post>
```

Как мы видим выше, можно использовать `v-bind` для динамической передачи данных во входные параметры. Это особенно полезно, когда вы не знаете заранее точного содержимого, которое потребуется отобразить, например после [загрузки записей блога из API](https://jsfiddle.net/chrisvfritz/sbLgr0ad).

На данный момент это всё, что вам нужно знать о входных параметрах. Но когда вы закончите изучение этой страницы и разберётесь со всей информацией представленной здесь — мы рекомендуем вернуться позднее и прочитать полное руководство по [Входным параметрам](components-props.html).

## Один корневой элемент

При создании компонента `<blog-post>`, ваш шаблон в конечном итоге будет содержать не только название:

```html
<h3>{{ title }}</h3>
```

По крайней мере, вы захотите отобразить и содержимое записи в блог:

```html
<h3>{{ title }}</h3>
<div v-html="content"></div>
```

Однако, если вы попробуете сделать это в шаблоне, Vue покажет ошибку с пояснением что **каждый компонент должен иметь один корневой элемент**. Вы можете исправить эту ошибку, обернув шаблон в родительский элемент, например так:

```html
<div class="blog-post">
  <h3>{{ title }}</h3>
  <div v-html="content"></div>
</div>
```

По мере роста нашего компонента, вероятно, нам может понадобиться не только заголовок и содержание поста блога, но и дата публикации, комментарии и так далее. Определять входной параметр для каждой связанной части информации может стать очень раздражающим:

```html
<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:title="post.title"
  v-bind:content="post.content"
  v-bind:publishedAt="post.publishedAt"
  v-bind:comments="post.comments"
></blog-post>
```

Это подходящее время для рефакторинга компонента `<blog-post>`, чтобы вместо длинного списка принимать лишь один входной параметр `post`:

```html
<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:post="post"
></blog-post>
```

```js
Vue.component('blog-post', {
  props: ['post'],
  template: `
    <div class="blog-post">
      <h3>{{ post.title }}</h3>
      <div v-html="post.content"></div>
    </div>
  `
})
```

<p class="tip">Приведённый выше пример и некоторые далее используют [шаблонные строки](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/template_strings) JavaScript, чтобы сделать многострочные шаблоны более читаемыми. Эта возможность не поддерживается Internet Explorer (IE), поэтому если вам нужна поддержка IE и нет возможности использовать транспиляцию (например с помощью Babel или TypeScript), то используйте [запись с обратными слэшами для многострочных шаблонов](https://css-tricks.com/snippets/javascript/multiline-string-variables-in-javascript/) вместо них.</p>

Теперь, когда добавляется новое свойство в объект `post`, оно будет автоматически доступно внутри `<blog-post>`.

## Отправка сообщений родителям с помощью событий

По мере разработки нашего компонента `<blog-post>` для некоторых возможностей может потребоваться передавать данные обратно в родительский компонент. Например, мы можем решить включить функцию для доступности, чтобы увеличивать размер текста в записях блога, оставив остальную часть страницы с размером текста по умолчанию.

В родительском компоненте мы можем добавить свойство `postFontSize` для этой возможности:

```js
new Vue({
  el: '#blog-posts-events-demo',
  data: {
    posts: [/* ... */],
    postFontSize: 1
  }
})
```

Которое будет использоваться в шаблоне для управления размером шрифта для всех записей блога:

```html
<div id="blog-posts-events-demo">
  <div :style="{ fontSize: postFontSize + 'em' }">
    <blog-post
      v-for="post in posts"
      v-bind:key="post.id"
      v-bind:post="post"
    ></blog-post>
  </div>
</div>
```

Теперь давайте добавим кнопку для увеличения текста прямо перед содержимым каждой записи блога:

```js
Vue.component('blog-post', {
  props: ['post'],
  template: `
    <div class="blog-post">
      <h3>{{ post.title }}</h3>
      <button>
        Увеличить размер текста
      </button>
      <div v-html="post.content"></div>
    </div>
  `
})
```

Проблема в том, что эта кнопка ничего не делает:

```html
<button>
  Увеличить размер текста
</button>
```

Когда мы нажимаем на кнопку, нам нужно сообщить родительскому компоненту, что он должен увеличить размер текста для всех записей блога. К счастью, экземпляры Vue предоставляют собственную систему событий для решения этой проблемы. Чтобы передать событие родительскому компоненту мы можем вызвать встроенный [метод **`$emit`**](../api/#Методы-экземпляра-—-события), передав имя события:

```html
<button v-on:click="$emit('enlarge-text')">
  Увеличить размер текста
</button>
```

Теперь на компоненте записи блога мы можем прослушивать это событие с помощью `v-on`, как и в случае с нативными событиями DOM:

```html
<blog-post
  ...
  v-on:enlarge-text="postFontSize += 0.1"
></blog-post>
```

{% raw %}
<div id="blog-posts-events-demo" class="demo">
  <div :style="{ fontSize: postFontSize + 'em' }">
    <blog-post
      v-for="post in posts"
      v-bind:key="post.id"
      v-bind:post="post"
      v-on:enlarge-text="postFontSize += 0.1"
    ></blog-post>
  </div>
</div>
<script>
Vue.component('blog-post', {
  props: ['post'],
  template: '\
    <div class="blog-post">\
      <h3>{{ post.title }}</h3>\
      <button v-on:click="$emit(\'enlarge-text\')">\
        Увеличить размер текста\
      </button>\
      <div v-html="post.content"></div>\
    </div>\
  '
})
new Vue({
  el: '#blog-posts-events-demo',
  data: {
    posts: [
      { id: 1, title: 'My journey with Vue', content: '...content...' },
      { id: 2, title: 'Blogging with Vue', content: '...content...' },
      { id: 3, title: 'Why Vue is so fun', content: '...content...' }
    ],
    postFontSize: 1
  }
})
</script>
{% endraw %}

### Передача данных вместе с событием

Иногда бывает полезно отправить определённые данные вместе с событием. Например, если захотим, чтобы компонент `<blog-post>` отвечал за то, насколько нужно увеличивать текст. В таком случае, мы можем использовать второй параметр `$emit` для предоставления этого значения:

```html
<button v-on:click="$emit('enlarge-text', 0.1)">
  Увеличить размер текста
</button>
```

Затем, когда мы прослушиваем событие в родителе, мы можем получить доступ к данным, переданным с событием, через `$event`:

```html
<blog-post
  ...
  v-on:enlarge-text="postFontSize += $event"
></blog-post>
```

Или, если обработчик события будет методом:

```html
<blog-post
  ...
  v-on:enlarge-text="onEnlargeText"
></blog-post>
```

Тогда значение будет передано первым аргументом:

```js
methods: {
  onEnlargeText: function (enlargeAmount) {
    this.postFontSize += enlargeAmount
  }
}
```

### Использование `v-model` на компонентах

Пользовательские события также могут использоваться для создания нестандартных элементов ввода, которые работают через `v-model`. Не забывайте, что:

```html
<input v-model="searchText">
```

делает то же самое, что и:

```html
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>
```

При использовании на компоненте, `v-model` вместо этого делает следующее:

``` html
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
></custom-input>
```

Чтобы это действительно работало, элемент `<input>` внутри компонента должен:

- Привязывать значение атрибута `value` к входному параметру `value`
- По событию `input`, генерировать собственное пользовательское событие `input` с новым значением

Вот это в действии:

```js
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})
```

Теперь `v-model` будет прекрасно работать с этим компонентом:

```html
<custom-input v-model="searchText"></custom-input>
```

На данный момент это всё, что вам нужно знать о пользовательских событиях. Но когда вы закончите изучение этой страницы и разберётесь со всей информацией представленной здесь — мы рекомендуем вернуться позднее и прочитать полное руководство по [Пользовательским событиям](components-custom-events.html).

## Распределение контента слотами

Как и с обычными HTML-элементами, часто бывает полезным передать компоненту содержимое, например:

``` html
<alert-box>
  Произошло что-то плохое.
</alert-box>
```

Что может выглядеть примерно так:

{% raw %}
<div id="slots-demo" class="demo">
  <alert-box>
    Произошло что-то плохое.
  </alert-box>
</div>
<script>
Vue.component('alert-box', {
  template: '\
    <div class="demo-alert-box">\
      <strong>Ошибка!</strong>\
      <slot></slot>\
    </div>\
  '
})
new Vue({ el: '#slots-demo' })
</script>
<style>
.demo-alert-box {
  padding: 10px 20px;
  background: #f3beb8;
  border: 1px solid #f09898;
}
</style>
{% endraw %}

К счастью, эта задача легко решается с помощью пользовательского элемента `<slot>` у Vue:

```js
Vue.component('alert-box', {
  template: `
    <div class="demo-alert-box">
      <strong>Ошибка!</strong>
      <slot></slot>
    </div>
  `
})
```

Как вы видите выше, мы просто добавляем слот там, куда хотим подставлять контент — и это всё. Готово!

На данный момент это всё, что вам нужно знать о слотах. Но когда вы закончите изучение этой страницы и разберётесь со всей информацией представленной здесь — мы рекомендуем вернуться позднее и прочитать полное руководство по [Слотам](components-slots.html).

## Динамическое переключение компонентов

Иногда бывает полезно динамически переключаться между компонентами, например в интерфейсе с вкладками:

{% raw %}
<div id="dynamic-component-demo" class="demo">
  <button
    v-for="tab in tabs"
    v-bind:key="tab"
    class="dynamic-component-demo-tab-button"
    v-bind:class="{ 'dynamic-component-demo-tab-button-active': tab === currentTab }"
    v-on:click="currentTab = tab"
  >
    {{ tab }}
  </button>
  <component
    v-bind:is="currentTabComponent"
    class="dynamic-component-demo-tab"
  ></component>
</div>
<script>
Vue.component('tab-home', { template: '<div>Home component</div>' })
Vue.component('tab-posts', { template: '<div>Posts component</div>' })
Vue.component('tab-archive', { template: '<div>Archive component</div>' })
new Vue({
  el: '#dynamic-component-demo',
  data: {
    currentTab: 'Home',
    tabs: ['Home', 'Posts', 'Archive']
  },
  computed: {
    currentTabComponent: function () {
      return 'tab-' + this.currentTab.toLowerCase()
    }
  }
})
</script>
<style>
.dynamic-component-demo-tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
}
.dynamic-component-demo-tab-button:hover {
  background: #e0e0e0;
}
.dynamic-component-demo-tab-button-active {
  background: #e0e0e0;
}
.dynamic-component-demo-tab {
  border: 1px solid #ccc;
  padding: 10px;
}
</style>
{% endraw %}

Показанное выше стало возможным с помощью элемента Vue `<component>` со специальным атрибутом `is`:

```html
<!-- Компонент меняется при изменении currentTabComponent -->
<component v-bind:is="currentTabComponent"></component>
```

В примере выше `currentTabComponent` может содержать:

- имя зарегистрированного компонента, или
- объект с настройками компонента

Посмотрите [этот fiddle](https://jsfiddle.net/chrisvfritz/o3nycadu/) чтобы поэкспериментировать с полным кодом, или [эту версию](https://jsfiddle.net/chrisvfritz/b2qj69o1/) для примера привязки к объекту с настройками компонента вместо указания его имени.

На данный момент это всё, что вам нужно знать о динамических компонентах. Но когда вы закончите изучение этой страницы и разберётесь со всей информацией представленной здесь — мы рекомендуем вернуться позднее и прочитать полное руководство по [Динамическим & Асинхронным компонентам](components-dynamic-async.html).

## Особенности парсинга DOM-шаблона

Некоторые HTML-элементы, такие как `<ul>`, `<ol>`, `<table>` и `<select>` имеют ограничения на то, какие элементы могут отображаться внутри них, или например элементы, такие как `<li>`, `<tr>`, и `<option>` могут появляться только внутри других определённых элементов.

Это приведёт к проблемам при использовании компонентов с элементами, которые имеют такие ограничения. Например:

``` html
<table>
  <blog-post-row></blog-post-row>
</table>
```

Пользовательский компонент `<blog-post-row>` будет поднят выше, так как считается недопустимым содержимым, вызывая ошибки в итоговом рендеринге. К счастью, специальный атрибут `is` предоставляет решение этой проблемы:

``` html
<table>
  <tr is="blog-post-row"></tr>
</table>
```

Следует отметить, что **этого ограничения _не будет_ если вы используете строковые шаблоны из одного из следующих источников**:

- Строковые шаблоны (например, `template: '...'`)
- [Однофайловые (`.vue`) компоненты](single-file-components.html)
- [`<script type="text/x-template">`](components-edge-cases.html#X-Templates)

На данный момент это всё, что вам нужно знать о динамических компонентах — и на самом деле это окончание раздела _Основы_ документации Vue. Наши поздравления! Ещё есть чему поучиться, но мы рекомендуем сначала отвлечься и попробовать поиграться с Vue, самостоятельно построить что-нибудь интересное.

Но когда вы закончите изучение этой страницы и разберётесь со всей информацией представленной здесь — мы рекомендуем вернуться позднее и прочитать полное руководство по [Динамическим & Асинхронным компонентам](components-dynamic-async.html), а также другим страницам из раздела продвинутых компонентов в боковой панели.
