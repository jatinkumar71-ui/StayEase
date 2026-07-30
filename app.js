// Core Module
const path = require('path');

// External Modules
const express = require('express');

// Local Modules
const userRouter = require('./routes/user');
const {hostRouter} = require('./routes/host');
const rootDir = require('./utils/pathUtil');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use((req, res, next) => {
    console.log(req.url, req.method);
    next();
});

app.use(express.urlencoded());

app.use(userRouter);
app.use(hostRouter);

app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
    res.status(404).render('404',{pageTitle : '404 Error'});
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`server running on the address http://localhost/${PORT}`);
});
