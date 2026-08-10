const Home = require("../models/homes");
const Favourite = require("../models/favourite");


exports.getIndex = (req, res, next) => {
    Home.find().then(registeredHomes => {
        res.render('store/index', {
            registeredHomes : registeredHomes, 
            pageTitle : 'Home Page', 
            currentPage: 'index',
            isLoggedIn: req.isLoggedIn,
        });
    });
}

exports.getHomes = (req, res, next) => {
    Home.find().then(registeredHomes => {
        res.render('store/home-list',{
            registeredHomes : registeredHomes, 
            pageTitle : 'Home list', 
            currentPage: 'home',
            isLoggedIn: req.isLoggedIn,
        });
    });
}

exports.getBookings = (req, res, next) => {
        res.render('store/bookings', {
            pageTitle : 'my bookings', 
            currentPage: 'bookings',
            isLoggedIn: req.isLoggedIn,
        });
}

exports.getFavouriteList = (req, res, next) => {
    Favourite.find().populate('houseId')
    .then((favourites) => {
        const favouriteHomes = favourites.map(fav => fav.houseId);
        res.render('store/favourite-list', {
            favouriteHomes : favouriteHomes, 
            pageTitle : 'my favourites', 
            currentPage: 'favourite-list',
            isLoggedIn: req.isLoggedIn,
        });
    }); 
}

exports.postAddToFavourite = (req, res, next) => {
    const homeId = req.body.id;
    Favourite.findOne({houseId: homeId}).then((fav) => {
        if(fav){
            console.log('Already marked as favourite');
        }else{
            fav = new Favourite({houseId: homeId});
            fav.save().then(result => {
                console.log('fav added :', result);
            });
        }
        res.redirect('/favourites');
    }).catch( error => {
        console.log('error while marking favourite : ', error);
    });
}

exports.postRemoveFromFavourite = (req, res, next) => {
    const homeId = req.params.homeId;
    Favourite.findOneAndDelete(homeId).
    then(result => {
        console.log('fav removed :', result);
    })
    .catch(error => {
        console.log('error while removing favourite : ', error);
    })
    .finally(() => {
        res.redirect('/favourites')
    })
}

exports.getHomeDetails = (req, res, next) => {
    const homeId = req.params.homeId;
    Home.findById(homeId).then(home => {
        if(!home){
            console.log('home not found');
            res.redirect('/homes');
        }else{
            res.render('store/home-detail',{
                home: home,
                pageTitle : 'home details', 
                currentPage: 'home',
                isLoggedIn: req.isLoggedIn,
            });
        }
    });
}