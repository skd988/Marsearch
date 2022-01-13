const express = require('express');
const router = express.Router();

//GET register page.
router.get('/', function(req, res, next) {
    res.render('register');
});

const secondsForSession = 60;
//POST save user data in session (for limited time), redirects to password page
router.post('/savePartialUserData', function(req, res) {
    req.session.submitted = req.body;
    req.session.cookie.maxAge = secondsForSession*1000;
    res.redirect('/register/password');
});

//GET password register page.
router.get('/password', function(req, res) {
    if(req.session.cookie._expires)
        res.render('password', req.session.submitted);
    else
        res.render('registrationError', {msg: 'Session expired'})
});

//GET success register page.
router.get('/success', function(req, res) {
    res.render('registerComplete', {success: true});
});

//GET failed register page, with failure message
router.get('/failed/:msg', function(req, res) {
    res.render('registerComplete', {success: false, msg: req.params.msg});
});

module.exports = router;
