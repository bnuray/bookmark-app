import { Routes } from '@angular/router';
import { Bookmarker } from './bookmarker';
import { BookmarkForm } from './components/bookmark-form/bookmark-form';

export const routes: Routes = [
  { path: '', component: Bookmarker },
  { path: 'add', component: BookmarkForm },
  { path: 'edit/:id', component: BookmarkForm }
];