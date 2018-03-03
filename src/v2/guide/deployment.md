---
title: Развёртывание на production
type: guide
order: 401
---

## Включение режима production

В процессе разработки Vue предусматривает множество полезных предупреждений, чтобы помочь разобраться с типичными ошибками и подводными камнями. Однако в production эти предупреждения бессмысленны и лишь увеличивают размер вашего приложения. К тому же, часть проверок для этих предупреждений добавит небольшие затраты к времени выполнения и поэтому должны быть исключены в режиме production.

### Без использования систем сборки

Если вы используете полную сборку, т.е. напрямую подключаете Vue через тег `<script>` без использования каких-либо систем сборки, удостоверьтесь что используете минифицированную версию (`vue.min.js`) для production. Обе версии можно найти [на странице установки](installation.html#Подключение-через-lt-script-gt).

### С использованием систем сборки

При использовании систем сборки, таких как Webpack или Browserify, режим production определяется по значению `process.env.NODE_ENV` внутри исходного кода Vue. По умолчанию используется режим для разработки. Обе системы сборки предоставляют возможности для переопределения этой переменной — для включения режима production во Vue и удаления всех проверок и предупреждений на этапе сборки. Все шаблоны `vue-cli` уже настроены для вас, но было бы полезно знать, как это делается:

#### Webpack

Используйте плагин Webpack [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) для установки переменных окружения. Это позволит UglifyJS на этапе сборки удалить все предупреждения. Пример конфигурации:

``` js
var webpack = require('webpack')

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ]
}
```

#### Browserify

- Запустите сборку, указав в команде переменную `NODE_ENV` со значением `"production"`. Это позволит `vueify` исключить код для горячей замены модулей, а также код, относящийся к разработке.

- Примените глобальное преобразование [envify](https://github.com/hughsk/envify) к вашей сборке. Это позволит минификатору удалить все предупреждения из исходного кода Vue, обёрнутые в условия проверки переменной окружения. Например:

  ``` bash
  NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
  ```

- Или используйте [envify](https://github.com/hughsk/envify) вместе с Gulp:

  ``` js
  // Используйте пользовательский модуль envify для указания переменных окружения
  var envify = require('envify/custom')

  browserify(browserifyOptions)
    .transform(vueify)
    .transform(
      // Порядок необходим для обработки файлов node_modules
      { global: true },
      envify({ NODE_ENV: 'production' })
    )
    .bundle()
  ```

- Или используя [envify](https://github.com/hughsk/envify) вместе с Grunt и [grunt-browserify](https://github.com/jmreidy/grunt-browserify):

  ``` js
  // Используйте пользовательский модуль envify для указания переменных окружения
  var envify = require('envify/custom')

  browserify: {
    dist: {
      options: {
        // Функция для изменения порядка по умолчанию у grunt-browserify
        configure: b => b
          .transform('vueify')
          .transform(
            // Порядок необходим для обработки файлов node_modules
            { global: true },
            envify({ NODE_ENV: 'production' })
          )
          .bundle()
      }
    }
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
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    })
  ]
}).then(...)
```

## Прекомпиляция шаблонов

При использовании DOM в качестве шаблона или строковых шаблонов в JavaScript, компиляция в `render`-функцию будет выполняться на лету. Это достаточно быстро для большинства случаев, но если ваше приложение нуждается в максимальной производительности стоит этого избегать.

Самый простой способ предварительной компиляции шаблонов — использовать [однофайловые компоненты](single-file-components.html). На этапе сборки проекта будет выполнена предварительная компиляция, поэтому результирующий код будет содержать только `render`-функции вместо необработанных строковых шаблонов.

Если вы используете Webpack и предпочитаете разделять JavaScript и файлы шаблонов, вы можете воспользоваться [vue-template-loader](https://github.com/ktsn/vue-template-loader), который также преобразует файлы шаблонов в `render`-функции на JavaScript на этапе сборки.

## Извлечение CSS из компонентов

При использовании однофайловых компонентов, CSS из компонента будет динамически добавлен как тег `<style>` через JavaScript. Это немного увеличивает затраты времени выполнения, поэтому при использовании рендеринга на стороне сервера может привести к "мельканию неоформленного содержимого" (flash of unstyled content — FOUC). Извлечение CSS из всех компонентов в один файл позволит избежать этой проблемы, а также добиться лучших результатов в минификации и кешировании CSS.

Обратитесь к документации соответствующих инструментов для сборки, чтобы узнать как это реализовать:

- [Webpack + vue-loader](https://vue-loader.vuejs.org/ru/configurations/extract-css.html) (в `vue-cli` с шаблоном webpack это уже настроено)
- [Browserify + vueify](https://github.com/vuejs/vueify#css-extraction)
- [Rollup + rollup-plugin-vue](https://vuejs.github.io/rollup-plugin-vue/#/en/2.3/?id=custom-handler)

## Отслеживание ошибок времени выполнения

Если при рендеринге компонента произойдёт ошибка, она будет передана в глобальную функцию `Vue.config.errorHandler`, если таковая была указана. Использование этого хука в связке с сервисом отслеживания ошибок, например с [Sentry](https://sentry.io), может быть неплохой идеей — тем более, что [интеграция с Vue официально поддерживается](https://sentry.io/for/vue/).
