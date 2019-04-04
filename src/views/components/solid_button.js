import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default class SolidButton extends Component {
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress} >
                <Text
                    style={{
                        backgroundColor: '#387be0',
                        color: '#ffffff',
                        padding: 7,
                        borderRadius: 5,
                        textAlign: 'center',
                        fontSize: 20,
                        fontWeight: 'bold',
                        margin: 5,
                        ...this.props.style,
                    }}>
                    {this.props.children}
                </Text>
            </TouchableOpacity>
        );
    }
}
