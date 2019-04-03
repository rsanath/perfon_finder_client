import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import t from 'tcomb-form-native';
import moment from 'moment';

import Button from '../components/solid_button';
import appStyles from '../styles/style';
import AuthApi from '../../api/auth_api';
import session from '../../session';

const Form = t.form.Form;


export const LoginStructure = t.struct({
    email_id: t.String,
    password: t.String
});

export const LoginOptions = {
    fields: {
        email_id: {
            label: 'Email Address'
        },
        password: {
            password: true,
            secureTextEntry: true
        }
    }
};


export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    async onSubmitForm() {
        const input = this.refs.form.getValue();
        
        if (!input) return;
    
        try {
          const resp = await AuthApi.validateUser(input.email_id, input.password);
          console.log(resp)
          const {data} = resp;
          if (data) {
            session.setCurrentUser(data);
            this._loginUser(data)
          }
        }
        catch (e) {
          Alert.alert("Something went wrong", e.message)
          console.log(e)
        }
      }
    
      _loginUser(user) {
        this.props.navigation.navigate('App')
      }
    

    render() {
        return (
            <View style={appStyles.screen} >
                <Form
                    ref="form"
                    type={LoginStructure}
                    options={LoginOptions}
                />
                <Button onPress={this.onSubmitForm.bind(this)} >Login</Button>
            </View>
        );
    }
}


const styles = StyleSheet.create({

});