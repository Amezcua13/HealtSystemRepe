import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { auth, db } from "../services/firebaseConfig";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

export const useDoctorAppointmentsViewModel = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "appointments"), where("doctor", "==", auth.currentUser.displayName));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAppointments(list);
  };

  const finalizarCita = async (appointmentId) => {
    Alert.alert("Finalizar Cita", "¿Marcar esta cita como finalizada?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Finalizar",
        onPress: async () => {
          await updateDoc(doc(db, "appointments", appointmentId), { status: "Finalizada" });
          fetchAppointments();
        },
      },
    ]);
  };

  return {
    appointments,
    finalizarCita,
    fetchAppointments,
  };
};
