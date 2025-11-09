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
// import Onboarding from "./pages/account/onboarding.jsx";
// import Admission from "./pages/admission/index.jsx";
// import Curriculum from "./pages/curriculum/index.jsx";

createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <BrowserRouter>
      <Routes>
        {/* <Route path="logout" element={<Logout />} /> */}
        <Route path="/" element={<App />}>
          <Route path="" element={<Home />} />
          <Route path="chat" element={<Chat />} />
          {/* <Route path="" element={<Profile />} /> */}
          {/* <Route path="finance" element={<Finance />}> */}
          {/* <Route path="fees" element={<Fees />} /> */}
          {/* </Route> */}
          {/* <Route path="attendance" element={<Attendance />} />
          <Route path="modules" element={<Modules />} /> */}
          {/* <Route path="admission" element={<Admission />} />
          <Route path="studies" element={<Curriculum />} /> */}
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
