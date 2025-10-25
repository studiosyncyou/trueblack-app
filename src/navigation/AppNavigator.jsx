import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/home/HomeScreen';
import MenuScreen from '../screens/menu/MenuScreen';
import ItemDetailScreen from '../screens/menu/ItemDetailScreen';
import CartScreen from '../screens/cart/CartScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

import { colors } from '../config/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack for Menu -> ItemDetail -> Cart
const MenuStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MenuMain" component={MenuScreen} />
      <Stack.Screen 
        name="ItemDetail" 
        component={ItemDetailScreen}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  const cartTotal = useSelector((state) => state.cart?.totalQuantity || 0);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
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
          tabBarLabel: 'Menu',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon 
              name={focused ? 'cafe' : 'cafe-outline'} 
              color={color} 
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Pay in Store"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'Pay in Store',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon 
              name={focused ? 'scan' : 'scan-outline'} 
              color={color} 
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="My Orders"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'My Orders',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon 
              name={focused ? 'receipt' : 'receipt-outline'} 
              color={color} 
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon 
              name={focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline'} 
              color={color} 
              size={24}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  // FIXED: Properly check auth state from Redux
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated || false);

  console.log('Auth State:', isAuthenticated); // Debug log

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Show login screen if not authenticated
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        // Show main app if authenticated
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
