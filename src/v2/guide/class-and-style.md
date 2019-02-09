---
title: Работа с классами и стилями
type: guide
order: 6
---

Часто возникает необходимость динамически изменять CSS-классы и inline-стили элементов в зависимости от состояния приложения. Поскольку и то и другое атрибуты, мы можем использовать `v-bind`: необходимо лишь вычислить итоговую строку при помощи выражения. Впрочем, заниматься конкатенацией строк неудобно, это может привести к ошибкам. К счастью, Vue предоставляет дополнительные возможности директивы `v-bind` для работы с `class` и `style`. Эти атрибуты кроме строковых значений могут принимать массивы или объекты.

## Связывание CSS-классов

### Использование объектов

Для динамической установки или удаления CSS-классов можно передавать объект в директиву `v-bind:class`:

```html
<div v-bind:class="{ active: isActive }"></div>
```

Запись выше означает, что наличие класса `active` будет определяться [истинностью](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) параметра `isActive`.

Таким образом можно управлять несколькими классами, добавляя в объект другие поля. Кроме того, `v-bind:class` можно использовать совместно с обычным атрибутом `class`:

```html
<div
  class="static"
  v-bind:class="{ active: isActive, 'text-danger': hasError }"
></div>
```

При использовании таких данных:

```js
data: {
  isActive: true,
  hasError: false
}
```

В результате получится:

```html
<div class="static active"></div>
```

Список классов элемента обновится при изменении `isActive` или `hasError`. Например, если `hasError` станет `true`, то значением атрибута `class` будет `"static active text-danger"`.

Используемый объект необязательно указывать прямо в шаблоне:

```html
<div v-bind:class="classObject"></div>
```
```js
data: {
  classObject: {
    active: true,
    'text-danger': false
  }
}
```

Результат будет таким же. Можно также использовать и [вычисляемые свойства](computed.html), которые возвращают объект — это очень распространённый и мощный приём:

```html
<div v-bind:class="classObject"></div>
```
```js
data: {
  isActive: true,
  error: null
},
computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

### Использование массивов

В `v-bind:class` можно передать и массив:

```html
<div v-bind:class="[activeClass, errorClass]"></div>
```
```js
data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}
```

В результате получим:

```html
<div class="active text-danger"></div>
```

Для переключения классов в массиве, в зависимости от некоторого условия, можно использовать тернарный оператор:

```html
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>
```

В этом случае `errorClass` будет применён к элементу всегда, а `activeClass` — только в случае истинности `isActive`.

Однако, такая запись становится слегка громоздкой, особенно если есть несколько классов, задаваемых по условию. Но можно использовать и смешанный синтаксис:

```html
<div v-bind:class="[{ active: isActive }, errorClass]"></div>
```

### Использование с компонентами

> Эта секция предполагает знакомство с [компонентами Vue](components.html). Вы можете спокойно пропустить её сейчас и вернуться позднее.

При использовании атрибута `class` на пользовательском компоненте, классы будут добавлены к его корневому элементу. Собственные классы элемента при этом не будут потеряны.

Возьмём, к примеру, такой компонент:

```js
Vue.component('my-component', {
  template: '<p class="foo bar">Привет</p>'
})
```

Если указать дополнительные классы на компоненте:

```html
<my-component class="baz boo"></my-component>
```

В результате отрисовки получим:

```html
<p class="foo bar baz boo">Привет</p>
```

То же самое справедливо для связывания классов с данными:

```html
<my-component v-bind:class="{ active: isActive }"></my-component>
```

Если `isActive` истинно, результирующий HTML будет:

```html
<p class="foo bar active">Привет</p>
```

## Связывание inline-стилей

### Использование объектов

Объектная запись для `v-bind:style` выглядит почти как CSS, хотя, на самом деле, это объект JavaScript. Для указания свойств CSS можно применять как camelCase, так и kebab-case (не забывайте про кавычки при использовании kebab-case):

```html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```
```js
data: {
  activeColor: 'red',
  fontSize: 30
}
```

Можно выносить объект стилей из шаблона, чтобы сделать код чище:

```html
<div v-bind:style="styleObject"></div>
```
```js
data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}
```

Можно использовать и вычисляемые свойства, возвращающие объекты стилей.

### Использование массивов

Запись `v-bind:style` с массивом позволяет применить несколько объектов стилей к одному и тому же элементу:

```html
<div v-bind:style="[baseStyles, overridingStyles]"></div>
```

### Автоматические префиксы

При использовании в `v-bind:style` свойств CSS, требующих указания [вендорных префиксов](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix), Vue автоматически определит это и добавит подходящие префиксы к применяемым стилям.

### Множественные значения

> Добавлено в версии 2.3.0+

Начиная с версии 2.3.0+ можно предоставить массив из нескольких (префиксных) значений для свойства style, например:

```html
<div v-bind:style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

Это приведёт к отображению последнего значения в массиве, поддерживаемого браузером. В этом примере он будет отображать `display: flex` для браузеров, которые поддерживают flexbox без префиксов.
