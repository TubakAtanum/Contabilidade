import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList } from "react-native";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import { getCurrentDate } from "./CreateCSV";

const HomeScreen = ({ navigation }) => {
  const db = SQLite.openDatabase("tabela.db");
  const dbPath = `${FileSystem.documentDirectory}/SQLite/tabela.db`;
  const currentDate = getCurrentDate();

  const createDB = async () => {
    try {
      db.transaction(async (tx) => {
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS tabela (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            Date TEXT,
            Pix REAL DEFAULT '0',
            Dinheiro REAL DEFAULT '0',
            Cartao REAL DEFAULT '0'
          );
        `);
        // Insert initial entry with zeros for each category
        tx.executeSql(`INSERT INTO tabela (Date) VALUES (?)`, [currentDate]);
      });

      console.log("Created");
    } catch (error) {
      console.error("Error creating the CSV table:", error);
    }
  };

  const populateDB = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO tabela (Date, Pix, Dinheiro, Cartao) VALUES (?, ?, ?, ?)`,
        [currentDate, 100, 200, 300],
        (_, result) => {
          console.log(result);
        },
        (_, error) => {
          console.error(error);
        }
      );
    });
  };

  const deleteDB = async () => {
    const fileInfo = await FileSystem.getInfoAsync(dbPath);
    if (fileInfo.exists)
      try {
        FileSystem.deleteAsync(dbPath);
        console.log("Deleted");
      } catch (error) {
        console.log(error);
      }
    else {
      console.log("No file");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ marginTop: 20 }}>
        <Button title="Create" onPress={createDB} />
        <Button title="Populate" onPress={populateDB} />
        <Button title="Delete" onPress={deleteDB} />
      </View>
    </View>
  );
};

export default HomeScreen;
