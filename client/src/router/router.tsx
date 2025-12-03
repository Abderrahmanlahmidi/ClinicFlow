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
  Pharmacy,
  CreateAppointement,
  MyAppointements,
  DoctorAvailabilities
} from "./lazyImports";
import PrivateRoute from "../private/privateRoute";
import PublicRoute from "../private/publicRoute";
import AuthRequiredPage from "../features/unauthorized/authRequired";

export const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(<Home />),
  },
  {
    path: "/appointments",
    element: withSuspense(
      <PrivateRoute>
        <CreateAppointement/>
      </PrivateRoute>
    ),
  },
  {
    path: "/my-appointments",
    element: withSuspense(
      <PrivateRoute allowedRoles={["Nurse", "Patient", "Doctor"]} >
        <MyAppointements/>
      </PrivateRoute>
    ),
  },
  {
    path: "/doctor-availabilities",
    element: withSuspense(
      <PrivateRoute allowedRoles={["Doctor"]} >
        <DoctorAvailabilities/>
      </PrivateRoute>
    ),
  },
  {
    path: "/register",
    element: withSuspense(
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/login",
    element: withSuspense(
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/profile",
    element: withSuspense(
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard",
    element: withSuspense(
      <PrivateRoute allowedRoles={["Admin"]}>
        <Dashboard />
      </PrivateRoute>
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
      {
        path: "/dashboard/pharmacy",
        element: <Pharmacy />,
      },
    ],
  },
  {
    path: "*",
    element: withSuspense(<Unauthorized />),
  },
  {
    path: "/auth-required",
    element: withSuspense(<AuthRequiredPage />),
  },
]);
