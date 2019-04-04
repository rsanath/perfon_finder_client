import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import t from 'tcomb-form-native';
import moment from 'moment';
import util from '../../util';


const Form = t.form.Form;

export const ComplaintStructure = t.struct({
    name: t.String,
    doi: t.Date,
    poi: t.String
});

export const ComplaintOptions = {
    fields: {
        name: {
            editable: false,
            label: 'Complaint Name',
            placeholder: 'Eg: Missing Children'
        },
        doi: {
            label: 'Date of Incident',
            mode: 'date',
            config: {
                format: date => moment(date).format("DD MMM YYYY"),
                placeholder: 'When the person(s) went missing'
            }
        },
        poi: {
            label: 'Place of Incident',
            placeholder: 'Eg: Phoenix Mall, Chennai'
        }
    }
};


export default class ComplaintScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('complaint').name
        };
    };

    constructor(props) {
        super(props);
        const complaint = props.navigation.getParam('complaint', null);
        this.state = {
            searchees: [],
            complaint,
            fetchingSearchees: true
        };
    }

    _renderInfo(label, value) {
        return (
            <View style={styles.info} >
                <Text style={styles.label} >{label}</Text>
                <Text style={styles.value} >{value}</Text>
            </View>
        )
    }

    componentWillMount() {
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this._fetchSearchees();
            }
        );
    }

    async _fetchSearchees() {
        this.setState({fetchingSearchees: true})
        let complaint = await fetch(this.state.complaint.url);
        complaint = await complaint.json();

        let searchees = complaint.searchees.map(async s => {
            const searchee = await fetch(s);
            return await searchee.json();
        })
        searchees = await Promise.all(searchees);

        this.setState({ searchees, fetchingSearchees: false })
    }

    _goToSearcheeScreen(searchee) {
        this.props.navigation.navigate('Searchee', { searchee })
    }

    onAddNewSearchee() {
        let { complaint } = this.state;
        this.props.navigation.navigate('NewSearchee', { complaint });
    }

    _renderSearchees() {
        const searcheeItems = this.state.searchees.map(s => {
            return (
                <TouchableOpacity
                    key={s.full_name}
                    onPress={() => this._goToSearcheeScreen(s)} >
                    <View >
                        <Text style={styles.searcheeItem} >{s.full_name}</Text>
                    </View>
                </TouchableOpacity>
            )
        });
        return searcheeItems;
    }

    render() {
        const { complaint } = this.state;

        return (
            <ScrollView>
                <View style={styles.container} >
                    <Form
                        value={{ ...complaint, doi: new Date(complaint.doi) }}
                        ref="form"
                        type={ComplaintStructure}
                        options={util.allEditable(ComplaintOptions, false)}
                    />

                    <Text style={styles.subTitle} > Missing Persons </Text>
                    <ActivityIndicator animating={this.state.fetchingSearchees} />
                    {this._renderSearchees()}
                    <TouchableOpacity
                        key={'add_new'}
                        onPress={this.onAddNewSearchee.bind(this)} >
                        <Text
                            style={styles.addNewBtn} >
                            + Add New Person
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
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
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'grey'
    },
    value: {
        fontSize: 18,
        color: 'black'
    },
    vidThumbnail: {
        margin: 10,
        width: '90%',
        aspectRatio: 1
    },
    searcheeItem: {
        borderRadius: 4,
        borderWidth: 1,
        padding: 10,
        margin: 5,
        fontSize: 20,
        color: 'black',
    },
    addNewBtn: {
        marginVertical: 20,
        fontSize: 20,
        color: 'black',
        textAlign: 'center'
    },
    subTitle: {
        fontSize: 20,
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
        marginVertical: 15
    }
})