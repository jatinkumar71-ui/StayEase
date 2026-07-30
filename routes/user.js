//Core Module
const path = require('path');

// External Modules
const express = require('express');

// Local Modules
const rootDir = require('../utils/pathUtil');
const {registeredHomes} = require('./host');

const userRouter = express.Router();

userRouter.get("/", (req, res, next) => {
    console.log(registeredHomes);
    res.render('home', {registeredHomes : registeredHomes, pageTitle : 'Home Page'});
});

module.exports = userRouter;