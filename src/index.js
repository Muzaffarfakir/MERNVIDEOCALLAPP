import React from "react";
import ReactDom, { createRoot } from "react-dom/client";
import App from "./App";
let root = ReactDom.createRoot(document.getElementById("root"));

root.render(
    <>
        <App />
    </>
)