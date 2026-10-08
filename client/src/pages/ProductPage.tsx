import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import type {Product} from "../Interface.tsx";
import {getProduct} from "../api/products.ts";
import {addToCart} from "../lib/cart.ts";
import {COLOURS} from "../Colours.tsx"

export function ProductPage() {
    const {productId} = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!productId) {
            setError("Product ID is missing.");
            return;
        }

        getProduct(productId)
            .then(setProduct)
            .catch(() => setError("Could not find this product."));
    }, [productId]);

    if (error) {
        return (
            <main>
                <p>{error}</p>
                <Link to="/">Back to products</Link>
            </main>
        );
    }

    if (!product) {
        return <p>Loading product...</p>;
    }

    const isOwnProduct = product.sellerId === Number(localStorage.getItem("satinroad_user_id"));
    const outOfStock = product.quantity <= 0;

    function handleAddToCart() {
        if (!product) return;

        if (!localStorage.getItem("satinroad_token")) {
            navigate("/login");
            return;
        }

        addToCart(product, quantity);
        setMessage(`Added ${quantity} × ${product.productName} to your cart.`);
        setQuantity(1);
    }

    return (
        <main style={{padding: 24}}>
            <Link to="/">Back to products</Link>

            <h1 style={{margin: 0, fontSize: 36, color: COLOURS.text}}>{product.productName}</h1>

            {product.images ? (
                <img
                    src={product.images}
                    alt={product.productName}
                    width={300}
                    height={300}
                    style={{objectFit: "cover"}}
                />
            ) : (
                <p>No image available</p>
            )}

            <p>{product.description}</p>
            <p>Seller: {product.sellerUsername}</p>
            <p>Category: {product.category}</p>
            <p>Price: {product.price}$</p>
            <p>In stock: {product.quantity}</p>

            {isOwnProduct ? (
                <p style={{color: COLOURS.subtext}}>This is your own listing.</p>
            ) : outOfStock ? (
                <p style={{color: COLOURS.danger}}>Out of stock</p>
            ) : (
                <div style={{display: "flex", gap: 8, alignItems: "center"}}>
                    <input
                        type="number"
                        min={1}
                        max={product.quantity}
                        value={quantity}
                        onChange={e => setQuantity(
                            Math.min(product.quantity, Math.max(1, Number(e.target.value) || 1)),
                        )}
                        style={{
                            width: 70,
                            padding: 8,
                            background: COLOURS.surface,
                            color: COLOURS.text,
                            border: `1px solid ${COLOURS.border}`,
                        }}
                    />
                    <button
                        onClick={handleAddToCart}
                        style={{
                            padding: "8px 16px",
                            fontSize: 18,
                            cursor: "pointer",
                            background: COLOURS.accent,
                            color: COLOURS.bg,
                        }}
                    >
                        Add to cart
                    </button>
                </div>
            )}

            {message && (
                <p role="status">
                    {message} <Link to="/cart">Go to cart</Link>
                </p>
            )}
        </main>
    );
}