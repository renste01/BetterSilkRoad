import { useState, type FormEvent } from "react";
import "./login.css";

type LoginProps = {
    // Wire this to your swagger-typescript-api client, e.g.
    // (email, password) => api.auth.login({ email, password }).then(res => save token)
    onLogin: (email: string, password: string) => Promise<void>;
};

export default function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setBusy(true);
        try {
            await onLogin(email.trim(), password);
        } catch (err) {
            setError(
                err instanceof Error && err.message
                    ? err.message
                    : "We couldn't sign you in. Check your email and password."
            );
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="login">
            <section className="login__card" aria-labelledby="login-title">
                <h1 id="login-title" className="login__title">Satin Road</h1>
                <p className="login__sub">Sign in to buy, sell and manage your listings.</p>

                <form onSubmit={handleSubmit} noValidate>
                    <label className="login__field">
                        Email
                        <input
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>

                    <label className="login__field">
                        Password
                        <input
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>

                    {error && <p className="login__error" role="alert">{error}</p>}

                    <button className="login__btn" type="submit" disabled={busy || !email || !password}>
                        {busy ? "Signing in…" : "Sign in"}
                    </button>
                </form>

                <p className="login__alt">
                    New here? <a href="/register">Create an account</a>
                </p>
            </section>
        </main>
    );
}