import Property from "../models/Property.js";
import Lead from "../models/Lead.js";
import Appointment from "../models/Appointment.js";

export async function getStats(req, res) {
  const leadFilter = req.user.role === "agent"
    ? { assignedTo: req.user._id }
    : {};

  const [
    properties,
    leads,
    newLeads,
    appointments,
    wonLeads
  ] = await Promise.all([
    Property.countDocuments(),
    Lead.countDocuments(leadFilter),
    Lead.countDocuments({ ...leadFilter, status: "new" }),
    req.user.role === "admin"
      ? Appointment.countDocuments({
          status: { $in: ["pending", "confirmed"] }
        })
      : Promise.resolve(0),
    Lead.countDocuments({ ...leadFilter, status: "won" })
  ]);

  const conversionRate = leads
    ? Math.round((wonLeads / leads) * 1000) / 10
    : 0;

  res.json({
    properties,
    leads,
    newLeads,
    appointments,
    wonLeads,
    conversionRate
  });
}
