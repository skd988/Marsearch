'use strict';

(() => {
    const password_id = 'password_error';
    const confirmation_id = 'confirmation_error';

    const initErrors = () => {
        return {password_error: {id: password_id, msg: ''},
            confirmation_error: {id: confirmation_id, msg: ''}};
    }

    const validateInputs = (parameters, errors) => {
        errors.password_error.msg = validatorModule.isEmpty(parameters.password);
        errors.confirmation_error.msg = validatorModule.isEmpty(parameters.confirmation);
        if(errors.password_error.msg === '')
            errors.password_error.msg = validatorModule.hasMoreThan8Letters(parameters.password);
        if(errors.confirmation_error.msg === '')
            errors.confirmation_error.msg = validatorModule.doesPasswordsMatch(parameters.password, parameters.confirmation);
    };

    document.addEventListener('DOMContentLoaded', () =>{
        let errors = initErrors();
        document.addEventListener('submit', (event) => {
            event.preventDefault();

            errorsModule.hideErrors(errors);

            let form = document.querySelector('form');
            let formData = new FormData(form);
            let parameters = Object.fromEntries(formData);
            forEachObject(parameters, trimAndLowerCase)

            validateInputs(parameters, errors);

            if(!errorsModule.areThereErrors(errors))
                form.submit();

            errorsModule.showErrors(errors);
        });
    });
})();
