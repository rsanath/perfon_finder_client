import React, { Component } from 'react';
import { View, Text } from 'react-native';
import t from 'tcomb-form-native';

import appStyles from '../styles/style';
import Button from '../components/solid_button';
import util from '../../util';
import { ComplaintOptions, ComplaintStructure } from './complaint_screen';


const Form = t.form.Form;


export default class ComplaintCreationScreen extends Component {
    constructor(props) {
        super(props);
        this.complaintStructure = ComplaintStructure;
        this.complaintStructure.fields.name.hidden = true;
    }

    render() {
        return (
            <View style={appStyles.screen} >
                <Form
                    ref="form"
                    type={this.complaintStructure}
                    options={util.allEditable(ComplaintOptions)}
                />
                <Button onPress={() => {}} >Submit Complatint</Button>
            </View>
        );
    }
}
