import { StyleSheet, Text, View } from 'react-native'
import {useState, useEffect} from 'react'
import { doc, onSnapshot} from 'firebase/firestore'
import { auth, db} from '../Firebase/FirebaseConfig'

const SpendingOverView = () => {
    const [monthlyIncome, setMonthlyIncome] = useState("");
    const [monthlyExpenses, setMonthlyExpenses] = useState("");

    const user = auth.currentUser;

    useEffect(() => {
        if(!user) return;

        const userRef = doc(db, 'users', user.uid);
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if(docSnap.exists()){
                setMonthlyIncome(docSnap.data().monthlyIncome)
                setMonthlyExpenses(docSnap.data().monthlyExpenses)
            }
        });
        return () => unsubscribe();
    }, [user]);
    
  return (
    <View style={styles.container}>
        <View style={styles.incomeBox}>
            <Text style={styles.Headingtext}>Monthly Income</Text>
            <View style={styles.amount}>
                <Text style={styles.textAmount}>R{monthlyIncome}</Text>
            </View>
        </View>
        <View style={styles.expenseBox}>
            <Text style={styles.Headingtext}>Monthly Expenses</Text>
            <View style={styles.amount}>
                <Text style={styles.textAmount}>R{monthlyExpenses}</Text>
            </View>
        </View>
    </View>
  )
}

export default SpendingOverView

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 20
    },
    incomeBox: {
        backgroundColor: 'rgb(255, 255, 255)',
        width: 180,
        height: 95,
        borderRadius: 10,
        padding: 5,
        marginLeft: 5,
        marginTop: 20
    },
    expenseBox: {
        backgroundColor: 'rgb(255, 255, 255)',
        width: 180,
        height: 95,
        borderRadius: 10,
        padding: 5,
        marginTop: 20
    },
    Headingtext: {
        fontSize: 13,
        marginLeft: 10,
        color: 'rgb(122, 122, 122)'
    },
    amount: {
        margin: 20,
    },
    textAmount: {
        fontSize: 25,
        fontWeight: '300'
    }
})