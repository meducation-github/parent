import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ContextProvider } from "./context/index.jsx";
import App from "./App.jsx";
import Home from "./pages/home.jsx";
import React from "react";
import { Signup } from "./pages/account/create/signup.jsx";
import { Login } from "./pages/account/login/index.jsx";
import Chat from "./pages/chat/index.jsx";
import Notifications from "./pages/notifications/index.jsx";
import Settings from "./pages/settings/index.jsx";

createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <BrowserRouter>
      <Routes>
        {/* <Route path="logout" element={<Logout />} /> */}
        <Route path="/" element={<App />}>
          <Route path="" element={<Home />} />
          <Route path="chat" element={<Chat />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<h1>404</h1>} />
        </Route>

        <Route
          path="login"
          element={
            <React.Suspense fallback={<></>}>
              <Login />
            </React.Suspense>
          }
        />

        <Route
          path="/signup"
          element={
            <React.Suspense fallback={<></>}>
              <Signup />
            </React.Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  </ContextProvider>
);
