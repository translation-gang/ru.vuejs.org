---
title: Однофайловые компоненты
type: guide
order: 19
---

## Введение

Во&nbsp;многих проектах, глобальные компоненты определяются посредством `Vue.component`, с&nbsp;последующим `new Vue({ el: '#container' })` для указания элемента-контейнера в&nbsp;теле каждой страницы.

Для проектов малого и&nbsp;среднего размера, в&nbsp;которых JavaScript используется лишь для некоторых страниц, этот подход может прекрасно работать. В&nbsp;более&nbsp;же сложных проектах или в&nbsp;случаях, когда весь ваш фронтенд управляется JavaScript, явными становятся следующие недостатки:

- **Глобальное определение** заставляет давать уникальное имя каждому компоненту
- **Строковым шаблонам** не&nbsp;хватает подсветки синтаксиса. Кроме того, приходится использовать уродливые слэши для многострочного HTML.
- **Нет модульной поддержки CSS**&nbsp;&mdash; в&nbsp;то&nbsp;время как HTML и&nbsp;JavaScript разбиваются на&nbsp;модули-компоненты, CSS оказывается за&nbsp;бортом.
- **Отсутствие шага сборки** ограничивает нас только HTML и&nbsp;ES5&nbsp;JavaScript, не&nbsp;позволяя использовать препроцессоры вроде Pug (бывший Jade) и&nbsp;Babel

Все эти недостатки решаются **однофайловыми компонентами** с&nbsp;расширением `.vue`, использование которых позволяют такие инструменты как Webpack и&nbsp;Browserify.

Вот простой пример файла, который мы&nbsp;назовём `Hello.vue`:

<img src="/images/vue-component.png" style="display: block; margin: 30px auto">

Мы&nbsp;получили:

- [полную подсветку синтаксиса](https://github.com/vuejs/awesome-vue#syntax-highlighting)
- [модули CommonJS](https://webpack.github.io/docs/commonjs.html)
- [модульный CSS](https://github.com/vuejs/vue-loader/blob/master/docs/en/features/scoped-css.md)

Как и&nbsp;обещалось, мы&nbsp;также можем использовать препроцессоры, такие как Pug, Babel (с&nbsp;модулями ES2015) и&nbsp;Stylus для создания более ясных и&nbsp;функциональных компонентов.

<img src="/images/vue-component-with-preprocessors.png" style="display: block; margin: 30px auto">

Перечисленные языки даны только для примера. С&nbsp;тем&nbsp;же успехом можно использовать Buble, TypeScript, SCSS, PostCSS&nbsp;&mdash; или любые другие пре- или постпроцессоры по&nbsp;вкусу.

<!-- TODO: include CSS modules once it's supported in vue-loader 9.x -->

## Начало работы

### Для новичков в модульных системах сборки JavaScript

С `.vue`-компонентами, мы&nbsp;входим во&nbsp;вселенную продвинутых JavaScript-приложений. Это значит, что если вы&nbsp;этого ещё не&nbsp;сделали, нужно будет освоить некоторые дополнительные инструменты:

- **Node Package Manager (NPM)**: Прочитайте [руководство по&nbsp;началу работы](https://docs.npmjs.com/getting-started/what-is-npm) до&nbsp;секции _10: Uninstalling global packages_.

- **Современный JavaScript стандартов ES2015/16**: Прочитайте [руководство по&nbsp;ES2015](https://babeljs.io/docs/learn-es2015/) от&nbsp;Babel. Нет необходимости запоминать все новые возможности, но&nbsp;держите эту страничку под рукой в&nbsp;качестве справочника.

После того как вы&nbsp;уделили время этим ресурсам, мы&nbsp;советуем вам посмотреть на&nbsp;шаблон [webpack-simple](https://github.com/vuejs-templates/webpack-simple). Следуйте инструкциям, и&nbsp;очень скоро у&nbsp;вас будет рабочий проект с&nbsp;`.vue`-компонентами, ES2015 и&nbsp;горячей заменой модулей.

Этот шаблон использует [Webpack](https://webpack.github.io/)&nbsp;&mdash; сборщик, соединяющий набор &laquo;модулей&raquo; в&nbsp;результирующее приложение. [Это видео](https://www.youtube.com/watch?v=WQue1AN93YU) представляет собой неплохое введение. Разобравшись с&nbsp;основами, вы&nbsp;возможно также захотите посмотреть [этот курс по&nbsp;продвинутому использованию Webpack на&nbsp;Egghead.io](https://egghead.io/courses/using-webpack-for-production-javascript-applications).

В&nbsp;Webpack каждый модуль может быть подвергнут трансформации загрузчиком (&laquo;loader&raquo;) перед включением в&nbsp;сборку. Vue предоставляет плагин [vue-loader](https://github.com/vuejs/vue-loader) для трансляции однофайловых `.vue`-компонентов. Шаблон [webpack-simple](https://github.com/vuejs-templates/webpack-simple) содержит уже настроенный проект, но&nbsp;если вы&nbsp;хотели&nbsp;бы узнать больше о&nbsp;том, как работают `.vue`-компоненты в&nbsp;связке с&nbsp;Webpack, можно почитать [документацию vue-loader](https://vue-loader.vuejs.org).

### Для продвинутых пользователей

Независимо от&nbsp;того, Webpack или Browserify вы&nbsp;предпочитаете, у&nbsp;нас есть хорошо документированные шаблоны как для простых, так и&nbsp;для более сложных проектов. Советуем выбрать подходящий для вас шаблон&nbsp;на [github.com/vuejs-templates](https://github.com/vuejs-templates) и, следуя инструкциям в&nbsp;README, создать проект с&nbsp;помощью [vue-cli](https://github.com/vuejs/vue-cli).
