import util from './util';

const USER_KEY = 'current_user'

const session = {
    getCurrentUser: async () => {
        return await util.storage.get(USER_KEY);
    },

    setCurrentUser: user => {
        return util.storage.set(USER_KEY, user)
    },
}

export default session;