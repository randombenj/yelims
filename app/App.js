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
  Home: { screen: MainScreen },
  Add: { screen: AddScreen },
  Map: { screen: MapScreen },
  Search: { screen: SearchScreen },
  Profile: { screen: ProfileScreen },
  Logout: { screen: LoginScreen },
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
      } else if (routeName === 'Logout') {
        iconName = 'ios-key';
      } else if (routeName === 'Add') {
        iconName = 'md-add-circle';
      }

      // You can return any component that you like here! We usually use an
      // icon component from react-native-vector-icons
      return <Ionicons name={iconName} size={25} color={tintColor} />;
    },
  }),
  initialRouteName: 'Logout',
  tabBarOptions: {
    activeTintColor: 'tomato',
    inactiveTintColor: 'gray',
  },
});

export default App;