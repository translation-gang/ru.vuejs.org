---
title: Условный рендеринг
type: guide
order: 7
---

## `v-if`

В&nbsp;строковых шаблонизаторах, например в&nbsp;Handlebars, мы&nbsp;бы определили условно отображаемый блок так:

``` html
<!-- шаблон Handlebars -->
{{#if ok}}
  <h1>Да</h1>
{{/if}}
```

Во&nbsp;Vue для тех&nbsp;же целей применяется директива `v-if`:

``` html
<h1 v-if="ok">Да</h1>
```

Также можно добавить блок &laquo;иначе&raquo;, используя `v-else`:

``` html
<h1 v-if="ok">Да</h1>
<h1 v-else>Нет</h1>
```

### Условные группы с использованием `v-if` и `<template>`

Поскольку `v-if` &mdash; это директива, она должна быть указана в&nbsp;одном конкретном теге. А&nbsp;что если мы&nbsp;хотим управлять отображением сразу нескольких элементов? В&nbsp;этом случае мы&nbsp;можем применить `v-if` к&nbsp;псевдоэлементу `<template>`, который служит невидимой обёрткой, и&nbsp;сам в&nbsp;результатах рендеринга не&nbsp;появляется.

``` html
<template v-if="ok">
  <h1>Заголовок</h1>
  <p>Абзац 1</p>
  <p>Абзац 2</p>
</template>
```

### `v-else`

Для указания блока &laquo;иначе&raquo; для `v-if` можно использовать директиву `v-else`:

``` html
<div v-if="Math.random() > 0.5">
  Сейчас меня видно
</div>
<div v-else>
  А теперь — нет
</div>
```

Элемент с&nbsp;директивой `v-else` должен следовать непосредственно за&nbsp;элементом с&nbsp;директивой `v-if` или&nbsp;`v-else-if`, иначе он&nbsp;не&nbsp;будет опознан.

### `v-else-if`

> Добавлено в версии 2.1.0

Как следует из&nbsp;названия, `v-else-if` служит в&nbsp;качестве &laquo;блока else&nbsp;if&raquo; для директивы `v-if`. Можно объединять эти директивы в&nbsp;длинные цепочки:

```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Не A/B/C
</div>
```

Подобно `v-else`, `v-else-if` должен непосредственно следовать за&nbsp;элементом с&nbsp;`v-if` или&nbsp;`v-else-if`.

### Управление повторным использованием элементов при помощи `key`

Vue старается рендерить элементы DOM настолько эффективно, насколько это возможно, зачастую переиспользуя их&nbsp;вместо того чтобы создавать заново. Помимо улучшения производительности, в&nbsp;этом подходе можно обнаружить и&nbsp;иные преимущества. Например, если вы&nbsp;позволяете пользователю переключаться между несколькими возможными типами логина:

``` html
<template v-if="loginType === 'username'">
  <label>Имя пользователя</label>
  <input placeholder="Введите имя пользователя">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Введите адрес email">
</template>
```

Переключение `loginType` в&nbsp;коде выше не&nbsp;сотрёт&nbsp;то, что пользователь уже ввёл. Оба шаблона используют одни и&nbsp;те&nbsp;же элементы, поэтому `<input>` не&nbsp;заменяется&nbsp;&mdash; только его `placeholder`.

Попробуйте сами, сначала введя что-нибудь в&nbsp;input, а&nbsp;затем нажав на&nbsp;кнопку переключения:

{% raw %}
<div id="no-key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
      <label>Имя пользователя</label>
      <input placeholder="Введите имя пользователя">
    </template>
    <template v-else>
      <label>Email</label>
      <input placeholder="Введите адрес email">
    </template>
  </div>
  <button @click="toggleLoginType">Переключить тип логина</button>
</div>
<script>
new Vue({
  el: '#no-key-example',
  data: {
    loginType: 'username'
  },
  methods: {
    toggleLoginType: function () {
      return this.loginType = this.loginType === 'username' ? 'email' : 'username'
    }
  }
})
</script>
{% endraw %}

Надо сказать, что это поведение может не&nbsp;всегда быть тем, что нужно. Поэтому Vue позволяет явно сказать: &laquo;эти элементы должны быть полностью независимы: не&nbsp;надо их&nbsp;переиспользовать&raquo;. Для этого нужно всего лишь указать уникальное значение ключа `key`:

``` html
<template v-if="loginType === 'username'">
  <label>Имя пользователя</label>
      <input placeholder="Введите имя пользователя" key="username-input">
</template>
<template v-else>
  <label>Email</label>
      <input placeholder="Введите адрес email" key="email-input">
</template>
```

Теперь эти input&rsquo;ы будут рендерится заново при каждом переключении. Смотрите сами:

{% raw %}
<div id="key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
  <label>Имя пользователя</label>
      <input placeholder="Введите имя пользователя" key="username-input">
</template>
<template v-else>
  <label>Email</label>
      <input placeholder="Введите адрес email" key="email-input">
</template>
  </div>
  <button @click="toggleLoginType">Переключить тип логина</button>
</div>
<script>
new Vue({
  el: '#key-example',
  data: {
    loginType: 'username'
  },
  methods: {
    toggleLoginType: function () {
      return this.loginType = this.loginType === 'username' ? 'email' : 'username'
    }
  }
})
</script>
{% endraw %}

Обратите внимание, что элементы `<label>` всё так&nbsp;же эффективно переиспользуются, поскольку для них `key` не&nbsp;указаны.

## `v-show`

Ещё одну возможность условного отображения даёт директива `v-show`. Используется она так&nbsp;же:

``` html
<h1 v-show="ok">Привет!</h1>
```

Разница состоит в&nbsp;том, что элемент с `v-show` будет всегда оставаться в&nbsp;DOM, а&nbsp;изменяться будет лишь свойство `display` в&nbsp;его параметрах CSS.

<p class="tip">Обратите внимание, что `v-show` не&nbsp;поддерживает использование `<template>` и&nbsp;не&nbsp;работает с `v-else`.</p>

## `v-if` vs `v-show`

`v-if` производит &laquo;настоящий&raquo; условный рендеринг, удостоверяясь что подписчики событий и&nbsp;дочерние компоненты внутри блока должным образом уничтожаются и&nbsp;воссоздаются при изменении истинности управляющего условия.

`v-if` также **ленив**: если условие ложно на&nbsp;момент первоначального рендеринга, он&nbsp;не&nbsp;произведёт никаких действий&nbsp;&mdash; условный блок не&nbsp;будет отображён, пока условие впервые не&nbsp;станет истинным.

`v-show`, напротив, куда проще: элемент всегда присутствует в&nbsp;DOM, и&nbsp;только CSS-свойство переключается в&nbsp;зависимости от&nbsp;значения выражения.

В&nbsp;целом у `v-if` выше стоимость переключения, а&nbsp;у `v-show` выше стоимость первичного рендеринга. Так что если вы&nbsp;предполагаете, что переключения будут частыми, используйте `v-show`, если&nbsp;же редкими или вовсе маловероятными&nbsp;&mdash; `v-if`.

## `v-if` вместе с `v-for`

При совместном использовании `v-if` и&nbsp;`v-for`, `v-for` имеет более высокий приоритет. Подробности на&nbsp;странице <a href="../guide/list.html#v-for-и-v-if">рендеринга списков</a>.
