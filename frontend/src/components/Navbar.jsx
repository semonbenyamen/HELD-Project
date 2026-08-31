import { Building2, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          <span className={styles.icon}>
            <Building2 size={22} />
          </span>
          <span>
            HELD <span className={styles.accent}>REAL ESTATE</span>
          </span>
        </Link>

        <nav className={`${styles.links} ${open ? styles.open : ""}`}>
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>

          <NavLink to="/properties" onClick={() => setOpen(false)}>
            Properties
          </NavLink>

          <a href="/#services" onClick={() => setOpen(false)}>
            Services
          </a>

          <a href="/#contact" onClick={() => setOpen(false)}>
            Contact
          </a>

          <Link
            to="/admin/login"
            className={styles.adminButton}
            onClick={() => setOpen(false)}
          >
            Team Login
          </Link>
        </nav>

        <button
          className={styles.menuButton}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
