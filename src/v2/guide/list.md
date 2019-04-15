---
title: Отрисовка списков
type: guide
order: 8
---

## Отображение массива элементов с помощью `v-for`

Используйте директиву `v-for` для отрисовки списка элементов на основе массива данных. У директивы `v-for` особый синтаксис записи: `item in items`, где `items` — исходный массив, а `item` — **ссылка** на текущий элемент массива:

```html
<ul id="example-1">
  <li v-for="item in items">
    {{ item.message }}
  </li>
</ul>
```

```js
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

Результат:

{% raw %}
<ul id="example-1" class="demo">
  <li v-for="item in items">
    {{item.message}}
  </li>
</ul>
<script>
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
</script>
{% endraw %}

Внутри блока `v-for` нам доступны свойства из области видимости родителя. У `v-for` также есть второй опциональный параметр с индексом текущего элемента.

```html
<ul id="example-2">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
```

```js
var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Родитель',
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

Результат:

{% raw%}
<ul id="example-2" class="demo">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
<script>
var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Родитель',
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
</script>
{% endraw %}

Вместо `in` разделителем можно использовать `of`, как в итераторах JavaScript:

```html
<div v-for="item of items"></div>
```

### `v-for` для объекта

`v-for` можно также использовать для итерирования по свойствам объекта:

```html
<ul id="v-for-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
```

```js
new Vue({
  el: '#v-for-object',
  data: {
    object: {
      firstName: 'Иван',
      lastName: 'Петров',
      age: 30
    }
  }
})
```

Результат:

{% raw %}
<ul id="v-for-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
<script>
new Vue({
  el: '#v-for-object',
  data: {
    object: {
      firstName: 'Иван',
      lastName: 'Петров',
      age: 30
    }
  }
})
</script>
{% endraw %}

Можно использовать второй аргумент для получения ключей объекта:

```html
<div v-for="(value, key) in object">
  {{ key }}: {{ value }}
</div>
```

{% raw %}
<div id="v-for-object-value-key" class="demo">
  <div v-for="(value, key) in object">
    {{ key }}: {{ value }}
  </div>
</div>
<script>
new Vue({
  el: '#v-for-object-value-key',
  data: {
    object: {
      firstName: 'John',
      lastName: 'Doe',
      age: 30
    }
  }
})
</script>
{% endraw %}

И третий — для индексов:

```html
<div v-for="(value, key, index) in object">
  {{ index }}. {{ key }}: {{ value }}
</div>
```

{% raw %}
<div id="v-for-object-value-key-index" class="demo">
  <div v-for="(value, key, index) in object">
    {{ index }}. {{ key }}: {{ value }}
  </div>
</div>
<script>
new Vue({
  el: '#v-for-object-value-key-index',
  data: {
    object: {
      firstName: 'John',
      lastName: 'Doe',
      age: 30
    }
  }
})
</script>
{% endraw %}

<p class="tip">При итерировании по объекту порядок обхода ключей такой же как и в `Object.keys()`. Его консистентность **не гарантируется** при использовании различных реализаций движков JavaScript.</p>

## `key`

При обновлении Vue списка элементов, отображаемого директивой `v-for`, по умолчанию используется стратегия обновления «на месте». Если порядок элементов массива или объекта изменился, Vue не станет перемещать элементы DOM, а просто обновит каждый элемент «на месте», чтобы он отображал новые данные по соответствующему индексу. Во Vue версий 1.x подобное поведение достигалось указанием `track-by="$index"`.

Режим по умолчанию эффективен, но применим только в случаях, **когда результат отрисовки вашего списка не полагается на состояние дочерних компонентов или временные состояния DOM (например, значения полей форм)**.

Чтобы подсказать Vue, как отслеживать идентичность каждого элемента, что позволит переиспользовать и перемещать существующие элементы, укажите уникальный атрибут `key` для каждого элемента. Идеальным значением `key` будет уникальный id сущности. Этот специальный атрибут отчасти похож на `track-by` из Vue 1.x, но работает как и все остальные атрибуты, а значит нужно использовать `v-bind` для связывания с динамическими значениями (в примере ниже используется сокращение):

```html
<div v-for="item in items" :key="item.id">
  <!-- содержимое -->
</div>
```

Рекомендуем всегда указывать `key` с `v-for`, кроме случаев когда итерируемый контент DOM прост, или вы сознательно используете стратегию обновления по умолчанию для улучшения производительности.

Поскольку этот механизм является общим для идентификации элементов во Vue, имеются и другие варианты применения `key`, не связанные явно с `v-for`, как мы увидим далее в руководстве.

<p class="tip">Не указывайте в качестве ключей `v-for` непримитивные значения. Вместо этого используйте строковые или числовые значения.</p>

Подробнее про использование атрибута `key` можно прочитать в [документации API](https://ru.vuejs.org/v2/api/#key).

## Отслеживание изменений в массивах

### Методы внесения изменений

Vue оборачивает у наблюдаемого массива методы внесения изменений, чтобы они вызывали обновления представления. Оборачиваются следующие методы:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

Можете открыть консоль и поиграться с массивом `items` из предыдущего примера, вызывая его методы внесения изменений, например: `example1.items.push({ message: 'Baz' })`.

### Замены в массиве

Методы внесения изменений, как следует из их названия, изменяют оригинальный массив, на котором они вызываются. Существуют и неизменяющие методы, такие как `filter()`, `concat()` и `slice()`, они не вносят изменений в изначальный массив, а **всегда возвращают новый массив**. При работе с неизменяющими методами можно просто заменять старый массив на новый:

```js
example1.items = example1.items.filter(function (item) {
  return item.message.match(/Foo/)
})
```

Можно предположить, что Vue придётся выбросить существующий DOM и заново отрисовать список целиком, но, к счастью, это не так. Во Vue есть умные эвристики для максимизации переиспользования элементов DOM, поэтому замена одного массива другим, в случае совпадения части элементов этих массивов, будет очень эффективной операцией.

### Предостережения

Из-за ограничений JavaScript, Vue **не способен** отследить следующие изменения в массиве:

1. Прямую установку элемента по индексу: `vm.items[indexOfItem] = newValue`
2. Явное изменение длины массива: `vm.items.length = newLength`

Например:

```js
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
vm.items[1] = 'x' // НЕ РЕАКТИВНО
vm.items.length = 2 // НЕ РЕАКТИВНО
```

Решить первую проблему можно двумя способами, оба дадут эффект аналогичный `vm.items[indexOfItem] = newValue`, плюс запустят реактивные обновления состояния приложения:

```js
// Использовать Vue.set
Vue.set(vm.items, indexOfItem, newValue)
```
```js
// Использовать Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)
```

Можно использовать метод экземпляра [`vm.$set`](https://ru.vuejs.org/v2/api/#vm-set), который является псевдонимом для глобального `Vue.set`:

```js
vm.$set(vm.items, indexOfItem, newValue)
```

Для решения второй проблемы используйте `splice`:

```js
vm.items.splice(newLength)
```

## Предостережения об изменениях объектов

Опять же, из-за ограничений JavaScript, **Vue не может обнаружить добавление или удаление свойств**. Например:

```js
var vm = new Vue({
  data: {
    a: 1
  }
})
// свойство `vm.a` реактивно

vm.b = 2
// свойство `vm.b` НЕ реактивно
```

Vue не позволяет динамически добавлять новые реактивные свойства на корневом уровне уже созданного экземпляра. Тем не менее, можно добавить реактивные свойства к вложенному объекту с помощью метода `Vue.set(object, key, value)`. Например, для следующего:

```js
var vm = new Vue({
  data: {
    userProfile: {
      name: 'Anika'
    }
  }
})
```

Можно добавить новое свойство `age` для вложенного объекта `userProfile`:

```js
Vue.set(vm.userProfile, 'age', 27)
```

Также можно использовать метод экземпляра `vm.$set`, который является псевдонимом для глобального `Vue.set`:

```js
vm.$set(vm.userProfile, 'age', 27)
```

Иногда может потребоваться добавить ряд новых свойств существующему объекту, например, используя `Object.assign()` или `_.extend()`. В таких случаях, нужно создать новый объект со свойствами обоих объектов. Поэтому вместо:

```js
Object.assign(vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})
```

Следует добавлять новые реактивные свойства таким образом:

```js
vm.userProfile = Object.assign({}, vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})
```

## Отображение отфильтрованных/отсортированных результатов

Иногда хочется отобразить отфильтрованную или отсортированную версию массива, не изменяя оригинальные данные. В таком случае создайте вычисляемое свойство, возвращающее отфильтрованный или отсортированный массив.

Например:

```html
<li v-for="n in evenNumbers">{{ n }}</li>
```

```js
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
computed: {
  evenNumbers: function () {
    return this.numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```

В ситуациях, когда вычисляемые свойства невозможно использовать (например, внутри вложенных циклов `v-for`), просто используйте метод:

```html
<li v-for="n in even(numbers)">{{ n }}</li>
```

```js
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
methods: {
  even: function (numbers) {
    return numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```

### `v-for` и диапазоны

В `v-for` можно передать целое число. В этом случае шаблон будет повторён указанное число раз.

```html
<div>
  <span v-for="n in 10">{{ n }} </span>
</div>
```

Результат:

{% raw %}
<div id="range" class="demo">
  <span v-for="n in 10">{{ n }} </span>
</div>
<script>
  new Vue({ el: '#range' })
</script>
{% endraw %}

### `v-for` и тег `template`

Подобно использованию с `v-if`, также можно использовать тег `<template>` с директивой `v-for` для отображения блока из нескольких элементов. Например:

```html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

### `v-for` и `v-if`

<p class="tip">Обратите внимание, что **не рекомендуется** использовать вместе `v-if` и `v-for`. Подробнее в разделе [рекомендаций](/v2/style-guide/#Избегайте-использования-v-if-с-v-for-важно).</p>

Когда присутствуют вместе на одном элементе, `v-for` имеет больший приоритет, чем `v-if`. Поэтому `v-if` будет выполняться для каждой итерации цикла. Это полезно, когда нужно отобразить только _некоторые_ элементы списка, например:

```html
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo }}
</li>
```

В результате будут отображены только задачи, которые ещё не выполнены.

Если необходимо по условию пропускать выполнение всего цикла, переместите `v-if` на внешний элемент (или на [`<template>`](conditional.html#Условные-группы-с-использованием-v-if-и-lt-template-gt)). Например:

```html
<ul v-if="shouldRenderTodos">
  <li v-for="todo in todos">
    {{ todo }}
  </li>
</ul>
```

### Компоненты и `v-for`

> Эта секция подразумевает, что вы уже знакомы с [компонентами](components.html). Не стесняйтесь пропустить её сейчас и вернуться потом.

Можно использовать `v-for` на компонентах, как и на обычных элементах:

```html
<my-component v-for="item in items" :key="item.id"></my-component>
```

> В версиях 2.2.0+, при использовании `v-for` на компонентах теперь обязательно требуется указывать [`key`](list.html#key).

Однако, в компонент никакие данные не передаются автоматически, поскольку у компонентов изолированные области видимости. Для передачи итерируемых данных в компонент необходимо явно использовать входные параметры:

```html
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index"
  v-bind:key="item.id"
></my-component>
```

Причина, почему `item` не передаётся в компонент автоматически, в том, что это сделает компонент жёстко связанным с логикой работы `v-for`. Но если указывать источник данных явно, компонент можно будет использовать и в других ситуациях.

Ниже приведён полный пример простого списка задач:

```html
<div id="todo-list-example">
  <form v-on:submit.prevent="addNewTodo">
    <label for="new-todo">Добавить задачу</label>
    <input
      v-model="newTodoText"
      id="new-todo"
      placeholder="Например, покормить кота"
    >
    <button>Добавить</button>
  </form>
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:key="todo.id"
      v-bind:title="todo.title"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
```

<p class="tip">Обратите внимание на атрибут `is="todo-item"`. Это необходимо в DOM-шаблонах, потому что только элементы `<li>` разрешены внутри `<ul>`. Результат будет таким же, как использование `<todo-item>`, но позволяет обойти ошибки парсинга браузером. Чтобы узнать больше, изучите [особенности парсинга DOM-шаблона](components.html#Особенности-парсинга-DOM-шаблона).</p>

```js
Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">Удалить</button>\
    </li>\
  ',
  props: ['title']
})

new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      {
        id: 1,
        title: 'Помыть посуду'
      },
      {
        id: 2,
        title: 'Вынести мусор'
      },
      {
        id: 3,
        title: 'Подстричь газон'
      }
    ],
    nextTodoId: 4
  },
  methods: {
    addNewTodo: function () {
      this.todos.push({
        id: this.nextTodoId++,
        title: this.newTodoText
      })
      this.newTodoText = ''
    }
  }
})
```

{% raw %}
<div id="todo-list-example" class="demo">
  <form v-on:submit.prevent="addNewTodo">
    <label for="new-todo">Добавить задачу</label>
    <input
      v-model="newTodoText"
      id="new-todo"
      placeholder="Например, покормить кота"
    >
    <button>Добавить</button>
  </form>
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:key="todo.id"
      v-bind:title="todo.title"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
<script>
Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">Удалить</button>\
    </li>\
  ',
  props: ['title']
})
new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      {
        id: 1,
        title: 'Помыть посуду'
      },
      {
        id: 2,
        title: 'Вынести мусор'
      },
      {
        id: 3,
        title: 'Подстричь газон'
      }
    ],
    nextTodoId: 4
  },
  methods: {
    addNewTodo: function () {
      this.todos.push({
        id: this.nextTodoId++,
        title: this.newTodoText
      })
      this.newTodoText = ''
    }
  }
})
</script>
{% endraw %}
