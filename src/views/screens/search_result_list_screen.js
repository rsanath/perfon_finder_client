import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity } from 'react-native';

import appStyles from '../styles/style';
import SearcheeApi from '../../api/searchee_api';


export default class SearchResultListScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Searches'
        };
    };

    constructor(props) {
        super(props);
        const searchee = props.navigation.getParam('searchee');
        const searches = props.navigation.getParam('searches');
        this.state = {
            searchee,
            searches
        };
    }

    componentWillMount() {
        let { searchee } = this.state;
        this.dataRefresher = setInterval(
            () => {
                SearcheeApi.getSearches(searchee.url)
                    .then(searches => this.setState({ searches }))
            },
            4000
        )
    }

    componentWillUnmount() {
        clearInterval(this.dataRefresher);
    }

    getSearchByStatus() {
        let active = [];
        let completed = [];

        this.state.searches.forEach(s => {
            if (s.status == 'COMPLETED') completed.push(s);
            if (s.status == 'IN_PROGRESS' || s.status == 'INITIALIZED') active.push(s);
        })

        return { active, completed };
    }

    renderSearchItem(item) {
        const navigateToResultPage =() => {
            this.props.navigation.navigate('SearchResult', {search: item})
        }

        const backgroundColor = item.status == 'COMPLETED' ? '#247BA0' : '#4DA167'
        return (
            <TouchableOpacity 
            onPress={navigateToResultPage}
            activeOpacity={0.7} >
                <View style={{ ...styles.headerCard, backgroundColor }} key={item.url} >
                <Text style={styles.heading}>{item.name}</Text>
                <Text style={styles.subHead}>{`Status - ${item.status}`}</Text>
                <Text style={styles.subHead}>{`Results Obtained - ${item.results.length}`}</Text>
            </View>
            </TouchableOpacity>
        )
    }

    renderSearches(title, data) {
        return (
            <View style={{ marginVertical: 10 }} >
                <Text style={styles.headingBlack}>{title}</Text>
                {
                    data.length == 0 ?
                        (
                            <Text style={{ ...styles.subHead, color: '#000' }} >{`No ${title}`}</Text>
                        ) : (
                            data.map(this.renderSearchItem.bind(this))
                        )
                }
            </View>
        )
    }

    render() {
        const { active, completed } = this.getSearchByStatus();

        return (
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={appStyles.screen} >
                    {this.renderSearches('Active Searches', active)}
                    {this.renderSearches('Completed Searches', completed)}
                </View>
            </ScrollView>
        );
    }
}


const styles = {
    headerCard: {
        padding: 20,
        margin: 5,
        backgroundColor: '#247BA0',
        borderRadius: 6,
        elevation: 5
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#ffffff',
        marginVertical: 10,
    },
    headingBlack: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000000',
        marginVertical: 10,
    },
    subHead: {
        fontSize: 20,
        color: '#ffffff',
        marginVertical: 5,
    },
}