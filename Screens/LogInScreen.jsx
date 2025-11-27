import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { auth } from '../Firebase/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth'; 

const LogInScreen = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogIn = async () => {
        

        try{
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            Alert.alert('Logged in')
            navigation.replace('HomeScreen');
        }
        catch(error){
            console.error(error.message);
        }
    }
    return (
        <View>
            <TextInput
                placeholder='Enter email'
                style={styles.input}
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                placeholder='Enter password'
                style={styles.input}
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity style={styles.logInBtn} onPress={handleLogIn}>
                <Text>Log In</Text>
            </TouchableOpacity>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.replace('SignUp')}>
            <Text style={{textDecorationLine: 'underline'}}>Sign Up</Text>
        </TouchableOpacity>
        </View>
    )
}

export default LogInScreen

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        height: 45,
        width: 150,
        marginLeft: 50,
        marginTop: 10
    },
    logInBtn: {
        backgroundColor: 'blue',
        width: 100,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginLeft: 50
    }
})