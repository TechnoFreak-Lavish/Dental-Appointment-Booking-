const Appointment = require("../infrastructure/mongodb/models/Appointment");
const Patient = require("../infrastructure/mongodb/models/Patient");
const { sendStyledAppointmentEmail, sendStyledRescheduleEmail, sendStyledCancellationEmail } = require("../utils/mailnoti");

const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.params;
    const availableSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:45 PM", "1:15 PM", "2:00 PM", "2:45 PM"];
    const bookedAppointments = await Appointment.find({ date }).select("slot");
    const bookedSlots = bookedAppointments.map((appt) => appt.slot);
    const freeSlots = availableSlots.filter((slot) => !bookedSlots.includes(slot));
    res.json({ availableSlots: freeSlots });
  } catch (err) {
    res.status(500).json({ message: "Error fetching slots", error: err.message });
  }
};

const getPatientProfile = async (req, res) => {
  try {
    const patientID = req.user.id;
    const patient = await Patient.findById(patientID).select("name email phone");
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patient profile", error: error.message });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { date, slot, name, email, phone, clinic, reason } = req.body;
    const patientID = req.user?.id;

    if (!date || !slot || !name || !email || !phone || !clinic) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const appointmentExists = await Appointment.findOne({ date, slot });
    if (appointmentExists) {
      return res.status(400).json({ message: "This slot time is already booked!" });
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
    await sendStyledAppointmentEmail({ name, email, date, slot, clinic, reason });

    res.status(201).json({ message: "Appointment booked and confirmation email sent", appointment: newAppointment });
  } catch (err) {
    res.status(500).json({ message: "Error booking appointment", error: err.message });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const patientID = req.user.id;
    const appointments = await Appointment.find({ patientID });
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching appointments", error: err.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { date, slot } = req.body;
    const { id } = req.params;
    const patientID = req.user.id;

    if (!date || !slot) {
      return res.status(400).json({ message: "Date and slot are required" });
    }

    const isSlotTaken = await Appointment.findOne({ date, slot, _id: { $ne: id } });
    if (isSlotTaken) {
      return res.status(400).json({ message: "This slot is already taken." });
    }

    const updated = await Appointment.findOneAndUpdate(
      { _id: id, patientID },
      { date, slot },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found or not yours" });
    }

    await sendStyledRescheduleEmail({ name: updated.name, email: updated.email, date, slot, clinic: updated.clinic });

    res.status(200).json({ message: "Appointment rescheduled", appointment: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating appointment", error: err.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const existingAppointment = await Appointment.findById(appointmentId);
    if (!existingAppointment) return res.status(404).json({ message: "Appointment not found" });

    if (existingAppointment.patientID.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "You are not allowed to delete this appointment." });
    }

    await Appointment.deleteOne({ _id: appointmentId });

    await sendStyledCancellationEmail({
      name: existingAppointment.name,
      email: existingAppointment.email,
      date: existingAppointment.date,
      slot: existingAppointment.slot,
      clinic: existingAppointment.clinic
    });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: "Error deleting appointment", error: err.message });
  }
};

module.exports = {
  getAvailableSlots,
  getPatientProfile,
  bookAppointment,
  getMyAppointments,
  updateAppointment,
  deleteAppointment,
};