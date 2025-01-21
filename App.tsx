import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoryDetailScreen from './screens/components/categories/CategoryDetailScreen';
import NewsDetailScreen from './screens/components/news/NewsDetailScreen';
import BottomTabNavigator from 'screens/components/utils/BottomTabNavigator';
import LoginScreen from 'screens/components/auth/LoginScreen';
import notificationsScreen from 'screens/components/notifications/notificationsScreen';
import { usePushNotifications } from 'usePushNotifications';
import IndicatorScreen from 'screens/components/utils/IdicatorScreen';

export type RootStackParamList = {
  Indicator: undefined;
  Login: undefined;
  Main: undefined;
  Notification: undefined;
  CategoryDetail: { categoryName: string }; 
  NewsDetail: { newsItem: { id: number; title: string; description: string; image: string } }; 

};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const { expoPushToken, notification } = usePushNotifications();
  const data = JSON.stringify(notification, undefined, 2);
  if (expoPushToken) {
    console.log(expoPushToken.data, 'TOKEN');
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Indicator">
        <Stack.Screen name="Indicator" component={IndicatorScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} options={{ title: 'Detalle de Categoría' }} />
        <Stack.Screen name="NewsDetail" component={NewsDetailScreen} options={{ title: 'Detalle de Noticia' }} />
        <Stack.Screen name="Notification" component={notificationsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
