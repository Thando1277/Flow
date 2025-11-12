import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Loader = () => {
  return (
    <View style={styles.spinner}>
    </View>
  )
}

export default Loader

const styles = StyleSheet.create({
    spinner: {
        backgroundColor: 'black',
        width: 100,
        height: 100
    }
})