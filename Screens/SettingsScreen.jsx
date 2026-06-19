import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import BottomNavigation from '../Components/BottomNavigation';
import { getAuth, signOut } from 'firebase/auth';


const SettingsScreen = () => {
  const auth = getAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);  // signs out the user
      // No need to navigate manually — App.js will detect auth state change
    } catch (error) {
      alert("Error signing out: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>SettingsScreen Coming Soon</Text>
      <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      <BottomNavigation/>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoutButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'red',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
