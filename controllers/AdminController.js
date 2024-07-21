const User = require("../models/User.js");
const Product = require("../models/Product.js");
const AddToCart = require("../models/AddToCart.js")
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




const AddProduct = async (req, res) => {

    const user = req.userId;
    // console.log("add product", user)
    const { productName, brandName, category, description, price, selling } = req.body;
    //console.log("product", productName)
    const productImg = req?.files.map((file) => {
        return (file.filename)
    });

    try {
        // Create a new product instance
        const newProduct = new Product({
            productName,
            brandName,
            category,
            description,
            price,
            selling,
            productImg,
            user
        });



        const dataUser = await User.findOne(user);
        // Save the product to the database
        const savedProduct = await newProduct.save();
        if (!dataUser) {
            // Handle case where user is not found
            console.error('User not found');
            return; // Or throw an error, redirect, etc.
        }

        dataUser.products.push(savedProduct._id);
        await dataUser.save();
        res.status(201).json({ success: true, message: 'Product added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



const GetAllProduct = async (req, res) => {

    const user = req.userId;


    try {

        const dataUser = await User.findOne(user).populate("products");


        if (!dataUser) {
            // Handle case where user is not found
            console.error('User not found');
            return; // Or throw an error, redirect, etc.
        }
        //onther way
        // const productsPromises = dataUser.products.map(item => Product.findOne({ _id: item._id }));
        // const fproducts = await Promise.all(productsPromises);

        // console.log(fproducts);
        res.status(201).json({ success: true, message: 'Product added successfully', data: dataUser.products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};




const ChangeProduct = async (req, res) => {

    const user = req.userId;
    //console.log("add product", user)
    const { productId, productName, brandName, category, description, price, selling } = req.body;
    //console.log("product", productId)


    try {
        // Create a new product instance
        const updatedProduct = {
            productName,
            brandName,
            category,
            description,
            price,
            selling,

            user
        };
        if (req.files && req.files.length > 0) {
            updatedProduct.productImg = req?.files.map((file) => {
                return (file.filename)
            });
        }
        const productdata = await Product.findByIdAndUpdate(productId, { $set: updatedProduct }, { new: true })


        if (!productdata) {
            // Handle case where user is not found
            console.error('User not found');
            return; // Or throw an error, redirect, etc.
        }


        res.status(201).json({ success: true, message: 'Product added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const DeleteProduct = async (req, res) => {
    const user_id = req.userId;
    //console.log("add product", user_id)
    const { productId } = req.body;
    //console.log("product", productId)
    try {
        const productdata = await Product.findByIdAndDelete(productId);
        // console.log("productdata", productdata)
        if (!productdata) {
            // Handle case where user is not found
            console.error('User not found');
            return; // Or throw an error, redirect, etc.
        }
        /*
        // Remove the productId from the users' products array
            await User.updateMany(
        { products: productId }, 
        {  $pull: { products: productId } }
        );
        */

        // onther way Remove the productId from the users' products array
        const userdata = await User.findByIdAndUpdate(
            user_id,
            { $pull: { products: productId } },
            { new: true }
        );

        if (!userdata) {
            //  console.log('User not found or product reference not updated');
        } else {
            // console.log('Product deleted and references removed successfully');
        }
        res.status(201).json({ success: true, message: 'Product added successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

}
//Home page
const ProductGetByCategory = async (req, res) => {

    const { category } = req.body;
    console.error('ProductGetByCategory', category);

    try {

        const dataUser = await Product.find({ category })


        if (!dataUser) {
            // Handle case where user is not found
            console.error('User not found');
            return; // Or throw an error, redirect, etc.
        }


        res.status(201).json({ success: true, message: 'Product added successfully', data: dataUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const FeatchByProductId = async (req, res) => {
    //console.log('req.body', req.body);
    const { productId } = req.body;
    //console.log('ProductGetByCategory', productId);

    try {

        const dataUser = await Product.findOne({ _id: productId })


        if (!dataUser) {
            // Handle case where user is not found
            console.error('User not found');
            return; // Or throw an error, redirect, etc.
        }


        res.status(201).json({ success: true, message: 'Product added successfully', data: dataUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//AddToCart
const Addtocart = async (req, res) => {
    const user_id = req.userId;
    //console.log("add product", user_id)
    const { productId } = req.body;
    // console.log("product", productId);
    try {
        const newItem = new AddToCart(
            {
                productId: productId,
                quntity: 1,
                userId: user_id

            })
        const ProductExit = await AddToCart.findOne({ productId });
        if (ProductExit) {
            res.status(404).json({
                error: true,
                success: false,
                message: "product is alredy add to cart"
            })

        }
        else {
            const savedItem = await newItem.save()
            res.status(200).json({
                success: true,
                error: false,
                message: "product add to cart scuccafully"
            })
        }


    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

}

//NumberProductInCart 
const NumberProductInCart = async (req, res) => {
    const user_id = req.userId;
    //console.log("add product", user_id)

    try {
        const userBasedCount = await AddToCart.countDocuments({ userId: user_id })
        if (!userBasedCount) {
            res.status(404).json({
                error: true,
                success: false,
                message: "No product in cart"
            })

        }
        else {

            res.status(200).json({
                data: userBasedCount,
                success: true,
                error: false,
                message: "product add to cart scuccafully"
            })
        }


    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

}




//product summarry cart
const ProductSummaryCart = async (req, res) => {
    const user_id = req.userId;


    try {
        const productIdaseGetProduct = await AddToCart.find({ userId: user_id }).populate("productId");
        // console.log("ProductSummaryCart", productIdaseGetProduct)
        if (!productIdaseGetProduct) {
            res.status(404).json({
                error: true,
                success: false,
                message: "No product in cart"
            })

        }
        else {

            res.status(200).json({
                data: productIdaseGetProduct,
                success: true,
                error: false,
                message: "get All product add to cart scuccafully"
            })
        }


    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

}
//product summarry quantity update
const ProductQuantityUpdate = async (req, res) => {
    //console.log(req.body);
    const user_id = req.userId;
    const { _id, qty } = req.body;
    // console.log("cart id", _id)

    try {
        const updatedProduct = await AddToCart.updateOne(
            { _id: _id },
            {
                ...(qty && { quntity: qty })
            },

        );
        //  console.log("updatedProduct", updatedProduct)
        if (!updatedProduct) {
            res.status(404).json({
                error: true,
                success: false,
                message: "product"
            })

        }
        else {

            res.status(200).json({
                data: updatedProduct,
                success: true,
                error: false,
                message: "get All product add to cart scuccafully"
            })
        }


    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

}
//product summarry removed
const ProductRemoved = async (req, res) => {
    //console.log(req.body);
    const user_id = req.userId;
    const { _id, } = req.body;
    //console.log("cart id", _id)

    try {
        const updatedProduct = await AddToCart.deleteOne({ _id: _id }
        );
        //console.log("updatedProduct", updatedProduct)
        if (!updatedProduct) {
            res.status(404).json({
                error: true,
                success: false,
                message: "product"
            })

        }
        else {

            res.status(200).json({
                data: updatedProduct,
                success: true,
                error: false,
                message: "get All product add to cart scuccafully"
            })
        }


    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

}
//search bar result


const SearchBarResult = async (req, res) => {

    const query = req.query.q;

    console.log("query", query);
    const redex = new RegExp(query, "i");

    try {
        const searchProduct = await Product.find({ category: redex });
        console.log("searchProduct", searchProduct)
        if (searchProduct.length === 0) {
            res.status(404).json({
                error: true,
                success: false,
                message: "No products found"
            });
        } else {
            res.status(200).json({
                data: searchProduct,
                success: true,
                error: false,
                message: "Products retrieved successfully"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//filltering
const Filltering = async (req, res) => {

    const categoryList = req?.body?.category || [];
    try {
        const filterProduct = await Product.find({ category: { "$in": categoryList } });
        console.log("filterProduct", filterProduct)
        if (!filterProduct) {
            res.status(404).json({
                error: true,
                success: false,
                message: "No products found"
            });
        } else {
            res.status(200).json({
                data: filterProduct,
                success: true,
                error: false,
                message: "Products retrieved successfully"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};




module.exports = { AddProduct, GetAllProduct, ChangeProduct, DeleteProduct, ProductGetByCategory, FeatchByProductId, Addtocart, NumberProductInCart, ProductSummaryCart, ProductQuantityUpdate, ProductRemoved, SearchBarResult, Filltering };