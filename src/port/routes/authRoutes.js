
import express from 'express';
import { register, login } from '../../controller/authcontroller.js';
import {registervalidate,loginvalidate} from '../middleware/validation.js'

const router = express.Router();

router.post('/register',registervalidate, register);
router.post('/login', loginvalidate,login);

export default router;