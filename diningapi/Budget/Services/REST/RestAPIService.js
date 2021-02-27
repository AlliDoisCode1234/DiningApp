import DatabaseService from "../DB/DatabaseService.js";

/**
 * Rest api abstraction layer
 */
export default class RestAPIService {
  static #DB_SERVICE = new DatabaseService();
  constructor() {}

  static async createBudget(budget) {
    return RestAPIService.#DB_SERVICE.createBudget(budget);
  }

  static async findBudget({ _id }) {
    return RestAPIService.#DB_SERVICE.findBudget({ _id });
  }
}
