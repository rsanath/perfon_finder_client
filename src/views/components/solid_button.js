import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default class SolidButton extends Component {
    render() {
        return (
            <TouchableOpacity {...this.props} >
                <Text
                    style={{
                        flex: 1,
                        backgroundColor: this.props.color || '#387be0',
                        padding: 7,
                        borderRadius: 5,
                        textAlign: 'center',
                        color: 'white',
                        fontSize: 20
                    }}
                >{this.props.children}</Text>
            </TouchableOpacity>
        );
    }
}
