const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/pathUtil');

const favouriteDataPath = path.join(rootDir,'data', 'favourite.json');


module.exports = class favourite{
    static addToFavourite(homeId, callback){
        favourite.getFavourite((favourites) => {
            if(favourites.includes(homeId)){
                callback('Home is already marked favourite');
            }
            else{
                favourites.push(homeId);
                fs.writeFile(favouriteDataPath, JSON.stringify(favourites), callback);
            }
        });
    }
    static getFavourite(callback){
        fs.readFile(favouriteDataPath, (err, data) => {
            if(!err){
                callback(JSON.parse(data));
            }else{
                callback([]);
            }
        });
    }

    static deleteById(delHomeId, callback){
        favourite.getFavourite(homeIds => {
            homeIds = homeIds.filter( homeId => delHomeId !== homeId);
            fs.writeFile(favouriteDataPath, JSON.stringify(homeIds),callback);
        });
    }
}
