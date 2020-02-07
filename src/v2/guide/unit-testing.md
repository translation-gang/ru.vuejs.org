---
title: Модульное тестирование
type: guide
order: 402
---

> [Vue CLI](https://cli.vuejs.org/ru/) предоставляет опции для модульного тестирования с помощью [Jest](https://github.com/facebook/jest) или [Mocha](https://mochajs.org/), которые работают из коробки. У нас также есть официальный пакет [Vue Test Utils](https://vue-test-utils.vuejs.org/ru/), который предоставляет более подробное руководство для пользовательских конфигураций.

## Простые операторы контроля

Для того, чтобы компоненты были пригодны для тестирования, нет необходимости делать что-то особенное. Просто экспортируйте объект опций:

```html
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

Для тестирования компонента нужно просто импортировать его вместе с Vue, и использовать обыкновенные операторы контроля (здесь в качестве примера мы используем операторы контроля `expect` в стиле Jasmine/Jest):

```js
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

  // Монтирование экземпляра и оценка вывода отрисовки
  it('renders the correct message', () => {
    const Constructor = Vue.extend(MyComponent)
    const vm = new Constructor().$mount()
    expect(vm.$el.textContent).toBe('bye!')
  })
})
```

## Создание тестируемых компонентов

Результат отрисовки компонента по большей части определяется входными параметрами, которые он принимает. В действительности, если вывод отрисовки зависит только от входных параметров компонента, тестирование становится крайне прямолинейным и похожим на контроль возвращаемого значения чистой функции в зависимости от разных аргументов. Рассмотрим надуманный пример:

```html
<template>
  <p>{{ msg }}</p>
</template>

<script>
  export default {
    props: ['msg']
  }
</script>
```

Можно проконтролировать вывод отрисовки в зависимости от разных значений входных параметров, используя [Vue Test Utils](https://vue-test-utils.vuejs.org/ru/):

```js
import { shallowMount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'

// вспомогательная функция, выполняющая монтирование и
// возвращающая отрисованный компонент
function getMountedComponent (Component, propsData) {
  return shallowMount(MyComponent, {
    propsData
  })
}

describe('MyComponent', () => {
  it('render correctly with different props', () => {
    expect(
      getMountedComponent(MyComponent, {
        msg: 'Hello'
      }).text()
    ).toBe('Hello')

    expect(
      getMountedComponent(MyComponent, {
        msg: 'Bye'
      }).text()
    ).toBe('Bye')
  })
})
```

## Контроль асинхронных обновлений

Поскольку Vue [выполняет обновления DOM асинхронно](reactivity.html#Асинхронная-очередь-обновлений), контроль результатов обновления DOM в зависимости от изменений состояния компонента должен выполняться после разрешения `vm.$nextTick()`:

```js
// Оценить созданный HTML после обновления состояния компонента
it('updates the rendered message when wrapper.message updates', async () => {
  const wrapper = shallowMount(MyComponent)
  wrapper.setData({ message: 'foo' })

  // Дожидаемся следующего "tick" после изменения состояния перед проверкой изменений в DOM
  await wrapper.vm.$nextTick()
  expect(wrapper.text()).toBe('foo')
})
```

Подробнее о модульном тестировании во Vue, вы можете изучить на [Vue Test Utils](https://vue-test-utils.vuejs.org/ru/) и на странице нашей книги рецептов [о модульном тестировании компонентов Vue](../cookbook/unit-testing-vue-components.html).
