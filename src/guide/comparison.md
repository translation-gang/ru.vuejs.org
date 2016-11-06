---
title: Сравнение с Другими Фреймворками
type: guide
order: 28
---

Определённо, этот раздел руководства — самый трудный для написания, но он очень важен. Вероятно, вы уже решаете некоторые задачи, используя тот или иной фреймворк или библиотеку. И сюда вас привело желание узнать, не позволит ли Vue решать стоящие перед вами задачи эффективнее и проще. На этот вопрос мы и надеемся дать ответ в этом документе.

Мы очень постараемся не быть предвзятыми. Будучи членами основной команды разработки Vue, мы, разумеется, сами его очень любим. На наш взгляд, с некоторыми задачами он справляется лучше, чем какой-либо иной существующий инструмент. Если бы мы не верили в это, мы бы наверное и не работали над этим проектом, верно? И тем не менее, нам бы хотелось быть предельно честными и точными в оценках. В тех случаях, когда альтернативные библиотеки имеют существенные преимущества, как например обширнейшая экосистема альтернативных рендереров React'а или поддержка браузеров вплоть до IE6 Knockout'ом, мы постараемся о не забыть о них упомянуть.

Кроме того, мы бы очень оценили **вашу** помощь в деле поддержания актуальности этого документа, ибо мир JavaScript развивается стремительно! Если вы заметите какую-либо неточность или что-то, что не выглядит правильным, пожалуйста — дайте нам знать, [открыв issue](https://github.com/vuejs/vuejs.org/issues/new?title=Inaccuracy+in+comparisons+guide).

## React

React и Vue во многом похожи. Они оба:

- используют virtual DOM
- предоставляют реактивность и компонентную структуру
- фокусируются на корневой библиотеке, вынося прочие вопросы, такие как роутинга или управления глобальным состоянием приложения в дополнительные библиотеки

Из-за столь похожих ниш, мы уделили сравнению этих фреймворков больше всего времени. Нашей целью было не только удостовериться в технической точности, но также и сохранить баланс. Мы указываем, где React превосходит Vue, например — в богатстве экосистемы и изобилии доступных пользовательских рендереров.

Помощь React-сообщества [была неоценима](https://github.com/vuejs/vuejs.org/issues/364) в деле достижения этого баланса. Особо хотелось бы поблагодарить Даниила Абрамова из команды разработки React. Он был крайне щедр на время и опыт, помогая нам довести этот документ до состояния, когда обе стороны [остались довольны](https://github.com/vuejs/vuejs.org/issues/364#issuecomment-244575740) финальным результатом.

Учитывая вышесказанное, мы надеемся что у вас не возникнет сомнений в честности нижепредставленного сравнения, в котором мы рассмотрим различия между этими библиотеками.

### Сравнение Быстродействия

В каждом из реалистичных сценариев, в котором мы проводили тесты, Vue существенно превзошёл React по быстродействию. Если ваши брови сейчас поднялись, читайте дальше. Мы расскажем, почему (и даже покажем бенчмарк, разработанный вместе с командой React).

#### Быстродействие при Рендеринге

При рендеренге UI, манипулирование DOM — зачастую самая дорогая операция. К сожалению, ни одна библиотека не может сделать эти низкоуровневые операции быстрее. Лучшее, что мы можем сделать — это:

1. Минимизировать необходимое количество изменений в DOM. Как React, так и Vue используют virtual DOM для этих целей — и примерно с равным успехом.
2. Добавить как можно меньше дополнительных операций поверх манипуляций с DOM. Здесь Vue и React отличаются.

В React, условно говоря, дополнительная трудоёмкость рендеринга элемента равна 1, а для компонента — 2. Для Vue эти цифры будут ближе к 0.1 и 4 соответственно, из-за архитектуры нашей системы реактивности.

Это значит, что в типичных приложениях, где элементов DOM куда больше, чем компонентов, Vue будет существенно обгонять React. В экстремальных же случаях, таких как использование 1 компонента для каждого HTML-элемента, Vue обычно будет медленнее. Но это ещё не всё.

И Vue, и React позволяют использовать функциональные компоненты, не имеющие ни собственного состояния, ни инстанса — и потому требующие меньших вычислительных затрат. При использовании таких компонентов в критичных по быстродействию ситуациях, Vue вновь оказывается быстрее. Для демонстрации этого, мы создали простой [бенчмарк](https://github.com/chrisvfritz/vue-render-performance-comparisons), который просто рендерит 10,000 элементов списка 100 раз. Мы призываем вас попробовать запустить его самим. Результаты отличаются в зависимости от используемого железа, браузера — и даже просто от запуска к запуску, в силу природы JavaScript-движков.

Впрочем, если вам лень этим заниматься — вот цифры, полученные при запуска бенчмарка в Chrome 52 на MacBook Air 2014. Во избежание соблазнов интерпретации, в таблицу были включены лучшие из результатов, отобранные из 20 запусков теста:

{% raw %}
<table class="benchmark-table">
  <thead>
    <tr>
      <th></th>
      <th>Vue</th>
      <th>React</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Fastest</th>
      <td>23ms</td>
      <td>63ms</td>
    </tr>
    <tr>
      <th>Median</th>
      <td>42ms</td>
      <td>81ms</td>
    </tr>
    <tr>
      <th>Average</th>
      <td>51ms</td>
      <td>94ms</td>
    </tr>
    <tr>
      <th>95th Perc.</th>
      <td>73ms</td>
      <td>164ms</td>
    </tr>
    <tr>
      <th>Slowest</th>
      <td>343ms</td>
      <td>453ms</td>
    </tr>
    </tr>
  </tbody>
</table>
{% endraw %}

#### Производительность Обновлений

В React для достижения полной оптимизации ререндеринга необходимо написать `shouldComponentUpdate` для каждого компонента, а также использовать иммутабельные структуры данных. Во Vue же, зависимости компонентов отслеживаются автоматически, поэтому они обновляются только при изменении одной из зависимостей. Единственная дополнительная оптимизация, иногда оказывающаяся полезной — это добавление ключа `key` в качестве аттрибута элементов длинных списков.

Это значит, что обновления в приложениях без специально проведённой оптимизации Vue будет показывать значительно лучшую производительность. В действительности, из-за улучшенной производительности Vue, даже полностью оптимизированные React-приложения обычно оказываются медленнее, чем приложения Vue "из коробки".

#### Производительность при Разработке

Разумеется, производительность в production — наиболее важна, и её-то мы до сих пор и обсуждали. Но и при разработке быстродействие имеет не малое значение. Хорошие новости — и Vue, и React в режиме разработки остаются довольно шустрыми для большей части приложений.

Однако, если вы занимаетесь прототипированием высокопроизводительных визуализаций данных или анимаций, вам может быть полезным знать, что в тех сценариях где Vue не мог отрендерить больше 10 кадров в секунду в режиме разработки, наблюдаемая производительность React'а находилась на уровне около 1 кадра в секунду.

Причина этой разницы — во множестве тяжёлых инвариантных проверок, помогающих снабдить разработчиков прекрасными предупреждениями и сообщениями об ошибках. Мы согласны, что эти сообщения важны — но во Vue и при их имплементации постарались не забыть о производительности.

### HTML & CSS

В React, всё — это JavaScript. Пока не копнёшь глубже — звучит это замечательно. Неприятным свойством реальности, однако, является то, что изобретение заново HTML и CSS внутри JavaScript может принести немало страдания. Во Vue мы, напротив, постарались задействовать существующие web-технологии. Чтобы показать вам, что из этого вышло, мы рассмотрим несколько примеров.

#### JSX vs Шаблоны

In React, all components express their UI within render functions using JSX, a declarative XML-like syntax that works within Javascript. Here's an example, [vetted by the React community](https://github.com/vuejs/vuejs.org/issues/364#issuecomment-244582684):

В React, все компоненты описывают свой UI посредством render-функций, используя JSX — декларативные XML-подобный синтаксис, работающий внутри JavaScript. Вот пример, [проверенный сообществом React](https://github.com/vuejs/vuejs.org/issues/364#issuecomment-244582684):

``` jsx
render () {
  let { items } = this.props

  let children
  if (items.length > 0) {
    children = (
      <ul>
        {items.map(item =>
          <li key={item.id}>{item.name}</li>
        )}
      </ul>
    )
  } else {
    children = <p>No items found.</p>
  }

  return (
    <div className='list-container'>
      {children}
    </div>
  )
}
```

Render-функции, использующие JSX, имеют определённые преимущества:

- Возможность использовать все алгоритмические возможности JavaScript при создании представления
- Поддержка инструментария (линтинг, проверки типов, автодополнение в редакторах) для JSX зачастую более развито, чем то, что доступно сейчас для шаблонов Vue.

Во Vue, у нас тоже есть [Render-Функции](render-function.html), и даже [поддежка JSX](render-function.html#JSX), так как иногда эти возможности нужны. Однако, для большей части компонентов render-функции использовать не рекомендуется.

В качестве более простой альтернативы мы предлагаем использовать шаблоны:

``` html
<template>
  <div class="list-container">
    <ul v-if="items.length">
      <li v-for="item in items">
        {{ item.name }}
      </li>
    </ul>
    <p v-else>Ничего не найдено.</p>
  </div>
</template>
```

Вот некоторые преимущества этого подхода:

- При написании шаблона требуется принимать значительно меньшее количество решений по части деталей и стиля имплементации
- Шаблон всегда остаётся декларативным
- Любой валидный HTML — это автоматичеки валидный шаблон
- Читать шаблоны проще, они больше похожи на обыкновенный английский (напр. for each item in items)
- Для улучшения читабельности кода не требуется использования продвинутых версий JavaScript

Проще становится не только пишущим шаблон разработчикам, но и дизайнерам и менее опытным программистам, читающим и правящим его.

Но это ещё не всё. Используя HTML вместо попытки его изобретения заново, Vue позволяет использовать в шаблонах препроцессоры, такие как Pug (ранее известный как Jade).

В экосистеме React существует [проект](https://wix.github.io/react-templates/), позволяющий использовать шаблоны, но с некоторыми неудобствами:

- Возможностей значительно меньше, чем в шаблонах Vue
- Требуется отделение HTML от файлов компонентов
- Из-за того, что этот проект является сторонним, а не официально поддерживаемым, неизвестно, будет ли он сопровождаться и поддерживаться в актуальном состоянии при дальнейшем развитии ядра React в будущем

#### Модульный (Компонентный) CSS

Если только вы не разделяете компоненты на несколько файлов (например, используя [CSS-модули](https://github.com/gajus/react-css-modules)), ограничение области видимости CSS в React идёт в комплекте с некоторыми неприятностями. Самый базовый CSS прекрасно работает "из коробки", чего не скажешь о более сложных вещах, вроде hover-эффектов, media queries и псевдоселекторов: все они либо тащат за собой зависимости, переизобретающие уже существующие возможности CSS - либо и вовсе не работают.

Vue же позволяет напрямую использовать CSS в [однофайловых компонентах](single-file-components.html):

``` html
<style scoped>
  @media (min-width: 250px) {
    .list-container:hover {
      background: orange;
    }
  }
</style>
```

Опциональный аттрибут `scoped` автоматически ограничивает область видимости CSS текущим компонентом, добавляя элементам уникальные аттрибуты (такие как `data-v-1`), и компилируя `.list-container:hover` во что-нибудь вроде `.list-container[data-v-1]:hover`.

Наконец, как и с HTML, у вас есть возможность использования любых препроцессоров (или постпроцессоров) на ваш вкус. Это позволяет применять централизованные операции, такие как например управление цветами, на этапе сборки, не импортируя специализированных JavaScript-библиотек, увеличивающих как размер результирующей сборки, так и сложность вашего приложения.

### Масштабирование

#### Масштабирование Вверх

Для крупных приложений, как Vue так и React предоставляют надёжные решения для роутинга. Сообщество React также породило весьма инновационные решения в области управления состоянием приложения (т.е. Flux/Redux). Эти подходы, и [даже сам Redux](https://github.com/egoist/revue) легко интегрируются в приложения на Vue. В действительности, Vue идёт на шаг дальше с [Vuex](https://github.com/vuejs/vuex) — вдохновлённым Elm решением для управления состоянием приложения, глубоко интегрирующимся с Vue, что, на наш взгляд, изрядно облегчает жизнь разработчикам.

В качестве ещё одно важного различия между React и Vue можно упомянуть тот факт, что все дополнительные библиотеки Vue для управления состоянием и роутинга (среди [прочих задач](https://github.com/vuejs)) официально поддерживаются и поддерживаются в актуальном соответствии с ядром библиотеки. React, напротив, предпочитает оставить эти вопросы на откуп сообществу, тем самым создавая более фрагментированную экосистему. Впрочем, в силу популярности, экосистема React значительно обширнее, чем у Vue.

Наконец, Vue предоставляет [инструменты командной строки для генерации проектов](https://github.com/vuejs/vue-cli), до смешного упрощающие создание новых проектов с использованием подходящей системы сборки, включая [Webpack](https://github.com/vuejs-templates/webpack), [Browserify](https://github.com/vuejs-templates/browserify), или даже [вовсе без таковой](https://github.com/vuejs-templates/simple). В сообществе React также существуют наработки в этом направлении — например, [create-react-app](https://github.com/facebookincubator/create-react-app), но на данный момент функционал этого решения имеет ряд ограничений:

- Нет возможности конфигурации проекта в процессе генерации. Vue позволяте Yeoman-подобную настройку шаблонов.
- Существует единственный шаблон для одностраничного приложения, в то время как Vue позволяет выбрать подходящий шаблон из довольно широкого их многообразия.
- Нет возможности создавать проекты из пользовательских шаблонов, что может быть особенно полезно для enterprise-окружений с установившимися ранее соглашениями.

Важно заметить, что многие из этих ограничений — следствия сознательно принятых командой create-react-app решений, и в них есть и свои плюсы. Например, коль скоро ваш проект не требует многого, и не имеет необходимости пользовательской настройки процесса сборки, оную можно будет обновлять как зависимость. Прочитать больше [об этом подходе можно здесь](https://github.com/facebookincubator/create-react-app#philosophy).

#### Масштабирование Вниз

React известен своей крутой кривой изучения. До того момента, когда новичок сможет что-то написать, ему придётся узнать о JSX, а вероятно — и о ES2015+, поскольку многие примеры используют синтаксис классов. Кроме того придётся разобраться с системами сборки, поскольку хотя технически и существует возможность использовать Babel самостоятельно для live-компиляции кода, для production это в любом случае не рекомендуется.

Vue масштабируется вверх ничуть не хуже (если не лучше), чем React, и в то же время его можно масштабировать вниз вплоть до варианта использования вместе с jQuery. Именно так — в простейшем случае достаточно добавить тег скрипта на HMTL-страницу.

``` html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
```

Начиная с этого момента можно писать код на Vue, и даже собрать production-версию, не мучаясь угрызениями совести и волнениями насчёт производительности.

Поскольку знания JSX, ES2015 и систем сборки не требуется для начала работы со Vue, в среднем у новых разработчиков уходит не больше дня на чтение [руководства](/guide), позволяющего узнать достаточно для построения нетривиальных приложений.

### Нативный Рендеринг

ReactNative enables you to write native-rendered apps for iOS and Android using the same React component model. This is great in that as a developer, you can apply your knowledge of a framework across multiple platforms. On this front, Vue has an official collaboration with [Weex](https://alibaba.github.io/weex/), a cross-platform UI framework developed by Alibaba Group, which uses Vue as its JavaScript framework runtime. This means with Weex, you can use the same Vue component syntax to author components that can not only be rendered in the Browser, but also natively on iOS and Android!

At this moment, Weex is still in active development and is not as mature and battle-tested as ReactNative, but its development is driven by the production needs of the largest e-commerce business in the world, and the Vue team will also actively collaborate with the Weex team to ensure a smooth experience for Vue developers.

### With MobX

MobX has become quite popular in the React community and it actually uses a nearly identical reactivity system to Vue. To a limited extent, the React + MobX workflow can be thought of as a more verbose Vue, so if you're using that combination and are enjoying it, jumping into Vue is probably the next logical step.

## Angular 1

Some of Vue's syntax will look very similar to Angular (e.g. `v-if` vs `ng-if`). This is because there were a lot of things that Angular got right and these were an inspiration for Vue very early in its development. There are also many pains that come with Angular however, where Vue has attempted to offer a significant improvement.

### Complexity

Vue is much simpler than Angular 1, both in terms of API and design. Learning enough to build non-trivial applications typically takes less than a day, which is not true for Angular 1.

### Flexibility and Modularity

Angular 1 has strong opinions about how your applications should be structured, while Vue is a more flexible, modular solution. While this makes Vue more adaptable to a wide variety of projects, we also recognize that sometimes it's useful to have some decisions made for you, so that you can just get started coding.

That's why we offer a [Webpack template](https://github.com/vuejs-templates/webpack) that can set you up within minutes, while also granting you access to advanced features such as hot module reloading, linting, CSS extraction, and much more.

### Data binding

Angular 1 uses two-way binding between scopes, while Vue enforces a one-way data flow between components. This makes the flow of data easier to reason about in non-trivial applications.

### Directives vs Components

Vue has a clearer separation between directives and components. Directives are meant to encapsulate DOM manipulations only, while components are self-contained units that have their own view and data logic. In Angular, there's a lot of confusion between the two.

### Performance

Vue has better performance and is much, much easier to optimize because it doesn't use dirty checking. Angular 1 becomes slow when there are a lot of watchers, because every time anything in the scope changes, all these watchers need to be re-evaluated again. Also, the digest cycle may have to run multiple times to "stabilize" if some watcher triggers another update. Angular users often have to resort to esoteric techniques to get around the digest cycle, and in some situations, there's simply no way to optimize a scope with many watchers.

Vue doesn't suffer from this at all because it uses a transparent dependency-tracking observation system with async queueing - all changes trigger independently unless they have explicit dependency relationships.

Interestingly, there are quite a few similarities in how Angular 2 and Vue are addressing these Angular 1 issues.

## Angular 2

We have a separate section for Angular 2 because it really is a completely new framework. For example, it features a first-class component system, many implementation details have been completely rewritten, and the API has also changed quite drastically.

### TypeScript

While Angular 1 could be used for smaller applications, Angular 2 has shifted focus to best facilitate large enterprise applications. As part of this, it almost requires TypeScript, which can be very useful for developers that desire the type safety of languages such as Java and C#.

Vue is also well-suited to [enterprise environments](https://github.com/vuejs/awesome-vue#enterprise-usage) and can even be used with TypeScript via our [official typings](https://github.com/vuejs/vue/tree/dev/types) and [user-contributed decorators](https://github.com/itsFrank/vue-typescript), though it's definitely optional in our case.

### Size and Performance

In terms of performance, both frameworks are exceptionally fast and there isn't enough data from real world use cases to make a verdict. However if you are determined to see some numbers, Vue 2.0 seems to be ahead of Angular 2 according to this [3rd party benchmark](http://stefankrause.net/js-frameworks-benchmark4/webdriver-ts/table.html).

Size wise, although Angular 2 with offline compilation and tree-shaking is able to get its size down considerably, a full-featured Vue 2.0 with compiler included (23kb) is still lighter than a tree-shaken bare-bone example of Angular 2 (50kb). And do note the Angular 2 app's size is small due to tree-shaking, which removes code for features that you are not using. It will eventually grow back to its actual size as you import and use more features from the framework.

### Flexibility

Vue is much less opinionated than Angular 2, offering official support for a variety of build systems, with no restrictions on how you structure your application. Many developers enjoy this freedom, while some prefer having only one Right Way to build any application.

### Learning Curve

To get started with Vue, all you need is familiarity with HTML and ES5 JavaScript (i.e. plain JavaScript). With these basic skills, you can start building non-trivial applications within less than a day of reading [the guide](/guide).

Angular 2's learning curve is much steeper. Even without TypeScript, their [Quickstart guide](https://angular.io/docs/js/latest/quickstart.html) starts out with an app that uses ES2015 JavaScript, NPM with 18 dependencies, 4 files, and over 3,000 words to explain it all - just to say Hello World. It's an understatement to say that [Vue's Hello World](index.html#Hello-World) is considerably simpler. It's so trivial in fact, that we don't even dedicate a whole page in the guide to it.

## Ember

Ember is a full-featured framework that is designed to be highly opinionated. It provides a lot of established conventions and once you are familiar enough with them, it can make you very productive. However, it also means the learning curve is high and flexibility suffers. It's a trade-off when you try to pick between an opinionated framework and a library with a loosely coupled set of tools that work together. The latter gives you more freedom but also requires you to make more architectural decisions.

That said, it would probably make a better comparison between Vue core and Ember's [templating](https://guides.emberjs.com/v2.7.0/templates/handlebars-basics/) and [object model](https://guides.emberjs.com/v2.7.0/object-model/) layers:

- Vue provides unobtrusive reactivity on plain JavaScript objects and fully automatic computed properties. In Ember, you need to wrap everything in Ember Objects and manually declare dependencies for computed properties.

- Vue's template syntax harnesses the full power of JavaScript expressions, while Handlebars' expression and helper syntax is intentionally quite limited in comparison.

- Performance-wise, Vue outperforms Ember by a fair margin, even after the latest Glimmer engine update in Ember 2.0. Vue automatically batches updates, while in Ember you need to manually manage run loops in performance-critical situations.

## Knockout

Knockout was a pioneer in the MVVM and dependency tracking spaces and its reactivity system is very similar to Vue's. Its [browser support](http://knockoutjs.com/documentation/browser-support.html) is also very impressive considering everything it does, with support back to IE6! Vue on the other hand only supports IE9+.

Over time though, Knockout development has slowed and it's begun to show its age a little. For example, its component system lacks a full set of lifecycle hooks and although it's a very common use case, the interface for passing children to a component feels a little clunky compared to [Vue's](components.html#Content-Distribution-with-Slots).

There also seem to be philosophical differences in the API design which if you're curious, can be demonstrated by how each handles the creation of a [simple todo list](https://gist.github.com/chrisvfritz/9e5f2d6826af00fcbace7be8f6dccb89). It's definitely somewhat subjective, but many consider Vue's API to be less complex and better structured.

## Polymer

Polymer is yet another Google-sponsored project and in fact was a source of inspiration for Vue as well. Vue's components can be loosely compared to Polymer's custom elements and both provide a very similar development style. The biggest difference is that Polymer is built upon the latest Web Components features and requires non-trivial polyfills to work (with degraded performance) in browsers that don't support those features natively. In contrast, Vue works without any dependencies or polyfills down to IE9.

In Polymer 1.0, the team has also made its data-binding system very limited in order to compensate for the performance. For example, the only expressions supported in Polymer templates are boolean negation and single method calls. Its computed property implementation is also not very flexible.

Polymer custom elements are authored in HTML files, which limits you to plain JavaScript/CSS (and language features supported by today's browsers). In comparison, Vue's single file components allows you to easily use ES2015+ and any CSS preprocessors you want.

When deploying to production, Polymer recommends loading everything on-the-fly with HTML Imports, which assumes browsers implementing the spec, and HTTP/2 support on both server and client. This may or may not be feasible depending on your target audience and deployment environment. In cases where this is not desirable, you will have to use a special tool called Vulcanizer to bundle your Polymer elements. On this front, Vue can combine its async component feature with Webpack's code-splitting feature to easily split out parts of the application bundle to be lazy-loaded. This ensures compatibility with older browsers while retaining great app loading performance.

It is also totally feasible to offer deeper integration between Vue with Web Component specs such as Custom Elements and Shadow DOM style encapsulation - however at this moment we are still waiting for the specs to mature and be widely implemented in all mainstream browsers before making any serious commitments.

## Riot

Riot 2.0 provides a similar component-based development model (which is called a "tag" in Riot), with a minimal and beautifully designed API. Riot and Vue probably share a lot in design philosophies. However, despite being a bit heavier than Riot, Vue does offer some significant advantages:

- True conditional rendering. Riot renders all if branches and simply shows/hides them.
- A far more powerful router. Riot’s routing API is extremely minimal.
- More mature tooling support. Vue provides official support for [Webpack](https://github.com/vuejs/vue-loader), [Browserify](https://github.com/vuejs/vueify), and [SystemJS](https://github.com/vuejs/systemjs-plugin-vue), while Riot relies on community support for build system integration.
- [Transition effect system](transitions.html). Riot has none.
- Better performance. [Despite advertising](https://github.com/vuejs/vuejs.org/issues/346) use of a virtual DOM, Riot in fact uses dirty checking and thus suffers from the same performance issues as Angular 1.
