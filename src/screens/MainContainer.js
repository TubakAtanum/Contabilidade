import * as React from 'react' 
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import HomeScreen from './Home'
import AddDataScreen from './CreateCSV'
import ExtratoScreen from './Extrato'

//SCR Names
const homeName = 'Home'
const createName = 'Create'
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
            } else if (rn === createName) {
              iconName = focused ? 'grid' : 'grid-outline'
            } else if (rn=== extratoName) {
              iconName = focused ? 'trending-up' : 'trending-up-outline'
            }
            return <Ionicons name={iconName} size={size} color={color}/>
          }
        })}>

          <Tab.Screen name={homeName} component={HomeScreen}/>
          <Tab.Screen name={createName} component={AddDataScreen}/>
          <Tab.Screen name={extratoName} component={ExtratoScreen}/>

        </Tab.Navigator>
      </NavigationContainer>
    )
}