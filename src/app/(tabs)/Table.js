import React, { useState, useCallback } from "react";
import { View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { db, tableName, getTableHeaders } from "../../utils/SQLite";
import { ScrollView } from "react-native-gesture-handler";
import FabButton from "../../components/FabButton";
import * as ScreenOrientation from "expo-screen-orientation";
import DataGrid from "../../components/DataGrid";

export default function Table() {
  const [headerData, setHeaderData] = useState([]);
  const [data, setData] = useState([]);
  const [isRotated, setIsRotated] = useState(false);
  const [currentOrientation, setOrientation] = useState(true);

  const toggleOrientation = () => {
    setOrientation(!currentOrientation);
    setIsRotated((prevIsRotated) => !prevIsRotated);
    changeScreenOrientation(currentOrientation);
  };

  useFocusEffect(
    React.useCallback(() => {
      getTableHeaders(db, tableName)
        .then(({ columnNames, tableData }) => {
          setHeaderData(columnNames);
          setData(tableData);
        })
        .catch((error) => {
          console.error(error);
        });
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView horizontal={true}>
        <ScrollView>
          <DataGrid header={headerData} body={data} />
        </ScrollView>
      </ScrollView>
      <FabButton
        onPress={() => toggleOrientation()}
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
