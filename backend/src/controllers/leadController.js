import Lead from "../models/Lead.js";
import Property from "../models/Property.js";
import User from "../models/User.js";

const populateOptions = [
  { path: "property", select: "title city area price" },
  { path: "assignedTo", select: "name email phone active" },
  { path: "notes.createdBy", select: "name role" },
  { path: "followUps.createdBy", select: "name role" }
];

function canManageLead(user, lead) {
  if (user.role === "admin") return true;

  const assignedId = lead.assignedTo?._id || lead.assignedTo;
  return assignedId && String(assignedId) === String(user._id);
}

export async function createLead(req, res) {
  const { property, name, phone, email, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: "Name and phone are required" });
  }

  if (property && !(await Property.exists({ _id: property }))) {
    return res.status(400).json({ message: "Invalid property" });
  }

  const lead = await Lead.create({
    property: property || null,
    name,
    phone,
    email,
    message
  });

  res.status(201).json({
    lead,
    message: "Inquiry received successfully"
  });
}

export async function getLeads(req, res) {
  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.user.role === "agent") {
    filter.assignedTo = req.user._id;
  } else if (req.query.agent) {
    filter.assignedTo = req.query.agent === "unassigned"
      ? null
      : req.query.agent;
  }

  const items = await Lead.find(filter)
    .populate(populateOptions)
    .sort({ createdAt: -1 });

  res.json({ items });
}

export async function assignLead(req, res) {
  const { agentId } = req.body;

  if (agentId) {
    const agent = await User.findOne({
      _id: agentId,
      role: "agent",
      active: true
    });

    if (!agent) {
      return res.status(400).json({ message: "Invalid or inactive sales agent" });
    }
  }

  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { assignedTo: agentId || null },
    { new: true }
  ).populate(populateOptions);

  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  res.json({ lead });
}

export async function updateLeadStatus(req, res) {
  const allowed = [
    "new",
    "contacted",
    "qualified",
    "viewing",
    "negotiation",
    "won",
    "lost"
  ];

  if (!allowed.includes(req.body.status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const lead = await Lead.findById(req.params.id).populate(populateOptions);

  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  if (!canManageLead(req.user, lead)) {
    return res.status(403).json({ message: "This lead is not assigned to you" });
  }

  lead.status = req.body.status;
  await lead.save();
  await lead.populate(populateOptions);

  res.json({ lead });
}

export async function addLeadNote(req, res) {
  const text = String(req.body.text || "").trim();

  if (!text) {
    return res.status(400).json({ message: "Note cannot be empty" });
  }

  const lead = await Lead.findById(req.params.id).populate(populateOptions);

  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  if (!canManageLead(req.user, lead)) {
    return res.status(403).json({ message: "This lead is not assigned to you" });
  }

  lead.notes.push({
    text,
    createdBy: req.user._id
  });

  await lead.save();
  await lead.populate(populateOptions);

  res.json({ lead });
}

export async function addFollowUp(req, res) {
  const parsedDate = new Date(req.body.date);

  if (!req.body.date || Number.isNaN(parsedDate.getTime())) {
    return res.status(400).json({ message: "A valid follow-up date is required" });
  }

  const lead = await Lead.findById(req.params.id).populate(populateOptions);

  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  if (!canManageLead(req.user, lead)) {
    return res.status(403).json({ message: "This lead is not assigned to you" });
  }

  lead.followUps.push({
    date: parsedDate,
    note: String(req.body.note || "").trim(),
    createdBy: req.user._id
  });

  await lead.save();
  await lead.populate(populateOptions);

  res.json({ lead });
}

export async function updateFollowUpStatus(req, res) {
  const allowed = ["scheduled", "completed", "missed", "cancelled"];

  if (!allowed.includes(req.body.status)) {
    return res.status(400).json({ message: "Invalid follow-up status" });
  }

  const lead = await Lead.findById(req.params.id).populate(populateOptions);

  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  if (!canManageLead(req.user, lead)) {
    return res.status(403).json({ message: "This lead is not assigned to you" });
  }

  const followUp = lead.followUps.id(req.params.followUpId);

  if (!followUp) {
    return res.status(404).json({ message: "Follow-up not found" });
  }

  followUp.status = req.body.status;

  await lead.save();
  await lead.populate(populateOptions);

  res.json({ lead });
}
