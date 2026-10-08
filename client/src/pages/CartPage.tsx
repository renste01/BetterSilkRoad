import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import type {CartItem} from "../Interface.tsx";
import {checkout} from "../api/purchases.ts";
import {clearCart, getCart, removeFromCart} from "../lib/cart.ts";
import {COLOURS} from "../Colours.tsx";

const buttonStyle: React.CSSProperties = {
    padding: "8px 16px",
    border: 0,
    background: COLOURS.accent,
    color: COLOURS.bg,
    cursor: "pointer",
    textDecoration: "none",
    fontSize: 16,
};

export function CartPage() {
    const navigate = useNavigate();
    const [items, setItems] = useState<CartItem[]>(() => getCart());
    const [error, setError] = useState<string | null>(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    function undo(item: CartItem) {
        setItems(removeFromCart(item.productId));
    }

    async function handleCheckout() {
        if (!localStorage.getItem("satinroad_token")) {
            navigate("/login");
            return;
        }

        setIsCheckingOut(true);
        setError(null);

        try {
            await checkout(items.map(i => ({productId: i.productId, quantity: i.quantity})));
            clearCart();
            navigate("/purchases");
        } catch (e) {
            if (e instanceof Error && e.message === "UNAUTHORIZED") {
                localStorage.removeItem("satinroad_token");
                navigate("/login");
                return;
            }
            setError(e instanceof Error ? e.message : "Checkout failed.");
        } finally {
            setIsCheckingOut(false);
        }
    }

    return (
        <div style={{minHeight: "100vh", background: COLOURS.bg, color: COLOURS.text}}>
            <header style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "16px 24px", borderBottom: `1px solid ${COLOURS.border}`, marginBottom: 24,
            }}>
                <h1 style={{margin: 0, fontSize: 48}}>Cart</h1>
                <Link to="/" style={buttonStyle}>Back to shop</Link>
            </header>

            <div style={{padding: "0 24px"}}>
                {items.length === 0 && (
                    <p style={{color: COLOURS.subtext}}>Your cart is empty.</p>
                )}

                <div style={{display: "grid", gap: 8, marginBottom: 16}}>
                    {items.map(item => (
                        <div key={item.productId} style={{
                            display: "flex", gap: 16, alignItems: "center", padding: 12,
                            background: COLOURS.surface, border: `1px solid ${COLOURS.border}`,
                        }}>
                            {item.images ? (
                                <img src={item.images} alt={item.productName} width={64} height={64}
                                     style={{objectFit: "cover"}}/>
                            ) : (
                                <div style={{width: 64, height: 64, display: "grid", placeItems: "center",
                                    background: COLOURS.bg, color: COLOURS.subtext, fontSize: 12}}>
                                    No image
                                </div>
                            )}
                            <div style={{flex: 1}}>
                                <strong>{item.productName}</strong>
                                <div style={{color: COLOURS.subtext}}>
                                    {item.quantity} × {item.price}$ · Seller: {item.sellerUsername}
                                </div>
                            </div>
                            <strong>{(item.price * item.quantity).toFixed(2)}$</strong>
                            <button onClick={() => undo(item)}
                                    style={{...buttonStyle, background: COLOURS.danger}}>
                                Undo
                            </button>
                        </div>
                    ))}
                </div>

                {error && <p role="alert" style={{color: COLOURS.danger}}>{error}</p>}

                {items.length > 0 && (
                    <div style={{display: "flex", alignItems: "center", gap: 16}}>
                        <strong style={{fontSize: 20}}>Total: {total.toFixed(2)}$</strong>
                        <button onClick={handleCheckout} disabled={isCheckingOut} style={buttonStyle}>
                            {isCheckingOut ? "Processing..." : "Checkout"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}