import { useState } from "react";
import {
  Building2,
  LockKeyhole
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./AdminLogin.module.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@estateflow.com");
  const [password, setPassword] = useState("Admin@123456");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message
        || "Login failed"
      );
    }
  }

  return (
    <section className={styles.page}>
      <form
        className={styles.card}
        onSubmit={submit}
      >
        <div className={styles.brand}>
          <span className={styles.brandIcon}>
            <Building2 size={22} />
          </span>
          HELD REAL ESTATE
        </div>

        <div className={styles.lockIcon}>
          <LockKeyhole />
        </div>

        <h1>Team access</h1>
        <p>
          Admins and sales agents can access their
          workspace here.
        </p>

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        <button className="btn full">
          Sign in
        </button>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
      </form>
    </section>
  );
}
