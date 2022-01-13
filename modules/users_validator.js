const usersDb = require('../models/User');

//validator for users database
const users_validator = (() => {
    const VALID_PASSWORD = /.{8,}/;
    const ONLY_LETTERS = /^([A-Za-z])+$/;
    const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //receives user parameters and returns a promise contains whether they are valid
    const validate = (parameters) => {
        return isEmailInUse(parameters.email).then(isInUse => {
            return isEmailFormat(parameters.email) && doesContainLettersOnly(parameters.first_name) &&
                doesContainLettersOnly(parameters.last_name) && isValidPassword(parameters.password) && !isInUse;
        });
    };


    //returns a promise of whether an email is already used in the user database
    const isEmailInUse = (email) => {
        return usersDb.findOne({where: {email: email}}).then(user => !!user);
    };

    //returns whether a string is of valid password format (has at least 8 chars)
    const isValidPassword = (str) => {
        return VALID_PASSWORD.test(str);
    };

    //returns whether a string contain letters only (and non-empty)
    const doesContainLettersOnly = (str) => {
        return ONLY_LETTERS.test(str);
    };

    //returns whether a string is in email format
    const isEmailFormat = (str) => {
        return EMAIL_FORMAT.test(str);
    };

    return {validate: validate, isEmailInUse: isEmailInUse};
})();

module.exports = users_validator;
