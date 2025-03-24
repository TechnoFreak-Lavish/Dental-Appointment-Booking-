// File: src/controller/authcontroller.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Patient = require("../infrastructure/mongodb/models/Patient");

dotenv.config();

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(404).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Password" });
    }

    const token = jwt.sign(
      { patientId: patient._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, user: patient });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

const register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const existing = await Patient.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Exist Account" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Patient({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { patientId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({ msg: "error", error: error.message });
  }
};

module.exports = {
  login,
  register,
};
