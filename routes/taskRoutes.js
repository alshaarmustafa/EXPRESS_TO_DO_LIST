const express = require('express')
const router = express.Router();
const { getTasks, getTaskById, createTask, deleteTask, updateTask } = require("../controllers/taskController");
const verifyToken = require('../middleware/verifyToken');
const allowedTo = require('../middleware/allowedTo');
const userRoles = require('../utils/userRoles');

router.route("/")
                .get( verifyToken,getTasks)
                .post(verifyToken,createTask)
router.route("/:id")
                .get(getTaskById)
                .patch (verifyToken,allowedTo(userRoles.MANAGER),updateTask)
                .delete (verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),deleteTask)

module.exports = router;









