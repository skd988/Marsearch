'use strict';
(() => {
    document.addEventListener('DOMContentLoaded', () =>{
        document.addEventListener('submit', (event) => {
            event.preventDefault();

            let password_conf_error = document.getElementById('password_conf_error');
            password_conf_error.classList.add('d-none');

            let form = document.querySelector('form');
            let formData = new FormData(form);
            let parameters = Object.fromEntries(formData);

            if(parameters.password === parameters.password_confirmation){
                form.submit();
            }
            else{
                password_conf_error.classList.remove('d-none');
            }
        });
    });
})();