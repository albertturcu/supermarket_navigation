import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, TouchableWithoutFeedback, View, Keyboard} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import Search from './Components/Search';

export default function App() {
  return (
    <PaperProvider>
      <Search />
      <StatusBar style="auto" />
    </PaperProvider>
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
