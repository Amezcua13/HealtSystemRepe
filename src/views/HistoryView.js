import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Animated,
} from "react-native";
import { Text, Card, Avatar, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useHistoryViewModel } from "../viewmodels/HistoryViewModel";

const HistoryView = () => {
  // Obtenemos los datos del ViewModel corregido
  const { appointments, saludo } = useHistoryViewModel();
  const navigation = useNavigation();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "finalizada": return "#2E7D32"; // Verde
      case "cancelada": return "#D32F2F"; // Rojo
      default: return "#757575"; // Gris
    }
  };

  const getStatusIcon = (status) => {
    return status?.toLowerCase() === "cancelada" ? "cancel" : "check-circle";
  };

  return (
    <LinearGradient colors={["#0D47A1", "#1976D2"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.saludo}>{saludo}</Text>
        <Text style={styles.titulo}>📜 Historial Médico</Text>
      </View>

      {/* Validamos que appointments exista antes de usarlo */}
      {appointments && appointments.length > 0 ? (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => {
            const isCancelada = item.status?.toLowerCase() === "cancelada";
            const color = getStatusColor(item.status);

            return (
              <Card style={[styles.card, isCancelada && { opacity: 0.7 }]}>
                <Card.Title
                  title={`Dr. ${item.doctor || "No asignado"}`}
                  subtitle={item.date}
                  left={(props) => (
                    <Avatar.Icon
                      {...props}
                      icon={getStatusIcon(item.status)}
                      style={{ backgroundColor: color }}
                    />
                  )}
                />
                <Card.Content>
                  <Text style={[styles.statusText, { color: color }]}>
                    Estado: {item.status.toUpperCase()}
                  </Text>

                  {!isCancelada && (
                    <>
                      <Divider style={{ marginVertical: 10 }} />
                      <Text style={styles.diagnosisLabel}>📝 Diagnóstico:</Text>
                      <Text style={styles.diagnosisText}>
                        {item.diagnosis || item.notes || "Sin detalles registrados."}
                      </Text>
                    </>
                  )}
                </Card.Content>
              </Card>
            );
          }}
        />
      ) : (
        <View style={styles.emptyContainer}>
            <Avatar.Icon icon="history" size={80} style={{backgroundColor: 'rgba(255,255,255,0.2)'}} />
            <Text style={styles.noAppointments}>No tienes historial disponible.</Text>
        </View>
      )}

      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Pressable
          onPress={() => navigation.navigate("Home")}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>⬅️ Volver al Inicio</Text>
        </Pressable>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  header: { alignItems: "center", marginBottom: 20 },
  saludo: { fontSize: 20, color: "#FFFFFF" },
  titulo: { fontSize: 26, fontWeight: "bold", color: "#FFFFFF", marginTop: 5 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 15, marginBottom: 12, elevation: 3 },
  statusText: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  diagnosisLabel: { fontWeight: "bold", color: "#1E88E5", fontSize: 14, marginBottom: 2 },
  diagnosisText: { fontSize: 14, color: "#444", fontStyle: "italic", lineHeight: 20 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noAppointments: { textAlign: "center", color: "#FFFFFF", fontSize: 16, marginTop: 20 },
  backButton: { backgroundColor: "#FFA500", paddingVertical: 14, borderRadius: 30, alignItems: "center", marginTop: 10, elevation: 5 },
  backButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
});

export default HistoryView;