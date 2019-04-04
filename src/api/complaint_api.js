import uuidv1 from 'uuid/v1';
import api from './api';

const create = complaint => {
    return api.request('/complaints/', {
        method: 'POST',
        body: JSON.stringify(complaint),
    })
}

const uploadFir = path => {
    var formData = new FormData();

    const name = uuidv1() + '.png'
    formData.append('image', { uri: path, name: name, type: 'image/png' });

    let uploadUrl = '/complaints/upload_fir/'

    return api.request(uploadUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        },
        body: formData
    })
}

const ComplaintApi = {
    create,
    uploadFir
}

export default ComplaintApi;