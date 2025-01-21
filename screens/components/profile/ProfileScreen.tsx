import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from 'src/Config/config';

interface Persona {
  first_name: string;
  last_name: string;
  biography: string;
  image_url: string;
}

interface UserProfile {
  user: {
    name: string;
    email: string;
    persona: Persona[];
  };
}

const ProfileScreen = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}user_data`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

   const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancelado'),
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          onPress: async () => {
            await AsyncStorage.removeItem('token');
                        navigation.reset({
              index: 0,
              routes: [{ name: 'Login' as never }],
            });
          },
        },
      ],
      { cancelable: false }
    );
  };
  if (loading) return <Loader />;
  if (!userData) return <ErrorDisplay message="No se pudieron cargar los datos del usuario." />;

  const { name, email, persona } = userData.user;
  const profile = persona[0];
  const pets = [
    { id: 1, name: 'Firulais', breed: 'Labrador', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Michi', breed: 'Siames', image: 'https://via.placeholder.com/150' },
  ];

  return (
    <FlatList
      ListHeaderComponent={
        <ProfileHeader
          profile={profile}
          email={email}
          onLogout={handleLogout}
        />
      }
      data={pets}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <PetCard pet={item} />}
      contentContainerStyle={styles.container}
    />
  );
};

const Loader = () => (
  <View style={styles.centeredContainer}>
    <ActivityIndicator size="large" color="#ff4081" />
  </View>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <View style={styles.centeredContainer}>
    <Text style={styles.errorText}>{message}</Text>
  </View>
);

const ProfileHeader = ({
  profile,
  email,
  onLogout,
}: {
  profile: Persona;
  email: string;
  onLogout: () => void;
}) => (
  <View style={styles.profileContainer}>
    <Image
      source={{ uri:`${profile.image_url}` }}
      style={styles.profileImage}
    />
    <Text style={styles.name}>{`${profile.first_name} ${profile.last_name}`}</Text>
    <Text style={styles.email}>{email}</Text>
    <Text style={styles.bio}>{profile.biography}</Text>
    <View style={styles.buttonsContainer}>
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.followButton} onPress={onLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const PetCard = ({ pet }: { pet: { name: string; breed: string; image: string } }) => (
  <View style={styles.petCard}>
    <Image source={{ uri: pet.image }} style={styles.petImage} />
    <View style={styles.petDetails}>
      <Text style={styles.petName}>{pet.name}</Text>
      <Text style={styles.petBreed}>{pet.breed}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
    paddingBottom: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f1f1f1',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#ff4081',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  bio: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-between',
    width: '100%',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#ff4081',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 30,
    alignItems: 'center',
  },
  followButton: {
    flex: 1,
    backgroundColor: '#009688',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  petDetails: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  petBreed: {
    fontSize: 14,
    color: '#888',
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
  },
});

export default ProfileScreen;
