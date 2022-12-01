import React, { useEffect, useState } from 'react'
import { Text, SafeAreaView, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native'
import { TextInput } from 'react-native-paper'
import DropDownPicker from 'react-native-dropdown-picker'

export default function ManageStore() {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(null)
    const [items, setItems] = useState([
        {label: 'Garden', value: 'garden'},
        {label: 'Home', value: 'home'}
    ])

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await fetch('https://supermarket-navigation.herokuapp.com/category')
            const json = await response.json()
            const data = await json.data
            const modifiedData = data.map((value) => {
                return {label: value[0].toUpperCase() + value.substr(1), value: value}
            })
            setItems(modifiedData)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={{flex:1}}>
                <Text>Add Product</Text>
                <Text>Product Name</Text>
                <TextInput 
                    placeholder='Product Name'
                />
                <Text>Brand</Text>
                <TextInput 
                    placeholder='Brand'
                />
                <Text>Price</Text>
                <TextInput 
                    placeholder='Price'
                />
            
                <Text>Category</Text>
                <DropDownPicker 
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    keyboardShouldPersistTaps='handled'
                    horizontal
                />
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}