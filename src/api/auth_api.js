import api from './api';

const auth_url = '/users/validate_user/';

const validateUser = (email, password) => {
    return api.request(auth_url, {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        }),
    })
}

const AuthApi = {
    validateUser
}

export default AuthApi;