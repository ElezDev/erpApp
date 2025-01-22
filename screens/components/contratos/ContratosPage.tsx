import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import axios from "axios";
import BASE_URL from "src/Config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ContratosModel } from "./ContratosTypes";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { Checkbox } from "react-native-paper";

const ContratosPage = () => {
  const [contratos, setContratos] = useState<ContratosModel[]>([]);
  const [filteredContratos, setFilteredContratos] = useState<ContratosModel[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [filterState, setFilterState] = useState<string | null>(null);
  const [selectedStates, setSelectedStates] = useState<{
    [key: string]: boolean;
  }>({
    ACTIVO: false,
    INACTIVO: false,
  });

  const navigation = useNavigation();

  const fetchContratos = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        console.error("Token no disponible");
        return;
      }
      const response = await axios.get(`${BASE_URL}contratos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContratos(response.data);
      setFilteredContratos(response.data);
    } catch (error) {
      console.error("Error al cargar los contratos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContratos();
  }, []);

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    if (text.trim() === "") {
      setFilteredContratos(contratos);
    } else {
      const filtered = contratos.filter(
        (item) =>
          item.persona.nombre1.toLowerCase().includes(text.toLowerCase()) ||
          item.persona.apellido1.toLowerCase().includes(text.toLowerCase()) ||
          item.numeroContrato.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredContratos(filtered);
    }
  };

  const applyFilter = () => {
    const statesSelected = Object.keys(selectedStates).filter(
      (state) => selectedStates[state]
    );
    if (statesSelected.length > 0) {
      const filtered = contratos.filter((item) =>
        statesSelected.includes(item.estado.estado)
      );
      setFilteredContratos(filtered);
    } else {
      setFilteredContratos(contratos);
    }
    setModalVisible(false);
  };

  const toggleState = (state: string) => {
    setSelectedStates((prev) => ({
      ...prev,
      [state]: !prev[state],
    }));
  };

  const renderContrato = ({ item }: { item: ContratosModel }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("DetalleContrato", { contrato: item })}
    >
      <View style={styles.cardHeader}>
        <Image
          source={{ uri: item.persona.rutaFotoUrl }}
          style={styles.avatar}
        />
        <View style={styles.cardHeaderText}>
          <Text style={styles.title}>{item.numeroContrato}</Text>
          <Text style={styles.subtitle}>
            {item.persona.nombre1} {item.persona.apellido1}
          </Text>
          <Text style={styles.jobTitle}>{item.persona.perfil}</Text>
        </View>
      </View>
      <Text style={styles.info}>Fecha: {item.fechaContratacion}</Text>
      <Text
        style={[
          styles.estado,
          item.estado.estado === "ACTIVO" ? styles.activo : styles.inactivo,
        ]}
      >
        {item.estado.estado}
      </Text>
    </TouchableOpacity>
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
      {/* Buscador */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar contrato o persona..."
          value={searchTerm}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon
            name="filter"
            size={24}
            color="#ff8c00"
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Lista de contratos */}
      <FlatList
        data={filteredContratos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderContrato}
      />

      {/* Modal para filtrar */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar por estado</Text>
            <View style={styles.checkboxContainer}>
              <View style={styles.checkboxRow}>
                <Checkbox
                  status={selectedStates.ACTIVO ? "checked" : "unchecked"}
                  onPress={() => toggleState("ACTIVO")}
                />
                <Text style={styles.checkboxLabel}>ACTIVO</Text>
              </View>
              <View style={styles.checkboxRow}>
                <Checkbox
                  status={selectedStates.INACTIVO ? "checked" : "unchecked"}
                  onPress={() => toggleState("INACTIVO")}
                />
                <Text style={styles.checkboxLabel}>INACTIVO</Text>
              </View>
            </View>
            <TouchableOpacity onPress={applyFilter} style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Aplicar Filtro</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ContratosPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "#f9f9f9",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  filterIcon: {
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  checkboxContainer: {
    width: "100%",
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
    color: "#333",
  },
  applyButton: {
    backgroundColor: "#ff8c00",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 8,
  },
  cancelButtonText: {
    color: "#999",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#ff8c00",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  jobTitle: {
    fontSize: 14,
    color: "#aaa",
  },
  info: {
    fontSize: 14,
    color: "#888",
  },
  estado: {
    fontSize: 16,
    fontWeight: "bold",
  },
  activo: {
    color: "green",
  },
  inactivo: {
    color: "red",
  },
});
