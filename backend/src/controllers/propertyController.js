import Property from "../models/Property.js";
import { slugify } from "../utils/slugify.js";

export async function getProperties(req, res) {
  const {
    city,
    type,
    purpose,
    minPrice,
    maxPrice,
    bedrooms,
    status = "available",
    search,
    page = 1,
    limit = 12
  } = req.query;

  const filter = {};

  if (city) filter.city = new RegExp(city, "i");
  if (type) filter.type = type;
  if (purpose) filter.purpose = purpose;
  if (status) filter.status = status;
  if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (search) {
    filter.$or = [
      { title: new RegExp(search, "i") },
      { city: new RegExp(search, "i") },
      { area: new RegExp(search, "i") }
    ];
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));

  const [items, total] = await Promise.all([
    Property.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Property.countDocuments(filter)
  ]);

  res.json({
    items,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum
    }
  });
}

export async function getFeaturedProperties(req, res) {
  const items = await Property.find({ featured: true, status: "available" })
    .sort({ createdAt: -1 })
    .limit(6);

  res.json({ items });
}

export async function getPropertyByIdOrSlug(req, res) {
  const idOrSlug = req.params.id;
  const query = /^[0-9a-fA-F]{24}$/.test(idOrSlug)
    ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] }
    : { slug: idOrSlug };

  const item = await Property.findOne(query);

  if (!item) {
    return res.status(404).json({ message: "Property not found" });
  }

  res.json({ item });
}

export async function createProperty(req, res) {
  const required = ["title", "type", "city", "area", "price", "sizeSqm", "description"];
  const missing = required.filter(key => req.body[key] === undefined || req.body[key] === "");

  if (missing.length) {
    return res.status(400).json({
      message: `Missing fields: ${missing.join(", ")}`
    });
  }

  let slug = slugify(req.body.title);

  if (await Property.findOne({ slug })) {
    slug = `${slug}-${Date.now().toString().slice(-5)}`;
  }

  const item = await Property.create({
    ...req.body,
    slug,
    amenities: Array.isArray(req.body.amenities) ? req.body.amenities : [],
    images: Array.isArray(req.body.images) ? req.body.images : []
  });

  res.status(201).json({ item });
}

export async function updateProperty(req, res) {
  const item = await Property.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: "Property not found" });
  }

  const oldTitle = item.title;
  Object.assign(item, req.body);

  if (req.body.title && req.body.title !== oldTitle) {
    let nextSlug = slugify(req.body.title);

    const duplicate = await Property.findOne({
      slug: nextSlug,
      _id: { $ne: item._id }
    });

    if (duplicate) {
      nextSlug = `${nextSlug}-${Date.now().toString().slice(-5)}`;
    }

    item.slug = nextSlug;
  }

  await item.save();
  res.json({ item });
}

export async function deleteProperty(req, res) {
  const item = await Property.findByIdAndDelete(req.params.id);

  if (!item) {
    return res.status(404).json({ message: "Property not found" });
  }

  res.json({ message: "Property deleted" });
}
