import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform } from 'react-native'
import { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import DropDownPicker from 'react-native-dropdown-picker'

const AddTransactionScreen = () => {
    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [transactionDate, setTransactionDate] = useState('');
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [items, setItems] = useState([
        {label: 'Apple', value: 'apple'},
        {label: 'Banana', value: 'banana'}
    ]);

    const toggleDatePicker = () => {
        setShowPicker(!showPicker)
    }

    const confrimIOSDate = () => {
        setTransactionDate(date.toDateString());
        toggleDatePicker();
    }
  return (
    <View style={styles.container}>
        {showPicker && (
            <DateTimePicker
                value={date}
                display='spinner'
                mode='date'
                style={styles.picker}
                maximumDate={new Date()}
                onChange={(_, selectedDate) => {
                    const currentDate = selectedDate || date;
                    setDate(currentDate);
                }}
            />
        )}

        { showPicker && Platform.OS === 'ios' &&(
            <View style={styles.CCbuttons}>
                <TouchableOpacity style={styles.cBtn} onPress={toggleDatePicker}>
                    <Text>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cBtn} onPress={confrimIOSDate}>
                    <Text>Confirm</Text>
                </TouchableOpacity>
            </View>
        )}
        <TextInput
            placeholder='Date'
            style={styles.input}
            onPressIn={toggleDatePicker}
            editable={false}
            value={transactionDate}
        />
        <TextInput
            placeholder='Amount'
            style={styles.input}
            keyboardType='numeric'
        />
        <DropDownPicker
            style={styles.input}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder='Select Category'
        />
        <TextInput
            placeholder='Type'
            style={styles.input}
        />
        <TextInput
            placeholder='Notes'
            style={styles.input}
        />
        <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveTxt}>Save</Text>
        </TouchableOpacity>
    </View>
  )
}

export default AddTransactionScreen

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        width: 300,
        height: 50,
        marginBottom: 30,
        padding: 10,
        backgroundColor: 'white'
    },
    container: {
        padding: 50
    },
    saveBtn: {
        backgroundColor: '#60AFFF',
        borderRadius: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    saveTxt: {
        fontWeight: 'bold',
        fontSize: 17
    },
    picker: {
        height: 120,
        marginTop: -10
    },
    CCbuttons: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    cBtn: {
        borderRadius: 80,
        backgroundColor: '#60AFFF',
        height: 30,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25
    }
})