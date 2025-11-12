import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import BalanceCard from '../Components/BalanceCard';
import BottomNavigation from '../Components/BottomNavigation';

const HomeScreen = () => {
  return (
    <View>
      <BalanceCard/>
      <BottomNavigation/>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})