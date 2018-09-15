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
            emoji: this.state.emoji
        })
        console.log(text);
    };

    _post() {
        console.log("emoji: " + this.state.user + "pass: " + this.state.pass);
        fetch(CONFIG.API_URL + 'auth', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.state.user,
                    password: this.state.pass,
                }),
            }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.ok) {
                    console.log("user login");
                    console.log(responseJson);
                    this.props.navigation.navigate('Home', {
                        authtoken: responseJson.data.token,
                        authrefresh: responseJson.data.refresh
                    });
                } else {
                    console.error(responseJson);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        this.emoji = "";
        return (
            <View style={[styles.container]}>
                <FormLabel>Post</FormLabel>
                <FormInput value={this.state.emoji} />
                <EmojiInput onEmojiSelected={(emoji) => this.handle_emoji(emoji.char)}
                keyboardBackgroundColor={"white"}
                enableFrequentlyUsedEmoji={true}
                enableSearch={false} />
                <Button onPress={this._post()} title='submit' />
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