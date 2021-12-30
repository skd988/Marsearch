const containLettersOnlyErrorMsg = 'Must contain letters only';
const requiredErrorMsg = 'Required';
const invalidEmailErrorMsg = 'Invalid e-mail address';
const alreadyInUseEmailErrorMsg = 'Email already in use';
const passwordValidErrorMsg = 'Password must have at least 8 letters';
const passwordsDontMatchErrorMsg = 'Passwords don\'t match';

const atLeast8Letters = /.{8,}/;
const onlyLetters = /^([A-Za-z])+$/;
const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const status = (response) => {
    return (response.status >= 200 && response.status < 300)?
        Promise.resolve(response) : Promise.reject(new Error(response.statusText));
};

const validatorModule = (() => {
    const hasMoreThan8Letters = (str) => {
        return atLeast8Letters.test(str)? '' : passwordValidErrorMsg;
    };

    const doesPasswordsMatch = (password, confirmation) => {
        return password === confirmation? '' : passwordsDontMatchErrorMsg;
    };

    const doesContainLettersOnly = (str) => {
        return onlyLetters.test(str)? '' : containLettersOnlyErrorMsg;
    };

    const isEmpty = (str) => {
        return str.length > 0? '' : requiredErrorMsg;
    };

    const isEmailFormat = (str) => {
        return emailFormat.test(str)? '' : invalidEmailErrorMsg;
    };

    const isEmailInUse = (email) => {
        return fetch('/api/' + email)
            .then(status)
            .then(res => res.json())
            .then(data => !data.doesExist? '' : alreadyInUseEmailErrorMsg)
            .catch(error => console.log(error));
    };

    return {hasMoreThan8Letters: hasMoreThan8Letters,
        doesPasswordsMatch: doesPasswordsMatch,
        doesContainLettersOnly: doesContainLettersOnly,
        isEmpty: isEmpty,
        isEmailFormat: isEmailFormat,
        isEmailInUse: isEmailInUse}
})();

const errorsModule = (() => {
    const showErrorMessage = (error) => {
        if(error.msg === '')
            return;

        let errorElement = document.getElementById(error.id);
        errorElement.innerHTML = error.msg;
        errorElement.classList.remove('d-none');
    };

    const showErrors = (errors) => {
        Object.values(errors).forEach(error => showErrorMessage(error));
    };

    const hideErrors = (errors) => {
        Object.values(errors).forEach(error => document.getElementById(error.id).classList.add('d-none'));
    };

    const areThereErrors = (errors) => {
        return !Object.values(errors).every(error => error.msg === '')
    }

    return {areThereErrors: areThereErrors,
        showErrors: showErrors,
        hideErrors: hideErrors
    };
})();

const trimAndLowerCase = (str) => {
   return str.trim().toLowerCase();
};

const forEachObject = (obj, func) => {
    Object.keys(obj).forEach(key => {
        obj[key] = func(obj[key]);
    });
};