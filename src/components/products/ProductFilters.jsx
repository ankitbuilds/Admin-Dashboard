function ProductFilters({
    search,
    category,
    sort,
    order,
    categories,
    onSearchChange,
    onCategoryChange,
    onSortChange,
}) {
    return (
        <div className="product-filters">

            <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) =>
                    onSearchChange(e.target.value)
                }
            />

            <select
                value={category}
                onChange={(e) =>
                    onCategoryChange(e.target.value)
                }
            >
                <option value="">
                    All Categories
                </option>

                {categories.map((item) => (
                    <option
                        key={item.slug}
                        value={item.slug}
                    >
                        {item.name}
                    </option>
                ))}
            </select>

            <select
                value={`${sort}-${order}`}
                onChange={(e) =>
                    onSortChange(e.target.value)
                }
            >
                <option value="-">
                    Default Sort
                </option>

                <option value="price-asc">
                    Price: Low to High
                </option>

                <option value="price-desc">
                    Price: High to Low
                </option>

                <option value="rating-desc">
                    Rating: High to Low
                </option>

                <option value="rating-asc">
                    Rating: Low to High
                </option>

                <option value="title-asc">
                    Title: A-Z
                </option>

                <option value="title-desc">
                    Title: Z-A
                </option>
            </select>

        </div>
    );
}

export default ProductFilters;