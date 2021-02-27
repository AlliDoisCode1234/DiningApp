import dotenv from "dotenv";
import mongodb from "mongodb";
dotenv.config();
const { ObjectID } = mongodb;
/**
 * Database service abstraction layer
 */
export default class DatabaseService {
  static #collectionName = process.env.SERVICE_DB_COLLECTION;
  constructor() {}

  async findAllergy({ _id }) {
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
