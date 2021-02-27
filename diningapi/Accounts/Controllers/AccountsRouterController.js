import express from "express";
import stream from "stream";
import RestAPIService from "../Services/REST/RestAPIService.js";
import UtilityIterator from "../Utility/UtilityIterator.js";
const router = express.Router();
const { Readable } = stream;

const STATUS_CODES = {
  BAD_REQUEST: 400,
};

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/create", ({ body: { username, name } }, response) => {
  RestAPIService.createAccount({
    username,
    name,
  })
    .then((_resolve) => {
      response.send("Created user");
    })
    .catch((error) => {
      response.status(STATUS_CODES.BAD_REQUEST);
      const readableStream = Readable.from(
        UtilityIterator.generateIteratorFromError(error)
      );
      readableStream.pipe(response);
    });
});

router.get("/find/:username", (request, response) => {
  RestAPIService.findAccount({
    username: request.params.username,
  })
    .then((resolve) => {
      response.json(resolve);
    })
    .catch((error) => {
      response.status(STATUS_CODES.BAD_REQUEST);
      response.json({
        errorName: error.name,
        errorMessage: error.message,
        stack: error.stack,
      });
    });
});

router.get("/findById/:id", (request, response) => {
  RestAPIService.findAccountById({
    _id: request.params.id,
  })
    .then((resolve) => {
      response.json(resolve);
    })
    .catch((error) => {
      response.status(STATUS_CODES.BAD_REQUEST);
      response.json({
        errorName: error.name,
        errorMessage: error.message,
        stack: error.stack,
      });
    });
});
export default router;
