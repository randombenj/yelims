import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';

const CONFIG = require('../config');

export class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };

  constructor(props) {
    super(props);
    this.state = {
      username: "...",
          postCount: 0,
          attentionPoints: 0,
          following: [],
    }
  }

  getData = () => {
    fetch(CONFIG.API_URL + 'users/' + CONFIG.USERNAME, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + CONFIG.API_TOKEN,
      }})
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          username: responseJson.username,
          postCount: responseJson.post_count,
          attentionPoints: responseJson.attention_points,
          following: responseJson.following,
        }, function (){});
        console.log(this.state.userProfile);
      })
      .catch((error) => {
        console.log(error);
        this.setState({ 
          username: "error",
          postCount: 0,
          attentionPoints: 0,
          following: [],
        });
      });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <View style={styles.view}>
        <Header
          centerComponent={{ text: this.state.username, style: { color: '#fff' } }}
          outerContainerStyles={{ backgroundColor: '#3D6DCC' }}
          innerContainerStyles={{ justifyContent: 'space-around' }}
        />
        <Text>This is the profile screen.. /users/name</Text>
        <Text>{CONFIG.USERNAME}</Text>
        <Text>{this.state.username}</Text>
        <Text>{this.state.postCount}</Text>
        <Text>{this.state.attentionPoints}</Text>
        <Text>{this.state.following[0]}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    marginTop: 24,
  },
});