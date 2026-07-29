//Core Module
const path = require('path');

// External Modules
const express = require('express');

// Local Modules
const rootDir = require('../utils/pathUtil');

const userRouter = express.Router();

userRouter.get("/", (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'home.html'));
});

module.exports = userRouter;