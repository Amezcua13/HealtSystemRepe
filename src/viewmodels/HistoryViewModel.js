import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../services/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export const useHistoryViewModel = () => {
  // Inicializamos como array vacío [] para evitar el error "length of undefined"
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saludo, setSaludo] = useState("");

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
      obtenerSaludo();
    }, [])
  );

  const obtenerSaludo = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setSaludo("🌅 Buenos días,");
    else if (hora >= 12 && hora < 19) setSaludo("🌇 Buenas tardes,");
    else setSaludo("🌙 Buenas noches,");
  };

  const fetchHistory = async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    setLoading(true);

    try {
      const q = query(
        collection(db, "appointments"), 
        where("userId", "==", user.uid)
      );
      
      const snapshot = await getDocs(q);
      
      const list = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((cita) => {
          const s = cita.status ? cita.status.toLowerCase() : "";
          // Solo mostramos lo que ya terminó
          return s === "finalizada" || s === "cancelada";
        });

      setAppointments(list);

    } catch (error) {
      console.error("Error cargando historial:", error);
      setAppointments([]); // En caso de error, aseguramos que sea un array
    } finally {
      setLoading(false);
    }
  };

  return {
    appointments, // Retornamos la lista
    loading,
    saludo
  };
};