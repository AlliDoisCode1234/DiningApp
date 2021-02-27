import dotenv from "dotenv";
import fetch from "node-fetch";
import { STATUS_CODES } from "../../Controllers/SettingsRouterController.js";
import AccountNotFoundError from "../../Errors/AccountNotFoundError.js";
dotenv.config();

/**
 * Rest api abstraction layer
 */
export default class RestAPIService {
  static #SERVICE_BUDGET_API = process.env.SERVICE_BUDGET_API;
  static #SERVICE_ACCOUNTS_API = process.env.SERVICE_ACCOUNTS_API;
  //static #SERVICE_KNOWN_ALLERGENS_API = process.env.SERVICE_KNOWN_ALLERGENS_API;
  constructor() {}

  static #findUserAccount = async (username) => {
    let responseAndStatusCode = await fetch(
      RestAPIService.#SERVICE_ACCOUNTS_API + "/find/" + username,
      {}
    ).then(async (res) => {
      return [await res.json(), res.status];
    });

    return responseAndStatusCode;
  };

  static async findBudgetSettings({ username }) {
    //does user exist? if so, grab account
    const [account, statusCode] = await RestAPIService.#findUserAccount(
      username
    );

    if (statusCode === STATUS_CODES.GOOD_REQUEST) {
      //get settings and return settings (allergies / budget)
      return RestAPIService.#getBudgetFromAccountId(account);
    } else {
      // else throw error
      const error = new AccountNotFoundError(
        "Budget not found because could not find user ",
        "Budget not found"
      );
      throw error;
    }
  }

  static #getBudgetFromAccountId = async function getUserIdFromUsername(
    account
  ) {
    return fetch(
      RestAPIService.#SERVICE_BUDGET_API + "/findById/" + account._id
    ).then((res) => res.json());
  };
}
