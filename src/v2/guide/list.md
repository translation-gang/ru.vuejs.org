---
title: Рендеринг списков
type: guide
order: 8
---

## `v-for`

Используйте директиву `v-for` для рендеринга списка элементов на&nbsp;основе массива данных. Директива `v-for` требует особого синтаксиса: записи `item in items`, где `items` &mdash; исходный массив данных, а&nbsp;`item` &mdash; **ссылка** на&nbsp;текущий элемент массива:

### Типичное использование

``` html
<ul id="example-1">
  <li v-for="item in items">
    {{ item.message }}
  </li>
</ul>
```

``` js
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
  },
  watch: {
    items: function () {
      smoothScroll.animateScroll(null, '#example-1')
    }
  }
})
</script>
{% endraw %}

Внутри блока `v-for` нам полностью доступны свойства из&nbsp;области видимости родителя. `v-for` также поддерживает необязательный второй параметр для указания индекса текущего элемента.

``` html
<ul id="example-2">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
```

``` js
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
  },
  watch: {
    items: function () {
      smoothScroll.animateScroll(null, '#example-2')
    }
  }
})
</script>
{% endraw %}

Вместо `in` разделителем может быть слово `of`, как в&nbsp;итераторах JavaScript:

``` html
<div v-for="item of items"></div>
```

### `v-for` и template

Как и&nbsp;в&nbsp;случае с `v-if`, для рендеринга нескольких элементов директивой `v-for` используйте псевдоэлемент `<template>`. Например:

``` html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider"></li>
  </template>
</ul>
```

### `v-for` для объекта

`v-for` можно также использовать для итерирования по&nbsp;свойствам объекта:

``` html
<ul id="repeat-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
```

``` js
new Vue({
  el: '#repeat-object',
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
<ul id="repeat-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
<script>
new Vue({
  el: '#repeat-object',
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

Можно также указать второй аргумент для получения ключей:

``` html
<div v-for="(value, key) in object">
  {{ key }} : {{ value }}
</div>
```

И&nbsp;третий&nbsp;&mdash; для индексов:

``` html
<div v-for="(value, key, index) in object">
  {{ index }}. {{ key }} : {{ value }}
</div>
```

<p class="tip">При итерировании по&nbsp;объекту, порядок обхода такой&nbsp;же, как порядок ключей в&nbsp;`Object.keys()`. Его консистентность **не&nbsp;гарантируется** при использовании различных реализаций движков JavaScript.</p>

### `v-for` и диапазоны

В&nbsp;`v-for` можно также передать целое число. В&nbsp;этом случае шаблон будет повторён указанное число раз.

``` html
<div>
  <span v-for="n in 10">{{ n }}</span>
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

### Компоненты и `v-for`

> Эта секция подразумевает знакомство с&nbsp;[компонентами](components.html). Не&nbsp;стесняйтесь пропустить её&nbsp;сейчас и&nbsp;вернуться потом.

Вы&nbsp;можете использовать `v-for` и&nbsp;на&nbsp;пользовательских компонентах&nbsp;&mdash; совершенно так&nbsp;же, как и&nbsp;на&nbsp;обычных элементах:

``` html
<my-component v-for="item in items"></my-component>
```

Однако, это не&nbsp;передаст в&nbsp;компонент никаких данных автоматически, поскольку компоненты имеют изолированные области видимости. Для передачи итерируемых данных в&nbsp;компонент нужно явно использовать входные параметры:

``` html
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index">
</my-component>
```

Причина, по&nbsp;которой `item` не&nbsp;передаётся в&nbsp;компонент автоматически, в&nbsp;том, что это сделало&nbsp;бы компонент жёстко связанным с&nbsp;логикой работы `v-for`. А&nbsp;если источник данных указывается явно, компонент можно будет использовать и&nbsp;в&nbsp;других ситуациях.

Ниже приведён полный пример простого списка todo:

``` html
<div id="todo-list-example">
  <input
    v-model="newTodoText"
    v-on:keyup.enter="addNewTodo"
    placeholder="Добавить todo"
  >
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:title="todo"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
```

``` js
Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">X</button>\
    </li>\
  ',
  props: ['title']
})

new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      'Вымыть посуду',
      'Вынести мусор',
      'Подстричь газон'
    ]
  },
  methods: {
    addNewTodo: function () {
      this.todos.push(this.newTodoText)
      this.newTodoText = ''
    }
  }
})
```

{% raw %}
<div id="todo-list-example" class="demo">
  <input
    v-model="newTodoText" v
    v-on:keyup.enter="addNewTodo"
    placeholder="Добавить todo"
  >
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:title="todo"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
<script>
Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">X</button>\
    </li>\
  ',
  props: ['title']
})
new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      'Вымыть посуду',
      'Вынести мусор',
      'Подстричь газон'
    ]
  },
  methods: {
    addNewTodo: function () {
      this.todos.push(this.newTodoText)
      this.newTodoText = ''
    }
  }
})
</script>
{% endraw %}

### `v-for` и `v-if`

Когда они присутствуют на&nbsp;одном элементе, `v-for` имеет больший приоритет, чем `v-if`. Другими словами, `v-if` будет выполняться отдельно для каждой итерации цикла. Это очень полезно когда нужно отобразить только _некоторые_ элементы списка, например:

``` html
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo }}
</li>
```

В&nbsp;результате будут отображены только todo, которые ещё не&nbsp;выполнены.

Если нужно чтобы по&nbsp;условию пропускалось выполнение всего цикла, поместите `v-if` на&nbsp;внешний элемент (или&nbsp;на&nbsp;[`<template>`](conditional.html#Условные-группы-с-использованием-v-if-и-lt-template-gt)). Например:

``` html
<ul v-if="shouldRenderTodos">
  <li v-for="todo in todos">
    {{ todo }}
  </li>
</ul>
```

## `key`

Когда Vue обновляет список элементов, управляемый директивой `v-for`, по&nbsp;умолчанию используется стратегия &laquo;обновления на&nbsp;месте&raquo;. Если порядок элементов массива или объекта изменился, Vue не&nbsp;будет перемещать элементы DOM, а&nbsp;попросту обновит каждый элемент &laquo;на&nbsp;месте&raquo;, чтобы он&nbsp;отображал новые данные по&nbsp;соответствующему индексу. Во&nbsp;Vue версий 1.x подобное поведение достигалось указанием `track-by="$index"`.

Режим по&nbsp;умолчанию эффективен, но&nbsp;применим только в&nbsp;случаях **когда результат рендеринга вашего списка не&nbsp;полагается на&nbsp;состояние дочерних компонентов или промежуточные состояния DOM (например, элементов ввода форм)**.

Чтобы подсказать Vue, как отслеживать идентичность каждого элемента, позволяющую переиспользовать и&nbsp;перемещать существующие элементы, укажите уникальный атрибут `key` для каждого элемента. Идеальным значением `key` будет уникальный id&nbsp;сущности. Этот специальный атрибут является приблизительным эквивалентом `track-by` из&nbsp;Vue&nbsp;1.x, но&nbsp;работает так&nbsp;же, как и&nbsp;все остальные атрибуты, а&nbsp;значит вам нужно использовать `v-bind` для связывания с&nbsp;динамическими значениями (в&nbsp;примере ниже используется сокращение):

``` html
<div v-for="item in items" :key="item.id">
  <!-- содержимое -->
</div>
```

Рекомендуем указывать `key` с&nbsp;`v-for` по&nbsp;возможности всегда, за&nbsp;исключением случаев когда итерируемый контент DOM прост, или когда вы&nbsp;сознательно используете стратегию по&nbsp;умолчанию для улучшения производительности.

Поскольку указанный механизм является общим для идентификации элементов во&nbsp;Vue, `key` имеет и&nbsp;другие варианты применения, не&nbsp;связанные явно с&nbsp;`v-for`, как мы&nbsp;увидим далее в&nbsp;руководстве.

## Отслеживание изменений в массивах

### Методы внесения изменений

Vue оборачивает методы внесения изменений наблюдаемого массива таким образом, чтобы они вызывали обновления представления. Оборачиваются следующие методы:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

Вы&nbsp;можете открыть консоль и&nbsp;поиграть с&nbsp;массивом `items` из&nbsp;предыдущего примера, вызывая его методы внесения изменений. Например: `example1.items.push({ message: 'Baz' })`.

### Замены в массиве

Методы внесения изменений, как следует из&nbsp;их&nbsp;названия, изменяют оригинальный массив, на&nbsp;котором они вызываются. Существуют и&nbsp;неизменяющие методы, такие как `filter()`, `concat()` и&nbsp;`slice()`, не&nbsp;вносящие изменений в&nbsp;изначальный массив, а&nbsp;**всегда возвращающие новый массив**. При работе с&nbsp;неизменяющими методами, вы&nbsp;можете просто заменить старый массив новым:

``` js
example1.items = example1.items.filter(function (item) {
  return item.message.match(/Foo/)
})
```

Можно было&nbsp;бы предположить, что это заставит Vue выбросить существующий DOM и&nbsp;перерендерить список целиком, но, к&nbsp;счастью, это не&nbsp;так. Во&nbsp;Vue есть умные эвристики для максимизации переиспользования элементов DOM, так что замена одного массива другим, в&nbsp;случае совпадения части элементов в&nbsp;этих массивах, является очень эффективной операцией.

### Предостережения

Из-за ограничений JavaScript, Vue **не&nbsp;способен** заметить следующие изменения в&nbsp;массиве:

1. Прямую установку элемента по&nbsp;индексу, например: `vm.items[indexOfItem] = newValue`
2. Явное изменение длины массива, например: `vm.items.length = newLength`

Обойти первую проблему можно двумя способами, оба из&nbsp;которых не&nbsp;только дадут эффект аналогичный `vm.items[indexOfItem] = newValue`, но&nbsp;и&nbsp;инициируют реактивные обновления состояния приложения:

``` js
// Vue.set
Vue.set(example1.items, indexOfItem, newValue)
```
``` js
// Array.prototype.splice`
example1.items.splice(indexOfItem, 1, newValue)
```

Для обхода второй проблемы можно также использовать `splice`:

``` js
example1.items.splice(newLength)
```

## Отображение отфильтрованных/отсортированных результатов

Иногда хочется отобразить отфильтрованную или отсортированную версию массива, не&nbsp;изменяя оригинальных данных. В&nbsp;этом случае, можно создать вычисляемое свойство, возвращающее отфильтрованный или отсортированный массив.

Например:

``` html
<li v-for="n in evenNumbers">{{ n }}</li>
```

``` js
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

В&nbsp;качестве альтернативы, в&nbsp;случае если вычислимые свойства не&nbsp;пригодны к&nbsp;использованию (например, внутри вложенных циклов `v-for`), можно просто применить метод:

``` html
<li v-for="n in even(numbers)">{{ n }}</li>
```

``` js
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
