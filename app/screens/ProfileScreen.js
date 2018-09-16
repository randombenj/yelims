import React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { Header, ListItem, Icon, Card, Badge } from 'react-native-elements';

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

        let followingList = responseJson.following.map(username => {
          return {key: username, username: username};
        });
        this.setState({
          username: responseJson.username,
          postCount: responseJson.post_count,
          attentionPoints: responseJson.attention_points,
          following: followingList,
        }, function (){});
      })
      .catch((error) => {
        console.log(error);
        this.setState({ 
          username: "error",
          postCount: 0,
          attentionPoints: 0,
          following: {},
        });
      });
  }

  componentDidMount() {
    this.getData();
  }

  getListItem = (item) => {
    console.log(item);
    return(
      <ListItem style={styles.listItem}
          rightIcon={<Icon
            raised
            name='heart'
            type='font-awesome'
            color='red'
            />
          }
          key={item.item.username}
          title={'@' + item.item.key}
        />
    )
  }

  render() {
    return (
      <View style={styles.view}>
        <Header
          centerComponent={{ text: '@' + this.state.username, style: { color: '#fff', fontWeight: 'bold' } }}
          outerContainerStyles={{ backgroundColor: '#3D6DCC' }}
          innerContainerStyles={{ justifyContent: 'space-around' }}
        />
        
        <Card containerStyle={{padding: 5}} >
          <Text>Posts:</Text>
          <Badge
            value={this.state.postCount}
            textStyle={{ color: 'orange' }}
          />
        </Card>

        <Card containerStyle={{padding: 5}} >
          <Text>Score:</Text>
          <Badge
            value={this.state.attentionPoints}
            textStyle={{ color: 'orange' }}
          />
        </Card>

        <Text style={styles.header}>People you follow:</Text>
        <FlatList
          data={this.state.following}
          renderItem={(item) => this.getListItem(item)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    marginTop: 24,
  },
  header: {
    fontSize: 20,
    marginTop: 15,
  },
});