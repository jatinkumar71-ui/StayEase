// Core Module
const path = require('path');

// External Modules
const express = require('express');

// Local Modules
const storeRouter = require('./routes/store');
const hostRouter = require('./routes/host');
const rootDir = require('./utils/pathUtil');
const errorController = require("./controllers/errors");

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use((req, res, next) => {
    console.log(req.url, req.method);
    next();
});

app.use(express.urlencoded());

app.use(storeRouter);
app.use('/host', hostRouter);

app.use(express.static(path.join(rootDir, 'public')));

app.use(errorController.pageNotFound);

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`server running on the address http://localhost:${PORT}`);
});
