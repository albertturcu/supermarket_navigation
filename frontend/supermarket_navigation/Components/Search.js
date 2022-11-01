import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView } from 'react-native'
import { Appbar, Searchbar, Text } from 'react-native-paper';

const Item = ({ item }) => (
  <View style={styles.item}>
    <Text style={styles.productName}>{item[1]}</Text>
    <Text style={styles.brand}>{item[3]}</Text>
    <Text style={styles.price}>{item[2]}</Text>
  </View>
);


export default function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const onChangeQuery = query => setSearchQuery(query)
  
  const [searchResults, setSearchResults] = useState([])

  const renderItem = ({ item }) => (
    <Item item={item} />
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
        console.log(json.data)
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
      <SafeAreaView>
        <Appbar.Header>
          <Appbar.Content title='Store Name' />
        </Appbar.Header>
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
              keyExtractor={item => item[0]}
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