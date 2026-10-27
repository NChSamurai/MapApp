// app/index.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Map from '../components/Map';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Map />
      <SafeAreaView
        style={styles.hintWrapper}
        edges={['bottom']}
        pointerEvents="none"
      >
        <View style={styles.hint}>
          <Text style={styles.hintText}>
            Долгое нажатие на карте — добавить маркер
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hintWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  hint: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  hintText: {
    color: '#fff',
    fontSize: 13,
  },
});