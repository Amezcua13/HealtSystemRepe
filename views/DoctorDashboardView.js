import React, { useRef } from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import { Text, Avatar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import useDoctorDashboardViewModel from "../viewmodels/DoctorDashboardViewModel";

const DoctorDashboardView = () => {
  const navigation = useNavigation();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const {
    nombreUsuario,
    rolUsuario,
    navegarSegunRol,
    navegarAAgendar,
    navegarAMiPerfil,
  } = useDoctorDashboardViewModel(navigation);

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
    <LinearGradient colors={["#1565C0", "#1E88E5"]} style={styles.container}>
      <View style={styles.header}>
        <Avatar.Icon size={80} icon="account-circle" style={styles.avatar} />
        <Text style={styles.bienvenida}>Bienvenido, {nombreUsuario}</Text>
        <Text style={styles.rol}>Rol: {rolUsuario}</Text>
      </View>

      <View style={styles.botonesContainer}>
        <Pressable
          onPress={navegarSegunRol}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={({ pressed }) => [
            styles.boton,
            { transform: [{ scale: pressed ? 0.95 : 1 }] },
          ]}
        >
          <Text style={styles.textoBoton}>
            {rolUsuario === "doctor" ? "👨‍⚕️ Ver Citas Asignadas" : "📅 Ver Mis Citas"}
          </Text>
        </Pressable>

        {rolUsuario !== "doctor" && (
          <Pressable
            onPress={navegarAAgendar}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={({ pressed }) => [
              styles.boton,
              { transform: [{ scale: pressed ? 0.95 : 1 }] },
            ]}
          >
            <Text style={styles.textoBoton}>➕ Agendar Nueva Cita</Text>
          </Pressable>
        )}

        <Pressable
          onPress={navegarAMiPerfil}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={({ pressed }) => [
            styles.botonSecundario,
            { transform: [{ scale: pressed ? 0.95 : 1 }] },
          ]}
        >
          <Text style={styles.textoBotonSecundario}>👤 Mi Perfil</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    backgroundColor: "#FFC107",
    marginBottom: 10,
  },
  bienvenida: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
  },
  rol: {
    fontSize: 16,
    color: "#E0E0E0",
  },
  botonesContainer: {
    gap: 15,
  },
  boton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  textoBoton: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  botonSecundario: {
    backgroundColor: "#9E9E9E",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  textoBotonSecundario: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DoctorDashboardView;
