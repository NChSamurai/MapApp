// components/ImageList.tsx
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MarkerImage } from '../types';

/**
 * Одна ячейка изображения с кнопкой удаления.
 * Используется внутри FlatList на экране деталей маркера.
 */
export function ImageTile({
  image,
  onRemove,
}: {
  image: MarkerImage;
  onRemove: (imageId: string) => void;
}) {
  return (
    <View style={styles.item}>
      <Image source={{ uri: image.uri }} style={styles.image} />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemove(image.id)}
        accessibilityLabel="Удалить изображение"
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Пустое состояние списка изображений.
 */
export function EmptyImages() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>Изображений пока нет</Text>
      <Text style={styles.emptyHint}>
        Нажмите «Добавить изображение», чтобы прикрепить фото к этому месту.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  item: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 22,
    fontWeight: 'bold',
  },
});