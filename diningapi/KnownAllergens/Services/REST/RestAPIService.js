import DatabaseService from "../DB/DatabaseService.js";

/**
 * Rest api abstraction layer
 */
export default class RestAPIService {
  static #DB_SERVICE = new DatabaseService();
  constructor() {}

  static async findAllergy({ _id }) {
    return RestAPIService.#DB_SERVICE.findAllergy({ _id });
  }
}
