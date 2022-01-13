'use strict';

//from a received object, creates a new object where all values are changed according to a received function
const mapObject = (obj, func) => {
    let newObj = {};
    Object.keys(obj).forEach(key => {
        newObj[key] = func(obj[key]);
    });
    return newObj;
};

//returns whether a variable is a natural, whether it is a string of digits or Number type.
const isNatural = (check) => {
    check = Number(check);
    return Number.isInteger(check) && check >= 0;
};

/*
    redirects html page to error page, with the received error presented.
    if the error is UNAUTHORIZED (stems from not being logged in) redirects to log in page
 */
const UNAUTHORIZED = 401;
const ERROR_URL = '/error/';
const LOGIN_URL = '/';
const redirectToErrorPage = (error) => {
    if(error.status === UNAUTHORIZED)
        window.location.replace(LOGIN_URL);
    let url = ERROR_URL;
    url += '?';
    url += 'error=' + JSON.stringify(error);
    window.location.replace(url);
}