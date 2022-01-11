import { createStore } from "vuex";
import { auth } from "./auth.module";
import { activity } from "./activities.module";

const store = createStore({
  modules: {
    auth,
    activity
  },
});

export default store;