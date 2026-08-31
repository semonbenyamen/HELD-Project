import { Building2, Mail, Phone } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <div className={`container ${styles.grid}`}>
        <div>
          <div className={styles.brand}>
            <Building2 size={22} />
            HELD REAL ESTATE
          </div>
          <p>
            Real estate discovery, lead management and viewing
            coordination in one simple flow.
          </p>
        </div>

        <div>
          <h4>Contact</h4>
          <p>
            <Phone size={15} />
            +20 100 000 0000
          </p>
          <p>
            <Mail size={15} />
            sales@estateflow.com
          </p>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        © {new Date().getFullYear()} HELD REAL ESTATE.
      </div>
    </footer>
  );
}
