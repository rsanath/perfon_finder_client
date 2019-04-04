import React, { Component } from 'react';
import { View, Text, Alert, ToastAndroid, Modal } from 'react-native';
import t from 'tcomb-form-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import * as Progress from 'react-native-progress';

import SearcheeApi from '../../api/searchee_api';
import appStyles from '../styles/style';
import Button from '../components/solid_button';
import util from '../../util';

const Form = t.form.Form;



export default class NewSearcheeSamplesScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const searchee = navigation.getParam('searchee');
        return {
            headerTitle: 'Images for ' + searchee.full_name
        };
    };

    constructor(props) {
        super(props);
        const searchee = props.navigation.getParam('searchee');

        this.state = {
            searchee,

            modalVisible: true,
            currentFile: '',
            percentageCompleted: 0.5,
            uploadedCount: 0,
            totalCount: 0
        };
    }

    async _uploadImages(images) {
        this.setState({ modalVisible: true, totalCount: images.length })
        const uris = images.map(i => i.path);

        const uploadedSamples = [];
        
        for (let i in uris) {
            const uri = uris[i];

            let currentFile = util.baseUri(uri);
            let percentageCompleted = util.normalize(uploadedSamples.length, uris.length, 0)
            this.setState({currentFile, percentageCompleted, uploadedCount: uploadedSamples.length})

            try {
                const sample = await SearcheeApi.uploadSample(this.state.searchee.url, uri);
                uploadedSamples.push(sample);
            } 
            catch(e) {
                console.log(e);
                ToastAndroid.show('Failed to upload ' + currentFile, ToastAndroid.SHORT);
            }
        }
        this.setState({ modalVisible: false })
    }

    showImagePicker() {
        ImagePicker
            .openPicker({
                multiple: true,
                mediaType: 'photo'
            }
            ).then(this._uploadImages.bind(this))
            .catch(e => {

            });
    }

    componentDidMount() {
        this.showImagePicker()
    }

    _renderUploadModal() {
        const { totalCount, uploadedCount} = this.state;
        return (
            <Modal
                onRequestClose={() => this.setState({ modalVisible: false })}
                transparent={true}
                visible={this.state.modalVisible} >
                <View style={styles.modalBg} >
                    <View style={styles.uploadDialog} >
                        <Text style={styles.uploadMessage} >{'Uploading ' + this.state.currentFile}</Text>
                        <Progress.Bar progress={this.state.percentageCompleted} width={null} />
                        <Text style={styles.uploadMessage} >{`${uploadedCount} / ${totalCount}`}</Text>
                    </View>
                </View>
            </Modal>
        )
    }

    render() {
        return (
            <View style={appStyles.screen} >
                {this._renderUploadModal()}
            </View>
        );
    }
}


const styles = {
    modalBg: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadDialog: {
        margin: 10,
        padding: 20,
        borderRadius: 5,
        backgroundColor: '#ffffff',
    },
    uploadMessage: {
        fontSize: 20,
        color: 'black',
        margin: 10
    }
}