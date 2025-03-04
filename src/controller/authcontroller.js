import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Patient from '../models/Patient.js';

dotenv.config();


export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const patient = await Patient.findOne({ email });
        if (!patient) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Password' });
        }

        const token = jwt.sign({ patientId: patient._id },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            });

        res.status(200).json({ token, user: patient });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};
export const register = async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        const registerduser = await Patient.findOne({
            email
        });
        if (registerduser) {
            return res.status(400).json({ msg: 'Exist Account' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Patient({ name, email, phone, password: hashedPassword })
        await newUser.save();

        const token = jwt.sign({
            patientId: newUser._id
        },
            process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        res.status(201).json({ token, user: newUser });
    } catch (error) {

        res.status(500).json({ msg: 'error' });
    }
};


