const express = require("express");
const multer = require("multer");
const userController = require("../controllers/UserController");
const adminController = require("../controllers/AdminController");
const varifyToken = require("../middleWare/varifyToken");
const router = express.Router()
const path = require("path");
const fs = require('fs');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const { category } = req.body
//         //console.log("store", req.body)
//         console.log("category", category)
//         cb(null, './uploads/' + category);
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + "_" + file.originalname);
//     }
// });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { category } = req.body;
        const uploadPath = path.join('uploads', category);

        // Ensure the upload directory exists
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});



const upload = multer({ storage: storage });

router.post("/addproduct", varifyToken, upload.array('productImg', 5), adminController.AddProduct);
router.get("/getAllproduct", varifyToken, adminController.GetAllProduct);
router.post("/changeproduct", varifyToken, upload.array('productImg', 5), adminController.ChangeProduct);
router.delete("/deleteproduct", varifyToken, adminController.DeleteProduct);
//home
router.post("/productgetbycategory", adminController.ProductGetByCategory);
router.post("/featchByProductId", adminController.FeatchByProductId);
//addtocart
router.post("/addtocart", varifyToken, adminController.Addtocart);
router.get("/number-product-cart", varifyToken, adminController.NumberProductInCart);
router.get("/product-summary-cart", varifyToken, adminController.ProductSummaryCart);
router.post("/product-quantity-update", varifyToken, adminController.ProductQuantityUpdate);
router.post("/product-deleted", varifyToken, adminController.ProductRemoved);
router.get("/search?", adminController.SearchBarResult);
//fillter
router.post("/product-fillter", adminController.Filltering);
router.get("/:category/:imageName", (req, res) => {
    const imageName = req.params.imageName;
    res.headersSent('content-type', "image/jpeg");
    res.sendFile(path.join(__dirname, "..", "uploads", imageName))
})
module.exports = router