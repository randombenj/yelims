import React from 'react';
import {
    Text, 
    View, 
    StyleSheet 
} from 'react-native';

import EmojiInput from 'react-native-emoji-input';

import { 
    FormLabel, 
    FormInput,
    Button
} from 'react-native-elements'
const CONFIG = require('../config');

export class AddScreen extends React.Component {
    
    static navigationOptions = {
      title: 'Add',
    };


    state = {
        emoji: '',
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

        let coords = {
            longitude: "8.5139361",
            latitude: "47.3891512"
        }

        let post = (coords) => {
            console.log("COORDS: ", coords);
            fetch(CONFIG.API_URL + 'posts', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + CONFIG.API_TOKEN
                },
                body: JSON.stringify({
                    message: this.state.emoji,
                    longitude: coords.longitude,
                    latitude: coords.latitude,
                }),
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.ok) {
                    console.log("submited post");
                    console.log(responseJson);
                } else {
                    console.log(responseJson);
                }
            })
            .catch(
                (error) =>  console.error(error)
            );
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("OWN POSITION: ", position)
                coords.longitude = position.coords.longitude;
                coords.latitude = position.coords.latitude;
                post(coords);
            },
            (err) => {
                console.warn(err);
                post(coords);
            } 
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <FormLabel>Post</FormLabel>
                <FormInput value={this.state.emoji} onChangeText={this.handle_emoji_keyboard} />
                <EmojiInput onEmojiSelected={(emoji) => this.handle_emoji(emoji.char)}
                    keyboardBackgroundColor={"white"}
                    enableFrequentlyUsedEmoji={true}
                    enableSearch={false} 
                />
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