const config = {
    // baseUrl: 'https://kodona.herokuapp.com'
    baseUrl: 'http://10.0.2.2:8000'
    // baseUrl: 'http://192.168.43.138:8000'
}

const request = (url, options) => {
    console.log(config.baseUrl + url)
    return fetch(
        config.baseUrl + url,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            ...options
        }
    )
    .then(r => {
        if (!r.ok) throw new Error('The request was not successful');
        return r;
    })
    .then(response => response.json())
}

const api = {
    request,
    config
}

export default api;