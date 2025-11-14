import { createBrowserRouter } from "react-router-dom";
import { Home, Register, Login, Dashboard, Unauthorized, Profile ,withSuspense } from "./lazyImports";
import PrivateRoute from "../private/privateRoute";
import PublicRoute from "../private/publicRoute";


export const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(<Home />),
  },
  {
    path: "/register",
    element: withSuspense(<PublicRoute><Register /></PublicRoute>),
  },
  {
    path: "/login",
    element: withSuspense(<PublicRoute><Login /></PublicRoute>),
  },
  {
    path:"/profile",
    element:withSuspense(<Profile/>)
  },
  {
    path: "/dashboard",
    element: withSuspense(<PrivateRoute allowedRoles={["Admin"]} ><Dashboard /></PrivateRoute>),
  },
  {
    path: "*",
    element: withSuspense(<Unauthorized/>),
  }
]);
