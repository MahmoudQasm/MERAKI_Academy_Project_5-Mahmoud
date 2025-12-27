import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
<<<<<<< HEAD
import { Provider } from "react-redux";
import store from "./redux/store.jsx";
=======


>>>>>>> b68565972607588b525061fca6c4a8cc90f30a3e

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
