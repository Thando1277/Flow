import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../Firebase/FirebaseConfig';

const BalanceCard = () => {
  const [balance, setBalance] = useState(0);
  const user = auth.currentUser;

  useEffect(() => {
    if(!user) return;

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if(docSnap.exists()){
        setBalance(docSnap.data().balance);
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.headings}>
        <Text>Total Balance</Text>
        <TouchableOpacity style={styles.accountDetailsBtn}>
          <Text style={{textDecorationLine: 'underline'}}>Account Details</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.balanceHeading}>
        <Text style={styles.balance}>R{balance}</Text>
      </View>
    </View>
  )
}

export default BalanceCard

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#60AFFF',
    height: 130,
    width:  369,
    marginTop: 25,
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
    marginTop: 24
  },
  balance: {
    fontSize: 32
  }
})