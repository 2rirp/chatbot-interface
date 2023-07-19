import App from "./app";

import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });

const app = new App();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "localhost";

app.server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
