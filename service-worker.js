/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["2014/03/22/vuejs-010-release/index.html","ab02e453028103f22982f7b769ab3947"],["2014/07/29/vue-next/index.html","ffd74eed8d4c2f5d0c5633b14783aca0"],["2014/11/09/vue-011-release/index.html","8c32fda551fc3ed2a1b9ed02d72832ea"],["2014/12/08/011-component/index.html","a14aff7c8bc44ed4a6e0ac18474c5bed"],["2015/06/11/012-release/index.html","a845b052634f74f80ab0218ca2706cc0"],["2015/10/26/1.0.0-release/index.html","5e9bf5230a4c8bda2c723285e58ae01e"],["2015/10/28/why-no-template-url/index.html","e309c2d1e0f0cb1a706c7c9bf34e6a39"],["2015/12/28/vue-cli/index.html","e3efaffbcb208a2b9d5c68ce0ddda155"],["2016/02/06/common-gotchas/index.html","485ff823a42d950c8046a5599fedb5fa"],["2016/03/14/march-update/index.html","cb0f58ab61f93b1510d54f51f13d03bc"],["2016/04/27/announcing-2.0/index.html","e50486b0f07fabbd7a2f40345fef90c4"],["api/index.html","176a72f4aaa42c3b6a404d370e87fbb8"],["archives/2014/03/index.html","e6997171f5dea7fb3f280a9718a1ee63"],["archives/2014/07/index.html","1125604077cf4f35b1597bc2ebdcda60"],["archives/2014/11/index.html","9ed30bb131512ac7e57e770fd4a50db6"],["archives/2014/12/index.html","78f9ee31a8e74c9776e56e5f8e1d7cf7"],["archives/2014/index.html","5aad75a955fecedf0724a9bf23b7618e"],["archives/2015/06/index.html","ccb65465c657f314f4e5453fa31ed086"],["archives/2015/10/index.html","4c9e5af94878810b9f071a5acde7c60d"],["archives/2015/12/index.html","a70c5dc01c2f4de5e28011f08e7dbead"],["archives/2015/index.html","ba2a4df89abf1f5ecc5da1c89c8ecbfa"],["archives/2016/02/index.html","712895296b50372e25c53bb426ef959c"],["archives/2016/03/index.html","d847ada63bd4ace8ba4398bb6764c5cb"],["archives/2016/04/index.html","9853fb32ae12541fd66a15371ba14571"],["archives/2016/index.html","7322529a95436d7d4883a85ca92b6027"],["archives/index.html","e307c9a320a4397fd49ab039be2b185d"],["archives/page/2/index.html","5b32658ed1bce180824ecadc32855e69"],["coc/index.html","ed58ad3d5e4a1dfd1903acfec388c0a1"],["css/benchmark.css","b083e0006589a5ba88a250eb8ee12cc5"],["css/index.css","df0779ce1dd9c21bb4db365f619f79de"],["css/page.css","e94b1deaa248993af597d95217320e52"],["css/search.css","98bc5fed33d9deaea04ed36de435afd7"],["examples/commits.html","3cd3b2db40187e7f2d236473bae9ce59"],["examples/elastic-header.html","198f4c19911bf30785905adb996ef899"],["examples/firebase.html","266080b80e262a2b93289d466d1337b5"],["examples/grid-component.html","3119ba25bb6b9dcc2f40d3f60e2136df"],["examples/hackernews.html","f793aeb8d340c60945b0a58f3afa25c9"],["examples/index.html","dc91b34e726c12318c4d083a3090c156"],["examples/modal.html","88b6a98ec8a44cd783eaf0d71fcf46a7"],["examples/select2.html","b812ad3b215af513c979c0d9759fe5c9"],["examples/svg.html","0a1876c72d22212d243ed8c2d5b0404e"],["examples/todomvc.html","a048618225f78a66ff322bb1dde98a37"],["examples/tree-view.html","4815e09c4b3af4132da0e95dc1fbc945"],["fonts/SourceSansPro-Light.otf.woff","7d901d6001e12e3fd36572daa796e9cc"],["fonts/SourceSansPro-Regular.otf.woff","bbd955e1383a2ab663298511a163d3dc"],["fonts/SourceSansPro-Semibold.otf.woff","99f66ff4eab8123edcaa32fd744cb791"],["guide/class-and-style.html","a3174f2083dd58fbd1aa965dcc98133f"],["guide/comparison.html","7c06634379b01b8e7ef0dfc90b9b8517"],["guide/components.html","d98663b0d45a91f0a40541c1efe2bbfc"],["guide/computed.html","3fcf408c7cdfd856ea75b6a5562ba8aa"],["guide/conditional.html","896e19e7955f2616eb31ab4d8c65178c"],["guide/custom-directive.html","697987fdd04783febdbff2aa2932c41d"],["guide/deployment.html","be96515c673712671d042337366ddf63"],["guide/events.html","0ebaec88003f2e1ab59ff868764d961a"],["guide/forms.html","09ead2d35e42cdd09d848b27ec357491"],["guide/index.html","e3171c7c94b236d5caa91894d8fdd581"],["guide/installation.html","8acd1ab4fbaa082958259bf3a22d7b22"],["guide/instance.html","61021765831307e8278d034c23502dd6"],["guide/join.html","f2287c54050c9b576ed05af7baf6af73"],["guide/list.html","772e05d65b4587501785906a4b681efd"],["guide/migration-vue-router.html","e0d8a3e2dc09e2bda939c23c1e967765"],["guide/migration-vuex.html","9b8659c8a4506acd24f2c0e3bee160f3"],["guide/migration.html","af37d4bfb217e88a7f02eb92c446497f"],["guide/mixins.html","270f751a44e1d1e18b9a31406a34fe8b"],["guide/plugins.html","40467c9724e4917ae32582ac543db41b"],["guide/reactivity.html","5b1e83c4a12b5f3e687e89e0a0b1ef05"],["guide/render-function.html","4139dd80783f9eecb92d57dcf23dc54d"],["guide/routing.html","f7f89a93550ee84e925ed84d6912a650"],["guide/single-file-components.html","095eb3d7152439579d7a56227fe273f4"],["guide/ssr.html","9143accd02c56349a3ec40d79eeefb4d"],["guide/state-management.html","81ea6d4aee3ef538b507e4a5a0c3e3a0"],["guide/syntax.html","611a256a910e0d1adfd5b418535e0ac1"],["guide/transitioning-state.html","3f36248a3d9f6f21f10725f15775c5d6"],["guide/transitions.html","4513c62165ee217697830a40e1795365"],["guide/unit-testing.html","0f69c6b7a8d743af6384b8a2208b9a33"],["images/Monterail.png","bf1ec94a0ca48f0e6be0c97fa60a42c0"],["images/aaha.png","77bfeb59f772f37444c9cefe00785cf2"],["images/accelebrate.png","e030e08131cebe8b43c89df18d710ded"],["images/alligator_io.svg","1ffe0191e22a65337f9cb224790f5222"],["images/autocode.svg","4319bc58220eb3ffaa993488c171c0dc"],["images/bacancy_technology.png","5810bb8253b1e35ba437373ff83f82d3"],["images/bestvpn_co.png","afbe252b6b59bc3cdac2e7dec69eac39"],["images/bit.png","9638a3f44bf471876effb80ea0659f73"],["images/blokt_cryptocurrency_news.png","0ecada49bad35aabc864a8df221fd816"],["images/breakpoint_hit.png","114924925a4ec0f23236012bc3dc8422"],["images/breakpoint_set.png","6439856732303cfeb3806d52dd681191"],["images/chaitin.png","549e43997790dc624c477424acbfe228"],["images/check.png","c634675b753a1a03b587c43d8b535600"],["images/cloudstudio.png","fc480cf4c2b06591f58e7e91666226af"],["images/coding.png","10c55345da3c2374563b096f5c86d781"],["images/coin-bch.png","ddfab54149483e02f3cd540a47e2782b"],["images/coin-btc.png","d90559bb202766dd6ddabf71dd1680be"],["images/coin-eth.png","70ae70292937880fe9e77c2c7dc38f86"],["images/coin-ltc.png","9e756bd611ac7355515153cecbc20d36"],["images/components.png","b5c08269dfc26ae6d7db3801e9efd296"],["images/config_add.png","353cd8b2a1bdf9fc4c74a80c5f38090a"],["images/daily.png","c9a8b2a897dba41c7d5aa6f9cd876d82"],["images/data.png","8624e58259d141a93c1d23b2c72904cd"],["images/dcloud.gif","ade7c64e66506b6cff10292efea16ee8"],["images/derek_pollard.png","b1c4d535b619865d80d6cf1b2e370300"],["images/devexpress.png","a6d9c786a373088c8d238ca643293c17"],["images/devsquad.png","e639ea4fd0d7053fc0928d4ff9fefb2a"],["images/devtools-storage-chrome.png","ac1f3b275b87e2fec9c4df951347be81"],["images/devtools-storage-edge.png","3e92a3bea017b8398e71db0a2419a191"],["images/devtools-storage.png","e742c3b1d526bee7be77c050f4bffc92"],["images/devtools-timetravel.gif","fca84f3fb8a8d10274eb2fc7ed9b65f9"],["images/dom-tree.png","f70b86bfbbfe1962dc5d6125105f1122"],["images/dopamine.png","17222090b66cfca59f1ccf8b9843f595"],["images/down.png","2f948222df409af3121254d5fe0ed377"],["images/earthlink.png","88f1bd15252b11484834176965844e22"],["images/energy_comparison.png","1f3f2809057b867842c99679e2723b3e"],["images/fastcoding_inc.png","08a0a7652db79fa3395c0ef28d49f0cd"],["images/fastcoding_inc.svg","ff35e14cb519fe5d76e6e8d9444e4fa6"],["images/feed.png","a9bbd11a96e1cbcc49bf8fa857a0d70f"],["images/firestick_tricks.png","1ee05223a5b12fe910cb8428d57223d8"],["images/flatlogic_templates.svg","925f0c4421cc6d86ebc9d6788b519220"],["images/foo.png","1c9cde53bb9c98a316edc93d57684e4d"],["images/frontend_love.png","b514babc53a0f3ddc854b0b14a54a489"],["images/frontendlove.png","b514babc53a0f3ddc854b0b14a54a489"],["images/gitee.png","429b3c31a180461c4fb66e5ac20e1385"],["images/gridsome.png","e82a2f872ec319bbb5d0a804288cd9b7"],["images/happy_programmer_llc.png","3f3303d42a57ff9edf36373f59d376af"],["images/hn-architecture.png","46cae6ac236cf9e8c42be2018d69afc6"],["images/hn.png","99176cdebac521e823be519aef514bb3"],["images/html_burger.png","c7ce1344d001e7a236a89694ed59d988"],["images/icons.png","ad6ee8c400066e15712cdef4342023da"],["images/icons/android-icon-144x144.png","e67b8d54852c2fbf40be2a8eb0590f5b"],["images/icons/android-icon-192x192.png","5d10eaab941eb596ee59ffc53652d035"],["images/icons/android-icon-36x36.png","bb757d234def1a6b53d793dbf4879578"],["images/icons/android-icon-48x48.png","0d33c4fc51e2bb020bf8dd7cd05db875"],["images/icons/android-icon-72x72.png","702c4fafca31d670f9bd8b2d185ced39"],["images/icons/android-icon-96x96.png","0ebff702851985ea6ba891cf6e6e7ddd"],["images/icons/apple-icon-114x114.png","f4fd30f3a26b932843b8c5cef9f2186e"],["images/icons/apple-icon-120x120.png","b6a574d63d52ef9c89189b67bcac5cbd"],["images/icons/apple-icon-144x144.png","e67b8d54852c2fbf40be2a8eb0590f5b"],["images/icons/apple-icon-152x152.png","f53787bf41febf2b044931a305ccaf2a"],["images/icons/apple-icon-180x180.png","9f6b1e3b92b2c5bd5b7d79501bb6e612"],["images/icons/apple-icon-57x57.png","83f622ba0994866abc56ace068b6551c"],["images/icons/apple-icon-60x60.png","643f761bc39f86c70f17cd1fed3b8e08"],["images/icons/apple-icon-72x72.png","702c4fafca31d670f9bd8b2d185ced39"],["images/icons/apple-icon-76x76.png","94d9af047b86d99657b5efb88a0d1c7b"],["images/icons/apple-icon-precomposed.png","707758f591323153a4f1cb3a8d9641fa"],["images/icons/apple-icon.png","707758f591323153a4f1cb3a8d9641fa"],["images/icons/favicon-16x16.png","a5a9da66870189b0539223c38c8a7749"],["images/icons/favicon-32x32.png","3d60db0d77303b2414ddd50cf2472bf7"],["images/icons/favicon-96x96.png","0ebff702851985ea6ba891cf6e6e7ddd"],["images/icons/ms-icon-144x144.png","e67b8d54852c2fbf40be2a8eb0590f5b"],["images/icons/ms-icon-150x150.png","e8cdf492981122a2548bc247c7b4067d"],["images/icons/ms-icon-310x310.png","1721f8303ec2349002b5980a01f27cef"],["images/icons/ms-icon-70x70.png","a110cf0132b00b23a8605ca72a8874ba"],["images/icons_8.png","ffcdd01817ecdb32b92bd2f1e4d75e84"],["images/inkoop.png","1cff77d2c927657d3aceeba2c12db892"],["images/intygrate.png","fdd390b44a4aeed763f53f4e8f6529e4"],["images/isle_of_code.png","42f662ab71b943889f8f8b56515350f2"],["images/isolutions_uk_limited.png","0f76512940c38b72fcf48337b4d64692"],["images/jqwidgets_ltd.png","6d209e39ca89483f3677ae859edca4d7"],["images/laravel.png","9a2fba3eca41e26743dc731e3a4469b6"],["images/lifecycle.png","e0a342d6e978cec8c83354bbaaa3b0e9"],["images/logged-proxied-data.png","716e3c41aacf453cfaedd61c2795f0ec"],["images/logo.png","cf23526f451784ff137f161b8fe18d5a"],["images/marcus_hiles.png","8b55f40abd154200ce72b8cdb6a8d90f"],["images/memory-leak-example.png","c2fae8bd6d8fa50632f9cde80be8b3f6"],["images/menu.png","0b414c367f5e7c0eb1b40f1076216b08"],["images/modus.png","6498c04fee5b8542449b350e77180379"],["images/moovweb.png","8183954731fdeb0f136fac1485198184"],["images/mvvm.png","841485f73dfdd2773c544649948c505d"],["images/nativescript.png","05c94493b428db55bb441faaca4b02d8"],["images/neds.png","1f1a2a46c2575019ae07a90205f60b65"],["images/netflix_vpn.png","ac75acaa7e0c6c12511cb2d3aed3c0c6"],["images/okay.png","3fdb892c86df8ef6a2088d38be7be941"],["images/onsen_ui.png","e41569bcb10fbca3f361d818b29ed7fd"],["images/opteo.png","e80eaa359d4722af5fd8fed79fb9eec5"],["images/oxford-comma.jpg","8a220093d78172e4eb9d98529f9fba05"],["images/passionate_people.png","03e59e28347e1dcd165e4e1525afb545"],["images/patreon.png","99eb0cdcab5f46697e07bec273607903"],["images/paypal.png","067bd556ce9e4c76538a8057adb6d596"],["images/philip_john_basile.gif","35fc21939087e126d93d173491900c70"],["images/piratebay_proxy.png","c3049e3d886a22dfd0d5c8eaba67b8ff"],["images/piratebayproxy.png","c3049e3d886a22dfd0d5c8eaba67b8ff"],["images/primevue.png","60f2e8fb0dce3e9045fc3a2a8039fa82"],["images/programmers_io.png","02cb415eb9a8e9ce6579c7aff03759dd"],["images/props-events.png","fa3d27510609ecde97606107a83c3dbb"],["images/pullrequest.svg","50847513b306736d33234d50b11c5e1d"],["images/retool.png","aaad6a749deb625da5771750dcb51920"],["images/roadster.png","080fb711e736d686f182358a582d7c6b"],["images/search-by-algolia.png","3f22d84b817bb896bd5bef0705ff8fc7"],["images/search.png","3a38056b0f3ec4fcac63c4d1c3841cab"],["images/shopware_ag.png","e2ded483c0660bd629938e37f388d9fb"],["images/shopware_ag.svg","5d2a8176b6e1b0a348339746de3edf28"],["images/special-sponsor-spot.png","860ea231e9bd1b3ff35e627eb83bb936"],["images/staff_augmentation.png","999025bb7194afd0fb71a94dbe77146f"],["images/state.png","ee5d4923234c072fabbd9269425b2fcd"],["images/stdlib.png","8693858c969505b29339bf84c0a5cbdf"],["images/storekit.png","cacf47116e5efe9fc2dcd60ebc197707"],["images/storyblok.png","64ec1772109b769e91138b58526484ad"],["images/syncfusion.png","fd1617455479c2e3265656c167faeb91"],["images/tee__.png","ea5fd763d459d3942e50c323fa32988a"],["images/tendermint.png","a529fd7a1a0d62f2cb7953e87f8687ce"],["images/tidelift.png","831935bd53d7d2d4eea9427c5f874816"],["images/tighten_co.png","003364e7044150e2979cbfe03d640cec"],["images/tooltwist.png","b81bfd5ae608e965d03aaa5a4164373e"],["images/transition.png","5990c1dff7dc7a8fb3b34b4462bd0105"],["images/typescript-type-error.png","1665e7350370c091d397383a7355d3a6"],["images/unicorn_io.png","e0c072bd78f366471a393b9c366c9b74"],["images/usave.png","5cffd5053b1d75ae49c9b6eb176e0ccf"],["images/valuecoders.png","818ca42a745e018ace0c55c36a7ae3dd"],["images/vehikl.png","3bd1b88aa9d242d308e838f2342d7660"],["images/vpn_review.png","7d40e6362db451204e14ffdc8a42a80f"],["images/vpnranks.png","35d7392e773d487e13358d8b5f7fb646"],["images/vpsserver_com.png","7ed2ee5d1cc7ca87137751880d84b566"],["images/vue-component-with-preprocessors.png","a5cb959052c9cda793e23a6e3a6a122c"],["images/vue-component.png","6a7040cfd4330a536d980c69e2e8dd18"],["images/vuejobs.png","77ed618e17571d1a2d77ad7bc53e8fc4"],["images/vuemastery.png","6f09ce143467fba22039bde3f2070c19"],["images/vueschool.png","3d92b4f1a8fcbe3be0d0e89950a1a705"],["images/vuetify.png","c7cfff77abb10162cb0b7c2ed3b6ac51"],["images/vuetraining_net__note__since_i_m_not_sure_where_else_to_put_it____this_is_replacing_vuescreencasts___they_re_both_run_by_me__i_m_just_switching_where_i_want_my_sponsorship_to_point_.png","4f23eba857989b1203ed74c10abca9e7"],["images/watchcartoononline.png","f7cf1082b14003908496f02f9eb2ae00"],["images/webdock.png","6b8d3d271ba4d05daf83ad75d21221d1"],["images/webucator.png","3c87885f4c36bc1b07f8c2b547e84b6f"],["images/wilderminds.png","cd98b69653b51369da2e765097f13d6f"],["images/writers_per_hour.jpg","2033e6d7e88969e97e78e38d8d030eb9"],["images/x_team.png","a6cfaebb0c0dc17d348bc9c6fd5758ef"],["images/y8.png","3cdd8826d3419751f40a8aa7f90cd539"],["images/yakaz.png","f1918919114e35d6091e67370450e8bd"],["index.html","326cde1e4e602c37c9c199448be5d26a"],["js/common.js","e0dbb30e3238838e96964dedc87617ad"],["js/css.escape.js","fe4db48c9e3f272a6d12cf1312de889e"],["js/smooth-scroll.min.js","ecaa94f311c27bd2ac704a9658ff9cef"],["js/theme-data.js","c72726276d47c154b8b66348a3efb2a2"],["js/vue.js","3e2664e064c50a0e8d3ba83081826a2c"],["js/vue.min.js","b21b8531847604ab5f2f5caaef51ba31"],["menu/index.html","ec7431ffebd329489e814abbcc69c605"],["page/2/index.html","cfd4652bbe983b407dae4eee0f3b9921"],["perf/index.html","c824008ee17d3e066d90e081e4d16596"],["resources/partners.html","03c2494ed4a5de94c4a49b15dcd3b725"],["resources/themes.html","8bb5cdadd4826fb8d356a2704fa56a34"],["support-vuejs/index.html","f52590e12cb12f5c8c9fcad4af01e124"],["v2/api/index.html","a449228d34abcb707c11b210406a6ac7"],["v2/cookbook/adding-instance-properties.html","d4638e14921b74543c6b46f12665b813"],["v2/cookbook/avoiding-memory-leaks.html","5f3c339d2c31942a39adc3278ed2704b"],["v2/cookbook/client-side-storage.html","40cd73832a0ac63f574da9cabe4aaeb8"],["v2/cookbook/creating-custom-scroll-directives.html","6ca1d659f07cf8bca82546fb837d7905"],["v2/cookbook/debugging-in-vscode.html","7cb0ee23afd4b83ca018f4a78e6b1273"],["v2/cookbook/dockerize-vuejs-app.html","ffdadbe13c6f95eb736ed523505a61c7"],["v2/cookbook/editable-svg-icons.html","18b6a59382a7b5db9cefb88f196df6b5"],["v2/cookbook/form-validation.html","b727694e146aaaa9f938aeb1ba34901a"],["v2/cookbook/index.html","bc784277ed562cf7832bbc69e79db63d"],["v2/cookbook/packaging-sfc-for-npm.html","6abba658dbcb811853e958cb645620e6"],["v2/cookbook/practical-use-of-scoped-slots.html","22a65f80a6364b6460964c6c2b308f25"],["v2/cookbook/serverless-blog.html","0b4e1b6cbef45f42f92636496bd22512"],["v2/cookbook/unit-testing-vue-components.html","9bab4ebefc903ac1dd11fb4a05ff8ef5"],["v2/cookbook/using-axios-to-consume-apis.html","5199a0c057a65555317372e86f716138"],["v2/examples/commits.html","f2fb76b64f0fec2f9fa68dcccccaeb12"],["v2/examples/deepstream.html","1fc10ef5a2d0046f1698b7a573825b77"],["v2/examples/elastic-header.html","32bbf4ef0bd29864bb11b16e675dd933"],["v2/examples/firebase.html","8243560e612f39e2b0c8e7c2a63d7011"],["v2/examples/grid-component.html","4bbee05a49c6e6370d1c000142ae6659"],["v2/examples/hackernews.html","fa6d62a03a5408d6fd6059be23aa8cd5"],["v2/examples/index.html","c0f639a83be95d721095ef79d64c6c5a"],["v2/examples/modal.html","4f24a0a53b22b20b5502323efc3fe111"],["v2/examples/select2.html","62fd6c543efbe51acd4a36d763634a6b"],["v2/examples/svg.html","0f7b175f4165206edbbe7a81e4bc7692"],["v2/examples/todomvc.html","164bf8ceba30cdaf66c39e9d15adb482"],["v2/examples/tree-view.html","1885fb0ad1d520d523e64db88e307459"],["v2/examples/vue-10-two-way-currency-filter-v2/index.html","8527cc9d8dab5733d0ed8febf49344f2"],["v2/examples/vue-10-two-way-currency-filter-v3/currency-validator.js","38c3c6804f52f9dc0e1e1d3f0df71576"],["v2/examples/vue-10-two-way-currency-filter-v3/index.html","35edf2ae2e4064aa5a9d046f6a191ae1"],["v2/examples/vue-10-two-way-currency-filter/index.html","2b6fcbb70ade6ee374787e3fc77ade22"],["v2/guide/class-and-style.html","2dcd5979e7c822d6ab9e9ecced5ae1f5"],["v2/guide/comparison.html","6e9cc62bf13732750c18e8907552f459"],["v2/guide/components-custom-events.html","2f4405872b1dea1f0e48ec65b80a1947"],["v2/guide/components-dynamic-async.html","7010d4443c265886dae3008f8ce5dfaa"],["v2/guide/components-edge-cases.html","c357a69e78f749f207ab979f0a9cecdc"],["v2/guide/components-props.html","033c061fabebbe8e8ceb717e130ae303"],["v2/guide/components-registration.html","fe695e89c8105259593aa09440f0380e"],["v2/guide/components-slots.html","fa4b1f8aa6576f865e02c3e1f5cdf8ed"],["v2/guide/components.html","e0ea5e227f97f0cd859ce6364f52d2d4"],["v2/guide/computed.html","5ed9362ca0ade09bca15da3858c75cbf"],["v2/guide/conditional.html","a18267d3f4c0fe458de17f4893f0c349"],["v2/guide/custom-directive.html","188fce81aed54170d3408237a5e301eb"],["v2/guide/deployment.html","307002b34ed7e032545d6f9d4dde4046"],["v2/guide/events.html","45f93dbd102e6d6fb0902d1a5835050c"],["v2/guide/filters.html","14b03aeb8cc8ef06157928e439cc5168"],["v2/guide/forms.html","91771de16b98ba78e73526852cbafc31"],["v2/guide/index.html","ff6883c10e39e250992378c7e72833ab"],["v2/guide/installation.html","39a4969020c840c954dd8f1ae5e7bd71"],["v2/guide/instance.html","e8d498bc50dc173499f733f99d6cdedb"],["v2/guide/join.html","86d7d16e86378f8ed6b2f091e2a029c2"],["v2/guide/list.html","c54481c923b6e9767f1980296a39ccaf"],["v2/guide/migration-vue-router.html","c2cca8ab6543aef70a0400d460c6dc37"],["v2/guide/migration-vuex.html","b53191007c3e6f3ab716078a370870af"],["v2/guide/migration.html","2f17102bd672919330715e923694f26a"],["v2/guide/mixins.html","d6bbec08cc0d8447660aa0bff685e003"],["v2/guide/plugins.html","aabeb0e667c0129d75033dda52f2dd5b"],["v2/guide/reactivity.html","42765a16df8cdeefc4552af17749df55"],["v2/guide/render-function.html","7c623d189dba7bd300f03c3c7c23619e"],["v2/guide/routing.html","e37172e73641cc6703768ddbc374e0cc"],["v2/guide/security.html","e6448ec3ed3ae040ce4590f2f1a917e6"],["v2/guide/single-file-components.html","22ed7b20ff0bf566c324bf60d8418977"],["v2/guide/ssr.html","768597a6c5f79cd6a0cb5a9c123885fe"],["v2/guide/state-management.html","2f12e484cb6e637d3066007ab5f086af"],["v2/guide/syntax.html","b4e022484189bdc0c887056f93424ff2"],["v2/guide/team.html","54455eb8d829bb158c7c40485497905b"],["v2/guide/testing.html","a8579b3dd55aa11e23c14f330fa98751"],["v2/guide/transitioning-state.html","508f79cb611e5c52893ce98f6fb29619"],["v2/guide/transitions.html","411e4f6f3eeebe22ae7a4e7aec9b5ac2"],["v2/guide/typescript.html","9965bd7d53927d2d5ea6bdc1968f412d"],["v2/search/index.html","68ca71a3e5d9188951113e43a1f904ad"],["v2/style-guide/index.html","42c7deff7aecb9c73bb40834387e9a67"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







