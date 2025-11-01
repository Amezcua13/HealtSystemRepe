import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Button, Avatar, Card } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";

const AppointmentDetailsView = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { appointmentId } = route.params;

  const [appointment, setAppointment] = useState(null);
  const [isDoctor, setIsDoctor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const ref = doc(db, "appointments", appointmentId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setAppointment({ id: snap.id, ...snap.data() });
          const currentUid = auth.currentUser?.uid;
          const doctorOwner = snap.data().doctorId === currentUid;
          setIsDoctor(doctorOwner);
        } else {
          Alert.alert("Error", "Cita no encontrada");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error al obtener cita:", error);
        Alert.alert("Error", "No se pudo cargar la cita");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, []);

  const finalizarCita = async () => {
    try {
      if (!isDoctor || appointment.status === "Finalizada") {
        Alert.alert("Acceso denegado", "No puedes modificar esta cita.");
        return;
      }

      const ref = doc(db, "appointments", appointment.id);
      await updateDoc(ref, { status: "Finalizada" });

      Alert.alert("✅ Cita finalizada", "La cita fue marcada como finalizada.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al finalizar cita:", error);
      if (error.code === "permission-denied") {
        Alert.alert("Acceso denegado", "No tienes permiso para finalizar esta cita.");
      } else {
        Alert.alert("Error", "No se pudo finalizar la cita.");
      }
    }
  };

  const cancelarCita = async () => {
    Alert.alert(
      "¿Cancelar cita?",
      "Esta acción eliminará permanentemente la cita.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí",
          onPress: async () => {
            try {
              if (!isDoctor) {
                Alert.alert("Acceso denegado", "Solo el doctor asignado puede cancelar.");
                return;
              }

              const ref = doc(db, "appointments", appointment.id);
              await deleteDoc(ref);
              Alert.alert("✅ Cita cancelada", "La cita fue eliminada.");
              navigation.goBack();
            } catch (error) {
              console.error("Error al cancelar cita:", error);
              Alert.alert("Error", "No se pudo cancelar la cita.");
            }
          },
        },
      ]
    );
  };

  if (loading || !appointment) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Avatar.Icon icon="calendar" size={70} style={styles.icon} />
      <Text style={styles.title}>Detalle de la cita</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.label}>Paciente:</Text>
          <Text>{appointment.patient}</Text>

          <Text style={styles.label}>Doctor:</Text>
          <Text>{appointment.doctor}</Text>

          <Text style={styles.label}>Fecha:</Text>
          <Text>{appointment.date}</Text>

          <Text style={styles.label}>Hora:</Text>
          <Text>{appointment.time}</Text>

          <Text style={styles.label}>Estado:</Text>
          <Text>{appointment.status}</Text>
        </Card.Content>
      </Card>

      {isDoctor && appointment.status !== "Finalizada" && (
        <View style={styles.actions}>
          <Button
            mode="contained"
            style={styles.finishButton}
            onPress={finalizarCita}
          >
            Finalizar Cita
          </Button>
          <Button
            mode="outlined"
            style={styles.cancelButton}
            onPress={cancelarCita}
          >
            Cancelar Cita
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  icon: {
    backgroundColor: "#1976D2",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  actions: {
    width: "100%",
    gap: 10,
  },
  finishButton: {
    backgroundColor: "#1976D2",
    padding: 8,
  },
  cancelButton: {
    borderColor: "#D32F2F",
    borderWidth: 1,
    padding: 8,
  },
});

export default AppointmentDetailsView;
