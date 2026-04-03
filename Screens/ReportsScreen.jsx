import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import BottomNavigation from '../Components/BottomNavigation'

const ReportsScreen = () => {
  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.ReportTextContainer}>
            <Text style={styles.reportText}>Reports</Text>
          </View>

          <View style={styles.chartContainer}>
            <Text
              style={{fontWeight: '100', fontSize: '12'}}
            >Total Wealth</Text>
            <View style={styles.amountContainer}>
              <Text style={{fontWeight: 'bold', fontSize: 20}}>R12 000</Text>
            </View>
          </View>

          <View style={styles.monthlyOverView}>
            <Text
              style={{fontWeight: '100', fontSize: '12'}}
            >Monthly Overview</Text>
            <View style={styles.amountContainer}>
              <Text style={{fontWeight: 'bold', fontSize: 20}}>R6 240</Text>
            </View>
          </View>

        </View>
      </ScrollView>
      <BottomNavigation/>
    </View>
  )
}

export default ReportsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  ReportTextContainer: {
    marginTop: 80,
    marginLeft: 165
  },
  reportText: {
    fontSize: 16,
    fontWeight: '400'
  },
  chartContainer: {
    backgroundColor: 'white',
    width: 350,
    height: 350,
    marginLeft: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 10
  },
  monthlyOverView: {
    backgroundColor: 'white',
    width: 350,
    height: 350,
    marginLeft: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 10
  },
  amountContainer: {
    marginTop: 6,
    marginLeft: 5
  }
})