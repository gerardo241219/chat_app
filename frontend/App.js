import { SafeAreaView } from 'react-native';
import MainStack from './routes/MainStack';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MainStack />
    </SafeAreaView>
  )
}

export default App