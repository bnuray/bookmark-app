import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as BookmarkActions from './state/bookmark.actions';
import { map, Observable } from 'rxjs';
import { Bookmark } from './models/bookmark.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DATES, EMPTY_MESSAGES } from './utils/constants';

@Component({
  selector: 'app-bookmarker',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './bookmarker.html',
  styleUrls: ['./bookmarker.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class Bookmarker implements OnInit {
  bookmarks$: Observable<Bookmark[]>;
  loading$: Observable<boolean>;

  todayBookmarks$: Observable<Bookmark[]>;
  yesterdayBookmarks$: Observable<Bookmark[]>;
  olderBookmarks$: Observable<Bookmark[]>;

  sections: {
    title: string;
    bookmarks$: Observable<Bookmark[]>;
    empty: string;
  }[] = [];

  filterText: string = '';

  constructor(private router: Router, private store: Store<{ bookmarksState: any }>) {
    this.bookmarks$ = this.store.pipe(select(state => state.bookmarksState.bookmarks));
    this.loading$ = this.store.pipe(select(state => state.bookmarksState.loading));

    this.todayBookmarks$ = this.bookmarks$.pipe(map(bookmarks => this.filterBookmarks(bookmarks, 'today')));
    this.yesterdayBookmarks$ = this.bookmarks$.pipe(map(bookmarks => this.filterBookmarks(bookmarks, 'yesterday')));
    this.olderBookmarks$ = this.bookmarks$.pipe(map(bookmarks => this.filterBookmarks(bookmarks, 'older')));
  }

  ngOnInit() {
    this.store.dispatch(BookmarkActions.loadBookmarks());
    this.reloadSections();
  }

  private reloadSections() {
    this.sections = [
      {
        title: DATES.TODAY,
        bookmarks$: this.todayBookmarks$,
        empty: EMPTY_MESSAGES.TODAY
      },
      {
        title: DATES.YESTERDAY,
        bookmarks$: this.yesterdayBookmarks$,
        empty: EMPTY_MESSAGES.YESTERDAY
      },
      {
        title: DATES.OLDER,
        bookmarks$: this.olderBookmarks$,
        empty: EMPTY_MESSAGES.OLDER
      }
    ];
  }

  onFilterTextChange() {
    this.todayBookmarks$ = this.bookmarks$.pipe(map(bookmarks => this.filterBookmarks(bookmarks, DATES.TODAY)));
    this.yesterdayBookmarks$ = this.bookmarks$.pipe(map(bookmarks => this.filterBookmarks(bookmarks, DATES.YESTERDAY)));
    this.olderBookmarks$ = this.bookmarks$.pipe(map(bookmarks => this.filterBookmarks(bookmarks, DATES.OLDER)));
    this.reloadSections();
  }

  private filterBookmarks(bookmarks: Bookmark[], filter: string): Bookmark[] {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    return bookmarks
      .filter(b => {
        const dateMatches = this.filterByDate(b.date, filter, today, yesterday);
        const textMatches = this.filterByText(b.title, b.url);
        return dateMatches && textMatches;
      });
  }

  private filterByDate(bookmarkDate: string, filter: string, today: Date, yesterday: Date): boolean {
    switch (filter) {
      case DATES.TODAY:
        return this.isToday(bookmarkDate, today);
      case DATES.YESTERDAY:
        return this.isYesterday(bookmarkDate, yesterday);
      case DATES.OLDER:
        return this.isOlder(bookmarkDate, yesterday);
      default:
        return true;
    }
  }

  private filterByText(title: string, url: string): boolean {
    if (!this.filterText.trim()) return true;
    const searchTerm = this.filterText.toLowerCase();
    return title.toLowerCase().includes(searchTerm) || url.toLowerCase().includes(searchTerm);
  }

  private isToday(bookmarkDate: string, today: Date): boolean {
    return bookmarkDate.substring(0, 10) === today.toISOString().substring(0, 10);
  }

  private isYesterday(bookmarkDate: string, yesterday: Date): boolean {
    return bookmarkDate.substring(0, 10) === yesterday.toISOString().substring(0, 10);
  }

  private isOlder(bookmarkDate: string, yesterday: Date): boolean {
    return bookmarkDate.substring(0, 10) < yesterday.toISOString().substring(0, 10);
  }

  goToAddBookmark() {
    this.router.navigate(['/add']);
  }

  goToEditBookmark(bookmarkId: string) {
    this.router.navigate(['/edit', bookmarkId]);
  }
}
