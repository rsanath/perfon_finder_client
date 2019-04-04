import AsyncStorage from '@react-native-community/async-storage';

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

/*
Helper for t-comb-form
*/
const allEditable = (options, flag = true) => {
    Object.keys(options.fields).forEach(field => {
        options.fields[field].editable = flag;
    })
    return options;
}

/*
Helper for t-comb-form
*/
const optionsForList = options => {
    Object.keys(options.fields).forEach(k => {
        let val = options.fields[k];
        options.fields[k].item = val;
    })
    console.log(options);
    return options;
}

const clone = (a) => {
    const b = {};
    Object.keys(a).forEach(key => {
        b[key] = a[key];
    })
    return b;
}

const baseUri = uri => {
    const segments = uri.split('/');
    return segments[segments.length - 1];
}

const normalize = (val, max, min) => (val - min) / (max - min);

const util = {
    storage,
    allEditable,
    optionsForList,
    clone,
    normalize,
    baseUri
};

export default util;