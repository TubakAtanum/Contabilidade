import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const DataGrid = ({ csv }) => {
  if (!csv) {
    return null;
  }

  //csv com X headers tem X items por Linha
  //  for (let i = 0, iLength = csv.data.length; i < iLength; i++) {
  //    let max = -1;
  //    for (let j = 0, jLength = csv.data[i].length; j < jLength; j++) {
  //      if (csv.data[i][j].length > max) {
  //        max = csv.data[i][j].length;
  //      }
  //    }
  //  }
  //  console.log(csv.data);
  //  //return null;
  //  const dateWidth = useMemo(() => {
  //    return csv.data // string
  //      .split(";") // array de string
  //      .reduce((acc, cur) => acc + cur.length, 0);
  //  }, [csv]);
  //
  //  const _dateWidth = useMemo(() => {
  //    if (csv)
  //      return (
  //        csv.data.slice(0, 1).reduce((acc, cur) => acc + cur.length, 0) * 25
  //      );
  //  }, [csv]);
  //try {
  //  longest = useMemo(
  //    () =>
  //      csv.data.reduce((acc, cur) => {
  //        acc =
  //          cur.reduce((acc2, cur2) =>
  //            acc2 > cur2.length ? acc : cur2.length
  //          ) * 25;
  //        return acc;
  //      }),
  //    [csv]
  //  );
  //} catch (error) {
  //  console.log(error);
  //}

  let longest = useMemo(() => {
    let max = -1;
    for (let i = 0, iLength = csv.data.length; i < iLength; i++) {
      for (let j = 0, jLength = csv.data[i].length; j < jLength; j++) {
        if (csv.data[i][j].length > max) {
          max = csv.data[i][j].length;
        }
      }
    }
    return max * 10;
  }, [csv]);
  
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
      width: longest,
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
      width: longest,
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
