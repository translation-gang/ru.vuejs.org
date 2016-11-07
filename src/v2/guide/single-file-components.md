---
title: Однофайловые Компоненты
type: guide
order: 19
---

## Введение

In many Vue projects, global components will be defined using `Vue.component`, followed by `new Vue({ el: '#container '})` to target a container element in the body of every page.
Во многих проектах, глобальные компоненты определяются посредством `Vue.component`, с последующим `new Vue({ el: '#container' })` для указания элемента-контейнера в теле каждой страницы.

Для проектов малого и среднего размера, в которых JavaScript используется лишь для некоторых страниц, это может прекрасно работать. В более сложных же проектах, или в случаях когда весь ваш фронтенд управляется JavaScript, явными становятся следующие недостатки:

- **Глобальное определение** заставляют давать уникальное имя каждому компоненту
- **Строковым шаблонам** не хватает подсветки синтаксиса. Кроме того, приходится использовать уродливые слэши для многострочного HTML.
- **Нет модульной поддержки CSS** — в то время как HTML и JavaScript разбиваются на модули-компоненты, CSS оказывается за бортом.
- **Отсутствие шага сборки** ограничивает нас только HTML и ES5 JavaScript, не позволяя использовать препроцессоры вроде Pug (бывший Jade) и Babel

Все эти недостатки решаются **однофайловыми компонентами** с расширением `.vue`, использование которых позволяют такие инструменты как WebPack и Browserify.

Вот простой пример файла, который мы назовём `Hello.vue`:

<img src="/images/vue-component.png" style="display: block; margin: 30px auto">

Мы получили:

- [Полную подсветку синтаксиса](https://github.com/vuejs/awesome-vue#syntax-highlighting)
- [модули CommonJS](https://webpack.github.io/docs/commonjs.html)
- [покомпонентный CSS](https://github.com/vuejs/vue-loader/blob/master/docs/en/features/scoped-css.md)

Как и обещалось, мы также можем использовать препроцессоры, такие как Jade, Babel (с модулями ES2015) и Stylus для более ясных и функциональных компонентов.

<img src="/images/vue-component-with-preprocessors.png" style="display: block; margin: 30px auto">

Перечисленные языки даны только для примера. С тем же успехом можно использовать Buble, TypeScript, SCSS, PostCSS — или любые другие препроцессоры, улучшающие вашу продуктивность.

<!-- TODO: include CSS modules once it's supported in vue-loader 9.x -->

## Начало Работы

### Для Новичков в Модульных Системах Сборки JavaScript

С `.vue`-компонентами, мы входим во вселенную продвинутых JavaScript-приложений. Это значит, что если вы этого ещё не сделали, нужно будет освоить некоторые дополнительные инструменты:

- **Node Package Manager (NPM)**: Прочитайте [Руководство по Началу Работы](https://docs.npmjs.com/getting-started/what-is-npm) до секции  _10: Uninstalling global packages_.

- **Современный JavaScript стандартов ES2015/16**: Прочитайте [руководство по ES2015](https://babeljs.io/docs/learn-es2015/) от Babel. Нет необходимости запоминать все новые возможности, но держите эту страничку под рукой в качестве справочника.

После того как вы уделили время этим ресурсам, мы советуем вам посмотреть на шаблон webpack-simple](https://github.com/vuejs-templates/webpack-simple). Следуйте инструкциям, и очень скоро у вас будет проект рабочий проект с `.vue`-компонентами, ES2015 и hot-reloading.

Этот шаблон использует [Webpack](https://webpack.github.io/) — сборщик, соединяющий набор "модулей" в результирующее приложение. [Это видео](https://www.youtube.com/watch?v=WQue1AN93YU) представляет собой неплохое введение чтобы узнать о Webpack больше. Разобравшись с основами, вы возможно также захотите посмотреть [этот курс по продвинутому использованию WebPack на Egghead.io](https://egghead.io/courses/using-webpack-for-production-javascript-applications).

В Webpack, каждый модуль может быть подвергнут трансформации "loader'ом" перед включением в сборку. Vue предоставляет плагин [vue-loader](https://github.com/vuejs/vue-loader) для трансляции однофайловых `.vue`-компонентов. Шаблон [webpack-simple](https://github.com/vuejs-templates/webpack-simple) содержит уже настроенный проект, но если вы хотели бы узнать больше о том, как работают `.vue`-компоненты в связке с Webpack, можно почитать [документацию vue-loader](https://vue-loader.vuejs.org).

### Для Продвинутых Пользователей

Независимо от того, Webpack или Browserify вы предпочитаете, у нас есть хорошо документированные шаблоны как для простых, так и для более сложных проектов. Мы советуем вам выбрать подходящий для вас шаблон на [github.com/vuejs-templates](https://github.com/vuejs-templates), и, следуя инструкциям в README, создать проект с помощью [vue-cli](https://github.com/vuejs/vue-cli).
