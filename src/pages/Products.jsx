import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
    getProducts,
    searchProducts,
    getCategories,
    getProductsByCategory,
} from "../api/productApi";

import { useDebounce } from "../hooks/useDebounce";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";

import ProductTable from "../components/products/ProductTable";
import ProductCard from "../components/products/ProductCard";
import Pagination from "../components/products/Pagination";
import ProductFilters from "../components/products/ProductFilters";

function Products() {
    const [searchParams, setSearchParams] =
        useSearchParams();

    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [categories, setCategories] = useState([]);

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

    const search =
        searchParams.get("search") || "";

    const category =
        searchParams.get("category") || "";

    const sort =
        searchParams.get("sort") || "";

    const order =
        searchParams.get("order") || "";

    const [searchInput, setSearchInput] =
        useState(search);

    const debouncedSearch =
        useDebounce(searchInput, 500);

    const skip =
        (currentPage - 1) * pageSize;

    const totalPages =
        Math.ceil(total / pageSize);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data =
                    await getCategories();

                setCategories(data);
            } catch (error) {
                console.error(
                    "Category error:",
                    error
                );
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        setSearchInput(search);
    }, [search]);

    useEffect(() => {
        if (debouncedSearch === search) {
            return;
        }

        const params = {
            page: "1",
            limit: String(pageSize),
        };

        if (debouncedSearch.trim()) {
            params.search =
                debouncedSearch.trim();
        }

        if (category) {
            params.category = category;
        }

        if (sort) {
            params.sort = sort;
            params.order = order;
        }

        setSearchParams(params);
    }, [
        debouncedSearch,
        search,
        pageSize,
        category,
        sort,
        order,
        setSearchParams,
    ]);

    useEffect(() => {
        const controller =
            new AbortController();

        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                let data;

                if (search.trim()) {
                    data = await searchProducts({
                        query: search,
                        limit: pageSize,
                        skip,
                        signal: controller.signal,
                    });
                } else if (category) {
                    data =
                        await getProductsByCategory({
                            category,
                            limit: pageSize,
                            skip,
                        });
                } else {
                    data = await getProducts({
                        limit: pageSize,
                        skip,
                    });
                }

                setProducts(data.products);
                setTotal(data.total);

            } catch (error) {
                if (
                    error.name === "CanceledError" ||
                    error.code === "ERR_CANCELED"
                ) {
                    return;
                }

                console.error(
                    "Products error:",
                    error
                );

                setError(
                    "Unable to load products. Please try again."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchProducts();

        return () => {
            controller.abort();
        };

    }, [
        search,
        category,
        currentPage,
        pageSize,
    ]);

    const handleSearchChange = (value) => {
        setSearchInput(value);
    };

    const handleCategoryChange = (value) => {
        setSearchParams({
            page: "1",
            limit: String(pageSize),
            ...(value && {
                category: value,
            }),
            ...(sort && {
                sort,
                order,
            }),
        });
    };

    const handleSortChange = (value) => {
        if (value === "-") {
            setSearchParams({
                page: "1",
                limit: String(pageSize),
                ...(search && { search }),
                ...(category && { category }),
            });

            return;
        }

        const [newSort, newOrder] =
            value.split("-");

        setSearchParams({
            page: "1",
            limit: String(pageSize),
            ...(search && { search }),
            ...(category && { category }),
            sort: newSort,
            order: newOrder,
        });
    };

    const handlePageChange = (page) => {
        setSearchParams({
            page: String(page),
            limit: String(pageSize),

            ...(search && { search }),

            ...(category && {
                category,
            }),

            ...(sort && {
                sort,
                order,
            }),
        });
    };

    const handlePageSizeChange = (newSize) => {
        setSearchParams({
            page: "1",
            limit: String(newSize),

            ...(search && { search }),

            ...(category && {
                category,
            }),

            ...(sort && {
                sort,
                order,
            }),
        });
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <ErrorMessage
                message={error}
                onRetry={() => window.location.reload()}
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

    const sortedProducts = [...products];

if (sort === "price") {
    sortedProducts.sort((a, b) =>
        order === "asc"
            ? a.price - b.price
            : b.price - a.price
    );
}

if (sort === "rating") {
    sortedProducts.sort((a, b) =>
        order === "asc"
            ? a.rating - b.rating
            : b.rating - a.rating
    );
}

if (sort === "title") {
    sortedProducts.sort((a, b) =>
        order === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
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

            <ProductFilters
                search={searchInput}
                category={category}
                sort={sort}
                order={order}
                categories={categories}
                onSearchChange={
                    handleSearchChange
                }
                onCategoryChange={
                    handleCategoryChange
                }
                onSortChange={
                    handleSortChange
                }
            />

            {search && category && (
                <p>
                    Search and category filters
                    cannot be combined. Search results
                    are being displayed.
                </p>
            )}

            <ProductTable products={sortedProducts} />

            <div className="product-cards">
                {sortedProducts.map((product) => (
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
                onPageSizeChange={
                    handlePageSizeChange
                }
            />

        </div>
    );
}

export default Products;