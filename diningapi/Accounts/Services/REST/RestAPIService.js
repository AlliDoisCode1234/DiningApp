import DatabaseService from "./../DB/DatabaseService.js";

/**
 * Rest api abstraction layer
 */
export default class RestAPIService {
  static #DB_SERVICE = new DatabaseService();
  constructor() {}

  static async createAccount(account) {
    await RestAPIService.#DB_SERVICE.findAccountThrowIfFound(account);
    await RestAPIService.#DB_SERVICE.createAccount(account);
  }

  static async findAccount(account) {
    return RestAPIService.#DB_SERVICE.findAccountThrowIfNotFound(account);
  }

  static async findAccountById(_id) {
    return RestAPIService.#DB_SERVICE.findAccountById(_id);
  }

  static async deleteAccountById(_id) {
    return RestAPIService.#DB_SERVICE.findAccountById(_id) && RestAPIService.#DB_SERVICE.deleteAccount(_account);
    
    
  }
}
