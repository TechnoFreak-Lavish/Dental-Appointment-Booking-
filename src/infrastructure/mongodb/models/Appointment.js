import mongoose from "mongoose";

const SchemaAppoinment = new mongoose.Schema({
    patientID: {
        type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true
    },
    Patientname: { type: String, required: true },
    Patientemail: { type: String, required: true },
    Patientphone: { type: String, required: true },
    reason: { type: String, required: false },
    date: {
        type: Date, required: true
    },
    slot: {
        type: String, required: true
    },
    appoinmentstatus: {
        type: String, defafult: "Booked",
        emun: ["Booked", "Cancelled", "Completed"]
    }

});

const Appointment = mongoose.model("Appoinment", SchemaAppoinment);

export default Appointment;