import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';

import { AuthProvider, AuthContext } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import RidesScreen from './screens/RidesScreen';
import ClientsScreen from './screens/ClientsScreen';
import KartsScreen from './screens/KartsScreen';
import StaffScreen from './screens/StaffScreen';
import UserBookScreen from './screens/UserBookScreen';
import MaintenanceScreen from './screens/MaintenanceScreen';
import MaintenanceTypesScreen from './screens/MaintenanceTypesScreen';
import PartsScreen from './screens/PartsScreen';
import TeamsScreen from './screens/TeamsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Rides') iconName = 'car';
          else if (route.name === 'Clients') iconName = 'people';
          else if (route.name === 'Karts') iconName = 'speedometer';
          else if (route.name === 'Staff') iconName = 'person';
          else if (route.name === 'Cabinet') iconName = 'calendar';
          else if (route.name === 'Maintenance') iconName = 'construct';
          else if (route.name === 'MaintenanceTypes') iconName = 'list';
          else if (route.name === 'Parts') iconName = 'cube';
          else if (route.name === 'Teams') iconName = 'people-circle';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerRight: () => (
          <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
            <Text style={{ color: 'red', fontWeight: 'bold' }}>Выйти</Text>
          </TouchableOpacity>
        ),
      })}
    >
      {(user?.role === 'admin' || user?.role === 'manager') && (
        <Tab.Screen name="Rides" component={RidesScreen} options={{ title: 'Заезды' }} />
      )}

      {(user?.role === 'admin' || user?.role === 'manager') && (
        <Tab.Screen name="Teams" component={TeamsScreen} options={{ title: 'Команды' }} />
      )}

      {(user?.role === 'admin' || user?.role === 'manager') && (
        <Tab.Screen name="Clients" component={ClientsScreen} options={{ title: 'Клиенты' }} />
      )}

      {(user?.role === 'admin' || user?.role === 'mechanic') && (
        <Tab.Screen name="Karts" component={KartsScreen} options={{ title: 'Карты' }} />
      )}

      {(user?.role === 'admin' || user?.role === 'mechanic') && (
        <Tab.Screen name="Maintenance" component={MaintenanceScreen} options={{ title: 'ТО' }} />
      )}
      {(user?.role === 'admin' || user?.role === 'mechanic') && (
        <Tab.Screen name="MaintenanceTypes" component={MaintenanceTypesScreen} options={{ title: 'Виды ТО' }} />
      )}
      {(user?.role === 'admin' || user?.role === 'mechanic') && (
        <Tab.Screen name="Parts" component={PartsScreen} options={{ title: 'Запчасти' }} />
      )}

      {user?.role === 'admin' && (
        <Tab.Screen name="Staff" component={StaffScreen} options={{ title: 'Сотрудники' }} />
      )}

      {user?.role === 'user' && (
        <Tab.Screen name="Cabinet" component={UserBookScreen} options={{ title: 'Запись' }} />
      )}
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { token, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Загрузка...</Text></View>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Регистрация' }} />
          </>
        ) : (
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}