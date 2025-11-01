import { useState, useEffect } from "react";
import { auth, db } from "../services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const useDoctorDashboardViewModel = (navigation) => {
  const [nombreUsuario, setNombreUsuario] = useState("Usuario");
  const [rolUsuario, setRolUsuario] = useState("paciente");

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setNombreUsuario(data.name || "Usuario");
          setRolUsuario(data.role || "paciente");
        }
      }
    };

    obtenerDatosUsuario();
  }, []);

  const navegarSegunRol = () => {
    if (rolUsuario === "doctor") {
      navigation.navigate("Appointments");
    } else {
      navigation.navigate("Appointments");
    }
  };

  const navegarAAgendar = () => navigation.navigate("NewAppointment");
  const navegarAMiPerfil = () => navigation.navigate("Profile");

  return {
    nombreUsuario,
    rolUsuario,
    navegarSegunRol,
    navegarAAgendar,
    navegarAMiPerfil,
  };
};

export default useDoctorDashboardViewModel;
