const User = require('../models/User');
const jwtToken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();
const dotenv = require("dotenv");
dotenv.config();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const secratekey = process.env.mycode
const path = require("path");


const verifyToken = async (req, res, next) => {


    try {
        const token = req.cookies?.token;

        console.log("verifyToken", token); // For debugging

        if (!token) {
            return res.status(404).json({ error: 'No token found' });
        }
        console.log("secratekey", secratekey)
        const decodedToken = jwtToken.verify(token, secratekey);
        console.log("decodedToken", decodedToken)


        const user = await User.findById(decodedToken.UserId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }


        console.log("token geting user", user._id)
        req.userId = user._id;

        next();
    } catch (error) {
        return res.status(500).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;
