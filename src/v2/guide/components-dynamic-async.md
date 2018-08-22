---
title: Динамические и асинхронные компоненты
type: guide
order: 105
---

> Подразумевается, что вы уже изучили и разобрались с разделом [Основы компонентов](components.html). Если нет — прочитайте его сначала.

## `keep-alive` с динамическими компонентами

Ранее мы использовали атрибут `is` для переключения компонентов в интерфейсе вкладок:

```html
<component v-bind:is="currentTabComponent"></component>
```

Но иногда, при переключении между компонентами, вы хотите сохранить их состояния или избежать повторной отрисовки по соображениям производительности. Например, когда немного доработаем наш интерфейс с вкладками:

{% raw %}
<div id="dynamic-component-demo" class="demo">
  <button
    v-for="tab in tabs"
    v-bind:key="tab"
    v-bind:class="['dynamic-component-demo-tab-button', { 'dynamic-component-demo-active': currentTab === tab }]"
    v-on:click="currentTab = tab"
  >{{ tab }}</button>
  <component
    v-bind:is="currentTabComponent"
    class="dynamic-component-demo-tab"
  ></component>
</div>
<script>
Vue.component('tab-posts', {
  data: function () {
    return {
      posts: [
        {
          id: 1,
          title: 'Cat Ipsum',
          content: '<p>Dont wait for the storm to pass, dance in the rain kick up litter decide to want nothing to do with my owner today demand to be let outside at once, and expect owner to wait for me as i think about it cat cat moo moo lick ears lick paws so make meme, make cute face but lick the other cats. Kitty poochy chase imaginary bugs, but stand in front of the computer screen. Sweet beast cat dog hate mouse eat string barf pillow no baths hate everything stare at guinea pigs. My left donut is missing, as is my right loved it, hated it, loved it, hated it scoot butt on the rug cat not kitten around</p>'
        },
        {
          id: 2,
          title: 'Hipster Ipsum',
          content: '<p>Bushwick blue bottle scenester helvetica ugh, meh four loko. Put a bird on it lumbersexual franzen shabby chic, street art knausgaard trust fund shaman scenester live-edge mixtape taxidermy viral yuccie succulents. Keytar poke bicycle rights, crucifix street art neutra air plant PBR&B hoodie plaid venmo. Tilde swag art party fanny pack vinyl letterpress venmo jean shorts offal mumblecore. Vice blog gentrify mlkshk tattooed occupy snackwave, hoodie craft beer next level migas 8-bit chartreuse. Trust fund food truck drinking vinegar gochujang.</p>'
        },
        {
          id: 3,
          title: 'Cupcake Ipsum',
          content: '<p>Icing dessert soufflé lollipop chocolate bar sweet tart cake chupa chups. Soufflé marzipan jelly beans croissant toffee marzipan cupcake icing fruitcake. Muffin cake pudding soufflé wafer jelly bear claw sesame snaps marshmallow. Marzipan soufflé croissant lemon drops gingerbread sugar plum lemon drops apple pie gummies. Sweet roll donut oat cake toffee cake. Liquorice candy macaroon toffee cookie marzipan.</p>'
        }
      ],
      selectedPost: null
    }
  },
  template: '\
    <div class="dynamic-component-demo-posts-tab">\
      <ul class="dynamic-component-demo-posts-sidebar">\
        <li\
          v-for="post in posts"\
          v-bind:key="post.id"\
          v-bind:class="{ \'dynamic-component-demo-active\': post === selectedPost }"\
          v-on:click="selectedPost = post"\
        >\
          {{ post.title }}\
        </li>\
      </ul>\
      <div class="dynamic-component-demo-post-container">\
        <div \
          v-if="selectedPost"\
          class="dynamic-component-demo-post"\
        >\
          <h3>{{ selectedPost.title }}</h3>\
          <div v-html="selectedPost.content"></div>\
        </div>\
        <strong v-else>\
          Click on a blog title to the left to view it.\
        </strong>\
      </div>\
    </div>\
  '
})
Vue.component('tab-archive', {
  template: '<div>Archive component</div>'
})
new Vue({
  el: '#dynamic-component-demo',
  data: {
    currentTab: 'Posts',
    tabs: ['Posts', 'Archive']
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
.dynamic-component-demo-tab-button.dynamic-component-demo-active {
  background: #e0e0e0;
}
.dynamic-component-demo-tab {
  border: 1px solid #ccc;
  padding: 10px;
}
.dynamic-component-demo-posts-tab {
  display: flex;
}
.dynamic-component-demo-posts-sidebar {
  max-width: 40vw;
  margin: 0 !important;
  padding: 0 10px 0 0 !important;
  list-style-type: none;
  border-right: 1px solid #ccc;
}
.dynamic-component-demo-posts-sidebar li {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}
.dynamic-component-demo-posts-sidebar li:hover {
  background: #eee;
}
.dynamic-component-demo-posts-sidebar li.dynamic-component-demo-active {
  background: lightblue;
}
.dynamic-component-demo-post-container {
  padding-left: 10px;
}
.dynamic-component-demo-post > :first-child {
  margin-top: 0 !important;
  padding-top: 0 !important;
}
</style>
{% endraw %}

Вы можете заметить, что если выбрать запись, переключиться на вкладку _Archive_, затем переключиться обратно на _Posts_, то больше не будет показываться выбранная запись. Это связано с тем, что каждый раз, когда вы переключаетесь на новую вкладку, Vue создаёт новый экземпляр `currentTabComponent`.

Пересоздание динамических компонентов обычно является полезным поведением, но в нашем случае, мы хотим чтобы экземпляры компонентов вкладок кэшировались после их создания в первый раз. Для решения этой проблемы мы можем обернуть наш динамический компонент в элемент `<keep-alive>`:

``` html
<!-- Неактивные компоненты будут закэшированы! -->
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```

Посмотрите на результат ниже:

{% raw %}
<div id="dynamic-component-keep-alive-demo" class="demo">
  <button
    v-for="tab in tabs"
    v-bind:key="tab"
    v-bind:class="['dynamic-component-demo-tab-button', { 'dynamic-component-demo-active': currentTab === tab }]"
    v-on:click="currentTab = tab"
  >{{ tab }}</button>
  <keep-alive>
    <component
      v-bind:is="currentTabComponent"
      class="dynamic-component-demo-tab"
    ></component>
  </keep-alive>
</div>
<script>
new Vue({
  el: '#dynamic-component-keep-alive-demo',
  data: {
    currentTab: 'Posts',
    tabs: ['Posts', 'Archive']
  },
  computed: {
    currentTabComponent: function () {
      return 'tab-' + this.currentTab.toLowerCase()
    }
  }
})
</script>
{% endraw %}

Теперь вкладка _Posts_ управляет собственным состоянием (выбранной записью) даже когда не отображается. Посмотрите [этот fiddle](https://jsfiddle.net/chrisvfritz/Lp20op9o/) для полного примера кода.

<p class="tip">Обратите внимание, что`<keep-alive>` требует чтобы у всех переключаемых компонентов было задано имя, либо через опцию `name` компонента, либо через локальную/глобальную регистрацию.</p>

Подробнее с элементом `<keep-alive>` можно ознакомиться [на странице API](../api/#keep-alive).

## Асинхронные компоненты

Иногда бывает удобно разделить крупное приложение на части и подгружать компоненты с сервера только тогда, когда в них возникнет потребность. Для этого Vue позволяет определить компонент как функцию-фабрику, асинхронно возвращающую определение компонента. Vue вызовет фабричную функцию только тогда, когда компонент действительно понадобится, и закэширует результат для дальнейшего использования. Например:

``` js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // Передаём определение компонента в коллбэк resolve
    resolve({
      template: '<div>Я — асинхронный!</div>'
    })
  }, 1000)
})
```

Функция-фабрика принимает параметр `resolve` — коллбэк, который вызывается после того, как определение компонента получено от сервера. Кроме того, можно вызвать `reject(reason)`, если загрузка по какой-либо причине не удалась. Мы используем `setTimeout` исключительно в демонстрационных целях; как именно получать компонент в реальной ситуации — решать только вам самим. Один из удачных подходов — это использовать асинхронные компоненты в связке с [функциями Webpack по разделения кода](https://webpack.js.org/guides/code-splitting/):

``` js
Vue.component('async-webpack-example', function (resolve) {
  // Специальный синтаксис require укажет Webpack
  // автоматически разделить сборку на части
  // для последующей асинхронной загрузки
  require(['./my-async-component'], resolve)
})
```

Вы также можете вернуть `Promise` в функции-фабрике, так что с Webpack 2 и синтаксисом ES2015 можно сделать так:

``` js
Vue.component(
  'async-webpack-example',
  // Функция `import` возвращает Promise.
  () => import('./my-async-component')
)
```

При использовании [локальной регистрации компонентов](components-registration.html#Локальная-регистрация), вы также можете непосредственно указывать функцию, которая возвращает `Promise`:

``` js
new Vue({
  // ...
  components: {
    'my-component': () => import('./my-async-component')
  }
})
```

<p class="tip">Если вы используете <strong>Browserify</strong> и также хотите реализовать асинхронную загрузку компонентов, нам, к сожалению, придётся вас огорчить. Сам создатель Browserify [прояснил](https://github.com/substack/node-browserify/issues/58#issuecomment-21978224), что асинхронная загрузка "не является функцией, которую Browserify когда-либо будет поддерживать". По крайней мере, официально. Сообщество Browserify обнаружило возможны [обходные пути](https://github.com/vuejs/vuejs.org/issues/620), которые могут быть полезны в уже существующих сложных приложениях. Но в целом мы советуем использовать Webpack, обладающий полноценной встроенной поддержкой асинхронной загрузки частей сборки.</p>

### Управление состоянием загрузки

> Добавлено в версии 2.3.0+

Фабрика асинхронного компонента также может возвращать объект следующего формата:

``` js
const AsyncComponent = () => ({
  // Загружаемый компонент. Значение должно быть Promise
  component: import('./MyComponent.vue'),
  // Компонент загрузки, используемый пока загружается асинхронный компонент
  loading: LoadingComponent,
  // Компонент ошибки, используемый при неудачной загрузке
  error: ErrorComponent,
  // Задержка перед показом компонента загрузки. По умолчанию: 200 мс.
  delay: 200,
  // Компонент ошибки будет отображаться, если таймаут
  // был указан и время ожидания превышено. По умолчанию: Infinity.
  timeout: 3000
})
```

> Обратите внимание, что вы должны использовать [Vue Router](https://github.com/vuejs/vue-router) версии 2.4.0+ если вы хотите использовать указанный выше синтаксис для компонентов маршрута.
