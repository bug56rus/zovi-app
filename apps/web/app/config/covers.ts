// apps/web/app/config/covers.ts

export type CoverCategory = {
  id: string;
  label: string;
  emoji: string;
  folder: string;
  count: number;
};

export const COVER_CATEGORIES: CoverCategory[] = [
  {
    id: 'business',
    label: 'Деловые',
    emoji: '💼',
    folder: 'business',
    count: 3, // сколько картинок Business-001, -002, -003
  },
  {
    id: 'children',
    label: 'Детские',
    emoji: '🎈',
    folder: 'children',
    count: 3,
  },
  {
    id: 'party',
    label: 'Вечеринки',
    emoji: '🎉',
    folder: 'party',
    count: 3,
  },
  {
    id: 'romantic',
    label: 'Романтика',
    emoji: '💕',
    folder: 'romantic',
    count: 3,
  },
];

// Генератор пути к картинке: getCoverPath('business', 1) -> '/covers/business/Business-001.jpg'
export function getCoverPath(categoryId: string, index: number): string {
  const cat = COVER_CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return '';
  const num = String(index).padStart(3, '0'); // 1 -> '001'
  const fileName = `${cat.folder.charAt(0).toUpperCase() + cat.folder.slice(1)}-${num}.jpg`;
  return `/covers/${cat.folder}/${fileName}`;
}

// Получить все пути для категории
export function getCategoryCovers(categoryId: string): string[] {
  const cat = COVER_CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return [];
  return Array.from({ length: cat.count }, (_, i) => getCoverPath(categoryId, i + 1));
}