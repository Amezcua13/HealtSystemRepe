import React, { useState, useEffect } from "react";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { View, ActivityIndicator } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./src/services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/navigation/StackNavigator";
import DoctorNavigator from "./src/navigation/DoctorNavigator";

const theme = {
  ...DefaultTheme,
  colors: {
    primary: "#1E88E5",
    accent: "#1565C0",
    background: "#F5F5F5",
    text: "#263238",
    card: "#FFFFFF",
    surface: "#FFFFFF",
  },
};

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // Se inicia en null hasta obtener el dato real
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role); // Se guarda el rol real del usuario
          } else {
            setRole("patient"); // Si no hay rol definido, por defecto es paciente
          }
        } catch (error) {
          console.error("❌ Error obteniendo el rol:", error);
          setRole("patient"); // Si hay error, se asume paciente
        }
      } else {
        setRole(null); // Si no hay usuario autenticado, se resetea el rol
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F5F5" }}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        {user ? (role === "doctor" ? <DoctorNavigator /> : <StackNavigator />) : <StackNavigator />}
      </NavigationContainer>
    </PaperProvider>
  );
}
