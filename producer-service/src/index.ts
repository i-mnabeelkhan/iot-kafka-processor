import { Hono } from "hono";
import { kafka, startServices } from "./start.services";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
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
