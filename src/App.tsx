import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import AppNavigator from './navigation';
import { ClientProvider } from './contexts/ClientContext';
import { AuthProvider } from './contexts/AuthContext';


const App: React.FC = () => {
  return (
    <SafeAreaProvider style={{flex: 1}}>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right', 'top']}>
        <AuthProvider>
          <ClientProvider>
            <AppNavigator />
          </ClientProvider>
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;