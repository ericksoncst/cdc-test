import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClientsPanel from '../screens/App/ClientsPanel';

const Stack = createNativeStackNavigator();

const AppStack: React.FC = () => {
  return (
    <Stack.Navigator 
      initialRouteName="ClientsPanel"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen 
        name="ClientsPanel" 
        component={ClientsPanel}
      />
    </Stack.Navigator>
  );
};

export default AppStack;