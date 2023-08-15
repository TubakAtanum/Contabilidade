import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Modal } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Picker } from '@react-native-picker/picker'; // Import the new Picker

export const getCurrentDate = () => {
  const date = new Date();
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return date.toLocaleDateString('pt-BR', options);
};

const AddDataScreen = () => {
  const [category, setCategory] = useState('Pix'); // Default category is 'Pix'
  const [value, setValue] = useState('');

  const appendToCSVFile = async () => {
    try {
      const currentDate = getCurrentDate();
      const fileUri = FileSystem.documentDirectory + 'data.csv';
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const lines = fileContent.trim().split('\n');
      const categories = lines[0].split(',').slice(1);
      const categoryIndex = categories.indexOf(category);
      
      if (categoryIndex === -1) {
        alert('Selected category not found in CSV file.');
        return;
      }
  
      // Find the row for the current date
      let dataRow = lines.find((line) => line.startsWith(currentDate));
  
      if (dataRow) {
        // If an entry already exists for the current date, update its value
        const rowData = dataRow.split(',');
        const currentValue = Number(rowData[categoryIndex+1])
        rowData[categoryIndex + 1] = currentValue + Number(value); // +1 to skip the date column
        lines[lines.indexOf(dataRow)] = rowData.join(',');
      } else {
        // If no entry exists for the current date, add a new entry
        const newRow = [currentDate, ...Array(categories.length).fill('0')]; // Create a new row with 0 values for all categories
        newRow[categoryIndex + 1] = value; // +1 to skip the date column
        lines.push(newRow.join(','));
      }
  
      const updatedContent = lines.join('\n'); // Join the lines back with a newline
      await FileSystem.writeAsStringAsync(fileUri, updatedContent);
  
      console.log('Updated CSV content:', updatedContent);
  
      alert('Data appended to CSV file successfully!');
      setValue('');
    } catch (error) {
      console.error('Error appending data to the CSV file:', error);
    }
  }   

  // State for managing the list of categories and the new category input
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Fetch the initial categories from categories.csv when the component mounts
  useEffect(() => {
    fetchCategories(); // Call the fetchCategories function here
  }, []);

  // Function to fetch the categories from categories.csv
  const fetchCategories = async () => {
    try {
      const categoriesFileUri = FileSystem.documentDirectory + 'categories.csv';
      const categoriesFileContent = await FileSystem.readAsStringAsync(categoriesFileUri);
      const categories = categoriesFileContent.trim().split(',');
      setCategories(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Function to add a new category to the list of categories and update categories.csv
  const handleAddCategory = async () => {
    if (newCategory.trim() === '') {
      alert('Please enter a valid category name.');
      return;
    } else {
      try {
        // Check if the new category already exists
        if (!categories.includes(newCategory)) {
          // Add the new category to the list of categories
          const updatedCategories = [...categories, newCategory];
          setCategories(updatedCategories);
  
          // Update the categories.csv file with the new category
          const categoriesFileUri = FileSystem.documentDirectory + 'categories.csv';
          const updatedCategoriesContent = updatedCategories.join(',');
          await FileSystem.writeAsStringAsync(categoriesFileUri, updatedCategoriesContent);
  
          // Fetch the data.csv file and append the new category to it
          const dataFileUri = FileSystem.documentDirectory + 'data.csv';
          const dataContent = await FileSystem.readAsStringAsync(dataFileUri);
          const lines = dataContent.trim().split('\n');
          const headerRow = lines[0].split(','); // Extract the header row
          const newDataHeader = [...headerRow, newCategory]; // Add the new category to the header
          const updatedLines = lines.map((line, index) => {
            if (index === 0) {
              return newDataHeader.join(','); // Update the header row
            } else {
              const rowValues = line.split(',');
              return [...rowValues, '0'].join(','); // Add default value for the new category in existing rows
            }
          });
          const updatedDataContent = updatedLines.join('\n');
  
          await FileSystem.writeAsStringAsync(dataFileUri, updatedDataContent);
          console.log('Updated data.csv content:', updatedDataContent);
        }
  
        // Close the modal and reset the newCategory state
        setShowModal(false);
        setNewCategory('');
  
        // Fetch the updated categories from categories.csv after adding a new category
        fetchCategories(); 
  
        const categoriesFileUri = FileSystem.documentDirectory + 'categories.csv';
        const updatedCategoriesContent = await FileSystem.readAsStringAsync(categoriesFileUri);
        console.log('Updated categories.csv content:', updatedCategoriesContent);
      } catch (error) {
        console.error('Error updating categories:', error);
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={{ width: 200 }}
      >
        {categories.map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>
      <TextInput
        placeholder="Digite o Valor"
        value={value}
        onChangeText={(text) => setValue(text)}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, width: 200 }}
      />
      <Button title="Adicionar" onPress={appendToCSVFile} />

      <Modal visible={showModal} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TextInput
            placeholder="Nova Categoria"
            value={newCategory}
            onChangeText={(text) => setNewCategory(text)}
            style={{ borderWidth: 1, padding: 10, marginBottom: 10, width: 200 }}
          />
          <Button title="Adicionar" onPress={handleAddCategory} />
          <Button title="Cancelar" onPress={() => setShowModal(false)} />
        </View>
      </Modal>
      <Button title="Adicionar Categoria" onPress={() => setShowModal(true)} />
    </View>
  );
};

export default AddDataScreen;
