import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { auth, db } from "../services/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export const useEditAppointmentViewModel = (appointment, navigation) => {
  // Mantenemos los estados para mostrar la información visualmente
  const [date, setDate] = useState(appointment.date);
  const [time, setTime] = useState(appointment.time);
  const [doctor, setDoctor] = useState(appointment.doctor);
  const [status, setStatus] = useState(appointment.status);
  const [saludo, setSaludo] = useState("");

  useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setSaludo("🌅 Buenos días,");
    else if (hora >= 12 && hora < 19) setSaludo("🌇 Buenas tardes,");
    else setSaludo("🌙 Buenas noches,");
  }, []);

  // Función para Cancelar la Cita (Cambio de estado)
  const handleCancelAppointment = async () => {
    const uid = auth.currentUser?.uid;

    // Validación 1: Pertenencia
    if (appointment.userId !== uid) {
      Alert.alert("Acceso denegado", "No puedes cancelar una cita que no es tuya.");
      return;
    }

    // Validación 2: Estado actual
    if (status?.toLowerCase() === "finalizada") {
      Alert.alert("No permitido", "No puedes cancelar una cita que ya finalizó.");
      return;
    }
    
    if (status?.toLowerCase() === "cancelada") {
      Alert.alert("Aviso", "Esta cita ya se encuentra cancelada.");
      return;
    }

    // Confirmación y Ejecución
    Alert.alert(
      "Confirmar Cancelación",
      "¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive", // Estilo rojo en iOS
          onPress: async () => {
            try {
              // Actualizamos el estado en Firebase a "cancelada"
              const appointmentRef = doc(db, "appointments", appointment.id);
              await updateDoc(appointmentRef, {
                status: "cancelada",
              });
              
              // Actualizamos el estado local para que se refleje inmediatamente
              setStatus("cancelada");

              Alert.alert("Cita Cancelada", "Tu cita ha sido cancelada exitosamente.", [
                { text: "OK", onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              console.error("Error al cancelar cita:", error);
              Alert.alert("Error", "Ocurrió un problema al intentar cancelar la cita.");
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (value) => {
    const val = value ? value.toLowerCase() : "";
    switch (val) {
      case "finalizada":
        return "#2E7D32"; // Verde
      case "pendiente":
        return "#FFA000"; // Naranja
      case "confirmada":
        return "#1976D2"; // Azul
      case "cancelada":
        return "#D32F2F"; // Rojo
      default:
        return "#000";
    }
  };

  return {
    date,
    time,
    doctor,
    status,
    saludo,
    handleCancelAppointment, // Exportamos la nueva función
    getStatusColor,
  };
};