import * as React from 'react'
import MainContainer from './src/screens/MainContainer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

function App(){
  return(
    <GestureHandlerRootView style={{flex: 1}}>
      <MainContainer/>
    </GestureHandlerRootView>
  )
}

export default App