// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MarkersProvider } from '../context/MarkersContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <MarkersProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#1976D2' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen
            name="index"
            options={{ title: 'Карта', headerShown: false }}
          />
          <Stack.Screen
            name="marker/[id]"
            options={{ title: 'Детали маркера' }}
          />
        </Stack>
        <StatusBar style="light" />
      </MarkersProvider>
    </SafeAreaProvider>
  );
}