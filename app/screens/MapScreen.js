import React from 'react';
import { Button } from 'react-native';

export class MapScreen extends React.Component {
    static navigationOptions = {
      title: 'Welcome',
    };
    render() {
      const { navigate } = this.props.navigation;
      return (
        <Button
          title="Go back ~(o_o)~"
          onPress={() =>
            navigate('Home')
          }
        />
      );
    }
  }