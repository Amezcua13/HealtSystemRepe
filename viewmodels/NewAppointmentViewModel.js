import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { db, auth } from "../services/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export const useNewAppointmentViewModel = (navigation) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctor, setDoctor] = useState("");
  const [doctorsList, setDoctorsList] = useState([]);
  const [status, setStatus] = useState("pendiente");
  const [saludo, setSaludo] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    obtenerSaludo();
    cargarDoctoresDisponibles();
  }, []);

  const obtenerSaludo = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setSaludo("🌅 Buenos días,");
    else if (hora >= 12 && hora < 19) setSaludo("🌇 Buenas tardes,");
    else setSaludo("🌙 Buenas noches,");
  };

  const cargarDoctoresDisponibles = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "doctor"));
      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map((doc) => ({
        label: doc.data().name,
        value: doc.data().name,
      }));
      setDoctorsList(lista);
    } catch (error) {
      console.error("Error cargando doctores:", error);
    }
  };

  const getAvailableTimes = async (fechaSeleccionada, doctorSeleccionado) => {
    const HORAS = generarRangoHoras("07:00", "18:00", 30); // cada 30 minutos
    const ocupadas = [];

    try {
      const q = query(
        collection(db, "appointments"),
        where("doctor", "==", doctorSeleccionado),
        where("date", "==", fechaSeleccionada)
      );
      const snapshot = await getDocs(q);
      snapshot.docs.forEach((doc) => {
        ocupadas.push(doc.data().time);
      });

      const disponibles = HORAS.filter((h) => !ocupadas.includes(h));
      setAvailableTimes(disponibles);
    } catch (error) {
      console.error("Error obteniendo horarios:", error);
    }
  };

  const generarRangoHoras = (inicio, fin, intervalo) => {
    const pad = (n) => (n < 10 ? "0" + n : n);
    const result = [];
    const [h1, m1] = inicio.split(":").map(Number);
    const [h2, m2] = fin.split(":").map(Number);
    let current = new Date();
    current.setHours(h1, m1, 0);
    const end = new Date();
    end.setHours(h2, m2, 0);

    while (current <= end) {
      const hh = pad(current.getHours());
      const mm = pad(current.getMinutes());
      result.push(`${hh}:${mm}`);
      current.setMinutes(current.getMinutes() + intervalo);
    }

    return result;
  };

  const handleScheduleAppointment = async () => {
    if (!date || !time || !doctor) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      await addDoc(collection(db, "appointments"), {
        userId: auth.currentUser.uid,
        patient: auth.currentUser.displayName || "Paciente",
        date,
        time,
        doctor,
        status,
      });

      Alert.alert("✅ Cita agendada", "Tu cita ha sido registrada correctamente.");
      navigation.navigate("Appointments");
    } catch (error) {
      Alert.alert("Error", "No se pudo agendar la cita.");
    }
  };

  return {
    date,
    time,
    doctor,
    doctorsList,
    availableTimes,
    status,
    saludo,
    setDate,
    setTime,
    setDoctor,
    setStatus,
    getAvailableTimes,
    handleScheduleAppointment,
  };
};
