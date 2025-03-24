const express = require("express");
const Appointment = require("../../infrastructure/mongodb/models/Appointment");
const authMiddleware = require("../middleware/authentication");
const Patient = require("../../infrastructure/mongodb/models/Patient");

const router = express.Router();

router.get("/slotsavailable/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const availableSlots = [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:45 PM",
      "1:15 PM",
      "2:00 PM",
      "2:45 PM",
    ];
    const bookedAppointments = await Appointment.find({ date }).select("slot");
    const bookedSlots = bookedAppointments.map((appt) => appt.slot);
    const freeSlots = availableSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );
    res.json({ availableSlots: freeSlots });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching slots", error: err.message });
  }
});

router.get("/patientprofile", authMiddleware, async (req, res) => {
  try {
    const patientID = req.user.id;

    const patient = await Patient.findById(patientID).select(
      "name email phone"
    );
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch patient profile",
      error: error.message,
    });
  }
});

router.post("/book", authMiddleware, async (req, res) => {
  try {
    const { date, slot, name, email, phone, clinic, reason } = req.body;
    const patientID = req.user?.id;

    
    console.log({ patientID, date, slot, name, email, phone, clinic, reason });

    if (!date || !slot || !name || !email || !phone || !clinic) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const appointmentExists = await Appointment.findOne({ date, slot });
    if (appointmentExists) {
      return res
        .status(400)
        .json({ message: "This slot time is already booked!" });
    }

    const newAppointment = new Appointment({
      patientID,
      date,
      slot,
      name,
      email,
      phone,
      clinic,
      reason: reason || `Appointment at ${clinic}`,
    });

    await newAppointment.save();

    console.log("Appointment saved:", newAppointment);
    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (err) {
    console.error("Error booking appointment:", err);
    res
      .status(500)
      .json({ message: "Error booking appointment", error: err.message });
  }
});

router.get("/my-appointments", authMiddleware, async (req, res) => {
  try {
    const patientID = req.user.id;
    const appointments = await Appointment.find({ patientID });
    res.json(appointments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: err.message });
  }
});

module.exports = router;
