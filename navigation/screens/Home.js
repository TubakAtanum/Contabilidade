import * as React from "react";
import { View, Text, Button } from "react-native";
import * as XLSX from "xlsx";
import { read, write } from "xlsx";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Criar Tabela" color="" onPress={criarTabela} />
      <Button title="Abrir Tabela" color="" onPress={readWorkbook} />
    </View>
  );
}

async function criarTabela() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    ["Data", "Dinheiro", "Cartão", "Pix"],
    ["dia"],
    ["dia"],
    ["dia"],
  ]);

  XLSX.utils.book_append_sheet(wb, ws, "teste.xlsx");
  const b64 = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
  /* b64 is a Base64 string */
  await FileSystem.writeAsStringAsync(
    FileSystem.documentDirectory + "teste.xlsx",
    b64,
    { encoding: FileSystem.EncodingType.Base64 }
  );
}

async function readWorkbook() {
  FileSystem.getContentUriAsync(FileSystem.documentDirectory + "teste.xlsx").then((cUri) => {
    IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
      data: cUri,
      flags: 1,
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  });
}
