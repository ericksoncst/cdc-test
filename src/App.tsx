import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import AppNavigator from './navigation';


const App: React.FC = () => {
  return (
    <SafeAreaProvider style={{flex: 1}}>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right', 'top']}>
        <AppNavigator />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;