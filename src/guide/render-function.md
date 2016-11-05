---
title: Render-Функции
type: guide
order: 14
---

## Основы


В большинстве случаев для формирования HTML с помощью Vue рекомендуется использовать шаблоны. Впрочем, иногда возникает необходимость в использовании всех алгоритмических возможностей JavaScript. В таких случаях можно использовать **render-функции** — низкоуровневую альтернативу шаблонам.

Давайте разберём простой пример, в котором использование `render`-функция будет целесообразным. Предположим, вы хотите сгенерировать заголовки с "якорями":

``` html
<h1>
  <a name="hello-world" href="#hello-world">
    Hello world!
  </a>
</h1>
```

Для генерации вышепредставленного HTML вы решаете использовать такой интерфейс компонента:

``` html
<anchored-heading :level="1">Hello world!</anchored-heading>
```

При использовании шаблонов для реализации такого интерфейса придётся написать что-то вроде кода ниже:

``` html
<script type="text/x-template" id="anchored-heading-template">
  <div>
    <h1 v-if="level === 1">
      <slot></slot>
    </h1>
    <h2 v-if="level === 2">
      <slot></slot>
    </h2>
    <h3 v-if="level === 3">
      <slot></slot>
    </h3>
    <h4 v-if="level === 4">
      <slot></slot>
    </h4>
    <h5 v-if="level === 5">
      <slot></slot>
    </h5>
    <h6 v-if="level === 6">
      <slot></slot>
    </h6>
  </div>
</script>
```

``` js
Vue.component('anchored-heading', {
  template: '#anchored-heading-template',
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

Смотрится не очень. Мало того, что шаблон получился очень многословным — приходится ещё и `<slot></slot>` повторять для каждого возможного уровня заголовка. Бесполезный корневой `div`, вызванный формальным требованием единственности корневого элемента шаблона, тоже красоту конструкции не увеличивает.

Шаблоны хорошо подходят для большинства компонентов, но рассматриваемый — явно не один из них. Давайте попробуем переписать компонент, используя `render`-функцию:

``` js
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // имя тега
      this.$slots.default // массив потомков
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```


Так-то лучше! Наверное. Код короче, но требует более подробного знакомства со свойствами инстанса Vue. В данном случае, необходимо знать, что когда дочерние элементы передаются без указания аттрибута `slot`, как например `Hello world!` внутри `anchored-heading`, они сохраняются в инстансе компонента как `$slots.default`. Если вы этого ещё не сделали, **советуем вам пробежать глазами [API свойств инстанса](/api/#vm-slots) перед тем как углубляться в рассмотрение render-функций.**

## Аргументы `createElement`

Второй момент, с которым необходимо познакомиться, это синтаксис использования возможностей шаблонизации функцией `createElement`. Вот аргументы, которые принимает `createElement`:

``` js
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // Название тега HTML, опции компонента, или функция,
  // их возвращающая. Обязательный параметр.
  'div',

  // {Object}
  // Объект данных, содержащий аттрибуты,
  // который вы бы указали в шаблоне. Опциональный параметр.
  {
    // (см. детали в секции ниже)
  },

  // {String | Array}
  // Дочерние VNode'ы. Опциональный параметр.
  [
    createElement('h1', 'hello world'),
    createElement(MyComponent, {
      props: {
        someProp: 'foo'
      }
    }),
    'bar'
  ]
)
```

### Подробно об Объекте Данных

Заметьте: особым образом рассматриваемые в шаблонах аттрибуты `v-bind:class` и `v-bind:style` и в объектах данных VNode'ов имеют собственные поля на верхнем уровне объектов данных.

``` js
{
  // То же API что и у `v-bind:class`
  'class': {
    foo: true,
    bar: false
  },
  // То же API что и у `v-bind:style`
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // Обычные аттрибуты HTML
  attrs: {
    id: 'foo'
  },
  // Входные параметры компонентов
  props: {
    myProp: 'bar'
  },
  // Свойства DOM
  domProps: {
    innerHTML: 'baz'
  },
  // Обработчики событий располагаются под ключом "on",
  // однако модификаторы вроде как v-on:keyup.enter не
  // поддерживаются. Проверять keyCode придётся вручную.
  on: {
    click: this.clickHandler
  },
  // Только для компонентов. Позволяет слушать нативные события,
  // а не эмитируемые сами компонентом через vm.$emit.
  nativeOn: {
    click: this.nativeClickHandler
  },
  // Пользовательские Директивы. Обратите внимание, что oldValue
  // не может быть указано, поскольку Vue сам отслеживает его
  directives: [
    {
      name: 'my-custom-directive', 
      value: '2'
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // Имя слота, в случае дочернего компонента
  slot: 'name-of-slot'
  // Прочие специальные свойства верхнего уровня
  key: 'myKey',
  ref: 'myRef'
}
```

### Полный Пример

Узнав всё это, мы теперь можем завершить начатый ранее компонент:

``` js
var getChildrenTextContent = function (children) {
  return children.map(function (node) {
    return node.children
      ? getChildrenTextContent(node.children)
      : node.text
  }).join('')
}

Vue.component('anchored-heading', {
  render: function (createElement) {
    // создать id в kebabCase
    var headingId = getChildrenTextContent(this.$slots.default)
      .toLowerCase()
      .replace(/\W+/g, '-')
      .replace(/(^\-|\-$)/g, '')

    return createElement(
      'h' + this.level,
      [
        createElement('a', {
          attrs: {
            name: headingId,
            href: '#' + headingId
          }
        }, this.$slots.default)
      ]
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

### Ограничения

#### VNode'ы Должны Быть Уникальными

Все VNode'ы в компоненте должны быть уникальными. Это значит, что render-функция ниже — не валидна:

``` js
render: function (createElement) {
  var myParagraphVNode = createElement('p', 'hi')
  return createElement('div', [
    // Упс — дублирующиеся VNode'ы!
    myParagraphVNode, myParagraphVNode
  ])
}
```

Если вы действительно хотите многократно использовать один и тот же элемент/компонент, примените функцию-фабрику. Например, следующая render-функция вполне сработает, отобразив 20 идентичных абзацев:

``` js
render: function (createElement) {
  return createElement('div',
    Array.apply(null, { length: 20 }).map(function () {
      return createElement('p', 'hi')
    })
  )
}
```

## Замена Возможностей Шаблонов посредством Простого JavaScript

Wherever something can be easily accomplished in plain JavaScript, Vue render functions do not provide a proprietary alternative. For example, in a template using `v-if` and `v-for`:

``` html
<ul v-if="items.length">
  <li v-for="item in items">{{ item.name }}</li>
</ul>
<p v-else>No items found.</p>
```

This could be rewritten with JavaScript's `if`/`else` and `map` in a render function:

``` js
render: function (createElement) {
  if (this.items.length) {
    return createElement('ul', this.items.map(function (item) {
      return createElement('li', item.name)
    }))
  } else {
    return createElement('p', 'No items found.')
  }
}
```

## JSX

If you're writing a lot of `render` functions, it might feel painful to write something like this:

``` js
createElement(
  'anchored-heading', {
    props: {
      level: 1
    }
  }, [
    createElement('span', 'Hello'),
    ' world!'
  ]
)
```

Especially when the template version is so simple in comparison:

``` html
<anchored-heading :level="1">
  <span>Hello</span> world!
</anchored-heading>
```

That's why there's a [Babel plugin](https://github.com/vuejs/babel-plugin-transform-vue-jsx) to use JSX with Vue, getting us back to a syntax that's closer to templates:

``` js
import AnchoredHeading from './AnchoredHeading.vue'

new Vue({
  el: '#demo',
  render (h) {
    return (
      <AnchoredHeading level={1}>
        <span>Hello</span> world!
      </AnchoredHeading>
    )
  }
})
```

<p class="tip">Aliasing `createElement` to `h` is a common convention you'll see in the Vue ecosystem and is actually required for JSX. If `h` is not available in the scope, your app will throw an error.</p>

For more on how JSX maps to JavaScript, see the [usage docs](https://github.com/vuejs/babel-plugin-transform-vue-jsx#usage).

## Functional Components

The anchored heading component we created earlier is relatively simple. It doesn't manage any state, watch any state passed to it, and it has no lifecycle methods. Really, it's just a function with some props.

In cases like this, we can mark components as `functional`, which means that they're stateless (no `data`) and instanceless (no `this` context). A **functional component** looks like this:

``` js
Vue.component('my-component', {
  functional: true,
  // To compensate for the lack of an instance,
  // we are now provided a 2nd context argument.
  render: function (createElement, context) {
    // ...
  },
  // Props are optional
  props: {
    // ...
  }
})
```

Everything the component needs is passed through `context`, which is an object containing:

- `props`: An object of the provided props
- `children`: An array of the VNode children
- `slots`: A function returning a slots object
- `data`: The entire data object passed to the component
- `parent`: A reference to the parent component

After adding `functional: true`, updating the render function of our anchored heading component would simply require adding the `context` argument, updating `this.$slots.default` to `context.children`, then updating `this.level` to `context.props.level`.

Since functional components are just functions, they're much cheaper to render. They're also very useful as wrapper components. For example, when you need to:

- Programmatically choose one of several other components to delegate to
- Manipulate children, props, or data before passing them on to a child component

Here's an example of a `smart-list` component that delegates to more specific components, depending on the props passed to it:

``` js
var EmptyList = { /* ... */ }
var TableList = { /* ... */ }
var OrderedList = { /* ... */ }
var UnorderedList = { /* ... */ }

Vue.component('smart-list', {
  functional: true,
  render: function (createElement, context) {
    function appropriateListComponent () {
      var items = context.props.items

      if (items.length === 0)           return EmptyList
      if (typeof items[0] === 'object') return TableList
      if (context.props.isOrdered)      return OrderedList

      return UnorderedList
    }

    return createElement(
      appropriateListComponent(),
      context.data,
      context.children
    )
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    isOrdered: Boolean
  }
})
```

### `slots()` vs `children`

You may wonder why we need both `slots()` and `children`. Wouldn't `slots().default` be the same as `children`? In some cases, yes - but what if you have a functional component with the following children?

``` html
<my-functional-component>
  <p slot="foo">
    first
  </p>
  <p>second</p>
</my-functional-component>
```

For this component, `children` will give you both paragraphs, `slots().default` will give you only the second, and `slots().foo` will give you only the first. Having both `children` and `slots()` therefore allows you to choose whether this component knows about a slot system or perhaps delegates that responsibility to another component by simply passing along `children`.

## Template Compilation

You may be interested to know that Vue's templates actually compile to render functions. This is an implementation detail you usually don't need to know about, but if you'd like to see how specific template features are compiled, you may find it interesting. Below is a little demo using `Vue.compile` to live-compile a template string:

{% raw %}
<div id="vue-compile-demo" class="demo">
  <textarea v-model="templateText" rows="10"></textarea>
  <div v-if="typeof result === 'object'">
    <label>render:</label>
    <pre><code>{{ result.render }}</code></pre>
    <label>staticRenderFns:</label>
    <pre v-for="(fn, index) in result.staticRenderFns"><code>_m({{ index }}): {{ fn }}</code></pre>
  </div>
  <div v-else>
    <label>Compilation Error:</label>
    <pre><code>{{ result }}</code></pre>
  </div>
</div>
<script>
new Vue({
  el: '#vue-compile-demo',
  data: {
    templateText: '\
<div>\n\
  <h1>I\'m a template!</h1>\n\
  <p v-if="message">\n\
    {{ message }}\n\
  </p>\n\
  <p v-else>\n\
    No message.\n\
  </p>\n\
</div>\
    ',
  },
  computed: {
    result: function () {
      if (!this.templateText) {
        return 'Enter a valid template above'
      }
      try {
        var result = Vue.compile(this.templateText.replace(/\s{2,}/g, ''))
        return {
          render: this.formatFunction(result.render),
          staticRenderFns: result.staticRenderFns.map(this.formatFunction)
        }
      } catch (error) {
        return error.message
      }
    }
  },
  methods: {
    formatFunction: function (fn) {
      return fn.toString().replace(/(\{\n)(\S)/, '$1  $2')
    }
  }
})
console.error = function (error) {
  throw new Error(error)
}
</script>
<style>
#vue-compile-demo pre {
  padding: 10px;
  overflow-x: auto;
}
#vue-compile-demo code {
  white-space: pre;
  padding: 0
}
#vue-compile-demo textarea {
  width: 100%;

}
</style>
{% endraw %}
