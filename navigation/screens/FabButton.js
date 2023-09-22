import { StyleSheet, View, TouchableOpacity } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";

export default FabButton = ({ onPress, iconName }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Feather name={iconName} size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: 'absolute',
    bottom: 80,
    right: 50,
  },
  button: {
    backgroundColor: "rgb(169, 208, 142)",
    width: 60,
    height: 60,
    position: 'absolute',
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
