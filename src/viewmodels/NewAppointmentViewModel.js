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
    const user = auth.currentUser;
    if (!user) return;
    
    setLoading(true);
    try {
      console.log("🔍 Buscando citas para Doctor ID:", user.uid);

      // SOLO buscamos por ID. Si esta query falla, es problema de Reglas.
      const q = query(
        collection(db, "appointments"), 
        where("doctorId", "==", user.uid)
      );
      
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      console.log(`✅ Citas encontradas: ${list.length}`);
      setAppointments(list);

    } catch (error) {
      console.error("❌ Error Permisos:", error);
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