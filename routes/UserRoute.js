const express = require("express");
const multer = require("multer");
const userController = require("../controllers/UserController");
const varifyToken = require("../middleWare/varifyToken");
const router = express.Router()
const path = require("path");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post("/signup", upload.single('profilePic'), userController.UserSinUp)
router.post("/singin", userController.UserSinIn);
router.post("/signout", userController.UserSignOut);
router.get("/userDetail", varifyToken, userController.UserDetails);

//admin
router.get("/getallusers", varifyToken, userController.getAllUsers);
router.post("/updateuser", varifyToken, userController.UpdateUsers);
router.get("/:imageName", (req, res) => {
    const imageName = req.params.imageName;
    res.headersSent('content-type', "image/jpeg");
    res.sendFile(path.join(__dirname, "..", "uploads", imageName))
})
module.exports = router