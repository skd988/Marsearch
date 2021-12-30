const express = require('express');
const usersData = require('../models/usersData');
const createError = require("http-errors");
const router = express.Router();

router.get('/:email', (req, res, next) => {
    res.json({doesExist: usersData.doesExist(req.params.email)});
});

router.post('/addUser', (req, res, next) => {
    try{
        if(!req.session.cookie._expires)
            throw 'Session expired';
        usersData.add(req.body.email, req.body.first_name, req.body.last_name, req.body.password);
        res.redirect('/register/registered');
    }
    catch(e){
        res.redirect('/register/registrationError/' + e);
    }
});

module.exports = router;
