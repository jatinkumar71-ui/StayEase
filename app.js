require('dotenv').config();

// Core Module
const path = require('path');

// External Modules
const express = require('express');
const {mongoose} = require('mongoose');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);


// Local Modules
const storeRouter = require('./routes/store');
const hostRouter = require('./routes/host');
const authRouter = require('./routes/auth');
const rootDir = require('./utils/pathUtil');
const errorController = require("./controllers/errors");

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new mongoDbStore({
    uri: process.env.DB_PATH,
    collection: 'session',
})

app.use((req, res, next) => {
    console.log(req.url, req.method);
    next();
});

app.use(express.urlencoded());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
}))

app.use((req, res, next) => {
    req.isLoggedIn = req.session.isLoggedIn;
    next();
})

app.use(authRouter);
app.use(storeRouter);
app.use('/host', hostRouter); 
app.use('/host', (req, res, next) => {
    if(req.isLoggedIn){
        next();
    }else{
        redirect('/login');
    }
})

app.use(express.static(path.join(rootDir, 'public')));

app.use(errorController.pageNotFound);

const PORT = 3003;

mongoose.connect(process.env.DB_PATH).then( () => {
    app.listen(PORT, () => {
        console.log('connected to mongo');
        console.log(`server running on the address http://localhost:${PORT}`);
    });

}).catch( (error) => {
    console.log('Error while connecting to mongo ', error);
});