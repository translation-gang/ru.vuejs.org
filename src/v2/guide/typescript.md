---
title: Поддержка TypeScript
type: guide
order: 25
---

## Официальные файлы деклараций

Статическая типизация может предотвратить много потенциальных ошибок времени выполнения, особенно при разрастании приложений. По этой причине Vue поставляется с [официальными файлами деклараций](https://github.com/vuejs/vue/tree/dev/types) [TypeScript](https://www.typescriptlang.org/) - не только для ядра Vue, но также [для Vue Router](https://github.com/vuejs/vue-router/tree/dev/types) и [для Vuex](https://github.com/vuejs/vuex/tree/dev/types).

Так как все это уже [опубликовано на NPM](https://unpkg.com/vue/types/), то вам даже не понадобится использовать внешние инструменты, такие как `Typings`, потому что заголовки автоматически импортируются вместе с Vue. Это значит, что все, что вам нужно - это просто:

``` ts
import Vue = require('vue')
```

После этого все методы, свойства и параметры будут автоматически проверяться на типы. К примеру, если вы напечатали в опции компонента `tempate` вместо `template` (пропустив `l`), компилятор TypeScript выведет ошибку во время компиляции. Если же вы используете редактор с поддержкой проверки синтаксиса TypeScript, такой как [Visual Studio Code](https://code.visualstudio.com/), то вы сможете увидеть все эти ошибки даже до компиляции:

![Ошибка типизации TypeScript в Visual Studio Code](/images/typescript-type-error.png)

### Опции компиляции

Файлы деклараций Vue требуют [опцию компиляции](https://www.typescriptlang.org/docs/handbook/compiler-options.html) `--lib DOM,ES2015.Promise`. Эту опцию можно передать в команду `tsc`, либо добавить ее эквивалент в файл `tsconfig.json`.

### Получение доступа к типам Vue

Если вы хотите использовать типы Vue для аннотации собственного кода, то вы можете получить доступ к ним на экспортируемом объекте Vue. К примеру, для аннотации экспортируемого объекта опций компонента (как в файлах `.vue`) вы можете написать:

``` ts
import Vue = require('vue')

export default {
  props: ['message'],
  template: '<span>{{ message }}</span>'
} as Vue.ComponentOptions<Vue>
```

## Компоненты Vue в виде классов

К опциям комонента Vue могут быть легко добавлены аннотации типов:

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

К сожалению, есть несколько ограничений:

- __TypeScript не может вывести все типы из API Vue.__ К примеру, он не знает, что свойство `message`, возвращаемое в нашей функции `data` будет добавлено к инстансу `MyComponent`. Это означает, что если мы присвоим число или булево значение переменной `message`, проверка синтаксиса и компиляторы не выбросят ошибку о том, что это должна была быть строка.

- По причине этого ограничения __аннотирование типов может быть громоздким__. Единственной причиной, по которой нам необходимо вручную объявлять переменную `message` строкой, является неспособность TypeScript вывести тип в данном случае.

К счастью, [vue-class-component](https://github.com/vuejs/vue-class-component) может решить обе эти проблемы. Это официальная библиотека, которая позволяет объявлять компоненты как нативные классы JavaScript, используя декоратор `@Component`. В качестве примера давайте перепишем компонент, приведенный выше:

``` ts
import Vue = require('vue')
import Component from 'vue-class-component'

// декоратор @Component указывает, что класс - это компонент Vue
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

С таким альтернативным синтаксисом наши определения компонентов не только более краткие, но также позволяют TypeScript вывести типы `message` и `onClick` без необходимости в явном объявлении интерфейса. Такой подход позволяет управлять типами даже для вычисляемых свойств, хуков жизненного цикла и рендер-функций. Для полной информации об использовании смотрите [документацию vue-class-component](https://github.com/vuejs/vue-class-component#vue-class-component).