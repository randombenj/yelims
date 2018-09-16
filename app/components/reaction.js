import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';

export class Reaction extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            count: props.count
        };
        console.log("Init Reaction: ", props);
    }
    render() {
      return (
        <TouchableHighlight
            onPress={() => {
                console.log("going to call addreaction ...");
                console.log("postid: ", this.props.postId)
                this.props.addreaction(this.props.postId, this.props.emoji);
            }}
        >
            <View style={styles.container}>
                <View>
                    <Text style={styles.emoji}>{this.props.emoji}</Text>
                </View>
                <View style={styles.count}>
                    <Text>{this.state.count}</Text>
                </View>
            </View>
        </TouchableHighlight>
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
        top: 25, 
        left: -15, 
        paddingLeft: 4, 
        paddingRight: 4,
        height: 23,
        position: "relative",
        backgroundColor: 'white', 
        borderColor: '#efefef', 
        borderWidth: 1, 
        borderRadius: 20,
        marginRight: -8
    }
});