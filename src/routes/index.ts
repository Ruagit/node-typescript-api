import Router from "express";
import { createUser, getUserById } from "../controllers/index";

const apiRoutes = Router();

apiRoutes.route("/signup").post(createUser);
apiRoutes.route("/user/:id").get(getUserById);

export default apiRoutes;