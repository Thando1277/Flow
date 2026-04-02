import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  Platform, ScrollView, KeyboardAvoidingView, Alert, Modal
} from 'react-native'
import { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import DropDownPicker from 'react-native-dropdown-picker'
import { Ionicons } from '@expo/vector-icons'
import { doc, setDoc, updateDoc, getDoc, Timestamp } from 'firebase/firestore'
import { db } from '../Firebase/FirebaseConfig'
import { getAuth } from 'firebase/auth'
import BackButton from '../Components/BackButton'

const RECENT_CATEGORIES = ['Salary', 'Savings', 'Groceries', 'Gift']

const AddTransactionScreen = () => {
  const [showPicker, setShowPicker] = useState(false)
  const [date, setDate] = useState(new Date())
  const [transactionDate, setTransactionDate] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')

  const [Catopen, setCatOpen] = useState(false)
  const [Catvalue, setCatValue] = useState('')
  const [Catitems, setCatItems] = useState([
    { label: '+ Add Category', value: 'addYourOwnCategory' },
    { label: 'Salary', value: 'salary' },
    { label: 'Savings', value: 'savings' },
    { label: 'Gift', value: 'gift' },
    { label: 'Groceries', value: 'groceries' },
    { label: 'Electricity', value: 'electricity' },
    { label: 'Water', value: 'water' },
    { label: 'Entertainment', value: 'entertainment' },
  ])

  const [typeValue, setTypeValue] = useState('income')

  const toggleDatePicker = () => setShowPicker(!showPicker)

  const confirmIOSDate = () => {
    setTransactionDate(date.toDateString())
    toggleDatePicker()
  }

  const handleAddCategory = () => {
    if (newCategory.trim() === '') return
    setCatItems(prev => [
      ...prev,
      { label: newCategory, value: newCategory.toLowerCase() }
    ])
    Alert.alert('Success', `"${newCategory}" added to your categories`)
    setNewCategory('')
    setModalVisible(false)
  }

  const addTransaction = async () => {
    const auth = getAuth()
    const user = auth.currentUser

    if (!transactionDate || !amount || !Catvalue || !typeValue) {
      Alert.alert('Missing fields', 'Please fill in all required fields.')
      return
    }

    const transactionRef = doc(db, 'transactions', `${user.uid}_${Date.now()}`)

    try {
      await setDoc(transactionRef, {
        UserID: user.uid,
        Date: transactionDate,
        Amount: parseFloat(amount) || 0,
        Category: Catvalue,
        Type: typeValue,
        Notes: notes,
        CreatedAt: Timestamp.fromDate(new Date()),
      })
      Alert.alert('Transaction Added.')
      setTransactionDate('')
      setAmount('')
      setCatValue('')
      setTypeValue('income')
      setNotes('')
    } catch (error) {
      Alert.alert('Something went wrong', error.message)
      return
    }

    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const parsed = parseFloat(amount) || 0
      let { balance, monthlyIncome, monthlyExpenses } = userSnap.data()

      if (typeValue === 'income') {
        balance += parsed
        monthlyIncome += parsed
      } else {
        balance -= parsed
        monthlyExpenses += parsed
      }

      await updateDoc(userRef, {
        balance: parseFloat(balance),
        monthlyIncome: parseFloat(monthlyIncome),
        monthlyExpenses: parseFloat(monthlyExpenses),
      })
    }
  }

  const isIncome = typeValue === 'income'

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        {/* ── Header ── */}
        <View style={styles.header}>
            <BackButton/>
          <Text style={styles.headerTitle}>Add Transaction</Text>
          <Text style={styles.headerSub}>Record income or expense</Text>
        </View>

        {/* ── Type Toggle ── */}
        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, isIncome && styles.toggleActive]}
            onPress={() => setTypeValue('income')}
          >
            <View style={[styles.toggleDot, { backgroundColor: isIncome ? '#4CAF50' : '#d0d0d0' }]} />
            <Text style={[styles.toggleLabel, isIncome && styles.toggleLabelActive]}>Income</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, !isIncome && styles.toggleActive]}
            onPress={() => setTypeValue('expense')}
          >
            <View style={[styles.toggleDot, { backgroundColor: !isIncome ? '#f44336' : '#d0d0d0' }]} />
            <Text style={[styles.toggleLabel, !isIncome && styles.toggleLabelActive]}>Expense</Text>
          </TouchableOpacity>
        </View>

        {/* ── Amount Hero ── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountBox}>
            <Text style={styles.currencyLabel}>ZAR · South African Rand</Text>
            <View style={styles.amountRow}>
              <Text style={styles.currencySymbol}>R</Text>
              <TextInput
                style={styles.amountInput}
                placeholderTextColor="#d0d0d0"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
          </View>
        </View>

        {/* ── Date ── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Date</Text>

          {showPicker && (
            <DateTimePicker
              value={date}
              display="spinner"
              mode="date"
              maximumDate={new Date()}
              onChange={(_, selected) => {
                if (Platform.OS === 'android') {
                  toggleDatePicker()
                  if (selected) {
                    setDate(selected)
                    setTransactionDate(selected.toDateString())
                  }
                } else {
                  setDate(selected || date)
                }
              }}
              style={styles.picker}
            />
          )}

          {showPicker && Platform.OS === 'ios' && (
            <View style={styles.iosBtnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={toggleDatePicker}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmIOSDate}>
                <Text style={styles.confirmBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          )}

          {!showPicker && (
            <TouchableOpacity onPress={toggleDatePicker}>
              <View style={styles.inputWrapper}>
                <Ionicons name="calendar-outline" size={18} color="#60AFFF" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder={date.toDateString().slice(0, 15)}
                  placeholderTextColor="#aaa"
                  value={transactionDate}
                  editable={false}
                  pointerEvents="none"
                />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Category ── */}
        <View style={[styles.fieldGroup, { zIndex: 3000, marginBottom: Catopen ? 180 : 0 }]}>
          <Text style={styles.label}>Category</Text>
          <DropDownPicker
            open={Catopen}
            value={Catvalue}
            items={Catitems}
            setOpen={setCatOpen}
            setValue={setCatValue}
            setItems={setCatItems}
            placeholder="Select Category"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownList}
            placeholderStyle={{ color: '#aaa', fontSize: 15 }}
            labelStyle={{ color: '#333', fontSize: 15 }}
            listItemLabelStyle={{ color: '#333', fontSize: 15 }}
            listMode="SCROLLVIEW"
            scrollViewProps={{ nestedScrollEnabled: true }}
            zIndex={3000}
            zIndexInverse={1000}
            onChangeValue={(value) => {
              if (value === 'addYourOwnCategory') setModalVisible(true)
            }}
          />
        </View>

        {/* ── Recent Category Chips ── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Recent</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipsRow}>
              {RECENT_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, Catvalue === cat.toLowerCase() && styles.chipActive]}
                  onPress={() => setCatValue(cat.toLowerCase())}
                >
                  <Text style={[styles.chipText, Catvalue === cat.toLowerCase() && styles.chipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* ── Notes ── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={styles.textarea}
            placeholder="Optional note…"
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* ── Save ── */}
        <TouchableOpacity style={styles.saveBtn} onPress={addTransaction} activeOpacity={0.85}>
          <Ionicons name="checkmark" size={18} color="white" />
          <Text style={styles.saveTxt}>Save Transaction</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Add Category Modal ── */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={22} color="#555" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add New Category</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Category name"
              placeholderTextColor="#aaa"
              value={newCategory}
              onChangeText={setNewCategory}
              autoFocus
            />
            <TouchableOpacity style={styles.modalAddBtn} onPress={handleAddCategory}>
              <Text style={styles.modalAddBtnText}>Add Category</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

export default AddTransactionScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollContent: {
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 48,
    gap: 16,
  },

  // Header
  header: {
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    letterSpacing: -0.3,
    marginTop: 70
  },
  headerSub: {
    fontSize: 13,
    color: '#aaa',
    marginTop: 2,
  },

  // Type toggle
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 9,
    gap: 7,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  toggleActive: {
    backgroundColor: '#F9F9F9',
    borderColor: '#d0d0d0',
  },
  toggleDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#aaa',
  },
  toggleLabelActive: {
    color: '#333',
  },

  // Fields
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    letterSpacing: 0.2,
  },

  // Amount hero
  amountBox: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 12,
    padding: 16,
  },
  currencyLabel: {
    fontSize: 11,
    color: '#aaa',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  currencySymbol: {
    fontSize: 22,
    color: '#aaa',
    fontWeight: '400',
    lineHeight: 40,
  },
  amountInput: {
    flex: 1,
    fontSize: 30,
    fontWeight: '700',
    color: '#333',
    letterSpacing: -1,
    padding: 0,
  },

  // Standard input
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 14,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },

  // Dropdown
  dropdown: {
    backgroundColor: 'white',
    borderColor: '#d0d0d0',
    borderRadius: 12,
    minHeight: 50,
  },
  dropdownList: {
    backgroundColor: 'white',
    borderColor: '#d0d0d0',
    borderRadius: 12,
    maxHeight: 160,
  },

  // Chips
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 16,
  },
  chipActive: {
    backgroundColor: '#60AFFF',
    borderColor: '#60AFFF',
  },
  chipText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '400',
  },
  chipTextActive: {
    color: 'white',
    fontWeight: '500',
  },

  // Textarea
  textarea: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 12,
    padding: 14,
    minHeight: 70,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },

  // Save button
  saveBtn: {
    backgroundColor: '#60AFFF',
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  saveTxt: {
    fontWeight: '700',
    fontSize: 16,
    color: 'white',
  },

  // Date picker
  picker: {
    height: 120,
  },
  iosBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    height: 42,
    backgroundColor: '#8d8d8d',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  confirmBtn: {
    flex: 1,
    height: 42,
    backgroundColor: '#60AFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalBox: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
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
    color: '#333',
    marginBottom: 16,
  },
  modalInput: {
    width: '100%',
    height: 46,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: '#F9F9F9',
    color: '#333',
    marginBottom: 14,
  },
  modalAddBtn: {
    backgroundColor: '#60AFFF',
    width: '100%',
    height: 46,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAddBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
})