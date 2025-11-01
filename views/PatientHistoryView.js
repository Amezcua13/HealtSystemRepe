// views/PatientHistoryScreenView.js
import React from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Text, Card, Avatar, Divider } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { usePatientHistoryViewModel } from "../viewmodels/PatientHistoryViewModel";

const PatientHistoryView = () => {
  const { history, loading, saludo } = usePatientHistoryViewModel();

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={`👨‍⚕️ Dr. ${item.doctor}`}
        subtitle={`📅 ${item.date} ⏰ ${item.time}`}
        left={(props) => <Avatar.Icon {...props} icon="history" />}
      />
      <Card.Content>
        <Text style={styles.infoText}>📍 Ubicación: {item.location || "No especificada"}</Text>
        <Divider style={{ marginVertical: 5 }} />
        <Text style={[styles.status, getStatusStyle(item.status)]}>
          📌 Estado: {item.status}
        </Text>
      </Card.Content>
    </Card>
  );

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "pendiente":
        return { color: "#FFA000" };
      case "confirmada":
        return { color: "#1976D2" };
      case "finalizada":
        return { color: "#2E7D32" };
      default:
        return { color: "#000" };
    }
  };

  return (
    <LinearGradient colors={["#0D47A1", "#1976D2"]} style={styles.container}>
      <View style={styles.header}>
        <Avatar.Icon icon="notebook-check" size={60} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.saludo}>{saludo}</Text>
          <Text style={styles.title}>Historial de Citas Finalizadas</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFF" style={{ marginTop: 30 }} />
      ) : history.length > 0 ? (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={styles.noData}>No tienes historial de citas finalizadas.</Text>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: "#FFA500",
    marginRight: 10,
  },
  headerText: {
    flex: 1,
  },
  saludo: {
    fontSize: 18,
    color: "#FFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
  },
  card: {
    backgroundColor: "#FFF",
    marginBottom: 15,
    borderRadius: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noData: {
    textAlign: "center",
    fontSize: 16,
    color: "#FFF",
    marginTop: 30,
  },
});

export default PatientHistoryView;
