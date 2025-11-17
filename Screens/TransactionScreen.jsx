import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { useRef, useState } from 'react';
import BottomNavigation from '../Components/BottomNavigation';
import TransactionIncome from '../Components/TransactionIncome';
import TransactionExpenses from '../Components/TransactionExpenses';
import { Ionicons } from '@expo/vector-icons';

const TransactionScreen = () => {
  const [selected, setSelected] = useState('Income');
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggle = (type) => {
    setSelected(type);

    Animated.timing(slideAnim, {
      toValue: type === 'Income' ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 195], 
  });

  const displaySelectedCard = () => {
    if(selected === 'Income'){
      return <TransactionIncome/>
    }else if (selected === 'Expenses'){
      return <TransactionExpenses/>
    }
  }

  return (
    <View style={styles.container}>

      <View style={styles.toggleContainer}>
        <Animated.View 
          style={[styles.slider, { transform: [{ translateX }] }]}
        />

        <TouchableOpacity style={styles.option} onPress={() => toggle('Income')}>
          <Text style={[styles.text, selected === 'Income' && styles.activeText]}>
            Income
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => toggle('Expenses')}>
          <Text style={[styles.text, selected === 'Expenses' && styles.activeText]}>
            Expenses
          </Text>
        </TouchableOpacity>
      </View>
      {displaySelectedCard()}
      <BottomNavigation />
      <TouchableOpacity style={styles.addTransaction}>
        <Ionicons name='add' size={40} color='white'/>
      </TouchableOpacity>
    </View>
  );
};

export default TransactionScreen;


const styles = StyleSheet.create({
  toggleContainer: {
    width: '90%',
    height: 60,
    backgroundColor: "#c4c4c4ff",
    borderRadius: 10,
    flexDirection: "row",
    padding: 3,
    position: "relative",
    marginLeft: 20,
    marginTop: 30,
  },

  slider: {
    width: 150,
    height: "100%",
    backgroundColor: "#ebebebd9",
    borderRadius: 10,
    position: "absolute",
    top: 3,
    left: 3,
  },

  option: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },

  text: {
    color: "#555",
    fontWeight: "600",
  },

  activeText: {
    color: "#000",
  },
  addTransaction: {
    position: 'absolute',
    bottom: 110,
    right: 20,
    backgroundColor: '#60AFFF',
    borderRadius: 100,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1
  }
});
