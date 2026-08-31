import { MessageCircle } from "lucide-react";
import styles from "./WhatsAppButton.module.css";

export default function WhatsAppButton({
  text = "Hello, I would like to ask about a property."
}) {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER
    || "201000000000";

  const href = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

  return (
    <a
      className={styles.button}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
    >
      <MessageCircle size={23} />
    </a>
  );
}
