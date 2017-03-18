---
title: Поддержка TypeScript
type: guide
order: 25
---

## Важное изменение в 2.2 для пользователей TS + Webpack 2

Во Vue 2.2 мы добавили файлы дистрибутивов в формате ES-модулей, которые используются по умолчанию в Webpack 2. К сожалению, это внесло непреднамеренное критичное изменение потому что с TypeScript + Webpack 2 `import Vue = require('vue')` теперь будет возвращать синтетический объект ES-модуля вместо самого Vue.

Мы планируем обновить все официальные декларации для использования ES-стиля в будущем. Пожалуйста изучите [рекомендуемую конфигурацию](#Рекомендуемая-конфигурация) ниже для корректной настройки на будущее.

## Официальные файлы деклараций в NPM-пакетах

Статическая типизация может предотвратить много потенциальных ошибок времени выполнения, особенно при разрастании приложений. По этой причине Vue поставляется с [официальными файлами деклараций](https://github.com/vuejs/vue/tree/dev/types) [TypeScript](https://www.typescriptlang.org/) причём не только для ядра Vue, но также для [Vue Router](https://github.com/vuejs/vue-router/tree/dev/types) и [Vuex](https://github.com/vuejs/vuex/tree/dev/types).

Так как всё это уже [опубликовано на NPM](https://unpkg.com/vue/types/), то вам даже не понадобится использовать внешние инструменты, такие как `Typings`, потому что декларации типов автоматически импортируются вместе с Vue.

## Рекомендуемая конфигурация

``` js
// tsconfig.json
{
  "compilerOptions": {
    // ... другие опции опущены
    "allowSyntheticDefaultImports": true,
    "lib": [
      "dom",
      "es5",
      "es2015.promise"
    ]
  }
}
```

Обратите внимание на опцию `allowSyntheticDefaultImports`, которая позволяет использовать следующее:

``` js
import Vue from 'vue'
```

вместо:

``` js
import Vue = require('vue')
```

Первый вариант (синтаксис ES модуля) рекомендуется, потому что это соответствует рекомендациям по использованию ES-модулей, и в будущем мы планируем обновить все официальные декларации для использования экспортов в ES-стиле.

Кроме того, если вы используете TypeScript вместе с Webpack 2, также рекомендуется следующее:

``` js
{
  "compilerOptions": {
    // ... другие опции опущены
    "module": "es2015",
    "moduleResolution": "node"
  }
}
```

Это сообщает TypeScript оставлять импорты ES-модуля нетронутыми, что в свою очередь позволяет Webpack 2 воспользоваться преимуществами tree-shaking для ES-модулей.

Смотрите также [документацию по настройке компилатора TypeScript](https://www.typescriptlang.org/docs/handbook/compiler-options.html).

## Использование файлов деклараций Vue

Файлы деклараций Vue экспортируют множество полезных [деклараций типов](https://github.com/vuejs/vue/blob/dev/types/index.d.ts). Например, для аннотаций экспортированного объекта опций компонента (например в `.vue` файле):

``` ts
import Vue, { ComponentOptions } from 'vue'

export default {
  props: ['message'],
  template: '<span>{{ message }}</span>'
} as ComponentOptions<Vue>
```

## Компоненты Vue в виде классов

К опциям компонента Vue легко могут быть добавлены аннотации типов:

``` ts
import Vue, { ComponentOptions }  from 'vue'

// Объявляем тип компонента
interface MyComponent extends Vue {
  message: string
  onClick (): void
}

export default {
  template: '<button @click="onClick">Click!</button>',
  data: function () {
    return {
      message: 'Hello!'
    }
  },
  methods: {
    onClick: function () {
      // TypeScript знает, что `this` является типом MyComponent
      // и что `this.message` будет строкой
      window.alert(this.message)
    }
  }
// Необходимо явно добавить аннотацию типа MyComponent
// к экспортируемому объекту опций
} as ComponentOptions<MyComponent>
```

К сожалению, есть несколько ограничений:

- __TypeScript не может вывести все типы из API Vue.__ К примеру, он не знает, что свойство `message`, возвращаемое в нашей функции `data` будет добавлено к экземпляру `MyComponent`. Это означает, что если мы присвоим число или булево значение переменной `message`, проверка синтаксиса и компиляторы не выбросят ошибку о том, что это должна была быть строка.

- По причине этого ограничения __аннотирование типов может быть громоздким__. Единственной причиной, по которой нам необходимо вручную объявлять переменную `message` строкой, является неспособность TypeScript вывести тип в данном случае.

К счастью, [vue-class-component](https://github.com/vuejs/vue-class-component) может решить обе эти проблемы. Это официальная библиотека, которая позволяет объявлять компоненты как нативные классы JavaScript, используя декоратор `@Component`. В качестве примера давайте перепишем компонент, приведённый выше:

``` ts
import Vue from 'vue'
import Component from 'vue-class-component'

// декоратор @Component указывает, что класс — это компонент Vue
@Component({
  // здесь можно использовать все опции компонента
  template: '<button @click="onClick">Click!</button>'
})
export default class MyComponent extends Vue {
  // Данные инициализации могут быть объявлены как свойства экземпляра
  message: string = 'Hello!'

  // Методы компонента могут быть объявлены как методы экземпляра
  onClick (): void {
    window.alert(this.message)
  }
}
```

С таким альтернативным синтаксисом наши определения компонентов не только более краткие, но также позволяют TypeScript вывести типы `message` и `onClick` без необходимости в явном объявлении интерфейса. Такой подход позволяет управлять типами даже для вычисляемых свойств, хуков жизненного цикла и рендер-функций. Для полной информации об использовании смотрите [документацию vue-class-component](https://github.com/vuejs/vue-class-component#vue-class-component).
