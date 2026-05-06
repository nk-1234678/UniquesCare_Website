// src/routes/PublicRoutes.jsx
import React, { lazy } from "react";
import PublicLayout from "../layouts/PublicLayout";
import NotFoundPage from "../pages/NotFoundPage";

const LandingPage = lazy(() => import("../pages/LandingPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const SignUp = lazy(() => import("../pages/SignupPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));


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
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];

export default PublicRoutes;