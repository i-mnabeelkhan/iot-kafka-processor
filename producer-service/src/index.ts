import { Hono } from "hono";
import { startServices } from "./start.services";
// routes
import postRoutes from "./services/create-post";

// initialize app
const app = new Hono();

// start services
startServices();

app.get("/", (c) => {
  return c.text("Hello Producer!");
});

app.route("/", postRoutes);

export default app;
