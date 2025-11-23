import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, ScrollView, KeyboardAvoidingView, Alert, Modal } from 'react-native'
import { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import DropDownPicker from 'react-native-dropdown-picker'
import { Ionicons } from '@expo/vector-icons'

const AddTransactionScreen = () => {
    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [transactionDate, setTransactionDate] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    
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
        if(Catvalue == 'addYourOwnCategory'){
            setModalVisible(true);
            if(newCategory.trim() !== ''){
                setCatItems((prev) => [
                    ...prev,
                    {label: newCategory, value: newCategory.toLowerCase()}
                ]
            )
                Alert.alert('New Category Added',`${newCategory} has been added to your Categories`);
                setNewCategory('');
            }
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
                nestedScrollEnabled={true}
            >
                {/* DATE PICKER */}
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

                {/* DATE INPUT */}
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
                                    pointerEvents="none"
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                )}

                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Alert has been closed');
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.closeContainer} onPress={() => setModalVisible(false)}>
                            <Ionicons name='close' size={20}/>
                        </TouchableOpacity>
                        <TextInput
                            plalceholder='Category name'
                            style={styles.catInput}
                            value={newCategory}
                            onChangeText={(text) => setNewCategory(text)}
                        />
                        <TouchableOpacity style={styles.addCatBtn} onPress={handleAddCategory}>
                            <Text>Add Category</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                {/* AMOUNT */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Amount</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="card-outline" size={20} style={styles.icon} />
                        <TextInput
                            placeholder="R: "
                            style={styles.input}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                {/* CATEGORY DROPDOWN */}
                <View style={[
                    styles.fieldContainer, 
                    styles.dropdownWrapper, 
                    { zIndex: 3000, marginBottom: Catopen ? 180 : 20 }
                ]}>
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
                        scrollViewProps={{
                            nestedScrollEnabled: true,
                        }}
                        zIndex={3000}
                        zIndexInverse={1000}
                        onChangeValue={() => {
                            if(Catvalue === 'addYourOwnCategory'){
                                setModalVisible(true);
                            }
                        }}
                    />
                </View>

                {/* TYPE DROPDOWN */}
                <View style={[
                    styles.fieldContainer, 
                    styles.dropdownWrapper, 
                    { zIndex: 2000, marginBottom: typeOpen ? 100 : 20 }
                ]}>
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
                        scrollViewProps={{
                            nestedScrollEnabled: true,
                        }}
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
                    />
                </View>

                {/* SAVE BUTTON */}
                <TouchableOpacity style={styles.saveBtn}>
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
        flexGrow: 1,
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
        paddingHorizontal: 12,
        paddingVertical: 12,
        minHeight: 50,
        fontSize: 15,
    },

    dropdownWrapper: {
        // Base styles only - dynamic marginBottom applied inline
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

    btnText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
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
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelBtn: {
        backgroundColor: '#83888d9f',
        borderRadius: 10,
        height: 40,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#a3a3a32f',
        borderRadius: 10,
        position: 'absolute',
        left: 75,
        top: 300,
        padding: 25
    },
    addCatBtn: {
        backgroundColor: '#60afff93',
        width: 100,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 10
    },
    catInput: {
        borderWidth: 1,
        width: 200,
        height: 40,
        borderColor: 'gray',
        borderRadius: 10,
        marginBottom: 5,
        padding: 5,
        backgroundColor: 'white'
    },
    closeContainer: {
        position: 'absolute',
        top: 1,
        right: 2,
        margin: 5
    }
});
