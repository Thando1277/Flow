import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './Firebase/FirebaseConfig';

// Screens
import SignUp from './Screens/SignUp';
import HomeScreen from './Screens/HomeScreen';
import LogInScreen from './Screens/LogInScreen';
import ReportsScreen from './Screens/ReportsScreen';
import TransactionScreen from './Screens/TransactionScreen';
import SettingsScreen from './Screens/SettingsScreen';
import AddTransactionScreen from './Screens/AddTransactionScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const auth = getAuth();

  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  if (initializing) return null; // loading while Firebase checks session

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* IF USER IS LOGGED IN → SHOW HOME & OTHERS */}
        {user ? (
          <>
            <Stack.Screen name='HomeScreen' component={HomeScreen} />
            <Stack.Screen name='TransactionScreen' component={TransactionScreen} />
            <Stack.Screen name='ReportsScreen' component={ReportsScreen} />
            <Stack.Screen name='SettingsScreen' component={SettingsScreen} />
            <Stack.Screen name='AddTransactionScreen' component={AddTransactionScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name='LogInScreen' component={LogInScreen} options={{headerShown: false}}/>
            <Stack.Screen name='SignUp' component={SignUp} options={{headerShown: false}}/>
          </>
        )}

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
