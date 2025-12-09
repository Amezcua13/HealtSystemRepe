import React, { useRef, useState } from "react";
import { View, StyleSheet, FlatList, Pressable, Animated, RefreshControl } from "react-native";
import { Text, Card, Avatar, Badge } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useDoctorAppointmentsViewModel } from "../viewmodels/DoctorAppointmentsViewModel";

const DoctorAppointmentsView = () => {
  const navigation = useNavigation();
  const scaleValue = useRef(new Animated.Value(1)).current;
  
  // AHORA: Usamos fetchAppointments para el "Pull to Refresh"
  const { appointments, loading, fetchAppointments } = useDoctorAppointmentsViewModel();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
  };

  const handlePressIn = () => {
    Animated.spring(scaleValue, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start();
  };

  const getStatusColor = (status) => {
    const s = status ? status.toLowerCase() : "";
    if (s === "finalizada") return "#4CAF50"; // Verde
    if (s === "cancelada") return "#D32F2F"; // Rojo
    if (s === "confirmada") return "#1976D2"; // Azul
    return "#FFA000"; // Naranja
  };

  return (
    <LinearGradient colors={["#0D47A1", "#1976D2"]} style={styles.container}>
      <View style={styles.header}>
        <Avatar.Icon size={50} icon="doctor" style={styles.avatar} />
        <View>
          <Text style={styles.welcomeText}>Panel Médico</Text>
          <Text style={styles.title}>Agenda del Día</Text>
        </View>
      </View>

      {appointments.length > 0 ? (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          // Agregamos Pull-to-Refresh
          refreshControl={
            <RefreshControl refreshing={refreshing || loading} onRefresh={onRefresh} tintColor="#FFF" />
          }
          renderItem={({ item }) => {
            const isFinalizada = item.status?.toLowerCase() === "finalizada";
            
            return (
              <Card style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                    <Avatar.Text 
                      size={40} 
                      label={item.patient ? item.patient.substring(0, 2).toUpperCase() : "PA"} 
                      style={{backgroundColor: '#1E88E5'}} 
                    />
                    <View style={{marginLeft: 10, flex: 1}}>
                      <Text style={styles.patientName} numberOfLines={1}>{item.patient || "Paciente"}</Text>
                      <Text style={styles.reasonText} numberOfLines={1}>{item.reason || "Consulta General"}</Text>
                    </View>
                  </View>
                  <Badge style={{backgroundColor: getStatusColor(item.status), fontWeight: 'bold'}}>
                    {item.status}
                  </Badge>
                </View>

                <Card.Content style={styles.cardContent}>
                  <View style={styles.infoRow}>
                    <Text style={styles.iconText}>📅 {item.date}</Text>
                    <Text style={styles.iconText}>⏰ {item.time}</Text>
                  </View>
                </Card.Content>

                <Card.Actions style={{ justifyContent: "center", paddingTop: 0 }}>
                  <Pressable
                    // Al presionar, vamos al detalle pasando TODA la cita (item)
                    onPress={() => navigation.navigate("AppointmentDetails", { appointment: item })}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={({ pressed }) => [
                      styles.actionButton, 
                      isFinalizada ? styles.btnVer : styles.btnAtender,
                      { transform: [{ scale: pressed ? 0.98 : 1 }] }
                    ]}
                  >
                    <Text style={styles.actionButtonText}>
                      {isFinalizada ? "👁️ Ver Historial" : "🩺 Atender Consulta"}
                    </Text>
                  </Pressable>
                </Card.Actions>
              </Card>
            );
          }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Avatar.Icon icon="calendar-blank" size={80} style={{backgroundColor: 'rgba(255,255,255,0.2)'}} />
          <Text style={styles.noAppointments}>No tienes citas asignadas.</Text>
          <Text style={{color: '#EEE', marginTop: 10}}>Arrastra hacia abajo para actualizar</Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
  avatar: { backgroundColor: "#FFF", marginRight: 15 },
  welcomeText: { color: "#BBDEFB", fontSize: 14 },
  title: { fontSize: 24, fontWeight: "bold", color: "#FFF" },
  
  card: { backgroundColor: "#FFF", borderRadius: 12, marginBottom: 15, elevation: 3, padding: 5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingTop: 15 },
  patientName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  reasonText: { fontSize: 13, color: "#666" },
  
  cardContent: { paddingVertical: 15 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 5 },
  iconText: { fontSize: 15, color: "#444", fontWeight: "500" },

  actionButton: { width: '100%', paddingVertical: 12, borderRadius: 8, alignItems: "center", marginBottom: 5 },
  btnAtender: { backgroundColor: "#1E88E5" }, 
  btnVer: { backgroundColor: "#757575" },
  
  actionButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 14, textTransform: 'uppercase' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noAppointments: { marginTop: 20, color: "#FFF", fontSize: 18, opacity: 0.9 },
});

export default DoctorAppointmentsView;