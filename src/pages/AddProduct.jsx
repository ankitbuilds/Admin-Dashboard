import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { addProduct } from "../api/productApi";

function AddProduct() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        stock: "",
        category: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.title.trim()) {
            setError("Title is required.");
            return;
        }

        if (!formData.description.trim()) {
            setError("Description is required.");
            return;
        }

        if (!formData.category.trim()) {
            setError("Category is required.");
            return;
        }

        if (
            formData.price === "" ||
            Number(formData.price) <= 0
        ) {
            setError("Price must be greater than 0.");
            return;
        }

        if (
            formData.stock === "" ||
            Number(formData.stock) < 0
        ) {
            setError("Stock cannot be negative.");
            return;
        }

        try {
            setLoading(true);

            const product = await addProduct({
                title: formData.title.trim(),
                description: formData.description.trim(),
                category: formData.category.trim(),
                price: Number(formData.price),
                stock: Number(formData.stock),
            });

            console.log("Created product:", product);

            navigate("/products");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to create product."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product-page">

            <h1>Add Product</h1>

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
                        placeholder="Enter product description"
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
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Add Product"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/products")}
                    disabled={loading}
                >
                    Cancel
                </button>

            </form>
        </div>
    );
}

export default AddProduct;