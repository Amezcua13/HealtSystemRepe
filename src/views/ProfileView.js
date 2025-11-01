import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Text, Avatar, TextInput } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useProfileViewModel } from "../viewmodels/ProfileViewModel";
import { useNavigation } from "@react-navigation/native";

const ProfileView = () => {
  const navigation = useNavigation();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const {
    user,
    saludo,
    displayName,
    setDisplayName,
    photoURL,
    handlePickImage,
    handleUpdateProfile,
    handleResetPassword,
  } = useProfileViewModel(navigation);

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
        <Text style={styles.saludo}>{saludo}</Text>
        <Text style={styles.titulo}>Mi Perfil</Text>
      </View>

      <TouchableOpacity onPress={handlePickImage}>
        <Avatar.Image
          size={100}
          source={{
            uri:
              photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={styles.avatar}
        />
      </TouchableOpacity>
      <Text style={styles.email}>{user?.email}</Text>

      <TextInput
        label="Nombre"
        mode="outlined"
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
      />

      <Pressable
        onPress={handleUpdateProfile}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.button,
          { transform: [{ scale: pressed ? 0.95 : 1 }] },
        ]}
      >
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </Pressable>

      <Pressable
        onPress={handleResetPassword}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.passwordButton,
          { transform: [{ scale: pressed ? 0.95 : 1 }] },
        ]}
      >
        <Text style={styles.buttonText}>Cambiar Contraseña</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("Home")}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.backButton,
          { transform: [{ scale: pressed ? 0.95 : 1 }] },
        ]}
      >
        <Text style={styles.buttonText}>Volver al Inicio</Text>
      </Pressable>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  header: { alignItems: "center", marginBottom: 20 },
  saludo: { fontSize: 20, color: "#FFF" },
  titulo: { fontSize: 24, fontWeight: "bold", color: "#FFF" },
  avatar: { backgroundColor: "#1976D2", marginBottom: 20 },
  email: { fontSize: 18, color: "#FFF", marginBottom: 10 },
  input: { width: "100%", marginBottom: 15, backgroundColor: "#FFF" },
  button: {
    backgroundColor: "#FFA500",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  passwordButton: {
    backgroundColor: "#FF3D00",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: "#00897B",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});

export default ProfileView;
