---
title: Хранение данных на стороне клиента
type: cookbook
order: 11
---

## Простой пример

Хранение данных на стороне клиента — это отличный способ быстро повысить производительность приложения, который заключается в том, чтобы пропустить получение информации от сервера каждый раз, когда пользователь нуждается в ней. Это особенно полезно в офлайн-режиме, но даже для онлайн пользователей будет польза от использования данных локально в противовес удаленному серверу. Хранение на стороне клиента может быть организовано с использованием [cookies](https://developer.mozilla.org/ru/docs/Web/HTTP/Cookies), [Local Storage](https://developer.mozilla.org/ru/docs/Web/API/Web_Storage_API) (технически "Web Storage"), [IndexedDB](https://developer.mozilla.org/ru/docs/IndexedDB) и [WebSQL](https://www.w3.org/TR/webdatabase/) (устаревший метод, который не следует использовать в новых проектах).

В этом рецепте мы сфокусируемся на Local Storage (далее — локальное хранилище), простейшем механизме хранения. Локальное хранилище использует систему ключ-значение для хранения данных. Это ограничивает нас хранением только простых значений, но сложные структуры данных возможно сохранять, если вы готовы сериализовывать их в JSON и обратно. Локальное хранилище подходит для небольших наборов данных, например, настроек пользователя или данных формы. Для больших объёмов данных, где требуются комплексные требования к хранению, лучше использовать IndexedDB.

Давайте начнём с простого примера в виде формы:

``` html
<div id="app">
  My name is <input v-model="name">
</div>
```

Этот пример имеет одно поле ввода, привязанное к свойству данных `name` в экземпляре Vue:

``` js
const app = new Vue({
  el:'#app',
  data: {
    name:''
  },
  mounted() {
    if(localStorage.name) this.name = localStorage.name;
  },
  watch: {
    name(newName) {
      localStorage.name = newName;
    }
  }
});
```

Обратите внимание на фрагменты `mounted` и `watch`. Мы используем `mounted` для управления загрузкой значения из localStorage. Для управления записью данных в базу, мы следим за значением `name` и немедленно записываем изменения.

Вы можете запустить этот пример самостоятельно здесь:

<p data-height="265" data-theme-id="0" data-slug-hash="KodaKb" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="testing localstorage" class="codepen">Посмотрите Pen <a href="https://codepen.io/cfjedimaster/pen/KodaKb/">тестирование localstorage</a> от Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) на <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Введите что-нибудь в форму и затем обновите эту страницу. Вы заметите, что введённое вами ранее значение будет показано автоматически. Не забывайте, что ваш браузер предоставляет замечательные инструменты разработчика для просмотра хранилища на стороне клиента. Ниже пример в Firefox:

![Storage devtools in Firefox](/images/devtools-storage.png)

И вот пример в Chrome:

![Storage devtools in Chrome](/images/devtools-storage-chrome.png)

И наконец пример в Microsoft Edge. Обратите внимание, что вы можете найти сохранённые значения приложения на вкладке "Отладчик".

![Storage devtools in Edge](/images/devtools-storage-edge.png)

<p class="tip">Небольшая заметка: инструменты разработчика также предоставляют возможность удалять значения из хранилища. Это может быть очень полезным при тестировании.</p>

Немедленная запись значения может быть нецелесообразной. Давайте рассмотрим чуть более сложный пример. Во-первых, обновим форму.

``` html
<div id="app">
  My name is <input v-model="name">
  and I am <input v-model="age"> years old.
  <p/>
  <button @click="persist">Save</button>
</div>
```

У нас есть 2 поля (опять-таки связанные с экземпляром Vue), но теперь добавилась и кнопка, запускающая метод `persist`. Давайте посмотрим на код JavaScript.

``` js 
const app = new Vue({
  el:'#app',
  data: {
    name:'',
    age:0
  },
  mounted() {
    if(localStorage.name) this.name = localStorage.name;
    if(localStorage.age) this.age = localStorage.age;
  },
  methods: {
    persist() {
      localStorage.name = this.name;
      localStorage.age = this.age;
      console.log('now pretend I did more stuff...');
    }
  }
})
```

Как и раньше, используем `mounted` для получения сохранённых данных, если такие были. На этот раз, однако, данные сохраняются только при нажатии кнопки. Мы также можем сделать любые проверки или преобразования перед сохранением значения. Вы также можете сохранить дату последнего обновления данных. С такими метаданными, метод `mounted` может проверять, следует ли сохранять значения снова или нет, как в версии ниже. Вы можете попробовать эту версию ниже.

<p data-height="265" data-theme-id="0" data-slug-hash="rdOjLN" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="testing localstorage 2" class="codepen">Посмотрите Pen <a href="https://codepen.io/cfjedimaster/pen/rdOjLN/">тестирование localstorage 2</a> от Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) на <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Работа со сложными значениями

Локальное хранилище работает только с простыми значениями. Для хранения более комплексных значений (объектов или массивов) вам необходимо будет самостоятельно преобразовывать их в JSON и обратно. Ниже представлен пример сохранения массива кошек.

``` html
<div id="app">
  <h2>Cats</h2>
  <div v-for="(cat,n) in cats">
    <p>
    <span class="cat">{{cat}}</span> <button @click="removeCat(n)">Remove</button>
    </p>
  </div>
  
  <p>
    <input v-model="newCat"> 
    <button @click="addCat">Add Cat</button>
  </p>
  
</div>
```

Это приложение состоит из простого списка сверху (с кнопкой для удаления кота) и небольшой формы внизу для добавления нового кота. Посмотрим на код JavaScript.

``` js
const app = new Vue({
  el:'#app',
  data: {
    cats:[],
    newCat:null
  },
  mounted() {
    
    if(localStorage.getItem('cats')) {
      try {
        this.cats = JSON.parse(localStorage.getItem('cats'));
      } catch(e) {
        localStorage.removeItem('cats');
      }
    }
  },
  methods: {
    addCat() {
      // ensure they actually typed something
      if(!this.newCat) return;
      this.cats.push(this.newCat);
      this.newCat = '';
      this.saveCats();
    },
    removeCat(x) {
      this.cats.splice(x,1);
      this.saveCats();
    },
    saveCats() {
      let parsed = JSON.stringify(this.cats);
      localStorage.setItem('cats', parsed);
    }
  }
})
```

В этом приложении мы будем использовать Local Storage API вместо "прямого" доступа. Оба варианта работают, однако метод API в целом предпочтительнее. В хуке `mounted` мы получаем JSON-значение и преобразуем в объект. Если что-то пошло не так, мы предполагаем, что данные повреждены и удаляем их. (Помните, если ваше приложение использует хранилище на стороне клиента, пользователь в любое время имеет доступ к нему и может изменить на своё усмотрение).

Теперь у нас есть три метода для управления списком котов. Как `addCat`, так и `removeCat` обновляют данные экземпляра Vue в `this.cats`. Затем они вызывают метод `saveCats`, который занимается сериализацией и сохранением данных. Вы можете попробовать эту версию ниже.

<p data-height="265" data-theme-id="0" data-slug-hash="qoYbyW" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="localstorage, complex" class="codepen">Посмотрите Pen <a href="https://codepen.io/cfjedimaster/pen/qoYbyW/">localstorage, complex</a> от Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) на <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Альтернативные варианты

В то время как Local Storage API относительно прост, в нём отсутствуют некоторые базовые возможности, которые будут полезны во многих приложениях. Следующие плагины оборачивают доступ к локальному хранилищу и упрощают его, а также добавляют такую функциональность, как, например, значения по умолчанию.

* [vue-local-storage](https://github.com/pinguinjkeke/vue-local-storage)
* [vue-reactive-storage](https://github.com/ropbla9/vue-reactive-storage)

## Итоги

Хотя браузер никогда не заменит системы хранения на сервере, наличие различных способов кеширования данных локально может дать огромный прирост производительности вашему приложению, и работа с ними во Vue.js делает его ещё более мощным.
