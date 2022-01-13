'use strict';
const APIKEY = "K92Nno388S69TYpAUyZaIhweT9oQioaW8gdDTzdj";

(() => {
    /*
        validator for searching parameters on nasa mars api.
        Public functions return '' as valid, and error messages as not valid
     */
    const validator = (() => {
        const INVALID_SOL_OR_DATE_ERROR_MSG = 'Please enter a valid date or sol number';
        const INVALID_SOL_FOR_ROVER_ERROR_MSG = 'Must enter sol number less than or equal to ';
        const LATE_DATE_FOR_ROVER_ERROR_MSG = 'Must enter date that is earlier than or equals to '
        const EARLY_DATE_FOR_ROVER_ERROR_MSG = 'Must enter date that is after or equals to '
        const REQUIRED_ERROR_MSG = 'Required';

        const DATE_FORMAT = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

        /*
            An object with a variable for each rover,
            each contains the landing date, max sol number and max date for that rover.

            To initialize this we fetch data from nasa's website manifests about each rover.
            If fetches fails, initializes with default values defined below.
         */
        const MISSIONS_DEFAULT_VALUES = {Curiosity: {landing_date: '2012-08-06', max_sol: 3322, max_date: '2021-12-10'},
            Opportunity: {landing_date: '2004-01-25', max_sol: 5111, max_date: '2018-06-11'},
            Spirit: {landing_date: '2004-01-04', max_sol: 2208, max_date: '2010-03-21'}};
        const MISSIONS_NAMES = ['Curiosity', 'Opportunity', 'Spirit'];
        const MANIFEST_BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1/manifests/';
        const missionsData = (() => {
            let missionsData = {};
            for(const missionName of MISSIONS_NAMES){
                let url = new URL(MANIFEST_BASE_URL + missionName);
                url.searchParams.append('api_key', APIKEY);
                ajax.fetch(url)
                    .then(res => res.json())
                    .then(data => {
                        data = data['photo_manifest'];
                        missionsData[missionName] = {landing_date: data.landing_date,
                            max_sol: data.max_sol,
                            max_date: data.max_date};
                    })
                    .catch(() => missionsData[missionName] = MISSIONS_DEFAULT_VALUES[missionName]);
            }
            return missionsData;
        })();

        //returns whether a string is of valid date format (YYYY-MM-DD)
        const isDateFormat = (date) => {
            return DATE_FORMAT.test(date);
        };

        /*
            Receives a date by year month and day, and returns whether the date is valid (exists).
         */
        const MONTHS_NUMBER_OF_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30 , 31, 30, 31];
        const validateDate = (year, month, day) => {
            if(![year, month, day].every(isNatural))
                return false;
            if(year < 0 || year > 9999)
                return false;
            if(month < 1 || month > 12)
                return false;
            if(day < 1)
                return false;
            if(day > MONTHS_NUMBER_OF_DAYS[month - 1])
                //february exception
                if(!(month === 2 && (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0) && day <= 29))
                    return false;

            return true;
        };


        //returns whether a string is not empty
        const isNonEmpty = (str) => {
            return str.length > 0? '' : REQUIRED_ERROR_MSG;
        };

        //receives string date (format YYYY-MM-DD) and returns whether it's valid
        const validateDateString = (date) => {
            if(!isDateFormat(date))
                return INVALID_SOL_OR_DATE_ERROR_MSG;
            let splitted = date.split('-');
            splitted = splitted.map(num => Number(num));
            return validateDate(...splitted)? '' : INVALID_SOL_OR_DATE_ERROR_MSG;
        };

        //receives rover and sol number, returns whether the sol number doesn't exceed max sol for this rover
        const validateRoverBySol = (rover, sol) => {
            return (sol <= missionsData[rover].max_sol)? '' : INVALID_SOL_FOR_ROVER_ERROR_MSG + missionsData[rover].max_sol;
        };

        /*
            receives rover and date, returns whether the date number doesn't exceed max date for this rover
            and whether the date is not before the rover's landing date
         */
        const validateRoverByDate = (rover, date) => {
            if(date.localeCompare(missionsData[rover].max_date) > 0)
                return LATE_DATE_FOR_ROVER_ERROR_MSG + missionsData[rover].max_date;

            if(date.localeCompare(missionsData[rover].landing_date) < 0)
                return EARLY_DATE_FOR_ROVER_ERROR_MSG + missionsData[rover].landing_date;

            return '';
        }
        return {validateDate: validateDate,
            validateDateString: validateDateString,
            validateRoverBySol: validateRoverBySol,
            validateRoverByDate: validateRoverByDate,
            isNonEmpty: isNonEmpty,
        }
    })();

    document.addEventListener('DOMContentLoaded', () => {
        //pops up already saved modal
        const showAlreadySavedModal = () => {
            let modal = new bootstrap.Modal(document.getElementById('already_saved_modal'));
            modal.show();
        }

        /*
            handler for the saved images list.
            contains function to add and update the images list
         */
        const savedImagesHandler = (() => {
            const DB_IMG_URL = '/images/api/';

            let htmlList = document.getElementById('saved_images');

            /*
                inserts a new image to the html list, with the details of the image,
                a link to full size and a delete button.
             */
            const insertImageToList = (image) => {
                let item = document.createElement('li');
                item.innerHTML = `<a href="${image.url}" target="_blank">Image ID: ${image.img_id}</a>
                        <button class="btn btn-primary" type="button">Delete</button>
                        <br>
                        Earth date: ${image.earth_date}, Sol: ${image.sol}, Rover: ${image.rover}, Camera: ${image.camera}`;
                item.querySelector('button').addEventListener('click', () => deleteImage(image.img_id));
                htmlList.appendChild(item);
            };

            /*
                updates the image list - fetches the image list from the database
                and updates the html list.
             */
            const updateImageList = () => {
                htmlList.innerHTML = '';
                ajax.fetch(DB_IMG_URL)
                    .then(res => res.json())
                    .then(data => data.images)
                    .then(images => images.forEach(insertImageToList))
                    .catch(redirectToErrorPage);
            };

            //deletes an image from the database (and updates the html list)
            const deleteImage = (img_id) => {
                ajax.fetch(DB_IMG_URL + img_id, {method: 'delete'})
                    .then(updateImageList)
                    .catch(redirectToErrorPage);
            };
            /*
                Adds an image to "saved images" list.

                Receives an image, as fetched from the nasa api,
                adds it to the database, and updates the html list.

                If the image is already in the database,
                pops up a modal that informs the user that the image have already been added.
             */
            const addImage = (image) => {
                image = {url: image.img_src, img_id: image.id, earth_date: image.earth_date,
                    sol: image.sol, rover: image.rover.name, camera: image.camera.name}

                ajax.fetch(DB_IMG_URL, {method: 'post', body: JSON.stringify(image), headers: {'Content-Type': 'application/json'}})
                    .then(res => res.json())
                    .then(data => {
                        if(data.success === false)
                            showAlreadySavedModal();

                        else if(data?.error)
                            throw data.error;

                        else
                            updateImageList();
                    })
                    .catch(redirectToErrorPage);
            };
            return {addImage: addImage, updateImageList: updateImageList};
        })();

        const NO_IMAGES_ID = 'no_images';
        const FETCH_ERROR_ID = 'fetch_error';
        const RESULTS_ID = 'results';

        /*
            Validates the input from the user:

            Receives parameters (sol or date, rover, camera) and errors objects,
            and checks:
                1. That the inputs aren't empty.
                2. if it is a sol number, that it's between 0 and the max sol number for that rover.
                3. If it is a date, that it's a valid date and between the landing date and the max date for that rover.

            updates errors accordingly.
        */
        const validate = (parameters, errors) => {
            errors.sol_or_date_error.msg = validator.isNonEmpty(parameters.sol_or_date);
            errors.rover_error.msg = validator.isNonEmpty(parameters.rover);
            errors.camera_error.msg = validator.isNonEmpty(parameters.camera);

            let sol;
            let isSol = isNatural(parameters.sol_or_date);
            if(isSol)
                sol = Number(parameters.sol_or_date);
            else
                errors.sol_or_date_error.msg = validator.validateDateString(parameters.sol_or_date);

            if(Object.values(errors).every(error => (error.msg === '')))
                errors.sol_or_date_error.msg = isSol? validator.validateRoverBySol(parameters.rover, sol) :
                    validator.validateRoverByDate(parameters.rover, parameters.sol_or_date);
        };

        /*
            Searches for pictures of mars using the nasa api.
            Receives either a sol number or a date, which rover, and which camera,
            assuming the inputs are already validated.
            Fetches the pictures that match these parameters.
            Returns a promise that contains the fetched pictures.

            While fetching, a loading gif appears on the screen and disappears after the fetching is complete.
         */
        const BASE_SEARCH_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers/';
        const searchPictures = (sol_or_date, rover, camera) => {
            let url = new URL(BASE_SEARCH_URL + rover + '/photos');
            url.searchParams.append('api_key', APIKEY);
            url.searchParams.append('camera', camera);
            url.searchParams.append(isNatural(sol_or_date)? 'sol' : 'earth_date', sol_or_date);

            return ajax.fetch(url)
                .then(res => res.json())
                .then(results => results['photos']);
        };

        //hides all error messages and results
        const resetForm = (errors) => {
            errorHandler.hideErrors(errors);
            document.getElementById(NO_IMAGES_ID).classList.add('d-none');
            document.getElementById(FETCH_ERROR_ID).classList.add('d-none');
            document.getElementById(RESULTS_ID).innerHTML = '';
        };

        /*
            Receives a parameters object that contains (assuming valid) sol number or date, rover and camera,
            and searches pictures with the nasa mars api with these parameters.
            If any found, displays the pictures on the html,
            with a button for displaying the picture in full size
            and a button to add the picture to the 'saved images' list.

            If no pictures are found, displays a no picture note.
            If fetch has failed, displays a 'couldn't reach nasa' error.
         */
        const searchAndDisplayPictures = (parameters) => {
            let resultsDiv = document.getElementById(RESULTS_ID);
            resultsDiv.innerHTML = '';
            searchPictures(parameters.sol_or_date, parameters.rover, parameters.camera).then((results) => {
                if(results.length > 0){
                    results.forEach((res) => {
                        let resDiv = document.createElement('div');
                        resDiv.className = "col-12 col-sm-6 col-md-4 col-lg-3 justify-content-center d-flex align-items-center my-3";
                        resDiv.innerHTML = `<div class="border rounded">
                                    <img class="img-thumbnail" src="${res['img_src']}" alt="${res['id']}">
                                    <div class="mx-2">
                                        <h6>Earth date: ${res['earth_date']}</h6>
                                        <h6>Sol: ${res['sol']}</h6>
                                        <h6>Camera: ${res['camera']['name']}</h6>
                                        <h6>Mission: ${res['rover']['name']}</h6>
                                    </div>
                                    <div>
                                        <button class="btn btn-info btn-lg m-2">Save</button>
                                        <a class="btn btn-primary btn-lg m-2" href="${res['img_src']}" target="_blank">Full Size</a>
                                    </div>
                                </div>`;
                        resDiv.querySelector('button').addEventListener('click', () => {
                            savedImagesHandler.addImage(res);
                        });
                        resultsDiv.appendChild(resDiv);
                    });
                }
                else
                    document.getElementById(NO_IMAGES_ID).classList.remove('d-none');
            })
                .catch(() => {
                    document.getElementById(FETCH_ERROR_ID).classList.remove('d-none');
                });
        };

        //initiated errors handler with 3 errors, each for each input
        let errors = errorHandler.initErrors();
        savedImagesHandler.updateImageList();
        //adds to the reset button to also hide the error messages
        document.addEventListener('reset', () => resetForm(errors));

        /*
            once the submit button is hit, the inputs are taken from the form,
            and are validated.

            If the inputs are valid, searches the pictures and displays them on the html.
            If not, displays error messages close to the inputs.
         */
        document.addEventListener('submit', (event) => {
            event.preventDefault();
            resetForm(errors);
            let form = document.querySelector('form');
            let formData = new FormData(form);
            let parameters = Object.fromEntries(formData.entries());
            parameters.sol_or_date = parameters.sol_or_date.trim();
            validate(parameters, errors);
            if(!errorHandler.areThereErrors(errors)){
                form.reset();
                searchAndDisplayPictures(parameters);
            }
            else
                errorHandler.showErrors(errors);
        });
    });
})();