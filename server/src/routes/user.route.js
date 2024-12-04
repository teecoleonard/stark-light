import express from "express";
import {body} from "express-validator";
import favoriteController from "../controllers/favorite.controller.js";
import userController from "../controllers/user.controller.js";
import requestHandler from "../handlers/request.handler.js";
import userModel from "../models/user.model.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router()

router.post(
    "/signup",
    body("username")
        .exists().withMessage("Usuário necessário")
        .isLength({ min: 4 }).withMessage("Minimo de 8 caracteres necessário para o nome de usuário")
            .custom(async value => {
                const user = await userModel.findOne({ username: value });
                if (user) return Promise.reject("Nome de usuário já utilizado");
            }),
    body("password")
        .exists().withMessage("Senha necessária")
        .isLength({ min: 8 }).withMessage("Minimo de 8 caracteres necessário para a senha"),
    body("confirmPassword")
        .exists().withMessage("Senha necessária")
        .isLength({ min: 8 }).withMessage("Minimo de 8 caracteres necessário para a senha")
            .custom((value, { req }) => {
                if (value !== req.body.password) throw new Error("Senha de confirmação está errada")
                    return true
            }),
    body("displayName")
        .exists().withMessage("Nome necessário")
        .isLength({ min: 5 }).withMessage("Minimo de 8 caracteres necessário o nome"),
    requestHandler.validate,
    userController.signup
);

router.post(
    "/signin",
    body("username")
        .exists().withMessage("Usuário necessário")
        .isLength({ min: 4 }).withMessage("Minimo de 8 caracteres necessário para o nome de usuário"),
    body("password")
        .exists().withMessage("Senha necessária")
        .isLength({ min: 8 }).withMessage("Minimo de 8 caracteres necessário para a senha"),
    requestHandler.validate,
    userController.signin
);

router.put(
    "/update-password",
    tokenMiddleware.auth,
    body("password")
        .exists().withMessage("Senha necessária")
        .isLength({ min: 8 }).withMessage("Minimo de 8 caracteres necessário para a senha"),
    body("newPassword")
        .exists().withMessage("Nova senha necessária")
        .isLength({ min: 8 }).withMessage("Minimo de 8 caracteres necessário para a nova senha"),
    body("confirmNewPassword")
        .exists().withMessage("Confirmação de nova senha necessária")
        .isLength({ min: 8 }).withMessage("Minimo de 8 caracteres necessário para confirmação de nova senha")
            .custom((value, { req }) => {
                if (value !== req.body.password) throw new Error("Nova senha de confirmação está errada")
                    return true
            }),
        requestHandler.validate,
        userController.updatePassword
);

router.get(
    "/info",
    tokenMiddleware.auth,
    userController.getInfo
);

router.get(
    "/favorites",
    tokenMiddleware.auth,
    favoriteController.getFavoritesOfUser
);

router.post(
    "/favorites",
    tokenMiddleware.auth,
    body("mediatype")
        .exists().withMessage("Tipo de midia necessário")
        .custom(type => ["movie", "tv"].includes(type)).withMessage("Tipo de midia incorreto"),
    body("mediaId")
        .exists().withMessage("ID midia necessário")
        .isLength({ min: 1 }).withMessage("ID midia não pode ser vazio"),
    body("mediaTitle")
        .exists().withMessage("Titulo da midia necessário"),
    body("mediaPoster")
        .exists().withMessage("Poster de midia necessário"),
    body("mediaRate")
        .exists().withMessage("Avaliação da midia necessário"),
    requestHandler.validate,
    favoriteController.addFavorite
);

router.delete(
    "/favorites/:favoriteId",
    tokenMiddleware.auth,
    favoriteController.removeFavorite
);

export default router;