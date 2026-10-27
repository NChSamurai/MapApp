// context/MarkersContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  ReactNode,
} from 'react';
import { MarkerData, MarkerImage } from '../types';

/** Утилита для генерации простых уникальных id без зависимостей. */
const generateId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** Действия редьюсера. */
type Action =
  | {
      type: 'ADD_MARKER';
      payload: { latitude: number; longitude: number; title?: string };
    }
  | { type: 'REMOVE_MARKER'; payload: { id: string } }
  | { type: 'ADD_IMAGE'; payload: { markerId: string; uri: string } }
  | { type: 'REMOVE_IMAGE'; payload: { markerId: string; imageId: string } }
  | { type: 'RENAME_MARKER'; payload: { id: string; title: string } };

interface State {
  markers: MarkerData[];
}

const initialState: State = { markers: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_MARKER': {
      const newMarker: MarkerData = {
        id: generateId(),
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        title: action.payload.title,
        images: [],
        createdAt: Date.now(),
      };
      return { ...state, markers: [...state.markers, newMarker] };
    }
    case 'REMOVE_MARKER':
      return {
        ...state,
        markers: state.markers.filter((m) => m.id !== action.payload.id),
      };
    case 'ADD_IMAGE': {
      const newImage: MarkerImage = {
        id: generateId(),
        uri: action.payload.uri,
        createdAt: Date.now(),
      };
      return {
        ...state,
        markers: state.markers.map((m) =>
          m.id === action.payload.markerId
            ? { ...m, images: [...m.images, newImage] }
            : m,
        ),
      };
    }
    case 'REMOVE_IMAGE':
      return {
        ...state,
        markers: state.markers.map((m) =>
          m.id === action.payload.markerId
            ? {
                ...m,
                images: m.images.filter(
                  (img) => img.id !== action.payload.imageId,
                ),
              }
            : m,
        ),
      }
    case 'RENAME_MARKER':
      return {
        ...state,
        markers: state.markers.map((m) =>
          m.id === action.payload.id
            ? { ...m, title: action.payload.title }
            : m,
        ),
      };
    default:
      return state;
  }
}

/** Публичный интерфейс контекста. */
interface MarkersContextValue {
  markers: MarkerData[];
  addMarker: (latitude: number, longitude: number, title?: string) => void;
  removeMarker: (id: string) => void;
  addImage: (markerId: string, uri: string) => void;
  removeImage: (markerId: string, imageId: string) => void;
  renameMarker: (id: string, title: string) => void;
  getMarkerById: (id: string) => MarkerData | undefined;
}

const MarkersContext = createContext<MarkersContextValue | undefined>(
  undefined,
);

export function MarkersProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // useMemo — чтобы методы не пересоздавались на каждый ре-рендер
  const value = useMemo<MarkersContextValue>(() => {
    return {
      markers: state.markers,
      addMarker: (latitude, longitude, title) =>
        dispatch({ type: 'ADD_MARKER', payload: { latitude, longitude, title } }),
      removeMarker: (id) =>
        dispatch({ type: 'REMOVE_MARKER', payload: { id } }),
      addImage: (markerId, uri) =>
        dispatch({ type: 'ADD_IMAGE', payload: { markerId, uri } }),
      removeImage: (markerId, imageId) =>
        dispatch({ type: 'REMOVE_IMAGE', payload: { markerId, imageId } }),
      renameMarker: (id, title) =>
        dispatch({ type: 'RENAME_MARKER', payload: { id, title } }),
      getMarkerById: (id) => state.markers.find((m) => m.id === id),
    };
  }, [state.markers]);

  return (
    <MarkersContext.Provider value={value}>
      {children}
    </MarkersContext.Provider>
  );
}

/** Хук для доступа к контексту. Бросает ошибку, если провайдер забыт. */
export function useMarkers(): MarkersContextValue {
  const ctx = useContext(MarkersContext);
  if (!ctx) {
    throw new Error('useMarkers must be used within a MarkersProvider');
  }
  return ctx;
}