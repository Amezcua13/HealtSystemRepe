import React, { useRef } from "react";
import { View, StyleSheet, FlatList, Pressable, Animated } from "react-native";
import { Text, Card, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useDoctorAppointmentsViewModel } from "../viewmodels/DoctorAppointmentsViewModel";

const DoctorAppointmentsView = () => {
  const navigation = useNavigation();
  const scaleValue = useRef(new Animated.Value(1)).current;
  const { appointments, finalizarCita } = useDoctorAppointmentsViewModel();

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

  return (
    <LinearGradient colors={["#0D47A1", "#1976D2"]} style={styles.container}>
      <View style={styles.header}>
        <Avatar.Icon size={60} icon="calendar-check" style={styles.avatar} />
        <Text style={styles.title}>Citas Asignadas</Text>
      </View>

      {appointments.length > 0 ? (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title title={`Paciente: ${item.patient}`} left={(props) => <Avatar.Icon {...props} icon="account" />} />
              <Card.Content>
                <Text style={styles.appointmentText}>📅 Fecha: {item.date}</Text>
                <Text style={styles.appointmentText}>⏰ Hora: {item.time}</Text>
                <Text style={styles.appointmentText}>📍 Ubicación: {item.location || "No especificada"}</Text>
                <Text style={styles.appointmentText}>📝 Estado: <Text style={[styles.estado, item.status === "Finalizada" && styles.finalizada]}>{item.status}</Text></Text>
              </Card.Content>
              <Card.Actions style={{ justifyContent: "space-between" }}>
                <Pressable
                  onPress={() => navigation.navigate("AppointmentDetails", { appointment: item })}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  style={({ pressed }) => [styles.detailButton, { transform: [{ scale: pressed ? 0.95 : 1 }] }]}
                >
                  <Text style={styles.detailButtonText}>Ver Detalles</Text>
                </Pressable>

                {item.status !== "Finalizada" && (
                  <Pressable
                    onPress={() => finalizarCita(item.id)}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={({ pressed }) => [styles.finalizarButton, { transform: [{ scale: pressed ? 0.95 : 1 }] }]}
                  >
                    <Text style={styles.finalizarButtonText}>Finalizar</Text>
                  </Pressable>
                )}
              </Card.Actions>
            </Card>
          )}
        />
      ) : (
        <Text style={styles.noAppointments}>No tienes citas asignadas.</Text>
      )}

      <Pressable
        onPress={() => navigation.goBack()}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [styles.backButton, { transform: [{ scale: pressed ? 0.95 : 1 }] }]}
      >
        <Text style={styles.backButtonText}>Volver al Dashboard</Text>
      </Pressable>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  avatar: { backgroundColor: "#FFA500", marginRight: 10 },
  title: { fontSize: 24, fontWeight: "bold", color: "#FFF" },
  card: { backgroundColor: "#FFF", borderRadius: 15, padding: 15, marginBottom: 15, elevation: 4 },
  appointmentText: { fontSize: 16, marginBottom: 4 },
  estado: { fontWeight: "bold" },
  finalizada: { color: "green" },
  detailButton: { backgroundColor: "#1E88E5", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 30 },
  detailButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  finalizarButton: { backgroundColor: "green", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 30 },
  finalizarButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  noAppointments: { textAlign: "center", color: "#FFF", fontSize: 16, marginBottom: 10 },
  backButton: { backgroundColor: "#D32F2F", paddingVertical: 12, borderRadius: 30, alignItems: "center", marginTop: 10 },
  backButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});

export default DoctorAppointmentsView;
