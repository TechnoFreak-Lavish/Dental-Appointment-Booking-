import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './infrastructure/mongodb/db.js';
import authRoutes from './port/routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);



const PORT = process.env.PORT ;
connectDB();
app.listen(PORT, () => 
    console.log(`Server running on port  ${PORT} `));
