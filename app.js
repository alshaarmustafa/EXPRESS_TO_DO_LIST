const express = require("express");
const mongoose = require("mongoose");
const tasksRoutes = require("./routes/taskRoutes");
const usersRoutes = require("./routes/userRoutes");
const morgan = require("morgan");
require('dotenv').config()

const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'))

require("./db")


// Routes
app.use('/api/tasks', tasksRoutes) // /api/tasks
app.use('/api/users', usersRoutes) // /api/users

//Global Middleware for not found routes
app.all('*', (req, res, next) => {
    res.status(404).json({ message: `Can't find ${req.originalUrl} on this server!` });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.log("error", err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).send({
        status: statusCode,
        message: err?.message || "internal Server error ",
        errors: err?.errors || []
    })
})

app.listen(port, () => {
    console.log("Server started on port 3000")
}) 