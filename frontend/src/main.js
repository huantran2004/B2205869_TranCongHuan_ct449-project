import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";

// Setup jQuery globally first
import "./plugins/jquery.js";

// Then import Bootstrap 4 (requires jQuery)
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css"

createApp(App).use(router).mount("#app");
