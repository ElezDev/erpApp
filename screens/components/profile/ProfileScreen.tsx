import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from 'src/Config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Persona {
  nombre1: string;
  nombre2: string;
  apellido1: string;
  apellido2: string;
  email: string;
  direccion: string;
  celular: string;
  telefonoFijo: string;
  perfil: string;
  rutaFotoUrl: string;
  ubicacion: {
    descripcion: string;
  };
}

interface UserProfile {
  user: {
    persona: Persona;
  };
}

const ProfileScreen = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const response = await axios.post(`${BASE_URL}user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
        console.log('User data:', response.data);
        console.log('User data:', token);
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar la información del usuario.');
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
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          onPress: async () => {
            await AsyncStorage.removeItem('access_token');
            navigation.reset({ index: 0, routes: [{ name: 'Login' as never }] });
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>No se pudieron cargar los datos del usuario.</Text>
      </View>
    );
  }

  const {
    nombre1,
    nombre2,
    apellido1,
    apellido2,
    email,
    direccion,
    celular,
    telefonoFijo,
    perfil,
    rutaFotoUrl,
    ubicacion,
  } = userData.user.persona;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: rutaFotoUrl }} style={styles.profileImage} />
      <Text style={styles.name}>{`${nombre1} ${nombre2} ${apellido1} ${apellido2}`}</Text>
      <Text style={styles.email}>{email}</Text>
      <Text style={styles.location}>{`Ubicación: ${ubicacion.descripcion}`}</Text>
      <Text style={styles.contact}>{`Celular: ${celular}`}</Text>
      <Text style={styles.contact}>{`Teléfono fijo: ${telefonoFijo}`}</Text>
      <Text style={styles.address}>{`Dirección: ${direccion}`}</Text>
      <Text style={styles.bio}>{perfil}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  contact: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default ProfileScreen;
