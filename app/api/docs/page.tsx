import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();

// Load Swagger YAML
const swaggerDocument = YAML.load(
  path.join(process.cwd(), "public/docs/swagger.yaml")
);

// Serve docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;