import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { Reaction } from './reaction';

export class Reactions extends React.Component {
    render() {
      return (
        <View style={styles.container}>
            {
                this.props.reactions.map((reaction) => 
                (
                    <Reaction emoji={reaction.emoji} count={reaction.count} />
                ))
            }
        </View>
      );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginBottom: 20
    }
});