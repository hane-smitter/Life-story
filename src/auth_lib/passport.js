const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function(passport, app) {
    passport.use( new GoogleStrategy( {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/za/auth/google/callback'
    },
    async(accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
            email: profile.emails[0].value
        }
        /* console.log('newUser');
        console.log(newUser);
        console.log('profile');
        console.log(profile); */
        try {
            var user = await User.findOne( {googleId: profile.id} );//114037087787067436012
            if( user ) return done(null, user);
            user = new User(newUser);
            await user.save();
            done(null, user);
            //done(null, false, { message: 'user created' })
        } catch(err) {
            console.log(err);
            // done(err, /* null */false);
            done(err);
        }
    } ));

    passport.serializeUser( function( user, done ) {
        done(null, user._id);
    } );
    passport.deserializeUser( function( id, done ) {
        User.findById(id, function(err, user) {
            done(err, user);
        })
    } );
    app.use(passport.initialize());
    app.use(passport.session());
}