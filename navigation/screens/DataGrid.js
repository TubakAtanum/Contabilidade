import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const DataGrid = ({ csv }) => {
  if (!csv) {
    return null;
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

  return (
    <View key="table">
      <View key="header" style={{ flexDirection: "row" }}>
        {csv.header.slice(0, 1).map((dateName) => (
          <View key={dateName} style={styles.monthHeader}>
            <Text style={{ color: "black", textAlign: "center" }}>
              {dateName}
            </Text>
          </View>
        ))}
        {csv.header.slice(1).map((headerName) => (
          <View key={headerName} style={styles.catHeader}>
            <Text style={{ color: "black", textAlign: "center" }}>
              {headerName}
            </Text>
          </View>
        ))}
      </View>

      <View key="content" style={{ flexDirection: "column" }}>
        {csv.data.map((row, rowIndex) => (
          <View
            key={`row-${rowIndex}`}
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
            {row.slice(1).map((column, columnIndex) => {
              return (
                <View key={columnIndex} style={styles.valuesCell}>
                  <Text style={{ textAlign: "center" }}>
                    {"R$" +
                      (column.length >= 3
                        ? column.substring(0, column.length - 2) +
                          "," +
                          column.substring(column.length - 2, column.length)
                        : column)}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

export default DataGrid;
