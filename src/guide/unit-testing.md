---
title: Модульное Тестирование
type: guide
order: 23
---

## Выбор Инструментов и Предварительная Настройка

Anything compatible with a module-based build system will work, but if you're looking for a specific recommendation, try the [Karma](http://karma-runner.github.io) test runner. It has a lot of community plugins, including support for [Webpack](https://github.com/webpack/karma-webpack) and [Browserify](https://github.com/Nikku/karma-browserify). For detailed setup, please refer to each project's respective documentation, though these example Karma configurations for [Webpack](https://github.com/vuejs/vue-loader-example/blob/master/build/karma.conf.js) and [Browserify](https://github.com/vuejs/vueify-example/blob/master/karma.conf.js) may help you get started.

В целом, сгодится любой инструментарий, совместимый с модульными системами сборки, но если вы ищете готовый рецепт, советуем вам использовать тестраннер [Karma](http://karma-runner.github.io). Для него создано много плагинов, включая обеспечивающие поддержку [Webpack](https://github.com/webpack/karma-webpack) и [Browserify](https://github.com/Nikku/karma-browserify). Для детального руководства, пожалуйста обратитесь к документации соответствующего проекта, а вот эти примеры конфигурации Karma для [Webpack](https://github.com/vuejs/vue-loader-example/blob/master/build/karma.conf.js) и [Browserify](https://github.com/vuejs/vueify-example/blob/master/karma.conf.js) могут помочь вам начать.

## Простые Операторы Контроля

Для того, чтобы компоненты были пригодны для тестирования, нет необходимости делать что-то особенное. Просто экспортируйте объект опций:

``` html
<template>
  <span>{{ message }}</span>
</template>

<script>
  export default {
    data () {
      return {
        message: 'hello!'
      }
    },
    created () {
      this.message = 'bye!'
    }
  }
</script>
```

Для тестирования компонента нужно просто импортировать его вместе со Vue, и использовать обыкновенные операторы контроля:

``` js
// Импортируем Vue и тестируемый компонент
import Vue from 'vue'
import MyComponent from 'path/to/MyComponent.vue'

// Здесь используются тексты Jasmine 2.0, но вы можете
// выбрать любую предпочтительную библиотеку / тестраннер
describe('MyComponent', () => {
  // Проверка опций компонента
  it('has a created hook', () => {
    expect(typeof MyComponent.created).toBe('function')
  })

  // Оценка результатов методов в опциях
  it('sets the correct default data', () => {
    expect(typeof MyComponent.data).toBe('function')
    const defaultData = MyComponent.data()
    expect(defaultData.message).toBe('hello!')
  })

  // Анализ инстанса компонента при монтировании
  it('correctly sets the message when created', () => {
    const vm = new Vue(MyComponent).$mount()
    expect(vm.message).toBe('bye!')
  })

  // Монтирование инстанса и оценка вывода рендера
  it('renders the correct message', () => {
    const Ctor = Vue.extend(MyComponent)
    const vm = new Ctor().$mount()
    expect(vm.$el.textContent).toBe('bye!')
  })
})
```

## Создание Тестируемых Компонентов

Результаты рендеринга многих компонентов полностью определяются их входными параметрами. В действительности, если вывод рендеринга зависит только от входных параметров компонента, тестирование становится крайне прямолинейным и похожим на контроллирование возвращаемого значения чистой функции в зависимости от разных аргументов. Рассмотрим надуманный пример:

``` html
<template>
  <p>{{ msg }}</p>
</template>

<script>
  export default {
    props: ['msg']
  }
</script>
```

Можно проконтроллировать вывод рендеринга в зависимости от разных значений входных параметров, используя опцию `propsData`:

``` js
import Vue from 'vue'
import MyComponent from './MyComponent.vue'

// вспомогательная функция, выполняющая монтирование и
// возвращающая строку с результатами рендеринга
function getRenderedText (Component, propsData) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({ propsData }).$mount()
  return vm.$el.textContent
}

describe('MyComponent', () => {
  it('render correctly with different props', () => {
    expect(getRenderedText(MyComponent, {
      msg: 'Hello'
    })).toBe('Hello')

    expect(getRenderedText(MyComponent, {
      msg: 'Bye'
    })).toBe('Bye')
  })
})
```

## Контроль Асинхронных Обновлений

Поскольку Vue [выполняет обновления DOM асинхронно](/guide/reactivity.html#Async-Update-Queue), контроль результатов обновления DOM в зависимости от изменений состояния компонента должен выполняться в переданном в `Vue.nextTick` коллбэке:

``` js
// Оценить созданный HTML после обновления состояния компонента
it('updates the rendered message when vm.message updates', done => {
  const vm = new Vue(MyComponent).$mount()
  vm.message = 'foo'

  // дождаться следующего "тика" перед оценкой состояния DOM
  Vue.nextTick(() => {
    expect(vm.$el.textContent).toBe('foo')
    done()
  })
})
```

Мы планируем создать набор вспомогательных функций для дальнейшего облегчения тестирования рендеринга компонентов с определёнными ограничениями (напр. для поверхностного рендеринга, игнорирующего дочерние компоненты) и оценки его результатов.