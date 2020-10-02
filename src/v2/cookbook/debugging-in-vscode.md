---
title: Отладка в VS Code
type: cookbook
order: 8
---

Каждое приложение достигает отметки, когда становится необходимо разбираться в ошибках, от больших до малых. В этом рецепте мы исследуем несколько возможностей для пользователей VS Code, кто хочет отлаживать приложения в браузере.

Этот рецепт покажет как отлаживать приложения [Vue CLI](https://github.com/vuejs/vue-cli) в паре с VS Code при их запуске в браузере.

<p class="tip">Примечание: Этот рецепт охватывает Chrome и Firefox. Если знаете как настроить отладку VS Code с другими браузерами, поделитесь своими знаниями (см. в конце страницы).</p>

## Подготовка

Убедитесь что у вас установлен VS Code и выбранный браузер, а также установлена последняя версия соответствующего расширения отладчика:

* [Debugger для Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
* [Debugger для Firefox](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-firefox-debug)

Установите и создайте проект с помощью [vue-cli](https://github.com/vuejs/vue-cli), следуя инструкциям по установке в [руководстве Vue CLI](https://cli.vuejs.org/ru/). Перейдите в каталог новосозданного приложения и откройте VS Code.

### Отображение исходного кода в браузере

Перед тем, как вы сможете отлаживать ваши компоненты Vue из VS Code, вам необходимо обновить сгенерированную конфигурацию Webpack для генерации sourcemaps. Мы делаем это, чтобы отладчик имел возможность сопоставлять код в сжатых файлов со строками в оригинальных. Это гарантирует, что вы можете отлаживать приложения даже после того, как все ваши ресурсы были оптимизированы с помощью Webpack.

Если вы используете Vue CLI 2, установите или обновите свойство `devtool` в файле `config/index.js`:

```js
devtool: 'source-map',
```

Если вы используете Vue CLI 3, установите или обновите свойство `devtool` в файле `vue.config.js`:

```js
module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  }
}
```

### Запуск приложение из VS Code

<p class="tip">Мы предполагаем, что приложение работает на порту `8080`. Если это не так (например, если порт `8080` был уже занят и поэтому Vue CLI автоматически выбирает другой порт), не забудьте изменить соответствующим образом конфигурацию.</p>

Нажмите на значок отладки в панели действий (узкая боковая панель слева) чтобы открыть представление «Отладка», затем нажмите на значок шестерёнки, чтобы настроить файл launch.json, выберите **Chrome/Firefox: Launch** в качестве окружения. Замените содержимое сгенерированного launch.json указанной ниже конфигурацией:

![Добавление конфигурации Chrome](/images/config_add.png)

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "vuejs: chrome",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}/src",
      "breakOnLoad": true,
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    },
    {
      "type": "firefox",
      "request": "launch",
      "name": "vuejs: firefox",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}/src",
      "pathMappings": [{ "url": "webpack:///src/", "path": "${webRoot}/" }]
    }
  ]
}
```

## Установка точки останова

1.  Установите точку останова в файле **src/components/HelloWorld.vue** на `строке 90` где функция `data` возвращает строку.

  ![Breakpoint Renderer](/images/breakpoint_set.png)

2.  Откройте свою любимую консоль в корневом каталоге приложения и запустите его с помощью Vue CLI:

  ```
  npm run serve
  ```

3.  Перейдите в режим отладки, выберите конфигурацию **'vuejs: chrome/firefox'**, затем нажмите F5 или зелёную кнопку для старта.

4.  Ваша точка останова должна быть достигнута, когда новый экземпляр браузера откроет `http://localhost:8080`.

  ![Breakpoint Hit](/images/breakpoint_hit.png)

## Альтернативные варианты

### Vue devtools

Существуют и другие методы отладки, различающиеся по сложности. Самый популярный и простой из них — использовать Vue.js devtools [для Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) и [для Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/). Главное из преимуществ работы с инструментами разработки (devtools) состоит в том, что они позволяют вам в реальном времени менять свойства данных и сразу видеть изменения на странице. Другим важным преимуществом является возможность отладки во времени (time travel debugging) для Vuex.

![Devtools Timetravel Debugger](/images/devtools-timetravel.gif)

<p class="tip">Обратите внимание, если на странице используется production/минифицированная сборка Vue.js (как например, стандартная ссылка на CDN), то проверка инструментов разработки по умолчанию отключена и поэтому панель Vue не будет отображаться в инструментах разработчика. Если вы переключитесь на не минифицированную версию, вам может потребоваться обновить страницу, чтобы увидеть изменения.</p>

### Использование выражения Debugger

Примеры выше предоставляют отличные рабочие варианты для отладки. Однако, есть и альтернативный вариант, когда вы просто можете использовать [нативное выражение debugger](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/debugger) прямо в вашем коде. Если вы выберите этот путь, важно не забыть удалить эти выражения после окончания отладки.

```html
<script>
export default {
  data() {
    return {
      message: ''
    }
  },
  mounted() {
    const hello = 'Hello World!'
    debugger
    this.message = hello
  }
};
</script>
```

## Благодарности

Этот рецепт был основан на примере [Kenneth Auchenberg](https://twitter.com/auchenberg), который [доступен здесь](https://github.com/Microsoft/VSCode-recipes/tree/master/vuejs-cli).
