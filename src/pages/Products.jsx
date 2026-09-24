import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getProducts } from "../api/productApi";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";

import ProductTable from "../components/products/ProductTable";
import ProductCard from "../components/products/ProductCard";
import Pagination from "../components/products/Pagination";

function Products() {
    const [searchParams, setSearchParams] =
        useSearchParams();

    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const pageParam = Number(
        searchParams.get("page")
    );

    const limitParam = Number(
        searchParams.get("limit")
    );

    const currentPage =
        Number.isInteger(pageParam) && pageParam > 0
            ? pageParam
            : 1;

    const pageSize =
        [10, 20, 50].includes(limitParam)
            ? limitParam
            : 20;

    const skip = (currentPage - 1) * pageSize;

    const totalPages = Math.ceil(
        total / pageSize
    );

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getProducts({
                limit: pageSize,
                skip,
            });

            setProducts(data.products);
            setTotal(data.total);
        } catch (error) {
            console.error(
                "Products error:",
                error
            );

            setError(
                "Unable to load products. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [currentPage, pageSize]);

    const handlePageChange = (page) => {
        setSearchParams({
            page: String(page),
            limit: String(pageSize),
        });
    };

    const handlePageSizeChange = (newSize) => {
        setSearchParams({
            page: "1",
            limit: String(newSize),
        });
    };

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

    const start =
        (currentPage - 1) * pageSize + 1;

    const end = Math.min(
        currentPage * pageSize,
        total
    );

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

            <div className="pagination-info">
                Showing {start}–{end} of {total}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />

        </div>
    );
}

export default Products;