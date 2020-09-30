const express = require('express');
const router = express.Router();
const { ensureGuest } = require('../middleware/auth');
const Story = require('../models/story.js');

router.get('', (req, res) => {
    res.redirect('/dashboard');
});
router.get('/za', ensureGuest, (req, res) => {
    res.render('login', { name: 'login', layout: 'login' });
});
router.get('/za/login', ensureGuest, (req, res) => {
    res.render('login', { name: 'login', layout: 'login' });
});
router.get('/za/*', ensureGuest, (req, res) => {
    res.status(404).render('errors/404', { layout: 'error' });
});
router.get('/dashboard', async (req, res) => {
    const stories = await Story.find({ creator: req.user.id }).lean();
    res.render('dashboard', { name: req.user.firstName, stories });
    
});
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/za');
});
router.get('/*', (req, res) => {
    res.status(404).render('errors/404', { layout: 'error' });
})

module.exports = router;