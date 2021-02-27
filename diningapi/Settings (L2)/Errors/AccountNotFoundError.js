export default class AccountNotFoundError extends Error {
  constructor(message, name) {
    super(message);
    super.name = name;
  }
}
