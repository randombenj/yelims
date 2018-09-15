import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };
  render() {
    return (
      <View style={styles.view}>
        <Text>This is the profile screen..</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    marginTop: 24,
  },
});