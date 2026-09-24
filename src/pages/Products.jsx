import { useEffect, useState } from "react";

import { getProducts } from "../api/productApi";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";

import ProductTable from "../components/products/ProductTable";
import ProductCard from "../components/products/ProductCard";

function Products() {
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getProducts();

            setProducts(data.products);
        } catch (error) {
            console.error("Products error:", error);

            setError(
                "Unable to load products. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <ErrorMessage
                message={error}
                onRetry={fetchProducts}
            />
        );
    }

    if (products.length === 0) {
        return (
            <EmptyState
                message="No products found."
            />
        );
    }

    return (
        <div className="products-page">
            <div className="products-header">
                <h1>Products</h1>

                <p>
                    Manage your products from here.
                </p>
            </div>

            <ProductTable products={products} />

            <div className="product-cards">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </div>
    );
}

export default Products;