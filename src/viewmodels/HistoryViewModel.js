// viewmodels/HistoryViewModel.js
import { useEffect, useState } from "react";
import { auth, db } from "../services/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export const useHistoryViewModel = () => {
  const [appointments, setAppointments] = useState([]);
  const [saludo, setSaludo] = useState("");

  useEffect(() => {
    obtenerSaludo();
    fetchPastAppointments();
  }, []);

  // 🕐 Genera saludo basado en la hora actual
  const obtenerSaludo = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setSaludo("🌅 Buenos días,");
    else if (hora >= 12 && hora < 19) setSaludo("🌇 Buenas tardes,");
    else setSaludo("🌙 Buenas noches,");
  };

  // 📅 Consulta las citas anteriores del usuario autenticado
  const fetchPastAppointments = async () => {
    if (!auth.currentUser) return;

    try {
      const q = query(
        collection(db, "appointments"),
        where("userId", "==", auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);

      const citas = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Solo citas anteriores a hoy
      const hoy = new Date();
      const citasPasadas = citas.filter((cita) => {
        const [dd, mm, aa] = cita.date.split("/");
        const fechaCita = new Date(`20${aa}`, mm - 1, dd);
        return fechaCita < hoy;
      });

      setAppointments(citasPasadas);
    } catch (error) {
      console.error("Error cargando historial:", error);
    }
  };

  return { appointments, saludo };
};
