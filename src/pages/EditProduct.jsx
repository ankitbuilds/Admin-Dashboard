import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getProductById,
    updateProduct,
} from "../api/productApi";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        price: "",
        stock: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const product = await getProductById(id);

                setFormData({
                    title: product.title || "",
                    description: product.description || "",
                    category: product.category || "",
                    price: product.price ?? "",
                    stock: product.stock ?? "",
                });
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            return "Title is required.";
        }

        if (!formData.description.trim()) {
            return "Description is required.";
        }

        if (!formData.category.trim()) {
            return "Category is required.";
        }

        if (
            formData.price === "" ||
            Number(formData.price) <= 0
        ) {
            return "Price must be greater than 0.";
        }

        if (
            formData.stock === "" ||
            Number(formData.stock) < 0
        ) {
            return "Stock cannot be negative.";
        }

        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setSaving(true);
            setError("");

            const updatedProduct = await updateProduct(id, {
                title: formData.title.trim(),
                description: formData.description.trim(),
                category: formData.category.trim(),
                price: Number(formData.price),
                stock: Number(formData.stock),
            });

            console.log(
                "Updated product:",
                updatedProduct
            );

            navigate(`/products/${id}`);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update product."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <p>Loading product...</p>;
    }

    if (error && !formData.title) {
        return (
            <div>
                <p>{error}</p>

                <button
                    onClick={() => navigate("/products")}
                >
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div className="edit-product-page">

            <h1>Edit Product</h1>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Title</label>

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter product title"
                    />
                </div>

                <div>
                    <label>Description</label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter description"
                    />
                </div>

                <div>
                    <label>Category</label>

                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Enter category"
                    />
                </div>

                <div>
                    <label>Price</label>

                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                    />
                </div>

                <div>
                    <label>Stock</label>

                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="Enter stock"
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                        navigate(`/products/${id}`)
                    }
                >
                    Cancel
                </button>

            </form>
        </div>
    );
}

export default EditProduct;