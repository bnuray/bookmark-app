import { createReducer, on } from '@ngrx/store';
import * as BookmarkActions from './bookmark.actions';
import { Bookmark } from '../models/bookmark.model';

export interface BookmarkState {
  bookmarks: Bookmark[];
  loading: boolean;
  error: any;
}

export const initialState: BookmarkState = {
  bookmarks: [],
  loading: false,
  error: null,
};

export const bookmarkReducer = createReducer(
  initialState,
  // Handle load bookmark
  on(BookmarkActions.loadBookmarks, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(BookmarkActions.loadBookmarksSuccess, (state, { bookmarks }) => ({
    ...state,
    loading: false,
    bookmarks,
  })),
  on(BookmarkActions.loadBookmarksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Handle add bookmark
  on(BookmarkActions.addBookmarkSuccess, (state, { bookmark }) => ({
    ...state,
    bookmarks: [...state.bookmarks, bookmark],
    error: null
  })),
  on(BookmarkActions.addBookmarkFailure, (state, { error }) => ({
    ...state,
    error
  })),

  // Handle update bookmark
  on(BookmarkActions.updateBookmarkSuccess, (state, { bookmark }) => ({
    ...state,
    bookmarks: state.bookmarks.map(b =>
      b.id === bookmark.id ? { ...b, ...bookmark } : b
    ),
    error: null
  })),
  on(BookmarkActions.updateBookmarkFailure, (state, { error }) => ({
    ...state,
    error
  }))

);


