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

    const [emptySpaces, setEmptySpaces] = useState([])
    const [openEmptySpaces, setOpenEmptySpaces] = useState(false)
    const [selectedSpot, setSelectedSpot] = useState(null)

    // dialog state
    const [visible, setVisible] = React.useState(false);

    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);

    const [visibleAddingSpaces, setVisibleAddingSpaces] = useState(false)

    const showDialogAddingSpaces = () => setVisibleAddingSpaces(true)
    
    const hideDialogAddingSpaces = () => setVisibleAddingSpaces(false)

    useEffect(() => {
        api.getAllCategories()
            .then((response) => {
                const modifiedData = response.map((value) => {
                    // currently result is a 2D array because of a bug in backend, this code will need to go if fixed on backend
                    let valueString = value.toString()
                    // capitalize first letter of the category name
                    let label = valueString[0].toUpperCase() + valueString.substring(1)
                    // get rid of the underscore from the category name for label in dropdown
                    let modifiedLabel = label.replace(/_/g, ' ')
                    return new DropdownElement(modifiedLabel, valueString)
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
            })
            .catch((error) => console.error(error))
    }, [])

    useEffect(() => {
        if (input.category != null) {
            api.getEmptySpacesForCategory(input.category, input.id)
            .then((response) => {
                let tempEmpty = []
                // iterate over the response array and create dropdown elements
                for (let i=0; i<response.length; i++) {
                    const value = i
                    const y = response[i].shelf_position_y + 1
                    const x = response[i].shelf_position_x + 1
                    const label = x + '-' + y
                    tempEmpty.push(new DropdownElement(label, value))
                    if (response[i].uniq_id === input.id) {
                        setSelectedSpot(value)
                    }
                }
                setEmptySpaces(tempEmpty)})
            .catch((error) => console.error(error))
        }
    }, [input.category])

    // update the x and y position on input object every time the selected spot changes
    useEffect(() => {
        if (selectedSpot != null && emptySpaces.length != 0) {
            // selected spot return the value, value represents the index in emptySpaces array
            const label = emptySpaces[selectedSpot].label
            const split = label.split('-')
            setInput(oldInput => ({
                ...oldInput,
                xPosition: split[0] - 1,
                yPosition: split[1] - 1
            }))
        }
    }, [selectedSpot])

    useEffect(() => {
        if (emptySpaces.length === 1 && openEmptySpaces) {
            showDialogAddingSpaces()
        }
    }, [openEmptySpaces])

    const addColumnOnShelf = () => {
        let width
        let height
        api.getShelfDimensions(input.category)
            .then((response) => {
                width = response.width + 1
                height = response.height
                api.extendShelfWidth(width, height, input.category)
                    .then(() => {
                        hideDialogAddingSpaces()
                        if (input.category != null) {
                            api.getEmptySpacesForCategory(input.category, input.id)
                            .then((response) => {
                                let tempEmpty = []
                                // iterate over the response array and create dropdown elements
                                for (let i=0; i<response.length; i++) {
                                    const value = i
                                    const y = response[i].shelf_position_y + 1
                                    const x = response[i].shelf_position_x + 1
                                    const label = x + '-' + y
                                    tempEmpty.push(new DropdownElement(label, value))
                                    if (response[i].uniq_id === input.id) {
                                        setSelectedSpot(value)
                                    }
                                }
                                setEmptySpaces(tempEmpty)})
                            .catch((error) => console.error(error))
                        }
                    })
                    .catch((error) => console.error(error))
                
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const editProduct = () => {
        console.log(input)
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
                <Dialog visible={visibleAddingSpaces} onDismiss={hideDialogAddingSpaces}>
                    <Dialog.Title>No more space on the shelf!</Dialog.Title>
                    <Dialog.Content>
                    <Paragraph>The shelf you have selected has no empty space. Do you wish to increase the width of the shelf?</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialogAddingSpaces}>Cancel</Button>
                        <Button onPress={addColumnOnShelf}>Yes</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <View style={{margin: 10}}>
                <Text style={styles.input}>Product Name</Text>
                <TextInput 
                    placeholder='Product Name'
                    value={input.name}
                    multiline={true}
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
                <Text style={styles.inputDropDown}>Available Spots</Text>
                <DropDownPicker
                    open={openEmptySpaces}
                    value={selectedSpot}
                    items={emptySpaces}
                    setOpen={setOpenEmptySpaces}
                    setValue={setSelectedSpot}
                    setItems={setEmptySpaces}
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