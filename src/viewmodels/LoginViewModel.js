import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../services/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export const useLoginViewModel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [saludo, setSaludo] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const horaActual = new Date().getHours();
    let nuevoSaludo = "";

    if (horaActual >= 5 && horaActual < 12) nuevoSaludo = "🌅 Buenos días,";
    else if (horaActual >= 12 && horaActual < 19) nuevoSaludo = "🌇 Buenas tardes,";
    else nuevoSaludo = "🌙 Buenas noches,";

    setSaludo(nuevoSaludo);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace("Home");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    saludo,
    handleLogin,
    navigation,
  };
};
