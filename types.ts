// types.ts

/**
 * Изображение, привязанное к маркеру.
 * id генерируется на клиенте (см. utils/generateId или inline),
 * uri — локальный/удалённый путь к файлу.
 */
export interface MarkerImage {
  id: string;
  uri: string;
  createdAt: number; // timestamp, чтобы можно было сортировать по дате добавления
}

/**
 * Маркер на карте.
 * Координаты — стандартные для react-native-maps.
 */
export interface MarkerData {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  images: MarkerImage[];
  createdAt: number;
}

/**
 * Параметры навигации для expo-router.
 * Ключ — имя маршрута, значение — параметры, которые он принимает.
 *
 * Маршрут "marker/[id]" принимает { id: string }.
 * Остальные экраны (index) параметров не требуют.
 */
export type RootStackParamList = {
  index: undefined;
  'marker/[id]': { id: string };
};