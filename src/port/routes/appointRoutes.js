
const express = require("express");
const Appointment = require("../../infrastructure/mongodb/models/Appointment");
const authMiddleware = require("../middleware/authentication");
const Patient = require("../../infrastructure/mongodb/models/Patient");

const nodemailer = require("nodemailer");

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

    // Check if slot is already booked
    const appointmentExists = await Appointment.findOne({ date, slot });
    if (appointmentExists) {
      return res
        .status(400)
        .json({ message: "This slot time is already booked!" });
    }

    // Save new appointment
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

    // Send Confirmation Email
    const transporter = nodemailer.createTransport({
      service: "Gmail", // mail host which we have used 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APPPASS,
      },
    });

    const mailOptions = {
      from: `"Dental Clinic" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Appointment Confirmation",
      html: `
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color:rgb(231, 204, 124);
            padding: 20px;
            color: #333;
          }
          .email-container {
            max-width: 600px;
            margin: auto;
            background-color:rgb(255, 255, 255);
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.05);
            padding: 30px;
          }
          .email-header {
            font-size: 22px;
            color:rgb(97, 156, 215);
            margin-bottom: 20px;
          }
          .email-details {
            font-size: 16px;
            line-height: 1.6;
          }
          .email-details ul {
            list-style: none;
            padding: 0;
          }
          .email-details li {
            margin-bottom: 10px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 13px;
            color: #999;
          }
          .logo {
            margin-top: 10px;
            width: 120px;
            opacity: 0.8;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">Appointment Confirmation</div>
          <p>Hi <strong>${name}</strong>,</p>
          <div class="email-details">
            <p>Your appointment has been <strong>successfully confirmed</strong> with the following details:</p>
            <ul>
              <li><strong>Date:</strong> ${date}</li>
              <li><strong>Time:</strong> ${slot}</li>
              <li><strong>Clinic:</strong> ${clinic}</li>
              <li><strong>Reason:</strong> ${reason || "N/A"}</li>
            </ul>
            <p>We're looking forward to seeing you. If you have any questions or need to reschedule, feel free to contact us.</p>
          </div>
          <div class="footer">
            <p>Thank you for choosing Dental Care!</p>
            <img class="logo" src="https://marketplace.canva.com/EAFzZ7HIqYo/1/0/1600w/canva-blue-and-white-minimal-dental-care-logo-D-_h-rJgSAk.jpg" alt="Clinic Logo" />
            <p>&copy; ${new Date().getFullYear()} Dental Care. All rights reserved.</p>
          </div>
        </div>
      </body>
      `,
    };

    await transporter.sendMail(mailOptions);
   

    res.status(201).json({
      message: "Appointment booked and confirmation email sent",
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
// fatch the appointmnet to edit functionality 
router.put('/appointments/:id', authMiddleware, async (req, res) => {
  try {
    const { date, slot } = req.body;
    const { id } = req.params;
    const patientID = req.user.id;

    if (!date || !slot) {
      return res.status(400).json({ message: "Date and slot are required" });
    }

    // Check if the new slot is already booked by someone else
    const isSlotTaken = await Appointment.findOne({ date, slot, _id: { $ne: id } });
    if (isSlotTaken) {
      return res.status(400).json({ message: "This slot is already taken." });
    }


    // Update the appointment if it belongs to the logged-in user
    const updated = await Appointment.findOneAndUpdate(
      { _id: id, patientID },
      { date, slot },
      { new: true }
    );

    if (!updated) {
      
      return res.status(404).json({ message: "Appointment not found or not yours" });
    }

    res.status(200).json({ message: "Appointment rescheduled", appointment: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating appointment", error: err.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const existingAppointment = await Appointment.findById(appointmentId);
    if(!existingAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    // Check if the appointment belongs to the authenticated user
    if (existingAppointment.patientID.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "You are not allowed to delete this appointment." });
    }
    // Delete the appointment
    await Appointment.deleteOne({_id: appointmentId});
    res.sendStatus(204);
  } catch (err) {
    res
        .status(500)
        .json({ message: "Error deleting appointment", error: err.message });
  }
});


module.exports = router;
