import { Bookmark } from '../models/bookmark.model';

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const yesterdayStr = yesterday.toISOString().substring(0, 10);

export const mockBookmarks: Bookmark[] = [
  { id: '1', title: 'Angular', url: 'https://angular.com', date: today.toISOString().substring(0, 10) },
  { id: '2', title: 'RxJs', url: 'https://rxjs.dev', date: yesterdayStr },
  { id: '3', title: 'NPM', url: 'https://www.npmjs.com/', date: yesterdayStr },
];
