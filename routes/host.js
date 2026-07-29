//Core Module
const path = require('path');

// External Modules
const express = require('express');

// Local Modules
const rootDir = require('../utils/pathUtil');

const hostRouter = express.Router();

hostRouter.get("/host/add-home", (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'add-home.html'));
});

hostRouter.post("/host/add-home", (req, res, next) => {
    console.log(req.body);
    res.sendFile(path.join(rootDir, 'views', 'home-added.html'));
});

module.exports = hostRouter;