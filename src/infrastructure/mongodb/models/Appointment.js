import mongoose from "mongoose";

const SchemaAppoinment =new mongoose.Schema({
    patientID:{
        type:mongoose.Schema.Types.ObjectId,ref:"Patient", required:true },
        date:{
            type:Date, required: true},
            slot:{
                type:String, required:true
            },
           appoinmentstatus:{
                type:String, defafult: "Booked",
                emun:["Booked","Cancelled","Completed"]
            }

    });

    const Appointment =mongoose.model("Appoinment",SchemaAppoinment);
    
    export default Appointment;