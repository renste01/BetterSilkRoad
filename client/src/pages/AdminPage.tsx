import {useEffect, useMemo, useState, type FormEvent} from "react";
import {Link, useNavigate} from "react-router-dom";
import type {Product} from "../Interface.tsx";
import {authHeaders, deleteProduct, getProducts, updateProduct} from "../api/products.ts";
import {COLOURS} from "../Colours.tsx";

interface Category { id: number; name: string; description: string | null; }
const API = "/api";
const inputStyle: React.CSSProperties = {padding: 8, background: COLOURS.surface, color: COLOURS.text, border: `1px solid ${COLOURS.border}`, width: "100%", boxSizing: "border-box"};
const buttonStyle: React.CSSProperties = {padding: "8px 12px", border: 0, background: COLOURS.accent, color: COLOURS.bg, cursor: "pointer"};

export function AdminPage() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [editingCategory, setEditingCategory] = useState<number | null>(null);
    const [query, setQuery] = useState("");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    async function load() {
        const [categoryResponse, allProducts] = await Promise.all([
            fetch(`${API}/categories`), getProducts(),
        ]);
        if (!categoryResponse.ok) throw new Error("Could not load categories.");
        setCategories(await categoryResponse.json() as Category[]);
        setProducts(allProducts);
    }

    useEffect(() => {
        if (!localStorage.getItem("satinroad_token")) { navigate("/login"); return; }
        if (localStorage.getItem("satinroad_is_admin") !== "true") { navigate("/"); return; }
        load().catch(() => setError("Could not load the admin dashboard."))
            .finally(() => setLoading(false));
    }, [navigate]);

    function resetCategoryForm() {
        setCategoryName(""); setCategoryDescription(""); setEditingCategory(null);
    }

    async function saveCategory(event: FormEvent) {
        event.preventDefault(); setError(null);
        try {
            const response = await fetch(`${API}/categories${editingCategory === null ? "" : `/${editingCategory}`}`, {
                method: editingCategory === null ? "POST" : "PUT",
                headers: authHeaders(true),
                body: JSON.stringify({name: categoryName.trim(), description: categoryDescription.trim() || null}),
            });
            if (!response.ok) throw new Error(await response.text() || "Could not save category.");
            resetCategoryForm(); await load();
        } catch (e) { setError(e instanceof Error ? e.message : "Could not save category."); }
    }

    async function removeCategory(category: Category) {
        if (!window.confirm(`Delete category “${category.name}”?`)) return;
        try {
            const response = await fetch(`${API}/categories/${category.id}`, {method: "DELETE", headers: authHeaders()});
            if (!response.ok) throw new Error(await response.text() || "Could not delete category.");
            setCategories(current => current.filter(item => item.id !== category.id));
        } catch (e) { setError(e instanceof Error ? e.message : "Could not delete category."); }
    }

    async function saveProduct(event: FormEvent) {
        event.preventDefault(); if (!editingProduct) return;
        try {
            const updated = await updateProduct(editingProduct.productId, {
                newProductName: editingProduct.productName.trim(), newDescription: editingProduct.description.trim(),
                newCategory: editingProduct.category.trim(), newPrice: Number(editingProduct.price),
                newQuantity: Number(editingProduct.quantity), newImages: editingProduct.images ?? null,
            });
            setProducts(current => current.map(p => p.productId === updated.productId ? updated : p));
            setEditingProduct(null); setError(null);
        } catch (e) { setError(e instanceof Error ? e.message : "Could not update listing."); }
    }

    async function removeProduct(product: Product) {
        if (!window.confirm(`Remove “${product.productName}” from the marketplace?`)) return;
        try {
            await deleteProduct(product.productId);
            setProducts(current => current.filter(item => item.productId !== product.productId));
        } catch (e) { setError(e instanceof Error ? e.message : "Could not remove listing."); }
    }

    const filteredProducts = useMemo(() => products.filter(product =>
        `${product.productName} ${product.sellerUsername} ${product.category}`.toLowerCase().includes(query.toLowerCase())), [products, query]);

    if (localStorage.getItem("satinroad_is_admin") !== "true") return null;

    return <main style={{minHeight: "100vh", padding: 24, background: COLOURS.bg, color: COLOURS.text}}>
        <header style={{display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${COLOURS.border}`, marginBottom: 24}}>
            <h1>Admin dashboard</h1><Link to="/" style={{...buttonStyle, textDecoration: "none"}}>Back to shop</Link>
        </header>
        {error && <p role="alert" style={{color: COLOURS.danger}}>{error}</p>}
        {loading ? <p>Loading dashboard…</p> : <>
            <section style={{marginBottom: 36}}>
                <h2>Categories</h2>
                <form onSubmit={saveCategory} style={{display: "grid", gridTemplateColumns: "minmax(160px, 1fr) minmax(200px, 2fr) auto auto", gap: 8, marginBottom: 16}}>
                    <input aria-label="Category name" required value={categoryName} onChange={e => setCategoryName(e.target.value)} placeholder="Category name" style={inputStyle}/>
                    <input aria-label="Description" value={categoryDescription} onChange={e => setCategoryDescription(e.target.value)} placeholder="Description (optional)" style={inputStyle}/>
                    <button style={buttonStyle} type="submit">{editingCategory === null ? "Add category" : "Save category"}</button>
                    {editingCategory !== null && <button type="button" onClick={resetCategoryForm} style={buttonStyle}>Cancel</button>}
                </form>
                <div style={{display: "grid", gap: 8}}>{categories.map(category => <div key={category.id} style={{display: "flex", gap: 12, alignItems: "center", padding: 12, background: COLOURS.surface, border: `1px solid ${COLOURS.border}`}}>
                    <div style={{flex: 1}}><strong>{category.name}</strong>{category.description && <div style={{color: COLOURS.subtext}}>{category.description}</div>}</div>
                    <button style={buttonStyle} onClick={() => {setEditingCategory(category.id); setCategoryName(category.name); setCategoryDescription(category.description ?? "");}}>Edit</button>
                    <button style={{...buttonStyle, background: COLOURS.danger}} onClick={() => removeCategory(category)}>Delete</button>
                </div>)}</div>
            </section>
            <section>
                <h2>Marketplace listings <small style={{fontSize: 14, color: COLOURS.subtext}}>({products.length})</small></h2>
                <input type="search" placeholder="Search title, seller, or category" value={query} onChange={e => setQuery(e.target.value)} style={{...inputStyle, maxWidth: 420, marginBottom: 12}}/>
                <div style={{overflowX: "auto"}}><table style={{width: "100%", borderCollapse: "collapse", background: COLOURS.surface}}>
                    <thead><tr>{["Listing", "Seller", "Category", "Price", "Quantity", "Actions"].map(label => <th key={label} style={{textAlign: "left", padding: 10, borderBottom: `1px solid ${COLOURS.border}`}}>{label}</th>)}</tr></thead>
                    <tbody>{filteredProducts.map(product => <tr key={product.productId}>
                        <td style={cellStyle}>{product.productName}</td><td style={cellStyle}>{product.sellerUsername} <small>#{product.sellerId}</small></td><td style={cellStyle}>{product.category}</td><td style={cellStyle}>{product.price}</td><td style={cellStyle}>{product.quantity}</td>
                        <td style={{...cellStyle, whiteSpace: "nowrap"}}><button style={buttonStyle} onClick={() => setEditingProduct({...product})}>Edit</button>{" "}<button style={{...buttonStyle, background: COLOURS.danger}} onClick={() => removeProduct(product)}>Remove</button></td>
                    </tr>)}</tbody>
                </table></div>
            </section>
        </>}
        {editingProduct && <div role="dialog" aria-modal="true" aria-labelledby="edit-listing-title" style={{position: "fixed", inset: 0, background: "#000a", display: "grid", placeItems: "center", padding: 16}}>
            <form onSubmit={saveProduct} style={{background: COLOURS.bg, color: COLOURS.text, padding: 24, width: "min(560px, 100%)", maxHeight: "90vh", overflow: "auto", display: "grid", gap: 12}}>
                <h2 id="edit-listing-title">Edit listing</h2>
                {(["productName", "description", "category", "price", "quantity", "images"] as const).map(field => <label key={field}>{field === "images" ? "Image URL" : field.charAt(0).toUpperCase() + field.slice(1)}
                    {field === "description" ? <textarea value={editingProduct[field] ?? ""} onChange={e => setEditingProduct({...editingProduct, [field]: e.target.value})} style={inputStyle}/> : <input required={field !== "images"} type={field === "price" || field === "quantity" ? "number" : "text"} min={field === "price" || field === "quantity" ? 0 : undefined} step={field === "price" ? "0.01" : field === "quantity" ? 1 : undefined} value={editingProduct[field] ?? ""} onChange={e => setEditingProduct({...editingProduct, [field]: field === "price" || field === "quantity" ? Number(e.target.value) : e.target.value})} style={inputStyle}/>}</label>)}
                <div style={{display: "flex", gap: 8}}><button type="submit" style={buttonStyle}>Save changes</button><button type="button" style={buttonStyle} onClick={() => setEditingProduct(null)}>Cancel</button></div>
            </form>
        </div>}
    </main>;
}

const cellStyle: React.CSSProperties = {padding: 10, borderBottom: `1px solid ${COLOURS.border}`};
