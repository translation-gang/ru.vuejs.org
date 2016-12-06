---
title: Обработка событий
type: guide
order: 9
---

## Наблюдение за событиями

Для наблюдения за событиями DOM и запуска JavaScript-кода при их наступлении можно применить директиву `v-on`.

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
  <button v-on:click="counter += 1">Добавить 1</button>
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

Логика обработки события может быть довольно сложной, так что оставить весь код JavaScript в значении атрибута `v-on` попросту не всегда возможно. На этот случай `v-on` может принять и название метода, который вы бы хотели вызвать.

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
      alert('Привет ' + this.name + '!')
      // `event` — нативное событие DOM
      alert(event.target.tagName)
    }
  }
})

// вызывать методы можно и императивно
example2.greet() // -> 'Привет Vue.js!'
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
      alert('Привет ' + this.name + '!')
      alert(event.target.tagName)
    }
  }
})
</script>
{% endraw %}

## Методы и inline-обработчики

Вместо связывания непосредственно с методом по имени, можно вызывать методы в выражениях JavaScript:

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

Иногда и в inline-обработчиках оказывается необходимым доступ к оригинальному событию DOM. Его можно передать в метод, используя специальную переменную `$event`:

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

Очень часто возникает необходимость вызвать `event.preventDefault()` или `event.stopPropagation()` в обработчике события. Хотя это легко можно сделать внутри метода, было бы лучше сохранить чистоту логики и абстрагироваться от деталей реализации событий DOM.

Для решения этой задачи Vue предлагает **модификаторы событий** для `v-on`. Напомним, что модификаторы директив указываются как постфиксы и отделяются точкой.

- `.stop`
- `.prevent`
- `.capture`
- `.self`

``` html
<!-- всплытие события click будет остановлено -->
<a v-on:click.stop="doThis"></a>

<!-- событие submit больше не будет перезагружать страницу -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- модификаторы можно объединять в цепочки -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- и использовать без указания пользовательского обработчика -->
<form v-on:submit.prevent></form>

<!-- при добавлении слушателя события можно использовать capture mode -->
<div v-on:click.capture="doThis">...</div>

<!-- вызывать обработчик только в случае наступления события непосредственно на данном элементе -->
<!-- (то есть не на дочернем компоненте) -->
<div v-on:click.self="doThat">...</div>
```

## Модификаторы клавиш

При событии от клавиатуры нас часто интересуют распространённые коды клавиш. Vue также позволяет использовать модификаторы клавиш при использовании `v-on` для отслеживания событий от клавиатуры:

``` html
<!-- вызвать vm.submit() только если keyCode равно 13 -->
<input v-on:keyup.13="submit">
```

Удерживать все коды клавиш в памяти — неблагодарное дело, поэтому Vue предоставляет псевдонимы для наиболее часто используемых из них:

``` html
<!-- анилогично примеру выше -->
<input v-on:keyup.enter="submit">

<!-- работает также и в сокращённой записи -->
<input @keyup.enter="submit">
```

Вот полный список поддерживаемых псевдонимов:

- enter
- tab
- delete (ловит как "Delete", так и "Backspace")
- esc
- space
- up
- down
- left
- right

Вы можете также [определить пользовательские псевдонимы клавиш](../api/#keyCodes) через глобальный объект `config.keyCodes`:

``` js
// включит v-on:keyup.f1
Vue.config.keyCodes.f1 = 112
```

## Модификаторы клавиш

> Нововведение в версии 2.1.0

Вы можете использовать следующие модификаторы для отслеживания событий мыши или клавиатуры с зажатой клавишей модификатором:

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

> Note: On Macintosh keyboards, meta is the command key (⌘). On Windows keyboards, meta is the windows key (⊞). On Sun Microsystems keyboards, meta is marked as a solid diamond (◆). On certain keyboards, specifically MIT and Lisp machine keyboards and successors, such as the Knight keyboard, space-cadet keyboard, meta is labeled “META”. On Symbolics keyboards, meta is labeled “META” or “Meta”.

Например:

```html
<!-- Alt + C -->
<input @keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Сделать что-нибудь</div>
```

## Почему слушатели указываются в HTML?

Может показаться, что такой подход к отслеживанию событий нарушает старое доброе правило "разделения мух и котлет". Будьте уверены — поскольку все обработчики во Vue строго связываются с ответственным за текущее представление инстансом vm, трудностей в поддержке не возникает. На практике, есть даже несколько преимуществ при использовании `v-on`:

1. Легче получить представление об имеющихся обработчиках, просто пробежав глазами по HTML-коду шаблона.

2. Поскольку нет необходимости вручную привязывать слушатели событий в JS, код vm остаётся независимым от DOM и содержит только необходимую логику. Это облегчает тестирование.

3. Когда vm уничтожается, все слушатели событий автоматически удаляются. Нет необходимости волноваться о том, что придется прибираться за собой.
