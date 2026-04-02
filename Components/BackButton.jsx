import { StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const BackButton = () => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => navigation.goBack()}
      activeOpacity={0.7}
    >
      <Ionicons name="chevron-back" size={20} color="#555" />
    </TouchableOpacity>
  )
}

export default BackButton

const styles = StyleSheet.create({
  btn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15
  },
})