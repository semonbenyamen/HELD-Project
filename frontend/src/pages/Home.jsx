import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarCheck,
  Search,
  ShieldCheck,
  Users
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import PropertyCard from "../components/PropertyCard";
import styles from "./Home.module.css";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/properties/featured")
      .then(({ data }) => setFeatured(data.items || []))
      .catch(() => setFeatured([]));
  }, []);

  function submit(e) {
    e.preventDefault();
    navigate(`/properties?search=${encodeURIComponent(search)}`);
  }

  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div>
            <span className={styles.eyebrow}>
              REAL ESTATE, ORGANIZED
            </span>

            <h1>
              Find the right property. <span>Move faster.</span>
            </h1>

            <p>
              Discover verified opportunities, request details and
              schedule viewings without endless calls and spreadsheets.
            </p>

            <form className={styles.search} onSubmit={submit}>
              <Search size={20} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by city, area or property..."
              />
              <button className="btn">
                Search
              </button>
            </form>

            <div className={styles.proof}>
              <span>
                <ShieldCheck size={18} />
                Organized inventory
              </span>

              <span>
                <CalendarCheck size={18} />
                Easy viewings
              </span>

              <span>
                <Users size={18} />
                Faster follow-up
              </span>
            </div>
          </div>

          <div className={styles.heroArt}>
            <img
              src="https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1400&q=85"
              alt="Luxury real estate"
            />

            <div className={styles.floatingCard}>
              <strong>One connected journey</strong>
              <span>
                Discover → Inquire → Visit → Close
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.sectionHead}`}>
          <div>
            <span className={styles.eyebrow}>FEATURED</span>
            <h2>Properties worth seeing</h2>
          </div>

          <Link
            to="/properties"
            className={styles.textLink}
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className={`container ${styles.propertyGrid}`}>
          {featured.length
            ? featured.map(item => (
                <PropertyCard
                  key={item._id}
                  item={item}
                />
              ))
            : <p>No featured properties yet.</p>}
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.soft}`}
        id="services"
      >
        <div className="container">
          <div className={styles.centerHeading}>
            <span className={styles.eyebrow}>
              A BETTER CUSTOMER JOURNEY
            </span>

            <h2>
              Built around how real estate actually works
            </h2>
          </div>

          <div className={styles.featureGrid}>
            {[
              ["01", "Discover", "Search a clean, organized inventory instead of scattered posts."],
              ["02", "Inquire", "Send interest instantly and attach it to the exact property."],
              ["03", "Schedule", "Request a viewing date without phone-tag."],
              ["04", "Follow up", "The team tracks every lead and next step from one dashboard."]
            ].map(([number, title, description]) => (
              <div
                className={styles.featureCard}
                key={number}
              >
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
