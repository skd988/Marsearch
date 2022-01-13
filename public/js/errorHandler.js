'use strict';

//handling errors in html page
const errorHandler = (() => {
    /*
        initiates an error handler, for each element with class 'error'.
        assumes all error elements are text only.
        all messages are initiated to empty.
    */
    const initErrors = () => {
        let errors = {};
        [...document.getElementsByClassName('error')].forEach(
            error_elem => errors[error_elem.getAttribute('id')] = {elem: error_elem, msg: ''});
        return errors;
    }

    //receives an error object. if the error message isn't empty, updates and reveals the error element
    const showErrorMessage = (error) => {
        if(error.msg === '')
            return;

        error.elem.innerHTML = error.msg;
        error.elem.classList.remove('d-none');
    };

    //receives an error handler, reveals all non-empty errors
    const showErrors = (errors) => {
        Object.values(errors).forEach(error => showErrorMessage(error));
    };

    //hides all errors
    const hideErrors = (errors) => {
        Object.values(errors).forEach(error => error.elem.classList.add('d-none'));
    };

    //returns whether there are errors (non empty messages)
    const areThereErrors = (errors) => {
        return !Object.values(errors).every(error => error.msg === '')
    }

    return {initErrors: initErrors,
        areThereErrors: areThereErrors,
        showErrors: showErrors,
        hideErrors: hideErrors
    };
})();