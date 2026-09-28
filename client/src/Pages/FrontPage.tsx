import {useEffect, useState} from "react";
import type {Product} from "../Interface.tsx";

export function FrontPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const url = query.trim()
            ? `https://dummyjson.com/products/search?q=${encodeURIComponent(query.trim())}`
            : "https://dummyjson.com/products";

        const timeoutId = setTimeout(() => {
            fetch(url)
                .then(res => res.json())
                .then(json => setProducts(json.products));
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    interface ProductCardProps {
        product: Product;
    }

    function ProductCard({product}: ProductCardProps) {
        const [hovered, setHovered] = useState(false);

        return (
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{opacity: hovered ? 0.8 : 1}}
            >
                {product.title}
                <img
                src={product.images}
                    width={200}
                    />
            </div>
        );
    }

    return (
        <div>
            {products.map(p => (
                <ProductCard key={p.id} product={p} />
            ))}
        </div>
    );
}