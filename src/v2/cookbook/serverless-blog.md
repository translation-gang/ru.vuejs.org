---
title: Создание блога, управляемого CMS
type: cookbook
order: 5
---

Итак, вы только что запустили свой веб-сайт на Vue.js, поздравляем! Теперь вы хотите добавить блог, который быстро встраивается на ваш сайт и вы не хотите перевернуть всё вверх дном на сервере в попытке запустить WordPress (или любую другую CMS, использующую базу данных для этих целей). Вы хотите просто добавить несколько компонентов Vue.js для блога и пару маршрутов и чтобы всё это просто работало, не так ли? То что вы ищете для блога должно полностью основываться на API, чтобы вы могли использовать непосредственно из своего приложения Vue.js. Этот рецепт научит вас, как это сделать, давайте приступим!

Мы собираемся быстро создать блог на основе CMS с помощью Vue.js. Мы будем использовать [ButterCMS](https://buttercms.com/), CMS в первую очередь ориентированную на API, которая позволяет управлять контентом с помощью панели управления ButterCMS и интегрировать API для получения контента в ваше приложение Vue.js. Вы можете использовать ButterCMS для новых или уже существующих проектов Vue.js.

![Панель управления Butter](https://user-images.githubusercontent.com/160873/36677285-648798e4-1ad3-11e8-9454-d22fca8280b7.png "Butter Dashboard")

## Установка

Выполните в командной строке:

```bash
npm install buttercms --save
```

Butter также можно подключить с помощью CDN:

```html
<script src="https://cdnjs.buttercms.com/buttercms-1.1.0.min.js"></script>
```

## Быстрый старт

Установите ваш токен API:

```javascript
var butter = require('buttercms')('your_api_token');
```

С использованием ES6:

```javascript
import Butter from 'buttercms';
const butter = Butter('your_api_token');
```

С использованием CDN:

```html
<script src="https://cdnjs.buttercms.com/buttercms-1.1.0.min.js"></script>
<script>
  var butter = Butter('your_api_token');
</script>
```

Импортируйте этот файл в любой компонент, где вы хотите использовать ButterCMS. Затем выполните в консоли команду:

```javascript
butter.post.list({page: 1, page_size: 10}).then(function(response) {
  console.log(response)
})
```

Запрос к API получит ваши записи блога. В вашей учётной записи уже будет одна запись в качестве примера, которую вы и увидите в ответе сервера.

## Отображение записей

Для отображения записей мы создадим маршрут `/blog` (используя Vue Router) в нашем приложении и будем получать записи блога через Butter API, аналогично будет работать маршрут `/blog/:slug` для работы с конкретными записями блога.

Обратитесь к [справочнику API](https://buttercms.com/docs/api/?javascript#blog-posts) ButterCMS для получения информации по  дополнительным опциям, таким как фильтрация по категориям или автору. Ответ сервера также включает некоторые метаданные, которые мы будем использовать для пагинации.

`router/index.js:`

```javascript
import Vue from 'vue'
import Router from 'vue-router'
import BlogHome from '@/components/BlogHome'
import BlogPost from '@/components/BlogPost'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/blog/',
      name: 'blog-home',
      component: BlogHome
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: BlogPost
    }
  ]
})
```

Затем создадим `components/BlogHome.vue`, который будет страницей вашего блога со списком последних записей.

```html
<script>
  import { butter } from '@/buttercms'
  export default {
    name: 'blog-home',
    data() {
      return {
        page_title: 'Blog',
        posts: []
      }
    },
    methods: {
      getPosts() {
        butter.post.list({
          page: 1,
          page_size: 10
        }).then(res => {
          this.posts = res.data.data
        })
      }
    },
    created() {
      this.getPosts()
    }
  }
</script>

<template>
  <div id="blog-home">
      <h1>{{ page_title }}</h1>
      <!-- Создаём `v-for` и добавляем `key` для Vue. -->
      <!-- Для этого используем комбинацию slug и index -->
      <div
        v-for="(post,index) in posts"
        :key="post.slug + '_' + index"
      >
        <router-link :to="'/blog/' + post.slug">
          <article class="media">
            <figure>
              <!-- Привязываем результаты с помощью `:` -->
              <!-- Используем `v-if`/`else` для отображения картинки записи блога (`featured_image`) -->
              <img
                v-if="post.featured_image"
                :src="post.featured_image"
                alt=""
              >
              <img
                v-else
                src="http://via.placeholder.com/250x250"
                alt=""
              >
            </figure>
            <h2>{{ post.title }}</h2>
            <p>{{ post.summary }}</p>
          </article>
        </router-link>
      </div>
  </div>
</template>
```

Вот как это выглядит (обратите внимание, что мы добавили CSS из https://bulma.io/ для быстрой стилизации):

![buttercms-bloglist](https://user-images.githubusercontent.com/160873/36868500-1b22e374-1d5e-11e8-82a0-20c8dc312716.png)

Теперь создадим `components/BlogPost.vue` который будет страницей записи блога с данными по каждой из записей.

```html
<script>
  import { butter } from '@/buttercms'
  export default {
    name: 'blog-post',
    data() {
      return {
        post: {}
      }
    },
    methods: {
      getPost() {
        butter.post.retrieve(this.$route.params.slug)
          .then(res => {
            this.post = res.data
          }).catch(res => {
            console.log(res)
          })
      }
    },
    created() {
      this.getPost()
    }
  }
</script>

<template>
  <div id="blog-post">
    <h1>{{ post.data.title }}</h1>
    <h4>{{ post.data.author.first_name }} {{ post.data.author.last_name }}</h4>
    <div v-html="post.data.body"></div>

    <router-link
      v-if="post.meta.previous_post"
      :to="/blog/ + post.meta.previous_post.slug"
      class="button"
    >
      {{ post.meta.previous_post.title }}
    </router-link>
    <router-link
      v-if="post.meta.next_post"
      :to="/blog/ + post.meta.next_post.slug"
      class="button"
    >
      {{ post.meta.next_post.title }}
    </router-link>
  </div>
</template>
```

Вот так это будет выглядеть:

![buttercms-blogdetail](https://user-images.githubusercontent.com/160873/36868506-218c86b6-1d5e-11e8-8691-0409d91366d6.png)

Теперь наше приложение загружает все записи и мы можем переходить к чтению конкретной записи блога. Однако, наши кнопки следующей/предыдущей записи ещё не работают.

При использовании маршрутов с параметрами следует помнить, что при переходе пользователя с адреса `/blog/foo` на `/blog/bar`, будет переиспользоваться тот же экземпляр компонента. Поскольку оба маршрута отрисовывают один и тот же компонент, это эффективнее, чем уничтожение старого экземпляра компонента, а затем создание нового.

<p class="tip">Помните, что использование этого компонента означает то, что хуки жизненного цикла не будут вызываться. Посетите документацию по Vue Router, чтобы узнать больше о [динамических путях](https://router.vuejs.org/ru/guide/essentials/dynamic-matching.html)</p>

Чтобы исправить это, нам необходимо отслеживать объект `$route` и вызывать `getPost()` при изменении маршрута.

Обновлённая секция `<script>` в файле `components/BlogPost.vue`:

```html
<script>
  import { butter } from '@/buttercms'
  export default {
    name: 'blog-post',
    data() {
      return {
        post: null
      }
    },
    methods: {
      getPost() {
        butter.post.retrieve(this.$route.params.slug)
          .then(res => {
            // console.log(res.data)
            this.post = res.data
          }).catch(res => {
            console.log(res)
          })
      }
    },
    watch: {
      $route(to, from) {
        this.getPost()
      }
    },
    created() {
      this.getPost()
    }
  }
</script>
```

Теперь у нашего приложения есть рабочий блог, который можно легко обновлять через панель инструментов ButterCMS.

## Категории, теги и авторы

Используйте API Butter для категорий, тегов и авторов, чтобы показывать и фильтровать контент в нашем блоге.

Изучите справочник API к ButterCMS для получения дополнительной информации об этих объектах:

* [Категории](https://buttercms.com/docs/api/?ruby#categories)
* [Теги](https://buttercms.com/docs/api/?ruby#tags)
* [Авторы](https://buttercms.com/docs/api/?ruby#authors)

Вот пример перечисления всех категорий и получения записей по категории. Вызовите эти методы в хуке жизненного цикла `created()`:

```javascript
methods: {
  // ...
  getCategories() {
    butter.category.list()
      .then(res => {
        console.log('Список категорий:')
        console.log(res.data.data)
      })
  },
  getPostsByCategory() {
    butter.category.retrieve('example-category', {
        include: 'recent_posts'
      })
      .then(res => {
        console.log('Записи в определённой категории:')
        console.log(res)
      })
  }
},
created() {
  // ...
  this.getCategories()
  this.getPostsByCategory()
}
```

## Альтернативные варианты

Альтернативным вариантом для рассмотрения, особенно если вы предпочитаете писать только в Markdown, будет использование что-то наподобие [Nuxtent](https://nuxtent-module.netlify.com/guide/writing/#async-components). Nuxtent позволяет вам использовать `Vue Component` внутри файлов Markdown. Этот подход будет похоже на подход статических сайтов (например, Jekyll), где вы создаёте свои записи блога в файлах Markdown. Nuxtent добавляет приятную интеграцию между Vue.js и Markdown, позволяя вам полностью быть в мире Vue.js.

## Итоги

И это всё! Теперь у вас есть полностью функциональный блог, управляемый CMS, работающий в вашем приложении. Мы надеемся, что это руководство было полезным и сделало ваш опыт разработки на Vue.js ещё приятнее :)
