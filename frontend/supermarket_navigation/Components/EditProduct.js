import React, {useState, useEffect} from 'react'
import { SafeAreaView, Text, View, StyleSheet } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import DropDownPicker from 'react-native-dropdown-picker'
import {API_BASE_URL} from '@env'

class DropdownElement {
    constructor(label, value) {
        this.label = label
        this.value = value
    }
}

class Product {
    constructor(id, name, brand, list_price, category, position_x, position_y) {
        this.uniq_id = id
        this.name = name
        this.brand = brand
        this.list_price = list_price
        this.category = category
        this.position_x = position_x
        this.position_y = position_y
    }
}

export default function EditProduct({navigation, route}) {
    // input state
    const [name, setName] = useState(null)
    const [brand, setBrand] = useState(null)
    const [price, setPrice] = useState(null)
    // category dropdown state
    const [openCategory, setOpenCategory] = useState(false)
    const [category, setCategory] = useState(null)
    const [items, setItems] = useState([])
    // y position drowdown state
    const [openYPosition, setOpenYPosition] = useState(false)
    const [yPosition, setYPosition] = useState(null)
    const [yPositions, setYPositions] = useState([])
    // x position drowdown state
    const [openXPosition, setOpenXPosition] = useState(false)
    const [xPosition, setXPosition] = useState(null)
    const [xPositions, setXPositions] = useState([])

    const [id, setId] = useState(null)

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
                return new DropdownElement(modifiedLabel, value)
            })
            setItems(modifiedData)
        } catch (error) {
            console.error(error)
        }
    }
    
    useEffect(() => {
        fetchProduct()
    }, [])

    const fetchProduct = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}` + 'product?id=' + route.params.id);
            const json = await response.json();
            console.log(json.data)
            setName(json.data.name)
            setBrand(json.data.brand)
            setPrice(json.data.list_price)
            setCategory(json.data.category)
            setId(json.data.uniq_id)
            setYPosition(json.data.position_y + 1)
            setXPosition(json.data.position_x + 1)
            // iterate over shelf_width to show all x positions for dropdown
            var tempXPositions = []
            for (let i=1; i<=json.data.shelf_width+1; i++) {
                tempXPositions.push(new DropdownElement(i, i))
            }
            setXPositions(tempXPositions)
            // iterate over shelf_height to show all y positions for dropdown
            var tempYPositions = []
            for (let i=1; i<=json.data.shelf_height+1; i++) {
                tempYPositions.push(new DropdownElement(i, i))
            }
            setYPositions(tempYPositions)
        } catch (error) {
            console.error(error)
        }
    }

    const editProduct = async () => {
        try {
            const payload = new Product(id, name, brand, price, category, xPosition - 1, yPosition - 1)
            await fetch(`${API_BASE_URL}` + 'product', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            await navigation.goBack()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>
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
                        open={openCategory}
                        value={category}
                        items={items}
                        setOpen={setOpenCategory}
                        setValue={setCategory}
                        setItems={setItems}
                        zIndex={3000}
                        zIndexInverse={1000}
                    />
                <Text style={styles.inputDropDown}>Vertical Position</Text>
                    <DropDownPicker 
                        open={openYPosition}
                        value={yPosition}
                        items={yPositions}
                        setOpen={setOpenYPosition}
                        setValue={setYPosition}
                        setItems={setYPositions}
                        zIndex={2000}
                        zIndexInverse={2000}
                        bottomOffset={100}
                    />
                <Text style={styles.inputDropDown}>Horizontal Position</Text>
                    <DropDownPicker 
                        open={openXPosition}
                        value={xPosition}
                        items={xPositions}
                        setOpen={setOpenXPosition}
                        setValue={setXPosition}
                        setItems={setXPositions}
                        zIndex={1000}
                        zIndexInverse={3000}
                        bottomOffset={100}
                    />
                <Button onPress={() => editProduct()} style={styles.submitButton}>Edit Product</Button>
            </View>
        </SafeAreaView>
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
    inputDropDown: {
        marginBottom: 10,
        marginTop: 10
    },
    submitButton: {
        padding: 20
    }
})