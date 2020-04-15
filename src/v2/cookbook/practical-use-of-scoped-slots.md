---
title: Практическое использование слотов с ограниченной областью видимости с GoogleMaps
type: cookbook
order: 14
---

## Простой пример

Бывают ситуации, когда вы хотите, чтобы шаблон внутри слота имел доступ к данным дочернего компонента, отвечающего за рендер содержимого слота. Это особенно полезно, когда вам нужна свобода в создании пользовательских шаблонов, использующих свойства данных дочернего компонента. Это типичный случай для использования слотов с ограниченной областью видимости.

Представьте себе компонент, который настраивает и подготавливает внешний API для использования в другом компоненте, но не имеет тесной связи с каким-либо конкретным шаблоном. Такой компонент может быть повторно использован в нескольких местах, отрисовывая различные шаблоны, но используя один и тот же базовый объект с определенным API.

Мы создадим компонент (`GoogleMapLoader.vue`) который:
1. Инициализирует [Google Maps API](https://developers.google.com/maps/documentation/javascript/reference/)
2. Создает объекты `google` и `map`.
3. Выставляет те объекты родительскому компоненту, в котором используется `GoogleMapLoader`.

Ниже приведен пример того, как этого можно добиться. Мы проанализируем код по частям и посмотрим, что на самом деле происходит в следующем разделе.

Сначала создадим наш шаблон `GoogleMapLoader.vue`:

```html
<template>
  <div>
    <div class="google-map" ref="googleMap"></div>
    <template v-if="Boolean(this.google) && Boolean(this.map)">
      <slot
        :google="google"
        :map="map"
      />
    </template>
  </div>
</template>
```

Теперь нашему скрипту нужно передать некоторые данные компоненту, который позволяет установить [Google Maps API](https://developers.google.com/maps/documentation/javascript/reference/) и [Map object](https://developers.google.com/maps/documentation/javascript/reference/map#Map):

```js
import GoogleMapsApiLoader from 'google-maps-api-loader'

export default {
  props: {
    mapConfig: Object,
    apiKey: String
  },

  data() {
    return {
      google: null,
      map: null
    }
  },

  async mounted() {
    const googleMapApi = await GoogleMapsApiLoader({
      apiKey: this.apiKey
    })
    this.google = googleMapApi
    this.initializeMap()
  },

  methods: {
    initializeMap() {
      const mapContainer = this.$refs.googleMap
      this.map = new this.google.maps.Map(
        mapContainer, this.mapConfig
      )
    }
  }
}
```

Это всего лишь часть рабочего примера, вы можете найти весь пример в Codesandbox ниже.

<iframe src="https://codesandbox.io/embed/1o45zvxk0q" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Реальный пример: Создание компонента Google Map Loader

### 1. Создайте компонент, который инициализирует нашу карту

`GoogleMapLoader.vue`

В шаблоне мы создаем контейнер для карты, в который будет монтироваться объект [Map](https://developers.google.com/maps/documentation/javascript/reference/map#Map), извлеченного из Google Maps API.

```html
<template>
  <div>
    <div class="google-map" ref="googleMap"></div>
  </div>
</template>
```

Далее, наш скрипт должен получить данные от родительского компонента, который позволит нам установить Google Map. Эти данные состоят из:

- [mapConfig](https://developers.google.com/maps/documentation/javascript/reference/3/map#MapOptions): Google Maps конфигурация
- [apiKey](https://developers.google.com/maps/documentation/javascript/get-api-key): Наш персональный ключ api, требуемый Google Maps

```js
import GoogleMapsApiLoader from 'google-maps-api-loader'

export default {
  props: {
    mapConfig: Object,
    apiKey: String
  }
```

Затем мы устанавливаем начальные значения google и map на null:

```js
  data() {
    return {
      google: null,
      map: null
    }
  }
```

На `mounted` хуке мы инстанцируем объекты `googleMapApi` и `Map` из `GoogleMapsApi` и устанавливаем значения `google` и `map` для создаваемых экземпляров:

```js
  async mounted() {
    const googleMapApi = await GoogleMapsApiLoader({
      apiKey: this.apiKey
    })
    this.google = googleMapApi
    this.initializeMap()
  },

  methods: {
    initializeMap() {
      const mapContainer = this.$refs.googleMap
      this.map = new this.google.maps.Map(mapContainer, this.mapConfig)
    }
  }
}
```

Пока все хорошо. Сделав все это, мы могли бы продолжать добавлять на карту другие объекты (Маркеры, Ломанные и т.д.) и использовать ее как обычный компонент карты.

Но мы хотим использовать наш компонент `GoogleMapLoader` только в качестве загрузчика, который подготавливает карту - мы не хотим ничего на ней рендерить.

Для этого нам необходимо разрешить родительскому компоненту, который будет использовать наш `GoogleMapLoader` для доступа к `this.google` и `this.map`, которые установлены внутри компонента `GoogleMapLoader`. Вот где [слоты с ограниченной областью видимости](../guide/components-slots.html#Слоты-с-ограниченной-областью-видимости) действительно блестящи. Слоты с ограниченной областью видимости позволяют нам выставлять свойства, заданные в дочернем компоненте, родительскому компоненту. Это может звучать как начало, но потерпите еще одну минуту, когда мы разберемся с этим дальше.

### 2. Создайте компонент, использующий наш инициализатор.

`TravelMap.vue`

В шаблоне мы рендерим компонент `GoogleMapLoader`  и передаем данные, необходимые для инициализации карты.

```html
<template>
  <GoogleMapLoader
    :mapConfig="mapConfig"
    apiKey="yourApiKey"
  />
</template>
```

Наш скрипт будет выглядеть так:

```js
<script>
import GoogleMapLoader from './GoogleMapLoader'
import { mapSettings } from '@/constants/mapSettings'

export default {
  components: {
    GoogleMapLoader
  },

  computed: {
    mapConfig () {
      return {
        ...mapSettings,
        center: { lat: 0, lng: 0 }
      }
    }
  }
}
</script>
```

До сих пор нет слотов с ограниченной областью видимости, так что давайте добавим один.

### 3. Выставьте свойства `google` и `map` в родительском компоненте, добавив слот с ограниченной областью видимости.

Наконец, мы можем добавить слот с ограниченной областью видимости, который будет выполнять эту работу и позволит нам получить доступ к реквизиту дочернего компонента в родительском компоненте. Мы сделаем это, добавив тег `<slot>` в дочерний компонент и передав данные, которые мы хотим выставить (используя директиву `v-bind` или её сокращение `:propName`). Это не отличается от передачи данных в дочерний компонент, но если сделать это в теге `<slot>`то направление потока данных изменится.

`GoogleMapLoader.vue`

```html
<template>
  <div>
    <div class="google-map" ref="googleMap"></div>
    <template v-if="Boolean(this.google) && Boolean(this.map)">
      <slot
        :google="google"
        :map="map"
      />
    </template>
  </div>
</template>
```

Теперь, когда у нас есть слот в дочернем компоненте, мы должны получать и потреблять незащищенные данные в родительском компоненте.

### 4. Получить незащищенные данные в родительском компоненте, используя атрибут `slot-scope`.

Для получения данных в родительском компоненте, мы объявляем элемент шаблона и используем атрибут  `slot-scope`. Этот атрибут имеет доступ к объекту, несущему все реквизиты, выставленные из дочернего компонента. Мы можем захватить весь объект или можем [деструктурировать объект](../guide/components-slots.html#Деструктурирование-входных-параметров-слота) и захватить только то, что нам нужно.

Давайте разобьем эту штуку, чтобы получить то, что нам нужно.

`TravelMap.vue`

```html
<GoogleMapLoader
  :mapConfig="mapConfig"
  apiKey="yourApiKey"
>
  <template slot-scope="{ google, map }">
  	{{ map }}
  	{{ google }}
  </template>
</GoogleMapLoader>
```

Несмотря на то, что `google` и `map` данные не существуют в области `TravelMap`, компонент имеет доступ к ним, и мы можем использовать их в шаблоне.

Ты можешь задаться вопросом, зачем нам делать такие вещи, и какая от этого польза?

Слоты с ограниченной областью видимости позволяют передавать шаблон в слот вместо элемента рендера. Он называется слотом `scoped`, потому что он будет иметь доступ к определенным данным дочерних компонентов, даже если шаблон рендерится в области видимости родительского компонента. Это дает нам свободу заполнять шаблон пользовательским содержимым из родительского компонента.



### 5. Создать фабричные компоненты для маркеров и ломанных

Теперь, когда карта готова, мы создадим два фабричных компонента, которые будут использоваться для добавления элементов в `TravelMap`.

`GoogleMapMarker.vue`

```js
import { POINT_MARKER_ICON_CONFIG } from '@/constants/mapSettings'

export default {
  props: {
    google: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    marker: {
      type: Object,
      required: true
    }
  },

  mounted() {
    new this.google.maps.Marker({
      position: this.marker.position,
      marker: this.marker,
      map: this.map,
      icon: POINT_MARKER_ICON_CONFIG
    })
  }
}
```

`GoogleMapLine.vue`

```js
import { LINE_PATH_CONFIG } from '@/constants/mapSettings'

export default {
  props: {
    google: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    path: {
      type: Array,
      required: true
    }
  },

  mounted() {
    new this.google.maps.Polyline({
      path: this.path,
      map: this.map,
      ...LINE_PATH_CONFIG
    })
  }
}
```

Оба они получают `google`, который мы используем для извлечения нужного объекта (Маркер или Ломанная), а также `map`, который дает в качестве ссылки на карту, на которой мы хотим разместить наш элемент.

Каждый компонент также ожидает дополнительных данных для создания соответствующего элемента. В этом случае мы имеем `marker` и `path` соответственно.


На смонтированном хуке, мы создаем элемент (Маркер/Ломанная) и прикрепляем его к нашей карте, передавая свойство `map` конструктору объекта.

Остается еще один шаг...

### 6. Добавить элементы на карту

Давайте используем наши фабричные компоненты для добавления элементов на карту. Мы должны отобразить фабричные компоненты и передать объекты `google` и `map` так, чтобы данные попали в нужные места.

Нам также необходимо предоставить данные, которые требуются самому элементу. В нашем случае это объект `marker` с положением маркера и объект `path` с координатами ломанной.

Итак, интегрируем точки данных непосредственно в шаблон:

```html
<GoogleMapLoader
  :mapConfig="mapConfig"
  apiKey="yourApiKey"
>
  <template slot-scope="{ google, map }">
    <GoogleMapMarker
      v-for="marker in markers"
      :key="marker.id"
      :marker="marker"
      :google="google"
      :map="map"
    />
    <GoogleMapLine
      v-for="line in lines"
      :key="line.id"
      :path.sync="line.path"
      :google="google"
      :map="map"
    />
  </template>
</GoogleMapLoader>
```

Нам нужно импортировать необходимые фабричные компоненты в наш скрипт и задать данные, которые будут передаваться маркерам и линиям:

```js
import { mapSettings } from '@/constants/mapSettings'

export default {
  components: {
    GoogleMapLoader,
    GoogleMapMarker,
    GoogleMapLine
  },

  data () {
    return {
      markers: [
        { id: 'a', position: { lat: 3, lng: 101 } },
        { id: 'b', position: { lat: 5, lng: 99 } },
        { id: 'c', position: { lat: 6, lng: 97 } },
      ],
      lines: [
        { id: '1', path: [{ lat: 3, lng: 101 }, { lat: 5, lng: 99 }] },
        { id: '2', path: [{ lat: 5, lng: 99 }, { lat: 6, lng: 97 }] }
      ],
    }
  },

  computed: {
    mapConfig () {
      return {
        ...mapSettings,
        center: this.mapCenter
      }
    },

    mapCenter () {
      return this.markers[1].position
    }
  }
}
```

## Когда следует избегать этого паттерна
Может возникнуть соблазн создать очень сложное решение на основе примера, но в какой-то момент мы можем попасть в ситуацию, когда эта абстракция становится самостоятельной частью кода, живущей в нашей кодовой базе. Если мы дойдем до этого момента, то, возможно, стоит подумать об извлечении в дополнение.

## Завершение
Вот так. После создания всех этих битов и частей мы теперь можем повторно использовать компонент `GoogleMapLoader` в качестве базы для всех наших карт, передавая каждому из них различные шаблоны. Представьте, что вам нужно создать другую карту с разными Маркерами или просто Маркеры без Ломанных. Используя вышеприведенный шаблон, это становится очень просто, так как нам просто нужно передать разное содержимое компоненту `GoogleMapLoader`.

Этот шаблон не связан строго с Картами Google; он может быть использован с любой библиотекой для установки базового компонента и отображения API библиотеки, которое может быть затем использовано в компоненте, вызвавшем базовый компонент.
