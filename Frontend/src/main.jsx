import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import store from "./store/index.js";
import { setAxiosStore } from "./api/client.js";
import { me } from "./store/auth/authSlice.js";

// Setear store en Axios para interceptor
setAxiosStore(store);

// Si hay token en el estado inicial, cargar usuario
const state = store.getState();
if (state.auth.token && !state.auth.user) {
  store.dispatch(me());
}

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
