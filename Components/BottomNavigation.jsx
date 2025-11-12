import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';


const BottomNavigation = () => {
  return (
    <View style={styles.container}>
        <TouchableOpacity style={{alignItems: 'center'}}>
            <Ionicons name="home-outline" size={28} color="#007bff"/>
            <Text style={styles.text}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{alignItems: 'center'}}>
            <Ionicons name="wallet-outline" size={28}/>
            <Text style={styles.text}>Transaction</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{alignItems: 'center'}}>
            <Ionicons name="document-outline" size={28}/>
            <Text style={styles.text}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{alignItems: 'center'}}>
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
        bottom: -583,
        height: 86,
        justifyContent: 'center'
    },
    text: {
        fontSize: 14,
    }
})