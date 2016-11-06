---
title: Управление Состоянием Приложения
type: guide
order: 22
---

## Официальная Flux-подобная Библиотека

Сложность больших приложений нередко разрастается из-за распределения кусочков состояния по многим компонентам и связям между ними. Для решения этой проблемы, Vue предлагает [vuex](https://github.com/vuejs/vuex): нашу собственную библиотеку управления состоянием, вдохновлённую языком Elm. Она даже интегрируется с [vue-devtools](https://github.com/vuejs/vue-devtools), из коробки давая доступ к функционалу "машины времени".

### Информация React-Разработчикам

Если вы переходите на Vue с React, может быть интересно, как связаны vuex и [redux](https://github.com/reactjs/redux), являющийся наиболее популярной имплементацией Flux в React-экосистеме. Redux агностистичен насчёт слоя представления, так что его можно напрямую использовать со Vue, применив [простые байндинги](https://github.com/egoist/revue). Vuex же _знает_, что работает с приложением Vue, что позволяет достичь лучшей интеграции, использовать более интуитивно-понятный API и в результате делает разработку приятнее.

## Простое Управление Состоянием с Нуля

It is often overlooked that the source of truth in Vue applications is the raw `data` object - a Vue instance simply proxies access to it. Therefore, if you have a piece of state that should be shared by multiple instances, you can simply share it by identity:

``` js
const sourceOfTruth = {}

const vmA = new Vue({
  data: sourceOfTruth
})

const vmB = new Vue({
  data: sourceOfTruth
})
```

Now whenever `sourceOfTruth` is mutated, both `vmA` and `vmB` will update their views automatically. Subcomponents within each of these instances would also have access via `this.$root.$data`. We have a single source of truth now, but debugging would be a nightmare. Any piece of data could be changed by any part of our app at any time, without leaving a trace.

To help solve this problem, we can adopt a simple **store pattern**:

``` js
var store = {
  debug: true,
  state: {
    message: 'Hello!'
  },
  setMessageAction (newValue) {
    this.debug && console.log('setMessageAction triggered with', newValue)
    this.state.message = newValue
  },
  clearMessageAction () {
    this.debug && console.log('clearMessageAction triggered')
    this.state.message = 'action B triggered'
  }
}
```

Notice all actions that mutate the store's state are put inside the store itself. This type of centralized state management makes it easier to understand what type of mutations could happen and how are they triggered. When something goes wrong, we'll also now have a log of what happened leading up to the bug.

In addition, each instance/component can still own and manage its own private state:

``` js
var vmA = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})

var vmB = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})
```

![State Management](/images/state.png)

<p class="tip">It's important to note that you should never replace the original state object in your actions - the components and the store need to share reference to the same object in order for mutations to be observed.</p>

As we continue developing the convention where components are never allowed to directly mutate state that belongs to a store, but should instead dispatch events that notify the store to perform actions, we eventually arrive at the [Flux](https://facebook.github.io/flux/) architecture. The benefit of this convention is we can record all state mutations happening to the store and implement advanced debugging helpers such as mutation logs, snapshots, and history re-rolls / time travel.

This brings us full circle back to [vuex](https://github.com/vuejs/vuex), so if you've read this far it's probably time to try it out!
