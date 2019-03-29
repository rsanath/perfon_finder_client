import api from './api';

export const create = complaint => {
    return api.request('/complaints/', {
        method: 'POST',
        body: JSON.stringify(complaint),
    })
}

const ComplaintApi = {
    create,
}

export default ComplaintApi;