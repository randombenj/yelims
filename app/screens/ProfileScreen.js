import React from 'react';
import { Text } from 'react-native';

export class ProfileScreen extends React.Component {
    static navigationOptions = {
      title: 'Profile',
    };
    render() {
        return (
            <Text>This is the profile screen..</Text>
        );
    }
  }