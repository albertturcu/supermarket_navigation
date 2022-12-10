import React, {useState, useEffect} from 'react'
import { SafeAreaView, Text, View, StyleSheet } from 'react-native'
import { TextInput, Button, Dialog, Portal, Paragraph } from 'react-native-paper'
import DropDownPicker from 'react-native-dropdown-picker'
import StoreServices from '../services/storeServices'
import { DropdownElement } from '../Models/DataModels'

const api = new StoreServices()

export default function EditProduct({navigation, route}) {
    // input state
    const [input, setInput] = useState({id: null, name: null, brand: null, price: null, category: null, xPosition: null, yPosition: null})
    // category dropdown state
    const [openCategory, setOpenCategory] = useState(false)
    const [categories, setCategories] = useState([])
    // y position drowdown state
    const [openYPosition, setOpenYPosition] = useState(false)
    const [yPositions, setYPositions] = useState([])
    // x position drowdown state
    const [openXPosition, setOpenXPosition] = useState(false)
    const [xPositions, setXPositions] = useState([])

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
        api.getProduct(route.params.id)
            .then((response) => {
                setInput({
                    id: response.id,
                    name: response.name,
                    brand: response.brand,
                    price: response.price,
                    category: response.category,
                    xPosition: response.xPosition,
                    yPosition: response.yPosition
                })
                // iterate over shelfWidth to show all x positions for dropdown
                let tempXPositions = []
                for (let i=1; i<=response.shelfWidth+1; i++) {
                    tempXPositions.push(new DropdownElement(i, i))
                }
                // iterate over shelfHeight to show all y positions for dropdown
                let tempYPositions = []
                for (let i=1; i<=response.shelfHeight+1; i++) {
                    tempYPositions.push(new DropdownElement(i, i))
                }
                setXPositions(tempXPositions)
                setYPositions(tempYPositions)
            })
            .catch((error) => console.error(error))
    }, [])


    const editProduct = () => {
        api.editProduct(input)
            .then(navigation.goBack())
            .catch((error) => {
                showDialog()
                console.log(error)
            })
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Something went wrong...</Dialog.Title>
                    <Dialog.Content>
                    <Paragraph>We were not able to save your edit. Please check your inputs and try again.</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                    <Button onPress={hideDialog}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <View style={{margin: 10}}>
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
                        open={openCategory}
                        value={input.category}
                        items={categories}
                        setOpen={setOpenCategory}
                        setValue={(callback) => {setInput(oldInput => ({
                            ...oldInput,
                            category: callback(input.category)
                        }))}}
                        setItems={setCategories}
                        zIndex={3000}
                        zIndexInverse={1000}
                    />
                <Text style={styles.inputDropDown}>Vertical Position</Text>
                    <DropDownPicker 
                        open={openYPosition}
                        value={input.yPosition}
                        items={yPositions}
                        setOpen={setOpenYPosition}
                        setValue={(callback) => setInput(oldInput => ({
                            ...oldInput,
                            yPosition: callback(input.yPosition)
                        }))}
                        setItems={setYPositions}
                        zIndex={2000}
                        zIndexInverse={2000}
                        bottomOffset={100}
                    />
                <Text style={styles.inputDropDown}>Horizontal Position</Text>
                    <DropDownPicker 
                        open={openXPosition}
                        value={input.xPosition}
                        items={xPositions}
                        setOpen={setOpenXPosition}
                        setValue={(callback) => {setInput(oldInput => ({
                            ...oldInput,
                            xPosition: callback(input.xPosition)
                        }))}}
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