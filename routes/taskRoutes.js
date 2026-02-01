const express = require('express')
const router = express.Router();
const { getTasks, getTaskById, createTask, deleteTask, updateTask } = require("../controllers/taskController");
const verifyToken = require('../middleware/verifyToken');
const allowedTo = require('../middleware/allowedTo');
const userRoles = require('../utils/userRoles');
const { createTaskVerify, updateTaskVerify } = require('../validations/verifyTask');

router.use(verifyToken);
router.route("/")
                .get( getTasks)
                .post(createTaskVerify,createTask)
router.route("/:id")
                .get(getTaskById)
                .patch (allowedTo(userRoles.MANAGER),updateTaskVerify,updateTask)
                .delete (allowedTo(userRoles.ADMIN,userRoles.MANAGER),deleteTask)

module.exports = router;









