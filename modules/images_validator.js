//validator for images database
const images_validator = (() => {
    const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //receives image parameters and returns if they are valid
    const validate = (parameters) => {
        console.log(isUrlValid(parameters.url), isNatural(parameters.img_id), isNatural(parameters.sol),
            isString(parameters.rover), isString(parameters.camera), isEmailFormat(parameters.email));
        return isUrlValid(parameters.url) && isNatural(parameters.img_id) && isNatural(parameters.sol) &&
            isString(parameters.rover) && isString(parameters.camera) && isEmailFormat(parameters.email);
    };

    //returns whether a string is of a url format
    const isUrlValid = (str) => {
        try{
            new URL(str);
        }
        catch{
            return false;
        }
        return true;
    };

    //returns whether a variable is a natural, whether it is a string of digits or Number type.
    const isNatural = (check) => {
        check = Number(check);
        return Number.isInteger(check) && check >= 0;
    };

    //returns whether a variable is a string.
    const isString = (check) => {
        return typeof check === 'string';
    };

    //returns whether a string of an email format
    const isEmailFormat = (str) => {
        return EMAIL_FORMAT.test(str);
    };

    return {validate: validate};
})();

module.exports = images_validator;
