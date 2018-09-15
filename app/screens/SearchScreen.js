import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SearchBar, ListItem, Icon } from 'react-native-elements'

const CONFIG = require('../config');

export class SearchScreen extends React.Component {
  static navigationOptions = {
    title: 'Search'
  }

  constructor(props) {
    super(props);
    this.state = {
      users: ["type something to find peace",],
      usersLoaded: false,
    }
  }

  loadUsers = (text) => {
    if(text == '') {
      this.setState({ 
        users: ["enter a username in the search bar to start.",],
        isResult: false,
      });
      return;
    }
    return fetch(CONFIG.API_URL + 'users?username=' + text)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          users: responseJson.users,
          isResult: true,
        }, function () {

        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ 
          users: ["no users found..",],
          isResult: false,
        });
      });
  };

  onButtonPress = () => {

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
              color='red'
              onPress={this.onButtonPress}
              />}
            key={item.item}
            title={'@' + item.item}
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