const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    brandName: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    selling: { type: Number, required: true },
    productImg: [{ type: String, required: true }],
    user: { type: mongoose.Schema.ObjectId, ref: 'User' }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
