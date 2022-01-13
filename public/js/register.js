'use strict';

//validator for passwords. if input is valid returns empty string, otherwise the error message is returned
const validator = (() => {
    const CONTAIN_LETTERS_ONLY_ERROR_MSG = 'Must contain letters only';
    const REQUIRED_ERROR_MSG = 'Required';
    const INVALID_EMAIL_ERROR_MSG = 'Invalid e-mail address';
    const ALREADY_IN_USE_EMAIL_ERROR_MSG = 'Email already in use';

    const BASE_DOES_EXIST_URL = '/users/api/users/';

    const ONLY_LETTERS = /^([A-Za-z])+$/;
    const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //returns whether a string contains letters only
    const doesContainLettersOnly = (str) => {
        return ONLY_LETTERS.test(str)? '' : CONTAIN_LETTERS_ONLY_ERROR_MSG;
    };

    //returns whether a string is empty (otherwise returns "required" message)
    const isNonEmpty = (str) => {
        return str.length > 0? '' : REQUIRED_ERROR_MSG;
    };

    //returns whether a string is of email format
    const isEmailFormat = (str) => {
        return EMAIL_FORMAT.test(str)? '' : INVALID_EMAIL_ERROR_MSG;
    };

    //returns whether the email is already in use in the database
    const isEmailInUse = (email) => {
        return ajax.fetch(BASE_DOES_EXIST_URL + email)
            .then(res => res.json())
            .then(data => !data.doesExist? '' : ALREADY_IN_USE_EMAIL_ERROR_MSG)
            .catch(e => redirectToErrorPage(e));
    };

    return {doesContainLettersOnly: doesContainLettersOnly,
        isNonEmpty: isNonEmpty,
        isEmailFormat: isEmailFormat,
        isEmailInUse: isEmailInUse}
})();

(() => {
    /*
        receives parameters and errors object,
        validates parameters and updates errors accordingly.
        parameters are first_name, last_name and error,
        checks if the parameters are not empty,
        if the names contain letters only
        and if the email is of email format
     */
    const validateInputs = (parameters, errors) => {
        errors.first_name_error.msg = validator.isNonEmpty(parameters.first_name);
        errors.last_name_error.msg = validator.isNonEmpty(parameters.last_name);
        errors.email_error.msg = validator.isNonEmpty(parameters.email);

        if(errors.first_name_error.msg === '')
            errors.first_name_error.msg = validator.doesContainLettersOnly(parameters.first_name);
        if(errors.last_name_error.msg === '')
            errors.last_name_error.msg = validator.doesContainLettersOnly(parameters.last_name);
        if(errors.email_error.msg === '')
            errors.email_error.msg = validator.isEmailFormat(parameters.email);
    };


    document.addEventListener('DOMContentLoaded', () =>{
        //initiates errors to contain the three errors in the html page (each for each input)
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
            parameters = mapObject(parameters, s => s.trim());
            parameters.email = parameters.email.toLowerCase();

            validateInputs(parameters, errors);

            if(errors.email_error.msg === ''){
                validator.isEmailInUse(parameters.email).then((emailMsg) => {
                    errors.email_error.msg = emailMsg;
                    if(!errorHandler.areThereErrors(errors))
                        form.submit();
                    else
                        errorHandler.showErrors(errors);
                }).catch(error => {
                    errors.email_error.msg = error;
                    errorHandler.showErrors(errors);
                });
            }
            else
                errorHandler.showErrors(errors);
        });
    });
})();