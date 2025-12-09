import * as React from "react"; // 👈 ESTO SOLUCIONA EL ERROR DE REFERENCE
import { useRef } from "react";
import { View, StyleSheet, Pressable, Animated, Alert } from "react-native";
import { Text, TextInput, ActivityIndicator } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEditAppointmentViewModel } from "../viewmodels/EditAppointmentViewModel";

const EditAppointmentView = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  // Validación de seguridad por si los parámetros fallan
  const appointment = route.params?.appointment;

  if (!appointment) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={{color: 'white', textAlign: 'center', marginTop: 10}}>Cargando datos...</Text>
      </View>
    );
  }

  const scaleValue = useRef(new Animated.Value(1)).current;

  const {
    date,
    time,
    doctor,
    status,
    saludo,
    // Eliminamos setDate, setTime, etc. porque ya no se van a editar aquí
    handleCancelAppointment, // 👈 Asegúrate de que tu ViewModel exporte esto (como vimos antes)
    getStatusColor,
  } = useEditAppointmentViewModel(appointment, navigation);

  // Animaciones del botón
  const handlePressIn = () => {
    Animated.spring(scaleValue, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <LinearGradient colors={["#0D47A1", "#1976D2"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.saludo}>{saludo}</Text>
        <Text style={styles.titulo}>Detalle de Cita</Text>
      </View>

      <View style={styles.form}>
        {/* CAMPOS BLOQUEADOS (SOLO LECTURA) */}
        <TextInput
          label="Fecha"
          mode="outlined"
          style={[styles.input, styles.disabledInput]}
          value={date}
          editable={false} // Bloqueado
          right={<TextInput.Icon icon="calendar" color="#757575"/>}
        />
        <TextInput
          label="Hora"
          mode="outlined"
          style={[styles.input, styles.disabledInput]}
          value={time}
          editable={false} // Bloqueado
          right={<TextInput.Icon icon="clock" color="#757575"/>}
        />
        <TextInput
          label="Doctor"
          mode="outlined"
          style={[styles.input, styles.disabledInput]}
          value={doctor}
          editable={false} // Bloqueado
          right={<TextInput.Icon icon="doctor" color="#757575"/>}
        />

        {/* Picker para estado (Visualización solamente) */}
        <View style={styles.pickerWrapper}>
          <Text style={styles.label}>Estado Actual</Text>
          <View style={[styles.picker, { backgroundColor: "#E0E0E0" }]}>
            <Picker
              selectedValue={status}
              enabled={false} // Bloqueado
              dropdownIconColor="#757575"
            >
              <Picker.Item label="Pendiente" value="pendiente" color="#FFA000" />
              <Picker.Item label="Confirmada" value="confirmada" color="#1976D2" />
              <Picker.Item label="Finalizada" value="finalizada" color="#2E7D32" />
              <Picker.Item label="Cancelada" value="cancelada" color="#D32F2F" />
            </Picker>
          </View>
        </View>

        {/* Botón de Acción Principal: CANCELAR CITA */}
        {/* Solo mostramos el botón de cancelar si la cita NO está finalizada o cancelada */}
        {status !== 'finalizada' && status !== 'cancelada' && (
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                <Pressable
                onPress={handleCancelAppointment} // 👈 Llama a la función de cancelar
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.cancelActionButton} // Estilo rojo
                >
                <Text style={styles.saveButtonText}>🗑️ Cancelar Cita</Text>
                </Pressable>
            </Animated.View>
        )}

        {/* Botón para regresar */}
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.cancelButtonText}>🔙 Regresar</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  header: { alignItems: "center", marginBottom: 20 },
  saludo: { fontSize: 20, color: "#FFFFFF" },
  titulo: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF" },
  form: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    elevation: 5,
  },
  input: { marginBottom: 10, backgroundColor: "#FFF" },
  disabledInput: { 
    backgroundColor: "#F0F0F0", // Gris claro para indicar deshabilitado
    opacity: 0.8 
  },
  pickerWrapper: { marginBottom: 20 },
  label: { marginBottom: 4, fontWeight: "bold", color: "#555" },
  picker: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    overflow: "hidden",
  },
  // Botón Rojo para Cancelar (Acción Destructiva)
  cancelActionButton: {
    backgroundColor: "#D32F2F", // Rojo
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    elevation: 3,
  },
  // Botón Neutro para Regresar
  backButton: {
    backgroundColor: "#757575", // Gris
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 15,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditAppointmentView;