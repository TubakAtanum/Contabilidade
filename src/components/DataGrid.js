import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const DataGrid = ({ header, body }) => {
  const [longest, setLongest] = useState(50);

  useEffect(() => {
    const getLongest = (header) => {
      const arrLenght = [];
      header.forEach((content) => {
        arrLenght.push(content.length);
      });
      return arrLenght.reduce((acc, current) => {
        return current > acc ? current : acc ;
      }, 0);
    };
    setLongest(getLongest(header));
    console.log(longest)
  }, []);

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
      width: longest * 12,
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
      width: longest * 12,
    },
    oddRow: {
      backgroundColor: "lightgrey",
    },
  });

  return (
    <View key="table">
      <View key="headers" style={{ flexDirection: "row" }}>
        {header.slice(0, 1).map((date, index) => (
          <View key={date} style={styles.monthHeader}>
            <Text key={index} style={{ color: "black", textAlign: "center" }}>
              {date}
            </Text>
          </View>
        ))}
        {header.slice(1).map((headers, index) => (
          <View key={headers} style={styles.catHeader}>
            <Text key={index} style={{ color: "black", textAlign: "center" }}>
              {headers}
            </Text>
          </View>
        ))}
      </View>

      <View key="body" style={{ flexDirection: "column" }}>
        {body.map((row, rowIndex) => (
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
  );
};

export default DataGrid;
