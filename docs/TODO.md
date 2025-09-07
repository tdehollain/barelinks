# TODO List

## Frontend

- [ ] Tags management
  - tsc error in TagModal
  - tag delete button should be visible only when displayed next to the link
  - list of existing tags: count should be displayed in brackets in the tag

## Backend

- [ ] Add logic to handle duplicate URLs when user tries to add a URL that already exists in the database
  - Decide behavior: prevent duplicate, show existing, or allow per-user duplicates
  - Implement appropriate database constraints and error handling
