import {AppRegistry} from 'react-native';
import 'react-native-get-random-values';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerHeadlessTask('smsRecieved', () =>
  require('./headlessTasks/smsRecieved'),
);

AppRegistry.registerHeadlessTask('callHandler', () =>
  require('./headlessTasks/callHandler'),
);
