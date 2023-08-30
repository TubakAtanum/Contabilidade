import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView } from "react-native";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "@react-navigation/native";
import DataGrid from "./DataGrid";
import FabButton from "./FabButton";
import * as ScreenOrientation from "expo-screen-orientation";

export default function ExtratoScreen() {
  const [csv, setCsv] = useState();
  const fileUri = FileSystem.documentDirectory + "data.csv";

  const [isRotated, setIsRotated] = useState(false);
  const [orientationIsLandscape, setOrientation] = useState(true);

  const toggleOrientation = () => {
    setOrientation(!orientationIsLandscape);
    setIsRotated((prevIsRotated) => !prevIsRotated);
    changeScreenOrientation(orientationIsLandscape);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetch(fileUri)
        .then((result) => result.text())
        .then((resultText) => {
          setCsv(parseCSV(resultText));
        });
    }, [])
  );

  return (
    <View>
      <ScrollView>
        <ScrollView horizontal={true}>
          {csv && <DataGrid csv={csv} />}
        </ScrollView>
      </ScrollView>
      <FabButton
        onPress={toggleOrientation}
        iconName={isRotated ? "rotate-cw" : "rotate-ccw"}
      />
    </View>
  );
}

async function changeScreenOrientation(state) {
  if (state == true) {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
    );
  } else if (state == false) {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT
    );
  }
}
function parseCSV(text) {
  const result = {
    header: [],
    data: [],
  };

  const [header, ...content] = text.split("\n");
  result.header = header.split(";");

  content.forEach((item) => {
    result.data.push(item.split(";"));
  });

  return result;
}
