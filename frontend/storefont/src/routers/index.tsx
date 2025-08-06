import { createBrowserRouter, Outlet } from "react-router-dom";
import ForbiddenPage from "../forbiddenPage";
import NotFound from "../notfound";
import { routerStore } from "./store";

// eslint-disable-next-line react-refresh/only-export-components
function StorefrontRootLayout() {
  return <Outlet />;
}
export const routerRoot = createBrowserRouter([
  {
    path: "/",
    element: <StorefrontRootLayout />,
    children: [
      ...routerStore,
      { path: "403-forbidden", element: <ForbiddenPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);