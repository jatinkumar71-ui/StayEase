const Home = require("../models/homes");

exports.getAddHome = (req, res, next) => {
    res.render('host/edit-home',{
        pageTitle : 'add home page', 
        currentPage: 'add-home',
        editing : false,
        isLoggedIn: req.isLoggedIn,
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
        });
    });
}

exports.postAddHome = (req, res, next) => {
    const {houseName, price, location, rating, photoUrl, description} = req.body;
    const home = new Home({houseName, price, location, rating, photoUrl, description});
    home.save().then( () => {
        console.log('Home saved successfully')
    })
    res.render('host/home-added',{
        pageTitle : 'home added page', 
        currentPage: 'home-added',
        isLoggedIn: req.isLoggedIn,
    });
}

exports.getHostHomes = (req, res, next) => {
    Home.find().then(registeredHomes => {
        res.render('host/host-home-list', {
            registeredHomes : registeredHomes, 
            pageTitle : 'host Homes list', 
            currentPage: 'host-homes',
            isLoggedIn: req.isLoggedIn,
        });
    });
}

exports.postEditHome = (req, res, next) => {
    console.log(req.body);
    const {id, houseName, price, location, rating, photoUrl, description} = req.body;
    Home.findById(id).then((home) => {
        home.houseName = houseName;
        home.price = price;
        home.location = location;
        home.rating = rating;
        home.photoUrl = photoUrl;
        home.description = description;
        home.save().then(result => {
            console.log('home updated : ', home);
        }).catch( error => {
            console.log("Error while updating ", error);
        })
        res.render('host/home-edited',{
            pageTitle : 'home edited page', 
            currentPage: 'host-home',
            isLoggedIn: req.isLoggedIn,
        })
    }).catch(error => {
        console.log("Error while finding home", error);
    })
}

exports.postDeleteHome = (req, res, next) => {
    const homeId = req.params.homeId;
    Home.findByIdAndDelete(homeId).then(() => {
        res.redirect('/host/host-home-list');
    }).catch(error => {
        console.log('Error while deleting', error);
    });
    
};
