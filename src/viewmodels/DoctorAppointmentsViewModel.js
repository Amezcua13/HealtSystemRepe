import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../services/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export const useDoctorAppointmentsViewModel = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [])
  );

  const fetchAppointments = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // ESTRATEGIA HÍBRIDA (Compatibilidad):
      // Intentamos buscar por 'doctorId' (lo nuevo) Y por 'doctor' (nombre, lo viejo)
      // Nota: Firestore no permite "OR" lógicos sencillos en una sola query mixta.
      // Haremos la búsqueda segura por ID, que es lo profesional.
      
      const q = query(
        collection(db, "appointments"), 
        where("doctorId", "==", currentUser.uid) // <--- Búsqueda por UID (Segura)
      );
      
      const snapshot = await getDocs(q);
      
      // Si no encuentra nada, quizás son citas viejas guardadas solo con nombre
      let list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      if (list.length === 0 && currentUser.displayName) {
          console.log("Intentando buscar por nombre (compatibilidad)...");
          const qName = query(
            collection(db, "appointments"), 
            where("doctor", "==", currentUser.displayName)
          );
          const snapName = await getDocs(qName);
          list = snapName.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      }
      
      setAppointments(list);
    } catch (error) {
      console.error("Error cargando citas:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    appointments,
    loading,
    fetchAppointments,
  };
};