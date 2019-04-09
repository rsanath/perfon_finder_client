import uuidv1 from 'uuid/v1';
import React, { Component } from 'react';
import {
    View, Text,
    StyleSheet, 
    TouchableOpacity,
    Modal, 
    Image,
    ToastAndroid,
    ScrollView,
    Alert,
    Clipboard
} from 'react-native';
import t from 'tcomb-form-native';
import moment from 'moment';

import appStyles from '../styles/style';
import session from '../../session';
import util from '../../util';
import Button from '../components/solid_button';
import SearchApi from '../../api/search_api';

const Form = t.form.Form;


export const SearchStructure = t.struct({
    video_url: t.String,
    location: t.String,
    name: t.maybe(t.String)
});

export const SearchOptions = {
    fields: {
        video_url: {
            label: 'Video Url',
            placeholder: 'www.example.com/video.mp4'
        },
        location: {
            label: 'Location in the video'
        },
        name: {
            label: 'Name to identify this search later',
            placeholder: 'Eg: CCTV Search #1'
        }
    }
}

export default class NewSearchScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Search for ' + navigation.getParam('searchee').full_name
        };
    };

    constructor(props) {
        super(props);
        const searchee = props.navigation.getParam('searchee');
        this.state = {
            searchee,
            value: {
                video_url: null
            }
        };
    }

    async _pasteClipboardContent() {
        this.setState({
            value: {
                video_url: await Clipboard.getString()
            }
        })
    }

    _createSearch() {
        let search = this.refs.form.getValue();
        const { searchee } = this.state;

        if (!search) return;
        search = util.clone(search)
        search.searchee = searchee.url;
        search.results = [];
        search.name = search.name || uuidv1();

        SearchApi.create(search)
            .then(res => {
                ToastAndroid.show('Successfully Created', ToastAndroid.SHORT);
                this.props.navigation.pop();
            })
            .catch(e => {
                console.log(e)
                Alert.alert('Something went wrong', e.message);
            })
    }

    _renderHeaderCard() {
        return (
            <View style={styles.headerCard} >
                <Text style={styles.heading}>How It Works</Text>
                <Text style={styles.subHead}>Provide us a video to search in the intended person</Text>
                <Text style={styles.subHead}>We will try to spot the person in the video</Text>
                <Text style={styles.subHead}>You can view the results and take appropriate actions</Text>
            </View>
        )
    }

    _renderClipboardBtn() {
        return (
            <TouchableOpacity onPress={this._pasteClipboardContent.bind(this)} >
                <Text
                    style={{
                        fontSize: 16,
                        textAlign: 'right',
                        marginVertical: 5
                    }} >
                    Paste from clipboard
                </Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={appStyles.screen} >
                {this._renderHeaderCard()}
                <Form
                    ref="form"
                    value={this.state.value}
                    type={SearchStructure}
                    options={SearchOptions}
                />
                {this._renderClipboardBtn()}
                <Button onPress={this._createSearch.bind(this)} >
                    Start Search
                </Button>
            </View>
        );
    }
}

const styles = {
    headerCard: {
        padding: 20,
        margin: 10,
        backgroundColor: '#00a572',
        borderRadius: 6,
        elevation: 5
    },
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#ffffff',
        marginVertical: 10,
    },
    subHead: {
        fontSize: 17,
        color: '#ffffff',
        marginVertical: 3,
    },
}