import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export class Reaction extends React.Component {
    render() {
      return (
        <View style={styles.container}>
            <View>
                <Text style={styles.emoji}>{this.props.emoji}</Text>
            </View>
            <View style={styles.count}>
                <Text>{this.props.count}</Text>
            </View>
        </View>
      );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginBottom: 20
    },
    emoji: {
        fontSize: 30
    },
    count: { 
        top: 22, 
        left: -20, 
        paddingLeft: 4, 
        paddingRight: 4,
        height: 23,
        position: "relative",
        backgroundColor: 'white', 
        borderColor: '#efefef', 
        borderWidth: 1, 
        borderRadius: 20,
        marginRight: -20
    }
});