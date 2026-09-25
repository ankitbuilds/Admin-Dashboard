import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteLocalProduct } from "../utils/productStorage";
import {
    getProductById,
    deleteProduct,
} from "../api/productApi";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProductById(id);

                setProduct(data);
            } catch (error) {
                console.error(error);

                if (error.response?.status === 404) {
                    setError("Product not found.");
                } else {
                    setError("Failed to load product.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setError("");

            await deleteProduct(product.id);
            deleteLocalProduct(product.id);

            navigate("/products");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to delete product."
            );
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (error && !product) {
        return (
            <div>
                <ErrorMessage message={error} />

                <button
                    onClick={() => navigate("/products")}
                >
                    Back to Products
                </button>
            </div>
        );
    }

    if (!product) {
        return <p>Product not found.</p>;
    }

    return (
        <div className="product-details">

            <div className="product-actions">

                <button
                    onClick={() => navigate("/products")}
                    disabled={deleting}
                >
                    ← Back to Products
                </button>

                <button
                    onClick={() =>
                        navigate(
                            `/products/edit/${product.id}`
                        )
                    }
                    disabled={deleting}
                >
                    Edit Product
                </button>

                <button
                    onClick={handleDelete}
                    disabled={deleting}
                >
                    {deleting
                        ? "Deleting..."
                        : "Delete Product"}
                </button>

            </div>

            {error && (
                <ErrorMessage message={error} />
            )}

            <div className="product-details-container">

                <div className="product-images">

                    {product.images?.map(
                        (image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`${product.title} ${
                                    index + 1
                                }`}
                            />
                        )
                    )}

                </div>

                <div className="product-info">

                    <h1>{product.title}</h1>

                    <p>
                        <strong>Category:</strong>{" "}
                        {product.category}
                    </p>

                    <p>
                        <strong>Brand:</strong>{" "}
                        {product.brand || "N/A"}
                    </p>

                    <p>
                        <strong>Price:</strong>{" "}
                        ${product.price}
                    </p>

                    <p>
                        <strong>Rating:</strong>{" "}
                        ⭐ {product.rating}
                    </p>

                    <p>
                        <strong>Stock:</strong>{" "}
                        {product.stock}
                    </p>

                    <p>
                        <strong>Description:</strong>
                    </p>

                    <p>
                        {product.description}
                    </p>

                </div>

            </div>

            <div className="reviews">

                <h2>Reviews</h2>

                {product.reviews?.length > 0 ? (
                    product.reviews.map(
                        (review, index) => (
                            <div
                                className="review"
                                key={index}
                            >
                                <h4>
                                    {review.reviewerName}
                                </h4>

                                <p>
                                    ⭐ {review.rating}
                                </p>

                                <p>
                                    {review.comment}
                                </p>

                                <small>
                                    {review.date}
                                </small>
                            </div>
                        )
                    )
                ) : (
                    <p>No reviews available.</p>
                )}

            </div>

        </div>
    );
}

export default ProductDetails;