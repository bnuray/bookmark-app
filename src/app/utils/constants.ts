export const DATES = {
  TODAY: "today",
  YESTERDAY: "yesterday",
  OLDER: "older",
} as const;

export const BOOKMARK_MESSAGES = {
  FILL_FIELDS: 'Please fill in both Title and URL',
  INVALID_URL: 'Url not valid!',
  ALREADY_BOOKMARKED: 'Already bookmarked',
  BOOKMARK_NOT_FOUND: 'Bookmark not found',
  BOOKMARK_CREATED: 'Bookmark created!',
  BOOKMARK_UPDATED: 'Bookmark updated!',
  BOOKMARK_FAILED: 'Failed',
} as const;

export const EMPTY_MESSAGES = {
  TODAY: 'No bookmarks found for today.',
  YESTERDAY: 'No bookmarks found for yesterday.',
  OLDER: 'No older bookmarks found.'
} as const;

export const ACTIONS = {
  CLOSE: 'Close'
} as const;