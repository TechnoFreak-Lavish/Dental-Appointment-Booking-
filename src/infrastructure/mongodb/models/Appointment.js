const mongoose = require("mongoose");

const SchemaAppoinment = new mongoose.Schema({
  patientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  reason: { type: String },
  date: {
    type: Date,
    required: true,
  },
  slot: {
    type: String,
    required: true,
  },
  appoinmentstatus: {
    type: String,
    default: "Booked", // ✅ Fixed typo
    enum: ["Booked", "Cancelled", "Completed"], // ✅ Fixed typo
  },
  clinic: {
    type: String,
  },
});

const Appointment = mongoose.model("Appointment", SchemaAppoinment);

module.exports = Appointment;
