const Home = require("../models/homes");

exports.getIndex = (req, res, next) => {
    Home.fetchAll(registeredHomes => {
        res.render('store/index', {registeredHomes : registeredHomes, pageTitle : 'Home Page', currentPage: 'index'});
    });
}

exports.getHomes = (req, res, next) => {
    Home.fetchAll(registeredHomes => {
        res.render('store/home-list', {registeredHomes : registeredHomes, pageTitle : 'Home list', currentPage: 'home'});
    });
}

exports.getBookings = (req, res, next) => {
        res.render('store/bookings', {pageTitle : 'my bookings', currentPage: 'bookings'});
}

exports.getFavouriteList = (req, res, next) => {
    Home.fetchAll(registeredHomes => {
        res.render('store/favourite-list', {registeredHomes : registeredHomes, pageTitle : 'my favourites', currentPage: 'favourite-list'});
    });
}