import { createApp } from "vue";
import App from "./App.vue";

import axios from "axios";
import VueAxios from "vue-axios";
import router from "./router";
import "bootstrap";
import "jquery";
import "popper.js";
import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min.js";
// import "bootstrap/dist/js";

const app = createApp(App);

app.use(VueAxios, axios);
app.use(router);
app.mount("#app");
