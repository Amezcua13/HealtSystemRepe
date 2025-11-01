import { useState, useEffect } from "react";
import { auth, db } from "../services/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export const useRegisterViewModel = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient"); // Opción para elegir rol en el futuro
  const [saludo, setSaludo] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setSaludo("🌅 Buenos días,");
    else if (hora >= 12 && hora < 19) setSaludo("🌇 Buenas tardes,");
    else setSaludo("🌙 Buenas noches,");
  }, []);

  const validarEmail = (correo) => /\S+@\S+\.\S+/.test(correo);

  const handleRegister = async () => {
    if (!nombre || !email || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (!validarEmail(email)) {
      alert("El correo no tiene un formato válido.");
      return;
    }

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      const credenciales = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(credenciales.user, {
        displayName: nombre,
      });

      await setDoc(doc(db, "users", credenciales.user.uid), {
        name: nombre,
        email,
        role,
      });

      alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");

      // Limpiar campos
      setNombre("");
      setEmail("");
      setPassword("");
      setRole("patient");

      navigation.navigate("Login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Este correo ya está registrado.");
      } else if (error.code === "auth/invalid-email") {
        alert("Correo inválido.");
      } else {
        alert("Error al registrar: " + error.message);
      }
    }
  };

  return {
    nombre,
    setNombre,
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    saludo,
    handleRegister,
    navigation,
  };
};
