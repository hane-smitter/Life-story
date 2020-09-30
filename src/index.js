/* making our variables available */
require('dotenv').config({
    path: 'config/config.env'
});

/* our app starts */
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
require('./db/db.js');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const routes = require('./routes/routes.js');
const authRoute = require('./routes/auth');
const storiesRoute = require('./routes/stories');
const passportAuth = require('./auth_lib/passport');

const app = express();
const port = process.env.PORT;

//Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//method override 
app.use(methodOverride( function(req, res) {
    if(req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
} ));

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}



//static dir
const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir));


//Handle bars helpers
const { formatDate, stripTags, truncate, editIcon, editStoryStatus, writeTracker } = require('../helpers/hbs');

//setting the view engine
app.engine('.hbs', exphbs( {extname: '.hbs', helpers: {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    editStoryStatus,
    writeTracker
}} ));
app.set('view engine', '.hbs');

app.use(session ({
    secret: 'keyboard cat',
    resave: false,//dont save a session if nothing is modified
    saveUninitialized: false,//do not create a session until sth is stored
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

passportAuth(passport, app);

//route not to authenticate
let regex = /^\/za(\/.*)?$/;
app.use( function(req, res, next) {
    let url = req.originalUrl;

    console.log(regex.test(url));
    if(!req.isAuthenticated() && !regex.test(url)) {
        res.redirect('/za');
        return;
    }
    next();
    
});

//make authenticated user available globally in express
app.use(function(req, res, next) {
    res.locals.authUser = req.user || null;
    next();
});

//route handlers
app.use(authRoute);
app.use(storiesRoute);
app.use(routes);


app.listen(port, () => {
    console.log(`${process.env.NODE_ENV} mode \n server running on port: ${port}`);
});