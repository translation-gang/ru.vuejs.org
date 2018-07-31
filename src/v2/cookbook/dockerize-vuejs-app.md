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

## Additional Context

If you are reading this cookbook, chances are you already know why you decided to dockerize your Vue.js app. But if you simply landed on this page after hitting the Google's `I'm feeling lucky` button, let me share with you a couple of good reasons for doing that.

Today's modern trend is to build applications using the [Cloud-Native](https://pivotal.io/cloud-native) approach which revolves mainly around the following buzzwords:
* Microservices
* DevOps
* Continuous Delivery

Let's see how these concepts actually affect our decision of dockerizing our Vue.js app.

### Effects of Microservices

By adopting the [microservices architectural style](https://martinfowler.com/microservices/), we end up building a single application as a suite of small services, each running in its own process and communicating with lightweight mechanisms. These services are built around business capabilities and independently deployable by fully automated deployment machinery.

So, committing to this architectural approach most of the time implies developing and delivering our front-end as an independent service.

### Effects of DevOps

The adoption of [DevOps](https://martinfowler.com/bliki/DevOpsCulture.html) culture, tools and agile engineering practices has, among other things, the nice effect of increasing the collaboration between the roles of development and operations. One of the main problem of the past (but also today in some realities) is that the dev team tended to be uninterested in the operation and maintenance of a system once it was handed over to the ops team, while the latter tended to be not really aware of the system's business goals and, therefore, reluctant in satisfying the operational needs of the system (also referred to as "whims of developers").

So, delivering our Vue.js app as a Docker image helps reducing, if not removing entirely, the difference between running the service on a deveveloper's laptop, the production environment or any environment we may think of.

### Effects of Continuous Delivery

By leveraging the [Continuous Delivery](https://martinfowler.com/bliki/ContinuousDelivery.html) discipline we build our software in a way that it can potentially be released to production at any time. Such engineering practice is enabled by means of what is normally called [continuous delivery pipeline](https://martinfowler.com/bliki/DeploymentPipeline.html). The purpose of a continuous delivery pipeline is to split our build into stages (e.g. compilation, unit tests, integration tests, performance tests, etc.) and let each stage verify our build artifact whenever our software changes. Ultimately, each stage increases our confidence in the production readiness of our build artifact and, therefore, reduces the risk of breaking things in production (or any other environment for that matters).

So, creating a Docker image for our Vue.js app is a good choice here because that would represent our final build artifact, the same artifact that would be verified against our continuous delivery pipeline and that could potentially be released to production with confidence.

## Alternative Patterns

If your company is not into Docker and Kubernetes just yet or you simply want to get your MVP out the door, maybe dockerizing your Vue.js app is not what you need.

Common alternatives are:
* leveraging an all-in-one platform like [Netlify](https://www.netlify.com/);
* hosting your SPA on [Amazon S3](https://aws.amazon.com/s3/) and serving it with [Amazon CloudFront](https://aws.amazon.com/cloudfront/) (see [this](https://serverless-stack.com/chapters/deploy-the-frontend.html) link for a detailed guide).
