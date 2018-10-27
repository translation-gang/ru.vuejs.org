---
title: Миграция с Vue 1.x
type: guide
order: 701
---

## ЧАВО

> Ого! - это длиииииинная страница! Значит ли это, что 2.0 - совсем другая, снова будет нужно всему учиться, а миграция будет практически невозможной?

Хорошо, что спросили! Ответ — нет. Около 90% API осталось тем же, основные концепции не изменились. А длинная страничка просто потому, что мы хотим максимально подробно объяснить все детали и привести много примеров. И уж точно __не предполагается что кто-то будет читать эту страницу от начала до конца!__

> Где я должен начать миграцию?

1. Начните с запуска [migration helper](https://github.com/vuejs/vue-migration-helper) в текущем проекте. Мы тщательно минимизировали и скомпилировали сложные Vue разработки в простой интерфейс командной строки. Всякий раз, когда они признают устаревшую функцию, они сообщат вам, выдадут предложения и предоставят ссылки на дополнительную информацию.

2. После этого просмотрите оглавление этой страницы на боковой панели. Если вы видите тему, проблема которой может повлиять на вас, но помощник по миграции не поймал её - проверьте её.

3. Если у вас есть какие-либо тесты, запустите их и посмотрите, какие из них не проходят. Если у вас нет тестов, просто откройте приложение в своём браузере и следите за предупреждениями или ошибками при навигации по нему.

4. К настоящему времени ваше приложение должно быть полностью перенесено. Если вы всё ещё голодны и хотите больше, то вы можете прочитать остальную часть этой страницы - или просто погрузиться в новое и улучшенное руководство [с начала](index.html). Многие части можно будет прочесть бегло, поскольку вы уже знакомы с основными понятиями.

> Сколько времени потребуется, чтобы перенести приложение Vue 1.x на 2.0?

Это зависит от нескольких факторов:

- Размер вашего приложения (для небольших и средних приложений - вероятно, меньше одного дня)

- Как часто вы отвлекаетесь и начинаете играть с новой замечательной функцией. 😉 &nbsp;Без шуток, это случалось и с нами при сборке 2.0!

- Какие устаревшие функции вы используете. Большинство может быть обновлено с помощью найти-и-заменить, на другие может уйти несколько минут. Если вы в настоящее время не придерживаетесь лучших практик, Vue 2.0 также будет стараться заставить вас им следовать. Это хорошо в долгосрочной перспективе, но также может означать значительный (хотя, возможно, и запоздалый) рефакторинг.

> Если я перейду на Vue 2, придётся ли мне обновлять Vuex и Vue Router?

Только Vue Router 2 совместим с Vue 2, так что да, вам также придётся следовать по пути [миграции для Vue Router](migration-vue-router.html). К счастью, в большинстве приложений не так много кода маршрутизатора, поэтому это, скорее всего, не займёт больше часа.

Что касается Vuex, то даже версия 0.8 совместима с Vue 2, поэтому вы не должны обновляться. Единственная причина, по которой вы, возможно, захотите немедленно обновиться - воспользоваться новыми функциями Vuex 2, такими как модули и уменьшенный шаблон.

## Шаблоны

### Фрагментированные экземпляры <sup>удалены</sup>

Каждый компонент должен содержать только один корневой элемент. Фрагментированные экземпляры больше не используются. Если ваш шаблон выглядит следующим образом:

``` html
<p>foo</p>
<p>bar</p>
```

Рекомендовано заменить код, просто обернув всё содержимое в новый элемент, например, вот так:

``` html
<div>
  <p>foo</p>
  <p>bar</p>
</div>
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите ваше end-to-end тестирование или приложение после обновления и проверьте <strong>предупреждения консоли</strong> о множестве корневых элементов в шаблоне.</p>
</div>
{% endraw %}

## Хуки жизненного цикла

### `beforeCompile` <sup>удалён</sup>

Вместо этого используйте `created` в вашем компоненте.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционного помощника</a> в вашем проекте, чтобы найти все примеры использования этого хука.</p>
</div>
{% endraw %}

### `compiled` <sup>заменён</sup>

Вместо этого используйте новый хук `mounted`.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционного помощника</a> в вашем проекте, чтобы найти все примеры использования этого хука.</p>
</div>
{% endraw %}

### `attached` <sup>удалён</sup>

Используйте пользовательскую проверку DOM в других хуках. Например, чтобы заменить:

``` js
attached: function () {
  doSomething()
}
```

Вы можете использовать:

``` js
mounted: function () {
  this.$nextTick(function () {
    doSomething()
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционного помощника</a> в вашем проекте, чтобы найти все примеры использования этого хука.</p>
</div>
{% endraw %}

### `detached` <sup>удалён</sup>

Используйте пользовательскую проверку DOM в других хуках. Например, чтобы заменить:

``` js
detached: function () {
  doSomething()
}
```

Вы можете использовать:

``` js
destroyed: function () {
  this.$nextTick(function () {
    doSomething()
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционного помощника</a> в вашем проекте, чтобы найти все примеры использования этого хука.</p>
</div>
{% endraw %}

### `init` <sup>переименован</sup>

Вместо этого используйте новый хук `beforeCreate`, который фактически ничем не отличается. Данный хук был переименован для логической взаимосвязи с другими методами жизненного цикла.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционного помощника</a> в вашем проекте, чтобы найти все примеры использования этого хука.</p>
</div>
{% endraw %}

### `ready` <sup>заменён</sup>

Вместо этого используйте новый хук `mounted`. Однако, следует отметить, что использование хука `mounted` не даёт гарантии существования в документе. Для этого также используйте `Vue.nextTick`/`vm.$nextTick`. Например:

``` js
mounted: function () {
  this.$nextTick(function () {
    // код, уже предполагающий наличие this.$el в документе
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционного помощника</a> в вашем проекте, чтобы найти все примеры использования этого хука.</p>
</div>
{% endraw %}

## `v-for`

### Очерёдность аргументов для массивов в `v-for` <sup>изменено</sup>

При использовании `index` очерёдность аргументов для массивов выглядела так `(index, value)`. Теперь она имеет вид `(value, index)`, чтобы не противоречить нативным методам массивов JavaScript, таким как `forEach` и `map`.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционного помощника</a> в вашем проекте, чтобы найти примеры устаревших очерёдностей аргументов. Обратите внимание: если вы дали нестандартное наименование индексу аргументов как  <code>position</code> или <code>num</code>, помощник не выделит их.</p>
</div>
{% endraw %}

### Очерёдность аргументов для объектов в `v-for` <sup>изменено</sup>

При использовании `key` очерёдность аргументов для объектов выглядела так `(key, value)`. Теперь она имеет вид `(value, key)`, чтобы не противоречить распространённым итераторам объекта, таким как lodash.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционного помощника</a> в вашем проекте, чтобы найти примеры устаревших очерёдностей аргументов. Обратите внимание: если вы дали название ключу аргументов как <code>name</code> или <code>property</code>, помощник не выделит их.</p>
</div>
{% endraw %}

### `$index` и `$key` <sup>удалены</sup>

Неявно определённые переменные `$index` и `$key` были заменены на явно определённые в `v-for`. Это позволяет коду быть легко читаемым для разработчиков, которые менее опытны во Vue, и к тому же как результат приводит к более понятному поведению при работе с вложенными циклами.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционного помощника</a> в вашем проекте, чтобы найти примеры этих удалённых переменных. Если вы пропустили какую-то, то следует также проверить <strong>ошибки консоли</strong>, такие как: <code>Uncaught ReferenceError: $index is not defined</code></p>
</div>
{% endraw %}

### `track-by` <sup>заменён</sup>

`track-by` был заменён на `key`, и работал как любой другой атрибут: без директивы `v-bind:` или префикса `:`, и воспринимался как буквенная строка. В большинстве же случаев вам захочется использовать динамичную связку, которая требует написания полного выражения, а не просто ключа. Например, вместо:

``` html
<div v-for="item in items" track-by="id">
```

Вы теперь напишете:

``` html
<div v-for="item in items" v-bind:key="item.id">
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">миграционного помощника</a> в вашем проекте, чтобы найти примеры использования <code>track-by</code>.</p>
</div>
{% endraw %}

### Диапазон значений  в `v-for` <sup>изменено</sup>

Раньше в `v-for="number in 10"` мы имели значение `number`, начиная от 0 и заканчивая 9. Теперь это значение начинается с 1 и заканчивается 10.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Сделайте поиск в вашем коде на регулярное выражение <code>/\w+ in \d+/</code>. Везде, где найдётся <code>v-for</code>, проверьте, затронуло ли это ваш проект.</p>
</div>
{% endraw %}

## Props

### `coerce` Prop Option <sup>удалён</sup>

If you want to coerce a prop, setup a local computed value based on it instead. For example, instead of:

``` js
props: {
  username: {
    type: String,
    coerce: function (value) {
      return value
        .toLowerCase()
        .replace(/\s+/, '-')
    }
  }
}
```

You could write:

``` js
props: {
  username: String,
},
computed: {
  normalizedUsername: function () {
    return this.username
      .toLowerCase()
      .replace(/\s+/, '-')
  }
}
```

There are a few advantages:

- You still have access to the original value of the prop.
- You are forced to be more explicit, by giving your coerced value a name that differentiates it from the value passed in the prop.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>coerce</code> option.</p>
</div>
{% endraw %}

### `twoWay` Prop Option <sup>удалён</sup>

Props are now always one-way down. To produce side effects in the parent scope, a component needs to explicitly emit an event instead of relying on implicit binding. For more information, see:

- [Custom component events](components.html#Custom-Events)
- [Custom input components](components.html#Form-Input-Components-using-Custom-Events) (using component events)
- [Global state management](state-management.html)

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>twoWay</code> option.</p>
</div>
{% endraw %}

### `.once` and `.sync` Modifiers on `v-bind` <sup>удалён</sup>

Props are now always one-way down. To produce side effects in the parent scope, a component needs to explicitly emit an event instead of relying on implicit binding. For more information, see:

- [Custom component events](components.html#Custom-Events)
- [Custom input components](components.html#Form-Input-Components-using-Custom-Events) (using component events)
- [Global state management](state-management.html)

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>.once</code> and <code>.sync</code> modifiers.</p>
</div>
{% endraw %}

### Prop Mutation <sup>deprecated</sup>

Mutating a prop locally is now considered an anti-pattern, e.g. declaring a prop and then setting `this.myProp = 'someOtherValue'` in the component. Due to the new rendering mechanism, whenever the parent component re-renders, the child component's local changes will be overwritten.

Most use cases of mutating a prop can be replaced by one of these options:

- a data property, with the prop used to set its default value
- a computed property

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Run your end-to-end test suite or app after upgrading and look for <strong>console warnings</strong> about prop mutations.</p>
</div>
{% endraw %}

### Props on a Root Instance <sup>заменён</sup>

On root Vue instances (i.e. instances created with `new Vue({ ... })`), you must use `propsData` instead of `props`.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Run your end-to-end test suite, if you have one. The <strong>failed tests</strong> should alert to you to the fact that props passed to root instances are no longer working.</p>
</div>
{% endraw %}

## Computed properties

### `cache: false` <sup>deprecated</sup>

Caching invalidation of computed properties will be removed in future major versions of Vue. Replace any uncached computed properties with methods, which will have the same result.

For example:

``` js
template: '<p>message: {{ timeMessage }}</p>',
computed: {
  timeMessage: {
    cache: false,
    get: function () {
      return Date.now() + this.message
    }
  }
}
```

Or with component methods:

``` js
template: '<p>message: {{ getTimeMessage() }}</p>',
methods: {
  getTimeMessage: function () {
    return Date.now() + this.message
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>cache: false</code> option.</p>
</div>
{% endraw %}

## Built-In Directives

### Truthiness/Falsiness with `v-bind` <sup>changed</sup>

When used with `v-bind`, the only falsy values are now: `null`, `undefined`, and `false`. This means `0` and empty strings will render as truthy. So for example, `v-bind:draggable="''"` will render as `draggable="true"`.

For enumerated attributes, in addition to the falsy values above, the string `"false"` will also render as `attr="false"`.

<p class="tip">Note that for other directives (e.g. `v-if` and `v-show`), JavaScript's normal truthiness still applies.</p>

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Run your end-to-end test suite, if you have one. The <strong>failed tests</strong> should alert to you to any parts of your app that may be affected by this change.</p>
</div>
{% endraw %}

### Listening for Native Events on Components with `v-on` <sup>changed</sup>

When used on a component, `v-on` now only listens to custom events `$emit`ted by that component. To listen for a native DOM event on the root element, you can use the `.native` modifier. For example:

``` html
<my-component v-on:click.native="doSomething"></my-component>
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Run your end-to-end test suite, if you have one. The <strong>failed tests</strong> should alert to you to any parts of your app that may be affected by this change.</p>
</div>
{% endraw %}

### `debounce` Param Attribute for `v-model` <sup>удалён</sup>

Debouncing is used to limit how often we execute Ajax requests and other expensive operations. Vue's `debounce` attribute parameter for `v-model` made this easy for very simple cases, but it actually debounced __state updates__ rather than the expensive operations themselves. It's a subtle difference, but it comes with limitations as an application grows.

These limitations become apparent when designing a search indicator, like this one for example:

{% raw %}
<script src="https://cdn.jsdelivr.net/lodash/4.13.1/lodash.js"></script>
<div id="debounce-search-demo" class="demo">
  <input v-model="searchQuery" placeholder="Type something">
  <strong>{{ searchIndicator }}</strong>
</div>
<script>
new Vue({
  el: '#debounce-search-demo',
  data: {
    searchQuery: '',
    searchQueryIsDirty: false,
    isCalculating: false
  },
  computed: {
    searchIndicator: function () {
      if (this.isCalculating) {
        return '⟳ Fetching new results'
      } else if (this.searchQueryIsDirty) {
        return '... Typing'
      } else {
        return '✓ Done'
      }
    }
  },
  watch: {
    searchQuery: function () {
      this.searchQueryIsDirty = true
      this.expensiveOperation()
    }
  },
  methods: {
    expensiveOperation: _.debounce(function () {
      this.isCalculating = true
      setTimeout(function () {
        this.isCalculating = false
        this.searchQueryIsDirty = false
      }.bind(this), 1000)
    }, 500)
  }
})
</script>
{% endraw %}

Using the `debounce` attribute, there'd be no way to detect the "Typing" state, because we lose access to the input's real-time state. By decoupling the debounce function from Vue however, we're able to debounce only the operation we want to limit, removing the limits on features we can develop:

``` html
<!--
By using the debounce function from lodash or another dedicated
utility library, we know the specific debounce implementation we
use will be best-in-class - and we can use it ANYWHERE. Not only
in our template.
-->
<script src="https://cdn.jsdelivr.net/lodash/4.13.1/lodash.js"></script>
<div id="debounce-search-demo">
  <input v-model="searchQuery" placeholder="Type something">
  <strong>{{ searchIndicator }}</strong>
</div>
```

``` js
new Vue({
  el: '#debounce-search-demo',
  data: {
    searchQuery: '',
    searchQueryIsDirty: false,
    isCalculating: false
  },
  computed: {
    searchIndicator: function () {
      if (this.isCalculating) {
        return '⟳ Fetching new results'
      } else if (this.searchQueryIsDirty) {
        return '... Typing'
      } else {
        return '✓ Done'
      }
    }
  },
  watch: {
    searchQuery: function () {
      this.searchQueryIsDirty = true
      this.expensiveOperation()
    }
  },
  methods: {
    // This is where the debounce actually belongs.
    expensiveOperation: _.debounce(function () {
      this.isCalculating = true
      setTimeout(function () {
        this.isCalculating = false
        this.searchQueryIsDirty = false
      }.bind(this), 1000)
    }, 500)
  }
})
```

Another advantage of this approach is there will be times when debouncing isn't quite the right wrapper function. For example, when hitting an API for search suggestions, waiting to offer suggestions until after the user has stopped typing for a period of time isn't an ideal experience. What you probably want instead is a __throttling__ function. Now since you're already using a utility library like lodash, refactoring to use its `throttle` function instead takes only a few seconds.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>debounce</code> attribute.</p>
</div>
{% endraw %}

### `lazy` or `number` Param Attributes for `v-model` <sup>заменён</sup>

The `lazy` and `number` param attributes are now modifiers, to make it more clear what That means instead of:

``` html
<input v-model="name" lazy>
<input v-model="age" type="number" number>
```

You would use:

``` html
<input v-model.lazy="name">
<input v-model.number="age" type="number">
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the these param attributes.</p>
</div>
{% endraw %}

### `value` Attribute with `v-model` <sup>удалён</sup>

`v-model` no longer cares about the initial value of an inline `value` attribute. For predictability, it will instead always treat the Vue instance data as the source of truth.

That means this element:

``` html
<input v-model="text" value="foo">
```

backed by this data:

``` js
data: {
  text: 'bar'
}
```

will render with a value of "bar" instead of "foo". The same goes for a `<textarea>` with existing content. Instead of:

``` html
<textarea v-model="text">
  hello world
</textarea>
```

You should ensure your initial value for `text` is "hello world".

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Run your end-to-end test suite or app after upgrading and look for <strong>console warnings</strong> about inline value attributes with <code>v-model</code>.</p>
</div>
{% endraw %}

### `v-model` with `v-for` Iterated Primitive Values <sup>удалён</sup>

Cases like this no longer work:

``` html
<input v-for="str in strings" v-model="str">
```

The reason is this is the equivalent JavaScript that the `<input>` would compile to:

``` js
strings.map(function (str) {
  return createElement('input', ...)
})
```

As you can see, `v-model`'s two-way binding doesn't make sense here. Setting `str` to another value in the iterator function will do nothing because it's only a local variable in the function scope.

Instead, you should use an array of __objects__ so that `v-model` can update the field on the object. For example:

``` html
<input v-for="obj in objects" v-model="obj.str">
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Run your test suite, if you have one. The <strong>failed tests</strong> should alert to you to any parts of your app that may be affected by this change.</p>
</div>
{% endraw %}

### `v-bind:style` with Object Syntax and `!important` <sup>удалён</sup>

This will no longer work:

``` html
<p v-bind:style="{ color: myColor + ' !important' }">hello</p>
```

If you really need to override another `!important`, you must use the string syntax:

``` html
<p v-bind:style="'color: ' + myColor + ' !important'">hello</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of style bindings with <code>!important</code> in objects.</p>
</div>
{% endraw %}

### `v-el` and `v-ref` <sup>заменён</sup>

For simplicity, `v-el` and `v-ref` have been merged into the `ref` attribute, accessible on a component instance via `$refs`. That means `v-el:my-element` would become `ref="myElement"` and `v-ref:my-component` would become `ref="myComponent"`. When used on a normal element, the `ref` will be the DOM element, and when used on a component, the `ref` will be the component instance.

Since `v-ref` is no longer a directive, but a special attribute, it can also be dynamically defined. This is especially useful in combination with `v-for`. For example:

``` html
<p v-for="item in items" v-bind:ref="'item' + item.id"></p>
```

Previously, `v-el`/`v-ref` combined with `v-for` would produce an array of elements/components, because there was no way to give each item a unique name. You can still achieve this behavior by given each item the same `ref`:

``` html
<p v-for="item in items" ref="items"></p>
```

Unlike in 1.x, these `$refs` are not reactive, because they're registered/updated during the render process itself. Making them reactive would require duplicate renders for every change.

On the other hand, `$refs` are designed primarily for programmatic access in JavaScript - it is not recommended to rely on them in templates, because that would mean referring to state that does not belong to the instance itself. This would violate Vue's data-driven view model.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>v-el</code> and <code>v-ref</code>.</p>
</div>
{% endraw %}

### `v-else` with `v-show` <sup>удалён</sup>

`v-else` no longer works with `v-show`. Use `v-if` with a negation expression instead. For example, instead of:

``` html
<p v-if="foo">Foo</p>
<p v-else v-show="bar">Not foo, but bar</p>
```

You can use:

``` html
<p v-if="foo">Foo</p>
<p v-if="!foo && bar">Not foo, but bar</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>v-else</code> with <code>v-show</code>.</p>
</div>
{% endraw %}

## Пользовательские Директивы <sup>упрощены<sup>

Directives have a greatly reduced scope of responsibility: they are now only used for applying low-level direct DOM manipulations. In most cases, you should prefer using components as the main code-reuse abstraction.

Some of the most notable differences include:

- Directives no longer have instances. This means there's no more `this` inside directive hooks. Instead, they receive everything they might need as arguments. If you really must persist state across hooks, you can do so on `el`.
- Options such as `acceptStatement`, `deep`, `priority`, etc have all been removed. To replace `twoWay` directives, see [this example](#Two-Way-Filters-replaced).
- Some of the current hooks have different behavior and there are also a couple new hooks.

Fortunately, since the new directives are much simpler, you can master them more easily. Read the new [Custom Directives guide](custom-directive.html) to learn more.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of defined directives. The helper will flag all of them, as it's likely in most cases that you'll want to refactor to a component.</p>
</div>
{% endraw %}

### Directive `.literal` Modifier <sup>удалён</sup>

The `.literal` modifier has been removed, as the same can be easily achieved by providing a string literal as the value.

For example, you can update:

``` js
<p v-my-directive.literal="foo bar baz"></p>
```

to:

``` html
<p v-my-directive="'foo bar baz'"></p>
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the `.literal` modifier on a directive.</p>
</div>
{% endraw %}

## Transitions

### `transition` Attribute <sup>заменён</sup>

Vue's transition system has changed quite drastically and now uses `<transition>` and `<transition-group>` wrapper elements, rather than the `transition` attribute. It's recommended to read the new [Transitions guide](transitions.html) to learn more.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>transition</code> attribute.</p>
</div>
{% endraw %}

### `Vue.transition` for Reusable Transitions <sup>заменён</sup>

With the new transition system, you can now [use components for reusable transitions](transitions.html#Reusable-Transitions).

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.transition</code>.</p>
</div>
{% endraw %}

### Transition `stagger` Attribute <sup>удалён</sup>

If you need to stagger list transitions, you can control timing by setting and accessing a `data-index` (or similar attribute) on an element. See [an example here](transitions.html#Staggering-List-Transitions).

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the <code>transition</code> attribute. During your update, you can transition (pun very much intended) to the new staggering strategy as well.</p>
</div>
{% endraw %}

## Events

### `events` option <sup>удалён</sup>

The `events` option has been removed. Event handlers should now be registered in the `created` hook instead. Check out the [`$dispatch` and `$broadcast` migration guide](#dispatch-and-broadcast-replaced) for a detailed example.

### `Vue.directive('on').keyCodes` <sup>заменён</sup>

The new, more concise way to configure `keyCodes` is through `Vue.config.keyCodes`. For example:

``` js
// enable v-on:keyup.f1
Vue.config.keyCodes.f1 = 112
```
{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the the old <code>keyCode</code> configuration syntax.</p>
</div>
{% endraw %}

### `$dispatch` and `$broadcast` <sup>заменён</sup>

`$dispatch` and `$broadcast` have been removed in favor of more explicitly cross-component communication and more maintainable state management solutions, such as [Vuex](https://github.com/vuejs/vuex).

The problem is event flows that depend on a component's tree structure can be hard to reason about and are very brittle when the tree becomes large. They don't scale well and only set you up for pain later. `$dispatch` and `$broadcast` also do not solve communication between sibling components.

One of the most common uses for these methods is to communicate between a parent and its direct children. In these cases, you can actually [listen to an `$emit` from a child with `v-on`](components.html#Form-Input-Components-using-Custom-Events). This allows you to keep the convenience of events with added explicitness.

However, when communicating between distant descendants/ancestors, `$emit` won't help you. Instead, the simplest possible upgrade would be to use a centralized event hub. This has the added benefit of allowing you to communicate between components no matter where they are in the component tree - even between siblings! Because Vue instances implement an event emitter interface, you can actually use an empty Vue instance for this purpose.

For example, let's say we have a todo app structured like this:

```
Todos
├─ NewTodoInput
└─ Todo
   └─ DeleteTodoButton
```

We could manage communication between components with this single event hub:

``` js
// This is the event hub we'll use in every
// component to communicate between them.
var eventHub = new Vue()
```

Then in our components, we can use `$emit`, `$on`, `$off` to emit events, listen for events, and clean up event listeners, respectively:

``` js
// NewTodoInput
// ...
methods: {
  addTodo: function () {
    eventHub.$emit('add-todo', { text: this.newTodoText })
    this.newTodoText = ''
  }
}
```

``` js
// DeleteTodoButton
// ...
methods: {
  deleteTodo: function (id) {
    eventHub.$emit('delete-todo', id)
  }
}
```

``` js
// Todos
// ...
created: function () {
  eventHub.$on('add-todo', this.addTodo)
  eventHub.$on('delete-todo', this.deleteTodo)
},
// It's good to clean up event listeners before
// a component is destroyed.
beforeDestroy: function () {
  eventHub.$off('add-todo', this.addTodo)
  eventHub.$off('delete-todo', this.deleteTodo)
},
methods: {
  addTodo: function (newTodo) {
    this.todos.push(newTodo)
  },
  deleteTodo: function (todoId) {
    this.todos = this.todos.filter(function (todo) {
      return todo.id !== todoId
    })
  }
}
```

This pattern can serve as a replacement for `$dispatch` and `$broadcast` in simple scenarios, but for more complex cases, it's recommended to use a dedicated state management layer such as [Vuex](https://github.com/vuejs/vuex).

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>$dispatch</code> and <code>$broadcast</code>.</p>
</div>
{% endraw %}

## Filters

### Filters Outside Text Interpolations <sup>удалён</sup>

Filters can now only be used inside text interpolations (`{% raw %}{{ }}{% endraw %}` tags). In the past we've found using filters within directives such as `v-model`, `v-on`, etc led to more complexity than convenience. For list filtering on `v-for`, it's also better to move that logic into JavaScript as computed properties, so that it can be reused throughout your component.

In general, whenever something can be achieved in plain JavaScript, we want to avoid introducing a special syntax like filters to take care of the same concern. Here's how you can replace Vue's built-in directive filters:

#### Replacing the `debounce` Filter

Instead of:

``` html
<input v-on:keyup="doStuff | debounce 500">
```

``` js
methods: {
  doStuff: function () {
    // ...
  }
}
```

Use [lodash's `debounce`](https://lodash.com/docs/4.15.0#debounce) (or possibly [`throttle`](https://lodash.com/docs/4.15.0#throttle)) to directly limit calling the expensive method. You can achieve the same as above like this:

``` html
<input v-on:keyup="doStuff">
```

``` js
methods: {
  doStuff: _.debounce(function () {
    // ...
  }, 500)
}
```

For more on the advantages of this strategy, see [the example here with `v-model`](#debounce-Param-Attribute-for-v-model-removed).

#### Replacing the `limitBy` Filter

Instead of:

``` html
<p v-for="item in items | limitBy 10">{{ item }}</p>
```

Use JavaScript's built-in [`.slice` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice#Examples) in a computed property:

``` html
<p v-for="item in filteredItems">{{ item }}</p>
```

``` js
computed: {
  filteredItems: function () {
    return this.items.slice(0, 10)
  }
}
```

#### Replacing the `filterBy` Filter

Instead of:

``` html
<p v-for="user in users | filterBy searchQuery in 'name'">{{ user.name }}</p>
```

Use JavaScript's built-in [`.filter` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#Examples) in a computed property:

``` html
<p v-for="user in filteredUsers">{{ user.name }}</p>
```

``` js
computed: {
  filteredUsers: function () {
    var self = this
    return self.users.filter(function (user) {
      return user.name.indexOf(self.searchQuery) !== -1
    })
  }
}
```

JavaScript's native `.filter` can also manage much more complex filtering operations, because you have access to the full power of JavaScript within computed properties. For example, if you wanted to find all active users and case-insensitively match against both their name and email:

``` js
var self = this
self.users.filter(function (user) {
  var searchRegex = new RegExp(self.searchQuery, 'i')
  return user.isActive && (
    searchRegex.test(user.name) ||
    searchRegex.test(user.email)
  )
})
```

#### Replacing the `orderBy` Filter

Instead of:

``` html
<p v-for="user in users | orderBy 'name'">{{ user.name }}</p>
```

Use [lodash's `orderBy`](https://lodash.com/docs/4.15.0#orderBy) (or possibly [`sortBy`](https://lodash.com/docs/4.15.0#sortBy)) in a computed property:

``` html
<p v-for="user in orderedUsers">{{ user.name }}</p>
```

``` js
computed: {
  orderedUsers: function () {
    return _.orderBy(this.users, 'name')
  }
}
```

You can even order by multiple columns:

``` js
_.orderBy(this.users, ['name', 'last_login'], ['asc', 'desc'])
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of filters being used inside directives. If you miss any, you should also see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### Filter Argument Syntax <sup>changed</sup>

Filters' syntax for arguments now better aligns with JavaScript function invocation. So instead of taking space-delimited arguments:

``` html
<p>{{ date | formatDate 'YY-MM-DD' timeZone }}</p>
```

We surround the arguments with parentheses and delimit the arguments with commas:

``` html
<p>{{ date | formatDate('YY-MM-DD', timeZone) }}</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the old filter syntax. If you miss any, you should also see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### Built-In Text Filters <sup>удалён</sup>

Although filters within text interpolations are still allowed, all of the filters have been removed. Instead, it's recommended to use more specialized libraries for solving problems in each domain (e.g. [`date-fns`](https://date-fns.org/) to format dates and [`accounting`](http://openexchangerates.github.io/accounting.js/) for currencies).

For each of Vue's built-in text filters, we go through how you can replace them below. The example code could exist in custom helper functions, methods, or computed properties.

#### Replacing the `json` Filter

You actually don't need to for debugging anymore, as Vue will nicely format output for you automatically, whether it's a string, number, array, or plain object. If you want the exact same functionality as JavaScript's `JSON.stringify` though, then you can use that in a method or computed property.

#### Replacing the `capitalize` Filter

``` js
text[0].toUpperCase() + text.slice(1)
```

#### Replacing the `uppercase` Filter

``` js
text.toUpperCase()
```

#### Replacing the `lowercase` Filter

``` js
text.toLowerCase()
```

#### Replacing the `pluralize` Filter

The [pluralize](https://www.npmjs.com/package/pluralize) package on NPM serves this purpose nicely, but if you only want to pluralize a specific word or want to have special output for cases like `0`, then you can also easily define your own pluralize functions. For example:

``` js
function pluralizeKnife (count) {
  if (count === 0) {
    return 'no knives'
  } else if (count === 1) {
    return '1 knife'
  } else {
    return count + 'knives'
  }
}
```

#### Replacing the `currency` Filter

For a very naive implementation, you could do something like this:

``` js
'$' + price.toFixed(2)
```

In many cases though, you'll still run into strange behavior (e.g. `0.035.toFixed(2)` rounds up to `0.04`, but `0.045` rounds down to `0.04`). To work around these issues, you can use the [`accounting`](http://openexchangerates.github.io/accounting.js/) library to more reliably format currencies.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the obsolete text filters. If you miss any, you should also see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### Two-Way Filters <sup>заменён</sup>

Some users have enjoyed using two-way filters with `v-model` to create interesting inputs with very little code. While _seemingly_ simple however, two-way filters can also hide a great deal of complexity - and even encourage poor UX by delaying state updates. Instead, components wrapping an input are recommended as a more explicit and feature-rich way of creating custom inputs.

As an example, we'll now walk the migration of a two-way currency filter:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/6744xnjk/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

It mostly works well, but the delayed state updates can cause strange behavior. For example, click on the `Result` tab and try entering `9.999` into one of those inputs. When the input loses focus, its value will update to `$10.00`. When looking at the calculated total however, you'll see that `9.999` is what's stored in our data. The version of reality that the user sees is out of sync!

To start transitioning towards a more robust solution using Vue 2.0, let's first wrap this filter in a new `<currency-input>` component:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/943zfbsh/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

This allows us add behavior that a filter alone couldn't encapsulate, such as selecting the content of an input on focus. Now the next step will be to extract the business logic from the filter. Below, we pull everything out into an external [`currencyValidator` object](https://gist.github.com/chrisvfritz/5f0a639590d6e648933416f90ba7ae4e):

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/9c32kev2/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

This increased modularity not only makes it easier to migrate to Vue 2, but also allows currency parsing and formatting to be:

- unit tested in isolation from your Vue code
- used by other parts of your application, such as to validate the payload to an API endpoint

Having this validator extracted out, we've also more comfortably built it up into a more robust solution. The state quirks have been eliminated and it's actually impossible for users to enter anything wrong, similar to what the browser's native number input tries to do.

We're still limited however, by filters and by Vue 1.0 in general, so let's complete the upgrade to Vue 2.0:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/1oqjojjx/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

You may notice that:

- Every aspect of our input is more explicit, using lifecycle hooks and DOM events in place of the hidden behavior of two-way filters.
- We can now use `v-model` directly on our custom inputs, which is not only more consistent with normal inputs, but also means our component is Vuex-friendly.
- Since we're no longer using filter options that require a value to be returned, our currency work could actually be done asynchronously. That means if we had a lot of apps that had to work with currencies, we could easily refactor this logic into a shared microservice.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of filters used in directives like <code>v-model</code>. If you miss any, you should also see <strong>console errors</strong>.</p>
</div>
{% endraw %}

## Slots

### Duplicate Slots <sup>удалён</sup>

It is no longer supported to have `<slot>`s with the same name in the same template. When a slot is rendered it is "used up" and cannot be rendered elsewhere in the same render tree. If you must render the same content in multiple places, pass that content as a prop.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Run your end-to-end test suite or app after upgrading and look for <strong>console warnings</strong> about duplicate slots <code>v-model</code>.</p>
</div>
{% endraw %}

### `slot` Attribute Styling <sup>удалён</sup>

Content inserted via named `<slot>` no longer preserves the `slot` attribute. Use a wrapper element to style them, or for advanced use cases, modify the inserted content programmatically using [render functions](render-function.html).

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find CSS selectors targeting named slots (e.g. <code>[slot="my-slot-name"]</code>).</p>
</div>
{% endraw %}

## Special Attributes

### `keep-alive` Attribute <sup>заменён</sup>

`keep-alive` is no longer a special attribute, but rather a wrapper component, similar to `<transition>`. For example:

``` html
<keep-alive>
  <component v-bind:is="view"></component>
</keep-alive>
```

This makes it possible to use `<keep-alive>` on multiple conditional children:

``` html
<keep-alive>
  <todo-list v-if="todos.length > 0"></todo-list>
  <no-todos-gif v-else></no-todos-gif>
</keep-alive>
```

<p class="tip">When `<keep-alive>` has multiple children, they should eventually evaluate to a single child. Any child other than the first one will be ignored.</p>

When used together with `<transition>`, make sure to nest it inside:

``` html
<transition>
  <keep-alive>
    <component v-bind:is="view"></component>
  </keep-alive>
</transition>
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find <code>keep-alive</code> attributes.</p>
</div>
{% endraw %}

## Interpolation

### Interpolation within Attributes <sup>удалён</sup>

Interpolation within attributes is no longer valid. For example:

``` html
<button class="btn btn-{{ size }}"></button>
```

Should either be updated to use an inline expression:

``` html
<button v-bind:class="'btn btn-' + size"></button>
```

Or a data/computed property:

``` html
<button v-bind:class="buttonClasses"></button>
```

``` js
computed: {
  buttonClasses: function () {
    return 'btn btn-' + size
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of interpolation used within attributes.</p>
</div>
{% endraw %}

### HTML Interpolation <sup>удалён</sup>

HTML interpolations (`{% raw %}{{{ foo }}}{% endraw %}`) have been removed in favor of the [`v-html` directive](../api/#v-html).

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find HTML interpolations.</p>
</div>
{% endraw %}

### One-Time Bindings <sup>заменён</sup>

One time bindings (`{% raw %}{{* foo }}{% endraw %}`) have been replaced by the new [`v-once` directive](../api/#v-once).

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find one-time bindings.</p>
</div>
{% endraw %}

## Reactivity

### `vm.$watch` <sup>changed</sup>

Watchers created via `vm.$watch` are now fired before the associated component rerenders. This gives you the chance to further update state before the component rerender, thus avoiding unnecessary updates. For example, you can watch a component prop and update the component's own data when the prop changes.

If you were previously relying on `vm.$watch` to do something with the DOM after a component updates, you can instead do so in the `updated` lifecycle hook.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Run your end-to-end test suite, if you have one. The <strong>failed tests</strong> should alert to you to the fact that a watcher was relying on the old behavior.</p>
</div>
{% endraw %}

### `vm.$set` <sup>changed</sup>

`vm.$set` is now an alias for [`Vue.set`](../api/#Vue-set).

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the obsolete usage.</p>
</div>
{% endraw %}

### `vm.$delete` <sup>changed</sup>

`vm.$delete` is now an alias for [`Vue.delete`](../api/#Vue-delete).

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of the obsolete usage.</p>
</div>
{% endraw %}

### `Array.prototype.$set` <sup>удалён</sup>

Use `Vue.set` instead.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>.$set</code> on an array. If you miss any, you should see <strong>console errors</strong> from the missing method.</p>
</div>
{% endraw %}

### `Array.prototype.$remove` <sup>удалён</sup>

Use `Array.prototype.splice` instead. For example:

``` js
methods: {
  removeTodo: function (todo) {
    var index = this.todos.indexOf(todo)
    this.todos.splice(index, 1)
  }
}
```

Or better yet, pass removal methods an index:

``` js
methods: {
  removeTodo: function (index) {
    this.todos.splice(index, 1)
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>.$remove</code> on an array. If you miss any, you should see <strong>console errors</strong> from the missing method.</p>
</div>
{% endraw %}

### `Vue.set` and `Vue.delete` on Vue instances <sup>удалён</sup>

`Vue.set` and `Vue.delete` can no longer work on Vue instances. It is now mandatory to properly declare all top-level reactive properties in the data option. If you'd like to delete properties on a Vue instance or its `$data`, set it to null.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.set</code> or <code>Vue.delete</code> on a Vue instance. If you miss any, they'll trigger <strong>console warnings</strong>.</p>
</div>
{% endraw %}

### Replacing `vm.$data` <sup>удалён</sup>

It is now prohibited to replace a component instance's root $data. This prevents some edge cases in the reactivity system and makes the component state more predictable (especially with type-checking systems).

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of overwriting <code>vm.$data</code>. If you miss any, <strong>console warnings</strong> will be emitted.</p>
</div>
{% endraw %}

### `vm.$get` <sup>удалён</sup>

Instead, retrieve reactive data directly.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$get</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

## DOM-Focused Instance Methods

### `vm.$appendTo` <sup>удалён</sup>

Use the native DOM API:

``` js
myElement.appendChild(vm.$el)
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$appendTo</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### `vm.$before` <sup>удалён</sup>

Use the native DOM API:

``` js
myElement.parentNode.insertBefore(vm.$el, myElement)
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$before</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### `vm.$after` <sup>удалён</sup>

Use the native DOM API:

``` js
myElement.parentNode.insertBefore(vm.$el, myElement.nextSibling)
```

Or if `myElement` is the last child:

``` js
myElement.parentNode.appendChild(vm.$el)
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$after</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### `vm.$remove` <sup>удалён</sup>

Use the native DOM API:

``` js
vm.$el.remove()
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$remove</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

## Meta Instance Methods

### `vm.$eval` <sup>удалён</sup>

No real use. If you do happen to rely on this feature somehow and aren't sure how to work around it, post on [the forum](https://forum.vuejs.org/) for ideas.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$eval</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### `vm.$interpolate` <sup>удалён</sup>

No real use. If you do happen to rely on this feature somehow and aren't sure how to work around it, post on [the forum](https://forum.vuejs.org/) for ideas.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$interpolate</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

### `vm.$log` <sup>удалён</sup>

Use the [Vue Devtools](https://github.com/vuejs/vue-devtools) for the optimal debugging experience.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>vm.$log</code>. If you miss any, you'll see <strong>console errors</strong>.</p>
</div>
{% endraw %}

## Instance DOM Options

### `replace: false` <sup>удалён</sup>

Components now always replace the element they're bound to. To simulate the behavior of `replace: false`, you can wrap your root component with an element similar to the one you're replacing. For example:

``` js
new Vue({
  el: '#app',
  template: '<div id="app"> ... </div>'
})
```

Or with a render function:

``` js
new Vue({
  el: '#app',
  render: function (h) {
    h('div', {
      attrs: {
        id: 'app',
      }
    }, /* ... */)
  }
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>replace: false</code>.</p>
</div>
{% endraw %}

## Global Config

### `Vue.config.debug` <sup>удалён</sup>

No longer necessary, since warnings come with stack traces by default now.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.config.debug</code>.</p>
</div>
{% endraw %}

### `Vue.config.async` <sup>удалён</sup>

Async is now required for rendering performance.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.config.async</code>.</p>
</div>
{% endraw %}

### `Vue.config.delimiters` <sup>заменён</sup>

This has been reworked as a [component-level option](../api/#delimiters). This allows you to use alternative delimiters within your app without breaking 3rd-party components.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.config.delimiters</code>.</p>
</div>
{% endraw %}

### `Vue.config.unsafeDelimiters` <sup>удалён</sup>

HTML interpolation has been [removed in favor of `v-html`](#HTML-Interpolation-removed).

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.config.unsafeDelimiters</code>. After this, the helper will also find instances of HTML interpolation so that you can replace them with `v-html`.</p>
</div>
{% endraw %}

## Global API

### `Vue.extend` with `el` <sup>удалён</sup>

The el option can no longer be used in `Vue.extend`. It's only valid as an instance creation option.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Run your end-to-end test suite or app after upgrading and look for <strong>console warnings</strong> about the <code>el</code> option with <code>Vue.extend</code>.</p>
</div>
{% endraw %}

### `Vue.elementDirective` <sup>удалён</sup>

Use components instead.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.elementDirective</code>.</p>
</div>
{% endraw %}

### `Vue.partial` <sup>удалён</sup>

Partials have been removed in favor of more explicit data flow between components, using props. Unless you're using a partial in a performance-critical area, the recommendation is to use a [normal component](components.html) instead. If you were dynamically binding the `name` of a partial, you can use a [dynamic component](components.html#Dynamic-Components).

If you happen to be using partials in a performance-critical part of your app, then you should upgrade to [functional components](render-function.html#Functional-Components). They must be in a plain JS/JSX file (rather than in a `.vue` file) and are stateless and instanceless, like partials. This makes rendering extremely fast.

A benefit of functional components over partials is that they can be much more dynamic, because they grant you access to the full power of JavaScript. There is a cost to this power however. If you've never used a component framework with render functions before, they may take a bit longer to learn.

{% raw %}
<div class="upgrade-path">
  <h4>Как обновлять</h4>
  <p>Запустите <a href="https://github.com/vuejs/vue-migration-helper">migration helper</a> on your codebase to find examples of <code>Vue.partial</code>.</p>
</div>
{% endraw %}
