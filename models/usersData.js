module.exports = class User{
    constructor(first_name, last_name, email, password) {
            let validationMessageUser = User.validate(first_name, last_name, email, password);
            if(validationMessageUser !== '')
                throw validationMessageUser;

            this.first_name = first_name;
            this.last_name = last_name;
            this.email = email;
            this.password = password;
    }

    static validate(first_name, last_name, email, password){
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

    static doesExist(email){
        return !!User.get(email);
    }

    static add(email, first_name, last_name, password){
        users.push(new User(first_name, last_name, email, password));
        console.log(users);
    }
};

let users = [];