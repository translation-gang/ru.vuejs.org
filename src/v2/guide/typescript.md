---
title: Поддержка TypeScript
type: guide
order: 404
---

> Во Vue 2.5.0+ мы значительно улучшили объявления типов для работы со стандартным объектно-ориентированным API. В то же время он вводит несколько изменений, требующих действий для обновления. Прочитайте [пост в блоге](https://medium.com/the-vue-point/upcoming-typescript-changes-in-vue-2-5-e9bd7e2ecf08) для более подробной информации.

## Официальные файлы объявлений в NPM-пакетах

Статическая типизация может предотвратить много потенциальных ошибок времени выполнения, особенно при разрастании приложений. По этой причине Vue поставляется с [официальными файлами объявлений](https://github.com/vuejs/vue/tree/dev/types) [TypeScript](https://www.typescriptlang.org/), причём не только для ядра Vue, но также для [Vue Router](https://github.com/vuejs/vue-router/tree/dev/types) и [Vuex](https://github.com/vuejs/vuex/tree/dev/types).

Так как всё это уже [опубликовано на NPM](https://cdn.jsdelivr.net/npm/vue/types/), то вам даже не понадобится использовать внешние инструменты, такие как `Typings`, потому что объявления типов автоматически импортируются вместе с Vue.

Мы также планируем предоставить возможность развёртывания готового к использованию проекта Vue + TypeScript через `vue-cli` в ближайшем будущем.

## Рекомендуемая конфигурация

``` js
// tsconfig.json
{
  "compilerOptions": {
    // это соответствует поддержке браузеров у Vue
    "target": "es5",
    // это обеспечивает более строгий вывод для свойств данных в `this`
    "strict": true,
    // при использовании webpack 2+ или rollup, добавить поддержку tree-shaking:
    "module": "es2015",
    "moduleResolution": "node"
  }
}
```

Обратите внимание, вы должны включить `strict: true` (или, по крайней мере, `noImplicitThis: true`, которая является частью флага `strict`), чтобы использовать проверку типов у `this` в методах компонентов, иначе он всегда будет рассматриваться как тип `any`.

Смотрите также [документацию по настройке компилятора TypeScript](https://www.typescriptlang.org/docs/handbook/compiler-options.html).

## Инструменты разработки

Для разработки приложений Vue с использованием TypeScript мы настоятельно рекомендуем использовать [Visual Studio Code](https://code.visualstudio.com/), которая предоставляет отличную встроенную поддержку для TypeScript.

Если вы используете [однофайловые компоненты](./single-file-components.html), воспользуйтесь отличным [расширением Vetur](https://github.com/vuejs/vetur), которое обеспечивает вывод TypeScript внутри однофайловых компонентов и многие другие возможности.

[WebStorm](https://www.jetbrains.com/webstorm/) также предоставляет встроенную поддержку для TypeScript и Vue.js.

## Использование

Чтобы позволить TypeScript правильно выводить типы внутри опций компонента Vue, вам необходимо определять компоненты с помощью `Vue.component` или `Vue.extend`:

``` ts
import Vue from 'vue'

const Component = Vue.extend({
  // вывод типов включён
})

const Component = {
  // это НЕ БУДЕТ работать,
  // потому что TypeScript не может определить, что это опции компонента Vue.
}
```

## Компоненты Vue на основе классов

Если вы предпочитаете API на основе классов при объявлении компонентов, вы можете использовать официально поддерживаемый декоратор [vue-class-component](https://github.com/vuejs/vue-class-component):

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

## Расширение типов для использования с плагинами

Плагины могут добавлять во Vue новые глобальные свойства, свойства экземпляра и параметры компонента. В этих случаях необходимы объявления типов для возможности плагина компилироваться в TypeScript. К счастью, есть функция TypeScript для расширения существующих типов, называемая [расширением модуля (module augmentation)](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).

Например, чтобы объявить свойство экземпляра `$myProperty` с типом `string`:

``` ts
// 1. Обязательно импортируйте Vue перед объявлением расширенных типов
import Vue from 'vue'

// 2. Укажите файл с типами, которые вы хотите расширить
//    Vue имеет тип конструктора в types/vue.d.ts
declare module 'vue/types/vue' {
  // 3. Объявите расширение для Vue
  interface Vue {
    $myProperty: string
  }
}
```

После включения указанного выше кода в файл объявлений (например, `my-property.d.ts`) в вашем проекте, вы можете использовать `$myProperty` в экземпляре Vue.

```ts
var vm = new Vue()
console.log(vm.$myProperty) // Это скомпилируется без ошибок
```

Вы также можете объявить дополнительные глобальные свойства и параметры компонента:

```ts
import Vue from 'vue'

declare module 'vue/types/vue' {
  // Глобальные свойства можно объявлять
  // на интерфейсе `VueConstructor`
  interface VueConstructor {
    $myGlobal: string
  }
}

// ComponentOptions объявляется в types/options.d.ts
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    myOption?: string
  }
}
```

Указанные выше объявления позволяют скомпилировать следующий код:

```ts
// Глобальное свойство
console.log(Vue.$myGlobal)

// Дополнительный параметр компонента
var vm = new Vue({
  myOption: 'Привет'
})
```

## Аннотации возвращаемых типов

Из-за циклической природы файлов объявлений Vue, TypeScript может столкнуться с трудностями при определении типов определённых методов. По этой причине вам может потребоваться аннотировать возвращаемый тип для методов, таких как `render` и тех, которые находятся в `computed`.

```ts
import Vue, { VNode } from 'vue'

const Component = Vue.extend({
  data () {
    return {
      msg: 'Привет'
    }
  },
  methods: {
    // необходима аннотация из-за `this` в возвращаемом типе
    greet (): string {
      return this.msg + ', мир'
    }
  },
  computed: {
    // необходима аннотация
    greeting (): string {
      return this.greet() + '!'
    }
  },
  // `createElement` выводится, но `render` нуждается в возвращаемом типе
  render (createElement): VNode {
    return createElement('div', this.greeting)
  }
})
```

Если вы обнаружите, что вывод типа или автодополнение не работают, аннотация некоторых методов может помочь решить эти проблемы. Использование опции `--noImplicitAny` поможет найти многие из этих методов без аннотаций.
