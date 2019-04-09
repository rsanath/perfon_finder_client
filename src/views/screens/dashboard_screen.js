import React, { Component } from 'react';
import {
    View, Text,
    StyleSheet, TouchableOpacity,
    Modal, ImageBackground,
    Image,
    ScrollView
} from 'react-native';

import t from 'tcomb-form-native';
import moment from 'moment';

import session from '../../session';
import util from '../../util';
import { ComplaintOptions, ComplaintStructure } from './complaint_screen';
import Button from '../components/solid_button';
import ComplaintApi from '../../api/complaint_api';


const Form = t.form.Form;


class DashboardScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const logout = () => {
            session.setCurrentUser(null);
            navigation.navigate('Auth');
        }
        return {
            headerRight: (
                <TouchableOpacity onPress={logout} >
                    <Text>Logout</Text>
                </TouchableOpacity>
            ),
        };
    };


    constructor(props) {
        super(props);
        this.state = {
            user: {
                complaints: []
            },
            complaints: []
        };
    }

    async componentWillMount() {
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this._loadUserDetails()
            }
        );
    }

    async _loadUserDetails() {
        let user = await session.getCurrentUser();

        user = await fetch(user.url);
        user = await user.json();

        let complaints = user.complaints;

        complaints = complaints.map(async url => {
            let complaint = await fetch(url);
            return complaint.json();
        })
        complaints = await Promise.all(complaints);

        this.setState({ user, complaints });
    }

    _renderKeyValuePair(key, value) {
        return (
            <View style={styles.statusContainer}>
                <Text style={styles.keyStyle} >{key}</Text>
                <Text style={styles.valueStyle}>{value}</Text>
            </View>
        )
    }

    _renderComplaints() {

        const openComplaintScreen = complaint => {
            this.props.navigation.navigate('Complaint', { complaint })
        }

        const statusMap = {
            INITIALIZED: 'Initialized',
            WAITING_FOR_APPROVAL: 'Waiting For Approval',
            APPROVED: 'Approved',
            REJECTED: 'Rejected',
        };

        return this.state.complaints.map(complaint => {
            return (
                <TouchableOpacity
                    key={complaint.name}
                    activeOpacity={0.7}
                    onPress={() => openComplaintScreen(complaint)}
                >
                    <View style={styles.card} >
                        <Text style={styles.cardTitle}>{complaint.name}</Text>

                        {this._renderKeyValuePair("Status", statusMap[complaint.status])}
                    </View>
                </TouchableOpacity>
            )
        })
    }

    _renderComplaintHelperCard() {
        let {user} = this.state;
        if (user.complaints.length > 0) return null;
        const bullet = {
            fontSize: 15,
            color: 'white',
            margin: 3
        };
        return (
            <View style={{
                borderRadius: 10,
                marginVertical: 5,
                marginHorizontal: 5,
                paddingHorizontal: 15,
                paddingVertical: 20,
                overflow: 'hidden'
            }} >
                <Image
                    resizeMode='stretch'
                    style={{
                        flex: 1,
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0
                    }}
                    source={require('../../assets/blue_gradient.png')} />
                <Text style={styles.cardTitle} >
                    {'Find Your \nLoved Ones '}
                </Text>
                <Text style={bullet}>File a FIR complaint</Text>
                <Text style={bullet}>Submit the copy of documents</Text>
                <Text style={bullet}>Provide information about the person(s) missing</Text>
                <Text style={bullet}>We'll help you find the person</Text>
                <Button
                    style={{ backgroundColor: '#fff', color: '#387be0', marginTop: 20 }}
                    onPress={() => this.props.navigation.navigate('NewComplaint', {user})}
                >
                    Submit Complaint
                </Button>
            </View>

        )
    }

    render() {
        return (
            <View style={styles.container} >
                <Text style={styles.heading} >Dashboard</Text>
                {this._renderComplaintHelperCard()}
                {this._renderComplaints()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        marginVertical: 10,
    },
    card: {
        elevation: 5,
        borderRadius: 5,
        backgroundColor: '#4682b4',
        padding: 15,
        margin: 10,
    },
    statusContainer: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        paddingVertical: 10,
        justifyContent: 'space-between'
    },
    addNewBtn: {
        marginVertical: 20,
        fontSize: 20,
        color: 'black',
        textAlign: 'center'
    },
    cardTitle: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold'
    },
    keyStyle: {
        fontSize: 17, 
        color: '#ffffff'
    },
    valueStyle: {
        fontSize: 17, 
        color: '#ffffff',
        fontWeight: 'bold'
    }
});

export default DashboardScreen;
