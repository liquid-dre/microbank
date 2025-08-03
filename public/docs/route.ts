import express from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const swaggerDocument = YAML.load(path.join(process.cwd(), 'app/api/docs/swagger.yaml'));

const app = express();
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));