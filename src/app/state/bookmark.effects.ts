import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import * as BookmarkActions from './bookmark.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { Bookmark } from '../models/bookmark.model';

@Injectable()
export class BookmarkEffects {
  constructor(private http: HttpClient) { }
  private actions$ = inject(Actions);

  loadBookmarks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookmarkActions.loadBookmarks),
      mergeMap(() =>
        this.http.get<any[]>('http://localhost:3000/bookmarks').pipe(
          map(bookmarks => BookmarkActions.loadBookmarksSuccess({ bookmarks })),
          catchError(error => of(BookmarkActions.loadBookmarksFailure({ error })))
        )
      )
    )
  );

  addBookmark$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookmarkActions.addBookmark),
      mergeMap(action =>
        this.http.post<Bookmark>('http://localhost:3000/bookmarks', {
          ...action.bookmark,
          date: new Date().toISOString().substring(0, 10)
        }).pipe(
          map(bookmark => BookmarkActions.addBookmarkSuccess({ bookmark })),
          catchError(error => of(BookmarkActions.addBookmarkFailure({ error })))
        )
      )
    )
  );

  updateBookmark$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookmarkActions.updateBookmark),
      mergeMap(action =>
        this.http.patch<Bookmark>(
          `http://localhost:3000/bookmarks/${action.id}`,
          {
            ...action.changes,
            date: new Date().toISOString().substring(0, 10)
          }
        ).pipe(
          map(bookmark => BookmarkActions.updateBookmarkSuccess({ bookmark })),
          catchError(error => of(BookmarkActions.updateBookmarkFailure({ error })))
        )
      )
    )
  );
}

