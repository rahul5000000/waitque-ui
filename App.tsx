import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LandingScreen from './src/screens/LandingScreen';
import "./global.css";
import { AppProvider } from './src/hooks/AppContext';
import LeadEntryScreen from './src/screens/LeadEntry';
import LeadConfirmationScreen from './src/screens/LeadConfirmationScreen';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LeadEntry" component={LeadEntryScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LeadConfirmation" component={LeadConfirmationScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast/>
    </AppProvider>
  );
}