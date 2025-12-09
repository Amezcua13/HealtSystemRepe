import { useEffect, useState, useCallback } from "react"; // Agregamos useCallback
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // Importante para recargar al volver
import { auth, db } from "../services/firebaseConfig";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

export const useAppointmentViewModel = () => {
  const [appointments, setAppointments] = useState([]);
  const [saludo, setSaludo] = useState("");
  const [loading, setLoading] = useState(false);

  // Usamos useFocusEffect para que la lista se limpie cada vez que entras a la pantalla
  useFocusEffect(
    useCallback(() => {
      obtenerSaludo();
      cargarCitas();
    }, [])
  );

  const obtenerSaludo = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setSaludo("🌅 Buenos días,");
    else if (hora >= 12 && hora < 19) setSaludo("🌇 Buenas tardes,");
    else setSaludo("🌙 Buenas noches,");
  };

  const cargarCitas = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    
    try {
      const q = query(collection(db, "appointments"), where("userId", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);

      const citas = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        // --- FILTRO CLAVE ---
        // Solo dejamos pasar las citas que NO estén finalizadas NI canceladas.
        .filter((cita) => {
          const s = cita.status ? cita.status.toLowerCase() : "pendiente";
          return s !== "finalizada" && s !== "cancelada";
        });

      setAppointments(citas);
    } catch (error) {
      console.error("Error al cargar citas:", error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarCita = async (id) => {
    // Nota: Para ser consistentes con el sistema profesional,
    // en lugar de 'deleteDoc' (borrar), sugerimos 'cancelar' (updateDoc).
    // Pero si prefieres borrarla definitivamente de la base de datos:
    
    Alert.alert("Cancelar Cita", "¿Seguro que deseas cancelar esta cita?", [
      { text: "No", style: "cancel" },
      {
        text: "Sí, cancelar",
        style: "destructive",
        onPress: async () => {
          try {
            // Opción A: Borrar físico (tu código original)
            // await deleteDoc(doc(db, "appointments", id));
            
            // Opción B (Recomendada): Marcar como cancelada para que vaya al Historial
            await updateDoc(doc(db, "appointments", id), {
                status: "cancelada"
            });

            Alert.alert("Cita Cancelada", "La cita se ha movido a tu historial.");
            cargarCitas(); // Recargamos para que desaparezca de esta lista
          } catch (error) {
            console.error("Error eliminando cita:", error);
            Alert.alert("Error", "No se pudo cancelar la cita.");
          }
        },
      },
    ]);
  };

  return {
    saludo,
    appointments,
    eliminarCita,
    cargarCitas,
    loading
  };
};