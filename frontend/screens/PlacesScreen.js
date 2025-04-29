import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { addPlace, removePlace } from '../reducers/user';

export default function PlacesScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [city, setCity] = useState('');
  const handleSubmit = () => {
    if (city.trim() === '') {
      return;
    }
    fetch(`https://api-adresse.data.gouv.fr/search/?q=${city}&type=municipality&limit=1`)
      .then((response) => response.json())
      .then((data) => {
          const cityToAdd = data.features[0];
          let newPlace = {
            nickname: user.nickname,
            name: cityToAdd.properties.city,
            latitude: cityToAdd.geometry.coordinates[1],
            longitude: cityToAdd.geometry.coordinates[0],
          }
          
          fetch('http://192.168.0.11:3000/places', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPlace)
          })
            .then((response) => response.json())
            .then((data) => {
              data.result && dispatch(addPlace(newPlace));
            });
          setCity('');
      });
  };

  const removeCity = (nickname, name) => {
    fetch('http://192.168.0.11:3000/places',
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, name })
      })
      .then((response) => response.json())
      .then(data => {
        if (data.result) {
          dispatch(removePlace(name));
        }
      })
  }
  
  const places = user.places.map((data, i) => {
    return (
      <View key={i} style={styles.card}>
        <View>
          <Text style={styles.name}>{data.name}</Text>
          <Text>LAT : {Number(data.latitude).toFixed(3)} LON : {Number(data.longitude).toFixed(3)}</Text>
        </View>
        <FontAwesome name='trash-o' onPress={() => removeCity(user.nickname, data.name)} size={25} color='#ec6e5b' />
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{user.nickname}'s places</Text>

      <View style={styles.inputContainer}>
        <TextInput placeholder="New city" onChangeText={(value) => setCity(value)} value={city} style={styles.input} />
        <TouchableOpacity onPress={() => handleSubmit()} style={styles.button} activeOpacity={0.8}>
          <Text style={styles.textButton}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {places}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 20,
  },
  scrollView: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  input: {
    width: '65%',
    marginTop: 6,
    borderBottomColor: '#ec6e5b',
    borderBottomWidth: 1,
    fontSize: 16,
  },
  button: {
    width: '30%',
    alignItems: 'center',
    paddingTop: 8,
    backgroundColor: '#ec6e5b',
    borderRadius: 10,
  },
  textButton: {
    color: '#ffffff',
    height: 24,
    fontWeight: '600',
    fontSize: 15,
  },
});
