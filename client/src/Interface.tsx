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
    sellerId: number;
    description: string;
    category: string;
    price: number;
    quantity: number;
    images?: string;
}
