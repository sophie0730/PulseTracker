/* eslint-disable max-classes-per-file */
class DuplicateError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DuplicateDashboardNameError';
    this.duplicateItem = message;
  }
}

class FileNotExistError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FileNotExistError';
    this.message = message;
  }
}

class WritingFileError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WritingFileError';
    this.message = message;
  }
}

export { DuplicateError, FileNotExistError, WritingFileError };
