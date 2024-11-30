import { connectDb } from "./config/db.config";
import { KafkaConfig } from "./config/kafka.config";
import { postConsumer } from "./services/post-consumer";

export const startServices = async () => {
  try {
    const kafka = new KafkaConfig();
    await kafka.connect();
    await kafka.subscribeToTopic("test-topic");
    await postConsumer(kafka);
    await connectDb();
    console.log("✅ Services started");
  } catch (error) {
    console.error("\n\n❌ Error starting services: ", error);
    process.exit(1);
  }
};
