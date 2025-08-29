import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClientsPanel from '../screens/App/ClientsPanelScreen';
import EditClientScreen from '../screens/App/EditClientScreen';
import CreateClientScreen from '../screens/App/CreateClientScreen';

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
      <Stack.Screen 
        name="EditClient" 
        component={EditClientScreen}
      />

      <Stack.Screen 
        name="CreateClient" 
        component={CreateClientScreen}
      />
    </Stack.Navigator>
  );
};

export default AppStack;