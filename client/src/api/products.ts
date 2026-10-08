import type {CreateProductRequest, Product} from "../Interface.tsx";

const API_URL = "http://localhost:5153";

export function authHeaders(json = false): Record<string, string> {
    const token = localStorage.getItem("satinroad_token");
    return {
        ...(json ? {"Content-Type": "application/json"} : {}),
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
    };
}

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
        headers: authHeaders(true),
        body: JSON.stringify(product),
    });

    if(!response.ok){
        const errorText = await response.text();
        throw new Error(errorText || `Could not create product (${response.status})`);
    }
    return response.json()
}

export async function updateProduct(productId: string, changes: Record<string, unknown>): Promise<Product> {
    const response = await fetch(`${API_URL}/api/products`, {
        method: "PUT",
        headers: authHeaders(true),
        body: JSON.stringify({productIdForLookup: productId, ...changes}),
    });
    if (!response.ok) throw new Error((await response.text()) || `Could not update product (${response.status})`);
    return response.json() as Promise<Product>;
}

export async function deleteProduct(productId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/products/${encodeURIComponent(productId)}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    if (!response.ok) throw new Error((await response.text()) || `Could not delete product (${response.status})`);
}
