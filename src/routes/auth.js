const express = require('express');
const passport = require('passport');
const router = express.Router();

//@desc Auth with Google
//@route GET /auth/google
router.get('/za/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

//@desc Google Auth callback
//@route GET /auth/google/calback
router.get('/za/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
    //success
    console.log('is req.user set??')
    console.log(req.user);
    console.log('is req.user authenticated??')
    console.log(req.isAuthenticated());
    res.redirect('/dashboard');
});

module.exports = router;