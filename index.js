const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const multer = require("multer");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser');
const userRouter = require("./routes/UserRoute");
const adminRouter = require("./routes/AdminRoute");
const app = express();
const path = require("path");
const fs = require('fs');
// Middleware
app.use(bodyParser.json());
dotenv.config();
app.use(cookieParser());
app.use(cors({
    origin: process.env.FrontEnd_URI,
    credentials: true
}

))
app.use(express.json());
const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
    console.log("server is start");
})
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Mongoo dataBase Is connect");
}).catch((error) => {
    console.log("Mongoo dataBase Interna lError");
})
app.get("/", (req, res) => {
    res.send("this is home page")

})
app.use("/user", userRouter);
app.use("/admin", adminRouter)

app.use('/uploads', express.static('uploads'));

