import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { use } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const BottomNavigation = () => {
    const navigation = useNavigation();

  return (
    <View style={styles.container}>
        <TouchableOpacity style={{alignItems: 'center'}} onPress={() => navigation.replace('HomeScreen')}>
            <Ionicons name="home-outline" size={28} color="#007bff"/>
            <Text style={styles.text}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{alignItems: 'center'}} onPress={() => navigation.replace('TransactionScreen')}>
            <Ionicons name="wallet-outline" size={28}/>
            <Text style={styles.text}>Transaction</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{alignItems: 'center'}} onPress={() => navigation.replace('ReportsScreen')}>
            <Ionicons name="document-outline" size={28}/>
            <Text style={styles.text}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{alignItems: 'center'}} onPress={() => navigation.replace('SettingsScreen')}>
            <Ionicons name="settings-outline" size={28}/>
            <Text style={styles.text}>Settings</Text>
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
    text: {
        fontSize: 14,
    }
})