---
title: Роутинг
type: guide
order: 21
---

## Официальный роутер

Для большинства одностраничных приложений (SPA) рекомендуется использовать официально поддерживаемую [библиотеку Vue-router](https://github.com/vuejs/vue-router). Подробная информация по&nbsp;её&nbsp;использованию содержится в&nbsp;[документации библиотеки](http://vuejs.github.io/vue-router/).

## Простой роутер с нуля

Если вам достаточно простейшего роутера, и&nbsp;вы&nbsp;не&nbsp;хотите задействовать полновесную внешнюю библиотеку, может оказаться достаточно просто динамического рендеринга компонента уровня страницы:

``` js
const NotFound = { template: '<p>Страница не найдена</p>' }
const Home = { template: '<p>главная</p>' }
const About = { template: '<p>о нас</p>' }

const routes = {
  '/': Home,
  '/about': About
}

new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent () {
      return routes[this.currentRoute] || NotFound
    }
  },
  render (h) { return h(this.ViewComponent) }
})
```

В&nbsp;сочетании с&nbsp;HTML5 History API, вы&nbsp;можете создать простейший, но&nbsp;вполне рабочий клиентский роутер. Для практического примера, смотрите [это демонстрационное приложение](https://github.com/chrisvfritz/vue-2.0-simple-routing-example).

## Интеграция сторонних роутеров

Если вы&nbsp;предпочитаете использовать сторонний роутер, как например [Page.js](https://github.com/visionmedia/page.js) или [Director](https://github.com/flatiron/director), интеграция [тоже довольна проста](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/compare/master...pagejs). Вот [полный пример](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/tree/pagejs) для Page.js.
