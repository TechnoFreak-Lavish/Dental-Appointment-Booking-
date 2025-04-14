const dotenv = require('dotenv-safe');
const { mongo } = require('mongoose');

dotenv.config({
    allowEmptyValues: false,
    path: `.env.${process.env.NODE_ENV}`
});

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const ENVIRONMENT = (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : "development";
const JWT_SECRET = process.env.JWT_SECRET;
const config = {
    mongo: {
      url: MONGO_URL,
    },
    jwt: {
      secret: JWT_SECRET,
    },
    port: PORT || 5000,
    environment:ENVIRONMENT,
  };
  
  module.exports = config;
