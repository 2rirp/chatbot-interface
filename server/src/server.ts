/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import express from "express";
import routes from "./routes";
import dotenv from "dotenv";
dotenv.config();

const app : express.Application = express();
const port = process.env.PORT || 5000;


app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});