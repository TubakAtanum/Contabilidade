import React from 'react';
import { View, Text, Button } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { getCurrentDate } from './CreateCSV'


const HomeScreen = ({ navigation }) => {
  const generateCategoriesFile = async () => {
    try {
      // Create the categories.csv file with initial categories
      const categories = ['Pix', 'Dinheiro', 'Cartão'];
      const categoriesContent = categories.join(',');
      const categoriesFileUri = FileSystem.documentDirectory + 'categories.csv';
      await FileSystem.writeAsStringAsync(categoriesFileUri, categoriesContent);

      // Call the createCSVFile function to generate the data.csv file
      await createCSVFile();

      alert('CSV files created successfully!');
    } catch (error) {
      console.error('Error creating the CSV files:', error);
    }
  };

  const createCSVFile = async () => {
    try {
      const csvContent = 'Date,Category,Value\n'; 
      const fileUri = FileSystem.documentDirectory + 'data.csv';

      // Read categories from the categories.csv file
      const categoriesFileUri = FileSystem.documentDirectory + 'categories.csv';
      const categoriesContent = await FileSystem.readAsStringAsync(categoriesFileUri);
      const categories = categoriesContent.split(',');
  
      // Create initial entries with all categories
      const currentDate = getCurrentDate();
      const initialEntries = categories.map(category => `${currentDate},${category},0\n`);
      const initialContent = csvContent + initialEntries.join('');
  
      await FileSystem.writeAsStringAsync(fileUri, initialContent);

      console.log('CSV content:', initialContent);
  
      alert('CSV file created successfully!');
    } catch (error) {
      console.error('Error creating the CSV file:', error);
    }
  };
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ marginTop: 20 }}>
        <Button title="Create CSV File" onPress={generateCategoriesFile} />
      </View>
    </View>
  );
};

export default HomeScreen;
