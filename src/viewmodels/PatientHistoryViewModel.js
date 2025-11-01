import { useEffect, useState } from "react";
import { auth, db } from "../services/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export const usePatientHistoryViewModel = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saludo, setSaludo] = useState("");

  useEffect(() => {
    obtenerSaludo();
    fetchAppointmentHistory();
  }, []);

  const obtenerSaludo = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setSaludo("🌅 Buenos días,");
    else if (hora >= 12 && hora < 19) setSaludo("🌇 Buenas tardes,");
    else setSaludo("🌙 Buenas noches,");
  };

  const fetchAppointmentHistory = async () => {
    if (!auth.currentUser) return;

    try {
      const q = query(
        collection(db, "appointments"),
        where("doctorId", "==", auth.currentUser.uid),
        where("status", "==", "Finalizada")
      );

      const snapshot = await getDocs(q);
      const result = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHistory(result);
    } catch (error) {
      console.error("Error cargando historial:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    history,
    loading,
    saludo,
  };
};
