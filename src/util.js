import { AsyncStorage } from 'react-native';

const storage = {
    set: async function (key, value) {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },
    get: async function (key) {
        try {
            const result = await AsyncStorage.getItem(key);
            if (!result) return undefined;

            return JSON.parse(result);
        } catch (error) {
            console.error(error);
            return undefined;
        }
    },
    remove: async function (key) {
        await AsyncStorage.removeItem(key);
    }
}

const allEditable = (options) => {
    Object.keys(options.fields).forEach(field => {
        options.fields[field].editable = true;
    })
    return options;
}

const util = {
    storage,
    allEditable
};

export default util;