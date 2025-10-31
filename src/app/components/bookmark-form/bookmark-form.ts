import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as BookmarkActions from '../../state/bookmark.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, ofType } from '@ngrx/effects';
import { map, Observable, take } from 'rxjs';
import { Bookmark } from '../../models/bookmark.model';
import { ACTIONS, BOOKMARK_MESSAGES } from '../../utils/constants';

@Component({
  selector: 'create-boomark-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './bookmark-form.html',
  styleUrls: ['./bookmark-form.css']
})
export class BookmarkForm implements OnInit {
  newBookmark = { title: '', url: '' };
  bookmarks$: Observable<Bookmark[]>;
  isEdit: boolean = false;
  bookmarkId: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<{ bookmarksState: any }>,
    private snackBar: MatSnackBar,
    private actions$: Actions
  ) {
    this.bookmarks$ = store.pipe(select(state => state.bookmarksState.bookmarks));
  }

  ngOnInit(): void {
    this.bookmarkId = this.route.snapshot.paramMap.get('id');

    if (this.bookmarkId) {
      this.isEdit = true;

      this.store.select(state => state.bookmarksState.bookmarks)
        .pipe(take(1))
        .subscribe(bookmarks => {
          const bookmark = bookmarks.find((b: { id: string | null; }) => b.id === this.bookmarkId);
          if (bookmark) {
            this.newBookmark = {
              title: bookmark.title,
              url: bookmark.url
            };
          } else {
            this.snackBar.open(BOOKMARK_MESSAGES.BOOKMARK_NOT_FOUND, ACTIONS.CLOSE, { duration: 3000 });
            this.router.navigate(['/']);
          }
        });

    } else {
      this.isEdit = false;
    }
  }

  goBackToList() {
    this.router.navigate(['/']);
  }

  private bookmarkExists(url: string, excludeId?: string): Observable<boolean> {
    return this.store.select(state => state.bookmarksState.bookmarks).pipe(
      take(1),
      map((bookmarks: any[]) =>
        bookmarks.some(b => b.url === url && b.id !== excludeId)
      )
    );
  }

  saveBookmark() {
    if (!this.newBookmark.title || !this.newBookmark.url) {
      this.snackBar.open(BOOKMARK_MESSAGES.FILL_FIELDS, ACTIONS.CLOSE, { duration: 3000 });
      return;
    }

    if (!this.isValidUrl(this.newBookmark.url)) {
      this.snackBar.open(BOOKMARK_MESSAGES.INVALID_URL, ACTIONS.CLOSE, { duration: 3000 });
      return;
    }

    if (this.isEdit && this.bookmarkId) {
      this.editBookmark();
    } else {
      this.addBookmark();
    }
  }

  private editBookmark() {
    this.bookmarkExists(this.newBookmark.url, this.bookmarkId!).subscribe(exists => {
      if (exists) {
        this.snackBar.open(BOOKMARK_MESSAGES.ALREADY_BOOKMARKED, ACTIONS.CLOSE, { duration: 3000 });
        return;
      }

      this.store.dispatch(
        BookmarkActions.updateBookmark({ id: this.bookmarkId!, changes: this.newBookmark })
      );

      this.actions$.pipe(ofType(BookmarkActions.updateBookmarkSuccess), take(1)).subscribe(() => {
        this.snackBar.open(BOOKMARK_MESSAGES.BOOKMARK_UPDATED, ACTIONS.CLOSE, { duration: 3000 });
        this.router.navigate(['/']);
      });

      this.actions$.pipe(ofType(BookmarkActions.updateBookmarkFailure), take(1)).subscribe(() => {
        this.snackBar.open(BOOKMARK_MESSAGES.BOOKMARK_FAILED, ACTIONS.CLOSE, { duration: 3000 });
      });
    });
  }

  private addBookmark() {
    this.store.select(state => state.bookmarksState.bookmarks).pipe(take(1)).subscribe(bookmarks => {
      const exists = bookmarks.some((b: { url: string; }) => b.url === this.newBookmark.url);
      if (exists) {
        this.snackBar.open(BOOKMARK_MESSAGES.ALREADY_BOOKMARKED, ACTIONS.CLOSE, { duration: 3000 });
        return;
      }

      this.store.dispatch(BookmarkActions.addBookmark({ bookmark: this.newBookmark }));

      this.actions$.pipe(ofType(BookmarkActions.addBookmarkSuccess), take(1)).subscribe(() => {
        this.snackBar.open(BOOKMARK_MESSAGES.BOOKMARK_CREATED, ACTIONS.CLOSE, { duration: 3000 });
        this.newBookmark = { title: '', url: '' };
        this.router.navigate(['/']);
      });

      this.actions$.pipe(ofType(BookmarkActions.addBookmarkFailure), take(1)).subscribe(() => {
        this.snackBar.open(BOOKMARK_MESSAGES.BOOKMARK_FAILED, ACTIONS.CLOSE, { duration: 3000 });
      });
    });
  }

  isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }
}
