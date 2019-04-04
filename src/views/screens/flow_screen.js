import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import appStyle from '../styles/style';
import session from '../../session';
import NewComplaintScreen from './new_complaint_screen';
import NewSearcheesScreen from './new_searchees_screen';


export default class FlowScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('Title', 'New Complaint'),
        };
    };

    COMPLAINT = 'complaint';
    SEARCHEES = 'searchees';
    SEARCH = 'search';

    setTitle(title) {
        this.props.navigation.setParams({title});
    }

    _getNextForm(current) {
        switch (current) {
            case this.COMPLAINT:
                return this.SEARCHEES;
            case this.SEARCHEES:
                return this.SEARCH;
            case this.SEARCH:
                return null;

        }
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            user: null,
            complaint: null,
            searchees: [],
            samples: {},
            currentForm: this.COMPLAINT
        }
        this._showLoading = this._showLoading.bind(this);
        this._hideLoading = this._hideLoading.bind(this);
    }

    async componentWillMount() {
        const user = await session.getCurrentUser();
        this.setState({user});
    }

    _showLoading() {
        this.setState({loading: true})
    }

    _hideLoading() {
        this.setState({loading: false})
    }

    _getOnSubmitHandler(formName) {
        return response => {
            this._hideLoading()
            if (response) {
                const next = this._getNextForm(formName);
                const state = {currentForm: next};
                
                // set the response from the current form to the appropriate state val
                // so that we can pass them to then next forms
                state[formName] = response;

                this.setState(state);
            } else {
                console.log('response was unsuccessful')
            }
        }
    }

    _renderForm() {
        const formMap = {
            complaint: (
                <NewComplaintScreen 
                    user={this.state.user}
                    onStartRequest={this._showLoading}
                    onEndRequest={this._getOnSubmitHandler(this.COMPLAINT)}
                />
            ),
            searchees: (
                <NewSearcheesScreen
                    complaint={this.state.complaint}
                    onStartRequest={this._showLoading}
                    onEndRequest={this._getOnSubmitHandler(this.SEARCHEES)}
                />
            )
        }
        return formMap[this.state.currentForm]
    }

    _renderLoader() {
        if (!this.state.loading) return null;
        return (
            <View style={styles.loader} >
                <ActivityIndicator animating={true} color={'#ffffff'} />
                <Text style={{color: 'white', fontSize: 20}} >Loading...</Text>
            </View>
        )
    }

    render() {
        return (
            <View style={appStyle.screen}>
                {this._renderForm()}
                {this._renderLoader()}
            </View>
        );
    }
}


const styles = {
    loader: {
        width: '110%',
        height: '110%',
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.5)',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    }
}