import {
  createBottomTabNavigator,
} from 'react-navigation';
import { MainScreen } from './screens/MainScreen';
import { MapScreen } from './screens/MapScreen';
import { SearchScreen } from './screens/SearchScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { LoginScreen } from './screens/LoginScreen';

const App = createBottomTabNavigator({
  Home: { screen: MainScreen },
  Map: { screen: MapScreen },
  Search: { screen: SearchScreen },
  Profile: { screen: ProfileScreen },
  Login: { screen: LoginScreen },
});


export default App;