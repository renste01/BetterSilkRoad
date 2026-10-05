import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import type {Product} from "../Interface.tsx";
import {getProducts} from "../api/products.ts";

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
            <Link
                to={`/products/${product.productId}`}
                style={{color: "inherit", textDecoration: "none"}}
            >
                <h3 style={{margin: "0 0 8px", fontSize: 16}}>
                    {product.productName}
                </h3>

                <div style={{position: "relative", width: 200, height: 200}}>
                    {product.images ? (
                        <img
                            src={product.images}
                            alt={product.productName}
                            width={200}
                            height={200}
                            style={{display: "block", objectFit: "cover"}}
                        />
                    ) : (
                        <div
                            style={{
                                width: 200,
                                height: 200,
                                display: "grid",
                                placeItems: "center",
                                background: "#eee",
                            }}
                        >
                            No image
                        </div>
                    )}

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
            </Link>

            <button
                onClick={() => console.log("Buy", product.productId)}
                style={{marginTop: 8, cursor: "pointer"}}
            >
                Buy
            </button>
        </div>
    );
}

export function FrontPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getProducts()
            .then(setProducts)
            .catch(() => setError("Could not load products."));
    }, []);

    const categories = Array.from(
        new Set(products.map(p => p.category).filter(Boolean) as string[]),
    ).sort();

    const visibleProducts = products.filter(product =>
        product.productName.toLowerCase().includes(query.toLowerCase()),
    );

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
                    style={headerButtonStyle}
                >
                    Sign in / Register
                </button>
                <Link
                    style={headerButtonStyle}
                    to="/createListing"
                >
                    List your product
                </Link>
            </header>

            <input
                type="search"
                placeholder="Search products"
                value={query}
                onChange={event => setQuery(event.target.value)}
                style={{marginBottom: 16, padding: 8}}
            />

            {error && <p>{error}</p>}

            <div style={{display: "flex", gap: 24, alignItems: "flex-start"}}>
                <aside style={{width: 180, flexShrink: 0}}>
                    <h2 style={{margin: "0 0 8px", fontSize: 18}}>Categories</h2>
                    <ul style={{listStyle: "none", margin: 0, padding: 0}}>
                        <li>
                            <button
                                onClick={() => setSelectedCategory(null)}
                                style={categoryButtonStyle(selectedCategory === null)}
                            >
                                All
                            </button>
                        </li>
                        {categories.map(category => (
                            <li key={category}>
                                <button
                                    onClick={() => setSelectedCategory(category)}
                                    style={categoryButtonStyle(selectedCategory === category)}
                                >
                                    {category}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                <div style={{display: "flex", flexWrap: "wrap", gap: 16, flex: 1}}>
                    {visibleProducts.map(product => (
                        <ProductCard key={product.productId} product={product}/>
                    ))}
                </div>
            </div>
        </div>
    );
}

function categoryButtonStyle(active: boolean): React.CSSProperties {
    return {
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "6px 8px",
        border: "none",
        background: active ? "#eee" : "transparent",
        fontWeight: active ? "bold" : "normal",
        cursor: "pointer",
    };
}

const headerButtonStyle: React.CSSProperties = {
    display: "inline-block",
    boxSizing: "border-box",
    padding: "8px 16px",
    border: "1px solid #767676",
    borderRadius: 2,
    background: "#efefef",
    color: "#000",
    fontSize: 16,
    textDecoration: "none",
    cursor: "pointer",
};