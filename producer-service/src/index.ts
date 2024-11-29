import { Hono } from "hono";
import { kafka, startServices } from "./start.services";

// initialize app
const app = new Hono();

// start services
startServices();

app.get("/", (c) => {
  return c.text("Hello Producer!");
});

app.post("/produce-message", async (c) => {
  const { message } = await c.req.json();
  if (!message) {
    return c.json({ message: "Message is required" }, 400);
  }
  try {
    await kafka.produceMessage("test-topic", [{ value: message }]);
    return c.json({ success: true, message: "Message produced" });
  } catch (error) {
    return c.json(
      { success: false, message: `Error producing message: ${error}` },
      500
    );
  }
});

export default app;
