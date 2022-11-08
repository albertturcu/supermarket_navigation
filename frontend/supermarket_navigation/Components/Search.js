import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Pressable } from 'react-native'
import { Appbar, Searchbar, Text } from 'react-native-paper';

const Item = ({ item, navigation }) => (
  <Pressable onPress={() => navigation.navigate("PathView", { id: item.uniq_id })}>
    <View style={styles.item}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.brand}>{item.brand}</Text>
      <Text style={styles.price}>{item.list_price}</Text>
    </View>
  </Pressable>
);


export default function Search({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('')
  const onChangeQuery = query => setSearchQuery(query)
  
  const [searchResults, setSearchResults] = useState([])

  const renderItem = ({ item }) => (
    <Item item={item} navigation={navigation} />
  );

  useEffect(() => {
    // clear search results when user makes changes to the searched value
    setSearchResults([])
  }, [searchQuery])

  const searchAsync = async () => {
    try {
      if (searchQuery != '') {
        const response = await fetch('https://supermarket-navigation.herokuapp.com/search_result?name=' + searchQuery);
        const json = await response.json();
        setSearchResults(json.data)
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
      <SafeAreaView>
        <View>
          <Searchbar
            placeholder='Search'
            onChangeText={onChangeQuery}
            value={searchQuery}
            onSubmitEditing={() => searchAsync()}
            onIconPress={() => searchAsync()}
          />
          {
            searchResults != [] ?
            <View style={styles.listContainer}>
              <FlatList
              data={searchResults}
              renderItem={renderItem}
              keyExtractor={item => item.uniq_id}
              />
            </View> 
            :
            null
          }
        </View>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  listContainer: {
    height: '90%'
  },
  item: {
    backgroundColor: '#000',
    padding: 10,
    marginVertical: 2,
    marginHorizontal: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    flex: 1
  },
  productName: {
    fontSize: 16,
    color: "#fff"
  },
  brand: {
    fontSize: 12,
    color: '#fff'
  },
  price: {
    color: "#fff",
  }
});