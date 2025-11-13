import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import SignUp from './Screens/SignUp';
import HomeScreen from './Screens/HomeScreen';
import LogInScreen from './Screens/LogInScreen';
import ReportsScreen from './Screens/ReportsScreen';
import TransactionScreen from './Screens/TransactionScreen';
import SettingsScreen from './Screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='SignUp' component={SignUp}/>
        <Stack.Screen name='HomeScreen' component={HomeScreen}/>
        <Stack.Screen name='LogInScreen' component={LogInScreen}/>
        <Stack.Screen name='TransactionScreen' component={TransactionScreen}/>
        <Stack.Screen name='ReportsScreen' component={ReportsScreen}/>
        <Stack.Screen name='SettingsScreen' component={SettingsScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
