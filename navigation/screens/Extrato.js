import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { db, tableName } from "../sqlite/utils";
import { ScrollView } from "react-native-gesture-handler";
import FabButton from "./FabButton";

export default function ExtratoScreen() {
  const [headerData, setHeaderData] = useState([]);
  const [data, setData] = useState([]);

  const getTableHeaders = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM ${tableName}`,
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
    <ScrollView horizontal={true}>
      <ScrollView>
        <View key="table">
          <View key="headers" style={{ flexDirection: "row" }}>
            {headerData.slice(0, 1).map((date, index) => (
              <View key={date} style={styles.monthHeader}>
                <Text
                  key={index}
                  style={{ color: "black", textAlign: "center" }}
                >
                  {date}
                </Text>
              </View>
            ))}
            {headerData.slice(1).map((headers, index) => (
              <View key={headers} style={styles.catHeader}>
                <Text
                  key={index}
                  style={{ color: "black", textAlign: "center" }}
                >
                  {headers}
                </Text>
              </View>
            ))}
          </View>

          <View key="body" style={{ flexDirection: "column" }}>
            {data.map((row, rowIndex) => (
              <View
                key={`row${rowIndex}`}
                style={[
                  { flexDirection: "row" },
                  rowIndex % 2 === 0 ? {} : styles.oddRow,
                ]}
              >
                {row.slice(0, 1).map((dateName) => (
                  <View key={dateName} style={styles.dateCell}>
                    <Text style={{ textAlign: "center" }}>{dateName}</Text>
                  </View>
                ))}
                {row.slice(1).map((values, valuesIndex) => {
                  const strValue = values.toString();
                  const text =
                    strValue.length >= 6
                      ? strValue.substring(0, strValue.length - 5) +
                        "." +
                        strValue.substring(
                          strValue.length - 5,
                          strValue.length - 2
                        ) +
                        "," +
                        strValue.substring(strValue.length - 2, strValue.length)
                      : (strValue.length <= 5) & (strValue.length >= 3)
                      ? strValue.substring(0, strValue.length - 2) +
                        "," +
                        strValue.substring(strValue.length - 2, strValue.length)
                      : "0," + values;
                  return (
                    <View key={valuesIndex} style={styles.valuesCell}>
                      <Text style={{ textAlign: "center" }}>{"R$" + text}</Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  monthHeader: {
    backgroundColor: "rgb(169, 208, 142)",
    borderWidth: 1,
    borderColor: "black",
    width: 100,
  },
  catHeader: {
    backgroundColor: "rgb(169, 208, 142)",
    borderWidth: 1,
    borderColor: "black",
    width: 100,
  },
  dateCell: {
    borderWidth: 1,
    borderColor: "black",
    paddingHorizontal: "1%",
    width: 100,
  },
  valuesCell: {
    borderWidth: 1,
    borderColor: "black",
    paddingHorizontal: "1%",
    width: 100,
  },
  oddRow: {
    backgroundColor: "lightgrey",
  },
});
