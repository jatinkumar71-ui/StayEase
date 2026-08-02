const Home = require("../models/homes");

exports.getAddHome = (req, res, next) => {
    res.render('host/add-home',{pageTitle : 'add home page', currentPage: 'add-home'});
}

exports.postAddHome = (req, res, next) => {
    console.log(req.body);
    const {houseName, price, location, rating, photoUrl} = req.body;
    const home = new Home(houseName, price, location, rating, photoUrl);
    home.save();
    res.render('host/home-added',{pageTitle : 'home added page', currentPage: 'home-added'});
}

exports.getHostHomes = (req, res, next) => {
    Home.fetchAll(registeredHomes => {
        res.render('host/host-home-list', {registeredHomes : registeredHomes, pageTitle : 'host Homes list', currentPage: 'host-homes'});
    });
}

