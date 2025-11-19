import { Category } from '../types/category';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Vinyl and CDs',
    slug: 'vinyl-cd',
    description: 'Pre-loved vinyl records and CDs from various artistes',
    defaultAttributes: ['Condition', 'Artist', 'Genre'],
  },
  {
    id: '2',
    name: 'Audio Equipment',
    slug: 'audio-equipment',
    description: 'Vintage audio equipment',
    defaultAttributes: ['Condition', 'Brand', 'Model'],
  },
];