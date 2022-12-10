import { StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screens/Home';
import ManageStore from './screens/ManageStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName

              if (route.name === 'Home') {
                iconName = focused
                  ? 'store-search'
                  : 'store-search-outline'
              } else if (route.name === 'Manage Store') {
                iconName = focused
                  ? 'store-edit'
                  : 'store-edit-outline'
              }
              return <Icon name={iconName} size={size} color={color} />
            }
          })}>
          <Tab.Screen
            name='Home'
            component={Home}
            tabBarIcon='store-search' />
          <Tab.Screen
            name='Manage Store'
            component={ManageStore} />
        </Tab.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
