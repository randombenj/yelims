import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SearchBar, ListItem, Icon } from 'react-native-elements';

const CONFIG = require('../config');
const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MzcwMTY4NzgsIm5iZiI6MTUzNzAxNjg3OCwianRpIjoiZjMyOTZlOWEtYTZhMi00M2UxLWFlY2QtMWJmOWRlYzczZjAyIiwiZXhwIjoxNTM3MTAzMjc4LCJpZGVudGl0eSI6eyJ1c2VybmFtZSI6IlRpbW8ifSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.88dpEexIKFiSIloaJtKUc5KMGZvDvb2cHFwjM8iD5u0';

export class SearchScreen extends React.Component {
  static navigationOptions = {
    title: 'Search'
  }

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      usersLoaded: false,
      lastSearchText: '',
    }
  }

  loadUsers = (text) => {
    if(text == '') {
      this.setState({ 
        users: ["Enter a username in the search bar to start.",],
        usersLoaded: false,
        lastSearchText: '',
      });
      return;
    }
    return fetch(CONFIG.API_URL + 'users?username=' + text, {
      method: 'GET',
      headers: {
        Authorization: token,
      }})
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          users: responseJson.users,
          usersLoaded: true,
          lastSearchText: text,
        }, function () {

        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ 
          users: ["No users found..",],
          usersLoaded: false,
          lastSearchText: '',
        });
      });
  };

  onButtonPress = (user) => {
    console.log('onButtonPress:');
    console.log(user);
    if(user.following) {
      this.setFollowingForUser(user.username, 'DELETE');
      this.loadUsers(this.state.lastSearchText);
    } else {
      this.setFollowingForUser(user.username, 'PUT');
      this.loadUsers(this.state.lastSearchText);
    }
  }

  setFollowingForUser(username, method) {
    fetch(CONFIG.API_URL + 'users/' + username + '/follow', {
      method: method,
      headers: {
        Authorization: token,
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  getIconColorFromFollowState = (following) => {
    if(following) {
      return 'red';
    } else {
      return 'grey';
    }
  }

  getListItems = (item) => {
    console.log(item);
    console.log(this.state.usersLoaded);
    if(this.state.usersLoaded) {
      return (
        <ListItem style={styles.listItem}
          rightIcon={<Icon
            raised
            name='heart'
            type='font-awesome'
            color={this.getIconColorFromFollowState(item.item.following)}
            onPress={() => this.onButtonPress(item.item)}
            />
          }
          key={item.item.username}
          title={'@' + item.item.username}
        />
      )
    } else {
      return (
        <ListItem style={styles.listItem}
          hideChevron
          key={item.item}
          title={item.item}
        />
      )
    }
  }

  render() {
    return (
      <View style={styles.view}>
        <SearchBar
          round
          lightTheme
          onChangeText={this.loadUsers}
          onClearText={this.loadUsers}
          placeholder='Search other yelims...' />
        <FlatList
          data={this.state.users}
          renderItem={(item) => this.getListItems(item)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    marginTop: 24,
  },
  listItem: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    fontSize: 20,
  },
});