---
title: Роутинг
type: guide
order: 21
---

## Официальный Роутер

Для большинства Одностраничных Приложений рекоммендуется использовать официально поддерживаемую [библиотеку vue-router](https://github.com/vuejs/vue-router). Подробная информация по её использованию содержится в [документации библиотеки](http://vuejs.github.io/vue-router/).

## Простой Роутер С Нуля

Если вам достаточно простейшего роутера, и вы не хотите задействовать полновесную внешнюю библиотеку, цели можно достичь путём динамического рендеринга компонента уровня страницы, таким образом:

``` js
const NotFound = { template: '<p>Страница не найдена</p>' }
const Home = { template: '<p>главная</p>' }
const About = { template: '<p>о нас</p>' }

const routes = {
  '/': Главная,
  '/about': О нас
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

В сочетании с HTML5 History API, вы можете создать простейший, но вполне рабочий клиентский роутер. Для практического примера, смотрите [это демонстрационное приложение](https://github.com/chrisvfritz/vue-2.0-simple-routing-example).

## Интеграция Сторонних Роутеров

Если вы предпочитаете использовать сторонний роутер, как например [Page.js](https://github.com/visionmedia/page.js) или [Director](https://github.com/flatiron/director), интеграция [тоже довольна проста](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/compare/master...pagejs). Вот [полный пример](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/tree/pagejs) для Page.js.
