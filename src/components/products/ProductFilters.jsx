function ProductFilters({
    search,
    setSearch,
    category,
    categories,
    sort,
    order,
    onCategoryChange,
    onSortChange,
}) {
    const handleSortChange = (e) => {
        const value = e.target.value;

        if (!value) {
            onSortChange("", "asc");
            return;
        }

        const [sortValue, sortOrder] =
            value.split("-");

        onSortChange(
            sortValue,
            sortOrder
        );
    };

    return (
        <div className="product-filters">

            {/* Search */}

            <div className="filter-group">
                <label>
                    Search
                </label>

                <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Search products..."
                />
            </div>


            {/* Category */}

            <div className="filter-group">
                <label>
                    Category
                </label>

                <select
                    value={category}
                    onChange={(e) =>
                        onCategoryChange(
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        All Categories
                    </option>

                    {categories.map(
                        (category) => (
                            <option
                                key={
                                    typeof category ===
                                    "string"
                                        ? category
                                        : category.slug
                                }
                                value={
                                    typeof category ===
                                    "string"
                                        ? category
                                        : category.slug
                                }
                            >
                                {
                                    typeof category ===
                                    "string"
                                        ? category
                                        : category.name
                                }
                            </option>
                        )
                    )}
                </select>
            </div>


            {/* Sort */}

            <div className="filter-group">
                <label>
                    Sort
                </label>

                <select
                    value={
                        sort
                            ? `${sort}-${order}`
                            : ""
                    }
                    onChange={
                        handleSortChange
                    }
                >
                    <option value="">
                        Default
                    </option>

                    <option value="price-asc">
                        Price: Low to High
                    </option>

                    <option value="price-desc">
                        Price: High to Low
                    </option>

                    <option value="rating-asc">
                        Rating: Low to High
                    </option>

                    <option value="rating-desc">
                        Rating: High to Low
                    </option>

                    <option value="title-asc">
                        Title: A to Z
                    </option>

                    <option value="title-desc">
                        Title: Z to A
                    </option>
                </select>
            </div>

        </div>
    );
}

export default ProductFilters;