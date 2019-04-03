import React, { Component } from 'react';
import {
    View, ImageBackground,
    Image,
    Text, StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView
} from 'react-native';
import Button from '../components/outline_button';
import AuthApi from '../../api/auth_api';
import appStyles from '../styles/style';
import LoginScren from './login_screen';
import SignupScren from './signup_screen';

import session from '../../session';


export default class AuthScreen extends Component {

    LOGIN_SCREEN = 'Login'
    SIGNUP_SCREEN = 'Signup'

    constructor(props) {
        super(props);
        this.state = {
            currentForm: 'Login'
        }
    }

    async componentWillMount() {
        const currentUser = await session.getCurrentUser();
        if (currentUser) {
            this.props.navigation.navigate('App')
        }
    }

    _getForm() {
        if (this.state.currentForm == this.LOGIN_SCREEN) {
            return <LoginScren navigation={this.props.navigation} />
        } else if (this.state.currentForm == this.SIGNUP_SCREEN) {
            return <SignupScren navigation={this.props.navigation} />
        }
    }

    _onSwitchForm() {
        const currentForm = this.state.currentForm == this.LOGIN_SCREEN ?
            this.SIGNUP_SCREEN : this.LOGIN_SCREEN;

        this.setState({ currentForm })
    }

    render() {
        return (
            <View style={appStyles.screen} >

                <Image
                    resizeMode={'stretch'}
                    style={{ height: 150, position: 'absolute', top: 0, left: 0, right: 0 }}
                    source={require('../../assets/bg.png')} >
                </Image>

                <View style={styles.header} >
                    <Text style={{ ...styles.heading, fontSize: 30 }} >
                        {this.state.currentForm == this.LOGIN_SCREEN ? 'Login' : "Sign Up"}
                    </Text>
                    <Text style={styles.heading} >Person Finder</Text>
                </View>

                <ScrollView>
                    <View style={styles.form} >
                        {this._getForm()}
                    </View>
                </ScrollView>

                <TouchableOpacity
                    onPress={this._onSwitchForm.bind(this)} >
                    <Text style={{
                        fontSize: 17,
                        margin: 4,
                        textAlign: 'center'
                    }} >{this.state.currentForm == this.LOGIN_SCREEN ? 'Or Register' : 'Or Login'}</Text>
                </TouchableOpacity>

            </View >
        );
    }
}

const styles = StyleSheet.create({
    textInput: {
        borderRadius: 3,
        borderWidth: 1,
        borderColor: 'grey',
        marginVertical: 5,
        padding: 5
    },
    submitButton: {
        flex: 1
    },
    form: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        margin: 5,
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black'
    }
});
