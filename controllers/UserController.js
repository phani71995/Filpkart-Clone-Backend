const User = require("../models/User.js");
const VarifyToken = require("../middleWare/varifyToken.js")
const express = require("express");
const bcrypt = require("bcrypt");


const dotenv = require("dotenv");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require('body-parser');
const jwttoken = require("jsonwebtoken")
const app = express();
const cookieParser = require('cookie-parser');
const { request } = require("http");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
app.use(cors())
app.use(express.json());
const secratekey = process.env.mycode
const path = require("path");

app.use(bodyParser.urlencoded({ extended: true }));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    }
});




const UserSinUp = async (req, res) => {

    console.log(storage.filename)
    const { userName, email, password, imgname } = req.body;
    const kk = req.file ? req.file.filename : null;


    try {

        const datauser = await User.findOne({ email });
        if (datauser) {
            return res.status(400).json(" email already taken Enter onther Emailid");

        }

        const saltRounds = 10;



        const bcryptpassword = await bcrypt.hash(password, saltRounds);


        const newUser = new User({
            userName,
            email,
            password: bcryptpassword,
            profilePic: kk,
            role: "GENERAL"

        })
        await newUser.save();
        res.status(200).json(
            {
                message: "User register successfully",
                success: true,
                error: false,


            })
        console.log("registerd")

    }
    catch (error) {
        res.status(500).json({ error: "internal server error" })
        console.error(error)


    }
}


//UserSinIn
const UserSinIn = async (req, res) => {
    const { email, password } = req.body;

    try {

        const dataUser = await User.findOne({ email });


        if (!dataUser || !(await bcrypt.compare(password, dataUser.password))) {

            return res.status(400).json("Invalid Emailid & password ");

        }



        const JToken = jwttoken.sign({ UserId: dataUser._id }, secratekey, { expiresIn: "1h" })

        res.cookie("token", JToken, {
            httpOnly: true,
            secure: true, 
            sameSite: 'None'// Set to true if using HTTPS

        }).status(200).json({
            message: "User login successful",
            success: true,
            loginData: dataUser,
            token: JToken
        });


    }
    catch (error) {
        res.status(500).json({ error: "internal server error" })
        console.error(error)


    }
}

//UserDetails
const UserDetails = async (req, res) => {
    console.log("userdetail", req.userId)
    const userId = req.userId

    try {

        const dataUser = await User.findOne(userId);
        console.log("userdetail", dataUser)

        if (!dataUser) {

            return res.status(400).json("UserDetails not found");

        }

        return res.status(200).json({
            message: "UserDetails add successfully ",
            success: true,
            userData: dataUser
        });


    }
    catch (error) {
        res.status(500).json({ error: "internal server error" })
        console.error(error)


    }
}



// UserSignOut
const UserSignOut = async (req, res) => {


    try {
        res.clearCookie('token');


        return res.status(200).json({
            message: "UserSignOut successfully ",
            success: true

        });


    }
    catch (error) {
        res.status(500).json({ error: "internal server error" })
        console.error(error)


    }
}
//getAllUsers
const getAllUsers = async (req, res) => {
    console.log("userdetail", req.userId)
    const userId = req.userId

    try {

        const getAllUsers = await User.find();
        console.log("getAllUsers", getAllUsers)

        if (!getAllUsers) {

            return res.status(400).json("getAllUsers not found");

        }

        return res.status(200).json({
            message: "getAllUsers successfully ",
            success: true,
            userData: getAllUsers
        });


    }
    catch (error) {
        res.status(500).json({ error: "internal server error" })
        console.error(error)


    }
}


//UpdateUsers
const UpdateUsers = async (req, res) => {
    console.log("userdetail", req.userId)
    const userId = req.userId
    console.log("updateuser", req.body)
    const { _id, date, email, password, profilePic, role, userName } = req.body

    try {

        const updateUser = await User.findByIdAndUpdate(_id, { email, role, userName });
        console.log("getAllUsers", getAllUsers)

        if (!getAllUsers) {

            return res.status(400).json("getAllUsers not found");

        }

        return res.status(200).json({
            message: "getAllUsers successfully ",
            success: true,
            userData: updateUser
        });


    }
    catch (error) {
        res.status(500).json({ error: "internal server error" })
        console.error(error)


    }
}


module.exports = { UserSinUp, UserSinIn, UserDetails, UserSignOut, getAllUsers, UpdateUsers }



