import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import t from 'tcomb-form-native';
import moment from 'moment';

import Button from '../components/solid_button';
import util from '../../util';


const Form = t.form.Form;

export const SearcheeStructure = t.struct({
    full_name: t.String,
    dob: t.Date,
    sex: t.enums({
        'MALE': 'Male',
        'FEMALE': 'Female',
        'NON_BINARY': 'Non Binary'
    }, 'Gender'),
    height_cm: t.Number,
    weight_kg: t.Number,
    skin_tone: t.enums({
        'ST_LIGHT': 'Light',
        'ST_MEDIUM': 'Medium',
        'ST_DARK': 'Dark'
    }, 'Skin Tone'),
});

export const SearcheeOptions = {
    fields: {
        full_name: {
            editable: false,
            label: 'Missing Person Name'
        },
        dob: {
            editable: false,
            label: 'Date of Birth',
            mode: 'date',
            config: {
                format: date => moment(date).format("DD MMM YYYY")
            }
        },
        sex: {
            editable: false,
            label: 'Gender'
        },
        height_cm: {
            editable: false,
            label: 'Height in cm'
        },
        weight_kg: {
            editable: false,
            label: 'Weight in kg'
        },
        skin_tone: {
            editable: false,
            label: 'Skin Tone'
        }
    }
};

export default class SearcheeScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('searchee').full_name
        };
    };

    constructor(props) {
        super(props);
        const searchee = props.navigation.getParam('searchee');
        this.state = {
            searchee,
            samples: []
        };
    }

    componentWillMount() {
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this._fetchSamples();
            }
        );
    }

    async _fetchSamples() {
        let searchee = this.state.searchee;
        searchee = await fetch(searchee.url);
        searchee = await searchee.json();

        const { samples } = searchee;

        console.log('fetched sample ', samples);
        this.setState({ samples })
    }

    _renderInfo(label, value) {
        return (
            <View style={styles.info} >
                <Text style={styles.label} >{label}</Text>
                <Text style={styles.value} >{value || 'Not Provided'}</Text>
            </View>
        )
    }

    render() {
        const { navigate } = this.props.navigation;
        const { searchee } = this.state;

        return (
            <View style={styles.container} >
                <Form
                    value={{ ...searchee, dob: new Date(searchee.dob) }}
                    ref="form"
                    type={SearcheeStructure}
                    options={util.allEditable(SearcheeOptions, false)}
                />
                <Button onPress={() => navigate('NewSearcheeSamples', {searchee})}>
                    Upload Images
                </Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'grey'
    },
    value: {
        fontSize: 18,
        color: 'black'
    },
    container: {
        flex: 1,
        padding: 20,
    },
    info: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        paddingVertical: 10,
        justifyContent: 'space-between'
    },
})