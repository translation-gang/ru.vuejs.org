---
type: style-guide
---

# Рекомендации <sup class="beta">beta</sup>

Это официальное руководство по стилю для Vue-специфичного кода. Если вы используете Vue в проекте, это отличная возможность избежать ошибок и анти-паттернов. Однако мы не считаем, что любое руководство по стилю идеально подходит для всех команд или проектов, поэтому разумные отклонения от них поощряются на основе полученного опыта, окружающего технологического стека и личных ценностей.

В большинстве случаев мы также будем избегать общих рекомендаций о JavaScript или HTML. Мы не против, используете ли вы точки с запятой или висящие запятые. Мы не против, используются ли в вашем HTML одинарные или двойные кавычки для значений атрибутов. Однако некоторые исключения будут присутствовать, в тех случаях где мы нашли конкретный шаблон полезным в контексте Vue.

> **Скоро мы предоставим рекомендации по соблюдению единого стиля кода.** Иногда вам просто нужно быть дисциплинированным, но там где это возможно мы постараемся показать, как можно использовать ESLint и другие автоматизированные процессы, чтобы упростить соблюдение единого стиля.

Наконец, мы разделили правила на четыре категории:

## Категории правил

### Приоритет A: Важно

Эти правила помогут предотвратить ошибки, поэтому изучите и соблюдайте их любой ценой. Исключения могут быть, но должны быть очень редкими и должны выполняться только теми, у кого есть хорошие знания как JavaScript, так и Vue.

### Приоритет B: Настоятельно рекомендуется

Эти правила помогут улучшить читаемость и/или опыт разработки в большинстве проектов. Ваш код всё равно будет работать, если вы нарушите их, но нарушения должны быть редкими и обоснованными.

### Приоритет C: Рекомендуется

Где существует множество одинаково хороших вариантов, можно сделать собственный выбор для обеспечения консистентности. В этих правилах мы описываем каждый приемлемый вариант и предлагаем выбор по умолчанию. Это означает что вы можете свободно делать другой выбор в вашей собственной кодовой базе, если вы придерживаетесь консистентности и имеете вескую причину. Пожалуйста, не стесняйтесь! Приспосабливаясь к стандартам сообщества, вы будете:

1. тренировать свой мозг, чтобы легче разбираться в большинстве кода сообщества, с которым придётся столкнуться
2. иметь возможность копировать и использовать большинство примеров кода сообщества без изменений
3. чаще находить новых сотрудников, уже знакомых с предпочитаемым стилем кода, по крайней мере, в отношении Vue

### Приоритет D: Используйте с осторожностью

Некоторые возможности Vue существуют для приспосабливания к редким граничным случаям или для обеспечения более плавной мигнации старой кодовой базы. Однако при чрезмерном использовании они сделают ваш код более сложным в поддержке или могут стать источником багов. Эти правила освещают потенциально опасные функции, объясняя когда и почему их следует избегать.



## Правила приоритета A: Важно (Предотвращение ошибок)



### Имена компонентов из нескольких слов <sup data-p="a">важно</sup>

**Имена компонентов должны всегда состоять из нескольких слов, за исключением корневого компонента `App`.**

Это [предотвращает конфликты](http://w3c.github.io/webcomponents/spec/custom/#valid-custom-element-name) с существующими или будущими HTML-элементами, поскольку все HTML-элементы именуются одним словом.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

``` js
Vue.component('todo', {
  // ...
})
```

``` js
export default {
  name: 'Todo',
  // ...
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

``` js
Vue.component('todo-item', {
  // ...
})
```

``` js
export default {
  name: 'TodoItem',
  // ...
}
```
{% raw %}</div>{% endraw %}



### Данные компонента <sup data-p="a">важно</sup>

**Свойство `data` компонента должно быть функцией.**

При использовании свойства `data` в компоненте (т.е. везде, за исключением `new Vue`), значением всегда должна быть функция, возвращающая объект.

{% raw %}
<details>
<summary>
  <h4>Подробное объяснение</h4>
</summary>
{% endraw %}

Когда значением `data` будет объект, он будет использован для всех экземпляров компонента. Представьте например компонент `TodoList` с таким набором данных:

``` js
data: {
  listTitle: '',
  todos: []
}
```

Мы можем захотеть повторно использовать этот компонент, позволяя пользователям использовать несколько списков (например для покупок, списков желаний, ежедневных дел и т.п.). Однако есть проблема. Поскольку каждый экземпляр компонента ссылается на один и тот же объект данных, изменение названия одного списка также изменит заголовок всех остальных списков. То же самое случится и при добавлении/изменении/удалении элемента списка.

Вместо этого мы хотим, чтобы каждый экземпляр компонента управлял только своими собственными данными. Чтобы этого добавиться, каждый экземпляр должен сгенерировать собственный уникальный объект данных. В JavaScript этого возможно достигнуть возвращая объект из функции:

``` js
data: function () {
  return {
    listTitle: '',
    todos: []
  }
}
```
{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

``` js
Vue.component('some-comp', {
  data: {
    foo: 'bar'
  }
})
```

``` js
export default {
  data: {
    foo: 'bar'
  }
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо
``` js
Vue.component('some-comp', {
  data: function () {
    return {
      foo: 'bar'
    }
  }
})
```

``` js
// В .vue-файле
export default {
  data () {
    return {
      foo: 'bar'
    }
  }
}
```

``` js
// Допускается использовать объект напрямую
// в корневом экземпляре Vue, поскольку только
// один экземпляр будет существовать.
new Vue({
  data: {
    foo: 'bar'
  }
})
```
{% raw %}</div>{% endraw %}



### Определение входных параметров <sup data-p="a">важно</sup>

**Входные параметры должны быть определены как можно более подробно.**

В готовом коде определение входных параметров всегда должно быть максимально подробным, по крайней мере определяя тип данных.

{% raw %}
<details>
<summary>
  <h4>Подробное объяснение</h4>
</summary>
{% endraw %}

Подробное [определение входных параметров](https://ru.vuejs.org/v2/guide/components.html#Валидация-входных-параметров) имеет два преимущества:

- Документирование API компонента, что позволит легко понимать как этот компонент должен использоваться.
- При разработке, Vue будет предупреждать вас, если компоненту были переданы входные параметры неправильного формата, позволяя вам отловить и исправить потенциальные источники ошибок.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

``` js
// Этого достаточно лишь для прототипа
props: ['status']
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

``` js
props: {
  status: String
}
```

``` js
// Ещё лучше!
props: {
  status: {
    type: String,
    required: true,
    validator: function (value) {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].indexOf(value) !== -1
    }
  }
}
```
{% raw %}</div>{% endraw %}



### Уникальные ключи для `v-for` <sup data-p="a">важно</sup>

**Всегда используйте `key` с `v-for`.**

`key` с `v-for` _всегда_ обязателен для компонентов, для поддержания внутреннего состояния компонента и его поддерева. Даже для элементов это хорошая практика для поддержания предсказуемого поведения, такого как [консистентности объекта](https://bost.ocks.org/mike/constancy/) в анимации.

{% raw %}
<details>
<summary>
  <h4>Подробное объяснение</h4>
</summary>
{% endraw %}

Представим, что у нас есть список различных todo:

``` js
data: function () {
  return {
    todos: [
      {
        id: 1,
        text: 'Изучить как использовать v-for'
      },
      {
        id: 2,
        text: 'Изучить как использовать key'
      }
    ]
  }
}
```

Затем вы сортируете их по алфавиту. При обновлении DOM, Vue будет оптимизировать рендеринг для выполнения самых дешёвых изменений DOM. Это может означать удаление первого элемента списка, а затем добавление его снова в конце списка.

Проблема в том, что бывают случаи, когда важно не удалять элементы, которые останутся в DOM. Например, вы можете использовать `<transition-group>` для анимации сортировки списка, или удержании фокуса, если отображаемый элемент является `<input>`. В этих случаях добавление уникального ключа для каждого элемента (например, `:key="todo.id"`) поскажет Vue, как вести себя более предсказуемо.

По нашему опыту, лучше _всегда_ добавлять уникальный ключ, чтобы вам и вашей команде никогда не приходилось беспокоиться об этих крайних случаях. Затем в редких, критически-зависимых от производительности, случаях, когда консистентность объекта не требуется — вы можете сделать сознательное исключение.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

``` html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

``` html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```
{% raw %}</div>{% endraw %}



### Локальные стили компонента <sup data-p="a">важно</sup>

**Для приложений стили в корневом компоненте `App` и в компонентах шаблона могут быть глобальными, но во всех остальных компонентах должны быть локальными.**

Это относится только к [однофайловым компонентам](../guide/single-file-components.html). Это _не требует_ использования [атрибута `scoped`](https://vue-loader.vuejs.org/ru/features/scoped-css.html). Область действия стилей может ограничиваться через [CSS-модули](https://vue-loader.vuejs.org/ru/features/css-modules.html), стратегию на основе именования классов, такой как [БЭМ](http://getbem.com/), или другой библиотекой/соглашением.

**Библиотеки компонентов, однако, должны предпочитать использовать стратегию на основе именования классов, вместо использования атрибута `scoped`.**

Это упрощает переопределение внутренних стилей, с использованием читаемых названий классов, которые не имеют слишком высокой специфичности, но всё же вряд ли приведут к конфликту.

{% raw %}
<details>
<summary>
  <h4>Подробное объяснение</h4>
</summary>
{% endraw %}

Если вы разрабатываете большой проект, работая совместно с другими разработчиками, или иногда используете сторонний HTML/CSS (например, от Auth0), консистентное ограничение действия позволит гарантировать, что ваши стили применяются только к компонентам, для которых они предназначены.

Помимо атрибута `scoped`, использование уникальных имён классов может помочь гарантировать, что сторонний CSS не применяется к вашему собственному HTML. Например, многие проекты используют классы `button`, `btn`, или `icon`, поэтому даже если вы не используете стратегию, такую как БЭМ, то добавление префикса приложения и/или компонента (например, `ButtonClose-icon`) может обеспечить некоторую защиту.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

``` html
<template>
  <button class="btn btn-close">X</button>
</template>

<style>
.btn-close {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

``` html
<template>
  <button class="button button-close">X</button>
</template>

<!-- Использование атрибута `scoped` -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

``` html
<template>
  <button :class="[$style.button, $style.buttonClose]">X</button>
</template>

<!-- Использование CSS-модулей -->
<style module>
.button {
  border: none;
  border-radius: 2px;
}

.buttonClose {
  background-color: red;
}
</style>
```

``` html
<template>
  <button class="c-Button c-Button--close">X</button>
</template>

<!-- Использование методологии БЭМ -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}



### Именование приватных свойств <sup data-p="a">важно</sup>

**Всегда используйте префикс `$_` для пользовательских приватных свойств в плагине, примеси, и т.п. Затем, чтобы избежать конфликтов с кодом других авторов, также включайте именованную область (например, `$_yourPluginName_`).**

{% raw %}
<details>
<summary>
  <h4>Подробное объяснение</h4>
</summary>
{% endraw %}

Vue использует префикс `_` для определения собственных приватных свойств, поэтому использование одного и того же префикса (например, `_update`) может привести к перезаписи свойства экземпляра. Даже если вы проверяете и Vue в настоящее время не использует определённое имя свойства, нет гарантий, что конфликт не возникнет в более поздних версиях.

Что касается префикса `$`, то в рамках экосистемы Vue это специальные свойства экземпляра, которые публично доступны пользователю, поэтому использование его для _приватных_ свойств было бы нецелесообразным.

Вместо этого мы рекомендуем комбинировать два префикса в `$_`, как соглашение для пользовательских приватных свойств, которые гарантируют отсутствие конфликтов с Vue.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

``` js
var myGreatMixin = {
  // ...
  methods: {
    update: function () {
      // ...
    }
  }
}
```

``` js
var myGreatMixin = {
  // ...
  methods: {
    _update: function () {
      // ...
    }
  }
}
```

``` js
var myGreatMixin = {
  // ...
  methods: {
    $update: function () {
      // ...
    }
  }
}
```

``` js
var myGreatMixin = {
  // ...
  methods: {
    $_update: function () {
      // ...
    }
  }
}
```

{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

``` js
var myGreatMixin = {
  // ...
  methods: {
    $_myGreatMixin_update: function () {
      // ...
    }
  }
}
```
{% raw %}</div>{% endraw %}



## Правила приоритета B: Настоятельно рекомендуется (Улучшение читаемости)



### Файлы компонентов <sup data-p="b">настоятельно рекомендуется</sup>

**Всякий раз, когда система сборки позволяет конкатенировать файлы, каждый компонент должен быть в собственном файле.**

Это поможет вам быстрее найти компонент, когда потребуется его отредактировать или просмотреть как его использовать.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

``` js
Vue.component('TodoList', {
  // ...
})

Vue.component('TodoItem', {
  // ...
})
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

```
components/
|- TodoList.js
|- TodoItem.js
```

```
components/
|- TodoList.vue
|- TodoItem.vue
```
{% raw %}</div>{% endraw %}



### Именование однофайловых компонентов <sup data-p="b">настоятельно рекомендуется</sup>

**Имена файлов [однофайловых компонентов](../guide/single-file-components.html) должны быть всегда в PascalCase или всегда в kebab-case.**

PascalCase лучше всего работает с автодополнением в редакторах кода, поскольку он согласуется с тем, как мы ссылаемся на компоненты в JS(X) и шаблонах. Тем не менее, смешанные имена файлов иногда могут создавать проблемы для нечувствительных к регистру файловых систем, поэтому kebab-case также вполне приемлем.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

```
components/
|- mycomponent.vue
```

```
components/
|- myComponent.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```
{% raw %}</div>{% endraw %}



### Именование базовых компонентов <sup data-p="b">настоятельно рекомендуется</sup>

**Базовые компоненты (известные как презентационные, тупые или чистые компоненты) которые применяют специфичные для вашего приложения стили или соглашения должны начинаться с определённого префикса, такого как `Base`, `App`, или `V`.**

{% raw %}
<details>
<summary>
  <h4>Подробное объяснение</h4>
</summary>
{% endraw %}

Эти компоненты закладывают основу для консистентности стилей и поведения в вашем приложении. Они могут содержать **только**:

- HTML-элементы,
- другие компоненты с `Base`-префиксом
- сторонние UI-компоненты.

Но они **никогда** не содержат глобальное состояние (например из хранилища Vuex).

Их имена зачастую содержат название элемента, который они оборачивают (например, `BaseButton`, `BaseTable`), если не существует элемента для этих конкретных целей (например, `BaseIcon`). Если вы создадите похожие компоненты для более специфичного контекста, они почти всегда будут поглощать эти компоненты (например `BaseButton` может использоваться в `ButtonSubmit`).

Некоторые преимущества этого соглашения:

- Когда они организованы в алфавитном порядке в редакторе, базовые компоненты вашего приложения будут перечислены вместе, что упрощает их идентификацию.

- Поскольку имена компонентов всегда должны состоять из нескольких слов, это соглашение запрещает вам выбирать произвольный префикс для простых компонентов-обёрток (например, `MyButton`, `VueButton`).

- Поскольку эти компоненты часто используются, вы можете просто сделать их глобальными, а не импортировать их повсюду. Префикс делает это возможным с помощью Webpack:

  ``` js
  var requireComponent = require.context("./src", true, /^Base[A-Z]/)
  requireComponent.keys().forEach(function (fileName) {
    var baseComponentConfig = requireComponent(fileName)
    baseComponentConfig = baseComponentConfig.default || baseComponentConfig
    var baseComponentName = baseComponentConfig.name || (
      fileName
        .replace(/^.+\//, '')
        .replace(/\.\w+$/, '')
    )
    Vue.component(baseComponentName, baseComponentConfig)
  })
  ```

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
```

```
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```

```
components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue
```
{% raw %}</div>{% endraw %}



### Именование компонентов, используемых в 1 экземпляре <sup data-p="b">настоятельно рекомендуется</sup>

**Компоненты, которые должны иметь только один активный экземпляр, должны начинаться с префикса `The`, обозначая что может быть только один.**

Это не означает, что компонент используется только на одной странице, но означает что он будет использоваться только один раз _на странице_. Эти компоненты никогда не принимают каких-либо входных параметров, поскольку они специфичны для вашего приложения, а не их контекста в вашем приложении. Если вы обнаружите необходимость добавления входных параметров, это хороший признак того, что на самом деле этот компонент для многократного использования, который используется только один раз на странице _в данный момент_.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

```
components/
|- Heading.vue
|- MySidebar.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

```
components/
|- TheHeading.vue
|- TheSidebar.vue
```
{% raw %}</div>{% endraw %}



### Именование тесно связанных компонентов <sup data-p="b">настоятельно рекомендуется</sup>

**Дочерние компоненты, тесно связанные с родителями, должны включать имя родительского компонента в качестве префикса.**

Если компонент имеет смысл только в контексте одного родительского компонента, то это отношение должно быть очевидным в его имени. Поскольку редакторы обычно упорядочивают файлы по алфавиту, это также расположит связанные файлы друг с другом.

{% raw %}
<details>
<summary>
  <h4>Подробное объяснение</h4>
</summary>
{% endraw %}

Возможно вы захотите решить эту проблему, вложив дочерние компоненты в каталоги, названные в честь их родителя. Например:

```
components/
|- TodoList/
   |- Item/
      |- index.vue
      |- Button.vue
   |- index.vue
```

или:

```
components/
|- TodoList/
   |- Item/
      |- Button.vue
   |- Item.vue
|- TodoList.vue
```

Это не рекомендуется, так как это приводит к:

- Множеству файлов с похожими именами, что затрудняет быстрое переключение между файлами в редакторе кода.
- Множеству под-каталогов, что увеличивает время необходимое на изучение списка компонентов в боковой панели редактора.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

```
components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

```
components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```
{% raw %}</div>{% endraw %}



### Порядок слов в именах компонентов <sup data-p="b">настоятельно рекомендуется</sup>

**Компоненты должны именоваться начиная от высшего уровня (часто наиболее общих слов) и заканчиваться описательными дополняющими словами.**

{% raw %}
<details>
<summary>
  <h4>Подробное объяснение</h4>
</summary>
{% endraw %}

Вам может быть интересным:

> "Почему мы заставляем называть компоненты менее естественным языком?"

На естественном английском, прилагательные и другие дескрипторы обычно располагаются перед существительными, в то время как исключения требуют слов-соединителей. Например:

- Coffee _with_ milk
- Soup _of the_ day
- Visitor _to the_ museum

Вы определённо можете включать эти слова-соединители в именах компонентах если хотите, но порядок всё ещё важен.

Также обратите внимание, **то что считается "высоким уровнем" будет относиться к вашему приложению**. Например, представьте приложение с формой для поиска. Оно может содержать компоненты наподобие таких:

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

Как вы могли заметить, довольно сложно понять, какие из компонентов относятся к поиску. Давайте теперь переименуем компоненты в соответствии с правилом:

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

Поскольку редакторы обычно упорядочивают файлы по алфавиту, все важные отношения между компонентами теперь очевидны с первого взгляда.

Возможно вы захотите решить эту проблему по-другому, переместив все компоненты поиска в отдельный каталог "search", а потом все компоненты параметров в каталог "settings". Мы рекомендуем применять этот подход только в очень больши приложениях (например, из более 100 компонентов) по следующим причинам:

- Обычно требуется больше времени для навигации по вложенным подкаталогам, чем прокрутка одного каталога `components`.
- Конфликты имён (например многочисленные компоненты `ButtonDelete.vue`) затрудняют быстрый переход к определённому компоненту в редакторе кода.
- Рефакторинг становится более сложным, потому что поиска с заменой будет недостаточно, чтобы обновить относительные ссылки на перемещённый компонент.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```
{% raw %}</div>{% endraw %}



### Самозакрывающиеся теги компонентов <sup data-p="b">настоятельно рекомендуется</sup>

**Компоненты без содержимого должны быть самозакрывающимися тегами в [однофайловых компонентах](../guide/single-file-components.html), строковых шаблонах, и [JSX](../guide/render-function.html#JSX) — но никогда в DOM-шаблонах.**

Самозакрывающиеся теги компонетов сообщают, что у них не только нет содержимого, но и **сообщает** что и не должны иметь содержимого. Это разница между пустой страницей в книге и страницей с надписью "Эта страница намеренно оставлена пустой". Ваш код также станет более лаконичным без ненужного закрывающего тега.

К сожалению, HTML не разрешает пользовательским элементам быть самозакрывающимися — только [официальные "void" элементы](https://www.w3.org/TR/html/syntax.html#void-elements). Вот почему эта стратегия возможно тольок тогда, когда компилятор шаблонов Vue может достичь шаблона перед DOM, а затем предоставить DOM-совместимый HTML.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

``` html
<!-- В однофайловых компонентах, строковых шаблонах и JSX -->
<MyComponent></MyComponent>
```

``` html
<!-- В DOM-шаблонах -->
<my-component/>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

``` html
<!-- В однофайловых компонентах, строковых шаблонах и JSX -->
<MyComponent/>
```

``` html
<!-- В DOM-шаблонах -->
<my-component></my-component>
```
{% raw %}</div>{% endraw %}



### Стиль именования компонентов в шаблонах <sup data-p="b">настоятельно рекомендуется</sup>

**В большинстве проектов имена компонентов всегда должны быть в PascalCase в [однофайловых компонентах](../guide/single-file-components.html) и строковых шаблонах — но в kebab-case в DOM-шаблонах.**

PascalCase имеет следующие преимущества перед kebab-case:

- Редакторы могут автодополнять имена компонентов в шаблонах, потому что PascalCase также используется в JavaScript.
- `<MyComponent>` лучше отличим визуально от элемента HTML из одного слова, нежели `<my-component>`, потому что есть две заметных разницы в символах (две заглавных), а не только одна (дефис).
- Если вы используете какие-либо пользовательские элементы, не связанные с Vue, в ваших шаблонах, например веб-компонент, PascalCase гарантирует, что ваши компоненты Vue остаются отчётливо видимыми.

К сожалению, из-за нечувствительности HTML к регистру, DOM-шаблоны должны по-прежнему использовать kebab-case.

Также обратите внимание, что если вы уже вложили значительные силы в kebab-case, консистентность с соглашениями HTML и возможность использования такого же написания во всех ваших проектах, то это может быть более важным, чем преимущества перечисленные выше. В этих случаях **допускается использовать kebab-case повсюду.**

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

``` html
<!-- В однофайловых компонентах и строковых шаблонах -->
<mycomponent/>
```

``` html
<!-- В однофайловых компонентах и строковых шаблонах -->
<myComponent/>
```

``` html
<!-- В DOM-шаблонах -->
<MyComponent></MyComponent>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

``` html
<!-- В однофайловых компонентах и строковых шаблонах -->
<MyComponent/>
```

``` html
<!-- В DOM-шаблонах -->
<my-component></my-component>
```

ИЛИ

``` html
<!-- Везде -->
<my-component></my-component>
```
{% raw %}</div>{% endraw %}



### Стиль именования компонентов в JS/JSX <sup data-p="b">настоятельно рекомендуется</sup>

**Стиль именования компонентов в JS/[JSX](../guide/render-function.html#JSX) всегда должен быть PascalCase, хотя возможно использовать kebab-case внутри строк для простых приложений, которые используют только глобальную регистрацию компонентов через `Vue.component`.**

{% raw %}
<details>
<summary>
  <h4>Подробное объяснение</h4>
</summary>
{% endraw %}

In JavaScript, PascalCase is the convention for classes and prototype constructors - essentially, anything that can have distinct instances. Vue components also have instances, so it makes sense to also use PascalCase. As an added benefit, using PascalCase within JSX (and templates) allows readers of the code to more easily distinguish between components and HTML elements.

However, for applications that use **only** global component definitions via `Vue.component`, we recommend kebab-case instead. The reasons are:

- It's rare that global components are ever referenced in JavaScript, so following a convention for JavaScript makes less sense.
- These applications always include many in-DOM templates, where [kebab-case **must** be used](#Component-name-casing-in-templates-strongly-recommended).
{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

``` js
Vue.component('myComponent', {
  // ...
})
```

``` js
import myComponent from './MyComponent.vue'
```

``` js
export default {
  name: 'myComponent',
  // ...
}
```

``` js
export default {
  name: 'my-component',
  // ...
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

``` js
Vue.component('MyComponent', {
  // ...
})
```

``` js
Vue.component('my-component', {
  // ...
})
```

``` js
import MyComponent from './MyComponent.vue'
```

``` js
export default {
  name: 'MyComponent',
  // ...
}
```
{% raw %}</div>{% endraw %}



### Full-word component names <sup data-p="b">настоятельно рекомендуется</sup>

**Component names should prefer full words over abbreviations.**

The autocompletion in editors make the cost of writing longer names very low, while the clarity they provide is invaluable. Uncommon abbreviations, in particular, should always be avoided.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

```
components/
|- SdSettings.vue
|- UProfOpts.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```
{% raw %}</div>{% endraw %}



### Prop name casing <sup data-p="b">настоятельно рекомендуется</sup>

**Prop names should always use camelCase during declaration, but kebab-case in templates and [JSX](../guide/render-function.html#JSX).**

We're simply following the conventions of each language. Within JavaScript, camelCase is more natural. Within HTML, kebab-case is.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

``` js
props: {
  'greeting-text': String
}
```

``` html
<WelcomeMessage greetingText="hi"/>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

``` js
props: {
  greetingText: String
}
```

``` html
<WelcomeMessage greeting-text="hi"/>
```
{% raw %}</div>{% endraw %}



### Multi-attribute elements <sup data-p="b">настоятельно рекомендуется</sup>

**Elements with multiple attributes should span multiple lines, with one attribute per line.**

In JavaScript, splitting objects with multiple properties over multiple lines is widely considered a good convention, because it's much easier to read. Our templates and [JSX](../guide/render-function.html#JSX) deserve the same consideration.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

``` html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

``` html
<MyComponent foo="a" bar="b" baz="c"/>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

``` html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
```

``` html
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```
{% raw %}</div>{% endraw %}



### Simple expressions in templates <sup data-p="b">настоятельно рекомендуется</sup>

**Component templates should only include simple expressions, with more complex expressions refactored into computed properties or methods.**

Complex expressions in your templates make them less declarative. We should strive to describe _what_ should appear, not _how_ we're computing that value. Computed properties and methods also allow the code to be reused.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

``` html
{{
  fullName.split(' ').map(function (word) {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

``` html
<!-- In a template -->
{{ normalizedFullName }}
```

``` js
// The complex expression has been moved to a computed property
computed: {
  normalizedFullName: function () {
    return this.fullName.split(' ').map(function (word) {
      return word[0].toUpperCase() + word.slice(1)
    }).join(' ')
  }
}
```
{% raw %}</div>{% endraw %}



### Simple computed properties <sup data-p="b">настоятельно рекомендуется</sup>

**Complex computed properties should be split into as many simpler properties as possible.**

{% raw %}
<details>
<summary>
  <h4>Подробное объяснение</h4>
</summary>
{% endraw %}

Simpler, well-named computed properties are:

- __Easier to test__

  When each computed property contains only a very simple expression, with very few dependencies, it's much easier to write tests confirming that it works correctly.

- __Easier to read__

  Simplifying computed properties forces you to give each value a descriptive name, even if it's not reused. This makes it much easier for other developers (and future you) to focus in on the code they care about and figure out what's going on.

- __More adaptable to changing requirements__

  Any value that can be named might be useful to the view. For example, we might decide to display a message telling the user how much money they saved. We might also decide to calculate sales tax, but perhaps display it separately, rather than as part of the final price.

  Small, focused computed properties make fewer assumptions about how information will be used, so require less refactoring as requirements change.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

``` js
computed: {
  price: function () {
    var basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

``` js
computed: {
  basePrice: function () {
    return this.manufactureCost / (1 - this.profitMargin)
  },
  discount: function () {
    return this.basePrice * (this.discountPercent || 0)
  },
  finalPrice: function () {
    return this.basePrice - this.discount
  }
}
```
{% raw %}</div>{% endraw %}



### Quoted attribute values <sup data-p="b">настоятельно рекомендуется</sup>

**Non-empty HTML attribute values should always be inside quotes (single or double, whichever is not used in JS).**

While attribute values without any spaces are not required to have quotes in HTML, this practice often leads to _avoiding_ spaces, making attribute values less readable.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

``` html
<input type=text>
```

``` html
<AppSidebar :style={width:sidebarWidth+'px'}>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

``` html
<input type="text">
```

``` html
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```
{% raw %}</div>{% endraw %}



### Directive shorthands <sup data-p="b">настоятельно рекомендуется</sup>

**Directive shorthands (`:` for `v-bind:` and `@` for `v-on:`) should be used always or never.**

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

``` html
<input
  v-bind:value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

``` html
<input
  v-on:input="onInput"
  @focus="onFocus"
>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

``` html
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

``` html
<input
  v-bind:value="newTodoText"
  v-bind:placeholder="newTodoInstructions"
>
```

``` html
<input
  @input="onInput"
  @focus="onFocus"
>
```

``` html
<input
  v-on:input="onInput"
  v-on:focus="onFocus"
>
```
{% raw %}</div>{% endraw %}



## Правила приоритета C: Рекомендуется (Минимизация произвольных выборов и накладных расходов)



### Порядок опций компонента/экземпляра <sup data-p="c">рекомендуется</sup>

**Опции компонента/экземпляра должны быть упорядочены консистентно.**

Это порядок по умолчанию, который мы рекомендуем для опций компонентов. Они разделены на категории, поэтому вы поймёте, где добавлять новые свойства из плагинов.

1. **Побочные эффекты** (вызывает эффекты вне компонента)
  - `el`

2. **Глобальная осведомлённость** (требует знаний вне компонента)
  - `name`
  - `parent`

3. **Тип компонента** (изменяет тип компонента)
  - `functional`

4. **Модификаторы шаблона** (изменение способа компиляции шаблонов)
  - `delimiters`
  - `comments`

5. **Зависимости шаблона** (ресурсы используемые в шаблоне)
  - `components`
  - `directives`
  - `filters`

6. **Композиция** (объединение свойств в опциях)
  - `extends`
  - `mixins`

7. **Интерфейс** (интерфейс компонента)
  - `inheritAttrs`
  - `model`
  - `props`/`propsData`

8. **Локальное состояние** (локальные реактивные свойства)
  - `data`
  - `computed`

9. **События** (коллбэки вызываемые реактивными событиями)
  - `watch`
  - События хуков жизненного цикла (в порядке их вызова)

10. **Нереактивные свойства** (свойства экземпляра независимые от системы реактивности)
  - `methods`

11. **Рендеринг** (декларативное описание вывода компонента)
  - `template`/`render`
  - `renderError`



### Порядок атрибутов элемента <sup data-p="c">рекомендуется</sup>

**Атрибуты элементов (в том числе компонентов) должны быть упорядочены консистентно.**

Этот порядок по умолчанию мы рекомендуем для опций компонентов. Они разделены на категории, поэтому вы узнаете, где добавлять пользовательские атрибуты и директивы.

1. **Definition** (provides the component options)
  - `is`

2. **List Rendering** (creates multiple variations of the same element)
  - `v-for`

2. **Conditionals** (whether the element is rendered/shown)
  - `v-if`
  - `v-else-if`
  - `v-else`
  - `v-show`
  - `v-cloak`

3. **Render Modifiers** (changes the way the element renders)
  - `v-pre`
  - `v-once`

4. **Global Awareness** (requires knowledge beyond the component)
  - `id`

5. **Unique Attributes** (attributes that require unique values)
  - `ref`
  - `key`
  - `slot`

6. **Two-Way Binding** (combining binding and events)
  - `v-model`

7. **Other Attributes** (all unspecified bound & unbound attributes)

8. **Events** (component event listeners)
  - `v-on`

9. **Content** (overrides the content of the element)
  - `v-html`
  - `v-text`



### Empty lines in component/instance options <sup data-p="c">рекомендуется</sup>

**You may want to add one empty line between multi-line properties, particularly if the options can no longer fit on your screen without scrolling.**

When components begin to feel cramped or difficult to read, adding spaces between multi-line properties can make them easier to skim again. In some editors, such as Vim, formatting options like this can also make them easier to navigate with the keyboard.

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

``` js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formattedValue: function () {
    // ...
  },

  inputClasses: function () {
    // ...
  }
}
```

``` js
// No spaces are also fine, as long as the component
// is still easy to read and navigate.
props: {
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
},
computed: {
  formattedValue: function () {
    // ...
  },
  inputClasses: function () {
    // ...
  }
}
```
{% raw %}</div>{% endraw %}



### Single-file component top-level element order <sup data-p="c">рекомендуется</sup>

**[Single-file components](../guide/single-file-components.html) should always order `template`, `script`, and `style` tags consistently, with `<style>` last, because at least one of the other two is always necessary.**

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

``` html
<style>/* ... */</style>
<template>...</template>
<script>/* ... */</script>
```

``` html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

``` html
<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

``` html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```
{% raw %}</div>{% endraw %}



## Правила приоритета D: Используйте с осторожностью (Потенциально опасные паттерны)



### `v-if`/`v-if-else`/`v-else` without `key` <sup data-p="d">используйте с осторожностью</sup>

**It's usually best to use `key` with `v-if` + `v-else`, if they are the same element type (e.g. both `<div>` elements).**

By default, Vue updates the DOM as efficiently as possible. That means when switching between elements of the same type, it simply patches the existing element, rather than removing it and adding a new one in its place. This can have [unintended side effects](https://jsfiddle.net/chrisvfritz/bh8fLeds/) if these elements should not actually be considered the same.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

``` html
<div v-if="error">
  Error: {{ error }}
</div>
<div v-else>
  {{ results }}
</div>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

``` html
<div v-if="error" key="search-status">
  Error: {{ error }}
</div>
<div v-else key="search-results">
  {{ results }}
</div>
```

``` html
<p v-if="error">
  Error: {{ error }}
</p>
<div v-else>
  {{ results }}
</div>
```
{% raw %}</div>{% endraw %}



### Element selectors with `scoped` <sup data-p="d">используйте с осторожностью</sup>

**Element selectors should be avoided with `scoped`.**

Prefer class selectors over element selectors in `scoped` styles, because large numbers of element selectors are slow.

{% raw %}
<details>
<summary>
  <h4>Подробное объяснение</h4>
</summary>
{% endraw %}

To scope styles, Vue adds a unique attribute to component elements, such as `data-v-f3f3eg9`. Then selectors are modified so that only matching elements with this attribute are selected (e.g. `button[data-v-f3f3eg9]`).

The problem is that large numbers of [element-attribute selectors](http://stevesouders.com/efws/css-selectors/csscreate.php?n=1000&sel=a%5Bhref%5D&body=background%3A+%23CFD&ne=1000) (e.g. `button[data-v-f3f3eg9]`) will be considerably slower than [class-attribute selectors](http://stevesouders.com/efws/css-selectors/csscreate.php?n=1000&sel=.class%5Bhref%5D&body=background%3A+%23CFD&ne=1000) (e.g. `.btn-close[data-v-f3f3eg9]`), so class selectors should be preferred whenever possible.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

``` html
<template>
  <button>X</button>
</template>

<style scoped>
button {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

``` html
<template>
  <button class="btn btn-close">X</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}



### Implicit parent-child communication <sup data-p="d">используйте с осторожностью</sup>

**Props and events should be preferred for parent-child component communication, instead of `this.$parent` or mutating props.**

An ideal Vue application is props down, events up. Sticking to this convention makes your components much easier to understand. However, there are edge cases where prop mutation or `this.$parent` can simplify two components that are already deeply coupled.

The problem is, there are also many _simple_ cases where these patterns may offer convenience. Beware: do not be seduced into trading simplicity (being able to understand the flow of your state) for short-term convenience (writing less code).

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  template: '<input v-model="todo.text">'
})
```

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeTodo () {
      var vm = this
      vm.$parent.todos = vm.$parent.todos.filter(function (todo) {
        return todo.id !== vm.todo.id
      })
    }
  },
  template: `
    <span>
      {{ todo.text }}
      <button @click="removeTodo">
        X
      </button>
    </span>
  `
})
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  template: `
    <span>
      {{ todo.text }}
      <button @click="$emit('delete')">
        X
      </button>
    </span>
  `
})
```
{% raw %}</div>{% endraw %}



### Non-flux state management <sup data-p="d">используйте с осторожностью</sup>

**[Vuex](https://github.com/vuejs/vuex) should be preferred for global state management, instead of `this.$root` or a global event bus.**

Managing state on `this.$root` and/or using a [global event bus](https://vuejs.org/v2/guide/migration.html#dispatch-and-broadcast-replaced) can be convenient for very simple cases, but are not appropriate for most applications. Vuex offers not only a central place to manage state, but also tools for organizing, tracking, and debugging state changes.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Плохо

``` js
// main.js
new Vue({
  data: {
    todos: []
  },
  created: function () {
    this.$on('remove-todo', this.removeTodo)
  },
  methods: {
    removeTodo: function (todo) {
      var todoIdToRemove = todo.id
      this.todos = this.todos.filter(function (todo) {
        return todo.id !== todoIdToRemove
      })
    }
  }
})
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Хорошо

``` js
// store/modules/todos.js
export default {
  state: {
    list: []
  },
  mutations: {
    REMOVE_TODO (state, todoId) {
      state.list = state.list.filter(todo => todo.id !== todoId)
    }
  },
  actions: {
    removeTodo ({ commit, state }, todo) {
      commit('REMOVE_TODO', todo.id)
    }
  }
}
```

``` html
<!-- TodoItem.vue -->
<template>
  <span>
    {{ todo.text }}
    <button @click="removeTodo(todo)">
      X
    </button>
  </span>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  methods: mapActions(['removeTodo'])
}
</script>
```
{% raw %}</div>{% endraw %}



{% raw %}
<script>
(function () {
  var enforcementTypes = {
    none: '<span title="There is unfortunately no way to automatically enforce this rule.">self-discipline</span>',
    runtime: 'runtime error',
    linter: '<a href="https://github.com/vuejs/eslint-plugin-vue#eslint-plugin-vue" target="_blank">plugin:vue/recommended</a>'
  }
  Vue.component('sg-enforcement', {
    template: '\
      <span>\
        <strong>Enforcement</strong>:\
        <span class="style-rule-tag" v-html="humanType"/>\
      </span>\
    ',
    props: {
      type: {
        type: String,
        required: true,
        validate: function (value) {
          Object.keys(enforcementTypes).indexOf(value) !== -1
        }
      }
    },
    computed: {
      humanType: function () {
        return enforcementTypes[this.type]
      }
    }
  })

  // new Vue({
  //  el: '#main'
  // })
})()
</script>
{% endraw %}
