# MapApp

Мобильное приложение на React Native + Expo, позволяющее ставить маркеры на карте,
привязывать к ним изображения из галереи и управлять ими.

# Стек

- **Expo SDK 58** + **React Native 0.88**
- **TypeScript** (strict)
- **expo-router** — файловая маршрутизация
- **react-native-maps** — карта и маркеры
- **expo-image-picker** — выбор изображений из галереи
- **React Context + useReducer** — состояние приложения

# СТРУКТУРА
``` bash
my-map-app/
├── app/                    # Маршруты expo-router
│   ├── _layout.tsx         # Корневой layout: провайдеры + Stack
│   ├── index.tsx           # Экран карты
│   └── marker/
│       └── [id].tsx        # Экран деталей маркера
├── components/
│   ├── Map.tsx             # Карта + маркеры + модалка создания
│   ├── ImageList.tsx       # Ячейка изображения и пустое состояние
│   └── NamePromptModal.tsx # Модалка ввода названия
├── context/
│   └── MarkersContext.tsx  # Глобальное состояние (Context + useReducer)
├── utils/
│   └── showError.ts        # Единый показ ошибок через Alert
├── types.ts                # Общие TypeScript-интерфейсы
├── app.json
├── package.json
└── tsconfig.json
```

# РЕШЕНИЯ

Состояние: React Context + useReducer
Маркеры и изображения нужны на двух экранах (карта и детали), поэтому
состояние вынесено в контекст. useReducer выбран вместо нескольких
useState, потому что у нас 5 типов действий (ADD_MARKER,
REMOVE_MARKER, ADD_IMAGE, REMOVE_IMAGE, RENAME_MARKER), и
логика обновления вложенная (маркер → массив изображений). Редьюсер
держит всю логику в одном месте и легко расширяется.

Альтернативы (Zustand, Redux) не использовались, чтобы не добавлять
зависимости в учебный проект.

Типизация навигации
RootStackParamList в types.ts описывает параметры маршрутов.
useLocalSearchParams<{ id: string }>() даёт типизированный id из URL.

Обработка ошибок
Разрешение на галерею: requestMediaLibraryPermissionsAsync() →
если granted === false, показываем понятное сообщение и не открываем галерею.

Отмена выбора: result.canceled — это не ошибка, выходим молча.

«Маркер не найден»: если контекст перезапущен, а id остался в истории
навигации, показываем заглушку с кнопкой «Назад к карте» вместо краша.

Единый формат ошибок: utils/showError.ts — обёртка над Alert.alert,
принимает unknown (как в catch) и аккуратно извлекает сообщение.

Производительность
FlatList с numColumns={2} для сетки изображений (виртуализация).

useCallback для обработчиков, useMemo для значения контекста —
чтобы избежать лишних ререндеров.

Один FlatList на экране деталей (header/footer через
ListHeaderComponent/ListFooterComponent), а не ScrollView с
вложенным FlatList — это убирает предупреждение
VirtualizedLists should never be nested....

////////////////////ОГРАНИЧЕНИЯ//////////////////////

Нет персистентности: маркеры и изображения живут только в памяти
сессии. После перезапуска приложения данные теряются. Для сохранения
нужно добавить @react-native-async-storage/async-storage или SQLite.

Ошибки загрузки карты (нет сети, неверный API-ключ) не перехватываются
на уровне JS — пользователь увидит пустую карту. onMapReady и
onMapLoaded логируются в консоль.

Веб-версия не работает из-за react-native-maps (нативно-зависимая
библиотека). Приложение рассчитано на iOS/Android.

# Установка и запуск

## Требования

- Node.js LTS (проверено на v24)
- npm
- Приложение **Expo Go** на телефоне (iOS/Android) — для тестирования

## Шаги

```bash
# 1. Клонировать репозиторий
git clone <https://github.com/NChSamurai/MapApp.git>
cd my-map-app

# 2. Установить зависимости
npm install

# 3. Запустить dev-сервер
npx expo start


