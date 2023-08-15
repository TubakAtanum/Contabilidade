import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";

const DataGrid = ({ csv }) => {
  if (!csv) {
    return null;
  }

  const [orientationIsLandscape,setOrientation]= useState(true)

  async function changeScreenOrientation(){

    if(orientationIsLandscape==true){
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    }
    else if(orientationIsLandscape==false){
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
    }
  }
  const toggleOrientation=()=>{
    setOrientation(!orientationIsLandscape)
    changeScreenOrientation()
  }
  
  const dateWidth = csv.header
    .slice(0, 1)
    .reduce((acc, cur) => acc + cur.length * 25.5, 0);

  let longest = csv.data.reduce((a, b) => (a.length > b.length ? a : b)).length * 10;

  return (
    <ScrollView key="table">
      <View key="header" style={{ flexDirection: "row" }}>
        {csv.header.slice(0, 1).map((dateName) => (
          <View
            key={dateName}
            style={{
              backgroundColor: "rgb(169, 208, 142)",
              borderWidth: 1,
              borderColor: "black",
              width: dateWidth,
            }}
          >
            <Text style={{ color: "black", textAlign: "center" }}>
              {dateName}
            </Text>
          </View>
        ))}
        {csv.header.slice(1).map((headerName) => (
          <View
            style={{
              backgroundColor: "rgb(169, 208, 142)",
              borderWidth: 1,
              borderColor: "black",
              width: longest,
            }}
            key={headerName}
          >
            <Text style={{ color: "black", textAlign: "center" }}>
              {headerName}
            </Text>
          </View>
        ))}
      </View>
      <View key="content" style={{ flexDirection: "column" }}>
        {csv.data.map((row, rowIndex) => (
          <View style={{ flexDirection: "row" }} key={`row-${rowIndex}`}>
            {row.slice(0, 1).map((dateName) => (
              <View
                key={dateName}
                style={{
                  borderWidth: 1,
                  borderColor: "black",
                  paddingHorizontal: "1%",
                }}
              >
                <Text style={{ textAlign: "center" }}>{dateName}</Text>
              </View>
            ))}
            {row.slice(1).map((column, columnIndex) => (
              <View
                key={columnIndex}
                style={{
                  borderWidth: 1,
                  borderColor: "black",
                  paddingHorizontal: "1%",
                  width: longest,
                }}
              >
                <Text style={{ textAlign: "center" }}>{column}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
      <Button title='change' onPress={toggleOrientation}></Button>
    </ScrollView>
  );
};

export default DataGrid;
