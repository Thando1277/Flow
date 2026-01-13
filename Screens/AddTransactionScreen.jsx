import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, ScrollView, KeyboardAvoidingView, Alert, Modal } from 'react-native'
import { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import DropDownPicker from 'react-native-dropdown-picker'
import { Ionicons } from '@expo/vector-icons'
import { doc, setDoc, updateDoc, getDoc, Timestamp } from 'firebase/firestore'
import { db } from '../Firebase/FirebaseConfig';
import { getAuth } from 'firebase/auth'

const AddTransactionScreen = () => {
    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [transactionDate, setTransactionDate] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    const [amount, setAmount] = useState("");
    const [notes, setNotes] = useState("");
    
    const [Catopen, setCatOpen] = useState(false);
    const [Catvalue, setCatValue] = useState('');
    const [Catitems, setCatItems] = useState([
        {label: '+ Add Category', value: 'addYourOwnCategory'},
        {label: 'Salary', value: 'salary'},
        {label: 'Savings', value: 'savings'},
        {label: 'Gift', value: 'gift'},
        {label: 'Groceries', value: 'groceries'},
        {label: 'Electricity', value: 'electricity'},
        {label: 'Water', value: 'water'},
        {label: 'Entertainment', value: 'entertainment'},
    ]);

    const [typeOpen, setTypeOpen] = useState(false);
    const [typeValue, setTypeValue] = useState('');
    const [typeItems, setTypeItems] = useState([
        {label: 'Income', value: 'income'},
        {label: 'Expense', value: 'expense'},
    ]);

    const toggleDatePicker = () => setShowPicker(!showPicker);

    const confrimIOSDate = () => {
        setTransactionDate(date.toDateString());
        toggleDatePicker();
    };

    const handleCategoryOpen = (open) => {
        setCatOpen(open);
        if (open) setTypeOpen(false);
    };

    const handleTypeOpen = (open) => {
        setTypeOpen(open);
        if (open) setCatOpen(false);
    };

    const handleAddCategory = () => {
        if (newCategory.trim() === '') return;

        setCatItems((prev) => [
            ...prev,
            { label: newCategory, value: newCategory.toLowerCase() }
        ]);

        Alert.alert("Success", `${newCategory} added to your categories`);
        setNewCategory('');
        setModalVisible(false);
    };

    const addTransaction = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        const transactionRef = doc(db, 'transactions', user.uid + "_" + new Date().getTime());

        if(transactionDate.trim() === "" || amount.trim() === "" || Catvalue.trim() ==="" || typeValue.trim() === ""){
            Alert.alert("Fill all missing input fields");
            return;
        }else {
            try{
                await setDoc(transactionRef, {
                    UserID: user.uid,
                    Date: transactionDate,
                    Amount: parseFloat(amount) || 0,
                    Category: Catvalue,
                    Type: typeValue,
                    Notes: notes,
                    CreatedAt: Timestamp.fromDate(new Date())

                })
                Alert.alert('Transaction Added.');
                setTransactionDate("");
                setAmount("");
                setCatValue("");
                setTypeValue("");
                setNotes("");
            }catch (error){
                Alert.alert('Something went wrong', error.message);
            }

            //update balance
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            let currentBalance = userSnap.data().balance;
            let currentMonthlyIncome = userSnap.data().monthlyIncome;
            let currentMonthlyExpenses = userSnap.data().monthlyExpenses;

            if(userSnap.exists()){
                if (typeValue == 'income'){
                    currentBalance += amount
                    currentMonthlyIncome += amount
                }else{
                    currentBalance -= amount
                    currentMonthlyExpenses += amount
                }
            }
            await updateDoc(userRef, {
                balance: parseFloat(currentBalance),
                monthlyIncome: parseFloat(currentMonthlyIncome),
                monthlyExpenses: parseFloat(currentMonthlyExpenses)
            })
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
            <ScrollView 
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
            >

                {showPicker && (
                    <DateTimePicker
                        value={date}
                        display="spinner"
                        mode="date"
                        maximumDate={new Date()}
                        onChange={(_, selectedDate) => {
                            if (Platform.OS === 'android') {
                                toggleDatePicker();
                                if (selectedDate) {
                                    setDate(selectedDate);
                                    setTransactionDate(selectedDate.toDateString());
                                }
                            } else {
                                setDate(selectedDate || date);
                            }
                        }}
                        style={styles.picker}
                    />
                )}

                {showPicker && Platform.OS === 'ios' && (
                    <View style={styles.CCbuttons}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={toggleDatePicker}>
                            <Text style={styles.btnText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cBtn} onPress={confrimIOSDate}>
                            <Text style={styles.btnText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {!showPicker && (
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Date</Text>
                        <TouchableOpacity onPress={toggleDatePicker}>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="calendar-outline" size={20} style={styles.icon} />
                                <TextInput
                                    placeholder={date.toString().slice(0, 15)}
                                    style={styles.input}
                                    editable={false}
                                    value={transactionDate}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                )}

                <Modal
                    animationType="fade"
                    transparent
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalBox}>
                            
                            {/* Close */}
                            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={22} color="#333" />
                            </TouchableOpacity>

                            <Text style={styles.modalTitle}>Add New Category</Text>

                            <TextInput
                                placeholder="Category name"
                                style={styles.modalInput}
                                value={newCategory}
                                onChangeText={setNewCategory}
                            />

                            <TouchableOpacity style={styles.modalAddBtn} onPress={handleAddCategory}>
                                <Text style={styles.modalAddBtnText}>Add Category</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>
                {/* ================================= */}

                {/* AMOUNT */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Amount</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="card-outline" size={20} style={styles.icon} />
                        <TextInput
                            placeholder="R: "
                            style={styles.input}
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={text => setAmount(text)}
                        />
                    </View>
                </View>

                {/* CATEGORY */}
                <View style={[styles.fieldContainer, { zIndex: 3000, marginBottom: Catopen ? 180 : 20 }]}>
                    <Text style={styles.label}>Category</Text>
                    <DropDownPicker
                        open={Catopen}
                        value={Catvalue}
                        items={Catitems}
                        setOpen={handleCategoryOpen}
                        setValue={setCatValue}
                        setItems={setCatItems}
                        placeholder="Select Category"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownList}
                        listMode="SCROLLVIEW"
                        scrollViewProps={{ nestedScrollEnabled: true }}
                        zIndex={3000}
                        zIndexInverse={1000}
                        onChangeValue={(value) => {
                            if (value === 'addYourOwnCategory') {
                                setModalVisible(true);
                            }
                        }}
                    />
                </View>

                {/* TYPE */}
                <View style={[styles.fieldContainer, { zIndex: 2000, marginBottom: typeOpen ? 120 : 20 }]}>
                    <Text style={styles.label}>Type</Text>
                    <DropDownPicker
                        open={typeOpen}
                        value={typeValue}
                        items={typeItems}
                        setOpen={handleTypeOpen}
                        setValue={setTypeValue}
                        setItems={setTypeItems}
                        placeholder="Select Type"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownList}
                        listMode="SCROLLVIEW"
                        scrollViewProps={{ nestedScrollEnabled: true }}
                        zIndex={2000}
                        zIndexInverse={2000}
                    />
                </View>

                {/* NOTES */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Notes</Text>
                    <TextInput
                        placeholder="Notes"
                        style={styles.standardInput}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                        value={notes}
                        onChangeText={(text) => setNotes(text)}
                    />
                </View>

                {/* SAVE BUTTON */}
                <TouchableOpacity style={styles.saveBtn} onPress={addTransaction}>
                    <Text style={styles.saveTxt}>Save</Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AddTransactionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },

    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },

    fieldContainer: {
        marginBottom: 20,
    },

    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '500',
        color: '#333',
    },

    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#d0d0d0',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 50,
    },

    icon: {
        marginRight: 8,
        color: '#555',
    },

    input: {
        flex: 1,
        fontSize: 15,
    },

    standardInput: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#d0d0d0',
        borderRadius: 10,
        padding: 12,
        minHeight: 60,
        fontSize: 15,
    },

    dropdown: {
        borderRadius: 10,
        borderColor: '#d0d0d0',
        backgroundColor: 'white',
        minHeight: 50,
    },

    dropdownList: {
        borderColor: '#d0d0d0',
        backgroundColor: 'white',
        maxHeight: 150,
    },

    saveBtn: {
        backgroundColor: '#60AFFF',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },

    saveTxt: {
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white',
    },

    picker: {
        height: 120,
    },

    CCbuttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        marginBottom: 20,
    },

    cBtn: {
        backgroundColor: '#60AFFF',
        borderRadius: 10,
        height: 40,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },

    cancelBtn: {
        backgroundColor: '#8d8d8d',
        borderRadius: 10,
        height: 40,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },

    btnText: {
        color: 'white',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 25,
    },

    modalBox: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10,
        position: 'relative',
    },

    modalCloseBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        padding: 4,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        color: '#333',
    },

    modalInput: {
        width: '100%',
        height: 45,
        borderWidth: 1,
        borderColor: '#c8c8c8',
        borderRadius: 10,
        paddingHorizontal: 12,
        fontSize: 15,
        backgroundColor: '#fafafa',
        marginBottom: 15,
    },

    modalAddBtn: {
        backgroundColor: '#60AFFF',
        width: '100%',
        height: 45,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalAddBtnText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});
