import type {CartItem, Product} from "../Interface.tsx";

function cartKey(): string {
    return `satinroad_cart_${localStorage.getItem("satinroad_user_id") ?? "guest"}`;
}

export function getCart(): CartItem[] {
    try {
        const raw = localStorage.getItem(cartKey());
        return raw ? JSON.parse(raw) as CartItem[] : [];
    } catch {
        return [];
    }
}

function saveCart(items: CartItem[]): CartItem[] {
    localStorage.setItem(cartKey(), JSON.stringify(items));
    return items;
}

export function addToCart(product: Product, quantity: number): CartItem[] {
    const items = getCart();
    const existing = items.find(i => i.productId === product.productId);

    if (existing) {
        existing.quantity = Math.min(product.quantity, existing.quantity + quantity);
        existing.price = product.price;
    } else {
        items.push({
            productId: product.productId,
            productName: product.productName,
            price: product.price,
            quantity: Math.min(product.quantity, quantity),
            images: product.images ?? null,
            sellerUsername: product.sellerUsername,
        });
    }
    return saveCart(items);
}

export function removeFromCart(productId: string): CartItem[] {
    return saveCart(getCart().filter(i => i.productId !== productId));
}

export function clearCart(): void {
    saveCart([]);
}

export function getCartCount(): number {
    return getCart().reduce((sum, i) => sum + i.quantity, 0);
}