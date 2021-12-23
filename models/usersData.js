module.exports = class User{
    constructor(email, first_name, last_name, password) {
            let validationMessageUser = User.validate(email, first_name, last_name, password);
            if(validationMessageUser !== '')
                throw validationMessageUser;

            this.email = email;
            this.first_name = first_name;
            this.last_name = last_name;
            this.password = password;
    }

    static validate(email, first_name, last_name, password){
        if(!([email, first_name, last_name, password].every(arg => typeof arg === 'string')))
            return 'Parameters are not strings';
        if(!/^.+@.+\..+$/.test(email))
            return 'Email is not in an email format';
        if(!/^[A-Za-z]+$/.test(first_name))
            return 'First name contain non-letters';
        if(!/^[A-Za-z]+$/.test(last_name))
            return 'Last name contain non-letters';
        if(!/.{8,}/.test(password))
            return 'Password contains less than 8 letters';
        if(User.get(email) !== undefined)
            return 'Email is already in use';
        return '';
    }

    static get(email){
        return users.find(user => user.email === email);
    }

    static add(email, first_name, last_name, password){
        users.push(new User(email, first_name, last_name, password));
    }
};

let users = [];