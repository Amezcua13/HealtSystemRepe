import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginView from "../views/LoginView";
import RegisterView from "../views/RegisterView";
import HomeView from "../views/HomeView";
import ProfileView from "../views/ProfileView";
import AppointmentView from "../views/AppointmentView";
import EditAppointmentView from "../views/EditAppointmentView";
import NewAppointmentView from "../views/NewAppointmentView";
import HistoryView from "../views/HistoryView";

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginView} />
      <Stack.Screen name="Register" component={RegisterView} />
      <Stack.Screen name="Home" component={HomeView} />
      <Stack.Screen name="Profile" component={ProfileView} />
      <Stack.Screen name="Appointments" component={AppointmentView} />
      <Stack.Screen name="EditAppointment" component={EditAppointmentView} />
      <Stack.Screen name="NewAppointment" component={NewAppointmentView} />
      <Stack.Screen name="History" component={HistoryView} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
