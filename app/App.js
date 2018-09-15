import React from 'react';
import { createBottomTabNavigator, } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { MainScreen } from './screens/MainScreen';
import { MapScreen } from './screens/MapScreen';
import { SearchScreen } from './screens/SearchScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { LoginScreen } from './screens/LoginScreen';
import { AddScreen } from './screens/AddScreen';


const App = createBottomTabNavigator({
  Login: { screen: LoginScreen },
  Home: { screen: MainScreen },
  Map: { screen: MapScreen },
  Search: { screen: SearchScreen },
  Profile: { screen: ProfileScreen },
  Add: { screen: AddScreen },
},
{
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      if (routeName === 'Home') {
        iconName = `ios-heart`;
      } else if (routeName === 'Map') {
        iconName = `md-map`;
      } else if (routeName === 'Search') {
        iconName = 'ios-search';
      } else if (routeName === 'Profile') {
        iconName = 'md-analytics';
      } else if (routeName === 'Login') {
        iconName = 'ios-key';
      }

      // You can return any component that you like here! We usually use an
      // icon component from react-native-vector-icons
      return <Ionicons name={iconName} size={25} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: 'tomato',
    inactiveTintColor: 'gray',
  },
});

export default App;