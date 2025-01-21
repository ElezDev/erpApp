import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Icon from 'react-native-vector-icons/Feather'; // Importar el ícono
import { RootStackParamList } from 'App';
import BASE_URL from 'src/Config/config';
import color from "src/constant/color";


type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true); // Estado para mostrar u ocultar la contraseña
  const [loading, setLoading] = useState(false); // Estado para la pantalla de carga

  useEffect(() => {
    // Cargar los datos guardados si existen
    const loadData = async () => {
      const savedEmail = await AsyncStorage.getItem('email');
      const savedPassword = await AsyncStorage.getItem('password');
      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
      }
    };
    loadData();
  }, []);

  const handleLogin = async () => {
    setLoading(true); // Mostrar la pantalla de carga al iniciar el login
    try {
      const response = await axios.post(`${BASE_URL}login`, {
        email,
        password,
      });
      const token = response.data.token;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('email', email); // Guardar email y password si es necesario
      await AsyncStorage.setItem('password', password); // Guardar la contraseña (opcional)

      // Alert.alert('Inicio de sesión exitoso');
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Error', 'Credenciales incorrectas');
    } finally {
      setLoading(false); // Ocultar la pantalla de carga cuando la solicitud termine
    }
  };

  const toggleSecureText = () => {
    setSecureText(!secureText);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@asset/icon/pet-logo.png')} 
        style={styles.logo}
      />
      <Text style={styles.title}>🐾 Bienvenido a FindPets</Text>
      <Text style={styles.subtitle}>Conecta con tu futuro amigo peludo</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor={color.black}
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor={color.black}
          secureTextEntry={secureText}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={toggleSecureText} style={styles.eyeIcon}>
          <Icon name={secureText ? 'eye-off' : 'eye'} size={24} color={color.primaryColor} />
        </TouchableOpacity>
      </View>

      {/* Pantalla de carga */}
      {loading ? (
        <ActivityIndicator size="large" color={color.secondaryColor} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.footerText}>
        ¿No tienes cuenta?{' '}
        <Text style={styles.footerLink} onPress={() =>{}}>
          Regístrate aquí
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.primaryColorLighter,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: color.primaryColor,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: color.primaryColor,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: color.white,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: color.primaryLighter,
    marginBottom: 15,
    fontSize: 16,
    color: color.primaryColor,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  button: {
    width: '100%',
    backgroundColor: color.primaryColor,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  buttonText: {
    color: color.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 14,
    color: color.primaryColor,
    marginTop: 10,
  },
  footerLink: {
    color: color.secondaryColor,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
