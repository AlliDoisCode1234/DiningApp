import dotenv from "dotenv";
import mongo from "mongodb";
import DatabaseEntityNotFoundError from "../../../KnownAllergens/Errors/DatabaseEntityNotFoundError.js";
import DatabaseEntityFoundError from "../../Errors/DatabaseEntityFoundError.js";
dotenv.config();

const { ObjectID } = mongo;

/**
 * Database service abstraction layer
 */
export default class DatabaseService {
  static #collectionName = process.env.SERVICE_DB_COLLECTION;
  constructor() {}

  async createAccount({ name, username }) {
    const dbResult = await __database
      .collection(DatabaseService.#collectionName)
      .insertOne({
        username,
        name,
      });

    return dbResult;
  }

  async findAccountThrowIfNotFound({ username }) {
    const myCursor = await __database
      .collection(DatabaseService.#collectionName)
      .find({ username });

    const myDocument = myCursor.hasNext() ? await myCursor.next() : null;

    if (myDocument === null) {
      throw new DatabaseEntityNotFoundError();
    }

    return myDocument;
  }

  async findAccountThrowIfFound({ username }) {
    const myCursor = await __database
      .collection(DatabaseService.#collectionName)
      .find({ username });

    const myDocument = myCursor.hasNext() ? await myCursor.next() : null;

    if (myDocument !== null) {
      throw new DatabaseEntityFoundError();
    }

    return myDocument;
  }

  async findAccountById({ _id }) {
    const myCursor = await __database
      .collection(DatabaseService.#collectionName)
      .find({ _id: ObjectID(_id) });

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
