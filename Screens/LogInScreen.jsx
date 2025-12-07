import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    TextInput, 
    Alert, 
    Image, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView 
} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../Firebase/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import { FontAwesome5 } from '@expo/vector-icons';

const LogInScreen = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogIn = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            Alert.alert('Logged in');
            navigation.replace('HomeScreen');
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>

                    <Text style={styles.title}>Flow</Text>

                    <View style={styles.formContainer}>
                        <Text style={styles.welcomeText}>
                            Welcome back to Flow. Log in now!
                        </Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                placeholder='Enter email'
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                placeholder='Enter password'
                                style={styles.input}
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>

                        <TouchableOpacity style={styles.forgotPasswordContainer}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.logInBtn} 
                            onPress={handleLogIn}
                        >
                            <Text style={styles.logInText}>Log In</Text>
                        </TouchableOpacity>

                        <Text style={styles.orText}>Or Sign In With</Text>

                        <View style={styles.signInMethods}>
                            <TouchableOpacity style={styles.logo}>
                                <Image 
                                    source={require('../assets/googleLogo.png')}
                                    style={{ width: 30, height: 30 }}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.logo}>
                                <FontAwesome5 name="apple" size={40} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.logo}>
                                <FontAwesome5 name="facebook" size={35} color="blue" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default LogInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 80,
        backgroundColor: '#f2f2f2'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 36,
        color: '#43a0fdff',
        marginBottom: 20
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: 30,
        width: 350,
        height: 550,
        padding: 20,
        alignItems: 'center'
    },
    welcomeText: {
        fontWeight: 'bold',
        fontSize: 17,
        marginBottom: 20,
        textAlign: 'center'
    },
    inputGroup: {
        width: '100%',
        marginBottom: 15
    },
    label: {
        fontWeight: 'bold',
        marginLeft: 10
    },
    input: {
        borderWidth: 1,
        height: 45,
        width: '90%',
        alignSelf: 'center',
        marginTop: 5,
        paddingLeft: 10,
        borderRadius: 5,
        borderColor: 'gray'
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginRight: 20,
        marginBottom: 10
    },
    forgotPasswordText: {
        color: 'rgba(18, 61, 179, 0.7)',
        textDecorationLine: 'underline'
    },
    logInBtn: {
        backgroundColor: '#43a0fdff',
        width: '90%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 10
    },
    logInText: {
        fontWeight: 'bold',
        fontSize: 16
    },
    orText: {
        marginTop: 20,
        fontSize: 14
    },
    signInMethods: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 15
    },
    logo: {
        backgroundColor: '#9c9b9c21',
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    }
});
