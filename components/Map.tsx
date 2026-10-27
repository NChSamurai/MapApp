// components/Map.tsx
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, {
  Marker,
  LongPressEvent,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useMarkers } from '../context/MarkersContext';
import { showError } from '../utils/showError';
import NamePromptModal from './NamePromptModal';

interface PendingCoords {
  latitude: number;
  longitude: number;
}

export default function Map() {
  const mapRef = useRef<MapView>(null);
  const router = useRouter();
  const { markers, addMarker } = useMarkers();

  // Координаты «ожидающего» маркера, для которого сейчас вводится название.
  // null — модалка закрыта.
  const [pendingCoords, setPendingCoords] = useState<PendingCoords | null>(null);

  // Долгое нажатие по карте → запоминаем координаты и открываем модалку ввода названия
  const handleLongPress = useCallback((event: LongPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setPendingCoords({ latitude, longitude });
  }, []);

  // Подтвердили название (или оставили пустым) — создаём маркер
  const handleNameSubmit = useCallback(
    (title: string) => {
      if (!pendingCoords) return;
      try {
        addMarker(
          pendingCoords.latitude,
          pendingCoords.longitude,
          title || undefined,
        );
      } catch (e) {
        showError('Не удалось добавить маркер', e);
      } finally {
        setPendingCoords(null);
      }
    },
    [pendingCoords, addMarker],
  );

  // Отменили ввод — маркер не создаём
  const handleNameCancel = useCallback(() => {
    setPendingCoords(null);
  }, []);

  // Тап по маркеру → переход на экран деталей
  const handleMarkerPress = useCallback(
    (id: string) => {
      try {
        router.push(`/marker/${id}`);
      } catch (e) {
        showError('Не удалось открыть маркер', e);
      }
    },
    [router],
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 55.751244,
          longitude: 37.618423,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onLongPress={handleLongPress}
        onMapReady={() => console.log('[Map] onMapReady')}
        onMapLoaded={() => console.log('[Map] onMapLoaded')}
        showsUserLocation
        showsMyLocationButton
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title ?? 'Маркер'}
            description={
              marker.images.length > 0
                ? `Изображений: ${marker.images.length}`
                : 'Нет изображений'
            }
            onPress={() => handleMarkerPress(marker.id)}
          />
        ))}
      </MapView>

      <NamePromptModal
        visible={pendingCoords !== null}
        title="Название маркера"
        onSubmit={handleNameSubmit}
        onCancel={handleNameCancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});