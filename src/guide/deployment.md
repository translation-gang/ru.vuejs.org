---
title: Развёртывание для Production
type: guide
order: 20
---

## Отключение Предупреждений

Минифицированная автономная сборка Vue уже не содержит кода предупреждений. Если же вы используете инструменты вроде Webpack или Browserify, для достижения этого эффекта понадобится немного дополнительного конфигурирования.

### Webpack

Используйте плагин [DefinePlugin](http://webpack.github.io/docs/list-of-plugins.html#defineplugin) чтобы указать production-окружение, и позволить UglifyJS автоматически удалить предупреждения при минификации. Пример конфига:

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
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
```

### Browserify

- Запустите сборку, указав для переменной окружения `NODE_ENV` значение `"production". Это заставит `vueify` выбросить код, связанный с функционалом hot-reload и остальные development-инструменты.

- Примените глобальную трансформацию [envify](https://github.com/hughsk/envify) для вашей сборки. Это позволит выбросить все предупреждения из исходного кода Vue. Пример:


``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

- Для выноса стилей в отдельный css-файл, используйте плагин extract-css, включённый во vueify.

``` bash
NODE_ENV=production browserify -g envify -p [ vueify/plugins/extract-css -o build.css ] -e main.js | uglifyjs -c -m > build.js
```

## Отслеживание Ошибок Времени Выполнения

Если при рендеринге компонента произойдёт ошибка, она будет передана в глобальную функцию `Vue.config.errorHandler`, если она была установлена. Использование этого хука в связке с сервисом отслеживания ошибок, таким как [Sentry](https://sentry.io), может быть неплохой идеей — тем более, что [интеграцию с Vue официально поддерживается](https://sentry.io/for/vue/).

## Экстракция CSS

При использовании [Однофайловых Компонентов](./single-file-components.html), теги `<style>` во время разработки динамически обновляются на этапе выполнения. Для "боевого" окружения вы можете захотеть поместить все стили в единый CSS-файл. Детальную информацию для достижения этой цели можно получить в документации [vue-loader](http://vue-loader.vuejs.org/en/configurations/extract-css.html) и [vueify](https://github.com/vuejs/vueify#css-extraction).

Официальный шаблон `webpack` для `vue-cli` содержит готовую конфигурацию "из коробки".
