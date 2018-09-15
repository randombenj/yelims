import {
  createBottomTabNavigator,
} from 'react-navigation';
import { MainScreen } from './screens/MainScreen';
import { MapScreen } from './screens/MapScreen';
import { SearchScreen } from './screens/SearchScreen';
import { ProfileScreen } from './screens/ProfileScreen';

const App = createBottomTabNavigator({
  Home: { screen: MainScreen },
  Map: { screen: MapScreen },
  Search: { screen: SearchScreen },
  Profile: { screen: ProfileScreen },
});
export default App;