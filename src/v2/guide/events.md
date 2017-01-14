---
title: Обработка событий
type: guide
order: 9
---

## Подписка на события

Чтобы подписаться на&nbsp;события DOM и&nbsp;выполнить JavaScript-код по&nbsp;их&nbsp;наступлении, примените директиву `v-on`.

Например:

``` html
<div id="example-1">
  <button v-on:click="counter += 1">+1</button>
  <p>Кнопка выше была нажата {{counter}} раз</p>
</div>
```
``` js
var example1 = new Vue({
  el: '#example-1',
  data: {
    counter: 0
  }
})
```

Результат:

{% raw %}
<div id="example-1" class="demo">
  <button v-on:click="counter += 1">+1</button>
  <p>Кнопка выше была нажата {{counter}} раз</p>
</div>
<script>
var example1 = new Vue({
  el: '#example-1',
  data: {
    counter: 0
  }
})
</script>
{% endraw %}

## Обработчики событий

Логика обработки события может быть довольно сложной, так что оставить весь JavaScript-код в&nbsp;значении атрибута `v-on` не&nbsp;всегда возможно. В&nbsp;этом случае `v-on` может принять и&nbsp;название метода, который вы&nbsp;хотите вызвать.

Например:

``` html
<div id="example-2">
  <!-- `greet` — это название метода, определённого ниже -->
  <button v-on:click="greet">Поприветствовать</button>
</div>
```

``` js
var example2 = new Vue({
  el: '#example-2',
  data: {
    name: 'Vue.js'
  },
  // определяйте методы в объекте `methods`
  methods: {
    greet: function (event) {
      // `this` внутри методов указывает на инстанс Vue
      alert('Привет, ' + this.name + '!')
      // `event` — нативное событие DOM
      alert(event.target.tagName)
    }
  }
})

// вызывать методы можно и императивно
example2.greet() // -> 'Привет, Vue.js!'
```

Результат:

{% raw %}
<div id="example-2" class="demo">
  <button v-on:click="greet">Поприветствовать</button>
</div>
<script>
var example2 = new Vue({
  el: '#example-2',
  data: {
    name: 'Vue.js'
  },
  methods: {
    greet: function (event) {
      alert('Привет, ' + this.name + '!')
      alert(event.target.tagName)
    }
  }
})
</script>
{% endraw %}

## Методы и inline-обработчики

Можно связаться с&nbsp;методом не&nbsp;по&nbsp;имени, а&nbsp;вызвав его в&nbsp;JavaScript-выражении:

``` html
<div id="example-3">
  <button v-on:click="say('hi')">Скажи hi</button>
  <button v-on:click="say('what')">Скажи what</button>
</div>
```
``` js
new Vue({
  el: '#example-3',
  methods: {
    say: function (message) {
      alert(message)
    }
  }
})
```

Результат:

{% raw %}
<div id="example-3" class="demo">
  <button v-on:click="say('hi')">Скажи hi</button>
  <button v-on:click="say('what')">Скажи what</button>
</div>
<script>
new Vue({
  el: '#example-3',
  methods: {
    say: function (message) {
      alert(message)
    }
  }
})
</script>
{% endraw %}

Иногда и&nbsp;в&nbsp;inline-обработчиках оказывается необходим доступ к&nbsp;оригинальному событию DOM. Его можно передать в&nbsp;метод, используя специальную переменную `$event`:

``` html
<button v-on:click="warn('Форма пока не может быть отправлена.', $event)">Отправить</button>
```

``` js
// ...
methods: {
  warn: function (message, event) {
    // теперь у нас есть доступ к нативному событию
    if (event) event.preventDefault()
    alert(message)
  }
}
```

## Модификаторы событий

Очень часто возникает необходимость вызвать `event.preventDefault()` или `event.stopPropagation()` в&nbsp;обработчике события. Хотя это легко можно сделать внутри метода, было&nbsp;бы лучше сохранить чистоту логики и&nbsp;абстрагироваться от&nbsp;деталей реализации событий DOM.

Для решения этой задачи Vue предлагает **модификаторы событий** для `v-on`. Напомним, что модификаторы директив указываются как постфиксы и&nbsp;отделяются точкой.

- `.stop`
- `.prevent`
- `.capture`
- `.self`
- `.once`

``` html
<!-- событие click не будет всплывать дальше -->
<a v-on:click.stop="doThis"></a>

<!-- событие submit больше не будет перезагружать страницу -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- модификаторы можно объединять в цепочки -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- и использовать без указания пользовательского обработчика -->
<form v-on:submit.prevent></form>

<!-- при добавлении слушателя события можно использовать capture mode -->
<div v-on:click.capture="doThis">...</div>

<!-- вызывать обработчик только в случае наступления события непосредственно -->
<!-- на данном элементе (то есть не на дочернем компоненте) -->
<div v-on:click.self="doThat">...</div>
```

> Добавлено в&nbsp;версии 2.1.4

``` html
<!-- Событие click сработает только 1 раз -->
<a v-on:click.once="doThis"></a>
```

В&nbsp;отличие от&nbsp;остальных модификаторов, которые поддерживают исключительно нативные DOM-события, модификатор `.once` можно использовать и&nbsp;в&nbsp;[пользовательских событиях компонентов](components.html#Использование-v-on-с-пользовательскими-событиями). Если вы&nbsp;ещё не&nbsp;читали о&nbsp;компонентах, не&nbsp;беспокойтесь об&nbsp;этом сейчас.

## Модификаторы клавиш

При обработке событий от&nbsp;клавиатуры нас часто интересуют распространённые коды клавиш. Vue позволяет добавить модификаторы клавиш при использовании `v-on` для отслеживания событий от&nbsp;клавиатуры:

``` html
<!-- вызвать vm.submit() только если keyCode равно 13 -->
<input v-on:keyup.13="submit">
```

Удерживать все коды клавиш в&nbsp;памяти&nbsp;&mdash; неблагодарное дело, поэтому Vue предоставляет псевдонимы для наиболее часто используемых из&nbsp;них:

``` html
<!-- аналогично примеру выше -->
<input v-on:keyup.enter="submit">

<!-- работает также и в сокращённой записи -->
<input @keyup.enter="submit">
```

Вот полный список поддерживаемых псевдонимов:

- `.enter`
- `.tab`
- `.delete` (ловит как "Delete", так и "Backspace")
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

Вы&nbsp;можете также [определить пользовательские псевдонимы клавиш](../api/#keyCodes) через глобальный объект `config.keyCodes`:

``` js
// включит v-on:keyup.f1
Vue.config.keyCodes.f1 = 112
```

## Модификаторы клавиш

> Добавлено в&nbsp;версии 2.1.0

Вы&nbsp;можете использовать следующие модификаторы для отслеживания событий мыши или клавиатуры с&nbsp;зажатой клавишей-модификатором:

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

> Примечание: На&nbsp;клавиатурах Apple клавиша meta отмечена знаком ⌘. На&nbsp;клавиатурах Windows клавиша meta отмечена знаком ⊞. На&nbsp;клавиатурах Sun Microsystems клавиша meta отмечена символом ромба (◆). На&nbsp;некоторых клавиатурах, особенно MIT и&nbsp;Lisp machine и&nbsp;их&nbsp;преемников, таких как Knight-клавиатуры или space-cadet клавиатуры, клавиша meta отмечена словом &laquo;META&raquo;. На&nbsp;клавиатурах Symbolics, meta-клавиша отмечена словом &laquo;META&raquo; или &laquo;Meta&raquo;.

Например:

```html
<!-- Alt + C -->
<input @keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Сделать что-нибудь</div>
```

## Почему подписчики указываются в HTML?

Может показаться, что такой подход к&nbsp;отслеживанию событий нарушает старое доброе правило &laquo;разделения мух и&nbsp;котлет&raquo;. Не&nbsp;беспокойтесь&nbsp;&mdash; поскольку все обработчики во&nbsp;Vue строго связываются с&nbsp;ответственным за&nbsp;текущее представление инстансом&nbsp;vm, трудностей в&nbsp;поддержке не&nbsp;возникает. На&nbsp;практике, есть даже несколько преимуществ при использовании `v-on`:

1. Легче получить представление об&nbsp;имеющихся обработчиках, просто пробежав глазами по&nbsp;HTML-коду шаблона.

2. Поскольку нет необходимости вручную привязывать слушатели событий в&nbsp;JS, код vm&nbsp;остаётся независимым от&nbsp;DOM и&nbsp;содержит только необходимую логику. Это облегчает тестирование.

3. Когда vm&nbsp;уничтожается, все слушатели событий автоматически удаляются. Нет необходимости волноваться о&nbsp;том, что придется прибираться за&nbsp;собой.
