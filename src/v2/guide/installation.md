---
title: Установка
type: guide
order: 1
vue_version: 2.5.22
gz_size: "30.93"
---

### Предупреждение о совместимости

Vue **не поддерживает** IE8 и ниже, так как использует возможности ECMAScript 5, которые невозможно эмулировать в IE8. В остальном, поддерживаются все браузеры, [совместимые с ECMAScript 5](https://caniuse.com/#feat=es5).

### Информация о релизах

Версия последнего релиза: {{vue_version}}

Подробная информация об изменениях в каждой версии доступна на [GitHub](https://github.com/vuejs/vue/releases).

## Инструменты разработчика и Vue

При использовании Vue мы рекомендуем установить [Vue Devtools](https://github.com/vuejs/vue-devtools#vue-devtools) в браузере, для большего удобства выполнения проверок и отладки ваших приложений Vue.

## Подключение через `<script>`

Просто скачайте JS-файл и подключите его тегом `<script>` на странице. Будет зарегистрирована глобальная переменная `Vue`.

<p class="tip">Не используйте минифицированную версию во время разработки, иначе вы не будете получать предупреждения о типичных ошибках!</p>

<div id="downloads">
  <a class="button" href="/js/vue.js" download>Версия для разработки</a><span class="light info">С  предупреждениями для удобства разработки и отладки</span>

  <a class="button" href="/js/vue.min.js" download>Версия для production</a><span class="light info">Без предупреждений, {{gz_size}}КБ min+gzip</span>
</div>

### CDN

Для создания прототипов или в целях обучения можно использовать последнюю версию:

``` html
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

Для production, мы рекомендуем указывать конкретную версию и сборку, чтобы избежать неожиданных поломок при выходе новых версий:

``` html
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.0/dist/vue.js"></script>
```

Если используете нативные ES-модули, также существует и совместимая с ES-модулями сборка:

``` html
<script type="module">
  import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.0/dist/vue.esm.browser.js'
</script>
```

Исходный код самого NPM-пакета также доступен по ссылке [cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue/).

Vue также доступен на [unpkg](https://unpkg.com/vue@{{vue_version}}/dist/vue.js) и [cdnjs](https://cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js) (cdnjs синхронизируется с NPM с некоторой задержкой, из-за чего последняя версия может быть не всегда доступна сразу).

Обязательно прочитайте про [отличия в сборках Vue](#Объяснение-различных-сборок) и используйте **версию для production** на своём опубликованном сайте, заменив `vue.js` на `vue.min.js`. Это сборка оптимизирована для скорости, а не для удобства разработки.

## NPM

Рекомендуем использовать NPM при создании крупных приложений на Vue. Этот вариант прекрасно работает в паре с инструментами сборки, такими как [Webpack](https://webpack.js.org/) и [Browserify](http://browserify.org/). Во Vue также есть совместимые с ними инструменты для использования [однофайловых компонентов](single-file-components.html).

``` bash
# последняя стабильная версия
$ npm install vue
```

## Инструменты командной строки (CLI)

Vue.js предоставляет [официальный инструментарий для командной строки (CLI)](https://github.com/vuejs/vue-cli) для быстрого создания каркаса амбициозных одностраничных приложений. Предлагаемые шаблоны содержат всё необходимое для организации современной фронтенд-разработки. Всего за несколько минут вы получите работающую конфигурацию с горячей перезагрузкой модулей, линтингом кода при сохранении и настроенной конфигурацией production-сборки. Подробнее вы можете изучить в [документации Vue CLI](https://cli.vuejs.org/ru/).

<p class="tip">CLI — это инструмент для тех, кто знаком с Node.js и соответствующими инструментами сборки. Если вы новичок во Vue или инструментах сборки фронтенда, рекомендуем сначала прочитать <a href="./">руководство</a>, не требующее использования инструментов сборки, а уже потом разбираться с CLI.</p>

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/real-world-vue-js/vue-cli" target="_blank" rel="noopener" title="Vue CLI">Посмотрите объясняющее видео на Vue Mastery</a></div>

## Объяснение различных сборок

В [папке `dist/` NPM-пакета](https://cdn.jsdelivr.net/npm/vue/dist/) можно найти много разных сборок Vue.js. Вот краткий обзор отличий между ними:

|                               | UMD                | CommonJS              | ES Module (для сборщиков) | ES Module (для браузеров) |
| ---                           | ---                | ---                   | ---                       | ---                       |
| **Полная**                    | vue.js             | vue.common.js         | vue.esm.js                | vue.esm.browser.js        |
| **Runtime-only**              | vue.runtime.js     | vue.runtime.common.js | vue.runtime.esm.js        | -                         |
| **Полная (production)**       | vue.min.js         | -                     | -                         | vue.esm.browser.min.js    |
| **Runtime-only (production)** | vue.runtime.min.js | -                     | -                         | -                         |

### Термины

- **Полная**: сборка, которая содержит runtime и компилятор шаблонов.

- **Компилятор**: код, который отвечает за компиляцию строковых шаблонов в `render`-функции JavaScript.

- **Runtime**: код, который отвечает за создание экземпляров Vue, отрисовку и изменение виртуального DOM и т.д. По сути, это всё, кроме компилятора.

- **[UMD](https://github.com/umdjs/umd)**: сборки UMD можно использовать сразу в браузере, подключая тегом `<script>`. По умолчанию в jsDelivr CDN из [https://cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue) будет UMD-сборка Runtime + Компилятор (`vue.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: сборки CommonJS предназначены для использования вместе со старыми инструментами сборки, такими как [Browserify](http://browserify.org/) или [Webpack 1](https://webpack.github.io). По умолчанию для них (`pkg.main`) будет сборка Runtime-only CommonJS (`vue.runtime.common.js`).

- **[ES модули](http://exploringjs.com/es6/ch_modules.html)**: начиная с версии 2.6, Vue предоставляет две сборки ES-модулей (ESM):

  - ESM для сборщиков: предназначена для использования с современными системами сборки, такими как [webpack 2](https://webpack.js.org) или [Rollup](https://rollupjs.org/). Формат ESM разработан для статического анализа, поэтому сборщики могут воспользоваться преимуществами «tree-shaking» и удалить неиспользуемый код из финальной сборки. Файл по умолчанию для этих сборщиков (`pkg.module`) — это Runtime-only сборка для ES-модулей (`vue.runtime.esm.js`).

  - ESM для браузеров (только 2.6.0+): предназначена для импорта в современных браузерах через `<script type="module">`.

### Runtime + Компилятор vs. Runtime-only

Если нужно компилировать шаблоны на клиенте (например, передаёте строку в опцию `template` или монтируете к элементу DOM, используя его HTML в качестве шаблона), вам потребуется компилятор, а значит, полная сборка:

``` js
// это требует компилятора шаблонов
new Vue({
  template: '<div>{{ hi }}</div>'
})

// это нет
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```

При использовании `vue-loader` или `vueify` шаблоны внутри `*.vue` файлов будут скомпилированы в JavaScript ещё на этапе сборки. Поэтому компилятор в итоговой сборке не потребуется и можно использовать сборки runtime-only.

Так как сборки runtime-only примерно на 30% легче, в сравнении с полными, вы должны использовать их всякий раз, когда это возможно. Если вы всё равно хотите использовать полную сборку, вам потребуется настроить псевдоним в сборщике:

#### Webpack

``` js
module.exports = {
  // ...
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' для webpack 1
    }
  }
}
```

#### Rollup

``` js
const alias = require('rollup-plugin-alias')

rollup({
  // ...
  plugins: [
    alias({
      'vue': require.resolve('vue/dist/vue.esm.js')
    })
  ]
})
```

#### Browserify

Добавьте в `package.json` вашего проекта:

``` js
{
  // ...
  "browser": {
    "vue": "vue/dist/vue.common.js"
  }
}
```

#### Parcel

Добавьте в `package.json` вашего проекта:

``` js
{
  // ...
  "alias": {
    "vue" : "./node_modules/vue/dist/vue.common.js"
  }
}
```

### Режим разработки vs. режим production

Режим разработки/production жёстко установлен в UMD-сборках: несжатые файлы для разработки и минифицированные файлы для production.

Сборки CommonJS и ES Module предназначены для инструментов сборки, поэтому мы не предоставляем минифицированных версий для них. Вы ответственны за минификацию итоговой сборки.

Сборки CommonJS и ES Module содержат проверки на `process.env.NODE_ENV` для определения режима, в котором они должны выполняться. Вы должны использовать соответствующие возможности систем сборки для переопределения этих переменных окружения, чтобы контролировать режим, в котором Vue будет запускаться. Замена `process.env.NODE_ENV` на строковый литерал позволяет минификаторам, таким как UglifyJS, удалять целые блоки кода, предназначенные только для разработки, уменьшая итоговый размер файла.

#### Webpack

С версии Webpack 4+ можно использовать опцию `mode`:

``` js
module.exports = {
  mode: 'production'
}
```

Но в Webpack 3 и более ранних версиях необходимо использовать [DefinePlugin](https://webpack.js.org/plugins/define-plugin/):

``` js
var webpack = require('webpack')

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
}
```

#### Rollup

Используйте [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace):

``` js
const replace = require('rollup-plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}).then(...)
```

#### Browserify

Примените глобальную трансформацию [envify](https://github.com/hughsk/envify) для вашей сборки.

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

Подробнее в разделе [развёртывания на production](deployment.html).

### CSP-окружения

Некоторые окружения, такие как Google Chrome Apps, требуют соблюдения Content Security Policy (CSP), запрещающей использование конструкции `new Function()` для исполнения выражений. Полная сборка использует подобные конструкции для компиляции шаблонов, и потому непригодна к использованию в таких окружениях.

С другой стороны, runtime-сборки полностью совместимы с CSP. Если использовать их с [Webpack и vue-loader](https://github.com/vuejs-templates/webpack-simple) или [Browserify и vueify](https://github.com/vuejs-templates/browserify-simple), то шаблоны компилируются на этапе сборки в `render`-функции, которые отлично работают в CSP-окружениях.

## Сборка dev-версии

**Важное замечание**: файлы сборки в `/dist` на GitHub обновляются только при релизах. Чтобы использовать версию из последних исходников с GitHub, соберите проект самостоятельно:

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

Только UMD-сборки доступны в Bower.

``` bash
# последняя стабильная версия
$ bower install vue
```

## Загрузчики модулей AMD

Все UMD-сборки могут быть напрямую использованы как AMD-модули.
