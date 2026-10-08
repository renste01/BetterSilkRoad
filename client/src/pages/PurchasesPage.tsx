import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import type {Product, Purchase} from "../Interface.tsx";
import {getProducts} from "../api/products.ts";
import {getPurchases} from "../api/purchases.ts";
import {COLOURS} from "../Colours.tsx";

export function PurchasesPage() {
    const navigate = useNavigate();
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [stock, setStock] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!localStorage.getItem("satinroad_token")) {
            navigate("/login");
            return;
        }

        // Hent køb og aktuelt lager samtidig. Fejler lager-kaldet, vises købene stadig.
        Promise.all([
            getPurchases(),
            getProducts().catch(() => [] as Product[]),
        ])
            .then(([purchaseList, products]) => {
                setPurchases(purchaseList);
                setStock(Object.fromEntries(products.map(p => [p.productId, p.quantity])));
            })
            .catch(e => {
                if (e instanceof Error && e.message === "UNAUTHORIZED") {
                    localStorage.removeItem("satinroad_token");
                    navigate("/login");
                    return;
                }
                setError("Could not load your purchases.");
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    return (
        <div style={{minHeight: "100vh", background: COLOURS.bg, color: COLOURS.text}}>
            <header style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "16px 24px", borderBottom: `1px solid ${COLOURS.border}`, marginBottom: 24,
            }}>
                <h1 style={{margin: 0, fontSize: 48}}>My purchases</h1>
                <Link to="/" style={{padding: "8px 16px", background: COLOURS.accent,
                    color: COLOURS.bg, textDecoration: "none"}}>
                    Back to shop
                </Link>
            </header>

            <div style={{padding: "0 24px"}}>
                {error && <p style={{color: COLOURS.danger}}>{error}</p>}
                {loading && <p style={{color: COLOURS.subtext}}>Loading...</p>}
                {!loading && !error && purchases.length === 0 && (
                    <p style={{color: COLOURS.subtext}}>You haven't bought anything yet.</p>
                )}

                <div style={{display: "grid", gap: 8}}>
                    {purchases.map(p => {
                        const left = stock[p.productId];

                        return (
                            <div key={p.id} style={{
                                display: "flex", gap: 16, alignItems: "center", padding: 12,
                                background: COLOURS.surface, border: `1px solid ${COLOURS.border}`,
                            }}>
                                {p.images ? (
                                    <img src={p.images} alt={p.productName} width={64} height={64}
                                         style={{objectFit: "cover"}}/>
                                ) : (
                                    <div style={{width: 64, height: 64, display: "grid", placeItems: "center",
                                        background: COLOURS.bg, color: COLOURS.subtext, fontSize: 12}}>
                                        No image
                                    </div>
                                )}
                                <div style={{flex: 1}}>
                                    <strong>{p.productName}</strong>
                                    <div style={{color: COLOURS.subtext}}>
                                        {p.quantity} × {p.unitPrice}$ · Seller: {p.sellerUsername}
                                    </div>
                                    <div style={{color: COLOURS.subtext, fontSize: 13}}>
                                        {new Date(p.purchasedAtUtc).toLocaleString()}
                                    </div>
                                    {left !== undefined && (
                                        <div style={{
                                            fontSize: 13,
                                            color: left > 0 ? COLOURS.subtext : COLOURS.danger,
                                        }}>
                                            {left > 0 ? `Left in stock: ${left}` : "Sold out"}
                                        </div>
                                    )}
                                </div>
                                <strong>{(p.unitPrice * p.quantity).toFixed(2)}$</strong>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}