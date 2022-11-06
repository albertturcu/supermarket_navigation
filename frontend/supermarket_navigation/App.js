import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, TouchableWithoutFeedback, View, Keyboard} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import Search from './Components/Search';
import PathView from './Components/PathView';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
        <Stack.Navigator>
          <Stack.Screen 
            name="Search"
            component={Search} />
          <Stack.Screen 
            name="PathView"
            component={PathView} />
        </Stack.Navigator>
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
