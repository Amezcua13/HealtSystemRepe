import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Animated } from "react-native";
import { auth, db } from "../services/firebaseConfig";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

export const useAppointmentDetailsViewModel = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { appointment } = route.params;

  const [status, setStatus] = useState(appointment.status);
  const [menuVisible, setMenuVisible] = useState(false);
  const scaleValue = new Animated.Value(1);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    setStatus(appointment.status);
  }, [appointment]);

  const handleUpdateStatus = async (newStatus) => {
    setStatus(newStatus);
    setMenuVisible(false);

    if (appointment.status === "Finalizada") {
      Alert.alert("Acción no permitida", "Esta cita ya ha sido finalizada.");
      return;
    }

    if (appointment.doctorId !== userId) {
      Alert.alert("Acceso denegado", "No tienes permiso para actualizar esta cita.");
      return;
    }

    try {
      await updateDoc(doc(db, "appointments", appointment.id), { status: newStatus });
      Alert.alert("Cita Actualizada", `El estado ha cambiado a: ${newStatus}`);
    } catch (error) {
      console.error("Error al actualizar cita:", error);
      if (error.code === "permission-denied") {
        Alert.alert("Acceso denegado", "No tienes permiso para editar esta cita.");
      } else {
        Alert.alert("Error", "No se pudo actualizar el estado de la cita.");
      }
    }
  };

  const handleCancelAppointment = async () => {
    if (appointment.doctorId !== userId) {
      Alert.alert("Acceso denegado", "No tienes permiso para cancelar esta cita.");
      return;
    }

    Alert.alert("Cancelar Cita", "¿Seguro que deseas cancelar esta cita?", [
      { text: "No", style: "cancel" },
      {
        text: "Sí, cancelar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "appointments", appointment.id));
            Alert.alert("Cita Cancelada", "La cita ha sido eliminada correctamente.");
            navigation.goBack();
          } catch (error) {
            console.error("Error al cancelar cita:", error);
            if (error.code === "permission-denied") {
              Alert.alert("Acceso denegado", "No tienes permiso para cancelar esta cita.");
            } else {
              Alert.alert("Error", "No se pudo cancelar la cita.");
            }
          }
        },
      },
    ]);
  };

  const handlePressIn = () => {
    Animated.spring(scaleValue, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start();
  };

  return {
    appointment,
    status,
    menuVisible,
    setMenuVisible,
    scaleValue,
    handleUpdateStatus,
    handleCancelAppointment,
    handlePressIn,
    handlePressOut,
    navigation,
  };
};
