import { useEffect, useState } from "react";
import {
  Bath,
  BedDouble,
  CalendarDays,
  Check,
  MapPin,
  Maximize2,
  PhoneCall
} from "lucide-react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import styles from "./PropertyDetails.module.css";

const money = value => new Intl.NumberFormat("en-EG", {
  maximumFractionDigits: 0
}).format(value || 0);

export default function PropertyDetails() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [mode, setMode] = useState("inquiry");
  const [feedback, setFeedback] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    preferredDate: "",
    note: ""
  });

  useEffect(() => {
    api.get(`/properties/${id}`)
      .then(({ data }) => setItem(data.item))
      .catch(() => setItem(null));
  }, [id]);

  function change(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function submit(e) {
    e.preventDefault();
    setFeedback("");

    try {
      if (mode === "inquiry") {
        await api.post("/leads", {
          property: item._id,
          name: form.name,
          phone: form.phone,
          email: form.email,
          message: form.message
        });

        setFeedback("Thanks! Your inquiry has been sent.");
      } else {
        await api.post("/appointments", {
          property: item._id,
          name: form.name,
          phone: form.phone,
          email: form.email,
          preferredDate: form.preferredDate,
          note: form.note
        });

        setFeedback("Your viewing request has been sent.");
      }
    } catch (error) {
      setFeedback(
        error.response?.data?.message
        || "Something went wrong."
      );
    }
  }

  if (!item) {
    return (
      <section className={styles.page}>
        <div className="container">
          Loading property...
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className="container">
        <div className={styles.layout}>
          <div>
            <div className={styles.gallery}>
              <img
                src={item.images?.[0]}
                alt={item.title}
              />
            </div>

            <div className={styles.titleRow}>
              <div>
                <div className={styles.location}>
                  <MapPin size={16} />
                  {item.area}, {item.city}
                </div>
                <h1>{item.title}</h1>
              </div>

              <div className={styles.price}>
                EGP {money(item.price)}
              </div>
            </div>

            <div className={styles.meta}>
              <span>
                <BedDouble />
                <strong>{item.bedrooms}</strong>
                Bedrooms
              </span>

              <span>
                <Bath />
                <strong>{item.bathrooms}</strong>
                Bathrooms
              </span>

              <span>
                <Maximize2 />
                <strong>{item.sizeSqm}</strong>
                m²
              </span>
            </div>

            <div className={styles.block}>
              <h2>About this property</h2>
              <p>{item.description}</p>
            </div>

            <div className={styles.block}>
              <h2>Amenities</h2>

              <div className={styles.amenities}>
                {item.amenities?.map(amenity => (
                  <span key={amenity}>
                    <Check size={16} />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <aside className={styles.contactCard}>
            <div className={styles.switch}>
              <button
                className={mode === "inquiry" ? styles.active : ""}
                onClick={() => setMode("inquiry")}
              >
                <PhoneCall size={17} />
                Inquiry
              </button>

              <button
                className={mode === "viewing" ? styles.active : ""}
                onClick={() => setMode("viewing")}
              >
                <CalendarDays size={17} />
                Viewing
              </button>
            </div>

            <h3>
              {mode === "inquiry"
                ? "Ask about this property"
                : "Request a viewing"}
            </h3>

            <form
              onSubmit={submit}
              className={styles.form}
            >
              <input
                name="name"
                placeholder="Full name"
                value={form.name}
                onChange={change}
                required
              />

              <input
                name="phone"
                placeholder="Phone number"
                value={form.phone}
                onChange={change}
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email (optional)"
                value={form.email}
                onChange={change}
              />

              {mode === "inquiry" ? (
                <textarea
                  name="message"
                  placeholder="What would you like to know?"
                  value={form.message}
                  onChange={change}
                />
              ) : (
                <>
                  <input
                    name="preferredDate"
                    type="datetime-local"
                    value={form.preferredDate}
                    onChange={change}
                    required
                  />

                  <textarea
                    name="note"
                    placeholder="Any note for the agent?"
                    value={form.note}
                    onChange={change}
                  />
                </>
              )}

              <button className="btn full">
                {mode === "inquiry"
                  ? "Send inquiry"
                  : "Request viewing"}
              </button>
            </form>

            {feedback && (
              <div className={styles.feedback}>
                {feedback}
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
