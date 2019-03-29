import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class SearcheeScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('searchee').full_name
        };
    };

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    _renderInfo(label, value) {
        return (
            <View style={styles.info} >
                <Text style={styles.label} >{label}</Text>
                <Text style={styles.value} >{value || 'Not Provided'}</Text>
            </View>
        )
    }

    render() {
        const searchee = this.props.navigation.getParam('searchee');
        return (
            <View style={styles.container} >
                {this._renderInfo('Full Name', searchee.full_name)}
                {this._renderInfo('Date of Birth', searchee.dob)}
                {this._renderInfo('Gender', searchee.sex)}
                {this._renderInfo('Height', searchee.height_cm)}
                {this._renderInfo('Weight', searchee.weight_kg)}
                {this._renderInfo('Skin Tone', searchee.skin_tone)}
            </View>
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
})