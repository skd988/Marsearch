const express = require('express');
const usersData = require('../models/usersData');
const createError = require("http-errors");
const router = express.Router();

router.get('/:email', (req, res, next) => {
    let user = usersData.get(req.params.email);
    res.json(user? user : {});
});

router.post('/addUser', (req, res, next) => {
    try{
        usersData.add(req.session.userPartialData.email, req.session.userPartialData.first_name, req.session.userPartialData.last_name, req.body.password);
        res.redirect('/register/registered');
    }
    catch(e){
        res.redirect('/register/registrationError/' + e);
    }
});

module.exports = router;
