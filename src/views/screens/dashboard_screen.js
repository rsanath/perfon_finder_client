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
            // headerTitle: 'Welcome',
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
            complaints: [],
            modalVisible: false
        };
    }

    _getStatus(status_key) {
        const map = {
            INITIALIZED: 'Initialized',
            WAITING_FOR_APPROVAL: 'Waiting For Approval',
            APPROVED: 'Approved',
            REJECTED: 'Rejected',
        }
        return map[status_key] || 'Unknown';
    }

    _onPressNewComplaint() {
        this.setState({ modalVisible: true })
    }

    async componentWillMount() {
        const user = await session.getCurrentUser()

        let complaints = user.complaints.map(async url => {
            let complaint = await fetch(url);
            return complaint.json();
        })
        complaints = await Promise.all(complaints);

        this.setState({ user, complaints })
    }

    async _createNewComplaint(inputs) {
        const user = await session.getCurrentUser();
        if (!user) return;

        const complaint = util.clone(user);
        complaint.doi = moment(complaint.doi).format("YYYY-MM-DD")

        complaint.submitter = user.url;
        complaint.searchees = [];

        ComplaintApi.create(complaint).then(res => {
            alert('Successfully Created')
            this.setState({ complaint: res, modalVisible: false })
        })
            .catch(e => {
                console.log(e)
                alert('Something went wrong. Please try later')
            })
    }

    _renderNewComplaintModal() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.setState({ modalVisible: false })}
                visible={this.state.modalVisible} >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }} >
                    <ScrollView>
                        <View style={{
                            flex: 1,
                            margin: 20,
                            padding: 20,
                            borderRadius: 5,
                            backgroundColor: 'white'
                        }} >
                            <Form
                                ref="form"
                                type={ComplaintStructure}
                                options={util.allEditable(ComplaintOptions)}
                            />
                            <Button onPress={() => {
                                const val = this.refs.form.getValue()
                                if (val) {
                                    this._createNewComplaint(val);
                                }
                            }}>Submit</Button>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        )
    }

    _renderComplaints(complaints) {
        const openComplaintScreen = complaint => {
            this.props.navigation.navigate('Complaint', { complaint })
        }

        return complaints.map(complaint => {
            return (
                <TouchableOpacity
                    key={complaint.name}
                    activeOpacity={0.7}
                    onPress={() => openComplaintScreen(complaint)}
                >
                    <View style={styles.card} >
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: 'black'
                            }} >
                            {complaint.name}
                        </Text>
                        <View style={styles.statusContainer}>
                            <Text>Status</Text>
                            <Text>{this._getStatus(complaint.status)}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        })
    }

    /**
     * To improve after finishing core functionalities of the app
     */
    _renderNewComplaintCard() {
        const bullet = {
            fontSize: 15,
            color: 'white',
            margin: 3    
        };
        return (
            <TouchableOpacity>
                <View style={{
                    borderRadius: 10,
                    marginVertical: 5,
                    marginHorizontal: 5,
                    paddingHorizontal: 15,
                    paddingVertical: 20,
                    overflow: 'hidden'
                }} >
                    <Image
                    resizeMode='contain'
                        style={{
                            flex: 1,
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0
                        }}
                        source={require('../../assets/blue_gradient.png')} />
                    <Text style={{
                        fontSize: 25,
                        color: 'white',
                        fontWeight: 'bold'
                    }} >
                        {'Submit \nA Complaint'}
                    </Text>
                    <Text style={bullet} >File a complaint</Text>
                    <Text style={bullet}>Submit the copy of documents</Text>
                    <Text style={bullet}>Provide information about the person missing</Text>
                    <Text style={bullet}>We'll help you find the person</Text>
                </View>
            </TouchableOpacity>

        )
    }

    render() {
        return (
            <View style={styles.container} >
                {this._renderNewComplaintModal()}
                <Text style={styles.heading} >{'Welcome ' + this.state.user.full_name}</Text>
                {this._renderComplaints(this.state.complaints)}
                <TouchableOpacity onPress={this._onPressNewComplaint.bind(this)} >
                    <Text style={styles.addNewBtn} >Register New Complaint</Text>
                </TouchableOpacity>
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
        backgroundColor: 'ivory',
        padding: 10,
        margin: 5
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
    }
});

export default DashboardScreen;
