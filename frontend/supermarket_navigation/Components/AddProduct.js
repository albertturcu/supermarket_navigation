import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Button, TextInput, Dialog, Portal, Paragraph } from 'react-native-paper'
import DropDownPicker from 'react-native-dropdown-picker'
import StoreServices from '../services/storeServices'
import { DropdownElement } from '../Models/DataModels'

const api = new StoreServices()

export default function AddProduct() {
    // input state
    const [input, setInput] = useState({name: null, brand: null, price: null, category: null})
    // category dropdown state
    const [open, setOpen] = useState(false)
    const [categories, setCategories] = useState([])

    // dialog state
    const [visible, setVisible] = React.useState(false);

    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);

    useEffect(() => {
        api.getAllCategories()
            .then((response) => {
                const modifiedData = response.map((value) => {
                    // capitalize first letter of the category name
                    let label = value[0].toUpperCase() + value.substring(1)
                    // get rid of the underscore from the category name for label in dropdown
                    let modifiedLabel = label.replace(/_/g, ' ')
                    return new DropdownElement(modifiedLabel, value)
                })
                setCategories(modifiedData)
            })
            .catch((error) => console.error(error))
    }, [])

    const addProduct = () => {
        api.addProduct(input)
            .then(() => {
                setInput({
                    name: null,
                    brand: null, 
                    price: null,
                    category: null
                })
            })
            .catch((error) => {
                showDialog()
                console.error(error)
            })
    }

    return (
        <View style={{margin: 10}}>
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Something went wrong...</Dialog.Title>
                    <Dialog.Content>
                    <Paragraph>We were not able to save your new product. Please check your inputs and try again.</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                    <Button onPress={hideDialog}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Text style={styles.input}>Product Name</Text>
            <TextInput 
                placeholder='Product Name'
                value={input.name}
                onChangeText={(name) => setInput(oldInput => ({
                    ...oldInput,
                    name: name
                }))}
                style={styles.input}
            />
            <Text style={styles.input}>Brand</Text>
            <TextInput 
                placeholder='Brand'
                value={input.brand}
                onChangeText={(brand) => setInput(oldInput => ({
                    ...oldInput,
                    brand: brand
                }))}
                style={styles.input}
            />
            <Text style={styles.input}>Price</Text>
            <TextInput 
                placeholder='Price'
                value={input.price}
                onChangeText={(price) => setInput(oldInput => ({
                    ...oldInput,
                    price: price
                }))}
                style={styles.input}
            />
            <Text style={styles.input}>Category</Text>
            <DropDownPicker 
                open={open}
                value={input.category}
                items={categories}
                setOpen={setOpen}
                setValue={(callback) => setInput(oldInput => ({
                    ...oldInput,
                    category: callback(input.category)
                }))}
                setItems={setCategories}
            />
            <Button onPress={() => addProduct()} style={styles.submitButton}>Add Product</Button>
        </View>
    )
}

const styles = StyleSheet.create({
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