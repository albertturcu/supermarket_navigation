import React from 'react'
import { createNativeStackNavigator  } from '@react-navigation/native-stack'
import Search from '../Components/Search'
import PathView from '../Components/PathView'

const Stack = createNativeStackNavigator();

export default function Home() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Search"
                component={Search} />
            <Stack.Screen 
                name="PathView"
                component={PathView} />
        </Stack.Navigator>
    )
}