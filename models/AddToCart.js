const mongoose = require('mongoose');

const addtocartSchema = new mongoose.Schema(
    {
        productId: {
            ref: "Product",
            type: String
        },
        quntity: { type: Number },
        userId: { type: String },
        date: {
            type: Date,
            default: Date.now
        },
    });

const AddToCart = mongoose.model('AddToCart', addtocartSchema);

module.exports = AddToCart;
