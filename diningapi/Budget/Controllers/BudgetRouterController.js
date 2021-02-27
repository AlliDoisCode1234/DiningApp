import express from "express";
import mongo from "mongodb";
import stream from "stream";
import RestAPIService from "../Services/REST/RestAPIService.js";
import UtilityIterator from "../Utility/UtilityIterator.js";
const router = express.Router();
const { Readable } = stream;
const { ObjectId } = mongo;

const STATUS_CODES = {
  BAD_REQUEST: 400,
};

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post(
  "/create",
  (
    { body: { _id, totalBudget, maxMeals, percentageOfBudgetUsable } },
    response
  ) => {
    RestAPIService.createBudget({
      _id,
      totalBudget,
      maxMeals,
      percentageOfBudgetUsable,
    })
      .then((_resolve) => {
        response.send("Created budget");
      })
      .catch((error) => {
        response.status(STATUS_CODES.BAD_REQUEST);
        const readableStream = Readable.from(
          UtilityIterator.generateIteratorFromError(error)
        );
        readableStream.pipe(response);
      });
  }
);

router.get("/findById/:id", (request, response) => {
  RestAPIService.findBudget({
    _id: new ObjectId(request.params.id),
  })
    .then((resolve) => {
      response.send(resolve);
    })
    .catch((error) => {
      response.status(STATUS_CODES.BAD_REQUEST);
      response.json(error);
    });
});

export default router;
