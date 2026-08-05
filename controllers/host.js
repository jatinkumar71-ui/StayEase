const Home = require("../models/homes");

exports.getAddHome = (req, res, next) => {
    res.render('host/edit-home',{
        pageTitle : 'add home page', 
        currentPage: 'add-home',
        editing : false,
    });
}

exports.getEditHome = (req, res, next) => {
    const homeId = req.params.homeId;
    const editing = req.query.editing === 'true';

    Home.findById(homeId, home => {
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
        });
    });
}

exports.postAddHome = (req, res, next) => {
    console.log(req.body);
    const {houseName, price, location, rating, photoUrl} = req.body;
    const home = new Home(houseName, price, location, rating, photoUrl);
    home.save();
    res.render('host/home-added',{
        pageTitle : 'home added page', 
        currentPage: 'home-added',
    });
}

exports.getHostHomes = (req, res, next) => {
    Home.fetchAll(registeredHomes => {
        res.render('host/host-home-list', {registeredHomes : registeredHomes, pageTitle : 'host Homes list', currentPage: 'host-homes'});
    });
}

exports.postEditHome = (req, res, next) => {
    console.log(req.body);
    const {id, houseName, price, location, rating, photoUrl} = req.body;
    const home = new Home(houseName, price, location, rating, photoUrl);
    home.id = id;
    home.save();
    res.render('host/home-edited',{
        pageTitle : 'home edited page', 
        currentPage: 'host-home',
    });
}

exports.postDeleteHome = (req, res, next) => {
    const homeId = req.params.homeId;
    Home.deleteById(homeId, error => {
        if(error){
            console.log('error while deleting ', error);
        }
        res.redirect('/host/host-home-list');
    });
    
};
