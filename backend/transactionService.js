import { doc, setDoc, updateDoc, getDoc, Timestamp } from 'firebase/firestore'
import { db } from '../Firebase/FirebaseConfig'
import { getAuth } from 'firebase/auth'

export const addTransaction = async ({ transactionDate, amount, Catvalue, typeValue, notes }) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("User not authenticated");

    if (
        transactionDate.trim() === "" ||
        amount.trim() === "" ||
        Catvalue.trim() === "" ||
        typeValue.trim() === ""
    ) {
        throw new Error("MISSING_FIELDS");
    }

    const transactionRef = doc(db, 'transactions', user.uid + "_" + new Date().getTime());

    await setDoc(transactionRef, {
        UserID: user.uid,
        Date: transactionDate,
        Amount: parseFloat(amount) || 0,
        Category: Catvalue,
        Type: typeValue,
        Notes: notes,
        CreatedAt: Timestamp.fromDate(new Date())
    });

    // Update user balance
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        let currentBalance = userSnap.data().balance;
        let currentMonthlyIncome = userSnap.data().monthlyIncome;
        let currentMonthlyExpenses = userSnap.data().monthlyExpenses;
        const parsedAmount = parseFloat(amount);

        if (typeValue === 'income') {
            currentBalance += parsedAmount;
            currentMonthlyIncome += parsedAmount;
        } else {
            currentBalance -= parsedAmount;
            currentMonthlyExpenses += parsedAmount;
        }

        await updateDoc(userRef, {
            balance: parseFloat(currentBalance),
            monthlyIncome: parseFloat(currentMonthlyIncome),
            monthlyExpenses: parseFloat(currentMonthlyExpenses)
        });
    }
};