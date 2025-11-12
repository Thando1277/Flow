import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const BalanceCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headings}>
        <Text>Total Balance</Text>
        <TouchableOpacity style={styles.accountDetailsBtn}>
          <Text style={{textDecorationLine: 'underline'}}>Account Details</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.balanceHeading}>
        <Text style={styles.balance}>R3 645, 76</Text>
      </View>
    </View>
  )
}

export default BalanceCard

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#60AFFF',
    height: 120,
    width:  369,
    marginTop: 50,
    marginLeft: 10,
    marginLeft: 10,
    borderRadius: 10,
    padding: 5

  },
  headings: {
    flexDirection: 'row',
    gap: 168
  },
  balanceHeading: {
    marginTop: 21
  },
  balance: {
    fontSize: 32
  }
})