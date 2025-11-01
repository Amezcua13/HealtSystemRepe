import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text, Card, Avatar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useHomeViewModel } from "../viewmodels/HomeViewModel";

const HomeView = () => {
  const {
    user,
    saludo,
    nextAppointment,
    handleLogout,
    navigation,
  } = useHomeViewModel();

  return (
    <LinearGradient colors={["#0D47A1", "#1976D2"]} style={styles.container}>
      <View style={styles.header}>
        <Avatar.Image
          size={70}
          source={{ uri: user?.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.saludo}>{saludo}</Text>
          <Text style={styles.userName}>{user?.displayName || "Usuario"}</Text>
          <Text style={styles.appName}>Bienvenido a HealtSystem</Text>
        </View>
      </View>

      {nextAppointment ? (
        <Card style={styles.card}>
          <Card.Title title="Próxima Cita" left={(props) => <Avatar.Icon {...props} icon="calendar" />} />
          <Card.Content>
            <Text style={styles.appointmentText}>🩺 Dr. {nextAppointment.doctor}</Text>
            <Text style={styles.appointmentText}>📅 {nextAppointment.date}</Text>
            <Text style={styles.appointmentText}>⏰ {nextAppointment.time}</Text>
          </Card.Content>
          <Card.Actions>
            <Pressable onPress={() => navigation.navigate("Appointments")} style={styles.menuButton}>
              <Text style={styles.menuButtonText}>Ver Citas</Text>
            </Pressable>
          </Card.Actions>
        </Card>
      ) : (
        <Text style={styles.noAppointments}>No tienes citas próximas.</Text>
      )}

      <View style={styles.menu}>
        <Pressable onPress={() => navigation.navigate("Appointments")} style={styles.menuButton}>
          <Text style={styles.menuButtonText}>📋 Citas Médicas</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Profile")} style={styles.menuButton}>
          <Text style={styles.menuButtonText}>👤 Mi Perfil</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("History")} style={styles.menuButton}>
          <Text style={styles.menuButtonText}>📜 Historial</Text>
        </Pressable>
      </View>

      <Pressable onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </Pressable>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: "#1E88E5",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 5,
  },
  saludo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  appName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFA500",
    marginTop: 5,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 4,
  },
  appointmentText: {
    fontSize: 16,
  },
  noAppointments: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 10,
  },
  menu: {
    alignItems: "center",
    gap: 10,
  },
  menuButton: {
    width: "100%",
    paddingVertical: 12,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    elevation: 5,
    alignItems: "center",
  },
  menuButtonText: {
    color: "#1976D2",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
});

export default HomeView;
