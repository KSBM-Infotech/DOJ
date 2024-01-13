/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Provider } from 'react-redux';
import {store} from './redux/store/store';
import 'react-native-reanimated'
import 'react-native-gesture-handler'

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

const RNRedux = () => {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  };

AppRegistry.registerComponent(appName, () => RNRedux);

