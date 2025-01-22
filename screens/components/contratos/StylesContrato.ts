import { StyleSheet } from 'react-native';

export const stylesContrato = StyleSheet.create({
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