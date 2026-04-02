import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, getDoc } from "firebase/firestore";

//Components
import BalanceCard from '../Components/BalanceCard';
import BottomNavigation from '../Components/BottomNavigation';
import ActivityCard from '../Components/ActivityCard';
import SpendingOverView from '../Components/SpendingOverView';

const HomeScreen = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const getCurrentUser = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;

      if(user){
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if(userDoc.exists()){
          setUsername(userDoc.data().fullname.split(" ")[0]);
        };
      }
    };
    getCurrentUser();
  }, [])

  return (
    <View>
      <View style={styles.userInfo}>
        <Image source={require ('../assets/linkedin profile.jpg')} style={{width: 45, height: 45, borderRadius: 100}}/>
        <Text style={styles.userText}>Hello, {username}</Text>
        <Text style={styles.userText2}>Track your money with ease</Text>
        <Ionicons name='notifications-outline' size={26} style={styles.notificationBell}/>
      </View>

      <BalanceCard/>
      <BottomNavigation/>
      <View style={styles.Activityheader}>
        <Text style={styles.activityText}>Activity</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ActivityCard/>
      <Text
        style={{fontWeight: 'bold', fontSize: 18, marginTop: 35, marginLeft: 5, fontWeight: '600'}}
      >Spending OverView</Text>
      <SpendingOverView/>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  userInfo: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 60,
    marginLeft: 8
  },
  userText: {
    fontSize: 17,
    fontWeight: 'bold'
  },
  userText2: {
    fontWeight: 'light',
    position: 'absolute',
    bottom: 6,
    left: 50,
    fontSize: '12'
  },
  notificationBell: {
    position: 'absolute',
    right: 10
  },
  Activityheader: {
    marginTop: 30,
    flexDirection: 'row',
    gap: 240,
    marginLeft: 9,
  },
  activityText: {
    fontWeight: '600',
    fontSize: 17
  },
  seeAllText: {
    fontWeight: '600',
    color: '#60AFFF',
    fontSize: 17,
  }
})