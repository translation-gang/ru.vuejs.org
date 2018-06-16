---
title: Хранение на стороне клиента
type: cookbook
order: 11
---

## Простой пример

Хранение на стороне клиента - это отличный способ быстро добавить прирост производительности приложению. Благодаря хранению данных на стороне браузера, вы можете пропустить получение информации от сервера каждый раз, когда пользователь нуждается в ней. Это особенно полезно в офлайн режиме, но даже для онлайн пользователей будет польза от использования данных локально в противовес удаленному серверу. Хранение на стороне клиента может быть организовано с использованием куки ([cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)), [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) (технически "Web Storage"), [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), и [WebSQL](https://www.w3.org/TR/webdatabase/) (устаревший метод, который не следует использовать в новых проектах).

В этой статье мы сфокусируемся на Local Storage, простейшем из механизмов хранения. Local Storage использует систему ключ-значение для хранения данных. Это ограничивает нас хранением только простых значений, однако и сложные данные могут быть сохранены, если вы готовы сериализовать их в JSON. В общем, Local Storage является подходящим для небольших наборов данных, которые вы хотели бы сохранить, информации вроде пользовательских предпочтений или данных формы. Больше данных с более сложными требованиями к хранению лучше сохранять в IndexedDB.

Давайте начнем с простого примера в виде формы:

``` html
<div id="app">
  My name is <input v-model="name">
</div>
```

Этот пример имеет одно поле ввода, связанное с Vue значением `name`:

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

Обратите внимание на `mounted` и `watch` фрагменты. Мы используем `mounted` для управления загрузкой значения из localStorage. Для управления записью данных в базу, мы следим за значением `name` и немедленно записываем изменения.

Вы можете запустить этот пример самостоятельно здесь:

<p data-height="265" data-theme-id="0" data-slug-hash="KodaKb" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="testing localstorage" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/KodaKb/">testing localstorage</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Введите что-то в форму и затем обновите эту страницу. Вы заметите, что введенное вами ранее значение будет показано автоматически. Не забывайте, что ваш браузер предоставляет замечательные инструменты разработчика для просмотра хранилища на стороне клиента. Здесь пример в Firefox:

![Storage devtools in Firefox](/images/devtools-storage.png)

И здесь пример в Chrome:

![Storage devtools in Chrome](/images/devtools-storage-chrome.png)

И пример в Microsoft Edge. Обратите внимание, что вы можете найти сохраненные значения приложения во вкладке отладчика.

![Storage devtools in Edge](/images/devtools-storage-edge.png)

<p class="tip">Кроме того, инструменты разработчика также предоставляют возможность удалять значения из хранилища. Это может быть очень полезным при тестировании.</p>

Немедленная запись значения может быть нецелесообразной. Давайте рассмотрим немного более сложный пример. Во-первых, обновим форму.

``` html
<div id="app">
  My name is <input v-model="name">
  and I am <input v-model="age"> years old.
  <p/>
  <button @click="persist">Save</button>
</div>
```

Мы имеем 2 поля (опять-таки связанные с экземпляром Vue), но сейчас также существует дополнительная кнопка, которая запускает `persist` метод. Давайте посмотрим на Javascript код.

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

Как и раньше, `mounted` используется для загрузки сохраненных данных, если они существуют. На этот раз, однако, данные сохраняются только при нажатии кнопки. Мы также можем сделать любые проверки или преобразования здесь перед сохранением значения. Вы также можете хранить дату последнего сохранения значений. С такими метаданными, `mounted` метод может проверять, следует ли сохранять значения снова или нет, как в версии ниже. Вы можете попробовать эту версию ниже.

<p data-height="265" data-theme-id="0" data-slug-hash="rdOjLN" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="testing localstorage 2" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/rdOjLN/">testing localstorage 2</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Работа со сложными значениями

Как было сказано выше, локальное хранилище (Local Storage) работает только с простыми значениями. Для хранения более сложных значений (объектов или массивов) вы должны преобразовывать их в JSON и обратно. Вот более сложный пример, где сохраняется массив кошек (лучший вид массива из возможных).

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

Это приложение состоит из простого списка сверху (с кнопкой для удаления кота) и небольшой формы внизу для добавления нового кота. Посмотрим на Javascript код.

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

В этом приложении мы будем использовать Local Storage API вместо "прямого" доступа. Оба варианта работают, однако API метод более предпочтительный. `mounted` сейчас должен получить значение и преобразовать его в объект из JSON. Если что-то пошло не так, мы предполагаем, что данные повреждены и удаляем их. (Помните, если ваше приложение использует хранилище на стороне клиента, пользователь в любое время имеет доступ к нему и может изменить его в будущем).

Мы имеем три метода для управления работой с котом. И `addCat`, и `removeCat` управляют обновлением данных экземпляра Vue в `this.cats`. Затем они запускают `saveCats` метод, который управляет сериализацией и сохранением данных. Вы можете поиграть с этой версией ниже.

<p data-height="265" data-theme-id="0" data-slug-hash="qoYbyW" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="localstorage, complex" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/qoYbyW/">localstorage, complex</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Альтернативные паттерны

В то время как Local Storage API является относительно простым, в нем отсутствуют некоторые базовые функции, которые будут полезны во многих приложениях. Следующие плагины оборачивают доступ к локальному хранилищу и делают его проще в использовании, а также добавляют функции, такие как значения по умолчанию.

* [vue-local-storage](https://github.com/pinguinjkeke/vue-local-storage)
* [vue-reactive-storage](https://github.com/ropbla9/vue-reactive-storage)

## Резюме

Хотя браузер не заменит серверные системы хранения, наличие различных способов кеширования данных локально может дать огромный прирост производительности вашего приложения, и работа с ними во Vue.js делает их еще более мощными.
