import { createAction, props } from '@ngrx/store';
import { Bookmark } from '../models/bookmark.model';

// load Bookmarks
export const loadBookmarks = createAction('[Bookmark] Load Bookmarks');
export const loadBookmarksSuccess = createAction(
  '[Bookmark] Load Bookmarks Success',
  props<{ bookmarks: Bookmark[] }>()
);
export const loadBookmarksFailure = createAction(
  '[Bookmark] Load Bookmarks Failure',
  props<{ error: any }>()
);

// Add Bookmark
export const addBookmark = createAction(
  '[Bookmark] Add Bookmark',
  props<{ bookmark: Partial<Bookmark> }>()
);
export const addBookmarkSuccess = createAction(
  '[Bookmark] Add Bookmark Success',
  props<{ bookmark: Bookmark }>()
);
export const addBookmarkFailure = createAction(
  '[Bookmark] Add Bookmark Failure',
  props<{ error: any }>()
);

// Update bookmark
export const updateBookmark = createAction(
  '[Bookmark] Update Bookmark',
  props<{ id: string; changes: Partial<Bookmark> }>()
);
export const updateBookmarkSuccess = createAction(
  '[Bookmark] Update Bookmark Success',
  props<{ bookmark: Bookmark }>()
);
export const updateBookmarkFailure = createAction(
  '[Bookmark] Update Bookmark Failure',
  props<{ error: any }>()
);
