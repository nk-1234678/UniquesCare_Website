import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import PrivateRoutes from "./routes/PrivateRoutes";
import NotFoundPage from "./pages/NotFoundPage";
import LoadingState from "./components/ui/LoadingState";

function App() {
  const routes = useRoutes([
    ...PublicRoutes,
    ...PrivateRoutes,
    { path: "*", element: <NotFoundPage /> },
  ]);

  return <Suspense fallback={<LoadingState label="Loading page..." />}>{routes}</Suspense>;
}

export default App;