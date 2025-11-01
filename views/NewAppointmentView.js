import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Animated, ScrollView, SafeAreaView } from "react-native";
import { Text, Avatar, Button, ProgressBar, IconButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import { useNewAppointmentViewModel } from "../viewmodels/NewAppointmentViewModel";
import { auth } from "../services/firebaseConfig";

const NewAppointmentView = () => {
  const navigation = useNavigation();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const {
    date,
    setDate,
    time,
    setTime,
    doctor,
    setDoctor,
    doctorsList,
    availableTimes,
    getAvailableTimes,
    handleScheduleAppointment,
  } = useNewAppointmentViewModel(navigation);

  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [saludo, setSaludo] = useState("");

  useEffect(() => {
    const hora = new Date().getHours();
    const usuario = auth.currentUser?.displayName || "Paciente";
    if (hora >= 5 && hora < 12) setSaludo(`🌅 Buenos días, ${usuario}`);
    else if (hora >= 12 && hora < 19) setSaludo(`🌇 Buenas tardes, ${usuario}`);
    else setSaludo(`🌙 Buenas noches, ${usuario}`);
  }, []);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate) => {
    const formatted = dayjs(selectedDate).format("DD/MM/YY");
    setDate(formatted);
    if (doctor) getAvailableTimes(formatted, doctor);
    hideDatePicker();
  };

  const handleDoctorChange = (value) => {
    setDoctor(value);
    if (date) getAvailableTimes(date, value);
  };

  const nextStep = () => step < totalSteps && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LinearGradient colors={["#0D47A1", "#1976D2"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Avatar.Icon size={80} icon="calendar-plus" style={styles.icon} color="#FFF" />
          <Text style={styles.saludo}>{saludo}</Text>
          <Text style={styles.title}>Agendar nueva cita</Text>

          <ProgressBar progress={step / totalSteps} color="#FFA500" style={{ width: "100%", marginBottom: 15 }} />

          {step === 1 && (
            <>
              <Text style={styles.label}>Selecciona doctor</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={doctor} onValueChange={handleDoctorChange} style={styles.picker}>
                  <Picker.Item label="Selecciona un doctor" value="" />
                  {doctorsList.map((doc) => (
                    <Picker.Item key={doc.value} label={doc.label} value={doc.value} />
                  ))}
                </Picker>
              </View>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.label}>Selecciona fecha</Text>
              <Pressable onPress={showDatePicker} style={styles.dateCard}>
                <IconButton icon="calendar-month" iconColor="#1976D2" size={20} />
                <Text style={styles.dateText}>{date ? date : "Elegir fecha"}</Text>
              </Pressable>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                minimumDate={new Date()}
              />
            </>
          )}

          {step === 3 && doctor && date && (
            <>
              <Text style={styles.label}>Horarios disponibles:</Text>
              <View style={styles.timesGrid}>
                {availableTimes.length > 0 ? (
                  availableTimes.map((hora) => (
                    <Pressable
                      key={hora}
                      onPress={() => setTime(hora)}
                      style={[styles.timeCard, time === hora && styles.timeCardSelected]}
                    >
                      <Text style={styles.timeText}>{hora}</Text>
                    </Pressable>
                  ))
                ) : (
                  <Text style={styles.noTimes}>No hay horarios disponibles</Text>
                )}
              </View>
            </>
          )}

          <View style={styles.stepNavContainer}>
            {step > 1 && (
              <Button mode="contained" buttonColor="#FFA500" textColor="#FFF" onPress={prevStep} style={styles.navButton}>
                Atrás
              </Button>
            )}
            {step < totalSteps && (
              <Button mode="contained" buttonColor="#FFA500" textColor="#FFF" onPress={nextStep} style={styles.navButton}>
                Siguiente
              </Button>
            )}
          </View>

          {step === totalSteps && (
            <Pressable
              onPress={handleScheduleAppointment}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={({ pressed }) => [
                styles.submitButton,
                { transform: [{ scale: pressed ? 0.95 : 1 }] },
              ]}
            >
              <Text style={styles.submitText}>Agendar cita</Text>
            </Pressable>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    padding: 20,
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 40,
  },
  icon: {
    backgroundColor: "#FFA500",
    marginBottom: 10,
  },
  saludo: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    color: "#FFA500",
    marginBottom: 15,
    textAlign: "center",
  },
  pickerContainer: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 6,
    marginBottom: 15,
  },
  picker: {
    width: "100%",
  },
  label: {
    color: "#FFF",
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  dateCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  timesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  timeCard: {
    padding: 10,
    margin: 6,
    backgroundColor: "#FFF",
    borderRadius: 8,
  },
  timeCardSelected: {
    backgroundColor: "#FFA500",
  },
  timeText: {
    fontWeight: "bold",
    color: "#000",
  },
  noTimes: {
    color: "#FFF",
    fontStyle: "italic",
    marginVertical: 10,
  },
  stepNavContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 50,
  },
  submitButton: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  submitText: {
    fontWeight: "bold",
    color: "#1976D2",
    fontSize: 16,
  },
});

export default NewAppointmentView;
