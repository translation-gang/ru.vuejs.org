---
title: Работа с классами и стилями
type: guide
order: 6
---

Зачастую возникает необходимость динамически изменять CSS-классы и&nbsp;inline-стили элементов в&nbsp;зависимости от&nbsp;состояния приложения. Поскольку и&nbsp;то&nbsp;и&nbsp;другое&nbsp;&mdash; атрибуты, мы&nbsp;можем использовать `v-bind`: необходимо лишь вычислить результирующую строку при помощи выражения. Впрочем, каждый раз возиться с&nbsp;конкатенацией строк неудобно, к&nbsp;тому&nbsp;же это может привести к&nbsp;ошибкам. К&nbsp;счастью, у&nbsp;Vue есть дополнительные возможности директивы `v-bind` для работы с&nbsp;`class` и&nbsp;`style`. Эти атрибуты при динамическом связывании могут принимать не&nbsp;только строковые значения, но&nbsp;и&nbsp;массивы или объекты.

## Связывание CSS-классов

### Использование объектов

Для динамического задания или удаления CSS классов мы&nbsp;можем передать в&nbsp;директиву `v-bind:class` объект:

``` html
<div v-bind:class="{ active: isActive }"></div>
```

Запись выше обозначает, что наличие класса `active` будет определяться [истинностью](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) параметра `isActive`.

Таким образом можно управлять несколькими классами, добавляя в&nbsp;объект дополнительные поля. Кроме того, `v-bind:class` можно использовать и&nbsp;совместно с&nbsp;обычным атрибутом `class`:

``` html
<div class="static"
     v-bind:class="{ active: isActive, 'text-danger': hasError }">
</div>
```

При использовании этих данных:

``` js
data: {
  isActive: true,
  hasError: false
}
```

В&nbsp;результате получится:

``` html
<div class="static active"></div>
```

При изменении `isActive` или&nbsp;`hasError`, список классов элемента тоже обновится. Например, если `hasError` получит значение `true`, значением атрибута `class` станет `"static active text-danger"`.

Используемый при связывании объект не&nbsp;обязательно должен быть указан прямо в&nbsp;шаблоне:

``` html
<div v-bind:class="classObject"></div>
```
``` js
data: {
  classObject: {
    active: true,
    'text-danger': false
  }
}
```

Результат будет тем&nbsp;же. Также можно использовать и&nbsp;[вычисляемые значения](computed.html), возвращающие объекты. Это&nbsp;&mdash; распространённый и&nbsp;мощный приём:

``` html
<div v-bind:class="classObject"></div>
```
``` js
data: {
  isActive: true,
  error: null
},
computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal',
    }
  }
}
```

### Использование массивов

В `v-bind:class` можно передать и&nbsp;массив:

``` html
<div v-bind:class="[activeClass, errorClass]">
```
``` js
data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}
```

В&nbsp;результате получим:

``` html
<div class="active text-danger"></div>
```

Для переключения классов, переданных в&nbsp;массиве, в&nbsp;зависимости от&nbsp;некоторого условия, можно применить условный оператор `?`:

``` html
<div v-bind:class="[isActive ? activeClass : '', errorClass]">
```

В&nbsp;этом случае `errorClass` будет применён к&nbsp;элементу всегда, а&nbsp;`activeClass`&nbsp;&mdash; только в&nbsp;случае истинности `isActive`.

Однако, такая запись становится слегка громоздкой, если у&nbsp;вас есть несколько классов, задаваемых по&nbsp;условию. Поэтому можно использовать и&nbsp;смешанный синтаксис:

``` html
<div v-bind:class="[{ active: isActive }, errorClass]">
```

### Использование с компонентами

> Эта секция предполагает знакомство с&nbsp;[компонентами Vue](components.html). Вы&nbsp;можете спокойно пропустить её&nbsp;сейчас и&nbsp;вернуться позднее.

При применении атрибута `class` к&nbsp;пользовательскому компоненту, классы будут добавлены к&nbsp;его корневому элементу. Собственные классы элемента при этом потеряны не&nbsp;будут.

Возьмём, к&nbsp;примеру, такой компонент:

``` js
Vue.component('my-component', {
  template: '<p class="foo bar">Hi</p>'
})
```

Если при использовании указать дополнительные классы:

``` html
<my-component class="baz boo"></my-component>
```

В&nbsp;результате рендеринга получим:

``` html
<p class="foo bar baz boo">Hi</p>
```

То&nbsp;же самое справедливо для связывания классов с&nbsp;данными:

``` html
<my-component v-bind:class="{ active: isActive }"></my-component>
```

Если `isActive` истинно, результирующим HTML&nbsp;будет:

``` html
<p class="foo bar active"></p>
```

## Связывание inline-стилей

### Использование объектов

Объектная запись для `v-bind:style` довольно проста&nbsp;&mdash; выглядит почти как CSS, хотя на&nbsp;самом деле это объект JavaScript. Для указания свойств CSS можно применять как camelCase, так и&nbsp;kebab-case (не&nbsp;забывайте про кавычки при использовании kebab-case):

``` html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```
``` js
data: {
  activeColor: 'red',
  fontSize: 30
}
```

Передача объекта стилей по&nbsp;имени нередко может сделать код чище:

``` html
<div v-bind:style="styleObject"></div>
```
``` js
data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}
```

Разумеется, можно использовать и&nbsp;вычисляемые свойства, возвращающие объекты стилей.

### Использование массивов

Запись `v-bind:style` с&nbsp;массивом позволяет применить несколько объектов стилей к&nbsp;одному и&nbsp;тому&nbsp;же элементу:

``` html
<div v-bind:style="[baseStyles, overridingStyles]">
```

### Автоматические префиксы

При использовании в `v-bind:style` свойств CSS, требующих указания вендорных префиксов, Vue автоматически определит это и&nbsp;добавит подходящие префиксы к&nbsp;применяемым стилям.
