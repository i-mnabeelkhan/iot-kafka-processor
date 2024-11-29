import { KafkaConfig } from "./config/kafka.config";

export const kafka = new KafkaConfig(["localhost:29092"]);

export const startServices = async () => {
  try {
    await kafka.connect();
    await kafka.createTopic("test-topic");
  } catch (error) {
    console.error(`\n\n❌ Error starting services: ${error}\n\n`);
    process.exit(1);
  }
};
