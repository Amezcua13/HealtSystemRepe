import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { auth, db } from "../services/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";

export const useHomeViewModel = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [saludo, setSaludo] = useState("");
  const [nextAppointment, setNextAppointment] = useState(null);
  const [loading, setLoading] = useState(false);

  // Se ejecuta cada vez que entras a la pantalla (para actualizar citas y saludo)
  useFocusEffect(
    useCallback(() => {
      loadUserData();
      obtenerSaludo();
      fetchNextAppointment();
    }, [])
  );

  const loadUserData = () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
  };

  const obtenerSaludo = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setSaludo("🌅 Buenos días,");
    else if (hora >= 12 && hora < 19) setSaludo("🌇 Buenas tardes,");
    else setSaludo("🌙 Buenas noches,");
  };

  const fetchNextAppointment = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    setLoading(true);

    try {
      const q = query(
        collection(db, "appointments"), 
        where("userId", "==", currentUser.uid)
      );
      
      const snapshot = await getDocs(q);
      
      const activeAppointments = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((cita) => {
          const s = cita.status ? cita.status.toLowerCase() : "pendiente";
          // Filtramos: Ni finalizada, Ni cancelada
          return s !== "finalizada" && s !== "cancelada";
        });

      // Lógica simple: Tomamos la primera activa como "Próxima cita"
      // (Idealmente aquí ordenarías por fecha, pero esto funciona para empezar)
      if (activeAppointments.length > 0) {
        // Ordenamos básico por fecha (YYYY-MM-DD)
        activeAppointments.sort((a, b) => a.date.localeCompare(b.date));
        setNextAppointment(activeAppointments[0]);
      } else {
        setNextAppointment(null);
      }

    } catch (error) {
      console.error("Error buscando próxima cita:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que deseas salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            // Reiniciamos la navegación al Login
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          } catch (error) {
            Alert.alert("Error", "No se pudo cerrar sesión.");
          }
        },
      },
    ]);
  };

  return {
    user,             // Regresamos el objeto User (para el nombre y foto)
    saludo,           // Regresamos el saludo calculado
    nextAppointment,  // Regresamos la próxima cita real
    handleLogout,     // Función de logout
    loading
  };
};