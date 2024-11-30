import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { kafka } from "../start.services";

const app = new Hono();

app.post(
  "/create-post",
  zValidator("json", z.object({ title: z.string(), content: z.string() })),
  async (c) => {
    const { title, content } = c.req.valid("json");
    try {
      kafka.sendToTopic("test-topic", JSON.stringify({ title, content }));
      return c.json({ success: true, message: "Message sent to topic" });
    } catch (error) {
      console.log("\n\n❌ Error sending message to topic: ", error);
      return c.json({ success: false, message: "Error sending message" }, 500);
    }
  }
);
export default app;
