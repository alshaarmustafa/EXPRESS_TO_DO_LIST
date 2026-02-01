const express = require('express')
const router = express.Router();
const {  getAllUsers, deleteUser, updateUser, getSingleUser } = require("../controllers/userController");
const verifyToken = require('../middleware/verifyToken');
const allowedTo = require('../middleware/allowedTo');
const userRoles = require('../utils/userRoles');
const { registerVerify, loginVerify, updateVerify } = require('../validations/verifyUser');
const { register, login } = require('../controllers/authController');


router.route("/register")
.post(registerVerify, register)  
router.route("/login")
.post(loginVerify, login)


router.route("/")
    .get(verifyToken, getAllUsers)
    .post(loginVerify, login)
router.delete("/:id", verifyToken, allowedTo(userRoles.ADMIN), deleteUser)
router.patch("/:id", updateVerify, updateUser)
router.get("/:id", verifyToken, getSingleUser)

module.exports = router;