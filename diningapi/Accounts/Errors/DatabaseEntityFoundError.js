import dotenv from "dotenv";
dotenv.config();

const errorMessage = `${process.env.SERVICE_ENTITY_TYPE} found already`;
const errorName = `${process.env.SERVICE_ENTITY_TYPE} found already`;

export default class DatabaseEntityNotFoundError extends Error {
  constructor() {
    super(errorMessage);
    super.name = errorName;
  }
}
