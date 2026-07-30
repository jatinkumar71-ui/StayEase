//Core Module
const path = require('path');

// External Modules
const express = require('express');

// Local Modules
const rootDir = require('../utils/pathUtil');

const hostRouter = express.Router();

hostRouter.get("/host/add-home", (req, res, next) => {
    res.render('add-home',{pageTitle : 'add home page'});
});

const registeredHomes = [];

hostRouter.post("/host/add-home", (req, res, next) => {
    console.log(req.body);
    registeredHomes.push({
        houseName: req.body.houseName,
        price: req.body.price,
        location: req.body.location,
        rating: req.body.rating,
        photoUrl: req.body.photoUrl
    });
    res.render('home-added',{pageTitle : 'home added page'});
});

exports.hostRouter = hostRouter;
exports.registeredHomes = registeredHomes;

