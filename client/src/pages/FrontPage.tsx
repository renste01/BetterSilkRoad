import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import type {Product} from "../Interface.tsx";
import {getProducts} from "../api/products.ts";
import {COLOURS} from "../Colours.tsx"
import "../index.css";
import {getCartCount} from "../lib/cart.ts";

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
                                background: COLOURS.surface,
                                color: COLOURS.subtext,
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
                            background: COLOURS.bg,
                            color: COLOURS.text,
                            padding: "2px 6px",
                            borderRadius: 4,
                            fontWeight: "bold",
                        }}
                    >
                        {product.price}$
                    </span>
                </div>

                {/* NY: lagerstatus */}
                <p style={{
                    margin: "8px 0 0",
                    color: product.quantity > 0 ? COLOURS.subtext : COLOURS.danger,
                }}>
                    {product.quantity > 0 ? `${product.quantity} in stock` : "Sold out"}
                </p>
            </Link>
        </div>
    );
}

export function FrontPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(
        () => localStorage.getItem("satinroad_user"),
    );

    useEffect(() => {
        getProducts()
            .then(setProducts)
            .catch(() => setError("Could not load products."));
    }, []);

    const categories = Array.from(
        new Set(products.map(p => p.category).filter(Boolean) as string[]),
    ).sort();

    const visibleProducts = products.filter(product =>
        product.productName.toLowerCase().includes(query.toLowerCase()) &&
        (selectedCategory === null || product.category === selectedCategory),
    );

    return (
        <div style={{minHeight: "100vh", background: COLOURS.bg, color: COLOURS.text}}>
            <header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 24px",
                    borderBottom: `1px solid ${COLOURS.border}`,
                    marginBottom: 24,
                }}
            >
                <h1 style={{margin: 0, fontSize: 48, color: COLOURS.text}}>Better Silk Road</h1>

                <div style={{display: "flex", gap: 12}}>
                    <Link
                        to="/inventory"
                        style={{...headerButtonStyle}}
                    >
                        Private inventory
                    </Link>

                    <Link to="/createListing" style={headerButtonStyle}>
                        List your product
                    </Link>
                    <Link 
                        to="/cart" style={headerButtonStyle}>Cart ({getCartCount()})
                    </Link>     
                    <Link 
                        to="/purchases" style={headerButtonStyle}>My purchases
                    </Link>

                    {userName ? (
                        <button
                            onClick={() => {
                                localStorage.removeItem("satinroad_user");
                                localStorage.removeItem("satinroad_user_id");
                                localStorage.removeItem("satinroad_token");
                                localStorage.removeItem("satinroad_is_admin");
                                setUserName(null);
                                navigate("/login");
                            }}
                            style={headerButtonStyle}
                        >
                            Sign out
                        </button>
                    ) : (
                        <Link to="/login" style={headerButtonStyle}>
                            Sign in / Register
                        </Link>
                    )}
                    {userName && localStorage.getItem("satinroad_is_admin") === "true" && (
                        <Link to="/admin" style={headerButtonStyle}>Admin</Link>
                    )}
                </div>
            </header>

            <input
                type="search"
                placeholder="Search products"
                value={query}
                onChange={event => setQuery(event.target.value)}
                style={{
                    marginBottom: 16,
                    padding: 8,
                    background: COLOURS.surface,
                    color: COLOURS.text,
                    border: `1px solid ${COLOURS.border}`,
                }}
            />

            {error && <p style={{color: COLOURS.danger}}>{error}</p>}

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
        background: active ? COLOURS.surface : "transparent",
        color: active ? COLOURS.accent : COLOURS.subtext,
        fontWeight: active ? "bold" : "normal",
        cursor: "pointer",
    };
}

const headerButtonStyle: React.CSSProperties = {
    display: "inline-block",
    boxSizing: "border-box",
    padding: "8px 16px",
    border: "none",
    background: COLOURS.accent,
    color: COLOURS.bg,
    fontSize: 18,
    textDecoration: "none",
    cursor: "pointer",
};
