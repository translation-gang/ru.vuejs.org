---
title: Миграция с Vue Router 0.7.x
type: guide
order: 702
---

> Только Vue Router 2 совместим с Vue 2, поэтому если вы обновляете Vue, вы должны также обновить и Vue Router. Поэтому мы включили описание процесса миграции в основную документацию. Для подробной инструкции по использованию новой версии Vue Router, обратитесь к документации [Vue Router](https://router.vuejs.org/ru/).

## Инициализация роутера

### `router.start` <sup>заменено</sup>

Больше нет никакого специального API для инициализации приложения, с использованием Vue Router. Это означает, что вместо:

``` js
router.start({
  template: '<router-view></router-view>'
}, '#app')
```

вы должны передать роутер как свойство в экземпляр Vue:

``` js
new Vue({
  el: '#app',
  router: router,
  template: '<router-view></router-view>'
})
```

или, если вы используете runtime-сборку Vue:

``` js
new Vue({
  el: '#app',
  router: router,
  render: h => h('router-view')
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти вызовы <code>router.start</code>.</p>
</div>
{% endraw %}

## Объявление путей

### `router.map` <sup>заменено</sup>

Теперь пути объявляются как массив в [свойстве `routes`](https://router.vuejs.org/ru/essentials/getting-started.html#javascript) при установке роутера. Например, эти пути:

``` js
router.map({
  '/foo': {
    component: Foo
  },
  '/bar': {
    component: Bar
  }
})
```

будут объявлены как:

``` js
var router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
})
```

Синтаксис массива позволяет сделать согласование путей более предсказуемым, так как итерация по объекту не гарантирует использование одинакового порядка ключей во всех браузерах.

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти вызовы <code>router.map</code>.</p>
</div>
{% endraw %}

### `router.on` <sup>удалено</sup>

Если вам нужно программно генерировать пути при запуске приложения, вы можете сделать это, динамически добавляя определения путей в массив. Например:

``` js
// Базовый массив путей
var routes = [
  // ...
]

// Динамически генерируемые пути
marketingPages.forEach(function (page) {
  routes.push({
    path: '/marketing/' + page.slug
    component: {
      extends: MarketingComponent
      data: function () {
        return { page: page }
      }
    }
  })
})

var router = new Router({
  routes: routes
})
```

Если вам нужно добавить новые пути после того, как был создан экземпляр роутера, вы можете заменить свойство `match` новым, включающим в себя путь, который вы хотите добавить:

``` js
router.match = createMatcher(
  [{
    path: '/my/new/path',
    component: MyComponent
  }].concat(router.options.routes)
)
```

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти вызовы <code>router.on</code>.</p>
</div>
{% endraw %}

### `router.beforeEach` <sup>изменён</sup>

`router.beforeEach` теперь работает асинхронно и принимает функцию `next` третьим аргументом.

``` js
router.beforeEach(function (transition) {
  if (transition.to.path === '/forbidden') {
    transition.abort()
  } else {
    transition.next()
  }
})
```

``` js
router.beforeEach(function (to, from, next) {
  if (to.path === '/forbidden') {
    next(false)
  } else {
    next()
  }
})
```

### `subRoutes` <sup>переименовано</sup>

[Переименовано в `children`](https://router.vuejs.org/ru/essentials/nested-routes.html) для соответствия Vue другим библиотекам маршрутизации.

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти использование свойства <code>subRoutes</code>.</p>
</div>
{% endraw %}

### `router.redirect` <sup>заменено</sup>

Теперь это [опция при объявлении роутера](https://router.vuejs.org/ru/essentials/redirect-and-alias.html). Например, вам нужно заменить:

``` js
router.redirect({
  '/tos': '/terms-of-service'
})
```

в вашей конфигурации `routes` на объявление, показанное ниже:

``` js
{
  path: '/tos',
  redirect: '/terms-of-service'
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти вызовы <code>router.redirect</code>.</p>
</div>
{% endraw %}

### `router.alias` <sup>заменено</sup>

Теперь это [опция при объявлении роутера](https://router.vuejs.org/ru/essentials/redirect-and-alias.html), которой вы присваиваете псевдоним. Например, вам нужно заменить:

``` js
router.alias({
  '/manage': '/admin'
})
```

в вашей конфигурации `routes` на объявление, показанное ниже:

``` js
{
  path: '/admin',
  component: AdminPanel,
  alias: '/manage'
}
```

Если вам нужно несколько псевдонимов, вы можете также использовать синтаксис массива:

``` js
alias: ['/manage', '/administer', '/administrate']
```

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти вызовы <code>router.alias</code>.</p>
</div>
{% endraw %}

### Произвольные свойства пути <sup>заменено</sup>

Произвольные свойства пути теперь должны быть помещены в новое свойство `meta`, чтобы избежать конфликтов с будущей функциональностью. Например, если вы определили:

``` js
'/admin': {
  component: AdminPanel,
  requiresAuth: true
}
```

вы должны заменить это на:

``` js
{
  path: '/admin',
  component: AdminPanel,
  meta: {
    requiresAuth: true
  }
}
```

Затем, для дальнейшего доступа к этому свойству пути, вы должны пройти через свойство `meta`, например:

``` js
if (route.meta.requiresAuth) {
  // ...
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти произвольные свойства пути, не помещенные в свойство `meta`.</p>
</div>
{% endraw %}

## Сопоставление путей

Сопоставление путей теперь использует [path-to-regexp](https://github.com/pillarjs/path-to-regexp) под капотом, что делает его гораздо более гибким, чем было ранее.

### Один или более именованных параметров <sup>изменено</sup>

Синтаксис немного изменился, поэтому `/category/*tags`, например, должно быть заменено на `/category/:tags+`.

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти использование устаревшего синтаксиса.</p>
</div>
{% endraw %}

## Ссылки

### `v-link` <sup>заменено</sup>

Директива `v-link` заменена на новый [компонент `<router-link>`](https://router.vuejs.org/ru/api/router-link.html), так как за данный тип работ теперь отвечают только компоненты во Vue 2. Это означает, что всякий раз, когда у вас есть ссылка, как эта:

``` html
<a v-link="'/about'">О нас</a>
```

Вам необходимо изменить её следующим образом:

``` html
<router-link to="/about">О нас</router-link>
```

Запомните, что `target="_blank"` больше не поддерживается в `<router-link>`, поэтому, если вам нужно открыть ссылку в новой вкладке, вы должны использовать тег `<a>`.

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти использование директивы <code>v-link</code>.</p>
</div>
{% endraw %}

### `v-link-active` <sup>заменено</sup>

Директива `v-link-active` также была заменена на атрибут `tag` в [компоненте `<router-link>`](https://router.vuejs.org/ru/api/router-link.html). Например, вам нужно заменить это:

``` html
<li v-link-active>
  <a v-link="'/about'">О нас</a>
</li>
```

на:

``` html
<router-link tag="li" to="/about">
  <a>О нас</a>
</router-link>
```

Тег `<a>` будет фактически ссылкой (с правильным атрибутом `href`), но активный класс будет применен к родительскому тегу `<li>`.

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти использование директивы <code>v-link-active</code>.</p>
</div>
{% endraw %}

## Программная навигация

### `router.go` <sup>изменено</sup>

Для соответствия [HTML5 History API](https://developer.mozilla.org/ru/docs/Web/API/History_API), `router.go` теперь используется только для [навигации вперед/назад](https://router.vuejs.org/ru/essentials/navigation.html#routergon), в то время как [`router.push`](https://router.vuejs.org/ru/essentials/navigation.html#routerpushlocation) используется для перехода на конкретную страницу.

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти использование <code>router.go</code> вместо необходимого использования <code>router.push</code>.</p>
</div>
{% endraw %}

## Опции роутера: режимы

### `hashbang: false` <sup>удалено</sup>

Символ хеша больше не требуется для Google при сканировании URL, так что они больше не используются по умолчанию (или в качестве опции) для хеш-стратегии.

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти использование опции <code>hashbang: false</code>.</p>
</div>
{% endraw %}

### `history: true` <sup>заменено</sup>

Все параметры режима роутера были объединены в [опцию `mode`](https://router.vuejs.org/ru/api/options.html#mode). Обновите:

``` js
var router = new VueRouter({
  history: 'true'
})
```

на:

``` js
var router = new VueRouter({
  mode: 'history'
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти использование опции <code>history: true</code>.</p>
</div>
{% endraw %}

### `abstract: true` <sup>заменено</sup>

Все параметры режима роутера были объединены в [опцию `mode`](https://router.vuejs.org/ru/api/options.html#mode). Обновите:

``` js
var router = new VueRouter({
  abstract: 'true'
})
```

на:

``` js
var router = new VueRouter({
  mode: 'abstract'
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти использование опции <code>abstract: true</code>.</p>
</div>
{% endraw %}

## Опции роутера: разное

### `saveScrollPosition` <sup>заменено</sup>

Было заменено на [опцию `scrollBehavior`](https://router.vuejs.org/ru/advanced/scroll-behavior.html) которая принимает функцию, поэтому поведение прокрутки стало полностью настраиваемым - даже для каждого пути. Это открывает много новых возможностей, но для возврата старого поведения:

``` js
saveScrollPosition: true
```

Вы можете заменить это на:

``` js
scrollBehavior: function (to, from, savedPosition) {
  return savedPosition || { x: 0, y: 0 }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти использование опции <code>saveScrollPosition: true</code>.</p>
</div>
{% endraw %}

### `root` <sup>переименовано</sup>

Переименовано в `base` для соответствия [HTML-эелементу `<base>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/base).

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти использование опции <code>root</code>.</p>
</div>
{% endraw %}

### `transitionOnLoad` <sup>удалено</sup>

В этой опции нет необходимости, теперь, когда Vue имеет явное [управление переходами `appear`](transitions.html#Transitions-on-Initial-Render).

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти использование опции <code>transitionOnLoad: true</code>.</p>
</div>
{% endraw %}

### `suppressTransitionError` <sup>удалено</sup>

Удалено из-за упрощения системы хуков. Если вам действительно нужно отловить ошибки переходов, вы можете использовать вместо этого [`try`...`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch).

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти использование опции <code>suppressTransitionError: true</code>.</p>
</div>
{% endraw %}

## Хуки путей

### `activate` <sup>заменено</sup>

Вместо этого используйте [`beforeRouteEnter`](https://router.vuejs.org/ru/advanced/navigation-guards.html#incomponent-guards) в компоненте.

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти использование хука <code>beforeRouteEnter</code>.</p>
</div>
{% endraw %}

### `canActivate` <sup>заменено</sup>

Вместо этого используйте [`beforeEnter`](https://router.vuejs.org/ru/advanced/navigation-guards.html#perroute-guard) в компоненте.

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти использование хука <code>canActivate</code>.</p>
</div>
{% endraw %}

### `deactivate` <sup>удалено</sup>

Вместо этого используйте хуки [`beforeDestroy`](../api/#beforeDestroy) или [`destroyed`](../api/#destroyed).

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти использование хука <code>deactivate</code>.</p>
</div>
{% endraw %}

### `canDeactivate` <sup>заменено</sup>

Вместо этого используйте [`beforeRouteLeave`](https://router.vuejs.org/ru/advanced/navigation-guards.html#incomponent-guards) в компоненте.

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти использование хука <code>canDeactivate</code>.</p>
</div>
{% endraw %}

### `canReuse: false` <sup>удалено</sup>

Больше не существует вариантов использования этого в новой версии Vue Router.

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти использование опции <code>canReuse: false</code>.</p>
</div>
{% endraw %}

### `data` <sup>заменено</sup>

Свойство `$route` теперь реактивно, поэтому вы можете просто использовать метод-наблюдатель для отслеживания изменения пути, например:

``` js
watch: {
  '$route': 'fetchData'
},
methods: {
  fetchData: function () {
    // ...
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти использование хука <code>data</code>.</p>
</div>
{% endraw %}

### `$loadingRouteData` <sup>удалено</sup>

Определите ваше свойство (например, `isLoading`), затем обновите состояние загрузки с помощью опции `watch` на пути. Например, при предварительном получении данных с использованием [axios](https://github.com/mzabriskie/axios):

``` js
data: function () {
  return {
    posts: [],
    isLoading: false,
    fetchError: null
  }
},
watch: {
  '$route': function () {
    var self = this
    self.isLoading = true
    self.fetchData().then(function () {
      self.isLoading = false
    })
  }
},
methods: {
  fetchData: function () {
    var self = this
    return axios.get('/api/posts')
      .then(function (response) {
        self.posts = response.data.posts
      })
      .catch(function (error) {
        self.fetchError = error
      })
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Обновление</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционный помощник</a> в вашем проекте, чтобы найти использование свойства <code>$loadingRouteData</code>.</p>
</div>
{% endraw %}
