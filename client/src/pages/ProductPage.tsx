import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import type {Product} from "../Interface.tsx";
import {getProduct} from "../api/products.ts";
import {COLOURS} from "../Colours.tsx"

export function ProductPage() {
    const {productId} = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);

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

            <button onClick={() => console.log("Buy", product.productId)}
            style={{
                padding: "8px 16px",
                fontSize: 18,
                width: "80px",
                cursor: "pointer",
                background: COLOURS.accent,
                color: COLOURS.bg,}}>
                Buy
            </button>
        </main>
    );
}