import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const SpendingOverView = () => {
  return (
    <View style={styles.container}>
        <View style={styles.incomeBox}>
            <Text style={styles.Headingtext}>Monthly Income</Text>
            <View style={styles.amount}>
                <Text style={styles.textAmount}>R5 600</Text>
            </View>
        </View>
        <View style={styles.expenseBox}>
            <Text style={styles.Headingtext}>Monthly Expenses</Text>
            <View style={styles.amount}>
                <Text style={styles.textAmount}>R3 450</Text>
            </View>
        </View>
    </View>
  )
}

export default SpendingOverView

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 69
    },
    incomeBox: {
        backgroundColor: '#d3d3d3ff',
        width: 150,
        height: 100,
        borderRadius: 10,
        marginLeft: 10,
        marginTop: 30,
        padding: 5
    },
    expenseBox: {
        backgroundColor: '#d3d3d3ff',
        width: 150,
        height: 100,
        borderRadius: 10,
        marginTop: 30,
        padding: 5
    },
    Headingtext: {
        fontSize: 11
    },
    amount: {
        margin: 20
    },
    textAmount: {
        fontSize: 25,
        fontWeight: 'bold'
    }
})