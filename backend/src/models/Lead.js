import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

const followUpSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    note: { type: String, trim: true, maxlength: 1000, default: "" },
    status: {
      type: String,
      enum: ["scheduled", "completed", "missed", "cancelled"],
      default: "scheduled"
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

const leadSchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", default: null },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    message: { type: String, trim: true, maxlength: 1500 },
    source: { type: String, default: "website" },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "viewing", "negotiation", "won", "lost"],
      default: "new"
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    notes: [noteSchema],
    followUps: [followUpSchema]
  },
  { timestamps: true }
);

leadSchema.index({ assignedTo: 1, status: 1, createdAt: -1 });

export default mongoose.model("Lead", leadSchema);
