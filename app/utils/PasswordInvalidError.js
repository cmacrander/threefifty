export default class PasswordInvalidError extends Error {
  constructor(message = '') {
    super(message);
    this.message = message;
    this.name = 'PasswordInvalidError';
  }
}
