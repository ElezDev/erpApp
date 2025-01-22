import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import BASE_URL from "src/Config/config";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ContratosModel } from "./ContratosTypes";
import { RootStackParamList } from "App";

type DetalleContratoScreenRouteProp = RouteProp<
  RootStackParamList,
  "DetalleContrato"
>;
type DetalleContratoScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "DetalleContrato"
>;

interface DetalleContratoProps {
  route: DetalleContratoScreenRouteProp;
  navigation: DetalleContratoScreenNavigationProp;
}

const DetalleContratoPage = ({ route }: DetalleContratoProps) => {
  const { contrato } = route.params;

  const [contratoDetails, setContratoDetails] = useState<ContratosModel | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContrato = async () => {
      try {
        if (!contrato.numeroContrato) {
          const response = await axios.get(
            `${BASE_URL}contrato_by_id/${contrato.id}`
          );
          setContratoDetails(response.data);
        } else {
          setContratoDetails(contrato);
        }
      } catch (error) {
        console.error("Error al cargar el contrato:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContrato();
  }, [contrato]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ff8c00" />
        <Text style={styles.loadingText}>Cargando contrato...</Text>
      </View>
    );
  }

  if (!contratoDetails) {
    return (
      <Text style={styles.errorText}>
        No se encontraron detalles del contrato.
      </Text>
    );
  }

  const cards = new Array(1).fill(0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.body}>
        {/* Lado Izquierdo: Logo de la Empresa */}
        <View style={styles.leftSide}>
          <Image
            source={{ uri: "https://admin.virtualt.org/default/logoweb.png" }}
            style={styles.logo}
          />
          {/* <Text style={styles.companyName}>Empresa Virtual</Text> */}
        </View>

        {/* Lado Derecho: Información del contrato y persona */}
        <View style={styles.rightSide}>
          <View style={styles.cardHeader}>
            <Image
              source={{ uri: contratoDetails.persona.rutaFotoUrl }}
              style={styles.avatar}
            />
            <View style={styles.cardHeaderText}>
              <Text style={styles.title}>{contratoDetails.numeroContrato}</Text>
              <Text style={styles.subtitle}>
                {contratoDetails.persona.nombre1}{" "}
                {contratoDetails.persona.apellido1}
              </Text>
              <Text style={styles.jobTitle}>
                {contratoDetails.persona.perfil}
              </Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.info}>
              Fecha de Contratación: {contratoDetails.fechaContratacion}
            </Text>
            <Text style={styles.info}>
              Valor Total: $
              {contratoDetails.valorTotalContrato.toLocaleString()}
            </Text>
            <Text style={styles.info}>
              Estado:
              <Text
                style={
                  contratoDetails.estado.estado === "ACTIVO"
                    ? styles.activo
                    : styles.inactivo
                }
              >
                {contratoDetails.estado.estado}
              </Text>
            </Text>
            <Text style={styles.info}>
              Descripción del Contrato: {contratoDetails.periodoPago}
            </Text>
          </View>
        </View>
      </View>

      {/* Sección con tarjetas adicionales */}
      <View style={styles.cardGrid}>
        {cards.map((_, index) => (
          <View key={index} style={styles.cardItem}>
            <Text style={styles.cardTitle}>Acerca del Contrato</Text>
            <Text style={styles.cardContent}>
              {contratoDetails.fechaContratacion}
              {"\n"}
              {contratoDetails.fechaFinalContrato}
              {"\n"}
              {contratoDetails.salario.rol.name}
              {"\n"}
              {contratoDetails.objetoContrato}
              {"\n"}
              {contratoDetails.salario.valor}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 16,
  },
  body: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  leftSide: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  rightSide: {
    flex: 2,
    paddingLeft: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  cardHeaderText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 14,
    color: "#888",
  },
  detailsContainer: {
    marginTop: 12,
  },
  info: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  activo: {
    color: "#28a745",
    fontWeight: "bold",
  },
  inactivo: {
    color: "#dc3545",
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#888",
  },
  errorText: {
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
    marginTop: 20,
  },

  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cardItem: {
    backgroundColor: "#ffffff",
    width: "48%",
    marginBottom: 16,
    flex: 12,
    paddingLeft: 20,
    borderRadius: 12,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardContent: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
  },
});

export default DetalleContratoPage;
