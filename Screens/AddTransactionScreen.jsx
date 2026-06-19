import {
    StyleSheet, Text, View, TextInput, TouchableOpacity,
    Platform, ScrollView, KeyboardAvoidingView, Alert, Modal, StatusBar
} from 'react-native'
import { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import DropDownPicker from 'react-native-dropdown-picker'
import { Ionicons } from '@expo/vector-icons'
import { addTransaction } from '../backend/transactionService'

// ─── Design tokens ───────────────────────────────────────────────────────────
const C = {
    bg: '#0F0F14',
    surface: '#1A1A24',
    elevated: '#22222F',
    border: '#2E2E3E',
    accent: '#7C6FFF',
    accentLight: '#A89CFF',
    income: '#4ECBA1',
    expense: '#FF6B7A',
    textPrimary: '#F0EFF8',
    textMuted: '#7A7A9A',
    white: '#FFFFFF',
};

const AddTransactionScreen = () => {
    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [transactionDate, setTransactionDate] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');

    const [Catopen, setCatOpen] = useState(false);
    const [Catvalue, setCatValue] = useState('');
    const [Catitems, setCatItems] = useState([
        { label: '＋ Add Category', value: 'addYourOwnCategory' },
        { label: 'Salary', value: 'salary' },
        { label: 'Savings', value: 'savings' },
        { label: 'Gift', value: 'gift' },
        { label: 'Groceries', value: 'groceries' },
        { label: 'Electricity', value: 'electricity' },
        { label: 'Water', value: 'water' },
        { label: 'Entertainment', value: 'entertainment' },
    ]);

    const [typeValue, setTypeValue] = useState('');

    const toggleDatePicker = () => setShowPicker(!showPicker);

    const confirmIOSDate = () => {
        setTransactionDate(date.toDateString());
        toggleDatePicker();
    };

    const handleAddCategory = () => {
        if (newCategory.trim() === '') return;
        setCatItems(prev => [...prev, { label: newCategory, value: newCategory.toLowerCase() }]);
        Alert.alert('Category added', `"${newCategory}" is now available.`);
        setNewCategory('');
        setModalVisible(false);
    };

    const handleSave = async () => {
        try {
            await addTransaction({ transactionDate, amount, Catvalue, typeValue, notes });
            Alert.alert('✓ Saved', 'Transaction recorded successfully.');
            setTransactionDate('');
            setAmount('');
            setCatValue('');
            setTypeValue('');
            setNotes('');
        } catch (error) {
            if (error.message === 'MISSING_FIELDS') {
                Alert.alert('Incomplete', 'Please fill in all fields before saving.');
            } else {
                Alert.alert('Error', error.message);
            }
        }
    };

    const displayDate = transactionDate || date.toDateString().slice(0, 15);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: C.bg }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <StatusBar barStyle="light-content" />

            {/* ── Header ─────────────────────────────────────────────────── */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>New Transaction</Text>
                <Text style={styles.headerSub}>Record your income or expense</Text>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
            >

                {/* ── Type selector (signature element) ──────────────────── */}
                <Text style={styles.sectionLabel}>Type</Text>
                <View style={styles.typeRow}>
                    <TouchableOpacity
                        style={[
                            styles.typePill,
                            typeValue === 'income' && styles.typePillActiveIncome,
                        ]}
                        onPress={() => setTypeValue('income')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.typePillBar, { backgroundColor: C.income }]} />
                        <Ionicons
                            name="arrow-down-circle-outline"
                            size={22}
                            color={typeValue === 'income' ? C.income : C.textMuted}
                        />
                        <Text style={[
                            styles.typePillLabel,
                            typeValue === 'income' && { color: C.income }
                        ]}>Income</Text>
                        {typeValue === 'income' && (
                            <Ionicons name="checkmark-circle" size={16} color={C.income} style={{ marginLeft: 'auto' }} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.typePill,
                            typeValue === 'expense' && styles.typePillActiveExpense,
                        ]}
                        onPress={() => setTypeValue('expense')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.typePillBar, { backgroundColor: C.expense }]} />
                        <Ionicons
                            name="arrow-up-circle-outline"
                            size={22}
                            color={typeValue === 'expense' ? C.expense : C.textMuted}
                        />
                        <Text style={[
                            styles.typePillLabel,
                            typeValue === 'expense' && { color: C.expense }
                        ]}>Expense</Text>
                        {typeValue === 'expense' && (
                            <Ionicons name="checkmark-circle" size={16} color={C.expense} style={{ marginLeft: 'auto' }} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* ── Amount ─────────────────────────────────────────────── */}
                <Text style={styles.sectionLabel}>Amount</Text>
                <View style={styles.amountCard}>
                    <Text style={styles.currencySymbol}>R</Text>
                    <TextInput
                        placeholder="0.00"
                        placeholderTextColor={C.textMuted}
                        style={styles.amountInput}
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                    />
                </View>

                {/* ── Date ───────────────────────────────────────────────── */}
                <Text style={styles.sectionLabel}>Date</Text>

                {showPicker && (
                    <DateTimePicker
                        value={date}
                        display="spinner"
                        mode="date"
                        maximumDate={new Date()}
                        themeVariant="dark"
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
                    <View style={styles.pickerActions}>
                        <TouchableOpacity style={styles.pickerCancelBtn} onPress={toggleDatePicker}>
                            <Text style={styles.pickerCancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.pickerConfirmBtn} onPress={confirmIOSDate}>
                            <Text style={styles.pickerConfirmText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {!showPicker && (
                    <TouchableOpacity style={styles.fieldCard} onPress={toggleDatePicker} activeOpacity={0.75}>
                        <Ionicons name="calendar-outline" size={20} color={C.accentLight} />
                        <Text style={[styles.fieldCardText, !transactionDate && { color: C.textMuted }]}>
                            {displayDate}
                        </Text>
                        <Ionicons name="chevron-forward" size={16} color={C.textMuted} style={{ marginLeft: 'auto' }} />
                    </TouchableOpacity>
                )}

                {/* ── Category ───────────────────────────────────────────── */}
                <View style={{ zIndex: 3000 }}>
                    <Text style={styles.sectionLabel}>Category</Text>
                    <DropDownPicker
                        open={Catopen}
                        value={Catvalue}
                        items={Catitems}
                        setOpen={setCatOpen}
                        setValue={setCatValue}
                        setItems={setCatItems}
                        placeholder="Select a category"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownList}
                        textStyle={styles.dropdownText}
                        placeholderStyle={{ color: C.textMuted }}
                        selectedItemLabelStyle={{ color: C.accentLight, fontWeight: '600' }}
                        arrowIconStyle={{ tintColor: C.textMuted }}
                        tickIconStyle={{ tintColor: C.accentLight }}
                        listMode="SCROLLVIEW"
                        scrollViewProps={{ nestedScrollEnabled: true }}
                        zIndex={3000}
                        zIndexInverse={1000}
                        onChangeValue={value => {
                            if (value === 'addYourOwnCategory') {
                                setCatValue('');
                                setModalVisible(true);
                            }
                        }}
                    />
                    {Catopen && <View style={{ height: 180 }} />}
                </View>

                {/* ── Notes ──────────────────────────────────────────────── */}
                <Text style={styles.sectionLabel}>Notes</Text>
                <TextInput
                    placeholder="Add a note (optional)"
                    placeholderTextColor={C.textMuted}
                    style={styles.notesInput}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    value={notes}
                    onChangeText={setNotes}
                />

                {/* ── Save ───────────────────────────────────────────────── */}
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
                    <Ionicons name="checkmark" size={20} color={C.white} />
                    <Text style={styles.saveBtnText}>Save Transaction</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* ── Add Category Modal ──────────────────────────────────────── */}
            <Modal
                animationType="fade"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
                            <Ionicons name="close" size={20} color={C.textMuted} />
                        </TouchableOpacity>
                        <View style={styles.modalIconRing}>
                            <Ionicons name="pricetag-outline" size={22} color={C.accentLight} />
                        </View>
                        <Text style={styles.modalTitle}>New Category</Text>
                        <Text style={styles.modalSubtitle}>Give your category a name</Text>
                        <TextInput
                            placeholder="e.g. Transport, Rent…"
                            placeholderTextColor={C.textMuted}
                            style={styles.modalInput}
                            value={newCategory}
                            onChangeText={setNewCategory}
                            autoFocus
                        />
                        <TouchableOpacity style={styles.modalAddBtn} onPress={handleAddCategory} activeOpacity={0.85}>
                            <Text style={styles.modalAddBtnText}>Add Category</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

export default AddTransactionScreen

const styles = StyleSheet.create({
    // ── Layout ────────────────────────────────────────────────────────────────
    header: {
        paddingTop: Platform.OS === 'ios' ? 56 : 36,
        paddingBottom: 20,
        paddingHorizontal: 24,
        backgroundColor: C.bg,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: C.textPrimary,
        letterSpacing: -0.5,
    },
    headerSub: {
        fontSize: 13,
        color: C.textMuted,
        marginTop: 3,
    },
    scroll: {
        flex: 1,
        backgroundColor: C.bg,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 52,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: C.textMuted,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: 10,
        marginTop: 4,
    },

    // ── Type pills ────────────────────────────────────────────────────────────
    typeRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 28,
    },
    typePill: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: C.surface,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: C.border,
        paddingVertical: 16,
        paddingHorizontal: 14,
        gap: 8,
        overflow: 'hidden',
    },
    typePillActiveIncome: {
        borderColor: C.income,
        backgroundColor: 'rgba(78,203,161,0.08)',
    },
    typePillActiveExpense: {
        borderColor: C.expense,
        backgroundColor: 'rgba(255,107,122,0.08)',
    },
    typePillBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        borderTopLeftRadius: 14,
        borderBottomLeftRadius: 14,
    },
    typePillLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: C.textMuted,
    },

    // ── Amount card ──────────────────────────────────────────────────────────
    amountCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: C.surface,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: C.border,
        paddingHorizontal: 18,
        height: 64,
        marginBottom: 28,
    },
    currencySymbol: {
        fontSize: 22,
        fontWeight: '700',
        color: C.accentLight,
        marginRight: 10,
    },
    amountInput: {
        flex: 1,
        fontSize: 28,
        fontWeight: '700',
        color: C.textPrimary,
        letterSpacing: -0.5,
    },

    // ── Generic field card ────────────────────────────────────────────────────
    fieldCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: C.surface,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: C.border,
        paddingHorizontal: 16,
        height: 54,
        gap: 12,
        marginBottom: 28,
    },
    fieldCardText: {
        fontSize: 15,
        color: C.textPrimary,
        fontWeight: '500',
    },

    // ── Date picker ───────────────────────────────────────────────────────────
    picker: {
        backgroundColor: C.surface,
        borderRadius: 14,
        marginBottom: 8,
    },
    pickerActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginBottom: 28,
    },
    pickerCancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: C.elevated,
    },
    pickerCancelText: {
        color: C.textMuted,
        fontWeight: '600',
        fontSize: 14,
    },
    pickerConfirmBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: C.accent,
    },
    pickerConfirmText: {
        color: C.white,
        fontWeight: '600',
        fontSize: 14,
    },

    // ── Dropdown ──────────────────────────────────────────────────────────────
    dropdown: {
        borderRadius: 14,
        borderColor: C.border,
        borderWidth: 1.5,
        backgroundColor: C.surface,
        minHeight: 54,
        paddingHorizontal: 16,
    },
    dropdownList: {
        borderColor: C.border,
        borderWidth: 1.5,
        backgroundColor: C.elevated,
        borderRadius: 14,
        maxHeight: 160,
    },
    dropdownText: {
        color: C.textPrimary,
        fontSize: 15,
        fontWeight: '500',
    },

    // ── Notes ─────────────────────────────────────────────────────────────────
    notesInput: {
        backgroundColor: C.surface,
        borderWidth: 1.5,
        borderColor: C.border,
        borderRadius: 14,
        padding: 16,
        minHeight: 90,
        fontSize: 15,
        color: C.textPrimary,
        marginBottom: 32,
    },

    // ── Save button ───────────────────────────────────────────────────────────
    saveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: C.accent,
        borderRadius: 16,
        height: 56,
        shadowColor: C.accent,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },
    saveBtnText: {
        fontWeight: '700',
        fontSize: 16,
        color: C.white,
        letterSpacing: 0.3,
    },

    // ── Modal ─────────────────────────────────────────────────────────────────
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.65)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 28,
    },
    modalBox: {
        width: '100%',
        backgroundColor: C.elevated,
        borderRadius: 24,
        padding: 28,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: C.border,
    },
    modalCloseBtn: {
        position: 'absolute',
        top: 14,
        right: 14,
        padding: 6,
    },
    modalIconRing: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'rgba(124,111,255,0.12)',
        borderWidth: 1.5,
        borderColor: 'rgba(124,111,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    modalTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: C.textPrimary,
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 13,
        color: C.textMuted,
        marginBottom: 20,
    },
    modalInput: {
        width: '100%',
        height: 50,
        borderWidth: 1.5,
        borderColor: C.border,
        borderRadius: 12,
        paddingHorizontal: 14,
        fontSize: 15,
        backgroundColor: C.surface,
        color: C.textPrimary,
        marginBottom: 16,
    },
    modalAddBtn: {
        backgroundColor: C.accent,
        width: '100%',
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalAddBtnText: {
        color: C.white,
        fontWeight: '700',
        fontSize: 15,
    },
});