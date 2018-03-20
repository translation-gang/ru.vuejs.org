---
title: Модульное тестирование
type: guide
order: 403
---

## Выбор инструментов и предварительная настройка

В целом, сгодится любой инструментарий, совместимый с модульными системами сборки, но если вы ищете готовый рецепт, советуем вам использовать тест-раннер [Karma](http://karma-runner.github.io). Для него создано много плагинов, включая обеспечивающие поддержку [Webpack](https://github.com/webpack/karma-webpack) и [Browserify](https://github.com/Nikku/karma-browserify). Для детального руководства, пожалуйста обратитесь к документации соответствующего проекта, а вот эти примеры конфигурации Karma для [Webpack](https://github.com/vuejs-templates/webpack/blob/master/template/test/unit/karma.conf.js) и [Browserify](https://github.com/vuejs-templates/browserify/blob/master/template/karma.conf.js) могут помочь вам начать.

## Простые операторы контроля

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

Для тестирования компонента нужно просто импортировать его вместе с Vue, и использовать обыкновенные операторы контроля:

``` js
// Импортируем Vue и тестируемый компонент
import Vue from 'vue'
import MyComponent from 'path/to/MyComponent.vue'

// Здесь используются тесты Jasmine 2.0, но вы можете
// взять любой тест-раннер и библиотеку для сравнения
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

  // Анализ экземпляра компонента при монтировании
  it('correctly sets the message when created', () => {
    const vm = new Vue(MyComponent).$mount()
    expect(vm.message).toBe('bye!')
  })

  // Монтирование экземпляра и оценка вывода рендеринга
  it('renders the correct message', () => {
    const Constructor = Vue.extend(MyComponent)
    const vm = new Constructor().$mount()
    expect(vm.$el.textContent).toBe('bye!')
  })
})
```

## Создание тестируемых компонентов

Результаты рендеринга многих компонентов полностью определяются их входными параметрами. В действительности, если вывод рендеринга зависит только от входных параметров компонента, тестирование становится крайне прямолинейным и похожим на контроль возвращаемого значения чистой функции в зависимости от разных аргументов. Рассмотрим надуманный пример:

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

Можно проконтролировать вывод рендеринга в зависимости от разных значений входных параметров, используя опцию `propsData`:

``` js
import Vue from 'vue'
import MyComponent from './MyComponent.vue'

// вспомогательная функция, выполняющая монтирование и
// возвращающая строку с результатами рендеринга
function getRenderedText (Component, propsData) {
  const Constructor = Vue.extend(Component)
  const vm = new Constructor({ propsData: propsData }).$mount()
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

## Контроль асинхронных обновлений

Поскольку Vue [выполняет обновления DOM асинхронно](reactivity.html#Асинхронная-очередь-обновлений), контроль результатов обновления DOM в зависимости от изменений состояния компонента должен выполняться в переданном в `Vue.nextTick` коллбэке:

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

Мы планируем создать набор вспомогательных функций для дальнейшего облегчения тестирования рендеринга компонентов с определёнными ограничениями (например, для поверхностного рендеринга, игнорирующего дочерние компоненты) и оценки его результатов.

Подробнее о модульном тестировании во Vue, вы можете изучить на [vue-test-utils](https://vue-test-utils.vuejs.org/ru/) и на странице нашей книги рецептов [о модульном тестировании компонентов Vue](https://ru.vuejs.org/v2/cookbook/unit-testing-vue-components.html).