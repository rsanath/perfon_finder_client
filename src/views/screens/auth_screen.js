import React, { Component } from 'react';
import {
  View, ImageBackground,
  Text, StyleSheet,
  TextInput, TouchableOpacity
} from 'react-native';
import Button from '../components/outline_button';
import AuthApi from '../../api/auth_api';

import session from '../../session';


export default class AuthScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null
    };
  }

  async componentWillMount() {
    const currentUser = await session.getCurrentUser();
    if (currentUser) {
      this._loginUser(currentUser)
    }
  }

  async onSubmitForm() {
    const { email, password } = this.state;
    try {
      const resp = await AuthApi.validateUser(email, password);
      if (resp.complaints) {
        session.setCurrentUser(resp);
        this._loginUser(resp)
      }
    }
    catch (e) {
      alert("Something went wrong. Please try later")
      console.log(e)
    }
  }

  _loginUser(user) {
    this.props.navigation.navigate('App')
  }

  render() {
    return (
      <View style={styles.container} >

        <ImageBackground
          resizeMode={'stretch'}
          style={{ width: '100%', height: '70%' }}
          source={require('../../assets/bg.png')} >
          <View style={styles.header} >
            <Text style={{ ...styles.heading, fontSize: 30 }} >Login</Text>
            <Text style={styles.heading} >Person Finder</Text>
          </View>
        </ImageBackground>

        <View style={styles.form} >
          <TextInput
            placeholder={'Email Id'}
            onChangeText={text => this.setState({ email: text })}
            style={styles.textInput}
          />
          <TextInput
            placeholder={'Password'}
            onChangeText={text => this.setState({ password: text })}
            style={styles.textInput}
          />
          <Button
            style={styles.submitButton}
            title={'Login'}
            onPress={this.onSubmitForm.bind(this)}
          />
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
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
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    margin: 15,
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black'
  }
});
