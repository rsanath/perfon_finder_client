import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import t from 'tcomb-form-native';
import moment from 'moment';


const Form = t.form.Form;

export const ComplaintStructure = t.struct({
    name: t.String,
    doi: t.Date,
    poi: t.String,
    fir: t.String
});

export const ComplaintOptions = {
    fields: {
        name: {
            editable: false,
            label: 'Complaint Name'
        },
        doi: {
            label: 'Date of Incident',
            mode: 'date',
            config: {
                format: date => moment(date).format("Do MMM YYYY")
            }
        },
        poi: {
            label: 'Place of Incident'
        },
        fir: {
            label: 'FIR Document Link'
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
        this.state = {
            searchees: []
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
        this._fetchSearchees()
    }

    async _fetchSearchees() {
        const complaint = this.props.navigation.getParam('complaint', null);
        let searchees = complaint.searchees.map(async s => {
            const searchee = await fetch(s);
            return await searchee.json();
        })
        searchees = await Promise.all(searchees);

        this.setState({ searchees })
    }

    _goToSearcheeScreen(searchee) {
        this.props.navigation.navigate('Searchee', { searchee })
    }

    onAddNewSearchee() {

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
        const complaint = this.props.navigation.getParam('complaint', null);

        return (
            <ScrollView>
                <View style={styles.container} >
                    <Form
                        value={{ ...complaint, doi: new Date(complaint.doi) }}
                        ref="form"
                        type={ComplaintStructure}
                        options={ComplaintOptions}
                    />

                    <Text
                        style={{
                            fontSize: 20,
                            color: 'black',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            marginVertical: 15
                        }} >
                        Missing Persons
                </Text>
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
    }
})