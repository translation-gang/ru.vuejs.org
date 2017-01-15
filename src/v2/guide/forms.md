---
title: Работа с формами
type: guide
order: 10
---

## Типичное использование

Вы&nbsp;можете использовать директиву `v-model` для двунаправленного связывания данных с&nbsp;элементами форм input и&nbsp;textarea. Способ обновления элемента выбирается автоматически в&nbsp;зависимости от&nbsp;типа элемента. Хотя `v-model` и&nbsp;выглядит как нечто слегка волшебное, в&nbsp;действительности это всего лишь синтаксический сахар для обновления данных в&nbsp;элементах ввода, с&nbsp;некоторыми поправками для граничных случаев.

<p class="tip">Для `v-model` не&nbsp;имеет значения изначальное значение элемента input или textarea. В&nbsp;качестве источника истины всегда рассматривается только состояние экземпляра Vue.</p>

<p class="tip" id="vmodel-ime-tip">В&nbsp;языках, требующих [IME](https://en.wikipedia.org/wiki/Input_method) (китайский, японский, корейский и&nbsp;т.д.), можно заметить, что `v-model` не&nbsp;обновляется по&nbsp;мере IME-композиции. Если вы&nbsp;хотите обрабатывать и&nbsp;эти обновления, используйте события `input`.</p>

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
<p style="white-space: pre">{{ message }}</p>
<br>
<textarea v-model="message" placeholder="введите несколько строчек"></textarea>
```

{% raw %}
<div id="example-textarea" class="demo">
  <span>Введённое многострочное сообщение:</span>
  <p style="white-space: pre">{{ message }}</p><br>
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
<p class="tip">Интерполяция внутри тега textarea (<code>&lt;textarea&gt;{{text}}&lt;/textarea&gt;</code>) не&nbsp;будет работать. Используйте вместо неё директиву <code>v-model</code></p>
{% endraw %}

### Чекбоксы

Один чекбокс, привязанный к&nbsp;булевому значению:

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

Множество чекбоксов, привязанных к&nbsp;одному и&nbsp;тому&nbsp;же массиву:

``` html
<input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
<label for="jack">Jack</label>
<input type="checkbox" id="john" value="John" v-model="checkedNames">
<label for="john">John</label>
<input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
<label for="mike">Mike</label>
<br>
<span>Отмеченные имена: {{ checkedNames }}</span>
```

``` js
new Vue({
  el: '...',
  data: {
    checkedNames: []
  }
})
```

{% raw %}
<div id="example-3" class="demo">
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
  <label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames">
  <label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
  <label for="mike">Mike</label>
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
<input type="radio" id="one" value="One" v-model="picked">
<label for="one">One</label>
<br>
<input type="radio" id="two" value="Two" v-model="picked">
<label for="two">Two</label>
<br>
<span>Выбрано: {{ picked }}</span>
```
{% raw %}
<div id="example-4" class="demo">
  <input type="radio" id="one" value="One" v-model="picked">
  <label for="one">One</label>
  <br>
  <input type="radio" id="two" value="Two" v-model="picked">
  <label for="two">Two</label>
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

Выбор единственной возможности:

``` html
<select v-model="selected">
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<span>Выбрано: {{ selected }}</span>
```
{% raw %}
<div id="example-5" class="demo">
  <select v-model="selected">
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <span>Выбрано: {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-5',
  data: {
    selected: null
  }
})
</script>
{% endraw %}

Выбор нескольких возможностей (с&nbsp;привязкой к&nbsp;массиву):

``` html
<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<br>
<span>Выбрано: {{ selected }}</span>
```
{% raw %}
<div id="example-6" class="demo">
  <select v-model="selected" multiple style="width: 50px">
    <option>A</option>
    <option>B</option>
    <option>C</option>
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

Динамическое отображение опций с&nbsp;помощью `v-for`:

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
    selected: 'A',
    options: [
      { text: 'One', value: 'A' },
      { text: 'Two', value: 'B' },
      { text: 'Three', value: 'C' }
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
    selected: 'A',
    options: [
      { text: 'One', value: 'A' },
      { text: 'Two', value: 'B' },
      { text: 'Three', value: 'C' }
    ]
  }
})
</script>
{% endraw %}

## Связывание значений

Для радиокнопок, чекбоксов и&nbsp;выпадающих списков выбора, в&nbsp;качестве параметров `v-model` обычно указываются статические строки (для чекбоксов&nbsp;&mdash; булевые значения):

``` html
<!-- `picked` получает строковое значение "a" при клике -->
<input type="radio" v-model="picked" value="a">

<!-- `toggle` может иметь значение true или false -->
<input type="checkbox" v-model="toggle">

<!-- `selected` при выборе становится равным строке "abc" -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

Иногда хочется связать значение с&nbsp;динамическим свойством экземпляра Vue. Для этого можно использовать `v-bind`. Кроме того, использование `v-bind` позволяет связывать поле ввода с&nbsp;нестроковыми переменными.

### Чекбокс

``` html
<input
  type="checkbox"
  v-model="toggle"
  v-bind:true-value="a"
  v-bind:false-value="b"
>
```

``` js
// если отмечено:
vm.toggle === vm.a
// если отметка снята:
vm.toggle === vm.b
```

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
  <!-- inline object literal -->
  <option v-bind:value="{ number: 123 }">123</option>
</select>
```

``` js
// когда выбрано:
typeof vm.selected // -> 'object'
vm.selected.number // -> 123
```

## Модификаторы

### `.lazy`

По&nbsp;умолчанию, `v-model` синхронизирует ввод с&nbsp;данными на&nbsp;каждое событие `input` (за&nbsp;исключением [вышеупомянутых](#vmodel-ime-tip) событий IME). Вы&nbsp;можете указать модификатор `lazy` чтобы вместо этого использовать для синхронизации события `change`:

``` html
<!-- синхронизируется после "change", а не "input" -->
<input v-model.lazy="msg" >
```

### `.number`

Если вы&nbsp;хотите автоматически приводить&nbsp;то, что ввёл пользователь к&nbsp;числу, добавьте модификатор `number`:

``` html
<input v-model.number="age" type="number">
```

Зачастую это оказывается полезным, так как даже при указанном атрибуте `type="number"` значением input&rsquo;а всегда является строка.

### `.trim`

Если вы&nbsp;хотите автоматически обрезать пробелы в&nbsp;начале и&nbsp;в&nbsp;конце введённой строки, используйте модификатор `trim`:

```html
<input v-model.trim="msg">
```

## Использование `v-model` с компонентами

> Если вы&nbsp;ещё не&nbsp;знакомы с&nbsp;компонентами Vue, пока просто пропустите эту секцию

Встроенных в&nbsp;HTML элементов ввода не&nbsp;всегда достаточно. К&nbsp;счастью, компоненты Vue позволяют создавать их&nbsp;пользовательские аналоги с&nbsp;полностью настраиваемым поведением. Эти элементы тоже могут работать с&nbsp;директивой `v-model`. Чтобы узнать больше, прочитайте о&nbsp;[пользовательских элементах ввода](components.html#Поля-ввода-форм-с-использованием-пользовательских-событий) в&nbsp;руководстве по&nbsp;компонентам.
