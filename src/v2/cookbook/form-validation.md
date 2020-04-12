---
title: Валидация форм
type: cookbook
order: 3
---

## Простой пример

<div class="vueschool"><a href="https://vueschool.io/lessons/vuejs-form-validation-diy?friend=vuejs" target="_blank" rel="sponsored noopener" title="Free Vue.js Form Validation Lesson">Посмотрите бесплатный урок на Vue School</a></div>

Валидация форм нативно поддерживается браузерами, но иногда разные браузеры могут обрабатывать вещи таким образом, что полагаться на них будет сложнее. Даже когда поддержка валидации реализована на отлично — могут потребоваться специальные проверки, и более подходящие решения основанные на Vue. Начнём с простого примера.

Есть форма с тремя полями, сделаем два из них обязательными. Давайте посмотрим на HTML для решения этой задачи:

```html
<form
  id="app"
  @submit="checkForm"
  action="https://vuejs.org/"
  method="post"
>

  <p v-if="errors.length">
    <b>Пожалуйста исправьте указанные ошибки:</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>

  <p>
    <label for="name">Имя</label>
    <input
      id="name"
      v-model="name"
      type="text"
      name="name"
    >
  </p>

  <p>
    <label for="age">Возраст</label>
    <input
      id="age"
      v-model="age"
      type="number"
      name="age"
      min="0"
    >
  </p>

  <p>
    <label for="movie">Любимый фильм</label>
    <select
      id="movie"
      v-model="movie"
      name="movie"
    >
      <option>Star Wars</option>
      <option>Vanilla Sky</option>
      <option>Atomic Blonde</option>
    </select>
  </p>

  <p>
    <input
      type="submit"
      value="Отправить"
    >
  </p>

</form>
```

Начнём с начала. Тег `<form>` имеет ID, который мы будем использовать для компонента Vue. Есть обработчик события отправки формы (submit), который мы увидим далее, и также атрибут `action` с временным URL-адресом, который будет указывать на что-то реальное где-нибудь на сервере (где конечно же будет реализована и валидация на стороне сервера).

После этого расположен абзац, который показывается или скрывается в зависимости от наличия ошибок. Это позволит отобразить простой список ошибок над формой. Также обратите внимание, что мы запускаем проверку на submit формы, а не при изменении каждого поля.

Последнее, что нужно отметить — каждое из трёх полей имеет соответствующую `v-model` для связи с значениями, с которыми мы будем работать в JavaScript. Теперь давайте посмотрим на код.

```js
const app = new Vue({
  el: '#app',
  data: {
    errors: [],
    name: null,
    age: null,
    movie: null
  },
  methods: {
    checkForm: function (e) {
      if (this.name && this.age) {
        return true;
      }

      this.errors = [];

      if (!this.name) {
        this.errors.push('Требуется указать имя.');
      }
      if (!this.age) {
        this.errors.push('Требуется указать возраст.');
      }

      e.preventDefault();
    }
  }
})
```

Довольно коротко и просто. Мы определяем массив для хранения ошибок и задаём `null` в качестве значения для всех трёх полей формы. Логика `checkForm` (которая запускается при отправке формы) проверяет только имя и возраст, оставляя поле выбора фильма опциональным. Если они пусты, то мы проверяем по очереди и устанавливаем конкретную ошибку для каждого поля. И это в принципе всё. Вы можете запустить демо по ссылке ниже. Не забывайте, что при успешной отправке формы будет отправляться POST-запрос на временный URL.

<p data-height="265" data-theme-id="0" data-slug-hash="GObpZM" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 1" class="codepen">Посмотрите Pen <a href="https://codepen.io/cfjedimaster/pen/GObpZM/">валидация форм 1</a> от Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) на <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Использование пользовательских проверок

Во втором примере, второе текстовое поле (возраст) было заменено на email, который будет проверяться с помощью специальной логики. Код взят из вопроса на StackOverflow, [Как валидировать электронный адрес в JavaScript?](https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript). Классный вопрос — на его фоне любые политические/религиозные холивары выглядят как незначительные разночтения насчёт сортов пива. Серьёзно — это безумие. Вот HTML, хотя он действительно близок к первому примеру.

```html
<form
  id="app"
  @submit="checkForm"
  action="https://vuejs.org/"
  method="post"
  novalidate="true"
>

  <p v-if="errors.length">
    <b>Пожалуйста исправьте указанные ошибки:</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>

  <p>
    <label for="name">Имя</label>
    <input
      id="name"
      v-model="name"
      type="text"
      name="name"
    >
  </p>

  <p>
    <label for="email">Email</label>
    <input
      id="email"
      v-model="email"
      type="email"
      name="email"
    >
  </p>

  <p>
    <label for="movie">Любимый фильм</label>
    <select
      id="movie"
      v-model="movie"
      name="movie"
    >
      <option>Звёздные войны</option>
      <option>Ванильное небо</option>
      <option>Взрывная блондинка</option>
    </select>
  </p>

  <p>
    <input
      type="submit"
      value="Отправить"
    >
  </p>

</form>
```

Хотя изменения достаточно малы, обратите внимание на `novalidate="true"` наверху. Это важно, потому что браузер будет пытаться валидировать email адрес в поле с типом `type="email"`. Честно говоря, в этом случае больше смысла доверять браузеру, но, поскольку нам нужен пример с пользовательской валидацией, мы отключим его. Вот обновлённый JavaScript.

```js
const app = new Vue({
  el: '#app',
  data: {
    errors: [],
    name: null,
    email: null,
    movie: null
  },
  methods: {
    checkForm: function (e) {
      this.errors = [];

      if (!this.name) {
        this.errors.push('Укажите имя.');
      }
      if (!this.email) {
        this.errors.push('Укажите электронную почту.');
      } else if (!this.validEmail(this.email)) {
        this.errors.push('Укажите корректный адрес электронной почты.');
      }

      if (!this.errors.length) {
        return true;
      }

      e.preventDefault();
    },
    validEmail: function (email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
})
```

Как вы можете видеть, мы добавили `validEmail` в качестве нового метода и просто вызываем его из `checkForm`. Вы можете поиграть с этим примером здесь:

<p data-height="265" data-theme-id="0" data-slug-hash="vWqNXZ" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 2" class="codepen">Посмотреть Pen <a href="https://codepen.io/cfjedimaster/pen/vWqNXZ/">валидации форм 2</a> от Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) на <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Другой пример пользовательской валидации

Для третьего примера, мы создадим то, что вы вероятно видели в приложениях для опросов. Пользователю предлагается потратить «бюджет» на набор возможностей новой модели Star Destroyer. Сумма должна быть равна 100. Во-первых, HTML.

```html
<form
  id="app"
  @submit="checkForm"
  action="https://vuejs.org/"
  method="post"
  novalidate="true"
>

  <p v-if="errors.length">
    <b>Пожалуйста исправьте указанные ошибки:</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>

  <p>
    Учитывая бюджет в 100 долларов, укажите сколько
    вы хотите потратить на следующие возможности для
    Star Destroyer следующего поколения. Ваша сумма не должна превысить 100.
  </p>

  <p>
    <input
      type="number"
      name="weapons"
      v-model.number="weapons"
    > Орудия <br/>
    <input
      type="number"
      name="shields"
      v-model.number="shields"
    > Броня <br/>
    <input
      type="number"
      name="coffee"
      v-model.number="coffee"
    > Кофе <br/>
    <input
      type="number"
      name="ac"
      v-model.number="ac"
    > Кондиционирование <br/>
    <input
      type="number"
      name="mousedroids"
      v-model.number="mousedroids"
    > Мыши-дройды <br/>
  </p>

  <p>
    Итого: {{ total }}
  </p>

  <p>
    <input
      type="submit"
      value="Отправить"
    >
  </p>

</form>
```

Обратите внимание на набор полей охватывающих пять разных функций. Обратите внимание на использование `.number` в атрибуте `v-model`. Это говорит Vue преобразовывать значение в число, когда вы его используете. Однако, здесь есть ошибка в это функции — когда значение пустое, то оно будет превращаться в строку. Вы увидите ниже как можно обойти эту проблему. Чтобы сделать это немного проще для пользователя, мы также добавили итоговую сумму внизу, чтобы они могли видеть в реальном времени, на какую сумму выбрано возможностей. Теперь давайте посмотрим на JavaScript.

```js
const app = new Vue({
  el: '#app',
  data: {
    errors: [],
    weapons: 0,
    shields: 0,
    coffee: 0,
    ac: 0,
    mousedroids: 0
  },
  computed: {
     total: function () {
       // необходимо парсить, потому что Vue
       // преобразует пустое значение в строку
       return Number(this.weapons) +
         Number(this.shields) +
         Number(this.coffee) +
         Number(this.ac + this.mousedroids);
     }
  },
  methods: {
    checkForm: function (e) {
      this.errors = [];

      if (this.total != 100) {
        this.errors.push('Итоговая сумму должна быть 100!');
      }

      if (!this.errors.length) {
        return true;
      }

      e.preventDefault();
    }
  }
})
```

Мы указали итоговую сумму как вычисляемое свойство, и это было достаточно просто реализовать для обхода этой ошибки. Мой метод checkForm теперь просто должен проверять является ли значение total равным 100 им всё. Вы можете поиграть с этим примером здесь:

<p data-height="265" data-theme-id="0" data-slug-hash="vWqGoy" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 3" class="codepen">Посмотрите Pen <a href="https://codepen.io/cfjedimaster/pen/vWqGoy/">валидации форм 3</a> от Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) на <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Валидация на стороне сервера

В последнем примере мы построили что-то, что использует Ajax для валидации на сервере. Форма предложит назвать новый продукт и затем проверит, чтобы имя было уникальным. Мы быстро накидали [Netlify](https://netlify.com/) serverless действие для этой валидации. Хотя это не очень важно, вот эта логика:

```js
exports.handler = async (event, context) => {

  const badNames = ['vista', 'empire', 'mbp'];
  const name = event.queryStringParameters.name;

  if (badNames.includes(name)) {
    return {
      statusCode: 400,
      body: JSON.stringify({error: 'Invalid name passed.'})
    }
  }

  return {
    statusCode: 204
  }
}
```

В принципе, любое имя кроме «vista», «empire», и «mbp» приемлемы. Хорошо, давайте посмотрим на форму.

```html
<form
  id="app"
  @submit="checkForm"
  method="post"
>

  <p v-if="errors.length">
    <b>Пожалуйста исправьте указанные ошибки:</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>

  <p>
    <label for="name">Имя нового продукта: </label>
    <input
      id="name"
      v-model="name"
      type="text"
      name="name"
    >
  </p>

  <p>
    <input
      type="submit"
      value="Отправить"
    >
  </p>

</form>
```

Здесь нет ничего особенного. Давайте посмотрим на JavaScript.

```js
const apiUrl = 'https://vuecookbook.netlify.com/.netlify/functions/product-name?name=';

const app = new Vue({
  el: '#app',
  data: {
    errors: [],
    name: ''
  },
  methods: {
    checkForm: function (e) {
      e.preventDefault();

      this.errors = [];

      if (this.name === '') {
        this.errors.push('Укажите имя продукта.');
      } else {
        fetch(apiUrl + encodeURIComponent(this.name))
          .then(async res => {
            if (res.status === 204) {
              alert('OK');
            } else if (res.status === 400) {
              let errorResponse = await res.json();
              this.errors.push(errorResponse.error);
            }
          });
      }
    }
  }
})
```

Мы начали с переменной, определяющей URL-адрес нашего API, который работает на OpenWhisk. Теперь посмотрим на `checkForm`. В этой версии мы всегда предотвращаем отправку формы (что, кстати, можно было бы сделать и в HTML вместе с Vue). Вы можете увидеть простую проверку на случай если `this.name` пуста, а затем мы делаем запрос на API. Если всё плохо — мы добавляем ошибку, как и раньше. Если всё хорошо — пока ничего не делаем (просто показываем alert), но вы можете перенаправить пользователя на новую страницу с именем продукта в URL или выполнять другие действия. Вы можете посмотреть демо по ссылке ниже:

<p data-height="265" data-theme-id="0" data-slug-hash="BmgzeM" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 4" class="codepen">Посмотрите Pen <a href="https://codepen.io/cfjedimaster/pen/BmgzeM/">валидация форм 4</a> от Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) на <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Альтернативы

В то время как cookbook сосредотачивается на том, чтобы сделать валидацию формы своими руками, существует конечно и много отличных библиотек Vue, которые сделают большую часть работы за вас. Переход к использованию подготовленной библиотеки может повлиять на итоговый размер вашего приложения, но преимущества могут быть огромны. У вас есть код, который (скорее всего) основательно протестирован и регулярно обновляется. Некоторые примеры библиотек для валидации смотрите тут:

* [vuelidate](https://github.com/monterail/vuelidate)
* [VeeValidate](https://logaretm.github.io/vee-validate/)
