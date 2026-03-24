import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import PrivateRoutes from "./routes/PrivateRoutes";

function AppRoutes() {
  const routes = useRoutes([
    ...PublicRoutes,
    ...PrivateRoutes,
  ]);
  return routes;
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;