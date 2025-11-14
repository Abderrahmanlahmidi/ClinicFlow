import { lazy, Suspense } from "react";
import type { JSX } from "react/jsx-runtime";
import LoadingPage from "../ui/loading/loadingPage";




export const Home = lazy(() => import("../features/home/pages/home"))
export const Register = lazy(() => import("../features/auth/pages/register"))
export const Login = lazy(() => import("../features/auth/pages/login"))
export const Dashboard = lazy(() => import("../features/dashboard/pages/dashboard"))
export const Unauthorized = lazy(() => import("../features/unauthorized/unauthorized"))
export const Profile = lazy(() => import("../features/profile/page/profile"))



export const withSuspense = (Component:JSX.Element) => {
   return(
        <Suspense fallback={<LoadingPage/>} >
            {Component}
        </Suspense>
   )
}