import {
  createStackNavigator,
} from 'react-navigation';
import { MainScreen } from './MainScreen';
import { MapScreen } from './MapScreen';

const App = createStackNavigator({
  Home: { screen: MainScreen },
  Map: { screen: MapScreen },  
});
export default App;