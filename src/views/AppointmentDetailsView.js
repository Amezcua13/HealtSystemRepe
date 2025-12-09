import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Avatar, Card, TextInput, ActivityIndicator, Divider } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAppointmentDetailsViewModel } from "../viewmodels/AppointmentDetailsViewModel";

const AppointmentDetailsView = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Usamos el ViewModel
  const { 
    appointment, 
    loading, 
    diagnosis, 
    setDiagnosis, 
    notes, 
    setNotes, 
    handleFinishConsultation, 
    handleCancelAppointment,
    isFinalized 
  } = useAppointmentDetailsViewModel(route.params, navigation);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  if (!appointment) {
    return <View style={styles.center}><Text>No se encontró la cita.</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Avatar.Icon icon="clipboard-pulse" size={60} style={{ backgroundColor: "#1E88E5" }} />
        <Text style={styles.title}>Consulta Médica</Text>
      </View>

      {/* Tarjeta de Información del Paciente */}
      <Card style={styles.card}>
        <Card.Title title="Datos del Paciente" left={(props) => <Avatar.Icon {...props} icon="account" />} />
        <Card.Content>
          <View style={styles.row}>
            <Text style={styles.label}>Paciente:</Text>
            <Text style={styles.value}>{appointment.patient}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Motivo:</Text>
            <Text style={styles.value}>{appointment.reason || "Consulta general"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha/Hora:</Text>
            <Text style={styles.value}>{appointment.date} - {appointment.time}</Text>
          </View>
          <Text style={[styles.status, { color: isFinalized ? "green" : "orange" }]}>
             Estado: {appointment.status.toUpperCase()}
          </Text>
        </Card.Content>
      </Card>

      <Divider style={{ marginVertical: 20 }} />

      {/* Área Clínica (Diagnóstico y Notas) */}
      <Text style={styles.sectionTitle}>📝 Registro Clínico</Text>
      
      <TextInput
        label="Diagnóstico Médico *"
        mode="outlined"
        value={diagnosis}
        onChangeText={setDiagnosis}
        multiline
        disabled={isFinalized} // Si ya finalizó, solo lectura
        style={styles.input}
        placeholder="Escriba el diagnóstico aquí..."
      />

      <TextInput
        label="Receta / Observaciones"
        mode="outlined"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        disabled={isFinalized}
        style={styles.input}
        placeholder="Medicamentos recetados o notas internas..."
      />

      {/* Botones de Acción */}
      {!isFinalized ? (
        <View style={styles.actions}>
          <Button
            mode="contained"
            icon="check-circle"
            style={styles.finishButton}
            contentStyle={{ paddingVertical: 5 }}
            onPress={handleFinishConsultation}
          >
            Finalizar Consulta & Guardar
          </Button>

          <Button
            mode="text"
            icon="cancel"
            textColor="#D32F2F"
            onPress={handleCancelAppointment}
          >
            Cancelar Cita
          </Button>
        </View>
      ) : (
        <View style={styles.finalizedBanner}>
          <Text style={{ color: "white", fontWeight: "bold" }}>✅ Esta consulta ha finalizado</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F5F5F5", flexGrow: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { alignItems: "center", marginBottom: 20, marginTop: 10 },
  title: { fontSize: 22, fontWeight: "bold", marginTop: 10, color: "#333" },
  card: { backgroundColor: "white", borderRadius: 10, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#1565C0" },
  row: { flexDirection: "row", marginBottom: 8 },
  label: { fontWeight: "bold", width: 90, color: "#555" },
  value: { flex: 1, color: "#333" },
  status: { marginTop: 10, fontWeight: "bold", textAlign: "right" },
  input: { marginBottom: 15, backgroundColor: "white" },
  actions: { marginTop: 10, gap: 15 },
  finishButton: { backgroundColor: "#2E7D32", borderRadius: 8 },
  finalizedBanner: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20
  }
});

export default AppointmentDetailsView;