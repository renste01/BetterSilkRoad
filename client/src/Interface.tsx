export interface Product {
    productId: string;
    productName: string;
    description: string;
    category: string;
    price: number;
    quantity: number;
    sellerId: number;
    sellerUsername: string;
    images?: string;
}
export interface CreateProductRequest{
    productName: string;
    description: string;
    category: string;
    price: number;
    quantity: number;
    images?: string;
}
export interface CartItem {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    images: string | null;
    sellerUsername: string;
}

export interface CheckoutItem {
    productId: string;
    quantity: number;
}

export interface Purchase {
    id: number;
    productId: string;
    productName: string;
    sellerUsername: string;
    images: string | null;
    unitPrice: number;
    quantity: number;
    purchasedAtUtc: string;
}
