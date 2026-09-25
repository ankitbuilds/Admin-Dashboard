import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
    getProducts,
    searchProducts,
    getCategories,
    getProductsByCategory,
} from "../api/productApi";

import ProductTable from "../components/products/ProductTable";
import ProductCard from "../components/products/ProductCard";
import ProductFilters from "../components/products/ProductFilters";
import Pagination from "../components/products/Pagination";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";

import { useDebounce } from "../hooks/useDebounce";
import { getLocalMutations } from "../utils/productStorage";


/*
    Apply locally created, updated and deleted products
    to the products received from DummyJSON.
*/
const applyLocalMutations = (products) => {
    const mutations = getLocalMutations();

    let result = [...products];

    // Remove deleted products
    result = result.filter(
        (product) =>
            !mutations.deleted.includes(product.id)
    );

    // Apply updated products
    result = result.map((product) => {
        return (
            mutations.updated[product.id] ||
            product
        );
    });

    // Add locally created products
    result = [
        ...mutations.added,
        ...result,
    ];

    return result;
};


function Products() {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] =
        useSearchParams();


    // --------------------------------
    // URL PARAMETERS
    // --------------------------------

    const pageParam = Number(
        searchParams.get("page")
    );

    const limitParam = Number(
        searchParams.get("limit")
    );

    const currentPage =
        Number.isInteger(pageParam) &&
        pageParam > 0
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
        searchParams.get("order") || "asc";


    const skip =
        (currentPage - 1) * pageSize;


    // --------------------------------
    // STATE
    // --------------------------------

    const [products, setProducts] =
        useState([]);

    const [total, setTotal] =
        useState(0);

    const [categories, setCategories] =
        useState([]);

    const [searchInput, setSearchInput] =
        useState(search);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // --------------------------------
    // DEBOUNCE SEARCH
    // --------------------------------

    const debouncedSearch =
        useDebounce(searchInput, 500);


    // --------------------------------
    // TOTAL PAGES
    // --------------------------------

    const totalPages =
        Math.ceil(total / pageSize);


    // --------------------------------
    // FETCH CATEGORIES
    // --------------------------------

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data =
                    await getCategories();

                setCategories(data);
            } catch (error) {
                console.error(
                    "Failed to fetch categories:",
                    error
                );
            }
        };

        fetchCategories();
    }, []);


    // --------------------------------
    // SEARCH INPUT → URL
    // --------------------------------

    useEffect(() => {
        const trimmedSearch =
            debouncedSearch.trim();

        const currentSearch =
            searchParams.get("search") || "";

        if (trimmedSearch === currentSearch) {
            return;
        }

        const params =
            new URLSearchParams(searchParams);

        if (trimmedSearch) {
            params.set(
                "search",
                trimmedSearch
            );

            /*
                Search takes precedence over
                category because DummyJSON
                doesn't support combining them.
            */
            params.delete("category");
        } else {
            params.delete("search");
        }

        // Search should start from page 1
        params.set("page", "1");
        params.set(
            "limit",
            String(pageSize)
        );

        setSearchParams(params);
    }, [
        debouncedSearch,
        searchParams,
        setSearchParams,
        pageSize,
    ]);


    // --------------------------------
    // KEEP INPUT IN SYNC WITH URL
    // --------------------------------

    useEffect(() => {
        setSearchInput(search);
    }, [search]);


    // --------------------------------
    // FETCH PRODUCTS
    // --------------------------------

    useEffect(() => {
        const controller =
            new AbortController();

        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                let data;


                // ------------------------
                // SEARCH
                // ------------------------

                if (search) {
                    data =
                        await searchProducts({
                            query: search,
                            limit: pageSize,
                            skip,
                            signal:
                                controller.signal,
                        });
                }


                // ------------------------
                // CATEGORY
                // ------------------------

                else if (category) {
                    data =
                        await getProductsByCategory({
                            category,
                            limit: pageSize,
                            skip,
                        });
                }


                // ------------------------
                // NORMAL PRODUCTS
                // ------------------------

                else {
                    data =
                        await getProducts({
                            limit: pageSize,
                            skip,
                        });
                }


                // ------------------------
                // APPLY LOCAL MUTATIONS
                // ------------------------

                const updatedProducts =
                    applyLocalMutations(
                        data.products || []
                    );


                // ------------------------
                // SORT
                // ------------------------

                const sortedProducts =
                    [...updatedProducts].sort(
                        (a, b) => {

                            if (!sort) {
                                return 0;
                            }

                            let valueA;
                            let valueB;

                            if (
                                sort === "price"
                            ) {
                                valueA =
                                    Number(
                                        a.price
                                    );

                                valueB =
                                    Number(
                                        b.price
                                    );
                            }

                            else if (
                                sort === "rating"
                            ) {
                                valueA =
                                    Number(
                                        a.rating
                                    );

                                valueB =
                                    Number(
                                        b.rating
                                    );
                            }

                            else if (
                                sort === "title"
                            ) {
                                valueA =
                                    a.title
                                        .toLowerCase();

                                valueB =
                                    b.title
                                        .toLowerCase();
                            }

                            else {
                                return 0;
                            }


                            if (
                                valueA <
                                valueB
                            ) {
                                return order ===
                                    "asc"
                                    ? -1
                                    : 1;
                            }

                            if (
                                valueA >
                                valueB
                            ) {
                                return order ===
                                    "asc"
                                    ? 1
                                    : -1;
                            }

                            return 0;
                        }
                    );


                setProducts(
                    sortedProducts
                );

                setTotal(
                    data.total || 0
                );

            } catch (error) {

                /*
                    AbortController intentionally
                    cancels previous requests when
                    search/page/filter changes.
                */
                if (
                    error.name ===
                    "CanceledError"
                ) {
                    return;
                }

                if (
                    error.code ===
                    "ERR_CANCELED"
                ) {
                    return;
                }

                console.error(error);

                setError(
                    "Failed to load products."
                );

            } finally {

                if (
                    !controller.signal.aborted
                ) {
                    setLoading(false);
                }
            }
        };


        fetchProducts();


        // Cancel previous request
        return () => {
            controller.abort();
        };

    }, [
        search,
        category,
        currentPage,
        pageSize,
        sort,
        order,
    ]);


    // --------------------------------
    // INVALID PAGE HANDLING
    // --------------------------------

    useEffect(() => {
        if (
            total > 0 &&
            currentPage > totalPages
        ) {
            const params =
                new URLSearchParams(
                    searchParams
                );

            params.set(
                "page",
                String(totalPages)
            );

            params.set(
                "limit",
                String(pageSize)
            );

            setSearchParams(params);
        }
    }, [
        total,
        totalPages,
        currentPage,
        pageSize,
        searchParams,
        setSearchParams,
    ]);


    // --------------------------------
    // PAGE CHANGE
    // --------------------------------

    const handlePageChange = (page) => {
        const params =
            new URLSearchParams(
                searchParams
            );

        params.set(
            "page",
            String(page)
        );

        params.set(
            "limit",
            String(pageSize)
        );

        setSearchParams(params);
    };


    // --------------------------------
    // PAGE SIZE CHANGE
    // --------------------------------

    const handlePageSizeChange = (
        newPageSize
    ) => {
        const params =
            new URLSearchParams(
                searchParams
            );

        params.set(
            "page",
            "1"
        );

        params.set(
            "limit",
            String(newPageSize)
        );

        setSearchParams(params);
    };


    // --------------------------------
    // CATEGORY CHANGE
    // --------------------------------

    const handleCategoryChange = (
        newCategory
    ) => {
        const params =
            new URLSearchParams(
                searchParams
            );

        params.set(
            "page",
            "1"
        );

        if (newCategory) {
            params.set(
                "category",
                newCategory
            );

            /*
                Category takes precedence
                when user selects a category.
            */
            params.delete("search");
            setSearchInput("");
        } else {
            params.delete("category");
        }

        setSearchParams(params);
    };


    // --------------------------------
    // SORT CHANGE
    // --------------------------------

    const handleSortChange = (
        sortValue,
        orderValue
    ) => {
        const params =
            new URLSearchParams(
                searchParams
            );

        params.set(
            "page",
            "1"
        );

        if (sortValue) {
            params.set(
                "sort",
                sortValue
            );

            params.set(
                "order",
                orderValue
            );
        } else {
            params.delete("sort");
            params.delete("order");
        }

        setSearchParams(params);
    };


    // --------------------------------
    // RETRY
    // --------------------------------

    const handleRetry = () => {
        setError("");

        /*
            Changing the URL causes the
            fetch effect to execute again.
        */
        const params =
            new URLSearchParams(
                searchParams
            );

        params.set(
            "page",
            String(currentPage)
        );

        setSearchParams(params);
    };


    // --------------------------------
    // SHOWING TEXT
    // --------------------------------

    const start =
        total === 0
            ? 0
            : skip + 1;

    const end =
        Math.min(
            skip + pageSize,
            total
        );


    // --------------------------------
    // UI
    // --------------------------------

    return (
        <div className="products-page">

            <div className="products-header">

                <div>
                    <h1>Products</h1>

                    <p>
                        Showing {start}–{end} of{" "}
                        {total}
                    </p>
                </div>

                <button
                    onClick={() =>
                        navigate(
                            "/products/add"
                        )
                    }
                >
                    Add Product
                </button>

            </div>


            {/* Filters */}

            <ProductFilters
                search={searchInput}
                setSearch={setSearchInput}
                category={category}
                categories={categories}
                sort={sort}
                order={order}
                onCategoryChange={
                    handleCategoryChange
                }
                onSortChange={
                    handleSortChange
                }
            />


            {/* Search + Category warning */}

            {search && category && (
                <p>
                    Search and category filters
                    cannot be combined. Search is
                    being used.
                </p>
            )}


            {/* Error */}

            {error && (
                <div>
                    <ErrorMessage
                        message={error}
                    />

                    <button
                        onClick={handleRetry}
                    >
                        Retry
                    </button>
                </div>
            )}


            {/* Loading */}

            {loading && <Loader />}


            {/* Empty */}

            {!loading &&
                !error &&
                products.length === 0 && (
                    <EmptyState
                        message="No products found."
                    />
                )}


            {/* Products */}

            {!loading &&
                !error &&
                products.length > 0 && (
                    <>
                        <ProductTable
                            products={products}
                        />

                        <ProductCard
                            products={products}
                        />
                    </>
                )}


            {/* Pagination */}

            {!loading &&
                !error &&
                total > 0 && (
                    <Pagination
                        currentPage={
                            currentPage
                        }
                        totalPages={
                            totalPages
                        }
                        pageSize={
                            pageSize
                        }
                        onPageChange={
                            handlePageChange
                        }
                        onPageSizeChange={
                            handlePageSizeChange
                        }
                    />
                )}

        </div>
    );
}

export default Products;