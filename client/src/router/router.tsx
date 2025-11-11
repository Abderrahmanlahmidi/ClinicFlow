import { createBrowserRouter } from "react-router-dom";
import { Home, Register, Login, withSuspense} from "./lazyImports";



export const router = createBrowserRouter([
    {
        path:"/",
        element:withSuspense(<Home/>)
    },
    {
        path:"/register",
        element:withSuspense(<Register/>)
    },
    {
        path:"/login",
        element:withSuspense(<Login/>)
    }
])  