const Home = require("../models/homes");
const fs = require('fs');
const { cloudinary } = require('../cloudinary');

exports.getAddHome = (req, res, next) => {
    res.render('host/edit-home',{
        pageTitle : 'add home page', 
        currentPage: 'add-home',
        editing : false,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
    });
}

exports.getEditHome = (req, res, next) => {
    const homeId = req.params.homeId;
    const editing = req.query.editing === 'true';

    Home.findById(homeId).then(home => {
        if(!home){
            console.log('Home is not found for editing.');
            return res.redirect('/host/host-home-list');
        }
        console.log(homeId,editing, home)
        res.render('host/edit-home',{
            home : home,
            pageTitle : 'edit home page', 
            currentPage : 'host-home',
            editing : editing,
            isLoggedIn: req.isLoggedIn,
            user: req.session.user,
        });
    });
}

exports.postAddHome = (req, res, next) => {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    const {houseName, price, location, rating, description} = req.body;

    if(!req.file){
        console.log("No file uploaded");
        return res.redirect('/host/add-home');
    }
    const photoUrl = req.file.path;

    const home = new Home({houseName, price, location, rating, photoUrl, description, hostId: req.session.user._id});
    home.save().then( () => {
        console.log('Home saved successfully')
    })
    res.render('host/home-added',{
        pageTitle : 'home added page', 
        currentPage: 'home-added',
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
    });
}

exports.getHostHomes = (req, res, next) => {
    Home.find({hostId: req.session.user._id}).then(registeredHomes => {
        res.render('host/host-home-list', {
            registeredHomes : registeredHomes, 
            pageTitle : 'host Homes list', 
            currentPage: 'host-homes',
            isLoggedIn: req.isLoggedIn,
            user: req.session.user,
        });
    });
}

exports.postEditHome = (req, res, next) => {
    const { id, houseName, price, location, rating, description } = req.body;

    Home.findOne({
        _id: id,
        hostId: req.session.user._id
    })
    .then((home) => {
        if (!home) {
            return res.status(403).send('You are not authorized to edit this home');
        }

        home.houseName = houseName;
        home.price = price;
        home.location = location;
        home.rating = rating;
        home.description = description;

        if (req.file) {
            home.photoUrl = req.file.path;
        }

        return home.save();
    })
    .then((result) => {
        if (!result) return;

        res.render('host/home-edited', {
            pageTitle: 'home edited page',
            currentPage: 'host-home',
            isLoggedIn: req.isLoggedIn,
            user: req.session.user,
        });
    })
    .catch(error => {
        console.log('Error while editing home:', error);
        next(error);
    });
};


exports.postDeleteHome = (req, res, next) => {
    const homeId = req.params.homeId;

    Home.findOneAndDelete({
        _id: homeId, 
        hostId: req.session.user._id
    })
    .then((deletedHome) => {
        if(!deletedHome){
            return res.status(403).send('You are not authorized to delete this home');
        }
        res.redirect('/host/host-home-list');
    })
    .catch(error => {
        console.log('Error while deleting', error);
    });
};
