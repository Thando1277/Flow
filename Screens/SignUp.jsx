import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert} from 'react-native'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../Firebase/FirebaseConfig'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore'


const SignUp = () => {
    const navigation = useNavigation();

    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatar, setAvatar] = useState(null);

    const handleSignUp = async () => {
        if(fullname.trim() === '' || email.trim() === '' || password.trim() === '' || confirmPassword.trim() === ''){
            Alert.alert('Missing Input fields', 'Please fill all the input fields');
        }else if (password != confirmPassword){
            Alert.alert('Passwords do not match');
        }else{
            try{
                const auth = getAuth();
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await setDoc(doc(db, 'users', user.uid), {
                    fullname: fullname,
                    email: email,
                    createdAt: Timestamp.fromDate(new Date()),
                    avatar: avatar
                });
                Alert.alert('Account Created successfully');
                navigation.navigate('HomeScreen');
            }catch (error){
                console.error('Failed to create account', error.message);
                Alert.alert(error.message);
            }
        }
    }

    return (
    <View style={styles.container}>


        <Text style={{marginBottom:30, marginTop: 10, fontSize: 19}}>Welcome to Flow</Text>

        <View style={styles.inputs}>
            <TextInput
                placeholder = 'Enter Full Name'
                style={styles.input}
                value={fullname}
                onChangeText={(text) => setFullname(text)}
            />

            <TextInput
                placeholder = 'Enter Email'
                autoComplete='email'
                style={styles.input}
                value={email}
                onChangeText={(text) => setEmail(text)}
            />

            <TextInput
                placeholder = 'Enter Password'
                secureTextEntry={true}
                style={styles.input}
                value={password}
                onChangeText={(text) => setPassword(text)}
            />

            <TextInput
                placeholder = 'Confirm Password'
                secureTextEntry={true}
                returnKeyType='done'
                style={styles.input}
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
            />
        </View>

        <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp}>
            <Text>Sign Up</Text>
        </TouchableOpacity>
        <Text>Alread have an account?</Text>
        <TouchableOpacity onPress={() => navigation.replace('LogInScreen')}>
            <Text style={{textDecorationLine: 'underline'}}>Log In</Text>
        </TouchableOpacity>
    </View>
  )
}

export default SignUp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    input: {
        borderWidth: 1,
        height: 45,
        width: 250,
        padding: 15,
        borderColor: 'gray'
    },
    inputs: {
        gap: 15
    },
    signUpBtn: {
        backgroundColor: '#47a0f8ff',
        marginTop: 20,
        width: 200,
        height: 40,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    }
})