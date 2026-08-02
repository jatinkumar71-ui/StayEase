// External Modules
const express = require('express');
const storeRouter = express.Router();

// Local Modules
const storeController = require('../controllers/store');

storeRouter.get("/", storeController.getIndex);
storeRouter.get("/homes", storeController.getHomes);
storeRouter.get("/bookings", storeController.getBookings);
storeRouter.get("/favourites", storeController.getFavouriteList);


module.exports = storeRouter;