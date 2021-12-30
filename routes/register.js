const express = require('express');
const router = express.Router();

/* GET register page. */
router.get('/', function(req, res, next) {
    res.render('register');
});

const secondsForSession = 60;
/* POST save user data in session. */
router.post('/savePartialUserData', function(req, res, next) {
    req.session.userPartialData = {email: req.body.email, first_name: req.body.first_name, last_name: req.body.last_name};
    req.session.cookie.maxAge = secondsForSession*1000;
    res.redirect('/register/password');
});

/* GET password register page. */
router.get('/password', function(req, res, next) {
    if(req.session.cookie._expires)
        res.render('password', {first_name: req.session.userPartialData.first_name,
                                            last_name: req.session.userPartialData.last_name,
                                            email: req.session.userPartialData.email});
    else
        res.render('registrationError', {msg: 'Session expired'})
});

/* GET success register page. */
router.get('/registered', function(req, res, next) {
    res.render('registered');
});

/* GET failed register page. */
router.get('/registrationError/:msg', function(req, res, next) {
    res.render('registrationError', {msg: req.params.msg});
});

module.exports = router;
