import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    type: {
      type: String,
      enum: ["apartment", "villa", "townhouse", "office", "commercial", "chalet", "land"],
      required: true
    },
    purpose: { type: String, enum: ["sale", "rent"], default: "sale" },
    city: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    bedrooms: { type: Number, default: 0, min: 0 },
    bathrooms: { type: Number, default: 0, min: 0 },
    sizeSqm: { type: Number, required: true, min: 1 },
    description: { type: String, required: true, trim: true },
    amenities: [{ type: String, trim: true }],
    images: [{ type: String, trim: true }],
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["available", "reserved", "sold"], default: "available" }
  },
  { timestamps: true }
);

propertySchema.index({ city: 1, type: 1, purpose: 1, price: 1 });

export default mongoose.model("Property", propertySchema);
