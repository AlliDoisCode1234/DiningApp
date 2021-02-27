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

router.get("/findById/:id", (request, response) => {
  RestAPIService.findAllergy({
    _id: request.params.id,
  })
    .then((resolve) => {
      response.send(resolve);
    })
    .catch((error) => {
      response.status(STATUS_CODES.BAD_REQUEST);
      const readableStream = Readable.from(
        UtilityIterator.generateIteratorFromError(error)
      );
      readableStream.pipe(response);
    });
});

export default router;
