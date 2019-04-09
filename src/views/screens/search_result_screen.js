import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    FlatList,
    Image,
} from 'react-native';

import appStyles from '../styles/style';
import SearchApi from '../../api/search_api';


export default class SearchResultScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('search').name + ' Search Results'
        };
    };

    constructor(props) {
        super(props);
        const search = props.navigation.getParam('search');
        this.state = {
            search,
            results: []
        };
    }

    componentWillMount() {
        this.dataRefresher = setInterval(this.fetchResults.bind(this), 3000)
    }

    componentWillUnmount() {
        clearInterval(this.dataRefresher);
    }

    async fetchResults() {
        let { search } = this.state;
        let results = await SearchApi.results(search);
        this.setState({ results })
    }

    renderResultItem({ item, index }) {
        return (
            <View key={item.url} style={styles.cardItem} >
                <Image
                    resizeMode={'contain'}
                    style={{
                        width: 300,
                        height: 200
                    }}
                    source={{ uri: item.image_url }}
                />
                <Text>{`Timestamp - ${item.timestamp_sec}`}</Text>
                <Text>{`Confidence - ${item.confidence}`}</Text>
            </View>
        );
    }

    render() {
        return (
            <View style={appStyles.screen} >
                <FlatList
                    showsVerticalScrollIndicator={false}
                    renderItem={this.renderResultItem.bind(this)}
                    data={this.state.results}
                />
            </View>
        );
    }
}

const styles = {
    cardItem: {
        padding: 10,
        margin: 5,
        borderRadius: 5,
        elevation: 5
    },
    caption: {
        fontSize: 18,
        color: 'black'
    }
}
