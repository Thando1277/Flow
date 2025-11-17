import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const TransactionExpenses = () => {
  return (
    <View style={styles.container}>
        <Text style={styles.Total}>Total Expenses</Text>
        <Text style={styles.Week}>This Week</Text>
        <View style={styles.incomeCard}>
            <View style={styles.divider}></View>
            <View style={styles.divider}></View>
            <View style={styles.divider}></View>
            <View style={styles.divider}></View>
        </View>
    </View>
  )
}

export default TransactionExpenses

const styles = StyleSheet.create({
    incomeCard: {
        backgroundColor: '#dbdbdbd9',
        width: 350,
        height: 300,
        borderRadius: 10,
        marginLeft: 20,
        marginTop: 60
    },
    divider: {
        backgroundColor: 'white',
        width: '100%',
        height: 1,
        marginTop: 60
    },
    Total: {
        fontWeight: 'bold',
        position: 'absoulte',
        top: 35,
        left: 20,
        fontSize: 17
    },
    Week: {
        fontWeight: 'light',
        position: 'absolute',
        top: 60,
        right: 28,
        fontSize: 11,
        textDecorationLine: 'underline'
    }
})