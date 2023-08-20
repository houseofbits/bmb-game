import "@style/main.css";
import "@style/layout.scss";
import { createApp } from "vue";
import MainApp from "@src/MainApp.vue";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  components,
  directives,
});

const app = createApp(MainApp).use(vuetify);
// app.config.globalProperties.$bus = new EventBus();
app.mount("#gui");
