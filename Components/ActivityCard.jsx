import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ActivityCard = () => {
  return (
    <View style={styles.container}>

      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.note}>Monthly Salary</Text>
          <Text style={styles.description}>Salary • 13 June</Text>
        </View>
        <Text style={styles.amountPositive}>+ R30,100</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.note}>Gift from Mom</Text>
          <Text style={styles.description}>Gift • 13 June</Text>
        </View>
        <Text style={styles.amountPositive}>+ R100</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.note}>Bought Groceries</Text>
          <Text style={styles.description}>Groceries • 13 June</Text>
        </View>
        <Text style={styles.amountNegative}>- R1,000</Text>
      </View>

    </View>
  )
}

export default ActivityCard

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#d3d3d3ff',
    width: '95%',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 20,
    alignSelf: 'center'
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12
  },

  left: {
    flex: 1
  },

  note: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000'
  },

  description: {
    fontSize: 13,
    color: '#555',
    marginTop: 2
  },

  amountPositive: {
    fontSize: 16,
    fontWeight: '600',
    color: '#26aa4b'
  },

  amountNegative: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff0000'
  },

  separator: {
    height: 1,
    backgroundColor: '#f3f3f3'
  }
})
