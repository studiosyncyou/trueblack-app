import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import store from './src/store/store'; // UPDATED: Changed from './src/redux/store'
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/config/theme';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor="#000000" />
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}

export default App;
