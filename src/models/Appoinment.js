import mongoose from "mongoose";



const SchemaAppoinment =new mongoose.Schema({
    patientID:{
        type:mongoose.Schema.Types.ObjectId,ref:"Patient", required:true },
        date:{
            type:String, required: true},
            Slot:{
                type:String, required:true
            },
           appoinmentstatus:{
                type:String, defafult: "Booked"
            }

    });

    const Appoinment =mongoose.model("Appoinment",SchemaAppoinment);
    
    
    export default Appoinment;