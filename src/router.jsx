import {createBrowserRouter} from "react-router-dom";
import Home from "./views/Home.jsx";
import Dash from "./views/Dash.jsx";
import Matting from "./views/Matting.jsx";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>,
        children: [
            {
                index: true,
                path: 'dash',
                element: <Dash/>
            },
            {
                path: 'matting',
                element: <Matting/>
            }
        ]
    }
])