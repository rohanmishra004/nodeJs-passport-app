const localStrategy = require('passport-local').Strategy;

//to check the data that we bring in from database
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



//Load User model
const User = require('../models/User');

module.exports = function (passport) {
    passport.use(
        new localStrategy({ usernameField: 'email' }, (email, password, done) => {
            //Match User
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'That email is not registered' });
                    }
                    //Match Password - we need to use bcrypt 
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, { message: 'Password Incorrect' })
                        }
                    })
                })
                .catch(err => console.log(err))
            
        })
    );
    
    // Serialization and deserialization
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        });
    });

}