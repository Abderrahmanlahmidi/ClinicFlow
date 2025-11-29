import { lazy, Suspense } from "react";
import type { JSX } from "react/jsx-runtime";
import LoadingPage from "../ui/loading/loadingPage";

export const Home = lazy(() => import("../features/home/pages/home"));
export const Register = lazy(() => import("../features/auth/pages/register"));
export const Login = lazy(() => import("../features/auth/pages/login"));
export const Dashboard = lazy(
  () => import("../features/dashboard/pages/dashboard"),
);
export const Unauthorized = lazy(
  () => import("../features/unauthorized/unauthorized"),
);
export const Profile = lazy(() => import("../features/profile/page/profile"));
export const Statics = lazy(
  () => import("../features/dashboard/pages/sections/pages/statics"),
);
export const Users = lazy(
  () => import("../features/dashboard/pages/sections/pages/users"),
);
export const Roles = lazy(
  () => import("../features/dashboard/pages/sections/pages/roles"),
);
export const Availability = lazy(
  () => import("../features/dashboard/pages/sections/pages/availability"),
);
export const Speciality = lazy(
  () => import("../features/dashboard/pages/sections/pages/speciality"),
);
export const Appointment = lazy(
  () => import("../features/dashboard/pages/sections/pages/appointment"),
);
export const Pharmacy = lazy(
  () => import("../features/dashboard/pages/sections/pages/pharmacy"),
);

export const withSuspense = (Component: JSX.Element) => {
  return <Suspense fallback={<LoadingPage />}>{Component}</Suspense>;
};
