import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { Bookmarker } from './bookmarker';
import * as BookmarkActions from './state/bookmark.actions';
import { of } from 'rxjs';
import { mockBookmarks } from './utils/mockdata';

describe('Bookmarker Component', () => {
  let fixture: ComponentFixture<Bookmarker>;
  let component: Bookmarker;
  let store: MockStore;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Bookmarker],
      providers: [
        provideMockStore({
          initialState: {
            bookmarksState: {
              bookmarks: mockBookmarks,
              loading: false,
              error: null
            }
          }
        }),
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Bookmarker);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadBookmarks on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(BookmarkActions.loadBookmarks());
  });

  it('should navigate to /add when goToAddBookmark is called', () => {
    component.goToAddBookmark();
    expect(router.navigate).toHaveBeenCalledWith(['/add']);
  });

  it('should navigate to /edit/:id when goToEditBookmark is called', () => {
    const id = '123';
    component.goToEditBookmark(id);
    expect(router.navigate).toHaveBeenCalledWith(['/edit', id]);
  });

  it('should filter bookmarks by text', (done) => {
    component.filterText = 'Angular';
    component.bookmarks$ = of(mockBookmarks);

    component.todayBookmarks$.subscribe(todayBookmarks => {
      expect(todayBookmarks.length).toBe(1);
      expect(todayBookmarks[0].title).toBe('Angular');
      done();
    });
  });

  it('should filter bookmarks when onFilterTextChange is called', (done) => {
    component.filterText = 'n';
    component.onFilterTextChange();

    component.todayBookmarks$.subscribe(today => {
      expect(today.length).toBe(1);
      expect(today[0].title).toBe('Angular');
    });

    component.yesterdayBookmarks$.subscribe(yesterday => {
      expect(yesterday.length).toBe(1);
      expect(yesterday[0].title).toBe('NPM');
    });

    component.olderBookmarks$.subscribe(older => {
      expect(older.length).toBe(0);
      done();
    });
  });

  it('should return true when filterText is empty or whitespace', () => {
    component.filterText = '';
    expect(component['filterByText']('Angular', 'https://angular.com')).toBeTrue();

    component.filterText = '    ';
    expect(component['filterByText']('Angular', 'https://angular.com')).toBeTrue();
  });
});
