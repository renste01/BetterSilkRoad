import type {CreateProductRequest, Product} from "../Interface.tsx";

const API_URL = "http://localhost:5153";

async function getProductResponse(response: Response): Promise<Product> {
    if (!response.ok) {
        throw new Error(`Product request failed with status ${response.status}`);
    }

    return response.json() as Promise<Product>;
}

export async function getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/api/products`);

    if (!response.ok) {
        throw new Error(`Product request failed with status ${response.status}`);
    }

    return response.json() as Promise<Product[]>;
}

export async function getProduct(productId: string): Promise<Product> {
    return getProductResponse(
        await fetch(`${API_URL}/api/products/${encodeURIComponent(productId)}`),
    );
}
export async function createProduct(product: CreateProductRequest): Promise<Product>{
    const response = await fetch(`${API_URL}/api/products`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(product),
    });

    if(!response.ok){
        const errorText = await response.text();
        throw new Error(errorText || `Could not create product (${response.status})`);
    }
    return response.json()
}
