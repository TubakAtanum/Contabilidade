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
  
      // Check if value is not empty and is a number
      if (!value || isNaN(value)) {
        alert('Please enter a valid numeric value.');
        return;
      }
  
      const newData = `${currentDate},${category},${value}`;
      const fileUri = FileSystem.documentDirectory + 'data.csv';
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
  
      // Split the CSV content into lines
      const lines = fileContent.trim().split('\n');
  
      // Check if there is an existing entry for the current date and category
      const existingEntryIndex = lines.findIndex((line) => {
        const [date, cat] = line.split(',');
        return date === currentDate && cat === category;
      });
  
      if (existingEntryIndex !== -1) {
        // If an entry already exists for the current date and category, update its value
        const existingEntry = lines[existingEntryIndex].split(',');
        const currentValue = Number(existingEntry[2]);
        const newValue = currentValue + Number(value);
        lines[existingEntryIndex] = `${currentDate},${category},${newValue}`;
      } else {
        // If no entry exists for the current date and category, add a new entry
        lines.push(newData);
      }
  
      const updatedContent = lines.join('\n');
      await FileSystem.writeAsStringAsync(fileUri, updatedContent);
  
      console.log('Updated CSV content:', updatedContent);
      
      alert('Data appended to CSV file successfully!');
      setValue('');
    } catch (error) {
      console.error('Error appending data to the CSV file:', error);
    }
  };    

  // State for managing the list of categories and the new category input
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [showModal, setShowModal] = useState(false);

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
        }

        // Close the modal and reset the newCategory state
        setShowModal(false);
        setNewCategory('');

        // Fetch the updated categories from categories.csv after adding a new category
        fetchCategories(); // Call the fetchCategories function here

        const categoriesFileUri = FileSystem.documentDirectory + 'categories.csv';
        const updatedCategoriesContent = await FileSystem.readAsStringAsync(categoriesFileUri);
        console.log('Updated categories.csv content:', updatedCategoriesContent);
      } catch (error) {
        console.error('Error updating categories:', error);
      }
    }
  };

  // Fetch the initial categories from categories.csv when the component mounts
  useEffect(() => {
    fetchCategories(); // Call the fetchCategories function here
  }, []);

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
        placeholder="Value"
        value={value}
        onChangeText={(text) => setValue(text.replace(/[^0-9]/g, ''))}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, width: 200 }}
      />
      <Button title="Append to CSV" onPress={appendToCSVFile} />

      <Modal visible={showModal} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TextInput
            placeholder="New Category"
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
