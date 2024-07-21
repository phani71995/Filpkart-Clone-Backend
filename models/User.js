const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");


//

const UserSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String
    },
    role: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
})
module.exports = mongoose.model("User", UserSchema);