import {useEffect, useState} from "react";
import type {Product} from "../Interface.tsx";

interface ProductCardProps {
    product: Product;
}

function ProductCard({product}: ProductCardProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{opacity: hovered ? 0.8 : 1, width: 200}}
        >
            <h3 style={{margin: "0 0 8px", fontSize: 16}}>{product.title}</h3>

            <div style={{position: "relative", width: 200, height: 200}}>
                <img
                    src={product.images[0]}
                    alt={product.title}
                    width={200}
                    height={200}
                    style={{display: "block", objectFit: "cover"}}
                />

                <button
                    onClick={() => console.log("Buy", product.id)}
                    style={{position: "absolute", bottom: 8, left: 8}}
                >
                    Buy
                </button>

                <span
                    style={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        background: "rgba(255,255,255,0.85)",
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontWeight: "bold",
                    }}
                >
                    {product.price}$
                </span>
            </div>
        </div>
    );
}

export function FrontPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const url = query.trim()
            ? `https://dummyjson.com/products/search?q=${encodeURIComponent(query.trim())}`
            : "https://dummyjson.com/products";

        const timeoutId = setTimeout(() => {
            fetch(url)
                .then(res => res.json())
                .then(json => setProducts(json.products));
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    interface ProductCardProps {
        product: Product;
    }



    return (
        <div>
        <header
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 24px",
                borderBottom: "1px solid #ddd",
                marginBottom: 24,
            }}
        >
            <h1 style={{margin: 0, fontSize: 48}}>Better Silk Road</h1>

            <button
                onClick={() => console.log("Sign in / Register")}
                style={{padding: "8px 16px", fontSize: 16, cursor: "pointer"}}
            >
                Sign in / Register
            </button>
        </header>

        <div style={{display: "flex", flexWrap: "wrap", gap: 16}}>
            {products.map(p => (
                <ProductCard key={p.id} product={p} />
            ))}
        </div>
        </div>
    );
}