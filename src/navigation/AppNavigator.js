import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

// Screens
import SplashScreen from '../screens/splash/SplashScreen';
import LocationLoginScreen from '../screens/auth/LocationLoginScreen';
import HomeScreen from '../screens/home/HomeScreen';
import AnimatedTabBar from '../components/AnimatedTabBar';
import MenuScreen from '../screens/menu/MenuScreen';
import StoreSelectorScreen from '../screens/stores/StoreSelectorScreen';
import ItemDetailModal from '../screens/menu/ItemDetailModal';
import SpacesScreen from '../screens/spaces/SpacesScreen';
import SpaceDetailScreen from '../screens/spaces/SpaceDetailScreen';
import SearchScreen from '../screens/search/SearchScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import OrderConfirmationScreen from '../screens/orders/OrderConfirmationScreen';
import OrdersHistoryScreen from '../screens/orders/OrdersHistoryScreen';
import QRScannerScreen from '../screens/qr/QRScannerScreen';

import { colors } from '../config/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();

// Menu Stack (for Item Detail Modal)
const MenuStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MenuMain" component={MenuScreen} />
      <Stack.Screen 
  name="StoreSelector" 
  component={StoreSelectorScreen}
  options={{ headerShown: false }}
/>
    </Stack.Navigator>
  );
};

// Main Tab Navigator (5 tabs)
const TabNavigator = () => {
  const [tabsVisible, setTabsVisible] = React.useState(false);

  // Expose setTabsVisible to child screens via context or ref
  React.useEffect(() => {
    // Store in global navigation params
    global.setTabsVisible = setTabsVisible;
  }, []);

  return (
    <Tab.Navigator
      tabBar={(props) => <AnimatedTabBar {...props} visible={tabsVisible} />}
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'HOME',
          tabBarIcon: ({ color, focused }) => (
            <Icon 
              name={focused ? 'home' : 'home-outline'} 
              color={color} 
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuStack}
        options={{
          tabBarLabel: 'MENU',
          tabBarIcon: ({ color, focused }) => (
            <Icon 
              name={focused ? 'grid' : 'grid-outline'} 
              color={color} 
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Spaces"
        component={SpacesScreen}
        options={{
          tabBarLabel: 'SPACES',
          tabBarIcon: ({ color, focused }) => (
            <Icon 
              name={focused ? 'location' : 'location-outline'} 
              color={color} 
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'SEARCH',
          tabBarIcon: ({ color, focused }) => (
            <Icon 
              name={focused ? 'search' : 'search-outline'} 
              color={color} 
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'PROFILE',
          tabBarIcon: ({ color, focused }) => (
            <Icon 
              name={focused ? 'person' : 'person-outline'} 
              color={color} 
              size={24}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator with Modal
const AppStack = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabs" component={TabNavigator} />
      <RootStack.Group screenOptions={{ presentation: 'modal' }}>
        <RootStack.Screen 
          name="ItemDetail" 
          component={ItemDetailModal}
          options={{
            presentation: 'transparentModal',
            cardStyle: { backgroundColor: 'transparent' },
            cardOverlayEnabled: true,
          }}
          
        />
      </RootStack.Group>
      <RootStack.Screen name="Cart" component={CartScreen} />
      <RootStack.Screen name="Checkout" component={CheckoutScreen} />
      <RootStack.Screen name="QRScanner" component={QRScannerScreen} />
      <RootStack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
      <RootStack.Screen name="OrdersHistory" component={OrdersHistoryScreen} />
      <RootStack.Screen name="SpaceDetail" component={SpaceDetailScreen} />
    </RootStack.Navigator>
  );
};

// Root Navigator (handles auth flow)
const AppNavigator = () => {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated || false);
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    // Show splash for 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="LocationLogin" component={LocationLoginScreen} />
      ) : (
        <Stack.Screen name="App" component={AppStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
