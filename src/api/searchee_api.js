import uuidv1 from 'uuid/v1';

import api from './api';


const searchee_url = '/searchees/'

const create = (searchee) => {
    return api.request(searchee_url, {
        method: 'POST',
        body: JSON.stringify(searchee)
    })
}

const uploadSample = async (searcheeUrl, imagePath) => {
    var formData = new FormData();

    const name = uuidv1() + '.png'
    formData.append('image', { uri: imagePath, name: name, type: 'image/png' });    

    let uploadUrl = searcheeUrl + 'upload_sample/'

    console.log(searcheeUrl)
    console.log(uploadUrl)

    return fetch(uploadUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        },
        body: formData
    })
    .then(res => res.json())
}

const SearcheeApi = {
    create,
    uploadSample
};

export default SearcheeApi;