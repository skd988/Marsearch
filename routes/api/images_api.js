const express = require('express');
const db = require('../../models/Image');
const validator = require('../../modules/images_validator');
const router = express.Router();
const statusCodes = require('http-status-codes');

//receives response object, status and message and returns an error to the client, in text form
const returnError = (res, status, message) => {
    console.log('Error:', status, message);
    status = status || statusCodes.INTERNAL_SERVER_ERROR;
    res.writeHead(status, message, {'content-type' : 'text/plain'});
    res.end();
};

//catches all request, and checks if the client is logged in. if not, it returns "not logged in" error
const NOT_LOGGED_IN_ERROR_MSG = 'Client is not logged in';
router.all( '*', (req, res, next) => {
    if(req?.session?.loggedIn)
        next();
    else
        returnError(res, statusCodes.UNAUTHORIZED, NOT_LOGGED_IN_ERROR_MSG);
});

//catches get requests, return json of all images of the client (by the logged in email)
router.get('/', (req, res) => {
    db.findAll({where: {email: req.session.loggedIn.email}})
        .then(images => {
            res.json({success: true, images: images});
        })
        .catch(e => returnError(res, e.status, e.message));
});

/*
    catches post requests, receives parameters for a new image to be saved to the client's list,
    if the parameters are valid and the image is not already in the database,
    inserts it into the database, and returns success = true.
    If the parameters are invalid or some other error returns error by text,
    if the image is not in the database returns success = false.
 */
const INVALID_MSG = 'invalid input';
router.post('/', (req, res) => {
    let parameters = {...req.body, email: req.session.loggedIn.email};
    if(validator.validate(parameters))
        db.findOrCreate({where: {email: parameters.email, img_id: parameters.img_id}, defaults: parameters})
            .then(result => {
                //is created
                if(result[1])
                    res.json({success: true})
                else
                    res.status(statusCodes.ACCEPTED).json({success: false});
            })
            .catch(e => returnError(res, e.status, e.message));
    else
        returnError( res, statusCodes.BAD_REQUEST, INVALID_MSG);
});

/*
    catches delete requests with parameter id, deletes the image of the database.
    if the image is not found, returns "not found" error.
*/
const NOT_FOUND_MSG = 'Image not found';
router.delete('/:id', (req, res) => {
    db.findAll({where: {email: req.session.loggedIn.email, img_id: req.params.id}})
        .then(images => {
            if(!images.length)
                throw {status: statusCodes.BAD_REQUEST, message: NOT_FOUND_MSG}

            images.forEach(img => img.destroy({force: true}));

            res.json({success: true});
        })
        .catch(e => returnError(res, e.status, e.message));
});

module.exports = router;
