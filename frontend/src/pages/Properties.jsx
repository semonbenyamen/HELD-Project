import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import PropertyCard from "../components/PropertyCard";
import styles from "./Properties.module.css";

export default function Properties() {
  const [params] = useSearchParams();

  const [filters, setFilters] = useState({
    search: params.get("search") || "",
    city: "",
    type: "",
    purpose: "",
    bedrooms: "",
    maxPrice: ""
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load(current = filters) {
    setLoading(true);

    try {
      const clean = Object.fromEntries(
        Object.entries(current).filter(([, value]) => value !== "")
      );

      const { data } = await api.get("/properties", {
        params: clean
      });

      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(filters);
  }, []);

  function change(e) {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  }

  return (
    <section className={styles.page}>
      <div className="container">
        <span className={styles.eyebrow}>
          PROPERTY CATALOG
        </span>

        <h1>Find a property that fits</h1>

        <form
          className={styles.filters}
          onSubmit={e => {
            e.preventDefault();
            load();
          }}
        >
          <label className={styles.searchField}>
            <Search size={18} />
            <input
              name="search"
              value={filters.search}
              onChange={change}
              placeholder="Search..."
            />
          </label>

          <input
            name="city"
            value={filters.city}
            onChange={change}
            placeholder="City"
          />

          <select
            name="type"
            value={filters.type}
            onChange={change}
          >
            <option value="">All types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="townhouse">Townhouse</option>
            <option value="office">Office</option>
            <option value="commercial">Commercial</option>
            <option value="chalet">Chalet</option>
            <option value="land">Land</option>
          </select>

          <select
            name="purpose"
            value={filters.purpose}
            onChange={change}
          >
            <option value="">Sale / Rent</option>
            <option value="sale">For sale</option>
            <option value="rent">For rent</option>
          </select>

          <input
            type="number"
            name="bedrooms"
            value={filters.bedrooms}
            onChange={change}
            placeholder="Min beds"
          />

          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={change}
            placeholder="Max price"
          />

          <button className="btn">
            Apply
          </button>
        </form>

        <div className={styles.results}>
          {loading
            ? "Loading..."
            : `${items.length} properties found`}
        </div>

        <div className={styles.grid}>
          {items.map(item => (
            <PropertyCard
              key={item._id}
              item={item}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
