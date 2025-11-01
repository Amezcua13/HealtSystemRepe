import React, { useRef } from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import { Text, TextInput, Avatar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import { useRegisterViewModel } from "../viewmodels/RegisterViewModel";

const RegisterView = () => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const {
    nombre,
    setNombre,
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    saludo,
    handleRegister,
    navigation,
  } = useRegisterViewModel();

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
      <Avatar.Icon size={100} icon="account-plus" style={styles.icon} color="#FFF" />
      <Text style={styles.saludo}>{saludo}</Text>
      <Text style={styles.appName}>Crea tu cuenta</Text>

      <TextInput
        label="Nombre completo"
        mode="outlined"
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        label="Correo electrónico"
        mode="outlined"
        keyboardType="email-address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        label="Contraseña"
        mode="outlined"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Rol</Text>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Paciente" value="patient" />
          <Picker.Item label="Doctor" value="doctor" />
        </Picker>
      </View>

      <Pressable
        onPress={handleRegister}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.registerButton,
          { transform: [{ scale: pressed ? 0.95 : 1 }] },
        ]}
      >
        <Text style={styles.registerButtonText}>Registrarme</Text>
      </Pressable>

      <Text style={styles.loginText} onPress={() => navigation.navigate("Login")}>
        ¿Ya tienes cuenta? <Text style={styles.link}>Inicia sesión</Text>
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    backgroundColor: "#FFA500",
    marginBottom: 15,
  },
  saludo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  appName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFA500",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#FFF",
  },
  pickerContainer: {
    width: "100%",
    marginBottom: 15,
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 5,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  picker: {
    width: "100%",
  },
  registerButton: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    elevation: 5,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "#1976D2",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginText: {
    marginTop: 10,
    color: "#FFFFFF",
  },
  link: {
    fontWeight: "bold",
    color: "#FFA500",
  },
});

export default RegisterView;
