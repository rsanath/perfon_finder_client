const config = {
    // baseUrl: 'https://kodona.herokuapp.com'
    // baseUrl: 'http://10.0.2.2:8000'
    // baseUrl: 'http://192.168.43.138:8000'
    // baseUrl: 'http://localhost:8000'
    // baseUrl: 'http://kodona.appspot.com'
    baseUrl: 'http://euler.newgen.co/kodona'
};

const request = (url, options) => {
    console.log(config.baseUrl + url);
    return fetch(config.baseUrl + url, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        ...options
    }).then(async res => {
        const body = await res.text();
        console.log(body);
        const json = JSON.parse(body);
        if (res.ok) {
            return json;
        } else {
            throw new Error(json.message || JSON.stringify(json));
        }
    });
};

const api = {
    request,
    config
};

export default api;
