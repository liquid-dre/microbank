import { readdirSync, statSync } from "fs";
import path from "path";

const apiRoot = path.join(process.cwd(), "app/services");

function findRoutes(dir) {
  const items = readdirSync(dir);
  let routes = [];

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      routes = routes.concat(findRoutes(fullPath));
    } else if (item === "route.ts" || item === "route.js") {
      const relative = fullPath
        .replace(process.cwd(), "")
        .replace(/\\/g, "/")
        .replace("/app", "");
      routes.push(relative.replace("/route.ts", ""));
    }
  }

  return routes;
}

const routes = findRoutes(apiRoot);

console.log("🔹 API Endpoints Found:");
routes.forEach((route) => console.log(`- ${route}`));