import { format, parseISO, startOfDay, subDays } from 'date-fns';
import { ja } from 'date-fns/locale';

/**
 * 今日の日付を YYYY-MM-DD 形式で取得
 */
export function getToday(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * 日付を表示用にフォーマット
 */
export function formatDate(date: string | Date, formatStr: string = 'M/d'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr, { locale: ja });
}

/**
 * 日付を曜日付きでフォーマット
 */
export function formatDateWithDay(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'M/d (E)', { locale: ja });
}

/**
 * 過去N日間の日付配列を取得
 */
export function getPastDays(days: number): string[] {
  const today = startOfDay(new Date());
  return Array.from({ length: days }, (_, i) =>
    format(subDays(today, days - 1 - i), 'yyyy-MM-dd')
  );
}

/**
 * ISO日付文字列かどうかチェック
 */
export function isValidDateString(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = parseISO(dateStr);
  return !isNaN(date.getTime());
}
