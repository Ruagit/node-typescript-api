import express, { Express } from 'express';
import apiRoutes from "./routes/index";

const app: Express = express();

app.use(express.json());

app.use("/api", apiRoutes);

export default app;