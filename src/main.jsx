import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import {RouterProvider} from "react-router-dom";
import {router} from "./router";
import {ConfigProvider, theme} from "antd";

ReactDOM.createRoot(document.getElementById("root")).render(
    <ConfigProvider
        theme={{
            token: {
                colorPrimary: '#1890ff',
                borderRadius: 16
            },
            algorithm: theme.defaultAlgorithm
        }}
    >
        <RouterProvider router={router}/>
    </ConfigProvider>
);
