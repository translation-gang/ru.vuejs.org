---
title: Пользовательские директивы
type: guide
order: 16
---

## Введение

Помимо встроенных директив (таких как `v-model` и&nbsp;`v-show`), Vue позволяет использовать ваши собственные. При этом важно понимать, что основным механизмом создания повторно используемого кода во&nbsp;Vue&nbsp;2.0 всё-таки являются компоненты. Тем не&nbsp;менее, для выполнения низкоуровневых операций с&nbsp;DOM пользовательские директивы могут очень пригодиться. В&nbsp;качестве примера реализуем фокус на&nbsp;элементе input:

{% raw %}
<div id="simplest-directive-example" class="demo">
  <input v-focus>
</div>
<script>
Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})
new Vue({
  el: '#simplest-directive-example'
})
</script>
{% endraw %}

После загрузки страницы этот элемент получает фокус ввода (примечание: автофокус не&nbsp;работает на&nbsp;мобильном Safari). Если вы&nbsp;никуда не&nbsp;кликнули с&nbsp;момента открытия этой главы руководства, фокус ввода и&nbsp;сейчас должен быть на&nbsp;этом элементе. Рассмотрим директиву подробнее:

``` js
// Регистрируем глобальную пользовательскую директиву v-focus
Vue.directive('focus', {
  // Когда привязанный элемент вставлен в DOM...
  inserted: function (el) {
    // Переключаем фокус на элемент
    el.focus()
  }
})
```

Чтобы зарегистрировать директиву локально, можно передать опцию `directives` при определении компонента:

``` js
directives: {
  focus: {
    // определение директивы
  }
}
```

Теперь в&nbsp;шаблонах можно использовать новый атрибут `v-focus`:

``` html
<input v-focus>
```

## Хуки

Для жизненного цикла директивы можно указать следующие хуки (все они опциональны):

- `bind`: вызывается однократно, при первичном связывании директивы с&nbsp;элементом. Здесь можно поместить код инициализации.

- `inserted`: вызывается после вставки связанного элемента внутрь элемента родителя (заметьте, что сам родитель может на&nbsp;этот момент и&nbsp;не&nbsp;принадлежать ещё основному дереву элементов)

- `update`: вызывается после обновления компонента-контейнера, __но, возможно, до&nbsp;обновления дочерних элементов__. Значение директивы к&nbsp;этому моменту может измениться, а&nbsp;может и&nbsp;нет. Сравнивая текущее и&nbsp;прошлое значения, вы&nbsp;можете избежать избыточных операций (см. ниже об&nbsp;аргументах хуков).

- `componentUpdated`: вызывается после обновления как компонента-контейнера, __так и&nbsp;его потомков__.

- `unbind`: вызывается однократно, при отвязывании директивы от&nbsp;элемента.

В&nbsp;следующем разделе мы&nbsp;рассмотрим аргументы, передаваемые в&nbsp;эти хуки (а&nbsp;именно, `el`, `binding`, `vnode` и `oldVnode`).

## Аргументы хуков

В&nbsp;хуки передаются следующие параметры:

- **el**: Элемент, к&nbsp;которому привязана директива. Можно использовать для прямых манипуляций с&nbsp;DOM.
- **binding**: Объект, содержащий следующие свойства:
  - **name**: Название директивы, без указания префикса `v-`.
  - **value**: Значение, переданное в директиву. Например, для `v-my-directive="1 + 1"` значением будет `2`.
  - **oldValue**: Предыдущее переданное в&nbsp;директиву значение. Доступно только для хуков `update` и `componentUpdated` и&nbsp;передаётся независимо от&nbsp;того, произошло&nbsp;ли в&nbsp;действительности его изменение.
  - **expression**: Выражение-строка, переданное в&nbsp;директиву. Например, для `v-my-directive="1 + 1"` это будет `"1 + 1"`.
  - **arg**: Аргумент, переданный в директиву, в&nbsp;случае его наличия. Например, для `v-my-directive:foo` это будет `"foo"`.
  - **modifiers**: Объект, содержащий модификаторы, если они есть. Например, для `v-my-directive.foo.bar`, объектом модификаторов будет `{ foo: true, bar: true }`.
- **vnode**: Виртуальный элемент, созданный компилятором Vue. См. [VNode API](../api/#Интерфейс-VNode) для подробностей.
- **oldVnode**: Предыдущий виртуальный элемент, доступный только для хуков `update` и&nbsp;`componentUpdated`.

<p class="tip">Все аргументы кроме `el` следует понимать как только для чтения и&nbsp;никогда не&nbsp;изменять&nbsp;их. В&nbsp;случае необходимости передать информацию между хуками рекомендуем воспользоваться [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset).</p>

Пример пользовательской директивы, использующей некоторые из&nbsp;описанных возможностей:

``` html
<div id="hook-arguments-example" v-demo:hello.a.b="message"></div>
```

``` js
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})

new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'hello!'
  }
})
```

{% raw %}
<div id="hook-arguments-example" v-demo:hello.a.b="message" class="demo"></div>
<script>
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})
new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'hello!'
  }
})
</script>
{% endraw %}

## Сокращённая запись

Часто нам может потребоваться одинаковое поведение на&nbsp;`bind` и&nbsp;`update`, а&nbsp;остальные хуки не&nbsp;нужны. В&nbsp;таком случае можно использовать сокращённую запись:

``` js
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```

## Передача объекта данных в директиву

В&nbsp;случае, если директива должна принимать несколько параметров, можно указать объект JavaScript&nbsp;&mdash; годится любое валидное выражение, помните?

``` html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

``` js
Vue.directive('demo', function (el, binding) {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text)  // => "hello!"
})
```
