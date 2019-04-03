import api from './api';

const auth_url = '/users/validate_user/';
const users_url = '/users/';

const validateUser = (email, password) => {
    return api.request(auth_url, {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        }),
    })
}

const createUser = (user) => {
    return api.request(users_url, {
        method: 'POST',
        body: JSON.stringify(user)
    })
}

const AuthApi = {
    validateUser,
    createUser
}

export default AuthApi;