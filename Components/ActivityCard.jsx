import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ActivityCard = () => {
  return (
    <View style={styles.container}>
        <View style={[styles.innerContainer, {top: 69}]}></View>
        <View style={[styles.innerContainer, { top: 135}]}></View>
        <View style={[styles.innerContainer]}></View>
    </View>
  )
}

export default ActivityCard

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#d3d3d3ff',
        width: 367,
        height: 195,
        marginLeft: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    innerContainer: {
        width: '100%',
        height: 1,
        backgroundColor: '#f3f3f3',
        position: 'absolute',
    }
})