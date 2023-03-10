const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');


//User model - we are bringing our mongoose model on top here 
const User = require('../models/User')



//Login - Page
router.get('/login', (req, res) => {
    res.render('login')
});

//Register Page
router.get('/register', (req, res) => {
    res.render('register')
});

//Register handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({msg:'Please fill in detail'})
    }

    //Check passwords match 
    if (password !== password2) {
        errors.push({msg:'Passwords do not match'});
    }

    //Check pass length
    if (password.length < 6) {
        errors.push({msg:'Password should be atleast 6 characters'})
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        //validation pass
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                //if user exists
                    errors.push({msg:'Email is already registered'})
                    res.render('register', {
                        errors, name, email, password, password2
                });
                }
                else
                {
                    const newUser = new User({
                        name,
                        email,
                        password
                    }); 

                    //hashed password
                    bcrypt.genSalt(10, (err,salt) => {
                        bcrypt.hash(newUser.password, salt, (err,hash) => {
                            if (err) throw err;

                            //Set password to hashed
                            newUser.password = hash;

                            //Save User
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now a registered user');
                                    res.redirect('/users/login')            
                                })
                                .catch(err => console.log(err))
                    })
                })
            }
        })
    }
})


//Login handle
router.post('/login', (req, res,next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})


//Logout Handle
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) throw err;
        req.flash('success_msg', 'You are logout');
        res.redirect('/users/login')
    });
})


module.exports = router;