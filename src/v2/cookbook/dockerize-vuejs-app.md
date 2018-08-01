---
title: Интегрируем Docker в приложение Vue.js
type: cookbook
order: 13
---

## Простой пример

Итак, вы создали свое первое приложение на Vue.js, используя потрясающий [шаблон для webpack Vue.js] (https://github.com/vuejs-templates/webpack), и теперь вы на самом деле хотите похвастаться своим коллегам, продемонстрировав им, что вы можете также запустите его в Docker-контейнере.

Начнем с создания `Dockerfile` в корневом каталоге нашего проекта:

```docker
FROM node:9.11.1-alpine

# установить простой HTTP-сервис для обслуживания статичного содержимого
RUN npm install -g http-server

# сделать каталог 'app' текущим рабочим каталогом
WORKDIR /app

# скопировать оба 'package.json' и 'package-lock.json' (если есть)
COPY package*.json ./

# установить зависимости проекта
RUN npm install

# скопировать файлы и каталоги проекта в текущий рабочий каталог (например, в каталог 'app')
COPY . .

# собрать прилложение для продакшена с минификацией
RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]
```

Может показаться излишним копировать `package.json` и `package-lock.json`, а затем все файлы и каталоги проекта в два отдельных шага, но на самом деле есть [одна очень весная причина для этого](http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/) (спойлер: это позволяет нам использовать кешированные слои Docker).

Теперь давайте соберём образ Docker для нашего приложения на Vue.js:

```bash
docker build -t vuejs-cookbook/dockerize-vuejs-app .
```

Наконец, давайте запустим наше приложение Vue.js в контейнере Docker:

```bash
docker run -it -p 8080:8080 --rm --name dockerize-vuejs-app-1 vuejs-cookbook/dockerize-vuejs-app
```

У нас есть доступ к нашему Vue.js-приложению по адресу `localhost: 8080`.

## Пример из реальной жизни

В предыдущем примере мы использовали простой [HTTP-сервер](https://github.com/indexzero/http-server), работающий из командной строки без необходимости ручной конфигурации, для обслуживания нашего приложения на Vue.js, который отлично подходит для быстрого прототипирования и _может быть_ даже для простых сценариев на продакшене. В конце концов, в документации говорится:

> Он достаточно мощный для использования в продакшене, но он прост и достаточно уязвим для хакерских атак, поэтому он подходит для использования в качестве тестирования, локальной разработки и обучения.

Тем не менее, для реально сложных случаев использования в продакшене может быть разумнее стоять на плечах какого-нибудь гиганта, например, такого как [NGINX](https://www.nginx.com/) или [Apache](https://httpd.apache.org/), и это именно то, что мы собираемся сделать дальше: мы собираемся использовать NGINX для обслуживания нашего приложения на Vue.js, потому что данный сервер считается одним из наиболее эффективных и проверенных на практике решений.

Давайте отрефакторим наш `Dockerfile` для использования NGINX:

 ```docker
# этап сборки (build stage)
FROM node:9.11.1-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# продакшен-этап (production-stage)
FROM nginx:1.13.12-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Хорошо, давайте посмотрим, что здесь происходит:
* мы разделили наш оригинальный файл `Dockerfile` на несколько этапа, используя возможность Docker [многоступенчатые сборки](https://docs.docker.com/develop/develop-images/multistage-build/);
* первый этап отвечает за сборку готового для продакшена артефакта нашего приложения Vue.js;
* второй этап отвечает за обслуживание такого артефакта с использованием NGINX.

Теперь давайте соберём Docker-образ нашего приложения на Vue.js:

```bash
docker build -t vuejs-cookbook/dockerize-vuejs-app .
```

Наконец, давайте запустим наше приложение Vue.js в контейнере Docker:

```bash
docker run -it -p 8080:80 --rm --name dockerize-vuejs-app-1 vuejs-cookbook/dockerize-vuejs-app
```

У нас есть доступ к нашему Vue.js-приложению по адресу `localhost: 8080`.

## Дополнительный контекст

Если вы читаете этот сборник рецептов, скорее всего, вы уже знаете, почему вы решили использовать Docker в вашем приложении на Vue.js. Но если вы просто пришли на данную страницу, нажав кнопку «Мне повезёт» с Google, позвольте мне поделиться с вами несколькими вескими основаниями для этого.

Сегодняшняя современная тенденция заключается в создании приложений с использованием подхода [Cloud-Native](https://pivotal.io/cloud-native), который связан главным образом со следующими ключевыми словами:
* Микросервисы
* DevOps
* Непрерывная доставка

Посмотрим, как эти понятия действительно влияют на наше решение о использовании Docker в нашем приложении на Vue.js.

### Последствия микросервисов

Принимая этот [архитектурный стиль микросервисов](https://martinfowler.com/microservices/), мы создаём единое приложение в как набор небольших сервисов, каждый из которых работает в собственном процессе и взаимодействует с лёгкими механизмами. Эти сервисы основаны на бизнес-возможностях и независимо развёртываются путём полного автоматизированного механизма развёртывания.

Таким образом, принятие этого архитектурного подхода в большинстве случаев подразумевает разработку и доставку нашего фронтенда как независимого сервиса.

### Последствия DevOps

Принимая культуру [DevOps](https://martinfowler.com/bliki/DevOpsCulture.html), инструменты и гибкую инженерную практику, в частности, получается хороший эффект расширения сотрудничества между ролями разработки и операциями. Одна из главных проблем прошлого (но и сегодня в некоторых реалиях) заключается в том, что команда разработчиков обычно не интересовалась операцией и обслуживанием системы после её передачи команде технической поддержки, в то время как последняя, как правило, не была в курсе всех бизнес-целей системы и, следовательно, неохотно удовлетворяя оперативные потребности системы (также называемые "капризы разработчиков").

Таким образом, доставка нашего Vue.js-приложения в качестве Docker-образа помогает уменьшить, если не полностью устранить, разницу между запуском сервиса на ноутбуке разработчика, в продакшене или любом другом окружении, о котором мы можем думать.

### Effects of Continuous Delivery

By leveraging the [Continuous Delivery](https://martinfowler.com/bliki/ContinuousDelivery.html) discipline we build our software in a way that it can potentially be released to production at any time. Such engineering practice is enabled by means of what is normally called [continuous delivery pipeline](https://martinfowler.com/bliki/DeploymentPipeline.html). The purpose of a continuous delivery pipeline is to split our build into stages (e.g. compilation, unit tests, integration tests, performance tests, etc.) and let each stage verify our build artifact whenever our software changes. Ultimately, each stage increases our confidence in the production readiness of our build artifact and, therefore, reduces the risk of breaking things in production (or any other environment for that matters).

So, creating a Docker image for our Vue.js app is a good choice here because that would represent our final build artifact, the same artifact that would be verified against our continuous delivery pipeline and that could potentially be released to production with confidence.

## Alternative Patterns

If your company is not into Docker and Kubernetes just yet or you simply want to get your MVP out the door, maybe dockerizing your Vue.js app is not what you need.

Common alternatives are:
* leveraging an all-in-one platform like [Netlify](https://www.netlify.com/);
* hosting your SPA on [Amazon S3](https://aws.amazon.com/s3/) and serving it with [Amazon CloudFront](https://aws.amazon.com/cloudfront/) (see [this](https://serverless-stack.com/chapters/deploy-the-frontend.html) link for a detailed guide).
