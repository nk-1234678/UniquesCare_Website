// src/routes/PublicRoutes.jsx
import React from "react";
import PublicLayout from "../layouts/PublicLayout";
import LandingPage from "../pages/LandingPage";
import ContactPage from "../pages/ContactPage";
import AboutPage from "../pages/AboutPage";
import SignUp from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";


const PublicRoutes = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { path: "", element: <LandingPage /> }, 
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage/> },
      { path: "register", element: <SignUp/> },
      { path: "login", element: <LoginPage/> },
    ],
  },
];

export default PublicRoutes;