import type {CheckoutItem, Purchase} from "../Interface.tsx";
import {authHeaders} from "./products.ts";

const API_URL = "";

export async function checkout(items: CheckoutItem[]): Promise<Purchase[]> {
    const response = await fetch(`${API_URL}/api/purchases/checkout`, {
        method: "POST",
        headers: authHeaders(true),
        body: JSON.stringify({items}),
    });

    if (response.status === 401) throw new Error("UNAUTHORIZED");
    if (!response.ok) throw new Error((await response.text()) || `Checkout failed (${response.status})`);

    return response.json() as Promise<Purchase[]>;
}

export async function getPurchases(): Promise<Purchase[]> {
    const response = await fetch(`${API_URL}/api/purchases`, {headers: authHeaders()});

    if (response.status === 401) throw new Error("UNAUTHORIZED");
    if (!response.ok) throw new Error(`Could not load purchases (${response.status})`);

    return response.json() as Promise<Purchase[]>;
}