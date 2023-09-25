import * as React from "react";
import { Tabs } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function TabRoutesLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({size, color}) => (
            <Ionicons name="home" size={size} color={color}/>
          )
        }}
      />
      <Tabs.Screen
        name="Edit"
        options={{
          title: "Editar",
          tabBarIcon: ({size, color}) => (
            <Ionicons name="create" size={size} color={color}/>
          )
        }}
      />
      <Tabs.Screen
        name="Table"
        options={{
          title: "Tabela",
          tabBarIcon: ({size, color}) => (
            <Ionicons name="grid" size={size} color={color}/>
          )
        }}
      />
    </Tabs>
  );
}
