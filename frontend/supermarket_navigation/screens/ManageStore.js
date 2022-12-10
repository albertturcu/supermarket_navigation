import React, { useState } from 'react'
import { SafeAreaView, Keyboard, TouchableWithoutFeedback, View, StyleSheet } from 'react-native'
import { Button, Divider } from 'react-native-paper'
import Search from '../Components/Search'
import EditProduct from "../Components/EditProduct"
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import AddProduct from '../Components/AddProduct'

const Stack = createNativeStackNavigator()

export default function ManageStore() {
    // screen selection - 0 for add product, 1 for modifying product
    const [screen, setScreen] = useState(0)

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={{flex:1}}>
                    <View style={styles.optionsContainer}>
                        <Button style={styles.optionsButton} onPress={() => setScreen(0)}>Add Product</Button>
                        <Button style={styles.optionsButton} onPress={() => setScreen(1)}>Edit Product</Button>
                    </View>
                    <Divider />
            {
                screen === 0 ?
                    <AddProduct />
                :
                <Stack.Navigator>
                    <Stack.Screen 
                        component={Search}
                        name="Search"
                        initialParams={{navigateTo: "Edit Product"}}
                        />
                    <Stack.Screen 
                        component={EditProduct}
                        name="Edit Product"/>
                </Stack.Navigator>
            }
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    optionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    optionsButton: {
        padding: 10
    }
})