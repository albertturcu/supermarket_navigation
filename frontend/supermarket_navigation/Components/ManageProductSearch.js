import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Pressable } from 'react-native'
import { Searchbar, Text } from 'react-native-paper';
import { API_BASE_URL } from '@env'

const Item = ({ item, navigation }) => (
  <Pressable onPress={() => navigation.navigate("Edit Product", { id: item.uniq_id })}>
    <View style={styles.item}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.brand}>{item.brand}</Text>
      <Text style={styles.price}>{item.list_price}</Text>
    </View>
  </Pressable>
);

export default function ManageProductSearch({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('')
  const onChangeQuery = query => setSearchQuery(query)

  const defaultPageNumber = 1
  const [page, setPage] = useState(defaultPageNumber)
  const limit = 10
  
  const [searchResults, setSearchResults] = useState([])

  const renderItem = ({ item }) => (
    <Item item={item} navigation={navigation} />
  )

  useEffect(() => {
    // clear search results when user makes changes to the searched value
    setSearchResults([])
    // set page number to default
    setPage(defaultPageNumber)
  }, [searchQuery])

  useEffect(() => {
    // fetch new page when page number changes
    searchAsync()
  }, [page])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSearchResults([])
      // set page number to default
      setPage(defaultPageNumber)
    })
    return () => unsubscribe()
  }, [navigation])

  const searchAsync = async () => {
    try {
      if (searchQuery != '') {
        const response = await fetch(`${API_BASE_URL}` + 'search_result?name=' + searchQuery + '&page=' + page + '&limit=' + limit);
        const json = await response.json();
        if (json.data.results.length != 0) {
          // concat the old and new array, otherwise the old page would get overwritten
          setSearchResults(searchResults => searchResults.concat(json.data.results))  
        } else {
          console.log('no more results on this page')
        }
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
              onEndReached={() => setPage(page+1)}
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