import mongoose from "mongoose";

const SchemaAppoinment = new mongoose.Schema({
  patientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  reason: { type: String, required: false },
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
    defafult: "Booked",
    emun: ["Booked", "Cancelled", "Completed"],
  },
  clinic: {
    type: String,
  },
});

const Appointment = mongoose.model("Appoinment", SchemaAppoinment);

export default Appointment;
