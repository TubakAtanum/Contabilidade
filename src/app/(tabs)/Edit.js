import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, TextInput, Button, Modal } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TextInputMask } from "react-native-masked-text";
import {
  db,
  tableName,
  getCurrentDate,
  getCurrentValue,
  getLastDate,
} from "../../utils/SQLite";

export default function Edit() {
  const [category, setCategory] = useState("Pix"); // Default category is 'Pix'
  const [value, setValue] = useState("");
  const [pickerCategories, setPickerCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [showModal, setShowModal] = useState(false);

  const currentDate = getCurrentDate();
  const lastDate = getLastDate(tableName);

  const valueRef = useRef(null);
  const unmasked = parseInt(value.replace(/[^0-9]+/g, ""));

  useFocusEffect(
    React.useCallback(() => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM ${tableName} LIMIT 1`,
          [],
          (_, result) => {
            const rows = result.rows;
            const columnNames = Object.keys(rows.item(0)).slice(2);
            setPickerCategories(columnNames);
          },
          (_, error) => {
            console.log(error);
          }
        );
      });
    })
  );

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={{ width: 200 }}
      >
        {pickerCategories.map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>
      <TextInputMask
        type={"money"}
        options={{
          precision: 2,
          separator: ",",
          delimiter: ".",
          unit: "R$",
        }}
        placeholder="R$0,00"
        value={value}
        onChangeText={(text) => setValue(text)}
        keyboardType="numeric"
        ref={valueRef}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, width: 200 }}
      />
      <Button
        title="Adicionar"
        onPress={() => {
          getCurrentValue(category, tableName).then((currValue) =>
            appendToDB(
              currentDate,
              lastDate,
              tableName,
              category,
              unmasked,
              currValue
            )
          );
        }}
      />
      <Modal visible={showModal} animationType="slide">
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <TextInput
            placeholder="Nova Categoria"
            value={newCategory}
            onChangeText={(text) => setNewCategory(text)}
            style={{
              borderWidth: 1,
              padding: 10,
              marginBottom: 10,
              width: 200,
            }}
          />
          <Button
            title="Adicionar"
            onPress={() => {
              handleAddCategory(tableName, newCategory);
            }}
          />
          <Button title="Cancelar" onPress={() => setShowModal(false)} />
        </View>
      </Modal>
      <Button title="Adicionar Categoria" onPress={() => setShowModal(true)} />
    </View>
  );
};

const appendToDB = async (
  currentDate,
  lastDate,
  tableName,
  category,
  value,
  getCurValue
) => {
  if (currentDate == (await lastDate)) {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          `UPDATE ${tableName} SET ${category} = ?`,
          [getCurValue[category] + value],
          (_, result) => {
            console.log(
              `Updated ${category} to ${getCurValue[category] + value}`
            );
          },
          (_, error) => {
            console.log(error);
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO ${tableName} (Date, ${category}) VALUES (?, ?)`,
          [currentDate, value],
          (_, result) => {
            console.log(`Inserted ${value} into ${category}`);
          },
          (_, error) => {
            console.error("Error inserting row:", error);
          }
        );
      });
    } catch (error) {
      console.error(error);
    }
  }
};

const handleAddCategory = async (tableName, newCategory) => {
  db.transaction((tx) => {
    tx.executeSql(
      `ALTER TABLE ${tableName} ADD COLUMN ${newCategory} REAL DEFAULT 0`,
      [],
      (_, result) => {
        console.log(result);
      },
      (_, error) => {
        console.error(error);
      }
    );
  });
};
