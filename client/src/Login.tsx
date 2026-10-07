import { useState, type FormEvent } from "react";
import "./Login.css";
import {COLOURS} from "@/Colours.tsx";

type LoginProps = {
    onLogin: (email: string, password: string) => Promise<void>;
    onSwitchToRegister: () => void;
};

export default function Login({ onLogin, onSwitchToRegister }: LoginProps) {
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
        <main className="login" style={{background: COLOURS.bg}}>
            <section className="login__card" aria-labelledby="login-title" style={{background: COLOURS.surface}}>
                <h1 id="login-title" className="login__title" style={{color: COLOURS.text}}>Satin Road</h1>
                <p className="login__sub" style={{color: COLOURS.accent}}>Sign in to buy, sell and manage your listings.</p>

                <form onSubmit={handleSubmit} noValidate>
                    <label className="login__field" style={{color: COLOURS.text}}>
                        Email
                        <input
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{background: COLOURS.surface,
                            borderColor: COLOURS.border,
                            color: COLOURS.text}}
                        />
                    </label>

                    <label className="login__field" style={{color: COLOURS.text}}>
                        Password
                        <input
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{background: COLOURS.surface,
                                borderColor: COLOURS.border,
                                color: COLOURS.text}}
                        />
                    </label>

                    {error && <p className="login__error" role="alert">{error}</p>}

                    <button className="login__btn" type="submit" disabled={busy || !email || !password} 
                            style={{color: COLOURS.text}}>
                        {busy ? "Signing in…" : "Sign in"} 
                    </button>
                </form>

                <p className="login__alt" style={{color: COLOURS.text}}>
                    New here?{" "}
                    <button type="button" className="login__link" onClick={onSwitchToRegister} style={{color: COLOURS.text}}>
                        Create an account
                    </button>
                </p>
            </section>
        </main>
    );
}