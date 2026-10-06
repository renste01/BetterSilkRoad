import { useState, type FormEvent } from "react";
import "./Login.css";

type RegisterProps = {
    onRegister: (
        username: string,
        email: string,
        password: string
    ) => Promise<void>;
    onSwitchToLogin: () => void;
};

export default function Register({
    onRegister,
    onSwitchToLogin,
}: RegisterProps) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();

        if (trimmedUsername.length < 3) {
            setError("Username must be at least 3 characters.");
            return;
        }

        if (trimmedUsername.length > 20) {
            setError("Username must be at most 20 characters.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        setBusy(true);

        try {
            await onRegister(
                trimmedUsername,
                trimmedEmail,
                password
            );
        } catch (err) {
            setError(
                err instanceof Error && err.message
                    ? err.message
                    : "We couldn't create your account. Try again."
            );
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="login">
            <section className="login__card" aria-labelledby="register-title">
                <h1 id="register-title" className="login__title">
                    Satin Road
                </h1>

                <p className="login__sub">
                    Create an account to start buying and selling.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                    <label className="login__field">
                        Username
                        <input
                            type="text"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            minLength={3}
                            maxLength={20}
                            required
                        />
                    </label>

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
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={8}
                            required
                        />
                    </label>

                    <label className="login__field">
                        Confirm password
                        <input
                            type="password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            minLength={8}
                            required
                        />
                    </label>

                    {error && (
                        <p className="login__error" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        className="login__btn"
                        type="submit"
                        disabled={
                            busy ||
                            !username ||
                            !email ||
                            !password ||
                            !confirmPassword
                        }
                    >
                        {busy ? "Creating account…" : "Create account"}
                    </button>
                </form>

                <p className="login__alt">
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="login__link"
                        onClick={onSwitchToLogin}
                    >
                        Sign in
                    </button>
                </p>
            </section>
        </main>
    );
}