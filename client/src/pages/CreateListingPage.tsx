import {useState, type FormEvent} from "react";
import {Link, useNavigate} from "react-router-dom";
import {createProduct} from "../api/products.ts";

export function CreateListingPage() {
    const navigate = useNavigate();
    const sellerId = Number(localStorage.getItem("satinroad_user_id"));
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [images, setImages] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        if (!Number.isInteger(sellerId) || sellerId <= 0) {
            setError("Please sign in again before creating a listing.");
            return;
        }

        setIsSaving(true);

        try {
            const product = await createProduct({
                productName: productName.trim(),
                sellerId,
                description: description.trim(),
                category: category.trim(),
                price: Number(price),
                quantity: Number(quantity),
                images: images.trim() || undefined,
            });

            navigate(`/products/${product.productId}`);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Could not create the listing.",
            );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <main style={{maxWidth: 600, padding: 24}}>
            <Link 
                to="/"
                style={headerButtonStyle}
            >Back</Link>
            <h1>Create listing</h1>

            <form onSubmit={handleSubmit} style={{display: "grid", gap: 12}}>
                <label>
                    Product name
                    <input required minLength={1} value={productName}
                           onChange={event => setProductName(event.target.value)}
                           style={inputStyle}/>
                </label>

                <label>
                    Description
                    <textarea required minLength={1} value={description}
                              onChange={event => setDescription(event.target.value)}
                              style={inputStyle}/>
                </label>

                <label>
                    Category
                    <input required minLength={1} value={category}
                           onChange={event => setCategory(event.target.value)}
                           style={inputStyle}/>
                </label>

                <label>
                    Price
                    <input required min="0" step="0.01" type="number" value={price}
                           onChange={event => setPrice(event.target.value)}
                           style={inputStyle}/>
                </label>

                <label>
                    Quantity
                    <input required min="0" step="1" type="number" value={quantity}
                           onChange={event => setQuantity(event.target.value)}
                           style={inputStyle}/>
                </label>

                <label>
                    Image URL (optional)
                    <input type="url" value={images}
                           onChange={event => setImages(event.target.value)}
                           style={inputStyle}/>
                </label>

                {error && <p role="alert">{error}</p>}

                <button
                    type="submit"
                    disabled={isSaving}
                    style={headerButtonStyle}
                >
                    {isSaving ? "Listing..." : "List product"}
                </button>
            </form>
        </main>
    );
}

const inputStyle = {
    display: "block",
    boxSizing: "border-box" as const,
    marginTop: 4,
    padding: 8,
    width: "100%",
};

const headerButtonStyle: React.CSSProperties = {
    display: "inline-block",
    boxSizing: "border-box",
    padding: "8px 16px",
    border: "1px solid #767676",
    borderRadius: 2,
    background: "#efefef",
    color: "#000",
    fontSize: 16,
    textDecoration: "none",
    cursor: "pointer",
};
