import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';

import { Reaction } from './reaction';

export class Reactions extends React.Component {
    _onPress = (postId) => {
        this.props.handler(postId);
    }

    _renderReactions() {
        let reactions = this.props.reactions;
        if (!(
            Object.keys(reactions).length === 0 &&
            reactions.constructor === Object
        )) {
            let elements = [];
            
            console.log(reactions);
            console.log("postid in reactions: ", this.props.postId);
            for (let reaction in reactions) {
                elements.push(
                    <Reaction 
                        postId={this.props.postId}
                        key={reaction}
                        emoji={reaction}
                        count={this.props.reactions[reaction]}
                        addreaction={this.props.addreaction} 
                    />
                );
            }
            return elements;
        }
    }

    render() {
      return (
        <View style={[styles.container, {justifyContent: 'space-between'}]}>
            <View style={styles.container}>
            {
                this.props.reactions.map(reaction =>
                    <Reaction 
                        postId={this.props.postId}
                        key={reaction[0]}
                        emoji={reaction[0]}
                        count={reaction[1]}
                        addreaction={this.props.addreaction} 
                    />
                )
            }
            </View>
            <TouchableHighlight
                onPress={() => this._onPress(this.props.postId)}
            >
                <View>
                    <Text style={{fontSize: 20, paddingTop: 10}}>➕</Text>
                </View>
            </TouchableHighlight>
        </View>
      );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginBottom: 5,
        alignSelf: 'stretch',
    }
});