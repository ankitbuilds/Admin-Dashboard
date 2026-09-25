import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Routes>

            <Route
                path="/login"
                element={<Login />}
            />

            <Route element={<ProtectedRoute />}>

                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/products/add"
                    element={<AddProduct />}
                />

                <Route
                    path="/products/edit/:id"
                    element={<EditProduct />}
                />

                <Route
                    path="/products/:id"
                    element={<ProductDetails />}
                />

            </Route>

            <Route
                path="*"
                element={<NotFound />}
            />

        </Routes>
    );
}

export default App;