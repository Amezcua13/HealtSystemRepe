import { useState, useEffect } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../services/firebaseConfig";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const storage = getStorage();

export const useProfileViewModel = (navigation) => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saludo, setSaludo] = useState("");

  useEffect(() => {
    obtenerSaludo();
    cargarUsuario();
  }, []);

  const obtenerSaludo = () => {
    const horaActual = new Date().getHours();
    if (horaActual >= 5 && horaActual < 12) setSaludo("🌅 Buenos días,");
    else if (horaActual >= 12 && horaActual < 19) setSaludo("🌇 Buenas tardes,");
    else setSaludo("🌙 Buenas noches,");
  };

  const cargarUsuario = async () => {
    if (auth.currentUser) {
      setUser(auth.currentUser);
      setDisplayName(auth.currentUser.displayName || "Usuario");
      setPhotoURL(auth.currentUser.photoURL);

      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        setDisplayName(userDoc.data().name || "Usuario");
      }
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    setLoading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      setPhotoURL(downloadURL);

      await updateProfile(auth.currentUser, { photoURL: downloadURL });
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        photoURL: downloadURL,
      });

      Alert.alert("Perfil Actualizado", "Tu foto de perfil ha sido actualizada.");
    } catch (error) {
      Alert.alert("Error", "No se pudo subir la imagen.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!displayName) {
      Alert.alert("Error", "El nombre no puede estar vacío.");
      return;
    }

    setLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        name: displayName,
      });

      Alert.alert("Perfil Actualizado", "Tu nombre ha sido actualizado correctamente.");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    if (!user?.email) return;
    sendPasswordResetEmail(auth, user.email)
      .then(() => {
        Alert.alert("Correo Enviado", "Revisa tu bandeja de entrada.");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  return {
    user,
    saludo,
    displayName,
    setDisplayName,
    photoURL,
    loading,
    handlePickImage,
    handleUpdateProfile,
    handleResetPassword,
    navigation,
  };
};
