import React, { useEffect, useState } from 'react'
import { Text, SafeAreaView, Keyboard, TouchableWithoutFeedback, View, StyleSheet } from 'react-native'
import { Button, TextInput, Drawer, Divider } from 'react-native-paper'
import DropDownPicker from 'react-native-dropdown-picker'

class Category {
    constructor(label, value) {
        this.label = label
        this.value = value
    }
}

class Product {
    constructor(name, brand, price, category) {
        this.name = name
        this.brand = brand
        this.price = price
        this.category = category
    }
}

export default function ManageStore() {
    // input state
    const [name, setName] = useState(null)
    const [brand, setBrand] = useState(null)
    const [price, setPrice] = useState(null)
    // category dropdown state
    const [open, setOpen] = useState(false)
    const [category, setCategory] = useState(null)
    const [items, setItems] = useState([])

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await fetch('https://supermarket-navigation.herokuapp.com/category')
            // const json = await response.json()
            // const data = await json.data
            // TODO mock data while api is down
            const data = ["seafood", 'milk', 'auto_moto']
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
            const response = await fetch('https://supermarket-navigation.herokuapp.com/product', {
                method: 'POST',
                header: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            console.log(response)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={{flex:1}}>
                <View style={styles.optionsContainer}>
                    <Button style={styles.optionsButton}>Add Product</Button>
                    <Button style={styles.optionsButton}>Update Product</Button>
                </View>
                <Divider />
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