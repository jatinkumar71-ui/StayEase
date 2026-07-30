//Core Module
const path = require('path');

// External Modules
const express = require('express');

// Local Modules
const rootDir = require('../utils/pathUtil');

const hostRouter = express.Router();

hostRouter.get("/host/add-home", (req, res, next) => {
    res.render('add-home',{pageTitle : 'add home page', currentPage: 'add-home'});
});

const registeredHomes = [];

hostRouter.post("/host/add-home", (req, res, next) => {
    console.log(req.body);
    registeredHomes.push(req.body);
    res.render('home-added',{pageTitle : 'home added page', currentPage: 'home-added'});
});

exports.hostRouter = hostRouter;
exports.registeredHomes = registeredHomes;

