import User from "../models/User.js";

export async function getAgents(req, res) {
  const items = await User.find({ role: "agent" })
    .select("-password")
    .sort({ active: -1, name: 1 });

  res.json({ items });
}

export async function createAgent(req, res) {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required"
    });
  }

  const exists = await User.findOne({
    email: email.toLowerCase().trim()
  });

  if (exists) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const item = await User.create({
    name,
    email,
    phone: phone || "",
    password,
    role: "agent"
  });

  res.status(201).json({
    item: {
      _id: item._id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      role: item.role,
      active: item.active
    }
  });
}

export async function updateAgent(req, res) {
  const item = await User.findOne({
    _id: req.params.id,
    role: "agent"
  });

  if (!item) {
    return res.status(404).json({ message: "Agent not found" });
  }

  const { name, phone, active, password } = req.body;

  if (name !== undefined) item.name = name;
  if (phone !== undefined) item.phone = phone;
  if (active !== undefined) item.active = Boolean(active);
  if (password) item.password = password;

  await item.save();

  res.json({
    item: {
      _id: item._id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      role: item.role,
      active: item.active
    }
  });
}
