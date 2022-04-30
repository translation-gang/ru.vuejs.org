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

var precacheConfig = [["2014/03/22/vuejs-010-release/index.html","79e5f22c07f03bc2487a884856c61b41"],["2014/07/29/vue-next/index.html","8dc0d8038a138d7edbf84c798eeea3f7"],["2014/11/09/vue-011-release/index.html","bfd70758d3b9382d673d2cd93825b896"],["2014/12/08/011-component/index.html","df498d2f3b92bddc318641cd47e7f956"],["2015/06/11/012-release/index.html","fd51530a61c7b54434d7f86ac53234e3"],["2015/10/26/1.0.0-release/index.html","4963da681b4c9c4ce14376a31fe0b97d"],["2015/10/28/why-no-template-url/index.html","34bf1cf3045cce17d030fdf021efbb03"],["2015/12/28/vue-cli/index.html","a0b27f99c4a38a84deac7aa0ecc857e1"],["2016/02/06/common-gotchas/index.html","4ac76c2bfdb4b7793acb54fb58683393"],["2016/03/14/march-update/index.html","5ee7a976be3cf90a7fadfa81596ca79b"],["2016/04/27/announcing-2.0/index.html","082dac4d5c13f413557400067fe378ab"],["api/index.html","176a72f4aaa42c3b6a404d370e87fbb8"],["archives/2014/03/index.html","928e7260f2f2babe2e4560bb4e7b9e9a"],["archives/2014/07/index.html","1493a417f25049722ccdedc2ff07dd4b"],["archives/2014/11/index.html","7d6d47a1d3b92bbc9a23d6dc5aab6bb0"],["archives/2014/12/index.html","32ec6ac57e6fb43a4900947b259e1ed9"],["archives/2014/index.html","61f91498efca7ccc4a4d16655c15ebfb"],["archives/2015/06/index.html","ba8117d178f42180ee071f2ca4ced3aa"],["archives/2015/10/index.html","59a6552bf9d25bdb669ff65194feec4b"],["archives/2015/12/index.html","e1c676a2eeb796622d139a720a1cac23"],["archives/2015/index.html","0f9ff5fa339bbff6ffc0c0d64925d5d2"],["archives/2016/02/index.html","0cfcbc8ba5368480221b8f8cf21d2d00"],["archives/2016/03/index.html","21a80c6c167c8a55c9c10c20bacedf26"],["archives/2016/04/index.html","fa6a6c31559e82723e2aaa2f01612818"],["archives/2016/index.html","8d90b9c513698189e86b5c76a02ca4a2"],["archives/index.html","bee25a1e4ce6be13d556899f8a9e57a8"],["archives/page/2/index.html","9616541d86aa8fdb88d79cd84059e537"],["coc/index.html","0df70e3cec92f0958c0a4e3f3ba82c21"],["css/benchmark.css","b083e0006589a5ba88a250eb8ee12cc5"],["css/index.css","df0779ce1dd9c21bb4db365f619f79de"],["css/page.css","e94b1deaa248993af597d95217320e52"],["css/search.css","98bc5fed33d9deaea04ed36de435afd7"],["examples/commits.html","3cd3b2db40187e7f2d236473bae9ce59"],["examples/elastic-header.html","198f4c19911bf30785905adb996ef899"],["examples/firebase.html","266080b80e262a2b93289d466d1337b5"],["examples/grid-component.html","3119ba25bb6b9dcc2f40d3f60e2136df"],["examples/hackernews.html","f793aeb8d340c60945b0a58f3afa25c9"],["examples/index.html","dc91b34e726c12318c4d083a3090c156"],["examples/modal.html","88b6a98ec8a44cd783eaf0d71fcf46a7"],["examples/select2.html","b812ad3b215af513c979c0d9759fe5c9"],["examples/svg.html","0a1876c72d22212d243ed8c2d5b0404e"],["examples/todomvc.html","a048618225f78a66ff322bb1dde98a37"],["examples/tree-view.html","4815e09c4b3af4132da0e95dc1fbc945"],["fonts/SourceSansPro-Light.otf.woff","7d901d6001e12e3fd36572daa796e9cc"],["fonts/SourceSansPro-Regular.otf.woff","bbd955e1383a2ab663298511a163d3dc"],["fonts/SourceSansPro-Semibold.otf.woff","99f66ff4eab8123edcaa32fd744cb791"],["guide/class-and-style.html","a3174f2083dd58fbd1aa965dcc98133f"],["guide/comparison.html","7c06634379b01b8e7ef0dfc90b9b8517"],["guide/components.html","d98663b0d45a91f0a40541c1efe2bbfc"],["guide/computed.html","3fcf408c7cdfd856ea75b6a5562ba8aa"],["guide/conditional.html","896e19e7955f2616eb31ab4d8c65178c"],["guide/custom-directive.html","697987fdd04783febdbff2aa2932c41d"],["guide/deployment.html","be96515c673712671d042337366ddf63"],["guide/events.html","0ebaec88003f2e1ab59ff868764d961a"],["guide/forms.html","09ead2d35e42cdd09d848b27ec357491"],["guide/index.html","e3171c7c94b236d5caa91894d8fdd581"],["guide/installation.html","8acd1ab4fbaa082958259bf3a22d7b22"],["guide/instance.html","61021765831307e8278d034c23502dd6"],["guide/join.html","f2287c54050c9b576ed05af7baf6af73"],["guide/list.html","772e05d65b4587501785906a4b681efd"],["guide/migration-vue-router.html","e0d8a3e2dc09e2bda939c23c1e967765"],["guide/migration-vuex.html","9b8659c8a4506acd24f2c0e3bee160f3"],["guide/migration.html","af37d4bfb217e88a7f02eb92c446497f"],["guide/mixins.html","270f751a44e1d1e18b9a31406a34fe8b"],["guide/plugins.html","40467c9724e4917ae32582ac543db41b"],["guide/reactivity.html","5b1e83c4a12b5f3e687e89e0a0b1ef05"],["guide/render-function.html","4139dd80783f9eecb92d57dcf23dc54d"],["guide/routing.html","f7f89a93550ee84e925ed84d6912a650"],["guide/single-file-components.html","095eb3d7152439579d7a56227fe273f4"],["guide/ssr.html","9143accd02c56349a3ec40d79eeefb4d"],["guide/state-management.html","81ea6d4aee3ef538b507e4a5a0c3e3a0"],["guide/syntax.html","611a256a910e0d1adfd5b418535e0ac1"],["guide/transitioning-state.html","3f36248a3d9f6f21f10725f15775c5d6"],["guide/transitions.html","4513c62165ee217697830a40e1795365"],["guide/unit-testing.html","0f69c6b7a8d743af6384b8a2208b9a33"],["images/Monterail.png","bf1ec94a0ca48f0e6be0c97fa60a42c0"],["images/aaha.png","77bfeb59f772f37444c9cefe00785cf2"],["images/accelebrate.png","e030e08131cebe8b43c89df18d710ded"],["images/alligator_io.svg","1ffe0191e22a65337f9cb224790f5222"],["images/autocode.svg","4319bc58220eb3ffaa993488c171c0dc"],["images/bacancy_technology.png","5810bb8253b1e35ba437373ff83f82d3"],["images/bestvpn_co.png","afbe252b6b59bc3cdac2e7dec69eac39"],["images/bit.png","9638a3f44bf471876effb80ea0659f73"],["images/blokt_cryptocurrency_news.png","0ecada49bad35aabc864a8df221fd816"],["images/breakpoint_hit.png","114924925a4ec0f23236012bc3dc8422"],["images/breakpoint_set.png","6439856732303cfeb3806d52dd681191"],["images/chaitin.png","549e43997790dc624c477424acbfe228"],["images/check.png","c634675b753a1a03b587c43d8b535600"],["images/cloudstudio.png","fc480cf4c2b06591f58e7e91666226af"],["images/coding.png","10c55345da3c2374563b096f5c86d781"],["images/coin-bch.png","ddfab54149483e02f3cd540a47e2782b"],["images/coin-btc.png","d90559bb202766dd6ddabf71dd1680be"],["images/coin-eth.png","70ae70292937880fe9e77c2c7dc38f86"],["images/coin-ltc.png","9e756bd611ac7355515153cecbc20d36"],["images/components.png","b5c08269dfc26ae6d7db3801e9efd296"],["images/config_add.png","353cd8b2a1bdf9fc4c74a80c5f38090a"],["images/daily.png","c9a8b2a897dba41c7d5aa6f9cd876d82"],["images/data.png","8624e58259d141a93c1d23b2c72904cd"],["images/dcloud.gif","ade7c64e66506b6cff10292efea16ee8"],["images/derek_pollard.png","b1c4d535b619865d80d6cf1b2e370300"],["images/devexpress.png","a6d9c786a373088c8d238ca643293c17"],["images/devsquad.png","e639ea4fd0d7053fc0928d4ff9fefb2a"],["images/devtools-storage-chrome.png","ac1f3b275b87e2fec9c4df951347be81"],["images/devtools-storage-edge.png","3e92a3bea017b8398e71db0a2419a191"],["images/devtools-storage.png","e742c3b1d526bee7be77c050f4bffc92"],["images/devtools-timetravel.gif","fca84f3fb8a8d10274eb2fc7ed9b65f9"],["images/dom-tree.png","f70b86bfbbfe1962dc5d6125105f1122"],["images/dopamine.png","17222090b66cfca59f1ccf8b9843f595"],["images/down.png","2f948222df409af3121254d5fe0ed377"],["images/earthlink.png","88f1bd15252b11484834176965844e22"],["images/energy_comparison.png","1f3f2809057b867842c99679e2723b3e"],["images/fastcoding_inc.png","08a0a7652db79fa3395c0ef28d49f0cd"],["images/fastcoding_inc.svg","ff35e14cb519fe5d76e6e8d9444e4fa6"],["images/feed.png","a9bbd11a96e1cbcc49bf8fa857a0d70f"],["images/firestick_tricks.png","1ee05223a5b12fe910cb8428d57223d8"],["images/flatlogic_templates.svg","925f0c4421cc6d86ebc9d6788b519220"],["images/foo.png","1c9cde53bb9c98a316edc93d57684e4d"],["images/frontend_love.png","b514babc53a0f3ddc854b0b14a54a489"],["images/frontendlove.png","b514babc53a0f3ddc854b0b14a54a489"],["images/gitee.png","429b3c31a180461c4fb66e5ac20e1385"],["images/gridsome.png","e82a2f872ec319bbb5d0a804288cd9b7"],["images/happy_programmer_llc.png","3f3303d42a57ff9edf36373f59d376af"],["images/hn-architecture.png","46cae6ac236cf9e8c42be2018d69afc6"],["images/hn.png","99176cdebac521e823be519aef514bb3"],["images/html_burger.png","c7ce1344d001e7a236a89694ed59d988"],["images/icons.png","ad6ee8c400066e15712cdef4342023da"],["images/icons/android-icon-144x144.png","e67b8d54852c2fbf40be2a8eb0590f5b"],["images/icons/android-icon-192x192.png","5d10eaab941eb596ee59ffc53652d035"],["images/icons/android-icon-36x36.png","bb757d234def1a6b53d793dbf4879578"],["images/icons/android-icon-48x48.png","0d33c4fc51e2bb020bf8dd7cd05db875"],["images/icons/android-icon-72x72.png","702c4fafca31d670f9bd8b2d185ced39"],["images/icons/android-icon-96x96.png","0ebff702851985ea6ba891cf6e6e7ddd"],["images/icons/apple-icon-114x114.png","f4fd30f3a26b932843b8c5cef9f2186e"],["images/icons/apple-icon-120x120.png","b6a574d63d52ef9c89189b67bcac5cbd"],["images/icons/apple-icon-144x144.png","e67b8d54852c2fbf40be2a8eb0590f5b"],["images/icons/apple-icon-152x152.png","f53787bf41febf2b044931a305ccaf2a"],["images/icons/apple-icon-180x180.png","9f6b1e3b92b2c5bd5b7d79501bb6e612"],["images/icons/apple-icon-57x57.png","83f622ba0994866abc56ace068b6551c"],["images/icons/apple-icon-60x60.png","643f761bc39f86c70f17cd1fed3b8e08"],["images/icons/apple-icon-72x72.png","702c4fafca31d670f9bd8b2d185ced39"],["images/icons/apple-icon-76x76.png","94d9af047b86d99657b5efb88a0d1c7b"],["images/icons/apple-icon-precomposed.png","707758f591323153a4f1cb3a8d9641fa"],["images/icons/apple-icon.png","707758f591323153a4f1cb3a8d9641fa"],["images/icons/favicon-16x16.png","a5a9da66870189b0539223c38c8a7749"],["images/icons/favicon-32x32.png","3d60db0d77303b2414ddd50cf2472bf7"],["images/icons/favicon-96x96.png","0ebff702851985ea6ba891cf6e6e7ddd"],["images/icons/ms-icon-144x144.png","e67b8d54852c2fbf40be2a8eb0590f5b"],["images/icons/ms-icon-150x150.png","e8cdf492981122a2548bc247c7b4067d"],["images/icons/ms-icon-310x310.png","1721f8303ec2349002b5980a01f27cef"],["images/icons/ms-icon-70x70.png","a110cf0132b00b23a8605ca72a8874ba"],["images/icons_8.png","ffcdd01817ecdb32b92bd2f1e4d75e84"],["images/inkoop.png","1cff77d2c927657d3aceeba2c12db892"],["images/intygrate.png","fdd390b44a4aeed763f53f4e8f6529e4"],["images/isle_of_code.png","42f662ab71b943889f8f8b56515350f2"],["images/isolutions_uk_limited.png","0f76512940c38b72fcf48337b4d64692"],["images/jqwidgets_ltd.png","6d209e39ca89483f3677ae859edca4d7"],["images/laravel.png","9a2fba3eca41e26743dc731e3a4469b6"],["images/lifecycle.png","e0a342d6e978cec8c83354bbaaa3b0e9"],["images/logged-proxied-data.png","716e3c41aacf453cfaedd61c2795f0ec"],["images/logo.png","cf23526f451784ff137f161b8fe18d5a"],["images/marcus_hiles.png","8b55f40abd154200ce72b8cdb6a8d90f"],["images/memory-leak-example.png","c2fae8bd6d8fa50632f9cde80be8b3f6"],["images/menu.png","0b414c367f5e7c0eb1b40f1076216b08"],["images/modus.png","6498c04fee5b8542449b350e77180379"],["images/moovweb.png","8183954731fdeb0f136fac1485198184"],["images/mvvm.png","841485f73dfdd2773c544649948c505d"],["images/nativescript.png","05c94493b428db55bb441faaca4b02d8"],["images/neds.png","1f1a2a46c2575019ae07a90205f60b65"],["images/netflix_vpn.png","ac75acaa7e0c6c12511cb2d3aed3c0c6"],["images/okay.png","3fdb892c86df8ef6a2088d38be7be941"],["images/onsen_ui.png","e41569bcb10fbca3f361d818b29ed7fd"],["images/opteo.png","e80eaa359d4722af5fd8fed79fb9eec5"],["images/oxford-comma.jpg","8a220093d78172e4eb9d98529f9fba05"],["images/passionate_people.png","03e59e28347e1dcd165e4e1525afb545"],["images/patreon.png","99eb0cdcab5f46697e07bec273607903"],["images/paypal.png","067bd556ce9e4c76538a8057adb6d596"],["images/philip_john_basile.gif","35fc21939087e126d93d173491900c70"],["images/piratebay_proxy.png","c3049e3d886a22dfd0d5c8eaba67b8ff"],["images/piratebayproxy.png","c3049e3d886a22dfd0d5c8eaba67b8ff"],["images/primevue.png","60f2e8fb0dce3e9045fc3a2a8039fa82"],["images/programmers_io.png","02cb415eb9a8e9ce6579c7aff03759dd"],["images/props-events.png","fa3d27510609ecde97606107a83c3dbb"],["images/pullrequest.svg","50847513b306736d33234d50b11c5e1d"],["images/retool.png","aaad6a749deb625da5771750dcb51920"],["images/roadster.png","080fb711e736d686f182358a582d7c6b"],["images/search-by-algolia.png","3f22d84b817bb896bd5bef0705ff8fc7"],["images/search.png","3a38056b0f3ec4fcac63c4d1c3841cab"],["images/shopware_ag.png","e2ded483c0660bd629938e37f388d9fb"],["images/shopware_ag.svg","5d2a8176b6e1b0a348339746de3edf28"],["images/special-sponsor-spot.png","860ea231e9bd1b3ff35e627eb83bb936"],["images/staff_augmentation.png","999025bb7194afd0fb71a94dbe77146f"],["images/state.png","ee5d4923234c072fabbd9269425b2fcd"],["images/stdlib.png","8693858c969505b29339bf84c0a5cbdf"],["images/storekit.png","cacf47116e5efe9fc2dcd60ebc197707"],["images/storyblok.png","64ec1772109b769e91138b58526484ad"],["images/syncfusion.png","fd1617455479c2e3265656c167faeb91"],["images/tee__.png","ea5fd763d459d3942e50c323fa32988a"],["images/tendermint.png","a529fd7a1a0d62f2cb7953e87f8687ce"],["images/tidelift.png","831935bd53d7d2d4eea9427c5f874816"],["images/tighten_co.png","003364e7044150e2979cbfe03d640cec"],["images/tooltwist.png","b81bfd5ae608e965d03aaa5a4164373e"],["images/transition.png","5990c1dff7dc7a8fb3b34b4462bd0105"],["images/typescript-type-error.png","1665e7350370c091d397383a7355d3a6"],["images/unicorn_io.png","e0c072bd78f366471a393b9c366c9b74"],["images/usave.png","5cffd5053b1d75ae49c9b6eb176e0ccf"],["images/valuecoders.png","818ca42a745e018ace0c55c36a7ae3dd"],["images/vehikl.png","3bd1b88aa9d242d308e838f2342d7660"],["images/vpn_review.png","7d40e6362db451204e14ffdc8a42a80f"],["images/vpnranks.png","35d7392e773d487e13358d8b5f7fb646"],["images/vpsserver_com.png","7ed2ee5d1cc7ca87137751880d84b566"],["images/vue-component-with-preprocessors.png","a5cb959052c9cda793e23a6e3a6a122c"],["images/vue-component.png","6a7040cfd4330a536d980c69e2e8dd18"],["images/vuejobs.png","77ed618e17571d1a2d77ad7bc53e8fc4"],["images/vuemastery.png","6f09ce143467fba22039bde3f2070c19"],["images/vueschool.png","3d92b4f1a8fcbe3be0d0e89950a1a705"],["images/vuetify.png","c7cfff77abb10162cb0b7c2ed3b6ac51"],["images/vuetraining_net__note__since_i_m_not_sure_where_else_to_put_it____this_is_replacing_vuescreencasts___they_re_both_run_by_me__i_m_just_switching_where_i_want_my_sponsorship_to_point_.png","4f23eba857989b1203ed74c10abca9e7"],["images/watchcartoononline.png","f7cf1082b14003908496f02f9eb2ae00"],["images/webdock.png","6b8d3d271ba4d05daf83ad75d21221d1"],["images/webucator.png","3c87885f4c36bc1b07f8c2b547e84b6f"],["images/wilderminds.png","cd98b69653b51369da2e765097f13d6f"],["images/writers_per_hour.jpg","2033e6d7e88969e97e78e38d8d030eb9"],["images/x_team.png","a6cfaebb0c0dc17d348bc9c6fd5758ef"],["images/y8.png","3cdd8826d3419751f40a8aa7f90cd539"],["images/yakaz.png","f1918919114e35d6091e67370450e8bd"],["index.html","d3a46c2725f21810991f28dbf313ca00"],["js/common.js","e0dbb30e3238838e96964dedc87617ad"],["js/css.escape.js","fe4db48c9e3f272a6d12cf1312de889e"],["js/smooth-scroll.min.js","ecaa94f311c27bd2ac704a9658ff9cef"],["js/theme-data.js","c72726276d47c154b8b66348a3efb2a2"],["js/vue.js","3e2664e064c50a0e8d3ba83081826a2c"],["js/vue.min.js","b21b8531847604ab5f2f5caaef51ba31"],["menu/index.html","ee5b0dacaa5c71c0691fe871e8eb9385"],["page/2/index.html","5c2139f3b878c41d4560b063519da544"],["perf/index.html","391d090a92b46436bbd29ef5b377fb2e"],["resources/partners.html","b7e8b04595c4cb2642aa2ba458c9bd2a"],["resources/themes.html","4b1719a729a4fc4476af0c2e308005e6"],["support-vuejs/index.html","b3129b538859b600f488ba47088189d5"],["v2/api/index.html","0d353a6d23c8a16869db81d373b3627f"],["v2/cookbook/adding-instance-properties.html","b5c9cd6063af43004073af7cf0fd6b30"],["v2/cookbook/avoiding-memory-leaks.html","383948eb30c078746fc50808eb6b1260"],["v2/cookbook/client-side-storage.html","f30e903f21e30b669a7ce13bc05072a9"],["v2/cookbook/creating-custom-scroll-directives.html","702f2f850613431589c84ae0ca10c9fe"],["v2/cookbook/debugging-in-vscode.html","b97341cc1b84b780cc56dc95e2a5bad5"],["v2/cookbook/dockerize-vuejs-app.html","d5f6a1797a2cd022478ed51deb02c4fa"],["v2/cookbook/editable-svg-icons.html","a9992c6de94d3b17ef909d99fad8a5a2"],["v2/cookbook/form-validation.html","fe20bf85efe9bae025dcef7820ddb3ff"],["v2/cookbook/index.html","df2f987183df9e13b07fdea974367a53"],["v2/cookbook/packaging-sfc-for-npm.html","07fdcad9ae1b4ecb0dfe7b6db5fa89ec"],["v2/cookbook/practical-use-of-scoped-slots.html","ce0787393c5ec2a57b59c5175cf3d8b3"],["v2/cookbook/serverless-blog.html","a056abe100c280d2b03c5ef76ec2345a"],["v2/cookbook/unit-testing-vue-components.html","3bde2d004edd0a09c6a8ad0b192a2fa2"],["v2/cookbook/using-axios-to-consume-apis.html","2b935bc14909b349391887d3aa33cb0a"],["v2/examples/commits.html","4e597bf895b10aaf7f387a74d788fbd8"],["v2/examples/deepstream.html","862168fa424d2e8190adbbbdf68d1321"],["v2/examples/elastic-header.html","40c61818577c5fd7fb847060904370e6"],["v2/examples/firebase.html","7c2a77e85c07fb96a2248a38ab67e25d"],["v2/examples/grid-component.html","ba89ff696c79f68f56605cb6e11ff930"],["v2/examples/hackernews.html","9a3a131a329c115147bcb42927f890c6"],["v2/examples/index.html","f7e418eb94aa5f3e201167c80a97786d"],["v2/examples/modal.html","049c515d78f8b62b23a5a357cca59f83"],["v2/examples/select2.html","a949d9c5b0c2602e43d282880e08d3e1"],["v2/examples/svg.html","fa4a7e029f3b3ca3cb9b171f08ab2371"],["v2/examples/todomvc.html","c939f835af5449799eaed87b8da52caa"],["v2/examples/tree-view.html","331b9602c2adfad3a7a83d91a02ce39e"],["v2/examples/vue-10-two-way-currency-filter-v2/index.html","88bfeb93a325bcfdd4db83330d81a7b1"],["v2/examples/vue-10-two-way-currency-filter-v3/currency-validator.js","38c3c6804f52f9dc0e1e1d3f0df71576"],["v2/examples/vue-10-two-way-currency-filter-v3/index.html","c1ace9f9f6cc0c084773749b8e815891"],["v2/examples/vue-10-two-way-currency-filter/index.html","01d4735c1b4d9d395f50d4240534f12e"],["v2/guide/class-and-style.html","f0db1597ecd05abf7684d3d4cb2746fe"],["v2/guide/comparison.html","0c0fb7f0bf00fd5d789648d11ea32eb6"],["v2/guide/components-custom-events.html","735aed26bef8b651477c8d23e5e08ad5"],["v2/guide/components-dynamic-async.html","f779522a55be8e58398777c2db58c0e5"],["v2/guide/components-edge-cases.html","8d8083c290c1c2e15efb47b1eda038f1"],["v2/guide/components-props.html","570c72a80aa2502217d7d51af2fc2dea"],["v2/guide/components-registration.html","8ab983bdf0a972eab76598215f135734"],["v2/guide/components-slots.html","507c98a339b30d5538f0a41af5ae58cd"],["v2/guide/components.html","7fa3deb0141dbc3352a37c62afc71a91"],["v2/guide/computed.html","350b514155825791b86ab7969328b686"],["v2/guide/conditional.html","b7f2db22df23b43344b2d88a75aea97f"],["v2/guide/custom-directive.html","6e6361c6cd191225e5fb3bd3b1b6e5f8"],["v2/guide/deployment.html","124b498625d2233543931a12e8f85d13"],["v2/guide/events.html","66cb865a94807d9e5125405849014ee6"],["v2/guide/filters.html","ea0abcf115e1bd408df9f915828f0628"],["v2/guide/forms.html","5ac19042f86cf37d389f81b75a8ce224"],["v2/guide/index.html","6e99d70f30bab91459cd2e86ba06e3c4"],["v2/guide/installation.html","8eeb2af41040f6239dea9a1b4dc71637"],["v2/guide/instance.html","261bd869ebb63a769b5fa32cf9cc25b2"],["v2/guide/join.html","213f1b048b02f8488c9cab27d5342356"],["v2/guide/list.html","46577da8deebb89622e75530db736419"],["v2/guide/migration-vue-router.html","197a54aec5922dfabba5c49a5741d506"],["v2/guide/migration-vuex.html","cc91f5ef868c79f62ccc522f818b100e"],["v2/guide/migration.html","9474bd8168c8b7467e65fcb0d99c4055"],["v2/guide/mixins.html","3bb464006d1fc5b49926b37ba92f20e1"],["v2/guide/plugins.html","8d3f36f9c5e09a7a0b5b7181f86ada18"],["v2/guide/reactivity.html","83a25b9981206aa45a540215edf375b8"],["v2/guide/render-function.html","225587aa30934209a30a2a92d6c51883"],["v2/guide/routing.html","a566f4058255bc271bb55a5b2219fc26"],["v2/guide/security.html","7148a00e0aa7d36a31d0b18f77217bd8"],["v2/guide/single-file-components.html","37edeb38f6918ca0083242a67c2340d4"],["v2/guide/ssr.html","2994983ab71a467b2c5c7fb5c9fe54be"],["v2/guide/state-management.html","562afce5a4cac87ae7c15a5b5373deb7"],["v2/guide/syntax.html","06ef90c2f10f06885baebf359dfeb97d"],["v2/guide/team.html","987bb6832a4867be74bd0a3cfc3994ed"],["v2/guide/testing.html","8da4a60d4e61dade649f4afe06c58b1c"],["v2/guide/transitioning-state.html","7e7133f4a651d2b1157b67fa289dd937"],["v2/guide/transitions.html","5bb3ec0e49bf9ebec0452b3ffaa8b63f"],["v2/guide/typescript.html","830377a5f909e3438aa03e6e03204335"],["v2/search/index.html","7c8ed5363e08f2212a2438c485b56a3d"],["v2/style-guide/index.html","2415d9dcc1191cf266e5ffe5c27c3a50"]];
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







