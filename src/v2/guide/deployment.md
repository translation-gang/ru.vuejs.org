---
title: Советы по развёртыванию
type: guide
order: 20
---

## Включение режима production

В&nbsp;процессе разработки Vue предусматривает множество полезных предупреждений, чтобы помочь разобраться с&nbsp;типичными ошибками и&nbsp;подводными камнями. Однако в&nbsp;production эти предупреждения бессмысленны и&nbsp;лишь увеличивают размер вашего приложения. К&nbsp;тому&nbsp;же, часть проверок для этих предупреждений добавит небольшие затраты к&nbsp;времени выполнения и&nbsp;поэтому должны быть исключены в&nbsp;режиме production.

### Без использования систем сборки

Если вы&nbsp;используете standalone-сборку, т.е. напрямую подключаете Vue через тег `<script>` без использования каких-либо систем сборки, удостоверьтесь что используете минифицированную версию (`vue.min.js`) для production.

### С использованием систем сборки

При использовании систем сборки, таких как Webpack или Browserify, режим production определяется по&nbsp;значению `process.env.NODE_ENV` внутри исходного кода Vue. По&nbsp;умолчанию используется режим для разработки. Обе системы сборки предоставляют возможности для переопределения этой переменной&nbsp;&mdash; для включения режима production в&nbsp;Vue и&nbsp;удаления всех проверок и&nbsp;предупреждений на&nbsp;этапе сборки. Все шаблоны `vue-cli` уже настроены для вас, но&nbsp;было&nbsp;бы полезно знать, как это делается:

#### Webpack

Используйте плагин Webpack [DefinePlugin](http://webpack.github.io/docs/list-of-plugins.html#defineplugin) для установки переменных окружения. Это позволит UglifyJS на&nbsp;этапе сборки удалить все предупреждения. Пример конфигурации:

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

- Запустите сборку, указав в&nbsp;команде переменную `NODE_ENV` с&nbsp;значением `"production"`. Это позволит `vueify` исключить код для горячей замены модулей, а&nbsp;также код относящийся к&nbsp;разработке.

- Примените глобальную трансформацию [envify](https://github.com/hughsk/envify) к&nbsp;вашей сборке. Это позволит минификатору удалить все предупреждения из&nbsp;исходного кода Vue, обёрнутые в&nbsp;условия проверки переменной окружения. Например:

  ``` bash
  NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
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

## Пре-компиляция шаблонов

При использовании DOM в&nbsp;качестве шаблона или строковых шаблонов в&nbsp;JavaScript, компиляция в&nbsp;`render`-функцию будет выполняться на&nbsp;лету. Это достаточно быстро для большинства случаев, но&nbsp;если ваше приложение нуждается в&nbsp;максимальной производительности стоит этого избегать.

Самый простой способ предварительной компиляции шаблонов&nbsp;&mdash; использовать [однофайловые компоненты](./single-file-components.html). На&nbsp;этапе сборки проекта будет выполнена предварительная компиляция, поэтому результирующий код будет содержать только render-функции вместо сырых строковых шаблонов.

Если вы&nbsp;используете Webpack и&nbsp;предпочитаете разделять JavaScript и&nbsp;файлы шаблонов, вы&nbsp;можете воспользоваться [vue-template-loader](https://github.com/ktsn/vue-template-loader), который также преобразует файлы шаблонов в&nbsp;render-функции на&nbsp;JavaScript на&nbsp;этапе сборки.

## Извлечение CSS из компонентов

При использовании однофайловых компонентов, CSS из&nbsp;компонента будет динамически добавлен как тег `<style>` через JavaScript. Это немного увеличивает затраты времени выполнения, поэтому при использовании рендеринга на&nbsp;стороне сервера может привести к&nbsp;&laquo;мельканию неоформленного содержимого&raquo; (англ. flash of&nbsp;unstyled content&nbsp;&mdash; FOUC). Извлечение CSS из&nbsp;всех компонентов в&nbsp;один файл позволит избежать этой проблемы, а&nbsp;также добиться лучших результатов в&nbsp;минификации и&nbsp;кешировании CSS.

Обратитесь к&nbsp;документации соответствующих инструментов для сборки, чтобы узнать как это реализовать:

- [Webpack + vue-loader](http://vue-loader.vuejs.org/en/configurations/extract-css.html) (в&nbsp;`vue-cli` с&nbsp;шаблоном webpack это уже настроено)
- [Browserify + vueify](https://github.com/vuejs/vueify#css-extraction)
- [Rollup + rollup-plugin-vue](https://github.com/znck/rollup-plugin-vue#options)

## Отслеживание ошибок времени выполнения

Если при рендеринге компонента произойдёт ошибка, она будет передана в&nbsp;глобальную функцию `Vue.config.errorHandler`, если таковая была указана. Использование этого хука в&nbsp;связке с&nbsp;сервисом отслеживания ошибок, например&nbsp;с [Sentry](https://sentry.io), может быть неплохой идеей&nbsp;&mdash; тем более, что [интеграция с&nbsp;Vue официально поддерживается](https://sentry.io/for/vue/).
