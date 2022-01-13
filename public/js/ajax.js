'use strict';

//status check for a response. if response is 2xx it is accepted, otherwise rejected (returns text and status object)
const status = (response) => {
    return (response.status >= 200 && response.status < 300)?
        Promise.resolve(response) : Promise.reject({statusText: response.statusText, status: response.status});
};

//ajax functions module
const ajax = (() => {
    //fetches with status check and displaying loading gif (and removing it after fetch is completed)
    const loading_id = 'loading';
    const loadAndStatusFetch = (url, init = {}) => {
        let loadingElement = document?.getElementById(loading_id);
        loadingElement?.classList?.remove('d-none');
        return fetch(url, init)
            .then(status)
            .finally(() => loadingElement?.classList?.add('d-none'));
    };
    return {fetch: loadAndStatusFetch};
})();