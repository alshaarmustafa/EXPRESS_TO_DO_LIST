const express = require('express')
const router = express.Router();
const { login, register, getAllUsers,deleteUser ,updateUser} = require("../controllers/userController");
const verifyToken = require('../middleware/verifyToken');
const allowedTo = require('../middleware/allowedTo');
const userRoles = require('../utils/userRoles');
const { registerVerify, loginVerify } = require('../middleware/verifyUser');


router.route("/")
               .get( verifyToken, getAllUsers)
router.route("/register")
               .post( registerVerify,register)
router.route("/login")
               .post( loginVerify,login)
router.delete("/:id",verifyToken,allowedTo(userRoles.ADMIN),deleteUser)
router.patch("/:id",updateUser)
module.exports = router;