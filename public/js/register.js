'use strict';

(() => {
    const first_name_error_id = 'first_name_error';
    const last_name_error_id = 'last_name_error';
    const email_error_id = 'email_error';

    const initErrors = () => {
        return {first_name_error: {id: first_name_error_id, msg: ''},
                last_name_error: {id: last_name_error_id, msg: ''},
                email_error: {id: email_error_id, msg: ''}};
    }

    const validateInputs = (parameters, errors) => {
        errors.first_name_error.msg = validatorModule.isEmpty(parameters.first_name);
        errors.last_name_error.msg = validatorModule.isEmpty(parameters.last_name);
        errors.email_error.msg = validatorModule.isEmpty(parameters.email);

        if(errors.first_name_error.msg === '')
            errors.first_name_error.msg = validatorModule.doesContainLettersOnly(parameters.first_name);
        if(errors.last_name_error.msg === '')
            errors.last_name_error.msg = validatorModule.doesContainLettersOnly(parameters.last_name);
        if(errors.email_error.msg === '')
            errors.email_error.msg = validatorModule.isEmailFormat(parameters.email);
    };


    document.addEventListener('DOMContentLoaded', () =>{
        let errors = initErrors();
        document.addEventListener('submit', (event) => {
            event.preventDefault();

            errorsModule.hideErrors(errors);

            let form = document.querySelector('form');
            let formData = new FormData(form);
            let parameters = Object.fromEntries(formData);
            forEachObject(parameters, trimAndLowerCase);

            validateInputs(parameters, errors);

            if(errors.email_error.msg === ''){
                validatorModule.isEmailInUse(parameters.email).then((emailMsg) => {
                    errors.email_error.msg = emailMsg;
                    if(!errorsModule.areThereErrors(errors))
                        form.submit();
                    else
                        errorsModule.showErrors(errors);
                });
            }
            else
                errorsModule.showErrors(errors);
        });
    });
})();