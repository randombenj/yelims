import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import EmojiInput from 'react-native-emoji-input';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'
const CONFIG = require('../config');

export class AddScreen extends React.Component {
    static navigationOptions = {
      title: 'Add',
    };

     constructor(props) {
        super(props);

        this.state = {
          emoji: '',
        };
      }


    handle_emoji = (text) => {
        this.setState({
            emoji: this.state.emoji + text
        })
    };

    handle_emoji_keyboard = (text) => {
        this.setState({
            emoji: text
        })
    };

    _post = () => {
        console.log("emoji: " + this.state.emoji);
        fetch(CONFIG.API_URL + 'posts', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MzcwMzM5NjYsIm5iZiI6MTUzNzAzMzk2NiwianRpIjoiYjRiNTJmMDQtNDRhOS00ODUyLWJiZWMtZjRhODMxNmQ1OTRlIiwiZXhwIjoxNTM3MTIwMzY2LCJpZGVudGl0eSI6eyJ1c2VybmFtZSI6ImZsZXgifSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.tWhtwwS2ABds17yafoZ4fUPhlHxgtGyT71uSeoe8yiU'
                },
                body: JSON.stringify({
                    message: this.state.emoji,
                    longitude: "47.3898512",
                    latitude: "8.5134361",
                }),
            }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.ok) {
                    console.log("submited post");
                    console.log(responseJson);
                } else {
                    console.error(responseJson);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        return (
            <View style={[styles.container]}>
                <FormLabel>Post</FormLabel>
                <FormInput value={this.state.emoji} onChangeText={this.handle_emoji_keyboard} />
                <EmojiInput onEmojiSelected={(emoji) => this.handle_emoji(emoji.char)}
                keyboardBackgroundColor={"white"}
                enableFrequentlyUsedEmoji={true}
                enableSearch={false} />
                <Button onPress={this._post} title='submit' />
            </View>
        ); 
    }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignSelf: 'stretch',
    margin: 10,
    marginRight: 10,
    paddingTop: 15
  },
});