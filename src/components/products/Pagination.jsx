function Pagination({
    currentPage,
    totalPages,
    pageSize,
    onPageChange,
    onPageSizeChange,
}) {
    const pages = [];

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {
        pages.push(page);
    }

    return (
        <div className="pagination">

            <div className="page-size">
                <label>
                    Page size:
                </label>

                <select
                    value={pageSize}
                    onChange={(e) =>
                        onPageSizeChange(
                            Number(e.target.value)
                        )
                    }
                >
                    <option value={10}>
                        10
                    </option>

                    <option value={20}>
                        20
                    </option>

                    <option value={50}>
                        50
                    </option>
                </select>
            </div>


            <div className="page-buttons">

                <button
                    disabled={currentPage === 1}
                    onClick={() =>
                        onPageChange(
                            currentPage - 1
                        )
                    }
                >
                    Previous
                </button>


                {pages.map((page) => (
                    <button
                        key={page}
                        className={
                            page === currentPage
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            onPageChange(page)
                        }
                    >
                        {page}
                    </button>
                ))}


                <button
                    disabled={
                        currentPage ===
                        totalPages
                    }
                    onClick={() =>
                        onPageChange(
                            currentPage + 1
                        )
                    }
                >
                    Next
                </button>

            </div>

        </div>
    );
}

export default Pagination;