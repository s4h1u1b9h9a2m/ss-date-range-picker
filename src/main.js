// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";

// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import { Dropdown, DropdownMenu, Select, Option, Button, Checkbox, Input, Popover } from 'element-ui';

import App from "./App";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleDown, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faAngleDown);
library.add(faChevronLeft);
library.add(faChevronRight);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Checkbox);
Vue.use(Input);
Vue.use(Popover);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  components: { App },
  template: "<App/>"
});
