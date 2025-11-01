import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Animated,
  TextInput,
} from "react-native";
import { Text, Avatar, Card } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useDoctorProfileViewModel } from "../viewmodels/DoctorProfileViewModel";

const DoctorProfileView = () => {
  const {
    appointments,
    nombre,
    photoURL,
    email,
    displayName,
    setDisplayName,
    handleLogout,
    handlePickImage,
    handleSaveProfile,
    handleResetPassword,
  } = useDoctorProfileViewModel();

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

  return (
    <LinearGradient colors={["#0D47A1", "#1976D2"]} style={styles.container}>
      {/* Header con avatar y nombre */}
      <View style={styles.header}>
        <Pressable onPress={handlePickImage}>
          <Avatar.Image
            size={100}
            source={{
              uri:
                photoURL ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            style={styles.avatar}
          />
        </Pressable>
        <Text style={styles.name}>👨‍⚕️ Dr. {nombre}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      {/* Input para nombre */}
      <TextInput
        style={styles.input}
        placeholder="Tu nombre"
        value={displayName}
        onChangeText={setDisplayName}
      />

      {/* Botón para guardar cambios */}
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Pressable
          onPress={handleSaveProfile}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        </Pressable>
      </Animated.View>

      {/* Botón para restablecer contraseña */}
      <Pressable onPress={handleResetPassword} style={styles.resetButton}>
        <Text style={styles.resetText}>🔑 Cambiar Contraseña</Text>
      </Pressable>

      {/* Lista de citas */}
      <Text style={styles.subtitle}>🗓️ Citas asignadas:</Text>
      {appointments.length > 0 ? (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title title={`Paciente: ${item.patient}`} />
              <Card.Content>
                <Text>📅 Fecha: {item.date}</Text>
                <Text>⏰ Hora: {item.time}</Text>
                <Text>📌 Estado: {item.status}</Text>
              </Card.Content>
            </Card>
          )}
        />
      ) : (
        <Text style={styles.noAppointments}>
          No tienes citas asignadas actualmente.
        </Text>
      )}

      {/* Botón para cerrar sesión */}
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Pressable
          onPress={handleLogout}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.logoutButton}
        >
          <Text style={styles.buttonText}>🚪 Cerrar Sesión</Text>
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
  avatar: {
    backgroundColor: "#4CAF50",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  email: {
    color: "#EEEEEE",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FFC107",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
  resetButton: {
    backgroundColor: "#1976D2",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
  },
  resetText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
  },
  noAppointments: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: "#D32F2F",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 15,
  },
});

export default DoctorProfileView;
