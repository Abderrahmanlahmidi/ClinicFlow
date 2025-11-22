import { createBrowserRouter } from "react-router-dom";
import {
  Home,
  Register,
  Login,
  Dashboard,
  Unauthorized,
  Profile,
  Statics,
  Users,
  Roles,
  Availability,
  withSuspense,
  Speciality,
  Appointment,
} from "./lazyImports";
import PrivateRoute from "../private/privateRoute";
import PublicRoute from "../private/publicRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(<Home />),
  },
  {
    path: "/register",
    element: withSuspense(
      <PublicRoute>
        <Register />
      </PublicRoute>,
    ),
  },
  {
    path: "/login",
    element: withSuspense(
      <PublicRoute>
        <Login />
      </PublicRoute>,
    ),
  },
  {
    path: "/profile",
    element: withSuspense(
      <PrivateRoute>
        <Profile />
      </PrivateRoute>,
    ),
  },
  {
    path: "/dashboard",
    element: withSuspense(
      <PrivateRoute allowedRoles={["Admin"]}>
        <Dashboard />
      </PrivateRoute>,
    ),
    children: [
      {
        index: true,
        element: <Statics />,
      },
      {
        path: "/dashboard/users",
        element: <Users />,
      },
      {
        path: "/dashboard/roles",
        element: <Roles />,
      },
      {
        path: "/dashboard/availability",
        element: <Availability />,
      },
      {
        path: "/dashboard/speciality",
        element: <Speciality />,
      },
      {
        path: "/dashboard/appointment",
        element: <Appointment />,
      },
    ],
  },
  {
    path: "*",
    element: withSuspense(<Unauthorized />),
  },
]);
