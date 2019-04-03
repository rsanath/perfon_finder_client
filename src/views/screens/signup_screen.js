import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import t from 'tcomb-form-native';
import moment from 'moment';

import Button from '../components/solid_button';
import appStyles from '../styles/style';
import AuthApi from '../../api/auth_api';
import session from '../../session';
import util from '../../util';


const Form = t.form.Form;

const genders = t.enums({
    MALE: 'Male',
    FEMALE: 'Female',
    NON_BINARY: 'Non Binary'
});

export const UserStructure = t.struct({
    full_name: t.String,
    email_id: t.String,
    ph_num: t.String,
    password: t.String,
    sex: genders,
    address: t.maybe(t.String),
    dob: t.Date,
});

export const UserOptions = {
    fields: {
        full_name: {
            label: 'Your Name'
        },
        email_id: {
            label: 'Email Address'
        },
        ph_num: {
            label: 'Phone Number'
        },
        password: {
            password: true,
            secureTextEntry: true
        },
        dob: {
            label: 'Date of Birth',
            mode: 'date',
            config: {
                format: date => moment(date).format("DD MMM YYYY")
            }
        },
        sex: {
            label: 'Gender'
        },
        address: {
            label: 'Residential Address',
            multiline: true,
            config: {
                numberOfLines: 3
            }
        }
    }
};


export default class SignupScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    _register() {
        const input = this.refs.form.getValue();

        if (!input) return;

        const user = util.clone(input);
        user.dob = moment(input.dob).format("YYYY-MM-DD")
        user.complaints = [];

        console.log(user)

        AuthApi.createUser(user)
            .then(res => {
                session.setCurrentUser(res.data)
                this.props.navigation.navigate('App')
            })
            .catch(e => Alert.alert('Something went wrong', e.message))
    }

    render() {
        return (
            <View style={appStyles.screen} >
                <Form
                    value={{}}
                    ref="form"
                    type={UserStructure}
                    options={UserOptions}
                />
                <Button onPress={this._register.bind(this)} >Register</Button>
            </View>
        );
    }
}


const styles = StyleSheet.create({

});