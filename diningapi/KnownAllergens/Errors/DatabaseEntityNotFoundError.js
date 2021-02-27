import dotenv from "dotenv";
dotenv.config();

const errorMessage = `${process.env.SERVICE_ENTITY_TYPE} not found`;
const errorName = `${process.env.SERVICE_ENTITY_TYPE} not found`;

export default class DatabaseEntityNotFoundError extends Error {
  constructor() {
    super(errorMessage);
    super.name = errorName;
  }
}
