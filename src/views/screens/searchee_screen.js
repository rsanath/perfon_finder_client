import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import t from 'tcomb-form-native';
import moment from 'moment';

import Button from '../components/solid_button';
import util from '../../util';
import SearcheeApi from '../../api/searchee_api';


const Form = t.form.Form;

export const SearcheeStructure = t.struct({
    full_name: t.String,
    dob: t.Date,
    sex: t.enums({
        'MALE': 'Male',
        'FEMALE': 'Female',
        'NON_BINARY': 'Non Binary'
    }, 'Gender'),
    height_cm: t.Number,
    weight_kg: t.Number,
    skin_tone: t.enums({
        'ST_LIGHT': 'Light',
        'ST_MEDIUM': 'Medium',
        'ST_DARK': 'Dark'
    }, 'Skin Tone'),
});

export const SearcheeOptions = {
    fields: {
        full_name: {
            editable: false,
            label: 'Missing Person Name'
        },
        dob: {
            editable: false,
            label: 'Date of Birth',
            mode: 'date',
            config: {
                format: date => moment(date).format("DD MMM YYYY")
            }
        },
        sex: {
            editable: false,
            label: 'Gender'
        },
        height_cm: {
            editable: false,
            label: 'Height in cm'
        },
        weight_kg: {
            editable: false,
            label: 'Weight in kg'
        },
        skin_tone: {
            editable: false,
            label: 'Skin Tone'
        }
    }
};

export default class SearcheeScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('searchee').full_name
        };
    };

    constructor(props) {
        super(props);
        const searchee = props.navigation.getParam('searchee');
        this.state = {
            searchee,
            samples: [],
            searches: []
        };
    }

    componentWillMount() {
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this._fetchSamples();
                this._fetchSearches();
            }
        );
    }

    async _fetchSearches() {
        let { searchee } = this.state;
        let searches = await SearcheeApi.getSearches(searchee.url);
        this.setState({ searches })
    }

    async _fetchSamples() {
        let searchee = this.state.searchee;
        searchee = await fetch(searchee.url);
        searchee = await searchee.json();

        const { samples } = searchee;

        console.log('fetched sample ', samples);
        this.setState({ samples })
    }

    _renderInfo(label, value) {
        return (
            <View style={styles.info} >
                <Text style={styles.label} >{label}</Text>
                <Text style={styles.value} >{value || 'Not Provided'}</Text>
            </View>
        )
    }

    _getSearchStats() {
        let active = 0;
        let completed = 0;
        this.state.searches.forEach(s => {
            if (s.status == 'COMPLETED') completed += 1;
            if (s.status == 'IN_PROGRESS' || s.status == 'INITIALIZED') active += 1;
        })
        return {
            active,
            completed
        }
    }

    _renderSearchStarter() {
        let searchesLen = this.state.searches.length;

        // if (searchesLen > 0) return null;

        let { searchee } = this.state;
        let samplesLen = this.state.samples.length;

        const { navigate } = this.props.navigation;

        return (
            <View style={styles.headerCard} >
                <Text style={styles.heading}>Start The Search</Text>
                {
                    samplesLen < 15 ?
                        (
                            <Text style={styles.subHead}>
                                {`You need ${15 - samplesLen} more image(s) to start the search`}
                            </Text>
                        ) : (
                            <Button
                                style={styles.startSearchBtn}
                                onPress={() => navigate('NewSearch', { searchee })}>
                                Start
                            </Button>
                        )
                }
            </View>
        )
    }

    _renderActiveSearchCard() {
        if (this.state.searches.length <= 0) return null;

        const { navigate } = this.props.navigation;
        const { active, completed } = this._getSearchStats();
        const { searchee, searches } = this.state;

        return (
            <View style={{
                ...styles.headerCard,
                backgroundColor: '#AD7A99'
            }} >
                <Text style={styles.heading}>Search Reports</Text>
                <Text style={styles.subHead}>{`${active} Active Search`}</Text>
                <Text style={styles.subHead}>{`${completed} Completed Search`}</Text>
                <Button
                    onPress={() => navigate('SearchResultList', { searchee, searches })}
                    style={{
                        backgroundColor: '#fff',
                        color: '#AD7A99'
                    }} >
                    View Details
                </Button>
            </View>
        )
    }

    render() {
        const { searchee } = this.state;
        const { navigate } = this.props.navigation;

        return (
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={styles.container} >
                    {this._renderSearchStarter()}
                    {this._renderActiveSearchCard()}
                    <Button onPress={() => navigate('SearcheeSamples', { searchee })}>
                        Submit Images
                </Button>
                    <Form
                        value={{ ...searchee, dob: new Date(searchee.dob) }}
                        ref="form"
                        type={SearcheeStructure}
                        options={util.allEditable(SearcheeOptions, false)}
                    />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'grey'
    },
    value: {
        fontSize: 18,
        color: 'black'
    },
    container: {
        flex: 1,
        padding: 20,
    },
    info: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        paddingVertical: 10,
        justifyContent: 'space-between'
    },
    headerCard: {
        padding: 20,
        margin: 5,
        backgroundColor: '#00a572',
        borderRadius: 6,
        elevation: 5
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#ffffff',
        marginVertical: 10,
    },
    subHead: {
        fontSize: 20,
        color: '#ffffff',
        marginVertical: 5,
    },
    startSearchBtn: {
        color: '#00a572',
        backgroundColor: '#ffffff'
    }
})