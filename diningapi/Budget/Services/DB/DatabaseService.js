import dotenv from "dotenv";
import DatabaseEntityNotFoundError from "../../../KnownAllergens/Errors/DatabaseEntityNotFoundError.js";
dotenv.config();

/**
 * Database service abstraction layer
 */
export default class DatabaseService {
  static #collectionName = process.env.SERVICE_DB_COLLECTION;

  constructor() {}

  async createBudget({ _id, totalBudget, maxMeals, percentageOfBudgetUsable }) {
    const dbResult = await __database
      .collection(DatabaseService.#collectionName)
      .insertOne({
        _id,
        totalBudget,
        maxMeals,
        percentageOfBudgetUsable,
      });

    return dbResult;
  }

  async findBudget({ _id }) {
    const myCursor = await __database
      .collection(DatabaseService.#collectionName)
      .find({ _id });

    const myDocument = myCursor.hasNext() ? await myCursor.next() : null;

    if (myDocument === null) {
      throw new DatabaseEntityNotFoundError();
    }

    return myDocument;
  }

  static setupDatabase(db) {
    __database = db;
  }
}
