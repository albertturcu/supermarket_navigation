import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function Item({navigation, route}) {
    const [item, setItem] = useState(null)

    useEffect(() => {
        fetchProduct()
    }, [])
    const fetchProduct = async () => {
        try {
            const response = await fetch('https://supermarket-navigation.herokuapp.com/product?id=' + route.params.id);
            const json = await response.json();
            setItem(json.data)
            console.log(json.data)
        } catch (error) {
          console.error(error)
        }
      }
    return (
        <View>
            <Text>Item ID: {route.params.id}</Text>
            { item != null ?
            <View>
                <Text>Name: {item.name}</Text>
                <Text>Path: {item.path.join(" -> ")}</Text> 
            </View>
            : null}
        </View>
    )
}