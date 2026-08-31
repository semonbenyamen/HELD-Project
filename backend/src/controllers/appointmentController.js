import Appointment from "../models/Appointment.js";
import Property from "../models/Property.js";

export async function createAppointment(req, res) {
  const { property, name, phone, email, preferredDate, note } = req.body;

  if (!property || !name || !phone || !preferredDate) {
    return res.status(400).json({
      message: "Property, name, phone and preferred date are required"
    });
  }

  if (!(await Property.exists({ _id: property }))) {
    return res.status(400).json({ message: "Invalid property" });
  }

  const date = new Date(preferredDate);

  if (Number.isNaN(date.getTime()) || date < new Date()) {
    return res.status(400).json({ message: "Please choose a future date" });
  }

  const item = await Appointment.create({
    property,
    name,
    phone,
    email,
    preferredDate: date,
    note
  });

  res.status(201).json({
    item,
    message: "Viewing request received"
  });
}

export async function getAppointments(req, res) {
  const items = await Appointment.find()
    .populate("property", "title city area")
    .sort({ preferredDate: 1 });

  res.json({ items });
}

export async function updateAppointmentStatus(req, res) {
  const allowed = ["pending", "confirmed", "completed", "cancelled"];

  if (!allowed.includes(req.body.status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const item = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  ).populate("property", "title");

  if (!item) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  res.json({ item });
}
