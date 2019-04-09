import api from './api';

const create = search => {
    return api.request('/searches/', {
        method: 'POST',
        body: JSON.stringify(search)
    })
}

const results = search => {
    let url = search.url + 'results/';
    console.log(url);
    return fetch(url).then(r => r.json());
}

const SearchApi = {
    create,
    results
}

export default SearchApi;