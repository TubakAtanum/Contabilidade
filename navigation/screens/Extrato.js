import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import * as FileSystem from "expo-file-system";
import DataGrid from "./DataGrid";

export default function ExtratoScreen() {
  const [csv, setCsv] = useState();
  const fileUri = FileSystem.documentDirectory + "data.csv";

  const parseCSV = (text) => {
    const result = {
      header: [],
      data: [],
    };

    const [header, ...content] = text.split("\n");
    result.header = header.split(",");

    content.forEach((item) => {
      result.data.push(item.split(","));
    });

    return result;
  };

  useEffect(() => {
    fetch(fileUri)
      .then((result) => result.text())
      .then((resultText) => {
        setCsv(parseCSV(resultText));
      });
  },[]);

  return <ScrollView horizontal ={true}>{csv && <DataGrid csv={csv} />}</ScrollView>;
}
