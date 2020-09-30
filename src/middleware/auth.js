module.exports = {
    ensureGuest: function(req, res, next) {
        if(req.isAuthenticated()){
           return res.redirect('/dashboard');
        }
        next();
    }
}