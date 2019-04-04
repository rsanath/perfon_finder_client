import React, { Component } from 'react';
import { View, Text, Alert, ToastAndroid } from 'react-native';
import t from 'tcomb-form-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import { SearcheeOptions, SearcheeStructure } from './searchee_screen';
import appStyles from '../styles/style';
import Button from '../components/solid_button';
import util from '../../util';
import SearcheeApi from '../../api/searchee_api';

const Form = t.form.Form;


export default class NewSearcheesScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Add Missing Person'
        };
    };

    constructor(props) {
        super(props);
        const complaint = props.navigation.getParam('complaint');

        this.state = {
            complaint
        };
    }

    _onPressSubmit() {
        var input = this.refs.form.getValue();

        if (!input) return;
        input = util.clone(input);

        input.dob = moment(input.dob).format("YYYY-MM-DD");
        input.complaint = this.state.complaint.url;
        input.searches = [];
        input.samples = [];

        console.log('submitting searchee', input)
        console.log(JSON.stringify(input))

        SearcheeApi.create(input)
            .then(res => {
                ToastAndroid.show('Successfully Created', ToastAndroid.LONG);
                this.props.navigation.pop();
            })
            .catch(e => {
                console.log(e)
                Alert.alert('Something went wrong', e.message);
            });
    }

    render() {
        return (
            <View style={appStyles.screen} >
                <Form
                    ref="form"
                    type={SearcheeStructure}
                    options={util.allEditable(SearcheeOptions)}
                />
                <Button onPress={this._onPressSubmit.bind(this)} >
                    Proceed
                </Button>
            </View>
        );
    }
}
