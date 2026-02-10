const express = require('express')
const router = express.Router();
const AppError = require('../utils/AppError');
const { getAllUsers, deleteUser, updateUser, getSingleUser } = require("../controllers/userController");
const verifyToken = require('../middleware/verifyToken');
const allowedTo = require('../middleware/allowedTo');
const userRoles = require('../utils/userRoles');
const { registerVerify, loginVerify, updateVerify } = require('../validations/verifyUser');
const { register, login } = require('../controllers/authController');
const multer = require('multer');
const handleAvatarUpload = require('../middleware/handleAvatarUpload');
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
})

const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];

    if (imageType === 'image') {
        return cb(null, true)
    } else {
        return cb(new AppError('file must be an image', 400), false)
    }
}

const upload = multer({
    storage: diskStorage,
    fileFilter
})


router.route("/register")
    .post(upload.single('avatar'), registerVerify, register)
router.route("/login")
    .post(loginVerify, login)


router.route("/")
    .get(verifyToken, getAllUsers)
    .post(loginVerify, login)
router.delete("/:id", verifyToken, allowedTo(userRoles.ADMIN), deleteUser)
router.patch("/:id", verifyToken,upload.single("avatar"),handleAvatarUpload,updateVerify,updateUser);
router.get("/:id", verifyToken, getSingleUser)

module.exports = router;