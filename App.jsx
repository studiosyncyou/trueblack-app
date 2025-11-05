import React from 'react';
import { StatusBar, LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import store from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}

export default App;
