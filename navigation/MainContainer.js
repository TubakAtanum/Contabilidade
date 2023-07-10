import * as React from 'react' 

import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'

// Screens
import HomeScreen from './screens/Home'
import ExcelScreen from './screens/Excel'
import ExtratoScreen from './screens/Extrato'

//SCR Names
const homeName = 'Home'
const excelName = 'Excel'
const extratoName = 'Extrato'

const Tab = createBottomTabNavigator();

export default function MainContainer(){
    return(
      <NavigationContainer>
        <Tab.Navigator
        initialRoutName={homeName}
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            let rn = route.name

            if (rn === homeName) {
              iconName = focused ? 'home' : 'home-outline'
            } else if (rn === excelName) {
              iconName = focused ? 'grid' : 'grid-outline'
            } else if (rn=== extratoName) {
              iconName = focused ? 'trending-up' : 'trending-up-outline'
            }

            return <Ionicons name={iconName} size={size} color={color}/>
          }
        })}>

          <Tab.Screen name={homeName} component={HomeScreen}/>
          <Tab.Screen name={excelName} component={ExcelScreen}/>
          <Tab.Screen name={extratoName} component={ExtratoScreen}/>

        </Tab.Navigator>
      </NavigationContainer>
    )
}