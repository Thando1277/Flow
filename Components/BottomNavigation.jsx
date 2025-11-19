import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { use } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useNavigationState } from '@react-navigation/native';



const BottomNavigation = () => {
    const navigation = useNavigation();
    const state = useNavigationState(state => state);
    const currentRoute = state.routes[state.index].name;

  return (
    <View style={styles.container}>
        <TouchableOpacity style={{alignItems: 'center'}} onPress={() => navigation.replace('HomeScreen')}>
            <Ionicons name="home-outline" size={28} color={currentRoute === 'HomeScreen' ? "#007bff" : "#000000ff"}/>
            <Text style={{
                color: currentRoute === 'HomeScreen' ? '#007bff' : '#000000ff'
            }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{alignItems: 'center'}} onPress={() => navigation.replace('TransactionScreen')}>
            <Ionicons name="wallet-outline" size={28} color={currentRoute === 'TransactionScreen' ? "#007bff" : "#000000ff"}/>
            <Text style={{
                color: currentRoute === 'TransactionScreen' ? '#007bff' : '#000000ff'
            }}>Transaction</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{alignItems: 'center'}} onPress={() => navigation.replace('ReportsScreen')}>
            <Ionicons name="document-outline" size={28} color={currentRoute === 'ReportsScreen' ? "#007bff" : "#000000ff"}/>
            <Text style={{
                color: currentRoute === 'ReportsScreen' ? '#007bff' : '#000000ff'
            }}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{alignItems: 'center'}} onPress={() => navigation.replace('SettingsScreen')}>
            <Ionicons name="settings-outline" size={28} color={currentRoute === 'SettingsScreen' ? "#007bff" : "#000000ff"}/>
            <Text style={{
                color: currentRoute === 'SettingsScreen' ? '#007bff' : '#000000ff'
            }}>Settings</Text>
        </TouchableOpacity>
    </View>
  )
}

export default BottomNavigation

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 50,
        width: '100%',
        backgroundColor: '#eeebebff',
        padding: 7,
        position: 'absolute',
        top: 667,
        height: 86,
        justifyContent: 'center'
    },
})