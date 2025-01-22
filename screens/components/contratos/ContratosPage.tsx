import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import BASE_URL from 'src/Config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContratosModel } from './ContratosTypes';
import { useNavigation } from '@react-navigation/native'; // Importar el hook de navegación

const ContratosPage = () => {
  const [contratos, setContratos] = useState<ContratosModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation(); // Inicializar la navegación

  const fetchContratos = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        console.error("Token no disponible");
        return;
      }
      const response = await axios.get(
        `${BASE_URL}contratos`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setContratos(response.data);
    } catch (error) {
      console.error('Error al cargar los contratos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContratos();
  }, []);

  const renderContrato = ({ item }: { item: ContratosModel }) => (
    <View style={styles.card} onTouchEnd={() => navigation.navigate('DetalleContrato', { contrato: item })}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.persona.rutaFotoUrl }} style={styles.avatar} />
        <View style={styles.cardHeaderText}>
          <Text style={styles.title}>{item.numeroContrato}</Text>
          <Text style={styles.subtitle}>
            {item.persona.nombre1} {item.persona.apellido1}
          </Text>
          <Text style={styles.jobTitle}>{item.persona.perfil}</Text>
        </View>
      </View>
      <Text style={styles.info}>Fecha: {item.fechaContratacion}</Text>
      {/* <Text style={styles.info}>Valor: ${item.valorTotalContrato.toLocaleString()}</Text> */}
      <Text style={[styles.estado, item.estado.estado === 'ACTIVO' ? styles.activo : styles.inactivo]}>
        {item.estado.estado}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff8c00" />
        <Text>Cargando contratos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={contratos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderContrato}
      />
    </View>
  );
};

export default ContratosPage;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#ff8c00', // Naranja
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 14,
    color: '#999',
  },
  info: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  estado: {
    marginTop: 8,
    fontWeight: 'bold',
    textAlign: 'right',
    fontSize: 14,
  },
  activo: {
    color: '#28a745', 
  },
  inactivo: {
    color: '#dc3545', 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});