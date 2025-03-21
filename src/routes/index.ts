import Router from "express";
import createUser from "../controllers/index";

const apiRoutes = Router();

apiRoutes.route("/signup").post(createUser);

export default apiRoutes;