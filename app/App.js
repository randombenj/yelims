import {
  createStackNavigator,
} from 'react-navigation';
import { MainScreen } from './MainScreen';

const App = createStackNavigator({
  Home: { screen: MainScreen },
});

export default App;