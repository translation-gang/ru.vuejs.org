---
title: Установка
type: guide
order: 1
vue_version: 2.1.8
dev_size: "217.56"
min_size: "70.37"
gz_size: "25.75"
ro_gz_size: "17.87"
---

### Предупреждение о совместимости

Vue **не&nbsp;поддерживает** IE8 и&nbsp;ниже, потому что использует возможности ECMAScript&nbsp;5, которые невозможно эмулировать в&nbsp;IE8. Тем не&nbsp;менее, поддерживаются все [браузеры, совместимые с&nbsp;ECMAScript 5](http://caniuse.com/#feat=es5).

### Замечания о релизах

Детальная информация об&nbsp;изменениях в&nbsp;каждой версии доступна&nbsp;на [GitHub](https://github.com/vuejs/vue/releases).

## Автономная установка

Просто скачайте js-файл и&nbsp;подключите его тегом `<script>`. Будет зарегистрирована глобальная переменная `Vue`.

<p class="tip">Не&nbsp;используйте минифицированную версию во&nbsp;время разработки, иначе вы&nbsp;не&nbsp;будете получать предупреждения о&nbsp;типичных ошибках!</p>

<div id="downloads">
<a class="button" href="/js/vue.js" download>Версия для разработки</a><span class="light info">С  предупреждениями для удобства разработки и&nbsp;отладки</span>

<a class="button" href="/js/vue.min.js" download>Версия для production</a><span class="light info">Без предупреждений, {{gz_size}}&nbsp;Кб&nbsp;min+gzip</span>
</div>

### CDN

Рекомендуем этот вариант: на&nbsp;[unpkg](https://unpkg.com/vue/dist/vue.js) всегда доступна самая свежая версию Vue, загруженная в&nbsp;npm. Исходный код самого npm-пакета также доступен по&nbsp;ссылке [unpkg.com/vue/](https://unpkg.com/vue/).

Vue также доступен&nbsp;на [jsdelivr](//cdn.jsdelivr.net/vue/{{vue_version}}/vue.js) и&nbsp;[cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js), но&nbsp;эти сервисы синхронизируются с&nbsp;NPM с&nbsp;некоторой задержкой, из-за чего новейшая версия может быть не&nbsp;всегда доступна.

## NPM

Рекомендуем использовать NPM при создании крупных приложений на&nbsp;Vue. Этот вариант прекрасно работает в&nbsp;паре с&nbsp;инструментами сборки, такими как [Webpack](http://webpack.github.io/) и&nbsp;[Browserify](http://browserify.org/). Во&nbsp;Vue также есть совместимые с&nbsp;ними инструменты для использования [однофайловых компонентов](single-file-components.html).

``` bash
# последняя стабильная версия
$ npm install vue
```

### Standalone или runtime сборка

Есть два вида сборок:

&mdash;&nbsp;`vue.common.js` &mdash; standalone-сборка&nbsp;&mdash; содержит компилятор шаблонов и&nbsp;поддерживает опцию `template`. **Она опирается на&nbsp;API браузера, и&nbsp;не&nbsp;может быть использована для серверного рендеринга.** Компилятор шаблонов отвечает за&nbsp;компиляцию строковых шаблонов Vue в&nbsp;`render`-функции на&nbsp;чистом JavaScript. Если вы&nbsp;хотите использовать опцию `template`, значит вам нужен компилятор шаблонов. Хранилище Vuex также требует использования standalone-сборки.

&mdash;&nbsp;`vue.js` &mdash; runtime-сборка&nbsp;&mdash; не&nbsp;содержит компилятора шаблонов и&nbsp;не&nbsp;поддерживает опцию `template`. Вы&nbsp;можете использовать только опцию `render`, но&nbsp;она работает лишь с&nbsp;однофайловыми компонентами, потому что в&nbsp;них шаблоны компилируются в&nbsp;`render`-функции на&nbsp;этапе сборки. Runtime-сборка приблизительно на&nbsp;30% легче, чем standalone, и&nbsp;весит всего {{ro_gz_size}}&nbsp;Кб&nbsp;min+gzip.

По&nbsp;умолчанию, NPM-пакет экспортирует **runtime-сборку**. Для использования standalone-сборки необходимо добавить псевдоним в&nbsp;свою конфигурацию Webpack:

``` js
resolve: {
  alias: {
    'vue$': 'vue/dist/vue.common.js'
  }
}
```

При использовании Browserify можно добавить псевдоним в&nbsp;package.json:

``` js
"browser": {
  "vue": "vue/dist/vue.common"
},
```

### CSP-окружения

Некоторые окружения, такие как Google Chrome Apps, требуют соблюдения Content Security Policy (CSP), запрещающей использование конструкции `new Function()` для исполнения выражений. Standalone-сборка использует подобные конструкции для компиляции шаблонов, и&nbsp;потому непригодна к&nbsp;использованию в&nbsp;таких окружениях.

С&nbsp;другой стороны, runtime-сборка полностью совместима с&nbsp;CSP. Если использовать её&nbsp;с&nbsp;[Webpack и&nbsp;vue-loader](https://github.com/vuejs-templates/webpack-simple) или [Browserify и&nbsp;vueify](https://github.com/vuejs-templates/browserify-simple) шаблоны прекомпилируются в&nbsp;`render`-функции, которые отлично работают в&nbsp;CSP-окружениях.

## Инструменты командной строки (CLI)

Vue.js предоставляет [официальный интерпретатор командной строки (CLI)](https://github.com/vuejs/vue-cli) для быстрого создания каркаса амбициозных одностраничных приложений. Предлагаемые шаблоны содержат всё необходимое для организации современной фронтенд-разработки. Всего за&nbsp;несколько минут вы&nbsp;получите работающую конфигурацию с&nbsp;hot-reload, линтингом кода при сохранении и&nbsp;настроенной конфигурацией production-сборки.

<p class="tip">CLI&nbsp;&mdash; это инструмент для тех, кто уже знаком с&nbsp;Node.js и&nbsp;соответствующими инструментами сборки. Если вы&nbsp;новичок во&nbsp;Vue или инструментах сборки фронтенда, рекомендуем сначала прочитать <a href="./">руководство</a>, не&nbsp;требующее использования инструментов сборки, а&nbsp;уже потом разбираться с&nbsp;CLI.</p>

``` bash
# устанавливаем vue-cli
$ npm install --global vue-cli
# создаём новый проект из шаблона "webpack"
$ vue init webpack my-project
# устанавливаем зависимости
$ cd my-project
$ npm install
# и понеслась! ;)
$ npm run dev
```

## Сборка dev-версии

**Важное замечание**: файлы сборки в&nbsp;папке `/dist` на&nbsp;GitHub обновляются только при релизах. Чтобы использовать версию из&nbsp;новейшего исходного кода с&nbsp;GitHub, соберите проект самостоятельно:

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

``` bash
# последняя стабильная версия
$ bower install vue
```

## Загрузчики AMD-модулей

И&nbsp;standalone-сборка, и&nbsp;версии, устанавливаемые через Bower, заворачиваются с&nbsp;помощью UMD, поэтому их&nbsp;можно напрямую использовать как AMD-модули.
