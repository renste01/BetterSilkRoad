import {createRoot} from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {FrontPage} from "./pages/FrontPage.tsx";
import {ProductPage} from "./pages/ProductPage.tsx";
import {CreateListingPage} from "./pages/CreateListingPage.tsx";
import App from "./App";

const elem = document.getElementById("root")!;

const app = (
    <>
        <RouterProvider
            router={createBrowserRouter([
                {
                    path: "/",
                    element: <FrontPage />
                },
                {
                    path: "/products/:productId",
                    element: <ProductPage />
                },
                {
                    path: "/createListing",
                    element: <CreateListingPage />
                },
                {
                    path: "/login",
                    element: <App />
                }
            ])}
        />
    </>
);

if (import.meta.hot) {
    const root = (import.meta.hot.data.root ??= createRoot(elem));
    root.render(app);
} else {
    createRoot(elem).render(app);
}