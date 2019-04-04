import React, { Component } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity, ToastAndroid } from 'react-native';
import t from 'tcomb-form-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';

import appStyles from '../styles/style';
import Button from '../components/solid_button';
import util from '../../util';
import ComplaintApi from '../../api/complaint_api';
import { ComplaintOptions, ComplaintStructure } from './complaint_screen';


const Form = t.form.Form;


export default class NewComplaintScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'New Complaint',
        };
    };

    constructor(props) {
        super(props);
        const user = props.navigation.getParam('user');
        this.state = {
            user,
            firUrl: null,
            firLabel: 'Upload FIR Document'
        }
    }

    async _createNewComplaint(complaint) {
        this.props.onStartRequest && this.props.onStartRequest()

        ComplaintApi.create(complaint)
            .then(res => {
                this.props.onEndRequest && this.props.onEndRequest(res)
                this.props.navigation.pop();
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

        if (this.state.firUrl == null) {
            ToastAndroid.show('Please upload the FIR document', ToastAndroid.LONG);
            return;
        }
        if (!complaint) return;

        complaint = util.clone(complaint);
        complaint.doi = moment(complaint.doi).format("YYYY-MM-DD")
        complaint.fir_url = this.state.firUrl;
        complaint.submitter = this.state.user.url;
        complaint.searchees = [];

        console.log(complaint)

        this._createNewComplaint(complaint);
    }

    async _uploadFir() {
        const image = await ImagePicker.openPicker({ mediaType: 'photo' })
        let uri = image.path;
        let fileName = util.baseUri(uri);

        this.setState({ firLabel: 'Uploading...' })
        ComplaintApi.uploadFir(uri)
            .then(url => {
                this.setState({ firLabel: fileName, firUrl: url })
            })
            .catch(e => {
                Alert.alert('Something went wrong', 'Unable to upload the document.\nPlease try later')
                console.log(e)
                this.setState({ firLabel: 'Upload FIR Document' })
            })
    }

    _renderFirUploadButton() {
        return (
            <View>
                <TouchableOpacity onPress={this._uploadFir.bind(this)} >
                    <Text style={{
                        fontSize: 18,
                        color: 'black',
                        textAlign: 'center',
                        marginVertical: 15,
                    }} >
                        {this.state.firLabel}
                    </Text>
                </TouchableOpacity>
            </View>
        )
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
                        <Text style={styles.firLabel} >FIR Document</Text>
                        {this._renderFirUploadButton()}
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

const styles = {
    firLabel: { fontSize: 17, color: 'black', fontWeight: 'bold', textAlign: 'left' }
}