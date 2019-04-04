import api from './api';

const create = search => {
    return api.request('/searches/', {
        method: 'POST',
        body: JSON.stringify(search)
    })
}

const SearchApi = {
    create
}

export default SearchApi;