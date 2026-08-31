import {
  BedDouble,
  Bath,
  Maximize2,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./PropertyCard.module.css";

function money(value) {
  return new Intl.NumberFormat("en-EG", {
    maximumFractionDigits: 0
  }).format(value);
}

export default function PropertyCard({ item }) {
  const image = item.images?.[0]
    || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80";

  return (
    <article className={styles.card}>
      <Link
        to={`/properties/${item.slug || item._id}`}
        className={styles.imageWrap}
      >
        <img
          src={image}
          alt={item.title}
          className={styles.image}
        />

        <span className={styles.pill}>
          {item.purpose === "rent" ? "For Rent" : "For Sale"}
        </span>
      </Link>

      <div className={styles.body}>
        <div className={styles.location}>
          <MapPin size={15} />
          {item.area}, {item.city}
        </div>

        <h3>
          <Link to={`/properties/${item.slug || item._id}`}>
            {item.title}
          </Link>
        </h3>

        <div className={styles.price}>
          EGP {money(item.price)}
        </div>

        <div className={styles.meta}>
          <span>
            <BedDouble size={16} />
            {item.bedrooms}
          </span>

          <span>
            <Bath size={16} />
            {item.bathrooms}
          </span>

          <span>
            <Maximize2 size={16} />
            {item.sizeSqm} m²
          </span>
        </div>
      </div>
    </article>
  );
}
