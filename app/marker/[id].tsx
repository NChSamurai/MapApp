// app/marker/[id].tsx
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useMarkers } from '../../context/MarkersContext';
import { showError } from '../../utils/showError';
import { ImageTile, EmptyImages } from '../../components/ImageList';
import NamePromptModal from '../../components/NamePromptModal';

export default function MarkerDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    getMarkerById,
    addImage,
    removeImage,
    renameMarker,
    removeMarker,
  } = useMarkers();
  const [isPicking, setIsPicking] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);

  const marker = id ? getMarkerById(id) : undefined;

  const handleGoBack = useCallback(() => {
    try {
      router.back();
    } catch (e) {
      showError('Не удалось вернуться к карте', e);
    }
  }, [router]);

  const handleAddImage = useCallback(async () => {
    if (!marker) return;
    setIsPicking(true);
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showError(
          'Нет доступа к галерее. Разрешите доступ в настройках приложения.',
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];
      if (!asset?.uri) {
        showError('Не удалось получить изображение');
        return;
      }

      addImage(marker.id, asset.uri);
    } catch (e) {
      showError('Не удалось добавить изображение', e);
    } finally {
      setIsPicking(false);
    }
  }, [marker, addImage]);

  const handleRemoveImage = useCallback(
    (imageId: string) => {
      if (!marker) return;
      try {
        removeImage(marker.id, imageId);
      } catch (e) {
        showError('Не удалось удалить изображение', e);
      }
    },
    [marker, removeImage],
  );

  const handleRenameSubmit = useCallback(
    (title: string) => {
      if (!marker) return;
      try {
        renameMarker(marker.id, title);
      } catch (e) {
        showError('Не удалось переименовать маркер', e);
      } finally {
        setIsRenameOpen(false);
      }
    },
    [marker, renameMarker],
  );

  const handleDeleteMarker = useCallback(() => {
    if (!marker) return;
    Alert.alert(
      'Удалить маркер?',
      `Маркер «${marker.title ?? 'без названия'}» и все его изображения будут удалены.`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            try {
              removeMarker(marker.id);
              router.back();
            } catch (e) {
              showError('Не удалось удалить маркер', e);
            }
          },
        },
      ],
    );
  }, [marker, removeMarker, router]);

  if (!marker) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundTitle}>Маркер не найден</Text>
        <Text style={styles.notFoundText}>
          Возможно, он был удалён или приложение было перезапущено.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <Text style={styles.buttonText}>Назад к карте</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={marker.images}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <View style={styles.infoCard}>
              <View style={styles.titleRow}>
                <Text style={styles.title} numberOfLines={2}>
                  {marker.title ?? 'Маркер без названия'}
                </Text>
                <TouchableOpacity
                  style={styles.renameButton}
                  onPress={() => setIsRenameOpen(true)}
                  accessibilityLabel="Переименовать маркер"
                >
                  <Text style={styles.renameButtonText}>✏️</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.coords}>
                Широта: {marker.latitude.toFixed(6)}
              </Text>
              <Text style={styles.coords}>
                Долгота: {marker.longitude.toFixed(6)}
              </Text>
              <Text style={styles.imagesCount}>
                Изображений: {marker.images.length}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.addButton, isPicking && styles.addButtonDisabled]}
              onPress={handleAddImage}
              disabled={isPicking}
              accessibilityLabel="Добавить изображение"
            >
              {isPicking ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.addButtonText}>+ Добавить изображение</Text>
              )}
            </TouchableOpacity>
          </>
        }
        ListEmptyComponent={<EmptyImages />}
        renderItem={({ item }) => (
          <ImageTile image={item} onRemove={handleRemoveImage} />
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteMarker}
            accessibilityLabel="Удалить маркер"
          >
            <Text style={styles.deleteButtonText}>Удалить маркер</Text>
          </TouchableOpacity>
        }
      />

      <NamePromptModal
        visible={isRenameOpen}
        title="Название маркера"
        initialValue={marker.title ?? ''}
        onSubmit={handleRenameSubmit}
        onCancel={() => setIsRenameOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notFoundText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  renameButton: {
    padding: 4,
  },
  renameButtonText: {
    fontSize: 18,
  },
  coords: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
  },
  imagesCount: {
    fontSize: 14,
    color: '#1976D2',
    marginTop: 8,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d32f2f',
    backgroundColor: '#fff',
  },
  deleteButtonText: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: '600',
  },
});