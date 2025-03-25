

const express = require('express');
const { register, login } = require('../../controller/authcontroller');
const {
  registervalidate,
  loginvalidate,
} = require('../middleware/validation');

const router = express.Router();

router.post('/register', registervalidate, register);
router.post('/login', loginvalidate, login);

module.exports = router;
