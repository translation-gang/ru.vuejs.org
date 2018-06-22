---
title: Используем Axios для доступа к API
type: cookbook
order: 9
---

## Простой пример

Неоднократно при создании веб-приложения вам может понадобиться получать и отображать данные из API. Существует несколько способов сделать это, но наиболее популярным решением является использование [axios](https://github.com/axios/axios), основанного на промисах HTTP-клиента.

В этом упражнении мы будет использовать [CoinDesk API](https://www.coindesk.com/api/) для отображения цен на Биткоин, обновляемых каждую минуту. Прежде всего, подключим axios с помощью npm, yarn или ссылки на CDN.

Существует множество вариантов, как мы можем запрашивать информацию из API, но прежде необходимо узнать, в каком виде предоставляются данные, чтобы понимать, как их отображать. Для этого сделаем запрос к конечной точке (endpoint) API и выведем результат. Как можно убедиться из документации API CoinDesk, для получения данных мы будет делать запрос на `https://api.coindesk.com/v1/bpi/currentprice.json`. Изначально необходимо создать свойство в `data` для хранения нашей информации, далее извлечём и сохраним данные, используя хук жизненного цикла `mounted`.

```js
new Vue({
  el: "#app",
  data() {
    return {
      info: null
    };
  },
  mounted() {
    axios
      .get("https://api.coindesk.com/v1/bpi/currentprice.json")
      .then(response => (this.info = response));
  }
});
```

```html
<div id="app">
  {{ info }}
</div>
```

И вот что мы получаем:

<p data-height="350" data-theme-id="32763" data-slug-hash="80043dfdb7b90f138f5585ade1a5286f" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="First Step Axios and Vue" class="codepen">Посмотрите Pen <a href="https://codepen.io/team/Vue/pen/80043dfdb7b90f138f5585ade1a5286f/">First Step Axios and Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) на <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Отлично! Мы получили какие-то данные. Но сейчас они выглядят достаточно грязно, так что давайте отобразим их должным образом и добавим обработку ошибок на случай, если что-то пойдёт не так, либо когда для получения информации потребовалось больше времени.

## Пример из жизни: работа с данными 

### Отображение данных из API

Типичная ситуация, когда необходимая информация находится внутри ответа сервера и нам необходимо знать структуру данных для получения доступа. В нашем случае, нужная информация о цене находится в `response.data.bpi`. Если мы используем это, то запрос будет выглядеть следующим образом.

```js
axios
  .get("https://api.coindesk.com/v1/bpi/currentprice.json")
  .then(response => (this.info = response.data.bpi));
```

<p data-height="200" data-theme-id="32763" data-slug-hash="6100b10f1b4ac2961208643560ba7d11" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Second Step Axios and Vue" class="codepen">Посмотрите Pen <a href="https://codepen.io/team/Vue/pen/6100b10f1b4ac2961208643560ba7d11/">Second Step Axios and Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) на <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Такие данные намного проще отображать, так что мы можем сейчас обновить HTML-разметку для отображения только нужной информации из полученных данных. Создадим [фильтр](../api/#Vue-filter), чтобы десятичные значения всегда отображались как нужно.

```html
<div id="app">
  <h1>Bitcoin Price Index</h1>
  <div v-for="currency in info" class="currency">
    {{ currency.description }}:
    <span class="lighten">
      <span v-html="currency.symbol"></span>{{ currency.rate_float | currencydecimal }}
    </span>
  </div>
</div>
```

```js
filters: {
  currencydecimal (value) {
    return value.toFixed(2)
  }
},
```

<p data-height="300" data-theme-id="32763" data-slug-hash="9d59319c09eaccfaf35d9e9f11990f0f" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Third Step Axios and Vue" class="codepen">Посмотрите Pen <a href="https://codepen.io/team/Vue/pen/9d59319c09eaccfaf35d9e9f11990f0f/">Third Step Axios and Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) на <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### Обработка ошибок

Бывают моменты, когда мы не получили необходимые данные из API. Может быть множество причин, из-за которых вызов axios мог закончиться неудачей, например:

* API не был доступен.
* Запрос был сделан неправильно.
* API не предоставил данные в ожидаемом нами формате.

При выполнении этого запроса мы должны проверять такие обстоятельства и предоставлять информацию в каждом случае, чтобы мы знали, как справиться с этой проблемой. В вызове axios мы сделаем это, используя `catch`.

```js
axios
  .get("https://api.coindesk.com/v1/bpi/currentprice.json")
  .then(response => (this.info = response.data.bpi))
  .catch(error => console.log(error));
```

Так мы узнаем, если что-то пойдёт не так во время запроса к API. Но что если данные повреждены или API не был доступен? Сейчас пользователь просто ничего не увидит. Мы могли бы использовать индикатор загрузки для этого случая и сообщать пользователю, что не можем получить данные.

```js
new Vue({
  el: "#app",
  data() {
    return {
      info: null,
      loading: true,
      errored: false
    };
  },
  filters: {
    currencydecimal(value) {
      return value.toFixed(2);
    }
  },
  mounted() {
    axios
      .get("https://api.coindesk.com/v1/bpi/currentprice.json")
      .then(response => {
        this.info = response.data.bpi;
      })
      .catch(error => {
        console.log(error);
        this.errored = true;
      })
      .finally(() => (this.loading = false));
  }
});
```

```html
<div id="app">
  <h1>Bitcoin Price Index</h1>

  <section v-if="errored">
    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
  </section>

  <section v-else>
    <div v-if="loading">Loading...</div>

    <div v-else v-for="currency in info" class="currency">
      {{ currency.description }}:
      <span class="lighten">
        <span v-html="currency.symbol"></span>{{ currency.rate_float | currencydecimal }}
      </span>
    </div>

  </section>
</div>
```

Вы можете нажимать на кнопку перезапуска (находится в правом нижнем углу во вкладке Result), чтобы увидеть индикатор загрузки во время получения данных из API.

<p data-height="300" data-theme-id="32763" data-slug-hash="6c01922c9af3883890fd7393e8147ec4" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Fourth Step Axios and Vue" class="codepen">Посмотрите Pen <a href="https://codepen.io/team/Vue/pen/6c01922c9af3883890fd7393e8147ec4/">Fourth Step Axios and Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) на <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

В дальнейшем код можно улучшить с помощью компонентов для различных секций и более детальными отчётами об ошибках. Это зависит от используемого API и сложности вашего приложения.

## Альтернативы

### Fetch API

[Fetch API](https://developers.google.com/web/updates/2015/03/introduction-to-fetch) — мощный нативный API для создания запросов. Может вы слышали, что одно из преимуществ Fetch API в том, что не нужно загружать внешние зависимости для его использования, что является правдой! Однако... он ещё не полностью поддерживается браузерами, поэтому всё равно необходимо использовать полифил. Есть подводные камни при работе с его API, поэтому многие сейчас предочитают axios. В будущем это может измениться.

Если вы заинтересовались Fetch API — существуют [очень хорошие статьи](https://scotch.io/@bedakb/lets-build-type-ahead-component-with-vuejs-2-and-fetch-api), где объясняются тонкости его использования.

## Итоги

Существует множество способов работы с Vue и axios, выходящие за рамки получения и отображения данных из API. Вы можете также взаимодействовать с бессерверными функциями (Serverless Functions), публикацией/редактированием/удалением через API, к которому вы имеете доступ, и т.д. Простая интеграция этих двух библиотек сделала axios очень распространённым выбором среди разработчиков, которым необходимо интегрировать HTTP-клиенты в их приложения.
