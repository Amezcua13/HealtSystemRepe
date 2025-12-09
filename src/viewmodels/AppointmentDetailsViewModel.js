import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { doc, updateDoc, getDoc } from "firebase/firestore"; // Usamos updateDoc
import { db } from "../services/firebaseConfig";

export const useAppointmentDetailsViewModel = (routeParams, navigation) => {
  // Corrección del bug de parámetros:
  // A veces llega el objeto completo 'appointment', a veces solo el ID. Manejamos ambos.
  const initialAppointment = routeParams.appointment || null;
  const appointmentId = initialAppointment ? initialAppointment.id : routeParams.appointmentId;

  const [appointment, setAppointment] = useState(initialAppointment);
  const [loading, setLoading] = useState(!initialAppointment); // Si ya tenemos datos, no cargamos
  
  // Campos clínicos (Solo para el doctor)
  const [diagnosis, setDiagnosis] = useState(initialAppointment?.diagnosis || "");
  const [notes, setNotes] = useState(initialAppointment?.notes || "");

  // Cargar datos frescos de Firebase (por si cambiaron recientemente)
  useEffect(() => {
    const fetchLatestData = async () => {
      if (!appointmentId) return;
      try {
        const docRef = doc(db, "appointments", appointmentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setAppointment(data);
          // Cargar diagnóstico previo si existe
          if (data.diagnosis) setDiagnosis(data.diagnosis);
          if (data.notes) setNotes(data.notes);
        }
      } catch (error) {
        console.error("Error cargando cita:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestData();
  }, [appointmentId]);

  // Acción: Finalizar Consulta (Guardar historial)
  const handleFinishConsultation = async () => {
    if (!diagnosis.trim()) {
      Alert.alert("Falta información", "Debes ingresar un diagnóstico antes de finalizar la consulta.");
      return;
    }

    try {
      const docRef = doc(db, "appointments", appointment.id);
      await updateDoc(docRef, {
        status: "finalizada",
        diagnosis: diagnosis,
        notes: notes,
        finishedAt: new Date() // Guardamos cuándo ocurrió
      });
      
      Alert.alert("Consulta Finalizada", "El historial clínico ha sido guardado correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al finalizar:", error);
      Alert.alert("Error", "No se pudo guardar la consulta.");
    }
  };

  // Acción: Cancelar Cita (Solo administrativo)
  const handleCancelAppointment = async () => {
    Alert.alert(
      "Cancelar Cita",
      "¿El paciente no asistió o hubo un error? La cita quedará registrada como cancelada.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              const docRef = doc(db, "appointments", appointment.id);
              await updateDoc(docRef, { // NO usamos deleteDoc
                status: "cancelada",
                updatedAt: new Date()
              });
              Alert.alert("Cita Cancelada", "El estado se ha actualizado.");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "No se pudo cancelar la cita.");
            }
          },
        },
      ]
    );
  };

  return {
    appointment,
    loading,
    diagnosis,
    setDiagnosis,
    notes,
    setNotes,
    handleFinishConsultation,
    handleCancelAppointment,
    isFinalized: appointment?.status?.toLowerCase() === "finalizada"
  };
};