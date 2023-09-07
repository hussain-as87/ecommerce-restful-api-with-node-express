import express from "express";
import {validationparmsRules} from "../middlewares/ValidatorMiddleware.js";
import {
    activeLoggedUserData,
    changePassword,
    create,
    deleteLoggedUserData,
    destroy,
    getLoggedUserData,
    index,
    resizeImage,
    show,
    update,
    updateLoggedUserData,
    updateLoggedUserPassword,
    uploadImage,
} from "../services/UserService.js";
import {
    ValidationbodyRulesForCreate,
    ValidationbodyRulesForUpdate,
    changePasswordValidator,
} from "./validations/UserValidation.js";
import {permissions} from "../services/AuthService.js";

const router = express.Router();

router.get("/get", getLoggedUserData, show);
router.put("/changeMyPassword", updateLoggedUserPassword);
router.put(
    "/update",
    [uploadImage, resizeImage],
    ValidationbodyRulesForUpdate,
    updateLoggedUserData
);
router.delete("/delete", deleteLoggedUserData);
router.put("/active", activeLoggedUserData);

router.get("/", permissions("admin"), index);
router.get("/:id", permissions("admin"), validationparmsRules("id"), show);
router.post(
    "/",
    permissions("admin"),
    [uploadImage, resizeImage],
    ValidationbodyRulesForCreate,
    create
);
router.put(
    "/:id",
    permissions("admin"),
    [validationparmsRules("id"), uploadImage, resizeImage],
    ValidationbodyRulesForUpdate,
    update
);
router.put("/changePassword/:id", changePasswordValidator, changePassword);
router.delete("/:id", permissions("admin"), validationparmsRules("id"), destroy);

export default router;
