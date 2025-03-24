const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./infrastructure/db');
const authRoutes = require('./port/routes/authRoutes');
const appointmentRoutes = require('./port/routes/appointRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
