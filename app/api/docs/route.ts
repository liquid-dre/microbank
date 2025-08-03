import { NextRequest } from "next/server";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { Readable } from "stream";

// Load swagger YAML
const swaggerDocument = YAML.load(
	path.join(process.cwd(), "public/docs/swagger.yaml")
);

export async function GET(req: NextRequest) {
	// Render the Swagger HTML manually using swagger-ui-dist
	const swaggerUiAssetPath = require("swagger-ui-dist").absolutePath();
	const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <title>API Docs</title>
      <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui.css" />
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui-bundle.js"></script>
      <script>
        window.onload = function() {
          window.ui = SwaggerUIBundle({
            url: '/docs/swagger.yaml',
            dom_id: '#swagger-ui',
          });
        }
      </script>
    </body>
    </html>
  `;
	return new Response(Readable.from([html]) as any, {
		headers: { "Content-Type": "text/html" },
	});
}
