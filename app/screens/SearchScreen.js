import React from 'react';
import { View, FlatList } from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements'
const CONFIG = require('../config');

export class SearchScreen extends React.Component {
  static navigationOptions = {
    title: 'Search'
  }

  constructor(props) {
    super(props);
    this.state = {
      users: ["type something to find peace",]
    }
  }

  loadUsers = (text) => {
    return fetch(CONFIG.API_URL + 'users?username=' + text)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          users: responseJson.users,
        }, function () {

        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ users: ["no users found..",] });
      });
  };

  render() {
    return (
      <View>
        <SearchBar
          round
          lightTheme
          onChangeText={this.loadUsers}
          onClearText={this.loadUsers}
          placeholder='Search other yelims...' />
        <FlatList
          data={this.state.users}
          renderItem={({ item }) =>
            <ListItem
              hideChevron
              key={item}
              title={item}
            />
          }
        />
      </View>
    );
  }
}