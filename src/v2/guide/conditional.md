---
title: Условный рендеринг
type: guide
order: 7
---

## `v-if`

В строковых шаблонизаторах, например в Handlebars, мы бы определили условно отображаемый блок так:

``` html
<!-- шаблон Handlebars -->
{{#if ok}}
  <h1>Да</h1>
{{/if}}
```

Во Vue для тех же целей применяется директива `v-if`:

``` html
<h1 v-if="ok">Да</h1>
```

Также можно добавить блок "иначе", используя `v-else`:

``` html
<h1 v-if="ok">Да</h1>
<h1 v-else>Нет</h1>
```

### Условные группы с использованием `v-if` и `<template>`

Поскольку `v-if` — это директива, она должна быть указана в одном конкретном теге. А что если мы хотим управлять отображением сразу нескольких элементов? В этом случае мы можем применить `v-if` к псевдоэлементу `<template>`, который служит невидимой обёрткой, и сам в результатах рендера не появляется.

``` html
<template v-if="ok">
  <h1>Заголовок</h1>
  <p>Абзац 1</p>
  <p>Абзац 2</p>
</template>
```

### `v-else`

Для указания блока "иначе" для `v-if` можно использовать директиву `v-else`:

``` html
<div v-if="Math.random() > 0.5">
  Сейчас меня видно
</div>
<div v-else>
  А теперь — нет
</div>
```

Элемент с директивой `v-else` должен следовать непосредственно за элементом с директивой `v-if` или `v-else-if`, иначе он не будет опознан.

### `v-else-if`

> Добавлено в версии 2.1.0

The `v-else-if`, as the name suggests, serves as an "else if block" for `v-if`. It can also be chained multiple times:

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
  Not A/B/C
</div>
```

Similar to `v-else`, a `v-else-if` element must immediately follow a `v-if` or a `v-else-if` element.

### Controlling Reusable Elements with `key`

Vue tries to render elements as efficiently as possible, often re-using them instead of rendering from scratch. Beyond helping make Vue very fast, this can have some useful advantages. For example, if you allow users to toggle between multiple login types:

``` html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address">
</template>
```

Then switching the `loginType` in the code above will not erase what the user has already entered. Since both templates use the same elements, the `<input>` is not replaced - just its `placeholder`.

Check it out for yourself by entering some text in the input, then pressing the toggle button:

{% raw %}
<div id="no-key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
      <label>Username</label>
      <input placeholder="Enter your username">
    </template>
    <template v-else>
      <label>Email</label>
      <input placeholder="Enter your email address">
    </template>
  </div>
  <button @click="toggleLoginType">Toggle login type</button>
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

This isn't always desirable though, so Vue offers a way for you to say, "These two elements are completely separate - don't re-use them." Just add a `key` attribute with unique values:

``` html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input">
</template>
```

Now those inputs will be rendered from scratch each time you toggle. See for yourself:

{% raw %}
<div id="key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
      <label>Username</label>
      <input placeholder="Enter your username" key="username-input">
    </template>
    <template v-else>
      <label>Email</label>
      <input placeholder="Enter your email address" key="email-input">
    </template>
  </div>
  <button @click="toggleLoginType">Toggle login type</button>
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

Note that the `<label>` elements are still efficiently re-used, because they don't have `key` attributes.

## `v-show`

Ещё одну возможность условного отображения даёт директива `v-show`. Используется она так же:

``` html
<h1 v-show="ok">Привет!</h1>
```

Разница состоит в том, что элемент с `v-show` будет всегда оставаться в DOM, а изменяться будет лишь свойство `display` в его параметрах CSS.

<p class="tip">Обратите внимание, что `v-show` не поддерживает использование `<template>` и не работает с `v-else`.</p>

## `v-if` vs `v-show`

`v-if` производит "настоящий" условный рендеринг, удостоверяясь что подписчики событий и дочерние компоненты внутри блока должным образом уничтожаются и воссоздаются при изменении истинности управляющего условия.

`v-if` также **ленив**: если условие ложно на момент первоначального рендеринга, он не произведёт никаких действий - условный блок не будет отображён, пока условие впервые не станет истинным.

`v-show`, напротив, куда проще: элемент всегда присутствует в DOM, и только CSS-свойство переключается в зависимости от значения выражения.

В целом у `v-if` выше стоимость переключения, а у `v-show` выше стоимость первичного рендеринга. Так что если вы предполагаете, что переключения будут частыми, используйте `v-show`, если же редкими или вовсе маловероятными — `v-if`.
