import "dotenv/config";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Property from "./models/Property.js";

const properties = [
  {
    title: "Modern Apartment in New Cairo",
    slug: "modern-apartment-new-cairo",
    type: "apartment",
    purpose: "sale",
    city: "Cairo",
    area: "Fifth Settlement",
    price: 5800000,
    bedrooms: 3,
    bathrooms: 2,
    sizeSqm: 185,
    description: "Bright modern apartment in a premium New Cairo location.",
    amenities: ["Parking", "Security", "Elevator", "Balcony"],
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    status: "available"
  },
  {
    title: "Family Villa in Sheikh Zayed",
    slug: "family-villa-sheikh-zayed",
    type: "villa",
    purpose: "sale",
    city: "Giza",
    area: "Sheikh Zayed",
    price: 14500000,
    bedrooms: 5,
    bathrooms: 4,
    sizeSqm: 420,
    description: "Spacious family villa with a private garden.",
    amenities: ["Private Garden", "Clubhouse", "Security", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    status: "available"
  },
  {
    title: "Sea View Chalet in North Coast",
    slug: "sea-view-chalet-north-coast",
    type: "chalet",
    purpose: "sale",
    city: "North Coast",
    area: "Sidi Abdel Rahman",
    price: 8200000,
    bedrooms: 2,
    bathrooms: 2,
    sizeSqm: 120,
    description: "Sea-view chalet inside a serviced resort.",
    amenities: ["Sea View", "Pool", "Beach Access", "Security"],
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    status: "available"
  }
];

async function seed() {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || "admin@estateflow.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";

  await User.deleteMany({
    email: {
      $in: [
        adminEmail,
        "mariam@estateflow.com",
        "ahmed@estateflow.com"
      ]
    }
  });

  await User.create([
    {
      name: "EstateFlow Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      active: true
    },
    {
      name: "Mariam Hassan",
      email: "mariam@estateflow.com",
      phone: "+201000000101",
      password: "Agent@123456",
      role: "agent",
      active: true
    },
    {
      name: "Ahmed Ali",
      email: "ahmed@estateflow.com",
      phone: "+201000000102",
      password: "Agent@123456",
      role: "agent",
      active: true
    }
  ]);

  if ((await Property.countDocuments()) === 0) {
    await Property.insertMany(properties);
  }

  console.log("Seed completed");
  console.log(`Admin: ${adminEmail} / ${adminPassword}`);
  console.log("Agent: mariam@estateflow.com / Agent@123456");
  console.log("Agent: ahmed@estateflow.com / Agent@123456");

  process.exit(0);
}

seed().catch(error => {
  console.error(error);
  process.exit(1);
});
