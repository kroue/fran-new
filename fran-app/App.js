import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
import Register from './screens/Register';
import Menu from './screens/Menu';
import Order from './screens/Order';
import Tracking from './screens/Tracking';
import OrderHistory from './screens/OrderHistory';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Tracking" component={Tracking} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="Order" component={Order} />
        <Stack.Screen name="OrderHistory" component={OrderHistory} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}