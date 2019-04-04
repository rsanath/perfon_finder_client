import React, { Component } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import t from 'tcomb-form-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import appStyles from '../styles/style';
import Button from '../components/solid_button';
import util from '../../util';
import ComplaintApi from '../../api/complaint_api';
import { ComplaintOptions, ComplaintStructure } from './complaint_screen';


const Form = t.form.Form;


export default class NewComplaintScreen extends Component {
    
    async _createNewComplaint(complaint) {
        this.props.onStartRequest && this.props.onStartRequest()
        
        ComplaintApi.create(complaint)
            .then(res => {
                this.props.onEndRequest && this.props.onEndRequest(res)
                alert('Successfully Created')
            })
            .catch(e => {
                this.props.onEndRequest && this.props.onEndRequest(null)
                console.log(e)
                Alert.alert('Something went wrong', e.message)
            })
    }

    async _onPressSubmit() {
        let complaint = this.refs.form.getValue();
        
        console.log('Registering complaint', complaint)

        if (!complaint) return;
        
        complaint = util.clone(complaint);
        complaint.doi = moment(complaint.doi).format("YYYY-MM-DD")
        complaint.submitter = this.props.user.url;
        complaint.searchees = [];

        console.log(complaint)

        this._createNewComplaint(complaint);
    }

    render() {
        return (
            <View style={appStyles.screen} >
                <ScrollView>
                    <View>
                        <Form
                            ref="form"
                            type={ComplaintStructure}
                            options={util.allEditable(ComplaintOptions)}
                        />
                        <Button onPress={this._onPressSubmit.bind(this)}>Proceed</Button>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

NewComplaintScreen.propTypes = {
    onStartRequest: PropTypes.func,
    onEndRequest: PropTypes.func
}