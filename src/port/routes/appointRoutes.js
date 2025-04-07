const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authentication");
const appointmentController = require("../../controller/appointmentcontroller");

router.get("/slotsavailable/:date", appointmentController.getAvailableSlots);
router.get("/patientprofile", authMiddleware, appointmentController.getPatientProfile);
router.post("/book", authMiddleware, appointmentController.bookAppointment);
router.get("/my-appointments", authMiddleware, appointmentController.getMyAppointments);
router.put("/appointments/:id", authMiddleware, appointmentController.updateAppointment);
router.delete("/:id", authMiddleware, appointmentController.deleteAppointment);

module.exports = router;