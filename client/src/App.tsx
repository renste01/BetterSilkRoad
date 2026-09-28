import { useState } from "react";
import "./index.css";
import Login from "./Login";

const KEY = "satinroad_user";

export function App() {
    const [user, setUser] = useState<string | null>(() => localStorage.getItem(KEY));

    // Mock login: any email and password is accepted.
    // Swap this for the real API call when the backend is ready.
    async function handleLogin(email: string) {
        localStorage.setItem(KEY, email);
        setUser(email);
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