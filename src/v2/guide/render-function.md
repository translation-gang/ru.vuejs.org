---
title: Render-функции и JSX
type: guide
order: 303
---

## Основы

В большинстве случаев для формирования HTML с помощью Vue рекомендуется использовать шаблоны. Впрочем, иногда возникает необходимость в использовании всех алгоритмических возможностей JavaScript. В таких случаях можно применить **`render`-функции** — более низкоуровневую альтернативу шаблонам.

Давайте разберём простой пример, в котором использование `render`-функции будет целесообразным. Предположим, вы хотите сгенерировать заголовки с "якорями":

``` html
<h1>
  <a name="hello-world" href="#hello-world">
    Hello world!
  </a>
</h1>
```

Для генерации представленного выше HTML вы решаете использовать такой интерфейс компонента:

``` html
<anchored-heading :level="1">Hello world!</anchored-heading>
```

При использовании шаблонов для реализации интерфейса который генерирует только заголовок, основанный на свойстве `level`, вы быстро столкнетесь со следующей ситуацией:

``` html
<script type="text/x-template" id="anchored-heading-template">
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

Смотрится не очень. Шаблон получился не только очень многословным — приходится ещё и `<slot></slot>` повторять для каждого возможного уровня заголовка.

Шаблоны хорошо подходят для большинства компонентов, но рассматриваемый сейчас — явно не один из них. Давайте попробуем переписать компонент, используя `render`-функцию:

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

Так-то лучше, наверное? Код короче, но требует более подробного знакомства со свойствами экземпляра Vue. В данном случае, необходимо знать, что когда дочерние элементы передаются без указания атрибута `slot`, как например `Hello world!` внутри `anchored-heading`, они сохраняются в экземпляре компонента как `$slots.default`. Если вы этого ещё не сделали, **советуем вам пробежать глазами [API свойств экземпляра](../api/#Свойства-экземпляра), перед тем как углубляться в рассмотрение render-функций.**

## Узлы, деревья, и виртуальный DOM

Прежде чем погрузиться в `render`-функции, важно знать как работают браузеры. Возьмите этот HTML-код, например:

```html
<div>
  <h1>My title</h1>
  Some text content
  <!-- TODO: Add tagline -->
</div>
```

Когда браузер читает этот код, он создаёт [дерево «узлов DOM»](https://learn.javascript.ru/dom-nodes), чтобы облегчить ему отслеживание всего, как, например, вы могли бы построить генеалогическое дерево для отслеживания вашей увеличивающейся семьи.

Дерево узлов DOM для HTML из примера выше выглядит следующим образом:

![Визуализация дерева DOM](/images/dom-tree.png)

Каждый элемент является узлом. Каждый фрагмент текста является узлом. Даже комментарии это узлы! Узел — это всего лишь часть страницы. И так же, как и в генеалогическом дереве, каждый узел может иметь своих потомков (т.е. каждая часть может содержать в себе другие части).

Обновление всех этих узлов может быть затруднительно, но, к счастью, вам не придётся делать это вручную. Вы просто указываете в шаблоне какой HTML-код вы хотите получить на странице:

```html
<h1>{{ blogTitle }}</h1>
```

Или render-функцию:

``` js
render: function (createElement) {
  return createElement('h1', this.blogTitle)
}
```

В обоих случаях Vue автоматически будет обновлять страницу при изменениях `blogTitle`.

### Виртуальный DOM

Vue реализует это созданием **виртуального DOM**, чтобы отслеживать изменения, которые ему требуется внести в реальный DOM. Рассмотрим подробнее следующую строку:

``` js
return createElement('h1', this.blogTitle)
```

Что в действительности возвращает `createElement`? Это не _в точности_ реальный DOM-элемент. Можно было бы назвать `createNodeDescription` для точности, так как результат содержит информацию, описывающую Vue какой именно узел должен быть отображён на странице, включая описания любых дочерних узлов. Мы называем это описание узла «виртуальной нодой», обычно сокращая до аббревиатуры **VNode**. «Виртуальный DOM» — это то, что мы называем всем деревом VNodes, созданных из дерева компонентов Vue.

## Аргументы `createElement`

Следующий момент, с которым необходимо познакомиться, это синтаксис использования возможностей шаблонизации функцией `createElement`. Вот аргументы, которые принимает `createElement`:

``` js
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // Название тега HTML, опции компонента, или функция,
  // их возвращающая. Обязательный параметр.
  'div',

  // {Object}
  // Объект данных, содержащий атрибуты,
  // который вы бы указали в шаблоне. Опциональный параметр.
  {
    // (см. детали в секции ниже)
  },

  // {String | Array}
  // Дочерние VNode'ы, создаваемые с помощью `createElement()`
  // или просто строки для получения 'текстовых VNode'. Опциональный параметр.
  [
    'Какой-то текст, идущий первым.',
    createElement('h1', 'Заголовок'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar'
      }
    })
  ]
)
```

### Подробно об объекте данных

Заметьте: особым образом рассматриваемые в шаблонах атрибуты `v-bind:class` и `v-bind:style`, и в объектах данных VNode'ов имеют собственные поля на верхнем уровне объектов данных. Этот объект также позволяет вам связывать обычные атрибуты HTML, а также свойства DOM, такие как `innerHTML` (это заменит директиву `v-html`):

``` js
{
  // То же API, что и у `v-bind:class`
  class: {
    foo: true,
    bar: false
  },
  // То же API, что и у `v-bind:style`
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // Обычные атрибуты HTML
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
  // Обработчики событий располагаются под ключом `on`,
  // однако модификаторы, вроде как `v-on:keyup.enter`, не
  // поддерживаются. Проверять keyCode придётся вручную.
  on: {
    click: this.clickHandler
  },
  // Только для компонентов. Позволяет слушать нативные события,
  // а не генерируемые в компоненте через `vm.$emit`.
  nativeOn: {
    click: this.nativeClickHandler
  },
  // Пользовательские директивы. Обратите внимание, что `oldValue`
  // не может быть указано, так как Vue сам его отслеживает
  directives: [
    {
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // Слоты с ограниченной областью видимости в формате
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // Имя слота, если этот компонент
  // является потомком другого компонента
  slot: 'name-of-slot',
  // Прочие специальные свойства верхнего уровня
  key: 'myKey',
  ref: 'myRef'
}
```

### Полный пример

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

#### VNode'ы должны быть уникальными

Все VNode'ы в компоненте должны быть уникальными. Это значит, что `render`-функция ниже — не валидна:

``` js
render: function (createElement) {
  var myParagraphVNode = createElement('p', 'hi')
  return createElement('div', [
    // Упс — дублирующиеся VNode'ы!
    myParagraphVNode, myParagraphVNode
  ])
}
```

Если вы действительно хотите многократно использовать один и тот же элемент/компонент, примените функцию-фабрику. Например, следующая `render`-функция полностью валидный способ для отображения 20 идентичных абзацев:

``` js
render: function (createElement) {
  return createElement('div',
    Array.apply(null, { length: 20 }).map(function () {
      return createElement('p', 'hi')
    })
  )
}
```

## Реализация возможностей шаблона с помощью JavaScript

### `v-if` и `v-for`

Функциональность, легко реализуемая в JavaScript, не требует от Vue какой-либо проприетарной альтернативы. Например, используемые в шаблонах `v-if` и `v-for`:


``` html
<ul v-if="items.length">
  <li v-for="item in items">{{ item.name }}</li>
</ul>
<p v-else>Ничего не найдено.</p>
```

При использовании `render`-функции это можно легко переписать с помощью `if`/`else` и `map`:

``` js
props: ['items'],
render: function (createElement) {
  if (this.items.length) {
    return createElement('ul', this.items.map(function (item) {
      return createElement('li', item.name)
    }))
  } else {
    return createElement('p', 'Ничего не найдено.')
  }
}
```

### `v-model`

В `render`-функции нет прямого аналога `v-model` — вы должны реализовать эту логику самостоятельно:

``` js
props: ['value'],
render: function (createElement) {
  var self = this
  return createElement('input', {
    domProps: {
      value: self.value
    },
    on: {
      input: function (event) {
        self.$emit('input', event.target.value)
      }
    }
  })
}
```

Это цена использования низкоуровневой реализации, которая в то же время предоставляет вам больше контроля над взаимодействием, чем `v-model`.

### События и модификаторы клавиш

Для модификаторов событий `.passive`, `.capture` и `.once`, Vue предоставляет префиксы, которые могут быть использованы вместе с `on`:

| Модификаторы | Префикс |
| ------ | ------ |
| `.passive` | `&` |
| `.capture` | `!` |
| `.once` | `~` |
| `.capture.once` или<br>`.once.capture` | `~!` |

Например:

```javascript
on: {
  '!click': this.doThisInCapturingMode,
  '~keyup': this.doThisOnce,
  '~!mouseover': this.doThisOnceInCapturingMode
}
```

Для всех остальных событий и модификаторов клавиш нет необходимости в префиксе, потому что вы можете просто использовать методы события в обработчике:

| Модификаторы | Эквивалент в обработчике |
| ------ | ------ |
| `.stop` | `event.stopPropagation()` |
| `.prevent` | `event.preventDefault()` |
| `.self` | `if (event.target !== event.currentTarget) return` |
| Клавиши:<br>`.enter`, `.13` | `if (event.keyCode !== 13) return` (измените `13` на [любой другой код клавиши](http://keycode.info/) для модификаторов других клавиш) |
| Модификаторы клавиш:<br>`.ctrl`, `.alt`, `.shift`, `.meta` | `if (!event.ctrlKey) return` (измените `ctrlKey` на `altKey`, `shiftKey` или `metaKey` соответственно) |

Пример использования всех этих модификаторов вместе:

```javascript
on: {
  keyup: function (event) {
    // Ничего не делаем, если элемент на котором произошло
    // событие не является элементом, который мы отслеживаем
    if (event.target !== event.currentTarget) return

    // Ничего не делаем, если клавиша не является Enter (13)
    // и клавиша SHIFT не была нажата в то же время
    if (!event.shiftKey || event.keyCode !== 13) return

    // Останавливаем всплытие события
    event.stopPropagation()

    // Останавливаем стандартный обработчик keyup для этого элемента
    event.preventDefault()
    // ...
  }
}
```

### Слоты

Вы можете получить доступ к статическому содержимому слотов в виде массивов VNode используя [`this.$slots`](../api/#vm-slots):

``` js
render: function (createElement) {
  // `<div><slot></slot></div>`
  return createElement('div', this.$slots.default)
}
```

И получить доступ к слотам со своей областью видимости как к функциям, возвращающим VNode, используя [`this.$scopedSlots`](../api/#vm-scopedSlots):

``` js
props: ['message'],
render: function (createElement) {
  // `<div><slot :text="message"></slot></div>`
  return createElement('div', [
    this.$scopedSlots.default({
      text: this.message
    })
  ])
}
```

Чтобы передать слоты со своей областью видимости в дочерний компонент используя `render`-функцию, применяйте свойство `scopedSlots` в данных VNode:

``` js
render: function (createElement) {
  return createElement('div', [
    createElement('child', {
      // передаём `scopedSlots` в объект data
      // в виде { name: props => VNode | Array<VNode> }
      scopedSlots: {
        default: function (props) {
          return createElement('span', props.text)
        }
      }
    })
  ])
}
```

## JSX

Если приходится писать много `render`-функций, то такой код может утомлять:

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

Особенно в сравнении с кодом аналогичного шаблона:

``` html
<anchored-heading :level="1">
  <span>Hello</span> world!
</anchored-heading>
```

Поэтому есть [плагин для Babel](https://github.com/vuejs/babel-plugin-transform-vue-jsx), позволяющий использовать JSX во Vue, и применять синтаксис, похожий на шаблоны:

``` js
import AnchoredHeading from './AnchoredHeading.vue'

new Vue({
  el: '#demo',
  render: function (h) {
    return (
      <AnchoredHeading level={1}>
        <span>Hello</span> world!
      </AnchoredHeading>
    )
  }
})
```

<p class="tip">Сокращение `createElement` до `h` — распространённое соглашение в экосистеме Vue и обязательное для использования JSX. В случае отсутствия `h` в области видимости, приложение выбросит ошибку.</p>

Подробную информацию о преобразовании JSX в JavaScript можно найти в [документации плагина](https://github.com/vuejs/babel-plugin-transform-vue-jsx#usage).

## Функциональные компоненты

Компонент для заголовков с "якорями", который мы создали выше, довольно прост. У него нет какого-либо состояния, хуков или требующих наблюдения данных. По сути это всего лишь функция с параметром.

В подобных случаях мы можем пометить компоненты как функциональные (опция `functional`), что означает отсутствие у них состояния (нет опции `data`) и экземпляра (нет контекстной переменной `this`). **Функциональный компонент** выглядит так:

``` js
Vue.component('my-component', {
  functional: true,
  // чтобы компенсировать отсутствие экземпляра
  // мы передаём контекст вторым аргументом
  render: function (createElement, context) {
    // ...
  },
  // входные параметры опциональны
  props: {
    // ...
  }
})
```

> Примечание: в версиях до 2.3.0 опция `props` необходима, если вы хотите использовать входные параметры в функциональном компоненте. С версии 2.3.0+ вы можете опустить опцию `props` и все атрибуты, найденные на ноде компонента, будут неявно извлечены в качестве входных данных.

С версии 2.5.0+, если вы используете [однофайловые компоненты](single-file-components.html), вы можете объявить функциональные компоненты основанные на шаблоне таким образом:

``` html
<template functional>
</template>
```

Всё необходимое компоненту передаётся через `context` — объект, содержащий следующие поля:

- `props`: Объект, содержащий переданные входные параметры
- `children`: Массив дочерних VNode'ов
- `slots`: Функция, возвращающая объект slots
- `data`: Объект данных, переданный объекту, целиком
- `parent`: Ссылка на родительский компонент
- `listeners`: (2.3.0+) Объект, содержащий все зарегистрированные в родителе прослушиватели событий. Это просто псевдоним для `data.on`
- `injections`: (2.3.0+) Если используется опция [`inject`](../api/#provide-inject), будет содержать все разрешённые инъекции.

После указания `functional: true`, обновление `render`-функции нашего компонента для заголовков потребует только добавления параметра `context`, обновления `this.$slots.default` на `context.children` и замены `this.level` на `context.props.level`.

Поскольку функциональные компоненты — это просто функции, их рендеринг обходится значительно дешевле. Однако отсутствие постоянного экземпляра означает, что они не будут отображаться в дереве компонентов во [Vue Devtools](https://github.com/vuejs/vue-devtools).

Кроме того, они очень удобны в качестве обёрток. Например, если вам нужно:

- Выбрать один из компонентов для последующего рендеринга в данной точке
- Произвести манипуляции над дочерними элементами, входными параметрами или данными, перед тем как передать их в дочерний компонент

Вот пример компонента `smart-list`, делегирующего рендеринг к более специализированным компонентам, в зависимости от переданных в него данных:

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

### Передача атрибутов и событий дочерним элементам/компонентам
 
В обычных компонентах, атрибуты не определённые как входные параметры, автоматически добавляются к корневому элементу компонента, заменяя или [правильно объединяя](class-and-style.html) любые существующие атрибуты с тем же именем.
 
Однако функциональные компоненты требуют явного определения этого поведения:
 
```js
Vue.component('my-functional-button', {
  functional: true,
  render: function (createElement, context) {
    // Прозрачно передать любые атрибуты, слушатели событий, дочерние элементы и т.д.
    return createElement('button', context.data, context.children)
  }
})
```
 
Передавая `context.data` вторым аргументом в `createElement`, мы передаём любые атрибуты или слушатели событий, используемые на `my-functional-button`. На самом деле это настолько очевидно, что для событий не требуется модификатор `.native`.

Если вы используете функциональные компоненты на основе шаблонов, вам также придётся вручную добавлять атрибуты и слушатели. Поскольку у нас есть доступ к индивидуальному содержимому контекста, мы можем использовать `data.attrs` для передачи любых атрибутов HTML и `listeners` _(псевдоним для `data.on`)_ для передачи любых слушателей событий.

```html
<template functional>
  <button
    class="btn btn-primary"
    v-bind="data.attrs" 
    v-on="listeners"
  >
    <slot/>
  </button>
</template>
```

### `slots()` vs `children`

Вы можете задаться вопросом зачем нужны `slots()` и `children` одновременно. Разве не будет `slots().default` возвращать тот же результат, что и `children`? В некоторых случаях — да, но что если у нашего функционального компонента будут следующие дочерние элементы?

``` html
<my-functional-component>
  <p slot="foo">
    первый
  </p>
  <p>второй</p>
</my-functional-component>
```

Для этого компонента, `children` даст вам оба абзаца, `slots().default` — только второй, а `slots().foo` — только первый. Таким образом, наличие и `children`, и `slots()` позволяет выбрать, знать ли компоненту о системе слотов или просто делегировать это знание потомку через `children`.

## Компиляция шаблонов

Возможно, вас заинтересует тот факт, что шаблоны Vue в действительности компилируются в `render`-функцию. Обычно нет необходимости знать подобные детали реализации, но может быть любопытным посмотреть на то, как компилируются те или иные возможности шаблонов. Ниже приведена небольшая демонстрация, с помощью `Vue.compile` в реальном времени компилирующая строки шаблонов:

{% raw %}
<div id="vue-compile-demo" class="demo">
  <textarea v-model="templateText" rows="10"></textarea>
  <div v-if="typeof result === 'object'">
    <label>render:</label>
    <pre><code>{{ result.render }}</code></pre>
    <label>staticRenderFns:</label>
    <pre v-for="(fn, index) in result.staticRenderFns"><code>_m({{ index }}): {{ fn }}</code></pre>
    <pre v-if="!result.staticRenderFns.length"><code>{{ result.staticRenderFns }}</code></pre>
  </div>
  <div v-else>
    <label>Ошибка компиляции:</label>
    <pre><code>{{ result }}</code></pre>
  </div>
</div>
<script>
new Vue({
  el: '#vue-compile-demo',
  data: {
    templateText: '\
<div>\n\
  <header>\n\
    <h1>I\'m a template!</h1>\n\
  </header>\n\
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
        return 'Введите выше валидный шаблон'
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
#vue-compile-demo {
  -webkit-user-select: inherit;
  user-select: inherit;
}
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
  font-family: monospace;
}
</style>
{% endraw %}
