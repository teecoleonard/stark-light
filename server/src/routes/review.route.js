import express from "express";
import {body} from "express-validator";
import reviewController from "../controllers/review.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router({ mergeParams: true });

router.get(
    "/",
    tokenMiddleware.auth,
    reviewController.getReviewOfUser
);

router.post(
    "/",
    tokenMiddleware.auth,
    body("mediaId")
        .exists().withMessage("ID midia necessário")
        .isLength({ min: 8 }).withMessage("ID midia não pode ser vazio"),
    body("content")
        .exists().withMessage("Conteúdo necessário")
        .isLength({ min: 8 }).withMessage("Conteúdo não pode ser vazio"),
    body("mediatype")
        .exists().withMessage("Tipo de midia necessário")
        .custom(type => ["movie", "tv"].includes(type)).withMessage("Tipo de midia incorreto"),
    body("mediaTitle")
        .exists().withMessage("Titulo da midia necessário"),
    body("mediaPoster")
        .exists().withMessage("Poster de midia necessário"),
    requestHandler.validate,
    reviewController.create
);

router.delete(
    "/:reviewId",
    tokenMiddleware.auth,
    reviewController.remove
);

export default router;