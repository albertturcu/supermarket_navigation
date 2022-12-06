import React, { useEffect, useState } from 'react'
import { Text, SafeAreaView, Keyboard, TouchableWithoutFeedback, View, StyleSheet } from 'react-native'
import { Button, TextInput, Drawer, Divider } from 'react-native-paper'
import DropDownPicker from 'react-native-dropdown-picker'
import {API_BASE_URL} from '@env'
import ManageProductSearch from '../Components/ManageProductSearch'
import EditProduct from "../Components/EditProduct"
import {createNativeStackNavigator} from '@react-navigation/native-stack'

class Category {
    constructor(label, value) {
        this.label = label
        this.value = value
    }
}

class Product {
    constructor(name, brand, list_price, category) {
        this.name = name
        this.brand = brand
        this.list_price = list_price
        this.category = category
    }
}

const Stack = createNativeStackNavigator()

export default function ManageStore() {
    // input state
    const [name, setName] = useState(null)
    const [brand, setBrand] = useState(null)
    const [price, setPrice] = useState(null)
    // category dropdown state
    const [open, setOpen] = useState(false)
    const [category, setCategory] = useState(null)
    const [items, setItems] = useState([])
    // screen selection - 0 for add product, 1 for modifying product
    const [screen, setScreen] = useState(0)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}` + 'category')
            const json = await response.json()
            const data = await json.data
            const modifiedData = data.map((value) => {
                // capitalize first letter of the category name
                let label = value[0].toUpperCase() + value.substring(1)
                // get rid of the underscore from the category name for label in dropdown
                let modifiedLabel = label.replace(/_/g, ' ')
                return new Category(modifiedLabel, value)
            })
            setItems(modifiedData)
        } catch (error) {
            console.error(error)
        }
    }

    const addProduct = async () => {
        try {
            const payload = new Product(name, brand, price, category)
            await fetch(`${API_BASE_URL}` + 'product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            setName(null)
            setBrand(null)
            setPrice(null)
            setCategory(null)

        } catch (error) {
            console.error(error)
        }
    }

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
                    <View style={{margin: 10}}>
                        <Text style={styles.input}>Product Name</Text>
                        <TextInput 
                            placeholder='Product Name'
                            value={name}
                            onChangeText={(input) => setName(input)}
                            style={styles.input}
                        />
                        <Text style={styles.input}>Brand</Text>
                        <TextInput 
                            placeholder='Brand'
                            value={brand}
                            onChangeText={(input) => setBrand(input)}
                            style={styles.input}
                        />
                        <Text style={styles.input}>Price</Text>
                        <TextInput 
                            placeholder='Price'
                            value={price}
                            onChangeText={(input) => setPrice(input)}
                            style={styles.input}
                        />
                        <Text style={styles.input}>Category</Text>
                        <DropDownPicker 
                            open={open}
                            value={category}
                            items={items}
                            setOpen={setOpen}
                            setValue={setCategory}
                            setItems={setItems}
                        />
                        <Button onPress={() => addProduct()} style={styles.submitButton}>Add Product</Button>
                    </View>
                :
                <Stack.Navigator>
                    <Stack.Screen 
                        component={ManageProductSearch}
                        name="ManageProductSearch"/>
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
    },
    inputAndButtonContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    inputContainer: {
        padding: 20
    },
    input: {
        marginBottom: 10
    },
    submitButton: {
        padding: 20
    }
})