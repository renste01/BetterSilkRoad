import { useState } from "react";
import "./index.css";
import Login from "./Login";
import Register from "./Register";
import { api } from "./api";
import { useNavigate } from "react-router-dom";


const KEY = "satinroad_user";
const USER_ID_KEY = "satinroad_user_id";
const TOKEN_KEY = "satinroad_token";

function extractErrorMessage(err: unknown): string {
    if (err instanceof TypeError) {
        return "Can't reach the server. Is the backend running?";
    }

    if (err && typeof err === "object" && "error" in err) {
        const inner = (err as { error: unknown }).error;

        if (typeof inner === "string" && inner) return inner;

        if (inner instanceof Error) {
            return "The server hit an unexpected error. Try again in a moment.";
        }

        if (inner && typeof inner === "object") {
            const problem = inner as { errors?: Record<string, string[]>; title?: string };
            const firstFieldError = problem.errors && Object.values(problem.errors)[0]?.[0];
            if (firstFieldError) return firstFieldError;
            if (problem.title) return problem.title;
        }
    }

    return "Something went wrong. Try again.";
}

export function App() {
    const navigate = useNavigate();
    const [user, setUser] = useState<string | null>(() => localStorage.getItem(KEY));
    const [view, setView] = useState<"login" | "register">("login");

    async function handleLogin(email: string, password: string) {
        try {
            const res = await api.api.authLogin({ email, password });
            localStorage.setItem(KEY, res.data.userName);
            localStorage.setItem(USER_ID_KEY, String(res.data.id));
            localStorage.setItem(TOKEN_KEY, res.data.token);
            localStorage.setItem("satinroad_is_admin", String(res.data.isAdmin));
            setUser(res.data.userName);
            setTimeout(() => navigate("/"), 1000);
        } catch (err) {
            throw new Error(extractErrorMessage(err));
        }
    }

    async function handleRegister(
        username: string,
        email: string,
        password: string
    ) {
        try {
            const res = await api.api.authRegister({
                userName: username,
                email,
                password,
            });

            localStorage.setItem(KEY, res.data.userName);
            localStorage.setItem(USER_ID_KEY, String(res.data.id));
            localStorage.setItem(TOKEN_KEY, res.data.token);
            localStorage.setItem("satinroad_is_admin", String(res.data.isAdmin));
            setUser(res.data.userName);
            setTimeout(() => navigate("/"), 5000);
        } catch (err) {
            throw new Error(extractErrorMessage(err));
        }
    }

    if (!user) {
        return view === "login" ? (
            <Login onLogin={handleLogin} onSwitchToRegister={() => setView("register")} />
        ) : (
            <Register onRegister={handleRegister} onSwitchToLogin={() => setView("login")} />
        );
    }

    return (
        <main className="home">
            <h1>Welcome to Satin Road</h1>
            <p>Signed in as {user}</p>
        </main>
    );
}

export default App;
