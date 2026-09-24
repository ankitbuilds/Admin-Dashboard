import { Link } from "react-router-dom";

function ProductCard({ products =[]}) {
    return (
        <div className="product-cards">
            {products.map((product) => (
                <div
                    className="product-card"
                    key={product.id}
                >
                    <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="product-card-image"
                    />

                    <div className="product-card-content">
                        <h3>
                            <Link
                                to={`/products/${product.id}`}
                            >
                                {product.title}
                            </Link>
                        </h3>

                        <p>
                            <strong>Category:</strong>{" "}
                            {product.category}
                        </p>

                        <p>
                            <strong>Price:</strong>{" "}
                            ${product.price}
                        </p>

                        <p>
                            <strong>Rating:</strong>{" "}
                            {product.rating}
                        </p>

                        <p>
                            <strong>Stock:</strong>{" "}
                            {product.stock}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProductCard;