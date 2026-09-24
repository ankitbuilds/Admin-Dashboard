function Pagination({
    currentPage,
    totalPages,
    pageSize,
    onPageChange,
    onPageSizeChange,
}) {
    return (
        <div className="pagination">
            <div>
                <label>
                    Rows per page:{" "}
                </label>

                <select
                    value={pageSize}
                    onChange={(e) =>
                        onPageSizeChange(
                            Number(e.target.value)
                        )
                    }
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>

            <div>
                <button
                    disabled={currentPage === 1}
                    onClick={() =>
                        onPageChange(currentPage - 1)
                    }
                >
                    Previous
                </button>

                {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                ).map((page) => (
                    <button
                        key={page}
                        onClick={() =>
                            onPageChange(page)
                        }
                        disabled={page === currentPage}
                    >
                        {page}
                    </button>
                ))}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() =>
                        onPageChange(currentPage + 1)
                    }
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Pagination;