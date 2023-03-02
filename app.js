const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


const app = express();


//passport config
require('./config/passport')(passport)


//DB config
const db = require('./config/keys').MongoURI;

//connect to Mongo
mongoose.set('strictQuery', false);
mongoose.connect(db)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));


//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs'); //here we are setting the type of view engine


//Express-session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//passport local middleware
app.use(passport.initialize());
app.use(passport.session());
//Connect Flash
app.use(flash());


//Global Variables
app.use((req, res, next) => { 
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error')
    next()
})

//BodyParser
app.use(express.urlencoded({ extended: false }));




//Routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))




const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})