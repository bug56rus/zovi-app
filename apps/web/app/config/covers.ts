export type CoverCategory = {
  id: string;
  label: string;
  emoji: string;
  folder: string;
  prefix: string;
  count: number;
};

export const COVER_CATEGORIES: CoverCategory[] = [
  { id: 'party', label: 'Вечеринки', emoji: '🎉', folder: 'party', prefix: 'Party', count: 3 },
  { id: 'children', label: 'Детские', emoji: '🎈', folder: 'children', prefix: 'Children', count: 3 },
  { id: 'newyear', label: 'Новый год', emoji: '🎄', folder: 'newyear', prefix: 'NewYear', count: 3 },
  { id: 'business', label: 'Деловые', emoji: '💼', folder: 'business', prefix: 'Business', count: 3 },
  { id: 'romantic', label: 'Романтика', emoji: '💕', folder: 'romantic', prefix: 'Romantic', count: 3 },
];

export function getCoverPath(categoryId: string, index: number): string {
  const cat = COVER_CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return '';
  const num = String(index).padStart(3, '0');
  return `/covers/${cat.folder}/${cat.prefix}-${num}.jpg`;
}

export function getCategoryCovers(categoryId: string): string[] {
  const cat = COVER_CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return [];
  return Array.from({ length: cat.count }, (_, i) => getCoverPath(categoryId, i + 1));
}