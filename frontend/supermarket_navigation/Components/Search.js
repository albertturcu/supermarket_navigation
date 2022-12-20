import { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, SafeAreaView, Pressable } from 'react-native'
import { Searchbar, Text } from 'react-native-paper'
import StoreServices from '../services/storeServices'

const api = new StoreServices

const Item = ({ item, navigation, navigateTo }) => (
  <Pressable onPress={() => navigation.navigate(navigateTo, { id: item.uniq_id })}>
    <View style={styles.item}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.brand}>{item.brand}</Text>
      <Text style={styles.price}>{item.list_price}</Text>
    </View>
  </Pressable>
)

export default function Search({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('')
  const onChangeQuery = query => setSearchQuery(query)

  const defaultPageNumber = 1
  const [page, setPage] = useState(defaultPageNumber)
  const limit = 15
  
  const [searchResults, setSearchResults] = useState([])

  const renderItem = ({ item }) => (
    <Item item={item} navigation={navigation} navigateTo={route.params.navigateTo} />
  )

  const resetQuery = () => {
    setSearchResults([])
    setPage(defaultPageNumber)
  }

  useEffect(() => {
    // clear search results when user makes changes to the searched value
    resetQuery()
  }, [searchQuery])

  useEffect(() => {
    // fetch new page when page number changes
    search()
  }, [page])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetQuery()
    })
    return () => unsubscribe()
  }, [navigation])


  const search = () => {
      if (searchQuery != '') {
        api.searchProducts(searchQuery, page, limit)
          .then((response) => {
            setSearchResults(oldSearchResults => oldSearchResults.concat(response))
          })
          .catch((error) => error === "No more results on this page!" ? console.log(error) : console.error(error))
      } else {
        setSearchResults([])
      }
  }

  return (
      <SafeAreaView>
        <View>
          <Searchbar
            placeholder='Search'
            onChangeText={onChangeQuery}
            value={searchQuery}
            onSubmitEditing={() => search()}
            onIconPress={() => search()}
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