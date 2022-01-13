const express = require('express');
const router = express.Router();

//GET home-login page if not logged in, and redirects to /marsearch if logged in.
router.get('/', function(req, res, next) {
    if(req.session.loggedIn)
        res.redirect('/marsearch')
    else
        res.render('login', {failed: req.query.failed});
});

//GET error page (receives error in query)
router.get('/error', function(req, res) {
    res.render('error', {error: JSON.parse(req.query.error)});
});

//GET marsearch page if logged in, and redirects to / if not
router.get('/marsearch', function(req, res) {
    if(req.session.loggedIn)
        res.render('marsearch', {name: req.session.loggedIn.name});
    else
        res.redirect('/');
});

module.exports = router;
