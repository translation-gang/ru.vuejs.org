---
title: Миксины
type: guide
order: 17
---

## Основы

Миксины дают гибкие возможности для расширения функциональности компонентов Vue. Объект миксина может содержать любые опции компонентов. При использовании компонентом миксина, все опции миксина "примешиваются" к собственным опциям компонента.

Пример:

``` js
// определяем объект миксина
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('привет из миксина!')
    }
  }
}

// определяем компонент, использующий миксин
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // -> "привет из миксина!"
```

## Слияние опций

Если миксин и компонент содержат пересекающиеся опции, они будут определённым образом соединены. Например, одноимённые хуки будут объединены в массив, что обеспечит вызов их всех. Кроме того, хуки миксина будут вызваны **перед** собственными хуками компонента:

``` js
var mixin = {
  created: function () {
    console.log('вызван хук миксина')
  }
}

new Vue({
  mixins: [mixin],
  created: function () {
    console.log('вызван хук компонента')
  }
})

// -> "вызван хук миксина"
// -> "вызван хук компонента"
```

Опции, ожидающие значения в форме объектов, такие как `methods`, `components` и `directives` будут объединены. В случае конфликта, приоритет имеют опции компонента:

``` js
var mixin = {
  methods: {
    foo: function () {
      console.log('foo')
    },
    conflicting: function () {
      console.log('из миксина')
    }
  }
}

var vm = new Vue({
  mixins: [mixin],
  methods: {
    bar: function () {
      console.log('bar')
    },
    conflicting: function () {
      console.log('из самого компонента')
    }
  }
})

vm.foo() // -> "foo"
vm.bar() // -> "bar"
vm.conflicting() // -> "из самого компонента"
```

Обратите внимание, что те же самые стратегии слияния используются и во `Vue.extend()`.

## Глобальные миксины

Миксин можно применить и глобально. Будьте осторожны! После применения, миксин окажет влияние на **все** инстансы Vue, создаваемые в дальнейшем. При правильном использовании это можно использовать для вставки логики обработки пользовательских опций:

``` js
// добавляем обработчик для пользовательской опции `myOption`
Vue.mixin({
  created: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

new Vue({
  myOption: 'hello!'
})
// -> "hello!"
```

<p class="tip">Используйте глобальные миксины редко и осторожно, поскольку они оказывают эффект на все до единого создаваемые инстансы Vue, включая third-party-компоненты. В большинстве случаев их стоит использовать только для обработки пользовательских опций, подобно продемонстрированной выше. Неплохой идеей будет их оформление в виде [Плагинов](plugins.html), что позволит избежать дублирования кода.</p>

## Пользовательские стратегии слияния опций

При слиянии пользовательских опций применяется стратегия по умолчанию, которая просто переписывает одни значения другими. Если вы хотите использовать отличную логику при слиянии пользовательских опций, добавьте функцию в `Vue.config.optionMergeStrategies`:

``` js
Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {
  // return mergedVal
}
```

Для большей части опций-объектов можно просто использовать стратегию, применяемую по умолчанию для опции `methods`:

``` js
var strategies = Vue.config.optionMergeStrategies
strategies.myOption = strategies.methods
```

Более сложным примером может послужить стратегия слияния из [Vuex](https://github.com/vuejs/vuex) 1.x:

``` js
const merge = Vue.config.optionMergeStrategies.computed
Vue.config.optionMergeStrategies.vuex = function (toVal, fromVal) {
  if (!toVal) return fromVal
  if (!fromVal) return toVal
  return {
    getters: merge(toVal.getters, fromVal.getters),
    state: merge(toVal.state, fromVal.state),
    actions: merge(toVal.actions, fromVal.actions)
  }
}
```
