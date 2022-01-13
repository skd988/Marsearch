'use strict';

//validator for passwords. if input is valid returns empty string, otherwise the error message is returned
const validator = (() => {
    const REQUIRED_ERROR_MSG = 'Required';
    const INVALID_PASSWORD_ERROR_MSG = 'Password must have at least 8 letters';
    const PASSWORDS_DONT_MATCH_ERROR_MSG = 'Passwords don\'t match';

    const validPassword = /.{8,}/;

    //returns whether a string is valid (has at least 8 chars)
    const isValidPassword = (str) => {
        return validPassword.test(str)? '' : INVALID_PASSWORD_ERROR_MSG;
    };

    //returns whether password and confirmation match
    const doesPasswordsMatch = (password, confirmation) => {
        return password === confirmation? '' : PASSWORDS_DONT_MATCH_ERROR_MSG;
    };

    //returns whether a string is empty (otherwise returns "required" message)
    const isNonEmpty = (str) => {
        return str.length > 0? '' : REQUIRED_ERROR_MSG;
    };

    return {isValidPassword: isValidPassword,
        doesPasswordsMatch: doesPasswordsMatch,
        isNonEmpty: isNonEmpty}
})();

(() => {
    /*
        receives parameters and errors object,
        validates parameters and updates errors accordingly.
        parameters are password and confirmation,
        checks if the parameters are not empty,
        if password is valid
        and if password and confirmation match
     */
    const validateInputs = (parameters, errors) => {
        errors.password_error.msg = validator.isNonEmpty(parameters.password);
        errors.confirmation_error.msg = validator.isNonEmpty(parameters.confirmation);
        if(errors.password_error.msg === '')
            errors.password_error.msg = validator.isValidPassword(parameters.password);
        if(errors.confirmation_error.msg === '')
            errors.confirmation_error.msg = validator.doesPasswordsMatch(parameters.password, parameters.confirmation);
    };


    document.addEventListener('DOMContentLoaded', () =>{
        //initiates errors to contain the two errors in the html page (each for each input)
        let errors = errorHandler.initErrors();

        /*
            after form submission, checks if the inputs are valid and present errors accordingly.
            otherwise submits the form.
         */
        document.addEventListener('submit', (event) => {
            event.preventDefault();

            errorHandler.hideErrors(errors);

            let form = document.querySelector('form');
            let formData = new FormData(form);
            let parameters = Object.fromEntries(formData);

            validateInputs(parameters, errors);

            if(!errorHandler.areThereErrors(errors))
                form.submit();

            errorHandler.showErrors(errors);
        });
    });
})();
