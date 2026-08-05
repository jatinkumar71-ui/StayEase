const Home = require("../models/homes");
const favourite = require("../models/favourite");

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
    favourite.getFavourite(favourites => {
        Home.fetchAll(registeredHomes => {
            const favouriteHomes = registeredHomes.filter( home => favourites.includes(home.id));
            res.render('store/favourite-list', {favouriteHomes : favouriteHomes, pageTitle : 'my favourites', currentPage: 'favourite-list'});
        });
    });
    
}

exports.postAddToFavourite = (req, res, next) => {
    console.log('came to add to favourite', req.body);
    favourite.addToFavourite(req.body.id, error => {
        if(error){
            console.log('error while marking favourite : ', error);
        }
        res.redirect('/favourites');
    }); 
}

exports.postRemoveFromFavourite = (req, res, next) => {
    const homeId = req.params.homeId;
    favourite.deleteById(homeId, error => {
        if(error){
            console.log('error while removing from favourite : ', error);
        }
        res.redirect('/favourites');
    });
}

exports.getHomeDetails = (req, res, next) => {
    const homeId = req.params.homeId;
    Home.findById(homeId, home => {
        if(!home){
            console.log('home not found');
            res.redirect('/homes');
        }else{
            res.render('store/home-detail',{
                home: home,
                pageTitle : 'home details', 
                currentPage: 'home'
            });
        }
    });
}