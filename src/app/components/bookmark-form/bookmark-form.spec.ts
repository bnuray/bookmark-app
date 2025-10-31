import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Actions } from '@ngrx/effects';
import { ReplaySubject, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { BookmarkForm } from './bookmark-form';
import * as BookmarkActions from '../../state/bookmark.actions';
import { mockBookmarks } from '../../utils/mockdata';

describe('BookmarkForm', () => {
  let component: BookmarkForm;
  let fixture: ComponentFixture<BookmarkForm>;
  let store: MockStore;
  let router: Router;
  let snackBar: MatSnackBar;
  let actions$: ReplaySubject<any>;

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatSnackBarModule,
        BookmarkForm
      ],
      providers: [
        provideMockStore({
          initialState: {
            bookmarksState: { bookmarks: mockBookmarks }
          }
        }),
        { provide: Actions, useValue: new Actions(actions$) }
      ]

    }).compileComponents();

    fixture = TestBed.createComponent(BookmarkForm);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isEdit to false if no bookmarkId in route', () => {
    component.ngOnInit();
    expect(component.isEdit).toBeFalse();
    expect(component.newBookmark).toEqual({ title: '', url: '' });
  });

    it('should set isEdit to true and pre-fill form if bookmark exists', () => {
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.paramMap, 'get').and.returnValue('1');

    component.ngOnInit();
    expect(component.isEdit).toBeTrue();
  });


  it('should validate valid and invalid URLs correctly', () => {
    expect(component.isValidUrl('https://google.com')).toBeTrue();
    expect(component.isValidUrl('ftp://site.com')).toBeFalse();
    expect(component.isValidUrl('bad-url')).toBeFalse();
  });

  it('should show snackbar if fields are empty', () => {
    const snackSpy = spyOn(snackBar, 'open');
    component.newBookmark = { title: '', url: '' };
    component.saveBookmark();
    expect(snackSpy).toHaveBeenCalledWith('Please fill in both Title and URL', 'Close', { duration: 3000 });
  });

  it('should show snackbar for invalid URL', () => {
    const snackSpy = spyOn(snackBar, 'open');
    component.newBookmark = { title: 'Test', url: 'invalid' };
    component.saveBookmark();
    expect(snackSpy).toHaveBeenCalledWith('Url not valid!', 'Close', { duration: 3000 });
  });

  it('should dispatch addBookmark and handle success', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const snackSpy = spyOn(snackBar, 'open');
    const navigateSpy = spyOn(router, 'navigate');

    component.newBookmark = { title: 'ChatGPT', url: 'https://chat.openai.com' };
    component.saveBookmark();

    expect(dispatchSpy).toHaveBeenCalledWith(
      BookmarkActions.addBookmark({ bookmark: component.newBookmark })
    );

    actions$.next(
      BookmarkActions.addBookmarkSuccess({
        bookmark: { id: '3', title: 'ChatGPT', url: 'https://chat.openai.com', date: '2024-12-01' }
      })
    );

    expect(snackSpy).toHaveBeenCalledWith('Bookmark created!', 'Close', { duration: 3000 });
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should prevent adding duplicate URLs', () => {
    spyOn(store, 'select').and.returnValue(of(mockBookmarks));
    const snackSpy = spyOn(snackBar, 'open');

    component.newBookmark = { title: 'Duplicate', url: 'https://angular.com' };
    component.saveBookmark();

    expect(snackSpy).toHaveBeenCalledWith('Already bookmarked', 'Close', { duration: 3000 });
  });

  it('should dispatch updateBookmark and handle success', () => {
    (component as any).bookmarkId = '1';
    component.isEdit = true;
    component.newBookmark = { title: 'Updated', url: 'https://google.com' };

    const dispatchSpy = spyOn(store, 'dispatch');
    const snackSpy = spyOn(snackBar, 'open');
    const navigateSpy = spyOn(router, 'navigate');

    component.saveBookmark();

    expect(dispatchSpy).toHaveBeenCalledWith(
      BookmarkActions.updateBookmark({
        id: '1',
        changes: { title: 'Updated', url: 'https://google.com' }
      })
    );

    actions$.next(
      BookmarkActions.updateBookmarkSuccess({
        bookmark: { id: '1', title: 'Updated', url: 'https://google.com', date: '2024-12-01' }
      })
    );

    expect(snackSpy).toHaveBeenCalledWith('Bookmark updated!', 'Close', { duration: 3000 });
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should navigate back on goBackToList()', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.goBackToList();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should prevent updating bookmark to a URL that already exists', () => {
    component.isEdit = true;
    component.bookmarkId = '1';
    component.newBookmark = { title: 'Updated', url: 'https://rxjs.dev' };
    const snackSpy = spyOn(snackBar, 'open');
    spyOn(store, 'select').and.returnValue(of(mockBookmarks));

    component.saveBookmark();

    expect(snackSpy).toHaveBeenCalledWith('Already bookmarked', 'Close', { duration: 3000 });
  });

  it('should dispatch updateBookmark and show success snackbar', () => {
    component.isEdit = true;
    component.bookmarkId = '1';
    component.newBookmark = { title: 'Updated Angular', url: 'https://angular.com/updated' };

    const dispatchSpy = spyOn(store, 'dispatch');
    const snackSpy = spyOn(snackBar, 'open');
    const navigateSpy = spyOn(router, 'navigate');

    component.saveBookmark();

    expect(dispatchSpy).toHaveBeenCalledWith(
      BookmarkActions.updateBookmark({
        id: '1',
        changes: { title: 'Updated Angular', url: 'https://angular.com/updated' }
      })
    );

    actions$.next(
      BookmarkActions.updateBookmarkSuccess({
        bookmark: { id: '1', title: 'Updated Angular', url: 'https://angular.com/updated', date: '2024-12-01' }
      })
    );

    expect(snackSpy).toHaveBeenCalledWith('Bookmark updated!', 'Close', { duration: 3000 });
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
