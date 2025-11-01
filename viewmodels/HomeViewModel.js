import { useEffect, useState } from "react";
import { auth, db } from "../services/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

export const useHomeViewModel = () => {
  const [user, setUser] = useState(null);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [saludo, setSaludo] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    if (auth.currentUser) setUser(auth.currentUser);
    fetchNextAppointment();
    obtenerSaludo();
  }, []);

  const obtenerSaludo = () => {
    const horaActual = new Date().getHours();
    if (horaActual >= 5 && horaActual < 12) setSaludo("🌅 Buenos días,");
    else if (horaActual >= 12 && horaActual < 19) setSaludo("🌇 Buenas tardes,");
    else setSaludo("🌙 Buenas noches,");
  };

  const fetchNextAppointment = async () => {
    if (!auth.currentUser) return;
    try {
      const q = query(collection(db, "appointments"), where("userId", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const appointments = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setNextAppointment(appointments[0]);
      }
    } catch (error) {
      console.error("Error obteniendo citas:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Seguro que quieres salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          await signOut(auth);
          navigation.replace("Login");
        },
      },
    ]);
  };

  return {
    user,
    saludo,
    nextAppointment,
    handleLogout,
    navigation,
  };
};
