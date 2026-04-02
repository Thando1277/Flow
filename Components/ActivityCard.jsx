import { StyleSheet, Text, View } from 'react-native'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'

const ActivityCard = () => {
    const [notes, setNotes] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");


useEffect(() => {
  const auth = getAuth();
  const db = getFirestore();

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) return;

    const q = query(
      collection(db, "transactions"),
      where("UserID", "==", user.uid)
    );

    return onSnapshot(q, (snapshot) => {
      const notes = snapshot.docs.map(doc => doc.data().Notes);
      setNotes(notes);
    });
  });

  return unsubscribe;
}, []);



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
          <Text style={styles.note}>{notes}</Text>
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
    backgroundColor: 'rgb(255, 255, 255)',
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
    color: '#000000',
  },

  description: {
    fontSize: 13,
    color: '#050505',
    marginTop: 2,
    fontWeight: '300'
  },

  amountPositive: {
    fontSize: 16,
    fontWeight: '600',
    color: '#26aa4b',
    fontWeight: 250
  },

  amountNegative: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff0000',
    fontWeight: '250'
  },

  separator: {
    height: 1,
    backgroundColor: '#f3f3f3'
  }
})
