---
title: Вычисляемые свойства и слежение
type: guide
order: 5
---

## Вычисляемые свойства

Выражения, встраиваемые в&nbsp;шаблоны, удобны, но&nbsp;предназначены они только для простых операций. При усложнении логикой, они быстро становятся трудноподдерживаемыми. Например:

``` html
<div id="example">
  {{ message.split('').reverse().join('') }}
</div>
```

Этот шаблон уже не&nbsp;выглядит просто и&nbsp;декларативно. С&nbsp;первого взгляда и&nbsp;не&nbsp;скажешь, что он&nbsp;всего лишь отображает `message` задом наперёд. Ситуация станет ещё хуже, если эту логику в&nbsp;шаблоне потребуется использовать в&nbsp;нескольких местах.

На&nbsp;помощь приходят **вычисляемые свойства**.

### Простой пример

``` html
<div id="example">
  <p>Изначальное сообщение: "{{ message }}"</p>
  <p>Сообщение задом наперёд: "{{ reversedMessage }}"</p>
</div>
```

``` js
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Привет'
  },
  computed: {
    // геттер вычисляемого значения
    reversedMessage: function () {
      // `this` указывает на инстанс vm
      return this.message.split('').reverse().join('')
    }
  }
})
```

Результат:

{% raw %}
<div id="example" class="demo">
  <p>Изначальное сообщение: "{{ message }}"</p>
  <p>Сообщение задом наперёд: "{{ reversedMessage }}"</p>
</div>
<script>
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Привет'
  },
  computed: {
    reversedMessage: function () {
      return this.message.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

Здесь мы&nbsp;определили вычисляемое свойство `reversedMessage`. Написанная нами функция будет использоваться как геттер свойства `vm.reversedMessage`:

``` js
console.log(vm.reversedMessage) // -> 'тевирП'
vm.message = 'Пока'
console.log(vm.reversedMessage) // -> 'акоП'
```

Вы&nbsp;можете открыть консоль и&nbsp;поиграть с&nbsp;примером сами. Значение `vm.reversedMessage` всегда зависит от&nbsp;значения `vm.message`.

В&nbsp;шаблонах вы&nbsp;можете привязываться к&nbsp;вычисляемым свойствам ровно таким&nbsp;же образом, как и&nbsp;к&nbsp;обычным. Vue знает, что `vm.reversedMessage` зависит от&nbsp;`vm.message`, так что при обновлении `vm.message` обновятся и&nbsp;все элементы, зависящие от&nbsp;`vm.reversedMessage`. Приятнее всего&nbsp;то, что эту зависимость мы&nbsp;указали декларативно: геттер вычисляемого свойства является чистой функцией (pure function) и&nbsp;не&nbsp;имеет побочных эффектов, что упрощает как понимание кода, так и&nbsp;тестирование.

### Кеширование вычисляемых свойств

Вы&nbsp;могли заметить, что тот&nbsp;же результат можно достигнуть при помощи метода:

``` html
<p>Сообщение задом наперёд: "{{ reverseMessage() }}"</p>
```

``` js
// в компоненте
methods: {
  reverseMessage: function () {
    return this.message.split('').reverse().join('')
  }
}
```

Вместо вычисляемого свойства, мы&nbsp;можем указать ту&nbsp;же самую функцию в&nbsp;качестве метода. С&nbsp;точки зрения конечного результата, оба подхода действительно делают одно и&nbsp;то&nbsp;же. Но&nbsp;есть важное различие: **вычисляемые свойства кешируются, основываясь на&nbsp;своих зависимостях**. Вычисляемое свойство будет пересчитано только тогда, когда изменится одна из&nbsp;его зависимостей. Поэтому, пока `message` остаётся неизменным, многократное обращение к&nbsp;`reversedMessage` будет каждый раз незамедлительно возвращать единожды вычисленное значение, не&nbsp;запуская функцию вновь.

Кроме того, это значит, что следующее вычисляемое свойство никогда не&nbsp;обновится, так как `Date.now()` не&nbsp;является реактивной зависимостью:

``` js
computed: {
  now: function () {
    return Date.now()
  }
}
```

Использование метода, напротив, запускает функцию **всегда, при каждом обращении к&nbsp;нему**.

Зачем нужно кеширование? Представьте, что у&nbsp;вас есть дорогое вычисляемое свойство&nbsp;**A**, требующее цикла по&nbsp;огромному массиву и&nbsp;выполняющее множество вычислений. А&nbsp;ещё пусть будут другие вычисляемые свойства, в&nbsp;свою очередь зависящие от&nbsp;**A**.&nbsp;Без кеширования геттер&nbsp;**A** будет запускаться куда чаще необходимого! В&nbsp;тех&nbsp;же случаях, когда кеширования нужно избежать&nbsp;&mdash; используйте методы.

### Вычисляемые свойства и слежение

Vue также предоставляет и&nbsp;более общий способ наблюдения и&nbsp;реагирования на&nbsp;изменения данных в&nbsp;инстансе: **слежение за&nbsp;свойствами**. Когда у&nbsp;вас есть данные, которые должны быть обновлены при изменении других данных, возникает соблазн избыточно использовать этот подход, особенно если вы&nbsp;привыкли к&nbsp;Angular. Но, как правило, гораздо лучше использовать вычисляемые свойства, а&nbsp;не&nbsp;императивный коллбэк в&nbsp;`watch`. Рассмотрим пример:

``` html
<div id="demo">{{ fullName }}</div>
```

``` js
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar',
    fullName: 'Foo Bar'
  },
  watch: {
    firstName: function (val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: function (val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
})
```

Код выше&nbsp;&mdash; императивный и&nbsp;избыточный. Сравните с&nbsp;версией с&nbsp;использованием вычисляемого свойства:

``` js
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
})
```

Так&nbsp;же гораздо лучше, не&nbsp;правда&nbsp;ли?

### Сеттеры вычисляемых свойств

По&nbsp;умолчанию вычисляемые свойства работают только на&nbsp;чтение, но&nbsp;в&nbsp;случае необходимости вы&nbsp;можете также указать и&nbsp;сеттер:

``` js
// ...
computed: {
  fullName: {
    // геттер:
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // сеттер:
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
```

Теперь запись `vm.fullName = 'Иван Иванов'` вызовет сеттер, и&nbsp;`vm.firstName` и&nbsp;`vm.lastName` будут соответствующим образом обновлены.

## Методы-наблюдатели

Хотя в&nbsp;большинстве случаев лучше использовать вычисляемые свойства, иногда пользовательские методы-наблюдатели всё&nbsp;же необходимы. Поэтому Vue предоставляет более общий путь для реагирования на&nbsp;изменения в&nbsp;данных через опцию `watch`. Полезнее всего эта возможность оказывается для дорогих или асинхронных операций, выполняемых в&nbsp;ответ на&nbsp;изменение данных.

Рассмотрим пример:

``` html
<div id="watch-example">
  <p>
    Задайте вопрос, на который можно ответить "да" или "нет":
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
```

``` html
<!-- Поскольку уже существует обширная экосистема ajax-библиотек  -->
<!-- и библиотек функций общего назначения, ядро Vue может        -->
<!-- оставаться маленьким и не изобретать их заново. Кроме того,  -->
<!-- это позволяет вам использовать только знакомые инструменты. -->
<script src="https://unpkg.com/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://unpkg.com/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'Пока вы не зададите вопрос, я не могу ответить!'
  },
  watch: {
    // эта функция запускается при любом изменении вопроса
    question: function (newQuestion) {
      this.answer = 'Ожидаю, когда вы закончите печатать...'
      this.getAnswer()
    }
  },
  methods: {
    // _.debounce — это функция из lodash, позволяющая ограничить
    // то, насколько часто может выполняться определённая операция.
    // В данном случае, мы хотим ограничить частоту обращений к yesno.wtf/api,
    // дожидаясь завершения печати вопроса перед тем как послать ajax-запрос.
    // Чтобы узнать больше о функции _.debounce (и её родственнице _.throttle),
    // см. документацию: https://lodash.com/docs#debounce
    getAnswer: _.debounce(
      function () {
        var vm = this
        if (this.question.indexOf('?') === -1) {
          vm.answer = 'Вопросы обычно заканчиваются вопросительным знаком. ;-)'
          return
        }
        vm.answer = 'Думаю...'
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = _.capitalize(response.data.answer)
          })
          .catch(function (error) {
            vm.answer = 'Ошибка! Не могу связаться с API. ' + error
          })
      },
      // Это число миллисекунд, которое мы ждем
      // после того как пользователь прекратил печатать:
      500
    )
  }
})
</script>
```

Результат:

{% raw %}
<div id="watch-example" class="demo">
  <p>
    Задайте вопрос, на который можно ответить "да" или "нет":
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
<script src="https://unpkg.com/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://unpkg.com/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'Пока вы не зададите вопрос, я не могу ответить!'
  },
  watch: {
    question: function (newQuestion) {
      this.answer = 'Ожидаю, когда вы закончите печатать...'
      this.getAnswer()
    }
  },
  methods: {
    getAnswer: _.debounce(
      function () {
        var vm = this
        if (this.question.indexOf('?') === -1) {
          vm.answer = 'Вопросы обычно заканчиваются вопросительным знаком. ;-)'
          return
        }
        vm.answer = 'Думаю...'
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = _.capitalize(response.data.answer)
          })
          .catch(function (error) {
            vm.answer = 'Ошибка! Не могу связаться с API. ' + error
          })
      },
      500
    )
  }
})
</script>
{% endraw %}

В&nbsp;данном случае применение опции `watch` позволяет нам выполнять асинхронную операцию (обращение к&nbsp;API), ограничивать частоту выполнения этой операции и&nbsp;устанавливать промежуточные состояния до&nbsp;получения окончательного ответа. Ничего из&nbsp;этого не&nbsp;удалось&nbsp;бы достичь с&nbsp;помощью вычисляемых свойств.

В&nbsp;дополнение к&nbsp;опции `watch` вы&nbsp;можете также использовать [vm.$watch](../api/#vm-watch) в&nbsp;императивном стиле.
