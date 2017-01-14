---
title: Поддержка TypeScript
type: guide
order: 25
---

## Официальные файлы деклараций

Статическая типизация может предотвратить много потенциальных ошибок времени выполнения, особенно при разрастании приложений. По&nbsp;этой причине Vue поставляется&nbsp;с [официальными файлами деклараций](https://github.com/vuejs/vue/tree/dev/types) [TypeScript](https://www.typescriptlang.org/) причем не&nbsp;только для ядра Vue, но&nbsp;также для [Vue Router](https://github.com/vuejs/vue-router/tree/dev/types) и&nbsp;[Vuex](https://github.com/vuejs/vuex/tree/dev/types).

Так как все это уже [опубликовано на&nbsp;NPM](https://unpkg.com/vue/types/), то&nbsp;вам даже не&nbsp;понадобится использовать внешние инструменты, такие как `Typings`, потому что декларации типов автоматически импортируются вместе с&nbsp;Vue. Это значит, что все, что вам нужно&nbsp;&mdash; это просто:

``` ts
import Vue = require('vue')
```

После этого все методы, свойства и&nbsp;параметры будут автоматически проверяться на&nbsp;типы. К&nbsp;примеру, если вы&nbsp;напечатали в&nbsp;опции компонента `tempate` вместо `template` (пропустив `l`), то&nbsp;компилятор TypeScript выведет ошибку во&nbsp;время компиляции. Если&nbsp;же вы&nbsp;используете редактор с&nbsp;поддержкой проверки синтаксиса TypeScript, такой как [Visual Studio Code](https://code.visualstudio.com/), то&nbsp;вы&nbsp;сможете увидеть все эти ошибки даже до&nbsp;компиляции:

![Ошибка типизации TypeScript в Visual Studio Code](/images/typescript-type-error.png)

### Опции компиляции

Файлы деклараций Vue требуют [опцию компиляции](https://www.typescriptlang.org/docs/handbook/compiler-options.html) `&mdash;lib DOM,ES5,ES2015.Promise`. Опцию можно передать в&nbsp;команду `tsc`, либо добавить её&nbsp;эквивалент в&nbsp;файл `tsconfig.json`.

### Получение доступа к типам Vue

Если вы&nbsp;хотите использовать типы Vue для аннотации собственного кода, то&nbsp;вы&nbsp;можете получить доступ к&nbsp;ним на&nbsp;экспортируемом объекте Vue. К&nbsp;примеру, для аннотации экспортируемого объекта опций компонента (как в&nbsp;файлах `.vue`) вы&nbsp;можете написать:

``` ts
import Vue = require('vue')

export default {
  props: ['message'],
  template: '<span>{{ message }}</span>'
} as Vue.ComponentOptions<Vue>
```

## Компоненты Vue в виде классов

К&nbsp;опциям компонента Vue легко могут быть добавлены аннотации типов:

``` ts
import Vue = require('vue')

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
} as Vue.ComponentOptions<MyComponent>
```

К&nbsp;сожалению, есть несколько ограничений:

- __TypeScript не&nbsp;может вывести все типы из&nbsp;API Vue.__ К&nbsp;примеру, он&nbsp;не&nbsp;знает, что свойство `message`, возвращаемое в&nbsp;нашей функции `data` будет добавлено к&nbsp;инстансу `MyComponent`. Это означает, что если мы&nbsp;присвоим число или булево значение переменной `message`, проверка синтаксиса и&nbsp;компиляторы не&nbsp;выбросят ошибку о&nbsp;том, что это должна была быть строка.

- По&nbsp;причине этого ограничения __аннотирование типов может быть громоздким__. Единственной причиной, по&nbsp;которой нам необходимо вручную объявлять переменную `message` строкой, является неспособность TypeScript вывести тип в&nbsp;данном случае.

К&nbsp;счастью, [vue-class-component](https://github.com/vuejs/vue-class-component) может решить обе эти проблемы. Это официальная библиотека, которая позволяет объявлять компоненты как нативные классы JavaScript, используя декоратор `@Component`. В&nbsp;качестве примера давайте перепишем компонент, приведённый выше:

``` ts
import Vue = require('vue')
import Component from 'vue-class-component'

// декоратор @Component указывает, что класс — это компонент Vue
@Component({
  // сюда можно помещать все опции компонента
  template: '<button @click="onClick">Click!</button>'
})
export default class MyComponent extends Vue {
  // Данные инициализации могут быть объявлены как свойства инстанса
  message: string = 'Hello!'

  // Методы компонента могут быть объявлены как методы инстанса
  onClick (): void {
    window.alert(this.message)
  }
}
```

С&nbsp;таким альтернативным синтаксисом наши определения компонентов не&nbsp;только более краткие, но&nbsp;также позволяют TypeScript вывести типы `message` и `onClick` без необходимости в&nbsp;явном объявлении интерфейса. Такой подход позволяет управлять типами даже для вычисляемых свойств, хуков жизненного цикла и&nbsp;рендер-функций. Для полной информации об&nbsp;использовании смотрите [документацию vue-class-component](https://github.com/vuejs/vue-class-component#vue-class-component).
