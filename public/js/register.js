'use strict';
(() => {
    const status = (response) => {
        return (response.status >= 200 && response.status < 300)?
            Promise.resolve(response) : Promise.reject(new Error(response.statusText));
    };

    const checkIfEmailExists = (email) => {
        return fetch('/api/' + email)
            .then(status)
            .then(res => res.json())
            .then(res => res.email === email)
            .catch((error) => console.log(error));
    };

    document.addEventListener('DOMContentLoaded', () =>{
        document.addEventListener('submit', (event) => {
            event.preventDefault();

            let email_error = document.getElementById('email_error');
            email_error.classList.add('d-none');

            let form = document.querySelector('form');
            let formData = new FormData(form);
            let parameters = Object.fromEntries(formData);
            Object.keys(parameters).forEach(key => parameters[key] = parameters[key].toLowerCase());

            let doesExists = checkIfEmailExists(parameters.email);
            doesExists.then((doesExists) => {
                if(!doesExists){
                    form.submit();
                }
                else{
                    email_error.innerHTML = 'This email is already in use';
                    email_error.classList.remove('d-none');
                }
            });


            //console.log(doesExists);
        });
    });
})();