import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DoctorDashboardView from "../views/DoctorDashboardView";
import DoctorAppointmentsView from "../views/DoctorAppointmentsView";
import AppointmentDetailsView from "../views/AppointmentDetailsView";
import PatientHistoryView from "../views/PatientHistoryView";
import DoctorProfileView from "../views/DoctorProfileView";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

//  Stack anidado para citas
const AppointmentsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DoctorAppointments" component={DoctorAppointmentsView} />
    <Stack.Screen name="AppointmentDetails" component={AppointmentDetailsView} />
  </Stack.Navigator>
);

const DoctorNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1E88E5",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: { backgroundColor: "#F5F5F5", paddingBottom: 5, height: 60 },
      }}
    >
      {/* Inicio */}
      <Tab.Screen
        name="Dashboard"
        component={DoctorDashboardView}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-text" color={color} size={size} />
          ),
        }}
      />

      {/* Citas */}
      <Tab.Screen
        name="Appointments"
        component={AppointmentsStack}
        options={{
          tabBarLabel: "Citas",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-check" color={color} size={size} />
          ),
        }}
      />

      {/* Historial */}
      <Tab.Screen
        name="PatientHistory"
        component={PatientHistoryView}
        options={{
          tabBarLabel: "Historial",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="history" color={color} size={size} />
          ),
        }}
      />

      {/* Perfil */}
      <Tab.Screen
        name="Profile"
        component={DoctorProfileView}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default DoctorNavigator;
