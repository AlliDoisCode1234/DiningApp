import express from "express";
import stream from "stream";
import UtilityIterator from "../../Accounts/Utility/UtilityIterator.js";
import RestAPIService from "../Services/REST/RestAPIService.js";
const router = express.Router();
const { Readable } = stream;

const STATUS_CODES = {
  BAD_REQUEST: 400,
  GOOD_REQUEST: 200,
};

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/find/:username", async (request, response) => {
  try {
    response.send(
      await RestAPIService.findBudgetSettings({
        username: request.params.username,
      })
    );
    return;
  } catch (error) {
    response.status(STATUS_CODES.BAD_REQUEST);
    const readableStream = Readable.from(
      UtilityIterator.generateIteratorFromError(error)
    );
    readableStream.pipe(response);
    return;
  }
});

export default router;
export { STATUS_CODES };
