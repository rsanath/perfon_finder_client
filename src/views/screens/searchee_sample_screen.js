import React, { Component } from 'react';
import { View, Text, Alert, ToastAndroid, Modal, FlatList, Image, Dimensions } from 'react-native';
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



export default class SearcheeSamplesScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const searchee = navigation.getParam('searchee');
        return {
            headerTitle: 'Images of ' + searchee.full_name
        };
    };

    constructor(props) {
        super(props);
        const searchee = props.navigation.getParam('searchee');

        this.state = {
            searchee,
            samples: [],

            modalVisible: false,
            currentFile: '',
            percentageCompleted: 0.0,
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
            this.setState({ currentFile, percentageCompleted, uploadedCount: uploadedSamples.length })

            try {
                const sample = await SearcheeApi.uploadSample(this.state.searchee.url, uri);
                uploadedSamples.push(sample);
            }
            catch (e) {
                console.log(e);
                ToastAndroid.show('Failed to upload ' + currentFile, ToastAndroid.SHORT);
            }
        }
        this.setState({ modalVisible: false })
        this._fetchSamples();
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
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this._fetchSamples();
            }
        );
    }

    async _fetchSamples() {
        let { searchee } = this.state;
        try {
            const samples = await SearcheeApi.getSampleImages(searchee.url);
            this.setState({ samples })
        } catch (e) {
            ToastAndroid.show('Unable to refresh the data. Try later', ToastAndroid.SHORT)
            console.log(e)
        }
    }

    _renderUploadModal() {
        const { totalCount, uploadedCount, percentageCompleted } = this.state;
        return (
            <Modal
                transparent={true}
                visible={this.state.modalVisible} >
                <View style={styles.modalBg} >
                    <View style={styles.uploadDialog} >
                        <Text style={styles.uploadMessage} >{'Uploading ' + this.state.currentFile}</Text>
                        <Progress.Bar progress={percentageCompleted} width={null} />
                        <Text style={styles.uploadMessage} >{`${uploadedCount} / ${totalCount}`}</Text>
                    </View>
                </View>
            </Modal>
        )
    }

    _renderSamples({ item, index }) {
        let dim = Dimensions.get('window').width / 2 - 20;

        return (
            <Image
                key={item}
                style={{
                    width: dim,
                    height: dim,
                    borderWidth: 1,
                    borderColor: 'lightgrey'
                }}
                source={{ uri: item }}
            />
        )
    }

    render() {
        return (
            <View style={appStyles.screen} >
                <Button onPress={this.showImagePicker.bind(this)} >Upload Images</Button>
                {this._renderUploadModal()}
                <Text style={styles.heading} >Submitted Images</Text>
                <FlatList
                    numColumns={2}
                    data={this.state.samples}
                    renderItem={this._renderSamples}
                />
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
    },
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black'
    }
}