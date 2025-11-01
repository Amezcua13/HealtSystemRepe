import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Animated,
} from "react-native";
import { Text, Card, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useHistoryViewModel } from "../viewmodels/HistoryViewModel";

const HistoryView = () => {
  const { appointments, saludo } = useHistoryViewModel();
  const navigation = useNavigation();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "finalizada":
        return "#2E7D32"; // Verde
      case "pendiente":
        return "#F57C00"; // Naranja
      case "confirmada":
        return "#1976D2"; // Azul
      default:
        return "#757575"; // Gris
    }
  };

  return (
    <LinearGradient colors={["#0D47A1", "#1976D2"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.saludo}>{saludo}</Text>
        <Text style={styles.titulo}>📜 Historial de Citas</Text>
      </View>

      {appointments.length > 0 ? (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title
                title={`Paciente: ${item.patient || "No disponible"}`}
                left={(props) => (
                  <Avatar.Icon
                    {...props}
                    icon="history"
                    style={{ backgroundColor: "#1976D2" }}
                  />
                )}
              />
              <Card.Content>
                <Text style={styles.appointmentDetail}>
                  🩺 Doctor: <Text style={styles.bold}>{item.doctor}</Text>
                </Text>
                <Text style={styles.appointmentDetail}>
                  📅 Fecha: <Text style={styles.bold}>{item.date}</Text>
                </Text>
                <Text style={styles.appointmentDetail}>
                  ⏰ Hora: <Text style={styles.bold}>{item.time}</Text>
                </Text>
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(item.status) },
                  ]}
                >
                  📌 Estado: {item.status}
                </Text>
              </Card.Content>
            </Card>
          )}
        />
      ) : (
        <Text style={styles.noAppointments}>No tienes citas anteriores.</Text>
      )}

      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Pressable
          onPress={() => navigation.navigate("Home")}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>⬅️ Volver al Inicio</Text>
        </Pressable>
      </Animated.View>
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
    alignItems: "center",
    marginBottom: 20,
  },
  saludo: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 5,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 10,
    marginBottom: 12,
    elevation: 5,
  },
  appointmentDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  noAppointments: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 30,
  },
  backButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default HistoryView;
