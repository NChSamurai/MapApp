// utils/showError.ts
import { Alert } from 'react-native';

/**
 * Показывает пользователю сообщение об ошибке в едином формате.
 * Используется во всех экранах, чтобы не дублировать Alert.alert.
 */
export function showError(
  message: string,
  error?: unknown,
  title = 'Ошибка',
): void {
  let details = '';
  if (error instanceof Error) {
    details = error.message;
  } else if (typeof error === 'string') {
    details = error;
  }

  Alert.alert(title, details ? `${message}\n\n${details}` : message, [
    { text: 'OK' },
  ]);
}