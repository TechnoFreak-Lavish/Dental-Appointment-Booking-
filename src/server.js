import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './infrastructure/db.js';
import authRoutes from './port/routes/authRoutes.js';
import appoinmentroutes from './port/routes/appointRoutes.js'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);

app.use("/api/appointments", appoinmentroutes);

const PORT = process.env.PORT ;
connectDB();
app.listen(PORT, () => 
    console.log(`Server running on port  ${PORT} `));
