const Appointment = require('../infrastructure/mongodb/models/Appointment');

const book = async (req, res) => {
  const { date, slot, name, email, phone, clinic, reason } = req.body;
  const patientID = req.user?.id;

  if (!date || !slot || !name || !email || !phone || !clinic) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const appointmentExists = await Appointment.findOne({ date, slot });
  if (appointmentExists) {
    return res.status(400).json({ message: "This time slot is already booked!" });
  }

  const newAppointment = new Appointment({
    patientID,
    date,
    slot,
    name,
    email,
    phone,
    clinic,
    reason,
  });

  await newAppointment.save();

  return res.status(201).json({
    message: "Appointment booked successfully",
    appointment: newAppointment,
  });
};

const getMyAppointments = async (req, res) => {
  try {
    const patientID = req.user.id;
    const appointments = await Appointment.find({ patientID });
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching appointments',
      error: err.message,
    });
  }
};



module.exports = { book, getMyAppointments };
