import { useState } from "react";
import "./index.css";
import Login from "./Login";

const KEY = "satinroad_user";
const API_BASE = "http://localhost:5153";

export function App() {
    const [user, setUser] = useState<string | null>(() => localStorage.getItem(KEY));

    async function handleLogin(email: string, password: string) {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            throw new Error(
                res.status === 401 ? "Invalid email or password." : "Something went wrong. Try again."
            );
        }

        const data = await res.json();
        localStorage.setItem(KEY, data.email);
        setUser(data.email);
    }

    function handleLogout() {
        localStorage.removeItem(KEY);
        setUser(null);
    }

    if (!user) return <Login onLogin={handleLogin} />;

    return (
        <main className="home">
            <h1>Welcome to Satin Road</h1>
            <p>Signed in as {user}</p>
            <button onClick={handleLogout}>Sign out</button>
        </main>
    );
}

export default App;