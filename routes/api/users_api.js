const express = require('express');
const createError = require("http-errors");
const db = require('../../models/User');
const router = express.Router();
const validator = require('../../modules/users_validator');
const statusCodes = require("http-status-codes");


//returns a promise containing if an email parameter is already in use by another user
router.get('/users/:email', (req, res) => {
    validator.isEmailInUse(req.params.email).then(doesExist => res.json({doesExist: doesExist}));
});

/*
    receives parameters for a new user,
    if the user has a valid session that is not expired,
    and if the parameters are valid adds the user to the database and redirects to success page.
    otherwise redirects to a failure page with the proper error.
 */
const EXPIRED_ERROR = 'session expired';
const INVALID_INPUT_ERROR = 'input is invalid, should have been validated in client side';
router.post('/users', (req, res) => {
    if(req.session.cookie._expires){
        ['email', 'first_name', 'last_name'].forEach(key => req.body[key] = req.body[key].trim())
        validator.validate(req.body).then(isValid => {
            if(isValid)
                db.create(req.body).then(() => res.redirect('/register/success'));
            else{
                res.status(statusCodes.BAD_REQUEST).redirect('/register/failed/' + INVALID_INPUT_ERROR);
            }
        });
    }
    else{
        res.status(statusCodes.UNAUTHORIZED).redirect('/register/failed/' + EXPIRED_ERROR);
    }
});

/*
    receives parameters of email and password, requests logging in.
    if the parameters are of a valid user, updates the session to the new log in and redirects to marsearch.
    Otherwise redirects to login page with an login error.
 */
router.post('/login', (req, res, next) => {
    db.findOne({where: {email: req.body.email}})
        .then(user => {
            if(user?.getDataValue('password') === req.body.password){
                req.session.loggedIn = {email: user.getDataValue('email'),
                    name: user.getDataValue('first_name') + ' ' + user.getDataValue('last_name')};
                res.redirect('/marsearch');
            }
            else{
                res.redirect('/?failed=true');
            }
        })
        .catch(e => next(createError()));
});

/*
    request to log out from the user, updates session accordingly, redirects to login page.
    although not using the users database, I still put it here for consistency (login is here),
    and also leaving a possibility to add db update in the future (check if the user is already connected?)
*/
router.get('/logout', (req, res) => {
    delete req.session.loggedIn;
    res.redirect('/');
});

module.exports = router;
