---
title: Работа с формами
type: guide
order: 10
---

## Типичное использование

Вы можете использовать директиву `v-model` для двунаправленного связывания данных с элементами форм input и textarea. Способ обновления элемента выбирается автоматически в зависимости от типа элемента. Хотя `v-model` и выглядит как нечто слегка волшебное, в действительности это всего лишь синтаксический сахар для обновления данных в элементах ввода, с некоторыми поправками для граничных случаев.

<p class="tip">`v-model` будет игнорировать атрибуты `value`, `checked` или `selected` найденные на любых элементах форм. Данные экземпляра Vue всегда будут рассматриваться как источник истины. Вы должны объявить начальное значение на стороне JavaScript, внутри опции `data` вашего компонента.</p>

<p class="tip" id="vmodel-ime-tip">В языках, требующих [IME](https://ru.wikipedia.org/wiki/IME) (китайский, японский, корейский и т.д.), можно заметить, что `v-model` не обновляется по мере IME-композиции. Если вы хотите обрабатывать и эти обновления, используйте события `input`.</p>

### Текст

``` html
<input v-model="message" placeholder="отредактируй меня">
<p>Введённое сообщение: {{ message }}</p>
```

{% raw %}
<div id="example-1" class="demo">
  <input v-model="message" placeholder="отредактируй меня">
  <p>Введённое сообщение: {{ message }}</p>
</div>
<script>
new Vue({
  el: '#example-1',
  data: {
    message: ''
  }
})
</script>
{% endraw %}

### Многострочный текст

``` html
<span>Введённое многострочное сообщение:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<br>
<textarea v-model="message" placeholder="введите несколько строчек"></textarea>
```

{% raw %}
<div id="example-textarea" class="demo">
  <span>Введённое многострочное сообщение:</span>
  <p style="white-space: pre-line;">{{ message }}</p><br>
  <textarea v-model="message" placeholder="введите несколько строчек"></textarea>
</div>
<script>
new Vue({
  el: '#example-textarea',
  data: {
    message: ''
  }
})
</script>
{% endraw %}

{% raw %}
<p class="tip">Интерполяция внутри тега textarea (<code>&lt;textarea&gt;{{text}}&lt;/textarea&gt;</code>) не будет работать. Используйте вместо неё директиву <code>v-model</code></p>
{% endraw %}

### Чекбоксы

Один чекбокс, привязанный к булевому значению:

``` html
<input type="checkbox" id="checkbox" v-model="checked">
<label for="checkbox">{{ checked }}</label>
```
{% raw %}
<div id="example-2" class="demo">
  <input type="checkbox" id="checkbox" v-model="checked">
  <label for="checkbox">{{ checked }}</label>
</div>
<script>
new Vue({
  el: '#example-2',
  data: {
    checked: false
  }
})
</script>
{% endraw %}

Множество чекбоксов, привязанных к одному и тому же массиву:

``` html
<div id="example-3" class="demo">
  <input type="checkbox" id="jack" value="Джек" v-model="checkedNames">
  <label for="jack">Джек</label>
  <input type="checkbox" id="john" value="Джон" v-model="checkedNames">
  <label for="john">Джон</label>
  <input type="checkbox" id="mike" value="Майк" v-model="checkedNames">
  <label for="mike">Майк</label>
  <br>
  <span>Отмеченные имена: {{ checkedNames }}</span>
</div>
```

``` js
new Vue({
  el: '#example-3',
  data: {
    checkedNames: []
  }
})
```

{% raw %}
<div id="example-3" class="demo">
  <input type="checkbox" id="jack" value="Джек" v-model="checkedNames">
  <label for="jack">Джек</label>
  <input type="checkbox" id="john" value="Джон" v-model="checkedNames">
  <label for="john">Джон</label>
  <input type="checkbox" id="mike" value="Майк" v-model="checkedNames">
  <label for="mike">Майк</label>
  <br>
  <span>Отмеченные имена: {{ checkedNames }}</span>
</div>
<script>
new Vue({
  el: '#example-3',
  data: {
    checkedNames: []
  }
})
</script>
{% endraw %}

### Радиокнопки

``` html
<input type="radio" id="one" value="Один" v-model="picked">
<label for="one">Один</label>
<br>
<input type="radio" id="two" value="Два" v-model="picked">
<label for="two">Два</label>
<br>
<span>Выбрано: {{ picked }}</span>
```
{% raw %}
<div id="example-4" class="demo">
  <input type="radio" id="one" value="Один" v-model="picked">
  <label for="one">Один</label>
  <br>
  <input type="radio" id="two" value="Два" v-model="picked">
  <label for="two">Два</label>
  <br>
  <span>Выбрано: {{ picked }}</span>
</div>
<script>
new Vue({
  el: '#example-4',
  data: {
    picked: ''
  }
})
</script>
{% endraw %}

### Выпадающие списки

Выбор одного варианта из списка:

``` html
<select v-model="selected">
  <option disabled value="">Выберите один из вариантов</option>
  <option>А</option>
  <option>Б</option>
  <option>В</option>
</select>
<span>Выбрано: {{ selected }}</span>
```
``` js
new Vue({
  el: '...',
  data: {
    selected: ''
  }
})
```
{% raw %}
<div id="example-5" class="demo">
  <select v-model="selected">
    <option disabled value="">Выберите один из вариантов</option>
    <option>А</option>
    <option>Б</option>
    <option>В</option>
  </select>
  <span>Выбрано: {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-5',
  data: {
    selected: ''
  }
})
</script>
{% endraw %}

<p class="tip">Если начальное значение выражения `v-model` не соответствует ни одному из вариантов списка, элемент `<select>` будет отображаться в "невыбранном" состоянии. В iOS это приведёт к тому, что пользователь не сможет выбрать первый элемент, потому что iOS не сгенерирует событие change в этом случае. Поэтому рекомендуется предоставлять отключённый вариант выбора с пустым значением value, как показано в примере выше.</p>

Выбор нескольких вариантов из списка (с привязкой к массиву):

``` html
<select v-model="selected" multiple>
  <option>А</option>
  <option>Б</option>
  <option>В</option>
</select>
<br>
<span>Выбрано: {{ selected }}</span>
```
{% raw %}
<div id="example-6" class="demo">
  <select v-model="selected" multiple style="width: 50px;">
    <option>А</option>
    <option>Б</option>
    <option>В</option>
  </select>
  <br>
  <span>Выбрано: {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-6',
  data: {
    selected: []
  }
})
</script>
{% endraw %}

Динамическое отображение опций с помощью `v-for`:

``` html
<select v-model="selected">
  <option v-for="option in options" v-bind:value="option.value">
    {{ option.text }}
  </option>
</select>
<span>Выбрано: {{ selected }}</span>
```
``` js
new Vue({
  el: '...',
  data: {
    selected: 'А',
    options: [
      { text: 'Один', value: 'А' },
      { text: 'Два', value: 'Б' },
      { text: 'Три', value: 'В' }
    ]
  }
})
```
{% raw %}
<div id="example-7" class="demo">
  <select v-model="selected">
    <option v-for="option in options" v-bind:value="option.value">
      {{ option.text }}
    </option>
  </select>
  <span>Выбрано: {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-7',
  data: {
    selected: 'А',
    options: [
      { text: 'Один', value: 'А' },
      { text: 'Два', value: 'Б' },
      { text: 'Три', value: 'В' }
    ]
  }
})
</script>
{% endraw %}

## Связывание значений

Для радиокнопок, чекбоксов и выпадающих списков выбора в качестве параметров `v-model` обычно указываются статические строки (для чекбоксов — булевые значения):

``` html
<!-- `picked` получает строковое значение "a" при клике -->
<input type="radio" v-model="picked" value="a">

<!-- `toggle` может иметь значение true или false -->
<input type="checkbox" v-model="toggle">

<!-- `selected` при выборе первого пункта становится равным строке "abc" -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

Иногда хочется связать значение с динамическим свойством экземпляра Vue. Для этого можно использовать `v-bind`. Кроме того, использование `v-bind` позволяет связывать поле ввода с нестроковыми переменными.

### Чекбокс

``` html
<input
  type="checkbox"
  v-model="toggle"
  true-value="да"
  false-value="нет"
>
```

``` js
// если чекбокс выбран:
vm.toggle === 'да'
// если чекбокс сброшен:
vm.toggle === 'нет'
```

<p class="tip">Атрибуты `true-value` и `false-value` не влияют на атрибут `value` тега input, потому что браузеры пропускают невыбранные чекбоксы при отправке форм. Чтобы гарантировать, что одно из двух значений будет отправлено с формой (например, "да" или "нет") используйте радиокнопки.</p>

### Радиокнопки

``` html
<input type="radio" v-model="pick" v-bind:value="a">
```

``` js
// если отмечено:
vm.pick === vm.a
```

### Списки выбора

``` html
<select v-model="selected">
  <!-- инлайновый объект с данными -->
  <option v-bind:value="{ number: 123 }">123</option>
</select>
```

``` js
// когда выбрано:
typeof vm.selected // => 'object'
vm.selected.number // => 123
```

## Модификаторы

### `.lazy`

По умолчанию `v-model` синхронизирует ввод с данными на каждое событие `input` (за исключением [вышеупомянутых](#vmodel-ime-tip) событий IME). Вы можете указать модификатор `lazy`, чтобы вместо этого использовать для синхронизации события `change`:

``` html
<!-- синхронизируется после "change", а не "input" -->
<input v-model.lazy="msg" >
```

### `.number`

Если вы хотите автоматически приводить то, что ввёл пользователь, к числу, добавьте модификатор `number`:

``` html
<input v-model.number="age" type="number">
```

Зачастую это оказывается полезным, так как даже при указанном атрибуте `type="number"` значением поля ввода всегда является строка.

### `.trim`

Если вы хотите автоматически обрезать пробелы в начале и в конце введённой строки, используйте модификатор `trim`:

```html
<input v-model.trim="msg">
```

## Использование `v-model` с компонентами

> Если вы ещё не знакомы с компонентами Vue, пока просто пропустите эту секцию

Встроенных в HTML элементов ввода не всегда достаточно. К счастью, компоненты Vue позволяют создавать их пользовательские аналоги с полностью настраиваемым поведением. Эти элементы тоже могут работать с директивой `v-model`. Чтобы узнать больше, прочитайте о [пользовательских элементах ввода](components.html#Поля-ввода-форм-с-использованием-пользовательских-событий) в руководстве по компонентам.
