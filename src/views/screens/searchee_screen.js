import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import t from 'tcomb-form-native';

const Form = t.form.Form;

export const SearcheeStructure = t.struct({
    full_name: t.String,
    dob: t.Date,
    sex: t.String,
    height_cm: t.String,
    weight_kg: t.String,
    skin_tone: t.String,
});

export const SearcheeOptions = {
    fields: {
        full_name: {
            editable: false,
            label: 'Searchee Name'
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
            label: 'Height'
        },
        weight_kg: {
            editable: false,
            label: 'Weight'
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
        this.state = {
        };
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
        const searchee = this.props.navigation.getParam('searchee');
        return (
            <View style={styles.container} >
                 <Form
                        value={{ ...searchee}}
                        ref="form"
                        type={SearcheeStructure}
                        options={SearcheeOptions}
                    />
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