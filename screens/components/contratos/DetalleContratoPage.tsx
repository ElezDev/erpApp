import React, { useEffect, useState } from "react";
import {
  View,
  Text,
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
import { stylesContrato } from "./StylesContrato";

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
      <View style={stylesContrato.centered}>
        <ActivityIndicator size="large" color="#ff8c00" />
        <Text style={stylesContrato.loadingText}>Cargando contrato...</Text>
      </View>
    );
  }

  if (!contratoDetails) {
    return (
      <Text style={stylesContrato.errorText}>
        No se encontraron detalles del contrato.
      </Text>
    );
  }

  const cards = new Array(1).fill(0);

  return (
    <ScrollView style={stylesContrato.container}>
      <View style={stylesContrato.body}>
        {/* Lado Izquierdo: Logo de la Empresa */}
        <View style={stylesContrato.leftSide}>
          <Image
            source={{ uri: "https://admin.virtualt.org/default/logoweb.png" }}
            style={stylesContrato.logo}
          />
          {/* <Text style={stylesContrato.companyName}>Empresa Virtual</Text> */}
        </View>

        {/* Lado Derecho: Información del contrato y persona */}
        <View style={stylesContrato.rightSide}>
          <View style={stylesContrato.cardHeader}>
            <Image
              source={{ uri: contratoDetails.persona.rutaFotoUrl }}
              style={stylesContrato.avatar}
            />
            <View style={stylesContrato.cardHeaderText}>
              <Text style={stylesContrato.title}>{contratoDetails.numeroContrato}</Text>
              <Text style={stylesContrato.subtitle}>
                {contratoDetails.persona.nombre1}{" "}
                {contratoDetails.persona.apellido1}
              </Text>
              <Text style={stylesContrato.jobTitle}>
                {contratoDetails.persona.perfil}
              </Text>
            </View>
          </View>

          <View style={stylesContrato.detailsContainer}>
            <Text style={stylesContrato.info}>
              Fecha de Contratación: {contratoDetails.fechaContratacion}
            </Text>
            <Text style={stylesContrato.info}>
              Valor Total: $
              {contratoDetails.valorTotalContrato.toLocaleString()}
            </Text>
            <Text style={stylesContrato.info}>
              Estado:
              <Text
                style={
                  contratoDetails.estado.estado === "ACTIVO"
                    ? stylesContrato.activo
                    : stylesContrato.inactivo
                }
              >
                {contratoDetails.estado.estado}
              </Text>
            </Text>
            <Text style={stylesContrato.info}>
              Descripción del Contrato: {contratoDetails.periodoPago}
            </Text>
          </View>
        </View>
      </View>

      {/* Sección con tarjetas adicionales */}
      <View style={stylesContrato.cardGrid}>
        {cards.map((_, index) => (
          <View key={index} style={stylesContrato.cardItem}>
            <Text style={stylesContrato.cardTitle}>Acerca del Contrato</Text>
            <Text style={stylesContrato.cardContent}>
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



export default DetalleContratoPage;
