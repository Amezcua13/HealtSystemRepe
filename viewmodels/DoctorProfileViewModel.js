import { useEffect, useState } from "react";
import { auth, db } from "../services/firebaseConfig";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import {
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Alert } from "react-native";

const storage = getStorage();

export const useDoctorProfileViewModel = () => {
  const [appointments, setAppointments] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    if (auth.currentUser) {
      const { displayName, email, photoURL } = auth.currentUser;
      setNombre(displayName || "Doctor");
      setDisplayName(displayName || "");
      setEmail(email || "");
      setPhotoURL(photoURL);
    }

    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, "appointments"),
      where("doctor", "==", auth.currentUser.displayName)
    );
    const querySnapshot = await getDocs(q);
    const citas = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAppointments(citas);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace("Login");
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, blob);

      const url = await getDownloadURL(storageRef);
      setPhotoURL(url);

      await updateProfile(auth.currentUser, { photoURL: url });
      await updateDoc(doc(db, "users", auth.currentUser.uid), { photoURL: url });

      Alert.alert("✅ Foto de perfil actualizada");
    } catch (error) {
      Alert.alert("Error", "No se pudo subir la imagen");
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (!displayName.trim()) {
        Alert.alert("Nombre vacío", "Por favor ingresa tu nombre");
        return;
      }

      await updateProfile(auth.currentUser, { displayName });
      await updateDoc(doc(db, "users", auth.currentUser.uid), { name: displayName });

      setNombre(displayName);
      Alert.alert("✅ Perfil actualizado", "Nombre guardado correctamente");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleResetPassword = async () => {
    if (!auth.currentUser?.email) return;

    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      Alert.alert("📧 Revisa tu correo", "Hemos enviado un enlace para cambiar tu contraseña");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return {
    appointments,
    nombre,
    email,
    photoURL,
    displayName,
    setDisplayName,
    handleLogout,
    handlePickImage,
    handleSaveProfile,
    handleResetPassword,
  };
};
