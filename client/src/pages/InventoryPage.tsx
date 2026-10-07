import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {COLOURS} from "../Colours.tsx";

interface InventoryItem {
    productId: string;
    productName: string;
    description: string;
    category: string;
    price: number;
    quantity: number;
    sellerId: number;
    sellerUsername: string;
    images: string | null;
}

const API_BASE = "http://localhost:5153/api";

function authHeaders(): Record<string, string> {
    const token = localStorage.getItem("satinroad_token") ?? "";
    return {Authorization: `Bearer ${token}`};
}

function clearLogin() {
    localStorage.removeItem("satinroad_user");
    localStorage.removeItem("satinroad_user_id");
    localStorage.removeItem("satinroad_token");
}

const inputStyle: React.CSSProperties = {
    padding: 8,
    background: COLOURS.surface,
    color: COLOURS.text,
    border: `1px solid ${COLOURS.border}`,
};

const quantityButtonStyle: React.CSSProperties = {
    padding: "4px 10px",
    cursor: "pointer",
    background: COLOURS.accent,
    color: COLOURS.bg,
};

const removeButtonStyle: React.CSSProperties = {
    padding: "6px 12px",
    cursor: "pointer",
    background: COLOURS.danger,
    color: COLOURS.bg,
};

export function InventoryPage() {
    const navigate = useNavigate();
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!localStorage.getItem("satinroad_token")) {
            navigate("/login");
            return;
        }

        fetch(`${API_BASE}/inventory`, {headers: authHeaders()})
            .then(async res => {
                if (res.status === 401) {
                    clearLogin();
                    navigate("/login");
                    return;
                }
                if (!res.ok) throw new Error("Request failed");
                setItems(await res.json());
            })
            .catch(() => setError("Could not load your inventory."))
            .finally(() => setLoading(false));
    }, [navigate]);

    async function changeQuantity(item: InventoryItem, delta: number) {
        const newQuantity = Math.max(0, item.quantity + delta);
        if (newQuantity === item.quantity) return;

        setBusyId(item.productId);
        try {
            const res = await fetch(`${API_BASE}/products`, {
                method: "PUT",
                headers: {...authHeaders(), "Content-Type": "application/json"},
                body: JSON.stringify({productIdForLookup: item.productId, newQuantity}),
            });

            if (res.status === 401) {
                clearLogin();
                navigate("/login");
                return;
            }
            if (res.status === 403) {
                setError("You can only change your own products.");
                return;
            }
            if (res.status === 404) {
                setError("That product no longer exists.");
                return;
            }
            if (!res.ok) throw new Error("Request failed");

            const updated: InventoryItem = await res.json();
            setError(null);
            setItems(current =>
                current.map(i => (i.productId === updated.productId ? updated : i)),
            );
        } catch {
            setError("Could not update the quantity.");
        } finally {
            setBusyId(null);
        }
    }

    async function removeItem(item: InventoryItem) {
        if (!window.confirm(`Remove "${item.productName}"? This also deletes its listing.`)) return;

        setBusyId(item.productId);
        try {
            const res = await fetch(
                `${API_BASE}/products/${encodeURIComponent(item.productId)}`,
                {method: "DELETE", headers: authHeaders()},
            );

            if (res.status === 401) {
                clearLogin();
                navigate("/login");
                return;
            }
            if (res.status === 403) {
                setError("You can only remove your own products.");
                return;
            }
            if (!res.ok) throw new Error("Request failed");

            setError(null);
            setItems(current => current.filter(i => i.productId !== item.productId));
        } catch {
            setError("Could not remove the item.");
        } finally {
            setBusyId(null);
        }
    }

    const visibleItems = items.filter(item =>
        item.productName.toLowerCase().includes(query.toLowerCase()),
    );

    const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
                <h1 style={{margin: 0, fontSize: 48}}>Private Inventory</h1>

                <Link
                    to="/"
                    style={{
                        padding: "8px 16px",
                        background: COLOURS.accent,
                        color: COLOURS.bg,
                        textDecoration: "none",
                    }}
                >
                    Back to shop
                </Link>
            </header>

            <div style={{padding: "0 24px"}}>
                <div style={{display: "flex", alignItems: "center", gap: 24, margin: "0 0 16px"}}>
                    <input
                        type="search"
                        placeholder="Search inventory"
                        value={query}
                        onChange={event => setQuery(event.target.value)}
                        style={inputStyle}
                    />
                    <span style={{color: COLOURS.subtext}}>
                        {items.length} listing(s), total value {totalValue.toFixed(2)}$
                    </span>
                </div>

                {error && <p style={{color: COLOURS.danger}}>{error}</p>}
                {loading && <p style={{color: COLOURS.subtext}}>Loading...</p>}
                {!loading && items.length === 0 && !error && (
                    <p style={{color: COLOURS.subtext}}>
                        Your inventory is empty. Use "List your product" on the front page to add items.
                    </p>
                )}

                <div style={{display: "flex", flexWrap: "wrap", gap: 16}}>
                    {visibleItems.map(item => (
                        <div
                            key={item.productId}
                            style={{
                                width: 200,
                                padding: 8,
                                background: COLOURS.surface,
                                border: `1px solid ${COLOURS.border}`,
                            }}
                        >
                            <h3 style={{margin: "0 0 8px", fontSize: 16}}>{item.productName}</h3>

                            {item.images ? (
                                <img
                                    src={item.images}
                                    alt={item.productName}
                                    width={184}
                                    height={184}
                                    style={{display: "block", objectFit: "cover"}}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: 184,
                                        height: 184,
                                        display: "grid",
                                        placeItems: "center",
                                        background: COLOURS.bg,
                                        color: COLOURS.subtext,
                                    }}
                                >
                                    No image
                                </div>
                            )}

                            <p style={{margin: "8px 0 0", color: COLOURS.subtext}}>
                                {item.category || "Uncategorised"}
                            </p>
                            <p style={{margin: "4px 0 0", fontWeight: "bold"}}>{item.price}$</p>

                            <div style={{display: "flex", alignItems: "center", gap: 8, margin: "8px 0"}}>
                                <span style={{color: COLOURS.subtext}}>In stock:</span>
                                <button
                                    onClick={() => changeQuantity(item, -1)}
                                    disabled={busyId === item.productId}
                                    style={quantityButtonStyle}
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() => changeQuantity(item, 1)}
                                    disabled={busyId === item.productId}
                                    style={quantityButtonStyle}
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={() => removeItem(item)}
                                disabled={busyId === item.productId}
                                style={removeButtonStyle}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}