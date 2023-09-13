import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";

export default function ExtratoScreen() {
  const [headerData, setHeaderData] = useState([]);
  const [data, setData] = useState([]);
  const db = SQLite.openDatabase("tabela.db");

  const getTableHeaders = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM tabela",
          [],
          (_, result) => {
            const rows = result.rows;
            const columnNames = Object.keys(rows.item(0)).slice(1);
            const tableData = [];

            for (let i = 0; i < rows.length; i++) {
              const rowData = [];
              for (let j = 0; j < columnNames.length; j++) {
                rowData.push(rows.item(i)[columnNames[j]]);
              }
              tableData.push(rowData);
            }
            resolve({ columnNames, tableData });
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      getTableHeaders()
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
    <View>
      <View style={styles.headerRow}>
        {headerData.map((header, index) => (
          <Text key={index} style={styles.headerCell}>
            {header}
          </Text>
        ))}
      </View>

      {data.map((rowData, rowIndex) => (
        <View key={rowIndex} style={styles.dataRow}>
          {rowData.map((cellData, cellIndex) => (
            <Text key={cellIndex} style={styles.dataCell}>
              {cellData}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    backgroundColor: "lightgray",
  },
  headerCell: {
    flex: 1,
    padding: 10,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "gray",
  },
  dataRow: {
    flexDirection: "row",
  },
  dataCell: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
  },
});

//<Text>{`${item.Date} - Pix: ${item.Pix}, Dinheiro: ${item.Dinheiro}, Cartão: ${item.Cartao}`}</Text>
