// Core Module
const path = require('path');

// External Modules
const express = require('express');

// Local Modules
const userRouter = require('./routes/user');
const hostRouter = require('./routes/host');
const rootDir = require('./utils/pathUtil');

const app = express();

app.use((req, res, next) => {
    console.log(req.url, req.method);
    next();
});

app.use(express.urlencoded());

app.use(userRouter);
app.use(hostRouter);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`server running on the address http://localhost/${PORT}`);
});
