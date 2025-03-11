import mongoose from "mongoose";

const SchemaPatient = new mongoose.Schema({
    name: {
        type: String, required: true
    },
    email: {
        type: String, required: true
    },
    phone: {
        type: String, required: true
    },
    password: {
        type: String, required: true
    },
},
    {
        timestamps: true

    }
);

const Patient = mongoose.model('Patient', SchemaPatient);
export default Patient;