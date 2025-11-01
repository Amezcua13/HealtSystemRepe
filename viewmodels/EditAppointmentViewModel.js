import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { auth, db } from "../services/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export const useEditAppointmentViewModel = (appointment, navigation) => {
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

  const handleSaveChanges = async () => {
    if (!date || !time || !doctor || !status) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const uid = auth.currentUser?.uid;
    if (appointment.userId !== uid) {
      Alert.alert("Acceso denegado", "No puedes editar una cita que no es tuya.");
      return;
    }

    if (appointment.status === "Finalizada") {
      Alert.alert("Cita finalizada", "No puedes editar una cita finalizada.");
      return;
    }

    try {
      await updateDoc(doc(db, "appointments", appointment.id), {
        date,
        time,
        doctor,
        status,
      });
      Alert.alert("✅ Éxito", "La cita ha sido actualizada.");
      navigation.navigate("Appointments");
    } catch (error) {
      console.error("Error al actualizar cita:", error);
      if (error.code === "permission-denied") {
        Alert.alert("Permiso denegado", "No tienes permiso para editar esta cita.");
      } else {
        Alert.alert("Error", "No se pudo actualizar la cita.");
      }
    }
  };

  const getStatusColor = (value) => {
    switch (value.toLowerCase()) {
      case "finalizada":
        return "#2E7D32";
      case "pendiente":
        return "#FFA000";
      case "confirmada":
        return "#1976D2";
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
    setDate,
    setTime,
    setDoctor,
    setStatus,
    handleSaveChanges,
    getStatusColor,
  };
};
