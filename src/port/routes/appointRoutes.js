import express from  'express';
import Appointment from "../../infrastructure/mongodb/models/Appointment.js";
import authMiddleware from "../middleware/authentication.js";

const router = express.Router();

router.get("/slotsavailable/:date", async (req, res) => {
    try {
        const { date } = req.params;
        const availableSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:45 PM", "1:15 PM", "2:00 PM", "2:45 PM"];
        const bookedAppointments = await Appointment.find({ date }).select("slot");
        const bookedSlots = bookedAppointments.map(appt => appt.slot);
        const freeSlots = availableSlots.filter(slot => !bookedSlots.includes(slot));
        res.json({ availableSlots: freeSlots });
    } catch (err) {
        res.status(500).json({ message: "Error fetching slots", error: err.message });
    }
});

router.post("/book", authMiddleware, async (req, res) => {
    try {
        const { date, slot,name, email, phone, reason } = req.body;
        const patientID = req.user.id;

        if (!date || !slot) {
            return res.status(400).json({ message: "Date and slot are required!" });
        }

        const appointmentExists = await Appointment.findOne({ date, slot });
        if (appointmentExists) {
            return res.status(400).json({ message: "This time slot is already booked!" });
        }

        const newAppointment = new Appointment({ patientID, date, slot,name, email, phone, reason });
        await newAppointment.save();

        res.status(201).json({ message: "Appointment booked successfully", appointment: newAppointment });
    } catch (err) {
        res.status(500).json({ message: "Error booking appointment", error: err.message });
    }
});


router.get("/my-appointments", authMiddleware, async (req, res) => {
    try {
        const patientID = req.user.id;
        const appointments = await Appointment.find({ patientID });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: "Error fetching appointments", error: err.message });
    }
});

export default router;
